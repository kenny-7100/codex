var HB = class {
  constructor(e) {
    this.socketPath = e;
  }
  server = null;
  transports = new Set();
  async listen(e) {
    if (this.server) throw new Error("UnixDomainSocketServer is already listening.");
    (await this.removeExistingSocket(),
      (this.server = VKe.default.createServer((r) => {
        let n = new WB(r);
        (this.transports.add(n),
          r.once("close", () => {
            this.transports.delete(n);
          }),
          Promise.resolve(e(n)).catch((o) => {
            let i = o instanceof Error ? o : new Error(String(o));
            (n.onerror(i), n.close());
          }));
      })),
      this.server.on("error", (r) => {
        let n = r instanceof Error ? r : new Error(String(r));
        he().error("UnixDomainSocketServer error", { safe: { error: n.message }, sensitive: {} });
      }),
      this.server.listen(this.socketPath),
      this.server.listening || (await (0, zKe.once)(this.server, "listening")));
  }
  async close() {
    let e = this.server;
    this.server = null;
    let r = [...this.transports].map((n) => n.close().catch(() => {}));
    (this.transports.clear(),
      await Promise.all(r),
      e?.listening && (await new Promise((n) => e.close(() => n()))),
      await this.removeExistingSocket());
  }
  async removeExistingSocket() {
    try {
      if ((await bJ.promises.lstat(this.socketPath)).isSocket())
        await bJ.promises.unlink(this.socketPath);
      else throw new Error(`Cannot reuse ${this.socketPath}: existing path is not a socket.`);
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }
  }
};
var KKe = "codex-lsp-mcp";
async function XKe(t, e) {
  let r = dE.join(ZKe.tmpdir(), "lsp-mcp-"),
    n = await jB.mkdtemp(r),
    o = dE.join(n, "lsp-mcp.sock"),
    i = T9(e),
    s = new SJ(t, o, i);
  return (await s.initUnixDomainSocketServer(o), s);
}
var SJ = class {
  constructor(e, r, n) {
    this.version = e;
    this.socketPath = r;
    this.codexExecutable = n;
  }
  getCodexConfig() {
    return { [`mcp_servers.${KKe}`]: this.getServerCommand() };
  }
  getServerCommand() {
    return { command: this.codexExecutable, args: ["stdio-to-uds", this.socketPath] };
  }
  getCopyPasteableCodexCLICommand() {
    let { command: e, args: r } = this.getServerCommand(),
      n = [
        this.codexExecutable,
        "--config",
        `mcp_servers.${KKe}={command = ${YKe(e)}, args = ${dZt(r)}}`,
      ];
    return ai(n);
  }
  async initUnixDomainSocketServer(e) {
    (await new HB(e).listen(async (n) => {
      let o = uZt(this.version);
      n.addDisposable({ dispose: () => o.close() });
      try {
        await o.connect(n);
      } catch (i) {
        throw (
          he().error("MCP LSP server failed to connect", { safe: { error: i }, sensitive: {} }),
          await n.close().catch(() => {}),
          i
        );
      }
    }),
      he().info("MCP LSP server listening on", { safe: { socketPath: e }, sensitive: {} }));
  }
  dispose() {
    let e = dE.dirname(this.socketPath);
    jB.rm(e, { recursive: !0, force: !0 }).catch((r) => {
      he().error("Failed to remove MCP LSP socket directory", { safe: r, sensitive: {} });
    });
  }
};
function uZt(t) {
  let e = new GB({ name: "vscode-codex-lsp-mcp-server", version: t });
  return (DKe(e), FKe(e), GKe(e), e);
}
function YKe(t) {
  return JSON.stringify(t);
}
function dZt(t) {
  return `[${t.map((e) => YKe(e)).join(", ")}]`;
}
var wJ = F(require("vscode")),
  zB = class {
    shellIntegrationSubscription;
    pendingTerminals = new Map();
    constructor() {
      this.shellIntegrationSubscription = wJ.window.onDidChangeTerminalShellIntegration((e) => {
        let { terminal: r } = e,
          n = this.pendingTerminals.get(r);
        n && (n(r), this.pendingTerminals.delete(r));
      });
    }
    createTerminal(e) {
      let r = wJ.window.createTerminal(e);
      return new Promise((n) => {
        (this.pendingTerminals.set(r, n),
          r.shellIntegration && (this.pendingTerminals.delete(r), n(r)));
      });
    }
    dispose() {
      this.shellIntegrationSubscription.dispose();
    }
  };
