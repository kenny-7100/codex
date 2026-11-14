var dGe = g(() => {
  gi();
  Tr();
  Yr();
  wo();
});
async function pGe(t, e) {
  try {
    let r = zt(t, e);
    return (
      await Cn(e, void 0, r.hostname),
      await gGt({ ...t, appServerClient: e, number: r.number, repo: r.repo })
    );
  } catch (r) {
    return { status: "error", error: r instanceof Error ? r.message : String(r) };
  }
}
async function gGt(t) {
  let { appServerClient: e, ...r } = t;
  for (let n of yGt(r)) {
    let o = await Le(n, {
      appServerClient: e,
      timeoutMs: r.action === "request-reviewers" || r.action === "remove-reviewers" ? 6e4 : 15e3,
    });
    if (!o.success) return $r(o, "Failed to update pull request");
  }
  return { status: "success" };
}
function yGt(t) {
  switch (t.action) {
    case "close":
    case "reopen":
      return [Pc(["pr", t.action, String(t.number)], t.repo)];
    case "toggle-auto-merge":
      return t.enabled
        ? [
            Pc(
              [
                "pr",
                "merge",
                String(t.number),
                "--auto",
                t.mergeMethod === "squash" ? "--squash" : "--merge",
              ],
              t.repo,
            ),
          ]
        : [Pc(["pr", "merge", String(t.number), "--disable-auto"], t.repo)];
    case "mark-draft":
      return [Pc(["pr", "ready", String(t.number), "--undo"], t.repo)];
    case "mark-ready":
      return [Pc(["pr", "ready", String(t.number)], t.repo)];
    case "reopen-ready":
      return [
        Pc(["pr", "reopen", String(t.number)], t.repo),
        Pc(["pr", "ready", String(t.number)], t.repo),
      ];
    case "request-reviewers":
    case "remove-reviewers": {
      let e = t.action === "remove-reviewers" ? t.teamReviewers : [];
      if (t.reviewers.length === 0 && e.length === 0)
        throw new Error("At least one reviewer is required");
      let r = Js(t.repo);
      if (r == null) throw new Error("No GitHub repository found for reviewer request");
      let n = [
        "api",
        `repos/${r.owner}/${r.repo}/pulls/${t.number}/requested_reviewers`,
        "--method",
        t.action === "request-reviewers" ? "POST" : "DELETE",
        ...t.reviewers.flatMap((o) => ["-f", `reviewers[]=${o}`]),
        ...e.flatMap((o) => ["-f", `team_reviewers[]=${o}`]),
      ];
      return (r.hostname != null && n.push("--hostname", r.hostname), [n]);
    }
    case "update-body":
      return [Pc(["pr", "edit", String(t.number), "--body", t.body], t.repo)];
    case "update-title":
      return [Pc(["pr", "edit", String(t.number), "--title", t.title], t.repo)];
  }
}
function Pc(t, e) {
  return e == null ? t : [...t, "--repo", e];
}
var F8 = g(() => {
  gi();
  Tr();
  Yr();
  wo();
});
function ZN(t, e) {
  let r = (i) => (s, a) => i(s, t, e(vGt(s)), a),
    n = (i) => (s, a) => i(s, e(s.account.hostId), a),
    o = {
      "gh-cli-status": ({ hostId: i, hostname: s }, a) => e8(e(i), a, s),
      "gh-current-user": ({ hostId: i, hostname: s }) => gv(e(i), s),
      "gh-user-search": n(nGe),
      "gh-pr-create": r(SUe),
      "gh-pr-board": (i) => Tqe(i, t, e),
      "gh-pr-search": (i, s) => sGe({ ...i, appServerClient: e(i.account.hostId), signal: s }),
      "gh-pr-media": (i) => tGe(i, e(i.account.hostId)),
      "gh-pr-metadata": n(qqe),
      "gh-pr-mergeability": n(Gqe),
      "gh-pr-reviews": n(Wqe),
      "gh-pr-discussion": n(Sqe),
      "gh-pr-for-branch": r(WUe),
      "gh-pr-summary": n(Yqe),
      "gh-pr-body": n(zUe),
      "gh-pr-diff": r($Ue),
      "gh-pr-gitattributes": n($qe),
      "gh-pr-review-snapshot": n(Nqe),
      "gh-pr-stack": (i, s, a) => Zqe(i, e(i.account.hostId), s, a),
      "gh-pr-revision-diff": n(Lqe),
      "gh-pr-revision-file": n(Bqe),
      "gh-pr-comment": n(BUe),
      "gh-pr-comment-update": n(lGe),
      "gh-pr-review-thread-update": n(uGe),
      "gh-pr-merge": n(Iqe),
      "gh-pr-submit-review": (i) => aGe(i, e(i.account.hostId)),
      "gh-pr-update": n(pGe),
    };
  return (i, s, a, l, c) => Xr({ requestKind: i, source: a }, () => o[i](s, l, c));
}
function vGt(t) {
  return "account" in t ? t.account.hostId : t.hostId;
}
var $8 = g(() => {
  ul();
  s8();
  t8();
  HUe();
  gi();
  p8();
  a8();
  wqe();
  S8();
  w8();
  Uqe();
  Hqe();
  A8();
  Xqe();
  Jqe();
  M8();
  N8();
  L8();
  B8();
  cGe();
  dGe();
  F8();
});
var mGe = g(() => {
  $u();
});
var fGe,
  Gnn,
  Wnn,
  hGe = g(() => {
    $u();
    dm();
    um();
    ((fGe = `FROM automation_runs
  JOIN automations ON automations.id = automation_runs.automation_id`),
      (Gnn = `${fGe}
  WHERE automation_runs.status IN ${W_e}
    AND ${H0}`),
      (Wnn = `${fGe}
  WHERE read_at IS NULL AND automation_runs.status IN ('PENDING_REVIEW', 'ACCEPTED')
    AND ${H0}`));
  });
