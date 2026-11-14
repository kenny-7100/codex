var I3e = A((Pl) => {
  "use strict";
  Object.defineProperty(Pl, "__esModule", { value: !0 });
  Pl.validateSchemaDeps = Pl.validatePropertyDeps = Pl.error = void 0;
  var qY = gt(),
    d8t = Ft(),
    aE = ws();
  Pl.error = {
    message: ({ params: { property: t, depsCount: e, deps: r } }) => {
      let n = e === 1 ? "property" : "properties";
      return (0, qY.str)`must have ${n} ${r} when property ${t} is present`;
    },
    params: ({ params: { property: t, depsCount: e, deps: r, missingProperty: n } }) => (0,
    qY._)`{property: ${t},
    missingProperty: ${n},
    depsCount: ${e},
    deps: ${r}}`,
  };
  var p8t = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: Pl.error,
    code(t) {
      let [e, r] = m8t(t);
      (T3e(t, e), P3e(t, r));
    },
  };
  function m8t({ schema: t }) {
    let e = {},
      r = {};
    for (let n in t) {
      if (n === "__proto__") continue;
      let o = Array.isArray(t[n]) ? e : r;
      o[n] = t[n];
    }
    return [e, r];
  }
  function T3e(t, e = t.schema) {
    let { gen: r, data: n, it: o } = t;
    if (Object.keys(e).length === 0) return;
    let i = r.let("missing");
    for (let s in e) {
      let a = e[s];
      if (a.length === 0) continue;
      let l = (0, aE.propertyInData)(r, n, s, o.opts.ownProperties);
      (t.setParams({ property: s, depsCount: a.length, deps: a.join(", ") }),
        o.allErrors
          ? r.if(l, () => {
              for (let c of a) (0, aE.checkReportMissingProp)(t, c);
            })
          : (r.if((0, qY._)`${l} && (${(0, aE.checkMissingProp)(t, a, i)})`),
            (0, aE.reportMissingProp)(t, i),
            r.else()));
    }
  }
  Pl.validatePropertyDeps = T3e;
  function P3e(t, e = t.schema) {
    let { gen: r, data: n, keyword: o, it: i } = t,
      s = r.name("valid");
    for (let a in e)
      (0, d8t.alwaysValidSchema)(i, e[a]) ||
        (r.if(
          (0, aE.propertyInData)(r, n, a, i.opts.ownProperties),
          () => {
            let l = t.subschema({ keyword: o, schemaProp: a }, s);
            t.mergeValidEvaluated(l, s);
          },
          () => r.var(s, !0),
        ),
        t.ok(s));
  }
  Pl.validateSchemaDeps = P3e;
  Pl.default = p8t;
});
var D3e = A((GY) => {
  "use strict";
  Object.defineProperty(GY, "__esModule", { value: !0 });
  var k3e = gt(),
    f8t = Ft(),
    h8t = {
      message: "property name must be valid",
      params: ({ params: t }) => (0, k3e._)`{propertyName: ${t.propertyName}}`,
    },
    g8t = {
      keyword: "propertyNames",
      type: "object",
      schemaType: ["object", "boolean"],
      error: h8t,
      code(t) {
        let { gen: e, schema: r, data: n, it: o } = t;
        if ((0, f8t.alwaysValidSchema)(o, r)) return;
        let i = e.name("valid");
        (e.forIn("key", n, (s) => {
          (t.setParams({ propertyName: s }),
            t.subschema(
              {
                keyword: "propertyNames",
                data: s,
                dataTypes: ["string"],
                propertyName: s,
                compositeRule: !0,
              },
              i,
            ),
            e.if((0, k3e.not)(i), () => {
              (t.error(!0), o.allErrors || e.break());
            }));
        }),
          t.ok(i));
      },
    };
  GY.default = g8t;
});
var HY = A((WY) => {
  "use strict";
  Object.defineProperty(WY, "__esModule", { value: !0 });
  var IB = ws(),
    ma = gt(),
    y8t = $c(),
    kB = Ft(),
    v8t = {
      message: "must NOT have additional properties",
      params: ({ params: t }) => (0, ma._)`{additionalProperty: ${t.additionalProperty}}`,
    },
    b8t = {
      keyword: "additionalProperties",
      type: ["object"],
      schemaType: ["boolean", "object"],
      allowUndefined: !0,
      trackErrors: !0,
      error: v8t,
      code(t) {
        let { gen: e, schema: r, parentSchema: n, data: o, errsCount: i, it: s } = t;
        if (!i) throw new Error("ajv implementation error");
        let { allErrors: a, opts: l } = s;
        if (((s.props = !0), l.removeAdditional !== "all" && (0, kB.alwaysValidSchema)(s, r)))
          return;
        let c = (0, IB.allSchemaProperties)(n.properties),
          u = (0, IB.allSchemaProperties)(n.patternProperties);
        (p(), t.ok((0, ma._)`${i} === ${y8t.default.errors}`));
        function p() {
          e.forIn("key", o, (y) => {
            !c.length && !u.length ? h(y) : e.if(m(y), () => h(y));
          });
        }
        function m(y) {
          let w;
          if (c.length > 8) {
            let _ = (0, kB.schemaRefOrVal)(s, n.properties, "properties");
            w = (0, IB.isOwnProperty)(e, _, y);
          } else
            c.length ? (w = (0, ma.or)(...c.map((_) => (0, ma._)`${y} === ${_}`))) : (w = ma.nil);
          return (
            u.length &&
              (w = (0, ma.or)(
                w,
                ...u.map((_) => (0, ma._)`${(0, IB.usePattern)(t, _)}.test(${y})`),
              )),
            (0, ma.not)(w)
          );
        }
        function f(y) {
          e.code((0, ma._)`delete ${o}[${y}]`);
        }
        function h(y) {
          if (l.removeAdditional === "all" || (l.removeAdditional && r === !1)) {
            f(y);
            return;
          }
          if (r === !1) {
            (t.setParams({ additionalProperty: y }), t.error(), a || e.break());
            return;
          }
          if (typeof r == "object" && !(0, kB.alwaysValidSchema)(s, r)) {
            let w = e.name("valid");
            l.removeAdditional === "failing"
              ? (v(y, w, !1),
                e.if((0, ma.not)(w), () => {
                  (t.reset(), f(y));
                }))
              : (v(y, w), a || e.if((0, ma.not)(w), () => e.break()));
          }
        }
        function v(y, w, _) {
          let S = { keyword: "additionalProperties", dataProp: y, dataPropType: kB.Type.Str };
          (_ === !1 && Object.assign(S, { compositeRule: !0, createErrors: !1, allErrors: !1 }),
            t.subschema(S, w));
        }
      },
    };
  WY.default = b8t;
});
var N3e = A((zY) => {
  "use strict";
  Object.defineProperty(zY, "__esModule", { value: !0 });
  var S8t = VR(),
    M3e = ws(),
    jY = Ft(),
    O3e = HY(),
    w8t = {
      keyword: "properties",
      type: "object",
      schemaType: "object",
      code(t) {
        let { gen: e, schema: r, parentSchema: n, data: o, it: i } = t;
        i.opts.removeAdditional === "all" &&
          n.additionalProperties === void 0 &&
          O3e.default.code(new S8t.KeywordCxt(i, O3e.default, "additionalProperties"));
        let s = (0, M3e.allSchemaProperties)(r);
        for (let p of s) i.definedProperties.add(p);
        i.opts.unevaluated &&
          s.length &&
          i.props !== !0 &&
          (i.props = jY.mergeEvaluated.props(e, (0, jY.toHash)(s), i.props));
        let a = s.filter((p) => !(0, jY.alwaysValidSchema)(i, r[p]));
        if (a.length === 0) return;
        let l = e.name("valid");
        for (let p of a)
          (c(p)
            ? u(p)
            : (e.if((0, M3e.propertyInData)(e, o, p, i.opts.ownProperties)),
              u(p),
              i.allErrors || e.else().var(l, !0),
              e.endIf()),
            t.it.definedProperties.add(p),
            t.ok(l));
        function c(p) {
          return i.opts.useDefaults && !i.compositeRule && r[p].default !== void 0;
        }
        function u(p) {
          t.subschema({ keyword: "properties", schemaProp: p, dataProp: p }, l);
        }
      },
    };
  zY.default = w8t;
});
var $3e = A((VY) => {
  "use strict";
  Object.defineProperty(VY, "__esModule", { value: !0 });
  var L3e = ws(),
    DB = gt(),
    B3e = Ft(),
    F3e = Ft(),
    _8t = {
      keyword: "patternProperties",
      type: "object",
      schemaType: "object",
      code(t) {
        let { gen: e, schema: r, data: n, parentSchema: o, it: i } = t,
          { opts: s } = i,
          a = (0, L3e.allSchemaProperties)(r),
          l = a.filter((v) => (0, B3e.alwaysValidSchema)(i, r[v]));
        if (a.length === 0 || (l.length === a.length && (!i.opts.unevaluated || i.props === !0)))
          return;
        let c = s.strictSchema && !s.allowMatchingProperties && o.properties,
          u = e.name("valid");
        i.props !== !0 &&
          !(i.props instanceof DB.Name) &&
          (i.props = (0, F3e.evaluatedPropsToName)(e, i.props));
        let { props: p } = i;
        m();
        function m() {
          for (let v of a) (c && f(v), i.allErrors ? h(v) : (e.var(u, !0), h(v), e.if(u)));
        }
        function f(v) {
          for (let y in c)
            new RegExp(v).test(y) &&
              (0, B3e.checkStrictMode)(
                i,
                `property ${y} matches pattern ${v} (use allowMatchingProperties)`,
              );
        }
        function h(v) {
          e.forIn("key", n, (y) => {
            e.if((0, DB._)`${(0, L3e.usePattern)(t, v)}.test(${y})`, () => {
              let w = l.includes(v);
              (w ||
                t.subschema(
                  {
                    keyword: "patternProperties",
                    schemaProp: v,
                    dataProp: y,
                    dataPropType: F3e.Type.Str,
                  },
                  u,
                ),
                i.opts.unevaluated && p !== !0
                  ? e.assign((0, DB._)`${p}[${y}]`, !0)
                  : !w && !i.allErrors && e.if((0, DB.not)(u), () => e.break()));
            });
          });
        }
      },
    };
  VY.default = _8t;
});
var U3e = A((KY) => {
  "use strict";
  Object.defineProperty(KY, "__esModule", { value: !0 });
  var x8t = Ft(),
    A8t = {
      keyword: "not",
      schemaType: ["object", "boolean"],
      trackErrors: !0,
      code(t) {
        let { gen: e, schema: r, it: n } = t;
        if ((0, x8t.alwaysValidSchema)(n, r)) {
          t.fail();
          return;
        }
        let o = e.name("valid");
        (t.subschema({ keyword: "not", compositeRule: !0, createErrors: !1, allErrors: !1 }, o),
          t.failResult(
            o,
            () => t.reset(),
            () => t.error(),
          ));
      },
      error: { message: "must NOT be valid" },
    };
  KY.default = A8t;
});
var q3e = A((ZY) => {
  "use strict";
  Object.defineProperty(ZY, "__esModule", { value: !0 });
  var R8t = ws(),
    E8t = {
      keyword: "anyOf",
      schemaType: "array",
      trackErrors: !0,
      code: R8t.validateUnion,
      error: { message: "must match a schema in anyOf" },
    };
  ZY.default = E8t;
});
var G3e = A((XY) => {
  "use strict";
  Object.defineProperty(XY, "__esModule", { value: !0 });
  var MB = gt(),
    C8t = Ft(),
    T8t = {
      message: "must match exactly one schema in oneOf",
      params: ({ params: t }) => (0, MB._)`{passingSchemas: ${t.passing}}`,
    },
    P8t = {
      keyword: "oneOf",
      schemaType: "array",
      trackErrors: !0,
      error: T8t,
      code(t) {
        let { gen: e, schema: r, parentSchema: n, it: o } = t;
        if (!Array.isArray(r)) throw new Error("ajv implementation error");
        if (o.opts.discriminator && n.discriminator) return;
        let i = r,
          s = e.let("valid", !1),
          a = e.let("passing", null),
          l = e.name("_valid");
        (t.setParams({ passing: a }),
          e.block(c),
          t.result(
            s,
            () => t.reset(),
            () => t.error(!0),
          ));
        function c() {
          i.forEach((u, p) => {
            let m;
            ((0, C8t.alwaysValidSchema)(o, u)
              ? e.var(l, !0)
              : (m = t.subschema({ keyword: "oneOf", schemaProp: p, compositeRule: !0 }, l)),
              p > 0 &&
                e
                  .if((0, MB._)`${l} && ${s}`)
                  .assign(s, !1)
                  .assign(a, (0, MB._)`[${a}, ${p}]`)
                  .else(),
              e.if(l, () => {
                (e.assign(s, !0), e.assign(a, p), m && t.mergeEvaluated(m, MB.Name));
              }));
          });
        }
      },
    };
  XY.default = P8t;
});
var W3e = A((YY) => {
  "use strict";
  Object.defineProperty(YY, "__esModule", { value: !0 });
  var I8t = Ft(),
    k8t = {
      keyword: "allOf",
      schemaType: "array",
      code(t) {
        let { gen: e, schema: r, it: n } = t;
        if (!Array.isArray(r)) throw new Error("ajv implementation error");
        let o = e.name("valid");
        r.forEach((i, s) => {
          if ((0, I8t.alwaysValidSchema)(n, i)) return;
          let a = t.subschema({ keyword: "allOf", schemaProp: s }, o);
          (t.ok(o), t.mergeEvaluated(a));
        });
      },
    };
  YY.default = k8t;
});
var z3e = A((JY) => {
  "use strict";
  Object.defineProperty(JY, "__esModule", { value: !0 });
  var OB = gt(),
    j3e = Ft(),
    D8t = {
      message: ({ params: t }) => (0, OB.str)`must match "${t.ifClause}" schema`,
      params: ({ params: t }) => (0, OB._)`{failingKeyword: ${t.ifClause}}`,
    },
    M8t = {
      keyword: "if",
      schemaType: ["object", "boolean"],
      trackErrors: !0,
      error: D8t,
      code(t) {
        let { gen: e, parentSchema: r, it: n } = t;
        r.then === void 0 &&
          r.else === void 0 &&
          (0, j3e.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
        let o = H3e(n, "then"),
          i = H3e(n, "else");
        if (!o && !i) return;
        let s = e.let("valid", !0),
          a = e.name("_valid");
        if ((l(), t.reset(), o && i)) {
          let u = e.let("ifClause");
          (t.setParams({ ifClause: u }), e.if(a, c("then", u), c("else", u)));
        } else o ? e.if(a, c("then")) : e.if((0, OB.not)(a), c("else"));
        t.pass(s, () => t.error(!0));
        function l() {
          let u = t.subschema(
            { keyword: "if", compositeRule: !0, createErrors: !1, allErrors: !1 },
            a,
          );
          t.mergeEvaluated(u);
        }
        function c(u, p) {
          return () => {
            let m = t.subschema({ keyword: u }, a);
            (e.assign(s, a),
              t.mergeValidEvaluated(m, s),
              p ? e.assign(p, (0, OB._)`${u}`) : t.setParams({ ifClause: u }));
          };
        }
      },
    };
  function H3e(t, e) {
    let r = t.schema[e];
    return r !== void 0 && !(0, j3e.alwaysValidSchema)(t, r);
  }
  JY.default = M8t;
});
var V3e = A((QY) => {
  "use strict";
  Object.defineProperty(QY, "__esModule", { value: !0 });
  var O8t = Ft(),
    N8t = {
      keyword: ["then", "else"],
      schemaType: ["object", "boolean"],
      code({ keyword: t, parentSchema: e, it: r }) {
        e.if === void 0 && (0, O8t.checkStrictMode)(r, `"${t}" without "if" is ignored`);
      },
    };
  QY.default = N8t;
});
var K3e = A((eJ) => {
  "use strict";
  Object.defineProperty(eJ, "__esModule", { value: !0 });
  var L8t = LY(),
    B8t = A3e(),
    F8t = BY(),
    $8t = E3e(),
    U8t = C3e(),
    q8t = I3e(),
    G8t = D3e(),
    W8t = HY(),
    H8t = N3e(),
    j8t = $3e(),
    z8t = U3e(),
    V8t = q3e(),
    K8t = G3e(),
    Z8t = W3e(),
    X8t = z3e(),
    Y8t = V3e();
  function J8t(t = !1) {
    let e = [
      z8t.default,
      V8t.default,
      K8t.default,
      Z8t.default,
      X8t.default,
      Y8t.default,
      G8t.default,
      W8t.default,
      q8t.default,
      H8t.default,
      j8t.default,
    ];
    return (
      t ? e.push(B8t.default, $8t.default) : e.push(L8t.default, F8t.default),
      e.push(U8t.default),
      e
    );
  }
  eJ.default = J8t;
});
var Z3e = A((tJ) => {
  "use strict";
  Object.defineProperty(tJ, "__esModule", { value: !0 });
  var sn = gt(),
    Q8t = {
      message: ({ schemaCode: t }) => (0, sn.str)`must match format "${t}"`,
      params: ({ schemaCode: t }) => (0, sn._)`{format: ${t}}`,
    },
    e9t = {
      keyword: "format",
      type: ["number", "string"],
      schemaType: "string",
      $data: !0,
      error: Q8t,
      code(t, e) {
        let { gen: r, data: n, $data: o, schema: i, schemaCode: s, it: a } = t,
          { opts: l, errSchemaPath: c, schemaEnv: u, self: p } = a;
        if (!l.validateFormats) return;
        o ? m() : f();
        function m() {
          let h = r.scopeValue("formats", { ref: p.formats, code: l.code.formats }),
            v = r.const("fDef", (0, sn._)`${h}[${s}]`),
            y = r.let("fType"),
            w = r.let("format");
          (r.if(
            (0, sn._)`typeof ${v} == "object" && !(${v} instanceof RegExp)`,
            () => r.assign(y, (0, sn._)`${v}.type || "string"`).assign(w, (0, sn._)`${v}.validate`),
            () => r.assign(y, (0, sn._)`"string"`).assign(w, v),
          ),
            t.fail$data((0, sn.or)(_(), S())));
          function _() {
            return l.strictSchema === !1 ? sn.nil : (0, sn._)`${s} && !${w}`;
          }
          function S() {
            let E = u.$async
                ? (0, sn._)`(${v}.async ? await ${w}(${n}) : ${w}(${n}))`
                : (0, sn._)`${w}(${n})`,
              T = (0, sn._)`(typeof ${w} == "function" ? ${E} : ${w}.test(${n}))`;
            return (0, sn._)`${w} && ${w} !== true && ${y} === ${e} && !${T}`;
          }
        }
        function f() {
          let h = p.formats[i];
          if (!h) {
            _();
            return;
          }
          if (h === !0) return;
          let [v, y, w] = S(h);
          v === e && t.pass(E());
          function _() {
            if (l.strictSchema === !1) {
              p.logger.warn(T());
              return;
            }
            throw new Error(T());
            function T() {
              return `unknown format "${i}" ignored in schema at path "${c}"`;
            }
          }
          function S(T) {
            let P =
                T instanceof RegExp
                  ? (0, sn.regexpCode)(T)
                  : l.code.formats
                    ? (0, sn._)`${l.code.formats}${(0, sn.getProperty)(i)}`
                    : void 0,
              M = r.scopeValue("formats", { key: i, ref: T, code: P });
            return typeof T == "object" && !(T instanceof RegExp)
              ? [T.type || "string", T.validate, (0, sn._)`${M}.validate`]
              : ["string", T, M];
          }
          function E() {
            if (typeof h == "object" && !(h instanceof RegExp) && h.async) {
              if (!u.$async) throw new Error("async format in sync schema");
              return (0, sn._)`await ${w}(${n})`;
            }
            return typeof y == "function" ? (0, sn._)`${w}(${n})` : (0, sn._)`${w}.test(${n})`;
          }
        }
      },
    };
  tJ.default = e9t;
});
var X3e = A((rJ) => {
  "use strict";
  Object.defineProperty(rJ, "__esModule", { value: !0 });
  var t9t = Z3e(),
    r9t = [t9t.default];
  rJ.default = r9t;
});
var Y3e = A((gb) => {
  "use strict";
  Object.defineProperty(gb, "__esModule", { value: !0 });
  gb.contentVocabulary = gb.metadataVocabulary = void 0;
  gb.metadataVocabulary = [
    "title",
    "description",
    "default",
    "deprecated",
    "readOnly",
    "writeOnly",
    "examples",
  ];
  gb.contentVocabulary = ["contentMediaType", "contentEncoding", "contentSchema"];
});
var Q3e = A((nJ) => {
  "use strict";
  Object.defineProperty(nJ, "__esModule", { value: !0 });
  var n9t = s3e(),
    o9t = S3e(),
    i9t = K3e(),
    s9t = X3e(),
    J3e = Y3e(),
    a9t = [
      n9t.default,
      o9t.default,
      (0, i9t.default)(),
      s9t.default,
      J3e.metadataVocabulary,
      J3e.contentVocabulary,
    ];
  nJ.default = a9t;
});
var tKe = A((NB) => {
  "use strict";
  Object.defineProperty(NB, "__esModule", { value: !0 });
  NB.DiscrError = void 0;
  var eKe;
  (function (t) {
    ((t.Tag = "tag"), (t.Mapping = "mapping"));
  })(eKe || (NB.DiscrError = eKe = {}));
});
var nKe = A((iJ) => {
  "use strict";
  Object.defineProperty(iJ, "__esModule", { value: !0 });
  var yb = gt(),
    oJ = tKe(),
    rKe = vB(),
    l9t = KR(),
    c9t = Ft(),
    u9t = {
      message: ({ params: { discrError: t, tagName: e } }) =>
        t === oJ.DiscrError.Tag
          ? `tag "${e}" must be string`
          : `value of tag "${e}" must be in oneOf`,
      params: ({ params: { discrError: t, tag: e, tagName: r } }) =>
        (0, yb._)`{error: ${t}, tag: ${r}, tagValue: ${e}}`,
    },
    d9t = {
      keyword: "discriminator",
      type: "object",
      schemaType: "object",
      error: u9t,
      code(t) {
        let { gen: e, data: r, schema: n, parentSchema: o, it: i } = t,
          { oneOf: s } = o;
        if (!i.opts.discriminator) throw new Error("discriminator: requires discriminator option");
        let a = n.propertyName;
        if (typeof a != "string") throw new Error("discriminator: requires propertyName");
        if (n.mapping) throw new Error("discriminator: mapping is not supported");
        if (!s) throw new Error("discriminator: requires oneOf keyword");
        let l = e.let("valid", !1),
          c = e.const("tag", (0, yb._)`${r}${(0, yb.getProperty)(a)}`);
        (e.if(
          (0, yb._)`typeof ${c} == "string"`,
          () => u(),
          () => t.error(!1, { discrError: oJ.DiscrError.Tag, tag: c, tagName: a }),
        ),
          t.ok(l));
        function u() {
          let f = m();
          e.if(!1);
          for (let h in f) (e.elseIf((0, yb._)`${c} === ${h}`), e.assign(l, p(f[h])));
          (e.else(),
            t.error(!1, { discrError: oJ.DiscrError.Mapping, tag: c, tagName: a }),
            e.endIf());
        }
        function p(f) {
          let h = e.name("valid"),
            v = t.subschema({ keyword: "oneOf", schemaProp: f }, h);
          return (t.mergeEvaluated(v, yb.Name), h);
        }
        function m() {
          var f;
          let h = {},
            v = w(o),
            y = !0;
          for (let E = 0; E < s.length; E++) {
            let T = s[E];
            if (T?.$ref && !(0, c9t.schemaHasRulesButRef)(T, i.self.RULES)) {
              let M = T.$ref;
              if (
                ((T = rKe.resolveRef.call(i.self, i.schemaEnv.root, i.baseId, M)),
                T instanceof rKe.SchemaEnv && (T = T.schema),
                T === void 0)
              )
                throw new l9t.default(i.opts.uriResolver, i.baseId, M);
            }
            let P = (f = T?.properties) === null || f === void 0 ? void 0 : f[a];
            if (typeof P != "object")
              throw new Error(
                `discriminator: oneOf subschemas (or referenced schemas) must have "properties/${a}"`,
              );
            ((y = y && (v || w(T))), _(P, E));
          }
          if (!y) throw new Error(`discriminator: "${a}" must be required`);
          return h;
          function w({ required: E }) {
            return Array.isArray(E) && E.includes(a);
          }
          function _(E, T) {
            if (E.const) S(E.const, T);
            else if (E.enum) for (let P of E.enum) S(P, T);
            else throw new Error(`discriminator: "properties/${a}" must have "const" or "enum"`);
          }
          function S(E, T) {
            if (typeof E != "string" || E in h)
              throw new Error(`discriminator: "${a}" values must be unique strings`);
            h[E] = T;
          }
        }
      },
    };
  iJ.default = d9t;
});
var oKe = A((STn, p9t) => {
  p9t.exports = {
    $schema: "http://json-schema.org/draft-07/schema#",
    $id: "http://json-schema.org/draft-07/schema#",
    title: "Core schema meta-schema",
    definitions: {
      schemaArray: { type: "array", minItems: 1, items: { $ref: "#" } },
      nonNegativeInteger: { type: "integer", minimum: 0 },
      nonNegativeIntegerDefault0: {
        allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }],
      },
      simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] },
      stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] },
    },
    type: ["object", "boolean"],
    properties: {
      $id: { type: "string", format: "uri-reference" },
      $schema: { type: "string", format: "uri" },
      $ref: { type: "string", format: "uri-reference" },
      $comment: { type: "string" },
      title: { type: "string" },
      description: { type: "string" },
      default: !0,
      readOnly: { type: "boolean", default: !1 },
      examples: { type: "array", items: !0 },
      multipleOf: { type: "number", exclusiveMinimum: 0 },
      maximum: { type: "number" },
      exclusiveMaximum: { type: "number" },
      minimum: { type: "number" },
      exclusiveMinimum: { type: "number" },
      maxLength: { $ref: "#/definitions/nonNegativeInteger" },
      minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
      pattern: { type: "string", format: "regex" },
      additionalItems: { $ref: "#" },
      items: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }], default: !0 },
      maxItems: { $ref: "#/definitions/nonNegativeInteger" },
      minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
      uniqueItems: { type: "boolean", default: !1 },
      contains: { $ref: "#" },
      maxProperties: { $ref: "#/definitions/nonNegativeInteger" },
      minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
      required: { $ref: "#/definitions/stringArray" },
      additionalProperties: { $ref: "#" },
      definitions: { type: "object", additionalProperties: { $ref: "#" }, default: {} },
      properties: { type: "object", additionalProperties: { $ref: "#" }, default: {} },
      patternProperties: {
        type: "object",
        additionalProperties: { $ref: "#" },
        propertyNames: { format: "regex" },
        default: {},
      },
      dependencies: {
        type: "object",
        additionalProperties: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }] },
      },
      propertyNames: { $ref: "#" },
      const: !0,
      enum: { type: "array", items: !0, minItems: 1, uniqueItems: !0 },
      type: {
        anyOf: [
          { $ref: "#/definitions/simpleTypes" },
          {
            type: "array",
            items: { $ref: "#/definitions/simpleTypes" },
            minItems: 1,
            uniqueItems: !0,
          },
        ],
      },
      format: { type: "string" },
      contentMediaType: { type: "string" },
      contentEncoding: { type: "string" },
      if: { $ref: "#" },
      then: { $ref: "#" },
      else: { $ref: "#" },
      allOf: { $ref: "#/definitions/schemaArray" },
      anyOf: { $ref: "#/definitions/schemaArray" },
      oneOf: { $ref: "#/definitions/schemaArray" },
      not: { $ref: "#" },
    },
    default: !0,
  };
});
var aJ = A((Ir, sJ) => {
  "use strict";
  Object.defineProperty(Ir, "__esModule", { value: !0 });
  Ir.MissingRefError =
    Ir.ValidationError =
    Ir.CodeGen =
    Ir.Name =
    Ir.nil =
    Ir.stringify =
    Ir.str =
    Ir._ =
    Ir.KeywordCxt =
    Ir.Ajv =
      void 0;
  var m9t = e3e(),
    f9t = Q3e(),
    h9t = nKe(),
    iKe = oKe(),
    g9t = ["/properties"],
    LB = "http://json-schema.org/draft-07/schema",
    vb = class extends m9t.default {
      _addVocabularies() {
        (super._addVocabularies(),
          f9t.default.forEach((e) => this.addVocabulary(e)),
          this.opts.discriminator && this.addKeyword(h9t.default));
      }
      _addDefaultMetaSchema() {
        if ((super._addDefaultMetaSchema(), !this.opts.meta)) return;
        let e = this.opts.$data ? this.$dataMetaSchema(iKe, g9t) : iKe;
        (this.addMetaSchema(e, LB, !1), (this.refs["http://json-schema.org/schema"] = LB));
      }
      defaultMeta() {
        return (this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(LB) ? LB : void 0));
      }
    };
  Ir.Ajv = vb;
  sJ.exports = Ir = vb;
  sJ.exports.Ajv = vb;
  Object.defineProperty(Ir, "__esModule", { value: !0 });
  Ir.default = vb;
  var y9t = VR();
  Object.defineProperty(Ir, "KeywordCxt", {
    enumerable: !0,
    get: function () {
      return y9t.KeywordCxt;
    },
  });
  var bb = gt();
  Object.defineProperty(Ir, "_", {
    enumerable: !0,
    get: function () {
      return bb._;
    },
  });
  Object.defineProperty(Ir, "str", {
    enumerable: !0,
    get: function () {
      return bb.str;
    },
  });
  Object.defineProperty(Ir, "stringify", {
    enumerable: !0,
    get: function () {
      return bb.stringify;
    },
  });
  Object.defineProperty(Ir, "nil", {
    enumerable: !0,
    get: function () {
      return bb.nil;
    },
  });
  Object.defineProperty(Ir, "Name", {
    enumerable: !0,
    get: function () {
      return bb.Name;
    },
  });
  Object.defineProperty(Ir, "CodeGen", {
    enumerable: !0,
    get: function () {
      return bb.CodeGen;
    },
  });
  var v9t = gB();
  Object.defineProperty(Ir, "ValidationError", {
    enumerable: !0,
    get: function () {
      return v9t.default;
    },
  });
  var b9t = KR();
  Object.defineProperty(Ir, "MissingRefError", {
    enumerable: !0,
    get: function () {
      return b9t.default;
    },
  });
});
var mKe = A((kl) => {
  "use strict";
  Object.defineProperty(kl, "__esModule", { value: !0 });
  kl.formatNames = kl.fastFormats = kl.fullFormats = void 0;
  function Il(t, e) {
    return { validate: t, compare: e };
  }
  kl.fullFormats = {
    date: Il(cKe, dJ),
    time: Il(cJ(!0), pJ),
    "date-time": Il(sKe(!0), dKe),
    "iso-time": Il(cJ(), uKe),
    "iso-date-time": Il(sKe(), pKe),
    duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
    uri: R9t,
    "uri-reference":
      /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
    "uri-template":
      /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
    url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
    email:
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    hostname:
      /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
    ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
    regex: D9t,
    uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
    "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
    "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
    "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
    byte: E9t,
    int32: { type: "number", validate: P9t },
    int64: { type: "number", validate: I9t },
    float: { type: "number", validate: lKe },
    double: { type: "number", validate: lKe },
    password: !0,
    binary: !0,
  };
  kl.fastFormats = {
    ...kl.fullFormats,
    date: Il(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, dJ),
    time: Il(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, pJ),
    "date-time": Il(
      /^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i,
      dKe,
    ),
    "iso-time": Il(
      /^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i,
      uKe,
    ),
    "iso-date-time": Il(
      /^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i,
      pKe,
    ),
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    email:
      /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i,
  };
  kl.formatNames = Object.keys(kl.fullFormats);
  function S9t(t) {
    return t % 4 === 0 && (t % 100 !== 0 || t % 400 === 0);
  }
  var w9t = /^(\d\d\d\d)-(\d\d)-(\d\d)$/,
    _9t = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function cKe(t) {
    let e = w9t.exec(t);
    if (!e) return !1;
    let r = +e[1],
      n = +e[2],
      o = +e[3];
    return n >= 1 && n <= 12 && o >= 1 && o <= (n === 2 && S9t(r) ? 29 : _9t[n]);
  }
  function dJ(t, e) {
    if (t && e) return t > e ? 1 : t < e ? -1 : 0;
  }
  var lJ = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function cJ(t) {
    return function (r) {
      let n = lJ.exec(r);
      if (!n) return !1;
      let o = +n[1],
        i = +n[2],
        s = +n[3],
        a = n[4],
        l = n[5] === "-" ? -1 : 1,
        c = +(n[6] || 0),
        u = +(n[7] || 0);
      if (c > 23 || u > 59 || (t && !a)) return !1;
      if (o <= 23 && i <= 59 && s < 60) return !0;
      let p = i - u * l,
        m = o - c * l - (p < 0 ? 1 : 0);
      return (m === 23 || m === -1) && (p === 59 || p === -1) && s < 61;
    };
  }
  function pJ(t, e) {
    if (!(t && e)) return;
    let r = new Date("2020-01-01T" + t).valueOf(),
      n = new Date("2020-01-01T" + e).valueOf();
    if (r && n) return r - n;
  }
  function uKe(t, e) {
    if (!(t && e)) return;
    let r = lJ.exec(t),
      n = lJ.exec(e);
    if (r && n)
      return ((t = r[1] + r[2] + r[3]), (e = n[1] + n[2] + n[3]), t > e ? 1 : t < e ? -1 : 0);
  }
  var uJ = /t|\s/i;
  function sKe(t) {
    let e = cJ(t);
    return function (n) {
      let o = n.split(uJ);
      return o.length === 2 && cKe(o[0]) && e(o[1]);
    };
  }
  function dKe(t, e) {
    if (!(t && e)) return;
    let r = new Date(t).valueOf(),
      n = new Date(e).valueOf();
    if (r && n) return r - n;
  }
  function pKe(t, e) {
    if (!(t && e)) return;
    let [r, n] = t.split(uJ),
      [o, i] = e.split(uJ),
      s = dJ(r, o);
    if (s !== void 0) return s || pJ(n, i);
  }
  var x9t = /\/|:/,
    A9t =
      /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function R9t(t) {
    return x9t.test(t) && A9t.test(t);
  }
  var aKe = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function E9t(t) {
    return ((aKe.lastIndex = 0), aKe.test(t));
  }
  var C9t = -(2 ** 31),
    T9t = 2 ** 31 - 1;
  function P9t(t) {
    return Number.isInteger(t) && t <= T9t && t >= C9t;
  }
  function I9t(t) {
    return Number.isInteger(t);
  }
  function lKe() {
    return !0;
  }
  var k9t = /[^\\]\\Z/;
  function D9t(t) {
    if (k9t.test(t)) return !1;
    try {
      return (new RegExp(t), !0);
    } catch {
      return !1;
    }
  }
});
var fKe = A((Sb) => {
  "use strict";
  Object.defineProperty(Sb, "__esModule", { value: !0 });
  Sb.formatLimitDefinition = void 0;
  var M9t = aJ(),
    fa = gt(),
    Gd = fa.operators,
    BB = {
      formatMaximum: { okStr: "<=", ok: Gd.LTE, fail: Gd.GT },
      formatMinimum: { okStr: ">=", ok: Gd.GTE, fail: Gd.LT },
      formatExclusiveMaximum: { okStr: "<", ok: Gd.LT, fail: Gd.GTE },
      formatExclusiveMinimum: { okStr: ">", ok: Gd.GT, fail: Gd.LTE },
    },
    O9t = {
      message: ({ keyword: t, schemaCode: e }) => (0, fa.str)`should be ${BB[t].okStr} ${e}`,
      params: ({ keyword: t, schemaCode: e }) =>
        (0, fa._)`{comparison: ${BB[t].okStr}, limit: ${e}}`,
    };
  Sb.formatLimitDefinition = {
    keyword: Object.keys(BB),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: O9t,
    code(t) {
      let { gen: e, data: r, schemaCode: n, keyword: o, it: i } = t,
        { opts: s, self: a } = i;
      if (!s.validateFormats) return;
      let l = new M9t.KeywordCxt(i, a.RULES.all.format.definition, "format");
      l.$data ? c() : u();
      function c() {
        let m = e.scopeValue("formats", { ref: a.formats, code: s.code.formats }),
          f = e.const("fmt", (0, fa._)`${m}[${l.schemaCode}]`);
        t.fail$data(
          (0, fa.or)(
            (0, fa._)`typeof ${f} != "object"`,
            (0, fa._)`${f} instanceof RegExp`,
            (0, fa._)`typeof ${f}.compare != "function"`,
            p(f),
          ),
        );
      }
      function u() {
        let m = l.schema,
          f = a.formats[m];
        if (!f || f === !0) return;
        if (typeof f != "object" || f instanceof RegExp || typeof f.compare != "function")
          throw new Error(`"${o}": format "${m}" does not define "compare" function`);
        let h = e.scopeValue("formats", {
          key: m,
          ref: f,
          code: s.code.formats ? (0, fa._)`${s.code.formats}${(0, fa.getProperty)(m)}` : void 0,
        });
        t.fail$data(p(h));
      }
      function p(m) {
        return (0, fa._)`${m}.compare(${r}, ${n}) ${BB[o].fail} 0`;
      }
    },
    dependencies: ["format"],
  };
  var N9t = (t) => (t.addKeyword(Sb.formatLimitDefinition), t);
  Sb.default = N9t;
});
var vKe = A((lE, yKe) => {
  "use strict";
  Object.defineProperty(lE, "__esModule", { value: !0 });
  var wb = mKe(),
    L9t = fKe(),
    mJ = gt(),
    hKe = new mJ.Name("fullFormats"),
    B9t = new mJ.Name("fastFormats"),
    fJ = (t, e = { keywords: !0 }) => {
      if (Array.isArray(e)) return (gKe(t, e, wb.fullFormats, hKe), t);
      let [r, n] = e.mode === "fast" ? [wb.fastFormats, B9t] : [wb.fullFormats, hKe],
        o = e.formats || wb.formatNames;
      return (gKe(t, o, r, n), e.keywords && (0, L9t.default)(t), t);
    };
  fJ.get = (t, e = "full") => {
    let n = (e === "fast" ? wb.fastFormats : wb.fullFormats)[t];
    if (!n) throw new Error(`Unknown format "${t}"`);
    return n;
  };
  function gKe(t, e, r, n) {
    var o, i;
    ((o = (i = t.opts.code).formats) !== null && o !== void 0) ||
      (i.formats = (0, mJ._)`require("ajv-formats/dist/formats").${n}`);
    for (let s of e) t.addFormat(s, r[s]);
  }
  yKe.exports = lE = fJ;
  Object.defineProperty(lE, "__esModule", { value: !0 });
  lE.default = fJ;
});
function i5e(t) {
  return Object.prototype.hasOwnProperty.call(JB, t) ? t : null;
}
var n5e,
  xb,
  JB,
  o5e,
  s5e,
  a5e,
  pE,
  l5e,
  c5e,
  u5e,
  d5e,
  p5e,
  Gf = g(() => {
    "use strict";
    ((n5e = require("crypto")),
      (xb = F(require("vscode"))),
      (JB = {
        content: { category: "queryGet", version: 1 },
        ping: { category: "queryGet", version: 1 },
        selections: { category: "queryGet", version: 1 },
        reload: { category: "queryGet", version: 1 },
        markForReload: { category: "queryPost", version: 1 },
        removeHighlights: { category: "mutationPost", version: 1 },
        highlightLines: { category: "mutationPost", version: 1 },
        highlight: { category: "mutationPost", version: 1 },
        setContent: { category: "mutationPost", version: 1 },
        replaceSelection: { category: "mutationPost", version: 1 },
      }),
      (o5e = Object.fromEntries(Object.entries(JB).map(([t, e]) => [t, e.version]))));
    ((s5e = `oai_pwai ${xb.env.appName}`),
      (a5e = xb.workspace.name ?? xb.env.appName),
      (pE = xb.env.appName + "-" + (0, n5e.randomUUID)()),
      (l5e = "com.microsoft.VSCode"),
      (c5e = "com.microsoft.VSCodeInsiders"),
      (u5e = "com.vscodium"),
      (d5e = "com.todesktop.230313mzl4w4u92"),
      (p5e = "com.exafunction.windsurf"));
  });