var _b = F(require("vscode"));
var pZt = /^TODO\b[:-]?\s*/i;
function QKe(t) {
  let e = [],
    r = t.length,
    n = 0;
  function o(a, l) {
    let c = t[a],
      u = l;
    for (; u < r && t[u] === c; ) u++;
    let p = u;
    for (
      ;
      p < r &&
      t[p] !==
        `
` &&
      t[p] !== "\r";

    )
      p++;
    let m = JKe(t.slice(u, p));
    return (m != null && e.push({ body: m, index: a }), p);
  }
  let i = null,
    s = !1;
  for (; n < r; ) {
    let a = t[n];
    if (i) {
      (s ? (s = !1) : a === "\\" ? (s = !0) : a === i && (i = null), n++);
      continue;
    } else if (a === '"' || a === "'" || a === "`") {
      ((i = a), n++);
      continue;
    }
    if (a === "/" && n + 1 < r) {
      let l = t[n + 1];
      if (l === "/") {
        n = o(n, n + 2);
        continue;
      }
      if (l === "*") {
        let c = n,
          u = n + 2,
          p = t.indexOf("*/", u),
          m = p === -1 ? r : p + 2,
          f = mZt(t.slice(u, p === -1 ? r : p)),
          h = JKe(f);
        (h != null && e.push({ body: h, index: c }), (n = m));
        continue;
      }
    } else if (a === "#") {
      n = o(n, n + 1);
      continue;
    } else if (a === "-" && n + 1 < r && t[n + 1] === "-") {
      n = o(n, n + 2);
      continue;
    }
    n++;
  }
  return e;
}
function JKe(t) {
  let e = t.trimStart(),
    r = pZt.exec(e);
  return r ? e.slice(r[0].length).trimEnd() : null;
}
function mZt(t) {
  let r = t.replace(/^(?:[ \t]*\*?[ \t]*(?:\r?\n|$))+/, "").trimStart();
  return (r.startsWith("*") && (r = r.slice(1).trimStart()), r);
}
var VB = class {
  provideCodeLenses(e, r) {
    let n = e.getText(),
      o = [],
      i = _b.workspace.getWorkspaceFolder(e.uri)?.uri.fsPath ?? null;
    for (let { index: s, body: a } of QKe(n)) {
      if (r?.isCancellationRequested) break;
      let l = e.positionAt(s),
        c = new _b.Range(l, l);
      o.push(
        new _b.CodeLens(c, {
          title: "Implement with Jimao",
          command: "chatgpt.implementTodo",
          arguments: [{ fileName: e.uri.fsPath, cwd: i, line: l.line + 1, comment: a }],
        }),
      );
    }
    return o;
  }
};
Pt();
xo();
var KB = class {
  constructor(e, r) {
    this.codexWebviewProvider = e;
    this.ideAppEntryLifecycle = r;
  }
  async handleUri(e) {
    he().info("Handling URI", { safe: { path: e.path }, sensitive: {} });
    try {
      let r = e.path || "/";
      if (/^\/connector\/oauth_callback(?:\/[A-Za-z0-9_-]{12})?$/u.test(r)) {
        await this.codexWebviewProvider.broadcastAppConnectOAuthCallback(e.toString(!0));
        return;
      }
      (this.ideAppEntryLifecycle.handleDeepLink(e.toString(!0)),
        await vi(),
        this.codexWebviewProvider.navigateToRoute(`${r}${e.query === "" ? "" : `?${e.query}`}`));
    } catch (r) {
      he().error("Failed to handle URI", {
        safe: { path: e.path, error: r instanceof Error ? r.message : String(r) },
        sensitive: {},
      });
    }
  }
};
var ZB = class {
  userAgent = null;
  getUserAgent() {
    return this.userAgent;
  }
  setUserAgent(e) {
    this.userAgent = e;
  }
};
var Dl = require("node:fs/promises"),
  YB = require("node:os"),
  qf = F(require("node:path"));
