function iR(t, e, r) {
  t[e] = Rd(t[e], r, 1);
}
function Wje(t, e) {
  let r = e2().getScopeData();
  return (t && qje(r, t.getScopeData()), e && qje(r, e.getScopeData()), r);
}
function YHt(t, e) {
  let { extra: r, tags: n, user: o, contexts: i, level: s, transactionName: a } = e;
  (Object.keys(r).length && (t.extra = { ...r, ...t.extra }),
    Object.keys(n).length && (t.tags = { ...n, ...t.tags }),
    Object.keys(o).length && (t.user = { ...o, ...t.user }),
    Object.keys(i).length && (t.contexts = { ...i, ...t.contexts }),
    s && (t.level = s),
    a && t.type !== "transaction" && (t.transaction = a));
}
function JHt(t, e) {
  let r = [...(t.breadcrumbs || []), ...e];
  t.breadcrumbs = r.length ? r : void 0;
}
function QHt(t, e) {
  t.sdkProcessingMetadata = { ...t.sdkProcessingMetadata, ...e };
}
function ejt(t, e) {
  ((t.contexts = { trace: Sje(e), ...t.contexts }),
    (t.sdkProcessingMetadata = { dynamicSamplingContext: Cje(e), ...t.sdkProcessingMetadata }));
  let r = nR(e),
    n = Bv(r).description;
  n && !t.transaction && t.type === "transaction" && (t.transaction = n);
}
function tjt(t, e) {
  ((t.fingerprint = t.fingerprint
    ? Array.isArray(t.fingerprint)
      ? t.fingerprint
      : [t.fingerprint]
    : []),
    e && (t.fingerprint = t.fingerprint.concat(e)),
    t.fingerprint.length || delete t.fingerprint);
}
function Hje(t, e, r, n, o, i) {
  let { normalizeDepth: s = 3, normalizeMaxBreadth: a = 1e3 } = t,
    l = { ...e, event_id: e.event_id || r.event_id || In(), timestamp: e.timestamp || bl() },
    c = r.integrations || t.integrations.map((y) => y.name);
  (rjt(l, t),
    ijt(l, c),
    o && o.emit("applyFrameMetadata", e),
    e.type === void 0 && njt(l, t.stackParser));
  let u = ajt(n, r.captureContext);
  r.mechanism && vl(l, r.mechanism);
  let p = o ? o.getEventProcessors() : [],
    m = Wje(i, u),
    f = [...(r.attachments || []), ...m.attachments];
  (f.length && (r.attachments = f), Gje(l, m));
  let h = [...p, ...m.eventProcessors];
  return Bje(h, l, r).then((y) => (y && ojt(y), typeof s == "number" && s > 0 ? sjt(y, s, a) : y));
}
function rjt(t, e) {
  let { environment: r, release: n, dist: o, maxValueLength: i } = e;
  ((t.environment = t.environment || r || Fv),
    !t.release && n && (t.release = n),
    !t.dist && o && (t.dist = o));
  let s = t.request;
  (s?.url && i && (s.url = Dv(s.url, i)),
    i &&
      t.exception?.values?.forEach((a) => {
        a.value && (a.value = Dv(a.value, i));
      }));
}
function njt(t, e) {
  let r = Uje(e);
  t.exception?.values?.forEach((n) => {
    n.stacktrace?.frames?.forEach((o) => {
      o.filename && (o.debug_id = r[o.filename]);
    });
  });
}
function ojt(t) {
  let e = {};
  if (
    (t.exception?.values?.forEach((n) => {
      n.stacktrace?.frames?.forEach((o) => {
        o.debug_id &&
          (o.abs_path ? (e[o.abs_path] = o.debug_id) : o.filename && (e[o.filename] = o.debug_id),
          delete o.debug_id);
      });
    }),
    Object.keys(e).length === 0)
  )
    return;
  ((t.debug_meta = t.debug_meta || {}), (t.debug_meta.images = t.debug_meta.images || []));
  let r = t.debug_meta.images;
  Object.entries(e).forEach(([n, o]) => {
    r.push({ type: "sourcemap", code_file: n, debug_id: o });
  });
}
function ijt(t, e) {
  e.length > 0 &&
    ((t.sdk = t.sdk || {}), (t.sdk.integrations = [...(t.sdk.integrations || []), ...e]));
}
function sjt(t, e, r) {
  if (!t) return null;
  let n = {
    ...t,
    ...(t.breadcrumbs && {
      breadcrumbs: t.breadcrumbs.map((o) => ({ ...o, ...(o.data && { data: ys(o.data, e, r) }) })),
    }),
    ...(t.user && { user: ys(t.user, e, r) }),
    ...(t.contexts && { contexts: ys(t.contexts, e, r) }),
    ...(t.extra && { extra: ys(t.extra, e, r) }),
  };
  return (
    t.contexts?.trace &&
      n.contexts &&
      ((n.contexts.trace = t.contexts.trace),
      t.contexts.trace.data && (n.contexts.trace.data = ys(t.contexts.trace.data, e, r))),
    t.spans &&
      (n.spans = t.spans.map((o) => ({ ...o, ...(o.data && { data: ys(o.data, e, r) }) }))),
    t.contexts?.flags && n.contexts && (n.contexts.flags = ys(t.contexts.flags, 3, r)),
    n
  );
}
function ajt(t, e) {
  if (!e) return t;
  let r = t ? t.clone() : new io();
  return (r.update(e), r);
}
function jje(t) {
  if (t) return ljt(t) ? { captureContext: t } : ujt(t) ? { captureContext: t } : t;
}
function ljt(t) {
  return t instanceof io || typeof t == "function";
}
var cjt = ["user", "level", "extra", "contexts", "tags", "fingerprint", "propagationContext"];
function ujt(t) {
  return Object.keys(t).some((e) => cjt.includes(e));
}
function s2(t, e) {
  return Sl().captureException(t, jje(e));
}
function sR(t, e) {
  return Sl().captureEvent(t, e);
}
function aR(t) {
  let e = wl(),
    r = Sl(),
    { userAgent: n } = rt.navigator || {},
    o = nje({ user: r.getUser() || e.getUser(), ...(n && { userAgent: n }), ...t }),
    i = e.getSession();
  return (i?.status === "ok" && Dc(i, { status: "exited" }), a2(), e.setSession(o), o);
}
function a2() {
  let t = wl(),
    r = Sl().getSession() || t.getSession();
  (r && oje(r), Vje(), t.setSession());
}
function Vje() {
  let t = wl(),
    e = pr(),
    r = t.getSession();
  r && e && e.captureSession(r);
}
function lR(t = !1) {
  if (t) {
    a2();
    return;
  }
  Vje();
}
var djt = "7";
function pjt(t) {
  let e = t.protocol ? `${t.protocol}:` : "",
    r = t.port ? `:${t.port}` : "";
  return `${e}//${t.host}${r}${t.path ? `/${t.path}` : ""}/api/`;
}
function mjt(t) {
  return `${pjt(t)}${t.projectId}/envelope/`;
}
function fjt(t, e) {
  let r = { sentry_version: djt };
  return (
    t.publicKey && (r.sentry_key = t.publicKey),
    e && (r.sentry_client = `${e.name}/${e.version}`),
    new URLSearchParams(r).toString()
  );
}
function Kje(t, e, r) {
  return e || `${mjt(t)}?${fjt(t, r)}`;
}
var Zje = [];
function Xje(t, e) {
  let r = {};
  return (
    e.forEach((n) => {
      n && SZ(t, n, r);
    }),
    r
  );
}
function bZ(t, e) {
  for (let r of e) r?.afterAllSetup && r.afterAllSetup(t);
}
function SZ(t, e, r) {
  if (r[e.name]) {
    qe && Te.log(`Integration skipped because it was already installed: ${e.name}`);
    return;
  }
  if (
    ((r[e.name] = e),
    !Zje.includes(e.name) && typeof e.setupOnce == "function" && (e.setupOnce(), Zje.push(e.name)),
    e.setup && typeof e.setup == "function" && e.setup(t),
    typeof e.preprocessEvent == "function")
  ) {
    let n = e.preprocessEvent.bind(e);
    t.on("preprocessEvent", (o, i) => n(o, i, t));
  }
  if (typeof e.processEvent == "function") {
    let n = e.processEvent.bind(e),
      o = Object.assign((i, s) => n(i, s, t), { id: e.name });
    t.addEventProcessor(o);
  }
  qe && Te.log(`Integration installed: ${e.name}`);
}
function hjt(t) {
  return [
    { type: "log", item_count: t.length, content_type: "application/vnd.sentry.items.log+json" },
    { items: t },
  ];
}
function Yje(t, e, r, n) {
  let o = {};
  return (
    e?.sdk && (o.sdk = { name: e.sdk.name, version: e.sdk.version }),
    r && n && (o.dsn = _l(n)),
    na(o, [hjt(t)])
  );
}
function cR(t, e) {
  let r = e ?? gjt(t) ?? [];
  if (r.length === 0) return;
  let n = t.getOptions(),
    o = Yje(r, n._metadata, n.tunnel, t.getDsn());
  (Jje().set(t, []), t.emit("flushLogs"), t.sendEnvelope(o));
}
function gjt(t) {
  return Jje().get(t);
}
function Jje() {
  return ta("clientToLogBufferMap", () => new WeakMap());
}
function yjt(t) {
  return [
    {
      type: "trace_metric",
      item_count: t.length,
      content_type: "application/vnd.sentry.items.trace-metric+json",
    },
    { items: t },
  ];
}
function Qje(t, e, r, n) {
  let o = {};
  return (
    e?.sdk && (o.sdk = { name: e.sdk.name, version: e.sdk.version }),
    r && n && (o.dsn = _l(n)),
    na(o, [yjt(t)])
  );
}
function uR(t, e) {
  let r = e ?? vjt(t) ?? [];
  if (r.length === 0) return;
  let n = t.getOptions(),
    o = Qje(r, n._metadata, n.tunnel, t.getDsn());
  (eze().set(t, []), t.emit("flushMetrics"), t.sendEnvelope(o));
}
function vjt(t) {
  return eze().get(t);
}
function eze() {
  return ta("clientToMetricBufferMap", () => new WeakMap());
}
var $v = Symbol.for("SentryBufferFullError");
function wf(t = 100) {
  let e = new Set();
  function r() {
    return e.size < t;
  }
  function n(s) {
    e.delete(s);
  }
  function o(s) {
    if (!r()) return bf($v);
    let a = s();
    return (
      e.add(a),
      a.then(
        () => n(a),
        () => n(a),
      ),
      a
    );
  }
  function i(s) {
    if (!e.size) return Ed(!0);
    let a = Promise.allSettled(Array.from(e)).then(() => !0);
    if (!s) return a;
    let l = [a, new Promise((c) => setTimeout(() => c(!1), s))];
    return Promise.race(l);
  }
  return {
    get $() {
      return Array.from(e);
    },
    add: o,
    drain: i,
  };
}
var bjt = 60 * 1e3;
function Sjt(t, e = kv()) {
  let r = parseInt(`${t}`, 10);
  if (!isNaN(r)) return r * 1e3;
  let n = Date.parse(`${t}`);
  return isNaN(n) ? bjt : n - e;
}
function wjt(t, e) {
  return t[e] || t.all || 0;
}
function tze(t, e, r = kv()) {
  return wjt(t, e) > r;
}
function rze(t, { statusCode: e, headers: r }, n = kv()) {
  let o = { ...t },
    i = r?.["x-sentry-rate-limits"],
    s = r?.["retry-after"];
  if (i)
    for (let a of i.trim().split(",")) {
      let [l, c, , , u] = a.split(":", 5),
        p = parseInt(l, 10),
        m = (isNaN(p) ? 60 : p) * 1e3;
      if (!c) o.all = n + m;
      else
        for (let f of c.split(";"))
          f === "metric_bucket"
            ? (!u || u.split(";").includes("custom")) && (o[f] = n + m)
            : (o[f] = n + m);
    }
  else s ? (o.all = n + Sjt(s, n)) : e === 429 && (o.all = n + 60 * 1e3);
  return o;
}
var wZ = 64;
function l2(t, e, r = wf(t.bufferSize || wZ)) {
  let n = {},
    o = (s) => r.drain(s);
  function i(s) {
    let a = [];
    if (
      (i2(s, (p, m) => {
        let f = hZ(m);
        tze(n, f) ? t.recordDroppedEvent("ratelimit_backoff", f) : a.push(p);
      }),
      a.length === 0)
    )
      return Promise.resolve({});
    let l = na(s[0], a),
      c = (p) => {
        if (Pje(l, ["client_report"])) {
          qe && Te.warn(`Dropping client report. Will not send outcomes (reason: ${p}).`);
          return;
        }
        i2(l, (m, f) => {
          t.recordDroppedEvent(p, hZ(f));
        });
      },
      u = () =>
        e({ body: Ije(l) }).then(
          (p) => (
            p.statusCode !== void 0 &&
              (p.statusCode < 200 || p.statusCode >= 300) &&
              qe &&
              Te.warn(`Sentry responded with status code ${p.statusCode} to sent event.`),
            (n = rze(n, p)),
            p
          ),
          (p) => {
            throw (
              c("network_error"),
              qe && Te.error("Encountered error running transport request:", p),
              p
            );
          },
        );
    return r.add(u).then(
      (p) => p,
      (p) => {
        if (p === $v)
          return (
            qe && Te.error("Skipped sending event because buffer is full."),
            c("queue_overflow"),
            Promise.resolve({})
          );
        throw p;
      },
    );
  }
  return { send: i, flush: o };
}
function nze(t, e, r) {
  let n = [{ type: "client_report" }, { timestamp: r || bl(), discarded_events: t }];
  return na(e ? { dsn: e } : {}, [n]);
}
function c2(t) {
  let e = [];
  t.message && e.push(t.message);
  try {
    let r = t.exception.values[t.exception.values.length - 1];
    r?.value && (e.push(r.value), r.type && e.push(`${r.type}: ${r.value}`));
  } catch {}
  return e;
}
function oze(t) {
  let {
    trace_id: e,
    parent_span_id: r,
    span_id: n,
    status: o,
    origin: i,
    data: s,
    op: a,
  } = t.contexts?.trace ?? {};
  return {
    data: s ?? {},
    description: t.transaction,
    op: a,
    parent_span_id: r,
    span_id: n ?? "",
    start_timestamp: t.start_timestamp ?? 0,
    status: o,
    timestamp: t.timestamp,
    trace_id: e ?? "",
    origin: i,
    profile_id: s?.[cZ],
    exclusive_time: s?.[uZ],
    measurements: t.measurements,
    is_segment: !0,
  };
}
function ize(t) {
  return {
    type: "transaction",
    timestamp: t.timestamp,
    start_timestamp: t.start_timestamp,
    transaction: t.description,
    contexts: {
      trace: {
        trace_id: t.trace_id,
        span_id: t.span_id,
        parent_span_id: t.parent_span_id,
        op: t.op,
        status: t.status,
        origin: t.origin,
        data: {
          ...t.data,
          ...(t.profile_id && { [cZ]: t.profile_id }),
          ...(t.exclusive_time && { [uZ]: t.exclusive_time }),
        },
      },
    },
    measurements: t.measurements,
  };
}
var sze = "Not capturing exception because it's already been captured.",
  aze = "Discarded session because of missing or non-string release",
  mze = Symbol.for("SentryInternalError"),
  fze = Symbol.for("SentryDoNotSendEventError"),
  _jt = 5e3;
