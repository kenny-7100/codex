function d9(t) {
  return t instanceof Error && "code" in t && (t.code === "FileNotFound" || t.code === "ENOENT");
}
function m9(t, e) {
  let r = t.split(/[\\/]+/).filter(Boolean);
  return r.length === 0
    ? []
    : e.flatMap((n) => {
        let o = cf.Uri.joinPath(n.uri, ...r),
          i = r.indexOf(n.name);
        if (i === -1) return [o];
        let s = cf.Uri.joinPath(n.uri, ...r.slice(i + 1));
        return [o, s];
      });
}
function f9(t) {
  return t.replace(/^([ab])[\\/]/, "");
}
var dL = class extends ee {
  logger = he();
  async detectTarget() {
    return { available: !1 };
  }
  async getTargets(e) {
    return { preferredTarget: null, availableTargets: [], targets: [] };
  }
  async loadTargetIcon({ target: e }) {
    throw new Error(`Open target "${e}" is unavailable in the extension`);
  }
  async open({ path: e, line: r, column: n, cwd: o, target: i }) {
    let s = i === "fileManager",
      a = s ? "reveal" : "open",
      l = typeof r == "number" ? r : void 0,
      c = typeof n == "number" ? n : 1,
      u = e.replace(/^([ab])[\\/]/, ""),
      p = process.platform === "win32" ? pu(u) : u,
      m = Array.from(oo.workspace.workspaceFolders ?? []),
      f = async (v) => {
        try {
          if (s) return (await oo.commands.executeCommand("revealFileInOS", v), !0);
          let y = await oo.workspace.openTextDocument(v),
            w = new oo.Position(Math.max(0, (l ?? 1) - 1), Math.max(0, c - 1)),
            _ = l == null ? void 0 : new oo.Range(w, w);
          return (await oo.window.showTextDocument(y, { preview: !1, selection: _ }), !0);
        } catch {
          return !1;
        }
      };
    if (NGe(p)) {
      let v = await f(oo.Uri.file(p));
      return (
        v ||
          this.logger.error("Failed to handle absolute path", {
            safe: { actionVerb: a },
            sensitive: { normalized: p },
          }),
        { success: v }
      );
    }
    let h = !1;
    if (o) {
      let v = p.split(/[\\/]+/).filter(Boolean),
        y = oo.Uri.file(o);
      if (((h = await f(oo.Uri.joinPath(y, ...v))), !h)) {
        let w = v.indexOf(rHe.basename(o));
        w !== -1 && (h = await f(oo.Uri.joinPath(y, ...v.slice(w + 1))));
      }
    }
    for (let v of m9(p, m)) {
      if (h) break;
      h = await f(v);
    }
    if (!h && p.length > 0)
      try {
        let v = await oo.workspace.findFiles(`**/${p.replace(/\\/g, "/")}`, void 0, 1);
        v.length > 0 && (h = await f(v[0]));
      } catch {}
    return (
      h ||
        this.logger.error("Failed to resolve file path in workspaces", {
          safe: { actionVerb: a },
          sensitive: {
            raw: e,
            normalized: p,
            workspaceList: m.map((v) => v.uri.fsPath).join(", "),
          },
        }),
      { success: h }
    );
  }
  async setGlobalPreferredTarget() {
    return { success: !1 };
  }
};
var uHe = F(require("path")),
  w9 = F(require("vscode"));
Pt();
var YA = F(require("vscode"));
xo();
O();
Pt();
var _v = F(require("vscode"));
O();
var lHe = F(require("vscode"));
wd();
var RWt = "openai.chatgpt",
  EWt = "0.0.0";
function y9() {
  let e = lHe.extensions.getExtension(RWt)?.packageJSON?.version;
  return typeof e == "string" && e.trim().length > 0 ? e : EWt;
}
function Ic() {
  return fI(y9());
}
function pL() {
  return Ic().isPreRelease ? "public-beta" : "prod";
}
function cHe() {
  return {
    get: CWt,
    getSystemInfo: async () => ({
      platform: process.platform,
      osVersion: await KGe(),
      isVsCodeRunningInsideWsl: _v.env.remoteName === "wsl",
    }),
    getPackagingInfo: async () => ({ isPackaged: !1 }),
    getLocaleInfo: async () => ({
      ideLocale: _v.env.language,
      systemLocale: Intl.DateTimeFormat().resolvedOptions().locale,
    }),
  };
}
function df() {
  let t = _v.env.appName ?? "",
    e = t.toLowerCase();
  return e.includes("cursor")
    ? "Cursor"
    : e.includes("windsurf")
      ? "Windsurf"
      : e.includes("visual studio code") ||
          e === "code" ||
          e.startsWith("code ") ||
          e.endsWith(" code") ||
          e.includes("vscode")
        ? "VS Code"
        : t || "VS Code";
}
async function CWt() {
  return {
    version: Ic().version,
    buildNumber: null,
    buildFlavor: pL(),
    osName: bme(process.platform) ?? null,
    systemVersion: null,
    appName: "Codex",
    editor: { name: df(), vscodeApiVersion: _v.version },
    appIconMedium: null,
    dockIconPreviews: null,
  };
}
var TWt = "codexViewContainer",
  b9 = "chatgpt.sidebarView",
  PWt = "codexSecondaryViewContainer",
  S9 = "chatgpt.sidebarSecondaryView",
  v9 = { major: 1, minor: 106 },
  mL = "chatgpt.doesNotSupportSecondarySidebar",
  IWt = { containerId: TWt, viewId: b9 },
  kWt = { containerId: PWt, viewId: S9 };
function fL(t) {
  return xv(t) ? kWt : IWt;
}
function xv(t) {
  if (df() === "Cursor") return !1;
  let e = DWt(t);
  return e == null ? !1 : e.major !== v9.major ? e.major > v9.major : e.minor >= v9.minor;
}
function DWt(t) {
  let e = /^(?<major>\d+)\.(?<minor>\d+)/.exec(t);
  return e?.groups == null
    ? null
    : { major: Number(e.groups.major), minor: Number(e.groups.minor) };
}
async function vi() {
  let t = fL(YA.version);
  try {
    (await YA.commands.executeCommand(`workbench.view.extension.${t.containerId}`),
      await YA.commands.executeCommand(`${t.viewId}.focus`));
  } catch (e) {
    he().error("Failed to focus Codex view", {
      safe: { error: e instanceof Error ? e.message : String(e) },
      sensitive: {},
    });
  }
}
function dHe(t) {
  let e = w9.window.activeTextEditor;
  if (!e) return Promise.resolve();
  let r = e.document.uri;
  if (r.scheme !== "file") return Promise.resolve();
  let n = e.selection.start.line + 1,
    o = e.selection.end.line + 1;
  return (
    e.selection.end.character === 0 && e.selection.end.line > e.selection.start.line && o--,
    mHe(t, r, { startLine: n, endLine: o })
  );
}
function pHe(t, e) {
  let r = e ?? w9.window.activeTextEditor?.document.uri;
  return !r || r.scheme !== "file" ? Promise.resolve() : mHe(t, r);
}
async function mHe(t, e, r) {
  let n = e.fsPath,
    i = { label: uHe.basename(n), path: n, fsPath: n },
    s = r ? { ...i, startLine: r.startLine, endLine: r.endLine } : i;
  (await vi(), t.addContextFile(s));
}
var fHe = require("crypto"),
  _9 = class t {
    constructor(e) {
      this.mcpConnection = e;
      let r = this.mcpConnection.registerProvider(t.providerName, {
        onNotification: (n) => this.handleNotification(n),
        onResult: (n) => this.handleResult(n),
      });
      this.disposables.push(r);
    }
    static providerName = "auth";
    disposables = [];
    pending = new Map();
    async getToken({ refreshToken: e }) {
      return (await this.getAuthStatus({ refreshToken: e }))?.authToken ?? null;
    }
    getAuthStatus({ refreshToken: e }) {
      let r = (0, fHe.randomUUID)(),
        n = new Promise((o, i) => {
          this.pending.set(r, { resolve: o, reject: i });
        });
      return (
        this.mcpConnection.sendRequest(t.providerName, r, "getAuthStatus", {
          includeToken: !0,
          refreshToken: e,
        }),
        n
      );
    }
    resolve(e, r) {
      let n = this.pending.get(e);
      n && (this.pending.delete(e), n.resolve(r));
    }
    reject(e, r) {
      let n = this.pending.get(e);
      n && (this.pending.delete(e), n.reject(r));
    }
    handleResult(e) {
      if (typeof e.id != "string") return;
      if (e.error) {
        this.reject(e.id, e.error);
        return;
      }
      let r = e.result ?? null;
      this.resolve(e.id, r);
    }
    handleNotification(e) {
      e.method === "account/updated" && this.getToken({ refreshToken: !1 });
    }
    dispose() {
      for (let e of this.disposables) e.dispose();
      ((this.disposables.length = 0), this.pending.clear());
    }
  };
