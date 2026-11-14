function h4e(t) {
  return t ? (t.length > f4e ? t.substring(0, f4e) + "\u2026" : t) : y4e;
}
Sd();
O();
Pt();
xo();
var v4e = "ConversationSummaryProvider",
  k2 = class {
    constructor(e) {
      this.codexMcpConnection = e;
      this.subscriptions.push(
        this.codexMcpConnection.registerProvider(v4e, {
          onResult: (r) => {
            this.handleAppServerResponse(r);
          },
        }),
      );
    }
    nextRequestId = 1;
    subscriptions = [];
    pendingAppServerRequests = new Map();
    async getConversationSummary(e) {
      let r = String(this.nextRequestId++),
        n = pt();
      this.pendingAppServerRequests.set(r, n);
      let o = { conversationId: e };
      return (this.codexMcpConnection.sendRequest(v4e, r, "getConversationSummary", o), n.promise);
    }
    handleAppServerResponse(e) {
      let { id: r, result: n, error: o } = e,
        i = String(r),
        s = this.pendingAppServerRequests.get(i);
      if (!s) {
        he().warning("Received app server response for unknown request id", {
          safe: { requestId: i },
          sensitive: {},
        });
        return;
      }
      (this.pendingAppServerRequests.delete(i), o ? s.reject(o) : s.resolve(n));
    }
    dispose() {
      this.subscriptions.forEach((e) => {
        e.dispose();
      });
    }
  };
O();
Pt();
var Rf = F(require("vscode"));
xo();
var G4t = "gpt-5.3-codex",
  D2 = class {
    constructor(e) {
      this.context = e;
      try {
        ((this.isCopilotModelProxyAvailable = Rf.lm.isModelProxyAvailable),
          Rf.lm.onDidChangeModelProxyAvailability(() => {
            let r = Rf.lm.isModelProxyAvailable;
            (r ||
              ((this.pendingProxy = null),
              this.proxy && (this.proxy.dispose(), (this.proxy = null))),
              this.isCopilotModelProxyAvailable !== r &&
                ((this.isCopilotModelProxyAvailable = r),
                this.onDidChangeModelProxyAvailability.fire()));
          }));
      } catch {}
    }
    proxyAvailableSubscription = null;
    isCopilotModelProxyAvailable = !1;
    pendingProxy = null;
    proxy = null;
    onDidChangeModelProxyAvailability = new Rf.EventEmitter();
    onDidChangeIsCopilotApiAvailable = this.onDidChangeModelProxyAvailability.event;
    isProxyAvailable() {
      return this.isCopilotModelProxyAvailable;
    }
    isUserUsingCopilotInference() {
      return (
        this.isCopilotModelProxyAvailable &&
        this.context.globalState.get(J.USE_COPILOT_AUTH_IF_AVAILABLE, !1)
      );
    }
    getProxy() {
      if (!this.isUserUsingCopilotInference()) return null;
      if (this.pendingProxy) return this.pendingProxy;
      try {
        he().info("Requesting Language Model Proxy from VS Code API");
        let e = Rf.lm.getModelProxy().then(
          (r) => {
            if (
              (he().info("Language Model Proxy running on", {
                safe: { uri: r.uri },
                sensitive: {},
              }),
              e !== this.pendingProxy)
            ) {
              if ((r.dispose(), this.proxy)) return this.proxy;
              throw new Error("Model proxy was disposed before it could be used.");
            } else return ((this.proxy = r), r);
          },
          (r) => {
            throw (
              he().error("Failed to get Language Model Proxy from VS Code API", {
                safe: { error: r },
                sensitive: {},
              }),
              (this.pendingProxy = null),
              r
            );
          },
        );
        return ((this.pendingProxy = e), this.pendingProxy);
      } catch {
        return null;
      }
    }
    getModel() {
      return this.context.globalState.get(J.COPILOT_DEFAULT_MODEL) ?? G4t;
    }
    dispose() {
      (this.proxyAvailableSubscription?.dispose(),
        this.proxy?.dispose(),
        this.onDidChangeModelProxyAvailability.dispose());
    }
  };
O();
Ik();
Pt();
ot();
O();
$();
var W4t = d.discriminatedUnion("type", [
    d.object({ type: d.literal("local"), projectId: d.string().transform(gu) }),
    d.object({ type: d.literal("remote"), projectId: d.string().transform(gu) }),
  ]),
  H4t = d.array(Cye),
  M2 = class extends ee {
    constructor(r) {
      super();
      this.readValue = r;
    }
    async readLocalProjects() {
      let r = await this.readValue(J.LOCAL_PROJECTS);
      return r == null ? void 0 : _me(r);
    }
    async readRemoteProjects() {
      let r = await this.readValue(J.REMOTE_PROJECTS);
      return r == null ? void 0 : H4t.safeParse(r).data;
    }
    async readSelection() {
      let r = await this.readValue(J.SELECTED_PROJECT);
      return r == null ? r : W4t.safeParse(r).data;
    }
  };
var R4e = F(require("vscode"));
$();
ot();
O();
var O2 = class extends ee {
  constructor(r, n) {
    super();
    this.globalState = r;
    this.projectCatalog = n;
  }
  async read(r) {
    return r === J.LOCAL_PROJECTS
      ? { value: await this.projectCatalog.readLocalProjects() }
      : r === J.SELECTED_PROJECT
        ? { value: await this.projectCatalog.readSelection() }
        : { value: await this.globalState.get(r) };
  }
  async write(r, n) {
    if (r === J.QUEUED_FOLLOW_UPS) return { success: !1 };
    try {
      return (await this.globalState.update(r, n), { success: !0 });
    } catch {
      return { success: !1 };
    }
  }
};
xo();
O();
ot();
O();
var N2 = class extends ee {
    async readAll() {
      let e = await Promise.all(this.keys().map(async (o) => [o, await this.read(o)])),
        r = {},
        n = {};
      for (let [o, i] of e)
        (Object.assign(r, { [o]: i.effective }), Object.assign(n, { [o]: i.configured }));
      return { values: r, configuredValues: n };
    }
    async readForAgent(e) {
      let r = new Set(this.keys()),
        n = vye().filter(({ key: i }) => r.has(i)),
        o = await Promise.all(n.map(async ({ key: i }) => [i, await this.read(i, e)]));
      return {
        filePath: this.settingsFilePath(),
        settings: Object.fromEntries(
          o.flatMap(([i, s]) => (s.configured === void 0 ? [] : [[i, s.configured]])),
        ),
        effectiveSettings: Object.fromEntries(
          o.flatMap(([i, s]) => (s.effective === void 0 ? [] : [[i, s.effective]])),
        ),
        definitions: n,
      };
    }
    async writeForAgent(e, r) {
      let n = new Set(this.keys()),
        o = Object.entries(e).map(([a, l]) => {
          let c = Xw(a);
          if (c == null || !n.has(c.key)) throw new Error(`Unknown setting: ${a}`);
          if (c.agentAccess !== "read-write")
            throw new Error(`Setting cannot be written by Codex: ${a}`);
          return { key: c.key, value: Pg(c.key, l) };
        });
      for (let { key: a, value: l } of o) await this.write(a, l);
      let { settings: i, effectiveSettings: s } = await this.readForAgent(r);
      return { settings: i, effectiveSettings: s };
    }
    async subscribe(e, r) {
      let n = r.dup(),
        o = 0,
        i = !0,
        s = async () => {
          let c = ++o,
            u = await this.read(e);
          if (i && c === o) {
            var p = [];
            try {
              let v = cn(p, n(u));
            } catch (m) {
              var f = m,
                h = !0;
            } finally {
              un(p, f, h);
            }
          }
        },
        a = this.onDidChange(e, () => {
          s().catch(() => l.unsubscribe());
        }),
        l = new nX(() => {
          ((i = !1), a(), n[Symbol.dispose]());
        });
      n.onRpcBroken(() => l.unsubscribe());
      try {
        return (await s(), l);
      } catch (c) {
        throw (l.unsubscribe(), c);
      }
    }
  },
  nX = class extends ee {
    constructor(r) {
      super();
      this.cleanup = r;
    }
    unsubscribe() {
      let r = this.cleanup;
      ((this.cleanup = null), r?.());
    }
    [Symbol.dispose]() {
      this.unsubscribe();
    }
  };
