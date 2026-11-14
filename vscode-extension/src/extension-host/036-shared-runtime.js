async function $2t({ diffArgs: t, hideWhitespace: e, metadata: r, renames: n, reviewSnapshot: o }) {
  let i = await eBe({
    changedPaths: new Set(r.files.filter((c) => c.previousPath == null).map((c) => c.path)),
    diffArgs: t,
    existingRenameKeys: new Set(
      r.files.filter((c) => c.previousPath != null).map((c) => Cc(c.path, c.previousPath)),
    ),
    hideWhitespace: e,
    renames: n,
    reviewSnapshot: o,
  });
  if (i.length === 0) return r;
  let s = new Map(i.map((c) => [c.path, c])),
    a = new Set(i.map((c) => c.previousPath)),
    l = new Map(r.rawEntries.filter((c) => c.previousPath == null).map((c) => [c.path, c]));
  return {
    files: r.files
      .filter((c) => c.previousPath != null || !a.has(c.path) || c.changeKind !== "deleted")
      .map((c) => {
        let u = c.previousPath == null ? s.get(c.path) : null;
        return u == null ? c : { ...c, changeKind: "renamed", previousPath: u.previousPath };
      }),
    rawEntries: r.rawEntries
      .filter((c) => c.previousPath != null || !a.has(c.path) || c.status !== "D")
      .map((c) => {
        let u = c.previousPath == null ? s.get(c.path) : null,
          p = u == null ? null : l.get(u.previousPath);
        return u == null || p == null
          ? c
          : {
              ...c,
              oldMode: p.oldMode,
              oldOid: p.oldOid,
              previousPath: u.previousPath,
              status: "R",
            };
      }),
    stats: Z2e(
      r.stats,
      i,
      new Set(r.rawEntries.filter((c) => c.status === "D").map((c) => c.path)),
    ),
  };
}
function Q2e(t, e) {
  let r = t.rawEntries.filter((s) => s.status === "D" && s.previousPath == null),
    n = t.rawEntries.flatMap((s) => {
      if (s.status !== "A" || s.previousPath != null || !e.has(s.path)) return [];
      let a = r.filter((c) => s.newOid.startsWith(c.oldOid)),
        l = a.length === 1 ? a[0] : null;
      return l == null ? [] : [{ path: s.path, previousPath: l.path, deleted: l }];
    });
  if (n.length === 0) return t;
  let o = new Map(n.map((s) => [s.path, s])),
    i = new Set(n.map((s) => s.previousPath));
  return {
    files: t.files
      .filter((s) => s.previousPath != null || !i.has(s.path) || s.changeKind !== "deleted")
      .map((s) => {
        let a = s.previousPath == null ? o.get(s.path) : null;
        return a == null ? s : { ...s, changeKind: "renamed", previousPath: a.previousPath };
      }),
    rawEntries: t.rawEntries
      .filter((s) => s.previousPath != null || !i.has(s.path) || s.status !== "D")
      .map((s) => {
        let a = s.previousPath == null ? o.get(s.path) : null;
        return a == null
          ? s
          : {
              ...s,
              oldMode: a.deleted.oldMode,
              oldOid: a.deleted.oldOid,
              previousPath: a.previousPath,
              status: "R",
            };
      }),
    stats: [
      ...t.stats.filter((s) => s.previousPath != null || (!i.has(s.path) && !o.has(s.path))),
      ...n.map((s) => ({ additions: 0, deletions: 0, path: s.path, previousPath: s.previousPath })),
    ],
  };
}
async function eBe({
  changedPaths: t,
  diffArgs: e,
  existingRenameKeys: r,
  hideWhitespace: n,
  renames: o,
  reviewSnapshot: i,
}) {
  let [s] = e;
  return s == null
    ? []
    : (
        await Promise.all(
          o.map(async (l) => {
            if (r.has(Cc(l.path, l.previousPath)) || !t.has(l.previousPath) || !t.has(l.path))
              return null;
            let c = await zO(i, `${s}:${l.previousPath}`, l.path, { hideWhitespace: n });
            if (!c.success || c.outputLimitExceeded) return null;
            let u = T2e(c.stdout);
            return { ...l, additions: u?.additions ?? null, deletions: u?.deletions ?? null };
          }),
        )
      ).filter((l) => l != null);
}
async function U2t({ includeUntrackedFiles: t, reviewSnapshot: e, untrackedFileCount: r }) {
  let [n, o] = await Promise.all([
    hd({ includeUntrackedFiles: !1, reviewSnapshot: e, source: "staged" }),
    hd({ includeUntrackedFiles: t && r == null, reviewSnapshot: e, source: "unstaged" }),
  ]);
  if (n.type !== "success" || o.type !== "success") return null;
  let i = await ld(e.worktreeRepo, !1, e);
  if (i.type !== "success") return null;
  let s = await RA({
    diffArgs: o.diffArgs,
    reviewSnapshot: e,
    source: "unstaged",
    statusPaths: i.trackedPaths,
  });
  if (s == null) return null;
  let [a, l] = await Promise.all([
    rN({ diffArgs: n.diffArgs, hideWhitespace: !0, reviewSnapshot: e }),
    rN({ diffArgs: o.diffArgs, hideWhitespace: !0, paths: s.paths, reviewSnapshot: e }),
  ]);
  if (a == null || l == null || o.unmergedPaths.type !== "scanned") return null;
  let c = rBe(o.unmergedPaths.pathSet),
    u = a5([...l.files, ...c]),
    p = t ? (r ?? o.untrackedPaths.paths.length) : 0;
  return e.read(async () => ({
    stagedFileCount: a5([...a.files, ...c]).length,
    unstagedFileCount: u.length,
    untrackedFileCount: p,
  }));
}
async function rN({ diffArgs: t, hideWhitespace: e, paths: r, reviewSnapshot: n }) {
  if (r?.length === 0) return { files: [], rawEntries: [], stats: [] };
  let o = r != null && r.length > 0 ? ["--", ...r.map((f) => `:(literal)${f}`)] : [],
    i = e ? ["--ignore-all-space"] : [],
    s = await tBe(n, [
      ...t,
      ...i,
      "--find-renames",
      "--raw",
      "--no-abbrev",
      "--numstat",
      "-z",
      ...o,
    ]);
  if (!s.success) return null;
  let a = W2t(s.stdout),
    l = new Set(
      a.stats.filter((f) => (f.additions ?? 0) > 0 || (f.deletions ?? 0) > 0).map((f) => f.path),
    ),
    c = a.rawEntries.filter(
      (f) =>
        f.status === "M" &&
        f.oldMode === f.newMode &&
        f.oldMode !== "160000" &&
        /^0+$/.test(f.newOid) &&
        !l.has(f.path),
    ),
    u = new Set();
  if (c.length > 0) {
    let f = await tN(
      n,
      c.map((h) => h.path),
    );
    if (f == null) return null;
    for (let h of c) f.get(h.path)?.oid === h.oldOid && u.add(h.path);
  }
  let p = e ? new Set(a.stats.map((f) => Cc(f.path, f.previousPath))) : null,
    m = a.rawEntries.filter((f) =>
      u.has(f.path)
        ? !1
        : p == null || f.status === "A" || f.status === "U" || p.has(Cc(f.path, f.previousPath)),
    );
  return {
    files: m.map(({ path: f, previousPath: h, status: v }) => ({
      additions: null,
      changeKind: z2t(v),
      deletions: null,
      path: f,
      previousPath: h,
    })),
    rawEntries: m,
    stats: a.stats.filter((f) => !u.has(f.path)),
  };
}
async function RA({
  diffArgs: t,
  requestedPaths: e,
  reviewSnapshot: r,
  source: n,
  statusPaths: o,
}) {
  if (n !== "branch" && n !== "uncommitted" && n !== "unstaged") return { paths: e };
  let i = o;
  if (n === "branch" || n === "uncommitted") {
    let [s] = t;
    if (s == null) return null;
    let a = await tBe(r, ["--cached", s, "--no-renames", "--name-only", "-z"]);
    if (!a.success) return null;
    i = [...new Set([...i, ...a.stdout.split("\0").filter((l) => l.length > 0)])];
  }
  if (e != null) {
    let s = new Set(e);
    i = i.filter((a) => s.has(a));
  }
  return { paths: i.length > L2t ? e : i };
}
function tBe(t, e) {
  return t.worktreeRepo.queryClient.fetchQuery({
    queryKey: t.queryKey("review-metadata-diff", e),
    meta: Ue,
    queryFn: async () => {
      let r = await t.gitDiff(e, {
          allowedNonZeroExitCodes: [0, 1],
          collectStdoutBuffer: !0,
          env: { GIT_LITERAL_PATHSPECS: "0" },
          trim: !1,
        }),
        n = Ns(r.stdoutBuffer);
      return { ...r, success: r.success && n != null, stdout: n ?? "" };
    },
    staleTime: Ve,
  });
}
async function q2t({
  host: t,
  gitRoot: e,
  metadata: r,
  reviewSnapshot: n,
  source: o,
  untrackedPathSet: i,
}) {
  let s = r.files.map((p) =>
      p.previousPath == null && i.has(p.path) ? { ...p, changeKind: "untracked" } : p,
    ),
    a = a5(s),
    l = r.rawEntries.filter((p) => p.status !== "D" && /^0+$/.test(p.newOid)).map((p) => p.path),
    c = await tN(n, l);
  return c == null
    ? null
    : (
        await H2t({
          host: t,
          files: a,
          gitRoot: e,
          rawEntries: r.rawEntries.map((p) => ({ ...p, newOid: c.get(p.path)?.oid ?? p.newOid })),
          source: o,
          stats: r.stats,
        })
      ).sort((p, m) => p.path.localeCompare(m.path));
}
function a5(t) {
  let e = new Map();
  for (let r of t) {
    let n = Cc(r.path, r.previousPath);
    e.get(n)?.changeKind !== "unmerged" && e.set(n, r);
  }
  return [...e.values()];
}
function rBe(t) {
  return [...t].map((e) => ({
    additions: null,
    changeKind: "unmerged",
    deletions: null,
    path: e,
    previousPath: null,
  }));
}
function G2t(t, e) {
  return t == null || t.length === 0 ? [...e] : t.filter((r) => e.has(r));
}
function nBe(t, e) {
  if (!(t == null || e == null || t <= e)) return { count: t, limit: e };
}
function oBe(t, e) {
  return {
    files: [...t.files, ...e.files],
    rawEntries: [...t.rawEntries, ...e.rawEntries],
    stats: [...t.stats, ...e.stats],
  };
}
async function iBe(t, e) {
  if (e.length === 0) return { files: [], rawEntries: [], stats: [] };
  let r = await tN(t, e, { includeDiffMetadata: !0 });
  if (r == null) return null;
  let n = [...r];
  return {
    files: n.map(([o]) => ({
      additions: null,
      changeKind: "added",
      deletions: null,
      path: o,
      previousPath: null,
    })),
    rawEntries: n.map(([o, i]) => ({
      newMode: i.mode ?? "000000",
      newOid: i.oid,
      oldMode: "000000",
      oldOid: "0".repeat(40),
      path: o,
      previousPath: null,
      status: "A",
    })),
    stats: n.map(([o, i]) => ({
      additions: i.additions,
      deletions: i.deletions,
      path: o,
      previousPath: null,
    })),
  };
}
function W2t(t) {
  let e = t.split("\0").filter((o) => o.length > 0),
    r = [],
    n = [];
  for (let o = 0; o < e.length; o += 1) {
    let i = e[o];
    if (i == null) break;
    let s = /^:(\d{6}) (\d{6}) ([0-9a-f]+) ([0-9a-f]+) ([A-Z])(?:\d+)?$/.exec(i);
    if (s != null) {
      let [, h, v, y, w, _] = s;
      if (h == null || v == null || y == null || w == null || _ == null) continue;
      let S = _ === "R" || _ === "C",
        E = S ? e[o + 1] : null,
        T = e[o + (S ? 2 : 1)];
      if (T == null || (S && E == null)) break;
      (r.push({
        newMode: v,
        newOid: w,
        oldMode: h,
        oldOid: y,
        path: T,
        previousPath: E,
        status: _,
      }),
        (o += S ? 2 : 1));
      continue;
    }
    let a = /^(-|\d+)\t(-|\d+)\t(.*)$/s.exec(i);
    if (a == null) continue;
    let [, l, c, u] = a;
    if (l == null || c == null || u == null) continue;
    let p = u.length === 0,
      m = p ? e[o + 1] : null,
      f = p ? e[o + 2] : u;
    if (f == null || (p && m == null)) break;
    (n.push({ additions: K2e(l), deletions: K2e(c), path: f, previousPath: m }), (o += p ? 2 : 0));
  }
  return { rawEntries: r, stats: n };
}
async function H2t({ host: t, files: e, gitRoot: r, rawEntries: n, source: o, stats: i }) {
  let s = new Map(i.map((l) => [Cc(l.path, l.previousPath), l])),
    a = new Map(n.map((l) => [Cc(l.path, l.previousPath), l]));
  return Promise.all(
    e.map(async (l) => {
      let c = Cc(l.path, l.previousPath),
        u = s.get(c) ?? null,
        p = a.get(c) ?? null,
        m =
          p == null
            ? await j2t({
                fallback: `${o}:${l.changeKind}:${l.previousPath ?? ""}:${l.path}`,
                host: t,
                filePath: l.path,
                gitRoot: r,
              })
            : l.changeKind === "untracked"
              ? `untracked:${p.newMode}:${p.newOid}`
              : `${o}:${p.status}:${p.oldMode}:${p.oldOid}:${p.newMode}:${p.newOid}`;
      return {
        ...l,
        baseObjectId:
          p != null &&
          u?.additions != null &&
          u.deletions != null &&
          p.oldMode !== "160000" &&
          p.newMode !== "160000" &&
          !/^0+$/.test(p.oldOid)
            ? p.oldOid
            : null,
        additions: u?.additions ?? null,
        deletions: u?.deletions ?? null,
        revision: m,
      };
    }),
  );
}
function Cc(t, e) {
  return `${e ?? ""}\0${t}`;
}
function K2e(t) {
  if (t === "-") return null;
  let e = Number.parseInt(t, 10);
  return Number.isNaN(e) ? null : e;
}
async function j2t({ fallback: t, host: e, gitRoot: r, filePath: n }) {
  try {
    let o = await e.platformPath(),
      i = await e.stat(o.join(r, n), { bypassCache: !0 });
    return `${t}:${i.size}:${Math.floor(i.mtimeMs)}`;
  } catch {
    return t;
  }
}
function z2t(t) {
  return t === "A"
    ? "added"
    : t === "D"
      ? "deleted"
      : t === "R"
        ? "renamed"
        : t === "C"
          ? "copied"
          : t === "T"
            ? "type-changed"
            : t === "U"
              ? "unmerged"
              : "modified";
}
var L2t,
  nN = g(() => {
    O();
    cd();
    SA();
    j2e();
    Ks();
    je();
    V2e();
    xA();
    L2t = 512;
  });