function hHe(t) {
  return new _9(t);
}
Pt();
var hL = class {
  logger = Dt("ChunkedWebviewMessageSender");
  sender;
  constructor(e = {}) {
    this.sender = new vM({
      ...e,
      deliver: (r, n, o) => {
        r.postMessage(o ?? n).then(
          (i) => {
            i || this.sender.dispose(r);
          },
          (i) => {
            (this.sender.dispose(r), this.logSendError(i));
          },
        );
      },
      getPayload: (r) => r,
      onSendError: (r, n) => {
        this.logSendError(n);
      },
    });
  }
  send(e, r) {
    this.sender.send(e, r);
  }
  sendInline(e, r) {
    this.sender.sendInline(e, r);
  }
  acknowledge(e, r, n) {
    this.sender.acknowledge(e, r, n);
  }
  dispose(e) {
    this.sender.dispose(e);
  }
  logSendError(e) {
    this.logger.warning("chunked_webview_message_send_failed", {
      safe: {},
      sensitive: { error: e },
    });
  }
};
var wHe = F(Is());
O();
var pf = F(require("vscode"));
O();
var gHe = F(require("vscode")),
  Av = "openai-codex",
  yHe = "route";
function gL(t) {
  let { scheme: e, authority: r, path: n } = t;
  if (e !== Av) return null;
  if (r !== yHe) return null;
  let o = n.startsWith("/") ? n.slice(1) : n,
    [i, s] = o.split("/");
  return {
    path: `${n}${t.query === "" ? "" : `?${t.query}`}`,
    conversationId: i === "local" && s != null ? s : null,
  };
}
function vHe(t) {
  return yL(`/local/${t}`);
}
function yL(t) {
  let e = t.indexOf("?"),
    r = e === -1 ? t : t.slice(0, e),
    n = e === -1 ? "" : t.slice(e + 1);
  return gHe.Uri.file(r).with({ scheme: Av, authority: yHe, query: n });
}
var bHe = "codex.chatSessionProvider",
  MWt = "codex.chatSessionObserver",
  x9 = "Codex Agent",
  SHe = 80;
