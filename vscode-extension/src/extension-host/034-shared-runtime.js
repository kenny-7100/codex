var MLe = g(() => {});
async function OLe(t, e, r) {
  let n = await I(t, e, r);
  if (!n.success) {
    let o = n.stderr || n.stdout;
    throw new Error(`git ${e.join(" ")} failed${o ? `: ${o}` : ""}`);
  }
  return n.stdout;
}
var NLe = g(() => {
  fe();
});
function LLe(t) {
  let e = new Map();
  for (let r of t.split(/\r?\n/)) {
    let n = r.trim();
    if (!n) continue;
    let [o, i] = n.split(":");
    if (!o || i == null) continue;
    let s = Number.parseInt(i.trim(), 10);
    Number.isFinite(s) && e.set(o, s);
  }
  return e;
}
var BLe = g(() => {});
async function _K(t, e, r) {
  let n = typeof t == "string" ? await gLt(t, r) : await hLt(t),
    o = LLe(n),
    s = ((o.get("size") ?? 0) + (o.get("size-pack") ?? 0)) * 1024;
  if (s > e)
    throw new Error(`Repository is too large (${wK(s)}). Maximum allowed size is ${wK(e)}.`);
}
function hLt(t) {
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "count-objects"),
    gcTime: be,
    meta: Ue,
    queryFn: async () => {
      let e = await I(t.root, ["count-objects", "-v"], t.host);
      if (!e.success) {
        let r = e.stderr || e.stdout;
        throw new Error(`git count-objects -v failed${r ? `: ${r}` : ""}`);
      }
      return e.stdout;
    },
    staleTime: be,
  });
}
function gLt(t, e) {
  if (e == null) throw new Error("host is required for raw Git roots");
  return OLe(t, ["count-objects", "-v"], e);
}
var FLe = g(() => {
  MLe();
  NLe();
  je();
  BLe();
  fe();
});
async function xK(t, e, r) {
  if (e.isLocal)
    try {
      await e.stat(t, { bypassCache: !0 });
    } catch (a) {
      throw bt(a) ? new Error(`ENOENT: path does not exist: ${t}`) : a;
    }
  let {
    success: n,
    stdout: o,
    stderr: i,
    code: s,
  } = await I(t, ["rev-parse", "--git-common-dir"], e, { signal: r });
  if (n && o) {
    let a = await e.platformPath(),
      l = a.isAbsolute(o) ? o : a.resolve(t, o);
    return l;
  }
  if (s === 128 && i.toLowerCase().includes("not a git repository")) return null;
  throw new Error(`Failed to resolve git common dir: ${i || o || "Unknown error"}`);
}
var AK = g(() => {
  O();
  fe();
});
async function mi(t, e = !0, r, n) {
  let o;
  try {
    o = await ld(t, e, r, n);
  } catch (i) {
    if (n?.aborted) return { type: "error", failureReason: "canceled" };
    throw i;
  }
  return o.type === "error"
    ? o
    : {
        type: "success",
        stagedCount: o.stagedCount,
        unstagedCount: o.unstagedCount,
        untrackedCount: o.untrackedCount,
      };
}
async function ld(t, e = !0, r, n, o = !1) {
  if (e) return vLt(t, r, n);
  let i = t.gitReadGeneration,
    s = cK(t, i),
    a = async (c) => {
      let u = await QNe(t, i, o, c);
      if (u == null) {
        let y;
        try {
          y = await to(t, c);
        } catch {
          return { type: "error", failureReason: "status_config" };
        }
        let w = ["status", "--renames", "--porcelain=v1", "-z", "--untracked-files=no"],
          _ = await I(t.root, w, t.host, {
            collectStdoutBuffer: !0,
            configOverrides: y,
            signal: c,
            trim: !1,
          });
        if (((u = Ns(_.stdoutBuffer)), !_.success || u == null))
          return {
            type: "error",
            failureReason: _.success ? "unsupported_filename_encoding" : "status_command",
          };
      }
      let p = 0,
        m = [],
        f = [],
        h = 0,
        v = 0;
      for (; v < u.length && !(v + 1 >= u.length); ) {
        let y = u[v],
          w = u[v + 1],
          _ = u.indexOf("\0", v);
        if (_ === -1) break;
        let S = u.slice(v + 3, _);
        if (
          ((v = _ + 1),
          !(y === "?" && w === "?") &&
            (y !== " " && (p += 1),
            w !== " " && (h += 1),
            f.push(S),
            y === "R" || y === "C" || w === "R" || w === "C"))
        ) {
          let E = u.indexOf("\0", v);
          if (E === -1) break;
          let T = u.slice(v, E);
          (y === "R" && m.push({ path: S, previousPath: T }), f.push(T), (v = E + 1));
        }
      }
      return {
        type: "success",
        stagedCount: p,
        stagedRenames: m,
        trackedPaths: f,
        unstagedCount: h,
        untrackedCount: null,
      };
    },
    l = r == null ? n : n == null ? r.signal : AbortSignal.any([r.signal, n]);
  return bLt(r, async () => {
    let c = Er(t.queryClient, { queryKey: s, meta: Ue, queryFn: a, staleTime: Ve }, l),
      u = r == null ? await c : await Lt(c, r.signal);
    return (
      u.type === "error" &&
        t.queryClient.invalidateQueries({ queryKey: s, exact: !0, refetchType: "none" }),
      u
    );
  });
}
async function vLt(t, e, r) {
  let [n, o] = await Promise.all([qn(t, void 0, e, r), ld(t, !1, e, r, !0)]);
  return o.type === "error"
    ? o
    : n.success
      ? { ...o, untrackedCount: n.paths.length }
      : { type: "error", failureReason: n.failureReason ?? "untracked_paths" };
}
function bLt(t, e) {
  return t == null ? e() : t.read(e);
}
var cd = g(() => {
  O();
  xc();
  Ks();
  je();
  fe();
});
function ll(t, e) {
  return SLt(t, e);
}
async function SLt(t, e) {
  let r = e.trim();
  if (!r) return null;
  let n = await ULe(t, r);
  if (!n.requiresRefCheck) return n.mergeBase;
  let [o, i] = await Promise.all([At(t, "HEAD"), At(t, r)]);
  if (o == null) return null;
  if (i != null) return $Le(t, r);
  let s = [],
    a = new Set(),
    l = (v) => {
      let y = v?.trim();
      !y || a.has(y) || (s.push(y), a.add(y));
    },
    [c, u] = await Promise.all([wLt(t, r), hn(t)]);
  if (u.length > 0) {
    let v = new Set(u),
      y = r.indexOf("/"),
      w = y > 0 ? r.slice(0, y) : null,
      _ = w != null && v.has(w),
      S = _ && y + 1 < r.length ? r.slice(y + 1) : null;
    for (let E of u) {
      if (_ && E === w) {
        S && l(`refs/remotes/${E}/${S}`);
        continue;
      }
      (l(`${E}/${r}`), l(`refs/remotes/${E}/${r}`));
    }
  }
  l(c);
  let [p, ...m] = s,
    f = p != null && (await At(t, p)) ? p : null;
  if (f == null) {
    let y = (await Promise.all(m.map((w) => At(t, w)))).findIndex((w) => w != null);
    f = m[y] ?? null;
  }
  if (f == null) return null;
  let h = await ULe(t, f);
  return h.requiresRefCheck ? $Le(t, f) : h.mergeBase;
}
async function $Le(t, e) {
  let r = await I(t.root, ["merge-base", "HEAD", e], t.host, { allowedNonZeroExitCodes: [1] });
  if (!r.success) throw new Error("Git merge-base failed");
  return r.stdout.trim() || null;
}
function wLt(t, e) {
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "branch-upstream", e),
    meta: pi,
    queryFn: async () => {
      let r = await I(
        t.root,
        ["for-each-ref", "--format=%(upstream:short)", `refs/heads/${e}`],
        t.host,
      );
      return r.success && r.stdout ? r.stdout.trim() : null;
    },
    staleTime: Ve,
  });
}
function ULe(t, e) {
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "head-merge-base", e),
    meta: zy,
    queryFn: async () => {
      let r = await I(t.root, ["merge-base", "HEAD", e], t.host, {
        allowedNonZeroExitCodes: [1, 128],
      });
      if (r.code === 128) return { mergeBase: null, requiresRefCheck: !0 };
      if (!r.success || !r.stdout) return { mergeBase: null, requiresRefCheck: !1 };
      let n = r.stdout.trim();
      return { mergeBase: n.length > 0 ? n : null, requiresRefCheck: !1 };
    },
    staleTime: Ve,
  });
}
var dA = g(() => {
  il();
  ps();
  je();
  fe();
});
async function RK(t, { cwd: e, path: r }, n, o) {
  try {
    let i = await t.getStableMetadata(e, n);
    if (i == null) return { type: "error", error: { type: "unknown" } };
    let s = await n.platformPath(),
      a = ro(s, i.root, e, r);
    if (s.isAbsolute(a) || a === ".." || a.startsWith("../") || a.startsWith("..\\"))
      return { type: "error", error: { type: "not-found" } };
    let [l, c] = await Promise.all([
      RLt(t.getWorktreeRepositoryForRoot(i.root, n), a, o),
      PLt(t, e, n, o),
    ]);
    return l.code !== 0
      ? { type: "error", error: { type: l.code === 128 ? "not-found" : "unknown" } }
      : l.outputLimitExceeded != null
        ? { type: "error", error: { type: "unknown" } }
        : { type: "success", lines: ELt(l.stdout), repositoryWebUrl: c };
  } catch {
    return { type: "error", error: { type: "unknown" } };
  }
}
function RLt(t, e, r) {
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "blame-file", e),
    gcTime: be,
    meta: Ue,
    queryFn: () =>
      I(t.root, ["blame", "--porcelain", "--", e], t.host, {
        env: ALt,
        maxOutputBytes: xLt,
        signal: r,
        timeoutMs: _Lt,
        trim: !1,
      }),
    staleTime: be,
  });
}
function ELt(t) {
  let e = new Array(),
    r = new Map(),
    n = null;
  for (let o of t.split(`
`)) {
    if (o === "") continue;
    if (o.startsWith("	")) {
      n != null &&
        (e.push(n),
        r.set(n.commitSha, {
          author: n.author,
          authorLogin: n.authorLogin,
          authorTime: n.authorTime,
          summary: n.summary,
        }),
        (n = null));
      continue;
    }
    if (n == null) {
      n = CLt(o, r);
      continue;
    }
    let i = o.indexOf(" "),
      s = i === -1 ? o : o.slice(0, i),
      a = i === -1 ? "" : o.slice(i + 1);
    if (s === "author") n.author = a || null;
    else if (s === "author-mail") n.authorLogin = TLt(a);
    else if (s === "author-time") {
      let l = Number.parseInt(a, 10);
      n.authorTime = Number.isNaN(l) ? null : l;
    } else s === "summary" && (n.summary = a || null);
  }
  return e;
}
function CLt(t, e) {
  let [r = "", , n = ""] = t.split(" "),
    o = Number.parseInt(n, 10),
    i = e.get(r);
  return {
    author: i?.author ?? null,
    authorLogin: i?.authorLogin ?? null,
    authorTime: i?.authorTime ?? null,
    commitSha: r,
    lineNumber: Number.isNaN(o) ? 0 : o,
    summary: i?.summary ?? null,
  };
}
function TLt(t) {
  let e = t.trim().replace(/^<|>$/g, "");
  return /^(?:\d+\+)?([^@]+)@users\.noreply\.github\.com$/i.exec(e)?.[1] ?? null;
}
async function PLt(t, e, r, n) {
  try {
    let i = await (await t.getRepoRepository(e, r))?.getOriginUrl(n);
    if (i == null) return null;
    let s = yu(i);
    return s == null || !ILt(s.host) ? null : `https://${s.host}/${s.owner}/${s.repo}`;
  } catch {
    return null;
  }
}
function ILt(t) {
  return t === "github.com" || t.endsWith(".github.com");
}
var _Lt,
  xLt,
  ALt,
  EK = g(() => {
    O();
    je();
    od();
    fe();
    ((_Lt = 3e4), (xLt = 20 * 1024 * 1024), (ALt = { GIT_NO_LAZY_FETCH: "1" }));
  });
