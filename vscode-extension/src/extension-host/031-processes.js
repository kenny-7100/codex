var Gx = A((Ju) => {
  "use strict";
  var VMt =
    (Ju && Ju.__importDefault) ||
    function (t) {
      return t && t.__esModule ? t : { default: t };
    };
  Object.defineProperty(Ju, "__esModule", { value: !0 });
  Ju.RateLimit = Ju.Sema = void 0;
  var KMt = VMt(require("events"));
  function ZMt(t, e, r, n, o) {
    for (let i = 0; i < o; ++i) ((r[i + n] = t[i + e]), (t[i + e] = void 0));
  }
  function XMt(t) {
    return (
      (t = t >>> 0),
      (t = t - 1),
      (t = t | (t >> 1)),
      (t = t | (t >> 2)),
      (t = t | (t >> 4)),
      (t = t | (t >> 8)),
      (t = t | (t >> 16)),
      t + 1
    );
  }
  function hOe(t) {
    return XMt(Math.min(Math.max(16, t), 1073741824));
  }
  var BM = class {
      constructor(e) {
        ((this._capacity = hOe(e)), (this._length = 0), (this._front = 0), (this.arr = []));
      }
      push(e) {
        let r = this._length;
        this.checkCapacity(r + 1);
        let n = (this._front + r) & (this._capacity - 1);
        return ((this.arr[n] = e), (this._length = r + 1), r + 1);
      }
      pop() {
        let e = this._length;
        if (e === 0) return;
        let r = (this._front + e - 1) & (this._capacity - 1),
          n = this.arr[r];
        return ((this.arr[r] = void 0), (this._length = e - 1), n);
      }
      shift() {
        let e = this._length;
        if (e === 0) return;
        let r = this._front,
          n = this.arr[r];
        return (
          (this.arr[r] = void 0),
          (this._front = (r + 1) & (this._capacity - 1)),
          (this._length = e - 1),
          n
        );
      }
      get length() {
        return this._length;
      }
      checkCapacity(e) {
        this._capacity < e && this.resizeTo(hOe(this._capacity * 1.5 + 16));
      }
      resizeTo(e) {
        let r = this._capacity;
        this._capacity = e;
        let n = this._front,
          o = this._length;
        if (n + o > r) {
          let i = (n + o) & (r - 1);
          ZMt(this.arr, 0, this.arr, r, i);
        }
      }
    },
    b3 = class extends KMt.default {};
  function gOe(t) {
    return typeof t == "function";
  }
  function yOe() {
    return "1";
  }
  var FM = class {
    constructor(e, { initFn: r = yOe, pauseFn: n, resumeFn: o, capacity: i = 10 } = {}) {
      if (gOe(n) !== gOe(o)) throw new Error("pauseFn and resumeFn must be both set for pausing");
      ((this.nrTokens = e),
        (this.free = new BM(e)),
        (this.waiting = new BM(i)),
        (this.releaseEmitter = new b3()),
        (this.noTokens = r === yOe),
        (this.pauseFn = n),
        (this.resumeFn = o),
        (this.paused = !1),
        this.releaseEmitter.on("release", (s) => {
          let a = this.waiting.shift();
          a
            ? a.resolve(s)
            : (this.resumeFn && this.paused && ((this.paused = !1), this.resumeFn()),
              this.free.push(s));
        }));
      for (let s = 0; s < e; s++) this.free.push(r());
    }
    tryAcquire() {
      return this.free.pop();
    }
    async acquire() {
      let e = this.tryAcquire();
      return e !== void 0
        ? e
        : new Promise((r, n) => {
            (this.pauseFn && !this.paused && ((this.paused = !0), this.pauseFn()),
              this.waiting.push({ resolve: r, reject: n }));
          });
    }
    release(e) {
      this.releaseEmitter.emit("release", this.noTokens ? "1" : e);
    }
    drain() {
      let e = new Array(this.nrTokens);
      for (let r = 0; r < this.nrTokens; r++) e[r] = this.acquire();
      return Promise.all(e);
    }
    nrWaiting() {
      return this.waiting.length;
    }
  };
  Ju.Sema = FM;
  function YMt(t, { timeUnit: e = 1e3, uniformDistribution: r = !1 } = {}) {
    let n = new FM(r ? 1 : t),
      o = r ? e / t : e;
    return async function () {
      (await n.acquire(), setTimeout(() => n.release(), o));
    };
  }
  Ju.RateLimit = YMt;
});
function vOe(t) {
  return {
    canceledCommandCount: 0,
    closed: !1,
    commandCount: 0,
    commandDurationMsMax: 0,
    commandDurationMsSum: 0,
    concurrentOperationCount: t,
    diffCommandCount: 0,
    failedCommandCount: 0,
    slowestFailedCommand: null,
    outputLimitExceededCount: 0,
    peakCommandConcurrency: 0,
    statusCommandCount: 0,
    stderrBytes: 0,
    stdoutBytes: 0,
    timedOutCommandCount: 0,
    untrackedCacheCoalescedCount: 0,
    untrackedCacheHitCount: 0,
    untrackedCacheMissCount: 0,
    untrackedListCommandCount: 0,
    untrackedStatusCommandCount: 0,
  };
}
var bOe = g(() => {});
function S3() {
  let t = Wx.size + 1;
  for (let r of Wx) r.concurrentOperationCount = Math.max(r.concurrentOperationCount, t);
  let e = vOe(t);
  return (Wx.add(e), e);
}
function qM(t) {
  t.closed || ((t.closed = !0), Wx.delete(t));
}
function wOe(t) {
  let e = UM.getStore(),
    r = e?.attribution;
  if (r == null || r.closed) return;
  let n = ux(t, 0);
  $M += 1;
  for (let i of Wx) i.peakCommandConcurrency = Math.max(i.peakCommandConcurrency, $M);
  ((r.commandCount += 1),
    n === "status"
      ? ((r.statusCommandCount += 1),
        (t.includes("--untracked-files=normal") || t.includes("--untracked-files=all")) &&
          (r.untrackedStatusCommandCount += 1))
      : n === "ls-files" && t.includes("--others")
        ? (r.untrackedListCommandCount += 1)
        : n === "diff" && (r.diffCommandCount += 1));
  let o = !1;
  return (i) => {
    o ||
      ((o = !0),
      ($M = Math.max(0, $M - 1)),
      !r.closed &&
        ((r.commandDurationMsSum += i.durationMs),
        (r.commandDurationMsMax = Math.max(r.commandDurationMsMax, i.durationMs)),
        (r.stdoutBytes += i.stdoutBytes),
        (r.stderrBytes += i.stderrBytes),
        i.success || ((r.failedCommandCount += 1), e?.onCommandFailure?.()),
        !i.success &&
          i.failureKind != null &&
          (r.slowestFailedCommand == null || i.durationMs >= r.slowestFailedCommand.durationMs) &&
          (r.slowestFailedCommand = {
            durationMs: i.durationMs,
            errorKind: i.errorKind,
            exitCodeBucket: QMt(i.exitCode),
            failureKind: i.failureKind,
            subcommand: n,
          }),
        (r.canceledCommandCount += i.aborted ? 1 : 0),
        (r.timedOutCommandCount += i.timedOut ? 1 : 0),
        (r.outputLimitExceededCount += i.outputLimitExceeded ? 1 : 0)));
  };
}
function QMt(t) {
  switch (t) {
    case null:
      return null;
    case 1:
      return "1";
    case 2:
      return "2";
    case 128:
      return "128";
    case 129:
      return "129";
    default:
      return "other";
  }
}
function w3(t) {
  let e = UM.getStore()?.attribution;
  if (!(e == null || e.closed))
    switch (t) {
      case "coalesced":
        e.untrackedCacheCoalescedCount += 1;
        break;
      case "hit":
        e.untrackedCacheHitCount += 1;
        break;
      case "miss":
        e.untrackedCacheMissCount += 1;
        break;
    }
}
function Xr(t, e) {
  return UM.run(t, e);
}
function di() {
  return UM.getStore() ?? JMt;
}
var SOe,
  UM,
  JMt,
  $M,
  Wx,
  Qu = g(() => {
    SOe = require("node:async_hooks");
    bOe();
    V4();
    ((UM = new SOe.AsyncLocalStorage()),
      (JMt = { requestKind: null, source: "git_direct_call" }),
      ($M = 0),
      (Wx = new Set()));
  });
function Ui(t, e, r) {
  let n = di(),
    o = new Dp(n.startPriority?.priority ?? "foreground"),
    i = Xr({ ...n, startPriority: o, metadataReadConsumers: r ?? n.metadataReadConsumers }, t),
    s = e?.() ?? i,
    a = _3.get(s);
  if (a == null) {
    ((a = o), _3.set(s, a));
    let c = () => {
      _3.delete(s);
    };
    i.then(c, c);
  }
  let l = () => a.promote();
  if (n.startPriority == null) l();
  else {
    let c = n.startPriority.onPromotion(l);
    i.then(c, c);
  }
  return i;
}
var _3,
  GM,
  Oy = g(() => {
    O();
    Qu();
    ((_3 = new WeakMap()),
      (GM = class {
        count = 0;
        ordinaryCount = null;
        canFinishInBackground = !1;
        get hasRetainingConsumers() {
          return (this.canFinishInBackground ? this.count : (this.ordinaryCount ?? this.count)) > 0;
        }
        allowBackgroundCompletion() {
          this.canFinishInBackground = !0;
        }
        add(e) {
          ((this.count += 1), e || (this.ordinaryCount = (this.ordinaryCount ?? 0) + 1));
          let r = !1;
          return () => {
            r ||
              ((r = !0),
              (this.count -= 1),
              !e && this.ordinaryCount != null && (this.ordinaryCount -= 1));
          };
        }
      }));
  });