var gGe = g(() => {
  dm();
  um();
});
function wGt(t) {
  if (t?.type === "request") return "other_request";
  if (t?.type === "response") return "other_response";
  if (t?.type !== "broadcast") return "unknown";
  if (t.method === "thread-stream-state-changed") {
    let e = t.params?.change?.type;
    return e === "snapshot" || e === "patches" ? e : "unknown";
  }
  return t.method === "thread-stream-following-changed" ||
    t.method === "thread-stream-following-status-requested"
    ? "follower_coordination"
    : "other_broadcast";
}
var vGe,
  yGe,
  SGt,
  U8,
  UA,
  q8 = g(() => {
    ((vGe = require("node:perf_hooks")),
      (yGe = ["client", "router"]),
      (SGt = [
        "snapshot",
        "patches",
        "follower_coordination",
        "other_request",
        "other_response",
        "other_broadcast",
        "unknown",
      ]),
      (U8 = class {
        constructor(e = () => vGe.performance.now()) {
          this.now = e;
          for (let r of yGe) {
            for (let n of [
              "rx_announced_frames_total",
              "rx_announced_bytes_total",
              "rx_frame_bytes_max",
              "rx_failures_total",
              "rx_abandoned_frames_total",
              "rx_decode_ms_total",
              "rx_decode_chunk_ms_max",
              "tx_frames_total",
              "tx_bytes_total",
              "tx_frame_bytes_max",
              "tx_backpressure_total",
              "tx_write_failures_total",
              "tx_abandoned_frames_total",
              "tx_abandoned_bytes_total",
              "tx_socket_pending_bytes_max",
              "tx_socket_writable_bytes_max",
            ])
              this.totals[`main_ipc_${r}_${n}`] = 0;
            for (let n of SGt)
              for (let o of ["frames_total", "bytes_total", "bytes_max"])
                this.totals[`main_ipc_${r}_rx_${n}_${o}`] = 0;
          }
        }
        connections = new Map();
        totals = {};
        attach(e, r) {
          let n = {
            socket: e,
            role: r,
            active: !1,
            announcedBytes: 0,
            receivedBytes: 0,
            startedAtMs: 0,
            decoding: !1,
            decodeStartedAtMs: 0,
            pendingWrites: 0,
            pendingWriteBytes: 0,
            closed: !1,
          };
          this.connections.set(e, n);
          let o = `main_ipc_${r}_rx_`,
            i = () => {
              if (!n.decoding) return;
              let a = Math.max(0, this.now() - n.decodeStartedAtMs);
              ((this.totals[`${o}decode_ms_total`] += a),
                (this.totals[`${o}decode_chunk_ms_max`] = Math.max(
                  this.totals[`${o}decode_chunk_ms_max`],
                  a,
                )),
                (n.decoding = !1));
            },
            s = () => {
              n.closed ||
                (i(),
                n.active && (this.totals[`${o}abandoned_frames_total`] += 1),
                (this.totals[`main_ipc_${r}_tx_abandoned_frames_total`] += n.pendingWrites),
                (this.totals[`main_ipc_${r}_tx_abandoned_bytes_total`] += n.pendingWriteBytes),
                (n.closed = !0),
                this.connections.delete(e),
                e.off("close", s),
                e.off("error", s));
            };
          return (
            e.on("close", s),
            e.on("error", s),
            {
              begin: (a) => {
                n.closed ||
                  ((n.active = !0),
                  (n.announcedBytes = a),
                  (n.receivedBytes = 0),
                  (n.startedAtMs = this.now()),
                  (this.totals[`${o}announced_frames_total`] += 1),
                  (this.totals[`${o}announced_bytes_total`] += a),
                  (this.totals[`${o}frame_bytes_max`] = Math.max(
                    this.totals[`${o}frame_bytes_max`],
                    a,
                  )));
              },
              decode: (a) => {
                n.closed ||
                  ((n.receivedBytes += a), (n.decoding = !0), (n.decodeStartedAtMs = this.now()));
              },
              endDecode: i,
              complete: (a) => {
                if (n.closed) return;
                i();
                let l = wGt(a);
                ((this.totals[`${o}${l}_frames_total`] += 1),
                  (this.totals[`${o}${l}_bytes_total`] += n.announcedBytes),
                  (this.totals[`${o}${l}_bytes_max`] = Math.max(
                    this.totals[`${o}${l}_bytes_max`],
                    n.announcedBytes,
                  )),
                  (n.active = !1));
              },
              fail: () => {
                n.closed || ((this.totals[`${o}failures_total`] += 1), s());
              },
              close: s,
            }
          );
        }
        beginWrite(e, r) {
          let n = this.connections.get(e);
          if (!n) return;
          let o = `main_ipc_${n.role}_tx_`;
          ((n.pendingWrites += 1),
            (n.pendingWriteBytes += r),
            (this.totals[`${o}frames_total`] += 1),
            (this.totals[`${o}bytes_total`] += r),
            (this.totals[`${o}frame_bytes_max`] = Math.max(this.totals[`${o}frame_bytes_max`], r)),
            (this.totals[`${o}socket_pending_bytes_max`] = Math.max(
              this.totals[`${o}socket_pending_bytes_max`],
              n.pendingWriteBytes,
            )));
          let i = !1;
          return (s) => {
            i ||
              n.closed ||
              ((i = !0),
              (n.pendingWrites -= 1),
              (n.pendingWriteBytes -= r),
              s != null && (this.totals[`${o}write_failures_total`] += 1));
          };
        }
        wrote(e, r) {
          let n = this.connections.get(e);
          if (!n) return;
          let o = `main_ipc_${n.role}_tx_`;
          (r || (this.totals[`${o}backpressure_total`] += 1),
            (this.totals[`${o}socket_writable_bytes_max`] = Math.max(
              this.totals[`${o}socket_writable_bytes_max`],
              e.writableLength,
            )));
        }
        snapshot() {
          let e = { ...this.totals },
            r = this.now();
          e.main_ipc_sample_monotonic_ms = r;
          for (let n of yGe) {
            let o = `main_ipc_${n}_`;
            for (let i of [
              "connections",
              "rx_active_frames",
              "rx_active_announced_bytes",
              "rx_active_received_bytes",
              "rx_oldest_active_ms",
              "rx_decoding_frames",
              "tx_pending_frames",
              "tx_pending_bytes",
              "tx_writable_bytes",
            ])
              e[`${o}${i}`] = 0;
          }
          for (let n of this.connections.values()) {
            let o = `main_ipc_${n.role}_`;
            ((e[`${o}connections`] += 1),
              n.active &&
                ((e[`${o}rx_active_frames`] += 1),
                (e[`${o}rx_active_announced_bytes`] += n.announcedBytes),
                (e[`${o}rx_active_received_bytes`] += n.receivedBytes),
                (e[`${o}rx_oldest_active_ms`] = Math.max(
                  e[`${o}rx_oldest_active_ms`],
                  r - n.startedAtMs,
                ))),
              n.decoding && (e[`${o}rx_decoding_frames`] += 1),
              (e[`${o}tx_pending_frames`] += n.pendingWrites),
              (e[`${o}tx_pending_bytes`] += n.pendingWriteBytes),
              (e[`${o}tx_writable_bytes`] += n.socket.writableLength));
          }
          return e;
        }
      }),
      (UA = new U8()));
  });
