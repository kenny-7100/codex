async function eFt({ host: t, capture: e, headTreeSha: r, signal: n }) {
  let o = `${e.checkpointRefPrefix}/${Date.now()}/${crypto.randomUUID()}`;
  (await R5({ host: t, ref: o, root: e.root, signal: n, treeSha: r }),
    await nFt({
      host: t,
      exceptRef: o,
      refPrefix: `${e.checkpointScopeRefPrefix}*/*/*/*`,
      root: e.root,
    }));
}
async function tFt({ host: t, nowMs: e, refPrefix: r, root: n }) {
  let o = await I(n, ["for-each-ref", "--format=%(refname) %(objectname)", r], t);
  if (!o.success) return null;
  let i = null,
    s = -1 / 0;
  for (let a of o.stdout.split(`
`)) {
    let [l, c] = a.split(" "),
      u = Number(l?.split("/").at(-2));
    c != null && Number.isSafeInteger(u) && u > s && e - u <= JFe && ((i = c), (s = u));
  }
  return i;
}
async function A5({ host: t, baseRef: e, headTreeSha: r, root: n, signal: o, timeoutMs: i }) {
  let s = await ds(n, [e, r], t, {
    allowedNonZeroExitCodes: [0, 1],
    maxOutputBytes: YBt,
    signal: o,
    timeoutMs: i,
    trim: !1,
  });
  if (!s.success || s.outputLimitExceeded) {
    let a = qi(s);
    return (a.type === "unknown" && (a.failureReason = zu(s.stderr)), { type: "error", error: a });
  }
  return { type: "success", unifiedDiff: s.stdout, unifiedDiffBytes: s.stdoutBytes };
}
async function R5({ host: t, ref: e, root: r, signal: n, treeSha: o }) {
  if (!(await I(r, ["update-ref", e, o], t, { signal: n })).success)
    throw new Error("Failed to retain a turn diff tree snapshot");
}
async function vN({ host: t, ref: e, root: r }) {
  if (!(await I(r, ["update-ref", "-d", e], t)).success)
    throw new Error("Failed to release a turn diff tree snapshot");
}
async function rFt({ host: t, nowMs: e, root: r }) {
  let n = [yN, x5];
  (await o(n).catch(() => !1)) || (await Promise.all(n.map((i) => o([i]))));
  async function o(i) {
    let s = await I(r, ["for-each-ref", "--format=%(refname)", ...i], t);
    return s.success
      ? (await Promise.allSettled(
          s.stdout
            .split(
              `
`,
            )
            .filter((a) => {
              let l = a.startsWith(yN),
                c = l ? yN : x5,
                u = Number(a.slice(c.length + 1).split("/")[l ? 0 : 2]),
                p = l ? XBt : JFe;
              return Number.isSafeInteger(u) && e - u > p;
            })
            .map((a) => vN({ host: t, ref: a, root: r })),
        ),
        !0)
      : !1;
  }
}
async function nFt({ host: t, exceptRef: e, refPrefix: r, root: n }) {
  let o = await I(n, ["for-each-ref", "--format=%(refname)", r], t);
  o.success &&
    (await Promise.allSettled(
      o.stdout
        .split(
          `
`,
        )
        .filter((i) => i !== e)
        .map((i) => vN({ host: t, ref: i, root: n })),
    ));
}
async function _5(t) {
  return (await wO("SHA-256", t)).slice(0, 32);
}
function t1e(t, e) {
  return `${t}\0${e}`;
}
var yN,
  x5,
  XBt,
  JFe,
  YBt,
  JBt,
  PA,
  r1e = g(() => {
    O();
    nK();
    MO();
    fd();
    pN();
    YFe();
    cx();
    jm();
    fe();
    Vm();
    ((yN = "refs/codex/turn-diffs/captures"),
      (x5 = "refs/codex/turn-diffs/checkpoints"),
      (XBt = 864e5),
      (JFe = 7 * 864e5),
      (YBt = 1024 * 1024),
      (JBt = 5e3),
      (PA = new Map()));
  });
async function n1e({ sourceCwd: t, worktreeCwd: e, gitManager: r, host: n }) {
  let o = [],
    i = await r.getWorktreeRepository(e, n),
    s = i?.root;
  s && s !== e && o.push(s);
  let a = await r.getWorktreeRepository(t, n),
    l = a?.root;
  l && l !== e && l !== s && o.push(l);
  let u = (await r.getRepoRepository(i?.root ?? t, n))?.getCommonDir();
  if (u) {
    let f = Br.default.isAbsolute(u) ? u : Br.default.resolve(l ?? t, u);
    return (o.push(f), o);
  }
  let p = i ?? a,
    m = p != null ? await Hm(p) : null;
  return (m ? o.push(Br.default.dirname(m)) : l && o.push(Br.default.join(l, ".git")), o);
}
var o1e = g(() => {
  O();
  tA();
  vx();
});
var i1e,
  oFt,
  iFt,
  bN,
  s1e = g(() => {
    O();
    hr();
    ((i1e = 250),
      (oFt = 6e4),
      (iFt = 3e4),
      (bN = class {
        constructor(e) {
          this.options = e;
          this.checkForGitDebounced = mue((r) => {
            this.checkForGitDirectory(r);
          }, 250);
        }
        logger = Dt("git-init-watcher");
        checkForGitDebounced;
        sessions = new Set();
        disposed = !1;
        reconnectDelayMs = i1e;
        reconnectTimer = null;
        async start() {
          let e, r;
          try {
            let o = await this.options.host.platformPath();
            ((e = o.join(this.options.cwd, ".git")), (r = o.sep));
          } catch (o) {
            return (this.logWatchFailure(o), !1);
          }
          let n = await this.startSessions({
            checkExistingGitDirectory: this.options.watchMode !== "watch-git-metadata",
            gitDirectoryPath: e,
            pathSeparator: r,
          });
          return !n && !this.disposed ? (this.scheduleReconnect(e, r), !0) : n;
        }
        dispose() {
          ((this.disposed = !0),
            this.checkForGitDebounced.cancel(),
            this.reconnectTimer != null &&
              (clearTimeout(this.reconnectTimer), (this.reconnectTimer = null)),
            this.disposeSessions());
        }
        async startSessions({
          checkExistingGitDirectory: e,
          gitDirectoryPath: r,
          pathSeparator: n,
        }) {
          if (this.disposed) return !1;
          let o;
          try {
            o = await this.startWatch(
              this.options.cwd,
              ({ changedPaths: s }) => {
                (s.length > 0 && !s.some((a) => a === r || a.startsWith(`${r}${n}`))) ||
                  this.checkForGitDebounced(r);
              },
              r,
              n,
            );
          } catch (s) {
            return (this.logWatchFailure(s), !1);
          }
          if (o == null) return !1;
          let i = null;
          if (this.options.watchMode === "watch-git-metadata") {
            try {
              i = await this.startWatch(
                r,
                () => {
                  this.checkForGitDebounced(r);
                },
                r,
                n,
              );
            } catch (s) {
              let a = !1;
              try {
                a = !(await this.options.host.stat(r, { bypassCache: !0 })).isDirectory();
              } catch (l) {
                a = bt(l);
              }
              return a
                ? (this.logger.warning("Failed to watch git path; keeping workspace root watch", {
                    safe: {},
                    sensitive: { cwd: this.options.cwd, error: s },
                  }),
                  this.sessions.has(o))
                : (this.disposeSessions(), this.logWatchFailure(s), !1);
            }
            if (i == null || !this.sessions.has(o) || !this.sessions.has(i))
              return (this.disposeSessions(), !1);
          }
          return (
            e && (await this.checkForGitDirectory(r)),
            !this.disposed && this.sessions.has(o) && (i == null || this.sessions.has(i))
          );
        }
        async startWatch(e, r, n, o) {
          let i = await this.options.host.startFileWatch({
            path: e,
            recursive: !1,
            renameEventHandling: "changed-path",
            watchId: `git-init-${crypto.randomUUID()}`,
            onChange: r,
          });
          if (this.disposed) return (await i.dispose(), null);
          this.sessions.add(i);
          let s = Date.now();
          return (
            i.closed.then((a) => {
              this.sessions.delete(i) &&
                (a.reason === "watch-error" &&
                  this.logger.warning("Git init watcher failed", {
                    safe: {},
                    sensitive: { cwd: this.options.cwd, error: a.error },
                  }),
                (a.reason === "connection-closed" || a.reason === "watch-error") &&
                  (Date.now() - s >= iFt && (this.reconnectDelayMs = i1e),
                  this.disposeSessions(),
                  this.scheduleReconnect(n, o)));
            }),
            i
          );
        }
        scheduleReconnect(e, r) {
          if (this.disposed || this.reconnectTimer != null) return;
          let n = this.reconnectDelayMs;
          ((this.reconnectDelayMs = Math.min(this.reconnectDelayMs * 2, oFt)),
            (this.reconnectTimer = setTimeout(() => {
              ((this.reconnectTimer = null),
                this.startSessions({
                  checkExistingGitDirectory: !0,
                  gitDirectoryPath: e,
                  pathSeparator: r,
                }).then((o) => {
                  o || this.scheduleReconnect(e, r);
                }));
            }, n)));
        }
        disposeSessions() {
          let e = [...this.sessions];
          this.sessions.clear();
          for (let r of e) r.dispose();
        }
        logWatchFailure(e) {
          this.logger.warning("Failed to watch workspace root for git init", {
            safe: {},
            sensitive: { cwd: this.options.cwd, error: e },
          });
        }
        async checkForGitDirectory(e) {
          if (!this.disposed) {
            try {
              await this.options.host.stat(e, { bypassCache: !0 });
            } catch {
              return;
            }
            this.disposed || (this.dispose(), this.options.onGitInit());
          }
        }
      }));
  });
