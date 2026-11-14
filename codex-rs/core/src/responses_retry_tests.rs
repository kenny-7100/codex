use super::ResponsesStreamRequest;
use super::ResponsesStreamRetryState;
use super::handle_response_stream_error;
use super::log_retry;
use crate::realtime_history::RealtimeHistoryState;
use crate::session::step_context::StepContext;
use crate::session::tests::make_session_and_context;
use codex_http_client::RetryAfter;
use codex_protocol::error::CodexErr;
use std::sync::Arc;
use std::time::Duration;
use tokio::sync::Mutex;
use tokio::time::Instant;
use tracing_test::internal::MockWriter;

#[tokio::test]
async fn sampling_retry_logs_stream_error_context() {
    let (_session, turn_context) = make_session_and_context().await;
    let buffer: &'static std::sync::Mutex<Vec<u8>> =
        Box::leak(Box::new(std::sync::Mutex::new(Vec::new())));
    let subscriber = tracing_subscriber::fmt()
        .with_ansi(false)
        .with_max_level(tracing::Level::WARN)
        .with_writer(MockWriter::new(buffer))
        .finish();
    let _subscriber_guard = tracing::subscriber::set_default(subscriber);

    log_retry(
        ResponsesStreamRequest::Sampling,
        &turn_context,
        &CodexErr::Stream("websocket closed by server before response.completed".to_string()),
        /*retries*/ 2,
        /*max_retries*/ 5,
        Duration::from_secs(1),
    );

    let logs = String::from_utf8(
        buffer
            .lock()
            .unwrap_or_else(std::sync::PoisonError::into_inner)
            .clone(),
    )
    .expect("retry log should be valid utf-8");
    assert!(logs.contains("stream disconnected - retrying sampling request"));
    assert!(logs.contains(&format!("turn_id={}", turn_context.sub_id)));
    assert!(logs.contains("retries=2"));
    assert!(logs.contains("max_retries=5"));
    assert!(logs.contains(
        "sampling_error=stream disconnected before completion: websocket closed by server before response.completed"
    ));
}

/// Time spent reporting a retry must count toward the server's original deadline.
#[tokio::test]
#[expect(
    clippy::await_holding_invalid_type,
    reason = "test holds the event-delivery lock to delay notification while virtual time advances"
)]
async fn stream_retry_preserves_deadline_across_delayed_notification() {
    let (mut session, turn_context) = make_session_and_context().await;
    let step_context = StepContext::for_test(Arc::new(turn_context));
    session.realtime_history = Some(Mutex::new(RealtimeHistoryState::default()));
    let mut client_session = session.services.model_client.new_session();
    // The second retry emits a notification even when release builds hide the first.
    let mut retry_state = ResponsesStreamRetryState {
        retries: 1,
        ..Default::default()
    };

    tokio::time::pause();
    let advice = RetryAfter::from_delay(Duration::from_secs(10)).expect("retry deadline");
    tokio::time::advance(Duration::from_secs(4)).await;

    // Hold the event-delivery lock so reporting the error consumes part of the deadline.
    let history_guard = session.realtime_history.as_ref().unwrap().lock().await;
    let retry = handle_response_stream_error(
        &mut retry_state,
        /*max_retries*/ 2,
        CodexErr::InternalServerError.with_retry_after(advice),
        &mut client_session,
        &session,
        &step_context,
        ResponsesStreamRequest::Sampling,
    );
    tokio::pin!(retry);
    assert!(futures::poll!(&mut retry).is_pending());
    tokio::time::advance(Duration::from_secs(4)).await;
    drop(history_guard);

    assert!(futures::poll!(&mut retry).is_pending());
    tokio::time::advance(Duration::from_secs(1)).await;
    assert!(futures::poll!(&mut retry).is_pending());
    retry.await.expect("retry should be allowed");
    // Tokio rounds timer deadlines up to the next millisecond.
    let resumed_at = Instant::now();
    assert!(
        (advice.deadline()..=advice.deadline() + Duration::from_millis(1)).contains(&resumed_at),
        "retry resumed at {resumed_at:?}, expected {advice:?}"
    );
}

#[test]
fn provider_recovery_backoff_has_no_attempt_limit_and_caps_at_five_minutes() {
    let mut state = ResponsesStreamRetryState::default();
    for seconds in [15, 30, 60, 120, 240, 300, 300] {
        assert_eq!(
            state.next_provider_recovery_delay(),
            Duration::from_secs(seconds)
        );
    }
    state.provider_recovery_attempts = u64::MAX;
    for _ in 0..1000 {
        assert_eq!(
            state.next_provider_recovery_delay(),
            Duration::from_secs(300)
        );
    }
    assert_eq!(state.provider_recovery_attempts, u64::MAX);
}

#[tokio::test(start_paused = true)]
async fn provider_recovery_caps_server_retry_advice() {
    let now = Instant::now();
    let advice = RetryAfter::from_delay(Duration::from_secs(3600)).expect("retry should succeed");
    assert_eq!(
        super::bounded_retry_deadline(Some(advice), Duration::from_secs(15)),
        now + Duration::from_secs(300)
    );
    assert_eq!(
        super::bounded_retry_deadline(None, Duration::from_secs(15)),
        now + Duration::from_secs(15)
    );
}

