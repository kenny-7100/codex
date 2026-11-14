async function oA(t, e, r) {
  let n = await I(
      t.root,
      [
        "status",
        "--no-renames",
        "--ignored=matching",
        "--untracked-files=all",
        "--porcelain=v1",
        "-z",
        "--",
        ...e,
      ],
      t.host,
      { collectStdoutBuffer: !0, env: r, trim: !1 },
    ),
    o = Ns(n.stdoutBuffer);
  if (!n.success || o == null)
    return { success: !1, trackedPaths: [], untrackedPaths: [], ignoredPaths: [], gitRoot: t.root };
  let i = [],
    s = [],
    a = [];
  return (
    o.split("\0").forEach((l) => {
      if (!(l.length < 4)) {
        if (l.startsWith("?? ")) {
          s.push(l.slice(3));
          return;
        }
        if (l.startsWith("!! ")) {
          a.push(l.slice(3));
          return;
        }
        i.push(l.slice(3));
      }
    }),
    { success: !0, trackedPaths: i, untrackedPaths: s, ignoredPaths: a, gitRoot: t.root }
  );
}
var HNe,
  jNe,
  xO = g(() => {
    ((HNe = F(Bu())), (jNe = F(WNe())));
    O();
    je();
    fe();
  });
function tv(t) {
  return t.split(/[/\\]+/).join("/");
}
var AO = g(() => {});
function ro(t, e, r, n) {
  let o = yNt(t, sK(t, r), sK(t, n)),
    i = vNt(t, sK(t, e), o);
  return i == null ? n : t.sep === "\\" ? tv(i) : i;
}
function sK(t, e) {
  if (t.sep !== "\\") return e;
  let r = e.match(/^\\\\\?\\UNC\\(.*)$/i);
  if (r != null) return `\\\\${r[1]}`;
  let n = e.match(/^\\\\\?\\([a-zA-Z]:[\\/].*)$/);
  return n != null ? n[1] : (e.match(/^\/([a-zA-Z]:[\\/].*)$/)?.[1] ?? e);
}
function yNt(t, e, r) {
  return t.isAbsolute(r) ? r : t.resolve(e, r);
}
function vNt(t, e, r) {
  let n = t.relative(e, r);
  return n === "" || n === ".." || n.startsWith(`..${t.sep}`) || t.isAbsolute(n) ? null : n;
}
var od = g(() => {
  AO();
});
function qn(t, e, r, n) {
  return e != null && e.length > 0
    ? JNe(r, () => oK(t.root, t.host, e, r?.signal ?? n))
    : JNe(r, () => tLe(t, r != null, n));
}
function Rn(t) {
  (RO.set(t, (RO.get(t) ?? 0) + 1), lK.delete(t), iA.delete(t), rv.delete(t), uK(t));
}
function cK(t, e) {
  return ne(t.root, t.host, "git-status-summary", `${e}`, "tracked-only");
}
function QNe(t, e, r, n) {
  let o = t.queryClient.getQueryCache().find({ queryKey: EO(t), exact: !0 });
  if (o == null || (o.state.isInvalidated && o.state.fetchStatus !== "fetching")) return null;
  let i;
  if (o.state.fetchStatus === "fetching") {
    if (!r) return null;
    i = o.promise;
  } else o.state.data != null && (i = Promise.resolve(o.state.data));
  return (
    i?.then(async (s) => {
      if (s.gitReadGeneration === e) return s.statusOutput ?? null;
      if (!r || t.gitReadGeneration !== e) return null;
      await tLe(t, !1, n);
      let a = t.queryClient.getQueryData(o.queryKey);
      return a?.gitReadGeneration === e ? (a.statusOutput ?? null) : null;
    }) ?? null
  );
}
async function eLe(t, e, r) {
  let n = ne(t.root, t.host, "all-untracked-paths"),
    o = t.queryClient.getQueryData(n);
  if (e.length === 0 || e.length > _Nt) return (Rn(t), { type: "unfiltered" });
  let i = await t.host.platformPath(),
    s = new Map(),
    a = !1;
  for (let _ of e) {
    let S = ro(i, t.root, t.root, _);
    if (S === ".gitignore") return (Rn(t), { type: "full" });
    S.endsWith("/.gitignore") && (iA.delete(t), (a = !0));
    let E = S.endsWith("/.gitignore") ? S.slice(0, -11) : S;
    s.set(E, E === S ? _ : i.join(t.root, ...E.split("/")));
  }
  let l = iA.get(t);
  l == null && ((l = new Set()), iA.set(t, l));
  let c = [...l],
    u = [...s.keys()].filter(
      (_) => !c.some((S) => _ === S || (S.endsWith("/") && `${_}/`.startsWith(S))),
    );
  if (u.length === 0) return { type: "filtered", changedPaths: [] };
  a && t.queryClient.removeQueries({ queryKey: ne(t.root, t.host, "path-status", u), exact: !0 });
  let p = rv.get(t);
  p == null && ((p = new Set()), rv.set(t, p));
  let m = u.every((_) => p.has(_)) ? await CNt(t, i, u) : new Set();
  if (rv.get(t) !== p) return { type: "unfiltered" };
  let f =
    m.size === u.length
      ? { success: !0, trackedPaths: [], untrackedPaths: [], ignoredPaths: [], gitRoot: t.root }
      : await ZNe(t, u).catch(() => null);
  if (f?.success !== !0) return (Rn(t), { type: "unfiltered" });
  if (rv.get(t) !== p) return { type: "unfiltered" };
  r?.(f.ignoredPaths.filter((_) => _.endsWith("/")));
  let h = [
      ...(o?.result.success === !0 ? o.result.paths : []),
      ...m,
      ...f.trackedPaths,
      ...f.untrackedPaths,
    ],
    v = u.filter((_) => !XNe(h, _) && !RNt(f.ignoredPaths, _)),
    y =
      v.length === 0
        ? { success: !0, paths: [], gitRoot: t.root }
        : await KNe(t, v).catch(() => null);
  if (y?.success !== !0) return (Rn(t), { type: "unfiltered" });
  if (rv.get(t) !== p) return { type: "unfiltered" };
  (aK(p, f.trackedPaths),
    aK(p, y.paths),
    aK(p, m),
    ENt(t, l, f.ignoredPaths),
    t.queryClient.setQueryData(n, (_) => {
      if (o?.result.success !== !0 || _?.generation !== o.generation || !_.result.success) return _;
      let S = _.result.paths
        .filter((E) => !u.some((T) => E === T || E.startsWith(`${T}/`)))
        .concat(f.untrackedPaths);
      return { generation: _.generation, result: { ..._.result, paths: [...new Set(S)].sort() } };
    }));
  let w = [
    ...(o?.result.success === !0 ? o.result.paths : []),
    ...m,
    ...f.trackedPaths,
    ...f.untrackedPaths,
    ...y.paths,
  ];
  return { type: "filtered", changedPaths: [...s].flatMap(([_, S]) => (XNe(w, _) ? [S] : [])) };
}
function XNe(t, e) {
  for (let r of t) if (r === e || r.startsWith(`${e}/`)) return !0;
  return !1;
}
function RNt(t, e) {
  for (let r of t) if (r === e || (r.endsWith("/") && `${e}/`.startsWith(r))) return !0;
  return !1;
}
function ENt(t, e, r) {
  if (iA.get(t) === e) {
    for (let n of r) (e.delete(n), e.add(n));
    for (; e.size > xNt; ) {
      let n = e.values().next().value;
      if (n == null) break;
      e.delete(n);
    }
  }
}
async function CNt(t, e, r) {
  let n = await Promise.all(
    r.map(async (o) => {
      try {
        return await t.host.stat(e.join(t.root, ...o.split("/")), {
          bypassCache: !0,
          followSymlinks: !1,
        });
      } catch {
        return null;
      }
    }),
  );
  return new Set(r.filter((o, i) => n[i]?.isDirectory() === !1));
}
function aK(t, e) {
  for (let r of e)
    if ((t.delete(r), t.add(r), t.size > ANt)) {
      let n = t.values().next().value;
      n != null && t.delete(n);
    }
}
function uK(t) {
  t.queryClient.invalidateQueries({ queryKey: EO(t), refetchType: "none" });
}
async function tLe(t, e, r) {
  let n = RO.get(t) ?? 0,
    o = await YNe(t, e, r);
  return o.generation >= n ? o.result : (uK(t), (await YNe(t, e, r)).result);
}
async function YNe(t, e, r) {
  let n = RO.get(t) ?? 0,
    o = t.gitReadGeneration,
    i = lK.has(t);
  if (e) {
    let u = TNt(t, n);
    if (u != null) return (w3("hit"), u);
  }
  let s = Date.now(),
    a = EO(t);
  w3(t.queryClient.getQueryState(a)?.fetchStatus === "fetching" ? "coalesced" : "miss");
  let l = async (u) => {
      let p;
      try {
        p = await to(t, u);
      } catch {
        return { generation: n, result: { success: !1, paths: [], gitRoot: t.root } };
      }
      let m,
        f = t.queryClient.getQueryState(cK(t, o)),
        h =
          f?.data?.type === "success" &&
          f.fetchStatus === "idle" &&
          !f.isInvalidated &&
          t.gitReadGeneration === o
            ? await zNe(t.root, t.host, u)
            : await _O(t.root, t.host, {
                configOverrides: p,
                onStatus: (v) => {
                  m = v;
                },
                signal: u,
              });
      return (
        Date.now() - s >= wNt && lK.add(t),
        { generation: n, gitReadGeneration: o, result: h, statusOutput: m }
      );
    },
    c = await Er(t.queryClient, { queryKey: a, queryFn: l, staleTime: i ? SNt : bNt }, r);
  return (c.result.success || uK(t), c);
}
function TNt(t, e) {
  let r = t.queryClient.getQueryCache().find({ queryKey: EO(t), exact: !0 }),
    n = r?.state.data;
  return r?.state.status === "success" &&
    r.state.fetchStatus === "idle" &&
    !r.state.isInvalidated &&
    n?.generation === e &&
    n.result.success
    ? n
    : null;
}
function EO(t) {
  return ne(t.root, t.host, "all-untracked-paths");
}
function JNe(t, e) {
  return t == null ? e() : t.read(e);
}
var bNt,
  SNt,
  wNt,
  _Nt,
  xNt,
  ANt,
  lK,
  RO,
  iA,
  rv,
  Ks = g(() => {
    xc();
    xO();
    Qu();
    je();
    od();
    ((bNt = 1e4),
      (SNt = 2e4),
      (wNt = 7e3),
      (_Nt = 64),
      (xNt = 1024),
      (ANt = 1024),
      (lK = new WeakSet()),
      (RO = new WeakMap()),
      (iA = new WeakMap()),
      (rv = new WeakMap()));
  });