function YN() {
  if (process.platform === "win32") return dl.join("\\\\.\\pipe", "codex-ipc");
  let t = dl.join(Xt(), "ipc"),
    e = dl.join(t, "ipc.sock"),
    r = G8(t);
  if (Buffer.byteLength(e) <= xGt) return e;
  let n = dl.join("/tmp", `codex-ipc-${r}`);
  G8(n);
  let o = no.realpathSync(t),
    i = dl.join(n, (0, bGe.createHash)("sha256").update(o).digest("hex"));
  try {
    no.symlinkSync(o, i);
  } catch (s) {
    if (!(s instanceof Error && "code" in s && s.code === "EEXIST") || no.readlinkSync(i) !== o)
      throw s;
  }
  return dl.join(i, "ipc.sock");
}
function G8(t) {
  no.mkdirSync(t, { mode: 448, recursive: !0 });
  let e = no.lstatSync(t),
    r = process.getuid?.();
  if (r == null || !e.isDirectory() || e.uid !== r)
    throw new Error("Codex IPC directory is not owned by the current user");
  return (no.chmodSync(t, 448), r);
}
function _Ge() {
  let t = process.getuid?.();
  return dl.join(SGe.tmpdir(), "codex-ipc", t ? `ipc-${t}.sock` : "ipc.sock");
}
function W8(t, e) {
  try {
    let r = no.lstatSync(t);
    return r.isSocket() && r.uid === e;
  } catch {
    return !1;
  }
}
function xGe(t) {
  let e = process.getuid?.();
  if (e == null) return !1;
  try {
    let r = no.lstatSync(dl.dirname(t)),
      n = (r.mode & 18) !== 0;
    return W8(t, e) && r.isDirectory() && r.uid === e && !n;
  } catch {
    return !1;
  }
}
function AGe(t) {
  let e = process.getuid?.();
  e != null && W8(t, e) && no.unlinkSync(t);
}
function RGe(t) {
  if (process.platform === "win32") return;
  let e = process.getuid?.();
  if (e == null || !W8(t, e)) throw new Error("Codex IPC socket is not owned by the current user");
  no.chmodSync(t, 384);
}
function JN(t, e, r, n, o) {
  let i = o == null ? void 0 : UA.attach(t, o),
    s = Buffer.allocUnsafe(4),
    a = new wGe.StringDecoder("utf8"),
    l = 0,
    c = 0,
    u = 0,
    p = "",
    m = "",
    f = 0,
    h = (y, w) => {
      i?.fail();
      let _ = y instanceof Error ? y : new Error(String(y));
      try {
        (n.reportNonFatal(_, { kind: "ipc-attachMessageReader", extra: w }), r(_));
      } catch {
      } finally {
        ((p = ""), (m = ""), a.end(), t.off("data", v), t.destroy());
      }
    },
    v = (y) => {
      if (y.length === 0) return;
      let w = 0;
      for (; w < y.length; ) {
        if (c === 0) {
          let T = Math.min(s.length - l, y.length - w);
          if ((y.copy(s, l, w, w + T), (l += T), (w += T), l < s.length)) return;
          if (((c = s.readUInt32LE(0)), (l = 0), c === 0 || c > XN)) {
            h(new Error(`[IPC] Invalid frame length (${c} bytes)`));
            return;
          }
          i?.begin(c);
        }
        let _ = Math.min(c - u, y.length - w);
        if (_ === 0) return;
        let S = y.subarray(w, w + _);
        ((u += _), (w += _));
        let E;
        i?.decode(_);
        try {
          if (u < c) {
            ((m += a.write(S)),
              (f += 1),
              f === _Gt && ((p += Buffer.from(m, "utf8").toString("utf8")), (m = ""), (f = 0)),
              i?.endDecode());
            return;
          }
          c = 0;
          let T = u === _ ? S.toString("utf8") : p + m + a.end(S);
          ((u = 0), (p = ""), (m = ""), (f = 0), (E = JSON.parse(T)), i?.complete(E));
        } catch (T) {
          h(T);
          return;
        }
        try {
          e(E);
        } catch (T) {
          h(T);
          return;
        }
      }
    };
  return (
    t.on("data", v),
    () => {
      (i?.close(), (p = ""), (m = ""), a.end(), t.off("data", v));
    }
  );
}
function Gr(t, e, r) {
  let n = r ?? j8(e);
  AGt().trace("Write message", { safe: { frameBytes: n.length }, sensitive: {} });
  let o = UA.beginWrite(t, n.length);
  try {
    let i = t.write(n, o);
    UA.wrote(t, i);
  } catch (i) {
    throw (o?.(new Error("IPC write failed")), i);
  }
}
function H8(t) {
  let e = Buffer.byteLength(t, "utf8"),
    r = Buffer.alloc(4 + e);
  return (r.writeUInt32LE(e, 0), r.write(t, 4, "utf8"), r);
}
function j8(t) {
  return H8(JSON.stringify(t));
}
var bGe,
  no,
  SGe,
  dl,
  wGe,
  XN,
  _Gt,
  xGt,
  AGt,
  qA = g(() => {
    ((bGe = require("node:crypto")),
      (no = F(require("node:fs"))),
      (SGe = F(require("node:os"))),
      (dl = F(require("node:path"))),
      (wGe = require("node:string_decoder")));
    Bn();
    Bt();
    q8();
    ((XN = 256 * 1024 * 1024),
      (_Gt = 1024),
      (xGt = process.platform === "linux" ? 107 : 103),
      (AGt = Ie("ipc")));
  });
var z8,
  EGe,
  RGt,
  GA,
  V8 = g(() => {
    z8 = require("crypto");
    O();
    $();
    Bt();
    qA();
    ((EGe = 1e4),
      (RGt = d.object({ canHandle: d.boolean() })),
      (GA = class {
        constructor(e, r) {
          this.server = e;
          this.errorReporter = r;
        }
        logger = Dt("IpcRouter");
        clients = new Map();
        clientsById = new Map();
        pendingRequests = new Map();
        pendingClientDiscoveryRequests = new Map();
        start() {
          (this.server.on("connection", (e) => {
            this.logger.info("I am the router");
            let r = JN(
                e,
                (o) => void this.handleMessage(e, o),
                (o) => {
                  (this.logger.error("Failed to parse message", {
                    safe: {},
                    sensitive: { error: o },
                  }),
                    e.destroy());
                },
                this.errorReporter,
                "router",
              ),
              n = () => {
                (r(), this.unregisterClient(e));
              };
            (e.on("close", n),
              e.on("end", n),
              e.on("error", (o) => {
                this.logger.warning("Socket error", { safe: {}, sensitive: { error: o } });
              }));
          }),
            this.server.on("close", () => {
              (this.logger.info("Server closed"), this.clients.clear(), this.clientsById.clear());
              for (let [e, r] of this.pendingRequests.entries())
                (clearTimeout(r.timeout),
                  this.pendingRequests.delete(e),
                  r.sourceSocket.writable &&
                    Gr(r.sourceSocket, {
                      type: "response",
                      requestId: r.originalRequestId,
                      resultType: "error",
                      error: "server-closed",
                    }));
              for (let [, e] of this.pendingClientDiscoveryRequests.entries())
                (clearTimeout(e.timeout), e.reject(new Error("server-closed")));
              this.pendingClientDiscoveryRequests.clear();
            }));
        }
        async handleMessage(e, r) {
          switch (r.type) {
            case "broadcast": {
              this.handleBroadcast(e, r);
              return;
            }
            case "request": {
              this.handleRequest(e, r);
              return;
            }
            case "response": {
              this.handleResponse(r);
              return;
            }
            case "client-discovery-request": {
              this.logger.warning("Received unexpected client discovery request");
              return;
            }
            case "client-discovery-response": {
              this.handleClientDiscoveryResponse(r);
              return;
            }
          }
        }
        handleBroadcast(e, r) {
          let n = r.targetClientIds == null ? null : new Set(r.targetClientIds),
            o = Array.from(this.clients.values()).filter(
              (l) => l.socket !== e && l.socket.writable && (n == null || n.has(l.id)),
            );
          if (o.length === 0) return;
          let s = this.clients.get(e)?.id ?? r.sourceClientId,
            a = { ...r, sourceClientId: s };
          try {
            let l = j8(a);
            for (let c of o) Gr(c.socket, a, l);
          } catch (l) {
            let c = Dw(l);
            this.logger.info("[IPC] Dropping broadcast after send failure", {
              safe: { method: r.method, recipientCount: o.length },
              sensitive: { error: c },
            });
          }
        }
        async handleRequest(e, r) {
          if (r.method === "initialize") {
            this.registerClient(e, r.requestId, r.params);
            return;
          }
          try {
            let n = await this.findClientForRequest(e, r);
            this.forwardRequest(e, r, n);
          } catch {
            Gr(e, {
              type: "response",
              requestId: r.requestId,
              resultType: "error",
              error: "no-client-found",
            });
          }
        }
        async handleResponse(e) {
          let r = this.pendingRequests.get(e.requestId);
          if (!r) {
            this.logger.warning("No pending request found for response", {
              safe: { requestId: e.requestId },
              sensitive: {},
            });
            return;
          }
          (clearTimeout(r.timeout),
            this.pendingRequests.delete(e.requestId),
            r.sourceSocket.writable && Gr(r.sourceSocket, e));
        }
        async findClientForRequest(e, r) {
          if (r.targetClientId) {
            let o = this.clientsById.get(r.targetClientId);
            if (o && o.socket !== e) return (await this.sendClientDiscoveryRequest(r, o), o);
            throw new Error("client-not-found");
          }
          let n = Array.from(this.clients.values()).filter((o) => o.socket !== e);
          return Promise.any(n.map((o) => this.sendClientDiscoveryRequest(r, o)));
        }
        async sendClientDiscoveryRequest(e, r) {
          let n = { type: "client-discovery-request", requestId: (0, z8.randomUUID)(), request: e },
            o = new Promise((i, s) => {
              this.pendingClientDiscoveryRequests.set(n.requestId, {
                clientId: r.id,
                resolve: i,
                reject: s,
                timeout: setTimeout(() => {
                  (this.pendingClientDiscoveryRequests.delete(n.requestId),
                    s(new Error("timeout")));
                }, EGe),
              });
            });
          return (Gr(r.socket, n), o);
        }
        async handleClientDiscoveryResponse(e) {
          let r = this.pendingClientDiscoveryRequests.get(e.requestId);
          if (!r) return;
          let n = this.clientsById.get(r.clientId);
          (this.pendingClientDiscoveryRequests.delete(e.requestId), clearTimeout(r.timeout));
          let o = RGt.safeParse(e.response),
            i = o.success && o.data.canHandle;
          if (i && n) {
            r.resolve(n);
            return;
          } else
            i
              ? r.reject(new Error("client-disconnected"))
              : r.reject(new Error("client-cannot-handle-request"));
        }
        registerClient(e, r, n) {
          let o = this.clients.get(e);
          if (o) {
            (this.logger.debug("Client re-registered", {
              safe: { clientId: o.id, clientType: n.clientType },
              sensitive: {},
            }),
              Gr(e, {
                type: "response",
                requestId: r,
                resultType: "success",
                method: "initialize",
                handledByClientId: o.id,
                result: { clientId: o.id },
              }));
            return;
          }
          let i = (0, z8.randomUUID)(),
            s = { id: i, type: n.clientType, socket: e };
          (this.clients.set(e, s),
            this.clientsById.set(i, s),
            this.broadcastClientStatus(s, "connected"),
            Gr(e, {
              type: "response",
              requestId: r,
              resultType: "success",
              method: "initialize",
              handledByClientId: i,
              result: { clientId: i },
            }));
        }
        unregisterClient(e) {
          let r = this.clients.get(e);
          if (r) {
            (this.clients.delete(e),
              this.clientsById.delete(r.id),
              this.broadcastClientStatus(r, "disconnected"));
            for (let [n, o] of this.pendingRequests.entries())
              (o.targetClientId === r.id || o.sourceClientId === r.id) &&
                (clearTimeout(o.timeout),
                this.pendingRequests.delete(n),
                o.sourceClientId !== r.id &&
                  o.sourceSocket.writable &&
                  Gr(o.sourceSocket, {
                    type: "response",
                    requestId: o.originalRequestId,
                    resultType: "error",
                    error: "client-disconnected",
                  }));
            for (let [n, o] of this.pendingClientDiscoveryRequests.entries())
              o.clientId === r.id &&
                (clearTimeout(o.timeout),
                this.pendingClientDiscoveryRequests.delete(n),
                o.reject(new Error("client-disconnected")));
          }
        }
        broadcastClientStatus(e, r) {
          this.logger.debug("Broadcasting client status change to all clients", {
            safe: { clientId: e.id, status: r },
            sensitive: {},
          });
          let n = {
            type: "broadcast",
            method: "client-status-changed",
            sourceClientId: e.id,
            version: Vl("client-status-changed"),
            params: { clientId: e.id, clientType: e.type, status: r },
          };
          for (let o of this.clients.values()) o.id !== e.id && Gr(o.socket, n);
        }
        forwardRequest(e, r, n, o) {
          this.logger.debug("Forwarding message to client", {
            safe: { method: r.method, targetClientId: n.id },
            sensitive: {},
          });
          let i = r.requestId,
            s = setTimeout(() => {
              let a = this.pendingRequests.get(i);
              a &&
                (this.pendingRequests.delete(i),
                a.sourceSocket.writable &&
                  Gr(a.sourceSocket, {
                    type: "response",
                    requestId: a.originalRequestId,
                    resultType: "error",
                    error: "request-timeout",
                  }));
            }, r.timeoutMs ?? EGe);
          (this.pendingRequests.set(i, {
            sourceClientId: r.sourceClientId ?? "",
            sourceSocket: e,
            targetClientId: n.id,
            originalRequestId: o ?? r.requestId,
            timeout: s,
          }),
            Gr(n.socket, { ...r, requestId: i }));
        }
      }));
  });
