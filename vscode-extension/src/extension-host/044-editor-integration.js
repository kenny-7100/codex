async function YGt({
  path: t,
  appServerClient: e,
  skillRoot: r,
  skillId: n,
  iconSmall: o,
  iconLarge: i,
  isDirectory: s,
}) {
  if (!s) return { iconSmall: o, iconLarge: i };
  let a = t.join(r, "assets");
  if (!(await pl(a, e))) return { iconSmall: o, iconLarge: i };
  let l =
      o ??
      (await nWe(
        a,
        e,
        [
          `${n}-small.svg`,
          `${n}-small.png`,
          "small.svg",
          "small.png",
          `${n}.svg`,
          `${n}.png`,
          "icon-small.svg",
          "icon-small.png",
        ],
        t,
      )),
    c =
      i ??
      (await nWe(
        a,
        e,
        [`${n}.png`, `${n}.svg`, "icon.png", "icon.svg", `${n}-large.png`, `${n}-large.svg`],
        t,
      ));
  return { iconSmall: l, iconLarge: c };
}
async function nWe(t, e, r, n) {
  let o = r.map((s) => n.join(t, s));
  return (
    (await Promise.all(o.map(async (s) => ((await pl(s, e)) ? s : null)))).find((s) => s != null) ??
    null
  );
}
async function JGt({ repoRoot: t, vendorRoot: e, path: r, appServerClient: n }) {
  if (await pl(r.join(t, ".git"), n)) return;
  if (await pl(t, n))
    throw new Error(`Expected ${t} to be a git checkout but found an existing directory`);
  await Qe.mkdir(e, { recursive: !0 }, n);
  let o = await I(e, ["clone", "--depth", "1", "--filter=blob:none", "--sparse", qGt, t], n, {
    timeoutMs: nL,
  });
  if (!o.success) throw new Error(`git clone failed: ${o.stderr || o.stdout}`);
}
async function QGt(t, e) {
  let r = await I(t, ["fetch", "--depth", "1", "origin", GGt], e, { timeoutMs: nL });
  if (!r.success) throw new Error(`git fetch failed: ${r.stderr || r.stdout}`);
  let n = await I(t, ["reset", "--hard", "FETCH_HEAD"], e, { timeoutMs: nL });
  if (!n.success) throw new Error(`git reset failed: ${n.stderr || n.stdout}`);
}
async function eWt(t, e, r) {
  let n = await I(t, ["sparse-checkout", "set", ...e.map((o) => tWt(o))], r, { timeoutMs: nL });
  if (!n.success) throw new Error(`git sparse-checkout failed: ${n.stderr || n.stdout}`);
}
function tWt(t) {
  return t.replace(/\\/g, "/");
}
function oWe(t, e, r) {
  return t.relative(e, r).split(t.sep).join("/");
}
function rWt(t) {
  return Date.now() - t.fetchedAt > jGt;
}
async function pl(t, e) {
  try {
    return (await Qe.stat(t, e), !0);
  } catch {
    return !1;
  }
}
async function nWt(t, e) {
  try {
    let r = await Qe.readFile(t, e),
      n = JSON.parse(r);
    return typeof n.fetchedAt != "number" || !Array.isArray(n.skills) ? null : n;
  } catch {
    return null;
  }
}
async function iWe(t, e, r, n) {
  (await Qe.mkdir(r.dirname(t), { recursive: !0 }, n), await Qe.writeFile(t, JSON.stringify(e), n));
}
function sWe(t) {
  return t.join(...lWe);
}
function aWe(t) {
  return HGt.map((e) => t.join(...e));
}
var lf,
  UGt,
  qGt,
  GGt,
  lWe,
  WGt,
  HGt,
  jGt,
  nL,
  rWe,
  KGt,
  iL = g(() => {
    lf = F(require("node:path"));
    ul();
    O();
    Bn();
    Gs();
    Bt();
    ((UGt = Ie("recommended-skills")),
      (qGt = "https://github.com/openai/skills.git"),
      (GGt = "main"),
      (lWe = ["skills", ".curated"]),
      (WGt = ["skills", ".experimental"]),
      (HGt = [lWe, WGt]),
      (jGt = 10 * 6e4),
      (nL = 3e4));
    rWe = {
      name: "name",
      description: "description",
      "short-description": "shortDescription",
      short_description: "shortDescription",
      shortDescription: "shortDescription",
      "icon-small": "iconSmall",
      icon_small: "iconSmall",
      iconSmall: "iconSmall",
      "icon-large": "iconLarge",
      icon_large: "iconLarge",
      iconLarge: "iconLarge",
    };
    KGt = {
      short_description: "shortDescription",
      shortDescription: "shortDescription",
      "short-description": "shortDescription",
      icon_small: "iconSmall",
      iconSmall: "iconSmall",
      "icon-small": "iconSmall",
      icon_large: "iconLarge",
      iconLarge: "iconLarge",
      "icon-large": "iconLarge",
    };
  });
async function dWe({
  skillId: t,
  repoPath: e,
  installRoot: r,
  skillStatsigOverride: n,
  forceReinstall: o = !1,
  source: i,
  preferWsl: s = !1,
  bundledRepoRoot: a = null,
  appServerClient: l,
}) {
  let c = tn(l.hostConfig)
      ? l.hostConfig.kind === uu
        ? l.hostConfig.id
        : l.hostConfig.terminal_command.join(" ")
      : void 0,
    u = tn(l.hostConfig) ? await l.codexHome() : Xt({ preferWsl: s }),
    p = await l.platformPath(),
    m = r ? p.join(r, ".codex", "skills") : p.join(u, "skills"),
    f = pWe({ root: m, relativePath: t, path: p, errorMessage: `Invalid skill id: ${t}` });
  if (n != null) {
    if (n.trim().length === 0)
      throw new Error(`Recommended skill markdown override is empty: ${t}`);
    if (i == null)
      return (
        await Qe.mkdir(f, { recursive: !0 }, l),
        await Qe.writeFile(p.join(f, "SKILL.md"), n, l),
        { destination: f }
      );
  }
  let h = p.join(u, "vendor_imports", "skills"),
    v = c || !a ? null : t9.default.resolve(a),
    y = await cWe({
      repoRoot: h,
      bundledRepoRoot: v,
      repoPath: e,
      source: i,
      path: p,
      appServerClient: l,
    });
  if (
    (!y &&
      i == null &&
      (await oL({ refresh: !0, preferWsl: s, bundledRepoRoot: v, appServerClient: l }),
      (y = await cWe({
        repoRoot: h,
        bundledRepoRoot: v,
        repoPath: e,
        source: i,
        path: p,
        appServerClient: l,
      }))),
    !y)
  )
    throw new Error(`Recommended skill not found at ${e}`);
  return !o && n == null && (await e9(f, l))
    ? { destination: f }
    : (o && (await Qe.rm(f, { force: !0, recursive: !0 }, l)),
      await Qe.mkdir(m, { recursive: !0 }, l),
      (await Qe.stat(y, l)).isDirectory()
        ? await Qe.cp(y, f, { recursive: !0 }, l)
        : (await Qe.mkdir(f, { recursive: !0 }, l), await Qe.copyFile(y, p.join(f, "SKILL.md"), l)),
      n != null && (await Qe.writeFile(p.join(f, "SKILL.md"), n, l)),
      { destination: f });
}
async function cWe({
  repoRoot: t,
  bundledRepoRoot: e,
  repoPath: r,
  source: n,
  path: o,
  appServerClient: i,
}) {
  if (n == null) {
    let a = uWe(t, r, o);
    if (await e9(a, i)) return a;
  }
  if (!e) return null;
  let s = uWe(e, r, t9.default);
  return (await e9(s, i)) ? s : null;
}
function uWe(t, e, r) {
  return pWe({ root: t, relativePath: e, path: r, errorMessage: `Invalid skill repo path: ${e}` });
}
function pWe({ root: t, relativePath: e, path: r, errorMessage: n }) {
  let o = r.resolve(t),
    i = r.resolve(o, e.split("/").join(r.sep));
  if (i.startsWith(`${o}${r.sep}`)) return i;
  throw new Error(n);
}
async function e9(t, e) {
  try {
    return (await Qe.stat(t, e), !0);
  } catch {
    return !1;
  }
}
var t9,
  mWe = g(() => {
    t9 = F(require("node:path"));
    O();
    Bn();
    Gs();
    iL();
  });
