function zE(t, e, r, n, o, i) {
  let s = r in n,
    a = i === "optional";
  if (!(!s && a && o === "optional")) {
    if (t.issues.length) {
      if (o !== void 0 && a && !s) return;
      e.issues.push(...Zo(r, t.issues));
    }
    if (!s && o === void 0) {
      t.issues.length ||
        e.issues.push({ code: "invalid_type", expected: "nonoptional", input: void 0, path: [r] });
      return;
    }
    t.value === void 0
      ? (s || (o === "defaulted" && !a)) && (e.value[r] = void 0)
      : (e.value[r] = t.value);
  }
}
function H7(t) {
  let e = Object.keys(t.shape),
    r = Object.getOwnPropertySymbols(t.shape),
    n = r.length ? r : uZe,
    o = n.length ? [...e, ...n] : e;
  for (let s of o)
    if (!t.shape?.[s]?._zod?.traits?.has("$ZodType"))
      throw new Error(`Invalid element at key "${String(s)}": expected a Zod schema`);
  let i = vF(t.shape);
  return {
    ...t,
    allKeys: o,
    symbolKeys: n,
    keySet: new Set(e),
    numKeys: e.length,
    optionalKeys: new Set(i),
  };
}
function j7(t, e, r, n, o, i, s) {
  let a = [],
    l = o.keySet,
    c = o.catchall._zod,
    u = c.def.type,
    p = c.optin,
    m = c.optout,
    f = 0;
  for (let h in e) {
    if (s && r.issues.length !== f) {
      if (Po(r, f)) break;
      f = r.issues.length;
    }
    if (l.has(h)) continue;
    if (h === "__proto__") {
      u === "never" && a.push(h);
      continue;
    }
    if (u === "never") {
      a.push(h);
      continue;
    }
    let v = c.run({ value: e[h], issues: [] }, n);
    v instanceof Promise ? t.push(v.then((y) => zE(y, r, h, e, p, m))) : zE(v, r, h, e, p, m);
  }
  return (
    a.length &&
      r.issues.push({ code: "unrecognized_keys", keys: a, input: e, inst: i, continue: !0 }),
    t.length ? Promise.all(t).then(() => r) : r
  );
}
function T7(t, e, r, n) {
  for (let i of t) if (i.issues.length === 0) return ((e.value = i.value), e);
  let o = t.filter((i) => !Po(i));
  return o.length === 1
    ? ((e.value = o[0].value), o[0])
    : (e.issues.push({
        code: "invalid_union",
        input: e.value,
        inst: r,
        errors: t.map((i) => i.issues.map((s) => Xo(s, n, jr()))),
      }),
      e);
}
function P7(t, e, r, n) {
  let o = [];
  for (let i = 0; i < t.length; i++) t[i].issues.length === 0 && o.push(i);
  return o.length === 1
    ? ((e.value = t[o[0]].value), e)
    : (o.length === 0
        ? e.issues.push({
            code: "invalid_union",
            input: e.value,
            inst: r,
            errors: t.map((i) => i.issues.map((s) => Xo(s, n, jr()))),
          })
        : e.issues.push({
            code: "invalid_union",
            input: e.value,
            inst: r,
            errors: [],
            inclusive: !1,
            matches: o,
          }),
      e);
}
function z1(t, e) {
  let r = t._zod,
    n = r.bag.optionsMap;
  n || ((n = z7(r.def)), (r.bag.optionsMap = n));
  let o = n.get(e);
  if (o === null) throw new Error(`Ambiguous discriminator value "${String(e)}"`);
  return o;
}
function z7(t) {
  let e = new Map();
  for (let r of t.options) {
    let n = r._zod.propValues?.[t.discriminator];
    if (!n || n.size === 0)
      throw new Error(`Invalid discriminated union option at index "${t.options.indexOf(r)}"`);
    for (let o of n)
      if (e.has(o)) {
        if (o !== void 0) throw new Error(`Duplicate discriminator value "${String(o)}"`);
        e.set(o, null);
      } else e.set(o, r);
  }
  return e;
}
function mh(t, e) {
  if (t === e) return { valid: !0, data: t };
  if (t instanceof Date && e instanceof Date && +t == +e) return { valid: !0, data: t };
  if (Xi(t) && Xi(e)) {
    let r = Object.keys(e),
      n = Object.keys(t).filter((i) => r.indexOf(i) !== -1),
      o = { ...t, ...e };
    Object.prototype.hasOwnProperty.call(o, "__proto__") && delete o.__proto__;
    for (let i of n) {
      if (i === "__proto__") continue;
      let s = mh(t[i], e[i]);
      if (!s.valid) return { valid: !1, mergeErrorPath: [i, ...s.mergeErrorPath] };
      o[i] = s.data;
    }
    return { valid: !0, data: o };
  }
  if (Array.isArray(t) && Array.isArray(e)) {
    if (t.length !== e.length) return { valid: !1, mergeErrorPath: [] };
    let r = [];
    for (let n = 0; n < t.length; n++) {
      let o = t[n],
        i = e[n],
        s = mh(o, i);
      if (!s.valid) return { valid: !1, mergeErrorPath: [n, ...s.mergeErrorPath] };
      r.push(s.data);
    }
    return { valid: !0, data: r };
  }
  return { valid: !1, mergeErrorPath: [] };
}
function I7(t, e, r) {
  let n = new Map(),
    o,
    i = new Map(),
    s = (c, u) => {
      let p;
      if (c.code === "unrecognized_keys" && !c.path?.length) (o ?? (o = c), (p = c.keys));
      else if (c.code === "invalid_key" && c.origin === "record" && c.path?.length === 1) {
        let m = String(c.path[0]);
        (i.has(m) || i.set(m, c), (p = [m]));
      } else return !1;
      for (let m of p) (n.has(m) || n.set(m, {}), (n.get(m)[u] = !0));
      return !0;
    };
  for (let c of e.issues) s(c, "l") || t.issues.push(c);
  for (let c of r.issues) s(c, "r") || t.issues.push(c);
  let a = [...n].filter(([, c]) => c.l && c.r).map(([c]) => c);
  if (a.length) {
    let c = o ? a.filter((u) => o.keys.includes(u)) : [];
    c.length && t.issues.push({ ...o, keys: c });
    for (let u of a) !c.includes(u) && i.has(u) && t.issues.push(i.get(u));
  }
  let l = mh(e.value, r.value);
  if (!l.valid) {
    if (Po(t)) return t;
    throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(l.mergeErrorPath)}`);
  }
  return ((t.value = l.data), t);
}
function k7(t, e) {
  for (let r = t.length - 1; r >= 0; r--)
    if (!(e === "optin" ? t[r]._zod.optin !== void 0 : t[r]._zod.optout === "optional"))
      return r + 1;
  return 0;
}
function D7(t, e, r) {
  (t.issues.length && e.issues.push(...Zo(r, t.issues)), (e.value[r] = t.value));
}
function M7(t, e, r, n, o) {
  for (let i = 0; i < r.length; i++) {
    let s = t[i],
      a = i < n.length;
    if (!a && i >= o && r[i]._zod.optin === "optional") {
      e.value.length = i;
      break;
    }
    if (s.issues.length) {
      if (!a && i >= o) {
        e.value.length = i;
        break;
      }
      e.issues.push(...Zo(i, s.issues));
    }
    e.value[i] = s.value;
  }
  for (
    let i = e.value.length - 1;
    i >= n.length && r[i]._zod.optout === "optional" && e.value[i] === void 0;
    i--
  )
    e.value.length = i;
  return e;
}
function O7(t, e, r, n, o, i, s) {
  (t.issues.length &&
    (Pb.has(typeof n)
      ? r.issues.push(...Zo(n, t.issues))
      : r.issues.push({
          code: "invalid_key",
          origin: "map",
          input: o,
          inst: i,
          issues: t.issues.map((a) => Xo(a, s, jr())),
        })),
    e.issues.length &&
      (Pb.has(typeof n)
        ? r.issues.push(...Zo(n, e.issues))
        : r.issues.push({
            origin: "map",
            code: "invalid_element",
            input: o,
            inst: i,
            key: n,
            issues: e.issues.map((a) => Xo(a, s, jr())),
          })),
    r.value.set(t.value, e.value));
}
function N7(t, e) {
  (t.issues.length && e.issues.push(...t.issues), e.value.add(t.value));
}
function L7(t, e) {
  return ((t.value = e.issues.length ? void 0 : e.value), t);
}
function B7(t, e) {
  return (t.value === void 0 && (t.value = e.defaultValue), t);
}
function F7(t, e) {
  return (
    !t.issues.length &&
      t.value === void 0 &&
      t.issues.push({ code: "invalid_type", expected: "nonoptional", input: t.value, inst: e }),
    t
  );
}
function $7(t, e, r, n) {
  return e.issues.length
    ? ((t.value = r.catchValue({
        ...e,
        value: t.value,
        error: { issues: e.issues.map((o) => Xo(o, n, jr())) },
        input: t.value,
      })),
      t)
    : ((t.value = e.value), e.memo && (t.memo = !0), t);
}
function WE(t, e, r) {
  return t.issues.some((n) => n.code !== "unrecognized_keys")
    ? ((t.aborted = !0), t)
    : e._zod.run({ value: t.value, issues: t.issues }, r);
}
function HE(t, e, r) {
  if (t.issues.length) return ((t.aborted = !0), t);
  if ((r.direction || "forward") === "forward") {
    let o = e.transform(t.value, t);
    return o instanceof Promise ? o.then((i) => jE(t, i, e.out, r)) : jE(t, o, e.out, r);
  } else {
    let o = e.reverseTransform(t.value, t);
    return o instanceof Promise ? o.then((i) => jE(t, i, e.in, r)) : jE(t, o, e.in, r);
  }
}
function jE(t, e, r, n) {
  return t.issues.length ? ((t.aborted = !0), t) : r._zod.run({ value: e, issues: t.issues }, n);
}
function U7(t) {
  return (t.memo || (t.value = Object.freeze(t.value)), t);
}
function dZe(t) {
  let e = t._zod.def,
    r = e.pattern,
    n = !!e.format?.includes("int"),
    o,
    i;
  for (let a of e.checks ?? []) {
    let l = a._zod.def;
    (l.pattern && (r = l.pattern), n || (n = !!l.format?.includes("int")));
    let c = l.minimum ?? l.length,
      u = l.maximum ?? l.length;
    (c !== void 0 && (o === void 0 || c > o) && (o = c),
      u !== void 0 && (i === void 0 || u < i) && (i = u));
  }
  if (r) return r.source;
  if (o !== void 0 && i !== void 0 && o > i) return "(?!)";
  if (o !== void 0 || i !== void 0) return s1({ minimum: o, maximum: i }).source;
  let s = t._zod.pattern;
  return (n && s === $l ? $b : s)?.source;
}
function B1(t) {
  let e = t._zod.def,
    r = t._zod.pattern?.source,
    n = e.innerType ?? t._zod.innerType;
  if (n) {
    let o = n._zod.pattern?.source,
      i = B1(n);
    return r && o && i && i !== o ? r.replace(Fl(o), () => Fl(i)) : r;
  }
  if (e.options) {
    let o = e.options.map(B1);
    if (o.every(Boolean)) return `^(${o.map((i) => Fl(i)).join("|")})$`;
  }
  return dZe(t);
}
function q7(t, e, r, n) {
  if (!t) {
    let o = {
      code: "custom",
      input: r,
      inst: n,
      path: [...(n._zod.def.path ?? [])],
      continue: !n._zod.def.abort,
    };
    (n._zod.def.params && (o.params = n._zod.def.params), e.issues.push(nh(o)));
  }
}
var Je,
  G7,
  Vc,
  Yt,
  KE,
  ZE,
  XE,
  F1,
  Gb,
  rZe,
  eC,
  tC,
  rC,
  nC,
  oC,
  iC,
  sC,
  aC,
  U1,
  q1,
  G1,
  W1,
  lC,
  nZe,
  cC,
  uC,
  dC,
  mC,
  fC,
  hC,
  zb,
  yC,
  vC,
  oZe,
  SC,
  _C,
  AC,
  RC,
  Vb,
  EC,
  fh,
  Kb,
  CC,
  TC,
  PC,
  IC,
  kC,
  DC,
  MC,
  OC,
  NC,
  aZe,
  lZe,
  cZe,
  LC,
  uZe,
  BC,
  j1,
  hh,
  FC,
  $C,
  UC,
  Zb,
  qC,
  GC,
  WC,
  HC,
  jC,
  zC,
  VC,
  Xb,
  KC,
  ZC,
  XC,
  YC,
  JC,
  QC,
  eT,
  tT,
  Yb,
  gh,
  V1,
  rT,
  nT,
  oT,
  iT,
  yh,
  sT,
  vh = g(() => {
    qE();
    jc();
    GE();
    DF();
    op();
    me();
    L1();
    me();
    ((Je = N(
      "$ZodType",
      (t, e) => {
        var r;
        (t ?? (t = {}), (t._zod.def = e), (t._zod.bag = t._zod.bag || {}), (t._zod.version = N1));
        let n = t._zod.def.checks,
          o = t._zod.traits.has("$ZodCheck") ? [t, ...(n ?? [])] : n?.length ? [...n] : [];
        for (let i of o) for (let s of i._zod.onattach) s(t);
        if (o.length === 0)
          ((r = t._zod).deferred ?? (r.deferred = []),
            t._zod.deferred?.push(() => {
              t._zod.run = t._zod.parse;
            }));
        else {
          let i = (a, l, c) => {
              if (a.memo) return a;
              let u = Po(a),
                p;
              for (let m of l) {
                if (m._zod.def.when) {
                  if (bF(a) || !m._zod.def.when(a)) continue;
                } else if (u) continue;
                let f = a.issues.length,
                  h = m._zod.check(a);
                if (h instanceof Promise && c?.async === !1) throw new Yo();
                if (p || h instanceof Promise)
                  p = (p ?? Promise.resolve()).then(async () => {
                    (await h, a.issues.length !== f && (Db(a.issues, f, t), u || (u = Po(a, f))));
                  });
                else {
                  if (a.issues.length === f) continue;
                  (Db(a.issues, f, t), u || (u = Po(a, f)));
                }
              }
              return p ? p.then(() => a) : a;
            },
            s = (a, l, c) => {
              if (Po(a)) return ((a.aborted = !0), a);
              let u = i(l, o, c);
              if (u instanceof Promise) {
                if (c.async === !1) throw new Yo();
                return u.then((p) => t._zod.parse(p, c));
              }
              return t._zod.parse(u, c);
            };
          t._zod.run = (a, l) => {
            if (l.skipChecks) return t._zod.parse(a, l);
            if (l.direction === "backward") {
              let u = t._zod.parse({ value: a.value, issues: [] }, { ...l, skipChecks: !0 });
              return u instanceof Promise ? u.then((p) => s(p, a, l)) : s(u, a, l);
            }
            let c = t._zod.parse(a, l);
            if (c instanceof Promise) {
              if (l.async === !1) throw new Yo();
              return c.then((u) => i(u, o, l));
            }
            return i(c, o, l);
          };
        }
      },
      {
        get "~standard"() {
          return Nb(this, "~standard", VE(this));
        },
        set "~standard"(t) {
          va(this, "~standard", t);
        },
      },
    )),
      (G7 = (t, e) =>
        t.issues.length ? { issues: t.issues.map((r) => Xo(r, e, jr())) } : { value: t.value }));
    ((Vc = N("$ZodString", (t, e) => {
      (Je.init(t, e),
        (t._zod.pattern = e.pattern ?? i1),
        (t._zod.parse = (r, n) => {
          if (e.coerce)
            try {
              r.value = String(r.value);
            } catch {}
          return (
            typeof r.value == "string" ||
              r.issues.push({ expected: "string", code: "invalid_type", input: r.value, inst: t }),
            r
          );
        }));
    })),
      (Yt = N("$ZodStringFormat", (t, e) => {
        (ph.init(t, e), Vc.init(t, e));
      })),
      (KE = N("$ZodGUID", (t, e) => {
        (e.pattern ?? (e.pattern = GF), Yt.init(t, e));
      })),
      (ZE = N("$ZodUUID", (t, e) => {
        if (e.version) {
          let n = { v1: 1, v2: 2, v3: 3, v4: 4, v5: 5, v6: 6, v7: 7, v8: 8 }[e.version];
          if (n === void 0) throw new Error(`Invalid UUID version: "${e.version}"`);
          e.pattern ?? (e.pattern = np(n));
        } else e.pattern ?? (e.pattern = np());
        Yt.init(t, e);
      })),
      (XE = N("$ZodEmail", (t, e) => {
        (e.pattern ?? (e.pattern = WF), Yt.init(t, e));
      })),
      (F1 = 1),
      (Gb = 2));
    rZe = /[\t\n\r]/g;
    ((eC = N("$ZodURL", (t, e) => {
      (Yt.init(t, e),
        (t._zod.check = (r) => {
          try {
            let n = r.value.trim(),
              o = YE(n, e);
            if (o === F1) {
              r.issues.push({
                code: "invalid_format",
                format: "url",
                note: "Invalid URL format",
                input: r.value,
                inst: t,
                continue: !e.abort,
              });
              return;
            }
            if (o === Gb) {
              r.issues.push({
                code: "invalid_format",
                format: "url",
                input: r.value,
                inst: t,
                continue: !e.abort,
              });
              return;
            }
            if (o === !0) {
              r.value = Wb(n);
              return;
            }
            (e.hostname &&
              !JE(o, e.hostname) &&
              r.issues.push({
                code: "invalid_format",
                format: "url",
                note: "Invalid hostname",
                pattern: e.hostname.source,
                input: r.value,
                inst: t,
                continue: !e.abort,
              }),
              e.protocol &&
                !QE(o, e.protocol) &&
                r.issues.push({
                  code: "invalid_format",
                  format: "url",
                  note: "Invalid protocol",
                  pattern: e.protocol.source,
                  input: r.value,
                  inst: t,
                  continue: !e.abort,
                }),
              (r.value = e.normalize ? o.href : Wb(n)));
            return;
          } catch {
            r.issues.push({
              code: "invalid_format",
              format: "url",
              input: r.value,
              inst: t,
              continue: !e.abort,
            });
          }
        }));
    })),
      (tC = N("$ZodEmoji", (t, e) => {
        (e.pattern ?? (e.pattern = HF()), Yt.init(t, e));
      })),
      (rC = N("$ZodNanoID", (t, e) => {
        if (e.length !== void 0 && (!Number.isInteger(e.length) || e.length < 1))
          throw new Error(`Invalid nanoid length: ${e.length}`);
        (e.pattern ?? (e.pattern = e.length === void 0 ? $F : UF(e.length)), Yt.init(t, e));
      })),
      (nC = N("$ZodCUID", (t, e) => {
        (e.pattern ?? (e.pattern = OF), Yt.init(t, e));
      })),
      (oC = N("$ZodCUID2", (t, e) => {
        (e.pattern ?? (e.pattern = NF), Yt.init(t, e));
      })),
      (iC = N("$ZodULID", (t, e) => {
        (e.pattern ?? (e.pattern = LF), Yt.init(t, e));
      })),
      (sC = N("$ZodXID", (t, e) => {
        (e.pattern ?? (e.pattern = BF), Yt.init(t, e));
      })),
      (aC = N("$ZodKSUID", (t, e) => {
        (e.pattern ?? (e.pattern = FF), Yt.init(t, e));
      })),
      (U1 = N("$ZodISODateTime", (t, e) => {
        (e.pattern ?? (e.pattern = o1(e)), Yt.init(t, e));
      })),
      (q1 = N("$ZodISODate", (t, e) => {
        (e.pattern ?? (e.pattern = r1), Yt.init(t, e));
      })),
      (G1 = N("$ZodISOTime", (t, e) => {
        (e.pattern ?? (e.pattern = n1(e)), Yt.init(t, e));
      })),
      (W1 = N("$ZodISODuration", (t, e) => {
        (e.pattern ?? (e.pattern = qF), Yt.init(t, e));
      })),
      (lC = N("$ZodIPv4", (t, e) => {
        (e.pattern ?? (e.pattern = jF), Yt.init(t, e));
      })),
      (nZe = /^[0-9a-fA-F:.]+$/));
    ((cC = N("$ZodIPv6", (t, e) => {
      (e.pattern ?? (e.pattern = zF),
        Yt.init(t, e),
        (t._zod.check = (r) => {
          Hb(r.value) ||
            r.issues.push({
              code: "invalid_format",
              format: "ipv6",
              input: r.value,
              inst: t,
              continue: !e.abort,
            });
        }));
    })),
      (uC = N("$ZodMAC", (t, e) => {
        (e.pattern ?? (e.pattern = VF(e.delimiter)), Yt.init(t, e));
      })),
      (dC = N("$ZodCIDRv4", (t, e) => {
        (e.pattern ?? (e.pattern = KF), Yt.init(t, e));
      })));
    mC = N("$ZodCIDRv6", (t, e) => {
      (e.pattern ?? (e.pattern = ZF),
        Yt.init(t, e),
        (t._zod.check = (r) => {
          pC(r.value) ||
            r.issues.push({
              code: "invalid_format",
              format: "cidrv6",
              input: r.value,
              inst: t,
              continue: !e.abort,
            });
        }));
    });
    ((fC = /^[0-9a-zA-Z+/]*={0,2}$/),
      (hC = N("$ZodBase64", (t, e) => {
        (e.pattern ?? (e.pattern = fC),
          Yt.init(t, e),
          (t._zod.check = (r) => {
            jb(r.value) ||
              r.issues.push({
                code: "invalid_format",
                format: "base64",
                input: r.value,
                inst: t,
                continue: !e.abort,
              });
          }));
      })),
      (zb = /^[A-Za-z0-9_-]*$/));
    ((yC = N("$ZodBase64URL", (t, e) => {
      (e.pattern ?? (e.pattern = zb),
        Yt.init(t, e),
        (t._zod.check = (r) => {
          gC(r.value) ||
            r.issues.push({
              code: "invalid_format",
              format: "base64url",
              input: r.value,
              inst: t,
              continue: !e.abort,
            });
        }));
    })),
      (vC = N("$ZodE164", (t, e) => {
        (e.pattern ?? (e.pattern = e1), Yt.init(t, e));
      })),
      (oZe = /[- ]/g));
    SC = N("$ZodCreditCard", (t, e) => {
      (e.pattern ?? (e.pattern = NE),
        Yt.init(t, e),
        (t._zod.check = (r) => {
          bC(r.value) ||
            r.issues.push({
              code: "invalid_format",
              format: "credit_card",
              input: r.value,
              inst: t,
              continue: !e.abort,
            });
        }));
    });
    _C = N("$ZodIBAN", (t, e) => {
      (e.pattern ?? (e.pattern = LE),
        Yt.init(t, e),
        (t._zod.check = (r) => {
          wC(r.value) ||
            r.issues.push({
              code: "invalid_format",
              format: "iban",
              input: r.value,
              inst: t,
              continue: !e.abort,
            });
        }));
    });
    ((AC = N("$ZodJWT", (t, e) => {
      (Yt.init(t, e),
        (t._zod.check = (r) => {
          xC(r.value, e.alg) ||
            r.issues.push({
              code: "invalid_format",
              format: "jwt",
              input: r.value,
              inst: t,
              continue: !e.abort,
            });
        }));
    })),
      (RC = N("$ZodCustomStringFormat", (t, e) => {
        (Yt.init(t, e),
          (t._zod.check = (r) => {
            e.fn(r.value) ||
              r.issues.push({
                code: "invalid_format",
                format: e.format,
                input: r.value,
                inst: t,
                continue: !e.abort,
              });
          }));
      })),
      (Vb = N("$ZodNumber", (t, e) => {
        (Je.init(t, e),
          (t._zod.pattern = $l),
          (t._zod.parse = (r, n) => {
            if (e.coerce)
              try {
                r.value = Number(r.value);
              } catch {}
            let o = r.value;
            if (typeof o == "number" && !Number.isNaN(o) && Number.isFinite(o)) return r;
            let i =
              typeof o == "number"
                ? Number.isNaN(o)
                  ? "NaN"
                  : Number.isFinite(o)
                    ? void 0
                    : String(o)
                : void 0;
            return (
              r.issues.push({
                expected: "number",
                code: "invalid_type",
                input: o,
                inst: t,
                ...(i ? { received: i } : {}),
              }),
              r
            );
          }));
      })),
      (EC = N("$ZodNumberFormat", (t, e) => {
        (y1.init(t, e), Vb.init(t, e));
      })),
      (fh = N("$ZodBoolean", (t, e) => {
        (Je.init(t, e),
          (t._zod.pattern = l1),
          (t._zod.parse = (r, n) => {
            if (e.coerce)
              try {
                r.value = !!r.value;
              } catch {}
            let o = r.value;
            return (
              typeof o == "boolean" ||
                r.issues.push({ expected: "boolean", code: "invalid_type", input: o, inst: t }),
              r
            );
          }));
      })),
      (Kb = N("$ZodBigInt", (t, e) => {
        (Je.init(t, e),
          (t._zod.pattern = a1),
          (t._zod.parse = (r, n) => {
            if (e.coerce)
              try {
                r.value = BigInt(r.value);
              } catch {}
            return (
              typeof r.value == "bigint" ||
                r.issues.push({
                  expected: "bigint",
                  code: "invalid_type",
                  input: r.value,
                  inst: t,
                }),
              r
            );
          }));
      })),
      (CC = N("$ZodBigIntFormat", (t, e) => {
        (v1.init(t, e), Kb.init(t, e));
      })),
      (TC = N("$ZodSymbol", (t, e) => {
        (Je.init(t, e),
          (t._zod.parse = (r, n) => {
            let o = r.value;
            return (
              typeof o == "symbol" ||
                r.issues.push({ expected: "symbol", code: "invalid_type", input: o, inst: t }),
              r
            );
          }));
      })),
      (PC = N("$ZodUndefined", (t, e) => {
        (Je.init(t, e),
          (t._zod.pattern = u1),
          (t._zod.values = new Set([void 0])),
          (t._zod.parse = (r, n) => {
            let o = r.value;
            return (
              typeof o > "u" ||
                r.issues.push({ expected: "undefined", code: "invalid_type", input: o, inst: t }),
              r
            );
          }));
      })),
      (IC = N("$ZodNull", (t, e) => {
        (Je.init(t, e),
          (t._zod.pattern = c1),
          (t._zod.values = new Set([null])),
          (t._zod.parse = (r, n) => {
            let o = r.value;
            return (
              o === null ||
                r.issues.push({ expected: "null", code: "invalid_type", input: o, inst: t }),
              r
            );
          }));
      })),
      (kC = N("$ZodAny", (t, e) => {
        (Je.init(t, e), (t._zod.parse = (r) => r));
      })),
      (DC = N("$ZodUnknown", (t, e) => {
        (Je.init(t, e), (t._zod.parse = (r) => r));
      })),
      (MC = N("$ZodNever", (t, e) => {
        (Je.init(t, e),
          (t._zod.parse = (r, n) => (
            r.issues.push({ expected: "never", code: "invalid_type", input: r.value, inst: t }),
            r
          )));
      })),
      (OC = N("$ZodVoid", (t, e) => {
        (Je.init(t, e),
          (t._zod.parse = (r, n) => {
            let o = r.value;
            return (
              typeof o > "u" ||
                r.issues.push({ expected: "void", code: "invalid_type", input: o, inst: t }),
              r
            );
          }));
      })),
      (NC = N("$ZodDate", (t, e) => {
        (Je.init(t, e),
          (t._zod.parse = (r, n) => {
            if (e.coerce)
              try {
                r.value = new Date(r.value);
              } catch {}
            let o = r.value,
              i = o instanceof Date;
            return (
              (i && !Number.isNaN(o.getTime())) ||
                r.issues.push({
                  expected: "date",
                  code: "invalid_type",
                  input: o,
                  ...(i ? { received: "Invalid Date" } : {}),
                  inst: t,
                }),
              r
            );
          }));
      })));
    ((aZe = (t) => (Array.isArray(t) ? t.length : -1)),
      (lZe = (t) => (t instanceof Map ? t.size : -1)),
      (cZe = (t) => (t instanceof Set ? t.size : -1)));
    LC = N("$ZodArray", (t, e) => {
      Je.init(t, e);
      let r = Mn.memoizer;
      (r?.attach(t),
        (t._zod.parse = (n, o) => {
          let i = n.value;
          if (!Array.isArray(i))
            return (
              n.issues.push({ expected: "array", code: "invalid_type", input: i, inst: t }),
              n
            );
          n.value = r ? r.alloc(t, n, Array(i.length), o) : Array(i.length);
          let s = [],
            a = o?.abortEarly;
          for (let l = 0; l < i.length; l++) {
            let c = i[l],
              u = e.element._zod.run({ value: c, issues: [] }, o);
            if (u instanceof Promise) s.push(u.then((p) => C7(p, n, l)));
            else if ((C7(u, n, l), a && u.issues.length !== 0 && Po(u))) break;
          }
          return s.length ? Promise.all(s).then(() => n) : n;
        }),
        H1(t, aZe));
    });
    uZe = [];
    ((BC = N("$ZodObject", (t, e) => {
      Je.init(t, e);
      let r = Object.getOwnPropertyDescriptor(e, "shape"),
        n = r?.get ? r.get.raw : (e.shape ?? {});
      if (n) {
        let c = () => {
          let u = { ...n };
          return (Object.defineProperty(e, "shape", { value: u }), (c.raw = u), u);
        };
        ((c.raw = n), Object.defineProperty(e, "shape", { get: c }));
      }
      let o = Qf(() => H7(e));
      ct(t, "propValues", (c) => {
        let u = c.def.shape,
          p = {};
        for (let m in u) {
          let f = u[m]._zod;
          if (f.values) {
            Object.prototype.hasOwnProperty.call(p, m) || jn(p, m, new Set());
            for (let h of f.values) p[m].add(h);
            f.optin !== void 0 && p[m].add(void 0);
          }
        }
        return p;
      });
      let i = Qd,
        s = e.catchall,
        a,
        l = Mn.memoizer;
      (l?.attach(t),
        (t._zod.parse = (c, u) => {
          a ?? (a = o.value);
          let p = c.value;
          if (!i(p))
            return (
              c.issues.push({ expected: "object", code: "invalid_type", input: p, inst: t }),
              c
            );
          c.value = l ? l.alloc(t, c, {}, u) : {};
          let m = [],
            f = a.shape,
            h = u?.abortEarly,
            v = c.issues.length;
          for (let y of a.allKeys) {
            if (h && c.issues.length !== v) {
              if (Po(c, v)) break;
              v = c.issues.length;
            }
            if (y === "__proto__") continue;
            let w = f[y],
              _ = w._zod.optin,
              S = w._zod.optout,
              E = w._zod.run({ value: p[y], issues: [] }, u);
            E instanceof Promise
              ? m.push(E.then((T) => zE(T, c, y, p, _, S)))
              : zE(E, c, y, p, _, S);
          }
          return s
            ? j7(m, p, c, u, o.value, t, h === !0)
            : m.length
              ? Promise.all(m).then(() => c)
              : c;
        }));
    })),
      (j1 = N("$ZodObjectJIT", (t, e) => {
        BC.init(t, e);
        let r = t._zod.parse,
          n = Qf(() => H7(e)),
          o = Mn.memoizer,
          i = (f) => {
            let h = n.value,
              v = h.symbolKeys,
              y = new ip(["payload", "ctx"], { shape: f, inst: t, memo: o, syms: v }),
              w = (T) => `shape[${T}]._zod.run({ value: input[${T}], issues: [] }, ctx)`,
              _ = (T, P) => `
          let ${T}_ab = false;
          for (let i = 0; i < ${T}.issues.length; i++) {
            const iss = ${T}.issues[i];
            iss.path = iss.path ? [${P}, ...iss.path] : [${P}];
            payload.issues.push(iss);
            if (iss.continue !== true) ${T}_ab = true;
          }
          if (${T}_ab && ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }`;
            y.write("const input = payload.value;");
            let S = Object.create(null),
              E = 0;
            for (let T of h.allKeys) S[T] = `key_${E++}`;
            y.write(
              o ? "const newResult = memo.alloc(inst, payload, {}, ctx);" : "const newResult = {};",
            );
            for (let T of h.allKeys) {
              if (T === "__proto__") continue;
              let P = S[T],
                M = typeof T == "symbol" ? `syms[${v.indexOf(T)}]` : To(T),
                L = `${M} in input`,
                V = f[T],
                de = V?._zod?.optin,
                ue = de !== void 0,
                Ae = V?._zod?.optout === "optional";
              if ((y.write(`const ${P} = ${w(M)};`), ue && Ae)) {
                let ge =
                  de === "optional" ? `${P}_present` : `${P}.value !== undefined || ${P}_present`;
                y.write(`
        const ${P}_present = ${L};
        if (!${P}.issues.length || ${P}_present) {
          if (${P}.issues.length) {${_(P, M)}
          }

          if (${ge}) {
            newResult[${M}] = ${P}.value;
          }
        }

      `);
              } else
                ue
                  ? (y.write(`
        if (${P}.issues.length) {${_(P, M)}
        }
      `),
                    de === "defaulted"
                      ? y.write(`newResult[${M}] = ${P}.value;`)
                      : y.write(`
        if (${P}.value !== undefined || ${L}) {
          newResult[${M}] = ${P}.value;
        }
      `))
                  : y.write(`
        const ${P}_present = ${L};
        if (${P}.issues.length) {${_(P, M)}
        }
        if (!${P}_present && !${P}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${M}]
          });
          if (ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }
        }

        if (${P}_present) {
          newResult[${M}] = ${P}.value;
        }

      `);
            }
            return (y.write("payload.value = newResult;"), y.write("return payload;"), y.compile());
          },
          s,
          a = Qd,
          l = !Mn.jitless,
          u = l && gF.value,
          p = e.catchall,
          m;
        t._zod.parse = (f, h) => {
          m ?? (m = n.value);
          let v = f.value;
          return a(v)
            ? l && u && h?.async === !1 && h.jitless !== !0
              ? (s || (s = i(e.shape)),
                (f = s(f, h)),
                p ? j7([], v, f, h, m, t, h?.abortEarly === !0) : f)
              : r(f, h)
            : (f.issues.push({ expected: "object", code: "invalid_type", input: v, inst: t }), f);
        };
      })));
    hh = N("$ZodUnion", (t, e) => {
      (Je.init(t, e),
        ct(t, "optin", (n) =>
          n.def.options.some((o) => o._zod.optin === "defaulted")
            ? "defaulted"
            : n.def.options.some((o) => o._zod.optin !== void 0)
              ? "optional"
              : void 0,
        ),
        ct(t, "optout", (n) =>
          n.def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0,
        ),
        ct(t, "values", (n) => {
          if (n.def.options.every((o) => o._zod.values))
            return new Set(n.def.options.flatMap((o) => Array.from(o._zod.values)));
        }),
        ct(t, "pattern", (n) => {
          if (n.def.options.every((o) => o._zod.pattern)) {
            let o = n.def.options.map((i) => i._zod.pattern);
            return new RegExp(`^(${o.map((i) => Fl(i.source)).join("|")})$`);
          }
        }));
      let r = e.options.length === 1 ? e.options[0]._zod.run : null;
      t._zod.parse = (n, o) => {
        if (r) return r(n, o);
        let i = !1,
          s = [];
        for (let a of e.options) {
          let l = a._zod.run({ value: n.value, issues: [] }, o);
          if (l instanceof Promise) (s.push(l), (i = !0));
          else {
            if (l.issues.length === 0) return l;
            s.push(l);
          }
        }
        return i ? Promise.all(s).then((a) => T7(a, n, t, o)) : T7(s, n, t, o);
      };
    });
    FC = N("$ZodXor", (t, e) => {
      (hh.init(t, e), (e.inclusive = !1));
      let r = e.options.length === 1 ? e.options[0]._zod.run : null;
      t._zod.parse = (n, o) => {
        if (r) return r(n, o);
        let i = !1,
          s = [];
        for (let a of e.options) {
          let l = a._zod.run({ value: n.value, issues: [] }, o);
          l instanceof Promise ? (s.push(l), (i = !0)) : s.push(l);
        }
        return i ? Promise.all(s).then((a) => P7(a, n, t, o)) : P7(s, n, t, o);
      };
    });
    (($C = N("$ZodDiscriminatedUnion", (t, e) => {
      ((e.inclusive = !1), hh.init(t, e));
      let r = t._zod.parse;
      (ct(t, "propValues", (o) => {
        let i = {},
          s = 0;
        for (let a of o.def.options) {
          let l = a._zod.propValues;
          if (!l || Object.keys(l).length === 0)
            throw new Error(
              `Invalid discriminated union option at index "${o.def.options.indexOf(a)}"`,
            );
          l[o.def.discriminator]?.has(void 0) && s++;
          for (let [c, u] of Object.entries(l)) {
            Object.prototype.hasOwnProperty.call(i, c) || jn(i, c, new Set());
            for (let p of u) i[c].add(p);
          }
        }
        return (!o.def.unionFallback && s > 1 && i[o.def.discriminator]?.delete(void 0), i);
      }),
        e.options.forEach((o, i) => {
          let s = eh(o._zod.def);
          if (s && !Object.prototype.hasOwnProperty.call(s, e.discriminator))
            throw new Error(`Invalid discriminated union option at index "${i}"`);
        }));
      let n = Qf(() => z7(e));
      t._zod.parse = (o, i) => {
        let s = o.value;
        if (!Qd(s))
          return (
            o.issues.push({ code: "invalid_type", expected: "object", input: s, inst: t }),
            o
          );
        let a = s?.[e.discriminator],
          l = n.value.get(a);
        return l && (a !== void 0 || i.direction !== "backward")
          ? l._zod.run(o, i)
          : e.unionFallback || i.direction === "backward"
            ? r(o, i)
            : (o.issues.push({
                code: "invalid_union",
                errors: [],
                note: "No matching discriminator",
                discriminator: e.discriminator,
                options: Array.from(n.value.keys()).filter((c) => n.value.get(c) !== null),
                input: s,
                path: [e.discriminator],
                inst: t,
              }),
              o);
      };
    })),
      (UC = N("$ZodIntersection", (t, e) => {
        (Je.init(t, e),
          (t._zod.parse = (r, n) => {
            let o = r.value,
              i = e.left._zod.run({ value: o, issues: [] }, n),
              s = e.right._zod.run({ value: o, issues: [] }, n);
            return i instanceof Promise || s instanceof Promise
              ? Promise.all([i, s]).then(([l, c]) => I7(r, l, c))
              : I7(r, i, s);
          }));
      })));
    Zb = N("$ZodTuple", (t, e) => {
      Je.init(t, e);
      let r = e.items,
        n = Mn.memoizer;
      (n?.attach(t),
        (t._zod.parse = (o, i) => {
          let s = o.value;
          if (!Array.isArray(s))
            return (
              o.issues.push({ input: s, inst: t, expected: "tuple", code: "invalid_type" }),
              o
            );
          o.value = n ? n.alloc(t, o, [], i) : [];
          let a = [],
            l = k7(r, "optin"),
            c = k7(r, "optout");
          if (!e.rest) {
            if (s.length < l)
              return (
                o.issues.push({
                  code: "too_small",
                  minimum: l,
                  inclusive: !0,
                  input: s,
                  inst: t,
                  origin: "array",
                }),
                o
              );
            s.length > r.length &&
              o.issues.push({
                code: "too_big",
                maximum: r.length,
                inclusive: !0,
                input: s,
                inst: t,
                origin: "array",
              });
          }
          let u = new Array(r.length),
            p = e.rest ? i?.abortEarly : void 0,
            m = !1;
          for (let f = 0; f < r.length; f++) {
            let h = r[f]._zod.run({ value: s[f], issues: [] }, i);
            h instanceof Promise
              ? a.push(
                  h.then((v) => {
                    u[f] = v;
                  }),
                )
              : ((u[f] = h), p && !m && h.issues.length && (m = Po(h)));
          }
          if (e.rest && !m) {
            let f = r.length - 1,
              h = s.slice(r.length),
              v = o.issues.length;
            for (let y of h) {
              if (p && o.issues.length !== v) {
                if (Po(o, v)) break;
                v = o.issues.length;
              }
              f++;
              let w = e.rest._zod.run({ value: y, issues: [] }, i);
              w instanceof Promise ? a.push(w.then((_) => D7(_, o, f))) : D7(w, o, f);
            }
          }
          return a.length ? Promise.all(a).then(() => M7(u, o, r, s, c)) : M7(u, o, r, s, c);
        }));
    });
    ((qC = N("$ZodRecord", (t, e) => {
      Je.init(t, e);
      let r = Mn.memoizer;
      (r?.attach(t),
        (t._zod.parse = (n, o) => {
          let i = n.value;
          if (!Xi(i))
            return (
              n.issues.push({ expected: "record", code: "invalid_type", input: i, inst: t }),
              n
            );
          let s = [],
            a = e.keyType._zod.values;
          if (a && !e.partial) {
            n.value = r ? r.alloc(t, n, {}, o) : {};
            let l = new Set();
            for (let u of a)
              if (typeof u == "string" || typeof u == "number" || typeof u == "symbol") {
                if ((l.add(typeof u == "number" ? u.toString() : u), u === "__proto__")) continue;
                let p = e.keyType._zod.run({ value: u, issues: [] }, o);
                if (p instanceof Promise)
                  throw new Error("Async schemas not supported in object keys currently");
                if (p.issues.length) {
                  n.issues.push({
                    code: "invalid_key",
                    origin: "record",
                    issues: p.issues.map((h) => Xo(h, o, jr())),
                    input: u,
                    path: [u],
                    inst: t,
                  });
                  continue;
                }
                let m = p.value;
                if (m === "__proto__") continue;
                let f = e.valueType._zod.run({ value: i[u], issues: [] }, o);
                f instanceof Promise
                  ? s.push(
                      f.then((h) => {
                        (h.issues.length && n.issues.push(...Zo(u, h.issues)),
                          (n.value[m] = h.value));
                      }),
                    )
                  : (f.issues.length && n.issues.push(...Zo(u, f.issues)), (n.value[m] = f.value));
              }
            let c;
            for (let u in i)
              if (!l.has(u))
                if (e.mode === "loose") {
                  if (u === "__proto__") continue;
                  n.value[u] = i[u];
                } else ((c = c ?? []), c.push(u));
            c &&
              c.length > 0 &&
              n.issues.push({
                code: "unrecognized_keys",
                input: i,
                inst: t,
                keys: c,
                continue: !0,
              });
          } else {
            n.value = r ? r.alloc(t, n, {}, o) : {};
            let l;
            for (let c of Reflect.ownKeys(i)) {
              if (c === "__proto__" || !Object.prototype.propertyIsEnumerable.call(i, c)) continue;
              let u = e.keyType._zod.run({ value: c, issues: [] }, o);
              if (u instanceof Promise)
                throw new Error("Async schemas not supported in object keys currently");
              if (typeof c == "string" && $l.test(c) && u.issues.length) {
                let h = e.keyType._zod.run({ value: Number(c), issues: [] }, o);
                if (h instanceof Promise)
                  throw new Error("Async schemas not supported in object keys currently");
                h.issues.length === 0 && (u = h);
              }
              if (u.issues.length) {
                e.mode === "loose"
                  ? (n.value[c] = i[c])
                  : a
                    ? ((l = l ?? []), l.push(c))
                    : n.issues.push({
                        code: "invalid_key",
                        origin: "record",
                        issues: u.issues.map((h) => Xo(h, o, jr())),
                        input: c,
                        path: [c],
                        inst: t,
                      });
                continue;
              }
              let m = u.value;
              if (m === "__proto__") continue;
              let f = e.valueType._zod.run({ value: i[c], issues: [] }, o);
              f instanceof Promise
                ? s.push(
                    f.then((h) => {
                      (h.issues.length && n.issues.push(...Zo(c, h.issues)),
                        (n.value[m] = h.value));
                    }),
                  )
                : (f.issues.length && n.issues.push(...Zo(c, f.issues)), (n.value[m] = f.value));
            }
            l &&
              l.length > 0 &&
              n.issues.push({
                code: "unrecognized_keys",
                input: i,
                inst: t,
                keys: l,
                continue: !0,
              });
          }
          return s.length ? Promise.all(s).then(() => n) : n;
        }));
    })),
      (GC = N("$ZodMap", (t, e) => {
        Je.init(t, e);
        let r = Mn.memoizer;
        (r?.attach(t),
          (t._zod.parse = (n, o) => {
            let i = n.value;
            if (!(i instanceof Map))
              return (
                n.issues.push({ expected: "map", code: "invalid_type", input: i, inst: t }),
                n
              );
            let s = [];
            n.value = r ? r.alloc(t, n, new Map(), o) : new Map();
            let a = o?.abortEarly,
              l = n.issues.length;
            for (let [c, u] of i) {
              if (a && n.issues.length !== l) {
                if (Po(n, l)) break;
                l = n.issues.length;
              }
              let p = e.keyType._zod.run({ value: c, issues: [] }, o),
                m = e.valueType._zod.run({ value: u, issues: [] }, o);
              p instanceof Promise || m instanceof Promise
                ? s.push(
                    Promise.all([p, m]).then(([f, h]) => {
                      O7(f, h, n, c, i, t, o);
                    }),
                  )
                : O7(p, m, n, c, i, t, o);
            }
            return s.length ? Promise.all(s).then(() => n) : n;
          }),
          H1(t, lZe));
      })));
    WC = N("$ZodSet", (t, e) => {
      Je.init(t, e);
      let r = Mn.memoizer;
      (r?.attach(t),
        (t._zod.parse = (n, o) => {
          let i = n.value;
          if (!(i instanceof Set))
            return (n.issues.push({ input: i, inst: t, expected: "set", code: "invalid_type" }), n);
          let s = [];
          n.value = r ? r.alloc(t, n, new Set(), o) : new Set();
          let a = o?.abortEarly,
            l = n.issues.length;
          for (let c of i) {
            if (a && n.issues.length !== l) {
              if (Po(n, l)) break;
              l = n.issues.length;
            }
            let u = e.valueType._zod.run({ value: c, issues: [] }, o);
            u instanceof Promise ? s.push(u.then((p) => N7(p, n))) : N7(u, n);
          }
          return s.length ? Promise.all(s).then(() => n) : n;
        }),
        H1(t, cZe));
    });
    ((HC = N("$ZodEnum", (t, e) => {
      Je.init(t, e);
      let r = Yf(e.entries),
        n = new Set(r);
      ((t._zod.values = n),
        ct(t, "pattern", (o) => {
          let i = Yf(o.def.entries).filter((s) => Pb.has(typeof s));
          return new RegExp(
            i.length ? `^(${i.map((s) => Yi(s.toString())).join("|")})$` : "^[^\\s\\S]$",
          );
        }),
        (t._zod.parse = (o, i) => {
          let s = o.value;
          return (
            n.has(s) || o.issues.push({ code: "invalid_value", values: r, input: s, inst: t }),
            o
          );
        }));
    })),
      (jC = N("$ZodLiteral", (t, e) => {
        Je.init(t, e);
        let r = new Set(e.values);
        ((t._zod.values = r),
          ct(t, "pattern", (n) => {
            let o = n.def.values;
            return new RegExp(
              o.length
                ? `^(${o.map((i) => (typeof i == "string" ? Yi(i) : i ? Yi(i.toString()) : String(i))).join("|")})$`
                : "^[^\\s\\S]$",
            );
          }),
          (t._zod.parse = (n, o) => {
            let i = n.value;
            return (
              r.has(i) ||
                n.issues.push({ code: "invalid_value", values: e.values, input: i, inst: t }),
              n
            );
          }));
      })),
      (zC = N("$ZodFile", (t, e) => {
        (Je.init(t, e),
          (t._zod.parse = (r, n) => {
            let o = r.value;
            return (
              o instanceof File ||
                r.issues.push({ expected: "file", code: "invalid_type", input: o, inst: t }),
              r
            );
          }));
      })),
      (VC = N("$ZodTransform", (t, e) => {
        (Je.init(t, e),
          (t._zod.optin = "optional"),
          Mn.memoizer?.guard(t),
          (t._zod.parse = (r, n) => {
            if (n.direction === "backward") throw new zc(t.constructor.name);
            let o = e.transform(r.value, r);
            if (n.async)
              return (o instanceof Promise ? o : Promise.resolve(o)).then(
                (s) => ((r.value = s), r),
              );
            if (o instanceof Promise) throw new Yo();
            return ((r.value = o), r);
          }));
      })));
    ((Xb = N("$ZodOptional", (t, e) => {
      (Je.init(t, e),
        ct(t, "optin", (r) =>
          r.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional",
        ),
        (t._zod.optout = "optional"),
        ct(t, "values", (r) => {
          let n = r.def.innerType._zod.values;
          return n ? new Set([...n, void 0]) : void 0;
        }),
        ct(t, "pattern", (r) => {
          let n = r.def.innerType._zod.pattern;
          return n ? new RegExp(`^(${Fl(n.source)})?$`) : void 0;
        }),
        (t._zod.parse = (r, n) => {
          if (r.value === void 0) {
            if (e.innerType._zod.optin !== "defaulted") return r;
            let o = e.innerType._zod.run({ value: r.value, issues: [] }, n);
            return o instanceof Promise ? o.then((i) => L7(r, i)) : L7(r, o);
          }
          return e.innerType._zod.run(r, n);
        }));
    })),
      (KC = N("$ZodExactOptional", (t, e) => {
        (Xb.init(t, e),
          ct(t, "values", (r) => r.def.innerType._zod.values),
          ct(t, "pattern", (r) => r.def.innerType._zod.pattern),
          (t._zod.parse = (r, n) => e.innerType._zod.run(r, n)));
      })),
      (ZC = N("$ZodNullable", (t, e) => {
        (Je.init(t, e),
          ct(t, "optin", (r) => r.def.innerType._zod.optin),
          ct(t, "optout", (r) => r.def.innerType._zod.optout),
          ct(t, "pattern", (r) => {
            let n = r.def.innerType._zod.pattern;
            return n ? new RegExp(`^(${Fl(n.source)}|null)$`) : void 0;
          }),
          ct(t, "values", (r) =>
            r.def.innerType._zod.values ? new Set([...r.def.innerType._zod.values, null]) : void 0,
          ),
          (t._zod.parse = (r, n) => (r.value === null ? r : e.innerType._zod.run(r, n))));
      })),
      (XC = N("$ZodDefault", (t, e) => {
        (Je.init(t, e),
          (t._zod.optin = "defaulted"),
          ct(t, "values", (r) => r.def.innerType._zod.values),
          (t._zod.parse = (r, n) => {
            if (n.direction === "backward") return e.innerType._zod.run(r, n);
            if (r.value === void 0) return ((r.value = e.defaultValue), r);
            let o = e.innerType._zod.run(r, n);
            return o instanceof Promise ? o.then((i) => B7(i, e)) : B7(o, e);
          }));
      })));
    ((YC = N("$ZodPrefault", (t, e) => {
      (Je.init(t, e),
        (t._zod.optin = "defaulted"),
        ct(t, "values", (r) => r.def.innerType._zod.values),
        (t._zod.parse = (r, n) => (
          n.direction === "backward" || (r.value === void 0 && (r.value = e.defaultValue)),
          e.innerType._zod.run(r, n)
        )));
    })),
      (JC = N("$ZodNonOptional", (t, e) => {
        (Je.init(t, e),
          ct(t, "values", (r) => {
            let n = r.def.innerType._zod.values;
            return n ? new Set([...n].filter((o) => o !== void 0)) : void 0;
          }),
          (t._zod.parse = (r, n) => {
            let o = e.innerType._zod.run(r, n);
            return o instanceof Promise ? o.then((i) => F7(i, t)) : F7(o, t);
          }));
      })));
    QC = N("$ZodSuccess", (t, e) => {
      (Je.init(t, e),
        (t._zod.parse = (r, n) => {
          if (n.direction === "backward") throw new zc("ZodSuccess");
          let o = e.innerType._zod.run(r, n);
          return o instanceof Promise
            ? o.then((i) => ((r.value = i.issues.length === 0), r))
            : ((r.value = o.issues.length === 0), r);
        }));
    });
    ((eT = N("$ZodCatch", (t, e) => {
      (Je.init(t, e),
        ct(t, "optin", (r) =>
          r.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional",
        ),
        ct(t, "optout", (r) => r.def.innerType._zod.optout),
        ct(t, "values", (r) => r.def.innerType._zod.values),
        (t._zod.parse = (r, n) => {
          if (n.direction === "backward") return e.innerType._zod.run(r, n);
          let o = e.innerType._zod.run({ value: r.value, issues: [] }, n);
          return o instanceof Promise ? o.then((i) => $7(r, i, e, n)) : $7(r, o, e, n);
        }));
    })),
      (tT = N("$ZodNaN", (t, e) => {
        (Je.init(t, e),
          (t._zod.parse = (r, n) => (
            (typeof r.value != "number" || !Number.isNaN(r.value)) &&
              r.issues.push({ input: r.value, inst: t, expected: "nan", code: "invalid_type" }),
            r
          )));
      })),
      (Yb = N("$ZodPipe", (t, e) => {
        (Je.init(t, e),
          ct(t, "values", (r) => r.def.in._zod.values),
          ct(t, "optin", (r) => r.def.in._zod.optin),
          ct(t, "optout", (r) => r.def.out._zod.optout),
          ct(t, "propValues", (r) => r.def.in._zod.propValues),
          (t._zod.parse = (r, n) => {
            if (n.direction === "backward") {
              let i = e.out._zod.run(r, n);
              return i instanceof Promise ? i.then((s) => WE(s, e.in, n)) : WE(i, e.in, n);
            }
            let o = e.in._zod.run(r, n);
            return o instanceof Promise ? o.then((i) => WE(i, e.out, n)) : WE(o, e.out, n);
          }));
      })));
    gh = N("$ZodCodec", (t, e) => {
      (Je.init(t, e),
        ct(t, "values", (r) => r.def.in._zod.values),
        ct(t, "optin", (r) => r.def.in._zod.optin),
        ct(t, "optout", (r) => r.def.out._zod.optout),
        ct(t, "propValues", (r) => r.def.in._zod.propValues),
        (t._zod.parse = (r, n) => {
          if ((n.direction || "forward") === "forward") {
            let i = e.in._zod.run(r, n);
            return i instanceof Promise ? i.then((s) => HE(s, e, n)) : HE(i, e, n);
          } else {
            let i = e.out._zod.run(r, n);
            return i instanceof Promise ? i.then((s) => HE(s, e, n)) : HE(i, e, n);
          }
        }));
    });
    ((V1 = N("$ZodPreprocess", (t, e) => {
      Yb.init(t, e);
    })),
      (rT = N("$ZodReadonly", (t, e) => {
        (Je.init(t, e),
          ct(t, "propValues", (r) => r.def.innerType._zod.propValues),
          ct(t, "values", (r) => r.def.innerType._zod.values),
          ct(t, "optin", (r) => r.def.innerType?._zod?.optin),
          ct(t, "optout", (r) => r.def.innerType?._zod?.optout),
          (t._zod.parse = (r, n) => {
            if (n.direction === "backward") return e.innerType._zod.run(r, n);
            let o = e.innerType._zod.run(r, n);
            return o instanceof Promise ? o.then(U7) : U7(o);
          }));
      })));
    ((nT = N("$ZodTemplateLiteral", (t, e) => {
      Je.init(t, e);
      let r = [];
      for (let n of e.parts)
        if (typeof n == "object" && n !== null) {
          let o = B1(n);
          if (!o)
            throw new Error(
              `Invalid template literal part, no pattern found: ${[...n._zod.traits].shift()}`,
            );
          r.push(Fl(o));
        } else if (n === null || yF.has(typeof n)) r.push(Yi(`${n}`));
        else throw new Error(`Invalid template literal part: ${n}`);
      ((t._zod.pattern = new RegExp(`^${r.join("")}$`)),
        (t._zod.parse = (n, o) =>
          typeof n.value != "string"
            ? (n.issues.push({ input: n.value, inst: t, expected: "string", code: "invalid_type" }),
              n)
            : ((t._zod.pattern.lastIndex = 0),
              t._zod.pattern.test(n.value) ||
                n.issues.push({
                  input: n.value,
                  inst: t,
                  code: "invalid_format",
                  format: e.format ?? "template_literal",
                  pattern: t._zod.pattern.source,
                }),
              n)));
    })),
      (oT = N(
        "$ZodFunction",
        (t, e) => (
          Je.init(t, e),
          Object.defineProperty(t, "_def", { value: e }),
          (t._zod.def = e),
          (t.implement = (r) => {
            if (typeof r != "function")
              throw new Error("implement() must be called with a function");
            return Object.defineProperty(
              function (...n) {
                let o = t._def.input ? tp(t._def.input, n) : n,
                  i = Reflect.apply(r, this, o);
                return t._def.output ? tp(t._def.output, i) : i;
              },
              "_zod",
              { value: t._zod, enumerable: !1 },
            );
          }),
          (t.implementAsync = (r) => {
            if (typeof r != "function")
              throw new Error("implementAsync() must be called with a function");
            return Object.defineProperty(
              async function (...n) {
                let o = t._def.input ? await rp(t._def.input, n) : n,
                  i = await Reflect.apply(r, this, o);
                return t._def.output ? await rp(t._def.output, i) : i;
              },
              "_zod",
              { value: t._zod, enumerable: !1 },
            );
          }),
          (t._zod.parse = (r, n) =>
            typeof r.value != "function"
              ? (r.issues.push({
                  code: "invalid_type",
                  expected: "function",
                  input: r.value,
                  inst: t,
                }),
                r)
              : (t._def.output && t._def.output._zod.def.type === "promise"
                  ? (r.value = t.implementAsync(r.value))
                  : (r.value = t.implement(r.value)),
                r)),
          (t.input = (...r) => {
            let n = t.constructor;
            return Array.isArray(r[0])
              ? new n({
                  type: "function",
                  input: new Zb({ type: "tuple", items: r[0], rest: r[1] }),
                  output: t._def.output,
                })
              : new n({ type: "function", input: r[0], output: t._def.output });
          }),
          (t.output = (r) => {
            let n = t.constructor;
            return new n({ type: "function", input: t._def.input, output: r });
          }),
          t
        ),
      )),
      (iT = N("$ZodPromise", (t, e) => {
        (Je.init(t, e),
          (t._zod.parse = (r, n) =>
            Promise.resolve(r.value).then((o) =>
              e.innerType._zod.run({ value: o, issues: [] }, n),
            )));
      })),
      (yh = N("$ZodLazy", (t, e) => {
        (Je.init(t, e),
          fF(t._zod, "innerType", () => {
            let r = e;
            return (r._cachedInner || (r._cachedInner = e.getter()), r._cachedInner);
          }),
          ct(t, "pattern", (r) => r.innerType?._zod?.pattern),
          ct(t, "propValues", (r) => r.innerType?._zod?.propValues),
          ct(t, "optin", (r) => r.innerType?._zod?.optin ?? void 0),
          ct(t, "optout", (r) => r.innerType?._zod?.optout ?? void 0),
          (t._zod.parse = (r, n) => t._zod.innerType._zod.run(r, n)));
      })),
      (sT = N("$ZodCustom", (t, e) => {
        (ir.init(t, e),
          Je.init(t, e),
          (t._zod.parse = (r, n) => r),
          (t._zod.check = (r) => {
            let n = r.value,
              o = e.fn(n);
            if (o instanceof Promise) return o.then((i) => q7(i, r, n, t));
            q7(o, r, n, t);
          }));
      })));
  });
function Z7(t) {
  return t !== null && typeof t == "object";
}
function K1(t) {
  return t.map((e) => (e.path ? { ...e, path: e.path.slice() } : { ...e }));
}
function Qb(t, e, r) {
  let n = X7.get(t);
  if (n !== void 0) return n ? Jb : bh;
  if (e.has(t)) return Jb;
  e.add(t);
  let o = bh,
    i = (u) => {
      if (o !== Jb && u?._zod) {
        let p = Qb(u, e, r);
        p > o && (o = p);
      }
    },
    s = (u, p) => {
      let m = bh;
      for (let f of Reflect.ownKeys(u)) {
        let h = Object.getOwnPropertyDescriptor(u, f);
        if (p && !h.enumerable) continue;
        let v = h.get ? cT : h.value?._zod ? Qb(h.value, e, r) : bh;
        v > m && (m = v);
      }
      return m;
    },
    a = (u) => {
      u > o && (o = u);
    },
    l = t._zod.def,
    c = l.type;
  switch (c) {
    case "object": {
      let u = eh(l);
      (a(u ? s(u, !0) : cT), i(l.catchall));
      break;
    }
    case "array":
      i(l.element);
      break;
    case "tuple":
      for (let u of l.items) i(u);
      i(l.rest);
      break;
    case "record":
    case "map":
      (i(l.keyType), i(l.valueType));
      break;
    case "set":
      i(l.valueType);
      break;
    case "union":
      for (let u of l.options) i(u);
      break;
    case "intersection":
      (i(l.left), i(l.right));
      break;
    case "optional":
    case "nullable":
    case "default":
    case "prefault":
    case "catch":
    case "readonly":
    case "nonoptional":
    case "promise":
    case "success":
      i(l.innerType);
      break;
    case "pipe":
      (i(l.in), i(l.out));
      break;
    case "function":
      (i(l.input), i(l.output));
      break;
    case "lazy": {
      let u = l._cachedInner ?? (r ? t._zod.innerType : void 0);
      a(u ? Qb(u, e, !1) : cT);
      break;
    }
    case "template_literal":
    case "string":
    case "number":
    case "int":
    case "boolean":
    case "bigint":
    case "symbol":
    case "undefined":
    case "null":
    case "void":
    case "never":
    case "any":
    case "unknown":
    case "date":
    case "nan":
    case "enum":
    case "literal":
    case "file":
    case "transform":
    case "custom":
      break;
    default:
      for (let u in l) {
        let p = Object.getOwnPropertyDescriptor(l, u);
        if (!p || p.get) continue;
        let m = p.value;
        if (!(!m || typeof m != "object")) {
          if (m._zod) i(m);
          else if (Array.isArray(m)) for (let f of m) i(f);
        }
      }
  }
  return (e.delete(t), pZe(t, o));
}
function pZe(t, e) {
  return (e !== cT && X7.set(t, e === Jb), e);
}
function dT(t) {
  return Qb(t, new Set(), !0) !== bh;
}
function mZe(t, e) {
  let r = t.buckets.get(e);
  return (r || ((r = new WeakMap()), t.buckets.set(e, r)), r);
}
function eS() {
  return fZe;
}
function pT(t, e) {
  let r = t[Z1]?.backEdges;
  return r !== void 0 && Z7(e) && r.has(e);
}
var uT,
  Z1,
  K7,
  X7,
  bh,
  cT,
  Jb,
  aT,
  lT,
  fZe,
  X1 = g(() => {
    me();
    ((uT = class extends Error {
      constructor() {
        (super("Cannot parse a reference cycle that closes through a transform"),
          (this.name = "ZodCyclicError"));
      }
    }),
      (Z1 = "~memo"),
      (K7 = []));
    ((X7 = new WeakMap()), (bh = 0), (cT = 1), (Jb = 2));
    ((lT = []),
      (fZe = {
        alloc(t, e, r) {
          let n = aT;
          if (!n) return r;
          aT = void 0;
          let o = { value: r, issues: null };
          return (n.set(e.value, o), lT.push(o), r);
        },
        guard(t) {
          var e;
          ((e = t._zod).deferred ?? (e.deferred = []),
            t._zod.deferred.push(() => {
              let r = t._zod.parse,
                n = (o, i) => {
                  if (i.direction !== "backward" && pT(i, o.value)) throw new uT();
                  return r(o, i);
                };
              ((t._zod.parse = n), t._zod.run === r && (t._zod.run = n));
            }));
        },
        attach(t) {
          var e;
          let r,
            n = !1,
            o,
            i;
          ((e = t._zod).deferred ?? (e.deferred = []),
            t._zod.deferred.push(() => {
              let s = t._zod.parse,
                a = (l, c) => {
                  if (r === void 0) {
                    let w = Qb(t, new Set(), !1);
                    if (w === bh)
                      return ((t._zod.parse = s), t._zod.run === a && (t._zod.run = s), s(l, c));
                    w === Jb || n ? (r = !0) : (n = !0);
                  }
                  let u = l.value;
                  if (!Z7(u)) return s(l, c);
                  let p = c[Z1];
                  p || ((p = { buckets: new WeakMap(), backEdges: void 0 }), (c[Z1] = p));
                  let m;
                  o === c ? (m = i) : ((m = mZe(p, t)), (o = c), (i = m));
                  let f = m.get(u);
                  if (f)
                    return (
                      (l.value = f.value),
                      f.issues
                        ? f.issues.length && l.issues.push(...K1(f.issues))
                        : ((l.memo = !0),
                          p.backEdges ?? (p.backEdges = new WeakSet()),
                          p.backEdges.add(f.value)),
                      l
                    );
                  aT = m;
                  let h = lT.length,
                    v = s(l, c);
                  aT = void 0;
                  let y = lT.length > h ? lT.pop() : void 0;
                  return v instanceof Promise
                    ? v.then((w) => (y && (y.issues = w.issues.length ? K1(w.issues) : K7), w))
                    : (y && (y.issues = v.issues.length ? K1(v.issues) : K7), v);
                };
              ((t._zod.parse = a), t._zod.run === s && (t._zod.run = a));
            }));
        },
      }));
  });
function Y7() {
  return { localeError: hZe() };
}
var hZe,
  J7 = g(() => {
    me();
    hZe = () => {
      let t = {
        string: { unit: "\u062D\u0631\u0641", verb: "\u0623\u0646 \u064A\u062D\u0648\u064A" },
        file: { unit: "\u0628\u0627\u064A\u062A", verb: "\u0623\u0646 \u064A\u062D\u0648\u064A" },
        array: { unit: "\u0639\u0646\u0635\u0631", verb: "\u0623\u0646 \u064A\u062D\u0648\u064A" },
        set: { unit: "\u0639\u0646\u0635\u0631", verb: "\u0623\u0646 \u064A\u062D\u0648\u064A" },
        map: { unit: "\u0639\u0646\u0635\u0631", verb: "\u0623\u0646 \u064A\u062D\u0648\u064A" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "\u0645\u062F\u062E\u0644",
          email: "\u0628\u0631\u064A\u062F \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A",
          url: "\u0631\u0627\u0628\u0637",
          emoji: "\u0625\u064A\u0645\u0648\u062C\u064A",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime:
            "\u062A\u0627\u0631\u064A\u062E \u0648\u0648\u0642\u062A \u0628\u0645\u0639\u064A\u0627\u0631 ISO",
          date: "\u062A\u0627\u0631\u064A\u062E \u0628\u0645\u0639\u064A\u0627\u0631 ISO",
          time: "\u0648\u0642\u062A \u0628\u0645\u0639\u064A\u0627\u0631 ISO",
          duration: "\u0645\u062F\u0629 \u0628\u0645\u0639\u064A\u0627\u0631 ISO",
          ipv4: "\u0639\u0646\u0648\u0627\u0646 IPv4",
          ipv6: "\u0639\u0646\u0648\u0627\u0646 IPv6",
          mac: "\u0639\u0646\u0648\u0627\u0646 MAC",
          cidrv4:
            "\u0645\u062F\u0649 \u0639\u0646\u0627\u0648\u064A\u0646 \u0628\u0635\u064A\u063A\u0629 IPv4",
          cidrv6:
            "\u0645\u062F\u0649 \u0639\u0646\u0627\u0648\u064A\u0646 \u0628\u0635\u064A\u063A\u0629 IPv6",
          base64: "\u0646\u064E\u0635 \u0628\u062A\u0631\u0645\u064A\u0632 base64-encoded",
          base64url: "\u0646\u064E\u0635 \u0628\u062A\u0631\u0645\u064A\u0632 base64url-encoded",
          json_string: "\u0646\u064E\u0635 \u0639\u0644\u0649 \u0647\u064A\u0626\u0629 JSON",
          e164: "\u0631\u0642\u0645 \u0647\u0627\u062A\u0641 \u0628\u0645\u0639\u064A\u0627\u0631 E.164",
          credit_card:
            "\u0631\u0642\u0645 \u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u0627\u0626\u062A\u0645\u0627\u0646",
          currency_code: "\u0631\u0645\u0632 \u0627\u0644\u0639\u0645\u0644\u0629",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "\u0645\u062F\u062E\u0644",
        },
        n = { nan: "NaN" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `\u0645\u062F\u062E\u0644\u0627\u062A \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644\u0629: \u064A\u0641\u062A\u0631\u0636 \u0625\u062F\u062E\u0627\u0644 instanceof ${o.expected}\u060C \u0648\u0644\u0643\u0646 \u062A\u0645 \u0625\u062F\u062E\u0627\u0644 ${a}`
              : `\u0645\u062F\u062E\u0644\u0627\u062A \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644\u0629: \u064A\u0641\u062A\u0631\u0636 \u0625\u062F\u062E\u0627\u0644 ${i}\u060C \u0648\u0644\u0643\u0646 \u062A\u0645 \u0625\u062F\u062E\u0627\u0644 ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `\u0645\u062F\u062E\u0644\u0627\u062A \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644\u0629: \u064A\u0641\u062A\u0631\u0636 \u0625\u062F\u062E\u0627\u0644 ${z(o.values[0])}`
              : `\u0627\u062E\u062A\u064A\u0627\u0631 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062A\u0648\u0642\u0639 \u0627\u0646\u062A\u0642\u0627\u0621 \u0623\u062D\u062F \u0647\u0630\u0647 \u0627\u0644\u062E\u064A\u0627\u0631\u0627\u062A: ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? ` \u0623\u0643\u0628\u0631 \u0645\u0646 \u0627\u0644\u0644\u0627\u0632\u0645: \u064A\u0641\u062A\u0631\u0636 \u0623\u0646 \u062A\u0643\u0648\u0646 ${o.origin ?? "\u0627\u0644\u0642\u064A\u0645\u0629"} ${i} ${o.maximum.toString()} ${s.unit ?? "\u0639\u0646\u0635\u0631"}`
              : `\u0623\u0643\u0628\u0631 \u0645\u0646 \u0627\u0644\u0644\u0627\u0632\u0645: \u064A\u0641\u062A\u0631\u0636 \u0623\u0646 \u062A\u0643\u0648\u0646 ${o.origin ?? "\u0627\u0644\u0642\u064A\u0645\u0629"} ${i} ${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `\u0623\u0635\u063A\u0631 \u0645\u0646 \u0627\u0644\u0644\u0627\u0632\u0645: \u064A\u0641\u062A\u0631\u0636 \u0644\u0640 ${o.origin} \u0623\u0646 \u064A\u0643\u0648\u0646 ${i} ${o.minimum.toString()} ${s.unit}`
              : `\u0623\u0635\u063A\u0631 \u0645\u0646 \u0627\u0644\u0644\u0627\u0632\u0645: \u064A\u0641\u062A\u0631\u0636 \u0644\u0640 ${o.origin} \u0623\u0646 \u064A\u0643\u0648\u0646 ${i} ${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `\u0646\u064E\u0635 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u0628\u062F\u0623 \u0628\u0640 "${o.prefix}"`
              : i.format === "ends_with"
                ? `\u0646\u064E\u0635 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u0646\u062A\u0647\u064A \u0628\u0640 "${i.suffix}"`
                : i.format === "includes"
                  ? `\u0646\u064E\u0635 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u062A\u0636\u0645\u0651\u064E\u0646 "${i.includes}"`
                  : i.format === "regex"
                    ? `\u0646\u064E\u0635 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u0637\u0627\u0628\u0642 \u0627\u0644\u0646\u0645\u0637 ${i.pattern}`
                    : `${r[i.format] ?? o.format} \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644`;
          }
          case "not_multiple_of":
            return `\u0631\u0642\u0645 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 \u0645\u0646 \u0645\u0636\u0627\u0639\u0641\u0627\u062A ${o.divisor}`;
          case "unrecognized_keys":
            return `\u0645\u0639\u0631\u0641${o.keys.length > 1 ? "\u0627\u062A" : ""} \u063A\u0631\u064A\u0628${o.keys.length > 1 ? "\u0629" : ""}: ${B(o.keys, "\u060C ")}`;
          case "invalid_key":
            return `\u0645\u0639\u0631\u0641 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644 \u0641\u064A ${o.origin}`;
          case "invalid_union":
            return "\u0645\u062F\u062E\u0644 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644";
          case "invalid_element":
            return `\u0645\u062F\u062E\u0644 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644 \u0641\u064A ${o.origin}`;
          default:
            return "\u0645\u062F\u062E\u0644 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644";
        }
      };
    };
  });
