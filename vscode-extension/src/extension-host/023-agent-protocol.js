var bxe = g(() => {});
var Sxe,
  UCr,
  Tz = g(() => {
    ((Sxe = F(Cz())), (UCr = 7 * 24 * 60 * 60));
  });
var wxe,
  w_t,
  nTr,
  oTr,
  iTr,
  _xe,
  sTr,
  __t,
  x_t,
  aTr,
  lTr,
  H0,
  dm = g(() => {
    O();
    wxe = F(Cz());
    D0();
    $();
    Bn();
    um();
    bxe();
    Tz();
    ((w_t = 1),
      (nTr = uI.extend({
        status: uI.shape.status
          .or(d.literal("DISABLED"))
          .transform((t) => (t === "DISABLED" ? "PAUSED" : t)),
      })),
      (oTr = uI.extend({
        version: d.literal(w_t).optional(),
        status: d.literal("DISABLED"),
        kind: d.literal("heartbeat"),
        target_thread_id: d.string().trim().max(0).optional(),
      })),
      (iTr = 5 * 60),
      (_xe = new Set(["freq", "interval", "dtstart", "tzid"])),
      (sTr = new Set([..._xe, "count", "until"])),
      (__t = new Set([..._xe, "byweekday", "byminute"])),
      (x_t = new Set([...__t, "byhour", "bysecond"])),
      (aTr = new Set([...x_t, "count"])),
      (lTr = Rle.extend({ threadId: d.string().min(1) })),
      (H0 =
        "((? = 1 AND automations.account_id IS NULL AND automations.user_id IS NULL AND automations.installation_id IS NULL) OR (automations.account_id = ? AND automations.user_id = ? AND automations.installation_id = ?))"));
  });
var xxe = g(() => {
  O();
});
var Rxe = g(() => {
  O();
  vxe();
  $u();
  dm();
  xxe();
});
var Pz = g(() => {
  O();
});
var P_t,
  kTr,
  DTr,
  Exe = g(() => {
    O();
    $();
    Pz();
    cm();
    ((P_t = d.object({
      chatgptAccountId: d.string().min(1),
      backendOrigin: d.string().refine((t) => {
        let e = URL.parse(t);
        return e?.protocol === "https:" && e.origin === t;
      }),
      accountRoutingOverride: d.enum(["NO_CONSTRAINT", "us", "us_cr", "eu_cr"]),
    })),
      (kTr = d.object({
        account: d.object({ type: d.string() }).nullable(),
        workspaceRouting: P_t.nullable().optional(),
      })),
      (DTr = d.object({
        requirements: d
          .object({
            chatgptBaseUrl: d.string().nullable().optional(),
            enforceResidency: d.string().nullable().optional(),
            application: d.object({ network: d.unknown().optional() }).nullable().optional(),
          })
          .nullable(),
      })));
  });
var H_ = g(() => {});
var FTr,
  Cxe = g(() => {
    O();
    $();
    H_();
    FTr = d.object({
      readState: d
        .object({
          firstUnread: d
            .discriminatedUnion("type", [
              d.object({ type: d.literal("threadStart") }),
              d.object({ type: d.literal("turn"), turnId: d.string() }),
            ])
            .nullable(),
          revision: d.string(),
        })
        .nullable(),
    });
  });
var kz = g(() => {});
var Txe = g(() => {
  kz();
});
var Pxe,
  Dz,
  jTr,
  Mz = g(() => {
    O();
    ((Pxe = "memories"), (Dz = "chronicle"), (jTr = new Set([TI(Pxe), TI(Dz)])));
  });
var Ixe = g(() => {
  O();
  Txe();
  Mz();
});
function Oz(t) {
  return (
    t === "thread/start" ||
    t === "thread/startAeon" ||
    t === "thread/fork" ||
    t === "thread/inject_items" ||
    t === "thread/queue/add" ||
    t === "turn/addUserMessage" ||
    t === "turn/start" ||
    t === "turn/steer"
  );
}
var j0 = g(() => {
  "use strict";
});
var kxe = g(() => {
  O();
});
var Ga = g(() => {});
var Nz = g(() => {});
var Dxe = g(() => {
  O();
  Sq();
  j0();
  kxe();
  Ga();
  Nz();
});
var Mxe = g(() => {});
var j_ = g(() => {});
var bPr,
  Oxe = g(() => {
    O();
    $();
    j_();
    bPr = d.object({
      method: d.literal("error"),
      params: d.object({
        error: d.object({ message: d.string() }),
        threadId: d.literal("__remote_control_transport__"),
        turnId: d.literal("__remote_control_transport__"),
        willRetry: d.literal(!1),
      }),
    });
  });
var xPr,
  APr,
  Nxe = g(() => {
    Ik();
    $();
    ((xPr = 6 * 1024), (APr = d.record(d.string(), d.unknown())));
  });
var Yg = g(() => {
  O();
});
var Lxe = g(() => {
  O();
  Yg();
});
var Bxe = g(() => {
  O();
  Lxe();
});
var Lz,
  O_t,
  z_,
  Fxe = g(() => {
    "use strict";
    $();
    ((Lz = d
      .string()
      .regex(/^[A-Za-z0-9_-]{1,48}$/)
      .refine((t) => t !== "__proto__" && t !== "constructor" && t !== "prototype")),
      (O_t = d.object({
        fieldIds: d.array(Lz).max(6),
        id: Lz,
        label: d.string().trim().min(1).max(120),
      })),
      (z_ = d.object({
        accountUsername: d.string().max(320).regex(/\S/).optional(),
        credentialUse: d.literal("credential_reference_v1").optional(),
        fields: d
          .array(
            d.object({
              autocomplete: d.string().nullish(),
              id: Lz,
              label: d.string(),
              required: d.boolean(),
              type: d.enum(["email", "number", "password", "search", "tel", "text", "url"]),
            }),
          )
          .max(6),
        options: d.array(O_t).max(10).optional(),
        origin: d.url().refine((t) => {
          let e = new URL(t).protocol;
          return e === "https:" || e === "http:";
        }),
        qrCode: d.boolean().optional(),
        qrCodePayload: d.string().optional(),
        qrCodeRequiresApp: d.boolean().optional(),
        qrCodeUrl: d.string().optional(),
        reason: d.string(),
        registrableDomain: d.string().optional(),
        webauthn: d.unknown().optional(),
      })));
  });
var N_t,
  L_t,
  B_t,
  F_t,
  UPr,
  qPr,
  GPr,
  $xe = g(() => {
    "use strict";
    $();
    ((N_t = "connector_20205bf7d4e99a89d7154bb849718324"),
      (L_t = d.strictObject({
        approval_version: d.literal(1),
        binding_name: d.string(),
        column: d.string(),
        deployment_id: d.string(),
        new_value: d.string(),
        old_value: d.string().nullable(),
        primary_key_column: d.string(),
        primary_key_value: d.string(),
        project_id: d.string(),
        table_name: d.string(),
      })),
      (B_t = d
        .strictObject({
          approval_version: d.literal(1),
          binding_name: d.string(),
          deployment_id: d.string(),
          operation: d.literal("insert"),
          primary_key_column: d.string(),
          primary_key_value: d.string(),
          project_id: d.string(),
          table_name: d.string(),
          values: d.record(d.string(), d.string()),
        })
        .refine((t) => t.values[t.primary_key_column] === t.primary_key_value)),
      (F_t = d
        .strictObject({
          approval_version: d.literal(1),
          binding_name: d.string(),
          deployment_id: d.string(),
          operation: d.literal("delete"),
          primary_key_column: d.string(),
          primary_key_value: d.string(),
          project_id: d.string(),
          table_name: d.string(),
          values: d.record(
            d.string(),
            d.union([
              d.string(),
              d.number().int().min(Number.MIN_SAFE_INTEGER).max(Number.MAX_SAFE_INTEGER),
              d.null(),
            ]),
          ),
        })
        .refine((t) => {
          let e = t.values[t.primary_key_column];
          return e != null && String(e) === t.primary_key_value;
        })),
      (UPr = d.union([L_t, B_t, F_t])),
      (qPr = d
        .object({
          codex_approval_kind: d.literal("mcp_tool_call"),
          connector_id: d.literal(N_t),
          tool_name: d.json().optional(),
          tool_params: d.json().optional(),
        })
        .loose()),
      (GPr = d.record(d.string(), d.json())));
  });
