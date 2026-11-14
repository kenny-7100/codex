function F1e(t) {
  switch (t) {
    case "availability":
    case "git-context":
    case "managed-worktree-state":
    case "github-request":
    case "origin-url":
    case "origin-and-roots":
    case "worktree-shell-environment":
    case "worktree-owner":
    case "wait-for-git-cwd-change":
    case "default-remote-branch":
    case "automation-writable-roots":
    case "merge-base":
    case "read-git-file-binary":
    case "prepare-worktree-snapshot":
    case "push":
    case "checkout-branch":
      return !1;
    default:
      return !0;
  }
}
var $1e = g(() => {});
async function GFt(t, e, r, n) {
  let o = () => {
    let s = t.reviewSnapshot;
    return s.read(() =>
      dv({ ...e, maxUntrackedFiles: tf(e.operationSource), reviewSnapshot: s, worktreeRepo: t }),
    );
  };
  try {
    let s = await o();
    return F5(s, !!n?.failedCommandCount);
  } catch (s) {
    if (!(s instanceof fs) || r.aborted) throw s;
  }
  let i = !1;
  try {
    let s = await Xr(
      {
        ...di(),
        onCommandFailure: () => {
          i = !0;
        },
      },
      o,
    );
    return F5(s, i);
  } catch (s) {
    if (s instanceof fs && !r.aborted)
      return { type: "error", source: e.source, failureReason: "canceled" };
    throw s;
  }
}
function L5(t, e) {
  return t?.commonDir === e && t.closingPromise == null ? t : void 0;
}
function U1e(t, e) {
  try {
    return t?.requireReviewSnapshot(e ?? t.reviewSnapshot.generation);
  } catch (r) {
    if (r instanceof fs) return;
    throw r;
  }
}
async function WFt(t, e, r) {
  return (r(await t()), e());
}
function q1e(t, e = "request") {
  if (e === "subscription") {
    let r = di().startPriority;
    if (r != null) return r;
  }
  return new Dp(
    t === "sidebar_task_pr_chip" ||
    t === "git_query_invalidation" ||
    t === "turn_git_state_analytics" ||
    e === "invalidation"
      ? "background"
      : "foreground",
  );
}
function tf(t) {
  return t === "review_model" || t === "review_search" ? 256 : void 0;
}
function HFt(t) {
  switch (t.method) {
    case "status-summary":
    case "review-summary":
    case "branch-diff-stats":
    case "list-worktrees":
      return t.params.cwd;
    case "recent-branches":
    case "current-branch":
    case "upstream-branch":
    case "branch-ahead-count":
    case "default-branch":
    case "base-branch":
    case "branch-commits":
      return t.params.root;
  }
}
function jFt(t) {
  return typeof t.params.cwd == "string"
    ? t.params.cwd
    : typeof t.params.sourceCwd == "string"
      ? t.params.sourceCwd
      : typeof t.params.localCwd == "string"
        ? t.params.localCwd
        : typeof t.params.sourceWorktreeCwd == "string"
          ? t.params.sourceWorktreeCwd
          : typeof t.params.worktreeWorkspaceRoot == "string"
            ? t.params.worktreeWorkspaceRoot
            : typeof t.params.root == "string"
              ? t.params.root
              : typeof t.params.localGitRoot == "string"
                ? t.params.localGitRoot
                : typeof t.params.worktreeGitRoot == "string"
                  ? t.params.worktreeGitRoot
                  : null;
}
function zFt(t) {
  switch (t.method) {
    case "restore-worktree":
      return { type: "exact", cwd: t.params.worktreePath };
    case "apply-changes":
      return { type: "exact", cwd: t.params.destinationRoot };
    case "apply-patch":
    case "apply-review-section-changes":
      return { type: "exact", cwd: t.params.cwd };
    case "checkout-branch":
      return { type: "exact", cwd: t.params.cwd };
    case "commit":
      return t.params.includeUnstaged ? { type: "exact", cwd: t.params.cwd } : null;
    case "overwrite-repo":
    case "git-init-repo":
    case "delete-worktree":
    case "move-thread-to-local":
    case "move-thread-to-worktree":
    case "move-thread-to-host-worktree":
      return { type: "host" };
    case "create-worktree":
    case "create-branch":
      return null;
    default:
      return null;
  }
}
function VFt(t) {
  switch (t) {
    case "push":
    case "checkout-branch":
    case "prepare-worktree-snapshot":
    case "overwrite-repo":
    case "git-init-repo":
    case "create-worktree":
    case "restore-worktree":
    case "delete-worktree":
    case "apply-changes":
    case "apply-patch":
    case "apply-review-section-changes":
    case "commit":
    case "create-branch":
    case "move-thread-to-local":
    case "move-thread-to-worktree":
    case "move-thread-to-host-worktree":
      return !0;
    case "cleanup-host-handoff-transfer":
    case "cancel-worktree-upstream-refresh":
      return !1;
    case "availability":
    case "github-request":
    case "origin-url":
    case "origin-and-roots":
    case "worktree-shell-environment":
    case "worktree-owner":
    case "default-remote-branch":
    case "automation-writable-roots":
    case "merge-base":
    case "read-git-file-binary":
    case "stable-metadata":
    case "wait-for-git-cwd-change":
    case "clone-state":
    case "watch-repo":
    case "subscribe-live-query":
    case "recover-live-queries":
    case "unwatch-repo":
    case "invalidate-git-read-caches":
    case "current-branch":
    case "current-branch-snapshot":
    case "upstream-branch":
    case "branch-ahead-count":
    case "default-branch":
    case "base-branch":
    case "recent-branches":
    case "branch-exists":
    case "branch-availability":
    case "resolve-worktree-starting-ref":
    case "branch-commits":
    case "review-commit-line-counts":
    case "search-branches":
    case "nearest-ancestor-branch":
    case "branch-metadata":
    case "status-summary":
    case "branch-diff-stats":
    case "review-summary":
    case "review-source-line-counts":
    case "review-diff":
    case "review-search":
    case "branch-range-patch":
    case "review-patch":
    case "commit-message-diff":
    case "submodule-paths":
    case "cat-file":
    case "blame-file":
    case "synced-branch":
    case "synced-branch-state":
    case "index-info":
    case "config-value":
    case "git-origins":
    case "set-config-value":
    case "set-worktree-owner-thread":
    case "list-worktrees":
    case "codex-worktrees":
    case "resolve-worktree-for-thread":
    case "worktree-snapshot-ref":
    case "managed-worktree-state":
    case "git-context":
    case "repository-identity":
    case "turn-diff-capture-start":
    case "turn-diff-capture-complete":
    case "invalidate-stable-metadata":
    case "dispose-git-init-watch":
      return !1;
  }
}
function B5(t) {
  return t.method === "review-diff" ||
    t.method === "review-patch" ||
    t.method === "review-search" ||
    t.method === "review-summary"
    ? t.params.source
    : null;
}
function KFt(t) {
  return t.method === "branch-diff-stats" ||
    t.method === "review-diff" ||
    t.method === "review-patch" ||
    t.method === "review-search" ||
    t.method === "review-summary" ||
    t.method === "status-summary"
    ? t.params.cwd
    : null;
}
function G1e(t) {
  return t === CN ? "git_unavailable" : t instanceof fs ? "stale_snapshot" : "exception";
}
function F5(t, e) {
  return t.type !== "expected" || !e
    ? t
    : { type: "error", source: t.source, failureReason: "review_comparison" };
}
function W1e(t, e) {
  return t.method === "review-summary"
    ? { ...t, result: F5(t.result, e.failedCommandCount > 0) }
    : t;
}
function ZFt(t) {
  if (t.type === "error") return !0;
  let e = t.value;
  return (
    e != null &&
    typeof e == "object" &&
    (("type" in e && e.type === "error") ||
      ("success" in e && e.success === !1) ||
      ("status" in e && (e.status === "error" || e.status === "command-error")))
  );
}
function XFt(t) {
  return t.aborted
    ? Promise.resolve()
    : new Promise((e) => {
        t.addEventListener("abort", () => e(), { once: !0 });
      });
}
var ef,
  CN,
  TN,
  H1e = g(() => {
    O();
    hr();
    C2e();
    mBe();
    yBe();
    SO();
    DO();
    bBe();
    wBe();
    EBe();
    sA();
    TBe();
    DBe();
    LBe();
    BBe();
    GBe();
    Gi();
    _c();
    jBe();
    tFe();
    nFe();
    cd();
    dA();
    iFe();
    il();
    aFe();
    pN();
    s5();
    m5();
    dFe();
    nN();
    mFe();
    Ks();
    Y3();
    Km();
    $m();
    EK();
    vK();
    Zm();
    Sc();
    CK();
    PK();
    Sx();
    Qu();
    BO();
    NK();
    je();
    kK();
    Qx();
    gFe();
    AFe();
    EFe();
    TFe();
    MFe();
    nv();
    LK();
    fe();
    FFe();
    qO();
    UFe();
    ZFe();
    r1e();
    rd();
    IO();
    bA();
    $K();
    vx();
    o1e();
    s1e();
    l1e();
    c1e();
    f1e();
    B1e();
    $1e();
    ((ef = Ie("git")),
      (CN = new Error(No)),
      (TN = class extends Dg {
        constructor(r, n, o) {
          super(r);
          this.gitManager = n;
          this.dependencies = o;
          ((this.metadataWatches = new _N(
            (i, s) => this.dependencies.startMetadataWatch?.(i, s) ?? i.startFileWatch(s),
          )),
            (this.watcherPerformance = new xN((i) => {
              this.emit({ type: "worker-event", event: i });
            })),
            (this.liveQueryRegistry = new SN({
              emit: (i) => {
                this.emit({ type: "worker-event", event: i });
              },
              run: (i, s, a, l, c, u, p, m, f, h) =>
                this.runLiveQueryWithAttribution(i, s, a, l, c, u, p, m, f, h),
              prepareRecovery: (i, s) => {
                let a = this.gitManager.getWorktreeRepositoryForRoot(i, s);
                (Rn(a), a.invalidateGitReadCachesForRepoRecovery());
                let l = this.watchesByKey.get(this.getWatchKey(i, s));
                l != null &&
                  this.emit({
                    type: "worker-event",
                    event: {
                      type: "git-repo-changed",
                      changeType: "working-tree",
                      commonDir: l.commonDir,
                      hostId: s.id,
                      rebaseInProgress: null,
                      recovery: !0,
                      root: i,
                    },
                  });
              },
            })));
        }
        liveQueryRegistry;
        watcherPerformance;
        metadataWatches;
        watchesByKey = new Map();
        unavailableTurnContextWatches = new WeakSet();
        watchSetupByHost = new Map();
        gitInitWatch = null;
        desiredGitInitWatchKey = null;
        handledGitInitWatchers = new WeakSet();
        gitInitMetadataRefreshes = new Map();
        inFlightRequests = new Map();
        worktreeUpstreamRefreshAbortControllers = new Map();
        canceledRequests = new Set();
        uncancelableRequestIds = new Set();
        worktreeDeletePromises = new Map();
        worktreeRestorePromises = new Map();
        async handleRequest(r) {
          let n = C5(r.method),
            o = n == null ? void 0 : S3(),
            i = Date.now();
          try {
            await Xr(
              {
                attribution: o,
                source: r.params.operationSource,
                requestKind: r.method,
                isLateTurnGitCapture:
                  r.method === "git-context" &&
                  r.params.operationSource === "turn_git_state_analytics" &&
                  !r.params.reuseWatchedMetadata,
                startPriority: q1e(r.params.operationSource),
              },
              () => this.handleRequestWithContext(r, n, o, i),
            );
          } finally {
            o != null && qM(o);
          }
        }
        async handleRequestWithContext(r, n, o, i) {
          let s = new AbortController(),
            l = r.params.hostConfig ?? { id: "local", display_name: "Local", kind: "local" },
            c = this.dependencies.createExecutionHost(l),
            u = KFt(r),
            p = u == null ? "unknown" : this.getGitPerformanceRepoIndexSizeBucket(u, c),
            m,
            f = null,
            h = null,
            v =
              r.method !== "delete-worktree" &&
              r.method !== "dispose-git-init-watch" &&
              r.method !== "invalidate-stable-metadata" &&
              r.method !== "invalidate-git-read-caches" &&
              r.method !== "git-init-repo" &&
              r.method !== "cleanup-host-handoff-transfer" &&
              r.method !== "cancel-worktree-upstream-refresh" &&
              r.method !== "watch-repo" &&
              r.method !== "unwatch-repo";
          if (v) {
            if ((this.inFlightRequests.set(r.id, s), this.canceledRequests.has(r.id))) {
              (this.canceledRequests.delete(r.id),
                s.abort(),
                this.inFlightRequests.delete(r.id),
                this.emitGitPerformanceOperation({
                  attribution: o,
                  canceled: !0,
                  durationMs: Date.now() - i,
                  host: c,
                  operation: n,
                  queueDurationMs: r.enqueuedAtMs == null ? null : Math.max(0, i - r.enqueuedAtMs),
                  repoIndexSizeBucket: p,
                  result: m,
                  resultDisposition: "canceled",
                  reviewSource: B5(r),
                  source: r.params.operationSource,
                  trigger: "request",
                }),
                n == null && Ia("canceled"));
              return;
            }
          } else (this.uncancelableRequestIds.add(r.id), this.canceledRequests.delete(r.id));
          let y;
          try {
            if (
              F1e(r.method) &&
              c.isLocal &&
              !zM({ requestKind: r.method, source: r.params.operationSource }) &&
              !(await Lt(Fm(c), s.signal))
            )
              throw CN;
            switch (r.method) {
              case "github-request": {
                if (this.dependencies.requestGitHub == null)
                  throw new Error("GitHub requests require a Node Git worker");
                y = H(await this.dependencies.requestGitHub(r.params, s.signal));
                break;
              }
              case "origin-url": {
                let S = await this.gitManager.getRepoRepository(r.params.cwd, c);
                y = H({ originUrl: S == null ? null : await S.getOriginUrl() });
                break;
              }
              case "origin-and-roots": {
                y = H({ origins: await LO(r.params.discoveryDirs, this.gitManager, c) });
                break;
              }
              case "worktree-shell-environment": {
                let S = await this.gitManager.getWorktreeRepository(r.params.cwd, c);
                y = H({ shellEnvironment: S == null ? null : await ALe(S, s.signal) });
                break;
              }
              case "worktree-owner": {
                let S = await this.gitManager.getWorktreeRepository(r.params.cwd, c);
                y = H({
                  ownerThreadId:
                    S == null
                      ? null
                      : ((
                          await gA(
                            S,
                            s.signal,
                            r.params.operationSource === "worktree_archive_cleanup",
                          )
                        )?.ownerThreadId ?? null),
                });
                break;
              }
              case "default-remote-branch": {
                let S = await this.gitManager.getWorktreeRepository(r.params.cwd, c);
                y = H({ branch: S == null ? null : ((await gn(S))?.branch ?? null) });
                break;
              }
              case "automation-writable-roots": {
                y = H({ roots: await n1e({ ...r.params, gitManager: this.gitManager, host: c }) });
                break;
              }
              case "merge-base": {
                let S = await this.gitManager.getWorktreeRepository(r.params.cwd, c);
                y = H({
                  mergeBaseSha:
                    S == null || !r.params.baseBranch ? null : await ll(S, r.params.baseBranch),
                });
                break;
              }
              case "read-git-file-binary": {
                if (this.dependencies.readGitFileBinary == null)
                  throw new Error("Reading Git binary files requires a Node Git worker");
                y = H(await this.dependencies.readGitFileBinary(r.params, c, s.signal));
                break;
              }
              case "prepare-worktree-snapshot": {
                if (this.dependencies.prepareWorktreeSnapshot == null)
                  throw new Error("Preparing worktree snapshots requires a Node Git worker");
                let S = await this.gitManager.getWorktreeRepository(r.params.cwd, c);
                if (S == null) throw new Error("gitRoot must belong to a Git worktree");
                y = H(
                  await this.dependencies.prepareWorktreeSnapshot(
                    S,
                    r.params.snapshotBranch,
                    s.signal,
                  ),
                );
                break;
              }
              case "push": {
                let S = await hA(r.params, this.gitManager, c, s.signal);
                ((y = H(S)), S.status === "success" && (h = r.params.cwd));
                break;
              }
              case "checkout-branch": {
                let S = await En(r.params, this.gitManager, c, { signal: s.signal });
                ((y = H(S)), S.status === "success" && (h = r.params.cwd));
                break;
              }
              case "availability": {
                let S = await Lt(Fm(c), s.signal);
                y = H({ available: S });
                break;
              }
              case "stable-metadata": {
                y = await this.handleResolveStableMetadata(r.params, { host: c });
                break;
              }
              case "wait-for-git-cwd-change": {
                let S = await this.metadataWatches.waitForCwdChange(
                  c,
                  r.params,
                  s.signal,
                  this.dependencies.getSymlinkWatchTargets,
                  (E) => this.gitManager.isCurrentlyRepository(E, c, s.signal),
                );
                (S && this.gitManager.invalidateStableMetadata(), (y = H(S)));
                break;
              }
              case "clone-state": {
                y = H(await HBe(r.params.root, c, s.signal));
                break;
              }
              case "current-branch": {
                y = H(await this.getCurrentBranch(r.params.root, c));
                break;
              }
              case "current-branch-snapshot": {
                let S = this.gitManager.getWorktreeRepositoryForRoot(r.params.root, c);
                y = H({ branch: await xNe(S, s.signal) });
                break;
              }
              case "upstream-branch": {
                let S = await this.handleUpstreamBranch(r.params.root, {
                  host: c,
                  signal: s.signal,
                });
                y = H(S);
                break;
              }
              case "branch-ahead-count": {
                let S = await this.handleBranchAheadCount(r.params.root, {
                  host: c,
                  signal: s.signal,
                });
                y = H(S);
                break;
              }
              case "default-branch": {
                y = H(await this.getDefaultBranch(r.params.root, c, s.signal));
                break;
              }
              case "base-branch": {
                y = H(await this.getBaseBranch(r.params.root, c));
                break;
              }
              case "recent-branches": {
                y = await this.handleRecentBranches(r.params, { host: c, signal: s.signal });
                break;
              }
              case "branch-exists": {
                let S = await sl(r.params.root, r.params.branch, c, s.signal);
                y = H({ exists: S });
                break;
              }
              case "branch-availability": {
                let S = this.gitManager.getWorktreeRepositoryForRoot(r.params.root, c);
                y = H(await SBe(S, r.params.branches, s.signal));
                break;
              }
              case "create-branch": {
                let { branch: S, cwd: E, failIfExists: T, mode: P, startPoint: M } = r.params;
                y = H(
                  await pA(
                    { branch: S, cwd: E, failIfExists: T, mode: P, startPoint: M },
                    this.gitManager,
                    c,
                    s.signal,
                  ),
                );
                break;
              }
              case "resolve-worktree-starting-ref": {
                let S = this.gitManager.getWorktreeRepositoryForRoot(r.params.root, c);
                y = H(await Jy(S, r.params.ref, s.signal));
                break;
              }
              case "branch-commits": {
                let S = this.gitManager.getWorktreeRepositoryForRoot(r.params.root, c),
                  E = await l5(S, r.params.baseBranch, s.signal);
                y = H({ commits: E });
                break;
              }
              case "review-commit-line-counts": {
                let S = this.gitManager.getWorktreeRepositoryForRoot(r.params.root, c);
                y = H(await RBe(S, r.params.commits, r.params.hideWhitespace, s.signal));
                break;
              }
              case "search-branches": {
                y = await this.handleSearchBranches(r.params, { host: c, signal: s.signal });
                break;
              }
              case "nearest-ancestor-branch": {
                let S = this.gitManager.getWorktreeRepositoryForRoot(r.params.root, c),
                  E = await oFe(S, r.params.candidates, r.params.currentBranch, s.signal);
                y = H({ branch: E });
                break;
              }
              case "branch-metadata": {
                let S = await CBe(this.gitManager, r.params.cwd, c, s.signal);
                y = H(S);
                break;
              }
              case "status-summary": {
                let S = await this.gitManager.getWorktreeRepository(r.params.cwd, c),
                  E =
                    S != null
                      ? await mi(S, r.params.includeUntrackedFiles, void 0, s.signal)
                      : { type: "error", failureReason: "repository_unavailable" };
                ((y = H(E)), (m = { operation: "status-summary", result: E }));
                break;
              }
              case "branch-diff-stats": {
                let S = await Lt(
                  AA(
                    String(r.params.cwd),
                    this.gitManager,
                    c,
                    r.params.baseBranch,
                    r.params.hideWhitespace,
                    r.params.includeUntrackedFiles,
                    tf(r.params.operationSource),
                  ),
                  s.signal,
                );
                ((y = H(S)), (m = { operation: "branch-diff-stats", result: S }));
                break;
              }
              case "review-summary": {
                let S = await this.gitManager.getWorktreeRepository(r.params.cwd, c),
                  E =
                    S == null
                      ? {
                          type: "error",
                          source: r.params.source,
                          failureReason: "repository_unavailable",
                        }
                      : await Lt(GFt(S, r.params, s.signal, o), s.signal);
                ((y = H(E)), (m = { operation: "review-summary", result: E }));
                break;
              }
              case "review-source-line-counts": {
                let S = await this.gitManager.getWorktreeRepository(r.params.cwd, c),
                  E;
                (S == null
                  ? (E = r.params.sources.map((T) => ({
                      source: T,
                      type: "error",
                      failureReason: "repository_unavailable",
                    })))
                  : (E = await Lt(
                      X2e({
                        ...r.params,
                        maxUntrackedFiles: tf(r.params.operationSource),
                        worktreeRepo: S,
                      }),
                      s.signal,
                    )),
                  (y = H(E)),
                  (m = { operation: "review-source-line-counts", result: E }));
                break;
              }
              case "review-diff": {
                let S = await this.gitManager.getWorktreeRepository(r.params.cwd, c),
                  E = U1e(S, r.params.snapshotGeneration),
                  T = G2e(r.params.source, r.params.files),
                  P = { type: "stale-snapshot", source: r.params.source },
                  M;
                if (E == null) M = P;
                else
                  try {
                    M = {
                      type: "success",
                      ...(await Lt(
                        QO(E, r.params.source, r.params.files, {
                          baseBranch: r.params.baseBranch,
                          commitSha: r.params.commitSha,
                          hideWhitespace: r.params.hideWhitespace,
                        }),
                        s.signal,
                      )),
                    };
                  } catch (L) {
                    M = L instanceof fs ? P : { type: "success", ...T };
                  }
                ((y = H(M)), (m = { operation: "review-diff", result: M }));
                break;
              }
              case "review-search": {
                let S = await Lt(
                  uFe(String(r.params.cwd), r.params.source, r.params.query, this.gitManager, c, {
                    baseBranch: r.params.baseBranch,
                    commitSha: r.params.commitSha,
                    includeUntrackedFiles: r.params.includeUntrackedFiles,
                    maxUntrackedFiles: tf(r.params.operationSource),
                    paths: r.params.paths,
                    signal: s.signal,
                  }),
                  s.signal,
                );
                ((y = H(S)), (m = { operation: "review-search", result: S }));
                break;
              }
              case "branch-range-patch": {
                let S = await this.gitManager.getWorktreeRepository(r.params.cwd, c);
                y = H(await kBe(S, r.params, s.signal));
                break;
              }
              case "review-patch": {
                let S = await Lt(
                  cN(
                    String(r.params.cwd),
                    r.params.source,
                    this.gitManager,
                    c,
                    void 0,
                    r.params.baseBranch,
                    r.params.commitSha,
                    tf(r.params.operationSource),
                  ),
                  s.signal,
                );
                ((y = H(S)), (m = { operation: "review-patch", result: S }));
                break;
              }
              case "synced-branch": {
                let S = await this.gitManager.getWorktreeRepository(r.params.cwd, c),
                  E =
                    S == null
                      ? { branch: null, base: null, hasConflicts: !1 }
                      : await $Fe(S, s.signal);
                y = H(E);
                break;
              }
              case "synced-branch-state": {
                let S = await KFe(r.params.cwd, this.gitManager, c, s.signal);
                y = H(S);
                break;
              }
              case "overwrite-repo": {
                let S = await DFe({
                  ...r.params,
                  gitManager: this.gitManager,
                  host: c,
                  signal: s.signal,
                });
                (S.status !== "command-error" && (h = r.params.targetRoot ?? r.params.gitRoot),
                  (y = H(S)));
                break;
              }
              case "invalidate-stable-metadata": {
                (this.gitManager.invalidateStableMetadata(), (y = H({ success: !0 })));
                break;
              }
              case "invalidate-git-read-caches": {
                let S = this.gitManager.getWorktreeRepositoryForRoot(r.params.root, c);
                (r.params.clearUntrackedPathsCache && Rn(S),
                  Ds(c.id) != null ? S.clearGitReadCaches() : S.clearShortLivedGitReadCaches(),
                  r.params.clearUntrackedPathsCache &&
                    this.liveQueryRegistry.refreshRepository(c.id, r.params.root),
                  (y = H({ success: !0 })));
                break;
              }
              case "dispose-git-init-watch": {
                (this.disposeGitInitWatcher(r.params.cwd, c), (y = H({ success: !0 })));
                break;
              }
              case "watch-repo": {
                let S = { commonDir: r.params.commonDir, root: r.params.root },
                  E = L5(this.watchesByKey.get(this.getWatchKey(S.root, c)), S.commonDir);
                (await jt(
                  {
                    attributes: {
                      "git.watcher_reused": E != null,
                      "worker.id": "git",
                      "worker.method": "watch-repo",
                    },
                    links: E?.startTrace == null ? [] : [E.startTrace],
                    name: "git.watcher_start",
                    op: "codex.git.watcher_start",
                  },
                  () => this.ensureWatching(S, c),
                ),
                  (y = H({ success: !0 })));
                break;
              }
              case "subscribe-live-query": {
                let S = await jt(
                  {
                    attributes: {
                      "git.operation": r.params.query.method,
                      "worker.id": "git",
                      "worker.method": "subscribe-live-query",
                    },
                    name: "git.subscription_setup",
                    op: "codex.git.subscription_setup",
                    trace: r.trace,
                  },
                  async () => {
                    let P = HFt(r.params.query),
                      M = yy(P, c),
                      L = typeof M == "string" ? M : await M;
                    if (L == null) throw new Error("Live Git query requires repository metadata");
                    let V = this.gitManager.getPendingStableMetadataTrace(L, c),
                      de = await jt(
                        {
                          attributes: {
                            "git.metadata_coalesced": V != null,
                            "git.operation": r.params.query.method,
                            "worker.id": "git",
                            "worker.method": "subscribe-live-query",
                          },
                          links: V == null ? [] : [V],
                          name: "git.metadata_lookup",
                          op: "codex.git.metadata_lookup",
                        },
                        () => this.gitManager.getStableMetadata(P, c, L),
                      );
                    if (s.signal.aborted) return null;
                    if (de == null) throw new Error("Live Git query requires repository metadata");
                    let ue = L5(this.watchesByKey.get(this.getWatchKey(de.root, c)), de.commonDir),
                      Ae = await jt(
                        {
                          attributes: {
                            "git.operation": r.params.query.method,
                            "git.watcher_reused": ue != null,
                            "worker.id": "git",
                            "worker.method": "subscribe-live-query",
                          },
                          links: ue?.startTrace == null ? [] : [ue.startTrace],
                          name: "git.watcher_start",
                          op: "codex.git.watcher_start",
                        },
                        () =>
                          this.ensureWatching(
                            de,
                            c,
                            s.signal,
                            r.params.query.method === "list-worktrees",
                          ),
                      );
                    return { metadata: de, releaseWatch: Ae };
                  },
                );
                if (S == null) {
                  y = H(void 0);
                  break;
                }
                let { metadata: E, releaseWatch: T } = S;
                try {
                  if (!s.signal.aborted) {
                    this.liveQueryRegistry.subscribe({
                      commonDir: E.commonDir,
                      host: c,
                      query: r.params.query,
                      requiresRecovery:
                        this.watchesByKey.get(this.getWatchKey(E.root, c))?.watcher
                          .requiresRecovery ?? !0,
                      root: E.root,
                      subscriptionId: r.params.subscriptionId,
                      trace: r.trace,
                    });
                    try {
                      await XFt(s.signal);
                    } finally {
                      this.liveQueryRegistry.unsubscribe(r.params.subscriptionId);
                    }
                  }
                } finally {
                  T();
                }
                y = H(void 0);
                break;
              }
              case "recover-live-queries": {
                let S =
                  r.params.cwd == null
                    ? null
                    : await this.gitManager.getStableMetadata(r.params.cwd, c);
                ((r.params.cwd == null || S != null) &&
                  (await this.liveQueryRegistry.recover({
                    hostId: c.id,
                    root: S?.root,
                    subscriptionIds: r.params.subscriptionIds,
                  })),
                  (y = H(void 0)));
                break;
              }
              case "unwatch-repo": {
                (this.unwatchRepo(r.params.root, c, { commonDir: r.params.commonDir }),
                  (y = H({ success: !0 })));
                break;
              }
              case "git-init-repo": {
                y = H(await TK(r.params, this.gitManager, c));
                break;
              }
              case "git-context": {
                let { cwd: S, reuseWatchedMetadata: E } = r.params,
                  T,
                  P = await QBe({
                    cwd: S,
                    gitManager: this.gitManager,
                    host: c,
                    timeoutMs: di().isLateTurnGitCapture ? 5e3 : void 0,
                    getReadPolicy: E
                      ? async (M) => {
                          let L = this.watchesByKey.get(this.getWatchKey(M, c));
                          return (
                            L?.isReady && L.refCount > 0 && !L.watcher.requiresRecovery
                              ? (T = await L.watcher.observeTurnGitContext())
                              : this.unavailableTurnContextWatches.add(
                                  this.gitManager.getWorktreeRepositoryForRoot(M, c),
                                ),
                            T?.readPolicy ?? "skip_unobserved"
                          );
                        }
                      : void 0,
                    signal: s.signal,
                  });
                (E && (P.turnObservation = T?.afterCapture() ?? "watch_unavailable"), (y = H(P)));
                break;
              }
              case "repository-identity": {
                let S = await this.gitManager.getWorktreeRepository(r.params.cwd, c);
                y = H(S == null ? null : await dN(S, { signal: s.signal }));
                break;
              }
              case "turn-diff-capture-start": {
                y = H(
                  await QFe({
                    host: c,
                    baseTurnId: r.params.baseTurnId,
                    checkpointKey: r.params.checkpointKey,
                    cwd: r.params.cwd,
                    gitManager: this.gitManager,
                    isRepoWatched: (S) => {
                      let E = this.watchesByKey.get(this.getWatchKey(S, c));
                      return E?.isReady === !0 && !E.watcher.requiresRecovery;
                    },
                    signal: s.signal,
                    turnId: r.params.turnId,
                  }),
                );
                break;
              }
              case "turn-diff-capture-complete": {
                y = H(
                  await e1e({
                    host: c,
                    capture: r.params.capture,
                    gitManager: this.gitManager,
                    retainCheckpoint: r.params.retainCheckpoint,
                    signal: s.signal,
                  }),
                );
                break;
              }
              case "commit-message-diff": {
                y = H(
                  await Lt(
                    qBe(r.params.cwd, r.params.includeUnstaged, this.gitManager, c),
                    s.signal,
                  ),
                );
                break;
              }
              case "submodule-paths": {
                let S = this.gitManager.getWorktreeRepositoryForRoot(r.params.root, c),
                  E = await pFe(S, s.signal);
                y = H({ paths: E });
                break;
              }
              case "cat-file": {
                let S = await this.gitManager.getWorktreeRepository(r.params.cwd, c),
                  E =
                    r.params.snapshotGeneration == null
                      ? void 0
                      : U1e(S, r.params.snapshotGeneration),
                  T =
                    S == null || (r.params.snapshotGeneration != null && E == null)
                      ? r.params.requests.map(() => ({ type: "error", error: { type: "unknown" } }))
                      : await hLe(
                          S,
                          {
                            maxObjectBytes: r.params.maxObjectBytes,
                            requests: r.params.requests,
                            reviewSnapshot: E,
                          },
                          s.signal,
                        );
                y = H(T);
                break;
              }
              case "blame-file": {
                let S = await RK(
                  this.gitManager,
                  { cwd: r.params.cwd, path: r.params.path },
                  c,
                  s.signal,
                );
                y = H(S);
                break;
              }
              case "index-info": {
                let S = await this.gitManager.getWorktreeRepository(r.params.cwd, c),
                  E = S == null ? { lastModified: 0 } : await rFe(S, s.signal);
                y = H(E);
                break;
              }
              case "config-value": {
                let E = await this.gitManager
                  .getWorktreeRepositoryForRoot(r.params.root, c)
                  .getConfigValueForScope(r.params.key, r.params.scope, s.signal);
                y = H({ value: E });
                break;
              }
              case "git-origins": {
                let S = Date.now(),
                  { origins: E } = await FO(r.params.dirs, this.gitManager, c);
                (ef().info("[git-origins] worker-complete", {
                  safe: {
                    dirCount: r.params.dirs.length,
                    originCount: E.length,
                    elapsedMs: Date.now() - S,
                    hostId: l.id,
                  },
                  sensitive: {},
                }),
                  (y = H({ origins: E })));
                break;
              }
              case "set-config-value": {
                let E = await this.gitManager
                  .getWorktreeRepositoryForRoot(r.params.root, c)
                  .setConfigValueForScope(r.params.key, r.params.value, r.params.scope, s.signal);
                (E && (r.params.scope !== "worktree" || r.params.key !== _g) && (h = r.params.root),
                  (y = H({ success: E })));
                break;
              }
              case "create-worktree": {
                y = await this.handleCreateWorktree(r.params, { host: c, signal: s.signal });
                break;
              }
              case "cancel-worktree-upstream-refresh": {
                let S = this.worktreeUpstreamRefreshAbortControllers.get(
                  r.params.pendingWorktreeId,
                );
                (S?.abort(), (y = H({ success: S != null })));
                break;
              }
              case "codex-worktrees": {
                try {
                  let S = await NBe(
                    this.gitManager,
                    c,
                    r.params.worktreesRoot,
                    r.params.requireReadableDirectories,
                  );
                  y = H({ worktrees: S });
                } catch (S) {
                  let E = S instanceof Error ? S.message : String(S);
                  y = Hp(E);
                }
                break;
              }
              case "list-worktrees": {
                y = H(await this.getWorktrees(r.params.cwd, c, s.signal));
                break;
              }
              case "resolve-worktree-for-thread": {
                y = await a2e(
                  r.params.cwd,
                  r.params.conversationId,
                  this.gitManager,
                  c,
                  r.params.threadCwd,
                  s.signal,
                  r.params.worktreesRoot,
                );
                break;
              }
              case "worktree-snapshot-ref": {
                let S = await jO(
                  this.gitManager,
                  r.params.candidateRoots,
                  r.params.worktreePath,
                  c,
                  s.signal,
                );
                y = H(S);
                break;
              }
              case "managed-worktree-state": {
                y = H(
                  await hFe(
                    this.gitManager,
                    r.params.candidateRoots,
                    r.params.cwd,
                    r.params.worktreePath,
                    c,
                    s.signal,
                  ),
                );
                break;
              }
              case "restore-worktree": {
                let S = await this.scheduleWorktreeRestore(
                  r.params.repoRoot,
                  r.params.worktreePath,
                  r.params.cwd,
                  c,
                  s.signal,
                );
                if (S)
                  try {
                    await FK(
                      this.gitManager.getWorktreeRepositoryForRoot(r.params.worktreePath, c),
                      r.params.conversationId,
                      s.signal,
                    );
                  } catch (E) {
                    ef().warning(
                      "[worktree-restore] failed to set restored worktree owner thread",
                      {
                        safe: {
                          worktreePath: r.params.worktreePath,
                          conversationId: r.params.conversationId,
                        },
                        sensitive: { error: E },
                      },
                    );
                  }
                y = H({ success: S });
                break;
              }
              case "delete-worktree": {
                try {
                  let S = await this.scheduleWorktreeDelete(r.params, c);
                  (this.unwatchRepo(r.params.worktree, c), (y = H({ success: !0, worktreeId: S })));
                } catch (S) {
                  if (
                    (S instanceof Jm && r.params.reason !== "archive-cleanup") ||
                    (!(S instanceof pd) && !(S instanceof Jm))
                  )
                    throw S;
                  y = H({
                    success: !1,
                    reason: S instanceof Jm ? "deletion-failed" : "unsupported-nested-repository",
                  });
                }
                break;
              }
              case "set-worktree-owner-thread": {
                try {
                  (await FK(
                    this.gitManager.getWorktreeRepositoryForRoot(r.params.worktree, c),
                    r.params.conversationId,
                    s.signal,
                  ),
                    (y = H({ success: !0 })));
                } catch {
                  y = Hp("Failed to set thread worktree owner");
                }
                break;
              }
              case "move-thread-to-local": {
                let S = r.params.operationId ?? String(r.id);
                y = await RFe(r.params, {
                  host: c,
                  gitManager: this.gitManager,
                  signal: s.signal,
                  onProgress: (E, T) => {
                    this.emit({
                      type: "worker-event",
                      event: {
                        type: "thread-handoff-progress",
                        operationId: S,
                        direction: "to-local",
                        step: E,
                        status: T,
                      },
                    });
                  },
                });
                break;
              }
              case "move-thread-to-worktree": {
                let S = r.params.operationId ?? String(r.id);
                y = await CFe(r.params, {
                  host: c,
                  gitManager: this.gitManager,
                  signal: s.signal,
                  onProgress: (E, T) => {
                    this.emit({
                      type: "worker-event",
                      event: {
                        type: "thread-handoff-progress",
                        operationId: S,
                        direction: "to-worktree",
                        step: E,
                        status: T,
                      },
                    });
                  },
                });
                break;
              }
              case "move-thread-to-host-worktree": {
                let S = r.params.operationId ?? String(r.id),
                  E = this.dependencies.createExecutionHost(r.params.destinationHostConfig);
                try {
                  y = await wFe(r.params, {
                    gitManager: this.gitManager,
                    sourceHost: c,
                    destinationHost: E,
                    signal: s.signal,
                    onProgress: (T, P) => {
                      this.emit({
                        type: "worker-event",
                        event: {
                          type: "thread-handoff-progress",
                          operationId: S,
                          direction: "to-host-worktree",
                          step: T,
                          status: P,
                        },
                      });
                    },
                  });
                } finally {
                  (this.gitManager.invalidateUntrackedPathsCache(E),
                    this.gitManager.invalidateShortLivedGitReadCaches(E));
                }
                break;
              }
              case "cleanup-host-handoff-transfer": {
                (await _Fe(r.params.rolloutPath, c), (y = H({ success: !0 })));
                break;
              }
              case "apply-changes": {
                let S = await E2e({
                  ...r.params,
                  gitManager: this.gitManager,
                  host: c,
                  signal: s.signal,
                });
                (S.status !== "command-error" && (h = r.params.destinationRoot), (y = H(S)));
                break;
              }
              case "apply-patch": {
                let S = await id(r.params, this.gitManager, c, { signal: s.signal });
                ((S.status !== "error" || S.appliedPaths.length > 0) && (h = r.params.cwd),
                  (y = H(S)));
                break;
              }
              case "apply-review-section-changes": {
                let S = await pBe({
                  ...r.params,
                  gitManager: this.gitManager,
                  host: c,
                  signal: s.signal,
                });
                ((S.status !== "error" || S.appliedPaths.length > 0) && (h = r.params.cwd),
                  (y = H(S)));
                break;
              }
              case "commit": {
                let S = await this.gitManager.getWorktreeRepository(r.params.cwd, c);
                S != null && Rn(S);
                let E = S?.root ?? String(r.params.cwd);
                if (r.params.includeUnstaged) {
                  let L = S
                    ? await ud({
                        gitRoot: S.root,
                        env: c.isLocal ? process.env : {},
                        signal: s.signal,
                        host: c,
                        untrackedPathsPromise: qn(S),
                      })
                    : await I(E, ["add", "-A"], c, { signal: s.signal });
                  if (!L.success) {
                    let V = L.stderr || L.stdout || "Failed to stage changes";
                    y = H({
                      status: "error",
                      error: V,
                      execOutput: Nt({
                        command: L.command,
                        stdout: L.stdout,
                        stderr: L.stderr,
                        fallbackOutput: V,
                      }),
                    });
                    break;
                  }
                  h = r.params.cwd;
                }
                let T = await I(
                  E,
                  ["commit", "-m", gBe(r.params.message, hBe(r.params.commitAttribution))],
                  c,
                  { signal: s.signal },
                );
                if (!T.success) {
                  let L = T.stderr || T.stdout || "Failed to commit changes",
                    V = await I(E, ["diff", "--cached", "--quiet", "--exit-code"], c, {
                      signal: s.signal,
                    });
                  y = H({
                    status: "error",
                    error: L,
                    errorType: V.success ? "nothing-to-commit" : void 0,
                    execOutput: Nt({
                      command: T.command,
                      stdout: T.stdout,
                      stderr: T.stderr,
                      fallbackOutput: L,
                    }),
                  });
                  break;
                }
                let P =
                    r.params.includeCommitSha === !1
                      ? null
                      : await I(E, ["rev-parse", "HEAD"], c, { signal: s.signal }),
                  M = P?.success ? P.stdout : null;
                ((h = r.params.cwd), (y = H({ status: "success", commitSha: M })));
                break;
              }
            }
          } catch (S) {
            ((f = G1e(S)),
              (y =
                S === CN && r.method === "stable-metadata"
                  ? H(null)
                  : S === CN && r.method === "git-origins"
                    ? H({ origins: [] })
                    : Hp(S)));
          } finally {
            let S = zFt(r);
            if (
              (S?.type === "exact"
                ? await this.gitManager.invalidateUntrackedPathsCacheForCwd(S.cwd, c)
                : S?.type === "host" && this.gitManager.invalidateUntrackedPathsCache(c),
              VFt(r.method))
            ) {
              let E = jFt(r);
              if (E != null)
                try {
                  await this.gitManager.invalidateGitReadCachesForMutation(E, c);
                } catch {}
            }
            if (h != null)
              try {
                let E = await this.gitManager.getStableMetadata(h, c);
                if (E != null) {
                  let T = this.gitManager.getWorktreeRepositoryForRoot(E.root, c);
                  (Rn(T), await this.liveQueryRegistry.refreshRepository(c.id, E.root));
                }
              } catch {}
            (v ? this.inFlightRequests.delete(r.id) : this.uncancelableRequestIds.delete(r.id),
              this.canceledRequests.delete(r.id));
          }
          if (v && s.signal.aborted) {
            (this.emitGitPerformanceOperation({
              attribution: o,
              canceled: !0,
              durationMs: Date.now() - i,
              host: c,
              operation: n,
              queueDurationMs: r.enqueuedAtMs == null ? null : Math.max(0, i - r.enqueuedAtMs),
              repoIndexSizeBucket: p,
              result: m,
              resultDisposition: "canceled",
              reviewSource: B5(r),
              source: r.params.operationSource,
              trigger: "request",
            }),
              n == null && Ia("canceled"));
            return;
          }
          n == null && ZFt(y) && Ia("failure");
          let w = fo() ?? r.trace,
            _ = {
              ...(w == null ? {} : { emittedAtMs: Date.now(), trace: w }),
              id: r.id,
              method: r.method,
              result: y,
            };
          (this.emitGitPerformanceOperation({
            attribution: o,
            canceled: !1,
            durationMs: Date.now() - i,
            host: c,
            operation: n,
            queueDurationMs: r.enqueuedAtMs == null ? null : Math.max(0, i - r.enqueuedAtMs),
            repoIndexSizeBucket: p,
            result: m,
            resultDisposition: f ?? void 0,
            reviewSource: B5(r),
            source: r.params.operationSource,
            trigger: "request",
          }),
            this.emit({ type: "worker-response", response: _ }));
        }
        async deleteWorktreeWithLimit(r, n) {
          let o = await eo(r.worktree);
          ef().info("[worktree-delete] worker-start", {
            safe: { worktreeId: o },
            sensitive: {
              reason: r.reason,
              force: r.force ?? !1,
              hasHostConfig: r.hostConfig != null,
            },
          });
          try {
            await vBe(this.gitManager, r.worktree, n, r.reason, r.force ?? !1, r.skipCleanupScript);
          } catch (i) {
            throw (
              i instanceof pd ||
                ef().warning("[worktree-delete] worker-failed", {
                  safe: { worktreeId: o },
                  sensitive: { error: i },
                }),
              i
            );
          }
          return (
            ef().info("[worktree-delete] worker-success", {
              safe: { worktreeId: o },
              sensitive: { reason: r.reason, force: r.force ?? !1 },
            }),
            o
          );
        }
        async scheduleWorktreeDelete(r, n) {
          let i = `${fn(n)}|${r.worktree}`,
            s = this.worktreeDeletePromises.get(i);
          if (s) return s;
          let a = this.deleteWorktreeWithLimit(r, n);
          this.worktreeDeletePromises.set(i, a);
          try {
            return await a;
          } finally {
            this.worktreeDeletePromises.delete(i);
          }
        }
        async scheduleWorktreeRestore(r, n, o, i, s) {
          let a = `${fn(i)}|${n}`,
            c = (this.worktreeRestorePromises.get(a) ?? Promise.resolve(!0))
              .catch(() => !0)
              .then(() => g2e(r, n, o, i, s));
          this.worktreeRestorePromises.set(a, c);
          try {
            return await c;
          } finally {
            this.worktreeRestorePromises.get(a) === c && this.worktreeRestorePromises.delete(a);
          }
        }
        async handleResolveStableMetadata(r, { host: n }) {
          let o = await this.gitManager.getStableMetadata(r.cwd, n);
          return o == null
            ? (r.watchForGitInit === !0
                ? await this.ensureWatchingForGitInit(r.cwd, n)
                : r.watchForGitInit === !1 && this.disposeGitInitWatcher(r.cwd, n),
              H(null))
            : (r.watchForGitInit != null && this.disposeGitInitWatcher(r.cwd, n), H(o));
        }
        async handleUpstreamBranch(r, { host: n, signal: o }) {
          let i = this.gitManager.getWorktreeRepositoryForRoot(r, n),
            s = await Cr(i),
            a = await nA(i, s ?? "HEAD", o);
          return a ? { branch: s, upstream: { branch: a } } : { branch: s, upstream: null };
        }
        async handleBranchAheadCount(r, { host: n, signal: o }) {
          let i = this.gitManager.getWorktreeRepositoryForRoot(r, n),
            s = await gn(i),
            a = s?.branch ?? null,
            l = s?.remote ?? null;
          l == null && (l = (await hn(i))[0] ?? null);
          let c = await Cr(i),
            u = await nA(i, c ?? "HEAD", o),
            p = l != null && u?.startsWith(`remotes/${l}/`) ? u.slice(8) : u;
          if (
            l != null &&
            p?.startsWith(`${l}/`) &&
            (
              await I(i.root, ["merge-base", "--is-ancestor", "HEAD", `refs/remotes/${p}`], n, {
                allowedNonZeroExitCodes: [1, 128],
                signal: o,
              })
            ).code === 0
          )
            return { commitsAhead: 0 };
          if (l != null) {
            let h = await aN(i, ["HEAD", "--not", `--remotes=${l}`], o);
            if (h != null) return { commitsAhead: h };
          }
          if (u != null) return { commitsAhead: (await aN(i, [`${u}..HEAD`], o)) ?? 0 };
          if (a == null) return { commitsAhead: 0 };
          let m = a.includes("/") ? a : l != null ? `${l}/${a}` : a,
            f = await ll(i, m);
          return f == null
            ? { commitsAhead: 0 }
            : { commitsAhead: (await aN(i, [`${f}..HEAD`], o)) ?? 0 };
        }
        async getDefaultBranch(r, n, o, { live: i = !1 } = {}) {
          let s = this.gitManager.getWorktreeRepositoryForRoot(r, n),
            l = (await gn(s))?.branch ?? null;
          return (
            l ||
              (l =
                (await fN(s, 10, o, { live: i })).find((u) => u === "main" || u === "master") ??
                null),
            { branch: l }
          );
        }
        async getBaseBranch(r, n) {
          let o = this.gitManager.getWorktreeRepositoryForRoot(r, n),
            i = await gn(o);
          return { local: i?.branch ?? null, remote: i?.remote ?? null };
        }
        async getCurrentBranch(r, n, o) {
          let i = this.gitManager.getWorktreeRepositoryForRoot(r, n),
            s = await wc(i, o);
          return {
            branch: s.type === "branch" ? s.branch : null,
            isDetached: s.type === "detached",
          };
        }
        async getWorktrees(r, n, o) {
          let i = await this.gitManager.getWorktreeRepository(r, n);
          return { worktrees: i == null ? [] : await Zs(i, o) };
        }
        async handleRecentBranches(r, { host: n, signal: o }) {
          let i = Math.max(1, Math.min(r.limit ?? 10, 100)),
            s = this.gitManager.getWorktreeRepositoryForRoot(r.root, n),
            a = await fN(s, i, o);
          return H({ branches: a });
        }
        async handleSearchBranches(r, { host: n, signal: o }) {
          let i = await NFe({
            worktreeRepo: this.gitManager.getWorktreeRepositoryForRoot(r.root, n),
            query: r.query,
            limit: r.limit ?? 20,
            preserveRemoteRefs: r.preserveRemoteRefs,
            signal: o,
          });
          return H(i);
        }
        async handleCreateWorktree(r, { host: n, signal: o }) {
          let i = this.emit.bind(this),
            s = r.streamId,
            a = new AbortController();
          r.pendingWorktreeId != null &&
            this.worktreeUpstreamRefreshAbortControllers.set(r.pendingWorktreeId, a);
          let l = await uA({
            gitManager: this.gitManager,
            workspaceRoot: r.cwd,
            approvedSource: r.approvedSource,
            name: r.name,
            startingState: r.startingState,
            useExactStartingRef: r.useExactStartingRef,
            upstreamRefreshMode: r.upstreamRefreshMode,
            localEnvironmentConfigPath: r.localEnvironmentConfigPath,
            allowSetupFailure: r.allowSetupFailure,
            setUpSyncedBranch: r.setUpSyncedBranch ?? !0,
            host: n,
            signal: o,
            upstreamRefreshSignal: a.signal,
            worktreesRoot: r.worktreesRoot,
            useWorkspaceDir: r.useWorkspaceDir,
            onWorktreePathAllocated: (c) => {
              o.aborted ||
                i({
                  type: "worker-event",
                  event: {
                    type: "create-worktree-path",
                    hostId: n.id,
                    streamId: s,
                    worktreeGitRoot: c,
                  },
                });
            },
            onSetupStart: () => {
              o.aborted ||
                i({
                  type: "worker-event",
                  event: { type: "create-worktree-setup-started", streamId: s },
                });
            },
            onLog: (c, u) => {
              o.aborted ||
                i({
                  type: "worker-event",
                  event: { type: "create-worktree-stream", streamId: s, stream: c, data: u },
                });
            },
          }).finally(() => {
            r.pendingWorktreeId != null &&
              this.worktreeUpstreamRefreshAbortControllers.get(r.pendingWorktreeId) === a &&
              this.worktreeUpstreamRefreshAbortControllers.delete(r.pendingWorktreeId);
          });
          return l.success
            ? H({
                worktreeGitRoot: l.worktreeGitRoot,
                worktreeWorkspaceRoot: l.worktreeWorkspaceRoot,
                setupError: l.setupError?.message ?? null,
              })
            : Hp(l.error.message);
        }
        getWatchKey(r, n) {
          return `${fn(n)}|${r}`;
        }
        async runLiveQueryWithAttribution(r, n, o, i, s, a, l, c, u, p) {
          return jt(
            {
              attributes: {
                "git.operation": r.method,
                "git.trigger": a,
                "worker.id": "git",
                "worker.method": "subscribe-live-query",
              },
              name: "git.worker_operation",
              op: "codex.git.live_query",
              links: u,
              trace: c,
            },
            async () => {
              let m = C5(r.method),
                f = q1e(r.params.operationSource, a);
              if (m == null)
                return Xr(
                  {
                    metadataCommonDir: l,
                    source: r.params.operationSource,
                    requestKind: r.method,
                    startPriority: f,
                  },
                  () => this.runLiveQuery(r, n, o, i, s),
                );
              let h = S3(),
                v = Date.now(),
                y = null,
                w,
                _ = null;
              try {
                return await Xr(
                  {
                    attribution: h,
                    metadataCommonDir: l,
                    source: r.params.operationSource,
                    requestKind: r.method,
                    startPriority: f,
                  },
                  async () => {
                    let S = W1e(
                      await this.runLiveQuery(r, n, o, i, (E) => {
                        ((y = y ?? Date.now() - v), s(W1e(E, h)));
                      }),
                      h,
                    );
                    return ((w = u1e(S)), S);
                  },
                );
              } catch (S) {
                throw ((_ = G1e(S)), S);
              } finally {
                let S = Date.now() - v;
                (this.emitGitPerformanceOperation({
                  attribution: h,
                  canceled: i.aborted,
                  durationMs: S,
                  firstResultMs: y ?? S,
                  host: o,
                  operation: m,
                  queueDurationMs: null,
                  repoIndexSizeBucket: this.getGitPerformanceRepoIndexSizeBucket(n, o),
                  result: w,
                  resultDisposition: i.aborted ? "canceled" : (_ ?? void 0),
                  reviewSource: r.method === "review-summary" ? r.params.source : null,
                  retryAttempt: p,
                  source: r.params.operationSource,
                  trigger: a,
                }),
                  qM(h));
              }
            },
          );
        }
        emitGitPerformanceOperation({
          attribution: r,
          canceled: n,
          durationMs: o,
          firstResultMs: i = null,
          host: s,
          operation: a,
          queueDurationMs: l,
          repoIndexSizeBucket: c,
          result: u,
          resultDisposition: p = u == null ? null : "completed",
          reviewSource: m,
          retryAttempt: f = null,
          source: h,
          trigger: v,
        }) {
          if (r == null || a == null) return;
          qM(r);
          let y = u?.operation === "review-diff" ? Ys(u) : void 0,
            w = d1e({
              attribution: r,
              canceled: n,
              durationMs: o,
              firstResultMs: i,
              hostKind: s.isLocal ? "local" : "remote",
              operation: a,
              queueDurationMs: l,
              repoIndexSizeBucket: c,
              result: u,
              resultDisposition: p,
              resultFields: y,
              reviewSource: m,
              retryAttempt: f,
              source: h,
              trigger: v,
            }),
            _ = w.outcome,
            S = _ === "expected" ? "git.reason" : "git.failure_reason";
          (e_({
            "git.command_count": w.commandCount,
            "git.failed_command_count": w.failedCommandCount,
            ...(w.failedCommandDurationMs == null
              ? {}
              : { "git.failed_command.duration_ms": w.failedCommandDurationMs }),
            ...(w.failedCommandErrorKind == null
              ? {}
              : { "git.failed_command.error_kind": w.failedCommandErrorKind }),
            ...(w.failedCommandExitCodeBucket == null
              ? {}
              : { "git.failed_command.exit_code_bucket": w.failedCommandExitCodeBucket }),
            ...(w.failedCommandFailureKind == null
              ? {}
              : { "git.failed_command.failure_kind": w.failedCommandFailureKind }),
            ...(w.failedCommandSubcommand == null
              ? {}
              : { "git.failed_command.subcommand": w.failedCommandSubcommand }),
            ...(w.reason == null ? {} : { [S]: w.reason }),
            ...(w.resultDisposition == null
              ? {}
              : { "git.result_disposition": w.resultDisposition }),
            ...(w.resultFailureReason == null
              ? {}
              : { "git.result_failure_reason": w.resultFailureReason }),
            ...(w.retryAttempt == null ? {} : { "git.retry_attempt": w.retryAttempt }),
          }),
            _ !== "success" && Ia(_));
          let E = p1e(_, r, o, Math.random);
          if (E == null) return;
          let T = jye();
          this.emit({
            type: "worker-event",
            event: { type: "git-performance-operation", ...w, ...E, ...T },
          });
        }
        async runLiveQuery(r, n, o, i, s) {
          switch (r.method) {
            case "status-summary": {
              let a = this.gitManager.getWorktreeRepositoryForRoot(n, o);
              if (!r.params.includeUntrackedFiles)
                return { method: "status-summary", result: await mi(a, !1, void 0, i) };
              let l = await mi(a, !1, void 0, i);
              return (
                s({ method: "status-summary", result: l }),
                l.type === "error"
                  ? { method: "status-summary", result: l }
                  : { method: "status-summary", result: await mi(a, !0, void 0, i) }
              );
            }
            case "review-summary": {
              let a = this.gitManager.getWorktreeRepositoryForRoot(n, o),
                l = tf(r.params.operationSource),
                c = null;
              if (
                r.params.includeUntrackedFiles !== !1 &&
                (r.params.source === "branch" ||
                  r.params.source === "uncommitted" ||
                  r.params.source === "unstaged")
              ) {
                let p = await dv({
                  ...r.params,
                  includeUntrackedFiles: !1,
                  maxUntrackedFiles: l,
                  worktreeRepo: a,
                });
                if (
                  (p.type === "success" &&
                    p.files.length > 0 &&
                    ((c = p), s({ method: "review-summary", result: p })),
                  p.type !== "success")
                )
                  return { method: "review-summary", result: p };
                let m = await dv({ ...r.params, maxUntrackedFiles: l, worktreeRepo: a });
                return {
                  method: "review-summary",
                  result:
                    m.type === "error" &&
                    m.failureReason !== "unsupported_filename_encoding" &&
                    c != null
                      ? c
                      : m,
                };
              }
              return {
                method: "review-summary",
                result: await dv({ ...r.params, maxUntrackedFiles: l, worktreeRepo: a }),
              };
            }
            case "branch-diff-stats": {
              let a = tf(r.params.operationSource);
              return r.params.includeUntrackedFiles
                ? {
                    method: "branch-diff-stats",
                    result: await WFt(
                      () =>
                        AA(
                          r.params.cwd,
                          this.gitManager,
                          o,
                          r.params.baseBranch,
                          r.params.hideWhitespace,
                          !1,
                          a,
                        ),
                      () =>
                        AA(
                          r.params.cwd,
                          this.gitManager,
                          o,
                          r.params.baseBranch,
                          r.params.hideWhitespace,
                          !0,
                          a,
                        ),
                      (c) => s({ method: "branch-diff-stats", result: c }),
                    ),
                  }
                : {
                    method: "branch-diff-stats",
                    result: await AA(
                      r.params.cwd,
                      this.gitManager,
                      o,
                      r.params.baseBranch,
                      r.params.hideWhitespace,
                      r.params.includeUntrackedFiles,
                      a,
                    ),
                  };
            }
            case "recent-branches": {
              let a = Math.max(1, Math.min(r.params.limit ?? 10, 100)),
                l = this.gitManager.getWorktreeRepositoryForRoot(n, o),
                c = this.watchesByKey.get(this.getWatchKey(n, o));
              return {
                method: "recent-branches",
                result: {
                  branches: await fN(l, a, i, { live: c != null && !c.watcher.requiresRecovery }),
                },
              };
            }
            case "current-branch":
              return {
                method: "current-branch",
                result: await this.getCurrentBranch(r.params.root, o, {
                  signal: i,
                  throwOnGitUnavailable: !0,
                }),
              };
            case "upstream-branch":
              return {
                method: "upstream-branch",
                result: await this.handleUpstreamBranch(r.params.root, { host: o, signal: i }),
              };
            case "branch-ahead-count":
              return {
                method: "branch-ahead-count",
                result: await this.handleBranchAheadCount(r.params.root, { host: o, signal: i }),
              };
            case "default-branch": {
              let a = this.watchesByKey.get(this.getWatchKey(n, o));
              return {
                method: "default-branch",
                result: await this.getDefaultBranch(r.params.root, o, i, {
                  live: a != null && !a.watcher.requiresRecovery,
                }),
              };
            }
            case "base-branch":
              return { method: "base-branch", result: await this.getBaseBranch(r.params.root, o) };
            case "branch-commits": {
              let a = this.gitManager.getWorktreeRepositoryForRoot(n, o),
                l = this.watchesByKey.get(this.getWatchKey(n, o));
              return {
                method: "branch-commits",
                result: {
                  commits: await l5(a, r.params.baseBranch, i, {
                    live: l != null && !l.watcher.requiresRecovery,
                  }),
                },
              };
            }
            case "list-worktrees":
              return {
                method: "list-worktrees",
                result: await this.getWorktrees(r.params.cwd, o, i),
              };
          }
        }
        getGitPerformanceRepoIndexSizeBucket(r, n) {
          let o = n.isLocal ? Br.default : Br.default.posix;
          for (let i of this.watchesByKey.values()) {
            if (i.hostId !== n.id) continue;
            let s = o.relative(i.root, r);
            if (s === "" || (s !== ".." && !s.startsWith(`..${o.sep}`)))
              return i.repoIndexSizeBucket;
          }
          return "unknown";
        }
        async ensureWatching(r, n, o, i = !1) {
          if (o?.aborted) return () => {};
          let s = this.getWatchKey(r.root, n),
            a = this.watchesByKey.get(s),
            l =
              L5(a, r.commonDir) ??
              this.createRepoWatch(r, n, a == null ? void 0 : this.closeRepoWatch(a, n, !1));
          l.refCount += 1;
          let c = !1,
            u = () => {
              c ||
                ((c = !0),
                o?.removeEventListener("abort", u),
                this.unwatchRepo(r.root, n, { watch: l }));
            };
          o?.addEventListener("abort", u, { once: !0 });
          try {
            return (await l.startPromise, i && !c && (await l.watcher.enableWorktreeTopology()), u);
          } catch (p) {
            throw (u(), p);
          }
        }
        createRepoWatch(r, n, o) {
          let i = this.getWatchKey(r.root, n),
            s = new Map(),
            a = !1,
            l = async (_) => {
              if (
                !(w.refCount <= 0 || w.closingPromise != null || this.watchesByKey.get(i) !== w)
              ) {
                if (_.type === "worker-event" && _.event.type === "git-repo-changed") {
                  let S = _.event,
                    E = pt();
                  return (
                    jt(
                      {
                        attributes: {
                          "git.change_type": S.changeType,
                          "git.changed_path_count": S.changedPaths?.length ?? 0,
                          "git.full_invalidation":
                            S.changeType === "working-tree" && S.changedPaths == null,
                          "worker.id": "git",
                        },
                        name: "desktop.git_invalidation",
                        op: "codex.git.invalidation",
                        root: !0,
                      },
                      async () => {
                        let P = this.gitManager.getWorktreeRepositoryForRoot(S.root, n),
                          M = S.changedPaths;
                        if (S.changeType === "working-tree")
                          if (S.changedPaths == null) Rn(P);
                          else {
                            let X = await eLe(P, S.changedPaths, (G) =>
                              w.watcher.observeIgnoredDirectories(G),
                            );
                            switch (X.type) {
                              case "filtered":
                                M = X.changedPaths;
                                break;
                              case "full":
                                M = void 0;
                                break;
                              case "unfiltered":
                                break;
                            }
                          }
                        else (S.changeType === "config" || S.changeType === "index") && Rn(P);
                        if (
                          w.refCount <= 0 ||
                          w.closingPromise != null ||
                          this.watchesByKey.get(i) !== w
                        ) {
                          E.resolve(void 0);
                          return;
                        }
                        let L =
                            S.changeType === "working-tree" && M !== S.changedPaths
                              ? { ...S, changedPaths: M }
                              : S,
                          V = L.changeType !== "working-tree" || L.changedPaths?.length !== 0,
                          de = fo(),
                          ue = de == null ? L : { ...L, trace: de },
                          Ae = 0,
                          ge = null;
                        V &&
                          (P.invalidateGitReadCachesForRepoChange(
                            L.changeType,
                            L.changeType === "working-tree" ? L.changedPaths : void 0,
                          ),
                          (ge = this.liveQueryRegistry.handleRepoChanged(ue, (X) => {
                            Ae = X;
                          })));
                        let Pe = S.changedPaths?.length ?? 0,
                          Q = s.get(L.changeType) ?? 1;
                        (s.delete(L.changeType),
                          this.watcherPerformance.record({
                            changeType: L.changeType,
                            changedPathCount: Pe,
                            filteredPathCount: Math.max(0, Pe - (L.changedPaths?.length ?? 0)),
                            fullInvalidation:
                              L.changeType === "working-tree" && L.changedPaths == null,
                            hostKind: n.isLocal ? "local" : "remote",
                            invalidated: V,
                            rawEventCount: Q,
                            repoIndexSizeBucket: this.getGitPerformanceRepoIndexSizeBucket(
                              r.root,
                              n,
                            ),
                            refreshFanoutCount: Ae,
                            requiresRecovery: a,
                          }),
                          this.emit({
                            ..._,
                            event: de == null ? L : { ...L, emittedAtMs: Date.now(), trace: de },
                          }),
                          E.resolve(void 0),
                          await ge);
                      },
                    ).catch((P) => {
                      E.reject(P);
                    }),
                    E.promise
                  );
                }
                this.emit(_);
              }
            },
            c = this.gitManager.getWorktreeRepositoryForRoot(r.root, n),
            u = () => {
              c.queryClient.removeQueries({
                queryKey: ne(r.root, n, "effective-origin-url"),
                exact: !0,
              });
            },
            p = (_) => {
              if (
                (_ === "watch_unavailable" && this.unavailableTurnContextWatches.add(c),
                _ === "watch_ready")
              ) {
                if (
                  !this.unavailableTurnContextWatches.has(c) ||
                  !w.isReady ||
                  w.watcher.requiresRecovery
                )
                  return;
                this.unavailableTurnContextWatches.delete(c);
              }
              this.emit({
                type: "worker-event",
                event: {
                  type: "git-context-observation-invalidated",
                  commonDir: r.commonDir,
                  hostId: n.id,
                  reason: _,
                  root: r.root,
                },
              });
            },
            m = (_) => {
              w.refCount <= 0 ||
                w.closingPromise != null ||
                this.watchesByKey.get(i) !== w ||
                ((a = _),
                c.invalidateWatchScopedGitReadCaches(),
                u(),
                this.liveQueryRegistry.setRequiresRecovery(n.id, r.root, _),
                _ || p("watch_ready"));
            },
            f = ({ changeType: _, rawEventCount: S }) => {
              s.set(_, S);
            },
            h = this.dependencies.startWorkingTreeWatch,
            v = {
              commonDir: r.commonDir,
              root: r.root,
              host: n,
              watchIgnoreSources: n.isLocal
                ? this.dependencies.getWatchIgnoreSources?.(r.root)
                : void 0,
              isLocalBranchDependency: (_) =>
                this.liveQueryRegistry.hasLocalBranchDependency({
                  branch: _,
                  commonDir: r.commonDir,
                  hostId: n.id,
                  root: r.root,
                }),
              worktreeRepo: c,
              onRequiresRecoveryChanged: m,
              onCoalescedChange: f,
              onTurnContextInvalidated: p,
              emit: l,
              startMetadataWatch: (_) => this.metadataWatches.start(n, _),
              startWorkingTreeWatch: h == null ? void 0 : (_, S) => h(n, _, S),
            },
            y = this.dependencies.createGitRepoWatcher?.(v) ?? new EN(v),
            w = {
              commonDir: r.commonDir,
              closingPromise: null,
              hostId: n.id,
              isReady: !1,
              repoIndexSizeBucket: "unknown",
              refCount: 0,
              releaseRepository: this.gitManager.retainWorktreeForWatch(c),
              root: r.root,
              startPromise: Promise.resolve(),
              startTrace: void 0,
              watcher: y,
            };
          return (
            u(),
            this.watchesByKey.set(i, w),
            (w.startPromise = this.scheduleWatchSetup(w, n, () => p("watch_ready"), o)),
            w
          );
        }
        async ensureWatchingForGitInit(r, n, o = "detect-git-path") {
          let i = this.getGitInitWatchKey(r, n);
          if (this.desiredGitInitWatchKey === i) return;
          (this.disposeGitInitWatcher(),
            (this.desiredGitInitWatchKey = i),
            (await this.startGitInitWatcher(r, n, o)) === "failed" &&
              this.desiredGitInitWatchKey === i &&
              (this.desiredGitInitWatchKey = null));
        }
        async startGitInitWatcher(r, n, o) {
          let i = this.getGitInitWatchKey(r, n);
          this.disposeActiveGitInitWatcher();
          let s = new bN({
            cwd: r,
            host: n,
            onGitInit: () => {
              this.handleGitInit(r, n, s).catch((l) => {
                ef().warning("Failed to refresh git metadata after git init", {
                  safe: {},
                  sensitive: { cwd: r, error: l },
                });
              });
            },
            watchMode: o,
          });
          if (((this.gitInitWatch = { key: i, watcher: s }), await s.start())) return "started";
          let a = this.gitInitWatch?.watcher === s ? "failed" : "superseded";
          return (a === "failed" && (this.gitInitWatch = null), s.dispose(), a);
        }
        async handleGitInit(r, n, o) {
          let i = this.getGitInitWatchKey(r, n);
          if (
            !(
              this.handledGitInitWatchers.has(o) ||
              this.desiredGitInitWatchKey !== i ||
              this.gitInitWatch?.watcher !== o
            )
          ) {
            (this.handledGitInitWatchers.add(o), (this.gitInitWatch = null));
            try {
              if ((await this.refreshGitInitMetadata(r, n)) || this.desiredGitInitWatchKey !== i)
                return;
              let s = await this.startGitInitWatcher(r, n, "watch-git-metadata");
              if (this.desiredGitInitWatchKey !== i) return;
              let a = !1;
              try {
                a = await this.refreshGitInitMetadata(r, n);
              } finally {
                !a &&
                  s === "failed" &&
                  this.desiredGitInitWatchKey === i &&
                  (this.desiredGitInitWatchKey = null);
              }
            } catch (s) {
              throw (
                this.desiredGitInitWatchKey === i &&
                  this.gitInitWatch == null &&
                  (this.desiredGitInitWatchKey = null),
                s
              );
            }
          }
        }
        async refreshGitInitMetadata(r, n) {
          let o = this.getGitInitWatchKey(r, n),
            i = this.gitInitMetadataRefreshes.get(o);
          if (i != null) return i;
          this.gitManager.invalidateStableMetadata();
          let s = this.refreshGitInitMetadataOnce(r, n);
          this.gitInitMetadataRefreshes.set(o, s);
          try {
            return await s;
          } finally {
            this.gitInitMetadataRefreshes.get(o) === s && this.gitInitMetadataRefreshes.delete(o);
          }
        }
        async refreshGitInitMetadataOnce(r, n) {
          let o = this.getGitInitWatchKey(r, n),
            i = await this.gitManager.getStableMetadata(r, n);
          if (!i || this.desiredGitInitWatchKey !== o) return !1;
          this.disposeActiveGitInitWatcher();
          try {
            await this.ensureWatching({ commonDir: i.commonDir, root: i.root }, n);
          } catch (s) {
            throw (this.desiredGitInitWatchKey === o && (this.desiredGitInitWatchKey = null), s);
          }
          return this.desiredGitInitWatchKey !== o
            ? (this.unwatchRepo(i.root, n, { commonDir: i.commonDir, emitEvent: !1 }), !1)
            : (this.disposeGitInitWatcher(r, n),
              jt(
                {
                  attributes: {
                    "git.change_type": "head",
                    "git.changed_path_count": 0,
                    "git.full_invalidation": !1,
                    "worker.id": "git",
                  },
                  name: "desktop.git_invalidation",
                  op: "codex.git.invalidation",
                  root: !0,
                },
                () => {
                  let s = fo();
                  this.emit({
                    type: "worker-event",
                    event: {
                      type: "git-repo-changed",
                      changeType: "head",
                      commonDir: i.commonDir,
                      cwd: r,
                      hostId: n.id,
                      rebaseInProgress: null,
                      root: i.root,
                      ...(s == null ? {} : { emittedAtMs: Date.now(), trace: s }),
                    },
                  });
                },
              ),
              !0);
        }
        getGitInitWatchKey(r, n) {
          return `${fn(n)}|${r}`;
        }
        disposeGitInitWatcher(r, n) {
          (r != null &&
            n != null &&
            this.desiredGitInitWatchKey !== this.getGitInitWatchKey(r, n)) ||
            (this.disposeActiveGitInitWatcher(), (this.desiredGitInitWatchKey = null));
        }
        disposeActiveGitInitWatcher() {
          (this.gitInitWatch?.watcher.dispose(), (this.gitInitWatch = null));
        }
        unwatchRepo(
          r,
          n,
          {
            commonDir: o,
            emitEvent: i = !0,
            watch: s = this.watchesByKey.get(this.getWatchKey(r, n)),
          } = {},
        ) {
          if (
            s == null ||
            s.refCount <= 0 ||
            (o != null && s.commonDir !== o) ||
            ((s.refCount -= 1), s.refCount > 0)
          )
            return;
          let a = () => {
            s.refCount > 0 || this.closeRepoWatch(s, n, i);
          };
          s.startPromise.then(a, a);
        }
        scheduleWatchSetup(r, n, o, i) {
          let s = fn(n),
            a = this.getWatchKey(r.root, n),
            l = this.watchSetupByHost.get(s);
          r.startTrace = fo() ?? void 0;
          let c = (l ?? Promise.resolve()).then(async () => {
              await i;
              try {
                if (r.refCount > 0 && this.watchesByKey.get(a) === r) {
                  let p = n.isLocal ? Br.default : Br.default.posix;
                  (n
                    .stat(p.join(r.commonDir, "index"))
                    .then(({ size: m }) => {
                      this.watchesByKey.get(a) === r && (r.repoIndexSizeBucket = m1e(m));
                    })
                    .catch(() => {}),
                    await r.watcher.start());
                }
                if (r.refCount > 0 && this.watchesByKey.get(a) === r) {
                  let p = this.gitManager.getWorktreeRepositoryForRoot(r.root, n);
                  (p.queryClient.removeQueries({
                    queryKey: ne(r.root, n, "effective-origin-url"),
                    exact: !0,
                  }),
                    p.advanceHeadReadGeneration(),
                    (r.isReady = !0),
                    o());
                } else await this.closeRepoWatch(r, n);
              } catch (p) {
                throw (await this.closeRepoWatch(r, n), p);
              } finally {
                r.startTrace = void 0;
              }
            }),
            u = c.catch(() => {});
          return (
            this.watchSetupByHost.set(s, u),
            u.then(() => {
              this.watchSetupByHost.get(s) === u && this.watchSetupByHost.delete(s);
            }),
            c
          );
        }
        closeRepoWatch(r, n, o = !0) {
          if (r.closingPromise != null) return r.closingPromise;
          let i = this.getWatchKey(r.root, n);
          if (((r.isReady = !1), this.watchesByKey.get(i) === r)) {
            let s = this.gitManager.getWorktreeRepositoryForRoot(r.root, n);
            (Rn(s), s.clearGitReadCaches());
          }
          return (
            (r.closingPromise = Promise.resolve()
              .then(() => r.watcher.dispose())
              .catch((s) => {
                ef().warning("Failed to close git repo watch", {
                  safe: {},
                  sensitive: { error: s },
                });
              })
              .then(() => {
                (r.releaseRepository(),
                  this.watchesByKey.get(i) === r &&
                    (this.watchesByKey.delete(i),
                    o &&
                      this.emit({
                        type: "worker-event",
                        event: {
                          type: "git-repo-unwatched",
                          commonDir: r.commonDir,
                          hostId: n.id,
                          root: r.root,
                        },
                      })));
              })),
            r.closingPromise
          );
        }
        handleCancel(r) {
          if (this.uncancelableRequestIds.has(r)) return;
          let n = this.inFlightRequests.get(r);
          if (!n) {
            this.canceledRequests.add(r);
            return;
          }
          (this.inFlightRequests.delete(r), n.abort());
        }
      }));
  });
