function n2t(t, e) {
  let r = t.gitReadGeneration;
  if (e.includeUntrackedFiles === !1) return p2e(t, e);
  if (e.paths != null) {
    let n = t.queryClient.getQueryCache().find({ queryKey: qK(t, r, "all-paths"), exact: !0 });
    return n != null
      ? n.fetch()
      : t.queryClient.fetchQuery({
          queryKey: qK(t, r, e.paths),
          meta: Ue,
          queryFn: () => m2e(t, e),
          staleTime: Ve,
        });
  }
  return t.queryClient.fetchQuery({
    queryKey: qK(t, r, "all-paths"),
    meta: Ue,
    queryFn: async () => {
      let [n, o] = await Promise.all([p2e(t, e), e.untrackedPathsPromise]);
      return o.success && o.paths.length === 0 ? n : o2t(t, n, o, e);
    },
    staleTime: Ve,
  });
}
function p2e(t, e) {
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "tracked-working-tree-tree", `${t.gitReadGeneration}`, "default"),
    meta: Ue,
    queryFn: async () => {
      let r = await mi(t, !1);
      return r.type === "success" &&
        r.stagedCount === 0 &&
        r.unstagedCount === 0 &&
        (await At(t, "HEAD", e.signal)) != null
        ? "HEAD"
        : GK(t, async (n) => {
            let o = await ud({
              gitRoot: t.root,
              env: n,
              signal: e.signal,
              host: t.host,
              untrackedPathsPromise: Promise.resolve({ success: !0, gitRoot: t.root, paths: [] }),
            });
            return (WK(o, "Failed to stage tracked working tree snapshot"), HK(t, n, e.signal));
          });
    },
    staleTime: Ve,
  });
}
function o2t(t, e, r, n) {
  return GK(t, async (o) => {
    let i = await I(t.root, ["read-tree", e], t.host, { env: o, signal: n.signal });
    if (!i.success)
      throw new Error(i.stderr || i.stdout || "Failed to read tracked working tree snapshot");
    let s = await ud({
      gitRoot: t.root,
      env: o,
      fallback: "full-scan",
      includeTrackedChanges: !1,
      paths: n.paths,
      signal: n.signal,
      host: t.host,
      untrackedPathsPromise: Promise.resolve(r),
    });
    return (WK(s, "Failed to add untracked working tree files"), HK(t, o, n.signal));
  });
}
async function m2e(t, e) {
  return GK(t, async (r) => {
    let n = await ud({
      gitRoot: t.root,
      env: r,
      fallback: "full-scan",
      paths: e.paths,
      signal: e.signal,
      host: t.host,
      untrackedPathsPromise: e.untrackedPathsPromise,
    });
    return (WK(n, "Failed to stage working tree snapshot"), HK(t, r, e.signal));
  });
}
async function GK(t, e) {
  let r = await ol(t);
  if (r == null) throw new Error("Failed to resolve git index path");
  return cv(r, e, t.host);
}
function WK(t, e) {
  if (!t.success) throw new Error(t.stderr || t.stdout || e);
}
function qK(t, e, r) {
  return ne(t.root, t.host, "working-tree-tree", `${e}`, "full-scan", r);
}
async function HK(t, e, r) {
  let n = await I(t.root, ["write-tree"], t.host, { env: e, signal: r }),
    o = n.success ? n.stdout.trim() : null;
  if (!o) throw new Error("Failed to write temporary index tree snapshot");
  if (!Uo(o)) throw new Error(`Unexpected tree SHA: ${o}`);
  return o;
}
var HO = g(() => {
  O();
  Zy();
  cd();
  ps();
  ov();
  je();
  td();
  fe();
  qO();
  GO();
});
async function h2e(t, e, r, n, o) {
  let i = await t.getStableMetadata(e, r);
  if (!i)
    throw (
      Ec().warning("[worktree-snapshot] not-a-repository", { safe: { reason: n }, sensitive: {} }),
      new Error(`Not in a git repository: ${e}`)
    );
  let s = t.getWorktreeRepositoryForRoot(i.root, r),
    a = await eo(i.root),
    l = vA(a);
  Ec().info("[worktree-snapshot] start", {
    safe: { worktreeId: a, reason: n, hasHostConfig: r != null },
    sensitive: {},
  });
  let c = await I(e, ["ls-files", "--stage", "--others", "--exclude-standard", "-z"], r, {
    signal: o,
    trim: !1,
  });
  if (!c.success)
    throw new Error("Could not inspect nested repositories before saving the worktree.");
  let u = await r.platformPath();
  if (
    (
      await Promise.all(
        c.stdout
          .split("\0")
          .filter((S) => S.startsWith("160000 ") || S.endsWith("/"))
          .map(async (S) => {
            let E = S.startsWith("160000 ") ? S.slice(S.indexOf("	") + 1) : S;
            try {
              return (await r.stat(u.join(e, E, ".git"), { bypassCache: !0 }), !0);
            } catch (T) {
              if (bt(T)) return !1;
              throw T;
            }
          }),
      )
    ).some((S) => S)
  )
    throw new pd();
  let m = to(s, o).then((S) => _O(s.root, r, { configOverrides: S, signal: o })),
    f = await dd(s, { fresh: !0, signal: o, untrackedPathsPromise: m }),
    h = await At(s, "HEAD", o),
    v = h;
  if ((h == null ? null : (await al(s, h, o)).trim()) !== f) {
    let S = await lv(i.root, f, r, {
      parentSha: h ?? void 0,
      message: s2t(n),
      configOverrides: ["-c", "user.name=Codex", "-c", "user.email=noreply@openai.com"],
      coAuthor: "",
      signal: o,
    });
    if (!S.success) throw new Error("Failed to create synthetic commit");
    v = S.commitSha.trim();
  }
  if (!v) throw new Error("Failed to compute snapshot commit");
  let w = { env: { GIT_TERMINAL_PROMPT: "0" }, signal: o },
    _ = await I(i.root, ["update-ref", "--no-deref", l, v], r, w);
  if (_.success && u.sep === "\\" && u.relative(e, i.root) === "") {
    let S = jK(e);
    if (S !== i.root) {
      let E = vA(await eo(S));
      _ = await I(i.root, ["symbolic-ref", E, l], r, w);
    }
  }
  if (!_.success)
    throw (
      Ec().warning("[worktree-snapshot] update-ref-failed", {
        safe: { worktreeId: a, reason: n, code: _.code },
        sensitive: { stderr: _.stderr },
      }),
      new Error("Failed to update ref")
    );
  return (
    Ec().info("[worktree-snapshot] success", {
      safe: { worktreeId: a, reason: n },
      sensitive: { snapshotRef: l, commitSha: v },
    }),
    { snapshotRef: l, worktreeId: a, repoRoot: i.root, commonDir: i.commonDir, commitSha: v }
  );
}
async function jO(t, e, r, n, o) {
  let i = (
    await Promise.all(
      e.map(async (u) => {
        try {
          return (await n.stat(u)).isDirectory() ? u : null;
        } catch {
          return null;
        }
      }),
    )
  ).filter((u) => u != null);
  if (i.length === 0) throw new Error("No candidate workspace roots exist on disk");
  let s = (
    await Promise.all(
      i.map(async (u) => {
        try {
          return await t.getStableMetadata(u, n);
        } catch {
          return null;
        }
      }),
    )
  ).filter((u) => !!u);
  if (s.length === 0) throw new Error("No candidate workspace roots are valid git repositories");
  let a = await y2e(
      r,
      s.map((u) => u.root),
      n,
      o,
    ),
    l = vA(a),
    c = await Promise.all(
      s.map(async (u) => {
        let p = t.getWorktreeRepositoryForRoot(u.root, n),
          m = await At(p, l, o, { fresh: !0 });
        return { metadata: u, commitSha: m };
      }),
    );
  for (let { metadata: u, commitSha: p } of c)
    if (p != null)
      return {
        snapshotRef: l,
        worktreeId: a,
        repoRoot: u.root,
        commonDir: u.commonDir,
        exists: !0,
        commitSha: p,
      };
  return { snapshotRef: l, worktreeId: a, exists: !1, commitSha: null };
}
async function g2e(t, e, r, n, o, i) {
  let s = await y2e(e, [t], n, o),
    a = i ?? vA(s);
  if (
    (Ec().info("[worktree-restore] start", {
      safe: { worktreeId: s, snapshotRef: a, hasHostConfig: n != null },
      sensitive: {},
    }),
    i == null && (await sv(n, e)))
  ) {
    let c = await I(e, ["rev-parse", "HEAD", a], n, { signal: o }),
      u = c.stdout.trim().split(`
`);
    if (c.success && u.length === 2 && u[0] === u[1]) return (await f2e(e, r, n, o), !0);
  }
  let l = await I(t, ["worktree", "add", "--detach", e, a], n, {
    env: { GIT_TERMINAL_PROMPT: "0" },
    signal: o,
  });
  if (!l.success)
    throw (
      Ec().warning("[worktree-restore] add-failed", {
        safe: { worktreeId: s, code: l.code },
        sensitive: { stderr: l.stderr, stdout: l.stdout },
      }),
      new Error(l.stderr || l.stdout || "Failed to restore worktree")
    );
  try {
    await f2e(e, r, n, o);
  } catch (c) {
    try {
      let u = await I(t, ["worktree", "remove", "--force", e], n, {
        env: { GIT_TERMINAL_PROMPT: "0" },
      });
      u.success ||
        Ec().warning("[worktree-restore] cleanup-failed", {
          safe: { worktreeId: s },
          sensitive: { stderr: u.stderr, stdout: u.stdout },
        });
    } catch (u) {
      Ec().warning("[worktree-restore] cleanup-failed", {
        safe: { worktreeId: s },
        sensitive: { cleanupError: u },
      });
    }
    throw c;
  }
  return (
    Ec().info("[worktree-restore] success", {
      safe: { worktreeId: s },
      sensitive: { snapshotRef: a },
    }),
    !0
  );
}
async function f2e(t, e, r, n) {
  let o = await r.platformPath(),
    i = o.relative(t, e);
  if (i === ".." || i.startsWith(`..${o.sep}`) || o.isAbsolute(i))
    throw new Error(`Invalid restored worktree cwd: ${e}`);
  if (await sv(r, e)) return;
  let s = await I(t, ["sparse-checkout", "add", "--", i], r, {
    env: { GIT_TERMINAL_PROMPT: "0" },
    signal: n,
  });
  if (!s.success || !(await sv(r, e)))
    throw new Error(
      `Failed to materialize restored worktree cwd: ${e}${s.stderr || s.stdout ? `: ${s.stderr || s.stdout}` : ""}`,
    );
}
async function y2e(t, e, r, n) {
  if ((await r.platformFamily()) !== "windows") return eo(t);
  let o = jK(t),
    i = await eo(o);
  if (!r.isLocal) return i;
  let s = jK(await u2e(o));
  if (s === o) return i;
  let a = await eo(s),
    l = vA(a);
  return (
    await Promise.all(e.map((u) => I(u, ["show-ref", "--verify", "--quiet", l], r, { signal: n })))
  ).some((u) => u.success)
    ? a
    : i;
}
function jK(t) {
  return On(gI(t)).replace(/^[a-z]:\//, (e) => e.toUpperCase());
}
function vA(t) {
  return `${i2t}/${t}`;
}
function s2t(t) {
  return `Codex worktree snapshot: ${t}`;
}
var i2t,
  Ec,
  pd,
  bA = g(() => {
    O();
    hr();
    d2e();
    UO();
    ps();
    xc();
    ov();
    xO();
    HO();
    bK();
    fe();
    rd();
    ((i2t = "refs/codex/snapshots"),
      (Ec = Ie("worktree-snapshot")),
      (pd = class extends Error {
        constructor() {
          super(
            "Worktree snapshots cannot preserve initialized submodules or embedded Git repositories. Keep this checkout.",
          );
        }
      }));
  });
function VK(t) {
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "worktree-files"),
    gcTime: be,
    meta: Ue,
    queryFn: () => S2e(t.root, t.host),
    staleTime: be,
  });
}
async function S2e(t, e) {
  let r = await d2t(t, e);
  if (r == null) return v2e(t, e);
  for (let n = 0; n < l2t; n += 1) {
    let o = await b2e(r, e);
    if (o == null) break;
    let i = await c2t(t, e);
    if ((await b2e(r, e)) === o) return i;
  }
  return v2e(t, e);
}
async function c2t(t, e) {
  let [r, n] = await Promise.all([
    I(t, ["ls-files", "--cached", "-z"], e, { trim: !1 }),
    u2t(t, e),
  ]);
  if (!r.success) {
    let o = r.stderr || r.stdout;
    throw new Error(`git ls-files failed${o ? `: ${o}` : ""}`);
  }
  return [...r.stdout.split("\0").filter((o) => o.length > 0), ...n];
}
async function v2e(t, e) {
  let r = await I(t, ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], e, {
    trim: !1,
  });
  if (!r.success) {
    let n = r.stderr || r.stdout;
    throw new Error(`git ls-files failed${n ? `: ${n}` : ""}`);
  }
  return zK(r.stdout);
}
async function u2t(t, e) {
  let r = await I(
    t,
    ["status", "--no-renames", "--porcelain=v1", "-z", "--untracked-files=normal"],
    e,
    { trim: !1, timeoutMs: null },
  );
  if (!r.success) {
    let s = r.stderr || r.stdout;
    throw new Error(`git status failed${s ? `: ${s}` : ""}`);
  }
  let n = zK(r.stdout)
      .filter((s) => s.startsWith("?? "))
      .map((s) => s.slice(3)),
    o = n.filter((s) => s.endsWith("/"));
  if (o.length === 0) return n;
  let i = [];
  for (let s of p2t(o)) {
    let a = await I(t, ["ls-files", "--others", "--exclude-standard", "-z", "--", ...s], e, {
      trim: !1,
      timeoutMs: null,
    });
    if (!a.success) {
      let l = a.stderr || a.stdout;
      throw new Error(`git ls-files failed${l ? `: ${l}` : ""}`);
    }
    i.push(...zK(a.stdout));
  }
  return [...n.filter((s) => !s.endsWith("/")), ...i];
}
async function d2t(t, e) {
  let r = await I(t, ["rev-parse", "--git-path", "index"], e);
  if (!r.success || r.stdout.length === 0) return null;
  let n = await e.platformPath();
  return n.isAbsolute(r.stdout) ? r.stdout : n.resolve(t, r.stdout);
}
async function b2e(t, e) {
  try {
    let r = await e.stat(t, { bypassCache: !0 });
    return [r.size ?? 0, r.mtimeMs, r.ctimeMs, r.ino ?? 0].join(":");
  } catch (r) {
    return typeof r == "object" && r != null && "code" in r && r.code === "ENOENT"
      ? "missing"
      : null;
  }
}
function p2t(t) {
  let e = [],
    r = [],
    n = 0;
  for (let o of t) {
    let i = `:(literal)${o}`,
      s = Qn(i) + 1;
    (r.length > 0 && n + s > a2t && (e.push(r), (r = []), (n = 0)), r.push(i), (n += s));
  }
  return (r.length > 0 && e.push(r), e);
}
function zK(t) {
  return t.split("\0").filter((e) => e.length > 0);
}
var a2t,
  l2t,
  w2e = g(() => {
    Ny();
    je();
    fe();
    ((a2t = 8e3), (l2t = 2));
  });
