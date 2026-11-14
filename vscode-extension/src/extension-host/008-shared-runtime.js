var wh = {};
Ki(wh, {
  ar: () => Y7,
  az: () => Q7,
  be: () => rQ,
  bg: () => oQ,
  bn: () => sQ,
  ca: () => lQ,
  ckb: () => uQ,
  cs: () => pQ,
  da: () => fQ,
  de: () => gQ,
  el: () => vQ,
  en: () => mT,
  eo: () => SQ,
  es: () => _Q,
  fa: () => AQ,
  fi: () => EQ,
  fr: () => TQ,
  frCA: () => IQ,
  gu: () => DQ,
  he: () => OQ,
  hi: () => LQ,
  hr: () => FQ,
  hu: () => UQ,
  hy: () => WQ,
  id: () => jQ,
  is: () => VQ,
  it: () => ZQ,
  ja: () => YQ,
  ka: () => QQ,
  kh: () => tee,
  km: () => fT,
  kn: () => nee,
  ko: () => iee,
  lt: () => lee,
  mk: () => uee,
  ms: () => pee,
  ne: () => fee,
  nl: () => gee,
  nn: () => vee,
  no: () => See,
  ota: () => _ee,
  pl: () => Eee,
  ps: () => Aee,
  pt: () => Tee,
  ptBR: () => Iee,
  ro: () => Dee,
  ru: () => Nee,
  sk: () => Bee,
  sl: () => $ee,
  sv: () => qee,
  ta: () => Wee,
  tg: () => jee,
  th: () => Vee,
  tk: () => Zee,
  tr: () => Yee,
  ua: () => Qee,
  uk: () => hT,
  ur: () => tte,
  uz: () => nte,
  vi: () => ite,
  yo: () => dte,
  zhCN: () => ate,
  zhTW: () => cte,
});
var gT = g(() => {
  J7();
  eQ();
  nQ();
  iQ();
  aQ();
  cQ();
  dQ();
  mQ();
  hQ();
  yQ();
  bQ();
  Y1();
  wQ();
  xQ();
  RQ();
  CQ();
  PQ();
  kQ();
  MQ();
  NQ();
  BQ();
  $Q();
  qQ();
  HQ();
  zQ();
  KQ();
  XQ();
  JQ();
  eee();
  ree();
  J1();
  oee();
  see();
  cee();
  dee();
  mee();
  hee();
  yee();
  bee();
  wee();
  xee();
  Ree();
  Cee();
  Pee();
  kee();
  Mee();
  Lee();
  Fee();
  Uee();
  Gee();
  Hee();
  zee();
  Kee();
  Xee();
  Jee();
  ete();
  Q1();
  rte();
  ote();
  ste();
  lte();
  ute();
  pte();
});
function vT() {
  return new yT();
}
var mte,
  e$,
  t$,
  yT,
  zn,
  rS = g(() => {
    ((e$ = Symbol("ZodOutput")),
      (t$ = Symbol("ZodInput")),
      (yT = class {
        constructor() {
          ((this._map = new WeakMap()), (this._idmap = new Map()));
        }
        add(e, ...r) {
          let n = r[0];
          return (
            this._map.set(e, n),
            n && typeof n == "object" && "id" in n && this._idmap.set(n.id, e),
            this
          );
        }
        clear() {
          return ((this._map = new WeakMap()), (this._idmap = new Map()), this);
        }
        remove(e) {
          let r = this._map.get(e);
          return (
            r && typeof r == "object" && "id" in r && this._idmap.delete(r.id),
            this._map.delete(e),
            this
          );
        }
        get(e) {
          let r = e._zod.parent;
          if (r) {
            let n = { ...(this.get(r) ?? {}) };
            delete n.id;
            let o = { ...n, ...this._map.get(e) };
            return Object.keys(o).length ? o : void 0;
          }
          return this._map.get(e);
        }
        has(e) {
          return this._map.has(e);
        }
      }));
    (mte = globalThis).__zod_globalRegistry ?? (mte.__zod_globalRegistry = vT());
    zn = globalThis.__zod_globalRegistry;
  });
