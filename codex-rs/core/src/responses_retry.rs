//! Shared retry and transport fallback decisions for Responses requests.
//! Content-filter guidance is recorded for sampling requests before retry decisions.
//! Custom persistent recovery retains fast retries, then waits until the provider recovers.

use std::time::Duration;

use crate::client::ModelClientSession;
use crate::context::ContentFilterGuidance;
use crate::context::ContextualUserFragment;
use crate::session::session::Session;
use crate::session::step_context::StepContext;
use crate::session::turn_context::TurnContext;
use codex_client::RetryOperation;
use codex_features::Feature;
use codex_http_client::RetryAfter;
use codex_protocol::error::CodexErr;
use codex_protocol::error::CodexErrorDetails;
use codex_protocol::protocol::EventMsg;
use codex_protocol::protocol::WarningEvent;
use tokio::time::Instant;
use tracing::warn;

const INITIAL_CONNECTION_RETRY_DELAY: Duration = Duration::from_secs(5);
const MAX_CONNECTION_RETRY_DELAY: Duration = Duration::from_secs(60);
const INITIAL_PROVIDER_RECOVERY_DELAY: Duration = Duration::from_secs(15);
pub(crate) const MAX_PROVIDER_RECOVERY_DELAY: Duration = Duration::from_secs(300);

/// Only errors produced by the remote model request belong in persistent recovery.
/// User cancellation, local policy, invalid local state and context repair retain their semantics.
pub(crate) fn is_provider_failure(err: &CodexErr) -> bool {
    matches!(
        err.details(),
        CodexErrorDetails::ConnectionFailed(_)
            | CodexErrorDetails::UnexpectedStatus(_)
            | CodexErrorDetails::ResponseStreamFailed(_)
            | CodexErrorDetails::Stream(_)
            | CodexErrorDetails::RequestTimeout
            | CodexErrorDetails::Timeout
            | CodexErrorDetails::RetryLimit(_)
            | CodexErrorDetails::InternalServerError
            | CodexErrorDetails::ServerOverloaded
            | CodexErrorDetails::PolicyCapacityUnavailable
            | CodexErrorDetails::RateLimitExceeded(_)
            | CodexErrorDetails::QuotaExceeded
            | CodexErrorDetails::UsageLimitReached(_)
            | CodexErrorDetails::UsageNotIncluded
            | CodexErrorDetails::ModelNotFound { .. }
            | CodexErrorDetails::InvalidRequest(_)
            | CodexErrorDetails::ResponseIncomplete(_)
            | CodexErrorDetails::RefreshTokenFailed(_)
            | CodexErrorDetails::GatewayLoginRequired(_)
            | CodexErrorDetails::WorkspaceAccessDenied(_)
            | CodexErrorDetails::AccessProgramNotEnabled(_)
            | CodexErrorDetails::FlexUnavailable
    )
}

pub(crate) fn persistent_provider_retries(turn: &TurnContext) -> bool {
    turn.config
        .features
        .enabled(Feature::PersistentProviderRetries)
}

/// Returns a deadline capped across both server advice and local backoff.
fn bounded_retry_deadline(advice: Option<RetryAfter>, delay: Duration) -> Instant {
    let now = Instant::now();
    advice
        .map(RetryAfter::deadline)
        .unwrap_or(now + delay)
        .min(now + MAX_PROVIDER_RECOVERY_DELAY)
}

#[derive(Debug, Clone, Copy)]
pub(crate) enum ResponsesStreamRequest {
    Sampling,
    RemoteCompactionV2,
}

pub(crate) struct ResponsesStreamRetryState {
    retries: u64,
    connection_retries: u64,
    connection_retry_delay: Duration,
    provider_recovery_attempts: u64,
    provider_recovery_delay: Duration,
}

impl Default for ResponsesStreamRetryState {
    fn default() -> Self {
        Self {
            retries: 0,
            connection_retries: 0,
            connection_retry_delay: INITIAL_CONNECTION_RETRY_DELAY,
            provider_recovery_attempts: 0,
            provider_recovery_delay: INITIAL_PROVIDER_RECOVERY_DELAY,
        }
    }
}

impl ResponsesStreamRetryState {
    pub(crate) fn is_recovering_provider(&self) -> bool {
        self.provider_recovery_attempts > 0
    }

