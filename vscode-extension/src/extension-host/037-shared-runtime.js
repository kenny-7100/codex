async function ABt({
  diffArgs: t,
  generatedPaths: e,
  paths: r,
  query: n,
  reviewSnapshot: o,
  signal: i,
  untrackedPaths: s,
}) {
  let { worktreeRepo: a } = o,
    l = [...e].sort();
  return Er(
    a.queryClient,
    {
      queryKey: o.queryKey("review-search-matches", t, n, r ?? [], l, s.paths),
      gcTime: be,
      meta: Ue,
      queryFn: async (c) => {
        let u = r == null ? null : new Set(r),
          p = (v) => !e.has(v) && (u == null || u.has(v)),
          m = PBt(n, p),
          f = await lN((v, y) => uv(o, v, { signal: y }), { ...s, paths: s.paths.filter(p) }, c);
        if (!f.success) return null;
        for (let v of f.sections)
          for (let y of v.split(`
`))
            m.pushLine(y);
        c.throwIfAborted();
        let h = await o.gitDiff([...t, "--unified=3"], {
          allowedNonZeroExitCodes: [0, 1],
          collectOutput: !1,
          onStdoutRaw: TBt(m.pushLine),
          signal: c,
          trim: !1,
        });
        return (
          c.throwIfAborted(),
          m.resetHunkOffset(),
          h.success
            ? { matches: m.matches, totalMatches: m.totalMatches, isCapped: m.isCapped }
            : null
        );
      },
      staleTime: be,
    },
    i,
  );
}
async function RBt({ diffArgs: t, reviewSnapshot: e, trackedPaths: r, untrackedPaths: n }) {
  let o = r;
  if (o == null) {
    let s = await EBt(t, e);
    if (!s.success) return null;
    o = s.stdout.split("\0").filter((a) => a.length > 0);
  }
  if (((o = [...new Set([...o, ...n.paths])]), o.length === 0)) return new Set();
  let i = await CBt(o, e);
  return i.success ? sN(i.stdout) : null;
}
function EBt(t, e) {
  let r = [...t, "--name-only", "-z"];
  return e.worktreeRepo.queryClient.fetchQuery({
    queryKey: e.queryKey("review-search-paths", r),
    gcTime: be,
    meta: Ue,
    queryFn: () => e.gitDiff(r, { allowedNonZeroExitCodes: [0, 1], trim: !1 }),
    staleTime: be,
  });
}
function CBt(t, e) {
  return e.worktreeRepo.queryClient.fetchQuery({
    queryKey: e.queryKey("linguist-generated-paths", t),
    gcTime: be,
    meta: Ue,
    queryFn: () => e.git(["check-attr", "-z", "linguist-generated", "--", ...t], { trim: !1 }),
    staleTime: be,
  });
}
function TBt(t) {
  let e = new TextDecoder(),
    r = "";
  return (n) => {
    let o = e.decode(n, { stream: !0 }),
      i = 0;
    for (;;) {
      let s = o.indexOf(
        `
`,
        i,
      );
      if (s === -1) {
        r += o.slice(i);
        return;
      }
      (t(r + o.slice(i, s)), (r = ""), (i = s + 1));
    }
  };
}
function PBt(t, e) {
  let r = Array(),
    n = null,
    o = null,
    i = 1,
    s = 1,
    a = 0,
    l = 0,
    c = 0,
    u = !1;
  function p() {
    a = 0;
  }
  return {
    matches: r,
    get totalMatches() {
      return c;
    },
    get isCapped() {
      return u;
    },
    resetHunkOffset: p,
    pushLine(f) {
      if (f.startsWith("diff --git ")) {
        p();
        let y = _A(f);
        if (((o = null), (l = 0), y == null || !e(y.newPath))) {
          n = null;
          return;
        }
        ((n = y.newPath), m({ hunkId: "path", lineEnd: 1, lineStart: 1, path: n, text: IBt(y) }));
        return;
      }
      if (n == null) return;
      let h = xBt.exec(f);
      if (h?.groups != null) {
        (p(),
          (o = String(l)),
          (l += 1),
          (i = Number(h.groups.additionStart)),
          (s = Number(h.groups.deletionStart)));
        return;
      }
      if (o == null) return;
      let v = f[0];
      if (v === " " || v === "-" || v === "+") {
        let y = f.slice(1),
          w = v === "-" ? "deletions" : "additions",
          _ = w === "deletions" ? s : i;
        (m({ hunkId: o, lineEnd: _, lineStart: _, offset: a, path: n, side: w, text: y }),
          v !== "+" && (s += 1),
          v !== "-" && (i += 1),
          (a += y.length + 1));
      }
    },
  };
  function m({ hunkId: f, lineEnd: h, lineStart: v, offset: y = 0, path: w, side: _, text: S }) {
    let { offsets: E, totalMatches: T, isCapped: P } = DBt(S, t, cFe - r.length);
    ((c += T), P && (u = !0));
    for (let { start: M, end: L } of E)
      r.push({
        path: w,
        hunkId: f,
        lineStart: v,
        lineEnd: h,
        ...(_ == null ? {} : { side: _ }),
        start: y + M,
        end: y + L,
        snippet: kBt(S, M, L),
      });
  }
}
function IBt(t) {
  return t.oldPath === t.newPath ? t.newPath : `${t.oldPath} -> ${t.newPath}`;
}
function kBt(t, e, r) {
  let n = Math.max(0, e - lFe),
    o = Math.min(t.length, r + lFe);
  return { before: t.slice(n, e), match: t.slice(e, r), after: t.slice(r, o) };
}
function DBt(t, e, r) {
  let n = [],
    o = 0,
    i = !1;
  if (e.length === 0) return { offsets: n, totalMatches: o, isCapped: i };
  let s = t.toLowerCase(),
    a = e.toLowerCase(),
    l = null;
  if (s.length !== t.length) {
    l = [];
    for (let u = 0; u < t.length; u += 1)
      for (let p = 0; p < t[u].toLowerCase().length; p += 1) l.push(u);
  }
  let c = 0;
  for (let u = s.indexOf(a); u !== -1; u = s.indexOf(a, c)) {
    let p = u + a.length,
      m = l?.[u] ?? u,
      f = l == null ? p : l[p - 1] + 1;
    for (c = p; l?.[c] === f - 1; ) c += 1;
    ((o += 1), n.length < r ? n.push({ start: m, end: f }) : (i = !0));
  }
  return { offsets: n, totalMatches: o, isCapped: i };
}
var cFe,
  lFe,
  xBt,
  dFe = g(() => {
    p5();
    cd();
    nN();
    XO();
    je();
    d5();
    t5();
    xA();
    ((cFe = 250),
      (lFe = 24),
      (xBt =
        /^@@ -(?<deletionStart>\d+)(?:,(?<deletionCount>\d+))? \+(?<additionStart>\d+)(?:,(?<additionCount>\d+))? @@/));
  });
