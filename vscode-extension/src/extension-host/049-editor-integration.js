var EL = class extends ee {
    comments = new Map();
    listeners = new Map();
    append(e, r) {
      let n = this.comments.get(e) ?? [],
        o = new Set(n.map(M9)),
        i = [...n];
      for (let u of r) {
        let p = M9(u);
        o.has(p) || (o.add(p), i.push(u));
      }
      if (i.length !== n.length) {
        this.comments.set(e, i);
        for (let u of this.listeners.get(e) ?? []) {
          var s = [];
          try {
            let p = cn(s, u(i));
          } catch (a) {
            var l = a,
              c = !0;
          } finally {
            un(s, l, c);
          }
        }
      }
    }
    subscribe(e, r) {
      var a = [];
      try {
        let n = r.dup();
        let o = this.listeners.get(e);
        o == null && ((o = new Set()), this.listeners.set(e, o));
        o.add(n);
        let i = new O9(() => {
          let p = this.listeners.get(e);
          p?.delete(n) && (n[Symbol.dispose](), p.size === 0 && this.listeners.delete(e));
        });
        n.onRpcBroken(() => i.unsubscribe());
        let s = cn(a, n(this.comments.get(e) ?? []));
        return i;
      } catch (l) {
        var c = l,
          u = !0;
      } finally {
        un(a, c, u);
      }
    }
    dispose = () => {
      for (let e of this.listeners.values()) for (let r of e) r[Symbol.dispose]();
      (this.listeners.clear(), this.comments.clear());
    };
  },
  O9 = class extends ee {
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
var ze = F(require("vscode"));
$();
ot();
Pt();
$();
var tHt = d.object({
    "https://api.openai.com/auth": d
      .object({
        chatgpt_account_id: d.string().nullish(),
        chatgpt_user_id: d.string().nullish(),
        chatgpt_plan_type: d.string().nullish().catch(null),
        chatgpt_compute_residency: d.string().nullish().catch(null),
      })
      .nullish(),
    "https://api.openai.com/profile": d
      .object({ email: d.string().nullish().catch(null) })
      .nullish()
      .catch(null),
  }),
  CL = class extends ee {
    constructor(r) {
      super();
      this.authProvider = r;
    }
    async readAccountInfo() {
      let r = await this.authProvider.getToken({ refreshToken: !1 }),
        n = {
          accountId: null,
          userId: null,
          plan: null,
          email: null,
          computeResidency: null,
          hasChatGptToken: !!r,
        };
      if (r)
        try {
          let o = tHt.parse(JSON.parse(Buffer.from(r.split(".")[1], "base64url").toString("utf8"))),
            i = o["https://api.openai.com/auth"],
            s = o["https://api.openai.com/profile"];
          i?.chatgpt_account_id &&
            i.chatgpt_user_id &&
            (n = {
              accountId: i.chatgpt_account_id,
              userId: i.chatgpt_user_id,
              plan: i.chatgpt_plan_type ?? null,
              email: s?.email ?? null,
              computeResidency: i.chatgpt_compute_residency ?? null,
              hasChatGptToken: !0,
            });
        } catch {
          he().error("Unable to extract account id and plan from auth token.");
        }
      return { status: "ready", data: n };
    }
  };
ot();
var TL = class extends ee {
  #e;
  get services() {
    return this.#e;
  }
  constructor(e) {
    (super(), (this.#e = e));
  }
};
Pt();
var PL = class extends HA {
  #e;
  constructor(e, r, n) {
    (super(e, n), (this.#e = r));
  }
  getIdeContext(e) {
    return Promise.resolve(this.#e());
  }
};
ot();
Pt();
var IL = class extends ee {
  async get() {
    return YDe();
  }
  async update(e) {
    return JDe(e);
  }
  async reset() {
    return QDe();
  }
};
ot();
var kL = class extends ee {
  async getAppApprovals() {
    return null;
  }
  async removeAppApproval() {
    return null;
  }
  async searchMessagesChats() {
    return null;
  }
  async getMessagesReadDecisions() {
    return null;
  }
  async setMessagesReadAccessPolicy() {
    return null;
  }
  async setMessagesReadDecision() {
    return null;
  }
  async removeMessagesReadDecision() {
    return null;
  }
  async getMessagesSendApprovals() {
    return null;
  }
  async setMessagesSendAllowAllChats() {
    return null;
  }
  async removeMessagesSendApproval() {
    return null;
  }
  async getSoundMode() {
    return null;
  }
  async setSoundMode(e) {
    return e;
  }
  async getLockedUseState() {
    return { computerIconDataURL: null, enabled: null, lockIconDataURL: null };
  }
  async setLockedUseEnabled() {
    return null;
  }
};
O();
var LHe = "ConversationPreviewLoader",
  DL = class {
    constructor(e) {
      this.codexMcpConnection = e;
      e.registerProvider(LHe, { onResult: (r) => this.handleResult(r) });
    }
    nextRequestId = 1;
    callbacks = new Map();
    async fetchConversationPreviews() {
      let e = await this.requestThreadList(),
        r = new Map();
      for (let n of e) r.set(n.id, n.name?.trim() || n.preview);
      return r;
    }
    handleResult(e) {
      let r = this.callbacks.get(e.id);
      r && (this.callbacks.delete(e.id), r(e));
    }
    requestThreadList(e = 50) {
      let r = String(this.nextRequestId++),
        n = new Promise((i, s) => {
          this.callbacks.set(r, (a) => {
            if (a.error) {
              s(new Error(a.error.message));
              return;
            }
            if (!a.result) {
              i([]);
              return;
            }
            let l = a.result;
            i(l.data);
          });
        }),
        o = {
          limit: e,
          cursor: null,
          sortKey: "created_at",
          modelProviders: [],
          archived: !1,
          sourceKinds: ug,
          useStateDbOnly: !0,
        };
      return (this.codexMcpConnection.sendRequest(LHe, r, "thread/list", o), n);
    }
  };
ot();
O();
$();
var rHt = d.object({
    useForInference: d.boolean().optional(),
    defaultModel: d.string().optional(),
    showLoginFirst: d.boolean().optional(),
  }),
  ML = class extends ee {
    constructor(r, n) {
      super();
      this.manager = r;
      this.globalState = n;
    }
    async isAvailable() {
      return this.manager.isProxyAvailable();
    }
    async getProxyInfo() {
      let r = await this.manager.getProxy();
      return r == null ? null : { baseUrl: r.uri.toString(), secret: r.key };
    }
    async getPreferences() {
      let [r, n, o] = await Promise.all([
        this.globalState.getStored(J.USE_COPILOT_AUTH_IF_AVAILABLE),
        this.globalState.getStored(J.COPILOT_DEFAULT_MODEL),
        this.globalState.getStored(J.SHOW_COPILOT_LOGIN_FIRST),
      ]);
      return rHt.parse({ useForInference: r, defaultModel: n, showLoginFirst: o });
    }
    async setUseForInference(r) {
      try {
        return (await this.globalState.update(J.USE_COPILOT_AUTH_IF_AVAILABLE, r), { success: !0 });
      } catch {
        return { success: !1 };
      }
    }
    async setDefaultModel(r) {
      await this.globalState.update(J.COPILOT_DEFAULT_MODEL, r);
    }
    subscribePreferences(r) {
      var a = [];
      try {
        let n = r.dup();
        let o = this.globalState.onDidUpdateEntry(({ key: p }) => {
          if (
            p === J.USE_COPILOT_AUTH_IF_AVAILABLE ||
            p === J.COPILOT_DEFAULT_MODEL ||
            p === J.SHOW_COPILOT_LOGIN_FIRST
          ) {
            var m = [];
            try {
              let y = cn(m, n());
            } catch (f) {
              var h = f,
                v = !0;
            } finally {
              un(m, h, v);
            }
          }
        });
        let i = new OL(() => {
          (o.dispose(), n[Symbol.dispose]());
        });
        n.onRpcBroken(() => i.unsubscribe());
        let s = cn(a, n());
        return i;
      } catch (l) {
        var c = l,
          u = !0;
      } finally {
        un(a, c, u);
      }
    }
    subscribe(r) {
      var a = [];
      try {
        let n = r.dup();
        let o = this.manager.onDidChangeIsCopilotApiAvailable(() => {
          var m = [];
          try {
            let p = cn(m, n(this.manager.isProxyAvailable()));
          } catch (f) {
            var h = f,
              v = !0;
          } finally {
            un(m, h, v);
          }
        });
        let i = new OL(() => {
          (o.dispose(), n[Symbol.dispose]());
        });
        n.onRpcBroken(() => i.unsubscribe());
        let s = cn(a, n(this.manager.isProxyAvailable()));
        return i;
      } catch (l) {
        var c = l,
          u = !0;
      } finally {
        un(a, c, u);
      }
    }
  },
  OL = class extends ee {
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
Pt();
var NL = class {
  rpc;
  constructor(e) {
    this.rpc = {
      load: () => HMe({ appServerClient: e }),
      loadAvatar: (r) => jMe({ appServerClient: e, avatarId: r }),
    };
  }
};
var BHe = require("node:os"),
  FHe = F(require("node:path"));
ot();
Pt();
var LL = class extends ee {
  constructor(r) {
    super();
    this.executionHost = r;
  }
  async readCodexHome() {
    return Xt();
  }
  async readHomePaths() {
    let r = await this.readCodexHome(),
      n = await this.executionHost.workspacesRoot().catch(() => null);
    return {
      codexHome: r,
      workspacesRoot: n,
      worktreesSegment: n == null ? null : FHe.default.join(n, "worktrees"),
    };
  }
  async readHomeDirectory() {
    return { homeDirectory: (0, BHe.homedir)() };
  }
};
var $He = F(require("node:path"));
O();
var UHe = F(require("vscode"));
async function qHe({
  allowMultiple: t = !0,
  imagesOnly: e = !1,
  kind: r,
  acceptedFileExtensions: n,
  pickerTitle: o,
}) {
  let i;
  n?.length ? (i = { Files: n }) : e && (i = { Images: [...aH] });
  let s = await UHe.window.showOpenDialog({
    canSelectFiles: r !== "directory",
    canSelectFolders: r === "directory",
    canSelectMany: t,
    filters: i,
    title: o,
  });
  return !s || s.length === 0
    ? []
    : s.map(({ fsPath: a }) => ({ label: $He.basename(a), path: a, fsPath: a }));
}
ot();
var BL = class extends ee {
  async getEnvironmentApiKey() {
    return process.env.OPENAI_API_KEY ?? null;
  }
};
ot();
O();
$();
var FL = class extends ee {
    constructor(r) {
      super();
      this.globalState = r;
    }
    async getState() {
      return {
        completed: d
          .boolean()
          .optional()
          .parse(await this.globalState.getStored(J.NUX_2025_09_15)),
      };
    }
    async complete(r) {
      (await this.globalState.update(J.NUX_2025_09_15, !0),
        r === "chatgpt"
          ? await this.globalState.update(J.NUX_2025_09_15_FULL_CHATGPT_AUTH_VIEWED, !0)
          : r === "apiKey" &&
            (await this.globalState.update(J.NUX_2025_09_15_APIKEY_AUTH_VIEWED, !0)));
    }
    subscribe(r) {
      var a = [];
      try {
        let n = r.dup();
        let o = this.globalState.onDidUpdateEntry(({ key: p }) => {
          if (p === J.NUX_2025_09_15) {
            var m = [];
            try {
              let y = cn(m, n());
            } catch (f) {
              var h = f,
                v = !0;
            } finally {
              un(m, h, v);
            }
          }
        });
        let i = new N9(() => {
          (o.dispose(), n[Symbol.dispose]());
        });
        n.onRpcBroken(() => i.unsubscribe());
        let s = cn(a, n());
        return i;
      } catch (l) {
        var c = l,
          u = !0;
      } finally {
        un(a, c, u);
      }
    }
  },
  N9 = class extends ee {
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
wd();
xo();
ot();
O();
var $L = class extends ee {
  constructor(r) {
    super();
    this.globalState = r;
  }
  async read() {
    return { state: await this.globalState.getStored(J.QUEUED_FOLLOW_UPS) };
  }
  write(r) {
    return this.globalState.update(J.QUEUED_FOLLOW_UPS, r);
  }
};
var WHe = require("fs/promises"),
  Ev = F(require("path"));
Pt();
var UL = class extends sL {
  async list(e) {
    let r = await super.list(e);
    return (await nHt(r.skills, r.repoRoot), r);
  }
};
async function nHt(t, e) {
  if (t.length === 0) return;
  let r = t.flatMap((n) => [GHe(n, "iconSmall", e), GHe(n, "iconLarge", e)]);
  await Promise.all(r);
}
async function GHe(t, e, r) {
  let n = t[e];
  if (!n) return;
  let o = n.trim();
  if (!o) return;
  let i = o.toLowerCase();
  if (
    i.startsWith("data:") ||
    i.startsWith("http:") ||
    i.startsWith("https:") ||
    i.startsWith("file:") ||
    i.startsWith("vscode-resource:") ||
    i.startsWith("vscode-webview:") ||
    i.startsWith("vscode-file:")
  )
    return;
  let s = o;
  if (!Ev.isAbsolute(s)) {
    if (!r) return;
    s = Ev.resolve(r, t.repoPath, s);
  }
  let a = await oHt(s);
  a && (t[e] = a);
}
async function oHt(t) {
  try {
    let e = await (0, WHe.readFile)(t);
    return `data:${iHt(t)};base64,${Buffer.from(e).toString("base64")}`;
  } catch (e) {
    return (
      he().warning("Failed to inline recommended skill icon", {
        safe: {},
        sensitive: { fsPath: t, error: e },
      }),
      null
    );
  }
}
function iHt(t) {
  switch (Ev.extname(t).toLowerCase()) {
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".avif":
      return "image/avif";
    default:
      return "application/octet-stream";
  }
}
var HHe = require("node:os");
ot();
O();
Pt();
var jHe = F(require("vscode")),
  qL = class extends ee {
    constructor(r, n) {
      super();
      this.gitManager = r;
      this.executionHost = n;
    }
    async read(r, n) {
      let o = r?.dirs ?? jHe.workspace.workspaceFolders?.map((s) => s.uri.fsPath) ?? [],
        { origins: i } = await Xr({ source: n, requestKind: "git-origins" }, () =>
          FO(o.map(Oo), this.gitManager, this.executionHost),
        );
      return { origins: i, homeDir: (0, HHe.homedir)() };
    }
  };
ot();
Pt();
Sd();
var GL = class extends ee {
  async getCliInfo() {
    return { hasCustomCliExecutable: (Wn("cliExecutable") ?? "").trim().length > 0 };
  }
  async getWslBashAvailability() {
    return wwe();
  }
};
var qe = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__;
var rt = globalThis;
var ml = "10.36.0";
function mf() {
  return (ff(rt), rt);
}
function ff(t) {
  let e = (t.__SENTRY__ = t.__SENTRY__ || {});
  return ((e.version = e.version || ml), (e[ml] = e[ml] || {}));
}
function ta(t, e, r = rt) {
  let n = (r.__SENTRY__ = r.__SENTRY__ || {}),
    o = (n[ml] = n[ml] || {});
  return o[t] || (o[t] = e());
}
var L9 = ["debug", "info", "warn", "error", "log", "assert", "trace"],
  sHt = "Sentry Logger ",
  Cv = {};
function xd(t) {
  if (!("console" in rt)) return t();
  let e = rt.console,
    r = {},
    n = Object.keys(Cv);
  n.forEach((o) => {
    let i = Cv[o];
    ((r[o] = e[o]), (e[o] = i));
  });
  try {
    return t();
  } finally {
    n.forEach((o) => {
      e[o] = r[o];
    });
  }
}
function aHt() {
  F9().enabled = !0;
}
function lHt() {
  F9().enabled = !1;
}
function zHe() {
  return F9().enabled;
}
function cHt(...t) {
  B9("log", ...t);
}
function uHt(...t) {
  B9("warn", ...t);
}
function dHt(...t) {
  B9("error", ...t);
}
function B9(t, ...e) {
  qe &&
    zHe() &&
    xd(() => {
      rt.console[t](`${sHt}[${t}]:`, ...e);
    });
}
function F9() {
  return qe ? ta("loggerSettings", () => ({ enabled: !1 })) : { enabled: !1 };
}
var Te = { enable: aHt, disable: lHt, isEnabled: zHe, log: cHt, warn: uHt, error: dHt };
var fl = "?",
  VHe = /\(error: (.*)\)/,
  KHe = /captureMessage|captureException/;
function U9(...t) {
  let e = t.sort((r, n) => r[0] - n[0]).map((r) => r[1]);
  return (r, n = 0, o = 0) => {
    let i = [],
      s = r.split(`
`);
    for (let a = n; a < s.length; a++) {
      let l = s[a];
      l.length > 1024 && (l = l.slice(0, 1024));
      let c = VHe.test(l) ? l.replace(VHe, "$1") : l;
      if (!c.match(/\S*Error: /)) {
        for (let u of e) {
          let p = u(c);
          if (p) {
            i.push(p);
            break;
          }
        }
        if (i.length >= 50 + o) break;
      }
    }
    return ZHe(i.slice(o));
  };
}
function ZHe(t) {
  if (!t.length) return [];
  let e = Array.from(t);
  return (
    /sentryWrapped/.test(WL(e).function || "") && e.pop(),
    e.reverse(),
    KHe.test(WL(e).function || "") && (e.pop(), KHe.test(WL(e).function || "") && e.pop()),
    e
      .slice(0, 50)
      .map((r) => ({ ...r, filename: r.filename || WL(e).filename, function: r.function || fl }))
  );
}
function WL(t) {
  return t[t.length - 1] || {};
}
var $9 = "<anonymous>";
function gs(t) {
  try {
    return !t || typeof t != "function" ? $9 : t.name || $9;
  } catch {
    return $9;
  }
}
function HL(t) {
  let e = t.exception;
  if (e) {
    let r = [];
    try {
      return (
        e.values.forEach((n) => {
          n.stacktrace.frames && r.push(...n.stacktrace.frames);
        }),
        r
      );
    } catch {
      return;
    }
  }
}
function jL(t) {
  return "__v_isVNode" in t && t.__v_isVNode ? "[VueVNode]" : "[VueViewModel]";
}
var zL = {},
  XHe = {};
function qo(t, e) {
  ((zL[t] = zL[t] || []), zL[t].push(e));
}
function Go(t, e) {
  if (!XHe[t]) {
    XHe[t] = !0;
    try {
      e();
    } catch (r) {
      qe && Te.error(`Error while instrumenting ${t}`, r);
    }
  }
}
function Tn(t, e) {
  let r = t && zL[t];
  if (r)
    for (let n of r)
      try {
        n(e);
      } catch (o) {
        qe &&
          Te.error(
            `Error while triggering instrumentation handler.
Type: ${t}
Name: ${gs(n)}
Error:`,
            o,
          );
      }
}
var q9 = null;
function G9(t) {
  let e = "error";
  (qo(e, t), Go(e, pHt));
}
function pHt() {
  ((q9 = rt.onerror),
    (rt.onerror = function (t, e, r, n, o) {
      return (
        Tn("error", { column: n, error: o, line: r, msg: t, url: e }),
        q9 ? q9.apply(this, arguments) : !1
      );
    }),
    (rt.onerror.__SENTRY_INSTRUMENTED__ = !0));
}
var W9 = null;
function H9(t) {
  let e = "unhandledrejection";
  (qo(e, t), Go(e, mHt));
}
function mHt() {
  ((W9 = rt.onunhandledrejection),
    (rt.onunhandledrejection = function (t) {
      return (Tn("unhandledrejection", t), W9 ? W9.apply(this, arguments) : !0);
    }),
    (rt.onunhandledrejection.__SENTRY_INSTRUMENTED__ = !0));
}
var YHe = Object.prototype.toString;
function kc(t) {
  switch (YHe.call(t)) {
    case "[object Error]":
    case "[object Exception]":
    case "[object DOMException]":
    case "[object WebAssembly.Exception]":
      return !0;
    default:
      return ra(t, Error);
  }
}
function Tv(t, e) {
  return YHe.call(t) === `[object ${e}]`;
}
function QA(t) {
  return Tv(t, "ErrorEvent");
}
function VL(t) {
  return Tv(t, "DOMError");
}
function j9(t) {
  return Tv(t, "DOMException");
}
function Wo(t) {
  return Tv(t, "String");
}
function hf(t) {
  return (
    typeof t == "object" &&
    t !== null &&
    "__sentry_template_string__" in t &&
    "__sentry_template_values__" in t
  );
}
function Ad(t) {
  return t === null || hf(t) || (typeof t != "object" && typeof t != "function");
}
function hl(t) {
  return Tv(t, "Object");
}
function gf(t) {
  return typeof Event < "u" && ra(t, Event);
}
function z9(t) {
  return typeof Element < "u" && ra(t, Element);
}
function V9(t) {
  return Tv(t, "RegExp");
}
function gl(t) {
  return !!(t?.then && typeof t.then == "function");
}
function K9(t) {
  return hl(t) && "nativeEvent" in t && "preventDefault" in t && "stopPropagation" in t;
}
function ra(t, e) {
  try {
    return t instanceof e;
  } catch {
    return !1;
  }
}
function eR(t) {
  return !!(typeof t == "object" && t !== null && (t.__isVue || t._isVue || t.__v_isVNode));
}
function Z9(t) {
  return typeof Request < "u" && ra(t, Request);
}
var X9 = rt,
  fHt = 80;
function tR(t, e = {}) {
  if (!t) return "<unknown>";
  try {
    let r = t,
      n = 5,
      o = [],
      i = 0,
      s = 0,
      a = " > ",
      l = a.length,
      c,
      u = Array.isArray(e) ? e : e.keyAttrs,
      p = (!Array.isArray(e) && e.maxStringLength) || fHt;
    for (
      ;
      r &&
      i++ < n &&
      ((c = hHt(r, u)), !(c === "html" || (i > 1 && s + o.length * l + c.length >= p)));

    )
      (o.push(c), (s += c.length), (r = r.parentNode));
    return o.reverse().join(a);
  } catch {
    return "<unknown>";
  }
}
function hHt(t, e) {
  let r = t,
    n = [];
  if (!r?.tagName) return "";
  if (X9.HTMLElement && r instanceof HTMLElement && r.dataset) {
    if (r.dataset.sentryComponent) return r.dataset.sentryComponent;
    if (r.dataset.sentryElement) return r.dataset.sentryElement;
  }
  n.push(r.tagName.toLowerCase());
  let o = e?.length ? e.filter((s) => r.getAttribute(s)).map((s) => [s, r.getAttribute(s)]) : null;
  if (o?.length)
    o.forEach((s) => {
      n.push(`[${s[0]}="${s[1]}"]`);
    });
  else {
    r.id && n.push(`#${r.id}`);
    let s = r.className;
    if (s && Wo(s)) {
      let a = s.split(/\s+/);
      for (let l of a) n.push(`.${l}`);
    }
  }
  let i = ["aria-label", "type", "name", "title", "alt"];
  for (let s of i) {
    let a = r.getAttribute(s);
    a && n.push(`[${s}="${a}"]`);
  }
  return n.join("");
}
function rR() {
  try {
    return X9.document.location.href;
  } catch {
    return "";
  }
}
function Y9(t) {
  if (!X9.HTMLElement) return null;
  let e = t,
    r = 5;
  for (let n = 0; n < r; n++) {
    if (!e) return null;
    if (e instanceof HTMLElement) {
      if (e.dataset.sentryComponent) return e.dataset.sentryComponent;
      if (e.dataset.sentryElement) return e.dataset.sentryElement;
    }
    e = e.parentNode;
  }
  return null;
}
function Pn(t, e, r) {
  if (!(e in t)) return;
  let n = t[e];
  if (typeof n != "function") return;
  let o = r(n);
  typeof o == "function" && KL(o, n);
  try {
    t[e] = o;
  } catch {
    qe && Te.log(`Failed to replace method "${e}" in object`, t);
  }
}
function bi(t, e, r) {
  try {
    Object.defineProperty(t, e, { value: r, writable: !0, configurable: !0 });
  } catch {
    qe && Te.log(`Failed to add non-enumerable property "${e}" to object`, t);
  }
}
function KL(t, e) {
  try {
    let r = e.prototype || {};
    ((t.prototype = e.prototype = r), bi(t, "__sentry_original__", e));
  } catch {}
}
function yf(t) {
  return t.__sentry_original__;
}
function ZL(t) {
  if (kc(t)) return { message: t.message, name: t.name, stack: t.stack, ...QHe(t) };
  if (gf(t)) {
    let e = { type: t.type, target: JHe(t.target), currentTarget: JHe(t.currentTarget), ...QHe(t) };
    return (typeof CustomEvent < "u" && ra(t, CustomEvent) && (e.detail = t.detail), e);
  } else return t;
}
function JHe(t) {
  try {
    return z9(t) ? tR(t) : Object.prototype.toString.call(t);
  } catch {
    return "<unknown>";
  }
}
function QHe(t) {
  if (typeof t == "object" && t !== null) {
    let e = {};
    for (let r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
    return e;
  } else return {};
}
function J9(t) {
  let e = Object.keys(ZL(t));
  return (e.sort(), e[0] ? e.join(", ") : "[object has no keys]");
}
var Pv;
function Iv(t) {
  if (Pv !== void 0) return Pv ? Pv(t) : t();
  let e = Symbol.for("__SENTRY_SAFE_RANDOM_ID_WRAPPER__"),
    r = rt;
  return e in r && typeof r[e] == "function" ? ((Pv = r[e]), Pv(t)) : ((Pv = null), t());
}
function vf() {
  return Iv(() => Math.random());
}
function kv() {
  return Iv(() => Date.now());
}
function Dv(t, e = 0) {
  return typeof t != "string" || e === 0 || t.length <= e ? t : `${t.slice(0, e)}...`;
}
function XL(t, e) {
  if (!Array.isArray(t)) return "";
  let r = [];
  for (let n = 0; n < t.length; n++) {
    let o = t[n];
    try {
      eR(o) ? r.push(jL(o)) : r.push(String(o));
    } catch {
      r.push("[value cannot be serialized]");
    }
  }
  return r.join(e);
}
function Mv(t, e, r = !1) {
  return Wo(t) ? (V9(e) ? e.test(t) : Wo(e) ? (r ? t === e : t.includes(e)) : !1) : !1;
}
function Ov(t, e = [], r = !1) {
  return e.some((n) => Mv(t, n, r));
}
function gHt() {
  let t = rt;
  return t.crypto || t.msCrypto;
}
var Q9;
function yHt() {
  return vf() * 16;
}
function In(t = gHt()) {
  try {
    if (t?.randomUUID) return Iv(() => t.randomUUID()).replace(/-/g, "");
  } catch {}
  return (
    Q9 || (Q9 = "10000000100040008000" + 1e11),
    Q9.replace(/[018]/g, (e) => (e ^ ((yHt() & 15) >> (e / 4))).toString(16))
  );
}
function eje(t) {
  return t.exception?.values?.[0];
}
function yl(t) {
  let { message: e, event_id: r } = t;
  if (e) return e;
  let n = eje(t);
  return n
    ? n.type && n.value
      ? `${n.type}: ${n.value}`
      : n.type || n.value || r || "<unknown>"
    : r || "<unknown>";
}
function Nv(t, e, r) {
  let n = (t.exception = t.exception || {}),
    o = (n.values = n.values || []),
    i = (o[0] = o[0] || {});
  (i.value || (i.value = e || ""), i.type || (i.type = r || "Error"));
}
function vl(t, e) {
  let r = eje(t);
  if (!r) return;
  let n = { type: "generic", handled: !0 },
    o = r.mechanism;
  if (((r.mechanism = { ...n, ...o, ...e }), e && "data" in e)) {
    let i = { ...o?.data, ...e.data };
    r.mechanism.data = i;
  }
}
function YL(t) {
  if (vHt(t)) return !0;
  try {
    bi(t, "__sentry_captured__", !0);
  } catch {}
  return !1;
}
function vHt(t) {
  try {
    return t.__sentry_captured__;
  } catch {}
}
var rje = 1e3;
function bl() {
  return kv() / rje;
}
function bHt() {
  let { performance: t } = rt;
  if (!t?.now || !t.timeOrigin) return bl;
  let e = t.timeOrigin;
  return () => (e + Iv(() => t.now())) / rje;
}
var tje;
function Si() {
  return (tje ?? (tje = bHt()))();
}
function nje(t) {
  let e = Si(),
    r = {
      sid: In(),
      init: !0,
      timestamp: e,
      started: e,
      duration: 0,
      status: "ok",
      errors: 0,
      ignoreDuration: !1,
      toJSON: () => SHt(r),
    };
  return (t && Dc(r, t), r);
}
function Dc(t, e = {}) {
  if (
    (e.user &&
      (!t.ipAddress && e.user.ip_address && (t.ipAddress = e.user.ip_address),
      !t.did && !e.did && (t.did = e.user.id || e.user.email || e.user.username)),
    (t.timestamp = e.timestamp || Si()),
    e.abnormal_mechanism && (t.abnormal_mechanism = e.abnormal_mechanism),
    e.ignoreDuration && (t.ignoreDuration = e.ignoreDuration),
    e.sid && (t.sid = e.sid.length === 32 ? e.sid : In()),
    e.init !== void 0 && (t.init = e.init),
    !t.did && e.did && (t.did = `${e.did}`),
    typeof e.started == "number" && (t.started = e.started),
    t.ignoreDuration)
  )
    t.duration = void 0;
  else if (typeof e.duration == "number") t.duration = e.duration;
  else {
    let r = t.timestamp - t.started;
    t.duration = r >= 0 ? r : 0;
  }
  (e.release && (t.release = e.release),
    e.environment && (t.environment = e.environment),
    !t.ipAddress && e.ipAddress && (t.ipAddress = e.ipAddress),
    !t.userAgent && e.userAgent && (t.userAgent = e.userAgent),
    typeof e.errors == "number" && (t.errors = e.errors),
    e.status && (t.status = e.status));
}
function oje(t, e) {
  let r = {};
  (e ? (r = { status: e }) : t.status === "ok" && (r = { status: "exited" }), Dc(t, r));
}
function SHt(t) {
  return {
    sid: `${t.sid}`,
    init: t.init,
    started: new Date(t.started * 1e3).toISOString(),
    timestamp: new Date(t.timestamp * 1e3).toISOString(),
    status: t.status,
    errors: t.errors,
    did: typeof t.did == "number" || typeof t.did == "string" ? `${t.did}` : void 0,
    duration: t.duration,
    abnormal_mechanism: t.abnormal_mechanism,
    attrs: {
      release: t.release,
      environment: t.environment,
      ip_address: t.ipAddress,
      user_agent: t.userAgent,
    },
  };
}
function Rd(t, e, r = 2) {
  if (!e || typeof e != "object" || r <= 0) return e;
  if (t && Object.keys(e).length === 0) return t;
  let n = { ...t };
  for (let o in e) Object.prototype.hasOwnProperty.call(e, o) && (n[o] = Rd(n[o], e[o], r - 1));
  return n;
}
function eZ() {
  return In();
}
function JL() {
  return In().substring(16);
}
var tZ = "_sentrySpan";
function rZ(t, e) {
  e ? bi(t, tZ, e) : delete t[tZ];
}
function nZ(t) {
  return t[tZ];
}
var wHt = 100,
  io = class t {
    constructor() {
      ((this._notifyingListeners = !1),
        (this._scopeListeners = []),
        (this._eventProcessors = []),
        (this._breadcrumbs = []),
        (this._attachments = []),
        (this._user = {}),
        (this._tags = {}),
        (this._attributes = {}),
        (this._extra = {}),
        (this._contexts = {}),
        (this._sdkProcessingMetadata = {}),
        (this._propagationContext = { traceId: eZ(), sampleRand: vf() }));
    }
    clone() {
      let e = new t();
      return (
        (e._breadcrumbs = [...this._breadcrumbs]),
        (e._tags = { ...this._tags }),
        (e._attributes = { ...this._attributes }),
        (e._extra = { ...this._extra }),
        (e._contexts = { ...this._contexts }),
        this._contexts.flags && (e._contexts.flags = { values: [...this._contexts.flags.values] }),
        (e._user = this._user),
        (e._level = this._level),
        (e._session = this._session),
        (e._transactionName = this._transactionName),
        (e._fingerprint = this._fingerprint),
        (e._eventProcessors = [...this._eventProcessors]),
        (e._attachments = [...this._attachments]),
        (e._sdkProcessingMetadata = { ...this._sdkProcessingMetadata }),
        (e._propagationContext = { ...this._propagationContext }),
        (e._client = this._client),
        (e._lastEventId = this._lastEventId),
        rZ(e, nZ(this)),
        e
      );
    }
    setClient(e) {
      this._client = e;
    }
    setLastEventId(e) {
      this._lastEventId = e;
    }
    getClient() {
      return this._client;
    }
    lastEventId() {
      return this._lastEventId;
    }
    addScopeListener(e) {
      this._scopeListeners.push(e);
    }
    addEventProcessor(e) {
      return (this._eventProcessors.push(e), this);
    }
    setUser(e) {
      return (
        (this._user = e || { email: void 0, id: void 0, ip_address: void 0, username: void 0 }),
        this._session && Dc(this._session, { user: e }),
        this._notifyScopeListeners(),
        this
      );
    }
    getUser() {
      return this._user;
    }
    setTags(e) {
      return ((this._tags = { ...this._tags, ...e }), this._notifyScopeListeners(), this);
    }
    setTag(e, r) {
      return this.setTags({ [e]: r });
    }
    setAttributes(e) {
      return (
        (this._attributes = { ...this._attributes, ...e }),
        this._notifyScopeListeners(),
        this
      );
    }
    setAttribute(e, r) {
      return this.setAttributes({ [e]: r });
    }
    removeAttribute(e) {
      return (
        e in this._attributes && (delete this._attributes[e], this._notifyScopeListeners()),
        this
      );
    }
    setExtras(e) {
      return ((this._extra = { ...this._extra, ...e }), this._notifyScopeListeners(), this);
    }
    setExtra(e, r) {
      return ((this._extra = { ...this._extra, [e]: r }), this._notifyScopeListeners(), this);
    }
    setFingerprint(e) {
      return ((this._fingerprint = e), this._notifyScopeListeners(), this);
    }
    setLevel(e) {
      return ((this._level = e), this._notifyScopeListeners(), this);
    }
    setTransactionName(e) {
      return ((this._transactionName = e), this._notifyScopeListeners(), this);
    }
    setContext(e, r) {
      return (
        r === null ? delete this._contexts[e] : (this._contexts[e] = r),
        this._notifyScopeListeners(),
        this
      );
    }
    setSession(e) {
      return (e ? (this._session = e) : delete this._session, this._notifyScopeListeners(), this);
    }
    getSession() {
      return this._session;
    }
    update(e) {
      if (!e) return this;
      let r = typeof e == "function" ? e(this) : e,
        n = r instanceof t ? r.getScopeData() : hl(r) ? e : void 0,
        {
          tags: o,
          attributes: i,
          extra: s,
          user: a,
          contexts: l,
          level: c,
          fingerprint: u = [],
          propagationContext: p,
        } = n || {};
      return (
        (this._tags = { ...this._tags, ...o }),
        (this._attributes = { ...this._attributes, ...i }),
        (this._extra = { ...this._extra, ...s }),
        (this._contexts = { ...this._contexts, ...l }),
        a && Object.keys(a).length && (this._user = a),
        c && (this._level = c),
        u.length && (this._fingerprint = u),
        p && (this._propagationContext = p),
        this
      );
    }
    clear() {
      return (
        (this._breadcrumbs = []),
        (this._tags = {}),
        (this._attributes = {}),
        (this._extra = {}),
        (this._user = {}),
        (this._contexts = {}),
        (this._level = void 0),
        (this._transactionName = void 0),
        (this._fingerprint = void 0),
        (this._session = void 0),
        rZ(this, void 0),
        (this._attachments = []),
        this.setPropagationContext({ traceId: eZ(), sampleRand: vf() }),
        this._notifyScopeListeners(),
        this
      );
    }
    addBreadcrumb(e, r) {
      let n = typeof r == "number" ? r : wHt;
      if (n <= 0) return this;
      let o = { timestamp: bl(), ...e, message: e.message ? Dv(e.message, 2048) : e.message };
      return (
        this._breadcrumbs.push(o),
        this._breadcrumbs.length > n &&
          ((this._breadcrumbs = this._breadcrumbs.slice(-n)),
          this._client?.recordDroppedEvent("buffer_overflow", "log_item")),
        this._notifyScopeListeners(),
        this
      );
    }
    getLastBreadcrumb() {
      return this._breadcrumbs[this._breadcrumbs.length - 1];
    }
    clearBreadcrumbs() {
      return ((this._breadcrumbs = []), this._notifyScopeListeners(), this);
    }
    addAttachment(e) {
      return (this._attachments.push(e), this);
    }
    clearAttachments() {
      return ((this._attachments = []), this);
    }
    getScopeData() {
      return {
        breadcrumbs: this._breadcrumbs,
        attachments: this._attachments,
        contexts: this._contexts,
        tags: this._tags,
        attributes: this._attributes,
        extra: this._extra,
        user: this._user,
        level: this._level,
        fingerprint: this._fingerprint || [],
        eventProcessors: this._eventProcessors,
        propagationContext: this._propagationContext,
        sdkProcessingMetadata: this._sdkProcessingMetadata,
        transactionName: this._transactionName,
        span: nZ(this),
      };
    }
    setSDKProcessingMetadata(e) {
      return ((this._sdkProcessingMetadata = Rd(this._sdkProcessingMetadata, e, 2)), this);
    }
    setPropagationContext(e) {
      return ((this._propagationContext = e), this);
    }
    getPropagationContext() {
      return this._propagationContext;
    }
    captureException(e, r) {
      let n = r?.event_id || In();
      if (!this._client)
        return (qe && Te.warn("No client configured on scope - will not capture exception!"), n);
      let o = new Error("Sentry syntheticException");
      return (
        this._client.captureException(
          e,
          { originalException: e, syntheticException: o, ...r, event_id: n },
          this,
        ),
        n
      );
    }
    captureMessage(e, r, n) {
      let o = n?.event_id || In();
      if (!this._client)
        return (qe && Te.warn("No client configured on scope - will not capture message!"), o);
      let i = n?.syntheticException ?? new Error(e);
      return (
        this._client.captureMessage(
          e,
          r,
          { originalException: e, syntheticException: i, ...n, event_id: o },
          this,
        ),
        o
      );
    }
    captureEvent(e, r) {
      let n = r?.event_id || In();
      return this._client
        ? (this._client.captureEvent(e, { ...r, event_id: n }, this), n)
        : (qe && Te.warn("No client configured on scope - will not capture event!"), n);
    }
    _notifyScopeListeners() {
      this._notifyingListeners ||
        ((this._notifyingListeners = !0),
        this._scopeListeners.forEach((e) => {
          e(this);
        }),
        (this._notifyingListeners = !1));
    }
  };
function ije() {
  return ta("defaultCurrentScope", () => new io());
}
function sje() {
  return ta("defaultIsolationScope", () => new io());
}
var oZ = class {
  constructor(e, r) {
    let n;
    e ? (n = e) : (n = new io());
    let o;
    (r ? (o = r) : (o = new io()), (this._stack = [{ scope: n }]), (this._isolationScope = o));
  }
  withScope(e) {
    let r = this._pushScope(),
      n;
    try {
      n = e(r);
    } catch (o) {
      throw (this._popScope(), o);
    }
    return gl(n)
      ? n.then(
          (o) => (this._popScope(), o),
          (o) => {
            throw (this._popScope(), o);
          },
        )
      : (this._popScope(), n);
  }
  getClient() {
    return this.getStackTop().client;
  }
  getScope() {
    return this.getStackTop().scope;
  }
  getIsolationScope() {
    return this._isolationScope;
  }
  getStackTop() {
    return this._stack[this._stack.length - 1];
  }
  _pushScope() {
    let e = this.getScope().clone();
    return (this._stack.push({ client: this.getClient(), scope: e }), e);
  }
  _popScope() {
    return this._stack.length <= 1 ? !1 : !!this._stack.pop();
  }
};
function Lv() {
  let t = mf(),
    e = ff(t);
  return (e.stack = e.stack || new oZ(ije(), sje()));
}
function _Ht(t) {
  return Lv().withScope(t);
}
function xHt(t, e) {
  let r = Lv();
  return r.withScope(() => ((r.getStackTop().scope = t), e(t)));
}
function aje(t) {
  return Lv().withScope(() => t(Lv().getIsolationScope()));
}
function lje() {
  return {
    withIsolationScope: aje,
    withScope: _Ht,
    withSetScope: xHt,
    withSetIsolationScope: (t, e) => aje(e),
    getCurrentScope: () => Lv().getScope(),
    getIsolationScope: () => Lv().getIsolationScope(),
  };
}
function QL(t) {
  let e = ff(t);
  return e.acs ? e.acs : lje();
}
function Sl() {
  let t = mf();
  return QL(t).getCurrentScope();
}
function wl() {
  let t = mf();
  return QL(t).getIsolationScope();
}
function e2() {
  return ta("globalScope", () => new io());
}
function t2(...t) {
  let e = mf(),
    r = QL(e);
  if (t.length === 2) {
    let [n, o] = t;
    return n ? r.withSetScope(n, o) : r.withScope(o);
  }
  return r.withScope(t[0]);
}
function pr() {
  return Sl().getClient();
}
function iZ(t) {
  let e = t.getPropagationContext(),
    { traceId: r, parentSpanId: n, propagationSpanId: o } = e,
    i = { trace_id: r, span_id: o || JL() };
  return (n && (i.parent_span_id = n), i);
}
var r2 = "sentry.source",
  sZ = "sentry.sample_rate",
  cje = "sentry.previous_trace_sample_rate",
  aZ = "sentry.op",
  lZ = "sentry.origin";
var cZ = "sentry.profile_id",
  uZ = "sentry.exclusive_time";
var AHt = "_sentryScope",
  RHt = "_sentryIsolationScope";
function EHt(t) {
  if (t) {
    if (typeof t == "object" && "deref" in t && typeof t.deref == "function")
      try {
        return t.deref();
      } catch {
        return;
      }
    return t;
  }
}
function n2(t) {
  let e = t;
  return { scope: e[AHt], isolationScope: EHt(e[RHt]) };
}
var CHt = "sentry-",
  THt = /^sentry-/;
function dje(t) {
  let e = PHt(t);
  if (!e) return;
  let r = Object.entries(e).reduce((n, [o, i]) => {
    if (o.match(THt)) {
      let s = o.slice(CHt.length);
      n[s] = i;
    }
    return n;
  }, {});
  if (Object.keys(r).length > 0) return r;
}
function PHt(t) {
  if (!(!t || (!Wo(t) && !Array.isArray(t))))
    return Array.isArray(t)
      ? t.reduce((e, r) => {
          let n = uje(r);
          return (
            Object.entries(n).forEach(([o, i]) => {
              e[o] = i;
            }),
            e
          );
        }, {})
      : uje(t);
}
function uje(t) {
  return t
    .split(",")
    .map((e) => {
      let r = e.indexOf("=");
      if (r === -1) return [];
      let n = e.slice(0, r),
        o = e.slice(r + 1);
      return [n, o].map((i) => {
        try {
          return decodeURIComponent(i.trim());
        } catch {
          return;
        }
      });
    })
    .reduce((e, [r, n]) => (r && n && (e[r] = n), e), {});
}
var IHt = /^o(\d+)\./,
  kHt = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)((?:\[[:.%\w]+\]|[\w.-]+))(?::(\d+))?\/(.+)/;
function DHt(t) {
  return t === "http" || t === "https";
}
function _l(t, e = !1) {
  let { host: r, path: n, pass: o, port: i, projectId: s, protocol: a, publicKey: l } = t;
  return `${a}://${l}${e && o ? `:${o}` : ""}@${r}${i ? `:${i}` : ""}/${n && `${n}/`}${s}`;
}
function MHt(t) {
  let e = kHt.exec(t);
  if (!e) {
    xd(() => {
      console.error(`Invalid Sentry Dsn: ${t}`);
    });
    return;
  }
  let [r, n, o = "", i = "", s = "", a = ""] = e.slice(1),
    l = "",
    c = a,
    u = c.split("/");
  if ((u.length > 1 && ((l = u.slice(0, -1).join("/")), (c = u.pop())), c)) {
    let p = c.match(/^\d+/);
    p && (c = p[0]);
  }
  return pje({ host: i, pass: o, path: l, projectId: c, port: s, protocol: r, publicKey: n });
}
function pje(t) {
  return {
    protocol: t.protocol,
    publicKey: t.publicKey || "",
    pass: t.pass || "",
    host: t.host,
    port: t.port || "",
    path: t.path || "",
    projectId: t.projectId,
  };
}
function OHt(t) {
  if (!qe) return !0;
  let { port: e, projectId: r, protocol: n } = t;
  return ["protocol", "publicKey", "host", "projectId"].find((s) =>
    t[s] ? !1 : (Te.error(`Invalid Sentry Dsn: ${s} missing`), !0),
  )
    ? !1
    : r.match(/^\d+$/)
      ? DHt(n)
        ? e && isNaN(parseInt(e, 10))
          ? (Te.error(`Invalid Sentry Dsn: Invalid port ${e}`), !1)
          : !0
        : (Te.error(`Invalid Sentry Dsn: Invalid protocol ${n}`), !1)
      : (Te.error(`Invalid Sentry Dsn: Invalid projectId ${r}`), !1);
}
function NHt(t) {
  return t.match(IHt)?.[1];
}
function mje(t) {
  let e = t.getOptions(),
    { host: r } = t.getDsn() || {},
    n;
  return (e.orgId ? (n = String(e.orgId)) : r && (n = NHt(r)), n);
}
function fje(t) {
  let e = typeof t == "string" ? MHt(t) : pje(t);
  if (!(!e || !OHt(e))) return e;
}
function hje(t) {
  if (typeof t == "boolean") return Number(t);
  let e = typeof t == "string" ? parseFloat(t) : t;
  if (!(typeof e != "number" || isNaN(e) || e < 0 || e > 1)) return e;
}
var bje = 1,
  gje = !1;
function Sje(t) {
  let { spanId: e, traceId: r, isRemote: n } = t.spanContext(),
    o = n ? e : Bv(t).parent_span_id,
    i = n2(t).scope,
    s = n ? i?.getPropagationContext().propagationSpanId || JL() : e;
  return { parent_span_id: o, span_id: s, trace_id: r };
}
function LHt(t) {
  if (t && t.length > 0)
    return t.map(({ context: { spanId: e, traceId: r, traceFlags: n, ...o }, attributes: i }) => ({
      span_id: e,
      trace_id: r,
      sampled: n === bje,
      attributes: i,
      ...o,
    }));
}
function yje(t) {
  return typeof t == "number"
    ? vje(t)
    : Array.isArray(t)
      ? t[0] + t[1] / 1e9
      : t instanceof Date
        ? vje(t.getTime())
        : Si();
}
function vje(t) {
  return t > 9999999999 ? t / 1e3 : t;
}
function Bv(t) {
  if (FHt(t)) return t.getSpanJSON();
  let { spanId: e, traceId: r } = t.spanContext();
  if (BHt(t)) {
    let { attributes: n, startTime: o, name: i, endTime: s, status: a, links: l } = t,
      c =
        "parentSpanId" in t
          ? t.parentSpanId
          : "parentSpanContext" in t
            ? t.parentSpanContext?.spanId
            : void 0;
    return {
      span_id: e,
      trace_id: r,
      data: n,
      description: i,
      parent_span_id: c,
      start_timestamp: yje(o),
      timestamp: yje(s) || void 0,
      status: $Ht(a),
      op: n[aZ],
      origin: n[lZ],
      links: LHt(l),
    };
  }
  return { span_id: e, trace_id: r, start_timestamp: 0, data: {} };
}
function BHt(t) {
  let e = t;
  return !!e.attributes && !!e.startTime && !!e.name && !!e.endTime && !!e.status;
}
function FHt(t) {
  return typeof t.getSpanJSON == "function";
}
function wje(t) {
  let { traceFlags: e } = t.spanContext();
  return e === bje;
}
function $Ht(t) {
  if (!(!t || t.code === 0)) return t.code === 1 ? "ok" : t.message || "internal_error";
}
var UHt = "_sentryRootSpan";
function nR(t) {
  return t[UHt] || t;
}
function dZ() {
  gje ||
    (xd(() => {
      console.warn(
        "[Sentry] Returning null from `beforeSendSpan` is disallowed. To drop certain spans, configure the respective integrations directly or use `ignoreSpans`.",
      );
    }),
    (gje = !0));
}
function _je(t) {
  if (typeof __SENTRY_TRACING__ == "boolean" && !__SENTRY_TRACING__) return !1;
  let e = t || pr()?.getOptions();
  return !!e && (e.tracesSampleRate != null || !!e.tracesSampler);
}
function xje(t) {
  Te.log(`Ignoring span ${t.op} - ${t.description} because it matches \`ignoreSpans\`.`);
}
function pZ(t, e) {
  if (!e?.length || !t.description) return !1;
  for (let r of e) {
    if (qHt(r)) {
      if (Mv(t.description, r)) return (qe && xje(t), !0);
      continue;
    }
    if (!r.name && !r.op) continue;
    let n = r.name ? Mv(t.description, r.name) : !0,
      o = r.op ? t.op && Mv(t.op, r.op) : !0;
    if (n && o) return (qe && xje(t), !0);
  }
  return !1;
}
function Aje(t, e) {
  let r = e.parent_span_id,
    n = e.span_id;
  if (r) for (let o of t) o.parent_span_id === n && (o.parent_span_id = r);
}
function qHt(t) {
  return typeof t == "string" || t instanceof RegExp;
}
var Fv = "production";
var GHt = "_frozenDsc";
function Rje(t, e) {
  let r = e.getOptions(),
    { publicKey: n } = e.getDsn() || {},
    o = {
      environment: r.environment || Fv,
      release: r.release,
      public_key: n,
      trace_id: t,
      org_id: mje(e),
    };
  return (e.emit("createDsc", o), o);
}
function Eje(t, e) {
  let r = e.getPropagationContext();
  return r.dsc || Rje(r.traceId, t);
}
function Cje(t) {
  let e = pr();
  if (!e) return {};
  let r = nR(t),
    n = Bv(r),
    o = n.data,
    i = r.spanContext().traceState,
    s = i?.get("sentry.sample_rate") ?? o[sZ] ?? o[cje];
  function a(h) {
    return ((typeof s == "number" || typeof s == "string") && (h.sample_rate = `${s}`), h);
  }
  let l = r[GHt];
  if (l) return a(l);
  let c = i?.get("sentry.dsc"),
    u = c && dje(c);
  if (u) return a(u);
  let p = Rje(t.spanContext().traceId, e),
    m = o[r2],
    f = n.description;
  return (
    m !== "url" && f && (p.transaction = f),
    _je() &&
      ((p.sampled = String(wje(r))),
      (p.sample_rand =
        i?.get("sentry.sample_rand") ??
        n2(r).scope?.getPropagationContext().sampleRand.toString())),
    a(p),
    e.emit("createDsc", p, r),
    p
  );
}
function ys(t, e = 100, r = 1 / 0) {
  try {
    return mZ("", t, e, r);
  } catch (n) {
    return { ERROR: `**non-serializable** (${n})` };
  }
}
function o2(t, e = 3, r = 100 * 1024) {
  let n = ys(t, e);
  return zHt(n) > r ? o2(t, e - 1, r) : n;
}
function mZ(t, e, r = 1 / 0, n = 1 / 0, o = VHt()) {
  let [i, s] = o;
  if (
    e == null ||
    ["boolean", "string"].includes(typeof e) ||
    (typeof e == "number" && Number.isFinite(e))
  )
    return e;
  let a = WHt(t, e);
  if (!a.startsWith("[object ")) return a;
  if (e.__sentry_skip_normalization__) return e;
  let l =
    typeof e.__sentry_override_normalization_depth__ == "number"
      ? e.__sentry_override_normalization_depth__
      : r;
  if (l === 0) return a.replace("object ", "");
  if (i(e)) return "[Circular ~]";
  let c = e;
  if (c && typeof c.toJSON == "function")
    try {
      let f = c.toJSON();
      return mZ("", f, l - 1, n, o);
    } catch {}
  let u = Array.isArray(e) ? [] : {},
    p = 0,
    m = ZL(e);
  for (let f in m) {
    if (!Object.prototype.hasOwnProperty.call(m, f)) continue;
    if (p >= n) {
      u[f] = "[MaxProperties ~]";
      break;
    }
    let h = m[f];
    ((u[f] = mZ(f, h, l - 1, n, o)), p++);
  }
  return (s(e), u);
}
function WHt(t, e) {
  try {
    if (t === "domain" && e && typeof e == "object" && e._events) return "[Domain]";
    if (t === "domainEmitter") return "[DomainEmitter]";
    if (typeof global < "u" && e === global) return "[Global]";
    if (typeof window < "u" && e === window) return "[Window]";
    if (typeof document < "u" && e === document) return "[Document]";
    if (eR(e)) return jL(e);
    if (K9(e)) return "[SyntheticEvent]";
    if (typeof e == "number" && !Number.isFinite(e)) return `[${e}]`;
    if (typeof e == "function") return `[Function: ${gs(e)}]`;
    if (typeof e == "symbol") return `[${String(e)}]`;
    if (typeof e == "bigint") return `[BigInt: ${String(e)}]`;
    let r = HHt(e);
    return /^HTML(\w*)Element$/.test(r) ? `[HTMLElement: ${r}]` : `[object ${r}]`;
  } catch (r) {
    return `**non-serializable** (${r})`;
  }
}
function HHt(t) {
  let e = Object.getPrototypeOf(t);
  return e?.constructor ? e.constructor.name : "null prototype";
}
function jHt(t) {
  return ~-encodeURI(t).split(/%..|./).length;
}
function zHt(t) {
  return jHt(JSON.stringify(t));
}
function VHt() {
  let t = new WeakSet();
  function e(n) {
    return t.has(n) ? !0 : (t.add(n), !1);
  }
  function r(n) {
    t.delete(n);
  }
  return [e, r];
}
function na(t, e = []) {
  return [t, e];
}
function Tje(t, e) {
  let [r, n] = t;
  return [r, [...n, e]];
}
function i2(t, e) {
  let r = t[1];
  for (let n of r) {
    let o = n[0].type;
    if (e(n, o)) return !0;
  }
  return !1;
}
function Pje(t, e) {
  return i2(t, (r, n) => e.includes(n));
}
function fZ(t) {
  let e = ff(rt);
  return e.encodePolyfill ? e.encodePolyfill(t) : new TextEncoder().encode(t);
}
function Ije(t) {
  let [e, r] = t,
    n = JSON.stringify(e);
  function o(i) {
    typeof n == "string"
      ? (n = typeof i == "string" ? n + i : [fZ(n), i])
      : n.push(typeof i == "string" ? fZ(i) : i);
  }
  for (let i of r) {
    let [s, a] = i;
    if (
      (o(`
${JSON.stringify(s)}
`),
      typeof a == "string" || a instanceof Uint8Array)
    )
      o(a);
    else {
      let l;
      try {
        l = JSON.stringify(a);
      } catch {
        l = JSON.stringify(ys(a));
      }
      o(l);
    }
  }
  return typeof n == "string" ? n : KHt(n);
}
function KHt(t) {
  let e = t.reduce((o, i) => o + i.length, 0),
    r = new Uint8Array(e),
    n = 0;
  for (let o of t) (r.set(o, n), (n += o.length));
  return r;
}
function kje(t) {
  let e = typeof t.data == "string" ? fZ(t.data) : t.data;
  return [
    {
      type: "attachment",
      length: e.length,
      filename: t.filename,
      content_type: t.contentType,
      attachment_type: t.attachmentType,
    },
    e,
  ];
}
var ZHt = {
  session: "session",
  sessions: "session",
  attachment: "attachment",
  transaction: "transaction",
  event: "error",
  client_report: "internal",
  user_report: "default",
  profile: "profile",
  profile_chunk: "profile",
  replay_event: "replay",
  replay_recording: "replay",
  check_in: "monitor",
  feedback: "feedback",
  span: "span",
  raw_security: "security",
  log: "log_item",
  metric: "metric",
  trace_metric: "metric",
};
function hZ(t) {
  return ZHt[t];
}
function gZ(t) {
  if (!t?.sdk) return;
  let { name: e, version: r } = t.sdk;
  return { name: e, version: r };
}
function Dje(t, e, r, n) {
  let o = t.sdkProcessingMetadata?.dynamicSamplingContext;
  return {
    event_id: t.event_id,
    sent_at: new Date().toISOString(),
    ...(e && { sdk: e }),
    ...(!!r && n && { dsn: _l(n) }),
    ...(o && { trace: o }),
  };
}
function XHt(t, e) {
  if (!e) return t;
  let r = t.sdk || {};
  return (
    (t.sdk = {
      ...r,
      name: r.name || e.name,
      version: r.version || e.version,
      integrations: [...(t.sdk?.integrations || []), ...(e.integrations || [])],
      packages: [...(t.sdk?.packages || []), ...(e.packages || [])],
      settings: t.sdk?.settings || e.settings ? { ...t.sdk?.settings, ...e.settings } : void 0,
    }),
    t
  );
}
function Mje(t, e, r, n) {
  let o = gZ(r),
    i = {
      sent_at: new Date().toISOString(),
      ...(o && { sdk: o }),
      ...(!!n && e && { dsn: _l(e) }),
    },
    s = "aggregates" in t ? [{ type: "sessions" }, t] : [{ type: "session" }, t.toJSON()];
  return na(i, [s]);
}
function Oje(t, e, r, n) {
  let o = gZ(r),
    i = t.type && t.type !== "replay_event" ? t.type : "event";
  XHt(t, r?.sdk);
  let s = Dje(t, o, n, e);
  return (delete t.sdkProcessingMetadata, na(s, [[{ type: i }, t]]));
}
var yZ = 0,
  Nje = 1,
  Lje = 2;
function Ed(t) {
  return new oR((e) => {
    e(t);
  });
}
function bf(t) {
  return new oR((e, r) => {
    r(t);
  });
}
var oR = class t {
  constructor(e) {
    ((this._state = yZ), (this._handlers = []), this._runExecutor(e));
  }
  then(e, r) {
    return new t((n, o) => {
      (this._handlers.push([
        !1,
        (i) => {
          if (!e) n(i);
          else
            try {
              n(e(i));
            } catch (s) {
              o(s);
            }
        },
        (i) => {
          if (!r) o(i);
          else
            try {
              n(r(i));
            } catch (s) {
              o(s);
            }
        },
      ]),
        this._executeHandlers());
    });
  }
  catch(e) {
    return this.then((r) => r, e);
  }
  finally(e) {
    return new t((r, n) => {
      let o, i;
      return this.then(
        (s) => {
          ((i = !1), (o = s), e && e());
        },
        (s) => {
          ((i = !0), (o = s), e && e());
        },
      ).then(() => {
        if (i) {
          n(o);
          return;
        }
        r(o);
      });
    });
  }
  _executeHandlers() {
    if (this._state === yZ) return;
    let e = this._handlers.slice();
    ((this._handlers = []),
      e.forEach((r) => {
        r[0] ||
          (this._state === Nje && r[1](this._value),
          this._state === Lje && r[2](this._value),
          (r[0] = !0));
      }));
  }
  _runExecutor(e) {
    let r = (i, s) => {
        if (this._state === yZ) {
          if (gl(s)) {
            s.then(n, o);
            return;
          }
          ((this._state = i), (this._value = s), this._executeHandlers());
        }
      },
      n = (i) => {
        r(Nje, i);
      },
      o = (i) => {
        r(Lje, i);
      };
    try {
      e(n, o);
    } catch (i) {
      o(i);
    }
  }
};
function Bje(t, e, r, n = 0) {
  try {
    let o = vZ(e, r, t, n);
    return gl(o) ? o : Ed(o);
  } catch (o) {
    return bf(o);
  }
}
function vZ(t, e, r, n) {
  let o = r[n];
  if (!t || !o) return t;
  let i = o({ ...t }, e);
  return (
    qe && i === null && Te.log(`Event processor "${o.id || "?"}" dropped event`),
    gl(i) ? i.then((s) => vZ(s, e, r, n + 1)) : vZ(i, e, r, n + 1)
  );
}
var Sf, Fje, $je, Cd;
function Uje(t) {
  let e = rt._sentryDebugIds,
    r = rt._debugIds;
  if (!e && !r) return {};
  let n = e ? Object.keys(e) : [],
    o = r ? Object.keys(r) : [];
  if (Cd && n.length === Fje && o.length === $je) return Cd;
  ((Fje = n.length), ($je = o.length), (Cd = {}), Sf || (Sf = {}));
  let i = (s, a) => {
    for (let l of s) {
      let c = a[l],
        u = Sf?.[l];
      if (u && Cd && c) ((Cd[u[0]] = c), Sf && (Sf[l] = [u[0], c]));
      else if (c) {
        let p = t(l);
        for (let m = p.length - 1; m >= 0; m--) {
          let h = p[m]?.filename;
          if (h && Cd && Sf) {
            ((Cd[h] = c), (Sf[l] = [h, c]));
            break;
          }
        }
      }
    }
  };
  return (e && i(n, e), r && i(o, r), Cd);
}
function Gje(t, e) {
  let { fingerprint: r, span: n, breadcrumbs: o, sdkProcessingMetadata: i } = e;
  (YHt(t, e), n && ejt(t, n), tjt(t, r), JHt(t, o), QHt(t, i));
}
function qje(t, e) {
  let {
    extra: r,
    tags: n,
    attributes: o,
    user: i,
    contexts: s,
    level: a,
    sdkProcessingMetadata: l,
    breadcrumbs: c,
    fingerprint: u,
    eventProcessors: p,
    attachments: m,
    propagationContext: f,
    transactionName: h,
    span: v,
  } = e;
  (iR(t, "extra", r),
    iR(t, "tags", n),
    iR(t, "attributes", o),
    iR(t, "user", i),
    iR(t, "contexts", s),
    (t.sdkProcessingMetadata = Rd(t.sdkProcessingMetadata, l, 2)),
    a && (t.level = a),
    h && (t.transactionName = h),
    v && (t.span = v),
    c.length && (t.breadcrumbs = [...t.breadcrumbs, ...c]),
    u.length && (t.fingerprint = [...t.fingerprint, ...u]),
    p.length && (t.eventProcessors = [...t.eventProcessors, ...p]),
    m.length && (t.attachments = [...t.attachments, ...m]),
    (t.propagationContext = { ...t.propagationContext, ...f }));
}