async function Fm(t) {
  let e = A3(t),
    r = WM.get(t.id);
  if (r?.cacheKey === e && r.expiresAtMs > Date.now()) return !0;
  r != null && WM.delete(t.id);
  let n = await Ui(() => AOe(t));
  return (n && x3(t), n);
}
function x3(t) {
  WM.set(t.id, { cacheKey: A3(t), expiresAtMs: Date.now() + 3e4 });
}
function jM(t) {
  (WM.delete(t.id), AOe.delete(t));
}
function zM({ requestKind: t, source: e }) {
  return rOt.has(t ?? "") || nOt(e);
}
function nOt(t) {
  return tOt.has(t);
}
function A3(t) {
  return JSON.stringify([
    t.id,
    t.hostConfig.kind,
    t.hostConfig.codex_cli_command,
    t.hostConfig.terminal_command,
    t.hostConfig.websocket_url,
    t.hostConfig.env_id,
    t.hostConfig.host_name,
    t.hostConfig.environment_kind,
    t.hostConfig.os,
    t.hostConfig.arch,
    t.hostConfig.app_server_version,
    t.hostConfig.online,
    t.hostConfig.distro,
  ]);
}
async function oOt(t, e) {
  let [r, n, o] = await Promise.all([t.codexHome(), t.platformFamily(), t.platformPath()]);
  e.throwIfAborted();
  let i = await t.spawn({
    args: n === "windows" ? ["git", "--version"] : ["/bin/sh", "-c", eOt],
    cwd: o.parse(r).root || o.sep,
    signal: e,
    timeoutMs: xOe,
    startPriority: di().startPriority,
  });
  return (await _r(i)).code === 0;
}
var _Oe,
  xOe,
  WM,
  eOt,
  tOt,
  rOt,
  AOe,
  el,
  $m = g(() => {
    _Oe = F(Q_());
    O();
    Qu();
    Oy();
    ((xOe = 1e4),
      (WM = new Map()),
      (eOt =
        'git="$(command -v git)" || exit 127; git_dir="$(CDPATH= cd "${git%/*}" 2>/dev/null && pwd -P)" || exit 127; git="$git_dir/${git##*/}"; if test "$(uname -s)" = Darwin && test "$git" = /usr/bin/git; then /usr/bin/xcode-select -p >/dev/null 2>&1 || exit 127; fi; exec "$git" --version'),
      (tOt = new Set([
        "async_task_starting_state_dropdown",
        "commit_modal",
        "composer_branch_switcher",
        "composer_worktree_source",
        "create_pull_request_modal",
        "local_conversation_git_actions",
      ])),
      (rOt = new Set(["checkout-branch", "create-branch", "git-init-repo"])),
      (AOe = (0, _Oe.default)(
        async (t) => {
          let e = new AbortController(),
            r = pt(),
            n = setTimeout(() => {
              (e.abort(), r.resolve(!1));
            }, xOe);
          try {
            return await Promise.race([oOt(t, e.signal), r.promise]);
          } catch {
            return !1;
          } finally {
            clearTimeout(n);
          }
        },
        { maxAge: 3e4, normalizer: ([t]) => A3(t) },
      )),
      (el = class extends Error {
        constructor() {
          (super(No), (this.name = "GitUnavailableError"));
        }
      }));
  });
function Qn(t) {
  return iOt.encode(t).byteLength;
}
var iOt,
  Ny = g(() => {
    iOt = new TextEncoder();
  });
