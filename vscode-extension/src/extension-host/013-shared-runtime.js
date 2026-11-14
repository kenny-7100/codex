var Ade = A((DG) => {
  DG.read = function (t, e, r, n, o) {
    var i,
      s,
      a = o * 8 - n - 1,
      l = (1 << a) - 1,
      c = l >> 1,
      u = -7,
      p = r ? o - 1 : 0,
      m = r ? -1 : 1,
      f = t[e + p];
    for (
      p += m, i = f & ((1 << -u) - 1), f >>= -u, u += a;
      u > 0;
      i = i * 256 + t[e + p], p += m, u -= 8
    );
    for (s = i & ((1 << -u) - 1), i >>= -u, u += n; u > 0; s = s * 256 + t[e + p], p += m, u -= 8);
    if (i === 0) i = 1 - c;
    else {
      if (i === l) return s ? NaN : (f ? -1 : 1) * (1 / 0);
      ((s = s + Math.pow(2, n)), (i = i - c));
    }
    return (f ? -1 : 1) * s * Math.pow(2, i - n);
  };
  DG.write = function (t, e, r, n, o, i) {
    var s,
      a,
      l,
      c = i * 8 - o - 1,
      u = (1 << c) - 1,
      p = u >> 1,
      m = o === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
      f = n ? 0 : i - 1,
      h = n ? 1 : -1,
      v = e < 0 || (e === 0 && 1 / e < 0) ? 1 : 0;
    for (
      e = Math.abs(e),
        isNaN(e) || e === 1 / 0
          ? ((a = isNaN(e) ? 1 : 0), (s = u))
          : ((s = Math.floor(Math.log(e) / Math.LN2)),
            e * (l = Math.pow(2, -s)) < 1 && (s--, (l *= 2)),
            s + p >= 1 ? (e += m / l) : (e += m * Math.pow(2, 1 - p)),
            e * l >= 2 && (s++, (l /= 2)),
            s + p >= u
              ? ((a = 0), (s = u))
              : s + p >= 1
                ? ((a = (e * l - 1) * Math.pow(2, o)), (s = s + p))
                : ((a = e * Math.pow(2, p - 1) * Math.pow(2, o)), (s = 0)));
      o >= 8;
      t[r + f] = a & 255, f += h, a /= 256, o -= 8
    );
    for (s = (s << o) | a, c += o; c > 0; t[r + f] = s & 255, f += h, s /= 256, c -= 8);
    t[r + f - h] |= v * 128;
  };
});
function Qct() {
  if (!(typeof globalThis.TextDecoder > "u"))
    return PI ?? (PI = new globalThis.TextDecoder("utf-8"));
}
function Ede(t, e = "utf-8") {
  switch (e.toLowerCase()) {
    case "utf-8":
    case "utf8": {
      let r = Qct();
      return r ? r.decode(t) : tut(t);
    }
    case "utf-16le":
      return rut(t);
    case "us-ascii":
    case "ascii":
      return nut(t);
    case "latin1":
    case "iso-8859-1":
      return out(t);
    case "windows-1252":
      return iut(t);
    default:
      throw new RangeError(`Encoding '${e}' not supported`);
  }
}
function MG(t, e) {
  e.length !== 0 && (t.push(String.fromCharCode.apply(null, e)), (e.length = 0));
}
function dn(t, e, r) {
  (e.push(r), e.length >= hg && MG(t, e));
}
function eut(t, e, r) {
  if (r <= 65535) {
    dn(t, e, r);
    return;
  }
  ((r -= 65536), dn(t, e, 55296 + (r >> 10)), dn(t, e, 56320 + (r & 1023)));
}
function tut(t) {
  let e = [],
    r = [],
    n = 0;
  for (t.length >= 3 && t[0] === 239 && t[1] === 187 && t[2] === 191 && (n = 3); n < t.length; ) {
    let o = t[n];
    if (o <= 127) {
      (dn(e, r, o), n++);
      continue;
    }
    if (o < 194 || o > 244) {
      (dn(e, r, Os), n++);
      continue;
    }
    if (o <= 223) {
      if (n + 1 >= t.length) {
        (dn(e, r, Os), n++);
        continue;
      }
      let u = t[n + 1];
      if ((u & 192) !== 128) {
        (dn(e, r, Os), n++);
        continue;
      }
      let p = ((o & 31) << 6) | (u & 63);
      (dn(e, r, p), (n += 2));
      continue;
    }
    if (o <= 239) {
      if (n + 2 >= t.length) {
        (dn(e, r, Os), n++);
        continue;
      }
      let u = t[n + 1],
        p = t[n + 2];
      if (
        !(
          (u & 192) === 128 &&
          (p & 192) === 128 &&
          !(o === 224 && u < 160) &&
          !(o === 237 && u >= 160)
        )
      ) {
        (dn(e, r, Os), n++);
        continue;
      }
      let f = ((o & 15) << 12) | ((u & 63) << 6) | (p & 63);
      (dn(e, r, f), (n += 3));
      continue;
    }
    if (n + 3 >= t.length) {
      (dn(e, r, Os), n++);
      continue;
    }
    let i = t[n + 1],
      s = t[n + 2],
      a = t[n + 3];
    if (
      !(
        (i & 192) === 128 &&
        (s & 192) === 128 &&
        (a & 192) === 128 &&
        !(o === 240 && i < 144) &&
        !(o === 244 && i > 143)
      )
    ) {
      (dn(e, r, Os), n++);
      continue;
    }
    let c = ((o & 7) << 18) | ((i & 63) << 12) | ((s & 63) << 6) | (a & 63);
    (eut(e, r, c), (n += 4));
  }
  return (MG(e, r), e.join(""));
}
function rut(t) {
  let e = [],
    r = [],
    n = t.length,
    o = 0;
  for (; o + 1 < n; ) {
    let i = t[o] | (t[o + 1] << 8);
    if (((o += 2), i >= 55296 && i <= 56319)) {
      if (o + 1 < n) {
        let s = t[o] | (t[o + 1] << 8);
        s >= 56320 && s <= 57343 ? (dn(e, r, i), dn(e, r, s), (o += 2)) : dn(e, r, Os);
      } else dn(e, r, Os);
      continue;
    }
    if (i >= 56320 && i <= 57343) {
      dn(e, r, Os);
      continue;
    }
    dn(e, r, i);
  }
  return (o < n && dn(e, r, Os), MG(e, r), e.join(""));
}
function nut(t) {
  let e = [];
  for (let r = 0; r < t.length; r += hg) {
    let n = Math.min(t.length, r + hg),
      o = new Array(n - r);
    for (let i = r, s = 0; i < n; i++, s++) o[s] = t[i] & 127;
    e.push(String.fromCharCode.apply(null, o));
  }
  return e.join("");
}
function out(t) {
  let e = [];
  for (let r = 0; r < t.length; r += hg) {
    let n = Math.min(t.length, r + hg),
      o = new Array(n - r);
    for (let i = r, s = 0; i < n; i++, s++) o[s] = t[i];
    e.push(String.fromCharCode.apply(null, o));
  }
  return e.join("");
}
function iut(t) {
  let e = [],
    r = "";
  for (let n = 0; n < t.length; n++) {
    let o = t[n],
      i = o >= 128 && o <= 159 ? Rde[o] : void 0;
    ((r += i ?? String.fromCharCode(o)), r.length >= hg && (e.push(r), (r = "")));
  }
  return (r && e.push(r), e.join(""));
}
var Rde,
  Jct,
  PI,
  hg,
  Os,
  Cde = g(() => {
    ((Rde = {
      128: "\u20AC",
      130: "\u201A",
      131: "\u0192",
      132: "\u201E",
      133: "\u2026",
      134: "\u2020",
      135: "\u2021",
      136: "\u02C6",
      137: "\u2030",
      138: "\u0160",
      139: "\u2039",
      140: "\u0152",
      142: "\u017D",
      145: "\u2018",
      146: "\u2019",
      147: "\u201C",
      148: "\u201D",
      149: "\u2022",
      150: "\u2013",
      151: "\u2014",
      152: "\u02DC",
      153: "\u2122",
      154: "\u0161",
      155: "\u203A",
      156: "\u0153",
      158: "\u017E",
      159: "\u0178",
    }),
      (Jct = {}));
    for (let [t, e] of Object.entries(Rde)) Jct[e] = Number.parseInt(t, 10);
    ((hg = 32 * 1024), (Os = 65533));
  });