var vL = class {
    constructor(e, r, n, o) {
      this.modelProxyManager = r;
      this.conversationSummaryProvider = n;
      ((this.conversationLoader = new A9(e)),
        this.subscriptions.push(
          r.onDidChangeIsCopilotApiAvailable(() => {
            this.onDidChangeChatSessionItemsEmitter.fire();
          }),
        ),
        this.subscriptions.push(
          o.onDidUpdateEntry(({ key: i }) => {
            i === J.USE_COPILOT_AUTH_IF_AVAILABLE && this.onDidChangeChatSessionItemsEmitter.fire();
          }),
        ),
        this.subscriptions.push(
          e.registerProvider(MWt, { onNotification: this.handleMcpNotification.bind(this) }),
        ),
        this.seedPendingConversationsFromTabs(),
        this.subscriptions.push(
          this.onDidChangeChatSessionItemsEmitter,
          this.onDidCommitChatSessionItemEmitter,
        ));
    }
    subscriptions = [];
    onDidChangeChatSessionItemsEmitter = new pf.EventEmitter();
    onDidChangeChatSessionItems = this.onDidChangeChatSessionItemsEmitter.event;
    onDidCommitChatSessionItemEmitter = new pf.EventEmitter();
    onDidCommitChatSessionItem = this.onDidCommitChatSessionItemEmitter.event;
    conversationLoader;
    lifecycleByConversationId = new Map();
    pendingConversations = new Map();
    modelProviderByConversationId = new Map();
    async provideChatSessionItems(e) {
      let r = this.modelProxyManager.isUserUsingCopilotInference();
      function n(l) {
        return r ? l === YI : l !== YI;
      }
      let o = await this.conversationLoader.provideChatSessionItems(r, e),
        i = [];
      for (let { item: l, summary: c } of o)
        (this.pendingConversations.delete(l.id),
          this.modelProviderByConversationId.set(l.id, c.modelProvider),
          n(c.modelProvider) && i.push(l));
      let s = i.map((l) => this.applyLifecycleToChatSessionItem(l));
      return Array.from(this.pendingConversations.values())
        .filter((l) => n(l.modelProvider))
        .map((l) => this.applyLifecycleToChatSessionItem(l.item))
        .concat(s);
    }
    registerPendingConversation(e, r) {
      let { conversationId: n, resource: o, label: i, startedAt: s, modelProvider: a } = e;
      if (r?.onlyIfMissing && this.pendingConversations.has(n)) return;
      let l = r?.markInProgress ?? !0,
        u = _He(i ?? x9),
        p = s ?? (l ? Date.now() : void 0),
        m = { id: n, resource: o, label: u };
      ((m.status = l ? 2 : 1), p != null && (m.timing = { startTime: p }));
      let h = this.pendingConversations.get(n)?.item;
      (!h ||
        h.label !== m.label ||
        h.status !== m.status ||
        h.resource?.toString() !== m.resource?.toString() ||
        !(0, wHe.default)(h.timing, m.timing)) &&
        (this.pendingConversations.set(e.conversationId, { item: m, modelProvider: a }),
        this.modelProviderByConversationId.set(e.conversationId, a),
        l
          ? this.updateConversationStatus(e.conversationId, 2, { startTimeHint: p })
          : this.onDidChangeChatSessionItemsEmitter.fire());
    }
    clearPendingConversation(e) {
      this.pendingConversations.delete(e) && this.onDidChangeChatSessionItemsEmitter.fire();
    }
    handleMcpNotification(e) {
      let r = this.extractConversationId(e.params);
      if (r)
        switch (e.method) {
          case "codex/event/task_started":
            this.updateConversationStatus(r, 2);
            break;
          case "codex/event/task_complete":
            this.updateConversationStatus(r, 1);
            break;
          case "codex/event/turn_aborted":
          case "codex/event/error":
          case "codex/event/stream_error":
            this.updateConversationStatus(r, 0);
            break;
          default:
            break;
        }
    }
    extractConversationId(e) {
      if (!e || typeof e != "object") return null;
      let r = e.conversationId;
      return typeof r == "string" ? r : null;
    }
    updateConversationStatus(e, r, n) {
      let o = this.lifecycleByConversationId.get(e),
        i = Date.now(),
        s = o?.startTime ?? n?.startTimeHint;
      r === 2 && (s = n?.startTimeHint ?? o?.startTime ?? i);
      let a;
      (r === 1 || r === 0) &&
        ((a = o?.endTime ?? i), s || (s = o?.startTime ?? n?.startTimeHint ?? a));
      let l = { status: r, startTime: s, endTime: a },
        c = !o || o.status !== l.status || o.startTime !== l.startTime || o.endTime !== l.endTime;
      (this.lifecycleByConversationId.set(e, l),
        c && this.onDidChangeChatSessionItemsEmitter.fire());
    }
    applyLifecycleToChatSessionItem(e, r) {
      let n = r ?? this.lifecycleByConversationId.get(e.id),
        o = { ...e, timing: e.timing ? { ...e.timing } : void 0 };
      if (!n) return o;
      o.status = n.status;
      let i = this.mergeTiming(o.timing, n);
      return (i ? (o.timing = i) : delete o.timing, o);
    }
    mergeTiming(e, r) {
      let n = r.startTime ?? e?.startTime,
        i = r.status === 1 || r.status === 0 ? (r.endTime ?? e?.endTime) : void 0;
      return n == null && i == null
        ? e
        : i != null
          ? { startTime: n ?? i, endTime: i }
          : { startTime: n ?? Date.now() };
    }
    seedPendingConversationsFromTabs() {
      for (let e of pf.window.tabGroups.all) for (let r of e.tabs) this.trackTabIfNeeded(r);
    }
    async trackTabIfNeeded(e) {
      let r = e.input;
      if (!(r instanceof pf.TabInputCustom)) return;
      let n = gL(r.uri);
      if (n) {
        if (n.conversationId == null) return;
      } else return;
      let o = await this.conversationSummaryProvider.getConversationSummary(n.conversationId),
        i = Date.now(),
        { preview: s, modelProvider: a } = o.summary,
        l = s ?? x9;
      this.registerPendingConversation(
        {
          conversationId: n.conversationId,
          resource: r.uri,
          label: l,
          startedAt: i,
          modelProvider: a,
        },
        { markInProgress: !1, onlyIfMissing: !0 },
      );
    }
    dispose() {
      this.subscriptions.forEach((e) => {
        e.dispose();
      });
    }
  },
  A9 = class {
    constructor(e) {
      this.codexAppServer = e;
      let r = { onResult: this.onAppServerResult.bind(this) };
      e.registerProvider(bHe, r);
    }
    nextRequestId = 0;
    requestToCallback = new Map();
    onAppServerResult(e) {
      let r = this.requestToCallback.get(e.id);
      r && (this.requestToCallback.delete(e.id), r(e));
    }
    async provideChatSessionItems(e, r) {
      return (await this.requestThreadList(e)).data.map((o) => {
        let i = this.toThreadListSummary(o);
        return { summary: i, item: this.toChatSessionItem(i) };
      });
    }
    toChatSessionItem(e) {
      let { conversationId: r, preview: n, createdAtMs: o } = e,
        i = vHe(r),
        s = _He(n),
        a = o != null ? { startTime: o } : void 0;
      return { id: r, resource: i, label: s, timing: a };
    }
    toThreadListSummary(e) {
      let r = e.createdAt * 1e3,
        n = Number.isFinite(r) ? r : null;
      return {
        conversationId: e.id,
        preview: e.name?.trim() || e.preview,
        createdAtMs: n,
        modelProvider: e.modelProvider,
      };
    }
    requestThreadList(e) {
      let r = String(this.nextRequestId++),
        n = new Promise((o, i) => {
          this.requestToCallback.set(r, (s) => {
            if (s.error) {
              i(new Error(s.error.message));
              return;
            }
            if (s.result == null) {
              i(new Error("No result in response"));
              return;
            }
            o(s.result);
          });
        });
      return (
        this.codexAppServer.sendRequest(bHe, r, "thread/list", {
          limit: 50,
          cursor: null,
          sortKey: "created_at",
          modelProviders: e ? [YI] : null,
          archived: !1,
          sourceKinds: ug,
          useStateDbOnly: !0,
        }),
        n
      );
    }
  };
function _He(t) {
  let e = t.replace(/\s+/g, " ").trim();
  return e.length === 0 ? x9 : e.length <= SHe ? e : `${e.slice(0, SHe - 1).trimEnd()}\u2026`;
}
var DHe = require("path");
O();
SD();
j0();
cG();
$z();
Pt();
var P9 = F(require("vscode"));
O();
Pt();
O();
Sd();
var OWt = "http://localhost:8000/api",
  NWt = "https://chatgpt.com/backend-api";
