"use strict";
var j8e = Object.create;
var wE = Object.defineProperty;
var z8e = Object.getOwnPropertyDescriptor;
var V8e = Object.getOwnPropertyNames;
var K8e = Object.getPrototypeOf,
  Z8e = Object.prototype.hasOwnProperty;
var VJ = (t, e) => ((e = Symbol[t]) ? e : Symbol.for("Symbol." + t)),
  KJ = (t) => {
    throw TypeError(t);
  };
var g = (t, e) => () => (t && (e = t((t = 0))), e);
var A = (t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports),
  Ki = (t, e) => {
    for (var r in e) wE(t, r, { get: e[r], enumerable: !0 });
  },
  ZJ = (t, e, r, n) => {
    if ((e && typeof e == "object") || typeof e == "function")
      for (let o of V8e(e))
        !Z8e.call(t, o) &&
          o !== r &&
          wE(t, o, { get: () => e[o], enumerable: !(n = z8e(e, o)) || n.enumerable });
    return t;
  };
var F = (t, e, r) => (
    (r = t != null ? j8e(K8e(t)) : {}),
    ZJ(e || !t || !t.__esModule ? wE(r, "default", { value: t, enumerable: !0 }) : r, t)
  ),
  X8e = (t) => ZJ(wE({}, "__esModule", { value: !0 }), t);
var cn = (t, e, r) => {
    if (e != null) {
      typeof e != "object" && typeof e != "function" && KJ("Object expected");
      var n, o;
      (r && (n = e[VJ("asyncDispose")]),
        n === void 0 && ((n = e[VJ("dispose")]), r && (o = n)),
        typeof n != "function" && KJ("Object not disposable"),
        o &&
          (n = function () {
            try {
              o.call(this);
            } catch (i) {
              return Promise.reject(i);
            }
          }),
        t.push([r, n, e]));
    } else r && t.push([r]);
    return e;
  },
  un = (t, e, r) => {
    var n =
        typeof SuppressedError == "function"
          ? SuppressedError
          : function (s, a, l, c) {
              return (
                (c = Error(l)),
                (c.name = "SuppressedError"),
                (c.error = s),
                (c.suppressed = a),
                c
              );
            },
      o = (s) => (e = r ? new n(s, e, "An error was suppressed during disposal") : ((r = !0), s)),
      i = (s) => {
        for (; (s = t.pop()); )
          try {
            var a = s[1] && s[1].call(s[2]);
            if (s[0]) return Promise.resolve(a).then(i, (l) => (o(l), i()));
          } catch (l) {
            o(l);
          }
        if (r) throw e;
      };
    return i();
  };