function a1e(t) {
  let e = Number.parseInt(t.traceparent.slice(-2), 16);
  return Number.isFinite(e) && e % 2 === 1;
}
function E5(t, e) {
  e == null ||
    t.trace?.traceparent === e.traceparent ||
    (t.trace == null
      ? (t.trace = e)
      : !a1e(t.trace) && a1e(e)
        ? (wN(t.traceLinks, t.trace), (t.trace = e))
        : wN(t.traceLinks, e));
}
function wN(t, e) {
  t.length < cFt && !t.some((r) => r.traceparent === e.traceparent) && t.push(e);
}
function uFt(t, e) {
  switch (t.method) {
    case "status-summary":
      switch (e) {
        case "config":
        case "head":
        case "index":
        case "working-tree":
          return !0;
        case "remote-refs":
        case "local-refs":
        case "synced-branch":
        case "worktree-topology":
          return !1;
      }
    case "review-summary":
    case "branch-diff-stats":
      switch (e) {
        case "config":
        case "head":
        case "index":
        case "remote-refs":
        case "working-tree":
          return !0;
        case "synced-branch":
        case "local-refs":
        case "worktree-topology":
          return !1;
      }
    case "recent-branches":
      switch (e) {
        case "config":
        case "head":
        case "local-refs":
        case "remote-refs":
          return !0;
        case "index":
        case "synced-branch":
        case "worktree-topology":
        case "working-tree":
          return !1;
      }
    case "current-branch":
      switch (e) {
        case "head":
          return !0;
        case "config":
        case "index":
        case "local-refs":
        case "remote-refs":
        case "synced-branch":
        case "worktree-topology":
        case "working-tree":
          return !1;
      }
    case "upstream-branch":
      switch (e) {
        case "config":
        case "head":
          return !0;
        case "index":
        case "local-refs":
        case "remote-refs":
        case "synced-branch":
        case "worktree-topology":
        case "working-tree":
          return !1;
      }
    case "branch-ahead-count":
    case "branch-commits":
      switch (e) {
        case "config":
        case "head":
        case "remote-refs":
          return !0;
        case "index":
        case "local-refs":
        case "synced-branch":
        case "worktree-topology":
        case "working-tree":
          return !1;
      }
    case "default-branch":
    case "base-branch":
      switch (e) {
        case "config":
        case "head":
        case "remote-refs":
          return !0;
        case "index":
        case "local-refs":
        case "synced-branch":
        case "worktree-topology":
        case "working-tree":
          return !1;
      }
    case "list-worktrees":
      switch (e) {
        case "head":
        case "worktree-topology":
          return !0;
        case "config":
        case "index":
        case "local-refs":
        case "remote-refs":
        case "synced-branch":
        case "working-tree":
          return !1;
      }
  }
}
var sFt,
  aFt,
  lFt,
  cFt,
  SN,
  l1e = g(() => {
    O();
    ((sFt = 100),
      (aFt = 1e3),
      (lFt = 3),
      (cFt = 4),
      (SN = class {
        constructor(e) {
          this.dependencies = e;
        }
        nextGeneration = 1;
        localBranchDependencies = new Map();
        states = new Map();
        repositoryRuns = new Map();
        sharedRuns = new Map();
        subscribe(e) {
          if (this.states.has(e.subscriptionId)) return;
          let r = {
            abortController: null,
            commonDir: e.commonDir,
            dirty: !0,
            errorRetryCount: 0,
            generation: this.nextGeneration++,
            host: e.host,
            inFlight: null,
            query: e.query,
            requiresRecovery: e.requiresRecovery,
            refreshTimer: null,
            refreshWaiters: [],
            root: e.root,
            subscriptionId: e.subscriptionId,
            trace: e.trace,
            traceLinks: [],
            trigger: "subscription",
          };
          (this.states.set(e.subscriptionId, r),
            this.updateLocalBranchDependency(r, 1),
            this.refresh(r));
        }
        unsubscribe(e) {
          let r = this.states.get(e);
          r != null &&
            (r.refreshTimer != null && clearTimeout(r.refreshTimer),
            r.abortController?.abort(),
            r.refreshWaiters.forEach((n) => n()),
            this.updateLocalBranchDependency(r, -1),
            this.states.delete(e));
        }
        hasLocalBranchDependency(e) {
          return this.localBranchDependencies.has(
            `${e.hostId}\0${e.commonDir}\0${e.root}\0${e.branch}`,
          );
        }
        updateLocalBranchDependency(e, r) {
          let n;
          if (e.query.method === "review-summary") {
            if (e.query.params.source !== "branch") return;
            n = e.query.params.baseBranch;
          } else if (e.query.method === "branch-diff-stats" || e.query.method === "branch-commits")
            n = e.query.params.baseBranch;
          else return;
          let o = n?.trim();
          if (!o) return;
          let i = o.startsWith("refs/heads/") ? o.slice(11) : o,
            s = `${e.host.id}\0${e.commonDir}\0${e.root}\0${i}`,
            a = (this.localBranchDependencies.get(s) ?? 0) + r;
          if (a === 0) {
            this.localBranchDependencies.delete(s);
            return;
          }
          this.localBranchDependencies.set(s, a);
        }
        handleRepoChanged(e, r) {
          let n = [...this.states.values()].filter(
            (o) =>
              o.host.id === e.hostId &&
              o.commonDir === e.commonDir &&
              o.root === e.root &&
              uFt(o.query, e.changeType),
          );
          return (r?.(n.length), this.refreshStates(n, "invalidation", e.trace));
        }
        setRequiresRecovery(e, r, n) {
          let o = [...this.states.values()].filter((i) =>
            i.host.id !== e || i.root !== r || i.requiresRecovery === n
              ? !1
              : ((i.requiresRecovery = n), !0),
          );
          this.refreshStates(o, "recovery", fo() ?? void 0);
        }
        recover(e) {
          let r = new Map(),
            n = new Set();
          for (let o of e.subscriptionIds) {
            let i = this.states.get(o);
            i?.host.id === e.hostId &&
              (e.root == null || i.root === e.root) &&
              i.requiresRecovery &&
              (r.set(i.root, i.host), n.add(i));
          }
          if (r.size === 0) return Promise.resolve();
          for (let [o, i] of r) this.dependencies.prepareRecovery(o, i);
          for (let o of this.states.values())
            o.query.method === "review-summary" &&
              o.host.id === e.hostId &&
              r.has(o.root) &&
              n.add(o);
          return this.refreshStates([...n], "recovery", fo() ?? void 0);
        }
        refreshRepository(e, r) {
          return this.refreshStates(
            [...this.states.values()].filter((n) => n.host.id === e && n.root === r),
            "mutation",
            fo() ?? void 0,
          );
        }
        refreshStates(e, r, n) {
          let o = e.map((i) => {
            ((i.generation = this.nextGeneration++),
              (i.dirty = !0),
              (i.errorRetryCount = 0),
              (i.trigger = r),
              E5(i, n));
            let s = new Promise((a) => i.refreshWaiters.push(a));
            return (this.scheduleRefresh(i), s);
          });
          return Promise.all(o).then(() => {});
        }
        scheduleRefresh(e, r = e.host.isLocal ? sFt : 0) {
          if (!(e.inFlight != null || e.refreshTimer != null)) {
            if (r === 0) {
              this.refresh(e);
              return;
            }
            e.refreshTimer = setTimeout(() => {
              ((e.refreshTimer = null), this.states.get(e.subscriptionId) === e && this.refresh(e));
            }, r);
          }
        }
        refresh(e) {
          if (e.inFlight != null || !e.dirty) return;
          let r = e.generation,
            n = new AbortController(),
            o = null,
            i = e.trace,
            s = e.traceLinks;
          ((e.trace = void 0),
            (e.traceLinks = []),
            (e.abortController = n),
            (e.dirty = !1),
            (e.inFlight = Promise.resolve()
              .then(() =>
                this.runShared(e, n.signal, i, s, (a) => {
                  this.isCurrent(e, r) && this.publish(e, r, { ...a, phase: "tracked" }, i);
                }),
              )
              .then((a) => {
                if (this.isCurrent(e, r)) {
                  this.publish(e, r, { ...a, phase: "complete" }, i);
                  let l =
                    (a.method === "review-summary" || a.method === "status-summary") &&
                    a.result.type === "error";
                  l && e.errorRetryCount < lFt
                    ? ((e.errorRetryCount += 1),
                      (e.dirty = !0),
                      E5(e, i),
                      s.forEach((c) => E5(e, c)),
                      (o = aFt))
                    : l || (e.errorRetryCount = 0);
                }
              })
              .catch((a) => {
                if (this.isCurrent(e, r)) {
                  if (a instanceof Error && a.message === No) {
                    ((e.dirty = !0), (o = 3e4));
                    return;
                  }
                  this.dependencies.emit({
                    type: "git-live-query-failed",
                    emittedAtMs: Date.now(),
                    generation: r,
                    method: e.query.method,
                    subscriptionId: e.subscriptionId,
                    ...(i == null ? {} : { trace: i }),
                  });
                }
              })
              .finally(() => {
                if (this.states.get(e.subscriptionId) === e) {
                  if (((e.abortController = null), (e.inFlight = null), e.generation === r)) {
                    let a = e.refreshWaiters;
                    ((e.refreshWaiters = []), a.forEach((l) => l()));
                  }
                  e.dirty &&
                    (o != null && e.generation === r && (e.generation = this.nextGeneration++),
                    this.scheduleRefresh(e, o ?? void 0));
                }
              })));
        }
        runShared(e, r, n, o, i) {
          let s = `${e.host.id}\0${e.commonDir}`,
            a = `${s}\0${e.root}\0${JSON.stringify([e.query.method, e.query.params])}`,
            l = this.sharedRuns.get(a);
          if (l == null || l.abortController.signal.aborted) {
            ((l = {
              abortController: new AbortController(),
              consumers: new Set(),
              result: pt(),
              trackedResult: null,
              trace: n,
            }),
              this.sharedRuns.set(a, l));
            let m = l,
              f = this.repositoryRuns.get(s),
              v = (
                f == null
                  ? Promise.resolve()
                  : jt(
                      {
                        attributes: {
                          "git.operation": e.query.method,
                          "git.trigger": e.trigger,
                          "worker.id": "git",
                          "worker.method": "subscribe-live-query",
                        },
                        links: f.trace == null ? [] : [f.trace],
                        name: "git.repository_queue_wait",
                        op: "codex.git.repository_queue_wait",
                        trace: n,
                      },
                      () => f.completion,
                    )
              )
                .then(async () => {
                  if (m.abortController.signal.aborted) {
                    m.result.reject(m.abortController.signal.reason);
                    return;
                  }
                  try {
                    m.result.resolve(
                      await this.dependencies.run(
                        e.query,
                        e.root,
                        e.host,
                        m.abortController.signal,
                        (y) => {
                          ((m.trackedResult = y), m.consumers.forEach((w) => w(y)));
                        },
                        e.trigger,
                        e.commonDir,
                        n,
                        o,
                        e.errorRetryCount,
                      ),
                    );
                  } catch (y) {
                    m.result.reject(y);
                  }
                })
                .finally(() => {
                  (this.sharedRuns.get(a) === m && this.sharedRuns.delete(a),
                    this.repositoryRuns.get(s)?.completion === v && this.repositoryRuns.delete(s));
                });
            this.repositoryRuns.set(s, { completion: v, trace: n });
          }
          (l.consumers.add(i), l.trackedResult != null && i(l.trackedResult));
          let c = () => {
            (l.consumers.delete(i), l.consumers.size === 0 && l.abortController.abort(r.reason));
          };
          (r.addEventListener("abort", c, { once: !0 }), r.aborted && c());
          let u = l.result.promise.finally(() => {
            (r.removeEventListener("abort", c), l.consumers.delete(i));
          });
          if (n == null || (l.trace?.traceparent === n.traceparent && o.length === 0)) return u;
          let p = new Array();
          return (
            l.trace != null && l.trace.traceparent !== n.traceparent && wN(p, l.trace),
            o.forEach((m) => wN(p, m)),
            jt(
              {
                attributes: {
                  "git.operation": e.query.method,
                  "git.shared": !0,
                  "worker.id": "git",
                  "worker.method": "subscribe-live-query",
                },
                links: p,
                name: "git.shared_query_wait",
                op: "codex.git.shared_query_wait",
                trace: n,
              },
              () => u,
            )
          );
        }
        isCurrent(e, r) {
          return this.states.get(e.subscriptionId) === e && e.generation === r;
        }
        publish(e, r, n, o) {
          this.dependencies.emit({
            type: "git-live-query-updated",
            emittedAtMs: Date.now(),
            generation: r,
            requiresRecovery: e.requiresRecovery,
            subscriptionId: e.subscriptionId,
            ...(o == null ? {} : { trace: o }),
            ...n,
          });
        }
      }));
  });
