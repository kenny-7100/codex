var SSe = A((l0) => {
  "use strict";
  Object.defineProperty(l0, "__esModule", { value: !0 });
  l0.parse = void 0;
  var Gbt = new Set([9, 10, 12, 13, 32]),
    bSe = 48,
    Wbt = 57;
  function Hbt(t) {
    if (((t = t.trim().toLowerCase()), t === "even")) return [2, 0];
    if (t === "odd") return [2, 1];
    var e = 0,
      r = 0,
      n = i(),
      o = s();
    if (
      (e < t.length &&
        t.charAt(e) === "n" &&
        (e++, (r = n * (o ?? 1)), a(), e < t.length ? ((n = i()), a(), (o = s())) : (n = o = 0)),
      o === null || e < t.length)
    )
      throw new Error("n-th rule couldn't be parsed ('".concat(t, "')"));
    return [r, n * o];
    function i() {
      return t.charAt(e) === "-" ? (e++, -1) : (t.charAt(e) === "+" && e++, 1);
    }
    function s() {
      for (var l = e, c = 0; e < t.length && t.charCodeAt(e) >= bSe && t.charCodeAt(e) <= Wbt; )
        ((c = c * 10 + (t.charCodeAt(e) - bSe)), e++);
      return e === l ? null : c;
    }
    function a() {
      for (; e < t.length && Gbt.has(t.charCodeAt(e)); ) e++;
    }
  }
  l0.parse = Hbt;
});
var _Se = A((Mu) => {
  "use strict";
  var jbt =
    (Mu && Mu.__importDefault) ||
    function (t) {
      return t && t.__esModule ? t : { default: t };
    };
  Object.defineProperty(Mu, "__esModule", { value: !0 });
  Mu.generate = Mu.compile = void 0;
  var wSe = jbt(em());
  function zbt(t) {
    var e = t[0],
      r = t[1] - 1;
    if (r < 0 && e <= 0) return wSe.default.falseFunc;
    if (e === -1)
      return function (i) {
        return i <= r;
      };
    if (e === 0)
      return function (i) {
        return i === r;
      };
    if (e === 1)
      return r < 0
        ? wSe.default.trueFunc
        : function (i) {
            return i >= r;
          };
    var n = Math.abs(e),
      o = ((r % n) + n) % n;
    return e > 1
      ? function (i) {
          return i >= r && i % n === o;
        }
      : function (i) {
          return i <= r && i % n === o;
        };
  }
  Mu.compile = zbt;
  function Vbt(t) {
    var e = t[0],
      r = t[1] - 1,
      n = 0;
    if (e < 0) {
      var o = -e,
        i = ((r % o) + o) % o;
      return function () {
        var s = i + o * n++;
        return s > r ? null : s;
      };
    }
    return e === 0
      ? r < 0
        ? function () {
            return null;
          }
        : function () {
            return n++ === 0 ? r : null;
          }
      : (r < 0 && (r += e * Math.ceil(-r / e)),
        function () {
          return e * n++ + r;
        });
  }
  Mu.generate = Vbt;
});
var xSe = A(($s) => {
  "use strict";
  Object.defineProperty($s, "__esModule", { value: !0 });
  $s.sequence = $s.generate = $s.compile = $s.parse = void 0;
  var ZH = SSe();
  Object.defineProperty($s, "parse", {
    enumerable: !0,
    get: function () {
      return ZH.parse;
    },
  });
  var c0 = _Se();
  Object.defineProperty($s, "compile", {
    enumerable: !0,
    get: function () {
      return c0.compile;
    },
  });
  Object.defineProperty($s, "generate", {
    enumerable: !0,
    get: function () {
      return c0.generate;
    },
  });
  function Kbt(t) {
    return (0, c0.compile)((0, ZH.parse)(t));
  }
  $s.default = Kbt;
  function Zbt(t) {
    return (0, c0.generate)((0, ZH.parse)(t));
  }
  $s.sequence = Zbt;
});
var RSe = A((rm) => {
  "use strict";
  var ASe =
    (rm && rm.__importDefault) ||
    function (t) {
      return t && t.__esModule ? t : { default: t };
    };
  Object.defineProperty(rm, "__esModule", { value: !0 });
  rm.filters = void 0;
  var u0 = ASe(xSe()),
    Li = ASe(em());
  function d0(t, e) {
    return function (r) {
      var n = e.getParent(r);
      return n != null && e.isTag(n) && t(r);
    };
  }
  rm.filters = {
    contains: function (t, e, r) {
      var n = r.adapter;
      return function (i) {
        return t(i) && n.getText(i).includes(e);
      };
    },
    icontains: function (t, e, r) {
      var n = r.adapter,
        o = e.toLowerCase();
      return function (s) {
        return t(s) && n.getText(s).toLowerCase().includes(o);
      };
    },
    "nth-child": function (t, e, r) {
      var n = r.adapter,
        o = r.equals,
        i = (0, u0.default)(e);
      return i === Li.default.falseFunc
        ? Li.default.falseFunc
        : i === Li.default.trueFunc
          ? d0(t, n)
          : function (a) {
              for (var l = n.getSiblings(a), c = 0, u = 0; u < l.length && !o(a, l[u]); u++)
                n.isTag(l[u]) && c++;
              return i(c) && t(a);
            };
    },
    "nth-last-child": function (t, e, r) {
      var n = r.adapter,
        o = r.equals,
        i = (0, u0.default)(e);
      return i === Li.default.falseFunc
        ? Li.default.falseFunc
        : i === Li.default.trueFunc
          ? d0(t, n)
          : function (a) {
              for (var l = n.getSiblings(a), c = 0, u = l.length - 1; u >= 0 && !o(a, l[u]); u--)
                n.isTag(l[u]) && c++;
              return i(c) && t(a);
            };
    },
    "nth-of-type": function (t, e, r) {
      var n = r.adapter,
        o = r.equals,
        i = (0, u0.default)(e);
      return i === Li.default.falseFunc
        ? Li.default.falseFunc
        : i === Li.default.trueFunc
          ? d0(t, n)
          : function (a) {
              for (var l = n.getSiblings(a), c = 0, u = 0; u < l.length; u++) {
                var p = l[u];
                if (o(a, p)) break;
                n.isTag(p) && n.getName(p) === n.getName(a) && c++;
              }
              return i(c) && t(a);
            };
    },
    "nth-last-of-type": function (t, e, r) {
      var n = r.adapter,
        o = r.equals,
        i = (0, u0.default)(e);
      return i === Li.default.falseFunc
        ? Li.default.falseFunc
        : i === Li.default.trueFunc
          ? d0(t, n)
          : function (a) {
              for (var l = n.getSiblings(a), c = 0, u = l.length - 1; u >= 0; u--) {
                var p = l[u];
                if (o(a, p)) break;
                n.isTag(p) && n.getName(p) === n.getName(a) && c++;
              }
              return i(c) && t(a);
            };
    },
    root: function (t, e, r) {
      var n = r.adapter;
      return function (o) {
        var i = n.getParent(o);
        return (i == null || !n.isTag(i)) && t(o);
      };
    },
    scope: function (t, e, r, n) {
      var o = r.equals;
      return !n || n.length === 0
        ? rm.filters.root(t, e, r)
        : n.length === 1
          ? function (i) {
              return o(n[0], i) && t(i);
            }
          : function (i) {
              return n.includes(i) && t(i);
            };
    },
    hover: XH("isHovered"),
    visited: XH("isVisited"),
    active: XH("isActive"),
  };
  function XH(t) {
    return function (r, n, o) {
      var i = o.adapter,
        s = i[t];
      return typeof s != "function"
        ? Li.default.falseFunc
        : function (l) {
            return s(l) && r(l);
          };
    };
  }
});
var ESe = A((Gg) => {
  "use strict";
  Object.defineProperty(Gg, "__esModule", { value: !0 });
  Gg.verifyPseudoArgs = Gg.pseudos = void 0;
  Gg.pseudos = {
    empty: function (t, e) {
      var r = e.adapter;
      return !r.getChildren(t).some(function (n) {
        return r.isTag(n) || r.getText(n) !== "";
      });
    },
    "first-child": function (t, e) {
      var r = e.adapter,
        n = e.equals;
      if (r.prevElementSibling) return r.prevElementSibling(t) == null;
      var o = r.getSiblings(t).find(function (i) {
        return r.isTag(i);
      });
      return o != null && n(t, o);
    },
    "last-child": function (t, e) {
      for (var r = e.adapter, n = e.equals, o = r.getSiblings(t), i = o.length - 1; i >= 0; i--) {
        if (n(t, o[i])) return !0;
        if (r.isTag(o[i])) break;
      }
      return !1;
    },
    "first-of-type": function (t, e) {
      for (
        var r = e.adapter, n = e.equals, o = r.getSiblings(t), i = r.getName(t), s = 0;
        s < o.length;
        s++
      ) {
        var a = o[s];
        if (n(t, a)) return !0;
        if (r.isTag(a) && r.getName(a) === i) break;
      }
      return !1;
    },
    "last-of-type": function (t, e) {
      for (
        var r = e.adapter, n = e.equals, o = r.getSiblings(t), i = r.getName(t), s = o.length - 1;
        s >= 0;
        s--
      ) {
        var a = o[s];
        if (n(t, a)) return !0;
        if (r.isTag(a) && r.getName(a) === i) break;
      }
      return !1;
    },
    "only-of-type": function (t, e) {
      var r = e.adapter,
        n = e.equals,
        o = r.getName(t);
      return r.getSiblings(t).every(function (i) {
        return n(t, i) || !r.isTag(i) || r.getName(i) !== o;
      });
    },
    "only-child": function (t, e) {
      var r = e.adapter,
        n = e.equals;
      return r.getSiblings(t).every(function (o) {
        return n(t, o) || !r.isTag(o);
      });
    },
  };
  function Xbt(t, e, r, n) {
    if (r === null) {
      if (t.length > n) throw new Error("Pseudo-class :".concat(e, " requires an argument"));
    } else if (t.length === n)
      throw new Error("Pseudo-class :".concat(e, " doesn't have any arguments"));
  }
  Gg.verifyPseudoArgs = Xbt;
});
var CSe = A((p0) => {
  "use strict";
  Object.defineProperty(p0, "__esModule", { value: !0 });
  p0.aliases = void 0;
  p0.aliases = {
    "any-link": ":is(a, area, link)[href]",
    link: ":any-link:not(:visited)",
    disabled: `:is(
        :is(button, input, select, textarea, optgroup, option)[disabled],
        optgroup[disabled] > option,
        fieldset[disabled]:not(fieldset[disabled] legend:first-of-type *)
    )`,
    enabled: ":not(:disabled)",
    checked: ":is(:is(input[type=radio], input[type=checkbox])[checked], option:selected)",
    required: ":is(input, select, textarea)[required]",
    optional: ":is(input, select, textarea):not([required])",
    selected:
      "option:is([selected], select:not([multiple]):not(:has(> option[selected])) > :first-of-type)",
    checkbox: "[type=checkbox]",
    file: "[type=file]",
    password: "[type=password]",
    radio: "[type=radio]",
    reset: "[type=reset]",
    image: "[type=image]",
    submit: "[type=submit]",
    parent: ":not(:empty)",
    header: ":is(h1, h2, h3, h4, h5, h6)",
    button: ":is(button, input[type=button])",
    input: ":is(input, textarea, select, button)",
    text: "input:is(:not([type!='']), [type=text])",
  };
});
var m0 = A((Lo) => {
  "use strict";
  var TSe =
      (Lo && Lo.__spreadArray) ||
      function (t, e, r) {
        if (r || arguments.length === 2)
          for (var n = 0, o = e.length, i; n < o; n++)
            (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), (i[n] = e[n]));
        return t.concat(i || Array.prototype.slice.call(e));
      },
    Ybt =
      (Lo && Lo.__importDefault) ||
      function (t) {
        return t && t.__esModule ? t : { default: t };
      };
  Object.defineProperty(Lo, "__esModule", { value: !0 });
  Lo.subselects = Lo.getNextSiblings = Lo.ensureIsTag = Lo.PLACEHOLDER_ELEMENT = void 0;
  var Us = Ybt(em()),
    Jbt = KH();
  Lo.PLACEHOLDER_ELEMENT = {};
  function PSe(t, e) {
    return t === Us.default.falseFunc
      ? Us.default.falseFunc
      : function (r) {
          return e.isTag(r) && t(r);
        };
  }
  Lo.ensureIsTag = PSe;
  function ISe(t, e) {
    var r = e.getSiblings(t);
    if (r.length <= 1) return [];
    var n = r.indexOf(t);
    return n < 0 || n === r.length - 1 ? [] : r.slice(n + 1).filter(e.isTag);
  }
  Lo.getNextSiblings = ISe;
  function JH(t) {
    return {
      xmlMode: !!t.xmlMode,
      lowerCaseAttributeNames: !!t.lowerCaseAttributeNames,
      lowerCaseTags: !!t.lowerCaseTags,
      quirksMode: !!t.quirksMode,
      cacheResults: !!t.cacheResults,
      pseudos: t.pseudos,
      adapter: t.adapter,
      equals: t.equals,
    };
  }
  var YH = function (t, e, r, n, o) {
    var i = o(e, JH(r), n);
    return i === Us.default.trueFunc
      ? t
      : i === Us.default.falseFunc
        ? Us.default.falseFunc
        : function (s) {
            return i(s) && t(s);
          };
  };
  Lo.subselects = {
    is: YH,
    matches: YH,
    where: YH,
    not: function (t, e, r, n, o) {
      var i = o(e, JH(r), n);
      return i === Us.default.falseFunc
        ? t
        : i === Us.default.trueFunc
          ? Us.default.falseFunc
          : function (s) {
              return !i(s) && t(s);
            };
    },
    has: function (t, e, r, n, o) {
      var i = r.adapter,
        s = JH(r);
      s.relativeSelector = !0;
      var a = e.some(function (m) {
          return m.some(Jbt.isTraversal);
        })
          ? [Lo.PLACEHOLDER_ELEMENT]
          : void 0,
        l = o(e, s, a);
      if (l === Us.default.falseFunc) return Us.default.falseFunc;
      var c = PSe(l, i);
      if (a && l !== Us.default.trueFunc) {
        var u = l.shouldTestNextSiblings,
          p = u === void 0 ? !1 : u;
        return function (m) {
          if (!t(m)) return !1;
          a[0] = m;
          var f = i.getChildren(m),
            h = p ? TSe(TSe([], f, !0), ISe(m, i), !0) : f;
          return i.existsOne(c, h);
        };
      }
      return function (m) {
        return t(m) && i.existsOne(c, i.getChildren(m));
      };
    },
  };
});
var tj = A((La) => {
  "use strict";
  Object.defineProperty(La, "__esModule", { value: !0 });
  La.compilePseudoSelector = La.aliases = La.pseudos = La.filters = void 0;
  var Qbt = __(),
    ej = RSe();
  Object.defineProperty(La, "filters", {
    enumerable: !0,
    get: function () {
      return ej.filters;
    },
  });
  var A_ = ESe();
  Object.defineProperty(La, "pseudos", {
    enumerable: !0,
    get: function () {
      return A_.pseudos;
    },
  });
  var kSe = CSe();
  Object.defineProperty(La, "aliases", {
    enumerable: !0,
    get: function () {
      return kSe.aliases;
    },
  });
  var QH = m0();
  function eSt(t, e, r, n, o) {
    var i,
      s = e.name,
      a = e.data;
    if (Array.isArray(a)) {
      if (!(s in QH.subselects))
        throw new Error("Unknown pseudo-class :".concat(s, "(").concat(a, ")"));
      return QH.subselects[s](t, a, r, n, o);
    }
    var l = (i = r.pseudos) === null || i === void 0 ? void 0 : i[s],
      c = typeof l == "string" ? l : kSe.aliases[s];
    if (typeof c == "string") {
      if (a != null) throw new Error("Pseudo ".concat(s, " doesn't have any arguments"));
      var u = (0, Qbt.parse)(c);
      return QH.subselects.is(t, u, r, n, o);
    }
    if (typeof l == "function")
      return (
        (0, A_.verifyPseudoArgs)(l, s, a, 1),
        function (m) {
          return l(m, a) && t(m);
        }
      );
    if (s in ej.filters) return ej.filters[s](t, a, r, n);
    if (s in A_.pseudos) {
      var p = A_.pseudos[s];
      return (
        (0, A_.verifyPseudoArgs)(p, s, a, 2),
        function (m) {
          return p(m, r, a) && t(m);
        }
      );
    }
    throw new Error("Unknown pseudo-class :".concat(s));
  }
  La.compilePseudoSelector = eSt;
});
var DSe = A((f0) => {
  "use strict";
  Object.defineProperty(f0, "__esModule", { value: !0 });
  f0.compileGeneralSelector = void 0;
  var tSt = vSe(),
    rSt = tj(),
    qs = __();
  function rj(t, e) {
    var r = e.getParent(t);
    return r && e.isTag(r) ? r : null;
  }
  function nSt(t, e, r, n, o) {
    var i = r.adapter,
      s = r.equals;
    switch (e.type) {
      case qs.SelectorType.PseudoElement:
        throw new Error("Pseudo-elements are not supported by css-select");
      case qs.SelectorType.ColumnCombinator:
        throw new Error("Column combinators are not yet supported by css-select");
      case qs.SelectorType.Attribute: {
        if (e.namespace != null)
          throw new Error("Namespaced attributes are not yet supported by css-select");
        return (
          (!r.xmlMode || r.lowerCaseAttributeNames) && (e.name = e.name.toLowerCase()),
          tSt.attributeRules[e.action](t, e, r)
        );
      }
      case qs.SelectorType.Pseudo:
        return (0, rSt.compilePseudoSelector)(t, e, r, n, o);
      case qs.SelectorType.Tag: {
        if (e.namespace != null)
          throw new Error("Namespaced tag names are not yet supported by css-select");
        var a = e.name;
        return (
          (!r.xmlMode || r.lowerCaseTags) && (a = a.toLowerCase()),
          function (u) {
            return i.getName(u) === a && t(u);
          }
        );
      }
      case qs.SelectorType.Descendant: {
        if (r.cacheResults === !1 || typeof WeakSet > "u")
          return function (u) {
            for (var p = u; (p = rj(p, i)); ) if (t(p)) return !0;
            return !1;
          };
        var l = new WeakSet();
        return function (u) {
          for (var p = u; (p = rj(p, i)); )
            if (!l.has(p)) {
              if (i.isTag(p) && t(p)) return !0;
              l.add(p);
            }
          return !1;
        };
      }
      case "_flexibleDescendant":
        return function (u) {
          var p = u;
          do if (t(p)) return !0;
          while ((p = rj(p, i)));
          return !1;
        };
      case qs.SelectorType.Parent:
        return function (u) {
          return i.getChildren(u).some(function (p) {
            return i.isTag(p) && t(p);
          });
        };
      case qs.SelectorType.Child:
        return function (u) {
          var p = i.getParent(u);
          return p != null && i.isTag(p) && t(p);
        };
      case qs.SelectorType.Sibling:
        return function (u) {
          for (var p = i.getSiblings(u), m = 0; m < p.length; m++) {
            var f = p[m];
            if (s(u, f)) break;
            if (i.isTag(f) && t(f)) return !0;
          }
          return !1;
        };
      case qs.SelectorType.Adjacent:
        return i.prevElementSibling
          ? function (u) {
              var p = i.prevElementSibling(u);
              return p != null && t(p);
            }
          : function (u) {
              for (var p = i.getSiblings(u), m, f = 0; f < p.length; f++) {
                var h = p[f];
                if (s(u, h)) break;
                i.isTag(h) && (m = h);
              }
              return !!m && t(m);
            };
      case qs.SelectorType.Universal: {
        if (e.namespace != null && e.namespace !== "*")
          throw new Error("Namespaced universal selectors are not yet supported by css-select");
        return t;
      }
    }
  }
  f0.compileGeneralSelector = nSt;
});
var LSe = A((yo) => {
  "use strict";
  var oSt =
      (yo && yo.__createBinding) ||
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
    iSt =
      (yo && yo.__setModuleDefault) ||
      (Object.create
        ? function (t, e) {
            Object.defineProperty(t, "default", { enumerable: !0, value: e });
          }
        : function (t, e) {
            t.default = e;
          }),
    sSt =
      (yo && yo.__importStar) ||
      function (t) {
        if (t && t.__esModule) return t;
        var e = {};
        if (t != null)
          for (var r in t)
            r !== "default" && Object.prototype.hasOwnProperty.call(t, r) && oSt(e, t, r);
        return (iSt(e, t), e);
      },
    aSt =
      (yo && yo.__importDefault) ||
      function (t) {
        return t && t.__esModule ? t : { default: t };
      };
  Object.defineProperty(yo, "__esModule", { value: !0 });
  yo.compileToken = yo.compileUnsafe = yo.compile = void 0;
  var tc = __(),
    Ou = aSt(em()),
    nj = sSt(KH()),
    lSt = DSe(),
    MSe = m0();
  function cSt(t, e, r) {
    var n = OSe(t, e, r);
    return (0, MSe.ensureIsTag)(n, e.adapter);
  }
  yo.compile = cSt;
  function OSe(t, e, r) {
    var n = typeof t == "string" ? (0, tc.parse)(t) : t;
    return oj(n, e, r);
  }
  yo.compileUnsafe = OSe;
  function NSe(t) {
    return (
      t.type === tc.SelectorType.Pseudo &&
      (t.name === "scope" ||
        (Array.isArray(t.data) &&
          t.data.some(function (e) {
            return e.some(NSe);
          })))
    );
  }
  var uSt = { type: tc.SelectorType.Descendant },
    dSt = { type: "_flexibleDescendant" },
    pSt = { type: tc.SelectorType.Pseudo, name: "scope", data: null };
  function mSt(t, e, r) {
    for (
      var n = e.adapter,
        o = !!r?.every(function (l) {
          var c = n.isTag(l) && n.getParent(l);
          return l === MSe.PLACEHOLDER_ELEMENT || (c && n.isTag(c));
        }),
        i = 0,
        s = t;
      i < s.length;
      i++
    ) {
      var a = s[i];
      if (!(a.length > 0 && (0, nj.isTraversal)(a[0]) && a[0].type !== tc.SelectorType.Descendant))
        if (o && !a.some(NSe)) a.unshift(uSt);
        else continue;
      a.unshift(pSt);
    }
  }
  function oj(t, e, r) {
    var n;
    (t.forEach(nj.default), (r = (n = e.context) !== null && n !== void 0 ? n : r));
    var o = Array.isArray(r),
      i = r && (Array.isArray(r) ? r : [r]);
    if (e.relativeSelector !== !1) mSt(t, e, i);
    else if (
      t.some(function (l) {
        return l.length > 0 && (0, nj.isTraversal)(l[0]);
      })
    )
      throw new Error(
        "Relative selectors are not allowed when the `relativeSelector` option is disabled",
      );
    var s = !1,
      a = t
        .map(function (l) {
          if (l.length >= 2) {
            var c = l[0],
              u = l[1];
            c.type !== tc.SelectorType.Pseudo ||
              c.name !== "scope" ||
              (o && u.type === tc.SelectorType.Descendant
                ? (l[1] = dSt)
                : (u.type === tc.SelectorType.Adjacent || u.type === tc.SelectorType.Sibling) &&
                  (s = !0));
          }
          return fSt(l, e, i);
        })
        .reduce(hSt, Ou.default.falseFunc);
    return ((a.shouldTestNextSiblings = s), a);
  }
  yo.compileToken = oj;
  function fSt(t, e, r) {
    var n;
    return t.reduce(
      function (o, i) {
        return o === Ou.default.falseFunc
          ? Ou.default.falseFunc
          : (0, lSt.compileGeneralSelector)(o, i, e, r, oj);
      },
      (n = e.rootFunc) !== null && n !== void 0 ? n : Ou.default.trueFunc,
    );
  }
  function hSt(t, e) {
    return e === Ou.default.falseFunc || t === Ou.default.trueFunc
      ? t
      : t === Ou.default.falseFunc || e === Ou.default.trueFunc
        ? e
        : function (n) {
            return t(n) || e(n);
          };
  }
});
var GSe = A((Zt) => {
  "use strict";
  var gSt =
      (Zt && Zt.__createBinding) ||
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
    ySt =
      (Zt && Zt.__setModuleDefault) ||
      (Object.create
        ? function (t, e) {
            Object.defineProperty(t, "default", { enumerable: !0, value: e });
          }
        : function (t, e) {
            t.default = e;
          }),
    vSt =
      (Zt && Zt.__importStar) ||
      function (t) {
        if (t && t.__esModule) return t;
        var e = {};
        if (t != null)
          for (var r in t)
            r !== "default" && Object.prototype.hasOwnProperty.call(t, r) && gSt(e, t, r);
        return (ySt(e, t), e);
      },
    bSt =
      (Zt && Zt.__importDefault) ||
      function (t) {
        return t && t.__esModule ? t : { default: t };
      };
  Object.defineProperty(Zt, "__esModule", { value: !0 });
  Zt.aliases =
    Zt.pseudos =
    Zt.filters =
    Zt.is =
    Zt.selectOne =
    Zt.selectAll =
    Zt.prepareContext =
    Zt._compileToken =
    Zt._compileUnsafe =
    Zt.compile =
      void 0;
  var BSe = vSt(eSe()),
    FSe = bSt(em()),
    R_ = LSe(),
    SSt = m0(),
    $Se = function (t, e) {
      return t === e;
    },
    wSt = { adapter: BSe, equals: $Se };
  function ij(t) {
    var e,
      r,
      n,
      o,
      i = t ?? wSt;
    return (
      ((e = i.adapter) !== null && e !== void 0) || (i.adapter = BSe),
      ((r = i.equals) !== null && r !== void 0) ||
        (i.equals =
          (o = (n = i.adapter) === null || n === void 0 ? void 0 : n.equals) !== null &&
          o !== void 0
            ? o
            : $Se),
      i
    );
  }
  function sj(t) {
    return function (r, n, o) {
      var i = ij(n);
      return t(r, i, o);
    };
  }
  Zt.compile = sj(R_.compile);
  Zt._compileUnsafe = sj(R_.compileUnsafe);
  Zt._compileToken = sj(R_.compileToken);
  function USe(t) {
    return function (r, n, o) {
      var i = ij(o);
      typeof r != "function" && (r = (0, R_.compileUnsafe)(r, i, n));
      var s = qSe(n, i.adapter, r.shouldTestNextSiblings);
      return t(r, s, i);
    };
  }
  function qSe(t, e, r) {
    return (
      r === void 0 && (r = !1),
      r && (t = _St(t, e)),
      Array.isArray(t) ? e.removeSubsets(t) : e.getChildren(t)
    );
  }
  Zt.prepareContext = qSe;
  function _St(t, e) {
    for (var r = Array.isArray(t) ? t.slice(0) : [t], n = r.length, o = 0; o < n; o++) {
      var i = (0, SSt.getNextSiblings)(r[o], e);
      r.push.apply(r, i);
    }
    return r;
  }
  Zt.selectAll = USe(function (t, e, r) {
    return t === FSe.default.falseFunc || !e || e.length === 0 ? [] : r.adapter.findAll(t, e);
  });
  Zt.selectOne = USe(function (t, e, r) {
    return t === FSe.default.falseFunc || !e || e.length === 0 ? null : r.adapter.findOne(t, e);
  });
  function xSt(t, e, r) {
    var n = ij(r);
    return (typeof e == "function" ? e : (0, R_.compile)(e, n))(t);
  }
  Zt.is = xSt;
  Zt.default = Zt.selectAll;
  var aj = tj();
  Object.defineProperty(Zt, "filters", {
    enumerable: !0,
    get: function () {
      return aj.filters;
    },
  });
  Object.defineProperty(Zt, "pseudos", {
    enumerable: !0,
    get: function () {
      return aj.pseudos;
    },
  });
  Object.defineProperty(Zt, "aliases", {
    enumerable: !0,
    get: function () {
      return aj.aliases;
    },
  });
});
var WSe = A((lj) => {
  "use strict";
  Object.defineProperty(lj, "__esModule", { value: !0 });
  function ASt(t) {
    return t[t.length - 1];
  }
  lj.default = ASt;
});
var KSe = A((E_) => {
  "use strict";
  var RSt =
    (E_ && E_.__importDefault) ||
    function (t) {
      return t && t.__esModule ? t : { default: t };
    };
  Object.defineProperty(E_, "__esModule", { value: !0 });
  var ESt = RSt(Og());
  function h0(t) {
    return t && t.nodeType === ESt.default.ELEMENT_NODE;
  }
  function HSe(t, e) {
    return h0(t) ? t.getAttribute(e) : void 0;
  }
  function CSt(t) {
    return ((t && t.rawTagName) || "").toLowerCase();
  }
  function C_(t) {
    return t && t.childNodes;
  }
  function cj(t) {
    return t ? t.parentNode : null;
  }
  function TSt(t) {
    return t.text;
  }
  function PSt(t) {
    let e = t.length,
      r,
      n,
      o;
    for (; --e > -1; ) {
      for (r = n = t[e], t[e] = null, o = !0; n; ) {
        if (t.indexOf(n) > -1) {
          ((o = !1), t.splice(e, 1));
          break;
        }
        n = cj(n);
      }
      o && (t[e] = r);
    }
    return t;
  }
  function jSe(t, e) {
    return e.some((r) => (h0(r) ? t(r) || jSe(t, C_(r)) : !1));
  }
  function ISt(t) {
    let e = cj(t);
    return e ? C_(e) : [];
  }
  function kSt(t, e) {
    return HSe(t, e) !== void 0;
  }
  function zSe(t, e) {
    let r = null;
    for (let n = 0, o = e?.length; n < o && !r; n++) {
      let i = e[n];
      if (t(i)) r = i;
      else {
        let s = C_(i);
        s && s.length > 0 && (r = zSe(t, s));
      }
    }
    return r;
  }
  function VSe(t, e) {
    let r = [];
    for (let n = 0, o = e.length; n < o; n++) {
      if (!h0(e[n])) continue;
      t(e[n]) && r.push(e[n]);
      let i = C_(e[n]);
      i && (r = r.concat(VSe(t, i)));
    }
    return r;
  }
  E_.default = {
    isTag: h0,
    getAttributeValue: HSe,
    getName: CSt,
    getChildren: C_,
    getParent: cj,
    getText: TSt,
    removeSubsets: PSt,
    existsOne: jSe,
    getSiblings: ISt,
    hasAttrib: kSt,
    findOne: zSe,
    findAll: VSe,
  };
});
var ZSe = A((dj) => {
  "use strict";
  Object.defineProperty(dj, "__esModule", { value: !0 });
  var uj = class {
    constructor(e = !1, r) {
      ((this.addClosingSlash = e),
        Array.isArray(r)
          ? (this.voidTags = r.reduce(
              (n, o) => n.add(o.toLowerCase()).add(o.toUpperCase()).add(o),
              new Set(),
            ))
          : (this.voidTags = [
              "area",
              "base",
              "br",
              "col",
              "embed",
              "hr",
              "img",
              "input",
              "link",
              "meta",
              "param",
              "source",
              "track",
              "wbr",
            ].reduce((n, o) => n.add(o.toLowerCase()).add(o.toUpperCase()).add(o), new Set())));
    }
    formatNode(e, r, n) {
      let o = this.addClosingSlash,
        i = o && r && !r.endsWith(" ") ? " " : "",
        s = o ? `${i}/` : "";
      return this.isVoidElement(e.toLowerCase()) ? `<${e}${r}${s}>` : `<${e}${r}>${n}</${e}>`;
    }
    isVoidElement(e) {
      return this.voidTags.has(e);
    }
  };
  dj.default = uj;
});
var mj = A((T_) => {
  "use strict";
  var YSe =
    (T_ && T_.__importDefault) ||
    function (t) {
      return t && t.__esModule ? t : { default: t };
    };
  Object.defineProperty(T_, "__esModule", { value: !0 });
  var DSt = Yk(),
    MSt = YSe(f_()),
    OSt = YSe(Og()),
    pj = class t extends MSt.default {
      clone() {
        return new t(this._rawText, null);
      }
      constructor(e, r = null, n) {
        (super(r, n),
          (this.nodeType = OSt.default.TEXT_NODE),
          (this.rawTagName = ""),
          (this._rawText = e));
      }
      get rawText() {
        return this._rawText;
      }
      set rawText(e) {
        ((this._rawText = e), (this._trimmedRawText = void 0), (this._trimmedText = void 0));
      }
      get trimmedRawText() {
        return this._trimmedRawText !== void 0
          ? this._trimmedRawText
          : ((this._trimmedRawText = XSe(this.rawText)), this._trimmedRawText);
      }
      get trimmedText() {
        return this._trimmedText !== void 0
          ? this._trimmedText
          : ((this._trimmedText = XSe(this.text)), this._trimmedText);
      }
      get text() {
        return (0, DSt.decode)(this.rawText);
      }
      get isWhitespace() {
        return /^(\s|&nbsp;)*$/.test(this.rawText);
      }
      toString() {
        return this.rawText;
      }
    };
  T_.default = pj;
  function XSe(t) {
    let e = 0,
      r,
      n;
    for (; e >= 0 && e < t.length; )
      (/\S/.test(t[e]) && (r === void 0 ? ((r = e), (e = t.length)) : ((n = e), (e = void 0))),
        r === void 0 ? e++ : e--);
    (r === void 0 && (r = 0), n === void 0 && (n = t.length - 1));
    let o = r > 0 && /[^\S\r\n]/.test(t[r - 1]),
      i = n < t.length - 1 && /[^\S\r\n]/.test(t[n + 1]);
    return (o ? " " : "") + t.slice(r, n + 1) + (i ? " " : "");
  }
});
var b0 = A((nc) => {
  "use strict";
  var Lu =
    (nc && nc.__importDefault) ||
    function (t) {
      return t && t.__esModule ? t : { default: t };
    };
  Object.defineProperty(nc, "__esModule", { value: !0 });
  nc.parse = nc.base_parse = void 0;
  var g0 = GSe(),
    NSt = Lu(Yk()),
    Nu = Lu(WSe()),
    y0 = Lu(KSe()),
    twe = Lu(ZSe()),
    LSt = Lu(DH()),
    fj = Lu(f_()),
    nm = Lu(mj()),
    Ba = Lu(Og());
  function P_(t) {
    return JSON.parse(JSON.stringify(NSt.default.decode(t)));
  }
  var BSt = ["h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup"],
    FSt = ["details", "dialog", "dd", "div", "dt"],
    $St = ["fieldset", "figcaption", "figure", "footer", "form"],
    USt = ["table", "td", "tr"],
    qSt = [
      "address",
      "article",
      "aside",
      "blockquote",
      "br",
      "hr",
      "li",
      "main",
      "nav",
      "ol",
      "p",
      "pre",
      "section",
      "ul",
    ],
    hj = new Set();
  function GSt(...t) {
    let e = (r) => {
      for (let n = 0; n < r.length; n++) {
        let o = r[n];
        (hj.add(o), hj.add(o.toUpperCase()));
      }
    };
    for (let r of t) e(r);
  }
  GSt(BSt, FSt, $St, USt, qSt);
  var gj = class {
      _validate(e) {
        if (/\s/.test(e))
          throw new Error(
            `DOMException in DOMTokenList.add: The token '${e}' contains HTML space characters, which are not valid in tokens.`,
          );
      }
      constructor(e = [], r = () => null) {
        ((this._set = new Set(e)), (this._afterUpdate = r));
      }
      add(e) {
        (this._validate(e), this._set.add(e), this._afterUpdate(this));
      }
      replace(e, r) {
        (this._validate(r), this._set.delete(e), this._set.add(r), this._afterUpdate(this));
      }
      remove(e) {
        this._set.delete(e) && this._afterUpdate(this);
      }
      toggle(e) {
        (this._validate(e),
          this._set.has(e) ? this._set.delete(e) : this._set.add(e),
          this._afterUpdate(this));
      }
      contains(e) {
        return this._set.has(e);
      }
      get length() {
        return this._set.size;
      }
      values() {
        return this._set.values();
      }
      get value() {
        return Array.from(this._set.values());
      }
      toString() {
        return Array.from(this._set.values()).join(" ");
      }
    },
    k_ = class t extends fj.default {
      quoteAttribute(e) {
        return e == null
          ? "null"
          : JSON.stringify(e.replace(/"/g, "&quot;"))
              .replace(/\\t/g, "	")
              .replace(
                /\\n/g,
                `
`,
              )
              .replace(/\\r/g, "\r")
              .replace(/\\/g, "");
      }
      constructor(e, r, n = "", o = null, i, s = new twe.default(), a = {}) {
        if (
          (super(o, i),
          (this.rawAttrs = n),
          (this.voidTag = s),
          (this.nodeType = Ba.default.ELEMENT_NODE),
          (this.rawTagName = e),
          (this.rawAttrs = n || ""),
          (this._id = r.id || ""),
          (this.childNodes = []),
          (this._parseOptions = a),
          (this.classList = new gj(r.class ? r.class.split(/\s+/) : [], (l) =>
            this.setAttribute("class", l.toString()),
          )),
          r.id && (n || (this.rawAttrs = `id="${r.id}"`)),
          r.class && !n)
        ) {
          let l = `class="${this.classList.toString()}"`;
          this.rawAttrs ? (this.rawAttrs += ` ${l}`) : (this.rawAttrs = l);
        }
      }
      removeChild(e) {
        return ((this.childNodes = this.childNodes.filter((r) => r !== e)), this);
      }
      exchangeChild(e, r) {
        let n = this.childNodes;
        return ((this.childNodes = n.map((o) => (o === e ? r : o))), this);
      }
      get tagName() {
        return this.rawTagName ? this.rawTagName.toUpperCase() : this.rawTagName;
      }
      set tagName(e) {
        this.rawTagName = e.toLowerCase();
      }
      get localName() {
        return this.rawTagName.toLowerCase();
      }
      get isVoidElement() {
        return this.voidTag.isVoidElement(this.localName);
      }
      get id() {
        return this._id;
      }
      set id(e) {
        this.setAttribute("id", e);
      }
      get rawText() {
        return /^br$/i.test(this.rawTagName)
          ? `
`
          : this.childNodes.reduce((e, r) => (e += r.rawText), "");
      }
      get textContent() {
        return P_(this.rawText);
      }
      set textContent(e) {
        let r = [new nm.default(e, this)];
        this.childNodes = r;
      }
      get text() {
        return P_(this.rawText);
      }
      get structuredText() {
        let e = [],
          r = [e];
        function n(o) {
          if (o.nodeType === Ba.default.ELEMENT_NODE)
            hj.has(o.rawTagName)
              ? (e.length > 0 && r.push((e = [])),
                o.childNodes.forEach(n),
                e.length > 0 && r.push((e = [])))
              : o.childNodes.forEach(n);
          else if (o.nodeType === Ba.default.TEXT_NODE)
            if (o.isWhitespace) e.prependWhitespace = !0;
            else {
              let i = o.trimmedText;
              (e.prependWhitespace && ((i = ` ${i}`), (e.prependWhitespace = !1)), e.push(i));
            }
        }
        return (
          n(this),
          r
            .map((o) => o.join("").replace(/\s{2,}/g, " "))
            .join(
              `
`,
            )
            .replace(/\s+$/, "")
        );
      }
      toString() {
        let e = this.rawTagName;
        if (e) {
          let r = this.rawAttrs ? ` ${this.rawAttrs}` : "";
          return this.voidTag.formatNode(e, r, this.innerHTML);
        }
        return this.innerHTML;
      }
      get innerHTML() {
        return this.childNodes.map((e) => e.toString()).join("");
      }
      set innerHTML(e) {
        let r = Wg(e, this._parseOptions),
          n = r.childNodes.length ? r.childNodes : [new nm.default(e, this)];
        (Fa(n, this), Fa(this.childNodes, null), (this.childNodes = n));
      }
      set_content(e, r = {}) {
        if (e instanceof fj.default) e = [e];
        else if (typeof e == "string") {
          r = Object.assign(Object.assign({}, this._parseOptions), r);
          let n = Wg(e, r);
          e = n.childNodes.length ? n.childNodes : [new nm.default(n.innerHTML, this)];
        }
        return (Fa(this.childNodes, null), Fa(e, this), (this.childNodes = e), this);
      }
      replaceWith(...e) {
        let r = this.parentNode,
          n = e
            .map((i) => {
              if (i instanceof fj.default) return [i];
              if (typeof i == "string") {
                let s = Wg(i, this._parseOptions);
                return s.childNodes.length ? s.childNodes : [new nm.default(i, this)];
              }
              return [];
            })
            .flat(),
          o = r.childNodes.findIndex((i) => i === this);
        return (
          Fa([this], null),
          (r.childNodes = [...r.childNodes.slice(0, o), ...Fa(n, r), ...r.childNodes.slice(o + 1)]),
          this
        );
      }
      get outerHTML() {
        return this.toString();
      }
      trimRight(e) {
        for (let r = 0; r < this.childNodes.length; r++) {
          let n = this.childNodes[r];
          if (n.nodeType === Ba.default.ELEMENT_NODE) n.trimRight(e);
          else {
            let o = n.rawText.search(e);
            o > -1 && ((n.rawText = n.rawText.substr(0, o)), (this.childNodes.length = r + 1));
          }
        }
        return this;
      }
      get structure() {
        let e = [],
          r = 0;
        function n(i) {
          e.push("  ".repeat(r) + i);
        }
        function o(i) {
          let s = i._id ? `#${i._id}` : "",
            a = i.classList.length ? `.${i.classList.value.join(".")}` : "";
          (n(`${i.rawTagName}${s}${a}`),
            r++,
            i.childNodes.forEach((l) => {
              l.nodeType === Ba.default.ELEMENT_NODE
                ? o(l)
                : l.nodeType === Ba.default.TEXT_NODE && (l.isWhitespace || n("#text"));
            }),
            r--);
        }
        return (
          o(this),
          e.join(`
`)
        );
      }
      removeWhitespace() {
        let e = 0;
        (this.childNodes.forEach((n) => {
          if (n.nodeType === Ba.default.TEXT_NODE) {
            if (n.isWhitespace) return;
            n.rawText = n.trimmedRawText;
          } else n.nodeType === Ba.default.ELEMENT_NODE && n.removeWhitespace();
          this.childNodes[e++] = n;
        }),
          (this.childNodes.length = e));
        let r = Object.keys(this.rawAttributes)
          .map((n) => {
            let o = this.rawAttributes[n];
            return `${n}=${JSON.stringify(o)}`;
          })
          .join(" ");
        return ((this.rawAttrs = r), delete this._rawAttrs, this);
      }
      querySelectorAll(e) {
        return (0, g0.selectAll)(e, this, { xmlMode: !0, adapter: y0.default });
      }
      querySelector(e) {
        return (0, g0.selectOne)(e, this, { xmlMode: !0, adapter: y0.default });
      }
      matches(e) {
        return (0, g0.is)(this, e, { xmlMode: !0, adapter: y0.default });
      }
      getElementsByTagName(e) {
        let r = e.toUpperCase(),
          n = [],
          o = [],
          i = this,
          s = 0;
        for (; s !== void 0; ) {
          let a;
          do a = i.childNodes[s++];
          while (s < i.childNodes.length && a === void 0);
          if (a === void 0) {
            ((i = i.parentNode), (s = o.pop()));
            continue;
          }
          a.nodeType === Ba.default.ELEMENT_NODE &&
            ((e === "*" || a.tagName === r) && n.push(a),
            a.childNodes.length > 0 && (o.push(s), (i = a), (s = 0)));
        }
        return n;
      }
      getElementById(e) {
        let r = [],
          n = this,
          o = 0;
        for (; o !== void 0; ) {
          let i;
          do i = n.childNodes[o++];
          while (o < n.childNodes.length && i === void 0);
          if (i === void 0) {
            ((n = n.parentNode), (o = r.pop()));
            continue;
          }
          if (i.nodeType === Ba.default.ELEMENT_NODE) {
            if (i._id === e) return i;
            i.childNodes.length > 0 && (r.push(o), (n = i), (o = 0));
          }
        }
        return null;
      }
      closest(e) {
        let r = new Map(),
          n = this,
          o = null;
        function i(s, a) {
          let l = null;
          for (let c = 0, u = a.length; c < u && !l; c++) {
            let p = a[c];
            if (s(p)) l = p;
            else {
              let m = r.get(p);
              m && (l = i(s, [m]));
            }
          }
          return l;
        }
        for (; n; ) (r.set(n, o), (o = n), (n = n.parentNode));
        for (n = this; n; ) {
          let s = (0, g0.selectOne)(e, n, {
            xmlMode: !0,
            adapter: Object.assign(Object.assign({}, y0.default), {
              getChildren(a) {
                let l = r.get(a);
                return l && [l];
              },
              getSiblings(a) {
                return [a];
              },
              findOne: i,
              findAll() {
                return [];
              },
            }),
          });
          if (s) return s;
          n = n.parentNode;
        }
        return null;
      }
      appendChild(e) {
        return (this.append(e), e);
      }
      get attrs() {
        if (this._attrs) return this._attrs;
        this._attrs = {};
        let e = this.rawAttributes;
        for (let r in e) {
          let n = e[r] || "";
          this._attrs[r.toLowerCase()] = P_(n);
        }
        return this._attrs;
      }
      get attributes() {
        let e = {},
          r = this.rawAttributes;
        for (let n in r) {
          let o = r[n] || "";
          e[n] = P_(o);
        }
        return e;
      }
      get rawAttributes() {
        if (this._rawAttrs) return this._rawAttrs;
        let e = {};
        if (this.rawAttrs) {
          let r =
              /([a-zA-Z()[\]#@$.?:][a-zA-Z0-9-._:()[\]#]*)(?:\s*=\s*((?:'[^']*')|(?:"[^"]*")|\S+))?/g,
            n;
          for (; (n = r.exec(this.rawAttrs)); ) {
            let o = n[1],
              i = n[2] || null;
            (i && (i[0] === "'" || i[0] === '"') && (i = i.slice(1, i.length - 1)),
              (e[o] = e[o] || i));
          }
        }
        return ((this._rawAttrs = e), e);
      }
      removeAttribute(e) {
        let r = this.rawAttributes;
        return (
          delete r[e],
          this._attrs && delete this._attrs[e],
          (this.rawAttrs = Object.keys(r)
            .map((n) => {
              let o = this.quoteAttribute(r[n]);
              return o === "null" || o === '""' ? n : `${n}=${o}`;
            })
            .join(" ")),
          e === "id" && (this._id = ""),
          this
        );
      }
      hasAttribute(e) {
        return e.toLowerCase() in this.attrs;
      }
      getAttribute(e) {
        return this.attrs[e.toLowerCase()];
      }
      setAttribute(e, r) {
        if (arguments.length < 2) throw new Error("Failed to execute 'setAttribute' on 'Element'");
        let n = e.toLowerCase(),
          o = this.rawAttributes;
        for (let i in o)
          if (i.toLowerCase() === n) {
            e = i;
            break;
          }
        return (
          (o[e] = String(r)),
          this._attrs && (this._attrs[n] = P_(o[e])),
          (this.rawAttrs = Object.keys(o)
            .map((i) => {
              let s = this.quoteAttribute(o[i]);
              return s === "null" || s === '""' ? i : `${i}=${s}`;
            })
            .join(" ")),
          e === "id" && (this._id = r),
          this
        );
      }
      setAttributes(e) {
        return (
          this._attrs && delete this._attrs,
          this._rawAttrs && delete this._rawAttrs,
          (this.rawAttrs = Object.keys(e)
            .map((r) => {
              let n = e[r];
              return n === "null" || n === '""' ? r : `${r}=${this.quoteAttribute(String(n))}`;
            })
            .join(" ")),
          "id" in e && (this._id = e.id),
          this
        );
      }
      insertAdjacentHTML(e, r) {
        if (arguments.length < 2) throw new Error("2 arguments required");
        let n = Wg(r, this._parseOptions);
        if (e === "afterend") this.after(...n.childNodes);
        else if (e === "afterbegin") this.prepend(...n.childNodes);
        else if (e === "beforeend") this.append(...n.childNodes);
        else if (e === "beforebegin") this.before(...n.childNodes);
        else
          throw new Error(
            `The value provided ('${e}') is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'`,
          );
        return this;
      }
      prepend(...e) {
        let r = v0(e);
        (Fa(r, this), this.childNodes.unshift(...r));
      }
      append(...e) {
        let r = v0(e);
        (Fa(r, this), this.childNodes.push(...r));
      }
      before(...e) {
        let r = v0(e),
          n = this.parentNode.childNodes;
        (Fa(r, this.parentNode), n.splice(n.indexOf(this), 0, ...r));
      }
      after(...e) {
        let r = v0(e),
          n = this.parentNode.childNodes;
        (Fa(r, this.parentNode), n.splice(n.indexOf(this) + 1, 0, ...r));
      }
      get nextSibling() {
        if (this.parentNode) {
          let e = this.parentNode.childNodes,
            r = 0;
          for (; r < e.length; ) {
            let n = e[r++];
            if (this === n) return e[r] || null;
          }
          return null;
        }
      }
      get nextElementSibling() {
        if (this.parentNode) {
          let e = this.parentNode.childNodes,
            r = 0,
            n = !1;
          for (; r < e.length; ) {
            let o = e[r++];
            if (n) {
              if (o instanceof t) return o || null;
            } else this === o && (n = !0);
          }
          return null;
        }
      }
      get previousSibling() {
        if (this.parentNode) {
          let e = this.parentNode.childNodes,
            r = e.length;
          for (; r > 0; ) {
            let n = e[--r];
            if (this === n) return e[r - 1] || null;
          }
          return null;
        }
      }
      get previousElementSibling() {
        if (this.parentNode) {
          let e = this.parentNode.childNodes,
            r = e.length,
            n = !1;
          for (; r > 0; ) {
            let o = e[--r];
            if (n) {
              if (o instanceof t) return o || null;
            } else this === o && (n = !0);
          }
          return null;
        }
      }
      get children() {
        let e = [];
        for (let r of this.childNodes) r instanceof t && e.push(r);
        return e;
      }
      get firstChild() {
        return this.childNodes[0];
      }
      get firstElementChild() {
        return this.children[0];
      }
      get lastChild() {
        return (0, Nu.default)(this.childNodes);
      }
      get lastElementChild() {
        return this.children[this.children.length - 1];
      }
      get childElementCount() {
        return this.children.length;
      }
      get classNames() {
        return this.classList.toString();
      }
      clone() {
        return Wg(this.toString(), this._parseOptions).firstChild;
      }
    };
  nc.default = k_;
  var rc =
      /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][-.:0-9_a-zA-Z@\xB7\xC0-\xD6\xD8-\xF6\u00F8-\u03A1\u03A3-\u03D9\u03DB-\u03EF\u03F7-\u03FF\u0400-\u04FF\u0500-\u052F\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E00-\u1E9B\u1F00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2126\u212A-\u212B\u2132\u214E\u2160-\u2188\u2C60-\u2C7F\uA722-\uA787\uA78B-\uA78E\uA790-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA7FF\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64-\uAB65\uFB00-\uFB06\uFB13-\uFB17\uFF21-\uFF3A\uFF41-\uFF5A\x37F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]*)((?:\s+[^>]*?(?:(?:'[^']*')|(?:"[^"]*"))?)*)\s*(\/?)>/gu,
    WSt = /(?:^|\s)(id|class)\s*=\s*((?:'[^']*')|(?:"[^"]*")|\S+)/gi,
    JSe = {
      li: { li: !0, LI: !0 },
      LI: { li: !0, LI: !0 },
      p: { p: !0, div: !0, P: !0, DIV: !0 },
      P: { p: !0, div: !0, P: !0, DIV: !0 },
      b: { div: !0, DIV: !0 },
      B: { div: !0, DIV: !0 },
      td: { td: !0, th: !0, TD: !0, TH: !0 },
      TD: { td: !0, th: !0, TD: !0, TH: !0 },
      th: { td: !0, th: !0, TD: !0, TH: !0 },
      TH: { td: !0, th: !0, TD: !0, TH: !0 },
      h1: { h1: !0, H1: !0 },
      H1: { h1: !0, H1: !0 },
      h2: { h2: !0, H2: !0 },
      H2: { h2: !0, H2: !0 },
      h3: { h3: !0, H3: !0 },
      H3: { h3: !0, H3: !0 },
      h4: { h4: !0, H4: !0 },
      H4: { h4: !0, H4: !0 },
      h5: { h5: !0, H5: !0 },
      H5: { h5: !0, H5: !0 },
      h6: { h6: !0, H6: !0 },
      H6: { h6: !0, H6: !0 },
    },
    QSe = {
      li: { ul: !0, ol: !0, UL: !0, OL: !0 },
      LI: { ul: !0, ol: !0, UL: !0, OL: !0 },
      a: { div: !0, DIV: !0 },
      A: { div: !0, DIV: !0 },
      b: { div: !0, DIV: !0 },
      B: { div: !0, DIV: !0 },
      i: { div: !0, DIV: !0 },
      I: { div: !0, DIV: !0 },
      p: { div: !0, DIV: !0 },
      P: { div: !0, DIV: !0 },
      td: { tr: !0, table: !0, TR: !0, TABLE: !0 },
      TD: { tr: !0, table: !0, TR: !0, TABLE: !0 },
      th: { tr: !0, table: !0, TR: !0, TABLE: !0 },
      TH: { tr: !0, table: !0, TR: !0, TABLE: !0 },
    },
    ewe = { p: { a: !0, audio: !0, del: !0, ins: !0, map: !0, noscript: !0, video: !0 } },
    I_ = "documentfragmentcontainer";
  function rwe(t, e = {}) {
    var r, n;
    let o = new twe.default(
        (r = e?.voidTag) === null || r === void 0 ? void 0 : r.closingSlash,
        (n = e?.voidTag) === null || n === void 0 ? void 0 : n.tags,
      ),
      i = e.blockTextElements || { script: !0, noscript: !0, style: !0, pre: !0 },
      s = Object.keys(i),
      a = s.map((P) => new RegExp(`^${P}$`, "i")),
      l = s.filter((P) => !!i[P]).map((P) => new RegExp(`^${P}$`, "i"));
    function c(P) {
      return l.some((M) => M.test(P));
    }
    function u(P) {
      return a.some((M) => M.test(P));
    }
    let p = (P, M) => [P - T, M - T],
      m = new k_(null, {}, "", null, [0, t.length], o, e),
      f = m,
      h = [m],
      v = -1,
      y,
      w;
    t = `<${I_}>${t}</${I_}>`;
    let { lowerCaseTagName: _, fixNestedATags: S } = e,
      E = t.length - (I_.length + 2),
      T = I_.length + 2;
    for (; (w = rc.exec(t)); ) {
      let { 0: P, 1: M, 2: L, 3: V, 4: de } = w,
        ue = P.length,
        Ae = rc.lastIndex - ue,
        ge = rc.lastIndex;
      if (v > -1 && v + ue < ge) {
        let Pe = t.substring(v, Ae);
        f.appendChild(new nm.default(Pe, f, p(v, Ae)));
      }
      if (((v = rc.lastIndex), L !== I_)) {
        if (P[1] === "!") {
          if (e.comment) {
            let Pe = t.substring(Ae + 4, ge - 3);
            f.appendChild(new LSt.default(Pe, f, p(Ae, ge)));
          }
          continue;
        }
        if ((_ && (L = L.toLowerCase()), !M)) {
          let Pe = {};
          for (let ce; (ce = WSt.exec(V)); ) {
            let { 1: Ce, 2: De } = ce,
              Ge = De[0] === "'" || De[0] === '"';
            Pe[Ce.toLowerCase()] = Ge ? De.slice(1, De.length - 1) : De;
          }
          let Q = f.rawTagName;
          (!de &&
            !e.preserveTagNesting &&
            JSe[Q] &&
            JSe[Q][L] &&
            (h.pop(), (f = (0, Nu.default)(h))),
            S &&
              (L === "a" || L === "A") &&
              (y !== void 0 && (h.splice(y), (f = (0, Nu.default)(h))), (y = h.length)));
          let X = rc.lastIndex,
            G = X - ue;
          if (
            ((f = f.appendChild(new k_(L, Pe, V.slice(1), null, p(G, X), o, e))), h.push(f), u(L))
          ) {
            let ce = `</${L}>`,
              Ce = _
                ? t.toLocaleLowerCase().indexOf(ce, rc.lastIndex)
                : t.indexOf(ce, rc.lastIndex),
              De = Ce === -1 ? E : Ce;
            if (c(L)) {
              let Ge = t.substring(X, De);
              Ge.length > 0 && /\S/.test(Ge) && f.appendChild(new nm.default(Ge, f, p(X, De)));
            }
            Ce === -1
              ? (v = rc.lastIndex = t.length + 1)
              : ((v = rc.lastIndex = Ce + ce.length), (M = "/"));
          }
        }
        if (M || de || o.isVoidElement(L))
          for (;;)
            if ((y != null && (L === "a" || L === "A") && (y = void 0), f.rawTagName === L)) {
              ((f.range[1] = p(-1, Math.max(v, ge))[1]), h.pop(), (f = (0, Nu.default)(h)));
              break;
            } else {
              let Pe = f.tagName;
              if (QSe[Pe] && QSe[Pe][L]) {
                (h.pop(), (f = (0, Nu.default)(h)));
                continue;
              }
              let Q = f.rawTagName ? f.rawTagName.toLowerCase() : "";
              if (ewe[Q]) {
                let X = L.toLowerCase();
                if (h.length > 1) {
                  let G = h[h.length - 2];
                  if (G && G.rawTagName && G.rawTagName.toLowerCase() === X && !ewe[Q][X]) {
                    ((f.range[1] = p(-1, Math.max(v, ge))[1]), h.pop(), (f = (0, Nu.default)(h)));
                    continue;
                  }
                }
              }
              if (e.closeAllByClosing === !0) {
                let X;
                for (X = h.length - 2; X >= 0 && h[X].rawTagName !== L; X--);
                if (X >= 0) {
                  for (; h.length > X; )
                    ((f.range[1] = p(-1, Math.max(v, ge))[1]), h.pop(), (f = (0, Nu.default)(h)));
                  continue;
                }
              }
              break;
            }
      }
    }
    return h;
  }
  nc.base_parse = rwe;
  function Wg(t, e = {}) {
    let r = rwe(t, e),
      [n] = r;
    for (; r.length > 1; ) {
      let o = r.pop(),
        i = (0, Nu.default)(r);
      o.parentNode &&
        o.parentNode.parentNode &&
        (o.parentNode === i && o.tagName === i.tagName
          ? e.parseNoneClosedTags !== !0 &&
            (i.removeChild(o),
            o.childNodes.forEach((s) => {
              i.parentNode.appendChild(s);
            }),
            r.pop())
          : e.parseNoneClosedTags !== !0 &&
            (i.removeChild(o),
            o.childNodes.forEach((s) => {
              i.appendChild(s);
            })));
    }
    return n;
  }
  nc.parse = Wg;
  function v0(t) {
    return t.map((e) => (typeof e == "string" ? new nm.default(e) : (e.remove(), e)));
  }
  function Fa(t, e) {
    return t.map((r) => ((r.parentNode = e), r));
  }
});
var nwe = A((S0) => {
  "use strict";
  Object.defineProperty(S0, "__esModule", { value: !0 });
  S0.default = void 0;
  var HSt = b0();
  Object.defineProperty(S0, "default", {
    enumerable: !0,
    get: function () {
      return HSt.parse;
    },
  });
});
var owe = A((yj) => {
  "use strict";
  Object.defineProperty(yj, "__esModule", { value: !0 });
  var jSt = b0();
  function zSt(t, e = {}) {
    return (0, jSt.base_parse)(t, e).length === 1;
  }
  yj.default = zSt;
});
var vj = A((xn) => {
  "use strict";
  var om =
    (xn && xn.__importDefault) ||
    function (t) {
      return t && t.__esModule ? t : { default: t };
    };
  Object.defineProperty(xn, "__esModule", { value: !0 });
  xn.NodeType =
    xn.TextNode =
    xn.Node =
    xn.valid =
    xn.CommentNode =
    xn.HTMLElement =
    xn.parse =
      void 0;
  var iwe = om(DH());
  xn.CommentNode = iwe.default;
  var swe = om(b0());
  xn.HTMLElement = swe.default;
  var awe = om(f_());
  xn.Node = awe.default;
  var lwe = om(mj());
  xn.TextNode = lwe.default;
  var cwe = om(Og());
  xn.NodeType = cwe.default;
  var uwe = om(nwe()),
    dwe = om(owe());
  xn.valid = dwe.default;
  function oc(t, e = {}) {
    return (0, uwe.default)(t, e);
  }
  xn.default = oc;
  xn.parse = oc;
  oc.parse = uwe.default;
  oc.HTMLElement = swe.default;
  oc.CommentNode = iwe.default;
  oc.valid = dwe.default;
  oc.Node = awe.default;
  oc.TextNode = lwe.default;
  oc.NodeType = cwe.default;
});
function bj(t, e) {
  return t?.replace(/\s+/g, " ").trim().slice(0, e) || null;
}
var fwe,
  w0,
  VSt,
  KSt,
  ZSt,
  pwe,
  XSt,
  mwe,
  YSt,
  _0,
  hwe = g(() => {
    ((fwe = require("node:dns/promises")), (w0 = require("node:util")));
    ot();
    $();
    gbe();
    ((VSt = d.object({ url: d.string().max(8192) })),
      (KSt = d.object({
        "@type": d.literal("MusicComposition"),
        audio: d.object({ inAlbum: d.object({ image: d.string().max(8192) }) }),
      })),
      (ZSt = d.object({
        title: d.string().nullish(),
        thumbnail_url: d.string().max(8192).nullish(),
      })),
      (pwe = 1024 * 1024),
      (XSt = 24 * 1024 * 1024),
      (mwe = 4),
      (YSt = 8),
      (_0 = class extends ee {
        #e;
        #t;
        #r = new Map();
        #n = new Map();
        #i = new Set();
        #o = [];
        #s = 0;
        #a = 0;
        #c = !1;
        constructor(e, r = (n) => (0, fwe.lookup)(n, { all: !0 })) {
          (super(), (this.#e = e), (this.#t = r));
        }
        async get(e) {
          let r = VSt.safeParse(e),
            n = r.success ? p_(r.data.url) : null;
          if (this.#c || n == null) return { status: "unavailable" };
          let o = n.href,
            i = this.#r.get(o);
          if (i != null && (this.#r.delete(o), (this.#s -= i.bytes), i.expiresAt > Date.now()))
            return (this.#r.set(o, i), (this.#s += i.bytes), i.value);
          let s = this.#n.get(o);
          if (s != null) return s;
          if (this.#a >= mwe && this.#o.length >= YSt) return { status: "unavailable" };
          let a = this.#l(n)
            .catch(() => ({ status: "unavailable" }))
            .then((l) => {
              if (!this.#c) {
                let c = JSON.stringify(l).length * 2;
                for (
                  this.#r.set(o, {
                    value: l,
                    bytes: c,
                    expiresAt: Date.now() + (l.status === "ready" && l.image != null ? 6e5 : 3e4),
                  }),
                    this.#s += c;
                  this.#r.size > 32 || this.#s > XSt;

                ) {
                  let u = this.#r.entries().next().value;
                  if (u == null) break;
                  (this.#r.delete(u[0]), (this.#s -= u[1].bytes));
                }
              }
              return l;
            })
            .finally(() => {
              this.#n.delete(o);
            });
          return (this.#n.set(o, a), a);
        }
        [Symbol.dispose]() {
          this.#c = !0;
          for (let e of this.#i) e.abort();
          for (let e of this.#o.splice(0)) e(!1);
          (this.#i.clear(), this.#r.clear(), (this.#s = 0));
        }
        async #l(e) {
          if (this.#a >= mwe) {
            let o = await new Promise((i) => {
              this.#o.push(i);
            });
            if (!o || this.#c) return (o && this.#d(), { status: "unavailable" });
          } else this.#a++;
          let r = new AbortController();
          this.#i.add(r);
          let n = setTimeout(() => r.abort(), 8e3);
          try {
            return await this.#m(e, r.signal);
          } finally {
            (clearTimeout(n), r.abort(), this.#i.delete(r), this.#d());
          }
        }
        #d() {
          let e = this.#c ? null : this.#o.shift();
          e == null ? this.#a-- : e(!0);
        }
        async #m(e, r) {
          let n = await this.#u(e, r, !0),
            o = n.response.headers.get("content-type"),
            i = o?.split(";")[0].trim().toLowerCase();
          if (i !== "text/html" && i !== "application/xhtml+xml")
            return (await n.response.body?.cancel(), { status: "unavailable" });
          let s = o?.match(/\bcharset\s*=\s*["']?([^\s;"']+)/i)?.[1],
            a;
          try {
            a = new w0.TextDecoder(s);
          } catch {
            a = new w0.TextDecoder();
          }
          let l = a.decode(await Zk(n.response, pwe, !0)),
            { parse: c } = await Promise.resolve().then(() => F(vj())),
            u = c(l),
            p = new Map();
          for (let S of u.querySelectorAll("meta")) {
            let E = (S.getAttribute("property") ?? S.getAttribute("name"))?.toLowerCase(),
              T = S.getAttribute("content")?.trim();
            E && T && !p.has(E) && p.set(E, T);
          }
          let m = bj(
              p.get("og:title") ?? p.get("twitter:title") ?? u.querySelector("title")?.text,
              300,
            ),
            f = bj(
              p.get("og:description") ?? p.get("twitter:description") ?? p.get("description"),
              1e3,
            ),
            h =
              p.get("og:image:secure_url") ??
              p.get("og:image") ??
              p.get("og:image:url") ??
              p.get("twitter:image") ??
              p.get("twitter:image:src"),
            v = h == null ? null : p_(h, n.url),
            y = null;
          if (n.url.hostname === "music.apple.com") {
            let S = u.querySelector('script[id="schema:song"][type="application/ld+json"]');
            if (S != null)
              try {
                let E = KSt.safeParse(JSON.parse(S.rawText));
                E.success && (y = E.data.audio.inAlbum.image);
              } catch {}
            else p.get("og:type") === "music.album" && (y = p.get("twitter:image") ?? null);
          } else if (
            n.url.hostname === "open.spotify.com" &&
            /^\/(?:intl-[a-z]{2}\/)?(?:track|album)\/[a-zA-Z0-9]{22}\/?$/u.test(n.url.pathname)
          ) {
            let S = new URL("/oembed", n.url);
            S.searchParams.set("url", n.url.origin + n.url.pathname);
            try {
              let { response: E } = await this.#u(S, r),
                T = ZSt.safeParse(JSON.parse(new w0.TextDecoder().decode(await Zk(E, pwe, !1))));
              T.success &&
                ((m =
                  bj(p.get("og:title") ?? p.get("twitter:title") ?? T.data.title ?? void 0, 300) ??
                  m),
                (y = T.data.thumbnail_url ?? null));
            } catch {}
          }
          let w = y == null ? null : p_(y, n.url),
            _ = w == null ? null : await this.#p(w, r).catch(() => null);
          return (
            _ == null && v != null && (_ = await this.#p(v, r).catch(() => null)),
            m == null && f == null && _ == null
              ? { status: "unavailable" }
              : { status: "ready", title: m, description: f, image: _ }
          );
        }
        async #p(e, r) {
          let { response: n } = await this.#u(e, r),
            o = await fbe(n, !0);
          return o == null
            ? null
            : {
                dataUrl: `data:${o.mimeType};base64,${Buffer.from(o.bytes).toString("base64")}`,
                width: o.width,
                height: o.height,
              };
        }
        async #u(e, r, n = !1) {
          let o = e;
          for (let i = 0; i <= 3; i++) {
            if ((r.throwIfAborted(), !(await hbe(o.hostname, r, this.#t))))
              throw new Error("Website preview destination is unavailable");
            r.throwIfAborted();
            let s = await this.#e(o.href, {
              method: "GET",
              credentials: "omit",
              redirect: "manual",
              referrerPolicy: "no-referrer",
              headers:
                n && o.hostname === "open.spotify.com"
                  ? { accept: "text/html", "user-agent": "Codex-WebsitePreview/1.0" }
                  : void 0,
              signal: r,
            });
            if (s.status >= 300 && s.status < 400) {
              let a = s.headers.get("location");
              await s.body?.cancel();
              let l = a == null ? null : p_(a, o);
              if (l == null) break;
              o = l;
              continue;
            }
            if (!s.ok) {
              await s.body?.cancel();
              break;
            }
            return { url: o, response: s };
          }
          throw new Error("Website preview response is unavailable");
        }
      }));
  });