function u2(t) {
  return { message: t, [mze]: !0 };
}
function _Z(t) {
  return { message: t, [fze]: !0 };
}
function lze(t) {
  return !!t && typeof t == "object" && mze in t;
}
function cze(t) {
  return !!t && typeof t == "object" && fze in t;
}
function uze(t, e, r, n, o) {
  let i = 0,
    s,
    a = !1;
  (t.on(r, () => {
    ((i = 0), clearTimeout(s), (a = !1));
  }),
    t.on(e, (l) => {
      ((i += n(l)),
        i >= 8e5
          ? o(t)
          : a ||
            ((a = !0),
            (s = setTimeout(() => {
              o(t);
            }, _jt))));
    }),
    t.on("flush", () => {
      o(t);
    }));
}
var dR = class {
  constructor(e) {
    if (
      ((this._options = e),
      (this._integrations = {}),
      (this._numProcessing = 0),
      (this._outcomes = {}),
      (this._hooks = {}),
      (this._eventProcessors = []),
      (this._promiseBuffer = wf(e.transportOptions?.bufferSize ?? wZ)),
      e.dsn
        ? (this._dsn = fje(e.dsn))
        : qe && Te.warn("No DSN provided, client will not send events."),
      this._dsn)
    ) {
      let n = Kje(this._dsn, e.tunnel, e._metadata ? e._metadata.sdk : void 0);
      this._transport = e.transport({
        tunnel: this._options.tunnel,
        recordDroppedEvent: this.recordDroppedEvent.bind(this),
        ...e.transportOptions,
        url: n,
      });
    }
    ((this._options.enableLogs =
      this._options.enableLogs ?? this._options._experiments?.enableLogs),
      this._options.enableLogs && uze(this, "afterCaptureLog", "flushLogs", Ejt, cR),
      (this._options.enableMetrics ?? this._options._experiments?.enableMetrics ?? !0) &&
        uze(this, "afterCaptureMetric", "flushMetrics", Rjt, uR));
  }
  captureException(e, r, n) {
    let o = In();
    if (YL(e)) return (qe && Te.log(sze), o);
    let i = { event_id: o, ...r };
    return (
      this._process(
        () =>
          this.eventFromException(e, i)
            .then((s) => this._captureEvent(s, i, n))
            .then((s) => s),
        "error",
      ),
      i.event_id
    );
  }
  captureMessage(e, r, n, o) {
    let i = { event_id: In(), ...n },
      s = hf(e) ? e : String(e),
      a = Ad(e),
      l = a ? this.eventFromMessage(s, r, i) : this.eventFromException(e, i);
    return (
      this._process(() => l.then((c) => this._captureEvent(c, i, o)), a ? "unknown" : "error"),
      i.event_id
    );
  }
  captureEvent(e, r, n) {
    let o = In();
    if (r?.originalException && YL(r.originalException)) return (qe && Te.log(sze), o);
    let i = { event_id: o, ...r },
      s = e.sdkProcessingMetadata || {},
      a = s.capturedSpanScope,
      l = s.capturedSpanIsolationScope,
      c = dze(e.type);
    return (this._process(() => this._captureEvent(e, i, a || n, l), c), i.event_id);
  }
  captureSession(e) {
    (this.sendSession(e), Dc(e, { init: !1 }));
  }
  getDsn() {
    return this._dsn;
  }
  getOptions() {
    return this._options;
  }
  getSdkMetadata() {
    return this._options._metadata;
  }
  getTransport() {
    return this._transport;
  }
  async flush(e) {
    let r = this._transport;
    if (!r) return !0;
    this.emit("flush");
    let n = await this._isClientDoneProcessing(e),
      o = await r.flush(e);
    return n && o;
  }
  async close(e) {
    let r = await this.flush(e);
    return ((this.getOptions().enabled = !1), this.emit("close"), r);
  }
  getEventProcessors() {
    return this._eventProcessors;
  }
  addEventProcessor(e) {
    this._eventProcessors.push(e);
  }
  init() {
    (this._isEnabled() ||
      this._options.integrations.some(({ name: e }) => e.startsWith("Spotlight"))) &&
      this._setupIntegrations();
  }
  getIntegrationByName(e) {
    return this._integrations[e];
  }
  addIntegration(e) {
    let r = this._integrations[e.name];
    (SZ(this, e, this._integrations), r || bZ(this, [e]));
  }
  sendEvent(e, r = {}) {
    this.emit("beforeSendEvent", e, r);
    let n = Oje(e, this._dsn, this._options._metadata, this._options.tunnel);
    for (let o of r.attachments || []) n = Tje(n, kje(o));
    this.sendEnvelope(n).then((o) => this.emit("afterSendEvent", e, o));
  }
  sendSession(e) {
    let { release: r, environment: n = Fv } = this._options;
    if ("aggregates" in e) {
      let i = e.attrs || {};
      if (!i.release && !r) {
        qe && Te.warn(aze);
        return;
      }
      ((i.release = i.release || r), (i.environment = i.environment || n), (e.attrs = i));
    } else {
      if (!e.release && !r) {
        qe && Te.warn(aze);
        return;
      }
      ((e.release = e.release || r), (e.environment = e.environment || n));
    }
    this.emit("beforeSendSession", e);
    let o = Mje(e, this._dsn, this._options._metadata, this._options.tunnel);
    this.sendEnvelope(o);
  }
  recordDroppedEvent(e, r, n = 1) {
    if (this._options.sendClientReports) {
      let o = `${e}:${r}`;
      (qe && Te.log(`Recording outcome: "${o}"${n > 1 ? ` (${n} times)` : ""}`),
        (this._outcomes[o] = (this._outcomes[o] || 0) + n));
    }
  }
  on(e, r) {
    let n = (this._hooks[e] = this._hooks[e] || new Set()),
      o = (...i) => r(...i);
    return (
      n.add(o),
      () => {
        n.delete(o);
      }
    );
  }
  emit(e, ...r) {
    let n = this._hooks[e];
    n && n.forEach((o) => o(...r));
  }
  async sendEnvelope(e) {
    if ((this.emit("beforeEnvelope", e), this._isEnabled() && this._transport))
      try {
        return await this._transport.send(e);
      } catch (r) {
        return (qe && Te.error("Error while sending envelope:", r), {});
      }
    return (qe && Te.error("Transport disabled"), {});
  }
  _setupIntegrations() {
    let { integrations: e } = this._options;
    ((this._integrations = Xje(this, e)), bZ(this, e));
  }
  _updateSessionFromEvent(e, r) {
    let n = r.level === "fatal",
      o = !1,
      i = r.exception?.values;
    if (i) {
      ((o = !0), (n = !1));
      for (let l of i)
        if (l.mechanism?.handled === !1) {
          n = !0;
          break;
        }
    }
    let s = e.status === "ok";
    ((s && e.errors === 0) || (s && n)) &&
      (Dc(e, { ...(n && { status: "crashed" }), errors: e.errors || Number(o || n) }),
      this.captureSession(e));
  }
  async _isClientDoneProcessing(e) {
    let r = 0;
    for (; !e || r < e; ) {
      if ((await new Promise((n) => setTimeout(n, 1)), !this._numProcessing)) return !0;
      r++;
    }
    return !1;
  }
  _isEnabled() {
    return this.getOptions().enabled !== !1 && this._transport !== void 0;
  }
  _prepareEvent(e, r, n, o) {
    let i = this.getOptions(),
      s = Object.keys(this._integrations);
    return (
      !r.integrations && s?.length && (r.integrations = s),
      this.emit("preprocessEvent", e, r),
      e.type || o.setLastEventId(e.event_id || r.event_id),
      Hje(i, e, r, n, this, o).then((a) => {
        if (a === null) return a;
        (this.emit("postprocessEvent", a, r), (a.contexts = { trace: iZ(n), ...a.contexts }));
        let l = Eje(this, n);
        return (
          (a.sdkProcessingMetadata = { dynamicSamplingContext: l, ...a.sdkProcessingMetadata }),
          a
        );
      })
    );
  }
  _captureEvent(e, r = {}, n = Sl(), o = wl()) {
    return (
      qe && xZ(e) && Te.log(`Captured error event \`${c2(e)[0] || "<unknown>"}\``),
      this._processEvent(e, r, n, o).then(
        (i) => i.event_id,
        (i) => {
          qe && (cze(i) ? Te.log(i.message) : lze(i) ? Te.warn(i.message) : Te.warn(i));
        },
      )
    );
  }
  _processEvent(e, r, n, o) {
    let i = this.getOptions(),
      { sampleRate: s } = i,
      a = hze(e),
      l = xZ(e),
      u = `before send for type \`${e.type || "error"}\``,
      p = typeof s > "u" ? void 0 : hje(s);
    if (l && typeof p == "number" && vf() > p)
      return (
        this.recordDroppedEvent("sample_rate", "error"),
        bf(
          _Z(
            `Discarding event because it's not included in the random sample (sampling rate = ${s})`,
          ),
        )
      );
    let m = dze(e.type);
    return this._prepareEvent(e, r, n, o)
      .then((f) => {
        if (f === null)
          throw (
            this.recordDroppedEvent("event_processor", m),
            _Z("An event processor returned `null`, will not send event.")
          );
        if (r.data && r.data.__sentry__ === !0) return f;
        let v = Ajt(this, i, f, r);
        return xjt(v, u);
      })
      .then((f) => {
        if (f === null) {
          if ((this.recordDroppedEvent("before_send", m), a)) {
            let w = 1 + (e.spans || []).length;
            this.recordDroppedEvent("before_send", "span", w);
          }
          throw _Z(`${u} returned \`null\`, will not send event.`);
        }
        let h = n.getSession() || o.getSession();
        if ((l && h && this._updateSessionFromEvent(h, f), a)) {
          let y = f.sdkProcessingMetadata?.spanCountBeforeProcessing || 0,
            w = f.spans ? f.spans.length : 0,
            _ = y - w;
          _ > 0 && this.recordDroppedEvent("before_send", "span", _);
        }
        let v = f.transaction_info;
        if (a && v && f.transaction !== e.transaction) {
          let y = "custom";
          f.transaction_info = { ...v, source: y };
        }
        return (this.sendEvent(f, r), f);
      })
      .then(null, (f) => {
        throw cze(f) || lze(f)
          ? f
          : (this.captureException(f, {
              mechanism: { handled: !1, type: "internal" },
              data: { __sentry__: !0 },
              originalException: f,
            }),
            u2(`Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.
Reason: ${f}`));
      });
  }
  _process(e, r) {
    (this._numProcessing++,
      this._promiseBuffer.add(e).then(
        (n) => (this._numProcessing--, n),
        (n) => (this._numProcessing--, n === $v && this.recordDroppedEvent("queue_overflow", r), n),
      ));
  }
  _clearOutcomes() {
    let e = this._outcomes;
    return (
      (this._outcomes = {}),
      Object.entries(e).map(([r, n]) => {
        let [o, i] = r.split(":");
        return { reason: o, category: i, quantity: n };
      })
    );
  }
  _flushOutcomes() {
    qe && Te.log("Flushing outcomes...");
    let e = this._clearOutcomes();
    if (e.length === 0) {
      qe && Te.log("No outcomes to send");
      return;
    }
    if (!this._dsn) {
      qe && Te.log("No dsn provided, will not send outcomes");
      return;
    }
    qe && Te.log("Sending outcomes:", e);
    let r = nze(e, this._options.tunnel && _l(this._dsn));
    this.sendEnvelope(r);
  }
};
function dze(t) {
  return t === "replay_event" ? "replay" : t || "error";
}
function xjt(t, e) {
  let r = `${e} must return \`null\` or a valid event.`;
  if (gl(t))
    return t.then(
      (n) => {
        if (!hl(n) && n !== null) throw u2(r);
        return n;
      },
      (n) => {
        throw u2(`${e} rejected with ${n}`);
      },
    );
  if (!hl(t) && t !== null) throw u2(r);
  return t;
}
function Ajt(t, e, r, n) {
  let { beforeSend: o, beforeSendTransaction: i, beforeSendSpan: s, ignoreSpans: a } = e,
    l = r;
  if (xZ(l) && o) return o(l, n);
  if (hze(l)) {
    if (s || a) {
      let c = oze(l);
      if (a?.length && pZ(c, a)) return null;
      if (s) {
        let u = s(c);
        u ? (l = Rd(r, ize(u))) : dZ();
      }
      if (l.spans) {
        let u = [],
          p = l.spans;
        for (let f of p) {
          if (a?.length && pZ(f, a)) {
            Aje(p, f);
            continue;
          }
          if (s) {
            let h = s(f);
            h ? u.push(h) : (dZ(), u.push(f));
          } else u.push(f);
        }
        let m = l.spans.length - u.length;
        (m && t.recordDroppedEvent("before_send", "span", m), (l.spans = u));
      }
    }
    if (i) {
      if (l.spans) {
        let c = l.spans.length;
        l.sdkProcessingMetadata = { ...r.sdkProcessingMetadata, spanCountBeforeProcessing: c };
      }
      return i(l, n);
    }
  }
  return l;
}
function xZ(t) {
  return t.type === void 0;
}
function hze(t) {
  return t.type === "transaction";
}
function Rjt(t) {
  let e = 0;
  return (t.name && (e += t.name.length * 2), (e += 8), e + gze(t.attributes));
}
function Ejt(t) {
  let e = 0;
  return (t.message && (e += t.message.length * 2), e + gze(t.attributes));
}
function gze(t) {
  if (!t) return 0;
  let e = 0;
  return (
    Object.values(t).forEach((r) => {
      Array.isArray(r) ? (e += r.length * pze(r[0])) : Ad(r) ? (e += pze(r)) : (e += 100);
    }),
    e
  );
}
function pze(t) {
  return typeof t == "string"
    ? t.length * 2
    : typeof t == "number"
      ? 8
      : typeof t == "boolean"
        ? 4
        : 0;
}
function Cjt(t) {
  return (
    kc(t) && "__sentry_fetch_url_host__" in t && typeof t.__sentry_fetch_url_host__ == "string"
  );
}
function d2(t) {
  return Cjt(t) ? `${t.message} (${t.__sentry_fetch_url_host__})` : t.message;
}
function pR(t) {
  if (!t) return {};
  let e = t.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
  if (!e) return {};
  let r = e[6] || "",
    n = e[8] || "";
  return { host: e[4], path: e[5], protocol: e[2], search: r, hash: n, relative: e[5] + r + n };
}
function AZ(t, e = !0) {
  if (t.startsWith("data:")) {
    let r = t.match(/^data:([^;,]+)/),
      n = r ? r[1] : "text/plain",
      o = t.includes(";base64,"),
      i = t.indexOf(","),
      s = "";
    if (e && i !== -1) {
      let a = t.slice(i + 1);
      s = a.length > 10 ? `${a.slice(0, 10)}... [truncated]` : a;
    }
    return `data:${n}${o ? ",base64" : ""}${s ? `,${s}` : ""}`;
  }
  return t;
}
function RZ(t) {
  "aggregates" in t
    ? t.attrs?.ip_address === void 0 && (t.attrs = { ...t.attrs, ip_address: "{{auto}}" })
    : t.ipAddress === void 0 && (t.ipAddress = "{{auto}}");
}
function EZ(t, e, r = [e], n = "npm") {
  let o = t._metadata || {};
  (o.sdk ||
    (o.sdk = {
      name: `sentry.javascript.${e}`,
      packages: r.map((i) => ({ name: `${n}:@sentry/${i}`, version: ml })),
      version: ml,
    }),
    (t._metadata = o));
}
var Tjt = 100;
function xl(t, e) {
  let r = pr(),
    n = wl();
  if (!r) return;
  let { beforeBreadcrumb: o = null, maxBreadcrumbs: i = Tjt } = r.getOptions();
  if (i <= 0) return;
  let a = { timestamp: bl(), ...t },
    l = o ? xd(() => o(a, e)) : a;
  l !== null && (r.emit && r.emit("beforeAddBreadcrumb", l, e), n.addBreadcrumb(l, i));
}
var yze,
  Pjt = "FunctionToString",
  vze = new WeakMap(),
  Ijt = () => ({
    name: Pjt,
    setupOnce() {
      yze = Function.prototype.toString;
      try {
        Function.prototype.toString = function (...t) {
          let e = yf(this),
            r = vze.has(pr()) && e !== void 0 ? e : this;
          return yze.apply(r, t);
        };
      } catch {}
    },
    setup(t) {
      vze.set(t, !0);
    },
  }),
  p2 = Ijt;