function zd(t) {
  return xJ().find((e) => e.document.fileName === t) || null;
}
function f5e() {
  return xJ()
    .map((e, r) => {
      let n = e.selection.isEmpty ? null : e.document.getText(e.selection),
        o = e.selection.isEmpty ? null : e.selection.start.line;
      return n != null && o != null ? { selectedText: n, selectionLine: o } : null;
    })
    .filter((e) => !!e);
}
function h5e() {
  return xJ()
    .map((e, r) => {
      let n = e.document.getText(),
        o = e.document.fileName,
        i = e.selection.isEmpty ? null : e.document.getText(e.selection),
        s = e.document.offsetAt(e.selection.start),
        a = e.document.offsetAt(e.selection.end),
        l = e.selection.isEmpty ? null : e.selection.start.line,
        c = e.selection.isEmpty ? null : { location: s, length: a - s };
      return (
        i === n && (i = null),
        { id: o, content: n, filename: o, selectedText: i, selectionRange: c, selectionLine: l }
      );
    })
    .filter((e) => !!e);
}
function xJ() {
  return m5e.window.visibleTextEditors.filter((e) => e.viewColumn !== void 0);
}
var m5e,
  QB = g(() => {
    "use strict";
    m5e = F(require("vscode"));
  });
function Vd(t) {
  throw new Error(`No editor for id ${t} found`);
}
var AJ = g(() => {
  "use strict";
});
async function g5e(t, e) {
  let r = zd(e);
  r || Vd(e);
  let n = r.document,
    o = new Ab.Range(n.positionAt(0), n.positionAt(n.getText().length));
  await r.edit((s) => {
    s.replace(o, t);
  });
  let i = r.document.positionAt(t.length);
  r.selection = new Ab.Selection(i, i);
}
async function y5e(t, e) {
  let r = zd(e);
  r || Vd(e);
  let n = r.selection,
    o = new Ab.Range(n.start, n.end);
  (await r.edit((i) => {
    i.replace(o, t);
  }),
    (r.selection = new Ab.Selection(o.start, o.start)));
}
var Ab,
  v5e = g(() => {
    "use strict";
    Ab = F(require("vscode"));
    QB();
    AJ();
  });