function ti(t) {
  return new DataView(t.buffer, t.byteOffset);
}
var Tde,
  Pde,
  qr,
  Mp,
  Mr,
  OG,
  Ide,
  kde,
  ri,
  _w = g(() => {
    Tde = F(Ade(), 1);
    Cde();
    ((Pde = {
      len: 1,
      get(t, e) {
        return ti(t).getUint8(e);
      },
      put(t, e, r) {
        return (ti(t).setUint8(e, r), e + 1);
      },
    }),
      (qr = {
        len: 2,
        get(t, e) {
          return ti(t).getUint16(e, !0);
        },
        put(t, e, r) {
          return (ti(t).setUint16(e, r, !0), e + 2);
        },
      }),
      (Mp = {
        len: 2,
        get(t, e) {
          return ti(t).getUint16(e);
        },
        put(t, e, r) {
          return (ti(t).setUint16(e, r), e + 2);
        },
      }),
      (Mr = {
        len: 4,
        get(t, e) {
          return ti(t).getUint32(e, !0);
        },
        put(t, e, r) {
          return (ti(t).setUint32(e, r, !0), e + 4);
        },
      }),
      (OG = {
        len: 4,
        get(t, e) {
          return ti(t).getUint32(e);
        },
        put(t, e, r) {
          return (ti(t).setUint32(e, r), e + 4);
        },
      }),
      (Ide = {
        len: 4,
        get(t, e) {
          return ti(t).getInt32(e);
        },
        put(t, e, r) {
          return (ti(t).setInt32(e, r), e + 4);
        },
      }),
      (kde = {
        len: 8,
        get(t, e) {
          return ti(t).getBigUint64(e, !0);
        },
        put(t, e, r) {
          return (ti(t).setBigUint64(e, r, !0), e + 8);
        },
      }),
      (ri = class {
        constructor(e, r) {
          ((this.len = e), (this.encoding = r));
        }
        get(e, r = 0) {
          let n = e.subarray(r, r + this.len);
          return Ede(n, this.encoding);
        }
      }));
  });
var aut,
  Jt,
  Op,
  xw = g(() => {
    ((aut = "End-Of-Stream"),
      (Jt = class extends Error {
        constructor() {
          (super(aut), (this.name = "EndOfStreamError"));
        }
      }),
      (Op = class extends Error {
        constructor(e = "The operation was aborted") {
          (super(e), (this.name = "AbortError"));
        }
      }));
  });
var Dde = g(() => {});
var Np,
  II = g(() => {
    xw();
    Np = class {
      constructor() {
        ((this.endOfStream = !1), (this.interrupted = !1), (this.peekQueue = []));
      }
      async peek(e, r = !1) {
        let n = await this.read(e, r);
        return (this.peekQueue.push(e.subarray(0, n)), n);
      }
      async read(e, r = !1) {
        if (e.length === 0) return 0;
        let n = this.readFromPeekBuffer(e);
        if (
          (this.endOfStream || (n += await this.readRemainderFromStream(e.subarray(n), r)),
          n === 0 && !r)
        )
          throw new Jt();
        return n;
      }
      readFromPeekBuffer(e) {
        let r = e.length,
          n = 0;
        for (; this.peekQueue.length > 0 && r > 0; ) {
          let o = this.peekQueue.pop();
          if (!o) throw new Error("peekData should be defined");
          let i = Math.min(o.length, r);
          (e.set(o.subarray(0, i), n),
            (n += i),
            (r -= i),
            i < o.length && this.peekQueue.push(o.subarray(i)));
        }
        return n;
      }
      async readRemainderFromStream(e, r) {
        let n = 0;
        for (; n < e.length && !this.endOfStream; ) {
          if (this.interrupted) throw new Op();
          let o = await this.readFromStream(e.subarray(n), r);
          if (o === 0) break;
          n += o;
        }
        if (!r && n < e.length) throw new Jt();
        return n;
      }
    };
  });
var Mde = g(() => {
  xw();
  Dde();
  II();
});
var kI,
  Ode = g(() => {
    II();
    kI = class extends Np {
      constructor(e) {
        (super(), (this.reader = e));
      }
      async abort() {
        return this.close();
      }
      async close() {
        this.reader.releaseLock();
      }
    };
  });
var Aw,
  NG = g(() => {
    Ode();
    Aw = class extends kI {
      async readFromStream(e, r) {
        if (e.length === 0) return 0;
        let n = await this.reader.read(new Uint8Array(e.length), { min: r ? void 0 : e.length });
        return (
          n.done && (this.endOfStream = n.done),
          n.value ? (e.set(n.value), n.value.length) : 0
        );
      }
    };
  });
var gg,
  LG = g(() => {
    xw();
    II();
    gg = class extends Np {
      constructor(e) {
        (super(), (this.reader = e), (this.buffer = null));
      }
      writeChunk(e, r) {
        let n = Math.min(r.length, e.length);
        return (
          e.set(r.subarray(0, n)),
          n < r.length ? (this.buffer = r.subarray(n)) : (this.buffer = null),
          n
        );
      }
      async readFromStream(e, r) {
        if (e.length === 0) return 0;
        let n = 0;
        for (
          this.buffer && (n += this.writeChunk(e, this.buffer));
          n < e.length && !this.endOfStream;

        ) {
          let o = await this.reader.read();
          if (o.done) {
            this.endOfStream = !0;
            break;
          }
          o.value && (n += this.writeChunk(e.subarray(n), o.value));
        }
        if (!r && n === 0 && this.endOfStream) throw new Jt();
        return n;
      }
      abort() {
        return ((this.interrupted = !0), this.reader.cancel());
      }
      async close() {
        (await this.abort(), this.reader.releaseLock());
      }
    };
  });
function BG(t) {
  try {
    let e = t.getReader({ mode: "byob" });
    return e instanceof ReadableStreamDefaultReader ? new gg(e) : new Aw(e);
  } catch (e) {
    if (e instanceof TypeError) return new gg(t.getReader());
    throw e;
  }
}
var Nde = g(() => {
  NG();
  LG();
});
var Lp = g(() => {
  xw();
  Mde();
  NG();
  LG();
  Nde();
});
var jl,
  Rw = g(() => {
    Lp();
    jl = class {
      constructor(e) {
        ((this.numBuffer = new Uint8Array(8)),
          (this.position = 0),
          (this.onClose = e?.onClose),
          e?.abortSignal &&
            e.abortSignal.addEventListener("abort", () => {
              this.abort();
            }));
      }
      async readToken(e, r = this.position) {
        let n = new Uint8Array(e.len);
        if ((await this.readBuffer(n, { position: r })) < e.len) throw new Jt();
        return e.get(n, 0);
      }
      async peekToken(e, r = this.position) {
        let n = new Uint8Array(e.len);
        if ((await this.peekBuffer(n, { position: r })) < e.len) throw new Jt();
        return e.get(n, 0);
      }
      async readNumber(e) {
        if ((await this.readBuffer(this.numBuffer, { length: e.len })) < e.len) throw new Jt();
        return e.get(this.numBuffer, 0);
      }
      async peekNumber(e) {
        if ((await this.peekBuffer(this.numBuffer, { length: e.len })) < e.len) throw new Jt();
        return e.get(this.numBuffer, 0);
      }
      async ignore(e) {
        if (e < 0) throw new RangeError("ignore length must be \u2265 0 bytes");
        if (this.fileInfo.size !== void 0) {
          let r = this.fileInfo.size - this.position;
          if (e > r) return ((this.position += r), r);
        }
        return ((this.position += e), e);
      }
      async close() {
        (await this.abort(), await this.onClose?.());
      }
      normalizeOptions(e, r) {
        if (
          !this.supportsRandomAccess() &&
          r &&
          r.position !== void 0 &&
          r.position < this.position
        )
          throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
        return { mayBeLess: !1, offset: 0, length: e.length, position: this.position, ...r };
      }
      abort() {
        return Promise.resolve();
      }
    };
  });