#[test]
fn provider_recovery_preserves_local_and_cancellation_errors() {
    for err in [
        CodexErr::TurnAborted,
        CodexErr::Interrupted,
        CodexErr::ContextWindowExceeded,
        CodexErr::SessionBudgetExceeded,
        CodexErr::Fatal("local failure".into()),
    ] {
        assert!(!super::is_provider_failure(&err), "{err}");
    }
    for err in [
        CodexErr::InternalServerError,
        CodexErr::RequestTimeout,
        CodexErr::QuotaExceeded,
        CodexErr::Stream("connection reset".into()),
    ] {
        assert!(super::is_provider_failure(&err), "{err}");
    }
}

#[tokio::test]
async fn provider_recovery_is_opt_in() {
    let (session, turn_context) = make_session_and_context().await;
    let mut state = ResponsesStreamRetryState::default();
    let err = state
        .recover_provider(
            &session,
            &turn_context,
            CodexErr::QuotaExceeded,
            ResponsesStreamRequest::Sampling,
        )
        .await
        .expect_err("disabled by default");
    assert!(matches!(
        err.details(),
        codex_protocol::error::CodexErrorDetails::QuotaExceeded
    ));
    assert_eq!(state.provider_recovery_attempts, 0);
}

#[tokio::test]
async fn exhausted_fast_retries_enter_cancellable_recovery() {
    let (session, mut turn_context) = make_session_and_context().await;
    Arc::make_mut(&mut turn_context.config)
        .features
        .enable(codex_features::Feature::PersistentProviderRetries)
        .expect("unconstrained test feature");
    let step_context = StepContext::for_test(Arc::new(turn_context));
    let mut client = session.services.model_client.new_session();
    // Exhaustion is measured after the existing WebSocket -> HTTP fallback.
    client.try_switch_fallback_transport(
        &step_context.turn.session_telemetry,
        step_context.turn.model_info(),
    );
    let mut state = ResponsesStreamRetryState::default();
    tokio::time::pause();
    let started = Instant::now();
    handle_response_stream_error(
        &mut state,
        0,
        CodexErr::InternalServerError,
        &mut client,
        &session,
        &step_context,
        ResponsesStreamRequest::Sampling,
    )
    .await
    .expect("retry should succeed");
    assert!(Instant::now() - started >= Duration::from_secs(15));
    assert_eq!(state.provider_recovery_attempts, 1);
    use codex_async_utils::OrCancelExt;
    let token = tokio_util::sync::CancellationToken::new();
    let retry = state.recover_provider(
        &session,
        &step_context.turn,
        CodexErr::QuotaExceeded,
        ResponsesStreamRequest::Sampling,
    );
    let retry = retry.or_cancel(&token);
    tokio::pin!(retry);
    assert!(futures::poll!(&mut retry).is_pending());
    token.cancel();
    assert!(retry.await.is_err());
}

#[tokio::test(start_paused = true)]
async fn persistent_http_retry_caps_long_retry_after() {
    let started = Instant::now();
    let result = codex_client::run_with_retry(
        codex_client::RetryPolicy {
            max_attempts: 1,
            base_delay: Duration::from_millis(200),
            max_delay: Some(super::MAX_PROVIDER_RECOVERY_DELAY),
            retry_on: codex_client::RetryOn {
                retry_429: false,
                retry_5xx: true,
                retry_transport: false,
            },
        },
        || codex_http_client::Request::new(http::Method::POST, "http://localhost/responses".into()),
        |_, attempt| {
            if attempt == 1 {
                assert!(
                    (Duration::from_secs(300)..=Duration::from_millis(300001))
                        .contains(&(Instant::now() - started))
                );
            }
            std::future::ready(Err::<(), _>(codex_http_client::TransportError::Http {
                status: http::StatusCode::SERVICE_UNAVAILABLE,
                retry_after: RetryAfter::from_delay(Duration::from_secs(3600)),
                url: None,
                headers: None,
                body: None,
            }))
        },
    )
    .await;
    assert!(result.is_err());
}

#[tokio::test]
async fn previously_terminal_provider_error_retries_without_fast_budget() {
    let (session, mut turn_context) = make_session_and_context().await;
    Arc::make_mut(&mut turn_context.config)
        .features
        .enable(codex_features::Feature::PersistentProviderRetries)
        .expect("unconstrained test feature");
    let step_context = StepContext::for_test(Arc::new(turn_context));
    let mut client = session.services.model_client.new_session();
    let mut state = ResponsesStreamRetryState::default();
    assert!(CodexErr::QuotaExceeded.retry_delay(1).is_none());
    tokio::time::pause();
    let started = Instant::now();
    let expired_advice = RetryAfter::from_delay(Duration::ZERO).expect("retry deadline");
    handle_response_stream_error(
        &mut state,
        5,
        CodexErr::QuotaExceeded.with_retry_after(expired_advice),
        &mut client,
        &session,
        &step_context,
        ResponsesStreamRequest::Sampling,
    )
    .await
    .expect("provider recovery must keep the turn alive");
    assert_eq!(state.retries, 0);
    assert_eq!(state.provider_recovery_attempts, 1);
    assert!(
        (Duration::from_secs(15)..=Duration::from_millis(15001))
            .contains(&(Instant::now() - started))
    );
}
