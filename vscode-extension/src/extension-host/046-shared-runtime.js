var C6e = A((PCn, V3t) => {
  V3t.exports = {
    $id: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
    description: "Meta-schema for $data reference (JSON AnySchema extension proposal)",
    type: "object",
    required: ["$data"],
    properties: {
      $data: {
        type: "string",
        anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }],
      },
    },
    additionalProperties: !1,
  };
});
var dY = A((ICn, M6e) => {
  "use strict";
  var K3t = RegExp.prototype.test.bind(
      /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu,
    ),
    P6e = RegExp.prototype.test.bind(
      /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u,
    ),
    cY = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu),
    I6e = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu),
    Z3t = RegExp.prototype.test.bind(/^[\da-z\-._~!$&'()*+,;=:@/]$/iu);
  function uY(t) {
    let e = "",
      r = 0,
      n = 0;
    for (n = 0; n < t.length; n++)
      if (((r = t[n].charCodeAt(0)), r !== 48)) {
        if (!((r >= 48 && r <= 57) || (r >= 65 && r <= 70) || (r >= 97 && r <= 102))) return "";
        e += t[n];
        break;
      }
    for (n += 1; n < t.length; n++) {
      if (
        ((r = t[n].charCodeAt(0)),
        !((r >= 48 && r <= 57) || (r >= 65 && r <= 70) || (r >= 97 && r <= 102)))
      )
        return "";
      e += t[n];
    }
    return e;
  }
  var X3t = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
  function T6e(t) {
    return ((t.length = 0), !0);
  }
  function Y3t(t, e, r) {
    if (t.length) {
      let n = uY(t);
      if (n !== "") e.push(n);
      else return ((r.error = !0), !1);
      t.length = 0;
    }
    return !0;
  }
  function J3t(t) {
    let e = 0,
      r = { error: !1, address: "", zone: "" },
      n = [],
      o = [],
      i = !1,
      s = !1,
      a = Y3t;
    for (let l = 0; l < t.length; l++) {
      let c = t[l];
      if (!(c === "[" || c === "]"))
        if (c === ":") {
          if ((i === !0 && (s = !0), !a(o, n, r))) break;
          if (++e > 7) {
            r.error = !0;
            break;
          }
          (l > 0 && t[l - 1] === ":" && (i = !0), n.push(":"));
          continue;
        } else if (c === "%") {
          if (!a(o, n, r)) break;
          a = T6e;
        } else {
          o.push(c);
          continue;
        }
    }
    return (
      o.length && (a === T6e ? (r.zone = o.join("")) : s ? n.push(o.join("")) : n.push(uY(o))),
      (r.address = n.join("")),
      r
    );
  }
  function k6e(t) {
    if (Q3t(t, ":") < 2) return { host: t, isIPV6: !1 };
    let e = J3t(t);
    if (e.error) return { host: t, isIPV6: !1 };
    {
      let r = e.address,
        n = e.address;
      return (
        e.zone && ((r += "%" + e.zone), (n += "%25" + e.zone)),
        { host: r, isIPV6: !0, escapedHost: n }
      );
    }
  }
  function Q3t(t, e) {
    let r = 0;
    for (let n = 0; n < t.length; n++) t[n] === e && r++;
    return r;
  }
  function eKt(t) {
    let e = t,
      r = [],
      n = -1,
      o = 0;
    for (; (o = e.length); ) {
      if (o === 1) {
        if (e === ".") break;
        if (e === "/") {
          r.push("/");
          break;
        } else {
          r.push(e);
          break;
        }
      } else if (o === 2) {
        if (e[0] === ".") {
          if (e[1] === ".") break;
          if (e[1] === "/") {
            e = e.slice(2);
            continue;
          }
        } else if (e[0] === "/" && (e[1] === "." || e[1] === "/")) {
          r.push("/");
          break;
        }
      } else if (o === 3 && e === "/..") {
        (r.length !== 0 && r.pop(), r.push("/"));
        break;
      }
      if (e[0] === ".") {
        if (e[1] === ".") {
          if (e[2] === "/") {
            e = e.slice(3);
            continue;
          }
        } else if (e[1] === "/") {
          e = e.slice(2);
          continue;
        }
      } else if (e[0] === "/" && e[1] === ".") {
        if (e[2] === "/") {
          e = e.slice(2);
          continue;
        } else if (e[2] === "." && e[3] === "/") {
          ((e = e.slice(3)), r.length !== 0 && r.pop());
          continue;
        }
      }
      if ((n = e.indexOf("/", 1)) === -1) {
        r.push(e);
        break;
      } else (r.push(e.slice(0, n)), (e = e.slice(n)));
    }
    return r.join("");
  }
  var tKt = { "@": "%40", "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" },
    rKt = /[@/?#:]/g,
    nKt = /[@/?#]/g;
  function D6e(t, e) {
    let r = e ? nKt : rKt;
    return ((r.lastIndex = 0), t.replace(r, (n) => tKt[n]));
  }
  function oKt(t, e = !1) {
    if (t.indexOf("%") === -1) return t;
    let r = "";
    for (let n = 0; n < t.length; n++) {
      if (t[n] === "%" && n + 2 < t.length) {
        let o = t.slice(n + 1, n + 3);
        if (cY(o)) {
          let i = o.toUpperCase(),
            s = String.fromCharCode(parseInt(i, 16));
          (e && I6e(s) ? (r += s) : (r += "%" + i), (n += 2));
          continue;
        }
      }
      r += t[n];
    }
    return r;
  }
  function iKt(t) {
    let e = "";
    for (let r = 0; r < t.length; r++) {
      if (t[r] === "%" && r + 2 < t.length) {
        let n = t.slice(r + 1, r + 3);
        if (cY(n)) {
          let o = n.toUpperCase(),
            i = String.fromCharCode(parseInt(o, 16));
          (i !== "." && I6e(i) ? (e += i) : (e += "%" + o), (r += 2));
          continue;
        }
      }
      Z3t(t[r]) ? (e += t[r]) : (e += escape(t[r]));
    }
    return e;
  }
  function sKt(t) {
    let e = "";
    for (let r = 0; r < t.length; r++) {
      if (t[r] === "%" && r + 2 < t.length) {
        let n = t.slice(r + 1, r + 3);
        if (cY(n)) {
          ((e += "%" + n.toUpperCase()), (r += 2));
          continue;
        }
      }
      e += escape(t[r]);
    }
    return e;
  }
  function aKt(t) {
    let e = [];
    if ((t.userinfo !== void 0 && (e.push(t.userinfo), e.push("@")), t.host !== void 0)) {
      let r = unescape(t.host);
      if (!P6e(r)) {
        let n = k6e(r);
        n.isIPV6 === !0 ? (r = `[${n.escapedHost}]`) : (r = D6e(r, !1));
      }
      e.push(r);
    }
    return (
      (typeof t.port == "number" || typeof t.port == "string") &&
        (e.push(":"), e.push(String(t.port))),
      e.length ? e.join("") : void 0
    );
  }
  M6e.exports = {
    nonSimpleDomain: X3t,
    recomposeAuthority: aKt,
    reescapeHostDelimiters: D6e,
    normalizePercentEncoding: oKt,
    normalizePathEncoding: iKt,
    escapePreservingEscapes: sKt,
    removeDotSegments: eKt,
    isIPv4: P6e,
    isUUID: K3t,
    normalizeIPv6: k6e,
    stringArrayToHexStripped: uY,
  };
});
var F6e = A((kCn, B6e) => {
  "use strict";
  var { isUUID: lKt } = dY(),
    cKt = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu,
    uKt = ["http", "https", "ws", "wss", "urn", "urn:uuid"];
  function dKt(t) {
    return uKt.indexOf(t) !== -1;
  }
  function pY(t) {
    return t.secure === !0
      ? !0
      : t.secure === !1
        ? !1
        : t.scheme
          ? t.scheme.length === 3 &&
            (t.scheme[0] === "w" || t.scheme[0] === "W") &&
            (t.scheme[1] === "s" || t.scheme[1] === "S") &&
            (t.scheme[2] === "s" || t.scheme[2] === "S")
          : !1;
  }
  function O6e(t) {
    return (t.host || (t.error = t.error || "HTTP URIs must have a host."), t);
  }
  function N6e(t) {
    let e = String(t.scheme).toLowerCase() === "https";
    return (
      (t.port === (e ? 443 : 80) || t.port === "") && (t.port = void 0),
      t.path || (t.path = "/"),
      t
    );
  }
  function pKt(t) {
    return (
      (t.secure = pY(t)),
      (t.resourceName = (t.path || "/") + (t.query ? "?" + t.query : "")),
      (t.path = void 0),
      (t.query = void 0),
      t
    );
  }
  function mKt(t) {
    if (
      ((t.port === (pY(t) ? 443 : 80) || t.port === "") && (t.port = void 0),
      typeof t.secure == "boolean" && ((t.scheme = t.secure ? "wss" : "ws"), (t.secure = void 0)),
      t.resourceName)
    ) {
      let [e, r] = t.resourceName.split("?");
      ((t.path = e && e !== "/" ? e : void 0), (t.query = r), (t.resourceName = void 0));
    }
    return ((t.fragment = void 0), t);
  }
  function fKt(t, e) {
    if (!t.path) return ((t.error = "URN can not be parsed"), t);
    let r = t.path.match(cKt);
    if (r) {
      let n = e.scheme || t.scheme || "urn";
      ((t.nid = r[1].toLowerCase()), (t.nss = r[2]));
      let o = `${n}:${e.nid || t.nid}`,
        i = mY(o);
      ((t.path = void 0), i && (t = i.parse(t, e)));
    } else t.error = t.error || "URN can not be parsed.";
    return t;
  }
  function hKt(t, e) {
    if (t.nid === void 0) throw new Error("URN without nid cannot be serialized");
    let r = e.scheme || t.scheme || "urn",
      n = t.nid.toLowerCase(),
      o = `${r}:${e.nid || n}`,
      i = mY(o);
    i && (t = i.serialize(t, e));
    let s = t,
      a = t.nss;
    return ((s.path = `${n || e.nid}:${a}`), (e.skipEscape = !0), s);
  }
  function gKt(t, e) {
    let r = t;
    return (
      (r.uuid = r.nss),
      (r.nss = void 0),
      !e.tolerant && (!r.uuid || !lKt(r.uuid)) && (r.error = r.error || "UUID is not valid."),
      r
    );
  }
  function yKt(t) {
    let e = t;
    return ((e.nss = (t.uuid || "").toLowerCase()), e);
  }
  var L6e = { scheme: "http", domainHost: !0, parse: O6e, serialize: N6e },
    vKt = { scheme: "https", domainHost: L6e.domainHost, parse: O6e, serialize: N6e },
    bB = { scheme: "ws", domainHost: !0, parse: pKt, serialize: mKt },
    bKt = { scheme: "wss", domainHost: bB.domainHost, parse: bB.parse, serialize: bB.serialize },
    SKt = { scheme: "urn", parse: fKt, serialize: hKt, skipNormalize: !0 },
    wKt = { scheme: "urn:uuid", parse: gKt, serialize: yKt, skipNormalize: !0 },
    SB = { http: L6e, https: vKt, ws: bB, wss: bKt, urn: SKt, "urn:uuid": wKt };
  Object.setPrototypeOf(SB, null);
  function mY(t) {
    return (t && (SB[t] || SB[t.toLowerCase()])) || void 0;
  }
  B6e.exports = { wsIsSecure: pY, SCHEMES: SB, isValidSchemeName: dKt, getSchemeHandler: mY };
});
var H6e = A((DCn, wB) => {
  "use strict";
  var {
      normalizeIPv6: _Kt,
      removeDotSegments: ZR,
      recomposeAuthority: xKt,
      normalizePercentEncoding: AKt,
      normalizePathEncoding: RKt,
      escapePreservingEscapes: EKt,
      reescapeHostDelimiters: CKt,
      isIPv4: TKt,
      nonSimpleDomain: PKt,
    } = dY(),
    { SCHEMES: IKt, getSchemeHandler: U6e } = F6e();
  function kKt(t, e) {
    return (
      typeof t == "string" ? (t = LKt(t, e)) : typeof t == "object" && (t = pb(Bf(t, e), e)),
      t
    );
  }
  function DKt(t, e, r) {
    let n = r ? Object.assign({ scheme: "null" }, r) : { scheme: "null" },
      o = q6e(pb(t, n), pb(e, n), n, !0);
    return ((n.skipEscape = !0), Bf(o, n));
  }
  function q6e(t, e, r, n) {
    let o = {};
    return (
      n || ((t = pb(Bf(t, r), r)), (e = pb(Bf(e, r), r))),
      (r = r || {}),
      !r.tolerant && e.scheme
        ? ((o.scheme = e.scheme),
          (o.userinfo = e.userinfo),
          (o.host = e.host),
          (o.port = e.port),
          (o.path = ZR(e.path || "")),
          (o.query = e.query))
        : (e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0
            ? ((o.userinfo = e.userinfo),
              (o.host = e.host),
              (o.port = e.port),
              (o.path = ZR(e.path || "")),
              (o.query = e.query))
            : (e.path
                ? (e.path[0] === "/"
                    ? (o.path = ZR(e.path))
                    : ((t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0) && !t.path
                        ? (o.path = "/" + e.path)
                        : t.path
                          ? (o.path = t.path.slice(0, t.path.lastIndexOf("/") + 1) + e.path)
                          : (o.path = e.path),
                      (o.path = ZR(o.path))),
                  (o.query = e.query))
                : ((o.path = t.path),
                  e.query !== void 0 ? (o.query = e.query) : (o.query = t.query)),
              (o.userinfo = t.userinfo),
              (o.host = t.host),
              (o.port = t.port)),
          (o.scheme = t.scheme)),
      (o.fragment = e.fragment),
      o
    );
  }
  function MKt(t, e, r) {
    let n = $6e(t, r),
      o = $6e(e, r);
    return n !== void 0 && o !== void 0 && n.toLowerCase() === o.toLowerCase();
  }
  function Bf(t, e) {
    let r = {
        host: t.host,
        scheme: t.scheme,
        userinfo: t.userinfo,
        port: t.port,
        path: t.path,
        query: t.query,
        nid: t.nid,
        nss: t.nss,
        uuid: t.uuid,
        fragment: t.fragment,
        reference: t.reference,
        resourceName: t.resourceName,
        secure: t.secure,
        error: "",
      },
      n = Object.assign({}, e),
      o = [],
      i = U6e(n.scheme || r.scheme);
    (i && i.serialize && i.serialize(r, n),
      r.path !== void 0 &&
        (n.skipEscape
          ? (r.path = AKt(r.path))
          : ((r.path = EKt(r.path)),
            r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))),
      n.reference !== "suffix" && r.scheme && o.push(r.scheme, ":"));
    let s = xKt(r);
    if (
      (s !== void 0 &&
        (n.reference !== "suffix" && o.push("//"),
        o.push(s),
        r.path && r.path[0] !== "/" && o.push("/")),
      r.path !== void 0)
    ) {
      let a = r.path;
      (!n.absolutePath && (!i || !i.absolutePath) && (a = ZR(a)),
        s === void 0 && a[0] === "/" && a[1] === "/" && (a = "/%2F" + a.slice(2)),
        o.push(a));
    }
    return (
      r.query !== void 0 && o.push("?", r.query),
      r.fragment !== void 0 && o.push("#", r.fragment),
      o.join("")
    );
  }
  var OKt =
    /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
  function NKt(t, e) {
    if (e[2] !== void 0 && t.path && t.path[0] !== "/")
      return 'URI path must start with "/" when authority is present.';
    if (typeof t.port == "number" && (t.port < 0 || t.port > 65535))
      return "URI port is malformed.";
  }
  function G6e(t, e) {
    let r = Object.assign({}, e),
      n = {
        scheme: void 0,
        userinfo: void 0,
        host: "",
        port: void 0,
        path: "",
        query: void 0,
        fragment: void 0,
      },
      o = !1,
      i = !1;
    r.reference === "suffix" && (r.scheme ? (t = r.scheme + ":" + t) : (t = "//" + t));
    let s = t.match(OKt);
    if (s) {
      ((n.scheme = s[1]),
        (n.userinfo = s[3]),
        (n.host = s[4]),
        (n.port = parseInt(s[5], 10)),
        (n.path = s[6] || ""),
        (n.query = s[7]),
        (n.fragment = s[8]),
        isNaN(n.port) && (n.port = s[5]));
      let a = NKt(n, s);
      if ((a !== void 0 && ((n.error = n.error || a), (o = !0)), n.host))
        if (TKt(n.host) === !1) {
          let u = _Kt(n.host);
          ((n.host = u.host.toLowerCase()), (i = u.isIPV6));
        } else i = !0;
      (n.scheme === void 0 &&
      n.userinfo === void 0 &&
      n.host === void 0 &&
      n.port === void 0 &&
      n.query === void 0 &&
      !n.path
        ? (n.reference = "same-document")
        : n.scheme === void 0
          ? (n.reference = "relative")
          : n.fragment === void 0
            ? (n.reference = "absolute")
            : (n.reference = "uri"),
        r.reference &&
          r.reference !== "suffix" &&
          r.reference !== n.reference &&
          (n.error = n.error || "URI is not a " + r.reference + " reference."));
      let l = U6e(r.scheme || n.scheme);
      if (
        !r.unicodeSupport &&
        (!l || !l.unicodeSupport) &&
        n.host &&
        (r.domainHost || (l && l.domainHost)) &&
        i === !1 &&
        PKt(n.host)
      )
        try {
          n.host = new URL("http://" + n.host).hostname;
        } catch (c) {
          n.error = n.error || "Host's domain name can not be converted to ASCII: " + c;
        }
      if (
        (!l || (l && !l.skipNormalize)) &&
        (t.indexOf("%") !== -1 &&
          (n.scheme !== void 0 && (n.scheme = unescape(n.scheme)),
          n.host !== void 0 && (n.host = CKt(unescape(n.host), i))),
        n.path && (n.path = RKt(n.path)),
        n.fragment)
      )
        try {
          n.fragment = encodeURI(decodeURIComponent(n.fragment));
        } catch {
          n.error = n.error || "URI malformed";
        }
      l && l.parse && l.parse(n, r);
    } else n.error = n.error || "URI can not be parsed.";
    return { parsed: n, malformedAuthorityOrPort: o };
  }
  function pb(t, e) {
    return G6e(t, e).parsed;
  }
  function LKt(t, e) {
    return W6e(t, e).normalized;
  }
  function W6e(t, e) {
    let { parsed: r, malformedAuthorityOrPort: n } = G6e(t, e);
    return { normalized: n ? t : Bf(r, e), malformedAuthorityOrPort: n };
  }
  function $6e(t, e) {
    if (typeof t == "string") {
      let { normalized: r, malformedAuthorityOrPort: n } = W6e(t, e);
      return n ? void 0 : r;
    }
    if (typeof t == "object") return Bf(t, e);
  }
  var fY = {
    SCHEMES: IKt,
    normalize: kKt,
    resolve: DKt,
    resolveComponent: q6e,
    equal: MKt,
    serialize: Bf,
    parse: pb,
  };
  wB.exports = fY;
  wB.exports.default = fY;
  wB.exports.fastUri = fY;
});
var z6e = A((hY) => {
  "use strict";
  Object.defineProperty(hY, "__esModule", { value: !0 });
  var j6e = H6e();
  j6e.code = 'require("ajv/dist/runtime/uri").default';
  hY.default = j6e;
});
var e3e = A((so) => {
  "use strict";
  Object.defineProperty(so, "__esModule", { value: !0 });
  so.CodeGen = so.Name = so.nil = so.stringify = so.str = so._ = so.KeywordCxt = void 0;
  var BKt = VR();
  Object.defineProperty(so, "KeywordCxt", {
    enumerable: !0,
    get: function () {
      return BKt.KeywordCxt;
    },
  });
  var mb = gt();
  Object.defineProperty(so, "_", {
    enumerable: !0,
    get: function () {
      return mb._;
    },
  });
  Object.defineProperty(so, "str", {
    enumerable: !0,
    get: function () {
      return mb.str;
    },
  });
  Object.defineProperty(so, "stringify", {
    enumerable: !0,
    get: function () {
      return mb.stringify;
    },
  });
  Object.defineProperty(so, "nil", {
    enumerable: !0,
    get: function () {
      return mb.nil;
    },
  });
  Object.defineProperty(so, "Name", {
    enumerable: !0,
    get: function () {
      return mb.Name;
    },
  });
  Object.defineProperty(so, "CodeGen", {
    enumerable: !0,
    get: function () {
      return mb.CodeGen;
    },
  });
  var FKt = gB(),
    Y6e = KR(),
    $Kt = WX(),
    XR = vB(),
    UKt = gt(),
    YR = HR(),
    _B = WR(),
    yY = Ft(),
    V6e = C6e(),
    qKt = z6e(),
    J6e = (t, e) => new RegExp(t, e);
  J6e.code = "new RegExp";
  var GKt = ["removeAdditional", "useDefaults", "coerceTypes"],
    WKt = new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error",
    ]),
    HKt = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats:
        "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now.",
    },
    jKt = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.',
    },
    K6e = 200;
  function zKt(t) {
    var e, r, n, o, i, s, a, l, c, u, p, m, f, h, v, y, w, _, S, E, T, P, M, L, V;
    let de = t.strict,
      ue = (e = t.code) === null || e === void 0 ? void 0 : e.optimize,
      Ae = ue === !0 || ue === void 0 ? 1 : ue || 0,
      ge =
        (n = (r = t.code) === null || r === void 0 ? void 0 : r.regExp) !== null && n !== void 0
          ? n
          : J6e,
      Pe = (o = t.uriResolver) !== null && o !== void 0 ? o : qKt.default;
    return {
      strictSchema:
        (s = (i = t.strictSchema) !== null && i !== void 0 ? i : de) !== null && s !== void 0
          ? s
          : !0,
      strictNumbers:
        (l = (a = t.strictNumbers) !== null && a !== void 0 ? a : de) !== null && l !== void 0
          ? l
          : !0,
      strictTypes:
        (u = (c = t.strictTypes) !== null && c !== void 0 ? c : de) !== null && u !== void 0
          ? u
          : "log",
      strictTuples:
        (m = (p = t.strictTuples) !== null && p !== void 0 ? p : de) !== null && m !== void 0
          ? m
          : "log",
      strictRequired:
        (h = (f = t.strictRequired) !== null && f !== void 0 ? f : de) !== null && h !== void 0
          ? h
          : !1,
      code: t.code ? { ...t.code, optimize: Ae, regExp: ge } : { optimize: Ae, regExp: ge },
      loopRequired: (v = t.loopRequired) !== null && v !== void 0 ? v : K6e,
      loopEnum: (y = t.loopEnum) !== null && y !== void 0 ? y : K6e,
      meta: (w = t.meta) !== null && w !== void 0 ? w : !0,
      messages: (_ = t.messages) !== null && _ !== void 0 ? _ : !0,
      inlineRefs: (S = t.inlineRefs) !== null && S !== void 0 ? S : !0,
      schemaId: (E = t.schemaId) !== null && E !== void 0 ? E : "$id",
      addUsedSchema: (T = t.addUsedSchema) !== null && T !== void 0 ? T : !0,
      validateSchema: (P = t.validateSchema) !== null && P !== void 0 ? P : !0,
      validateFormats: (M = t.validateFormats) !== null && M !== void 0 ? M : !0,
      unicodeRegExp: (L = t.unicodeRegExp) !== null && L !== void 0 ? L : !0,
      int32range: (V = t.int32range) !== null && V !== void 0 ? V : !0,
      uriResolver: Pe,
    };
  }
  var JR = class {
    constructor(e = {}) {
      ((this.schemas = {}),
        (this.refs = {}),
        (this.formats = Object.create(null)),
        (this._compilations = new Set()),
        (this._loading = {}),
        (this._cache = new Map()),
        (e = this.opts = { ...e, ...zKt(e) }));
      let { es5: r, lines: n } = this.opts.code;
      ((this.scope = new UKt.ValueScope({ scope: {}, prefixes: WKt, es5: r, lines: n })),
        (this.logger = JKt(e.logger)));
      let o = e.validateFormats;
      ((e.validateFormats = !1),
        (this.RULES = (0, $Kt.getRules)()),
        Z6e.call(this, HKt, e, "NOT SUPPORTED"),
        Z6e.call(this, jKt, e, "DEPRECATED", "warn"),
        (this._metaOpts = XKt.call(this)),
        e.formats && KKt.call(this),
        this._addVocabularies(),
        this._addDefaultMetaSchema(),
        e.keywords && ZKt.call(this, e.keywords),
        typeof e.meta == "object" && this.addMetaSchema(e.meta),
        VKt.call(this),
        (e.validateFormats = o));
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      let { $data: e, meta: r, schemaId: n } = this.opts,
        o = V6e;
      (n === "id" && ((o = { ...V6e }), (o.id = o.$id), delete o.$id),
        r && e && this.addMetaSchema(o, o[n], !1));
    }
    defaultMeta() {
      let { meta: e, schemaId: r } = this.opts;
      return (this.opts.defaultMeta = typeof e == "object" ? e[r] || e : void 0);
    }
    validate(e, r) {
      let n;
      if (typeof e == "string") {
        if (((n = this.getSchema(e)), !n)) throw new Error(`no schema with key or ref "${e}"`);
      } else n = this.compile(e);
      let o = n(r);
      return ("$async" in n || (this.errors = n.errors), o);
    }
    compile(e, r) {
      let n = this._addSchema(e, r);
      return n.validate || this._compileSchemaEnv(n);
    }
    compileAsync(e, r) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      let { loadSchema: n } = this.opts;
      return o.call(this, e, r);
      async function o(u, p) {
        await i.call(this, u.$schema);
        let m = this._addSchema(u, p);
        return m.validate || s.call(this, m);
      }
      async function i(u) {
        u && !this.getSchema(u) && (await o.call(this, { $ref: u }, !0));
      }
      async function s(u) {
        try {
          return this._compileSchemaEnv(u);
        } catch (p) {
          if (!(p instanceof Y6e.default)) throw p;
          return (a.call(this, p), await l.call(this, p.missingSchema), s.call(this, u));
        }
      }
      function a({ missingSchema: u, missingRef: p }) {
        if (this.refs[u]) throw new Error(`AnySchema ${u} is loaded but ${p} cannot be resolved`);
      }
      async function l(u) {
        let p = await c.call(this, u);
        (this.refs[u] || (await i.call(this, p.$schema)), this.refs[u] || this.addSchema(p, u, r));
      }
      async function c(u) {
        let p = this._loading[u];
        if (p) return p;
        try {
          return await (this._loading[u] = n(u));
        } finally {
          delete this._loading[u];
        }
      }
    }
    addSchema(e, r, n, o = this.opts.validateSchema) {
      if (Array.isArray(e)) {
        for (let s of e) this.addSchema(s, void 0, n, o);
        return this;
      }
      let i;
      if (typeof e == "object") {
        let { schemaId: s } = this.opts;
        if (((i = e[s]), i !== void 0 && typeof i != "string"))
          throw new Error(`schema ${s} must be string`);
      }
      return (
        (r = (0, YR.normalizeId)(r || i)),
        this._checkUnique(r),
        (this.schemas[r] = this._addSchema(e, n, r, o, !0)),
        this
      );
    }
    addMetaSchema(e, r, n = this.opts.validateSchema) {
      return (this.addSchema(e, r, !0, n), this);
    }
    validateSchema(e, r) {
      if (typeof e == "boolean") return !0;
      let n;
      if (((n = e.$schema), n !== void 0 && typeof n != "string"))
        throw new Error("$schema must be a string");
      if (((n = n || this.opts.defaultMeta || this.defaultMeta()), !n))
        return (this.logger.warn("meta-schema not available"), (this.errors = null), !0);
      let o = this.validate(n, e);
      if (!o && r) {
        let i = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log") this.logger.error(i);
        else throw new Error(i);
      }
      return o;
    }
    getSchema(e) {
      let r;
      for (; typeof (r = X6e.call(this, e)) == "string"; ) e = r;
      if (r === void 0) {
        let { schemaId: n } = this.opts,
          o = new XR.SchemaEnv({ schema: {}, schemaId: n });
        if (((r = XR.resolveSchema.call(this, o, e)), !r)) return;
        this.refs[e] = r;
      }
      return r.validate || this._compileSchemaEnv(r);
    }
    removeSchema(e) {
      if (e instanceof RegExp)
        return (
          this._removeAllSchemas(this.schemas, e),
          this._removeAllSchemas(this.refs, e),
          this
        );
      switch (typeof e) {
        case "undefined":
          return (
            this._removeAllSchemas(this.schemas),
            this._removeAllSchemas(this.refs),
            this._cache.clear(),
            this
          );
        case "string": {
          let r = X6e.call(this, e);
          return (
            typeof r == "object" && this._cache.delete(r.schema),
            delete this.schemas[e],
            delete this.refs[e],
            this
          );
        }
        case "object": {
          let r = e;
          this._cache.delete(r);
          let n = e[this.opts.schemaId];
          return (
            n && ((n = (0, YR.normalizeId)(n)), delete this.schemas[n], delete this.refs[n]),
            this
          );
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    addVocabulary(e) {
      for (let r of e) this.addKeyword(r);
      return this;
    }
    addKeyword(e, r) {
      let n;
      if (typeof e == "string")
        ((n = e),
          typeof r == "object" &&
            (this.logger.warn("these parameters are deprecated, see docs for addKeyword"),
            (r.keyword = n)));
      else if (typeof e == "object" && r === void 0) {
        if (((r = e), (n = r.keyword), Array.isArray(n) && !n.length))
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else throw new Error("invalid addKeywords parameters");
      if ((e5t.call(this, n, r), !r)) return ((0, yY.eachItem)(n, (i) => gY.call(this, i)), this);
      r5t.call(this, r);
      let o = {
        ...r,
        type: (0, _B.getJSONTypes)(r.type),
        schemaType: (0, _B.getJSONTypes)(r.schemaType),
      };
      return (
        (0, yY.eachItem)(
          n,
          o.type.length === 0
            ? (i) => gY.call(this, i, o)
            : (i) => o.type.forEach((s) => gY.call(this, i, o, s)),
        ),
        this
      );
    }
    getKeyword(e) {
      let r = this.RULES.all[e];
      return typeof r == "object" ? r.definition : !!r;
    }
    removeKeyword(e) {
      let { RULES: r } = this;
      (delete r.keywords[e], delete r.all[e]);
      for (let n of r.rules) {
        let o = n.rules.findIndex((i) => i.keyword === e);
        o >= 0 && n.rules.splice(o, 1);
      }
      return this;
    }
    addFormat(e, r) {
      return (typeof r == "string" && (r = new RegExp(r)), (this.formats[e] = r), this);
    }
    errorsText(e = this.errors, { separator: r = ", ", dataVar: n = "data" } = {}) {
      return !e || e.length === 0
        ? "No errors"
        : e.map((o) => `${n}${o.instancePath} ${o.message}`).reduce((o, i) => o + r + i);
    }
    $dataMetaSchema(e, r) {
      let n = this.RULES.all;
      e = JSON.parse(JSON.stringify(e));
      for (let o of r) {
        let i = o.split("/").slice(1),
          s = e;
        for (let a of i) s = s[a];
        for (let a in n) {
          let l = n[a];
          if (typeof l != "object") continue;
          let { $data: c } = l.definition,
            u = s[a];
          c && u && (s[a] = Q6e(u));
        }
      }
      return e;
    }
    _removeAllSchemas(e, r) {
      for (let n in e) {
        let o = e[n];
        (!r || r.test(n)) &&
          (typeof o == "string"
            ? delete e[n]
            : o && !o.meta && (this._cache.delete(o.schema), delete e[n]));
      }
    }
    _addSchema(e, r, n, o = this.opts.validateSchema, i = this.opts.addUsedSchema) {
      let s,
        { schemaId: a } = this.opts;
      if (typeof e == "object") s = e[a];
      else {
        if (this.opts.jtd) throw new Error("schema must be object");
        if (typeof e != "boolean") throw new Error("schema must be object or boolean");
      }
      let l = this._cache.get(e);
      if (l !== void 0) return l;
      n = (0, YR.normalizeId)(s || n);
      let c = YR.getSchemaRefs.call(this, e, n);
      return (
        (l = new XR.SchemaEnv({ schema: e, schemaId: a, meta: r, baseId: n, localRefs: c })),
        this._cache.set(l.schema, l),
        i && !n.startsWith("#") && (n && this._checkUnique(n), (this.refs[n] = l)),
        o && this.validateSchema(e, !0),
        l
      );
    }
    _checkUnique(e) {
      if (this.schemas[e] || this.refs[e])
        throw new Error(`schema with key or id "${e}" already exists`);
    }
    _compileSchemaEnv(e) {
      if ((e.meta ? this._compileMetaSchema(e) : XR.compileSchema.call(this, e), !e.validate))
        throw new Error("ajv implementation error");
      return e.validate;
    }
    _compileMetaSchema(e) {
      let r = this.opts;
      this.opts = this._metaOpts;
      try {
        XR.compileSchema.call(this, e);
      } finally {
        this.opts = r;
      }
    }
  };
  JR.ValidationError = FKt.default;
  JR.MissingRefError = Y6e.default;
  so.default = JR;
  function Z6e(t, e, r, n = "error") {
    for (let o in t) {
      let i = o;
      i in e && this.logger[n](`${r}: option ${o}. ${t[i]}`);
    }
  }
  function X6e(t) {
    return ((t = (0, YR.normalizeId)(t)), this.schemas[t] || this.refs[t]);
  }
  function VKt() {
    let t = this.opts.schemas;
    if (t)
      if (Array.isArray(t)) this.addSchema(t);
      else for (let e in t) this.addSchema(t[e], e);
  }
  function KKt() {
    for (let t in this.opts.formats) {
      let e = this.opts.formats[t];
      e && this.addFormat(t, e);
    }
  }
  function ZKt(t) {
    if (Array.isArray(t)) {
      this.addVocabulary(t);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (let e in t) {
      let r = t[e];
      (r.keyword || (r.keyword = e), this.addKeyword(r));
    }
  }
  function XKt() {
    let t = { ...this.opts };
    for (let e of GKt) delete t[e];
    return t;
  }
  var YKt = { log() {}, warn() {}, error() {} };
  function JKt(t) {
    if (t === !1) return YKt;
    if (t === void 0) return console;
    if (t.log && t.warn && t.error) return t;
    throw new Error("logger must implement log, warn and error methods");
  }
  var QKt = /^[a-z_$][a-z0-9_$:-]*$/i;
  function e5t(t, e) {
    let { RULES: r } = this;
    if (
      ((0, yY.eachItem)(t, (n) => {
        if (r.keywords[n]) throw new Error(`Keyword ${n} is already defined`);
        if (!QKt.test(n)) throw new Error(`Keyword ${n} has invalid name`);
      }),
      !!e && e.$data && !("code" in e || "validate" in e))
    )
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function gY(t, e, r) {
    var n;
    let o = e?.post;
    if (r && o) throw new Error('keyword with "post" flag cannot have "type"');
    let { RULES: i } = this,
      s = o ? i.post : i.rules.find(({ type: l }) => l === r);
    if ((s || ((s = { type: r, rules: [] }), i.rules.push(s)), (i.keywords[t] = !0), !e)) return;
    let a = {
      keyword: t,
      definition: {
        ...e,
        type: (0, _B.getJSONTypes)(e.type),
        schemaType: (0, _B.getJSONTypes)(e.schemaType),
      },
    };
    (e.before ? t5t.call(this, s, a, e.before) : s.rules.push(a),
      (i.all[t] = a),
      (n = e.implements) === null || n === void 0 || n.forEach((l) => this.addKeyword(l)));
  }
  function t5t(t, e, r) {
    let n = t.rules.findIndex((o) => o.keyword === r);
    n >= 0
      ? t.rules.splice(n, 0, e)
      : (t.rules.push(e), this.logger.warn(`rule ${r} is not defined`));
  }
  function r5t(t) {
    let { metaSchema: e } = t;
    e !== void 0 &&
      (t.$data && this.opts.$data && (e = Q6e(e)), (t.validateSchema = this.compile(e, !0)));
  }
  var n5t = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
  };
  function Q6e(t) {
    return { anyOf: [t, n5t] };
  }
});
var t3e = A((vY) => {
  "use strict";
  Object.defineProperty(vY, "__esModule", { value: !0 });
  var o5t = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    },
  };
  vY.default = o5t;
});
var i3e = A((Ff) => {
  "use strict";
  Object.defineProperty(Ff, "__esModule", { value: !0 });
  Ff.callRef = Ff.getValidate = void 0;
  var i5t = KR(),
    r3e = ws(),
    Ai = gt(),
    fb = $c(),
    n3e = vB(),
    xB = Ft(),
    s5t = {
      keyword: "$ref",
      schemaType: "string",
      code(t) {
        let { gen: e, schema: r, it: n } = t,
          { baseId: o, schemaEnv: i, validateName: s, opts: a, self: l } = n,
          { root: c } = i;
        if ((r === "#" || r === "#/") && o === c.baseId) return p();
        let u = n3e.resolveRef.call(l, c, o, r);
        if (u === void 0) throw new i5t.default(n.opts.uriResolver, o, r);
        if (u instanceof n3e.SchemaEnv) return m(u);
        return f(u);
        function p() {
          if (i === c) return AB(t, s, i, i.$async);
          let h = e.scopeValue("root", { ref: c });
          return AB(t, (0, Ai._)`${h}.validate`, c, c.$async);
        }
        function m(h) {
          let v = o3e(t, h);
          AB(t, v, h, h.$async);
        }
        function f(h) {
          let v = e.scopeValue(
              "schema",
              a.code.source === !0 ? { ref: h, code: (0, Ai.stringify)(h) } : { ref: h },
            ),
            y = e.name("valid"),
            w = t.subschema(
              { schema: h, dataTypes: [], schemaPath: Ai.nil, topSchemaRef: v, errSchemaPath: r },
              y,
            );
          (t.mergeEvaluated(w), t.ok(y));
        }
      },
    };
  function o3e(t, e) {
    let { gen: r } = t;
    return e.validate
      ? r.scopeValue("validate", { ref: e.validate })
      : (0, Ai._)`${r.scopeValue("wrapper", { ref: e })}.validate`;
  }
  Ff.getValidate = o3e;
  function AB(t, e, r, n) {
    let { gen: o, it: i } = t,
      { allErrors: s, schemaEnv: a, opts: l } = i,
      c = l.passContext ? fb.default.this : Ai.nil;
    n ? u() : p();
    function u() {
      if (!a.$async) throw new Error("async schema referenced by sync schema");
      let h = o.let("valid");
      (o.try(
        () => {
          (o.code((0, Ai._)`await ${(0, r3e.callValidateCode)(t, e, c)}`),
            f(e),
            s || o.assign(h, !0));
        },
        (v) => {
          (o.if((0, Ai._)`!(${v} instanceof ${i.ValidationError})`, () => o.throw(v)),
            m(v),
            s || o.assign(h, !1));
        },
      ),
        t.ok(h));
    }
    function p() {
      t.result(
        (0, r3e.callValidateCode)(t, e, c),
        () => f(e),
        () => m(e),
      );
    }
    function m(h) {
      let v = (0, Ai._)`${h}.errors`;
      (o.assign(
        fb.default.vErrors,
        (0, Ai._)`${fb.default.vErrors} === null ? ${v} : ${fb.default.vErrors}.concat(${v})`,
      ),
        o.assign(fb.default.errors, (0, Ai._)`${fb.default.vErrors}.length`));
    }
    function f(h) {
      var v;
      if (!i.opts.unevaluated) return;
      let y = (v = r?.validate) === null || v === void 0 ? void 0 : v.evaluated;
      if (i.props !== !0)
        if (y && !y.dynamicProps)
          y.props !== void 0 && (i.props = xB.mergeEvaluated.props(o, y.props, i.props));
        else {
          let w = o.var("props", (0, Ai._)`${h}.evaluated.props`);
          i.props = xB.mergeEvaluated.props(o, w, i.props, Ai.Name);
        }
      if (i.items !== !0)
        if (y && !y.dynamicItems)
          y.items !== void 0 && (i.items = xB.mergeEvaluated.items(o, y.items, i.items));
        else {
          let w = o.var("items", (0, Ai._)`${h}.evaluated.items`);
          i.items = xB.mergeEvaluated.items(o, w, i.items, Ai.Name);
        }
    }
  }
  Ff.callRef = AB;
  Ff.default = s5t;
});
var s3e = A((bY) => {
  "use strict";
  Object.defineProperty(bY, "__esModule", { value: !0 });
  var a5t = t3e(),
    l5t = i3e(),
    c5t = [
      "$schema",
      "$id",
      "$defs",
      "$vocabulary",
      { keyword: "$comment" },
      "definitions",
      a5t.default,
      l5t.default,
    ];
  bY.default = c5t;
});
var a3e = A((SY) => {
  "use strict";
  Object.defineProperty(SY, "__esModule", { value: !0 });
  var RB = gt(),
    qd = RB.operators,
    EB = {
      maximum: { okStr: "<=", ok: qd.LTE, fail: qd.GT },
      minimum: { okStr: ">=", ok: qd.GTE, fail: qd.LT },
      exclusiveMaximum: { okStr: "<", ok: qd.LT, fail: qd.GTE },
      exclusiveMinimum: { okStr: ">", ok: qd.GT, fail: qd.LTE },
    },
    u5t = {
      message: ({ keyword: t, schemaCode: e }) => (0, RB.str)`must be ${EB[t].okStr} ${e}`,
      params: ({ keyword: t, schemaCode: e }) =>
        (0, RB._)`{comparison: ${EB[t].okStr}, limit: ${e}}`,
    },
    d5t = {
      keyword: Object.keys(EB),
      type: "number",
      schemaType: "number",
      $data: !0,
      error: u5t,
      code(t) {
        let { keyword: e, data: r, schemaCode: n } = t;
        t.fail$data((0, RB._)`${r} ${EB[e].fail} ${n} || isNaN(${r})`);
      },
    };
  SY.default = d5t;
});
var l3e = A((wY) => {
  "use strict";
  Object.defineProperty(wY, "__esModule", { value: !0 });
  var QR = gt(),
    p5t = {
      message: ({ schemaCode: t }) => (0, QR.str)`must be multiple of ${t}`,
      params: ({ schemaCode: t }) => (0, QR._)`{multipleOf: ${t}}`,
    },
    m5t = {
      keyword: "multipleOf",
      type: "number",
      schemaType: "number",
      $data: !0,
      error: p5t,
      code(t) {
        let { gen: e, data: r, schemaCode: n, it: o } = t,
          i = o.opts.multipleOfPrecision,
          s = e.let("res"),
          a = i
            ? (0, QR._)`Math.abs(Math.round(${s}) - ${s}) > 1e-${i}`
            : (0, QR._)`${s} !== parseInt(${s})`;
        t.fail$data((0, QR._)`(${n} === 0 || (${s} = ${r}/${n}, ${a}))`);
      },
    };
  wY.default = m5t;
});
var u3e = A((_Y) => {
  "use strict";
  Object.defineProperty(_Y, "__esModule", { value: !0 });
  function c3e(t) {
    let e = t.length,
      r = 0,
      n = 0,
      o;
    for (; n < e; )
      (r++,
        (o = t.charCodeAt(n++)),
        o >= 55296 && o <= 56319 && n < e && ((o = t.charCodeAt(n)), (o & 64512) === 56320 && n++));
    return r;
  }
  _Y.default = c3e;
  c3e.code = 'require("ajv/dist/runtime/ucs2length").default';
});
var d3e = A((xY) => {
  "use strict";
  Object.defineProperty(xY, "__esModule", { value: !0 });
  var $f = gt(),
    f5t = Ft(),
    h5t = u3e(),
    g5t = {
      message({ keyword: t, schemaCode: e }) {
        let r = t === "maxLength" ? "more" : "fewer";
        return (0, $f.str)`must NOT have ${r} than ${e} characters`;
      },
      params: ({ schemaCode: t }) => (0, $f._)`{limit: ${t}}`,
    },
    y5t = {
      keyword: ["maxLength", "minLength"],
      type: "string",
      schemaType: "number",
      $data: !0,
      error: g5t,
      code(t) {
        let { keyword: e, data: r, schemaCode: n, it: o } = t,
          i = e === "maxLength" ? $f.operators.GT : $f.operators.LT,
          s =
            o.opts.unicode === !1
              ? (0, $f._)`${r}.length`
              : (0, $f._)`${(0, f5t.useFunc)(t.gen, h5t.default)}(${r})`;
        t.fail$data((0, $f._)`${s} ${i} ${n}`);
      },
    };
  xY.default = y5t;
});
var p3e = A((AY) => {
  "use strict";
  Object.defineProperty(AY, "__esModule", { value: !0 });
  var v5t = ws(),
    b5t = Ft(),
    hb = gt(),
    S5t = {
      message: ({ schemaCode: t }) => (0, hb.str)`must match pattern "${t}"`,
      params: ({ schemaCode: t }) => (0, hb._)`{pattern: ${t}}`,
    },
    w5t = {
      keyword: "pattern",
      type: "string",
      schemaType: "string",
      $data: !0,
      error: S5t,
      code(t) {
        let { gen: e, data: r, $data: n, schema: o, schemaCode: i, it: s } = t,
          a = s.opts.unicodeRegExp ? "u" : "";
        if (n) {
          let { regExp: l } = s.opts.code,
            c = l.code === "new RegExp" ? (0, hb._)`new RegExp` : (0, b5t.useFunc)(e, l),
            u = e.let("valid");
          (e.try(
            () => e.assign(u, (0, hb._)`${c}(${i}, ${a}).test(${r})`),
            () => e.assign(u, !1),
          ),
            t.fail$data((0, hb._)`!${u}`));
        } else {
          let l = (0, v5t.usePattern)(t, o);
          t.fail$data((0, hb._)`!${l}.test(${r})`);
        }
      },
    };
  AY.default = w5t;
});
var m3e = A((RY) => {
  "use strict";
  Object.defineProperty(RY, "__esModule", { value: !0 });
  var eE = gt(),
    _5t = {
      message({ keyword: t, schemaCode: e }) {
        let r = t === "maxProperties" ? "more" : "fewer";
        return (0, eE.str)`must NOT have ${r} than ${e} properties`;
      },
      params: ({ schemaCode: t }) => (0, eE._)`{limit: ${t}}`,
    },
    x5t = {
      keyword: ["maxProperties", "minProperties"],
      type: "object",
      schemaType: "number",
      $data: !0,
      error: _5t,
      code(t) {
        let { keyword: e, data: r, schemaCode: n } = t,
          o = e === "maxProperties" ? eE.operators.GT : eE.operators.LT;
        t.fail$data((0, eE._)`Object.keys(${r}).length ${o} ${n}`);
      },
    };
  RY.default = x5t;
});
var f3e = A((EY) => {
  "use strict";
  Object.defineProperty(EY, "__esModule", { value: !0 });
  var tE = ws(),
    rE = gt(),
    A5t = Ft(),
    R5t = {
      message: ({ params: { missingProperty: t } }) =>
        (0, rE.str)`must have required property '${t}'`,
      params: ({ params: { missingProperty: t } }) => (0, rE._)`{missingProperty: ${t}}`,
    },
    E5t = {
      keyword: "required",
      type: "object",
      schemaType: "array",
      $data: !0,
      error: R5t,
      code(t) {
        let { gen: e, schema: r, schemaCode: n, data: o, $data: i, it: s } = t,
          { opts: a } = s;
        if (!i && r.length === 0) return;
        let l = r.length >= a.loopRequired;
        if ((s.allErrors ? c() : u(), a.strictRequired)) {
          let f = t.parentSchema.properties,
            { definedProperties: h } = t.it;
          for (let v of r)
            if (f?.[v] === void 0 && !h.has(v)) {
              let y = s.schemaEnv.baseId + s.errSchemaPath,
                w = `required property "${v}" is not defined at "${y}" (strictRequired)`;
              (0, A5t.checkStrictMode)(s, w, s.opts.strictRequired);
            }
        }
        function c() {
          if (l || i) t.block$data(rE.nil, p);
          else for (let f of r) (0, tE.checkReportMissingProp)(t, f);
        }
        function u() {
          let f = e.let("missing");
          if (l || i) {
            let h = e.let("valid", !0);
            (t.block$data(h, () => m(f, h)), t.ok(h));
          } else
            (e.if((0, tE.checkMissingProp)(t, r, f)), (0, tE.reportMissingProp)(t, f), e.else());
        }
        function p() {
          e.forOf("prop", n, (f) => {
            (t.setParams({ missingProperty: f }),
              e.if((0, tE.noPropertyInData)(e, o, f, a.ownProperties), () => t.error()));
          });
        }
        function m(f, h) {
          (t.setParams({ missingProperty: f }),
            e.forOf(
              f,
              n,
              () => {
                (e.assign(h, (0, tE.propertyInData)(e, o, f, a.ownProperties)),
                  e.if((0, rE.not)(h), () => {
                    (t.error(), e.break());
                  }));
              },
              rE.nil,
            ));
        }
      },
    };
  EY.default = E5t;
});
var h3e = A((CY) => {
  "use strict";
  Object.defineProperty(CY, "__esModule", { value: !0 });
  var nE = gt(),
    C5t = {
      message({ keyword: t, schemaCode: e }) {
        let r = t === "maxItems" ? "more" : "fewer";
        return (0, nE.str)`must NOT have ${r} than ${e} items`;
      },
      params: ({ schemaCode: t }) => (0, nE._)`{limit: ${t}}`,
    },
    T5t = {
      keyword: ["maxItems", "minItems"],
      type: "array",
      schemaType: "number",
      $data: !0,
      error: C5t,
      code(t) {
        let { keyword: e, data: r, schemaCode: n } = t,
          o = e === "maxItems" ? nE.operators.GT : nE.operators.LT;
        t.fail$data((0, nE._)`${r}.length ${o} ${n}`);
      },
    };
  CY.default = T5t;
});
var CB = A((TY) => {
  "use strict";
  Object.defineProperty(TY, "__esModule", { value: !0 });
  var g3e = YX();
  g3e.code = 'require("ajv/dist/runtime/equal").default';
  TY.default = g3e;
});
var y3e = A((IY) => {
  "use strict";
  Object.defineProperty(IY, "__esModule", { value: !0 });
  var PY = WR(),
    ao = gt(),
    P5t = Ft(),
    I5t = CB(),
    k5t = {
      message: ({ params: { i: t, j: e } }) =>
        (0, ao.str)`must NOT have duplicate items (items ## ${e} and ${t} are identical)`,
      params: ({ params: { i: t, j: e } }) => (0, ao._)`{i: ${t}, j: ${e}}`,
    },
    D5t = {
      keyword: "uniqueItems",
      type: "array",
      schemaType: "boolean",
      $data: !0,
      error: k5t,
      code(t) {
        let { gen: e, data: r, $data: n, schema: o, parentSchema: i, schemaCode: s, it: a } = t;
        if (!n && !o) return;
        let l = e.let("valid"),
          c = i.items ? (0, PY.getSchemaTypes)(i.items) : [];
        (t.block$data(l, u, (0, ao._)`${s} === false`), t.ok(l));
        function u() {
          let h = e.let("i", (0, ao._)`${r}.length`),
            v = e.let("j");
          (t.setParams({ i: h, j: v }),
            e.assign(l, !0),
            e.if((0, ao._)`${h} > 1`, () => (p() ? m : f)(h, v)));
        }
        function p() {
          return c.length > 0 && !c.some((h) => h === "object" || h === "array");
        }
        function m(h, v) {
          let y = e.name("item"),
            w = (0, PY.checkDataTypes)(c, y, a.opts.strictNumbers, PY.DataType.Wrong),
            _ = e.const("indices", (0, ao._)`{}`);
          e.for((0, ao._)`;${h}--;`, () => {
            (e.let(y, (0, ao._)`${r}[${h}]`),
              e.if(w, (0, ao._)`continue`),
              c.length > 1 && e.if((0, ao._)`typeof ${y} == "string"`, (0, ao._)`${y} += "_"`),
              e
                .if((0, ao._)`typeof ${_}[${y}] == "number"`, () => {
                  (e.assign(v, (0, ao._)`${_}[${y}]`), t.error(), e.assign(l, !1).break());
                })
                .code((0, ao._)`${_}[${y}] = ${h}`));
          });
        }
        function f(h, v) {
          let y = (0, P5t.useFunc)(e, I5t.default),
            w = e.name("outer");
          e.label(w).for((0, ao._)`;${h}--;`, () =>
            e.for((0, ao._)`${v} = ${h}; ${v}--;`, () =>
              e.if((0, ao._)`${y}(${r}[${h}], ${r}[${v}])`, () => {
                (t.error(), e.assign(l, !1).break(w));
              }),
            ),
          );
        }
      },
    };
  IY.default = D5t;
});
var v3e = A((DY) => {
  "use strict";
  Object.defineProperty(DY, "__esModule", { value: !0 });
  var kY = gt(),
    M5t = Ft(),
    O5t = CB(),
    N5t = {
      message: "must be equal to constant",
      params: ({ schemaCode: t }) => (0, kY._)`{allowedValue: ${t}}`,
    },
    L5t = {
      keyword: "const",
      $data: !0,
      error: N5t,
      code(t) {
        let { gen: e, data: r, $data: n, schemaCode: o, schema: i } = t;
        n || (i && typeof i == "object")
          ? t.fail$data((0, kY._)`!${(0, M5t.useFunc)(e, O5t.default)}(${r}, ${o})`)
          : t.fail((0, kY._)`${i} !== ${r}`);
      },
    };
  DY.default = L5t;
});
var b3e = A((MY) => {
  "use strict";
  Object.defineProperty(MY, "__esModule", { value: !0 });
  var oE = gt(),
    B5t = Ft(),
    F5t = CB(),
    $5t = {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode: t }) => (0, oE._)`{allowedValues: ${t}}`,
    },
    U5t = {
      keyword: "enum",
      schemaType: "array",
      $data: !0,
      error: $5t,
      code(t) {
        let { gen: e, data: r, $data: n, schema: o, schemaCode: i, it: s } = t;
        if (!n && o.length === 0) throw new Error("enum must have non-empty array");
        let a = o.length >= s.opts.loopEnum,
          l,
          c = () => l ?? (l = (0, B5t.useFunc)(e, F5t.default)),
          u;
        if (a || n) ((u = e.let("valid")), t.block$data(u, p));
        else {
          if (!Array.isArray(o)) throw new Error("ajv implementation error");
          let f = e.const("vSchema", i);
          u = (0, oE.or)(...o.map((h, v) => m(f, v)));
        }
        t.pass(u);
        function p() {
          (e.assign(u, !1),
            e.forOf("v", i, (f) =>
              e.if((0, oE._)`${c()}(${r}, ${f})`, () => e.assign(u, !0).break()),
            ));
        }
        function m(f, h) {
          let v = o[h];
          return typeof v == "object" && v !== null
            ? (0, oE._)`${c()}(${r}, ${f}[${h}])`
            : (0, oE._)`${r} === ${v}`;
        }
      },
    };
  MY.default = U5t;
});
var S3e = A((OY) => {
  "use strict";
  Object.defineProperty(OY, "__esModule", { value: !0 });
  var q5t = a3e(),
    G5t = l3e(),
    W5t = d3e(),
    H5t = p3e(),
    j5t = m3e(),
    z5t = f3e(),
    V5t = h3e(),
    K5t = y3e(),
    Z5t = v3e(),
    X5t = b3e(),
    Y5t = [
      q5t.default,
      G5t.default,
      W5t.default,
      H5t.default,
      j5t.default,
      z5t.default,
      V5t.default,
      K5t.default,
      { keyword: "type", schemaType: ["string", "array"] },
      { keyword: "nullable", schemaType: "boolean" },
      Z5t.default,
      X5t.default,
    ];
  OY.default = Y5t;
});
var LY = A((iE) => {
  "use strict";
  Object.defineProperty(iE, "__esModule", { value: !0 });
  iE.validateAdditionalItems = void 0;
  var Uf = gt(),
    NY = Ft(),
    J5t = {
      message: ({ params: { len: t } }) => (0, Uf.str)`must NOT have more than ${t} items`,
      params: ({ params: { len: t } }) => (0, Uf._)`{limit: ${t}}`,
    },
    Q5t = {
      keyword: "additionalItems",
      type: "array",
      schemaType: ["boolean", "object"],
      before: "uniqueItems",
      error: J5t,
      code(t) {
        let { parentSchema: e, it: r } = t,
          { items: n } = e;
        if (!Array.isArray(n)) {
          (0, NY.checkStrictMode)(
            r,
            '"additionalItems" is ignored when "items" is not an array of schemas',
          );
          return;
        }
        w3e(t, n);
      },
    };
  function w3e(t, e) {
    let { gen: r, schema: n, data: o, keyword: i, it: s } = t;
    s.items = !0;
    let a = r.const("len", (0, Uf._)`${o}.length`);
    if (n === !1) (t.setParams({ len: e.length }), t.pass((0, Uf._)`${a} <= ${e.length}`));
    else if (typeof n == "object" && !(0, NY.alwaysValidSchema)(s, n)) {
      let c = r.var("valid", (0, Uf._)`${a} <= ${e.length}`);
      (r.if((0, Uf.not)(c), () => l(c)), t.ok(c));
    }
    function l(c) {
      r.forRange("i", e.length, a, (u) => {
        (t.subschema({ keyword: i, dataProp: u, dataPropType: NY.Type.Num }, c),
          s.allErrors || r.if((0, Uf.not)(c), () => r.break()));
      });
    }
  }
  iE.validateAdditionalItems = w3e;
  iE.default = Q5t;
});
var BY = A((sE) => {
  "use strict";
  Object.defineProperty(sE, "__esModule", { value: !0 });
  sE.validateTuple = void 0;
  var _3e = gt(),
    TB = Ft(),
    e8t = ws(),
    t8t = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "array", "boolean"],
      before: "uniqueItems",
      code(t) {
        let { schema: e, it: r } = t;
        if (Array.isArray(e)) return x3e(t, "additionalItems", e);
        ((r.items = !0), !(0, TB.alwaysValidSchema)(r, e) && t.ok((0, e8t.validateArray)(t)));
      },
    };
  function x3e(t, e, r = t.schema) {
    let { gen: n, parentSchema: o, data: i, keyword: s, it: a } = t;
    (u(o),
      a.opts.unevaluated &&
        r.length &&
        a.items !== !0 &&
        (a.items = TB.mergeEvaluated.items(n, r.length, a.items)));
    let l = n.name("valid"),
      c = n.const("len", (0, _3e._)`${i}.length`);
    r.forEach((p, m) => {
      (0, TB.alwaysValidSchema)(a, p) ||
        (n.if((0, _3e._)`${c} > ${m}`, () =>
          t.subschema({ keyword: s, schemaProp: m, dataProp: m }, l),
        ),
        t.ok(l));
    });
    function u(p) {
      let { opts: m, errSchemaPath: f } = a,
        h = r.length,
        v = h === p.minItems && (h === p.maxItems || p[e] === !1);
      if (m.strictTuples && !v) {
        let y = `"${s}" is ${h}-tuple, but minItems or maxItems/${e} are not specified or different at path "${f}"`;
        (0, TB.checkStrictMode)(a, y, m.strictTuples);
      }
    }
  }
  sE.validateTuple = x3e;
  sE.default = t8t;
});
var A3e = A((FY) => {
  "use strict";
  Object.defineProperty(FY, "__esModule", { value: !0 });
  var r8t = BY(),
    n8t = {
      keyword: "prefixItems",
      type: "array",
      schemaType: ["array"],
      before: "uniqueItems",
      code: (t) => (0, r8t.validateTuple)(t, "items"),
    };
  FY.default = n8t;
});
var E3e = A(($Y) => {
  "use strict";
  Object.defineProperty($Y, "__esModule", { value: !0 });
  var R3e = gt(),
    o8t = Ft(),
    i8t = ws(),
    s8t = LY(),
    a8t = {
      message: ({ params: { len: t } }) => (0, R3e.str)`must NOT have more than ${t} items`,
      params: ({ params: { len: t } }) => (0, R3e._)`{limit: ${t}}`,
    },
    l8t = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      error: a8t,
      code(t) {
        let { schema: e, parentSchema: r, it: n } = t,
          { prefixItems: o } = r;
        ((n.items = !0),
          !(0, o8t.alwaysValidSchema)(n, e) &&
            (o ? (0, s8t.validateAdditionalItems)(t, o) : t.ok((0, i8t.validateArray)(t))));
      },
    };
  $Y.default = l8t;
});
var C3e = A((UY) => {
  "use strict";
  Object.defineProperty(UY, "__esModule", { value: !0 });
  var xs = gt(),
    PB = Ft(),
    c8t = {
      message: ({ params: { min: t, max: e } }) =>
        e === void 0
          ? (0, xs.str)`must contain at least ${t} valid item(s)`
          : (0, xs.str)`must contain at least ${t} and no more than ${e} valid item(s)`,
      params: ({ params: { min: t, max: e } }) =>
        e === void 0
          ? (0, xs._)`{minContains: ${t}}`
          : (0, xs._)`{minContains: ${t}, maxContains: ${e}}`,
    },
    u8t = {
      keyword: "contains",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      trackErrors: !0,
      error: c8t,
      code(t) {
        let { gen: e, schema: r, parentSchema: n, data: o, it: i } = t,
          s,
          a,
          { minContains: l, maxContains: c } = n;
        i.opts.next ? ((s = l === void 0 ? 1 : l), (a = c)) : (s = 1);
        let u = e.const("len", (0, xs._)`${o}.length`);
        if ((t.setParams({ min: s, max: a }), a === void 0 && s === 0)) {
          (0, PB.checkStrictMode)(
            i,
            '"minContains" == 0 without "maxContains": "contains" keyword ignored',
          );
          return;
        }
        if (a !== void 0 && s > a) {
          ((0, PB.checkStrictMode)(i, '"minContains" > "maxContains" is always invalid'), t.fail());
          return;
        }
        if ((0, PB.alwaysValidSchema)(i, r)) {
          let v = (0, xs._)`${u} >= ${s}`;
          (a !== void 0 && (v = (0, xs._)`${v} && ${u} <= ${a}`), t.pass(v));
          return;
        }
        i.items = !0;
        let p = e.name("valid");
        (a === void 0 && s === 1
          ? f(p, () => e.if(p, () => e.break()))
          : s === 0
            ? (e.let(p, !0), a !== void 0 && e.if((0, xs._)`${o}.length > 0`, m))
            : (e.let(p, !1), m()),
          t.result(p, () => t.reset()));
        function m() {
          let v = e.name("_valid"),
            y = e.let("count", 0);
          f(v, () => e.if(v, () => h(y)));
        }
        function f(v, y) {
          e.forRange("i", 0, u, (w) => {
            (t.subschema(
              { keyword: "contains", dataProp: w, dataPropType: PB.Type.Num, compositeRule: !0 },
              v,
            ),
              y());
          });
        }
        function h(v) {
          (e.code((0, xs._)`${v}++`),
            a === void 0
              ? e.if((0, xs._)`${v} >= ${s}`, () => e.assign(p, !0).break())
              : (e.if((0, xs._)`${v} > ${a}`, () => e.assign(p, !1).break()),
                s === 1 ? e.assign(p, !0) : e.if((0, xs._)`${v} >= ${s}`, () => e.assign(p, !0))));
        }
      },
    };
  UY.default = u8t;
});