ot();
O();
Pt();
var Hn = F(require("vscode"));
var e5e = F(require("vscode"));
function _J(t) {
  return (t & e5e.FileType.File) !== 0;
}
var XB = class extends ee {
  constructor(r) {
    super();
    this.executionHost = r;
  }
  isDisposed = !1;
  temporaryFilePaths = new Set();
  async readBinary({ maxBytes: r, path: n }) {
    let o = await KN({ appServerClient: this.executionHost, url: n, maxBytes: r });
    if (o != null) return o;
    if (n.startsWith("https://")) return { contentsBase64: null };
    let i = await uf({
      raw: f9(n),
      readUri: async (a) =>
        r != null && (await Hn.workspace.fs.stat(a)).size > r ? null : Hn.workspace.fs.readFile(a),
    });
    if (i == null || (r != null && i.byteLength > r)) return { contentsBase64: null, tooLarge: !0 };
    let s = await WI(i);
    return { contentsBase64: Buffer.from(i).toString("base64"), mimeType: s };
  }
  async inspect({ contentSampleByteLimit: r, contentSampleMaxFileBytes: n, path: o }) {
    return uf({
      fileNotFoundValue: { createdAtMs: null, isFile: !1, mtimeMs: null, sizeBytes: null },
      raw: f9(o),
      readUri: async (i) => {
        let s = await Hn.workspace.fs.stat(i),
          a = _J(s.type),
          c =
            r != null && a && (n == null || s.size <= n)
              ? (await Hn.workspace.fs.readFile(i)).subarray(0, r)
              : null;
        return {
          contentKind: (await ZG(c)) ?? void 0,
          createdAtMs: s.ctime,
          isFile: a,
          mtimeMs: s.mtime,
          sizeBytes: s.size,
        };
      },
    });
  }
  async findExistingPaths({ paths: r }) {
    return { existingPaths: await M0(r, this.executionHost) };
  }
  async createTemporaryFile({ bytes: r, fileName: n }) {
    if (this.isDisposed) throw new Error("Workspace file service is disposed");
    if (HP(r.byteLength)) throw new Error("Temporary file is too large");
    let o = await (0, Dl.mkdtemp)(qf.join((0, YB.tmpdir)(), "codex-file-preview-")),
      i = qf.join(o, WP(n));
    try {
      if ((await (0, Dl.writeFile)(i, r, { flag: "wx", mode: 384 }), this.isDisposed))
        throw new Error("Workspace file service is disposed");
      return (this.temporaryFilePaths.add(i), { path: i });
    } catch (s) {
      throw (await (0, Dl.rm)(o, { force: !0, recursive: !0 }), s);
    }
  }
  dispose() {
    this.isDisposed = !0;
    let r = [...this.temporaryFilePaths];
    (this.temporaryFilePaths.clear(),
      Promise.allSettled(r.map((n) => (0, Dl.rm)(qf.dirname(n), { force: !0, recursive: !0 }))));
  }
  async getMetadata({ hostId: r, path: n, includeCanonicalPath: o }) {
    if (r !== this.executionHost.hostConfig.id)
      throw new Error("Workspace files are not supported for this host.");
    let {
      stats: i,
      canonicalPath: s,
      isSymlink: a,
    } = await uf({
      raw: n,
      readUri: async (l) => {
        let c = await Hn.workspace.fs.stat(l),
          u = (c.type & Hn.FileType.SymbolicLink) !== 0,
          p =
            l.scheme === "file" && (o === !0 || (o && u))
              ? await (0, Dl.realpath)(l.fsPath)
              : void 0;
        return { stats: c, canonicalPath: p, isSymlink: u };
      },
    });
    return i.type & Hn.FileType.Directory
      ? { kind: "directory", canonicalPath: s, isSymlink: a }
      : _J(i.type)
        ? { kind: "file", canonicalPath: s, isSymlink: a }
        : null;
  }
  async readText({ path: r }) {
    return { contents: await this.#t(r.replace(/^([ab])[\\/]/, "")) };
  }
  async read({ hostId: r, path: n, representation: o }) {
    if (r !== this.executionHost.hostConfig.id)
      throw new Error("Workspace files are not supported for this host.");
    switch (o) {
      case "auto": {
        let { bytes: i, uri: s } = await uf({
          raw: n,
          readUri: async (a) => ({ bytes: await Hn.workspace.fs.readFile(a), uri: a }),
        });
        return (await ZG(i.subarray(0, Ope))) === "text"
          ? { text: (await Hn.workspace.openTextDocument(s)).getText() }
          : { blob: Buffer.from(i).toString("base64") };
      }
      case "blob":
        return { blob: Buffer.from(await this.#e(n)).toString("base64") };
      case "text":
        return { text: await this.#t(n) };
    }
  }
  async releaseTemporaryFile({ path: r }) {
    this.temporaryFilePaths.delete(r) &&
      (await (0, Dl.rm)(qf.dirname(r), { force: !0, recursive: !0 }));
  }
  async saveCopy(r) {
    if (this.isDisposed) throw new Error("Workspace file service is disposed");
    if ("hostId" in r && r.hostId !== this.executionHost.hostConfig.id)
      throw new Error("Workspace files are not supported for this host.");
    let n = await Hn.window.showSaveDialog({
      defaultUri: Hn.Uri.file(
        qf.join((0, YB.homedir)(), WP("bytes" in r ? r.fileName : (r.fileName ?? r.path))),
      ),
    });
    if (n == null) return { path: null };
    let o = "bytes" in r ? r.bytes : await this.#e(r.path);
    if (HP(o.byteLength)) throw new Error("File is too large to save directly");
    return (await Hn.workspace.fs.writeFile(n, o), { path: n.fsPath });
  }
  #e(r) {
    return uf({ raw: r, readUri: async (n) => Hn.workspace.fs.readFile(n) });
  }
  #t(r) {
    return uf({ raw: r, readUri: async (n) => (await Hn.workspace.openTextDocument(n)).getText() });
  }
};
O();
var Wr = F(require("vscode"));
Sd();
var t5e = "chatgpt.continueOnWindows";
function r5e(t) {
  let e = Wr.Uri.joinPath(t.extensionUri, "resources", "wsl"),
    r = Wr.Uri.joinPath(t.extensionUri, "webview"),
    n = df() === "Cursor",
    o = async (i) => {
      i.options = {
        enableScripts: !0,
        localResourceRoots: [r, e],
        enableCommandUris: [t5e, ...(n ? ["extension.open"] : []), "workbench.action.openSettings"],
      };
      let s = i.asWebviewUri(Wr.Uri.joinPath(e, "wsl-pets.webp")),
        a =
          !n && Wr.workspace.workspaceFolders?.length
            ? "WSL: Reopen Folder in WSL"
            : "WSL: Connect to WSL";
      i.html = await R2(
        t.extensionUri,
        i,
        [
          `<meta name="initial-route" content="${Lne}">`,
          `<meta name="vscode-language" content="${ia(Wr.env.language)}">`,
          `<meta name="wsl-cursor" content="${n}">`,
          `<meta name="wsl-command" content="${a}">`,
          `<meta name="wsl-sprite" content="${ia(s.toString())}">`,
        ].join(`
`),
      );
    };
  (Wr.commands.executeCommand("setContext", mL, !xv(Wr.version)),
    t.subscriptions.push(
      Wr.commands.registerCommand(t5e, async () => {
        let i = Wr.workspace.getConfiguration("chatgpt"),
          s = "runCodexInWindowsSubsystemForLinux",
          a =
            i.inspect(s)?.workspaceValue === !0
              ? Wr.ConfigurationTarget.Workspace
              : Wr.ConfigurationTarget.Global;
        await i.update(s, !1, a);
      }),
      Wr.window.registerWebviewViewProvider(fL(Wr.version).viewId, {
        resolveWebviewView: (i) => o(i.webview),
      }),
      Wr.window.registerCustomEditorProvider("chatgpt.conversationEditor", {
        openCustomDocument: (i) => ({ uri: i, dispose() {} }),
        resolveCustomEditor: (i, s) => o(s.webview),
      }),
      Wr.window.registerUriHandler({ handleUri: vi }),
    ));
  for (let i of [
    "chatgpt.openSidebar",
    "chatgpt.newCodexPanel",
    "chatgpt.newChat",
    "chatgpt.openCommandMenu",
    "chatgpt.addFileToThread",
    "chatgpt.addToThread",
    "chatgpt.implementTodo",
    "chatgpt.showLspMcpCliArgs",
    "chatgpt.dumpNuxState",
    "chatgpt.resetNuxState",
  ])
    t.subscriptions.push(Wr.commands.registerCommand(i, vi));
  Wn("openOnStartup", !1) && vi();
}
var AZt = "chatgpt.newChat",
  RZt = "chatgpt.newCodexPanel",
  EZt = "chatgpt.showLspMcpCliArgs",
  CZt = "chatgpt.lspMcpEnabled",
  TZt = "sessionsViewPromotion",
  IJ;
async function PZt() {
  (await IJ?.(), (IJ = void 0));
}
async function IZt(t) {
  let { subscriptions: e } = t;
  if (
    (e.push(he()),
    he().info("Activating Codex extension"),
    process.platform === "win32" &&
      Et.env.remoteName == null &&
      (e.push(
        Et.workspace.onDidChangeConfiguration((oe) => {
          oe.affectsConfiguration("chatgpt.runCodexInWindowsSubsystemForLinux") &&
            Et.commands.executeCommand("workbench.action.reloadWindow");
        }),
      ),
      Wn("runCodexInWindowsSubsystemForLinux", !1)))
  ) {
    r5e(t);
    return;
  }
  let r = Vze(qv),
    n = (0, K5e.randomUUID)();
  qv.setTag("sessionId", n);
  let o = new zB();
  e.push(o);
  let i = Wn("useExperimentalLspMcpServer", !1);
  (Et.commands.executeCommand("setContext", mL, !xv(Et.version)),
    Et.commands.executeCommand("setContext", CZt, i));
  let s = null;
  i &&
    ((s = await XKe(y9(), t.extensionUri)),
    he().info("To run LSP", {
      safe: { command: s.getServerCommand().command, args: s.getServerCommand().args.join(" ") },
      sensitive: {},
    }),
    e.push(s));
  let a = async () => (s ? s.getCodexConfig() : null),
    l = new ZB(),
    c = new D2(t);
  e.push(c);
  let u = new q2(
      t.globalState,
      Et.Uri.joinPath(t.globalStorageUri, "queued-follow-ups.json").fsPath,
    ),
    p = !0,
    m = new lL(
      {
        read: () => u.readThreadProjectMemberships(),
        write: (oe, _t) => u.writeThreadProjectMemberships(oe, _t),
      },
      (oe) => {
        p && Ct.broadcastThreadProjectMemberships(oe);
      },
    ),
    f,
    h = () => ((p = !1), (f = f ?? m.flush().finally(() => u.dispose())), f);
  ((IJ = h), e.push({ dispose: () => void h() }));
  let v = new wL(t.extensionUri, l);
  e.push(v);
  let y = new aL(),
    w = v.startCodexProcess();
  !w.success && w.errorMessage && he().error(w.errorMessage);
  let _ = new k2(v);
  e.push(_);
  let S = kZt(v, c, _, u, e),
    E = hHe(v),
    T = new af("vscode", r),
    P = new ag(),
    M = new Ym(P),
    L = new nf();
  e.push(
    v.registerInternalNotificationHandler((oe) => {
      oe.method === "turn/completed" &&
        M.invalidateGitReadCachesForTurn(v.takeCompletedTurnCwds(oe.params), L.id);
    }),
  );
  let V = new H2();
  e.push(V);
  let de = new j2(T, V);
  e.push(de);
  let ue = new hL(),
    Ae = new dL(),
    ge = new $2(v, u, a, L, (t.storageUri ?? t.globalStorageUri).fsPath);
  ge.getUserSavedConfiguration().then(
    (oe) => y.resolve(oe),
    (oe) => y.reject(oe),
  );
  let Pe = new bL(E, ge, l),
    Q = new XB(L);
  e.push(Q);
  let G = Ic().version,
    ce = pL(),
    Ce = (oe) => {
      qv.captureException(new Error(`[datadog] log sink failure (${oe.type}: ${oe.reason})`));
    },
    De = new Bm({
      analyticsEnabled: y.get().then((oe) => oe.analytics?.enabled !== !1),
      reportFailure: Ce,
    }),
    Ge = new PM({
      source: "codex-extension",
      env: ce,
      codexAppSessionId: n,
      platform: process.platform,
      buildInfo: { version: G, buildNumber: null },
      reportFailure: Ce,
      transport: De,
    });
  aHe(Ge);
  let We,
    yt = await Et.commands.executeCommand(Ef.available).then(
      (oe) => oe,
      () => null,
    ),
    Ct = new Af(
      t.extensionUri,
      v,
      E,
      ue,
      Pe,
      Q,
      () => V.getIdeContext(),
      Ae,
      ge.threadMetadataGeneration,
      ge.gitMessageGeneration,
      ge.threadConfiguration,
      ge.settings,
      ge.globalStateService,
      ge.projectCatalog,
      ge.queuedSendLocksService,
      m,
      c,
      _,
      S ?? void 0,
      u,
      Ge,
      M,
      r,
      T,
      G,
      n,
      ce,
      (oe) => We.handleCodexViewVisibility(oe),
      L,
      yt === 1 ? new z2() : void 0,
      (t.storageUri ?? t.globalStorageUri).fsPath,
    );
  ((We = new G2((oe) => Ct.reportAppEntryReceipt(oe), Et.window.state.focused)),
    e.push(
      Et.window.onDidChangeWindowState((oe) => {
        if ((We.handleWindowFocus(oe.focused), !oe.focused)) {
          P.emit("background");
          return;
        }
        P.emit("foreground");
      }),
    ),
    e.push(Ct),
    e.push({
      dispose: Dj((oe) => {
        Ct.reportEphemeralGenerationTokenUsage(oe);
      }),
    }));
  let et = new KB(Ct, We);
  if (
    (e.push(Et.window.registerUriHandler(et)),
    e.push(
      Et.window.registerWebviewViewProvider(Af.viewType, Ct, {
        webviewOptions: { retainContextWhenHidden: !0 },
      }),
    ),
    xv(Et.version) &&
      e.push(
        Et.window.registerWebviewViewProvider(Af.secondaryViewType, Ct, {
          webviewOptions: { retainContextWhenHidden: !0 },
        }),
      ),
    e.push(
      Et.window.registerCustomEditorProvider(Af.customEditorViewType, Ct, {
        webviewOptions: { retainContextWhenHidden: !0 },
        supportsMultipleEditorsPerDocument: !1,
      }),
    ),
    e.push(Et.commands.registerCommand("chatgpt.openSidebar", vi)),
    e.push(
      Et.commands.registerCommand("chatgpt.openCommandMenu", async () => {
        await Et.commands.executeCommand("workbench.action.showCommands");
      }),
    ),
    e.push(
      Et.commands.registerCommand(RZt, async (oe) => {
        (oe?.source === TZt && (await u.update(J.SHOW_COPILOT_LOGIN_FIRST, !0)),
          Ct.createNewPanel());
      }),
    ),
    e.push(Et.commands.registerCommand("chatgpt.addToThread", async () => dHe(Ct))),
    e.push(Et.commands.registerCommand("chatgpt.addFileToThread", async (oe) => pHe(Ct, oe))),
    e.push(
      Et.commands.registerCommand(EZt, async () => {
        if (!s) {
          Et.window.showInformationMessage(
            'LSP server is not running. Set "chatgpt.useExperimentalLspMcpServer: true" in settings.json and reload to start it.',
          );
          return;
        }
        let oe = s.getCopyPasteableCodexCLICommand();
        (await Et.window.showInformationMessage(
          "Use this flag when running Jimao CLI to include the LSP server.",
          { modal: !0, detail: oe },
          "Copy",
        )) === "Copy" && (await Et.env.clipboard.writeText(oe));
      }),
    ),
    e.push(
      Et.commands.registerCommand(AZt, async () => {
        (await vi(), Ct.triggerNewChatViaWebview());
      }),
    ),
    Wn("commentCodeLensEnabled", !0))
  ) {
    let oe = new VB();
    e.push(Et.languages.registerCodeLensProvider({ scheme: "file" }, oe));
  }
  (Wn("openOnStartup", !1) && vi(),
    e.push(
      Et.commands.registerCommand("chatgpt.dumpNuxState", () => {
        u.dumpNuxState();
      }),
      Et.commands.registerCommand("chatgpt.resetNuxState", async () => {
        (await m.reset(), await u.resetNuxState());
      }),
    ),
    process.platform === "darwin" &&
      (async () => {
        try {
          let oe = await Promise.resolve().then(() => (V5e(), z5e));
          typeof oe.activate == "function" &&
            (oe.activate(t), he().info("Work with apps desktop bridge initialized"));
        } catch (oe) {
          he().warning("Desktop bridge init failed", { safe: {}, sensitive: { error: oe } });
        }
      })());
}
function kZt(t, e, r, n, o) {
  try {
    let i = new vL(t, e, r, n);
    return (o.push(i), o.push(Et.chat.registerChatSessionItemProvider(Av, i)), i);
  } catch (i) {
    return (
      he().info("Codex chat session item provider not registered", {
        safe: {},
        sensitive: { error: i },
      }),
      null
    );
  }
}
0 && (module.exports = { activate, deactivate });
/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

he/he.js:
  (*! https://mths.be/he v1.2.0 by @mathias | MIT license *)

smol-toml/dist/date.js:
  (*!
   * Copyright (c) Squirrel Chat et al., All rights reserved.
   * SPDX-License-Identifier: BSD-3-Clause
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice, this
   *    list of conditions and the following disclaimer.
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   *    this list of conditions and the following disclaimer in the
   *    documentation and/or other materials provided with the distribution.
   * 3. Neither the name of the copyright holder nor the names of its contributors
   *    may be used to endorse or promote products derived from this software without
   *    specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
   * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
   * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
   * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
   * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
   * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
   * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *)

smol-toml/dist/error.js:
  (*!
   * Copyright (c) Squirrel Chat et al., All rights reserved.
   * SPDX-License-Identifier: BSD-3-Clause
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice, this
   *    list of conditions and the following disclaimer.
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   *    this list of conditions and the following disclaimer in the
   *    documentation and/or other materials provided with the distribution.
   * 3. Neither the name of the copyright holder nor the names of its contributors
   *    may be used to endorse or promote products derived from this software without
   *    specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
   * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
   * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
   * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
   * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
   * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
   * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *)

smol-toml/dist/primitive.js:
  (*!
   * Copyright (c) Squirrel Chat et al., All rights reserved.
   * SPDX-License-Identifier: BSD-3-Clause
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice, this
   *    list of conditions and the following disclaimer.
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   *    this list of conditions and the following disclaimer in the
   *    documentation and/or other materials provided with the distribution.
   * 3. Neither the name of the copyright holder nor the names of its contributors
   *    may be used to endorse or promote products derived from this software without
   *    specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
   * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
   * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
   * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
   * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
   * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
   * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *)

smol-toml/dist/util.js:
  (*!
   * Copyright (c) Squirrel Chat et al., All rights reserved.
   * SPDX-License-Identifier: BSD-3-Clause
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice, this
   *    list of conditions and the following disclaimer.
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   *    this list of conditions and the following disclaimer in the
   *    documentation and/or other materials provided with the distribution.
   * 3. Neither the name of the copyright holder nor the names of its contributors
   *    may be used to endorse or promote products derived from this software without
   *    specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
   * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
   * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
   * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
   * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
   * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
   * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *)

smol-toml/dist/extract.js:
  (*!
   * Copyright (c) Squirrel Chat et al., All rights reserved.
   * SPDX-License-Identifier: BSD-3-Clause
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice, this
   *    list of conditions and the following disclaimer.
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   *    this list of conditions and the following disclaimer in the
   *    documentation and/or other materials provided with the distribution.
   * 3. Neither the name of the copyright holder nor the names of its contributors
   *    may be used to endorse or promote products derived from this software without
   *    specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
   * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
   * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
   * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
   * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
   * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
   * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *)

smol-toml/dist/struct.js:
  (*!
   * Copyright (c) Squirrel Chat et al., All rights reserved.
   * SPDX-License-Identifier: BSD-3-Clause
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice, this
   *    list of conditions and the following disclaimer.
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   *    this list of conditions and the following disclaimer in the
   *    documentation and/or other materials provided with the distribution.
   * 3. Neither the name of the copyright holder nor the names of its contributors
   *    may be used to endorse or promote products derived from this software without
   *    specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
   * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
   * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
   * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
   * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
   * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
   * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *)

smol-toml/dist/parse.js:
  (*!
   * Copyright (c) Squirrel Chat et al., All rights reserved.
   * SPDX-License-Identifier: BSD-3-Clause
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice, this
   *    list of conditions and the following disclaimer.
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   *    this list of conditions and the following disclaimer in the
   *    documentation and/or other materials provided with the distribution.
   * 3. Neither the name of the copyright holder nor the names of its contributors
   *    may be used to endorse or promote products derived from this software without
   *    specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
   * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
   * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
   * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
   * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
   * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
   * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *)

smol-toml/dist/stringify.js:
  (*!
   * Copyright (c) Squirrel Chat et al., All rights reserved.
   * SPDX-License-Identifier: BSD-3-Clause
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice, this
   *    list of conditions and the following disclaimer.
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   *    this list of conditions and the following disclaimer in the
   *    documentation and/or other materials provided with the distribution.
   * 3. Neither the name of the copyright holder nor the names of its contributors
   *    may be used to endorse or promote products derived from this software without
   *    specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
   * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
   * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
   * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
   * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
   * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
   * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *)

smol-toml/dist/index.js:
  (*!
   * Copyright (c) Squirrel Chat et al., All rights reserved.
   * SPDX-License-Identifier: BSD-3-Clause
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice, this
   *    list of conditions and the following disclaimer.
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   *    this list of conditions and the following disclaimer in the
   *    documentation and/or other materials provided with the distribution.
   * 3. Neither the name of the copyright holder nor the names of its contributors
   *    may be used to endorse or promote products derived from this software without
   *    specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
   * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
   * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
   * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
   * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
   * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
   * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *)
*/