function pFe(t, e) {
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "submodule-paths"),
    meta: fNe,
    queryFn: async () => {
      try {
        let o = t.host.stat((await t.host.platformPath()).join(t.root, ".gitmodules"), {
          bypassCache: !0,
        });
        await (e == null ? o : Lt(o, e));
      } catch (o) {
        if (e?.aborted) throw o;
        if (bt(o)) return [];
      }
      let r = await I(t.root, ["config", "--file", ".gitmodules", "--get-regexp", "path"], t.host, {
        allowedNonZeroExitCodes: [1],
        signal: e,
      });
      if (!r.success || !r.stdout) return [];
      let n = r.stdout
        .split(
          `
`,
        )
        .map((o) => o.trim())
        .filter((o) => o.length > 0)
        .map((o) => {
          let i = o.split(/\s+/),
            s = i[i.length - 1] ?? "";
          return tv(s);
        })
        .filter((o) => o.length > 0);
      return Array.from(new Set(n));
    },
    staleTime: Ve,
  });
}
var mFe = g(() => {
  O();
  je();
  AO();
  fe();
});
async function hFe(t, e, r, n, o, i) {
  let s = await fFe(o, r);
  if (s === "available") return { kind: "available" };
  if (s === "unavailable") return { kind: "unavailable", reason: "inspection-failed" };
  if (r !== n) {
    let a = await fFe(o, n);
    if (a === "available") return { kind: "gone" };
    if (a === "unavailable") return { kind: "unavailable", reason: "inspection-failed" };
  }
  if (e.length === 0) return { kind: "unavailable", reason: "no-candidate-roots" };
  try {
    let a = await jO(t, e, n, o, i);
    return a.exists ? { kind: "restorable", snapshot: a } : { kind: "gone" };
  } catch {
    return { kind: "unavailable", reason: "inspection-failed" };
  }
}
async function fFe(t, e) {
  try {
    return (await t.stat(e, { bypassCache: !0 })).isDirectory() ? "available" : "unavailable";
  } catch (r) {
    return bt(r) ? "missing" : "unavailable";
  }
}
var gFe = g(() => {
  O();
  bA();
});
async function hN({ branch: t, cwd: e, commitSha: r, host: n }) {
  let o = await y5({ branch: t, cwd: e, commitSha: r, host: n });
  if (o.status === "same-commit") return null;
  if (o.status === "different-commit") return { message: o.message, execOutput: o.execOutput };
  let i = await I(e, ["branch", t, r], n);
  if (i.success) return null;
  let s = i.stderr || i.stdout || "Failed to create branch";
  return {
    message: s,
    execOutput: Nt({ command: i.command, stdout: i.stdout, stderr: i.stderr, fallbackOutput: s }),
  };
}
async function y5({ branch: t, cwd: e, commitSha: r, host: n }) {
  let o = Vs(t),
    i = await I(e, ["show-ref", "--verify", "--hash", o], n);
  if (i.success && i.code === 0) {
    if (i.stdout.trim() === r) return { status: "same-commit" };
    let s = `Branch ${t} already exists at a different commit`;
    return {
      status: "different-commit",
      message: s,
      execOutput: Nt({ command: i.command, stdout: i.stdout, stderr: i.stderr, fallbackOutput: s }),
    };
  }
  return { status: "missing" };
}
var v5 = g(() => {
  O();
  fe();
  Yy();
});
async function fi({ cwd: t, stashRef: e, mode: r = "apply", restoreIndex: n = !1 }, o) {
  if (!t.trim()) return { status: "error", error: "No workspace available for stash apply" };
  let i = e.trim();
  if (!i) return { status: "error", error: "Stash reference is required" };
  let s = r === "apply" ? i : await MBt(t, i, o),
    a = ["stash", r];
  if (n && r !== "drop") {
    let c = await I(
      t,
      ["diff-index", "--cached", "--quiet", "--ignore-submodules=none", "HEAD", "--"],
      o,
    );
    if (!c.success) {
      let u =
        c.code === 1
          ? "Commit or stash the existing staged changes before restoring the saved index."
          : c.stderr || "Failed to inspect the Git index";
      return {
        status: "error",
        error: u,
        execOutput: Nt({
          command: c.command,
          stdout: c.stdout,
          stderr: c.stderr,
          fallbackOutput: u,
        }),
      };
    }
    a.push("--index");
  }
  let l = await I(t, [...a, s], o);
  if (!l.success) {
    let c = l.stderr || l.stdout || "Failed to apply stash";
    return {
      status: "error",
      error: c,
      execOutput: Nt({ command: l.command, stdout: l.stdout, stderr: l.stderr, fallbackOutput: c }),
    };
  }
  return { status: "success", stashRef: i, mode: r };
}
async function MBt(t, e, r) {
  if (!Uo(e)) return e;
  let n = await I(t, ["stash", "list", "--format=%H %gd"], r);
  return !n.success || n.stdout.length === 0
    ? e
    : (n.stdout
        .split(
          `
`,
        )
        .map((i) => i.trim())
        .filter((i) => i.length > 0)
        .map((i) => i.split(/\s+/, 2))
        .find(([i]) => i === e)?.[1] ?? e);
}
var CA = g(() => {
  O();
  td();
  fe();
});
async function wFe(
  t,
  { gitManager: e, sourceHost: r, destinationHost: n, signal: o, onProgress: i },
) {
  if (t.sourceRolloutPath.trim().length === 0)
    return H({ status: "error", error: "invalid-params", message: "Missing source rollout path" });
  if (t.sourceBranch.trim().length === 0)
    return H({ status: "error", error: "invalid-params", message: "Missing source branch" });
  if ((t.destinationWorktreeGitRoot == null) != (t.destinationWorktreeWorkspaceRoot == null))
    return H({
      status: "error",
      error: "invalid-params",
      message: "Destination worktree roots must be provided together",
    });
  let s = crypto.randomUUID(),
    [a, l] = await Promise.all([bFe(e, t.sourceCwd, r), bFe(e, t.destinationWorkspaceRoot, n)]);
  if (a == null)
    return H({
      status: "error",
      error: "source-not-in-repository",
      message: "Source thread is not in a git repository",
    });
  if (l == null)
    return H({
      status: "error",
      error: "destination-not-in-repository",
      message: "Destination workspace is not in a git repository",
    });
  let c = await vFe(r, s),
    u = await vFe(n, s),
    p = await r.platformPath(),
    m = await n.platformPath(),
    f = p.join(c, "handoff.bundle"),
    h = m.join(u, "handoff.bundle"),
    v = m.join(u, "rollout.jsonl"),
    y = `refs/codex/handoff/source/${s}`,
    w = `refs/codex/handoff/destination/${s}`,
    _ = r.id === n.id && c === u,
    S = !1,
    E = t.destinationWorktreeGitRoot != null && t.destinationWorktreeWorkspaceRoot != null,
    T = t.destinationWorktreeGitRoot,
    P = t.destinationWorktreeWorkspaceRoot,
    M = !E,
    L = null,
    V = null,
    de = null,
    ue = null,
    Ae = (ge, Pe) => {
      (Pe === "started" ? (ue = ge) : ue === ge && (ue = null), i?.(ge, Pe));
    };
  try {
    Ae("prepare-host-transfer", "started");
    let ge = e.getWorktreeRepositoryForRoot(a.root, r),
      Pe = await I(a.root, ["rev-parse", "HEAD"], r, { signal: o });
    if (!Pe.success || !Pe.stdout.trim())
      return Qm("snapshot-failed", "Unable to resolve source HEAD commit", Pe);
    let Q = Pe.stdout.trim(),
      X = await y5({ branch: t.sourceBranch, cwd: l.root, commitSha: Q, host: n });
    if (X.status === "different-commit" && !E)
      return H({
        status: "error",
        error: "destination-branch-exists",
        message: X.message,
        execOutput: X.execOutput,
      });
    let G = await dd(ge, { signal: o, untrackedPathsPromise: qn(ge) }),
      ce = (await al(ge, Q, o)).trim(),
      Ce = Q;
    if (ce !== G) {
      let tt = await lv(a.root, G, r, {
        parentSha: Q,
        message: "Codex host handoff snapshot",
        signal: o,
      });
      if (!tt.success)
        return Qm("snapshot-failed", "Failed to create host handoff snapshot", tt.error);
      Ce = tt.commitSha.trim();
    }
    let De = await I(a.root, ["update-ref", y, Ce], r, { signal: o });
    if (!De.success)
      return Qm("snapshot-failed", "Failed to prepare host handoff snapshot ref", De);
    await Promise.all([
      r.createDirectory(c, { recursive: !0 }),
      n.createDirectory(u, { recursive: !0 }),
    ]);
    let Ge = await gN(l.root, Ce, n, o);
    if (Ge) {
      let tt = await I(l.root, ["update-ref", w, Ce], n, { signal: o });
      if (!tt.success)
        return Qm("bundle-import-failed", "Failed to prepare destination handoff ref", tt);
    } else {
      let tt = await LBt({
        gitManager: e,
        sourceGitRoot: a.root,
        destinationGitRoot: l.root,
        headSha: Q,
        sourceHost: r,
        destinationHost: n,
        signal: o,
      });
      if (tt == null)
        return H({
          status: "error",
          error: "bundle-export-failed",
          message: "Could not find a shared Git base on the destination host",
        });
      let Sr = ["bundle", "create", f, y, `^${tt}`],
        oe = await I(a.root, Sr, r, { signal: o });
      if (!oe.success) return Qm("bundle-export-failed", "Failed to export git handoff bundle", oe);
      (Ae("prepare-host-transfer", "completed"),
        Ae("transfer-host-artifacts", "started"),
        await SFe(f, r, h, n, o));
      let _t = await I(l.root, ["bundle", "unbundle", h], n, { signal: o });
      if (!_t.success) return Qm("bundle-import-failed", "Failed to import git handoff bundle", _t);
      let Hr = await I(l.root, ["update-ref", w, Ce], n, { signal: o });
      if (!Hr.success)
        return Qm("bundle-import-failed", "Failed to prepare destination handoff ref", Hr);
    }
    if (
      (Ge && (Ae("prepare-host-transfer", "completed"), Ae("transfer-host-artifacts", "started")),
      await SFe(t.sourceRolloutPath, r, v, n, o),
      Ae("transfer-host-artifacts", "completed"),
      T == null || P == null)
    ) {
      Ae("create-new-worktree", "started");
      let tt = await uA({
        gitManager: e,
        workspaceRoot: t.destinationWorkspaceRoot,
        startingState: { type: "branch", branchName: w },
        upstreamRefreshMode: "never",
        localEnvironmentConfigPath: null,
        setUpSyncedBranch: !1,
        useWorkspaceDir: t.useWorkspaceDir,
        host: n,
        signal: o,
      });
      if (!tt.success)
        return H({ status: "error", error: "create-worktree-failed", message: tt.error.message });
      ((T = tt.worktreeGitRoot),
        (P = tt.worktreeWorkspaceRoot),
        Ae("create-new-worktree", "completed"));
    } else {
      let tt = e.getWorktreeRepositoryForRoot(T, n);
      ((M = (await xFe(tt, o)) === Q),
        tt.invalidateGitReadCachesForRepoChange("head"),
        (L = (await Cr(tt)) ?? (await cl(tt, o))));
      let Sr = await En({ cwd: P, branch: w, stashUncommitted: t.stashDestinationWorktree }, e, n);
      if (Sr.status === "error")
        return H({
          status: "error",
          error: "restore-worktree-state-failed",
          message: Sr.error,
          execOutput: Sr.execOutput,
        });
      V = Sr.stashRef;
    }
    Ae("apply-changes-to-worktree", "started");
    let We = await I(T, ["reset", "--mixed", Q], n, { signal: o });
    if (!We.success)
      return (
        await TA({
          createdWorktree: !E,
          worktreeGitRoot: T,
          worktreeWorkspaceRoot: P,
          reusedWorktreePreviousCheckout: L,
          reusedWorktreeStashRef: V,
          destinationCheckoutGitRoot: l.root,
          destinationCheckoutPreviousBranch: de,
          gitManager: e,
          host: n,
        }),
        H({
          status: "error",
          error: "restore-worktree-state-failed",
          message: "Failed to restore transferred git state in the worktree",
          execOutput: Nt({ command: We.command, stdout: We.stdout, stderr: We.stderr }),
        })
      );
    let yt = await NBt({
      branch: t.sourceBranch,
      cwd: l.root,
      sourceHeadSha: Q,
      canDetachDefaultBranch: M,
      gitManager: e,
      host: n,
      signal: o,
    });
    if (yt.error != null)
      return (
        await TA({
          createdWorktree: !E,
          worktreeGitRoot: T,
          worktreeWorkspaceRoot: P,
          reusedWorktreePreviousCheckout: L,
          reusedWorktreeStashRef: V,
          destinationCheckoutGitRoot: l.root,
          destinationCheckoutPreviousBranch: de,
          gitManager: e,
          host: n,
        }),
        H({
          status: "error",
          error: "restore-worktree-state-failed",
          message: yt.error.message,
          execOutput: yt.error.execOutput,
        })
      );
    de = yt.previousBranch;
    let Ct = E
      ? await OBt({ branch: t.sourceBranch, cwd: T, commitSha: Q, host: n })
      : await hN({ branch: t.sourceBranch, cwd: T, commitSha: Q, host: n });
    if (Ct != null)
      return (
        await TA({
          createdWorktree: !E,
          worktreeGitRoot: T,
          worktreeWorkspaceRoot: P,
          reusedWorktreePreviousCheckout: L,
          reusedWorktreeStashRef: V,
          destinationCheckoutGitRoot: l.root,
          destinationCheckoutPreviousBranch: de,
          gitManager: e,
          host: n,
        }),
        H({
          status: "error",
          error: "restore-worktree-state-failed",
          message: Ct.message,
          execOutput: Ct.execOutput,
        })
      );
    let et = await En({ cwd: T, branch: t.sourceBranch, stashUncommitted: !1 }, e, n);
    if (et.status === "error")
      return (
        await TA({
          createdWorktree: !E,
          worktreeGitRoot: T,
          worktreeWorkspaceRoot: P,
          reusedWorktreePreviousCheckout: L,
          reusedWorktreeStashRef: V,
          destinationCheckoutGitRoot: l.root,
          destinationCheckoutPreviousBranch: de,
          gitManager: e,
          host: n,
        }),
        H({
          status: "error",
          error: "restore-worktree-state-failed",
          message: et.error,
          execOutput: et.execOutput,
        })
      );
    if (V != null) {
      let tt = await fi({ cwd: P, stashRef: V, mode: "drop" }, n);
      tt.status === "error" &&
        he().warning("[host-handoff] failed to drop reused worktree stash", {
          safe: {},
          sensitive: { error: tt.error },
        });
    }
    return (
      Ae("apply-changes-to-worktree", "completed"),
      (S = !0),
      H({ status: "success", rolloutPath: v, worktreeGitRoot: T, worktreeWorkspaceRoot: P })
    );
  } catch (ge) {
    return (
      de != null &&
        T != null &&
        P != null &&
        (await TA({
          createdWorktree: !E,
          worktreeGitRoot: T,
          worktreeWorkspaceRoot: P,
          reusedWorktreePreviousCheckout: L,
          reusedWorktreeStashRef: V,
          destinationCheckoutGitRoot: l.root,
          destinationCheckoutPreviousBranch: de,
          gitManager: e,
          host: n,
        }).catch(() => {})),
      H({
        status: "error",
        error: "unexpected-error",
        message: ge instanceof Error ? ge.message : String(ge),
      })
    );
  } finally {
    (ue != null && Ae(ue, "failed"),
      await Promise.allSettled([
        I(a.root, ["update-ref", "-d", y], r, { signal: o }),
        I(l.root, ["update-ref", "-d", w], n, { signal: o }),
        _ && S ? Promise.resolve() : r.remove(c, { recursive: !0, force: !0 }),
        S ? n.remove(h, { recursive: !1, force: !0 }) : n.remove(u, { recursive: !0, force: !0 }),
      ]));
  }
}
async function _Fe(t, e) {
  let r = await e.platformPath(),
    n = r.dirname(t),
    o = r.relative(r.join(await e.codexHome(), "handoffs"), n);
  if (
    r.basename(t) !== "rollout.jsonl" ||
    o.length === 0 ||
    o === ".." ||
    o.startsWith(`..${r.sep}`) ||
    r.isAbsolute(o) ||
    o.includes(r.sep)
  )
    throw new Error("Host handoff cleanup requires a copied rollout path");
  await e.remove(n, { recursive: !0, force: !0 });
}
async function OBt({ branch: t, cwd: e, commitSha: r, host: n }) {
  let o = await I(e, ["branch", "-f", t, r], n);
  if (o.success) return null;
  let i = o.stderr || o.stdout || "Failed to update destination branch";
  return {
    message: i,
    execOutput: Nt({ command: o.command, stdout: o.stdout, stderr: o.stderr, fallbackOutput: i }),
  };
}
async function NBt({
  branch: t,
  cwd: e,
  sourceHeadSha: r,
  canDetachDefaultBranch: n,
  gitManager: o,
  host: i,
  signal: s,
}) {
  let a = o.getWorktreeRepositoryForRoot(e, i);
  a.invalidateGitReadCachesForRepoChange("head");
  let l = await Cr(a);
  if (l !== t) return { previousBranch: null, error: null };
  let u = (await gn(a))?.branch ?? null,
    p = u;
  if (u === t) {
    let f = n ? await xFe(a, s) : null;
    p = f === r ? f : null;
  }
  if (p == null)
    return {
      previousBranch: null,
      error: {
        message:
          "Destination checkout is already using the handoff branch, and Codex could not switch it to a default branch",
      },
    };
  let m = await En({ cwd: e, branch: p, stashUncommitted: !1 }, o, i);
  return m.status === "error"
    ? { previousBranch: null, error: { message: m.error, execOutput: m.execOutput } }
    : { previousBranch: l, error: null };
}
async function xFe(t, e) {
  try {
    let r = await to(t, e),
      [n, o] = await Promise.all([
        md(t, e),
        I(t.root, ["status", "--porcelain=v1", "--untracked-files=normal"], t.host, {
          configOverrides: r,
          signal: e,
        }),
      ]);
    return o.success && o.stdout.length === 0 ? n : null;
  } catch {
    return null;
  }
}
async function TA({
  createdWorktree: t,
  worktreeGitRoot: e,
  worktreeWorkspaceRoot: r,
  reusedWorktreePreviousCheckout: n,
  reusedWorktreeStashRef: o,
  destinationCheckoutGitRoot: i,
  destinationCheckoutPreviousBranch: s,
  gitManager: a,
  host: l,
}) {
  if (t) {
    (await ms(e, l, !0).catch(() => {}), await yFe({ branch: s, cwd: i, gitManager: a, host: l }));
    return;
  }
  (n != null && (await En({ cwd: r, branch: n, stashUncommitted: !1 }, a, l)),
    o != null && (await fi({ cwd: r, stashRef: o, mode: "pop" }, l)),
    await yFe({ branch: s, cwd: i, gitManager: a, host: l }));
}
async function yFe({ branch: t, cwd: e, gitManager: r, host: n }) {
  t != null && (await En({ cwd: e, branch: t, stashUncommitted: !1 }, r, n).catch(() => {}));
}
async function vFe(t, e) {
  return (await t.platformPath()).join(await t.codexHome(), "handoffs", e);
}
async function bFe(t, e, r) {
  try {
    return await t.getStableMetadata(e, r);
  } catch (n) {
    if (r.isLocal || !(n instanceof Error) || !n.message.startsWith("Failed to resolve git root:"))
      throw n;
    return t.getStableMetadata(e, r);
  }
}
async function gN(t, e, r, n) {
  let o = await I(t, ["cat-file", "-e", `${e}^{commit}`], r, {
    allowedNonZeroExitCodes: [1, 128],
    env: { GIT_NO_LAZY_FETCH: "1" },
    signal: n,
  });
  return o.success && o.code === 0;
}
async function LBt({
  gitManager: t,
  sourceGitRoot: e,
  destinationGitRoot: r,
  headSha: n,
  sourceHost: o,
  destinationHost: i,
  signal: s,
}) {
  let a = t.getWorktreeRepositoryForRoot(e, o),
    l = t.getWorktreeRepositoryForRoot(r, i),
    c = await gN(r, n, i, s);
  if (
    (he().debug("[host-handoff] destination-head-check", {
      safe: { destinationHasHead: c },
      sensitive: {},
    }),
    c)
  )
    return n;
  let u = await gn(a);
  if (
    (he().debug("[host-handoff] source-default-branch", {
      safe: { found: u != null },
      sensitive: u ?? {},
    }),
    u == null)
  )
    return null;
  let p = await ll(a, `${u.remote}/${u.branch}`);
  if (
    (he().debug("[host-handoff] source-merge-base", {
      safe: { found: p != null },
      sensitive: p == null ? {} : { mergeBaseSha: p },
    }),
    p == null)
  )
    return null;
  let m = await gN(r, p, i, s);
  if (
    (he().debug("[host-handoff] destination-merge-base-check", {
      safe: { destinationHasMergeBase: m },
      sensitive: {},
    }),
    m)
  )
    return p;
  let f = await gn(l),
    h = f == null ? (await hn(l)).map((v) => ({ remote: v, branch: u.branch })) : [f];
  he().debug("[host-handoff] destination-fetch-targets", {
    safe: { count: h.length, usedDestinationDefaultBranch: f != null },
    sensitive: {
      sourceDefaultRemoteAndBranch: u,
      destinationDefaultRemoteAndBranch: f,
      fetchTargets: h,
    },
  });
  for (let v of h) {
    let y = await I(r, ["fetch", v.remote, v.branch], i, { signal: s });
    if (
      (he().debug("[host-handoff] destination-fetch-result", {
        safe: { success: y.success },
        sensitive: { fetchTarget: v, stderr: y.stderr },
      }),
      !y.success)
    )
      continue;
    let w = await gN(r, p, i, s);
    if (
      (he().debug("[host-handoff] destination-fetch-base-check", {
        safe: { hasFetchedBase: w },
        sensitive: { fetchTarget: v },
      }),
      w)
    )
      return p;
  }
  return (
    he().warning("[host-handoff] shared-base-not-found", {
      safe: { fetchTargetCount: h.length },
      sensitive: {
        sourceDefaultRemoteAndBranch: u,
        destinationDefaultRemoteAndBranch: f,
        mergeBaseSha: p,
        fetchTargets: h,
      },
    }),
    null
  );
}
async function SFe(t, e, r, n, o) {
  (e.id === n.id && t === r) || (await n.writeFile(r, await e.readFile(t), { signal: o }));
}
function Qm(t, e, r) {
  return H({
    status: "error",
    error: t,
    message: e,
    execOutput: Nt({ command: r.command, stdout: r.stdout, stderr: r.stderr }),
  });
}
var AFe = g(() => {
  O();
  hr();
  UO();
  DO();
  ev();
  v5();
  Gi();
  _c();
  fd();
  dA();
  il();
  xc();
  ov();
  Ks();
  HO();
  CA();
  Zm();
  fe();
});
async function yd({
  cwd: t,
  branch: e,
  stashRef: r,
  restoreBranchError: n,
  restoreStashError: o,
  gitManager: i,
  host: s,
}) {
  let a = [];
  return e == null
    ? (a.push(n), a)
    : (await En({ cwd: t, branch: e, stashUncommitted: !1 }, i, s)).status === "error"
      ? r == null
        ? [n]
        : [n, o]
      : (r != null &&
          (await fi({ cwd: t, stashRef: r, mode: "pop", restoreIndex: !0 }, s)).status ===
            "error" &&
          a.push(o),
        a);
}
var b5 = g(() => {
  CA();
  Zm();
});
async function RFe(t, { host: e, gitManager: r, signal: n, onProgress: o }) {
  let i = [];
  if (t.sourceBranch.trim().length === 0)
    return H({
      status: "error",
      error: "invalid-params",
      message: "Missing source branch",
      rollbackErrors: [],
      warnings: i,
    });
  let s = null,
    a = null,
    l = null,
    c = !1,
    u = !1;
  try {
    let p = await r.getWorktreeRepository(t.sourceWorktreeCwd, e),
      m = r.getWorktreeRepositoryForRoot(t.localGitRoot, e);
    if (p == null || m == null) throw new Error("Unable to resolve move-to-local repositories");
    a = await Cr(p);
    let f = await e.platformPath(),
      h = f.normalize(f.resolve(t.localGitRoot)),
      v = f.normalize(f.resolve(t.sourceWorktreeRoot));
    if (
      (await Zs(m, n)).some((P) => {
        if (P.headRef.type !== "branch" || P.headRef.string !== t.sourceBranch) return !1;
        let M = f.normalize(f.resolve(P.root));
        return M !== h && M !== v;
      })
    )
      return H({
        status: "error",
        error: "branch-checked-out-elsewhere",
        message: "Branch is already checked out in another worktree",
        rollbackErrors: [],
        warnings: i,
      });
    l = await Cr(m);
    let _ = await cl(p, n);
    if (_ == null)
      return H({
        status: "error",
        error: "source-detach-failed",
        message: "Unable to resolve worktree HEAD commit",
        rollbackErrors: [],
        warnings: i,
      });
    let S = await En({ cwd: t.sourceWorktreeCwd, branch: _, stashUncommitted: !0 }, r, e, {
      onStashStatusChange: (P) => {
        o?.("stash-source-changes", P);
      },
      onCheckoutStatusChange: (P) => {
        o?.("detach-worktree-branch", P);
      },
    });
    if (S.status === "error")
      return H({
        status: "error",
        error: "source-detach-failed",
        message: S.error,
        rollbackErrors: [],
        warnings: i,
        execOutput: S.execOutput,
      });
    ((s = S.stashRef), (c = !0));
    let E = await mi(m);
    if (E.type !== "success" || E.untrackedCount == null) {
      let P = await mv({
        cwd: t.sourceWorktreeCwd,
        branch: a,
        stashRef: s,
        gitManager: r,
        host: e,
      });
      return H({
        status: "error",
        error: "local-status-check-failed",
        message: "Failed to read destination local status",
        rollbackErrors: P,
        warnings: i,
      });
    }
    if (E.stagedCount + E.unstagedCount + E.untrackedCount > 0) {
      let P = await mv({
        cwd: t.sourceWorktreeCwd,
        branch: a,
        stashRef: s,
        gitManager: r,
        host: e,
      });
      return H({
        status: "error",
        error: "local-destination-has-tracked-changes",
        message: "You have uncommitted local changes. Commit or stash them first.",
        rollbackErrors: P,
        warnings: i,
      });
    }
    if (l !== t.sourceBranch) {
      let P = await hN({ branch: t.sourceBranch, cwd: t.localGitRoot, commitSha: _, host: e });
      if (P != null) {
        let L = await mv({
          cwd: t.sourceWorktreeCwd,
          branch: a,
          stashRef: s,
          gitManager: r,
          host: e,
        });
        return H({
          status: "error",
          error: "local-branch-head-mismatch",
          message: P.message,
          rollbackErrors: L,
          warnings: i,
          execOutput: P.execOutput,
        });
      }
      let M = await En(
        { cwd: t.localGitRoot, branch: t.sourceBranch, stashUncommitted: !1 },
        r,
        e,
        {
          onCheckoutStatusChange: (L) => {
            o?.("checkout-local-branch", L);
          },
        },
      );
      if (M.status === "error") {
        let L = await mv({
          cwd: t.sourceWorktreeCwd,
          branch: a,
          stashRef: s,
          gitManager: r,
          host: e,
        });
        return H({
          status: "error",
          error: "checkout-local-failed",
          message: M.error,
          rollbackErrors: L,
          warnings: i,
          execOutput: M.execOutput,
        });
      }
      u = !0;
    } else o?.("checkout-local-branch", "skipped");
    if (s != null) {
      o?.("apply-changes-to-local", "started");
      let P = await fi({ cwd: t.localGitRoot, stashRef: s, mode: "apply", restoreIndex: !0 }, e);
      if (P.status === "error") {
        o?.("apply-changes-to-local", "failed");
        let L = [];
        return (
          (L = [
            ...L,
            ...(await yd({
              cwd: t.localGitRoot,
              branch: l,
              stashRef: null,
              restoreBranchError: "restore-local-branch-failed",
              restoreStashError: "restore-local-stash-failed",
              gitManager: r,
              host: e,
            })),
          ]),
          (L = [
            ...L,
            ...(await mv({
              cwd: t.sourceWorktreeCwd,
              branch: a,
              stashRef: s,
              gitManager: r,
              host: e,
            })),
          ]),
          H({
            status: "error",
            error: "apply-source-stash-failed",
            message: P.error,
            rollbackErrors: L,
            warnings: i,
            execOutput: P.execOutput,
          })
        );
      }
      (o?.("apply-changes-to-local", "completed"),
        (await fi({ cwd: t.localGitRoot, stashRef: s, mode: "drop" }, e)).status === "error" &&
          i.push("drop-source-stash-failed"));
    } else o?.("apply-changes-to-local", "skipped");
    return H({ status: "success", warnings: i });
  } catch {
    let p = [];
    return (
      u &&
        (p = [
          ...p,
          ...(await yd({
            cwd: t.localGitRoot,
            branch: l,
            stashRef: null,
            restoreBranchError: "restore-local-branch-failed",
            restoreStashError: "restore-local-stash-failed",
            gitManager: r,
            host: e,
          })),
        ]),
      c &&
        (p = [
          ...p,
          ...(await mv({
            cwd: t.sourceWorktreeCwd,
            branch: a,
            stashRef: s,
            gitManager: r,
            host: e,
          })),
        ]),
      H({
        status: "error",
        error: "unexpected-error",
        message: "Failed to move thread to local",
        rollbackErrors: p,
        warnings: i,
      })
    );
  }
}
async function mv({ cwd: t, branch: e, stashRef: r, gitManager: n, host: o }) {
  return e != null
    ? yd({
        cwd: t,
        branch: e,
        stashRef: r,
        restoreBranchError: "restore-source-branch-failed",
        restoreStashError: "restore-source-stash-failed",
        gitManager: n,
        host: o,
      })
    : r == null
      ? []
      : (await fi({ cwd: t, stashRef: r, mode: "pop", restoreIndex: !0 }, o)).status === "error"
        ? ["restore-source-stash-failed"]
        : [];
}
var EFe = g(() => {
  O();
  v5();
  Gi();
  cd();
  fd();
  Km();
  CA();
  Zm();
  b5();
});
async function CFe(t, { host: e, gitManager: r, signal: n, onProgress: o }) {
  let i = [];
  if (t.sourceBranch.trim().length === 0)
    return H({
      status: "error",
      error: "invalid-params",
      message: "Missing source branch",
      rollbackErrors: [],
      warnings: i,
    });
  let s = (t.worktreeCheckoutBranch ?? t.sourceBranch).trim();
  if (s.length === 0)
    return H({
      status: "error",
      error: "invalid-params",
      message: "Missing worktree checkout branch",
      rollbackErrors: [],
      warnings: i,
    });
  if (t.defaultBranch != null && t.defaultBranch === s)
    return H({
      status: "error",
      error: "default-branch-blocked",
      message: "Move to worktree is not available on the default branch",
      rollbackErrors: [],
      warnings: i,
    });
  let a = null,
    l = null,
    c = null,
    u = !1,
    p = !1,
    m = !1;
  try {
    let f = await r.getWorktreeRepository(t.localCwd, e);
    if (f == null) throw new Error("Unable to resolve move-to-worktree local repository");
    if (((c = await Cr(f)), c == null))
      return H({
        status: "error",
        error: "local-not-on-branch",
        message: "Local repository must be on a branch to move to a worktree",
        rollbackErrors: [],
        warnings: i,
      });
    if (c === t.sourceBranch) {
      let v =
          (t.defaultBranch != null && t.sourceBranch === t.defaultBranch) || s !== t.sourceBranch,
        y = t.localCheckoutBranch?.trim() ?? "",
        w = y.length > 0 ? y : v ? t.sourceBranch : null;
      if (w == null)
        return H({
          status: "error",
          error: "invalid-params",
          message: "Missing local checkout branch",
          rollbackErrors: [],
          warnings: i,
        });
      let _ = await En({ cwd: t.localCwd, branch: w, stashUncommitted: !0 }, r, e, {
        onStashStatusChange: (S) => {
          o?.("stash-source-changes", S);
        },
        onCheckoutStatusChange: (S) => {
          o?.("checkout-local-branch", S);
        },
      });
      if (_.status === "error")
        return H({
          status: "error",
          error: "checkout-local-failed",
          message: _.error,
          rollbackErrors: [],
          warnings: i,
          execOutput: _.execOutput,
        });
      ((a = _.stashRef), (u = !0));
    } else (o?.("stash-source-changes", "skipped"), o?.("checkout-local-branch", "skipped"));
    let h = await En(
      { cwd: t.worktreeWorkspaceRoot, branch: s, stashUncommitted: t.stashTargetWorktree },
      r,
      e,
      {
        onStashStatusChange: t.stashTargetWorktree
          ? (v) => {
              o?.("stash-target-worktree-changes", v);
            }
          : void 0,
        onCheckoutStatusChange: (v) => {
          o?.("checkout-worktree-branch", v);
        },
      },
    );
    if (
      (t.stashTargetWorktree || o?.("stash-target-worktree-changes", "skipped"),
      h.status === "error")
    ) {
      let v = [];
      if (
        (u &&
          (v = [
            ...v,
            ...(await yd({
              cwd: t.localCwd,
              branch: c,
              stashRef: a,
              restoreBranchError: "restore-local-branch-failed",
              restoreStashError: "restore-local-stash-failed",
              gitManager: r,
              host: e,
            })),
          ]),
        t.createdWorktree)
      )
        try {
          await ms(t.worktreeGitRoot, e, !0, n);
        } catch {
          v.push("cleanup-created-worktree-failed");
        }
      return H({
        status: "error",
        error: "checkout-worktree-failed",
        message: h.error,
        rollbackErrors: v,
        warnings: i,
        execOutput: h.execOutput,
      });
    }
    if (
      ((l = h.stashRef),
      (p = !0),
      l != null && i.push("stashed-target-worktree-changes"),
      a != null)
    ) {
      o?.("apply-changes-to-worktree", "started");
      let v = await fi(
        { cwd: t.worktreeWorkspaceRoot, stashRef: a, mode: "apply", restoreIndex: !0 },
        e,
      );
      if (v.status === "error") {
        o?.("apply-changes-to-worktree", "failed");
        let y = [];
        if (
          (l != null &&
            (
              await fi(
                { cwd: t.worktreeWorkspaceRoot, stashRef: l, mode: "pop", restoreIndex: !0 },
                e,
              )
            ).status === "error" &&
            y.push("restore-target-stash-failed"),
          u &&
            (y = [
              ...y,
              ...(await yd({
                cwd: t.localCwd,
                branch: c,
                stashRef: a,
                restoreBranchError: "restore-local-branch-failed",
                restoreStashError: "restore-local-stash-failed",
                gitManager: r,
                host: e,
              })),
            ]),
          t.createdWorktree)
        )
          try {
            await ms(t.worktreeGitRoot, e, !0, n);
          } catch {
            y.push("cleanup-created-worktree-failed");
          }
        return H({
          status: "error",
          error: "apply-source-stash-failed",
          message: v.error,
          rollbackErrors: y,
          warnings: i,
          execOutput: v.execOutput,
        });
      }
      (o?.("apply-changes-to-worktree", "completed"), (m = !0));
    } else o?.("apply-changes-to-worktree", "skipped");
    return (
      a != null &&
        (await fi({ cwd: t.localCwd, stashRef: a, mode: "drop" }, e)).status === "error" &&
        i.push("drop-source-stash-failed"),
      H({ status: "success", warnings: i })
    );
  } catch {
    let f = [];
    if (
      (!m &&
        l != null &&
        (await fi({ cwd: t.worktreeWorkspaceRoot, stashRef: l, mode: "pop", restoreIndex: !0 }, e))
          .status === "error" &&
        f.push("restore-target-stash-failed"),
      u &&
        (f = [
          ...f,
          ...(await yd({
            cwd: t.localCwd,
            branch: c,
            stashRef: m ? null : a,
            restoreBranchError: "restore-local-branch-failed",
            restoreStashError: "restore-local-stash-failed",
            gitManager: r,
            host: e,
          })),
        ]),
      p && !m && t.createdWorktree)
    )
      try {
        await ms(t.worktreeGitRoot, e, !0, n);
      } catch {
        f.push("cleanup-created-worktree-failed");
      }
    return H({
      status: "error",
      error: "unexpected-error",
      message: "Failed to move thread to worktree",
      rollbackErrors: f,
      warnings: i,
    });
  }
}
var TFe = g(() => {
  O();
  ev();
  Gi();
  CA();
  Zm();
  b5();
});
async function PFe(t, e, r) {
  let n = await At(t, `${e}^{tree}`, r);
  if (n && !Uo(n)) throw new Error(`Unexpected ${e} SHA: ${n}`);
  return n ? n : null;
}
var IFe = g(() => {
  O();
  ps();
  td();
});
async function DFe({
  gitRoot: t,
  targetRoot: e,
  branchName: r,
  headCommitSha: n,
  treeSha: o,
  targetCurrentBranch: i,
  gitManager: s,
  host: a,
  signal: l,
}) {
  let c = l_("syncedBranch.overwrite"),
    u = s.getWorktreeRepositoryForRoot(t, a),
    p = e ? s.getWorktreeRepositoryForRoot(e, a) : null,
    m = p ? await cl(p, l) : null,
    f = await PFe(u, n, l);
  if (!f) return { status: "command-error" };
  let v = o && o !== f && (!e || !(!i || i === r)),
    y;
  if (v) {
    let E = await lv(t, o, a, { parentSha: n, signal: l });
    if (!E.success)
      return {
        status: "command-error",
        execOutput: Nt({
          command: "git commit-tree",
          stdout: "",
          stderr: E.error.stderr,
          fallbackOutput: E.error.stderr || E.error.stdout || "Failed to create synthetic commit",
        }),
      };
    y = E.commitSha;
  } else y = n;
  let [w, _] = await Promise.all([
      t && y !== n ? I(t, ["reset", "--hard", y], a, { signal: l }) : Promise.resolve(null),
      e
        ? I(e, ["update-ref", i ? `refs/heads/${i}` : "HEAD", y], a, { signal: l })
        : t
          ? I(t, ["branch", "-f", r, y], a, { signal: l })
          : Promise.resolve(null),
    ]),
    S = _ && !_.success ? _ : w?.success === !1 ? w : null;
  if (S) {
    let E = S.stderr || S.stdout || "Failed to reset branch";
    return {
      status: "command-error",
      execOutput: Nt({ command: S.command, stdout: S.stdout, stderr: S.stderr, fallbackOutput: E }),
    };
  }
  if (e) {
    let E = await I(e, ["reset", "--mixed", "HEAD"], a, { signal: l });
    if (!E.success) {
      let M = E.stderr || E.stdout || "Failed to reset index";
      return {
        status: "command-error",
        execOutput: Nt({
          command: E.command,
          stdout: E.stdout,
          stderr: E.stderr,
          fallbackOutput: M,
        }),
      };
    }
    let T = o ? o : f;
    m && (await $Bt({ gitRoot: e, baseRef: m, treeToRestore: T, host: a, signal: l, logger: c }));
    let P = await I(e, ["restore", "--source", T, "--worktree", "--", "."], a, { signal: l });
    if (!P.success) {
      let M = P.stderr || P.stdout || "Failed to restore working tree";
      return {
        status: "command-error",
        execOutput: Nt({
          command: P.command,
          stdout: P.stdout,
          stderr: P.stderr,
          fallbackOutput: M,
        }),
      };
    }
  }
  return (c.info("Synced branch applied to branch checkout"), { status: "success" });
}
async function FBt(t, e, r, n) {
  let o = null;
  for (let i of (0, kFe.default)(e, BBt)) {
    let s = await I(t, ["clean", "-fd", "--", ...i], r, { signal: n });
    if (!s.success) {
      o = s;
      break;
    }
  }
  return o;
}
async function $Bt({ gitRoot: t, baseRef: e, treeToRestore: r, host: n, signal: o, logger: i }) {
  let s = await I(t, ["diff", "--name-only", "--diff-filter=D", "--no-renames", e, r], n, {
    allowedNonZeroExitCodes: [1],
    signal: o,
  });
  if (!s.success) {
    i.warning("Failed to compute deleted paths before cleaning untracked files.");
    return;
  }
  let a =
    s.stdout.length > 0
      ? s.stdout
          .split(
            `
`,
          )
          .map((c) => c.trim())
          .filter((c) => c.length > 0)
      : [];
  if (a.length === 0) return;
  (await FBt(t, a, n, o)) &&
    i.warning("Failed to clean untracked files for deleted paths before restore.");
}
var kFe,
  BBt,
  MFe = g(() => {
    kFe = F(Bu());
    O();
    hr();
    UO();
    fd();
    IFe();
    fe();
    BBt = 1024;
  });