function KK(t) {
  let e = {};
  for (let r of t.split(/\r?\n/)) {
    let n = r.trim();
    if (!n) continue;
    let o = n.split(/\s+/);
    if (o.length < 3) continue;
    let [i, s, a] = o;
    a === "(push)" && e[i] == null && (e[i] = s);
  }
  return e;
}
var _2e = g(() => {});
async function A2e({ root: t, diff: e, gitManager: r, host: n, signal: o, logger: i }) {
  let s = await ol(r.getWorktreeRepositoryForRoot(t, n));
  return s
    ? cv(s, (a) => x2e(t, e, r, n, o, i, a), n)
    : (i && i.warning("Unable to resolve git index path; applying without temp index"),
      x2e(t, e, r, n, o, i));
}
async function x2e(t, e, r, n, o, i, s) {
  return (
    (await m2t(t, e, n, o, s)).success || (i && i.error("Failed to stage target worktree changes")),
    id({ cwd: t, diff: e, allowBinary: !0, revert: !1, env: s }, r, n, { signal: o })
  );
}
async function m2t(t, e, r, n, o) {
  let i = dK(e);
  if (i.length === 0) return { success: !0, command: "git add", stdout: "", stderr: "" };
  let s = await f2t(t, i, r);
  return s.length === 0
    ? { success: !0, command: "git add", stdout: "", stderr: "" }
    : I(t, ["add", "--", ...s], r, { env: o, signal: n });
}
async function f2t(t, e, r) {
  let n = await r.platformPath(),
    o = [];
  return (
    await Promise.all(
      e.map(async (i) => {
        let s = n.join(t, i);
        try {
          (await r.stat(s), o.push(i));
        } catch {
          return;
        }
      }),
    ),
    o
  );
}
var R2e = g(() => {
  Zy();
  nv();
  fe();
  GO();
});
async function E2e({
  sourceHeadRef: t,
  sourceTreeRef: e,
  destinationRoot: r,
  destinationHeadRef: n,
  gitManager: o,
  host: i,
  signal: s,
}) {
  let a = l_("applyChanges"),
    l = await h2t(r, t, n, i, s);
  if (!l) return { status: "command-error" };
  let c = await ds(r, [l, e], i, {
    binary: !0,
    trim: !1,
    allowedNonZeroExitCodes: [0, 1],
    signal: s,
  });
  if (c.outputLimitExceeded || !c.success) return { status: "command-error", execOutput: Nt(c) };
  let u = c.stdout;
  if (!u) return { status: "success" };
  let p = await A2e({ root: r, diff: u, gitManager: o, host: i, signal: s, logger: a });
  return p.status === "error"
    ? { status: "command-error", execOutput: p.execOutput }
    : p.status === "partial-success"
      ? {
          status: "partial-success",
          appliedPaths: p.appliedPaths,
          skippedPaths: p.skippedPaths,
          conflictedPaths: p.conflictedPaths,
        }
      : { status: "success" };
}
async function h2t(t, e, r, n, o) {
  let i = await I(t, ["merge-base", e, r], n, { allowedNonZeroExitCodes: [1], signal: o });
  if (!i.success || !i.stdout) return null;
  let s = i.stdout.trim();
  return s ? s : null;
}
var C2e = g(() => {
  O();
  hr();
  R2e();
  fe();
  Vm();
});
function zO(t, e, r, { binary: n = !1, hideWhitespace: o = !1 }) {
  let { worktreeRepo: i } = t,
    s = [...(o ? ["--ignore-all-space"] : []), "--full-index", e, r];
  return i.queryClient.fetchQuery({
    queryKey: t.queryKey("review-blob-diff", ...(n ? ["binary"] : []), s),
    gcTime: be,
    meta: Ue,
    queryFn: () => t.gitDiff(s, { allowedNonZeroExitCodes: [0, 1], binary: n, trim: !1 }),
    staleTime: be,
  });
}
function T2e(t) {
  if (t.includes("GIT binary patch") || t.includes("Binary files ")) return null;
  let e = 0,
    r = 0,
    n = !1;
  for (let o of t.split(`
`))
    o.startsWith("diff --git ")
      ? (n = !1)
      : o.startsWith("@@")
        ? (n = !0)
        : n && o.startsWith("+")
          ? (e += 1)
          : n && o.startsWith("-") && (r += 1);
  return { additions: e, deletions: r };
}
function P2e(t, e, r) {
  let n = Xs(`a/${e}`),
    o = Xs(`b/${r}`),
    i = `rename from ${Xs(e)}
rename to ${Xs(r)}
`;
  return t.length === 0
    ? `diff --git ${n} ${o}
similarity index 100%
${i}`
    : t
        .replace(
          /^diff --git .*$/m,
          (s) => `${s}
similarity index 0%
${i.trimEnd()}`,
        )
        .replace(/^--- .*$/m, `--- ${n}`)
        .replace(/^\+\+\+ .*$/m, `+++ ${o}`)
        .replace(/^diff --git .*$/m, `diff --git ${n} ${o}`);
}
function Xs(t) {
  return /[\\"\n\r\t]/.test(t)
    ? `"${t
        .replaceAll("\\", "\\\\")
        .replaceAll('"', '\\"')
        .replaceAll(
          `
`,
          "\\n",
        )
        .replaceAll("\r", "\\r")
        .replaceAll("	", "\\t")}"`
    : t;
}
var SA = g(() => {
  je();
});
async function VO(t, e) {
  try {
    return await t.stat(e, { bypassCache: !0, followSymlinks: !1 });
  } catch (r) {
    if (bt(r, e)) return null;
    throw r;
  }
}
var XK = g(() => {
  O();
});
async function I2e(t, e) {
  let r = new Map();
  if (e.length === 0) return r;
  let n = b2t(e),
    { worktreeRepo: o } = t,
    i = await o.host.platformPath(),
    s = !wA.has(o),
    a = null;
  try {
    for (let l of n) {
      if (!s || l.length === 1) {
        let u = await YK(t, l);
        KO(r, u);
        continue;
      }
      if (a == null)
        try {
          a = await tl(o.host, "codex-review-empty-", t.signal);
        } catch {
          s = !1;
          let u = await YK(t, l);
          KO(r, u);
          continue;
        }
      let c = await t.gitDiff(
        [
          "--no-index",
          "--raw",
          "--numstat",
          "-z",
          "--",
          a,
          o.root,
          ...l.map((u) => ":(literal)" + u),
        ],
        { allowedNonZeroExitCodes: [0, 1], trim: !1 },
      );
      if (!c.success) {
        (JK(c) && wA.add(o), (s = !1));
        let u = await YK(t, l);
        KO(r, u);
        continue;
      }
      KO(r, S2t(c.stdout, o.root, l, i));
    }
  } finally {
    a != null && (await o.host.remove(a, { recursive: !0, force: !0 }));
  }
  return r;
}
function KO(t, e) {
  for (let [r, n] of e) t.set(r, n);
}
async function YK(t, e) {
  let r = new Map();
  return (
    await x2t(e, async (n) => {
      r.set(n, await w2t(t, n));
    }),
    r
  );
}
function b2t(t) {
  let e = [],
    r = [],
    n = 0;
  for (let o of t) {
    let i = 10 + Math.max(o.length, Qn(o)) + 1;
    (r.length > 0 && (r.length >= g2t || n + i > y2t) && (e.push(r), (r = []), (n = 0)),
      r.push(o),
      (n += i));
  }
  return (r.length > 0 && e.push(r), e);
}
function JK(t) {
  return (
    t.code === 129 &&
    (t.stderr.includes("Limiting comparison with pathspecs") ||
      t.stderr.includes("usage: git diff --no-index"))
  );
}
function S2t(t, e, r, n) {
  let o = new Set(r),
    i = new Map(r.map((p) => [n.normalize(n.join(e, p)), p])),
    s = new Map(),
    a = (p) => {
      if (p == null) throw new Error("Missing batched untracked Git path");
      let m = n.normalize(n.isAbsolute(p) ? p : n.resolve(e, p)),
        f = i.get(m) ?? (n.sep === "\\" ? ro(n, e, e, p) : null);
      if (f == null || !o.has(f)) throw new Error("Unexpected batched untracked Git path");
      let h = s.get(f);
      return (h == null && ((h = {}), s.set(f, h)), h);
    },
    l = t.split("\0"),
    c = 0;
  for (; c < l.length; ) {
    if (l[c] === "") {
      if (c === l.length - 1) break;
      throw new Error("Failed to parse batched untracked Git metadata");
    }
    let p = /^:\d{6} (\d{6}) [0-9a-f]+ [0-9a-f]+ A$/.exec(l[c])?.[1];
    if (p != null) {
      let h = a(l[c + 1]);
      if (h.mode != null) throw new Error("Duplicate batched untracked Git mode");
      ((h.mode = p), (c += 2));
      continue;
    }
    let m = /^(-|\d+)\t(-|\d+)\t$/.exec(l[c]);
    if (m?.[1] == null || m[2] == null || l[c + 1] == null)
      throw new Error("Failed to parse batched untracked Git stats");
    let f = a(l[c + 2]);
    if (f.stats != null) throw new Error("Duplicate batched untracked Git stats");
    ((f.stats = {
      additions: m[1] === "-" ? null : Number.parseInt(m[1], 10),
      deletions: m[2] === "-" ? null : Number.parseInt(m[2], 10),
    }),
      (c += 3));
  }
  if (c !== l.length - 1) throw new Error("Failed to parse batched untracked Git metadata");
  let u = new Map();
  for (let p of r) {
    let m = s.get(p);
    if (m?.mode == null || m.stats == null)
      throw new Error("Missing batched untracked Git metadata");
    u.set(p, { ...m.stats, mode: m.mode });
  }
  return u;
}
async function w2t(t, e) {
  let r = await t.gitDiff(["--no-index", "--raw", "--numstat", "-z", "--", "/dev/null", e], {
    allowedNonZeroExitCodes: [0, 1],
    trim: !1,
  });
  if (!r.success) throw new Error("Failed to read untracked Git metadata");
  return _2t(r.stdout);
}
function _2t(t) {
  let e = t.split("\0"),
    r = e.map((o) => /^:\d{6} (\d{6}) [0-9a-f]+ [0-9a-f]+ A$/.exec(o)?.[1]).find((o) => o != null),
    n = e.map((o) => /^(-|\d+)\t(-|\d+)\t/s.exec(o)).find((o) => o != null);
  if (r == null || n?.[1] == null || n[2] == null)
    throw new Error("Failed to parse untracked Git metadata");
  return {
    additions: n[1] === "-" ? null : Number.parseInt(n[1], 10),
    deletions: n[2] === "-" ? null : Number.parseInt(n[2], 10),
    mode: r,
  };
}
async function x2t(t, e) {
  let r = 0,
    n = !1,
    o = null,
    i = async () => {
      for (; !n; ) {
        let s = t[r];
        if (((r += 1), s == null)) return;
        try {
          await e(s);
        } catch (a) {
          n ||
            ((n = !0),
            (o =
              a instanceof Error
                ? a
                : new Error("Review no-index metadata worker failed", { cause: a })));
        }
      }
    };
  if ((await Promise.all(Array.from({ length: Math.min(v2t, t.length) }, () => i())), o != null))
    throw new Error("Review no-index metadata worker failed", { cause: o });
}
var g2t,
  y2t,
  v2t,
  wA,
  QK = g(() => {
    Gy();
    Ny();
    od();
    ((g2t = 256), (y2t = 16e3), (v2t = 8), (wA = new WeakSet()));
  });
async function M2e(t, e, r) {
  let { worktreeRepo: n, signal: o } = t,
    { host: i } = n,
    s = e.dirname(r),
    a = e.basename(r),
    l = await tl(i, "codex-review-link-", o),
    c = { trim: !1, maxOutputBytes: 64e3, signal: o, env: { LC_ALL: "C" } };
  try {
    if ((await i.writeFile(e.join(l, a), new Uint8Array(), { signal: o }), !wA.has(n))) {
      let y = await t.gitDiff(
        ["--no-index", ...k2e, "--", l, s, ":(literal)" + a, ":(exclude,glob)*/*"],
        { ...c, allowedNonZeroExitCodes: [1] },
      );
      if (!JK(y)) return D2e(y);
      wA.add(n);
    }
    let u = await t.git(["hash-object", "--stdin"], { stdin: "" });
    if (!u.success || !/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(u.stdout))
      throw new Error("Failed to identify the repository object format");
    let p = e.join(l, ".git"),
      m = {
        ...c.env,
        GIT_DIR: p,
        GIT_COMMON_DIR: p,
        GIT_INDEX_FILE: e.join(p, "index"),
        GIT_OBJECT_DIRECTORY: e.join(p, "objects"),
        GIT_ALTERNATE_OBJECT_DIRECTORIES: "",
        GIT_WORK_TREE: l,
        GIT_CONFIG_GLOBAL: e.join(p, "no-global-config"),
        GIT_CONFIG_NOSYSTEM: "1",
        GIT_CONFIG_COUNT: "0",
        GIT_CONFIG_PARAMETERS: "",
        GIT_ATTR_NOSYSTEM: "1",
        GIT_LITERAL_PATHSPECS: "1",
        GIT_DEFAULT_HASH: u.stdout.length === 64 ? "sha256" : "sha1",
      };
    if (!(await I(l, ["init", "--quiet", "--template="], i, { ...c, env: m })).success)
      throw new Error("Failed to initialize the temporary symlink comparison");
    if (!(await I(l, ["add", "--force", "--", a], i, { ...c, env: m })).success)
      throw new Error("Failed to index the temporary symlink placeholder");
    let v = await I(s, ["diff-files", ...k2e, "--", a], i, {
      ...c,
      env: { ...m, GIT_WORK_TREE: s },
    });
    return D2e(v);
  } finally {
    await i.remove(l, { recursive: !0, force: !0 });
  }
}
function D2e(t) {
  let e =
    /^new file mode 120000\nindex 0+\.\.([0-9a-f]{40}|[0-9a-f]{64})\n--- [^\n]*\n\+\+\+ [^\n]*\n@@ -0,0 \+1(?:,\d+)? @@[^\n]*\n([\s\S]*)/m.exec(
      t.stdout,
    );
  if (!t.success || e == null) throw new Error("Failed to read working-tree symlink from Git");
  let r = e[2].split(`
`);
  if (r.pop() !== "") throw new Error("Incomplete working-tree symlink patch");
  let n = r.at(-1) === "\\ No newline at end of file";
  if ((n && r.pop(), r.length === 0 || r.some((o) => !o.startsWith("+"))))
    throw new Error("Invalid working-tree symlink patch");
  return {
    oid: e[1],
    target:
      r.map((o) => o.slice(1)).join(`
`) +
      (n
        ? ""
        : `
`),
  };
}
var k2e,
  O2e = g(() => {
    Gy();
    QK();
    fe();
    k2e = [
      "--patch",
      "--full-index",
      "--text",
      "--no-ext-diff",
      "--no-textconv",
      "--no-renames",
      "--no-color",
      "--diff-filter=T",
    ];
  });
function ZO(t, e) {
  let { worktreeRepo: r } = t;
  return r.queryClient.fetchQuery({
    queryKey: t.queryKey("review-working-tree-symlink", e),
    gcTime: be,
    meta: Ue,
    queryFn: () =>
      t.read(async () => {
        let { host: n } = r,
          [o, i, s] = await Promise.all([n.platformPath(), n.platformFamily(), n.platformOs()]),
          a = o.join(r.root, e);
        if (i === "windows") return M2e(t, o, a);
        let l = n.isLocal && s === "macos" ? "/usr/bin/readlink" : "readlink",
          c = await n.spawn({
            args: [l, "-n", a],
            cwd: r.root,
            outputBytesCap: 64e3,
            signal: t.signal,
            timeoutMs: 1e4,
          }),
          [u, p] = await Promise.all([c.wait(), Hl(c.stdout), Hl(c.stderr)]);
        if (u.code !== 0) throw new Error("Failed to read working-tree symlink");
        let m = await t.git(["hash-object", "--stdin"], { stdin: p });
        if (!m.success) throw new Error("Failed to hash working-tree symlink");
        return {
          oid: m.stdout.trim(),
          target: new TextDecoder("utf-8", { ignoreBOM: !0 }).decode(p),
        };
      }),
    staleTime: be,
  });
}
var e5 = g(() => {
  O();
  O2e();
  je();
});
function uv(t, e, { binary: r = !1, signal: n } = {}) {
  let { worktreeRepo: o } = t;
  return hO(
    o.queryClient,
    {
      queryKey: t.queryKey("review-untracked-diff", ...(r ? ["binary"] : []), e),
      gcTime: be,
      meta: Ue,
      queryFn: (i) =>
        t.read(async () => {
          let a = (await o.host.platformPath()).join(o.root, e),
            l = await VO(o.host, a);
          if ((i.throwIfAborted(), l == null))
            return { type: "success", unifiedDiff: "", unifiedDiffBytes: 0 };
          if (l.isSymbolicLink()) {
            let { oid: u, target: p } = await ZO(t, e),
              m = Xs(`a/${e}`),
              f = Xs(`b/${e}`),
              h = p.endsWith(`
`),
              v = (h ? p.slice(0, -1) : p).split(`
`),
              y = v.length === 1 ? "1" : `1,${v.length}`,
              w = v
                .map(
                  (E) => `+${E}
`,
                )
                .join(""),
              _ = h
                ? ""
                : `\\ No newline at end of file
`,
              S = `diff --git ${m} ${f}
new file mode 120000
index 0000000..${u.slice(0, 7)}
--- /dev/null
+++ ${f}
@@ -0,0 +${y} @@
${w}${_}`;
            return {
              type: "success",
              unifiedDiff: S,
              unifiedDiffBytes: Buffer.byteLength(S, "utf8"),
            };
          }
          if (l.isDirectory()) {
            let u = await I(a, ["rev-parse", "--verify", "HEAD^{commit}"], o.host, {
              signal: AbortSignal.any([t.signal, i]),
            });
            if (!u.success) return { type: "error", error: { type: "unknown" } };
            let p = u.stdout.trim(),
              m = Xs(`a/${e}`),
              f = Xs(`b/${e}`),
              h = `diff --git ${m} ${f}
new file mode 160000
index 0000000..${p.slice(0, 7)}
--- /dev/null
+++ ${f}
@@ -0,0 +1 @@
+Subproject commit ${p}
`;
            return {
              type: "success",
              unifiedDiff: h,
              unifiedDiffBytes: Buffer.byteLength(h, "utf8"),
            };
          }
          let c = await t.gitDiff(["--no-index", "--", "/dev/null", e], {
            allowedNonZeroExitCodes: [0, 1],
            binary: r,
            signal: i,
            trim: !1,
          });
          return c.outputLimitExceeded || !c.success
            ? { type: "error", error: qi(c) }
            : { type: "success", unifiedDiff: c.stdout, unifiedDiffBytes: c.stdoutBytes };
        }),
      staleTime: be,
    },
    n,
  );
}
var XO = g(() => {
  SA();
  XK();
  e5();
  jm();
  je();
  fe();
});
function _A(t) {
  if (t.startsWith("diff --cc ")) return N2e(t.slice(10));
  if (t.startsWith("diff --combined ")) return N2e(t.slice(16));
  if (!t.startsWith("diff --git ")) return null;
  let e = t.slice(11);
  if (e.startsWith('"')) {
    let o = jI(e, 0);
    return o == null || e[o.nextIndex] !== " " ? null : L2e(o.path, e.slice(o.nextIndex + 1));
  }
  let r = e.lastIndexOf(' "b/'),
    n = r >= 0 ? r : e.lastIndexOf(" b/");
  return n < 0 ? null : L2e(e.slice(0, n), e.slice(n + 1));
}
function N2e(t) {
  if (!t.startsWith('"')) return { oldPath: t, newPath: t };
  let e = jI(t, 0);
  return e == null || e.nextIndex !== t.length ? null : { oldPath: e.path, newPath: e.path };
}
function L2e(t, e) {
  let r = e.startsWith('"') ? jI(e, 0)?.path : e;
  return !t.startsWith("a/") || !r?.startsWith("b/")
    ? null
    : { oldPath: t.slice(2), newPath: r.slice(2) };
}
var t5 = g(() => {
  O();
});
async function B2e(t, e) {
  return (await r5(t, e)).length > 0;
}
function r5(t, e) {
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "merge-conflict-status"),
    gcTime: be,
    meta: Ue,
    queryFn: async () => {
      let r = await I(t.root, ["ls-files", "-u", "-z"], t.host, { signal: e });
      if (!r.success) return [];
      let n = new Set();
      for (let o of r.stdout.split("\0")) {
        let i = o.indexOf("	");
        i !== -1 && n.add(o.slice(i + 1));
      }
      return [...n];
    },
    staleTime: be,
  });
}
var n5 = g(() => {
  je();
  fe();
});
function F2e(t, e, r) {
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "commit-parent-sha", e),
    queryFn: async () => {
      let n = await I(t.root, ["rev-parse", "--verify", "--quiet", `${e}^`], t.host, {
        allowedNonZeroExitCodes: [1, 128],
        signal: r,
      });
      return n.success ? n.stdout.trim() : null;
    },
    staleTime: 1 / 0,
  });
}
var $2e = g(() => {
  je();
  fe();
});
async function cl(t, e, r) {
  let n = await At(t, "HEAD", e, { staleTime: r });
  return U2e(n);
}
async function md(t, e) {
  let r = await I(t.root, ["rev-parse", "--verify", "--quiet", "HEAD"], t.host, {
    allowedNonZeroExitCodes: [1, 128],
    signal: e,
  });
  return U2e(r.success ? r.stdout.trim() : null);
}
function U2e(t) {
  if (t && !Uo(t) && !/^[0-9a-f]{64}$/i.test(t)) throw new Error(`Unexpected HEAD SHA: ${t}`);
  return t ? t : null;
}
var fd = g(() => {
  O();
  ps();
  td();
  fe();
});
async function YO({ baseBranch: t, commitSha: e, signal: r, source: n, worktreeRepo: o }) {
  switch (n) {
    case "branch": {
      if (o == null) return { type: "error", failureReason: "review_comparison" };
      let i = t;
      if (i == null) {
        let a = await gn(o);
        if (a == null) return { type: "expected", reason: "default_branch_unavailable" };
        ((i = a.branch), i.includes("/") || (i = `${a.remote}/${i}`));
      }
      if (Ds(o.host.id) != null && (await At(o, i, r)) == null) {
        let a = i,
          l = await Er(
            o.queryClient,
            {
              queryKey: ne(o.root, o.host, "review-base-ref", a),
              meta: Vy,
              queryFn: (c) => Jy(o, a, c),
              staleTime: Ve,
            },
            r,
          );
        if (l == null) return { type: "expected", reason: "merge_base_unavailable" };
        i = l.ref;
      }
      let s = await ll(o, i);
      return s == null
        ? { type: "expected", reason: "merge_base_unavailable" }
        : { type: "success", args: [s] };
    }
    case "commit":
      return e == null || o == null
        ? { type: "error", failureReason: "review_comparison" }
        : { type: "success", args: [(await F2e(o, e, r)) ?? q2e, e] };
    case "staged":
      return { type: "success", args: ["--cached"] };
    case "uncommitted":
      return o == null
        ? { type: "error", failureReason: "review_comparison" }
        : { type: "success", args: [(await md(o, r)) == null ? q2e : "HEAD"] };
    case "unstaged":
      return { type: "success", args: [] };
  }
}
var q2e,
  o5 = g(() => {
    O();
    SO();
    $2e();
    _c();
    fd();
    dA();
    ps();
    je();
    q2e = "4b825dc642cb6eb9a060e54bf8d69288fbee4904";
  });