var cut,
  DI,
  Lde = g(() => {
    Rw();
    Lp();
    ((cut = 256e3),
      (DI = class extends jl {
        constructor(e, r) {
          (super(r), (this.streamReader = e), (this.fileInfo = r?.fileInfo ?? {}));
        }
        async readBuffer(e, r) {
          let n = this.normalizeOptions(e, r),
            o = n.position - this.position;
          if (o > 0) return (await this.ignore(o), this.readBuffer(e, r));
          if (o < 0)
            throw new Error(
              "`options.position` must be equal or greater than `tokenizer.position`",
            );
          if (n.length === 0) return 0;
          let i = await this.streamReader.read(e.subarray(0, n.length), n.mayBeLess);
          if (((this.position += i), (!r || !r.mayBeLess) && i < n.length)) throw new Jt();
          return i;
        }
        async peekBuffer(e, r) {
          let n = this.normalizeOptions(e, r),
            o = 0;
          if (n.position) {
            let i = n.position - this.position;
            if (i > 0) {
              let s = new Uint8Array(n.length + i);
              return (
                (o = await this.peekBuffer(s, { mayBeLess: n.mayBeLess })),
                e.set(s.subarray(i)),
                o - i
              );
            }
            if (i < 0) throw new Error("Cannot peek from a negative offset in a stream");
          }
          if (n.length > 0) {
            try {
              o = await this.streamReader.peek(e.subarray(0, n.length), n.mayBeLess);
            } catch (i) {
              if (r?.mayBeLess && i instanceof Jt) return 0;
              throw i;
            }
            if (!n.mayBeLess && o < n.length) throw new Jt();
          }
          return o;
        }
        async ignore(e) {
          if (e < 0) throw new RangeError("ignore length must be \u2265 0 bytes");
          let r = Math.min(cut, e),
            n = new Uint8Array(r),
            o = 0;
          for (; o < e; ) {
            let i = e - o,
              s = await this.readBuffer(n, { length: Math.min(r, i) });
            if (s < 0) return s;
            o += s;
          }
          return o;
        }
        abort() {
          return this.streamReader.abort();
        }
        async close() {
          return this.streamReader.close();
        }
        supportsRandomAccess() {
          return !1;
        }
      }));
  });
var MI,
  Bde = g(() => {
    Lp();
    Rw();
    MI = class extends jl {
      constructor(e, r) {
        (super(r),
          (this.uint8Array = e),
          (this.fileInfo = { ...(r?.fileInfo ?? {}), size: e.length }));
      }
      async readBuffer(e, r) {
        r?.position && (this.position = r.position);
        let n = await this.peekBuffer(e, r);
        return ((this.position += n), n);
      }
      async peekBuffer(e, r) {
        let n = this.normalizeOptions(e, r),
          o = Math.min(this.uint8Array.length - n.position, n.length);
        if (!n.mayBeLess && o < n.length) throw new Jt();
        return (e.set(this.uint8Array.subarray(n.position, n.position + o)), o);
      }
      close() {
        return super.close();
      }
      supportsRandomAccess() {
        return !0;
      }
      setPosition(e) {
        this.position = e;
      }
    };
  });
var OI,
  Fde = g(() => {
    Lp();
    Rw();
    OI = class extends jl {
      constructor(e, r) {
        (super(r),
          (this.blob = e),
          (this.fileInfo = { ...(r?.fileInfo ?? {}), size: e.size, mimeType: e.type }));
      }
      async readBuffer(e, r) {
        r?.position && (this.position = r.position);
        let n = await this.peekBuffer(e, r);
        return ((this.position += n), n);
      }
      async peekBuffer(e, r) {
        let n = this.normalizeOptions(e, r),
          o = Math.min(this.blob.size - n.position, n.length);
        if (!n.mayBeLess && o < n.length) throw new Jt();
        let i = await this.blob.slice(n.position, n.position + o).arrayBuffer();
        return (e.set(new Uint8Array(i)), o);
      }
      close() {
        return super.close();
      }
      supportsRandomAccess() {
        return !0;
      }
      setPosition(e) {
        this.position = e;
      }
    };
  });