    fn next_provider_recovery_delay(&mut self) -> Duration {
        let delay = self.provider_recovery_delay;
        self.provider_recovery_attempts = self.provider_recovery_attempts.saturating_add(1);
        self.provider_recovery_delay = delay.saturating_mul(2).min(MAX_PROVIDER_RECOVERY_DELAY);
        delay
    }

    /// The caller must poll this future under its turn/background cancellation token.
    pub(crate) async fn recover_provider(
        &mut self,
        sess: &Session,
        turn: &TurnContext,
        err: CodexErr,
        request: ResponsesStreamRequest,
    ) -> Result<(), CodexErr> {
        if !persistent_provider_retries(turn) || !is_provider_failure(&err) {
            return Err(err);
        }
        let delay = self.next_provider_recovery_delay();
        // Short or expired advice must not turn persistent recovery into a busy loop.
        let advice = err
            .retry_after()
            .filter(|advice| advice.remaining_delay() > delay);
        let retry_at = bounded_retry_deadline(advice, delay);
        let wait = retry_at.saturating_duration_since(Instant::now());
        warn!(turn_id = %turn.sub_id, attempt = self.provider_recovery_attempts,
            retry_delay_ms = wait.as_millis(), error = %err, "waiting for model provider recovery");
        let attempt = self.provider_recovery_attempts;
        let seconds = wait.as_secs_f64().ceil() as u64;
        let message = format!(
            "Reconnecting... waiting for provider recovery (attempt {attempt}, next retry in {seconds}s; stop to cancel)"
        );
        sess.notify_stream_error(turn, message, err).await;
        let operation = match request {
            ResponsesStreamRequest::Sampling => RetryOperation::Sampling,
            ResponsesStreamRequest::RemoteCompactionV2 => RetryOperation::RemoteCompactionV2,
        };
        codex_client::record_retry!(self.provider_recovery_attempts, wait, operation);
        tokio::time::sleep_until(retry_at).await;
        Ok(())
    }
}

/// Server retry advice retained after stream retries are exhausted. The turn ID
/// prevents a reused Guardian session from applying advice from an earlier review.
pub(crate) struct ExhaustedResponseRetry {
    pub(crate) turn_id: String,
    pub(crate) retry_at: Option<tokio::time::Instant>,
}