async function NFe({ worktreeRepo: t, query: e, limit: r, preserveRemoteRefs: n = !1, signal: o }) {
  let i = Math.max(1, Math.min(r, 20)),
    s = LFe(e)
      .split(" ")
      .filter((c) => c.length > 0);
  if (s.length === 0) return { branches: [], remoteBranchRefs: [] };
  let a = await OFe({
    boundedLimit: i,
    preserveRemoteRefs: !1,
    refPattern: "refs/heads",
    signal: o,
    terms: s,
    worktreeRepo: t,
  });
  if (a.length >= i || o?.aborted) return { branches: a, remoteBranchRefs: [] };
  let l = await OFe({
    boundedLimit: i - a.length,
    excludedBranchNames: new Set(a),
    preserveRemoteRefs: n,
    refPattern: "refs/remotes",
    signal: o,
    terms: s,
    worktreeRepo: t,
  });
  return n
    ? { branches: a, remoteBranchRefs: l }
    : { branches: [...a, ...l], remoteBranchRefs: [] };
}
function OFe({
  boundedLimit: t,
  excludedBranchNames: e,
  preserveRemoteRefs: r,
  refPattern: n,
  signal: o,
  terms: i,
  worktreeRepo: s,
}) {
  return s.queryClient.fetchQuery({
    queryKey: ne(s.root, s.host, "branch-search", n, i, String(t), String(r)),
    gcTime: be,
    meta: fO,
    queryFn: () =>
      UBt({
        boundedLimit: t,
        excludedBranchNames: e,
        preserveRemoteRefs: r,
        refPattern: n,
        signal: o,
        terms: i,
        worktreeRepo: s,
      }),
    staleTime: be,
  });
}
async function UBt({
  boundedLimit: t,
  excludedBranchNames: e,
  preserveRemoteRefs: r,
  refPattern: n,
  signal: o,
  terms: i,
  worktreeRepo: s,
}) {
  let a = new Set(),
    l = [],
    c = qBt(n, i),
    u = new AbortController(),
    p = null,
    m = "",
    f = new TextDecoder(),
    h = () => {
      u.signal.aborted || ((p = "parent"), u.abort());
    };
  o?.aborted ? h() : o?.addEventListener("abort", h);
  let v = (w) => {
      if (l.length >= t) return;
      let _ = GBt(w.trim(), r);
      if (_ == null || a.has(_) || e?.has(WBt(_))) return;
      let S = LFe(BFe(_));
      i.every((E) => S.includes(E)) &&
        (a.add(_), l.push(_), l.length >= t && ((p = "limit"), u.abort()));
    },
    y = !1;
  try {
    ({ success: y } = await I(
      s.root,
      ["for-each-ref", "--sort=-committerdate", ...c, "--format=%(refname)"],
      s.host,
      {
        signal: u.signal,
        collectOutput: !1,
        onStdoutRaw: (w) => {
          let _ = `${m}${f.decode(w, { stream: !0 })}`.split(`
`);
          m = _.pop() ?? "";
          for (let S of _) v(S);
        },
      },
    ));
  } finally {
    o?.removeEventListener("abort", h);
  }
  if (((m += f.decode()), p === "parent")) {
    let w = new Error("The operation was aborted");
    throw ((w.name = "AbortError"), o?.reason ?? w);
  }
  return !y && p !== "limit" ? [] : (m.length > 0 && v(m), l);
}
function qBt(t, e) {
  if (t === "refs/heads") return [t];
  let r = [...e]
    .filter((o) => o.length >= 2 && /^[a-z0-9]+$/.test(o))
    .sort((o, i) => i.length - o.length)[0];
  if (r == null) return [t];
  let n = Array.from(r, (o) =>
    o === "k" ? "[kK\u212A]" : o >= "a" && o <= "z" ? `[${o}${o.toUpperCase()}]` : o,
  ).join("");
  return [`${t}/**/*${n}*`, `${t}/**/*${n}*/**`];
}
function LFe(t) {
  return t
    .toLowerCase()
    .replace(/[-_/.\s]+/g, " ")
    .trim();
}
function GBt(t, e) {
  if (t.startsWith("refs/heads/")) return t.slice(11);
  if (!t.startsWith("refs/remotes/")) return null;
  let r = t.slice(13),
    n = r.indexOf("/");
  if (n < 0 || n === r.length - 1) return null;
  let o = r.slice(n + 1);
  return o === "HEAD" ? null : e ? t : o;
}
function BFe(t) {
  return t.startsWith("refs/remotes/") ? t.slice(13) : t;
}
function WBt(t) {
  let e = BFe(t);
  return t.startsWith("refs/remotes/") ? e.slice(e.indexOf("/") + 1) : e;
}
var FFe = g(() => {
  je();
  fe();
});
async function $Fe(t, e) {
  let r = await av(t, e);
  if (!r) return { branch: null, base: null, hasConflicts: !1 };
  let n = await B2e(t, e);
  return { branch: pv(r.branch), base: r.lastSyncedTreeRef, hasConflicts: n };
}
var UFe = g(() => {
  n5();
  iN();
  ad();
});
async function S5(t, e, r, n) {
  let o = await HBt(t, e, r, n);
  return !o.success || !o.stdout ? GFe : jBt(o.stdout);
}
function HBt(t, e, r, n) {
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "diff-stats", e, r),
    gcTime: be,
    meta: Ue,
    queryFn: () =>
      ds(t.root, ["--numstat", e, r], t.host, { allowedNonZeroExitCodes: [0, 1], signal: n }),
    staleTime: be,
  });
}
function jBt(t) {
  let e = t.trim();
  if (!e) return GFe;
  let r = 0,
    n = 0,
    o = 0;
  for (let i of e.split(/\r?\n/)) {
    let s = i.trim();
    if (!s) continue;
    let [a, l, ...c] = s.split("	");
    !a || !l || c.length === 0 || ((r += 1), (n += qFe(a)), (o += qFe(l)));
  }
  return { filesChanged: r, linesAdded: n, linesRemoved: o };
}
function qFe(t) {
  if (t === "-") return 0;
  let e = Number.parseInt(t, 10);
  return Number.isFinite(e) ? e : 0;
}
var GFe,
  WFe = g(() => {
    je();
    Vm();
    GFe = { filesChanged: 0, linesAdded: 0, linesRemoved: 0 };
  });
