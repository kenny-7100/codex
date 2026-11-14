var A6 = A((mLr, s0e) => {
  "use strict";
  var { Writable: $It } = require("stream"),
    e0e = Ry(),
    { BINARY_TYPES: UIt, EMPTY_BUFFER: t0e, kStatusCode: qIt, kWebSocket: GIt } = uc(),
    { concat: S6, toArrayBuffer: WIt, unmask: HIt } = _x(),
    { isValidStatusCode: jIt, isValidUTF8: r0e } = Ey(),
    oM = Buffer[Symbol.species],
    ls = 0,
    n0e = 1,
    o0e = 2,
    i0e = 3,
    w6 = 4,
    _6 = 5,
    iM = 6,
    x6 = class extends $It {
      constructor(e = {}) {
        (super(),
          (this._allowSynchronousEvents =
            e.allowSynchronousEvents !== void 0 ? e.allowSynchronousEvents : !0),
          (this._binaryType = e.binaryType || UIt[0]),
          (this._extensions = e.extensions || {}),
          (this._isServer = !!e.isServer),
          (this._maxBufferedChunks = e.maxBufferedChunks | 0),
          (this._maxFragments = e.maxFragments | 0),
          (this._maxPayload = e.maxPayload | 0),
          (this._skipUTF8Validation = !!e.skipUTF8Validation),
          (this[GIt] = void 0),
          (this._bufferedBytes = 0),
          (this._buffers = []),
          (this._compressed = !1),
          (this._payloadLength = 0),
          (this._mask = void 0),
          (this._fragmented = 0),
          (this._masked = !1),
          (this._fin = !1),
          (this._opcode = 0),
          (this._totalPayloadLength = 0),
          (this._messageLength = 0),
          (this._numFragments = 0),
          (this._fragments = []),
          (this._errored = !1),
          (this._loop = !1),
          (this._state = ls));
      }
      _write(e, r, n) {
        if (this._opcode === 8 && this._state == ls) return n();
        if (this._maxBufferedChunks > 0 && this._buffers.length >= this._maxBufferedChunks) {
          n(
            this.createError(
              RangeError,
              "Too many buffered chunks",
              !1,
              1008,
              "WS_ERR_TOO_MANY_BUFFERED_PARTS",
            ),
          );
          return;
        }
        ((this._bufferedBytes += e.length), this._buffers.push(e), this.startLoop(n));
      }
      consume(e) {
        if (((this._bufferedBytes -= e), e === this._buffers[0].length))
          return this._buffers.shift();
        if (e < this._buffers[0].length) {
          let n = this._buffers[0];
          return (
            (this._buffers[0] = new oM(n.buffer, n.byteOffset + e, n.length - e)),
            new oM(n.buffer, n.byteOffset, e)
          );
        }
        let r = Buffer.allocUnsafe(e);
        do {
          let n = this._buffers[0],
            o = r.length - e;
          (e >= n.length
            ? r.set(this._buffers.shift(), o)
            : (r.set(new Uint8Array(n.buffer, n.byteOffset, e), o),
              (this._buffers[0] = new oM(n.buffer, n.byteOffset + e, n.length - e))),
            (e -= n.length));
        } while (e > 0);
        return r;
      }
      startLoop(e) {
        this._loop = !0;
        do
          switch (this._state) {
            case ls:
              this.getInfo(e);
              break;
            case n0e:
              this.getPayloadLength16(e);
              break;
            case o0e:
              this.getPayloadLength64(e);
              break;
            case i0e:
              this.getMask();
              break;
            case w6:
              this.getData(e);
              break;
            case _6:
            case iM:
              this._loop = !1;
              return;
          }
        while (this._loop);
        this._errored || e();
      }
      getInfo(e) {
        if (this._bufferedBytes < 2) {
          this._loop = !1;
          return;
        }
        let r = this.consume(2);
        if (r[0] & 48) {
          let o = this.createError(
            RangeError,
            "RSV2 and RSV3 must be clear",
            !0,
            1002,
            "WS_ERR_UNEXPECTED_RSV_2_3",
          );
          e(o);
          return;
        }
        let n = (r[0] & 64) === 64;
        if (n && !this._extensions[e0e.extensionName]) {
          let o = this.createError(
            RangeError,
            "RSV1 must be clear",
            !0,
            1002,
            "WS_ERR_UNEXPECTED_RSV_1",
          );
          e(o);
          return;
        }
        if (
          ((this._fin = (r[0] & 128) === 128),
          (this._opcode = r[0] & 15),
          (this._payloadLength = r[1] & 127),
          this._opcode === 0)
        ) {
          if (n) {
            let o = this.createError(
              RangeError,
              "RSV1 must be clear",
              !0,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1",
            );
            e(o);
            return;
          }
          if (!this._fragmented) {
            let o = this.createError(
              RangeError,
              "invalid opcode 0",
              !0,
              1002,
              "WS_ERR_INVALID_OPCODE",
            );
            e(o);
            return;
          }
          this._opcode = this._fragmented;
        } else if (this._opcode === 1 || this._opcode === 2) {
          if (this._fragmented) {
            let o = this.createError(
              RangeError,
              `invalid opcode ${this._opcode}`,
              !0,
              1002,
              "WS_ERR_INVALID_OPCODE",
            );
            e(o);
            return;
          }
          this._compressed = n;
        } else if (this._opcode > 7 && this._opcode < 11) {
          if (!this._fin) {
            let o = this.createError(
              RangeError,
              "FIN must be set",
              !0,
              1002,
              "WS_ERR_EXPECTED_FIN",
            );
            e(o);
            return;
          }
          if (n) {
            let o = this.createError(
              RangeError,
              "RSV1 must be clear",
              !0,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1",
            );
            e(o);
            return;
          }
          if (this._payloadLength > 125 || (this._opcode === 8 && this._payloadLength === 1)) {
            let o = this.createError(
              RangeError,
              `invalid payload length ${this._payloadLength}`,
              !0,
              1002,
              "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH",
            );
            e(o);
            return;
          }
        } else {
          let o = this.createError(
            RangeError,
            `invalid opcode ${this._opcode}`,
            !0,
            1002,
            "WS_ERR_INVALID_OPCODE",
          );
          e(o);
          return;
        }
        if (
          (!this._fin && !this._fragmented && (this._fragmented = this._opcode),
          (this._masked = (r[1] & 128) === 128),
          this._isServer)
        ) {
          if (!this._masked) {
            let o = this.createError(
              RangeError,
              "MASK must be set",
              !0,
              1002,
              "WS_ERR_EXPECTED_MASK",
            );
            e(o);
            return;
          }
        } else if (this._masked) {
          let o = this.createError(
            RangeError,
            "MASK must be clear",
            !0,
            1002,
            "WS_ERR_UNEXPECTED_MASK",
          );
          e(o);
          return;
        }
        this._payloadLength === 126
          ? (this._state = n0e)
          : this._payloadLength === 127
            ? (this._state = o0e)
            : this.haveLength(e);
      }
      getPayloadLength16(e) {
        if (this._bufferedBytes < 2) {
          this._loop = !1;
          return;
        }
        ((this._payloadLength = this.consume(2).readUInt16BE(0)), this.haveLength(e));
      }
      getPayloadLength64(e) {
        if (this._bufferedBytes < 8) {
          this._loop = !1;
          return;
        }
        let r = this.consume(8),
          n = r.readUInt32BE(0);
        if (n > Math.pow(2, 21) - 1) {
          let o = this.createError(
            RangeError,
            "Unsupported WebSocket frame: payload length > 2^53 - 1",
            !1,
            1009,
            "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH",
          );
          e(o);
          return;
        }
        ((this._payloadLength = n * Math.pow(2, 32) + r.readUInt32BE(4)), this.haveLength(e));
      }
      haveLength(e) {
        if (
          this._payloadLength &&
          this._opcode < 8 &&
          ((this._totalPayloadLength += this._payloadLength),
          this._totalPayloadLength > this._maxPayload && this._maxPayload > 0)
        ) {
          let r = this.createError(
            RangeError,
            "Max payload size exceeded",
            !1,
            1009,
            "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH",
          );
          e(r);
          return;
        }
        this._masked ? (this._state = i0e) : (this._state = w6);
      }
      getMask() {
        if (this._bufferedBytes < 4) {
          this._loop = !1;
          return;
        }
        ((this._mask = this.consume(4)), (this._state = w6));
      }
      getData(e) {
        let r = t0e;
        if (this._payloadLength) {
          if (this._bufferedBytes < this._payloadLength) {
            this._loop = !1;
            return;
          }
          ((r = this.consume(this._payloadLength)),
            this._masked &&
              this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3] &&
              HIt(r, this._mask));
        }
        if (this._opcode > 7) {
          this.controlMessage(r, e);
          return;
        }
        if (this._maxFragments > 0 && ++this._numFragments > this._maxFragments) {
          let n = this.createError(
            RangeError,
            "Too many message fragments",
            !1,
            1008,
            "WS_ERR_TOO_MANY_BUFFERED_PARTS",
          );
          e(n);
          return;
        }
        if (this._compressed) {
          ((this._state = _6), this.decompress(r, e));
          return;
        }
        (r.length && ((this._messageLength = this._totalPayloadLength), this._fragments.push(r)),
          this.dataMessage(e));
      }
      decompress(e, r) {
        this._extensions[e0e.extensionName].decompress(e, this._fin, (o, i) => {
          if (o) return r(o);
          if (i.length) {
            if (
              ((this._messageLength += i.length),
              this._messageLength > this._maxPayload && this._maxPayload > 0)
            ) {
              let s = this.createError(
                RangeError,
                "Max payload size exceeded",
                !1,
                1009,
                "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH",
              );
              r(s);
              return;
            }
            this._fragments.push(i);
          }
          (this.dataMessage(r), this._state === ls && this.startLoop(r));
        });
      }
      dataMessage(e) {
        if (!this._fin) {
          this._state = ls;
          return;
        }
        let r = this._messageLength,
          n = this._fragments;
        if (
          ((this._totalPayloadLength = 0),
          (this._messageLength = 0),
          (this._fragmented = 0),
          (this._numFragments = 0),
          (this._fragments = []),
          this._opcode === 2)
        ) {
          let o;
          (this._binaryType === "nodebuffer"
            ? (o = S6(n, r))
            : this._binaryType === "arraybuffer"
              ? (o = WIt(S6(n, r)))
              : this._binaryType === "blob"
                ? (o = new Blob(n))
                : (o = n),
            this._allowSynchronousEvents
              ? (this.emit("message", o, !0), (this._state = ls))
              : ((this._state = iM),
                setImmediate(() => {
                  (this.emit("message", o, !0), (this._state = ls), this.startLoop(e));
                })));
        } else {
          let o = S6(n, r);
          if (!this._skipUTF8Validation && !r0e(o)) {
            let i = this.createError(
              Error,
              "invalid UTF-8 sequence",
              !0,
              1007,
              "WS_ERR_INVALID_UTF8",
            );
            e(i);
            return;
          }
          this._state === _6 || this._allowSynchronousEvents
            ? (this.emit("message", o, !1), (this._state = ls))
            : ((this._state = iM),
              setImmediate(() => {
                (this.emit("message", o, !1), (this._state = ls), this.startLoop(e));
              }));
        }
      }
      controlMessage(e, r) {
        if (this._opcode === 8) {
          if (e.length === 0) ((this._loop = !1), this.emit("conclude", 1005, t0e), this.end());
          else {
            let n = e.readUInt16BE(0);
            if (!jIt(n)) {
              let i = this.createError(
                RangeError,
                `invalid status code ${n}`,
                !0,
                1002,
                "WS_ERR_INVALID_CLOSE_CODE",
              );
              r(i);
              return;
            }
            let o = new oM(e.buffer, e.byteOffset + 2, e.length - 2);
            if (!this._skipUTF8Validation && !r0e(o)) {
              let i = this.createError(
                Error,
                "invalid UTF-8 sequence",
                !0,
                1007,
                "WS_ERR_INVALID_UTF8",
              );
              r(i);
              return;
            }
            ((this._loop = !1), this.emit("conclude", n, o), this.end());
          }
          this._state = ls;
          return;
        }
        this._allowSynchronousEvents
          ? (this.emit(this._opcode === 9 ? "ping" : "pong", e), (this._state = ls))
          : ((this._state = iM),
            setImmediate(() => {
              (this.emit(this._opcode === 9 ? "ping" : "pong", e),
                (this._state = ls),
                this.startLoop(r));
            }));
      }
      createError(e, r, n, o, i) {
        ((this._loop = !1), (this._errored = !0));
        let s = new e(n ? `Invalid WebSocket frame: ${r}` : r);
        return (Error.captureStackTrace(s, this.createError), (s.code = i), (s[qIt] = o), s);
      }
    };
  s0e.exports = x6;
});
var C6 = A((hLr, c0e) => {
  "use strict";
  var { Duplex: fLr } = require("stream"),
    { randomFillSync: zIt } = require("crypto"),
    {
      types: { isUint8Array: VIt },
    } = require("util"),
    a0e = Ry(),
    { EMPTY_BUFFER: KIt, kWebSocket: ZIt, NOOP: XIt } = uc(),
    { isBlob: Cy, isValidStatusCode: YIt } = Ey(),
    { mask: l0e, toBuffer: km } = _x(),
    cs = Symbol("kByteLength"),
    JIt = Buffer.alloc(4),
    sM = 8 * 1024,
    Dm,
    Ty = sM,
    zs = 0,
    QIt = 1,
    ekt = 2,
    R6 = class t {
      constructor(e, r, n) {
        ((this._extensions = r || {}),
          n && ((this._generateMask = n), (this._maskBuffer = Buffer.alloc(4))),
          (this._socket = e),
          (this._firstFragment = !0),
          (this._compress = !1),
          (this._bufferedBytes = 0),
          (this._queue = []),
          (this._state = zs),
          (this.onerror = XIt),
          (this[ZIt] = void 0));
      }
      static frame(e, r) {
        let n,
          o = !1,
          i = 2,
          s = !1;
        r.mask &&
          ((n = r.maskBuffer || JIt),
          r.generateMask
            ? r.generateMask(n)
            : (Ty === sM && (Dm === void 0 && (Dm = Buffer.alloc(sM)), zIt(Dm, 0, sM), (Ty = 0)),
              (n[0] = Dm[Ty++]),
              (n[1] = Dm[Ty++]),
              (n[2] = Dm[Ty++]),
              (n[3] = Dm[Ty++])),
          (s = (n[0] | n[1] | n[2] | n[3]) === 0),
          (i = 6));
        let a;
        typeof e == "string"
          ? (!r.mask || s) && r[cs] !== void 0
            ? (a = r[cs])
            : ((e = Buffer.from(e)), (a = e.length))
          : ((a = e.length), (o = r.mask && r.readOnly && !s));
        let l = a;
        a >= 65536 ? ((i += 8), (l = 127)) : a > 125 && ((i += 2), (l = 126));
        let c = Buffer.allocUnsafe(o ? a + i : i);
        return (
          (c[0] = r.fin ? r.opcode | 128 : r.opcode),
          r.rsv1 && (c[0] |= 64),
          (c[1] = l),
          l === 126
            ? c.writeUInt16BE(a, 2)
            : l === 127 && ((c[2] = c[3] = 0), c.writeUIntBE(a, 4, 6)),
          r.mask
            ? ((c[1] |= 128),
              (c[i - 4] = n[0]),
              (c[i - 3] = n[1]),
              (c[i - 2] = n[2]),
              (c[i - 1] = n[3]),
              s ? [c, e] : o ? (l0e(e, n, c, i, a), [c]) : (l0e(e, n, e, 0, a), [c, e]))
            : [c, e]
        );
      }
      close(e, r, n, o) {
        let i;
        if (e === void 0) i = KIt;
        else {
          if (typeof e != "number" || !YIt(e))
            throw new TypeError("First argument must be a valid error code number");
          if (r === void 0 || !r.length) ((i = Buffer.allocUnsafe(2)), i.writeUInt16BE(e, 0));
          else {
            let a = Buffer.byteLength(r);
            if (a > 123) throw new RangeError("The message must not be greater than 123 bytes");
            if (((i = Buffer.allocUnsafe(2 + a)), i.writeUInt16BE(e, 0), typeof r == "string"))
              i.write(r, 2);
            else if (VIt(r)) i.set(r, 2);
            else throw new TypeError("Second argument must be a string or a Uint8Array");
          }
        }
        let s = {
          [cs]: i.length,
          fin: !0,
          generateMask: this._generateMask,
          mask: n,
          maskBuffer: this._maskBuffer,
          opcode: 8,
          readOnly: !1,
          rsv1: !1,
        };
        this._state !== zs
          ? this.enqueue([this.dispatch, i, !1, s, o])
          : this.sendFrame(t.frame(i, s), o);
      }
      ping(e, r, n) {
        let o, i;
        if (
          (typeof e == "string"
            ? ((o = Buffer.byteLength(e)), (i = !1))
            : Cy(e)
              ? ((o = e.size), (i = !1))
              : ((e = km(e)), (o = e.length), (i = km.readOnly)),
          o > 125)
        )
          throw new RangeError("The data size must not be greater than 125 bytes");
        let s = {
          [cs]: o,
          fin: !0,
          generateMask: this._generateMask,
          mask: r,
          maskBuffer: this._maskBuffer,
          opcode: 9,
          readOnly: i,
          rsv1: !1,
        };
        Cy(e)
          ? this._state !== zs
            ? this.enqueue([this.getBlobData, e, !1, s, n])
            : this.getBlobData(e, !1, s, n)
          : this._state !== zs
            ? this.enqueue([this.dispatch, e, !1, s, n])
            : this.sendFrame(t.frame(e, s), n);
      }
      pong(e, r, n) {
        let o, i;
        if (
          (typeof e == "string"
            ? ((o = Buffer.byteLength(e)), (i = !1))
            : Cy(e)
              ? ((o = e.size), (i = !1))
              : ((e = km(e)), (o = e.length), (i = km.readOnly)),
          o > 125)
        )
          throw new RangeError("The data size must not be greater than 125 bytes");
        let s = {
          [cs]: o,
          fin: !0,
          generateMask: this._generateMask,
          mask: r,
          maskBuffer: this._maskBuffer,
          opcode: 10,
          readOnly: i,
          rsv1: !1,
        };
        Cy(e)
          ? this._state !== zs
            ? this.enqueue([this.getBlobData, e, !1, s, n])
            : this.getBlobData(e, !1, s, n)
          : this._state !== zs
            ? this.enqueue([this.dispatch, e, !1, s, n])
            : this.sendFrame(t.frame(e, s), n);
      }
      send(e, r, n) {
        let o = this._extensions[a0e.extensionName],
          i = r.binary ? 2 : 1,
          s = r.compress,
          a,
          l;
        (typeof e == "string"
          ? ((a = Buffer.byteLength(e)), (l = !1))
          : Cy(e)
            ? ((a = e.size), (l = !1))
            : ((e = km(e)), (a = e.length), (l = km.readOnly)),
          this._firstFragment
            ? ((this._firstFragment = !1),
              s &&
                o &&
                o.params[
                  o._isServer ? "server_no_context_takeover" : "client_no_context_takeover"
                ] &&
                (s = a >= o._threshold),
              (this._compress = s))
            : ((s = !1), (i = 0)),
          r.fin && (this._firstFragment = !0));
        let c = {
          [cs]: a,
          fin: r.fin,
          generateMask: this._generateMask,
          mask: r.mask,
          maskBuffer: this._maskBuffer,
          opcode: i,
          readOnly: l,
          rsv1: s,
        };
        Cy(e)
          ? this._state !== zs
            ? this.enqueue([this.getBlobData, e, this._compress, c, n])
            : this.getBlobData(e, this._compress, c, n)
          : this._state !== zs
            ? this.enqueue([this.dispatch, e, this._compress, c, n])
            : this.dispatch(e, this._compress, c, n);
      }
      getBlobData(e, r, n, o) {
        ((this._bufferedBytes += n[cs]),
          (this._state = ekt),
          e
            .arrayBuffer()
            .then((i) => {
              if (this._socket.destroyed) {
                let a = new Error("The socket was closed while the blob was being read");
                process.nextTick(E6, this, a, o);
                return;
              }
              this._bufferedBytes -= n[cs];
              let s = km(i);
              r
                ? this.dispatch(s, r, n, o)
                : ((this._state = zs), this.sendFrame(t.frame(s, n), o), this.dequeue());
            })
            .catch((i) => {
              process.nextTick(tkt, this, i, o);
            }));
      }
      dispatch(e, r, n, o) {
        if (!r) {
          this.sendFrame(t.frame(e, n), o);
          return;
        }
        let i = this._extensions[a0e.extensionName];
        ((this._bufferedBytes += n[cs]),
          (this._state = QIt),
          i.compress(e, n.fin, (s, a) => {
            if (this._socket.destroyed) {
              let l = new Error("The socket was closed while data was being compressed");
              E6(this, l, o);
              return;
            }
            ((this._bufferedBytes -= n[cs]),
              (this._state = zs),
              (n.readOnly = !1),
              this.sendFrame(t.frame(a, n), o),
              this.dequeue());
          }));
      }
      dequeue() {
        for (; this._state === zs && this._queue.length; ) {
          let e = this._queue.shift();
          ((this._bufferedBytes -= e[3][cs]), Reflect.apply(e[0], this, e.slice(1)));
        }
      }
      enqueue(e) {
        ((this._bufferedBytes += e[3][cs]), this._queue.push(e));
      }
      sendFrame(e, r) {
        e.length === 2
          ? (this._socket.cork(),
            this._socket.write(e[0]),
            this._socket.write(e[1], r),
            this._socket.uncork())
          : this._socket.write(e[0], r);
      }
    };
  c0e.exports = R6;
  function E6(t, e, r) {
    typeof r == "function" && r(e);
    for (let n = 0; n < t._queue.length; n++) {
      let o = t._queue[n],
        i = o[o.length - 1];
      typeof i == "function" && i(e);
    }
  }
  function tkt(t, e, r) {
    (E6(t, e, r), t.onerror(e));
  }
});
var v0e = A((gLr, y0e) => {
  "use strict";
  var { kForOnEventAttribute: Ax, kListener: T6 } = uc(),
    u0e = Symbol("kCode"),
    d0e = Symbol("kData"),
    p0e = Symbol("kError"),
    m0e = Symbol("kMessage"),
    f0e = Symbol("kReason"),
    Py = Symbol("kTarget"),
    h0e = Symbol("kType"),
    g0e = Symbol("kWasClean"),
    mc = class {
      constructor(e) {
        ((this[Py] = null), (this[h0e] = e));
      }
      get target() {
        return this[Py];
      }
      get type() {
        return this[h0e];
      }
    };
  Object.defineProperty(mc.prototype, "target", { enumerable: !0 });
  Object.defineProperty(mc.prototype, "type", { enumerable: !0 });
  var Mm = class extends mc {
    constructor(e, r = {}) {
      (super(e),
        (this[u0e] = r.code === void 0 ? 0 : r.code),
        (this[f0e] = r.reason === void 0 ? "" : r.reason),
        (this[g0e] = r.wasClean === void 0 ? !1 : r.wasClean));
    }
    get code() {
      return this[u0e];
    }
    get reason() {
      return this[f0e];
    }
    get wasClean() {
      return this[g0e];
    }
  };
  Object.defineProperty(Mm.prototype, "code", { enumerable: !0 });
  Object.defineProperty(Mm.prototype, "reason", { enumerable: !0 });
  Object.defineProperty(Mm.prototype, "wasClean", { enumerable: !0 });
  var Iy = class extends mc {
    constructor(e, r = {}) {
      (super(e),
        (this[p0e] = r.error === void 0 ? null : r.error),
        (this[m0e] = r.message === void 0 ? "" : r.message));
    }
    get error() {
      return this[p0e];
    }
    get message() {
      return this[m0e];
    }
  };
  Object.defineProperty(Iy.prototype, "error", { enumerable: !0 });
  Object.defineProperty(Iy.prototype, "message", { enumerable: !0 });
  var Rx = class extends mc {
    constructor(e, r = {}) {
      (super(e), (this[d0e] = r.data === void 0 ? null : r.data));
    }
    get data() {
      return this[d0e];
    }
  };
  Object.defineProperty(Rx.prototype, "data", { enumerable: !0 });
  var rkt = {
    addEventListener(t, e, r = {}) {
      for (let o of this.listeners(t)) if (!r[Ax] && o[T6] === e && !o[Ax]) return;
      let n;
      if (t === "message")
        n = function (i, s) {
          let a = new Rx("message", { data: s ? i : i.toString() });
          ((a[Py] = this), aM(e, this, a));
        };
      else if (t === "close")
        n = function (i, s) {
          let a = new Mm("close", {
            code: i,
            reason: s.toString(),
            wasClean: this._closeFrameReceived && this._closeFrameSent,
          });
          ((a[Py] = this), aM(e, this, a));
        };
      else if (t === "error")
        n = function (i) {
          let s = new Iy("error", { error: i, message: i.message });
          ((s[Py] = this), aM(e, this, s));
        };
      else if (t === "open")
        n = function () {
          let i = new mc("open");
          ((i[Py] = this), aM(e, this, i));
        };
      else return;
      ((n[Ax] = !!r[Ax]), (n[T6] = e), r.once ? this.once(t, n) : this.on(t, n));
    },
    removeEventListener(t, e) {
      for (let r of this.listeners(t))
        if (r[T6] === e && !r[Ax]) {
          this.removeListener(t, r);
          break;
        }
    },
  };
  y0e.exports = { CloseEvent: Mm, ErrorEvent: Iy, Event: mc, EventTarget: rkt, MessageEvent: Rx };
  function aM(t, e, r) {
    typeof t == "object" && t.handleEvent ? t.handleEvent.call(t, r) : t.call(e, r);
  }
});
var lM = A((yLr, b0e) => {
  "use strict";
  var { tokenChars: Ex } = Ey();
  function Ya(t, e, r) {
    t[e] === void 0 ? (t[e] = [r]) : t[e].push(r);
  }
  function nkt(t) {
    let e = Object.create(null),
      r = Object.create(null),
      n = !1,
      o = !1,
      i = !1,
      s,
      a,
      l = -1,
      c = -1,
      u = -1,
      p = 0;
    for (; p < t.length; p++)
      if (((c = t.charCodeAt(p)), s === void 0))
        if (u === -1 && Ex[c] === 1) l === -1 && (l = p);
        else if (p !== 0 && (c === 32 || c === 9)) u === -1 && l !== -1 && (u = p);
        else if (c === 59 || c === 44) {
          if (l === -1) throw new SyntaxError(`Unexpected character at index ${p}`);
          u === -1 && (u = p);
          let f = t.slice(l, u);
          (c === 44 ? (Ya(e, f, r), (r = Object.create(null))) : (s = f), (l = u = -1));
        } else throw new SyntaxError(`Unexpected character at index ${p}`);
      else if (a === void 0)
        if (u === -1 && Ex[c] === 1) l === -1 && (l = p);
        else if (c === 32 || c === 9) u === -1 && l !== -1 && (u = p);
        else if (c === 59 || c === 44) {
          if (l === -1) throw new SyntaxError(`Unexpected character at index ${p}`);
          (u === -1 && (u = p),
            Ya(r, t.slice(l, u), !0),
            c === 44 && (Ya(e, s, r), (r = Object.create(null)), (s = void 0)),
            (l = u = -1));
        } else if (c === 61 && l !== -1 && u === -1) ((a = t.slice(l, p)), (l = u = -1));
        else throw new SyntaxError(`Unexpected character at index ${p}`);
      else if (o) {
        if (Ex[c] !== 1) throw new SyntaxError(`Unexpected character at index ${p}`);
        (l === -1 ? (l = p) : n || (n = !0), (o = !1));
      } else if (i)
        if (Ex[c] === 1) l === -1 && (l = p);
        else if (c === 34 && l !== -1) ((i = !1), (u = p));
        else if (c === 92) o = !0;
        else throw new SyntaxError(`Unexpected character at index ${p}`);
      else if (c === 34 && t.charCodeAt(p - 1) === 61) i = !0;
      else if (u === -1 && Ex[c] === 1) l === -1 && (l = p);
      else if (l !== -1 && (c === 32 || c === 9)) u === -1 && (u = p);
      else if (c === 59 || c === 44) {
        if (l === -1) throw new SyntaxError(`Unexpected character at index ${p}`);
        u === -1 && (u = p);
        let f = t.slice(l, u);
        (n && ((f = f.replace(/\\/g, "")), (n = !1)),
          Ya(r, a, f),
          c === 44 && (Ya(e, s, r), (r = Object.create(null)), (s = void 0)),
          (a = void 0),
          (l = u = -1));
      } else throw new SyntaxError(`Unexpected character at index ${p}`);
    if (l === -1 || i || c === 32 || c === 9) throw new SyntaxError("Unexpected end of input");
    u === -1 && (u = p);
    let m = t.slice(l, u);
    return (
      s === void 0
        ? Ya(e, m, r)
        : (a === void 0 ? Ya(r, m, !0) : n ? Ya(r, a, m.replace(/\\/g, "")) : Ya(r, a, m),
          Ya(e, s, r)),
      e
    );
  }
  function okt(t) {
    return Object.keys(t)
      .map((e) => {
        let r = t[e];
        return (
          Array.isArray(r) || (r = [r]),
          r
            .map((n) =>
              [e]
                .concat(
                  Object.keys(n).map((o) => {
                    let i = n[o];
                    return (
                      Array.isArray(i) || (i = [i]),
                      i.map((s) => (s === !0 ? o : `${o}=${s}`)).join("; ")
                    );
                  }),
                )
                .join("; "),
            )
            .join(", ")
        );
      })
      .join(", ");
  }
  b0e.exports = { format: okt, parse: nkt };
});
var pM = A((SLr, k0e) => {
  "use strict";
  var ikt = require("events"),
    skt = require("https"),
    akt = require("http"),
    _0e = require("net"),
    lkt = require("tls"),
    { randomBytes: ckt, createHash: ukt } = require("crypto"),
    { Duplex: vLr, Readable: bLr } = require("stream"),
    { URL: P6 } = require("url"),
    Yu = Ry(),
    dkt = A6(),
    pkt = C6(),
    { isBlob: mkt } = Ey(),
    {
      BINARY_TYPES: S0e,
      CLOSE_TIMEOUT: fkt,
      EMPTY_BUFFER: cM,
      GUID: hkt,
      kForOnEventAttribute: I6,
      kListener: gkt,
      kStatusCode: ykt,
      kWebSocket: Un,
      NOOP: x0e,
    } = uc(),
    {
      EventTarget: { addEventListener: vkt, removeEventListener: bkt },
    } = v0e(),
    { format: Skt, parse: wkt } = lM(),
    { toBuffer: _kt } = _x(),
    A0e = Symbol("kAborted"),
    k6 = [8, 13],
    fc = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"],
    xkt = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/,
    Fr = class t extends ikt {
      constructor(e, r, n) {
        (super(),
          (this._binaryType = S0e[0]),
          (this._closeCode = 1006),
          (this._closeFrameReceived = !1),
          (this._closeFrameSent = !1),
          (this._closeMessage = cM),
          (this._closeTimer = null),
          (this._errorEmitted = !1),
          (this._extensions = {}),
          (this._paused = !1),
          (this._protocol = ""),
          (this._readyState = t.CONNECTING),
          (this._receiver = null),
          (this._sender = null),
          (this._socket = null),
          e !== null
            ? ((this._bufferedAmount = 0),
              (this._isServer = !1),
              (this._redirects = 0),
              r === void 0
                ? (r = [])
                : Array.isArray(r) ||
                  (typeof r == "object" && r !== null ? ((n = r), (r = [])) : (r = [r])),
              R0e(this, e, r, n))
            : ((this._autoPong = n.autoPong),
              (this._closeTimeout = n.closeTimeout),
              (this._isServer = !0)));
      }
      get binaryType() {
        return this._binaryType;
      }
      set binaryType(e) {
        S0e.includes(e) &&
          ((this._binaryType = e), this._receiver && (this._receiver._binaryType = e));
      }
      get bufferedAmount() {
        return this._socket
          ? this._socket._writableState.length + this._sender._bufferedBytes
          : this._bufferedAmount;
      }
      get extensions() {
        return Object.keys(this._extensions).join();
      }
      get isPaused() {
        return this._paused;
      }
      get onclose() {
        return null;
      }
      get onerror() {
        return null;
      }
      get onopen() {
        return null;
      }
      get onmessage() {
        return null;
      }
      get protocol() {
        return this._protocol;
      }
      get readyState() {
        return this._readyState;
      }
      get url() {
        return this._url;
      }
      setSocket(e, r, n) {
        let o = new dkt({
            allowSynchronousEvents: n.allowSynchronousEvents,
            binaryType: this.binaryType,
            extensions: this._extensions,
            isServer: this._isServer,
            maxBufferedChunks: n.maxBufferedChunks,
            maxFragments: n.maxFragments,
            maxPayload: n.maxPayload,
            skipUTF8Validation: n.skipUTF8Validation,
          }),
          i = new pkt(e, this._extensions, n.generateMask);
        ((this._receiver = o),
          (this._sender = i),
          (this._socket = e),
          (o[Un] = this),
          (i[Un] = this),
          (e[Un] = this),
          o.on("conclude", Ekt),
          o.on("drain", Ckt),
          o.on("error", Tkt),
          o.on("message", Pkt),
          o.on("ping", Ikt),
          o.on("pong", kkt),
          (i.onerror = Dkt),
          e.setTimeout && e.setTimeout(0),
          e.setNoDelay && e.setNoDelay(),
          r.length > 0 && e.unshift(r),
          e.on("close", T0e),
          e.on("data", dM),
          e.on("end", P0e),
          e.on("error", I0e),
          (this._readyState = t.OPEN),
          this.emit("open"));
      }
      emitClose() {
        if (!this._socket) {
          ((this._readyState = t.CLOSED), this.emit("close", this._closeCode, this._closeMessage));
          return;
        }
        (this._extensions[Yu.extensionName] && this._extensions[Yu.extensionName].cleanup(),
          this._receiver.removeAllListeners(),
          (this._readyState = t.CLOSED),
          this.emit("close", this._closeCode, this._closeMessage));
      }
      close(e, r) {
        if (this.readyState !== t.CLOSED) {
          if (this.readyState === t.CONNECTING) {
            $i(this, this._req, "WebSocket was closed before the connection was established");
            return;
          }
          if (this.readyState === t.CLOSING) {
            this._closeFrameSent &&
              (this._closeFrameReceived || this._receiver._writableState.errorEmitted) &&
              this._socket.end();
            return;
          }
          ((this._readyState = t.CLOSING),
            this._sender.close(e, r, !this._isServer, (n) => {
              n ||
                ((this._closeFrameSent = !0),
                (this._closeFrameReceived || this._receiver._writableState.errorEmitted) &&
                  this._socket.end());
            }),
            C0e(this));
        }
      }
      pause() {
        this.readyState === t.CONNECTING ||
          this.readyState === t.CLOSED ||
          ((this._paused = !0), this._socket.pause());
      }
      ping(e, r, n) {
        if (this.readyState === t.CONNECTING)
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        if (
          (typeof e == "function"
            ? ((n = e), (e = r = void 0))
            : typeof r == "function" && ((n = r), (r = void 0)),
          typeof e == "number" && (e = e.toString()),
          this.readyState !== t.OPEN)
        ) {
          D6(this, e, n);
          return;
        }
        (r === void 0 && (r = !this._isServer), this._sender.ping(e || cM, r, n));
      }
      pong(e, r, n) {
        if (this.readyState === t.CONNECTING)
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        if (
          (typeof e == "function"
            ? ((n = e), (e = r = void 0))
            : typeof r == "function" && ((n = r), (r = void 0)),
          typeof e == "number" && (e = e.toString()),
          this.readyState !== t.OPEN)
        ) {
          D6(this, e, n);
          return;
        }
        (r === void 0 && (r = !this._isServer), this._sender.pong(e || cM, r, n));
      }
      resume() {
        this.readyState === t.CONNECTING ||
          this.readyState === t.CLOSED ||
          ((this._paused = !1), this._receiver._writableState.needDrain || this._socket.resume());
      }
      send(e, r, n) {
        if (this.readyState === t.CONNECTING)
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        if (
          (typeof r == "function" && ((n = r), (r = {})),
          typeof e == "number" && (e = e.toString()),
          this.readyState !== t.OPEN)
        ) {
          D6(this, e, n);
          return;
        }
        let o = {
          binary: typeof e != "string",
          mask: !this._isServer,
          compress: !0,
          fin: !0,
          ...r,
        };
        (this._extensions[Yu.extensionName] || (o.compress = !1), this._sender.send(e || cM, o, n));
      }
      terminate() {
        if (this.readyState !== t.CLOSED) {
          if (this.readyState === t.CONNECTING) {
            $i(this, this._req, "WebSocket was closed before the connection was established");
            return;
          }
          this._socket && ((this._readyState = t.CLOSING), this._socket.destroy());
        }
      }
    };
  Object.defineProperty(Fr, "CONNECTING", { enumerable: !0, value: fc.indexOf("CONNECTING") });
  Object.defineProperty(Fr.prototype, "CONNECTING", {
    enumerable: !0,
    value: fc.indexOf("CONNECTING"),
  });
  Object.defineProperty(Fr, "OPEN", { enumerable: !0, value: fc.indexOf("OPEN") });
  Object.defineProperty(Fr.prototype, "OPEN", { enumerable: !0, value: fc.indexOf("OPEN") });
  Object.defineProperty(Fr, "CLOSING", { enumerable: !0, value: fc.indexOf("CLOSING") });
  Object.defineProperty(Fr.prototype, "CLOSING", { enumerable: !0, value: fc.indexOf("CLOSING") });
  Object.defineProperty(Fr, "CLOSED", { enumerable: !0, value: fc.indexOf("CLOSED") });
  Object.defineProperty(Fr.prototype, "CLOSED", { enumerable: !0, value: fc.indexOf("CLOSED") });
  [
    "binaryType",
    "bufferedAmount",
    "extensions",
    "isPaused",
    "protocol",
    "readyState",
    "url",
  ].forEach((t) => {
    Object.defineProperty(Fr.prototype, t, { enumerable: !0 });
  });
  ["open", "error", "close", "message"].forEach((t) => {
    Object.defineProperty(Fr.prototype, `on${t}`, {
      enumerable: !0,
      get() {
        for (let e of this.listeners(t)) if (e[I6]) return e[gkt];
        return null;
      },
      set(e) {
        for (let r of this.listeners(t))
          if (r[I6]) {
            this.removeListener(t, r);
            break;
          }
        typeof e == "function" && this.addEventListener(t, e, { [I6]: !0 });
      },
    });
  });
  Fr.prototype.addEventListener = vkt;
  Fr.prototype.removeEventListener = bkt;
  k0e.exports = Fr;
  function R0e(t, e, r, n) {
    let o = {
      allowSynchronousEvents: !0,
      autoPong: !0,
      closeTimeout: fkt,
      protocolVersion: k6[1],
      maxBufferedChunks: 262144,
      maxFragments: 16384,
      maxPayload: 104857600,
      skipUTF8Validation: !1,
      perMessageDeflate: !0,
      followRedirects: !1,
      maxRedirects: 10,
      ...n,
      socketPath: void 0,
      hostname: void 0,
      protocol: void 0,
      timeout: void 0,
      method: "GET",
      host: void 0,
      path: void 0,
      port: void 0,
    };
    if (
      ((t._autoPong = o.autoPong),
      (t._closeTimeout = o.closeTimeout),
      !k6.includes(o.protocolVersion))
    )
      throw new RangeError(
        `Unsupported protocol version: ${o.protocolVersion} (supported versions: ${k6.join(", ")})`,
      );
    let i;
    if (e instanceof P6) i = e;
    else
      try {
        i = new P6(e);
      } catch {
        throw new SyntaxError(`Invalid URL: ${e}`);
      }
    (i.protocol === "http:"
      ? (i.protocol = "ws:")
      : i.protocol === "https:" && (i.protocol = "wss:"),
      (t._url = i.href));
    let s = i.protocol === "wss:",
      a = i.protocol === "ws+unix:",
      l;
    if (
      (i.protocol !== "ws:" && !s && !a
        ? (l = `The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"`)
        : a && !i.pathname
          ? (l = "The URL's pathname is empty")
          : i.hash && (l = "The URL contains a fragment identifier"),
      l)
    ) {
      let v = new SyntaxError(l);
      if (t._redirects === 0) throw v;
      uM(t, v);
      return;
    }
    let c = s ? 443 : 80,
      u = ckt(16).toString("base64"),
      p = s ? skt.request : akt.request,
      m = new Set(),
      f;
    if (
      ((o.createConnection = o.createConnection || (s ? Rkt : Akt)),
      (o.defaultPort = o.defaultPort || c),
      (o.port = i.port || c),
      (o.host = i.hostname.startsWith("[") ? i.hostname.slice(1, -1) : i.hostname),
      (o.headers = {
        ...o.headers,
        "Sec-WebSocket-Version": o.protocolVersion,
        "Sec-WebSocket-Key": u,
        Connection: "Upgrade",
        Upgrade: "websocket",
      }),
      (o.path = i.pathname + i.search),
      (o.timeout = o.handshakeTimeout),
      o.perMessageDeflate &&
        ((f = new Yu({ ...o.perMessageDeflate, isServer: !1, maxPayload: o.maxPayload })),
        (o.headers["Sec-WebSocket-Extensions"] = Skt({ [Yu.extensionName]: f.offer() }))),
      r.length)
    ) {
      for (let v of r) {
        if (typeof v != "string" || !xkt.test(v) || m.has(v))
          throw new SyntaxError("An invalid or duplicated subprotocol was specified");
        m.add(v);
      }
      o.headers["Sec-WebSocket-Protocol"] = r.join(",");
    }
    if (
      (o.origin &&
        (o.protocolVersion < 13
          ? (o.headers["Sec-WebSocket-Origin"] = o.origin)
          : (o.headers.Origin = o.origin)),
      (i.username || i.password) && (o.auth = `${i.username}:${i.password}`),
      a)
    ) {
      let v = o.path.split(":");
      ((o.socketPath = v[0]), (o.path = v[1]));
    }
    let h;
    if (o.followRedirects) {
      if (t._redirects === 0) {
        ((t._originalIpc = a),
          (t._originalSecure = s),
          (t._originalHostOrSocketPath = a ? o.socketPath : i.host));
        let v = n && n.headers;
        if (((n = { ...n, headers: {} }), v))
          for (let [y, w] of Object.entries(v)) n.headers[y.toLowerCase()] = w;
      } else if (t.listenerCount("redirect") === 0) {
        let v = a
          ? t._originalIpc
            ? o.socketPath === t._originalHostOrSocketPath
            : !1
          : t._originalIpc
            ? !1
            : i.host === t._originalHostOrSocketPath;
        (!v || (t._originalSecure && !s)) &&
          (delete o.headers.authorization,
          delete o.headers.cookie,
          v || delete o.headers.host,
          (o.auth = void 0));
      }
      (o.auth &&
        !n.headers.authorization &&
        (n.headers.authorization = "Basic " + Buffer.from(o.auth).toString("base64")),
        (h = t._req = p(o)),
        t._redirects && t.emit("redirect", t.url, h));
    } else h = t._req = p(o);
    (o.timeout &&
      h.on("timeout", () => {
        $i(t, h, "Opening handshake has timed out");
      }),
      h.on("error", (v) => {
        h === null || h[A0e] || ((h = t._req = null), uM(t, v));
      }),
      h.on("response", (v) => {
        let y = v.headers.location,
          w = v.statusCode;
        if (y && o.followRedirects && w >= 300 && w < 400) {
          if (++t._redirects > o.maxRedirects) {
            $i(t, h, "Maximum redirects exceeded");
            return;
          }
          h.abort();
          let _;
          try {
            _ = new P6(y, e);
          } catch {
            let E = new SyntaxError(`Invalid URL: ${y}`);
            uM(t, E);
            return;
          }
          R0e(t, _, r, n);
        } else
          t.emit("unexpected-response", h, v) ||
            $i(t, h, `Unexpected server response: ${v.statusCode}`);
      }),
      h.on("upgrade", (v, y, w) => {
        if ((t.emit("upgrade", v), t.readyState !== Fr.CONNECTING)) return;
        h = t._req = null;
        let _ = v.headers.upgrade;
        if (_ === void 0 || _.toLowerCase() !== "websocket") {
          $i(t, y, "Invalid Upgrade header");
          return;
        }
        let S = ukt("sha1")
          .update(u + hkt)
          .digest("base64");
        if (v.headers["sec-websocket-accept"] !== S) {
          $i(t, y, "Invalid Sec-WebSocket-Accept header");
          return;
        }
        let E = v.headers["sec-websocket-protocol"],
          T;
        if (
          (E !== void 0
            ? m.size
              ? m.has(E) || (T = "Server sent an invalid subprotocol")
              : (T = "Server sent a subprotocol but none was requested")
            : m.size && (T = "Server sent no subprotocol"),
          T)
        ) {
          $i(t, y, T);
          return;
        }
        E && (t._protocol = E);
        let P = v.headers["sec-websocket-extensions"];
        if (P !== void 0) {
          if (!f) {
            $i(
              t,
              y,
              "Server sent a Sec-WebSocket-Extensions header but no extension was requested",
            );
            return;
          }
          let M;
          try {
            M = wkt(P);
          } catch {
            $i(t, y, "Invalid Sec-WebSocket-Extensions header");
            return;
          }
          let L = Object.keys(M);
          if (L.length !== 1 || L[0] !== Yu.extensionName) {
            $i(t, y, "Server indicated an extension that was not requested");
            return;
          }
          try {
            f.accept(M[Yu.extensionName]);
          } catch {
            $i(t, y, "Invalid Sec-WebSocket-Extensions header");
            return;
          }
          t._extensions[Yu.extensionName] = f;
        }
        t.setSocket(y, w, {
          allowSynchronousEvents: o.allowSynchronousEvents,
          generateMask: o.generateMask,
          maxBufferedChunks: o.maxBufferedChunks,
          maxFragments: o.maxFragments,
          maxPayload: o.maxPayload,
          skipUTF8Validation: o.skipUTF8Validation,
        });
      }),
      o.finishRequest ? o.finishRequest(h, t) : h.end());
  }
  function uM(t, e) {
    ((t._readyState = Fr.CLOSING), (t._errorEmitted = !0), t.emit("error", e), t.emitClose());
  }
  function Akt(t) {
    return ((t.path = t.socketPath), _0e.connect(t));
  }
  function Rkt(t) {
    return (
      (t.path = void 0),
      !t.servername && t.servername !== "" && (t.servername = _0e.isIP(t.host) ? "" : t.host),
      lkt.connect(t)
    );
  }
  function $i(t, e, r) {
    t._readyState = Fr.CLOSING;
    let n = new Error(r);
    (Error.captureStackTrace(n, $i),
      e.setHeader
        ? ((e[A0e] = !0),
          e.abort(),
          e.socket && !e.socket.destroyed && e.socket.destroy(),
          process.nextTick(uM, t, n))
        : (e.destroy(n),
          e.once("error", t.emit.bind(t, "error")),
          e.once("close", t.emitClose.bind(t))));
  }
  function D6(t, e, r) {
    if (e) {
      let n = mkt(e) ? e.size : _kt(e).length;
      t._socket ? (t._sender._bufferedBytes += n) : (t._bufferedAmount += n);
    }
    if (r) {
      let n = new Error(`WebSocket is not open: readyState ${t.readyState} (${fc[t.readyState]})`);
      process.nextTick(r, n);
    }
  }
  function Ekt(t, e) {
    let r = this[Un];
    ((r._closeFrameReceived = !0),
      (r._closeMessage = e),
      (r._closeCode = t),
      r._socket[Un] !== void 0 &&
        (r._socket.removeListener("data", dM),
        process.nextTick(E0e, r._socket),
        t === 1005 ? r.close() : r.close(t, e)));
  }
  function Ckt() {
    let t = this[Un];
    t.isPaused || t._socket.resume();
  }
  function Tkt(t) {
    let e = this[Un];
    (e._socket[Un] !== void 0 &&
      (e._socket.removeListener("data", dM), process.nextTick(E0e, e._socket), e.close(t[ykt])),
      e._errorEmitted || ((e._errorEmitted = !0), e.emit("error", t)));
  }
  function w0e() {
    this[Un].emitClose();
  }
  function Pkt(t, e) {
    this[Un].emit("message", t, e);
  }
  function Ikt(t) {
    let e = this[Un];
    (e._autoPong && e.pong(t, !this._isServer, x0e), e.emit("ping", t));
  }
  function kkt(t) {
    this[Un].emit("pong", t);
  }
  function E0e(t) {
    t.resume();
  }
  function Dkt(t) {
    let e = this[Un];
    e.readyState !== Fr.CLOSED &&
      (e.readyState === Fr.OPEN && ((e._readyState = Fr.CLOSING), C0e(e)),
      this._socket.end(),
      e._errorEmitted || ((e._errorEmitted = !0), e.emit("error", t)));
  }
  function C0e(t) {
    t._closeTimer = setTimeout(t._socket.destroy.bind(t._socket), t._closeTimeout);
  }
  function T0e() {
    let t = this[Un];
    if (
      (this.removeListener("close", T0e),
      this.removeListener("data", dM),
      this.removeListener("end", P0e),
      (t._readyState = Fr.CLOSING),
      !this._readableState.endEmitted &&
        !t._closeFrameReceived &&
        !t._receiver._writableState.errorEmitted &&
        this._readableState.length !== 0)
    ) {
      let e = this.read(this._readableState.length);
      t._receiver.write(e);
    }
    (t._receiver.end(),
      (this[Un] = void 0),
      clearTimeout(t._closeTimer),
      t._receiver._writableState.finished || t._receiver._writableState.errorEmitted
        ? t.emitClose()
        : (t._receiver.on("error", w0e), t._receiver.on("finish", w0e)));
  }
  function dM(t) {
    this[Un]._receiver.write(t) || this.pause();
  }
  function P0e() {
    let t = this[Un];
    ((t._readyState = Fr.CLOSING), t._receiver.end(), this.end());
  }
  function I0e() {
    let t = this[Un];
    (this.removeListener("error", I0e),
      this.on("error", x0e),
      t && ((t._readyState = Fr.CLOSING), this.destroy()));
  }
});
var N0e = A((_Lr, O0e) => {
  "use strict";
  var wLr = pM(),
    { Duplex: Mkt } = require("stream");
  function D0e(t) {
    t.emit("close");
  }
  function Okt() {
    !this.destroyed && this._writableState.finished && this.destroy();
  }
  function M0e(t) {
    (this.removeListener("error", M0e),
      this.destroy(),
      this.listenerCount("error") === 0 && this.emit("error", t));
  }
  function Nkt(t, e) {
    let r = !0,
      n = new Mkt({ ...e, autoDestroy: !1, emitClose: !1, objectMode: !1, writableObjectMode: !1 });
    return (
      t.on("message", function (i, s) {
        let a = !s && n._readableState.objectMode ? i.toString() : i;
        n.push(a) || t.pause();
      }),
      t.once("error", function (i) {
        n.destroyed || ((r = !1), n.destroy(i));
      }),
      t.once("close", function () {
        n.destroyed || n.push(null);
      }),
      (n._destroy = function (o, i) {
        if (t.readyState === t.CLOSED) {
          (i(o), process.nextTick(D0e, n));
          return;
        }
        let s = !1;
        (t.once("error", function (l) {
          ((s = !0), i(l));
        }),
          t.once("close", function () {
            (s || i(o), process.nextTick(D0e, n));
          }),
          r && t.terminate());
      }),
      (n._final = function (o) {
        if (t.readyState === t.CONNECTING) {
          t.once("open", function () {
            n._final(o);
          });
          return;
        }
        t._socket !== null &&
          (t._socket._writableState.finished
            ? (o(), n._readableState.endEmitted && n.destroy())
            : (t._socket.once("finish", function () {
                o();
              }),
              t.close()));
      }),
      (n._read = function () {
        t.isPaused && t.resume();
      }),
      (n._write = function (o, i, s) {
        if (t.readyState === t.CONNECTING) {
          t.once("open", function () {
            n._write(o, i, s);
          });
          return;
        }
        t.send(o, s);
      }),
      n.on("end", Okt),
      n.on("error", M0e),
      n
    );
  }
  O0e.exports = Nkt;
});
var M6 = A((xLr, L0e) => {
  "use strict";
  var { tokenChars: Lkt } = Ey();
  function Bkt(t) {
    let e = new Set(),
      r = -1,
      n = -1,
      o = 0;
    for (o; o < t.length; o++) {
      let s = t.charCodeAt(o);
      if (n === -1 && Lkt[s] === 1) r === -1 && (r = o);
      else if (o !== 0 && (s === 32 || s === 9)) n === -1 && r !== -1 && (n = o);
      else if (s === 44) {
        if (r === -1) throw new SyntaxError(`Unexpected character at index ${o}`);
        n === -1 && (n = o);
        let a = t.slice(r, n);
        if (e.has(a)) throw new SyntaxError(`The "${a}" subprotocol is duplicated`);
        (e.add(a), (r = n = -1));
      } else throw new SyntaxError(`Unexpected character at index ${o}`);
    }
    if (r === -1 || n !== -1) throw new SyntaxError("Unexpected end of input");
    let i = t.slice(r, o);
    if (e.has(i)) throw new SyntaxError(`The "${i}" subprotocol is duplicated`);
    return (e.add(i), e);
  }
  L0e.exports = { parse: Bkt };
});
var W0e = A((RLr, G0e) => {
  "use strict";
  var Fkt = require("events"),
    mM = require("http"),
    { Duplex: ALr } = require("stream"),
    { createHash: $kt } = require("crypto"),
    B0e = lM(),
    Om = Ry(),
    Ukt = M6(),
    qkt = pM(),
    { CLOSE_TIMEOUT: Gkt, GUID: Wkt, kWebSocket: Hkt } = uc(),
    jkt = /^[+/0-9A-Za-z]{22}==$/,
    F0e = 0,
    $0e = 1,
    q0e = 2,
    O6 = class extends Fkt {
      constructor(e, r) {
        if (
          (super(),
          (e = {
            allowSynchronousEvents: !0,
            autoPong: !0,
            maxBufferedChunks: 256 * 1024,
            maxFragments: 16 * 1024,
            maxPayload: 100 * 1024 * 1024,
            skipUTF8Validation: !1,
            perMessageDeflate: !1,
            handleProtocols: null,
            clientTracking: !0,
            closeTimeout: Gkt,
            verifyClient: null,
            noServer: !1,
            backlog: null,
            server: null,
            host: null,
            path: null,
            port: null,
            WebSocket: qkt,
            ...e,
          }),
          (e.port == null && !e.server && !e.noServer) ||
            (e.port != null && (e.server || e.noServer)) ||
            (e.server && e.noServer))
        )
          throw new TypeError(
            'One and only one of the "port", "server", or "noServer" options must be specified',
          );
        if (
          (e.port != null
            ? ((this._server = mM.createServer((n, o) => {
                let i = mM.STATUS_CODES[426];
                (o.writeHead(426, { "Content-Length": i.length, "Content-Type": "text/plain" }),
                  o.end(i));
              })),
              this._server.listen(e.port, e.host, e.backlog, r))
            : e.server && (this._server = e.server),
          this._server)
        ) {
          let n = this.emit.bind(this, "connection");
          this._removeListeners = zkt(this._server, {
            listening: this.emit.bind(this, "listening"),
            error: this.emit.bind(this, "error"),
            upgrade: (o, i, s) => {
              this.handleUpgrade(o, i, s, n);
            },
          });
        }
        (e.perMessageDeflate === !0 && (e.perMessageDeflate = {}),
          e.clientTracking && ((this.clients = new Set()), (this._shouldEmitClose = !1)),
          (this.options = e),
          (this._state = F0e));
      }
      address() {
        if (this.options.noServer) throw new Error('The server is operating in "noServer" mode');
        return this._server ? this._server.address() : null;
      }
      close(e) {
        if (this._state === q0e) {
          (e &&
            this.once("close", () => {
              e(new Error("The server is not running"));
            }),
            process.nextTick(Cx, this));
          return;
        }
        if ((e && this.once("close", e), this._state !== $0e))
          if (((this._state = $0e), this.options.noServer || this.options.server))
            (this._server &&
              (this._removeListeners(), (this._removeListeners = this._server = null)),
              this.clients
                ? this.clients.size
                  ? (this._shouldEmitClose = !0)
                  : process.nextTick(Cx, this)
                : process.nextTick(Cx, this));
          else {
            let r = this._server;
            (this._removeListeners(),
              (this._removeListeners = this._server = null),
              r.close(() => {
                Cx(this);
              }));
          }
      }
      shouldHandle(e) {
        if (this.options.path) {
          let r = e.url.indexOf("?");
          if ((r !== -1 ? e.url.slice(0, r) : e.url) !== this.options.path) return !1;
        }
        return !0;
      }
      handleUpgrade(e, r, n, o) {
        r.on("error", U0e);
        let i = e.headers["sec-websocket-key"],
          s = e.headers.upgrade,
          a = +e.headers["sec-websocket-version"];
        if (e.method !== "GET") {
          Nm(this, e, r, 405, "Invalid HTTP method");
          return;
        }
        if (s === void 0 || s.toLowerCase() !== "websocket") {
          Nm(this, e, r, 400, "Invalid Upgrade header");
          return;
        }
        if (i === void 0 || !jkt.test(i)) {
          Nm(this, e, r, 400, "Missing or invalid Sec-WebSocket-Key header");
          return;
        }
        if (a !== 13 && a !== 8) {
          Nm(this, e, r, 400, "Missing or invalid Sec-WebSocket-Version header", {
            "Sec-WebSocket-Version": "13, 8",
          });
          return;
        }
        if (!this.shouldHandle(e)) {
          Tx(r, 400);
          return;
        }
        let l = e.headers["sec-websocket-protocol"],
          c = new Set();
        if (l !== void 0)
          try {
            c = Ukt.parse(l);
          } catch {
            Nm(this, e, r, 400, "Invalid Sec-WebSocket-Protocol header");
            return;
          }
        let u = e.headers["sec-websocket-extensions"],
          p = {};
        if (this.options.perMessageDeflate && u !== void 0) {
          let m = new Om({
            ...this.options.perMessageDeflate,
            isServer: !0,
            maxPayload: this.options.maxPayload,
          });
          try {
            let f = B0e.parse(u);
            f[Om.extensionName] && (m.accept(f[Om.extensionName]), (p[Om.extensionName] = m));
          } catch {
            Nm(this, e, r, 400, "Invalid or unacceptable Sec-WebSocket-Extensions header");
            return;
          }
        }
        if (this.options.verifyClient) {
          let m = {
            origin: e.headers[`${a === 8 ? "sec-websocket-origin" : "origin"}`],
            secure: !!(e.socket.authorized || e.socket.encrypted),
            req: e,
          };
          if (this.options.verifyClient.length === 2) {
            this.options.verifyClient(m, (f, h, v, y) => {
              if (!f) return Tx(r, h || 401, v, y);
              this.completeUpgrade(p, i, c, e, r, n, o);
            });
            return;
          }
          if (!this.options.verifyClient(m)) return Tx(r, 401);
        }
        this.completeUpgrade(p, i, c, e, r, n, o);
      }
      completeUpgrade(e, r, n, o, i, s, a) {
        if (!i.readable || !i.writable) return i.destroy();
        if (i[Hkt])
          throw new Error(
            "server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration",
          );
        if (this._state > F0e) return Tx(i, 503);
        let c = [
            "HTTP/1.1 101 Switching Protocols",
            "Upgrade: websocket",
            "Connection: Upgrade",
            `Sec-WebSocket-Accept: ${$kt("sha1")
              .update(r + Wkt)
              .digest("base64")}`,
          ],
          u = new this.options.WebSocket(null, void 0, this.options);
        if (n.size) {
          let p = this.options.handleProtocols
            ? this.options.handleProtocols(n, o)
            : n.values().next().value;
          p && (c.push(`Sec-WebSocket-Protocol: ${p}`), (u._protocol = p));
        }
        if (e[Om.extensionName]) {
          let p = e[Om.extensionName].params,
            m = B0e.format({ [Om.extensionName]: [p] });
          (c.push(`Sec-WebSocket-Extensions: ${m}`), (u._extensions = e));
        }
        (this.emit("headers", c, o),
          i.write(
            c.concat(`\r
`).join(`\r
`),
          ),
          i.removeListener("error", U0e),
          u.setSocket(i, s, {
            allowSynchronousEvents: this.options.allowSynchronousEvents,
            maxBufferedChunks: this.options.maxBufferedChunks,
            maxFragments: this.options.maxFragments,
            maxPayload: this.options.maxPayload,
            skipUTF8Validation: this.options.skipUTF8Validation,
          }),
          this.clients &&
            (this.clients.add(u),
            u.on("close", () => {
              (this.clients.delete(u),
                this._shouldEmitClose && !this.clients.size && process.nextTick(Cx, this));
            })),
          a(u, o));
      }
    };
  G0e.exports = O6;
  function zkt(t, e) {
    for (let r of Object.keys(e)) t.on(r, e[r]);
    return function () {
      for (let n of Object.keys(e)) t.removeListener(n, e[n]);
    };
  }
  function Cx(t) {
    ((t._state = q0e), t.emit("close"));
  }
  function U0e() {
    this.destroy();
  }
  function Tx(t, e, r, n) {
    ((r = r || mM.STATUS_CODES[e]),
      (n = {
        Connection: "close",
        "Content-Type": "text/html",
        "Content-Length": Buffer.byteLength(r),
        ...n,
      }),
      t.once("finish", t.destroy),
      t.end(
        `HTTP/1.1 ${e} ${mM.STATUS_CODES[e]}\r
` +
          Object.keys(n).map((o) => `${o}: ${n[o]}`).join(`\r
`) +
          `\r
\r
` +
          r,
      ));
  }
  function Nm(t, e, r, n, o, i) {
    if (t.listenerCount("wsClientError")) {
      let s = new Error(o);
      (Error.captureStackTrace(s, Nm), t.emit("wsClientError", s, r, e));
    } else Tx(r, n, o, i);
  }
});
var Vkt,
  Kkt,
  Zkt,
  Xkt,
  Ykt,
  Jkt,
  Qkt,
  e0t,
  N6 = g(() => {
    ((Vkt = F(N0e(), 1)),
      (Kkt = F(lM(), 1)),
      (Zkt = F(Ry(), 1)),
      (Xkt = F(A6(), 1)),
      (Ykt = F(C6(), 1)),
      (Jkt = F(M6(), 1)),
      (Qkt = F(pM(), 1)),
      (e0t = F(W0e(), 1)));
  });