var S4e = F(require("vscode"));
Sd();
var L2 = class extends N2 {
  constructor(r) {
    super();
    this.storage = r;
  }
  settingsFilePath() {
    return null;
  }
  keys() {
    return Zw.filter(b4e).map(({ key: r }) => r);
  }
  async read(r) {
    let n = this.definition(r),
      o = await this.readConfigured(n),
      i = Tk(r).safeParse(n.hostStorage.kind === "configuration" ? Wn(n.hostStorage.key) : o),
      s = (i.success ? i.data : void 0) ?? n.default;
    return {
      configured: o === void 0 ? void 0 : Pg(r, o),
      effective: s === void 0 ? void 0 : Pg(r, s),
    };
  }
  async write(r, n) {
    let { hostStorage: o } = this.definition(r),
      i = Pg(r, n);
    switch (o.kind) {
      case "configuration":
        await nHe(o.key, i);
        return;
      case "global-state":
        await this.storage.update(o.key, i);
        return;
      case "persisted-atom":
        await this.storage.updatePersistedAtomValue(o.key, i);
    }
  }
  onDidChange(r, n) {
    let { hostStorage: o } = this.definition(r),
      i =
        o.kind === "configuration"
          ? S4e.workspace.onDidChangeConfiguration((s) => {
              s.affectsConfiguration(`chatgpt.${o.key}`) && n();
            })
          : this.storage.onDidUpdateEntry((s) => {
              s.key === (o.kind === "persisted-atom" ? J.PERSISTED_ATOM_STATE : o.key) && n();
            });
    return () => {
      i.dispose();
    };
  }
  definition(r) {
    if (!b4e({ key: r })) throw new Error(`Unknown setting: ${r}`);
    return Xw(r);
  }
  async readConfigured(r) {
    let { hostStorage: n } = r,
      o;
    switch (n.kind) {
      case "configuration":
        o = oHe(n.key);
        break;
      case "global-state":
        o = await this.storage.getStored(n.key);
        break;
      case "persisted-atom": {
        let s = await this.storage.getStored(J.PERSISTED_ATOM_STATE);
        o = s != null && typeof s == "object" && n.key in s ? Reflect.get(s, n.key) : void 0;
        break;
      }
    }
    let i = Tk(r.key).safeParse(o);
    return i.success ? i.data : void 0;
  }
};
function b4e({ key: t }) {
  return (
    t !== xk.soundEnabled.key &&
    t !== Ak.externalBrowserLinkShortcut.key &&
    t !== Rk.projectlessWorkspaceRoot.key
  );
}
ot();
var B2 = class extends ee {
  constructor(r) {
    super();
    this.fetchCodexConfig = r;
  }
  async readDeveloperInstructions({ baseInstructions: r }) {
    return { instructions: r ?? "" };
  }
  async readMcpConfig() {
    return { config: (await this.fetchCodexConfig?.()) ?? null };
  }
};
ot();
Pt();
var F2 = class extends ee {
  constructor(r) {
    super();
    this.appServerClient = r;
  }
  async generateTitle({ prompt: r, cwd: n, readOnlyAppToolAllowlist: o }) {
    try {
      return await TWe({
        prompt: r,
        cwd: n,
        serviceTier: null,
        readOnlyAppToolAllowlist: o,
        appServerClient: this.appServerClient,
      });
    } catch (i) {
      return (
        he().warning("[generate-thread-title] Failed to generate title", {
          safe: { error: String(i) },
          sensitive: {},
        }),
        null
      );
    }
  }
  async generateDescription({ threadId: r, title: n, cwd: o }) {
    try {
      return await PWe({
        title: n,
        cwd: o,
        serviceTier: null,
        sourceThreadId: r,
        appServerClient: this.appServerClient,
      });
    } catch (i) {
      return (
        he().warning("[generate-thread-description] Failed to generate description", {
          safe: {},
          sensitive: { error: String(i) },
        }),
        null
      );
    }
  }
};
var w4e = require("node:crypto"),
  _4e = F(require("node:path"));