var kjt = [
    /^Script error\.?$/,
    /^Javascript error: Script error\.? on line 0$/,
    /^ResizeObserver loop completed with undelivered notifications.$/,
    /^Cannot redefine property: googletag$/,
    /^Can't find variable: gmo$/,
    /^undefined is not an object \(evaluating 'a\.[A-Z]'\)$/,
    `can't redefine non-configurable property "solana"`,
    "vv().getRestrictions is not a function. (In 'vv().getRestrictions(1,a)', 'vv().getRestrictions' is undefined)",
    "Can't find variable: _AutofillCallbackHandler",
    /^Non-Error promise rejection captured with value: Object Not Found Matching Id:\d+, MethodName:simulateEvent, ParamCount:\d+$/,
    /^Java exception was raised during method invocation$/,
  ],
  Djt = "EventFilters",
  CZ = (t = {}) => {
    let e;
    return {
      name: Djt,
      setup(r) {
        let n = r.getOptions();
        e = bze(t, n);
      },
      processEvent(r, n, o) {
        if (!e) {
          let i = o.getOptions();
          e = bze(t, i);
        }
        return Mjt(r, e) ? null : r;
      },
    };
  },
  f2 = (t = {}) => ({ ...CZ(t), name: "InboundFilters" });
function bze(t = {}, e = {}) {
  return {
    allowUrls: [...(t.allowUrls || []), ...(e.allowUrls || [])],
    denyUrls: [...(t.denyUrls || []), ...(e.denyUrls || [])],
    ignoreErrors: [
      ...(t.ignoreErrors || []),
      ...(e.ignoreErrors || []),
      ...(t.disableErrorDefaults ? [] : kjt),
    ],
    ignoreTransactions: [...(t.ignoreTransactions || []), ...(e.ignoreTransactions || [])],
  };
}
function Mjt(t, e) {
  if (t.type) {
    if (t.type === "transaction" && Njt(t, e.ignoreTransactions))
      return (
        qe &&
          Te.warn(`Event dropped due to being matched by \`ignoreTransactions\` option.
Event: ${yl(t)}`),
        !0
      );
  } else {
    if (Ojt(t, e.ignoreErrors))
      return (
        qe &&
          Te.warn(`Event dropped due to being matched by \`ignoreErrors\` option.
Event: ${yl(t)}`),
        !0
      );
    if ($jt(t))
      return (
        qe &&
          Te.warn(`Event dropped due to not having an error message, error type or stacktrace.
Event: ${yl(t)}`),
        !0
      );
    if (Ljt(t, e.denyUrls))
      return (
        qe &&
          Te.warn(`Event dropped due to being matched by \`denyUrls\` option.
Event: ${yl(t)}.
Url: ${m2(t)}`),
        !0
      );
    if (!Bjt(t, e.allowUrls))
      return (
        qe &&
          Te.warn(`Event dropped due to not being matched by \`allowUrls\` option.
Event: ${yl(t)}.
Url: ${m2(t)}`),
        !0
      );
  }
  return !1;
}
function Ojt(t, e) {
  return e?.length ? c2(t).some((r) => Ov(r, e)) : !1;
}
function Njt(t, e) {
  if (!e?.length) return !1;
  let r = t.transaction;
  return r ? Ov(r, e) : !1;
}
function Ljt(t, e) {
  if (!e?.length) return !1;
  let r = m2(t);
  return r ? Ov(r, e) : !1;
}
function Bjt(t, e) {
  if (!e?.length) return !0;
  let r = m2(t);
  return r ? Ov(r, e) : !0;
}
function Fjt(t = []) {
  for (let e = t.length - 1; e >= 0; e--) {
    let r = t[e];
    if (r && r.filename !== "<anonymous>" && r.filename !== "[native code]")
      return r.filename || null;
  }
  return null;
}
function m2(t) {
  try {
    let r = [...(t.exception?.values ?? [])]
      .reverse()
      .find((n) => n.mechanism?.parent_id === void 0 && n.stacktrace?.frames?.length)
      ?.stacktrace?.frames;
    return r ? Fjt(r) : null;
  } catch {
    return (qe && Te.error(`Cannot extract url for event ${yl(t)}`), null);
  }
}
function $jt(t) {
  return t.exception?.values?.length
    ? !t.message &&
        !t.exception.values.some((e) => e.stacktrace || (e.type && e.type !== "Error") || e.value)
    : !1;
}
function PZ(t, e, r, n, o, i) {
  if (!o.exception?.values || !i || !ra(i.originalException, Error)) return;
  let s =
    o.exception.values.length > 0 ? o.exception.values[o.exception.values.length - 1] : void 0;
  s && (o.exception.values = TZ(t, e, n, i.originalException, r, o.exception.values, s, 0));
}
function TZ(t, e, r, n, o, i, s, a) {
  if (i.length >= r + 1) return i;
  let l = [...i];
  if (ra(n[o], Error)) {
    Sze(s, a);
    let c = t(e, n[o]),
      u = l.length;
    (wze(c, o, u, a), (l = TZ(t, e, r, n[o], o, [c, ...l], c, u)));
  }
  return (
    Array.isArray(n.errors) &&
      n.errors.forEach((c, u) => {
        if (ra(c, Error)) {
          Sze(s, a);
          let p = t(e, c),
            m = l.length;
          (wze(p, `errors[${u}]`, m, a), (l = TZ(t, e, r, c, o, [p, ...l], p, m)));
        }
      }),
    l
  );
}
function Sze(t, e) {
  t.mechanism = {
    handled: !0,
    type: "auto.core.linked_errors",
    ...t.mechanism,
    ...(t.type === "AggregateError" && { is_exception_group: !0 }),
    exception_id: e,
  };
}
function wze(t, e, r, n) {
  t.mechanism = {
    handled: !0,
    ...t.mechanism,
    type: "chained",
    source: e,
    exception_id: r,
    parent_id: n,
  };
}
function IZ(t) {
  let e = "console";
  (qo(e, t), Go(e, Ujt));
}
function Ujt() {
  "console" in rt &&
    L9.forEach(function (t) {
      t in rt.console &&
        Pn(rt.console, t, function (e) {
          return (
            (Cv[t] = e),
            function (...r) {
              (Tn("console", { args: r, level: t }), Cv[t]?.apply(rt.console, r));
            }
          );
        });
    });
}
function kZ(t) {
  return t === "warn"
    ? "warning"
    : ["fatal", "error", "warning", "log", "info", "debug"].includes(t)
      ? t
      : "log";
}
var qjt = "Dedupe",
  Gjt = () => {
    let t;
    return {
      name: qjt,
      processEvent(e) {
        if (e.type) return e;
        try {
          if (Wjt(e, t))
            return (
              qe && Te.warn("Event dropped due to being a duplicate of previously captured event."),
              null
            );
        } catch {}
        return (t = e);
      },
    };
  },
  h2 = Gjt;