var CLr,
  TLr,
  fM = g(() => {
    ((CLr = 100 * 1024 * 1024), (TLr = 16 * 1024 * 1024));
  });
var L6 = g(() => {
  Ga();
  fM();
});
var hM = g(() => {
  Ga();
});
var n0t,
  B6 = g(() => {
    O();
    n0t = F(vke());
    N6();
    Bt();
    Ga();
    L6();
    hM();
    fM();
  });
var Ix,
  F6 = g(() => {
    iy();
    Ix = class {
      constructor(e) {
        this.options = e;
        ((this.parser = new gD(e)),
          this.parser.once("finish", e.onFinish),
          this.parser.once("error", e.onStreamError));
      }
      parser;
      source = null;
      attach(e) {
        if (((this.source = e), e == null)) {
          this.parser.end();
          return;
        }
        e.pipe(this.parser);
      }
      getCurrentLineProgress() {
        return this.parser.getCurrentLineProgress();
      }
      dispose() {
        (this.source?.unpipe(this.parser),
          (this.source = null),
          this.parser.removeListener("finish", this.options.onFinish),
          this.parser.removeListener("error", this.options.onStreamError),
          this.parser.destroy());
      }
    };
  });
var $6,
  V0e,
  C2r,
  T2r,
  P2r,
  U6 = g(() => {
    (($6 = require("node:child_process")), (V0e = require("node:util")));
    O();
    bm();
    $();
    _m();
    RD();
    Bn();
    os();
    sV();
    Bt();
    W0();
    G0();
    U_();
    GD();
    qD();
    Ua();
    OIe();
    Ga();
    NV();
    B6();
    F6();
    ((C2r = d.object({ appServerVersion: d.string() })),
      (T2r = (0, V0e.promisify)($6.execFile)),
      (P2r = [64 * 1024, 256 * 1024, 1024 * 1024]));
  });