async function gWe({ skillPath: t, preferWsl: e = !1, appServerClient: r }) {
  let [n, o, i] = await Promise.all([
      tn(r.hostConfig) ? r.codexHome() : Xt({ preferWsl: e }),
      r.platformPath(),
      r.platformOs(),
    ]),
    s = o.resolve(n, "skills"),
    a = oWt({ skillPath: t, codexHome: n, skillsRoot: s, path: o }),
    l = await iWt({ candidates: a, skillsRoot: s, path: o, platformOs: i, appServerClient: r });
  if (!l) throw new Error(`Skill path is not removable: ${t}`);
  return (await Qe.rm(l, { recursive: !0, force: !0 }, r), { deletedPath: l });
}
function oWt({ skillPath: t, codexHome: e, skillsRoot: r, path: n }) {
  let o = new Set(),
    i = t.replace(/[\\/]+$/, ""),
    s = i.replace(/\\/g, "/");
  return (
    o.add(n.resolve(i)),
    s.startsWith(".codex/") && o.add(n.resolve(n.dirname(e), i)),
    s.startsWith("skills/") && o.add(n.resolve(r, s.slice(7))),
    o.add(n.resolve(e, i)),
    o.add(n.resolve(r, i)),
    [...o]
  );
}
async function iWt({ candidates: t, skillsRoot: e, path: r, platformOs: n, appServerClient: o }) {
  return (
    (
      await Promise.all(
        t.map(async (s) => {
          let a = await aWt(s, o);
          if (!a) return null;
          let l = a.isDirectory() ? s : r.dirname(s);
          return sWt(l, e, r, n) ? l : null;
        }),
      )
    ).find((s) => s != null) ?? null
  );
}
function sWt(t, e, r, n) {
  let o = r.resolve(t),
    i = n === "macos" ? hWe(e) : e,
    s = n === "macos" ? hWe(o) : o;
  if (fWe(i, s, r)) return !0;
  let a = r.parse(o).root,
    l = o.slice(a.length).split(r.sep).filter(Boolean),
    c = lWt(l, r);
  return c != null && fWe(r.join(a, ...l.slice(0, c + 2)), o, r);
}
function fWe(t, e, r) {
  let n = r.relative(t, e);
  return n !== "" && n !== ".." && !n.startsWith(`..${r.sep}`) && !r.isAbsolute(n);
}
async function aWt(t, e) {
  try {
    return await Qe.stat(t, e);
  } catch {
    return null;
  }
}
function lWt(t, e) {
  for (let r = 0; r < t.length - 1; r += 1) {
    let n = t[r],
      o = t[r + 1];
    if (
      (e.sep === "\\" ? n?.toLowerCase() : n) === ".codex" &&
      (e.sep === "\\" ? o?.toLowerCase() : o) === "skills"
    )
      return r;
  }
  return null;
}
function hWe(t) {
  return t.replace(/^\/private(?=\/(?:tmp|var)(?:\/|$))/u, "");
}
var yWe = g(() => {
  O();
  Bn();
  Gs();
});
var sL,
  vWe = g(() => {
    ot();
    Bt();
    mWe();
    iL();
    yWe();
    sL = class extends ee {
      constructor(r) {
        super();
        this.getOptions = r;
      }
      logger = Dt("RecommendedSkillsService");
      list({ hostId: r, refresh: n }) {
        return oL({ ...this.getOptions(r), refresh: n });
      }
      async install({ hostId: r, ...n }) {
        try {
          let o = this.getOptions(r),
            { destination: i } = await dWe({
              ...n,
              ...o,
              source: o.bundledRepoRoot === void 0 ? void 0 : n.source,
            });
          return { success: !0, destination: i, error: null };
        } catch (o) {
          let i = o instanceof Error ? o.message : String(o);
          return (
            this.logger.warning("Failed to install recommended skill", {
              safe: {},
              sensitive: { error: o },
            }),
            { success: !1, destination: null, error: i }
          );
        }
      }
      async remove({ hostId: r, skillPath: n }) {
        try {
          let { deletedPath: o } = await gWe({ ...this.getOptions(r), skillPath: n });
          return { success: !0, deletedPath: o, error: null };
        } catch (o) {
          let i = o instanceof Error ? o.message : String(o);
          return (
            this.logger.warning("Failed to remove skill", { safe: {}, sensitive: { error: o } }),
            { success: !1, deletedPath: null, error: i }
          );
        }
      }
    };
  });
var bWe = g(() => {});
var aL,
  SWe = g(() => {
    O();
    aL = class {
      configDeferred = pt();
      config = null;
      get() {
        return this.configDeferred.promise;
      }
      getResolved() {
        return this.config;
      }
      resolve(e) {
        ((this.config = e), this.configDeferred.resolve(e));
      }
      reject(e) {
        this.configDeferred.reject(e);
      }
    };
  });
function _We(t) {
  return [
    "You are in a fork of an existing Codex thread.",
    `Fill the structured description field with a compact, search-oriented summary (up to ${100} characters) of the thread's current purpose.`,
    "This is a keyword retrieval index, not a broad prose summary.",
    "Prioritize the most recent active purpose over older topics if the thread has shifted.",
    "Repeat 3 to 6 distinctive nouns or short phrases from the most recent relevant user messages verbatim. Do not generalize technical terms into broader categories.",
    "Write in the user's locale.",
    t == null ? null : `Current title: ${t}`,
    "Do not include quotes, markdown, formatting characters, or trailing punctuation.",
    "Do not respond to the user or do any other work; only fill the description field.",
  ].filter((e) => e != null).join(`
`);
}
var xWe = g(() => {
  O();
});
async function TWe({
  prompt: t,
  maxTitleChars: e = 36,
  cwd: r,
  serviceTier: n,
  appServerClient: o,
  model: i = $x,
  timeoutMs: s = AWe,
  sourceThreadId: a,
  fallbackToFreshThread: l,
  experimentalPredictionMode: c,
  readOnlyAppToolAllowlist: u = [],
  serviceName: p,
  signal: m,
}) {
  let f = t.trim();
  if (f.length === 0) return null;
  let h = a == null ? await IM(o, i, r, m) : i,
    v = d.object({ title: d.string().min(1).max(dWt), description: RWe }),
    y = await kWe({
      appServerClient: o,
      model: h,
      readOnlyAppToolAllowlist: u,
      cwd: r,
      fallbackToFreshThread: c ? !1 : l,
      feature: "thread_title",
      experimentalPredictionMode: c,
      outputSchema: c ? null : Bo(v),
      prompt: f,
      responseSchema: v,
      serviceTier: n,
      serviceName: p,
      signal: m,
      sourceThreadId: a,
      timeoutMs: s,
    }),
    w = Mye(y?.title ?? "", e);
  return w == null ? null : { title: w, description: IWe(y?.description) };
}
async function PWe({
  title: t,
  cwd: e,
  serviceTier: r,
  appServerClient: n,
  model: o = $x,
  timeoutMs: i = AWe,
  sourceThreadId: s,
  serviceName: a,
  signal: l,
}) {
  let c = await kWe({
    appServerClient: n,
    model: o,
    cwd: e,
    fallbackToFreshThread: !1,
    feature: "thread_description",
    outputSchema: mWt,
    prompt: _We(t),
    responseSchema: EWe,
    serviceTier: r,
    serviceName: a,
    signal: l,
    sourceThreadId: s,
    timeoutMs: i,
  });
  return IWe(c?.description);
}
function IWe(t) {
  return t?.replace(/\s+/g, " ").trim().slice(0, 100).trimEnd() || null;
}
async function kWe({
  appServerClient: t,
  model: e,
  readOnlyAppToolAllowlist: r = [],
  cwd: n,
  fallbackToFreshThread: o,
  experimentalPredictionMode: i,
  feature: s,
  outputSchema: a,
  prompt: l,
  responseSchema: c,
  serviceTier: u,
  serviceName: p,
  signal: m,
  sourceThreadId: f,
  timeoutMs: h,
}) {
  let v = null,
    y = null,
    w = i ? null : pWt;
  try {
    let _ = await kM({
      prompt: l,
      cwd: n,
      model: e,
      effort: w,
      serviceTier: u,
      serviceName: p,
      threadSource: s,
      schema: a,
      config: {
        mcp_servers: await gWt(t, n, r.length > 0, m),
        "features.enable_fanout": !1,
        "features.hooks": !1,
        "features.multi_agent": !1,
        "features.multi_agent_v2": !1,
        "features.plugins": !1,
        "features.shell_snapshot": !1,
        "features.tool_suggest": !1,
        ...yWt(r),
        web_search: "disabled",
      },
      timeoutMs: h,
      client: t,
      responseSchema: c,
      sourceThreadId: f,
      fallbackToFreshThread: o,
      experimentalPredictionMode: i,
      signal: m,
      onTokenUsage: (S) => {
        ((v = v ?? S), (y = S));
      },
    });
    return (
      Fu({
        feature: s,
        firstTokenUsage: v,
        model: e,
        reasoningEffort: w,
        serviceTier: u ?? null,
        status: _ == null ? "empty" : "success",
        tokenUsage: y,
      }),
      _
    );
  } catch (_) {
    throw (
      Fu({
        feature: s,
        firstTokenUsage: v,
        model: e,
        reasoningEffort: w,
        serviceTier: u ?? null,
        status: _ instanceof Error && _.name === "AbortError" ? "canceled" : "error",
        tokenUsage: y,
      }),
      _
    );
  }
}
async function gWt(t, e, r, n) {
  if ((n?.throwIfAborted(), t.getUserSavedConfiguration != null))
    try {
      let o = t.getUserSavedConfiguration(e ?? void 0),
        i = n == null ? await o : await Lt(o, n),
        s = hWt.safeParse(i.mcp_servers);
      return s.success
        ? Object.fromEntries(
            Object.keys(s.data)
              .filter((a) => !r || a !== "codex_apps")
              .map((a) => [a, { enabled: !1 }]),
          )
        : void 0;
    } catch {
      n?.throwIfAborted();
      return;
    }
}
function yWt(t) {
  return {
    "features.apps": t.length > 0,
    apps: {
      ...Object.fromEntries(
        t.map(({ appId: e, toolNames: r }) => [
          e,
          {
            enabled: !0,
            destructive_enabled: !1,
            open_world_enabled: !1,
            default_tools_enabled: !1,
            tools: Object.fromEntries(r.map((n) => [n, { enabled: !0 }])),
          },
        ]),
      ),
      _default: { enabled: !1, destructive_enabled: !1, open_world_enabled: !1 },
    },
  };
}
var AWe,
  dWt,
  pWt,
  RWe,
  EWe,
  mWt,
  CWe,
  yin,
  fWt,
  vin,
  hWt,
  DWe = g(() => {
    O();
    $();
    Kg();
    OM();
    f3();
    DM();
    xWe();
    lm();
    ((AWe = 3e4),
      (dWt = 60),
      (pWt = "low"),
      (RWe = d.string().min(1)),
      (EWe = d.object({ description: RWe })),
      (mWt = Bo(EWe)),
      (CWe = d.object({ summary: d.string().min(1) })),
      (yin = Bo(CWe)),
      (fWt = CWe.extend({ compactSummary: d.string().min(1).max(60) })),
      (vin = Bo(fWt)),
      (hWt = d.record(d.string(), d.object({}))));
  });
