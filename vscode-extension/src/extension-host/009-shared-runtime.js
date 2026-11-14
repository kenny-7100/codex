function UYe(t, e, r) {
  return new t({ type: "pipe", in: e, out: r });
}
function qYe(t, e) {
  return new t({ type: "readonly", innerType: e });
}
function GYe(t, e, r) {
  return new t({ type: "template_literal", parts: e, ...re(r) });
}
function WYe(t, e) {
  return new t({ type: "lazy", getter: e });
}
function HYe(t, e) {
  return new t({ type: "promise", innerType: e });
}
function YT(t, e, r) {
  let n = re(r);
  return (n.abort ?? (n.abort = !0), new t({ type: "custom", check: "custom", fn: e, ...n }));
}
function JT(t, e, r) {
  return new t({ type: "custom", check: "custom", fn: e, ...re(r) });
}
function QT(t, e) {
  let r = xte(
    (n) => (
      (n.addIssue = (o) => {
        if (typeof o == "string") n.issues.push(nh(o, n.value, r._zod.def));
        else {
          let i = o;
          (i.fatal && (i.continue = !1),
            i.code ?? (i.code = "custom"),
            "input" in i || (i.input = n.value),
            i.inst ?? (i.inst = r),
            i.continue ?? (i.continue = !r._zod.def.abort),
            n.issues.push(nh(i)));
        }
      }),
      t(n.value, n)
    ),
    e,
  );
  return r;
}
function xte(t, e) {
  let r = new ir({ check: "custom", ...re(e) });
  return ((r._zod.check = t), r);
}
function eP(t) {
  let e = new ir({ check: "describe" });
  return (
    (e._zod.onattach = [
      (r) => {
        let n = zn.get(r) ?? {};
        zn.add(r, { ...n, description: t });
      },
    ]),
    (e._zod.check = () => {}),
    e
  );
}
function tP(t) {
  let e = new ir({ check: "meta" });
  return (
    (e._zod.onattach = [
      (r) => {
        let n = zn.get(r) ?? {};
        zn.add(r, { ...n, ...t });
      },
    ]),
    (e._zod.check = () => {}),
    e
  );
}
function rP(t, e) {
  let r = re(e),
    n = r.truthy ?? ["true", "1", "yes", "on", "y", "enabled"],
    o = r.falsy ?? ["false", "0", "no", "off", "n", "disabled"];
  r.case !== "sensitive" &&
    ((n = n.map((f) => (typeof f == "string" ? f.toLowerCase() : f))),
    (o = o.map((f) => (typeof f == "string" ? f.toLowerCase() : f))));
  let i = new Set(n),
    s = new Set(o),
    a = t.Codec ?? gh,
    l = t.Boolean ?? fh,
    c = t.String ?? Vc,
    u = new c({ type: "string", error: r.error }),
    p = new l({ type: "boolean", error: r.error }),
    m = new a({
      type: "pipe",
      in: u,
      out: p,
      transform: (f, h) => {
        let v = f;
        return (
          r.case !== "sensitive" && (v = v.toLowerCase()),
          i.has(v)
            ? !0
            : s.has(v)
              ? !1
              : (h.issues.push({
                  code: "invalid_value",
                  expected: "stringbool",
                  values: [...i, ...s],
                  input: h.value,
                  inst: m,
                  continue: !1,
                }),
                {})
        );
      },
      reverseTransform: (f, h) => (f === !0 ? n[0] || "true" : o[0] || "false"),
      error: r.error,
    });
  return (
    (m._zod.bag.truthy = n),
    (m._zod.bag.falsy = o),
    (m._zod.bag.case = r.case ?? "insensitive"),
    m
  );
}
function Yc(t, e, r, n = {}) {
  let o = re(n),
    i = {
      check: "string_format",
      type: "string",
      format: e,
      fn: typeof r == "function" ? r : (a) => r.test(a),
      ...o,
    };
  return (r instanceof RegExp && (i.pattern = r), new t(i));
}
var c$,
  Ate = g(() => {
    qE();
    rS();
    vh();
    me();
    c$ = { Any: null, Minute: -1, Second: 0, Millisecond: 3, Microsecond: 6 };
  });
