function DEt(t) {
  let e = NEt(t);
  if (e != null) return e;
  let r = BEt(t[0]),
    n = MEt(t, r),
    o = n ?? (r === "ssh" ? OEt(t) : void 0);
  return {
    attributes: {
      "process.kind": n == null ? r : "gh",
      ...(o == null ? {} : { "process.operation": o }),
    },
    op: "process.exec",
    name: "subprocess",
  };
}
function MEt(t, e) {
  let r, n;
  if (e === "gh") [r, n] = t.slice(1, 3);
  else if (e === "shell" && (t[1] === "-c" || t[1] === "-lc")) {
    let i = /^gh(?:\s+([a-z-]+))?(?:\s+([a-z-]+))?(?:\s|$)/u.exec(t[2] ?? "");
    if (i == null) return;
    [, r, n] = i;
  } else return;
  if (r === "--version" || r === "version") return "version";
  if (r === "api") return n === "graphql" ? "api.graphql" : "api.rest";
  let o = `${r}.${n}`;
  return IEt.has(o) ? o : "other";
}
function OEt(t) {
  let e = t.slice(1),
    r = !1,
    n = !1,
    o = !1,
    i = 0;
  for (let s = 0; s < e.length; s += 1) {
    let a = e[s];
    if (a != null) {
      if (a === "--") {
        i += e.length - s - 1;
        break;
      }
      if (
        (a === "-G" && (r = !0),
        /^-O(?:.|$)/u.test(a) && (n = !0),
        (/^-(?:D|L|R|W)(?:.|$)/u.test(a) ||
          /^-o(?:DynamicForward|LocalForward|RemoteForward)=/iu.test(a) ||
          (a === "-o" &&
            /^(?:DynamicForward|LocalForward|RemoteForward)(?:=|\s)/iu.test(e[s + 1] ?? ""))) &&
          (o = !0),
        kEt.has(a))
      ) {
        s += 1;
        continue;
      }
      if (!a.startsWith("-") && ((i += 1), i > 1)) break;
    }
  }
  return r
    ? "config"
    : n
      ? "control"
      : o
        ? "port_forward"
        : i > 1
          ? "remote_command"
          : "connection";
}
function NEt(t) {
  let e = t[0];
  if (e != null && CTe(e))
    return { op: "git.exec", name: "git.subprocess", attributes: { "git.subcommand": ux(t, 1) } };
  if (!LEt(e)) return null;
  let r = t.slice(1, 4).map((o) => o.toLowerCase()),
    n = t[4];
  return r.length === 3 && r[0] === "/d" && r[1] === "/s" && r[2] === "/c" && n != null && CTe(n)
    ? { op: "git.exec", name: "git.subprocess", attributes: { "git.subcommand": ux(t, 5) } }
    : null;
}
function CTe(t) {
  let e = Q4(t);
  return e === "git" || e === "git.exe" || e === "git.cmd" || e === "git.bat" || e === "git.com";
}
function LEt(t) {
  if (t == null) return !1;
  let e = Q4(t);
  return e === "cmd" || e === "cmd.exe";
}
function Q4(t) {
  let e = (0, xD.basename)(t).toLowerCase(),
    r = xD.win32.basename(t).toLowerCase();
  return e.length <= r.length ? e : r;
}
function BEt(t) {
  if (t == null) return "other";
  let e = Q4(t).replace(/\.(?:bat|cmd|com|exe)$/u, "");
  if (/^python(?:3(?:\.\d+)*)?$/u.test(e)) return "python";
  switch (e) {
    case "bash":
    case "cmd":
    case "powershell":
    case "pwsh":
    case "sh":
    case "zsh":
      return "shell";
    case "codex":
    case "gh":
    case "node":
    case "rg":
    case "ssh":
    case "tar":
    case "tectonic":
    case "wsl":
      return e;
    default:
      return "other";
  }
}
function Vu({
  args: t,
  allowedNonZeroExitCodes: e,
  cwd: r,
  env: n,
  signal: o,
  stdoutChunkHandler: i,
  stderrChunkHandler: s,
  onExitHandler: a,
  collectOutput: l = !0,
  detached: c = !1,
  windowsHide: u,
  spawnInsideWsl: p,
  streamStdin: m = !1,
}) {
  if (p ?? M_())
    return (
      PTe().info("Spawning process inside WSL"),
      FEt(t, e, r, n == null ? void 0 : UEt(pn(n)), o, i, s, a, l, m)
    );
  let f = t[0],
    h = t.slice(1),
    v = pn({ ...process.env, ...n }),
    y = {
      cwd: r,
      detached: c,
      windowsHide: u,
      env: v,
      stdio: [m ? "pipe" : "ignore", "pipe", "pipe"],
    };
  return ITe({
    child: (0, J4.spawn)(wm.resolve(f, { cwd: r, env: v }) ?? f, h, y),
    args: t,
    allowedNonZeroExitCodes: e,
    signal: o,
    stdoutChunkHandler: i,
    stderrChunkHandler: s,
    onExitHandler: a,
    collectOutput: l,
  });
}
function ITe({
  child: t,
  args: e,
  allowedNonZeroExitCodes: r,
  signal: n,
  stdoutChunkHandler: o,
  stderrChunkHandler: i,
  onExitHandler: s,
  collectOutput: a,
}) {
  let l = DEt(e),
    c = [],
    u = [],
    p = [],
    m = 0,
    f = new Promise((h, v) => {
      let y = $Et(t, n),
        w = (0, TTe.default)(() => {
          (s?.(), y?.());
        });
      (t.stdout?.on("data", (_) => {
        (a && c.push(_), o?.(_));
      }),
        t.stderr?.on("data", (_) => {
          if ((a && u.push(_), l.name === "git.subprocess" && m < ETe)) {
            let S = Buffer.from(_.subarray(0, ETe - m));
            (p.push(S), (m += S.length));
          }
          i?.(_);
        }),
        t.on("close", (_, S) => {
          (w(), h({ code: _, signal: S }));
        }),
        t.on("error", (_) => {
          (w(), v(_));
        }));
    });
  return new _D(
    t,
    c,
    u,
    a,
    jt(l, async () => {
      let h = await f,
        v = n?.aborted || t.killed,
        y = !v && h.code !== 0 && (h.code == null || !r?.includes(h.code)),
        w = l.name === "git.subprocess" && y ? zu(Buffer.concat(p).toString("utf8")) : void 0;
      return (
        e_({
          ...(h.code == null ? {} : { "process.exit.code": h.code }),
          ...(h.signal == null ? {} : { "process.signal": h.signal }),
          ...(w == null ? {} : { "git.error_kind": w }),
        }),
        v ? (Ia("canceled"), h) : (y && Ia("failure", "process_exit"), { ...h, gitErrorKind: w })
      );
    }),
  );
}
function FEt(t, e, r, n, o, i, s, a, l = !0, c = !1) {
  let u = jg();
  if (u == null) throw new Error("WSL mode is enabled but no eligible distro is available");
  let p = xj({ distro: u, cwd: r ? ho(r) : ".", command: GEt(t, n) }),
    m = { env: pn(process.env), stdio: [c ? "pipe" : "ignore", "pipe", "pipe"], windowsHide: !0 };
  return (
    PTe().debug("Spawning process inside WSL", {
      safe: { command: `wsl.exe ${p.join(" ")}` },
      sensitive: {},
    }),
    ITe({
      child: (0, J4.spawn)("wsl.exe", p, m),
      args: t,
      allowedNonZeroExitCodes: e,
      signal: o,
      stdoutChunkHandler: i,
      stderrChunkHandler: s,
      onExitHandler: a,
      collectOutput: l,
    })
  );
}
function $Et(t, e) {
  if (!e) return;
  let r = () => {
    t.kill();
  };
  return (
    e.addEventListener("abort", r),
    e.aborted && r(),
    () => {
      e.removeEventListener("abort", r);
    }
  );
}
function UEt(t) {
  let e = {};
  for (let [r, n] of Object.entries(t)) n != null && process.env[r] !== n && (e[r] = n);
  return e;
}
function qEt(t) {
  return Object.entries(t).map(([e, r]) => {
    let n = WEt(r) ? ho(r) : r;
    return `${e}=${K4(n)}`;
  });
}
function GEt(t, e) {
  let r = ai(t),
    n = e == null ? [] : qEt(e);
  return n.length === 0 ? `exec ${r}` : `${n.join(" ")} exec ${r}`;
}
function WEt(t) {
  return t.includes(";") ? !1 : !!(/^(?:[a-zA-Z]:[\\/]|\\\\|\/\/)/.test(t) || Ls(t));
}
var J4,
  xD,
  TTe,
  PTe,
  ETe,
  IEt,
  kEt,
  Ku = g(() => {
    ((J4 = require("child_process")), (xD = require("path")));
    cx();
    V4();
    TTe = F(KW());
    O();
    bm();
    _m();
    os();
    Bt();
    RTe();
    Ua();
    ((PTe = Ie("spawn-async")),
      (ETe = 8 * 1024),
      (IEt = new Set([
        "auth.status",
        "auth.token",
        "pr.checks",
        "pr.close",
        "pr.comment",
        "pr.create",
        "pr.diff",
        "pr.edit",
        "pr.list",
        "pr.merge",
        "pr.ready",
        "pr.reopen",
        "pr.review",
        "pr.view",
      ])),
      (kEt = new Set([
        "-B",
        "-b",
        "-c",
        "-D",
        "-E",
        "-e",
        "-F",
        "-I",
        "-i",
        "-J",
        "-L",
        "-l",
        "-m",
        "-O",
        "-o",
        "-p",
        "-P",
        "-Q",
        "-R",
        "-S",
        "-W",
        "-w",
      ])));
  });