var OWe,
  NWe,
  LWe,
  vWt,
  MWe,
  lL,
  BWe = g(() => {
    ot();
    OWe = F(Bu());
    O();
    $();
    ((NWe = d.string().min(1).transform(xa)),
      (LWe = d.object({
        threadId: NWe,
        assignment: kg.nullable(),
        hostId: d.string().min(1).optional(),
      })),
      (vWt = d.object({ threadId: NWe, projectless: d.boolean() })),
      (MWe = LWe.extend({ projectless: d.boolean() })),
      (lL = class extends ee {
        constructor(r, n, o) {
          super();
          this.storage = r;
          this.publish = n;
          this.writeMembership = o;
        }
        pendingWrite = Promise.resolve();
        pendingCatalogWrite = Promise.resolve();
        pendingThreadWrites = new Map();
        async readMemberships() {
          return (await this.pendingWrite, this.storage.read());
        }
        async setAssignment(r, n) {
          let o = LWe.parse(r);
          await this.#e([o], n);
        }
        async setProjectless(r) {
          let n = vWt.parse(r);
          await this.#e([n]);
        }
        async setMembership(r) {
          await this.restoreMemberships([r]);
        }
        async restoreMemberships(r) {
          let n = d.array(MWe).parse(r);
          await this.#e(n);
        }
        async assignIfUnassigned(r) {
          let n = d.array(MWe).parse(r);
          await this.#e(n, void 0, !0);
        }
        async moveLocalProjectThreadsToProjectless(r) {
          let n = d.string().min(1).parse(r);
          return this.#t((o) =>
            Object.entries(o.assignments).flatMap(([i, s]) =>
              s.projectKind === "local" && s.projectId === n
                ? [{ threadId: i, assignment: null, projectless: !0 }]
                : [],
            ),
          );
        }
        async reset() {
          await this.#t((r) =>
            [...new Set([...Object.keys(r.assignments), ...r.projectlessThreadIds])].map((n) => ({
              threadId: n,
              assignment: null,
              projectless: !1,
            })),
          );
        }
        async flush() {
          (await Promise.allSettled([
            ...this.pendingThreadWrites.values(),
            this.pendingCatalogWrite,
          ]),
            await this.pendingWrite);
        }
        #e(r, n, o = !1) {
          return this.writeMembership == null
            ? this.#n((i) => {
                let s = o
                  ? new Set([...Object.keys(i.assignments), ...i.projectlessThreadIds])
                  : null;
                return r.flatMap((a) =>
                  s?.has(a.threadId) ? [] : (s?.add(a.threadId), [{ ...Jw(i, a.threadId), ...a }]),
                );
              })
            : this.#r(r, n, o, this.pendingCatalogWrite, !0);
        }
        #t(r) {
          if (this.writeMembership == null) return this.#n(r);
          let n = [...this.pendingThreadWrites.values()],
            o = this.pendingCatalogWrite,
            i = (async () => {
              (await Promise.allSettled(n), await o, await this.pendingWrite);
              let s = r(await this.storage.read());
              return this.#r(s, void 0, !1, Promise.resolve(), !1);
            })();
          return (
            (this.pendingCatalogWrite = i.then(
              () => {},
              () => {},
            )),
            i
          );
        }
        async #r(r, n, o, i, s) {
          let a = i,
            l = (0, OWe.default)(r, 8).map((p) => {
              let m = a,
                f = p.map((v) => {
                  let y = async () => {
                    (await m, await this.pendingWrite);
                    let S = await this.storage.read(),
                      E = Jw(S, v.threadId);
                    if (o && (E.assignment != null || E.projectless)) return [];
                    let T = { ...E, ...v },
                      P = [];
                    return (
                      await this.writeMembership?.(
                        T,
                        async () => {
                          P = await this.#n(() => [T]);
                        },
                        n,
                      ),
                      P
                    );
                  };
                  if (!s) return y();
                  let w = (this.pendingThreadWrites.get(v.threadId) ?? Promise.resolve()).then(y),
                    _ = w
                      .then(
                        () => {},
                        () => {},
                      )
                      .finally(() => {
                        this.pendingThreadWrites.get(v.threadId) === _ &&
                          this.pendingThreadWrites.delete(v.threadId);
                      });
                  return (this.pendingThreadWrites.set(v.threadId, _), w);
                }),
                h = Promise.allSettled(f).then((v) => {
                  let y = [];
                  for (let w of v) {
                    if (w.status === "rejected") throw w.reason;
                    y.push(...w.value);
                  }
                  return y;
                });
              return ((a = h), h);
            }),
            c = await Promise.allSettled(l),
            u = [];
          for (let p of c) {
            if (p.status === "rejected") throw p.reason;
            u.push(...p.value);
          }
          return u;
        }
        #n(r) {
          let n = this.pendingWrite.then(async () => {
            let o = this.storage.read(),
              i = o instanceof Promise ? await o : o,
              s = r(i),
              { records: a, memberships: l } = lH(i, s),
              c = Object.keys(l).map(xa);
            if (c.length === 0) return [];
            let u = c.map((p) => ({ threadId: p, ...Jw(i, p) }));
            try {
              await this.storage.write(i, a);
            } catch (p) {
              let m = await this.storage.read(),
                f = lH(
                  i,
                  c.map((h) => ({ threadId: h, ...Jw(m, h) })),
                ).memberships;
              throw (Object.keys(f).length > 0 && this.publish(f), p);
            }
            return (this.publish(l), u);
          });
          return (
            (this.pendingWrite = n.then(
              () => {},
              () => {},
            )),
            n
          );
        }
      }));
  });