async function I(t, e, r, n = {}) {
  let {
      env: o,
      signal: i,
      waitForExitOnAbortSignal: s,
      timeoutMs: a,
      onStdoutRaw: l,
      onStderrRaw: c,
      maxOutputBytes: u,
      collectOutput: p = !0,
      collectStdoutBuffer: m = !1,
      trim: f = !0,
      stdin: h,
      allowedNonZeroExitCodes: v,
      configOverrides: y = [],
    } = n,
    w = i != null && s != null ? AbortSignal.any([i, s]) : (i ?? s),
    _ = e[0],
    S = aOt(e),
    E = Object.is(a, null) ? void 0 : (a ?? (S ? XM : void 0)),
    T = crypto.randomUUID().slice(0, 8),
    P = Date.now(),
    M = E == null ? void 0 : P + E,
    L = di(),
    V = `${r.id}\0${L.metadataCommonDir ?? t}`,
    de = !r.isLocal;
  if (e[0]?.startsWith("-") === !0) {
    let Ut = "Git command arguments must begin with a subcommand";
    return {
      command: ai(["git", ...e]),
      success: !1,
      code: null,
      commandNotStarted: !0,
      stdout: "",
      stdoutBytes: 0,
      stderr: Ut,
      stderrBytes: Qn(Ut),
    };
  }
  if (!zM(L) && !w?.aborted && !(M != null && Date.now() >= M) && !(await ZM(Fm(r), M, w, !0)))
    return {
      command: ai(["git", ...e]),
      success: !1,
      code: null,
      commandNotStarted: !0,
      stdout: "",
      stdoutBytes: 0,
      stderr: No,
      stderrBytes: Qn(No),
    };
  let ue = {
      LC_MESSAGES: "C",
      LANGUAGE: "C",
      GIT_TERMINAL_PROMPT: "0",
      GIT_OPTIONAL_LOCKS: "0",
      ...o,
    },
    ge =
      sOt(e) ||
      (L.isLateTurnGitCapture === !0 &&
        (_ === "rev-parse" ||
          _ === "symbolic-ref" ||
          _ === "for-each-ref" ||
          (_ === "config" && S) ||
          (_ === "remote" && e[1] === "get-url")))
        ? ""
        : await ZM(lOt(t, r, ue, w, M, a != null, V), M, w, ""),
    Q = [
      "git",
      ...[
        ...y,
        "-c",
        TOe,
        "-c",
        `core.hooksPath=${(await ZM(r.platformFamily(), M, w, "unix")) === "windows" ? "NUL" : "/dev/null"}`,
        "-c",
        `core.fsmonitor=${ge}`,
        ...e,
      ],
    ],
    X = ai(Q),
    G = {
      id: T,
      startTimeMs: P,
      isRemote: de,
      hostId: r.id,
      source: L.source,
      requestKind: L.requestKind,
      subcommand: _ ?? null,
      argsCount: e.length,
      allowedNonZeroExitCodes: v?.join(",") ?? null,
    },
    ce = { command: X, commandArgs: Q, cwd: t },
    Ce = 0,
    De = 0,
    Ge = !1,
    We = !1,
    yt,
    Ct = wOe(e),
    et = (Ut, Qr, ga, le, Ko, ya) => (
      Ct?.({
        aborted: We,
        durationMs: ga,
        errorKind:
          le === "nonzero_exit" || le === "spawn_failed" || le === "wait_failed"
            ? (ya ?? zu(Ko ?? ""))
            : null,
        exitCode: Qr,
        failureKind: le,
        outputLimitExceeded: yt != null,
        stderrBytes: De,
        stdoutBytes: Ce,
        success: Ut,
        timedOut: Ge,
      }),
      {
        ...G,
        success: Ut,
        exitCode: Qr,
        durationMs: ga,
        stdoutBytes: Ce,
        stderrBytes: De,
        failureReason: le,
        aborted: We,
        timedOut: Ge,
        outputLimitExceeded: yt != null,
        outputLimitStream: yt?.stream ?? null,
        outputLimitMaxBytes: yt?.limitBytes ?? null,
      }
    );
  if (w?.aborted || (M != null && Date.now() >= M)) {
    ((We = w?.aborted ?? !1), (Ge = !We));
    let Ut = We ? "git process aborted" : `git process timed out after ${E}ms`;
    return (
      yc().warning("git.command.complete", {
        safe: et(!1, null, Date.now() - P, We ? "canceled" : "timed_out"),
        sensitive: {},
      }),
      {
        command: X,
        success: !1,
        code: null,
        commandNotStarted: !0,
        stdout: "",
        stdoutBytes: Ce,
        stderr: Ut,
        stderrBytes: Qn(Ut),
      }
    );
  }
  let tt = S ? await IOe(_ === "status" ? `${V}\0status` : V, M ?? P + XM, w) : null;
  if (S && tt == null) {
    ((We = w?.aborted ?? !1), (Ge = !We));
    let Ut = We ? "git process aborted" : `git process timed out after ${E}ms`;
    return (
      yc().warning("git.command.complete", {
        safe: et(!1, null, Date.now() - P, We ? "canceled" : "timed_out"),
        sensitive: ce,
      }),
      {
        command: X,
        success: !1,
        code: null,
        commandNotStarted: !0,
        stdout: "",
        stdoutBytes: Ce,
        stderr: Ut,
        stderrBytes: Qn(Ut),
      }
    );
  }
  !S && L.isLateTurnGitCapture && L.metadataReadConsumers?.allowBackgroundCompletion();
  let Sr = 0;
  yc().debug("git.command.start", { safe: G, sensitive: ce });
  let oe,
    _t = "",
    Hr = "",
    Dn = null,
    ln = p === "excerpt" ? new Fy() : new Array(),
    Ml = p === "excerpt" ? new Fy() : new Array(),
    Ol = new TextDecoder(),
    gE = new TextDecoder(),
    jf = p === "binary-stdout" || (m && p === !0) ? new Array() : void 0,
    nF = (Ut, Qr) => {
      ((Sr += Qr.length),
        Ut === "stdout" ? (Ce += Qr.length) : (De += Qr.length),
        u != null && Sr > u && yt == null && ((yt = { stream: Ut, limitBytes: u }), oe.kill()),
        Ut === "stdout" ? l?.(Qr) : c?.(Qr));
    };
  try {
    let Ut = await POe(
      r,
      {
        args: Q,
        allowedNonZeroExitCodes: v,
        cwd: t,
        env: ue,
        stdinBytes:
          typeof h == "string" ? new TextEncoder().encode(h).byteLength : (h?.byteLength ?? 0),
        killProcessTree: !0,
      },
      tt,
      M,
      w,
    );
    if (Ut == null) {
      ((We = w?.aborted ?? !1), (Ge = !We), tt?.close());
      let Qr = We ? "git process aborted" : `git process timed out after ${E}ms`;
      return (
        yc().warning("git.command.complete", {
          safe: et(!1, null, Date.now() - P, We ? "canceled" : "timed_out"),
          sensitive: ce,
        }),
        {
          command: X,
          success: !1,
          code: null,
          stdout: "",
          stdoutBytes: Ce,
          stderr: Qr,
          stderrBytes: Qn(Qr),
        }
      );
    }
    oe = Ut;
  } catch (Ut) {
    tt?.close();
    let Qr = Ut instanceof Error ? Ut.message : "Failed to start git process",
      ga = Date.now() - P;
    return (
      yc().warning("git.command.complete", {
        safe: et(!1, null, ga, "spawn_failed", Qr),
        sensitive: ce,
      }),
      {
        command: X,
        success: !1,
        code: null,
        stdout: "",
        stdoutBytes: Ce,
        stderr: Qr,
        stderrBytes: De,
      }
    );
  }
  let Zd = () => {},
    zf = new Promise((Ut) => {
      Zd = () => Ut(null);
    }),
    Rb = () => {
      ((We = !0), oe.kill(), (i?.aborted || !s?.aborted) && Zd());
    };
  (w && (w.addEventListener("abort", Rb), w.aborted && Rb()),
    i != null && s != null && i.addEventListener("abort", Zd));
  let Xd =
    E != null
      ? setTimeout(
          () => {
            ((Ge = !0), oe.kill(), Zd());
          },
          Math.max(0, (M ?? Date.now() + E) - Date.now()),
        )
      : null;
  try {
    let Ut = oe.wait(),
      Qr = Promise.all([
        Ut,
        COe(oe.stdout, "stdout", ln, Ol, jf, p === !0, nF),
        COe(oe.stderr, "stderr", Ml, gE, void 0, p !== !1, nF),
        (async () => {
          if (h == null) return;
          let Vi;
          if (typeof h == "string") Vi = new TextEncoder().encode(h);
          else if ("bytes" in h)
            try {
              let As = await Promise.race([h.bytes, Ut.then(() => null), zf]);
              if (As == null) return;
              if (As.byteLength !== h.byteLength)
                throw new Error("Git stdin did not match its declared byte count");
              Vi = As;
            } catch (As) {
              throw (oe.kill(), await Promise.race([Ut, zf]).catch(() => {}), As);
            }
          else Vi = h;
          let qc = oe.stdin.getWriter();
          (await qc.write(Vi), await qc.close());
        })(),
      ]);
    tt?.track(Qr);
    let ga = await Promise.race([Qr, zf]),
      le = KM(ln, Ol),
      Ko = KM(Ml, gE),
      ya = jf == null ? void 0 : C3(jf);
    if (
      ((_t = f ? le.trim() : le),
      (Hr = f ? Ko.trim() : Ko),
      (Dn = ga?.[0].code ?? null),
      Xd && clearTimeout(Xd),
      w && w.removeEventListener("abort", Rb),
      i?.removeEventListener("abort", Zd),
      We)
    ) {
      let Vi = Date.now() - P;
      return (
        yc().warning("git.command.complete", { safe: et(!1, Dn, Vi, "canceled"), sensitive: ce }),
        {
          command: X,
          success: !1,
          code: Dn,
          stdout: _t,
          stdoutBytes: Ce,
          stderr: E3(Hr, "git process aborted"),
          stderrBytes: De,
          outputLimitExceeded: yt,
          ...(ya == null ? {} : { stdoutBuffer: ya }),
        }
      );
    }
    let Vf = !Ge && yt == null && Dn != null && (Dn === 0 || (Array.isArray(v) && v.includes(Dn)));
    if (Vf) {
      x3(r);
      let Vi = Date.now() - P;
      yc().debug("git.command.complete", { safe: et(!0, Dn, Vi, null), sensitive: ce });
    } else {
      let Vi = yt != null ? "output_limit" : Ge ? "timed_out" : "nonzero_exit",
        qc = Date.now() - P;
      yc().warning("git.command.complete", {
        safe: et(!1, Dn, qc, Vi, Hr, ga?.[0].gitErrorKind),
        sensitive: ce,
      });
    }
    return {
      command: X,
      success: Vf,
      code: Dn,
      stdout: _t,
      stdoutBytes: Ce,
      stderr: Ge ? E3(Hr, `git process timed out after ${E}ms`) : Hr,
      stderrBytes: De,
      outputLimitExceeded: yt,
      ...(ya == null ? {} : { stdoutBuffer: ya }),
    };
  } catch (Ut) {
    (Xd && clearTimeout(Xd),
      w && w.removeEventListener("abort", Rb),
      i?.removeEventListener("abort", Zd));
    let Qr = Ut instanceof Error ? Ut.message : String(Ut),
      ga = Date.now() - P,
      le = "wait_failed",
      Ko = null;
    Ge
      ? ((le = "timed_out"), (Ko = `git process timed out after ${E}ms`))
      : We && ((le = "canceled"), (Ko = "git process aborted"));
    let ya = jf == null ? void 0 : C3(jf),
      Vf = KM(ln, Ol) || _t,
      qc = KM(Ml, gE) || (Qr ? `${Hr}${Qr}` : Hr),
      As = Ko == null ? qc : E3(qc, Ko);
    return (
      yc().warning("git.command.complete", { safe: et(!1, Dn, ga, le, As), sensitive: ce }),
      {
        command: X,
        success: !1,
        code: Dn,
        stdout: Vf,
        stdoutBytes: p === "binary-stdout" || (p === "excerpt" && Ce > 0) ? Ce : Qn(Vf),
        stderr: As,
        stderrBytes: p === "excerpt" && De > 0 ? De : Qn(As),
        outputLimitExceeded: yt,
        ...(ya == null ? {} : { stdoutBuffer: ya }),
      }
    );
  } finally {
    tt?.close();
  }
}
function sOt(t) {
  if (t[0] !== "rev-parse") return !1;
  switch (t[1]) {
    case "--show-toplevel":
    case "--git-common-dir":
      return t.length === 2;
    case "--git-path":
      return t.length === 3;
    case "--path-format=absolute":
      return t.length === 4 && t[2] === "--show-toplevel" && t[3] === "--git-common-dir";
    default:
      return !1;
  }
}
function aOt(t) {
  switch (t[0]) {
    case "check-ignore":
    case "for-each-ref":
    case "merge-base":
    case "rev-list":
    case "rev-parse":
    case "show-ref":
    case "status":
      return !0;
    case "cat-file":
      return t.includes("-e");
    case "ls-files":
      return t.includes("--others") && !t.includes("--cached") && !t.includes("--ignored");
    case "config":
      return t.some(
        (e) => e === "--get" || e === "--get-all" || e === "--get-regexp" || e === "--list",
      );
    case "remote":
      return t[1] === "get-url";
    case "worktree":
      return t[1] === "list";
    default:
      return !1;
  }
}
async function lOt(t, e, r, n, o, i = !1, s) {
  if (!(await dOt(e)) || n?.aborted || (o != null && Date.now() >= o)) return "";
  if (i) return EOe(t, e, r, n, o, s);
  let a = uOt(t, e, r),
    l = By.get(a);
  if (l != null) {
    if (l.expiresAtMs > performance.now()) return l.value;
    (clearTimeout(l.expiryTimer), By.delete(a));
  }
  let c = Ly.get(a);
  if (c == null) {
    let p = new AbortController(),
      m = Date.now() + XM,
      f = Ui(() => EOe(t, e, r, p.signal, m, s));
    ((c = { abortController: p, consumers: 0, promise: f }),
      Ly.set(a, c),
      f.then((h) => {
        Ly.get(a)?.promise === f &&
          (Ly.delete(a), !p.signal.aborted && Date.now() < m && cOt(a, h));
      }));
  }
  c.consumers += 1;
  let u = c.promise;
  try {
    return await ZM(
      Ui(() => u),
      o,
      n,
      "",
    );
  } finally {
    ((c.consumers -= 1),
      c.consumers === 0 && Ly.get(a) === c && (Ly.delete(a), c.abortController.abort()));
  }
}
function cOt(t, e) {
  let r = performance.now() + ROe,
    n = By.get(t);
  n != null && clearTimeout(n.expiryTimer);
  let o = {
    expiresAtMs: r,
    expiryTimer: setTimeout(() => {
      By.get(t) === o && By.delete(t);
    }, ROe),
    value: e,
  };
  (o.expiryTimer.unref?.(), By.set(t, o));
}
function uOt(t, e, r) {
  return JSON.stringify([
    e.id,
    t,
    Object.entries(r)
      .filter(([n]) => n !== "GIT_INDEX_FILE")
      .sort(([n], [o]) => n.localeCompare(o)),
  ]);
}
async function EOe(t, e, r, n, o, i) {
  try {
    let { code: s, stdout: a } = await R3(
      t,
      ["config", "--null", "--get", "core.fsmonitor"],
      e,
      r,
      n,
      o,
      i,
    );
    if (s !== 0 || !a.endsWith("\0")) return "";
    let l = a.slice(0, -1);
    if (l.includes("\0")) return "";
    let c = l.toLowerCase(),
      u;
    if (["true", "yes", "on"].includes(c)) u = !0;
    else if (["false", "no", "off"].includes(c)) u = !1;
    else {
      let { code: f, stdout: h } = await R3(
        t,
        ["config", "--null", "--type=bool", "--fixed-value", "--get", "core.fsmonitor", l],
        e,
        r,
        n,
        o,
        i,
      );
      u = f === 0 && h === "true\0";
    }
    if (!u) return "";
    let { code: p, stdout: m } = await R3(t, ["version", "--build-options"], e, r, n, o, i);
    return p === 0 &&
      m
        .split(
          `
`,
        )
        .some((f) => f.trim() === "feature: fsmonitor--daemon")
      ? "true"
      : "";
  } catch {
    return "";
  }
}
async function dOt(t) {
  if (!t.isLocal) return (await t.platformOs()) === "linux";
  let [e, r] = await Promise.all([t.platformFamily(), t.platformOs()]);
  return e === "windows" || r === "macos";
}
async function R3(t, e, r, n, o, i, s) {
  let a = i ?? Date.now() + XM,
    l = await IOe(s ?? `${r.id}\0${t}`, a, o);
  if (l == null) return { code: null, signal: null, stderr: "", stdout: "" };
  let c;
  try {
    c = await POe(
      r,
      {
        args: ["git", "-c", TOe, ...e],
        allowedNonZeroExitCodes: e[0] === "config" ? [1] : void 0,
        cwd: t,
        env: n,
        killProcessTree: !0,
      },
      l,
      a,
      o,
    );
  } catch (h) {
    throw (l.close(), h);
  }
  if (c == null) return (l.close(), { code: null, signal: null, stderr: "", stdout: "" });
  let u = () => {},
    p = new Promise((h) => {
      u = () => h({ code: null, signal: null, stderr: "", stdout: "" });
    }),
    f = setTimeout(
      () => {
        (c.kill(), u());
      },
      Math.max(0, a - Date.now()),
    );
  o?.addEventListener("abort", u, { once: !0 });
  try {
    o?.aborted && u();
    let h = _r(c);
    return (l.track(h), await Promise.race([h, p]));
  } finally {
    (clearTimeout(f), o?.removeEventListener("abort", u), l.close());
  }
}
async function POe(t, e, r, n, o) {
  let i = !1,
    s = pt(),
    a = () => {
      ((i = !0), s.resolve(null));
    },
    l = n == null ? null : setTimeout(a, Math.max(0, n - Date.now()));
  (o?.addEventListener("abort", a, { once: !0 }), o?.aborted && a());
  let c = t.spawn({
      ...e,
      startPriority: di().startPriority,
      signal: o,
      timeoutMs: n == null ? void 0 : Math.max(0, n - Date.now()),
    }),
    u = c.then(async (p) => {
      i && (p.kill(), await p.wait());
    });
  r != null ? r.track(u) : u.catch(() => {});
  try {
    return await Promise.race([c, s.promise]);
  } catch (p) {
    throw ((i = !0), p);
  } finally {
    (l != null && clearTimeout(l), o?.removeEventListener("abort", a));
  }
}
async function ZM(t, e, r, n) {
  if (r?.aborted || (e != null && Date.now() >= e)) return n;
  if (e == null && r == null) return t;
  let o = pt(),
    i = () => o.resolve(n),
    s = e == null ? null : setTimeout(i, Math.max(0, e - Date.now()));
  (r?.addEventListener("abort", i, { once: !0 }), r?.aborted && i());
  try {
    return await Promise.race([t, o.promise]);
  } finally {
    (s != null && clearTimeout(s), r?.removeEventListener("abort", i));
  }
}
async function IOe(t, e, r) {
  let n = di(),
    o = n.isLateTurnGitCapture ? n.startPriority : void 0;
  for (;;) {
    if (r?.aborted || Date.now() >= e) return null;
    let i = o?.priority === "background",
      s = i ? `${t}\0turn-analytics` : t,
      a = VM.get(s);
    if (a == null) {
      let m = pt();
      (VM.set(s, m), i && n.metadataReadConsumers?.allowBackgroundCompletion());
      let f = 0,
        h = !1,
        v = () => {
          !h || f > 0 || (VM.get(s) === m && VM.delete(s), m.resolve(void 0));
        };
      return {
        close() {
          ((h = !0), v());
        },
        track(y) {
          f += 1;
          let w = () => {
            ((f -= 1), v());
          };
          y.then(w, w);
        },
      };
    }
    let l = null,
      c = () => {},
      u = () => {},
      p = await Promise.race([
        a.promise.then(() => !0),
        new Promise((m) => {
          if (
            ((l = setTimeout(() => m(!1), e - Date.now())),
            i && (u = o.onPromotion(() => m(!0))),
            r != null)
          ) {
            let f = () => m(!1);
            (r.addEventListener("abort", f, { once: !0 }),
              (c = () => r.removeEventListener("abort", f)));
          }
        }),
      ]);
    if ((l != null && clearTimeout(l), c(), u(), !p)) return null;
  }
}
function E3(t, e) {
  return t
    ? `${t}
${e}`
    : e;
}
async function COe(t, e, r, n, o, i, s) {
  let a = t.getReader();
  try {
    for (;;) {
      let { done: l, value: c } = await a.read();
      if (l) return;
      if (r instanceof Fy) r.append(c);
      else if (i) {
        let u = n.decode(c, { stream: !0 });
        u.length > 0 && r.push(u);
      }
      (o?.push(c.slice()), s(e, c));
    }
  } finally {
    a.releaseLock();
  }
}
function KM(t, e) {
  if (t instanceof Fy) return t.drain(e);
  let r = e.decode();
  r.length > 0 && t.push(r);
  let n = t.join("");
  return ((t.length = 0), n);
}
function C3(t) {
  let e = new Uint8Array(t.reduce((n, o) => n + o.byteLength, 0)),
    r = 0;
  for (let n of t) (e.set(n, r), (r += n.byteLength));
  return e;
}
var yc,
  ROe,
  XM,
  TOe,
  VM,
  By,
  Ly,
  Fy,
  fe = g(() => {
    O();
    hr();
    bm();
    Ny();
    $m();
    cx();
    Qu();
    Oy();
    ((yc = Ie("git")),
      (ROe = 1e3),
      (XM = 6e4),
      (TOe = "safe.bareRepository=explicit"),
      (VM = new Map()),
      (By = new Map()),
      (Ly = new Map()));
    Fy = class {
      buffer = new Uint8Array(16 * 1024);
      prefix = new Uint8Array(4 * 1024);
      offset = 0;
      bytes = 0;
      append(e) {
        this.bytes < this.prefix.length &&
          this.prefix.set(e.subarray(0, this.prefix.length - this.bytes), this.bytes);
        let r = e.subarray(-this.buffer.length),
          n = r.subarray(0, this.buffer.length - this.offset);
        (this.buffer.set(n, this.offset),
          this.buffer.set(r.subarray(n.length), 0),
          (this.offset = (this.offset + r.length) % this.buffer.length),
          (this.bytes += e.length));
      }
      drain(e) {
        let r = this.bytes > this.buffer.length,
          n = r
            ? C3([this.buffer.subarray(this.offset), this.buffer.subarray(0, this.offset)])
            : this.buffer.subarray(0, this.bytes);
        if (((this.offset = 0), (this.bytes = 0), !r)) return e.decode(n);
        let o = new TextDecoder().decode(this.prefix, { stream: !0 }),
          i = n.subarray(this.prefix.length),
          s = i.findIndex((a) => a < 128 || a >= 192);
        return (
          o +
          `
[Git output omitted]
` +
          e.decode(s < 0 ? new Uint8Array() : i.subarray(s))
        );
      }
    };
  });
