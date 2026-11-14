rb.create = (t, e) => new rb({ innerType: t, typeName: se.ZodReadonly, ...at(e) });
var gxn = { object: ji.lazycreate },
  se;
(function (t) {
  ((t.ZodString = "ZodString"),
    (t.ZodNumber = "ZodNumber"),
    (t.ZodNaN = "ZodNaN"),
    (t.ZodBigInt = "ZodBigInt"),
    (t.ZodBoolean = "ZodBoolean"),
    (t.ZodDate = "ZodDate"),
    (t.ZodSymbol = "ZodSymbol"),
    (t.ZodUndefined = "ZodUndefined"),
    (t.ZodNull = "ZodNull"),
    (t.ZodAny = "ZodAny"),
    (t.ZodUnknown = "ZodUnknown"),
    (t.ZodNever = "ZodNever"),
    (t.ZodVoid = "ZodVoid"),
    (t.ZodArray = "ZodArray"),
    (t.ZodObject = "ZodObject"),
    (t.ZodUnion = "ZodUnion"),
    (t.ZodDiscriminatedUnion = "ZodDiscriminatedUnion"),
    (t.ZodIntersection = "ZodIntersection"),
    (t.ZodTuple = "ZodTuple"),
    (t.ZodRecord = "ZodRecord"),
    (t.ZodMap = "ZodMap"),
    (t.ZodSet = "ZodSet"),
    (t.ZodFunction = "ZodFunction"),
    (t.ZodLazy = "ZodLazy"),
    (t.ZodLiteral = "ZodLiteral"),
    (t.ZodEnum = "ZodEnum"),
    (t.ZodEffects = "ZodEffects"),
    (t.ZodNativeEnum = "ZodNativeEnum"),
    (t.ZodOptional = "ZodOptional"),
    (t.ZodNullable = "ZodNullable"),
    (t.ZodDefault = "ZodDefault"),
    (t.ZodCatch = "ZodCatch"),
    (t.ZodPromise = "ZodPromise"),
    (t.ZodBranded = "ZodBranded"),
    (t.ZodPipeline = "ZodPipeline"),
    (t.ZodReadonly = "ZodReadonly"));
})(se || (se = {}));
var yxn = jv.create,
  vxn = xR.create,
  bxn = DR.create,
  Sxn = AR.create,
  wxn = RR.create,
  _xn = ER.create,
  xxn = CR.create,
  Axn = zv.create,
  Rxn = Vv.create,
  Exn = TR.create,
  Cxn = Id.create,
  Txn = El.create,
  Pxn = PR.create,
  Ixn = kd.create,
  z4e = ji.create,
  kxn = ji.strictCreate,
  Dxn = Kv.create,
  Mxn = cX.create,
  Oxn = Zv.create,
  Nxn = Nc.create,
  Lxn = dX.create,
  Bxn = IR.create,
  Fxn = kR.create,
  $xn = pX.create,
  Uxn = Xv.create,
  qxn = Yv.create,
  Gxn = Jv.create,
  Wxn = Qv.create,
  Hxn = Tf.create,
  jxn = aa.create,
  zxn = sa.create,
  Vxn = Lc.create,
  Kxn = aa.createWithPreprocess,
  Zxn = Z2.create;
po();
po();
po();
me();
var xVt = N(
  "ZodMiniType",
  (t, e) => {
    if (!t._zod) throw new Error("Uninitialized schema in ZodMiniType.");
    (Je.init(t, e), (t.def = e), (t.type = e.type));
  },
  {
    get with() {
      return this.check;
    },
    set with(t) {
      va(this, "with", t);
    },
    parse(t, e) {
      return tp(this, t, e, { callee: this.parse });
    },
    parseAsync(t, e) {
      return rp(this, t, e, { callee: this.parseAsync });
    },
    safeParse(t, e) {
      return ah(this, t, e);
    },
    safeParseAsync(t, e) {
      return ch(this, t, e);
    },
    check(...t) {
      let e = this.def;
      return this.clone(
        {
          ...e,
          checks: [
            ...(e.checks ?? []),
            ...t.map((r) =>
              typeof r == "function"
                ? { _zod: { check: r, def: { check: "custom" }, onattach: [] } }
                : r,
            ),
          ],
        },
        { parent: !0 },
      );
    },
    clone(t, e) {
      return Wt(this, t, e);
    },
    brand() {
      return this;
    },
    register(t, e) {
      return (t.add(this, e), this);
    },
    apply(t, ...e) {
      return e.length === 0 ? t(this) : t(this, ...e);
    },
  },
);
var AVt = N("ZodMiniObject", (t, e) => {
  (BC.init(t, e), xVt.init(t, e), wF(t, "shape", (r) => r._zod.def.shape, !1));
});
function mX(t, e) {
  let r = { type: "object", shape: t ?? {}, ...re(e) };
  return new AVt(r);
}
Uh();
gT();
function bs(t) {
  return !!t._zod;
}
function Pf(t) {
  let e = Object.values(t);
  if (e.length === 0) return mX({});
  let r = e.every(bs),
    n = e.every((o) => !bs(o));
  if (r) return mX(t);
  if (n) return z4e(t);
  throw new Error("Mixed Zod versions detected in object shape.");
}
function Dd(t, e) {
  return bs(t) ? ah(t, e) : t.safeParse(e);
}
async function X2(t, e) {
  return bs(t) ? await ch(t, e) : await t.safeParseAsync(e);
}
function Md(t) {
  if (!t) return;
  let e;
  if ((bs(t) ? (e = t._zod?.def?.shape) : (e = t.shape), !!e)) {
    if (typeof e == "function")
      try {
        return e();
      } catch {
        return;
      }
    return e;
  }
}
function nb(t) {
  if (t) {
    if (typeof t == "object") {
      let e = t,
        r = t;
      if (!e._def && !r._zod) {
        let n = Object.values(t);
        if (
          n.length > 0 &&
          n.every(
            (o) =>
              typeof o == "object" &&
              o !== null &&
              (o._def !== void 0 || o._zod !== void 0 || typeof o.parse == "function"),
          )
        )
          return Pf(t);
      }
    }
    if (bs(t)) {
      let r = t._zod?.def;
      if (r && (r.type === "object" || r.shape !== void 0)) return t;
    } else if (t.shape !== void 0) return t;
  }
}
function Y2(t) {
  if (t && typeof t == "object") {
    if ("message" in t && typeof t.message == "string") return t.message;
    if ("issues" in t && Array.isArray(t.issues) && t.issues.length > 0) {
      let e = t.issues[0];
      if (e && typeof e == "object" && "message" in e) return String(e.message);
    }
    try {
      return JSON.stringify(t);
    } catch {
      return String(t);
    }
  }
  return String(t);
}
function V4e(t) {
  return t.description;
}
function K4e(t) {
  if (bs(t)) return t._zod?.def?.type === "optional";
  let e = t;
  return typeof t.isOptional == "function" ? t.isOptional() : e._def?.typeName === "ZodOptional";
}
function J2(t) {
  if (bs(t)) {
    let i = t._zod?.def;
    if (i) {
      if (i.value !== void 0) return i.value;
      if (Array.isArray(i.values) && i.values.length > 0) return i.values[0];
    }
  }
  let r = t._def;
  if (r) {
    if (r.value !== void 0) return r.value;
    if (Array.isArray(r.values) && r.values.length > 0) return r.values[0];
  }
  let n = t.value;
  if (n !== void 0) return n;
}
Wp();
function Od(t) {
  return t === "completed" || t === "failed" || t === "cancelled";
}
var X4e = Symbol("Let zodToJsonSchema decide on which parser to use");
var Z4e = {
    name: void 0,
    $refStrategy: "root",
    basePath: ["#"],
    effectStrategy: "input",
    pipeStrategy: "all",
    dateStrategy: "format:date-time",
    mapStrategy: "entries",
    removeAdditionalStrategy: "passthrough",
    allowedAdditionalProperties: !0,
    rejectedAdditionalProperties: !1,
    definitionPath: "definitions",
    target: "jsonSchema7",
    strictUnions: !1,
    definitions: {},
    errorMessages: !1,
    markdownDescription: !1,
    patternStrategy: "escape",
    applyRegexFlags: !1,
    emailStrategy: "format:email",
    base64Strategy: "contentEncoding:base64",
    nameStrategy: "ref",
    openAiAnyTypeName: "OpenAiAnyType",
  },
  Y4e = (t) => (typeof t == "string" ? { ...Z4e, name: t } : { ...Z4e, ...t });