function LWt() {
  switch (Wn("apiEndpoint")) {
    case "localhost":
      return OWt;
    case "production":
    case void 0:
    default:
      return NWt;
  }
}
function xHe(t) {
  return t.startsWith("data:") || t.startsWith("http") ? t : wde(LWt(), t);
}
xo();
function R9(t) {
  return new Promise((e) => setTimeout(e, t));
}
var JA = "codex_vscode",
  AHe = "vscode://codex/",
  E9 = 3,
  BWt = 300,
  FWt = 2e3,
  bL = class {
    constructor(e, r, n) {
      this.authProvider = e;
      this.extensionFetchHandler = r;
      this.userAgentProvider = n;
    }
    abortSignalsByWebview = new Map();
    setAbortSignal(e, r, n) {
      let o = this.abortSignalsByWebview.get(r) ?? new Map();
      (o.set(e, n), this.abortSignalsByWebview.set(r, o));
    }
    deleteAbortSignal(e, r) {
      let n = this.abortSignalsByWebview.get(r);
      (n?.delete(e), n?.size === 0 && this.abortSignalsByWebview.delete(r));
    }
    shouldRetryStatus(e) {
      return e === 408 || e === 425 || e === 429 || (e >= 500 && e <= 599);
    }
    backoffDelay(e) {
      let r = Math.min(FWt, BWt * 2 ** e),
        n = r * 0.2 * (Math.random() - 0.5) * 2;
      return Math.max(0, Math.floor(r + n));
    }
    buildHeaders(e, r, n) {
      let o = { ...e },
        i = (a) => Object.keys(o).some((l) => l.toLowerCase() === a);
      if (n.attachAuth && r && !i("authorization")) {
        o.Authorization = `Bearer ${r}`;
        try {
          let a = JSON.parse(Buffer.from(r.split(".")[1], "base64url").toString("utf8"))[
            "https://api.openai.com/auth"
          ]?.chatgpt_account_id;
          a && (o["ChatGPT-Account-Id"] = a);
        } catch {}
      }
      (n.method !== "GET" && !i("content-type") && (o["Content-Type"] = "application/json"),
        i("originator") || (o.originator = JA));
      let s = this.userAgentProvider.getUserAgent();
      return (s && !i("user-agent") && (o["User-Agent"] = s), o);
    }
    shouldAttachAuth(e) {
      let n = new URL(e).host.toLowerCase();
      return n === "status.openai.com"
        ? !1
        : n === "localhost:8000" ||
            n === "localhost" ||
            n.endsWith(".openai.com") ||
            n === "openai.com" ||
            n === "chatgpt.com" ||
            (n.endsWith(".chatgpt.com") && !n.startsWith("ab."));
    }
    async fetch(e, r) {
      try {
        let n = new AbortController();
        if ((this.setAbortSignal(e.requestId, r?.originWebview, n), e.url.startsWith(AHe))) {
          let o = await this.extensionFetchHandler.handleVSCodeRequest(
            e.url.slice(AHe.length),
            e.body ? JSON.parse(e.body) : void 0,
            {
              originWebview: r?.originWebview,
              source: $pe(e.headers?.[XG]) ? e.headers[XG] : null,
              signal: n.signal,
            },
          );
          return {
            type: "fetch-response",
            responseType: "success",
            requestId: e.requestId,
            status: 200,
            headers: {},
            bodyJsonString: JSON.stringify(o),
          };
        }
        throw new Error("HTTP requests must use the HTTP fetch service.");
      } catch (n) {
        return {
          type: "fetch-response",
          responseType: "error",
          requestId: e.requestId,
          status: 433,
          error: n instanceof Error ? n.message : "Unknown error",
        };
      } finally {
        this.deleteAbortSignal(e.requestId, r?.originWebview);
      }
    }
    async fetchHttp(e, r, n) {
      try {
        let o = xHe(r.url),
          i = r.retry === "never" || (r.method === "POST" && new URL(o).pathname.endsWith(Sde)),
          s = this.shouldAttachAuth(o),
          a = s ? await this.authProvider.getToken({ refreshToken: !1 }) : null,
          l = async (c, u) => {
            let p = $Wt(u),
              m = this.buildHeaders(r.headers, p ? u : null, { method: r.method, attachAuth: s }),
              f = Object.keys(m).some((h) => h.toLowerCase() === "authorization");
            if (r.expectedIdentity != null) {
              let h = new Headers(m).get("authorization"),
                v = Zg(h?.match(/^Bearer (.+)$/i)?.[1] ?? null);
              if (
                v?.accountId !== r.expectedIdentity.accountId ||
                v.userId !== r.expectedIdentity.userId
              )
                return {
                  type: "fetch-response",
                  responseType: "error",
                  requestId: e,
                  status: 499,
                  error: "Authenticated principal changed",
                };
            }
            try {
              let h = await fetch(o, {
                  method: r.method,
                  headers: m,
                  body: r.body,
                  redirect: r.redirect,
                  signal: n,
                }),
                v = !h.ok && f ? await WWe(h) : null;
              if (h.status === 401 && !i && f && v == null && c < E9) {
                let w = await this.authProvider.getToken({ refreshToken: !0 });
                if (w && w !== u) return (await h.body?.cancel(), await l(c + 1, w));
              }
              if (
                r.retry !== !1 &&
                !(r.retry === "except-rate-limit" && h.status === 429) &&
                this.shouldRetryStatus(h.status) &&
                !i &&
                c < E9
              ) {
                await h.body?.cancel();
                let w = this.backoffDelay(c);
                return (await R9(w), await l(c + 1, u));
              }
              if (!h.ok) {
                let w = h.headers.get("cf-ray");
                h.status === 404
                  ? he().info("Error fetching", {
                      safe: {
                        url: r.url,
                        httpStatus: h.status,
                        statusText: h.statusText,
                        requestId: w,
                      },
                      sensitive: {},
                    })
                  : he().error("Error fetching", {
                      safe: {
                        url: r.url,
                        httpStatus: h.status,
                        statusText: h.statusText,
                        requestId: w,
                      },
                      sensitive: {},
                    });
              }
              if (h.ok || (r.returnErrorResponse && v == null)) {
                let w = new Headers(h.headers);
                return (
                  w.delete("authorization"),
                  {
                    response: new Response(h.body, {
                      status: h.status,
                      statusText: h.statusText,
                      headers: w,
                    }),
                  }
                );
              }
              let y = await h.text().catch(() => (n.throwIfAborted(), null));
              return {
                type: "fetch-response",
                responseType: "error",
                requestId: e,
                status: h.status,
                error: v?.message ?? (y || h.statusText),
                responseStatus: h.status,
                errorCode: v?.errorCode ?? _de(y),
              };
            } catch (h) {
              if (n.aborted)
                return {
                  type: "fetch-response",
                  responseType: "error",
                  error: "Request cancelled",
                  requestId: e,
                  status: 499,
                };
              if (r.retry !== !1 && !i && c < E9) {
                let v = this.backoffDelay(c);
                return (await R9(v), l(c + 1, u));
              }
              return (
                he().error("Error fetching", {
                  safe: { url: r.url, error: String(h) },
                  sensitive: {},
                }),
                {
                  type: "fetch-response",
                  responseType: "error",
                  requestId: e,
                  status: 432,
                  error: h instanceof Error ? h.message : "Unknown error",
                  responseStatus: null,
                  errorKind: kG(h),
                }
              );
            }
          };
        return await l(0, a);
      } catch (o) {
        return (
          he().error("Error fetching", { safe: { url: r.url, error: o }, sensitive: {} }),
          {
            type: "fetch-response",
            responseType: "error",
            requestId: e,
            status: 433,
            error: o instanceof Error ? o.message : "Unknown error",
            responseStatus: null,
            errorKind: kG(o),
          }
        );
      }
    }
    cancel(e, r) {
      let n = this.abortSignalsByWebview.get(r)?.get(e);
      n && (n.abort(), this.deleteAbortSignal(e, r));
    }
  };
function $Wt(t) {
  return t ? /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(t) : !1;
}
var SL = require("child_process"),
  EHe = require("path");
Pt();
var _d = F(require("vscode"));
Sd();
wd();
function C9() {
  if (!0) {
    let t,
      e,
      { arch: r, platform: n } = process;
    switch (n) {
      case "win32":
        t = "windows";
        break;
      case "darwin":
        t = "macos";
        break;
      case "aix":
      case "android":
      case "freebsd":
      case "haiku":
      case "linux":
      case "openbsd":
      case "sunos":
      case "cygwin":
      case "netbsd":
        t = "linux";
        break;
    }
    switch (r) {
      case "x64":
        e = "x86_64";
        break;
      case "arm64":
        e = "aarch64";
        break;
      case "arm":
      case "ia32":
      case "loong64":
      case "mips":
      case "mipsel":
      case "ppc64":
      case "riscv64":
      case "s390x":
        throw new Error(`unrecognized architecture: ${r}`);
    }
    return `bin/${`${t}-${e}`}`;
  }
  return "bin";
}
wd();
xo();
var UWt = 3e3,
  CHe = "__CODEX_VSCODE_REMOTE_CODEX_HOME_START__",
  THe = "__CODEX_VSCODE_REMOTE_CODEX_HOME_END__",
  Rv = class extends Error {
    appServerCrashContext;
    signal;
    exitCode;
    constructor(
      e,
      { signal: r, exitCode: n } = { signal: null, exitCode: null },
      { appServerCrashContext: o, cause: i } = {},
    ) {
      (super(`Codex process errored: ${e}`, { cause: i }),
        (this.name = "CodexProcessError"),
        (this.appServerCrashContext = o ?? null),
        (this.signal = r),
        (this.exitCode = n));
    }
  };
