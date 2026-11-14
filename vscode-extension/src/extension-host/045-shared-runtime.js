var Ft = A((Rt) => {
  "use strict";
  Object.defineProperty(Rt, "__esModule", { value: !0 });
  Rt.checkStrictMode =
    Rt.getErrorPath =
    Rt.Type =
    Rt.useFunc =
    Rt.setEvaluated =
    Rt.evaluatedPropsToName =
    Rt.mergeEvaluated =
    Rt.eachItem =
    Rt.unescapeJsonPointer =
    Rt.escapeJsonPointer =
    Rt.escapeFragment =
    Rt.unescapeFragment =
    Rt.schemaRefOrVal =
    Rt.schemaHasRulesButRef =
    Rt.schemaHasRules =
    Rt.checkUnknownRules =
    Rt.alwaysValidSchema =
    Rt.toHash =
      void 0;
  var mr = gt(),
    XVt = LR();
  function YVt(t) {
    let e = {};
    for (let r of t) e[r] = !0;
    return e;
  }
  Rt.toHash = YVt;
  function JVt(t, e) {
    return typeof e == "boolean"
      ? e
      : Object.keys(e).length === 0
        ? !0
        : (NVe(t, e), !LVe(e, t.self.RULES.all));
  }
  Rt.alwaysValidSchema = JVt;
  function NVe(t, e = t.schema) {
    let { opts: r, self: n } = t;
    if (!r.strictSchema || typeof e == "boolean") return;
    let o = n.RULES.keywords;
    for (let i in e) o[i] || $Ve(t, `unknown keyword: "${i}"`);
  }
  Rt.checkUnknownRules = NVe;
  function LVe(t, e) {
    if (typeof t == "boolean") return !t;
    for (let r in t) if (e[r]) return !0;
    return !1;
  }
  Rt.schemaHasRules = LVe;
  function QVt(t, e) {
    if (typeof t == "boolean") return !t;
    for (let r in t) if (r !== "$ref" && e.all[r]) return !0;
    return !1;
  }
  Rt.schemaHasRulesButRef = QVt;
  function e6t({ topSchemaRef: t, schemaPath: e }, r, n, o) {
    if (!o) {
      if (typeof r == "number" || typeof r == "boolean") return r;
      if (typeof r == "string") return (0, mr._)`${r}`;
    }
    return (0, mr._)`${t}${e}${(0, mr.getProperty)(n)}`;
  }
  Rt.schemaRefOrVal = e6t;
  function t6t(t) {
    return BVe(decodeURIComponent(t));
  }
  Rt.unescapeFragment = t6t;
  function r6t(t) {
    return encodeURIComponent(UX(t));
  }
  Rt.escapeFragment = r6t;
  function UX(t) {
    return typeof t == "number" ? `${t}` : t.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  Rt.escapeJsonPointer = UX;
  function BVe(t) {
    return t.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  Rt.unescapeJsonPointer = BVe;
  function n6t(t, e) {
    if (Array.isArray(t)) for (let r of t) e(r);
    else e(t);
  }
  Rt.eachItem = n6t;
  function MVe({ mergeNames: t, mergeToName: e, mergeValues: r, resultToName: n }) {
    return (o, i, s, a) => {
      let l =
        s === void 0
          ? i
          : s instanceof mr.Name
            ? (i instanceof mr.Name ? t(o, i, s) : e(o, i, s), s)
            : i instanceof mr.Name
              ? (e(o, s, i), i)
              : r(i, s);
      return a === mr.Name && !(l instanceof mr.Name) ? n(o, l) : l;
    };
  }
  Rt.mergeEvaluated = {
    props: MVe({
      mergeNames: (t, e, r) =>
        t.if((0, mr._)`${r} !== true && ${e} !== undefined`, () => {
          t.if(
            (0, mr._)`${e} === true`,
            () => t.assign(r, !0),
            () => t.assign(r, (0, mr._)`${r} || {}`).code((0, mr._)`Object.assign(${r}, ${e})`),
          );
        }),
      mergeToName: (t, e, r) =>
        t.if((0, mr._)`${r} !== true`, () => {
          e === !0 ? t.assign(r, !0) : (t.assign(r, (0, mr._)`${r} || {}`), qX(t, r, e));
        }),
      mergeValues: (t, e) => (t === !0 ? !0 : { ...t, ...e }),
      resultToName: FVe,
    }),
    items: MVe({
      mergeNames: (t, e, r) =>
        t.if((0, mr._)`${r} !== true && ${e} !== undefined`, () =>
          t.assign(r, (0, mr._)`${e} === true ? true : ${r} > ${e} ? ${r} : ${e}`),
        ),
      mergeToName: (t, e, r) =>
        t.if((0, mr._)`${r} !== true`, () =>
          t.assign(r, e === !0 ? !0 : (0, mr._)`${r} > ${e} ? ${r} : ${e}`),
        ),
      mergeValues: (t, e) => (t === !0 ? !0 : Math.max(t, e)),
      resultToName: (t, e) => t.var("items", e),
    }),
  };
  function FVe(t, e) {
    if (e === !0) return t.var("props", !0);
    let r = t.var("props", (0, mr._)`{}`);
    return (e !== void 0 && qX(t, r, e), r);
  }
  Rt.evaluatedPropsToName = FVe;
  function qX(t, e, r) {
    Object.keys(r).forEach((n) => t.assign((0, mr._)`${e}${(0, mr.getProperty)(n)}`, !0));
  }
  Rt.setEvaluated = qX;
  var OVe = {};
  function o6t(t, e) {
    return t.scopeValue("func", {
      ref: e,
      code: OVe[e.code] || (OVe[e.code] = new XVt._Code(e.code)),
    });
  }
  Rt.useFunc = o6t;
  var $X;
  (function (t) {
    ((t[(t.Num = 0)] = "Num"), (t[(t.Str = 1)] = "Str"));
  })($X || (Rt.Type = $X = {}));
  function i6t(t, e, r) {
    if (t instanceof mr.Name) {
      let n = e === $X.Num;
      return r
        ? n
          ? (0, mr._)`"[" + ${t} + "]"`
          : (0, mr._)`"['" + ${t} + "']"`
        : n
          ? (0, mr._)`"/" + ${t}`
          : (0, mr._)`"/" + ${t}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return r ? (0, mr.getProperty)(t).toString() : "/" + UX(t);
  }
  Rt.getErrorPath = i6t;
  function $Ve(t, e, r = t.opts.strictSchema) {
    if (r) {
      if (((e = `strict mode: ${e}`), r === !0)) throw new Error(e);
      t.self.logger.warn(e);
    }
  }
  Rt.checkStrictMode = $Ve;
});
var $c = A((GX) => {
  "use strict";
  Object.defineProperty(GX, "__esModule", { value: !0 });
  var Ro = gt(),
    s6t = {
      data: new Ro.Name("data"),
      valCxt: new Ro.Name("valCxt"),
      instancePath: new Ro.Name("instancePath"),
      parentData: new Ro.Name("parentData"),
      parentDataProperty: new Ro.Name("parentDataProperty"),
      rootData: new Ro.Name("rootData"),
      dynamicAnchors: new Ro.Name("dynamicAnchors"),
      vErrors: new Ro.Name("vErrors"),
      errors: new Ro.Name("errors"),
      this: new Ro.Name("this"),
      self: new Ro.Name("self"),
      scope: new Ro.Name("scope"),
      json: new Ro.Name("json"),
      jsonPos: new Ro.Name("jsonPos"),
      jsonLen: new Ro.Name("jsonLen"),
      jsonPart: new Ro.Name("jsonPart"),
    };
  GX.default = s6t;
});
var GR = A((Eo) => {
  "use strict";
  Object.defineProperty(Eo, "__esModule", { value: !0 });
  Eo.extendErrors =
    Eo.resetErrorsCount =
    Eo.reportExtraError =
    Eo.reportError =
    Eo.keyword$DataError =
    Eo.keywordError =
      void 0;
  var $t = gt(),
    dB = Ft(),
    zo = $c();
  Eo.keywordError = {
    message: ({ keyword: t }) => (0, $t.str)`must pass "${t}" keyword validation`,
  };
  Eo.keyword$DataError = {
    message: ({ keyword: t, schemaType: e }) =>
      e
        ? (0, $t.str)`"${t}" keyword must be ${e} ($data)`
        : (0, $t.str)`"${t}" keyword is invalid ($data)`,
  };
  function a6t(t, e = Eo.keywordError, r, n) {
    let { it: o } = t,
      { gen: i, compositeRule: s, allErrors: a } = o,
      l = GVe(t, e, r);
    (n ?? (s || a)) ? UVe(i, l) : qVe(o, (0, $t._)`[${l}]`);
  }
  Eo.reportError = a6t;
  function l6t(t, e = Eo.keywordError, r) {
    let { it: n } = t,
      { gen: o, compositeRule: i, allErrors: s } = n,
      a = GVe(t, e, r);
    (UVe(o, a), i || s || qVe(n, zo.default.vErrors));
  }
  Eo.reportExtraError = l6t;
  function c6t(t, e) {
    (t.assign(zo.default.errors, e),
      t.if((0, $t._)`${zo.default.vErrors} !== null`, () =>
        t.if(
          e,
          () => t.assign((0, $t._)`${zo.default.vErrors}.length`, e),
          () => t.assign(zo.default.vErrors, null),
        ),
      ));
  }
  Eo.resetErrorsCount = c6t;
  function u6t({ gen: t, keyword: e, schemaValue: r, data: n, errsCount: o, it: i }) {
    if (o === void 0) throw new Error("ajv implementation error");
    let s = t.name("err");
    t.forRange("i", o, zo.default.errors, (a) => {
      (t.const(s, (0, $t._)`${zo.default.vErrors}[${a}]`),
        t.if((0, $t._)`${s}.instancePath === undefined`, () =>
          t.assign(
            (0, $t._)`${s}.instancePath`,
            (0, $t.strConcat)(zo.default.instancePath, i.errorPath),
          ),
        ),
        t.assign((0, $t._)`${s}.schemaPath`, (0, $t.str)`${i.errSchemaPath}/${e}`),
        i.opts.verbose && (t.assign((0, $t._)`${s}.schema`, r), t.assign((0, $t._)`${s}.data`, n)));
    });
  }
  Eo.extendErrors = u6t;
  function UVe(t, e) {
    let r = t.const("err", e);
    (t.if(
      (0, $t._)`${zo.default.vErrors} === null`,
      () => t.assign(zo.default.vErrors, (0, $t._)`[${r}]`),
      (0, $t._)`${zo.default.vErrors}.push(${r})`,
    ),
      t.code((0, $t._)`${zo.default.errors}++`));
  }
  function qVe(t, e) {
    let { gen: r, validateName: n, schemaEnv: o } = t;
    o.$async
      ? r.throw((0, $t._)`new ${t.ValidationError}(${e})`)
      : (r.assign((0, $t._)`${n}.errors`, e), r.return(!1));
  }
  var Of = {
    keyword: new $t.Name("keyword"),
    schemaPath: new $t.Name("schemaPath"),
    params: new $t.Name("params"),
    propertyName: new $t.Name("propertyName"),
    message: new $t.Name("message"),
    schema: new $t.Name("schema"),
    parentSchema: new $t.Name("parentSchema"),
  };
  function GVe(t, e, r) {
    let { createErrors: n } = t.it;
    return n === !1 ? (0, $t._)`{}` : d6t(t, e, r);
  }
  function d6t(t, e, r = {}) {
    let { gen: n, it: o } = t,
      i = [p6t(o, r), m6t(t, r)];
    return (f6t(t, e, i), n.object(...i));
  }
  function p6t({ errorPath: t }, { instancePath: e }) {
    let r = e ? (0, $t.str)`${t}${(0, dB.getErrorPath)(e, dB.Type.Str)}` : t;
    return [zo.default.instancePath, (0, $t.strConcat)(zo.default.instancePath, r)];
  }
  function m6t({ keyword: t, it: { errSchemaPath: e } }, { schemaPath: r, parentSchema: n }) {
    let o = n ? e : (0, $t.str)`${e}/${t}`;
    return (
      r && (o = (0, $t.str)`${o}${(0, dB.getErrorPath)(r, dB.Type.Str)}`),
      [Of.schemaPath, o]
    );
  }
  function f6t(t, { params: e, message: r }, n) {
    let { keyword: o, data: i, schemaValue: s, it: a } = t,
      { opts: l, propertyName: c, topSchemaRef: u, schemaPath: p } = a;
    (n.push([Of.keyword, o], [Of.params, typeof e == "function" ? e(t) : e || (0, $t._)`{}`]),
      l.messages && n.push([Of.message, typeof r == "function" ? r(t) : r]),
      l.verbose &&
        n.push([Of.schema, s], [Of.parentSchema, (0, $t._)`${u}${p}`], [zo.default.data, i]),
      c && n.push([Of.propertyName, c]));
  }
});
var HVe = A((sb) => {
  "use strict";
  Object.defineProperty(sb, "__esModule", { value: !0 });
  sb.boolOrEmptySchema = sb.topBoolOrEmptySchema = void 0;
  var h6t = GR(),
    g6t = gt(),
    y6t = $c(),
    v6t = { message: "boolean schema is false" };
  function b6t(t) {
    let { gen: e, schema: r, validateName: n } = t;
    r === !1
      ? WVe(t, !1)
      : typeof r == "object" && r.$async === !0
        ? e.return(y6t.default.data)
        : (e.assign((0, g6t._)`${n}.errors`, null), e.return(!0));
  }
  sb.topBoolOrEmptySchema = b6t;
  function S6t(t, e) {
    let { gen: r, schema: n } = t;
    n === !1 ? (r.var(e, !1), WVe(t)) : r.var(e, !0);
  }
  sb.boolOrEmptySchema = S6t;
  function WVe(t, e) {
    let { gen: r, data: n } = t,
      o = {
        gen: r,
        keyword: "false schema",
        data: n,
        schema: !1,
        schemaCode: !1,
        schemaValue: !1,
        params: {},
        it: t,
      };
    (0, h6t.reportError)(o, v6t, void 0, e);
  }
});
var WX = A((ab) => {
  "use strict";
  Object.defineProperty(ab, "__esModule", { value: !0 });
  ab.getRules = ab.isJSONType = void 0;
  var w6t = ["string", "number", "integer", "boolean", "null", "object", "array"],
    _6t = new Set(w6t);
  function x6t(t) {
    return typeof t == "string" && _6t.has(t);
  }
  ab.isJSONType = x6t;
  function A6t() {
    let t = {
      number: { type: "number", rules: [] },
      string: { type: "string", rules: [] },
      array: { type: "array", rules: [] },
      object: { type: "object", rules: [] },
    };
    return {
      types: { ...t, integer: !0, boolean: !0, null: !0 },
      rules: [{ rules: [] }, t.number, t.string, t.array, t.object],
      post: { rules: [] },
      all: {},
      keywords: {},
    };
  }
  ab.getRules = A6t;
});
var HX = A((Ld) => {
  "use strict";
  Object.defineProperty(Ld, "__esModule", { value: !0 });
  Ld.shouldUseRule = Ld.shouldUseGroup = Ld.schemaHasRulesForType = void 0;
  function R6t({ schema: t, self: e }, r) {
    let n = e.RULES.types[r];
    return n && n !== !0 && jVe(t, n);
  }
  Ld.schemaHasRulesForType = R6t;
  function jVe(t, e) {
    return e.rules.some((r) => zVe(t, r));
  }
  Ld.shouldUseGroup = jVe;
  function zVe(t, e) {
    var r;
    return (
      t[e.keyword] !== void 0 ||
      ((r = e.definition.implements) === null || r === void 0
        ? void 0
        : r.some((n) => t[n] !== void 0))
    );
  }
  Ld.shouldUseRule = zVe;
});
var WR = A((Co) => {
  "use strict";
  Object.defineProperty(Co, "__esModule", { value: !0 });
  Co.reportTypeError =
    Co.checkDataTypes =
    Co.checkDataType =
    Co.coerceAndCheckDataType =
    Co.getJSONTypes =
    Co.getSchemaTypes =
    Co.DataType =
      void 0;
  var E6t = WX(),
    C6t = HX(),
    T6t = GR(),
    dt = gt(),
    VVe = Ft(),
    lb;
  (function (t) {
    ((t[(t.Correct = 0)] = "Correct"), (t[(t.Wrong = 1)] = "Wrong"));
  })(lb || (Co.DataType = lb = {}));
  function P6t(t) {
    let e = KVe(t.type);
    if (e.includes("null")) {
      if (t.nullable === !1) throw new Error("type: null contradicts nullable: false");
    } else {
      if (!e.length && t.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      t.nullable === !0 && e.push("null");
    }
    return e;
  }
  Co.getSchemaTypes = P6t;
  function KVe(t) {
    let e = Array.isArray(t) ? t : t ? [t] : [];
    if (e.every(E6t.isJSONType)) return e;
    throw new Error("type must be JSONType or JSONType[]: " + e.join(","));
  }
  Co.getJSONTypes = KVe;
  function I6t(t, e) {
    let { gen: r, data: n, opts: o } = t,
      i = k6t(e, o.coerceTypes),
      s =
        e.length > 0 &&
        !(i.length === 0 && e.length === 1 && (0, C6t.schemaHasRulesForType)(t, e[0]));
    if (s) {
      let a = zX(e, n, o.strictNumbers, lb.Wrong);
      r.if(a, () => {
        i.length ? D6t(t, e, i) : VX(t);
      });
    }
    return s;
  }
  Co.coerceAndCheckDataType = I6t;
  var ZVe = new Set(["string", "number", "integer", "boolean", "null"]);
  function k6t(t, e) {
    return e ? t.filter((r) => ZVe.has(r) || (e === "array" && r === "array")) : [];
  }
  function D6t(t, e, r) {
    let { gen: n, data: o, opts: i } = t,
      s = n.let("dataType", (0, dt._)`typeof ${o}`),
      a = n.let("coerced", (0, dt._)`undefined`);
    (i.coerceTypes === "array" &&
      n.if((0, dt._)`${s} == 'object' && Array.isArray(${o}) && ${o}.length == 1`, () =>
        n
          .assign(o, (0, dt._)`${o}[0]`)
          .assign(s, (0, dt._)`typeof ${o}`)
          .if(zX(e, o, i.strictNumbers), () => n.assign(a, o)),
      ),
      n.if((0, dt._)`${a} !== undefined`));
    for (let c of r) (ZVe.has(c) || (c === "array" && i.coerceTypes === "array")) && l(c);
    (n.else(),
      VX(t),
      n.endIf(),
      n.if((0, dt._)`${a} !== undefined`, () => {
        (n.assign(o, a), M6t(t, a));
      }));
    function l(c) {
      switch (c) {
        case "string":
          n.elseIf((0, dt._)`${s} == "number" || ${s} == "boolean"`)
            .assign(a, (0, dt._)`"" + ${o}`)
            .elseIf((0, dt._)`${o} === null`)
            .assign(a, (0, dt._)`""`);
          return;
        case "number":
          n.elseIf(
            (0, dt._)`${s} == "boolean" || ${o} === null
              || (${s} == "string" && ${o} && ${o} == +${o})`,
          ).assign(a, (0, dt._)`+${o}`);
          return;
        case "integer":
          n.elseIf(
            (0, dt._)`${s} === "boolean" || ${o} === null
              || (${s} === "string" && ${o} && ${o} == +${o} && !(${o} % 1))`,
          ).assign(a, (0, dt._)`+${o}`);
          return;
        case "boolean":
          n.elseIf((0, dt._)`${o} === "false" || ${o} === 0 || ${o} === null`)
            .assign(a, !1)
            .elseIf((0, dt._)`${o} === "true" || ${o} === 1`)
            .assign(a, !0);
          return;
        case "null":
          (n.elseIf((0, dt._)`${o} === "" || ${o} === 0 || ${o} === false`), n.assign(a, null));
          return;
        case "array":
          n.elseIf(
            (0, dt._)`${s} === "string" || ${s} === "number"
              || ${s} === "boolean" || ${o} === null`,
          ).assign(a, (0, dt._)`[${o}]`);
      }
    }
  }
  function M6t({ gen: t, parentData: e, parentDataProperty: r }, n) {
    t.if((0, dt._)`${e} !== undefined`, () => t.assign((0, dt._)`${e}[${r}]`, n));
  }
  function jX(t, e, r, n = lb.Correct) {
    let o = n === lb.Correct ? dt.operators.EQ : dt.operators.NEQ,
      i;
    switch (t) {
      case "null":
        return (0, dt._)`${e} ${o} null`;
      case "array":
        i = (0, dt._)`Array.isArray(${e})`;
        break;
      case "object":
        i = (0, dt._)`${e} && typeof ${e} == "object" && !Array.isArray(${e})`;
        break;
      case "integer":
        i = s((0, dt._)`!(${e} % 1) && !isNaN(${e})`);
        break;
      case "number":
        i = s();
        break;
      default:
        return (0, dt._)`typeof ${e} ${o} ${t}`;
    }
    return n === lb.Correct ? i : (0, dt.not)(i);
    function s(a = dt.nil) {
      return (0, dt.and)(
        (0, dt._)`typeof ${e} == "number"`,
        a,
        r ? (0, dt._)`isFinite(${e})` : dt.nil,
      );
    }
  }
  Co.checkDataType = jX;
  function zX(t, e, r, n) {
    if (t.length === 1) return jX(t[0], e, r, n);
    let o,
      i = (0, VVe.toHash)(t);
    if (i.array && i.object) {
      let s = (0, dt._)`typeof ${e} != "object"`;
      ((o = i.null ? s : (0, dt._)`!${e} || ${s}`), delete i.null, delete i.array, delete i.object);
    } else o = dt.nil;
    i.number && delete i.integer;
    for (let s in i) o = (0, dt.and)(o, jX(s, e, r, n));
    return o;
  }
  Co.checkDataTypes = zX;
  var O6t = {
    message: ({ schema: t }) => `must be ${t}`,
    params: ({ schema: t, schemaValue: e }) =>
      typeof t == "string" ? (0, dt._)`{type: ${t}}` : (0, dt._)`{type: ${e}}`,
  };
  function VX(t) {
    let e = N6t(t);
    (0, T6t.reportError)(e, O6t);
  }
  Co.reportTypeError = VX;
  function N6t(t) {
    let { gen: e, data: r, schema: n } = t,
      o = (0, VVe.schemaRefOrVal)(t, n, "type");
    return {
      gen: e,
      keyword: "type",
      data: r,
      schema: n.type,
      schemaCode: o,
      schemaValue: o,
      parentSchema: n,
      params: {},
      it: t,
    };
  }
});
var YVe = A((pB) => {
  "use strict";
  Object.defineProperty(pB, "__esModule", { value: !0 });
  pB.assignDefaults = void 0;
  var cb = gt(),
    L6t = Ft();
  function B6t(t, e) {
    let { properties: r, items: n } = t.schema;
    if (e === "object" && r) for (let o in r) XVe(t, o, r[o].default);
    else e === "array" && Array.isArray(n) && n.forEach((o, i) => XVe(t, i, o.default));
  }
  pB.assignDefaults = B6t;
  function XVe(t, e, r) {
    let { gen: n, compositeRule: o, data: i, opts: s } = t;
    if (r === void 0) return;
    let a = (0, cb._)`${i}${(0, cb.getProperty)(e)}`;
    if (o) {
      (0, L6t.checkStrictMode)(t, `default is ignored for: ${a}`);
      return;
    }
    let l = (0, cb._)`${a} === undefined`;
    (s.useDefaults === "empty" && (l = (0, cb._)`${l} || ${a} === null || ${a} === ""`),
      n.if(l, (0, cb._)`${a} = ${(0, cb.stringify)(r)}`));
  }
});
var ws = A((dr) => {
  "use strict";
  Object.defineProperty(dr, "__esModule", { value: !0 });
  dr.validateUnion =
    dr.validateArray =
    dr.usePattern =
    dr.callValidateCode =
    dr.schemaProperties =
    dr.allSchemaProperties =
    dr.noPropertyInData =
    dr.propertyInData =
    dr.isOwnProperty =
    dr.hasPropFunc =
    dr.reportMissingProp =
    dr.checkMissingProp =
    dr.checkReportMissingProp =
      void 0;
  var Pr = gt(),
    KX = Ft(),
    Bd = $c(),
    F6t = Ft();
  function $6t(t, e) {
    let { gen: r, data: n, it: o } = t;
    r.if(XX(r, n, e, o.opts.ownProperties), () => {
      (t.setParams({ missingProperty: (0, Pr._)`${e}` }, !0), t.error());
    });
  }
  dr.checkReportMissingProp = $6t;
  function U6t({ gen: t, data: e, it: { opts: r } }, n, o) {
    return (0, Pr.or)(
      ...n.map((i) => (0, Pr.and)(XX(t, e, i, r.ownProperties), (0, Pr._)`${o} = ${i}`)),
    );
  }
  dr.checkMissingProp = U6t;
  function q6t(t, e) {
    (t.setParams({ missingProperty: e }, !0), t.error());
  }
  dr.reportMissingProp = q6t;
  function JVe(t) {
    return t.scopeValue("func", {
      ref: Object.prototype.hasOwnProperty,
      code: (0, Pr._)`Object.prototype.hasOwnProperty`,
    });
  }
  dr.hasPropFunc = JVe;
  function ZX(t, e, r) {
    return (0, Pr._)`${JVe(t)}.call(${e}, ${r})`;
  }
  dr.isOwnProperty = ZX;
  function G6t(t, e, r, n) {
    let o = (0, Pr._)`${e}${(0, Pr.getProperty)(r)} !== undefined`;
    return n ? (0, Pr._)`${o} && ${ZX(t, e, r)}` : o;
  }
  dr.propertyInData = G6t;
  function XX(t, e, r, n) {
    let o = (0, Pr._)`${e}${(0, Pr.getProperty)(r)} === undefined`;
    return n ? (0, Pr.or)(o, (0, Pr.not)(ZX(t, e, r))) : o;
  }
  dr.noPropertyInData = XX;
  function QVe(t) {
    return t ? Object.keys(t).filter((e) => e !== "__proto__") : [];
  }
  dr.allSchemaProperties = QVe;
  function W6t(t, e) {
    return QVe(e).filter((r) => !(0, KX.alwaysValidSchema)(t, e[r]));
  }
  dr.schemaProperties = W6t;
  function H6t(
    { schemaCode: t, data: e, it: { gen: r, topSchemaRef: n, schemaPath: o, errorPath: i }, it: s },
    a,
    l,
    c,
  ) {
    let u = c ? (0, Pr._)`${t}, ${e}, ${n}${o}` : e,
      p = [
        [Bd.default.instancePath, (0, Pr.strConcat)(Bd.default.instancePath, i)],
        [Bd.default.parentData, s.parentData],
        [Bd.default.parentDataProperty, s.parentDataProperty],
        [Bd.default.rootData, Bd.default.rootData],
      ];
    s.opts.dynamicRef && p.push([Bd.default.dynamicAnchors, Bd.default.dynamicAnchors]);
    let m = (0, Pr._)`${u}, ${r.object(...p)}`;
    return l !== Pr.nil ? (0, Pr._)`${a}.call(${l}, ${m})` : (0, Pr._)`${a}(${m})`;
  }
  dr.callValidateCode = H6t;
  var j6t = (0, Pr._)`new RegExp`;
  function z6t({ gen: t, it: { opts: e } }, r) {
    let n = e.unicodeRegExp ? "u" : "",
      { regExp: o } = e.code,
      i = o(r, n);
    return t.scopeValue("pattern", {
      key: i.toString(),
      ref: i,
      code: (0, Pr._)`${o.code === "new RegExp" ? j6t : (0, F6t.useFunc)(t, o)}(${r}, ${n})`,
    });
  }
  dr.usePattern = z6t;
  function V6t(t) {
    let { gen: e, data: r, keyword: n, it: o } = t,
      i = e.name("valid");
    if (o.allErrors) {
      let a = e.let("valid", !0);
      return (s(() => e.assign(a, !1)), a);
    }
    return (e.var(i, !0), s(() => e.break()), i);
    function s(a) {
      let l = e.const("len", (0, Pr._)`${r}.length`);
      e.forRange("i", 0, l, (c) => {
        (t.subschema({ keyword: n, dataProp: c, dataPropType: KX.Type.Num }, i),
          e.if((0, Pr.not)(i), a));
      });
    }
  }
  dr.validateArray = V6t;
  function K6t(t) {
    let { gen: e, schema: r, keyword: n, it: o } = t;
    if (!Array.isArray(r)) throw new Error("ajv implementation error");
    if (r.some((l) => (0, KX.alwaysValidSchema)(o, l)) && !o.opts.unevaluated) return;
    let s = e.let("valid", !1),
      a = e.name("_valid");
    (e.block(() =>
      r.forEach((l, c) => {
        let u = t.subschema({ keyword: n, schemaProp: c, compositeRule: !0 }, a);
        (e.assign(s, (0, Pr._)`${s} || ${a}`), t.mergeValidEvaluated(u, a) || e.if((0, Pr.not)(s)));
      }),
    ),
      t.result(
        s,
        () => t.reset(),
        () => t.error(!0),
      ));
  }
  dr.validateUnion = K6t;
});
var r6e = A((Cl) => {
  "use strict";
  Object.defineProperty(Cl, "__esModule", { value: !0 });
  Cl.validateKeywordUsage = Cl.validSchemaType = Cl.funcKeywordCode = Cl.macroKeywordCode = void 0;
  var Vo = gt(),
    Nf = $c(),
    Z6t = ws(),
    X6t = GR();
  function Y6t(t, e) {
    let { gen: r, keyword: n, schema: o, parentSchema: i, it: s } = t,
      a = e.macro.call(s.self, o, i, s),
      l = t6e(r, n, a);
    s.opts.validateSchema !== !1 && s.self.validateSchema(a, !0);
    let c = r.name("valid");
    (t.subschema(
      {
        schema: a,
        schemaPath: Vo.nil,
        errSchemaPath: `${s.errSchemaPath}/${n}`,
        topSchemaRef: l,
        compositeRule: !0,
      },
      c,
    ),
      t.pass(c, () => t.error(!0)));
  }
  Cl.macroKeywordCode = Y6t;
  function J6t(t, e) {
    var r;
    let { gen: n, keyword: o, schema: i, parentSchema: s, $data: a, it: l } = t;
    e3t(l, e);
    let c = !a && e.compile ? e.compile.call(l.self, i, s, l) : e.validate,
      u = t6e(n, o, c),
      p = n.let("valid");
    (t.block$data(p, m), t.ok((r = e.valid) !== null && r !== void 0 ? r : p));
    function m() {
      if (e.errors === !1) (v(), e.modifying && e6e(t), y(() => t.error()));
      else {
        let w = e.async ? f() : h();
        (e.modifying && e6e(t), y(() => Q6t(t, w)));
      }
    }
    function f() {
      let w = n.let("ruleErrs", null);
      return (
        n.try(
          () => v((0, Vo._)`await `),
          (_) =>
            n.assign(p, !1).if(
              (0, Vo._)`${_} instanceof ${l.ValidationError}`,
              () => n.assign(w, (0, Vo._)`${_}.errors`),
              () => n.throw(_),
            ),
        ),
        w
      );
    }
    function h() {
      let w = (0, Vo._)`${u}.errors`;
      return (n.assign(w, null), v(Vo.nil), w);
    }
    function v(w = e.async ? (0, Vo._)`await ` : Vo.nil) {
      let _ = l.opts.passContext ? Nf.default.this : Nf.default.self,
        S = !(("compile" in e && !a) || e.schema === !1);
      n.assign(p, (0, Vo._)`${w}${(0, Z6t.callValidateCode)(t, u, _, S)}`, e.modifying);
    }
    function y(w) {
      var _;
      n.if((0, Vo.not)((_ = e.valid) !== null && _ !== void 0 ? _ : p), w);
    }
  }
  Cl.funcKeywordCode = J6t;
  function e6e(t) {
    let { gen: e, data: r, it: n } = t;
    e.if(n.parentData, () => e.assign(r, (0, Vo._)`${n.parentData}[${n.parentDataProperty}]`));
  }
  function Q6t(t, e) {
    let { gen: r } = t;
    r.if(
      (0, Vo._)`Array.isArray(${e})`,
      () => {
        (r
          .assign(
            Nf.default.vErrors,
            (0, Vo._)`${Nf.default.vErrors} === null ? ${e} : ${Nf.default.vErrors}.concat(${e})`,
          )
          .assign(Nf.default.errors, (0, Vo._)`${Nf.default.vErrors}.length`),
          (0, X6t.extendErrors)(t));
      },
      () => t.error(),
    );
  }
  function e3t({ schemaEnv: t }, e) {
    if (e.async && !t.$async) throw new Error("async keyword in sync schema");
  }
  function t6e(t, e, r) {
    if (r === void 0) throw new Error(`keyword "${e}" failed to compile`);
    return t.scopeValue(
      "keyword",
      typeof r == "function" ? { ref: r } : { ref: r, code: (0, Vo.stringify)(r) },
    );
  }
  function t3t(t, e, r = !1) {
    return (
      !e.length ||
      e.some((n) =>
        n === "array"
          ? Array.isArray(t)
          : n === "object"
            ? t && typeof t == "object" && !Array.isArray(t)
            : typeof t == n || (r && typeof t > "u"),
      )
    );
  }
  Cl.validSchemaType = t3t;
  function r3t({ schema: t, opts: e, self: r, errSchemaPath: n }, o, i) {
    if (Array.isArray(o.keyword) ? !o.keyword.includes(i) : o.keyword !== i)
      throw new Error("ajv implementation error");
    let s = o.dependencies;
    if (s?.some((a) => !Object.prototype.hasOwnProperty.call(t, a)))
      throw new Error(`parent schema must have dependencies of ${i}: ${s.join(",")}`);
    if (o.validateSchema && !o.validateSchema(t[i])) {
      let l =
        `keyword "${i}" value is invalid at path "${n}": ` + r.errorsText(o.validateSchema.errors);
      if (e.validateSchema === "log") r.logger.error(l);
      else throw new Error(l);
    }
  }
  Cl.validateKeywordUsage = r3t;
});
var o6e = A((Fd) => {
  "use strict";
  Object.defineProperty(Fd, "__esModule", { value: !0 });
  Fd.extendSubschemaMode = Fd.extendSubschemaData = Fd.getSubschema = void 0;
  var Tl = gt(),
    n6e = Ft();
  function n3t(
    t,
    { keyword: e, schemaProp: r, schema: n, schemaPath: o, errSchemaPath: i, topSchemaRef: s },
  ) {
    if (e !== void 0 && n !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (e !== void 0) {
      let a = t.schema[e];
      return r === void 0
        ? {
            schema: a,
            schemaPath: (0, Tl._)`${t.schemaPath}${(0, Tl.getProperty)(e)}`,
            errSchemaPath: `${t.errSchemaPath}/${e}`,
          }
        : {
            schema: a[r],
            schemaPath: (0,
            Tl._)`${t.schemaPath}${(0, Tl.getProperty)(e)}${(0, Tl.getProperty)(r)}`,
            errSchemaPath: `${t.errSchemaPath}/${e}/${(0, n6e.escapeFragment)(r)}`,
          };
    }
    if (n !== void 0) {
      if (o === void 0 || i === void 0 || s === void 0)
        throw new Error(
          '"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"',
        );
      return { schema: n, schemaPath: o, topSchemaRef: s, errSchemaPath: i };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  Fd.getSubschema = n3t;
  function o3t(t, e, { dataProp: r, dataPropType: n, data: o, dataTypes: i, propertyName: s }) {
    if (o !== void 0 && r !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    let { gen: a } = e;
    if (r !== void 0) {
      let { errorPath: c, dataPathArr: u, opts: p } = e,
        m = a.let("data", (0, Tl._)`${e.data}${(0, Tl.getProperty)(r)}`, !0);
      (l(m),
        (t.errorPath = (0, Tl.str)`${c}${(0, n6e.getErrorPath)(r, n, p.jsPropertySyntax)}`),
        (t.parentDataProperty = (0, Tl._)`${r}`),
        (t.dataPathArr = [...u, t.parentDataProperty]));
    }
    if (o !== void 0) {
      let c = o instanceof Tl.Name ? o : a.let("data", o, !0);
      (l(c), s !== void 0 && (t.propertyName = s));
    }
    i && (t.dataTypes = i);
    function l(c) {
      ((t.data = c),
        (t.dataLevel = e.dataLevel + 1),
        (t.dataTypes = []),
        (e.definedProperties = new Set()),
        (t.parentData = e.data),
        (t.dataNames = [...e.dataNames, c]));
    }
  }
  Fd.extendSubschemaData = o3t;
  function i3t(
    t,
    { jtdDiscriminator: e, jtdMetadata: r, compositeRule: n, createErrors: o, allErrors: i },
  ) {
    (n !== void 0 && (t.compositeRule = n),
      o !== void 0 && (t.createErrors = o),
      i !== void 0 && (t.allErrors = i),
      (t.jtdDiscriminator = e),
      (t.jtdMetadata = r));
  }
  Fd.extendSubschemaMode = i3t;
});
var YX = A((_Cn, i6e) => {
  "use strict";
  i6e.exports = function t(e, r) {
    if (e === r) return !0;
    if (e && r && typeof e == "object" && typeof r == "object") {
      if (e.constructor !== r.constructor) return !1;
      var n, o, i;
      if (Array.isArray(e)) {
        if (((n = e.length), n != r.length)) return !1;
        for (o = n; o-- !== 0; ) if (!t(e[o], r[o])) return !1;
        return !0;
      }
      if (e.constructor === RegExp) return e.source === r.source && e.flags === r.flags;
      if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === r.valueOf();
      if (e.toString !== Object.prototype.toString) return e.toString() === r.toString();
      if (((i = Object.keys(e)), (n = i.length), n !== Object.keys(r).length)) return !1;
      for (o = n; o-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(r, i[o])) return !1;
      for (o = n; o-- !== 0; ) {
        var s = i[o];
        if (!t(e[s], r[s])) return !1;
      }
      return !0;
    }
    return e !== e && r !== r;
  };
});
var a6e = A((xCn, s6e) => {
  "use strict";
  var $d = (s6e.exports = function (t, e, r) {
    (typeof e == "function" && ((r = e), (e = {})), (r = e.cb || r));
    var n = typeof r == "function" ? r : r.pre || function () {},
      o = r.post || function () {};
    mB(e, n, o, t, "", t);
  });
  $d.keywords = {
    additionalItems: !0,
    items: !0,
    contains: !0,
    additionalProperties: !0,
    propertyNames: !0,
    not: !0,
    if: !0,
    then: !0,
    else: !0,
  };
  $d.arrayKeywords = { items: !0, allOf: !0, anyOf: !0, oneOf: !0 };
  $d.propsKeywords = {
    $defs: !0,
    definitions: !0,
    properties: !0,
    patternProperties: !0,
    dependencies: !0,
  };
  $d.skipKeywords = {
    default: !0,
    enum: !0,
    const: !0,
    required: !0,
    maximum: !0,
    minimum: !0,
    exclusiveMaximum: !0,
    exclusiveMinimum: !0,
    multipleOf: !0,
    maxLength: !0,
    minLength: !0,
    pattern: !0,
    format: !0,
    maxItems: !0,
    minItems: !0,
    uniqueItems: !0,
    maxProperties: !0,
    minProperties: !0,
  };
  function mB(t, e, r, n, o, i, s, a, l, c) {
    if (n && typeof n == "object" && !Array.isArray(n)) {
      e(n, o, i, s, a, l, c);
      for (var u in n) {
        var p = n[u];
        if (Array.isArray(p)) {
          if (u in $d.arrayKeywords)
            for (var m = 0; m < p.length; m++)
              mB(t, e, r, p[m], o + "/" + u + "/" + m, i, o, u, n, m);
        } else if (u in $d.propsKeywords) {
          if (p && typeof p == "object")
            for (var f in p) mB(t, e, r, p[f], o + "/" + u + "/" + s3t(f), i, o, u, n, f);
        } else
          (u in $d.keywords || (t.allKeys && !(u in $d.skipKeywords))) &&
            mB(t, e, r, p, o + "/" + u, i, o, u, n);
      }
      r(n, o, i, s, a, l, c);
    }
  }
  function s3t(t) {
    return t.replace(/~/g, "~0").replace(/\//g, "~1");
  }
});
var HR = A((xi) => {
  "use strict";
  Object.defineProperty(xi, "__esModule", { value: !0 });
  xi.getSchemaRefs =
    xi.resolveUrl =
    xi.normalizeId =
    xi._getFullPath =
    xi.getFullPath =
    xi.inlineRef =
      void 0;
  var a3t = Ft(),
    l3t = YX(),
    c3t = a6e(),
    u3t = new Set([
      "type",
      "format",
      "pattern",
      "maxLength",
      "minLength",
      "maxProperties",
      "minProperties",
      "maxItems",
      "minItems",
      "maximum",
      "minimum",
      "uniqueItems",
      "multipleOf",
      "required",
      "enum",
      "const",
    ]);
  function d3t(t, e = !0) {
    return typeof t == "boolean" ? !0 : e === !0 ? !JX(t) : e ? l6e(t) <= e : !1;
  }
  xi.inlineRef = d3t;
  var p3t = new Set(["$ref", "$recursiveRef", "$recursiveAnchor", "$dynamicRef", "$dynamicAnchor"]);
  function JX(t) {
    for (let e in t) {
      if (p3t.has(e)) return !0;
      let r = t[e];
      if ((Array.isArray(r) && r.some(JX)) || (typeof r == "object" && JX(r))) return !0;
    }
    return !1;
  }
  function l6e(t) {
    let e = 0;
    for (let r in t) {
      if (r === "$ref") return 1 / 0;
      if (
        (e++,
        !u3t.has(r) &&
          (typeof t[r] == "object" && (0, a3t.eachItem)(t[r], (n) => (e += l6e(n))), e === 1 / 0))
      )
        return 1 / 0;
    }
    return e;
  }
  function c6e(t, e = "", r) {
    r !== !1 && (e = ub(e));
    let n = t.parse(e);
    return u6e(t, n);
  }
  xi.getFullPath = c6e;
  function u6e(t, e) {
    return t.serialize(e).split("#")[0] + "#";
  }
  xi._getFullPath = u6e;
  var m3t = /#\/?$/;
  function ub(t) {
    return t ? t.replace(m3t, "") : "";
  }
  xi.normalizeId = ub;
  function f3t(t, e, r) {
    return ((r = ub(r)), t.resolve(e, r));
  }
  xi.resolveUrl = f3t;
  var h3t = /^[a-z_][-a-z0-9._]*$/i;
  function g3t(t, e) {
    if (typeof t == "boolean") return {};
    let { schemaId: r, uriResolver: n } = this.opts,
      o = ub(t[r] || e),
      i = { "": o },
      s = c6e(n, o, !1),
      a = {},
      l = new Set();
    return (
      c3t(t, { allKeys: !0 }, (p, m, f, h) => {
        if (h === void 0) return;
        let v = s + m,
          y = i[h];
        (typeof p[r] == "string" && (y = w.call(this, p[r])),
          _.call(this, p.$anchor),
          _.call(this, p.$dynamicAnchor),
          (i[m] = y));
        function w(S) {
          let E = this.opts.uriResolver.resolve;
          if (((S = ub(y ? E(y, S) : S)), l.has(S))) throw u(S);
          l.add(S);
          let T = this.refs[S];
          return (
            typeof T == "string" && (T = this.refs[T]),
            typeof T == "object"
              ? c(p, T.schema, S)
              : S !== ub(v) && (S[0] === "#" ? (c(p, a[S], S), (a[S] = p)) : (this.refs[S] = v)),
            S
          );
        }
        function _(S) {
          if (typeof S == "string") {
            if (!h3t.test(S)) throw new Error(`invalid anchor "${S}"`);
            w.call(this, `#${S}`);
          }
        }
      }),
      a
    );
    function c(p, m, f) {
      if (m !== void 0 && !l3t(p, m)) throw u(f);
    }
    function u(p) {
      return new Error(`reference "${p}" resolves to more than one schema`);
    }
  }
  xi.getSchemaRefs = g3t;
});
var VR = A((Ud) => {
  "use strict";
  Object.defineProperty(Ud, "__esModule", { value: !0 });
  Ud.getData = Ud.KeywordCxt = Ud.validateFunctionCode = void 0;
  var h6e = HVe(),
    d6e = WR(),
    eY = HX(),
    fB = WR(),
    y3t = YVe(),
    zR = r6e(),
    QX = o6e(),
    Ne = gt(),
    nt = $c(),
    v3t = HR(),
    Uc = Ft(),
    jR = GR();
  function b3t(t) {
    if (v6e(t) && (b6e(t), y6e(t))) {
      _3t(t);
      return;
    }
    g6e(t, () => (0, h6e.topBoolOrEmptySchema)(t));
  }
  Ud.validateFunctionCode = b3t;
  function g6e({ gen: t, validateName: e, schema: r, schemaEnv: n, opts: o }, i) {
    o.code.es5
      ? t.func(e, (0, Ne._)`${nt.default.data}, ${nt.default.valCxt}`, n.$async, () => {
          (t.code((0, Ne._)`"use strict"; ${p6e(r, o)}`), w3t(t, o), t.code(i));
        })
      : t.func(e, (0, Ne._)`${nt.default.data}, ${S3t(o)}`, n.$async, () =>
          t.code(p6e(r, o)).code(i),
        );
  }
  function S3t(t) {
    return (0,
    Ne._)`{${nt.default.instancePath}="", ${nt.default.parentData}, ${nt.default.parentDataProperty}, ${nt.default.rootData}=${nt.default.data}${t.dynamicRef ? (0, Ne._)`, ${nt.default.dynamicAnchors}={}` : Ne.nil}}={}`;
  }
  function w3t(t, e) {
    t.if(
      nt.default.valCxt,
      () => {
        (t.var(nt.default.instancePath, (0, Ne._)`${nt.default.valCxt}.${nt.default.instancePath}`),
          t.var(nt.default.parentData, (0, Ne._)`${nt.default.valCxt}.${nt.default.parentData}`),
          t.var(
            nt.default.parentDataProperty,
            (0, Ne._)`${nt.default.valCxt}.${nt.default.parentDataProperty}`,
          ),
          t.var(nt.default.rootData, (0, Ne._)`${nt.default.valCxt}.${nt.default.rootData}`),
          e.dynamicRef &&
            t.var(
              nt.default.dynamicAnchors,
              (0, Ne._)`${nt.default.valCxt}.${nt.default.dynamicAnchors}`,
            ));
      },
      () => {
        (t.var(nt.default.instancePath, (0, Ne._)`""`),
          t.var(nt.default.parentData, (0, Ne._)`undefined`),
          t.var(nt.default.parentDataProperty, (0, Ne._)`undefined`),
          t.var(nt.default.rootData, nt.default.data),
          e.dynamicRef && t.var(nt.default.dynamicAnchors, (0, Ne._)`{}`));
      },
    );
  }
  function _3t(t) {
    let { schema: e, opts: r, gen: n } = t;
    g6e(t, () => {
      (r.$comment && e.$comment && w6e(t),
        C3t(t),
        n.let(nt.default.vErrors, null),
        n.let(nt.default.errors, 0),
        r.unevaluated && x3t(t),
        S6e(t),
        I3t(t));
    });
  }
  function x3t(t) {
    let { gen: e, validateName: r } = t;
    ((t.evaluated = e.const("evaluated", (0, Ne._)`${r}.evaluated`)),
      e.if((0, Ne._)`${t.evaluated}.dynamicProps`, () =>
        e.assign((0, Ne._)`${t.evaluated}.props`, (0, Ne._)`undefined`),
      ),
      e.if((0, Ne._)`${t.evaluated}.dynamicItems`, () =>
        e.assign((0, Ne._)`${t.evaluated}.items`, (0, Ne._)`undefined`),
      ));
  }
  function p6e(t, e) {
    let r = typeof t == "object" && t[e.schemaId];
    return r && (e.code.source || e.code.process) ? (0, Ne._)`/*# sourceURL=${r} */` : Ne.nil;
  }
  function A3t(t, e) {
    if (v6e(t) && (b6e(t), y6e(t))) {
      R3t(t, e);
      return;
    }
    (0, h6e.boolOrEmptySchema)(t, e);
  }
  function y6e({ schema: t, self: e }) {
    if (typeof t == "boolean") return !t;
    for (let r in t) if (e.RULES.all[r]) return !0;
    return !1;
  }
  function v6e(t) {
    return typeof t.schema != "boolean";
  }
  function R3t(t, e) {
    let { schema: r, gen: n, opts: o } = t;
    (o.$comment && r.$comment && w6e(t), T3t(t), P3t(t));
    let i = n.const("_errs", nt.default.errors);
    (S6e(t, i), n.var(e, (0, Ne._)`${i} === ${nt.default.errors}`));
  }
  function b6e(t) {
    ((0, Uc.checkUnknownRules)(t), E3t(t));
  }
  function S6e(t, e) {
    if (t.opts.jtd) return m6e(t, [], !1, e);
    let r = (0, d6e.getSchemaTypes)(t.schema),
      n = (0, d6e.coerceAndCheckDataType)(t, r);
    m6e(t, r, !n, e);
  }
  function E3t(t) {
    let { schema: e, errSchemaPath: r, opts: n, self: o } = t;
    e.$ref &&
      n.ignoreKeywordsWithRef &&
      (0, Uc.schemaHasRulesButRef)(e, o.RULES) &&
      o.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
  }
  function C3t(t) {
    let { schema: e, opts: r } = t;
    e.default !== void 0 &&
      r.useDefaults &&
      r.strictSchema &&
      (0, Uc.checkStrictMode)(t, "default is ignored in the schema root");
  }
  function T3t(t) {
    let e = t.schema[t.opts.schemaId];
    e && (t.baseId = (0, v3t.resolveUrl)(t.opts.uriResolver, t.baseId, e));
  }
  function P3t(t) {
    if (t.schema.$async && !t.schemaEnv.$async) throw new Error("async schema in sync schema");
  }
  function w6e({ gen: t, schemaEnv: e, schema: r, errSchemaPath: n, opts: o }) {
    let i = r.$comment;
    if (o.$comment === !0) t.code((0, Ne._)`${nt.default.self}.logger.log(${i})`);
    else if (typeof o.$comment == "function") {
      let s = (0, Ne.str)`${n}/$comment`,
        a = t.scopeValue("root", { ref: e.root });
      t.code((0, Ne._)`${nt.default.self}.opts.$comment(${i}, ${s}, ${a}.schema)`);
    }
  }
  function I3t(t) {
    let { gen: e, schemaEnv: r, validateName: n, ValidationError: o, opts: i } = t;
    r.$async
      ? e.if(
          (0, Ne._)`${nt.default.errors} === 0`,
          () => e.return(nt.default.data),
          () => e.throw((0, Ne._)`new ${o}(${nt.default.vErrors})`),
        )
      : (e.assign((0, Ne._)`${n}.errors`, nt.default.vErrors),
        i.unevaluated && k3t(t),
        e.return((0, Ne._)`${nt.default.errors} === 0`));
  }
  function k3t({ gen: t, evaluated: e, props: r, items: n }) {
    (r instanceof Ne.Name && t.assign((0, Ne._)`${e}.props`, r),
      n instanceof Ne.Name && t.assign((0, Ne._)`${e}.items`, n));
  }
  function m6e(t, e, r, n) {
    let { gen: o, schema: i, data: s, allErrors: a, opts: l, self: c } = t,
      { RULES: u } = c;
    if (i.$ref && (l.ignoreKeywordsWithRef || !(0, Uc.schemaHasRulesButRef)(i, u))) {
      o.block(() => x6e(t, "$ref", u.all.$ref.definition));
      return;
    }
    (l.jtd || D3t(t, e),
      o.block(() => {
        for (let m of u.rules) p(m);
        p(u.post);
      }));
    function p(m) {
      (0, eY.shouldUseGroup)(i, m) &&
        (m.type
          ? (o.if((0, fB.checkDataType)(m.type, s, l.strictNumbers)),
            f6e(t, m),
            e.length === 1 && e[0] === m.type && r && (o.else(), (0, fB.reportTypeError)(t)),
            o.endIf())
          : f6e(t, m),
        a || o.if((0, Ne._)`${nt.default.errors} === ${n || 0}`));
    }
  }
  function f6e(t, e) {
    let {
      gen: r,
      schema: n,
      opts: { useDefaults: o },
    } = t;
    (o && (0, y3t.assignDefaults)(t, e.type),
      r.block(() => {
        for (let i of e.rules)
          (0, eY.shouldUseRule)(n, i) && x6e(t, i.keyword, i.definition, e.type);
      }));
  }
  function D3t(t, e) {
    t.schemaEnv.meta ||
      !t.opts.strictTypes ||
      (M3t(t, e), t.opts.allowUnionTypes || O3t(t, e), N3t(t, t.dataTypes));
  }
  function M3t(t, e) {
    if (e.length) {
      if (!t.dataTypes.length) {
        t.dataTypes = e;
        return;
      }
      (e.forEach((r) => {
        _6e(t.dataTypes, r) ||
          tY(t, `type "${r}" not allowed by context "${t.dataTypes.join(",")}"`);
      }),
        B3t(t, e));
    }
  }
  function O3t(t, e) {
    e.length > 1 &&
      !(e.length === 2 && e.includes("null")) &&
      tY(t, "use allowUnionTypes to allow union type keyword");
  }
  function N3t(t, e) {
    let r = t.self.RULES.all;
    for (let n in r) {
      let o = r[n];
      if (typeof o == "object" && (0, eY.shouldUseRule)(t.schema, o)) {
        let { type: i } = o.definition;
        i.length &&
          !i.some((s) => L3t(e, s)) &&
          tY(t, `missing type "${i.join(",")}" for keyword "${n}"`);
      }
    }
  }
  function L3t(t, e) {
    return t.includes(e) || (e === "number" && t.includes("integer"));
  }
  function _6e(t, e) {
    return t.includes(e) || (e === "integer" && t.includes("number"));
  }
  function B3t(t, e) {
    let r = [];
    for (let n of t.dataTypes)
      _6e(e, n) ? r.push(n) : e.includes("integer") && n === "number" && r.push("integer");
    t.dataTypes = r;
  }
  function tY(t, e) {
    let r = t.schemaEnv.baseId + t.errSchemaPath;
    ((e += ` at "${r}" (strictTypes)`), (0, Uc.checkStrictMode)(t, e, t.opts.strictTypes));
  }
  var hB = class {
    constructor(e, r, n) {
      if (
        ((0, zR.validateKeywordUsage)(e, r, n),
        (this.gen = e.gen),
        (this.allErrors = e.allErrors),
        (this.keyword = n),
        (this.data = e.data),
        (this.schema = e.schema[n]),
        (this.$data = r.$data && e.opts.$data && this.schema && this.schema.$data),
        (this.schemaValue = (0, Uc.schemaRefOrVal)(e, this.schema, n, this.$data)),
        (this.schemaType = r.schemaType),
        (this.parentSchema = e.schema),
        (this.params = {}),
        (this.it = e),
        (this.def = r),
        this.$data)
      )
        this.schemaCode = e.gen.const("vSchema", A6e(this.$data, e));
      else if (
        ((this.schemaCode = this.schemaValue),
        !(0, zR.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      )
        throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
      ("code" in r ? r.trackErrors : r.errors !== !1) &&
        (this.errsCount = e.gen.const("_errs", nt.default.errors));
    }
    result(e, r, n) {
      this.failResult((0, Ne.not)(e), r, n);
    }
    failResult(e, r, n) {
      (this.gen.if(e),
        n ? n() : this.error(),
        r
          ? (this.gen.else(), r(), this.allErrors && this.gen.endIf())
          : this.allErrors
            ? this.gen.endIf()
            : this.gen.else());
    }
    pass(e, r) {
      this.failResult((0, Ne.not)(e), void 0, r);
    }
    fail(e) {
      if (e === void 0) {
        (this.error(), this.allErrors || this.gen.if(!1));
        return;
      }
      (this.gen.if(e), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else());
    }
    fail$data(e) {
      if (!this.$data) return this.fail(e);
      let { schemaCode: r } = this;
      this.fail((0, Ne._)`${r} !== undefined && (${(0, Ne.or)(this.invalid$data(), e)})`);
    }
    error(e, r, n) {
      if (r) {
        (this.setParams(r), this._error(e, n), this.setParams({}));
        return;
      }
      this._error(e, n);
    }
    _error(e, r) {
      (e ? jR.reportExtraError : jR.reportError)(this, this.def.error, r);
    }
    $dataError() {
      (0, jR.reportError)(this, this.def.$dataError || jR.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0) throw new Error('add "trackErrors" to keyword definition');
      (0, jR.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(e) {
      this.allErrors || this.gen.if(e);
    }
    setParams(e, r) {
      r ? Object.assign(this.params, e) : (this.params = e);
    }
    block$data(e, r, n = Ne.nil) {
      this.gen.block(() => {
        (this.check$data(e, n), r());
      });
    }
    check$data(e = Ne.nil, r = Ne.nil) {
      if (!this.$data) return;
      let { gen: n, schemaCode: o, schemaType: i, def: s } = this;
      (n.if((0, Ne.or)((0, Ne._)`${o} === undefined`, r)),
        e !== Ne.nil && n.assign(e, !0),
        (i.length || s.validateSchema) &&
          (n.elseIf(this.invalid$data()), this.$dataError(), e !== Ne.nil && n.assign(e, !1)),
        n.else());
    }
    invalid$data() {
      let { gen: e, schemaCode: r, schemaType: n, def: o, it: i } = this;
      return (0, Ne.or)(s(), a());
      function s() {
        if (n.length) {
          if (!(r instanceof Ne.Name)) throw new Error("ajv implementation error");
          let l = Array.isArray(n) ? n : [n];
          return (0,
          Ne._)`${(0, fB.checkDataTypes)(l, r, i.opts.strictNumbers, fB.DataType.Wrong)}`;
        }
        return Ne.nil;
      }
      function a() {
        if (o.validateSchema) {
          let l = e.scopeValue("validate$data", { ref: o.validateSchema });
          return (0, Ne._)`!${l}(${r})`;
        }
        return Ne.nil;
      }
    }
    subschema(e, r) {
      let n = (0, QX.getSubschema)(this.it, e);
      ((0, QX.extendSubschemaData)(n, this.it, e), (0, QX.extendSubschemaMode)(n, e));
      let o = { ...this.it, ...n, items: void 0, props: void 0 };
      return (A3t(o, r), o);
    }
    mergeEvaluated(e, r) {
      let { it: n, gen: o } = this;
      n.opts.unevaluated &&
        (n.props !== !0 &&
          e.props !== void 0 &&
          (n.props = Uc.mergeEvaluated.props(o, e.props, n.props, r)),
        n.items !== !0 &&
          e.items !== void 0 &&
          (n.items = Uc.mergeEvaluated.items(o, e.items, n.items, r)));
    }
    mergeValidEvaluated(e, r) {
      let { it: n, gen: o } = this;
      if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
        return (o.if(r, () => this.mergeEvaluated(e, Ne.Name)), !0);
    }
  };
  Ud.KeywordCxt = hB;
  function x6e(t, e, r, n) {
    let o = new hB(t, r, e);
    "code" in r
      ? r.code(o, n)
      : o.$data && r.validate
        ? (0, zR.funcKeywordCode)(o, r)
        : "macro" in r
          ? (0, zR.macroKeywordCode)(o, r)
          : (r.compile || r.validate) && (0, zR.funcKeywordCode)(o, r);
  }
  var F3t = /^\/(?:[^~]|~0|~1)*$/,
    $3t = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function A6e(t, { dataLevel: e, dataNames: r, dataPathArr: n }) {
    let o, i;
    if (t === "") return nt.default.rootData;
    if (t[0] === "/") {
      if (!F3t.test(t)) throw new Error(`Invalid JSON-pointer: ${t}`);
      ((o = t), (i = nt.default.rootData));
    } else {
      let c = $3t.exec(t);
      if (!c) throw new Error(`Invalid JSON-pointer: ${t}`);
      let u = +c[1];
      if (((o = c[2]), o === "#")) {
        if (u >= e) throw new Error(l("property/index", u));
        return n[e - u];
      }
      if (u > e) throw new Error(l("data", u));
      if (((i = r[e - u]), !o)) return i;
    }
    let s = i,
      a = o.split("/");
    for (let c of a)
      c &&
        ((i = (0, Ne._)`${i}${(0, Ne.getProperty)((0, Uc.unescapeJsonPointer)(c))}`),
        (s = (0, Ne._)`${s} && ${i}`));
    return s;
    function l(c, u) {
      return `Cannot access ${c} ${u} levels up, current level is ${e}`;
    }
  }
  Ud.getData = A6e;
});
var gB = A((nY) => {
  "use strict";
  Object.defineProperty(nY, "__esModule", { value: !0 });
  var rY = class extends Error {
    constructor(e) {
      (super("validation failed"), (this.errors = e), (this.ajv = this.validation = !0));
    }
  };
  nY.default = rY;
});
var KR = A((sY) => {
  "use strict";
  Object.defineProperty(sY, "__esModule", { value: !0 });
  var oY = HR(),
    iY = class extends Error {
      constructor(e, r, n, o) {
        (super(o || `can't resolve reference ${n} from id ${r}`),
          (this.missingRef = (0, oY.resolveUrl)(e, r, n)),
          (this.missingSchema = (0, oY.normalizeId)((0, oY.getFullPath)(e, this.missingRef))));
      }
    };
  sY.default = iY;
});
var vB = A((_s) => {
  "use strict";
  Object.defineProperty(_s, "__esModule", { value: !0 });
  _s.resolveSchema =
    _s.getCompilingSchema =
    _s.resolveRef =
    _s.compileSchema =
    _s.SchemaEnv =
      void 0;
  var da = gt(),
    U3t = gB(),
    Lf = $c(),
    pa = HR(),
    R6e = Ft(),
    q3t = VR(),
    db = class {
      constructor(e) {
        var r;
        ((this.refs = {}), (this.dynamicAnchors = {}));
        let n;
        (typeof e.schema == "object" && (n = e.schema),
          (this.schema = e.schema),
          (this.schemaId = e.schemaId),
          (this.root = e.root || this),
          (this.baseId =
            (r = e.baseId) !== null && r !== void 0
              ? r
              : (0, pa.normalizeId)(n?.[e.schemaId || "$id"])),
          (this.schemaPath = e.schemaPath),
          (this.localRefs = e.localRefs),
          (this.meta = e.meta),
          (this.$async = n?.$async),
          (this.refs = {}));
      }
    };
  _s.SchemaEnv = db;
  function lY(t) {
    let e = E6e.call(this, t);
    if (e) return e;
    let r = (0, pa.getFullPath)(this.opts.uriResolver, t.root.baseId),
      { es5: n, lines: o } = this.opts.code,
      { ownProperties: i } = this.opts,
      s = new da.CodeGen(this.scope, { es5: n, lines: o, ownProperties: i }),
      a;
    t.$async &&
      (a = s.scopeValue("Error", {
        ref: U3t.default,
        code: (0, da._)`require("ajv/dist/runtime/validation_error").default`,
      }));
    let l = s.scopeName("validate");
    t.validateName = l;
    let c = {
        gen: s,
        allErrors: this.opts.allErrors,
        data: Lf.default.data,
        parentData: Lf.default.parentData,
        parentDataProperty: Lf.default.parentDataProperty,
        dataNames: [Lf.default.data],
        dataPathArr: [da.nil],
        dataLevel: 0,
        dataTypes: [],
        definedProperties: new Set(),
        topSchemaRef: s.scopeValue(
          "schema",
          this.opts.code.source === !0
            ? { ref: t.schema, code: (0, da.stringify)(t.schema) }
            : { ref: t.schema },
        ),
        validateName: l,
        ValidationError: a,
        schema: t.schema,
        schemaEnv: t,
        rootId: r,
        baseId: t.baseId || r,
        schemaPath: da.nil,
        errSchemaPath: t.schemaPath || (this.opts.jtd ? "" : "#"),
        errorPath: (0, da._)`""`,
        opts: this.opts,
        self: this,
      },
      u;
    try {
      (this._compilations.add(t),
        (0, q3t.validateFunctionCode)(c),
        s.optimize(this.opts.code.optimize));
      let p = s.toString();
      ((u = `${s.scopeRefs(Lf.default.scope)}return ${p}`),
        this.opts.code.process && (u = this.opts.code.process(u, t)));
      let f = new Function(`${Lf.default.self}`, `${Lf.default.scope}`, u)(this, this.scope.get());
      if (
        (this.scope.value(l, { ref: f }),
        (f.errors = null),
        (f.schema = t.schema),
        (f.schemaEnv = t),
        t.$async && (f.$async = !0),
        this.opts.code.source === !0 &&
          (f.source = { validateName: l, validateCode: p, scopeValues: s._values }),
        this.opts.unevaluated)
      ) {
        let { props: h, items: v } = c;
        ((f.evaluated = {
          props: h instanceof da.Name ? void 0 : h,
          items: v instanceof da.Name ? void 0 : v,
          dynamicProps: h instanceof da.Name,
          dynamicItems: v instanceof da.Name,
        }),
          f.source && (f.source.evaluated = (0, da.stringify)(f.evaluated)));
      }
      return ((t.validate = f), t);
    } catch (p) {
      throw (
        delete t.validate,
        delete t.validateName,
        u && this.logger.error("Error compiling schema, function code:", u),
        p
      );
    } finally {
      this._compilations.delete(t);
    }
  }
  _s.compileSchema = lY;
  function G3t(t, e, r) {
    var n;
    r = (0, pa.resolveUrl)(this.opts.uriResolver, e, r);
    let o = t.refs[r];
    if (o) return o;
    let i = j3t.call(this, t, r);
    if (i === void 0) {
      let s = (n = t.localRefs) === null || n === void 0 ? void 0 : n[r],
        { schemaId: a } = this.opts;
      s && (i = new db({ schema: s, schemaId: a, root: t, baseId: e }));
    }
    if (i !== void 0) return (t.refs[r] = W3t.call(this, i));
  }
  _s.resolveRef = G3t;
  function W3t(t) {
    return (0, pa.inlineRef)(t.schema, this.opts.inlineRefs)
      ? t.schema
      : t.validate
        ? t
        : lY.call(this, t);
  }
  function E6e(t) {
    for (let e of this._compilations) if (H3t(e, t)) return e;
  }
  _s.getCompilingSchema = E6e;
  function H3t(t, e) {
    return t.schema === e.schema && t.root === e.root && t.baseId === e.baseId;
  }
  function j3t(t, e) {
    let r;
    for (; typeof (r = this.refs[e]) == "string"; ) e = r;
    return r || this.schemas[e] || yB.call(this, t, e);
  }
  function yB(t, e) {
    let r = this.opts.uriResolver.parse(e),
      n = (0, pa._getFullPath)(this.opts.uriResolver, r),
      o = (0, pa.getFullPath)(this.opts.uriResolver, t.baseId, void 0);
    if (Object.keys(t.schema).length > 0 && n === o) return aY.call(this, r, t);
    let i = (0, pa.normalizeId)(n),
      s = this.refs[i] || this.schemas[i];
    if (typeof s == "string") {
      let a = yB.call(this, t, s);
      return typeof a?.schema != "object" ? void 0 : aY.call(this, r, a);
    }
    if (typeof s?.schema == "object") {
      if ((s.validate || lY.call(this, s), i === (0, pa.normalizeId)(e))) {
        let { schema: a } = s,
          { schemaId: l } = this.opts,
          c = a[l];
        return (
          c && (o = (0, pa.resolveUrl)(this.opts.uriResolver, o, c)),
          new db({ schema: a, schemaId: l, root: t, baseId: o })
        );
      }
      return aY.call(this, r, s);
    }
  }
  _s.resolveSchema = yB;
  var z3t = new Set(["properties", "patternProperties", "enum", "dependencies", "definitions"]);
  function aY(t, { baseId: e, schema: r, root: n }) {
    var o;
    if (((o = t.fragment) === null || o === void 0 ? void 0 : o[0]) !== "/") return;
    for (let a of t.fragment.slice(1).split("/")) {
      if (typeof r == "boolean") return;
      let l = r[(0, R6e.unescapeFragment)(a)];
      if (l === void 0) return;
      r = l;
      let c = typeof r == "object" && r[this.opts.schemaId];
      !z3t.has(a) && c && (e = (0, pa.resolveUrl)(this.opts.uriResolver, e, c));
    }
    let i;
    if (typeof r != "boolean" && r.$ref && !(0, R6e.schemaHasRulesButRef)(r, this.RULES)) {
      let a = (0, pa.resolveUrl)(this.opts.uriResolver, e, r.$ref);
      i = yB.call(this, n, a);
    }
    let { schemaId: s } = this.opts;
    if (
      ((i = i || new db({ schema: r, schemaId: s, root: n, baseId: e })),
      i.schema !== i.root.schema)
    )
      return i;
  }
});