function Zs(t, e) {
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "worktrees"),
    gcTime: be,
    meta: Ue,
    queryFn: async () => {
      let r = await I(t.root, ["worktree", "list", "--porcelain"], t.host, { signal: e });
      if (!r.success)
        throw new Error(r.stderr || r.stdout || "Failed to list worktrees for repository");
      return PNt(r.stdout ?? "");
    },
    staleTime: be,
  });
}
function PNt(t) {
  let e = [],
    r = null,
    n = t.split(/\r?\n/);
  for (let o of n) {
    let i = o.trim();
    if (i.length === 0) {
      r && (e.push(r), (r = null));
      continue;
    }
    if (i.startsWith("worktree ")) {
      r && e.push(r);
      let s = i.slice(9).trim();
      if (!s) {
        r = null;
        continue;
      }
      r = { root: s, prunable: !1, locked: !1, headRef: { sha: "", type: "detached" } };
      continue;
    }
    if (r) {
      if (i.startsWith("HEAD ")) {
        let s = i.slice(5).trim();
        r.headRef = { sha: s, type: "detached" };
        continue;
      }
      if (i.startsWith("branch ")) {
        let s = i.slice(7).trim();
        s.startsWith("refs/heads/")
          ? (r.headRef = { sha: r.headRef.sha, type: "branch", string: s.slice(11) })
          : (r.headRef = { sha: r.headRef.sha, type: "branch", string: s });
        continue;
      }
      if (i === "detached") {
        r.headRef = { sha: r.headRef.sha, type: "detached" };
        continue;
      }
      if (i.startsWith("prunable")) {
        r.prunable = !0;
        continue;
      }
      i.startsWith("locked") && (r.locked = !0);
    }
  }
  return (r && e.push(r), e);
}
var Km = g(() => {
  O();
  je();
  fe();
});
function INt(t, e) {
  let r = new Set(),
    n = new Set(),
    o = new Set(),
    i = null,
    s = [t, e].filter(Boolean).join(`
`),
    a = (Q, X) => {
      let G = (X ?? "").trim();
      if (!G) return;
      let ce = G.charAt(0),
        Ce = G.charAt(G.length - 1),
        De = G;
      ((ce === "'" || ce === '"') && Ce === ce && G.length >= 2 && (De = G.slice(1, -1)),
        De && Q.add(De));
    },
    l = (Q, X) => {
      for (let G of X) if (Q[G]) return Q[G];
    },
    c = /^(?:Applied patch(?: to)?\s+(?:(["'])(?<qpath>.+?)\1|(?<path>.+?))\s+cleanly\.?)$/i,
    u = /^(?:Applied patch(?: to)?\s+(?:(["'])(?<qpath>.+?)\1|(?<path>.+?))\s+with conflicts\.?)$/i,
    p =
      /^(?:Applying patch\s+(?:(["'])(?<qpath>.+?)\1|(?<path>.+?))\s+with\s+\d+\s+rejects?\.{0,3})$/i,
    m = /^(?:Checking patch\s+(?:(["'])(?<qpath>.+?)\1|(?<path>.+?))\.\.\.)$/i,
    f = /^(?:Performing three-way merge|Falling back to three-way merge)\.\.\.$/i,
    h = /^Failed to perform three-way merge\.\.\.$/i,
    v = /^Falling back to direct application\.\.\.$/i,
    y = /^U\s+(?<path>.+)$/,
    w = /^error:\s+patch failed:\s+(?<path>.+?)(?::\d+)?(?:\s|$)/i,
    _ = /^error:\s+(?<path>.+?):\s+patch does not apply$/i,
    S =
      /^(?:error: )?repository lacks the necessary blob to (?:perform|fall back on) 3-?way merge\.?$/i,
    E = /^error:\s+(?<path>.+?):\s+does not match index\b/i,
    T = /^error:\s+(?<path>.+?):\s+does not exist in index\b/i,
    P = /^error:\s+(?<path>.+?)\s+already exists in (?:the )?working directory\b/i,
    M = /^error:\s+patch failed:\s+(?<path>.+?)\s+File exists/i,
    L = /^error:\s+path\s+(?<path>.+?)\s+has been renamed\/deleted/i,
    V =
      /^error:\s+cannot apply binary patch to\s+['"]?(?<path>.+?)['"]?\s+without full index line$/i,
    de = /^error:\s+binary patch does not apply to\s+['"]?(?<path>.+?)['"]?$/i,
    ue = /^error:\s+binary patch to\s+['"]?(?<path>.+?)['"]?\s+creates incorrect result\b/i,
    Ae = /^error:\s+cannot read the current contents of\s+['"]?(?<path>.+?)['"]?$/i,
    ge = /^Skipped patch\s+['"]?(?<path>.+?)['"]\.$/i,
    Pe = /^warning:\s*Cannot merge binary files:\s+(?<path>.+?)\s+\(ours\s+vs\.\s+theirs\)/i;
  for (let Q of s.split(/\r?\n/)) {
    let X = Q.trim();
    if (!X) continue;
    let G;
    if ((G = X.match(c))) {
      let ce = l(G.groups ?? {}, ["qpath", "path"]);
      (a(r, ce), (i = ce ?? i), o.delete(ce ?? ""), n.delete(ce ?? ""));
      continue;
    }
    if ((G = X.match(u))) {
      let ce = l(G.groups ?? {}, ["qpath", "path"]);
      (a(o, ce), (i = ce ?? i), r.delete(ce ?? ""), n.delete(ce ?? ""));
      continue;
    }
    if ((G = X.match(p))) {
      let ce = l(G.groups ?? {}, ["qpath", "path"]);
      (a(o, ce), (i = ce ?? i), r.delete(ce ?? ""), n.delete(ce ?? ""));
      continue;
    }
    if ((G = X.match(y))) {
      (a(o, G.groups?.path),
        (i = G.groups?.path ?? i),
        r.delete(G.groups?.path ?? ""),
        n.delete(G.groups?.path ?? ""));
      continue;
    }
    if ((G = X.match(m))) {
      i = l(G.groups ?? {}, ["qpath", "path"]) ?? i;
      continue;
    }
    if ((G = X.match(w)) || (G = X.match(_))) {
      (a(n, G.groups?.path), (i = G.groups?.path ?? i));
      continue;
    }
    if (!(f.test(X) || v.test(X))) {
      if (h.test(X)) {
        i && (a(n, i), r.delete(i), o.delete(i));
        continue;
      }
      if (S.test(X)) {
        i && (a(n, i), r.delete(i), o.delete(i));
        continue;
      }
      if (
        (G = X.match(E)) ||
        (G = X.match(T)) ||
        (G = X.match(P)) ||
        (G = X.match(M)) ||
        (G = X.match(L)) ||
        (G = X.match(V)) ||
        (G = X.match(de)) ||
        (G = X.match(ue)) ||
        (G = X.match(Ae)) ||
        (G = X.match(ge))
      ) {
        (a(n, G.groups?.path),
          (i = G.groups?.path ?? i),
          r.delete(G.groups?.path ?? ""),
          o.delete(G.groups?.path ?? ""));
        continue;
      }
      if ((G = X.match(Pe))) {
        (a(o, G.groups?.path),
          (i = G.groups?.path ?? i),
          r.delete(G.groups?.path ?? ""),
          n.delete(G.groups?.path ?? ""));
        continue;
      }
    }
  }
  for (let Q of o) (r.delete(Q), n.delete(Q));
  for (let Q of r) n.delete(Q);
  return {
    appliedPaths: Array.from(r).sort(),
    skippedPaths: Array.from(n).sort(),
    conflictedPaths: Array.from(o).sort(),
  };
}
function dK(t) {
  let e = new Set(),
    r = /^diff --git a\/(.*?) b\/(.*)$/gm,
    n;
  for (; (n = r.exec(t)) != null; ) {
    let [o, i, s] = n;
    (i && i !== "/dev/null" && e.add(i), s && s !== "/dev/null" && e.add(s));
  }
  return Array.from(e);
}
async function id(t, e, r, { gitConfigOverrides: n = [], signal: o } = {}) {
  let { cwd: i, env: s, diff: a, atomic: l, revert: c, target: u = "unstaged", allowBinary: p } = t,
    m = Dt("applyPatch"),
    f = i,
    h = await e.getWorktreeRepository(f, r);
  if ((h || (e.invalidateStableMetadata(), (h = await e.getWorktreeRepository(f, r))), !h))
    return {
      status: "error",
      appliedPaths: [],
      skippedPaths: [],
      conflictedPaths: [],
      errorCode: "not-git-repo",
    };
  let v = h.root;
  if (o?.aborted)
    return { status: "error", appliedPaths: [], skippedPaths: [], conflictedPaths: [] };
  let y = await tl(r, "codex-apply-", o),
    _ = (await r.platformPath()).join(y, "patch.diff");
  await r.writeFile(_, a, { signal: o });
  try {
    let S = s;
    if (u === "unstaged" && !l) {
      let ue = await ol(h, o);
      if (!ue)
        m.warning("[applyPatch] Unable to resolve git index path; applying without temp index");
      else {
        let Ae = await Wy(y, ue, r);
        ((S = { ...s, GIT_INDEX_FILE: Ae }),
          await kNt(v, a, r, { env: S, gitConfigOverrides: n, signal: o }));
      }
    }
    let E = ["apply"];
    (c && E.push("-R"),
      p && E.push("--binary"),
      l || E.push("--3way"),
      u === "staged" ? E.push("--cached") : u === "staged-and-unstaged" && E.push("--index"),
      E.push(_));
    let {
        code: T,
        stdout: P,
        stderr: M,
      } = await I(v, E, r, { configOverrides: n, env: S, signal: o, allowedNonZeroExitCodes: [1] }),
      { appliedPaths: L, skippedPaths: V, conflictedPaths: de } = INt(P, M);
    return (
      m.debug("ApplyPatch result metadata", {
        safe: {
          revert: c,
          target: u,
          code: T,
          stdoutLength: P.length,
          stderrLength: M.length,
          appliedCount: L.length,
          skippedCount: V.length,
          conflictedCount: de.length,
        },
        sensitive: {},
      }),
      {
        status:
          o?.aborted || T == null
            ? "error"
            : T === 0
              ? "success"
              : T === 1 && !l
                ? "partial-success"
                : "error",
        appliedPaths: L,
        skippedPaths: V,
        conflictedPaths: de,
        execOutput: Nt({ command: E.join(" "), stdout: P, stderr: M }),
      }
    );
  } finally {
    await r.remove(y, { recursive: !0, force: !0 });
  }
}
async function kNt(t, e, r, { env: n, gitConfigOverrides: o = [], signal: i }) {
  let s = dK(e);
  if (s.length === 0) return;
  let a = [],
    l = await r.platformPath();
  if (
    (await Promise.all(
      s.map(async (c) => {
        let u = ro(l, t, t, c),
          p = l.join(t, u);
        (await DNt(p, { host: r, signal: i })) && a.push(u);
      }),
    ),
    a.length !== 0)
  ) {
    if (i?.aborted) throw new Error("Apply patch canceled");
    await I(t, ["add", "--", ...a], r, { configOverrides: o, env: n, signal: i });
  }
}
async function DNt(t, { host: e, signal: r }) {
  r?.throwIfAborted();
  try {
    return (await e.stat(t), !0);
  } catch {
    return !1;
  }
}
var nv = g(() => {
  O();
  hr();
  Gy();
  tO();
  Zy();
  od();
  fe();
});
var pK = A((yzr, nLe) => {
  var MNt = Ep(),
    rLe = /[\\^$.*+?()[\]{}|]/g,
    ONt = RegExp(rLe.source);
  function NNt(t) {
    return ((t = MNt(t)), t && ONt.test(t) ? t.replace(rLe, "\\$&") : t);
  }
  nLe.exports = NNt;
});
async function aLe({
  worktreeRepo: t,
  startingState: e,
  mode: r,
  onLog: n,
  signal: o,
  upstreamRefreshSignal: i,
}) {
  switch (r) {
    case "never":
      return;
    case "best-effort":
      break;
  }
  if (e.type !== "branch" || e.remoteRef != null) return;
  let s = e.branchName === "HEAD" ? await Cr(t) : e.branchName;
  if (s == null) return;
  let a, l, c;
  if (s.startsWith("refs/remotes/")) {
    let S = await I(t.root, ["symbolic-ref", "--quiet", s], t.host, {
      signal: o,
      allowedNonZeroExitCodes: [1],
    });
    if (
      ((c = S.code === 0 ? S.stdout : s),
      (a =
        (await hn(t))
          .filter((L) => c.startsWith(`refs/remotes/${L}/`))
          .sort((L, V) => V.length - L.length)[0] ?? null),
      a == null)
    )
      return;
    let E = await I(t.root, ["config", "--get-all", `remote.${a}.fetch`], t.host, { signal: o });
    if (!E.success) return;
    let T = E.stdout.split(`
`),
      P = new Set();
    for (let L of T) {
      let [V, de] = L.replace(/^\+/, "").split(":");
      if (V == null || de == null) continue;
      let ue = iLe(de, c);
      ue != null && P.add(V.replace("*", () => ue[1] ?? ""));
    }
    let M = P.size === 1 ? [...P][0] : void 0;
    if (M == null || T.some((L) => L.startsWith("^") && iLe(L.slice(1), M) != null)) return;
    l = M;
  } else {
    if (
      (([a, l] = await Promise.all([
        t.getConfigValue(`branch.${s}.remote`, o),
        t.getConfigValue(`branch.${s}.merge`, o),
      ])),
      a == null || l == null || a === ".")
    )
      return;
    let S = await I(
      t.root,
      ["for-each-ref", "--format=%(upstream)", "--count=1", `refs/heads/${s}`],
      t.host,
      { signal: o },
    );
    if (!S.success || !S.stdout) return;
    c = S.stdout;
  }
  let [u, p, m] = await Promise.all([
    t.getConfigValue(`remote.${a}.url`, o),
    t.host.platformFamily(),
    $Nt(t, o, i),
  ]);
  if (o?.aborted) return;
  if (i?.aborted) {
    n?.(
      "info",
      sd.encode(`[info] Continuing without updating
`),
    );
    return;
  }
  if (u == null) return;
  n?.("info", sd.encode("[info] Refreshing upstream before creating worktree"));
  let f = Date.now(),
    h = f,
    v = n != null,
    y = n
      ? UNt((S) => {
          (v &&
            (n(
              "info",
              sd.encode(`
`),
            ),
            (v = !1)),
            (h = Date.now()),
            n("stderr", S));
        })
      : void 0,
    w = n
      ? setInterval(() => {
          let S = Date.now();
          o?.aborted ||
            S - h < oLe ||
            n(
              "info",
              sd.encode(
                `\r[info] Refreshing upstream before creating worktree (${Math.floor((S - f) / 1e3)}s elapsed)`,
              ),
            );
        }, oLe)
      : void 0,
    _ = await I(
      t.root,
      ["fetch", "--progress", "--no-tags", "--no-recurse-submodules", "--", u, `+${l}:${c}`],
      t.host,
      {
        configOverrides: [...m, "-c", "protocol.file.allow=always"],
        env: {
          GIT_CONFIG: p === "windows" ? "NUL" : "/dev/null",
          GIT_CONFIG_GLOBAL: p === "windows" ? "NUL" : "/dev/null",
          GIT_CONFIG_NOSYSTEM: "1",
          GIT_PROTOCOL_FROM_USER: "0",
        },
        onStderrRaw: y?.write,
        signal: o,
        waitForExitOnAbortSignal: i,
      },
    ).finally(() => {
      (w != null && clearInterval(w),
        y?.finish(),
        v &&
          n?.(
            "info",
            sd.encode(`
`),
          ));
    });
  if (!o?.aborted) {
    if (i?.aborted) {
      n?.(
        "info",
        sd.encode(`[info] Continuing without updating
`),
      );
      return;
    }
    if (_.success) {
      (t.invalidateGitReadCachesForRepoChange("remote-refs"),
        n?.(
          "info",
          new TextEncoder().encode(`[info] Upstream refreshed
`),
        ));
      return;
    }
    (LNt().warning("[worktree-create] upstream-refresh-failed", {
      safe: { exitCode: _.code },
      sensitive: { branchName: s, remote: a, stderr: _.stderr },
    }),
      n?.(
        "stderr",
        new TextEncoder().encode(
          (zu(_.stderr) === "authentication"
            ? `[warning] Git authentication failed; sign in again before retrying
`
            : "") +
            `[warning] Could not refresh upstream; using cached Git state
`,
        ),
      ));
  }
}
async function $Nt(t, e, r) {
  let n = await Promise.all(
      ["--system", "--global"].map((i) =>
        I(t.root, ["config", i, "--includes", "--null", "--get-regexp", "^credential\\."], t.host, {
          allowedNonZeroExitCodes: [1],
          signal: e,
          trim: !1,
          waitForExitOnAbortSignal: r,
        }),
      ),
    ),
    o = new Array();
  for (let i of n)
    if (i.success)
      for (let s of i.stdout.split("\0")) {
        let a = s.indexOf(`
`);
        a <= 0 || o.push("-c", `${s.slice(0, a)}=${s.slice(a + 1)}`);
      }
  return o;
}
function UNt(t) {
  let e = new TextDecoder(),
    r = "",
    n = !1,
    o = !1,
    i = (l, c) => {
      let u = FNt.exec(l);
      if (u == null) return;
      let [, p, m, f, h, v] = u,
        y = m == null ? v : `${m}% (${f}/${h})`;
      (t(sd.encode(`${p}: ${y}${c}`)), (o = c === "\r"));
    },
    s = (l) => {
      let c = l.split(/(\r\n|\r|\n)/);
      for (let u = 0; u < c.length; u += 2) {
        n || ((r += c[u] ?? ""), r.length > BNt && ((r = ""), (n = !0)));
        let p = c[u + 1];
        p != null &&
          (n ||
            i(
              r,
              p === "\r"
                ? "\r"
                : `
`,
            ),
          (r = ""),
          (n = !1));
      }
    };
  return {
    write: (l) => {
      s(e.decode(l, { stream: !0 }));
    },
    finish: () => {
      (s(e.decode()),
        !n &&
          r.length > 0 &&
          i(
            r,
            `
`,
          ),
        o &&
          t(
            sd.encode(`
`),
          ));
    },
  };
}
function iLe(t, e) {
  return new RegExp(`^${(0, sLe.default)(t).replace("\\*", "(.*)")}$`).exec(e);
}
var sLe,
  LNt,
  oLe,
  BNt,
  FNt,
  sd,
  lLe = g(() => {
    sLe = F(pK());
    hr();
    Gi();
    il();
    cx();
    fe();
    ((LNt = Ie("git")),
      (oLe = 15e3),
      (BNt = 1024),
      (FNt =
        /^(?:remote:\s*)?(Enumerating objects|Counting objects|Compressing objects|Receiving objects|Resolving deltas):\s+(?:(\d{1,3})%\s+\((\d+)\/(\d+)\)|(\d+))(?:,.*)?$/),
      (sd = new TextEncoder()));
  });
async function cLe(t, e, r, n, o, i) {
  try {
    let s = await hK(t, e, r, n, o, i);
    if (!s.success && !s.preserveCheckout)
      try {
        await ms(e, o, !0);
      } catch (a) {
        mK().warning("Failed to cleanup worktree", { safe: {}, sensitive: { error: a } });
      }
    return s;
  } catch (s) {
    try {
      await ms(e, o, !0);
    } catch (a) {
      mK().warning("Failed to cleanup worktree", { safe: {}, sensitive: { error: a } });
    }
    return { success: !1, error: WNt(s) };
  }
}
async function hK(t, e, r, n, o, i) {
  let s = i?.onLog,
    a = i?.signal;
  if (a?.aborted) return { success: !1, error: new Error("Operation canceled") };
  let l = n.getWorktreeRepositoryForRoot(t, o),
    c = await to(l, a, i?.sourceGitEnv),
    u = i?.resolvedStartingCommit;
  if (
    (u == null &&
      (await aLe({
        worktreeRepo: l,
        startingState: r,
        mode: i?.upstreamRefreshMode ?? UP,
        onLog: s,
        signal: a,
        upstreamRefreshSignal: i?.upstreamRefreshSignal,
      })),
    a?.aborted)
  )
    return { success: !1, error: new Error("Operation canceled") };
  let [{ startingRef: p, startingDiff: m }, f] = await Promise.all([
    u == null ? ENe(t, r, n, o, c, a) : { startingRef: u, startingDiff: null },
    r.type === "working-tree" ? qn(l, void 0, void 0, a) : Promise.resolve(null),
  ]);
  if (f != null && !f.success) throw new Error("Failed to collect untracked working tree files");
  if (a?.aborted) return { success: !1, error: new Error("Operation canceled") };
  let v = await I(t, ["worktree", "add", "--detach", e, p], o, {
    collectOutput: "excerpt",
    configOverrides: c,
    env: u == null ? void 0 : { ...fK, ...i?.sourceGitEnv },
    onStdoutRaw: s ? (w) => s("stdout", w) : void 0,
    onStderrRaw: s ? (w) => s("stderr", w) : void 0,
    signal: a,
  });
  if (v.commandNotStarted)
    return { success: !1, error: new Error(`Git did not start the checkout: ${v.stderr}`) };
  if (!v.success && v.code == null && u != null && Ds(o.id) != null) {
    if (!(await qNt(l, e, u, a).catch(() => !1)))
      return {
        success: !1,
        error: new Error("Lost confirmation of git worktree add on the executor."),
        preserveCheckout: !0,
      };
  } else if (!v.success)
    return {
      success: !1,
      error: new Error(
        `git worktree add failed: ${v.stderr || v.stdout}` +
          (u == null
            ? ""
            : `
If this is a partial clone, download the missing checkout objects with Git before retrying.`),
      ),
    };
  if (a?.aborted) return { success: !1, error: new Error("Operation canceled") };
  if (m) {
    s?.(
      "info",
      new TextEncoder().encode(`[info] Applying working tree diff to new worktree
`),
    );
    let w = await id({ cwd: e, diff: m, revert: !1 }, n, o, { gitConfigOverrides: c, signal: a });
    if (w.status !== "success") {
      let _ = [
        `git apply failed: applied:${w.appliedPaths.length} skipped:${w.skippedPaths.length} conflicted:${w.conflictedPaths.length}`,
        w.execOutput?.output.trim(),
      ].filter(Boolean).join(`
`);
      return (
        s?.(
          "info",
          new TextEncoder().encode(`${_}
`),
        ),
        { success: !1, error: new Error(_) }
      );
    }
  }
  if (f != null && f.paths.length > 0) {
    s?.(
      "info",
      new TextEncoder().encode(`[info] Copying untracked files to new worktree
`),
    );
    let w = await o.platformPath();
    for (let _ of f.paths) {
      if (a?.aborted) return { success: !1, error: new Error("Operation canceled") };
      let S = w.join(e, _);
      (await o.createDirectory(w.dirname(S), { recursive: !0 }), await o.copy(w.join(t, _), S));
    }
  }
  let y = r.type === "branch" && r.remoteRef != null ? null : await GNt(l, p, a);
  return a?.aborted
    ? (y != null && (await uLe(l, y)), { success: !1, error: new Error("Operation canceled") })
    : { success: !0, startingRef: p };
}
async function qNt(t, e, r, n) {
  let o = AbortSignal.timeout(6e5),
    i = n == null ? o : AbortSignal.any([n, o]),
    s = 1e3;
  for (; !i.aborted; ) {
    let a = await Zs(t, i).catch(() => null);
    if (i.aborted) return !1;
    let l = a?.find((c) => c.root === e);
    if (l?.prunable) return !1;
    if (l != null && !l.locked) return l.headRef.type === "detached" && l.headRef.sha === r;
    (await new Promise((c) => {
      AbortSignal.any([i, AbortSignal.timeout(s)]).addEventListener("abort", () => c(), {
        once: !0,
      });
    }),
      (s = Math.min(s * 2, 15e3)));
  }
  return !1;
}
async function GNt(t, e, r) {
  let n = "refs/remotes/";
  if (!e.startsWith(n)) return null;
  let o = e.slice(n.length),
    i = (await hn(t)).find((l) => o.startsWith(`${l}/`));
  if (i == null) return null;
  let s = o.slice(i.length + 1);
  if (!s || s === "HEAD" || (await At(t, `refs/heads/${s}`, r)) != null) return null;
  let a = await I(t.root, ["branch", "--track", s, e], t.host);
  if (!a.success) throw new Error(a.stderr || a.stdout);
  try {
    return (await At(t, `refs/heads/${s}`, void 0, { fresh: !0 }), s);
  } catch (l) {
    throw (await uLe(t, s), l);
  }
}
async function uLe(t, e) {
  let r = await I(t.root, ["branch", "-D", e], t.host);
  (r.success ||
    mK().warning("Failed to cleanup local tracking branch", {
      safe: {},
      sensitive: { error: r.stderr || r.stdout },
    }),
    await At(t, `refs/heads/${e}`, void 0, { fresh: !0 }));
}
function WNt(t) {
  return t instanceof Error ? t : new Error(String(t));
}
var mK,
  fK,
  dLe = g(() => {
    O();
    hr();
    SO();
    ev();
    il();
    ps();
    xc();
    Ks();
    Km();
    nv();
    lLe();
    fe();
    ((mK = Ie("git")), (fK = { GIT_NO_LAZY_FETCH: "1", GIT_ALLOW_PROTOCOL: "" }));
  });
function CO(t, e, r) {
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "root-relative-cwd", e),
    queryFn: async () => {
      let n = await I(e, ["rev-parse", "--show-prefix"], t.host, { signal: r });
      if (n.success) return n.stdout.replace(/\/+$/, "");
      throw new Error(
        `Failed to resolve git-root-relative cwd: ${n.stderr || n.stdout || "Unknown error"}`,
      );
    },
    staleTime: Ve,
  });
}
var gK = g(() => {
  je();
  fe();
});
async function pLe(t, e, r, n) {
  let o = await t.host.platformPath(),
    i = n ?? crypto.randomUUID().slice(0, 4),
    s = o.basename(t.root),
    a = o.join(r, i, s),
    l = await CO(t, e);
  return { worktreeGitRoot: a, relativeCwd: l };
}
var mLe = g(() => {
  O();
  gK();
});
async function sl(t, e, r, n) {
  let o = await I(t, ["show-ref", "--verify", "--quiet", Vs(e)], r, { signal: n });
  return o.success && o.code === 0;
}
var sA = g(() => {
  fe();
  Yy();
});
function al(t, e, r) {
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "tree", e),
    gcTime: be,
    meta: Ue,
    queryFn: async () => {
      let n = await I(t.root, ["rev-parse", `${e}^{tree}`], t.host, {
        allowedNonZeroExitCodes: [128],
        signal: r,
      });
      if (!n.success || !n.stdout)
        throw new Error(n.stderr || n.stdout || "Failed to resolve tree");
      return n.stdout;
    },
    staleTime: be,
  });
}
var ov = g(() => {
  je();
  fe();
});
async function hLe(t, { maxObjectBytes: e, requests: r, reviewSnapshot: n }, o) {
  if (r.length > 4) return r.map(TO);
  let i = Math.max(0, Math.min(e ?? 5242880, 5242880));
  try {
    let s = [...new Set(r.flatMap(({ oid: p }) => (fLe(p) ? [p] : [])))],
      a = s.length === 0 ? [] : await yLe(t, s, i, o, n),
      l = new Map(s.map((p, m) => [p, a[m] ?? TO()])),
      c = r.map(({ oid: p }) =>
        fLe(p) ? (l.get(p) ?? TO()) : { type: "error", error: { type: "not-found" } },
      );
    if (
      !c.some(
        (p, m) => r[m]?.fallbackToDisk === !0 && p.type === "error" && p.error.type === "not-found",
      )
    )
      return c;
    let u = t.host.platformPath();
    return await Promise.all(
      c.map(async (p, m) => {
        let f = r[m];
        if (f?.fallbackToDisk !== !0 || p.type !== "error" || p.error.type !== "not-found")
          return p;
        try {
          let h = (await u).join(t.root, f.path);
          return await XNt(h, t, i, n);
        } catch (h) {
          return ZNt(h);
        }
      }),
    );
  } catch {
    return r.map(TO);
  }
}
function TO() {
  return { type: "error", error: { type: "unknown" } };
}
function ZNt(t) {
  return { type: "error", error: { type: eLt(t) ? "not-found" : "unknown" } };
}
function XNt(t, e, r, n) {
  let o = () => QNt(t, e.host, r);
  return n == null ? o() : n.read(o);
}
function YNt(t) {
  return t.includes("No such file") || t.includes("cannot open") || t.includes("not found");
}
function gLe(t) {
  return t.match(/[^\n]*\n|[^\n]+/g) ?? [];
}
function fLe(t) {
  return t ? !jNt.test(t) : !1;
}
function JNt(t) {
  return t.code === 128 ? "not-found" : "unknown";
}
async function QNt(t, e, r) {
  let { size: n } = await e.stat(t, { bypassCache: !0 });
  if (n != null && n > r) return { type: "error", error: { type: "too-large", limitBytes: r } };
  let o = await yK(await e.readFile(t), r + 1);
  return o.byteLength > r
    ? { type: "error", error: { type: "too-large", limitBytes: r } }
    : { type: "success", lines: gLe(new TextDecoder("utf-8", { ignoreBOM: !0 }).decode(o)) };
}
async function yK(t, e) {
  let r = t.getReader(),
    n = new Array(),
    o = 0;
  try {
    for (; o < e; ) {
      let { done: a, value: l } = await r.read();
      if (a) break;
      let c = l.subarray(0, e - o);
      (n.push(c), (o += c.byteLength));
    }
    o === e && (await r.cancel());
  } finally {
    r.releaseLock();
  }
  let i = new Uint8Array(o),
    s = 0;
  for (let a of n) (i.set(a, s), (s += a.byteLength));
  return i;
}
function eLt(t) {
  return t instanceof Error && (("code" in t && t.code === "ENOENT") || YNt(t.message));
}
async function yLe(t, e, r, n, o) {
  let i = new TextEncoder(),
    s = {
      collectStdoutBuffer: !0,
      env: KNt,
      maxOutputBytes: e.reduce(
        (u, p) => Math.min(Number.MAX_SAFE_INTEGER, u + r + i.encode(p).byteLength + VNt),
        0,
      ),
      signal: n,
      stdin: `${e.join(`
`)}
`,
      timeoutMs: zNt,
      trim: !1,
    },
    a =
      o == null
        ? await I(t.root, ["cat-file", "--batch"], t.host, s)
        : await o.git(["cat-file", "--batch"], s),
    { results: l, retryStartIndex: c } = tLt(e.length, a, r);
  return c == null ? l : [...l, ...(await yLe(t, e.slice(c), r, n, o))];
}
function tLt(t, e, r) {
  let n = rLt(t, e, r);
  if (!e.success && e.outputLimitExceeded == null)
    return { results: Array.from({ length: t }, () => n), retryStartIndex: null };
  let o = e.stdoutBuffer ?? new TextEncoder().encode(e.stdout ?? ""),
    i = new TextDecoder(),
    s = new Array(),
    a = 0,
    l = !1;
  for (let c = 0; c < t; c += 1) {
    let u = o.indexOf(10, a);
    if (u === -1) {
      if (e.outputLimitExceeded != null && l) return { results: s, retryStartIndex: c };
      s.push(n);
      continue;
    }
    let p = i.decode(o.subarray(a, u));
    if (((a = u + 1), p.endsWith(" missing"))) {
      s.push({ type: "error", error: { type: "not-found" } });
      continue;
    }
    let m = /^[0-9a-f]+ [^ ]+ ([0-9]+)$/.exec(p),
      f = m?.[1] == null ? Number.NaN : Number(m[1]);
    if (!Number.isSafeInteger(f) || f < 0) {
      ((a = o.byteLength), s.push({ type: "error", error: { type: "unknown" } }));
      continue;
    }
    let h = a + f;
    if (h >= o.byteLength || o[h] !== 10) {
      if (((a = o.byteLength), f > r))
        return (
          s.push({ type: "error", error: { type: "too-large", limitBytes: r } }),
          { results: s, retryStartIndex: c + 1 < t ? c + 1 : null }
        );
      if (e.outputLimitExceeded != null && l) return { results: s, retryStartIndex: c };
      s.push(n);
      continue;
    }
    (f > r
      ? ((l = !0), s.push({ type: "error", error: { type: "too-large", limitBytes: r } }))
      : s.push({ type: "success", lines: gLe(i.decode(o.subarray(a, h))) }),
      (a = h + 1));
  }
  return { results: s, retryStartIndex: null };
}
function rLt(t, e, r) {
  return e.outputLimitExceeded != null && t === 1
    ? { type: "error", error: { type: "too-large", limitBytes: r } }
    : { type: "error", error: { type: JNt(e) } };
}
var jNt,
  zNt,
  VNt,
  KNt,
  vK = g(() => {
    O();
    Sc();
    fe();
    ((jNt = /^0+$/), (zNt = 3e4), (VNt = 64), (KNt = { GIT_NO_LAZY_FETCH: "1" }));
  });
async function vLe(t, e, { verifyCheckout: r = !1 } = {}) {
  let n = { timeoutMs: 5e3, maxOutputBytes: 1048576, allowedNonZeroExitCodes: [128, 129] },
    [o, i, s] = await Promise.all([
      I(
        t,
        [
          "rev-parse",
          "--path-format=absolute",
          "--show-toplevel",
          "--git-common-dir",
          "--absolute-git-dir",
          "--is-inside-work-tree",
        ],
        e,
        n,
      ),
      I(t, ["worktree", "list", "--porcelain", "-z"], e, { ...n, trim: !1 }),
      e.platformPath(),
    ]);
  if (!o.success || !i.success) return null;
  let a = o.stdout.split(/\r?\n/),
    [l, c, u, p] = a;
  if (
    a.length !== 4 ||
    l == null ||
    c == null ||
    u == null ||
    ![l, c, u].every((f) => s.isAbsolute(f))
  )
    return null;
  let m = i.stdout.split("\0\0").some((f) => {
    let h = f.split("\0"),
      v = h[0]?.startsWith("worktree ") ? h[0].slice(9) : null;
    return (
      v != null &&
      s.isAbsolute(v) &&
      s.relative(v, l) === "" &&
      !h.some((y) => y === "bare" || y.startsWith("prunable"))
    );
  });
  if (r) {
    if (p !== "true") return null;
    let f = s.join(l, ".git");
    if (s.relative(u, c) === "") {
      if (!m || s.relative(f, u) !== "") {
        let h = await I(u, ["rev-parse", "--show-toplevel"], e, { ...n, env: { GIT_DIR: u } });
        if (
          h.code !== 0 ||
          !s.isAbsolute(h.stdout) ||
          s.relative(h.stdout, l) !== "" ||
          s.relative(u, l) === ""
        )
          return null;
      }
    } else {
      if (!m || s.relative(s.join(c, "worktrees"), s.dirname(u)) !== "") return null;
      let h = s.join(u, "gitdir"),
        v = await e.stat(h, { bypassCache: !0, followSymlinks: !1 });
      if (!v.isFile() || (v.size != null && v.size > n.maxOutputBytes)) return null;
      let y = await yK(await e.readFile(h), n.maxOutputBytes + 1),
        w = new TextDecoder().decode(y);
      if (y.length > n.maxOutputBytes || s.relative(s.resolve(u, w.trimEnd()), f) !== "")
        return null;
    }
  }
  return { root: l, commonDir: c, gitDir: u, registered: m };
}
var bLe = g(() => {
  vK();
  fe();
});
async function sv(t, e) {
  try {
    return (await t.stat(e, { bypassCache: !0 })).isDirectory();
  } catch (r) {
    if (bt(r)) return !1;
    throw r;
  }
}
var bK = g(() => {
  O();
});
async function wLe(t, e) {
  let r = await us(t, e);
  return r ? (await t.host.platformPath()).join(r, aA) : null;
}
function oLt(t) {
  try {
    let e = nLt.safeParse(JSON.parse(t));
    return e.success
      ? e.data
      : (SLe().warning("Invalid synced branch config", {
          safe: { parseErrorMessage: e.error.message ?? "unknown error" },
          sensitive: {},
        }),
        null);
  } catch (e) {
    return (
      SLe().warning("Failed to parse synced branch config", { safe: {}, sensitive: { error: e } }),
      null
    );
  }
}
async function av(t, e) {
  let r = await wLe(t, e);
  if (!r) return null;
  try {
    let n = await new Response(await t.host.readFile(r)).text();
    return oLt(n);
  } catch (n) {
    return (n.code === "ENOENT", null);
  }
}
async function iLt(t, e, r) {
  let n = await wLe(t, r);
  if (!n) throw new Error("No git repository found for synced branch config");
  let o = `${JSON.stringify(e, null, 2)}
`;
  await t.host.writeFile(n, o);
}
async function PO(t, e, r, n) {
  await iLt(t, { branch: e, lastSyncedTreeRef: r }, n);
}
async function _Le(t, e) {
  return nl(t, aA, e);
}
var SLe,
  aA,
  nLt,
  ad = g(() => {
    hr();
    $();
    Wm();
    Ky();
    ((SLe = Ie("syncedBranchConfig")),
      (aA = "codex-synced-branch.json"),
      (nLt = d.object({ branch: d.string(), lastSyncedTreeRef: d.string() })));
  });
async function SK(t, e) {
  return nl(t, sLt, e);
}
async function ALe(t, e) {
  let r = await SK(t, e);
  if (r == null) return null;
  try {
    let n = await new Response(await t.host.readFile(r)).text(),
      o = aLt.safeParse(JSON.parse(n));
    return o.success
      ? o.data
      : (xLe().warning("Invalid worktree shell environment config", {
          safe: {},
          sensitive: { error: o.error.message },
        }),
        null);
  } catch (n) {
    return (
      n.code === "ENOENT" ||
        xLe().warning("Failed to read worktree shell environment config", {
          safe: {},
          sensitive: { error: n },
        }),
      null
    );
  }
}
async function RLe(t, e, r) {
  let n = await SK(t, r);
  if (n == null) throw new Error("No git repository found for worktree shell env");
  await t.host.writeFile(
    n,
    `${JSON.stringify(e, null, 2)}
`,
  );
}
async function ELe(t, e) {
  let r = await SK(t, e);
  r != null && (await t.host.remove(r));
}
var xLe,
  sLt,
  aLt,
  IO = g(() => {
    hr();
    $();
    Ky();
    ((xLe = Ie("worktreeShellEnvironmentConfig")),
      (sLt = "codex-shell-environment.json"),
      (aLt = d.object({
        version: d.literal(1),
        set: d.record(d.string(), d.string()),
        exclude: d.array(d.string()),
      })));
  });
async function uA({
  name: t,
  gitManager: e,
  workspaceRoot: r,
  approvedSource: n,
  startingState: o,
  useExactStartingRef: i = !1,
  managedCheckoutLeaf: s,
  upstreamRefreshMode: a,
  localEnvironmentConfigPath: l,
  allowSetupFailure: c = !1,
  setUpSyncedBranch: u = !0,
  host: p,
  signal: m,
  upstreamRefreshSignal: f,
  onLog: h,
  onWorktreePathAllocated: v,
  onSetupStart: y,
  worktreesRoot: w,
  useWorkspaceDir: _ = !1,
}) {
  if (m?.aborted) return { success: !1, error: new Error("Request canceled") };
  let S;
  if (n == null) S = await e.getWorktreeRepository(r, p);
  else {
    let [oe, _t] = await Promise.all([vLe(r, p, { verifyCheckout: !0 }), p.platformPath()]);
    if (
      oe == null ||
      _t.relative(n.root, oe.root) !== "" ||
      _t.relative(n.commonDir, oe.commonDir) !== "" ||
      _t.relative(n.gitDir, oe.gitDir) !== ""
    )
      return {
        success: !1,
        error: new Error(
          "The source Git checkout changed. Retry create_worktree with sourceRoot set to the absolute path of the intended checkout.",
        ),
      };
    S = e.getWorktreeRepositoryForRoot(oe.root, p);
  }
  if (!S) return { success: !1, error: new Error("Not a git repository") };
  if (m?.aborted) return { success: !1, error: new Error("Request canceled") };
  let E = i && o?.type === "branch" ? (o.remoteRef ?? o.branchName) : null;
  if ((i || (n != null && o?.type !== "working-tree")) && E == null)
    return { success: !1, error: new Error("Specify a local Git ref to create the worktree.") };
  let T = E == null ? await gn(S) : null,
    P = T?.branch ?? null,
    M = o;
  if (M == null) {
    if (T == null)
      return {
        success: !1,
        error: new Error(
          "Could not determine the remote default branch. Specify an explicit ref to create the worktree.",
        ),
      };
    M = { type: "branch", branchName: `refs/remotes/${T.remote}/${T.branch}` };
  }
  let L = n == null ? void 0 : { GIT_DIR: n.gitDir, GIT_COMMON_DIR: n.commonDir },
    V;
  if (E != null) {
    let oe = await I(
      S.root,
      ["rev-parse", "--verify", "--quiet", "--end-of-options", `${E}^{commit}`],
      p,
      { env: { ...fK, ...L }, signal: m, allowedNonZeroExitCodes: [1] },
    );
    if (m?.aborted) return { success: !1, error: new Error("Request canceled") };
    if (!oe.success || oe.code !== 0 || !oe.stdout)
      return {
        success: !1,
        error: new Error(
          `Worktree starting ref is not available locally: ${E}. Check the ref or fetch it with Git and retry.`,
        ),
      };
    V = oe.stdout;
  }
  if (t != null && !t_.safeParse(t).success)
    return {
      success: !1,
      error: new Error(
        "Invalid worktree name. Use 1\u201364 lowercase letters, numbers, or single hyphens; hexadecimal IDs and Windows device names are reserved.",
      ),
    };
  let de = await OOe(p, w, _),
    { worktreeGitRoot: ue, relativeCwd: Ae } = await pLe(S, r, de, t);
  if (m?.aborted) return { success: !1, error: new Error("Request canceled") };
  let ge,
    Pe = await p.platformPath(),
    Q = Pe.dirname(ue),
    X = null;
  if (s != null && !/^wt-[a-f0-9]{32}$/.test(s))
    throw new Error("Invalid managed checkout registration.");
  try {
    ((Q = await fLt(Q, p, m)),
      (X = Q),
      (ue = Pe.join(Q, s ?? Pe.basename(ue))),
      (ge = Pe.join(ue, Ae)),
      await p.writeFile(Pe.join(Q, $y), ""));
  } catch (oe) {
    return (
      X != null && s == null && (await p.remove(X, { recursive: !0, force: !0 }).catch(() => {})),
      {
        success: !1,
        error: new Error(
          "Could not reserve the worktree directory. Check the worktrees directory permissions.",
          { cause: oe },
        ),
      }
    );
  }
  v?.(ue);
  let ce = await (s != null ? hK : cLe)(S.root, ue, M, e, p, {
    onLog: h,
    signal: m,
    upstreamRefreshMode: a,
    upstreamRefreshSignal: f,
    resolvedStartingCommit: V,
    sourceGitEnv: L,
  });
  if (!ce.success)
    return (
      s == null && !ce.preserveCheckout && (await p.remove(Q, { recursive: !0, force: !0 })),
      { success: !1, error: ce.error }
    );
  if (m?.aborted) return { success: !1, error: new Error("Request canceled") };
  let Ce = e.getWorktreeRepositoryForRoot(ue, p),
    De = V == null ? await mLt(S, M, ce.startingRef, m) : null;
  if (p.isLocal) {
    await cLt(S.root, ue, p);
    let oe = await pLt(S.root, p);
    await PLe({
      sourceGitRoot: S.root,
      worktreeGitRoot: ue,
      relativePaths: oe,
      label: kO,
      host: p,
      onLog: h,
    });
  }
  if (u && De && De !== P && !(M.type === "branch" && M.remoteRef != null)) {
    let oe = Vs(De),
      _t = await al(S, oe, m);
    await PO(Ce, oe, _t, m);
  }
  async function Ge(oe = null, _t = null) {
    if (_t != null && !c) return { success: !1, error: _t };
    if (!(await sv(p, ge))) {
      let Hr = await I(
        ue,
        ["config", "--type=bool", "--default=false", "--get", "core.sparseCheckout"],
        p,
        { signal: m },
      );
      if (Hr.stdout !== "false")
        return {
          success: !1,
          error: new Error(
            Hr.stderr ||
              `Worktree created at ${ue}, but the project directory ${ge} is missing. Check the selected revision and sparse checkout rules.`,
          ),
        };
    }
    return (
      h?.(
        "info",
        Ac.encode(`Worktree ready at ${ge}
`),
      ),
      {
        success: !0,
        worktreeGitRoot: ue,
        worktreeWorkspaceRoot: ge,
        setupResult: oe,
        setupError: _t,
      }
    );
  }
  if (s != null) return Ge();
  let We =
      l == null
        ? null
        : await uLt({
            localEnvironmentConfigPath: l,
            sourceGitRoot: S.root,
            worktreeGitRoot: ue,
            host: p,
            signal: m,
          }).catch(() => l),
    yt = We ?? zI;
  if (
    ((await Ce.setConfigValueForScope(_g, yt, "worktree", m)) ||
      h?.(
        "stderr",
        Ac.encode(`Failed to store selected environment in git config
`),
      ),
    We == null)
  )
    return (
      h?.(
        "info",
        Ac.encode(`No local environment selected
`),
      ),
      Ge()
    );
  y?.();
  let et = await jx(We, p);
  if (et.type === "error") {
    let oe = new Error(et.error.message);
    return (
      h?.(
        "stderr",
        Ac.encode(`${oe.message}
`),
      ),
      Ge(null, oe)
    );
  }
  h?.(
    "info",
    Ac.encode(`Running setup script ${et.configPath}
`),
  );
  let tt = await LNe(
    ue,
    et,
    (oe, _t) => {
      h?.(oe, _t);
    },
    m,
    { [VI]: r, [KI]: ge },
    p,
  );
  if (m?.aborted) return { success: !1, error: new Error("Request canceled") };
  let Sr = tt?.setupResult ?? null;
  if (Sr?.status === "failed") {
    let oe = new Error(Sr.error ?? "Setup script failed");
    return (
      h?.(
        "stderr",
        Ac.encode(`${oe.message}
`),
      ),
      Ge(Sr, oe)
    );
  }
  Sr?.status === "succeeded" &&
    h?.(
      "info",
      Ac.encode(`Setup script completed
`),
    );
  try {
    tt?.shellEnvironment == null ? await ELe(Ce, m) : await RLe(Ce, tt.shellEnvironment, m);
  } catch (oe) {
    h?.(
      "stderr",
      Ac.encode(`Failed to store worktree shell environment: ${String(oe)}
`),
    );
  }
  return Ge(Sr);
}
async function cLt(t, e, r) {
  let n = await dLt(t, r);
  await PLe({ sourceGitRoot: t, worktreeGitRoot: e, relativePaths: n, label: lA, host: r });
}
async function uLt({
  localEnvironmentConfigPath: t,
  sourceGitRoot: e,
  worktreeGitRoot: r,
  host: n,
  signal: o,
}) {
  let i = await n.platformPath(),
    s = i.relative(e, t),
    a = i.join(r, s),
    l = await n.stat(a, { followSymlinks: !1 }).catch((m) => {
      if (cA(m, "ENOENT")) return null;
      throw m;
    });
  if (l != null) {
    if (!l.isFile())
      throw new Error("Selected local environment configuration is not a regular file");
    return (await kLe(r, i.dirname(a), i, n, "selected local environment"), a);
  }
  if (!n.isLocal) return t;
  let c = await I(e, ["ls-files", "--error-unmatch", "--", s], n, {
    allowedNonZeroExitCodes: [1],
    signal: o,
  });
  if (!c.success) throw new Error("Failed to check selected environment tracking");
  if (c.code === 0) return null;
  let u = await I(e, ["check-ignore", "--quiet", "--", s], n, {
    allowedNonZeroExitCodes: [1],
    signal: o,
  });
  if (!u.success) return t;
  if (u.code === 0) {
    let m = await I(r, ["check-ignore", "--quiet", "--", s], n, {
      allowedNonZeroExitCodes: [1],
      signal: o,
    });
    if (!m.success || m.code !== 0) return t;
  }
  if (
    (await ILe(t, a, r, i, "selected local environment", n),
    !(await n.stat(a, { followSymlinks: !1 })).isFile())
  )
    throw new Error("Selected local environment configuration is not a regular file");
  return a;
}
async function dLt(t, e) {
  let r = `:(glob)**/${lA}`,
    n = await I(t, ["ls-files", "--others", "--ignored", "--exclude-standard", "-z", "--", r], e, {
      trim: !1,
    }),
    o = new Set();
  if (!n.success) throw new Error(`git ls-files failed while locating ${lA}`);
  for (let i of n.stdout.split("\0")) (i === lA || i.endsWith(`/${lA}`)) && o.add(i);
  return [...o];
}
async function PLe({
  sourceGitRoot: t,
  worktreeGitRoot: e,
  relativePaths: r,
  label: n,
  host: o,
  onLog: i,
}) {
  if (r.length === 0) return 0;
  let s = await o.platformPath(),
    a = new TLe.Sema(lLt),
    l = 0;
  return (
    await Promise.all(
      r.map(async (c) => {
        await a.acquire();
        try {
          (await ILe(s.join(t, c), s.join(e, c), e, s, n, o)) && (l += 1);
        } finally {
          a.release();
        }
      }),
    ),
    l > 0 &&
      i?.(
        "info",
        Ac.encode(`Copied ${l} file${l === 1 ? "" : "s"} from ${n}
`),
      ),
    l
  );
}
async function ILe(t, e, r, n, o, i) {
  try {
    if (!(await i.stat(t, { followSymlinks: !1 })).isFile()) return !1;
  } catch (s) {
    if (cA(s, "ENOENT")) return !1;
    throw s;
  }
  await kLe(r, n.dirname(e), n, i, o);
  try {
    return (await i.copyFile(t, e, { exclusive: !0 }), !0);
  } catch (s) {
    if (cA(s, "EEXIST")) return !1;
    throw s;
  }
}
async function pLt(t, e) {
  let n = (await e.platformPath()).join(t, kO);
  try {
    await e.stat(n);
  } catch (c) {
    if (cA(c, "ENOENT")) return [];
    throw c;
  }
  let [o, i] = await Promise.all([
    I(t, ["ls-files", "--others", "--ignored", "--exclude-standard", "-z"], e, { trim: !1 }),
    I(t, ["ls-files", "--others", "--ignored", `--exclude-from=${kO}`, "-z"], e, { trim: !1 }),
  ]);
  if (!o.success || !i.success) throw new Error(`git ls-files failed while locating ${kO} files`);
  let s = CLe(o.stdout),
    a = CLe(i.stdout),
    l = new Set(s);
  return [...new Set(a.filter((c) => l.has(c)))];
}
function CLe(t) {
  return t.split("\0").filter((e) => e.length > 0);
}
async function kLe(t, e, r, n, o) {
  let i = t,
    s = r.relative(t, e);
  for (let a of s.split(r.sep).filter((l) => l !== "")) {
    i = r.join(i, a);
    try {
      if ((await n.stat(i, { followSymlinks: !1 })).isSymbolicLink())
        throw new Error(`Cannot copy ${o} through a symlinked workspace path`);
    } catch (l) {
      if (!cA(l, "ENOENT")) throw l;
      await n.createDirectory(e, { recursive: !0 });
      return;
    }
  }
}
async function mLt(t, e, r, n) {
  if (e.type === "working-tree") return Cr(t);
  if (e.branchName === "HEAD" || e.branchName === "@") return Cr(t);
  let o = "refs/heads/";
  if (r.startsWith(o)) {
    let c = r.slice(o.length);
    return (await sl(t.root, c, t.host, n)) ? c : null;
  }
  let i = "refs/remotes/";
  if (!r.startsWith(i)) return null;
  let s = r.slice(i.length),
    a = (await hn(t)).find((c) => s.startsWith(`${c}/`));
  if (a == null) return null;
  let l = s.slice(a.length + 1);
  return !l || l === "HEAD" ? null : (await sl(t.root, l, t.host, n)) ? l : null;
}
function cA(t, e) {
  return typeof t == "object" && t != null && "code" in t && t.code === e;
}
async function fLt(t, e, r) {
  let n = await e.platformPath(),
    o = n.basename(t).slice(0, 59).replace(/-+$/, ""),
    i = t;
  for (let s = 0; ; s += 1) {
    r?.throwIfAborted();
    try {
      return (await e.createDirectory(i, { recursive: !1 }), i);
    } catch (l) {
      let c = await e.stat(i, { bypassCache: !0, followSymlinks: !1 }).catch(() => null);
      if (s === 5 || c == null) throw l;
    }
    let a = Math.floor(Math.random() * 1e4)
      .toString()
      .padStart(4, "0");
    i = n.join(n.dirname(t), `${o}-${a}`);
  }
}
var TLe,
  lA,
  kO,
  lLt,
  Ac,
  DO = g(() => {
    TLe = F(Gx());
    O();
    QM();
    zx();
    qy();
    dLe();
    mLe();
    sA();
    Gi();
    _c();
    il();
    ov();
    bLe();
    bK();
    fe();
    rK();
    ad();
    Yy();
    IO();
    ((lA = "AGENTS.override.md"), (kO = ".worktreeinclude"), (lLt = 16), (Ac = new TextEncoder()));
  });
var DLe = g(() => {
  zx();
  qy();
});
function wK(t) {
  if (t < 1024) return `${t} B`;
  let e = ["KB", "MB", "GB", "TB"],
    r = t / 1024,
    n = 0;
  for (; r >= 1024 && n < e.length - 1; ) ((r /= 1024), (n += 1));
  return `${r.toFixed(1)} ${e[n]}`;
}
