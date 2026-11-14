function Kzt(t) {
  return function (r) {
    if (pr() !== t) return;
    let n = r.from,
      o = r.to,
      i = pR(Jr.location.href),
      s = n ? pR(n) : void 0,
      a = pR(o);
    (s?.path || (s = i),
      i.protocol === a.protocol && i.host === a.host && (o = a.relative),
      i.protocol === s.protocol && i.host === s.host && (n = s.relative),
      xl({ category: "navigation", data: { from: n, to: o } }));
  };
}
function Zzt(t) {
  return !!t && !!t.target;
}
var Xzt = [
    "EventTarget",
    "Window",
    "Node",
    "ApplicationCache",
    "AudioTrackList",
    "BroadcastChannel",
    "ChannelMergerNode",
    "CryptoOperation",
    "EventSource",
    "FileReader",
    "HTMLUnknownElement",
    "IDBDatabase",
    "IDBRequest",
    "IDBTransaction",
    "KeyOperation",
    "MediaController",
    "MessagePort",
    "ModalWindow",
    "Notification",
    "SVGElementInstance",
    "Screen",
    "SharedWorker",
    "TextTrack",
    "TextTrackCue",
    "TextTrackList",
    "WebSocket",
    "WebSocketWorker",
    "Worker",
    "XMLHttpRequest",
    "XMLHttpRequestEventTarget",
    "XMLHttpRequestUpload",
  ],
  Yzt = "BrowserApiErrors",
  Jzt = (t = {}) => {
    let e = {
      XMLHttpRequest: !0,
      eventTarget: !0,
      requestAnimationFrame: !0,
      setInterval: !0,
      setTimeout: !0,
      unregisterOriginalCallbacks: !1,
      ...t,
    };
    return {
      name: Yzt,
      setupOnce() {
        (e.setTimeout && Pn(Jr, "setTimeout", Fze),
          e.setInterval && Pn(Jr, "setInterval", Fze),
          e.requestAnimationFrame && Pn(Jr, "requestAnimationFrame", Qzt),
          e.XMLHttpRequest && "XMLHttpRequest" in Jr && Pn(XMLHttpRequest.prototype, "send", e4t));
        let r = e.eventTarget;
        r && (Array.isArray(r) ? r : Xzt).forEach((o) => t4t(o, e));
      },
    };
  },
  $ze = Jzt;
function Fze(t) {
  return function (...e) {
    let r = e[0];
    return (
      (e[0] = _f(r, {
        mechanism: { handled: !1, type: `auto.browser.browserapierrors.${gs(t)}` },
      })),
      t.apply(this, e)
    );
  };
}
function Qzt(t) {
  return function (e) {
    return t.apply(this, [
      _f(e, {
        mechanism: {
          data: { handler: gs(t) },
          handled: !1,
          type: "auto.browser.browserapierrors.requestAnimationFrame",
        },
      }),
    ]);
  };
}
function e4t(t) {
  return function (...e) {
    let r = this;
    return (
      ["onload", "onerror", "onprogress", "onreadystatechange"].forEach((o) => {
        o in r &&
          typeof r[o] == "function" &&
          Pn(r, o, function (i) {
            let s = {
                mechanism: {
                  data: { handler: gs(i) },
                  handled: !1,
                  type: `auto.browser.browserapierrors.xhr.${o}`,
                },
              },
              a = yf(i);
            return (a && (s.mechanism.data.handler = gs(a)), _f(i, s));
          });
      }),
      t.apply(this, e)
    );
  };
}
function t4t(t, e) {
  let n = Jr[t]?.prototype;
  n?.hasOwnProperty?.("addEventListener") &&
    (Pn(n, "addEventListener", function (o) {
      return function (i, s, a) {
        try {
          r4t(s) &&
            (s.handleEvent = _f(s.handleEvent, {
              mechanism: {
                data: { handler: gs(s), target: t },
                handled: !1,
                type: "auto.browser.browserapierrors.handleEvent",
              },
            }));
        } catch {}
        return (
          e.unregisterOriginalCallbacks && n4t(this, i, s),
          o.apply(this, [
            i,
            _f(s, {
              mechanism: {
                data: { handler: gs(s), target: t },
                handled: !1,
                type: "auto.browser.browserapierrors.addEventListener",
              },
            }),
            a,
          ])
        );
      };
    }),
    Pn(n, "removeEventListener", function (o) {
      return function (i, s, a) {
        try {
          let l = s.__sentry_wrapped__;
          l && o.call(this, i, l, a);
        } catch {}
        return o.call(this, i, s, a);
      };
    }));
}
function r4t(t) {
  return typeof t.handleEvent == "function";
}
function n4t(t, e, r) {
  t &&
    typeof t == "object" &&
    "removeEventListener" in t &&
    typeof t.removeEventListener == "function" &&
    t.removeEventListener(e, r);
}
var Uze = () => ({
  name: "BrowserSession",
  setupOnce() {
    if (typeof Jr.document > "u") {
      Uv &&
        Te.warn(
          "Using the `browserSessionIntegration` in non-browser environments is not supported.",
        );
      return;
    }
    (aR({ ignoreDuration: !0 }),
      lR(),
      gR(({ from: t, to: e }) => {
        t !== void 0 && t !== e && (aR({ ignoreDuration: !0 }), lR());
      }));
  },
});
var o4t = "GlobalHandlers",
  i4t = (t = {}) => {
    let e = { onerror: !0, onunhandledrejection: !0, ...t };
    return {
      name: o4t,
      setupOnce() {
        Error.stackTraceLimit = 50;
      },
      setup(r) {
        (e.onerror && (s4t(r), qze("onerror")),
          e.onunhandledrejection && (a4t(r), qze("onunhandledrejection")));
      },
    };
  },
  Gze = i4t;
function s4t(t) {
  G9((e) => {
    let { stackParser: r, attachStacktrace: n } = Wze();
    if (pr() !== t || BZ()) return;
    let { msg: o, url: i, line: s, column: a, error: l } = e,
      c = u4t(b2(r, l || o, void 0, n, !1), i, s, a);
    ((c.level = "error"),
      sR(c, {
        originalException: l,
        mechanism: { handled: !1, type: "auto.browser.global_handlers.onerror" },
      }));
  });
}
function a4t(t) {
  H9((e) => {
    let { stackParser: r, attachStacktrace: n } = Wze();
    if (pr() !== t || BZ()) return;
    let o = l4t(e),
      i = Ad(o) ? c4t(o) : b2(r, o, void 0, n, !0);
    ((i.level = "error"),
      sR(i, {
        originalException: o,
        mechanism: { handled: !1, type: "auto.browser.global_handlers.onunhandledrejection" },
      }));
  });
}
function l4t(t) {
  if (Ad(t)) return t;
  try {
    if ("reason" in t) return t.reason;
    if ("detail" in t && "reason" in t.detail) return t.detail.reason;
  } catch {}
  return t;
}
function c4t(t) {
  return {
    exception: {
      values: [
        {
          type: "UnhandledRejection",
          value: `Non-Error promise rejection captured with value: ${String(t)}`,
        },
      ],
    },
  };
}
function u4t(t, e, r, n) {
  let o = (t.exception = t.exception || {}),
    i = (o.values = o.values || []),
    s = (i[0] = i[0] || {}),
    a = (s.stacktrace = s.stacktrace || {}),
    l = (a.frames = a.frames || []),
    c = n,
    u = r,
    p = d4t(e) ?? rR();
  return (
    l.length === 0 && l.push({ colno: c, filename: p, function: fl, in_app: !0, lineno: u }),
    t
  );
}
function qze(t) {
  Uv && Te.log(`Global Handler attached: ${t}`);
}
function Wze() {
  return pr()?.getOptions() || { stackParser: () => [], attachStacktrace: !1 };
}
function d4t(t) {
  if (!(!Wo(t) || t.length === 0)) return t.startsWith("data:") ? `<${AZ(t, !1)}>` : t;
}
var Hze = () => ({
  name: "HttpContext",
  preprocessEvent(t) {
    if (!Jr.navigator && !Jr.location && !Jr.document) return;
    let e = Eze(),
      r = { ...e.headers, ...t.request?.headers };
    t.request = { ...e, ...t.request, headers: r };
  },
});
var p4t = "cause",
  m4t = 5,
  f4t = "LinkedErrors",
  h4t = (t = {}) => {
    let e = t.limit || m4t,
      r = t.key || p4t;
    return {
      name: f4t,
      preprocessEvent(n, o, i) {
        let s = i.getOptions();
        PZ(v2, s.stackParser, r, e, n, o);
      },
    };
  },
  jze = h4t;