function Wjt(t, e) {
  return e ? !!(Hjt(t, e) || jjt(t, e)) : !1;
}
function Hjt(t, e) {
  let r = t.message,
    n = e.message;
  return !((!r && !n) || (r && !n) || (!r && n) || r !== n || !Aze(t, e) || !xze(t, e));
}
function jjt(t, e) {
  let r = _ze(e),
    n = _ze(t);
  return !(!r || !n || r.type !== n.type || r.value !== n.value || !Aze(t, e) || !xze(t, e));
}
function xze(t, e) {
  let r = HL(t),
    n = HL(e);
  if (!r && !n) return !0;
  if ((r && !n) || (!r && n) || ((r = r), (n = n), n.length !== r.length)) return !1;
  for (let o = 0; o < n.length; o++) {
    let i = n[o],
      s = r[o];
    if (
      i.filename !== s.filename ||
      i.lineno !== s.lineno ||
      i.colno !== s.colno ||
      i.function !== s.function
    )
      return !1;
  }
  return !0;
}
function Aze(t, e) {
  let r = t.fingerprint,
    n = e.fingerprint;
  if (!r && !n) return !0;
  if ((r && !n) || (!r && n)) return !1;
  ((r = r), (n = n));
  try {
    return r.join("") === n.join("");
  } catch {
    return !1;
  }
}
function _ze(t) {
  return t.exception?.values?.[0];
}
function g2(t) {
  if (t !== void 0) return t >= 400 && t < 500 ? "warning" : t >= 500 ? "error" : void 0;
}
var mR = rt;
function DZ() {
  return "history" in mR && !!mR.history;
}
function zjt() {
  if (!("fetch" in mR)) return !1;
  try {
    return (new Headers(), new Request("data:,"), new Response(), !0);
  } catch {
    return !1;
  }
}
function fR(t) {
  return t && /^function\s+\w+\(\)\s+\{\s+\[native code\]\s+\}$/.test(t.toString());
}
function MZ() {
  if (typeof EdgeRuntime == "string") return !0;
  if (!zjt()) return !1;
  if (fR(mR.fetch)) return !0;
  let t = !1,
    e = mR.document;
  if (e && typeof e.createElement == "function")
    try {
      let r = e.createElement("iframe");
      ((r.hidden = !0),
        e.head.appendChild(r),
        r.contentWindow?.fetch && (t = fR(r.contentWindow.fetch)),
        e.head.removeChild(r));
    } catch (r) {
      qe &&
        Te.warn(
          "Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ",
          r,
        );
    }
  return t;
}
function OZ(t, e) {
  let r = "fetch";
  (qo(r, t), Go(r, () => Vjt(void 0, e)));
}
function Vjt(t, e = !1) {
  (e && !MZ()) ||
    Pn(rt, "fetch", function (r) {
      return function (...n) {
        let o = new Error(),
          { method: i, url: s } = Kjt(n),
          a = {
            args: n,
            fetchData: { method: i, url: s },
            startTimestamp: Si() * 1e3,
            virtualError: o,
            headers: Zjt(n),
          };
        return (
          t || Tn("fetch", { ...a }),
          r.apply(rt, n).then(
            async (l) => (
              t ? t(l) : Tn("fetch", { ...a, endTimestamp: Si() * 1e3, response: l }),
              l
            ),
            (l) => {
              (Tn("fetch", { ...a, endTimestamp: Si() * 1e3, error: l }),
                kc(l) && l.stack === void 0 && ((l.stack = o.stack), bi(l, "framesToPop", 1)));
              let u = pr()?.getOptions().enhanceFetchErrorMessages ?? "always";
              if (
                u !== !1 &&
                l instanceof TypeError &&
                (l.message === "Failed to fetch" ||
                  l.message === "Load failed" ||
                  l.message === "NetworkError when attempting to fetch resource.")
              )
                try {
                  let f = new URL(a.fetchData.url).host;
                  u === "always"
                    ? (l.message = `${l.message} (${f})`)
                    : bi(l, "__sentry_fetch_url_host__", f);
                } catch {}
              throw l;
            },
          )
        );
      };
    });
}
function y2(t, e) {
  return !!t && typeof t == "object" && !!t[e];
}
function Rze(t) {
  return typeof t == "string"
    ? t
    : t
      ? y2(t, "url")
        ? t.url
        : t.toString
          ? t.toString()
          : ""
      : "";
}
function Kjt(t) {
  if (t.length === 0) return { method: "GET", url: "" };
  if (t.length === 2) {
    let [r, n] = t;
    return {
      url: Rze(r),
      method: y2(n, "method")
        ? String(n.method).toUpperCase()
        : Z9(r) && y2(r, "method")
          ? String(r.method).toUpperCase()
          : "GET",
    };
  }
  let e = t[0];
  return { url: Rze(e), method: y2(e, "method") ? String(e.method).toUpperCase() : "GET" };
}
function Zjt(t) {
  let [e, r] = t;
  try {
    if (typeof r == "object" && r !== null && "headers" in r && r.headers)
      return new Headers(r.headers);
    if (Z9(e)) return new Headers(e.headers);
  } catch {}
}
function NZ() {
  return "npm";
}
var Jr = rt,
  LZ = 0;