async function T3(t, e, r) {
  if (e.isLocal)
    try {
      await e.stat(t, { bypassCache: !0 });
    } catch (c) {
      if (bt(c)) return null;
      throw c;
    }
  let {
      success: n,
      stdout: o,
      stderr: i,
      code: s,
    } = await I(t, ["rev-parse", "--show-toplevel"], e, {
      allowedNonZeroExitCodes: [128],
      trim: !1,
      signal: r,
    }),
    a =
      n &&
      o.endsWith(`\r
`) &&
      (await e.platformPath()).sep === "\\"
        ? `\r
`
        : `
`,
    l = o.endsWith(a) ? o.slice(0, -a.length) : o;
  if (n && l) return l;
  if (s === 128 && Hx(i)) return null;
  throw i === No
    ? new el()
    : (pOt().debug("[getGitRoot] failed to resolve git root", {
        safe: {},
        sensitive: { stderr: i, stdout: o },
      }),
      new Error(`Failed to resolve git root: ${i || o || "Unknown error"}`));
}
function Hx(t) {
  let e = t.toLowerCase();
  return (
    e.includes("not a git repository") ||
    e.includes("cannot use bare repository") ||
    e.includes("invalid gitfile format") ||
    e.includes("no path in gitfile") ||
    e.includes("invalid gitdir")
  );
}
var pOt,
  YM = g(() => {
    O();
    hr();
    $m();
    fe();
    pOt = Ie("git");
  });