function lBe(t) {
  let e =
    /^staged:M:(100644|100755):([0-9a-f]{40}|[0-9a-f]{64}):\1:([0-9a-f]{40}|[0-9a-f]{64})$/.exec(t);
  return e == null || e[2].length !== e[3].length ? null : { head: e[2], staged: e[3], mode: e[1] };
}
async function cBe(t, e, r, n) {
  let o = AbortSignal.timeout(sBe),
    i = n == null ? o : AbortSignal.any([n, o]);
  if (i.aborted) return "refused";
  let s = await I(
    t.root,
    ["config", "--name-only", "--get-regexp", "^hook\\..+\\.event$", "^post-index-change$"],
    t.host,
    { allowedNonZeroExitCodes: [1], collectOutput: !1, signal: i },
  );
  if (i.aborted) return "refused";
  if (!s.success || s.code !== 1) return "use-patch";
  let a = AbortSignal.timeout(K2t),
    l = AbortSignal.any([i, a]),
    c = pt(),
    u = pt(),
    p = new TextDecoder(),
    m = new TextEncoder().encode(`${r.mode} ${r.head}	${e}\0`),
    f = "",
    h,
    v = !1,
    y = !1,
    w = !1,
    _ = I(t.root, ["update-index", "-z", "--index-info"], t.host, {
      env: { GIT_TRACE2_EVENT: "2", GIT_TRACE2_EVENT_NESTING: "2" },
      stdin: { byteLength: m.length, bytes: u.promise },
      collectOutput: !1,
      maxOutputBytes: 1024 * 1024,
      timeoutMs: sBe + 5e3,
      onStderrRaw(T) {
        if (v && !w) return;
        let P = (f + p.decode(T, { stream: !0 })).split(`
`);
        f = P.pop() ?? "";
        for (let M of P) {
          if (w) {
            M.trimEnd() === `fatal: malformed index info ${aBe}` && (y = !0);
            continue;
          }
          let L;
          try {
            L = JSON.parse(M);
          } catch {
            continue;
          }
          let V = V2t.safeParse(L);
          if (!(!V.success || V.data.thread !== "main")) {
            if (V.data.event === "version" && h == null) h = V.data.sid;
            else if (
              V.data.sid === h &&
              V.data.event === "region_leave" &&
              V.data.category === "index" &&
              V.data.label === "do_read_index"
            ) {
              ((v = !0), c.resolve(!0));
              break;
            }
          }
        }
      },
    }),
    S = !1;
  try {
    if (await Lt(Promise.race([c.promise, _.then(() => !1)]), l)) {
      let P = await I(
          t.root,
          [
            "diff",
            "--cached",
            "--raw",
            "--no-abbrev",
            "--no-renames",
            "--no-ext-diff",
            "--no-textconv",
            "-z",
            "--",
            `:(literal)${e}`,
          ],
          t.host,
          { env: { GIT_LITERAL_PATHSPECS: "0" }, signal: i, trim: !1 },
        ),
        M = `:${r.mode} ${r.mode} ${r.head} ${r.staged} M\0${e}\0`;
      S = P.success && P.stdout === M && !i.aborted;
    }
  } catch {
    w = a.aborted && !i.aborted && !v;
  } finally {
    if (S) u.resolve(m);
    else {
      let T = new Uint8Array(m.length);
      (T.set(new TextEncoder().encode(aBe)), u.resolve(T));
    }
  }
  let E = await _;
  return S && E.success
    ? "applied"
    : w && !i.aborted && y && E.code === 128
      ? "use-patch"
      : "refused";
}
var V2t,
  sBe,
  K2t,
  aBe,
  uBe = g(() => {
    O();
    $();
    fe();
    ((V2t = d.object({
      event: d.string(),
      sid: d.string(),
      thread: d.string(),
      category: d.string().optional(),
      label: d.string().optional(),
    })),
      (sBe = 6e4),
      (K2t = 1e3),
      (aBe = "codex-unstage-declined"));
  });