O();
function x4e(t, e) {
  let r = t[0];
  return r == null
    ? null
    : {
        id: `vscode-${(0, w4e.createHash)("sha256")
          .update(e?.length ? e.map((n) => n.uri.toString()).join("\0") : t.join("\0"))
          .digest("hex")
          .slice(0, 32)}`,
        name: e?.[0]?.name ?? (_4e.default.basename(r) || r),
        rootPaths: t,
        createdAt: 1,
        updatedAt: 1,
      };
}
var j4t = d.object({ type: d.enum(["local", "remote"]), projectId: d.string().transform(gu) }),
  A4e = "ExtensionFetchHandler",
  $2 = class {
    constructor(e, r, n, o, i) {
      this.codexMcpConnection = e;
      this.globalState = r;
      this.workspaceStoragePath = i;
      ((this.gitMessageGeneration = new LM(() => this.createMessageGenerationClient())),
        (this.threadConfiguration = new B2(n)),
        (this.settings = new L2(r)),
        (this.globalStateService = new O2(r, this.projectCatalog)),
        (this.executionHost = o),
        (this.threadMetadataGeneration = new F2(this.createMessageGenerationClient())),
        this.codexMcpConnection.registerProvider(A4e, {
          onResult: (s) => {
            this.handleInternalAppServerResponse(s);
          },
          onFatalError: (s) => {
            this.rejectPendingInternalRequests(s);
          },
        }));
    }
    queuedSendLocksService = new jA(new rL());
    executionHost;
    nextRequestId = 1;
    pendingAppServerRequests = new Map();
    threadConfiguration;
    settings;
    globalStateService;
    threadMetadataGeneration;
    gitMessageGeneration;
    async getUserSavedConfiguration(e) {
      let { config: r } = await this.sendInternalAppServerRequest("config/read", {
        includeLayers: !1,
        cwd: e,
      });
      return r;
    }
    handlers = {
      "get-global-state": ({ key: e }) => this.globalStateService.read(e),
      "set-global-state": ({ key: e, value: r }) => this.globalStateService.write(e, r),
    };
    handleVSCodeRequest(e, r, n) {
      let o = () => this.handlers[e]({ ...r, originWebview: n?.originWebview, signal: n?.signal });
      return n?.source == null ? o() : Xr({ source: n.source, requestKind: e }, o);
    }
    projectCatalog = new M2(async (e) => {
      if (e === J.LOCAL_PROJECTS) {
        let r = await this.getWorkspaceProject();
        return r == null ? {} : { [r.id]: r };
      }
      if (e === J.SELECTED_PROJECT) {
        let r = await this.globalState.get(e),
          n = j4t.safeParse(r);
        if (n.success && n.data.type === "remote") return n.data;
        let o = await this.getWorkspaceProject();
        return o == null ? void 0 : { type: "local", projectId: o.id };
      }
      return this.globalState.get(e);
    });
    async getWorkspaceProject() {
      let e = await tX(this.executionHost, this.workspaceStoragePath);
      return x4e(e, T2().length === 0 ? R4e.workspace.workspaceFolders : void 0);
    }
    sendInternalAppServerRequest(e, r) {
      let n = String(this.nextRequestId++),
        o = pt(),
        i =
          (e === "thread/start" && r.ephemeral === !0) ||
          (e === "thread/fork" && r.ephemeral === !0);
      return (
        this.pendingAppServerRequests.set(n, { deferred: o, ephemeral: i }),
        this.codexMcpConnection.sendRequest(A4e, n, e, r),
        o.promise
      );
    }
    handleInternalAppServerResponse(e) {
      let r = String(e.id),
        n = this.pendingAppServerRequests.get(r);
      if (!n) {
        he().warning("Received internal app server response for unknown request id", {
          safe: { requestId: r },
          sensitive: {},
        });
        return;
      }
      if ((this.pendingAppServerRequests.delete(r), e.error)) {
        n.deferred.reject(new Error(e.error.message ?? "Internal app server request failed"));
        return;
      }
      if (n.ephemeral) {
        let o = e.result;
        (this.codexMcpConnection.markEphemeralThreadId(o.thread.id), n.deferred.resolve(o));
        return;
      }
      n.deferred.resolve(e.result);
    }
    createMessageGenerationClient() {
      return {
        getUserSavedConfiguration: (e) => this.getUserSavedConfiguration(e),
        listModels: (e) => this.sendInternalAppServerRequest("model/list", e),
        startThread: (e) => this.sendInternalAppServerRequest("thread/start", e),
        forkThread: (e) => this.sendInternalAppServerRequest("thread/fork", e),
        startTurn: (e) =>
          this.sendInternalAppServerRequest(
            "turn/start",
            uH(e, this.codexMcpConnection.getAppServerVersion()),
          ),
        unsubscribeThread: async (e) => {
          await this.sendInternalAppServerRequest("thread/unsubscribe", { threadId: e });
        },
        interruptTurn: (e) => this.sendInternalAppServerRequest("turn/interrupt", e),
        registerInternalNotificationHandler: (e) => {
          let r = this.codexMcpConnection.registerInternalNotificationHandler(e);
          return () => {
            r.dispose();
          };
        },
      };
    }
    rejectPendingInternalRequests(e) {
      for (let [, r] of this.pendingAppServerRequests) r.deferred.reject(e);
      this.pendingAppServerRequests.clear();
    }
  };
var T4e = require("node:crypto"),
  Al = require("node:fs/promises"),
  P4e = require("node:path");
