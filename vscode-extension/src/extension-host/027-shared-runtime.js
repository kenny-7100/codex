var XV = A((So) => {
  "use strict";
  var DPt =
      (So && So.__createBinding) ||
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
    MPt =
      (So && So.__setModuleDefault) ||
      (Object.create
        ? function (t, e) {
            Object.defineProperty(t, "default", { enumerable: !0, value: e });
          }
        : function (t, e) {
            t.default = e;
          }),
    OPt =
      (So && So.__importStar) ||
      function (t) {
        if (t && t.__esModule) return t;
        var e = {};
        if (t != null)
          for (var r in t)
            r !== "default" && Object.prototype.hasOwnProperty.call(t, r) && DPt(e, t, r);
        return (MPt(e, t), e);
      };
  Object.defineProperty(So, "__esModule", { value: !0 });
  So.v6 = So.AddressError = So.Address6 = So.Address4 = void 0;
  var NPt = HV();
  Object.defineProperty(So, "Address4", {
    enumerable: !0,
    get: function () {
      return NPt.Address4;
    },
  });
  var LPt = tke();
  Object.defineProperty(So, "Address6", {
    enumerable: !0,
    get: function () {
      return LPt.Address6;
    },
  });
  var BPt = jD();
  Object.defineProperty(So, "AddressError", {
    enumerable: !0,
    get: function () {
      return BPt.AddressError;
    },
  });
  var FPt = OPt(zV());
  So.v6 = { helpers: FPt };
});
var ake = A((ss) => {
  "use strict";
  Object.defineProperty(ss, "__esModule", { value: !0 });
  ss.ipToBuffer =
    ss.int32ToIpv4 =
    ss.ipv4ToInt32 =
    ss.validateSocksClientChainOptions =
    ss.validateSocksClientOptions =
      void 0;
  var Fo = UV(),
    $n = FV(),
    $Pt = require("stream"),
    YV = XV(),
    rke = require("net");
  function UPt(t, e = ["connect", "bind", "associate"]) {
    if (!$n.SocksCommand[t.command])
      throw new Fo.SocksClientError($n.ERRORS.InvalidSocksCommand, t);
    if (e.indexOf(t.command) === -1)
      throw new Fo.SocksClientError($n.ERRORS.InvalidSocksCommandForOperation, t);
    if (!oke(t.destination))
      throw new Fo.SocksClientError($n.ERRORS.InvalidSocksClientOptionsDestination, t);
    if (!ike(t.proxy)) throw new Fo.SocksClientError($n.ERRORS.InvalidSocksClientOptionsProxy, t);
    if ((nke(t.proxy, t), t.timeout && !ske(t.timeout)))
      throw new Fo.SocksClientError($n.ERRORS.InvalidSocksClientOptionsTimeout, t);
    if (t.existing_socket && !(t.existing_socket instanceof $Pt.Duplex))
      throw new Fo.SocksClientError($n.ERRORS.InvalidSocksClientOptionsExistingSocket, t);
  }
  ss.validateSocksClientOptions = UPt;
  function qPt(t) {
    if (t.command !== "connect")
      throw new Fo.SocksClientError($n.ERRORS.InvalidSocksCommandChain, t);
    if (!oke(t.destination))
      throw new Fo.SocksClientError($n.ERRORS.InvalidSocksClientOptionsDestination, t);
    if (!(t.proxies && Array.isArray(t.proxies) && t.proxies.length >= 2))
      throw new Fo.SocksClientError($n.ERRORS.InvalidSocksClientOptionsProxiesLength, t);
    if (
      (t.proxies.forEach((e) => {
        if (!ike(e)) throw new Fo.SocksClientError($n.ERRORS.InvalidSocksClientOptionsProxy, t);
        nke(e, t);
      }),
      t.timeout && !ske(t.timeout))
    )
      throw new Fo.SocksClientError($n.ERRORS.InvalidSocksClientOptionsTimeout, t);
  }
  ss.validateSocksClientChainOptions = qPt;
  function nke(t, e) {
    if (t.custom_auth_method !== void 0) {
      if (
        t.custom_auth_method < $n.SOCKS5_CUSTOM_AUTH_START ||
        t.custom_auth_method > $n.SOCKS5_CUSTOM_AUTH_END
      )
        throw new Fo.SocksClientError($n.ERRORS.InvalidSocksClientOptionsCustomAuthRange, e);
      if (
        t.custom_auth_request_handler === void 0 ||
        typeof t.custom_auth_request_handler != "function"
      )
        throw new Fo.SocksClientError($n.ERRORS.InvalidSocksClientOptionsCustomAuthOptions, e);
      if (t.custom_auth_response_size === void 0)
        throw new Fo.SocksClientError($n.ERRORS.InvalidSocksClientOptionsCustomAuthOptions, e);
      if (
        t.custom_auth_response_handler === void 0 ||
        typeof t.custom_auth_response_handler != "function"
      )
        throw new Fo.SocksClientError($n.ERRORS.InvalidSocksClientOptionsCustomAuthOptions, e);
    }
  }
  function oke(t) {
    return (
      t &&
      typeof t.host == "string" &&
      Buffer.byteLength(t.host) < 256 &&
      typeof t.port == "number" &&
      t.port >= 0 &&
      t.port <= 65535
    );
  }
  function ike(t) {
    return (
      t &&
      (typeof t.host == "string" || typeof t.ipaddress == "string") &&
      typeof t.port == "number" &&
      t.port >= 0 &&
      t.port <= 65535 &&
      (t.type === 4 || t.type === 5)
    );
  }
  function ske(t) {
    return typeof t == "number" && t > 0;
  }
  function GPt(t) {
    return new YV.Address4(t).toArray().reduce((r, n) => (r << 8) + n, 0) >>> 0;
  }
  ss.ipv4ToInt32 = GPt;
  function WPt(t) {
    let e = (t >>> 24) & 255,
      r = (t >>> 16) & 255,
      n = (t >>> 8) & 255,
      o = t & 255;
    return [e, r, n, o].join(".");
  }
  ss.int32ToIpv4 = WPt;
  function HPt(t) {
    if (rke.isIPv4(t)) {
      let e = new YV.Address4(t);
      return Buffer.from(e.toArray());
    } else if (rke.isIPv6(t)) {
      let e = new YV.Address6(t);
      return Buffer.from(
        e
          .canonicalForm()
          .split(":")
          .map((r) => r.padStart(4, "0"))
          .join(""),
        "hex",
      );
    } else throw new Error("Invalid IP address format");
  }
  ss.ipToBuffer = HPt;
});
var lke = A((YD) => {
  "use strict";
  Object.defineProperty(YD, "__esModule", { value: !0 });
  YD.ReceiveBuffer = void 0;
  var JV = class {
    constructor(e = 4096) {
      ((this.buffer = Buffer.allocUnsafe(e)), (this.offset = 0), (this.originalSize = e));
    }
    get length() {
      return this.offset;
    }
    append(e) {
      if (!Buffer.isBuffer(e))
        throw new Error("Attempted to append a non-buffer instance to ReceiveBuffer.");
      if (this.offset + e.length >= this.buffer.length) {
        let r = this.buffer;
        ((this.buffer = Buffer.allocUnsafe(
          Math.max(this.buffer.length + this.originalSize, this.buffer.length + e.length),
        )),
          r.copy(this.buffer));
      }
      return (e.copy(this.buffer, this.offset), (this.offset += e.length));
    }
    peek(e) {
      if (e > this.offset)
        throw new Error("Attempted to read beyond the bounds of the managed internal data.");
      return this.buffer.slice(0, e);
    }
    get(e) {
      if (e > this.offset)
        throw new Error("Attempted to read beyond the bounds of the managed internal data.");
      let r = Buffer.allocUnsafe(e);
      return (
        this.buffer.slice(0, e).copy(r),
        this.buffer.copyWithin(0, e, e + this.offset - e),
        (this.offset -= e),
        r
      );
    }
  };
  YD.ReceiveBuffer = JV;
});
var cke = A((Zu) => {
  "use strict";
  var wy =
    (Zu && Zu.__awaiter) ||
    function (t, e, r, n) {
      function o(i) {
        return i instanceof r
          ? i
          : new r(function (s) {
              s(i);
            });
      }
      return new (r || (r = Promise))(function (i, s) {
        function a(u) {
          try {
            c(n.next(u));
          } catch (p) {
            s(p);
          }
        }
        function l(u) {
          try {
            c(n.throw(u));
          } catch (p) {
            s(p);
          }
        }
        function c(u) {
          u.done ? i(u.value) : o(u.value).then(a, l);
        }
        c((n = n.apply(t, e || [])).next());
      });
    };
  Object.defineProperty(Zu, "__esModule", { value: !0 });
  Zu.SocksClientError = Zu.SocksClient = void 0;
  var jPt = require("events"),
    _y = require("net"),
    ci = UIe(),
    ae = FV(),
    Bi = ake(),
    zPt = lke(),
    e6 = UV();
  Object.defineProperty(Zu, "SocksClientError", {
    enumerable: !0,
    get: function () {
      return e6.SocksClientError;
    },
  });
  var QV = XV(),
    t6 = class t extends jPt.EventEmitter {
      constructor(e) {
        (super(),
          (this.options = Object.assign({}, e)),
          (0, Bi.validateSocksClientOptions)(e),
          this.setState(ae.SocksClientState.Created));
      }
      static createConnection(e, r) {
        return new Promise((n, o) => {
          try {
            (0, Bi.validateSocksClientOptions)(e, ["connect"]);
          } catch (s) {
            return typeof r == "function" ? (r(s), n(s)) : o(s);
          }
          let i = new t(e);
          (i.connect(e.existing_socket),
            i.once("established", (s) => {
              (i.removeAllListeners(), typeof r == "function" && r(null, s), n(s));
            }),
            i.once("error", (s) => {
              (i.removeAllListeners(), typeof r == "function" ? (r(s), n(s)) : o(s));
            }));
        });
      }
      static createConnectionChain(e, r) {
        return new Promise((n, o) =>
          wy(this, void 0, void 0, function* () {
            try {
              (0, Bi.validateSocksClientChainOptions)(e);
            } catch (i) {
              return typeof r == "function" ? (r(i), n(i)) : o(i);
            }
            e.randomizeChain && (0, e6.shuffleArray)(e.proxies);
            try {
              let i;
              for (let s = 0; s < e.proxies.length; s++) {
                let a = e.proxies[s],
                  l =
                    s === e.proxies.length - 1
                      ? e.destination
                      : {
                          host: e.proxies[s + 1].host || e.proxies[s + 1].ipaddress,
                          port: e.proxies[s + 1].port,
                        },
                  c = yield t.createConnection({
                    command: "connect",
                    proxy: a,
                    destination: l,
                    existing_socket: i,
                  });
                i = i || c.socket;
              }
              typeof r == "function"
                ? (r(null, { socket: i }), n({ socket: i }))
                : n({ socket: i });
            } catch (i) {
              typeof r == "function" ? (r(i), n(i)) : o(i);
            }
          }),
        );
      }
      static createUDPFrame(e) {
        let r = new ci.SmartBuffer();
        return (
          r.writeUInt16BE(0),
          r.writeUInt8(e.frameNumber || 0),
          _y.isIPv4(e.remoteHost.host)
            ? (r.writeUInt8(ae.Socks5HostType.IPv4),
              r.writeUInt32BE((0, Bi.ipv4ToInt32)(e.remoteHost.host)))
            : _y.isIPv6(e.remoteHost.host)
              ? (r.writeUInt8(ae.Socks5HostType.IPv6),
                r.writeBuffer((0, Bi.ipToBuffer)(e.remoteHost.host)))
              : (r.writeUInt8(ae.Socks5HostType.Hostname),
                r.writeUInt8(Buffer.byteLength(e.remoteHost.host)),
                r.writeString(e.remoteHost.host)),
          r.writeUInt16BE(e.remoteHost.port),
          r.writeBuffer(e.data),
          r.toBuffer()
        );
      }
      static parseUDPFrame(e) {
        let r = ci.SmartBuffer.fromBuffer(e);
        r.readOffset = 2;
        let n = r.readUInt8(),
          o = r.readUInt8(),
          i;
        o === ae.Socks5HostType.IPv4
          ? (i = (0, Bi.int32ToIpv4)(r.readUInt32BE()))
          : o === ae.Socks5HostType.IPv6
            ? (i = QV.Address6.fromByteArray(Array.from(r.readBuffer(16))).canonicalForm())
            : (i = r.readString(r.readUInt8()));
        let s = r.readUInt16BE();
        return { frameNumber: n, remoteHost: { host: i, port: s }, data: r.readBuffer() };
      }
      setState(e) {
        this.state !== ae.SocksClientState.Error && (this.state = e);
      }
      connect(e) {
        ((this.onDataReceived = (n) => this.onDataReceivedHandler(n)),
          (this.onClose = () => this.onCloseHandler()),
          (this.onError = (n) => this.onErrorHandler(n)),
          (this.onConnect = () => this.onConnectHandler()));
        let r = setTimeout(
          () => this.onEstablishedTimeout(),
          this.options.timeout || ae.DEFAULT_TIMEOUT,
        );
        (r.unref && typeof r.unref == "function" && r.unref(),
          e ? (this.socket = e) : (this.socket = new _y.Socket()),
          this.socket.once("close", this.onClose),
          this.socket.once("error", this.onError),
          this.socket.once("connect", this.onConnect),
          this.socket.on("data", this.onDataReceived),
          this.setState(ae.SocksClientState.Connecting),
          (this.receiveBuffer = new zPt.ReceiveBuffer()),
          e
            ? this.socket.emit("connect")
            : (this.socket.connect(this.getSocketOptions()),
              this.options.set_tcp_nodelay !== void 0 &&
                this.options.set_tcp_nodelay !== null &&
                this.socket.setNoDelay(!!this.options.set_tcp_nodelay)),
          this.prependOnceListener("established", (n) => {
            setImmediate(() => {
              if (this.receiveBuffer.length > 0) {
                let o = this.receiveBuffer.get(this.receiveBuffer.length);
                n.socket.emit("data", o);
              }
              n.socket.resume();
            });
          }));
      }
      getSocketOptions() {
        return Object.assign(Object.assign({}, this.options.socket_options), {
          host: this.options.proxy.host || this.options.proxy.ipaddress,
          port: this.options.proxy.port,
        });
      }
      onEstablishedTimeout() {
        this.state !== ae.SocksClientState.Established &&
          this.state !== ae.SocksClientState.BoundWaitingForConnection &&
          this.closeSocket(ae.ERRORS.ProxyConnectionTimedOut);
      }
      onConnectHandler() {
        (this.setState(ae.SocksClientState.Connected),
          this.options.proxy.type === 4
            ? this.sendSocks4InitialHandshake()
            : this.sendSocks5InitialHandshake(),
          this.setState(ae.SocksClientState.SentInitialHandshake));
      }
      onDataReceivedHandler(e) {
        (this.receiveBuffer.append(e), this.processData());
      }
      processData() {
        for (
          ;
          this.state !== ae.SocksClientState.Established &&
          this.state !== ae.SocksClientState.Error &&
          this.receiveBuffer.length >= this.nextRequiredPacketBufferSize;

        )
          if (this.state === ae.SocksClientState.SentInitialHandshake)
            this.options.proxy.type === 4
              ? this.handleSocks4FinalHandshakeResponse()
              : this.handleInitialSocks5HandshakeResponse();
          else if (this.state === ae.SocksClientState.SentAuthentication)
            this.handleInitialSocks5AuthenticationHandshakeResponse();
          else if (this.state === ae.SocksClientState.SentFinalHandshake)
            this.handleSocks5FinalHandshakeResponse();
          else if (this.state === ae.SocksClientState.BoundWaitingForConnection)
            this.options.proxy.type === 4
              ? this.handleSocks4IncomingConnectionResponse()
              : this.handleSocks5IncomingConnectionResponse();
          else {
            this.closeSocket(ae.ERRORS.InternalError);
            break;
          }
      }
      onCloseHandler() {
        this.closeSocket(ae.ERRORS.SocketClosed);
      }
      onErrorHandler(e) {
        this.closeSocket(e.message);
      }
      removeInternalSocketHandlers() {
        (this.socket.pause(),
          this.socket.removeListener("data", this.onDataReceived),
          this.socket.removeListener("close", this.onClose),
          this.socket.removeListener("error", this.onError),
          this.socket.removeListener("connect", this.onConnect));
      }
      closeSocket(e) {
        this.state !== ae.SocksClientState.Error &&
          (this.setState(ae.SocksClientState.Error),
          this.socket.destroy(),
          this.removeInternalSocketHandlers(),
          this.emit("error", new e6.SocksClientError(e, this.options)));
      }
      sendSocks4InitialHandshake() {
        let e = this.options.proxy.userId || "",
          r = new ci.SmartBuffer();
        (r.writeUInt8(4),
          r.writeUInt8(ae.SocksCommand[this.options.command]),
          r.writeUInt16BE(this.options.destination.port),
          _y.isIPv4(this.options.destination.host)
            ? (r.writeBuffer((0, Bi.ipToBuffer)(this.options.destination.host)), r.writeStringNT(e))
            : (r.writeUInt8(0),
              r.writeUInt8(0),
              r.writeUInt8(0),
              r.writeUInt8(1),
              r.writeStringNT(e),
              r.writeStringNT(this.options.destination.host)),
          (this.nextRequiredPacketBufferSize = ae.SOCKS_INCOMING_PACKET_SIZES.Socks4Response),
          this.socket.write(r.toBuffer()));
      }
      handleSocks4FinalHandshakeResponse() {
        let e = this.receiveBuffer.get(8);
        if (e[1] !== ae.Socks4Response.Granted)
          this.closeSocket(
            `${ae.ERRORS.Socks4ProxyRejectedConnection} - (${ae.Socks4Response[e[1]]})`,
          );
        else if (ae.SocksCommand[this.options.command] === ae.SocksCommand.bind) {
          let r = ci.SmartBuffer.fromBuffer(e);
          r.readOffset = 2;
          let n = { port: r.readUInt16BE(), host: (0, Bi.int32ToIpv4)(r.readUInt32BE()) };
          (n.host === "0.0.0.0" && (n.host = this.options.proxy.ipaddress),
            this.setState(ae.SocksClientState.BoundWaitingForConnection),
            this.emit("bound", { remoteHost: n, socket: this.socket }));
        } else
          (this.setState(ae.SocksClientState.Established),
            this.removeInternalSocketHandlers(),
            this.emit("established", { socket: this.socket }));
      }
      handleSocks4IncomingConnectionResponse() {
        let e = this.receiveBuffer.get(8);
        if (e[1] !== ae.Socks4Response.Granted)
          this.closeSocket(
            `${ae.ERRORS.Socks4ProxyRejectedIncomingBoundConnection} - (${ae.Socks4Response[e[1]]})`,
          );
        else {
          let r = ci.SmartBuffer.fromBuffer(e);
          r.readOffset = 2;
          let n = { port: r.readUInt16BE(), host: (0, Bi.int32ToIpv4)(r.readUInt32BE()) };
          (this.setState(ae.SocksClientState.Established),
            this.removeInternalSocketHandlers(),
            this.emit("established", { remoteHost: n, socket: this.socket }));
        }
      }
      sendSocks5InitialHandshake() {
        let e = new ci.SmartBuffer(),
          r = [ae.Socks5Auth.NoAuth];
        ((this.options.proxy.userId || this.options.proxy.password) &&
          r.push(ae.Socks5Auth.UserPass),
          this.options.proxy.custom_auth_method !== void 0 &&
            r.push(this.options.proxy.custom_auth_method),
          e.writeUInt8(5),
          e.writeUInt8(r.length));
        for (let n of r) e.writeUInt8(n);
        ((this.nextRequiredPacketBufferSize =
          ae.SOCKS_INCOMING_PACKET_SIZES.Socks5InitialHandshakeResponse),
          this.socket.write(e.toBuffer()),
          this.setState(ae.SocksClientState.SentInitialHandshake));
      }
      handleInitialSocks5HandshakeResponse() {
        let e = this.receiveBuffer.get(2);
        e[0] !== 5
          ? this.closeSocket(ae.ERRORS.InvalidSocks5IntiailHandshakeSocksVersion)
          : e[1] === ae.SOCKS5_NO_ACCEPTABLE_AUTH
            ? this.closeSocket(ae.ERRORS.InvalidSocks5InitialHandshakeNoAcceptedAuthType)
            : e[1] === ae.Socks5Auth.NoAuth
              ? ((this.socks5ChosenAuthType = ae.Socks5Auth.NoAuth),
                this.sendSocks5CommandRequest())
              : e[1] === ae.Socks5Auth.UserPass
                ? ((this.socks5ChosenAuthType = ae.Socks5Auth.UserPass),
                  this.sendSocks5UserPassAuthentication())
                : e[1] === this.options.proxy.custom_auth_method
                  ? ((this.socks5ChosenAuthType = this.options.proxy.custom_auth_method),
                    this.sendSocks5CustomAuthentication())
                  : this.closeSocket(ae.ERRORS.InvalidSocks5InitialHandshakeUnknownAuthType);
      }
      sendSocks5UserPassAuthentication() {
        let e = this.options.proxy.userId || "",
          r = this.options.proxy.password || "",
          n = new ci.SmartBuffer();
        (n.writeUInt8(1),
          n.writeUInt8(Buffer.byteLength(e)),
          n.writeString(e),
          n.writeUInt8(Buffer.byteLength(r)),
          n.writeString(r),
          (this.nextRequiredPacketBufferSize =
            ae.SOCKS_INCOMING_PACKET_SIZES.Socks5UserPassAuthenticationResponse),
          this.socket.write(n.toBuffer()),
          this.setState(ae.SocksClientState.SentAuthentication));
      }
      sendSocks5CustomAuthentication() {
        return wy(this, void 0, void 0, function* () {
          ((this.nextRequiredPacketBufferSize = this.options.proxy.custom_auth_response_size),
            this.socket.write(yield this.options.proxy.custom_auth_request_handler()),
            this.setState(ae.SocksClientState.SentAuthentication));
        });
      }
      handleSocks5CustomAuthHandshakeResponse(e) {
        return wy(this, void 0, void 0, function* () {
          return yield this.options.proxy.custom_auth_response_handler(e);
        });
      }
      handleSocks5AuthenticationNoAuthHandshakeResponse(e) {
        return wy(this, void 0, void 0, function* () {
          return e[1] === 0;
        });
      }
      handleSocks5AuthenticationUserPassHandshakeResponse(e) {
        return wy(this, void 0, void 0, function* () {
          return e[1] === 0;
        });
      }
      handleInitialSocks5AuthenticationHandshakeResponse() {
        return wy(this, void 0, void 0, function* () {
          this.setState(ae.SocksClientState.ReceivedAuthenticationResponse);
          let e = !1;
          (this.socks5ChosenAuthType === ae.Socks5Auth.NoAuth
            ? (e = yield this.handleSocks5AuthenticationNoAuthHandshakeResponse(
                this.receiveBuffer.get(2),
              ))
            : this.socks5ChosenAuthType === ae.Socks5Auth.UserPass
              ? (e = yield this.handleSocks5AuthenticationUserPassHandshakeResponse(
                  this.receiveBuffer.get(2),
                ))
              : this.socks5ChosenAuthType === this.options.proxy.custom_auth_method &&
                (e = yield this.handleSocks5CustomAuthHandshakeResponse(
                  this.receiveBuffer.get(this.options.proxy.custom_auth_response_size),
                )),
            e
              ? this.sendSocks5CommandRequest()
              : this.closeSocket(ae.ERRORS.Socks5AuthenticationFailed));
        });
      }
      sendSocks5CommandRequest() {
        let e = new ci.SmartBuffer();
        (e.writeUInt8(5),
          e.writeUInt8(ae.SocksCommand[this.options.command]),
          e.writeUInt8(0),
          _y.isIPv4(this.options.destination.host)
            ? (e.writeUInt8(ae.Socks5HostType.IPv4),
              e.writeBuffer((0, Bi.ipToBuffer)(this.options.destination.host)))
            : _y.isIPv6(this.options.destination.host)
              ? (e.writeUInt8(ae.Socks5HostType.IPv6),
                e.writeBuffer((0, Bi.ipToBuffer)(this.options.destination.host)))
              : (e.writeUInt8(ae.Socks5HostType.Hostname),
                e.writeUInt8(this.options.destination.host.length),
                e.writeString(this.options.destination.host)),
          e.writeUInt16BE(this.options.destination.port),
          (this.nextRequiredPacketBufferSize = ae.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHeader),
          this.socket.write(e.toBuffer()),
          this.setState(ae.SocksClientState.SentFinalHandshake));
      }
      handleSocks5FinalHandshakeResponse() {
        let e = this.receiveBuffer.peek(5);
        if (e[0] !== 5 || e[1] !== ae.Socks5Response.Granted)
          this.closeSocket(
            `${ae.ERRORS.InvalidSocks5FinalHandshakeRejected} - ${ae.Socks5Response[e[1]]}`,
          );
        else {
          let r = e[3],
            n,
            o;
          if (r === ae.Socks5HostType.IPv4) {
            let i = ae.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv4;
            if (this.receiveBuffer.length < i) {
              this.nextRequiredPacketBufferSize = i;
              return;
            }
            ((o = ci.SmartBuffer.fromBuffer(this.receiveBuffer.get(i).slice(4))),
              (n = { host: (0, Bi.int32ToIpv4)(o.readUInt32BE()), port: o.readUInt16BE() }),
              n.host === "0.0.0.0" && (n.host = this.options.proxy.ipaddress));
          } else if (r === ae.Socks5HostType.Hostname) {
            let i = e[4],
              s = ae.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHostname(i);
            if (this.receiveBuffer.length < s) {
              this.nextRequiredPacketBufferSize = s;
              return;
            }
            ((o = ci.SmartBuffer.fromBuffer(this.receiveBuffer.get(s).slice(5))),
              (n = { host: o.readString(i), port: o.readUInt16BE() }));
          } else if (r === ae.Socks5HostType.IPv6) {
            let i = ae.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv6;
            if (this.receiveBuffer.length < i) {
              this.nextRequiredPacketBufferSize = i;
              return;
            }
            ((o = ci.SmartBuffer.fromBuffer(this.receiveBuffer.get(i).slice(4))),
              (n = {
                host: QV.Address6.fromByteArray(Array.from(o.readBuffer(16))).canonicalForm(),
                port: o.readUInt16BE(),
              }));
          }
          (this.setState(ae.SocksClientState.ReceivedFinalResponse),
            ae.SocksCommand[this.options.command] === ae.SocksCommand.connect
              ? (this.setState(ae.SocksClientState.Established),
                this.removeInternalSocketHandlers(),
                this.emit("established", { remoteHost: n, socket: this.socket }))
              : ae.SocksCommand[this.options.command] === ae.SocksCommand.bind
                ? (this.setState(ae.SocksClientState.BoundWaitingForConnection),
                  (this.nextRequiredPacketBufferSize =
                    ae.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHeader),
                  this.emit("bound", { remoteHost: n, socket: this.socket }))
                : ae.SocksCommand[this.options.command] === ae.SocksCommand.associate &&
                  (this.setState(ae.SocksClientState.Established),
                  this.removeInternalSocketHandlers(),
                  this.emit("established", { remoteHost: n, socket: this.socket })));
        }
      }
      handleSocks5IncomingConnectionResponse() {
        let e = this.receiveBuffer.peek(5);
        if (e[0] !== 5 || e[1] !== ae.Socks5Response.Granted)
          this.closeSocket(
            `${ae.ERRORS.Socks5ProxyRejectedIncomingBoundConnection} - ${ae.Socks5Response[e[1]]}`,
          );
        else {
          let r = e[3],
            n,
            o;
          if (r === ae.Socks5HostType.IPv4) {
            let i = ae.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv4;
            if (this.receiveBuffer.length < i) {
              this.nextRequiredPacketBufferSize = i;
              return;
            }
            ((o = ci.SmartBuffer.fromBuffer(this.receiveBuffer.get(i).slice(4))),
              (n = { host: (0, Bi.int32ToIpv4)(o.readUInt32BE()), port: o.readUInt16BE() }),
              n.host === "0.0.0.0" && (n.host = this.options.proxy.ipaddress));
          } else if (r === ae.Socks5HostType.Hostname) {
            let i = e[4],
              s = ae.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHostname(i);
            if (this.receiveBuffer.length < s) {
              this.nextRequiredPacketBufferSize = s;
              return;
            }
            ((o = ci.SmartBuffer.fromBuffer(this.receiveBuffer.get(s).slice(5))),
              (n = { host: o.readString(i), port: o.readUInt16BE() }));
          } else if (r === ae.Socks5HostType.IPv6) {
            let i = ae.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv6;
            if (this.receiveBuffer.length < i) {
              this.nextRequiredPacketBufferSize = i;
              return;
            }
            ((o = ci.SmartBuffer.fromBuffer(this.receiveBuffer.get(i).slice(4))),
              (n = {
                host: QV.Address6.fromByteArray(Array.from(o.readBuffer(16))).canonicalForm(),
                port: o.readUInt16BE(),
              }));
          }
          (this.setState(ae.SocksClientState.Established),
            this.removeInternalSocketHandlers(),
            this.emit("established", { remoteHost: n, socket: this.socket }));
        }
      }
      get socksClientOptions() {
        return Object.assign({}, this.options);
      }
    };
  Zu.SocksClient = t6;
});
var uke = A((Im) => {
  "use strict";
  var VPt =
      (Im && Im.__createBinding) ||
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
    KPt =
      (Im && Im.__exportStar) ||
      function (t, e) {
        for (var r in t)
          r !== "default" && !Object.prototype.hasOwnProperty.call(e, r) && VPt(e, t, r);
      };
  Object.defineProperty(Im, "__esModule", { value: !0 });
  KPt(cke(), Im);
});
var mke = A((ui) => {
  "use strict";
  var ZPt =
      (ui && ui.__createBinding) ||
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
    XPt =
      (ui && ui.__setModuleDefault) ||
      (Object.create
        ? function (t, e) {
            Object.defineProperty(t, "default", { enumerable: !0, value: e });
          }
        : function (t, e) {
            t.default = e;
          }),
    dke =
      (ui && ui.__importStar) ||
      function (t) {
        if (t && t.__esModule) return t;
        var e = {};
        if (t != null)
          for (var r in t)
            r !== "default" && Object.prototype.hasOwnProperty.call(t, r) && ZPt(e, t, r);
        return (XPt(e, t), e);
      };
  Object.defineProperty(ui, "__esModule", { value: !0 });
  ui.req = ui.json = ui.toBuffer = void 0;
  var YPt = dke(require("http")),
    JPt = dke(require("https"));
  async function pke(t) {
    let e = 0,
      r = [];
    for await (let n of t) ((e += n.length), r.push(n));
    return Buffer.concat(r, e);
  }
  ui.toBuffer = pke;
  async function QPt(t) {
    let r = (await pke(t)).toString("utf8");
    try {
      return JSON.parse(r);
    } catch (n) {
      let o = n;
      throw ((o.message += ` (input: ${r})`), o);
    }
  }
  ui.json = QPt;
  function eIt(t, e = {}) {
    let n = ((typeof t == "string" ? t : t.href).startsWith("https:") ? JPt : YPt).request(t, e),
      o = new Promise((i, s) => {
        n.once("response", i).once("error", s).end();
      });
    return ((n.then = o.then.bind(o)), n);
  }
  ui.req = eIt;
});
var yke = A((Fi) => {
  "use strict";
  var hke =
      (Fi && Fi.__createBinding) ||
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
    tIt =
      (Fi && Fi.__setModuleDefault) ||
      (Object.create
        ? function (t, e) {
            Object.defineProperty(t, "default", { enumerable: !0, value: e });
          }
        : function (t, e) {
            t.default = e;
          }),
    gke =
      (Fi && Fi.__importStar) ||
      function (t) {
        if (t && t.__esModule) return t;
        var e = {};
        if (t != null)
          for (var r in t)
            r !== "default" && Object.prototype.hasOwnProperty.call(t, r) && hke(e, t, r);
        return (tIt(e, t), e);
      },
    rIt =
      (Fi && Fi.__exportStar) ||
      function (t, e) {
        for (var r in t)
          r !== "default" && !Object.prototype.hasOwnProperty.call(e, r) && hke(e, t, r);
      };
  Object.defineProperty(Fi, "__esModule", { value: !0 });
  Fi.Agent = void 0;
  var nIt = gke(require("net")),
    fke = gke(require("http")),
    oIt = require("https");
  rIt(mke(), Fi);
  var Za = Symbol("AgentBaseInternalState"),
    r6 = class extends fke.Agent {
      constructor(e) {
        (super(e), (this[Za] = {}));
      }
      isSecureEndpoint(e) {
        if (e) {
          if (typeof e.secureEndpoint == "boolean") return e.secureEndpoint;
          if (typeof e.protocol == "string") return e.protocol === "https:";
        }
        let { stack: r } = new Error();
        return typeof r != "string"
          ? !1
          : r
              .split(
                `
`,
              )
              .some((n) => n.indexOf("(https.js:") !== -1 || n.indexOf("node:https:") !== -1);
      }
      incrementSockets(e) {
        if (this.maxSockets === 1 / 0 && this.maxTotalSockets === 1 / 0) return null;
        this.sockets[e] || (this.sockets[e] = []);
        let r = new nIt.Socket({ writable: !1 });
        return (this.sockets[e].push(r), this.totalSocketCount++, r);
      }
      decrementSockets(e, r) {
        if (!this.sockets[e] || r === null) return;
        let n = this.sockets[e],
          o = n.indexOf(r);
        o !== -1 &&
          (n.splice(o, 1), this.totalSocketCount--, n.length === 0 && delete this.sockets[e]);
      }
      getName(e) {
        return (typeof e.secureEndpoint == "boolean" ? e.secureEndpoint : this.isSecureEndpoint(e))
          ? oIt.Agent.prototype.getName.call(this, e)
          : super.getName(e);
      }
      createSocket(e, r, n) {
        let o = { ...r, secureEndpoint: this.isSecureEndpoint(r) },
          i = this.getName(o),
          s = this.incrementSockets(i);
        Promise.resolve()
          .then(() => this.connect(e, o))
          .then(
            (a) => {
              if ((this.decrementSockets(i, s), a instanceof fke.Agent))
                try {
                  return a.addRequest(e, o);
                } catch (l) {
                  return n(l);
                }
              ((this[Za].currentSocket = a), super.createSocket(e, r, n));
            },
            (a) => {
              (this.decrementSockets(i, s), n(a));
            },
          );
      }
      createConnection() {
        let e = this[Za].currentSocket;
        if (((this[Za].currentSocket = void 0), !e))
          throw new Error("No socket was returned in the `connect()` function");
        return e;
      }
      get defaultPort() {
        return this[Za].defaultPort ?? (this.protocol === "https:" ? 443 : 80);
      }
      set defaultPort(e) {
        this[Za] && (this[Za].defaultPort = e);
      }
      get protocol() {
        return this[Za].protocol ?? (this.isSecureEndpoint() ? "https:" : "http:");
      }
      set protocol(e) {
        this[Za] && (this[Za].protocol = e);
      }
    };
  Fi.Agent = r6;
});
var vke = A((as) => {
  "use strict";
  var iIt =
      (as && as.__createBinding) ||
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
    sIt =
      (as && as.__setModuleDefault) ||
      (Object.create
        ? function (t, e) {
            Object.defineProperty(t, "default", { enumerable: !0, value: e });
          }
        : function (t, e) {
            t.default = e;
          }),
    n6 =
      (as && as.__importStar) ||
      function (t) {
        if (t && t.__esModule) return t;
        var e = {};
        if (t != null)
          for (var r in t)
            r !== "default" && Object.prototype.hasOwnProperty.call(t, r) && iIt(e, t, r);
        return (sIt(e, t), e);
      },
    aIt =
      (as && as.__importDefault) ||
      function (t) {
        return t && t.__esModule ? t : { default: t };
      };
  Object.defineProperty(as, "__esModule", { value: !0 });
  as.SocksProxyAgent = void 0;
  var lIt = uke(),
    cIt = yke(),
    uIt = aIt(qG()),
    dIt = n6(require("dns")),
    pIt = n6(require("net")),
    mIt = n6(require("tls")),
    fIt = require("url"),
    JD = (0, uIt.default)("socks-proxy-agent"),
    hIt = (t) =>
      t.servername === void 0 && t.host && !pIt.isIP(t.host) ? { ...t, servername: t.host } : t;
  function gIt(t) {
    let e = !1,
      r = 5,
      n = t.hostname,
      o = parseInt(t.port, 10) || 1080;
    switch (t.protocol.replace(":", "")) {
      case "socks4":
        ((e = !0), (r = 4));
        break;
      case "socks4a":
        r = 4;
        break;
      case "socks5":
        ((e = !0), (r = 5));
        break;
      case "socks":
        r = 5;
        break;
      case "socks5h":
        r = 5;
        break;
      default:
        throw new TypeError(`A "socks" protocol must be specified! Got: ${String(t.protocol)}`);
    }
    let i = { host: n, port: o, type: r };
    return (
      t.username &&
        Object.defineProperty(i, "userId", {
          value: decodeURIComponent(t.username),
          enumerable: !1,
        }),
      t.password != null &&
        Object.defineProperty(i, "password", {
          value: decodeURIComponent(t.password),
          enumerable: !1,
        }),
      { lookup: e, proxy: i }
    );
  }
  var QD = class extends cIt.Agent {
    constructor(e, r) {
      super(r);
      let n = typeof e == "string" ? new fIt.URL(e) : e,
        { proxy: o, lookup: i } = gIt(n);
      ((this.shouldLookup = i),
        (this.proxy = o),
        (this.timeout = r?.timeout ?? null),
        (this.socketOptions = r?.socketOptions ?? null));
    }
    async connect(e, r) {
      let { shouldLookup: n, proxy: o, timeout: i } = this;
      if (!r.host) throw new Error("No `host` defined!");
      let { host: s } = r,
        { port: a, lookup: l = dIt.lookup } = r;
      n &&
        (s = await new Promise((m, f) => {
          l(s, {}, (h, v) => {
            h ? f(h) : m(v);
          });
        }));
      let c = {
          proxy: o,
          destination: { host: s, port: typeof a == "number" ? a : parseInt(a, 10) },
          command: "connect",
          timeout: i ?? void 0,
          socket_options: this.socketOptions ?? void 0,
        },
        u = (m) => {
          (e.destroy(), p.destroy(), m && m.destroy());
        };
      JD("Creating socks proxy connection: %o", c);
      let { socket: p } = await lIt.SocksClient.createConnection(c);
      if (
        (JD("Successfully created socks proxy connection"),
        i !== null && (p.setTimeout(i), p.on("timeout", () => u())),
        r.secureEndpoint)
      ) {
        JD("Upgrading socket connection to TLS");
        let m = mIt.connect({ ...yIt(hIt(r), "host", "path", "port"), socket: p });
        return (
          m.once("error", (f) => {
            (JD("Socket TLS error", f.message), u(m));
          }),
          m
        );
      }
      return p;
    }
  };
  QD.protocols = ["socks", "socks4", "socks4a", "socks5", "socks5h"];
  as.SocksProxyAgent = QD;
  function yIt(t, ...e) {
    let r = {},
      n;
    for (n in t) e.includes(n) || (r[n] = t[n]);
    return r;
  }
});
var uc = A((rLr, wke) => {
  "use strict";
  var bke = ["nodebuffer", "arraybuffer", "fragments"],
    Ske = typeof Blob < "u";
  Ske && bke.push("blob");
  wke.exports = {
    BINARY_TYPES: bke,
    CLOSE_TIMEOUT: 3e4,
    EMPTY_BUFFER: Buffer.alloc(0),
    GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
    hasBlob: Ske,
    kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
    kListener: Symbol("kListener"),
    kStatusCode: Symbol("status-code"),
    kWebSocket: Symbol("websocket"),
    NOOP: () => {},
  };
});
var Bke = A((nLr, Lke) => {
  var Rke = require("fs"),
    dc = require("path"),
    Eke = require("os"),
    Cke = typeof __webpack_require__ == "function" ? __non_webpack_require__ : require,
    vIt = (process.config && process.config.variables) || {},
    bIt = !!process.env.PREBUILDS_ONLY,
    _ke = process.versions.modules,
    o6 = _It() ? "electron" : wIt() ? "node-webkit" : "node",
    i6 = process.env.npm_config_arch || Eke.arch(),
    s6 = process.env.npm_config_platform || Eke.platform(),
    Tke = process.env.LIBC || (xIt(s6) ? "musl" : "glibc"),
    a6 = process.env.ARM_VERSION || (i6 === "arm64" ? "8" : vIt.arm_version) || "",
    Pke = (process.versions.uv || "").split(".")[0];
  Lke.exports = Xa;
  function Xa(t) {
    return Cke(Xa.resolve(t));
  }
  Xa.resolve = Xa.path = function (t) {
    t = dc.resolve(t || ".");
    try {
      var e = Cke(dc.join(t, "package.json")).name.toUpperCase().replace(/-/g, "_");
      process.env[e + "_PREBUILD"] && (t = process.env[e + "_PREBUILD"]);
    } catch {}
    if (!bIt) {
      var r = xke(dc.join(t, "build/Release"), Ake);
      if (r) return r;
      var n = xke(dc.join(t, "build/Debug"), Ake);
      if (n) return n;
    }
    var o = a(t);
    if (o) return o;
    var i = a(dc.dirname(process.execPath));
    if (i) return i;
    var s = [
      "platform=" + s6,
      "arch=" + i6,
      "runtime=" + o6,
      "abi=" + _ke,
      "uv=" + Pke,
      a6 ? "armv=" + a6 : "",
      "libc=" + Tke,
      "node=" + process.versions.node,
      process.versions.electron ? "electron=" + process.versions.electron : "",
      typeof __webpack_require__ == "function" ? "webpack=true" : "",
    ]
      .filter(Boolean)
      .join(" ");
    throw new Error(
      "No native build was found for " +
        s +
        `
    loaded from: ` +
        t +
        `
`,
    );
    function a(l) {
      var c = l6(dc.join(l, "prebuilds")).map(Ike),
        u = c.filter(kke(s6, i6)).sort(Dke)[0];
      if (u) {
        var p = dc.join(l, "prebuilds", u.name),
          m = l6(p).map(Mke),
          f = m.filter(Oke(o6, _ke)),
          h = f.sort(Nke(o6))[0];
        if (h) return dc.join(p, h.file);
      }
    }
  };
  function l6(t) {
    try {
      return Rke.readdirSync(t);
    } catch {
      return [];
    }
  }
  function xke(t, e) {
    var r = l6(t).filter(e);
    return r[0] && dc.join(t, r[0]);
  }
  function Ake(t) {
    return /\.node$/.test(t);
  }
  function Ike(t) {
    var e = t.split("-");
    if (e.length === 2) {
      var r = e[0],
        n = e[1].split("+");
      if (r && n.length && n.every(Boolean)) return { name: t, platform: r, architectures: n };
    }
  }
  function kke(t, e) {
    return function (r) {
      return r == null || r.platform !== t ? !1 : r.architectures.includes(e);
    };
  }
  function Dke(t, e) {
    return t.architectures.length - e.architectures.length;
  }
  function Mke(t) {
    var e = t.split("."),
      r = e.pop(),
      n = { file: t, specificity: 0 };
    if (r === "node") {
      for (var o = 0; o < e.length; o++) {
        var i = e[o];
        if (i === "node" || i === "electron" || i === "node-webkit") n.runtime = i;
        else if (i === "napi") n.napi = !0;
        else if (i.slice(0, 3) === "abi") n.abi = i.slice(3);
        else if (i.slice(0, 2) === "uv") n.uv = i.slice(2);
        else if (i.slice(0, 4) === "armv") n.armv = i.slice(4);
        else if (i === "glibc" || i === "musl") n.libc = i;
        else continue;
        n.specificity++;
      }
      return n;
    }
  }
  function Oke(t, e) {
    return function (r) {
      return !(
        r == null ||
        (r.runtime && r.runtime !== t && !SIt(r)) ||
        (r.abi && r.abi !== e && !r.napi) ||
        (r.uv && r.uv !== Pke) ||
        (r.armv && r.armv !== a6) ||
        (r.libc && r.libc !== Tke)
      );
    };
  }
  function SIt(t) {
    return t.runtime === "node" && t.napi;
  }
  function Nke(t) {
    return function (e, r) {
      return e.runtime !== r.runtime
        ? e.runtime === t
          ? -1
          : 1
        : e.abi !== r.abi
          ? e.abi
            ? -1
            : 1
          : e.specificity !== r.specificity
            ? e.specificity > r.specificity
              ? -1
              : 1
            : 0;
    };
  }
  function wIt() {
    return !!(process.versions && process.versions.nw);
  }
  function _It() {
    return (process.versions && process.versions.electron) || process.env.ELECTRON_RUN_AS_NODE
      ? !0
      : typeof window < "u" && window.process && window.process.type === "renderer";
  }
  function xIt(t) {
    return t === "linux" && Rke.existsSync("/etc/alpine-release");
  }
  Xa.parseTags = Mke;
  Xa.matchTags = Oke;
  Xa.compareTags = Nke;
  Xa.parseTuple = Ike;
  Xa.matchTuple = kke;
  Xa.compareTuples = Dke;
});
var d6 = A((oLr, u6) => {
  var c6 = typeof __webpack_require__ == "function" ? __non_webpack_require__ : require;
  typeof c6.addon == "function" ? (u6.exports = c6.addon.bind(c6)) : (u6.exports = Bke());
});
var $ke = A((iLr, Fke) => {
  "use strict";
  var AIt = (t, e, r, n, o) => {
      for (var i = 0; i < o; i++) r[n + i] = t[i] ^ e[i & 3];
    },
    RIt = (t, e) => {
      let r = t.length;
      for (var n = 0; n < r; n++) t[n] ^= e[n & 3];
    };
  Fke.exports = { mask: AIt, unmask: RIt };
});
var Uke = A((sLr, p6) => {
  "use strict";
  try {
    p6.exports = d6()(__dirname);
  } catch {
    p6.exports = $ke();
  }
});
var _x = A((aLr, eM) => {
  "use strict";
  var { EMPTY_BUFFER: EIt } = uc(),
    m6 = Buffer[Symbol.species];
  function CIt(t, e) {
    if (t.length === 0) return EIt;
    if (t.length === 1) return t[0];
    let r = Buffer.allocUnsafe(e),
      n = 0;
    for (let o = 0; o < t.length; o++) {
      let i = t[o];
      (r.set(i, n), (n += i.length));
    }
    return n < e ? new m6(r.buffer, r.byteOffset, n) : r;
  }
  function qke(t, e, r, n, o) {
    for (let i = 0; i < o; i++) r[n + i] = t[i] ^ e[i & 3];
  }
  function Gke(t, e) {
    for (let r = 0; r < t.length; r++) t[r] ^= e[r & 3];
  }
  function TIt(t) {
    return t.length === t.buffer.byteLength
      ? t.buffer
      : t.buffer.slice(t.byteOffset, t.byteOffset + t.length);
  }
  function f6(t) {
    if (((f6.readOnly = !0), Buffer.isBuffer(t))) return t;
    let e;
    return (
      t instanceof ArrayBuffer
        ? (e = new m6(t))
        : ArrayBuffer.isView(t)
          ? (e = new m6(t.buffer, t.byteOffset, t.byteLength))
          : ((e = Buffer.from(t)), (f6.readOnly = !1)),
      e
    );
  }
  eM.exports = { concat: CIt, mask: qke, toArrayBuffer: TIt, toBuffer: f6, unmask: Gke };
  if (!process.env.WS_NO_BUFFER_UTIL)
    try {
      let t = Uke();
      ((eM.exports.mask = function (e, r, n, o, i) {
        i < 48 ? qke(e, r, n, o, i) : t.mask(e, r, n, o, i);
      }),
        (eM.exports.unmask = function (e, r) {
          e.length < 32 ? Gke(e, r) : t.unmask(e, r);
        }));
    } catch {}
});
var jke = A((lLr, Hke) => {
  "use strict";
  var Wke = Symbol("kDone"),
    h6 = Symbol("kRun"),
    g6 = class {
      constructor(e) {
        ((this[Wke] = () => {
          (this.pending--, this[h6]());
        }),
          (this.concurrency = e || 1 / 0),
          (this.jobs = []),
          (this.pending = 0));
      }
      add(e) {
        (this.jobs.push(e), this[h6]());
      }
      [h6]() {
        if (this.pending !== this.concurrency && this.jobs.length) {
          let e = this.jobs.shift();
          (this.pending++, e(this[Wke]));
        }
      }
    };
  Hke.exports = g6;
});
var Ry = A((cLr, Zke) => {
  "use strict";
  var xx = require("zlib"),
    zke = _x(),
    PIt = jke(),
    { kStatusCode: Vke } = uc(),
    IIt = Buffer[Symbol.species],
    kIt = Buffer.from([0, 0, 255, 255]),
    rM = Symbol("permessage-deflate"),
    pc = Symbol("total-length"),
    xy = Symbol("callback"),
    Xu = Symbol("buffers"),
    Ay = Symbol("error"),
    tM,
    y6 = class {
      constructor(e) {
        if (
          ((this._options = e || {}),
          (this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024),
          (this._maxPayload = this._options.maxPayload | 0),
          (this._isServer = !!this._options.isServer),
          (this._deflate = null),
          (this._inflate = null),
          (this.params = null),
          !tM)
        ) {
          let r = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
          tM = new PIt(r);
        }
      }
      static get extensionName() {
        return "permessage-deflate";
      }
      offer() {
        let e = {};
        return (
          this._options.serverNoContextTakeover && (e.server_no_context_takeover = !0),
          this._options.clientNoContextTakeover && (e.client_no_context_takeover = !0),
          this._options.serverMaxWindowBits &&
            (e.server_max_window_bits = this._options.serverMaxWindowBits),
          this._options.clientMaxWindowBits
            ? (e.client_max_window_bits = this._options.clientMaxWindowBits)
            : this._options.clientMaxWindowBits == null && (e.client_max_window_bits = !0),
          e
        );
      }
      accept(e) {
        return (
          (e = this.normalizeParams(e)),
          (this.params = this._isServer ? this.acceptAsServer(e) : this.acceptAsClient(e)),
          this.params
        );
      }
      cleanup() {
        if ((this._inflate && (this._inflate.close(), (this._inflate = null)), this._deflate)) {
          let e = this._deflate[xy];
          (this._deflate.close(),
            (this._deflate = null),
            e && e(new Error("The deflate stream was closed while data was being processed")));
        }
      }
      acceptAsServer(e) {
        let r = this._options,
          n = e.find(
            (o) =>
              !(
                (r.serverNoContextTakeover === !1 && o.server_no_context_takeover) ||
                (o.server_max_window_bits &&
                  (r.serverMaxWindowBits === !1 ||
                    (typeof r.serverMaxWindowBits == "number" &&
                      r.serverMaxWindowBits > o.server_max_window_bits))) ||
                (typeof r.clientMaxWindowBits == "number" && !o.client_max_window_bits)
              ),
          );
        if (!n) throw new Error("None of the extension offers can be accepted");
        return (
          r.serverNoContextTakeover && (n.server_no_context_takeover = !0),
          r.clientNoContextTakeover && (n.client_no_context_takeover = !0),
          typeof r.serverMaxWindowBits == "number" &&
            (n.server_max_window_bits = r.serverMaxWindowBits),
          typeof r.clientMaxWindowBits == "number"
            ? (n.client_max_window_bits = r.clientMaxWindowBits)
            : (n.client_max_window_bits === !0 || r.clientMaxWindowBits === !1) &&
              delete n.client_max_window_bits,
          n
        );
      }
      acceptAsClient(e) {
        let r = e[0];
        if (this._options.clientNoContextTakeover === !1 && r.client_no_context_takeover)
          throw new Error('Unexpected parameter "client_no_context_takeover"');
        if (!r.client_max_window_bits)
          typeof this._options.clientMaxWindowBits == "number" &&
            (r.client_max_window_bits = this._options.clientMaxWindowBits);
        else if (
          this._options.clientMaxWindowBits === !1 ||
          (typeof this._options.clientMaxWindowBits == "number" &&
            r.client_max_window_bits > this._options.clientMaxWindowBits)
        )
          throw new Error('Unexpected or invalid parameter "client_max_window_bits"');
        return r;
      }
      normalizeParams(e) {
        return (
          e.forEach((r) => {
            Object.keys(r).forEach((n) => {
              let o = r[n];
              if (o.length > 1) throw new Error(`Parameter "${n}" must have only a single value`);
              if (((o = o[0]), n === "client_max_window_bits")) {
                if (o !== !0) {
                  let i = +o;
                  if (!Number.isInteger(i) || i < 8 || i > 15)
                    throw new TypeError(`Invalid value for parameter "${n}": ${o}`);
                  o = i;
                } else if (!this._isServer)
                  throw new TypeError(`Invalid value for parameter "${n}": ${o}`);
              } else if (n === "server_max_window_bits") {
                let i = +o;
                if (!Number.isInteger(i) || i < 8 || i > 15)
                  throw new TypeError(`Invalid value for parameter "${n}": ${o}`);
                o = i;
              } else if (n === "client_no_context_takeover" || n === "server_no_context_takeover") {
                if (o !== !0) throw new TypeError(`Invalid value for parameter "${n}": ${o}`);
              } else throw new Error(`Unknown parameter "${n}"`);
              r[n] = o;
            });
          }),
          e
        );
      }
      decompress(e, r, n) {
        tM.add((o) => {
          this._decompress(e, r, (i, s) => {
            (o(), n(i, s));
          });
        });
      }
      compress(e, r, n) {
        tM.add((o) => {
          this._compress(e, r, (i, s) => {
            (o(), n(i, s));
          });
        });
      }
      _decompress(e, r, n) {
        let o = this._isServer ? "client" : "server";
        if (!this._inflate) {
          let i = `${o}_max_window_bits`,
            s = typeof this.params[i] != "number" ? xx.Z_DEFAULT_WINDOWBITS : this.params[i];
          ((this._inflate = xx.createInflateRaw({
            ...this._options.zlibInflateOptions,
            windowBits: s,
          })),
            (this._inflate[rM] = this),
            (this._inflate[pc] = 0),
            (this._inflate[Xu] = []),
            this._inflate.on("error", MIt),
            this._inflate.on("data", Kke));
        }
        ((this._inflate[xy] = n),
          this._inflate.write(e),
          r && this._inflate.write(kIt),
          this._inflate.flush(() => {
            let i = this._inflate[Ay];
            if (i) {
              (this._inflate.close(), (this._inflate = null), n(i));
              return;
            }
            let s = zke.concat(this._inflate[Xu], this._inflate[pc]);
            (this._inflate._readableState.endEmitted
              ? (this._inflate.close(), (this._inflate = null))
              : ((this._inflate[pc] = 0),
                (this._inflate[Xu] = []),
                r && this.params[`${o}_no_context_takeover`] && this._inflate.reset()),
              n(null, s));
          }));
      }
      _compress(e, r, n) {
        let o = this._isServer ? "server" : "client";
        if (!this._deflate) {
          let i = `${o}_max_window_bits`,
            s = typeof this.params[i] != "number" ? xx.Z_DEFAULT_WINDOWBITS : this.params[i];
          ((this._deflate = xx.createDeflateRaw({
            ...this._options.zlibDeflateOptions,
            windowBits: s,
          })),
            (this._deflate[pc] = 0),
            (this._deflate[Xu] = []),
            this._deflate.on("data", DIt));
        }
        ((this._deflate[xy] = n),
          this._deflate.write(e),
          this._deflate.flush(xx.Z_SYNC_FLUSH, () => {
            if (!this._deflate) return;
            let i = zke.concat(this._deflate[Xu], this._deflate[pc]);
            (r && (i = new IIt(i.buffer, i.byteOffset, i.length - 4)),
              (this._deflate[xy] = null),
              (this._deflate[pc] = 0),
              (this._deflate[Xu] = []),
              r && this.params[`${o}_no_context_takeover`] && this._deflate.reset(),
              n(null, i));
          }));
      }
    };
  Zke.exports = y6;
  function DIt(t) {
    (this[Xu].push(t), (this[pc] += t.length));
  }
  function Kke(t) {
    if (((this[pc] += t.length), this[rM]._maxPayload < 1 || this[pc] <= this[rM]._maxPayload)) {
      this[Xu].push(t);
      return;
    }
    ((this[Ay] = new RangeError("Max payload size exceeded")),
      (this[Ay].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"),
      (this[Ay][Vke] = 1009),
      this.removeListener("data", Kke),
      this.reset());
  }
  function MIt(t) {
    if (((this[rM]._inflate = null), this[Ay])) {
      this[xy](this[Ay]);
      return;
    }
    ((t[Vke] = 1007), this[xy](t));
  }
});
var Yke = A((uLr, Xke) => {
  "use strict";
  function OIt(t) {
    let e = t.length,
      r = 0;
    for (; r < e; )
      if (!(t[r] & 128)) r++;
      else if ((t[r] & 224) === 192) {
        if (r + 1 === e || (t[r + 1] & 192) !== 128 || (t[r] & 254) === 192) return !1;
        r += 2;
      } else if ((t[r] & 240) === 224) {
        if (
          r + 2 >= e ||
          (t[r + 1] & 192) !== 128 ||
          (t[r + 2] & 192) !== 128 ||
          (t[r] === 224 && (t[r + 1] & 224) === 128) ||
          (t[r] === 237 && (t[r + 1] & 224) === 160)
        )
          return !1;
        r += 3;
      } else if ((t[r] & 248) === 240) {
        if (
          r + 3 >= e ||
          (t[r + 1] & 192) !== 128 ||
          (t[r + 2] & 192) !== 128 ||
          (t[r + 3] & 192) !== 128 ||
          (t[r] === 240 && (t[r + 1] & 240) === 128) ||
          (t[r] === 244 && t[r + 1] > 143) ||
          t[r] > 244
        )
          return !1;
        r += 4;
      } else return !1;
    return !0;
  }
  Xke.exports = OIt;
});
var Jke = A((dLr, v6) => {
  "use strict";
  try {
    v6.exports = d6()(__dirname);
  } catch {
    v6.exports = Yke();
  }
});
var Ey = A((pLr, nM) => {
  "use strict";
  var { isUtf8: Qke } = require("buffer"),
    { hasBlob: NIt } = uc(),
    LIt = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
      0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
      0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
      1, 0, 1, 0,
    ];
  function BIt(t) {
    return (
      (t >= 1e3 && t <= 1014 && t !== 1004 && t !== 1005 && t !== 1006) || (t >= 3e3 && t <= 4999)
    );
  }
  function b6(t) {
    let e = t.length,
      r = 0;
    for (; r < e; )
      if (!(t[r] & 128)) r++;
      else if ((t[r] & 224) === 192) {
        if (r + 1 === e || (t[r + 1] & 192) !== 128 || (t[r] & 254) === 192) return !1;
        r += 2;
      } else if ((t[r] & 240) === 224) {
        if (
          r + 2 >= e ||
          (t[r + 1] & 192) !== 128 ||
          (t[r + 2] & 192) !== 128 ||
          (t[r] === 224 && (t[r + 1] & 224) === 128) ||
          (t[r] === 237 && (t[r + 1] & 224) === 160)
        )
          return !1;
        r += 3;
      } else if ((t[r] & 248) === 240) {
        if (
          r + 3 >= e ||
          (t[r + 1] & 192) !== 128 ||
          (t[r + 2] & 192) !== 128 ||
          (t[r + 3] & 192) !== 128 ||
          (t[r] === 240 && (t[r + 1] & 240) === 128) ||
          (t[r] === 244 && t[r + 1] > 143) ||
          t[r] > 244
        )
          return !1;
        r += 4;
      } else return !1;
    return !0;
  }
  function FIt(t) {
    return (
      NIt &&
      typeof t == "object" &&
      typeof t.arrayBuffer == "function" &&
      typeof t.type == "string" &&
      typeof t.stream == "function" &&
      (t[Symbol.toStringTag] === "Blob" || t[Symbol.toStringTag] === "File")
    );
  }
  nM.exports = { isBlob: FIt, isValidStatusCode: BIt, isValidUTF8: b6, tokenChars: LIt };
  if (Qke)
    nM.exports.isValidUTF8 = function (t) {
      return t.length < 24 ? b6(t) : Qke(t);
    };
  else if (!process.env.WS_NO_UTF_8_VALIDATE)
    try {
      let t = Jke();
      nM.exports.isValidUTF8 = function (e) {
        return e.length < 32 ? b6(e) : t(e);
      };
    } catch {}
});