var QN,
  WA,
  K8 = g(() => {
    QN = F(require("node:net"));
    Bt();
    V8();
    qA();
    WA = class {
      constructor(e) {
        this.errorReporter = e;
      }
      logger = Dt("IpcRouterManager");
      routerStarted = !1;
      async getOrStartRouterEndpoint() {
        let e = YN();
        if (this.routerStarted) return (this.logger.debug("Router already started."), e);
        if ((this.logger.debug("Starting router..."), process.platform !== "win32")) {
          if (await this.canConnectToEndpoint(e)) return e;
          let o = _Ge();
          if (xGe(o) && (await this.canConnectToEndpoint(o))) return o;
          try {
            AGe(e);
          } catch {}
        }
        let r = QN.createServer(),
          n = new GA(r, this.errorReporter);
        return (
          r.on("error", (o) => {
            if (o.code === "EADDRINUSE") {
              (this.logger.debug("Another router is active."), r.close());
              return;
            }
            this.logger.error("Server error", { safe: {}, sensitive: { error: o } });
          }),
          r.listen(e, () => {
            try {
              RGe(e);
            } catch (o) {
              (this.logger.error("Unable to secure IPC socket", {
                safe: {},
                sensitive: { error: o },
              }),
                r.close());
              return;
            }
            ((this.routerStarted = !0),
              this.logger.debug("Listening on", { safe: {}, sensitive: { socketPath: e } }),
              n.start());
          }),
          e
        );
      }
      async canConnectToEndpoint(e) {
        return new Promise((r) => {
          let n = QN.connect(e, () => {
            (n.end(), r(!0));
          });
          n.on("error", () => r(!1));
        });
      }
    };
  });