async function pBe({ action: t, host: e, cwd: r, files: n, gitManager: o, signal: i, source: s }) {
  let a = await o.getWorktreeRepository(r, e);
  if (a?.root == null)
    return {
      status: "error",
      appliedPaths: [],
      skippedPaths: [],
      conflictedPaths: [],
      errorCode: "not-git-repo",
    };
  let l = await e.platformPath(),
    c = n.map((_) => ({ ..._, path: Y2t(l, a.root, r, _.path) }));
  if (c.length === 0)
    return { status: "error", appliedPaths: [], skippedPaths: [], conflictedPaths: [] };
  let u = c.length === 1 ? c[0] : void 0,
    p =
      t === "unstage" && s === "staged" && u?.changeKind === "modified" && u.previousPath == null
        ? lBe(u.revision)
        : null;
  (Rn(a), a.clearShortLivedGitReadCaches());
  let m = await QO(a.reviewSnapshot, s, c, {
    binary: p == null,
    preserveTypeChangeSections:
      t === "stage" || (t === "unstage" && s === "staged") || (t === "revert" && s === "unstaged"),
  }).catch(() => null);
  if (m == null)
    return { status: "error", appliedPaths: [], skippedPaths: [], conflictedPaths: [] };
  if (u != null && p != null) {
    let _ = m.diffs[u.path];
    if (_?.type === "success" && /^Binary files /m.test(_.diff)) {
      let S = `index ${p.head}..${p.staged} ${p.mode}`,
        E = _.diff
          .split(
            `
`,
          )
          .includes(S)
          ? await cBe(a, u.path, p, i)
          : "refused";
      if (E !== "use-patch")
        return {
          status: E === "applied" ? "success" : "error",
          appliedPaths: [],
          skippedPaths: [],
          conflictedPaths: [],
        };
    }
  }
  a.clearShortLivedGitReadCaches();
  let f = await Y2e({
      paths: [
        ...new Set(
          c.flatMap((_) => (_.previousPath == null ? [_.path] : [_.path, _.previousPath])),
        ),
      ],
      source: s,
      worktreeRepo: a,
    }),
    h = f.type === "success" ? new Map(f.files.map((_) => [_.path, _.revision])) : null;
  if (h == null || c.some((_) => h.get(_.path) !== _.revision))
    return { status: "error", appliedPaths: [], skippedPaths: [], conflictedPaths: [] };
  let v = c.flatMap((_) => {
      let S = m.diffs[_.path];
      return S?.type === "success" ? [S.diff] : [];
    }),
    y = c.flatMap((_) => {
      let S = m.diffs[_.path];
      if (S?.type !== "success") return [];
      if (_.changeKind === "untracked") {
        let T = Z2t(S.diff);
        return T == null ? [] : [{ path: _.path, sha: T, revertToSha: null }];
      }
      let E = /^index ([0-9a-f]{40,64})\.\.([0-9a-f]{40,64}) 160000$/m.exec(S.diff);
      return _.changeKind === "modified" && E != null
        ? [{ path: _.path, sha: E[2], revertToSha: E[1] }]
        : [];
    }),
    w = v.join("");
  if (v.length !== c.length || w.trim().length === 0)
    return { status: "error", appliedPaths: [], skippedPaths: [], conflictedPaths: [] };
  switch (t) {
    case "stage":
      return EA({ host: e, diff: w, gitManager: o, repoRoot: a.root, signal: i, target: "staged" });
    case "unstage":
      return EA({
        host: e,
        diff: w,
        gitManager: o,
        repoRoot: a.root,
        revert: !0,
        signal: i,
        target: "staged",
      });
    case "revert": {
      if (s === "staged") {
        let P = await EA({
          host: e,
          diff: w,
          gitManager: o,
          repoRoot: a.root,
          revert: !0,
          signal: i,
          target: "staged",
        });
        if (P.status !== "success") return P;
        let M = await EA({
          host: e,
          diff: w,
          gitManager: o,
          repoRoot: a.root,
          revert: !0,
          signal: i,
          target: "unstaged",
        });
        return M.status === "success" ? M : { ...M, status: "partial-success" };
      }
      let _ = await X2t({
        gitlinks: y,
        gitManager: o,
        host: e,
        path: l,
        repoRoot: a.root,
        signal: i,
      }).catch(() => null);
      if (_ == null)
        return {
          status: "error",
          appliedPaths: [],
          skippedPaths: y.map((P) => P.path),
          conflictedPaths: [],
        };
      let S = await EA({
        host: e,
        diff: w,
        gitManager: o,
        repoRoot: a.root,
        revert: !0,
        signal: i,
        target: "unstaged",
      });
      if (S.status !== "success" || _.length === 0) return S;
      let E = await Promise.all(
        _.map(async ({ gitlink: P, absolutePath: M, configOverrides: L }) => {
          try {
            if (P.revertToSha == null)
              return (
                await e.remove(M, { recursive: !0, force: !0 }),
                { path: P.path, success: !0 }
              );
            let V = await I(
              M,
              [
                "checkout",
                "--detach",
                "--no-recurse-submodules",
                "--no-overwrite-ignore",
                P.revertToSha,
              ],
              e,
              { configOverrides: L, env: dBe, signal: i },
            );
            return { path: P.path, success: V.success };
          } catch {
            return { path: P.path, success: !1 };
          }
        }),
      );
      Rn(a);
      let T = E.filter((P) => !P.success).map((P) => P.path);
      return T.length === 0
        ? S
        : {
            ...S,
            status: "partial-success",
            appliedPaths: S.appliedPaths.filter((P) => !T.includes(P)),
            skippedPaths: [...S.skippedPaths, ...T],
          };
    }
  }
}
function Z2t(t) {
  return /^new file mode 160000$/m.test(t)
    ? (/^\+Subproject commit ([0-9a-f]{40,64})$/m.exec(t)?.[1] ?? null)
    : null;
}
async function X2t({ gitlinks: t, gitManager: e, host: r, path: n, repoRoot: o, signal: i }) {
  let s = await Promise.all(
    t.map(async (a) => {
      let l = n.join(o, a.path),
        c = e.getWorktreeRepositoryForRoot(l, r),
        u = await to(c, i),
        p = { configOverrides: u, env: dBe, signal: i },
        [m, f, h] = await Promise.all([
          I(l, ["rev-parse", "--show-prefix", "HEAD"], r, p),
          I(
            l,
            [
              "status",
              "--porcelain=v1",
              "--untracked-files=all",
              "--ignored=matching",
              "--ignore-submodules=none",
            ],
            r,
            p,
          ),
          a.revertToSha == null
            ? null
            : I(l, ["cat-file", "-e", `${a.revertToSha}^{commit}`], r, p),
        ]);
      return !m.success ||
        !f.success ||
        h?.success === !1 ||
        m.stdout.trim() !== a.sha ||
        f.stdout.trim().length > 0
        ? null
        : { gitlink: a, absolutePath: l, configOverrides: u };
    }),
  );
  return s.some((a) => a == null) ? null : s.filter((a) => a != null);
}
function Y2t(t, e, r, n) {
  return n.startsWith("./") ||
    n.startsWith("../") ||
    (t.sep === "\\" && (n.startsWith(".\\") || n.startsWith("..\\")))
    ? ro(t, e, r, n)
    : ro(t, e, e, n);
}
function EA({ host: t, diff: e, gitManager: r, repoRoot: n, revert: o, signal: i, target: s }) {
  return id({ allowBinary: !0, atomic: !0, cwd: n, diff: e, revert: o, target: s }, r, t, {
    gitConfigOverrides: s === "staged" && !o ? ["-c", "apply.whitespace=nowarn"] : [],
    signal: i,
  });
}
var dBe,
  mBe = g(() => {
    O();
    s5();
    nN();
    xc();
    Ks();
    od();
    nv();
    fe();
    uBe();
    dBe = { GIT_NO_LAZY_FETCH: "1", GIT_ALLOW_PROTOCOL: "" };
  });