function BZ() {
  return LZ > 0;
}
function uzt() {
  (LZ++,
    setTimeout(() => {
      LZ--;
    }));
}
function _f(t, e = {}) {
  function r(o) {
    return typeof o == "function";
  }
  if (!r(t)) return t;
  try {
    let o = t.__sentry_wrapped__;
    if (o) return typeof o == "function" ? o : t;
    if (yf(t)) return t;
  } catch {
    return t;
  }
  let n = function (...o) {
    try {
      let i = o.map((s) => _f(s, e));
      return t.apply(this, i);
    } catch (i) {
      throw (
        uzt(),
        t2((s) => {
          (s.addEventProcessor(
            (a) => (
              e.mechanism && (Nv(a, void 0, void 0), vl(a, e.mechanism)),
              (a.extra = { ...a.extra, arguments: o }),
              a
            ),
          ),
            s2(i));
        }),
        i
      );
    }
  };
  try {
    for (let o in t) Object.prototype.hasOwnProperty.call(t, o) && (n[o] = t[o]);
  } catch {}
  (KL(n, t), bi(t, "__sentry_wrapped__", n));
  try {
    Object.getOwnPropertyDescriptor(n, "name").configurable &&
      Object.defineProperty(n, "name", {
        get() {
          return t.name;
        },
      });
  } catch {}
  return n;
}
function Eze() {
  let t = rR(),
    { referrer: e } = Jr.document || {},
    { userAgent: r } = Jr.navigator || {},
    n = { ...(e && { Referer: e }), ...(r && { "User-Agent": r }) };
  return { url: t, headers: n };
}
function v2(t, e) {
  let r = UZ(t, e),
    n = { type: hzt(e), value: gzt(e) };
  return (
    r.length && (n.stacktrace = { frames: r }),
    n.type === void 0 && n.value === "" && (n.value = "Unrecoverable error caught"),
    n
  );
}
function dzt(t, e, r, n) {
  let i = pr()?.getOptions().normalizeDepth,
    s = bzt(e),
    a = { __serialized__: o2(e, i) };
  if (s) return { exception: { values: [v2(t, s)] }, extra: a };
  let l = {
    exception: {
      values: [
        {
          type: gf(e) ? e.constructor.name : n ? "UnhandledRejection" : "Error",
          value: yzt(e, { isUnhandledRejection: n }),
        },
      ],
    },
    extra: a,
  };
  if (r) {
    let c = UZ(t, r);
    c.length && (l.exception.values[0].stacktrace = { frames: c });
  }
  return l;
}
function FZ(t, e) {
  return { exception: { values: [v2(t, e)] } };
}
function UZ(t, e) {
  let r = e.stacktrace || e.stack || "",
    n = mzt(e),
    o = fzt(e);
  try {
    return t(r, n, o);
  } catch {}
  return [];
}
var pzt = /Minified React error #\d+;/i;
function mzt(t) {
  return t && pzt.test(t.message) ? 1 : 0;
}
function fzt(t) {
  return typeof t.framesToPop == "number" ? t.framesToPop : 0;
}
function Cze(t) {
  return typeof WebAssembly < "u" && typeof WebAssembly.Exception < "u"
    ? t instanceof WebAssembly.Exception
    : !1;
}
function hzt(t) {
  let e = t?.name;
  return !e && Cze(t)
    ? t.message && Array.isArray(t.message) && t.message.length == 2
      ? t.message[0]
      : "WebAssembly.Exception"
    : e;
}
function gzt(t) {
  let e = t?.message;
  return Cze(t)
    ? Array.isArray(t.message) && t.message.length == 2
      ? t.message[1]
      : "wasm exception"
    : e
      ? e.error && typeof e.error.message == "string"
        ? d2(e.error)
        : d2(t)
      : "No error message";
}
function Tze(t, e, r, n) {
  let o = r?.syntheticException || void 0,
    i = b2(t, e, o, n);
  return (vl(i), (i.level = "error"), r?.event_id && (i.event_id = r.event_id), Ed(i));
}
function Pze(t, e, r = "info", n, o) {
  let i = n?.syntheticException || void 0,
    s = $Z(t, e, i, o);
  return ((s.level = r), n?.event_id && (s.event_id = n.event_id), Ed(s));
}
function b2(t, e, r, n, o) {
  let i;
  if (QA(e) && e.error) return FZ(t, e.error);
  if (VL(e) || j9(e)) {
    let s = e;
    if ("stack" in e) i = FZ(t, e);
    else {
      let a = s.name || (VL(s) ? "DOMError" : "DOMException"),
        l = s.message ? `${a}: ${s.message}` : a;
      ((i = $Z(t, l, r, n)), Nv(i, l));
    }
    return ("code" in s && (i.tags = { ...i.tags, "DOMException.code": `${s.code}` }), i);
  }
  return kc(e)
    ? FZ(t, e)
    : hl(e) || gf(e)
      ? ((i = dzt(t, e, r, o)), vl(i, { synthetic: !0 }), i)
      : ((i = $Z(t, e, r, n)), Nv(i, `${e}`, void 0), vl(i, { synthetic: !0 }), i);
}
function $Z(t, e, r, n) {
  let o = {};
  if (n && r) {
    let i = UZ(t, r);
    (i.length && (o.exception = { values: [{ value: e, stacktrace: { frames: i } }] }),
      vl(o, { synthetic: !0 }));
  }
  if (hf(e)) {
    let { __sentry_template_string__: i, __sentry_template_values__: s } = e;
    return ((o.logentry = { message: i, params: s }), o);
  }
  return ((o.message = e), o);
}
function yzt(t, { isUnhandledRejection: e }) {
  let r = J9(t),
    n = e ? "promise rejection" : "exception";
  return QA(t)
    ? `Event \`ErrorEvent\` captured as ${n} with message \`${t.message}\``
    : gf(t)
      ? `Event \`${vzt(t)}\` (type=${t.type}) captured as ${n}`
      : `Object captured as ${n} with keys: ${r}`;
}
function vzt(t) {
  try {
    let e = Object.getPrototypeOf(t);
    return e ? e.constructor.name : void 0;
  } catch {}
}
function bzt(t) {
  for (let e in t)
    if (Object.prototype.hasOwnProperty.call(t, e)) {
      let r = t[e];
      if (r instanceof Error) return r;
    }
}
var hR = class extends dR {
  constructor(e) {
    let r = Szt(e),
      n = Jr.SENTRY_SDK_SOURCE || NZ();
    (EZ(r, "browser", ["browser"], n),
      r._metadata?.sdk &&
        (r._metadata.sdk.settings = {
          infer_ip: r.sendDefaultPii ? "auto" : "never",
          ...r._metadata.sdk.settings,
        }),
      super(r));
    let {
        sendDefaultPii: o,
        sendClientReports: i,
        enableLogs: s,
        _experiments: a,
        enableMetrics: l,
      } = this._options,
      c = l ?? a?.enableMetrics ?? !0;
    (Jr.document &&
      (i || s || c) &&
      Jr.document.addEventListener("visibilitychange", () => {
        Jr.document.visibilityState === "hidden" &&
          (i && this._flushOutcomes(), s && cR(this), c && uR(this));
      }),
      o && this.on("beforeSendSession", RZ));
  }
  eventFromException(e, r) {
    return Tze(this._options.stackParser, e, r, this._options.attachStacktrace);
  }
  eventFromMessage(e, r = "info", n) {
    return Pze(this._options.stackParser, e, r, n, this._options.attachStacktrace);
  }
  _prepareEvent(e, r, n, o) {
    return ((e.platform = e.platform || "javascript"), super._prepareEvent(e, r, n, o));
  }
};
function Szt(t) {
  return {
    release: typeof __SENTRY_RELEASE__ == "string" ? __SENTRY_RELEASE__ : Jr.SENTRY_RELEASE?.id,
    sendClientReports: !0,
    parentSpanIsAlwaysRootSpan: !0,
    ...t,
  };
}
var Ize = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__;
var kn = rt;
var wzt = 1e3,
  kze,
  qZ,
  GZ;