var CGe,
  TGe,
  EGt,
  CGt,
  bv,
  af,
  PGe = g(() => {
    ((CGe = require("node:crypto")), (TGe = F(require("node:net"))));
    O();
    Bt();
    K8();
    qA();
    ((EGt = 1e3),
      (CGt = 5e3),
      (bv = "initializing-client"),
      (af = class {
        constructor(e, r) {
          this.clientType = e;
          ((this.errorReporter = r), (this.routerManager = new WA(r)), this.connect());
        }
        logger = Dt("IpcClient");
        routerManager;
        errorReporter;
        requestHandlers = new Map();
        broadcastHandlers = new Map();
        anyBroadcastHandlers = new Set();
        pendingResponses = new Map();
        initializationWaiters = new Set();
        disposed = !1;
        detachReader = null;
        clientId = bv;
        socket = null;
        async sendBroadcast(e, r, { targetClientIds: n } = {}) {
          if (!this.socket || !this.socket.writable) throw new Error("not-connected");
          if (n?.length === 0) return;
          let o = Vl(e),
            i = {
              type: "broadcast",
              method: e,
              sourceClientId: this.clientId,
              targetClientIds: n,
              params: r,
              version: o,
            },
            s = JSON.stringify(i),
            a = Buffer.byteLength(s, "utf8");
          if (a > XN) {
            this.logger.warning("[IPC] Dropping broadcast: payload too large", {
              safe: { method: e, payloadBytes: a, maxIpcFrameBytes: XN },
              sensitive: {},
            });
            return;
          }
          let l = H8(s);
          Gr(this.socket, i, l);
        }
        addBroadcastHandler(e, r) {
          return (
            this.broadcastHandlers.set(e, r),
            () => {
              this.broadcastHandlers.delete(e);
            }
          );
        }
        addAnyBroadcastHandler(e) {
          return (
            this.anyBroadcastHandlers.add(e),
            () => {
              this.anyBroadcastHandlers.delete(e);
            }
          );
        }
        async sendRequest(e, r, { targetClientId: n, hostId: o, timeoutMs: i } = {}) {
          let s = this.socket;
          if (!s || !s.writable) throw new Error("not-connected");
          if (this.clientId === bv && e !== "initialize") throw new Error("not-initialized");
          let a = i ?? CGt,
            l = {
              type: "request",
              requestId: (0, CGe.randomUUID)(),
              sourceClientId: this.clientId,
              version: hW(e, r, o),
              method: e,
              params: r,
              targetClientId: n,
              hostId: o,
              timeoutMs: i,
            };
          return new Promise((c, u) => {
            let p = setTimeout(() => {
              (this.pendingResponses.delete(l.requestId), u(new Error("timeout")));
            }, a);
            (this.pendingResponses.set(l.requestId, {
              resolve: (m) => {
                c(m);
              },
              reject: u,
              timer: p,
            }),
              Gr(s, l));
          });
        }
        addRequestHandler(e, r, n) {
          return (
            this.requestHandlers.set(e, [r, n]),
            () => {
              this.requestHandlers.delete(e);
            }
          );
        }
        waitUntilInitialized({ timeoutMs: e } = {}) {
          return this.disposed
            ? Promise.reject(new Error("disposed"))
            : this.clientId !== bv
              ? Promise.resolve()
              : new Promise((r, n) => {
                  let o,
                    i = {
                      resolve: () => {
                        (o != null && clearTimeout(o), r());
                      },
                      reject: (s) => {
                        (o != null && clearTimeout(o), n(s));
                      },
                    };
                  (this.initializationWaiters.add(i),
                    e != null &&
                      (o = setTimeout(() => {
                        (this.initializationWaiters.delete(i),
                          n(new Error("initialization-timeout")));
                      }, e)));
                });
        }
        async connect() {
          if (this.disposed) return;
          let e;
          try {
            e = await this.routerManager.getOrStartRouterEndpoint();
          } catch (r) {
            (this.logger.warning("Unable to start router if needed", {
              safe: {},
              sensitive: { error: r },
            }),
              (e = YN()));
          }
          await new Promise((r) => {
            let n = TGe.connect(e, () => {
              if (this.disposed) {
                (n.destroy(), r());
                return;
              }
              ((this.socket = n),
                (this.detachReader = JN(
                  n,
                  (o) => this.handleMessage(o),
                  (o) => {
                    (this.logger.warning("Failed to parse message", {
                      safe: {},
                      sensitive: { err: o },
                    }),
                      n.destroy());
                  },
                  this.errorReporter,
                  "client",
                )),
                this.sendRequest("initialize", { clientType: this.clientType }).catch((o) => {
                  (this.logger.warning("Initialize failed", { safe: {}, sensitive: { error: o } }),
                    n.destroy());
                }),
                r());
            });
            (n.on("error", (o) => {
              (this.logger.debug("Connect error", { safe: {}, sensitive: { error: o } }), r());
            }),
              n.on("close", () => {
                (this.detachReader && (this.detachReader(), (this.detachReader = null)),
                  this.emitIpcConnectionReset(),
                  (this.clientId = bv));
                for (let [o, i] of this.pendingResponses.entries())
                  (clearTimeout(i.timer),
                    i.reject(new Error("connection-closed")),
                    this.pendingResponses.delete(o));
                this.disposed ||
                  setTimeout(() => {
                    this.connect();
                  }, EGt);
              }));
          });
        }
        handleMessage(e) {
          switch (e.type) {
            case "broadcast": {
              this.handleBroadcast(e);
              return;
            }
            case "client-discovery-request": {
              this.handleClientDiscoveryRequest(e);
              return;
            }
            case "client-discovery-response": {
              this.logger.warning("Received unexpected client discovery response");
              return;
            }
            case "response": {
              let r = this.pendingResponses.get(e.requestId);
              r &&
                (this.pendingResponses.delete(e.requestId),
                clearTimeout(r.timer),
                e.resultType === "success" &&
                  e.method === "initialize" &&
                  this.markInitialized(e.result.clientId),
                r.resolve(e));
              return;
            }
            case "request": {
              this.handleRequest(e);
              return;
            }
          }
        }
        async handleBroadcast(e) {
          if (e.targetClientIds != null && !e.targetClientIds.includes(this.clientId)) return;
          let r = this.broadcastHandlers.get(e.method);
          if (
            (this.anyBroadcastHandlers.size > 0 &&
              (await Promise.all(Array.from(this.anyBroadcastHandlers).map((n) => n(e)))),
            r)
          ) {
            await r(e);
            return;
          }
          this.anyBroadcastHandlers.size === 0 &&
            this.logger.warning("Received broadcast but no handler is configured", {
              safe: { method: e.method },
              sensitive: {},
            });
        }
        emitSelfClientConnected() {
          this.clientId !== bv &&
            this.handleBroadcast({
              type: "broadcast",
              method: "client-status-changed",
              sourceClientId: this.clientId,
              version: Vl("client-status-changed"),
              params: {
                clientId: this.clientId,
                clientType: this.clientType,
                isSelf: !0,
                status: "connected",
              },
            });
        }
        emitIpcConnectionReset() {
          this.clientId !== bv &&
            this.handleBroadcast({
              type: "broadcast",
              method: "ipc-connection-reset",
              sourceClientId: this.clientId,
              version: Vl("ipc-connection-reset"),
              params: {},
            });
        }
        async handleClientDiscoveryRequest(e) {
          let r = this.socket;
          if (!r) {
            this.logger.warning("Received ipc request but there is no socket");
            return;
          }
          let n = e.request,
            o = n.version ?? 0;
          if (!gW(n.method, o, n.hostId)) {
            Gr(r, {
              type: "client-discovery-response",
              requestId: e.requestId,
              response: { canHandle: !1 },
            });
            return;
          }
          try {
            let i = this.requestHandlers.get(n.method);
            if (!i) {
              Gr(r, {
                type: "client-discovery-response",
                requestId: e.requestId,
                response: { canHandle: !1 },
              });
              return;
            }
            let [s] = i,
              a = await s(n.params, n);
            Gr(r, {
              type: "client-discovery-response",
              requestId: e.requestId,
              response: { canHandle: a },
            });
          } catch {
            Gr(r, {
              type: "client-discovery-response",
              requestId: e.requestId,
              response: { canHandle: !1 },
            });
          }
        }
        async handleRequest(e) {
          let r = this.socket;
          if (!r) {
            this.logger.warning("Received ipc request but there is no socket");
            return;
          }
          let n = e.version ?? 0;
          if (!gW(e.method, n, e.hostId)) {
            Gr(r, {
              type: "response",
              requestId: e.requestId,
              resultType: "error",
              error: "request-version-mismatch",
            });
            return;
          }
          try {
            let o = this.requestHandlers.get(e.method);
            if (!o) {
              (this.logger.warning("Received ipc request but no handler is configured", {
                safe: { method: e.method },
                sensitive: {},
              }),
                Gr(r, {
                  type: "response",
                  requestId: e.requestId,
                  resultType: "error",
                  error: "no-handler-for-request",
                }));
              return;
            }
            let [i, s] = o,
              a = await s(e);
            Gr(r, {
              type: "response",
              requestId: e.requestId,
              resultType: "success",
              method: e.method,
              handledByClientId: this.clientId,
              result: a,
            });
          } catch (o) {
            Gr(r, {
              type: "response",
              requestId: e.requestId,
              resultType: "error",
              error: o instanceof Error ? o.message : "error-handling-request",
            });
          }
        }
        dispose() {
          this.disposed = !0;
          for (let e of this.initializationWaiters) e.reject(new Error("disposed"));
          this.initializationWaiters.clear();
          for (let [, e] of this.pendingResponses)
            (clearTimeout(e.timer), e.reject(new Error("disposed")));
          (this.pendingResponses.clear(),
            this.detachReader && (this.detachReader(), (this.detachReader = null)),
            this.socket?.destroy());
        }
        getClientId() {
          return this.clientId;
        }
        markInitialized(e) {
          this.clientId = e;
          for (let r of this.initializationWaiters) r.resolve();
          (this.initializationWaiters.clear(), this.emitSelfClientConnected());
        }
      }));
  });