/// Returns `Ok(())` when the caller should retry the request loop, or the original error when
/// it is terminal or the retry budget is exhausted.
#[tracing::instrument(level = "trace", skip_all, fields(request = ?request))]
pub(crate) async fn handle_response_stream_error(
    retry_state: &mut ResponsesStreamRetryState,
    max_retries: u64,
    err: CodexErr,
    client_session: &mut ModelClientSession,
    sess: &Session,
    step_context: &StepContext,
    request: ResponsesStreamRequest,
) -> Result<(), CodexErr> {
    let turn_context = &step_context.turn;
    if matches!(request, ResponsesStreamRequest::Sampling)
        && matches!(err.details(), CodexErrorDetails::ContentFilter)
    {
        let model_info = &step_context.settings.model_info;
        let guidance = ContentFilterGuidance {
            text: codex_prompts::ResolvedModelMessages::from_model(model_info)
                .content_filter_guidance()
                .to_string(),
        };
        sess.record_conversation_items(
            turn_context,
            model_info,
            &[ContextualUserFragment::into(guidance)],
        )
        .await;
    }
    let operation = match request {
        ResponsesStreamRequest::Sampling => RetryOperation::Sampling,
        ResponsesStreamRequest::RemoteCompactionV2 => RetryOperation::RemoteCompactionV2,
    };
    let retry_count = retry_state.retries.saturating_add(1);
    let persistent = persistent_provider_retries(turn_context);
    // Once slow recovery starts, do not restart the fast retry budget on every failure.
    if retry_state.is_recovering_provider() {
        return retry_state
            .recover_provider(sess, turn_context, err, request)
            .await;
    }
    let Some(delay) = err.retry_delay(retry_count) else {
        return retry_state
            .recover_provider(sess, turn_context, err, request)
            .await;
    };
    let retry_after = err.retry_after();

    if turn_context
        .config
        .features
        .enabled(Feature::UnboundedConnectionRetries)
        && matches!(request, ResponsesStreamRequest::Sampling)
        && matches!(err.details(), CodexErrorDetails::ConnectionFailed(_))
        && !turn_context.session_source.is_internal()
        && !turn_context.provider.info().is_amazon_bedrock()
    {
        let retry_delay = retry_state.connection_retry_delay;
        warn!(
            turn_id = %turn_context.sub_id,
            error = %err,
            ?retry_delay,
            "stream connection failed; waiting to retry"
        );
        sess.notify_stream_error(turn_context, "Reconnecting... waiting for network", err)
            .await;
        retry_state.connection_retries = retry_state.connection_retries.saturating_add(1);
        codex_client::record_retry!(retry_state.connection_retries, retry_delay, operation);
        tokio::time::sleep(retry_delay).await;
        retry_state.connection_retry_delay = retry_delay
            .saturating_mul(2)
            .min(MAX_CONNECTION_RETRY_DELAY);
        return Ok(());
    }

    let requires_http_fallback = err.requires_http_fallback();
    let switched = (requires_http_fallback || retry_state.retries >= max_retries)
        && client_session.try_switch_fallback_transport(
            &turn_context.session_telemetry,
            turn_context.model_info(),
        );
    if switched {
        // Changing transport must not bypass the server's retry deadline.
        if let Some(retry_after) = retry_after {
            tokio::time::sleep_until(if persistent {
                bounded_retry_deadline(Some(retry_after), delay)
            } else {
                retry_after.deadline()
            })
            .await;
        }
        sess.send_event(
            turn_context,
            EventMsg::Warning(WarningEvent {
                message: format!("Falling back from WebSockets to HTTPS transport. {err:#}"),
            }),
        )
        .await;
    }
    // Another request can already have switched this session to HTTP.
    if switched || requires_http_fallback {
        retry_state.retries = 0;
        return Ok(());
    }

    if retry_state.retries < max_retries {
        retry_state.retries = retry_count;
        log_retry(request, turn_context, &err, retry_count, max_retries, delay);

        // In release builds, hide the first websocket retry notification to reduce noisy
        // transient reconnect messages. In debug builds, keep full visibility for diagnosis.
        let report_error = retry_count > 1
            || cfg!(debug_assertions)
            || !sess.services.model_client.responses_websocket_enabled();
        if report_error {
            // Surface retry information to any UI/front-end so the user understands what is
            // happening instead of staring at a seemingly frozen screen.
            sess.notify_stream_error(
                turn_context,
                format!("Reconnecting... {retry_count}/{max_retries}"),
                err,
            )
            .await;
        }
        // Use one clock sample so local backoff telemetry retains the selected delay.
        let now = Instant::now();
        let retry_at = if persistent {
            bounded_retry_deadline(retry_after, delay)
        } else {
            retry_after.map(RetryAfter::deadline).unwrap_or(now + delay)
        };
        let delay = retry_at.saturating_duration_since(now);
        codex_client::record_retry!(retry_count, delay, operation);
        tokio::time::sleep_until(retry_at).await;
        return Ok(());
    }

    if persistent && is_provider_failure(&err) {
        return retry_state
            .recover_provider(sess, turn_context, err, request)
            .await;
    }
    sess.services
        .thread_extension_data
        .insert(ExhaustedResponseRetry {
            turn_id: turn_context.sub_id.clone(),
            retry_at: retry_after.map(RetryAfter::deadline),
        });
    Err(err)
}

fn log_retry(
    request: ResponsesStreamRequest,
    turn_context: &TurnContext,
    err: &CodexErr,
    retries: u64,
    max_retries: u64,
    delay: Duration,
) {
    match request {
        ResponsesStreamRequest::Sampling => {
            warn!(
                turn_id = %turn_context.sub_id,
                retries,
                max_retries,
                sampling_error = %err,
                "stream disconnected - retrying sampling request ({retries}/{max_retries} in {delay:?})...",
            );
        }
        ResponsesStreamRequest::RemoteCompactionV2 => {
            warn!(
                turn_id = %turn_context.sub_id,
                retries,
                max_retries,
                compact_error = %err,
                "remote compaction v2 stream failed; retrying request after delay"
            );
        }
    }
}

#[cfg(test)]
#[path = "responses_retry_tests.rs"]
mod tests;