async function jx(t, e, r) {
  let n;
  try {
    n = await new Response(await e.readFile(t)).text();
  } catch (o) {
    return I3(t, `Failed to parse environment config at ${t}: ${String(o)}`);
  }
  return k3(n, t, e, r);
}
async function k3(t, e, r, n) {
  let o;
  try {
    o = mOt(Vg(t));
  } catch (s) {
    return I3(e, `Failed to parse environment config at ${e}: ${String(s)}`);
  }
  let i = nme.safeParse(o);
  return i.success
    ? {
        configPath: e,
        cwdRelativeToGitRoot: await (n?.() ?? gOt(e, r)),
        type: "success",
        environment: hOt(i.data),
      }
    : I3(e, `Invalid environment config at ${e}: ${i.error.message}`);
}
function I3(t, e) {
  return { configPath: t, cwdRelativeToGitRoot: t, type: "error", error: { message: e } };
}
function mOt(t) {
  return !DOe(t) || !Array.isArray(t.actions)
    ? t
    : { ...t, actions: t.actions.filter((e) => fOt(e)) };
}
function fOt(t) {
  return !DOe(t) || typeof t.name != "string" || typeof t.command != "string"
    ? !1
    : t.name.trim().length > 0 && t.command.trim().length > 0;
}
function DOe(t) {
  return typeof t == "object" && t != null && !Array.isArray(t);
}
function hOt(t) {
  return {
    ...t,
    name: t.name.trim(),
    setup: kOe(t.setup),
    cleanup: t.cleanup ? kOe(t.cleanup) : void 0,
    actions: t.actions ? t.actions.map((e) => ({ ...e, name: e.name.trim() })) : void 0,
  };
}
function kOe(t) {
  return {
    ...t,
    script: t.script.trim(),
    darwin: t.darwin ? { script: t.darwin.script.trim() } : void 0,
    linux: t.linux ? { script: t.linux.script.trim() } : void 0,
    win32: t.win32 ? { script: t.win32.script.trim() } : void 0,
  };
}
async function gOt(t, e) {
  let r = await e.platformPath(),
    n = await yOt(t, e),
    o = n;
  for (; o !== r.dirname(o) && !(await JM(o, e)); ) o = r.dirname(o);
  let i = r.relative(o, n);
  return i === "" ? "." : i;
}
async function JM(t, e) {
  let r = await e.platformPath(),
    n = await e.stat(r.join(t, ".git")).catch(() => null);
  if (n == null || (!n.isDirectory() && !n.isFile())) return !1;
  try {
    let { code: o, stderr: i } = await I(t, ["rev-parse", "--resolve-git-dir", ".git"], e, {
      allowedNonZeroExitCodes: [128],
    });
    return (
      o !== 128 || !(Hx(i) || /not a gitdir|gitfile does not point to a valid repository/.test(i))
    );
  } catch {
    return !0;
  }
}
async function yOt(t, e) {
  let r = await e.platformPath(),
    n = r.dirname(t),
    o = r.dirname(n);
  if (r.basename(n) === "environments" && r.basename(o) === ".codex") {
    let [s, a, l, c] = await Promise.all([P3(n, e), JM(n, e), P3(o, e), JM(o, e)]);
    return s || a ? n : l || c ? o : r.dirname(o);
  }
  let i = r.dirname(t);
  for (; i !== r.dirname(i); ) {
    if (await P3(i, e)) return i;
    if (await JM(i, e)) return i;
    i = r.dirname(i);
  }
  return t;
}
async function P3(t, e) {
  let r = await e.platformPath();
  try {
    let n = await e.stat(r.join(t, ".codex"));
    return n.isDirectory() || n.isFile();
  } catch {
    return !1;
  }
}
var QM = g(() => {
  O();
  D0();
  YM();
  fe();
});
function Uy(t) {
  return vOt.test(t);
}
function D3(t) {
  return SOt.test(t);
}
function MOe(t) {
  return bOt.test(t);
}
var $y,
  vOt,
  bOt,
  SOt,
  zx = g(() => {
    (($y = ".codex-worktree-name"),
      (vOt = /^[0-9a-f]{4}$/i),
      (bOt = /^\d{6}-\d{4}-[0-9a-f]{8}$/i),
      (SOt = /^[\w.-]+_[\w.-]+$/));
  });
function Vx(t) {
  let e = On(pu(t));
  return Ls(e)
    ? ho(e)
    : Su(e)
      ? e.toLowerCase()
      : /^[a-zA-Z]:\//.test(e)
        ? ho(e).toLowerCase()
        : e.startsWith("//")
          ? e.toLowerCase()
          : e;
}
var eO = g(() => {
  O();
});
async function wOt(t, e, r = !0) {
  let n = e?.trim(),
    [o, i] = await Promise.all([n || (r ? t.workspacesRoot() : t.codexHome()), t.platformPath()]),
    s = n ? o : i.join(o, "worktrees");
  return t.isLocal && process.platform === "win32" && i.sep === "/" ? ho(s) : s;
}
async function OOe(t, e, r = !0) {
  let [n, o, i] = await Promise.all([wOt(t, e, r), t.platformOs(), t.platformPath()]);
  return (
    await t.createDirectory(n, { recursive: !0 }),
    o === "macos" && (await t.writeFile(i.join(n, ".metadata_never_index"), "")),
    n
  );
}
async function Kx(t, e, r = !1) {
  let [n, o, i] = await Promise.all([
      t.workspacesRoot().catch((l) => vc(l, null, r)),
      t.codexHome().catch((l) => vc(l, null, r)),
      t.platformPath(),
    ]),
    s = [
      { path: e?.trim(), boundary: e?.trim(), legacy: !1 },
      { path: n == null ? null : i.join(n, "worktrees"), boundary: n, legacy: !1 },
      { path: o == null ? null : i.join(o, "worktrees"), boundary: o, legacy: !0 },
    ],
    a = new Map();
  for (let l of s) {
    if (!l.path || !l.boundary) continue;
    let c = t.isLocal && i.sep === "/" ? ho(l.path) : l.path,
      u = Vx(c),
      p = a.get(u);
    a.set(u, {
      path: c,
      boundary: t.isLocal && i.sep === "/" ? ho(l.boundary) : l.boundary,
      legacy: l.legacy || p?.legacy === !0,
    });
  }
  return [...a.values()];
}
async function M3(t, e, r = !1) {
  if (
    (
      await Promise.all(
        [...new Set([e.path, e.boundary])].map((o) =>
          t.stat(o, { bypassCache: !0, followSymlinks: !1 }).catch((i) => vc(i, o, r)),
        ),
      )
    ).some((o) => !o?.isDirectory() || o.isSymbolicLink())
  )
    return [];
  try {
    return await t.readDirectory(e.path);
  } catch (o) {
    return (vc(o, e.path, r), []);
  }
}
function vc(t, e, r) {
  if (r && (e == null || !bt(t, e))) throw t;
  return null;
}
var qy = g(() => {
  O();
  eO();
});
async function tl(t, e, r) {
  if ((r?.throwIfAborted(), (await t.platformFamily()) === "windows")) {
    let a = await t.spawn({
        args: ["cmd.exe", "/d", "/s", "/c", "echo %TEMP%"],
        cwd: "C:\\",
        signal: r,
        timeoutMs: 1e4,
      }),
      { code: l, stdout: c, stderr: u } = await _r(a),
      p = c.trim();
    if (l !== 0 || p.length === 0 || p === "%TEMP%")
      throw new Error(`failed to find Windows temporary directory: ${u || c}`.trim());
    let f = (await t.platformPath()).join(p, `${e}${crypto.randomUUID()}`);
    return (r?.throwIfAborted(), await t.createDirectory(f, { recursive: !0 }), f);
  }
  let n = await t.spawn({
      args: ["sh", "-c", 'mktemp -d "${TMPDIR:-/tmp}/$1XXXXXX"', "sh", e],
      cwd: "/",
      signal: r,
      timeoutMs: 1e4,
    }),
    { code: o, stdout: i, stderr: s } = await _r(n);
  if (o !== 0 || i.trim().length === 0)
    throw new Error(`failed to create temporary directory: ${s || i}`.trim());
  return i.trim();
}
var Gy = g(() => {
  O();
});
async function Wy(t, { indexPath: e, sharedIndexPath: r }, n) {
  let o = await n.platformPath(),
    i = o.join(t, "index"),
    s = r == null ? null : o.join(t, o.basename(r));
  return (await NOe(e, i, n), r != null && s != null && (await NOe(r, s, n)), i);
}
async function NOe(t, e, r) {
  if ((await r.platformFamily()) === "unix") {
    try {
      await r.stat(t, { bypassCache: !0 });
    } catch (i) {
      if (bt(i)) return;
      throw i;
    }
    let n = await r.spawn({ args: ["/bin/cp", "-p", t, e], cwd: "/" }),
      o = await _r(n);
    if (o.code !== 0) throw new Error(o.stderr || "Failed to copy Git index timestamps");
    return;
  }
  try {
    await r.copyFile(t, e);
  } catch (n) {
    if (!bt(n)) throw n;
  }
}
var tO = g(() => {
  O();
});
var ed,
  Zx = g(() => {
    ed = class {
      constructor() {
        ((this.listeners = new Set()), (this.subscribe = this.subscribe.bind(this)));
      }
      subscribe(t) {
        return (
          this.listeners.add(t),
          this.onSubscribe(),
          () => {
            (this.listeners.delete(t), this.onUnsubscribe());
          }
        );
      }
      hasListeners() {
        return this.listeners.size > 0;
      }
      onSubscribe() {}
      onUnsubscribe() {}
    };
  });