async function S5e(t, e) {
  let r = zd(e);
  r || Vd(e);
  let n = t.map((o) => {
    let i = new zi.Range(o, 0, o, r.document.lineAt(o).range.end.character);
    return w5e(i, e);
  });
  await Promise.all(n);
}
function fZt(t) {
  return new Promise((e) => setTimeout(e, t));
}
async function w5e(t, e) {
  let r = zd(e);
  (r || Vd(e), r.revealRange(t, zi.TextEditorRevealType.InCenterIfOutsideViewport));
  let n = zi.window.createTextEditorDecorationType({
    backgroundColor: `rgba(255, 255, 0, ${b5e})`,
    isWholeLine: !0,
  });
  r.setDecorations(n, [t]);
  let o = zi.workspace.onDidChangeTextDocument((i) => {
    i.document === r.document && (n.dispose(), (Wf[e] = []), o.dispose());
  });
  (Wf[e] || (Wf[e] = []), Wf[e].push({ range: t, decoration: n }));
}
async function _5e(t, e) {
  let r = zd(t);
  (r || Vd(t), mE[t] || (mE[t] = 1));
  let n = ++mE[t];
  if (e) {
    let s = (Wf[t] || []).map(async (a) => {
      let l = a.decoration,
        c = 10,
        p = 500 / c;
      try {
        for (let m = 0; m <= c && n === mE[t]; m++) {
          let f = m / c,
            h = b5e * (1 - f),
            v = zi.window.createTextEditorDecorationType({
              backgroundColor: `rgba(255, 255, 0, ${h})`,
              isWholeLine: !0,
            });
          (r.setDecorations(v, [a.range]), l?.dispose(), (l = v), await fZt(p));
        }
      } finally {
        l?.dispose();
      }
    });
    await Promise.all(s);
  }
  let o = Wf[t];
  o && n === mE[t] && (o.forEach((i) => i.decoration.dispose()), delete Wf[t]);
}
async function x5e(t, e, r) {
  let n = zd(r);
  n || Vd(r);
  let o = hZt(t, e, n.document);
  o && (await w5e(o, r));
}
function hZt(t, e, r) {
  let n = 0,
    o = 0,
    i = 0,
    s = 0,
    a = 0;
  for (let l = 0; l < r.lineCount; l++) {
    let u = r.lineAt(l).text.length + 1;
    if ((n <= t && n + u > t && ((o = l), (s = t - n)), n <= e && n + u > e)) {
      ((i = l), (a = e - n));
      break;
    }
    n += u;
  }
  if (o >= 0 && i >= 0) {
    let l = new zi.Position(o, s),
      c = new zi.Position(i, a);
    return new zi.Range(l, c);
  }
  return null;
}
var zi,
  Wf,
  mE,
  b5e,
  A5e = g(() => {
    "use strict";
    zi = F(require("vscode"));
    QB();
    AJ();
    ((Wf = {}), (mE = {}), (b5e = 0.2));
  });