async function JO({
  host: t,
  baseBranch: e,
  commitSha: r,
  cwd: n,
  gitManager: o,
  includeUntrackedFiles: i,
  maxUntrackedFiles: s,
  paths: a,
  source: l,
}) {
  let c = await o.getWorktreeRepository(n, t);
  return c == null
    ? { type: "error", failureReason: "repository_unavailable" }
    : hd({
        baseBranch: e,
        commitSha: r,
        includeUntrackedFiles: i,
        maxUntrackedFiles: s,
        paths: a,
        reviewSnapshot: c.reviewSnapshot,
        source: l,
      });
}
async function hd({
  baseBranch: t,
  commitSha: e,
  includeUnmergedPaths: r = !0,
  includeUntrackedFiles: n,
  maxUntrackedFiles: o,
  paths: i,
  reviewSnapshot: s,
  source: a,
}) {
  let { worktreeRepo: l } = s,
    c = a === "branch" || a === "uncommitted" || a === "unstaged",
    u = () => YO({ baseBranch: t, commitSha: e, signal: s.signal, source: a, worktreeRepo: l }),
    p = s.queryKey("review-uncommitted-comparison", `${l.gitReadGeneration}`),
    [m, f, h] = await Promise.all([
      a === "uncommitted"
        ? Ui(
            () =>
              l.queryClient.fetchQuery({
                queryKey: p,
                gcTime: be,
                meta: Ue,
                queryFn: () => s.read(u),
                staleTime: 0,
              }),
            () => l.queryClient.getQueryCache().find({ queryKey: p, exact: !0 })?.promise,
          )
        : u(),
      c && n ? qn(l, i, s) : Promise.resolve(A2t(l.root)),
      (a === "uncommitted" || a === "unstaged") && r ? r5(l, s.signal) : Promise.resolve(null),
    ]);
  if (m.type !== "success") return m;
  if (!f.success) return { type: "error", failureReason: f.failureReason ?? "untracked_paths" };
  let v = o != null && f.paths.length > o ? { ...f, paths: [] } : f;
  return {
    type: "success",
    diffArgs: m.args,
    gitRoot: l.root,
    reviewSnapshot: s,
    unmergedPaths:
      h == null
        ? { type: "not-scanned" }
        : { type: "scanned", pathSet: new Set(i == null ? h : h.filter((y) => i.includes(y))) },
    untrackedPaths: v,
    untrackedPathSet: new Set(v.paths),
  };
}
function A2t(t) {
  return { success: !0, gitRoot: t, paths: [] };
}
var xA = g(() => {
  O();
  n5();
  o5();
  Ks();
  je();
  Oy();
});
async function QO(
  t,
  e,
  r,
  {
    baseBranch: n,
    binary: o = !1,
    commitSha: i,
    hideWhitespace: s = !1,
    preserveTypeChangeSections: a = !1,
  } = {},
) {
  let { worktreeRepo: l } = t,
    { root: c } = l,
    u = await l.host.platformPath(),
    p = r.map((T) => ({
      ...T,
      path: ro(u, c, c, T.path),
      previousPath: T.previousPath == null ? null : ro(u, c, c, T.previousPath),
      requestPath: T.path,
    })),
    m = new Set(a ? p.filter((T) => T.changeKind === "type-changed").map((T) => T.path) : []),
    f = [
      ...new Set(p.flatMap((T) => (T.previousPath == null ? [T.path] : [T.previousPath, T.path]))),
    ],
    h = p.some((T) => T.changeKind === "untracked" || T.previousPath != null),
    v = await hd({
      baseBranch: n,
      commitSha: i,
      includeUnmergedPaths: !1,
      includeUntrackedFiles: h,
      paths: f,
      reviewSnapshot: t,
      source: e,
    });
  if (v.type !== "success")
    return {
      source: e,
      diffs: Object.fromEntries(p.map((T) => [T.requestPath, gd({ type: "unknown" })])),
    };
  let y = f.filter((T) => v.untrackedPathSet.has(T)),
    w = f.filter((T) => !v.untrackedPathSet.has(T)),
    [_, S] = await Promise.all([
      C2t({
        binary: o,
        diffArgs: v.diffArgs,
        hideWhitespace: s,
        paths: w,
        reviewSnapshot: t,
        typeChangePaths: m,
      }),
      R2t({ binary: o, paths: y, reviewSnapshot: t }),
    ]),
    E = new Map([..._, ...S]);
  if (e === "branch" || e === "uncommitted" || e === "unstaged") {
    let [T] = v.diffArgs;
    (e === "unstaged" || T != null) &&
      (await Promise.all(
        p.map(async (P) => {
          if (P.previousPath == null || m.has(P.path)) return;
          let M = E.get(P.path);
          if (
            M?.type === "success" &&
            typeof M.diff == "string" &&
            E2t(M.diff, P.previousPath, P.path)
          )
            return;
          let L = await zO(
            t,
            e === "unstaged" ? `:${P.previousPath}` : `${T}:${P.previousPath}`,
            P.path,
            { binary: o, hideWhitespace: s },
          );
          if (L.outputLimitExceeded || !L.success) {
            E.set(P.path, gd(qi(L)));
            return;
          }
          let V = P2e(L.stdout, P.previousPath, P.path);
          E.set(P.path, { type: "success", diff: V, diffBytes: Buffer.byteLength(V, "utf8") });
        }),
      ));
  }
  return t.read(async () => ({
    source: e,
    diffs: Object.fromEntries(
      p.map((T) => [
        T.requestPath,
        m.has(T.path) && T.previousPath != null
          ? gd({ type: "unknown" })
          : (E.get(T.path) ?? gd({ type: "unknown" })),
      ]),
    ),
  }));
}
async function R2t({ binary: t, paths: e, reviewSnapshot: r }) {
  let n = new Map(),
    o = 0,
    i = async () => {
      for (;;) {
        let s = e[o];
        if (((o += 1), s == null)) return;
        let a = await uv(r, s, { binary: t });
        n.set(
          s,
          a.type === "error"
            ? gd(a.error)
            : {
                type: "success",
                diff: a.unifiedDiff,
                diffBytes: a.unifiedDiffBytes ?? Buffer.byteLength(a.unifiedDiff, "utf8"),
              },
        );
      }
    };
  return (await Promise.all(Array.from({ length: Math.min(8, e.length) }, () => i())), n);
}
function E2t(t, e, r) {
  let n = /^diff --(?:git|cc|combined) .*$/m.exec(t)?.[0],
    o = n == null ? null : _A(n);
  return o?.oldPath === e && o.newPath === r;
}
async function C2t({
  binary: t,
  diffArgs: e,
  hideWhitespace: r,
  paths: n,
  reviewSnapshot: o,
  typeChangePaths: i,
}) {
  if (n.length === 0) return new Map();
  let s = await T2t(e, t, r, n, o);
  if (s.outputLimitExceeded || !s.success) {
    let l = gd(qi(s));
    return new Map(n.map((c) => [c, l]));
  }
  let a = P2t(s.stdout, i);
  if (!r) return a;
  for (let l of n) a.has(l) || a.set(l, { type: "success", diff: "", diffBytes: 0 });
  return a;
}
function T2t(t, e, r, n, o) {
  let i = [
    ...t,
    ...(r ? ["--ignore-all-space"] : []),
    "--full-index",
    "--find-renames",
    "--",
    ...n.map((s) => `:(literal)${s}`),
  ];
  return o.worktreeRepo.queryClient.fetchQuery({
    queryKey: o.queryKey("review-diffs", [...(e ? ["--binary"] : []), ...i]),
    gcTime: be,
    meta: Ue,
    queryFn: () =>
      o.gitDiff(i, {
        allowedNonZeroExitCodes: [0, 1],
        env: { GIT_LITERAL_PATHSPECS: "0" },
        binary: e,
        trim: !1,
      }),
    staleTime: be,
  });
}
function G2e(t, e) {
  return { source: t, diffs: Object.fromEntries(e.map((r) => [r.path, gd({ type: "unknown" })])) };
}
function P2t(t, e) {
  let r = new Map(),
    n = new Map([...e].map((i) => [i, []])),
    o = Array.from(t.matchAll(/^diff --(?:git|cc|combined) .*$/gm));
  for (let [i, s] of o.entries()) {
    let a = s.index ?? 0,
      l = i + 1 < o.length ? (o[i + 1]?.index ?? t.length) : t.length,
      c = t.slice(a, l),
      u = c.search(/^(?:@@|GIT binary patch|Binary files )/m),
      p = u === -1 ? c : c.slice(0, u),
      m = /^diff --git a\/(.*) b\/\1$/.exec(s[0])?.[1],
      f = /\n(rename|copy) from ([^"\n]+)\n\1 to ([^"\n]+)(?:\n|$)/.exec(p),
      h;
    if (
      (f?.[2] != null && f[3] != null
        ? (h = { oldPath: f[2], newPath: f[3] })
        : m != null && !/^(?:rename|copy) (?:from|to) /m.test(p)
          ? (h = { oldPath: m, newPath: m })
          : (h = _A(s[0])),
      h == null)
    )
      continue;
    let v = { type: "success", diff: c, diffBytes: Qn(c) };
    (r.set(h.oldPath, v),
      r.set(h.newPath, v),
      h.oldPath === h.newPath
        ? n.get(h.newPath)?.push(c)
        : (n.has(h.oldPath) && n.set(h.oldPath, null), n.has(h.newPath) && n.set(h.newPath, null)));
  }
  for (let [i, s] of n) {
    if (s == null || s.length === 0) {
      r.set(i, gd({ type: "unknown" }));
      continue;
    }
    let a = s.join("");
    r.set(i, { type: "success", diff: a, diffBytes: Qn(a) });
  }
  return r;
}
function gd(t) {
  return { type: "error", error: t };
}
var s5 = g(() => {
  Ny();
  SA();
  XO();
  Sc();
  jm();
  je();
  od();
  t5();
  xA();
});
async function k2t(t, e, r, n) {
  let { worktreeRepo: o } = t;
  return t.read(async () => {
    let i = await o.host.platformPath(),
      s = new Map();
    await W2e(e, async (c) => {
      let u = i.join(o.root, c),
        p = await VO(o.host, u);
      p != null && s.set(c, { stat: p });
    });
    let a = e.filter((c) => {
      let u = s.get(c)?.stat;
      return u != null && !u.isDirectory() && !u.isSymbolicLink();
    });
    (await D2t(t, a, s), await n?.(a));
    let l = new Map();
    return (
      await W2e(e, async (c) => {
        let u = s.get(c);
        u != null && l.set(c, await r(c, u));
      }),
      l
    );
  });
}
async function D2t(t, e, r) {
  if (e.length === 0) return;
  let n = await t.git(["hash-object", "--stdin-paths"], {
    stdin:
      e.map(Xs).join(`
`) +
      `
`,
  });
  if (!n.success) throw new Error("Failed to hash working-tree files");
  let o = n.stdout.trim(),
    i = o.length === 0 ? [] : o.split(/\r?\n/);
  if (i.length !== e.length || i.some((s) => !/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(s)))
    throw new Error("Failed to parse batched working-tree hashes");
  for (let [s, a] of e.entries()) {
    let l = r.get(a),
      c = i[s];
    if (l == null || c == null) throw new Error("Missing batched working-tree hash");
    l.oid = c;
  }
}
async function W2e(t, e) {
  let r = 0,
    n = !1,
    o = null,
    i = async () => {
      for (; !n; ) {
        let s = t[r];
        if (((r += 1), s == null)) return;
        try {
          await e(s);
        } catch (a) {
          n ||
            ((n = !0),
            (o =
              a instanceof Error ? a : new Error("Review metadata worker failed", { cause: a })));
        }
      }
    };
  if ((await Promise.all(Array.from({ length: Math.min(I2t, t.length) }, () => i())), o != null))
    throw new Error("Review metadata worker failed", { cause: o });
}
var I2t,
  eN,
  H2e = g(() => {
    O();
    SA();
    XK();
    ((I2t = 8),
      (eN = class {
        constructor(e, r, n) {
          this.reviewSnapshot = e;
          this.readPreparedFile = r;
          this.prepareRegularFiles = n;
        }
        pending = new Map();
        started = !1;
        flushScheduled = !1;
        flushing = !1;
        read(e) {
          let r = this.pending.get(e);
          return (
            r == null && ((r = pt()), this.pending.set(e, r)),
            this.started && this.scheduleFlush(),
            r.promise
          );
        }
        start() {
          ((this.started = !0), this.scheduleFlush());
        }
        scheduleFlush() {
          this.pending.size === 0 ||
            this.flushScheduled ||
            this.flushing ||
            !this.started ||
            ((this.flushScheduled = !0),
            queueMicrotask(() => {
              ((this.flushScheduled = !1), this.flush());
            }));
        }
        async flush() {
          if (this.flushing || this.pending.size === 0) return;
          this.flushing = !0;
          let e = new Map(this.pending);
          this.pending.clear();
          try {
            let r = await k2t(
              this.reviewSnapshot,
              [...e.keys()],
              this.readPreparedFile,
              this.prepareRegularFiles,
            );
            for (let [n, o] of e) o.resolve(r.get(n) ?? null);
          } catch (r) {
            for (let n of e.values()) n.reject(r);
          } finally {
            ((this.flushing = !1), this.scheduleFlush());
          }
        }
      }));
  });