var _N,
  c1e = g(() => {
    O();
    Sx();
    _N = class {
      constructor(e) {
        this.startWatch = e;
      }
      watches = new Map();
      wslCwdWatches = new Map();
      async waitForCwdChange(e, { cwd: r, symlinkTarget: n }, o, i, s) {
        if (!e.isLocal || i == null || o.aborted) return !1;
        let a = _Ie(e, r, n, s);
        if (a != null) return this.waitForWslCwdChange(JSON.stringify([e.id, r, n]), o, a);
        let l = $D(r, e);
        if (n != null && l !== n) return !0;
        let c = () => $D(r, e) !== l,
          u = pt(),
          p = () => u.resolve(!1),
          m = [];
        o.addEventListener("abort", p, { once: !0 });
        try {
          let f = await i(r);
          for (let [v, y] of f) {
            if (o.aborted) return !1;
            let w = await this.start(e, {
              path: v,
              recursive: !1,
              renameEventHandling: "changed-path",
              watchId: crypto.randomUUID(),
              onChange: ({ changedPaths: _ }) => {
                (_.some((S) => y.has(S)) || (_.length === 0 && c())) && u.resolve(!0);
              },
            });
            (m.push(w), w.closed.then(p, p));
          }
          let h = n == null && l != null && (await Promise.race([s(l), u.promise]));
          return c() || h || (m.length > 0 && (await u.promise));
        } finally {
          (o.removeEventListener("abort", p), await Promise.all(m.map((f) => f.dispose())));
        }
      }
      async waitForWslCwdChange(e, r, n) {
        let o = this.wslCwdWatches.get(e);
        if (o == null) {
          let a = new AbortController(),
            l = n(a.signal);
          ((o = { controller: a, result: l, subscribers: 0 }), this.wslCwdWatches.set(e, o));
          let c = () => {
            this.wslCwdWatches.get(e) === o && this.wslCwdWatches.delete(e);
          };
          l.then(c, c);
        }
        o.subscribers += 1;
        let i = pt(),
          s = () => i.resolve(!1);
        r.addEventListener("abort", s, { once: !0 });
        try {
          return await Promise.race([o.result, i.promise]);
        } finally {
          (r.removeEventListener("abort", s),
            (o.subscribers -= 1),
            o.subscribers === 0 &&
              (this.wslCwdWatches.get(e) === o && this.wslCwdWatches.delete(e),
              o.controller.abort(),
              await o.result.catch(() => !1)));
        }
      }
      async start(e, r) {
        let n = JSON.stringify([e.id, r.path, r.recursive, r.renameEventHandling]),
          o = this.watches.get(n);
        if (o?.disposal != null) return (await o.disposal, this.start(e, r));
        if (o == null) {
          let u = new Set(),
            p = Promise.resolve().then(() =>
              this.startWatch(e, {
                ...r,
                onChange: (v) => {
                  for (let y of u) y.onChange(v);
                },
              }),
            ),
            m = { subscribers: u, session: p, disposal: null };
          ((o = m), this.watches.set(n, m));
          let f = (v) => {
              m.disposal == null && this.watches.get(n) === m && this.watches.delete(n);
              for (let y of u) y.close(v);
              u.clear();
            },
            h = (v) => {
              f({ reason: "watch-error", error: v });
            };
          p.then((v) => v.closed.then(f, h), h);
        }
        let i = o,
          s = pt(),
          a = { onChange: r.onChange, close: s.resolve };
        i.subscribers.add(a);
        let l = await i.session,
          c = () =>
            i.subscribers.delete(a)
              ? (s.resolve({ reason: "disposed" }),
                i.subscribers.size > 0
                  ? Promise.resolve()
                  : ((i.disposal = Promise.resolve()
                      .then(() => l.dispose())
                      .finally(() => {
                        this.watches.get(n) === i && this.watches.delete(n);
                      })),
                    i.disposal))
              : (i.disposal ?? Promise.resolve());
        return {
          coverage: l.coverage,
          path: l.path,
          closed: s.promise,
          dispose: c,
          disposeForReplacement: () => (this.watches.get(n) === i && this.watches.delete(n), c()),
        };
      }
    };
  });
function C5(t) {
  return t === "branch-diff-stats" ||
    t === "review-diff" ||
    t === "review-patch" ||
    t === "review-search" ||
    t === "review-source-line-counts" ||
    t === "review-summary" ||
    t === "status-summary"
    ? t
    : null;
}
function u1e(t) {
  switch (t.method) {
    case "branch-diff-stats":
      return { operation: "branch-diff-stats", result: t.result };
    case "review-summary":
      return { operation: "review-summary", result: t.result };
    case "status-summary":
      return { operation: "status-summary", result: t.result };
    case "base-branch":
    case "branch-ahead-count":
    case "branch-commits":
    case "current-branch":
    case "default-branch":
    case "list-worktrees":
    case "recent-branches":
    case "upstream-branch":
      return;
  }
}
function d1e({
  attribution: t,
  canceled: e,
  durationMs: r,
  firstResultMs: n,
  hostKind: o,
  operation: i,
  queueDurationMs: s,
  repoIndexSizeBucket: a,
  result: l,
  resultDisposition: c = e ? "canceled" : l == null ? null : "completed",
  resultFields: u,
  reviewSource: p,
  retryAttempt: m = null,
  source: f,
  trigger: h,
}) {
  let v = u ?? Ys(l),
    y = hFt(t),
    w = dFt(l),
    _ = fFt({ result: l, resultDisposition: c }),
    S = pFt({
      canceled: e,
      canceledCommandCount: t.canceledCommandCount,
      failedCommandCount: t.failedCommandCount,
      outputLimitExceededCount: t.outputLimitExceededCount,
      result: l,
      resultDisposition: c,
      resultFields: v,
      timedOutCommandCount: t.timedOutCommandCount,
    });
  return {
    additions: v.additions,
    cacheStatus: y,
    canceledCommandCount: t.canceledCommandCount,
    commandCount: t.commandCount,
    commandDurationMsMax: t.commandDurationMsMax,
    commandDurationMsSum: t.commandDurationMsSum,
    concurrentOperationCount: t.concurrentOperationCount,
    deletions: v.deletions,
    diffBytes: v.diffBytes,
    diffCommandCount: t.diffCommandCount,
    durationMs: r,
    failedCommandCount: t.failedCommandCount,
    failedCommandDurationMs: t.slowestFailedCommand?.durationMs ?? null,
    failedCommandErrorKind: t.slowestFailedCommand?.errorKind ?? null,
    failedCommandExitCodeBucket: t.slowestFailedCommand?.exitCodeBucket ?? null,
    failedCommandFailureKind: t.slowestFailedCommand?.failureKind ?? null,
    failedCommandSubcommand: t.slowestFailedCommand?.subcommand ?? null,
    fileCount: v.fileCount,
    firstResultMs: n,
    hostKind: o,
    matchCount: v.matchCount,
    operation: i,
    outcome: S,
    outputLimitExceededCount: t.outputLimitExceededCount,
    peakCommandConcurrency: t.peakCommandConcurrency,
    queueDurationMs: s,
    reason: mFt({
      attribution: t,
      canceled: e,
      expectedReason: w,
      outcome: S,
      resultFailureReason: _,
    }),
    repoIndexSizeBucket: a,
    resultDisposition: c,
    resultFailureReason: _,
    reviewSource: p,
    retryAttempt: m,
    source: f,
    statusCommandCount: t.statusCommandCount,
    stderrBytes: t.stderrBytes,
    stdoutBytes: t.stdoutBytes,
    timedOutCommandCount: t.timedOutCommandCount,
    trigger: h,
    truncated: v.truncated || t.outputLimitExceededCount > 0,
    untrackedCacheCoalescedCount: t.untrackedCacheCoalescedCount,
    untrackedCacheHitCount: t.untrackedCacheHitCount,
    untrackedCacheMissCount: t.untrackedCacheMissCount,
    untrackedFileCount: v.untrackedFileCount,
    untrackedListCommandCount: t.untrackedListCommandCount,
    untrackedStatusCommandCount: t.untrackedStatusCommandCount,
  };
}
function dFt(t) {
  if (t?.operation === "review-summary")
    return t.result.type === "expected" ? t.result.reason : null;
  if (t?.operation === "review-source-line-counts") {
    let e = null;
    for (let r of t.result) {
      if (r.type === "error") return null;
      r.type === "expected" && e == null && (e = r.reason);
    }
    return e;
  }
  return null;
}
function p1e(t, e, r, n) {
  return t === "expected"
    ? { samplingRatio: 1, samplingReason: "expected" }
    : t !== "success"
      ? { samplingRatio: 1, samplingReason: "abnormal" }
      : e.untrackedStatusCommandCount > 1
        ? { samplingRatio: 1, samplingReason: "repeated-untracked-scan" }
        : e.concurrentOperationCount >= 4
          ? { samplingRatio: 1, samplingReason: "concurrency" }
          : r >= 7e3
            ? { samplingRatio: 1, samplingReason: "slow" }
            : n() >= 0.05
              ? null
              : { samplingRatio: 0.05, samplingReason: "routine" };
}
function pFt({
  canceled: t,
  canceledCommandCount: e,
  failedCommandCount: r,
  outputLimitExceededCount: n,
  result: o,
  resultDisposition: i,
  resultFields: s,
  timedOutCommandCount: a,
}) {
  if (t || (r > 0 && e === r && n === 0 && a === 0)) return "canceled";
  if (i === "stale_snapshot") return "stale";
  if (r > 0 || o == null) return "failure";
  switch (o.operation) {
    case "branch-diff-stats":
      return "success";
    case "review-diff":
    case "review-source-line-counts":
    case "review-summary":
      return (s ?? Ys(o)).outcome;
    case "review-patch":
      return o.result.diff.type === "error" ? "failure" : "success";
    case "review-search":
    case "status-summary":
      return o.result.type === "error" ? "failure" : "success";
  }
}
function mFt({
  attribution: t,
  canceled: e,
  expectedReason: r,
  outcome: n,
  resultFailureReason: o,
}) {
  return n === "success"
    ? null
    : e
      ? "canceled"
      : t.timedOutCommandCount > 0
        ? "command_timeout"
        : t.outputLimitExceededCount > 0
          ? "command_output_limit"
          : t.failedCommandCount > 0
            ? t.canceledCommandCount === t.failedCommandCount
              ? "command_canceled"
              : "command_failure"
            : (r ?? o);
}
function fFt({ result: t, resultDisposition: e }) {
  if (e === "canceled") return null;
  if (e === "stale_snapshot") return "stale_snapshot";
  if (e === "git_unavailable") return "repository_unavailable";
  if (t == null) return "missing_result";
  switch (t.operation) {
    case "branch-diff-stats":
      return null;
    case "review-diff": {
      let r = Ys(t).outcome;
      return r === "stale" ? "stale_snapshot" : r === "failure" ? "review_diff_error" : null;
    }
    case "review-patch":
      return t.result.diff.type === "error" ? "review_patch_error" : null;
    case "review-search":
      return t.result.type === "error" ? "review_search_error" : null;
    case "review-source-line-counts":
      for (let r of t.result)
        if (r.type === "error") return r.failureReason ?? "review_summary_error";
      return null;
    case "review-summary":
      return t.result.type === "error" ? (t.result.failureReason ?? "review_summary_error") : null;
    case "status-summary":
      return t.result.type === "error" ? (t.result.failureReason ?? "status_summary_error") : null;
  }
}
function m1e(t) {
  return t == null
    ? "unknown"
    : t < 1048576
      ? "lt_1mb"
      : t < 10485760
        ? "lt_10mb"
        : t < 52428800
          ? "lt_50mb"
          : "gte_50mb";
}
function hFt(t) {
  return t.untrackedCacheCoalescedCount > 0
    ? "coalesced"
    : t.untrackedCacheHitCount > 0 && t.untrackedCacheMissCount > 0
      ? "mixed"
      : t.untrackedCacheHitCount > 0
        ? "hit"
        : t.untrackedCacheMissCount > 0
          ? "miss"
          : "none";
}
function Ys(t) {
  if (t == null)
    return {
      additions: null,
      deletions: null,
      diffBytes: null,
      fileCount: null,
      matchCount: null,
      outcome: "failure",
      truncated: !1,
      untrackedFileCount: null,
    };
  switch (t.operation) {
    case "branch-diff-stats":
      return {
        additions: t.result?.additions ?? 0,
        deletions: t.result?.deletions ?? 0,
        diffBytes: null,
        fileCount: t.result?.fileCount ?? 0,
        matchCount: null,
        outcome: "success",
        truncated: !1,
        untrackedFileCount: null,
      };
    case "review-diff": {
      if (t.result.type === "stale-snapshot") return { ...Ys(void 0), outcome: "stale" };
      let e = 0,
        r = 0,
        n = "success",
        o = !1;
      for (let i in t.result.diffs) {
        let s = t.result.diffs[i];
        if (s != null) {
          if (((r += 1), s.type === "success")) {
            e += s.diffBytes;
            continue;
          }
          ((n = "failure"), (o = o || s.error.type === "diff-too-large"));
        }
      }
      return {
        additions: null,
        deletions: null,
        diffBytes: e,
        fileCount: r,
        matchCount: null,
        outcome: n,
        truncated: o,
        untrackedFileCount: null,
      };
    }
    case "review-patch":
      return t.result.diff.type === "error"
        ? { ...Ys(void 0), truncated: t.result.diff.error.type === "diff-too-large" }
        : {
            additions: null,
            deletions: null,
            diffBytes: t.result.diff.unifiedDiffBytes ?? null,
            fileCount: null,
            matchCount: null,
            outcome: "success",
            truncated: !1,
            untrackedFileCount: null,
          };
    case "review-search":
      return t.result.type === "error"
        ? Ys(void 0)
        : {
            additions: null,
            deletions: null,
            diffBytes: null,
            fileCount: null,
            matchCount: t.result.totalMatches,
            outcome: "success",
            truncated: t.result.isCapped,
            untrackedFileCount: null,
          };
    case "review-source-line-counts": {
      let e = 0,
        r = 0,
        n = "success",
        o = !1;
      for (let i of t.result)
        i.type === "success"
          ? ((e += i.additions), (r += i.deletions))
          : i.type === "error"
            ? (n = "failure")
            : i.type === "expected" && n !== "failure"
              ? (n = "expected")
              : i.type === "incomplete" && (o = !0);
      return {
        additions: e,
        deletions: r,
        diffBytes: null,
        fileCount: null,
        matchCount: null,
        outcome: n,
        truncated: o,
        untrackedFileCount: null,
      };
    }
    case "review-summary":
      if (t.result.type === "error") return Ys(void 0);
      if (t.result.type === "expected") return { ...Ys(void 0), outcome: "expected" };
      {
        let e = 0,
          r = 0;
        for (let n of t.result.files) ((e += n.additions ?? 0), (r += n.deletions ?? 0));
        return {
          additions: e,
          deletions: r,
          diffBytes: null,
          fileCount: t.result.files.length,
          matchCount: null,
          outcome: "success",
          truncated: !1,
          untrackedFileCount: t.result.stageCounts.untrackedFileCount,
        };
      }
    case "status-summary":
      return t.result.type === "error"
        ? Ys(void 0)
        : {
            additions: null,
            deletions: null,
            diffBytes: null,
            fileCount:
              t.result.stagedCount + t.result.unstagedCount + (t.result.untrackedCount ?? 0),
            matchCount: null,
            outcome: "success",
            truncated: !1,
            untrackedFileCount: t.result.untrackedCount,
          };
  }
}
var xN,
  f1e = g(() => {
    xN = class {
      constructor(e) {
        this.emit = e;
      }
      snapshots = new Map();
      record({
        changeType: e,
        changedPathCount: r,
        filteredPathCount: n,
        fullInvalidation: o,
        hostKind: i,
        invalidated: s,
        rawEventCount: a,
        repoIndexSizeBucket: l,
        refreshFanoutCount: c,
        requiresRecovery: u,
      }) {
        let p = `${i}:${l}:${e}`,
          m = this.snapshots.get(p);
        if (m == null) {
          let f = Date.now(),
            h = setTimeout(() => {
              this.flush(p);
            }, 1e4);
          (h.unref?.(),
            (m = {
              changeType: e,
              changedPathCount: 0,
              coalescedBatchCount: 0,
              filteredPathCount: 0,
              fullInvalidationCount: 0,
              hostKind: i,
              invalidationCount: 0,
              rawEventCount: 0,
              repoIndexSizeBucket: l,
              refreshFanoutCount: 0,
              requiresRecoveryCount: 0,
              snapshotDurationMs: 0,
              startedAtMs: f,
              timer: h,
            }),
            this.snapshots.set(p, m));
        }
        ((m.changedPathCount += r),
          (m.coalescedBatchCount += 1),
          (m.filteredPathCount += n),
          (m.fullInvalidationCount += o ? 1 : 0),
          (m.invalidationCount += s ? 1 : 0),
          (m.rawEventCount += a),
          (m.refreshFanoutCount += c),
          (m.requiresRecoveryCount += u ? 1 : 0),
          m.rawEventCount >= 512 && this.flush(p));
      }
      flush(e) {
        let r = this.snapshots.get(e);
        r != null &&
          (this.snapshots.delete(e),
          clearTimeout(r.timer),
          this.emit({
            type: "git-performance-watcher-snapshot",
            changeType: r.changeType,
            changedPathCount: r.changedPathCount,
            coalescedBatchCount: r.coalescedBatchCount,
            filteredPathCount: r.filteredPathCount,
            fullInvalidationCount: r.fullInvalidationCount,
            hostKind: r.hostKind,
            invalidationCount: r.invalidationCount,
            rawEventCount: r.rawEventCount,
            repoIndexSizeBucket: r.repoIndexSizeBucket,
            refreshFanoutCount: r.refreshFanoutCount,
            requiresRecoveryCount: r.requiresRecoveryCount,
            snapshotDurationMs: Date.now() - r.startedAtMs,
          }));
      }
    };
  });