function qLe(t, e) {
  let r = [e, t].filter(Boolean).join(`
`),
    { conflictedPaths: n, hasConflictHeader: o } = kLt(r);
  return o || n.length > 0
    ? { errorType: "blocked-by-working-tree-changes", conflictedPaths: n }
    : { errorType: "unknown", conflictedPaths: [] };
}
function kLt(t) {
  let e = t.split(/\r?\n/),
    r = /^(error:\s*)?.*\bwould be overwritten by checkout:\s*$/i,
    n = new Set(),
    o = !1,
    i = !1;
  for (let s of e) {
    let l = s.replace(/\r$/, "").trim();
    if (!o) {
      r.test(l) && ((i = !0), (o = !0));
      continue;
    }
    if (l.length === 0) continue;
    let c = l.toLowerCase();
    if (c.startsWith("please ") || c.startsWith("error:") || c === "aborting") break;
    n.add(l);
  }
  return { conflictedPaths: Array.from(n), hasConflictHeader: i };
}
var GLe = g(() => {});
async function En(
  { cwd: t, branch: e, stashUncommitted: r = !1 },
  n,
  o,
  { onCheckoutStatusChange: i, onStashStatusChange: s, signal: a } = {},
) {
  if (!t.trim())
    return {
      status: "error",
      error: "No workspace available for branch checkout",
      errorType: "unknown",
    };
  let l = e.trim();
  if (!l) return { status: "error", error: "Branch name is required", errorType: "unknown" };
  let c = await OLt(t, l, o, a);
  if (c.status === "error") return c;
  let u = null,
    p = null;
  if (r) {
    s?.("started");
    let f = await I(t, ["stash", "push", "--include-untracked", "-m", DLt], o, {
        signal: a,
        trim: !1,
      }),
      h = f.stdout.includes(WLe) || f.stderr.includes(WLe);
    if (!h && !f.success) {
      s?.("failed");
      let v = f.stderr || f.stdout || "Failed to stash changes";
      return {
        status: "error",
        error: v,
        errorType: "failed-to-stash-changes",
        execOutput: Nt({
          command: f.command,
          stdout: f.stdout,
          stderr: f.stderr,
          fallbackOutput: v,
        }),
      };
    }
    if (h) s?.("skipped");
    else {
      p = "stash@{0}";
      let v = await I(t, ["rev-parse", "--verify", MLt], o, { signal: a });
      if (!v.success || v.stdout.length === 0) {
        s?.("failed");
        let y = v.stderr || v.stdout || "Failed to resolve stash reference",
          w = await HLe({ cwd: t, stashRollbackRef: p, host: o }),
          _ = w
            ? `${y}
${w}`
            : y;
        return {
          status: "error",
          error: _,
          errorType: "failed-to-stash-changes",
          execOutput: Nt({
            command: v.command,
            stdout: v.stdout,
            stderr: v.stderr,
            fallbackOutput: _,
          }),
        };
      }
      ((u = v.stdout), s?.("completed"));
    }
  } else s?.("skipped");
  i?.("started");
  let m = await I(t, c.args, o, { signal: a });
  if (!m.success) {
    i?.("failed");
    let f = await HLe({ cwd: t, stashRollbackRef: p, host: o }),
      h = m.stderr || m.stdout || "Failed to checkout branch",
      { errorType: v, conflictedPaths: y } = qLe(m.stdout, m.stderr),
      w = f
        ? `${h}
${f}`
        : h;
    return {
      status: "error",
      error: w,
      errorType: v,
      conflictedPaths: y.length > 0 ? y : void 0,
      execOutput: Nt({ command: m.command, stdout: m.stdout, stderr: m.stderr, fallbackOutput: w }),
    };
  }
  return (
    n.invalidateGitReadCachesForRepoChange("head", o),
    n.invalidateGitReadCachesForRepoChange("working-tree", o),
    i?.("completed"),
    { status: "success", branch: l, stashRef: u }
  );
}
async function OLt(t, e, r, n) {
  if (!e.startsWith("-")) {
    let a = `refs/heads/${e}`;
    if (await sl(t, a, r, n)) return { status: "success", args: ["checkout", e] };
    if ((await I(t, ["check-ref-format", a], r, { signal: n })).success) {
      let c = await I(
        t,
        ["for-each-ref", "--count=2", "--format=%(refname)", `refs/remotes/*/${e}`],
        r,
        { signal: n },
      );
      if (c.success) {
        let u = c.stdout
          .split(
            `
`,
          )
          .map((p) => p.trim())
          .filter((p) => p.length > 0);
        if (u.length === 1)
          return { status: "success", args: ["checkout", "--track", "-b", e, u[0]] };
        if (u.length > 1)
          return {
            status: "error",
            error: `Branch '${e}' exists on multiple remotes`,
            errorType: "unknown",
          };
      }
    }
  }
  let o = await I(t, ["rev-parse", "--verify", "--quiet", "--end-of-options", `${e}^{commit}`], r, {
      signal: n,
    }),
    i = o.stdout.trim();
  if (o.success && /^[0-9a-f]{40,64}$/.test(i))
    return { status: "success", args: ["checkout", "--detach", i] };
  let s = o.stderr || o.stdout || `Branch or ref '${e}' was not found`;
  return {
    status: "error",
    error: s,
    errorType: "unknown",
    execOutput: Nt({ command: o.command, stdout: o.stdout, stderr: o.stderr, fallbackOutput: s }),
  };
}
async function HLe({ cwd: t, stashRollbackRef: e, host: r }) {
  if (e == null) return null;
  let n = await I(t, ["stash", "pop", "--index", e], r);
  return n.success ? null : n.stderr || n.stdout || "Failed to restore stashed changes";
}
var DLt,
  MLt,
  WLe,
  Zm = g(() => {
    O();
    sA();
    GLe();
    fe();
    ((DLt = "Stashed Codex worktree changes"),
      (MLt = "refs/stash"),
      (WLe = "No local changes to save"));
  });