async function tN(t, e, { includeDiffMetadata: r = !1 } = {}) {
  let n = new Map(),
    o = new eN(
      t,
      (s, a) => O2t(t, s, a, r, n.get(s) ?? null),
      r
        ? async (s) => {
            let a = await I2e(t, s);
            for (let [l, c] of a) n.set(l, c);
          }
        : void 0,
    ),
    i = e.map((s) => M2t(t, s, r, o).then((a) => [s, a]));
  o.start();
  try {
    let s = new Map();
    for (let [a, l] of await Promise.all(i))
      if (l != null) s.set(a, l);
      else if (!r) return null;
    return s;
  } catch {
    return null;
  }
}
function M2t(t, e, r, n) {
  let { worktreeRepo: o } = t;
  return o.queryClient.fetchQuery({
    queryKey: ne(
      o.root,
      o.host,
      "review-working-tree-file-metadata",
      r ? "with-diff" : "identity-only",
      e,
      `${o.getReviewWorkingTreeFileGeneration(e)}`,
    ),
    meta: { ...Ue, gitReadPaths: o.getReviewWorkingTreeFileReadPaths(e) },
    queryFn: () => n.read(e),
    staleTime: (i) => (i.state.data == null ? 0 : Ve),
  });
}
async function O2t(t, e, r, n, o) {
  let { worktreeRepo: i } = t;
  if (r.stat.isDirectory()) {
    let a = (await i.host.platformPath()).join(i.root, e),
      l = await I(a, ["rev-parse", "--verify", "HEAD^{commit}"], i.host, { signal: t.signal });
    if (!l.success) throw new Error("Failed to read embedded repository HEAD");
    return { additions: 1, deletions: 0, mode: "160000", oid: l.stdout.trim() };
  }
  if (r.stat.isSymbolicLink()) {
    let s = await ZO(t, e);
    return {
      additions:
        s.target.split(`
`).length -
        1 +
        (s.target.length > 0 &&
        !s.target.endsWith(`
`)
          ? 1
          : 0),
      deletions: 0,
      mode: "120000",
      oid: s.oid,
    };
  }
  if (r.oid == null) throw new Error("Missing working-tree file hash");
  if (n && o == null) throw new Error("Missing working-tree diff metadata");
  return {
    additions: o?.additions ?? null,
    deletions: o?.deletions ?? null,
    mode: o?.mode ?? null,
    oid: r.oid,
  };
}
var j2e = g(() => {
  H2e();
  QK();
  e5();
  je();
  fe();
});
async function z2e(t, e) {
  let r = await us(t, e);
  if (r == null) return !1;
  try {
    return (await t.host.readDirectory(r)).some((o) => N2t.includes(o.name));
  } catch (n) {
    return !bt(n);
  }
}
var N2t,
  V2e = g(() => {
    O();
    Wm();
    N2t = [
      "index.lock",
      "MERGE_HEAD",
      "CHERRY_PICK_HEAD",
      "REVERT_HEAD",
      "REBASE_HEAD",
      "rebase-merge",
      "rebase-apply",
      "sequencer",
    ];
  });