var MMr,
  eV = g(() => {
    Ku();
    MMr = {
      activeLifetime: 10 * 6e4,
      tunnelProbe: 200,
      tunnelReady: 5e3,
      tunnelReadyPollInterval: 100,
    };
  });
var tV = g(() => {
  Ku();
});
var AD,
  HEt,
  px,
  nV = g(() => {
    O();
    $();
    $0();
    ((AD = 9e4),
      (HEt = d
        .object({
          autoResolutionMs: d
            .number()
            .int()
            .min(5e3)
            .max(5 * 6e4),
        })
        .loose()),
      (px = class {
        constructor(e) {
          this.options = e;
        }
        pendingRequestByConversationId = new Map();
        conversationIdByRequestId = new Map();
        presentingSurfaceIdsByConversationId = new Map();
        foregroundedSurfaceIds = new Set();
        surfaceSubscriptionsById = new Map();
        observeServerRequest(e) {
          if (e.method === "item/tool/requestUserInput") {
            let n = e.params.threadId;
            if (e.params.isBlocking === !0) {
              this.removePendingRequest(n);
              return;
            }
            this.trackRequest(n, e.id, "empty-user-input");
            return;
          }
          if (e.method !== "mcpServer/elicitation/request") return;
          if (e.params.mode === "openai/userVerification") {
            this.removePendingRequest(e.params.threadId);
            return;
          }
          let r = HEt.safeParse(e.params._meta);
          r.success &&
            this.trackRequest(
              e.params.threadId,
              e.id,
              "decline-mcp-elicitation",
              r.data.autoResolutionMs,
            );
        }
        observeServerNotification(e) {
          if (e.method !== "serverRequest/resolved") return;
          let r = e.params;
          this.stopTrackingRequest(r.requestId);
        }
        trackRequest(e, r, n, o) {
          this.removePendingRequest(e);
          let i = {
            autoResolutionMs: o ?? null,
            requestId: r,
            responseKind: n,
            resolutionState: { status: "waiting-for-inactivity" },
            timeoutId: null,
          };
          if (
            (this.pendingRequestByConversationId.set(e, i),
            this.conversationIdByRequestId.set(r, e),
            o != null)
          ) {
            this.startCountdown(e, i, o);
            return;
          }
          switch (this.options.timing.type) {
            case "foreground-inactivity":
              this.isConversationForegrounded(e)
                ? this.waitForInactivity(e, i, this.options.timing)
                : this.startCountdown(e, i, AD);
              break;
            case "fixed":
              this.startCountdown(e, i, AD);
              break;
          }
        }
        registerSurface(e) {
          this.setSurfaceForegrounded(e.id, e.isFocused());
          let r = new ic();
          (r.add(
            e.onFocusChanged((n) => {
              this.setSurfaceForegrounded(e.id, n);
            }),
          ),
            r.add(
              e.onDestroyed(() => {
                (r.dispose(), this.surfaceSubscriptionsById.delete(e.id), this.removeSurface(e.id));
              }),
            ),
            this.surfaceSubscriptionsById.set(e.id, r));
        }
        setConversationPresented(e, r, n) {
          let o = this.presentingSurfaceIdsByConversationId.get(r);
          if (n) {
            let i = o ?? new Set();
            if (i.has(e)) return;
            (i.add(e),
              this.presentingSurfaceIdsByConversationId.set(r, i),
              this.foregroundedSurfaceIds.has(e) && this.restartInactivityForConversation(r));
            return;
          }
          o?.delete(e) === !0 &&
            (o.size === 0 && this.presentingSurfaceIdsByConversationId.delete(r),
            this.foregroundedSurfaceIds.has(e) &&
              !this.isConversationForegrounded(r) &&
              this.startCountdownForWaitingRequest(r));
        }
        setSurfaceForegrounded(e, r) {
          if (r !== this.foregroundedSurfaceIds.has(e)) {
            if (r) {
              this.foregroundedSurfaceIds.add(e);
              for (let [n, o] of this.presentingSurfaceIdsByConversationId)
                o.has(e) && this.restartInactivityForConversation(n);
              return;
            }
            this.foregroundedSurfaceIds.delete(e);
            for (let [n, o] of this.presentingSurfaceIdsByConversationId)
              o.has(e) &&
                !this.isConversationForegrounded(n) &&
                this.startCountdownForWaitingRequest(n);
          }
        }
        removeSurface(e) {
          let r = this.foregroundedSurfaceIds.delete(e);
          for (let [n, o] of this.presentingSurfaceIdsByConversationId)
            o.delete(e) &&
              (o.size === 0 && this.presentingSurfaceIdsByConversationId.delete(n),
              r && !this.isConversationForegrounded(n) && this.startCountdownForWaitingRequest(n));
        }
        recordConversationActivity(e, r) {
          this.pendingRequestByConversationId.get(r)?.resolutionState.status !==
            "waiting-for-inactivity" ||
            !this.foregroundedSurfaceIds.has(e) ||
            !this.presentingSurfaceIdsByConversationId.get(r)?.has(e) ||
            this.restartInactivityForConversation(r);
        }
        snoozeRequest(e, r) {
          let n = this.pendingRequestByConversationId.get(e);
          if (!(n == null || n.requestId !== r)) {
            if (n.autoResolutionMs != null) {
              this.startCountdown(e, n, n.autoResolutionMs);
              return;
            }
            (this.cancelPendingRequestDeadline(n),
              (n.resolutionState = { status: "snoozed" }),
              this.publishState(e, n));
          }
        }
        stopTrackingRequest(e) {
          let r = this.conversationIdByRequestId.get(e);
          r != null && this.removePendingRequest(r);
        }
        getPendingRequestSnapshots() {
          return Array.from(this.pendingRequestByConversationId.entries(), ([e, r]) => ({
            conversationId: e,
            requestId: r.requestId,
            resolutionState: r.resolutionState,
          }));
        }
        clearPendingRequests() {
          for (let e of this.pendingRequestByConversationId.keys()) this.removePendingRequest(e);
        }
        dispose() {
          for (let e of this.surfaceSubscriptionsById.values()) e.dispose();
          this.surfaceSubscriptionsById.clear();
          for (let e of this.pendingRequestByConversationId.values())
            this.cancelPendingRequestDeadline(e);
          (this.pendingRequestByConversationId.clear(),
            this.conversationIdByRequestId.clear(),
            this.presentingSurfaceIdsByConversationId.clear(),
            this.foregroundedSurfaceIds.clear());
        }
        restartInactivityForConversation(e) {
          let r = this.options.timing;
          if (r.type === "fixed") return;
          let n = this.pendingRequestByConversationId.get(e);
          n != null && n.resolutionState.status !== "snoozed" && this.waitForInactivity(e, n, r);
        }
        waitForInactivity(e, r, n) {
          ((r.resolutionState = { status: "waiting-for-inactivity" }),
            this.setPendingRequestTimeout(r, n.inactivityDurationMs, () => {
              this.pendingRequestByConversationId.get(e) === r && this.startCountdown(e, r, AD);
            }),
            this.publishState(e, r));
        }
        startCountdownForWaitingRequest(e) {
          let r = this.options.timing,
            n = this.pendingRequestByConversationId.get(e);
          r.type === "foreground-inactivity" &&
            n?.resolutionState.status === "waiting-for-inactivity" &&
            this.startCountdown(e, n, AD);
        }
        startCountdown(e, r, n) {
          let o = Date.now() + n;
          ((r.resolutionState = { status: "scheduled", deadlineMs: o }),
            this.setPendingRequestTimeout(r, n, () => {
              switch (
                (this.options.onStateChanged({
                  kind: "timed-out",
                  conversationId: e,
                  requestId: r.requestId,
                  timeoutMs: n,
                }),
                this.removePendingRequest(e),
                r.responseKind)
              ) {
                case "decline-mcp-elicitation":
                  this.options.declineMcpElicitation(r.requestId, e);
                  break;
                case "empty-user-input":
                  this.options.submitEmptyResponse(r.requestId, e);
                  break;
              }
            }),
            this.publishState(e, r));
        }
        setPendingRequestTimeout(e, r, n) {
          this.cancelPendingRequestDeadline(e);
          let o = setTimeout(() => {
            e.timeoutId === o && ((e.timeoutId = null), n());
          }, r);
          e.timeoutId = o;
        }
        removePendingRequest(e) {
          let r = this.pendingRequestByConversationId.get(e);
          r != null &&
            (this.cancelPendingRequestDeadline(r),
            this.pendingRequestByConversationId.delete(e),
            this.conversationIdByRequestId.delete(r.requestId),
            this.options.onStateChanged({
              kind: "removed",
              conversationId: e,
              requestId: r.requestId,
            }));
        }
        cancelPendingRequestDeadline(e) {
          let r = e.timeoutId;
          r != null && ((e.timeoutId = null), clearTimeout(r));
        }
        publishState(e, r) {
          this.options.onStateChanged({
            kind: "updated",
            conversationId: e,
            requestId: r.requestId,
            resolutionState: r.resolutionState,
          });
        }
        isConversationForegrounded(e) {
          let r = this.presentingSurfaceIdsByConversationId.get(e);
          if (r == null) return !1;
          for (let n of r) if (this.foregroundedSurfaceIds.has(n)) return !0;
          return !1;
        }
      }));
  });