function xXe(t, e) {
  try {
    return ST(t, { assertOnly: !0 });
  } catch {
    return e;
  }
}
function i$(t, e) {
  try {
    let r = ST(t),
      n = bT(t, r);
    return ((n._zod.bag.validator = xXe(t, r)), n);
  } catch (r) {
    if (e?.strict) throw r;
    return t;
  }
}
function bT(t, e) {
  if (dT(t)) throw new xt("a schema whose subtree contains a reference cycle");
  let r = Wt(t),
    n = t._zod.run,
    o = n.__originalRun ?? n,
    i = (s, a) => {
      if (
        a?.async ||
        a?.direction === "backward" ||
        a?.skipChecks ||
        a?.[fte] ||
        (a && pT(a, s.value))
      )
        return o(s, a);
      let l = e(s.value);
      return l !== Io ? ((s.value = l), s) : (a && (a[fte] = !0), o(s, a));
    };
  return (
    (i.__originalRun = o),
    (r._zod.bag.fallbackRun = o),
    (r._zod.bag.validator = e),
    (r._zod.run = i),
    n.__originalRun || AXe(r, t, e),
    r
  );
}
function AXe(t, e, r) {
  let n = t,
    o = e;
  if (typeof o.safeParse == "function") {
    let i = o.safeParse;
    n.safeParse = (s, a) => {
      let l = r(s);
      return l !== Io ? { success: !0, data: l } : i(s, a);
    };
  }
  if (typeof o.parse == "function") {
    let i = o.parse;
    n.parse = (s, a) => {
      let l = r(s);
      return l !== Io ? l : i(s, a);
    };
  }
}
function ST(t, e) {
  let r = !0;
  try {
    r = dT(t);
  } catch {}
  if (r) throw new xt("a schema whose subtree contains a reference cycle");
  let n = { constants: new Map(), constantCounter: 0, varCounter: 0, definite: !0 },
    o = new ip(["input"]),
    i = Dr(o, n, t, "input", !e?.assertOnly);
  o.write(i === null ? "return true;" : `return ${i};`);
  let s = ["INVALID", ...n.constants.keys()],
    a = [Io, ...n.constants.values()],
    l = o.content.join(`
`),
    c = e?.debug
      ? s.length > 0
        ? `// Constants: ${s.join(", ")}
${l}`
        : l
      : "",
    u = Function,
    p = `return (input) => {
${l}
}`,
    m;
  try {
    m = new u(...s, p)(...a);
  } catch (f) {
    throw new xt(`this schema (generated code failed to evaluate: ${f.message})`);
  }
  return (e?.debug && (m.code = c), (m.definite = n.definite), m);
}
function Ke(t, e) {
  for (let [n, o] of t.constants) if (o === e) return n;
  let r = `c${t.constantCounter++}`;
  return (t.constants.set(r, e), r);
}
function ap(t, e) {
  return ((t.definite = !1), Ke(t, e));
}
function Fe(t) {
  return `v${t.varCounter++}`;
}
function RXe(t, e) {
  let r = t._zod.run({ value: e, issues: [] }, {});
  if (r && typeof r.then == "function") return Io;
  let n = r;
  return n.issues.length === 0 ? n.value : Io;
}
function uo(t, e, r, n, o = !0) {
  let i = t.content.length,
    s = e.constants.size,
    a = e.constantCounter,
    l = e.varCounter;
  try {
    return Dr(t, e, r, n, o);
  } catch (c) {
    if (!(c instanceof xt) || !c.islandable) throw c;
    if (((t.content.length = i), e.constants.size > s)) {
      let u = Array.from(e.constants.keys()).slice(s);
      for (let p of u) e.constants.delete(p);
    }
    return ((e.constantCounter = a), (e.varCounter = l), EXe(t, e, r, n));
  }
}
function EXe(t, e, r, n) {
  e.definite = !1;
  let o = Ke(e, r),
    i = Ke(e, RXe),
    s = Fe(e);
  return (
    t.write(`const ${s} = ${i}(${o}, ${n});`),
    t.write(`if (${s} === INVALID) return INVALID;`),
    s
  );
}
function TXe(t, e, r, n) {
  let o = r._zod.def.checks;
  if (!o || o.length === 0) return n;
  let i = n;
  for (let s of o) {
    let a = s._zod.def;
    if (a.when && !CXe.has(a.check)) throw new xt('check with a custom "when" condition');
    switch (a.check) {
      case "greater_than":
        PXe(t, e, a, i);
        break;
      case "less_than":
        IXe(t, e, a, i);
        break;
      case "multiple_of":
        kXe(t, e, a, i);
        break;
      case "number_format":
        Ste(t, a, i);
        break;
      case "min_length": {
        let l = Kc(a.minimum, "min_length"),
          c = r$(t, e, i, `${i}.length >= ${l} && ${i}.length < ${a.minimum * 2}`);
        t.write(`if (${c} < ${l}) return INVALID;`);
        break;
      }
      case "max_length": {
        let l = Kc(a.maximum, "max_length"),
          c = r$(t, e, i, `${i}.length > ${l}`);
        t.write(`if (${c} > ${l}) return INVALID;`);
        break;
      }
      case "length_equals": {
        let l = Kc(a.length, "length_equals"),
          c = r$(t, e, i, `${i}.length >= ${l} && ${i}.length <= ${a.length * 2}`);
        t.write(`if (${c} !== ${l}) return INVALID;`);
        break;
      }
      case "min_size":
        t.write(`if (${i}.size < ${Kc(a.minimum, "min_size")}) return INVALID;`);
        break;
      case "max_size":
        t.write(`if (${i}.size > ${Kc(a.maximum, "max_size")}) return INVALID;`);
        break;
      case "size_equals":
        t.write(`if (${i}.size !== ${Kc(a.size, "size_equals")}) return INVALID;`);
        break;
      case "string_format":
        i = wte(t, e, a, i);
        break;
      case "custom":
        i = BXe(t, e, s, i);
        break;
      case "bigint_format":
        DXe(t, a, i);
        break;
      case "mime_type":
        MXe(t, e, a, i);
        break;
      case "property":
        NXe(t, e, a, i);
        break;
      case "properties":
        OXe(t, e, a, i);
        break;
      case "overwrite": {
        let l = Fe(e);
        (LXe(t, e, s, i, l), (i = l));
        break;
      }
      default:
        throw new xt(`check type ${a.check}`);
    }
  }
  return i;
}
function r$(t, e, r, n) {
  let o = Ke(e, ep),
    i = Fe(e);
  return (t.write(`const ${i} = typeof ${r} === "string" && ${n} ? ${o}(${r}) : ${r}.length;`), i);
}
function Kc(t, e) {
  if (typeof t != "number" || !Number.isFinite(t)) throw new xt(`${e} bound of type ${typeof t}`);
  return `${t}`;
}
function bte(t, e) {
  if (typeof e == "bigint") return `${e}n`;
  if (typeof e == "number") {
    if (Number.isNaN(e)) throw new xt("comparison check with NaN bound");
    return `${e}`;
  }
  if (e instanceof Date) {
    if (Number.isNaN(e.getTime())) throw new xt("comparison check with Invalid Date bound");
    return Ke(t, e);
  }
  throw new xt(`comparison check bound of type ${typeof e}`);
}
function PXe(t, e, r, n) {
  let o = r.inclusive ? "<" : "<=";
  t.write(`if (${n} ${o} ${bte(e, r.value)}) return INVALID;`);
}
function IXe(t, e, r, n) {
  let o = r.inclusive ? ">" : ">=";
  t.write(`if (${n} ${o} ${bte(e, r.value)}) return INVALID;`);
}
function kXe(t, e, r, n) {
  if (typeof r.value == "bigint") {
    if (r.value === BigInt(0)) throw new xt("multiple_of check with a zero divisor");
    t.write(`if (${n} % ${r.value}n !== 0n) return INVALID;`);
  } else {
    let o = Ke(e, Tb);
    t.write(`if (${o}(${n}, ${Kc(r.value, "multiple_of")}) !== 0) return INVALID;`);
  }
}
function Ste(t, e, r) {
  let n = e.format;
  switch (n) {
    case "safeint":
      t.write(`if (!Number.isSafeInteger(${r})) return INVALID;`);
      break;
    case "int32":
      t.write(
        `if (!Number.isInteger(${r}) || ${r} < -2147483648 || ${r} > 2147483647) return INVALID;`,
      );
      break;
    case "uint32":
      t.write(`if (!Number.isInteger(${r}) || ${r} < 0 || ${r} > 4294967295) return INVALID;`);
      break;
    case "float32":
      t.write(
        `if (!Number.isFinite(${r}) || ${r} < -3.4028234663852886e38 || ${r} > 3.4028234663852886e38) return INVALID;`,
      );
      break;
    case "float64":
      t.write(`if (!Number.isFinite(${r})) return INVALID;`);
      break;
    default:
      throw new xt(`number format ${n}`);
  }
}
function DXe(t, e, r) {
  let n = e.format;
  if (n)
    switch (n) {
      case "int64":
        t.write(`if (${r} < -9223372036854775808n || ${r} > 9223372036854775807n) return INVALID;`);
        break;
      case "uint64":
        t.write(`if (${r} < 0n || ${r} > 18446744073709551615n) return INVALID;`);
        break;
      default:
        throw new xt(`bigint format ${n}`);
    }
}
function MXe(t, e, r, n) {
  let o = r.mime;
  if (o && o.length > 0) {
    let i = Ke(e, new Set(o));
    t.write(`if (!${i}.has(${n}.type)) return INVALID;`);
  }
}
function OXe(t, e, r, n) {
  if (r.when) throw new xt('check with a custom "when" condition');
  t.write(`if (${n} == null) return INVALID;`);
  let o = r.shape;
  for (let i of Reflect.ownKeys(o)) {
    let s = typeof i == "symbol" ? Ke(e, i) : To(i),
      a = Fe(e);
    (t.write(`const ${a} = ${n}[${s}];`), uo(t, e, o[i], a, !1));
  }
}
function NXe(t, e, r, n) {
  let o = `${n}[${JSON.stringify(r.property)}]`;
  Dr(t, e, r.schema, o);
}
function LXe(t, e, r, n, o) {
  let i = r._zod.def.tx;
  if (!i) throw new xt("overwrite check without a transform function");
  if (lp(i)) throw new Cs("z.compile: async overwrite transforms are not supported");
  let s = Ke(e, i);
  t.write(`const ${o} = ${s}(${n});`);
}
function n$() {
  throw new Yo();
}
function s$(t) {
  this.issues.push(t);
}
function BXe(t, e, r, n) {
  let o = r._zod.def;
  if (o.fn) {
    if (lp(o.fn)) throw new Cs("z.compile: async .refine() predicates are not supported");
    let i = ap(e, o.fn),
      s = Ke(e, n$),
      a = Fe(e);
    return (
      t.write(`const ${a} = ${i}(${n});`),
      t.write(`if (${a} instanceof Promise) ${s}();`),
      t.write(`if (!${a}) return INVALID;`),
      n
    );
  }
  if (r._zod.check) {
    if (lp(r._zod.check))
      throw new Cs("z.compile: async .superRefine() / check functions are not supported");
    let i = r._zod.check,
      a = ap(e, (c) => {
        let u = { value: c, issues: [], addIssue: s$ };
        return (i(u) instanceof Promise && n$(), u.issues.length === 0 ? u.value : Io);
      }),
      l = Fe(e);
    return (
      t.write(`const ${l} = ${a}(${n});`),
      t.write(`if (${l} === INVALID) return INVALID;`),
      l
    );
  }
  throw new xt("custom check without a predicate or check function");
}
function wte(t, e, r, n, o = !0) {
  let i = r.format;
  if (i === "base64") {
    let c = Ke(e, jb);
    return (t.write(`if (!${c}(${n})) return INVALID;`), n);
  }
  if (i === "base64url") {
    let c = Ke(e, gC);
    return (t.write(`if (!${c}(${n})) return INVALID;`), n);
  }
  if (i === "jwt") {
    let c = Ke(e, xC),
      u = Ke(e, r.alg ?? null);
    return (t.write(`if (!${c}(${n}, ${u})) return INVALID;`), n);
  }
  if (i === "ipv6") {
    let c = Ke(e, Hb);
    return (t.write(`if (!${c}(${n})) return INVALID;`), n);
  }
  if (i === "cidrv6") {
    let c = Ke(e, pC);
    return (t.write(`if (!${c}(${n})) return INVALID;`), n);
  }
  if (i === "credit_card") {
    let c = Ke(e, bC);
    return (t.write(`if (!${c}(${n})) return INVALID;`), n);
  }
  if (i === "iban") {
    let c = Ke(e, wC);
    return (t.write(`if (!${c}(${n})) return INVALID;`), n);
  }
  let s = r;
  if (
    i === "url" ||
    i === "httpurl" ||
    s.normalize ||
    s.hostname !== void 0 ||
    s.protocol !== void 0
  ) {
    let c = Ke(e, YE),
      u = Ke(e, r),
      p = Fe(e),
      m = Fe(e);
    if (
      (t.write(`const ${p} = ${n}.trim();`),
      t.write(`const ${m} = ${c}(${p}, ${u});`),
      t.write(`if (typeof ${m} === "number") return INVALID;`),
      s.hostname !== void 0)
    ) {
      let v = Ke(e, JE);
      t.write(`if (!${v}(${m}, ${u}.hostname)) return INVALID;`);
    }
    if (s.protocol !== void 0) {
      let v = Ke(e, QE);
      t.write(`if (!${v}(${m}, ${u}.protocol)) return INVALID;`);
    }
    if (!o) return null;
    let f = Fe(e),
      h = s.normalize ? `${m}.href` : `${Ke(e, Wb)}(${p})`;
    return (t.write(`const ${f} = ${h};`), f);
  }
  let a = r.fn;
  if (a) {
    if (lp(a)) throw new xt(`async string format ${i}`);
    let c = Ke(e, a);
    return (t.write(`if (!${c}(${n})) return INVALID;`), n);
  }
  if (FXe.has(i) && r.pattern) {
    let c = Ke(e, r.pattern);
    return (t.write(`${c}.lastIndex = 0;`), t.write(`if (!${c}.test(${n})) return INVALID;`), n);
  }
  let l = r.format;
  switch (l) {
    case "regex":
      throw new xt("regex format without a pattern");
    case "lowercase":
      t.write(`if (${n} !== ${n}.toLowerCase()) return INVALID;`);
      break;
    case "uppercase":
      t.write(`if (${n} !== ${n}.toUpperCase()) return INVALID;`);
      break;
    case "includes":
      t.write(`if (!${n}.includes(${To(r.includes)})) return INVALID;`);
      break;
    case "starts_with": {
      let c = r.prefix;
      t.write(`if (${n}.slice(0, ${c.length}) !== ${To(c)}) return INVALID;`);
      break;
    }
    case "ends_with": {
      let c = r.suffix;
      t.write(`if (${n}.slice(-${c.length}) !== ${To(c)}) return INVALID;`);
      break;
    }
    default:
      throw new xt(`string format ${l}`);
  }
  return n;
}
function Dr(t, e, r, n, o = !0) {
  let i = r._zod.def,
    s = i.type;
  if (i.coerce) throw new xt(`coercion (z.coerce.${s}())`);
  let a = o || !!i.checks?.length,
    l;
  switch (s) {
    case "string":
      l = $Xe(t, e, r, n, a);
      break;
    case "number":
      l = UXe(t, r, n);
      break;
    case "boolean":
      l = qXe(t, n);
      break;
    case "bigint":
      l = GXe(t, r, n);
      break;
    case "symbol":
      l = WXe(t, n);
      break;
    case "undefined":
      l = HXe(t, n);
      break;
    case "null":
      l = jXe(t, n);
      break;
    case "any":
    case "unknown":
      l = n;
      break;
    case "never":
      (t.write("return INVALID;"), (l = n));
      break;
    case "void":
      l = zXe(t, n);
      break;
    case "nan":
      l = VXe(t, n);
      break;
    case "date":
      l = KXe(t, n);
      break;
    case "object":
      l = ZXe(t, e, r, n, a);
      break;
    case "optional":
      l = XXe(t, e, r, n, a);
      break;
    case "nullable":
      l = QXe(t, e, r, n, a);
      break;
    case "array":
      l = eYe(t, e, r, n, a);
      break;
    case "literal":
      l = tYe(t, e, r, n);
      break;
    case "enum":
      l = rYe(t, e, r, n);
      break;
    case "readonly": {
      let c = gte(t, e, r, n),
        u = Fe(e);
      (t.write(`const ${u} = Object.freeze(${c});`), (l = u));
      break;
    }
    case "success":
      (gte(t, e, r, n), (l = "true"));
      break;
    case "default":
    case "prefault":
      l = nYe(t, e, r, n);
      break;
    case "nonoptional":
      l = oYe(t, e, r, n);
      break;
    case "tuple":
      l = iYe(t, e, r, n);
      break;
    case "union":
      l = sYe(t, e, r, n);
      break;
    case "intersection":
      l = cYe(t, e, r, n);
      break;
    case "record":
      l = uYe(t, e, r, n);
      break;
    case "map":
      l = pYe(t, e, r, n);
      break;
    case "set":
      l = mYe(t, e, r, n);
      break;
    case "file":
      l = fYe(t, n);
      break;
    case "template_literal":
      l = hYe(t, e, r, n);
      break;
    case "lazy":
      l = gYe(t, e, r, n);
      break;
    case "pipe":
      l = yYe(t, e, r, n);
      break;
    case "custom":
      l = vYe(t, e, r, n);
      break;
    case "transform":
      l = wYe(t, e, r, n);
      break;
    case "catch":
      l = SYe(t, e, r, n);
      break;
    default:
      throw new xt(`schema type ${s}`);
  }
  return l === null ? null : TXe(t, e, r, l);
}
function $Xe(t, e, r, n, o = !0) {
  t.write(`if (typeof ${n} !== "string") return INVALID;`);
  let i = r._zod.def;
  return i.format === void 0 ? n : wte(t, e, i, n, o);
}
function UXe(t, e, r) {
  t.write(`if (typeof ${r} !== "number" || !Number.isFinite(${r})) return INVALID;`);
  let n = e._zod.def;
  return (n.check === "number_format" && n.format && Ste(t, { format: n.format }, r), r);
}
function qXe(t, e) {
  return (t.write(`if (typeof ${e} !== "boolean") return INVALID;`), e);
}
function GXe(t, e, r) {
  t.write(`if (typeof ${r} !== "bigint") return INVALID;`);
  let n = e._zod.def;
  if (n.format)
    switch (n.format) {
      case "int64":
        t.write(`if (${r} < -9223372036854775808n || ${r} > 9223372036854775807n) return INVALID;`);
        break;
      case "uint64":
        t.write(`if (${r} < 0n || ${r} > 18446744073709551615n) return INVALID;`);
        break;
    }
  return r;
}
function WXe(t, e) {
  return (t.write(`if (typeof ${e} !== "symbol") return INVALID;`), e);
}
function HXe(t, e) {
  return (t.write(`if (${e} !== undefined) return INVALID;`), e);
}
function jXe(t, e) {
  return (t.write(`if (${e} !== null) return INVALID;`), e);
}
function zXe(t, e) {
  return (t.write(`if (${e} !== undefined) return INVALID;`), e);
}
function VXe(t, e) {
  return (t.write(`if (typeof ${e} !== "number" || !Number.isNaN(${e})) return INVALID;`), e);
}
function KXe(t, e) {
  return (
    t.write(`if (!(${e} instanceof Date) || Number.isNaN(${e}.getTime())) return INVALID;`),
    e
  );
}
function ZXe(t, e, r, n, o = !0) {
  let i = r._zod.def;
  t.write(`if (typeof ${n} !== "object" || ${n} === null || Array.isArray(${n})) return INVALID;`);
  let s = i.shape,
    a = Object.keys(s),
    l = Object.getOwnPropertySymbols(s),
    c = l.length ? [...a, ...l] : a,
    u = (_) => (typeof _ == "symbol" ? Ke(e, _) : To(_)),
    p = (_) => (typeof _ == "symbol" ? `[${u(_)}]` : To(_)),
    m = s;
  if (a.includes("__proto__")) throw new xt('object shape key "__proto__"');
  let f = new Map();
  for (let _ of c) {
    let S = m[_],
      E = u(_),
      T = Fe(e);
    if ((t.write(`const ${T} = ${n}[${E}];`), S._zod.optin !== void 0)) {
      let P = Fe(e);
      (t.write(`let ${P} = (() => {`),
        t.indented((M) => {
          let L = uo(M, e, S, T);
          M.write(`return ${L};`);
        }),
        t.write("})();"),
        S._zod.optout === "optional"
          ? (t.write(`if (${P} === INVALID) {`),
            t.indented((M) => {
              (M.write(`if (${E} in ${n}) return INVALID;`), M.write(`${P} = undefined;`));
            }),
            t.write("}"))
          : t.write(`if (${P} === INVALID) return INVALID;`),
        f.set(_, P));
    } else {
      JXe(S) && t.write(`if (!(${E} in ${n})) return INVALID;`);
      let P = uo(t, e, S, T, o);
      P !== null && f.set(_, P);
    }
  }
  let h = i.catchall,
    v = "none";
  if (h) {
    let _ = h._zod.def.type;
    if (_ === "never") {
      let S = a.map((E) => `k !== ${To(E)}`).join(" && ") || "true";
      (t.write(`for (const k in ${n}) {`),
        t.indented((E) => {
          E.write(`if (${S}) return INVALID;`);
        }),
        t.write("}"));
    } else
      (_ === "unknown" || _ === "any") && !h._zod.def.checks?.length
        ? (v = "passthrough")
        : (v = "schema");
  }
  let y = Fe(e),
    w = c.some((_) => hte(m[_]) || o$(m[_]));
  if (!o) {
    if (v === "schema") {
      let _ = a.length > 0 ? Ke(e, new Set(a)) : null;
      (t.write(`for (const k in ${n}) {`),
        t.indented((S) => {
          (S.write('if (k === "__proto__") continue;'), _ && S.write(`if (${_}.has(k)) continue;`));
          let E = Fe(e);
          (S.write(`const ${E} = ${n}[k];`), uo(S, e, h, E, !1));
        }),
        t.write("}"));
    }
    return null;
  }
  if (w) {
    t.write(`const ${y} = {};`);
    for (let _ of c) {
      let S = u(_),
        E = f.get(_);
      o$(m[_])
        ? t.write(`if (${S} in ${n}) ${y}[${S}] = ${E};`)
        : hte(m[_])
          ? t.write(`if (${E} !== undefined || ${S} in ${n}) ${y}[${S}] = ${E};`)
          : t.write(`${y}[${S}] = ${E};`);
    }
  } else {
    let _ = c.map((S) => `${p(S)}: ${f.get(S)}`).join(", ");
    t.write(`const ${y} = { ${_} };`);
  }
  if (v !== "none") {
    let _ = a.length > 0 ? Ke(e, new Set(a)) : null;
    (t.write(`for (const k in ${n}) {`),
      t.indented((S) => {
        if (
          (S.write('if (k === "__proto__") continue;'),
          _ && S.write(`if (${_}.has(k)) continue;`),
          v === "passthrough")
        )
          S.write(`${y}[k] = ${n}[k];`);
        else {
          let E = Fe(e);
          S.write(`const ${E} = ${n}[k];`);
          let T = uo(S, e, h, E);
          S.write(`${y}[k] = ${T};`);
        }
      }),
      t.write("}"));
  }
  return y;
}
function XXe(t, e, r, n, o = !0) {
  let i = r._zod.def;
  if (YXe(r)) return Dr(t, e, i.innerType, n, o);
  if (i.innerType._zod.optin === "defaulted") {
    let a = Fe(e),
      l = Fe(e);
    return (
      t.write(`let ${a};`),
      t.write(`if (${n} === undefined) {`),
      t.indented((c) => {
        (c.write(`const ${l} = (() => {`),
          c.indented((u) => {
            let p = Dr(u, e, i.innerType, n);
            u.write(`return ${p};`);
          }),
          c.write("})();"),
          c.write(`if (${l} !== INVALID) ${a} = ${l};`));
      }),
      t.write("} else {"),
      t.indented((c) => {
        let u = Dr(c, e, i.innerType, n);
        c.write(`${a} = ${u};`);
      }),
      t.write("}"),
      a
    );
  }
  let s = o ? Fe(e) : null;
  return (
    s && t.write(`let ${s};`),
    t.write(`if (${n} !== undefined) {`),
    t.indented((a) => {
      let l = Dr(a, e, i.innerType, n, o);
      s && l !== null && a.write(`${s} = ${l};`);
    }),
    t.write("}"),
    s
  );
}
function YXe(t) {
  return t._zod.traits?.has("$ZodExactOptional") === !0;
}
function JXe(t) {
  return t._zod.optin === void 0 && sp(t);
}
function sp(t) {
  if (t._zod.def.coerce) return !0;
  let e = t._zod.def;
  switch (e.type) {
    case "any":
    case "unknown":
    case "undefined":
    case "void":
    case "default":
    case "prefault":
    case "transform":
    case "custom":
    case "lazy":
      return !0;
    case "string":
    case "number":
    case "boolean":
    case "bigint":
    case "symbol":
    case "null":
    case "never":
    case "nan":
    case "date":
    case "object":
    case "array":
    case "tuple":
    case "record":
    case "map":
    case "set":
    case "file":
    case "template_literal":
      return !1;
    case "nonoptional":
      return e.innerType ? sp(e.innerType) : !1;
    case "literal":
      return !!e.values?.includes(void 0);
    case "enum":
      return !!t._zod.values?.has(void 0);
    case "optional":
    case "nullable":
    case "readonly":
    case "success":
      return e.innerType ? sp(e.innerType) : !0;
    case "catch":
      return !0;
    case "union":
      return e.options ? e.options.some(sp) : !0;
    case "intersection":
      return !e.left || !e.right ? !0 : sp(e.left) && sp(e.right);
    case "pipe":
      return e.in ? sp(e.in) : !0;
    default:
      return !0;
  }
}
function o$(t) {
  return t._zod.optin === "optional" && t._zod.optout === "optional";
}
function hte(t) {
  return (t._zod.optin !== "defaulted" || t._zod.optout === "optional") && _h(t);
}
function _h(t) {
  let e = t._zod.def;
  switch (e.type) {
    case "string":
    case "number":
    case "boolean":
    case "bigint":
    case "symbol":
    case "null":
    case "nan":
    case "date":
    case "object":
    case "array":
    case "tuple":
    case "record":
    case "map":
    case "set":
    case "file":
    case "template_literal":
    case "never":
    case "success":
      return !1;
    case "literal":
      return !!e.values?.includes(void 0);
    case "enum":
      return !!t._zod.values?.has(void 0);
    case "optional":
      return !0;
    case "nullable":
    case "readonly":
    case "nonoptional":
      return e.innerType ? _h(e.innerType) : !0;
    case "union":
      return e.options ? e.options.some(_h) : !0;
    case "intersection":
      return !e.left || !e.right || _h(e.left) || _h(e.right);
    case "pipe":
      return e.out ? _h(e.out) : !0;
    default:
      return !0;
  }
}
function QXe(t, e, r, n, o = !0) {
  let i = r._zod.def,
    s = o ? Fe(e) : null;
  return (
    s && t.write(`let ${s} = null;`),
    t.write(`if (${n} !== null) {`),
    t.indented((a) => {
      let l = Dr(a, e, i.innerType, n, o);
      s && l !== null && a.write(`${s} = ${l};`);
    }),
    t.write("}"),
    s
  );
}
function a$(t, e, r) {
  for (let [n, o] of rh(e._zod.def.checks))
    t.write(`if (${r} > ${Kc(n, o._zod.def.check)}) return INVALID;`);
}
function eYe(t, e, r, n, o = !0) {
  let i = r._zod.def;
  (t.write(`if (!Array.isArray(${n})) return INVALID;`), a$(t, r, `${n}.length`));
  let s = o ? Fe(e) : null,
    a = Fe(e),
    l = Fe(e);
  return (
    s && t.write(`const ${s} = new Array(${n}.length);`),
    t.write(`for (let ${a} = 0; ${a} < ${n}.length; ${a}++) {`),
    t.indented((c) => {
      c.write(`const ${l} = ${n}[${a}];`);
      let u = uo(c, e, i.element, l, o);
      s && u !== null && c.write(`${s}[${a}] = ${u};`);
    }),
    t.write("}"),
    s
  );
}
function tYe(t, e, r, n) {
  let i = r._zod.def.values;
  if (i.length !== 1) {
    let a = Ke(e, new Set(i));
    return (t.write(`if (!${a}.has(${n})) return INVALID;`), n);
  }
  let s = i[0];
  if (typeof s == "number" && Number.isNaN(s)) {
    let a = Ke(e, new Set(i));
    return (t.write(`if (!${a}.has(${n})) return INVALID;`), n);
  }
  if (typeof s == "string") t.write(`if (${n} !== ${To(s)}) return INVALID;`);
  else if (typeof s == "number" || typeof s == "boolean")
    t.write(`if (${n} !== ${s}) return INVALID;`);
  else if (s === null) t.write(`if (${n} !== null) return INVALID;`);
  else if (s === void 0) t.write(`if (${n} !== undefined) return INVALID;`);
  else if (typeof s == "bigint") t.write(`if (${n} !== ${s}n) return INVALID;`);
  else throw new xt(`literal type ${typeof s}`);
  return n;
}
function rYe(t, e, r, n) {
  let o = r._zod.values;
  if (!o) throw new xt("enum schema without enumerated values");
  let i = Ke(e, o);
  return (t.write(`if (!${i}.has(${n})) return INVALID;`), n);
}
function gte(t, e, r, n) {
  let o = r._zod.def;
  return Dr(t, e, o.innerType, n);
}
function nYe(t, e, r, n) {
  let o = r._zod.def,
    s = Object.getOwnPropertyDescriptor(r._zod.def, "defaultValue")
      ? () => r._zod.def.defaultValue
      : void 0;
  if (r._zod.def.type === "prefault") {
    if (!s) return Dr(t, e, o.innerType, n);
    let l = Ke(e, s),
      c = Fe(e);
    return (
      t.write(`let ${c} = ${n};`),
      t.write(`if (${n} === undefined) ${c} = ${l}();`),
      Dr(t, e, o.innerType, c)
    );
  }
  let a = Fe(e);
  if (s) {
    let l = Ke(e, s),
      c = Ke(e, th);
    (t.write(`let ${a};`),
      t.write(`if (${n} === undefined) {`),
      t.indented((u) => {
        u.write(`${a} = ${c}(${l}());`);
      }),
      t.write("} else {"),
      t.indented((u) => {
        let p = Dr(u, e, o.innerType, n);
        u.write(`${a} = ${p} === undefined ? ${c}(${l}()) : ${p};`);
      }),
      t.write("}"));
  } else
    (t.write(`let ${a};`),
      t.write(`if (${n} !== undefined) {`),
      t.indented((l) => {
        let c = Dr(l, e, o.innerType, n);
        l.write(`${a} = ${c};`);
      }),
      t.write("}"));
  return a;
}
function oYe(t, e, r, n) {
  let o = r._zod.def,
    i = Dr(t, e, o.innerType, n),
    s = Fe(e);
  return (t.write(`const ${s} = ${i};`), t.write(`if (${s} === undefined) return INVALID;`), s);
}
function iYe(t, e, r, n) {
  let o = r._zod.def,
    i = o.items,
    s = o.rest;
  t.write(`if (!Array.isArray(${n})) return INVALID;`);
  let a = yte(i, "optin"),
    l = yte(i, "optout");
  s
    ? t.write(`if (${n}.length < ${a}) return INVALID;`)
    : t.write(`if (${n}.length < ${a} || ${n}.length > ${i.length}) return INVALID;`);
  let c = Fe(e);
  t.write(`const ${c} = [];`);
  for (let u = 0; u < i.length; u++) {
    let p = i[u];
    if (u >= l)
      (t.write(`if (${c}.length === ${u}) {`),
        t.indented((m) => {
          (m.write(`if (${u} < ${n}.length) {`),
            m.indented((f) => {
              let h = Fe(e);
              f.write(`const ${h} = ${n}[${u}];`);
              let v = uo(f, e, p, h);
              f.write(`${c}[${u}] = ${v};`);
            }),
            m.write("} else {"),
            m.indented((f) => {
              if (o$(p)) {
                f.write(`${c}.length = ${u};`);
                return;
              }
              let h = Fe(e),
                v = Fe(e);
              (f.write(`const ${h} = undefined;`),
                f.write(`const ${v} = (() => {`),
                f.indented((y) => {
                  let w = uo(y, e, p, h);
                  y.write(`return ${w};`);
                }),
                f.write("})();"),
                f.write(`if (${v} === INVALID || ${v} === undefined) ${c}.length = ${u};`),
                f.write(`else ${c}[${u}] = ${v};`));
            }),
            m.write("}"));
        }),
        t.write("}"));
    else {
      let m = Fe(e);
      t.write(`const ${m} = ${n}[${u}];`);
      let f = uo(t, e, p, m);
      t.write(`${c}[${u}] = ${f};`);
    }
  }
  if (s) {
    let u = Fe(e),
      p = Fe(e);
    (t.write(`for (let ${u} = ${i.length}; ${u} < ${n}.length; ${u}++) {`),
      t.indented((m) => {
        m.write(`const ${p} = ${n}[${u}];`);
        let f = uo(m, e, s, p);
        m.write(`${c}[${u}] = ${f};`);
      }),
      t.write("}"));
  }
  return c;
}
function yte(t, e) {
  for (let r = t.length - 1; r >= 0; r--)
    if (!(e === "optin" ? t[r]._zod.optin !== void 0 : t[r]._zod.optout === "optional"))
      return r + 1;
  return 0;
}
function sYe(t, e, r, n) {
  let o = r._zod.def,
    i = o.options;
  if (o.discriminator) return aYe(t, e, o, n);
  if (o.inclusive === !1) throw new xt("exclusive unions (z.xor)");
  if (i.length === 0) return (t.write("return INVALID;"), n);
  if (i.length === 1) return Dr(t, e, i[0], n);
  if (i.every((l) => l._zod.def.type === "literal" && !l._zod.def.checks?.length)) {
    let l = new Set(i.flatMap((u) => u._zod.def.values)),
      c = Ke(e, l);
    return (t.write(`if (!${c}.has(${n})) return INVALID;`), n);
  }
  let a = Fe(e);
  t.write(`let ${a};`);
  for (let l = 0; l < i.length; l++) {
    let c = i[l];
    (l === 0 ? t.write(`${a} = (() => {`) : t.write(`if (${a} === INVALID) ${a} = (() => {`),
      t.indented((u) => {
        let p = Dr(u, e, c, n);
        u.write(`return ${p};`);
      }),
      t.write("})();"));
  }
  return (t.write(`if (${a} === INVALID) return INVALID;`), a);
}
function aYe(t, e, r, n) {
  if (r.unionFallback) throw new xt("discriminated union with unionFallback");
  if (r.options.length === 0) return (t.write("return INVALID;"), n);
  let o = Fe(e),
    i = Fe(e);
  (t.write(`const ${o} = ${n}?.[${To(r.discriminator)}];`), t.write(`let ${i};`));
  let s = !0,
    a = new Set();
  for (let l of r.options) {
    let c = l._zod.propValues?.[r.discriminator];
    if (!c || c.size === 0)
      throw new xt("discriminated union option without static discriminator values");
    for (let m of c) {
      if (a.has(m)) throw new xt(`duplicate discriminator value ${String(m)}`);
      a.add(m);
    }
    let u = Array.from(c, (m) => lYe(e, o, m)),
      p = s ? "if" : "else if";
    (t.write(`${p} (${u.join(" || ")}) {`),
      t.indented((m) => {
        let f = Dr(m, e, l, n);
        m.write(`${i} = ${f};`);
      }),
      t.write("}"),
      (s = !1));
  }
  return (t.write("else { return INVALID; }"), i);
}
function lYe(t, e, r) {
  if (typeof r == "string") return `${e} === ${To(r)}`;
  if (typeof r == "number") return Number.isNaN(r) ? `Number.isNaN(${e})` : `${e} === ${r}`;
  if (typeof r == "boolean") return `${e} === ${r}`;
  if (r === null) return `${e} === null`;
  if (r === void 0) return `${e} === undefined`;
  if (typeof r == "bigint") return `${e} === ${r}n`;
  if (typeof r == "symbol") {
    let n = Ke(t, r);
    return `${e} === ${n}`;
  }
  throw new xt(`literal discriminator value ${String(r)}`);
}
function cYe(t, e, r, n) {
  let o = r._zod.def;
  e.definite = !1;
  let i = uo(t, e, o.left, n),
    s = uo(t, e, o.right, n),
    a = Ke(e, mh),
    l = Fe(e);
  return (
    t.write(`const ${l} = ${a}(${i}, ${s});`),
    t.write(`if (!${l}.valid) return INVALID;`),
    `${l}.data`
  );
}
function uYe(t, e, r, n) {
  let o = r._zod.def,
    i = Ke(e, Xi);
  t.write(`if (!${i}(${n})) return INVALID;`);
  let s = Fe(e),
    a = Fe(e),
    l = Fe(e);
  t.write(`const ${s} = {};`);
  let c = o,
    u = c.partial ? void 0 : o.keyType._zod.values;
  if (u) {
    let f = [];
    for (let v of u) {
      if (!(typeof v == "string" || typeof v == "number" || typeof v == "symbol"))
        throw new xt(`record key value ${String(v)}`);
      let y = typeof v == "number" ? v.toString() : v;
      if (y === "__proto__") throw new xt('record key "__proto__"');
      f.push(y);
      let w = Ke(e, v),
        _ = Dr(t, e, o.keyType, w),
        S = Fe(e);
      t.write(`const ${S} = ${n}[${dYe(e, y)}];`);
      let E = uo(t, e, o.valueType, S);
      t.write(`${s}[${_}] = ${E};`);
    }
    let h = Ke(e, new Set(f));
    return (
      t.write(`for (const ${a} in ${n}) {`),
      t.indented((v) => {
        (v.write(`if (${h}.has(${a})) continue;`),
          c.mode === "loose"
            ? v.write(`if (${a} !== "__proto__") ${s}[${a}] = ${n}[${a}];`)
            : v.write("return INVALID;"));
      }),
      t.write("}"),
      s
    );
  }
  let p = o.keyType._zod.def;
  if (!(p.type === "string" && p.format === void 0 && !p.coerce && (p.checks?.length ?? 0) === 0)) {
    let f = o.mode === "loose",
      h = ST(o.keyType);
    h.definite === !1 && (e.definite = !1);
    let v = Ke(e, h),
      y = Ke(e, $l),
      w = Fe(e);
    return (
      vte(t, e, n, a, (_) => {
        (_.write(`let ${w} = ${v}(${a});`),
          _.write(
            `if (${w} === INVALID && typeof ${a} === "string" && ${y}.test(${a})) ${w} = ${v}(Number(${a}));`,
          ),
          f
            ? _.write(`if (${w} === INVALID) { ${s}[${a}] = ${n}[${a}]; continue; }`)
            : _.write(`if (${w} === INVALID) return INVALID;`),
          _.write(`if (${w} === "__proto__") continue;`));
        let S = Fe(e);
        _.write(`const ${S} = ${n}[${a}];`);
        let E = uo(_, e, o.valueType, S);
        _.write(`${s}[${w}] = ${E};`);
      }),
      s
    );
  }
  return (
    vte(
      t,
      e,
      n,
      a,
      (f) => {
        f.write(`const ${l} = ${n}[${a}];`);
        let h = uo(f, e, o.valueType, l);
        f.write(`${s}[${a}] = ${h};`);
      },
      "return INVALID;",
    ),
    s
  );
}
function vte(t, e, r, n, o, i) {
  let s = Ke(e, Object.prototype.propertyIsEnumerable),
    a = Fe(e),
    l = Fe(e),
    c = Fe(e);
  (t.write(`const ${a} = Object.getOwnPropertySymbols(${r});`),
    t.write(`const ${l} = Object.getOwnPropertyNames(${r});`),
    t.write(`for (let ${c} = 0; ${c} < ${l}.length; ${c}++) {`),
    t.indented((u) => {
      (u.write(`const ${n} = ${l}[${c}];`),
        u.write(`if (${n} === "__proto__" || !${s}.call(${r}, ${n})) continue;`),
        o(u));
    }),
    t.write("}"),
    t.write(`for (let ${c} = 0; ${c} < ${a}.length; ${c}++) {`),
    t.indented((u) => {
      (u.write(`const ${n} = ${a}[${c}];`),
        u.write(`if (!${s}.call(${r}, ${n})) continue;`),
        i ? u.write(i) : o(u));
    }),
    t.write("}"));
}
function dYe(t, e) {
  return typeof e == "string" ? To(e) : Ke(t, e);
}
function pYe(t, e, r, n) {
  let o = r._zod.def;
  (t.write(`if (!(${n} instanceof Map)) return INVALID;`), a$(t, r, `${n}.size`));
  let i = Fe(e),
    s = Fe(e),
    a = Fe(e);
  return (
    t.write(`const ${i} = new Map();`),
    t.write(`for (const [${s}, ${a}] of ${n}) {`),
    t.indented((l) => {
      let c = Dr(l, e, o.keyType, s),
        u = Dr(l, e, o.valueType, a);
      l.write(`${i}.set(${c}, ${u});`);
    }),
    t.write("}"),
    i
  );
}
function mYe(t, e, r, n) {
  let o = r._zod.def;
  (t.write(`if (!(${n} instanceof Set)) return INVALID;`), a$(t, r, `${n}.size`));
  let i = Fe(e),
    s = Fe(e);
  return (
    t.write(`const ${i} = new Set();`),
    t.write(`for (const ${s} of ${n}) {`),
    t.indented((a) => {
      let l = Dr(a, e, o.valueType, s);
      a.write(`${i}.add(${l});`);
    }),
    t.write("}"),
    i
  );
}
function fYe(t, e) {
  return (t.write(`if (!(${e} instanceof File)) return INVALID;`), e);
}
function hYe(t, e, r, n) {
  t.write(`if (typeof ${n} !== "string") return INVALID;`);
  let o = r._zod.pattern;
  if (o) {
    let i = Ke(e, o);
    (t.write(`${i}.lastIndex = 0;`), t.write(`if (!${i}.test(${n})) return INVALID;`));
  }
  return n;
}
function gYe(t, e, r, n) {
  let o = r._zod.def,
    i = ap(e, o.getter),
    s = Ke(e, { parser: null });
  (t.write(`if (!${s}.parser) {`),
    t.indented((l) => {
      (l.write(`const inner = ${i}();`),
        l.write(`${s}.parser = function(input) {`),
        l.indented((c) => {
          (c.write("const result = inner._zod.run({ value: input, issues: [] }, {});"),
            c.write("return result.issues.length === 0 ? result.value : INVALID;"));
        }),
        l.write("};"));
    }),
    t.write("}"));
  let a = Fe(e);
  return (
    t.write(`const ${a} = ${s}.parser(${n});`),
    t.write(`if (${a} === INVALID) return INVALID;`),
    a
  );
}
function yYe(t, e, r, n) {
  let o = r._zod.def,
    i = Dr(t, e, o.in, n);
  if (o.transform) {
    if (lp(o.transform)) throw new Cs("z.compile: async transforms in pipes are not supported");
    let s = o.transform,
      l = ap(e, (u) => {
        let p = { value: u, issues: [], addIssue: s$ },
          m = s(u, p);
        return m instanceof Promise ? Io : p.issues.length === 0 ? m : Io;
      }),
      c = Fe(e);
    return (
      t.write(`const ${c} = ${l}(${i});`),
      t.write(`if (${c} === INVALID) return INVALID;`),
      Dr(t, e, o.out, c)
    );
  } else return Dr(t, e, o.out, i);
}
function lp(t) {
  return (
    typeof t == "function" &&
    (t.constructor.name === "AsyncFunction" || t[Symbol.toStringTag] === "AsyncFunction")
  );
}
function vYe(t, e, r, n) {
  let o = r._zod.def;
  if (o.fn) {
    if (lp(o.fn)) throw new Cs("z.compile: async custom predicates are not supported");
    let i = ap(e, o.fn),
      s = Ke(e, n$),
      a = Fe(e);
    (t.write(`const ${a} = ${i}(${n});`),
      t.write(`if (${a} instanceof Promise) ${s}();`),
      t.write(`if (!${a}) return INVALID;`));
  } else throw new xt("custom schema without a predicate function");
  return n;
}
function bYe(t, e, r) {
  let n = t._zod.run({ value: r, issues: [] }, {});
  if (n && typeof n.then == "function") return Io;
  let o = n;
  return o.issues.length === 0 ? o.value : e();
}
function SYe(t, e, r, n) {
  let o = r._zod.def;
  if (!o.catchValue[RE])
    throw new xt("catch with a callback (only a constant catch value compiles)", !1);
  let i = Fe(e);
  (t.write(`let ${i} = (() => {`),
    t.indented((c) => {
      let u = uo(c, e, o.innerType, n);
      c.write(`return ${u};`);
    }),
    t.write("})();"));
  let s = Ke(e, o.innerType),
    a = ap(e, o.catchValue),
    l = Ke(e, bYe);
  return (
    t.write(`if (${i} === INVALID) {`),
    t.indented((c) => {
      (c.write(`${i} = ${l}(${s}, ${a}, ${n});`), c.write(`if (${i} === INVALID) return INVALID;`));
    }),
    t.write("}"),
    i
  );
}
function wYe(t, e, r, n) {
  let o = r._zod.def;
  if (o.transform) {
    if (lp(o.transform)) throw new Cs("z.compile: async transforms are not supported");
    let i = o.transform,
      a = ap(e, (c) => {
        let u = { value: c, issues: [], addIssue: s$ },
          p = i(c, u);
        return p instanceof Promise ? Io : u.issues.length === 0 ? p : Io;
      }),
      l = Fe(e);
    return (
      t.write(`const ${l} = ${a}(${n});`),
      t.write(`if (${l} === INVALID) return INVALID;`),
      l
    );
  }
  return n;
}
var Io,
  fte,
  Cs,
  xt,
  CXe,
  FXe,
  _te = g(() => {
    jc();
    GE();
    X1();
    op();
    vh();
    me();
    ((Io = Symbol.for("zod.compile.invalid")),
      (fte = Symbol.for("zod.compile.fallback")),
      (Cs = class extends Error {
        constructor(e = "z.compile does not support async refinements, transforms, or checks") {
          (super(e), (this.name = "ZodCompileAsyncError"));
        }
      }),
      (xt = class extends Error {
        constructor(e, r = !0) {
          (super(`z.compile does not support ${e}; this schema must use the runtime parser`),
            (this.name = "ZodCompileUnsupportedError"),
            (this.islandable = r));
        }
      }));
    CXe = new Set([
      "max_size",
      "min_size",
      "size_equals",
      "max_length",
      "min_length",
      "length_equals",
    ]);
    FXe = new Set([
      "cidrv4",
      "cuid",
      "cuid2",
      "date",
      "datetime",
      "duration",
      "e164",
      "email",
      "emoji",
      "ends_with",
      "guid",
      "includes",
      "ipv4",
      "ksuid",
      "lowercase",
      "mac",
      "nanoid",
      "regex",
      "starts_with",
      "time",
      "ulid",
      "uppercase",
      "uuid",
      "xid",
    ]);
  });
