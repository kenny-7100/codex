function H4e(t) {
  let e = "[0-5]\\d";
  t.precision ? (e = `${e}\\.\\d{${t.precision}}`) : t.precision == null && (e = `${e}(\\.\\d+)?`);
  let r = t.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${e})${r}`;
}
function gVt(t) {
  return new RegExp(`^${H4e(t)}$`);
}
function yVt(t) {
  let e = `${W4e}T${H4e(t)}`,
    r = [];
  return (
    r.push(t.local ? "Z?" : "Z"),
    t.offset && r.push("([+-]\\d{2}:?\\d{2})"),
    (e = `${e}(${r.join("|")})`),
    new RegExp(`^${e}$`)
  );
}
function vVt(t, e) {
  return !!(((e === "v4" || !e) && cVt.test(t)) || ((e === "v6" || !e) && dVt.test(t)));
}
function bVt(t, e) {
  if (!iVt.test(t)) return !1;
  try {
    let [r] = t.split(".");
    if (!r) return !1;
    let n = r
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .padEnd(r.length + ((4 - (r.length % 4)) % 4), "="),
      o = JSON.parse(atob(n));
    return !(
      typeof o != "object" ||
      o === null ||
      ("typ" in o && o?.typ !== "JWT") ||
      !o.alg ||
      (e && o.alg !== e)
    );
  } catch {
    return !1;
  }
}
function SVt(t, e) {
  return !!(((e === "v4" || !e) && uVt.test(t)) || ((e === "v6" || !e) && pVt.test(t)));
}
var jv = class t extends St {
  _parse(e) {
    if ((this._def.coerce && (e.data = String(e.data)), this._getType(e) !== _e.string)) {
      let i = this._getOrReturnCtx(e);
      return (ye(i, { code: te.invalid_type, expected: _e.string, received: i.parsedType }), Ze);
    }
    let n = new Ao(),
      o;
    for (let i of this._def.checks)
      if (i.kind === "min")
        e.data.length < i.value &&
          ((o = this._getOrReturnCtx(e, o)),
          ye(o, {
            code: te.too_small,
            minimum: i.value,
            type: "string",
            inclusive: !0,
            exact: !1,
            message: i.message,
          }),
          n.dirty());
      else if (i.kind === "max")
        e.data.length > i.value &&
          ((o = this._getOrReturnCtx(e, o)),
          ye(o, {
            code: te.too_big,
            maximum: i.value,
            type: "string",
            inclusive: !0,
            exact: !1,
            message: i.message,
          }),
          n.dirty());
      else if (i.kind === "length") {
        let s = e.data.length > i.value,
          a = e.data.length < i.value;
        (s || a) &&
          ((o = this._getOrReturnCtx(e, o)),
          s
            ? ye(o, {
                code: te.too_big,
                maximum: i.value,
                type: "string",
                inclusive: !0,
                exact: !0,
                message: i.message,
              })
            : a &&
              ye(o, {
                code: te.too_small,
                minimum: i.value,
                type: "string",
                inclusive: !0,
                exact: !0,
                message: i.message,
              }),
          n.dirty());
      } else if (i.kind === "email")
        aVt.test(e.data) ||
          ((o = this._getOrReturnCtx(e, o)),
          ye(o, { validation: "email", code: te.invalid_string, message: i.message }),
          n.dirty());
      else if (i.kind === "emoji")
        (lX || (lX = new RegExp(lVt, "u")),
          lX.test(e.data) ||
            ((o = this._getOrReturnCtx(e, o)),
            ye(o, { validation: "emoji", code: te.invalid_string, message: i.message }),
            n.dirty()));
      else if (i.kind === "uuid")
        nVt.test(e.data) ||
          ((o = this._getOrReturnCtx(e, o)),
          ye(o, { validation: "uuid", code: te.invalid_string, message: i.message }),
          n.dirty());
      else if (i.kind === "nanoid")
        oVt.test(e.data) ||
          ((o = this._getOrReturnCtx(e, o)),
          ye(o, { validation: "nanoid", code: te.invalid_string, message: i.message }),
          n.dirty());
      else if (i.kind === "cuid")
        eVt.test(e.data) ||
          ((o = this._getOrReturnCtx(e, o)),
          ye(o, { validation: "cuid", code: te.invalid_string, message: i.message }),
          n.dirty());
      else if (i.kind === "cuid2")
        tVt.test(e.data) ||
          ((o = this._getOrReturnCtx(e, o)),
          ye(o, { validation: "cuid2", code: te.invalid_string, message: i.message }),
          n.dirty());
      else if (i.kind === "ulid")
        rVt.test(e.data) ||
          ((o = this._getOrReturnCtx(e, o)),
          ye(o, { validation: "ulid", code: te.invalid_string, message: i.message }),
          n.dirty());
      else if (i.kind === "url")
        try {
          new URL(e.data);
        } catch {
          ((o = this._getOrReturnCtx(e, o)),
            ye(o, { validation: "url", code: te.invalid_string, message: i.message }),
            n.dirty());
        }
      else
        i.kind === "regex"
          ? ((i.regex.lastIndex = 0),
            i.regex.test(e.data) ||
              ((o = this._getOrReturnCtx(e, o)),
              ye(o, { validation: "regex", code: te.invalid_string, message: i.message }),
              n.dirty()))
          : i.kind === "trim"
            ? (e.data = e.data.trim())
            : i.kind === "includes"
              ? e.data.includes(i.value, i.position) ||
                ((o = this._getOrReturnCtx(e, o)),
                ye(o, {
                  code: te.invalid_string,
                  validation: { includes: i.value, position: i.position },
                  message: i.message,
                }),
                n.dirty())
              : i.kind === "toLowerCase"
                ? (e.data = e.data.toLowerCase())
                : i.kind === "toUpperCase"
                  ? (e.data = e.data.toUpperCase())
                  : i.kind === "startsWith"
                    ? e.data.startsWith(i.value) ||
                      ((o = this._getOrReturnCtx(e, o)),
                      ye(o, {
                        code: te.invalid_string,
                        validation: { startsWith: i.value },
                        message: i.message,
                      }),
                      n.dirty())
                    : i.kind === "endsWith"
                      ? e.data.endsWith(i.value) ||
                        ((o = this._getOrReturnCtx(e, o)),
                        ye(o, {
                          code: te.invalid_string,
                          validation: { endsWith: i.value },
                          message: i.message,
                        }),
                        n.dirty())
                      : i.kind === "datetime"
                        ? yVt(i).test(e.data) ||
                          ((o = this._getOrReturnCtx(e, o)),
                          ye(o, {
                            code: te.invalid_string,
                            validation: "datetime",
                            message: i.message,
                          }),
                          n.dirty())
                        : i.kind === "date"
                          ? hVt.test(e.data) ||
                            ((o = this._getOrReturnCtx(e, o)),
                            ye(o, {
                              code: te.invalid_string,
                              validation: "date",
                              message: i.message,
                            }),
                            n.dirty())
                          : i.kind === "time"
                            ? gVt(i).test(e.data) ||
                              ((o = this._getOrReturnCtx(e, o)),
                              ye(o, {
                                code: te.invalid_string,
                                validation: "time",
                                message: i.message,
                              }),
                              n.dirty())
                            : i.kind === "duration"
                              ? sVt.test(e.data) ||
                                ((o = this._getOrReturnCtx(e, o)),
                                ye(o, {
                                  validation: "duration",
                                  code: te.invalid_string,
                                  message: i.message,
                                }),
                                n.dirty())
                              : i.kind === "ip"
                                ? vVt(e.data, i.version) ||
                                  ((o = this._getOrReturnCtx(e, o)),
                                  ye(o, {
                                    validation: "ip",
                                    code: te.invalid_string,
                                    message: i.message,
                                  }),
                                  n.dirty())
                                : i.kind === "jwt"
                                  ? bVt(e.data, i.alg) ||
                                    ((o = this._getOrReturnCtx(e, o)),
                                    ye(o, {
                                      validation: "jwt",
                                      code: te.invalid_string,
                                      message: i.message,
                                    }),
                                    n.dirty())
                                  : i.kind === "cidr"
                                    ? SVt(e.data, i.version) ||
                                      ((o = this._getOrReturnCtx(e, o)),
                                      ye(o, {
                                        validation: "cidr",
                                        code: te.invalid_string,
                                        message: i.message,
                                      }),
                                      n.dirty())
                                    : i.kind === "base64"
                                      ? mVt.test(e.data) ||
                                        ((o = this._getOrReturnCtx(e, o)),
                                        ye(o, {
                                          validation: "base64",
                                          code: te.invalid_string,
                                          message: i.message,
                                        }),
                                        n.dirty())
                                      : i.kind === "base64url"
                                        ? fVt.test(e.data) ||
                                          ((o = this._getOrReturnCtx(e, o)),
                                          ye(o, {
                                            validation: "base64url",
                                            code: te.invalid_string,
                                            message: i.message,
                                          }),
                                          n.dirty())
                                        : It.assertNever(i);
    return { status: n.value, value: e.data };
  }
  _regex(e, r, n) {
    return this.refinement((o) => e.test(o), {
      validation: r,
      code: te.invalid_string,
      ...ke.errToObj(n),
    });
  }
  _addCheck(e) {
    return new t({ ...this._def, checks: [...this._def.checks, e] });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...ke.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...ke.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...ke.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...ke.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...ke.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...ke.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...ke.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...ke.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...ke.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({ kind: "base64url", ...ke.errToObj(e) });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...ke.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...ke.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...ke.errToObj(e) });
  }
  datetime(e) {
    return typeof e == "string"
      ? this._addCheck({ kind: "datetime", precision: null, offset: !1, local: !1, message: e })
      : this._addCheck({
          kind: "datetime",
          precision: typeof e?.precision > "u" ? null : e?.precision,
          offset: e?.offset ?? !1,
          local: e?.local ?? !1,
          ...ke.errToObj(e?.message),
        });
  }
  date(e) {
    return this._addCheck({ kind: "date", message: e });
  }
  time(e) {
    return typeof e == "string"
      ? this._addCheck({ kind: "time", precision: null, message: e })
      : this._addCheck({
          kind: "time",
          precision: typeof e?.precision > "u" ? null : e?.precision,
          ...ke.errToObj(e?.message),
        });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...ke.errToObj(e) });
  }
  regex(e, r) {
    return this._addCheck({ kind: "regex", regex: e, ...ke.errToObj(r) });
  }
  includes(e, r) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: r?.position,
      ...ke.errToObj(r?.message),
    });
  }
  startsWith(e, r) {
    return this._addCheck({ kind: "startsWith", value: e, ...ke.errToObj(r) });
  }
  endsWith(e, r) {
    return this._addCheck({ kind: "endsWith", value: e, ...ke.errToObj(r) });
  }
  min(e, r) {
    return this._addCheck({ kind: "min", value: e, ...ke.errToObj(r) });
  }
  max(e, r) {
    return this._addCheck({ kind: "max", value: e, ...ke.errToObj(r) });
  }
  length(e, r) {
    return this._addCheck({ kind: "length", value: e, ...ke.errToObj(r) });
  }
  nonempty(e) {
    return this.min(1, ke.errToObj(e));
  }
  trim() {
    return new t({ ...this._def, checks: [...this._def.checks, { kind: "trim" }] });
  }
  toLowerCase() {
    return new t({ ...this._def, checks: [...this._def.checks, { kind: "toLowerCase" }] });
  }
  toUpperCase() {
    return new t({ ...this._def, checks: [...this._def.checks, { kind: "toUpperCase" }] });
  }
  get isDatetime() {
    return !!this._def.checks.find((e) => e.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((e) => e.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((e) => e.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((e) => e.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((e) => e.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e) => e.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((e) => e.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((e) => e.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((e) => e.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((e) => e.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((e) => e.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((e) => e.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((e) => e.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((e) => e.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((e) => e.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((e) => e.kind === "base64url");
  }
  get minLength() {
    let e = null;
    for (let r of this._def.checks)
      r.kind === "min" && (e === null || r.value > e) && (e = r.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (let r of this._def.checks)
      r.kind === "max" && (e === null || r.value < e) && (e = r.value);
    return e;
  }
};
jv.create = (t) =>
  new jv({ checks: [], typeName: se.ZodString, coerce: t?.coerce ?? !1, ...at(t) });
function wVt(t, e) {
  let r = (t.toString().split(".")[1] || "").length,
    n = (e.toString().split(".")[1] || "").length,
    o = r > n ? r : n,
    i = Number.parseInt(t.toFixed(o).replace(".", "")),
    s = Number.parseInt(e.toFixed(o).replace(".", ""));
  return (i % s) / 10 ** o;
}
var xR = class t extends St {
  constructor() {
    (super(...arguments),
      (this.min = this.gte),
      (this.max = this.lte),
      (this.step = this.multipleOf));
  }
  _parse(e) {
    if ((this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== _e.number)) {
      let i = this._getOrReturnCtx(e);
      return (ye(i, { code: te.invalid_type, expected: _e.number, received: i.parsedType }), Ze);
    }
    let n,
      o = new Ao();
    for (let i of this._def.checks)
      i.kind === "int"
        ? It.isInteger(e.data) ||
          ((n = this._getOrReturnCtx(e, n)),
          ye(n, {
            code: te.invalid_type,
            expected: "integer",
            received: "float",
            message: i.message,
          }),
          o.dirty())
        : i.kind === "min"
          ? (i.inclusive ? e.data < i.value : e.data <= i.value) &&
            ((n = this._getOrReturnCtx(e, n)),
            ye(n, {
              code: te.too_small,
              minimum: i.value,
              type: "number",
              inclusive: i.inclusive,
              exact: !1,
              message: i.message,
            }),
            o.dirty())
          : i.kind === "max"
            ? (i.inclusive ? e.data > i.value : e.data >= i.value) &&
              ((n = this._getOrReturnCtx(e, n)),
              ye(n, {
                code: te.too_big,
                maximum: i.value,
                type: "number",
                inclusive: i.inclusive,
                exact: !1,
                message: i.message,
              }),
              o.dirty())
            : i.kind === "multipleOf"
              ? wVt(e.data, i.value) !== 0 &&
                ((n = this._getOrReturnCtx(e, n)),
                ye(n, { code: te.not_multiple_of, multipleOf: i.value, message: i.message }),
                o.dirty())
              : i.kind === "finite"
                ? Number.isFinite(e.data) ||
                  ((n = this._getOrReturnCtx(e, n)),
                  ye(n, { code: te.not_finite, message: i.message }),
                  o.dirty())
                : It.assertNever(i);
    return { status: o.value, value: e.data };
  }
  gte(e, r) {
    return this.setLimit("min", e, !0, ke.toString(r));
  }
  gt(e, r) {
    return this.setLimit("min", e, !1, ke.toString(r));
  }
  lte(e, r) {
    return this.setLimit("max", e, !0, ke.toString(r));
  }
  lt(e, r) {
    return this.setLimit("max", e, !1, ke.toString(r));
  }
  setLimit(e, r, n, o) {
    return new t({
      ...this._def,
      checks: [...this._def.checks, { kind: e, value: r, inclusive: n, message: ke.toString(o) }],
    });
  }
  _addCheck(e) {
    return new t({ ...this._def, checks: [...this._def.checks, e] });
  }
  int(e) {
    return this._addCheck({ kind: "int", message: ke.toString(e) });
  }
  positive(e) {
    return this._addCheck({ kind: "min", value: 0, inclusive: !1, message: ke.toString(e) });
  }
  negative(e) {
    return this._addCheck({ kind: "max", value: 0, inclusive: !1, message: ke.toString(e) });
  }
  nonpositive(e) {
    return this._addCheck({ kind: "max", value: 0, inclusive: !0, message: ke.toString(e) });
  }
  nonnegative(e) {
    return this._addCheck({ kind: "min", value: 0, inclusive: !0, message: ke.toString(e) });
  }
  multipleOf(e, r) {
    return this._addCheck({ kind: "multipleOf", value: e, message: ke.toString(r) });
  }
  finite(e) {
    return this._addCheck({ kind: "finite", message: ke.toString(e) });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: ke.toString(e),
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: ke.toString(e),
    });
  }
  get minValue() {
    let e = null;
    for (let r of this._def.checks)
      r.kind === "min" && (e === null || r.value > e) && (e = r.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (let r of this._def.checks)
      r.kind === "max" && (e === null || r.value < e) && (e = r.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find(
      (e) => e.kind === "int" || (e.kind === "multipleOf" && It.isInteger(e.value)),
    );
  }
  get isFinite() {
    let e = null,
      r = null;
    for (let n of this._def.checks) {
      if (n.kind === "finite" || n.kind === "int" || n.kind === "multipleOf") return !0;
      n.kind === "min"
        ? (r === null || n.value > r) && (r = n.value)
        : n.kind === "max" && (e === null || n.value < e) && (e = n.value);
    }
    return Number.isFinite(r) && Number.isFinite(e);
  }
};
xR.create = (t) =>
  new xR({ checks: [], typeName: se.ZodNumber, coerce: t?.coerce || !1, ...at(t) });
var AR = class t extends St {
  constructor() {
    (super(...arguments), (this.min = this.gte), (this.max = this.lte));
  }
  _parse(e) {
    if (this._def.coerce)
      try {
        e.data = BigInt(e.data);
      } catch {
        return this._getInvalidInput(e);
      }
    if (this._getType(e) !== _e.bigint) return this._getInvalidInput(e);
    let n,
      o = new Ao();
    for (let i of this._def.checks)
      i.kind === "min"
        ? (i.inclusive ? e.data < i.value : e.data <= i.value) &&
          ((n = this._getOrReturnCtx(e, n)),
          ye(n, {
            code: te.too_small,
            type: "bigint",
            minimum: i.value,
            inclusive: i.inclusive,
            message: i.message,
          }),
          o.dirty())
        : i.kind === "max"
          ? (i.inclusive ? e.data > i.value : e.data >= i.value) &&
            ((n = this._getOrReturnCtx(e, n)),
            ye(n, {
              code: te.too_big,
              type: "bigint",
              maximum: i.value,
              inclusive: i.inclusive,
              message: i.message,
            }),
            o.dirty())
          : i.kind === "multipleOf"
            ? e.data % i.value !== BigInt(0) &&
              ((n = this._getOrReturnCtx(e, n)),
              ye(n, { code: te.not_multiple_of, multipleOf: i.value, message: i.message }),
              o.dirty())
            : It.assertNever(i);
    return { status: o.value, value: e.data };
  }
  _getInvalidInput(e) {
    let r = this._getOrReturnCtx(e);
    return (ye(r, { code: te.invalid_type, expected: _e.bigint, received: r.parsedType }), Ze);
  }
  gte(e, r) {
    return this.setLimit("min", e, !0, ke.toString(r));
  }
  gt(e, r) {
    return this.setLimit("min", e, !1, ke.toString(r));
  }
  lte(e, r) {
    return this.setLimit("max", e, !0, ke.toString(r));
  }
  lt(e, r) {
    return this.setLimit("max", e, !1, ke.toString(r));
  }
  setLimit(e, r, n, o) {
    return new t({
      ...this._def,
      checks: [...this._def.checks, { kind: e, value: r, inclusive: n, message: ke.toString(o) }],
    });
  }
  _addCheck(e) {
    return new t({ ...this._def, checks: [...this._def.checks, e] });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: ke.toString(e),
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: ke.toString(e),
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: ke.toString(e),
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: ke.toString(e),
    });
  }
  multipleOf(e, r) {
    return this._addCheck({ kind: "multipleOf", value: e, message: ke.toString(r) });
  }
  get minValue() {
    let e = null;
    for (let r of this._def.checks)
      r.kind === "min" && (e === null || r.value > e) && (e = r.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (let r of this._def.checks)
      r.kind === "max" && (e === null || r.value < e) && (e = r.value);
    return e;
  }
};
AR.create = (t) =>
  new AR({ checks: [], typeName: se.ZodBigInt, coerce: t?.coerce ?? !1, ...at(t) });
var RR = class extends St {
  _parse(e) {
    if ((this._def.coerce && (e.data = !!e.data), this._getType(e) !== _e.boolean)) {
      let n = this._getOrReturnCtx(e);
      return (ye(n, { code: te.invalid_type, expected: _e.boolean, received: n.parsedType }), Ze);
    }
    return Ho(e.data);
  }
};
RR.create = (t) => new RR({ typeName: se.ZodBoolean, coerce: t?.coerce || !1, ...at(t) });
var ER = class t extends St {
  _parse(e) {
    if ((this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== _e.date)) {
      let i = this._getOrReturnCtx(e);
      return (ye(i, { code: te.invalid_type, expected: _e.date, received: i.parsedType }), Ze);
    }
    if (Number.isNaN(e.data.getTime())) {
      let i = this._getOrReturnCtx(e);
      return (ye(i, { code: te.invalid_date }), Ze);
    }
    let n = new Ao(),
      o;
    for (let i of this._def.checks)
      i.kind === "min"
        ? e.data.getTime() < i.value &&
          ((o = this._getOrReturnCtx(e, o)),
          ye(o, {
            code: te.too_small,
            message: i.message,
            inclusive: !0,
            exact: !1,
            minimum: i.value,
            type: "date",
          }),
          n.dirty())
        : i.kind === "max"
          ? e.data.getTime() > i.value &&
            ((o = this._getOrReturnCtx(e, o)),
            ye(o, {
              code: te.too_big,
              message: i.message,
              inclusive: !0,
              exact: !1,
              maximum: i.value,
              type: "date",
            }),
            n.dirty())
          : It.assertNever(i);
    return { status: n.value, value: new Date(e.data.getTime()) };
  }
  _addCheck(e) {
    return new t({ ...this._def, checks: [...this._def.checks, e] });
  }
  min(e, r) {
    return this._addCheck({ kind: "min", value: e.getTime(), message: ke.toString(r) });
  }
  max(e, r) {
    return this._addCheck({ kind: "max", value: e.getTime(), message: ke.toString(r) });
  }
  get minDate() {
    let e = null;
    for (let r of this._def.checks)
      r.kind === "min" && (e === null || r.value > e) && (e = r.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (let r of this._def.checks)
      r.kind === "max" && (e === null || r.value < e) && (e = r.value);
    return e != null ? new Date(e) : null;
  }
};
ER.create = (t) => new ER({ checks: [], coerce: t?.coerce || !1, typeName: se.ZodDate, ...at(t) });
var CR = class extends St {
  _parse(e) {
    if (this._getType(e) !== _e.symbol) {
      let n = this._getOrReturnCtx(e);
      return (ye(n, { code: te.invalid_type, expected: _e.symbol, received: n.parsedType }), Ze);
    }
    return Ho(e.data);
  }
};
CR.create = (t) => new CR({ typeName: se.ZodSymbol, ...at(t) });
var zv = class extends St {
  _parse(e) {
    if (this._getType(e) !== _e.undefined) {
      let n = this._getOrReturnCtx(e);
      return (ye(n, { code: te.invalid_type, expected: _e.undefined, received: n.parsedType }), Ze);
    }
    return Ho(e.data);
  }
};
zv.create = (t) => new zv({ typeName: se.ZodUndefined, ...at(t) });
var Vv = class extends St {
  _parse(e) {
    if (this._getType(e) !== _e.null) {
      let n = this._getOrReturnCtx(e);
      return (ye(n, { code: te.invalid_type, expected: _e.null, received: n.parsedType }), Ze);
    }
    return Ho(e.data);
  }
};
Vv.create = (t) => new Vv({ typeName: se.ZodNull, ...at(t) });
var TR = class extends St {
  constructor() {
    (super(...arguments), (this._any = !0));
  }
  _parse(e) {
    return Ho(e.data);
  }
};
TR.create = (t) => new TR({ typeName: se.ZodAny, ...at(t) });
var Id = class extends St {
  constructor() {
    (super(...arguments), (this._unknown = !0));
  }
  _parse(e) {
    return Ho(e.data);
  }
};
Id.create = (t) => new Id({ typeName: se.ZodUnknown, ...at(t) });
var El = class extends St {
  _parse(e) {
    let r = this._getOrReturnCtx(e);
    return (ye(r, { code: te.invalid_type, expected: _e.never, received: r.parsedType }), Ze);
  }
};
El.create = (t) => new El({ typeName: se.ZodNever, ...at(t) });
var PR = class extends St {
  _parse(e) {
    if (this._getType(e) !== _e.undefined) {
      let n = this._getOrReturnCtx(e);
      return (ye(n, { code: te.invalid_type, expected: _e.void, received: n.parsedType }), Ze);
    }
    return Ho(e.data);
  }
};
PR.create = (t) => new PR({ typeName: se.ZodVoid, ...at(t) });
var kd = class t extends St {
  _parse(e) {
    let { ctx: r, status: n } = this._processInputParams(e),
      o = this._def;
    if (r.parsedType !== _e.array)
      return (ye(r, { code: te.invalid_type, expected: _e.array, received: r.parsedType }), Ze);
    if (o.exactLength !== null) {
      let s = r.data.length > o.exactLength.value,
        a = r.data.length < o.exactLength.value;
      (s || a) &&
        (ye(r, {
          code: s ? te.too_big : te.too_small,
          minimum: a ? o.exactLength.value : void 0,
          maximum: s ? o.exactLength.value : void 0,
          type: "array",
          inclusive: !0,
          exact: !0,
          message: o.exactLength.message,
        }),
        n.dirty());
    }
    if (
      (o.minLength !== null &&
        r.data.length < o.minLength.value &&
        (ye(r, {
          code: te.too_small,
          minimum: o.minLength.value,
          type: "array",
          inclusive: !0,
          exact: !1,
          message: o.minLength.message,
        }),
        n.dirty()),
      o.maxLength !== null &&
        r.data.length > o.maxLength.value &&
        (ye(r, {
          code: te.too_big,
          maximum: o.maxLength.value,
          type: "array",
          inclusive: !0,
          exact: !1,
          message: o.maxLength.message,
        }),
        n.dirty()),
      r.common.async)
    )
      return Promise.all(
        [...r.data].map((s, a) => o.type._parseAsync(new vs(r, s, r.path, a))),
      ).then((s) => Ao.mergeArray(n, s));
    let i = [...r.data].map((s, a) => o.type._parseSync(new vs(r, s, r.path, a)));
    return Ao.mergeArray(n, i);
  }
  get element() {
    return this._def.type;
  }
  min(e, r) {
    return new t({ ...this._def, minLength: { value: e, message: ke.toString(r) } });
  }
  max(e, r) {
    return new t({ ...this._def, maxLength: { value: e, message: ke.toString(r) } });
  }
  length(e, r) {
    return new t({ ...this._def, exactLength: { value: e, message: ke.toString(r) } });
  }
  nonempty(e) {
    return this.min(1, e);
  }
};
kd.create = (t, e) =>
  new kd({
    type: t,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: se.ZodArray,
    ...at(e),
  });
function Hv(t) {
  if (t instanceof ji) {
    let e = {};
    for (let r in t.shape) {
      let n = t.shape[r];
      e[r] = sa.create(Hv(n));
    }
    return new ji({ ...t._def, shape: () => e });
  } else
    return t instanceof kd
      ? new kd({ ...t._def, type: Hv(t.element) })
      : t instanceof sa
        ? sa.create(Hv(t.unwrap()))
        : t instanceof Lc
          ? Lc.create(Hv(t.unwrap()))
          : t instanceof Nc
            ? Nc.create(t.items.map((e) => Hv(e)))
            : t;
}
var ji = class t extends St {
  constructor() {
    (super(...arguments),
      (this._cached = null),
      (this.nonstrict = this.passthrough),
      (this.augment = this.extend));
  }
  _getCached() {
    if (this._cached !== null) return this._cached;
    let e = this._def.shape(),
      r = It.objectKeys(e);
    return ((this._cached = { shape: e, keys: r }), this._cached);
  }
  _parse(e) {
    if (this._getType(e) !== _e.object) {
      let c = this._getOrReturnCtx(e);
      return (ye(c, { code: te.invalid_type, expected: _e.object, received: c.parsedType }), Ze);
    }
    let { status: n, ctx: o } = this._processInputParams(e),
      { shape: i, keys: s } = this._getCached(),
      a = [];
    if (!(this._def.catchall instanceof El && this._def.unknownKeys === "strip"))
      for (let c in o.data) s.includes(c) || a.push(c);
    let l = [];
    for (let c of s) {
      let u = i[c],
        p = o.data[c];
      l.push({
        key: { status: "valid", value: c },
        value: u._parse(new vs(o, p, o.path, c)),
        alwaysSet: c in o.data,
      });
    }
    if (this._def.catchall instanceof El) {
      let c = this._def.unknownKeys;
      if (c === "passthrough")
        for (let u of a)
          l.push({
            key: { status: "valid", value: u },
            value: { status: "valid", value: o.data[u] },
          });
      else if (c === "strict")
        a.length > 0 && (ye(o, { code: te.unrecognized_keys, keys: a }), n.dirty());
      else if (c !== "strip")
        throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      let c = this._def.catchall;
      for (let u of a) {
        let p = o.data[u];
        l.push({
          key: { status: "valid", value: u },
          value: c._parse(new vs(o, p, o.path, u)),
          alwaysSet: u in o.data,
        });
      }
    }
    return o.common.async
      ? Promise.resolve()
          .then(async () => {
            let c = [];
            for (let u of l) {
              let p = await u.key,
                m = await u.value;
              c.push({ key: p, value: m, alwaysSet: u.alwaysSet });
            }
            return c;
          })
          .then((c) => Ao.mergeObjectSync(n, c))
      : Ao.mergeObjectSync(n, l);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return (
      ke.errToObj,
      new t({
        ...this._def,
        unknownKeys: "strict",
        ...(e !== void 0
          ? {
              errorMap: (r, n) => {
                let o = this._def.errorMap?.(r, n).message ?? n.defaultError;
                return r.code === "unrecognized_keys"
                  ? { message: ke.errToObj(e).message ?? o }
                  : { message: o };
              },
            }
          : {}),
      })
    );
  }
  strip() {
    return new t({ ...this._def, unknownKeys: "strip" });
  }
  passthrough() {
    return new t({ ...this._def, unknownKeys: "passthrough" });
  }
  extend(e) {
    return new t({ ...this._def, shape: () => ({ ...this._def.shape(), ...e }) });
  }
  merge(e) {
    return new t({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({ ...this._def.shape(), ...e._def.shape() }),
      typeName: se.ZodObject,
    });
  }
  setKey(e, r) {
    return this.augment({ [e]: r });
  }
  catchall(e) {
    return new t({ ...this._def, catchall: e });
  }
  pick(e) {
    let r = {};
    for (let n of It.objectKeys(e)) e[n] && this.shape[n] && (r[n] = this.shape[n]);
    return new t({ ...this._def, shape: () => r });
  }
  omit(e) {
    let r = {};
    for (let n of It.objectKeys(this.shape)) e[n] || (r[n] = this.shape[n]);
    return new t({ ...this._def, shape: () => r });
  }
  deepPartial() {
    return Hv(this);
  }
  partial(e) {
    let r = {};
    for (let n of It.objectKeys(this.shape)) {
      let o = this.shape[n];
      e && !e[n] ? (r[n] = o) : (r[n] = o.optional());
    }
    return new t({ ...this._def, shape: () => r });
  }
  required(e) {
    let r = {};
    for (let n of It.objectKeys(this.shape))
      if (e && !e[n]) r[n] = this.shape[n];
      else {
        let i = this.shape[n];
        for (; i instanceof sa; ) i = i._def.innerType;
        r[n] = i;
      }
    return new t({ ...this._def, shape: () => r });
  }
  keyof() {
    return j4e(It.objectKeys(this.shape));
  }
};
ji.create = (t, e) =>
  new ji({
    shape: () => t,
    unknownKeys: "strip",
    catchall: El.create(),
    typeName: se.ZodObject,
    ...at(e),
  });
ji.strictCreate = (t, e) =>
  new ji({
    shape: () => t,
    unknownKeys: "strict",
    catchall: El.create(),
    typeName: se.ZodObject,
    ...at(e),
  });
ji.lazycreate = (t, e) =>
  new ji({
    shape: t,
    unknownKeys: "strip",
    catchall: El.create(),
    typeName: se.ZodObject,
    ...at(e),
  });
var Kv = class extends St {
  _parse(e) {
    let { ctx: r } = this._processInputParams(e),
      n = this._def.options;
    function o(i) {
      for (let a of i) if (a.result.status === "valid") return a.result;
      for (let a of i)
        if (a.result.status === "dirty")
          return (r.common.issues.push(...a.ctx.common.issues), a.result);
      let s = i.map((a) => new Hi(a.ctx.common.issues));
      return (ye(r, { code: te.invalid_union, unionErrors: s }), Ze);
    }
    if (r.common.async)
      return Promise.all(
        n.map(async (i) => {
          let s = { ...r, common: { ...r.common, issues: [] }, parent: null };
          return { result: await i._parseAsync({ data: r.data, path: r.path, parent: s }), ctx: s };
        }),
      ).then(o);
    {
      let i,
        s = [];
      for (let l of n) {
        let c = { ...r, common: { ...r.common, issues: [] }, parent: null },
          u = l._parseSync({ data: r.data, path: r.path, parent: c });
        if (u.status === "valid") return u;
        (u.status === "dirty" && !i && (i = { result: u, ctx: c }),
          c.common.issues.length && s.push(c.common.issues));
      }
      if (i) return (r.common.issues.push(...i.ctx.common.issues), i.result);
      let a = s.map((l) => new Hi(l));
      return (ye(r, { code: te.invalid_union, unionErrors: a }), Ze);
    }
  }
  get options() {
    return this._def.options;
  }
};
Kv.create = (t, e) => new Kv({ options: t, typeName: se.ZodUnion, ...at(e) });
var Oc = (t) =>
    t instanceof Xv
      ? Oc(t.schema)
      : t instanceof aa
        ? Oc(t.innerType())
        : t instanceof Yv
          ? [t.value]
          : t instanceof Jv
            ? t.options
            : t instanceof Qv
              ? It.objectValues(t.enum)
              : t instanceof eb
                ? Oc(t._def.innerType)
                : t instanceof zv
                  ? [void 0]
                  : t instanceof Vv
                    ? [null]
                    : t instanceof sa
                      ? [void 0, ...Oc(t.unwrap())]
                      : t instanceof Lc
                        ? [null, ...Oc(t.unwrap())]
                        : t instanceof K2 || t instanceof rb
                          ? Oc(t.unwrap())
                          : t instanceof tb
                            ? Oc(t._def.innerType)
                            : [],
  cX = class t extends St {
    _parse(e) {
      let { ctx: r } = this._processInputParams(e);
      if (r.parsedType !== _e.object)
        return (ye(r, { code: te.invalid_type, expected: _e.object, received: r.parsedType }), Ze);
      let n = this.discriminator,
        o = r.data[n],
        i = this.optionsMap.get(o);
      return i
        ? r.common.async
          ? i._parseAsync({ data: r.data, path: r.path, parent: r })
          : i._parseSync({ data: r.data, path: r.path, parent: r })
        : (ye(r, {
            code: te.invalid_union_discriminator,
            options: Array.from(this.optionsMap.keys()),
            path: [n],
          }),
          Ze);
    }
    get discriminator() {
      return this._def.discriminator;
    }
    get options() {
      return this._def.options;
    }
    get optionsMap() {
      return this._def.optionsMap;
    }
    static create(e, r, n) {
      let o = new Map();
      for (let i of r) {
        let s = Oc(i.shape[e]);
        if (!s.length)
          throw new Error(
            `A discriminator value for key \`${e}\` could not be extracted from all schema options`,
          );
        for (let a of s) {
          if (o.has(a))
            throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(a)}`);
          o.set(a, i);
        }
      }
      return new t({
        typeName: se.ZodDiscriminatedUnion,
        discriminator: e,
        options: r,
        optionsMap: o,
        ...at(n),
      });
    }
  };
function uX(t, e) {
  let r = Mc(t),
    n = Mc(e);
  if (t === e) return { valid: !0, data: t };
  if (r === _e.object && n === _e.object) {
    let o = It.objectKeys(e),
      i = It.objectKeys(t).filter((a) => o.indexOf(a) !== -1),
      s = { ...t, ...e };
    Object.prototype.hasOwnProperty.call(s, "__proto__") && delete s.__proto__;
    for (let a of i) {
      if (a === "__proto__") continue;
      let l = uX(t[a], e[a]);
      if (!l.valid) return { valid: !1 };
      s[a] = l.data;
    }
    return { valid: !0, data: s };
  } else if (r === _e.array && n === _e.array) {
    if (t.length !== e.length) return { valid: !1 };
    let o = [];
    for (let i = 0; i < t.length; i++) {
      let s = t[i],
        a = e[i],
        l = uX(s, a);
      if (!l.valid) return { valid: !1 };
      o.push(l.data);
    }
    return { valid: !0, data: o };
  } else return r === _e.date && n === _e.date && +t == +e ? { valid: !0, data: t } : { valid: !1 };
}
var Zv = class extends St {
  _parse(e) {
    let { status: r, ctx: n } = this._processInputParams(e),
      o = (i, s) => {
        if (sX(i) || sX(s)) return Ze;
        let a = uX(i.value, s.value);
        return a.valid
          ? ((aX(i) || aX(s)) && r.dirty(), { status: r.value, value: a.data })
          : (ye(n, { code: te.invalid_intersection_types }), Ze);
      };
    return n.common.async
      ? Promise.all([
          this._def.left._parseAsync({ data: n.data, path: n.path, parent: n }),
          this._def.right._parseAsync({ data: n.data, path: n.path, parent: n }),
        ]).then(([i, s]) => o(i, s))
      : o(
          this._def.left._parseSync({ data: n.data, path: n.path, parent: n }),
          this._def.right._parseSync({ data: n.data, path: n.path, parent: n }),
        );
  }
};
Zv.create = (t, e, r) => new Zv({ left: t, right: e, typeName: se.ZodIntersection, ...at(r) });
var Nc = class t extends St {
  _parse(e) {
    let { status: r, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== _e.array)
      return (ye(n, { code: te.invalid_type, expected: _e.array, received: n.parsedType }), Ze);
    if (n.data.length < this._def.items.length)
      return (
        ye(n, {
          code: te.too_small,
          minimum: this._def.items.length,
          inclusive: !0,
          exact: !1,
          type: "array",
        }),
        Ze
      );
    !this._def.rest &&
      n.data.length > this._def.items.length &&
      (ye(n, {
        code: te.too_big,
        maximum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array",
      }),
      r.dirty());
    let i = [...n.data]
      .map((s, a) => {
        let l = this._def.items[a] || this._def.rest;
        return l ? l._parse(new vs(n, s, n.path, a)) : null;
      })
      .filter((s) => !!s);
    return n.common.async ? Promise.all(i).then((s) => Ao.mergeArray(r, s)) : Ao.mergeArray(r, i);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new t({ ...this._def, rest: e });
  }
};
Nc.create = (t, e) => {
  if (!Array.isArray(t)) throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new Nc({ items: t, typeName: se.ZodTuple, rest: null, ...at(e) });
};
var dX = class t extends St {
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(e) {
      let { status: r, ctx: n } = this._processInputParams(e);
      if (n.parsedType !== _e.object)
        return (ye(n, { code: te.invalid_type, expected: _e.object, received: n.parsedType }), Ze);
      let o = [],
        i = this._def.keyType,
        s = this._def.valueType;
      for (let a in n.data)
        o.push({
          key: i._parse(new vs(n, a, n.path, a)),
          value: s._parse(new vs(n, n.data[a], n.path, a)),
          alwaysSet: a in n.data,
        });
      return n.common.async ? Ao.mergeObjectAsync(r, o) : Ao.mergeObjectSync(r, o);
    }
    get element() {
      return this._def.valueType;
    }
    static create(e, r, n) {
      return r instanceof St
        ? new t({ keyType: e, valueType: r, typeName: se.ZodRecord, ...at(n) })
        : new t({ keyType: jv.create(), valueType: e, typeName: se.ZodRecord, ...at(r) });
    }
  },
  IR = class extends St {
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(e) {
      let { status: r, ctx: n } = this._processInputParams(e);
      if (n.parsedType !== _e.map)
        return (ye(n, { code: te.invalid_type, expected: _e.map, received: n.parsedType }), Ze);
      let o = this._def.keyType,
        i = this._def.valueType,
        s = [...n.data.entries()].map(([a, l], c) => ({
          key: o._parse(new vs(n, a, n.path, [c, "key"])),
          value: i._parse(new vs(n, l, n.path, [c, "value"])),
        }));
      if (n.common.async) {
        let a = new Map();
        return Promise.resolve().then(async () => {
          for (let l of s) {
            let c = await l.key,
              u = await l.value;
            if (c.status === "aborted" || u.status === "aborted") return Ze;
            ((c.status === "dirty" || u.status === "dirty") && r.dirty(), a.set(c.value, u.value));
          }
          return { status: r.value, value: a };
        });
      } else {
        let a = new Map();
        for (let l of s) {
          let c = l.key,
            u = l.value;
          if (c.status === "aborted" || u.status === "aborted") return Ze;
          ((c.status === "dirty" || u.status === "dirty") && r.dirty(), a.set(c.value, u.value));
        }
        return { status: r.value, value: a };
      }
    }
  };
IR.create = (t, e, r) => new IR({ valueType: e, keyType: t, typeName: se.ZodMap, ...at(r) });
var kR = class t extends St {
  _parse(e) {
    let { status: r, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== _e.set)
      return (ye(n, { code: te.invalid_type, expected: _e.set, received: n.parsedType }), Ze);
    let o = this._def;
    (o.minSize !== null &&
      n.data.size < o.minSize.value &&
      (ye(n, {
        code: te.too_small,
        minimum: o.minSize.value,
        type: "set",
        inclusive: !0,
        exact: !1,
        message: o.minSize.message,
      }),
      r.dirty()),
      o.maxSize !== null &&
        n.data.size > o.maxSize.value &&
        (ye(n, {
          code: te.too_big,
          maximum: o.maxSize.value,
          type: "set",
          inclusive: !0,
          exact: !1,
          message: o.maxSize.message,
        }),
        r.dirty()));
    let i = this._def.valueType;
    function s(l) {
      let c = new Set();
      for (let u of l) {
        if (u.status === "aborted") return Ze;
        (u.status === "dirty" && r.dirty(), c.add(u.value));
      }
      return { status: r.value, value: c };
    }
    let a = [...n.data.values()].map((l, c) => i._parse(new vs(n, l, n.path, c)));
    return n.common.async ? Promise.all(a).then((l) => s(l)) : s(a);
  }
  min(e, r) {
    return new t({ ...this._def, minSize: { value: e, message: ke.toString(r) } });
  }
  max(e, r) {
    return new t({ ...this._def, maxSize: { value: e, message: ke.toString(r) } });
  }
  size(e, r) {
    return this.min(e, r).max(e, r);
  }
  nonempty(e) {
    return this.min(1, e);
  }
};
kR.create = (t, e) =>
  new kR({ valueType: t, minSize: null, maxSize: null, typeName: se.ZodSet, ...at(e) });
var pX = class t extends St {
    constructor() {
      (super(...arguments), (this.validate = this.implement));
    }
    _parse(e) {
      let { ctx: r } = this._processInputParams(e);
      if (r.parsedType !== _e.function)
        return (
          ye(r, { code: te.invalid_type, expected: _e.function, received: r.parsedType }),
          Ze
        );
      function n(a, l) {
        return V2({
          data: a,
          path: r.path,
          errorMaps: [r.common.contextualErrorMap, r.schemaErrorMap, wR(), Pd].filter((c) => !!c),
          issueData: { code: te.invalid_arguments, argumentsError: l },
        });
      }
      function o(a, l) {
        return V2({
          data: a,
          path: r.path,
          errorMaps: [r.common.contextualErrorMap, r.schemaErrorMap, wR(), Pd].filter((c) => !!c),
          issueData: { code: te.invalid_return_type, returnTypeError: l },
        });
      }
      let i = { errorMap: r.common.contextualErrorMap },
        s = r.data;
      if (this._def.returns instanceof Tf) {
        let a = this;
        return Ho(async function (...l) {
          let c = new Hi([]),
            u = await a._def.args.parseAsync(l, i).catch((f) => {
              throw (c.addIssue(n(l, f)), c);
            }),
            p = await Reflect.apply(s, this, u);
          return await a._def.returns._def.type.parseAsync(p, i).catch((f) => {
            throw (c.addIssue(o(p, f)), c);
          });
        });
      } else {
        let a = this;
        return Ho(function (...l) {
          let c = a._def.args.safeParse(l, i);
          if (!c.success) throw new Hi([n(l, c.error)]);
          let u = Reflect.apply(s, this, c.data),
            p = a._def.returns.safeParse(u, i);
          if (!p.success) throw new Hi([o(u, p.error)]);
          return p.data;
        });
      }
    }
    parameters() {
      return this._def.args;
    }
    returnType() {
      return this._def.returns;
    }
    args(...e) {
      return new t({ ...this._def, args: Nc.create(e).rest(Id.create()) });
    }
    returns(e) {
      return new t({ ...this._def, returns: e });
    }
    implement(e) {
      return this.parse(e);
    }
    strictImplement(e) {
      return this.parse(e);
    }
    static create(e, r, n) {
      return new t({
        args: e || Nc.create([]).rest(Id.create()),
        returns: r || Id.create(),
        typeName: se.ZodFunction,
        ...at(n),
      });
    }
  },
  Xv = class extends St {
    get schema() {
      return this._def.getter();
    }
    _parse(e) {
      let { ctx: r } = this._processInputParams(e);
      return this._def.getter()._parse({ data: r.data, path: r.path, parent: r });
    }
  };
Xv.create = (t, e) => new Xv({ getter: t, typeName: se.ZodLazy, ...at(e) });
var Yv = class extends St {
  _parse(e) {
    if (e.data !== this._def.value) {
      let r = this._getOrReturnCtx(e);
      return (ye(r, { received: r.data, code: te.invalid_literal, expected: this._def.value }), Ze);
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
};
Yv.create = (t, e) => new Yv({ value: t, typeName: se.ZodLiteral, ...at(e) });
function j4e(t, e) {
  return new Jv({ values: t, typeName: se.ZodEnum, ...at(e) });
}
var Jv = class t extends St {
  _parse(e) {
    if (typeof e.data != "string") {
      let r = this._getOrReturnCtx(e),
        n = this._def.values;
      return (
        ye(r, { expected: It.joinValues(n), received: r.parsedType, code: te.invalid_type }),
        Ze
      );
    }
    if ((this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data))) {
      let r = this._getOrReturnCtx(e),
        n = this._def.values;
      return (ye(r, { received: r.data, code: te.invalid_enum_value, options: n }), Ze);
    }
    return Ho(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    let e = {};
    for (let r of this._def.values) e[r] = r;
    return e;
  }
  get Values() {
    let e = {};
    for (let r of this._def.values) e[r] = r;
    return e;
  }
  get Enum() {
    let e = {};
    for (let r of this._def.values) e[r] = r;
    return e;
  }
  extract(e, r = this._def) {
    return t.create(e, { ...this._def, ...r });
  }
  exclude(e, r = this._def) {
    return t.create(
      this.options.filter((n) => !e.includes(n)),
      { ...this._def, ...r },
    );
  }
};
Jv.create = j4e;
var Qv = class extends St {
  _parse(e) {
    let r = It.getValidEnumValues(this._def.values),
      n = this._getOrReturnCtx(e);
    if (n.parsedType !== _e.string && n.parsedType !== _e.number) {
      let o = It.objectValues(r);
      return (
        ye(n, { expected: It.joinValues(o), received: n.parsedType, code: te.invalid_type }),
        Ze
      );
    }
    if (
      (this._cache || (this._cache = new Set(It.getValidEnumValues(this._def.values))),
      !this._cache.has(e.data))
    ) {
      let o = It.objectValues(r);
      return (ye(n, { received: n.data, code: te.invalid_enum_value, options: o }), Ze);
    }
    return Ho(e.data);
  }
  get enum() {
    return this._def.values;
  }
};
Qv.create = (t, e) => new Qv({ values: t, typeName: se.ZodNativeEnum, ...at(e) });
var Tf = class extends St {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    let { ctx: r } = this._processInputParams(e);
    if (r.parsedType !== _e.promise && r.common.async === !1)
      return (ye(r, { code: te.invalid_type, expected: _e.promise, received: r.parsedType }), Ze);
    let n = r.parsedType === _e.promise ? r.data : Promise.resolve(r.data);
    return Ho(
      n.then((o) =>
        this._def.type.parseAsync(o, { path: r.path, errorMap: r.common.contextualErrorMap }),
      ),
    );
  }
};
Tf.create = (t, e) => new Tf({ type: t, typeName: se.ZodPromise, ...at(e) });
var aa = class extends St {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === se.ZodEffects
      ? this._def.schema.sourceType()
      : this._def.schema;
  }
  _parse(e) {
    let { status: r, ctx: n } = this._processInputParams(e),
      o = this._def.effect || null,
      i = {
        addIssue: (s) => {
          (ye(n, s), s.fatal ? r.abort() : r.dirty());
        },
        get path() {
          return n.path;
        },
      };
    if (((i.addIssue = i.addIssue.bind(i)), o.type === "preprocess")) {
      let s = o.transform(n.data, i);
      if (n.common.async)
        return Promise.resolve(s).then(async (a) => {
          if (r.value === "aborted") return Ze;
          let l = await this._def.schema._parseAsync({ data: a, path: n.path, parent: n });
          return l.status === "aborted"
            ? Ze
            : l.status === "dirty"
              ? Wv(l.value)
              : r.value === "dirty"
                ? Wv(l.value)
                : l;
        });
      {
        if (r.value === "aborted") return Ze;
        let a = this._def.schema._parseSync({ data: s, path: n.path, parent: n });
        return a.status === "aborted"
          ? Ze
          : a.status === "dirty"
            ? Wv(a.value)
            : r.value === "dirty"
              ? Wv(a.value)
              : a;
      }
    }
    if (o.type === "refinement") {
      let s = (a) => {
        let l = o.refinement(a, i);
        if (n.common.async) return Promise.resolve(l);
        if (l instanceof Promise)
          throw new Error(
            "Async refinement encountered during synchronous parse operation. Use .parseAsync instead.",
          );
        return a;
      };
      if (n.common.async === !1) {
        let a = this._def.schema._parseSync({ data: n.data, path: n.path, parent: n });
        return a.status === "aborted"
          ? Ze
          : (a.status === "dirty" && r.dirty(), s(a.value), { status: r.value, value: a.value });
      } else
        return this._def.schema
          ._parseAsync({ data: n.data, path: n.path, parent: n })
          .then((a) =>
            a.status === "aborted"
              ? Ze
              : (a.status === "dirty" && r.dirty(),
                s(a.value).then(() => ({ status: r.value, value: a.value }))),
          );
    }
    if (o.type === "transform")
      if (n.common.async === !1) {
        let s = this._def.schema._parseSync({ data: n.data, path: n.path, parent: n });
        if (!Cf(s)) return Ze;
        let a = o.transform(s.value, i);
        if (a instanceof Promise)
          throw new Error(
            "Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.",
          );
        return { status: r.value, value: a };
      } else
        return this._def.schema
          ._parseAsync({ data: n.data, path: n.path, parent: n })
          .then((s) =>
            Cf(s)
              ? Promise.resolve(o.transform(s.value, i)).then((a) => ({
                  status: r.value,
                  value: a,
                }))
              : Ze,
          );
    It.assertNever(o);
  }
};
aa.create = (t, e, r) => new aa({ schema: t, typeName: se.ZodEffects, effect: e, ...at(r) });
aa.createWithPreprocess = (t, e, r) =>
  new aa({
    schema: e,
    effect: { type: "preprocess", transform: t },
    typeName: se.ZodEffects,
    ...at(r),
  });
var sa = class extends St {
  _parse(e) {
    return this._getType(e) === _e.undefined ? Ho(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
};
sa.create = (t, e) => new sa({ innerType: t, typeName: se.ZodOptional, ...at(e) });
var Lc = class extends St {
  _parse(e) {
    return this._getType(e) === _e.null ? Ho(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
};
Lc.create = (t, e) => new Lc({ innerType: t, typeName: se.ZodNullable, ...at(e) });
var eb = class extends St {
  _parse(e) {
    let { ctx: r } = this._processInputParams(e),
      n = r.data;
    return (
      r.parsedType === _e.undefined && (n = this._def.defaultValue()),
      this._def.innerType._parse({ data: n, path: r.path, parent: r })
    );
  }
  removeDefault() {
    return this._def.innerType;
  }
};
eb.create = (t, e) =>
  new eb({
    innerType: t,
    typeName: se.ZodDefault,
    defaultValue: typeof e.default == "function" ? e.default : () => e.default,
    ...at(e),
  });
var tb = class extends St {
  _parse(e) {
    let { ctx: r } = this._processInputParams(e),
      n = { ...r, common: { ...r.common, issues: [] } },
      o = this._def.innerType._parse({ data: n.data, path: n.path, parent: { ...n } });
    return _R(o)
      ? o.then((i) => ({
          status: "valid",
          value:
            i.status === "valid"
              ? i.value
              : this._def.catchValue({
                  get error() {
                    return new Hi(n.common.issues);
                  },
                  input: n.data,
                }),
        }))
      : {
          status: "valid",
          value:
            o.status === "valid"
              ? o.value
              : this._def.catchValue({
                  get error() {
                    return new Hi(n.common.issues);
                  },
                  input: n.data,
                }),
        };
  }
  removeCatch() {
    return this._def.innerType;
  }
};
tb.create = (t, e) =>
  new tb({
    innerType: t,
    typeName: se.ZodCatch,
    catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
    ...at(e),
  });
var DR = class extends St {
  _parse(e) {
    if (this._getType(e) !== _e.nan) {
      let n = this._getOrReturnCtx(e);
      return (ye(n, { code: te.invalid_type, expected: _e.nan, received: n.parsedType }), Ze);
    }
    return { status: "valid", value: e.data };
  }
};
DR.create = (t) => new DR({ typeName: se.ZodNaN, ...at(t) });
var hxn = Symbol("zod_brand"),
  K2 = class extends St {
    _parse(e) {
      let { ctx: r } = this._processInputParams(e),
        n = r.data;
      return this._def.type._parse({ data: n, path: r.path, parent: r });
    }
    unwrap() {
      return this._def.type;
    }
  },
  Z2 = class t extends St {
    _parse(e) {
      let { status: r, ctx: n } = this._processInputParams(e);
      if (n.common.async)
        return (async () => {
          let i = await this._def.in._parseAsync({ data: n.data, path: n.path, parent: n });
          return i.status === "aborted"
            ? Ze
            : i.status === "dirty"
              ? (r.dirty(), Wv(i.value))
              : this._def.out._parseAsync({ data: i.value, path: n.path, parent: n });
        })();
      {
        let o = this._def.in._parseSync({ data: n.data, path: n.path, parent: n });
        return o.status === "aborted"
          ? Ze
          : o.status === "dirty"
            ? (r.dirty(), { status: "dirty", value: o.value })
            : this._def.out._parseSync({ data: o.value, path: n.path, parent: n });
      }
    }
    static create(e, r) {
      return new t({ in: e, out: r, typeName: se.ZodPipeline });
    }
  },
  rb = class extends St {
    _parse(e) {
      let r = this._def.innerType._parse(e),
        n = (o) => (Cf(o) && (o.value = Object.freeze(o.value)), o);
      return _R(r) ? r.then((o) => n(o)) : n(r);
    }
    unwrap() {
      return this._def.innerType;
    }
  };