function $de(t, e) {
  let r = BG(t),
    n = e ?? {},
    o = n.onClose;
  return (
    (n.onClose = async () => {
      if ((await r.close(), o)) return o();
    }),
    new DI(r, n)
  );
}
function Ude(t, e) {
  return new MI(t, e);
}
function qde(t, e) {
  return new OI(t, e);
}
var Gde = g(() => {
  Lp();
  Lde();
  Bde();
  Fde();
  Lp();
  Rw();
});
var Hde = A((Rar, Wde) => {
  var yg = 1e3,
    vg = yg * 60,
    bg = vg * 60,
    Bp = bg * 24,
    dut = Bp * 7,
    put = Bp * 365.25;
  Wde.exports = function (t, e) {
    e = e || {};
    var r = typeof t;
    if (r === "string" && t.length > 0) return mut(t);
    if (r === "number" && isFinite(t)) return e.long ? hut(t) : fut(t);
    throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(t));
  };
  function mut(t) {
    if (((t = String(t)), !(t.length > 100))) {
      var e =
        /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
          t,
        );
      if (e) {
        var r = parseFloat(e[1]),
          n = (e[2] || "ms").toLowerCase();
        switch (n) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return r * put;
          case "weeks":
          case "week":
          case "w":
            return r * dut;
          case "days":
          case "day":
          case "d":
            return r * Bp;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return r * bg;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return r * vg;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return r * yg;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return r;
          default:
            return;
        }
      }
    }
  }
  function fut(t) {
    var e = Math.abs(t);
    return e >= Bp
      ? Math.round(t / Bp) + "d"
      : e >= bg
        ? Math.round(t / bg) + "h"
        : e >= vg
          ? Math.round(t / vg) + "m"
          : e >= yg
            ? Math.round(t / yg) + "s"
            : t + "ms";
  }
  function hut(t) {
    var e = Math.abs(t);
    return e >= Bp
      ? NI(t, e, Bp, "day")
      : e >= bg
        ? NI(t, e, bg, "hour")
        : e >= vg
          ? NI(t, e, vg, "minute")
          : e >= yg
            ? NI(t, e, yg, "second")
            : t + " ms";
  }
  function NI(t, e, r, n) {
    var o = e >= r * 1.5;
    return Math.round(t / r) + " " + n + (o ? "s" : "");
  }
});
var FG = A((Ear, jde) => {
  function gut(t) {
    ((r.debug = r),
      (r.default = r),
      (r.coerce = l),
      (r.disable = s),
      (r.enable = o),
      (r.enabled = a),
      (r.humanize = Hde()),
      (r.destroy = c),
      Object.keys(t).forEach((u) => {
        r[u] = t[u];
      }),
      (r.names = []),
      (r.skips = []),
      (r.formatters = {}));
    function e(u) {
      let p = 0;
      for (let m = 0; m < u.length; m++) ((p = (p << 5) - p + u.charCodeAt(m)), (p |= 0));
      return r.colors[Math.abs(p) % r.colors.length];
    }
    r.selectColor = e;
    function r(u) {
      let p,
        m = null,
        f,
        h;
      function v(...y) {
        if (!v.enabled) return;
        let w = v,
          _ = Number(new Date()),
          S = _ - (p || _);
        ((w.diff = S),
          (w.prev = p),
          (w.curr = _),
          (p = _),
          (y[0] = r.coerce(y[0])),
          typeof y[0] != "string" && y.unshift("%O"));
        let E = 0;
        ((y[0] = y[0].replace(/%([a-zA-Z%])/g, (P, M) => {
          if (P === "%%") return "%";
          E++;
          let L = r.formatters[M];
          if (typeof L == "function") {
            let V = y[E];
            ((P = L.call(w, V)), y.splice(E, 1), E--);
          }
          return P;
        })),
          r.formatArgs.call(w, y),
          (w.log || r.log).apply(w, y));
      }
      return (
        (v.namespace = u),
        (v.useColors = r.useColors()),
        (v.color = r.selectColor(u)),
        (v.extend = n),
        (v.destroy = r.destroy),
        Object.defineProperty(v, "enabled", {
          enumerable: !0,
          configurable: !1,
          get: () =>
            m !== null ? m : (f !== r.namespaces && ((f = r.namespaces), (h = r.enabled(u))), h),
          set: (y) => {
            m = y;
          },
        }),
        typeof r.init == "function" && r.init(v),
        v
      );
    }
    function n(u, p) {
      let m = r(this.namespace + (typeof p > "u" ? ":" : p) + u);
      return ((m.log = this.log), m);
    }
    function o(u) {
      (r.save(u), (r.namespaces = u), (r.names = []), (r.skips = []));
      let p = (typeof u == "string" ? u : "")
        .trim()
        .replace(/\s+/g, ",")
        .split(",")
        .filter(Boolean);
      for (let m of p) m[0] === "-" ? r.skips.push(m.slice(1)) : r.names.push(m);
    }
    function i(u, p) {
      let m = 0,
        f = 0,
        h = -1,
        v = 0;
      for (; m < u.length; )
        if (f < p.length && (p[f] === u[m] || p[f] === "*"))
          p[f] === "*" ? ((h = f), (v = m), f++) : (m++, f++);
        else if (h !== -1) ((f = h + 1), v++, (m = v));
        else return !1;
      for (; f < p.length && p[f] === "*"; ) f++;
      return f === p.length;
    }
    function s() {
      let u = [...r.names, ...r.skips.map((p) => "-" + p)].join(",");
      return (r.enable(""), u);
    }
    function a(u) {
      for (let p of r.skips) if (i(u, p)) return !1;
      for (let p of r.names) if (i(u, p)) return !0;
      return !1;
    }
    function l(u) {
      return u instanceof Error ? u.stack || u.message : u;
    }
    function c() {
      console.warn(
        "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.",
      );
    }
    return (r.enable(r.load()), r);
  }
  jde.exports = gut;
});
var zde = A((ni, LI) => {
  ni.formatArgs = vut;
  ni.save = but;
  ni.load = Sut;
  ni.useColors = yut;
  ni.storage = wut();
  ni.destroy = (() => {
    let t = !1;
    return () => {
      t ||
        ((t = !0),
        console.warn(
          "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.",
        ));
    };
  })();
  ni.colors = [
    "#0000CC",
    "#0000FF",
    "#0033CC",
    "#0033FF",
    "#0066CC",
    "#0066FF",
    "#0099CC",
    "#0099FF",
    "#00CC00",
    "#00CC33",
    "#00CC66",
    "#00CC99",
    "#00CCCC",
    "#00CCFF",
    "#3300CC",
    "#3300FF",
    "#3333CC",
    "#3333FF",
    "#3366CC",
    "#3366FF",
    "#3399CC",
    "#3399FF",
    "#33CC00",
    "#33CC33",
    "#33CC66",
    "#33CC99",
    "#33CCCC",
    "#33CCFF",
    "#6600CC",
    "#6600FF",
    "#6633CC",
    "#6633FF",
    "#66CC00",
    "#66CC33",
    "#9900CC",
    "#9900FF",
    "#9933CC",
    "#9933FF",
    "#99CC00",
    "#99CC33",
    "#CC0000",
    "#CC0033",
    "#CC0066",
    "#CC0099",
    "#CC00CC",
    "#CC00FF",
    "#CC3300",
    "#CC3333",
    "#CC3366",
    "#CC3399",
    "#CC33CC",
    "#CC33FF",
    "#CC6600",
    "#CC6633",
    "#CC9900",
    "#CC9933",
    "#CCCC00",
    "#CCCC33",
    "#FF0000",
    "#FF0033",
    "#FF0066",
    "#FF0099",
    "#FF00CC",
    "#FF00FF",
    "#FF3300",
    "#FF3333",
    "#FF3366",
    "#FF3399",
    "#FF33CC",
    "#FF33FF",
    "#FF6600",
    "#FF6633",
    "#FF9900",
    "#FF9933",
    "#FFCC00",
    "#FFCC33",
  ];
  function yut() {
    if (
      typeof window < "u" &&
      window.process &&
      (window.process.type === "renderer" || window.process.__nwjs)
    )
      return !0;
    let t;
    return (
      (typeof document < "u" &&
        document.documentElement &&
        document.documentElement.style &&
        document.documentElement.style.WebkitAppearance) ||
      (typeof window < "u" &&
        window.console &&
        (window.console.firebug || (window.console.exception && window.console.table))) ||
      !1 ||
      !1
    );
  }
  function vut(t) {
    if (
      ((t[0] =
        (this.useColors ? "%c" : "") +
        this.namespace +
        (this.useColors ? " %c" : " ") +
        t[0] +
        (this.useColors ? "%c " : " ") +
        "+" +
        LI.exports.humanize(this.diff)),
      !this.useColors)
    )
      return;
    let e = "color: " + this.color;
    t.splice(1, 0, e, "color: inherit");
    let r = 0,
      n = 0;
    (t[0].replace(/%[a-zA-Z%]/g, (o) => {
      o !== "%%" && (r++, o === "%c" && (n = r));
    }),
      t.splice(n, 0, e));
  }
  ni.log = console.debug || console.log || (() => {});
  function but(t) {
    try {
      t ? ni.storage.setItem("debug", t) : ni.storage.removeItem("debug");
    } catch {}
  }
  function Sut() {
    let t;
    try {
      t = ni.storage.getItem("debug") || ni.storage.getItem("DEBUG");
    } catch {}
    return (!t && typeof process < "u" && "env" in process && (t = "release"), t);
  }
  function wut() {
    try {
      return localStorage;
    } catch {}
  }
  LI.exports = FG()(ni);
  var { formatters: _ut } = LI.exports;
  _ut.j = function (t) {
    try {
      return JSON.stringify(t);
    } catch (e) {
      return "[UnexpectedJSONParseError]: " + e.message;
    }
  };
});
var Kde = A((Car, Vde) => {
  "use strict";
  Vde.exports = (t, e = process.argv) => {
    let r = t.startsWith("-") ? "" : t.length === 1 ? "-" : "--",
      n = e.indexOf(r + t),
      o = e.indexOf("--");
    return n !== -1 && (o === -1 || n < o);
  };
});
var Yde = A((Tar, Xde) => {
  "use strict";
  var xut = require("os"),
    Zde = require("tty"),
    es = Kde(),
    { env: Nn } = process,
    BI;
  es("no-color") || es("no-colors") || es("color=false") || es("color=never")
    ? (BI = 0)
    : (es("color") || es("colors") || es("color=true") || es("color=always")) && (BI = 1);
  function Aut() {
    if ("FORCE_COLOR" in Nn)
      return Nn.FORCE_COLOR === "true"
        ? 1
        : Nn.FORCE_COLOR === "false"
          ? 0
          : Nn.FORCE_COLOR.length === 0
            ? 1
            : Math.min(Number.parseInt(Nn.FORCE_COLOR, 10), 3);
  }
  function Rut(t) {
    return t === 0 ? !1 : { level: t, hasBasic: !0, has256: t >= 2, has16m: t >= 3 };
  }
  function Eut(t, { streamIsTTY: e, sniffFlags: r = !0 } = {}) {
    let n = Aut();
    n !== void 0 && (BI = n);
    let o = r ? BI : n;
    if (o === 0) return 0;
    if (r) {
      if (es("color=16m") || es("color=full") || es("color=truecolor")) return 3;
      if (es("color=256")) return 2;
    }
    if (t && !e && o === void 0) return 0;
    let i = o || 0;
    if (Nn.TERM === "dumb") return i;
    if (process.platform === "win32") {
      let s = xut.release().split(".");
      return Number(s[0]) >= 10 && Number(s[2]) >= 10586 ? (Number(s[2]) >= 14931 ? 3 : 2) : 1;
    }
    if ("CI" in Nn)
      return [
        "TRAVIS",
        "CIRCLECI",
        "APPVEYOR",
        "GITLAB_CI",
        "GITHUB_ACTIONS",
        "BUILDKITE",
        "DRONE",
      ].some((s) => s in Nn) || Nn.CI_NAME === "codeship"
        ? 1
        : i;
    if ("TEAMCITY_VERSION" in Nn)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(Nn.TEAMCITY_VERSION) ? 1 : 0;
    if (Nn.COLORTERM === "truecolor") return 3;
    if ("TERM_PROGRAM" in Nn) {
      let s = Number.parseInt((Nn.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (Nn.TERM_PROGRAM) {
        case "iTerm.app":
          return s >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(Nn.TERM)
      ? 2
      : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(Nn.TERM) ||
          "COLORTERM" in Nn
        ? 1
        : i;
  }
  function $G(t, e = {}) {
    let r = Eut(t, { streamIsTTY: t && t.isTTY, ...e });
    return Rut(r);
  }
  Xde.exports = {
    supportsColor: $G,
    stdout: $G({ isTTY: Zde.isatty(1) }),
    stderr: $G({ isTTY: Zde.isatty(2) }),
  };
});
var Qde = A((Ln, $I) => {
  var Cut = require("tty"),
    FI = require("util");
  Ln.init = Out;
  Ln.log = kut;
  Ln.formatArgs = Put;
  Ln.save = Dut;
  Ln.load = Mut;
  Ln.useColors = Tut;
  Ln.destroy = FI.deprecate(
    () => {},
    "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.",
  );
  Ln.colors = [6, 2, 3, 4, 5, 1];
  try {
    let t = Yde();
    t &&
      (t.stderr || t).level >= 2 &&
      (Ln.colors = [
        20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68, 69, 74, 75, 76,
        77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149, 160, 161, 162,
        163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198,
        199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221,
      ]);
  } catch {}
  Ln.inspectOpts = Object.keys(process.env)
    .filter((t) => /^debug_/i.test(t))
    .reduce((t, e) => {
      let r = e
          .substring(6)
          .toLowerCase()
          .replace(/_([a-z])/g, (o, i) => i.toUpperCase()),
        n = process.env[e];
      return (
        /^(yes|on|true|enabled)$/i.test(n)
          ? (n = !0)
          : /^(no|off|false|disabled)$/i.test(n)
            ? (n = !1)
            : n === "null"
              ? (n = null)
              : (n = Number(n)),
        (t[r] = n),
        t
      );
    }, {});
  function Tut() {
    return "colors" in Ln.inspectOpts ? !!Ln.inspectOpts.colors : Cut.isatty(process.stderr.fd);
  }
  function Put(t) {
    let { namespace: e, useColors: r } = this;
    if (r) {
      let n = this.color,
        o = "\x1B[3" + (n < 8 ? n : "8;5;" + n),
        i = `  ${o};1m${e} \x1B[0m`;
      ((t[0] =
        i +
        t[0]
          .split(
            `
`,
          )
          .join(
            `
` + i,
          )),
        t.push(o + "m+" + $I.exports.humanize(this.diff) + "\x1B[0m"));
    } else t[0] = Iut() + e + " " + t[0];
  }
  function Iut() {
    return Ln.inspectOpts.hideDate ? "" : new Date().toISOString() + " ";
  }
  function kut(...t) {
    return process.stderr.write(
      FI.formatWithOptions(Ln.inspectOpts, ...t) +
        `
`,
    );
  }
  function Dut(t) {
    t ? (process.env.DEBUG = t) : delete "release";
  }
  function Mut() {
    return "release";
  }
  function Out(t) {
    t.inspectOpts = {};
    let e = Object.keys(Ln.inspectOpts);
    for (let r = 0; r < e.length; r++) t.inspectOpts[e[r]] = Ln.inspectOpts[e[r]];
  }
  $I.exports = FG()(Ln);
  var { formatters: Jde } = $I.exports;
  Jde.o = function (t) {
    return (
      (this.inspectOpts.colors = this.useColors),
      FI.inspect(t, this.inspectOpts)
        .split(
          `
`,
        )
        .map((e) => e.trim())
        .join(" ")
    );
  };
  Jde.O = function (t) {
    return ((this.inspectOpts.colors = this.useColors), FI.inspect(t, this.inspectOpts));
  };
});
var qG = A((Par, UG) => {
  typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs
    ? (UG.exports = zde())
    : (UG.exports = Qde());
});
var Fp,
  GG,
  epe,
  tpe,
  rpe,
  npe = g(() => {
    _w();
    ((Fp = {
      LocalFileHeader: 67324752,
      DataDescriptor: 134695760,
      CentralFileHeader: 33639248,
      EndOfCentralDirectory: 101010256,
    }),
      (GG = {
        get(t) {
          return {
            signature: Mr.get(t, 0),
            compressedSize: Mr.get(t, 8),
            uncompressedSize: Mr.get(t, 12),
          };
        },
        len: 16,
      }),
      (epe = {
        get(t) {
          let e = qr.get(t, 6);
          return {
            signature: Mr.get(t, 0),
            minVersion: qr.get(t, 4),
            dataDescriptor: !!(e & 8),
            compressedMethod: qr.get(t, 8),
            compressedSize: Mr.get(t, 18),
            uncompressedSize: Mr.get(t, 22),
            filenameLength: qr.get(t, 26),
            extraFieldLength: qr.get(t, 28),
            filename: null,
          };
        },
        len: 30,
      }),
      (tpe = {
        get(t) {
          return {
            signature: Mr.get(t, 0),
            nrOfThisDisk: qr.get(t, 4),
            nrOfThisDiskWithTheStart: qr.get(t, 6),
            nrOfEntriesOnThisDisk: qr.get(t, 8),
            nrOfEntriesOfSize: qr.get(t, 10),
            sizeOfCd: Mr.get(t, 12),
            offsetOfStartOfCd: Mr.get(t, 16),
            zipFileCommentLength: qr.get(t, 20),
          };
        },
        len: 22,
      }),
      (rpe = {
        get(t) {
          let e = qr.get(t, 8);
          return {
            signature: Mr.get(t, 0),
            minVersion: qr.get(t, 6),
            dataDescriptor: !!(e & 8),
            compressedMethod: qr.get(t, 10),
            compressedSize: Mr.get(t, 20),
            uncompressedSize: Mr.get(t, 24),
            filenameLength: qr.get(t, 28),
            extraFieldLength: qr.get(t, 30),
            fileCommentLength: qr.get(t, 32),
            relativeOffsetOfLocalHeader: Mr.get(t, 42),
            filename: null,
          };
        },
        len: 46,
      }));
  });
function ipe(t) {
  let e = new Uint8Array(Mr.len);
  return (Mr.put(e, 0, t), e);
}
function Lut(t, e) {
  let r = t.length,
    n = e.length;
  if (n > r) return -1;
  for (let o = 0; o <= r - n; o++) {
    let i = !0;
    for (let s = 0; s < n; s++)
      if (t[o + s] !== e[s]) {
        i = !1;
        break;
      }
    if (i) return o;
  }
  return -1;
}
function But(t) {
  let e = t.reduce((o, i) => o + i.length, 0),
    r = new Uint8Array(e),
    n = 0;
  for (let o of t) (r.set(o, n), (n += o.length));
  return r;
}
var ope,
  Ea,
  WG,
  Nut,
  UI,
  $p,
  spe = g(() => {
    _w();
    ope = F(qG(), 1);
    npe();
    ((Ea = (0, ope.default)("tokenizer:inflate")),
      (WG = 256 * 1024),
      (Nut = ipe(Fp.DataDescriptor)),
      (UI = ipe(Fp.EndOfCentralDirectory)),
      ($p = class t {
        constructor(e) {
          ((this.tokenizer = e), (this.syncBuffer = new Uint8Array(WG)));
        }
        async isZip() {
          return (await this.peekSignature()) === Fp.LocalFileHeader;
        }
        peekSignature() {
          return this.tokenizer.peekToken(Mr);
        }
        async findEndOfCentralDirectoryLocator() {
          let e = this.tokenizer,
            r = Math.min(16 * 1024, e.fileInfo.size),
            n = this.syncBuffer.subarray(0, r);
          await this.tokenizer.readBuffer(n, { position: e.fileInfo.size - r });
          for (let o = n.length - 4; o >= 0; o--)
            if (n[o] === UI[0] && n[o + 1] === UI[1] && n[o + 2] === UI[2] && n[o + 3] === UI[3])
              return e.fileInfo.size - r + o;
          return -1;
        }
        async readCentralDirectory() {
          if (!this.tokenizer.supportsRandomAccess()) {
            Ea("Cannot reading central-directory without random-read support");
            return;
          }
          Ea("Reading central-directory...");
          let e = this.tokenizer.position,
            r = await this.findEndOfCentralDirectoryLocator();
          if (r > 0) {
            Ea("Central-directory 32-bit signature found");
            let n = await this.tokenizer.readToken(tpe, r),
              o = [];
            this.tokenizer.setPosition(n.offsetOfStartOfCd);
            for (let i = 0; i < n.nrOfEntriesOfSize; ++i) {
              let s = await this.tokenizer.readToken(rpe);
              if (s.signature !== Fp.CentralFileHeader)
                throw new Error("Expected Central-File-Header signature");
              ((s.filename = await this.tokenizer.readToken(new ri(s.filenameLength, "utf-8"))),
                await this.tokenizer.ignore(s.extraFieldLength),
                await this.tokenizer.ignore(s.fileCommentLength),
                o.push(s),
                Ea(
                  `Add central-directory file-entry: n=${i + 1}/${o.length}: filename=${o[i].filename}`,
                ));
            }
            return (this.tokenizer.setPosition(e), o);
          }
          this.tokenizer.setPosition(e);
        }
        async unzip(e) {
          let r = await this.readCentralDirectory();
          if (r) return this.iterateOverCentralDirectory(r, e);
          let n = !1;
          do {
            let o = await this.readLocalFileHeader();
            if (!o) break;
            let i = e(o);
            n = !!i.stop;
            let s;
            if (
              (await this.tokenizer.ignore(o.extraFieldLength),
              o.dataDescriptor && o.compressedSize === 0)
            ) {
              let a = [],
                l = WG;
              Ea("Compressed-file-size unknown, scanning for next data-descriptor-signature....");
              let c = -1;
              for (; c < 0 && l === WG; ) {
                ((l = await this.tokenizer.peekBuffer(this.syncBuffer, { mayBeLess: !0 })),
                  (c = Lut(this.syncBuffer.subarray(0, l), Nut)));
                let u = c >= 0 ? c : l;
                if (i.handler) {
                  let p = new Uint8Array(u);
                  (await this.tokenizer.readBuffer(p), a.push(p));
                } else await this.tokenizer.ignore(u);
              }
              (Ea(`Found data-descriptor-signature at pos=${this.tokenizer.position}`),
                i.handler && (await this.inflate(o, But(a), i.handler)));
            } else
              i.handler
                ? (Ea(`Reading compressed-file-data: ${o.compressedSize} bytes`),
                  (s = new Uint8Array(o.compressedSize)),
                  await this.tokenizer.readBuffer(s),
                  await this.inflate(o, s, i.handler))
                : (Ea(`Ignoring compressed-file-data: ${o.compressedSize} bytes`),
                  await this.tokenizer.ignore(o.compressedSize));
            if (
              (Ea(`Reading data-descriptor at pos=${this.tokenizer.position}`),
              o.dataDescriptor && (await this.tokenizer.readToken(GG)).signature !== 134695760)
            )
              throw new Error(
                `Expected data-descriptor-signature at position ${this.tokenizer.position - GG.len}`,
              );
          } while (!n);
        }
        async iterateOverCentralDirectory(e, r) {
          for (let n of e) {
            let o = r(n);
            if (o.handler) {
              this.tokenizer.setPosition(n.relativeOffsetOfLocalHeader);
              let i = await this.readLocalFileHeader();
              if (i) {
                await this.tokenizer.ignore(i.extraFieldLength);
                let s = new Uint8Array(n.compressedSize);
                (await this.tokenizer.readBuffer(s), await this.inflate(i, s, o.handler));
              }
            }
            if (o.stop) break;
          }
        }
        async inflate(e, r, n) {
          if (e.compressedMethod === 0) return n(r);
          if (e.compressedMethod !== 8)
            throw new Error(`Unsupported ZIP compression method: ${e.compressedMethod}`);
          Ea(`Decompress filename=${e.filename}, compressed-size=${r.length}`);
          let o = await t.decompressDeflateRaw(r);
          return n(o);
        }
        static async decompressDeflateRaw(e) {
          let r = new ReadableStream({
              start(i) {
                (i.enqueue(e), i.close());
              },
            }),
            n = new DecompressionStream("deflate-raw"),
            o = r.pipeThrough(n);
          try {
            let s = await new Response(o).arrayBuffer();
            return new Uint8Array(s);
          } catch (i) {
            let s =
              i instanceof Error
                ? `Failed to deflate ZIP entry: ${i.message}`
                : "Unknown decompression error in ZIP entry";
            throw new TypeError(s);
          }
        }
        async readLocalFileHeader() {
          let e = await this.tokenizer.peekToken(Mr);
          if (e === Fp.LocalFileHeader) {
            let r = await this.tokenizer.readToken(epe);
            return (
              (r.filename = await this.tokenizer.readToken(new ri(r.filenameLength, "utf-8"))),
              r
            );
          }
          if (e === Fp.CentralFileHeader) return !1;
          throw e === 3759263696 ? new Error("Encrypted ZIP") : new Error("Unexpected signature");
        }
      }));
  });
var Ew,
  ape = g(() => {
    Ew = class {
      constructor(e) {
        this.tokenizer = e;
      }
      inflate() {
        let e = this.tokenizer;
        return new ReadableStream({
          async pull(r) {
            let n = new Uint8Array(1024),
              o = await e.readBuffer(n, { mayBeLess: !0 });
            if (o === 0) {
              r.close();
              return;
            }
            r.enqueue(n.subarray(0, o));
          },
        }).pipeThrough(new DecompressionStream("gzip"));
      }
    };
  });
var lpe = g(() => {
  spe();
  ape();
});
function HG(t) {
  let { byteLength: e } = t;
  if (e === 6) return t.getUint16(0) * 2 ** 32 + t.getUint32(2);
  if (e === 5) return t.getUint8(0) * 2 ** 32 + t.getUint32(1);
  if (e === 4) return t.getUint32(0);
  if (e === 3) return t.getUint8(0) * 2 ** 16 + t.getUint16(1);
  if (e === 2) return t.getUint16(0);
  if (e === 1) return t.getUint8(0);
}
var $ar,
  Uar,
  qar,
  cpe = g(() => {
    (($ar = { utf8: new globalThis.TextDecoder("utf8") }),
      (Uar = new globalThis.TextEncoder()),
      (qar = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"))));
  });
function upe(t, e) {
  if (e === "utf-16le") {
    let r = [];
    for (let n = 0; n < t.length; n++) {
      let o = t.charCodeAt(n);
      r.push(o & 255, (o >> 8) & 255);
    }
    return r;
  }
  if (e === "utf-16be") {
    let r = [];
    for (let n = 0; n < t.length; n++) {
      let o = t.charCodeAt(n);
      r.push((o >> 8) & 255, o & 255);
    }
    return r;
  }
  return [...t].map((r) => r.charCodeAt(0));
}
function dpe(t, e = 0) {
  let r = Number.parseInt(new ri(6).get(t, 148).replace(/\0.*$/, "").trim(), 8);
  if (Number.isNaN(r)) return !1;
  let n = 8 * 32;
  for (let o = e; o < e + 148; o++) n += t[o];
  for (let o = e + 156; o < e + 512; o++) n += t[o];
  return r === n;
}
var ppe,
  mpe = g(() => {
    _w();
    ppe = {
      get: (t, e) => (t[e + 3] & 127) | (t[e + 2] << 7) | (t[e + 1] << 14) | (t[e] << 21),
      len: 4,
    };
  });
var fpe,
  hpe,
  gpe = g(() => {
    ((fpe = [
      "jpg",
      "png",
      "apng",
      "gif",
      "webp",
      "flif",
      "xcf",
      "cr2",
      "cr3",
      "orf",
      "arw",
      "dng",
      "nef",
      "rw2",
      "raf",
      "tif",
      "bmp",
      "icns",
      "jxr",
      "psd",
      "indd",
      "zip",
      "tar",
      "rar",
      "gz",
      "bz2",
      "7z",
      "dmg",
      "mp4",
      "mid",
      "mkv",
      "webm",
      "mov",
      "avi",
      "mpg",
      "mp2",
      "mp3",
      "m4a",
      "oga",
      "ogg",
      "ogv",
      "opus",
      "flac",
      "wav",
      "spx",
      "amr",
      "pdf",
      "epub",
      "elf",
      "macho",
      "exe",
      "swf",
      "rtf",
      "wasm",
      "woff",
      "woff2",
      "eot",
      "ttf",
      "otf",
      "ttc",
      "ico",
      "flv",
      "ps",
      "xz",
      "sqlite",
      "nes",
      "crx",
      "xpi",
      "cab",
      "deb",
      "ar",
      "rpm",
      "Z",
      "lz",
      "cfb",
      "mxf",
      "mts",
      "blend",
      "bpg",
      "docx",
      "pptx",
      "xlsx",
      "3gp",
      "3g2",
      "j2c",
      "jp2",
      "jpm",
      "jpx",
      "mj2",
      "aif",
      "qcp",
      "odt",
      "ods",
      "odp",
      "xml",
      "mobi",
      "heic",
      "cur",
      "ktx",
      "ape",
      "wv",
      "dcm",
      "ics",
      "glb",
      "pcap",
      "dsf",
      "lnk",
      "alias",
      "voc",
      "ac3",
      "m4v",
      "m4p",
      "m4b",
      "f4v",
      "f4p",
      "f4b",
      "f4a",
      "mie",
      "asf",
      "ogm",
      "ogx",
      "mpc",
      "arrow",
      "shp",
      "aac",
      "mp1",
      "it",
      "s3m",
      "xm",
      "skp",
      "avif",
      "eps",
      "lzh",
      "pgp",
      "asar",
      "stl",
      "chm",
      "3mf",
      "zst",
      "jxl",
      "vcf",
      "jls",
      "pst",
      "dwg",
      "parquet",
      "class",
      "arj",
      "cpio",
      "ace",
      "avro",
      "icc",
      "fbx",
      "vsdx",
      "vtt",
      "apk",
      "drc",
      "lz4",
      "potx",
      "xltx",
      "dotx",
      "xltm",
      "ott",
      "ots",
      "otp",
      "odg",
      "otg",
      "xlsm",
      "docm",
      "dotm",
      "potm",
      "pptm",
      "jar",
      "jmp",
      "rm",
      "sav",
      "ppsm",
      "ppsx",
      "tar.gz",
      "reg",
      "dat",
    ]),
      (hpe = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/flif",
        "image/x-xcf",
        "image/x-canon-cr2",
        "image/x-canon-cr3",
        "image/tiff",
        "image/bmp",
        "image/vnd.ms-photo",
        "image/vnd.adobe.photoshop",
        "application/x-indesign",
        "application/epub+zip",
        "application/x-xpinstall",
        "application/vnd.ms-powerpoint.slideshow.macroenabled.12",
        "application/vnd.oasis.opendocument.text",
        "application/vnd.oasis.opendocument.spreadsheet",
        "application/vnd.oasis.opendocument.presentation",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
        "application/zip",
        "application/x-tar",
        "application/x-rar-compressed",
        "application/gzip",
        "application/x-bzip2",
        "application/x-7z-compressed",
        "application/x-apple-diskimage",
        "application/vnd.apache.arrow.file",
        "video/mp4",
        "audio/midi",
        "video/matroska",
        "video/webm",
        "video/quicktime",
        "video/vnd.avi",
        "audio/wav",
        "audio/qcelp",
        "audio/x-ms-asf",
        "video/x-ms-asf",
        "application/vnd.ms-asf",
        "video/mpeg",
        "video/3gpp",
        "audio/mpeg",
        "audio/mp4",
        "video/ogg",
        "audio/ogg",
        "audio/ogg; codecs=opus",
        "application/ogg",
        "audio/flac",
        "audio/ape",
        "audio/wavpack",
        "audio/amr",
        "application/pdf",
        "application/x-elf",
        "application/x-mach-binary",
        "application/x-msdownload",
        "application/x-shockwave-flash",
        "application/rtf",
        "application/wasm",
        "font/woff",
        "font/woff2",
        "application/vnd.ms-fontobject",
        "font/ttf",
        "font/otf",
        "font/collection",
        "image/x-icon",
        "video/x-flv",
        "application/postscript",
        "application/eps",
        "application/x-xz",
        "application/x-sqlite3",
        "application/x-nintendo-nes-rom",
        "application/x-google-chrome-extension",
        "application/vnd.ms-cab-compressed",
        "application/x-deb",
        "application/x-unix-archive",
        "application/x-rpm",
        "application/x-compress",
        "application/x-lzip",
        "application/x-cfb",
        "application/x-mie",
        "application/mxf",
        "video/mp2t",
        "application/x-blender",
        "image/bpg",
        "image/j2c",
        "image/jp2",
        "image/jpx",
        "image/jpm",
        "image/mj2",
        "audio/aiff",
        "application/xml",
        "application/x-mobipocket-ebook",
        "image/heif",
        "image/heif-sequence",
        "image/heic",
        "image/heic-sequence",
        "image/icns",
        "image/ktx",
        "application/dicom",
        "audio/x-musepack",
        "text/calendar",
        "text/vcard",
        "text/vtt",
        "model/gltf-binary",
        "application/vnd.tcpdump.pcap",
        "audio/x-dsf",
        "application/x.ms.shortcut",
        "application/x.apple.alias",
        "audio/x-voc",
        "audio/vnd.dolby.dd-raw",
        "audio/x-m4a",
        "image/apng",
        "image/x-olympus-orf",
        "image/x-sony-arw",
        "image/x-adobe-dng",
        "image/x-nikon-nef",
        "image/x-panasonic-rw2",
        "image/x-fujifilm-raf",
        "video/x-m4v",
        "video/3gpp2",
        "application/x-esri-shape",
        "audio/aac",
        "audio/x-it",
        "audio/x-s3m",
        "audio/x-xm",
        "video/MP1S",
        "video/MP2P",
        "application/vnd.sketchup.skp",
        "image/avif",
        "application/x-lzh-compressed",
        "application/pgp-encrypted",
        "application/x-asar",
        "model/stl",
        "application/vnd.ms-htmlhelp",
        "model/3mf",
        "image/jxl",
        "application/zstd",
        "image/jls",
        "application/vnd.ms-outlook",
        "image/vnd.dwg",
        "application/vnd.apache.parquet",
        "application/java-vm",
        "application/x-arj",
        "application/x-cpio",
        "application/x-ace-compressed",
        "application/avro",
        "application/vnd.iccprofile",
        "application/x.autodesk.fbx",
        "application/vnd.visio",
        "application/vnd.android.package-archive",
        "application/vnd.google.draco",
        "application/x-lz4",
        "application/vnd.openxmlformats-officedocument.presentationml.template",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
        "application/vnd.ms-excel.template.macroenabled.12",
        "application/vnd.oasis.opendocument.text-template",
        "application/vnd.oasis.opendocument.spreadsheet-template",
        "application/vnd.oasis.opendocument.presentation-template",
        "application/vnd.oasis.opendocument.graphics",
        "application/vnd.oasis.opendocument.graphics-template",
        "application/vnd.ms-excel.sheet.macroenabled.12",
        "application/vnd.ms-word.document.macroenabled.12",
        "application/vnd.ms-word.template.macroenabled.12",
        "application/vnd.ms-powerpoint.template.macroenabled.12",
        "application/vnd.ms-powerpoint.presentation.macroenabled.12",
        "application/java-archive",
        "application/vnd.rn-realmedia",
        "application/x-spss-sav",
        "application/x-ms-regedit",
        "application/x-ft-windows-registry-hive",
        "application/x-jmp-data",
      ]));
  });
var kpe = {};
Ki(kpe, {
  FileTypeParser: () => fu,
  fileTypeFromBlob: () => cdt,
  fileTypeFromBuffer: () => ldt,
  fileTypeFromStream: () => adt,
  fileTypeFromTokenizer: () => vdt,
  fileTypeStream: () => bdt,
  normalizeSampleSize: () => Ipe,
  reasonableDetectionSizeInBytes: () => Sg,
  supportedExtensions: () => Sdt,
  supportedMimeTypes: () => wdt,
});
function Yut(t) {
  let e = t?.streamReader;
  if (e?.constructor?.name !== "WebStreamByobReader") return t;
  let { reader: r } = e,
    n = async () => {
      (await r.cancel(), r.releaseLock());
    };
  return (
    (e.close = n),
    (e.abort = async () => {
      ((e.interrupted = !0), await n());
    }),
    t
  );
}
function VG(t, e, r) {
  if (!Number.isFinite(t) || t < 0 || t > e)
    throw new zl(`${r} has invalid size ${t} (maximum ${e} bytes)`);
  return t;
}
async function mu(t, e, { maximumLength: r = ts, reason: n = "skip" } = {}) {
  let o = VG(e, r, n);
  await t.ignore(o);
}
async function zG(t, e, r, { maximumLength: n = e.length, reason: o = "read" } = {}) {
  let i = r?.length ?? e.length,
    s = VG(i, n, o);
  return t.readBuffer(e, { ...r, length: s });
}
async function Jut(t, { maximumLength: e = Ta } = {}) {
  let o = new ReadableStream({
      start(c) {
        (c.enqueue(t), c.close());
      },
    })
      .pipeThrough(new DecompressionStream("deflate-raw"))
      .getReader(),
    i = [],
    s = 0;
  try {
    for (;;) {
      let { done: c, value: u } = await o.read();
      if (c) break;
      if (((s += u.length), s > e))
        throw (await o.cancel(), new Error(`ZIP entry decompressed data exceeds ${e} bytes`));
      i.push(u);
    }
  } finally {
    o.releaseLock();
  }
  let a = new Uint8Array(s),
    l = 0;
  for (let c of i) (a.set(c, l), (l += c.length));
  return a;
}
function edt(t, e) {
  if (t.length < qI) return -1;
  let r = t.length - qI;
  for (let n = 0; n <= r; n++) if (Mr.get(t, n) === Ppe && Mr.get(t, n + 8) === e + n) return n;
  return -1;
}
function tdt(t) {
  return (t.codePointAt(0) & 32) !== 0;
}
function rdt(t, e) {
  let r = new Uint8Array(e),
    n = 0;
  for (let o of t) (r.set(o, n), (n += o.length));
  return r;
}
async function ndt(t, { shouldBuffer: e, maximumLength: r = Ta } = {}) {
  let { syncBuffer: n } = t,
    { length: o } = n,
    i = [],
    s = 0;
  for (;;) {
    let a = await t.tokenizer.peekBuffer(n, { mayBeLess: !0 }),
      l = edt(n.subarray(0, a), s),
      c = l >= 0 ? 0 : a === o ? Math.min(Qut, a - 1) : 0,
      u = l >= 0 ? l : a - c;
    if (u === 0) break;
    if (((s += u), s > r)) throw new Error(`ZIP entry compressed data exceeds ${r} bytes`);
    if (e) {
      let p = new Uint8Array(u);
      (await t.tokenizer.readBuffer(p), i.push(p));
    } else await t.tokenizer.ignore(u);
    if (l >= 0) break;
  }
  if ((Mo(t.tokenizer) || (t.knownSizeDescriptorScannedBytes += s), !!e)) return rdt(i, s);
}
function odt(t, e) {
  return Mo(t.tokenizer)
    ? Math.max(0, ts - (t.tokenizer.position - e))
    : Math.max(0, Ta - t.knownSizeDescriptorScannedBytes);
}
async function idt(t, e, { shouldBuffer: r, maximumDescriptorLength: n = Ta } = {}) {
  if (e.dataDescriptor && e.compressedSize === 0)
    return ndt(t, { shouldBuffer: r, maximumLength: n });
  if (!r) {
    await mu(t.tokenizer, e.compressedSize, {
      maximumLength: Mo(t.tokenizer) ? Ta : t.tokenizer.fileInfo.size,
      reason: "ZIP entry compressed data",
    });
    return;
  }
  let o = mdt(t.tokenizer);
  if (!Number.isFinite(e.compressedSize) || e.compressedSize < 0 || e.compressedSize > o)
    throw new Error(`ZIP entry compressed data exceeds ${o} bytes`);
  let i = new Uint8Array(e.compressedSize);
  return (await t.tokenizer.readBuffer(i), i);
}
function sdt(t, e) {
  let r = t.getReader(),
    n = 0,
    o = !1,
    i = !1,
    s = async (a) => {
      o || i || ((i = !0), await r.cancel(a));
    };
  return new ReadableStream({
    async pull(a) {
      if (n >= e) {
        (a.close(), await s());
        return;
      }
      let { done: l, value: c } = await r.read();
      if (l || !c) {
        ((o = !0), a.close());
        return;
      }
      let u = e - n;
      if (c.length > u) {
        (a.enqueue(c.subarray(0, u)), (n += u), a.close(), await s());
        return;
      }
      (a.enqueue(c), (n += c.length));
    },
    async cancel(a) {
      await s(a);
    },
  });
}
async function adt(t, e) {
  return new fu(e).fromStream(t);
}
async function ldt(t, e) {
  return new fu(e).fromBuffer(t);
}
async function cdt(t, e) {
  return new fu(e).fromBlob(t);
}
function Epe(t) {
  switch (((t = t.toLowerCase()), t)) {
    case "application/epub+zip":
      return { ext: "epub", mime: t };
    case "application/vnd.oasis.opendocument.text":
      return { ext: "odt", mime: t };
    case "application/vnd.oasis.opendocument.text-template":
      return { ext: "ott", mime: t };
    case "application/vnd.oasis.opendocument.spreadsheet":
      return { ext: "ods", mime: t };
    case "application/vnd.oasis.opendocument.spreadsheet-template":
      return { ext: "ots", mime: t };
    case "application/vnd.oasis.opendocument.presentation":
      return { ext: "odp", mime: t };
    case "application/vnd.oasis.opendocument.presentation-template":
      return { ext: "otp", mime: t };
    case "application/vnd.oasis.opendocument.graphics":
      return { ext: "odg", mime: t };
    case "application/vnd.oasis.opendocument.graphics-template":
      return { ext: "otg", mime: t };
    case "application/vnd.openxmlformats-officedocument.presentationml.slideshow":
      return { ext: "ppsx", mime: t };
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return { ext: "xlsx", mime: t };
    case "application/vnd.ms-excel.sheet.macroenabled":
      return { ext: "xlsm", mime: "application/vnd.ms-excel.sheet.macroenabled.12" };
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.template":
      return { ext: "xltx", mime: t };
    case "application/vnd.ms-excel.template.macroenabled":
      return { ext: "xltm", mime: "application/vnd.ms-excel.template.macroenabled.12" };
    case "application/vnd.ms-powerpoint.slideshow.macroenabled":
      return { ext: "ppsm", mime: "application/vnd.ms-powerpoint.slideshow.macroenabled.12" };
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return { ext: "docx", mime: t };
    case "application/vnd.ms-word.document.macroenabled":
      return { ext: "docm", mime: "application/vnd.ms-word.document.macroenabled.12" };
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.template":
      return { ext: "dotx", mime: t };
    case "application/vnd.ms-word.template.macroenabledtemplate":
      return { ext: "dotm", mime: "application/vnd.ms-word.template.macroenabled.12" };
    case "application/vnd.openxmlformats-officedocument.presentationml.template":
      return { ext: "potx", mime: t };
    case "application/vnd.ms-powerpoint.template.macroenabled":
      return { ext: "potm", mime: "application/vnd.ms-powerpoint.template.macroenabled.12" };
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return { ext: "pptx", mime: t };
    case "application/vnd.ms-powerpoint.presentation.macroenabled":
      return { ext: "pptm", mime: "application/vnd.ms-powerpoint.presentation.macroenabled.12" };
    case "application/vnd.ms-visio.drawing":
      return { ext: "vsdx", mime: "application/vnd.visio" };
    case "application/vnd.ms-package.3dmanufacturing-3dmodel+xml":
      return { ext: "3mf", mime: "model/3mf" };
    default:
  }
}
function Ca(t, e, r) {
  r = { offset: 0, ...r };
  for (let [n, o] of e.entries())
    if (r.mask) {
      if (o !== (r.mask[n] & t[n + r.offset])) return !1;
    } else if (o !== t[n + r.offset]) return !1;
  return !0;
}
function Ipe(t) {
  return Number.isFinite(t) ? Math.max(1, Math.trunc(t)) : Sg;
}
function udt(t, e, r) {
  return r === void 0
    ? t.read(e)
    : (r.throwIfAborted(),
      new Promise((n, o) => {
        let i = () => {
            r.removeEventListener("abort", s);
          },
          s = () => {
            let a = r.reason;
            (i(),
              (async () => {
                try {
                  await t.cancel(a);
                } catch {}
              })(),
              o(a));
          };
        (r.addEventListener("abort", s, { once: !0 }),
          (async () => {
            try {
              let a = await t.read(e);
              (i(), n(a));
            } catch (a) {
              (i(), o(a));
            }
          })());
      }));
}