async function C5e(t, e) {
  switch (t) {
    case "removeHighlights":
      try {
        let { textfieldID: r, animated: n } = e;
        return (await _5e(r, n), { status: "success", message: "Removed highlight" });
      } catch (r) {
        return { status: 400, error: JSON.stringify(r) };
      }
    case "highlightLines":
      try {
        let { lines: r, textfieldID: n } = e;
        return (await S5e(r, n), { status: "success", message: "Text highlighted successfully" });
      } catch (r) {
        return { status: 400, error: JSON.stringify(r) };
      }
    case "highlight":
      try {
        let { startChar: r, endChar: n, textfieldID: o } = e;
        return (
          await x5e(r, n, o),
          { status: "success", message: "Text highlighted successfully" }
        );
      } catch (r) {
        return { status: 400, error: JSON.stringify(r) };
      }
    case "setContent":
      try {
        let { content: r, textfieldID: n } = e;
        return (await g5e(r, n), { status: "success", message: "Set content successfully" });
      } catch (r) {
        return { status: 400, error: JSON.stringify(r) };
      }
    case "replaceSelection":
      try {
        let { content: r, textfieldID: n } = e;
        return (await y5e(r, n), { status: "success", message: "Replaced selection successfully" });
      } catch (r) {
        return { status: 400, error: JSON.stringify(r) };
      }
  }
}
var T5e = g(() => {
  "use strict";
  Gf();
  v5e();
  A5e();
});
async function P5e(t, e) {
  let r = Buffer.alloc(0),
    n = null;
  (t.on("data", async (o) => {
    if (
      ((r = Buffer.concat([r, o])),
      n == null && r.length >= 4 && ((n = r.readUInt32LE(0)), (r = r.subarray(4))),
      n != null && r.length >= n)
    ) {
      let i = r.subarray(0, n).toString();
      ((r = r.subarray(n)), (n = null), await e(t, i));
    }
  }),
    t.on("end", () => {
      _o.debug("Desktop bridge: client disconnected");
    }),
    t.on("error", (o) => {
      _o.error("Desktop bridge socket error", { safe: { error: o }, sensitive: {} });
    }));
}
function fE(t, e) {
  let r = JSON.stringify(e),
    n = Buffer.alloc(4),
    o = Buffer.byteLength(r);
  n.writeUInt32LE(o, 0);
  let i = Buffer.from(r, "utf-8");
  (t.write(n), t.write(i), t.end());
}
var RJ = g(() => {
  "use strict";
  xo();
});
function EJ() {
  return tF.join(
    k5e.homedir(),
    "Library",
    "Application Support",
    "com.openai.chat",
    "app_pairing_extensions",
    pE,
  );
}
function yZt(t) {
  let e = EJ();
  if (yn.existsSync(e)) {
    let r = yn.watch(e, (n) => {
      yn.existsSync(e) || (t(), r.close());
    });
  } else _o.warning("Desktop bridge: session path does not exist, cannot watch file.");
}
var yn,
  I5e,
  k5e,
  tF,
  eF,
  D5e = g(() => {
    "use strict";
    ((yn = F(require("fs"))),
      (I5e = F(require("net"))),
      (k5e = F(require("os"))),
      (tF = F(require("path"))));
    xo();
    Gf();
    RJ();
    eF = class {
      getSessionSocketPath() {
        return `/tmp/${pE}.sock`;
      }
      async deregister() {
        let e = EJ();
        (_o.info("Desktop bridge deregister", { safe: { sessionPath: e }, sensitive: {} }),
          yn.existsSync(e) && yn.unlinkSync(e),
          yn.existsSync(this.getSessionSocketPath()) && yn.unlinkSync(this.getSessionSocketPath()));
      }
      async register(e, r) {
        let n = EJ(),
          o = tF.dirname(n);
        (yn.existsSync(o) || yn.mkdirSync(o, { recursive: !0 }),
          yn.writeFileSync(n, JSON.stringify(e), "utf8"),
          _o.info("Desktop bridge wrote payload", { safe: { sessionPath: n }, sensitive: {} }));
        let i = this.getSessionSocketPath();
        (yn.existsSync(i)
          ? yn.chmodSync(i, 384)
          : _o.warning("Desktop bridge: socket file does not exist"),
          yZt(r));
      }
      startServer(e, r) {
        let n = this.getSessionSocketPath();
        yn.existsSync(n) && yn.unlinkSync(n);
        let o = I5e.createServer((i) => {
          (_o.debug("Desktop bridge: client connected"), P5e(i, r));
        });
        (o.listen(n, () => {
          _o.info("Desktop bridge listening on UNIX socket", {
            safe: { socketPath: n },
            sensitive: {},
          });
        }),
          e.subscriptions.push({
            dispose: () => {
              (o.close(), this.deregister());
            },
          }));
      }
    };
  });
