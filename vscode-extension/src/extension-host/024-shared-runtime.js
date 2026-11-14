function uD(t, e) {
  bCe.set(t, e);
}
function dD(t) {
  return bCe.get(t);
}
var bCe,
  T4 = g(() => {
    bCe = new WeakMap();
  });
var ox = A((R0r, Rr) => {
  "use strict";
  var fm = Symbol.for("object-stream.none"),
    nRt = Symbol.for("object-stream.stop"),
    I4 = Symbol.for("object-stream.final"),
    ju = Symbol.for("object-stream.many"),
    k4 = Symbol.for("object-stream.flush"),
    pD = Symbol.for("object-stream.fList"),
    SCe = (t) => ({ [I4]: 1, value: t }),
    nx = (t) => ({ [ju]: 1, values: t }),
    oRt = (t) => t && t[I4] === 1,
    iRt = (t) => t && t[ju] === 1,
    sRt = (t) => t && t[k4] === 1,
    aRt = (t) => t && t[pD] === 1,
    lRt = (t) => t.value,
    cRt = (t) => t.values,
    uRt = (t) => t.fList,
    dRt = (t, e = null) => {
      let r = e ? (n) => (n === fm ? e() : t(n)) : t;
      return ((r[k4] = 1), r);
    },
    pRt = (t, e) => ((t.fList = e), (t[pD] = 1), t),
    mRt = (t) => (delete t.fList, delete t[pD], t),
    P4 = class extends Error {},
    fRt = (t) => (t === fm ? nx([]) : t && t[ju] === 1 ? t : nx([t])),
    hRt = (t) => {
      if (t?.[ju] === 1)
        switch (t.values.length) {
          case 0:
            return fm;
          case 1:
            return t.values[0];
        }
      return t;
    },
    gRt = (...t) => {
      let e = [];
      for (let r = 0; r < t.length; ++r) {
        let n = t[r];
        n !== fm && (n?.[ju] === 1 ? e.push(...n.values) : e.push(n));
      }
      return nx(e);
    },
    yRt = (t, ...e) => {
      let r = t === fm ? [] : t?.[ju] === 1 ? t.values : [t];
      for (let n = 0; n < e.length; ++n) {
        let o = e[n];
        o !== fm && (o?.[ju] === 1 ? r.push(...o.values) : r.push(o));
      }
      return nx(r);
    },
    vRt = SCe;
  Rr.exports.none = fm;
  Rr.exports.stop = nRt;
  Rr.exports.Stop = P4;
  Rr.exports.finalSymbol = I4;
  Rr.exports.finalValue = SCe;
  Rr.exports.final = vRt;
  Rr.exports.isFinalValue = oRt;
  Rr.exports.getFinalValue = lRt;
  Rr.exports.manySymbol = ju;
  Rr.exports.many = nx;
  Rr.exports.isMany = iRt;
  Rr.exports.getManyValues = cRt;
  Rr.exports.flushSymbol = k4;
  Rr.exports.flushable = dRt;
  Rr.exports.isFlushable = sRt;
  Rr.exports.fListSymbol = pD;
  Rr.exports.isFunctionList = aRt;
  Rr.exports.getFunctionList = uRt;
  Rr.exports.setFunctionList = pRt;
  Rr.exports.clearFunctionList = mRt;
  Rr.exports.toMany = fRt;
  Rr.exports.normalizeMany = hRt;
  Rr.exports.combineMany = gRt;
  Rr.exports.combineManyMut = yRt;
});
var wCe = A((E0r, D4) => {
  "use strict";
  var nn = ox(),
    ny = async function* (t, e, r) {
      for (
        let n = r;
        n <= e.length && (t && typeof t.then == "function" && (t = await t), t !== nn.none);
        ++n
      ) {
        if (t === nn.stop) throw new nn.Stop();
        if (nn.isFinalValue(t)) {
          yield nn.getFinalValue(t);
          break;
        }
        if (nn.isMany(t)) {
          let i = nn.getManyValues(t);
          if (n == e.length) yield* i;
          else for (let s = 0; s < i.length; ++s) yield* ny(i[s], e, n);
          break;
        }
        if (t && typeof t.next == "function") {
          for (;;) {
            let i = t.next();
            if ((i && typeof i.then == "function" && (i = await i), i.done)) break;
            n == e.length ? yield i.value : yield* ny(i.value, e, n);
          }
          break;
        }
        if (n == e.length) {
          yield t;
          break;
        }
        let o = e[n];
        t = o(t);
      }
    },
    bRt = (...t) => {
      ((t = t
        .filter((o) => o)
        .flat(1 / 0)
        .map((o) => (nn.isFunctionList(o) ? nn.getFunctionList(o) : o))
        .flat(1 / 0)),
        t.length || (t = [(o) => o]));
      let e = !1,
        r = async function* (o) {
          if (e) throw Error("Call to a flushed pipe.");
          if (o !== nn.none)
            for (let i = 0; i <= t.length; ++i) {
              if (o && typeof o.then == "function") {
                yield* ny(o, t, i);
                return;
              }
              if (o === nn.none) return;
              if (o === nn.stop) throw new nn.Stop();
              if (nn.isFinalValue(o)) {
                yield nn.getFinalValue(o);
                return;
              }
              if (nn.isMany(o) || (o && typeof o.next == "function")) {
                yield* ny(o, t, i);
                return;
              }
              if (i == t.length) {
                yield o;
                return;
              }
              o = t[i](o);
            }
          else {
            e = !0;
            for (let i = 0; i < t.length; ++i) {
              let s = t[i];
              nn.isFlushable(s) && (yield* ny(s(nn.none), t, i + 1));
            }
          }
        };
      return (t.some((o) => nn.isFlushable(o)) && (r = nn.flushable(r)), nn.setFunctionList(r, t));
    };
  D4.exports = bRt;
  D4.exports.next = ny;
});
var xCe = A((C0r, _Ce) => {
  "use strict";
  var { Duplex: SRt } = require("node:stream"),
    er = ox(),
    wRt = (t, e) => {
      if (typeof t != "function")
        throw TypeError("Only a function is accepted as the first argument");
      let r = Promise.resolve(),
        n = null,
        o = [],
        i = () => {
          n && (n(), (n = null), (r = Promise.resolve()));
        },
        s = () => {
          n || (r = new Promise((y) => (n = y)));
        },
        a = er.isFunctionList(t) ? t.fList : null,
        l = a
          ? function y(w, _, S) {
              for (;;) {
                if (w && typeof w.then == "function") return w.then((E) => y(E, _, S));
                if (w == null || w === er.none) return;
                if (w === er.stop) throw new er.Stop();
                if (er.isFinalValue(w)) {
                  S(er.getFinalValue(w));
                  return;
                }
                if (er.isMany(w)) {
                  let E = er.getManyValues(w);
                  if (_ >= a.length) {
                    for (let P = 0; P < E.length; ++P) S(E[P]);
                    return;
                  }
                  let T;
                  for (let P = 0; P < E.length; ++P)
                    if (T) {
                      let M = P;
                      T = T.then(() => y(E[M], _, S));
                    } else {
                      let M = y(E[P], _, S);
                      M && (T = M);
                    }
                  return T;
                }
                if (w && typeof w.next == "function")
                  return (async () => {
                    for (;;) {
                      let E = w.next();
                      if ((E && typeof E.then == "function" && (E = await E), E.done)) break;
                      let T = y(E.value, _, S);
                      T && (await T);
                    }
                  })();
                if (_ >= a.length) {
                  S(w);
                  return;
                }
                w = a[_++](w);
              }
            }
          : null,
        c = !1,
        u = null,
        p = (y) => {
          if (y && typeof y.next == "function") {
            o.push(y);
            return;
          }
          o.push(y[Symbol.iterator]());
        },
        m = async () => {
          for (; o.length; ) {
            await r;
            let w = o[o.length - 1].next();
            if ((w && typeof w.then == "function" && (w = await w), w.done)) {
              o.pop();
              continue;
            }
            let _ = w.value;
            (_ && typeof _.then == "function" && (_ = await _), await f(_));
          }
        },
        f = async (y) => {
          if (!(y == null || y === er.none)) {
            if (y === er.stop) throw new er.Stop();
            if (er.isMany(y)) return (p(er.getManyValues(y)), m());
            if (er.isFinalValue(y)) return ((y = er.getFinalValue(y)), v(y));
            u.push(y) || s();
          }
        },
        h = async (y, w) => {
          try {
            let _ = t(y, w);
            await v(_);
          } catch (_) {
            if (_ instanceof er.Stop) {
              (u.push(null), (c = !0));
              return;
            }
            throw _;
          }
        },
        v = async (y) =>
          y && typeof y.then == "function"
            ? y.then((w) => v(w))
            : y && typeof y.next == "function"
              ? (p(y), m())
              : f(y);
      return (
        (u = new SRt({
          writableObjectMode: !0,
          readableObjectMode: !0,
          ...e,
          write(y, w, _) {
            if (c) {
              _(null);
              return;
            }
            if (l) {
              let E = !1,
                T;
              try {
                T = l(y, 0, (P) => {
                  u.push(P) || (E = !0);
                });
              } catch (P) {
                if (P instanceof er.Stop) {
                  (u.push(null), (c = !0), _(null));
                  return;
                }
                _(P);
                return;
              }
              if (T) {
                T.then(
                  () => _(null),
                  (P) => {
                    if (P instanceof er.Stop) {
                      (u.push(null), (c = !0), _(null));
                      return;
                    }
                    _(P);
                  },
                );
                return;
              }
              E ? (s(), r.then(() => _(null))) : _(null);
              return;
            }
            let S;
            try {
              S = t(y, w);
            } catch (E) {
              if (E instanceof er.Stop) {
                (u.push(null), (c = !0), _(null));
                return;
              }
              _(E);
              return;
            }
            if (
              !(S && (typeof S.then == "function" || typeof S.next == "function")) &&
              S !== er.stop &&
              !er.isMany(S) &&
              !er.isFinalValue(S)
            ) {
              if (S != null && S !== er.none && !u.push(S)) {
                (s(), r.then(() => _(null)));
                return;
              }
              _(null);
              return;
            }
            v(S).then(
              () => _(null),
              (E) => {
                if (E instanceof er.Stop) {
                  (u.push(null), (c = !0), _(null));
                  return;
                }
                _(E);
              },
            );
          },
          final(y) {
            if (l) {
              let w = !1,
                _;
              try {
                let S = (E) => {
                  u.push(E) || (w = !0);
                };
                for (let E = 0; E < a.length; ++E)
                  if (er.isFlushable(a[E]))
                    if (_) {
                      let T = E;
                      _ = _.then(() => l(a[T](er.none), T + 1, S));
                    } else {
                      let T = l(a[E](er.none), E + 1, S);
                      T && (_ = T);
                    }
              } catch (S) {
                if (S instanceof er.Stop) {
                  (u.push(null), (c = !0), y(null));
                  return;
                }
                y(S);
                return;
              }
              if (_) {
                _.then(
                  () => (u.push(null), y(null)),
                  (S) => {
                    if (S instanceof er.Stop) {
                      ((c = !0), u.push(null), y(null));
                      return;
                    }
                    y(S);
                  },
                );
                return;
              }
              (u.push(null), w ? (s(), r.then(() => y(null))) : y(null));
              return;
            }
            if (!er.isFlushable(t)) {
              (u.push(null), y(null));
              return;
            }
            h(er.none, null).then(
              () => {
                (c || u.push(null), y(null));
              },
              (w) => y(w),
            );
          },
          read() {
            i();
          },
        })),
        u
      );
    };
  _Ce.exports = wRt;
});
var N4 = A((T0r, tr) => {
  "use strict";
  var { Readable: ACe, Writable: RCe, Duplex: M4 } = require("node:stream"),
    yr = ox(),
    _Rt = wCe(),
    xRt = xCe(),
    ix = (t) =>
      t &&
      typeof t.pipe == "function" &&
      typeof t.on == "function" &&
      (!t._writableState ||
        (typeof t._readableState == "object" ? t._readableState.readable : null) !== !1) &&
      (!t._writableState || t._readableState),
    mD = (t) =>
      t &&
      typeof t.write == "function" &&
      typeof t.on == "function" &&
      (!t._readableState ||
        (typeof t._writableState == "object" ? t._writableState.writable : null) !== !1),
    ECe = (t) =>
      t &&
      typeof t.pipe == "function" &&
      t._readableState &&
      typeof t.on == "function" &&
      typeof t.write == "function",
    O4 = (t) =>
      t &&
      (t._readableState ||
        t._writableState ||
        (typeof t.write == "function" && typeof t.on == "function") ||
        (typeof t.pipe == "function" && typeof t.on == "function")),
    CCe = (t) =>
      !!(
        t &&
        !O4(t) &&
        typeof t.pipeThrough == "function" &&
        typeof t.getReader == "function" &&
        typeof t.cancel == "function"
      ),
    TCe = (t) =>
      !!(t && !O4(t) && typeof t.getWriter == "function" && typeof t.abort == "function"),
    PCe = (t) => !!(t && !O4(t) && typeof t.readable == "object" && typeof t.writable == "object"),
    ARt = (t, e, r, n) => {
      if (ECe(e) || (!r && ix(e)) || (r === n.length - 1 && mD(e))) return (t.push(e), t);
      if (PCe(e)) return (t.push(M4.fromWeb(e, { objectMode: !0 })), t);
      if (!r && CCe(e)) return (t.push(ACe.fromWeb(e, { objectMode: !0 })), t);
      if (r === n.length - 1 && TCe(e)) return (t.push(RCe.fromWeb(e, { objectMode: !0 })), t);
      if (typeof e != "function")
        throw TypeError("Item #" + r + " is not a proper stream, nor a function.");
      t.length || t.push([]);
      let o = t[t.length - 1];
      return (Array.isArray(o) ? o.push(e) : t.push([e]), t);
    },
    RRt = (t) =>
      Array.isArray(t)
        ? t.length
          ? t.length == 1
            ? t[0] && hm.asStream(t[0])
            : hm.asStream(hm.gen(...t))
          : null
        : t,
    ERt = (t, e, r) => {
      if (ECe(t) || (!e && ix(t)) || (e === r.length - 1 && mD(t))) return t;
      if (PCe(t)) return M4.fromWeb(t, { objectMode: !0 });
      if (!e && CCe(t)) return ACe.fromWeb(t, { objectMode: !0 });
      if (e === r.length - 1 && TCe(t)) return RCe.fromWeb(t, { objectMode: !0 });
      if (typeof t == "function") return hm.asStream(t);
      throw TypeError("Item #" + e + " is not a proper stream, nor a function.");
    },
    CRt = (t, e, r, n) => {
      let o = null;
      try {
        t.write(e, r, (i) => n(i || o));
      } catch (i) {
        o = i;
      }
    },
    TRt = (t, e) => {
      let r = null;
      try {
        t.end(null, null, (n) => e(n || r));
      } catch (n) {
        r = n;
      }
    },
    PRt = (t) => {
      t.resume();
    },
    hm = (t, e) => {
      if (!Array.isArray(t) || !t.length)
        throw TypeError("Chain's first argument should be a non-empty array.");
      t = t.flat(1 / 0).filter((c) => c);
      let r = (
          e && e.noGrouping
            ? t.map(ERt)
            : t
                .map((c) => (yr.isFunctionList(c) ? yr.getFunctionList(c) : c))
                .flat(1 / 0)
                .reduce(ARt, [])
                .map(RRt)
        ).filter((c) => c),
        n = r[0],
        o = r.reduce((c, u) => (c && c.pipe(u)) || u),
        i = null,
        s = (c, u, p) => CRt(n, c, u, p),
        a = (c) => TRt(n, c),
        l = () => PRt(o);
      return (
        mD(n) || ((s = (c, u, p) => p(null)), (a = (c) => c(null)), n.on("end", () => i.end())),
        ix(o)
          ? (o.on("data", (c) => !i.push(c) && o.pause()), o.on("end", () => i.push(null)))
          : ((l = () => {}), o.on("finish", () => i.push(null))),
        (i = new M4({
          writableObjectMode: !0,
          readableObjectMode: !0,
          ...e,
          readable: ix(o),
          writable: mD(n),
          write: s,
          final: a,
          read: l,
        })),
        (i.streams = r),
        (i.input = n),
        (i.output = o),
        ix(o) || i.resume(),
        (!e || !e.skipEvents) && r.forEach((c) => c.on("error", (u) => i.emit("error", u))),
        i
      );
    },
    IRt = (t) => {
      if (typeof t == "function") return t;
      if (t) {
        if (typeof t[Symbol.asyncIterator] == "function") return t[Symbol.asyncIterator].bind(t);
        if (typeof t[Symbol.iterator] == "function") return t[Symbol.iterator].bind(t);
      }
      throw new TypeError("The argument should be a function or an iterable object.");
    };
  tr.exports = hm;
  tr.exports.none = yr.none;
  tr.exports.stop = yr.stop;
  tr.exports.Stop = yr.Stop;
  tr.exports.finalSymbol = yr.finalSymbol;
  tr.exports.finalValue = yr.finalValue;
  tr.exports.final = yr.final;
  tr.exports.isFinalValue = yr.isFinalValue;
  tr.exports.getFinalValue = yr.getFinalValue;
  tr.exports.manySymbol = yr.manySymbol;
  tr.exports.many = yr.many;
  tr.exports.isMany = yr.isMany;
  tr.exports.getManyValues = yr.getManyValues;
  tr.exports.flushSymbol = yr.flushSymbol;
  tr.exports.flushable = yr.flushable;
  tr.exports.isFlushable = yr.isFlushable;
  tr.exports.fListSymbol = yr.fListSymbol;
  tr.exports.isFunctionList = yr.isFunctionList;
  tr.exports.getFunctionList = yr.getFunctionList;
  tr.exports.setFunctionList = yr.setFunctionList;
  tr.exports.clearFunctionList = yr.clearFunctionList;
  tr.exports.toMany = yr.toMany;
  tr.exports.normalizeMany = yr.normalizeMany;
  tr.exports.combineMany = yr.combineMany;
  tr.exports.combineManyMut = yr.combineManyMut;
  tr.exports.chain = hm;
  tr.exports.chainUnchecked = hm;
  tr.exports.gen = _Rt;
  tr.exports.asStream = xRt;
  tr.exports.dataSource = IRt;
});
var kCe = A((P0r, ICe) => {
  "use strict";
  var { StringDecoder: kRt } = require("string_decoder"),
    { none: DRt, flushable: MRt } = ox(),
    ORt = () => {
      let t = new kRt(),
        e = "";
      return MRt((r) => {
        if (r === DRt) {
          let n = e + t.end();
          return ((e = ""), n);
        }
        if (typeof r == "string") {
          if (!e) return r;
          let n = e + r;
          return ((e = ""), n);
        }
        if (r instanceof Buffer) {
          let n = e + t.write(r);
          return ((e = ""), n);
        }
        throw new TypeError("Expected a string or a Buffer");
      });
    };
  ICe.exports = ORt;
});
var NCe = A((I0r, B4) => {
  "use strict";
  var { asStream: NRt, flushable: LRt, gen: BRt, many: FRt, none: DCe } = N4(),
    $Rt = kCe(),
    Tt = {
      value1: /[\"\{\[\]\-\d]|true\b|false\b|null\b|\s{1,256}/y,
      string: /[^\x00-\x1f\"\\]{1,256}|\\[bfnrt\"\\\/]|\\u[\da-fA-F]{4}|\"/y,
      key1: /[\"\}]|\s{1,256}/y,
      colon: /\:|\s{1,256}/y,
      comma: /[\,\]\}]|\s{1,256}/y,
      ws: /\s{1,256}/y,
      numberStart: /\d/y,
      numberDigit: /\d{0,256}/y,
      numberFraction: /[\.eE]/y,
      numberExponent: /[eE]/y,
      numberExpSign: /[-+]/y,
    },
    URt = 16;
  Tt.numberFracStart = Tt.numberExpStart = Tt.numberStart;
  Tt.numberFracDigit = Tt.numberExpDigit = Tt.numberDigit;
  var Hs = { object: "objectStop", array: "arrayStop", "": "done" },
    qRt = { name: "startObject" },
    MCe = { name: "endObject" },
    GRt = { name: "startArray" },
    OCe = { name: "endArray" },
    WRt = { name: "startString" },
    HRt = { name: "endString" },
    L4 = { name: "startNumber" },
    sx = { name: "endNumber" },
    jRt = { name: "startKey" },
    zRt = { name: "endKey" },
    VRt = {
      true: { name: "trueValue", value: !0 },
      false: { name: "falseValue", value: !1 },
      null: { name: "nullValue", value: null },
    },
    KRt = (t) => String.fromCharCode(parseInt(t.slice(2), 16)),
    ZRt = {
      b: "\b",
      f: "\f",
      n: `
`,
      r: "\r",
      t: "	",
      '"': '"',
      "\\": "\\",
      "/": "/",
    },
    XRt = (t) => {
      let e = !0,
        r = !0,
        n = !0,
        o = !0,
        i = !0,
        s = !0,
        a = !1;
      (t &&
        ("packValues" in t && (e = r = n = t.packValues),
        "packKeys" in t && (e = t.packKeys),
        "packStrings" in t && (r = t.packStrings),
        "packNumbers" in t && (n = t.packNumbers),
        "streamValues" in t && (o = i = s = t.streamValues),
        "streamKeys" in t && (o = t.streamKeys),
        "streamStrings" in t && (i = t.streamStrings),
        "streamNumbers" in t && (s = t.streamNumbers),
        (a = t.jsonStreaming)),
        !e && (o = !0),
        !r && (i = !0),
        !n && (s = !0));
      let l = !1,
        c = a ? "done" : "value",
        u = "",
        p = !1,
        m = "",
        f = "",
        h = [];
      return LRt((v) => {
        let y = [];
        v === DCe ? (l = !0) : (f += v);
        let w,
          _,
          S = 0;
        e: for (;;)
          switch (c) {
            case "value1":
            case "value":
              if (((Tt.value1.lastIndex = S), (w = Tt.value1.exec(f)), !w)) {
                if (l || S + URt < f.length)
                  throw S < f.length
                    ? new Error("Parser cannot parse input: expected a value")
                    : new Error("Parser has expected a value");
                break e;
              }
              switch (((_ = w[0]), _)) {
                case '"':
                  (i && y.push(WRt), (c = "string"));
                  break;
                case "{":
                  (y.push(qRt), h.push(u), (u = "object"), (c = "key1"));
                  break;
                case "[":
                  (y.push(GRt), h.push(u), (u = "array"), (c = "value1"));
                  break;
                case "]":
                  if (c !== "value1")
                    throw new Error("Parser cannot parse input: unexpected token ']'");
                  (p &&
                    (s && y.push(sx),
                    (p = !1),
                    n && (y.push({ name: "numberValue", value: m }), (m = ""))),
                    y.push(OCe),
                    (u = h.pop()),
                    (c = Hs[u]));
                  break;
                case "-":
                  ((p = !0),
                    s && y.push(L4, { name: "numberChunk", value: "-" }),
                    n && (m = "-"),
                    (c = "numberStart"));
                  break;
                case "0":
                  ((p = !0),
                    s && y.push(L4, { name: "numberChunk", value: "0" }),
                    n && (m = "0"),
                    (c = "numberFraction"));
                  break;
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                  ((p = !0),
                    s && y.push(L4, { name: "numberChunk", value: _ }),
                    n && (m = _),
                    (c = "numberDigit"));
                  break;
                case "true":
                case "false":
                case "null":
                  if (f.length - S === _.length && !l) break e;
                  (y.push(VRt[_]), (c = Hs[u]));
                  break;
              }
              S += _.length;
              break;
            case "keyVal":
            case "string":
              if (((Tt.string.lastIndex = S), (w = Tt.string.exec(f)), !w)) {
                if (S < f.length && (l || f.length - S >= 6))
                  throw new Error("Parser cannot parse input: escaped characters");
                if (l) throw new Error("Parser has expected a string value");
                break e;
              }
              if (((_ = w[0]), _ === '"'))
                c === "keyVal"
                  ? (o && y.push(zRt),
                    e && (y.push({ name: "keyValue", value: m }), (m = "")),
                    (c = "colon"))
                  : (i && y.push(HRt),
                    r && (y.push({ name: "stringValue", value: m }), (m = "")),
                    (c = Hs[u]));
              else if (_.length > 1 && _.charAt(0) === "\\") {
                let E = _.length == 2 ? ZRt[_.charAt(1)] : KRt(_);
                ((c === "keyVal" ? o : i) && y.push({ name: "stringChunk", value: E }),
                  (c === "keyVal" ? e : r) && (m += E));
              } else
                ((c === "keyVal" ? o : i) && y.push({ name: "stringChunk", value: _ }),
                  (c === "keyVal" ? e : r) && (m += _));
              S += _.length;
              break;
            case "key1":
            case "key":
              if (((Tt.key1.lastIndex = S), (w = Tt.key1.exec(f)), !w)) {
                if (S < f.length || l)
                  throw new Error("Parser cannot parse input: expected an object key");
                break e;
              }
              if (((_ = w[0]), _ === '"')) (o && y.push(jRt), (c = "keyVal"));
              else if (_ === "}") {
                if (c !== "key1")
                  throw new Error("Parser cannot parse input: unexpected token '}'");
                (y.push(MCe), (u = h.pop()), (c = Hs[u]));
              }
              S += _.length;
              break;
            case "colon":
              if (((Tt.colon.lastIndex = S), (w = Tt.colon.exec(f)), !w)) {
                if (S < f.length || l) throw new Error("Parser cannot parse input: expected ':'");
                break e;
              }
              ((_ = w[0]), _ === ":" && (c = "value"), (S += _.length));
              break;
            case "arrayStop":
            case "objectStop":
              if (((Tt.comma.lastIndex = S), (w = Tt.comma.exec(f)), !w)) {
                if (S < f.length || l) throw new Error("Parser cannot parse input: expected ','");
                break e;
              }
              if (
                (p &&
                  (s && y.push(sx),
                  (p = !1),
                  n && (y.push({ name: "numberValue", value: m }), (m = ""))),
                (_ = w[0]),
                _ === ",")
              )
                c = c === "arrayStop" ? "value" : "key";
              else if (_ === "}" || _ === "]") {
                if (_ === "}" ? c === "arrayStop" : c !== "arrayStop")
                  throw new Error(
                    "Parser cannot parse input: expected '" + (c === "arrayStop" ? "]" : "}") + "'",
                  );
                (y.push(_ === "}" ? MCe : OCe), (u = h.pop()), (c = Hs[u]));
              }
              S += _.length;
              break;
            case "numberStart":
              if (((Tt.numberStart.lastIndex = S), (w = Tt.numberStart.exec(f)), !w)) {
                if (S < f.length || l)
                  throw new Error("Parser cannot parse input: expected a starting digit");
                break e;
              }
              ((_ = w[0]),
                s && y.push({ name: "numberChunk", value: _ }),
                n && (m += _),
                (c = _ === "0" ? "numberFraction" : "numberDigit"),
                (S += _.length));
              break;
            case "numberDigit":
              if (((Tt.numberDigit.lastIndex = S), (w = Tt.numberDigit.exec(f)), !w)) {
                if (S < f.length || l)
                  throw new Error("Parser cannot parse input: expected a digit");
                break e;
              }
              if (((_ = w[0]), _))
                (s && y.push({ name: "numberChunk", value: _ }), n && (m += _), (S += _.length));
              else {
                if (S < f.length) {
                  c = "numberFraction";
                  break;
                }
                if (l) {
                  c = Hs[u];
                  break;
                }
                break e;
              }
              break;
            case "numberFraction":
              if (((Tt.numberFraction.lastIndex = S), (w = Tt.numberFraction.exec(f)), !w)) {
                if (S < f.length || l) {
                  c = Hs[u];
                  break;
                }
                break e;
              }
              ((_ = w[0]),
                s && y.push({ name: "numberChunk", value: _ }),
                n && (m += _),
                (c = _ === "." ? "numberFracStart" : "numberExpSign"),
                (S += _.length));
              break;
            case "numberFracStart":
              if (((Tt.numberFracStart.lastIndex = S), (w = Tt.numberFracStart.exec(f)), !w)) {
                if (S < f.length || l)
                  throw new Error(
                    "Parser cannot parse input: expected a fractional part of a number",
                  );
                break e;
              }
              ((_ = w[0]),
                s && y.push({ name: "numberChunk", value: _ }),
                n && (m += _),
                (c = "numberFracDigit"),
                (S += _.length));
              break;
            case "numberFracDigit":
              if (
                ((Tt.numberFracDigit.lastIndex = S),
                (w = Tt.numberFracDigit.exec(f)),
                (_ = w[0]),
                _)
              )
                (s && y.push({ name: "numberChunk", value: _ }), n && (m += _), (S += _.length));
              else {
                if (S < f.length) {
                  c = "numberExponent";
                  break;
                }
                if (l) {
                  c = Hs[u];
                  break;
                }
                break e;
              }
              break;
            case "numberExponent":
              if (((Tt.numberExponent.lastIndex = S), (w = Tt.numberExponent.exec(f)), !w)) {
                if (S < f.length) {
                  c = Hs[u];
                  break;
                }
                if (l) {
                  c = Hs[u];
                  break;
                }
                break e;
              }
              ((_ = w[0]),
                s && y.push({ name: "numberChunk", value: _ }),
                n && (m += _),
                (c = "numberExpSign"),
                (S += _.length));
              break;
            case "numberExpSign":
              if (((Tt.numberExpSign.lastIndex = S), (w = Tt.numberExpSign.exec(f)), !w)) {
                if (S < f.length) {
                  c = "numberExpStart";
                  break;
                }
                if (l) throw new Error("Parser has expected an exponent value of a number");
                break e;
              }
              ((_ = w[0]),
                s && y.push({ name: "numberChunk", value: _ }),
                n && (m += _),
                (c = "numberExpStart"),
                (S += _.length));
              break;
            case "numberExpStart":
              if (((Tt.numberExpStart.lastIndex = S), (w = Tt.numberExpStart.exec(f)), !w)) {
                if (S < f.length || l)
                  throw new Error(
                    "Parser cannot parse input: expected an exponent part of a number",
                  );
                break e;
              }
              ((_ = w[0]),
                s && y.push({ name: "numberChunk", value: _ }),
                n && (m += _),
                (c = "numberExpDigit"),
                (S += _.length));
              break;
            case "numberExpDigit":
              if (
                ((Tt.numberExpDigit.lastIndex = S), (w = Tt.numberExpDigit.exec(f)), (_ = w[0]), _)
              )
                (s && y.push({ name: "numberChunk", value: _ }), n && (m += _), (S += _.length));
              else {
                if (S < f.length || l) {
                  c = Hs[u];
                  break;
                }
                break e;
              }
              break;
            case "done":
              if (((Tt.ws.lastIndex = S), (w = Tt.ws.exec(f)), !w)) {
                if (S < f.length) {
                  if (a) {
                    (p &&
                      (s && y.push(sx),
                      (p = !1),
                      n && (y.push({ name: "numberValue", value: m }), (m = ""))),
                      (c = "value"));
                    break;
                  }
                  throw new Error("Parser cannot parse input: unexpected characters");
                }
                break e;
              }
              ((_ = w[0]),
                p &&
                  (s && y.push(sx),
                  (p = !1),
                  n && (y.push({ name: "numberValue", value: m }), (m = ""))),
                (S += _.length));
              break;
          }
        return (
          l &&
            p &&
            (s && y.push(sx), (p = !1), n && (y.push({ name: "numberValue", value: m }), (m = ""))),
          (f = f.slice(S)),
          y.length ? FRt(y) : DCe
        );
      });
    },
    fD = (t) => BRt($Rt(), XRt(t));
  fD.asStream = (t) => NRt(fD(t), t);
  B4.exports = fD;
  B4.exports.parser = fD;
});
var BCe = A((k0r, F4) => {
  "use strict";
  var YRt = require("node:events"),
    { none: JRt } = N4(),
    QRt = (t, e) => {
      if (typeof t == "function") return t;
      if (typeof t == "string") {
        let r = t + e;
        return (n) => {
          let o = n.join(e);
          return o === t || o.startsWith(r);
        };
      }
      return t instanceof RegExp ? (r) => ((t.lastIndex = 0), t.test(r.join(e))) : () => !0;
    },
    LCe = (t, e) => (!t || !t.length ? null : t.map((r) => ({ ...r, filter: QRt(r.filter, e) }))),
    oy = class t extends YRt {
      static connectTo(e, r) {
        return new t(r).connectTo(e);
      }
      constructor(e) {
        (super(),
          (this.objectStack = []),
          (this.keyStack = []),
          (this.current = this.key = null),
          (this.rule = null),
          (this.isArray = !1),
          (this.arrayIndex = -1),
          (this.done = !0),
          (this.reviver = !1));
        let r = e?.pathSeparator || ".";
        ((this.objectRules = LCe(e?.objectRules, r)),
          (this.arrayRules = LCe(e?.arrayRules, r)),
          e &&
            ((this.reviver = typeof e.reviver == "function" && e.reviver),
            e.numberAsString && (this.numberValue = this.stringValue)),
          (this.tapChain = (n) =>
            this[n.name] && (this[n.name](n.value), this.done) ? this.current : JRt));
      }
      connectTo(e) {
        return (
          e.on("data", (r) => {
            this[r.name] && (this[r.name](r.value), this.done && this.emit("done", this));
          }),
          this
        );
      }
      get depth() {
        return this.objectStack.length + (this.done ? 0 : 1);
      }
      get path() {
        return this.keyStack.slice();
      }
      dropToLevel(e) {
        if (e < this.depth)
          if (e > 0) {
            let r = e - 1,
              n = this.objectStack[r];
            ((this.current = n.container),
              (this.rule = n.rule),
              (this.isArray = n.isArray),
              (this.arrayIndex = n.arrayIndex),
              (this.key = null),
              (this.objectStack.length = r),
              (this.keyStack.length = r));
          } else
            ((this.objectStack.length = 0),
              (this.keyStack.length = 0),
              (this.current = this.key = null),
              (this.rule = null),
              (this.isArray = !1),
              (this.arrayIndex = -1),
              (this.done = !0));
        return this;
      }
      consume(e) {
        return (this[e.name] && this[e.name](e.value), this);
      }
      keyValue(e) {
        this.key = e;
      }
      stringValue(e) {
        this._saveValue(e);
      }
      numberValue(e) {
        this._saveValue(parseFloat(e));
      }
      nullValue() {
        this._saveValue(null);
      }
      trueValue() {
        this._saveValue(!0);
      }
      falseValue() {
        this._saveValue(!1);
      }
      _matchRule(e) {
        if (!e) return null;
        for (let r of e) if (r.filter(this.keyStack)) return r;
        return null;
      }
      _pushState() {
        (this.objectStack.push({
          container: this.current,
          rule: this.rule,
          isArray: this.isArray,
          arrayIndex: this.arrayIndex,
        }),
          this.isArray
            ? (++this.arrayIndex, this.keyStack.push(this.arrayIndex))
            : this.keyStack.push(this.key));
      }
      startObject() {
        (this.done ? (this.done = !1) : this._pushState(),
          (this.rule = this._matchRule(this.objectRules)),
          (this.isArray = !1),
          (this.arrayIndex = -1),
          (this.current = this.rule ? this.rule.create(this.keyStack) : {}),
          (this.key = null));
      }
      startArray() {
        (this.done ? (this.done = !1) : this._pushState(),
          (this.rule = this._matchRule(this.arrayRules)),
          (this.isArray = !0),
          (this.arrayIndex = -1),
          (this.current = this.rule ? this.rule.create(this.keyStack) : []),
          (this.key = null));
      }
      endObject() {
        if (
          (this.rule && this.rule.finalize && (this.current = this.rule.finalize(this.current)),
          this.objectStack.length)
        ) {
          let e = this.current,
            r = this.objectStack.pop();
          ((this.key = this.keyStack.pop()),
            (this.current = r.container),
            (this.rule = r.rule),
            (this.isArray = r.isArray),
            (this.arrayIndex = r.arrayIndex),
            this._addToCurrent(e));
        } else
          (this.reviver &&
            (this.current = this.reviver.call({ "": this.current }, "", this.current)),
            (this.done = !0));
      }
      _saveValue(e) {
        if (this.done) {
          (this.reviver && (e = this.reviver.call({ "": e }, "", e)), (this.current = e));
          return;
        }
        (this.isArray && ++this.arrayIndex, this._addToCurrent(e));
      }
      _addToCurrent(e) {
        if (this.isArray) {
          if (
            this.reviver &&
            ((e = this.reviver.call(this.current, String(this.arrayIndex), e)), e === void 0)
          )
            return;
          this.rule ? this.rule.add(this.current, e) : this.current.push(e);
        } else {
          if (this.reviver && ((e = this.reviver.call(this.current, this.key, e)), e === void 0)) {
            this.key = null;
            return;
          }
          (this.rule ? this.rule.add(this.current, this.key, e) : (this.current[this.key] = e),
            (this.key = null));
        }
      }
    };
  oy.prototype.endArray = oy.prototype.endObject;
  F4.exports = oy;
  F4.exports.flexAssembler = (t) => new oy(t);
});
function yD(t) {
  return UCe.has(t);
}
function gm(t) {
  return yD(t) ? tx(t) : t;
}
function hD(t) {
  return t instanceof Error ? t : new Error(String(t));
}
var FCe,
  $Ce,
  eEt,
  tEt,
  rEt,
  UCe,
  gD,
  iy = g(() => {
    ((FCe = require("node:buffer")), ($Ce = require("node:stream")));
    rx();
    T4();
    ((eEt = 256 * 1024 * 1024),
      (tEt = Math.min(eEt, Math.floor(FCe.constants.MAX_STRING_LENGTH / 2))),
      (rEt = Buffer.alloc(0)),
      (UCe = new WeakSet()),
      (gD = class extends $Ce.Writable {
        constructor(r) {
          super();
          this.options = r;
          this.maxBufferedLineBytes = r.maxBufferedLineBytes ?? tEt;
        }
        currentLine = this.createLine();
        maxBufferedLineBytes;
        _write(r, n, o) {
          this.consumeBuffer(r, 0, o);
        }
        _final(r) {
          if (
            this.currentLine.lineBytes > 0 ||
            this.currentLine.hasNonWhitespace ||
            this.currentLine.completedMessage != null ||
            this.currentLine.error != null
          ) {
            this.finishCurrentLine(r);
            return;
          }
          r();
        }
        _destroy(r, n) {
          (this.currentLine.parser?.destroy(), n(r));
        }
        getCurrentLineProgress() {
          return this.currentLine.progress;
        }
        consumeBuffer(r, n, o) {
          let i = n,
            s = () => {
              for (; i < r.length; ) {
                let a = r.indexOf(10, i);
                if (a === -1) {
                  this.appendLineChunk(this.currentLine, r.subarray(i), o);
                  return;
                }
                let l = a + 1,
                  c = this.currentLine;
                c.lineBytes += 1;
                let u = !1,
                  p = !0;
                if (
                  (this.appendLineChunk(c, r.subarray(i, a), () => {
                    this.finishCurrentLine(() => {
                      if (p) {
                        u = !0;
                        return;
                      }
                      ((i = l), s());
                    });
                  }),
                  (p = !1),
                  !u)
                )
                  return;
                i = l;
              }
              o();
            };
          s();
        }
        createLine() {
          return {
            bufferedChunks: [],
            completedMessage: null,
            contentBytes: 0,
            error: null,
            finishCallback: null,
            finished: !1,
            hasChunkedArray: !1,
            hasNonWhitespace: !1,
            lineBytes: 0,
            parsedValueCount: 0,
            parser: null,
            progress: null,
            settled: !1,
          };
        }
        appendLineChunk(r, n, o) {
          if (
            ((r.contentBytes += n.length),
            (r.lineBytes += n.length),
            n.length > 0 &&
              (r.progress == null && (r.progress = { startedAtMs: Date.now(), bytesReceived: 0 }),
              (r.progress.bytesReceived = r.lineBytes)),
            this.trackNonWhitespace(r, n),
            r.error != null || n.length === 0)
          ) {
            o();
            return;
          }
          if (r.parser != null) {
            this.writeParserChunks(r, [n], o);
            return;
          }
          if ((r.bufferedChunks.push(n), r.contentBytes <= this.maxBufferedLineBytes)) {
            o();
            return;
          }
          let i = r.bufferedChunks;
          r.bufferedChunks = [];
          try {
            (this.createStreamingParser(r), this.writeParserChunks(r, i, o));
          } catch (s) {
            ((r.error = hD(s)), (r.completedMessage = null), o());
          }
        }
        createStreamingParser(r) {
          let n = NCe(),
            o = BCe(),
            i = n.asStream({
              jsonStreaming: !0,
              packValues: !0,
              streamValues: !1,
              packStrings: !1,
              streamStrings: !0,
            });
          r.parser = i;
          let s = new o({
              objectRules: [
                {
                  filter: () => !0,
                  create: () => ({}),
                  add: (u, p, m) => {
                    Object.defineProperty(u, p, {
                      configurable: !0,
                      enumerable: !0,
                      value: m,
                      writable: !0,
                    });
                  },
                },
              ],
              arrayRules: [
                {
                  filter: () => !0,
                  create: () => new cD(this.options.arrayChunkBytes),
                  add: (u, p) => {
                    u.add(p);
                  },
                  finalize: (u) => {
                    let p = u.finish();
                    return (Hu(p) && (r.hasChunkedArray = !0), p);
                  },
                },
              ],
            }),
            a = [],
            l = [],
            c = 0;
          (i.on("data", (u) => {
            if (u.name !== "startString") {
              if (u.name === "stringChunk") {
                if (typeof u.value != "string") throw new Error("Invalid JSON string token");
                (a.push(u.value),
                  (c += u.value.length),
                  c >= 64 * 1024 && (l.push(a.join("")), (a = []), (c = 0)));
                return;
              }
              if (
                (u.name === "endString"
                  ? (a.length > 0 && l.push(a.join("")),
                    s.stringValue(l.join("")),
                    (a = []),
                    (l = []),
                    (c = 0))
                  : s.consume(u),
                !!s.done)
              ) {
                if (((r.parsedValueCount += 1), r.parsedValueCount > 1)) {
                  ((r.error = new Error("App-server stdout line contained multiple JSON values")),
                    (r.completedMessage = null));
                  return;
                }
                this.setCompletedMessage(r, s.current);
              }
            }
          }),
            i.on("error", (u) => {
              ((r.error = u),
                (r.completedMessage = null),
                r.finished && queueMicrotask(() => this.completeLine(r)));
            }));
        }
        writeParserChunks(r, n, o) {
          let i = r.parser;
          if (i == null) {
            o(new Error("Streaming parser was not initialized"));
            return;
          }
          let s = 0,
            a = !1,
            l = () => {
              a || ((a = !0), i.removeListener("drain", c), i.removeListener("error", l), o());
            },
            c = () => {
              for (
                i.removeListener("drain", c), i.removeListener("error", l);
                s < n.length && r.error == null;

              ) {
                let u = n[s];
                ((n[s] = rEt), (s += 1));
                let p;
                try {
                  p = i.write(u);
                } catch (m) {
                  ((r.error = hD(m)), (r.completedMessage = null), l());
                  return;
                }
                if (r.error != null) {
                  l();
                  return;
                }
                if (!p) {
                  (i.once("drain", c), i.once("error", l));
                  return;
                }
              }
              l();
            };
          c();
        }
        finishCurrentLine(r) {
          let n = this.currentLine;
          if (
            ((n.finished = !0),
            (n.finishCallback = () => {
              ((this.currentLine = this.createLine()), r());
            }),
            n.error != null)
          ) {
            (n.parser?.destroy(), this.completeLine(n));
            return;
          }
          if (n.parser == null) {
            (this.parseBufferedLine(n), this.completeLine(n));
            return;
          }
          try {
            n.parser.end(() => this.completeLine(n));
          } catch (o) {
            ((n.error = hD(o)), (n.completedMessage = null), this.completeLine(n));
          }
        }
        parseBufferedLine(r) {
          if (r.hasNonWhitespace)
            try {
              let n =
                r.bufferedChunks.length === 1
                  ? r.bufferedChunks[0]
                  : Buffer.concat(r.bufferedChunks, r.contentBytes);
              this.setCompletedMessage(r, JSON.parse(n.toString("utf8")));
            } catch (n) {
              ((r.error = hD(n)), (r.completedMessage = null));
            } finally {
              r.bufferedChunks = [];
            }
        }
        setCompletedMessage(r, n) {
          if (n == null || typeof n != "object" || Array.isArray(n) || Hu(n)) {
            ((r.error = new Error("App-server stdout line did not contain a JSON-RPC object")),
              (r.completedMessage = null));
            return;
          }
          r.completedMessage = n;
        }
        completeLine(r) {
          if (r.settled) return;
          if (((r.settled = !0), r.error != null)) this.options.onError(r.error, r.lineBytes);
          else if (r.completedMessage != null) {
            (uD(r.completedMessage, r.lineBytes),
              "result" in r.completedMessage &&
                r.completedMessage.result != null &&
                typeof r.completedMessage.result == "object" &&
                uD(r.completedMessage.result, r.lineBytes),
              "params" in r.completedMessage &&
                r.completedMessage.params != null &&
                typeof r.completedMessage.params == "object" &&
                uD(r.completedMessage.params, r.lineBytes),
              r.hasChunkedArray && UCe.add(r.completedMessage));
            let o = Date.now();
            (r.progress != null &&
              ((r.progress.bytesReceived = r.lineBytes), (r.progress.receivedAtMs = o)),
              this.options.onMessage(r.completedMessage, r.lineBytes, {
                receiveStartedAtMs: r.progress?.startedAtMs ?? o,
                receivedAtMs: o,
              }));
          } else
            r.hasNonWhitespace &&
              this.options.onError(
                new Error("App-server stdout line did not contain a complete JSON value"),
                r.lineBytes,
              );
          let n = r.finishCallback;
          ((r.finishCallback = null), n?.());
        }
        trackNonWhitespace(r, n) {
          if (!r.hasNonWhitespace) {
            for (let o of n)
              if (o !== 32 && o !== 9 && o !== 13) {
                r.hasNonWhitespace = !0;
                return;
              }
          }
        }
      }));
  });
function ym(t) {
  let e = vD(t);
  if (e != null) return e.id;
  if (t == null || typeof t != "object") return null;
  let r = t.threadId;
  return typeof r == "string" ? r : null;
}
function vD(t) {
  if (t == null || typeof t != "object") return null;
  let e = t.thread;
  return e != null && typeof e == "object" && typeof e.id == "string" ? e : null;
}
function bD(t) {
  if (t.error != null || t.result == null) return null;
  let e = t.result.thread;
  return e == null || typeof e != "object" || typeof e.id != "string" ? null : e;
}
function qCe(t) {
  return t != null && typeof t == "object" && "data" in t && Array.isArray(t.data);
}
var ax,
  vm = g(() => {
    iy();
    ax = class {
      constructor(e) {
        this.options = e;
      }
      prewarmedThreads = new Map();
      trackThread(e) {
        this.stopTrackingThread(e.id);
        let r = setTimeout(() => {
          let n = this.prewarmedThreads.get(e.id);
          (this.prewarmedThreads.delete(e.id),
            n != null && !n.visible && this.options.releaseExpiredThread(e.id));
        }, this.options.ttlMs);
        this.prewarmedThreads.set(e.id, {
          thread: e,
          visible: !1,
          originalStartedSuppressed: !1,
          timeout: r,
        });
      }
      filterThreadListResponse(e) {
        let r = gm(e);
        return r.error != null || !qCe(r.result)
          ? e
          : {
              ...r,
              result: {
                ...r.result,
                data: r.result.data.filter((n) => this.isThreadVisible(n.id)),
              },
            };
      }
      isThreadVisible(e) {
        return this.prewarmedThreads.get(e)?.visible !== !1;
      }
      publishThreadStarted(e) {
        let r = this.prewarmedThreads.get(e);
        r == null ||
          r.visible ||
          ((r.visible = !0),
          this.options.publishThreadStarted(r.thread),
          r.originalStartedSuppressed && this.stopTrackingThread(e));
      }
      suppressThreadStarted(e) {
        let r = this.prewarmedThreads.get(e);
        return r == null
          ? !1
          : ((r.originalStartedSuppressed = !0), r.visible && this.stopTrackingThread(e), !0);
      }
      clear() {
        for (let e of this.prewarmedThreads.values()) clearTimeout(e.timeout);
        this.prewarmedThreads.clear();
      }
      stopTrackingThread(e) {
        let r = this.prewarmedThreads.get(e);
        r != null && (clearTimeout(r.timeout), this.prewarmedThreads.delete(e));
      }
    };
  });
var $4 = g(() => {
  aD();
  vm();
  iy();
});
var U4 = g(() => {});
var GCe = g(() => {
  gCe();
  $4();
  U4();
  Nz();
  H_();
});
var J0r,
  Q0r,
  WCe = g(() => {
    O();
    $();
    ((J0r = d.object({ subscriptionId: d.uuid() })),
      (Q0r = d.object({
        notification: d.object({
          method: d.enum(cme),
          params: d.record(d.string(), d.json()).optional(),
        }),
        subscriptionId: d.uuid(),
      })));
  });
function q4(t) {
  return !("id" in t) || !("method" in t) || t.method !== "thread/list"
    ? t
    : {
        ...t,
        params: {
          ...("params" in t && typeof t.params == "object" ? t.params : {}),
          useStateDbOnly: !0,
        },
      };
}
function G4(t) {
  return "method" in t && t.method === "turn/addUserMessage";
}
var SD = g(() => {
  "use strict";
});
var W4 = g(() => {});
var H4 = g(() => {
  O();
});
var HCe = g(() => {
  "use strict";
});
var jCe = g(() => {
  "use strict";
  HCe();
});
var mDr,
  fDr,
  zCe = g(() => {
    jCe();
    $();
    ((mDr = 64 * 1024),
      (fDr = d.discriminatedUnion("type", [
        d.object({
          type: d.literal("mcpToolCall"),
          id: d.string(),
          server: d.string(),
          tool: d.string(),
          pluginId: d.string().nullish(),
          appContext: d.object({ connectorId: d.string() }).nullish(),
        }),
        d.object({
          type: d.literal("commandExecution"),
          commandActions: d
            .array(
              d.discriminatedUnion("type", [
                d.object({
                  type: d.literal("read"),
                  command: d.string(),
                  name: d.string(),
                  path: d.string(),
                }),
                d.object({
                  type: d.literal("listFiles"),
                  command: d.string(),
                  path: d.string().nullable(),
                }),
                d.object({
                  type: d.literal("search"),
                  command: d.string(),
                  query: d.string().nullable(),
                  path: d.string().nullable(),
                }),
                d.object({ type: d.literal("unknown"), command: d.string() }),
              ]),
            )
            .nullish(),
        }),
      ])));
  });
function sy(t) {
  let e = iEt.safeParse(t);
  return e.success ? e.data : null;
}
var iEt,
  bDr,
  lx = g(() => {
    $();
    zCe();
    ((iEt = d.union([
      d
        .object({ turn: d.object({ id: d.string(), status: d.unknown().optional() }) })
        .transform(({ turn: t }) => ({ id: t.id, status: t.status ?? null })),
      d
        .object({ turnId: d.string(), status: d.unknown().optional() })
        .transform(({ turnId: t, status: e }) => ({ id: t, status: e ?? null })),
    ])),
      (bDr = d.object({ threadId: d.string(), turnId: d.string(), item: d.unknown() })));
  });
var j4 = g(() => {
  j_();
});
var lEt,
  FDr,
  $Dr,
  VCe = g(() => {
    lEt = F(Is());
    O();
    SD();
    j0();
    U_();
    W4();
    H4();
    lx();
    vm();
    Ga();
    j4();
    H_();
    ((FDr = [64 * 1024, 256 * 1024, 1024 * 1024]), ($Dr = [16 * 1024, 256 * 1024, 1024 * 1024]));
  });
var z4 = g(() => {});
var KCe = g(() => {});
var ZCe = g(() => {
  O();
  $u();
  dm();
});
var XCe = g(() => {
  Bt();
  vm();
});
var YCe = g(() => {});
var JCe = g(() => {
  O();
});
var QCe = g(() => {});
var eTe = g(() => {
  O();
});
function zu(t) {
  for (let [e, r] of cEt) if (r.test(t)) return e;
  return "unknown";
}
var cEt,
  cx = g(() => {
    cEt = [
      [
        "invalid_config",
        /bad (?:boolean |numeric )?config value|bad config line|invalid (?:config|key)|could not parse config|bogus format in git_config_parameters/i,
      ],
      [
        "index_locked",
        /unable to create .*\.lock['"]?: file exists|another git process seems to be running|cannot lock ref|could not lock (?:config file|.*ref)/i,
      ],
      [
        "authentication",
        /authentication failed|could not read username|permission denied \(publickey\)|http basic: access denied|invalid username or password|repository access denied|requested url returned error: (?:401|403)\b|support for password authentication was removed|terminal prompts disabled/i,
      ],
      ["permission_denied", /permission denied|operation not permitted|access is denied/i],
      [
        "resource_exhausted",
        /no space left on device|disk quota exceeded|cannot allocate memory|too many open files|resource temporarily unavailable/i,
      ],
      [
        "repository_missing",
        /not a git repository|does not appear to be a git repository|cannot (?:change to|chdir to).*no such file or directory/i,
      ],
      ["ambiguous_revision", /ambiguous argument|short object id .* is ambiguous/i],
      [
        "bad_revision",
        /bad revision|bad object|needed a single revision|not a valid object name|unknown revision or path not in the working tree/i,
      ],
      [
        "corrupt_repository",
        /corrupt|index file smaller than expected|bad signature|object file .* is empty|inflate: data stream error|pack has bad object/i,
      ],
      [
        "remote_transport",
        /could not resolve host|failed to connect|connection (?:timed out|reset|refused)|network is unreachable|early eof|remote end hung up unexpectedly|rpc failed|http\/2 stream .* was not closed cleanly|ssh: connect to host|unable to access/i,
      ],
    ];
  });
function ux(t, e) {
  let r = e;
  for (; t[r] === "-c" && t[r + 1] != null; ) r += 2;
  let n = t[r];
  return n != null && uEt.has(n) ? n : "other";
}
var uEt,
  V4 = g(() => {
    uEt = new Set([
      "--version",
      "add",
      "apply",
      "archive",
      "blame",
      "branch",
      "cat-file",
      "check-attr",
      "check-ignore",
      "check-ref-format",
      "checkout",
      "cherry-pick",
      "clean",
      "clone",
      "commit",
      "config",
      "count-objects",
      "diff",
      "fetch",
      "for-each-ref",
      "fsck",
      "gc",
      "grep",
      "hash-object",
      "init",
      "log",
      "ls-files",
      "ls-remote",
      "merge",
      "merge-base",
      "mv",
      "pull",
      "push",
      "rebase",
      "remote",
      "reset",
      "restore",
      "rev-list",
      "rev-parse",
      "rm",
      "show",
      "show-ref",
      "sparse-checkout",
      "stash",
      "status",
      "submodule",
      "switch",
      "tag",
      "update-index",
      "version",
      "worktree",
    ]);
  });
function K4(t) {
  return t === ""
    ? "''"
    : /[^\w@%\-+=:,./]/.test(t)
      ? ("'" + t.replace(/('+)/g, `'"$1"'`) + "'").replace(/^''|''$/g, "")
      : t;
}
function ai(t) {
  if (!Array.isArray(t)) throw new TypeError("args should be an array");
  return t.map(K4).join(" ");
}
var bm = g(() => {
  "use strict";
});
var rTe = A((ay) => {
  "use strict";
  Object.defineProperty(ay, "__esModule", { value: !0 });
  ay.sync = ay.isexe = void 0;
  var dEt = require("fs"),
    pEt = require("fs/promises"),
    mEt = async (t, e = {}) => {
      let { ignoreErrors: r = !1 } = e;
      try {
        return tTe(await (0, pEt.stat)(t), e);
      } catch (n) {
        let o = n;
        if (r || o.code === "EACCES") return !1;
        throw o;
      }
    };
  ay.isexe = mEt;
  var fEt = (t, e = {}) => {
    let { ignoreErrors: r = !1 } = e;
    try {
      return tTe((0, dEt.statSync)(t), e);
    } catch (n) {
      let o = n;
      if (r || o.code === "EACCES") return !1;
      throw o;
    }
  };
  ay.sync = fEt;
  var tTe = (t, e) => t.isFile() && hEt(t, e),
    hEt = (t, e) => {
      let r = e.uid ?? process.getuid?.(),
        n = e.groups ?? process.getgroups?.() ?? [],
        o = e.gid ?? process.getgid?.() ?? n[0];
      if (r === void 0 || o === void 0) throw new Error("cannot get uid or gid");
      let i = new Set([o, ...n]),
        s = t.mode,
        a = t.uid,
        l = t.gid,
        c = parseInt("100", 8),
        u = parseInt("010", 8),
        p = parseInt("001", 8),
        m = c | u;
      return !!(s & p || (s & u && i.has(l)) || (s & c && a === r) || (s & m && r === 0));
    };
});
var oTe = A((ly) => {
  "use strict";
  Object.defineProperty(ly, "__esModule", { value: !0 });
  ly.sync = ly.isexe = void 0;
  var gEt = require("fs"),
    yEt = require("fs/promises"),
    vEt = async (t, e = {}) => {
      let { ignoreErrors: r = !1 } = e;
      try {
        return nTe(await (0, yEt.stat)(t), t, e);
      } catch (n) {
        let o = n;
        if (r || o.code === "EACCES") return !1;
        throw o;
      }
    };
  ly.isexe = vEt;
  var bEt = (t, e = {}) => {
    let { ignoreErrors: r = !1 } = e;
    try {
      return nTe((0, gEt.statSync)(t), t, e);
    } catch (n) {
      let o = n;
      if (r || o.code === "EACCES") return !1;
      throw o;
    }
  };
  ly.sync = bEt;
  var SEt = (t, e) => {
      let { pathExt: r = process.env.PATHEXT || "" } = e,
        n = r.split(";");
      if (n.indexOf("") !== -1) return !0;
      for (let o = 0; o < n.length; o++) {
        let i = n[o].toLowerCase(),
          s = t.substring(t.length - i.length).toLowerCase();
        if (i && s === i) return !0;
      }
      return !1;
    },
    nTe = (t, e, r) => t.isFile() && SEt(e, r);
});
var sTe = A((iTe) => {
  "use strict";
  Object.defineProperty(iTe, "__esModule", { value: !0 });
});
var pTe = A((An) => {
  "use strict";
  var aTe =
      (An && An.__createBinding) ||
      (Object.create
        ? function (t, e, r, n) {
            n === void 0 && (n = r);
            var o = Object.getOwnPropertyDescriptor(e, r);
            ((!o || ("get" in o ? !e.__esModule : o.writable || o.configurable)) &&
              (o = {
                enumerable: !0,
                get: function () {
                  return e[r];
                },
              }),
              Object.defineProperty(t, n, o));
          }
        : function (t, e, r, n) {
            (n === void 0 && (n = r), (t[n] = e[r]));
          }),
    wEt =
      (An && An.__setModuleDefault) ||
      (Object.create
        ? function (t, e) {
            Object.defineProperty(t, "default", { enumerable: !0, value: e });
          }
        : function (t, e) {
            t.default = e;
          }),
    lTe =
      (An && An.__importStar) ||
      function (t) {
        if (t && t.__esModule) return t;
        var e = {};
        if (t != null)
          for (var r in t)
            r !== "default" && Object.prototype.hasOwnProperty.call(t, r) && aTe(e, t, r);
        return (wEt(e, t), e);
      },
    _Et =
      (An && An.__exportStar) ||
      function (t, e) {
        for (var r in t)
          r !== "default" && !Object.prototype.hasOwnProperty.call(e, r) && aTe(e, t, r);
      };
  Object.defineProperty(An, "__esModule", { value: !0 });
  An.sync = An.isexe = An.posix = An.win32 = void 0;
  var cTe = lTe(rTe());
  An.posix = cTe;
  var uTe = lTe(oTe());
  An.win32 = uTe;
  _Et(sTe(), An);
  var xEt = process.env._ISEXE_TEST_PLATFORM_ || process.platform,
    dTe = xEt === "win32" ? uTe : cTe;
  An.isexe = dTe.isexe;
  An.sync = dTe.sync;
});
var _Te = A((yMr, wTe) => {
  var { isexe: AEt, sync: REt } = pTe(),
    { join: EEt, delimiter: CEt, sep: mTe, posix: fTe } = require("path"),
    hTe = process.platform === "win32",
    gTe = new RegExp(`[${fTe.sep}${mTe === fTe.sep ? "" : mTe}]`.replace(/(\\)/g, "\\$1")),
    TEt = new RegExp(`^\\.${gTe.source}`),
    yTe = (t) => Object.assign(new Error(`not found: ${t}`), { code: "ENOENT" }),
    vTe = (
      t,
      { path: e = process.env.PATH, pathExt: r = process.env.PATHEXT, delimiter: n = CEt },
    ) => {
      let o = t.match(gTe) ? [""] : [...(hTe ? [process.cwd()] : []), ...(e || "").split(n)];
      if (hTe) {
        let i = r || [".EXE", ".CMD", ".BAT", ".COM"].join(n),
          s = i.split(n).flatMap((a) => [a, a.toLowerCase()]);
        return (
          t.includes(".") && s[0] !== "" && s.unshift(""),
          { pathEnv: o, pathExt: s, pathExtExe: i }
        );
      }
      return { pathEnv: o, pathExt: [""] };
    },
    bTe = (t, e) => {
      let r = /^".*"$/.test(t) ? t.slice(1, -1) : t;
      return (!r && TEt.test(e) ? e.slice(0, 2) : "") + EEt(r, e);
    },
    STe = async (t, e = {}) => {
      let { pathEnv: r, pathExt: n, pathExtExe: o } = vTe(t, e),
        i = [];
      for (let s of r) {
        let a = bTe(s, t);
        for (let l of n) {
          let c = a + l;
          if (await AEt(c, { pathExt: o, ignoreErrors: !0 })) {
            if (!e.all) return c;
            i.push(c);
          }
        }
      }
      if (e.all && i.length) return i;
      if (e.nothrow) return null;
      throw yTe(t);
    },
    PEt = (t, e = {}) => {
      let { pathEnv: r, pathExt: n, pathExtExe: o } = vTe(t, e),
        i = [];
      for (let s of r) {
        let a = bTe(s, t);
        for (let l of n) {
          let c = a + l;
          if (REt(c, { pathExt: o, ignoreErrors: !0 })) {
            if (!e.all) return c;
            i.push(c);
          }
        }
      }
      if (e.all && i.length) return i;
      if (e.nothrow) return null;
      throw yTe(t);
    };
  wTe.exports = STe;
  STe.sync = PEt;
});
function ac(t) {
  let e = xTe(t);
  return t[e];
}
function Sm(t, e) {
  let r = xTe(t);
  if (Z4.default.platform === "win32")
    for (let n of Object.keys(t)) n === r || n.toLowerCase() !== "path" || delete t[n];
  t[r] = e;
}
function xTe(t) {
  if (Z4.default.platform !== "win32") return "PATH";
  if (t.Path != null) return "Path";
  if (t.PATH != null) return "PATH";
  for (let e of Object.keys(t)) if (e.toLowerCase() === "path") return e;
  return "Path";
}
var Z4,
  X4 = g(() => {
    Z4 = F(require("node:process"));
  });
var wD,
  dx,
  ATe,
  Y4,
  wm,
  _m = g(() => {
    ((wD = require("node:fs")), (dx = require("node:path")), (ATe = F(_Te())));
    X4();
    ((Y4 = class {
      executables = new Map();
      resolve(e, r = {}) {
        if (e.includes("/") || (process.platform === "win32" && e.includes("\\"))) return e;
        let n = r.cwd ?? process.cwd(),
          o = r.env ?? process.env,
          i = ac(o),
          s = JSON.stringify([e, n, i, o.PATHEXT]),
          a = this.executables.get(s);
        if (a != null)
          try {
            return ((0, wD.accessSync)(a, wD.constants.X_OK), a);
          } catch {
            this.executables.delete(s);
          }
        let l = i
            ?.split(dx.delimiter)
            .map((u) => (0, dx.resolve)(n, u))
            .join(dx.delimiter),
          c = ATe.default.sync(e, { nothrow: !0, path: l, pathExt: o.PATHEXT });
        return (c != null && this.executables.set(s, c), c);
      }
    }),
      (wm = new Y4()));
  });
var _D,
  RTe = g(() => {
    _D = class {
      constructor(e, r = [], n = [], o = !0, i, s) {
        this.child = e;
        this.stdoutChunks = r;
        this.stderrChunks = n;
        this.collectOutput = o;
        this.writeStdinImpl = s;
        (this.child.stdin?.on("error", (a) => {
          !this.child.killed &&
            this.result == null &&
            (this.child.kill(), ("code" in a && a.code === "EPIPE") || this.child.emit("error", a));
        }),
          (this.promise = i.then(
            ({ code: a, gitErrorKind: l, signal: c }) => (
              (this.result = { type: "resolve", code: a, gitErrorKind: l, signal: c }),
              this.result
            ),
            (a) => ((this.result = { type: "reject", error: a }), this.result),
          )));
      }
      result = null;
      promise;
      wait() {
        return this.promise.then((e) => {
          switch (e.type) {
            case "resolve": {
              let { code: r, gitErrorKind: n, signal: o } = e;
              return {
                stdout: this.collectOutput ? Buffer.concat(this.stdoutChunks).toString("utf8") : "",
                stderr: this.collectOutput ? Buffer.concat(this.stderrChunks).toString("utf8") : "",
                code: r,
                gitErrorKind: n,
                signal: o,
              };
            }
            case "reject":
              throw e.error;
          }
        });
      }
      getStdout() {
        return this.collectOutput ? Buffer.concat(this.stdoutChunks) : Buffer.alloc(0);
      }
      isDone() {
        return this.result != null;
      }
      getPid() {
        return this.child.pid ?? null;
      }
      kill(e) {
        this.child.kill(e);
      }
      writeStdin(e, r = {}) {
        if (this.writeStdinImpl != null) return this.writeStdinImpl(e, r);
        let n = this.child.stdin;
        return n == null
          ? Promise.reject(new Error("Process stdin is unavailable"))
          : new Promise((o, i) => {
              let s = (a) => {
                a != null ? i(a) : o();
              };
              r.closeStdin ? n.end(e, s) : n.write(e, s);
            });
      }
    };
  });