function wT(t) {
  return (t.checks && (t.checks = [...t.checks]), t);
}
function _T(t, e) {
  return new t(wT({ type: "string", ...re(e) }));
}
function l$(t, e) {
  return new t(wT({ type: "string", coerce: !0, ...re(e) }));
}
function nS(t, e) {
  return new t({ type: "string", format: "email", check: "string_format", abort: !1, ...re(e) });
}
function oS(t, e) {
  return new t({ type: "string", format: "guid", check: "string_format", abort: !1, ...re(e) });
}
function iS(t, e) {
  return new t({ type: "string", format: "uuid", check: "string_format", abort: !1, ...re(e) });
}
function sS(t, e) {
  return new t({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v4",
    ...re(e),
  });
}
function aS(t, e) {
  return new t({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v6",
    ...re(e),
  });
}
function lS(t, e) {
  return new t({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v7",
    ...re(e),
  });
}
function xh(t, e) {
  return new t({ type: "string", format: "url", check: "string_format", abort: !1, ...re(e) });
}
function cS(t, e) {
  return new t({ type: "string", format: "emoji", check: "string_format", abort: !1, ...re(e) });
}
function uS(t, e) {
  return new t({ type: "string", format: "nanoid", check: "string_format", abort: !1, ...re(e) });
}
function dS(t, e) {
  return new t({ type: "string", format: "cuid", check: "string_format", abort: !1, ...re(e) });
}
function pS(t, e) {
  return new t({ type: "string", format: "cuid2", check: "string_format", abort: !1, ...re(e) });
}
function mS(t, e) {
  return new t({ type: "string", format: "ulid", check: "string_format", abort: !1, ...re(e) });
}
function fS(t, e) {
  return new t({ type: "string", format: "xid", check: "string_format", abort: !1, ...re(e) });
}
function hS(t, e) {
  return new t({ type: "string", format: "ksuid", check: "string_format", abort: !1, ...re(e) });
}
function gS(t, e) {
  return new t({ type: "string", format: "ipv4", check: "string_format", abort: !1, ...re(e) });
}
function yS(t, e) {
  return new t({ type: "string", format: "ipv6", check: "string_format", abort: !1, ...re(e) });
}
function xT(t, e) {
  return new t({ type: "string", format: "mac", check: "string_format", abort: !1, ...re(e) });
}
function vS(t, e) {
  return new t({ type: "string", format: "cidrv4", check: "string_format", abort: !1, ...re(e) });
}
function bS(t, e) {
  return new t({ type: "string", format: "cidrv6", check: "string_format", abort: !1, ...re(e) });
}
function SS(t, e) {
  return new t({ type: "string", format: "base64", check: "string_format", abort: !1, ...re(e) });
}
function wS(t, e) {
  return new t({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: !1,
    ...re(e),
  });
}
function _S(t, e) {
  return new t({ type: "string", format: "e164", check: "string_format", abort: !1, ...re(e) });
}
function AT(t, e) {
  return new t({
    type: "string",
    format: "credit_card",
    check: "string_format",
    abort: !1,
    ...re(e),
  });
}
function RT(t, e) {
  return new t({ type: "string", format: "iban", check: "string_format", abort: !1, ...re(e) });
}
function xS(t, e) {
  return new t({ type: "string", format: "jwt", check: "string_format", abort: !1, ...re(e) });
}
function AS(t, e) {
  return new t({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: !1,
    local: !1,
    precision: null,
    ...re(e),
  });
}
function RS(t, e) {
  return new t({ type: "string", format: "date", check: "string_format", ...re(e) });
}
function ES(t, e) {
  return new t({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...re(e),
  });
}
function CS(t, e) {
  return new t({ type: "string", format: "duration", check: "string_format", ...re(e) });
}
function ET(t, e) {
  return new t(wT({ type: "number", checks: [], ...re(e) }));
}
function u$(t, e) {
  return new t(wT({ type: "number", coerce: !0, checks: [], ...re(e) }));
}
function CT(t, e) {
  return new t({ type: "number", check: "number_format", abort: !1, format: "safeint", ...re(e) });
}
function TT(t, e) {
  return new t({ type: "number", check: "number_format", abort: !1, format: "float32", ...re(e) });
}
function PT(t, e) {
  return new t({ type: "number", check: "number_format", abort: !1, format: "float64", ...re(e) });
}
function IT(t, e) {
  return new t({ type: "number", check: "number_format", abort: !1, format: "int32", ...re(e) });
}
function kT(t, e) {
  return new t({ type: "number", check: "number_format", abort: !1, format: "uint32", ...re(e) });
}
function DT(t, e) {
  return new t({ type: "boolean", ...re(e) });
}
function d$(t, e) {
  return new t({ type: "boolean", coerce: !0, ...re(e) });
}
function MT(t, e) {
  return new t({ type: "bigint", ...re(e) });
}
function p$(t, e) {
  return new t({ type: "bigint", coerce: !0, ...re(e) });
}
function OT(t, e) {
  return new t({ type: "bigint", check: "bigint_format", abort: !1, format: "int64", ...re(e) });
}
function NT(t, e) {
  return new t({ type: "bigint", check: "bigint_format", abort: !1, format: "uint64", ...re(e) });
}
function LT(t, e) {
  return new t({ type: "symbol", ...re(e) });
}
function BT(t, e) {
  return new t({ type: "undefined", ...re(e) });
}
function FT(t, e) {
  return new t({ type: "null", ...re(e) });
}
function $T(t) {
  return new t({ type: "any" });
}
function UT(t) {
  return new t({ type: "unknown" });
}
function qT(t, e) {
  return new t({ type: "never", ...re(e) });
}
function GT(t, e) {
  return new t({ type: "void", ...re(e) });
}
function WT(t, e) {
  return new t({ type: "date", ...re(e) });
}
function m$(t, e) {
  return new t({ type: "date", coerce: !0, ...re(e) });
}
function HT(t, e) {
  return new t({ type: "nan", ...re(e) });
}
function ba(t, e) {
  return new $E({ check: "less_than", ...re(e), value: t, inclusive: !1 });
}
function Ei(t, e) {
  return new $E({ check: "less_than", ...re(e), value: t, inclusive: !0 });
}
function Sa(t, e) {
  return new UE({ check: "greater_than", ...re(e), value: t, inclusive: !1 });
}
function Ci(t, e) {
  return new UE({ check: "greater_than", ...re(e), value: t, inclusive: !0 });
}
function jT(t) {
  return Sa(0, t);
}
function zT(t) {
  return ba(0, t);
}
function VT(t) {
  return Ei(0, t);
}
function KT(t) {
  return Ci(0, t);
}
function Zc(t, e) {
  return new g1({ check: "multiple_of", ...re(e), value: t });
}
function Xc(t, e) {
  return new b1({ check: "max_size", ...re(e), maximum: t });
}
function wa(t, e) {
  return new S1({ check: "min_size", ...re(e), minimum: t });
}
function cp(t, e) {
  return new w1({ check: "size_equals", ...re(e), size: t });
}
function up(t, e) {
  return new _1({ check: "max_length", ...re(e), maximum: t });
}
function Ul(t, e) {
  return new x1({ check: "min_length", ...re(e), minimum: t });
}
function dp(t, e) {
  return new A1({ check: "length_equals", ...re(e), length: t });
}
function Ah(t, e) {
  return new R1({ check: "string_format", format: "regex", ...re(e), pattern: t });
}
function Rh(t) {
  return new E1({ check: "string_format", format: "lowercase", ...re(t) });
}
function Eh(t) {
  return new C1({ check: "string_format", format: "uppercase", ...re(t) });
}
function Ch(t, e) {
  return new T1({ check: "string_format", format: "includes", ...re(e), includes: t });
}
function Th(t, e) {
  return new P1({ check: "string_format", format: "starts_with", ...re(e), prefix: t });
}
function Ph(t, e) {
  return new I1({ check: "string_format", format: "ends_with", ...re(e), suffix: t });
}
function ZT(t, e, r) {
  return new k1({ check: "property", property: t, schema: e, ...re(r) });
}
function Ih(t, e) {
  return new D1({ check: "properties", shape: t, ...re(e) });
}
function kh(t, e) {
  return new M1({ check: "mime_type", mime: t, ...re(e) });
}
function Ts(t) {
  return new O1({ check: "overwrite", tx: t });
}
function Dh(t) {
  return Ts((e) => e.normalize(t));
}
function Mh() {
  return Ts((t) => t.trim());
}
function Oh() {
  return Ts((t) => t.toLowerCase());
}
function Nh() {
  return Ts((t) => t.toUpperCase());
}
function Lh() {
  return Ts((t) => hF(t));
}
function f$(t, e, r) {
  return new t({ type: "array", element: e, ...re(r) });
}
function _Ye(t, e, r) {
  return new t({ type: "union", options: e, ...re(r) });
}
function xYe(t, e, r) {
  return new t({ type: "union", options: e, inclusive: !1, ...re(r) });
}
function AYe(t, e, r, n) {
  return new t({ type: "union", options: r, discriminator: e, ...re(n) });
}
function RYe(t, e, r) {
  return new t({ type: "intersection", left: e, right: r });
}
function EYe(t, e, r, n) {
  let o = r instanceof Je,
    i = o ? n : r,
    s = o ? r : null;
  return new t({ type: "tuple", items: e, rest: s, ...re(i) });
}
function CYe(t, e, r, n) {
  return new t({ type: "record", keyType: e, valueType: r, ...re(n) });
}
function TYe(t, e, r, n) {
  return new t({ type: "map", keyType: e, valueType: r, ...re(n) });
}
function PYe(t, e, r) {
  return new t({ type: "set", valueType: e, ...re(r) });
}
function IYe(t, e, r) {
  let n = Array.isArray(e) ? Object.fromEntries(e.map((o) => [o, o])) : e;
  return new t({ type: "enum", entries: n, ...re(r) });
}
function kYe(t, e, r) {
  return new t({ type: "enum", entries: e, ...re(r) });
}
function DYe(t, e, r) {
  return new t({ type: "literal", values: Array.isArray(e) ? e : [e], ...re(r) });
}
function XT(t, e) {
  return new t({ type: "file", ...re(e) });
}
function MYe(t, e) {
  return new t({ type: "transform", transform: e });
}
function OYe(t, e) {
  return new t({ type: "optional", innerType: e });
}
function NYe(t, e) {
  return new t({ type: "nullable", innerType: e });
}
function LYe(t, e, r) {
  return new t({
    type: "default",
    innerType: e,
    get defaultValue() {
      return typeof r == "function" ? r() : th(r);
    },
  });
}
function BYe(t, e, r) {
  return new t({ type: "nonoptional", innerType: e, ...re(r) });
}
function FYe(t, e) {
  return new t({ type: "success", innerType: e });
}
function $Ye(t, e, r) {
  return new t({ type: "catch", innerType: e, catchValue: typeof r == "function" ? r : _F(r) });
}
