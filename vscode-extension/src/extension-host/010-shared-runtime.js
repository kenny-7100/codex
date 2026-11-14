function Yre(t) {
  let e = new ir({ check: "custom" });
  return ((e._zod.check = t), e);
}
function NP(t, e) {
  return YT(US, t ?? (() => !0), e);
}
function nq(t, e = {}) {
  return JT(US, t, e);
}
function oq(t, e) {
  return QT(t, e);
}
function ene(t, e = {}) {
  let r = new iq({
    type: "custom",
    check: "custom",
    fn: (n) => n instanceof t,
    abort: !0,
    ...j.normalizeParams(e),
  });
  return (
    (r._zod.bag.Class = t),
    (r._zod.check = (n) => {
      n.value instanceof t ||
        n.issues.push({
          code: "invalid_type",
          expected: t.name,
          input: n.value,
          inst: r,
          path: [...(r._zod.def.path ?? [])],
        });
    }),
    r
  );
}
function rne(t) {
  let e = eq(() => or([q(t), Ht(), en(), MS(), vt(e), lr(q(), e)]));
  return e;
}
function qS(t, e) {
  return new ZU({ type: "pipe", in: DP(t), out: e });
}
var st,
  pP,
  Wh,
  ar,
  tu,
  ru,
  nu,
  ou,
  mP,
  fP,
  _a,
  DS,
  hP,
  gP,
  yP,
  vP,
  bP,
  SP,
  wP,
  _P,
  yU,
  xP,
  AP,
  RP,
  EP,
  CP,
  TP,
  vU,
  bU,
  PP,
  fp,
  Hh,
  hp,
  jh,
  zh,
  IP,
  SU,
  wU,
  _U,
  xU,
  AU,
  RU,
  EU,
  OS,
  CU,
  NS,
  LS,
  TU,
  PU,
  IU,
  kU,
  qh,
  MU,
  OU,
  Gh,
  NU,
  LU,
  BU,
  gp,
  MP,
  $U,
  UU,
  GU,
  OP,
  jU,
  zU,
  KU,
  FS,
  $S,
  ZU,
  XU,
  JU,
  QU,
  tq,
  rq,
  US,
  Jre,
  Qre,
  iq,
  tne,
  iu = g(() => {
    po();
    po();
    Uh();
    op();
    PS();
    Y1();
    lP();
    gU();
    ((st = N("ZodType", (t, e) => (QYe(), Je.init(t, e), (t.def = e), (t.type = e.type), t), {
      check(...t) {
        let e = this.def;
        return this.clone(
          j.mergeDefs(e, {
            checks: [
              ...(e.checks ?? []),
              ...t.map((r) =>
                typeof r == "function"
                  ? { _zod: { check: r, def: { check: "custom" }, onattach: [] } }
                  : r,
              ),
            ],
          }),
          { parent: !0 },
        );
      },
      with(...t) {
        return this.check(...t);
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
      refine(t, e) {
        return this.check(nq(t, e));
      },
      superRefine(t, e) {
        return this.check(oq(t, e));
      },
      overwrite(t) {
        return this.check(Ts(t));
      },
      optional() {
        return sr(this);
      },
      exactOptional() {
        return FU(this);
      },
      nullable() {
        return kS(this);
      },
      nullish() {
        return sr(kS(this));
      },
      nonoptional(t) {
        return HU(this, t);
      },
      array() {
        return vt(this);
      },
      or(t) {
        return or([this, t]);
      },
      and(t) {
        return Vh(this, t);
      },
      transform(t) {
        return dP(this, DP(t));
      },
      default(t) {
        return qU(this, t);
      },
      prefault(t) {
        return WU(this, t);
      },
      catch(t) {
        return VU(this, t);
      },
      pipe(t) {
        return dP(this, t);
      },
      readonly() {
        return YU(this);
      },
      describe(t) {
        let e = this.clone();
        return (zn.add(e, { description: t }), e);
      },
      meta(...t) {
        if (t.length === 0) return zn.get(this);
        let e = this.clone();
        return (zn.add(e, t[0]), e);
      },
      isOptional() {
        return this.safeParse(void 0).success;
      },
      isNullable() {
        return this.safeParse(null).success;
      },
      apply(t, ...e) {
        return e.length === 0 ? t(this) : t(this, ...e);
      },
      get "~standard"() {
        return j.hide(this, "~standard", {
          ...VE(this),
          jsonSchema: { input: Bh(this, "input"), output: Bh(this, "output") },
        });
      },
      set "~standard"(t) {
        j.own(this, "~standard", t);
      },
      parse: function t(e, r) {
        return oU(this, e, r, { callee: t });
      },
      parseAsync: async function t(e, r) {
        return await iU(this, e, r, { callee: t });
      },
      safeParse(t, e) {
        return sU(this, t, e);
      },
      async safeParseAsync(t, e) {
        return aU(this, t, e);
      },
      get spa() {
        return this?.safeParseAsync;
      },
      set spa(t) {
        j.own(this, "spa", t);
      },
      validate(t, e) {
        return uh(this, t, e);
      },
      validateAsync(t, e) {
        return dh(this, t, e);
      },
      encode: function t(e, r) {
        return lU(this, e, r, { callee: t });
      },
      decode: function t(e, r) {
        return cU(this, e, r, { callee: t });
      },
      encodeAsync: async function t(e, r) {
        return await uU(this, e, r, { callee: t });
      },
      decodeAsync: async function t(e, r) {
        return await dU(this, e, r, { callee: t });
      },
      safeEncode(t, e) {
        return pU(this, t, e);
      },
      safeDecode(t, e) {
        return mU(this, t, e);
      },
      async safeEncodeAsync(t, e) {
        return fU(this, t, e);
      },
      async safeDecodeAsync(t, e) {
        return hU(this, t, e);
      },
      toJSONSchema(t) {
        return g$(this, {})(t);
      },
      get description() {
        return zn.get(this)?.description;
      },
      get _def() {
        return this._zod.def;
      },
    })),
      (pP = N(
        "_ZodString",
        (t, e) => {
          (Vc.init(t, e), st.init(t, e), (t._zod.processJSONSchema = (r, n, o) => b$(t, r, n, o)));
        },
        j.derived(
          {
            format: (t) => bn(t).format ?? null,
            minLength: (t) => bn(t).minimum ?? null,
            maxLength: (t) => bn(t).maximum ?? null,
          },
          {
            regex(...t) {
              return this.check(Ah(...t));
            },
            includes(...t) {
              return this.check(Ch(...t));
            },
            startsWith(...t) {
              return this.check(Th(...t));
            },
            endsWith(...t) {
              return this.check(Ph(...t));
            },
            min(...t) {
              return this.check(Ul(...t));
            },
            max(...t) {
              return this.check(up(...t));
            },
            length(...t) {
              return this.check(dp(...t));
            },
            nonempty(...t) {
              return this.check(Ul(1, ...t));
            },
            lowercase(t) {
              return this.check(Rh(t));
            },
            uppercase(t) {
              return this.check(Eh(t));
            },
            trim() {
              return this.check(Mh());
            },
            normalize(...t) {
              return this.check(Dh(...t));
            },
            toLowerCase() {
              return this.check(Oh());
            },
            toUpperCase() {
              return this.check(Nh());
            },
            slugify() {
              return this.check(Lh());
            },
          },
        ),
      )),
      (Wh = N(
        "ZodString",
        (t, e) => {
          (Vc.init(t, e), pP.init(t, e));
        },
        {
          email(t) {
            return this.check(nS(mP, t));
          },
          url(t) {
            return this.check(xh(DS, t));
          },
          jwt(t) {
            return this.check(xS(PP, t));
          },
          emoji(t) {
            return this.check(cS(hP, t));
          },
          guid(t) {
            return this.check(oS(fP, t));
          },
          uuid(t) {
            return this.check(iS(_a, t));
          },
          uuidv4(t) {
            return this.check(sS(_a, t));
          },
          uuidv6(t) {
            return this.check(aS(_a, t));
          },
          uuidv7(t) {
            return this.check(lS(_a, t));
          },
          nanoid(t) {
            return this.check(uS(gP, t));
          },
          cuid(t) {
            return this.check(dS(yP, t));
          },
          cuid2(t) {
            return this.check(pS(vP, t));
          },
          ulid(t) {
            return this.check(mS(bP, t));
          },
          base64(t) {
            return this.check(SS(EP, t));
          },
          base64url(t) {
            return this.check(wS(CP, t));
          },
          xid(t) {
            return this.check(fS(SP, t));
          },
          ksuid(t) {
            return this.check(hS(wP, t));
          },
          ipv4(t) {
            return this.check(gS(_P, t));
          },
          ipv6(t) {
            return this.check(yS(xP, t));
          },
          cidrv4(t) {
            return this.check(vS(AP, t));
          },
          cidrv6(t) {
            return this.check(bS(RP, t));
          },
          e164(t) {
            return this.check(_S(TP, t));
          },
          datetime(t) {
            return this.check(AS(tu, t));
          },
          date(t) {
            return this.check(RS(ru, t));
          },
          time(t) {
            return this.check(ES(nu, t));
          },
          duration(t) {
            return this.check(CS(ou, t));
          },
        },
      )));
    ((ar = N("ZodStringFormat", (t, e) => {
      (Yt.init(t, e), pP.init(t, e));
    })),
      (tu = N("ZodISODateTime", (t, e) => {
        (U1.init(t, e), ar.init(t, e));
      })),
      (ru = N("ZodISODate", (t, e) => {
        (q1.init(t, e), ar.init(t, e));
      })),
      (nu = N("ZodISOTime", (t, e) => {
        (G1.init(t, e), ar.init(t, e));
      })),
      (ou = N("ZodISODuration", (t, e) => {
        (W1.init(t, e), ar.init(t, e));
      })),
      (mP = N("ZodEmail", (t, e) => {
        (XE.init(t, e), ar.init(t, e));
      })));
    fP = N("ZodGUID", (t, e) => {
      (KE.init(t, e), ar.init(t, e));
    });
    _a = N("ZodUUID", (t, e) => {
      (ZE.init(t, e), ar.init(t, e));
    });
    DS = N("ZodURL", (t, e) => {
      (eC.init(t, e), ar.init(t, e));
    });
    hP = N("ZodEmoji", (t, e) => {
      (tC.init(t, e), ar.init(t, e));
    });
    gP = N("ZodNanoID", (t, e) => {
      (rC.init(t, e), ar.init(t, e));
    });
    yP = N("ZodCUID", (t, e) => {
      (nC.init(t, e), ar.init(t, e));
    });
    vP = N("ZodCUID2", (t, e) => {
      (oC.init(t, e), ar.init(t, e));
    });
    bP = N("ZodULID", (t, e) => {
      (iC.init(t, e), ar.init(t, e));
    });
    SP = N("ZodXID", (t, e) => {
      (sC.init(t, e), ar.init(t, e));
    });
    wP = N("ZodKSUID", (t, e) => {
      (aC.init(t, e), ar.init(t, e));
    });
    _P = N("ZodIPv4", (t, e) => {
      (lC.init(t, e), ar.init(t, e));
    });
    yU = N("ZodMAC", (t, e) => {
      (uC.init(t, e), ar.init(t, e));
    });
    xP = N("ZodIPv6", (t, e) => {
      (cC.init(t, e), ar.init(t, e));
    });
    AP = N("ZodCIDRv4", (t, e) => {
      (dC.init(t, e), ar.init(t, e));
    });
    RP = N("ZodCIDRv6", (t, e) => {
      (mC.init(t, e), ar.init(t, e));
    });
    EP = N("ZodBase64", (t, e) => {
      (hC.init(t, e), ar.init(t, e));
    });
    CP = N("ZodBase64URL", (t, e) => {
      (yC.init(t, e), ar.init(t, e));
    });
    TP = N("ZodE164", (t, e) => {
      (vC.init(t, e), ar.init(t, e));
    });
    vU = N("ZodCreditCard", (t, e) => {
      (SC.init(t, e), ar.init(t, e));
    });
    bU = N("ZodIBAN", (t, e) => {
      (_C.init(t, e), ar.init(t, e));
    });
    PP = N("ZodJWT", (t, e) => {
      (AC.init(t, e), ar.init(t, e));
    });
    fp = N("ZodCustomStringFormat", (t, e) => {
      (RC.init(t, e), ar.init(t, e));
    });
    Hh = N(
      "ZodNumber",
      (t, e) => {
        (Vb.init(t, e),
          st.init(t, e),
          (t._zod.processJSONSchema = (r, n, o) => S$(t, r, n, o)),
          (t.isFinite = !0));
      },
      j.derived(
        {
          minValue: (t) => {
            let { minimum: e, exclusiveMinimum: r } = bn(t);
            return Math.max(e ?? Number.NEGATIVE_INFINITY, r ?? Number.NEGATIVE_INFINITY);
          },
          maxValue: (t) => {
            let { maximum: e, exclusiveMaximum: r } = bn(t);
            return Math.min(e ?? Number.POSITIVE_INFINITY, r ?? Number.POSITIVE_INFINITY);
          },
          isInt: (t) => {
            let { isInt: e, multipleOf: r } = bn(t);
            return !!e || !!r?.some(Number.isSafeInteger);
          },
          format: (t) => bn(t).format ?? null,
        },
        {
          gt(t, e) {
            return this.check(Sa(t, e));
          },
          gte(t, e) {
            return this.check(Ci(t, e));
          },
          min(t, e) {
            return this.check(Ci(t, e));
          },
          lt(t, e) {
            return this.check(ba(t, e));
          },
          lte(t, e) {
            return this.check(Ei(t, e));
          },
          max(t, e) {
            return this.check(Ei(t, e));
          },
          int(t) {
            return this.check(uP(t));
          },
          safe(t) {
            return this.check(uP(t));
          },
          positive(t) {
            return this.check(Sa(0, t));
          },
          nonnegative(t) {
            return this.check(Ci(0, t));
          },
          negative(t) {
            return this.check(ba(0, t));
          },
          nonpositive(t) {
            return this.check(Ei(0, t));
          },
          multipleOf(t, e) {
            return this.check(Zc(t, e));
          },
          step(t, e) {
            return this.check(Zc(t, e));
          },
          finite() {
            return this;
          },
        },
      ),
    );
    hp = N("ZodNumberFormat", (t, e) => {
      (EC.init(t, e), Hh.init(t, e));
    });
    jh = N("ZodBoolean", (t, e) => {
      (fh.init(t, e), st.init(t, e), (t._zod.processJSONSchema = (r, n, o) => w$(t, r, n, o)));
    });
    zh = N(
      "ZodBigInt",
      (t, e) => {
        (Kb.init(t, e), st.init(t, e), (t._zod.processJSONSchema = (r, n, o) => _$(t, r, n, o)));
      },
      j.derived(
        {
          minValue: (t) => bn(t).minimum ?? null,
          maxValue: (t) => bn(t).maximum ?? null,
          format: (t) => bn(t).format ?? null,
        },
        {
          gte(t, e) {
            return this.check(Ci(t, e));
          },
          min(t, e) {
            return this.check(Ci(t, e));
          },
          gt(t, e) {
            return this.check(Sa(t, e));
          },
          lt(t, e) {
            return this.check(ba(t, e));
          },
          lte(t, e) {
            return this.check(Ei(t, e));
          },
          max(t, e) {
            return this.check(Ei(t, e));
          },
          positive(t) {
            return this.check(Sa(BigInt(0), t));
          },
          negative(t) {
            return this.check(ba(BigInt(0), t));
          },
          nonpositive(t) {
            return this.check(Ei(BigInt(0), t));
          },
          nonnegative(t) {
            return this.check(Ci(BigInt(0), t));
          },
          multipleOf(t, e) {
            return this.check(Zc(t, e));
          },
        },
      ),
    );
    IP = N("ZodBigIntFormat", (t, e) => {
      (CC.init(t, e), zh.init(t, e));
    });
    SU = N("ZodSymbol", (t, e) => {
      (TC.init(t, e), st.init(t, e), (t._zod.processJSONSchema = (r, n, o) => x$(t, r, n, o)));
    });
    wU = N("ZodUndefined", (t, e) => {
      (PC.init(t, e), st.init(t, e), (t._zod.processJSONSchema = (r, n, o) => R$(t, r, n, o)));
    });
    _U = N("ZodNull", (t, e) => {
      (IC.init(t, e), st.init(t, e), (t._zod.processJSONSchema = (r, n, o) => A$(t, r, n, o)));
    });
    xU = N("ZodAny", (t, e) => {
      (kC.init(t, e), st.init(t, e), (t._zod.processJSONSchema = (r, n, o) => T$(t, r, n, o)));
    });
    AU = N("ZodUnknown", (t, e) => {
      (DC.init(t, e), st.init(t, e), (t._zod.processJSONSchema = (r, n, o) => P$(t, r, n, o)));
    });
    RU = N("ZodNever", (t, e) => {
      (MC.init(t, e), st.init(t, e), (t._zod.processJSONSchema = (r, n, o) => C$(t, r, n, o)));
    });
    EU = N("ZodVoid", (t, e) => {
      (OC.init(t, e), st.init(t, e), (t._zod.processJSONSchema = (r, n, o) => E$(t, r, n, o)));
    });
    OS = N(
      "ZodDate",
      (t, e) => {
        (NC.init(t, e),
          st.init(t, e),
          (t._zod.processJSONSchema = (r, n, o) => I$(t, r, n, o)),
          (t.min = (r, n) => t.check(Ci(r, n))),
          (t.max = (r, n) => t.check(Ei(r, n))));
      },
      j.derived(
        {
          minDate: (t) => {
            let { minimum: e } = bn(t);
            return e ? new Date(e) : null;
          },
          maxDate: (t) => {
            let { maximum: e } = bn(t);
            return e ? new Date(e) : null;
          },
        },
        {},
      ),
    );
    CU = N(
      "ZodArray",
      (t, e) => {
        (mp(),
          LC.init(t, e),
          st.init(t, e),
          (t._zod.processJSONSchema = (r, n, o) => G$(t, r, n, o)),
          (t.element = e.element));
      },
      {
        min(t, e) {
          return this.check(Ul(t, e));
        },
        nonempty(t) {
          return this.check(Ul(1, t));
        },
        max(t, e) {
          return this.check(up(t, e));
        },
        length(t, e) {
          return this.check(dp(t, e));
        },
        unwrap() {
          return this.element;
        },
      },
    );
    NS = N(
      "ZodObject",
      (t, e) => {
        (mp(),
          j1.init(t, e),
          st.init(t, e),
          (t._zod.processJSONSchema = (r, n, o) => W$(t, r, n, o)),
          j.installLazyProp(t, "shape", (r) => r._zod.def.shape, !1));
      },
      {
        keyof() {
          return Kn(Object.keys(this._zod.def.shape));
        },
        catchall(t) {
          return this.clone(j.mergeDefs(this._zod.def, { catchall: t }));
        },
        passthrough() {
          return this.clone(j.mergeDefs(this._zod.def, { catchall: cr() }));
        },
        loose() {
          return this.clone(j.mergeDefs(this._zod.def, { catchall: cr() }));
        },
        strict() {
          return this.clone(j.mergeDefs(this._zod.def, { catchall: kP() }));
        },
        strip() {
          return this.clone(j.mergeDefs(this._zod.def, { catchall: void 0 }));
        },
        extend(t) {
          return j.extend(this, t);
        },
        safeExtend(t) {
          return j.safeExtend(this, t);
        },
        merge(t) {
          return j.merge(this, t);
        },
        pick(t) {
          return j.pick(this, t);
        },
        omit(t) {
          return j.omit(this, t);
        },
        partial(...t) {
          return j.partial(gp, this, t[0]);
        },
        exactPartial(...t) {
          return j.partial(MP, this, t[0], "exactPartial");
        },
        required(...t) {
          return j.required(OP, this, t[0]);
        },
      },
    );
    LS = N("ZodUnion", (t, e) => {
      (hh.init(t, e),
        st.init(t, e),
        (t._zod.processJSONSchema = (r, n, o) => oP(t, r, n, o)),
        (t.options = e.options));
    });
    TU = N("ZodXor", (t, e) => {
      (LS.init(t, e),
        FC.init(t, e),
        (t._zod.processJSONSchema = (r, n, o) => oP(t, r, n, o)),
        (t.options = e.options));
    });
    PU = N("ZodDiscriminatedUnion", (t, e) => {
      (LS.init(t, e), $C.init(t, e));
    });
    IU = N("ZodIntersection", (t, e) => {
      (UC.init(t, e), st.init(t, e), (t._zod.processJSONSchema = (r, n, o) => H$(t, r, n, o)));
    });
    kU = N(
      "ZodTuple",
      (t, e) => {
        (mp(),
          Zb.init(t, e),
          st.init(t, e),
          (t._zod.processJSONSchema = (r, n, o) => j$(t, r, n, o)));
      },
      {
        rest(t) {
          return this.clone({ ...this._zod.def, rest: t });
        },
        partial() {
          let t = this._zod.def;
          if (t.checks?.length)
            throw new Error(".partial() cannot be used on tuple schemas containing refinements");
          return this.clone({
            ...t,
            items: t.items.map((e) => new gp({ type: "optional", innerType: e })),
          });
        },
      },
    );
    qh = N("ZodRecord", (t, e) => {
      (mp(),
        qC.init(t, e),
        st.init(t, e),
        (t._zod.processJSONSchema = (r, n, o) => z$(t, r, n, o)),
        (t.keyType = e.keyType),
        (t.valueType = e.valueType));
    });
    MU = N("ZodMap", (t, e) => {
      (mp(),
        GC.init(t, e),
        st.init(t, e),
        (t._zod.processJSONSchema = (r, n, o) => U$(t, r, n, o)),
        (t.keyType = e.keyType),
        (t.valueType = e.valueType),
        (t.min = (...r) => t.check(wa(...r))),
        (t.nonempty = (r) => t.check(wa(1, r))),
        (t.max = (...r) => t.check(Xc(...r))),
        (t.size = (...r) => t.check(cp(...r))));
    });
    OU = N("ZodSet", (t, e) => {
      (mp(),
        WC.init(t, e),
        st.init(t, e),
        (t._zod.processJSONSchema = (r, n, o) => q$(t, r, n, o)),
        (t.min = (...r) => t.check(wa(...r))),
        (t.nonempty = (r) => t.check(wa(1, r))),
        (t.max = (...r) => t.check(Xc(...r))),
        (t.size = (...r) => t.check(cp(...r))));
    });
    Gh = N("ZodEnum", (t, e) => {
      (HC.init(t, e),
        st.init(t, e),
        (t._zod.processJSONSchema = (n, o, i) => k$(t, n, o, i)),
        (t.enum = e.entries),
        (t.options = [...t._zod.values]));
      let r = new Set(Object.keys(e.entries));
      ((t.extract = (n, o) => {
        let i = {};
        for (let s of n)
          if (r.has(s)) i[s] = e.entries[s];
          else throw new Error(`Key ${s} not found in enum`);
        return new Gh({ ...e, checks: [], ...j.normalizeParams(o), entries: i });
      }),
        (t.exclude = (n, o) => {
          let i = { ...e.entries };
          for (let s of n)
            if (r.has(s)) delete i[s];
            else throw new Error(`Key ${s} not found in enum`);
          return new Gh({ ...e, checks: [], ...j.normalizeParams(o), entries: i });
        }));
    });
    NU = N("ZodLiteral", (t, e) => {
      (jC.init(t, e),
        st.init(t, e),
        (t._zod.processJSONSchema = (r, n, o) => D$(t, r, n, o)),
        (t.values = new Set(e.values)),
        Object.defineProperty(t, "value", {
          get() {
            if (e.values.length > 1)
              throw new Error(
                "This schema contains multiple valid literal values. Use `.values` instead.",
              );
            return e.values[0];
          },
        }));
    });
    LU = N("ZodFile", (t, e) => {
      (zC.init(t, e),
        st.init(t, e),
        (t._zod.processJSONSchema = (r, n, o) => N$(t, r, n, o)),
        (t.min = (r, n) => t.check(wa(r, n))),
        (t.max = (r, n) => t.check(Xc(r, n))),
        (t.mime = (r, n) => t.check(kh(Array.isArray(r) ? r : [r], n))));
    });
    BU = N("ZodTransform", (t, e) => {
      (mp(),
        VC.init(t, e),
        st.init(t, e),
        (t._zod.processJSONSchema = (r, n, o) => $$(t, r, n, o)),
        (t._zod.parse = (r, n) => {
          if (n.direction === "backward") throw new zc(t.constructor.name);
          r.addIssue = (i) => {
            if (typeof i == "string") r.issues.push(j.issue(i, r.value, e));
            else {
              let s = i;
              (s.fatal && (s.continue = !1),
                s.code ?? (s.code = "custom"),
                "input" in s || (s.input = r.value),
                s.inst ?? (s.inst = t),
                r.issues.push(j.issue(s)));
            }
          };
          let o = e.transform(r.value, r);
          return o instanceof Promise ? o.then((i) => ((r.value = i), r)) : ((r.value = o), r);
        }));
    });
    gp = N("ZodOptional", (t, e) => {
      (Xb.init(t, e),
        st.init(t, e),
        (t._zod.processJSONSchema = (r, n, o) => iP(t, r, n, o)),
        (t.unwrap = () => t._zod.def.innerType));
    });
    MP = N("ZodExactOptional", (t, e) => {
      (KC.init(t, e),
        st.init(t, e),
        (t._zod.processJSONSchema = (r, n, o) => iP(t, r, n, o)),
        (t.unwrap = () => t._zod.def.innerType));
    });
    $U = N("ZodNullable", (t, e) => {
      (ZC.init(t, e),
        st.init(t, e),
        (t._zod.processJSONSchema = (r, n, o) => V$(t, r, n, o)),
        (t.unwrap = () => t._zod.def.innerType));
    });
    UU = N("ZodDefault", (t, e) => {
      (XC.init(t, e),
        st.init(t, e),
        (t._zod.processJSONSchema = (r, n, o) => X$(t, r, n, o)),
        (t.unwrap = () => t._zod.def.innerType),
        (t.removeDefault = t.unwrap));
    });
    GU = N("ZodPrefault", (t, e) => {
      (YC.init(t, e),
        st.init(t, e),
        (t._zod.processJSONSchema = (r, n, o) => Y$(t, r, n, o)),
        (t.unwrap = () => t._zod.def.innerType));
    });
    OP = N("ZodNonOptional", (t, e) => {
      (JC.init(t, e),
        st.init(t, e),
        (t._zod.processJSONSchema = (r, n, o) => K$(t, r, n, o)),
        (t.unwrap = () => t._zod.def.innerType));
    });
    jU = N("ZodSuccess", (t, e) => {
      (QC.init(t, e),
        st.init(t, e),
        (t._zod.processJSONSchema = (r, n, o) => L$(t, r, n, o)),
        (t.unwrap = () => t._zod.def.innerType));
    });
    zU = N("ZodCatch", (t, e) => {
      (eT.init(t, e),
        st.init(t, e),
        (t._zod.processJSONSchema = (r, n, o) => J$(t, r, n, o)),
        (t.unwrap = () => t._zod.def.innerType),
        (t.removeCatch = t.unwrap));
    });
    KU = N("ZodNaN", (t, e) => {
      (tT.init(t, e), st.init(t, e), (t._zod.processJSONSchema = (r, n, o) => M$(t, r, n, o)));
    });
    FS = N("ZodPipe", (t, e) => {
      (Yb.init(t, e),
        st.init(t, e),
        (t._zod.processJSONSchema = (r, n, o) => Q$(t, r, n, o)),
        (t.in = e.in),
        (t.out = e.out));
    });
    $S = N("ZodCodec", (t, e) => {
      (FS.init(t, e), gh.init(t, e));
    });
    ((ZU = N("ZodPreprocess", (t, e) => {
      (FS.init(t, e), V1.init(t, e));
    })),
      (XU = N("ZodReadonly", (t, e) => {
        (rT.init(t, e),
          st.init(t, e),
          (t._zod.processJSONSchema = (r, n, o) => eU(t, r, n, o)),
          (t.unwrap = () => t._zod.def.innerType));
      })));
    JU = N("ZodTemplateLiteral", (t, e) => {
      (nT.init(t, e), st.init(t, e), (t._zod.processJSONSchema = (r, n, o) => O$(t, r, n, o)));
    });
    QU = N("ZodLazy", (t, e) => {
      (yh.init(t, e),
        st.init(t, e),
        (t._zod.processJSONSchema = (r, n, o) => rU(t, r, n, o)),
        (t.unwrap = () => t._zod.def.getter()));
    });
    tq = N("ZodPromise", (t, e) => {
      (iT.init(t, e),
        st.init(t, e),
        (t._zod.processJSONSchema = (r, n, o) => tU(t, r, n, o)),
        (t.unwrap = () => t._zod.def.innerType));
    });
    rq = N("ZodFunction", (t, e) => {
      (oT.init(t, e), st.init(t, e), (t._zod.processJSONSchema = (r, n, o) => F$(t, r, n, o)));
    });
    US = N("ZodCustom", (t, e) => {
      (sT.init(t, e), st.init(t, e), (t._zod.processJSONSchema = (r, n, o) => B$(t, r, n, o)));
    });
    ((Jre = eP),
      (Qre = tP),
      (iq = N(
        "ZodInstanceOf",
        (t, e) => {
          US.init(t, e);
        },
        {
          properties(t, e) {
            return this.check(Ih(t, e));
          },
        },
      )));
    tne = (...t) => rP({ Codec: $S, Boolean: jh, String: Wh }, ...t);
  });
function tJe(t) {
  jr({ customError: t });
}
function rJe() {
  return jr().customError;
}
var eJe,
  sq,
  nne = g(() => {
    po();
    eJe = {
      invalid_type: "invalid_type",
      too_big: "too_big",
      too_small: "too_small",
      invalid_format: "invalid_format",
      not_multiple_of: "not_multiple_of",
      unrecognized_keys: "unrecognized_keys",
      invalid_union: "invalid_union",
      invalid_key: "invalid_key",
      invalid_element: "invalid_element",
      invalid_value: "invalid_value",
      custom: "custom",
    };
    sq || (sq = {});
  });
var yp = {};
Ki(yp, {
  ZodISODate: () => ru,
  ZodISODateTime: () => tu,
  ZodISODuration: () => ou,
  ZodISOTime: () => nu,
  date: () => oJe,
  datetime: () => nJe,
  duration: () => sJe,
  time: () => iJe,
});
function nJe(t) {
  return AS(tu, t);
}
function oJe(t) {
  return RS(ru, t);
}
function iJe(t) {
  return ES(nu, t);
}
function sJe(t) {
  return CS(ou, t);
}
var LP = g(() => {
  po();
  iu();
  iu();
});
function lJe(t, e) {
  let r = t.$schema;
  return r === "https://json-schema.org/draft/2020-12/schema"
    ? "draft-2020-12"
    : r === "http://json-schema.org/draft-07/schema#"
      ? "draft-7"
      : r === "http://json-schema.org/draft-04/schema#"
        ? "draft-4"
        : (e ?? "draft-2020-12");
}
function one(t, e) {
  return t.map((r, n) => (n < e ? r : r.optional()));
}
function cJe(t) {
  return t.replace(/~1/g, "/").replace(/~0/g, "~");
}
function uJe(t, e) {
  if (!t.startsWith("#"))
    throw new Error("External $ref is not supported, only local refs (#/...) are allowed");
  let r = t.slice(1).split("/").filter(Boolean);
  if (r.length === 0) return e.rootSchema;
  let n = e.version === "draft-2020-12" ? "$defs" : "definitions";
  if (r[0] === n) {
    let o = r[1] === void 0 ? void 0 : cJe(r[1]);
    if (!o || !e.defs[o]) throw new Error(`Reference not found: ${t}`);
    return e.defs[o];
  }
  throw new Error(`Reference not found: ${t}`);
}
function dJe(t, e) {
  return ve
    .transform((n) => n)
    .check((n) => {
      let o = n.value;
      if (typeof o != "object" || o === null || Array.isArray(o)) return;
      let i = Object.getOwnPropertyNames(o);
      if (
        (e.minProperties !== void 0 &&
          i.length < e.minProperties &&
          n.issues.push({
            origin: "object",
            code: "too_small",
            minimum: e.minProperties,
            inclusive: !0,
            message: `Too small: expected object to have >=${e.minProperties} properties`,
            input: o,
            inst: t,
            continue: !0,
          }),
        e.maxProperties !== void 0 &&
          i.length > e.maxProperties &&
          n.issues.push({
            origin: "object",
            code: "too_big",
            maximum: e.maxProperties,
            inclusive: !0,
            message: `Too big: expected object to have <=${e.maxProperties} properties`,
            input: o,
            inst: t,
            continue: !0,
          }),
        e.keySchema)
      )
        for (let s of i) {
          let a = e.keySchema.safeParse(s);
          a.success ||
            n.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: a.error.issues,
              input: s,
              path: [s],
              continue: !0,
            });
        }
    })
    .pipe(t);
}
function aq(t, e) {
  if (t === null) return "z";
  let r = typeof t;
  if (r !== "object") {
    if (r === "number" && Number.isNaN(t)) return null;
    let n = String(t);
    return `${r[0]}${n.length}:${n}`;
  }
  if (e.has(t)) return null;
  e.add(t);
  try {
    if (Array.isArray(t)) {
      let i = [];
      for (let s of t) {
        let a = aq(s, e);
        if (a === null) return null;
        i.push(a);
      }
      return `a${i.length}:[${i.join(",")}]`;
    }
    let n = Object.keys(t).sort(),
      o = [];
    for (let i of n) {
      let s = aq(t[i], e);
      if (s === null) return null;
      o.push(`${i.length}:${i}=${s}`);
    }
    return `o${o.length}:{${o.join(",")}}`;
  } finally {
    e.delete(t);
  }
}
function GS(t) {
  return typeof t != "object" || t === null
    ? !1
    : Array.isArray(t)
      ? t.some(GS)
      : typeof t.$ref == "string"
        ? !0
        : Object.entries(t).some(([e, r]) =>
            pJe.has(e)
              ? GS(r)
              : !mJe.has(e) || typeof r != "object" || r === null
                ? !1
                : Object.values(r).some(GS),
          );
}
function ine(t) {
  return t === 1 ? "element" : "elements";
}
function fJe(t, e) {
  return ve
    .transform((n) => n)
    .check((n) => {
      let o = n.value;
      if (Array.isArray(o)) {
        if (e.uniqueItems === !0) {
          let i = new Map();
          for (let s = 0; s < o.length; s++) {
            let a = aq(o[s], new Set());
            if (a === null) continue;
            let l = i.get(a);
            if (l === void 0) {
              i.set(a, s);
              continue;
            }
            n.issues.push({
              code: "custom",
              message: `Array items must be unique: element at index ${s} duplicates the one at index ${l}`,
              input: o,
              path: [s],
              continue: !0,
            });
          }
        }
        if (e.containsSchema) {
          let i = e.minContains ?? 1,
            s = e.maxContains !== void 0 ? e.maxContains + 1 : Number.POSITIVE_INFINITY,
            a = 0;
          for (let l of o) if (e.containsSchema.safeParse(l).success && ++a >= s) break;
          (a < i &&
            n.issues.push({
              code: "custom",
              message: `Array must contain at least ${i} matching ${ine(i)}; found ${a}`,
              input: o,
              continue: !0,
            }),
            e.maxContains !== void 0 &&
              a > e.maxContains &&
              n.issues.push({
                code: "custom",
                message: `Array must contain at most ${e.maxContains} matching ${ine(e.maxContains)}`,
                input: o,
                continue: !0,
              }));
        }
      }
    })
    .pipe(t);
}
function sne(t, e) {
  if (t !== !1) return t === void 0 || t === !0 ? ve.any() : Do(t, e);
}
function ane(t, e) {
  if (t.not !== void 0) {
    if (typeof t.not == "object" && Object.keys(t.not).length === 0) return ve.never();
    throw new Error("not is not supported in Zod (except { not: {} } for never)");
  }
  if (t.unevaluatedItems !== void 0) throw new Error("unevaluatedItems is not supported");
  if (t.unevaluatedProperties !== void 0) throw new Error("unevaluatedProperties is not supported");
  if (t.if !== void 0 || t.then !== void 0 || t.else !== void 0)
    throw new Error("Conditional schemas (if/then/else) are not supported");
  if (t.dependentSchemas !== void 0 || t.dependentRequired !== void 0)
    throw new Error("dependentSchemas and dependentRequired are not supported");
  if (t.$ref) {
    let o = t.$ref;
    if (e.refs.has(o)) return e.refs.get(o);
    if (e.processing.has(o))
      return ve.lazy(() => {
        if (!e.refs.has(o)) throw new Error(`Circular reference not resolved: ${o}`);
        return e.refs.get(o);
      });
    e.processing.add(o);
    let i = uJe(o, e),
      s = Do(i, e);
    return (e.refs.set(o, s), e.processing.delete(o), s);
  }
  if (t.enum !== void 0) {
    let o = t.enum;
    if (e.version === "openapi-3.0" && t.nullable === !0 && o.length === 1 && o[0] === null)
      return ve.null();
    if (o.length === 0) return ve.never();
    if (o.length === 1) return ve.literal(o[0]);
    if (o.every((s) => typeof s == "string")) return ve.enum(o);
    let i = o.map((s) => ve.literal(s));
    return i.length < 2 ? i[0] : ve.union([i[0], i[1], ...i.slice(2)]);
  }
  if (t.const !== void 0) return ve.literal(t.const);
  let r = t.type;
  if (Array.isArray(r)) {
    let o = r.map((i) => {
      let s = { ...t, type: i };
      return ane(s, e);
    });
    return o.length === 0 ? ve.never() : o.length === 1 ? o[0] : ve.union(o);
  }
  if (!r) return ve.any();
  let n;
  switch (r) {
    case "string": {
      let o = ve.string();
      if (t.format) {
        let i = t.format;
        i === "email"
          ? (o = o.check(ve.email()))
          : i === "uri" || i === "uri-reference"
            ? (o = o.check(ve.url()))
            : i === "uuid" || i === "guid"
              ? (o = o.check(ve.uuid()))
              : i === "date-time"
                ? (o = o.check(ve.iso.datetime({ offset: !0 })))
                : i === "date"
                  ? (o = o.check(ve.iso.date()))
                  : i === "time"
                    ? (o = o.check(ve.regex(hJe)))
                    : i === "duration"
                      ? (o = o.check(ve.iso.duration()))
                      : i === "hostname"
                        ? (o = o.check(ve.hostname()))
                        : i === "ipv4"
                          ? (o = o.check(ve.ipv4()))
                          : i === "ipv6"
                            ? (o = o.check(ve.ipv6()))
                            : i === "mac"
                              ? (o = o.check(ve.mac()))
                              : i === "cidr"
                                ? (o = o.check(ve.cidrv4()))
                                : i === "cidr-v6"
                                  ? (o = o.check(ve.cidrv6()))
                                  : i === "base64"
                                    ? (o = o.check(ve.base64()))
                                    : i === "base64url"
                                      ? (o = o.check(ve.base64url()))
                                      : i === "e164"
                                        ? (o = o.check(ve.e164()))
                                        : i === "credit_card"
                                          ? (o = o.check(ve.creditCard()))
                                          : i === "iban"
                                            ? (o = o.check(ve.iban()))
                                            : i === "jwt"
                                              ? (o = o.check(ve.jwt()))
                                              : i === "emoji"
                                                ? (o = o.check(ve.emoji()))
                                                : i === "nanoid"
                                                  ? (o = o.check(ve.nanoid()))
                                                  : i === "cuid"
                                                    ? (o = o.check(ve.cuid()))
                                                    : i === "cuid2"
                                                      ? (o = o.check(ve.cuid2()))
                                                      : i === "ulid"
                                                        ? (o = o.check(ve.ulid()))
                                                        : i === "xid"
                                                          ? (o = o.check(ve.xid()))
                                                          : i === "ksuid" &&
                                                            (o = o.check(ve.ksuid()));
      }
      (typeof t.minLength == "number" && (o = o.min(t.minLength)),
        typeof t.maxLength == "number" && (o = o.max(t.maxLength)),
        t.pattern && (o = o.regex(new RegExp(t.pattern))),
        (n = o));
      break;
    }
    case "number":
    case "integer": {
      let o = r === "integer" ? ve.number().int() : ve.number();
      (typeof t.minimum == "number" && t.exclusiveMinimum !== !0 && (o = o.min(t.minimum)),
        typeof t.maximum == "number" && t.exclusiveMaximum !== !0 && (o = o.max(t.maximum)),
        typeof t.exclusiveMinimum == "number"
          ? (o = o.gt(t.exclusiveMinimum))
          : t.exclusiveMinimum === !0 && typeof t.minimum == "number" && (o = o.gt(t.minimum)),
        typeof t.exclusiveMaximum == "number"
          ? (o = o.lt(t.exclusiveMaximum))
          : t.exclusiveMaximum === !0 && typeof t.maximum == "number" && (o = o.lt(t.maximum)),
        typeof t.multipleOf == "number" && (o = o.multipleOf(t.multipleOf)),
        (n = o));
      break;
    }
    case "boolean": {
      n = ve.boolean();
      break;
    }
    case "null": {
      n = ve.null();
      break;
    }
    case "object": {
      let o = {},
        i = t.properties || {},
        s = new Set(t.required || []),
        a = typeof t.additionalProperties == "object" ? Do(t.additionalProperties, e) : void 0;
      for (let [p, m] of Object.entries(i)) {
        let f = Do(m, e);
        jn(o, p, s.has(p) ? f : f.optional());
      }
      if (t.patternProperties) {
        let p = t.patternProperties,
          m = Object.keys(p),
          f = [];
        for (let v of m) {
          let y = Do(p[v], e),
            w = ve.string().regex(new RegExp(v));
          f.push(ve.looseRecord(w, y));
        }
        let h = [];
        if (
          (Object.keys(o).length > 0 && h.push(ve.object(o).passthrough()),
          h.push(...f),
          h.length === 0)
        )
          n = ve.object({}).passthrough();
        else if (h.length === 1) n = h[0];
        else {
          let v = ve.intersection(h[0], h[1]);
          for (let y = 2; y < h.length; y++) v = ve.intersection(v, h[y]);
          n = v;
        }
        if (t.additionalProperties === !1) {
          let v = Object.keys(o),
            y = m.map((_) => new RegExp(_)),
            w = n;
          n = n.check((_) => {
            if (!Xi(_.value)) return;
            let S = [];
            for (let E of Object.keys(_.value))
              v.includes(E) || y.some((T) => T.test(E)) || S.push(E);
            S.length &&
              _.issues.push({ code: "unrecognized_keys", keys: S, input: _.value, inst: w });
          });
        }
      } else {
        let p = ve.object(o);
        t.additionalProperties === !1
          ? (n = p.strict())
          : a
            ? (n = p.catchall(a))
            : (n = p.passthrough());
      }
      let l = t.propertyNames !== void 0 && t.propertyNames !== !0,
        c = typeof t.minProperties == "number" ? t.minProperties : void 0,
        u = typeof t.maxProperties == "number" ? t.maxProperties : void 0;
      if (l || c !== void 0 || u !== void 0) {
        let p;
        if (l) {
          let m =
            typeof t.propertyNames == "object" && t.propertyNames.type === void 0
              ? { type: "string", ...t.propertyNames }
              : t.propertyNames;
          p = Do(m, e);
        }
        n = dJe(n, { keySchema: p, minProperties: c, maxProperties: u });
      }
      break;
    }
    case "array": {
      let o = t.prefixItems,
        i = t.items;
      if (o && Array.isArray(o)) {
        let s = typeof t.minItems == "number" ? t.minItems : 0,
          a = o.map((p) => Do(p, e)),
          l = one(a, s),
          c = Array.isArray(i) ? void 0 : sne(i, e),
          u = ve.tuple(l);
        ((n = c ? u.rest(c) : u),
          typeof t.minItems == "number" && (n = n.check(ve.minLength(t.minItems))),
          typeof t.maxItems == "number" && (n = n.check(ve.maxLength(t.maxItems))));
      } else if (Array.isArray(i)) {
        let s = typeof t.minItems == "number" ? t.minItems : 0,
          a = i.map((p) => Do(p, e)),
          l = one(a, s),
          c = sne(t.additionalItems, e),
          u = ve.tuple(l);
        ((n = c ? u.rest(c) : u),
          typeof t.minItems == "number" && (n = n.check(ve.minLength(t.minItems))),
          typeof t.maxItems == "number" && (n = n.check(ve.maxLength(t.maxItems))));
      } else if (i !== void 0) {
        let s = Do(i, e),
          a = ve.array(s);
        (typeof t.minItems == "number" && (a = a.min(t.minItems)),
          typeof t.maxItems == "number" && (a = a.max(t.maxItems)),
          (n = a));
      } else n = ve.array(ve.any());
      (t.uniqueItems === !0 || t.contains !== void 0) &&
        (n = fJe(n, {
          uniqueItems: t.uniqueItems === !0,
          containsSchema: t.contains !== void 0 ? Do(t.contains, e) : void 0,
          minContains: typeof t.minContains == "number" ? t.minContains : void 0,
          maxContains: typeof t.maxContains == "number" ? t.maxContains : void 0,
        }));
      break;
    }
    default:
      throw new Error(`Unsupported type: ${r}`);
  }
  return n;
}
function Do(t, e) {
  if (typeof t == "boolean") return t ? ve.any() : ve.never();
  let r = ane(t, e),
    n = t.type || t.enum !== void 0 || t.const !== void 0;
  if (t.anyOf && Array.isArray(t.anyOf)) {
    let a = t.anyOf.map((c) => Do(c, e)),
      l = ve.union(a);
    r = n ? ve.intersection(r, l) : l;
  }
  if (t.oneOf && Array.isArray(t.oneOf)) {
    let a = t.oneOf.map((c) => Do(c, e)),
      l = ve.xor(a);
    r = n ? ve.intersection(r, l) : l;
  }
  if (t.allOf && Array.isArray(t.allOf))
    if (t.allOf.length === 0) r = n ? r : ve.any();
    else {
      let a = n ? r : Do(t.allOf[0], e),
        l = n ? 0 : 1;
      for (let c = l; c < t.allOf.length; c++) a = ve.intersection(a, Do(t.allOf[c], e));
      r = a;
    }
  (t.nullable === !0 && e.version === "openapi-3.0" && (r = ve.nullable(r)),
    t.readOnly === !0 && (r = ve.readonly(r)),
    t.default !== void 0 && (r = r.default(t.default)));
  let o = {},
    i = ["$id", "id", "$comment", "$anchor", "$vocabulary", "$dynamicRef", "$dynamicAnchor"];
  for (let a of i) a in t && (o[a] = t[a]);
  let s = ["contentEncoding", "contentMediaType", "contentSchema"];
  for (let a of s) a in t && (o[a] = t[a]);
  if (t.type === "object" && t.$ref === void 0) {
    t.propertyNames !== void 0 && !GS(t.propertyNames) && (o.propertyNames = t.propertyNames);
    for (let a of ["minProperties", "maxProperties"]) t[a] !== void 0 && (o[a] = t[a]);
  }
  if (t.type === "array" && t.$ref === void 0) {
    t.contains !== void 0 && !GS(t.contains) && (o.contains = t.contains);
    for (let a of ["uniqueItems", "minContains", "maxContains"]) t[a] !== void 0 && (o[a] = t[a]);
  }
  for (let a of Object.keys(t)) aJe.has(a) || jn(o, a, t[a]);
  return (
    Object.keys(o).length > 0 && e.registry.add(r, o),
    t.description && (r = r.describe(t.description)),
    r
  );
}
function lne(t, e) {
  if (typeof t == "boolean") return t ? ve.any() : ve.never();
  let r;
  try {
    r = JSON.parse(JSON.stringify(t));
  } catch {
    throw new Error(
      "fromJSONSchema input is not valid JSON (possibly cyclic); use $defs/$ref for recursive schemas",
    );
  }
  let n = lJe(r, e?.defaultTarget),
    o = r.$defs || r.definitions || {},
    i = {
      version: n,
      defs: o,
      refs: new Map(),
      processing: new Set(),
      rootSchema: r,
      registry: e?.registry ?? zn,
    };
  return Do(r, i);
}
var ve,
  aJe,
  pJe,
  mJe,
  hJe,
  cne = g(() => {
    rS();
    me();
    lP();
    LP();
    iu();
    ((ve = { ...Kh, ...aP, iso: yp }),
      (aJe = new Set([
        "$schema",
        "$ref",
        "$defs",
        "definitions",
        "$id",
        "id",
        "$comment",
        "$anchor",
        "$vocabulary",
        "$dynamicRef",
        "$dynamicAnchor",
        "type",
        "enum",
        "const",
        "anyOf",
        "oneOf",
        "allOf",
        "not",
        "properties",
        "required",
        "additionalProperties",
        "patternProperties",
        "propertyNames",
        "minProperties",
        "maxProperties",
        "items",
        "prefixItems",
        "additionalItems",
        "minItems",
        "maxItems",
        "uniqueItems",
        "contains",
        "minContains",
        "maxContains",
        "minLength",
        "maxLength",
        "pattern",
        "format",
        "minimum",
        "maximum",
        "exclusiveMinimum",
        "exclusiveMaximum",
        "multipleOf",
        "description",
        "default",
        "contentEncoding",
        "contentMediaType",
        "contentSchema",
        "unevaluatedItems",
        "unevaluatedProperties",
        "if",
        "then",
        "else",
        "dependentSchemas",
        "dependentRequired",
        "nullable",
        "readOnly",
      ])));
    ((pJe = new Set([
      "items",
      "prefixItems",
      "additionalItems",
      "additionalProperties",
      "contains",
      "propertyNames",
      "not",
      "if",
      "then",
      "else",
      "allOf",
      "anyOf",
      "oneOf",
      "unevaluatedItems",
      "unevaluatedProperties",
      "contentSchema",
    ])),
      (mJe = new Set([
        "properties",
        "patternProperties",
        "dependentSchemas",
        "dependencies",
        "$defs",
        "definitions",
      ])));
    hJe = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/;
  });