function XZ(t) {
  return [f2(), p2(), $ze(), Bze(), Gze(), jze(), h2(), Hze(), Uze()];
}
O();
Pt();
var YZ = { darwin: "macOS", linux: "Linux", win32: "Windows" };
function zze(t) {
  if (t === "darwin") return YZ.darwin;
  if (t === "linux") return YZ.linux;
  if (t === "win32") return YZ.win32;
}
wd();
var g4t = "prod";
function y4t(t) {
  let e = Ic(),
    r = XZ({}).filter(
      (s) => !["BrowserApiErrors", "Breadcrumbs", "GlobalHandlers"].includes(s.name),
    ),
    n = new hR({
      dsn: t,
      environment: g4t,
      release: Sge(e.version),
      transport: VZ,
      stackParser: ZZ,
      integrations: r,
    }),
    o = new io();
  (o.setClient(n), o.setTag("preRelease", e.isPreRelease), o.setTag("host", "extension"));
  let i = zze(process.platform);
  return (i != null && o.setContext("os", { name: i }), n.init(), o);
}
var qv = y4t(_k);
function Vze(t) {
  return r$e((e, r, n) => {
    let o = t.clone();
    if (
      (o.setLevel(r === "fatal" ? "fatal" : "error"),
      n.groupingFingerprint && o.setFingerprint(n.groupingFingerprint),
      n.tags)
    )
      for (let [i, s] of Object.entries(n.tags)) o.setTag(i, s);
    if (n.extra) for (let [i, s] of Object.entries(n.extra)) o.setExtra(i, s);
    o.captureException(e);
  });
}
O();
function Kze(t, e) {
  let r,
    n = t.onDidReceiveMessage((o) => {
      let i = Mne(o);
      i == null ||
        i.sessionId === r?.sessionId ||
        (r?.dispose(), (r = void 0), (r = e(i.sessionId)));
    });
  return {
    dispose: () => {
      (n.dispose(), r?.dispose(), (r = void 0));
    },
  };
}
O();
var A2 = class {
  encodingLevel = "jsonCompatibleWithBytes";
  #e;
  #t;
  #r;
  #n;
  #i;
  #o = [];
  #s;
  constructor(e, r) {
    ((this.#t = e),
      (this.#r = r),
      (this.#e = [
        e.onDidReceiveMessage((n) => {
          let o = Dne(n);
          o == null || o.sessionId !== this.#r || this.#a(o.message);
        }),
      ]));
  }
  send(e) {
    if (this.#s) throw this.#s;
    let r = { type: "vscode-capn-rpc-message", sessionId: this.#r, message: e };
    this.#t.postMessage(r).then(
      (n) => {
        n || this.dispose();
      },
      (n) => this.abort(n),
    );
  }
  async receive() {
    let e = this.#o.shift();
    if (e != null) return e;
    if (this.#s) throw this.#s;
    return new Promise((r, n) => {
      ((this.#n = r), (this.#i = n));
    });
  }
  dispose() {
    this.abort(new Error("VS Code webview RPC transport disposed."));
  }
  abort(e) {
    if (this.#s) return;
    let r = e instanceof Error ? e : new Error("VS Code webview RPC transport aborted.");
    ((this.#s = r),
      this.#e.forEach((n) => {
        n.dispose();
      }),
      this.#i?.(r),
      (this.#n = void 0),
      (this.#i = void 0));
  }
  #a(e) {
    if (!this.#s) {
      if (this.#n) {
        (this.#n(e), (this.#n = void 0), (this.#i = void 0));
        return;
      }
      this.#o.push(e);
    }
  }
};
var Td = F(require("node:path"));
ot();
O();
function Zze() {
  let t = process.env.HOME;
  if (t == null && process.platform === "win32") {
    let { HOMEDRIVE: n, HOMEPATH: o, USERPROFILE: i } = process.env;
    t = n != null && o != null ? `${n}${o}` : i;
  }
  let e = null;
  process.env.XDG_CONFIG_HOME
    ? (e = `${process.env.XDG_CONFIG_HOME}/git`)
    : t != null && (e = `${t}/.config/git`);
  let r = [];
  return (
    process.env.GIT_CONFIG_GLOBAL != null
      ? process.env.GIT_CONFIG_GLOBAL !== "" && r.push(process.env.GIT_CONFIG_GLOBAL)
      : (e != null && r.push(`${e}/config`), t != null && r.push(`${t}/.gitconfig`)),
    {
      defaultAttributesFile: e == null ? null : `${e}/attributes`,
      defaultExcludesFile: e == null ? null : `${e}/ignore`,
      globalConfigFiles: r,
    }
  );
}
O();
Pt();
var oa = F(require("vscode")),
  v4t = Ie("vscode-working-tree-watch"),
  Jze = (t) => {
    if (
      !(
        oa.env.remoteName != null ||
        oa.workspace.workspaceFolders?.some(
          ({ uri: e }) => e.scheme !== "file" && JZ(e.fsPath, t),
        ) ||
        e4e(t)?.scheme !== "file"
      )
    )
      return { getEnvironment: Zze, getWatchTargets: i9, pruneIgnoredDirectories: !1 };
  };
async function Qze(t, e) {
  if (!t.isLocal) return t.startFileWatch(e);
  let r = e4e(e.path);
  if (r == null) return t.startFileWatch(e);
  try {
    let n = oa.workspace.createFileSystemWatcher(new oa.RelativePattern(r, "**")),
      o = pt(),
      i = (l) => {
        e.onChange({ changedPaths: [l.fsPath] });
      },
      s = [n.onDidCreate(i), n.onDidChange(i), n.onDidDelete(i)],
      a = !1;
    return {
      coverage: { recursive: !0, typedPathChanges: !1 },
      path: e.path,
      closed: o.promise,
      dispose: async () => {
        a ||
          ((a = !0),
          s.forEach((l) => {
            l.dispose();
          }),
          n.dispose(),
          o.resolve({ reason: "disposed" }));
      },
    };
  } catch (n) {
    return (
      v4t().warning("Failed to start VS Code working-tree watcher", {
        safe: {},
        sensitive: { error: n, path: e.path },
      }),
      t.startFileWatch(e)
    );
  }
}
function e4e(t) {
  let e = oa.workspace.workspaceFolders,
    r = e?.find((o) => JZ(o.uri.fsPath, t));
  if (r != null) return Yze(r.uri) ? Xze(r.uri, t) : null;
  let n = e?.filter((o) => o.uri.scheme === "vscode-remote" && JZ(t, o.uri.fsPath));
  if (n != null && n.length > 0) {
    let [o] = n;
    return o == null || n.some((i) => i.uri.authority !== o.uri.authority) ? null : Xze(o.uri, t);
  }
  return e?.some((o) => o.uri.scheme === "vscode-remote" || !Yze(o.uri)) ? null : oa.Uri.file(t);
}
function Xze(t, e) {
  let r = Td.relative(t.fsPath, e);
  return r === "" ? t : oa.Uri.joinPath(t, ...r.split(Td.sep));
}
function Yze(t) {
  return t.scheme === "file" || t.scheme === "vscode-remote";
}
function JZ(t, e) {
  let r = Td.relative(t, e);
  return r === "" || (!r.startsWith(`..${Td.sep}`) && r !== ".." && !Td.isAbsolute(r));
}
O();
var Gv = F(require("vscode"));
wd();
var b4t = "https://persistent.oaistatic.com",
  S4t = ["wss://ws.chatgpt.com", "wss://ws.chatgpt-staging.com"],
  w4t = ["https://api.mapbox.com", "https://events.mapbox.com"],
  _4t = [
    "https://cdn.platform.openai.com",
    "https://web-sandbox.oaiusercontent.com",
    "https://*.web-sandbox.oaiusercontent.com",
    "https://www.youtube.com",
    "https://player.vimeo.com/video/",
    "https://embed.apple-mapkit.com/v1/embed",
    "https://drive.google.com/file/d/",
    "https://docs.google.com/document/d/",
    "https://docs.google.com/spreadsheets/d/",
    "https://docs.google.com/presentation/d/",
    "https://www.google.com/maps",
    "https://www.google.com/maps/embed",
    "https://codepen.io",
  ];
function QZ({ cspSource: t, devOrigin: e, extensionSentryOrigin: r }) {
  let n = [t, "blob:", r, b4t, ...w4t, ...S4t];
  return (
    e != null && n.push(e, e.replace(/^http/, "ws")),
    [
      "default-src 'none'",
      `frame-src ${_4t.join(" ")}`,
      `img-src ${t}${e == null ? "" : ` ${e}`} https: data: blob:`,
      `media-src ${t} blob: https:`,
      `script-src ${t}${e == null ? "" : ` ${e} http://localhost:8097 'unsafe-inline'`}`,
      `style-src ${t}${e == null ? "" : ` ${e}`} 'unsafe-inline'`,
      `font-src ${t}${e == null ? "" : ` ${e}`}`,
      `connect-src ${n.join(" ")}`,
    ].join("; ") + ";"
  );
}
var x4t = "http://localhost:5173",
  t4e = process.env.CODEX_EXTENSION_WEBVIEW_DEV_SERVER_URL?.trim() ?? x4t,
  A4t = "/src/main.tsx",
  r4e = new WeakMap(),
  n4e = bge(_k);
async function R2(t, e, r) {
  return R4t(t, e, r);
}
async function R4t(t, e, r) {
  let n = Gv.Uri.joinPath(t, "webview"),
    o = Gv.Uri.joinPath(n, "index.html"),
    i = r4e.get(t);
  if (i == null) {
    let p = await Gv.workspace.fs.readFile(o);
    ((i = new TextDecoder("utf-8").decode(p)), r4e.set(t, i));
  }
  let s = e.asWebviewUri(n).toString() + "/",
    a = ia(s),
    l = QZ({ cspSource: e.cspSource, extensionSentryOrigin: n4e }),
    c = ia(l),
    u = i
      .replace("<!-- PROD_BASE_TAG_HERE -->", `<base href="${a}">`)
      .replace(
        "<!-- PROD_CSP_TAG_HERE -->",
        `<meta http-equiv="Content-Security-Policy" content="${c}">`,
      );
  return (
    (u = u.replace(
      "</head>",
      `${r}
</head>`,
    )),
    u
  );
}
function E4t(t, e) {
  let r = Gv.Uri.parse(t4e).toString(),
    n = new URL(t4e).origin,
    o = QZ({ cspSource: t.cspSource, devOrigin: n, extensionSentryOrigin: n4e });
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="${ia(o)}">
    <base href="${r}">
    ${e}

    <!-- Hot reloading code from Vite -->
    <script type="module">
        import RefreshRuntime from "/@react-refresh"
        RefreshRuntime.injectIntoGlobalHook(window)
        window.$RefreshReg$ = () => {}
        window.$RefreshSig$ = () => (type) => type
        window.__vite_plugin_react_preamble_installed__ = true
    </script>
    <script type="module" src="/@vite/client"></script>
    <script type="module" src="${A4t}"></script>
    <script src="http://localhost:8097"></script>
</head>
<body tabindex="0" style="outline: none">
    <div id="root"></div>
</body>
</html>`;
}
function ia(t) {
  return t.replace(/["<&]/g, (e) => {
    switch (e) {
      case '"':
        return "&quot;";
      case "<":
        return "&lt;";
      case "&":
        return "&amp;";
      default:
        return e;
    }
  });
}
var E2 = class {
  constructor(e) {
    this.onTimeout = e;
  }
  timeout;
  disposed = !1;
  receivedWebviewMessage = !1;
  start() {
    if (this.disposed || this.timeout != null) return;
    let e = Date.now();
    this.timeout = setTimeout(() => {
      ((this.timeout = void 0),
        this.onTimeout({
          elapsedMs: Date.now() - e,
          receivedWebviewMessage: this.receivedWebviewMessage,
          timeoutMs: 3e4,
        }));
    }, 3e4);
  }
  markMessageReceived() {
    this.receivedWebviewMessage = !0;
  }
  handleStartupPhase(e) {
    e === "renderer_ready" && this.dispose();
  }
  dispose() {
    ((this.disposed = !0),
      this.timeout != null && (clearTimeout(this.timeout), (this.timeout = void 0)));
  }
};
var i4e = require("node:child_process"),
  s4e = require("node:util"),
  C4t = (0, s4e.promisify)(i4e.execFile),
  T4t = 1500,
  P4t = 1024 * 1024,
  I4t = 3,
  k4t = 5,
  D4t = 1e4,
  a4e = "windows-app-server-crash-events.ps1";
async function l4e(t) {
  if (process.platform !== "win32") return null;
  let e = new Date(t.crashTimeMs - 3e4).toISOString();
  try {
    let { stdout: r } = await C4t(
        "powershell.exe",
        [
          "-NoProfile",
          "-NonInteractive",
          "-ExecutionPolicy",
          "Bypass",
          "-File",
          t.scriptPath,
          "-StartIso",
          e,
        ],
        { encoding: "utf8", maxBuffer: P4t, timeout: T4t, windowsHide: !0 },
      ),
      n = M4t(r);
    return O4t(n, t);
  } catch {
    return null;
  }
}
function M4t(t) {
  let e = t.trim();
  if (e.length === 0) return [];
  let r;
  try {
    r = JSON.parse(e);
  } catch {
    return [];
  }
  return (Array.isArray(r) ? r : [r]).flatMap((o) => {
    if (o == null || typeof o != "object") return [];
    let i = o;
    if (
      typeof i.channel != "string" ||
      typeof i.message != "string" ||
      typeof i.provider != "string" ||
      typeof i.timestamp != "string"
    )
      return [];
    let s = typeof i.eventId == "number" ? i.eventId : Number.parseInt(String(i.eventId), 10);
    if (!Number.isFinite(s)) return [];
    let a = L4t(i.processId);
    return [
      {
        channel: i.channel,
        eventId: s,
        ...(typeof i.executableName == "string" && i.executableName.trim().length > 0
          ? { executableName: i.executableName }
          : {}),
        level: typeof i.level == "string" ? i.level : null,
        message: i.message,
        ...(a == null ? {} : { processId: a }),
        provider: i.provider,
        timestamp: i.timestamp,
      },
    ];
  });
}
function O4t(t, e) {
  let r = t
      .map((o) => ({ eventMatch: F4t(o, e), event: o, timestampMs: c4e(o) }))
      .filter(N4t)
      .sort((o, i) =>
        o.eventMatch !== i.eventMatch
          ? $4t(o.eventMatch, i.eventMatch)
          : i.timestampMs - o.timestampMs,
      )
      .slice(0, k4t),
    n = r[0]?.eventMatch === "process_id" ? r[0].event : null;
  return n != null
    ? { candidateEvents: [], matchedEvent: n }
    : { candidateEvents: r.slice(0, I4t).map(({ event: o }) => o), matchedEvent: null };
}
function N4t(t) {
  return t.eventMatch != null;
}
function c4e(t) {
  let e = Date.parse(t.timestamp);
  return Number.isFinite(e) ? e : 0;
}
function L4t(t) {
  if (typeof t == "number") return Number.isSafeInteger(t) && t > 0 ? t : null;
  if (typeof t != "string") return null;
  let e = t.trim();
  if (!/^(?:0x[0-9a-f]+|\d+)$/i.test(e)) return null;
  let r = e.toLowerCase().startsWith("0x")
    ? Number.parseInt(e.slice(2), 16)
    : Number.parseInt(e, 10);
  return Number.isSafeInteger(r) && r > 0 ? r : null;
}
function B4t(t) {
  let e = /process id:\s*0x([0-9a-f]+)/i.exec(t);
  if (e?.[1] != null) return Number.parseInt(e[1], 16);
  let r = /process id:\s*(\d+)/i.exec(t);
  return r?.[1] != null ? Number.parseInt(r[1], 10) : null;
}
function F4t(t, e) {
  let r = t.processId ?? B4t(t.message);
  if (e.processId != null && r === e.processId) return "process_id";
  let n = e.executableBasename?.trim().toLowerCase();
  return n != null &&
    n.length > 0 &&
    (t.executableName?.trim().toLowerCase() === n || t.message.toLowerCase().includes(n))
    ? "executable_name"
    : U4t(t, e.crashTimeMs)
      ? "time_window"
      : null;
}
function $4t(t, e) {
  return o4e(e) - o4e(t);
}
function o4e(t) {
  switch (t) {
    case "process_id":
      return 3;
    case "executable_name":
      return 2;
    case "time_window":
      return 1;
  }
}
function U4t(t, e) {
  let r = c4e(t);
  return Number.isFinite(r) ? Math.abs(e - r) <= D4t : !1;
}
O();
Pt();
var C2 = class {
  constructor(e) {
    this.options = e;
    let r = "git",
      n = qWe({
        createExecutionHost: this.options.createExecutionHost,
        emit: (o) => {
          this.handleServerMessage(r, o);
        },
        gitManager: this.options.gitManager,
        startWorkingTreeWatch: this.options.startWorkingTreeWatch,
        getWatchIgnoreSources: this.options.getWatchIgnoreSources,
      });
    this.serversByWorkerId.set(r, {
      handleRequest: (o) => {
        let i = o;
        return jt({ op: "codex.worker.request", name: `${r}.${i.method}` }, () =>
          n.handleRequest(i),
        );
      },
      handleCancel: (o) => {
        n.handleCancel(o);
      },
    });
  }
  serversByWorkerId = new Map();
  pending = new Map();
  knownWebviews = new Set();
  performanceRecipient = null;
  repoWatchesByWebview = new Map();
  registerWebview(e) {
    this.knownWebviews.add(e);
  }
  unregisterWebview(e) {
    (this.knownWebviews.delete(e),
      this.performanceRecipient === e && (this.performanceRecipient = null),
      this.cleanupOrigin(e));
  }
  async handleMessage(e, r) {
    this.registerWebview(e);
    let n = this.serversByWorkerId.get(r.workerId);
    if (n)
      switch (r.type) {
        case "worker-request": {
          if (
            ((this.performanceRecipient = e),
            r.workerId === "git" && r.request.method === "unwatch-repo")
          ) {
            let o = r.request;
            this.consumeRepoWatch(e, o);
          }
          if (
            (this.pending.set(this.createRequestKey(r.workerId, r.request.id), e),
            await n.handleRequest(r.request),
            r.workerId === "git" && r.request.method === "watch-repo")
          ) {
            let o = r.request;
            this.knownWebviews.has(e)
              ? this.trackRepoWatch(e, o)
              : await this.releaseRepoWatch(n, o);
          }
          return;
        }
        case "worker-request-cancel": {
          (this.pending.delete(this.createRequestKey(r.workerId, r.id)), n.handleCancel(r.id));
          return;
        }
      }
  }
  createRequestKey(e, r) {
    return `${e}:${String(r)}`;
  }
  cleanupOrigin(e) {
    for (let [o, i] of this.pending.entries()) {
      if (i !== e) continue;
      this.pending.delete(o);
      let s = o.indexOf(":");
      if (s === -1) continue;
      let a = o.slice(0, s),
        l = o.slice(s + 1),
        c = this.serversByWorkerId.get(a);
      c && c.handleCancel(l);
    }
    let r = this.serversByWorkerId.get("git"),
      n = this.repoWatchesByWebview.get(e);
    (this.repoWatchesByWebview.delete(e),
      !(r == null || n == null) &&
        n.forEach((o) => {
          this.releaseRepoWatch(r, o);
        }));
  }
  trackRepoWatch(e, r) {
    let n = this.repoWatchesByWebview.get(e) ?? [];
    (n.push(r), this.repoWatchesByWebview.set(e, n));
  }
  consumeRepoWatch(e, r) {
    let n = this.repoWatchesByWebview.get(e);
    if (n == null) return;
    let o = this.getRepoWatchKey(r),
      i = n.findIndex((s) => this.getRepoWatchKey(s) === o);
    i !== -1 && (n.splice(i, 1), n.length === 0 && this.repoWatchesByWebview.delete(e));
  }
  getRepoWatchKey(e) {
    return JSON.stringify([e.params.hostConfig ?? null, e.params.root, e.params.commonDir]);
  }
  async releaseRepoWatch(e, r) {
    await e.handleRequest({ id: r.id, method: "unwatch-repo", params: r.params });
  }
  handleServerMessage(e, r) {
    if (r.type === "worker-response") {
      let n = `${e}:${String(r.response.id)}`,
        o = this.pending.get(n);
      if (!o) return;
      (this.pending.delete(n),
        this.options.postMessage(o, {
          type: "worker-response",
          workerId: e,
          response: r.response,
        }));
      return;
    }
    if (
      r.event.type === "git-performance-operation" ||
      r.event.type === "git-performance-watcher-snapshot"
    ) {
      let n = this.performanceRecipient ?? this.knownWebviews.values().next().value;
      n != null &&
        this.options.postMessage(n, { type: "worker-event", workerId: e, event: r.event });
      return;
    }
    this.knownWebviews.forEach((n) => {
      this.options.postMessage(n, { type: "worker-event", workerId: e, event: r.event });
    });
  }
};
var d4e = require("node:crypto");
Pt();
var p4e = F(require("vscode"));
O();
var u4e = F(require("vscode"));
function T2() {
  return (
    u4e.workspace.workspaceFolders
      ?.filter(
        ({ uri: t }) =>
          (t.fsPath !== "/" || t.scheme === "file" || t.scheme === "vscode-remote") && Ip(t.fsPath),
      )
      .map(({ uri: t }) => t.fsPath) ?? []
  );
}
var P2 = class extends ZA {
  constructor(e, r) {
    super(async ({ canonicalizeRoots: n }, o) => {
      let i = await tX(e, r),
        s = n == null || n.length === 0 ? {} : await IDe(Array.from(new Set(n)), e, o);
      return { roots: i, ...(Object.keys(s).length === 0 ? {} : { canonicalPathByRoot: s }) };
    });
  }
};
async function tX(t, e) {
  let r = T2(),
    n = p4e.workspace.workspaceFolders;
  if (r.length > 0 || n == null || n.length === 0 || !n.some((a) => a.uri.scheme !== "file"))
    return r;
  let o = await t.platformPath(),
    i = o.join(e, "virtual-workspaces"),
    s = o.join(
      i,
      (0, d4e.createHash)("sha256")
        .update(n.map((a) => a.uri.toString()).join("\0"))
        .digest("hex")
        .slice(0, 16),
    );
  return (await eX(t, e), await eX(t, i), await eX(t, s), [s]);
}
async function eX(t, e) {
  await t.createDirectory(e, { recursive: !0 });
  let r = await t.stat(e, { bypassCache: !0, followSymlinks: !1 });
  if (!r.isDirectory() || r.isSymbolicLink())
    throw new Error("Virtual workspace directory must be a real directory");
}
O();
Pt();
function m4e(t, e) {
  return new XA((r, n) =>
    Xr({ source: r.source, requestKind: "prepare-worktree-snapshot" }, async () => {
      let o = r.gitRoot,
        i = await t.getWorktreeRepository(o, e);
      if (
        (i == null && (t.invalidateStableMetadata(), (i = await t.getWorktreeRepository(o, e))),
        i == null)
      )
        throw new Error("gitRoot must belong to a Git worktree");
      return LA(i, r.snapshotBranch, n);
    }),
  );
}
var q4t = d.object({
    type: d.literal("chunked-message-ack"),
    transferId: d.string(),
    sequence: d.number().int(),
  }),
  f4e = 30,
  y4e = "Codex",
  yR = "CodexWebviewProvider.webview",
  vR = class {
    currentPanel;
    currentPanelPromise;
    owner;
    title;
    constructor(e) {
      this.title = e;
    }
  },
  Af = class t {
    constructor(
      e,
      r,
      n,
      o,
      i,
      s,
      a,
      l,
      c,
      u,
      p,
      m,
      f,
      h,
      v,
      y,
      w,
      _,
      S,
      E,
      T,
      P,
      M,
      L,
      V,
      de,
      ue,
      Ae,
      ge,
      Pe,
      Q,
    ) {
      this.extensionUri = e;
      this.codexMcpConnection = r;
      this.authTokenProvider = n;
      this.chunkedMessageSender = o;
      this.fetchWrapper = i;
      this.workspaceFileService = s;
      this.getLocalIdeContext = a;
      this.openIn = l;
      this.threadMetadataGeneration = c;
      this.gitMessageGeneration = u;
      this.threadConfiguration = p;
      this.settings = m;
      this.globalStateService = f;
      this.projectCatalog = h;
      this.queuedSendLocks = v;
      this.threadProjectAssignments = y;
      this.modelProxyManager = w;
      this.conversationSummaryProvider = _;
      this.chatSessionItemProvider = S;
      this.globalState = E;
      this.gitManager = P;
      this.errorReporter = M;
      this.ipcClient = L;
      this.extensionVersion = V;
      this.codexAppSessionId = de;
      this.buildFlavor = ue;
      this.onCodexViewVisibilityChanged = Ae;
      this.appServerClient = ge;
      this.microphoneCapture = Pe;
      this.workspaceStoragePath = Q;
      ((this.customAvatars = new NL(ge)),
        this.subscriptions.push(
          this.globalState.onDidUpdatePersistedAtom(({ key: X, value: G }) => {
            this.broadcastPersistedAtomUpdate(X, G);
          }),
          this.globalState.onDidResetPersistedAtoms(() => {
            this.broadcastToAllViews({ type: "persisted-atom-sync", state: {} });
          }),
        ),
        (this.workerBusMessageHandler = new C2({
          createExecutionHost: () => new nf(),
          startWorkingTreeWatch: Qze,
          getWatchIgnoreSources: Jze,
          postMessage: (X, G) => {
            this.postMessageToWebview(X, G);
          },
          gitManager: this.gitManager,
        })),
        (this.datadogLogger = T),
        this.subscriptions.push(
          ze.commands.registerCommand(
            "chatgpt.implementTodo",
            async ({ line: X, fileName: G, cwd: ce, comment: Ce }) => {
              await vi();
              let De = { fileName: G, cwd: ce, line: X, comment: Ce };
              this.sidebarView && this.sidebarWebviewReady
                ? this.postMessageToWebview(this.sidebarView.webview, {
                    type: "implement-todo",
                    ...De,
                  })
                : (this.pendingImplementTodo = De);
            },
          ),
        ),
        this.subscriptions.push(
          ze.workspace.onDidChangeWorkspaceFolders(() => {
            this.broadcastToAllViews({
              type: "global-state-updated",
              keys: [J.LOCAL_PROJECTS, J.SELECTED_PROJECT],
            });
          }),
        ),
        this.subscriptions.push(
          ze.workspace.onDidChangeConfiguration((X) => {
            (X.affectsConfiguration("chat.fontSize") ||
              X.affectsConfiguration("chat.editor.fontSize")) &&
              this.broadcastChatFontSettings();
          }),
        ),
        this.subscriptions.push(
          this.codexMcpConnection.registerProvider(yR, {
            onInitialized: (X) => {
              this.broadcastToAllViews(ex("local", "stdio", X, null));
            },
            onResult: (X) => {
              this.deliverMcpResponseToOrigin(X);
            },
            onRequestDelivery: (X) => {
              let G = String(X.delivery.requestId),
                ce = this.pendingMcpRequests.get(G);
              ce != null &&
                (X.type === "failed" && this.pendingMcpRequests.delete(G),
                this.postMessageToWebview(ce, {
                  type: "mcp-request-delivery",
                  hostId: "local",
                  update: X,
                }));
            },
            onRequest: (X) => {
              this.broadcastToAllViews({ type: "mcp-request", hostId: "local", request: X });
            },
            onRequestUserInputAutoResolutionChanged: (X) => {
              this.broadcastToAllViews({
                type: "request-user-input-auto-resolution-changed",
                hostId: "local",
                change: X,
              });
            },
            onRawNotification: (X) => {
              let { method: G, params: ce } = X;
              this.broadcastToAllViews({
                type: "mcp-notification",
                hostId: "local",
                method: G,
                params: ce,
              });
            },
            onFatalError: (X, G) => {
              (this.logger.error("Fatal error", { safe: { message: X.message }, sensitive: {} }),
                (this.fatalError = X),
                (this.mostRecentErrorLog = G ?? null),
                this.reportAppServerFatalError(X, G),
                this.broadcastToAllViews({
                  type: "codex-app-server-fatal-error",
                  hostId: "local",
                  errorMessage: X.message,
                  cliErrorMessage: G,
                }));
            },
          }),
        ),
        (this.previewLoader = new DL(this.codexMcpConnection)),
        this.ensureRestoredConversationTabsResolved());
    }
    commentAttachments = new _L();
    static viewType = b9;
    static secondaryViewType = S9;
    static panelViewType = "chatgpt.panelView";
    static customEditorViewType = "chatgpt.conversationEditor";
    composerHandoff = new xL();
    logger = Dt("CodexWebviewProvider");
    customAvatars;
    computerUseSettings = new kL();
    worktreeComposerEducation = new x0();
    sidebarView;
    sidebarWebviewReady = !1;
    editorPanels = new Map();
    subscriptions = [];
    pendingImplementTodo = null;
    pendingContextFiles = [];
    pendingNavigationRoutes = [];
    pendingSidebarMessages = [];
    sidebarViews = new Set();
    readySidebarViews = new Set();
    pendingMcpRequests = new Map();
    clientCoordinationByWebview = new Map();
    workerBusMessageHandler;
    focusedView;
    datadogLogger;
    modelReviewComments = new EL();
    previewLoader;
    fatalError = null;
    mostRecentErrorLog = null;
    diffPanel;
    planSummaryPanel;
    settingsPanel;
    async reportAppServerFatalError(e, r) {
      let n = {
        appServerPhase: e.appServerCrashContext?.phase ?? "pre_initialize",
        errorBoundary: tDe,
      };
      e.appServerCrashContext?.lastOutboundMethod != null &&
        (n.appServerLastOutboundMethod = e.appServerCrashContext.lastOutboundMethod);
      let o = {};
      if (
        (r != null && (o.codexCliErrorMessage = r),
        process.platform === "win32" &&
          e.exitCode != null &&
          e.exitCode !== 0 &&
          e.appServerCrashContext != null)
      ) {
        let i = await l4e({
          crashTimeMs: e.appServerCrashContext.processExitedAtMs,
          executableBasename: e.appServerCrashContext.executableBasename,
          processId: e.appServerCrashContext.processId,
          scriptPath: ze.Uri.joinPath(this.extensionUri, "resources", a4e).fsPath,
        });
        i?.matchedEvent != null
          ? ((n.windowsEventProvider = i.matchedEvent.provider),
            (o.windowsEventId = i.matchedEvent.eventId),
            (o.windowsEventMessage = i.matchedEvent.message))
          : i != null &&
            i.candidateEvents.length > 0 &&
            (o.windowsEventCandidateMessages = i.candidateEvents.map((s) => ({
              eventId: s.eventId,
              message: s.message,
              provider: s.provider,
            })));
      }
      this.errorReporter.reportFatal(e, {
        kind: "codex-app-server-fatal-error",
        tags: n,
        extra: Object.keys(o).length > 0 ? o : void 0,
      });
    }
    async resolveWebviewView(e, r, n) {
      ((this.sidebarView = e),
        (this.sidebarWebviewReady = this.readySidebarViews.has(e)),
        this.sidebarViews.add(e),
        this.reportCodexViewVisibility());
      let { webview: o } = e;
      (await this.initializeWebview(o, "sidebar", e.onDidDispose),
        this.subscriptions.push(
          e.onDidDispose(() => {
            (this.sidebarViews.delete(e),
              this.readySidebarViews.delete(e),
              this.reportCodexViewVisibility(),
              this.clearPendingRequestsForWebview(o),
              this.disposeClientCoordinationForWebview(o),
              this.workerBusMessageHandler.unregisterWebview(o),
              this.sidebarView === e &&
                ((this.sidebarView =
                  Array.from(this.sidebarViews).find((i) => i.visible) ??
                  this.sidebarViews.values().next().value),
                (this.sidebarWebviewReady =
                  this.sidebarView != null && this.readySidebarViews.has(this.sidebarView))),
              this.focusedView?.kind === "sidebar" &&
                (this.focusedView = this.getActivePanelFocusedView() ?? void 0));
          }),
        ),
        this.subscriptions.push(
          e.onDidChangeVisibility(() => {
            (ze.commands.executeCommand("setContext", "chatgpt.sidebarView.visible", e.visible),
              this.reportCodexViewVisibility(),
              !e.visible &&
                this.focusedView?.kind === "sidebar" &&
                (this.focusedView = this.getActivePanelFocusedView() ?? void 0));
          }),
        ));
    }
    triggerNewChatViaWebview() {
      let e = this.composerHandoff.takeChatPrefill(),
        n = {
          type: "new-chat",
          chatGptPrefill:
            e?.chatGptSystemHints == null
              ? void 0
              : { systemHints: e.chatGptSystemHints, text: e.text },
        };
      if (this.sidebarView && this.sidebarWebviewReady) {
        this.postMessageToWebview(this.sidebarView.webview, n);
        return;
      }
      this.pendingSidebarMessages.push(n);
    }
    reportEphemeralGenerationTokenUsage(e) {
      let r = { type: "ephemeral-generation-token-usage", usage: e };
      if (this.focusedView?.kind === "panel") {
        this.sendMessageToPanel(this.focusedView.panel, r);
        return;
      }
      if (this.sidebarView && this.sidebarWebviewReady) {
        this.postMessageToSidebar(r);
        return;
      }
      this.pendingSidebarMessages.push(r);
    }
    reportAppEntryReceipt(e) {
      let r = { type: "desktop-app-entry-received", receipt: e },
        n = this.getReadySidebarView();
      if (n) {
        this.postMessageToWebview(n.webview, r);
        return;
      }
      this.pendingSidebarMessages.push(r);
    }
    postMessageToWebview(e, r) {
      if (r.type === "mcp-notification") {
        this.chunkedMessageSender.send(e, r);
        return;
      }
      this.chunkedMessageSender.sendInline(e, r);
    }
    openCustomDocument(e, r, n) {
      return new rX(e);
    }
    async resolveCustomEditor(e, r, n) {
      let o = gL(e.uri);
      if (o == null) throw new Error(`Invalid Codex conversation URI: ${e.uri.toString()}`);
      let { conversationId: i } = o,
        s = null,
        a = null;
      if (i != null)
        try {
          let { summary: l } = await this.conversationSummaryProvider.getConversationSummary(i);
          ((s = l.preview), (a = l.modelProvider));
        } catch (l) {
          this.logger.error("Error fetching conversation summary", {
            safe: { error: l },
            sensitive: {},
          });
        }
      ((r.title = h4e(s)),
        (r.iconPath = {
          light: ze.Uri.joinPath(this.extensionUri, "resources", "blossom-black.svg"),
          dark: ze.Uri.joinPath(this.extensionUri, "resources", "blossom-white.svg"),
        }),
        i != null &&
          this.chatSessionItemProvider?.registerPendingConversation(
            { conversationId: i, resource: e.uri, label: s ?? void 0, modelProvider: a },
            { markInProgress: !1, onlyIfMissing: !0 },
          ),
        this.editorPanels.set(r, { ready: !1, pendingMessages: [], initialRoute: o.path }),
        i != null && this.registerOnDidDisposeForWebviewPanel(r, i),
        await this.initializeWebview(r.webview, "panel", r.onDidDispose, () => {
          this.onPanelReady(r);
        }),
        i != null &&
          this.previewLoader.fetchConversationPreviews().then((l) => {
            let c = l.get(i);
            this.isPanelAlive(r) && (r.title = h4e(c));
          }));
    }
    registerOnDidDisposeForWebviewPanel(e, r = null) {
      this.subscriptions.push(
        e.onDidDispose(() => {
          let n = this.getWebviewForPanel(e);
          (this.clearPendingRequestsForWebview(n),
            n &&
              (this.disposeClientCoordinationForWebview(n),
              this.workerBusMessageHandler.unregisterWebview(n)),
            this.removePanel(e),
            r && this.chatSessionItemProvider?.clearPendingConversation(r),
            this.focusedView?.kind === "panel" &&
              this.focusedView.panel === e &&
              (this.focusedView =
                this.getActivePanelFocusedView() ??
                (this.sidebarView?.visible ? { kind: "sidebar" } : void 0)));
        }),
      );
    }
    addContextFile(e) {
      let r = { type: "add-context-file", file: e },
        n = this.focusedView;
      if (n?.kind === "panel" && this.isPanelAlive(n.panel)) {
        this.sendMessageToPanel(n.panel, r);
        return;
      }
      this.sidebarView && this.sidebarWebviewReady
        ? this.postMessageToWebview(this.sidebarView.webview, r)
        : this.pendingContextFiles.push(r);
    }
    navigateToRoute(e, r) {
      let n = { type: "navigate-to-route", path: e, state: r };
      this.sidebarView && this.sidebarWebviewReady
        ? this.postMessageToWebview(this.sidebarView.webview, n)
        : this.pendingNavigationRoutes.push({ path: e, state: r });
    }
    async broadcastAppConnectOAuthCallback(e) {
      await this.ipcClient.sendBroadcast("app-connect-oauth-callback-received", {
        fullRedirectUrl: e,
      });
    }
    postMessageToSidebar(e) {
      this.sidebarView && this.postMessageToWebview(this.sidebarView.webview, e);
    }
    getReadySidebarView() {
      let e = [...(this.sidebarView ? [this.sidebarView] : []), ...this.sidebarViews];
      return (
        e.find((r) => r.visible && this.readySidebarViews.has(r)) ??
        e.find((r) => this.readySidebarViews.has(r))
      );
    }
    reportCodexViewVisibility() {
      this.onCodexViewVisibilityChanged(Array.from(this.sidebarViews).some((e) => e.visible));
    }
    broadcastToAllViews(e, r) {
      let n = this.sidebarView?.webview;
      (n && n !== r
        ? this.sidebarWebviewReady
          ? this.postMessageToSidebar(e)
          : this.pendingSidebarMessages.push(e)
        : n || this.pendingSidebarMessages.push(e),
        this.broadcastToPanels(e, r));
    }
    broadcastThreadProjectMemberships(e) {
      this.broadcastToAllViews({ type: "thread-project-memberships-updated", memberships: e });
    }
    removePanel(e) {
      (this.editorPanels.delete(e),
        this.diffPanel?.currentPanel === e && (this.diffPanel = void 0),
        this.planSummaryPanel?.currentPanel === e && (this.planSummaryPanel = void 0),
        this.settingsPanel?.currentPanel === e && (this.settingsPanel = void 0));
    }
    clearPendingRequestsForWebview(e) {
      if (e)
        for (let [r, n] of this.pendingMcpRequests.entries())
          n === e &&
            (this.pendingMcpRequests.delete(r), this.codexMcpConnection.abandonRequest(yR, r));
    }
    registerClientCoordinationForWebview(e, r, n) {
      if (this.clientCoordinationByWebview.has(e)) return;
      let o = Kze(e, (a) => this.createClientCoordinationSession(e, a, n)),
        i,
        s = {
          dispose: () => {
            this.clientCoordinationByWebview.get(e) === s &&
              (this.clientCoordinationByWebview.delete(e), i?.dispose(), o.dispose());
          },
        };
      (this.clientCoordinationByWebview.set(e, s),
        (i = r(() => {
          s.dispose();
        })));
    }
    createClientCoordinationSession(e, r, n) {
      let o = new af("vscode", this.errorReporter),
        {
          appView: i,
          transport: s,
          worktreeSnapshots: a,
        } = this.registerAppHostSessionForWebview(e, r, o, n),
        l = X8({
          hostId: "local",
          ipcClient: o,
          viewService: i.services.clientCoordination,
          shouldForwardThreadReadState: async ({ hostId: u, context: p }) => {
            let m = await this.getThreadReadStateContext(u);
            return (
              m != null && m.executionHostKey === p.executionHostKey && hce(m.identity, p.identity)
            );
          },
        }),
        c = !1;
      return {
        sessionId: r,
        dispose: () => {
          c ||
            ((c = !0), l(), a?.[Symbol.dispose](), i[Symbol.dispose](), s.dispose(), o.dispose());
        },
      };
    }
    disposeClientCoordinationForWebview(e) {
      this.clientCoordinationByWebview.get(e)?.dispose();
    }
    getWebviewForPanel(e) {
      if (e)
        try {
          return e.webview;
        } catch {
          this.removePanel(e);
          return;
        }
    }
    getPanelViewColumn(e) {
      if (e)
        try {
          return e.viewColumn;
        } catch {
          this.removePanel(e);
          return;
        }
    }
    isPanelAlive(e) {
      return !e || !this.editorPanels.has(e) ? !1 : this.getWebviewForPanel(e) != null;
    }
    setFocusedViewForWebview(e) {
      if (this.sidebarView?.webview === e) {
        this.focusedView = { kind: "sidebar" };
        return;
      }
      let r = this.findPanelByWebview(e);
      if (r) {
        if (r === this.diffPanel || r === this.planSummaryPanel) return;
        this.focusedView = { kind: "panel", panel: r };
      }
    }
    findPanelByWebview(e) {
      for (let r of Array.from(this.editorPanels.keys())) {
        let n = this.getWebviewForPanel(r);
        if (n && n === e) return r;
      }
    }
    async initializeWebview(e, r, n, o) {
      let i = ze.Uri.joinPath(this.extensionUri, "webview");
      e.options = { enableScripts: !0, enableCommandUris: !1, localResourceRoots: [i] };
      let s = new E2((l) => {
        (this.logger.error("Webview renderer did not become ready", {
          safe: {
            stage: "renderer",
            reason: "renderer_ready_timeout",
            role: r,
            extensionVersion: this.extensionVersion,
            ...l,
          },
          sensitive: {},
        }),
          (e.html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none';" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Codex could not start</title>
  </head>
  <body>
    <h1>Codex could not start</h1>
    <p>The extension could not start its user interface.</p>
  </body>
</html>`),
          ze.window.showErrorMessage("Codex could not start its user interface."));
      });
      (this.registerClientCoordinationForWebview(e, n, s),
        this.workerBusMessageHandler.registerWebview(e));
      let a = e.onDidReceiveMessage((l) => {
        if ((s.markMessageReceived(), l.type === "chunked-message-ack")) {
          let c = q4t.safeParse(l);
          if (!c.success) return;
          this.chunkedMessageSender.acknowledge(e, c.data.transferId, c.data.sequence);
          return;
        }
        if (l.type === "ready") {
          if (r === "sidebar") {
            let u = Array.from(this.sidebarViews).find((p) => p.webview === e);
            if (
              (u &&
                (this.readySidebarViews.add(u),
                this.sidebarView === u && (this.sidebarWebviewReady = !0)),
              this.pendingImplementTodo &&
                (this.postMessageToWebview(e, {
                  type: "implement-todo",
                  ...this.pendingImplementTodo,
                }),
                (this.pendingImplementTodo = null)),
              this.pendingContextFiles.length > 0)
            ) {
              for (let p of this.pendingContextFiles) this.postMessageToWebview(e, p);
              this.pendingContextFiles = [];
            }
            if (this.pendingNavigationRoutes.length > 0) {
              for (let { path: p, state: m } of this.pendingNavigationRoutes)
                this.postMessageToWebview(e, { type: "navigate-to-route", path: p, state: m });
              this.pendingNavigationRoutes = [];
            }
            if (this.pendingSidebarMessages.length > 0) {
              for (let p of this.pendingSidebarMessages) this.postMessageToWebview(e, p);
              this.pendingSidebarMessages = [];
            }
          }
          let c = this.getChatFontSettings();
          (this.sendChatFontSettings(e, c),
            this.postMessageToWebview(e, {
              ...ex("local", "stdio", this.codexMcpConnection.getAppServerVersion(), null),
              isSnapshot: !0,
            }),
            this.sendCustomPrompts(e),
            this.sendPersistedAtomState(e),
            this.postMessageToWebview(e, {
              type: "request-user-input-auto-resolution-snapshot",
              hostId: "local",
              pendingRequests: this.codexMcpConnection.getRequestUserInputAutoResolutionSnapshot(),
            }),
            o?.(),
            this.fatalError &&
              this.postMessageToWebview(e, {
                type: "codex-app-server-fatal-error",
                hostId: "local",
                errorMessage: this.fatalError.message,
                cliErrorMessage: this.mostRecentErrorLog,
              }));
        }
        this.handleMessage(e, l);
      });
      (this.subscriptions.push(
        a,
        n(() => {
          (s.dispose(), this.chunkedMessageSender.dispose(e));
        }),
      ),
        (e.html = await R2(this.extensionUri, e, this.webviewMetaTags(e))),
        s.start());
    }
    onPanelReady(e) {
      let r = this.editorPanels.get(e);
      if (!r) return;
      r.ready = !0;
      let n = this.getWebviewForPanel(e);
      if (!n) return;
      let o = r.pendingMessages;
      r.pendingMessages = [];
      for (let i of o) this.postMessageToWebview(n, i);
    }
    sendMessageToPanel(e, r) {
      let n = this.editorPanels.get(e);
      if (!n) return;
      let o = this.getWebviewForPanel(e);
      o && (n.ready ? this.postMessageToWebview(o, r) : n.pendingMessages.push(r));
    }
    broadcastToPanels(e, r) {
      for (let [n, o] of Array.from(this.editorPanels.entries())) {
        let i = this.getWebviewForPanel(n);
        if (!(!i || i === r)) {
          if (!o.ready) {
            o.pendingMessages.push(e);
            continue;
          }
          this.postMessageToWebview(i, e);
        }
      }
    }
    getChatFontSettings() {
      let e = ze.workspace.getConfiguration("chat"),
        r = e.get("fontSize"),
        n = typeof r == "number" ? r : null,
        o = e.get("editor.fontSize");
      return { chatFontSize: n, chatCodeFontSize: typeof o == "number" ? o : null };
    }
    sendChatFontSettings(e, r) {
      e &&
        this.postMessageToWebview(e, {
          type: "chat-font-settings",
          chatFontSize: r.chatFontSize,
          chatCodeFontSize: r.chatCodeFontSize,
        });
    }
    broadcastChatFontSettings() {
      let e = this.getChatFontSettings();
      this.sendChatFontSettings(this.sidebarView?.webview, e);
      for (let r of Array.from(this.editorPanels.keys())) {
        let n = this.getWebviewForPanel(r);
        this.sendChatFontSettings(n, e);
      }
    }
    async sendCustomPrompts(e) {
      if (!e) return;
      let r = await YGe();
      this.postMessageToWebview(e, { type: "custom-prompts-updated", prompts: r });
    }
    async readPersistedAtomState() {
      let e = await this.globalState.get(J.PERSISTED_ATOM_STATE);
      return !e || typeof e != "object" ? {} : e;
    }
    async sendPersistedAtomState(e) {
      let r = await this.readPersistedAtomState();
      this.postMessageToWebview(e, { type: "persisted-atom-sync", state: r });
    }
    broadcastPersistedAtomUpdate(e, r) {
      let n = r === void 0;
      this.broadcastToAllViews({
        type: "persisted-atom-updated",
        key: e,
        value: n ? null : r,
        deleted: n,
      });
    }
    getActivePanelFocusedView() {
      for (let e of Array.from(this.editorPanels.keys()))
        if (this.isPanelAlive(e) && e.active) return { kind: "panel", panel: e };
    }
    async createEditorPanel(e) {
      let r = ze.Uri.joinPath(this.extensionUri, "webview"),
        n = ze.window.createWebviewPanel(
          t.panelViewType,
          e?.title ?? y4e,
          {
            viewColumn:
              e?.viewColumn ?? ze.window.activeTextEditor?.viewColumn ?? ze.ViewColumn.Active,
            preserveFocus: e?.preserveFocus ?? !1,
          },
          { enableScripts: !0, retainContextWhenHidden: !0, localResourceRoots: [r] },
        );
      return (
        this.editorPanels.set(n, { ready: !1, pendingMessages: [], initialRoute: e?.initialRoute }),
        this.registerOnDidDisposeForWebviewPanel(n),
        await this.initializeWebview(n.webview, "panel", n.onDidDispose, () => {
          this.onPanelReady(n);
        }),
        n
      );
    }
    async ensurePrimaryEditorPanel() {
      return (
        Array.from(this.editorPanels.keys()).find((r) => this.isPanelAlive(r)) ??
        this.createEditorPanel()
      );
    }
    async ensurePanel(e, r, n) {
      return this.isPanelAlive(r.currentPanel)
        ? r.currentPanel
        : (r.currentPanelPromise ||
            ((r.owner = void 0),
            (r.currentPanelPromise = (async () => {
              try {
                let o = await this.createEditorPanel({
                  viewColumn: n,
                  title: r.title,
                  initialRoute: e,
                });
                return ((r.currentPanel = o), o);
              } finally {
                r.currentPanelPromise = void 0;
              }
            })())),
          r.currentPanelPromise);
    }
    async handleMessage(e, r) {
      switch (r.type) {
        case "codexx-chat-manager":
          await require("./chat-manager-host.cjs").handle(this, e, r);
          break;
        case "ready":
        case "request-app-server-state":
          break;
        case "persisted-atom-sync-request": {
          await this.sendPersistedAtomState(e);
          break;
        }
        case "persisted-atom-update": {
          await this.globalState.updatePersistedAtomValue(
            r.key,
            r.deleted ? void 0 : r.value,
            r.recordUpdate,
          );
          break;
        }
        case "persisted-atom-reset": {
          await this.globalState.resetPersistedAtoms();
          break;
        }
        case "browser-sidebar-webview-destroyed":
          break;
        case "inbox-item-set-read-state":
        case "inbox-automation-runs-mark-all-read":
        case "inbox-items-create":
          break;
        case "local-thread-activity-changed":
          break;
        case "subagent-thread-full-fidelity-changed":
          break;
        case "app-shell-shortcut-state-changed":
        case "electron-window-zoom-changed":
        case "keyboard-layout-map-changed":
          break;
        case "browser-sidebar-runtime-close-comment-preview":
        case "browser-sidebar-runtime-open-comment-preview":
        case "global-dictation-enabled-changed":
        case "global-dictation-force-lock-changed":
          break;
        case "browser-sidebar-comment-overlay-close":
        case "browser-sidebar-comment-overlay-delete":
        case "browser-sidebar-comment-overlay-mounted":
        case "browser-sidebar-comment-overlay-preview-open-changed":
        case "browser-sidebar-comment-overlay-design-scrub-changed":
        case "browser-sidebar-comment-overlay-annotation-selection-hover-state":
        case "browser-sidebar-comment-overlay-annotation-selection-modifier-state":
        case "browser-sidebar-comment-overlay-annotation-selection-pointer-state":
        case "browser-sidebar-comment-overlay-remove-annotation-selection":
        case "browser-sidebar-comment-overlay-submit":
        case "browser-sidebar-comment-overlay-tweaks-open-changed":
        case "browser-sidebar-design-overlay-add":
        case "browser-sidebar-design-overlay-delete":
        case "browser-sidebar-design-overlay-update":
        case "browser-sidebar-runtime-cancel-editor":
        case "browser-sidebar-runtime-design-modifier-state":
        case "browser-sidebar-runtime-annotation-selection-modifier-state":
        case "browser-sidebar-runtime-annotation-suspension":
        case "browser-sidebar-attach-dragged-image":
        case "browser-sidebar-runtime-exit-comment-mode":
        case "browser-sidebar-runtime-toggle-annotation-mode":
        case "browser-sidebar-runtime-request-annotation-permission":
        case "browser-sidebar-command":
        case "open-browser-tab":
        case "browser-sidebar-runtime-focus-editor":
        case "browser-sidebar-runtime-image-drag-ended":
        case "browser-sidebar-runtime-image-drag-started":
        case "browser-sidebar-runtime-mouse-navigation":
        case "browser-sidebar-runtime-open-design-editor":
        case "browser-sidebar-runtime-open-editor":
        case "browser-sidebar-runtime-comment-screenshot-ready":
        case "browser-sidebar-runtime-update-anchor":
        case "browser-settings-webview-mounted":
        case "browser-settings-webview-theme-changed":
        case "browser-settings-webview-unmounted":
        case "browser-sidebar-sync":
          break;
        case "browser-use-session-route-capture":
        case "browser-use-cursor-arrived":
        case "browser-use-session-activity-ended":
        case "browser-sidebar-owner-sync":
          break;
        case "heartbeat-automation-thread-state-changed":
          break;
        case "archive-thread":
          break;
        case "avatar-overlay-element-size-changed":
        case "avatar-overlay-drag-end":
        case "avatar-overlay-drag-move":
        case "avatar-overlay-drag-release":
        case "avatar-overlay-drag-start":
        case "avatar-overlay-close":
        case "avatar-overlay-hide":
        case "avatar-overlay-open":
        case "avatar-overlay-open-state-request":
        case "avatar-overlay-keyboard-interaction-changed":
        case "avatar-overlay-pointer-interaction-changed":
        case "mac-menu-bar-enabled-changed":
        case "debug-run-eval-control-request":
        case "debug-run-eval-control-response":
        case "debug-window-client-analytics-history-changed":
        case "debug-window-origin-conversation-changed":
        case "dynamic-tools-for-thread-start-response":
        case "open-codex-bundle":
        case "quit-app":
        case "reload-bundled-plugins":
        case "set-primary-runtime-install-release":
        case "toggle-trace-recording":
        case "tray-menu-threads-changed":
          break;
        case "unarchive-thread":
        case "power-save-blocker-set":
          break;
        case "codex-app-server-restart": {
          ze.commands.executeCommand("workbench.action.reloadWindow");
          break;
        }
        case "view-focused": {
          this.setFocusedViewForWebview(e);
          break;
        }
        case "checkout-webview-presentation-changed":
        case "workspace-settings-webview-presentation-changed":
        case "electron-window-focus-request":
          break;
        case "electron-avatar-overlay-feedback-diagnostics-changed":
        case "electron-avatar-overlay-restore-ready":
          break;
        case "electron-sparkle-gates-changed":
          break;
        case "remote-hosted-pip-active-thread-changed":
        case "remote-hosted-pip-host-layout-changed":
          break;
        case "electron-desktop-features-changed":
          break;
        case "browser-sidebar-tweaks-enabled-changed":
        case "browser-sidebar-annotation-multi-select-enabled-changed":
        case "browser-sidebar-site-annotation-api-enabled-changed":
          break;
        case "open-in-main-window":
        case "open-browser-in-main-window":
        case "open-current-main-window":
        case "open-in-new-window":
        case "global-dictation-pet-renderer-ready":
        case "global-dictation-renderer-ready":
        case "global-dictation-stop-requested":
        case "global-dictation-pointer-interaction-changed":
        case "global-dictation-recording-stopped":
        case "global-dictation-dismiss":
        case "global-dictation-close":
        case "global-dictation-completed":
        case "global-dictation-record-history-item":
        case "global-dictation-in-app-started":
        case "global-dictation-failed":
          break;
        case "mcp-request": {
          if (G4(r.request)) {
            this.postMessageToWebview(e, {
              type: "mcp-request-delivery",
              hostId: r.hostId,
              update: {
                type: "failed",
                delivery: { requestId: r.request.id, method: r.request.method, stage: "not-sent" },
                message: "User-message admission requires the durable Electron host",
              },
            });
            break;
          }
          let { id: n, method: o, params: i } = r.request;
          (this.pendingMcpRequests.set(String(n), e),
            this.codexMcpConnection.sendRequest(yR, String(n), o, i, r.retainResponse));
          break;
        }
        case "thread-prewarm-start": {
          let { id: n, params: o } = r.request;
          (this.pendingMcpRequests.set(String(n), e),
            this.codexMcpConnection.prewarmThreadStart(yR, String(n), o, r.retainResponse));
          break;
        }
        case "mcp-request-abandon": {
          (this.pendingMcpRequests.delete(String(r.requestId)),
            this.codexMcpConnection.abandonRequest(yR, String(r.requestId)));
          break;
        }
        case "mcp-notification": {
          let { method: n, params: o } = r.request;
          this.codexMcpConnection.sendNotification(n, o);
          break;
        }
        case "mcp-response": {
          let { id: n, result: o } = r.response;
          this.codexMcpConnection.sendResponse(n, o);
          break;
        }
        case "open-in-browser": {
          ze.env.openExternal(ze.Uri.parse(r.url));
          break;
        }
        case "navigate-in-new-editor-tab": {
          let n = yL(r.path);
          if (!r.replaceCurrentEditor) {
            ze.commands.executeCommand("vscode.open", n);
            break;
          }
          let o = this.findPanelByWebview(e);
          (await ze.commands.executeCommand("vscode.open", n, {
            preview: !1,
            viewColumn: this.getPanelViewColumn(o),
          }),
            o != null && this.isPanelAlive(o) && o.dispose());
          break;
        }
        case "open-vscode-command": {
          ze.commands.executeCommand(r.command, ...(r.args ?? []));
          break;
        }
        case "worker-request":
        case "worker-request-cancel": {
          await this.workerBusMessageHandler.handleMessage(e, r);
          break;
        }
        case "open-extension-settings": {
          ze.commands.executeCommand("workbench.action.openSettings", "@ext:openai.chatgpt");
          break;
        }
        case "open-keyboard-shortcuts": {
          ze.commands.executeCommand("workbench.action.openGlobalKeybindings", "chatgpt");
          break;
        }
        case "open-config-toml": {
          let n = Xt(),
            o = g4e.join(n, "config.toml");
          await I2.promises.mkdir(n, { recursive: !0 });
          try {
            await I2.promises.access(o);
          } catch (i) {
            let s = i;
            if ("code" in s && s.code === "ENOENT") await I2.promises.writeFile(o, "");
            else throw i;
          }
          await ze.commands.executeCommand("vscode.open", ze.Uri.file(o));
          break;
        }
        case "set-telemetry-user": {
          let n =
            r.authMethod == null
              ? null
              : { id: r.userId ?? void 0, email: r.email ?? void 0, authMethod: r.authMethod };
          this.datadogLogger.setUserInfo(n);
          let o = n
            ? { id: n.id, authMethod: n.authMethod, account_id: r.accountId ?? void 0 }
            : null;
          qv.setUser(o);
          break;
        }
        case "show-diff": {
          this.showDiff(
            { unifiedDiff: r.unifiedDiff, conversationId: r.conversationId, cwd: r.cwd ?? null },
            e,
          );
          break;
        }
        case "show-plan-summary": {
          this.showPlanSummary(
            { planContent: r.planContent, conversationId: r.conversationId, hostId: r.hostId },
            e,
          );
          break;
        }
        case "show-settings": {
          this.showSettings({ section: r.section }, e);
          break;
        }
        case "update-diff-if-open": {
          this.isPanelAlive(this.diffPanel?.currentPanel) &&
            this.diffPanel?.owner === e &&
            this.sendMessageToPanel(this.diffPanel, {
              type: "navigate-to-route",
              path: "/diff",
              state: { unifiedDiff: r.unifiedDiff, conversationId: r.conversationId ?? null },
            });
          break;
        }
        case "fetch": {
          let n = await this.fetchWrapper.fetch(r, { originWebview: e });
          this.postMessageToWebview(e, n);
          break;
        }
        case "cancel-fetch": {
          this.fetchWrapper.cancel(r.requestId, e);
          break;
        }
        case "log-message": {
          let { level: n, message: o } = r;
          if (!g9(n)) break;
          he().log(n, o, r.tags);
          break;
        }
        case "electron-app-state-snapshot-trigger":
        case "electron-app-state-snapshot-response":
          break;
        case "electron-set-window-mode":
          break;
        case "electron-pick-workspace-root-option":
          throw Error("electron-pick-workspace-root-option is not supported by the extension");
        case "electron-onboarding-skip-workspace":
          throw Error("electron-onboarding-skip-workspace is not supported by the extension");
        case "electron-add-new-workspace-root-option":
          throw Error("electron-add-new-workspace-root-option is not supported by the extension");
        case "electron-create-new-workspace-root-option":
          throw Error(
            "electron-create-new-workspace-root-option is not supported by the extension",
          );
        case "electron-update-workspace-root-options":
          throw Error("electron-update-workspace-root-options is not supported by the extension");
        case "electron-set-badge-count":
          break;
      }
    }
    webviewMetaTags(e) {
      let r = [],
        n = this.findPanelByWebview(e);
      if (n) {
        let o = this.initialRouteMetaTag(n);
        o != null && r.push(o);
      }
      return (
        r.push(`<meta name="${gge}" content="${ia(this.extensionVersion)}">`),
        r.push(`<meta name="${yge}" content="${ia(this.codexAppSessionId)}">`),
        r.push(`<meta name="${vge}" content="${ia(this.buildFlavor)}">`),
        r.join(`
`)
      );
    }
    initialRouteMetaTag(e) {
      let n = this.editorPanels.get(e)?.initialRoute ?? null;
      return n ? `<meta name="initial-route" content="${ia(n)}">` : null;
    }
    dispose() {
      (this.composerHandoff.dispose(),
        this.commentAttachments.dispose(),
        this.modelReviewComments.dispose());
      for (let { dispose: r } of this.clientCoordinationByWebview.values()) r();
      (this.clientCoordinationByWebview.clear(),
        this.datadogLogger.flushNow(),
        this.subscriptions.forEach((r) => {
          r.dispose();
        }),
        this.isPanelAlive(this.diffPanel?.currentPanel) && this.diffPanel.dispose(),
        this.isPanelAlive(this.planSummaryPanel?.currentPanel) && this.planSummaryPanel.dispose());
      let e = this.settingsPanel?.currentPanel;
      (e && this.isPanelAlive(e) && e.dispose(),
        (this.diffPanel = void 0),
        (this.planSummaryPanel = void 0),
        (this.settingsPanel = void 0),
        this.editorPanels.clear(),
        (this.focusedView = void 0));
    }
    async getThreadReadStateContext(e) {
      if (e !== "local") return null;
      let r = await aDe(
        () => this.authTokenProvider.getAuthStatus({ refreshToken: !1 }),
        (n) => {
          let o = this.codexMcpConnection.registerInternalNotificationHandler((i) => {
            i.method === "account/updated" && n();
          });
          return () => {
            o.dispose();
          };
        },
      );
      return r == null
        ? null
        : {
            identity: r,
            executionHostKey: iDe({ id: "local", kind: "local", display_name: "Local" }),
          };
    }
    registerAppHostSessionForWebview(e, r, n, o) {
      let i = this.appServerClient.isLocal ? m4e(this.gitManager, this.appServerClient) : void 0,
        s = new LL(this.appServerClient),
        a = new A2(e, r);
      return {
        appView: new Mve(
          a,
          new TL({
            worktreeSnapshots: i,
            microphoneCapture: this.microphoneCapture,
            copilot: new ML(this.modelProxyManager, this.globalState),
            ideOnboarding: new FL(this.globalState),
            httpFetch: new Wk((c, u, p) => this.fetchWrapper.fetchHttp(c, u, p)),
            websitePreviews: new _0(fetch),
            appInfo: cHe(),
            nativeApplications:
              process.platform === "darwin" || process.platform === "win32"
                ? { getByBundleId: X$e }
                : void 0,
            commandKeybindings: new IL(),
            fastModeEstimates:
              ze.env.remoteName == null || ze.env.remoteName === "wsl"
                ? new DN(() => Xt())
                : void 0,
            connectorOAuth: {
              getCallbackUrl: async () =>
                ze.Uri.from({
                  scheme: ze.env.uriScheme,
                  authority: "openai.chatgpt",
                  path: "/connector/oauth_callback",
                }).toString(!0),
            },
            mailProvider: new AL(),
            customAgents: new O0(() => ({ preferWsl: !1, appServerClient: this.appServerClient })),
            workbench: {
              setContext: async ({ key: c, value: u }) => {
                await ze.commands.executeCommand("setContext", c, u);
              },
            },
            agentInstructions: new VA(() => ({
              preferWsl: !1,
              appServerClient: this.appServerClient,
            })),
            recommendedSkills: new UL(() => ({
              preferWsl: !1,
              appServerClient: this.appServerClient,
            })),
            executionPaths: s,
            hostAuthentication: new BL(),
            projectCatalog: this.projectCatalog,
            workspaceRoots: new P2(this.appServerClient, this.workspaceStoragePath),
            runtimeInfo: new GL(),
            permissionPolicy: new zA(() => s.readHomeDirectory()),
            accountInfo: new CL(this.authTokenProvider),
            worktreeComposerEducation: this.worktreeComposerEducation,
            settings: this.settings,
            applicationState: this.globalStateService,
            commentAttachments: this.commentAttachments,
            queuedSendLocks: this.queuedSendLocks,
            queuedFollowUps: new $L(this.globalState),
            modelReviewComments: this.modelReviewComments,
            projectPresentation: new RL(
              (c) => this.globalState.get(c),
              async (c) => {
                (await this.globalState.update(J.PINNED_PROJECT_IDS, c),
                  this.broadcastToAllViews({
                    type: "global-state-updated",
                    keys: [J.PINNED_PROJECT_IDS],
                  }));
              },
            ),
            threadProjectAssignments: this.threadProjectAssignments,
            clientCoordination: new PL(n, this.getLocalIdeContext, (c) =>
              this.getThreadReadStateContext(c),
            ),
            clipboard: {
              readText: async () => ze.env.clipboard.readText(),
              writeText: async (c) => {
                await ze.env.clipboard.writeText(c);
              },
            },
            composerHandoff: this.composerHandoff,
            computerUseSettings: this.computerUseSettings,
            customAvatars: this.customAvatars.rpc,
            repositoryOrigins: new qL(this.gitManager, this.appServerClient),
            fileAttachments: {
              pickFiles: qHe,
              countFolderFiles: ({ folderPath: c }) => p$e(c, this.appServerClient),
            },
            openIn: this.openIn,
            gitRepository: new KA({
              mergeBase: ({ gitRoot: c, baseBranch: u }, p) =>
                Xr({ requestKind: "git-merge-base", source: p }, async () => {
                  let m = c ?? ze.workspace.workspaceFolders?.[0]?.uri.fsPath;
                  if (!m) return { mergeBaseSha: null };
                  let f = await this.gitManager.getWorktreeRepository(m, this.appServerClient);
                  return { mergeBaseSha: f != null ? await ll(f, u) : null };
                }),
              push: (c, u, p) =>
                Xr({ requestKind: "git-push", source: u }, () =>
                  hA(c, this.gitManager, this.appServerClient, p),
                ),
              createBranch: (c, u, p) =>
                Xr({ requestKind: "create-branch", source: u }, () =>
                  pA(c, this.gitManager, this.appServerClient, p),
                ),
              checkoutBranch: (c, u, p) =>
                Xr({ requestKind: "checkout-branch", source: u }, () =>
                  En(c, this.gitManager, this.appServerClient, { signal: p }),
                ),
            }),
            gitFiles: z1e(this.gitManager, this.appServerClient),
            github: new UN(ZN(this.gitManager, () => this.appServerClient)),
            threadMetadataGeneration: this.threadMetadataGeneration,
            gitMessageGeneration: this.gitMessageGeneration,
            threadConfiguration: this.threadConfiguration,
            workspaceFiles: this.workspaceFileService,
            requestUserInputAutoResolution: {
              snooze: ({ conversationId: c, requestId: u }) => {
                this.codexMcpConnection.snoozeRequestUserInputAutoResolution(c, u);
              },
            },
            startup: { reach: (c) => o.handleStartupPhase(c) },
          }),
        ).getRemoteMain(),
        transport: a,
        worktreeSnapshots: i,
      };
    }
    async showDiff(e, r) {
      (this.diffPanel == null && (this.diffPanel = new vR("Codex Diff")),
        this.showPanel(
          "/diff",
          {
            unifiedDiff: e.unifiedDiff,
            conversationId: e.conversationId ?? null,
            cwd: e.cwd ?? null,
          },
          this.diffPanel,
          r,
        ));
    }
    async showPlanSummary(e, r) {
      (this.planSummaryPanel == null && (this.planSummaryPanel = new vR("Codex Plan")),
        this.showPanel("/plan-summary", e, this.planSummaryPanel, r));
    }
    async showSettings(e, r) {
      (this.settingsPanel == null && (this.settingsPanel = new vR("Codex Settings")),
        this.showPanel(`/settings/${e.section}`, e, this.settingsPanel, r));
    }
    async showPanel(e, r, n, o) {
      let i = o ?? this.sidebarView?.webview;
      if (!i) {
        let u = await this.ensurePrimaryEditorPanel(),
          p = this.getPanelViewColumn(u) ?? ze.ViewColumn.Active,
          m = this.getWebviewForPanel(u),
          f = await this.ensurePanel(e, n, p),
          h = this.getPanelViewColumn(f) ?? this.getPanelViewColumn(u) ?? ze.ViewColumn.Active;
        (f.reveal(h),
          (n.owner = m),
          this.sendMessageToPanel(f, { type: "navigate-to-route", path: e, state: r }));
        return;
      }
      let s = this.findPanelByWebview(i),
        a = this.getPanelViewColumn(s) ?? ze.ViewColumn.Active,
        l = await this.ensurePanel(e, n, a),
        c = this.getPanelViewColumn(l) ?? this.getPanelViewColumn(s) ?? ze.ViewColumn.Active;
      (l.reveal(c),
        (n.owner = i),
        this.sendMessageToPanel(l, { type: "navigate-to-route", path: e, state: r }));
    }
    async createNewPanel() {
      let e = yL("/extension/panel/new"),
        r = ze.window.activeTextEditor?.viewColumn ?? ze.ViewColumn.Active;
      await ze.commands.executeCommand("vscode.openWith", e, t.customEditorViewType, {
        viewColumn: r,
        preserveFocus: !1,
        preview: !1,
      });
    }
    deliverMcpResponseToOrigin(e) {
      let r = String(e.id),
        n = this.pendingMcpRequests.get(r);
      if (!n) {
        this.logger.warning("Received MCP response for unknown request id", {
          safe: { requestId: r },
          sensitive: {},
        });
        return;
      }
      (this.pendingMcpRequests.delete(r),
        this.chunkedMessageSender.send(n, {
          type: "mcp-response",
          hostId: "local",
          message: { id: e.id, result: e.result, error: e.error },
        }));
    }
    async ensureRestoredConversationTabsResolved() {
      for (let e of ze.window.tabGroups.all)
        for (let r of e.tabs) {
          let n = r.input,
            o = null;
          (n instanceof ze.TabInputCustom || n instanceof ze.TabInputText
            ? (o = n.uri)
            : (o = null),
            o?.scheme === Av &&
              ze.commands.executeCommand("vscode.openWith", o, t.customEditorViewType, {
                preserveFocus: !0,
                preview: r.isPreview,
              }));
        }
    }
  },
  rX = class {
    constructor(e) {
      this.uri = e;
    }
    dispose() {}
  };