function WZ(t) {
  let e = "dom";
  (qo(e, t), Go(e, _zt));
}
function _zt() {
  if (!kn.document) return;
  let t = Tn.bind(null, "dom"),
    e = Dze(t, !0);
  (kn.document.addEventListener("click", e, !1),
    kn.document.addEventListener("keypress", e, !1),
    ["EventTarget", "Node"].forEach((r) => {
      let o = kn[r]?.prototype;
      o?.hasOwnProperty?.("addEventListener") &&
        (Pn(o, "addEventListener", function (i) {
          return function (s, a, l) {
            if (s === "click" || s == "keypress")
              try {
                let c = (this.__sentry_instrumentation_handlers__ =
                    this.__sentry_instrumentation_handlers__ || {}),
                  u = (c[s] = c[s] || { refCount: 0 });
                if (!u.handler) {
                  let p = Dze(t);
                  ((u.handler = p), i.call(this, s, p, l));
                }
                u.refCount++;
              } catch {}
            return i.call(this, s, a, l);
          };
        }),
        Pn(o, "removeEventListener", function (i) {
          return function (s, a, l) {
            if (s === "click" || s == "keypress")
              try {
                let c = this.__sentry_instrumentation_handlers__ || {},
                  u = c[s];
                u &&
                  (u.refCount--,
                  u.refCount <= 0 &&
                    (i.call(this, s, u.handler, l), (u.handler = void 0), delete c[s]),
                  Object.keys(c).length === 0 && delete this.__sentry_instrumentation_handlers__);
              } catch {}
            return i.call(this, s, a, l);
          };
        }));
    }));
}
function xzt(t) {
  if (t.type !== qZ) return !1;
  try {
    if (!t.target || t.target._sentryId !== GZ) return !1;
  } catch {}
  return !0;
}
function Azt(t, e) {
  return t !== "keypress"
    ? !1
    : e?.tagName
      ? !(e.tagName === "INPUT" || e.tagName === "TEXTAREA" || e.isContentEditable)
      : !0;
}
function Dze(t, e = !1) {
  return (r) => {
    if (!r || r._sentryCaptured) return;
    let n = Rzt(r);
    if (Azt(r.type, n)) return;
    (bi(r, "_sentryCaptured", !0), n && !n._sentryId && bi(n, "_sentryId", In()));
    let o = r.type === "keypress" ? "input" : r.type;
    (xzt(r) ||
      (t({ event: r, name: o, global: e }), (qZ = r.type), (GZ = n ? n._sentryId : void 0)),
      clearTimeout(kze),
      (kze = kn.setTimeout(() => {
        ((GZ = void 0), (qZ = void 0));
      }, wzt)));
  };
}
function Rzt(t) {
  try {
    return t.target;
  } catch {
    return null;
  }
}
var S2;
function gR(t) {
  let e = "history";
  (qo(e, t), Go(e, Ezt));
}
function Ezt() {
  if (
    (kn.addEventListener("popstate", () => {
      let e = kn.location.href,
        r = S2;
      if (((S2 = e), r === e)) return;
      Tn("history", { from: r, to: e });
    }),
    !DZ())
  )
    return;
  function t(e) {
    return function (...r) {
      let n = r.length > 2 ? r[2] : void 0;
      if (n) {
        let o = S2,
          i = Czt(String(n));
        if (((S2 = i), o === i)) return e.apply(this, r);
        Tn("history", { from: o, to: i });
      }
      return e.apply(this, r);
    };
  }
  (Pn(kn.history, "pushState", t), Pn(kn.history, "replaceState", t));
}
function Czt(t) {
  try {
    return new URL(t, kn.location.origin).toString();
  } catch {
    return t;
  }
}
var w2 = {};
function HZ(t) {
  let e = w2[t];
  if (e) return e;
  let r = kn[t];
  if (fR(r)) return (w2[t] = r.bind(kn));
  let n = kn.document;
  if (n && typeof n.createElement == "function")
    try {
      let o = n.createElement("iframe");
      ((o.hidden = !0), n.head.appendChild(o));
      let i = o.contentWindow;
      (i?.[t] && (r = i[t]), n.head.removeChild(o));
    } catch (o) {
      Ize && Te.warn(`Could not create sandbox iframe for ${t} check, bailing to window.${t}: `, o);
    }
  return r && (w2[t] = r.bind(kn));
}
function jZ(t) {
  w2[t] = void 0;
}
var xf = "__sentry_xhr_v3__";
function zZ(t) {
  let e = "xhr";
  (qo(e, t), Go(e, Tzt));
}
function Tzt() {
  if (!kn.XMLHttpRequest) return;
  let t = XMLHttpRequest.prototype;
  ((t.open = new Proxy(t.open, {
    apply(e, r, n) {
      let o = new Error(),
        i = Si() * 1e3,
        s = Wo(n[0]) ? n[0].toUpperCase() : void 0,
        a = Pzt(n[1]);
      if (!s || !a) return e.apply(r, n);
      ((r[xf] = { method: s, url: a, request_headers: {} }),
        s === "POST" && a.match(/sentry_key/) && (r.__sentry_own_request__ = !0));
      let l = () => {
        let c = r[xf];
        if (c && r.readyState === 4) {
          try {
            c.status_code = r.status;
          } catch {}
          let u = { endTimestamp: Si() * 1e3, startTimestamp: i, xhr: r, virtualError: o };
          Tn("xhr", u);
        }
      };
      return (
        "onreadystatechange" in r && typeof r.onreadystatechange == "function"
          ? (r.onreadystatechange = new Proxy(r.onreadystatechange, {
              apply(c, u, p) {
                return (l(), c.apply(u, p));
              },
            }))
          : r.addEventListener("readystatechange", l),
        (r.setRequestHeader = new Proxy(r.setRequestHeader, {
          apply(c, u, p) {
            let [m, f] = p,
              h = u[xf];
            return (h && Wo(m) && Wo(f) && (h.request_headers[m.toLowerCase()] = f), c.apply(u, p));
          },
        })),
        e.apply(r, n)
      );
    },
  })),
    (t.send = new Proxy(t.send, {
      apply(e, r, n) {
        let o = r[xf];
        if (!o) return e.apply(r, n);
        n[0] !== void 0 && (o.body = n[0]);
        let i = { startTimestamp: Si() * 1e3, xhr: r };
        return (Tn("xhr", i), e.apply(r, n));
      },
    })));
}
function Pzt(t) {
  if (Wo(t)) return t;
  try {
    return t.toString();
  } catch {}
}
var Izt = 40;
function VZ(t, e = HZ("fetch")) {
  let r = 0,
    n = 0;
  async function o(i) {
    let s = i.body.length;
    ((r += s), n++);
    let a = {
      body: i.body,
      method: "POST",
      referrerPolicy: "strict-origin",
      headers: t.headers,
      keepalive: r <= 6e4 && n < 15,
      ...t.fetchOptions,
    };
    try {
      let l = await e(t.url, a);
      return {
        statusCode: l.status,
        headers: {
          "x-sentry-rate-limits": l.headers.get("X-Sentry-Rate-Limits"),
          "retry-after": l.headers.get("Retry-After"),
        },
      };
    } catch (l) {
      throw (jZ("fetch"), l);
    } finally {
      ((r -= s), n--);
    }
  }
  return l2(t, o, wf(t.bufferSize || Izt));
}
var Uv = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__;
var kzt = 30;
var Dzt = 50;
function KZ(t, e, r, n) {
  let o = { filename: t, function: e === "<anonymous>" ? fl : e, in_app: !0 };
  return (r !== void 0 && (o.lineno = r), n !== void 0 && (o.colno = n), o);
}
var Mzt = /^\s*at (\S+?)(?::(\d+))(?::(\d+))\s*$/i,
  Ozt =
    /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
  Nzt = /\((\S*)(?::(\d+))(?::(\d+))\)/,
  Lzt = /at (.+?) ?\(data:(.+?),/,
  Bzt = (t) => {
    let e = t.match(Lzt);
    if (e) return { filename: `<data:${e[2]}>`, function: e[1] };
    let r = Mzt.exec(t);
    if (r) {
      let [, o, i, s] = r;
      return KZ(o, fl, +i, +s);
    }
    let n = Ozt.exec(t);
    if (n) {
      if (n[2] && n[2].indexOf("eval") === 0) {
        let a = Nzt.exec(n[2]);
        a && ((n[2] = a[1]), (n[3] = a[2]), (n[4] = a[3]));
      }
      let [i, s] = Lze(n[1] || fl, n[2]);
      return KZ(s, i, n[3] ? +n[3] : void 0, n[4] ? +n[4] : void 0);
    }
  },
  Mze = [kzt, Bzt],
  Fzt =
    /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:[-a-z]+)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i,
  $zt = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i,
  Uzt = (t) => {
    let e = Fzt.exec(t);
    if (e) {
      if (e[3] && e[3].indexOf(" > eval") > -1) {
        let i = $zt.exec(e[3]);
        i && ((e[1] = e[1] || "eval"), (e[3] = i[1]), (e[4] = i[2]), (e[5] = ""));
      }
      let n = e[3],
        o = e[1] || fl;
      return (([o, n] = Lze(o, n)), KZ(n, o, e[4] ? +e[4] : void 0, e[5] ? +e[5] : void 0));
    }
  },
  Oze = [Dzt, Uzt];