var Ein,
  n9 = g(() => {
    O();
    Bt();
    Ein = Ie("computer-use-worker");
  });
var bWt,
  o9 = g(() => {
    bWt = F(Gx());
    O();
  });
var FWe = g(() => {
  n9();
  o9();
});
function i9(t) {
  return UWe(t, !1);
}
function $We(t) {
  return UWe([t], !0);
}
async function UWe(t, e) {
  let r = new Map(),
    n = (i, s) => {
      let a = r.get(i) ?? new Set();
      (r.set(i, a), a.add(s));
    },
    o = process.platform === "win32" ? /[\\/]/ : bd.default.sep;
  return (
    await Promise.all(
      [...new Set(t)].map(async (i) => {
        if (!bd.default.isAbsolute(i))
          throw new TypeError("Ignore-source watch paths must be absolute");
        let s = bd.default.parse(i).root,
          a = i.slice(s.length).split(o),
          l = new Set(),
          c = 0;
        for (; a.length > 0; ) {
          let u = a.shift();
          if (u == null || u === "" || u === ".") continue;
          if (u === "..") {
            s = bd.default.dirname(s);
            continue;
          }
          let p = bd.default.join(s, u);
          (!e || c > 0) && n(s, p);
          try {
            let m = await (0, cL.lstat)(p);
            if (m.isSymbolicLink()) {
              e && n(s, p);
              let f = `${p}\0${a.join(bd.default.sep)}`;
              if (((c += 1), l.has(f) || c > SWt))
                throw Object.assign(
                  new Error("Cannot follow cyclic or excessive ignore-source symlinks"),
                  { code: "ELOOP" },
                );
              l.add(f);
              let h = await (0, cL.readlink)(p),
                v = bd.default.parse(h).root;
              (v !== "" && (s = v), a.unshift(...h.slice(v.length).split(o)));
            } else if (m.isDirectory()) s = p;
            else return;
          } catch (m) {
            if (bt(m)) {
              e && n(s, p);
              return;
            }
            throw m;
          }
        }
      }),
    ),
    r
  );
}
var cL,
  bd,
  SWt,
  s9 = g(() => {
    ((cL = require("node:fs/promises")), (bd = F(require("node:path"))));
    O();
    SWt = 40;
  });
function qWe({
  createExecutionHost: t,
  emit: e,
  gitManager: r,
  getWatchIgnoreSources: n,
  startMetadataWatch: o,
  startWorkingTreeWatch: i,
}) {
  if (t == null) throw new Error("Git worker requires an execution host factory");
  return new TN(e, r, {
    createExecutionHost: t,
    getSymlinkWatchTargets: $We,
    requestGitHub: (s, a) =>
      ZN(r, (c) => {
        let u = c ?? s.hostConfig?.id ?? "local",
          p = s.hostConfigs.find((m) => m.id === u);
        if (p == null) throw new Error(`Execution host ${u} not found`);
        return t(p);
      })(
        s.request.method,
        s.request.params,
        s.operationSource,
        a,
        s.progressId == null
          ? void 0
          : async (c) => {
              !a.aborted &&
                s.progressId != null &&
                e({
                  type: "worker-event",
                  event: { type: "github-request-progress", progressId: s.progressId, result: c },
                });
            },
      ),
    readGitFileBinary: (s, a, l) => PN(s, r, a, l),
    prepareWorktreeSnapshot: LA,
    getWatchIgnoreSources: n,
    startMetadataWatch: o,
    startWorkingTreeWatch: i,
  });
}
var GWe = g(() => {
  ul();
  J5();
  $5();
  $8();
  s9();
});
async function WWe(t) {
  if (t.status !== 401) return null;
  try {
    let e = wWt.safeParse(await t.clone().json());
    if (!e.success) return null;
    let { error: r } = e.data;
    return r.type !== "ip_not_authorized" &&
      r.code !== "ip_not_authorized" &&
      r.code !== "validate_whitelist_failed" &&
      r.code !== "workspace_ip_not_authorized"
      ? null
      : {
          errorCode: "ip_not_authorized",
          message:
            r.message ||
            "Your current IP address is not authorized for this workspace. Connect from an approved network or contact your workspace administrator for access.",
        };
  } catch {
    return null;
  }
}
var wWt,
  HWe = g(() => {
    $();
    wWt = d.object({
      error: d.object({
        type: d.string().nullish(),
        code: d.string().nullish(),
        message: d.string().nullish(),
      }),
    });
  });
var Vin,
  a9 = g(() => {
    $();
    _m();
    Vin = d.object({
      type: d.literal("match"),
      data: d.object({
        path: d.object({ text: d.string() }),
        lines: d.object({ text: d.string() }),
        line_number: d.number().int().positive(),
        submatches: d.array(
          d.object({ start: d.number().int().nonnegative(), end: d.number().int().nonnegative() }),
        ),
      }),
    });
  });
var jWe = g(() => {
  O();
  a9();
});
var zWe,
  VWe,
  rsn,
  KWe = g(() => {
    ((zWe = require("node:child_process")), (VWe = require("node:util")));
    os();
    Dx();
    rsn = (0, VWe.promisify)(zWe.execFile);
  });
var jA,
  ZWe = g(() => {
    ot();
    jA = class extends ee {
      constructor(r) {
        super();
        this.locks = r;
      }
      async acquire(r) {
        return { acquired: this.locks.tryAcquire(r) };
      }
      async release(r) {
        this.locks.release(r);
      }
    };
  });
var zA,
  XWe = g(() => {
    ot();
    z6();
    zA = class extends ee {
      constructor(r) {
        super();
        this.readHomeDirectory = r;
      }
      async filter({ hostId: r, permissions: n, threadDetailLevel: o }) {
        return {
          permissions: bDe({
            homeDirectory: (await this.readHomeDirectory(r)).homeDirectory,
            permissions: n,
            threadDetailLevel: o,
          }),
        };
      }
    };
  });
var VA,
  YWe = g(() => {
    ot();
    Aj();
    VA = class extends ee {
      constructor(r) {
        super();
        this.getOptions = r;
      }
      async read({ hostId: r }) {
        return Dwe(this.getOptions(r));
      }
      async write({ hostId: r, contents: n }) {
        return Mwe(n, this.getOptions(r));
      }
    };
  });
var KA,
  Sv,
  JWe = g(() => {
    ot();
    ((KA = class extends ee {
      constructor(r) {
        super();
        this.handlers = r;
      }
      mergeBase(r, n) {
        return new Sv((o) => this.handlers.mergeBase(r, n, o));
      }
      push(r, n) {
        return new Sv((o) => this.handlers.push(r, n, o));
      }
      createBranch(r, n) {
        return new Sv((o) => this.handlers.createBranch(r, n, o));
      }
      checkoutBranch(r, n) {
        return new Sv((o) => this.handlers.checkoutBranch(r, n, o));
      }
    }),
      (Sv = class extends ee {
        abortController = new AbortController();
        result;
        settled = !1;
        constructor(e) {
          (super(),
            (this.result = e(this.abortController.signal).finally(() => {
              this.settled = !0;
            })),
            this.result.catch(() => {}));
        }
        wait() {
          return this.result;
        }
        [Symbol.dispose]() {
          this.settled || this.abortController.abort();
        }
      }));
  });