async function jLe(t, e, r, n, o, i) {
  let s = Vs(e);
  if (!n && (await sl(t, e, r, i))) return { success: !0, branchRef: s };
  let a = await I(t, ["branch", "--", e, ...(o == null ? [] : [o])], r, { signal: i });
  if (a.success) return { success: !0, branchRef: s };
  if (n && (await sl(t, e, r, i)))
    return { success: !1, reason: "already-exists", error: "Branch already exists" };
  let l = a.stderr || a.stdout || "Failed to create branch";
  return {
    success: !1,
    reason: "create-failed",
    error: l,
    execOutput: Nt({ command: a.command, stdout: a.stdout, stderr: a.stderr, fallbackOutput: l }),
  };
}
async function NLt(t, e, r, n) {
  if ((await I(t, ["rev-parse", "--verify", "HEAD"], r, { signal: n })).success) return null;
  let i = await I(t, ["switch", "-c", e], r, { signal: n });
  if (i.success) return { success: !0 };
  let s = i.stderr || i.stdout || "Failed to create branch";
  return {
    success: !1,
    error: s,
    execOutput: Nt({ command: i.command, stdout: i.stdout, stderr: i.stderr, fallbackOutput: s }),
  };
}
async function pA({ cwd: t, branch: e, mode: r, failIfExists: n = !1, startPoint: o }, i, s, a) {
  if (!t.trim()) return { status: "error", error: "No workspace available for branch creation" };
  let l = e.trim(),
    c = l.startsWith("refs/heads/") ? l.slice(11) : l;
  if (!c) return { status: "error", error: "Branch name is required" };
  if (c.startsWith("refs/heads/") || c.startsWith("refs/remotes/") || c.startsWith("refs/tags/"))
    return { status: "error", error: "Only local branches can be created" };
  try {
    switch (r) {
      case "synced": {
        let u = await i.getWorktreeRepository(t, s),
          p = u?.root;
        if (!p) return { status: "error", error: "No git repository found for branch creation" };
        let m = await jLe(p, c, s, n, o, a);
        if (!m.success) return { status: "error", error: m.error, execOutput: m.execOutput };
        let f = m.branchRef,
          h = await al(u, f, a);
        return (await PO(u, f, h, a), { status: "success", branch: c });
      }
      case "worktree": {
        let u = await jLe(t, c, s, n, o, a);
        if (!u.success) {
          if (u.reason === "already-exists")
            return { status: "error", error: u.error, execOutput: u.execOutput };
          if (o != null) return { status: "error", error: u.error, execOutput: u.execOutput };
          let p = await NLt(t, c, s, a);
          return p?.success
            ? { status: "success", branch: c }
            : p != null
              ? { status: "error", error: p.error, execOutput: p.execOutput }
              : { status: "error", error: u.error, execOutput: u.execOutput };
        }
        return { status: "success", branch: c };
      }
    }
  } catch (u) {
    return { status: "error", error: u instanceof Error ? u.message : String(u) };
  }
}
var CK = g(() => {
  O();
  sA();
  ov();
  fe();
  ad();
  Yy();
});
async function TK({ cwd: t }, e, r) {
  if (!t.trim()) throw new Error("Workspace root is required");
  let n = await I(t, ["init"], r);
  if (!n.success) throw new Error(n.stderr || n.stdout || "Failed to run git init");
  return (e.invalidateStableMetadata(), { success: !0 });
}
var PK = g(() => {
  fe();
});
var MO = g(() => {});
async function zLe(t, e, r) {
  if (e.isLocal)
    try {
      await e.stat(t, { bypassCache: !0 });
    } catch (a) {
      if (bt(a)) return null;
      throw a;
    }
  let {
    success: n,
    stdout: o,
    stderr: i,
    code: s,
  } = await I(
    t,
    ["rev-parse", "--path-format=absolute", "--show-toplevel", "--git-common-dir"],
    e,
    { allowedNonZeroExitCodes: [128], signal: r },
  );
  if (n && s === 0) {
    let a = await e.platformPath(),
      l = o.split(
        a.sep === "\\"
          ? /\r?\n/
          : `
`,
      ),
      c = l[0],
      u = l[1];
    if (l.length !== 2 || c == null || c.length === 0 || u == null || u.length === 0)
      throw new Xm("Failed to resolve git root and common dir: malformed output");
    if (!a.isAbsolute(u))
      throw new Xm("Failed to resolve git root and common dir: relative common dir output");
    return { commonDir: u, root: c };
  }
  if (s === 128 && Hx(i)) return null;
  throw i === No
    ? new el()
    : s === 129 || i.toLowerCase().includes("unknown option")
      ? new Xm(`Failed to resolve git root and common dir: ${i || o || "Unknown error"}`)
      : new Error(`Failed to resolve git root and common dir: ${i || o || "Unknown error"}`);
}
var Xm,
  VLe = g(() => {
    O();
    YM();
    $m();
    fe();
    Xm = class extends Error {};
  });