O();
var E4e = F(Is());
$();
var z4t = d.record(d.string(), d.unknown());
function C4e(t, e) {
  let { timestampField: r } = e,
    n = r == null ? null : d.object({ [r]: d.number() }),
    o = (a) => (r == null ? 0 : (n?.safeParse(a).data?.[r] ?? 0)),
    i = z4t.safeParse(t),
    s = i.success ? i.data : {};
  for (let [a, l] of Object.entries(e.entries))
    if (!(l?.expectedValue !== void 0 && !(0, E4e.default)(s[a], l.expectedValue))) {
      if (l == null || "delete" in l) {
        delete s[a];
        continue;
      }
      if (!(l.createOnly && Object.hasOwn(s, a)) && !(r != null && o(s[a]) > o(l.value))) {
        if (l.updateOnly) {
          if (!Object.hasOwn(s, a)) continue;
        } else delete s[a];
        Object.defineProperty(s, a, {
          configurable: !0,
          enumerable: !0,
          value: l.value,
          writable: !0,
        });
      }
    }
  if (e.minNumericValue != null)
    for (let [a, l] of Object.entries(s))
      typeof l == "number" && l < e.minNumericValue && delete s[a];
  if (e.maxEntries != null) {
    let a = Object.keys(s);
    r != null && a.sort((l, c) => o(s[l]) - o(s[c]));
    for (let l of a.slice(0, Math.max(0, a.length - e.maxEntries))) delete s[l];
  }
  if (e.maxBytes != null) {
    let a = 2;
    for (let [l, c] of Object.entries(s).reverse()) {
      let u = new TextEncoder().encode(JSON.stringify({ [l]: c })).byteLength - 2,
        p = a + u + (a > 2 && u > 0 ? 1 : 0);
      p > e.maxBytes ? delete s[l] : (a = p);
    }
  }
  return s;
}
Pt();
var U2 = F(require("vscode"));
xo();
var q2 = class {
  constructor(e, r) {
    this.storage = e;
    this.queuedFollowUpsPath = r;
  }
  pendingUpdates = new Map();
  pendingMembershipWrite;
  pendingPersistedAtomUpdates = new Map();
  onDidUpdateEntryEmitter = new U2.EventEmitter();
  onDidUpdatePersistedAtomEmitter = new U2.EventEmitter();
  onDidResetPersistedAtomsEmitter = new U2.EventEmitter();
  onDidUpdateEntry = this.onDidUpdateEntryEmitter.event;
  onDidUpdatePersistedAtom = this.onDidUpdatePersistedAtomEmitter.event;
  onDidResetPersistedAtoms = this.onDidResetPersistedAtomsEmitter.event;
  async getStored(e) {
    if (oX(e))
      for (; this.pendingMembershipWrite != null; )
        await this.pendingMembershipWrite.catch(() => {});
    else await this.pendingUpdates.get(e)?.catch(() => {});
    if (e === J.QUEUED_FOLLOW_UPS)
      try {
        return JSON.parse(await (0, Al.readFile)(this.queuedFollowUpsPath, "utf8"));
      } catch (r) {
        if (!(r instanceof Error) || !("code" in r) || r.code !== "ENOENT") throw r;
      }
    return this.storage.get(e);
  }
  async get(e) {
    let r = await this.getStored(e);
    return r !== void 0 && r != null ? r : wne(e);
  }
  update(e, r) {
    return oX(e)
      ? Promise.reject(new Error("Use the thread project assignments service to update membership"))
      : this.enqueueUpdate(e, async () => {
          if (e === J.QUEUED_FOLLOW_UPS) {
            let n = `${this.queuedFollowUpsPath}.${(0, T4e.randomUUID)()}.tmp`;
            await (0, Al.mkdir)((0, P4e.dirname)(this.queuedFollowUpsPath), { recursive: !0 });
            try {
              (await (0, Al.writeFile)(n, JSON.stringify(r ?? null), { mode: 384 }),
                await (0, Al.rename)(n, this.queuedFollowUpsPath));
            } catch (o) {
              throw (await (0, Al.rm)(n, { force: !0 }).catch(() => {}), o);
            }
          } else await this.storage.update(e, r);
          this.onDidUpdateEntryEmitter.fire({ key: e, value: r });
        });
  }
  async readThreadProjectMemberships() {
    let [e, r] = await Promise.all([
      this.getStored(J.THREAD_PROJECT_ASSIGNMENTS),
      this.getStored(J.PROJECTLESS_THREAD_IDS),
    ]);
    return Bye(e, r);
  }
  writeThreadProjectMemberships(e, r) {
    let n = J.THREAD_PROJECT_ASSIGNMENTS,
      o = J.PROJECTLESS_THREAD_IDS,
      i = e.assignments !== r.assignments,
      s = e.projectlessThreadIds !== r.projectlessThreadIds,
      a = Promise.resolve().then(async () => {
        i && (await this.storage.update(n, r.assignments));
        try {
          s && (await this.storage.update(o, r.projectlessThreadIds));
        } catch (l) {
          if (i)
            try {
              await this.storage.update(n, e.assignments);
            } catch (c) {
              throw (
                this.onDidUpdateEntryEmitter.fire({ key: n, value: this.storage.get(n) }),
                this.onDidUpdateEntryEmitter.fire({ key: o, value: this.storage.get(o) }),
                new AggregateError(
                  [l, c],
                  "Failed to save thread project membership and restore its assignment",
                )
              );
            }
          throw l;
        }
        (i && this.onDidUpdateEntryEmitter.fire({ key: n, value: r.assignments }),
          s && this.onDidUpdateEntryEmitter.fire({ key: o, value: r.projectlessThreadIds }));
      });
    return (
      (this.pendingMembershipWrite = a),
      a.finally(() => {
        this.pendingMembershipWrite === a && (this.pendingMembershipWrite = void 0);
      })
    );
  }
  async updatePersistedAtomValue(e, r, n) {
    let o = J.PERSISTED_ATOM_STATE;
    try {
      await this.enqueueUpdate(o, async () => {
        let i = this.storage.get(o),
          s = i != null && typeof i == "object" ? { ...i } : {},
          a =
            n == null
              ? r
              : C4e(s[e] ?? (n.legacyStorageKey == null ? void 0 : s[n.legacyStorageKey]), n);
        (a === void 0 ? delete s[e] : (s[e] = a),
          await this.storage.update(o, s),
          this.onDidUpdateEntryEmitter.fire({ key: o, value: s }),
          this.pendingPersistedAtomUpdates.set(e, a));
      });
    } finally {
      this.pendingUpdates.has(o) ||
        (this.pendingPersistedAtomUpdates.forEach((i, s) => {
          this.onDidUpdatePersistedAtomEmitter.fire({ key: s, value: i });
        }),
        this.pendingPersistedAtomUpdates.clear());
    }
  }
  async resetPersistedAtoms() {
    (await this.update(J.PERSISTED_ATOM_STATE, {}),
      this.pendingPersistedAtomUpdates.clear(),
      this.onDidResetPersistedAtomsEmitter.fire());
  }
  async dumpNuxState() {
    let e = Object.entries(J);
    for (let [r, n] of e) {
      let o = this.storage.get(n);
      he().info("Global state", { safe: { name: r, key: n }, sensitive: { value: o } });
    }
  }
  async resetNuxState() {
    (he().info("Resetting NUX state"),
      await Promise.all(
        Object.values(J)
          .filter((e) => !oX(e))
          .map((e) =>
            e === J.PERSISTED_ATOM_STATE ? this.resetPersistedAtoms() : this.update(e, void 0),
          ),
      ));
  }
  dispose() {
    (this.onDidUpdateEntryEmitter.dispose(),
      this.onDidUpdatePersistedAtomEmitter.dispose(),
      this.onDidResetPersistedAtomsEmitter.dispose());
  }
  enqueueUpdate(e, r) {
    let n = (this.pendingUpdates.get(e)?.catch(() => {}) ?? Promise.resolve()).then(r);
    return (
      this.pendingUpdates.set(e, n),
      n.finally(() => {
        this.pendingUpdates.get(e) === n && this.pendingUpdates.delete(e);
      })
    );
  }
};
function oX(t) {
  return t === J.THREAD_PROJECT_ASSIGNMENTS || t === J.PROJECTLESS_THREAD_IDS;
}
var I4e = require("node:crypto"),
  G2 = class {
    constructor(
      e,
      r,
      n = (s) => {
        setTimeout(s, 0);
      },
      o = Date.now,
      i = I4e.randomUUID,
    ) {
      this.emit = e;
      this.schedule = n;
      this.now = o;
      this.createId = i;
      this.isWindowFocused = r;
    }
    handleDeepLink(e) {
      (this.pendingSourceUrl === e && (!this.isWindowFocused || !this.hasObservedCodexView)) ||
        (this.emitReceipt("deep-link", e),
        (this.sourceGeneration += 1),
        (this.pendingSourceUrl = e),
        (this.hasCompletedInitialEntry = !0),
        (this.suppressNextForeground = !this.isWindowFocused),
        (this.activationGeneration += 1));
    }
    handleCodexViewVisibility(e) {
      if (this.isCodexViewVisible !== e) {
        if (((this.isCodexViewVisible = e), !e)) {
          ((this.wasCodexVisibleWhenBackgrounded = !1), (this.activationGeneration += 1));
          return;
        }
        if (((this.hasObservedCodexView = !0), !!this.isWindowFocused)) {
          if (this.suppressNextForeground) {
            this.consumeSuppressedForeground();
            return;
          }
          if (!this.hasCompletedInitialEntry) {
            this.scheduleSourceLessReceipt("direct");
            return;
          }
          this.pendingSourceUrl = void 0;
        }
      }
    }
    handleWindowFocus(e) {
      if (this.isWindowFocused !== e) {
        if (((this.isWindowFocused = e), !e)) {
          ((this.wasCodexVisibleWhenBackgrounded = this.isCodexViewVisible),
            (this.pendingSourceUrl = void 0),
            (this.activationGeneration += 1));
          return;
        }
        if (this.isCodexViewVisible) {
          if (this.suppressNextForeground) {
            this.consumeSuppressedForeground();
            return;
          }
          if (!this.hasCompletedInitialEntry) {
            this.scheduleSourceLessReceipt("direct");
            return;
          }
          this.wasCodexVisibleWhenBackgrounded && this.scheduleSourceLessReceipt("foreground");
        }
      }
    }
    consumeSuppressedForeground() {
      ((this.suppressNextForeground = !1),
        (this.pendingSourceUrl = void 0),
        (this.wasCodexVisibleWhenBackgrounded = !1),
        (this.activationGeneration += 1));
    }
    scheduleSourceLessReceipt(e) {
      let r = ++this.activationGeneration,
        n = this.sourceGeneration;
      this.schedule(() => {
        !this.isWindowFocused ||
          !this.isCodexViewVisible ||
          this.activationGeneration !== r ||
          this.sourceGeneration !== n ||
          ((this.hasCompletedInitialEntry = !0),
          (this.pendingSourceUrl = void 0),
          (this.wasCodexVisibleWhenBackgrounded = !1),
          this.emitReceipt(e));
      });
    }
    emitReceipt(e, r) {
      this.emit({
        appEntryInstanceId: this.createId(),
        appEntryReceivedTs: this.now(),
        kind: e,
        surface: "codex_ide",
        entryUrl: r,
      });
    }
    activationGeneration = 0;
    sourceGeneration = 0;
    isWindowFocused;
    isCodexViewVisible = !1;
    hasObservedCodexView = !1;
    hasCompletedInitialEntry = !1;
    wasCodexVisibleWhenBackgrounded = !1;
    suppressNextForeground = !1;
    pendingSourceUrl;
  };