async function eL(t, e) {
  let r = e ?? hs,
    n = Date.now();
  return (await t.waitUntilInitialized({ timeoutMs: r }), Math.max(0, r - (Date.now() - n)));
}
async function IGe(t, e, r) {
  return (
    (await Y8(t.getThreadRole({ hostId: e, conversationId: r }), TGt, "thread-role-timeout")) ===
    "owner"
  );
}
function X8({
  hostId: t,
  ipcClient: e,
  viewService: r,
  registerThreadOwner: n = !0,
  shouldForwardThreadReadState: o,
}) {
  let i = Z8.get(e),
    s = async ({ conversationId: l }, c = t, u = hs) =>
      (await Y8(r.getThreadRole({ hostId: c, conversationId: l }), u, "thread-role-timeout")) ===
      "owner",
    a = [
      e.addAnyBroadcastHandler(async (l) => {
        try {
          if (
            (l.version ?? 0) !== Vl(l.method) ||
            (l.method === "thread-read-state-changed" && !(await o(l.params)))
          )
            return;
          await DGt(l, r);
        } catch {}
      }),
      kGe({
        enabled: n,
        hostId: t,
        ipcClient: e,
        canHandle: s,
        discoverOwner: async (l) =>
          i == null ? s({ conversationId: l }) : i.has(`${t}:${l}`) ? !0 : IGe(r, t, l),
        requestThreadFollower: (l) => r.requestThreadFollower(l),
      }),
    ];
  return () => {
    for (let l of a) l();
  };
}
function kGe({
  enabled: t = !0,
  hostId: e,
  ipcClient: r,
  canHandle: n,
  discoverOwner: o,
  requestThreadFollower: i,
}) {
  if (!t) return () => {};
  let s = (l, c = hs) =>
      r.addRequestHandler(
        l,
        (u, p) => n(u, p.hostId ?? e),
        ({ params: u, hostId: p }) => IGt(i, p ?? e, { method: l, params: u }, c),
      ),
    a = [
      r.addRequestHandler(
        "thread-owner-discovery",
        async ({ hostId: l, conversationId: c }) => (l !== e ? !1 : o(c)),
        async () => ({ supportsUntrustedAppInput: !0 }),
      ),
      s("thread-follower-start-turn"),
      s("thread-follower-load-complete-history", PGt),
      s("thread-follower-compact-thread"),
      s("thread-follower-steer-turn"),
      s("thread-follower-interrupt-turn"),
      s("thread-follower-update-thread-settings"),
      s("thread-follower-update-daybreak"),
      s("thread-follower-read-model-settings"),
      s("thread-follower-edit-last-user-turn"),
      s("thread-follower-command-approval-decision"),
      s("thread-follower-file-approval-decision"),
      s("thread-follower-permissions-request-approval-response"),
      s("thread-follower-submit-user-input"),
      s("thread-follower-submit-mcp-server-elicitation-response"),
      s("thread-follower-set-queued-follow-ups-state"),
      s("thread-follower-remove-queued-message"),
      s("thread-follower-clear-queued-messages"),
    ];
  return () => {
    Z8.get(r)?.clear();
    for (let l of a) l();
  };
}
async function IGt(t, e, r, n) {
  let o = await MGt(t({ hostId: e, request: r }), n, `${r.method}-timeout`);
  if (!kGt(r.method, o)) throw new Error("thread-follower-response-method-mismatch");
  return o.result;
}
function kGt(t, e) {
  return e.method === t;
}
async function DGt(t, e) {
  if ((t.version ?? 0) === Vl(t.method))
    switch (t.method) {
      case "automation-capability-event":
        await e.automationCapabilityEventReceived({
          sourceClientId: t.sourceClientId,
          params: t.params,
        });
        return;
      case "automation-run-triggered-event":
        await e.automationRunTriggeredEventReceived({
          sourceClientId: t.sourceClientId,
          params: t.params,
        });
        return;
      case "client-status-changed":
        await e.clientStatusChanged({ sourceClientId: t.sourceClientId, params: t.params });
        return;
      case "ipc-connection-reset":
        await e.ipcConnectionReset({ sourceClientId: t.sourceClientId, params: t.params });
        return;
      case "thread-stream-state-changed":
        await e.threadStreamStateChanged({ sourceClientId: t.sourceClientId, params: t.params });
        return;
      case "thread-stream-following-changed":
        await e.threadStreamFollowingChanged({
          sourceClientId: t.sourceClientId,
          params: t.params,
        });
        return;
      case "thread-stream-following-status-requested":
        await e.threadStreamFollowingStatusRequested({
          sourceClientId: t.sourceClientId,
          params: t.params,
        });
        return;
      case "thread-read-state-changed":
        await e.threadReadStateChanged({ sourceClientId: t.sourceClientId, params: t.params });
        return;
      case "thread-archived":
        await e.threadArchived({ sourceClientId: t.sourceClientId, params: t.params });
        return;
      case "thread-unarchived":
        await e.threadUnarchived({ sourceClientId: t.sourceClientId, params: t.params });
        return;
      case "thread-queued-followups-changed":
        await e.threadQueuedFollowUpsChanged({
          sourceClientId: t.sourceClientId,
          params: t.params,
        });
        return;
      case "app-connect-oauth-callback-received":
        await e.appConnectOAuthCallbackReceived({
          sourceClientId: t.sourceClientId,
          params: t.params,
        });
        return;
      case "query-cache-invalidate":
        await e.invalidateQueryCache({ sourceClientId: t.sourceClientId, params: t.params });
        return;
    }
}
async function MGt(t, e, r) {
  let n = await Y8(t, e, r);
  try {
    let o = { ...n };
    return (delete o[Symbol.dispose], o);
  } finally {
    n[Symbol.dispose]?.();
  }
}
async function Y8(t, e, r) {
  let n,
    o = !1,
    i = new Promise((s, a) => {
      n = setTimeout(() => {
        ((o = !0), a(new Error(r)));
      }, e);
    });
  try {
    return await Promise.race([t, i]);
  } finally {
    (n !== void 0 && clearTimeout(n), o && t[Symbol.dispose]?.());
  }
}
var hs,
  TGt,
  PGt,
  Z8,
  HA,
  DGe = g(() => {
    ot();
    O();
    QI();
    ((hs = 5e3),
      (TGt = 100),
      (PGt = 5 * 6e4),
      (Z8 = new WeakMap()),
      (HA = class extends ee {
        constructor(r, n, o = hs) {
          super();
          this.ipcClient = r;
          this.getThreadReadStateContext = n;
          this.ownerDiscoveryTimeoutMs = o;
          Z8.set(r, this.ownedThreads);
        }
        ownedThreads = new Set();
        readStateBroadcast = Promise.resolve();
        ownsThread(r, n) {
          return this.ownedThreads.has(`${r}:${n}`);
        }
        async setThreadOwnership({ hostId: r, conversationId: n, ownsThread: o }) {
          let i = `${r}:${n}`;
          o ? this.ownedThreads.add(i) : this.ownedThreads.delete(i);
        }
        async threadArchived(r) {
          (await this.ipcClient.waitUntilInitialized({ timeoutMs: hs }),
            await this.ipcClient.sendBroadcast("thread-archived", r));
        }
        async threadUnarchived(r) {
          (await this.ipcClient.waitUntilInitialized({ timeoutMs: hs }),
            await this.ipcClient.sendBroadcast("thread-unarchived", r));
        }
        async threadQueuedFollowUpsChanged(r) {
          (await this.ipcClient.waitUntilInitialized({ timeoutMs: hs }),
            await this.ipcClient.sendBroadcast("thread-queued-followups-changed", r));
        }
        async threadStreamStateChanged({ params: r, targetClientIds: n }) {
          (await this.ipcClient.waitUntilInitialized({ timeoutMs: hs }),
            await this.ipcClient.sendBroadcast("thread-stream-state-changed", r, {
              targetClientIds: n,
            }));
        }
        async threadStreamFollowingChanged({ params: r, targetClientIds: n }) {
          (await this.ipcClient.waitUntilInitialized({ timeoutMs: hs }),
            await this.ipcClient.sendBroadcast("thread-stream-following-changed", r, {
              targetClientIds: n,
            }));
        }
        async threadStreamFollowingStatusRequested(r) {
          (await this.ipcClient.waitUntilInitialized({ timeoutMs: hs }),
            await this.ipcClient.sendBroadcast("thread-stream-following-status-requested", r));
        }
        threadReadStateChanged(r) {
          let n = Promise.allSettled([
              this.getThreadReadStateContext(r.hostId),
              this.ipcClient.waitUntilInitialized({ timeoutMs: hs }),
            ]),
            o = this.readStateBroadcast.then(async () => {
              let [i, s] = await n;
              if (i.status === "rejected") throw i.reason;
              if (s.status === "rejected") throw s.reason;
              let a = i.value;
              a != null &&
                (await this.ipcClient.sendBroadcast("thread-read-state-changed", {
                  ...r,
                  context: a,
                }));
            });
          return ((this.readStateBroadcast = o.catch(() => {})), o);
        }
        async invalidateQueryCache(r) {
          (await this.ipcClient.waitUntilInitialized({ timeoutMs: hs }),
            await this.ipcClient.sendBroadcast("query-cache-invalidate", r));
        }
        async getIdeContext({ workspaceRoot: r, targetClientId: n, timeoutMs: o }) {
          let i = await eL(this.ipcClient, o),
            s = await this.ipcClient.sendRequest(
              "ide-context",
              { workspaceRoot: r },
              { targetClientId: n, timeoutMs: i },
            );
          if (s.resultType === "error") throw new Error(s.error);
          return s.result.ideContext;
        }
        async findThreadOwner({ hostId: r, conversationId: n }) {
          let o = await eL(this.ipcClient, this.ownerDiscoveryTimeoutMs),
            i = await this.ipcClient.sendRequest(
              "thread-owner-discovery",
              { hostId: r, conversationId: n },
              { timeoutMs: o },
            );
          if (i.resultType === "error") {
            if (i.error === "no-client-found") return null;
            throw new Error(i.error);
          }
          return i.handledByClientId;
        }
        async requestThreadFollower({
          hostId: r,
          request: { method: n, params: o },
          targetClientId: i,
          timeoutMs: s,
        }) {
          let a = await eL(this.ipcClient, s);
          if (
            n === "thread-follower-start-turn" &&
            "turnStart" in o &&
            (o.turnStart.context?.responseItems?.length ?? 0) > 0
          ) {
            let l = await this.ipcClient
              .sendRequest(
                "thread-owner-discovery",
                { hostId: r, conversationId: o.conversationId },
                { targetClientId: i, timeoutMs: a },
              )
              .catch(() => null);
            if (
              l?.resultType !== "success" ||
              l.handledByClientId !== i ||
              l.result?.supportsUntrustedAppInput !== !0
            )
              throw new Error(Zfe);
          }
          return this.ipcClient.sendRequest(n, o, {
            hostId: r === "local" ? void 0 : r,
            targetClientId: i,
            timeoutMs: a,
          });
        }
      }));
  });
