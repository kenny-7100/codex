var qP = g(() => {
  "use strict";
});
var GP,
  RJe,
  dq,
  EJe,
  CJe,
  $7t,
  U7t,
  pq = g(() => {
    "use strict";
    $P();
    vp();
    qP();
    ((GP = "openai-bundled"),
      (RJe = FP),
      (dq = "computer-use"),
      (EJe = `${dq}@${GP}`),
      (CJe = "plan"),
      ($7t = `${CJe}@${GP}`),
      (U7t = new Map([
        [RJe, J.BROWSER_USE_BUNDLED_PLUGIN_AUTO_INSTALL_DISABLED],
        [dq, J.COMPUTER_USE_BUNDLED_PLUGIN_AUTO_INSTALL_DISABLED],
      ])));
  });
var _ne = g(() => {
  "use strict";
});
var mq,
  xne,
  TJe,
  PJe,
  H7t,
  j7t,
  Ane = g(() => {
    "use strict";
    $();
    ((mq = {
      maxSerializedBytes: 2 * 1024,
      maxKeys: 6,
      maxKeyLength: 64,
      maxStringValueLength: 256,
    }),
      (xne = d.string().regex(/^[^\p{Cc}\p{Cf}\p{Cs}\u2028\u2029]*$/u)),
      (TJe = d
        .string()
        .max(mq.maxKeyLength)
        .regex(/^[A-Za-z][A-Za-z0-9_-]*(?: [A-Za-z0-9_-]+)*$/)
        .refine((t) => t !== "__proto__" && t !== "constructor" && t !== "prototype")),
      (PJe = d.union([xne.max(mq.maxStringValueLength), d.number(), d.boolean(), d.null()])),
      (H7t = d.record(TJe, PJe)),
      (j7t = xne.max(128).refine((t) => t.trim().length > 0)));
  });
var IJe,
  Y7t,
  Rne,
  J7t,
  kJe,
  Q7t,
  fq,
  hq,
  DJe,
  MJe,
  Ene,
  jS = g(() => {
    "use strict";
    $();
    Ane();
    ((IJe = 240),
      (Y7t = d.string().max(IJe)),
      (Rne = { BATCH: "batch", QUICK: "quick" }),
      (J7t = {
        [Rne.BATCH]: { defaultSubmitMode: "saved", persistent: !0 },
        [Rne.QUICK]: { defaultSubmitMode: "direct", persistent: !1 },
      }),
      (kJe = 25),
      (Q7t = kJe / 2),
      (fq = 120),
      (hq = 88),
      (DJe = fq + hq),
      (MJe = { height: 26, hotspot: { x: 0, y: 26 }, width: 26 }),
      (Ene = MJe.width));
  });