async function KLe(t, e, r, n) {
  let o = await I(t, ["config", "--get", ...e], r, { signal: n });
  return o.success && o.stdout ? o.stdout : null;
}
function ZLe(t, e, r) {
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "config-value", e),
    meta: pi,
    queryFn: async () => {
      let n = await I(t.root, ["config", "--get", ...e], t.host, { signal: r });
      return n.success && n.stdout ? n.stdout : null;
    },
    staleTime: Ve,
  });
}
var IK = g(() => {
  je();
  fe();
});
var XLe,
  OO,
  YLe = g(() => {
    XLe = F(Q_());
    MO();
    IK();
    OO = class {
      constructor(e, r) {
        this.commonDir = e;
        this.host = r;
      }
      getCommonDir() {
        return this.commonDir;
      }
      getOriginUrl = (0, XLe.default)(
        async (e) => await KLe(this.commonDir, ["remote.origin.url"], this.host, e),
        { length: 0, promise: !0, maxAge: 864e5 },
      );
    };
  });
var fs,
  mA,
  kK = g(() => {
    je();
    fe();
    Vm();
    ((fs = class extends Error {
      constructor() {
        (super("Git snapshot became stale"), (this.name = "GitReviewSnapshotStaleError"));
      }
    }),
      (mA = class {
        constructor(e, r) {
          this.worktreeRepo = e;
          this.generation = r;
        }
        abortController = new AbortController();
        signal = this.abortController.signal;
        git(e, r = {}) {
          return this.read(() =>
            I(this.worktreeRepo.root, e, this.worktreeRepo.host, this.commandOptions(r)),
          );
        }
        gitDiff(e, r = {}) {
          return this.read(() =>
            ds(
              this.worktreeRepo.root,
              e,
              this.worktreeRepo.host,
              this.commandOptions({
                ...r,
                configOverrides: [
                  ...(r.configOverrides ?? []),
                  "-c",
                  "diff.autoRefreshIndex=false",
                ],
              }),
            ),
          );
        }
        queryKey(e, ...r) {
          return ne(
            this.worktreeRepo.root,
            this.worktreeRepo.host,
            e,
            "review",
            `${this.generation}`,
            ...r,
          );
        }
        async read(e) {
          this.assertCurrent();
          try {
            let r = await e();
            return (this.assertCurrent(), r);
          } catch (r) {
            throw this.worktreeRepo.reviewSnapshot !== this ? new fs() : r;
          }
        }
        retire() {
          this.abortController.abort();
        }
        assertCurrent() {
          if (this.signal.aborted || this.worktreeRepo.reviewSnapshot !== this) throw new fs();
        }
        commandOptions(e) {
          return {
            ...e,
            signal: e.signal == null ? this.signal : AbortSignal.any([this.signal, e.signal]),
          };
        }
      }));
  });
async function JLe(t, e, r, n, o, i) {
  let a = ["config", n === "local" ? "--local" : "--worktree", e, r],
    l = await I(t, a, o, { signal: i });
  return l.success || n !== "worktree"
    ? l.success
    : !l.stderr.toLowerCase().includes("worktreeconfig") ||
        !(await I(t, ["config", "extensions.worktreeConfig", "true"], o, { signal: i })).success
      ? !1
      : (await I(t, a, o, { signal: i })).success;
}
var QLe = g(() => {
  fe();
});
var fA,
  DK = g(() => {
    vx();
    IK();
    J3();
    je();
    kK();
    QLe();
    fA = class {
      constructor(e, r, n = { next: 0 }) {
        this.root = e;
        this.host = r;
        this.reviewSnapshotGenerations = n;
        this.reviewSnapshotValue = new mA(this, this.reviewSnapshotGenerations.next++);
      }
      queryClient = hNe();
      gitConfigReadGenerationValue = 0;
      gitHeadReadGenerationValue = 0;
      gitReadGenerationValue = 0;
      nextReviewWorkingTreeFileGeneration = 0;
      reviewWorkingTreeFileGenerations = new Map();
      reviewSnapshotValue;
      watchScopedGitReadGenerationValue = 0;
      get gitReadGeneration() {
        return this.gitReadGenerationValue;
      }
      get gitConfigReadGeneration() {
        return this.gitConfigReadGenerationValue;
      }
      get gitHeadReadGeneration() {
        return this.gitHeadReadGenerationValue;
      }
      get watchScopedGitReadGeneration() {
        return this.watchScopedGitReadGenerationValue;
      }
      get reviewSnapshot() {
        return this.reviewSnapshotValue;
      }
      getReviewWorkingTreeFileGeneration(e) {
        let r = this.reviewWorkingTreeFileGenerations.get(e);
        return (
          r == null &&
            ((r = this.nextReviewWorkingTreeFileGeneration++),
            this.reviewWorkingTreeFileGenerations.set(e, r)),
          r
        );
      }
      getReviewWorkingTreeFileReadPaths(e) {
        let r = [e, ".gitattributes"],
          n = Br.default.posix.dirname(e);
        for (; n !== "."; )
          (r.push(Br.default.posix.join(n, ".gitattributes")), (n = Br.default.posix.dirname(n)));
        return r;
      }
      requireReviewSnapshot(e) {
        if (this.reviewSnapshotValue.generation !== e || this.reviewSnapshotValue.signal.aborted)
          throw new fs();
        return this.reviewSnapshotValue;
      }
      async getConfigValue(e, r) {
        return ZLe(this, [e], r);
      }
      async getConfigValueForScope(e, r, n) {
        return PNe(this, e, r, n);
      }
      async setConfigValueForScope(e, r, n, o) {
        return (await JLe(this.root, e, r, n, this.host, o))
          ? (this.invalidateGitReadCachesForRepoChange("config"), !0)
          : !1;
      }
      advanceHeadReadGeneration() {
        this.gitHeadReadGenerationValue += 1;
      }
      clearGitReadCaches() {
        ((this.gitConfigReadGenerationValue += 1),
          this.advanceHeadReadGeneration(),
          (this.gitReadGenerationValue += 1),
          this.reviewWorkingTreeFileGenerations.clear(),
          this.advanceWatchScopedGitReadGeneration(),
          gO(this.queryClient, () => !0));
      }
      invalidateGitReadCachesForRepoRecovery() {
        (this.clearGitReadCaches(), this.advanceReviewSnapshot());
      }
      clearShortLivedGitReadCaches() {
        ((this.gitReadGenerationValue += 1),
          this.reviewWorkingTreeFileGenerations.clear(),
          W3(this.queryClient));
      }
      invalidateWatchScopedGitReadCaches() {
        this.advanceWatchScopedGitReadGeneration();
      }
      invalidateGitReadCachesForMutation() {
        ((this.gitReadGenerationValue += 1),
          this.reviewWorkingTreeFileGenerations.clear(),
          this.advanceReviewSnapshot(),
          W3(this.queryClient),
          this.invalidateWatchScopedGitReadCaches());
      }
      invalidateGitReadCachesForRepoChange(e, r) {
        if (e !== "synced-branch") {
          if (e === "worktree-topology") {
            this.queryClient.invalidateQueries({
              queryKey: ne(this.root, this.host, "worktrees"),
              exact: !0,
              refetchType: "none",
            });
            return;
          }
          if (e === "local-refs") {
            (this.advanceWatchScopedGitReadGeneration(), H3(this.queryClient, this.root, e, r));
            return;
          }
          (e === "config" && (this.gitConfigReadGenerationValue += 1),
            e === "head" && this.advanceHeadReadGeneration(),
            (e === "config" || e === "head" || e === "remote-refs") &&
              this.advanceWatchScopedGitReadGeneration(),
            (this.gitReadGenerationValue += 1),
            e === "working-tree" && r != null
              ? this.reviewWorkingTreeFileGenerations.forEach((n, o) => {
                  mO(this.root, this.getReviewWorkingTreeFileReadPaths(o), r) &&
                    this.reviewWorkingTreeFileGenerations.set(
                      o,
                      this.nextReviewWorkingTreeFileGeneration++,
                    );
                })
              : this.reviewWorkingTreeFileGenerations.clear(),
            this.advanceReviewSnapshot(),
            H3(this.queryClient, this.root, e, r));
        }
      }
      advanceReviewSnapshot() {
        let e = this.reviewSnapshotValue;
        ((this.reviewSnapshotValue = new mA(this, this.reviewSnapshotGenerations.next++)),
          e.retire(),
          this.queryClient.removeQueries({
            type: "inactive",
            predicate: (r) =>
              (r.queryKey[4] === "review" &&
                r.queryKey[5] !== `${this.reviewSnapshotValue.generation}` &&
                r.state.fetchStatus !== "fetching") ||
              (r.queryKey[3] === "review-working-tree-file-metadata" &&
                r.state.fetchStatus === "fetching"),
          }));
      }
      advanceWatchScopedGitReadGeneration() {
        ((this.watchScopedGitReadGenerationValue += 1), gNe(this.queryClient));
      }
    };
  });