function hBe(t) {
  let e = J2t(t);
  return e !== void 0 ? e : eve;
}
function J2t(t) {
  if (t == null) return t;
  let e = t.trim();
  return e || null;
}
function gBe(t, e) {
  if (!e) return t;
  let r = Q2t(e);
  if (eBt(t, r)) return t;
  let n = t.trimEnd();
  if (!n) return r;
  let o = tBt(n)
    ? `
`
    : `

`;
  return `${n}${o}${r}`;
}
function Q2t(t) {
  return `Co-authored-by: ${t}`;
}
function eBt(t, e) {
  let r = (0, fBe.default)(e);
  return new RegExp(`^${r}$`, "gim").test(t);
}
function tBt(t) {
  let e = t.split(/\r?\n/),
    r = e.length - 1,
    n = !1;
  for (; r >= 0 && e[r]?.trim() !== ""; ) {
    if (!rBt(e[r])) return !1;
    ((n = !0), (r -= 1));
  }
  return n;
}
function rBt(t) {
  return /^[A-Za-z][A-Za-z0-9-]*:\s+\S/.test(t);
}
var fBe,
  yBe = g(() => {
    fBe = F(pK());
    O();
  });
async function vBe(t, e, r, n, o, i = !1) {
  let s;
  try {
    s = await h2e(t, e, r, n);
    let l = await r.platformPath(),
      c = l.dirname(e);
    Uy(l.basename(c)) && (await r.writeFile(l.join(c, $y), ""));
  } catch (l) {
    if (
      (l instanceof pd ||
        nBt().warning("[worktree-snapshot] failed to snapshot worktree", {
          safe: { worktreeId: await eo(e), reason: n },
          sensitive: { error: l },
        }),
      n !== "settings-delete-targeted")
    )
      throw l;
  }
  let a = await t.getCachedWorktreeRepository(s?.repoRoot ?? e, r);
  try {
    await ms(e, r, o, void 0, i, s);
  } catch (l) {
    throw new Jm(l);
  }
  a != null && t.releaseDeletedWorktree(a);
}
var nBt,
  Jm,
  bBe = g(() => {
    hr();
    zx();
    ev();
    rd();
    bA();
    ((nBt = Ie("worktree-snapshot")),
      (Jm = class extends Error {
        constructor(e) {
          super("Worktree removal failed after saving its recovery snapshot.", { cause: e });
        }
      }));
  });
async function SBe(t, e, r) {
  let n = new Map(e.map((m) => [`refs/heads/${m}`, m]));
  if (n.size === 0) return { branches: {} };
  let { root: o, host: i } = t,
    [s, a] = await Promise.allSettled([
      I(o, ["for-each-ref", "--format=%(refname)", "--", ...n.keys()], i, { signal: r }),
      I(o, ["remote"], i, { signal: r }),
    ]),
    l = new Set();
  if (s.status === "fulfilled" && s.value.success)
    for (let m of s.value.stdout.split(`
`))
      l.add(m);
  let c =
      s.status === "fulfilled" && s.value.success && a.status === "fulfilled" && a.value.success,
    u = [...n.keys()].filter((m) => !l.has(m));
  if (u.length > 0 && a.status === "fulfilled" && a.value.success) {
    let m = await Promise.allSettled(
      a.value.stdout
        .split(
          `
`,
        )
        .filter((f) => f.length > 0)
        .map((f) =>
          I(o, ["ls-remote", "--heads", "--", f, ...u], i, { signal: r, timeoutMs: 1e4 }),
        ),
    );
    for (let f of m) {
      if (f.status === "rejected" || !f.value.success) {
        c = !1;
        continue;
      }
      for (let h of f.value.stdout.split(`
`)) {
        let v = h.split("	")[1];
        v != null && l.add(v);
      }
    }
  }
  let p = c ? !1 : null;
  return { branches: Object.fromEntries([...n].map(([m, f]) => [f, l.has(m) ? !0 : p])) };
}
var wBe = g(() => {
  fe();
});
async function l5(t, e, r, { live: n = !1 } = {}) {
  let o = t.watchScopedGitReadGeneration,
    i = await YO({ baseBranch: e, signal: r, source: "branch", worktreeRepo: t }),
    s = i.type === "success" ? i.args[0] : null;
  return s == null ? [] : iBt(t, s, r, n && o === t.watchScopedGitReadGeneration);
}
function RBe(t, e, r = !1, n) {
  return e.length === 0 || e.length > xBe
    ? Promise.resolve([])
    : Er(
        t.queryClient,
        {
          queryKey: ne(
            t.root,
            t.host,
            "review-commit-line-counts",
            e,
            r ? "ignore-whitespace" : "include-whitespace",
          ),
          gcTime: be,
          meta: Ue,
          staleTime: 1 / 0,
          queryFn: async (o) => {
            let i = await I(
              t.root,
              [
                "log",
                "--no-walk=unsorted",
                "--format=%x1e%H",
                "--numstat",
                ...(r ? ["--ignore-all-space"] : []),
                "--diff-merges=first-parent",
                ...e,
                "--",
              ],
              t.host,
              { maxOutputBytes: ABe, signal: o },
            );
            return !i.success || !i.stdout
              ? []
              : i.stdout.split("").flatMap((s) => {
                  let [a, ...l] = s.trim().split(/\r?\n/);
                  if (!a) return [];
                  let c = 0,
                    u = 0;
                  for (let p of l) {
                    if (p.length === 0) continue;
                    let [m, f, h] = p.split("	");
                    if (m == null || f == null || h == null || m === "-" || f === "-") {
                      ((c = null), (u = null));
                      break;
                    }
                    let v = Number(m),
                      y = Number(f);
                    if (!Number.isSafeInteger(v) || !Number.isSafeInteger(y)) {
                      ((c = null), (u = null));
                      break;
                    }
                    ((c += v), (u += y));
                  }
                  return [{ additions: c, deletions: u, sha: a }];
                });
          },
        },
        n,
      );
}
function iBt(t, e, r, n) {
  let o = t.watchScopedGitReadGeneration,
    i = ne(t.root, t.host, "branch-commits", e, n ? `live-${o}` : "short-lived");
  return Er(
    t.queryClient,
    {
      queryKey: i,
      gcTime: n ? _Be : be,
      meta: n ? Vy : Ue,
      queryFn: async (s) => {
        let a = await I(
          t.root,
          ["log", `--max-count=${xBe}`, "--format=%H%x00%cI%x00%s%x00%B%x1e", `${e}..HEAD`],
          t.host,
          { maxOutputBytes: ABe, signal: s },
        );
        if (!a.success) throw new oN();
        return a.stdout
          .split("")
          .map((l) => {
            let [c, u, p, m] = l.trim().split("\0");
            return !c || !u || p == null || m == null
              ? null
              : { committedAt: u, message: m, sha: c, subject: p };
          })
          .filter((l) => l != null);
      },
      staleTime: n ? _Be : be,
    },
    r,
  )
    .catch((s) => {
      if (s instanceof oN) return [];
      throw s;
    })
    .finally(() => {
      n &&
        o !== t.watchScopedGitReadGeneration &&
        t.queryClient.removeQueries({ queryKey: i, exact: !0 });
      let s = t.queryClient
        .getQueryCache()
        .findAll({
          queryKey: ne(t.root, t.host, "branch-commits"),
          type: "inactive",
          fetchStatus: "idle",
        })
        .sort((a, l) => l.state.dataUpdatedAt - a.state.dataUpdatedAt);
      for (let a of s.slice(oBt)) t.queryClient.removeQueries({ queryKey: a.queryKey, exact: !0 });
    });
}
var xBe,
  oBt,
  _Be,
  ABe,
  oN,
  EBe = g(() => {
    O();
    o5();
    je();
    fe();
    ((xBe = 100), (oBt = 3), (_Be = 6e4), (ABe = 2 * 1024 * 1024), (oN = class extends Error {}));
  });