var XJ = g(() => {
  "use strict";
});
var j = {};
Ki(j, {
  BIGINT_FORMAT_RANGES: () => kb,
  CONSTANT_CATCH: () => RE,
  Class: () => mF,
  NUMBER_FORMAT_RANGES: () => Ib,
  aborted: () => Po,
  allowsEval: () => gF,
  assert: () => t9e,
  assertEqual: () => Y8e,
  assertIs: () => Q8e,
  assertNever: () => e9e,
  assertNotEqual: () => J8e,
  assignProp: () => jn,
  attachSchema: () => Db,
  base64ToUint8Array: () => l7,
  base64urlToUint8Array: () => m9e,
  cached: () => Qf,
  captureStackTrace: () => xE,
  cleanEnum: () => p9e,
  cleanRegex: () => Fl,
  clone: () => Wt,
  cloneDef: () => o9e,
  codePointLength: () => ep,
  constantCatch: () => _F,
  createTransparentProxy: () => u9e,
  defineLazy: () => fF,
  defineLazyInternal: () => ct,
  derived: () => y9e,
  esc: () => To,
  escapeRegex: () => Yi,
  explicitlyAborted: () => bF,
  extend: () => r7,
  finalizeIssue: () => Xo,
  floatSafeRemainder: () => Tb,
  getElementAtPath: () => i9e,
  getEnumValues: () => Yf,
  getLengthableOrigin: () => Ob,
  getParsedType: () => c9e,
  getSizableOrigin: () => Mb,
  hexToUint8Array: () => h9e,
  hide: () => Nb,
  installLazyProp: () => wF,
  isObject: () => Qd,
  isPlainObject: () => Xi,
  issue: () => nh,
  joinValues: () => B,
  jsonStringifyReplacer: () => Jf,
  members: () => SF,
  merge: () => i7,
  mergeDefs: () => Zi,
  normalizeParams: () => re,
  nullish: () => _E,
  numKeys: () => l9e,
  objectClone: () => r9e,
  omit: () => t7,
  optionalKeys: () => vF,
  own: () => va,
  parsedType: () => K,
  partial: () => s7,
  pick: () => e7,
  prefixIssues: () => Zo,
  primitiveTypes: () => yF,
  promiseAllObject: () => s9e,
  propertyKeyTypes: () => Pb,
  randomString: () => a9e,
  rawShape: () => eh,
  required: () => a7,
  safeExtend: () => o7,
  shallowClone: () => th,
  sizeCaps: () => rh,
  slugify: () => hF,
  stringifyPrimitive: () => z,
  toZod: () => Cb,
  uint8ArrayToBase64: () => c7,
  uint8ArrayToBase64url: () => f9e,
  uint8ArrayToHex: () => g9e,
  unwrapMessage: () => Xf,
});
function Y8e(t) {
  return t;
}
function J8e(t) {
  return t;
}
function Cb() {
  return (t) => t;
}
function Q8e(t) {}
function e9e(t) {
  throw new Error("Unexpected value in exhaustive check");
}
function t9e(t) {}
function Yf(t) {
  let e = Object.values(t).filter((n) => typeof n == "number");
  return Object.entries(t)
    .filter(([n, o]) => e.indexOf(+n) === -1)
    .map(([n, o]) => o);
}
function B(t, e = "|") {
  return t.map((r) => z(r)).join(e);
}
function Jf(t, e) {
  return typeof e == "bigint" ? e.toString() : e;
}
function Qf(t) {
  return new pF(t);
}
function _E(t) {
  return t == null;
}
function Fl(t) {
  let e = t.startsWith("^") ? 1 : 0,
    r = t.endsWith("$") ? t.length - 1 : t.length;
  return t.slice(e, r);
}
function Tb(t, e) {
  let r = t / e,
    n = Math.round(r),
    o = 4 * Number.EPSILON * Math.max(Math.abs(r), 1);
  return Math.abs(r - n) < o ? 0 : r - n;
}
function fF(t, e, r) {
  let n;
  Object.defineProperty(t, e, {
    get() {
      if (n !== YJ) return (n === void 0 && ((n = YJ), (n = r())), n);
    },
    set(o) {
      Object.defineProperty(t, e, { value: o });
    },
    configurable: !0,
  });
}
function r9e(t) {
  return Object.create(Object.getPrototypeOf(t), Object.getOwnPropertyDescriptors(t));
}
function jn(t, e, r) {
  Object.defineProperty(t, e, { value: r, writable: !0, enumerable: !0, configurable: !0 });
}
function eh(t) {
  let e = Object.getOwnPropertyDescriptor(t, "shape");
  return e?.get ? e.get.raw : e?.value;
}
function Bl(t) {
  return eh(t._zod.def) ?? t._zod.def.shape;
}
function JJ(t, e, r) {
  Object.defineProperty(t, e, {
    get() {
      let n = r();
      return (jn(this, e, n), n);
    },
    enumerable: !0,
    configurable: !0,
  });
}
function QJ(t, e, r) {
  e in t ? jn(t, e, r) : (t[e] = r);
}
function Jd(t, e, r, n) {
  let o = Bl(e);
  for (let i of r) {
    let s = Object.getOwnPropertyDescriptor(o, i);
    s.enumerable &&
      (s.get
        ? JJ(t, i, () => {
            let a = e._zod.def.shape[i];
            return n ? n(a, i) : a;
          })
        : QJ(t, i, n ? n(s.value, i) : s.value));
  }
}
function n9e(t, e) {
  for (let r of Reflect.ownKeys(e)) {
    let n = Object.getOwnPropertyDescriptor(e, r);
    n.enumerable && (n.get ? JJ(t, r, () => e[r]) : QJ(t, r, n.value));
  }
}
function Zi(...t) {
  let e = {};
  for (let r of t) {
    let n = Object.getOwnPropertyDescriptors(r);
    Object.assign(e, n);
  }
  return Object.defineProperties({}, e);
}
function o9e(t) {
  return Zi(t._zod.def);
}
function i9e(t, e) {
  return e ? e.reduce((r, n) => r?.[n], t) : t;
}
function s9e(t) {
  let e = Object.keys(t),
    r = e.map((n) => t[n]);
  return Promise.all(r).then((n) => {
    let o = {};
    for (let i = 0; i < e.length; i++) o[e[i]] = n[i];
    return o;
  });
}
function a9e(t = 10) {
  let e = "abcdefghijklmnopqrstuvwxyz",
    r = "";
  for (let n = 0; n < t; n++) r += e[Math.floor(Math.random() * e.length)];
  return r;
}
function To(t) {
  return JSON.stringify(t);
}
function hF(t) {
  return t
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function Qd(t) {
  return typeof t == "object" && t !== null && !Array.isArray(t);
}
function Xi(t) {
  if (Qd(t) === !1) return !1;
  let e = t.constructor;
  if (e === void 0 || typeof e != "function") return !0;
  let r = e.prototype;
  return !(Qd(r) === !1 || Object.prototype.hasOwnProperty.call(r, "isPrototypeOf") === !1);
}
function th(t) {
  return Xi(t)
    ? { ...t }
    : Array.isArray(t)
      ? [...t]
      : t instanceof Map
        ? new Map(t)
        : t instanceof Set
          ? new Set(t)
          : t;
}
function l9e(t) {
  let e = 0;
  for (let r in t) Object.prototype.hasOwnProperty.call(t, r) && e++;
  return e;
}
function Yi(t) {
  return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Wt(t, e, r) {
  let n = new t._zod.constr(e ?? t._zod.def);
  return ((!e || r?.parent) && (n._zod.parent = t), n);
}
function re(t) {
  let e = t;
  if (!e) return {};
  if (typeof e == "string") return { error: () => e };
  if (e?.message !== void 0) {
    if (e?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
    e.error = e.message;
  }
  return (delete e.message, typeof e.error == "string" ? { ...e, error: () => e.error } : e);
}
function u9e(t) {
  let e;
  return new Proxy(
    {},
    {
      get(r, n, o) {
        return (e ?? (e = t()), Reflect.get(e, n, o));
      },
      set(r, n, o, i) {
        return (e ?? (e = t()), Reflect.set(e, n, o, i));
      },
      has(r, n) {
        return (e ?? (e = t()), Reflect.has(e, n));
      },
      deleteProperty(r, n) {
        return (e ?? (e = t()), Reflect.deleteProperty(e, n));
      },
      ownKeys(r) {
        return (e ?? (e = t()), Reflect.ownKeys(e));
      },
      getOwnPropertyDescriptor(r, n) {
        return (e ?? (e = t()), Reflect.getOwnPropertyDescriptor(e, n));
      },
      defineProperty(r, n, o) {
        return (e ?? (e = t()), Reflect.defineProperty(e, n, o));
      },
    },
  );
}
function z(t) {
  return typeof t == "bigint" ? t.toString() + "n" : typeof t == "string" ? `"${t}"` : `${t}`;
}
function vF(t) {
  return Object.keys(t).filter(
    (e) => t[e]._zod.optin !== void 0 && t[e]._zod.optout === "optional",
  );
}
function e7(t, e) {
  let r = t._zod.def,
    n = r.checks;
  if (n && n.length > 0)
    throw new Error(".pick() cannot be used on object schemas containing refinements");
  let i = {};
  return (Jd(i, t, AE(t, e)), Wt(t, Zi(r, { shape: i, checks: [] })));
}
function AE(t, e) {
  let r = Bl(t),
    n = [];
  for (let o of Reflect.ownKeys(e)) {
    if (!Object.getOwnPropertyDescriptor(r, o)?.enumerable)
      throw new Error(`Unrecognized key: "${String(o)}"`);
    e[o] && n.push(o);
  }
  return n;
}
function t7(t, e) {
  let r = t._zod.def,
    n = r.checks;
  if (n && n.length > 0)
    throw new Error(".omit() cannot be used on object schemas containing refinements");
  let i = new Set(AE(t, e)),
    s = {};
  return (
    Jd(
      s,
      t,
      Reflect.ownKeys(Bl(t)).filter((a) => !i.has(a)),
    ),
    Wt(t, Zi(r, { shape: s, checks: [] }))
  );
}
function r7(t, e) {
  if (!Xi(e)) throw new Error("Invalid input to extend: expected a plain object");
  let r = t._zod.def.checks;
  if (r && r.length > 0) {
    let o = Bl(t);
    for (let i of Reflect.ownKeys(e))
      if (Object.getOwnPropertyDescriptor(o, i) !== void 0)
        throw new Error(
          "Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.",
        );
  }
  return Wt(t, Zi(t._zod.def, { shape: n7(t, e) }));
}
function n7(t, e) {
  let r = {};
  return (Jd(r, t, Reflect.ownKeys(Bl(t))), n9e(r, e), r);
}
function o7(t, e) {
  if (!Xi(e)) throw new Error("Invalid input to safeExtend: expected a plain object");
  return Wt(t, Zi(t._zod.def, { shape: n7(t, e) }));
}
function i7(t, e) {
  if (!e?._zod?.def)
    throw new Error(
      "Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.",
    );
  if (t._zod.def.checks?.length)
    throw new Error(
      ".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.",
    );
  let r = {};
  (Jd(r, t, Reflect.ownKeys(Bl(t))), Jd(r, e, Reflect.ownKeys(Bl(e))));
  let n = Zi(t._zod.def, {
    shape: r,
    get catchall() {
      return e._zod.def.catchall;
    },
    checks: e._zod.def.checks ?? [],
  });
  return Wt(t, n);
}
function s7(t, e, r, n = "partial") {
  let i = e._zod.def.checks;
  if (i && i.length > 0)
    throw new Error(`.${n}() cannot be used on object schemas containing refinements`);
  let a = r ? new Set(AE(e, r)) : void 0,
    l = {};
  return (
    Jd(
      l,
      e,
      Reflect.ownKeys(Bl(e)),
      t && ((c, u) => (a && !a.has(u) ? c : new t({ type: "optional", innerType: c }))),
    ),
    Wt(e, Zi(e._zod.def, { shape: l, checks: [] }))
  );
}
function a7(t, e, r) {
  let n = r ? new Set(AE(e, r)) : void 0,
    o = {};
  return (
    Jd(o, e, Reflect.ownKeys(Bl(e)), (i, s) =>
      n && !n.has(s) ? i : new t({ type: "nonoptional", innerType: i }),
    ),
    Wt(e, Zi(e._zod.def, { shape: o }))
  );
}
function Po(t, e = 0) {
  if (t.aborted === !0) return !0;
  for (let r = e; r < t.issues.length; r++) if (t.issues[r]?.continue !== !0) return !0;
  return !1;
}
function bF(t, e = 0) {
  if (t.aborted === !0) return !0;
  for (let r = e; r < t.issues.length; r++) if (t.issues[r]?.continue === !1) return !0;
  return !1;
}
function Zo(t, e) {
  return e.map((r) => {
    var n;
    return ((n = r).path ?? (n.path = []), r.path.unshift(t), r);
  });
}
function Xf(t) {
  return typeof t == "string" ? t : t?.message;
}
function rh(t) {
  let e = [];
  for (let r of t ?? []) {
    let n = r._zod.def;
    if (!/_(length|size)$|_equals$/.test(n.check)) break;
    let o = n.maximum ?? n.length ?? n.size;
    o >= 0 && e.push([o, r]);
  }
  return e;
}
function Db(t, e, r) {
  var n;
  for (let o = e; o < t.length; o++) (n = t[o]).schema ?? (n.schema = r);
}
function Xo(t, e, r) {
  var n;
  let o = t.inst?._zod?.traits;
  o?.has("$ZodType") &&
    (o.has("$ZodCheck") ? ((n = t).schema ?? (n.schema = t.inst)) : (t.schema = t.inst));
  let i = t.schema !== t.inst ? t.schema?._zod.def?.error : void 0,
    s = t.message
      ? t.message
      : (Xf(t.inst?._zod.def?.error?.(t)) ??
        Xf(i?.(t)) ??
        Xf(e?.error?.(t)) ??
        Xf(r.customError?.(t)) ??
        Xf(r.localeError?.(t)) ??
        "Invalid input"),
    a = {};
  for (let l of Object.keys(t))
    l === "inst" ||
      l === "schema" ||
      l === "continue" ||
      l === "input" ||
      l === "__proto__" ||
      (a[l] = t[l]);
  return (a.path ?? (a.path = []), (a.message = s), e?.reportInput && (a.input = t.input), a);
}
function Mb(t) {
  return t instanceof Set
    ? "set"
    : t instanceof Map
      ? "map"
      : t instanceof File
        ? "file"
        : "unknown";
}
function ep(t) {
  let e = t.length;
  if (!d9e.test(t)) return e;
  let r = e;
  for (let n = 0; n < e - 1; n++)
    (t.charCodeAt(n) & 64512) === 55296 && (t.charCodeAt(n + 1) & 64512) === 56320 && (r--, n++);
  return r;
}
function Ob(t) {
  return Array.isArray(t) ? "array" : typeof t == "string" ? "string" : "unknown";
}
function K(t) {
  let e = typeof t;
  switch (e) {
    case "number":
      return Number.isNaN(t) ? "nan" : "number";
    case "object": {
      if (t === null) return "null";
      if (Array.isArray(t)) return "array";
      let r = t;
      if (r && Object.getPrototypeOf(r) !== Object.prototype && "constructor" in r && r.constructor)
        return r.constructor.name;
    }
  }
  return e;
}
function nh(...t) {
  let [e, r, n] = t;
  return typeof e == "string" ? { message: e, code: "custom", input: r, inst: n } : { ...e };
}
function p9e(t) {
  return Object.entries(t)
    .filter(([e, r]) => Number.isNaN(Number.parseInt(e, 10)))
    .map((e) => e[1]);
}
function l7(t) {
  let e = atob(t),
    r = new Uint8Array(e.length);
  for (let n = 0; n < e.length; n++) r[n] = e.charCodeAt(n);
  return r;
}
function c7(t) {
  let e = "";
  for (let r = 0; r < t.length; r++) e += String.fromCharCode(t[r]);
  return btoa(e);
}
function m9e(t) {
  let e = t.replace(/-/g, "+").replace(/_/g, "/"),
    r = "=".repeat((4 - (e.length % 4)) % 4);
  return l7(e + r);
}
function f9e(t) {
  return c7(t).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function h9e(t) {
  let e = t.replace(/^0x/, "");
  if (e.length % 2 !== 0) throw new Error("Invalid hex string length");
  let r = new Uint8Array(e.length / 2);
  for (let n = 0; n < e.length; n += 2) r[n / 2] = Number.parseInt(e.slice(n, n + 2), 16);
  return r;
}
function g9e(t) {
  return Array.from(t)
    .map((e) => e.toString(16).padStart(2, "0"))
    .join("");
}
function SF(t, e) {
  for (let r in e) {
    let n = Object.getOwnPropertyDescriptor(e, r);
    n.get ? Object.defineProperty(t, r, { ...n, enumerable: !1 }) : v9e(t, r, n.value);
  }
}
function va(t, e, r, n = !0) {
  return (
    Object.defineProperty(t, e, { configurable: !0, writable: !0, enumerable: n, value: r }),
    r
  );
}
function Nb(t, e, r) {
  return va(t, e, r, !1);
}
function y9e(t, e) {
  for (let r in t) {
    let n = t[r];
    Object.defineProperty(e, r, {
      configurable: !0,
      enumerable: !0,
      get() {
        return va(this, r, n(this));
      },
      set(o) {
        va(this, r, o);
      },
    });
  }
  return e;
}
function v9e(t, e, r) {
  Object.defineProperty(t, e, {
    configurable: !0,
    get() {
      return this == null ? r : va(this, e, r.bind(this));
    },
    set(n) {
      va(this, e, n);
    },
  });
}
function b9e(t, e) {
  let r = Object.getPrototypeOf(t);
  return e in r ? void 0 : r;
}
function ct(t, e, r) {
  let n = Object.getPrototypeOf(t._zod);
  if (e in n && dF !== t._zod) {
    dF = void 0;
    return;
  }
  ((dF = t._zod),
    Object.defineProperty(n, e, {
      configurable: !0,
      get() {
        Object.defineProperty(this, e, S9e);
        let o = Hc;
        Hc = !1;
        try {
          let i = r(this);
          return (
            Hc
              ? delete this[e]
              : Object.defineProperty(this, e, { configurable: !0, writable: !0, value: i }),
            (Hc = Hc || o),
            i
          );
        } catch (i) {
          throw (delete this[e], (Hc = Hc || o), i);
        }
      },
      set(o) {
        Object.defineProperty(this, e, { configurable: !0, writable: !0, value: o });
      },
    }));
}
function wF(t, e, r, n) {
  let o = b9e(t, e);
  o &&
    Object.defineProperty(o, e, {
      configurable: !0,
      get() {
        let i = { configurable: !0, writable: !0, enumerable: n, value: void 0 };
        return (
          Object.defineProperty(this, e, i),
          (i.value = r(this)),
          Object.defineProperty(this, e, i),
          i.value
        );
      },
      set(i) {
        Object.defineProperty(this, e, { configurable: !0, writable: !0, enumerable: n, value: i });
      },
    });
}
function _F(t) {
  let e = () => t;
  return ((e[RE] = !0), e);
}
var pF,
  YJ,
  xE,
  gF,
  c9e,
  Pb,
  yF,
  Ib,
  kb,
  d9e,
  mF,
  dF,
  Hc,
  S9e,
  RE,
  me = g(() => {
    jc();
    pF = class {
      constructor(e) {
        ((this._getter = e), (this._value = void 0));
      }
      get value() {
        let e = this._getter;
        return (e !== void 0 && ((this._value = e()), (this._getter = void 0)), this._value);
      }
    };
    YJ = Symbol("evaluating");
    xE = "captureStackTrace" in Error ? Error.captureStackTrace : (...t) => {};
    gF = Qf(() => {
      if (Mn.jitless) return !1;
      try {
        let t = Function;
        return (new t(""), !0);
      } catch {
        return !1;
      }
    });
    ((c9e = (t) => {
      let e = typeof t;
      switch (e) {
        case "undefined":
          return "undefined";
        case "string":
          return "string";
        case "number":
          return Number.isNaN(t) ? "nan" : "number";
        case "boolean":
          return "boolean";
        case "function":
          return "function";
        case "bigint":
          return "bigint";
        case "symbol":
          return "symbol";
        case "object":
          return Array.isArray(t)
            ? "array"
            : t === null
              ? "null"
              : t.then && typeof t.then == "function" && t.catch && typeof t.catch == "function"
                ? "promise"
                : typeof Map < "u" && t instanceof Map
                  ? "map"
                  : typeof Set < "u" && t instanceof Set
                    ? "set"
                    : typeof Date < "u" && t instanceof Date
                      ? "date"
                      : typeof File < "u" && t instanceof File
                        ? "file"
                        : "object";
        default:
          throw new Error(`Unknown data type: ${e}`);
      }
    }),
      (Pb = new Set(["string", "number", "symbol"])),
      (yF = new Set(["string", "number", "bigint", "boolean", "symbol", "undefined"])));
    ((Ib = {
      safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
      int32: [-2147483648, 2147483647],
      uint32: [0, 4294967295],
      float32: [-34028234663852886e22, 34028234663852886e22],
      float64: [-Number.MAX_VALUE, Number.MAX_VALUE],
    }),
      (kb = {
        int64: [BigInt("-9223372036854775808"), BigInt("9223372036854775807")],
        uint64: [BigInt(0), BigInt("18446744073709551615")],
      }));
    d9e = /[\uD800-\uDBFF]/;
    mF = class {
      constructor(...e) {}
    };
    ((Hc = !1),
      (S9e = {
        configurable: !0,
        get() {
          Hc = !0;
        },
      }));
    RE = "~constantCatch";
  });
function w9e(t) {
  let e = d7;
  if (e) {
    let r = e.stackTraceLimit;
    if (typeof r == "number") {
      try {
        e.stackTraceLimit = 0;
      } catch {
        return ((d7 = null), new t());
      }
      try {
        return new t();
      } finally {
        e.stackTraceLimit = r;
      }
    }
  }
  return new t();
}
function N(t, e, r, n) {
  let o = {};
  function i(m) {
    ((this.def = m), (this.constr = p), (this.traits = new Set()));
  }
  i.prototype = o;
  let s = r,
    a = s && new WeakSet();
  function l(m, f) {
    if (m._zod) {
      if (m._zod.traits.has(t)) return;
    } else {
      xF.value = new i(f);
      try {
        Object.defineProperty(m, "_zod", xF);
      } finally {
        xF.value = void 0;
      }
    }
    if ((m._zod.traits.add(t), e(m, f), a)) {
      let v = Object.getPrototypeOf(m),
        y = m._zod.constr.prototype,
        w = v;
      for (; w && w !== y; ) w = Object.getPrototypeOf(w);
      let _ = w ?? v;
      a.has(_) || (a.add(_), SF(_, s));
    }
    let h = p.prototype;
    for (let v in h)
      Object.prototype.hasOwnProperty.call(h, v) && (v in m || (m[v] = h[v].bind(m)));
  }
  let c = n?.Parent ?? Object;
  class u extends c {}
  Object.defineProperty(u, "name", { value: t });
  function p(m) {
    let f = n?.Parent ? w9e(u) : this;
    l(f, m);
    let h = f._zod.deferred;
    if (h) {
      for (let y of h) y();
      f._zod.deferred = void 0;
    }
    let v = globalThis.__zod_globalConfig?.postProcessor;
    return (v && v(f), f);
  }
  return (
    Object.defineProperty(p, "init", { value: l }),
    Object.defineProperty(p, Symbol.hasInstance, {
      value: (m) => (n?.Parent && m instanceof n.Parent ? !0 : m?._zod?.traits?.has(t)),
    }),
    Object.defineProperty(p, "name", { value: t }),
    p
  );
}
function jr(t) {
  return (t && Object.assign(Mn, t), Mn);
}
var u7,
  AF,
  xF,
  d7,
  RF,
  Yo,
  zc,
  Mn,
  jc = g(() => {
    me();
    ((AF = Object.freeze({ status: "aborted" })),
      (xF = { value: void 0, enumerable: !1 }),
      (d7 = "captureStackTrace" in Error ? Error : null));
    ((RF = Symbol("zod_brand")),
      (Yo = class extends Error {
        constructor() {
          super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
        }
      }),
      (zc = class extends Error {
        constructor(e) {
          (super(`Encountered unidirectional transform during encode: ${e}`),
            (this.name = "ZodEncodeError"));
        }
      }));
    (u7 = globalThis).__zod_globalConfig ?? (u7.__zod_globalConfig = {});
    Mn = globalThis.__zod_globalConfig;
  });
function _9e() {
  let t = this._zod;
  return (t.message ?? (t.message = JSON.stringify(t.def, Jf, 2)), t.message);
}
function x9e(t) {
  this._zod.message = t;
}
function R9e(t, e, r) {
  return (
    Object.prototype.hasOwnProperty.call(t, e) ||
      (e === "__proto__"
        ? Object.defineProperty(t, e, {
            value: r(),
            writable: !0,
            enumerable: !0,
            configurable: !0,
          })
        : (t[e] = r())),
    t[e]
  );
}
function Lb(t, e = (r) => r.message) {
  let r = {},
    n = [];
  for (let o of t.issues) o.path.length > 0 ? R9e(r, o.path[0], () => []).push(e(o)) : n.push(e(o));
  return { formErrors: n, fieldErrors: r };
}
function Bb(t, e = (r) => r.message) {
  let r = { _errors: [] },
    n = (o, i = []) => {
      for (let s of o.issues)
        if (s.code === "invalid_union" && s.errors.length)
          s.errors.map((a) => n({ issues: a }, [...i, ...s.path]));
        else if (s.code === "invalid_key") n({ issues: s.issues }, [...i, ...s.path]);
        else if (s.code === "invalid_element") n({ issues: s.issues }, [...i, ...s.path]);
        else {
          let a = [...i, ...s.path];
          if (a.length === 0) r._errors.push(e(s));
          else {
            let l = r,
              c = 0;
            for (; c < a.length; ) {
              let u = a[c],
                p = c === a.length - 1;
              if (u === "_errors") {
                (p && l._errors.push(e(s)), c++);
                continue;
              }
              Object.prototype.hasOwnProperty.call(l, u) ||
                Object.defineProperty(l, u, {
                  value: { _errors: [] },
                  enumerable: !0,
                  writable: !0,
                  configurable: !0,
                });
              let m = l[u];
              (p && m._errors.push(e(s)), (l = m), c++);
            }
          }
        }
    };
  return (n(t), r);
}
function PF(t, e = (r) => r.message) {
  let r = { errors: [] },
    n = (o, i = []) => {
      var s;
      for (let a of o.issues)
        if (a.code === "invalid_union" && a.errors.length)
          a.errors.map((l) => n({ issues: l }, [...i, ...a.path]));
        else if (a.code === "invalid_key") n({ issues: a.issues }, [...i, ...a.path]);
        else if (a.code === "invalid_element") n({ issues: a.issues }, [...i, ...a.path]);
        else {
          let l = [...i, ...a.path];
          if (l.length === 0) {
            r.errors.push(e(a));
            continue;
          }
          let c = r,
            u = 0;
          for (; u < l.length; ) {
            let p = l[u],
              m = u === l.length - 1;
            (typeof p == "string"
              ? (c.properties ?? (c.properties = {}),
                Object.prototype.hasOwnProperty.call(c.properties, p) ||
                  Object.defineProperty(c.properties, p, {
                    value: { errors: [] },
                    enumerable: !0,
                    writable: !0,
                    configurable: !0,
                  }),
                (c = c.properties[p]))
              : (c.items ?? (c.items = []),
                (s = c.items)[p] ?? (s[p] = { errors: [] }),
                (c = c.items[p])),
              m && c.errors.push(e(a)),
              u++);
          }
        }
    };
  return (n(t), r);
}
function f7(t) {
  let e = [],
    r = t.map((n) => (typeof n == "object" ? n.key : n));
  for (let n of r)
    typeof n == "number"
      ? e.push(`[${n}]`)
      : typeof n == "symbol"
        ? e.push(`[${JSON.stringify(String(n))}]`)
        : /[^\w$]/.test(n)
          ? e.push(`[${JSON.stringify(n)}]`)
          : (e.length && e.push("."), e.push(n));
  return e.join("");
}
function IF(t) {
  let e = [],
    r = [...t.issues].sort((n, o) => (n.path ?? []).length - (o.path ?? []).length);
  for (let n of r)
    (e.push(`\u2716 ${n.message}`), n.path?.length && e.push(`  \u2192 at ${f7(n.path)}`));
  return e.join(`
`);
}
var A9e,
  CF,
  p7,
  m7,
  TF,
  Jo,
  kF = g(() => {
    jc();
    me();
    ((A9e = { get: _9e, set: x9e, enumerable: !0, configurable: !0 }),
      (CF = { value: void 0, enumerable: !1 }),
      (p7 = new WeakSet([Object.prototype, Error.prototype])),
      (m7 = (t, e) => {
        ((t.name = "$ZodError"),
          (CF.value = e),
          Object.defineProperty(t, "issues", CF),
          (CF.value = void 0),
          Object.defineProperty(t, "message", A9e));
        let r = Object.getPrototypeOf(t);
        p7.has(r) ||
          (p7.add(r),
          Object.defineProperty(r, "toString", {
            configurable: !0,
            enumerable: !1,
            get() {
              let n = () => this.message;
              return (
                Object.defineProperty(this, "toString", {
                  value: n,
                  configurable: !0,
                  writable: !0,
                }),
                n
              );
            },
            set(n) {
              Object.defineProperty(this, "toString", { value: n, configurable: !0, writable: !0 });
            },
          }));
      }),
      (TF = N("$ZodError", m7)),
      (Jo = N("$ZodError", m7, void 0, { Parent: Error })));
  });
function EE(t, e) {
  return { callee: e?.callee ?? t, Err: e?.Err };
}
function h7(t, e, r) {
  let n;
  return {
    success: !1,
    get error() {
      return (n || ((n = new t(e.map((o) => Xo(o, r, jr())))), (e = void 0), (r = void 0)), n);
    },
    set error(o) {
      ((n = o), (e = void 0), (r = void 0));
    },
  };
}
function P9e(t, e, r) {
  let n = r ? { ...r, async: !1, abortEarly: !0 } : { async: !1, abortEarly: !0 },
    o = t._zod.bag.fallbackRun,
    i;
  if (
    (o
      ? ((n[T9e] = !0), (i = o({ value: e, issues: [] }, n)))
      : (i = t._zod.run({ value: e, issues: [] }, n)),
    i instanceof Promise)
  )
    throw new Yo();
  return i.issues.length === 0;
}
var oh,
  tp,
  ih,
  rp,
  sh,
  ah,
  lh,
  ch,
  C9e,
  T9e,
  uh,
  dh,
  CE,
  g7,
  TE,
  y7,
  PE,
  v7,
  IE,
  b7,
  kE,
  S7,
  DE,
  w7,
  ME,
  _7,
  OE,
  x7,
  DF = g(() => {
    jc();
    kF();
    me();
    ((oh = (t) => {
      let e = (r, n, o, i) => {
        let s = o ? { ...o, async: !1 } : { async: !1 },
          a = r._zod.run({ value: n, issues: [] }, s);
        if (a instanceof Promise) throw new Yo();
        if (a.issues.length) {
          let l = new (i?.Err ?? t)(a.issues.map((c) => Xo(c, s, jr())));
          throw (xE(l, i?.callee ?? e), l);
        }
        return a.value;
      };
      return e;
    }),
      (tp = oh(Jo)),
      (ih = (t) => {
        let e = async (r, n, o, i) => {
          let s = o ? { ...o, async: !0 } : { async: !0 },
            a = r._zod.run({ value: n, issues: [] }, s);
          if ((a instanceof Promise && (a = await a), a.issues.length)) {
            let l = new (i?.Err ?? t)(a.issues.map((c) => Xo(c, s, jr())));
            throw (xE(l, i?.callee ?? e), l);
          }
          return a.value;
        };
        return e;
      }),
      (rp = ih(Jo)),
      (sh = (t) => (e, r, n) => {
        let o = n ? { ...n, async: !1 } : { async: !1 },
          i = e._zod.run({ value: r, issues: [] }, o);
        if (i instanceof Promise) throw new Yo();
        return i.issues.length ? h7(t, i.issues, o) : { success: !0, data: i.value };
      }),
      (ah = sh(Jo)));
    ((lh = (t) => async (e, r, n) => {
      let o = n ? { ...n, async: !0 } : { async: !0 },
        i = e._zod.run({ value: r, issues: [] }, o);
      return (
        i instanceof Promise && (i = await i),
        i.issues.length ? h7(t, i.issues, o) : { success: !0, data: i.value }
      );
    }),
      (ch = lh(Jo)),
      (C9e = Symbol.for("zod.compile.invalid")),
      (T9e = Symbol.for("zod.compile.fallback")),
      (uh = (t, e, r) => {
        let n = t._zod.bag.validator;
        if (n !== void 0) {
          if (n(e) !== C9e) return !0;
          if (n.definite === !0 && r === void 0) return !1;
        }
        return P9e(t, e, r);
      }));
    ((dh = async (t, e, r) => {
      let n = r ? { ...r, async: !0, abortEarly: !0 } : { async: !0, abortEarly: !0 },
        o = t._zod.run({ value: e, issues: [] }, n);
      return (o instanceof Promise && (o = await o), o.issues.length === 0);
    }),
      (CE = (t) => {
        let e = oh(t),
          r = (n, o, i, s) => {
            let a = i ? { ...i, direction: "backward" } : { direction: "backward" };
            return e(n, o, a, EE(r, s));
          };
        return r;
      }),
      (g7 = CE(Jo)),
      (TE = (t) => {
        let e = oh(t),
          r = (n, o, i, s) => e(n, o, i, EE(r, s));
        return r;
      }),
      (y7 = TE(Jo)),
      (PE = (t) => {
        let e = ih(t),
          r = async (n, o, i, s) => {
            let a = i ? { ...i, direction: "backward" } : { direction: "backward" };
            return await e(n, o, a, EE(r, s));
          };
        return r;
      }),
      (v7 = PE(Jo)),
      (IE = (t) => {
        let e = ih(t),
          r = async (n, o, i, s) => await e(n, o, i, EE(r, s));
        return r;
      }),
      (b7 = IE(Jo)),
      (kE = (t) => (e, r, n) => {
        let o = n ? { ...n, direction: "backward" } : { direction: "backward" };
        return sh(t)(e, r, o);
      }),
      (S7 = kE(Jo)),
      (DE = (t) => (e, r, n) => sh(t)(e, r, n)),
      (w7 = DE(Jo)),
      (ME = (t) => async (e, r, n) => {
        let o = n ? { ...n, direction: "backward" } : { direction: "backward" };
        return lh(t)(e, r, o);
      }),
      (_7 = ME(Jo)),
      (OE = (t) => async (e, r, n) => lh(t)(e, r, n)),
      (x7 = OE(Jo)));
  });
var Ri = {};
Ki(Ri, {
  anyString: () => i1,
  base64: () => XF,
  base64url: () => YF,
  bigint: () => a1,
  boolean: () => l1,
  browserEmail: () => B9e,
  cidrv4: () => KF,
  cidrv6: () => ZF,
  creditCard: () => NE,
  cuid: () => OF,
  cuid2: () => NF,
  currencyCode: () => t1,
  date: () => r1,
  datetime: () => o1,
  domain: () => QF,
  duration: () => qF,
  e164: () => e1,
  email: () => WF,
  emoji: () => HF,
  extendedDuration: () => I9e,
  guid: () => GF,
  hex: () => m1,
  hostname: () => JF,
  html5Email: () => O9e,
  httpProtocol: () => Fb,
  iban: () => LE,
  idnEmail: () => L9e,
  integer: () => $b,
  ipv4: () => jF,
  ipv6: () => zF,
  ksuid: () => FF,
  lowercase: () => d1,
  mac: () => VF,
  md5_base64: () => q9e,
  md5_base64url: () => G9e,
  md5_hex: () => U9e,
  nanoid: () => $F,
  nanoidOfLength: () => UF,
  null: () => c1,
  number: () => $l,
  rfc5322Email: () => N9e,
  sha1_base64: () => H9e,
  sha1_base64url: () => j9e,
  sha1_hex: () => W9e,
  sha256_base64: () => V9e,
  sha256_base64url: () => K9e,
  sha256_hex: () => z9e,
  sha384_base64: () => X9e,
  sha384_base64url: () => Y9e,
  sha384_hex: () => Z9e,
  sha512_base64: () => Q9e,
  sha512_base64url: () => eZe,
  sha512_hex: () => J9e,
  string: () => s1,
  time: () => n1,
  ulid: () => LF,
  undefined: () => u1,
  unicodeEmail: () => A7,
  uppercase: () => p1,
  uuid: () => np,
  uuid4: () => k9e,
  uuid6: () => D9e,
  uuid7: () => M9e,
  xid: () => BF,
});
function UF(t) {
  return new RegExp(`^[a-zA-Z0-9_-]{${t}}$`);
}
function HF() {
  return new RegExp(F9e, "u");
}
function $9e(t) {
  return new RegExp(`^${t}$`);
}
function MF(t) {
  let e = "(?:[01]\\d|2[0-3]):[0-5]\\d";
  return typeof t.precision == "number"
    ? t.precision === -1
      ? `${e}`
      : t.precision === 0
        ? `${e}:[0-5]\\d`
        : `${e}:[0-5]\\d\\.\\d{${t.precision}}`
    : t.seconds
      ? `${e}:[0-5]\\d(?:\\.\\d+)?`
      : `${e}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function n1(t) {
  return new RegExp(`^${MF(t)}$`);
}
function o1(t) {
  let e = ["Z"];
  t.offset && e.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
  let r = `${MF({ precision: t.precision, seconds: !0 })}(?:${e.join("|")})`,
    n = t.local ? `${r}|${MF({ precision: t.precision })}` : r;
  return new RegExp(`^${R7}T(?:${n})$`);
}
function Ub(t, e) {
  return new RegExp(`^[A-Za-z0-9+/]{${t}}${e}$`);
}
function qb(t) {
  return new RegExp(`^[A-Za-z0-9_-]{${t}}$`);
}
var OF,
  NF,
  LF,
  BF,
  FF,
  $F,
  qF,
  I9e,
  GF,
  np,
  k9e,
  D9e,
  M9e,
  WF,
  O9e,
  N9e,
  A7,
  L9e,
  B9e,
  F9e,
  jF,
  zF,
  VF,
  KF,
  ZF,
  XF,
  YF,
  JF,
  QF,
  Fb,
  e1,
  NE,
  t1,
  LE,
  R7,
  r1,
  i1,
  s1,
  a1,
  $b,
  $l,
  l1,
  c1,
  u1,
  d1,
  p1,
  m1,
  U9e,
  q9e,
  G9e,
  W9e,
  H9e,
  j9e,
  z9e,
  V9e,
  K9e,
  Z9e,
  X9e,
  Y9e,
  J9e,
  Q9e,
  eZe,
  op = g(() => {
    me();
    ((OF = /^[cC][0-9a-z]{6,}$/),
      (NF = /^[0-9a-z]+$/),
      (LF = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/),
      (BF = /^[0-9a-vA-V]{20}$/),
      (FF = /^[A-Za-z0-9]{27}$/),
      ($F = /^[a-zA-Z0-9_-]{21}$/));
    ((qF =
      /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/),
      (I9e =
        /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/),
      (GF = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/),
      (np = (t) =>
        t
          ? new RegExp(
              `^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${t}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`,
            )
          : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/),
      (k9e = np(4)),
      (D9e = np(6)),
      (M9e = np(7)),
      (WF =
        /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/),
      (O9e =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/),
      (N9e =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
      (A7 = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u),
      (L9e = A7),
      (B9e =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/),
      (F9e =
        "^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$"));
    ((jF =
      /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/),
      (zF =
        /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/),
      (VF = (t) => {
        let e = Yi(t ?? ":");
        return new RegExp(
          `^(?:[0-9A-F]{2}${e}){5}[0-9A-F]{2}$|^(?:[0-9a-f]{2}${e}){5}[0-9a-f]{2}$`,
        );
      }),
      (KF =
        /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/),
      (ZF =
        /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/),
      (XF = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/),
      (YF = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/),
      (JF =
        /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/),
      (QF = /^(?=.{1,253}$)([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/),
      (Fb = /^https?$/),
      (e1 = /^\+[1-9]\d{6,14}$/),
      (NE = /^\d(?:[ -]?\d){11,18}$/),
      (t1 =
        /^(?:AED|AFN|ALL|AMD|AOA|ARS|AUD|AWG|AZN|BAM|BBD|BDT|BHD|BIF|BMD|BND|BOB|BOV|BRL|BSD|BTN|BWP|BYN|BZD|CAD|CDF|CHE|CHF|CHW|CLF|CLP|CNY|COP|COU|CRC|CUP|CVE|CZK|DJF|DKK|DOP|DZD|EGP|ERN|ETB|EUR|FJD|FKP|GBP|GEL|GHS|GIP|GMD|GNF|GTQ|GYD|HKD|HNL|HTG|HUF|IDR|ILS|INR|IQD|IRR|ISK|JMD|JOD|JPY|KES|KGS|KHR|KMF|KPW|KRW|KWD|KYD|KZT|LAK|LBP|LKR|LRD|LSL|LYD|MAD|MDL|MGA|MKD|MMK|MNT|MOP|MRU|MUR|MVR|MWK|MXN|MXV|MYR|MZN|NAD|NGN|NIO|NOK|NPR|NZD|OMR|PAB|PEN|PGK|PHP|PKR|PLN|PYG|QAR|RON|RSD|RUB|RWF|SAR|SBD|SCR|SDG|SEK|SGD|SHP|SLE|SOS|SRD|SSP|STN|SVC|SYP|SZL|THB|TJS|TMT|TND|TOP|TRY|TTD|TWD|TZS|UAH|UGX|USD|USN|UYI|UYU|UYW|UZS|VED|VES|VND|VUV|WST|XAD|XAF|XAG|XAU|XBA|XBB|XBC|XBD|XCD|XCG|XDR|XOF|XPD|XPF|XPT|XSU|XTS|XUA|XXX|YER|ZAR|ZMW|ZWG)$/),
      (LE = /^[A-Z]{2}(?!00|01|99)\d{2}[A-Z0-9]{11,30}$/),
      (R7 =
        "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))"));
    r1 = $9e(R7);
    ((i1 = /^[\s\S]{0,}$/),
      (s1 = (t) => {
        let e = t ? `[\\s\\S]{${t?.minimum ?? 0},${t?.maximum ?? ""}}` : "[\\s\\S]*";
        return new RegExp(`^${e}$`);
      }),
      (a1 = /^-?\d+n?$/),
      ($b = /^-?\d+$/),
      ($l = /^-?\d+(?:\.\d+)?$/),
      (l1 = /^(?:true|false)$/i),
      (c1 = /^null$/i),
      (u1 = /^undefined$/i),
      (d1 = /^[^A-Z]*$/),
      (p1 = /^[^a-z]*$/),
      (m1 = /^[0-9a-fA-F]*$/));
    ((U9e = /^[0-9a-fA-F]{32}$/),
      (q9e = Ub(22, "==")),
      (G9e = qb(22)),
      (W9e = /^[0-9a-fA-F]{40}$/),
      (H9e = Ub(27, "=")),
      (j9e = qb(27)),
      (z9e = /^[0-9a-fA-F]{64}$/),
      (V9e = Ub(43, "=")),
      (K9e = qb(43)),
      (Z9e = /^[0-9a-fA-F]{96}$/),
      (X9e = Ub(64, "")),
      (Y9e = qb(64)),
      (J9e = /^[0-9a-fA-F]{128}$/),
      (Q9e = Ub(86, "==")),
      (eZe = qb(86)));
  });
function FE(t, e, r) {
  t.issues.length && e.issues.push(...Zo(r, t.issues));
}
var ir,
  f1,
  h1,
  BE,
  $E,
  UE,
  g1,
  y1,
  v1,
  b1,
  S1,
  w1,
  _1,
  x1,
  A1,
  ph,
  R1,
  E1,
  C1,
  T1,
  P1,
  I1,
  k1,
  D1,
  M1,
  O1,
  qE = g(() => {
    jc();
    op();
    me();
    ((ir = N("$ZodCheck", (t, e) => {
      var r;
      (t._zod ?? (t._zod = {}), (t._zod.def = e), (r = t._zod).onattach ?? (r.onattach = []));
    })),
      (f1 = (t) => {
        let e = t.value;
        return !_E(e) && e.size !== void 0;
      }),
      (h1 = (t) => {
        let e = t.value;
        return !_E(e) && e.length !== void 0;
      }),
      (BE = { number: "number", bigint: "bigint", object: "date" }),
      ($E = N("$ZodCheckLessThan", (t, e) => {
        ir.init(t, e);
        let r = BE[typeof e.value];
        t._zod.check = (n) => {
          (e.inclusive ? n.value <= e.value : n.value < e.value) ||
            n.issues.push({
              origin: BE[typeof n.value] ?? r,
              code: "too_big",
              maximum: typeof e.value == "object" ? e.value.getTime() : e.value,
              input: n.value,
              inclusive: e.inclusive,
              inst: t,
              continue: !e.abort,
            });
        };
      })),
      (UE = N("$ZodCheckGreaterThan", (t, e) => {
        ir.init(t, e);
        let r = BE[typeof e.value];
        t._zod.check = (n) => {
          (e.inclusive ? n.value >= e.value : n.value > e.value) ||
            n.issues.push({
              origin: BE[typeof n.value] ?? r,
              code: "too_small",
              minimum: typeof e.value == "object" ? e.value.getTime() : e.value,
              input: n.value,
              inclusive: e.inclusive,
              inst: t,
              continue: !e.abort,
            });
        };
      })),
      (g1 = N("$ZodCheckMultipleOf", (t, e) => {
        (ir.init(t, e),
          (t._zod.check = (r) => {
            if (typeof r.value != typeof e.value)
              throw new Error("Cannot mix number and bigint in multiple_of check.");
            (typeof r.value == "bigint"
              ? e.value !== BigInt(0) && r.value % e.value === BigInt(0)
              : Tb(r.value, e.value) === 0) ||
              r.issues.push({
                origin: typeof r.value,
                code: "not_multiple_of",
                divisor: e.value,
                input: r.value,
                inst: t,
                continue: !e.abort,
              });
          }));
      })),
      (y1 = N("$ZodCheckNumberFormat", (t, e) => {
        (ir.init(t, e), (e.format = e.format || "float64"));
        let r = e.format?.includes("int"),
          n = r ? "int" : "number",
          [o, i] = Ib[e.format];
        t._zod.check = (s) => {
          let a = s.value;
          if (r) {
            if (!Number.isInteger(a)) {
              s.issues.push({
                expected: n,
                format: e.format,
                code: "invalid_type",
                continue: !1,
                input: a,
                inst: t,
              });
              return;
            }
            if (!Number.isSafeInteger(a)) {
              a > 0
                ? s.issues.push({
                    input: a,
                    code: "too_big",
                    maximum: Number.MAX_SAFE_INTEGER,
                    note: "Integers must be within the safe integer range.",
                    inst: t,
                    origin: n,
                    inclusive: !0,
                    continue: !e.abort,
                  })
                : s.issues.push({
                    input: a,
                    code: "too_small",
                    minimum: Number.MIN_SAFE_INTEGER,
                    note: "Integers must be within the safe integer range.",
                    inst: t,
                    origin: n,
                    inclusive: !0,
                    continue: !e.abort,
                  });
              return;
            }
          }
          (a < o &&
            s.issues.push({
              origin: "number",
              input: a,
              code: "too_small",
              minimum: o,
              inclusive: !0,
              inst: t,
              continue: !e.abort,
            }),
            a > i &&
              s.issues.push({
                origin: "number",
                input: a,
                code: "too_big",
                maximum: i,
                inclusive: !0,
                inst: t,
                continue: !e.abort,
              }));
        };
      })),
      (v1 = N("$ZodCheckBigIntFormat", (t, e) => {
        ir.init(t, e);
        let [r, n] = kb[e.format];
        t._zod.check = (o) => {
          let i = o.value;
          (i < r &&
            o.issues.push({
              origin: "bigint",
              input: i,
              code: "too_small",
              minimum: r,
              inclusive: !0,
              inst: t,
              continue: !e.abort,
            }),
            i > n &&
              o.issues.push({
                origin: "bigint",
                input: i,
                code: "too_big",
                maximum: n,
                inclusive: !0,
                inst: t,
                continue: !e.abort,
              }));
        };
      })),
      (b1 = N("$ZodCheckMaxSize", (t, e) => {
        var r;
        (ir.init(t, e),
          (r = t._zod.def).when ?? (r.when = f1),
          (t._zod.check = (n) => {
            let o = n.value;
            o.size <= e.maximum ||
              n.issues.push({
                origin: Mb(o),
                code: "too_big",
                maximum: e.maximum,
                inclusive: !0,
                input: o,
                inst: t,
                continue: !e.abort,
              });
          }));
      })),
      (S1 = N("$ZodCheckMinSize", (t, e) => {
        var r;
        (ir.init(t, e),
          (r = t._zod.def).when ?? (r.when = f1),
          (t._zod.check = (n) => {
            let o = n.value;
            o.size >= e.minimum ||
              n.issues.push({
                origin: Mb(o),
                code: "too_small",
                minimum: e.minimum,
                inclusive: !0,
                input: o,
                inst: t,
                continue: !e.abort,
              });
          }));
      })),
      (w1 = N("$ZodCheckSizeEquals", (t, e) => {
        var r;
        (ir.init(t, e),
          (r = t._zod.def).when ?? (r.when = f1),
          (t._zod.check = (n) => {
            let o = n.value,
              i = o.size;
            if (i === e.size) return;
            let s = i > e.size;
            n.issues.push({
              origin: Mb(o),
              ...(s
                ? { code: "too_big", maximum: e.size }
                : { code: "too_small", minimum: e.size }),
              inclusive: !0,
              exact: !0,
              input: n.value,
              inst: t,
              continue: !e.abort,
            });
          }));
      })),
      (_1 = N("$ZodCheckMaxLength", (t, e) => {
        var r;
        (ir.init(t, e),
          (r = t._zod.def).when ?? (r.when = h1),
          (t._zod.check = (n) => {
            let o = n.value,
              i = o.length;
            if ((typeof o == "string" && i > e.maximum ? ep(o) : i) <= e.maximum) return;
            let a = Ob(o);
            n.issues.push({
              origin: a,
              code: "too_big",
              maximum: e.maximum,
              inclusive: !0,
              input: o,
              inst: t,
              continue: !e.abort,
            });
          }));
      })),
      (x1 = N("$ZodCheckMinLength", (t, e) => {
        var r;
        (ir.init(t, e),
          (r = t._zod.def).when ?? (r.when = h1),
          (t._zod.check = (n) => {
            let o = n.value,
              i = o.length;
            if (
              (typeof o == "string" && i >= e.minimum && i < e.minimum * 2 ? ep(o) : i) >= e.minimum
            )
              return;
            let a = Ob(o);
            n.issues.push({
              origin: a,
              code: "too_small",
              minimum: e.minimum,
              inclusive: !0,
              input: o,
              inst: t,
              continue: !e.abort,
            });
          }));
      })),
      (A1 = N("$ZodCheckLengthEquals", (t, e) => {
        var r;
        (ir.init(t, e),
          (r = t._zod.def).when ?? (r.when = h1),
          (t._zod.check = (n) => {
            let o = n.value,
              i = o.length,
              s = typeof o == "string" && i >= e.length && i <= e.length * 2 ? ep(o) : i;
            if (s === e.length) return;
            let a = Ob(o),
              l = s > e.length;
            n.issues.push({
              origin: a,
              ...(l
                ? { code: "too_big", maximum: e.length }
                : { code: "too_small", minimum: e.length }),
              inclusive: !0,
              exact: !0,
              input: n.value,
              inst: t,
              continue: !e.abort,
            });
          }));
      })),
      (ph = N("$ZodCheckStringFormat", (t, e) => {
        var r, n;
        (ir.init(t, e),
          e.pattern
            ? ((r = t._zod).check ??
              (r.check = (o) => {
                ((e.pattern.lastIndex = 0),
                  !e.pattern.test(o.value) &&
                    o.issues.push({
                      origin: "string",
                      code: "invalid_format",
                      format: e.format,
                      input: o.value,
                      ...(e.pattern ? { pattern: e.pattern.toString() } : {}),
                      inst: t,
                      continue: !e.abort,
                    }));
              }))
            : ((n = t._zod).check ?? (n.check = () => {})));
      })),
      (R1 = N("$ZodCheckRegex", (t, e) => {
        (ph.init(t, e),
          (t._zod.check = (r) => {
            ((e.pattern.lastIndex = 0),
              !e.pattern.test(r.value) &&
                r.issues.push({
                  origin: "string",
                  code: "invalid_format",
                  format: "regex",
                  input: r.value,
                  pattern: e.pattern.toString(),
                  inst: t,
                  continue: !e.abort,
                }));
          }));
      })),
      (E1 = N("$ZodCheckLowerCase", (t, e) => {
        (e.pattern ?? (e.pattern = d1), ph.init(t, e));
      })),
      (C1 = N("$ZodCheckUpperCase", (t, e) => {
        (e.pattern ?? (e.pattern = p1), ph.init(t, e));
      })),
      (T1 = N("$ZodCheckIncludes", (t, e) => {
        ir.init(t, e);
        let r = Yi(e.includes),
          n = new RegExp(typeof e.position == "number" ? `^.{${e.position},}${r}` : r);
        ((e.pattern = n),
          (t._zod.check = (o) => {
            o.value.includes(e.includes, e.position) ||
              o.issues.push({
                origin: "string",
                code: "invalid_format",
                format: "includes",
                includes: e.includes,
                input: o.value,
                inst: t,
                continue: !e.abort,
              });
          }));
      })),
      (P1 = N("$ZodCheckStartsWith", (t, e) => {
        ir.init(t, e);
        let r = new RegExp(`^${Yi(e.prefix)}.*`);
        (e.pattern ?? (e.pattern = r),
          (t._zod.check = (n) => {
            n.value.startsWith(e.prefix) ||
              n.issues.push({
                origin: "string",
                code: "invalid_format",
                format: "starts_with",
                prefix: e.prefix,
                input: n.value,
                inst: t,
                continue: !e.abort,
              });
          }));
      })),
      (I1 = N("$ZodCheckEndsWith", (t, e) => {
        ir.init(t, e);
        let r = new RegExp(`.*${Yi(e.suffix)}$`);
        (e.pattern ?? (e.pattern = r),
          (t._zod.check = (n) => {
            n.value.endsWith(e.suffix) ||
              n.issues.push({
                origin: "string",
                code: "invalid_format",
                format: "ends_with",
                suffix: e.suffix,
                input: n.value,
                inst: t,
                continue: !e.abort,
              });
          }));
      })));
    ((k1 = N("$ZodCheckProperty", (t, e) => {
      (ir.init(t, e),
        (t._zod.check = (r) => {
          let n = e.schema._zod.run({ value: r.value[e.property], issues: [] }, {});
          if (n instanceof Promise) return n.then((o) => FE(o, r, e.property));
          FE(n, r, e.property);
        }));
    })),
      (D1 = N("$ZodCheckProperties", (t, e) => {
        (ir.init(t, e),
          Nb(t, Symbol.iterator, function* () {
            yield t;
          }));
        let r;
        t._zod.check = (n) => {
          if (n.value == null) {
            n.issues.push({ expected: "object", code: "invalid_type", input: n.value, inst: t });
            return;
          }
          r ?? (r = Reflect.ownKeys(e.shape).map((s) => [s, e.shape[s]]));
          let o = n.value,
            i;
          for (let [s, a] of r) {
            let l = a._zod.run({ value: o[s], issues: [] }, {});
            l instanceof Promise
              ? (i ?? (i = []), i.push(l.then((c) => FE(c, n, s))))
              : FE(l, n, s);
          }
          if (i) return Promise.all(i).then(() => {});
        };
      })),
      (M1 = N("$ZodCheckMimeType", (t, e) => {
        ir.init(t, e);
        let r = new Set(e.mime);
        t._zod.check = (n) => {
          r.has(n.value.type) ||
            n.issues.push({
              code: "invalid_value",
              values: e.mime,
              input: n.value.type,
              inst: t,
              continue: !e.abort,
            });
        };
      })),
      (O1 = N("$ZodCheckOverwrite", (t, e) => {
        (ir.init(t, e),
          (t._zod.check = (r) => {
            r.value = e.tx(r.value);
          }));
      })));
  });
var ip,
  GE = g(() => {
    ip = class {
      constructor(e = [], r = {}) {
        ((this.content = []), (this.indent = 0), (this.args = e), (this.closed = r));
      }
      indented(e) {
        this.indent += 1;
        try {
          e(this);
        } finally {
          this.indent -= 1;
        }
      }
      write(e) {
        if (typeof e == "function") {
          (e(this, { execution: "sync" }), e(this, { execution: "async" }));
          return;
        }
        let n = e
            .split(
              `
`,
            )
            .filter((s) => s),
          o = Math.min(...n.map((s) => s.length - s.trimStart().length)),
          i = n.map((s) => s.slice(o)).map((s) => " ".repeat(this.indent * 2) + s);
        for (let s of i) this.content.push(s);
      }
      compile() {
        let e = Function,
          r = this?.content ?? [""];
        return new e(
          ...Object.keys(this.closed),
          `return function (${this.args.join(", ")}) {
${r.join(`
`)}
};`,
        )(...Object.values(this.closed));
      }
    };
  });
var N1,
  L1 = g(() => {
    N1 = { major: 4, minor: 6, patch: 7 };
  });
async function tZe(t, e) {
  let r = { async: !0 };
  return G7(await t._zod.run({ value: e, issues: [] }, r), r);
}
function VE(t) {
  return {
    validate: (e) => {
      let r = { async: !1 };
      try {
        let n = t._zod.run({ value: e, issues: [] }, r);
        if (!(n instanceof Promise)) return G7(n, r);
      } catch {}
      return tZe(t, e);
    },
    vendor: "zod",
    version: 1,
  };
}
function $1(t) {
  try {
    return typeof URL < "u" && typeof URL.canParse == "function"
      ? URL.canParse(t)
      : (new URL(t), !0);
  } catch {
    return !1;
  }
}
function YE(t, e) {
  return !("normalize" in e) && !("hostname" in e) && !("protocol" in e) ? $1(t) || Gb : W7(t, e);
}
function W7(t, e) {
  if (!e.normalize && e.protocol?.source === Fb.source && !/^https?:\/\//i.test(t)) return F1;
  try {
    if (typeof URL < "u") {
      let r = URL;
      if (typeof r.parse == "function") return r.parse(t) ?? Gb;
    }
    return new URL(t);
  } catch {
    return Gb;
  }
}
function Wb(t) {
  return t.replace(rZe, "");
}
function JE(t, e) {
  return ((e.lastIndex = 0), e.test(t.hostname));
}
function QE(t, e) {
  return (
    (e.lastIndex = 0),
    e.test(t.protocol.endsWith(":") ? t.protocol.slice(0, -1) : t.protocol)
  );
}
function Hb(t) {
  return nZe.test(t) ? $1(`http://[${t}]`) : !1;
}
function pC(t) {
  let e = t.split("/");
  if (e.length !== 2) return !1;
  let [r, n] = e;
  if (!n) return !1;
  let o = Number(n);
  return `${o}` !== n || o < 0 || o > 128 ? !1 : Hb(r);
}
function jb(t) {
  if (t === "") return !0;
  if (/\s/.test(t) || t.length % 4 !== 0) return !1;
  try {
    return (atob(t), !0);
  } catch {
    return !1;
  }
}
function gC(t) {
  if (!zb.test(t)) return !1;
  let e = t.replace(/[-_]/g, (n) => (n === "-" ? "+" : "/")),
    r = e.padEnd(Math.ceil(e.length / 4) * 4, "=");
  return jb(r);
}
function iZe(t) {
  let e = t.length,
    r = 1,
    n = 0;
  for (; e; ) {
    let o = t.charCodeAt(--e) - 48;
    ((r ^= 1), (n += r ? [0, 2, 4, 6, 8, 1, 3, 5, 7, 9][o] : o));
  }
  return n % 10 === 0;
}
function bC(t) {
  return NE.test(t) ? iZe(t.replace(oZe, "")) : !1;
}
function sZe(t) {
  let e = 0,
    r = t.length;
  for (let n = 4; n < r; n++) {
    let o = t.charCodeAt(n);
    e = (o >= 65 ? e * 100 + (o - 55) : e * 10 + (o - 48)) % 97;
  }
  for (let n = 0; n < 4; n++) {
    let o = t.charCodeAt(n);
    e = (o >= 65 ? e * 100 + (o - 55) : e * 10 + (o - 48)) % 97;
  }
  return e === 1;
}
function wC(t) {
  return LE.test(t) ? sZe(t) : !1;
}
function xC(t, e = null) {
  try {
    let r = t.split(".");
    if (r.length !== 3) return !1;
    let [n] = r;
    if (!n) return !1;
    let o = JSON.parse(atob(n));
    return !(("typ" in o && o?.typ !== "JWT") || !o.alg || (e && (!("alg" in o) || o.alg !== e)));
  } catch {
    return !1;
  }
}
function H1(t, e) {
  let r = rh(t._zod.def.checks);
  if (!r.length) return;
  let n = Math.min(...r.map((i) => i[0])),
    o = t._zod.parse;
  t._zod.parse = (i, s) => {
    let a = e(i.value);
    if (a > n && !s?.skipChecks && s?.direction !== "backward") {
      for (let [l, c] of rh(t._zod.def.checks))
        if (a > l && c._zod.def.when(i)) {
          let u = i.issues.length;
          return (c._zod.check(i), (i.issues[u].continue = !1), Db(i.issues, u, t), i);
        }
    }
    return o(i, s);
  };
}
function C7(t, e, r) {
  (t.issues.length && e.issues.push(...Zo(r, t.issues)), (e.value[r] = t.value));
}