var J4e = (t) => {
  let e = Y4e(t),
    r = e.name !== void 0 ? [...e.basePath, e.definitionPath, e.name] : e.basePath;
  return {
    ...e,
    flags: { hasReferencedOpenAiAnyType: !1 },
    currentPath: r,
    propertyPath: void 0,
    seen: new Map(
      Object.entries(e.definitions).map(([n, o]) => [
        o._def,
        { def: o._def, path: [...e.basePath, e.definitionPath, n], jsonSchema: void 0 },
      ]),
    ),
  };
};
function fX(t, e, r, n) {
  n?.errorMessages && r && (t.errorMessage = { ...t.errorMessage, [e]: r });
}
function Mt(t, e, r, n, o) {
  ((t[e] = r), fX(t, e, n, o));
}
var Q2 = (t, e) => {
  let r = 0;
  for (; r < t.length && r < e.length && t[r] === e[r]; r++);
  return [(t.length - r).toString(), ...e.slice(r)].join("/");
};
function Ur(t) {
  if (t.target !== "openAi") return {};
  let e = [...t.basePath, t.definitionPath, t.openAiAnyTypeName];
  return (
    (t.flags.hasReferencedOpenAiAnyType = !0),
    { $ref: t.$refStrategy === "relative" ? Q2(e, t.currentPath) : e.join("/") }
  );
}
function Q4e(t, e) {
  let r = { type: "array" };
  return (
    t.type?._def &&
      t.type?._def?.typeName !== se.ZodAny &&
      (r.items = Xe(t.type._def, { ...e, currentPath: [...e.currentPath, "items"] })),
    t.minLength && Mt(r, "minItems", t.minLength.value, t.minLength.message, e),
    t.maxLength && Mt(r, "maxItems", t.maxLength.value, t.maxLength.message, e),
    t.exactLength &&
      (Mt(r, "minItems", t.exactLength.value, t.exactLength.message, e),
      Mt(r, "maxItems", t.exactLength.value, t.exactLength.message, e)),
    r
  );
}
function eVe(t, e) {
  let r = { type: "integer", format: "int64" };
  if (!t.checks) return r;
  for (let n of t.checks)
    switch (n.kind) {
      case "min":
        e.target === "jsonSchema7"
          ? n.inclusive
            ? Mt(r, "minimum", n.value, n.message, e)
            : Mt(r, "exclusiveMinimum", n.value, n.message, e)
          : (n.inclusive || (r.exclusiveMinimum = !0), Mt(r, "minimum", n.value, n.message, e));
        break;
      case "max":
        e.target === "jsonSchema7"
          ? n.inclusive
            ? Mt(r, "maximum", n.value, n.message, e)
            : Mt(r, "exclusiveMaximum", n.value, n.message, e)
          : (n.inclusive || (r.exclusiveMaximum = !0), Mt(r, "maximum", n.value, n.message, e));
        break;
      case "multipleOf":
        Mt(r, "multipleOf", n.value, n.message, e);
        break;
    }
  return r;
}
function tVe() {
  return { type: "boolean" };
}
function eB(t, e) {
  return Xe(t.type._def, e);
}
var rVe = (t, e) => Xe(t.innerType._def, e);
function hX(t, e, r) {
  let n = r ?? e.dateStrategy;
  if (Array.isArray(n)) return { anyOf: n.map((o, i) => hX(t, e, o)) };
  switch (n) {
    case "string":
    case "format:date-time":
      return { type: "string", format: "date-time" };
    case "format:date":
      return { type: "string", format: "date" };
    case "integer":
      return EVt(t, e);
  }
}
var EVt = (t, e) => {
  let r = { type: "integer", format: "unix-time" };
  if (e.target === "openApi3") return r;
  for (let n of t.checks)
    switch (n.kind) {
      case "min":
        Mt(r, "minimum", n.value, n.message, e);
        break;
      case "max":
        Mt(r, "maximum", n.value, n.message, e);
        break;
    }
  return r;
};
function nVe(t, e) {
  return { ...Xe(t.innerType._def, e), default: t.defaultValue() };
}
function oVe(t, e) {
  return e.effectStrategy === "input" ? Xe(t.schema._def, e) : Ur(e);
}
function iVe(t) {
  return { type: "string", enum: Array.from(t.values) };
}
var CVt = (t) => ("type" in t && t.type === "string" ? !1 : "allOf" in t);
function sVe(t, e) {
  let r = [
      Xe(t.left._def, { ...e, currentPath: [...e.currentPath, "allOf", "0"] }),
      Xe(t.right._def, { ...e, currentPath: [...e.currentPath, "allOf", "1"] }),
    ].filter((i) => !!i),
    n = e.target === "jsonSchema2019-09" ? { unevaluatedProperties: !1 } : void 0,
    o = [];
  return (
    r.forEach((i) => {
      if (CVt(i)) (o.push(...i.allOf), i.unevaluatedProperties === void 0 && (n = void 0));
      else {
        let s = i;
        if ("additionalProperties" in i && i.additionalProperties === !1) {
          let { additionalProperties: a, ...l } = i;
          s = l;
        } else n = void 0;
        o.push(s);
      }
    }),
    o.length ? { allOf: o, ...n } : void 0
  );
}
function aVe(t, e) {
  let r = typeof t.value;
  return r !== "bigint" && r !== "number" && r !== "boolean" && r !== "string"
    ? { type: Array.isArray(t.value) ? "array" : "object" }
    : e.target === "openApi3"
      ? { type: r === "bigint" ? "integer" : r, enum: [t.value] }
      : { type: r === "bigint" ? "integer" : r, const: t.value };
}
var gX,
  la = {
    cuid: /^[cC][^\s-]{8,}$/,
    cuid2: /^[0-9a-z]+$/,
    ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
    email:
      /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
    emoji: () => (
      gX === void 0 && (gX = RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u")),
      gX
    ),
    uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
    ipv4Cidr:
      /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
    ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
    ipv6Cidr:
      /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
    base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
    base64url: /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
    nanoid: /^[a-zA-Z0-9_-]{21}$/,
    jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
  };
function tB(t, e) {
  let r = { type: "string" };
  if (t.checks)
    for (let n of t.checks)
      switch (n.kind) {
        case "min":
          Mt(
            r,
            "minLength",
            typeof r.minLength == "number" ? Math.max(r.minLength, n.value) : n.value,
            n.message,
            e,
          );
          break;
        case "max":
          Mt(
            r,
            "maxLength",
            typeof r.maxLength == "number" ? Math.min(r.maxLength, n.value) : n.value,
            n.message,
            e,
          );
          break;
        case "email":
          switch (e.emailStrategy) {
            case "format:email":
              ca(r, "email", n.message, e);
              break;
            case "format:idn-email":
              ca(r, "idn-email", n.message, e);
              break;
            case "pattern:zod":
              jo(r, la.email, n.message, e);
              break;
          }
          break;
        case "url":
          ca(r, "uri", n.message, e);
          break;
        case "uuid":
          ca(r, "uuid", n.message, e);
          break;
        case "regex":
          jo(r, n.regex, n.message, e);
          break;
        case "cuid":
          jo(r, la.cuid, n.message, e);
          break;
        case "cuid2":
          jo(r, la.cuid2, n.message, e);
          break;
        case "startsWith":
          jo(r, RegExp(`^${yX(n.value, e)}`), n.message, e);
          break;
        case "endsWith":
          jo(r, RegExp(`${yX(n.value, e)}$`), n.message, e);
          break;
        case "datetime":
          ca(r, "date-time", n.message, e);
          break;
        case "date":
          ca(r, "date", n.message, e);
          break;
        case "time":
          ca(r, "time", n.message, e);
          break;
        case "duration":
          ca(r, "duration", n.message, e);
          break;
        case "length":
          (Mt(
            r,
            "minLength",
            typeof r.minLength == "number" ? Math.max(r.minLength, n.value) : n.value,
            n.message,
            e,
          ),
            Mt(
              r,
              "maxLength",
              typeof r.maxLength == "number" ? Math.min(r.maxLength, n.value) : n.value,
              n.message,
              e,
            ));
          break;
        case "includes": {
          jo(r, RegExp(yX(n.value, e)), n.message, e);
          break;
        }
        case "ip": {
          (n.version !== "v6" && ca(r, "ipv4", n.message, e),
            n.version !== "v4" && ca(r, "ipv6", n.message, e));
          break;
        }
        case "base64url":
          jo(r, la.base64url, n.message, e);
          break;
        case "jwt":
          jo(r, la.jwt, n.message, e);
          break;
        case "cidr": {
          (n.version !== "v6" && jo(r, la.ipv4Cidr, n.message, e),
            n.version !== "v4" && jo(r, la.ipv6Cidr, n.message, e));
          break;
        }
        case "emoji":
          jo(r, la.emoji(), n.message, e);
          break;
        case "ulid": {
          jo(r, la.ulid, n.message, e);
          break;
        }
        case "base64": {
          switch (e.base64Strategy) {
            case "format:binary": {
              ca(r, "binary", n.message, e);
              break;
            }
            case "contentEncoding:base64": {
              Mt(r, "contentEncoding", "base64", n.message, e);
              break;
            }
            case "pattern:zod": {
              jo(r, la.base64, n.message, e);
              break;
            }
          }
          break;
        }
        case "nanoid":
          jo(r, la.nanoid, n.message, e);
        case "toLowerCase":
        case "toUpperCase":
        case "trim":
          break;
        default:
      }
  return r;
}
function yX(t, e) {
  return e.patternStrategy === "escape" ? PVt(t) : t;
}
var TVt = new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");
function PVt(t) {
  let e = "";
  for (let r = 0; r < t.length; r++) (TVt.has(t[r]) || (e += "\\"), (e += t[r]));
  return e;
}
function ca(t, e, r, n) {
  t.format || t.anyOf?.some((o) => o.format)
    ? (t.anyOf || (t.anyOf = []),
      t.format &&
        (t.anyOf.push({
          format: t.format,
          ...(t.errorMessage &&
            n.errorMessages && { errorMessage: { format: t.errorMessage.format } }),
        }),
        delete t.format,
        t.errorMessage &&
          (delete t.errorMessage.format,
          Object.keys(t.errorMessage).length === 0 && delete t.errorMessage)),
      t.anyOf.push({ format: e, ...(r && n.errorMessages && { errorMessage: { format: r } }) }))
    : Mt(t, "format", e, r, n);
}
function jo(t, e, r, n) {
  t.pattern || t.allOf?.some((o) => o.pattern)
    ? (t.allOf || (t.allOf = []),
      t.pattern &&
        (t.allOf.push({
          pattern: t.pattern,
          ...(t.errorMessage &&
            n.errorMessages && { errorMessage: { pattern: t.errorMessage.pattern } }),
        }),
        delete t.pattern,
        t.errorMessage &&
          (delete t.errorMessage.pattern,
          Object.keys(t.errorMessage).length === 0 && delete t.errorMessage)),
      t.allOf.push({
        pattern: lVe(e, n),
        ...(r && n.errorMessages && { errorMessage: { pattern: r } }),
      }))
    : Mt(t, "pattern", lVe(e, n), r, n);
}
function lVe(t, e) {
  if (!e.applyRegexFlags || !t.flags) return t.source;
  let r = { i: t.flags.includes("i"), m: t.flags.includes("m"), s: t.flags.includes("s") },
    n = r.i ? t.source.toLowerCase() : t.source,
    o = "",
    i = !1,
    s = !1,
    a = !1;
  for (let l = 0; l < n.length; l++) {
    if (i) {
      ((o += n[l]), (i = !1));
      continue;
    }
    if (r.i) {
      if (s) {
        if (n[l].match(/[a-z]/)) {
          a
            ? ((o += n[l]), (o += `${n[l - 2]}-${n[l]}`.toUpperCase()), (a = !1))
            : n[l + 1] === "-" && n[l + 2]?.match(/[a-z]/)
              ? ((o += n[l]), (a = !0))
              : (o += `${n[l]}${n[l].toUpperCase()}`);
          continue;
        }
      } else if (n[l].match(/[a-z]/)) {
        o += `[${n[l]}${n[l].toUpperCase()}]`;
        continue;
      }
    }
    if (r.m) {
      if (n[l] === "^") {
        o += `(^|(?<=[\r
]))`;
        continue;
      } else if (n[l] === "$") {
        o += `($|(?=[\r
]))`;
        continue;
      }
    }
    if (r.s && n[l] === ".") {
      o += s
        ? `${n[l]}\r
`
        : `[${n[l]}\r
]`;
      continue;
    }
    ((o += n[l]),
      n[l] === "\\" ? (i = !0) : s && n[l] === "]" ? (s = !1) : !s && n[l] === "[" && (s = !0));
  }
  try {
    new RegExp(o);
  } catch {
    return (
      console.warn(
        `Could not convert regex pattern at ${e.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`,
      ),
      t.source
    );
  }
  return o;
}
function rB(t, e) {
  if (
    (e.target === "openAi" &&
      console.warn(
        "Warning: OpenAI may not support records in schemas! Try an array of key-value pairs instead.",
      ),
    e.target === "openApi3" && t.keyType?._def.typeName === se.ZodEnum)
  )
    return {
      type: "object",
      required: t.keyType._def.values,
      properties: t.keyType._def.values.reduce(
        (n, o) => ({
          ...n,
          [o]:
            Xe(t.valueType._def, { ...e, currentPath: [...e.currentPath, "properties", o] }) ??
            Ur(e),
        }),
        {},
      ),
      additionalProperties: e.rejectedAdditionalProperties,
    };
  let r = {
    type: "object",
    additionalProperties:
      Xe(t.valueType._def, { ...e, currentPath: [...e.currentPath, "additionalProperties"] }) ??
      e.allowedAdditionalProperties,
  };
  if (e.target === "openApi3") return r;
  if (t.keyType?._def.typeName === se.ZodString && t.keyType._def.checks?.length) {
    let { type: n, ...o } = tB(t.keyType._def, e);
    return { ...r, propertyNames: o };
  } else {
    if (t.keyType?._def.typeName === se.ZodEnum)
      return { ...r, propertyNames: { enum: t.keyType._def.values } };
    if (
      t.keyType?._def.typeName === se.ZodBranded &&
      t.keyType._def.type._def.typeName === se.ZodString &&
      t.keyType._def.type._def.checks?.length
    ) {
      let { type: n, ...o } = eB(t.keyType._def, e);
      return { ...r, propertyNames: o };
    }
  }
  return r;
}
function cVe(t, e) {
  if (e.mapStrategy === "record") return rB(t, e);
  let r =
      Xe(t.keyType._def, { ...e, currentPath: [...e.currentPath, "items", "items", "0"] }) || Ur(e),
    n =
      Xe(t.valueType._def, { ...e, currentPath: [...e.currentPath, "items", "items", "1"] }) ||
      Ur(e);
  return {
    type: "array",
    maxItems: 125,
    items: { type: "array", items: [r, n], minItems: 2, maxItems: 2 },
  };
}
function uVe(t) {
  let e = t.values,
    n = Object.keys(t.values)
      .filter((i) => typeof e[e[i]] != "number")
      .map((i) => e[i]),
    o = Array.from(new Set(n.map((i) => typeof i)));
  return {
    type: o.length === 1 ? (o[0] === "string" ? "string" : "number") : ["string", "number"],
    enum: n,
  };
}
function dVe(t) {
  return t.target === "openAi"
    ? void 0
    : { not: Ur({ ...t, currentPath: [...t.currentPath, "not"] }) };
}
function pVe(t) {
  return t.target === "openApi3" ? { enum: ["null"], nullable: !0 } : { type: "null" };
}
var MR = {
  ZodString: "string",
  ZodNumber: "number",
  ZodBigInt: "integer",
  ZodBoolean: "boolean",
  ZodNull: "null",
};
function fVe(t, e) {
  if (e.target === "openApi3") return mVe(t, e);
  let r = t.options instanceof Map ? Array.from(t.options.values()) : t.options;
  if (r.every((n) => n._def.typeName in MR && (!n._def.checks || !n._def.checks.length))) {
    let n = r.reduce((o, i) => {
      let s = MR[i._def.typeName];
      return s && !o.includes(s) ? [...o, s] : o;
    }, []);
    return { type: n.length > 1 ? n : n[0] };
  } else if (r.every((n) => n._def.typeName === "ZodLiteral" && !n.description)) {
    let n = r.reduce((o, i) => {
      let s = typeof i._def.value;
      switch (s) {
        case "string":
        case "number":
        case "boolean":
          return [...o, s];
        case "bigint":
          return [...o, "integer"];
        case "object":
          if (i._def.value === null) return [...o, "null"];
        case "symbol":
        case "undefined":
        case "function":
        default:
          return o;
      }
    }, []);
    if (n.length === r.length) {
      let o = n.filter((i, s, a) => a.indexOf(i) === s);
      return {
        type: o.length > 1 ? o : o[0],
        enum: r.reduce((i, s) => (i.includes(s._def.value) ? i : [...i, s._def.value]), []),
      };
    }
  } else if (r.every((n) => n._def.typeName === "ZodEnum"))
    return {
      type: "string",
      enum: r.reduce((n, o) => [...n, ...o._def.values.filter((i) => !n.includes(i))], []),
    };
  return mVe(t, e);
}
var mVe = (t, e) => {
  let r = (t.options instanceof Map ? Array.from(t.options.values()) : t.options)
    .map((n, o) => Xe(n._def, { ...e, currentPath: [...e.currentPath, "anyOf", `${o}`] }))
    .filter((n) => !!n && (!e.strictUnions || (typeof n == "object" && Object.keys(n).length > 0)));
  return r.length ? { anyOf: r } : void 0;
};
function hVe(t, e) {
  if (
    ["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(
      t.innerType._def.typeName,
    ) &&
    (!t.innerType._def.checks || !t.innerType._def.checks.length)
  )
    return e.target === "openApi3"
      ? { type: MR[t.innerType._def.typeName], nullable: !0 }
      : { type: [MR[t.innerType._def.typeName], "null"] };
  if (e.target === "openApi3") {
    let n = Xe(t.innerType._def, { ...e, currentPath: [...e.currentPath] });
    return n && "$ref" in n ? { allOf: [n], nullable: !0 } : n && { ...n, nullable: !0 };
  }
  let r = Xe(t.innerType._def, { ...e, currentPath: [...e.currentPath, "anyOf", "0"] });
  return r && { anyOf: [r, { type: "null" }] };
}
function gVe(t, e) {
  let r = { type: "number" };
  if (!t.checks) return r;
  for (let n of t.checks)
    switch (n.kind) {
      case "int":
        ((r.type = "integer"), fX(r, "type", n.message, e));
        break;
      case "min":
        e.target === "jsonSchema7"
          ? n.inclusive
            ? Mt(r, "minimum", n.value, n.message, e)
            : Mt(r, "exclusiveMinimum", n.value, n.message, e)
          : (n.inclusive || (r.exclusiveMinimum = !0), Mt(r, "minimum", n.value, n.message, e));
        break;
      case "max":
        e.target === "jsonSchema7"
          ? n.inclusive
            ? Mt(r, "maximum", n.value, n.message, e)
            : Mt(r, "exclusiveMaximum", n.value, n.message, e)
          : (n.inclusive || (r.exclusiveMaximum = !0), Mt(r, "maximum", n.value, n.message, e));
        break;
      case "multipleOf":
        Mt(r, "multipleOf", n.value, n.message, e);
        break;
    }
  return r;
}
function yVe(t, e) {
  let r = e.target === "openAi",
    n = { type: "object", properties: {} },
    o = [],
    i = t.shape();
  for (let a in i) {
    let l = i[a];
    if (l === void 0 || l._def === void 0) continue;
    let c = kVt(l);
    c &&
      r &&
      (l._def.typeName === "ZodOptional" && (l = l._def.innerType),
      l.isNullable() || (l = l.nullable()),
      (c = !1));
    let u = Xe(l._def, {
      ...e,
      currentPath: [...e.currentPath, "properties", a],
      propertyPath: [...e.currentPath, "properties", a],
    });
    u !== void 0 && ((n.properties[a] = u), c || o.push(a));
  }
  o.length && (n.required = o);
  let s = IVt(t, e);
  return (s !== void 0 && (n.additionalProperties = s), n);
}
function IVt(t, e) {
  if (t.catchall._def.typeName !== "ZodNever")
    return Xe(t.catchall._def, { ...e, currentPath: [...e.currentPath, "additionalProperties"] });
  switch (t.unknownKeys) {
    case "passthrough":
      return e.allowedAdditionalProperties;
    case "strict":
      return e.rejectedAdditionalProperties;
    case "strip":
      return e.removeAdditionalStrategy === "strict"
        ? e.allowedAdditionalProperties
        : e.rejectedAdditionalProperties;
  }
}
function kVt(t) {
  try {
    return t.isOptional();
  } catch {
    return !0;
  }
}
var vVe = (t, e) => {
  if (e.currentPath.toString() === e.propertyPath?.toString()) return Xe(t.innerType._def, e);
  let r = Xe(t.innerType._def, { ...e, currentPath: [...e.currentPath, "anyOf", "1"] });
  return r ? { anyOf: [{ not: Ur(e) }, r] } : Ur(e);
};
var bVe = (t, e) => {
  if (e.pipeStrategy === "input") return Xe(t.in._def, e);
  if (e.pipeStrategy === "output") return Xe(t.out._def, e);
  let r = Xe(t.in._def, { ...e, currentPath: [...e.currentPath, "allOf", "0"] }),
    n = Xe(t.out._def, { ...e, currentPath: [...e.currentPath, "allOf", r ? "1" : "0"] });
  return { allOf: [r, n].filter((o) => o !== void 0) };
};
function SVe(t, e) {
  return Xe(t.type._def, e);
}
function wVe(t, e) {
  let n = {
    type: "array",
    uniqueItems: !0,
    items: Xe(t.valueType._def, { ...e, currentPath: [...e.currentPath, "items"] }),
  };
  return (
    t.minSize && Mt(n, "minItems", t.minSize.value, t.minSize.message, e),
    t.maxSize && Mt(n, "maxItems", t.maxSize.value, t.maxSize.message, e),
    n
  );
}
function _Ve(t, e) {
  return t.rest
    ? {
        type: "array",
        minItems: t.items.length,
        items: t.items
          .map((r, n) => Xe(r._def, { ...e, currentPath: [...e.currentPath, "items", `${n}`] }))
          .reduce((r, n) => (n === void 0 ? r : [...r, n]), []),
        additionalItems: Xe(t.rest._def, {
          ...e,
          currentPath: [...e.currentPath, "additionalItems"],
        }),
      }
    : {
        type: "array",
        minItems: t.items.length,
        maxItems: t.items.length,
        items: t.items
          .map((r, n) => Xe(r._def, { ...e, currentPath: [...e.currentPath, "items", `${n}`] }))
          .reduce((r, n) => (n === void 0 ? r : [...r, n]), []),
      };
}
function xVe(t) {
  return { not: Ur(t) };
}
function AVe(t) {
  return Ur(t);
}
var RVe = (t, e) => Xe(t.innerType._def, e);
var EVe = (t, e, r) => {
  switch (e) {
    case se.ZodString:
      return tB(t, r);
    case se.ZodNumber:
      return gVe(t, r);
    case se.ZodObject:
      return yVe(t, r);
    case se.ZodBigInt:
      return eVe(t, r);
    case se.ZodBoolean:
      return tVe();
    case se.ZodDate:
      return hX(t, r);
    case se.ZodUndefined:
      return xVe(r);
    case se.ZodNull:
      return pVe(r);
    case se.ZodArray:
      return Q4e(t, r);
    case se.ZodUnion:
    case se.ZodDiscriminatedUnion:
      return fVe(t, r);
    case se.ZodIntersection:
      return sVe(t, r);
    case se.ZodTuple:
      return _Ve(t, r);
    case se.ZodRecord:
      return rB(t, r);
    case se.ZodLiteral:
      return aVe(t, r);
    case se.ZodEnum:
      return iVe(t);
    case se.ZodNativeEnum:
      return uVe(t);
    case se.ZodNullable:
      return hVe(t, r);
    case se.ZodOptional:
      return vVe(t, r);
    case se.ZodMap:
      return cVe(t, r);
    case se.ZodSet:
      return wVe(t, r);
    case se.ZodLazy:
      return () => t.getter()._def;
    case se.ZodPromise:
      return SVe(t, r);
    case se.ZodNaN:
    case se.ZodNever:
      return dVe(r);
    case se.ZodEffects:
      return oVe(t, r);
    case se.ZodAny:
      return Ur(r);
    case se.ZodUnknown:
      return AVe(r);
    case se.ZodDefault:
      return nVe(t, r);
    case se.ZodBranded:
      return eB(t, r);
    case se.ZodReadonly:
      return RVe(t, r);
    case se.ZodCatch:
      return rVe(t, r);
    case se.ZodPipeline:
      return bVe(t, r);
    case se.ZodFunction:
    case se.ZodVoid:
    case se.ZodSymbol:
      return;
    default:
      return ((n) => {})(e);
  }
};
function Xe(t, e, r = !1) {
  let n = e.seen.get(t);
  if (e.override) {
    let a = e.override?.(t, e, n, r);
    if (a !== X4e) return a;
  }
  if (n && !r) {
    let a = DVt(n, e);
    if (a !== void 0) return a;
  }
  let o = { def: t, path: e.currentPath, jsonSchema: void 0 };
  e.seen.set(t, o);
  let i = EVe(t, t.typeName, e),
    s = typeof i == "function" ? Xe(i(), e) : i;
  if ((s && MVt(t, e, s), e.postProcess)) {
    let a = e.postProcess(s, t, e);
    return ((o.jsonSchema = s), a);
  }
  return ((o.jsonSchema = s), s);
}
var DVt = (t, e) => {
    switch (e.$refStrategy) {
      case "root":
        return { $ref: t.path.join("/") };
      case "relative":
        return { $ref: Q2(e.currentPath, t.path) };
      case "none":
      case "seen":
        return t.path.length < e.currentPath.length &&
          t.path.every((r, n) => e.currentPath[n] === r)
          ? (console.warn(
              `Recursive reference detected at ${e.currentPath.join("/")}! Defaulting to any`,
            ),
            Ur(e))
          : e.$refStrategy === "seen"
            ? Ur(e)
            : void 0;
    }
  },
  MVt = (t, e, r) => (
    t.description &&
      ((r.description = t.description),
      e.markdownDescription && (r.markdownDescription = t.description)),
    r
  );
var vX = (t, e) => {
  let r = J4e(e),
    n =
      typeof e == "object" && e.definitions
        ? Object.entries(e.definitions).reduce(
            (l, [c, u]) => ({
              ...l,
              [c]:
                Xe(u._def, { ...r, currentPath: [...r.basePath, r.definitionPath, c] }, !0) ??
                Ur(r),
            }),
            {},
          )
        : void 0,
    o = typeof e == "string" ? e : e?.nameStrategy === "title" ? void 0 : e?.name,
    i =
      Xe(
        t._def,
        o === void 0 ? r : { ...r, currentPath: [...r.basePath, r.definitionPath, o] },
        !1,
      ) ?? Ur(r),
    s = typeof e == "object" && e.name !== void 0 && e.nameStrategy === "title" ? e.name : void 0;
  (s !== void 0 && (i.title = s),
    r.flags.hasReferencedOpenAiAnyType &&
      (n || (n = {}),
      n[r.openAiAnyTypeName] ||
        (n[r.openAiAnyTypeName] = {
          type: ["string", "number", "integer", "boolean", "array", "null"],
          items: {
            $ref:
              r.$refStrategy === "relative"
                ? "1"
                : [...r.basePath, r.definitionPath, r.openAiAnyTypeName].join("/"),
          },
        })));
  let a =
    o === void 0
      ? n
        ? { ...i, [r.definitionPath]: n }
        : i
      : {
          $ref: [...(r.$refStrategy === "relative" ? [] : r.basePath), r.definitionPath, o].join(
            "/",
          ),
          [r.definitionPath]: { ...n, [o]: i },
        };
  return (
    r.target === "jsonSchema7"
      ? (a.$schema = "http://json-schema.org/draft-07/schema#")
      : (r.target === "jsonSchema2019-09" || r.target === "openAi") &&
        (a.$schema = "https://json-schema.org/draft/2019-09/schema#"),
    r.target === "openAi" &&
      ("anyOf" in a || "oneOf" in a || "allOf" in a || ("type" in a && Array.isArray(a.type))) &&
      console.warn(
        "Warning: OpenAI may not support schemas with unions as roots! Try wrapping it in an object property.",
      ),
    a
  );
};
function OVt(t) {
  return !t || t === "jsonSchema7" || t === "draft-7"
    ? "draft-7"
    : t === "jsonSchema2019-09" || t === "draft-2020-12"
      ? "draft-2020-12"
      : "draft-7";
}
function bX(t, e) {
  return bs(t)
    ? pp(t, { target: OVt(e?.target), io: e?.pipeStrategy ?? "input" })
    : vX(t, { strictUnions: e?.strictUnions ?? !0, pipeStrategy: e?.pipeStrategy ?? "input" });
}
function SX(t) {
  let r = Md(t)?.method;
  if (!r) throw new Error("Schema is missing a method literal");
  let n = J2(r);
  if (typeof n != "string") throw new Error("Schema method literal must be a string");
  return n;
}
function wX(t, e) {
  let r = Dd(t, e);
  if (!r.success) throw r.error;
  return r.data;
}
var NVt = 6e4,
  nB = class {
    constructor(e) {
      ((this._options = e),
        (this._requestMessageId = 0),
        (this._requestHandlers = new Map()),
        (this._requestHandlerAbortControllers = new Map()),
        (this._notificationHandlers = new Map()),
        (this._responseHandlers = new Map()),
        (this._progressHandlers = new Map()),
        (this._timeoutInfo = new Map()),
        (this._pendingDebouncedNotifications = new Set()),
        (this._taskProgressTokens = new Map()),
        (this._requestResolvers = new Map()),
        this.setNotificationHandler(ok, (r) => {
          this._oncancel(r);
        }),
        this.setNotificationHandler(sk, (r) => {
          this._onprogress(r);
        }),
        this.setRequestHandler(ik, (r) => ({})),
        (this._taskStore = e?.taskStore),
        (this._taskMessageQueue = e?.taskMessageQueue),
        this._taskStore &&
          (this.setRequestHandler(ak, async (r, n) => {
            let o = await this._taskStore.getTask(r.params.taskId, n.sessionId);
            if (!o) throw new Oe($e.InvalidParams, "Failed to retrieve task: Task not found");
            return { ...o };
          }),
          this.setRequestHandler(ck, async (r, n) => {
            let o = async () => {
              let i = r.params.taskId;
              if (this._taskMessageQueue) {
                let a;
                for (; (a = await this._taskMessageQueue.dequeue(i, n.sessionId)); ) {
                  if (a.type === "response" || a.type === "error") {
                    let l = a.message,
                      c = l.id,
                      u = this._requestResolvers.get(c);
                    if (u)
                      if ((this._requestResolvers.delete(c), a.type === "response")) u(l);
                      else {
                        let p = l,
                          m = new Oe(p.error.code, p.error.message, p.error.data);
                        u(m);
                      }
                    else {
                      let p = a.type === "response" ? "Response" : "Error";
                      this._onerror(new Error(`${p} handler missing for request ${c}`));
                    }
                    continue;
                  }
                  await this._transport?.send(a.message, { relatedRequestId: n.requestId });
                }
              }
              let s = await this._taskStore.getTask(i, n.sessionId);
              if (!s) throw new Oe($e.InvalidParams, `Task not found: ${i}`);
              if (!Od(s.status)) return (await this._waitForTaskUpdate(i, n.signal), await o());
              if (Od(s.status)) {
                let a = await this._taskStore.getTaskResult(i, n.sessionId);
                return (
                  this._clearTaskQueue(i),
                  { ...a, _meta: { ...a._meta, [vu]: { taskId: i } } }
                );
              }
              return await o();
            };
            return await o();
          }),
          this.setRequestHandler(uk, async (r, n) => {
            try {
              let { tasks: o, nextCursor: i } = await this._taskStore.listTasks(
                r.params?.cursor,
                n.sessionId,
              );
              return { tasks: o, nextCursor: i, _meta: {} };
            } catch (o) {
              throw new Oe(
                $e.InvalidParams,
                `Failed to list tasks: ${o instanceof Error ? o.message : String(o)}`,
              );
            }
          }),
          this.setRequestHandler(pk, async (r, n) => {
            try {
              let o = await this._taskStore.getTask(r.params.taskId, n.sessionId);
              if (!o) throw new Oe($e.InvalidParams, `Task not found: ${r.params.taskId}`);
              if (Od(o.status))
                throw new Oe(
                  $e.InvalidParams,
                  `Cannot cancel task in terminal status: ${o.status}`,
                );
              (await this._taskStore.updateTaskStatus(
                r.params.taskId,
                "cancelled",
                "Client cancelled task execution.",
                n.sessionId,
              ),
                this._clearTaskQueue(r.params.taskId));
              let i = await this._taskStore.getTask(r.params.taskId, n.sessionId);
              if (!i)
                throw new Oe(
                  $e.InvalidParams,
                  `Task not found after cancellation: ${r.params.taskId}`,
                );
              return { _meta: {}, ...i };
            } catch (o) {
              throw o instanceof Oe
                ? o
                : new Oe(
                    $e.InvalidRequest,
                    `Failed to cancel task: ${o instanceof Error ? o.message : String(o)}`,
                  );
            }
          })));
    }
    async _oncancel(e) {
      if (!e.params.requestId) return;
      this._requestHandlerAbortControllers.get(e.params.requestId)?.abort(e.params.reason);
    }
    _setupTimeout(e, r, n, o, i = !1) {
      this._timeoutInfo.set(e, {
        timeoutId: setTimeout(o, r),
        startTime: Date.now(),
        timeout: r,
        maxTotalTimeout: n,
        resetTimeoutOnProgress: i,
        onTimeout: o,
      });
    }
    _resetTimeout(e) {
      let r = this._timeoutInfo.get(e);
      if (!r) return !1;
      let n = Date.now() - r.startTime;
      if (r.maxTotalTimeout && n >= r.maxTotalTimeout)
        throw (
          this._timeoutInfo.delete(e),
          Oe.fromError($e.RequestTimeout, "Maximum total timeout exceeded", {
            maxTotalTimeout: r.maxTotalTimeout,
            totalElapsed: n,
          })
        );
      return (clearTimeout(r.timeoutId), (r.timeoutId = setTimeout(r.onTimeout, r.timeout)), !0);
    }
    _cleanupTimeout(e) {
      let r = this._timeoutInfo.get(e);
      r && (clearTimeout(r.timeoutId), this._timeoutInfo.delete(e));
    }
    async connect(e) {
      if (this._transport)
        throw new Error(
          "Already connected to a transport. Call close() before connecting to a new transport, or use a separate Protocol instance per connection.",
        );
      this._transport = e;
      let r = this.transport?.onclose;
      this._transport.onclose = () => {
        (r?.(), this._onclose());
      };
      let n = this.transport?.onerror;
      this._transport.onerror = (i) => {
        (n?.(i), this._onerror(i));
      };
      let o = this._transport?.onmessage;
      ((this._transport.onmessage = (i, s) => {
        (o?.(i, s),
          Nw(i) || she(i)
            ? this._onresponse(i)
            : TW(i)
              ? this._onrequest(i, s)
              : ihe(i)
                ? this._onnotification(i)
                : this._onerror(new Error(`Unknown message type: ${JSON.stringify(i)}`)));
      }),
        await this._transport.start());
    }
    _onclose() {
      let e = this._responseHandlers;
      ((this._responseHandlers = new Map()),
        this._progressHandlers.clear(),
        this._taskProgressTokens.clear(),
        this._pendingDebouncedNotifications.clear());
      for (let n of this._timeoutInfo.values()) clearTimeout(n.timeoutId);
      this._timeoutInfo.clear();
      for (let n of this._requestHandlerAbortControllers.values()) n.abort();
      this._requestHandlerAbortControllers.clear();
      let r = Oe.fromError($e.ConnectionClosed, "Connection closed");
      ((this._transport = void 0), this.onclose?.());
      for (let n of e.values()) n(r);
    }
    _onerror(e) {
      this.onerror?.(e);
    }
    _onnotification(e) {
      let r = this._notificationHandlers.get(e.method) ?? this.fallbackNotificationHandler;
      r !== void 0 &&
        Promise.resolve()
          .then(() => r(e))
          .catch((n) => this._onerror(new Error(`Uncaught error in notification handler: ${n}`)));
    }
    _onrequest(e, r) {
      let n = this._requestHandlers.get(e.method) ?? this.fallbackRequestHandler,
        o = this._transport,
        i = e.params?._meta?.[vu]?.taskId;
      if (n === void 0) {
        let u = {
          jsonrpc: "2.0",
          id: e.id,
          error: { code: $e.MethodNotFound, message: "Method not found" },
        };
        i && this._taskMessageQueue
          ? this._enqueueTaskMessage(
              i,
              { type: "error", message: u, timestamp: Date.now() },
              o?.sessionId,
            ).catch((p) => this._onerror(new Error(`Failed to enqueue error response: ${p}`)))
          : o
              ?.send(u)
              .catch((p) => this._onerror(new Error(`Failed to send an error response: ${p}`)));
        return;
      }
      let s = new AbortController();
      this._requestHandlerAbortControllers.set(e.id, s);
      let a = rhe(e.params) ? e.params.task : void 0,
        l = this._taskStore ? this.requestTaskStore(e, o?.sessionId) : void 0,
        c = {
          signal: s.signal,
          sessionId: o?.sessionId,
          _meta: e.params?._meta,
          sendNotification: async (u) => {
            if (s.signal.aborted) return;
            let p = { relatedRequestId: e.id };
            (i && (p.relatedTask = { taskId: i }), await this.notification(u, p));
          },
          sendRequest: async (u, p, m) => {
            if (s.signal.aborted) throw new Oe($e.ConnectionClosed, "Request was cancelled");
            let f = { ...m, relatedRequestId: e.id };
            i && !f.relatedTask && (f.relatedTask = { taskId: i });
            let h = f.relatedTask?.taskId ?? i;
            return (
              h && l && (await l.updateTaskStatus(h, "input_required")),
              await this.request(u, p, f)
            );
          },
          authInfo: r?.authInfo,
          requestId: e.id,
          requestInfo: r?.requestInfo,
          taskId: i,
          taskStore: l,
          taskRequestedTtl: a?.ttl,
          closeSSEStream: r?.closeSSEStream,
          closeStandaloneSSEStream: r?.closeStandaloneSSEStream,
        };
      Promise.resolve()
        .then(() => {
          a && this.assertTaskHandlerCapability(e.method);
        })
        .then(() => n(e, c))
        .then(
          async (u) => {
            if (s.signal.aborted) return;
            let p = { result: u, jsonrpc: "2.0", id: e.id };
            i && this._taskMessageQueue
              ? await this._enqueueTaskMessage(
                  i,
                  { type: "response", message: p, timestamp: Date.now() },
                  o?.sessionId,
                )
              : await o?.send(p);
          },
          async (u) => {
            if (s.signal.aborted) return;
            let p = {
              jsonrpc: "2.0",
              id: e.id,
              error: {
                code: Number.isSafeInteger(u.code) ? u.code : $e.InternalError,
                message: u.message ?? "Internal error",
                ...(u.data !== void 0 && { data: u.data }),
              },
            };
            i && this._taskMessageQueue
              ? await this._enqueueTaskMessage(
                  i,
                  { type: "error", message: p, timestamp: Date.now() },
                  o?.sessionId,
                )
              : await o?.send(p);
          },
        )
        .catch((u) => this._onerror(new Error(`Failed to send response: ${u}`)))
        .finally(() => {
          this._requestHandlerAbortControllers.get(e.id) === s &&
            this._requestHandlerAbortControllers.delete(e.id);
        });
    }
    _onprogress(e) {
      let { progressToken: r, ...n } = e.params,
        o = Number(r),
        i = this._progressHandlers.get(o);
      if (!i) {
        this._onerror(
          new Error(`Received a progress notification for an unknown token: ${JSON.stringify(e)}`),
        );
        return;
      }
      let s = this._responseHandlers.get(o),
        a = this._timeoutInfo.get(o);
      if (a && s && a.resetTimeoutOnProgress)
        try {
          this._resetTimeout(o);
        } catch (l) {
          (this._responseHandlers.delete(o),
            this._progressHandlers.delete(o),
            this._cleanupTimeout(o),
            s(l));
          return;
        }
      i(n);
    }
    _onresponse(e) {
      let r = Number(e.id),
        n = this._requestResolvers.get(r);
      if (n) {
        if ((this._requestResolvers.delete(r), Nw(e))) n(e);
        else {
          let s = new Oe(e.error.code, e.error.message, e.error.data);
          n(s);
        }
        return;
      }
      let o = this._responseHandlers.get(r);
      if (o === void 0) {
        this._onerror(
          new Error(`Received a response for an unknown message ID: ${JSON.stringify(e)}`),
        );
        return;
      }
      (this._responseHandlers.delete(r), this._cleanupTimeout(r));
      let i = !1;
      if (Nw(e) && e.result && typeof e.result == "object") {
        let s = e.result;
        if (s.task && typeof s.task == "object") {
          let a = s.task;
          typeof a.taskId == "string" && ((i = !0), this._taskProgressTokens.set(a.taskId, r));
        }
      }
      if ((i || this._progressHandlers.delete(r), Nw(e))) o(e);
      else {
        let s = Oe.fromError(e.error.code, e.error.message, e.error.data);
        o(s);
      }
    }
    get transport() {
      return this._transport;
    }
    async close() {
      await this._transport?.close();
    }
    async *requestStream(e, r, n) {
      let { task: o } = n ?? {};
      if (!o) {
        try {
          yield { type: "result", result: await this.request(e, r, n) };
        } catch (s) {
          yield { type: "error", error: s instanceof Oe ? s : new Oe($e.InternalError, String(s)) };
        }
        return;
      }
      let i;
      try {
        let s = await this.request(e, Ag, n);
        if (s.task) ((i = s.task.taskId), yield { type: "taskCreated", task: s.task });
        else throw new Oe($e.InternalError, "Task creation did not return a task");
        for (;;) {
          let a = await this.getTask({ taskId: i }, n);
          if ((yield { type: "taskStatus", task: a }, Od(a.status))) {
            a.status === "completed"
              ? yield { type: "result", result: await this.getTaskResult({ taskId: i }, r, n) }
              : a.status === "failed"
                ? yield { type: "error", error: new Oe($e.InternalError, `Task ${i} failed`) }
                : a.status === "cancelled" &&
                  (yield {
                    type: "error",
                    error: new Oe($e.InternalError, `Task ${i} was cancelled`),
                  });
            return;
          }
          if (a.status === "input_required") {
            yield { type: "result", result: await this.getTaskResult({ taskId: i }, r, n) };
            return;
          }
          let l = a.pollInterval ?? this._options?.defaultTaskPollInterval ?? 1e3;
          (await new Promise((c) => setTimeout(c, l)), n?.signal?.throwIfAborted());
        }
      } catch (s) {
        yield { type: "error", error: s instanceof Oe ? s : new Oe($e.InternalError, String(s)) };
      }
    }
    request(e, r, n) {
      let {
        relatedRequestId: o,
        resumptionToken: i,
        onresumptiontoken: s,
        task: a,
        relatedTask: l,
      } = n ?? {};
      return new Promise((c, u) => {
        let p = (_) => {
          u(_);
        };
        if (!this._transport) {
          p(new Error("Not connected"));
          return;
        }
        if (this._options?.enforceStrictCapabilities === !0)
          try {
            (this.assertCapabilityForMethod(e.method), a && this.assertTaskCapability(e.method));
          } catch (_) {
            p(_);
            return;
          }
        n?.signal?.throwIfAborted();
        let m = this._requestMessageId++,
          f = { ...e, jsonrpc: "2.0", id: m };
        (n?.onprogress &&
          (this._progressHandlers.set(m, n.onprogress),
          (f.params = { ...e.params, _meta: { ...(e.params?._meta || {}), progressToken: m } })),
          a && (f.params = { ...f.params, task: a }),
          l && (f.params = { ...f.params, _meta: { ...(f.params?._meta || {}), [vu]: l } }));
        let h = (_) => {
          (this._responseHandlers.delete(m),
            this._progressHandlers.delete(m),
            this._cleanupTimeout(m),
            this._transport
              ?.send(
                {
                  jsonrpc: "2.0",
                  method: "notifications/cancelled",
                  params: { requestId: m, reason: String(_) },
                },
                { relatedRequestId: o, resumptionToken: i, onresumptiontoken: s },
              )
              .catch((E) => this._onerror(new Error(`Failed to send cancellation: ${E}`))));
          let S = _ instanceof Oe ? _ : new Oe($e.RequestTimeout, String(_));
          u(S);
        };
        (this._responseHandlers.set(m, (_) => {
          if (!n?.signal?.aborted) {
            if (_ instanceof Error) return u(_);
            try {
              let S = Dd(r, _.result);
              S.success ? c(S.data) : u(S.error);
            } catch (S) {
              u(S);
            }
          }
        }),
          n?.signal?.addEventListener("abort", () => {
            h(n?.signal?.reason);
          }));
        let v = n?.timeout ?? NVt,
          y = () => h(Oe.fromError($e.RequestTimeout, "Request timed out", { timeout: v }));
        this._setupTimeout(m, v, n?.maxTotalTimeout, y, n?.resetTimeoutOnProgress ?? !1);
        let w = l?.taskId;
        if (w) {
          let _ = (S) => {
            let E = this._responseHandlers.get(m);
            E
              ? E(S)
              : this._onerror(
                  new Error(`Response handler missing for side-channeled request ${m}`),
                );
          };
          (this._requestResolvers.set(m, _),
            this._enqueueTaskMessage(w, {
              type: "request",
              message: f,
              timestamp: Date.now(),
            }).catch((S) => {
              (this._cleanupTimeout(m), u(S));
            }));
        } else
          this._transport
            .send(f, { relatedRequestId: o, resumptionToken: i, onresumptiontoken: s })
            .catch((_) => {
              (this._cleanupTimeout(m), u(_));
            });
      });
    }
    async getTask(e, r) {
      return this.request({ method: "tasks/get", params: e }, lk, r);
    }
    async getTaskResult(e, r, n) {
      return this.request({ method: "tasks/result", params: e }, r, n);
    }
    async listTasks(e, r) {
      return this.request({ method: "tasks/list", params: e }, dk, r);
    }
    async cancelTask(e, r) {
      return this.request({ method: "tasks/cancel", params: e }, che, r);
    }
    async notification(e, r) {
      if (!this._transport) throw new Error("Not connected");
      this.assertNotificationCapability(e.method);
      let n = r?.relatedTask?.taskId;
      if (n) {
        let a = {
          ...e,
          jsonrpc: "2.0",
          params: { ...e.params, _meta: { ...(e.params?._meta || {}), [vu]: r.relatedTask } },
        };
        await this._enqueueTaskMessage(n, {
          type: "notification",
          message: a,
          timestamp: Date.now(),
        });
        return;
      }
      if (
        (this._options?.debouncedNotificationMethods ?? []).includes(e.method) &&
        !e.params &&
        !r?.relatedRequestId &&
        !r?.relatedTask
      ) {
        if (this._pendingDebouncedNotifications.has(e.method)) return;
        (this._pendingDebouncedNotifications.add(e.method),
          Promise.resolve().then(() => {
            if ((this._pendingDebouncedNotifications.delete(e.method), !this._transport)) return;
            let a = { ...e, jsonrpc: "2.0" };
            (r?.relatedTask &&
              (a = {
                ...a,
                params: { ...a.params, _meta: { ...(a.params?._meta || {}), [vu]: r.relatedTask } },
              }),
              this._transport?.send(a, r).catch((l) => this._onerror(l)));
          }));
        return;
      }
      let s = { ...e, jsonrpc: "2.0" };
      (r?.relatedTask &&
        (s = {
          ...s,
          params: { ...s.params, _meta: { ...(s.params?._meta || {}), [vu]: r.relatedTask } },
        }),
        await this._transport.send(s, r));
    }
    setRequestHandler(e, r) {
      let n = SX(e);
      (this.assertRequestHandlerCapability(n),
        this._requestHandlers.set(n, (o, i) => {
          let s = wX(e, o);
          return Promise.resolve(r(s, i));
        }));
    }
    removeRequestHandler(e) {
      this._requestHandlers.delete(e);
    }
    assertCanSetRequestHandler(e) {
      if (this._requestHandlers.has(e))
        throw new Error(`A request handler for ${e} already exists, which would be overridden`);
    }
    setNotificationHandler(e, r) {
      let n = SX(e);
      this._notificationHandlers.set(n, (o) => {
        let i = wX(e, o);
        return Promise.resolve(r(i));
      });
    }
    removeNotificationHandler(e) {
      this._notificationHandlers.delete(e);
    }
    _cleanupTaskProgressHandler(e) {
      let r = this._taskProgressTokens.get(e);
      r !== void 0 && (this._progressHandlers.delete(r), this._taskProgressTokens.delete(e));
    }
    async _enqueueTaskMessage(e, r, n) {
      if (!this._taskStore || !this._taskMessageQueue)
        throw new Error(
          "Cannot enqueue task message: taskStore and taskMessageQueue are not configured",
        );
      let o = this._options?.maxTaskQueueSize;
      await this._taskMessageQueue.enqueue(e, r, n, o);
    }
    async _clearTaskQueue(e, r) {
      if (this._taskMessageQueue) {
        let n = await this._taskMessageQueue.dequeueAll(e, r);
        for (let o of n)
          if (o.type === "request" && TW(o.message)) {
            let i = o.message.id,
              s = this._requestResolvers.get(i);
            s
              ? (s(new Oe($e.InternalError, "Task cancelled or completed")),
                this._requestResolvers.delete(i))
              : this._onerror(
                  new Error(`Resolver missing for request ${i} during task ${e} cleanup`),
                );
          }
      }
    }
    async _waitForTaskUpdate(e, r) {
      let n = this._options?.defaultTaskPollInterval ?? 1e3;
      try {
        let o = await this._taskStore?.getTask(e);
        o?.pollInterval && (n = o.pollInterval);
      } catch {}
      return new Promise((o, i) => {
        if (r.aborted) {
          i(new Oe($e.InvalidRequest, "Request cancelled"));
          return;
        }
        let s = setTimeout(o, n);
        r.addEventListener(
          "abort",
          () => {
            (clearTimeout(s), i(new Oe($e.InvalidRequest, "Request cancelled")));
          },
          { once: !0 },
        );
      });
    }
    requestTaskStore(e, r) {
      let n = this._taskStore;
      if (!n) throw new Error("No task store configured");
      return {
        createTask: async (o) => {
          if (!e) throw new Error("No request provided");
          return await n.createTask(o, e.id, { method: e.method, params: e.params }, r);
        },
        getTask: async (o) => {
          let i = await n.getTask(o, r);
          if (!i) throw new Oe($e.InvalidParams, "Failed to retrieve task: Task not found");
          return i;
        },
        storeTaskResult: async (o, i, s) => {
          await n.storeTaskResult(o, i, s, r);
          let a = await n.getTask(o, r);
          if (a) {
            let l = Uw.parse({ method: "notifications/tasks/status", params: a });
            (await this.notification(l), Od(a.status) && this._cleanupTaskProgressHandler(o));
          }
        },
        getTaskResult: (o) => n.getTaskResult(o, r),
        updateTaskStatus: async (o, i, s) => {
          let a = await n.getTask(o, r);
          if (!a)
            throw new Oe($e.InvalidParams, `Task "${o}" not found - it may have been cleaned up`);
          if (Od(a.status))
            throw new Oe(
              $e.InvalidParams,
              `Cannot update task "${o}" from terminal status "${a.status}" to "${i}". Terminal states (completed, failed, cancelled) cannot transition to other states.`,
            );
          await n.updateTaskStatus(o, i, s, r);
          let l = await n.getTask(o, r);
          if (l) {
            let c = Uw.parse({ method: "notifications/tasks/status", params: l });
            (await this.notification(c), Od(l.status) && this._cleanupTaskProgressHandler(o));
          }
        },
        listTasks: (o) => n.listTasks(o, r),
      };
    }
  };