function pv(t) {
  return t.startsWith("refs/heads/") ? t.slice(11) : t;
}
var iN = g(() => {
  O();
});
async function CBe(t, e, r, n) {
  let o = await t.getWorktreeRepository(e, r);
  if (!o) return { gitRoot: null, branch: null, baseBranch: null, baseBranchRemote: null };
  let [i, s] = await Promise.all([Cr(o), gn(o)]),
    a = i;
  if (!a) {
    let l = await av(o, n);
    a = l ? pv(l.branch) : null;
  }
  return {
    gitRoot: o.root,
    branch: a,
    baseBranch: s?.branch ?? null,
    baseBranchRemote: s?.remote ?? null,
  };
}
var TBe = g(() => {
  O();
  Gi();
  _c();
  ad();
  iN();
});
async function c5(t, e, r, n = "origin") {
  if (!sBt.test(e)) return null;
  let o = `${e}^{commit}`,
    i = await At(t, o, r);
  return (
    i ??
    (u5(n)
      ? Er(
          t.queryClient,
          {
            queryKey: ne(t.root, t.host, "fetch-review-commit", n, e),
            meta: Ue,
            staleTime: be,
            queryFn: async (s) =>
              (
                await I(
                  t.root,
                  [
                    "fetch",
                    "--no-tags",
                    "--no-write-fetch-head",
                    "--no-recurse-submodules",
                    "--no-auto-maintenance",
                    "--",
                    n,
                    e,
                  ],
                  t.host,
                  { signal: s },
                )
              ).success
                ? At(t, o, s, { fresh: !0 })
                : null,
          },
          r,
        )
      : null)
  );
}
function u5(t) {
  return t === "origin" || /^https:\/\/[a-z0-9.-]+\/(?:[a-z0-9_.-]+\/)+[a-z0-9_.-]+\.git$/i.test(t);
}
var sBt,
  PBe = g(() => {
    ps();
    je();
    fe();
    sBt = /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/iu;
  });