var kTe = g(() => {});
var HMr,
  DTe = g(() => {
    "use strict";
    $();
    ZI();
    HMr = d.object({
      data: d.object({ errorType: d.literal("thread_archived"), threadId: d.string() }),
    });
  });
var MTe = g(() => {
  DTe();
});
var OTe = g(() => {});
var oV = g(() => {
  Bt();
});
var nOr,
  RD = g(() => {
    Bt();
    oV();
    oV();
    nOr = 256 * 1024;
  });
var aOr,
  NTe = g(() => {
    pG();
    aOr = new Set(Object.values(Gl));
  });
function iV() {
  return ["cli"];
}
var sV = g(() => {
  NTe();
});
var hOr,
  LTe = g(() => {
    Bt();
    Ku();
    hOr = Ie("primary-runtime-installer");
  });
var qTe = A((yOr, UTe) => {
  UTe.exports = $Te;
  $Te.sync = zEt;
  var BTe = require("fs");
  function jEt(t, e) {
    var r = e.pathExt !== void 0 ? e.pathExt : process.env.PATHEXT;
    if (!r || ((r = r.split(";")), r.indexOf("") !== -1)) return !0;
    for (var n = 0; n < r.length; n++) {
      var o = r[n].toLowerCase();
      if (o && t.substr(-o.length).toLowerCase() === o) return !0;
    }
    return !1;
  }
  function FTe(t, e, r) {
    return !t.isSymbolicLink() && !t.isFile() ? !1 : jEt(e, r);
  }
  function $Te(t, e, r) {
    BTe.stat(t, function (n, o) {
      r(n, n ? !1 : FTe(o, t, e));
    });
  }
  function zEt(t, e) {
    return FTe(BTe.statSync(t), t, e);
  }
});
var zTe = A((vOr, jTe) => {
  jTe.exports = WTe;
  WTe.sync = VEt;
  var GTe = require("fs");
  function WTe(t, e, r) {
    GTe.stat(t, function (n, o) {
      r(n, n ? !1 : HTe(o, e));
    });
  }
  function VEt(t, e) {
    return HTe(GTe.statSync(t), e);
  }
  function HTe(t, e) {
    return t.isFile() && KEt(t, e);
  }
  function KEt(t, e) {
    var r = t.mode,
      n = t.uid,
      o = t.gid,
      i = e.uid !== void 0 ? e.uid : process.getuid && process.getuid(),
      s = e.gid !== void 0 ? e.gid : process.getgid && process.getgid(),
      a = parseInt("100", 8),
      l = parseInt("010", 8),
      c = parseInt("001", 8),
      u = a | l,
      p = r & c || (r & l && o === s) || (r & a && n === i) || (r & u && i === 0);
    return p;
  }
});
var KTe = A((SOr, VTe) => {
  var bOr = require("fs"),
    ED;
  process.platform === "win32" || global.TESTING_WINDOWS ? (ED = qTe()) : (ED = zTe());
  VTe.exports = aV;
  aV.sync = ZEt;
  function aV(t, e, r) {
    if ((typeof e == "function" && ((r = e), (e = {})), !r)) {
      if (typeof Promise != "function") throw new TypeError("callback not provided");
      return new Promise(function (n, o) {
        aV(t, e || {}, function (i, s) {
          i ? o(i) : n(s);
        });
      });
    }
    ED(t, e || {}, function (n, o) {
      (n && (n.code === "EACCES" || (e && e.ignoreErrors)) && ((n = null), (o = !1)), r(n, o));
    });
  }
  function ZEt(t, e) {
    try {
      return ED.sync(t, e || {});
    } catch (r) {
      if ((e && e.ignoreErrors) || r.code === "EACCES") return !1;
      throw r;
    }
  }
});
var tPe = A((wOr, ePe) => {
  var cy =
      process.platform === "win32" ||
      process.env.OSTYPE === "cygwin" ||
      process.env.OSTYPE === "msys",
    ZTe = require("path"),
    XEt = cy ? ";" : ":",
    XTe = KTe(),
    YTe = (t) => Object.assign(new Error(`not found: ${t}`), { code: "ENOENT" }),
    JTe = (t, e) => {
      let r = e.colon || XEt,
        n =
          t.match(/\//) || (cy && t.match(/\\/))
            ? [""]
            : [...(cy ? [process.cwd()] : []), ...(e.path || process.env.PATH || "").split(r)],
        o = cy ? e.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "",
        i = cy ? o.split(r) : [""];
      return (
        cy && t.indexOf(".") !== -1 && i[0] !== "" && i.unshift(""),
        { pathEnv: n, pathExt: i, pathExtExe: o }
      );
    },
    QTe = (t, e, r) => {
      (typeof e == "function" && ((r = e), (e = {})), e || (e = {}));
      let { pathEnv: n, pathExt: o, pathExtExe: i } = JTe(t, e),
        s = [],
        a = (c) =>
          new Promise((u, p) => {
            if (c === n.length) return e.all && s.length ? u(s) : p(YTe(t));
            let m = n[c],
              f = /^".*"$/.test(m) ? m.slice(1, -1) : m,
              h = ZTe.join(f, t),
              v = !f && /^\.[\\\/]/.test(t) ? t.slice(0, 2) + h : h;
            u(l(v, c, 0));
          }),
        l = (c, u, p) =>
          new Promise((m, f) => {
            if (p === o.length) return m(a(u + 1));
            let h = o[p];
            XTe(c + h, { pathExt: i }, (v, y) => {
              if (!v && y)
                if (e.all) s.push(c + h);
                else return m(c + h);
              return m(l(c, u, p + 1));
            });
          });
      return r ? a(0).then((c) => r(null, c), r) : a(0);
    },
    YEt = (t, e) => {
      e = e || {};
      let { pathEnv: r, pathExt: n, pathExtExe: o } = JTe(t, e),
        i = [];
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          l = /^".*"$/.test(a) ? a.slice(1, -1) : a,
          c = ZTe.join(l, t),
          u = !l && /^\.[\\\/]/.test(t) ? t.slice(0, 2) + c : c;
        for (let p = 0; p < n.length; p++) {
          let m = u + n[p];
          try {
            if (XTe.sync(m, { pathExt: o }))
              if (e.all) i.push(m);
              else return m;
          } catch {}
        }
      }
      if (e.all && i.length) return i;
      if (e.nothrow) return null;
      throw YTe(t);
    };
  ePe.exports = QTe;
  QTe.sync = YEt;
});
var cV = A((_Or, lV) => {
  "use strict";
  var rPe = (t = {}) => {
    let e = t.env || process.env;
    return (t.platform || process.platform) !== "win32"
      ? "PATH"
      : Object.keys(e)
          .reverse()
          .find((n) => n.toUpperCase() === "PATH") || "Path";
  };
  lV.exports = rPe;
  lV.exports.default = rPe;
});
var sPe = A((xOr, iPe) => {
  "use strict";
  var nPe = require("path"),
    JEt = tPe(),
    QEt = cV();
  function oPe(t, e) {
    let r = t.options.env || process.env,
      n = process.cwd(),
      o = t.options.cwd != null,
      i = o && process.chdir !== void 0 && !process.chdir.disabled;
    if (i)
      try {
        process.chdir(t.options.cwd);
      } catch {}
    let s;
    try {
      s = JEt.sync(t.command, { path: r[QEt({ env: r })], pathExt: e ? nPe.delimiter : void 0 });
    } catch {
    } finally {
      i && process.chdir(n);
    }
    return (s && (s = nPe.resolve(o ? t.options.cwd : "", s)), s);
  }
  function eCt(t) {
    return oPe(t) || oPe(t, !0);
  }
  iPe.exports = eCt;
});
var aPe = A((AOr, dV) => {
  "use strict";
  var uV = /([()\][%!^"`<>&|;, *?])/g;
  function tCt(t) {
    return ((t = t.replace(uV, "^$1")), t);
  }
  function rCt(t, e) {
    return (
      (t = `${t}`),
      (t = t.replace(/(?=(\\+?)?)\1"/g, '$1$1\\"')),
      (t = t.replace(/(?=(\\+?)?)\1$/, "$1$1")),
      (t = `"${t}"`),
      (t = t.replace(uV, "^$1")),
      e && (t = t.replace(uV, "^$1")),
      t
    );
  }
  dV.exports.command = tCt;
  dV.exports.argument = rCt;
});
var cPe = A((ROr, lPe) => {
  "use strict";
  lPe.exports = /^#!(.*)/;
});
var dPe = A((EOr, uPe) => {
  "use strict";
  var nCt = cPe();
  uPe.exports = (t = "") => {
    let e = t.match(nCt);
    if (!e) return null;
    let [r, n] = e[0].replace(/#! ?/, "").split(" "),
      o = r.split("/").pop();
    return o === "env" ? n : n ? `${o} ${n}` : o;
  };
});
var mPe = A((COr, pPe) => {
  "use strict";
  var pV = require("fs"),
    oCt = dPe();
  function iCt(t) {
    let r = Buffer.alloc(150),
      n;
    try {
      ((n = pV.openSync(t, "r")), pV.readSync(n, r, 0, 150, 0), pV.closeSync(n));
    } catch {}
    return oCt(r.toString());
  }
  pPe.exports = iCt;
});
var yPe = A((TOr, gPe) => {
  "use strict";
  var sCt = require("path"),
    fPe = sPe(),
    hPe = aPe(),
    aCt = mPe(),
    lCt = process.platform === "win32",
    cCt = /\.(?:com|exe)$/i,
    uCt = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
  function dCt(t) {
    t.file = fPe(t);
    let e = t.file && aCt(t.file);
    return e ? (t.args.unshift(t.file), (t.command = e), fPe(t)) : t.file;
  }
  function pCt(t) {
    if (!lCt) return t;
    let e = dCt(t),
      r = !cCt.test(e);
    if (t.options.forceShell || r) {
      let n = uCt.test(e);
      ((t.command = sCt.normalize(t.command)),
        (t.command = hPe.command(t.command)),
        (t.args = t.args.map((i) => hPe.argument(i, n))));
      let o = [t.command].concat(t.args).join(" ");
      ((t.args = ["/d", "/s", "/c", `"${o}"`]),
        (t.command = process.env.comspec || "cmd.exe"),
        (t.options.windowsVerbatimArguments = !0));
    }
    return t;
  }
  function mCt(t, e, r) {
    (e && !Array.isArray(e) && ((r = e), (e = null)),
      (e = e ? e.slice(0) : []),
      (r = Object.assign({}, r)));
    let n = { command: t, args: e, options: r, file: void 0, original: { command: t, args: e } };
    return r.shell ? n : pCt(n);
  }
  gPe.exports = mCt;
});
var SPe = A((POr, bPe) => {
  "use strict";
  var mV = process.platform === "win32";
  function fV(t, e) {
    return Object.assign(new Error(`${e} ${t.command} ENOENT`), {
      code: "ENOENT",
      errno: "ENOENT",
      syscall: `${e} ${t.command}`,
      path: t.command,
      spawnargs: t.args,
    });
  }
  function fCt(t, e) {
    if (!mV) return;
    let r = t.emit;
    t.emit = function (n, o) {
      if (n === "exit") {
        let i = vPe(o, e);
        if (i) return r.call(t, "error", i);
      }
      return r.apply(t, arguments);
    };
  }
  function vPe(t, e) {
    return mV && t === 1 && !e.file ? fV(e.original, "spawn") : null;
  }
  function hCt(t, e) {
    return mV && t === 1 && !e.file ? fV(e.original, "spawnSync") : null;
  }
  bPe.exports = {
    hookChildProcess: fCt,
    verifyENOENT: vPe,
    verifyENOENTSync: hCt,
    notFoundError: fV,
  };
});
var xPe = A((IOr, uy) => {
  "use strict";
  var wPe = require("child_process"),
    hV = yPe(),
    gV = SPe();
  function _Pe(t, e, r) {
    let n = hV(t, e, r),
      o = wPe.spawn(n.command, n.args, n.options);
    return (gV.hookChildProcess(o, n), o);
  }
  function gCt(t, e, r) {
    let n = hV(t, e, r),
      o = wPe.spawnSync(n.command, n.args, n.options);
    return ((o.error = o.error || gV.verifyENOENTSync(o.status, n)), o);
  }
  uy.exports = _Pe;
  uy.exports.spawn = _Pe;
  uy.exports.sync = gCt;
  uy.exports._parse = hV;
  uy.exports._enoent = gV;
});
var RPe = A((kOr, APe) => {
  "use strict";
  APe.exports = (t) => {
    let e =
        typeof t == "string"
          ? `
`
          : 10,
      r = typeof t == "string" ? "\r" : 13;
    return (
      t[t.length - 1] === e && (t = t.slice(0, t.length - 1)),
      t[t.length - 1] === r && (t = t.slice(0, t.length - 1)),
      t
    );
  };
});
var TPe = A((DOr, fx) => {
  "use strict";
  var mx = require("path"),
    EPe = cV(),
    CPe = (t) => {
      t = { cwd: process.cwd(), path: process.env[EPe()], execPath: process.execPath, ...t };
      let e,
        r = mx.resolve(t.cwd),
        n = [];
      for (; e !== r; )
        (n.push(mx.join(r, "node_modules/.bin")), (e = r), (r = mx.resolve(r, "..")));
      let o = mx.resolve(t.cwd, t.execPath, "..");
      return (n.push(o), n.concat(t.path).join(mx.delimiter));
    };
  fx.exports = CPe;
  fx.exports.default = CPe;
  fx.exports.env = (t) => {
    t = { env: process.env, ...t };
    let e = { ...t.env },
      r = EPe({ env: e });
    return ((t.path = e[r]), (e[r] = fx.exports(t)), e);
  };
});
var IPe = A((MOr, yV) => {
  "use strict";
  var PPe = (t, e) => {
    for (let r of Reflect.ownKeys(e))
      Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
    return t;
  };
  yV.exports = PPe;
  yV.exports.default = PPe;
});
var DPe = A((OOr, TD) => {
  "use strict";
  var yCt = IPe(),
    CD = new WeakMap(),
    kPe = (t, e = {}) => {
      if (typeof t != "function") throw new TypeError("Expected a function");
      let r,
        n = 0,
        o = t.displayName || t.name || "<anonymous>",
        i = function (...s) {
          if ((CD.set(i, ++n), n === 1)) ((r = t.apply(this, s)), (t = null));
          else if (e.throw === !0) throw new Error(`Function \`${o}\` can only be called once`);
          return r;
        };
      return (yCt(i, t), CD.set(i, n), i);
    };
  TD.exports = kPe;
  TD.exports.default = kPe;
  TD.exports.callCount = (t) => {
    if (!CD.has(t))
      throw new Error(`The given function \`${t.name}\` is not wrapped by the \`onetime\` package`);
    return CD.get(t);
  };
});
var MPe = A((PD) => {
  "use strict";
  Object.defineProperty(PD, "__esModule", { value: !0 });
  PD.SIGNALS = void 0;
  var vCt = [
    {
      name: "SIGHUP",
      number: 1,
      action: "terminate",
      description: "Terminal closed",
      standard: "posix",
    },
    {
      name: "SIGINT",
      number: 2,
      action: "terminate",
      description: "User interruption with CTRL-C",
      standard: "ansi",
    },
    {
      name: "SIGQUIT",
      number: 3,
      action: "core",
      description: "User interruption with CTRL-\\",
      standard: "posix",
    },
    {
      name: "SIGILL",
      number: 4,
      action: "core",
      description: "Invalid machine instruction",
      standard: "ansi",
    },
    {
      name: "SIGTRAP",
      number: 5,
      action: "core",
      description: "Debugger breakpoint",
      standard: "posix",
    },
    { name: "SIGABRT", number: 6, action: "core", description: "Aborted", standard: "ansi" },
    { name: "SIGIOT", number: 6, action: "core", description: "Aborted", standard: "bsd" },
    {
      name: "SIGBUS",
      number: 7,
      action: "core",
      description: "Bus error due to misaligned, non-existing address or paging error",
      standard: "bsd",
    },
    {
      name: "SIGEMT",
      number: 7,
      action: "terminate",
      description: "Command should be emulated but is not implemented",
      standard: "other",
    },
    {
      name: "SIGFPE",
      number: 8,
      action: "core",
      description: "Floating point arithmetic error",
      standard: "ansi",
    },
    {
      name: "SIGKILL",
      number: 9,
      action: "terminate",
      description: "Forced termination",
      standard: "posix",
      forced: !0,
    },
    {
      name: "SIGUSR1",
      number: 10,
      action: "terminate",
      description: "Application-specific signal",
      standard: "posix",
    },
    {
      name: "SIGSEGV",
      number: 11,
      action: "core",
      description: "Segmentation fault",
      standard: "ansi",
    },
    {
      name: "SIGUSR2",
      number: 12,
      action: "terminate",
      description: "Application-specific signal",
      standard: "posix",
    },
    {
      name: "SIGPIPE",
      number: 13,
      action: "terminate",
      description: "Broken pipe or socket",
      standard: "posix",
    },
    {
      name: "SIGALRM",
      number: 14,
      action: "terminate",
      description: "Timeout or timer",
      standard: "posix",
    },
    {
      name: "SIGTERM",
      number: 15,
      action: "terminate",
      description: "Termination",
      standard: "ansi",
    },
    {
      name: "SIGSTKFLT",
      number: 16,
      action: "terminate",
      description: "Stack is empty or overflowed",
      standard: "other",
    },
    {
      name: "SIGCHLD",
      number: 17,
      action: "ignore",
      description: "Child process terminated, paused or unpaused",
      standard: "posix",
    },
    {
      name: "SIGCLD",
      number: 17,
      action: "ignore",
      description: "Child process terminated, paused or unpaused",
      standard: "other",
    },
    {
      name: "SIGCONT",
      number: 18,
      action: "unpause",
      description: "Unpaused",
      standard: "posix",
      forced: !0,
    },
    {
      name: "SIGSTOP",
      number: 19,
      action: "pause",
      description: "Paused",
      standard: "posix",
      forced: !0,
    },
    {
      name: "SIGTSTP",
      number: 20,
      action: "pause",
      description: 'Paused using CTRL-Z or "suspend"',
      standard: "posix",
    },
    {
      name: "SIGTTIN",
      number: 21,
      action: "pause",
      description: "Background process cannot read terminal input",
      standard: "posix",
    },
    {
      name: "SIGBREAK",
      number: 21,
      action: "terminate",
      description: "User interruption with CTRL-BREAK",
      standard: "other",
    },
    {
      name: "SIGTTOU",
      number: 22,
      action: "pause",
      description: "Background process cannot write to terminal output",
      standard: "posix",
    },
    {
      name: "SIGURG",
      number: 23,
      action: "ignore",
      description: "Socket received out-of-band data",
      standard: "bsd",
    },
    {
      name: "SIGXCPU",
      number: 24,
      action: "core",
      description: "Process timed out",
      standard: "bsd",
    },
    { name: "SIGXFSZ", number: 25, action: "core", description: "File too big", standard: "bsd" },
    {
      name: "SIGVTALRM",
      number: 26,
      action: "terminate",
      description: "Timeout or timer",
      standard: "bsd",
    },
    {
      name: "SIGPROF",
      number: 27,
      action: "terminate",
      description: "Timeout or timer",
      standard: "bsd",
    },
    {
      name: "SIGWINCH",
      number: 28,
      action: "ignore",
      description: "Terminal window size changed",
      standard: "bsd",
    },
    {
      name: "SIGIO",
      number: 29,
      action: "terminate",
      description: "I/O is available",
      standard: "other",
    },
    {
      name: "SIGPOLL",
      number: 29,
      action: "terminate",
      description: "Watched event",
      standard: "other",
    },
    {
      name: "SIGINFO",
      number: 29,
      action: "ignore",
      description: "Request for process information",
      standard: "other",
    },
    {
      name: "SIGPWR",
      number: 30,
      action: "terminate",
      description: "Device running out of power",
      standard: "systemv",
    },
    {
      name: "SIGSYS",
      number: 31,
      action: "core",
      description: "Invalid system call",
      standard: "other",
    },
    {
      name: "SIGUNUSED",
      number: 31,
      action: "terminate",
      description: "Invalid system call",
      standard: "other",
    },
  ];
  PD.SIGNALS = vCt;
});
var vV = A((dy) => {
  "use strict";
  Object.defineProperty(dy, "__esModule", { value: !0 });
  dy.SIGRTMAX = dy.getRealtimeSignals = void 0;
  var bCt = function () {
    let t = NPe - OPe + 1;
    return Array.from({ length: t }, SCt);
  };
  dy.getRealtimeSignals = bCt;
  var SCt = function (t, e) {
      return {
        name: `SIGRT${e + 1}`,
        number: OPe + e,
        action: "terminate",
        description: "Application-specific signal (realtime)",
        standard: "posix",
      };
    },
    OPe = 34,
    NPe = 64;
  dy.SIGRTMAX = NPe;
});
var LPe = A((ID) => {
  "use strict";
  Object.defineProperty(ID, "__esModule", { value: !0 });
  ID.getSignals = void 0;
  var wCt = require("os"),
    _Ct = MPe(),
    xCt = vV(),
    ACt = function () {
      let t = (0, xCt.getRealtimeSignals)();
      return [..._Ct.SIGNALS, ...t].map(RCt);
    };
  ID.getSignals = ACt;
  var RCt = function ({
    name: t,
    number: e,
    description: r,
    action: n,
    forced: o = !1,
    standard: i,
  }) {
    let {
        signals: { [t]: s },
      } = wCt.constants,
      a = s !== void 0;
    return {
      name: t,
      number: a ? s : e,
      description: r,
      supported: a,
      action: n,
      forced: o,
      standard: i,
    };
  };
});
var FPe = A((py) => {
  "use strict";
  Object.defineProperty(py, "__esModule", { value: !0 });
  py.signalsByNumber = py.signalsByName = void 0;
  var ECt = require("os"),
    BPe = LPe(),
    CCt = vV(),
    TCt = function () {
      return (0, BPe.getSignals)().reduce(PCt, {});
    },
    PCt = function (
      t,
      { name: e, number: r, description: n, supported: o, action: i, forced: s, standard: a },
    ) {
      return {
        ...t,
        [e]: {
          name: e,
          number: r,
          description: n,
          supported: o,
          action: i,
          forced: s,
          standard: a,
        },
      };
    },
    ICt = TCt();
  py.signalsByName = ICt;
  var kCt = function () {
      let t = (0, BPe.getSignals)(),
        e = CCt.SIGRTMAX + 1,
        r = Array.from({ length: e }, (n, o) => DCt(o, t));
      return Object.assign({}, ...r);
    },
    DCt = function (t, e) {
      let r = MCt(t, e);
      if (r === void 0) return {};
      let { name: n, description: o, supported: i, action: s, forced: a, standard: l } = r;
      return {
        [t]: {
          name: n,
          number: t,
          description: o,
          supported: i,
          action: s,
          forced: a,
          standard: l,
        },
      };
    },
    MCt = function (t, e) {
      let r = e.find(({ name: n }) => ECt.constants.signals[n] === t);
      return r !== void 0 ? r : e.find((n) => n.number === t);
    },
    OCt = kCt();
  py.signalsByNumber = OCt;
});
var UPe = A(($Or, $Pe) => {
  "use strict";
  var { signalsByName: NCt } = FPe(),
    LCt = ({
      timedOut: t,
      timeout: e,
      errorCode: r,
      signal: n,
      signalDescription: o,
      exitCode: i,
      isCanceled: s,
    }) =>
      t
        ? `timed out after ${e} milliseconds`
        : s
          ? "was canceled"
          : r !== void 0
            ? `failed with ${r}`
            : n !== void 0
              ? `was killed with ${n} (${o})`
              : i !== void 0
                ? `failed with exit code ${i}`
                : "failed",
    BCt = ({
      stdout: t,
      stderr: e,
      all: r,
      error: n,
      signal: o,
      exitCode: i,
      command: s,
      escapedCommand: a,
      timedOut: l,
      isCanceled: c,
      killed: u,
      parsed: {
        options: { timeout: p },
      },
    }) => {
      ((i = i === null ? void 0 : i), (o = o === null ? void 0 : o));
      let m = o === void 0 ? void 0 : NCt[o].description,
        f = n && n.code,
        v = `Command ${LCt({ timedOut: l, timeout: p, errorCode: f, signal: o, signalDescription: m, exitCode: i, isCanceled: c })}: ${s}`,
        y = Object.prototype.toString.call(n) === "[object Error]",
        w = y
          ? `${v}
${n.message}`
          : v,
        _ = [w, e, t].filter(Boolean).join(`
`);
      return (
        y ? ((n.originalMessage = n.message), (n.message = _)) : (n = new Error(_)),
        (n.shortMessage = w),
        (n.command = s),
        (n.escapedCommand = a),
        (n.exitCode = i),
        (n.signal = o),
        (n.signalDescription = m),
        (n.stdout = t),
        (n.stderr = e),
        r !== void 0 && (n.all = r),
        "bufferedData" in n && delete n.bufferedData,
        (n.failed = !0),
        (n.timedOut = !!l),
        (n.isCanceled = c),
        (n.killed = u && !l),
        n
      );
    };
  $Pe.exports = BCt;
});
var GPe = A((UOr, bV) => {
  "use strict";
  var kD = ["stdin", "stdout", "stderr"],
    FCt = (t) => kD.some((e) => t[e] !== void 0),
    qPe = (t) => {
      if (!t) return;
      let { stdio: e } = t;
      if (e === void 0) return kD.map((n) => t[n]);
      if (FCt(t))
        throw new Error(
          `It's not possible to provide \`stdio\` in combination with one of ${kD.map((n) => `\`${n}\``).join(", ")}`,
        );
      if (typeof e == "string") return e;
      if (!Array.isArray(e))
        throw new TypeError(
          `Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof e}\``,
        );
      let r = Math.max(e.length, kD.length);
      return Array.from({ length: r }, (n, o) => e[o]);
    };
  bV.exports = qPe;
  bV.exports.node = (t) => {
    let e = qPe(t);
    return e === "ipc"
      ? "ipc"
      : e === void 0 || typeof e == "string"
        ? [e, e, e, "ipc"]
        : e.includes("ipc")
          ? e
          : [...e, "ipc"];
  };
});
var WPe = A((qOr, DD) => {
  DD.exports = ["SIGABRT", "SIGALRM", "SIGHUP", "SIGINT", "SIGTERM"];
  process.platform !== "win32" &&
    DD.exports.push(
      "SIGVTALRM",
      "SIGXCPU",
      "SIGXFSZ",
      "SIGUSR2",
      "SIGTRAP",
      "SIGSYS",
      "SIGQUIT",
      "SIGIOT",
    );
  process.platform === "linux" &&
    DD.exports.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT", "SIGUNUSED");
});
var KPe = A((GOr, hy) => {
  var Lr = global.process,
    xm = function (t) {
      return (
        t &&
        typeof t == "object" &&
        typeof t.removeListener == "function" &&
        typeof t.emit == "function" &&
        typeof t.reallyExit == "function" &&
        typeof t.listeners == "function" &&
        typeof t.kill == "function" &&
        typeof t.pid == "number" &&
        typeof t.on == "function"
      );
    };
  xm(Lr)
    ? ((HPe = require("assert")),
      (my = WPe()),
      (jPe = /^win/i.test(Lr.platform)),
      (hx = require("events")),
      typeof hx != "function" && (hx = hx.EventEmitter),
      Lr.__signal_exit_emitter__
        ? (Fn = Lr.__signal_exit_emitter__)
        : ((Fn = Lr.__signal_exit_emitter__ = new hx()), (Fn.count = 0), (Fn.emitted = {})),
      Fn.infinite || (Fn.setMaxListeners(1 / 0), (Fn.infinite = !0)),
      (hy.exports = function (t, e) {
        if (!xm(global.process)) return function () {};
        (HPe.equal(typeof t, "function", "a callback must be provided for exit handler"),
          fy === !1 && SV());
        var r = "exit";
        e && e.alwaysLast && (r = "afterexit");
        var n = function () {
          (Fn.removeListener(r, t),
            Fn.listeners("exit").length === 0 && Fn.listeners("afterexit").length === 0 && MD());
        };
        return (Fn.on(r, t), n);
      }),
      (MD = function () {
        !fy ||
          !xm(global.process) ||
          ((fy = !1),
          my.forEach(function (e) {
            try {
              Lr.removeListener(e, OD[e]);
            } catch {}
          }),
          (Lr.emit = ND),
          (Lr.reallyExit = wV),
          (Fn.count -= 1));
      }),
      (hy.exports.unload = MD),
      (Am = function (e, r, n) {
        Fn.emitted[e] || ((Fn.emitted[e] = !0), Fn.emit(e, r, n));
      }),
      (OD = {}),
      my.forEach(function (t) {
        OD[t] = function () {
          if (xm(global.process)) {
            var r = Lr.listeners(t);
            r.length === Fn.count &&
              (MD(),
              Am("exit", null, t),
              Am("afterexit", null, t),
              jPe && t === "SIGHUP" && (t = "SIGINT"),
              Lr.kill(Lr.pid, t));
          }
        };
      }),
      (hy.exports.signals = function () {
        return my;
      }),
      (fy = !1),
      (SV = function () {
        fy ||
          !xm(global.process) ||
          ((fy = !0),
          (Fn.count += 1),
          (my = my.filter(function (e) {
            try {
              return (Lr.on(e, OD[e]), !0);
            } catch {
              return !1;
            }
          })),
          (Lr.emit = VPe),
          (Lr.reallyExit = zPe));
      }),
      (hy.exports.load = SV),
      (wV = Lr.reallyExit),
      (zPe = function (e) {
        xm(global.process) &&
          ((Lr.exitCode = e || 0),
          Am("exit", Lr.exitCode, null),
          Am("afterexit", Lr.exitCode, null),
          wV.call(Lr, Lr.exitCode));
      }),
      (ND = Lr.emit),
      (VPe = function (e, r) {
        if (e === "exit" && xm(global.process)) {
          r !== void 0 && (Lr.exitCode = r);
          var n = ND.apply(this, arguments);
          return (Am("exit", Lr.exitCode, null), Am("afterexit", Lr.exitCode, null), n);
        } else return ND.apply(this, arguments);
      }))
    : (hy.exports = function () {
        return function () {};
      });
  var HPe, my, jPe, hx, Fn, MD, Am, OD, fy, SV, wV, zPe, ND, VPe;
});
var XPe = A((WOr, ZPe) => {
  "use strict";
  var $Ct = require("os"),
    UCt = KPe(),
    qCt = 1e3 * 5,
    GCt = (t, e = "SIGTERM", r = {}) => {
      let n = t(e);
      return (WCt(t, e, r, n), n);
    },
    WCt = (t, e, r, n) => {
      if (!HCt(e, r, n)) return;
      let o = zCt(r),
        i = setTimeout(() => {
          t("SIGKILL");
        }, o);
      i.unref && i.unref();
    },
    HCt = (t, { forceKillAfterTimeout: e }, r) => jCt(t) && e !== !1 && r,
    jCt = (t) =>
      t === $Ct.constants.signals.SIGTERM ||
      (typeof t == "string" && t.toUpperCase() === "SIGTERM"),
    zCt = ({ forceKillAfterTimeout: t = !0 }) => {
      if (t === !0) return qCt;
      if (!Number.isFinite(t) || t < 0)
        throw new TypeError(
          `Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${t}\` (${typeof t})`,
        );
      return t;
    },
    VCt = (t, e) => {
      t.kill() && (e.isCanceled = !0);
    },
    KCt = (t, e, r) => {
      (t.kill(e), r(Object.assign(new Error("Timed out"), { timedOut: !0, signal: e })));
    },
    ZCt = (t, { timeout: e, killSignal: r = "SIGTERM" }, n) => {
      if (e === 0 || e === void 0) return n;
      let o,
        i = new Promise((a, l) => {
          o = setTimeout(() => {
            KCt(t, r, l);
          }, e);
        }),
        s = n.finally(() => {
          clearTimeout(o);
        });
      return Promise.race([i, s]);
    },
    XCt = ({ timeout: t }) => {
      if (t !== void 0 && (!Number.isFinite(t) || t < 0))
        throw new TypeError(
          `Expected the \`timeout\` option to be a non-negative integer, got \`${t}\` (${typeof t})`,
        );
    },
    YCt = async (t, { cleanup: e, detached: r }, n) => {
      if (!e || r) return n;
      let o = UCt(() => {
        t.kill();
      });
      return n.finally(() => {
        o();
      });
    };
  ZPe.exports = {
    spawnedKill: GCt,
    spawnedCancel: VCt,
    setupTimeout: ZCt,
    validateTimeout: XCt,
    setExitHandler: YCt,
  };
});
var JPe = A((HOr, YPe) => {
  "use strict";
  var Ha = (t) => t !== null && typeof t == "object" && typeof t.pipe == "function";
  Ha.writable = (t) =>
    Ha(t) &&
    t.writable !== !1 &&
    typeof t._write == "function" &&
    typeof t._writableState == "object";
  Ha.readable = (t) =>
    Ha(t) &&
    t.readable !== !1 &&
    typeof t._read == "function" &&
    typeof t._readableState == "object";
  Ha.duplex = (t) => Ha.writable(t) && Ha.readable(t);
  Ha.transform = (t) => Ha.duplex(t) && typeof t._transform == "function";
  YPe.exports = Ha;
});
var eIe = A((jOr, QPe) => {
  "use strict";
  var { PassThrough: JCt } = require("stream");
  QPe.exports = (t) => {
    t = { ...t };
    let { array: e } = t,
      { encoding: r } = t,
      n = r === "buffer",
      o = !1;
    (e ? (o = !(r || n)) : (r = r || "utf8"), n && (r = null));
    let i = new JCt({ objectMode: o });
    r && i.setEncoding(r);
    let s = 0,
      a = [];
    return (
      i.on("data", (l) => {
        (a.push(l), o ? (s = a.length) : (s += l.length));
      }),
      (i.getBufferedValue = () => (e ? a : n ? Buffer.concat(a, s) : a.join(""))),
      (i.getBufferedLength = () => s),
      i
    );
  };
});
var tIe = A((zOr, gx) => {
  "use strict";
  var { constants: QCt } = require("buffer"),
    eTt = require("stream"),
    { promisify: tTt } = require("util"),
    rTt = eIe(),
    nTt = tTt(eTt.pipeline),
    LD = class extends Error {
      constructor() {
        (super("maxBuffer exceeded"), (this.name = "MaxBufferError"));
      }
    };
  async function _V(t, e) {
    if (!t) throw new Error("Expected a stream");
    e = { maxBuffer: 1 / 0, ...e };
    let { maxBuffer: r } = e,
      n = rTt(e);
    return (
      await new Promise((o, i) => {
        let s = (a) => {
          (a && n.getBufferedLength() <= QCt.MAX_LENGTH && (a.bufferedData = n.getBufferedValue()),
            i(a));
        };
        ((async () => {
          try {
            (await nTt(t, n), o());
          } catch (a) {
            s(a);
          }
        })(),
          n.on("data", () => {
            n.getBufferedLength() > r && s(new LD());
          }));
      }),
      n.getBufferedValue()
    );
  }
  gx.exports = _V;
  gx.exports.buffer = (t, e) => _V(t, { ...e, encoding: "buffer" });
  gx.exports.array = (t, e) => _V(t, { ...e, array: !0 });
  gx.exports.MaxBufferError = LD;
});
var nIe = A((VOr, rIe) => {
  "use strict";
  var { PassThrough: oTt } = require("stream");
  rIe.exports = function () {
    var t = [],
      e = new oTt({ objectMode: !0 });
    return (
      e.setMaxListeners(0),
      (e.add = r),
      (e.isEmpty = n),
      e.on("unpipe", o),
      Array.prototype.slice.call(arguments).forEach(r),
      e
    );
    function r(i) {
      return Array.isArray(i)
        ? (i.forEach(r), this)
        : (t.push(i),
          i.once("end", o.bind(null, i)),
          i.once("error", e.emit.bind(e, "error")),
          i.pipe(e, { end: !1 }),
          this);
    }
    function n() {
      return t.length == 0;
    }
    function o(i) {
      ((t = t.filter(function (s) {
        return s !== i;
      })),
        !t.length && e.readable && e.end());
    }
  };
});
var aIe = A((KOr, sIe) => {
  "use strict";
  var iIe = JPe(),
    oIe = tIe(),
    iTt = nIe(),
    sTt = (t, e) => {
      e === void 0 || t.stdin === void 0 || (iIe(e) ? e.pipe(t.stdin) : t.stdin.end(e));
    },
    aTt = (t, { all: e }) => {
      if (!e || (!t.stdout && !t.stderr)) return;
      let r = iTt();
      return (t.stdout && r.add(t.stdout), t.stderr && r.add(t.stderr), r);
    },
    xV = async (t, e) => {
      if (t) {
        t.destroy();
        try {
          return await e;
        } catch (r) {
          return r.bufferedData;
        }
      }
    },
    AV = (t, { encoding: e, buffer: r, maxBuffer: n }) => {
      if (!(!t || !r))
        return e ? oIe(t, { encoding: e, maxBuffer: n }) : oIe.buffer(t, { maxBuffer: n });
    },
    lTt = async ({ stdout: t, stderr: e, all: r }, { encoding: n, buffer: o, maxBuffer: i }, s) => {
      let a = AV(t, { encoding: n, buffer: o, maxBuffer: i }),
        l = AV(e, { encoding: n, buffer: o, maxBuffer: i }),
        c = AV(r, { encoding: n, buffer: o, maxBuffer: i * 2 });
      try {
        return await Promise.all([s, a, l, c]);
      } catch (u) {
        return Promise.all([
          { error: u, signal: u.signal, timedOut: u.timedOut },
          xV(t, a),
          xV(e, l),
          xV(r, c),
        ]);
      }
    },
    cTt = ({ input: t }) => {
      if (iIe(t)) throw new TypeError("The `input` option cannot be a stream in sync mode");
    };
  sIe.exports = {
    handleInput: sTt,
    makeAllStream: aTt,
    getSpawnedResult: lTt,
    validateInputSync: cTt,
  };
});
var cIe = A((ZOr, lIe) => {
  "use strict";
  var uTt = (async () => {})().constructor.prototype,
    dTt = ["then", "catch", "finally"].map((t) => [t, Reflect.getOwnPropertyDescriptor(uTt, t)]),
    pTt = (t, e) => {
      for (let [r, n] of dTt) {
        let o = typeof e == "function" ? (...i) => Reflect.apply(n.value, e(), i) : n.value.bind(e);
        Reflect.defineProperty(t, r, { ...n, value: o });
      }
      return t;
    },
    mTt = (t) =>
      new Promise((e, r) => {
        (t.on("exit", (n, o) => {
          e({ exitCode: n, signal: o });
        }),
          t.on("error", (n) => {
            r(n);
          }),
          t.stdin &&
            t.stdin.on("error", (n) => {
              r(n);
            }));
      });
  lIe.exports = { mergePromise: pTt, getSpawnedPromise: mTt };
});
var pIe = A((XOr, dIe) => {
  "use strict";
  var uIe = (t, e = []) => (Array.isArray(e) ? [t, ...e] : [t]),
    fTt = /^[\w.-]+$/,
    hTt = /"/g,
    gTt = (t) => (typeof t != "string" || fTt.test(t) ? t : `"${t.replace(hTt, '\\"')}"`),
    yTt = (t, e) => uIe(t, e).join(" "),
    vTt = (t, e) =>
      uIe(t, e)
        .map((r) => gTt(r))
        .join(" "),
    bTt = / +/g,
    STt = (t) => {
      let e = [];
      for (let r of t.trim().split(bTt)) {
        let n = e[e.length - 1];
        n && n.endsWith("\\") ? (e[e.length - 1] = `${n.slice(0, -1)} ${r}`) : e.push(r);
      }
      return e;
    };
  dIe.exports = { joinCommand: yTt, getEscapedCommand: vTt, parseCommand: STt };
});
var EV = A((YOr, gy) => {
  "use strict";
  var wTt = require("path"),
    RV = require("child_process"),
    _Tt = xPe(),
    xTt = RPe(),
    ATt = TPe(),
    RTt = DPe(),
    BD = UPe(),
    fIe = GPe(),
    {
      spawnedKill: ETt,
      spawnedCancel: CTt,
      setupTimeout: TTt,
      validateTimeout: PTt,
      setExitHandler: ITt,
    } = XPe(),
    { handleInput: kTt, getSpawnedResult: DTt, makeAllStream: MTt, validateInputSync: OTt } = aIe(),
    { mergePromise: mIe, getSpawnedPromise: NTt } = cIe(),
    { joinCommand: hIe, parseCommand: gIe, getEscapedCommand: yIe } = pIe(),
    LTt = 1e3 * 1e3 * 100,
    BTt = ({ env: t, extendEnv: e, preferLocal: r, localDir: n, execPath: o }) => {
      let i = e ? { ...process.env, ...t } : t;
      return r ? ATt.env({ env: i, cwd: n, execPath: o }) : i;
    },
    vIe = (t, e, r = {}) => {
      let n = _Tt._parse(t, e, r);
      return (
        (t = n.command),
        (e = n.args),
        (r = n.options),
        (r = {
          maxBuffer: LTt,
          buffer: !0,
          stripFinalNewline: !0,
          extendEnv: !0,
          preferLocal: !1,
          localDir: r.cwd || process.cwd(),
          execPath: process.execPath,
          encoding: "utf8",
          reject: !0,
          cleanup: !0,
          all: !1,
          windowsHide: !0,
          ...r,
        }),
        (r.env = BTt(r)),
        (r.stdio = fIe(r)),
        process.platform === "win32" && wTt.basename(t, ".exe") === "cmd" && e.unshift("/q"),
        { file: t, args: e, options: r, parsed: n }
      );
    },
    yx = (t, e, r) =>
      typeof e != "string" && !Buffer.isBuffer(e)
        ? r === void 0
          ? void 0
          : ""
        : t.stripFinalNewline
          ? xTt(e)
          : e,
    FD = (t, e, r) => {
      let n = vIe(t, e, r),
        o = hIe(t, e),
        i = yIe(t, e);
      PTt(n.options);
      let s;
      try {
        s = RV.spawn(n.file, n.args, n.options);
      } catch (f) {
        let h = new RV.ChildProcess(),
          v = Promise.reject(
            BD({
              error: f,
              stdout: "",
              stderr: "",
              all: "",
              command: o,
              escapedCommand: i,
              parsed: n,
              timedOut: !1,
              isCanceled: !1,
              killed: !1,
            }),
          );
        return mIe(h, v);
      }
      let a = NTt(s),
        l = TTt(s, n.options, a),
        c = ITt(s, n.options, l),
        u = { isCanceled: !1 };
      ((s.kill = ETt.bind(null, s.kill.bind(s))), (s.cancel = CTt.bind(null, s, u)));
      let m = RTt(async () => {
        let [{ error: f, exitCode: h, signal: v, timedOut: y }, w, _, S] = await DTt(
            s,
            n.options,
            c,
          ),
          E = yx(n.options, w),
          T = yx(n.options, _),
          P = yx(n.options, S);
        if (f || h !== 0 || v !== null) {
          let M = BD({
            error: f,
            exitCode: h,
            signal: v,
            stdout: E,
            stderr: T,
            all: P,
            command: o,
            escapedCommand: i,
            parsed: n,
            timedOut: y,
            isCanceled: u.isCanceled,
            killed: s.killed,
          });
          if (!n.options.reject) return M;
          throw M;
        }
        return {
          command: o,
          escapedCommand: i,
          exitCode: 0,
          stdout: E,
          stderr: T,
          all: P,
          failed: !1,
          timedOut: !1,
          isCanceled: !1,
          killed: !1,
        };
      });
      return (kTt(s, n.options.input), (s.all = MTt(s, n.options)), mIe(s, m));
    };
  gy.exports = FD;
  gy.exports.sync = (t, e, r) => {
    let n = vIe(t, e, r),
      o = hIe(t, e),
      i = yIe(t, e);
    OTt(n.options);
    let s;
    try {
      s = RV.spawnSync(n.file, n.args, n.options);
    } catch (c) {
      throw BD({
        error: c,
        stdout: "",
        stderr: "",
        all: "",
        command: o,
        escapedCommand: i,
        parsed: n,
        timedOut: !1,
        isCanceled: !1,
        killed: !1,
      });
    }
    let a = yx(n.options, s.stdout, s.error),
      l = yx(n.options, s.stderr, s.error);
    if (s.error || s.status !== 0 || s.signal !== null) {
      let c = BD({
        stdout: a,
        stderr: l,
        error: s.error,
        signal: s.signal,
        exitCode: s.status,
        command: o,
        escapedCommand: i,
        parsed: n,
        timedOut: s.error && s.error.code === "ETIMEDOUT",
        isCanceled: !1,
        killed: s.signal !== null,
      });
      if (!n.options.reject) return c;
      throw c;
    }
    return {
      command: o,
      escapedCommand: i,
      exitCode: 0,
      stdout: a,
      stderr: l,
      failed: !1,
      timedOut: !1,
      isCanceled: !1,
      killed: !1,
    };
  };
  gy.exports.command = (t, e) => {
    let [r, ...n] = gIe(t);
    return FD(r, n, e);
  };
  gy.exports.commandSync = (t, e) => {
    let [r, ...n] = gIe(t);
    return FD.sync(r, n, e);
  };
  gy.exports.node = (t, e, r = {}) => {
    e && !Array.isArray(e) && typeof e == "object" && ((r = e), (e = []));
    let n = fIe.node(r),
      o = process.execArgv.filter((a) => !a.startsWith("--inspect")),
      { nodePath: i = process.execPath, nodeOptions: s = o } = r;
    return FD(i, [...s, t, ...(Array.isArray(e) ? e : [])], {
      ...r,
      stdin: void 0,
      stdout: void 0,
      stderr: void 0,
      stdio: n,
      shell: !1,
    });
  };
});
var Br,
  vx = g(() => {
    Br = F(require("node:path"));
  });
async function CV(t, e, r) {
  if ((await e.platformFamily()) === "windows") return t;
  let n = await CI(t, e, "pwd", r);
  return n == null ? null : n;
}
async function bIe(t, e) {
  let r = await e.spawn({
    args: [
      "bash",
      "-p",
      "-c",
      "entry=$1; while [[ -n $entry ]]; do [[ -L $entry ]] && exit 0; entry=${entry%/*}; done; exit 1",
      "codex-git",
      t,
    ],
    cwd: "/",
    ...Sw,
    allowedNonZeroExitCodes: [1],
  });
  return (await _r(r)).code === 0;
}
async function SIe(t, e, r, n, o) {
  if ((await t.platformFamily()) === "windows" || n.aborted) return !1;
  let i = await CV(e, t, n);
  if (r != null && i !== r) return !0;
  let s = await t.spawn({
      args: ["bash", "-p", "-c", FTt, "codex-git", e, i ?? "", r == null ? "missing" : "linked"],
      cwd: "/",
      signal: n,
      outputBytesCap: 1024,
      allowedNonZeroExitCodes: [1],
    }),
    a = s.stdout.getReader(),
    l = Promise.all([s.wait(), new Response(s.stderr).arrayBuffer()]);
  try {
    let { done: c } = await a.read();
    if (!c && r == null && i != null && (await o(i))) return !n.aborted;
    let [{ code: u }] = await l;
    return !n.aborted && u === 0;
  } finally {
    (a.releaseLock(), await s.stdin.close().catch(() => {}), s.kill(), await l);
  }
}