var y1e = A((IXr, g1e) => {
  var h1e = Rp(),
    gFt = 4294967295,
    yFt = gFt - 1,
    vFt = Math.floor,
    bFt = Math.min;
  function SFt(t, e, r, n) {
    var o = 0,
      i = t == null ? 0 : t.length;
    if (i === 0) return 0;
    e = r(e);
    for (var s = e !== e, a = e === null, l = h1e(e), c = e === void 0; o < i; ) {
      var u = vFt((o + i) / 2),
        p = r(t[u]),
        m = p !== void 0,
        f = p === null,
        h = p === p,
        v = h1e(p);
      if (s) var y = n || h;
      else
        c
          ? (y = h && (n || m))
          : a
            ? (y = h && m && (n || !f))
            : l
              ? (y = h && m && !f && (n || !v))
              : f || v
                ? (y = !1)
                : (y = n ? p <= e : p < e);
      y ? (o = u + 1) : (i = u);
    }
    return bFt(i, yFt);
  }
  g1e.exports = SFt;
});
var b1e = A((kXr, v1e) => {
  var wFt = y1e(),
    _Ft = ww(),
    xFt = Rp(),
    AFt = 4294967295,
    RFt = AFt >>> 1;
  function EFt(t, e, r) {
    var n = 0,
      o = t == null ? n : t.length;
    if (typeof e == "number" && e === e && o <= RFt) {
      for (; n < o; ) {
        var i = (n + o) >>> 1,
          s = t[i];
        s !== null && !xFt(s) && (r ? s <= e : s < e) ? (n = i + 1) : (o = i);
      }
      return o;
    }
    return wFt(t, e, _Ft, r);
  }
  v1e.exports = EFt;
});
var T5 = A((DXr, S1e) => {
  var CFt = b1e();
  function TFt(t, e) {
    return CFt(t, e);
  }
  S1e.exports = TFt;
});
async function w1e(t) {
  return nl(t, "HEAD");
}
var _1e = g(() => {
  Ky();
});
async function x1e(t, e) {
  let r = ne(t.root, t.host, "git-dir"),
    n = ne(t.root, t.host, "git-path", "HEAD"),
    o = ne(t.root, t.host, "git-path", "index"),
    i = ne(t.root, t.host, "git-path", aA);
  if ([r, n, o, i].some((m) => t.queryClient.getQueryState(m) != null)) return null;
  let { success: s, stdout: a } = await I(
    t.root,
    [
      "rev-parse",
      "--git-dir",
      "--git-path",
      "HEAD",
      "--git-path",
      "index",
      "--git-path",
      aA,
      "--symbolic-full-name",
      "HEAD",
    ],
    t.host,
    { signal: e },
  );
  if (!s || !a) return null;
  let l = a.split(/\r?\n/);
  if (
    l.length !== 5 ||
    l.some((m) => m.length === 0) ||
    (l[4] !== "HEAD" && (!l[4].startsWith("refs/heads/") || l[4] === "refs/heads/"))
  )
    return null;
  let c = await t.host.platformPath(),
    u = PFt(c, t.root, l[0]),
    p = {
      gitDir: u,
      headPath: P5(c, t.root, u, l[1]),
      headRef: l[4].startsWith("refs/heads/") ? l[4] : null,
      indexPath: P5(c, t.root, u, l[2]),
      syncedBranchPath: P5(c, t.root, u, l[3]),
    };
  return (
    t.queryClient.setQueryData(r, p.gitDir),
    t.queryClient.setQueryData(n, p.headPath),
    t.queryClient.setQueryData(o, p.indexPath),
    t.queryClient.setQueryData(i, p.syncedBranchPath),
    p
  );
}
function PFt(t, e, r) {
  return t.isAbsolute(r) ? r : t.join(e, r);
}
function P5(t, e, r, n) {
  return t.isAbsolute(n) ? n : n.startsWith(".git/") ? t.join(e, n) : t.join(r, n);
}
var A1e = g(() => {
  je();
  fe();
  ad();
});
async function R1e(t, { defaultAttributesFile: e, defaultExcludesFile: r, globalConfigFiles: n }) {
  let [o, i, s, a, l] = await Promise.all([
      I(t.root, ["var", "GIT_CONFIG_SYSTEM"], t.host, {
        trim: !1,
        allowedNonZeroExitCodes: [1, 129],
        maxOutputBytes: IA,
        timeoutMs: 6e4,
      }),
      I(
        t.root,
        ["config", "--includes", "--null", "--show-origin", "--path", "--get-regexp", IFt],
        t.host,
        { trim: !1, allowedNonZeroExitCodes: [1], maxOutputBytes: IA, env: { GIT_CONFIG: void 0 } },
      ),
      I(t.root, ["rev-parse", "--git-path", "config"], t.host, { trim: !1, maxOutputBytes: IA }),
      I(t.root, ["rev-parse", "--git-path", "config.worktree"], t.host, {
        trim: !1,
        maxOutputBytes: IA,
      }),
      t.host.platformPath(),
    ]),
    c =
      o.code === 129
        ? await I(
            t.root,
            ["config", "--includes", "--null", "--show-origin", "--name-only", "--list"],
            t.host,
            { trim: !1, maxOutputBytes: IA, env: { GIT_CONFIG: void 0 } },
          )
        : null;
  if (!o.success || !i.success || !s.success || !a.success || (c != null && !c.success))
    throw new Error("Failed to discover Git ignore configuration files");
  let u = (v, y = t.root) => (l.isAbsolute(v) ? v : `${y}${y.endsWith(l.sep) ? "" : l.sep}${v}`),
    p = new Set(
      [
        ...n,
        ...(o.code === 0 &&
        o.stdout !==
          `
`
          ? [I5(o.stdout)]
          : []),
        I5(s.stdout),
        I5(a.stdout),
      ].map((v) => u(v)),
    );
  if (c != null) {
    p.add("/etc/gitconfig");
    let v = c.stdout.split("\0");
    if (v.pop() !== "" || v.length % 2 !== 0)
      throw new Error("Invalid Git configuration origin output");
    for (let y = 0; y < v.length; y += 2) {
      let w = v[y];
      w?.startsWith("file:") && p.add(u(w.slice(5)));
    }
  }
  let m = r == null ? null : u(r),
    f = e == null ? null : u(e),
    h = i.stdout.split("\0");
  if (h.pop() !== "" || h.length % 2 !== 0)
    throw new Error("Invalid Git ignore configuration output");
  for (let v = 0; v < h.length; v += 2) {
    let y = h[v],
      w = h[v + 1];
    if (
      y == null ||
      w == null ||
      !w.includes(`
`)
    )
      throw new Error("Invalid Git ignore configuration output");
    let _ = w.indexOf(`
`),
      S = w.slice(0, _),
      E = w.slice(_ + 1),
      T = y.startsWith("file:") ? u(y.slice(5)) : null;
    (T != null && p.add(T),
      S === "core.excludesfile"
        ? (m = E === "" ? null : u(E))
        : S === "core.attributesfile"
          ? (f = E === "" ? null : u(E))
          : E !== "" && p.add(u(E, T == null ? t.root : l.dirname(T))));
  }
  return { attributesFile: f, ignoreFile: m, configFiles: [...p].sort() };
}
function I5(t) {
  if (
    !t.endsWith(`
`) ||
    t.length === 1
  )
    throw new Error("Invalid Git configuration path output");
  return t.slice(0, -1);
}
var IA,
  IFt,
  E1e = g(() => {
    fe();
    ((IA = 1024 * 1024),
      (IFt = "^(core\\.(excludesfile|attributesfile)|include(if\\..*)?\\.path)$"));
  });