function sN(t) {
  let e = t.split("\0"),
    r = new Set();
  for (let n = 0; n + 2 < e.length; n += 3) {
    let o = e[n + 2];
    e[n + 1] === "linguist-generated" && (o === "set" || o === "true") && r.add(e[n]);
  }
  return r;
}
var d5 = g(() => {});
async function kBe(
  t,
  {
    base: e,
    head: r,
    baseRevision: n,
    headRevision: o,
    comparison: i,
    branchRemotes: s,
    revisionRemotes: a,
  },
  l,
) {
  if (t == null) return { type: "error", error: { type: "unknown" } };
  let c = i ?? { baseRevision: n, headRevision: o };
  if (s != null) {
    let y = `refs/heads/${e}`,
      w = `refs/heads/${r}`,
      _ = IBe(t, s.base, s.base === s.head ? [y, w] : [y], l),
      [S, E] = await Promise.all([_, s.base === s.head ? _ : IBe(t, s.head, [w], l)]);
    c = { baseRevision: S.get(y), headRevision: E.get(w) };
  }
  if (!c.baseRevision || !c.headRevision) return { type: "error", error: { type: "unknown" } };
  let [u, p] = await Promise.all([
    c5(t, c.baseRevision, l, s?.base ?? a?.base),
    c5(t, c.headRevision, l, s?.head ?? a?.head),
  ]);
  if (u == null || p == null) return { type: "error", error: { type: "unknown" } };
  let m = await ds(
    t.root,
    [
      "--raw",
      "-z",
      "--no-abbrev",
      "--patch",
      "--full-index",
      ...(i == null ? ["--merge-base"] : []),
      u,
      p,
      "--",
    ],
    t.host,
    { signal: l, trim: !1 },
  );
  if (!m.success || m.outputLimitExceeded) return { type: "error", error: qi(m) };
  let f = m.stdout.indexOf("\0\0"),
    h = [];
  if (f >= 0) {
    let y = m.stdout.slice(0, f).split("\0");
    for (let w = 0; w < y.length; ) {
      let [, , _, S, E] = y[w++].split(" "),
        T = y[w++],
        P = /^[RC]/.test(E) ? y[w++] : T;
      h.push({ path: P, before: _, after: S });
    }
  }
  let v =
    h.length === 0
      ? null
      : await I(
          t.root,
          ["check-attr", `--source=${p}`, "-z", "--stdin", "linguist-generated"],
          t.host,
          { signal: l, stdin: h.map(({ path: y }) => y + "\0").join(""), trim: !1 },
        );
  return {
    type: "success",
    generatedPaths: v?.success ? [...sN(v.stdout)] : [],
    unifiedDiff: f < 0 ? m.stdout : m.stdout.slice(f + 2),
    baseRevision: u,
    fileObjects: h,
  };
}
async function IBe(t, e, r, n) {
  let o = new Map();
  if (!u5(e) || r.some((a) => /[\s:*?[\\]/u.test(a))) return o;
  let i = new Map(r.map((a) => [`refs/codex/review/${a}`, a])),
    s = await I(
      t.root,
      [
        "fetch",
        "--porcelain",
        "--dry-run",
        "--no-write-fetch-head",
        "--no-tags",
        "--no-recurse-submodules",
        "--no-auto-maintenance",
        "--refmap=",
        "--",
        e,
        ...Array.from(i, ([a, l]) => `+${l}:${a}`),
      ],
      t.host,
      { signal: n },
    );
  if (s.success)
    for (let a of s.stdout.split(`
`)) {
      let [, , l, c] = a.split(" "),
        u = i.get(c);
      u != null && o.set(u, l);
    }
  return o;
}
var DBe = g(() => {
  PBe();
  jm();
  d5();
  fe();
  Vm();
});
function MBe(t) {
  return us(t);
}
var OBe = g(() => {
  Wm();
});
async function NBe(t, e, r, n = !1) {
  let [o, i] = await Promise.all([e.platformPath(), Kx(e, r, n)]),
    s = (
      await Promise.all(
        i.map(async (c) => {
          let u = await M3(e, c, n);
          return Promise.all(
            u
              .filter(
                (p) =>
                  p.isDirectory() &&
                  !p.isSymbolicLink() &&
                  (Uy(p.name) || D3(p.name) || t_.safeParse(p.name).success),
              )
              .map(async (p) => {
                let m = o.join(c.path, p.name);
                try {
                  let f = await e.stat(m, { bypassCache: !0, followSymlinks: !1 });
                  return !f.isDirectory() || f.isSymbolicLink()
                    ? null
                    : {
                        parentName: p.name,
                        parentPath: m,
                        worktreeEntries: await e.readDirectory(m),
                      };
                } catch (f) {
                  return vc(f, m, n);
                }
              }),
          );
        }),
      )
    ).flat(),
    a = [];
  for (let c of s) {
    if (!c) continue;
    let u = Uy(c.parentName),
      p =
        t_.safeParse(c.parentName).success &&
        c.worktreeEntries.some((m) => m.name === $y && m.isFile());
    for (let m of c.worktreeEntries) {
      if (!m.isDirectory() || m.isSymbolicLink() || (!u && !p && !MOe(m.name))) continue;
      let f = o.join(c.parentPath, m.name),
        h = f;
      h &&
        a.push(
          e
            .stat(h, { bypassCache: !0, followSymlinks: !1 })
            .catch((v) => vc(v, h, n))
            .then(async (v) => {
              if (v == null || !v.isDirectory() || v.isSymbolicLink()) return null;
              let y = await MBe(t.getWorktreeRepositoryForRoot(h, e));
              if (n && y == null) return (await aBt(e, h), null);
              if (!u && p) {
                let w = o.join(h, ".git"),
                  _ = await e.stat(w).catch((S) => vc(S, w, n));
                if (y == null || !_?.isFile()) return null;
              }
              return { dir: h, gitDir: y };
            }),
        );
    }
  }
  return (await Promise.all(a)).filter((c) => c != null);
}
async function aBt(t, e) {
  let r = await t.platformPath(),
    n = r.join(e, ".git");
  try {
    if (!(await t.stat(n, { bypassCache: !0 })).isFile()) return;
    let i = await new Response(await t.readFile(n)).text(),
      s = /^gitdir: (.+?)(?:\r?\n)?$/s.exec(i);
    if (s == null) return;
    if (((n = r.resolve(e, s[1])), (await t.stat(n, { bypassCache: !0 })).isDirectory()))
      throw new Error("Could not resolve the worktree's Git directory.");
  } catch (o) {
    vc(o, n, !0);
  }
}
var LBe = g(() => {
  O();
  zx();
  qy();
  OBe();
});
function aN(t, e, r) {
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "commit-count", e),
    gcTime: be,
    meta: Ue,
    queryFn: async () => {
      let n = await I(t.root, ["rev-list", "--count", ...e], t.host, {
        allowedNonZeroExitCodes: [128, 1],
        signal: r,
      });
      if (!n.success || !n.stdout) return null;
      let o = Number.parseInt(n.stdout, 10);
      return Number.isNaN(o) ? null : o;
    },
    staleTime: be,
  });
}
var BBe = g(() => {
  je();
  fe();
});
function FBe(...t) {
  let e = [],
    r = (n) => {
      let o = n.trim();
      o.length !== 0 && e.push(o);
    };
  for (let n of t) for (let o of n) r(o);
  return e;
}
var $Be = g(() => {});
async function lN(t, e, r) {
  if (!e.success) return { success: !1, error: { type: "unknown" } };
  let n = e.paths,
    o = Array.from({ length: n.length }, () => {}),
    i = 0,
    s = !1,
    a = null,
    l = 0,
    c = (f) => {
      s || ((s = !0), (a = f));
    },
    u = () => {
      if (s || i >= n.length) return null;
      let f = n[i],
        h = i;
      return ((i += 1), { index: h, path: f });
    },
    p = async () => {
      if (s) return;
      let f = u();
      if (f == null) return;
      let h = await t(f.path, r);
      if (h.type === "error") {
        c(h.error);
        return;
      }
      let v = l + (h.unifiedDiffBytes ?? h.unifiedDiff.length);
      if (v > 67108864) {
        c({ type: "diff-too-large", limitBytes: 67108864 });
        return;
      }
      ((l = v), (o[f.index] = h.unifiedDiff.trim().length > 0 ? h.unifiedDiff : null), await p());
    },
    m = Math.min(8, n.length);
  return (
    await Promise.all(Array.from({ length: m }, () => p())),
    a ? { success: !1, error: a } : { success: !0, sections: o.filter((f) => f != null) }
  );
}
var p5 = g(() => {
  Sc();
});
async function cN(t, e, r, n, o, i, s, a) {
  let l = await JO({
    host: n,
    baseBranch: i,
    commitSha: s,
    cwd: t,
    gitManager: r,
    includeUntrackedFiles: !0,
    maxUntrackedFiles: a,
    source: e,
  });
  if (l.type !== "success") return { source: e, diff: cBt() };
  let [c, u] = await Promise.all([
    lBt(l.diffArgs, l.reviewSnapshot),
    lN((m) => uv(l.reviewSnapshot, m), l.untrackedPaths, l.reviewSnapshot.signal),
  ]);
  if (c.outputLimitExceeded || !c.success)
    return { source: e, diff: { type: "error", error: qi(c) } };
  if (!u.success) return { source: e, diff: { type: "error", error: u.error } };
  let p = FBe([c.stdout], u.sections).join(`
`);
  return l.reviewSnapshot.read(async () => ({
    source: e,
    diff: { type: "success", unifiedDiff: p, unifiedDiffBytes: Buffer.byteLength(p, "utf8") },
  }));
}
function lBt(t, e) {
  return e.worktreeRepo.queryClient.fetchQuery({
    queryKey: e.queryKey("review-patch-diff", t),
    gcTime: be,
    meta: Ue,
    queryFn: () => e.gitDiff(t, { allowedNonZeroExitCodes: [0, 1], trim: !1 }),
    staleTime: be,
  });
}
function cBt() {
  return { type: "error", error: { type: "unknown" } };
}
var m5 = g(() => {
  $Be();
  p5();
  XO();
  jm();
  je();
  xA();
});
async function qBe(t, e, r, n, o) {
  if (!e) return (await cN(t, "staged", r, n, o)).diff;
  let i = await r.getWorktreeRepository(t, n);
  if (i == null) return { type: "error", error: { type: "unknown" } };
  let s;
  try {
    s = await to(i, o);
  } catch {
    return { type: "error", error: { type: "unknown" } };
  }
  return yO(i, s, o);
}
var GBe = g(() => {
  O();
  z3();
  m5();
  xc();
});
async function HBe(t, e, r) {
  let [n, o] = await Promise.all([
      I(t, ["rev-parse", "--is-shallow-repository"], e, { env: WBe, signal: r }),
      I(t, ["config", "--get-regexp", uBt], e, {
        allowedNonZeroExitCodes: [1],
        env: WBe,
        signal: r,
      }),
    ]),
    i = new Map();
  if (o.success)
    for (let s of o.stdout.split(`
`)) {
      let a = s.indexOf(" "),
        l = a === -1 ? s : s.slice(0, a),
        c = a === -1 ? "" : s.slice(a + 1);
      i.set(l, c);
    }
  return {
    isPartialClone: Array.from(i).some(
      ([s, a]) =>
        s === "extensions.partialclone" ||
        s.endsWith(".partialclonefilter") ||
        (s.endsWith(".promisor") && ["", "1", "on", "true", "yes"].includes(a.toLowerCase())),
    ),
    isShallow: n.success && n.stdout === "true",
  };
}
var WBe,
  uBt,
  jBe = g(() => {
    fe();
    ((WBe = { GIT_NO_LAZY_FETCH: "1" }),
      (uBt = "^(extensions\\.partialclone|remote\\..*\\.(promisor|partialclonefilter))$"));
  });
async function uN(t, e, r = Ve) {
  let n = ne(t.root, t.host, "effective-origin-url"),
    o = await Er(
      t.queryClient,
      {
        queryKey: n,
        meta: pi,
        queryFn: async (i) => ({ generation: t.gitConfigReadGeneration, result: await f5(t, i) }),
        staleTime: r,
      },
      e,
    );
  return o.generation !== t.gitConfigReadGeneration
    ? (t.queryClient.invalidateQueries({ queryKey: n, exact: !0, refetchType: "none" }),
      uN(t, e, r))
    : o.result;
}
async function f5(t, e) {
  let r = await I(t.root, ["remote", "get-url", "origin"], t.host, {
    signal: AbortSignal.any([AbortSignal.timeout(zBe), ...(e == null ? [] : [e])]),
    trim: !1,
    maxOutputBytes: 65536,
  });
  if (!r.success && r.code == null && r.outputLimitExceeded == null)
    throw new Error("Failed to read effective Git origin");
  return r;
}
async function dN(t, { isRepoWatched: e = !1, signal: r } = {}) {
  let n = performance.now(),
    o = await (
      e ? uN(t, r).catch((p) => (p instanceof Gm && !r?.aborted ? f5(t, r) : null)) : f5(t, r)
    ).catch(() => null);
  o?.outputLimitExceeded != null &&
    (o = await I(t.root, ["remote", "get-url", "origin"], t.host, {
      signal: r,
      timeoutMs: Math.max(1, Math.ceil(zBe - (performance.now() - n))),
    }).catch(() => null));
  let i = (o?.success && o.stdout.trim()) || null,
    s = i == null ? null : yu(i.replace(/\/+$/, "")),
    a = s?.host.toLowerCase(),
    l = s != null && i?.includes("://") ? new URL(i) : null,
    c =
      (l?.port === "22" &&
        (l.protocol === "ssh:" || l.protocol === "git+ssh:" || l.protocol === "ssh+git:")) ||
      (l?.protocol === "git:" && l.port === "9418")
        ? ""
        : l?.port,
    u = null;
  if (s != null) {
    let p = a === "github.com" ? `${s.owner}/${s.repo}`.toLowerCase() : `${s.owner}/${s.repo}`;
    u = a === "github.com" && !c ? p : `${a}${c ? `:${c}` : ""}/${p}`;
  }
  return { repositoryFullName: u, worktreeId: await eo(t.root) };
}
var zBe,
  pN = g(() => {
    G3();
    O();
    je();
    fe();
    rd();
    zBe = 5e3;
  });