function MK(t, e) {
  return e.isLocal ? TV(t) : t;
}
function $Lt(t) {
  let r = (t instanceof Error ? t.message : String(t)).toLowerCase();
  return (
    r.includes("unable to read current working directory") &&
    (r.includes("operation not permitted") || r.includes("permission denied"))
  );
}
function e2e(t) {
  return t instanceof Error && t.message.includes("git process timed out after");
}
var NO,
  LLt,
  BLt,
  FLt,
  Ym,
  OK = g(() => {
    NO = F(Q_());
    O();
    MO();
    AK();
    YM();
    VLe();
    Ks();
    $m();
    Sx();
    YLe();
    DK();
    Qx();
    Oy();
    ((LLt = 1e3),
      (BLt = 1e3),
      (FLt = 1024),
      (Ym = class {
        reposByKey = new Map();
        worktreesByKey = new Map();
        reviewSnapshotGenerations = { next: 0 };
        watchedWorktrees = new WeakMap();
        commonDirByWorktreeKey = new Map();
        stableRootByKey = new Map();
        stableMetadataRetryByKey = new Map();
        pendingStableMetadataTraceByKey = new Map();
        stableMetadataGeneration = 0;
        hasBackgroundedSinceLastForeground = !1;
        constructor(e) {
          e.subscribe((r) => {
            this.handleAppEvent(r);
          });
        }
        async getRepoRepository(e, r) {
          let n = await this.getStableMetadata(e, r);
          return n ? this.getOrCreateRepo(n.commonDir, r) : null;
        }
        async getWorktreeRepository(e, r) {
          let n = await this.getStableRoot(e, r);
          return n ? this.getOrCreateWorktree(n, r) : null;
        }
        getWorktreeRepositoryForRoot(e, r) {
          return this.getOrCreateWorktree(e, r);
        }
        async getCachedWorktreeRepository(e, r) {
          let n = yy(e, r),
            o = typeof n == "string" ? n : await n;
          if (o == null) return;
          let i = MK(this.getCachedStableRoot(o, r) ?? o, r);
          return this.worktreesByKey.get(this.getWorktreeKey(i, r));
        }
        retainWorktreeForWatch(e) {
          let r = this.watchedWorktrees.get(e) ?? { count: 0, deleted: !1 };
          return (
            (r.count += 1),
            this.watchedWorktrees.set(e, r),
            () => {
              ((r.count -= 1),
                r.count === 0 &&
                  (this.watchedWorktrees.delete(e), r.deleted && this.removeWorktree(e)));
            }
          );
        }
        releaseDeletedWorktree(e) {
          e.invalidateGitReadCachesForRepoRecovery();
          let r = this.watchedWorktrees.get(e);
          r != null ? (r.deleted = !0) : this.removeWorktree(e);
        }
        removeWorktree(e) {
          let r = this.getWorktreeKey(e.root, e.host);
          this.worktreesByKey.get(r) === e &&
            (this.worktreesByKey.delete(r), this.commonDirByWorktreeKey.delete(r));
        }
        getRepoKey(e, r) {
          return `${fn(r)}|${e}`;
        }
        getOrCreateRepo(e, r) {
          let n = this.getRepoKey(e, r),
            o = this.reposByKey.get(n);
          if (o) return o;
          let i = new OO(e, r);
          return (this.reposByKey.set(n, i), i);
        }
        getWorktreeKey(e, r) {
          let n = r.isLocal && process.platform === "win32" && (Wl(e) || Ra(e)) ? On(e) : e;
          return `${fn(r)}|${n}`;
        }
        getOrCreateWorktree(e, r) {
          let n = MK(e, r),
            o = this.getWorktreeKey(n, r),
            i = this.worktreesByKey.get(o);
          if (i) return i;
          let s = new fA(n, r, this.reviewSnapshotGenerations);
          return (this.worktreesByKey.set(o, s), s);
        }
        invalidateStableMetadata() {
          ((this.stableMetadataGeneration += 1),
            this.getStableRootMemoized.clear(),
            this.getStableMetadataMemoized.clear(),
            this.getHostedStableMetadataMemoized.clear(),
            this.commonDirByWorktreeKey.clear(),
            this.clearStableRootCache(),
            this.stableMetadataRetryByKey.clear(),
            this.pendingStableMetadataTraceByKey.clear());
        }
        invalidateUntrackedPathsCache(e) {
          let r = e == null ? null : fn(e);
          for (let [n, o] of this.worktreesByKey) (r == null || n.startsWith(`${r}|`)) && Rn(o);
        }
        async invalidateUntrackedPathsCacheForCwd(e, r) {
          try {
            let n = await this.getStableRoot(e, r);
            if (n != null) {
              let o = MK(n, r),
                i = fn(r);
              for (let [s, a] of this.worktreesByKey)
                s.startsWith(`${i}|`) && UD(a.root, o, a.host) && Rn(a);
              return;
            }
          } catch {}
          this.invalidateUntrackedPathsCache(r);
        }
        invalidateShortLivedGitReadCaches(e) {
          if (e == null) {
            for (let n of this.worktreesByKey.values()) n.clearShortLivedGitReadCaches();
            return;
          }
          let r = fn(e);
          for (let [n, o] of this.worktreesByKey)
            n.startsWith(`${r}|`) && o.clearShortLivedGitReadCaches();
        }
        getCachedWorktreesForCwds(e, r) {
          let n = Array.from(this.worktreesByKey.values()).filter((a) => a.host.id === r);
          if (e == null) return n;
          if (e.length === 0) return [];
          let i = n[0]?.host.isLocal === !0 ? e.map((a) => TV(a)) : e,
            s = n.filter((a) => i.some((l) => UD(a.root, l, a.host) || UD(l, a.root, a.host)));
          return s.length === 0 ? n : s;
        }
        async invalidateGitReadCachesForMutation(e, r) {
          let n = fn(r),
            o = this.worktreesByKey.get(this.getWorktreeKey(e, r));
          if (o == null)
            try {
              o = (await this.getWorktreeRepository(e, r)) ?? void 0;
            } catch {}
          if (o != null) {
            o.invalidateGitReadCachesForMutation();
            return;
          }
          for (let [i, s] of this.worktreesByKey)
            i.startsWith(`${n}|`) && s.invalidateGitReadCachesForMutation();
        }
        invalidateGitReadCachesForRepoChange(e, r) {
          let n = r == null ? null : fn(r);
          for (let [o, i] of this.worktreesByKey)
            (n == null || o.startsWith(`${n}|`)) && i.invalidateGitReadCachesForRepoChange(e);
        }
        getStableMetadata = async (e, r, n) => {
          let o = n ?? yy(e, r),
            i = typeof o == "string" ? o : await o;
          if (i == null) return null;
          let s = xIe(e, i, r),
            a = s instanceof Promise ? await s : s;
          this.throwStableMetadataRetry(i, r);
          let l = this.stableMetadataGeneration;
          try {
            let c = await Ui(() =>
              Ds(r.id) == null
                ? this.getStableMetadataMemoized(i, r, l)
                : this.getHostedStableMetadataMemoized(i, r, l),
            );
            return (
              l === this.stableMetadataGeneration &&
                (this.stableMetadataRetryByKey.delete(this.getStableMetadataKey(i, r)),
                c != null &&
                  this.commonDirByWorktreeKey.set(this.getWorktreeKey(c.root, r), c.commonDir)),
              c != null && a != null ? { ...c, symlinkTarget: a } : c
            );
          } catch (c) {
            this.throwStableMetadataReadError(i, r, c, l);
          }
        };
        async isCurrentlyRepository(e, r, n) {
          return (await T3(e, r, n)) != null;
        }
        getPendingStableMetadataTrace(e, r) {
          return this.pendingStableMetadataTraceByKey.get(this.getStableMetadataKey(e, r)) ?? null;
        }
        getStableRoot = async (e, r) => {
          let n = yy(e, r),
            o = typeof n == "string" ? n : await n;
          if (o == null) return null;
          let i = this.getCachedStableRoot(o, r),
            s = this.stableMetadataRetryByKey.get(this.getStableMetadataKey(o, r));
          if (
            (i !== void 0 && s != null && e2e(s.error)) ||
            (this.throwStableMetadataRetry(o, r), i !== void 0)
          )
            return i;
          let a = this.stableMetadataGeneration;
          try {
            let l = await Ui(() => this.getStableRootMemoized(o, r, a));
            return (
              a === this.stableMetadataGeneration &&
                this.stableMetadataRetryByKey.delete(this.getStableMetadataKey(o, r)),
              l
            );
          } catch (l) {
            this.throwStableMetadataReadError(o, r, l, a);
          }
        };
        throwStableMetadataRetry(e, r) {
          let n = this.getStableMetadataKey(e, r),
            o = this.stableMetadataRetryByKey.get(n);
          if (o != null) {
            if (Date.now() < o.retryAfterMs) throw o.error;
            this.stableMetadataRetryByKey.delete(n);
          }
        }
        throwStableMetadataReadError(e, r, n, o) {
          let i = e2e(n),
            s = n instanceof el;
          if (!$Lt(n) && !i && !s) throw n;
          let a = n instanceof Error ? n : new Error(String(n));
          throw (
            o === this.stableMetadataGeneration &&
              (s && jM(r),
              this.stableMetadataRetryByKey.set(this.getStableMetadataKey(e, r), {
                error: a,
                retryAfterMs: Date.now() + LLt,
              }),
              (!i || this.getCachedStableRoot(e, r) === void 0) &&
                (this.deleteCachedStableRoot(this.getStableMetadataKey(e, r)),
                this.getStableRootMemoized.delete(e, r, this.stableMetadataGeneration)),
              this.getStableMetadataMemoized.delete(e, r, this.stableMetadataGeneration)),
            a
          );
        }
        getStableMetadataKey(e, r) {
          return `${fn(r)}|${e}`;
        }
        cacheStableRoot(e, r, n, o) {
          if (o !== this.stableMetadataGeneration) return;
          let i = this.getStableMetadataKey(e, r);
          this.deleteCachedStableRoot(i);
          let s = {},
            a = setTimeout(() => {
              this.stableRootByKey.get(i)?.token === s && this.deleteCachedStableRoot(i);
            }, 864e5);
          for (
            a.unref?.(),
              this.stableRootByKey.set(i, {
                expiresAtMs: Date.now() + 864e5,
                expiryTimer: a,
                root: n,
                token: s,
              });
            this.stableRootByKey.size > FLt;

          ) {
            let l = this.stableRootByKey.keys().next().value;
            if (l == null) break;
            this.deleteCachedStableRoot(l);
          }
        }
        getCachedStableRoot(e, r) {
          let n = this.getStableMetadataKey(e, r),
            o = this.stableRootByKey.get(n);
          if (o != null) {
            if (Date.now() >= o.expiresAtMs) {
              this.deleteCachedStableRoot(n);
              return;
            }
            return (this.stableRootByKey.delete(n), this.stableRootByKey.set(n, o), o.root);
          }
        }
        deleteCachedStableRoot(e) {
          let r = this.stableRootByKey.get(e);
          r != null && (clearTimeout(r.expiryTimer), this.stableRootByKey.delete(e));
        }
        clearStableRootCache() {
          for (let e of this.stableRootByKey.keys()) this.deleteCachedStableRoot(e);
        }
        getStableRootMemoized = (0, NO.default)(
          async (e, r, n) => {
            let o = await T3(e, r);
            return (this.cacheStableRoot(e, r, o, n), o);
          },
          {
            promise: !0,
            maxAge: 864e5,
            normalizer: ([e, r, n]) => `${this.getStableMetadataKey(e, r)}|${n}`,
          },
        );
        getHostedStableMetadataMemoized = (0, NO.default)(
          (e, r, n) => (
            this.getStableMetadataMemoized.delete(e, r, n),
            this.getStableRootMemoized.delete(e, r, n),
            this.getStableMetadataMemoized(e, r, n)
          ),
          {
            promise: !0,
            maxAge: BLt,
            normalizer: ([e, r, n]) => `${this.getStableMetadataKey(e, r)}|${n}`,
          },
        );
        getStableMetadataMemoized = (0, NO.default)(
          async (e, r, n) => {
            let o = this.getStableMetadataKey(e, r),
              i = fo();
            i != null && this.pendingStableMetadataTraceByKey.set(o, i);
            try {
              try {
                let l = await jt(
                  {
                    attributes: { "git.host_kind": r.isLocal ? "local" : "remote" },
                    name: "git.metadata_root",
                    op: "codex.git.metadata_root",
                  },
                  () => zLe(e, r),
                );
                return (this.cacheStableRoot(e, r, l?.root ?? null, n), l);
              } catch (l) {
                if (!(l instanceof Xm)) throw l;
              }
              let s = await jt(
                {
                  attributes: { "git.host_kind": r.isLocal ? "local" : "remote" },
                  name: "git.metadata_root",
                  op: "codex.git.metadata_root",
                },
                () => Ui(() => this.getStableRootMemoized(e, r, n)),
              );
              if (!s) return null;
              let a = await jt(
                {
                  attributes: { "git.host_kind": r.isLocal ? "local" : "remote" },
                  name: "git.metadata_common_dir",
                  op: "codex.git.metadata_common_dir",
                },
                () => xK(s, r),
              );
              return a ? { root: s, commonDir: a } : null;
            } finally {
              this.pendingStableMetadataTraceByKey.get(o) === i &&
                this.pendingStableMetadataTraceByKey.delete(o);
            }
          },
          {
            promise: !0,
            maxAge: 864e5,
            normalizer: ([e, r, n]) => `${this.getStableMetadataKey(e, r)}|${n}`,
          },
        );
        handleAppEvent(e) {
          switch (e.type) {
            case "background":
              this.hasBackgroundedSinceLastForeground = !0;
              break;
            case "foreground":
              (this.hasBackgroundedSinceLastForeground &&
                (this.invalidateUntrackedPathsCache(), this.invalidateShortLivedGitReadCaches()),
                (this.hasBackgroundedSinceLastForeground = !1));
              break;
            case "turnComplete":
              (this.invalidateUntrackedPathsCache(), this.invalidateShortLivedGitReadCaches());
              break;
          }
        }
        invalidateGitReadCachesForTurn(e, r) {
          let n = this.getCachedWorktreesForCwds(e, r);
          if (n.length === 0) return;
          let o = new Set(),
            i = !1;
          for (let a of n) {
            Rn(a);
            let l = this.commonDirByWorktreeKey.get(this.getWorktreeKey(a.root, a.host));
            l == null ? (i = !0) : o.add(l);
          }
          let s = new Set(n);
          for (let a of this.worktreesByKey.values()) {
            if (a.host.id !== r) continue;
            let l = this.commonDirByWorktreeKey.get(this.getWorktreeKey(a.root, a.host));
            (s.has(a) || i || l == null || o.has(l)) && a.clearShortLivedGitReadCaches();
          }
        }
      }));
  });