var MGe = g(() => {
  q8();
  qA();
  PGe();
  DGe();
  V8();
  K8();
});
function NGe(t, e = OGe.default) {
  return t === "~" || t.startsWith("~/") || t.startsWith("~\\") ? !0 : e.isAbsolute(t);
}
var OGe,
  LGe = g(() => {
    OGe = F(require("node:path"));
  });
var BGe = g(() => {});
function $Ge(t, e) {
  return FGe[t] <= FGe[e];
}
function UGe(t) {
  let e = OGt(process.env.CODEX_MAX_LOG_LEVEL);
  if (e != null) return e;
  switch (t) {
    case "prod":
      return "info";
    case "nightly":
    case "internal-alpha":
    case "public-beta":
      return "debug";
    case "agent":
    case "dev":
      return "trace";
  }
}
function OGt(t) {
  let e = t?.trim().toLowerCase() ?? "";
  switch (e) {
    case "error":
    case "warning":
    case "info":
    case "debug":
    case "trace":
      return e;
    default:
      return null;
  }
}
var FGe,
  qGe = g(() => {
    FGe = { error: 0, warning: 1, info: 2, debug: 3, trace: 4 };
  });
var GGe = g(() => {});
var WGe = g(() => {});
var HGe = g(() => {});
async function KGe() {
  if (process.platform === "darwin") return LGt();
  let t = (0, zGe.release)().trim();
  if (t !== "") return t;
}
async function LGt() {
  try {
    let { stdout: t } = await NGt("/usr/bin/sw_vers", ["-productVersion"]),
      e = t.trim();
    return e === "" ? void 0 : e;
  } catch {
    return;
  }
}
var jGe,
  zGe,
  VGe,
  NGt,
  ZGe = g(() => {
    ((jGe = require("node:child_process")),
      (zGe = require("node:os")),
      (VGe = require("node:util")),
      (NGt = (0, VGe.promisify)(jGe.execFile)));
  });