function TS(t, ...e) {
  for (let r of e)
    for (let n of Reflect.ownKeys(r))
      Object.prototype.propertyIsEnumerable.call(r, n) && jn(t, n, r[n]);
  return t;
}
function Jc(t) {
  let e = t?.target ?? "draft-2020-12";
  return (
    e === "draft-4" && (e = "draft-04"),
    e === "draft-7" && (e = "draft-07"),
    {
      processors: t.processors ?? {},
      metadataRegistry: t?.metadata ?? zn,
      target: e,
      unrepresentable: t?.unrepresentable ?? "throw",
      override: t?.override ?? (() => {}),
      io: t?.io ?? "output",
      counter: 0,
      seen: new Map(),
      sharedDefsExtractedFor: void 0,
      sharedEmitDoneFor: void 0,
      cycles: t?.cycles ?? "ref",
      reused: t?.reused ?? "inline",
      intersections: [],
      deferred: [],
      external: t?.external ?? void 0,
    }
  );
}
function vn(t, e, r, n, o) {
  let i =
    typeof e.unrepresentable == "function"
      ? e.unrepresentable({ zodSchema: t, path: n.path, message: o })
      : e.unrepresentable;
  if (i === "any") return !1;
  if (i === void 0 || i === "throw") throw new Error(o);
  return (Object.assign(r, i), !0);
}
function nr(t, e, r = { path: [], schemaPath: [] }) {
  var n;
  let o = t._zod.def,
    i = e.seen.get(t);
  if (i) return (i.count++, r.schemaPath.includes(t) && (i.cycle = r.path), i.schema);
  let s = { schema: {}, count: 1, cycle: void 0, path: r.path };
  (e.seen.set(t, s), (e.sharedDefsExtractedFor = void 0), (e.sharedEmitDoneFor = void 0));
  let a = t._zod.toJSONSchema?.();
  if (a) s.schema = a;
  else {
    let u = { ...r, schemaPath: [...r.schemaPath, t], path: r.path };
    if (t._zod.processJSONSchema) t._zod.processJSONSchema(e, s.schema, u);
    else {
      let m = s.schema,
        f = e.processors[o.type];
      if (!f) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${o.type}`);
      f(t, e, m, u);
    }
    let p = t._zod.parent;
    p && (s.ref || (s.ref = p), nr(p, e, u), (e.seen.get(p).isParent = !0));
  }
  let l = e.metadataRegistry.get(t);
  return (
    l && TS(s.schema, l),
    e.io === "input" && ko(t) && (delete s.schema.examples, delete s.schema.default),
    e.io === "input" &&
      "_prefault" in s.schema &&
      ((n = s.schema).default ?? (n.default = s.schema._prefault)),
    delete s.schema._prefault,
    e.seen.get(t).schema
  );
}
function Rte(t) {
  return t.replace(/~/g, "~0").replace(/\//g, "~1");
}
function Qc(t, e) {
  let r = t.seen.get(e);
  if (!r) throw new Error("Unprocessed schema. This is a bug in Zod.");
  if (t.external && t.sharedDefsExtractedFor === t.external) return;
  let n = new Map();
  for (let s of t.seen.entries()) {
    let a = t.metadataRegistry.get(s[0])?.id;
    if (a) {
      let l = n.get(a);
      if (l && l !== s[0])
        throw new Error(
          `Duplicate schema id "${a}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`,
        );
      n.set(a, s[0]);
    }
  }
  let o = (s) => {
      let a = t.target === "draft-2020-12" ? "$defs" : "definitions";
      if (t.external) {
        let p = t.external.registry.get(s[0])?.id,
          m = t.external.uri ?? ((h) => h);
        if (p) return { ref: m(p) };
        let f = s[1].defId ?? s[1].schema.id ?? `schema${t.counter++}`;
        return ((s[1].defId = f), { defId: f, ref: `${m("__shared")}#/${a}/${Rte(f)}` });
      }
      let l = "#",
        c = `${l}/${a}/`;
      if (s[1] === r && !s[1].schema.id) return { ref: l };
      let u = s[1].schema.id ?? `__schema${t.counter++}`;
      return { defId: u, ref: c + Rte(u) };
    },
    i = (s) => {
      if (s[1].schema.$ref) return;
      let a = s[1],
        { ref: l, defId: c } = o(s);
      ((a.def = { ...a.schema }), c && (a.defId = c));
      let u = a.schema;
      for (let p in u) delete u[p];
      u.$ref = l;
    };
  if (t.cycles === "throw")
    for (let s of t.seen.entries()) {
      let a = s[1];
      if (a.cycle)
        throw new Error(`Cycle detected: #/${a.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
    }
  for (let s of t.seen.entries()) {
    let a = s[1];
    if (e === s[0]) {
      i(s);
      continue;
    }
    if (t.external) {
      let c = t.external.registry.get(s[0])?.id;
      if (e !== s[0] && c) {
        i(s);
        continue;
      }
    }
    if (t.metadataRegistry.get(s[0])?.id) {
      i(s);
      continue;
    }
    if (a.cycle) {
      i(s);
      continue;
    }
    a.count > 1 && t.reused === "ref" && i(s);
  }
  t.external && (t.sharedDefsExtractedFor = t.external);
}
function Tte(t) {
  let e = t.anyOf;
  if (!Array.isArray(e) || e.length === 0 || t.type !== void 0) return;
  let r = [];
  for (let n of e) {
    if (!n || typeof n != "object") return;
    Tte(n);
    let o = Object.keys(n);
    if (o.length !== 1 || o[0] !== "type") return;
    let i = n.type;
    for (let s of Array.isArray(i) ? i : [i]) {
      if (typeof s != "string") return;
      r.includes(s) || r.push(s);
    }
  }
  (delete t.anyOf, (t.type = r.length === 1 ? r[0] : r));
}
function Cte(t) {
  let e = t.additionalProperties;
  return e === void 0 || e === !1 || typeof e != "object" || e === null
    ? null
    : Object.keys(e).length
      ? e
      : null;
}
function h$(t) {
  let e = [];
  for (let i of t) {
    if (typeof i != "object" || i.type !== "object") return null;
    for (let s in i) if (!Pte.has(s)) return null;
    e.push(i);
  }
  let r = {},
    n = new Set();
  for (let i of e) {
    for (let s in i.properties) {
      if (Object.prototype.hasOwnProperty.call(r, s)) continue;
      let a = [];
      for (let c of e) {
        let u = c.properties?.[s] ?? Cte(c);
        u != null && (a.some((p) => JSON.stringify(p) === JSON.stringify(u)) || a.push(u));
      }
      let l = a.length === 1 ? a[0] : (h$(a) ?? { allOf: a });
      jn(r, s, l);
    }
    for (let s of i.required ?? []) n.add(s);
  }
  let o = { type: "object", properties: r };
  if ((n.size && (o.required = [...n]), e.every((i) => i.additionalProperties === !1)))
    o.additionalProperties = !1;
  else {
    let i = [];
    for (let s of e) {
      let a = Cte(s);
      a && !i.some((l) => JSON.stringify(l) === JSON.stringify(a)) && i.push(a);
    }
    i.length === 1
      ? (o.additionalProperties = i[0])
      : i.length > 1 && (o.additionalProperties = { allOf: i });
  }
  return o;
}
function jYe(t) {
  let e = t.allOf;
  if (!Array.isArray(e) || e.length < 2) return;
  for (let o of Pte) if (o in t) return;
  let r = e.filter((o) => Ete.some((i) => Array.isArray(o[i]))),
    n = null;
  if (!r.length) n = h$(e);
  else {
    let o = r[0],
      i = Ete.find((l) => Array.isArray(o[l]));
    if (Object.keys(o).length !== 1) return;
    let s = e.filter((l) => l !== o),
      a = o[i].map((l) => h$([...s, l]));
    if (a.some((l) => !l)) return;
    n = { [i]: a };
  }
  n && (delete t.allOf, TS(t, n));
}
function eu(t, e) {
  let r = t.seen.get(e);
  if (!r) throw new Error("Unprocessed schema. This is a bug in Zod.");
  let n = (a) => {
    let l = t.seen.get(a);
    if (l.ref === null) return;
    let c = l.def ?? l.schema,
      u = { ...c },
      p = l.ref;
    if (((l.ref = null), p)) {
      n(p);
      let f = t.seen.get(p),
        h = f.schema;
      if (
        (h.$ref &&
        (t.target === "draft-07" || t.target === "draft-04" || t.target === "openapi-3.0")
          ? ((c.allOf = c.allOf ?? []), c.allOf.push(h))
          : TS(c, h),
        TS(c, u),
        a._zod.parent === p)
      )
        for (let y in c) y === "$ref" || y === "allOf" || y in u || delete c[y];
      if (h.$ref && f.def)
        for (let y in c)
          y === "$ref" ||
            y === "allOf" ||
            (y in f.def && JSON.stringify(c[y]) === JSON.stringify(f.def[y]) && delete c[y]);
    }
    let m = a._zod.parent;
    if (m && m !== p) {
      n(m);
      let f = t.seen.get(m);
      if (f?.schema.$ref && ((c.$ref = f.schema.$ref), f.def))
        for (let h in c)
          h === "$ref" ||
            h === "allOf" ||
            (h in f.def && JSON.stringify(c[h]) === JSON.stringify(f.def[h]) && delete c[h]);
    }
    t.override({ zodSchema: a, jsonSchema: c, path: l.path ?? [] });
  };
  if (!t.external || t.sharedEmitDoneFor !== t.external) {
    for (let a of [...t.seen.entries()].reverse()) n(a[0]);
    if (t.target !== "openapi-3.0") for (let a of t.seen.entries()) Tte(a[1].def ?? a[1].schema);
    for (let a of t.deferred) a();
    if (t.intersections.length) {
      let a = new Map();
      for (let l of t.seen.values())
        for (let c of [l.schema, l.def]) {
          let u = c?.allOf;
          if (!Array.isArray(u)) continue;
          let p = a.get(u);
          p ? p.push(c) : a.set(u, [c]);
        }
      for (let l of t.intersections) for (let c of a.get(l) ?? []) jYe(c);
    }
  }
  let o = {};
  if (
    (t.target === "draft-2020-12"
      ? (o.$schema = "https://json-schema.org/draft/2020-12/schema")
      : t.target === "draft-07"
        ? (o.$schema = "http://json-schema.org/draft-07/schema#")
        : t.target === "draft-04"
          ? (o.$schema = "http://json-schema.org/draft-04/schema#")
          : t.target,
    t.external?.uri)
  ) {
    let a = t.external.registry.get(e)?.id;
    if (!a) throw new Error("Schema is missing an `id` property");
    o.$id = t.external.uri(a);
  }
  TS(o, r.defId ? r.schema : (r.def ?? r.schema));
  let i = t.metadataRegistry.get(e)?.id;
  i !== void 0 && o.id === i && delete o.id;
  let s = t.external?.defs ?? {};
  if (!t.external || t.sharedEmitDoneFor !== t.external)
    for (let a of t.seen.entries()) {
      let l = a[1];
      l.def && l.defId && (l.def.id === l.defId && delete l.def.id, jn(s, l.defId, l.def));
    }
  (t.external && (t.sharedEmitDoneFor = t.external),
    t.external ||
      (Object.keys(s).length > 0 &&
        (t.target === "draft-2020-12" ? (o.$defs = s) : (o.definitions = s))));
  try {
    let a = JSON.parse(JSON.stringify(o));
    return (
      Object.defineProperty(a, "~standard", {
        value: {
          ...e["~standard"],
          jsonSchema: {
            input: Bh(e, "input", t.processors),
            output: Bh(e, "output", t.processors),
          },
        },
        enumerable: !1,
        writable: !1,
      }),
      a
    );
  } catch {
    throw new Error("Error converting schema to JSON.");
  }
}
function ko(t, e) {
  let r = e ?? { seen: new Set() };
  if (r.seen.has(t)) return !1;
  r.seen.add(t);
  let n = t._zod.def;
  if (n.type === "transform") return !0;
  if (n.type === "array") return ko(n.element, r);
  if (n.type === "set") return ko(n.valueType, r);
  if (n.type === "lazy") return ko(n.getter(), r);
  if (
    n.type === "promise" ||
    n.type === "optional" ||
    n.type === "nonoptional" ||
    n.type === "nullable" ||
    n.type === "readonly" ||
    n.type === "default" ||
    n.type === "prefault" ||
    n.type === "catch"
  )
    return ko(n.innerType, r);
  if (n.type === "intersection") return ko(n.left, r) || ko(n.right, r);
  if (n.type === "record" || n.type === "map") return ko(n.keyType, r) || ko(n.valueType, r);
  if (n.type === "pipe") return t._zod.traits.has("$ZodCodec") ? !0 : ko(n.in, r) || ko(n.out, r);
  if (n.type === "object") {
    for (let o in n.shape) if (ko(n.shape[o], r)) return !0;
    return !1;
  }
  if (n.type === "union") {
    for (let o of n.options) if (ko(o, r)) return !0;
    return !1;
  }
  if (n.type === "tuple") {
    for (let o of n.items) if (ko(o, r)) return !0;
    return !!(n.rest && ko(n.rest, r));
  }
  return !1;
}
var Pte,
  Ete,
  g$,
  Bh,
  PS = g(() => {
    rS();
    me();
    ((Pte = new Set(["type", "properties", "required", "additionalProperties"])),
      (Ete = ["oneOf", "anyOf"]));
    ((g$ =
      (t, e = {}) =>
      (r) => {
        let n = Jc({ ...r, processors: e });
        return (nr(t, n), Qc(n, t), eu(n, t));
      }),
      (Bh =
        (t, e, r = {}) =>
        (n) => {
          let { libraryOptions: o, target: i } = n ?? {},
            s = Jc({ ...(o ?? {}), target: i, io: e, processors: r });
          return (nr(t, s), Qc(s, t), eu(s, t));
        }));
  });
function bn(t) {
  let e = {},
    r = t._zod.def,
    n = t._zod.traits.has("$ZodCheck") ? [t, ...(r.checks ?? [])] : (r.checks ?? []);
  for (let i of n) zYe[i._zod.def.check]?.(e, i._zod.def);
  let o = t._zod.bag;
  (o.minimum !== void 0 && Fh(e, "minimum", o.minimum),
    o.exclusiveMinimum !== void 0 && Fh(e, "exclusiveMinimum", o.exclusiveMinimum),
    o.maximum !== void 0 && $h(e, "maximum", o.maximum),
    o.exclusiveMaximum !== void 0 && $h(e, "exclusiveMaximum", o.exclusiveMaximum),
    o.multipleOf !== void 0 && Ote(e, o.multipleOf),
    o.format !== void 0 &&
      (e.format ?? (e.format = o.format), o.format.includes("int") && (e.isInt = !0)),
    o.mime && Lte(e, o.mime));
  for (let i of o.patterns ?? []) Nte(e, i);
  return e;
}
function IS(t) {
  let e = t._zod.def;
  return e.type === "pipe" && e.in._zod.traits.has("$ZodTransform")
    ? IS(e.out)
    : e.type === "catch"
      ? IS(e.innerType)
      : t._zod.optin;
}
function y$(t, e, r) {
  if (e.$ref) {
    if (r.has(e)) return e;
    r.add(e);
    let h = t.get(e)?.def;
    if (!h) return e;
    let v = y$(t, h, r);
    return v === h ? e : v;
  }
  for (let h of ["anyOf", "oneOf"]) {
    let v = e[h];
    if (!Array.isArray(v)) continue;
    let y = v.map((w) => y$(t, w, r));
    y.some((w, _) => w !== v[_]) && (e = { ...e, [h]: y });
  }
  let n = Array.isArray(e.type) ? e.type : [e.type],
    o = !n.includes("string") && n.some((h) => h === "number" || h === "integer"),
    i = e.enum ?? (e.const !== void 0 ? [e.const] : void 0);
  if (!o && !i?.some((h) => typeof h == "number")) return e;
  let {
    minimum: s,
    maximum: a,
    exclusiveMinimum: l,
    exclusiveMaximum: c,
    multipleOf: u,
    format: p,
    id: m,
    ...f
  } = e;
  return (
    f.enum
      ? (f.enum = f.enum.map((h) => (typeof h == "number" ? String(h) : h)))
      : typeof f.const == "number" && (f.const = String(f.const)),
    o && ((f.type = "string"), i || (f.pattern = (n.includes("number") ? $l : $b).source)),
    f
  );
}
function ZYe(t) {
  let e = new Map();
  for (let n of t.seen.values()) n.def && !e.has(n.schema) && e.set(n.schema, n);
  let r = new Map();
  for (let n of v$.get(t) ?? []) {
    let o = t.seen.get(n),
      i = (o?.def ?? o?.schema)?.propertyNames;
    if (!i || i === !0 || r.has(i)) continue;
    let s = y$(e, i, new Set());
    s !== i && r.set(i, s);
  }
  if (r.size)
    for (let n of t.seen.values())
      for (let o of [n.schema, n.def]) {
        let i = o && r.get(o.propertyNames);
        i && (o.propertyNames = i);
      }
}
function $te(t, e, r, n, o) {
  let i = !1,
    s = JSON.stringify(t, (a, l) => (typeof l != "bigint" ? l : ((i = !0), null)));
  return i
    ? (vn(e, r, n, o, "BigInt defaults cannot be represented in JSON Schema"), Z$)
    : JSON.parse(s);
}
function pp(t, e) {
  if ("_idmap" in t) {
    let n = t,
      o = Jc({ ...e, processors: nP }),
      i = {};
    for (let l of n._idmap.entries()) {
      let [c, u] = l;
      nr(u, o);
    }
    let s = {},
      a = { registry: n, uri: e?.uri, defs: i };
    o.external = a;
    for (let l of n._idmap.entries()) {
      let [c, u] = l;
      (Qc(o, u), jn(s, c, eu(o, u)));
    }
    if (Object.keys(i).length > 0) {
      let l = o.target === "draft-2020-12" ? "$defs" : "definitions";
      s.__shared = { [l]: i };
    }
    return { schemas: s };
  }
  let r = Jc({ ...e, processors: nP });
  return (nr(t, r), Qc(r, t), eu(r, t));
}
var Fh,
  $h,
  Ite,
  Ote,
  Nte,
  Lte,
  Bte,
  kte,
  Dte,
  Mte,
  zYe,
  VYe,
  KYe,
  Fte,
  b$,
  S$,
  w$,
  _$,
  x$,
  A$,
  R$,
  E$,
  C$,
  T$,
  P$,
  I$,
  k$,
  D$,
  M$,
  O$,
  N$,
  L$,
  B$,
  F$,
  $$,
  U$,
  q$,
  G$,
  W$,
  oP,
  H$,
  j$,
  v$,
  z$,
  V$,
  K$,
  Z$,
  X$,
  Y$,
  J$,
  Q$,
  eU,
  tU,
  iP,
  rU,
  nP,
  Uh = g(() => {
    op();
    vh();
    PS();
    me();
    ((Fh = (t, e, r) => {
      (t[e] === void 0 || r > t[e]) && (t[e] = r);
    }),
      ($h = (t, e, r) => {
        (t[e] === void 0 || r < t[e]) && (t[e] = r);
      }),
      (Ite = (t, e) => {
        (Fh(t, "minimum", e), $h(t, "maximum", e));
      }),
      (Ote = (t, e) => {
        (t.multipleOf ?? (t.multipleOf = []), t.multipleOf.includes(e) || t.multipleOf.push(e));
      }),
      (Nte = (t, e) => {
        (t.patterns ?? (t.patterns = new Set()), t.patterns.add(e));
      }),
      (Lte = (t, e) => {
        t.mime = t.mime ? t.mime.filter((r) => e.includes(r)) : [...e];
      }),
      (Bte = (t, e) => {
        ((t.format = e), e.includes("int") && (t.isInt = !0));
      }),
      (kte = (t, e) => Fh(t, "minimum", e.minimum)),
      (Dte = (t, e) => $h(t, "maximum", e.maximum)),
      (Mte = (t) => (e, r) => {
        Bte(e, r.format);
        let [n, o] = t[r.format];
        (Fh(e, "minimum", n), $h(e, "maximum", o));
      }),
      (zYe = {
        greater_than: (t, e) => Fh(t, e.inclusive ? "minimum" : "exclusiveMinimum", e.value),
        less_than: (t, e) => $h(t, e.inclusive ? "maximum" : "exclusiveMaximum", e.value),
        multiple_of: (t, e) => Ote(t, e.value),
        number_format: Mte(Ib),
        bigint_format: Mte(kb),
        min_length: kte,
        max_length: Dte,
        length_equals: (t, e) => Ite(t, e.length),
        min_size: kte,
        max_size: Dte,
        size_equals: (t, e) => Ite(t, e.size),
        string_format: (t, e) => {
          (Bte(t, e.format),
            e.pattern && Nte(t, e.pattern),
            (e.format === "base64" || e.format === "base64url") && (t.contentEncoding = e.format),
            (e.local || e.precision === -1) && (t.laxFormat = !0));
        },
        mime_type: (t, e) => Lte(t, e.mime),
      }));
    ((VYe = {
      guid: "uuid",
      url: "uri",
      datetime: "date-time",
      json_string: "json-string",
      regex: "",
    }),
      (KYe = new Map([
        [fC, XF],
        [zb, YF],
      ])),
      (Fte = (t) => KYe.get(t) ?? t),
      (b$ = (t, e, r, n) => {
        let o = r;
        o.type = "string";
        let {
          minimum: i,
          maximum: s,
          format: a,
          patterns: l,
          contentEncoding: c,
          laxFormat: u,
        } = bn(t);
        if (
          (typeof i == "number" && (o.minLength = i),
          typeof s == "number" && (o.maxLength = s),
          a &&
            ((o.format = VYe[a] ?? a),
            o.format === "" && delete o.format,
            (a === "time" || u) && delete o.format),
          c && (o.contentEncoding = c),
          l && l.size > 0)
        ) {
          let p = [...l].map(Fte);
          p.length === 1
            ? (o.pattern = p[0].source)
            : p.length > 1 &&
              (o.allOf = [
                ...p.map((m) => ({
                  ...(e.target === "draft-07" ||
                  e.target === "draft-04" ||
                  e.target === "openapi-3.0"
                    ? { type: "string" }
                    : {}),
                  pattern: m.source,
                })),
              ]);
        }
      }),
      (S$ = (t, e, r, n) => {
        let o = r,
          {
            minimum: i,
            maximum: s,
            multipleOf: a,
            exclusiveMaximum: l,
            exclusiveMinimum: c,
            isInt: u,
          } = bn(t);
        o.type = u ? "integer" : "number";
        let p = typeof c == "number" && c >= (i ?? Number.NEGATIVE_INFINITY),
          m = typeof l == "number" && l <= (s ?? Number.POSITIVE_INFINITY),
          f = e.target === "draft-04" || e.target === "openapi-3.0";
        if (
          (p
            ? f
              ? ((o.minimum = c), (o.exclusiveMinimum = !0))
              : (o.exclusiveMinimum = c)
            : typeof i == "number" && (o.minimum = i),
          m
            ? f
              ? ((o.maximum = l), (o.exclusiveMaximum = !0))
              : (o.exclusiveMaximum = l)
            : typeof s == "number" && (o.maximum = s),
          a)
        ) {
          let h = new Set();
          for (let w of a)
            Number.isFinite(w) && w !== 0
              ? h.add(Math.abs(w))
              : vn(t, e, o, n, `A multipleOf divisor of ${w} cannot be represented in JSON Schema`);
          let [v, ...y] = h;
          (v !== void 0 && (o.multipleOf = v),
            y.length && (o.allOf = [...(o.allOf ?? []), ...y.map((w) => ({ multipleOf: w }))]));
        }
      }),
      (w$ = (t, e, r, n) => {
        r.type = "boolean";
      }),
      (_$ = (t, e, r, n) => {
        vn(t, e, r, n, "BigInt cannot be represented in JSON Schema");
      }),
      (x$ = (t, e, r, n) => {
        vn(t, e, r, n, "Symbols cannot be represented in JSON Schema");
      }),
      (A$ = (t, e, r, n) => {
        e.target === "openapi-3.0"
          ? ((r.type = "string"), (r.nullable = !0), (r.enum = [null]))
          : (r.type = "null");
      }),
      (R$ = (t, e, r, n) => {
        vn(t, e, r, n, "Undefined cannot be represented in JSON Schema");
      }),
      (E$ = (t, e, r, n) => {
        vn(t, e, r, n, "Void cannot be represented in JSON Schema");
      }),
      (C$ = (t, e, r, n) => {
        r.not = {};
      }),
      (T$ = (t, e, r, n) => {}),
      (P$ = (t, e, r, n) => {}),
      (I$ = (t, e, r, n) => {
        vn(t, e, r, n, "Date cannot be represented in JSON Schema");
      }),
      (k$ = (t, e, r, n) => {
        let o = t._zod.def,
          i = Yf(o.entries);
        if (i.length === 0) {
          r.not = {};
          return;
        }
        (i.every((s) => typeof s == "number") && (r.type = "number"),
          i.every((s) => typeof s == "string") && (r.type = "string"),
          (r.enum = i));
      }),
      (D$ = (t, e, r, n) => {
        let o = t._zod.def;
        if (o.values.length === 0) {
          r.not = {};
          return;
        }
        let i = [];
        for (let s of o.values)
          if (s === void 0) {
            if (vn(t, e, r, n, "Literal `undefined` cannot be represented in JSON Schema")) return;
          } else if (typeof s == "bigint") {
            if (vn(t, e, r, n, "BigInt literals cannot be represented in JSON Schema")) return;
            i.push(Number(s));
          } else i.push(s);
        if (i.length !== 0)
          if (i.length === 1) {
            let s = i[0];
            ((r.type = s === null ? "null" : typeof s),
              e.target === "draft-04" || e.target === "openapi-3.0"
                ? (r.enum = [s])
                : (r.const = s));
          } else
            (i.every((s) => typeof s == "number") && (r.type = "number"),
              i.every((s) => typeof s == "string") && (r.type = "string"),
              i.every((s) => typeof s == "boolean") && (r.type = "boolean"),
              i.every((s) => s === null) && (r.type = "null"),
              (r.enum = i));
      }),
      (M$ = (t, e, r, n) => {
        vn(t, e, r, n, "NaN cannot be represented in JSON Schema");
      }),
      (O$ = (t, e, r, n) => {
        let o = r,
          i = t._zod.pattern;
        if (!i) throw new Error("Pattern not found in template literal");
        ((o.type = "string"), (o.pattern = i.source));
      }),
      (N$ = (t, e, r, n) => {
        let o = r;
        ((o.type = "string"), (o.format = "binary"), (o.contentEncoding = "binary"));
        let { minimum: i, maximum: s, mime: a } = bn(t);
        (i !== void 0 && (o.minLength = i),
          s !== void 0 && (o.maxLength = s),
          a &&
            (a.length === 0
              ? (o.not = {})
              : a.length === 1
                ? (o.contentMediaType = a[0])
                : (o.anyOf = a.map((l) => ({ contentMediaType: l })))));
      }),
      (L$ = (t, e, r, n) => {
        r.type = "boolean";
      }),
      (B$ = (t, e, r, n) => {
        vn(t, e, r, n, "Custom types cannot be represented in JSON Schema");
      }),
      (F$ = (t, e, r, n) => {
        vn(t, e, r, n, "Function types cannot be represented in JSON Schema");
      }),
      ($$ = (t, e, r, n) => {
        vn(t, e, r, n, "Transforms cannot be represented in JSON Schema");
      }),
      (U$ = (t, e, r, n) => {
        vn(t, e, r, n, "Map cannot be represented in JSON Schema");
      }),
      (q$ = (t, e, r, n) => {
        vn(t, e, r, n, "Set cannot be represented in JSON Schema");
      }),
      (G$ = (t, e, r, n) => {
        let o = r,
          i = t._zod.def,
          { minimum: s, maximum: a } = bn(t);
        (typeof s == "number" && (o.minItems = s),
          typeof a == "number" && (o.maxItems = a),
          (o.type = "array"),
          (o.items = nr(i.element, e, { ...n, path: [...n.path, "items"] })));
      }));
    ((W$ = (t, e, r, n) => {
      let o = r,
        i = t._zod.def,
        s = i.shape;
      if (
        Object.getOwnPropertySymbols(s).length &&
        vn(t, e, o, n, "Symbol keys cannot be represented in JSON Schema")
      )
        return;
      ((o.type = "object"), (o.properties = {}));
      for (let c in s)
        jn(o.properties, c, nr(s[c], e, { ...n, path: [...n.path, "properties", c] }));
      let l = [];
      for (let c of Object.keys(s)) {
        let u = i.shape[c];
        (e.io === "input" ? IS(u) === void 0 : u._zod.optout === void 0) && l.push(c);
      }
      (l.length > 0 && (o.required = l),
        i.catchall?._zod.def.type === "never"
          ? (o.additionalProperties = !1)
          : i.catchall
            ? i.catchall &&
              (o.additionalProperties = nr(i.catchall, e, {
                ...n,
                path: [...n.path, "additionalProperties"],
              }))
            : e.io === "output" && (o.additionalProperties = !1));
    }),
      (oP = (t, e, r, n) => {
        let o = t._zod.def,
          i = o.inclusive === !1,
          s = o.options.map((a, l) =>
            nr(a, e, { ...n, path: [...n.path, i ? "oneOf" : "anyOf", l] }),
          );
        i ? (r.oneOf = s) : (r.anyOf = s);
      }),
      (H$ = (t, e, r, n) => {
        let o = t._zod.def,
          i = nr(o.left, e, { ...n, path: [...n.path, "allOf", 0] }),
          s = nr(o.right, e, { ...n, path: [...n.path, "allOf", 1] }),
          a = (c) => "allOf" in c && Object.keys(c).length === 1,
          l = [...(a(i) ? i.allOf : [i]), ...(a(s) ? s.allOf : [s])];
        ((r.allOf = l), e.intersections.push(l));
      }),
      (j$ = (t, e, r, n) => {
        let o = r,
          i = t._zod.def;
        o.type = "array";
        let s = e.target === "draft-2020-12" ? "prefixItems" : "items",
          a =
            e.target === "draft-2020-12" || e.target === "openapi-3.0"
              ? "items"
              : "additionalItems",
          l = i.items.map((v, y) => nr(v, e, { ...n, path: [...n.path, s, y] })),
          c = i.rest
            ? nr(i.rest, e, {
                ...n,
                path: [...n.path, a, ...(e.target === "openapi-3.0" ? [i.items.length] : [])],
              })
            : null,
          u = i.items.length;
        for (; u > 0; ) {
          let v = i.items[u - 1];
          if (!(e.io === "input" ? IS(v) !== void 0 : v._zod.optout === "optional")) break;
          u--;
        }
        let p = i.items.length,
          m = !i.rest;
        e.target === "draft-2020-12"
          ? ((o.prefixItems = l),
            m ? (o.items = !1) : c && (o.items = c),
            u > 0 && (o.minItems = u),
            m && (o.maxItems = p))
          : e.target === "openapi-3.0"
            ? ((o.items = { anyOf: l }),
              c && o.items.anyOf.push(c),
              u > 0 && (o.minItems = u),
              m && (o.maxItems = p))
            : ((o.items = l),
              m ? (o.additionalItems = !1) : c && (o.additionalItems = c),
              u > 0 && (o.minItems = u),
              m && (o.maxItems = p));
        let { minimum: f, maximum: h } = bn(t);
        (typeof f == "number" && (o.minItems = f), typeof h == "number" && (o.maxItems = h));
      }));
    v$ = new WeakMap();
    ((z$ = (t, e, r, n) => {
      let o = r,
        i = t._zod.def;
      o.type = "object";
      let s = i.keyType,
        a = bn(s).patterns;
      if (i.mode === "loose" && a && a.size > 0) {
        let u = nr(i.valueType, e, { ...n, path: [...n.path, "patternProperties", "*"] });
        o.patternProperties = {};
        for (let p of a) jn(o.patternProperties, Fte(p).source, u);
      } else {
        if (e.target === "draft-07" || e.target === "draft-2020-12") {
          o.propertyNames = nr(i.keyType, e, { ...n, path: [...n.path, "propertyNames"] });
          let u = v$.get(e);
          (u || ((u = []), v$.set(e, u), e.deferred.push(() => ZYe(e))), u.push(t));
        }
        o.additionalProperties = nr(i.valueType, e, {
          ...n,
          path: [...n.path, "additionalProperties"],
        });
      }
      let l = s._zod.values,
        c = e.io === "input" && IS(i.valueType) !== void 0;
      if (l && !i.partial && !c) {
        let u = [...l].filter((p) => typeof p == "string" || typeof p == "number");
        u.length > 0 && (o.required = u.map(String));
      }
    }),
      (V$ = (t, e, r, n) => {
        let o = t._zod.def,
          i = nr(o.innerType, e, n),
          s = e.seen.get(t);
        e.target === "openapi-3.0"
          ? ((s.ref = o.innerType), (r.nullable = !0))
          : (r.anyOf = [i, { type: "null" }]);
      }),
      (K$ = (t, e, r, n) => {
        let o = t._zod.def;
        nr(o.innerType, e, n);
        let i = e.seen.get(t);
        i.ref = o.innerType;
      }),
      (Z$ = Symbol()));
    ((X$ = (t, e, r, n) => {
      let o = t._zod.def;
      nr(o.innerType, e, n);
      let i = e.seen.get(t);
      i.ref = o.innerType;
      let s = $te(o.defaultValue, t, e, r, n);
      s !== Z$ && (r.default = s);
    }),
      (Y$ = (t, e, r, n) => {
        let o = t._zod.def;
        nr(o.innerType, e, n);
        let i = e.seen.get(t);
        if (((i.ref = o.innerType), e.io !== "input")) return;
        let s = $te(o.defaultValue, t, e, r, n);
        s !== Z$ && (r._prefault = s);
      }),
      (J$ = (t, e, r, n) => {
        let o = t._zod.def;
        nr(o.innerType, e, n);
        let i = e.seen.get(t);
        i.ref = o.innerType;
        let s;
        try {
          s = o.catchValue(void 0);
        } catch {
          vn(t, e, r, n, "Dynamic catch values are not supported in JSON Schema");
          return;
        }
        r.default = s;
      }),
      (Q$ = (t, e, r, n) => {
        let o = t._zod.def,
          i = o.in._zod.traits.has("$ZodTransform"),
          s = e.io === "input" ? (i ? o.out : o.in) : o.out;
        nr(s, e, n);
        let a = e.seen.get(t);
        a.ref = s;
      }),
      (eU = (t, e, r, n) => {
        let o = t._zod.def;
        nr(o.innerType, e, n);
        let i = e.seen.get(t);
        ((i.ref = o.innerType), (r.readOnly = !0));
      }),
      (tU = (t, e, r, n) => {
        let o = t._zod.def;
        nr(o.innerType, e, n);
        let i = e.seen.get(t);
        i.ref = o.innerType;
      }),
      (iP = (t, e, r, n) => {
        let o = t._zod.def;
        nr(o.innerType, e, n);
        let i = e.seen.get(t);
        i.ref = o.innerType;
      }),
      (rU = (t, e, r, n) => {
        let o = t._zod.innerType;
        nr(o, e, n);
        let i = e.seen.get(t);
        i.ref = o;
      }),
      (nP = {
        string: b$,
        number: S$,
        boolean: w$,
        bigint: _$,
        symbol: x$,
        null: A$,
        undefined: R$,
        void: E$,
        never: C$,
        any: T$,
        unknown: P$,
        date: I$,
        enum: k$,
        literal: D$,
        nan: M$,
        template_literal: O$,
        file: N$,
        success: L$,
        custom: B$,
        function: F$,
        transform: $$,
        map: U$,
        set: q$,
        array: G$,
        object: W$,
        union: oP,
        intersection: H$,
        tuple: j$,
        record: z$,
        nullable: V$,
        nonoptional: K$,
        default: X$,
        prefault: Y$,
        catch: J$,
        pipe: Q$,
        readonly: eU,
        promise: tU,
        optional: iP,
        lazy: rU,
      }));
  });
var sP,
  Ute = g(() => {
    Uh();
    PS();
    sP = class {
      get metadataRegistry() {
        return this.ctx.metadataRegistry;
      }
      get target() {
        return this.ctx.target;
      }
      get unrepresentable() {
        return this.ctx.unrepresentable;
      }
      get override() {
        return this.ctx.override;
      }
      get io() {
        return this.ctx.io;
      }
      get counter() {
        return this.ctx.counter;
      }
      set counter(e) {
        this.ctx.counter = e;
      }
      get seen() {
        return this.ctx.seen;
      }
      constructor(e) {
        let r = e?.target ?? "draft-2020-12";
        (r === "draft-4" && (r = "draft-04"),
          r === "draft-7" && (r = "draft-07"),
          (this.ctx = Jc({
            processors: nP,
            target: r,
            ...(e?.metadata && { metadata: e.metadata }),
            ...(e?.unrepresentable && { unrepresentable: e.unrepresentable }),
            ...(e?.override && { override: e.override }),
            ...(e?.io && { io: e.io }),
          })));
      }
      process(e, r = { path: [], schemaPath: [] }) {
        return nr(e, this.ctx, r);
      }
      emit(e, r) {
        (r &&
          (r.cycles && (this.ctx.cycles = r.cycles),
          r.reused && (this.ctx.reused = r.reused),
          r.external && (this.ctx.external = r.external)),
          (this.ctx.sharedDefsExtractedFor = void 0),
          (this.ctx.sharedEmitDoneFor = void 0),
          Qc(this.ctx, e));
        let n = eu(this.ctx, e),
          { "~standard": o, ...i } = n;
        return i;
      }
    };
  });
var qte = {};
var Gte = g(() => {});
var Ps = {};
Ki(Ps, {
  $ZodAny: () => kC,
  $ZodArray: () => LC,
  $ZodAsyncError: () => Yo,
  $ZodBase64: () => hC,
  $ZodBase64URL: () => yC,
  $ZodBigInt: () => Kb,
  $ZodBigIntFormat: () => CC,
  $ZodBoolean: () => fh,
  $ZodCIDRv4: () => dC,
  $ZodCIDRv6: () => mC,
  $ZodCUID: () => nC,
  $ZodCUID2: () => oC,
  $ZodCatch: () => eT,
  $ZodCheck: () => ir,
  $ZodCheckBigIntFormat: () => v1,
  $ZodCheckEndsWith: () => I1,
  $ZodCheckGreaterThan: () => UE,
  $ZodCheckIncludes: () => T1,
  $ZodCheckLengthEquals: () => A1,
  $ZodCheckLessThan: () => $E,
  $ZodCheckLowerCase: () => E1,
  $ZodCheckMaxLength: () => _1,
  $ZodCheckMaxSize: () => b1,
  $ZodCheckMimeType: () => M1,
  $ZodCheckMinLength: () => x1,
  $ZodCheckMinSize: () => S1,
  $ZodCheckMultipleOf: () => g1,
  $ZodCheckNumberFormat: () => y1,
  $ZodCheckOverwrite: () => O1,
  $ZodCheckProperties: () => D1,
  $ZodCheckProperty: () => k1,
  $ZodCheckRegex: () => R1,
  $ZodCheckSizeEquals: () => w1,
  $ZodCheckStartsWith: () => P1,
  $ZodCheckStringFormat: () => ph,
  $ZodCheckUpperCase: () => C1,
  $ZodCodec: () => gh,
  $ZodCreditCard: () => SC,
  $ZodCustom: () => sT,
  $ZodCustomStringFormat: () => RC,
  $ZodCyclicError: () => uT,
  $ZodDate: () => NC,
  $ZodDefault: () => XC,
  $ZodDiscriminatedUnion: () => $C,
  $ZodE164: () => vC,
  $ZodEmail: () => XE,
  $ZodEmoji: () => tC,
  $ZodEncodeError: () => zc,
  $ZodEnum: () => HC,
  $ZodError: () => TF,
  $ZodExactOptional: () => KC,
  $ZodFile: () => zC,
  $ZodFunction: () => oT,
  $ZodGUID: () => KE,
  $ZodIBAN: () => _C,
  $ZodIPv4: () => lC,
  $ZodIPv6: () => cC,
  $ZodISODate: () => q1,
  $ZodISODateTime: () => U1,
  $ZodISODuration: () => W1,
  $ZodISOTime: () => G1,
  $ZodIntersection: () => UC,
  $ZodJWT: () => AC,
  $ZodKSUID: () => aC,
  $ZodLazy: () => yh,
  $ZodLiteral: () => jC,
  $ZodMAC: () => uC,
  $ZodMap: () => GC,
  $ZodNaN: () => tT,
  $ZodNanoID: () => rC,
  $ZodNever: () => MC,
  $ZodNonOptional: () => JC,
  $ZodNull: () => IC,
  $ZodNullable: () => ZC,
  $ZodNumber: () => Vb,
  $ZodNumberFormat: () => EC,
  $ZodObject: () => BC,
  $ZodObjectJIT: () => j1,
  $ZodOptional: () => Xb,
  $ZodPipe: () => Yb,
  $ZodPrefault: () => YC,
  $ZodPreprocess: () => V1,
  $ZodPromise: () => iT,
  $ZodReadonly: () => rT,
  $ZodRealError: () => Jo,
  $ZodRecord: () => qC,
  $ZodRegistry: () => yT,
  $ZodSet: () => WC,
  $ZodString: () => Vc,
  $ZodStringFormat: () => Yt,
  $ZodSuccess: () => QC,
  $ZodSymbol: () => TC,
  $ZodTemplateLiteral: () => nT,
  $ZodTransform: () => VC,
  $ZodTuple: () => Zb,
  $ZodType: () => Je,
  $ZodULID: () => iC,
  $ZodURL: () => eC,
  $ZodUUID: () => ZE,
  $ZodUndefined: () => PC,
  $ZodUnion: () => hh,
  $ZodUnknown: () => DC,
  $ZodVoid: () => OC,
  $ZodXID: () => sC,
  $ZodXor: () => FC,
  $brand: () => RF,
  $constructor: () => N,
  $input: () => t$,
  $output: () => e$,
  Doc: () => ip,
  INVALID: () => Io,
  JSONSchema: () => qte,
  JSONSchemaGenerator: () => sP,
  NEVER: () => AF,
  TimePrecision: () => c$,
  URL_BAD_FORMAT: () => F1,
  URL_UNPARSEABLE: () => Gb,
  ZodCompileAsyncError: () => Cs,
  ZodCompileUnsupportedError: () => xt,
  _any: () => $T,
  _array: () => f$,
  _base64: () => SS,
  _base64url: () => wS,
  _bigint: () => MT,
  _boolean: () => DT,
  _catch: () => $Ye,
  _check: () => xte,
  _cidrv4: () => vS,
  _cidrv6: () => bS,
  _coercedBigint: () => p$,
  _coercedBoolean: () => d$,
  _coercedDate: () => m$,
  _coercedNumber: () => u$,
  _coercedString: () => l$,
  _creditCard: () => AT,
  _cuid: () => dS,
  _cuid2: () => pS,
  _custom: () => YT,
  _date: () => WT,
  _decode: () => TE,
  _decodeAsync: () => IE,
  _default: () => LYe,
  _discriminatedUnion: () => AYe,
  _e164: () => _S,
  _email: () => nS,
  _emoji: () => cS,
  _encode: () => CE,
  _encodeAsync: () => PE,
  _endsWith: () => Ph,
  _enum: () => IYe,
  _file: () => XT,
  _float32: () => TT,
  _float64: () => PT,
  _gt: () => Sa,
  _gte: () => Ci,
  _guid: () => oS,
  _iban: () => RT,
  _includes: () => Ch,
  _int: () => CT,
  _int32: () => IT,
  _int64: () => OT,
  _intersection: () => RYe,
  _ipv4: () => gS,
  _ipv6: () => yS,
  _isoDate: () => RS,
  _isoDateTime: () => AS,
  _isoDuration: () => CS,
  _isoTime: () => ES,
  _jwt: () => xS,
  _ksuid: () => hS,
  _lazy: () => WYe,
  _length: () => dp,
  _literal: () => DYe,
  _lowercase: () => Rh,
  _lt: () => ba,
  _lte: () => Ei,
  _mac: () => xT,
  _map: () => TYe,
  _max: () => Ei,
  _maxLength: () => up,
  _maxSize: () => Xc,
  _mime: () => kh,
  _min: () => Ci,
  _minLength: () => Ul,
  _minSize: () => wa,
  _multipleOf: () => Zc,
  _nan: () => HT,
  _nanoid: () => uS,
  _nativeEnum: () => kYe,
  _negative: () => zT,
  _never: () => qT,
  _nonnegative: () => KT,
  _nonoptional: () => BYe,
  _nonpositive: () => VT,
  _normalize: () => Dh,
  _null: () => FT,
  _nullable: () => NYe,
  _number: () => ET,
  _optional: () => OYe,
  _overwrite: () => Ts,
  _parse: () => oh,
  _parseAsync: () => ih,
  _pipe: () => UYe,
  _positive: () => jT,
  _promise: () => HYe,
  _properties: () => Ih,
  _property: () => ZT,
  _readonly: () => qYe,
  _record: () => CYe,
  _refine: () => JT,
  _regex: () => Ah,
  _safeDecode: () => DE,
  _safeDecodeAsync: () => OE,
  _safeEncode: () => kE,
  _safeEncodeAsync: () => ME,
  _safeParse: () => sh,
  _safeParseAsync: () => lh,
  _set: () => PYe,
  _size: () => cp,
  _slugify: () => Lh,
  _startsWith: () => Th,
  _string: () => _T,
  _stringFormat: () => Yc,
  _stringbool: () => rP,
  _success: () => FYe,
  _superRefine: () => QT,
  _symbol: () => LT,
  _templateLiteral: () => GYe,
  _toLowerCase: () => Oh,
  _toUpperCase: () => Nh,
  _transform: () => MYe,
  _trim: () => Mh,
  _tuple: () => EYe,
  _uint32: () => kT,
  _uint64: () => NT,
  _ulid: () => mS,
  _undefined: () => BT,
  _union: () => _Ye,
  _unknown: () => UT,
  _uppercase: () => Eh,
  _url: () => xh,
  _uuid: () => iS,
  _uuidv4: () => sS,
  _uuidv6: () => aS,
  _uuidv7: () => lS,
  _void: () => GT,
  _xid: () => fS,
  _xor: () => xYe,
  base64Charset: () => fC,
  base64urlCharset: () => zb,
  canParseURL: () => $1,
  clone: () => Wt,
  compile: () => i$,
  compileFn: () => ST,
  config: () => jr,
  createStandardJSONSchemaMethod: () => Bh,
  createToJSONSchemaMethod: () => g$,
  decode: () => y7,
  decodeAsync: () => b7,
  describe: () => eP,
  encode: () => g7,
  encodeAsync: () => v7,
  extractDefs: () => Qc,
  finalize: () => eu,
  flattenError: () => Lb,
  formatError: () => Bb,
  getDiscriminatedOption: () => z1,
  globalConfig: () => Mn,
  globalRegistry: () => zn,
  handleUnrepresentable: () => vn,
  initializeContext: () => Jc,
  isBackEdge: () => pT,
  isRecursiveSchema: () => dT,
  isValidBase64: () => jb,
  isValidBase64URL: () => gC,
  isValidCIDRv6: () => pC,
  isValidCreditCard: () => bC,
  isValidIBAN: () => wC,
  isValidIPv6: () => Hb,
  isValidJWT: () => xC,
  locales: () => wh,
  memoizer: () => eS,
  mergeValues: () => mh,
  meta: () => tP,
  parse: () => tp,
  parseAsync: () => rp,
  parseURLObject: () => W7,
  prettifyError: () => IF,
  process: () => nr,
  processSchema: () => nr,
  regexes: () => Ri,
  registry: () => vT,
  safeDecode: () => w7,
  safeDecodeAsync: () => x7,
  safeEncode: () => S7,
  safeEncodeAsync: () => _7,
  safeParse: () => ah,
  safeParseAsync: () => ch,
  standardProps: () => VE,
  stripTabAndNewline: () => Wb,
  toDotPath: () => f7,
  toJSONSchema: () => pp,
  toZod: () => Cb,
  treeifyError: () => PF,
  urlHostnameOk: () => JE,
  urlProtocolOk: () => QE,
  util: () => j,
  validate: () => uh,
  validateAsync: () => dh,
  validateURL: () => YE,
  version: () => N1,
  withParser: () => bT,
});
var po = g(() => {
  jc();
  DF();
  kF();
  vh();
  X1();
  qE();
  L1();
  me();
  me();
  op();
  gT();
  rS();
  GE();
  _te();
  Ate();
  PS();
  Uh();
  Ute();
  Gte();
});
var aP = {};
Ki(aP, {
  endsWith: () => Ph,
  gt: () => Sa,
  gte: () => Ci,
  includes: () => Ch,
  length: () => dp,
  lowercase: () => Rh,
  lt: () => ba,
  lte: () => Ei,
  maxLength: () => up,
  maxSize: () => Xc,
  mime: () => kh,
  minLength: () => Ul,
  minSize: () => wa,
  multipleOf: () => Zc,
  negative: () => zT,
  nonnegative: () => KT,
  nonpositive: () => VT,
  normalize: () => Dh,
  overwrite: () => Ts,
  positive: () => jT,
  properties: () => Ih,
  property: () => ZT,
  regex: () => Ah,
  size: () => cp,
  slugify: () => Lh,
  startsWith: () => Th,
  toLowerCase: () => Oh,
  toUpperCase: () => Nh,
  trim: () => Mh,
  uppercase: () => Eh,
});
var lP = g(() => {
  po();
});
function cP(t, e, r) {
  Object.defineProperty(t, e, {
    configurable: !0,
    enumerable: !1,
    get() {
      let n = r(this);
      return (Object.defineProperty(this, e, { value: n, configurable: !0, writable: !0 }), n);
    },
    set(n) {
      Object.defineProperty(this, e, { value: n, configurable: !0, writable: !0 });
    },
  });
}
var Wte,
  Hte,
  YYe,
  Qo,
  nU = g(() => {
    po();
    po();
    me();
    Wte = new WeakSet([Object.prototype, Error.prototype]);
    ((Hte = (t, e) => {
      (TF.init(t, e), (t.name = "ZodError"));
      let r = Object.getPrototypeOf(t);
      Wte.has(r) ||
        (Wte.add(r),
        cP(r, "format", (n) => (o) => Bb(n, o)),
        cP(r, "flatten", (n) => (o) => Lb(n, o)),
        cP(r, "addIssue", (n) => (o) => {
          (n.issues.push(o), (n.message = JSON.stringify(n.issues, Jf, 2)));
        }),
        cP(r, "addIssues", (n) => (o) => {
          (n.issues.push(...o), (n.message = JSON.stringify(n.issues, Jf, 2)));
        }),
        Object.defineProperty(r, "isEmpty", {
          configurable: !0,
          enumerable: !1,
          get() {
            return this.issues.length === 0;
          },
        }));
    }),
      (YYe = N("ZodError", Hte)),
      (Qo = N("ZodError", Hte, void 0, { Parent: Error })));
  });
var oU,
  iU,
  sU,
  aU,
  lU,
  cU,
  uU,
  dU,
  pU,
  mU,
  fU,
  hU,
  gU = g(() => {
    po();
    nU();
    po();
    ((oU = oh(Qo)),
      (iU = ih(Qo)),
      (sU = sh(Qo)),
      (aU = lh(Qo)),
      (lU = CE(Qo)),
      (cU = TE(Qo)),
      (uU = PE(Qo)),
      (dU = IE(Qo)),
      (pU = kE(Qo)),
      (mU = DE(Qo)),
      (fU = ME(Qo)),
      (hU = OE(Qo)));
  });
var Kh = {};
Ki(Kh, {
  ZodAny: () => xU,
  ZodArray: () => CU,
  ZodBase64: () => EP,
  ZodBase64URL: () => CP,
  ZodBigInt: () => zh,
  ZodBigIntFormat: () => IP,
  ZodBoolean: () => jh,
  ZodCIDRv4: () => AP,
  ZodCIDRv6: () => RP,
  ZodCUID: () => yP,
  ZodCUID2: () => vP,
  ZodCatch: () => zU,
  ZodCodec: () => $S,
  ZodCreditCard: () => vU,
  ZodCustom: () => US,
  ZodCustomStringFormat: () => fp,
  ZodDate: () => OS,
  ZodDefault: () => UU,
  ZodDiscriminatedUnion: () => PU,
  ZodE164: () => TP,
  ZodEmail: () => mP,
  ZodEmoji: () => hP,
  ZodEnum: () => Gh,
  ZodExactOptional: () => MP,
  ZodFile: () => LU,
  ZodFunction: () => rq,
  ZodGUID: () => fP,
  ZodIBAN: () => bU,
  ZodIPv4: () => _P,
  ZodIPv6: () => xP,
  ZodISODate: () => ru,
  ZodISODateTime: () => tu,
  ZodISODuration: () => ou,
  ZodISOTime: () => nu,
  ZodInstanceOf: () => iq,
  ZodIntersection: () => IU,
  ZodJWT: () => PP,
  ZodKSUID: () => wP,
  ZodLazy: () => QU,
  ZodLiteral: () => NU,
  ZodMAC: () => yU,
  ZodMap: () => MU,
  ZodNaN: () => KU,
  ZodNanoID: () => gP,
  ZodNever: () => RU,
  ZodNonOptional: () => OP,
  ZodNull: () => _U,
  ZodNullable: () => $U,
  ZodNumber: () => Hh,
  ZodNumberFormat: () => hp,
  ZodObject: () => NS,
  ZodOptional: () => gp,
  ZodPipe: () => FS,
  ZodPrefault: () => GU,
  ZodPreprocess: () => ZU,
  ZodPromise: () => tq,
  ZodReadonly: () => XU,
  ZodRecord: () => qh,
  ZodSet: () => OU,
  ZodString: () => Wh,
  ZodStringFormat: () => ar,
  ZodSuccess: () => jU,
  ZodSymbol: () => SU,
  ZodTemplateLiteral: () => JU,
  ZodTransform: () => BU,
  ZodTuple: () => kU,
  ZodType: () => st,
  ZodULID: () => bP,
  ZodURL: () => DS,
  ZodUUID: () => _a,
  ZodUndefined: () => wU,
  ZodUnion: () => LS,
  ZodUnknown: () => AU,
  ZodVoid: () => EU,
  ZodXID: () => SP,
  ZodXor: () => TU,
  _ZodString: () => pP,
  _default: () => qU,
  _function: () => Xre,
  any: () => kre,
  array: () => vt,
  base64: () => dre,
  base64url: () => pre,
  bigint: () => Ere,
  boolean: () => en,
  catch: () => VU,
  check: () => Yre,
  cidrv4: () => cre,
  cidrv6: () => ure,
  codec: () => zre,
  creditCard: () => fre,
  cuid: () => tre,
  cuid2: () => rre,
  currencyCode: () => Sre,
  custom: () => NP,
  date: () => Mre,
  describe: () => Jre,
  discriminatedUnion: () => BS,
  e164: () => mre,
  email: () => jte,
  emoji: () => Qte,
  enum: () => Kn,
  exactOptional: () => FU,
  file: () => Gre,
  float32: () => _re,
  float64: () => xre,
  function: () => Xre,
  guid: () => zte,
  hash: () => wre,
  hex: () => bre,
  hostname: () => vre,
  httpUrl: () => Jte,
  iban: () => hre,
  instanceof: () => ene,
  int: () => uP,
  int32: () => Are,
  int64: () => Cre,
  intersection: () => Vh,
  invertCodec: () => Vre,
  ipv4: () => sre,
  ipv6: () => lre,
  json: () => rne,
  jwt: () => gre,
  keyof: () => Ore,
  ksuid: () => ire,
  lazy: () => eq,
  literal: () => Me,
  looseObject: () => Vn,
  looseRecord: () => Fre,
  mac: () => are,
  map: () => $re,
  meta: () => Qre,
  nan: () => jre,
  nanoid: () => ere,
  nativeEnum: () => qre,
  never: () => kP,
  nonoptional: () => HU,
  null: () => MS,
  nullable: () => kS,
  nullish: () => Wre,
  number: () => Ht,
  object: () => we,
  optional: () => sr,
  partialRecord: () => Bre,
  pipe: () => dP,
  prefault: () => WU,
  preprocess: () => qS,
  promise: () => Zre,
  readonly: () => YU,
  record: () => lr,
  refine: () => nq,
  set: () => Ure,
  strictObject: () => Nre,
  string: () => q,
  stringFormat: () => yre,
  stringbool: () => tne,
  success: () => Hre,
  superRefine: () => oq,
  symbol: () => Pre,
  templateLiteral: () => Kre,
  transform: () => DP,
  tuple: () => DU,
  uint32: () => Rre,
  uint64: () => Tre,
  ulid: () => nre,
  undefined: () => Ire,
  union: () => or,
  unknown: () => cr,
  url: () => Yte,
  uuid: () => Vte,
  uuidv4: () => Kte,
  uuidv6: () => Zte,
  uuidv7: () => Xte,
  void: () => Dre,
  xid: () => ore,
  xor: () => Lre,
});
function QYe() {
  Mn.localeError || jr(mT());
}
function mp() {
  Mn.memoizer || jr({ memoizer: eS() });
}
function q(t) {
  return _T(Wh, t);
}
function jte(t) {
  return nS(mP, t);
}
function zte(t) {
  return oS(fP, t);
}
function Vte(t) {
  return iS(_a, t);
}
function Kte(t) {
  return sS(_a, t);
}
function Zte(t) {
  return aS(_a, t);
}
function Xte(t) {
  return lS(_a, t);
}
function Yte(t) {
  return xh(DS, t);
}
function Jte(t) {
  return xh(DS, { protocol: Fb, hostname: QF, ...j.normalizeParams(t) });
}
function Qte(t) {
  return cS(hP, t);
}
function ere(t) {
  return uS(gP, t);
}
function tre(t) {
  return dS(yP, t);
}
function rre(t) {
  return pS(vP, t);
}
function nre(t) {
  return mS(bP, t);
}
function ore(t) {
  return fS(SP, t);
}
function ire(t) {
  return hS(wP, t);
}
function sre(t) {
  return gS(_P, t);
}
function are(t) {
  return xT(yU, t);
}
function lre(t) {
  return yS(xP, t);
}
function cre(t) {
  return vS(AP, t);
}
function ure(t) {
  return bS(RP, t);
}
function dre(t) {
  return SS(EP, t);
}
function pre(t) {
  return wS(CP, t);
}
function mre(t) {
  return _S(TP, t);
}
function fre(t) {
  return AT(vU, t);
}
function hre(t) {
  return RT(bU, t);
}
function gre(t) {
  return xS(PP, t);
}
function yre(t, e, r = {}) {
  return Yc(fp, t, e, r);
}
function vre(t) {
  return Yc(fp, "hostname", JF, t);
}
function bre(t) {
  return Yc(fp, "hex", m1, t);
}
function Sre(t) {
  return Yc(fp, "currency_code", t1, t);
}
function wre(t, e) {
  let r = e?.enc ?? "hex",
    n = `${t}_${r}`,
    o = Ri[n];
  if (!o) throw new Error(`Unrecognized hash format: ${n}`);
  return Yc(fp, n, o, e);
}
function Ht(t) {
  return ET(Hh, t);
}
function uP(t) {
  return CT(hp, t);
}
function _re(t) {
  return TT(hp, t);
}
function xre(t) {
  return PT(hp, t);
}
function Are(t) {
  return IT(hp, t);
}
function Rre(t) {
  return kT(hp, t);
}
function en(t) {
  return DT(jh, t);
}
function Ere(t) {
  return MT(zh, t);
}
function Cre(t) {
  return OT(IP, t);
}
function Tre(t) {
  return NT(IP, t);
}
function Pre(t) {
  return LT(SU, t);
}
function Ire(t) {
  return BT(wU, t);
}
function MS(t) {
  return FT(_U, t);
}
function kre() {
  return $T(xU);
}
function cr() {
  return UT(AU);
}
function kP(t) {
  return qT(RU, t);
}
function Dre(t) {
  return GT(EU, t);
}
function Mre(t) {
  return WT(OS, t);
}
function vt(t, e) {
  return f$(CU, t, e);
}
function Ore(t) {
  let e = t._zod.def.shape;
  return Kn(Object.keys(e));
}
function we(t, e) {
  let r = { type: "object", shape: t ?? {}, ...j.normalizeParams(e) };
  return new NS(r);
}
function Nre(t, e) {
  return new NS({ type: "object", shape: t, catchall: kP(), ...j.normalizeParams(e) });
}
function Vn(t, e) {
  return new NS({ type: "object", shape: t, catchall: cr(), ...j.normalizeParams(e) });
}
function or(t, e) {
  return new LS({ type: "union", options: t, ...j.normalizeParams(e) });
}
function Lre(t, e) {
  return new TU({ type: "union", options: t, inclusive: !1, ...j.normalizeParams(e) });
}
function BS(t, e, r) {
  return new PU({ type: "union", options: e, discriminator: t, ...j.normalizeParams(r) });
}
function Vh(t, e) {
  return new IU({ type: "intersection", left: t, right: e });
}
function DU(t, e, r) {
  let n = e instanceof Je,
    o = n ? r : e,
    i = n ? e : null;
  return new kU({ type: "tuple", items: t, rest: i, ...j.normalizeParams(o) });
}
function lr(t, e, r) {
  return !e || !e._zod
    ? new qh({ type: "record", keyType: q(), valueType: t, ...j.normalizeParams(e) })
    : new qh({ type: "record", keyType: t, valueType: e, ...j.normalizeParams(r) });
}
function Bre(t, e, r) {
  return new qh({ type: "record", keyType: t, valueType: e, ...j.normalizeParams(r), partial: !0 });
}
function Fre(t, e, r) {
  return new qh({
    type: "record",
    keyType: t,
    valueType: e,
    mode: "loose",
    ...j.normalizeParams(r),
  });
}
function $re(t, e, r) {
  return new MU({ type: "map", keyType: t, valueType: e, ...j.normalizeParams(r) });
}
function Ure(t, e) {
  return new OU({ type: "set", valueType: t, ...j.normalizeParams(e) });
}
function Kn(t, e) {
  let r = Array.isArray(t) ? Object.fromEntries(t.map((n) => [n, n])) : t;
  return new Gh({ type: "enum", entries: r, ...j.normalizeParams(e) });
}
function qre(t, e) {
  return new Gh({ type: "enum", entries: t, ...j.normalizeParams(e) });
}
function Me(t, e) {
  return new NU({ type: "literal", values: Array.isArray(t) ? t : [t], ...j.normalizeParams(e) });
}
function Gre(t) {
  return XT(LU, t);
}
function DP(t) {
  return new BU({ type: "transform", transform: t });
}
function sr(t) {
  return new gp({ type: "optional", innerType: t });
}
function FU(t) {
  return new MP({ type: "optional", innerType: t });
}
function kS(t) {
  return new $U({ type: "nullable", innerType: t });
}
function Wre(t) {
  return sr(kS(t));
}
function qU(t, e) {
  return new UU({
    type: "default",
    innerType: t,
    get defaultValue() {
      return typeof e == "function" ? e() : j.shallowClone(e);
    },
  });
}
function WU(t, e) {
  return new GU({
    type: "prefault",
    innerType: t,
    get defaultValue() {
      return typeof e == "function" ? e() : j.shallowClone(e);
    },
  });
}
function HU(t, e) {
  return new OP({ type: "nonoptional", innerType: t, ...j.normalizeParams(e) });
}
function Hre(t) {
  return new jU({ type: "success", innerType: t });
}
function VU(t, e) {
  return new zU({
    type: "catch",
    innerType: t,
    catchValue: typeof e == "function" ? e : j.constantCatch(e),
  });
}
function jre(t) {
  return HT(KU, t);
}
function dP(t, e) {
  return new FS({ type: "pipe", in: t, out: e });
}
function zre(t, e, r) {
  return new $S({ type: "pipe", in: t, out: e, transform: r.decode, reverseTransform: r.encode });
}
function Vre(t) {
  let e = t._zod.def;
  return new $S({
    type: "pipe",
    in: e.out,
    out: e.in,
    transform: e.reverseTransform,
    reverseTransform: e.transform,
  });
}
function YU(t) {
  return new XU({ type: "readonly", innerType: t });
}
function Kre(t, e) {
  return new JU({ type: "template_literal", parts: t, ...j.normalizeParams(e) });
}
function eq(t) {
  return new QU({ type: "lazy", getter: t });
}
function Zre(t) {
  return new tq({ type: "promise", innerType: t });
}
function Xre(t) {
  return new rq({
    type: "function",
    input: Array.isArray(t?.input) ? DU(t?.input) : (t?.input ?? vt(cr())),
    output: t?.output ?? cr(),
  });
}