async function LO(t, e, r) {
  return (
    await Promise.all(
      t.map(async (o) => {
        try {
          return await ULt(o, e, r);
        } catch (i) {
          return (
            he().warning("[git-origin-and-roots] Failed to resolve origin for workspace", {
              safe: {},
              sensitive: { error: i },
            }),
            null
          );
        }
      }),
    )
  ).filter((o) => o != null);
}
async function ULt(t, e, r) {
  let n = await e.getStableMetadata(t, r);
  if (n == null) return null;
  let o = e.getWorktreeRepositoryForRoot(n.root, r);
  return {
    dir: t,
    root: o.root,
    originUrl: await o.getConfigValue("remote.origin.url"),
    commonDir: n.commonDir,
    ...(n.symlinkTarget == null ? {} : { hasCwdSymlink: !0 }),
  };
}
var BO = g(() => {
  O();
  hr();
});
function t2e(t, e) {
  let r = [];
  for (let o of t.split(`
`)) {
    let i = o.trim();
    i && qLt(i) && r.push(i);
  }
  for (let o of r) {
    let i = GLt(o);
    if (i) {
      if (i.includes("non-fast-forward") || i.includes("fetch first") || i.includes("stale info"))
        return "remote-updated";
      if (
        i.includes("remote rejected") ||
        i.includes("remote failure") ||
        i.includes("pre-receive hook declined")
      )
        return "remote-rejected";
    }
  }
  let n = e.toLowerCase();
  return n.includes("no upstream") ||
    n.includes("set the remote as upstream") ||
    n.includes("has no upstream branch")
    ? "no-upstream"
    : n.includes("authentication failed") ||
        n.includes("could not read username") ||
        n.includes("permission denied") ||
        n.includes("access denied")
      ? "auth"
      : "unknown";
}
function qLt(t) {
  let e = t.toLowerCase();
  if (e.startsWith("ok ") || e.startsWith("error")) return !0;
  let r = t[0];
  return r === "!" || r === "=" || r === "+" || r === "-" || r === "*" || r === "?";
}
function GLt(t) {
  let e = [],
    r = t.match(/\[([^\]]+)\]/);
  r && e.push(r[1]);
  let n = t.match(/\(([^)]+)\)\s*$/);
  n && e.push(n[1]);
  let o = t.match(/^error[: ]+(.+)$/i);
  return (o && e.push(o[1]), e.length === 0 ? null : e.join(" ").toLowerCase());
}
var r2e = g(() => {});
async function hA({ cwd: t, refspec: e, setUpstream: r, force: n }, o, i, s) {
  let a = ["push", "--porcelain"];
  if ((n && a.push("--force-with-lease"), r && a.push("-u"), !t.trim()))
    return {
      status: "error",
      error: "unknown",
      execOutput: { command: ai(["git", ...a]), output: "No workspace available for push" },
    };
  let l = "";
  if (!l) {
    let p = await o.getWorktreeRepository(t, i);
    p && ((l = (await gn(p))?.remote ?? ""), l || (l = (await hn(p))[0] ?? ""));
  }
  if (!l)
    return {
      status: "error",
      error: "unknown",
      execOutput: { command: ai(["git", ...a]), output: "No git remote configured for push" },
    };
  a.push(l);
  let c = e?.trim();
  c && a.push(c);
  let u = await I(t, a, i, { signal: s });
  if (!u.success) {
    let p = u.stderr || u.stdout || "Failed to push changes";
    return {
      status: "error",
      error: t2e(u.stdout, u.stderr),
      execOutput: Nt({ command: u.command, stdout: u.stdout, stderr: u.stderr, fallbackOutput: p }),
    };
  }
  return { status: "success", remote: l, refspec: c ?? null };
}
var NK = g(() => {
  O();
  bm();
  _c();
  il();
  r2e();
  fe();
});
async function n2e(t, e) {
  let r = await HLt(e);
  return r == null
    ? t
    : (await Promise.all(t.map(async (o) => ({ dir: o, requiresDiscovery: await jLt(o, e, r) }))))
        .filter(({ requiresDiscovery: o }) => o)
        .map(({ dir: o }) => o);
}
async function HLt(t) {
  if (
    !t.isLocal ||
    typeof process > "u" ||
    (process.platform !== "darwin" && process.platform !== "linux") ||
    process.env.GIT_DIR !== void 0 ||
    process.env.GIT_WORK_TREE !== void 0
  )
    return null;
  try {
    let e = process.platform === "darwin" ? "macos" : process.platform,
      [r, n] = await Promise.all([t.platformOs(), t.platformPath()]);
    return r === e ? n : null;
  } catch {
    return null;
  }
}
async function jLt(t, e, r) {
  if (!r.isAbsolute(t) || r.normalize(t) !== t || (t.endsWith(r.sep) && t !== r.parse(t).root))
    return !0;
  let n = t;
  for (;;) {
    try {
      let i = await e.stat(n, { bypassCache: !0, followSymlinks: !1 });
      if (i.isSymbolicLink() || !i.isDirectory()) return !0;
    } catch {
      return !0;
    }
    for (let i of WLt)
      try {
        return (await e.stat(r.join(n, i), { bypassCache: !0, followSymlinks: !1 }), !0);
      } catch (s) {
        if (!bt(s)) return !0;
      }
    let o = r.dirname(n);
    if (o === n) return !1;
    n = o;
  }
}
var WLt,
  o2e = g(() => {
    O();
    WLt = [".git", "HEAD"];
  });