async function T1e(t, e) {
  if (e != null) return DFt(t, e);
  let [r, n] = await Promise.all([oA(t, [":(glob)**/"], AN), t.host.platformPath()]);
  if (!r.success) throw new Error("Failed to read Git watcher ignored directories");
  let o = r.ignoredPaths.filter((p) => p.endsWith("/")).map((p) => p.slice(0, -1));
  if (o.length === 0) return [];
  let i = new Set();
  for (let p of o) {
    let m = p;
    for (; m !== "." && !i.has(m); ) (i.add(m), (m = n.dirname(m)));
  }
  let s = new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 }),
    a = "",
    l = !1;
  function c(p) {
    if (l) return;
    let m;
    try {
      m = s.decode(p, { stream: p != null });
    } catch {
      l = !0;
      return;
    }
    let f = (a + m).split("\0");
    a = f.pop() ?? "";
    for (let h of f) i.delete(h);
  }
  let u = await I(t.root, ["ls-files", "--cached", "-z", "--"], t.host, {
    collectOutput: !1,
    onStdoutRaw: c,
  });
  if ((c(), !u.success || l || a !== ""))
    throw new Error("Failed to read Git watcher ignored directories");
  return o
    .filter((p) => {
      let m = p;
      for (; m !== "."; ) {
        if (!i.has(m)) return !1;
        m = n.dirname(m);
      }
      return !0;
    })
    .map((p) => n.join(t.root, p))
    .sort();
}
async function DFt(t, e) {
  if (e.length === 0) return [];
  let r = e.map((u) => u.slice(0, -1)),
    n = async (u) => {
      let p = await iK(t, u, AN);
      if (!p.success) throw new Error("Failed to read Git watcher tracked paths");
      return p.paths;
    },
    o = async (u) => {
      let p = await oA(t, u, AN);
      if (!p.success) throw new Error("Failed to read Git watcher ignored directories");
      return p.ignoredPaths;
    },
    [i, s] = await Promise.all([C1e(MFt(r), n), t.host.platformPath()]);
  i.sort();
  let a = (u) => {
      let p = `${u}/`;
      if (i[(0, k5.default)(i, p)]?.startsWith(p)) return !1;
      let m = u;
      for (; m !== "."; ) {
        if (i[(0, k5.default)(i, m)] === m) return !1;
        m = s.dirname(m);
      }
      return !0;
    },
    l = new Set(r.filter(a)),
    c = await C1e(
      [...l].map((u) => `:(glob)${I1e(u)}/*/`),
      o,
    );
  return [...new Set(c)]
    .filter((u) => u.endsWith("/"))
    .map((u) => u.slice(0, -1))
    .filter((u) => l.has(u))
    .map((u) => s.join(t.root, u))
    .sort();
}
async function P1e(t, e) {
  let r = await oA(
    t,
    e.map((n) => `:(literal)${n}`),
    AN,
  );
  return r.success ? r.ignoredPaths.filter((n) => n.endsWith("/")) : [];
}
function MFt(t) {
  let e = new Set();
  for (let r of t) {
    e.add(`:(literal)${r}`);
    for (let n = r.indexOf("/"); n !== -1; n = r.indexOf("/", n + 1)) {
      let o = I1e(r.slice(0, n));
      e.add(`:(glob)${o}*`);
    }
  }
  return e;
}
function I1e(t) {
  return t.replace(/[\\*?[]/gu, "\\$&");
}
async function C1e(t, e) {
  let r = [],
    n = [],
    o = 0;
  for (let i of t) {
    let s = Qn(i) + 1;
    (n.length > 0 && o + s > kFt && (r.push(await e(n)), (n = []), (o = 0)), n.push(i), (o += s));
  }
  return (n.length > 0 && r.push(await e(n)), r.flat());
}
var k5,
  kFt,
  AN,
  k1e = g(() => {
    k5 = F(T5());
    Ny();
    xO();
    fe();
    ((kFt = 32768),
      (AN = {
        GIT_LITERAL_PATHSPECS: "0",
        GIT_ICASE_PATHSPECS: "0",
        GIT_GLOB_PATHSPECS: "0",
        GIT_NOGLOB_PATHSPECS: "0",
      }));
  });
var RN,
  D1e = g(() => {
    RN = class {
      constructor(e) {
        this.options = e;
      }
      generation = 0;
      snapshot = null;
      readPromise = null;
      refreshPromise = null;
      refreshRequested = !1;
      reconciliationRequested = !1;
      refreshTimer = null;
      failed = !1;
      disposed = !1;
      get requiresRecovery() {
        return this.failed;
      }
      requestRefresh({ reconcileUnchangedCoverage: e = !0 } = {}) {
        this.disposed ||
          ((this.generation += 1),
          (this.refreshRequested = !0),
          (this.reconciliationRequested = this.reconciliationRequested || e),
          this.scheduleRefresh());
      }
      read({ refresh: e = !1 } = {}) {
        if (
          (e && ((this.snapshot = null), (this.refreshRequested = !1)),
          this.snapshot != null && this.isCurrent(this.snapshot))
        )
          return Promise.resolve(this.snapshot);
        if (this.readPromise != null) return this.readPromise;
        let r = this.generation,
          n = this.options
            .readIgnoredDirectories()
            .then((o) => {
              let i = { generation: r, directories: o };
              return (this.isCurrent(i) && (this.snapshot = i), i);
            })
            .catch((o) => {
              throw (this.setFailed(!0), o);
            })
            .finally(() => {
              this.readPromise === n && (this.readPromise = null);
            });
        return ((this.readPromise = n), n);
      }
      isCurrent(e) {
        return !this.disposed && e.generation === this.generation;
      }
      didApply(e) {
        if (!this.isCurrent(e)) return !1;
        let r = this.reconciliationRequested || this.failed;
        return ((this.reconciliationRequested = !1), this.setFailed(!1), r);
      }
      async dispose() {
        ((this.disposed = !0),
          this.refreshTimer != null && clearTimeout(this.refreshTimer),
          await Promise.allSettled([this.readPromise, this.refreshPromise]));
      }
      setFailed(e) {
        this.disposed ||
          this.failed === e ||
          ((this.failed = e), this.options.onRequiresRecoveryChanged());
      }
      scheduleRefresh() {
        this.disposed ||
          this.refreshTimer != null ||
          this.refreshPromise != null ||
          (this.refreshTimer = setTimeout(
            () => {
              ((this.refreshTimer = null), (this.refreshRequested = !1));
              let e = this.options
                .refresh()
                .catch(() => this.setFailed(!0))
                .finally(() => {
                  ((this.refreshPromise = null),
                    (this.refreshRequested || this.failed) && this.scheduleRefresh());
                });
              this.refreshPromise = e;
            },
            this.failed ? 6e4 : 1e3,
          ));
      }
    };
  });
function M5(t) {
  return { readPolicy: "skip_unobserved", afterCapture: () => t };
}
function Tc(t, e, r) {
  let n = t.relative(e, r);
  return n === "" || (n !== ".." && !n.startsWith(`..${t.sep}`) && !t.isAbsolute(n));
}
function O1e(t, e) {
  let r = t.resolve(e),
    n = t.sep === "\\" ? r.toLowerCase() : r;
  return n.endsWith(t.sep) ? n : `${n}${t.sep}`;
}
function O5(t, e, r) {
  return !r.endsWith(".lock") && Tc(t, e, r);
}
function N1e(t, e, r) {
  if (!Tc(t, e, r)) return !1;
  let n = t.relative(e, r);
  if (n === "") return !0;
  let o = n.split(t.sep);
  return o.length === 1 || (o.length === 2 && FFt.has(o[1]));
}
function $Ft(t) {
  return t.some((e) => e === !0) ? !0 : t.some((e) => e == null) ? null : !1;
}
function N5(t) {
  return (
    typeof t == "object" &&
    t != null &&
    "code" in t &&
    (t.code === "ENOENT" || t.code === "ENOTDIR")
  );
}
var L1e,
  OFt,
  D5,
  NFt,
  M1e,
  LFt,
  BFt,
  FFt,
  EN,
  B1e = g(() => {
    L1e = F(T5());
    O();
    hr();
    Gi();
    Wm();
    _1e();
    tA();
    A1e();
    E1e();
    k1e();
    ad();
    D1e();
    ((OFt = 1e3),
      (D5 = 64),
      (NFt = 6e4),
      (M1e = 1e3),
      (LFt = 6e4),
      (BFt = 3e4),
      (FFt = new Set(["HEAD", "commondir", "gitdir", "locked"])),
      (EN = class {
        constructor(e) {
          this.options = e;
          this.ignorePolicy = e.watchIgnoreSources
            ? new RN({
                readIgnoredDirectories: () => this.readIgnoredDirectories(),
                refresh: () => this.refreshWorkingTreeWatchPolicy(),
                onRequiresRecoveryChanged: () => this.updateRequiresRecovery(),
              })
            : null;
        }
        logger = Dt("git-repo-watcher");
        watchTargets = [];
        pendingChangeCounts = {
          config: 0,
          head: 0,
          index: 0,
          "local-refs": 0,
          "remote-refs": 0,
          "synced-branch": 0,
          "worktree-topology": 0,
          "working-tree": 0,
        };
        changeTimers = new Map();
        activeChangeEmissions = new Set();
        pendingTurnContextChanges = new Set();
        turnContextObservation = null;
        turnHeadLockPath = null;
        turnHeadLockChange = null;
        pathApi = null;
        gitDir = null;
        currentHeadRefPath = null;
        currentHeadRefKnown = !1;
        lastRequiresRecovery = null;
        disposed = !1;
        disposePromise = null;
        pendingWorkingTreePaths = new Set();
        changedMetadataDirectories = new Set();
        metadataRefreshPromise = null;
        worktreeTopologyEnabled = !1;
        ignorePolicy;
        workingTreeIgnoredDirectories = [];
        workingTreeSample = new Set();
        pendingIgnoreProbe = [];
        nextIgnoreProbeAt = 0;
        observedIgnoredDirectories = new Set();
        ignoreSourceWatches = new Map();
        changedIgnoreSourcePaths = new Set();
        get requiresRecovery() {
          return (
            this.ignorePolicy?.requiresRecovery === !0 ||
            this.watchTargets.some(
              (e) =>
                !e.metadataDirectory?.missing &&
                (e.session == null || (e.recursive && !e.session.coverage.recursive)),
            )
          );
        }
        observeIgnoredDirectories(e) {
          let r = this.pathApi;
          this.ignorePolicy == null ||
            !this.options.watchIgnoreSources?.pruneIgnoredDirectories ||
            r == null ||
            (this.rememberIgnoredDirectories(e, r) && this.ignorePolicy.requestRefresh());
        }
        rememberIgnoredDirectories(e, r) {
          let n = !1;
          for (let o of e) {
            let i = r.join(this.options.root, ...o.split("/"));
            if (
              !(
                this.observedIgnoredDirectories.has(o) ||
                this.workingTreeIgnoredDirectories.some((s) => Tc(r, s, i))
              )
            ) {
              if (
                (this.observedIgnoredDirectories.add(structuredClone(o)),
                this.observedIgnoredDirectories.size > 1024)
              ) {
                let s = this.observedIgnoredDirectories.values().next().value;
                s != null && this.observedIgnoredDirectories.delete(s);
              }
              n = !0;
            }
          }
          return n;
        }
        async observeTurnGitContext() {
          if (this.disposed || this.requiresRecovery || this.watchTargets.length === 0)
            return M5("watch_unavailable");
          if (this.pendingTurnContextChanges.size > 0) return M5("change_pending");
          let e = this.turnContextObservation ?? { state: "watching" };
          this.turnContextObservation = e;
          let r = this.turnHeadLockChange;
          return r != null && (await this.gitPathExists(r.path, { bypassCache: !0 })) !== !1
            ? M5("change_pending")
            : {
                get readPolicy() {
                  return e.state !== "watching"
                    ? "skip_unobserved"
                    : r == null
                      ? "share_watched"
                      : "after_head_lock";
                },
                afterCapture: () => e.state,
              };
        }
        invalidateTurnContext(e) {
          let r = this.turnContextObservation;
          r != null &&
            ((this.turnContextObservation = null),
            (r.state = e),
            this.options.onTurnContextInvalidated?.(e));
        }
        async start() {
          if (this.disposed) return;
          if ((this.logger.info("Starting git repo watcher"), this.watchTargets.length > 0)) {
            await this.retryInactiveWatchTargets();
            return;
          }
          let e = await this.options.host.platformPath();
          this.pathApi = e;
          let [r, n, o, i, s] = await jt(
            {
              attributes: { "git.host_kind": this.options.host.isLocal ? "local" : "remote" },
              name: "git.watcher_metadata",
              op: "codex.git.watcher_metadata",
            },
            async () => {
              let y = await x1e(this.options.worktreeRepo);
              return y == null
                ? Promise.all([
                    w1e(this.options.worktreeRepo),
                    Hm(this.options.worktreeRepo),
                    _Le(this.options.worktreeRepo),
                    us(this.options.worktreeRepo),
                    wc(this.options.worktreeRepo),
                  ])
                : [
                    y.headPath,
                    y.indexPath,
                    y.syncedBranchPath,
                    y.gitDir,
                    y.headRef == null
                      ? { type: "detached" }
                      : { type: "branch", branch: y.headRef.slice(11) },
                  ];
            },
          );
          if (this.disposed) return;
          ((this.gitDir = i),
            (this.turnHeadLockPath = r == null ? null : r + ".lock"),
            (this.currentHeadRefPath =
              s.type !== "branch"
                ? null
                : e.join(this.options.commonDir, "refs", "heads", ...s.branch.split("/"))),
            (this.currentHeadRefKnown = s.type !== "unknown"),
            this.addWatchTarget(e, r, "head"));
          let a = e.join(this.options.commonDir, "HEAD");
          (a !== r && this.addWatchTarget(e, a, "head"),
            this.addWatchTarget(e, n, "index"),
            this.addWatchTarget(e, e.join(this.options.commonDir, "FETCH_HEAD"), "remote-refs"),
            this.addWatchTarget(e, e.join(this.options.commonDir, "packed-refs"), "remote-refs"));
          let l = e.join(this.options.commonDir, "refs", "heads"),
            c = e.join(this.options.commonDir, "refs");
          (this.addDirectoryWatchTarget(c, "head", (y) => y === l, !1, this.options.commonDir),
            this.addDirectoryWatchTarget(
              c,
              "local-refs",
              (y) => y === l,
              !1,
              this.options.commonDir,
            ),
            this.addDirectoryWatchTarget(
              l,
              "head",
              (y, w) => O5(e, l, y) && this.isHeadRefPath(e, l, y, w),
              !0,
              c,
            ),
            this.addDirectoryWatchTarget(
              l,
              "local-refs",
              (y, w) => O5(e, l, y) && !this.isHeadRefPath(e, l, y, w),
              !0,
              c,
            ));
          let u = e.join(c, "remotes");
          (this.addDirectoryWatchTarget(
            c,
            "remote-refs",
            (y) => y === u,
            !1,
            this.options.commonDir,
          ),
            this.addDirectoryWatchTarget(u, "remote-refs", (y) => O5(e, u, y), !0, c),
            this.addWatchTarget(e, e.join(this.options.commonDir, "config"), "config"),
            this.addWatchTarget(e, e.join(this.options.commonDir, "shallow"), "config"));
          let p = e.join(this.options.commonDir, "info"),
            m = e.join(p, "exclude"),
            f = e.join(p, "attributes");
          (this.addDirectoryWatchTarget(
            p,
            "config",
            (y) => y === m || y === f,
            !1,
            this.options.commonDir,
          ),
            i != null && this.addWatchTarget(e, e.join(i, "config.worktree"), "config"),
            this.addWatchTarget(e, o, "synced-branch"));
          let h = e.join(this.options.commonDir, "worktrees");
          (this.addDirectoryWatchTarget(
            this.options.commonDir,
            "worktree-topology",
            (y) => y === h,
            !1,
          ),
            this.addDirectoryWatchTarget(
              h,
              "worktree-topology",
              (y) => N1e(e, h, y),
              !1,
              this.options.commonDir,
            ));
          let v = e.join(this.options.root, ".git");
          if (
            (this.addDirectoryWatchTarget(
              this.options.root,
              "working-tree",
              (y) =>
                !Tc(e, this.options.commonDir, y) && (v === this.options.commonDir || !Tc(e, v, y)),
            ),
            i != null && e.dirname(i) === h)
          ) {
            let y = this.watchTargets.find((w) => w.watchPath === i);
            y != null && (y.metadataDirectory = { parentPath: h, missing: !1 });
          }
          (await jt(
            {
              attributes: {
                "git.host_kind": this.options.host.isLocal ? "local" : "remote",
                "git.watcher_target_count": this.watchTargets.length,
              },
              name: "git.watcher_targets",
              op: "codex.git.watcher_targets",
            },
            () => Promise.all(this.watchTargets.map((y) => this.tryStartWatchSession(y, !1))),
          ),
            await this.refreshMetadataDirectories([], !1),
            this.options.watchIgnoreSources?.pruneIgnoredDirectories === !1 &&
              this.ignorePolicy?.requestRefresh());
        }
        async enableWorktreeTopology() {
          if (this.worktreeTopologyEnabled) {
            await this.metadataRefreshPromise;
            return;
          }
          ((this.worktreeTopologyEnabled = !0),
            await this.refreshMetadataDirectories([], !1),
            this.options.worktreeRepo.invalidateGitReadCachesForRepoChange("worktree-topology"));
        }
        async retryInactiveWatchTargets() {
          await Promise.all(
            this.watchTargets.map(async (e) => {
              e.session == null &&
                !e.metadataDirectory?.missing &&
                (await this.tryStartWatchSession(e, !0));
            }),
          );
        }
        async readIgnoredDirectories() {
          let e = this.options.watchIgnoreSources;
          if (e == null) return [];
          let r = await e.getEnvironment(),
            n = !1;
          for (; !this.disposed; ) {
            let o = await R1e(this.options.worktreeRepo, r),
              i = await e.getWatchTargets([
                ...o.configFiles,
                ...(o.ignoreFile == null ? [] : [o.ignoreFile]),
                ...(o.attributesFile == null ? [] : [o.attributesFile]),
              ]);
            if (this.disposed) return [];
            let s = await this.updateIgnoreSourceWatches(i);
            if (this.disposed) return [];
            if (!s) {
              if (e.pruneIgnoredDirectories) {
                if (this.pendingIgnoreProbe.length > 0 && this.pathApi != null) {
                  let a = this.pendingIgnoreProbe;
                  this.pendingIgnoreProbe = [];
                  let l = await P1e(this.options.worktreeRepo, a);
                  if (this.disposed) return [];
                  this.rememberIgnoredDirectories(l, this.pathApi);
                }
                return T1e(
                  this.options.worktreeRepo,
                  e.pruneIgnoredDirectories === "observed"
                    ? [...this.observedIgnoredDirectories]
                    : void 0,
                );
              }
              return (n && this.handleFileWatchEvent("config"), []);
            }
            n = !0;
          }
          return [];
        }
        async updateIgnoreSourceWatches(e) {
          let r = [...this.changedIgnoreSourcePaths];
          this.changedIgnoreSourcePaths.clear();
          let n = [],
            o = !1;
          for (let [i, s] of this.ignoreSourceWatches) {
            if (e.has(i) && this.watchTargets.includes(s.target)) continue;
            ((o = !0), this.ignoreSourceWatches.delete(i));
            let a = s.target.handlers.indexOf(s.handler);
            if ((s.target.handlers.splice(a, 1), s.target.handlers.length === 0)) {
              let l = this.watchTargets.indexOf(s.target);
              (l !== -1 && this.watchTargets.splice(l, 1), n.push(this.disposeSession(s.target)));
            }
          }
          for (let [i, s] of e) {
            let a = this.ignoreSourceWatches.get(i);
            if (a != null) {
              (a.paths.size !== s.size || [...s].some((p) => !a.paths.has(p))) &&
                ((o = !0), a.paths.clear(), s.forEach((p) => a.paths.add(p)));
              let u = this.pathApi;
              u != null &&
                a.target.retryTimer == null &&
                r.some((p) => Tc(u, p, i)) &&
                ((o = !0),
                n.push(
                  this.disposeSession(a.target, !0).then(() =>
                    this.tryStartWatchSession(a.target, !0),
                  ),
                ));
              continue;
            }
            o = !0;
            let l = { changeType: "config", shouldHandleChangedPath: (u) => s.has(u) },
              c = this.addWatchHandler(i, !1, l, null);
            (this.ignoreSourceWatches.set(i, { target: c, handler: l, paths: s }),
              n.push(this.tryStartWatchSession(c, !1)));
          }
          return (await Promise.all(n), o);
        }
        async refreshWorkingTreeWatchPolicy() {
          let e = this.ignorePolicy,
            r = this.watchTargets.find((o) =>
              o.handlers.some((i) => i.changeType === "working-tree"),
            );
          if (e == null || r == null) return;
          if (!this.options.watchIgnoreSources?.pruneIgnoredDirectories) {
            let o = await e.read({ refresh: !0 });
            e.didApply(o) && this.handleFileWatchEvent("config");
            return;
          }
          if ((await r.sessionStartPromise, this.disposed || r.retryTimer != null)) return;
          let n = await e.read({ refresh: !0 });
          if (
            (await r.sessionStartPromise,
            !(this.disposed || !e.isCurrent(n) || r.retryTimer != null))
          ) {
            if (
              r.session != null &&
              n.directories.length === this.workingTreeIgnoredDirectories.length &&
              n.directories.every((o, i) => o === this.workingTreeIgnoredDirectories[i])
            ) {
              e.didApply(n) && this.handleFileWatchEvent("working-tree");
              return;
            }
            (await this.disposeSession(r),
              this.disposed || (await this.tryStartWatchSession(r, !0)));
          }
        }
        dispose() {
          if (this.disposePromise != null) return this.disposePromise;
          ((this.disposed = !0), this.invalidateTurnContext("watch_unavailable"));
          let e = this.ignorePolicy?.dispose(),
            r = this.watchTargets.map((n) => this.disposeSession(n));
          return (
            (this.watchTargets.length = 0),
            this.changeTimers.forEach((n) => {
              clearTimeout(n);
            }),
            this.changeTimers.clear(),
            this.changedMetadataDirectories.clear(),
            this.ignoreSourceWatches.clear(),
            this.changedIgnoreSourcePaths.clear(),
            (this.disposePromise = Promise.all([...r, this.metadataRefreshPromise, e]).then(
              () => {},
            )),
            this.disposePromise
          );
        }
        refreshMetadataDirectories(e, r = !0) {
          let n = this.pathApi;
          if (this.disposed || n == null) return Promise.resolve();
          let o = n.join(this.options.commonDir, "refs"),
            i = n.join(this.options.commonDir, "worktrees"),
            s =
              e.length === 0
                ? [this.options.commonDir]
                : e.filter(
                    (u) =>
                      u === o ||
                      u === n.join(o, "heads") ||
                      u === n.join(o, "remotes") ||
                      u === n.join(this.options.commonDir, "info") ||
                      u === i ||
                      n.dirname(u) === i,
                  );
          if (s.length === 0) return Promise.resolve();
          for (let u of s) this.changedMetadataDirectories.add(u);
          if (this.metadataRefreshPromise != null) return this.metadataRefreshPromise;
          let a = r,
            c = (async () => {
              for (; !this.disposed && this.changedMetadataDirectories.size > 0; ) {
                let u = [...this.changedMetadataDirectories];
                this.changedMetadataDirectories.clear();
                let p = this.watchTargets.filter(
                  (m) => m.metadataDirectory != null && u.some((f) => Tc(n, f, m.watchPath)),
                );
                (await Promise.all(
                  p.map(async (m) => {
                    m.retryTimer == null &&
                      (a && (await this.disposeSession(m, !0)),
                      !this.disposed &&
                        m.session == null &&
                        (await this.tryStartWatchSession(m, a)));
                  }),
                ),
                  await Promise.all(
                    p
                      .filter((m) => m.metadataDirectory?.missing)
                      .map((m) => this.tryStartWatchSession(m, a)),
                  ),
                  await this.refreshWorktreeDirectories(n, i, a),
                  (a = !0));
              }
            })().finally(() => {
              this.metadataRefreshPromise === c && (this.metadataRefreshPromise = null);
            });
          return ((this.metadataRefreshPromise = c), c);
        }
        async refreshWorktreeDirectories(e, r, n) {
          let o = this.watchTargets.find((u) => u.watchPath === r);
          if (this.disposed || !this.worktreeTopologyEnabled || o == null) return;
          let i = o.generation,
            s = [];
          if (!o.metadataDirectory?.missing)
            try {
              s = (await this.options.host.readDirectory(r))
                .filter((u) => u.isDirectory())
                .map((u) => e.join(r, u.name));
            } catch (u) {
              if (this.disposed || i !== o.generation) return;
              if (!N5(u)) {
                (this.logger.warning("Failed to discover git worktree watches", {
                  safe: {},
                  sensitive: { error: u, path: r },
                }),
                  await this.disposeSession(o),
                  this.updateRequiresRecovery(),
                  this.scheduleWatchSessionRetry(o));
                return;
              }
              (o.metadataDirectory != null && (o.metadataDirectory.missing = !0),
                await this.disposeSession(o));
            }
          if (this.disposed || (i !== o.generation && !o.metadataDirectory?.missing)) return;
          let a = new Set(s),
            l = this.watchTargets.filter(
              (u) => u.metadataDirectory?.parentPath === r && !a.has(u.watchPath),
            );
          if (
            (await Promise.all(
              l.map(async (u) => {
                let p = this.disposeSession(u);
                (u.watchPath === this.gitDir
                  ? u.metadataDirectory != null && (u.metadataDirectory.missing = !0)
                  : this.watchTargets.splice(this.watchTargets.indexOf(u), 1),
                  await p);
              }),
            ),
            this.disposed)
          )
            return;
          let c = s.map((u) => {
            let p = this.watchTargets.find((f) => f.watchPath === u),
              m = p?.handlers.some((f) => f.changeType === "worktree-topology")
                ? p
                : this.addDirectoryWatchTarget(u, "worktree-topology", (f) => N1e(e, r, f), !1, r);
            return m.session == null ? this.tryStartWatchSession(m, n) : Promise.resolve();
          });
          (await Promise.all(c), this.updateRequiresRecovery());
        }
        isHeadRefPath(e, r, n, o) {
          let i = o.get(n);
          if (i != null) return i;
          let s =
            !this.currentHeadRefKnown ||
            n === this.currentHeadRefPath ||
            (this.options.isLocalBranchDependency?.(e.relative(r, n).split(e.sep).join("/")) ?? !1);
          return (o.set(n, s), s);
        }
        addWatchTarget(e, r, n) {
          if (!r) return;
          let o = e.dirname(r),
            i = { changeType: n, shouldHandleChangedPath: (s) => s === r };
          this.addWatchHandler(o, !1, i, null);
        }
        addDirectoryWatchTarget(e, r, n, o = !0, i) {
          let s = { changeType: r, shouldHandleChangedPath: n };
          return this.addWatchHandler(e, o, s, i == null ? null : { parentPath: i, missing: !1 });
        }
        addWatchHandler(e, r, n, o) {
          let i = this.watchTargets.find((a) => a.recursive === r && a.watchPath === e);
          if (i != null) return (i.handlers.push(n), i);
          let s = {
            generation: 0,
            handlers: [n],
            metadataDirectory: o,
            recursive: r,
            retryDelayMs: M1e,
            retryTimer: null,
            session: null,
            sessionDisposePromise: null,
            sessionStartPromise: null,
            watchPath: e,
          };
          return (this.watchTargets.push(s), s);
        }
        async tryStartWatchSession(e, r) {
          if (this.disposed || !this.watchTargets.includes(e)) return;
          if (e.sessionDisposePromise != null)
            return (await e.sessionDisposePromise, this.tryStartWatchSession(e, r));
          if (e.session != null || e.retryTimer != null) return;
          if (e.sessionStartPromise != null) {
            let o = e.generation;
            (await e.sessionStartPromise,
              r &&
                !this.disposed &&
                o === e.generation &&
                e.session == null &&
                !e.metadataDirectory?.missing &&
                this.scheduleWatchSessionRetry(e));
            return;
          }
          this.updateRequiresRecovery();
          let n = this.startWatchSession(e, r);
          e.sessionStartPromise = n;
          try {
            await n;
          } finally {
            e.sessionStartPromise === n && (e.sessionStartPromise = null);
          }
        }
        async startWatchSession(e, r) {
          let n = e.generation;
          try {
            if (e.metadataDirectory != null) {
              let f;
              try {
                f = (await this.options.host.stat(e.watchPath, { bypassCache: !0 })).isDirectory();
              } catch (h) {
                if (!N5(h)) throw h;
                f = !1;
              }
              if (this.disposed || n !== e.generation) return;
              if (((e.metadataDirectory.missing = !f), this.updateRequiresRecovery(), !f)) {
                r && e.handlers.forEach((h) => this.handleFileWatchEvent(h.changeType));
                return;
              }
            }
            let o = e.handlers.some((f) => f.changeType === "working-tree"),
              i =
                o && this.options.watchIgnoreSources?.pruneIgnoredDirectories
                  ? await this.ignorePolicy?.read()
                  : void 0;
            if (
              this.disposed ||
              n !== e.generation ||
              (i != null && !this.ignorePolicy?.isCurrent(i))
            )
              return;
            let s =
                this.turnHeadLockPath != null &&
                this.pathApi?.dirname(this.turnHeadLockPath) === e.watchPath
                  ? this.turnHeadLockPath
                  : null,
              a = this.pathApi,
              l = a == null ? [] : (i?.directories ?? []).map((f) => O1e(a, f)).sort(),
              c = {
                path: e.watchPath,
                recursive: e.recursive,
                renameEventHandling: o ? "changed-path-with-parent-directory" : "changed-path",
                watchId: `git-repo-${crypto.randomUUID()}`,
                onChange: ({ changedPaths: f, pathChanges: h }) => {
                  if (this.disposed || n !== e.generation) return;
                  s != null &&
                    f.includes(s) &&
                    ((this.turnHeadLockChange = { path: s }),
                    this.invalidateTurnContext("change_pending"));
                  let v = this.ignoreSourceWatches.get(e.watchPath)?.handler,
                    y = h?.length === 1 ? h[0] : void 0;
                  !o && !e.recursive && this.refreshMetadataDirectories(f);
                  let w =
                      a != null &&
                      l.length > 0 &&
                      (h?.map(({ path: S }) => S) ?? f.slice(0, 1)).some((S) => {
                        let E = O1e(a, S);
                        return l[(0, L1e.default)(l, E)]?.startsWith(E) === !0;
                      }),
                    _ = new Map();
                  e.handlers.forEach((S) => {
                    let E = S.changeType === "working-tree",
                      T = [];
                    for (let V of f) {
                      if (
                        !S.shouldHandleChangedPath(V, _) ||
                        (S === v &&
                          y?.type === "update" &&
                          y.path === V &&
                          this.ignoreSourceWatches.get(V)?.target.session != null)
                      )
                        continue;
                      let de =
                        E && this.pathApi != null
                          ? this.getAffectedWorkingTreePath(this.pathApi, V)
                          : V;
                      de != null && T.push(de);
                    }
                    if (f.length > 0 && T.length === 0) return;
                    if (S === v)
                      for (let V of T.length > 0 ? T : [e.watchPath])
                        this.changedIgnoreSourcePaths.add(V);
                    let P = this.options.watchIgnoreSources?.pruneIgnoredDirectories,
                      M =
                        P &&
                        (S.changeType === "index" ||
                          (E &&
                            (f.length === 0 ||
                              w ||
                              T.some((V) => this.pathApi?.basename(V) === ".gitignore"))));
                    ((S.changeType === "config" || S.changeType === "head" || M) &&
                      (P !== "observed" && this.observedIgnoredDirectories.clear(),
                      this.ignorePolicy?.requestRefresh({
                        reconcileUnchangedCoverage:
                          S.changeType === "head" || (P && S.changeType !== "index"),
                      })),
                      S.changeType === "head" &&
                        (f.length === 0 || T.some((V) => this.pathApi?.basename(V) === "HEAD")) &&
                        (this.currentHeadRefKnown = !1));
                    let L = E && T.includes(this.options.root);
                    this.handleFileWatchEvent(S.changeType, f.length === 0 || L ? void 0 : T);
                  });
                },
              },
              u = await jt(
                {
                  attributes: {
                    "git.host_kind": this.options.host.isLocal ? "local" : "remote",
                    "git.watch_target": o ? "working-tree" : "git-metadata",
                    "git.watcher_recovering": r,
                    "git.watcher_recursive": e.recursive,
                  },
                  name: "git.watcher_target_start",
                  op: "codex.git.watcher_target_start",
                },
                () =>
                  o && this.options.startWorkingTreeWatch != null
                    ? this.options.startWorkingTreeWatch(c, i?.directories ?? [])
                    : !o && this.options.startMetadataWatch != null
                      ? this.options.startMetadataWatch(c)
                      : this.options.host.startFileWatch(c),
              );
            if (
              this.disposed ||
              n !== e.generation ||
              !this.watchTargets.includes(e) ||
              (i != null && !this.ignorePolicy?.isCurrent(i))
            ) {
              await u.dispose();
              return;
            }
            ((e.session = u),
              o &&
                ((this.nextIgnoreProbeAt = 0),
                (this.workingTreeIgnoredDirectories = i?.directories ?? [])));
            let p = i != null && this.ignorePolicy?.didApply(i),
              m = Date.now();
            (this.updateRequiresRecovery(),
              u.closed.then((f) => {
                this.disposed ||
                  e.session !== u ||
                  (f.reason === "watch-error" &&
                    this.logger.warning("Git repo watcher failed", {
                      safe: {},
                      sensitive: { error: f.error, path: e.watchPath },
                    }),
                  (e.session = null),
                  Date.now() - m >= BFt && (e.retryDelayMs = M1e),
                  this.updateRequiresRecovery(),
                  this.scheduleWatchSessionRetry(e));
              }),
              (r || p) &&
                (r &&
                  this.ignoreSourceWatches.get(e.watchPath)?.target === e &&
                  this.ignorePolicy?.requestRefresh(),
                e.handlers.forEach((f) => {
                  this.handleFileWatchEvent(f.changeType);
                }),
                !o &&
                  !e.recursive &&
                  this.metadataRefreshPromise == null &&
                  this.refreshMetadataDirectories([], !1)));
          } catch (o) {
            if (this.disposed || n !== e.generation) return;
            (this.logger.warning("Failed to watch git path", {
              safe: {},
              sensitive: { error: o, path: e.watchPath },
            }),
              this.updateRequiresRecovery(),
              this.scheduleWatchSessionRetry(e));
          }
        }
        scheduleWatchSessionRetry(e) {
          if (this.disposed || !this.watchTargets.includes(e) || e.retryTimer != null) return;
          let r = e.retryDelayMs;
          ((e.retryDelayMs = Math.min(e.retryDelayMs * 2, LFt)),
            (e.retryTimer = setTimeout(() => {
              ((e.retryTimer = null),
                !this.disposed && e.session == null && this.tryStartWatchSession(e, !0));
            }, r)));
        }
        updateRequiresRecovery() {
          let e = this.requiresRecovery;
          e !== this.lastRequiresRecovery &&
            ((this.lastRequiresRecovery = e),
            e && this.invalidateTurnContext("watch_unavailable"),
            this.options.onRequiresRecoveryChanged?.(e));
        }
        handleFileWatchEvent(e, r) {
          if (
            ((this.pendingChangeCounts[e] += 1),
            (e === "head" || e === "config" || e === "local-refs" || e === "remote-refs") &&
              (this.pendingTurnContextChanges.add(e), this.invalidateTurnContext("change_pending")),
            e === "working-tree")
          ) {
            let n = r?.[0],
              o = this.pathApi;
            if (
              n != null &&
              o != null &&
              this.options.watchIgnoreSources?.pruneIgnoredDirectories === "observed" &&
              this.workingTreeSample.size < D5
            ) {
              let i = o.relative(this.options.root, n);
              i.includes("/") &&
                !i.startsWith("../") &&
                !o.isAbsolute(i) &&
                this.workingTreeSample.add(i);
            }
            if (r == null) this.pendingWorkingTreePaths = null;
            else if (this.pendingWorkingTreePaths != null) {
              for (let i of r)
                if ((this.addPendingWorkingTreePath(i), this.pendingWorkingTreePaths == null))
                  break;
            }
          }
          this.scheduleRepoChanged(e);
        }
        addPendingWorkingTreePath(e) {
          let r = this.pendingWorkingTreePaths,
            n = this.pathApi;
          if (r == null) return;
          if (n != null) {
            for (let i of r) if (Tc(n, i, e)) return;
            r.forEach((i) => {
              Tc(n, e, i) && r.delete(i);
            });
          }
          if ((r.add(e), r.size <= D5)) return;
          if (n == null) {
            this.pendingWorkingTreePaths = null;
            return;
          }
          let o = new Set();
          for (let i of r) {
            let s = n.relative(this.options.root, i);
            if (s === "" || s === ".." || s.startsWith(`..${n.sep}`) || n.isAbsolute(s)) {
              this.pendingWorkingTreePaths = null;
              return;
            }
            if ((o.add(n.join(this.options.root, s.split(n.sep, 1)[0])), o.size > D5)) {
              this.pendingWorkingTreePaths = null;
              return;
            }
          }
          this.pendingWorkingTreePaths = o;
        }
        scheduleRepoChanged(e) {
          this.disposed ||
            this.activeChangeEmissions.has(e) ||
            this.changeTimers.has(e) ||
            this.changeTimers.set(
              e,
              setTimeout(() => {
                (this.changeTimers.delete(e),
                  this.emitRepoChanged(e).catch((r) => {
                    this.logger.warning("Failed to emit git repo change", {
                      safe: { changeType: e },
                      sensitive: { error: r },
                    });
                  }));
              }, OFt),
            );
        }
        async emitRepoChanged(e) {
          this.activeChangeEmissions.add(e);
          let r = this.pendingChangeCounts[e];
          this.pendingChangeCounts[e] = 0;
          let n =
            e === "working-tree" && this.pendingWorkingTreePaths != null
              ? [...this.pendingWorkingTreePaths]
              : null;
          e === "working-tree" &&
            (n == null &&
              this.workingTreeSample.size > 0 &&
              Date.now() >= this.nextIgnoreProbeAt &&
              ((this.pendingIgnoreProbe = [...this.workingTreeSample]),
              (this.nextIgnoreProbeAt = Date.now() + NFt),
              this.ignorePolicy?.requestRefresh({ reconcileUnchangedCoverage: !1 })),
            this.workingTreeSample.clear(),
            (this.pendingWorkingTreePaths = new Set()));
          try {
            let o = await this.getGitOperationState();
            if (this.disposed) return;
            let i = {
                type: "git-repo-changed",
                changeType: e,
                commonDir: this.options.commonDir,
                hostId: this.options.host.id,
                rebaseInProgress: o.rebaseInProgress,
                root: this.options.root,
                changedPaths: n ?? void 0,
              },
              s = this.turnHeadLockChange;
            if (
              (this.options.onCoalescedChange?.({ changeType: e, rawEventCount: r }),
              await this.options.emit({ type: "worker-event", event: i }),
              this.pendingChangeCounts[e] === 0 &&
                (this.pendingTurnContextChanges.delete(e),
                e === "head" && this.turnHeadLockChange === s && (this.turnHeadLockChange = null)),
              e === "head" && !this.currentHeadRefKnown)
            ) {
              let a = await wc(this.options.worktreeRepo);
              ((this.currentHeadRefPath =
                a.type !== "branch"
                  ? null
                  : (this.pathApi?.join(
                      this.options.commonDir,
                      "refs",
                      "heads",
                      ...a.branch.split("/"),
                    ) ?? null)),
                (this.currentHeadRefKnown = a.type !== "unknown"));
            }
            this.logRepoChanged(e, r, o);
          } finally {
            (this.activeChangeEmissions.delete(e),
              this.pendingChangeCounts[e] > 0 && this.scheduleRepoChanged(e));
          }
        }
        logRepoChanged(e, r, n) {
          this.logger.debug("Git repo changed", {
            safe: { changeType: e, rawEventCount: r, ...n },
          });
        }
        async getGitOperationState() {
          let e = this.pathApi,
            r = this.gitDir;
          if (e == null || r == null)
            return {
              cherryPickInProgress: null,
              mergeInProgress: null,
              rebaseInProgress: null,
              revertInProgress: null,
            };
          let [n, o, i, s, a, l] = await Promise.all([
            this.gitPathExists(e.join(r, "CHERRY_PICK_HEAD")),
            this.gitPathExists(e.join(r, "MERGE_HEAD")),
            this.gitPathExists(e.join(r, "REBASE_HEAD")),
            this.gitPathExists(e.join(r, "rebase-merge")),
            this.gitPathExists(e.join(r, "rebase-apply")),
            this.gitPathExists(e.join(r, "REVERT_HEAD")),
          ]);
          return {
            cherryPickInProgress: n,
            mergeInProgress: o,
            rebaseInProgress: $Ft([i, s, a]),
            revertInProgress: l,
          };
        }
        async gitPathExists(e, r) {
          try {
            return (await this.options.host.stat(e, r), !0);
          } catch (n) {
            return N5(n) ? !1 : null;
          }
        }
        getAffectedWorkingTreePath(e, r) {
          if (!r.includes(".git")) return r;
          let o = e.relative(this.options.root, r).split(e.sep),
            i = o.indexOf(".git");
          if (i < 1) return r;
          let s = o[i + 1];
          return s !== "HEAD" && s !== "packed-refs" && s !== "refs"
            ? null
            : e.join(this.options.root, ...o.slice(0, i));
        }
        disposeSession(e, r = !1) {
          let n = e.session,
            o = e.sessionStartPromise,
            i = e.sessionDisposePromise;
          ((e.generation += 1),
            e.retryTimer != null && (clearTimeout(e.retryTimer), (e.retryTimer = null)),
            (e.session = null),
            (e.sessionStartPromise = null));
          let s = Promise.all([
            o,
            i,
            (r && n?.disposeForReplacement != null
              ? n.disposeForReplacement()
              : n?.dispose()
            )?.catch((a) => {
              this.logger.warning("Failed to dispose git repo watcher", {
                safe: {},
                sensitive: { error: a },
              });
            }),
          ])
            .then(() => {})
            .finally(() => {
              e.sessionDisposePromise === s && (e.sessionDisposePromise = null);
            });
          return ((e.sessionDisposePromise = s), this.disposed || this.updateRequiresRecovery(), s);
        }
      }));
  });