Pt();
var Rl = F(require("vscode")),
  V4t = 5,
  k4e = 2e5;
function O4e(t) {
  return t.path.split("/").pop() ?? "";
}
function K4t(t) {
  return { label: O4e(t), path: Rl.workspace.asRelativePath(t.fsPath), fsPath: t.fsPath };
}
function D4e(t) {
  return {
    start: { line: t.start.line, character: t.start.character },
    end: { line: t.end.line, character: t.end.character },
  };
}
function W2(t) {
  return {
    label: O4e(t.document.uri),
    path: Rl.workspace.asRelativePath(t.document.uri.fsPath),
    fsPath: t.document.uri.fsPath,
    selection: D4e(t.selection),
    activeSelectionContent: "",
    selections: t.selections.map(D4e),
  };
}
function Z4t(t) {
  let { document: e, selection: r } = t;
  if (r.isEmpty) return "";
  let n = e.offsetAt(r.start),
    o = e.offsetAt(r.end);
  if (Math.max(o - n, 0) <= k4e) return e.getText(r);
  let s = e.positionAt(n + k4e);
  return e.getText(new Rl.Range(r.start, s));
}
function M4e(t, e) {
  if (!t || t.length !== e.length) return !1;
  for (let r = 0; r < t.length; r += 1) {
    let n = t[r],
      o = e[r];
    if (
      n.start.line !== o.start.line ||
      n.start.character !== o.start.character ||
      n.end.line !== o.end.line ||
      n.end.character !== o.end.character
    )
      return !1;
  }
  return !0;
}
var H2 = class {
  disposable = new ic();
  recentOpenTabs = [];
  ideContext = { activeFile: void 0, openTabs: [] };
  constructor() {
    (this.disposable.add(
      Rl.window.onDidChangeActiveTextEditor((e) => this.onChangeActiveTextEditor(e)),
    ),
      this.disposable.add(
        Rl.window.onDidChangeTextEditorSelection((e) => {
          this.onChangeTextEditorSelection(e);
        }),
      ),
      this.initIdeContext());
  }
  getIdeContext() {
    let e = this.ideContext.activeFile,
      r = Rl.window.activeTextEditor;
    if (!e || !r) return this.ideContext;
    if (r.document.uri.scheme !== "file") return this.ideContext;
    if (r.document.uri.fsPath !== e.fsPath) return this.ideContext;
    if (!M4e(e.selections, r.selections))
      return ((this.ideContext = { ...this.ideContext, activeFile: W2(r) }), this.ideContext);
    if (r.selection.isEmpty) return this.ideContext;
    let n = Z4t(r);
    return n === e.activeSelectionContent
      ? this.ideContext
      : ((this.ideContext = {
          ...this.ideContext,
          activeFile: { ...e, activeSelectionContent: n },
        }),
        this.ideContext);
  }
  initIdeContext() {
    let e = Rl.window.activeTextEditor;
    (e && this.updateRecentOpenTabs(e),
      (this.ideContext = { activeFile: e ? W2(e) : void 0, openTabs: [...this.recentOpenTabs] }));
  }
  onChangeActiveTextEditor(e) {
    (e && this.updateRecentOpenTabs(e),
      (this.ideContext = {
        ...this.ideContext,
        activeFile: e ? W2(e) : void 0,
        openTabs: [...this.recentOpenTabs],
      }));
  }
  onChangeTextEditorSelection(e) {
    if (e.textEditor.document.uri.scheme !== "file") return;
    let r = this.ideContext.activeFile;
    (r && r.fsPath === e.textEditor.document.uri.fsPath && M4e(r.selections, e.selections)) ||
      (this.ideContext = {
        ...this.ideContext,
        activeFile: W2(e.textEditor),
        openTabs: [...this.recentOpenTabs],
      });
  }
  dispose() {
    this.disposable.dispose();
  }
  updateRecentOpenTabs(e) {
    if (e.document.uri.scheme !== "file") return;
    let r = K4t(e.document.uri);
    this.recentOpenTabs = [r, ...this.recentOpenTabs.filter((n) => n.fsPath !== r.fsPath)].slice(
      0,
      V4t,
    );
  }
};
var bR = F(require("node:path"));
Pt();
var L4e = F(require("vscode")),
  j2 = class {
    constructor(e, r) {
      this.ipcClient = e;
      this.ideContextConnection = r;
      this.disposables.add(
        this.ipcClient.addRequestHandler(
          "ide-context",
          async ({ workspaceRoot: n }) => X4t(n),
          async () => ({ ideContext: this.ideContextConnection.getIdeContext() }),
        ),
      );
    }
    disposables = new ic();
    dispose() {
      this.disposables.dispose();
    }
  };
function X4t(t) {
  return (L4e.workspace.workspaceFolders?.map((r) => r.uri.fsPath) ?? []).some((r) => Y4t(t, r));
}
function Y4t(t, e) {
  if (!t || !e) return !1;
  let r = N4e(t),
    n = N4e(e);
  return r === n || r.startsWith(n.endsWith(bR.sep) ? n : `${n}${bR.sep}`);
}
function N4e(t) {
  return bR.normalize(t).toLowerCase();
}
$();
var Ef = {
    available: "_codex.microphone.available",
    start: "_codex.microphone.start",
    read: "_codex.microphone.read",
    stop: "_codex.microphone.stop",
    cancel: "_codex.microphone.cancel",
  },
  V_n = d.uuid(),
  B4e = d.enum(["busy", "unavailable", "capture-failed", "buffer-overflow"]),
  F4e = d.discriminatedUnion("status", [
    d.object({ status: d.literal("started"), sampleRate: d.number().positive() }),
    d.object({ status: d.literal("error"), reason: B4e }),
  ]),
  $4e = d.discriminatedUnion("status", [
    d.object({ status: d.literal("audio"), pcm: d.string() }),
    d.object({ status: d.literal("stopped") }),
    d.object({ status: d.literal("error"), reason: B4e }),
  ]);