var Uxe,
  $_t,
  U_t,
  qxe,
  ZPr,
  XPr,
  q_t,
  YPr,
  JPr,
  Gxe,
  G_t,
  W_t,
  H_t,
  j_t,
  QPr,
  z_t,
  eIr,
  Bz = g(() => {
    "use strict";
    $();
    Fxe();
    $P();
    $xe();
    ((Uxe = d.enum(["session", "always"])),
      ($_t = d.union([Uxe, d.array(Uxe).min(1).max(2)]).optional()),
      (U_t = d.literal("always").optional()),
      (qxe = z_.shape.options.unwrap().element),
      (ZPr = d.object({
        screenshot: d.object({
          tabId: d
            .string()
            .regex(/^[1-9]\d*$/)
            .refine((t) => Number.isSafeInteger(Number(t))),
        }),
      })),
      (XPr = z_.omit({ accountUsername: !0, credentialUse: !0 }).extend({
        account_username: z_.shape.accountUsername,
        browser_auth_credential_use: z_.shape.credentialUse,
        browser_auth_challenge_id: d.string().regex(/^[A-Za-z0-9_-]{32,128}$/),
        options: d
          .array(
            qxe
              .omit({ fieldIds: !0 })
              .extend({ field_ids: qxe.shape.fieldIds })
              .transform(({ field_ids: t, ...e }) => ({ ...e, fieldIds: t })),
          )
          .max(10)
          .optional(),
      })),
      (q_t = d
        .object({
          is_auth_failure: d.literal(!0),
          connector_id: d.string(),
          connector_name: d.string(),
          install_url: d.string(),
          auth_reason: d.string().optional(),
          link_id: d.string().optional(),
          requested_scopes: d.array(d.string().trim().min(1)).optional(),
          connection_consent: d
            .object({
              type: d.literal("consent"),
              origin: d.url(),
              connection_id: d.string().min(1).max(255),
              scopes: d.array(d.object({ scope: d.string(), label: d.string().min(1) })),
            })
            .optional(),
        })
        .loose()),
      (YPr = d.object({ _codex_apps: d.object({ connector_auth_failure: q_t }) }).loose()),
      (JPr = d
        .object({
          name: d.string().trim().min(1),
          value: d.json(),
          display_name: d.string().trim().min(1).optional(),
        })
        .transform(({ name: t, value: e, display_name: r }) => ({
          name: t,
          value: e,
          displayName: r ?? t,
        }))),
      (Gxe = {
        codex_approval_kind: d.literal("tool_suggestion"),
        suggest_type: d.enum(["install", "enable"]),
        suggest_reason: d.string(),
        tool_id: d.string(),
        tool_name: d.string(),
        persist: U_t,
      }),
      (G_t = d
        .object({ ...Gxe, tool_type: d.literal("connector"), install_url: d.string() })
        .loose()),
      (W_t = d
        .object({
          ...Gxe,
          tool_type: d.literal("plugin"),
          install_url: d.string().optional(),
          remote_plugin_id: d.string().trim().min(1).optional(),
          suggestion_id: d.string().optional(),
        })
        .loose()),
      (H_t = d.discriminatedUnion("tool_type", [G_t, W_t])),
      (j_t = d
        .object({
          codex_approval_kind: d.literal("mcp_tool_call"),
          codex_request_type: d.literal("approval_request").optional(),
          connector_id: d.string(),
          connector_name: d.string().optional(),
          tool_name: d.string().optional(),
          tool_title: d.string().optional(),
          tool_params: d.record(d.string(), d.json()),
          tool_params_display: d.unknown().optional(),
          persist: $_t,
        })
        .loose()),
      (QPr = d.discriminatedUnion("codex_approval_kind", [H_t, j_t])),
      (z_t = d.enum(["low", "high"])),
      (eIr = d.object({
        riskLevel: d.preprocess((t) => t ?? void 0, z_t.optional()),
        subtitle: d.preprocess((t) => t ?? void 0, d.string().optional()),
      })));
  });
var Wxe = g(() => {
  "use strict";
});
var Fz,
  $z = g(() => {
    "use strict";
    Bz();
    Bz();
    Wxe();
    Fz = "openai/elicitation";
  });