async function HFe(t, e, r) {
  return (
    (await Zs(t, r)).find((o) => (o.headRef.type !== "branch" ? !1 : o.headRef.string === e))
      ?.root ?? null
  );
}
var jFe = g(() => {
  Km();
});
async function zFe(t, e, r) {
  let n = await At(t, e, r);
  if (n && !Uo(n)) throw new Error(`Unexpected ${e} SHA: ${n}`);
  return n ? n : null;
}
var VFe = g(() => {
  O();
  ps();
  td();
});
async function KFe(t, e, r, n) {
  let o = await e.getWorktreeRepository(t, r);
  if (!o) throw new Error("Unable to resolve git root for synced branch status.");
  let { root: i } = o,
    s = qn(o),
    a = await av(o, n);
  if (!a) throw new Error("No synced branch config found for the current worktree.");
  try {
    let l = pv(a.branch),
      c = dd(o, { signal: n, untrackedPathsPromise: s }),
      [u, p, m, f, h] = await Promise.all([HFe(o, l, n), cl(o, n), c, zFe(o, a.branch, n), Cr(o)]);
    if (h) throw new Error("Worktree has a branch checked out.");
    if (p) {
      if (!f) throw new Error("Unable to resolve synced branch head SHA.");
    } else throw new Error("Unable to resolve worktree head state.");
    let v = null,
      y;
    u
      ? u === i
        ? ((v = o), (y = dd(o, { signal: n, untrackedPathsPromise: s })))
        : ((v = e.getWorktreeRepositoryForRoot(u, r)),
          (y = dd(v, { signal: n, untrackedPathsPromise: qn(v) })))
      : (y = Promise.resolve(null));
    let w = Xy(o, f, p, n),
      [_, S] = await Promise.all([w, y]),
      E = (M) => ({ leftRef: M, rightRef: M, filesChanged: 0, linesAdded: 0, linesRemoved: 0 }),
      T = m ? { ...(await S5(o, p, m, n)), leftRef: p, rightRef: m } : E(p),
      P = v && S ? { ...(await S5(v, f, S, n)), leftRef: f, rightRef: S } : E(f);
    return {
      branch: a.branch,
      worktreeSnapshot: { root: i, headCommitSha: p, workingTreeRef: m ?? void 0 },
      branchSnapshot: u
        ? { checkedOut: !0, snapshot: { root: u, headCommitSha: f, workingTreeRef: S ?? void 0 } }
        : { checkedOut: !1, headCommitSha: f },
      localCommitsAhead: _?.leftAhead ?? 0,
      worktreeCommitsAhead: _?.rightAhead ?? 0,
      localUncommittedDiffStats: P,
      worktreeUncommittedDiffStats: T,
    };
  } catch (l) {
    throw (
      zBt().warning("failed to collect synced branch status", {
        safe: {},
        sensitive: { error: l },
      }),
      l
    );
  }
}
var zBt,
  ZFe = g(() => {
    hr();
    WFe();
    jFe();
    VFe();
    Gi();
    fd();
    vO();
    Ks();
    HO();
    iN();
    ad();
    zBt = Ie("git");
  });