var Nze = [Mze, Oze],
  ZZ = U9(...Nze),
  Lze = (t, e) => {
    let r = t.indexOf("safari-extension") !== -1,
      n = t.indexOf("safari-web-extension") !== -1;
    return r || n
      ? [
          t.indexOf("@") !== -1 ? t.split("@")[0] : fl,
          r ? `safari-extension:${e}` : `safari-web-extension:${e}`,
        ]
      : [t, e];
  };
var _2 = 1024,
  qzt = "Breadcrumbs",
  Gzt = (t = {}) => {
    let e = { console: !0, dom: !0, fetch: !0, history: !0, sentry: !0, xhr: !0, ...t };
    return {
      name: qzt,
      setup(r) {
        (e.console && IZ(jzt(r)),
          e.dom && WZ(Hzt(r, e.dom)),
          e.xhr && zZ(zzt(r)),
          e.fetch && OZ(Vzt(r)),
          e.history && gR(Kzt(r)),
          e.sentry && r.on("beforeSendEvent", Wzt(r)));
      },
    };
  },
  Bze = Gzt;
function Wzt(t) {
  return function (r) {
    pr() === t &&
      xl(
        {
          category: `sentry.${r.type === "transaction" ? "transaction" : "event"}`,
          event_id: r.event_id,
          level: r.level,
          message: yl(r),
        },
        { event: r },
      );
  };
}
function Hzt(t, e) {
  return function (n) {
    if (pr() !== t) return;
    let o,
      i,
      s = typeof e == "object" ? e.serializeAttribute : void 0,
      a = typeof e == "object" && typeof e.maxStringLength == "number" ? e.maxStringLength : void 0;
    (a &&
      a > _2 &&
      (Uv &&
        Te.warn(
          `\`dom.maxStringLength\` cannot exceed ${_2}, but a value of ${a} was configured. Sentry will use ${_2} instead.`,
        ),
      (a = _2)),
      typeof s == "string" && (s = [s]));
    try {
      let c = n.event,
        u = Zzt(c) ? c.target : c;
      ((o = tR(u, { keyAttrs: s, maxStringLength: a })), (i = Y9(u)));
    } catch {
      o = "<unknown>";
    }
    if (o.length === 0) return;
    let l = { category: `ui.${n.name}`, message: o };
    (i && (l.data = { "ui.component_name": i }),
      xl(l, { event: n.event, name: n.name, global: n.global }));
  };
}
function jzt(t) {
  return function (r) {
    if (pr() !== t) return;
    let n = {
      category: "console",
      data: { arguments: r.args, logger: "console" },
      level: kZ(r.level),
      message: XL(r.args, " "),
    };
    if (r.level === "assert")
      if (r.args[0] === !1)
        ((n.message = `Assertion failed: ${XL(r.args.slice(1), " ") || "console.assert"}`),
          (n.data.arguments = r.args.slice(1)));
      else return;
    xl(n, { input: r.args, level: r.level });
  };
}
function zzt(t) {
  return function (r) {
    if (pr() !== t) return;
    let { startTimestamp: n, endTimestamp: o } = r,
      i = r.xhr[xf];
    if (!n || !o || !i) return;
    let { method: s, url: a, status_code: l, body: c } = i,
      u = { method: s, url: a, status_code: l },
      p = { xhr: r.xhr, input: c, startTimestamp: n, endTimestamp: o },
      m = { category: "xhr", data: u, type: "http", level: g2(l) };
    (t.emit("beforeOutgoingRequestBreadcrumb", m, p), xl(m, p));
  };
}
function Vzt(t) {
  return function (r) {
    if (pr() !== t) return;
    let { startTimestamp: n, endTimestamp: o } = r;
    if (o && !(r.fetchData.url.match(/sentry_key/) && r.fetchData.method === "POST"))
      if ((r.fetchData.method, r.fetchData.url, r.error)) {
        let i = r.fetchData,
          s = { data: r.error, input: r.args, startTimestamp: n, endTimestamp: o },
          a = { category: "fetch", data: i, level: "error", type: "http" };
        (t.emit("beforeOutgoingRequestBreadcrumb", a, s), xl(a, s));
      } else {
        let i = r.response,
          s = { ...r.fetchData, status_code: i?.status };
        (r.fetchData.request_body_size, r.fetchData.response_body_size, i?.status);
        let a = { input: r.args, response: i, startTimestamp: n, endTimestamp: o },
          l = { category: "fetch", data: s, type: "http", level: g2(s.status_code) };
        (t.emit("beforeOutgoingRequestBreadcrumb", l, a), xl(l, a));
      }
  };
}