async function YGe(t) {
  let e = tL.default.join(Xt({ preferWsl: t?.preferWsl ?? !1 }), "prompts"),
    r;
  try {
    r = await J8.promises.readdir(e, { withFileTypes: !0 });
  } catch (o) {
    return (
      o.code !== "ENOENT" &&
        XGe().warning("Failed to read prompts", { safe: {}, sensitive: { error: o } }),
      []
    );
  }
  let n = [];
  return (
    await Promise.all(
      r
        .filter((o) => o.isFile() && o.name.endsWith(".md"))
        .map(async (o) => {
          try {
            let i = await J8.promises.readFile(tL.default.join(e, o.name), "utf8"),
              { description: s, argumentHint: a, content: l } = BGt(i);
            n.push({
              id: tL.default.parse(o.name).name,
              description: s ?? null,
              argumentHint: a ?? null,
              content: l,
            });
          } catch (i) {
            XGe().debug("Failed to load prompt", {
              safe: {},
              sensitive: { promptFilename: o.name, error: i },
            });
          }
        }),
    ),
    n.sort((o, i) => o.id.localeCompare(i.id))
  );
}
function BGt(t) {
  let e = t.match(/^---\s*\n([\s\S]*?)\n---\s*/);
  if (!e) return { content: t.trim() };
  let r = {},
    n = e[1].split(/\r?\n/);
  for (let i of n) {
    let s = i.indexOf(":");
    if (s === -1) continue;
    let a = i.slice(0, s).trim(),
      c = i
        .slice(s + 1)
        .trim()
        .replace(/^['"](.*)['"]$/, "$1");
    a === "description" ? (r.description = c) : a === "argument-hint" && (r.argumentHint = c);
  }
  let o = t.slice(e[0].length).trim();
  return { ...r, content: o };
}
var J8,
  tL,
  XGe,
  JGe = g(() => {
    ((J8 = require("node:fs")), (tL = F(require("node:path"))));
    Bn();
    Bt();
    XGe = Ie("prompts");
  });
var $Gt,
  rL,
  QGe = g(() => {
    QI();
    (($Gt = 10 * 60 * 1e3),
      (rL = class {
        constructor(e = Date.now, r) {
          this.now = e;
          ((this.activeLocks = new Map(r?.activeLocks)),
            (this.sentMessages = new Map(r?.sentMessages)));
        }
        startingTurns = new Set();
        activeLocks;
        sentMessages;
        exportState() {
          let e = this.now();
          for (let [r, n] of this.activeLocks) n.expiresAtMs <= e && this.activeLocks.delete(r);
          return (
            this.deleteExpiredSentMessages(e),
            {
              activeLocks: Array.from(this.activeLocks),
              sentMessages: Array.from(this.sentMessages),
            }
          );
        }
        tryAcquireStartTurn(e) {
          return this.startingTurns.has(e) ? !1 : (this.startingTurns.add(e), !0);
        }
        releaseStartTurn(e) {
          this.startingTurns.delete(e);
        }
        tryAcquire({ conversationId: e, messageId: r, lockId: n }) {
          let o = this.now();
          if (
            (this.deleteExpiredSentMessages(o), this.sentMessages.has(this.getSentMessageKey(e, r)))
          )
            return !1;
          let i = this.activeLocks.get(e);
          return i != null && i.expiresAtMs > o
            ? !1
            : (this.activeLocks.set(e, { lockId: n, expiresAtMs: o + 12e4 }), !0);
        }
        release({ conversationId: e, messageId: r, lockId: n, sent: o }) {
          (this.activeLocks.get(e)?.lockId === n && this.activeLocks.delete(e),
            o && this.sentMessages.set(this.getSentMessageKey(e, r), this.now() + $Gt));
        }
        getSentMessageKey(e, r) {
          return `${e}
${r}`;
        }
        deleteExpiredSentMessages(e) {
          for (let [r, n] of this.sentMessages) n <= e && this.sentMessages.delete(r);
        }
      }));
  });
var eWe = g(() => {
  O();
});
async function oL({
  refresh: t = !1,
  preferWsl: e = !1,
  bundledRepoRoot: r = null,
  appServerClient: n,
}) {
  let o = tn(n.hostConfig)
      ? n.hostConfig.kind === uu
        ? n.hostConfig.id
        : n.hostConfig.terminal_command.join(" ")
      : void 0,
    i = tn(n.hostConfig) ? await n.codexHome() : Xt({ preferWsl: e }),
    s = await n.platformPath(),
    a = s.join(i, "vendor_imports"),
    l = s.join(a, "skills"),
    c = sWe(s),
    u = aWe(s),
    p = u.map((P) => s.join(l, P)),
    m = s.join(l, c),
    f = s.join(a, "skills-curated-cache.json"),
    h = o || !r ? null : lf.default.resolve(r),
    v = h ? aWe(lf.default).map((P) => lf.default.join(h, P)) : null,
    y = h ? lf.default.join(h, sWe(lf.default)) : null,
    w = await nWt(f, n),
    _ = t || !w || rWt(w),
    S = await pl(s.join(l, ".git"), n),
    E = await pl(m, n),
    T = y ? await pl(y, n) : !1;
  try {
    if (!t && !S && !E && T) {
      let V = await tWe({
          repoRoot: h ?? l,
          recommendedRoots: v ?? p,
          path: h ? lf.default : s,
          appServerClient: n,
        }),
        de = Date.now();
      return (
        await iWe(f, { fetchedAt: de, skills: V }, s, n),
        { skills: V, fetchedAt: de, source: "bundled", repoRoot: h ?? null, error: null }
      );
    }
    let P = !1;
    _ &&
      (S || !E) &&
      (await Xr({ requestKind: null, source: "recommended_skills_refresh" }, async () => {
        (await JGt({ repoRoot: l, vendorRoot: a, path: s, appServerClient: n }),
          await QGt(l, n),
          await eWt(l, u, n));
      }),
      (P = !0));
    let M = await tWe({ repoRoot: l, recommendedRoots: p, path: s, appServerClient: n }),
      L = P ? Date.now() : (w?.fetchedAt ?? Date.now());
    return (
      await iWe(f, { fetchedAt: L, skills: M }, s, n),
      { skills: M, fetchedAt: L, source: P ? "git" : "cache", repoRoot: l, error: null }
    );
  } catch (P) {
    let M = P instanceof Error ? P.message : String(P),
      L = !E && !S && T && h ? h : l;
    return (
      UGt().warning("Failed to load recommended skills", { safe: {}, sensitive: { error: P } }),
      w
        ? { skills: w.skills, fetchedAt: w.fetchedAt, source: "cache", repoRoot: L, error: M }
        : { skills: [], fetchedAt: null, source: "cache", repoRoot: L, error: M }
    );
  }
}
async function tWe({ repoRoot: t, recommendedRoots: e, path: r, appServerClient: n }) {
  let o = new Map(),
    i = await Promise.all(
      e.map(async (s) => zGt({ recommendedRoot: s, repoRoot: t, path: r, appServerClient: n })),
    );
  for (let s of i) for (let a of s) o.has(a.id) || o.set(a.id, a);
  return Array.from(o.values()).sort((s, a) => s.name.localeCompare(a.name));
}
async function zGt({ recommendedRoot: t, repoRoot: e, path: r, appServerClient: n }) {
  if (!(await pl(t, n))) return [];
  let o = await Qe.readdir(t, n);
  return (
    await Promise.all(
      o.map(async (s) => {
        if (s.startsWith(".")) return null;
        let a = r.join(t, s),
          c = (await Qe.stat(a, n)).isDirectory(),
          u = c ? r.join(a, "SKILL.md") : a;
        if (!(await pl(u, n))) return null;
        let p = await Qe.readFile(u, n),
          m = VGt(p),
          f = await ZGt({ path: r, appServerClient: n, skillRoot: a }),
          h = c ? s : r.parse(s).name,
          v = m.description ?? m.shortDescription ?? h,
          y = await YGt({
            path: r,
            appServerClient: n,
            skillRoot: a,
            skillId: h,
            iconSmall: m.iconSmall ?? f.iconSmall ?? null,
            iconLarge: m.iconLarge ?? f.iconLarge ?? null,
            isDirectory: c,
          }),
          w = c ? oWe(r, e, a) : oWe(r, e, u);
        return {
          id: h,
          name: m.name ?? h,
          description: v,
          shortDescription: m.shortDescription ?? f.shortDescription,
          iconSmall: y.iconSmall,
          iconLarge: y.iconLarge,
          repoPath: w,
        };
      }),
    )
  ).filter((s) => s != null);
}
function Q8(t) {
  return t.replace(/^['"](.*)['"]$/, "$1").replace(/\\(["\\])/g, "$1");
}
function VGt(t) {
  let e = t.match(/^---\s*\n([\s\S]*?)\n---\s*/);
  if (!e) return {};
  let r = {},
    n = e[1].split(/\r?\n/),
    o = !1,
    i = !1;
  for (let s of n) {
    if (s.trim().length === 0) continue;
    if (!/^\s+/.test(s)) {
      ((o = !1), (i = !1));
      let h = s.indexOf(":");
      if (h === -1) continue;
      let v = s.slice(0, h).trim(),
        y = s.slice(h + 1).trim(),
        w = Q8(y),
        _ = rWe[v];
      _ ? (r[_] = w) : v === "metadata" ? (o = !0) : v === "interface" && (i = !0);
      continue;
    }
    if (!o && !i) continue;
    let l = s.trim(),
      c = l.indexOf(":");
    if (c === -1) continue;
    let u = l.slice(0, c).trim(),
      p = l.slice(c + 1).trim(),
      m = Q8(p),
      f = rWe[u];
    f && (f === "name" || f === "description" || (r[f] = m));
  }
  return r;
}
async function ZGt({ path: t, appServerClient: e, skillRoot: r }) {
  let n = t.join(r, "agents", "openai.yaml");
  if (!(await pl(n, e))) return { shortDescription: null, iconSmall: null, iconLarge: null };
  let o = await Qe.readFile(n, e);
  return XGt(o);
}
function XGt(t) {
  let e = { shortDescription: null, iconSmall: null, iconLarge: null },
    r = t.split(/\r?\n/),
    n = !1;
  for (let o of r) {
    if (!n) {
      o.trim() === "interface:" && (n = !0);
      continue;
    }
    if (/^\S/.test(o) || !/^\s+/.test(o)) break;
    let i = o.trim();
    if (i.length === 0) continue;
    let s = i.indexOf(":");
    if (s === -1) continue;
    let a = i.slice(0, s).trim(),
      l = i.slice(s + 1).trim(),
      c = KGt[a];
    if (!c || l.length === 0) continue;
    let u = Q8(l);
    e[c] = u;
  }
  return e;
}