var ZA,
  QWe = g(() => {
    ot();
    ZA = class extends ee {
      constructor(r) {
        super();
        this.readRoots = r;
      }
      #e = new Map();
      async read(r, n) {
        let o = new AbortController();
        this.#e.set(r, o);
        try {
          return await this.readRoots(n, o.signal);
        } finally {
          this.#e.delete(r);
        }
      }
      cancel(r) {
        this.#e.get(r)?.abort();
      }
      [Symbol.dispose]() {
        for (let r of this.#e.values()) r.abort();
        this.#e.clear();
      }
    };
  });
async function l9({ tarballPath: t, uploadUrl: e, contentType: r, signal: n }) {
  try {
    let o = await Yl(e, {
      method: "PUT",
      signal: n,
      headers: { "Content-Type": r, "x-ms-blob-type": "BlockBlob" },
      body: await (0, uL.openAsBlob)(t, { type: r }),
    });
    if (!o.ok) {
      let i = await o.text().catch(() => "");
      throw new Error(
        `Snapshot upload failed with status ${o.status} ${o.statusText}${i ? `: ${i}` : ""}`,
      );
    }
  } finally {
    await uL.promises.unlink(t).catch(() => {});
  }
}
var uL,
  c9 = g(() => {
    uL = require("node:fs");
    _u();
  });
var eHe,
  XA,
  u9,
  tHe = g(() => {
    eHe = require("node:fs");
    ot();
    Bt();
    c9();
    ((XA = class extends ee {
      constructor(r, n = l9) {
        super();
        this.prepareSnapshot = r;
        this.uploadArchive = n;
      }
      operations = new Set();
      prepare(r) {
        let n = new u9(r, this.prepareSnapshot, this.uploadArchive, () =>
          this.operations.delete(n),
        );
        return (this.operations.add(n), n);
      }
      [Symbol.dispose]() {
        for (let r of this.operations) r.cancel();
        this.operations.clear();
      }
    }),
      (u9 = class extends ee {
        constructor(r, n, o, i) {
          super();
          this.uploadArchive = o;
          this.release = i;
          ((this.snapshot = n(r, this.controller.signal)), this.snapshot.catch(() => {}));
        }
        logger = Dt("worktree-snapshots");
        controller = new AbortController();
        snapshot;
        uploadResult;
        async info() {
          let { tarballPath: r, ...n } = await this.snapshot;
          return (this.controller.signal.throwIfAborted(), n);
        }
        upload(r) {
          return (
            this.uploadResult == null && (this.uploadResult = this.uploadSnapshot(r)),
            this.uploadResult
          );
        }
        cancel() {
          (this.controller.abort(),
            this.release(),
            this.snapshot
              .then(({ tarballPath: r }) => eHe.promises.rm(r, { force: !0 }))
              .catch(() => {}));
        }
        [Symbol.dispose]() {
          this.cancel();
        }
        async uploadSnapshot(r) {
          try {
            let n = await this.snapshot;
            return (
              this.controller.signal.throwIfAborted(),
              await this.uploadArchive({
                tarballPath: n.tarballPath,
                uploadUrl: r,
                contentType: n.contentType,
                signal: this.controller.signal,
              }),
              { success: !0 }
            );
          } catch (n) {
            return (
              this.controller.signal.aborted ||
                this.logger.warning("Failed to upload worktree snapshot", {
                  safe: {},
                  sensitive: { error: n },
                }),
              { success: !1 }
            );
          } finally {
            this.cancel();
          }
        }
      }));
  });
var Pt = g(() => {
  _u();
  Kve();
  hwe();
  gwe();
  Aj();
  Vwe();
  e_e();
  H_e();
  j_e();
  rDe();
  nDe();
  C4();
  sDe();
  lDe();
  aD();
  z4();
  lx();
  W6();
  fDe();
  vm();
  cm();
  nV();
  eV();
  tV();
  G6();
  Ga();
  L6();
  gDe();
  hM();
  fM();
  U6();
  NV();
  B6();
  iy();
  F6();
  z6();
  $u();
  dm();
  Tz();
  _De();
  EDe();
  _m();
  RD();
  kDe();
  rx();
  K6();
  NDe();
  Bn();
  oMe();
  $0();
  kz();
  os();
  zMe();
  u3();
  JMe();
  sV();
  m3();
  MM();
  fOe();
  V1e();
  t$e();
  OM();
  B0();
  DM();
  L0();
  lm();
  n$e();
  o$e();
  W5();
  u$e();
  m$e();
  Gs();
  f$e();
  h$e();
  y$e();
  v$e();
  J$e();
  eUe();
  ul();
  tUe();
  dUe();
  Sz();
  v3();
  J5();
  t8();
  s8();
  a8();
  gi();
  UUe();
  $8();
  M8();
  L8();
  B8();
  Yr();
  S8();
  u8();
  w8();
  F8();
  N8();
  D8();
  mGe();
  hGe();
  gGe();
  MGe();
  LGe();
  BGe();
  Ij();
  Kg();
  qGe();
  Bt();
  GGe();
  W0();
  G0();
  U_();
  WGe();
  HGe();
  ZGe();
  Pj();
  GD();
  Dx();
  JGe();
  QGe();
  eWe();
  qD();
  iL();
  vWe();
  Ku();
  X5();
  um();
  bWe();
  SWe();
  d3();
  p3();
  DWe();
  BWe();
  FWe();
  GWe();
  s9();
  n9();
  o9();
  HWe();
  Ua();
  E4();
  jWe();
  a9();
  KWe();
  ZWe();
  XWe();
  YWe();
  JWe();
  QWe();
  tHe();
  c9();
});
function Wn(t, e) {
  return h9().get(t) ?? e;
}
async function nHe(t, e) {
  let r = _Wt[t] ?? wv.ConfigurationTarget.Global;
  await h9().update(t, e, r);
}
function oHe(t) {
  let e = h9().inspect(t);
  return [
    e?.globalValue,
    e?.workspaceValue,
    e?.workspaceFolderValue,
    e?.globalLanguageValue,
    e?.workspaceLanguageValue,
    e?.workspaceFolderLanguageValue,
  ].some((n) => n !== void 0)
    ? Wn(t)
    : void 0;
}
function h9() {
  return wv.workspace.getConfiguration("chatgpt");
}
var wv,
  _Wt,
  Sd = g(() => {
    "use strict";
    ((wv = F(require("vscode"))),
      (_Wt = {
        commentCodeLensEnabled: wv.ConfigurationTarget.Workspace,
        openOnStartup: wv.ConfigurationTarget.Workspace,
      }));
  });
var wd = g(() => {
  "use strict";
});
function aHe(t) {
  sHe = t;
}
function g9(t) {
  return $Ge(t, Wn("logLevel", xWt));
}
function AWt() {
  let t = iHe.window.createOutputChannel("Codex", { log: !0 }),
    e = (o, i) => (s, a) => {
      if (!g9(o)) return;
      let l = a ?? { safe: {} },
        c = { ...l.safe, ...l.sensitive },
        u = Object.keys(c).length === 0 ? s : `${s} ${xH(c)}`;
      (i(u), sHe?.log(o, s, l.safe));
    },
    r = {
      trace: e("trace", t.trace.bind(t)),
      debug: e("debug", t.debug.bind(t)),
      info: e("info", t.info.bind(t)),
      warning: e("warning", t.warn.bind(t)),
      error: e("error", t.error.bind(t)),
    },
    n = {
      trace: r.trace,
      debug: r.debug,
      info: r.info,
      warning: r.warning,
      error: r.error,
      log: (o, i, s) => {
        r[o](i, s);
      },
      dispose: () => t.dispose(),
    };
  return (_H(n), Swe(() => !1), n);
}
var iHe,
  xWt,
  sHe,
  _o,
  xo = g(() => {
    "use strict";
    Pt();
    iHe = F(require("vscode"));
    Sd();
    wd();
    ((xWt = UGe("prod")), (sHe = null));
    _o = AWt();
  });
var LR = A((Vt) => {
  "use strict";
  Object.defineProperty(Vt, "__esModule", { value: !0 });
  Vt.regexpCode =
    Vt.getEsmExportName =
    Vt.getProperty =
    Vt.safeStringify =
    Vt.stringify =
    Vt.strConcat =
    Vt.addCodeArg =
    Vt.str =
    Vt._ =
    Vt.nil =
    Vt._Code =
    Vt.Name =
    Vt.IDENTIFIER =
    Vt._CodeOrName =
      void 0;
  var OR = class {};
  Vt._CodeOrName = OR;
  Vt.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  var If = class extends OR {
    constructor(e) {
      if ((super(), !Vt.IDENTIFIER.test(e)))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = e;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  };
  Vt.Name = If;
  var Ss = class extends OR {
    constructor(e) {
      (super(), (this._items = typeof e == "string" ? [e] : e));
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1) return !1;
      let e = this._items[0];
      return e === "" || e === '""';
    }
    get str() {
      var e;
      return (e = this._str) !== null && e !== void 0
        ? e
        : (this._str = this._items.reduce((r, n) => `${r}${n}`, ""));
    }
    get names() {
      var e;
      return (e = this._names) !== null && e !== void 0
        ? e
        : (this._names = this._items.reduce(
            (r, n) => (n instanceof If && (r[n.str] = (r[n.str] || 0) + 1), r),
            {},
          ));
    }
  };
  Vt._Code = Ss;
  Vt.nil = new Ss("");
  function PVe(t, ...e) {
    let r = [t[0]],
      n = 0;
    for (; n < e.length; ) (xX(r, e[n]), r.push(t[++n]));
    return new Ss(r);
  }
  Vt._ = PVe;
  var _X = new Ss("+");
  function IVe(t, ...e) {
    let r = [NR(t[0])],
      n = 0;
    for (; n < e.length; ) (r.push(_X), xX(r, e[n]), r.push(_X, NR(t[++n])));
    return (LVt(r), new Ss(r));
  }
  Vt.str = IVe;
  function xX(t, e) {
    e instanceof Ss ? t.push(...e._items) : e instanceof If ? t.push(e) : t.push($Vt(e));
  }
  Vt.addCodeArg = xX;
  function LVt(t) {
    let e = 1;
    for (; e < t.length - 1; ) {
      if (t[e] === _X) {
        let r = BVt(t[e - 1], t[e + 1]);
        if (r !== void 0) {
          t.splice(e - 1, 3, r);
          continue;
        }
        t[e++] = "+";
      }
      e++;
    }
  }
  function BVt(t, e) {
    if (e === '""') return t;
    if (t === '""') return e;
    if (typeof t == "string")
      return e instanceof If || t[t.length - 1] !== '"'
        ? void 0
        : typeof e != "string"
          ? `${t.slice(0, -1)}${e}"`
          : e[0] === '"'
            ? t.slice(0, -1) + e.slice(1)
            : void 0;
    if (typeof e == "string" && e[0] === '"' && !(t instanceof If)) return `"${t}${e.slice(1)}`;
  }
  function FVt(t, e) {
    return e.emptyStr() ? t : t.emptyStr() ? e : IVe`${t}${e}`;
  }
  Vt.strConcat = FVt;
  function $Vt(t) {
    return typeof t == "number" || typeof t == "boolean" || t === null
      ? t
      : NR(Array.isArray(t) ? t.join(",") : t);
  }
  function UVt(t) {
    return new Ss(NR(t));
  }
  Vt.stringify = UVt;
  function NR(t) {
    return JSON.stringify(t)
      .replace(/\u2028/g, "\\u2028")
      .replace(/\u2029/g, "\\u2029");
  }
  Vt.safeStringify = NR;
  function qVt(t) {
    return typeof t == "string" && Vt.IDENTIFIER.test(t) ? new Ss(`.${t}`) : PVe`[${t}]`;
  }
  Vt.getProperty = qVt;
  function GVt(t) {
    if (typeof t == "string" && Vt.IDENTIFIER.test(t)) return new Ss(`${t}`);
    throw new Error(`CodeGen: invalid export name: ${t}, use explicit $id name mapping`);
  }
  Vt.getEsmExportName = GVt;
  function WVt(t) {
    return new Ss(t.toString());
  }
  Vt.regexpCode = WVt;
});
var EX = A((_i) => {
  "use strict";
  Object.defineProperty(_i, "__esModule", { value: !0 });
  _i.ValueScope = _i.ValueScopeName = _i.Scope = _i.varKinds = _i.UsedValueState = void 0;
  var wi = LR(),
    AX = class extends Error {
      constructor(e) {
        (super(`CodeGen: "code" for ${e} not defined`), (this.value = e.value));
      }
    },
    oB;
  (function (t) {
    ((t[(t.Started = 0)] = "Started"), (t[(t.Completed = 1)] = "Completed"));
  })(oB || (_i.UsedValueState = oB = {}));
  _i.varKinds = { const: new wi.Name("const"), let: new wi.Name("let"), var: new wi.Name("var") };
  var iB = class {
    constructor({ prefixes: e, parent: r } = {}) {
      ((this._names = {}), (this._prefixes = e), (this._parent = r));
    }
    toName(e) {
      return e instanceof wi.Name ? e : this.name(e);
    }
    name(e) {
      return new wi.Name(this._newName(e));
    }
    _newName(e) {
      let r = this._names[e] || this._nameGroup(e);
      return `${e}${r.index++}`;
    }
    _nameGroup(e) {
      var r, n;
      if (
        (!(
          (n = (r = this._parent) === null || r === void 0 ? void 0 : r._prefixes) === null ||
          n === void 0
        ) &&
          n.has(e)) ||
        (this._prefixes && !this._prefixes.has(e))
      )
        throw new Error(`CodeGen: prefix "${e}" is not allowed in this scope`);
      return (this._names[e] = { prefix: e, index: 0 });
    }
  };
  _i.Scope = iB;
  var sB = class extends wi.Name {
    constructor(e, r) {
      (super(r), (this.prefix = e));
    }
    setValue(e, { property: r, itemIndex: n }) {
      ((this.value = e), (this.scopePath = (0, wi._)`.${new wi.Name(r)}[${n}]`));
    }
  };
  _i.ValueScopeName = sB;
  var HVt = (0, wi._)`\n`,
    RX = class extends iB {
      constructor(e) {
        (super(e),
          (this._values = {}),
          (this._scope = e.scope),
          (this.opts = { ...e, _n: e.lines ? HVt : wi.nil }));
      }
      get() {
        return this._scope;
      }
      name(e) {
        return new sB(e, this._newName(e));
      }
      value(e, r) {
        var n;
        if (r.ref === void 0) throw new Error("CodeGen: ref must be passed in value");
        let o = this.toName(e),
          { prefix: i } = o,
          s = (n = r.key) !== null && n !== void 0 ? n : r.ref,
          a = this._values[i];
        if (a) {
          let u = a.get(s);
          if (u) return u;
        } else a = this._values[i] = new Map();
        a.set(s, o);
        let l = this._scope[i] || (this._scope[i] = []),
          c = l.length;
        return ((l[c] = r.ref), o.setValue(r, { property: i, itemIndex: c }), o);
      }
      getValue(e, r) {
        let n = this._values[e];
        if (n) return n.get(r);
      }
      scopeRefs(e, r = this._values) {
        return this._reduceValues(r, (n) => {
          if (n.scopePath === void 0) throw new Error(`CodeGen: name "${n}" has no value`);
          return (0, wi._)`${e}${n.scopePath}`;
        });
      }
      scopeCode(e = this._values, r, n) {
        return this._reduceValues(
          e,
          (o) => {
            if (o.value === void 0) throw new Error(`CodeGen: name "${o}" has no value`);
            return o.value.code;
          },
          r,
          n,
        );
      }
      _reduceValues(e, r, n = {}, o) {
        let i = wi.nil;
        for (let s in e) {
          let a = e[s];
          if (!a) continue;
          let l = (n[s] = n[s] || new Map());
          a.forEach((c) => {
            if (l.has(c)) return;
            l.set(c, oB.Started);
            let u = r(c);
            if (u) {
              let p = this.opts.es5 ? _i.varKinds.var : _i.varKinds.const;
              i = (0, wi._)`${i}${p} ${c} = ${u};${this.opts._n}`;
            } else if ((u = o?.(c))) i = (0, wi._)`${i}${u}${this.opts._n}`;
            else throw new AX(c);
            l.set(c, oB.Completed);
          });
        }
        return i;
      }
    };
  _i.ValueScope = RX;
});
var gt = A((wt) => {
  "use strict";
  Object.defineProperty(wt, "__esModule", { value: !0 });
  wt.or =
    wt.and =
    wt.not =
    wt.CodeGen =
    wt.operators =
    wt.varKinds =
    wt.ValueScopeName =
    wt.ValueScope =
    wt.Scope =
    wt.Name =
    wt.regexpCode =
    wt.stringify =
    wt.getProperty =
    wt.nil =
    wt.strConcat =
    wt.str =
    wt._ =
      void 0;
  var Ot = LR(),
    ua = EX(),
    Nd = LR();
  Object.defineProperty(wt, "_", {
    enumerable: !0,
    get: function () {
      return Nd._;
    },
  });
  Object.defineProperty(wt, "str", {
    enumerable: !0,
    get: function () {
      return Nd.str;
    },
  });
  Object.defineProperty(wt, "strConcat", {
    enumerable: !0,
    get: function () {
      return Nd.strConcat;
    },
  });
  Object.defineProperty(wt, "nil", {
    enumerable: !0,
    get: function () {
      return Nd.nil;
    },
  });
  Object.defineProperty(wt, "getProperty", {
    enumerable: !0,
    get: function () {
      return Nd.getProperty;
    },
  });
  Object.defineProperty(wt, "stringify", {
    enumerable: !0,
    get: function () {
      return Nd.stringify;
    },
  });
  Object.defineProperty(wt, "regexpCode", {
    enumerable: !0,
    get: function () {
      return Nd.regexpCode;
    },
  });
  Object.defineProperty(wt, "Name", {
    enumerable: !0,
    get: function () {
      return Nd.Name;
    },
  });
  var uB = EX();
  Object.defineProperty(wt, "Scope", {
    enumerable: !0,
    get: function () {
      return uB.Scope;
    },
  });
  Object.defineProperty(wt, "ValueScope", {
    enumerable: !0,
    get: function () {
      return uB.ValueScope;
    },
  });
  Object.defineProperty(wt, "ValueScopeName", {
    enumerable: !0,
    get: function () {
      return uB.ValueScopeName;
    },
  });
  Object.defineProperty(wt, "varKinds", {
    enumerable: !0,
    get: function () {
      return uB.varKinds;
    },
  });
  wt.operators = {
    GT: new Ot._Code(">"),
    GTE: new Ot._Code(">="),
    LT: new Ot._Code("<"),
    LTE: new Ot._Code("<="),
    EQ: new Ot._Code("==="),
    NEQ: new Ot._Code("!=="),
    NOT: new Ot._Code("!"),
    OR: new Ot._Code("||"),
    AND: new Ot._Code("&&"),
    ADD: new Ot._Code("+"),
  };
  var Bc = class {
      optimizeNodes() {
        return this;
      }
      optimizeNames(e, r) {
        return this;
      }
    },
    CX = class extends Bc {
      constructor(e, r, n) {
        (super(), (this.varKind = e), (this.name = r), (this.rhs = n));
      }
      render({ es5: e, _n: r }) {
        let n = e ? ua.varKinds.var : this.varKind,
          o = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${n} ${this.name}${o};` + r;
      }
      optimizeNames(e, r) {
        if (e[this.name.str]) return (this.rhs && (this.rhs = ib(this.rhs, e, r)), this);
      }
      get names() {
        return this.rhs instanceof Ot._CodeOrName ? this.rhs.names : {};
      }
    },
    aB = class extends Bc {
      constructor(e, r, n) {
        (super(), (this.lhs = e), (this.rhs = r), (this.sideEffects = n));
      }
      render({ _n: e }) {
        return `${this.lhs} = ${this.rhs};` + e;
      }
      optimizeNames(e, r) {
        if (!(this.lhs instanceof Ot.Name && !e[this.lhs.str] && !this.sideEffects))
          return ((this.rhs = ib(this.rhs, e, r)), this);
      }
      get names() {
        let e = this.lhs instanceof Ot.Name ? {} : { ...this.lhs.names };
        return cB(e, this.rhs);
      }
    },
    TX = class extends aB {
      constructor(e, r, n, o) {
        (super(e, n, o), (this.op = r));
      }
      render({ _n: e }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + e;
      }
    },
    PX = class extends Bc {
      constructor(e) {
        (super(), (this.label = e), (this.names = {}));
      }
      render({ _n: e }) {
        return `${this.label}:` + e;
      }
    },
    IX = class extends Bc {
      constructor(e) {
        (super(), (this.label = e), (this.names = {}));
      }
      render({ _n: e }) {
        return `break${this.label ? ` ${this.label}` : ""};` + e;
      }
    },
    kX = class extends Bc {
      constructor(e) {
        (super(), (this.error = e));
      }
      render({ _n: e }) {
        return `throw ${this.error};` + e;
      }
      get names() {
        return this.error.names;
      }
    },
    DX = class extends Bc {
      constructor(e) {
        (super(), (this.code = e));
      }
      render({ _n: e }) {
        return `${this.code};` + e;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(e, r) {
        return ((this.code = ib(this.code, e, r)), this);
      }
      get names() {
        return this.code instanceof Ot._CodeOrName ? this.code.names : {};
      }
    },
    BR = class extends Bc {
      constructor(e = []) {
        (super(), (this.nodes = e));
      }
      render(e) {
        return this.nodes.reduce((r, n) => r + n.render(e), "");
      }
      optimizeNodes() {
        let { nodes: e } = this,
          r = e.length;
        for (; r--; ) {
          let n = e[r].optimizeNodes();
          Array.isArray(n) ? e.splice(r, 1, ...n) : n ? (e[r] = n) : e.splice(r, 1);
        }
        return e.length > 0 ? this : void 0;
      }
      optimizeNames(e, r) {
        let { nodes: n } = this,
          o = n.length;
        for (; o--; ) {
          let i = n[o];
          i.optimizeNames(e, r) || (jVt(e, i.names), n.splice(o, 1));
        }
        return n.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((e, r) => Mf(e, r.names), {});
      }
    },
    Fc = class extends BR {
      render(e) {
        return "{" + e._n + super.render(e) + "}" + e._n;
      }
    },
    MX = class extends BR {},
    ob = class extends Fc {};
  ob.kind = "else";
  var kf = class t extends Fc {
    constructor(e, r) {
      (super(r), (this.condition = e));
    }
    render(e) {
      let r = `if(${this.condition})` + super.render(e);
      return (this.else && (r += "else " + this.else.render(e)), r);
    }
    optimizeNodes() {
      super.optimizeNodes();
      let e = this.condition;
      if (e === !0) return this.nodes;
      let r = this.else;
      if (r) {
        let n = r.optimizeNodes();
        r = this.else = Array.isArray(n) ? new ob(n) : n;
      }
      if (r)
        return e === !1
          ? r instanceof t
            ? r
            : r.nodes
          : this.nodes.length
            ? this
            : new t(kVe(e), r instanceof t ? [r] : r.nodes);
      if (!(e === !1 || !this.nodes.length)) return this;
    }
    optimizeNames(e, r) {
      var n;
      if (
        ((this.else = (n = this.else) === null || n === void 0 ? void 0 : n.optimizeNames(e, r)),
        !!(super.optimizeNames(e, r) || this.else))
      )
        return ((this.condition = ib(this.condition, e, r)), this);
    }
    get names() {
      let e = super.names;
      return (cB(e, this.condition), this.else && Mf(e, this.else.names), e);
    }
  };
  kf.kind = "if";
  var Df = class extends Fc {};
  Df.kind = "for";
  var OX = class extends Df {
      constructor(e) {
        (super(), (this.iteration = e));
      }
      render(e) {
        return `for(${this.iteration})` + super.render(e);
      }
      optimizeNames(e, r) {
        if (super.optimizeNames(e, r)) return ((this.iteration = ib(this.iteration, e, r)), this);
      }
      get names() {
        return Mf(super.names, this.iteration.names);
      }
    },
    NX = class extends Df {
      constructor(e, r, n, o) {
        (super(), (this.varKind = e), (this.name = r), (this.from = n), (this.to = o));
      }
      render(e) {
        let r = e.es5 ? ua.varKinds.var : this.varKind,
          { name: n, from: o, to: i } = this;
        return `for(${r} ${n}=${o}; ${n}<${i}; ${n}++)` + super.render(e);
      }
      get names() {
        let e = cB(super.names, this.from);
        return cB(e, this.to);
      }
    },
    lB = class extends Df {
      constructor(e, r, n, o) {
        (super(), (this.loop = e), (this.varKind = r), (this.name = n), (this.iterable = o));
      }
      render(e) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(e);
      }
      optimizeNames(e, r) {
        if (super.optimizeNames(e, r)) return ((this.iterable = ib(this.iterable, e, r)), this);
      }
      get names() {
        return Mf(super.names, this.iterable.names);
      }
    },
    FR = class extends Fc {
      constructor(e, r, n) {
        (super(), (this.name = e), (this.args = r), (this.async = n));
      }
      render(e) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(e);
      }
    };
  FR.kind = "func";
  var $R = class extends BR {
    render(e) {
      return "return " + super.render(e);
    }
  };
  $R.kind = "return";
  var LX = class extends Fc {
      render(e) {
        let r = "try" + super.render(e);
        return (
          this.catch && (r += this.catch.render(e)),
          this.finally && (r += this.finally.render(e)),
          r
        );
      }
      optimizeNodes() {
        var e, r;
        return (
          super.optimizeNodes(),
          (e = this.catch) === null || e === void 0 || e.optimizeNodes(),
          (r = this.finally) === null || r === void 0 || r.optimizeNodes(),
          this
        );
      }
      optimizeNames(e, r) {
        var n, o;
        return (
          super.optimizeNames(e, r),
          (n = this.catch) === null || n === void 0 || n.optimizeNames(e, r),
          (o = this.finally) === null || o === void 0 || o.optimizeNames(e, r),
          this
        );
      }
      get names() {
        let e = super.names;
        return (
          this.catch && Mf(e, this.catch.names),
          this.finally && Mf(e, this.finally.names),
          e
        );
      }
    },
    UR = class extends Fc {
      constructor(e) {
        (super(), (this.error = e));
      }
      render(e) {
        return `catch(${this.error})` + super.render(e);
      }
    };
  UR.kind = "catch";
  var qR = class extends Fc {
    render(e) {
      return "finally" + super.render(e);
    }
  };
  qR.kind = "finally";
  var BX = class {
    constructor(e, r = {}) {
      ((this._values = {}),
        (this._blockStarts = []),
        (this._constants = {}),
        (this.opts = {
          ...r,
          _n: r.lines
            ? `
`
            : "",
        }),
        (this._extScope = e),
        (this._scope = new ua.Scope({ parent: e })),
        (this._nodes = [new MX()]));
    }
    toString() {
      return this._root.render(this.opts);
    }
    name(e) {
      return this._scope.name(e);
    }
    scopeName(e) {
      return this._extScope.name(e);
    }
    scopeValue(e, r) {
      let n = this._extScope.value(e, r);
      return ((this._values[n.prefix] || (this._values[n.prefix] = new Set())).add(n), n);
    }
    getScopeValue(e, r) {
      return this._extScope.getValue(e, r);
    }
    scopeRefs(e) {
      return this._extScope.scopeRefs(e, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(e, r, n, o) {
      let i = this._scope.toName(r);
      return (
        n !== void 0 && o && (this._constants[i.str] = n),
        this._leafNode(new CX(e, i, n)),
        i
      );
    }
    const(e, r, n) {
      return this._def(ua.varKinds.const, e, r, n);
    }
    let(e, r, n) {
      return this._def(ua.varKinds.let, e, r, n);
    }
    var(e, r, n) {
      return this._def(ua.varKinds.var, e, r, n);
    }
    assign(e, r, n) {
      return this._leafNode(new aB(e, r, n));
    }
    add(e, r) {
      return this._leafNode(new TX(e, wt.operators.ADD, r));
    }
    code(e) {
      return (typeof e == "function" ? e() : e !== Ot.nil && this._leafNode(new DX(e)), this);
    }
    object(...e) {
      let r = ["{"];
      for (let [n, o] of e)
        (r.length > 1 && r.push(","),
          r.push(n),
          (n !== o || this.opts.es5) && (r.push(":"), (0, Ot.addCodeArg)(r, o)));
      return (r.push("}"), new Ot._Code(r));
    }
    if(e, r, n) {
      if ((this._blockNode(new kf(e)), r && n)) this.code(r).else().code(n).endIf();
      else if (r) this.code(r).endIf();
      else if (n) throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    elseIf(e) {
      return this._elseNode(new kf(e));
    }
    else() {
      return this._elseNode(new ob());
    }
    endIf() {
      return this._endBlockNode(kf, ob);
    }
    _for(e, r) {
      return (this._blockNode(e), r && this.code(r).endFor(), this);
    }
    for(e, r) {
      return this._for(new OX(e), r);
    }
    forRange(e, r, n, o, i = this.opts.es5 ? ua.varKinds.var : ua.varKinds.let) {
      let s = this._scope.toName(e);
      return this._for(new NX(i, s, r, n), () => o(s));
    }
    forOf(e, r, n, o = ua.varKinds.const) {
      let i = this._scope.toName(e);
      if (this.opts.es5) {
        let s = r instanceof Ot.Name ? r : this.var("_arr", r);
        return this.forRange("_i", 0, (0, Ot._)`${s}.length`, (a) => {
          (this.var(i, (0, Ot._)`${s}[${a}]`), n(i));
        });
      }
      return this._for(new lB("of", o, i, r), () => n(i));
    }
    forIn(e, r, n, o = this.opts.es5 ? ua.varKinds.var : ua.varKinds.const) {
      if (this.opts.ownProperties) return this.forOf(e, (0, Ot._)`Object.keys(${r})`, n);
      let i = this._scope.toName(e);
      return this._for(new lB("in", o, i, r), () => n(i));
    }
    endFor() {
      return this._endBlockNode(Df);
    }
    label(e) {
      return this._leafNode(new PX(e));
    }
    break(e) {
      return this._leafNode(new IX(e));
    }
    return(e) {
      let r = new $R();
      if ((this._blockNode(r), this.code(e), r.nodes.length !== 1))
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode($R);
    }
    try(e, r, n) {
      if (!r && !n) throw new Error('CodeGen: "try" without "catch" and "finally"');
      let o = new LX();
      if ((this._blockNode(o), this.code(e), r)) {
        let i = this.name("e");
        ((this._currNode = o.catch = new UR(i)), r(i));
      }
      return (
        n && ((this._currNode = o.finally = new qR()), this.code(n)),
        this._endBlockNode(UR, qR)
      );
    }
    throw(e) {
      return this._leafNode(new kX(e));
    }
    block(e, r) {
      return (this._blockStarts.push(this._nodes.length), e && this.code(e).endBlock(r), this);
    }
    endBlock(e) {
      let r = this._blockStarts.pop();
      if (r === void 0) throw new Error("CodeGen: not in self-balancing block");
      let n = this._nodes.length - r;
      if (n < 0 || (e !== void 0 && n !== e))
        throw new Error(`CodeGen: wrong number of nodes: ${n} vs ${e} expected`);
      return ((this._nodes.length = r), this);
    }
    func(e, r = Ot.nil, n, o) {
      return (this._blockNode(new FR(e, r, n)), o && this.code(o).endFunc(), this);
    }
    endFunc() {
      return this._endBlockNode(FR);
    }
    optimize(e = 1) {
      for (; e-- > 0; )
        (this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants));
    }
    _leafNode(e) {
      return (this._currNode.nodes.push(e), this);
    }
    _blockNode(e) {
      (this._currNode.nodes.push(e), this._nodes.push(e));
    }
    _endBlockNode(e, r) {
      let n = this._currNode;
      if (n instanceof e || (r && n instanceof r)) return (this._nodes.pop(), this);
      throw new Error(`CodeGen: not in block "${r ? `${e.kind}/${r.kind}` : e.kind}"`);
    }
    _elseNode(e) {
      let r = this._currNode;
      if (!(r instanceof kf)) throw new Error('CodeGen: "else" without "if"');
      return ((this._currNode = r.else = e), this);
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      let e = this._nodes;
      return e[e.length - 1];
    }
    set _currNode(e) {
      let r = this._nodes;
      r[r.length - 1] = e;
    }
  };
  wt.CodeGen = BX;
  function Mf(t, e) {
    for (let r in e) t[r] = (t[r] || 0) + (e[r] || 0);
    return t;
  }
  function cB(t, e) {
    return e instanceof Ot._CodeOrName ? Mf(t, e.names) : t;
  }
  function ib(t, e, r) {
    if (t instanceof Ot.Name) return n(t);
    if (!o(t)) return t;
    return new Ot._Code(
      t._items.reduce(
        (i, s) => (
          s instanceof Ot.Name && (s = n(s)),
          s instanceof Ot._Code ? i.push(...s._items) : i.push(s),
          i
        ),
        [],
      ),
    );
    function n(i) {
      let s = r[i.str];
      return s === void 0 || e[i.str] !== 1 ? i : (delete e[i.str], s);
    }
    function o(i) {
      return (
        i instanceof Ot._Code &&
        i._items.some((s) => s instanceof Ot.Name && e[s.str] === 1 && r[s.str] !== void 0)
      );
    }
  }
  function jVt(t, e) {
    for (let r in e) t[r] = (t[r] || 0) - (e[r] || 0);
  }
  function kVe(t) {
    return typeof t == "boolean" || typeof t == "number" || t === null ? !t : (0, Ot._)`!${FX(t)}`;
  }
  wt.not = kVe;
  var zVt = DVe(wt.operators.AND);
  function VVt(...t) {
    return t.reduce(zVt);
  }
  wt.and = VVt;
  var KVt = DVe(wt.operators.OR);
  function ZVt(...t) {
    return t.reduce(KVt);
  }
  wt.or = ZVt;
  function DVe(t) {
    return (e, r) => (e === Ot.nil ? r : r === Ot.nil ? e : (0, Ot._)`${FX(e)} ${t} ${FX(r)}`);
  }
  function FX(t) {
    return t instanceof Ot.Name ? t : (0, Ot._)`(${t})`;
  }
});