async function FO(t, e, r) {
  let n = zLt(t),
    o = await n2e(n, r);
  return { origins: await LO(o, e, r) };
}
function zLt(t) {
  let e = new Map();
  for (let r of t) {
    let n = tv(r);
    e.has(n) || e.set(n, r);
  }
  return Array.from(e.values());
}
var LK = g(() => {
  o2e();
  BO();
  AO();
});
async function s2e(t, e) {
  return nl(t, VLt, e);
}
function ZLt(t) {
  try {
    let e = KLt.safeParse(JSON.parse(t));
    return e.success
      ? e.data
      : (BK().warning("Invalid thread config}", {
          safe: {},
          sensitive: { error: e.error.message },
        }),
        null);
  } catch (e) {
    return (
      BK().warning("Failed to parse thread config", { safe: {}, sensitive: { error: e } }),
      null
    );
  }
}
async function gA(t, e, r = !1) {
  let n = await s2e(t, e);
  if (n == null) {
    if (r) throw new Error("Could not resolve the worktree owner file.");
    return null;
  }
  try {
    let o = await new Response(await t.host.readFile(n)).text();
    return ZLt(o);
  } catch (o) {
    if (bt(o, n)) return null;
    if (r) throw o;
    return (
      BK().warning("Failed to read thread config", { safe: {}, sensitive: { error: o } }),
      null
    );
  }
}
async function XLt(t, e, r) {
  let n = await s2e(t, r);
  if (n == null) throw new Error("No git repository found for thread config");
  let o = `${JSON.stringify(e, null, 2)}
`;
  await t.host.writeFile(n, o);
}
async function FK(t, e, r) {
  await XLt(t, { version: 1, ownerThreadId: e }, r);
}
async function a2e(t, e, r, n, o, i, s) {
  let a = await r.getWorktreeRepository(t, n);
  if (!a)
    return H({ worktreeGitRoot: null, worktreeWorkspaceRoot: null, hasUncommittedChanges: !1 });
  let l = await Kx(n, s),
    c = await n.platformPath(),
    u = await CO(a, t, i);
  if (o != null) {
    let [h, v] = await Promise.all([r.getStableMetadata(t, n), r.getStableMetadata(o, n)]);
    if (
      h != null &&
      v != null &&
      $O(v.commonDir) === $O(h.commonDir) &&
      (l.some((y) => JLt(v.root, y.path)) ||
        (await gA(r.getWorktreeRepositoryForRoot(v.root, n), i))?.ownerThreadId === e)
    ) {
      let y = u.length > 0 ? c.join(v.root, u) : v.root;
      return i2e(v.root, y, r, n);
    }
  }
  let p = await Zs(a, i),
    m = (
      await Promise.all(
        p.map(async (h) => {
          if ((await gA(r.getWorktreeRepositoryForRoot(h.root, n), i))?.ownerThreadId !== e)
            return null;
          let y = u.length > 0 ? c.join(h.root, u) : h.root,
            w = await QLt(h.root, n);
          return { worktreeGitRoot: h.root, worktreeWorkspaceRoot: y, sortTimestamp: w };
        }),
      )
    ).filter((h) => h != null);
  if (m.length === 0)
    return H({ worktreeGitRoot: null, worktreeWorkspaceRoot: null, hasUncommittedChanges: !1 });
  m.sort((h, v) =>
    h.sortTimestamp !== v.sortTimestamp
      ? v.sortTimestamp - h.sortTimestamp
      : v.worktreeGitRoot.localeCompare(h.worktreeGitRoot),
  );
  let f = m[0];
  return i2e(f.worktreeGitRoot, f.worktreeWorkspaceRoot, r, n);
}
async function i2e(t, e, r, n) {
  let o = r.getWorktreeRepositoryForRoot(t, n);
  return H({ worktreeGitRoot: t, worktreeWorkspaceRoot: e, hasUncommittedChanges: await YLt(o) });
}
async function YLt(t) {
  let e = new AbortController(),
    r = mi(t, !1),
    n = qn(t, void 0, void 0, e.signal);
  n.catch(() => {});
  let o;
  try {
    o = await r;
  } catch (s) {
    throw (e.abort(), s);
  }
  if (o.type !== "success") return (e.abort(), !1);
  if (o.stagedCount + o.unstagedCount > 0) return (e.abort(), !0);
  let i = await n;
  return i.success && i.paths.length > 0;
}
function $O(t) {
  return Vx(t).replace(/\/+$/, "");
}
function JLt(t, e) {
  let r = $O(t),
    n = $O(e);
  return n === "/" ? r === "/" : r === n || r.startsWith(`${n}/`);
}
async function QLt(t, e) {
  try {
    let r = await e.stat(t),
      n = r.birthtimeMs;
    if (n > 0) return n;
    let o = r.mtimeMs;
    return o > 0 ? o : 0;
  } catch {
    return 0;
  }
}
var BK,
  VLt,
  KLt,
  $K = g(() => {
    O();
    hr();
    $();
    qy();
    eO();
    Ky();
    gK();
    cd();
    Ks();
    Km();
    ((BK = Ie("threadConfig")),
      (VLt = "codex-thread.json"),
      (KLt = d.object({ version: d.literal(1), ownerThreadId: d.string() })));
  });