function vZt() {
  if (M5e.platform() !== "darwin") throw new Error("Unsupported platform");
  return new eF();
}
var M5e,
  Hf,
  CJ = g(() => {
    "use strict";
    M5e = F(require("os"));
    D5e();
    Hf = vZt();
  });
function N5e() {
  switch (O5e.env.appName) {
    case "Visual Studio Code":
      return l5e;
    case "Visual Studio Code - Insiders":
      return c5e;
    case "VSCodium":
      return u5e;
    case "Cursor":
      return d5e;
    case "Devin":
    case "Devin Desktop":
    case "Windsurf":
      return p5e;
    default:
      return null;
  }
}
var O5e,
  L5e = g(() => {
    "use strict";
    O5e = F(require("vscode"));
    Gf();
  });
var bZt,
  hE,
  TJ = g(() => {
    "use strict";
    ((bZt = "0.0.1731016154"), (hE = { name: "openai.chatgpt", version: bZt, isInstalled: !0 }));
  });
function F5e(t) {
  ((B5e = t), Hf.deregister(), rF());
}
function rF() {
  let t = N5e();
  if (!t) return;
  let e = Hf.getSessionSocketPath(),
    r = {
      appName: Kd.env.appName,
      bundleID: t,
      extensionVersion: hE.version,
      marketplaceID: hE.name,
      extensionName: s5e,
      workspaceName: a5e,
      id: pE,
      capabilities: o5e,
      needsReload: B5e,
      socketPath: e,
      timestamp: Date.now(),
    };
  Hf.register(r, () => {
    let n = Kd.l10n.t("Reregister"),
      o = Kd.l10n.t("Dismiss");
    Kd.window
      .showWarningMessage(
        Kd.l10n.t("The ChatGPT extension cannot find its registration file"),
        n,
        o,
      )
      .then((i) => {
        i === n && rF();
      });
  });
}
var Kd,
  B5e,
  PJ = g(() => {
    "use strict";
    Kd = F(require("vscode"));
    L5e();
    Gf();
    CJ();
    TJ();
    B5e = !1;
  });