async function QBe({
  cwd: t,
  host: e,
  gitManager: r,
  signal: n,
  timeoutMs: o = dBt,
  getReadPolicy: i,
}) {
  let s = r ?? new Ym(new ag()),
    a = {
      status: "failed",
      capturedAt: new Date().toISOString(),
      worktreeId: null,
      headCommitSha: null,
      branch: null,
      detached: null,
      upstream: null,
      remotes: null,
      remotesOmitted: 0,
    },
    l = AbortSignal.any([AbortSignal.timeout(o), ...(n == null ? [] : [n])]),
    c = { signal: l, maxOutputBytes: pBt, trim: !1 };
  try {
    l.throwIfAborted();
    let u;
    if (i == null) {
      let S = await I(t, ["rev-parse", "--show-toplevel"], e, c);
      if (!S.success)
        return (
          (a.failureReason = Wi(c, S)),
          S.code === 128 &&
            S.stderr.includes("not a git repository") &&
            ((a.status = "not_git"), delete a.failureReason),
          a
        );
      u = s.getWorktreeRepositoryForRoot(S.stdout.replace(/\r?\n$/, ""), e);
    } else u = await Lt(s.getWorktreeRepository(t, e), l);
    if (u == null) return ((a.status = "not_git"), a);
    let { root: p } = u,
      m = i == null ? "share_in_flight" : await Lt(Promise.resolve(i(p)), l);
    if (m === "skip_unobserved") return a;
    let f = m === "share_in_flight" ? 0 : Ve;
    ((a.worktreeId = await eo(p)), (a.status = "partial"));
    let [h, v, y] = await Promise.all([
        VBe(m === "after_head_lock" ? md(u, l) : cl(u, l, f), c),
        VBe(
          m === "after_head_lock"
            ? hBt(u, c)
            : wc(u, { signal: l, staleTime: f, preserveWhitespace: !0 }),
          c,
        ),
        KBe(
          I(
            p,
            [
              "config",
              "--null",
              "--get-regexp",
              "^(remote\\..*\\.url|branch\\..*\\.(remote|merge))$",
            ],
            e,
            { ...c, allowedNonZeroExitCodes: [1], collectStdoutBuffer: !0 },
          ),
          c,
        ),
      ]),
      w = h.result;
    w != null
      ? (a.headCommitSha = w)
      : typeof w < "u"
        ? (a.headUnavailableReason = "unresolved")
        : (a.headUnavailableReason = h.failureReason);
    let _ = v.result;
    if (_ != null)
      if (_.type === "branch") {
        let S = _.branch;
        if (m !== "after_head_lock" && (S.startsWith("heads/") || S.startsWith("refs/heads/"))) {
          let E = await KBe(
            I(p, ["symbolic-ref", "--quiet", "HEAD"], e, {
              ...c,
              allowedNonZeroExitCodes: [1],
              collectStdoutBuffer: !0,
            }),
            c,
          );
          E.result?.success
            ? (S = eFe(g5(E.result)))
            : ((a.branchUnavailableReason = E.failureReason), (S = void 0));
        }
        S != null && S.length <= JBe && !S.includes("\0")
          ? ((a.branch = S), (a.detached = !1))
          : a.branchUnavailableReason == null && (a.branchUnavailableReason = "invalid_value");
      } else
        _.type === "detached" && a.headCommitSha != null
          ? (a.detached = !0)
          : (a.branchUnavailableReason =
              _.type === "unknown" ? (_.reason ?? "command_failed") : "unresolved");
    else a.branchUnavailableReason = v.failureReason;
    if (y.result?.success) {
      let S = gBt(y.result, a);
      await Promise.all([yBt(u, c, S, a, e.isLocal ? f : 0), vBt(p, e, c, S, a)]);
    } else
      ((a.remotesUnavailableReason = y.failureReason),
        (a.upstreamUnavailableReason = a.remotesUnavailableReason));
    return (
      l.aborted && (a.failureReason = Wi(c)),
      a.failureReason == null &&
        a.headUnavailableReason == null &&
        a.branchUnavailableReason == null &&
        a.upstreamUnavailableReason == null &&
        a.remotesUnavailableReason == null &&
        a.remotesOmitted === 0 &&
        a.remotes?.every((S) => S.unavailableReason == null) &&
        (a.status = "complete"),
      a
    );
  } catch {
    return ((a.failureReason = Wi(c)), a);
  } finally {
    r == null && s.invalidateStableMetadata();
  }
}
async function hBt({ root: t, host: e }, r) {
  let n = await I(t, ["symbolic-ref", "--quiet", "HEAD"], e, {
    ...r,
    allowedNonZeroExitCodes: [1],
    collectStdoutBuffer: !0,
  });
  if (n.code === 1) return { type: "detached" };
  if (!n.success) return { type: "unknown" };
  let o = g5(n);
  if (o == null) return { type: "unknown", reason: "invalid_value" };
  let i = eFe(o);
  return i ? { type: "branch", branch: i } : { type: "unknown" };
}
function g5(t) {
  return t.stdoutBuffer != null && t.stdout.includes("\uFFFD") ? rA(t.stdoutBuffer) : t.stdout;
}
function eFe(t) {
  return t == null ? void 0 : /^refs\/heads\/([^\r\n]+)$/.exec(t.replace(/\r?\n$/, ""))?.[1];
}
function gBt(t, e) {
  let r = t.stdout.includes("\uFFFD") ? t.stdoutBuffer : void 0,
    n = 0;
  return t.stdout.split("\0").flatMap((o) => {
    let i = o.indexOf(`
`);
    if (r != null) {
      let s = n,
        a = r.indexOf(0, s);
      if (((n = a + 1), i >= 0 && o.includes("\uFFFD"))) {
        let l = r.indexOf(10, s),
          c = rA(r.subarray(s, l));
        return c == null
          ? (o.startsWith("remote.") && (e.remotesUnavailableReason = "invalid_value"), [])
          : [{ key: c, value: rA(r.subarray(l + 1, a)) }];
      }
    }
    return i < 0 ? [] : [{ key: o.slice(0, i), value: o.slice(i + 1) }];
  });
}
async function VBe(t, e) {
  try {
    return { result: await (e.signal == null ? t : Lt(t, e.signal)), failureReason: Wi(e) };
  } catch {
    return { result: void 0, failureReason: Wi(e) };
  }
}
async function KBe(t, e) {
  try {
    let r = await t;
    return { result: r, failureReason: Wi(e, r) };
  } catch {
    return { result: void 0, failureReason: Wi(e) };
  }
}
async function yBt(t, e, r, n, o) {
  let { root: i, host: s } = t,
    a = new Set();
  for (let { key: c } of r) {
    let u = /^remote\.([\s\S]+)\.url$/.exec(c)?.[1];
    u != null && a.add(u);
  }
  let l = [...a]
    .sort((c, u) => +(u === "origin") - +(c === "origin"))
    .filter((c) => c.length <= YBe && !h5.test(c))
    .slice(0, mBt);
  ((n.remotesOmitted = a.size - l.length), (n.remotes = []));
  for (let c = 0; c < l.length; ) {
    let u = c === 0 ? 1 : 4,
      p = await Promise.all(
        l.slice(c, c + u).map(async (m) => {
          if (e.signal?.aborted) return { name: m, fetchUrl: null, unavailableReason: Wi(e) };
          try {
            let f =
                m === "origin" ? uN(t, e.signal, o) : I(i, ["remote", "get-url", "--", m], s, e),
              h = await (e.signal == null ? f : Lt(f, e.signal));
            if (!h.success) return { name: m, fetchUrl: null, unavailableReason: Wi(e, h) };
            let v = bBt(h.stdout.replace(/\r?\n$/, ""));
            return v != null && v.length > fBt
              ? { name: m, fetchUrl: null, unavailableReason: "size_limit" }
              : v == null
                ? { name: m, fetchUrl: null, unavailableReason: "unsafe_url" }
                : { name: m, fetchUrl: v };
          } catch {
            return { name: m, fetchUrl: null, unavailableReason: Wi(e) };
          }
        }),
      );
    (n.remotes.push(...p), (c += u));
  }
}
async function vBt(t, e, r, n, o) {
  if (o.branch == null) {
    o.detached !== !0 && (o.upstreamUnavailableReason = o.branchUnavailableReason ?? Wi(r));
    return;
  }
  let i = (0, XBe.default)(n, ({ key: c }) => c === `branch.${o.branch}.remote`)?.value,
    s = n.find(({ key: c }) => c === `branch.${o.branch}.merge`)?.value;
  if (i === void 0 && s === void 0) return;
  let a =
      i != null &&
      i.length <= YBe &&
      (i === "." || n.some(({ key: c }) => c === `remote.${i}.url`)) &&
      !h5.test(i)
        ? i
        : null,
    l = s != null && ZBe(s) ? s : null;
  if (
    ((o.upstream = { remoteName: a, mergeRef: l, trackingRef: null }),
    ((i !== void 0 && a == null) || (s !== void 0 && l == null)) &&
      (o.upstreamUnavailableReason = "invalid_value"),
    o.headCommitSha == null)
  ) {
    o.upstreamUnavailableReason == null &&
      (o.upstreamUnavailableReason = o.headUnavailableReason ?? "command_failed");
    return;
  }
  try {
    let c = await I(
      t,
      ["for-each-ref", "--format=%(refname)%00%(upstream)%00", "--", `refs/heads/${o.branch}`],
      e,
      { ...r, collectStdoutBuffer: !0 },
    );
    if (!c.success) {
      o.upstreamUnavailableReason = Wi(r, c);
      return;
    }
    let [u, p] =
      g5(c)
        ?.replace(/\r?\n$/, "")
        .split("\0") ?? [];
    u === `refs/heads/${o.branch}` && p != null && (p === "" || ZBe(p))
      ? (o.upstream.trackingRef = p || null)
      : (o.upstreamUnavailableReason = "invalid_value");
  } catch {
    o.upstreamUnavailableReason = Wi(r);
  }
}
function ZBe(t) {
  return t.startsWith("refs/") && t.length <= JBe && !h5.test(t);
}
function Wi(t, e) {
  return e?.outputLimitExceeded != null
    ? "size_limit"
    : t.signal?.aborted
      ? t.signal.reason instanceof Error && t.signal.reason.name === "TimeoutError"
        ? "timeout"
        : "cancelled"
      : "command_failed";
}
function bBt(t) {
  if (/[\s\\]/.test(t) || /^[a-z]:/i.test(t) || /^[\w+.-]+::/.test(t)) return null;
  let e = t;
  if (!t.includes("://")) {
    let r = /^(?:[^@/:]+@)?(\[[^\]]+\]|[^/:]+):(.+)$/.exec(t);
    if (r == null) return null;
    e = `ssh://${r[1]}/${r[2]}`;
  }
  try {
    let r = new URL(e);
    return !["http:", "https:", "ssh:", "git:", "git+ssh:", "ssh+git:"].includes(r.protocol) ||
      r.hostname === ""
      ? null
      : ((r.username = ""), (r.password = ""), (r.search = ""), (r.hash = ""), r.toString());
  } catch {
    return null;
  }
}
var XBe,
  dBt,
  pBt,
  mBt,
  fBt,
  YBe,
  JBe,
  h5,
  tFe = g(() => {
    XBe = F(xW());
    O();
    Gi();
    fd();
    pN();
    OK();
    je();
    fe();
    rd();
    ((dBt = 900),
      (pBt = 64 * 1024),
      (mBt = 32),
      (fBt = 512),
      (YBe = 128),
      (JBe = 256),
      (h5 = /[\x00-\x20\x7f]/));
  });