var B6r,
  F6r,
  l2e = g(() => {
    ((B6r = Date.parse("2026-02-21T00:00:00.000Z")), (F6r = 60 * 60 * 1e3));
  });
async function u2e(t) {
  let e = t;
  for (;;)
    try {
      let r = await (0, c2e.realpath)(e);
      return yA.default.win32.relative(e, r) === ""
        ? yA.default.win32.join(r, yA.default.win32.relative(e, t))
        : t;
    } catch (r) {
      let n = yA.default.win32.dirname(e);
      if (!bt(r) || n === e) return t;
      e = n;
    }
}
var c2e,
  yA,
  d2e = g(() => {
    ((c2e = require("node:fs/promises")), (yA = F(require("node:path"))));
    O();
  });
async function lv(
  t,
  e,
  r,
  {
    parentSha: n,
    message: o = "Codex changes",
    coAuthor: i = "Codex",
    configOverrides: s,
    signal: a,
  } = {},
) {
  let l = ["commit-tree", e];
  (n && l.push("-p", n), l.push("-m", o), i && l.push("-m", `Co-authored-by: ${i}`));
  let c = await I(t, l, r, { configOverrides: s, signal: a });
  return !c.success || !c.stdout ? { success: !1, error: c } : { success: !0, commitSha: c.stdout };
}
var UO = g(() => {
  fe();
});
async function ud({
  gitRoot: t,
  env: e,
  fallback: r = "full-scan",
  includeTrackedChanges: n = !0,
  paths: o,
  signal: i,
  host: s,
  untrackedPathsPromise: a,
}) {
  let l = o != null && o.length > 0 ? ["--", ...o] : [];
  if (!a)
    return r === "error"
      ? UK("Untracked paths are required for targeted staging")
      : I(t, ["add", "-A", ...l], s, { env: e, signal: i });
  let c = await a;
  if (!c.success)
    return r === "error"
      ? UK("Failed to enumerate untracked paths")
      : I(t, ["add", "-A", ...l], s, { env: e, signal: i });
  let u = new Set(c.paths),
    p = n
      ? o == null
        ? null
        : await t2t({ host: s, env: e, gitRoot: t, paths: o, signal: i, untrackedPathSet: u })
      : { success: !0, paths: [] };
  if (p?.success === !1)
    return r === "error"
      ? UK("Failed to enumerate tracked paths")
      : I(t, ["add", "-A", ...l], s, { env: e, signal: i });
  let m =
    p == null || p.paths.length > 0
      ? await I(t, ["add", "-u", ...(p != null ? ["--", ...p.paths] : [])], s, {
          env: e,
          signal: i,
        })
      : {
          code: 0,
          command: "git add -u",
          stderr: "",
          stderrBytes: 0,
          stdout: "",
          stdoutBytes: 0,
          success: !0,
        };
  if (!m.success || c.paths.length === 0) return m;
  let f = await I(t, ["add", "--sparse", "--pathspec-from-file=-", "--pathspec-file-nul"], s, {
    env: { ...e, GIT_LITERAL_PATHSPECS: "1" },
    signal: i,
    stdin: `${c.paths.join("\0")}\0`,
  });
  return (
    e2t(f) &&
      (f = await I(t, ["add", "--pathspec-from-file=-", "--pathspec-file-nul"], s, {
        env: { ...e, GIT_LITERAL_PATHSPECS: "1" },
        signal: i,
        stdin: `${c.paths.join("\0")}\0`,
      })),
    f.success ? m : r === "error" ? f : I(t, ["add", "-A", ...l], s, { env: e, signal: i })
  );
}
function e2t(t) {
  return (
    !t.success &&
    t.code === 129 &&
    t.stderr.includes("unknown option") &&
    t.stderr.includes("sparse")
  );
}
async function t2t({ host: t, env: e, gitRoot: r, paths: n, signal: o, untrackedPathSet: i }) {
  if (n.length === 0) return { success: !0, paths: [] };
  let s = await I(r, ["ls-files", "-z", "--", ...n], t, { env: e, signal: o, trim: !1 });
  return s.success
    ? { success: !0, paths: s.stdout.split("\0").filter((a) => a.length > 0 && !i.has(a)) }
    : { success: !1 };
}
function UK(t) {
  return {
    code: null,
    command: "git add",
    stderr: t,
    stderrBytes: Buffer.byteLength(t, "utf8"),
    stdout: "",
    stdoutBytes: 0,
    success: !1,
  };
}
var qO = g(() => {
  fe();
});
async function cv(t, e, r) {
  let n = await tl(r, "codex-index-");
  try {
    let o = await Wy(n, t, r),
      i = { [r2t]: o };
    return await e(i);
  } finally {
    await r.remove(n, { recursive: !0, force: !0 });
  }
}
var r2t,
  GO = g(() => {
    Gy();
    tO();
    r2t = "GIT_INDEX_FILE";
  });
async function dd(t, e) {
  if (e.fresh === !0) return m2e(t, e);
  let r = await n2t(t, e);
  if (r !== "HEAD") return r;
  let n = (await al(t, r, e.signal)).trim();
  if (!Uo(n)) throw new Error(`Unexpected tree SHA: ${n}`);
  return n;
}