var U4e = require("node:crypto");
ot();
var SR = F(require("vscode"));
var z2 = class extends ee {
    open() {
      return new iX((0, U4e.randomUUID)());
    }
  },
  iX = class extends ee {
    #e;
    #t;
    constructor(e) {
      (super(),
        (this.#e = e),
        (this.#t = Promise.resolve(SR.commands.executeCommand(Ef.start, e))
          .then((r) => F4e.parse(r))
          .catch(() => ({ status: "error", reason: "unavailable" }))));
    }
    ready() {
      return this.#t;
    }
    async read() {
      try {
        let e = $4e.parse(await SR.commands.executeCommand(Ef.read, this.#e));
        return e.status === "audio"
          ? { status: "audio", pcm: new Uint8Array(Buffer.from(e.pcm, "base64")) }
          : e;
      } catch {
        return { status: "error", reason: "unavailable" };
      }
    }
    async stop() {
      await SR.commands.executeCommand(Ef.stop, this.#e);
    }
    [Symbol.dispose]() {
      SR.commands.executeCommand(Ef.cancel, this.#e).then(void 0, () => {});
    }
  };
xo();
var jB = F(require("fs/promises")),
  ZKe = F(require("os")),
  dE = F(require("path"));
var It;
(function (t) {
  t.assertEqual = (o) => {};
  function e(o) {}
  t.assertIs = e;
  function r(o) {
    throw new Error();
  }
  ((t.assertNever = r),
    (t.arrayToEnum = (o) => {
      let i = {};
      for (let s of o) i[s] = s;
      return i;
    }),
    (t.getValidEnumValues = (o) => {
      let i = t.objectKeys(o).filter((a) => typeof o[o[a]] != "number"),
        s = {};
      for (let a of i) s[a] = o[a];
      return t.objectValues(s);
    }),
    (t.objectValues = (o) =>
      t.objectKeys(o).map(function (i) {
        return o[i];
      })),
    (t.objectKeys =
      typeof Object.keys == "function"
        ? (o) => Object.keys(o)
        : (o) => {
            let i = [];
            for (let s in o) Object.prototype.hasOwnProperty.call(o, s) && i.push(s);
            return i;
          }),
    (t.find = (o, i) => {
      for (let s of o) if (i(s)) return s;
    }),
    (t.isInteger =
      typeof Number.isInteger == "function"
        ? (o) => Number.isInteger(o)
        : (o) => typeof o == "number" && Number.isFinite(o) && Math.floor(o) === o));
  function n(o, i = " | ") {
    return o.map((s) => (typeof s == "string" ? `'${s}'` : s)).join(i);
  }
  ((t.joinValues = n),
    (t.jsonStringifyReplacer = (o, i) => (typeof i == "bigint" ? i.toString() : i)));
})(It || (It = {}));
var q4e;
(function (t) {
  t.mergeShapes = (e, r) => ({ ...e, ...r });
})(q4e || (q4e = {}));
var _e = It.arrayToEnum([
    "string",
    "nan",
    "number",
    "integer",
    "float",
    "boolean",
    "date",
    "bigint",
    "symbol",
    "function",
    "undefined",
    "null",
    "array",
    "object",
    "unknown",
    "promise",
    "void",
    "never",
    "map",
    "set",
  ]),
  Mc = (t) => {
    switch (typeof t) {
      case "undefined":
        return _e.undefined;
      case "string":
        return _e.string;
      case "number":
        return Number.isNaN(t) ? _e.nan : _e.number;
      case "boolean":
        return _e.boolean;
      case "function":
        return _e.function;
      case "bigint":
        return _e.bigint;
      case "symbol":
        return _e.symbol;
      case "object":
        return Array.isArray(t)
          ? _e.array
          : t === null
            ? _e.null
            : t.then && typeof t.then == "function" && t.catch && typeof t.catch == "function"
              ? _e.promise
              : typeof Map < "u" && t instanceof Map
                ? _e.map
                : typeof Set < "u" && t instanceof Set
                  ? _e.set
                  : typeof Date < "u" && t instanceof Date
                    ? _e.date
                    : _e.object;
      default:
        return _e.unknown;
    }
  };
var te = It.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite",
]);
var Hi = class t extends Error {
  get errors() {
    return this.issues;
  }
  constructor(e) {
    (super(),
      (this.issues = []),
      (this.addIssue = (n) => {
        this.issues = [...this.issues, n];
      }),
      (this.addIssues = (n = []) => {
        this.issues = [...this.issues, ...n];
      }));
    let r = new.target.prototype;
    (Object.setPrototypeOf ? Object.setPrototypeOf(this, r) : (this.__proto__ = r),
      (this.name = "ZodError"),
      (this.issues = e));
  }
  format(e) {
    let r =
        e ||
        function (i) {
          return i.message;
        },
      n = { _errors: [] },
      o = (i) => {
        for (let s of i.issues)
          if (s.code === "invalid_union") s.unionErrors.map(o);
          else if (s.code === "invalid_return_type") o(s.returnTypeError);
          else if (s.code === "invalid_arguments") o(s.argumentsError);
          else if (s.path.length === 0) n._errors.push(r(s));
          else {
            let a = n,
              l = 0;
            for (; l < s.path.length; ) {
              let c = s.path[l],
                u = l === s.path.length - 1;
              if (c === "_errors") {
                (u && a._errors.push(r(s)), l++);
                continue;
              }
              (Object.prototype.hasOwnProperty.call(a, c) ||
                (c === "__proto__"
                  ? Object.defineProperty(a, c, {
                      value: { _errors: [] },
                      writable: !0,
                      enumerable: !0,
                      configurable: !0,
                    })
                  : (a[c] = { _errors: [] })),
                (a = a[c]),
                u && a._errors.push(r(s)),
                l++);
            }
          }
      };
    return (o(this), n);
  }
  static assert(e) {
    if (!(e instanceof t)) throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, It.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (r) => r.message) {
    let r = Object.create(null),
      n = [];
    for (let o of this.issues)
      if (o.path.length > 0) {
        let i = o.path[0];
        ((r[i] = r[i] || []), r[i].push(e(o)));
      } else n.push(e(o));
    return { formErrors: n, fieldErrors: r };
  }
  get formErrors() {
    return this.flatten();
  }
};
Hi.create = (t) => new Hi(t);
var J4t = (t, e) => {
    let r;
    switch (t.code) {
      case te.invalid_type:
        t.received === _e.undefined
          ? (r = "Required")
          : (r = `Expected ${t.expected}, received ${t.received}`);
        break;
      case te.invalid_literal:
        r = `Invalid literal value, expected ${JSON.stringify(t.expected, It.jsonStringifyReplacer)}`;
        break;
      case te.unrecognized_keys:
        r = `Unrecognized key(s) in object: ${It.joinValues(t.keys, ", ")}`;
        break;
      case te.invalid_union:
        r = "Invalid input";
        break;
      case te.invalid_union_discriminator:
        r = `Invalid discriminator value. Expected ${It.joinValues(t.options)}`;
        break;
      case te.invalid_enum_value:
        r = `Invalid enum value. Expected ${It.joinValues(t.options)}, received '${t.received}'`;
        break;
      case te.invalid_arguments:
        r = "Invalid function arguments";
        break;
      case te.invalid_return_type:
        r = "Invalid function return type";
        break;
      case te.invalid_date:
        r = "Invalid date";
        break;
      case te.invalid_string:
        typeof t.validation == "object"
          ? "includes" in t.validation
            ? ((r = `Invalid input: must include "${t.validation.includes}"`),
              typeof t.validation.position == "number" &&
                (r = `${r} at one or more positions greater than or equal to ${t.validation.position}`))
            : "startsWith" in t.validation
              ? (r = `Invalid input: must start with "${t.validation.startsWith}"`)
              : "endsWith" in t.validation
                ? (r = `Invalid input: must end with "${t.validation.endsWith}"`)
                : It.assertNever(t.validation)
          : t.validation !== "regex"
            ? (r = `Invalid ${t.validation}`)
            : (r = "Invalid");
        break;
      case te.too_small:
        t.type === "array"
          ? (r = `Array must contain ${t.exact ? "exactly" : t.inclusive ? "at least" : "more than"} ${t.minimum} element(s)`)
          : t.type === "string"
            ? (r = `String must contain ${t.exact ? "exactly" : t.inclusive ? "at least" : "over"} ${t.minimum} character(s)`)
            : t.type === "number"
              ? (r = `Number must be ${t.exact ? "exactly equal to " : t.inclusive ? "greater than or equal to " : "greater than "}${t.minimum}`)
              : t.type === "bigint"
                ? (r = `Number must be ${t.exact ? "exactly equal to " : t.inclusive ? "greater than or equal to " : "greater than "}${t.minimum}`)
                : t.type === "date"
                  ? (r = `Date must be ${t.exact ? "exactly equal to " : t.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(t.minimum))}`)
                  : (r = "Invalid input");
        break;
      case te.too_big:
        t.type === "array"
          ? (r = `Array must contain ${t.exact ? "exactly" : t.inclusive ? "at most" : "less than"} ${t.maximum} element(s)`)
          : t.type === "string"
            ? (r = `String must contain ${t.exact ? "exactly" : t.inclusive ? "at most" : "under"} ${t.maximum} character(s)`)
            : t.type === "number"
              ? (r = `Number must be ${t.exact ? "exactly" : t.inclusive ? "less than or equal to" : "less than"} ${t.maximum}`)
              : t.type === "bigint"
                ? (r = `BigInt must be ${t.exact ? "exactly" : t.inclusive ? "less than or equal to" : "less than"} ${t.maximum}`)
                : t.type === "date"
                  ? (r = `Date must be ${t.exact ? "exactly" : t.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(t.maximum))}`)
                  : (r = "Invalid input");
        break;
      case te.custom:
        r = "Invalid input";
        break;
      case te.invalid_intersection_types:
        r = "Intersection results could not be merged";
        break;
      case te.not_multiple_of:
        r = `Number must be a multiple of ${t.multipleOf}`;
        break;
      case te.not_finite:
        r = "Number must be finite";
        break;
      default:
        ((r = e.defaultError), It.assertNever(t));
    }
    return { message: r };
  },
  Pd = J4t;
var Q4t = Pd;
function wR() {
  return Q4t;
}
var V2 = (t) => {
  let { data: e, path: r, errorMaps: n, issueData: o } = t,
    i = [...r, ...(o.path || [])],
    s = { ...o, path: i };
  if (o.message !== void 0) return { ...o, path: i, message: o.message };
  let a = "",
    l = n
      .filter((c) => !!c)
      .slice()
      .reverse();
  for (let c of l) a = c(s, { data: e, defaultError: a }).message;
  return { ...o, path: i, message: a };
};
function ye(t, e) {
  let r = wR(),
    n = V2({
      issueData: e,
      data: t.data,
      path: t.path,
      errorMaps: [t.common.contextualErrorMap, t.schemaErrorMap, r, r === Pd ? void 0 : Pd].filter(
        (o) => !!o,
      ),
    });
  t.common.issues.push(n);
}
var Ao = class t {
    constructor() {
      this.value = "valid";
    }
    dirty() {
      this.value === "valid" && (this.value = "dirty");
    }
    abort() {
      this.value !== "aborted" && (this.value = "aborted");
    }
    static mergeArray(e, r) {
      let n = [];
      for (let o of r) {
        if (o.status === "aborted") return Ze;
        (o.status === "dirty" && e.dirty(), n.push(o.value));
      }
      return { status: e.value, value: n };
    }
    static async mergeObjectAsync(e, r) {
      let n = [];
      for (let o of r) {
        let i = await o.key,
          s = await o.value;
        n.push({ key: i, value: s });
      }
      return t.mergeObjectSync(e, n);
    }
    static mergeObjectSync(e, r) {
      let n = {};
      for (let o of r) {
        let { key: i, value: s } = o;
        if (i.status === "aborted" || s.status === "aborted") return Ze;
        (i.status === "dirty" && e.dirty(),
          s.status === "dirty" && e.dirty(),
          i.value !== "__proto__" &&
            (typeof s.value < "u" || o.alwaysSet) &&
            (n[i.value] = s.value));
      }
      return { status: e.value, value: n };
    }
  },
  Ze = Object.freeze({ status: "aborted" }),
  Wv = (t) => ({ status: "dirty", value: t }),
  Ho = (t) => ({ status: "valid", value: t }),
  sX = (t) => t.status === "aborted",
  aX = (t) => t.status === "dirty",
  Cf = (t) => t.status === "valid",
  _R = (t) => typeof Promise < "u" && t instanceof Promise;
var ke;
(function (t) {
  ((t.errToObj = (e) => (typeof e == "string" ? { message: e } : e || {})),
    (t.toString = (e) => (typeof e == "string" ? e : e?.message)));
})(ke || (ke = {}));
var vs = class {
    constructor(e, r, n, o) {
      ((this._cachedPath = []),
        (this.parent = e),
        (this.data = r),
        (this._path = n),
        (this._key = o));
    }
    get path() {
      return (
        this._cachedPath.length ||
          (Array.isArray(this._key)
            ? this._cachedPath.push(...this._path, ...this._key)
            : this._cachedPath.push(...this._path, this._key)),
        this._cachedPath
      );
    }
  },
  G4e = (t, e) => {
    if (Cf(e)) return { success: !0, data: e.value };
    if (!t.common.issues.length) throw new Error("Validation failed but no issues detected.");
    return {
      success: !1,
      get error() {
        if (this._error) return this._error;
        let r = new Hi(t.common.issues);
        return ((this._error = r), this._error);
      },
    };
  };
function at(t) {
  if (!t) return {};
  let { errorMap: e, invalid_type_error: r, required_error: n, description: o } = t;
  if (e && (r || n))
    throw new Error(
      `Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`,
    );
  return e
    ? { errorMap: e, description: o }
    : {
        errorMap: (s, a) => {
          let { message: l } = t;
          return s.code === "invalid_enum_value"
            ? { message: l ?? a.defaultError }
            : typeof a.data > "u"
              ? { message: l ?? n ?? a.defaultError }
              : s.code !== "invalid_type"
                ? { message: a.defaultError }
                : { message: l ?? r ?? a.defaultError };
        },
        description: o,
      };
}
var St = class {
    get description() {
      return this._def.description;
    }
    _getType(e) {
      return Mc(e.data);
    }
    _getOrReturnCtx(e, r) {
      return (
        r || {
          common: e.parent.common,
          data: e.data,
          parsedType: Mc(e.data),
          schemaErrorMap: this._def.errorMap,
          path: e.path,
          parent: e.parent,
        }
      );
    }
    _processInputParams(e) {
      return {
        status: new Ao(),
        ctx: {
          common: e.parent.common,
          data: e.data,
          parsedType: Mc(e.data),
          schemaErrorMap: this._def.errorMap,
          path: e.path,
          parent: e.parent,
        },
      };
    }
    _parseSync(e) {
      let r = this._parse(e);
      if (_R(r)) throw new Error("Synchronous parse encountered promise.");
      return r;
    }
    _parseAsync(e) {
      let r = this._parse(e);
      return Promise.resolve(r);
    }
    parse(e, r) {
      let n = this.safeParse(e, r);
      if (n.success) return n.data;
      throw n.error;
    }
    safeParse(e, r) {
      let n = {
          common: { issues: [], async: r?.async ?? !1, contextualErrorMap: r?.errorMap },
          path: r?.path || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data: e,
          parsedType: Mc(e),
        },
        o = this._parseSync({ data: e, path: n.path, parent: n });
      return G4e(n, o);
    }
    "~validate"(e) {
      let r = {
        common: { issues: [], async: !!this["~standard"].async },
        path: [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data: e,
        parsedType: Mc(e),
      };
      if (!this["~standard"].async)
        try {
          let n = this._parseSync({ data: e, path: [], parent: r });
          return Cf(n) ? { value: n.value } : { issues: r.common.issues };
        } catch (n) {
          (n?.message?.toLowerCase()?.includes("encountered") && (this["~standard"].async = !0),
            (r.common = { issues: [], async: !0 }));
        }
      return this._parseAsync({ data: e, path: [], parent: r }).then((n) =>
        Cf(n) ? { value: n.value } : { issues: r.common.issues },
      );
    }
    async parseAsync(e, r) {
      let n = await this.safeParseAsync(e, r);
      if (n.success) return n.data;
      throw n.error;
    }
    async safeParseAsync(e, r) {
      let n = {
          common: { issues: [], contextualErrorMap: r?.errorMap, async: !0 },
          path: r?.path || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data: e,
          parsedType: Mc(e),
        },
        o = this._parse({ data: e, path: n.path, parent: n }),
        i = await (_R(o) ? o : Promise.resolve(o));
      return G4e(n, i);
    }
    refine(e, r) {
      let n = (o) =>
        typeof r == "string" || typeof r > "u" ? { message: r } : typeof r == "function" ? r(o) : r;
      return this._refinement((o, i) => {
        let s = e(o),
          a = () => i.addIssue({ code: te.custom, ...n(o) });
        return typeof Promise < "u" && s instanceof Promise
          ? s.then((l) => (l ? !0 : (a(), !1)))
          : s
            ? !0
            : (a(), !1);
      });
    }
    refinement(e, r) {
      return this._refinement((n, o) =>
        e(n) ? !0 : (o.addIssue(typeof r == "function" ? r(n, o) : r), !1),
      );
    }
    _refinement(e) {
      return new aa({
        schema: this,
        typeName: se.ZodEffects,
        effect: { type: "refinement", refinement: e },
      });
    }
    superRefine(e) {
      return this._refinement(e);
    }
    constructor(e) {
      ((this.spa = this.safeParseAsync),
        (this._def = e),
        (this.parse = this.parse.bind(this)),
        (this.safeParse = this.safeParse.bind(this)),
        (this.parseAsync = this.parseAsync.bind(this)),
        (this.safeParseAsync = this.safeParseAsync.bind(this)),
        (this.spa = this.spa.bind(this)),
        (this.refine = this.refine.bind(this)),
        (this.refinement = this.refinement.bind(this)),
        (this.superRefine = this.superRefine.bind(this)),
        (this.optional = this.optional.bind(this)),
        (this.nullable = this.nullable.bind(this)),
        (this.nullish = this.nullish.bind(this)),
        (this.array = this.array.bind(this)),
        (this.promise = this.promise.bind(this)),
        (this.or = this.or.bind(this)),
        (this.and = this.and.bind(this)),
        (this.transform = this.transform.bind(this)),
        (this.brand = this.brand.bind(this)),
        (this.default = this.default.bind(this)),
        (this.catch = this.catch.bind(this)),
        (this.describe = this.describe.bind(this)),
        (this.pipe = this.pipe.bind(this)),
        (this.readonly = this.readonly.bind(this)),
        (this.isNullable = this.isNullable.bind(this)),
        (this.isOptional = this.isOptional.bind(this)),
        (this["~standard"] = { version: 1, vendor: "zod", validate: (r) => this["~validate"](r) }));
    }
    optional() {
      return sa.create(this, this._def);
    }
    nullable() {
      return Lc.create(this, this._def);
    }
    nullish() {
      return this.nullable().optional();
    }
    array() {
      return kd.create(this);
    }
    promise() {
      return Tf.create(this, this._def);
    }
    or(e) {
      return Kv.create([this, e], this._def);
    }
    and(e) {
      return Zv.create(this, e, this._def);
    }
    transform(e) {
      return new aa({
        ...at(this._def),
        schema: this,
        typeName: se.ZodEffects,
        effect: { type: "transform", transform: e },
      });
    }
    default(e) {
      let r = typeof e == "function" ? e : () => e;
      return new eb({
        ...at(this._def),
        innerType: this,
        defaultValue: r,
        typeName: se.ZodDefault,
      });
    }
    brand() {
      return new K2({ typeName: se.ZodBranded, type: this, ...at(this._def) });
    }
    catch(e) {
      let r = typeof e == "function" ? e : () => e;
      return new tb({ ...at(this._def), innerType: this, catchValue: r, typeName: se.ZodCatch });
    }
    describe(e) {
      let r = this.constructor;
      return new r({ ...this._def, description: e });
    }
    pipe(e) {
      return Z2.create(this, e);
    }
    readonly() {
      return rb.create(this);
    }
    isOptional() {
      return this.safeParse(void 0).success;
    }
    isNullable() {
      return this.safeParse(null).success;
    }
  },
  eVt = /^c[^\s-]{8,}$/i,
  tVt = /^[0-9a-z]+$/,
  rVt = /^[0-9A-HJKMNP-TV-Z]{26}$/i,
  nVt = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i,
  oVt = /^[a-z0-9_-]{21}$/i,
  iVt = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
  sVt =
    /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/,
  aVt = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i,
  lVt = "^[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$",
  lX,
  cVt =
    /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
  uVt =
    /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
  dVt =
    /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
  pVt =
    /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
  mVt = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
  fVt = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
  W4e =
    "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))",
  hVt = new RegExp(`^${W4e}$`);