var _Ot,
  rO,
  O3 = g(() => {
    Zx();
    ((_Ot = class extends ed {
      #e;
      #t;
      #r;
      constructor() {
        (super(),
          (this.#r = (t) => {
            if (typeof window < "u" && window.addEventListener) {
              let e = () => t();
              return (
                window.addEventListener("visibilitychange", e, !1),
                () => {
                  window.removeEventListener("visibilitychange", e);
                }
              );
            }
          }));
      }
      onSubscribe() {
        this.#t || this.setEventListener(this.#r);
      }
      onUnsubscribe() {
        this.hasListeners() || (this.#t?.(), (this.#t = void 0));
      }
      setEventListener(t) {
        ((this.#r = t),
          this.#t?.(),
          (this.#t = t((e) => {
            typeof e == "boolean" ? this.setFocused(e) : this.onFocus();
          })));
      }
      setFocused(t) {
        this.#e !== t && ((this.#e = t), this.onFocus());
      }
      onFocus() {
        let t = this.isFocused();
        this.listeners.forEach((e) => {
          e(t);
        });
      }
      isFocused() {
        return typeof this.#e == "boolean"
          ? this.#e
          : globalThis.document?.visibilityState !== "hidden";
      }
    }),
      (rO = new _Ot()));
  });
function LOe(t) {
  setTimeout(t, 0);
}
var xOt,
  AOt,
  Xx,
  nO = g(() => {
    ((xOt = {
      setTimeout: (t, e) => setTimeout(t, e),
      clearTimeout: (t) => clearTimeout(t),
      setInterval: (t, e) => setInterval(t, e),
      clearInterval: (t) => clearInterval(t),
    }),
      (AOt = class {
        #e = xOt;
        #t = !1;
        setTimeoutProvider(t) {
          (process.env.NODE_ENV !== "production" &&
            this.#t &&
            t !== this.#e &&
            console.error(
              "[timeoutManager]: Switching provider after calls to previous provider might result in unexpected behavior.",
              { previous: this.#e, provider: t },
            ),
            (this.#e = t),
            process.env.NODE_ENV !== "production" && (this.#t = !1));
        }
        setTimeout(t, e) {
          return (
            process.env.NODE_ENV !== "production" && (this.#t = !0),
            this.#e.setTimeout(t, e)
          );
        }
        clearTimeout(t) {
          this.#e.clearTimeout(t);
        }
        setInterval(t, e) {
          return (
            process.env.NODE_ENV !== "production" && (this.#t = !0),
            this.#e.setInterval(t, e)
          );
        }
        clearInterval(t) {
          this.#e.clearInterval(t);
        }
      }),
      (Xx = new AOt()));
  });
function $o() {}
function $Oe(t, e) {
  return typeof t == "function" ? t(e) : t;
}
function UOe(t) {
  return typeof t == "number" && t >= 0 && t !== 1 / 0;
}
function qOe(t, e) {
  return Math.max(t + (e || 0) - Date.now(), 0);
}
function Yx(t, e) {
  return typeof t == "function" ? t(e) : t;
}
function GOe(t, e) {
  return typeof t == "function" ? t(e) : t;
}
function iO(t, e) {
  let { type: r = "all", exact: n, fetchStatus: o, predicate: i, queryKey: s, stale: a } = t;
  if (s) {
    if (n) {
      if (e.queryHash !== Jx(s, e.options)) return !1;
    } else if (!qm(e.queryKey, s)) return !1;
  }
  if (r !== "all") {
    let l = e.isActive();
    if ((r === "active" && !l) || (r === "inactive" && l)) return !1;
  }
  return !(
    (typeof a == "boolean" && e.isStale() !== a) ||
    (o && o !== e.state.fetchStatus) ||
    (i && !i(e))
  );
}
function sO(t, e) {
  let { exact: r, status: n, predicate: o, mutationKey: i } = t;
  if (i) {
    if (!e.options.mutationKey) return !1;
    if (r) {
      if (bc(e.options.mutationKey) !== bc(i)) return !1;
    } else if (!qm(e.options.mutationKey, i)) return !1;
  }
  return !((n && e.state.status !== n) || (o && !o(e)));
}
function Jx(t, e) {
  return (e?.queryKeyHashFn || bc)(t);
}
function bc(t) {
  return JSON.stringify(t, (e, r) =>
    N3(r)
      ? Object.keys(r)
          .sort()
          .reduce((n, o) => ((n[o] = r[o]), n), {})
      : r,
  );
}
function qm(t, e) {
  return t === e
    ? !0
    : typeof t != typeof e
      ? !1
      : t && e && typeof t == "object" && typeof e == "object"
        ? Object.keys(e).every((r) => qm(t[r], e[r]))
        : !1;
}
function oO(t, e, r = 0) {
  if (t === e) return t;
  if (r > 500) return e;
  let n = BOe(t) && BOe(e);
  if (!n && !(N3(t) && N3(e))) return e;
  let i = (n ? t : Object.keys(t)).length,
    s = n ? e : Object.keys(e),
    a = s.length,
    l = n ? new Array(a) : {},
    c = 0;
  for (let u = 0; u < a; u++) {
    let p = n ? u : s[u],
      m = t[p],
      f = e[p];
    if (m === f) {
      ((l[p] = m), (n ? u < i : ROt.call(t, p)) && c++);
      continue;
    }
    if (m === null || f === null || typeof m != "object" || typeof f != "object") {
      l[p] = f;
      continue;
    }
    let h = oO(m, f, r + 1);
    ((l[p] = h), h === m && c++);
  }
  return i === a && c === i ? t : l;
}
function BOe(t) {
  return Array.isArray(t) && t.length === Object.keys(t).length;
}
function N3(t) {
  if (!FOe(t)) return !1;
  let e = t.constructor;
  if (e === void 0) return !0;
  let r = e.prototype;
  return !(
    !FOe(r) ||
    !r.hasOwnProperty("isPrototypeOf") ||
    Object.getPrototypeOf(t) !== Object.prototype
  );
}
function FOe(t) {
  return Object.prototype.toString.call(t) === "[object Object]";
}
function WOe(t) {
  return new Promise((e) => {
    Xx.setTimeout(e, t);
  });
}
function HOe(t, e, r) {
  if (typeof r.structuralSharing == "function") return r.structuralSharing(t, e);
  if (r.structuralSharing !== !1) {
    if (process.env.NODE_ENV !== "production")
      try {
        return oO(t, e);
      } catch (n) {
        throw (
          console.error(
            `Structural sharing requires data to be JSON serializable. To fix this, turn off structuralSharing or return JSON-serializable data from your queryFn. [${r.queryHash}]: ${n}`,
          ),
          n
        );
      }
    return oO(t, e);
  }
  return e;
}
function jOe(t, e, r = 0) {
  let n = [...t, e];
  return r && n.length > r ? n.slice(1) : n;
}
function zOe(t, e, r = 0) {
  let n = [e, ...t];
  return r && n.length > r ? n.slice(0, -1) : n;
}
function aO(t, e) {
  return (
    process.env.NODE_ENV !== "production" &&
      t.queryFn === Um &&
      console.error(
        `Attempted to invoke queryFn when set to skipToken. This is likely a configuration error. Query hash: '${t.queryHash}'`,
      ),
    !t.queryFn && e?.initialPromise
      ? () => e.initialPromise
      : !t.queryFn || t.queryFn === Um
        ? () => Promise.reject(new Error(`Missing queryFn: '${t.queryHash}'`))
        : t.queryFn
  );
}
function VOe(t, e, r) {
  let n = !1,
    o;
  return (
    Object.defineProperty(t, "signal", {
      enumerable: !0,
      get: () => (
        (o ??= e()),
        n || ((n = !0), o.aborted ? r() : o.addEventListener("abort", r, { once: !0 })),
        o
      ),
    }),
    t
  );
}
var L3,
  ROt,
  Um,
  rl = g(() => {
    nO();
    L3 = typeof window > "u" || "Deno" in globalThis;
    ROt = Object.prototype.hasOwnProperty;
    Um = Symbol();
  });
var lO,
  B3 = g(() => {
    rl();
    lO = (() => {
      let t = () => L3;
      return {
        isServer() {
          return t();
        },
        setIsServer(e) {
          t = e;
        },
      };
    })();
  });
function KOe() {
  let t,
    e,
    r = new Promise((o, i) => {
      ((t = o), (e = i));
    });
  ((r.status = "pending"), r.catch(() => {}));
  function n(o) {
    (Object.assign(r, o), delete r.resolve, delete r.reject);
  }
  return (
    (r.resolve = (o) => {
      (n({ status: "fulfilled", value: o }), t(o));
    }),
    (r.reject = (o) => {
      (n({ status: "rejected", reason: o }), e(o));
    }),
    r
  );
}
var ZOe = g(() => {});
function COt() {
  let t = [],
    e = 0,
    r = (a) => {
      a();
    },
    n = (a) => {
      a();
    },
    o = EOt,
    i = (a) => {
      e
        ? t.push(a)
        : o(() => {
            r(a);
          });
    },
    s = () => {
      let a = t;
      ((t = []),
        a.length &&
          o(() => {
            n(() => {
              a.forEach((l) => {
                r(l);
              });
            });
          }));
    };
  return {
    batch: (a) => {
      let l;
      e++;
      try {
        l = a();
      } finally {
        (e--, e || s());
      }
      return l;
    },
    batchCalls:
      (a) =>
      (...l) => {
        i(() => {
          a(...l);
        });
      },
    schedule: i,
    setNotifyFunction: (a) => {
      r = a;
    },
    setBatchNotifyFunction: (a) => {
      n = a;
    },
    setScheduler: (a) => {
      o = a;
    },
  };
}
var EOt,
  mn,
  Hy = g(() => {
    nO();
    EOt = LOe;
    mn = COt();
  });
var TOt,
  jy,
  F3 = g(() => {
    Zx();
    ((TOt = class extends ed {
      #e = !0;
      #t;
      #r;
      constructor() {
        (super(),
          (this.#r = (t) => {
            if (typeof window < "u" && window.addEventListener) {
              let e = () => t(!0),
                r = () => t(!1);
              return (
                window.addEventListener("online", e, !1),
                window.addEventListener("offline", r, !1),
                () => {
                  (window.removeEventListener("online", e),
                    window.removeEventListener("offline", r));
                }
              );
            }
          }));
      }
      onSubscribe() {
        this.#t || this.setEventListener(this.#r);
      }
      onUnsubscribe() {
        this.hasListeners() || (this.#t?.(), (this.#t = void 0));
      }
      setEventListener(t) {
        ((this.#r = t), this.#t?.(), (this.#t = t(this.setOnline.bind(this))));
      }
      setOnline(t) {
        this.#e !== t &&
          ((this.#e = t),
          this.listeners.forEach((r) => {
            r(t);
          }));
      }
      isOnline() {
        return this.#e;
      }
    }),
      (jy = new TOt()));
  });
function POt(t) {
  return Math.min(1e3 * 2 ** t, 3e4);
}
function $3(t) {
  return (t ?? "online") === "online" ? jy.isOnline() : !0;
}
function cO(t) {
  let e = !1,
    r = 0,
    n,
    o = KOe(),
    i = () => o.status !== "pending",
    s = (v) => {
      if (!i()) {
        let y = new Gm(v);
        (m(y), t.onCancel?.(y));
      }
    },
    a = () => {
      e = !0;
    },
    l = () => {
      e = !1;
    },
    c = () => rO.isFocused() && (t.networkMode === "always" || jy.isOnline()) && t.canRun(),
    u = () => $3(t.networkMode) && t.canRun(),
    p = (v) => {
      i() || (n?.(), o.resolve(v));
    },
    m = (v) => {
      i() || (n?.(), o.reject(v));
    },
    f = () =>
      new Promise((v) => {
        ((n = (y) => {
          (i() || c()) && v(y);
        }),
          t.onPause?.());
      }).then(() => {
        ((n = void 0), i() || t.onContinue?.());
      }),
    h = () => {
      if (i()) return;
      let v,
        y = r === 0 ? t.initialPromise : void 0;
      try {
        v = y ?? t.fn();
      } catch (w) {
        v = Promise.reject(w);
      }
      Promise.resolve(v)
        .then(p)
        .catch((w) => {
          if (i()) return;
          let _ = t.retry ?? (lO.isServer() ? 0 : 3),
            S = t.retryDelay ?? POt,
            E = typeof S == "function" ? S(r, w) : S,
            T = _ === !0 || (typeof _ == "number" && r < _) || (typeof _ == "function" && _(r, w));
          if (e || !T) {
            m(w);
            return;
          }
          (r++,
            t.onFail?.(r, w),
            WOe(E)
              .then(() => (c() ? void 0 : f()))
              .then(() => {
                e ? m(w) : h();
              }));
        });
    };
  return {
    promise: o,
    status: () => o.status,
    cancel: s,
    continue: () => (n?.(), o),
    cancelRetry: a,
    continueRetry: l,
    canStart: u,
    start: () => (u() ? h() : f().then(h), o),
  };
}
var Gm,
  uO = g(() => {
    O3();
    F3();
    ZOe();
    B3();
    rl();
    Gm = class extends Error {
      constructor(t) {
        (super("CancelledError"), (this.revert = t?.revert), (this.silent = t?.silent));
      }
    };
  });
var dO,
  U3 = g(() => {
    nO();
    B3();
    rl();
    dO = class {
      #e;
      destroy() {
        this.clearGcTimeout();
      }
      scheduleGc() {
        (this.clearGcTimeout(),
          UOe(this.gcTime) &&
            (this.#e = Xx.setTimeout(() => {
              this.optionalRemove();
            }, this.gcTime)));
      }
      updateGcTime(t) {
        this.gcTime = Math.max(this.gcTime || 0, t ?? (lO.isServer() ? 1 / 0 : 5 * 60 * 1e3));
      }
      clearGcTimeout() {
        this.#e !== void 0 && (Xx.clearTimeout(this.#e), (this.#e = void 0));
      }
    };
  });
function YOe(t) {
  return {
    onFetch: (e, r) => {
      let n = e.options,
        o = e.fetchOptions?.meta?.fetchMore?.direction,
        i = e.state.data?.pages || [],
        s = e.state.data?.pageParams || [],
        a = { pages: [], pageParams: [] },
        l = 0,
        c = async () => {
          let u = !1,
            p = (h) => {
              VOe(
                h,
                () => e.signal,
                () => (u = !0),
              );
            },
            m = aO(e.options, e.fetchOptions),
            f = async (h, v, y) => {
              if (u) return Promise.reject(e.signal.reason);
              if (v == null && h.pages.length) return Promise.resolve(h);
              let _ = (() => {
                  let P = {
                    client: e.client,
                    queryKey: e.queryKey,
                    pageParam: v,
                    direction: y ? "backward" : "forward",
                    meta: e.options.meta,
                  };
                  return (p(P), P);
                })(),
                S = await m(_),
                { maxPages: E } = e.options,
                T = y ? zOe : jOe;
              return { pages: T(h.pages, S, E), pageParams: T(h.pageParams, v, E) };
            };
          if (o && i.length) {
            let h = o === "backward",
              v = h ? IOt : XOe,
              y = { pages: i, pageParams: s },
              w = v(n, y);
            a = await f(y, w, h);
          } else {
            let h = t ?? i.length;
            do {
              let v = l === 0 ? (s[0] ?? n.initialPageParam) : XOe(n, a);
              if (l > 0 && v == null) break;
              ((a = await f(a, v)), l++);
            } while (l < h);
          }
          return a;
        };
      e.options.persister
        ? (e.fetchFn = () =>
            e.options.persister?.(
              c,
              { client: e.client, queryKey: e.queryKey, meta: e.options.meta, signal: e.signal },
              r,
            ))
        : (e.fetchFn = c);
    },
  };
}
function XOe(t, { pages: e, pageParams: r }) {
  let n = e.length - 1;
  return e.length > 0 ? t.getNextPageParam(e[n], e, r[n], r) : void 0;
}
function IOt(t, { pages: e, pageParams: r }) {
  return e.length > 0 ? t.getPreviousPageParam?.(e[0], e, r[0], r) : void 0;
}
var JOe = g(() => {
  rl();
});
function kOt(t, e) {
  return {
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchStatus: $3(e.networkMode) ? "fetching" : "paused",
    ...(t === void 0 && { error: null, status: "pending" }),
  };
}
function QOe(t, e) {
  return {
    data: t,
    dataUpdatedAt: e ?? Date.now(),
    error: null,
    isInvalidated: !1,
    status: "success",
  };
}
function eNe(t) {
  let e = typeof t.initialData == "function" ? t.initialData() : t.initialData,
    r = e !== void 0,
    n = r
      ? typeof t.initialDataUpdatedAt == "function"
        ? t.initialDataUpdatedAt()
        : t.initialDataUpdatedAt
      : 0;
  return {
    data: e,
    dataUpdateCount: 0,
    dataUpdatedAt: r ? (n ?? Date.now()) : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: !1,
    status: r ? "success" : "pending",
    fetchStatus: "idle",
  };
}
var tNe,
  rNe = g(() => {
    rl();
    Hy();
    uO();
    U3();
    JOe();
    tNe = class extends dO {
      #e;
      #t;
      #r;
      #n;
      #i;
      #o;
      #s;
      #a;
      constructor(t) {
        (super(),
          (this.#a = !1),
          (this.#s = t.defaultOptions),
          this.setOptions(t.options),
          (this.observers = []),
          (this.#i = t.client),
          (this.#n = this.#i.getQueryCache()),
          (this.queryKey = t.queryKey),
          (this.queryHash = t.queryHash),
          (this.#t = eNe(this.options)),
          (this.state = t.state ?? this.#t),
          this.scheduleGc());
      }
      get meta() {
        return this.options.meta;
      }
      get queryType() {
        return this.#e;
      }
      get promise() {
        return this.#o?.promise;
      }
      setOptions(t) {
        if (
          ((this.options = { ...this.#s, ...t }),
          t?._type && (this.#e = t._type),
          this.updateGcTime(this.options.gcTime),
          this.state && this.state.data === void 0)
        ) {
          let e = eNe(this.options);
          e.data !== void 0 && (this.setState(QOe(e.data, e.dataUpdatedAt)), (this.#t = e));
        }
      }
      optionalRemove() {
        !this.observers.length && this.state.fetchStatus === "idle" && this.#n.remove(this);
      }
      setData(t, e) {
        let r = HOe(this.state.data, t, this.options);
        return (
          this.#l({ data: r, type: "success", dataUpdatedAt: e?.updatedAt, manual: e?.manual }),
          r
        );
      }
      setState(t) {
        this.#l({ type: "setState", state: t });
      }
      cancel(t) {
        let e = this.#o?.promise;
        return (this.#o?.cancel(t), e ? e.then($o).catch($o) : Promise.resolve());
      }
      destroy() {
        (super.destroy(), this.cancel({ silent: !0 }));
      }
      get resetState() {
        return this.#t;
      }
      reset() {
        (this.destroy(), this.setState(this.resetState));
      }
      isActive() {
        return this.observers.some((t) => GOe(t.options.enabled, this) !== !1);
      }
      isDisabled() {
        return this.getObserversCount() > 0
          ? !this.isActive()
          : this.options.queryFn === Um || !this.isFetched();
      }
      isFetched() {
        return this.state.dataUpdateCount + this.state.errorUpdateCount > 0;
      }
      isStatic() {
        return this.getObserversCount() > 0
          ? this.observers.some((t) => Yx(t.options.staleTime, this) === "static")
          : !1;
      }
      isStale() {
        return this.getObserversCount() > 0
          ? this.observers.some((t) => t.getCurrentResult().isStale)
          : this.state.data === void 0 || this.state.isInvalidated;
      }
      isStaleByTime(t = 0) {
        return this.state.data === void 0
          ? !0
          : t === "static"
            ? !1
            : this.state.isInvalidated
              ? !0
              : !qOe(this.state.dataUpdatedAt, t);
      }
      onFocus() {
        (this.observers.find((e) => e.shouldFetchOnWindowFocus())?.refetch({ cancelRefetch: !1 }),
          this.#o?.continue());
      }
      onOnline() {
        (this.observers.find((e) => e.shouldFetchOnReconnect())?.refetch({ cancelRefetch: !1 }),
          this.#o?.continue());
      }
      addObserver(t) {
        this.observers.includes(t) ||
          (this.observers.push(t),
          this.clearGcTimeout(),
          this.#n.notify({ type: "observerAdded", query: this, observer: t }));
      }
      removeObserver(t) {
        this.observers.includes(t) &&
          ((this.observers = this.observers.filter((e) => e !== t)),
          this.observers.length ||
            (this.#o &&
              (this.#a || this.#c() ? this.#o.cancel({ revert: !0 }) : this.#o.cancelRetry()),
            this.scheduleGc()),
          this.#n.notify({ type: "observerRemoved", query: this, observer: t }));
      }
      getObserversCount() {
        return this.observers.length;
      }
      #c() {
        return this.state.fetchStatus === "paused" && this.state.status === "pending";
      }
      invalidate() {
        this.state.isInvalidated || this.#l({ type: "invalidate" });
      }
      async fetch(t, e) {
        if (this.state.fetchStatus !== "idle" && this.#o?.status() !== "rejected") {
          if (this.state.data !== void 0 && e?.cancelRefetch) this.cancel({ silent: !0 });
          else if (this.#o) return (this.#o.continueRetry(), this.#o.promise);
        }
        if ((t && this.setOptions(t), !this.options.queryFn)) {
          let l = this.observers.find((c) => c.options.queryFn);
          l && this.setOptions(l.options);
        }
        process.env.NODE_ENV !== "production" &&
          (Array.isArray(this.options.queryKey) ||
            console.error(
              "As of v4, queryKey needs to be an Array. If you are using a string like 'repoData', please change it to an Array, e.g. ['repoData']",
            ));
        let r = new AbortController(),
          n = (l) => {
            Object.defineProperty(l, "signal", {
              enumerable: !0,
              get: () => ((this.#a = !0), r.signal),
            });
          },
          o = () => {
            let l = aO(this.options, e),
              u = (() => {
                let p = { client: this.#i, queryKey: this.queryKey, meta: this.meta };
                return (n(p), p);
              })();
            return (
              (this.#a = !1),
              this.options.persister ? this.options.persister(l, u, this) : l(u)
            );
          },
          s = (() => {
            let l = {
              fetchOptions: e,
              options: this.options,
              queryKey: this.queryKey,
              client: this.#i,
              state: this.state,
              fetchFn: o,
            };
            return (n(l), l);
          })();
        ((this.#e === "infinite" ? YOe(this.options.pages) : this.options.behavior)?.onFetch(
          s,
          this,
        ),
          (this.#r = this.state),
          (this.state.fetchStatus === "idle" || this.state.fetchMeta !== s.fetchOptions?.meta) &&
            this.#l({ type: "fetch", meta: s.fetchOptions?.meta }),
          (this.#o = cO({
            initialPromise: e?.initialPromise,
            fn: s.fetchFn,
            onCancel: (l) => {
              (l instanceof Gm && l.revert && this.setState({ ...this.#r, fetchStatus: "idle" }),
                r.abort());
            },
            onFail: (l, c) => {
              this.#l({ type: "failed", failureCount: l, error: c });
            },
            onPause: () => {
              this.#l({ type: "pause" });
            },
            onContinue: () => {
              this.#l({ type: "continue" });
            },
            retry: s.options.retry,
            retryDelay: s.options.retryDelay,
            networkMode: s.options.networkMode,
            canRun: () => !0,
          })));
        try {
          let l = await this.#o.start();
          if (l === void 0)
            throw (
              process.env.NODE_ENV !== "production" &&
                console.error(
                  `Query data cannot be undefined. Please make sure to return a value other than undefined from your query function. Affected query key: ${this.queryHash}`,
                ),
              new Error(`${this.queryHash} data is undefined`)
            );
          return (
            this.setData(l),
            this.#n.config.onSuccess?.(l, this),
            this.#n.config.onSettled?.(l, this.state.error, this),
            l
          );
        } catch (l) {
          if (l instanceof Gm) {
            if (l.silent) return this.#o.promise;
            if (l.revert) {
              if (this.state.data === void 0) throw l;
              return this.state.data;
            }
          }
          throw (
            this.#l({ type: "error", error: l }),
            this.#n.config.onError?.(l, this),
            this.#n.config.onSettled?.(this.state.data, l, this),
            l
          );
        } finally {
          this.scheduleGc();
        }
      }
      #l(t) {
        let e = (r) => {
          switch (t.type) {
            case "failed":
              return { ...r, fetchFailureCount: t.failureCount, fetchFailureReason: t.error };
            case "pause":
              return { ...r, fetchStatus: "paused" };
            case "continue":
              return { ...r, fetchStatus: "fetching" };
            case "fetch":
              return { ...r, ...kOt(r.data, this.options), fetchMeta: t.meta ?? null };
            case "success":
              let n = {
                ...r,
                ...QOe(t.data, t.dataUpdatedAt),
                dataUpdateCount: r.dataUpdateCount + 1,
                ...(!t.manual && {
                  fetchStatus: "idle",
                  fetchFailureCount: 0,
                  fetchFailureReason: null,
                }),
              };
              return ((this.#r = t.manual ? n : void 0), n);
            case "error":
              let o = t.error;
              return {
                ...r,
                error: o,
                errorUpdateCount: r.errorUpdateCount + 1,
                errorUpdatedAt: Date.now(),
                fetchFailureCount: r.fetchFailureCount + 1,
                fetchFailureReason: o,
                fetchStatus: "idle",
                status: "error",
                isInvalidated: !0,
              };
            case "invalidate":
              return { ...r, isInvalidated: !0 };
            case "setState":
              return { ...r, ...t.state };
          }
        };
        ((this.state = e(this.state)),
          mn.batch(() => {
            (this.observers.forEach((r) => {
              r.onQueryUpdate();
            }),
              this.#n.notify({ query: this, type: "updated", action: t }));
          }));
      }
    };
  });