function w5(t) {
  let e = t.reviewSnapshot;
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "turn-diff-snapshot-tree", `${e.generation}`),
    gcTime: be,
    queryFn: () => e.read(() => VBt(t, e.signal)),
    staleTime: 0,
  });
}
async function VBt(t, e) {
  let { hasTrackedChanges: r, untrackedPaths: n } = await KBt(t, e);
  if (!r && n.length === 0) {
    let i = await I(t.root, ["rev-parse", "--verify", "HEAD^{tree}"], t.host, {
      allowedNonZeroExitCodes: [1, 128],
      signal: e,
    });
    if (i.code === 0) return XFe(i.stdout);
    if (!i.success) throw new Error(i.stderr || i.stdout || "Failed to resolve HEAD tree");
  }
  let o = await ol(t, e);
  if (o == null) throw new Error("Failed to resolve git index path");
  return cv(
    o,
    async (i) => {
      let s = await ud({
        gitRoot: t.root,
        env: i,
        fallback: "error",
        host: t.host,
        includeTrackedChanges: r,
        signal: e,
        untrackedPathsPromise: Promise.resolve({ success: !0, gitRoot: t.root, paths: n }),
      });
      if (!s.success) throw new Error(s.stderr || s.stdout || "Failed to stage turn diff snapshot");
      let a = await I(t.root, ["write-tree"], t.host, { env: i, signal: e });
      if (!a.success) throw new Error(a.stderr || a.stdout || "Failed to write turn diff snapshot");
      return XFe(a.stdout);
    },
    t.host,
  );
}
async function KBt(t, e) {
  let r = await to(t, e),
    n = await I(
      t.root,
      ["status", "--no-renames", "--porcelain=v1", "-z", "--untracked-files=normal"],
      t.host,
      { configOverrides: r, signal: e, trim: !1 },
    );
  if (!n.success) throw new Error(n.stderr || n.stdout || "Failed to read turn diff status");
  return ZBt(n.stdout);
}
function ZBt(t) {
  let e = !1,
    r = new Array(),
    n = 0;
  for (; n < t.length; ) {
    let o = t.indexOf("\0", n);
    if (o === -1 || o < n + 3) throw new Error("Malformed turn diff status output");
    let i = t[n],
      s = t[n + 1];
    (i === "?" && s === "?" ? r.push(t.slice(n + 3, o)) : (e = !0), (n = o + 1));
  }
  return { hasTrackedChanges: e, untrackedPaths: r };
}
function XFe(t) {
  let e = t.trim();
  if (!Uo(e) && !/^[0-9a-f]{64}$/i.test(e)) throw new Error(`Unexpected tree SHA: ${e}`);
  return e;
}
var YFe = g(() => {
  O();
  Zy();
  xc();
  je();
  td();
  fe();
  qO();
  GO();
});
async function QFe({
  host: t,
  baseTurnId: e,
  checkpointKey: r,
  cwd: n,
  gitManager: o,
  isRepoWatched: i,
  signal: s,
  turnId: a,
}) {
  let l = await o.getWorktreeRepository(n, t);
  if (l == null) return null;
  let c = e == null ? await md(l, s) : null,
    u = await w5(l),
    [p, m] = await Promise.all([
      dN(l, { isRepoWatched: i?.(l.root), signal: s }),
      c == null
        ? null
        : A5({ host: t, baseRef: c, headTreeSha: u, root: l.root, signal: s, timeoutMs: JBt }),
    ]),
    f = Date.now(),
    h = `${yN}/${f}/${crypto.randomUUID()}`,
    v = `${x5}/${await _5(r)}`,
    y = `${v}/${await _5(a)}`;
  return (
    await R5({ host: t, ref: `${h}/base`, root: l.root, signal: s, treeSha: u }),
    await PA.get(t1e(l.root, v))?.catch(() => {}),
    await rFt({ host: t, nowMs: f, root: l.root }).catch(() => {}),
    {
      baseTreeSha: u,
      baseTurnHeadTreeSha:
        e == null
          ? null
          : await tFt({ host: t, nowMs: f, refPrefix: `${v}*/${await _5(e)}*/*/*`, root: l.root }),
      sessionStartCommitSha: c,
      sessionStartDiff: m,
      checkpointRefPrefix: y,
      checkpointScopeRefPrefix: v,
      refPrefix: h,
      ...p,
      root: l.root,
    }
  );
}
function e1e({ host: t, capture: e, gitManager: r, retainCheckpoint: n, signal: o }) {
  let i = t1e(e.root, e.checkpointScopeRefPrefix),
    s = QBt({ host: t, capture: e, gitManager: r, signal: o }),
    l = (PA.get(i) ?? Promise.resolve())
      .then(async () => {
        let c = await s;
        n &&
          c.diff.type === "success" &&
          (await eFt({ host: t, capture: e, headTreeSha: c.headTreeSha, signal: o }));
      })
      .then(
        () => {},
        () => {},
      );
  return (
    PA.set(i, l),
    l
      .then(() => s)
      .finally(() => {
        PA.get(i) === l && PA.delete(i);
      })
  );
}
async function QBt({ host: t, capture: e, gitManager: r, signal: n }) {
  try {
    let o = r.getWorktreeRepositoryForRoot(e.root, t),
      i = await w5(o);
    await R5({ host: t, ref: `${e.refPrefix}/head`, root: e.root, signal: n, treeSha: i });
    let [s, a] = await Promise.all([
      A5({ host: t, baseRef: e.baseTreeSha, headTreeSha: i, root: e.root, signal: n }),
      e.baseTurnHeadTreeSha == null
        ? null
        : A5({
            host: t,
            baseRef: e.baseTurnHeadTreeSha,
            headTreeSha: e.baseTreeSha,
            root: e.root,
            signal: n,
          }),
    ]);
    return {
      baseTreeSha: e.baseTreeSha,
      baseTurnHeadTreeSha: e.baseTurnHeadTreeSha,
      betweenTurnDiff: a,
      sessionStartCommitSha: e.sessionStartCommitSha,
      sessionStartDiff: e.sessionStartDiff,
      headTreeSha: i,
      diff: s,
    };
  } finally {
    await Promise.allSettled([
      vN({ host: t, ref: `${e.refPrefix}/head`, root: e.root }),
      vN({ host: t, ref: `${e.refPrefix}/base`, root: e.root }),
    ]);
  }
}