var Uz = g(() => {
  O();
  $z();
});
var Hxe = g(() => {
  O();
  Uz();
  j_();
});
var jxe = g(() => {});
var zxe = g(() => {
  "use strict";
});
var Kxe = A((xIr, Vxe) => {
  "use strict";
  Vxe.exports = function () {};
});
var Uu = A((AIr, Zxe) => {
  "use strict";
  var K_t = Kxe()();
  Zxe.exports = function (t) {
    return t !== K_t && t !== null;
  };
});
var qz = A((RIr, Xxe) => {
  "use strict";
  var Z_t = Uu(),
    X_t = Array.prototype.forEach,
    Y_t = Object.create,
    J_t = function (t, e) {
      var r;
      for (r in t) e[r] = t[r];
    };
  Xxe.exports = function (t) {
    var e = Y_t(null);
    return (
      X_t.call(arguments, function (r) {
        Z_t(r) && J_t(Object(r), e);
      }),
      e
    );
  };
});
var Jxe = A((EIr, Yxe) => {
  "use strict";
  Yxe.exports = function () {
    var t = Math.sign;
    return typeof t != "function" ? !1 : t(10) === 1 && t(-20) === -1;
  };
});
var eAe = A((CIr, Qxe) => {
  "use strict";
  Qxe.exports = function (t) {
    return ((t = Number(t)), isNaN(t) || t === 0 ? t : t > 0 ? 1 : -1);
  };
});
var rAe = A((TIr, tAe) => {
  "use strict";
  tAe.exports = Jxe()() ? Math.sign : eAe();
});
var oAe = A((PIr, nAe) => {
  "use strict";
  var Q_t = rAe(),
    ext = Math.abs,
    txt = Math.floor;
  nAe.exports = function (t) {
    return isNaN(t) ? 0 : ((t = Number(t)), t === 0 || !isFinite(t) ? t : Q_t(t) * txt(ext(t)));
  };
});
var qu = A((IIr, iAe) => {
  "use strict";
  var rxt = oAe(),
    nxt = Math.max;
  iAe.exports = function (t) {
    return nxt(0, rxt(t));
  };
});
var Gz = A((kIr, sAe) => {
  "use strict";
  var oxt = qu();
  sAe.exports = function (t, e, r) {
    var n;
    return isNaN(t) ? ((n = e), n >= 0 ? (r && n ? n - 1 : n) : 1) : t === !1 ? !1 : oxt(t);
  };
});
var sc = A((DIr, aAe) => {
  "use strict";
  aAe.exports = function (t) {
    if (typeof t != "function") throw new TypeError(t + " is not a function");
    return t;
  };
});
var pm = A((MIr, lAe) => {
  "use strict";
  var ixt = Uu();
  lAe.exports = function (t) {
    if (!ixt(t)) throw new TypeError("Cannot use null or undefined");
    return t;
  };
});
var dAe = A((OIr, uAe) => {
  "use strict";
  var sxt = sc(),
    axt = pm(),
    lxt = Function.prototype.bind,
    cAe = Function.prototype.call,
    cxt = Object.keys,
    uxt = Object.prototype.propertyIsEnumerable;
  uAe.exports = function (t, e) {
    return function (r, n) {
      var o,
        i = arguments[2],
        s = arguments[3];
      return (
        (r = Object(axt(r))),
        sxt(n),
        (o = cxt(r)),
        s && o.sort(typeof s == "function" ? lxt.call(s, r) : void 0),
        typeof t != "function" && (t = o[t]),
        cAe.call(t, o, function (a, l) {
          return uxt.call(r, a) ? cAe.call(n, i, r[a], a, r, l) : e;
        })
      );
    };
  };
});
var V_ = A((NIr, pAe) => {
  "use strict";
  pAe.exports = dAe()("forEach");
});
var Gu = A(() => {
  "use strict";
});
var fAe = A((FIr, mAe) => {
  "use strict";
  mAe.exports = function () {
    var t = Object.assign,
      e;
    return typeof t != "function"
      ? !1
      : ((e = { foo: "raz" }),
        t(e, { bar: "dwa" }, { trzy: "trzy" }),
        e.foo + e.bar + e.trzy === "razdwatrzy");
  };
});
var gAe = A(($Ir, hAe) => {
  "use strict";
  hAe.exports = function () {
    try {
      return (Object.keys("primitive"), !0);
    } catch {
      return !1;
    }
  };
});
var vAe = A((UIr, yAe) => {
  "use strict";
  var dxt = Uu(),
    pxt = Object.keys;
  yAe.exports = function (t) {
    return pxt(dxt(t) ? Object(t) : t);
  };
});
var SAe = A((qIr, bAe) => {
  "use strict";
  bAe.exports = gAe()() ? Object.keys : vAe();
});
var _Ae = A((GIr, wAe) => {
  "use strict";
  var mxt = SAe(),
    fxt = pm(),
    hxt = Math.max;
  wAe.exports = function (t, e) {
    var r,
      n,
      o = hxt(arguments.length, 2),
      i;
    for (
      t = Object(fxt(t)),
        i = function (s) {
          try {
            t[s] = e[s];
          } catch (a) {
            r || (r = a);
          }
        },
        n = 1;
      n < o;
      ++n
    )
      ((e = arguments[n]), mxt(e).forEach(i));
    if (r !== void 0) throw r;
    return t;
  };
});
var Wz = A((WIr, xAe) => {
  "use strict";
  xAe.exports = fAe()() ? Object.assign : _Ae();
});
var RAe = A((HIr, AAe) => {
  "use strict";
  var gxt = Uu(),
    yxt = { function: !0, object: !0 };
  AAe.exports = function (t) {
    return (gxt(t) && yxt[typeof t]) || !1;
  };
});
var CAe = A((jIr, jz) => {
  "use strict";
  var vxt = Wz(),
    bxt = RAe(),
    Hz = Uu(),
    EAe = Error.captureStackTrace;
  jz.exports = function (t) {
    var e = new Error(t),
      r = arguments[1],
      n = arguments[2];
    return (
      Hz(n) || (bxt(r) && ((n = r), (r = null))),
      Hz(n) && vxt(e, n),
      Hz(r) && (e.code = r),
      EAe && EAe(e, jz.exports),
      e
    );
  };
});
var zz = A((zIr, DAe) => {
  "use strict";
  var TAe = pm(),
    PAe = Object.defineProperty,
    IAe = Object.getOwnPropertyDescriptor,
    Sxt = Object.getOwnPropertyNames,
    kAe = Object.getOwnPropertySymbols;
  DAe.exports = function (t, e) {
    var r,
      n = Object(TAe(e));
    if (
      ((t = Object(TAe(t))),
      Sxt(n).forEach(function (o) {
        try {
          PAe(t, o, IAe(e, o));
        } catch (i) {
          r = i;
        }
      }),
      typeof kAe == "function" &&
        kAe(n).forEach(function (o) {
          try {
            PAe(t, o, IAe(e, o));
          } catch (i) {
            r = i;
          }
        }),
      r !== void 0)
    )
      throw r;
    return t;
  };
});
var Zz = A((VIr, Kz) => {
  "use strict";
  var MAe = qu(),
    BAe = function (t, e) {
      return e;
    },
    Vz,
    OAe,
    NAe,
    LAe;
  try {
    Object.defineProperty(BAe, "length", {
      configurable: !0,
      writable: !1,
      enumerable: !1,
      value: 1,
    });
  } catch {}
  BAe.length === 1
    ? ((Vz = { configurable: !0, writable: !1, enumerable: !1 }),
      (OAe = Object.defineProperty),
      (Kz.exports = function (t, e) {
        return ((e = MAe(e)), t.length === e ? t : ((Vz.value = e), OAe(t, "length", Vz)));
      }))
    : ((LAe = zz()),
      (NAe = (function () {
        var t = [];
        return function (e) {
          var r,
            n = 0;
          if (t[e]) return t[e];
          for (r = []; e--; ) r.push("a" + (++n).toString(36));
          return new Function(
            "fn",
            "return function (" + r.join(", ") + ") { return fn.apply(this, arguments); };",
          );
        };
      })()),
      (Kz.exports = function (t, e) {
        var r;
        if (((e = MAe(e)), t.length === e)) return t;
        r = NAe(e)(t);
        try {
          LAe(r, t);
        } catch {}
        return r;
      }));
});
var Xz = A((KIr, FAe) => {
  "use strict";
  var wxt = void 0;
  FAe.exports = function (t) {
    return t !== wxt && t !== null;
  };
});
var UAe = A((ZIr, $Ae) => {
  "use strict";
  var _xt = Xz(),
    xxt = { object: !0, function: !0, undefined: !0 };
  $Ae.exports = function (t) {
    return _xt(t) ? hasOwnProperty.call(xxt, typeof t) : !1;
  };
});
var GAe = A((XIr, qAe) => {
  "use strict";
  var Axt = UAe();
  qAe.exports = function (t) {
    if (!Axt(t)) return !1;
    try {
      return t.constructor ? t.constructor.prototype === t : !1;
    } catch {
      return !1;
    }
  };
});
var HAe = A((YIr, WAe) => {
  "use strict";
  var Rxt = GAe();
  WAe.exports = function (t) {
    if (typeof t != "function" || !hasOwnProperty.call(t, "length")) return !1;
    try {
      if (
        typeof t.length != "number" ||
        typeof t.call != "function" ||
        typeof t.apply != "function"
      )
        return !1;
    } catch {
      return !1;
    }
    return !Rxt(t);
  };
});
var zAe = A((JIr, jAe) => {
  "use strict";
  var Ext = HAe(),
    Cxt = /^\s*class[\s{/}]/,
    Txt = Function.prototype.toString;
  jAe.exports = function (t) {
    return !(!Ext(t) || Cxt.test(Txt.call(t)));
  };
});
var KAe = A((QIr, VAe) => {
  "use strict";
  var Yz = "razdwatrzy";
  VAe.exports = function () {
    return typeof Yz.contains != "function"
      ? !1
      : Yz.contains("dwa") === !0 && Yz.contains("foo") === !1;
  };
});
var XAe = A((ekr, ZAe) => {
  "use strict";
  var Pxt = String.prototype.indexOf;
  ZAe.exports = function (t) {
    return Pxt.call(this, t, arguments[1]) > -1;
  };
});
var JAe = A((tkr, YAe) => {
  "use strict";
  YAe.exports = KAe()() ? String.prototype.contains : XAe();
});
var Wu = A((rkr, rRe) => {
  "use strict";
  var V0 = Xz(),
    QAe = zAe(),
    eRe = Wz(),
    tRe = qz(),
    K_ = JAe(),
    Ixt = (rRe.exports = function (t, e) {
      var r, n, o, i, s;
      return (
        arguments.length < 2 || typeof t != "string"
          ? ((i = e), (e = t), (t = null))
          : (i = arguments[2]),
        V0(t)
          ? ((r = K_.call(t, "c")), (n = K_.call(t, "e")), (o = K_.call(t, "w")))
          : ((r = o = !0), (n = !1)),
        (s = { value: e, configurable: r, enumerable: n, writable: o }),
        i ? eRe(tRe(i), s) : s
      );
    });
  Ixt.gs = function (t, e, r) {
    var n, o, i, s;
    return (
      typeof t != "string" ? ((i = r), (r = e), (e = t), (t = null)) : (i = arguments[3]),
      V0(e)
        ? QAe(e)
          ? V0(r)
            ? QAe(r) || ((i = r), (r = void 0))
            : (r = void 0)
          : ((i = e), (e = r = void 0))
        : (e = void 0),
      V0(t) ? ((n = K_.call(t, "c")), (o = K_.call(t, "e"))) : ((n = !0), (o = !1)),
      (s = { get: e, set: r, configurable: n, enumerable: o }),
      i ? eRe(tRe(i), s) : s
    );
  };
});
var lRe = A((s4, aRe) => {
  "use strict";
  var K0 = Wu(),
    t4 = sc(),
    e4 = Function.prototype.apply,
    Jz = Function.prototype.call,
    nRe = Object.create,
    kxt = Object.defineProperty,
    oRe = Object.defineProperties,
    r4 = Object.prototype.hasOwnProperty,
    Qz = { configurable: !0, enumerable: !1, writable: !0 },
    Z0,
    n4,
    X0,
    o4,
    iRe,
    i4,
    sRe;
  Z0 = function (t, e) {
    var r;
    return (
      t4(e),
      r4.call(this, "__ee__")
        ? (r = this.__ee__)
        : ((r = Qz.value = nRe(null)), kxt(this, "__ee__", Qz), (Qz.value = null)),
      r[t] ? (typeof r[t] == "object" ? r[t].push(e) : (r[t] = [r[t], e])) : (r[t] = e),
      this
    );
  };
  n4 = function (t, e) {
    var r, n;
    return (
      t4(e),
      (n = this),
      Z0.call(
        this,
        t,
        (r = function () {
          (X0.call(n, t, r), e4.call(e, this, arguments));
        }),
      ),
      (r.__eeOnceListener__ = e),
      this
    );
  };
  X0 = function (t, e) {
    var r, n, o, i;
    if ((t4(e), !r4.call(this, "__ee__"))) return this;
    if (((r = this.__ee__), !r[t])) return this;
    if (((n = r[t]), typeof n == "object"))
      for (i = 0; (o = n[i]); ++i)
        (o === e || o.__eeOnceListener__ === e) &&
          (n.length === 2 ? (r[t] = n[i ? 0 : 1]) : n.splice(i, 1));
    else (n === e || n.__eeOnceListener__ === e) && delete r[t];
    return this;
  };
  o4 = function (t) {
    var e, r, n, o, i;
    if (r4.call(this, "__ee__") && ((o = this.__ee__[t]), !!o))
      if (typeof o == "object") {
        for (r = arguments.length, i = new Array(r - 1), e = 1; e < r; ++e) i[e - 1] = arguments[e];
        for (o = o.slice(), e = 0; (n = o[e]); ++e) e4.call(n, this, i);
      } else
        switch (arguments.length) {
          case 1:
            Jz.call(o, this);
            break;
          case 2:
            Jz.call(o, this, arguments[1]);
            break;
          case 3:
            Jz.call(o, this, arguments[1], arguments[2]);
            break;
          default:
            for (r = arguments.length, i = new Array(r - 1), e = 1; e < r; ++e)
              i[e - 1] = arguments[e];
            e4.call(o, this, i);
        }
  };
  iRe = { on: Z0, once: n4, off: X0, emit: o4 };
  i4 = { on: K0(Z0), once: K0(n4), off: K0(X0), emit: K0(o4) };
  sRe = oRe({}, i4);
  aRe.exports = s4 = function (t) {
    return t == null ? nRe(sRe) : oRe(Object(t), i4);
  };
  s4.methods = iRe;
});
var uRe = A((nkr, cRe) => {
  "use strict";
  cRe.exports = function () {
    var t = Array.from,
      e,
      r;
    return typeof t != "function"
      ? !1
      : ((e = ["raz", "dwa"]), (r = t(e)), !!(r && r !== e && r[1] === "dwa"));
  };
});
var pRe = A((okr, dRe) => {
  "use strict";
  dRe.exports = function () {
    return typeof globalThis != "object" || !globalThis ? !1 : globalThis.Array === Array;
  };
});
var hRe = A((ikr, fRe) => {
  var mRe = function () {
    if (typeof self == "object" && self) return self;
    if (typeof window == "object" && window) return window;
    throw new Error("Unable to resolve global `this`");
  };
  fRe.exports = (function () {
    if (this) return this;
    try {
      Object.defineProperty(Object.prototype, "__global__", {
        get: function () {
          return this;
        },
        configurable: !0,
      });
    } catch {
      return mRe();
    }
    try {
      return __global__ || mRe();
    } finally {
      delete Object.prototype.__global__;
    }
  })();
});
var Z_ = A((skr, gRe) => {
  "use strict";
  gRe.exports = pRe()() ? globalThis : hRe();
});
var vRe = A((akr, yRe) => {
  "use strict";
  var Dxt = Z_(),
    a4 = { object: !0, symbol: !0 };
  yRe.exports = function () {
    var t = Dxt.Symbol,
      e;
    if (typeof t != "function") return !1;
    e = t("test symbol");
    try {
      String(e);
    } catch {
      return !1;
    }
    return !(!a4[typeof t.iterator] || !a4[typeof t.toPrimitive] || !a4[typeof t.toStringTag]);
  };
});
var SRe = A((lkr, bRe) => {
  "use strict";
  bRe.exports = function (t) {
    return t
      ? typeof t == "symbol"
        ? !0
        : !t.constructor || t.constructor.name !== "Symbol"
          ? !1
          : t[t.constructor.toStringTag] === "Symbol"
      : !1;
  };
});
var l4 = A((ckr, wRe) => {
  "use strict";
  var Mxt = SRe();
  wRe.exports = function (t) {
    if (!Mxt(t)) throw new TypeError(t + " is not a symbol");
    return t;
  };
});
var ERe = A((ukr, RRe) => {
  "use strict";
  var _Re = Wu(),
    Oxt = Object.create,
    xRe = Object.defineProperty,
    Nxt = Object.prototype,
    ARe = Oxt(null);
  RRe.exports = function (t) {
    for (var e = 0, r, n; ARe[t + (e || "")]; ) ++e;
    return (
      (t += e || ""),
      (ARe[t] = !0),
      (r = "@@" + t),
      xRe(
        Nxt,
        r,
        _Re.gs(null, function (o) {
          n || ((n = !0), xRe(this, r, _Re(o)), (n = !1));
        }),
      ),
      r
    );
  };
});
var TRe = A((dkr, CRe) => {
  "use strict";
  var Ws = Wu(),
    Kr = Z_().Symbol;
  CRe.exports = function (t) {
    return Object.defineProperties(t, {
      hasInstance: Ws("", (Kr && Kr.hasInstance) || t("hasInstance")),
      isConcatSpreadable: Ws("", (Kr && Kr.isConcatSpreadable) || t("isConcatSpreadable")),
      iterator: Ws("", (Kr && Kr.iterator) || t("iterator")),
      match: Ws("", (Kr && Kr.match) || t("match")),
      replace: Ws("", (Kr && Kr.replace) || t("replace")),
      search: Ws("", (Kr && Kr.search) || t("search")),
      species: Ws("", (Kr && Kr.species) || t("species")),
      split: Ws("", (Kr && Kr.split) || t("split")),
      toPrimitive: Ws("", (Kr && Kr.toPrimitive) || t("toPrimitive")),
      toStringTag: Ws("", (Kr && Kr.toStringTag) || t("toStringTag")),
      unscopables: Ws("", (Kr && Kr.unscopables) || t("unscopables")),
    });
  };
});
var kRe = A((pkr, IRe) => {
  "use strict";
  var PRe = Wu(),
    Lxt = l4(),
    X_ = Object.create(null);
  IRe.exports = function (t) {
    return Object.defineProperties(t, {
      for: PRe(function (e) {
        return X_[e] ? X_[e] : (X_[e] = t(String(e)));
      }),
      keyFor: PRe(function (e) {
        var r;
        Lxt(e);
        for (r in X_) if (X_[r] === e) return r;
      }),
    });
  };
});
var ORe = A((mkr, MRe) => {
  "use strict";
  var Wa = Wu(),
    c4 = l4(),
    Y0 = Z_().Symbol,
    Bxt = ERe(),
    Fxt = TRe(),
    $xt = kRe(),
    Uxt = Object.create,
    u4 = Object.defineProperties,
    J0 = Object.defineProperty,
    vo,
    Jg,
    DRe;
  if (typeof Y0 == "function")
    try {
      (String(Y0()), (DRe = !0));
    } catch {}
  else Y0 = null;
  Jg = function (e) {
    if (this instanceof Jg) throw new TypeError("Symbol is not a constructor");
    return vo(e);
  };
  MRe.exports = vo = function t(e) {
    var r;
    if (this instanceof t) throw new TypeError("Symbol is not a constructor");
    return DRe
      ? Y0(e)
      : ((r = Uxt(Jg.prototype)),
        (e = e === void 0 ? "" : String(e)),
        u4(r, { __description__: Wa("", e), __name__: Wa("", Bxt(e)) }));
  };
  Fxt(vo);
  $xt(vo);
  u4(Jg.prototype, {
    constructor: Wa(vo),
    toString: Wa("", function () {
      return this.__name__;
    }),
  });
  u4(vo.prototype, {
    toString: Wa(function () {
      return "Symbol (" + c4(this).__description__ + ")";
    }),
    valueOf: Wa(function () {
      return c4(this);
    }),
  });
  J0(
    vo.prototype,
    vo.toPrimitive,
    Wa("", function () {
      var t = c4(this);
      return typeof t == "symbol" ? t : t.toString();
    }),
  );
  J0(vo.prototype, vo.toStringTag, Wa("c", "Symbol"));
  J0(Jg.prototype, vo.toStringTag, Wa("c", vo.prototype[vo.toStringTag]));
  J0(Jg.prototype, vo.toPrimitive, Wa("c", vo.prototype[vo.toPrimitive]));
});
var LRe = A((fkr, NRe) => {
  "use strict";
  NRe.exports = vRe()() ? Z_().Symbol : ORe();
});
var $Re = A((hkr, FRe) => {
  "use strict";
  var BRe = Object.prototype.toString,
    qxt = BRe.call(
      (function () {
        return arguments;
      })(),
    );
  FRe.exports = function (t) {
    return BRe.call(t) === qxt;
  };
});
var qRe = A((gkr, URe) => {
  "use strict";
  var Gxt = Object.prototype.toString,
    Wxt = RegExp.prototype.test.bind(/^[object [A-Za-z0-9]*Function]$/);
  URe.exports = function (t) {
    return typeof t == "function" && Wxt(Gxt.call(t));
  };
});
var HRe = A((ykr, WRe) => {
  "use strict";
  var GRe = Object.prototype.toString,
    Hxt = GRe.call("");
  WRe.exports = function (t) {
    return (
      typeof t == "string" ||
      (t && typeof t == "object" && (t instanceof String || GRe.call(t) === Hxt)) ||
      !1
    );
  };
});
var KRe = A((vkr, VRe) => {
  "use strict";
  var jxt = LRe().iterator,
    zxt = $Re(),
    Vxt = qRe(),
    Kxt = qu(),
    jRe = sc(),
    Zxt = pm(),
    Xxt = Uu(),
    Yxt = HRe(),
    zRe = Array.isArray,
    d4 = Function.prototype.call,
    mm = { configurable: !0, enumerable: !0, writable: !0, value: null },
    p4 = Object.defineProperty;
  VRe.exports = function (t) {
    var e = arguments[1],
      r = arguments[2],
      n,
      o,
      i,
      s,
      a,
      l,
      c,
      u,
      p,
      m;
    if (((t = Object(Zxt(t))), Xxt(e) && jRe(e), !this || this === Array || !Vxt(this))) {
      if (!e) {
        if (zxt(t))
          return (
            (a = t.length),
            a !== 1 ? Array.apply(null, t) : ((s = new Array(1)), (s[0] = t[0]), s)
          );
        if (zRe(t)) {
          for (s = new Array((a = t.length)), o = 0; o < a; ++o) s[o] = t[o];
          return s;
        }
      }
      s = [];
    } else n = this;
    if (!zRe(t)) {
      if ((p = t[jxt]) !== void 0) {
        for (c = jRe(p).call(t), n && (s = new n()), u = c.next(), o = 0; !u.done; )
          ((m = e ? d4.call(e, r, u.value, o) : u.value),
            n ? ((mm.value = m), p4(s, o, mm)) : (s[o] = m),
            (u = c.next()),
            ++o);
        a = o;
      } else if (Yxt(t)) {
        for (a = t.length, n && (s = new n()), o = 0, i = 0; o < a; ++o)
          ((m = t[o]),
            o + 1 < a && ((l = m.charCodeAt(0)), l >= 55296 && l <= 56319 && (m += t[++o])),
            (m = e ? d4.call(e, r, m, i) : m),
            n ? ((mm.value = m), p4(s, i, mm)) : (s[i] = m),
            ++i);
        a = i;
      }
    }
    if (a === void 0)
      for (a = Kxt(t.length), n && (s = new n(a)), o = 0; o < a; ++o)
        ((m = e ? d4.call(e, r, t[o], o) : t[o]), n ? ((mm.value = m), p4(s, o, mm)) : (s[o] = m));
    return (n && ((mm.value = null), (s.length = a)), s);
  };
});
var Q0 = A((bkr, ZRe) => {
  "use strict";
  ZRe.exports = uRe()() ? Array.from : KRe();
});
var YRe = A((Skr, XRe) => {
  "use strict";
  var Jxt = Q0(),
    Qxt = Array.isArray;
  XRe.exports = function (t) {
    return Qxt(t) ? t : Jxt(t);
  };
});
var eEe = A((wkr, QRe) => {
  "use strict";
  var eAt = YRe(),
    tAt = Uu(),
    rAt = sc(),
    nAt = Array.prototype.slice,
    JRe;
  JRe = function (t) {
    return this.map(function (e, r) {
      return e ? e(t[r]) : t[r];
    }).concat(nAt.call(t, this.length));
  };
  QRe.exports = function (t) {
    return (
      (t = eAt(t)),
      t.forEach(function (e) {
        tAt(e) && rAt(e);
      }),
      JRe.bind(t)
    );
  };
});
var rEe = A((_kr, tEe) => {
  "use strict";
  var eD = sc();
  tEe.exports = function (t) {
    var e;
    return typeof t == "function"
      ? { set: t, get: t }
      : ((e = { get: eD(t.get) }),
        t.set !== void 0
          ? ((e.set = eD(t.set)),
            t.delete && (e.delete = eD(t.delete)),
            t.clear && (e.clear = eD(t.clear)),
            e)
          : ((e.set = e.get), e));
  };
});
var sEe = A((xkr, iEe) => {
  "use strict";
  var tD = CAe(),
    rD = Zz(),
    Y_ = Wu(),
    oEe = lRe().methods,
    oAt = eEe(),
    iAt = rEe(),
    m4 = Function.prototype.apply,
    f4 = Function.prototype.call,
    nEe = Object.create,
    sAt = Object.defineProperties,
    aAt = oEe.on,
    lAt = oEe.emit;
  iEe.exports = function (t, e, r) {
    var n = nEe(null),
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
      _;
    return (
      e !== !1 ? (i = e) : isNaN(t.length) ? (i = 1) : (i = t.length),
      r.normalizer &&
        ((f = iAt(r.normalizer)), (s = f.get), (a = f.set), (l = f.delete), (c = f.clear)),
      r.resolvers != null && (_ = oAt(r.resolvers)),
      s
        ? (w = rD(function (S) {
            var E,
              T,
              P = arguments;
            if ((_ && (P = _(P)), (E = s(P)), E !== null && hasOwnProperty.call(n, E)))
              return (h && o.emit("get", E, P, this), n[E]);
            if (
              (P.length === 1 ? (T = f4.call(t, this, P[0])) : (T = m4.call(t, this, P)),
              E === null)
            ) {
              if (((E = s(P)), E !== null)) throw tD("Circular invocation", "CIRCULAR_INVOCATION");
              E = a(P);
            } else if (hasOwnProperty.call(n, E))
              throw tD("Circular invocation", "CIRCULAR_INVOCATION");
            return ((n[E] = T), v && o.emit("set", E, null, T), T);
          }, i))
        : e === 0
          ? (w = function () {
              var S;
              if (hasOwnProperty.call(n, "data"))
                return (h && o.emit("get", "data", arguments, this), n.data);
              if (
                (arguments.length ? (S = m4.call(t, this, arguments)) : (S = f4.call(t, this)),
                hasOwnProperty.call(n, "data"))
              )
                throw tD("Circular invocation", "CIRCULAR_INVOCATION");
              return ((n.data = S), v && o.emit("set", "data", null, S), S);
            })
          : (w = function (S) {
              var E,
                T = arguments,
                P;
              if ((_ && (T = _(arguments)), (P = String(T[0])), hasOwnProperty.call(n, P)))
                return (h && o.emit("get", P, T, this), n[P]);
              if (
                (T.length === 1 ? (E = f4.call(t, this, T[0])) : (E = m4.call(t, this, T)),
                hasOwnProperty.call(n, P))
              )
                throw tD("Circular invocation", "CIRCULAR_INVOCATION");
              return ((n[P] = E), v && o.emit("set", P, null, E), E);
            }),
      (o = {
        original: t,
        memoized: w,
        profileName: r.profileName,
        get: function (S) {
          return (_ && (S = _(S)), s ? s(S) : String(S[0]));
        },
        has: function (S) {
          return hasOwnProperty.call(n, S);
        },
        delete: function (S) {
          var E;
          hasOwnProperty.call(n, S) &&
            (l && l(S), (E = n[S]), delete n[S], y && o.emit("delete", S, E));
        },
        clear: function () {
          var S = n;
          (c && c(), (n = nEe(null)), o.emit("clear", S));
        },
        on: function (S, E) {
          return (
            S === "get" ? (h = !0) : S === "set" ? (v = !0) : S === "delete" && (y = !0),
            aAt.call(this, S, E)
          );
        },
        emit: lAt,
        updateEnv: function () {
          t = o.original;
        },
      }),
      s
        ? (u = rD(function (S) {
            var E,
              T = arguments;
            (_ && (T = _(T)), (E = s(T)), E !== null && o.delete(E));
          }, i))
        : e === 0
          ? (u = function () {
              return o.delete("data");
            })
          : (u = function (S) {
              return (_ && (S = _(arguments)[0]), o.delete(S));
            }),
      (p = rD(function () {
        var S,
          E = arguments;
        return e === 0 ? n.data : (_ && (E = _(E)), s ? (S = s(E)) : (S = String(E[0])), n[S]);
      })),
      (m = rD(function () {
        var S,
          E = arguments;
        return e === 0
          ? o.has("data")
          : (_ && (E = _(E)), s ? (S = s(E)) : (S = String(E[0])), S === null ? !1 : o.has(S));
      })),
      sAt(w, { __memoized__: Y_(!0), delete: Y_(u), clear: Y_(o.clear), _get: Y_(p), _has: Y_(m) }),
      o
    );
  };
});
var cEe = A((Akr, lEe) => {
  "use strict";
  var cAt = sc(),
    uAt = V_(),
    aEe = Gu(),
    dAt = sEe(),
    pAt = Gz();
  lEe.exports = function t(e) {
    var r, n, o;
    if ((cAt(e), (r = Object(arguments[1])), r.async && r.promise))
      throw new Error("Options 'async' and 'promise' cannot be used together");
    return hasOwnProperty.call(e, "__memoized__") && !r.force
      ? e
      : ((n = pAt(r.length, e.length, r.async && aEe.async)),
        (o = dAt(e, n, r)),
        uAt(aEe, function (i, s) {
          r[s] && i(r[s], o, r);
        }),
        t.__profiler__ && t.__profiler__(o),
        o.updateEnv(),
        o.memoized);
  };
});
var dEe = A((Rkr, uEe) => {
  "use strict";
  uEe.exports = function (t) {
    var e,
      r,
      n = t.length;
    if (!n) return "";
    for (e = String(t[(r = 0)]); --n; ) e += "" + t[++r];
    return e;
  };
});
var mEe = A((Ekr, pEe) => {
  "use strict";
  pEe.exports = function (t) {
    return t
      ? function (e) {
          for (var r = String(e[0]), n = 0, o = t; --o; ) r += "" + e[++n];
          return r;
        }
      : function () {
          return "";
        };
  };
});
var hEe = A((Ckr, fEe) => {
  "use strict";
  fEe.exports = function () {
    var t = Number.isNaN;
    return typeof t != "function" ? !1 : !t({}) && t(NaN) && !t(34);
  };
});
var yEe = A((Tkr, gEe) => {
  "use strict";
  gEe.exports = function (t) {
    return t !== t;
  };
});
var bEe = A((Pkr, vEe) => {
  "use strict";
  vEe.exports = hEe()() ? Number.isNaN : yEe();
});
var nD = A((Ikr, xEe) => {
  "use strict";
  var SEe = bEe(),
    wEe = qu(),
    mAt = pm(),
    fAt = Array.prototype.indexOf,
    hAt = Object.prototype.hasOwnProperty,
    gAt = Math.abs,
    _Ee = Math.floor;
  xEe.exports = function (t) {
    var e, r, n, o;
    if (!SEe(t)) return fAt.apply(this, arguments);
    for (
      r = wEe(mAt(this).length),
        n = arguments[1],
        isNaN(n) ? (n = 0) : n >= 0 ? (n = _Ee(n)) : (n = wEe(this.length) - _Ee(gAt(n))),
        e = n;
      e < r;
      ++e
    )
      if (hAt.call(this, e) && ((o = this[e]), SEe(o))) return e;
    return -1;
  };
});
var EEe = A((kkr, REe) => {
  "use strict";
  var Qg = nD(),
    AEe = Object.create;
  REe.exports = function () {
    var t = 0,
      e = [],
      r = AEe(null);
    return {
      get: function (n) {
        var o = 0,
          i = e,
          s,
          a = n.length;
        if (a === 0) return i[a] || null;
        if ((i = i[a])) {
          for (; o < a - 1; ) {
            if (((s = Qg.call(i[0], n[o])), s === -1)) return null;
            ((i = i[1][s]), ++o);
          }
          return ((s = Qg.call(i[0], n[o])), s === -1 ? null : i[1][s] || null);
        }
        return null;
      },
      set: function (n) {
        var o = 0,
          i = e,
          s,
          a = n.length;
        if (a === 0) i[a] = ++t;
        else {
          for (i[a] || (i[a] = [[], []]), i = i[a]; o < a - 1; )
            ((s = Qg.call(i[0], n[o])),
              s === -1 && ((s = i[0].push(n[o]) - 1), i[1].push([[], []])),
              (i = i[1][s]),
              ++o);
          ((s = Qg.call(i[0], n[o])), s === -1 && (s = i[0].push(n[o]) - 1), (i[1][s] = ++t));
        }
        return ((r[t] = n), t);
      },
      delete: function (n) {
        var o = 0,
          i = e,
          s,
          a = r[n],
          l = a.length,
          c = [];
        if (l === 0) delete i[l];
        else if ((i = i[l])) {
          for (; o < l - 1; ) {
            if (((s = Qg.call(i[0], a[o])), s === -1)) return;
            (c.push(i, s), (i = i[1][s]), ++o);
          }
          if (((s = Qg.call(i[0], a[o])), s === -1)) return;
          for (n = i[1][s], i[0].splice(s, 1), i[1].splice(s, 1); !i[0].length && c.length; )
            ((s = c.pop()), (i = c.pop()), i[0].splice(s, 1), i[1].splice(s, 1));
        }
        delete r[n];
      },
      clear: function () {
        ((e = []), (r = AEe(null)));
      },
    };
  };
});
var PEe = A((Dkr, TEe) => {
  "use strict";
  var CEe = nD();
  TEe.exports = function () {
    var t = 0,
      e = [],
      r = [];
    return {
      get: function (n) {
        var o = CEe.call(e, n[0]);
        return o === -1 ? null : r[o];
      },
      set: function (n) {
        return (e.push(n[0]), r.push(++t), t);
      },
      delete: function (n) {
        var o = CEe.call(r, n);
        o !== -1 && (e.splice(o, 1), r.splice(o, 1));
      },
      clear: function () {
        ((e = []), (r = []));
      },
    };
  };
});
var DEe = A((Mkr, kEe) => {
  "use strict";
  var ey = nD(),
    IEe = Object.create;
  kEe.exports = function (t) {
    var e = 0,
      r = [[], []],
      n = IEe(null);
    return {
      get: function (o) {
        for (var i = 0, s = r, a; i < t - 1; ) {
          if (((a = ey.call(s[0], o[i])), a === -1)) return null;
          ((s = s[1][a]), ++i);
        }
        return ((a = ey.call(s[0], o[i])), a === -1 ? null : s[1][a] || null);
      },
      set: function (o) {
        for (var i = 0, s = r, a; i < t - 1; )
          ((a = ey.call(s[0], o[i])),
            a === -1 && ((a = s[0].push(o[i]) - 1), s[1].push([[], []])),
            (s = s[1][a]),
            ++i);
        return (
          (a = ey.call(s[0], o[i])),
          a === -1 && (a = s[0].push(o[i]) - 1),
          (s[1][a] = ++e),
          (n[e] = o),
          e
        );
      },
      delete: function (o) {
        for (var i = 0, s = r, a, l = [], c = n[o]; i < t - 1; ) {
          if (((a = ey.call(s[0], c[i])), a === -1)) return;
          (l.push(s, a), (s = s[1][a]), ++i);
        }
        if (((a = ey.call(s[0], c[i])), a !== -1)) {
          for (o = s[1][a], s[0].splice(a, 1), s[1].splice(a, 1); !s[0].length && l.length; )
            ((a = l.pop()), (s = l.pop()), s[0].splice(a, 1), s[1].splice(a, 1));
          delete n[o];
        }
      },
      clear: function () {
        ((r = [[], []]), (n = IEe(null)));
      },
    };
  };
});
var h4 = A((Okr, MEe) => {
  "use strict";
  var yAt = sc(),
    vAt = V_(),
    bAt = Function.prototype.call;
  MEe.exports = function (t, e) {
    var r = {},
      n = arguments[2];
    return (
      yAt(e),
      vAt(t, function (o, i, s, a) {
        r[i] = bAt.call(e, n, o, i, s, a);
      }),
      r
    );
  };
});
var iD = A((Nkr, NEe) => {
  "use strict";
  var oD = function (t) {
      if (typeof t != "function") throw new TypeError(t + " is not a function");
      return t;
    },
    OEe = function (t) {
      var e = document.createTextNode(""),
        r,
        n,
        o = 0;
      return (
        new t(function () {
          var i;
          if (r) n && (r = n.concat(r));
          else {
            if (!n) return;
            r = n;
          }
          if (((n = r), (r = null), typeof n == "function")) {
            ((i = n), (n = null), i());
            return;
          }
          for (e.data = o = ++o % 2; n; ) ((i = n.shift()), n.length || (n = null), i());
        }).observe(e, { characterData: !0 }),
        function (i) {
          if ((oD(i), r)) {
            typeof r == "function" ? (r = [r, i]) : r.push(i);
            return;
          }
          ((r = i), (e.data = o = ++o % 2));
        }
      );
    };
  NEe.exports = (function () {
    if (typeof process == "object" && process && typeof process.nextTick == "function")
      return process.nextTick;
    if (typeof queueMicrotask == "function")
      return function (t) {
        queueMicrotask(oD(t));
      };
    if (typeof document == "object" && document) {
      if (typeof MutationObserver == "function") return OEe(MutationObserver);
      if (typeof WebKitMutationObserver == "function") return OEe(WebKitMutationObserver);
    }
    return typeof setImmediate == "function"
      ? function (t) {
          setImmediate(oD(t));
        }
      : typeof setTimeout == "function" || typeof setTimeout == "object"
        ? function (t) {
            setTimeout(oD(t), 0);
          }
        : null;
  })();
});
var FEe = A(() => {
  "use strict";
  var LEe = Q0(),
    SAt = h4(),
    wAt = zz(),
    _At = Zz(),
    BEe = iD(),
    g4 = Array.prototype.slice,
    ty = Function.prototype.apply,
    y4 = Object.create;
  Gu().async = function (t, e) {
    var r = y4(null),
      n = y4(null),
      o = e.memoized,
      i = e.original,
      s,
      a,
      l;
    e.memoized = _At(function (c) {
      var u = arguments,
        p = u[u.length - 1];
      return (
        typeof p == "function" && ((s = p), (u = g4.call(u, 0, -1))),
        o.apply((a = this), (l = u))
      );
    }, o);
    try {
      wAt(e.memoized, o);
    } catch {}
    (e.on("get", function (c) {
      var u, p, m;
      if (s) {
        if (r[c]) {
          (typeof r[c] == "function" ? (r[c] = [r[c], s]) : r[c].push(s), (s = null));
          return;
        }
        ((u = s),
          (p = a),
          (m = l),
          (s = a = l = null),
          BEe(function () {
            var f;
            hasOwnProperty.call(n, c)
              ? ((f = n[c]), e.emit("getasync", c, m, p), ty.call(u, f.context, f.args))
              : ((s = u), (a = p), (l = m), o.apply(p, m));
          }));
      }
    }),
      (e.original = function () {
        var c, u, p, m;
        return s
          ? ((c = LEe(arguments)),
            (u = function f(h) {
              var v,
                y,
                w = f.id;
              if (w == null) {
                BEe(ty.bind(f, this, arguments));
                return;
              }
              if ((delete f.id, (v = r[w]), delete r[w], !!v))
                return (
                  (y = LEe(arguments)),
                  e.has(w) &&
                    (h
                      ? e.delete(w)
                      : ((n[w] = { context: this, args: y }),
                        e.emit("setasync", w, typeof v == "function" ? 1 : v.length))),
                  typeof v == "function"
                    ? (m = ty.call(v, this, y))
                    : v.forEach(function (_) {
                        m = ty.call(_, this, y);
                      }, this),
                  m
                );
            }),
            (p = s),
            (s = a = l = null),
            c.push(u),
            (m = ty.call(i, this, c)),
            (u.cb = p),
            (s = u),
            m)
          : ty.call(i, this, arguments);
      }),
      e.on("set", function (c) {
        if (!s) {
          e.delete(c);
          return;
        }
        (r[c]
          ? typeof r[c] == "function"
            ? (r[c] = [r[c], s.cb])
            : r[c].push(s.cb)
          : (r[c] = s.cb),
          delete s.cb,
          (s.id = c),
          (s = null));
      }),
      e.on("delete", function (c) {
        var u;
        hasOwnProperty.call(r, c) ||
          (n[c] && ((u = n[c]), delete n[c], e.emit("deleteasync", c, g4.call(u.args, 1))));
      }),
      e.on("clear", function () {
        var c = n;
        ((n = y4(null)),
          e.emit(
            "clearasync",
            SAt(c, function (u) {
              return g4.call(u.args, 1);
            }),
          ));
      }));
  };
});
var UEe = A((Fkr, $Ee) => {
  "use strict";
  var xAt = Array.prototype.forEach,
    AAt = Object.create;
  $Ee.exports = function (t) {
    var e = AAt(null);
    return (
      xAt.call(arguments, function (r) {
        e[r] = !0;
      }),
      e
    );
  };
});
var v4 = A(($kr, qEe) => {
  "use strict";
  qEe.exports = function (t) {
    return typeof t == "function";
  };
});
var WEe = A((Ukr, GEe) => {
  "use strict";
  var RAt = v4();
  GEe.exports = function (t) {
    try {
      return t && RAt(t.toString) ? t.toString() : String(t);
    } catch {
      throw new TypeError("Passed argument cannot be stringifed");
    }
  };
});
var jEe = A((qkr, HEe) => {
  "use strict";
  var EAt = pm(),
    CAt = WEe();
  HEe.exports = function (t) {
    return CAt(EAt(t));
  };
});
var VEe = A((Gkr, zEe) => {
  "use strict";
  var TAt = v4();
  zEe.exports = function (t) {
    try {
      return t && TAt(t.toString) ? t.toString() : String(t);
    } catch {
      return "<Non-coercible to string value>";
    }
  };
});
var ZEe = A((Wkr, KEe) => {
  "use strict";
  var PAt = VEe(),
    IAt = /[\n\r\u2028\u2029]/g;
  KEe.exports = function (t) {
    var e = PAt(t);
    return (
      e.length > 100 && (e = e.slice(0, 99) + "\u2026"),
      (e = e.replace(IAt, function (r) {
        return JSON.stringify(r).slice(1, -1);
      })),
      e
    );
  };
});
var S4 = A((Hkr, b4) => {
  b4.exports = XEe;
  b4.exports.default = XEe;
  function XEe(t) {
    return !!t && (typeof t == "object" || typeof t == "function") && typeof t.then == "function";
  }
});
var JEe = A(() => {
  "use strict";
  var kAt = h4(),
    DAt = UEe(),
    MAt = jEe(),
    OAt = ZEe(),
    YEe = S4(),
    w4 = iD(),
    ry = Object.create,
    NAt = DAt("then", "then:finally", "done", "done:finally");
  Gu().promise = function (t, e) {
    var r = ry(null),
      n = ry(null),
      o = ry(null);
    if (t === !0) t = null;
    else if (((t = MAt(t)), !NAt[t]))
      throw new TypeError("'" + OAt(t) + "' is not valid promise mode");
    (e.on("set", function (i, s, a) {
      var l = !1;
      if (!YEe(a)) {
        ((n[i] = a), e.emit("setasync", i, 1));
        return;
      }
      ((r[i] = 1), (o[i] = a));
      var c = function (f) {
          var h = r[i];
          if (l)
            throw new Error(`Memoizee error: Detected unordered then|done & finally resolution, which in turn makes proper detection of success/failure impossible (when in 'done:finally' mode)
Consider to rely on 'then' or 'done' mode instead.`);
          h && (delete r[i], (n[i] = f), e.emit("setasync", i, h));
        },
        u = function () {
          ((l = !0), r[i] && (delete r[i], delete o[i], e.delete(i)));
        },
        p = t;
      if ((p || (p = "then"), p === "then")) {
        var m = function () {
          w4(u);
        };
        ((a = a.then(function (f) {
          w4(c.bind(this, f));
        }, m)),
          typeof a.finally == "function" && a.finally(m));
      } else if (p === "done") {
        if (typeof a.done != "function")
          throw new Error(
            "Memoizee error: Retrieved promise does not implement 'done' in 'done' mode",
          );
        a.done(c, u);
      } else if (p === "done:finally") {
        if (typeof a.done != "function")
          throw new Error(
            "Memoizee error: Retrieved promise does not implement 'done' in 'done:finally' mode",
          );
        if (typeof a.finally != "function")
          throw new Error(
            "Memoizee error: Retrieved promise does not implement 'finally' in 'done:finally' mode",
          );
        (a.done(c), a.finally(u));
      }
    }),
      e.on("get", function (i, s, a) {
        var l;
        if (r[i]) {
          ++r[i];
          return;
        }
        l = o[i];
        var c = function () {
          e.emit("getasync", i, s, a);
        };
        YEe(l)
          ? typeof l.done == "function"
            ? l.done(c)
            : l.then(function () {
                w4(c);
              })
          : c();
      }),
      e.on("delete", function (i) {
        if ((delete o[i], r[i])) {
          delete r[i];
          return;
        }
        if (hasOwnProperty.call(n, i)) {
          var s = n[i];
          (delete n[i], e.emit("deleteasync", i, [s]));
        }
      }),
      e.on("clear", function () {
        var i = n;
        ((n = ry(null)),
          (r = ry(null)),
          (o = ry(null)),
          e.emit(
            "clearasync",
            kAt(i, function (s) {
              return [s];
            }),
          ));
      }));
  };
});
var eCe = A(() => {
  "use strict";
  var LAt = sc(),
    QEe = V_(),
    _4 = Gu(),
    BAt = Function.prototype.apply;
  _4.dispose = function (t, e, r) {
    var n;
    if ((LAt(t), (r.async && _4.async) || (r.promise && _4.promise))) {
      (e.on(
        "deleteasync",
        (n = function (o, i) {
          BAt.call(t, null, i);
        }),
      ),
        e.on("clearasync", function (o) {
          QEe(o, function (i, s) {
            n(s, i);
          });
        }));
      return;
    }
    (e.on(
      "delete",
      (n = function (o, i) {
        t(i);
      }),
    ),
      e.on("clear", function (o) {
        QEe(o, function (i, s) {
          n(s, i);
        });
      }));
  };
});
var rCe = A((Zkr, tCe) => {
  "use strict";
  tCe.exports = 2147483647;
});
var oCe = A((Xkr, nCe) => {
  "use strict";
  var FAt = qu(),
    $At = rCe();
  nCe.exports = function (t) {
    if (((t = FAt(t)), t > $At)) throw new TypeError(t + " exceeds maximum possible timeout");
    return t;
  };
});
var sCe = A(() => {
  "use strict";
  var UAt = Q0(),
    iCe = V_(),
    qAt = iD(),
    GAt = S4(),
    WAt = oCe(),
    x4 = Gu(),
    J_ = Function.prototype,
    HAt = Math.max,
    jAt = Math.min,
    zAt = Object.create;
  x4.maxAge = function (t, e, r) {
    var n, o, i, s;
    ((t = WAt(t)),
      t &&
        ((n = zAt(null)),
        (o = (r.async && x4.async) || (r.promise && x4.promise) ? "async" : ""),
        e.on("set" + o, function (a) {
          ((n[a] = setTimeout(function () {
            e.delete(a);
          }, t)),
            typeof n[a].unref == "function" && n[a].unref(),
            s &&
              (s[a] && s[a] !== "nextTick" && clearTimeout(s[a]),
              (s[a] = setTimeout(function () {
                delete s[a];
              }, i)),
              typeof s[a].unref == "function" && s[a].unref()));
        }),
        e.on("delete" + o, function (a) {
          (clearTimeout(n[a]),
            delete n[a],
            s && (s[a] !== "nextTick" && clearTimeout(s[a]), delete s[a]));
        }),
        r.preFetch &&
          (r.preFetch === !0 || isNaN(r.preFetch)
            ? (i = 0.333)
            : (i = HAt(jAt(Number(r.preFetch), 1), 0)),
          i &&
            ((s = {}),
            (i = (1 - i) * t),
            e.on("get" + o, function (a, l, c) {
              s[a] ||
                ((s[a] = "nextTick"),
                qAt(function () {
                  var u;
                  s[a] === "nextTick" &&
                    (delete s[a],
                    e.delete(a),
                    r.async && ((l = UAt(l)), l.push(J_)),
                    (u = e.memoized.apply(c, l)),
                    r.promise &&
                      GAt(u) &&
                      (typeof u.done == "function" ? u.done(J_, J_) : u.then(J_, J_)));
                }));
            }))),
        e.on("clear" + o, function () {
          (iCe(n, function (a) {
            clearTimeout(a);
          }),
            (n = {}),
            s &&
              (iCe(s, function (a) {
                a !== "nextTick" && clearTimeout(a);
              }),
              (s = {})));
        })));
  };
});
var cCe = A((Qkr, lCe) => {
  "use strict";
  var VAt = qu(),
    sD = Object.create,
    aCe = Object.prototype.hasOwnProperty;
  lCe.exports = function (t) {
    var e = 0,
      r = 1,
      n = sD(null),
      o = sD(null),
      i = 0,
      s;
    return (
      (t = VAt(t)),
      {
        hit: function (a) {
          var l = o[a],
            c = ++i;
          if (((n[c] = a), (o[a] = c), !l)) return (++e, e <= t ? void 0 : ((a = n[r]), s(a), a));
          if ((delete n[l], r === l)) for (; !aCe.call(n, ++r); );
        },
        delete: (s = function (a) {
          var l = o[a];
          if (l && (delete n[l], delete o[a], --e, r === l)) {
            if (!e) {
              ((i = 0), (r = 1));
              return;
            }
            for (; !aCe.call(n, ++r); );
          }
        }),
        clear: function () {
          ((e = 0), (r = 1), (n = sD(null)), (o = sD(null)), (i = 0));
        },
      }
    );
  };
});
var uCe = A(() => {
  "use strict";
  var KAt = qu(),
    ZAt = cCe(),
    A4 = Gu();
  A4.max = function (t, e, r) {
    var n, o, i;
    ((t = KAt(t)),
      t &&
        ((o = ZAt(t)),
        (n = (r.async && A4.async) || (r.promise && A4.promise) ? "async" : ""),
        e.on(
          "set" + n,
          (i = function (s) {
            ((s = o.hit(s)), s !== void 0 && e.delete(s));
          }),
        ),
        e.on("get" + n, i),
        e.on("delete" + n, o.delete),
        e.on("clear" + n, o.clear)));
  };
});
var pCe = A(() => {
  "use strict";
  var dCe = Wu(),
    R4 = Gu(),
    XAt = Object.create,
    YAt = Object.defineProperties;
  R4.refCounter = function (t, e, r) {
    var n, o;
    ((n = XAt(null)),
      (o = (r.async && R4.async) || (r.promise && R4.promise) ? "async" : ""),
      e.on("set" + o, function (i, s) {
        n[i] = s || 1;
      }),
      e.on("get" + o, function (i) {
        ++n[i];
      }),
      e.on("delete" + o, function (i) {
        delete n[i];
      }),
      e.on("clear" + o, function () {
        n = {};
      }),
      YAt(e.memoized, {
        deleteRef: dCe(function () {
          var i = e.get(arguments);
          return i === null || !n[i] ? null : --n[i] ? !1 : (e.delete(i), !0);
        }),
        getRefCount: dCe(function () {
          var i = e.get(arguments);
          return i === null || !n[i] ? 0 : n[i];
        }),
      }));
  };
});
var Q_ = A((o0r, mCe) => {
  "use strict";
  var JAt = qz(),
    QAt = Gz(),
    eRt = cEe();
  mCe.exports = function (t) {
    var e = JAt(arguments[1]),
      r;
    return (
      e.normalizer ||
        ((r = e.length = QAt(e.length, t.length, e.async)),
        r !== 0 &&
          (e.primitive
            ? r === !1
              ? (e.normalizer = dEe())
              : r > 1 && (e.normalizer = mEe()(r))
            : r === !1
              ? (e.normalizer = EEe()())
              : r === 1
                ? (e.normalizer = PEe()())
                : (e.normalizer = DEe()(r)))),
      e.async && FEe(),
      e.promise && JEe(),
      e.dispose && eCe(),
      e.maxAge && sCe(),
      e.max && uCe(),
      e.refCounter && pCe(),
      eRt(t, e)
    );
  };
});
var tRt,
  fCe = g(() => {
    "use strict";
    tRt = F(Q_());
  });