async function AA(t, e, r, n, o = !1, i = !0, s) {
  let a = await e.getWorktreeRepository(t, r);
  if (a == null) return null;
  let l = a.reviewSnapshot;
  if (await l.read(() => z2e(a))) return null;
  let u = await hd({
    baseBranch: n,
    includeUntrackedFiles: i,
    reviewSnapshot: l,
    source: "branch",
  });
  if (u.type !== "success") return null;
  let p = nBe(u.untrackedPaths.paths.length, s),
    [m, f] = await Promise.all([ld(a, !1, l), iBe(l, p == null ? u.untrackedPaths.paths : [])]);
  if (m.type !== "success" || f == null) return null;
  let h = await RA({
    diffArgs: u.diffArgs,
    reviewSnapshot: l,
    source: "branch",
    statusPaths: m.trackedPaths,
  });
  if (h == null) return null;
  let v = await rN({ diffArgs: u.diffArgs, hideWhitespace: o, paths: h.paths, reviewSnapshot: l });
  if (v == null) return null;
  let y = Q2e(oBe(v, f), u.untrackedPathSet),
    { stats: w } = y;
  if (
    ((w = await B2t({
      diffArgs: u.diffArgs,
      hideWhitespace: o,
      renames: m.stagedRenames,
      metadata: y,
      reviewSnapshot: l,
    })),
    w.length === 0 && p == null)
  )
    return null;
  let _ = 0,
    S = 0;
  for (let E of w) ((_ += E.additions ?? 0), (S += E.deletions ?? 0));
  return l.read(async () => ({
    additions: _,
    deletions: S,
    fileCount: w.length,
    untrackedFilesOmitted: p,
  }));
}
async function B2t({ diffArgs: t, hideWhitespace: e, renames: r, metadata: n, reviewSnapshot: o }) {
  let i = await eBe({
    changedPaths: new Set(n.stats.filter((s) => s.previousPath == null).map((s) => s.path)),
    diffArgs: t,
    existingRenameKeys: new Set(
      n.stats.filter((s) => s.previousPath != null).map((s) => Cc(s.path, s.previousPath)),
    ),
    hideWhitespace: e,
    renames: r,
    reviewSnapshot: o,
  });
  return i.length === 0
    ? n.stats
    : Z2e(n.stats, i, new Set(n.rawEntries.filter((s) => s.status === "D").map((s) => s.path)));
}
function Z2e(t, e, r) {
  let n = new Map(e.map((i) => [i.path, i])),
    o = new Set(e.map((i) => i.previousPath));
  return t
    .filter((i) => i.previousPath != null || !o.has(i.path) || !r.has(i.path))
    .map((i) => {
      let s = i.previousPath == null ? n.get(i.path) : null;
      return s == null
        ? i
        : {
            additions: s.additions,
            deletions: s.deletions,
            path: s.path,
            previousPath: s.previousPath,
          };
    });
}
async function dv({
  baseBranch: t,
  commitSha: e,
  hideWhitespace: r = !1,
  includeUntrackedFiles: n = !0,
  maxUntrackedFiles: o,
  paths: i,
  source: s,
  worktreeRepo: a,
  reviewSnapshot: l = a.reviewSnapshot,
}) {
  let u =
    o != null && n && i == null && (s === "branch" || s === "uncommitted" || s === "unstaged")
      ? await jt(
          {
            attributes: { "git.review_source": s },
            name: "git.review_untracked_paths",
            op: "codex.git.review_untracked_paths",
          },
          () => qn(a, void 0, l),
        )
      : null;
  if (u?.success === !1)
    return { type: "error", source: s, failureReason: u.failureReason ?? "untracked_paths" };
  let p = u?.paths.length,
    m = nBe(p, o),
    [f, h] = await Promise.all([
      jt(
        {
          attributes: { "git.include_untracked": n && m == null, "git.review_source": s },
          name: "git.review_files",
          op: "codex.git.review_files",
        },
        () =>
          J2e({
            baseBranch: t,
            commitSha: e,
            includeUntrackedFiles: n && m == null,
            paths: i,
            reviewSnapshot: l,
            source: s,
            hideWhitespace: r,
          }),
      ),
      jt(
        {
          attributes: { "git.include_untracked": n, "git.review_source": s },
          name: "git.review_stage_counts",
          op: "codex.git.review_stage_counts",
        },
        () =>
          F2t({
            hideWhitespace: r,
            includeUntrackedFiles: n,
            reviewSnapshot: l,
            untrackedFileCount: p,
          }),
      ),
    ]);
  return f.type === "expected"
    ? { type: "expected", source: s, reason: f.reason }
    : f.type === "error" || h == null
      ? {
          type: "error",
          source: s,
          failureReason: f.type === "error" ? f.failureReason : "stage_counts",
        }
      : l.read(async () => ({
          type: "success",
          files: f.files,
          snapshotGeneration: l.generation,
          source: s,
          stageCounts: { ...h, untrackedFileCount: f.untrackedFileCount ?? h.untrackedFileCount },
          untrackedFilesOmitted: m,
          ...(s === "uncommitted" && i == null && !n ? { trackedFilesOnly: !0 } : {}),
        }));
}
async function X2e({
  baseBranch: t,
  commitSha: e,
  hideWhitespace: r = !1,
  maxUntrackedFiles: n,
  sources: o,
  worktreeRepo: i,
}) {
  let s = i.reviewSnapshot,
    a = await Promise.all(
      o.map((l) =>
        dv({
          baseBranch: t,
          commitSha: e,
          hideWhitespace: r,
          maxUntrackedFiles: n,
          reviewSnapshot: s,
          source: l,
          worktreeRepo: i,
        }),
      ),
    );
  return s.read(async () =>
    a.map((l) =>
      l.type === "success"
        ? l.untrackedFilesOmitted == null &&
          l.files.every((u) => u.additions != null && u.deletions != null)
          ? {
              source: l.source,
              type: "success",
              additions: l.files.reduce((u, p) => u + (p.additions ?? 0), 0),
              deletions: l.files.reduce((u, p) => u + (p.deletions ?? 0), 0),
              fileCount: l.files.length,
              snapshotGeneration: l.snapshotGeneration,
            }
          : {
              source: l.source,
              type: "incomplete",
              snapshotGeneration: l.snapshotGeneration,
              untrackedFilesOmitted: l.untrackedFilesOmitted,
            }
        : l.type === "expected"
          ? { source: l.source, type: "expected", reason: l.reason }
          : { source: l.source, type: "error", failureReason: l.failureReason },
    ),
  );
}
async function F2t({
  hideWhitespace: t = !1,
  includeUntrackedFiles: e = !0,
  reviewSnapshot: r,
  untrackedFileCount: n,
}) {
  let { worktreeRepo: o } = r,
    i = e && n == null ? await qn(o, void 0, r) : null,
    s = await mi(o, !1, r);
  if (s.type !== "success") return null;
  if (t) return U2t({ includeUntrackedFiles: e, reviewSnapshot: r, untrackedFileCount: n });
  let a = e ? (n ?? (i?.success ? i.paths.length : null)) : 0;
  return a == null
    ? null
    : r.read(async () => ({
        stagedFileCount: s.stagedCount,
        unstagedFileCount: s.unstagedCount,
        untrackedFileCount: a,
      }));
}
async function Y2e({
  baseBranch: t,
  commitSha: e,
  hideWhitespace: r = !1,
  includeUntrackedFiles: n = !0,
  paths: o,
  source: i,
  worktreeRepo: s,
}) {
  let a = s.reviewSnapshot,
    l = await J2e({
      baseBranch: t,
      commitSha: e,
      hideWhitespace: r,
      includeUntrackedFiles: n,
      paths: o,
      reviewSnapshot: a,
      source: i,
    });
  return l.type !== "success"
    ? { type: "error", source: i }
    : a.read(async () => ({ type: "success", files: l.files, source: i }));
}
async function J2e({
  baseBranch: t,
  commitSha: e,
  hideWhitespace: r,
  includeUntrackedFiles: n,
  paths: o,
  reviewSnapshot: i,
  source: s,
}) {
  let { worktreeRepo: a } = i,
    l = s === "branch" || s === "uncommitted" || s === "unstaged",
    c = s === "branch" || s === "uncommitted",
    [u, p] = await Promise.all([
      hd({
        baseBranch: t,
        commitSha: e,
        includeUntrackedFiles: n,
        paths: o,
        reviewSnapshot: i,
        source: s,
      }),
      l ? ld(a, !1, i, void 0, n && (o == null || o.length === 0)) : null,
    ]);
  if (u.type !== "success") return u;
  if (l && p?.type !== "success")
    return { type: "error", failureReason: p?.failureReason ?? "review_files" };
  let m = G2t(o, u.untrackedPathSet),
    [f, h] = await Promise.all([
      RA({
        diffArgs: u.diffArgs,
        requestedPaths: o,
        reviewSnapshot: i,
        source: s,
        statusPaths: p?.type === "success" ? p.trackedPaths : [],
      }),
      iBe(i, m),
    ]);
  if (f == null) return { type: "error", failureReason: "review_tracked_paths" };
  if (h == null) return { type: "error", failureReason: "review_untracked_metadata" };
  let v = await rN({ diffArgs: u.diffArgs, hideWhitespace: r, paths: f.paths, reviewSnapshot: i });
  if (v == null) return { type: "error", failureReason: "review_diff_metadata" };
  let y = oBe(v, h);
  (l && (y = Q2e(y, u.untrackedPathSet)),
    c &&
      p?.type === "success" &&
      (y = await $2t({
        diffArgs: u.diffArgs,
        hideWhitespace: r,
        metadata: y,
        renames: p.stagedRenames,
        reviewSnapshot: i,
      })));
  let w = u.unmergedPaths.type === "scanned" ? rBe(u.unmergedPaths.pathSet) : [];
  w.length > 0 && (y = { ...y, files: [...y.files, ...w] });
  let _ = await i.read(async () =>
    q2t({
      host: a.host,
      gitRoot: u.gitRoot,
      metadata: y,
      reviewSnapshot: i,
      source: s,
      untrackedPathSet: u.untrackedPathSet,
    }),
  );
  return _ == null
    ? { type: "error", failureReason: "review_working_tree_metadata" }
    : {
        type: "success",
        files: _,
        untrackedFileCount: l && n && o == null ? h.files.length : void 0,
      };
}