function PHe(t, e) {
  let r = process.platform === "win32",
    n = jWt(),
    o = C9(),
    i = T9(t),
    s = r ? ";" : ":",
    a = process.env.PATH + s + _d.Uri.joinPath(t, o).fsPath,
    l = { ...process.env, ...n, PATH: a, RUST_LOG: "warn", CODEX_INTERNAL_ORIGINATOR_OVERRIDE: JA },
    c = qWt();
  c != null && ((process.env.CODEX_HOME = c), (l.CODEX_HOME = c));
  let u = (0, SL.spawn)(i, e, { stdio: ["pipe", "pipe", "pipe"], env: l });
  if (u.pid == null)
    throw new Rv(`Failed to spawn codex mcp process at ${i}`, { signal: null, exitCode: null });
  return u;
}
function qWt() {
  if (!GWt()) return;
  let t = process.env.SHELL;
  if (t == null || t.length === 0 || WWt(t)) return;
  let e = ["printf '\\n%s\\n%s\\n%s\\n'", RHe(CHe), '"${CODEX_HOME:-$HOME/.codex}"', RHe(THe)].join(
      " ",
    ),
    r = (0, SL.spawnSync)(t, ["-l", "-i", "-c", e], {
      encoding: "utf8",
      env: process.env,
      timeout: UWt,
    });
  if (!(r.error != null || r.status !== 0)) return HWt(r.stdout);
}
function GWt() {
  return (process.env.CODEX_HOME ?? "").length > 0
    ? !1
    : _d.env.remoteName != null && _d.env.remoteName !== "wsl";
}
function WWt(t) {
  return [
    "csh",
    "tcsh",
    "fish",
    "nu",
    "xonsh",
    "pwsh",
    "powershell",
    "cmd",
    "cmd.exe",
    "powershell.exe",
    "pwsh.exe",
  ].includes((0, EHe.basename)(t));
}
function HWt(t) {
  let e = t.split(/\r?\n/),
    r = e.lastIndexOf(CHe);
  if (r === -1) return;
  let n = e[r + 1],
    o = e[r + 2];
  if (!(n == null || n.length === 0 || o !== THe)) return n;
}
function RHe(t) {
  return `'${t.replace(/'/g, "'\\''")}'`;
}
function T9(t) {
  let e = void 0;
  if (e) return e;
  let r = Wn("cliExecutable");
  if (r && r.trim().length > 0) return r;
  let n = C9(),
    o = process.platform === "win32" ? "codex.exe" : "codex";
  return _d.Uri.joinPath(t, `${n}/${o}`).fsPath;
}
function jWt() {
  let t = _d.workspace.getConfiguration("http"),
    e = t.get("proxy"),
    r = t.get("proxyStrictSSL"),
    n = {};
  return (
    e && e.trim().length > 0 && ((n.HTTP_PROXY = e), (n.HTTPS_PROXY = e)),
    r === !1 && (n.NODE_TLS_REJECT_UNAUTHORIZED = "0"),
    n
  );
}
var IHe = "1",
  kHe = 10 * 6e4,
  wL = class {
    constructor(e, r, n) {
      this.extensionUri = e;
      this.userAgentProvider = r;
      this.stdoutParserMaxBufferedLineBytes = n;
      ((this.requestUserInputAutoResolutionCoordinator = new px({
        timing: { type: "fixed" },
        declineMcpElicitation: (o) => {
          this.sendResponse(o, { action: "decline", content: null, _meta: null });
        },
        onStateChanged: (o) => {
          for (let i of this.providers.values()) i.onRequestUserInputAutoResolutionChanged?.(o);
        },
        submitEmptyResponse: (o) => {
          this.sendResponse(o, { answers: {} });
        },
      })),
        (this.incomingLineProcessor = new G_({
          logger: this.logger,
          decodePayload: VWt,
          onQueueOverflow: (o, i) => {
            (this.logger.warning("incoming_line_queue_overflow", {
              safe: { queueDepth: o, overflowThreshold: i },
              sensitive: {},
            }),
              this.broadcastFatalError(this.createProcessError("Incoming line queue overflow")),
              this.teardownProcess());
          },
          onMessage: (o) => this.handleIncomingMessage(o),
        })));
    }
    logger = Dt("CodexMcpConnection");
    providers = new Map();
    pendingRequests = new Map();
    requestUserInputAutoResolutionCoordinator;
    initialized = !1;
    pendingNotifications = [];
    internalNotificationHandlers = new Set();
    ephemeralThreadTimeouts = new Map();
    pendingPrewarmedThreadStartRequestIds = new Set();
    pendingTurnStartRequestIds = new Set();
    turnCwds = new kx(!0);
    prewarmedThreads = new ax({
      ttlMs: kHe,
      publishThreadStarted: (e) => {
        let r = { method: "thread/started", params: { thread: e } };
        for (let [, n] of this.providers) n.onNotification?.(r);
      },
      releaseExpiredThread: (e) => {
        this.sendRequest("prewarmed-thread", `thread/unsubscribe:${e}`, "thread/unsubscribe", {
          threadId: e,
        });
      },
    });
    proc = null;
    incomingLineProcessor;
    stdoutMessageReader = null;
    stdoutReaderFinished = !1;
    processExit = null;
    mostRecentErrorMessage = null;
    fatalError = null;
    lastOutboundMethod = null;
    processExecutableBasename = null;
    startCodexProcess() {
      ((this.fatalError = null),
        this.proc &&
          this.isProcessAlive(this.proc) &&
          (this.logger.info("Tearing down existing codex MCP process"), this.teardownProcess()));
      let e;
      try {
        if (
          (this.logger.info("Spawning codex app-server"),
          (e = PHe(this.extensionUri, [
            "-c",
            "features.code_mode_host=true",
            "-c",
            "features.windows_sandbox_service=true",
            "app-server",
            "--analytics-default-enabled",
          ])),
          e.pid == null)
        )
          return (
            this.broadcastFatalError(this.createProcessError("Failed to start Codex process")),
            { success: !1, errorMessage: "Failed to spawn Codex process" }
          );
      } catch (r) {
        if (r instanceof Rv)
          return (this.broadcastFatalError(r), { success: !1, errorMessage: r.message });
        let n = r instanceof Error ? r.message : String(r);
        return (
          this.broadcastFatalError(this.createProcessError(`Failed to start Codex process: ${n}`)),
          { success: !1, errorMessage: n }
        );
      }
      ((this.proc = e),
        (this.initialized = !1),
        (this.lastOutboundMethod = null),
        (this.processExecutableBasename =
          typeof e.spawnfile == "string" && e.spawnfile.length > 0
            ? (0, DHe.basename)(e.spawnfile)
            : null),
        this.resetIncomingLineState(),
        (this.stdoutReaderFinished = !1),
        (this.processExit = null),
        (this.stdoutMessageReader = new Ix({
          maxBufferedLineBytes: this.stdoutParserMaxBufferedLineBytes,
          onError: (r, n) => {
            this.logger.error("Failed to parse app-server stdout JSONL message", {
              safe: { lineBytes: n },
              sensitive: { error: r },
            });
          },
          onMessage: (r, n) => {
            this.incomingLineProcessor.handleParsedMessage(r, n);
          },
          onFinish: () => {
            (this.flushPendingIncomingLines(),
              (this.stdoutReaderFinished = !0),
              this.finishProcessExitIfReady());
          },
          onStreamError: (r) => {
            (this.logger.error("App-server stdout stream failed", {
              safe: {},
              sensitive: { error: r },
            }),
              (this.stdoutReaderFinished = !0),
              this.finishProcessExitIfReady());
          },
        })),
        e.on("error", (r) => {
          this.logger.error("Codex process error", { safe: { error: r }, sensitive: {} });
        }),
        e.stdin.on("error", (r) => {
          this.logger.warning("App-server stdin stream failed", {
            safe: {},
            sensitive: { error: r },
          });
        }),
        e.on("exit", (r, n) => {
          ((this.processExit = { code: r, signal: n }), this.finishProcessExitIfReady());
        }),
        e.stderr &&
          e.stderr.on("data", (r) => {
            let n = KWt(r.toString().trim());
            if (n) {
              let { level: o, message: i } = ZWt(n);
              switch ((this.logger.log(o, "cli:", { safe: { message: i }, sensitive: {} }), o)) {
                case "warning":
                case "error":
                  this.mostRecentErrorMessage = i;
                  break;
                case "trace":
                case "debug":
                case "info":
                  break;
              }
            }
          }),
        this.stdoutMessageReader.attach(e.stdout));
      {
        let r = {
          id: IHe,
          method: "initialize",
          params: {
            clientInfo: { name: df(), title: "Codex Extension", version: Ic().version },
            capabilities: {
              experimentalApi: !0,
              extensions: { [Fz]: { form: {} } },
              mcpServerOpenaiFormElicitation: !0,
              requestAttestation: !1,
            },
          },
        };
        (this.recordLastOutboundMethod(r.method),
          e.stdin.destroyed
            ? this.broadcastFatalError(
                this.createProcessError(
                  `Attempted to send app-server initialize request but stdin is destroyed: ${JSON.stringify(r)}`,
                ),
              )
            : e.stdin.write(
                JSON.stringify(r) +
                  `
`,
              ));
      }
      return { success: !0 };
    }
    teardownProcess() {
      (this.failPendingRequests(),
        this.requestUserInputAutoResolutionCoordinator.clearPendingRequests(),
        this.proc &&
          (this.proc.removeAllListeners(),
          !this.proc.killed && this.proc.exitCode == null && this.proc.kill(),
          (this.proc = null)),
        this.resetIncomingLineState(),
        (this.initialized = !1),
        (this.lastOutboundMethod = null),
        (this.processExecutableBasename = null),
        this.internalNotificationHandlers.clear());
      for (let [, e] of this.ephemeralThreadTimeouts) clearTimeout(e);
      (this.ephemeralThreadTimeouts.clear(),
        this.pendingPrewarmedThreadStartRequestIds.clear(),
        this.pendingTurnStartRequestIds.clear(),
        this.prewarmedThreads.clear(),
        this.turnCwds.clear());
    }
    failPendingRequests() {
      for (let [e, r] of this.pendingRequests)
        (this.pendingRequests.delete(e),
          this.providers
            .get(r.providerName)
            ?.onRequestDelivery?.({
              type: "failed",
              delivery: { requestId: r.requestId, method: r.method, stage: "outcome-unknown" },
              message: "Codex app-server connection closed before responding",
            }));
    }
    isProcessAlive(e) {
      return e.killed || e.exitCode != null || e.signalCode != null ? !1 : !e.stdin.destroyed;
    }
    registerProvider(e, r) {
      if (this.providers.has(e)) throw new Error(`Provider already registered: ${e}`);
      return (
        this.providers.set(e, r),
        this.initialized && r.onInitialized?.(this.getAppServerVersion()),
        this.fatalError && r.onFatalError?.(this.fatalError, this.mostRecentErrorMessage),
        new P9.Disposable(() => {
          this.providers.delete(e);
          for (let [n, o] of this.pendingRequests)
            o.providerName === e && this.pendingRequests.delete(n);
        })
      );
    }
    registerInternalNotificationHandler(e) {
      return (
        this.internalNotificationHandlers.add(e),
        new P9.Disposable(() => {
          this.internalNotificationHandlers.delete(e);
        })
      );
    }
    takeCompletedTurnCwds(e) {
      return this.turnCwds.takeCompleted(e);
    }
    markEphemeralThreadId(e) {
      let r = this.ephemeralThreadTimeouts.get(e);
      r && clearTimeout(r);
      let n = setTimeout(() => {
        this.ephemeralThreadTimeouts.delete(e);
      }, kHe);
      this.ephemeralThreadTimeouts.set(e, n);
    }
    getAppServerVersion() {
      if (!this.initialized) return null;
      let e = this.userAgentProvider.getUserAgent();
      return e == null ? null : lG(e);
    }
    sendRequest(e, r, n, o, i = !1) {
      this.sendProviderRequest(e, r, n, o, !1, i);
    }
    abandonRequest(e, r) {
      this.pendingRequests.delete(`${e}:${r}`);
    }
    prewarmThreadStart(e, r, n, o = !1) {
      this.sendProviderRequest(e, r, "thread/start", n, !0, o);
    }
    sendProviderRequest(e, r, n, o, i, s) {
      let a = `${e}:${r}`;
      (s &&
        Oz(n) &&
        this.providers.get(e)?.onRequestDelivery != null &&
        this.pendingRequests.set(a, { providerName: e, requestId: r, method: n }),
        i && this.pendingPrewarmedThreadStartRequestIds.add(a));
      let l = { id: a, method: n, params: o };
      this.recordLastOutboundMethod(n);
      let c = (p) => {
        if (!this.pendingRequests.has(a)) return;
        let m = this.providers.get(e);
        p === "not-sent"
          ? (this.pendingRequests.delete(a),
            this.pendingPrewarmedThreadStartRequestIds.delete(a),
            m?.onRequestDelivery?.({
              type: "failed",
              delivery: { requestId: r, method: n, stage: p },
              message: "Codex app-server is not available",
            }))
          : m?.onRequestDelivery?.({
              type: "outcome-unknown",
              delivery: { requestId: r, method: n, stage: p },
            });
      };
      if (!this.sendMessage(l, this.pendingRequests.has(a) ? c : void 0) || n !== "turn/start")
        return;
      (this.pendingTurnStartRequestIds.add(a), this.turnCwds.track(o, a));
      let u = ym(o);
      u != null && this.prewarmedThreads.publishThreadStarted(u);
    }
    sendNotification(e, r) {
      let n = { method: e, params: r };
      (this.recordLastOutboundMethod(e), this.sendMessage(n));
    }
    sendResponse(e, r) {
      (this.turnCwds.observeClientResponse({ id: e, result: r }),
        this.requestUserInputAutoResolutionCoordinator.stopTrackingRequest(e));
      let n = { id: e, result: r };
      this.sendMessage(n);
    }
    snoozeRequestUserInputAutoResolution(e, r) {
      this.requestUserInputAutoResolutionCoordinator.snoozeRequest(e, r);
    }
    getRequestUserInputAutoResolutionSnapshot() {
      return this.requestUserInputAutoResolutionCoordinator.getPendingRequestSnapshots();
    }
    sendMessage(e, r) {
      if (!this.proc || !this.isProcessAlive(this.proc))
        return (
          r?.("not-sent"),
          this.logger.warning("Attempted to send app-server message but stdin is destroyed", {
            safe: {},
            sensitive: { message: e },
          }),
          this.broadcastFatalError(this.createProcessError("Codex process is not available")),
          !1
        );
      let n;
      try {
        n =
          JSON.stringify(q4(e)) +
          `
`;
      } catch (o) {
        if (r == null) throw o;
        return (r("not-sent"), !1);
      }
      if (r == null) return (this.proc.stdin.write(n), !0);
      try {
        this.proc.stdin.write(n, (o) => {
          o != null && r("outcome-unknown");
        });
      } catch {
        r("outcome-unknown");
      }
      return !0;
    }
    finishProcessExitIfReady() {
      let e = this.processExit;
      if (!(e == null || !this.stdoutReaderFinished)) {
        if ((this.flushPendingIncomingLines(), this.failPendingRequests(), e.code !== 0)) {
          let r = XWt(e.code, e.signal, this.mostRecentErrorMessage);
          this.broadcastFatalError(
            this.createProcessError(r, { exitCode: e.code, signal: e.signal }),
          );
        } else this.logger.info("Codex app-server process exited successfully.");
        this.teardownProcess();
      }
    }
    flushPendingIncomingLines() {
      this.incomingLineProcessor.flush();
    }
    resetIncomingLineState() {
      (this.stdoutMessageReader?.dispose(),
        (this.stdoutMessageReader = null),
        this.incomingLineProcessor.reset());
    }
    handleIncomingMessage(e) {
      if (!this.initialized) {
        if (
          (this.logger.info("Initialize received", { safe: { id: String(e.id) }, sensitive: {} }),
          "id" in e && ("result" in e || "error" in e) && e.id === IHe)
        ) {
          if ("error" in e && e.error) {
            let r = this.createProcessError(
              `Failed to initialize local agent: ${JSON.stringify(e.error)}`,
            );
            this.broadcastFatalError(r);
          } else {
            let r = e.result;
            (this.userAgentProvider.setUserAgent(r.userAgent ?? JA), (this.initialized = !0));
            for (let n of this.providers.values()) n.onInitialized?.(this.getAppServerVersion());
            this.flushPendingNotifications();
          }
          return { routeKind: "initialize_response", method: null };
        }
        return (
          this.bufferMessageBeforeInitialization(e),
          { routeKind: "before_initialize", method: typeof e.method == "string" ? e.method : null }
        );
      }
      return this.routeIncomingMessage(e);
    }
    routeIncomingMessage(e, r = e) {
      if (!this.isMcpResponseMessage(e) && yD(e)) return this.routeIncomingMessage(gm(e), r);
      if (this.isMcpResponseMessage(e)) {
        let n = e.id;
        if (typeof n == "string" && n.includes(":")) {
          let [o, ...i] = n.split(":"),
            s = i.join(":");
          if (
            (this.pendingRequests.delete(n),
            this.pendingTurnStartRequestIds.delete(n) &&
              this.turnCwds.observeResponse(n, "turn/start", e),
            this.pendingPrewarmedThreadStartRequestIds.delete(n))
          ) {
            let l = bD(e);
            l != null && this.prewarmedThreads.trackThread(l);
          }
          let a = this.providers.get(o);
          if (a?.onResult) {
            let l = { ...e, id: s };
            a.onResult(l);
          }
          return { routeKind: "response", method: null };
        }
        return (
          this.logger.warning("Received MCP response with id but no provider namespace", {
            safe: { id: JSON.stringify(n) },
            sensitive: {},
          }),
          { routeKind: "response_unroutable", method: null }
        );
      }
      if (this.isMcpRequestMessage(e)) {
        (this.turnCwds.observeServerRequest(e),
          this.requestUserInputAutoResolutionCoordinator.observeServerRequest(e));
        for (let [, n] of this.providers) n.onRequest?.(e);
        return { routeKind: "request", method: e.method };
      }
      if (this.isMcpNotificationMessage(e)) {
        let { method: n, params: o } = e;
        (this.requestUserInputAutoResolutionCoordinator.observeServerNotification(e),
          n === "item/started" && this.turnCwds.observeCommandStarted(o));
        let i = vD(o),
          s = ym(o);
        if (
          (n === "thread/deleted" &&
            s != null &&
            (this.turnCwds.delete(s), this.prewarmedThreads.stopTrackingThread(s)),
          n === "thread/started" && s != null && this.prewarmedThreads.suppressThreadStarted(s))
        )
          return { routeKind: "notification_dropped_prewarmed_thread_started", method: n };
        for (let a of this.internalNotificationHandlers)
          try {
            a({ method: n, params: o });
          } catch (l) {
            this.logger.warning("Internal MCP notification handler failed", {
              safe: { error: String(l) },
              sensitive: {},
            });
          }
        if (n === "thread/started" && i != null && zWt(i))
          return (
            this.markEphemeralThreadId(i.id),
            { routeKind: "notification_ephemeral_thread_started", method: n }
          );
        if (s && this.ephemeralThreadTimeouts.has(s))
          return { routeKind: "notification_dropped_ephemeral", method: n };
        for (let [, a] of this.providers)
          a.onRawNotification != null && this.isMcpNotificationMessage(r)
            ? a.onRawNotification(r)
            : a.onNotification?.({ method: n, params: o });
        return { routeKind: "notification", method: n };
      }
      return (
        this.logger.error("Received unknown MCP message", { safe: {}, sensitive: { message: e } }),
        { routeKind: "unknown", method: null }
      );
    }
    isMcpResponseMessage(e) {
      return "id" in e && ("result" in e || "error" in e);
    }
    isMcpRequestMessage(e) {
      return typeof e.method == "string" && "id" in e && e.id != null;
    }
    isMcpNotificationMessage(e) {
      return "method" in e && typeof e.method == "string" && !("id" in e);
    }
    bufferMessageBeforeInitialization(e) {
      if (this.isMcpResponseMessage(e) || this.isMcpRequestMessage(e)) {
        this.logger.warning("Dropping MCP message received before initialization");
        return;
      }
      if (!this.isMcpNotificationMessage(e)) {
        this.logger.warning("Dropping MCP message received before initialization");
        return;
      }
      (this.pendingNotifications.push(e),
        this.logger.info("Queued MCP notification before initialization", {
          safe: { method: e.method },
          sensitive: {},
        }));
    }
    flushPendingNotifications() {
      if (this.pendingNotifications.length === 0) return;
      let e = this.pendingNotifications;
      this.pendingNotifications = [];
      for (let r of e) {
        let n = gm(r);
        for (let s of this.internalNotificationHandlers)
          try {
            s(n);
          } catch (a) {
            this.logger.warning("Internal MCP notification handler failed", {
              safe: { error: a },
              sensitive: {},
            });
          }
        let o = n.params,
          i =
            typeof o?.thread?.id == "string"
              ? o.thread.id
              : typeof o?.threadId == "string"
                ? o.threadId
                : null;
        if (!(i && this.ephemeralThreadTimeouts.has(i)))
          for (let [, s] of this.providers)
            s.onRawNotification != null ? s.onRawNotification(r) : s.onNotification?.(n);
      }
    }
    broadcastFatalError(e) {
      (this.logger.error("Codex process fatal error", {
        safe: { errorMessage: e.message, signal: e.signal, exitCode: e.exitCode },
        sensitive: {},
      }),
        (this.fatalError = e));
      for (let [, r] of this.providers) r.onFatalError?.(e, this.mostRecentErrorMessage);
    }
    createProcessError(e, { exitCode: r, signal: n } = {}) {
      return new Rv(
        e,
        { exitCode: r ?? null, signal: n ?? null },
        { appServerCrashContext: this.getCrashContext() },
      );
    }
    getCrashContext() {
      return {
        executableBasename: this.processExecutableBasename,
        lastOutboundMethod: this.lastOutboundMethod,
        phase: this.initialized ? "post_initialize" : "pre_initialize",
        processExitedAtMs: Date.now(),
        processId: this.proc?.pid ?? null,
      };
    }
    recordLastOutboundMethod(e) {
      this.lastOutboundMethod = e;
    }
    dispose() {
      (this.teardownProcess(), this.requestUserInputAutoResolutionCoordinator.dispose());
    }
  };