function U5e(t) {
  switch (t) {
    case "ping": {
      let { name: e, version: r } = hE;
      return { status: "success", version: r, name: e };
    }
    case "content": {
      let e = h5e();
      return e != null
        ? { status: "success", textfields: e }
        : { status: 400, error: "No active editor found" };
    }
    case "selections": {
      let e = f5e();
      return e != null
        ? { status: "success", selections: e }
        : { status: 400, error: "No active editor found" };
    }
    case "reload":
      return ($5e.commands.executeCommand("workbench.action.reloadWindow"), { status: "success" });
  }
}
async function q5e(t) {
  switch (t) {
    case "markForReload":
      return (F5e(!0), { status: "success", message: "Marked for reload" });
  }
}
var $5e,
  G5e = g(() => {
    "use strict";
    $5e = F(require("vscode"));
    Gf();
    QB();
    PJ();
    TJ();
  });
var z5e = {};
Ki(z5e, { activate: () => wZt, deactivate: () => _Zt, respondToCompleteMessage: () => j5e });
function wZt(t) {
  SZt === "darwin" &&
    (_o.info("ChatGPT desktop bridge active"),
    Hf.startServer(t, j5e),
    rF(),
    _o.info("Desktop bridge registered"));
}
function _Zt() {
  Hf.deregister();
}
async function j5e(t, e) {
  try {
    let r = JSON.parse(e),
      n = i5e(r.command);
    if (!n) {
      fE(t, { status: 404, error: "Unknown endpoint" });
      return;
    }
    if (!H5e.workspace.isTrusted && n !== "ping") {
      (_o.warning("Desktop bridge: untrusted workspace"),
        fE(t, {
          status: 405,
          error: "The workspace must be trusted for the extension to read content.",
        }));
      return;
    }
    let o = await xZt(n, r.payload);
    (o.status === 400 &&
      _o.error("Desktop bridge error for command", { safe: { command: r.command }, sensitive: {} }),
      fE(t, o));
  } catch (r) {
    (_o.error("Desktop bridge: error processing message", {
      safe: { error: String(r) },
      sensitive: {},
    }),
      fE(t, { success: !1, error: "Error handling message" }));
  }
}
async function xZt(t, e) {
  let { category: r } = JB[t];
  switch (r) {
    case "queryGet":
      return U5e(t);
    case "queryPost":
      return q5e(t);
    case "mutationPost":
      return C5e(t, e);
  }
}
var W5e,
  H5e,
  SZt,
  V5e = g(() => {
    "use strict";
    ((W5e = F(require("os"))), (H5e = F(require("vscode"))));
    xo();
    Gf();
    T5e();
    CJ();
    G5e();
    PJ();
    RJ();
    SZt = W5e.platform();
  });
var DZt = {};
Ki(DZt, { activate: () => IZt, deactivate: () => PZt });
module.exports = X8e(DZt);
var K5e = require("node:crypto");
O();
Pt();
var Et = F(require("vscode"));
var rHe = F(require("node:path"));
ot();
O();
Pt();
var oo = F(require("vscode"));
var p9 = F(require("node:path")),
  cf = F(require("vscode"));
async function uf({ fileNotFoundValue: t, raw: e, readUri: r }) {
  let n = !1;
  if (p9.isAbsolute(e))
    try {
      return await r(cf.Uri.file(e));
    } catch (o) {
      d9(o) || (n = !0);
    }
  for (let o of m9(e, Array.from(cf.workspace.workspaceFolders ?? [])))
    try {
      return await r(o);
    } catch (i) {
      d9(i) || (n = !0);
    }
  if (e.length > 0 && !p9.isAbsolute(e))
    try {
      let o = `**/${e.replace(/\\/g, "/")}`,
        i = await cf.workspace.findFiles(o, void 0, 1);
      if (i.length > 0) return await r(i[0]);
    } catch (o) {
      d9(o) || (n = !0);
    }
  if (t !== void 0 && !n) return t;
  throw new Error(`Unable to read file: ${e}`);
}