function WS(t, e) {
  let r =
      typeof e == "function"
        ? e
        : (s, a) => {
            let l = e[s._zod.def.type];
            return l ? l(s, a) : s;
          },
    n = new Map();
  function o(s) {
    let a = n.get(s);
    if (a === une) return new yh({ type: "lazy", getter: () => n.get(s) });
    if (a !== void 0) return a;
    n.set(s, une);
    let l = i(s),
      c = r(l, l !== s);
    return (n.set(s, c), c);
  }
  function i(s) {
    let a = s._zod.def,
      l = a.type;
    switch (l) {
      case "object": {
        let c = a.shape,
          u = Object.keys(c),
          p = !1,
          m = {};
        for (let h of u) {
          let v = o(c[h]);
          (v !== c[h] && (p = !0), (m[h] = v));
        }
        let f = a.catchall;
        return (
          a.catchall && ((f = o(a.catchall)), f !== a.catchall && (p = !0)),
          p ? Wt(s, { ...a, shape: m, catchall: f }) : s
        );
      }
      case "array": {
        let c = o(a.element);
        return c === a.element ? s : Wt(s, { ...a, element: c });
      }
      case "tuple": {
        let c = a.items,
          u = !1,
          p = [];
        for (let f of c) {
          let h = o(f);
          (h !== f && (u = !0), p.push(h));
        }
        let m = a.rest;
        return (
          a.rest && ((m = o(a.rest)), m !== a.rest && (u = !0)),
          u ? Wt(s, { ...a, items: p, rest: m }) : s
        );
      }
      case "record":
      case "map": {
        let c = o(a.keyType),
          u = o(a.valueType);
        return c === a.keyType && u === a.valueType ? s : Wt(s, { ...a, keyType: c, valueType: u });
      }
      case "set": {
        let c = o(a.valueType);
        return c === a.valueType ? s : Wt(s, { ...a, valueType: c });
      }
      case "union": {
        let c = a.options,
          u = !1,
          p = [];
        for (let m of c) {
          let f = o(m);
          (f !== m && (u = !0), p.push(f));
        }
        return u ? Wt(s, { ...a, options: p }) : s;
      }
      case "intersection": {
        let c = o(a.left),
          u = o(a.right);
        return c === a.left && u === a.right ? s : Wt(s, { ...a, left: c, right: u });
      }
      case "optional":
      case "nullable":
      case "default":
      case "prefault":
      case "catch":
      case "readonly":
      case "nonoptional":
      case "promise":
      case "success": {
        let c = o(a.innerType);
        return c === a.innerType ? s : Wt(s, { ...a, innerType: c });
      }
      case "pipe": {
        let c = o(a.in),
          u = o(a.out);
        return c === a.in && u === a.out ? s : Wt(s, { ...a, in: c, out: u });
      }
      case "function": {
        let c = o(a.input),
          u = o(a.output);
        return c === a.input && u === a.output ? s : Wt(s, { ...a, input: c, output: u });
      }
      case "lazy": {
        let c = a.getter,
          { _cachedInner: u, ...p } = a;
        return Wt(s, { ...p, getter: () => o(c()) });
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
        return s;
      default:
        return s;
    }
  }
  return o(t);
}
var une,
  lq = g(() => {
    vh();
    me();
    une = Symbol("z.visit/resolving");
  });
function dne(t) {
  return WS(t, {
    object: (e) => e.partial(),
    union: (e) => {
      let r = e._zod.def;
      return r.discriminator === void 0 ? e : or(r.options);
    },
  });
}
var pne = g(() => {
  lq();
  iu();
});
function gJe(t, e) {
  if (!e?.length) return t;
  let r = t._zod.def;
  return Wt(t, Zi(r, { checks: [...(r.checks ?? []), ...e] }), { parent: !0 });
}
function mne(t) {
  return gJe(t.out, t.checks);
}
function yJe(t) {
  return t.in._zod.traits.has("$ZodTransform") ? mne(t) : t.in;
}
function fne(t) {
  return WS(t, {
    pipe: (e) => yJe(e._zod.def),
    default: (e, r) => (r ? sr(e._zod.def.innerType) : e),
    catch: (e, r) => (r ? e._zod.def.innerType : e),
  });
}
function hne(t) {
  return WS(t, {
    pipe: (e) => mne(e._zod.def),
    prefault: (e, r) => (r ? e._zod.def.innerType : e),
  });
}
var gne = g(() => {
  me();
  lq();
  iu();
});
var cq = {};
Ki(cq, {
  bigint: () => wJe,
  boolean: () => SJe,
  date: () => _Je,
  number: () => bJe,
  string: () => vJe,
});
function vJe(t) {
  return l$(Wh, t);
}
function bJe(t) {
  return u$(Hh, t);
}
function SJe(t) {
  return d$(jh, t);
}
function wJe(t) {
  return p$(zh, t);
}
function _Je(t) {
  return m$(OS, t);
}
var yne = g(() => {
  po();
  iu();
});
var d = {};
Ki(d, {
  $brand: () => RF,
  $input: () => t$,
  $output: () => e$,
  INVALID: () => Io,
  NEVER: () => AF,
  TimePrecision: () => c$,
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
  ZodCompileAsyncError: () => Cs,
  ZodCompileUnsupportedError: () => xt,
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
  ZodError: () => YYe,
  ZodExactOptional: () => MP,
  ZodFile: () => LU,
  ZodFirstPartyTypeKind: () => sq,
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
  ZodIssueCode: () => eJe,
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
  ZodRealError: () => Qo,
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
  clone: () => Wt,
  codec: () => zre,
  coerce: () => cq,
  compile: () => i$,
  config: () => jr,
  core: () => Ps,
  creditCard: () => fre,
  cuid: () => tre,
  cuid2: () => rre,
  currencyCode: () => Sre,
  custom: () => NP,
  date: () => Mre,
  decode: () => cU,
  decodeAsync: () => dU,
  deepPartial: () => dne,
  describe: () => Jre,
  discriminatedUnion: () => BS,
  e164: () => mre,
  email: () => jte,
  emoji: () => Qte,
  encode: () => lU,
  encodeAsync: () => uU,
  endsWith: () => Ph,
  enum: () => Kn,
  exactOptional: () => FU,
  file: () => Gre,
  flattenError: () => Lb,
  float32: () => _re,
  float64: () => xre,
  formatError: () => Bb,
  fromJSONSchema: () => lne,
  function: () => Xre,
  getDiscriminatedOption: () => z1,
  getErrorMap: () => rJe,
  globalRegistry: () => zn,
  gt: () => Sa,
  gte: () => Ci,
  guid: () => zte,
  hash: () => wre,
  hex: () => bre,
  hostname: () => vre,
  httpUrl: () => Jte,
  iban: () => hre,
  includes: () => Ch,
  input: () => fne,
  instanceof: () => ene,
  int: () => uP,
  int32: () => Are,
  int64: () => Cre,
  intersection: () => Vh,
  invertCodec: () => Vre,
  ipv4: () => sre,
  ipv6: () => lre,
  iso: () => yp,
  json: () => rne,
  jwt: () => gre,
  keyof: () => Ore,
  ksuid: () => ire,
  lazy: () => eq,
  length: () => dp,
  literal: () => Me,
  locales: () => wh,
  looseObject: () => Vn,
  looseRecord: () => Fre,
  lowercase: () => Rh,
  lt: () => ba,
  lte: () => Ei,
  mac: () => are,
  map: () => $re,
  maxLength: () => up,
  maxSize: () => Xc,
  memoizer: () => eS,
  meta: () => Qre,
  mime: () => kh,
  minLength: () => Ul,
  minSize: () => wa,
  multipleOf: () => Zc,
  nan: () => jre,
  nanoid: () => ere,
  nativeEnum: () => qre,
  negative: () => zT,
  never: () => kP,
  nonnegative: () => KT,
  nonoptional: () => HU,
  nonpositive: () => VT,
  normalize: () => Dh,
  null: () => MS,
  nullable: () => kS,
  nullish: () => Wre,
  number: () => Ht,
  object: () => we,
  optional: () => sr,
  output: () => hne,
  overwrite: () => Ts,
  parse: () => oU,
  parseAsync: () => iU,
  partialRecord: () => Bre,
  pipe: () => dP,
  positive: () => jT,
  prefault: () => WU,
  preprocess: () => qS,
  prettifyError: () => IF,
  promise: () => Zre,
  properties: () => Ih,
  property: () => ZT,
  readonly: () => YU,
  record: () => lr,
  refine: () => nq,
  regex: () => Ah,
  regexes: () => Ri,
  registry: () => vT,
  safeDecode: () => mU,
  safeDecodeAsync: () => hU,
  safeEncode: () => pU,
  safeEncodeAsync: () => fU,
  safeParse: () => sU,
  safeParseAsync: () => aU,
  set: () => Ure,
  setErrorMap: () => tJe,
  size: () => cp,
  slugify: () => Lh,
  startsWith: () => Th,
  strictObject: () => Nre,
  string: () => q,
  stringFormat: () => yre,
  stringbool: () => tne,
  success: () => Hre,
  superRefine: () => oq,
  symbol: () => Pre,
  templateLiteral: () => Kre,
  toJSONSchema: () => pp,
  toLowerCase: () => Oh,
  toUpperCase: () => Nh,
  toZod: () => Cb,
  transform: () => DP,
  treeifyError: () => PF,
  trim: () => Mh,
  tuple: () => DU,
  uint32: () => Rre,
  uint64: () => Tre,
  ulid: () => nre,
  undefined: () => Ire,
  union: () => or,
  unknown: () => cr,
  uppercase: () => Eh,
  url: () => Yte,
  util: () => j,
  uuid: () => Vte,
  uuidv4: () => Kte,
  uuidv6: () => Zte,
  uuidv7: () => Xte,
  validate: () => uh,
  validateAsync: () => dh,
  void: () => Dre,
  withParser: () => bT,
  xid: () => ore,
  xor: () => Lre,
});
var BP = g(() => {
  po();
  iu();
  lP();
  nU();
  gU();
  nne();
  po();
  Uh();
  cne();
  pne();
  gne();
  gT();
  LP();
  LP();
  yne();
});
var $ = g(() => {
  BP();
  BP();
});
var T7t,
  vne = g(() => {
    "use strict";
    $();
    T7t = d.object({ suggestion: d.string().trim().nullable() });
  });
var bne = g(() => {
  "use strict";
});
var Sne = g(() => {
  "use strict";
});
function xa(t) {
  return t;
}
var HS = g(() => {
  "use strict";
});
var FP,
  $P = g(() => {
    "use strict";
    FP = "browser";
  });
function wne(t) {
  return xJe[t];
}
var UP,
  uq,
  J,
  xJe,
  vp = g(() => {
    "use strict";
    ((UP = "never"),
      (uq = "always"),
      (J = {
        STATSIG_STABLE_ID: "statsig-stable-id",
        NUX_2025_09_15: "viewed2025-09-15-nux",
        NUX_2025_09_15_FULL_CHATGPT_AUTH_VIEWED: "viewed2025-09-15-full-chatgpt-auth-nux",
        NUX_2025_09_15_APIKEY_AUTH_VIEWED: "viewed2025-09-15-apikey-auth-nux",
        WINDOWS_WSL_REMINDER_DISMISSED_AT: "windows-wsl-reminder-dismissed-date",
        SHOW_COPILOT_LOGIN_FIRST: "show-copilot-login-first",
        USE_COPILOT_AUTH_IF_AVAILABLE: "use-copilot-auth-if-available",
        COPILOT_DEFAULT_MODEL: "copilot-default-model",
        NOTIFICATIONS_TURN_MODE: "notifications-turn-mode",
        NOTIFICATIONS_PERMISSIONS_ENABLED: "notifications-permissions-enabled",
        NOTIFICATIONS_QUESTIONS_ENABLED: "notifications-questions-enabled",
        NOTIFICATIONS_DOT_ENABLED: "notifications-dot-enabled",
        AMBIENT_SUGGESTIONS_ENABLED: "ambient-suggestions-enabled",
        CODEX_MICRO_AGENT_SOURCE: "codex-micro-agent-source",
        CODEX_MICRO_LAYOUT: "codex-micro-layout",
        MAC_MENU_BAR_ENABLED: "mac-menu-bar-enabled",
        DESKTOP_FIRST_SEEN_AT_MS: "desktop-first-seen-at-ms",
        GIT_BRANCH_PREFIX: "git-branch-prefix",
        GIT_ALWAYS_FORCE_PUSH: "git-always-force-push",
        GIT_CREATE_PULL_REQUEST_AS_DRAFT: "git-create-pull-request-as-draft",
        GIT_PULL_REQUEST_MERGE_METHOD: "git-pull-request-merge-method",
        GIT_PR_POLL_INTERVAL_SECONDS: "git-pr-poll-interval-seconds",
        GIT_REVIEW_MODE: "git-review-mode",
        GIT_SHOW_SIDEBAR_PR_ICONS: "git-show-sidebar-pr-icons",
        GIT_WORKTREE_ROOT: "git-worktree-root",
        GIT_COMMIT_INSTRUCTIONS: "git-commit-instructions",
        GIT_PR_INSTRUCTIONS: "git-pr-instructions",
        WORKTREE_UPSTREAM_REFRESH_MODE: "worktree-upstream-refresh-mode",
        WORKTREE_DEFAULT_CREATION_PREFERENCE: "worktree-creation-preference",
        WORKTREE_CONFIRM_BEFORE_DELETE: "worktree-confirm-before-delete",
        WORKTREE_AUTO_CLEANUP_ENABLED: "worktree-auto-cleanup-enabled",
        WORKTREE_AUTO_CLEANUP_UNPACKAGED_OVERRIDE_ENABLED:
          "worktree-auto-cleanup-unpackaged-override-enabled",
        GLOBAL_DICTATION_FORCE_LOCK_DEBUG_ENABLED: "global-dictation-force-lock-debug-enabled",
        DEBUG_CHROME_PAGES_ENABLED: "debug-chrome-pages-enabled",
        HOTKEY_WINDOW_PROJECTLESS_DEFAULT_ENABLED: "hotkey-window-projectless-default-enabled",
        WORKTREE_KEEP_COUNT: "worktree-keep-count",
        REMOTE_CONNECTION_MAX_RETRY_ATTEMPTS: "remote-connection-max-retry-attempts",
        CODEX_MANAGED_REMOTE_CONNECTIONS: "codex-managed-remote-connections",
        CODEX_MOBILE_SETUP_COMPLETED: "codex-mobile-has-connected-device",
        REMOTE_CONNECTION_ANALYTICS_ID_BY_HOST_ID: "remote-connection-analytics-id-by-host-id",
        PERSISTED_ATOM_STATE: "persisted-atom-state",
        PRIMARY_RUNTIME_UPDATE_JITTER_MS: "primary-runtime-update-jitter-ms",
        SITE_CREATOR_BUNDLED_PLUGIN_AUTO_INSTALL_DISABLED:
          "site-creator-bundled-plugin-auto-install-disabled",
        BROWSER_USE_BUNDLED_PLUGIN_AUTO_INSTALL_DISABLED:
          "browser-use-bundled-plugin-auto-install-disabled",
        COMPUTER_USE_BUNDLED_PLUGIN_AUTO_INSTALL_DISABLED:
          "computer-use-bundled-plugin-auto-install-disabled",
        BROWSER_ANNOTATION_SCREENSHOTS_MODE: "browser-annotation-screenshots-mode",
        BROWSER_DOWNLOAD_DIRECTORY: "browser-download-directory",
        BROWSER_DOWNLOAD_PROMPT_ENABLED: "browser-download-prompt-enabled",
        DOCK_ICON_PREFERENCE: "dock-icon-preference",
        REDUCED_MOTION_PREFERENCE: "reduced-motion-preference",
        OPEN_IN_TARGET_PREFERENCES: "open-in-target-preferences",
        WORKTREE_REPOSITORY_PREFERENCES: "worktree-repository-preferences",
        DESKTOP_APP_BETA_PREFERENCES_BY_ACCOUNT_ID: "desktop-app-beta-preferences-by-account-id",
        ACTIVE_WORKSPACE_ROOTS: "active-workspace-roots",
        WORKSPACE_ROOT_OPTIONS: "electron-saved-workspace-roots",
        WORKSPACE_ROOT_LABELS: "electron-workspace-root-labels",
        LOCAL_PROJECTS: "local-projects",
        APP_SERVER_PROJECT_ID_BY_LEGACY_PROJECT_ID_BY_HOST:
          "app-server-project-id-by-legacy-project-id-by-host",
        APP_SERVER_PROJECTS_MIGRATION_BY_HOST: "app-server-projects-migration-by-host",
        APP_SERVER_PENDING_PROJECT_DELETIONS_BY_HOST:
          "app-server-pending-project-deletions-by-host",
        SELECTED_PROJECT: "selected-project",
        PROJECT_WRITABLE_ROOTS: "project-writable-roots",
        PROJECT_APPEARANCES: "project-appearances",
        PROJECT_FILES: "project-files",
        PINNED_THREAD_IDS: "pinned-thread-ids",
        APP_SERVER_MIGRATED_PINNED_THREAD_IDS_BY_HOST:
          "app-server-migrated-pinned-thread-ids-by-host",
        PINNED_PROJECT_IDS: "pinned-project-ids",
        SIDEBAR_PROJECT_THREAD_ORDERS: "sidebar-project-thread-orders",
        THREAD_PROJECT_ASSIGNMENTS: "thread-project-assignments",
        THREAD_PROJECT_MEMBERSHIP_HOST_IDS: "thread-project-membership-host-ids",
        THREAD_WRITABLE_ROOTS: "thread-writable-roots",
        THREAD_WORKSPACE_ROOT_HINTS: "thread-workspace-root-hints",
        THREAD_PROJECTLESS_OUTPUT_DIRECTORIES: "thread-projectless-output-directories",
        PROJECTLESS_THREAD_IDS: "projectless-thread-ids",
        SELECTED_REMOTE_HOST_ID: "selected-remote-host-id",
        REMOTE_PROJECTS: "remote-projects",
        ACTIVE_REMOTE_PROJECT_ID: "active-remote-project-id",
        PROJECT_ORDER: "project-order",
        CONNECTION_GROUP_ORDER: "connection-group-order",
        REMOTE_CWDS_BY_HOST_AND_WORKSPACE: "remote-cwds-by-host-and-workspace",
        HOST_ID_REMOTE_CONTROL_ALLOWED: "host-id-remote-control-allowed",
        ADDED_REMOTE_CONTROL_ENV_IDS: "added-remote-control-env-ids",
        REMOTE_PROJECT_CONNECTION_BACKFILL_COMPLETED:
          "remote-project-connection-backfill-completed",
        REMOTE_CONNECTION_AUTO_CONNECT_BY_HOST_ID: "remote-connection-auto-connect-by-host-id",
        QUEUED_FOLLOW_UPS: "queued-follow-ups",
      }),
      (xJe = {
        [J.GIT_ALWAYS_FORCE_PUSH]: !1,
        [J.GIT_CREATE_PULL_REQUEST_AS_DRAFT]: !0,
        [J.GIT_PULL_REQUEST_MERGE_METHOD]: "merge",
        [J.GIT_REVIEW_MODE]: "full",
        [J.GIT_BRANCH_PREFIX]: "codex/",
        [J.GIT_WORKTREE_ROOT]: "",
        [J.GIT_COMMIT_INSTRUCTIONS]: "",
        [J.GIT_PR_INSTRUCTIONS]: "",
        [J.SIDEBAR_PROJECT_THREAD_ORDERS]: {},
        [J.PROJECT_APPEARANCES]: {},
        [J.ADDED_REMOTE_CONTROL_ENV_IDS]: [],
        [J.CODEX_MOBILE_SETUP_COMPLETED]: !1,
        [J.AMBIENT_SUGGESTIONS_ENABLED]: !0,
        [J.HOTKEY_WINDOW_PROJECTLESS_DEFAULT_ENABLED]: !1,
        [J.DEBUG_CHROME_PAGES_ENABLED]: !1,
        [J.WORKTREE_AUTO_CLEANUP_ENABLED]: !0,
        [J.WORKTREE_CONFIRM_BEFORE_DELETE]: !0,
        [J.WORKTREE_KEEP_COUNT]: 15,
        [J.BROWSER_ANNOTATION_SCREENSHOTS_MODE]: uq,
        [J.BROWSER_DOWNLOAD_DIRECTORY]: null,
        [J.BROWSER_DOWNLOAD_PROMPT_ENABLED]: !1,
        [J.DOCK_ICON_PREFERENCE]: "app-default",
        [J.REDUCED_MOTION_PREFERENCE]: "system",
      }));
  });