function zWt(t) {
  return t == null || typeof t != "object" ? !1 : "ephemeral" in t && t.ephemeral === !0;
}
function VWt(t) {
  return typeof t != "string" ? [] : [t];
}
function KWt(t) {
  return t.replace(/\x1b\[[0-9;]*m/g, "");
}
function ZWt(t) {
  let e = t.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z\s+(\w+)\s+(.+)$/);
  if (e) {
    let r = e[1].toLowerCase(),
      n = e[2];
    switch (r) {
      case "trace":
      case "debug":
      case "info":
      case "error":
        return { level: r, message: n };
      case "warn":
      case "warning":
        return { level: "warning", message: n };
      default:
        return { level: "error", message: n };
    }
  }
  return { level: "error", message: t };
}
function XWt(t, e, r) {
  let o = `Codex app-server process exited unexpectedly (code=${t == null ? "unknown" : process.platform === "win32" ? YWt(t) : String(t)}, signal=${e})`;
  return r ? `${o}. Last CLI error: ${r}` : o;
}
function YWt(t) {
  let e = t < 0 ? 4294967296 + t : t;
  return `${t} (0x${e.toString(16)})`;
}
var I2 = require("fs"),
  g4e = F(require("path"));
ot();
ul();
O();
SD();
Pt();
ot();
var MHe = F(Is());
function OHe(t, e) {
  let r = [...t];
  for (let n of e.removed) {
    let o = r.findIndex((i) => (0, MHe.default)(i, n));
    if (o !== -1) r.splice(o, 1);
    else if (e.added.length > 0) return t;
  }
  for (let { comment: n, index: o } of e.added) r.splice(o, 0, n);
  return r;
}
var _L = class extends ee {
    revision = 0;
    comments = new Map();
    listeners = new Map();
    edit(e, r) {
      let n = OHe(this.comments.get(e) ?? [], r);
      n.length === 0 ? this.comments.delete(e) : this.comments.set(e, n);
      let o = { comments: n, revision: ++this.revision, editId: r.id };
      for (let c of this.listeners.get(e) ?? []) {
        var i = [];
        try {
          let u = cn(i, c(o));
        } catch (s) {
          var a = s,
            l = !0;
        } finally {
          un(i, a, l);
        }
      }
      return o;
    }
    transfer(e, r) {
      let n = this.comments.get(e);
      return e === r || n == null
        ? []
        : [
            {
              conversationId: r,
              snapshot: this.edit(r, {
                id: crypto.randomUUID(),
                removed: this.comments.get(r) ?? [],
                added: n.map((o, i) => ({ comment: o, index: i })),
              }),
            },
            {
              conversationId: e,
              snapshot: this.edit(e, { id: crypto.randomUUID(), removed: n, added: [] }),
            },
          ];
    }
    removeReviewThread(e, r) {
      let n = [];
      for (let [o, i] of this.comments) {
        let s = i.filter(
          (a) => a.reviewThreadId === e && (r == null || a.localPullRequestReviewKey === r),
        );
        s.length > 0 &&
          n.push({
            conversationId: o,
            snapshot: this.edit(o, { id: crypto.randomUUID(), removed: s, added: [] }),
          });
      }
      return n;
    }
    subscribe(e, r) {
      var a = [];
      try {
        let n = r.dup();
        let o = this.listeners.get(e);
        o == null && ((o = new Set()), this.listeners.set(e, o));
        o.add(n);
        let i = new I9(() => {
          let p = this.listeners.get(e);
          p?.delete(n) && (n[Symbol.dispose](), p.size === 0 && this.listeners.delete(e));
        });
        n.onRpcBroken(() => i.unsubscribe());
        let s = cn(
          a,
          n({ comments: this.comments.get(e) ?? [], revision: this.revision, editId: null }),
        );
        return i;
      } catch (l) {
        var c = l,
          u = !0;
      } finally {
        un(a, c, u);
      }
    }
    hasPendingLocalGitReviewComments = () => {
      for (let e of this.comments.values())
        if (e.some((r) => r.localGitReviewDraft === !0)) return !0;
      return !1;
    };
    dispose = () => {
      for (let e of this.listeners.values()) for (let r of e) r[Symbol.dispose]();
      (this.listeners.clear(), this.comments.clear());
    };
  },
  I9 = class extends ee {
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
ot();
var xL = class extends ee {
    pending;
    nextId = 0;
    listeners = new Set();
    publish(e) {
      ((this.pending = { id: ++this.nextId, prefill: e }), this.notify());
    }
    acknowledge(e) {
      this.pending?.id === e && ((this.pending = void 0), this.notify());
    }
    subscribe(e) {
      var i = [];
      try {
        let r = e.dup();
        this.listeners.add(r);
        let n = new k9(() => {
          this.listeners.delete(r) && r[Symbol.dispose]();
        });
        r.onRpcBroken(() => n.unsubscribe());
        let o = cn(i, r(this.pending));
        return n;
      } catch (s) {
        var a = s,
          l = !0;
      } finally {
        un(i, a, l);
      }
    }
    takeChatPrefill = () => {
      let e = this.pending;
      if (e?.prefill.chatGptSystemHints != null) return (this.acknowledge(e.id), e.prefill);
    };
    dispose = () => {
      for (let e of this.listeners) e[Symbol.dispose]();
      (this.listeners.clear(), (this.pending = void 0));
    };
    notify() {
      for (let i of this.listeners) {
        var e = [];
        try {
          let s = cn(e, i(this.pending));
        } catch (r) {
          var n = r,
            o = !0;
        } finally {
          un(e, n, o);
        }
      }
    }
  },
  k9 = class extends ee {
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
ot();
m3();
var AL = class extends ee {
  getForEmailDomain(e) {
    return rOe(e);
  }
};
ot();
O();
$();
var D9 = d.array(d.string()),
  RL = class extends ee {
    constructor(r, n) {
      super();
      this.readValue = r;
      this.writePinnedProjects = n;
    }
    async readAppearances() {
      let r = await this.readValue(J.PROJECT_APPEARANCES);
      return r == null ? void 0 : $me(r);
    }
    async readOrder() {
      let r = await this.readValue(J.PROJECT_ORDER);
      return D9.safeParse(r).data;
    }
    async readPinnedProjects() {
      let r = await this.readValue(J.PINNED_PROJECT_IDS);
      return D9.safeParse(r).data;
    }
    async setPinnedProjects(r) {
      await this.writePinnedProjects(D9.optional().parse(r));
    }
  };
ot();
Zh();
Ti();
function JWt(t) {
  let e = t.position.line,
    r = t.position.side;
  return {
    startLine: t.position.start_line ?? e,
    startSide: t.position.start_side ?? r,
    endLine: e,
    endSide: r,
  };
}
function QWt(t) {
  let { startLine: e, startSide: r, endLine: n, endSide: o } = JWt(t);
  if (r !== o) return `${NHe(r, e)}-${NHe(o, n)}`;
  let i = Math.min(e, n),
    s = Math.max(e, n);
  return i === s ? String(s) : `${i}-${s}`;
}
function eHt(t) {
  return t.content.map((e) => (e.content_type === "text" ? e.text : "")).join("");
}
function NHe(t, e) {
  return `${t === "left" ? "L" : "R"}${e}`;
}
function M9(t) {
  if (t.localPullRequestDiscussionUrl != null) return t.localPullRequestDiscussionUrl;
  let e = t.position,
    r = eHt(t),
    o = `${t.localWorkspaceRoot == null ? "" : `${yI(t.localWorkspaceRoot)}|`}${e.path}|${e.side}|${QWt(t)}|${r}`;
  return t.localPullRequestReviewKey == null ? o : `${t.localPullRequestReviewKey}|${o}`;
}