var gq = g(() => {
  "use strict";
});
var Cne = g(() => {
  "use strict";
  gq();
});
var Zh = g(() => {
  "use strict";
});
var Tne = g(() => {
  "use strict";
});
var Pne = g(() => {
  "use strict";
});
var Ine = g(() => {
  "use strict";
});
function WP(t) {
  let r = (t.replaceAll("\\", "/").replace(/\/+$/u, "").split("/").at(-1) ?? "")
    .replace(/[<>:"|?*]/gu, "_")
    .replaceAll("\0", "_");
  return r === "." || r === ".." || r === "" ? "download" : r;
}
function HP(t) {
  return t > 268435456;
}
var kne = g(() => {
  "use strict";
});
function Dne(t) {
  let e = NJe.safeParse(t);
  return e.success ? e.data : null;
}
function Mne(t) {
  let e = LJe.safeParse(t);
  return e.success ? e.data : null;
}
var NJe,
  LJe,
  One = g(() => {
    "use strict";
    $();
    ((NJe = d.object({
      type: d.literal("vscode-capn-rpc-message"),
      sessionId: d.string(),
      message: d.unknown(),
    })),
      (LJe = d.object({ type: d.literal("vscode-capn-rpc-connect"), sessionId: d.string() })));
  });
function VS(t) {
  return t.startsWith(Nne);
}
var MQt,
  Nne,
  ql = g(() => {
    "use strict";
    jS();
    gq();
    Cne();
    Zh();
    Tne();
    Pne();
    Ine();
    kne();
    One();
    jS();
    ((MQt = 45 * 1024 * 1024), (Nne = "client-new-thread:"));
  });
var yq,
  XQt,
  qJe,
  YQt,
  Lne,
  Bne,
  JQt,
  QQt,
  Fne,
  eer,
  GJe,
  ter,
  WJe,
  rer,
  $ne,
  ner,
  HJe,
  oer,
  jJe,
  ier,
  zJe,
  VJe,
  ser,
  KJe,
  aer,
  ZJe,
  XJe,
  ler,
  YJe,
  cer,
  uer,
  JJe,
  der,
  Une,
  per,
  vq = g(() => {
    "use strict";
    $();
    HS();
    pq();
    _ne();
    ql();
    ql();
    ((yq = "/hotkey-window"),
      (XQt = `${yq}/new-thread`),
      (qJe = "/global-dictation"),
      (YQt = `${qJe}/setup`),
      (Lne = "/wsl-migration"),
      (Bne = "/share"),
      (JQt = `${Bne}/:sharedConversationId`),
      (QQt = `${Bne}/e/:sharedConversationId`),
      (Fne = `${yq}/thread`),
      (eer = `${Fne}/:conversationId`),
      (GJe = `${yq}/remote`),
      (ter = `${GJe}/:taskId`),
      (WJe = "/plugins"),
      (rer = `${WJe}/:pluginId`),
      ($ne = "/mcp-app"),
      (ner = `${$ne}/:server/:toolName`),
      (HJe = "/settings/plugins"),
      (oer = `${HJe}/:server/:toolName`),
      (jJe = `${$ne}/plugins`),
      (ier = `${jJe}/:pluginId/:toolName`),
      (zJe = "/skills/manage"),
      (VJe = `${zJe}/plugins`),
      (ser = `${VJe}/:pluginId`),
      (KJe = "/local"),
      (aer = `${KJe}/:conversationId`),
      (ZJe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i),
      (XJe = d.enum(["branch", "last-turn"])),
      (ler = d.object({
        conversationId: d.string().regex(ZJe),
        diffFilter: XJe.nullable().catch(null),
        extraPathSegments: d.array(d.string()),
        host: d.literal("threads"),
        protocol: d.literal("codex:"),
        reviewPath: d.string().min(1).nullable().catch(null),
        view: d.literal("review").nullable().catch(null),
      })),
      (YJe = "/remote"),
      (cer = `${YJe}/:taskId`),
      (uer = new RegExp(`^${Fne}/([^/?#]+)$`)),
      (JJe = d.object({
        path: d.array(d.string()),
        query: d.array(d.tuple([d.string(), d.string()])),
      })),
      (der = d.object({
        entrypoint: d.enum(["global", "settings"]).optional(),
        mcpAppDeepLink: JJe.optional(),
        sourceMcpApp: d.object({ appId: d.string(), toolName: d.string() }).optional(),
      })),
      (Une = d.enum(["chat", "work", "codex"])),
      (per = d.object({ codexAppMode: Une.optional() })));
  });
var qne = g(() => {
  "use strict";
  vq();
});
var Gne = g(() => {
  "use strict";
});
var Wne,
  Hne,
  Ser,
  QJe,
  jne,
  zne,
  au,
  e7e,
  su,
  t7e,
  r7e,
  n7e,
  o7e,
  Vne,
  Kne,
  Zne,
  Xne,
  Yne,
  Jne,
  Qne,
  eoe,
  bq = g(() => {
    "use strict";
    $();
    ((Wne = d.enum([
      "off",
      "30-seconds",
      "1-minute",
      "3-minutes",
      "10-minutes",
      "30-minutes",
      "1-hour",
    ])),
      (Hne = d.number().int().min(0).max(100)),
      (Ser = d.enum([
        "ACT06",
        "ACT07",
        "ACT08",
        "ACT09",
        "ACT10",
        "ACT11",
        "ACT10_ACT11",
        "ACT12",
      ])),
      (QJe = d.enum([
        "FAST",
        "APPR",
        "REJ",
        "SPLIT",
        "MIC",
        "MIC1",
        "CODEX",
        "BUG",
        "OAI",
        "TERM",
        "DWN",
        "DEL",
        "NEW",
        "NAV",
        "MAGIC",
        "DIFF",
        "PLAY",
        "GIT",
        "BRCH",
        "BRANCH",
        "MRG",
        "PR",
        "PAINT",
        "LAB",
        "PARTY",
        "TIME",
        "MIND+",
        "MIND-",
        "EMPT1",
        "EMPT2",
        "EMPT3",
        "EMPT4",
        "SETUP",
        "FOLD",
        "UPL",
        "APPS",
        "YOLO",
        "YEET",
        "EMPT5",
      ])),
      (jne = d.object({ type: d.literal("command"), commandId: d.string().min(1) })),
      (zne = d.object({
        type: d.literal("skill"),
        skillName: d.string().min(1),
        skillPath: d.string().min(1),
      })),
      (au = d.discriminatedUnion("type", [jne, zne])),
      (e7e = d.discriminatedUnion("type", [
        jne,
        zne,
        d.object({ type: d.literal("composer-text"), text: d.string().min(1) }),
      ])),
      (su = d.object({ keycapId: QJe, commandId: d.string().optional(), action: e7e.optional() })),
      (t7e = d.object({
        up: au.nullable(),
        right: au.nullable(),
        down: au.nullable(),
        left: au.nullable(),
      })),
      (r7e = d.object({
        left: au.nullable(),
        right: au.nullable(),
        click: au.nullable(),
        longPress: au.nullable(),
      })),
      (n7e = d.enum(["composer-navigation", "reasoning", "conversation-scroll", "custom"])),
      (o7e = d.enum(["push-to-talk", "realtime"])),
      (Vne = d.enum(["pinned", "recent", "priority", "custom"])),
      (Kne = {
        up: { type: "command", commandId: "composer.togglePlanMode" },
        right: { type: "command", commandId: "navigateForward" },
        down: { type: "command", commandId: "toggleSidebar" },
        left: { type: "command", commandId: "navigateBack" },
      }),
      (Zne = { left: null, right: null, click: null, longPress: null }),
      (Xne = "recent"),
      (Yne = "composer-navigation"),
      (Jne = "push-to-talk"),
      (Qne = d.object({
        version: d.literal(1),
        slots: d.object({
          ACT06: su,
          ACT07: su,
          ACT08: su,
          ACT09: su,
          ACT10: su.default({ keycapId: "MIC1" }),
          ACT11: su.default({ keycapId: "EMPT1" }),
          ACT10_ACT11: su,
          ACT12: su,
        }),
        analogStick: t7e.default(Kne),
        encoder: r7e.default(Zne),
        encoderMode: n7e.default(Yne),
        voiceButtonMode: o7e.default(Jne),
        separateMicrophoneKeys: d.boolean().default(!1),
      })),
      (eoe = {
        version: 1,
        slots: {
          ACT06: { keycapId: "FAST" },
          ACT07: { keycapId: "APPR" },
          ACT08: { keycapId: "REJ" },
          ACT09: { keycapId: "SPLIT" },
          ACT10: { keycapId: "MIC1" },
          ACT11: { keycapId: "EMPT1" },
          ACT10_ACT11: { keycapId: "MIC" },
          ACT12: { keycapId: "CODEX" },
        },
        analogStick: Kne,
        encoder: Zne,
        encoderMode: Yne,
        voiceButtonMode: Jne,
        separateMicrophoneKeys: !1,
      }));
  });
var toe = g(() => {
  "use strict";
});
var roe,
  jP,
  KS = g(() => {
    "use strict";
    ((roe = ["enter", "cmdIfMultiline", "cmdAlways"]), (jP = "in-app-browser"));
  });
var Aer,
  Sq = g(() => {
    "use strict";
    $();
    Aer = d.record(d.string(), d.json());
  });
var ooe = A((Eer, noe) => {
  function i7e() {
    ((this.__data__ = []), (this.size = 0));
  }
  noe.exports = i7e;
});
var Xh = A((Cer, ioe) => {
  function s7e(t, e) {
    return t === e || (t !== t && e !== e);
  }
  ioe.exports = s7e;
});
var ZS = A((Ter, soe) => {
  var a7e = Xh();
  function l7e(t, e) {
    for (var r = t.length; r--; ) if (a7e(t[r][0], e)) return r;
    return -1;
  }
  soe.exports = l7e;
});
var loe = A((Per, aoe) => {
  var c7e = ZS(),
    u7e = Array.prototype,
    d7e = u7e.splice;
  function p7e(t) {
    var e = this.__data__,
      r = c7e(e, t);
    if (r < 0) return !1;
    var n = e.length - 1;
    return (r == n ? e.pop() : d7e.call(e, r, 1), --this.size, !0);
  }
  aoe.exports = p7e;
});
var uoe = A((Ier, coe) => {
  var m7e = ZS();
  function f7e(t) {
    var e = this.__data__,
      r = m7e(e, t);
    return r < 0 ? void 0 : e[r][1];
  }
  coe.exports = f7e;
});
var poe = A((ker, doe) => {
  var h7e = ZS();
  function g7e(t) {
    return h7e(this.__data__, t) > -1;
  }
  doe.exports = g7e;
});
var foe = A((Der, moe) => {
  var y7e = ZS();
  function v7e(t, e) {
    var r = this.__data__,
      n = y7e(r, t);
    return (n < 0 ? (++this.size, r.push([t, e])) : (r[n][1] = e), this);
  }
  moe.exports = v7e;
});
var XS = A((Mer, hoe) => {
  var b7e = ooe(),
    S7e = loe(),
    w7e = uoe(),
    _7e = poe(),
    x7e = foe();
  function Yh(t) {
    var e = -1,
      r = t == null ? 0 : t.length;
    for (this.clear(); ++e < r; ) {
      var n = t[e];
      this.set(n[0], n[1]);
    }
  }
  Yh.prototype.clear = b7e;
  Yh.prototype.delete = S7e;
  Yh.prototype.get = w7e;
  Yh.prototype.has = _7e;
  Yh.prototype.set = x7e;
  hoe.exports = Yh;
});
var yoe = A((Oer, goe) => {
  var A7e = XS();
  function R7e() {
    ((this.__data__ = new A7e()), (this.size = 0));
  }
  goe.exports = R7e;
});
var boe = A((Ner, voe) => {
  function E7e(t) {
    var e = this.__data__,
      r = e.delete(t);
    return ((this.size = e.size), r);
  }
  voe.exports = E7e;
});
var woe = A((Ler, Soe) => {
  function C7e(t) {
    return this.__data__.get(t);
  }
  Soe.exports = C7e;
});
var xoe = A((Ber, _oe) => {
  function T7e(t) {
    return this.__data__.has(t);
  }
  _oe.exports = T7e;
});
var wq = A((Fer, Aoe) => {
  var P7e = typeof global == "object" && global && global.Object === Object && global;
  Aoe.exports = P7e;
});
var Ji = A(($er, Roe) => {
  var I7e = wq(),
    k7e = typeof self == "object" && self && self.Object === Object && self,
    D7e = I7e || k7e || Function("return this")();
  Roe.exports = D7e;
});
var bp = A((Uer, Eoe) => {
  var M7e = Ji(),
    O7e = M7e.Symbol;
  Eoe.exports = O7e;
});
var Ioe = A((qer, Poe) => {
  var Coe = bp(),
    Toe = Object.prototype,
    N7e = Toe.hasOwnProperty,
    L7e = Toe.toString,
    YS = Coe ? Coe.toStringTag : void 0;
  function B7e(t) {
    var e = N7e.call(t, YS),
      r = t[YS];
    try {
      t[YS] = void 0;
      var n = !0;
    } catch {}
    var o = L7e.call(t);
    return (n && (e ? (t[YS] = r) : delete t[YS]), o);
  }
  Poe.exports = B7e;
});
var Doe = A((Ger, koe) => {
  var F7e = Object.prototype,
    $7e = F7e.toString;
  function U7e(t) {
    return $7e.call(t);
  }
  koe.exports = U7e;
});
var Sp = A((Wer, Noe) => {
  var Moe = bp(),
    q7e = Ioe(),
    G7e = Doe(),
    W7e = "[object Null]",
    H7e = "[object Undefined]",
    Ooe = Moe ? Moe.toStringTag : void 0;
  function j7e(t) {
    return t == null ? (t === void 0 ? H7e : W7e) : Ooe && Ooe in Object(t) ? q7e(t) : G7e(t);
  }
  Noe.exports = j7e;
});
var ei = A((Her, Loe) => {
  function z7e(t) {
    var e = typeof t;
    return t != null && (e == "object" || e == "function");
  }
  Loe.exports = z7e;
});
var zP = A((jer, Boe) => {
  var V7e = Sp(),
    K7e = ei(),
    Z7e = "[object AsyncFunction]",
    X7e = "[object Function]",
    Y7e = "[object GeneratorFunction]",
    J7e = "[object Proxy]";
  function Q7e(t) {
    if (!K7e(t)) return !1;
    var e = V7e(t);
    return e == X7e || e == Y7e || e == Z7e || e == J7e;
  }
  Boe.exports = Q7e;
});
var $oe = A((zer, Foe) => {
  var eQe = Ji(),
    tQe = eQe["__core-js_shared__"];
  Foe.exports = tQe;
});
var Goe = A((Ver, qoe) => {
  var _q = $oe(),
    Uoe = (function () {
      var t = /[^.]+$/.exec((_q && _q.keys && _q.keys.IE_PROTO) || "");
      return t ? "Symbol(src)_1." + t : "";
    })();
  function rQe(t) {
    return !!Uoe && Uoe in t;
  }
  qoe.exports = rQe;
});
var xq = A((Ker, Woe) => {
  var nQe = Function.prototype,
    oQe = nQe.toString;
  function iQe(t) {
    if (t != null) {
      try {
        return oQe.call(t);
      } catch {}
      try {
        return t + "";
      } catch {}
    }
    return "";
  }
  Woe.exports = iQe;
});
var joe = A((Zer, Hoe) => {
  var sQe = zP(),
    aQe = Goe(),
    lQe = ei(),
    cQe = xq(),
    uQe = /[\\^$.*+?()[\]{}|]/g,
    dQe = /^\[object .+?Constructor\]$/,
    pQe = Function.prototype,
    mQe = Object.prototype,
    fQe = pQe.toString,
    hQe = mQe.hasOwnProperty,
    gQe = RegExp(
      "^" +
        fQe
          .call(hQe)
          .replace(uQe, "\\$&")
          .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") +
        "$",
    );
  function yQe(t) {
    if (!lQe(t) || aQe(t)) return !1;
    var e = sQe(t) ? gQe : dQe;
    return e.test(cQe(t));
  }
  Hoe.exports = yQe;
});
var Voe = A((Xer, zoe) => {
  function vQe(t, e) {
    return t?.[e];
  }
  zoe.exports = vQe;
});
var lu = A((Yer, Koe) => {
  var bQe = joe(),
    SQe = Voe();
  function wQe(t, e) {
    var r = SQe(t, e);
    return bQe(r) ? r : void 0;
  }
  Koe.exports = wQe;
});
var VP = A((Jer, Zoe) => {
  var _Qe = lu(),
    xQe = Ji(),
    AQe = _Qe(xQe, "Map");
  Zoe.exports = AQe;
});
var JS = A((Qer, Xoe) => {
  var RQe = lu(),
    EQe = RQe(Object, "create");
  Xoe.exports = EQe;
});
var Qoe = A((etr, Joe) => {
  var Yoe = JS();
  function CQe() {
    ((this.__data__ = Yoe ? Yoe(null) : {}), (this.size = 0));
  }
  Joe.exports = CQe;
});
var tie = A((ttr, eie) => {
  function TQe(t) {
    var e = this.has(t) && delete this.__data__[t];
    return ((this.size -= e ? 1 : 0), e);
  }
  eie.exports = TQe;
});
var nie = A((rtr, rie) => {
  var PQe = JS(),
    IQe = "__lodash_hash_undefined__",
    kQe = Object.prototype,
    DQe = kQe.hasOwnProperty;
  function MQe(t) {
    var e = this.__data__;
    if (PQe) {
      var r = e[t];
      return r === IQe ? void 0 : r;
    }
    return DQe.call(e, t) ? e[t] : void 0;
  }
  rie.exports = MQe;
});
var iie = A((ntr, oie) => {
  var OQe = JS(),
    NQe = Object.prototype,
    LQe = NQe.hasOwnProperty;
  function BQe(t) {
    var e = this.__data__;
    return OQe ? e[t] !== void 0 : LQe.call(e, t);
  }
  oie.exports = BQe;
});
var aie = A((otr, sie) => {
  var FQe = JS(),
    $Qe = "__lodash_hash_undefined__";
  function UQe(t, e) {
    var r = this.__data__;
    return ((this.size += this.has(t) ? 0 : 1), (r[t] = FQe && e === void 0 ? $Qe : e), this);
  }
  sie.exports = UQe;
});
var cie = A((itr, lie) => {
  var qQe = Qoe(),
    GQe = tie(),
    WQe = nie(),
    HQe = iie(),
    jQe = aie();
  function Jh(t) {
    var e = -1,
      r = t == null ? 0 : t.length;
    for (this.clear(); ++e < r; ) {
      var n = t[e];
      this.set(n[0], n[1]);
    }
  }
  Jh.prototype.clear = qQe;
  Jh.prototype.delete = GQe;
  Jh.prototype.get = WQe;
  Jh.prototype.has = HQe;
  Jh.prototype.set = jQe;
  lie.exports = Jh;
});
var pie = A((str, die) => {
  var uie = cie(),
    zQe = XS(),
    VQe = VP();
  function KQe() {
    ((this.size = 0),
      (this.__data__ = { hash: new uie(), map: new (VQe || zQe)(), string: new uie() }));
  }
  die.exports = KQe;
});
var fie = A((atr, mie) => {
  function ZQe(t) {
    var e = typeof t;
    return e == "string" || e == "number" || e == "symbol" || e == "boolean"
      ? t !== "__proto__"
      : t === null;
  }
  mie.exports = ZQe;
});
var QS = A((ltr, hie) => {
  var XQe = fie();
  function YQe(t, e) {
    var r = t.__data__;
    return XQe(e) ? r[typeof e == "string" ? "string" : "hash"] : r.map;
  }
  hie.exports = YQe;
});
var yie = A((ctr, gie) => {
  var JQe = QS();
  function QQe(t) {
    var e = JQe(this, t).delete(t);
    return ((this.size -= e ? 1 : 0), e);
  }
  gie.exports = QQe;
});
var bie = A((utr, vie) => {
  var eet = QS();
  function tet(t) {
    return eet(this, t).get(t);
  }
  vie.exports = tet;
});
var wie = A((dtr, Sie) => {
  var ret = QS();
  function net(t) {
    return ret(this, t).has(t);
  }
  Sie.exports = net;
});
var xie = A((ptr, _ie) => {
  var oet = QS();
  function iet(t, e) {
    var r = oet(this, t),
      n = r.size;
    return (r.set(t, e), (this.size += r.size == n ? 0 : 1), this);
  }
  _ie.exports = iet;
});
var KP = A((mtr, Aie) => {
  var set = pie(),
    aet = yie(),
    cet = bie(),
    uet = wie(),
    det = xie();
  function Qh(t) {
    var e = -1,
      r = t == null ? 0 : t.length;
    for (this.clear(); ++e < r; ) {
      var n = t[e];
      this.set(n[0], n[1]);
    }
  }
  Qh.prototype.clear = set;
  Qh.prototype.delete = aet;
  Qh.prototype.get = cet;
  Qh.prototype.has = uet;
  Qh.prototype.set = det;
  Aie.exports = Qh;
});
var Eie = A((ftr, Rie) => {
  var pet = XS(),
    met = VP(),
    fet = KP(),
    het = 200;
  function get(t, e) {
    var r = this.__data__;
    if (r instanceof pet) {
      var n = r.__data__;
      if (!met || n.length < het - 1) return (n.push([t, e]), (this.size = ++r.size), this);
      r = this.__data__ = new fet(n);
    }
    return (r.set(t, e), (this.size = r.size), this);
  }
  Rie.exports = get;
});
var ew = A((htr, Cie) => {
  var yet = XS(),
    vet = yoe(),
    bet = boe(),
    wet = woe(),
    _et = xoe(),
    xet = Eie();
  function eg(t) {
    var e = (this.__data__ = new yet(t));
    this.size = e.size;
  }
  eg.prototype.clear = vet;
  eg.prototype.delete = bet;
  eg.prototype.get = wet;
  eg.prototype.has = _et;
  eg.prototype.set = xet;
  Cie.exports = eg;
});
var Pie = A((gtr, Tie) => {
  function Aet(t, e) {
    for (var r = -1, n = t == null ? 0 : t.length; ++r < n && e(t[r], r, t) !== !1; );
    return t;
  }
  Tie.exports = Aet;
});
var Aq = A((ytr, Iie) => {
  var Ret = lu(),
    Eet = (function () {
      try {
        var t = Ret(Object, "defineProperty");
        return (t({}, "", {}), t);
      } catch {}
    })();
  Iie.exports = Eet;
});
var tw = A((vtr, Die) => {
  var kie = Aq();
  function Cet(t, e, r) {
    e == "__proto__" && kie
      ? kie(t, e, { configurable: !0, enumerable: !0, value: r, writable: !0 })
      : (t[e] = r);
  }
  Die.exports = Cet;
});
var ZP = A((btr, Mie) => {
  var Tet = tw(),
    Pet = Xh(),
    Iet = Object.prototype,
    ket = Iet.hasOwnProperty;
  function Det(t, e, r) {
    var n = t[e];
    (!(ket.call(t, e) && Pet(n, r)) || (r === void 0 && !(e in t))) && Tet(t, e, r);
  }
  Mie.exports = Det;
});
var wp = A((Str, Oie) => {
  var Met = ZP(),
    Oet = tw();
  function Net(t, e, r, n) {
    var o = !r;
    r || (r = {});
    for (var i = -1, s = e.length; ++i < s; ) {
      var a = e[i],
        l = n ? n(r[a], t[a], a, r, t) : void 0;
      (l === void 0 && (l = t[a]), o ? Oet(r, a, l) : Met(r, a, l));
    }
    return r;
  }
  Oie.exports = Net;
});
var Lie = A((wtr, Nie) => {
  function Let(t, e) {
    for (var r = -1, n = Array(t); ++r < t; ) n[r] = e(r);
    return n;
  }
  Nie.exports = Let;
});
var Aa = A((_tr, Bie) => {
  function Bet(t) {
    return t != null && typeof t == "object";
  }
  Bie.exports = Bet;
});
var $ie = A((xtr, Fie) => {
  var Fet = Sp(),
    $et = Aa(),
    Uet = "[object Arguments]";
  function qet(t) {
    return $et(t) && Fet(t) == Uet;
  }
  Fie.exports = qet;
});
var rw = A((Atr, Gie) => {
  var Uie = $ie(),
    Get = Aa(),
    qie = Object.prototype,
    Wet = qie.hasOwnProperty,
    Het = qie.propertyIsEnumerable,
    jet = Uie(
      (function () {
        return arguments;
      })(),
    )
      ? Uie
      : function (t) {
          return Get(t) && Wet.call(t, "callee") && !Het.call(t, "callee");
        };
  Gie.exports = jet;
});
var Qi = A((Rtr, Wie) => {
  var zet = Array.isArray;
  Wie.exports = zet;
});
var jie = A((Etr, Hie) => {
  function Vet() {
    return !1;
  }
  Hie.exports = Vet;
});
var ow = A((nw, tg) => {
  var Ket = Ji(),
    Zet = jie(),
    Kie = typeof nw == "object" && nw && !nw.nodeType && nw,
    zie = Kie && typeof tg == "object" && tg && !tg.nodeType && tg,
    Xet = zie && zie.exports === Kie,
    Vie = Xet ? Ket.Buffer : void 0,
    Yet = Vie ? Vie.isBuffer : void 0,
    Jet = Yet || Zet;
  tg.exports = Jet;
});
var iw = A((Ctr, Zie) => {
  var Qet = 9007199254740991,
    ett = /^(?:0|[1-9]\d*)$/;
  function ttt(t, e) {
    var r = typeof t;
    return (
      (e = e ?? Qet),
      !!e && (r == "number" || (r != "symbol" && ett.test(t))) && t > -1 && t % 1 == 0 && t < e
    );
  }
  Zie.exports = ttt;
});
var XP = A((Ttr, Xie) => {
  var rtt = 9007199254740991;
  function ntt(t) {
    return typeof t == "number" && t > -1 && t % 1 == 0 && t <= rtt;
  }
  Xie.exports = ntt;
});
var Jie = A((Ptr, Yie) => {
  var ott = Sp(),
    itt = XP(),
    stt = Aa(),
    att = "[object Arguments]",
    ltt = "[object Array]",
    ctt = "[object Boolean]",
    utt = "[object Date]",
    dtt = "[object Error]",
    ptt = "[object Function]",
    mtt = "[object Map]",
    ftt = "[object Number]",
    htt = "[object Object]",
    gtt = "[object RegExp]",
    ytt = "[object Set]",
    vtt = "[object String]",
    btt = "[object WeakMap]",
    Stt = "[object ArrayBuffer]",
    wtt = "[object DataView]",
    _tt = "[object Float32Array]",
    xtt = "[object Float64Array]",
    Att = "[object Int8Array]",
    Rtt = "[object Int16Array]",
    Ett = "[object Int32Array]",
    Ctt = "[object Uint8Array]",
    Ttt = "[object Uint8ClampedArray]",
    Ptt = "[object Uint16Array]",
    Itt = "[object Uint32Array]",
    wr = {};
  wr[_tt] = wr[xtt] = wr[Att] = wr[Rtt] = wr[Ett] = wr[Ctt] = wr[Ttt] = wr[Ptt] = wr[Itt] = !0;
  wr[att] =
    wr[ltt] =
    wr[Stt] =
    wr[ctt] =
    wr[wtt] =
    wr[utt] =
    wr[dtt] =
    wr[ptt] =
    wr[mtt] =
    wr[ftt] =
    wr[htt] =
    wr[gtt] =
    wr[ytt] =
    wr[vtt] =
    wr[btt] =
      !1;
  function ktt(t) {
    return stt(t) && itt(t.length) && !!wr[ott(t)];
  }
  Yie.exports = ktt;
});
var YP = A((Itr, Qie) => {
  function Dtt(t) {
    return function (e) {
      return t(e);
    };
  }
  Qie.exports = Dtt;
});
var JP = A((sw, rg) => {
  var Mtt = wq(),
    ese = typeof sw == "object" && sw && !sw.nodeType && sw,
    aw = ese && typeof rg == "object" && rg && !rg.nodeType && rg,
    Ott = aw && aw.exports === ese,
    Rq = Ott && Mtt.process,
    Ntt = (function () {
      try {
        var t = aw && aw.require && aw.require("util").types;
        return t || (Rq && Rq.binding && Rq.binding("util"));
      } catch {}
    })();
  rg.exports = Ntt;
});
var QP = A((ktr, nse) => {
  var Ltt = Jie(),
    Btt = YP(),
    tse = JP(),
    rse = tse && tse.isTypedArray,
    Ftt = rse ? Btt(rse) : Ltt;
  nse.exports = Ftt;
});
var Eq = A((Dtr, ose) => {
  var $tt = Lie(),
    Utt = rw(),
    qtt = Qi(),
    Gtt = ow(),
    Wtt = iw(),
    Htt = QP(),
    jtt = Object.prototype,
    ztt = jtt.hasOwnProperty;
  function Vtt(t, e) {
    var r = qtt(t),
      n = !r && Utt(t),
      o = !r && !n && Gtt(t),
      i = !r && !n && !o && Htt(t),
      s = r || n || o || i,
      a = s ? $tt(t.length, String) : [],
      l = a.length;
    for (var c in t)
      (e || ztt.call(t, c)) &&
        !(
          s &&
          (c == "length" ||
            (o && (c == "offset" || c == "parent")) ||
            (i && (c == "buffer" || c == "byteLength" || c == "byteOffset")) ||
            Wtt(c, l))
        ) &&
        a.push(c);
    return a;
  }
  ose.exports = Vtt;
});
var eI = A((Mtr, ise) => {
  var Ktt = Object.prototype;
  function Ztt(t) {
    var e = t && t.constructor,
      r = (typeof e == "function" && e.prototype) || Ktt;
    return t === r;
  }
  ise.exports = Ztt;
});
var Cq = A((Otr, sse) => {
  function Xtt(t, e) {
    return function (r) {
      return t(e(r));
    };
  }
  sse.exports = Xtt;
});
var lse = A((Ntr, ase) => {
  var Ytt = Cq(),
    Jtt = Ytt(Object.keys, Object);
  ase.exports = Jtt;
});
var use = A((Ltr, cse) => {
  var Qtt = eI(),
    ert = lse(),
    trt = Object.prototype,
    rrt = trt.hasOwnProperty;
  function nrt(t) {
    if (!Qtt(t)) return ert(t);
    var e = [];
    for (var r in Object(t)) rrt.call(t, r) && r != "constructor" && e.push(r);
    return e;
  }
  cse.exports = nrt;
});
var ng = A((Btr, dse) => {
  var ort = zP(),
    irt = XP();
  function srt(t) {
    return t != null && irt(t.length) && !ort(t);
  }
  dse.exports = srt;
});
var _p = A((Ftr, pse) => {
  var art = Eq(),
    lrt = use(),
    crt = ng();
  function urt(t) {
    return crt(t) ? art(t) : lrt(t);
  }
  pse.exports = urt;
});
var fse = A(($tr, mse) => {
  var drt = wp(),
    prt = _p();
  function mrt(t, e) {
    return t && drt(e, prt(e), t);
  }
  mse.exports = mrt;
});
var gse = A((Utr, hse) => {
  function frt(t) {
    var e = [];
    if (t != null) for (var r in Object(t)) e.push(r);
    return e;
  }
  hse.exports = frt;
});
var vse = A((qtr, yse) => {
  var hrt = ei(),
    grt = eI(),
    yrt = gse(),
    vrt = Object.prototype,
    brt = vrt.hasOwnProperty;
  function Srt(t) {
    if (!hrt(t)) return yrt(t);
    var e = grt(t),
      r = [];
    for (var n in t) (n == "constructor" && (e || !brt.call(t, n))) || r.push(n);
    return r;
  }
  yse.exports = Srt;
});
var og = A((Gtr, bse) => {
  var wrt = Eq(),
    _rt = vse(),
    xrt = ng();
  function Art(t) {
    return xrt(t) ? wrt(t, !0) : _rt(t);
  }
  bse.exports = Art;
});
var wse = A((Wtr, Sse) => {
  var Rrt = wp(),
    Ert = og();
  function Crt(t, e) {
    return t && Rrt(e, Ert(e), t);
  }
  Sse.exports = Crt;
});
var Tq = A((lw, ig) => {
  var Trt = Ji(),
    Rse = typeof lw == "object" && lw && !lw.nodeType && lw,
    _se = Rse && typeof ig == "object" && ig && !ig.nodeType && ig,
    Prt = _se && _se.exports === Rse,
    xse = Prt ? Trt.Buffer : void 0,
    Ase = xse ? xse.allocUnsafe : void 0;
  function Irt(t, e) {
    if (e) return t.slice();
    var r = t.length,
      n = Ase ? Ase(r) : new t.constructor(r);
    return (t.copy(n), n);
  }
  ig.exports = Irt;
});
var Pq = A((Htr, Ese) => {
  function krt(t, e) {
    var r = -1,
      n = t.length;
    for (e || (e = Array(n)); ++r < n; ) e[r] = t[r];
    return e;
  }
  Ese.exports = krt;
});
var Tse = A((jtr, Cse) => {
  function Drt(t, e) {
    for (var r = -1, n = t == null ? 0 : t.length, o = 0, i = []; ++r < n; ) {
      var s = t[r];
      e(s, r, t) && (i[o++] = s);
    }
    return i;
  }
  Cse.exports = Drt;
});
var Iq = A((ztr, Pse) => {
  function Mrt() {
    return [];
  }
  Pse.exports = Mrt;
});
var tI = A((Vtr, kse) => {
  var Ort = Tse(),
    Nrt = Iq(),
    Lrt = Object.prototype,
    Brt = Lrt.propertyIsEnumerable,
    Ise = Object.getOwnPropertySymbols,
    Frt = Ise
      ? function (t) {
          return t == null
            ? []
            : ((t = Object(t)),
              Ort(Ise(t), function (e) {
                return Brt.call(t, e);
              }));
        }
      : Nrt;
  kse.exports = Frt;
});
var Mse = A((Ktr, Dse) => {
  var $rt = wp(),
    Urt = tI();
  function qrt(t, e) {
    return $rt(t, Urt(t), e);
  }
  Dse.exports = qrt;
});
var rI = A((Ztr, Ose) => {
  function Grt(t, e) {
    for (var r = -1, n = e.length, o = t.length; ++r < n; ) t[o + r] = e[r];
    return t;
  }
  Ose.exports = Grt;
});
var nI = A((Xtr, Nse) => {
  var Wrt = Cq(),
    Hrt = Wrt(Object.getPrototypeOf, Object);
  Nse.exports = Hrt;
});
var kq = A((Ytr, Lse) => {
  var jrt = rI(),
    zrt = nI(),
    Vrt = tI(),
    Krt = Iq(),
    Zrt = Object.getOwnPropertySymbols,
    Xrt = Zrt
      ? function (t) {
          for (var e = []; t; ) (jrt(e, Vrt(t)), (t = zrt(t)));
          return e;
        }
      : Krt;
  Lse.exports = Xrt;
});
var Fse = A((Jtr, Bse) => {
  var Yrt = wp(),
    Jrt = kq();
  function Qrt(t, e) {
    return Yrt(t, Jrt(t), e);
  }
  Bse.exports = Qrt;
});
var Dq = A((Qtr, $se) => {
  var ent = rI(),
    tnt = Qi();
  function rnt(t, e, r) {
    var n = e(t);
    return tnt(t) ? n : ent(n, r(t));
  }
  $se.exports = rnt;
});
var Mq = A((err, Use) => {
  var nnt = Dq(),
    ont = tI(),
    int = _p();
  function snt(t) {
    return nnt(t, int, ont);
  }
  Use.exports = snt;
});
var Oq = A((trr, qse) => {
  var ant = Dq(),
    lnt = kq(),
    cnt = og();
  function unt(t) {
    return ant(t, cnt, lnt);
  }
  qse.exports = unt;
});
var Wse = A((rrr, Gse) => {
  var dnt = lu(),
    pnt = Ji(),
    mnt = dnt(pnt, "DataView");
  Gse.exports = mnt;
});
var jse = A((nrr, Hse) => {
  var fnt = lu(),
    hnt = Ji(),
    gnt = fnt(hnt, "Promise");
  Hse.exports = gnt;
});
var Nq = A((orr, zse) => {
  var ynt = lu(),
    vnt = Ji(),
    bnt = ynt(vnt, "Set");
  zse.exports = bnt;
});
var Kse = A((irr, Vse) => {
  var Snt = lu(),
    wnt = Ji(),
    _nt = Snt(wnt, "WeakMap");
  Vse.exports = _nt;
});
var cw = A((srr, tae) => {
  var Lq = Wse(),
    Bq = VP(),
    Fq = jse(),
    $q = Nq(),
    Uq = Kse(),
    eae = Sp(),
    sg = xq(),
    Zse = "[object Map]",
    xnt = "[object Object]",
    Xse = "[object Promise]",
    Yse = "[object Set]",
    Jse = "[object WeakMap]",
    Qse = "[object DataView]",
    Ant = sg(Lq),
    Rnt = sg(Bq),
    Ent = sg(Fq),
    Cnt = sg($q),
    Tnt = sg(Uq),
    xp = eae;
  ((Lq && xp(new Lq(new ArrayBuffer(1))) != Qse) ||
    (Bq && xp(new Bq()) != Zse) ||
    (Fq && xp(Fq.resolve()) != Xse) ||
    ($q && xp(new $q()) != Yse) ||
    (Uq && xp(new Uq()) != Jse)) &&
    (xp = function (t) {
      var e = eae(t),
        r = e == xnt ? t.constructor : void 0,
        n = r ? sg(r) : "";
      if (n)
        switch (n) {
          case Ant:
            return Qse;
          case Rnt:
            return Zse;
          case Ent:
            return Xse;
          case Cnt:
            return Yse;
          case Tnt:
            return Jse;
        }
      return e;
    });
  tae.exports = xp;
});
var nae = A((arr, rae) => {
  var Pnt = Object.prototype,
    Int = Pnt.hasOwnProperty;
  function knt(t) {
    var e = t.length,
      r = new t.constructor(e);
    return (
      e &&
        typeof t[0] == "string" &&
        Int.call(t, "index") &&
        ((r.index = t.index), (r.input = t.input)),
      r
    );
  }
  rae.exports = knt;
});
var qq = A((lrr, oae) => {
  var Dnt = Ji(),
    Mnt = Dnt.Uint8Array;
  oae.exports = Mnt;
});
var oI = A((crr, sae) => {
  var iae = qq();
  function Ont(t) {
    var e = new t.constructor(t.byteLength);
    return (new iae(e).set(new iae(t)), e);
  }
  sae.exports = Ont;
});
var lae = A((urr, aae) => {
  var Nnt = oI();
  function Lnt(t, e) {
    var r = e ? Nnt(t.buffer) : t.buffer;
    return new t.constructor(r, t.byteOffset, t.byteLength);
  }
  aae.exports = Lnt;
});
var uae = A((drr, cae) => {
  var Bnt = /\w*$/;
  function Fnt(t) {
    var e = new t.constructor(t.source, Bnt.exec(t));
    return ((e.lastIndex = t.lastIndex), e);
  }
  cae.exports = Fnt;
});
var hae = A((prr, fae) => {
  var dae = bp(),
    pae = dae ? dae.prototype : void 0,
    mae = pae ? pae.valueOf : void 0;
  function $nt(t) {
    return mae ? Object(mae.call(t)) : {};
  }
  fae.exports = $nt;
});
var Gq = A((mrr, gae) => {
  var Unt = oI();
  function qnt(t, e) {
    var r = e ? Unt(t.buffer) : t.buffer;
    return new t.constructor(r, t.byteOffset, t.length);
  }
  gae.exports = qnt;
});
var vae = A((frr, yae) => {
  var Gnt = oI(),
    Wnt = lae(),
    Hnt = uae(),
    jnt = hae(),
    znt = Gq(),
    Vnt = "[object Boolean]",
    Knt = "[object Date]",
    Znt = "[object Map]",
    Xnt = "[object Number]",
    Ynt = "[object RegExp]",
    Jnt = "[object Set]",
    Qnt = "[object String]",
    eot = "[object Symbol]",
    tot = "[object ArrayBuffer]",
    rot = "[object DataView]",
    not = "[object Float32Array]",
    oot = "[object Float64Array]",
    iot = "[object Int8Array]",
    sot = "[object Int16Array]",
    aot = "[object Int32Array]",
    lot = "[object Uint8Array]",
    cot = "[object Uint8ClampedArray]",
    uot = "[object Uint16Array]",
    dot = "[object Uint32Array]";
  function pot(t, e, r) {
    var n = t.constructor;
    switch (e) {
      case tot:
        return Gnt(t);
      case Vnt:
      case Knt:
        return new n(+t);
      case rot:
        return Wnt(t, r);
      case not:
      case oot:
      case iot:
      case sot:
      case aot:
      case lot:
      case cot:
      case uot:
      case dot:
        return znt(t, r);
      case Znt:
        return new n();
      case Xnt:
      case Qnt:
        return new n(t);
      case Ynt:
        return Hnt(t);
      case Jnt:
        return new n();
      case eot:
        return jnt(t);
    }
  }
  yae.exports = pot;
});
var wae = A((hrr, Sae) => {
  var mot = ei(),
    bae = Object.create,
    fot = (function () {
      function t() {}
      return function (e) {
        if (!mot(e)) return {};
        if (bae) return bae(e);
        t.prototype = e;
        var r = new t();
        return ((t.prototype = void 0), r);
      };
    })();
  Sae.exports = fot;
});
var Wq = A((grr, _ae) => {
  var hot = wae(),
    got = nI(),
    yot = eI();
  function vot(t) {
    return typeof t.constructor == "function" && !yot(t) ? hot(got(t)) : {};
  }
  _ae.exports = vot;
});
var Aae = A((yrr, xae) => {
  var bot = cw(),
    Sot = Aa(),
    wot = "[object Map]";
  function _ot(t) {
    return Sot(t) && bot(t) == wot;
  }
  xae.exports = _ot;
});
var Tae = A((vrr, Cae) => {
  var xot = Aae(),
    Aot = YP(),
    Rae = JP(),
    Eae = Rae && Rae.isMap,
    Rot = Eae ? Aot(Eae) : xot;
  Cae.exports = Rot;
});
var Iae = A((brr, Pae) => {
  var Eot = cw(),
    Cot = Aa(),
    Tot = "[object Set]";
  function Pot(t) {
    return Cot(t) && Eot(t) == Tot;
  }
  Pae.exports = Pot;
});
var Oae = A((Srr, Mae) => {
  var Iot = Iae(),
    kot = YP(),
    kae = JP(),
    Dae = kae && kae.isSet,
    Dot = Dae ? kot(Dae) : Iot;
  Mae.exports = Dot;
});
var Hq = A((wrr, Fae) => {
  var Mot = ew(),
    Oot = Pie(),
    Not = ZP(),
    Lot = fse(),
    Bot = wse(),
    Fot = Tq(),
    $ot = Pq(),
    Uot = Mse(),
    qot = Fse(),
    Got = Mq(),
    Wot = Oq(),
    Hot = cw(),
    jot = nae(),
    zot = vae(),
    Vot = Wq(),
    Kot = Qi(),
    Zot = ow(),
    Xot = Tae(),
    Yot = ei(),
    Jot = Oae(),
    Qot = _p(),
    eit = og(),
    tit = 1,
    rit = 2,
    nit = 4,
    Nae = "[object Arguments]",
    oit = "[object Array]",
    iit = "[object Boolean]",
    sit = "[object Date]",
    ait = "[object Error]",
    Lae = "[object Function]",
    lit = "[object GeneratorFunction]",
    cit = "[object Map]",
    uit = "[object Number]",
    Bae = "[object Object]",
    dit = "[object RegExp]",
    pit = "[object Set]",
    mit = "[object String]",
    fit = "[object Symbol]",
    hit = "[object WeakMap]",
    git = "[object ArrayBuffer]",
    yit = "[object DataView]",
    vit = "[object Float32Array]",
    bit = "[object Float64Array]",
    Sit = "[object Int8Array]",
    wit = "[object Int16Array]",
    _it = "[object Int32Array]",
    xit = "[object Uint8Array]",
    Ait = "[object Uint8ClampedArray]",
    Rit = "[object Uint16Array]",
    Eit = "[object Uint32Array]",
    fr = {};
  fr[Nae] =
    fr[oit] =
    fr[git] =
    fr[yit] =
    fr[iit] =
    fr[sit] =
    fr[vit] =
    fr[bit] =
    fr[Sit] =
    fr[wit] =
    fr[_it] =
    fr[cit] =
    fr[uit] =
    fr[Bae] =
    fr[dit] =
    fr[pit] =
    fr[mit] =
    fr[fit] =
    fr[xit] =
    fr[Ait] =
    fr[Rit] =
    fr[Eit] =
      !0;
  fr[ait] = fr[Lae] = fr[hit] = !1;
  function iI(t, e, r, n, o, i) {
    var s,
      a = e & tit,
      l = e & rit,
      c = e & nit;
    if ((r && (s = o ? r(t, n, o, i) : r(t)), s !== void 0)) return s;
    if (!Yot(t)) return t;
    var u = Kot(t);
    if (u) {
      if (((s = jot(t)), !a)) return $ot(t, s);
    } else {
      var p = Hot(t),
        m = p == Lae || p == lit;
      if (Zot(t)) return Fot(t, a);
      if (p == Bae || p == Nae || (m && !o)) {
        if (((s = l || m ? {} : Vot(t)), !a)) return l ? qot(t, Bot(s, t)) : Uot(t, Lot(s, t));
      } else {
        if (!fr[p]) return o ? t : {};
        s = zot(t, p, a);
      }
    }
    i || (i = new Mot());
    var f = i.get(t);
    if (f) return f;
    (i.set(t, s),
      Jot(t)
        ? t.forEach(function (y) {
            s.add(iI(y, e, r, y, t, i));
          })
        : Xot(t) &&
          t.forEach(function (y, w) {
            s.set(w, iI(y, e, r, w, t, i));
          }));
    var h = c ? (l ? Wot : Got) : l ? eit : Qot,
      v = u ? void 0 : h(t);
    return (
      Oot(v || t, function (y, w) {
        (v && ((w = y), (y = t[w])), Not(s, w, iI(y, e, r, w, t, i)));
      }),
      s
    );
  }
  Fae.exports = iI;
});
var Uae = A((_rr, $ae) => {
  var Cit = Hq(),
    Tit = 1,
    Pit = 4;
  function Iit(t) {
    return Cit(t, Tit | Pit);
  }
  $ae.exports = Iit;
});
var Gae = A((xrr, qae) => {
  var kit = "__lodash_hash_undefined__";
  function Dit(t) {
    return (this.__data__.set(t, kit), this);
  }
  qae.exports = Dit;
});
var Hae = A((Arr, Wae) => {
  function Mit(t) {
    return this.__data__.has(t);
  }
  Wae.exports = Mit;
});
var jq = A((Rrr, jae) => {
  var Oit = KP(),
    Nit = Gae(),
    Lit = Hae();
  function sI(t) {
    var e = -1,
      r = t == null ? 0 : t.length;
    for (this.__data__ = new Oit(); ++e < r; ) this.add(t[e]);
  }
  sI.prototype.add = sI.prototype.push = Nit;
  sI.prototype.has = Lit;
  jae.exports = sI;
});
var Vae = A((Err, zae) => {
  function Bit(t, e) {
    for (var r = -1, n = t == null ? 0 : t.length; ++r < n; ) if (e(t[r], r, t)) return !0;
    return !1;
  }
  zae.exports = Bit;
});
var zq = A((Crr, Kae) => {
  function Fit(t, e) {
    return t.has(e);
  }
  Kae.exports = Fit;
});
var Vq = A((Trr, Zae) => {
  var $it = jq(),
    Uit = Vae(),
    qit = zq(),
    Git = 1,
    Wit = 2;
  function Hit(t, e, r, n, o, i) {
    var s = r & Git,
      a = t.length,
      l = e.length;
    if (a != l && !(s && l > a)) return !1;
    var c = i.get(t),
      u = i.get(e);
    if (c && u) return c == e && u == t;
    var p = -1,
      m = !0,
      f = r & Wit ? new $it() : void 0;
    for (i.set(t, e), i.set(e, t); ++p < a; ) {
      var h = t[p],
        v = e[p];
      if (n) var y = s ? n(v, h, p, e, t, i) : n(h, v, p, t, e, i);
      if (y !== void 0) {
        if (y) continue;
        m = !1;
        break;
      }
      if (f) {
        if (
          !Uit(e, function (w, _) {
            if (!qit(f, _) && (h === w || o(h, w, r, n, i))) return f.push(_);
          })
        ) {
          m = !1;
          break;
        }
      } else if (!(h === v || o(h, v, r, n, i))) {
        m = !1;
        break;
      }
    }
    return (i.delete(t), i.delete(e), m);
  }
  Zae.exports = Hit;
});
var Yae = A((Prr, Xae) => {
  function jit(t) {
    var e = -1,
      r = Array(t.size);
    return (
      t.forEach(function (n, o) {
        r[++e] = [o, n];
      }),
      r
    );
  }
  Xae.exports = jit;
});
var aI = A((Irr, Jae) => {
  function zit(t) {
    var e = -1,
      r = Array(t.size);
    return (
      t.forEach(function (n) {
        r[++e] = n;
      }),
      r
    );
  }
  Jae.exports = zit;
});
var nle = A((krr, rle) => {
  var Qae = bp(),
    ele = qq(),
    Vit = Xh(),
    Kit = Vq(),
    Zit = Yae(),
    Xit = aI(),
    Yit = 1,
    Jit = 2,
    Qit = "[object Boolean]",
    est = "[object Date]",
    tst = "[object Error]",
    rst = "[object Map]",
    nst = "[object Number]",
    ost = "[object RegExp]",
    ist = "[object Set]",
    sst = "[object String]",
    ast = "[object Symbol]",
    lst = "[object ArrayBuffer]",
    cst = "[object DataView]",
    tle = Qae ? Qae.prototype : void 0,
    Kq = tle ? tle.valueOf : void 0;
  function ust(t, e, r, n, o, i, s) {
    switch (r) {
      case cst:
        if (t.byteLength != e.byteLength || t.byteOffset != e.byteOffset) return !1;
        ((t = t.buffer), (e = e.buffer));
      case lst:
        return !(t.byteLength != e.byteLength || !i(new ele(t), new ele(e)));
      case Qit:
      case est:
      case nst:
        return Vit(+t, +e);
      case tst:
        return t.name == e.name && t.message == e.message;
      case ost:
      case sst:
        return t == e + "";
      case rst:
        var a = Zit;
      case ist:
        var l = n & Yit;
        if ((a || (a = Xit), t.size != e.size && !l)) return !1;
        var c = s.get(t);
        if (c) return c == e;
        ((n |= Jit), s.set(t, e));
        var u = Kit(a(t), a(e), n, o, i, s);
        return (s.delete(t), u);
      case ast:
        if (Kq) return Kq.call(t) == Kq.call(e);
    }
    return !1;
  }
  rle.exports = ust;
});
var sle = A((Drr, ile) => {
  var ole = Mq(),
    dst = 1,
    pst = Object.prototype,
    mst = pst.hasOwnProperty;
  function fst(t, e, r, n, o, i) {
    var s = r & dst,
      a = ole(t),
      l = a.length,
      c = ole(e),
      u = c.length;
    if (l != u && !s) return !1;
    for (var p = l; p--; ) {
      var m = a[p];
      if (!(s ? m in e : mst.call(e, m))) return !1;
    }
    var f = i.get(t),
      h = i.get(e);
    if (f && h) return f == e && h == t;
    var v = !0;
    (i.set(t, e), i.set(e, t));
    for (var y = s; ++p < l; ) {
      m = a[p];
      var w = t[m],
        _ = e[m];
      if (n) var S = s ? n(_, w, m, e, t, i) : n(w, _, m, t, e, i);
      if (!(S === void 0 ? w === _ || o(w, _, r, n, i) : S)) {
        v = !1;
        break;
      }
      y || (y = m == "constructor");
    }
    if (v && !y) {
      var E = t.constructor,
        T = e.constructor;
      E != T &&
        "constructor" in t &&
        "constructor" in e &&
        !(typeof E == "function" && E instanceof E && typeof T == "function" && T instanceof T) &&
        (v = !1);
    }
    return (i.delete(t), i.delete(e), v);
  }
  ile.exports = fst;
});
var fle = A((Mrr, mle) => {
  var Zq = ew(),
    hst = Vq(),
    gst = nle(),
    yst = sle(),
    ale = cw(),
    lle = Qi(),
    cle = ow(),
    vst = QP(),
    bst = 1,
    ule = "[object Arguments]",
    dle = "[object Array]",
    lI = "[object Object]",
    Sst = Object.prototype,
    ple = Sst.hasOwnProperty;
  function wst(t, e, r, n, o, i) {
    var s = lle(t),
      a = lle(e),
      l = s ? dle : ale(t),
      c = a ? dle : ale(e);
    ((l = l == ule ? lI : l), (c = c == ule ? lI : c));
    var u = l == lI,
      p = c == lI,
      m = l == c;
    if (m && cle(t)) {
      if (!cle(e)) return !1;
      ((s = !0), (u = !1));
    }
    if (m && !u)
      return (i || (i = new Zq()), s || vst(t) ? hst(t, e, r, n, o, i) : gst(t, e, l, r, n, o, i));
    if (!(r & bst)) {
      var f = u && ple.call(t, "__wrapped__"),
        h = p && ple.call(e, "__wrapped__");
      if (f || h) {
        var v = f ? t.value() : t,
          y = h ? e.value() : e;
        return (i || (i = new Zq()), o(v, y, r, n, i));
      }
    }
    return m ? (i || (i = new Zq()), yst(t, e, r, n, o, i)) : !1;
  }
  mle.exports = wst;
});
var cI = A((Orr, yle) => {
  var _st = fle(),
    hle = Aa();
  function gle(t, e, r, n, o) {
    return t === e
      ? !0
      : t == null || e == null || (!hle(t) && !hle(e))
        ? t !== t && e !== e
        : _st(t, e, r, n, gle, o);
  }
  yle.exports = gle;
});
var Is = A((Nrr, vle) => {
  var xst = cI();
  function Ast(t, e) {
    return xst(t, e);
  }
  vle.exports = Ast;
});
var Rst,
  Est,
  ble,
  Ap = g(() => {
    "use strict";
    ((Rst = F(Uae())),
      (Est = F(Is())),
      (ble = ["read-only", "auto", "granular", "guardian-approvals", "full-access", "custom"]));
  });
var Xq,
  Yq = g(() => {
    "use strict";
    $();
    Ap();
    Xq = d.enum(ble);
  });
var Cst,
  qrr,
  Tst,
  Pst,
  Sle = g(() => {
    "use strict";
    $();
    ((Cst = d.enum(["pending", "accepted", "dismissed"])),
      (qrr = d.enum(["science"]).nullable()),
      (Tst = d.object({
        id: d.string().min(1),
        title: d.string(),
        description: d.string(),
        prompt: d.string(),
        appIds: d.array(d.string()),
        pluginMention: d.object({ id: d.string().min(1), label: d.string().min(1) }).optional(),
        status: Cst,
        createdAtMs: d.number(),
        updatedAtMs: d.number(),
      })),
      (Pst = d.object({
        projectRoot: d.string().default(""),
        generatedAtMs: d.number().nullable(),
        currentSuggestionIds: d.array(d.string()),
        suggestions: d.array(Tst),
      })));
  });
var Jq = g(() => {
  "use strict";
});
var wle = g(() => {
  "use strict";
  Jq();
});
var _le = g(() => {
  "use strict";
});
var ag,
  xle = g(() => {
    "use strict";
    ag = class {
      handlers = new Set();
      subscribe(e) {
        return (
          this.handlers.add(e),
          {
            dispose: () => {
              this.handlers.delete(e);
            },
          }
        );
      }
      emit(e, r = Date.now()) {
        for (let n of this.handlers) n({ type: e, at: r });
      }
    };
  });
var Ale = g(() => {
  "use strict";
});
var ks,
  uw,
  Xrr,
  dw = g(() => {
    "use strict";
    $();
    ((ks = {
      automationModel: "gpt-6.1-sol",
      ephemeralGenerationModel: "gpt-6-luna",
      ephemeralVisualizationModel: "gpt-6.1-terra",
      ambientSuggestionsModel: "gpt-6-luna",
      ambientSuggestionsSafetyModel: "gpt-6-luna",
    }),
      (uw = d.string().trim().min(1)),
      (Xrr = d.object({
        codex_automation_model_slug: uw.catch(ks.automationModel),
        codex_ephemeral_generation_model_slug: uw.catch(ks.ephemeralGenerationModel),
        codex_ephemeral_visualization_model_slug: uw.catch(ks.ephemeralVisualizationModel),
        codex_ambient_suggestions_model_slug: uw.catch(ks.ambientSuggestionsModel),
        codex_ambient_suggestions_safety_model_slug: uw.catch(ks.ambientSuggestionsSafetyModel),
      })));
  });
var Qq,
  enr,
  Rle,
  Ist,
  kst,
  Dst,
  Mst,
  Ost,
  Ele,
  uI,
  tnr,
  Cle = g(() => {
    "use strict";
    $();
    dw();
    ((Qq = 1e4),
      (enr = `Automation instructions exceed the ${Qq.toLocaleString("en-US")}-token limit.`),
      (Rle = d.object({ id: d.string().min(1), identity: d.string().min(1) })),
      (Ist = d.enum(["ACTIVE", "PAUSED", "DELETED"])),
      (kst = d.enum(["cron", "heartbeat"])),
      (Dst = d.enum(["worktree", "local"])),
      (Mst = d.discriminatedUnion("type", [
        d.object({ type: d.literal("project"), project_id: d.string() }),
        d.object({ type: d.literal("projectless") }),
      ])),
      (Ost = d.enum(["failed_runs_only"])),
      (Ele = d.enum(["none", "minimal", "low", "medium", "high", "xhigh", "max", "ultra"])),
      (uI = d.object({
        version: d.number().optional(),
        id: d.string(),
        kind: kst.optional(),
        name: d.string(),
        prompt: d.string(),
        status: Ist,
        rrule: d.string().optional(),
        execution_environment: Dst.optional(),
        local_environment_config_path: d.string().optional(),
        model: d.string().optional(),
        reasoning_effort: Ele.optional(),
        plugin_template_id: d.string().optional(),
        target: Mst.optional(),
        notification_policy: Ost.optional(),
        auto_archive: d.boolean().optional(),
        model_prompt_sha256: d.string().optional(),
        cwds: d.array(d.string()).optional(),
        target_thread_id: d.string().optional(),
        created_at: d.number(),
        updated_at: d.number(),
      })),
      (tnr = ks.automationModel));
  });
var Tle = g(() => {
  "use strict";
});
var Ple = g(() => {
  "use strict";
  Tle();
});
var Ile = g(() => {
  "use strict";
});
var lnr,
  kle = g(() => {
    "use strict";
    $();
    lnr = d.discriminatedUnion("kind", [
      d.object({ kind: d.literal("new-chat") }),
      d.object({ kind: d.literal("orbit") }),
      d.object({ kind: d.literal("space") }),
      d.object({
        kind: d.literal("chat"),
        accountId: d.string().min(1).max(256),
        conversationId: d.string().min(1).max(256),
        projectId: d.string().max(256).nullable(),
      }),
    ]);
  });
var Dle,
  dnr,
  Mle,
  eG = g(() => {
    "use strict";
    $();
    ((Dle = { Codex: "codex", ChatGPT: "chatgpt" }),
      (dnr = d.enum([Dle.Codex, Dle.ChatGPT])),
      (Mle = d.preprocess(
        (t) => (t === "codex-light" || t === "codex-dark" ? "codex-system" : t),
        d.enum(["app-default", "codex-system", "space-system"]),
      )));
  });
var Rp = A((mnr, Ole) => {
  var Nst = Sp(),
    Lst = Aa(),
    Bst = "[object Symbol]";
  function Fst(t) {
    return typeof t == "symbol" || (Lst(t) && Nst(t) == Bst);
  }
  Ole.exports = Fst;
});
var dI = A((fnr, Nle) => {
  var $st = Qi(),
    Ust = Rp(),
    qst = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    Gst = /^\w*$/;
  function Wst(t, e) {
    if ($st(t)) return !1;
    var r = typeof t;
    return r == "number" || r == "symbol" || r == "boolean" || t == null || Ust(t)
      ? !0
      : Gst.test(t) || !qst.test(t) || (e != null && t in Object(e));
  }
  Nle.exports = Wst;
});
var Fle = A((hnr, Ble) => {
  var Lle = KP(),
    Hst = "Expected a function";
  function tG(t, e) {
    if (typeof t != "function" || (e != null && typeof e != "function")) throw new TypeError(Hst);
    var r = function () {
      var n = arguments,
        o = e ? e.apply(this, n) : n[0],
        i = r.cache;
      if (i.has(o)) return i.get(o);
      var s = t.apply(this, n);
      return ((r.cache = i.set(o, s) || i), s);
    };
    return ((r.cache = new (tG.Cache || Lle)()), r);
  }
  tG.Cache = Lle;
  Ble.exports = tG;
});
var Ule = A((gnr, $le) => {
  var jst = Fle(),
    zst = 500;
  function Vst(t) {
    var e = jst(t, function (n) {
        return (r.size === zst && r.clear(), n);
      }),
      r = e.cache;
    return e;
  }
  $le.exports = Vst;
});
var Gle = A((ynr, qle) => {
  var Kst = Ule(),
    Zst =
      /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
    Xst = /\\(\\)?/g,
    Yst = Kst(function (t) {
      var e = [];
      return (
        t.charCodeAt(0) === 46 && e.push(""),
        t.replace(Zst, function (r, n, o, i) {
          e.push(o ? i.replace(Xst, "$1") : n || r);
        }),
        e
      );
    });
  qle.exports = Yst;
});
var rG = A((vnr, Wle) => {
  function Jst(t, e) {
    for (var r = -1, n = t == null ? 0 : t.length, o = Array(n); ++r < n; ) o[r] = e(t[r], r, t);
    return o;
  }
  Wle.exports = Jst;
});
var Zle = A((bnr, Kle) => {
  var Hle = bp(),
    Qst = rG(),
    eat = Qi(),
    tat = Rp(),
    rat = 1 / 0,
    jle = Hle ? Hle.prototype : void 0,
    zle = jle ? jle.toString : void 0;
  function Vle(t) {
    if (typeof t == "string") return t;
    if (eat(t)) return Qst(t, Vle) + "";
    if (tat(t)) return zle ? zle.call(t) : "";
    var e = t + "";
    return e == "0" && 1 / t == -rat ? "-0" : e;
  }
  Kle.exports = Vle;
});
var Ep = A((Snr, Xle) => {
  var nat = Zle();
  function oat(t) {
    return t == null ? "" : nat(t);
  }
  Xle.exports = oat;
});
var Cp = A((wnr, Yle) => {
  var iat = Qi(),
    sat = dI(),
    aat = Gle(),
    lat = Ep();
  function cat(t, e) {
    return iat(t) ? t : sat(t, e) ? [t] : aat(lat(t));
  }
  Yle.exports = cat;
});
var Tp = A((_nr, Jle) => {
  var uat = Rp(),
    dat = 1 / 0;
  function pat(t) {
    if (typeof t == "string" || uat(t)) return t;
    var e = t + "";
    return e == "0" && 1 / t == -dat ? "-0" : e;
  }
  Jle.exports = pat;
});
var nG = A((xnr, ece) => {
  var mat = ZP(),
    fat = Cp(),
    hat = iw(),
    Qle = ei(),
    gat = Tp();
  function yat(t, e, r, n) {
    if (!Qle(t)) return t;
    e = fat(e, t);
    for (var o = -1, i = e.length, s = i - 1, a = t; a != null && ++o < i; ) {
      var l = gat(e[o]),
        c = r;
      if (l === "__proto__" || l === "constructor" || l === "prototype") return t;
      if (o != s) {
        var u = a[l];
        ((c = n ? n(u, l, a) : void 0), c === void 0 && (c = Qle(u) ? u : hat(e[o + 1]) ? [] : {}));
      }
      (mat(a, l, c), (a = a[l]));
    }
    return t;
  }
  ece.exports = yat;
});
var rce = A((Anr, tce) => {
  var vat = nG();
  function bat(t, e, r) {
    return t == null ? t : vat(t, e, r);
  }
  tce.exports = bat;
});
var oce = A((Rnr, nce) => {
  function Sat(t) {
    var e = t == null ? 0 : t.length;
    return e ? t[e - 1] : void 0;
  }
  nce.exports = Sat;
});
var pw = A((Enr, ice) => {
  var wat = Cp(),
    _at = Tp();
  function xat(t, e) {
    e = wat(e, t);
    for (var r = 0, n = e.length; t != null && r < n; ) t = t[_at(e[r++])];
    return r && r == n ? t : void 0;
  }
  ice.exports = xat;
});
var pI = A((Cnr, sce) => {
  function Aat(t, e, r) {
    var n = -1,
      o = t.length;
    (e < 0 && (e = -e > o ? 0 : o + e),
      (r = r > o ? o : r),
      r < 0 && (r += o),
      (o = e > r ? 0 : (r - e) >>> 0),
      (e >>>= 0));
    for (var i = Array(o); ++n < o; ) i[n] = t[n + e];
    return i;
  }
  sce.exports = Aat;
});
var lce = A((Tnr, ace) => {
  var Rat = pw(),
    Eat = pI();
  function Cat(t, e) {
    return e.length < 2 ? t : Rat(t, Eat(e, 0, -1));
  }
  ace.exports = Cat;
});
var oG = A((Pnr, uce) => {
  var Tat = Cp(),
    Pat = oce(),
    Iat = lce(),
    cce = Tp(),
    kat = Object.prototype,
    Dat = kat.hasOwnProperty;
  function Mat(t, e) {
    e = Tat(e, t);
    var r = -1,
      n = e.length;
    if (!n) return !0;
    for (; ++r < n; ) {
      var o = cce(e[r]);
      if (
        (o === "__proto__" && !Dat.call(t, "__proto__")) ||
        ((o === "constructor" || o === "prototype") && r < n - 1)
      )
        return !1;
    }
    var i = Iat(t, e);
    return i == null || delete i[cce(Pat(e))];
  }
  uce.exports = Mat;
});
var pce = A((Inr, dce) => {
  var Oat = oG();
  function Nat(t, e) {
    return t == null ? !0 : Oat(t, e);
  }
  dce.exports = Nat;
});
var mce = g(() => {
  "use strict";
});
var Lat,
  Bat,
  Fat,
  Onr,
  fce = g(() => {
    "use strict";
    ((Lat = F(rce())), (Bat = F(pce())));
    mce();
    ((Fat = [
      "app/installed",
      "config/batchWrite",
      "config/read",
      "configRequirements/read",
      "command/exec",
      "environment/info",
      "model/list",
      "permissionProfile/list",
      "thread/archive",
      "thread/list",
      "thread/metadata/update",
      "thread/name/set",
      "thread/read",
      "thread/queue/add",
      "thread/queue/list",
      "thread/queue/update",
      "thread/queue/delete",
      "thread/queue/reorder",
      "thread/realtime/appendAudio",
      "thread/realtime/appendSpeech",
      "thread/realtime/appendText",
      "thread/realtime/listVoices",
      "thread/realtime/start",
      "thread/realtime/stop",
      "thread/resume",
      "thread/settings/update",
      "thread/start",
      "thread/startAeon",
      "thread/stop",
      "thread/items/list",
      "thread/inject_items",
      "thread/turns/list",
      "thread/unarchive",
      "turn/addUserMessage",
      "turn/interrupt",
      "turn/start",
      "turn/steer",
    ]),
      (Onr = new Set(Fat)));
  });
function hce(t, e) {
  return t.kind === "chatgpt"
    ? e.kind === "chatgpt" && t.accountId === e.accountId && t.userId === e.userId
    : e.kind === "execution-storage" && t.authMode === e.authMode;
}
var Lnr,
  gce = g(() => {
    "use strict";
    Lnr = Date.parse("2026-11-10T08:45:10Z") / 1e3;
  });
var yce = g(() => {
  "use strict";
});
var vce = g(() => {
  "use strict";
});
var iG = g(() => {
  "use strict";
});
function cu(t, e) {
  let r = sG(t),
    n = sG(e);
  if (r == null || n == null) return 0;
  let o = Uat(r, n);
  if (o !== 0) return o;
  let i = r.prerelease,
    s = n.prerelease;
  if (i.length === 0 && s.length === 0) return 0;
  if (i.length === 0) return 1;
  if (s.length === 0) return -1;
  let a = Math.max(i.length, s.length);
  for (let l = 0; l < a; l += 1) {
    let c = i[l],
      u = s[l];
    if (c == null) return -1;
    if (u == null) return 1;
    if (c !== u)
      return typeof c == "number" && typeof u == "number"
        ? c - u
        : typeof c == "number"
          ? -1
          : typeof u == "number"
            ? 1
            : c.localeCompare(u);
  }
  return 0;
}
function lg(t) {
  return sG(t) != null;
}
function Uat(t, e) {
  return t.major !== e.major
    ? t.major - e.major
    : t.minor !== e.minor
      ? t.minor - e.minor
      : t.patch !== e.patch
        ? t.patch - e.patch
        : 0;
}
function sG(t) {
  let e = $at.exec(t);
  return e?.groups == null
    ? null
    : {
        major: Number(e.groups.major),
        minor: Number(e.groups.minor),
        patch: Number(e.groups.patch),
        prerelease:
          e.groups.prerelease?.split(".").map((r) => (/^(0|[1-9]\d*)$/.test(r) ? Number(r) : r)) ??
          [],
      };
}
var $at,
  cg = g(() => {
    "use strict";
    $at =
      /^(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*)(?:-(?<prerelease>[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
  });