async function rFe(t, e) {
  let r = await us(t, e);
  if (!r) return { lastModified: 0 };
  let n = (await t.host.platformPath()).join(r, "index");
  try {
    return { lastModified: (await t.host.stat(n)).mtimeMs };
  } catch (o) {
    return o.code === "ENOENT"
      ? { lastModified: 0 }
      : (SBt().error("Failed to read index info", {
          safe: { indexPath: n },
          sensitive: { error: o },
        }),
        { lastModified: 0 });
  }
}
var SBt,
  nFe = g(() => {
    hr();
    Wm();
    SBt = Ie("git");
  });
async function oFe(t, e, r, n) {
  let o = wBt(e, r),
    i = await Promise.all(
      o.map(async (l) => {
        let c = await _Bt(t, l, n);
        return c == null ? null : { branch: l, distance: c };
      }),
    ),
    s = null,
    a = null;
  for (let l of i) l != null && (a == null || l.distance < a) && ((s = l.branch), (a = l.distance));
  return s;
}
function wBt(t, e) {
  let r = [],
    n = new Set();
  for (let o of t) {
    let i = o.trim();
    i.length === 0 || i === e || n.has(i) || (n.add(i), r.push(i));
  }
  return r;
}
async function _Bt(t, e, r) {
  let n = await Xy(t, e, "HEAD", r);
  return n?.state !== "right-ahead" || n.rightAhead <= 0 ? null : n.rightAhead;
}
var iFe = g(() => {
  vO();
});
async function fN(t, e, r, { live: n = !1 } = {}) {
  let o = Math.max(1, Math.min(e, sFe)),
    i = t.watchScopedGitReadGeneration,
    s = ne(
      t.root,
      t.host,
      "recent-branches",
      n ? "live" : "short-lived",
      ...(n ? [String(i)] : []),
    );
  try {
    return (
      await Er(
        t.queryClient,
        {
          queryKey: s,
          gcTime: n ? void 0 : be,
          meta: n ? Vy : fO,
          queryFn: async (l) => {
            let { success: c, stdout: u } = await I(
              t.root,
              [
                "for-each-ref",
                `--count=${sFe}`,
                "--sort=-committerdate",
                "refs/heads",
                "--format=%(refname:short)",
              ],
              t.host,
              { signal: l },
            );
            if (!c) throw new mN();
            return u
              .split(
                `
`,
              )
              .map((p) => p.trim())
              .filter((p) => p.length > 0);
          },
          staleTime: n ? Ve : be,
        },
        r,
      )
    ).slice(0, o);
  } catch (a) {
    if (a instanceof mN || r?.aborted) return [];
    throw a;
  } finally {
    n &&
      i !== t.watchScopedGitReadGeneration &&
      t.queryClient.removeQueries({ queryKey: s, exact: !0 });
  }
}
var sFe,
  mN,
  aFe = g(() => {
    je();
    fe();
    ((sFe = 100), (mN = class extends Error {}));
  });
async function uFe(
  t,
  e,
  r,
  n,
  o,
  {
    baseBranch: i,
    commitSha: s,
    includeUntrackedFiles: a = !0,
    maxUntrackedFiles: l,
    paths: c,
    signal: u,
  } = {},
) {
  let p = r.trim();
  if (p.length === 0 || c?.length === 0)
    return { type: "success", source: e, query: p, matches: [], totalMatches: 0, isCapped: !1 };
  let m = await JO({
    host: o,
    baseBranch: i,
    commitSha: s,
    cwd: t,
    gitManager: n,
    includeUntrackedFiles: a,
    maxUntrackedFiles: l,
    source: e,
  });
  if (m.type !== "success") return { type: "error", source: e, query: p };
  let f;
  if (e === "branch" || e === "uncommitted" || e === "unstaged") {
    let y = await ld(m.reviewSnapshot.worktreeRepo, !1, m.reviewSnapshot, u);
    f = (
      y.type === "success"
        ? await RA({
            diffArgs: m.diffArgs,
            reviewSnapshot: m.reviewSnapshot,
            source: e,
            statusPaths: y.trackedPaths,
          })
        : null
    )?.paths;
  }
  let h = await RBt({
    diffArgs: m.diffArgs,
    reviewSnapshot: m.reviewSnapshot,
    trackedPaths: f,
    untrackedPaths: m.untrackedPaths,
  });
  if (h == null) return { type: "error", source: e, query: p };
  let v = await ABt({
    diffArgs: m.diffArgs,
    generatedPaths: h,
    paths: c,
    query: p,
    reviewSnapshot: m.reviewSnapshot,
    signal: u,
    untrackedPaths: m.untrackedPaths,
  });
  return v == null
    ? { type: "error", source: e, query: p }
    : m.reviewSnapshot.read(async () => ({
        type: "success",
        source: e,
        query: p,
        matches: v.matches.slice(0, cFe),
        totalMatches: v.totalMatches,
        isCapped: v.isCapped,
      }));
}