var p0r,
  hCe = g(() => {
    "use strict";
    zxe();
    bw();
    fCe();
    p0r = 64 * 1024;
  });
var E4 = g(() => {
  hCe();
});
function ex(t, e, r, n, o = !1) {
  return {
    type: "codex-app-server-initialized",
    hostId: t,
    transport: e,
    appServerVersion: r,
    installedCodexVersion: n,
    ...(o ? { supportsCloudDaybreak: !0 } : {}),
  };
}
var C4 = g(() => {});
var gCe = g(() => {
  O();
});
var w0r,
  aD = g(() => {
    $();
    w0r = d.object({ code: d.string() });
  });
function Hu(t) {
  return t instanceof lD;
}
function tx(t) {
  if (Hu(t)) {
    let r = [];
    for (let n of t.chunks) for (let o of n) r.push(tx(o));
    return r;
  }
  if (Array.isArray(t)) return t.map(tx);
  if (t == null || typeof t != "object") return t;
  let e = {};
  for (let [r, n] of Object.entries(t))
    Object.defineProperty(e, r, { configurable: !0, enumerable: !0, value: tx(n), writable: !0 });
  return e;
}
function yCe(t, e) {
  return vCe(t, e, "chunked") > e;
}
function vCe(t, e, r) {
  let n = new WeakSet(),
    o = [{ type: "value", value: t }],
    i = 0;
  for (; o.length > 0 && i <= e; ) {
    let s = o.pop();
    if (s == null) break;
    if (s.type === "values") {
      let l = s.values.next();
      l.done || o.push(s, { type: "value", value: l.value });
      continue;
    }
    if (s.type === "leave") {
      n.delete(s.value);
      continue;
    }
    if (s.type === "object") {
      let l = s.keys[s.index];
      l != null &&
        ((s.index += 1),
        (i += l.length * 2 + 16),
        o.push(s, { type: "value", value: Reflect.get(s.value, l) }));
      continue;
    }
    let a = s.value;
    if (typeof a == "string") {
      i += a.length * 2 + 16;
      continue;
    }
    if (r === "structured-clone" && typeof a == "bigint") {
      i += Math.ceil(a.toString(16).length / 2) + 16;
      continue;
    }
    if (r === "structured-clone" && (ArrayBuffer.isView(a) || a instanceof ArrayBuffer)) {
      let l = ArrayBuffer.isView(a) ? a.buffer : a;
      (n.has(l) || ((i += l.byteLength), n.add(l)), (i += 16));
      continue;
    }
    if (a == null || typeof a != "object") {
      i += 16;
      continue;
    }
    if (n.has(a)) {
      i += 16;
      continue;
    }
    if (
      (n.add(a), (i += 32), r !== "structured-clone" && o.push({ type: "leave", value: a }), Hu(a))
    ) {
      if (r === "chunked") return Number.POSITIVE_INFINITY;
      o.push({ type: "values", values: rRt(a) });
    } else
      Array.isArray(a)
        ? o.push({ type: "values", values: a.values() })
        : o.push({ type: "object", value: a, keys: Object.keys(a), index: 0 });
  }
  return i;
}
function* rRt(t) {
  for (let e of t.chunks) yield* e;
}
var lD,
  cD,
  rx = g(() => {
    "use strict";
    ((lD = class {
      constructor(e, r) {
        this.chunks = e;
        this.length = r;
      }
    }),
      (cD = class {
        constructor(e = 4194304) {
          this.chunkTargetBytes = e;
        }
        chunks = [];
        currentChunk = [];
        currentChunkBytes = 0;
        length = 0;
        add(e) {
          let r = vCe(e, this.chunkTargetBytes, "json");
          (this.currentChunk.length > 0 &&
            this.currentChunkBytes + r > this.chunkTargetBytes &&
            (this.chunks.push(this.currentChunk),
            (this.currentChunk = []),
            (this.currentChunkBytes = 0)),
            this.currentChunk.push(e),
            (this.currentChunkBytes += r),
            (this.length += 1));
        }
        finish() {
          return (
            this.currentChunk.length > 0 && this.chunks.push(this.currentChunk),
            this.chunks.length <= 1 ? (this.chunks[0] ?? []) : new lD(this.chunks, this.length)
          );
        }
      }));
  });
