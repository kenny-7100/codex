var f_ = A((TH) => {
  "use strict";
  Object.defineProperty(TH, "__esModule", { value: !0 });
  var ybe = Yk(),
    CH = class {
      constructor(e = null, r) {
        ((this.parentNode = e),
          (this.childNodes = []),
          Object.defineProperty(this, "range", {
            enumerable: !1,
            writable: !0,
            configurable: !0,
            value: r ?? [-1, -1],
          }));
      }
      remove() {
        if (this.parentNode) {
          let e = this.parentNode.childNodes;
          ((this.parentNode.childNodes = e.filter((r) => this !== r)), (this.parentNode = null));
        }
        return this;
      }
      get innerText() {
        return this.rawText;
      }
      get textContent() {
        return (0, ybe.decode)(this.rawText);
      }
      set textContent(e) {
        this.rawText = (0, ybe.encode)(e);
      }
    };
  TH.default = CH;
});
var Og = A((IH) => {
  "use strict";
  Object.defineProperty(IH, "__esModule", { value: !0 });
  var PH;
  (function (t) {
    ((t[(t.ELEMENT_NODE = 1)] = "ELEMENT_NODE"),
      (t[(t.TEXT_NODE = 3)] = "TEXT_NODE"),
      (t[(t.COMMENT_NODE = 8)] = "COMMENT_NODE"));
  })(PH || (PH = {}));
  IH.default = PH;
});
var DH = A((h_) => {
  "use strict";
  var vbe =
    (h_ && h_.__importDefault) ||
    function (t) {
      return t && t.__esModule ? t : { default: t };
    };
  Object.defineProperty(h_, "__esModule", { value: !0 });
  var wvt = vbe(f_()),
    _vt = vbe(Og()),
    kH = class t extends wvt.default {
      clone() {
        return new t(this.rawText, null, void 0, this.rawTagName);
      }
      constructor(e, r = null, n, o = "!--") {
        (super(r, n),
          (this.rawText = e),
          (this.rawTagName = o),
          (this.nodeType = _vt.default.COMMENT_NODE));
      }
      get text() {
        return this.rawText;
      }
      toString() {
        return `<!--${this.rawText}-->`;
      }
    };
  h_.default = kH;
});
var g_ = A((xr) => {
  "use strict";
  Object.defineProperty(xr, "__esModule", { value: !0 });
  xr.Doctype =
    xr.CDATA =
    xr.Tag =
    xr.Style =
    xr.Script =
    xr.Comment =
    xr.Directive =
    xr.Text =
    xr.Root =
    xr.isTag =
    xr.ElementType =
      void 0;
  var Di;
  (function (t) {
    ((t.Root = "root"),
      (t.Text = "text"),
      (t.Directive = "directive"),
      (t.Comment = "comment"),
      (t.Script = "script"),
      (t.Style = "style"),
      (t.Tag = "tag"),
      (t.CDATA = "cdata"),
      (t.Doctype = "doctype"));
  })((Di = xr.ElementType || (xr.ElementType = {})));
  function xvt(t) {
    return t.type === Di.Tag || t.type === Di.Script || t.type === Di.Style;
  }
  xr.isTag = xvt;
  xr.Root = Di.Root;
  xr.Text = Di.Text;
  xr.Directive = Di.Directive;
  xr.Comment = Di.Comment;
  xr.Script = Di.Script;
  xr.Style = Di.Style;
  xr.Tag = Di.Tag;
  xr.CDATA = Di.CDATA;
  xr.Doctype = Di.Doctype;
});
var LH = A((mt) => {
  "use strict";
  var Cu =
      (mt && mt.__extends) ||
      (function () {
        var t = function (e, r) {
          return (
            (t =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (n, o) {
                  n.__proto__ = o;
                }) ||
              function (n, o) {
                for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
              }),
            t(e, r)
          );
        };
        return function (e, r) {
          if (typeof r != "function" && r !== null)
            throw new TypeError(
              "Class extends value " + String(r) + " is not a constructor or null",
            );
          t(e, r);
          function n() {
            this.constructor = e;
          }
          e.prototype = r === null ? Object.create(r) : ((n.prototype = r.prototype), new n());
        };
      })(),
    y_ =
      (mt && mt.__assign) ||
      function () {
        return (
          (y_ =
            Object.assign ||
            function (t) {
              for (var e, r = 1, n = arguments.length; r < n; r++) {
                e = arguments[r];
                for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
              }
              return t;
            }),
          y_.apply(this, arguments)
        );
      };
  Object.defineProperty(mt, "__esModule", { value: !0 });
  mt.cloneNode =
    mt.hasChildren =
    mt.isDocument =
    mt.isDirective =
    mt.isComment =
    mt.isText =
    mt.isCDATA =
    mt.isTag =
    mt.Element =
    mt.Document =
    mt.CDATA =
    mt.NodeWithChildren =
    mt.ProcessingInstruction =
    mt.Comment =
    mt.Text =
    mt.DataNode =
    mt.Node =
      void 0;
  var ii = g_(),
    OH = (function () {
      function t() {
        ((this.parent = null),
          (this.prev = null),
          (this.next = null),
          (this.startIndex = null),
          (this.endIndex = null));
      }
      return (
        Object.defineProperty(t.prototype, "parentNode", {
          get: function () {
            return this.parent;
          },
          set: function (e) {
            this.parent = e;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "previousSibling", {
          get: function () {
            return this.prev;
          },
          set: function (e) {
            this.prev = e;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "nextSibling", {
          get: function () {
            return this.next;
          },
          set: function (e) {
            this.next = e;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (t.prototype.cloneNode = function (e) {
          return (e === void 0 && (e = !1), NH(this, e));
        }),
        t
      );
    })();
  mt.Node = OH;
  var Jk = (function (t) {
    Cu(e, t);
    function e(r) {
      var n = t.call(this) || this;
      return ((n.data = r), n);
    }
    return (
      Object.defineProperty(e.prototype, "nodeValue", {
        get: function () {
          return this.data;
        },
        set: function (r) {
          this.data = r;
        },
        enumerable: !1,
        configurable: !0,
      }),
      e
    );
  })(OH);
  mt.DataNode = Jk;
  var bbe = (function (t) {
    Cu(e, t);
    function e() {
      var r = (t !== null && t.apply(this, arguments)) || this;
      return ((r.type = ii.ElementType.Text), r);
    }
    return (
      Object.defineProperty(e.prototype, "nodeType", {
        get: function () {
          return 3;
        },
        enumerable: !1,
        configurable: !0,
      }),
      e
    );
  })(Jk);
  mt.Text = bbe;
  var Sbe = (function (t) {
    Cu(e, t);
    function e() {
      var r = (t !== null && t.apply(this, arguments)) || this;
      return ((r.type = ii.ElementType.Comment), r);
    }
    return (
      Object.defineProperty(e.prototype, "nodeType", {
        get: function () {
          return 8;
        },
        enumerable: !1,
        configurable: !0,
      }),
      e
    );
  })(Jk);
  mt.Comment = Sbe;
  var wbe = (function (t) {
    Cu(e, t);
    function e(r, n) {
      var o = t.call(this, n) || this;
      return ((o.name = r), (o.type = ii.ElementType.Directive), o);
    }
    return (
      Object.defineProperty(e.prototype, "nodeType", {
        get: function () {
          return 1;
        },
        enumerable: !1,
        configurable: !0,
      }),
      e
    );
  })(Jk);
  mt.ProcessingInstruction = wbe;
  var Qk = (function (t) {
    Cu(e, t);
    function e(r) {
      var n = t.call(this) || this;
      return ((n.children = r), n);
    }
    return (
      Object.defineProperty(e.prototype, "firstChild", {
        get: function () {
          var r;
          return (r = this.children[0]) !== null && r !== void 0 ? r : null;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "lastChild", {
        get: function () {
          return this.children.length > 0 ? this.children[this.children.length - 1] : null;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "childNodes", {
        get: function () {
          return this.children;
        },
        set: function (r) {
          this.children = r;
        },
        enumerable: !1,
        configurable: !0,
      }),
      e
    );
  })(OH);
  mt.NodeWithChildren = Qk;
  var _be = (function (t) {
    Cu(e, t);
    function e() {
      var r = (t !== null && t.apply(this, arguments)) || this;
      return ((r.type = ii.ElementType.CDATA), r);
    }
    return (
      Object.defineProperty(e.prototype, "nodeType", {
        get: function () {
          return 4;
        },
        enumerable: !1,
        configurable: !0,
      }),
      e
    );
  })(Qk);
  mt.CDATA = _be;
  var xbe = (function (t) {
    Cu(e, t);
    function e() {
      var r = (t !== null && t.apply(this, arguments)) || this;
      return ((r.type = ii.ElementType.Root), r);
    }
    return (
      Object.defineProperty(e.prototype, "nodeType", {
        get: function () {
          return 9;
        },
        enumerable: !1,
        configurable: !0,
      }),
      e
    );
  })(Qk);
  mt.Document = xbe;
  var Abe = (function (t) {
    Cu(e, t);
    function e(r, n, o, i) {
      (o === void 0 && (o = []),
        i === void 0 &&
          (i =
            r === "script"
              ? ii.ElementType.Script
              : r === "style"
                ? ii.ElementType.Style
                : ii.ElementType.Tag));
      var s = t.call(this, o) || this;
      return ((s.name = r), (s.attribs = n), (s.type = i), s);
    }
    return (
      Object.defineProperty(e.prototype, "nodeType", {
        get: function () {
          return 1;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "tagName", {
        get: function () {
          return this.name;
        },
        set: function (r) {
          this.name = r;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "attributes", {
        get: function () {
          var r = this;
          return Object.keys(this.attribs).map(function (n) {
            var o, i;
            return {
              name: n,
              value: r.attribs[n],
              namespace: (o = r["x-attribsNamespace"]) === null || o === void 0 ? void 0 : o[n],
              prefix: (i = r["x-attribsPrefix"]) === null || i === void 0 ? void 0 : i[n],
            };
          });
        },
        enumerable: !1,
        configurable: !0,
      }),
      e
    );
  })(Qk);
  mt.Element = Abe;
  function Rbe(t) {
    return (0, ii.isTag)(t);
  }
  mt.isTag = Rbe;
  function Ebe(t) {
    return t.type === ii.ElementType.CDATA;
  }
  mt.isCDATA = Ebe;
  function Cbe(t) {
    return t.type === ii.ElementType.Text;
  }
  mt.isText = Cbe;
  function Tbe(t) {
    return t.type === ii.ElementType.Comment;
  }
  mt.isComment = Tbe;
  function Pbe(t) {
    return t.type === ii.ElementType.Directive;
  }
  mt.isDirective = Pbe;
  function Ibe(t) {
    return t.type === ii.ElementType.Root;
  }
  mt.isDocument = Ibe;
  function Avt(t) {
    return Object.prototype.hasOwnProperty.call(t, "children");
  }
  mt.hasChildren = Avt;
  function NH(t, e) {
    e === void 0 && (e = !1);
    var r;
    if (Cbe(t)) r = new bbe(t.data);
    else if (Tbe(t)) r = new Sbe(t.data);
    else if (Rbe(t)) {
      var n = e ? MH(t.children) : [],
        o = new Abe(t.name, y_({}, t.attribs), n);
      (n.forEach(function (l) {
        return (l.parent = o);
      }),
        t.namespace != null && (o.namespace = t.namespace),
        t["x-attribsNamespace"] && (o["x-attribsNamespace"] = y_({}, t["x-attribsNamespace"])),
        t["x-attribsPrefix"] && (o["x-attribsPrefix"] = y_({}, t["x-attribsPrefix"])),
        (r = o));
    } else if (Ebe(t)) {
      var n = e ? MH(t.children) : [],
        i = new _be(n);
      (n.forEach(function (c) {
        return (c.parent = i);
      }),
        (r = i));
    } else if (Ibe(t)) {
      var n = e ? MH(t.children) : [],
        s = new xbe(n);
      (n.forEach(function (c) {
        return (c.parent = s);
      }),
        t["x-mode"] && (s["x-mode"] = t["x-mode"]),
        (r = s));
    } else if (Pbe(t)) {
      var a = new wbe(t.name, t.data);
      (t["x-name"] != null &&
        ((a["x-name"] = t["x-name"]),
        (a["x-publicId"] = t["x-publicId"]),
        (a["x-systemId"] = t["x-systemId"])),
        (r = a));
    } else throw new Error("Not implemented yet: ".concat(t.type));
    return (
      (r.startIndex = t.startIndex),
      (r.endIndex = t.endIndex),
      t.sourceCodeLocation != null && (r.sourceCodeLocation = t.sourceCodeLocation),
      r
    );
  }
  mt.cloneNode = NH;
  function MH(t) {
    for (
      var e = t.map(function (n) {
          return NH(n, !0);
        }),
        r = 1;
      r < e.length;
      r++
    )
      ((e[r].prev = e[r - 1]), (e[r - 1].next = e[r]));
    return e;
  }
});
var Zp = A((Da) => {
  "use strict";
  var Rvt =
      (Da && Da.__createBinding) ||
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
    Evt =
      (Da && Da.__exportStar) ||
      function (t, e) {
        for (var r in t)
          r !== "default" && !Object.prototype.hasOwnProperty.call(e, r) && Rvt(e, t, r);
      };
  Object.defineProperty(Da, "__esModule", { value: !0 });
  Da.DomHandler = void 0;
  var BH = g_(),
    Tu = LH();
  Evt(LH(), Da);
  var kbe = { withStartIndices: !1, withEndIndices: !1, xmlMode: !1 },
    Dbe = (function () {
      function t(e, r, n) {
        ((this.dom = []),
          (this.root = new Tu.Document(this.dom)),
          (this.done = !1),
          (this.tagStack = [this.root]),
          (this.lastNode = null),
          (this.parser = null),
          typeof r == "function" && ((n = r), (r = kbe)),
          typeof e == "object" && ((r = e), (e = void 0)),
          (this.callback = e ?? null),
          (this.options = r ?? kbe),
          (this.elementCB = n ?? null));
      }
      return (
        (t.prototype.onparserinit = function (e) {
          this.parser = e;
        }),
        (t.prototype.onreset = function () {
          ((this.dom = []),
            (this.root = new Tu.Document(this.dom)),
            (this.done = !1),
            (this.tagStack = [this.root]),
            (this.lastNode = null),
            (this.parser = null));
        }),
        (t.prototype.onend = function () {
          this.done || ((this.done = !0), (this.parser = null), this.handleCallback(null));
        }),
        (t.prototype.onerror = function (e) {
          this.handleCallback(e);
        }),
        (t.prototype.onclosetag = function () {
          this.lastNode = null;
          var e = this.tagStack.pop();
          (this.options.withEndIndices && (e.endIndex = this.parser.endIndex),
            this.elementCB && this.elementCB(e));
        }),
        (t.prototype.onopentag = function (e, r) {
          var n = this.options.xmlMode ? BH.ElementType.Tag : void 0,
            o = new Tu.Element(e, r, void 0, n);
          (this.addNode(o), this.tagStack.push(o));
        }),
        (t.prototype.ontext = function (e) {
          var r = this.lastNode;
          if (r && r.type === BH.ElementType.Text)
            ((r.data += e), this.options.withEndIndices && (r.endIndex = this.parser.endIndex));
          else {
            var n = new Tu.Text(e);
            (this.addNode(n), (this.lastNode = n));
          }
        }),
        (t.prototype.oncomment = function (e) {
          if (this.lastNode && this.lastNode.type === BH.ElementType.Comment) {
            this.lastNode.data += e;
            return;
          }
          var r = new Tu.Comment(e);
          (this.addNode(r), (this.lastNode = r));
        }),
        (t.prototype.oncommentend = function () {
          this.lastNode = null;
        }),
        (t.prototype.oncdatastart = function () {
          var e = new Tu.Text(""),
            r = new Tu.CDATA([e]);
          (this.addNode(r), (e.parent = r), (this.lastNode = e));
        }),
        (t.prototype.oncdataend = function () {
          this.lastNode = null;
        }),
        (t.prototype.onprocessinginstruction = function (e, r) {
          var n = new Tu.ProcessingInstruction(e, r);
          this.addNode(n);
        }),
        (t.prototype.handleCallback = function (e) {
          if (typeof this.callback == "function") this.callback(e, this.dom);
          else if (e) throw e;
        }),
        (t.prototype.addNode = function (e) {
          var r = this.tagStack[this.tagStack.length - 1],
            n = r.children[r.children.length - 1];
          (this.options.withStartIndices && (e.startIndex = this.parser.startIndex),
            this.options.withEndIndices && (e.endIndex = this.parser.endIndex),
            r.children.push(e),
            n && ((e.prev = n), (n.next = e)),
            (e.parent = r),
            (this.lastNode = null));
        }),
        t
      );
    })();
  Da.DomHandler = Dbe;
  Da.default = Dbe;
});
var Nbe = A((_n) => {
  "use strict";
  Object.defineProperty(_n, "__esModule", { value: !0 });
  _n.escapeText =
    _n.escapeAttribute =
    _n.escapeUTF8 =
    _n.escape =
    _n.encodeXML =
    _n.getCodePoint =
    _n.xmlReplacer =
      void 0;
  _n.xmlReplacer = /["&'<>$\x80-\uFFFF]/g;
  var Mbe = new Map([
    [34, "&quot;"],
    [38, "&amp;"],
    [39, "&apos;"],
    [60, "&lt;"],
    [62, "&gt;"],
  ]);
  _n.getCodePoint =
    String.prototype.codePointAt != null
      ? function (t, e) {
          return t.codePointAt(e);
        }
      : function (t, e) {
          return (t.charCodeAt(e) & 64512) === 55296
            ? (t.charCodeAt(e) - 55296) * 1024 + t.charCodeAt(e + 1) - 56320 + 65536
            : t.charCodeAt(e);
        };
  function Obe(t) {
    for (var e = "", r = 0, n; (n = _n.xmlReplacer.exec(t)) !== null; ) {
      var o = n.index,
        i = t.charCodeAt(o),
        s = Mbe.get(i);
      s !== void 0
        ? ((e += t.substring(r, o) + s), (r = o + 1))
        : ((e += ""
            .concat(t.substring(r, o), "&#x")
            .concat((0, _n.getCodePoint)(t, o).toString(16), ";")),
          (r = _n.xmlReplacer.lastIndex += +((i & 64512) === 55296)));
    }
    return e + t.substr(r);
  }
  _n.encodeXML = Obe;
  _n.escape = Obe;
  function FH(t, e) {
    return function (n) {
      for (var o, i = 0, s = ""; (o = t.exec(n)); )
        (i !== o.index && (s += n.substring(i, o.index)),
          (s += e.get(o[0].charCodeAt(0))),
          (i = o.index + 1));
      return s + n.substring(i);
    };
  }
  _n.escapeUTF8 = FH(/[&<>'"]/g, Mbe);
  _n.escapeAttribute = FH(
    /["&\u00A0]/g,
    new Map([
      [34, "&quot;"],
      [38, "&amp;"],
      [160, "&nbsp;"],
    ]),
  );
  _n.escapeText = FH(
    /[&<>\u00A0]/g,
    new Map([
      [38, "&amp;"],
      [60, "&lt;"],
      [62, "&gt;"],
      [160, "&nbsp;"],
    ]),
  );
});
var Lbe = A((Ng) => {
  "use strict";
  Object.defineProperty(Ng, "__esModule", { value: !0 });
  Ng.attributeNames = Ng.elementNames = void 0;
  Ng.elementNames = new Map(
    [
      "altGlyph",
      "altGlyphDef",
      "altGlyphItem",
      "animateColor",
      "animateMotion",
      "animateTransform",
      "clipPath",
      "feBlend",
      "feColorMatrix",
      "feComponentTransfer",
      "feComposite",
      "feConvolveMatrix",
      "feDiffuseLighting",
      "feDisplacementMap",
      "feDistantLight",
      "feDropShadow",
      "feFlood",
      "feFuncA",
      "feFuncB",
      "feFuncG",
      "feFuncR",
      "feGaussianBlur",
      "feImage",
      "feMerge",
      "feMergeNode",
      "feMorphology",
      "feOffset",
      "fePointLight",
      "feSpecularLighting",
      "feSpotLight",
      "feTile",
      "feTurbulence",
      "foreignObject",
      "glyphRef",
      "linearGradient",
      "radialGradient",
      "textPath",
    ].map(function (t) {
      return [t.toLowerCase(), t];
    }),
  );
  Ng.attributeNames = new Map(
    [
      "definitionURL",
      "attributeName",
      "attributeType",
      "baseFrequency",
      "baseProfile",
      "calcMode",
      "clipPathUnits",
      "diffuseConstant",
      "edgeMode",
      "filterUnits",
      "glyphRef",
      "gradientTransform",
      "gradientUnits",
      "kernelMatrix",
      "kernelUnitLength",
      "keyPoints",
      "keySplines",
      "keyTimes",
      "lengthAdjust",
      "limitingConeAngle",
      "markerHeight",
      "markerUnits",
      "markerWidth",
      "maskContentUnits",
      "maskUnits",
      "numOctaves",
      "pathLength",
      "patternContentUnits",
      "patternTransform",
      "patternUnits",
      "pointsAtX",
      "pointsAtY",
      "pointsAtZ",
      "preserveAlpha",
      "preserveAspectRatio",
      "primitiveUnits",
      "refX",
      "refY",
      "repeatCount",
      "repeatDur",
      "requiredExtensions",
      "requiredFeatures",
      "specularConstant",
      "specularExponent",
      "spreadMethod",
      "startOffset",
      "stdDeviation",
      "stitchTiles",
      "surfaceScale",
      "systemLanguage",
      "tableValues",
      "targetX",
      "targetY",
      "textLength",
      "viewBox",
      "viewTarget",
      "xChannelSelector",
      "yChannelSelector",
      "zoomAndPan",
    ].map(function (t) {
      return [t.toLowerCase(), t];
    }),
  );
});
var $be = A((Mi) => {
  "use strict";
  var Lg =
      (Mi && Mi.__assign) ||
      function () {
        return (
          (Lg =
            Object.assign ||
            function (t) {
              for (var e, r = 1, n = arguments.length; r < n; r++) {
                e = arguments[r];
                for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
              }
              return t;
            }),
          Lg.apply(this, arguments)
        );
      },
    Cvt =
      (Mi && Mi.__createBinding) ||
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
    Tvt =
      (Mi && Mi.__setModuleDefault) ||
      (Object.create
        ? function (t, e) {
            Object.defineProperty(t, "default", { enumerable: !0, value: e });
          }
        : function (t, e) {
            t.default = e;
          }),
    Pvt =
      (Mi && Mi.__importStar) ||
      function (t) {
        if (t && t.__esModule) return t;
        var e = {};
        if (t != null)
          for (var r in t)
            r !== "default" && Object.prototype.hasOwnProperty.call(t, r) && Cvt(e, t, r);
        return (Tvt(e, t), e);
      };
  Object.defineProperty(Mi, "__esModule", { value: !0 });
  Mi.render = void 0;
  var Jl = Pvt(g_()),
    e0 = Nbe(),
    Fbe = Lbe(),
    Ivt = new Set([
      "style",
      "script",
      "xmp",
      "iframe",
      "noembed",
      "noframes",
      "plaintext",
      "noscript",
    ]);
  function kvt(t) {
    return t.replace(/"/g, "&quot;");
  }
  function Dvt(t, e) {
    var r;
    if (t) {
      var n =
        ((r = e.encodeEntities) !== null && r !== void 0 ? r : e.decodeEntities) === !1
          ? kvt
          : e.xmlMode || e.encodeEntities !== "utf8"
            ? e0.encodeXML
            : e0.escapeAttribute;
      return Object.keys(t)
        .map(function (o) {
          var i,
            s,
            a = (i = t[o]) !== null && i !== void 0 ? i : "";
          return (
            e.xmlMode === "foreign" &&
              (o = (s = Fbe.attributeNames.get(o)) !== null && s !== void 0 ? s : o),
            !e.emptyAttrs && !e.xmlMode && a === "" ? o : "".concat(o, '="').concat(n(a), '"')
          );
        })
        .join(" ");
    }
  }
  var Bbe = new Set([
    "area",
    "base",
    "basefont",
    "br",
    "col",
    "command",
    "embed",
    "frame",
    "hr",
    "img",
    "input",
    "isindex",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
  ]);
  function t0(t, e) {
    e === void 0 && (e = {});
    for (var r = ("length" in t) ? t : [t], n = "", o = 0; o < r.length; o++) n += Mvt(r[o], e);
    return n;
  }
  Mi.render = t0;
  Mi.default = t0;
  function Mvt(t, e) {
    switch (t.type) {
      case Jl.Root:
        return t0(t.children, e);
      case Jl.Doctype:
      case Jl.Directive:
        return Bvt(t);
      case Jl.Comment:
        return Uvt(t);
      case Jl.CDATA:
        return $vt(t);
      case Jl.Script:
      case Jl.Style:
      case Jl.Tag:
        return Lvt(t, e);
      case Jl.Text:
        return Fvt(t, e);
    }
  }
  var Ovt = new Set([
      "mi",
      "mo",
      "mn",
      "ms",
      "mtext",
      "annotation-xml",
      "foreignObject",
      "desc",
      "title",
    ]),
    Nvt = new Set(["svg", "math"]);
  function Lvt(t, e) {
    var r;
    (e.xmlMode === "foreign" &&
      ((t.name = (r = Fbe.elementNames.get(t.name)) !== null && r !== void 0 ? r : t.name),
      t.parent && Ovt.has(t.parent.name) && (e = Lg(Lg({}, e), { xmlMode: !1 }))),
      !e.xmlMode && Nvt.has(t.name) && (e = Lg(Lg({}, e), { xmlMode: "foreign" })));
    var n = "<".concat(t.name),
      o = Dvt(t.attribs, e);
    return (
      o && (n += " ".concat(o)),
      t.children.length === 0 &&
      (e.xmlMode ? e.selfClosingTags !== !1 : e.selfClosingTags && Bbe.has(t.name))
        ? (e.xmlMode || (n += " "), (n += "/>"))
        : ((n += ">"),
          t.children.length > 0 && (n += t0(t.children, e)),
          (e.xmlMode || !Bbe.has(t.name)) && (n += "</".concat(t.name, ">"))),
      n
    );
  }
  function Bvt(t) {
    return "<".concat(t.data, ">");
  }
  function Fvt(t, e) {
    var r,
      n = t.data || "";
    return (
      ((r = e.encodeEntities) !== null && r !== void 0 ? r : e.decodeEntities) !== !1 &&
        !(!e.xmlMode && t.parent && Ivt.has(t.parent.name)) &&
        (n =
          e.xmlMode || e.encodeEntities !== "utf8" ? (0, e0.encodeXML)(n) : (0, e0.escapeText)(n)),
      n
    );
  }
  function $vt(t) {
    return "<![CDATA[".concat(t.children[0].data, "]]>");
  }
  function Uvt(t) {
    return "<!--".concat(t.data, "-->");
  }
});
var qH = A((Ql) => {
  "use strict";
  var qvt =
    (Ql && Ql.__importDefault) ||
    function (t) {
      return t && t.__esModule ? t : { default: t };
    };
  Object.defineProperty(Ql, "__esModule", { value: !0 });
  Ql.getOuterHTML = Ube;
  Ql.getInnerHTML = Hvt;
  Ql.getText = r0;
  Ql.textContent = $H;
  Ql.innerText = UH;
  var Ma = Zp(),
    Gvt = qvt($be()),
    Wvt = g_();
  function Ube(t, e) {
    return (0, Gvt.default)(t, e);
  }
  function Hvt(t, e) {
    return (0, Ma.hasChildren)(t)
      ? t.children
          .map(function (r) {
            return Ube(r, e);
          })
          .join("")
      : "";
  }
  function r0(t) {
    return Array.isArray(t)
      ? t.map(r0).join("")
      : (0, Ma.isTag)(t)
        ? t.name === "br"
          ? `
`
          : r0(t.children)
        : (0, Ma.isCDATA)(t)
          ? r0(t.children)
          : (0, Ma.isText)(t)
            ? t.data
            : "";
  }
  function $H(t) {
    return Array.isArray(t)
      ? t.map($H).join("")
      : (0, Ma.hasChildren)(t) && !(0, Ma.isComment)(t)
        ? $H(t.children)
        : (0, Ma.isText)(t)
          ? t.data
          : "";
  }
  function UH(t) {
    return Array.isArray(t)
      ? t.map(UH).join("")
      : (0, Ma.hasChildren)(t) && (t.type === Wvt.ElementType.Tag || (0, Ma.isCDATA)(t))
        ? UH(t.children)
        : (0, Ma.isText)(t)
          ? t.data
          : "";
  }
});
var Wbe = A((Oa) => {
  "use strict";
  Object.defineProperty(Oa, "__esModule", { value: !0 });
  Oa.getChildren = qbe;
  Oa.getParent = Gbe;
  Oa.getSiblings = jvt;
  Oa.getAttributeValue = zvt;
  Oa.hasAttrib = Vvt;
  Oa.getName = Kvt;
  Oa.nextElementSibling = Zvt;
  Oa.prevElementSibling = Xvt;
  var GH = Zp();
  function qbe(t) {
    return (0, GH.hasChildren)(t) ? t.children : [];
  }
  function Gbe(t) {
    return t.parent || null;
  }
  function jvt(t) {
    var e,
      r,
      n = Gbe(t);
    if (n != null) return qbe(n);
    for (var o = [t], i = t.prev, s = t.next; i != null; ) (o.unshift(i), (e = i), (i = e.prev));
    for (; s != null; ) (o.push(s), (r = s), (s = r.next));
    return o;
  }
  function zvt(t, e) {
    var r;
    return (r = t.attribs) === null || r === void 0 ? void 0 : r[e];
  }
  function Vvt(t, e) {
    return (
      t.attribs != null &&
      Object.prototype.hasOwnProperty.call(t.attribs, e) &&
      t.attribs[e] != null
    );
  }
  function Kvt(t) {
    return t.name;
  }
  function Zvt(t) {
    for (var e, r = t.next; r !== null && !(0, GH.isTag)(r); ) ((e = r), (r = e.next));
    return r;
  }
  function Xvt(t) {
    for (var e, r = t.prev; r !== null && !(0, GH.isTag)(r); ) ((e = r), (r = e.prev));
    return r;
  }
});
var Hbe = A((Pu) => {
  "use strict";
  Object.defineProperty(Pu, "__esModule", { value: !0 });
  Pu.removeElement = v_;
  Pu.replaceElement = Yvt;
  Pu.appendChild = Jvt;
  Pu.append = Qvt;
  Pu.prependChild = ebt;
  Pu.prepend = tbt;
  function v_(t) {
    if ((t.prev && (t.prev.next = t.next), t.next && (t.next.prev = t.prev), t.parent)) {
      var e = t.parent.children,
        r = e.lastIndexOf(t);
      r >= 0 && e.splice(r, 1);
    }
    ((t.next = null), (t.prev = null), (t.parent = null));
  }
  function Yvt(t, e) {
    var r = (e.prev = t.prev);
    r && (r.next = e);
    var n = (e.next = t.next);
    n && (n.prev = e);
    var o = (e.parent = t.parent);
    if (o) {
      var i = o.children;
      ((i[i.lastIndexOf(t)] = e), (t.parent = null));
    }
  }
  function Jvt(t, e) {
    if ((v_(e), (e.next = null), (e.parent = t), t.children.push(e) > 1)) {
      var r = t.children[t.children.length - 2];
      ((r.next = e), (e.prev = r));
    } else e.prev = null;
  }
  function Qvt(t, e) {
    v_(e);
    var r = t.parent,
      n = t.next;
    if (((e.next = n), (e.prev = t), (t.next = e), (e.parent = r), n)) {
      if (((n.prev = e), r)) {
        var o = r.children;
        o.splice(o.lastIndexOf(n), 0, e);
      }
    } else r && r.children.push(e);
  }
  function ebt(t, e) {
    if ((v_(e), (e.parent = t), (e.prev = null), t.children.unshift(e) !== 1)) {
      var r = t.children[1];
      ((r.prev = e), (e.next = r));
    } else e.next = null;
  }
  function tbt(t, e) {
    v_(e);
    var r = t.parent;
    if (r) {
      var n = r.children;
      n.splice(n.indexOf(t), 0, e);
    }
    (t.prev && (t.prev.next = e), (e.parent = r), (e.prev = t.prev), (e.next = t), (t.prev = e));
  }
});
var WH = A((Iu) => {
  "use strict";
  Object.defineProperty(Iu, "__esModule", { value: !0 });
  Iu.filter = rbt;
  Iu.find = jbe;
  Iu.findOneChild = nbt;
  Iu.findOne = zbe;
  Iu.existsOne = Vbe;
  Iu.findAll = obt;
  var Xp = Zp();
  function rbt(t, e, r, n) {
    return (
      r === void 0 && (r = !0),
      n === void 0 && (n = 1 / 0),
      jbe(t, Array.isArray(e) ? e : [e], r, n)
    );
  }
  function jbe(t, e, r, n) {
    for (var o = [], i = [Array.isArray(e) ? e : [e]], s = [0]; ; ) {
      if (s[0] >= i[0].length) {
        if (s.length === 1) return o;
        (i.shift(), s.shift());
        continue;
      }
      var a = i[0][s[0]++];
      if (t(a) && (o.push(a), --n <= 0)) return o;
      r && (0, Xp.hasChildren)(a) && a.children.length > 0 && (s.unshift(0), i.unshift(a.children));
    }
  }
  function nbt(t, e) {
    return e.find(t);
  }
  function zbe(t, e, r) {
    r === void 0 && (r = !0);
    for (var n = Array.isArray(e) ? e : [e], o = 0; o < n.length; o++) {
      var i = n[o];
      if ((0, Xp.isTag)(i) && t(i)) return i;
      if (r && (0, Xp.hasChildren)(i) && i.children.length > 0) {
        var s = zbe(t, i.children, !0);
        if (s) return s;
      }
    }
    return null;
  }
  function Vbe(t, e) {
    return (Array.isArray(e) ? e : [e]).some(function (r) {
      return ((0, Xp.isTag)(r) && t(r)) || ((0, Xp.hasChildren)(r) && Vbe(t, r.children));
    });
  }
  function obt(t, e) {
    for (var r = [], n = [Array.isArray(e) ? e : [e]], o = [0]; ; ) {
      if (o[0] >= n[0].length) {
        if (n.length === 1) return r;
        (n.shift(), o.shift());
        continue;
      }
      var i = n[0][o[0]++];
      ((0, Xp.isTag)(i) && t(i) && r.push(i),
        (0, Xp.hasChildren)(i) && i.children.length > 0 && (o.unshift(0), n.unshift(i.children)));
    }
  }
});
var jH = A((ku) => {
  "use strict";
  Object.defineProperty(ku, "__esModule", { value: !0 });
  ku.testElement = sbt;
  ku.getElements = abt;
  ku.getElementById = lbt;
  ku.getElementsByTagName = cbt;
  ku.getElementsByClassName = ubt;
  ku.getElementsByTagType = dbt;
  var Yp = Zp(),
    b_ = WH(),
    n0 = {
      tag_name: function (t) {
        return typeof t == "function"
          ? function (e) {
              return (0, Yp.isTag)(e) && t(e.name);
            }
          : t === "*"
            ? Yp.isTag
            : function (e) {
                return (0, Yp.isTag)(e) && e.name === t;
              };
      },
      tag_type: function (t) {
        return typeof t == "function"
          ? function (e) {
              return t(e.type);
            }
          : function (e) {
              return e.type === t;
            };
      },
      tag_contains: function (t) {
        return typeof t == "function"
          ? function (e) {
              return (0, Yp.isText)(e) && t(e.data);
            }
          : function (e) {
              return (0, Yp.isText)(e) && e.data === t;
            };
      },
    };
  function HH(t, e) {
    return typeof e == "function"
      ? function (r) {
          return (0, Yp.isTag)(r) && e(r.attribs[t]);
        }
      : function (r) {
          return (0, Yp.isTag)(r) && r.attribs[t] === e;
        };
  }
  function ibt(t, e) {
    return function (r) {
      return t(r) || e(r);
    };
  }
  function Kbe(t) {
    var e = Object.keys(t).map(function (r) {
      var n = t[r];
      return Object.prototype.hasOwnProperty.call(n0, r) ? n0[r](n) : HH(r, n);
    });
    return e.length === 0 ? null : e.reduce(ibt);
  }
  function sbt(t, e) {
    var r = Kbe(t);
    return r ? r(e) : !0;
  }
  function abt(t, e, r, n) {
    n === void 0 && (n = 1 / 0);
    var o = Kbe(t);
    return o ? (0, b_.filter)(o, e, r, n) : [];
  }
  function lbt(t, e, r) {
    return (
      r === void 0 && (r = !0),
      Array.isArray(e) || (e = [e]),
      (0, b_.findOne)(HH("id", t), e, r)
    );
  }
  function cbt(t, e, r, n) {
    return (
      r === void 0 && (r = !0),
      n === void 0 && (n = 1 / 0),
      (0, b_.filter)(n0.tag_name(t), e, r, n)
    );
  }
  function ubt(t, e, r, n) {
    return (
      r === void 0 && (r = !0),
      n === void 0 && (n = 1 / 0),
      (0, b_.filter)(HH("class", t), e, r, n)
    );
  }
  function dbt(t, e, r, n) {
    return (
      r === void 0 && (r = !0),
      n === void 0 && (n = 1 / 0),
      (0, b_.filter)(n0.tag_type(t), e, r, n)
    );
  }
});
var Ybe = A((Jp) => {
  "use strict";
  Object.defineProperty(Jp, "__esModule", { value: !0 });
  Jp.DocumentPosition = void 0;
  Jp.removeSubsets = pbt;
  Jp.compareDocumentPosition = Xbe;
  Jp.uniqueSort = mbt;
  var Zbe = Zp();
  function pbt(t) {
    for (var e = t.length; --e >= 0; ) {
      var r = t[e];
      if (e > 0 && t.lastIndexOf(r, e - 1) >= 0) {
        t.splice(e, 1);
        continue;
      }
      for (var n = r.parent; n; n = n.parent)
        if (t.includes(n)) {
          t.splice(e, 1);
          break;
        }
    }
    return t;
  }
  var Fs;
  (function (t) {
    ((t[(t.DISCONNECTED = 1)] = "DISCONNECTED"),
      (t[(t.PRECEDING = 2)] = "PRECEDING"),
      (t[(t.FOLLOWING = 4)] = "FOLLOWING"),
      (t[(t.CONTAINS = 8)] = "CONTAINS"),
      (t[(t.CONTAINED_BY = 16)] = "CONTAINED_BY"));
  })(Fs || (Jp.DocumentPosition = Fs = {}));
  function Xbe(t, e) {
    var r = [],
      n = [];
    if (t === e) return 0;
    for (var o = (0, Zbe.hasChildren)(t) ? t : t.parent; o; ) (r.unshift(o), (o = o.parent));
    for (o = (0, Zbe.hasChildren)(e) ? e : e.parent; o; ) (n.unshift(o), (o = o.parent));
    for (var i = Math.min(r.length, n.length), s = 0; s < i && r[s] === n[s]; ) s++;
    if (s === 0) return Fs.DISCONNECTED;
    var a = r[s - 1],
      l = a.children,
      c = r[s],
      u = n[s];
    return l.indexOf(c) > l.indexOf(u)
      ? a === e
        ? Fs.FOLLOWING | Fs.CONTAINED_BY
        : Fs.FOLLOWING
      : a === t
        ? Fs.PRECEDING | Fs.CONTAINS
        : Fs.PRECEDING;
  }
  function mbt(t) {
    return (
      (t = t.filter(function (e, r, n) {
        return !n.includes(e, r + 1);
      })),
      t.sort(function (e, r) {
        var n = Xbe(e, r);
        return n & Fs.PRECEDING ? -1 : n & Fs.FOLLOWING ? 1 : 0;
      }),
      t
    );
  }
});
var Qbe = A((zH) => {
  "use strict";
  Object.defineProperty(zH, "__esModule", { value: !0 });
  zH.getFeed = hbt;
  var fbt = qH(),
    S_ = jH();
  function hbt(t) {
    var e = o0(Sbt, t);
    return e ? (e.name === "feed" ? gbt(e) : ybt(e)) : null;
  }
  function gbt(t) {
    var e,
      r = t.children,
      n = {
        type: "atom",
        items: (0, S_.getElementsByTagName)("entry", r).map(function (s) {
          var a,
            l = s.children,
            c = { media: Jbe(l) };
          (si(c, "id", "id", l), si(c, "title", "title", l));
          var u = (a = o0("link", l)) === null || a === void 0 ? void 0 : a.attribs.href;
          u && (c.link = u);
          var p = Du("summary", l) || Du("content", l);
          p && (c.description = p);
          var m = Du("updated", l);
          return (m && (c.pubDate = new Date(m)), c);
        }),
      };
    (si(n, "id", "id", r), si(n, "title", "title", r));
    var o = (e = o0("link", r)) === null || e === void 0 ? void 0 : e.attribs.href;
    (o && (n.link = o), si(n, "description", "subtitle", r));
    var i = Du("updated", r);
    return (i && (n.updated = new Date(i)), si(n, "author", "email", r, !0), n);
  }
  function ybt(t) {
    var e,
      r,
      n =
        (r = (e = o0("channel", t.children)) === null || e === void 0 ? void 0 : e.children) !==
          null && r !== void 0
          ? r
          : [],
      o = {
        type: t.name.substr(0, 3),
        id: "",
        items: (0, S_.getElementsByTagName)("item", t.children).map(function (s) {
          var a = s.children,
            l = { media: Jbe(a) };
          (si(l, "id", "guid", a),
            si(l, "title", "title", a),
            si(l, "link", "link", a),
            si(l, "description", "description", a));
          var c = Du("pubDate", a) || Du("dc:date", a);
          return (c && (l.pubDate = new Date(c)), l);
        }),
      };
    (si(o, "title", "title", n), si(o, "link", "link", n), si(o, "description", "description", n));
    var i = Du("lastBuildDate", n);
    return (i && (o.updated = new Date(i)), si(o, "author", "managingEditor", n, !0), o);
  }
  var vbt = ["url", "type", "lang"],
    bbt = [
      "fileSize",
      "bitrate",
      "framerate",
      "samplingrate",
      "channels",
      "duration",
      "height",
      "width",
    ];
  function Jbe(t) {
    return (0, S_.getElementsByTagName)("media:content", t).map(function (e) {
      for (
        var r = e.attribs, n = { medium: r.medium, isDefault: !!r.isDefault }, o = 0, i = vbt;
        o < i.length;
        o++
      ) {
        var s = i[o];
        r[s] && (n[s] = r[s]);
      }
      for (var a = 0, l = bbt; a < l.length; a++) {
        var s = l[a];
        r[s] && (n[s] = parseInt(r[s], 10));
      }
      return (r.expression && (n.expression = r.expression), n);
    });
  }
  function o0(t, e) {
    return (0, S_.getElementsByTagName)(t, e, !0, 1)[0];
  }
  function Du(t, e, r) {
    return (
      r === void 0 && (r = !1),
      (0, fbt.textContent)((0, S_.getElementsByTagName)(t, e, r, 1)).trim()
    );
  }
  function si(t, e, r, n, o) {
    o === void 0 && (o = !1);
    var i = Du(r, n, o);
    i && (t[e] = i);
  }
  function Sbt(t) {
    return t === "rss" || t === "feed" || t === "rdf:RDF";
  }
});
var eSe = A((Ar) => {
  "use strict";
  var wbt =
      (Ar && Ar.__createBinding) ||
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
    Qp =
      (Ar && Ar.__exportStar) ||
      function (t, e) {
        for (var r in t)
          r !== "default" && !Object.prototype.hasOwnProperty.call(e, r) && wbt(e, t, r);
      };
  Object.defineProperty(Ar, "__esModule", { value: !0 });
  Ar.hasChildren = Ar.isDocument = Ar.isComment = Ar.isText = Ar.isCDATA = Ar.isTag = void 0;
  Qp(qH(), Ar);
  Qp(Wbe(), Ar);
  Qp(Hbe(), Ar);
  Qp(WH(), Ar);
  Qp(jH(), Ar);
  Qp(Ybe(), Ar);
  Qp(Qbe(), Ar);
  var Bg = Zp();
  Object.defineProperty(Ar, "isTag", {
    enumerable: !0,
    get: function () {
      return Bg.isTag;
    },
  });
  Object.defineProperty(Ar, "isCDATA", {
    enumerable: !0,
    get: function () {
      return Bg.isCDATA;
    },
  });
  Object.defineProperty(Ar, "isText", {
    enumerable: !0,
    get: function () {
      return Bg.isText;
    },
  });
  Object.defineProperty(Ar, "isComment", {
    enumerable: !0,
    get: function () {
      return Bg.isComment;
    },
  });
  Object.defineProperty(Ar, "isDocument", {
    enumerable: !0,
    get: function () {
      return Bg.isDocument;
    },
  });
  Object.defineProperty(Ar, "hasChildren", {
    enumerable: !0,
    get: function () {
      return Bg.hasChildren;
    },
  });
});
var em = A((Zwr, tSe) => {
  tSe.exports = {
    trueFunc: function () {
      return !0;
    },
    falseFunc: function () {
      return !1;
    },
  };
});
var i0 = A((Na) => {
  "use strict";
  Object.defineProperty(Na, "__esModule", { value: !0 });
  Na.AttributeAction = Na.IgnoreCaseMode = Na.SelectorType = void 0;
  var _bt;
  (function (t) {
    ((t.Attribute = "attribute"),
      (t.Pseudo = "pseudo"),
      (t.PseudoElement = "pseudo-element"),
      (t.Tag = "tag"),
      (t.Universal = "universal"),
      (t.Adjacent = "adjacent"),
      (t.Child = "child"),
      (t.Descendant = "descendant"),
      (t.Parent = "parent"),
      (t.Sibling = "sibling"),
      (t.ColumnCombinator = "column-combinator"));
  })((_bt = Na.SelectorType || (Na.SelectorType = {})));
  Na.IgnoreCaseMode = { Unknown: null, QuirksMode: "quirks", IgnoreCase: !0, CaseSensitive: !1 };
  var xbt;
  (function (t) {
    ((t.Any = "any"),
      (t.Element = "element"),
      (t.End = "end"),
      (t.Equals = "equals"),
      (t.Exists = "exists"),
      (t.Hyphen = "hyphen"),
      (t.Not = "not"),
      (t.Start = "start"));
  })((xbt = Na.AttributeAction || (Na.AttributeAction = {})));
});
var sSe = A((Fg) => {
  "use strict";
  Object.defineProperty(Fg, "__esModule", { value: !0 });
  Fg.parse = Fg.isTraversal = void 0;
  var Qt = i0(),
    rSe = /^[^\\#]?(?:\\(?:[\da-f]{1,6}\s?|.)|[\w\-\u00b0-\uFFFF])+/,
    Abt = /\\([\da-f]{1,6}\s?|(\s)|.)/gi,
    Rbt = new Map([
      [126, Qt.AttributeAction.Element],
      [94, Qt.AttributeAction.Start],
      [36, Qt.AttributeAction.End],
      [42, Qt.AttributeAction.Any],
      [33, Qt.AttributeAction.Not],
      [124, Qt.AttributeAction.Hyphen],
    ]),
    Ebt = new Set(["has", "not", "matches", "is", "where", "host", "host-context"]);
  function oSe(t) {
    switch (t.type) {
      case Qt.SelectorType.Adjacent:
      case Qt.SelectorType.Child:
      case Qt.SelectorType.Descendant:
      case Qt.SelectorType.Parent:
      case Qt.SelectorType.Sibling:
      case Qt.SelectorType.ColumnCombinator:
        return !0;
      default:
        return !1;
    }
  }
  Fg.isTraversal = oSe;
  var Cbt = new Set(["contains", "icontains"]);
  function Tbt(t, e, r) {
    var n = parseInt(e, 16) - 65536;
    return n !== n || r
      ? e
      : n < 0
        ? String.fromCharCode(n + 65536)
        : String.fromCharCode((n >> 10) | 55296, (n & 1023) | 56320);
  }
  function w_(t) {
    return t.replace(Abt, Tbt);
  }
  function VH(t) {
    return t === 39 || t === 34;
  }
  function nSe(t) {
    return t === 32 || t === 9 || t === 10 || t === 12 || t === 13;
  }
  function Pbt(t) {
    var e = [],
      r = iSe(e, "".concat(t), 0);
    if (r < t.length) throw new Error("Unmatched selector: ".concat(t.slice(r)));
    return e;
  }
  Fg.parse = Pbt;
  function iSe(t, e, r) {
    var n = [];
    function o(ge) {
      var Pe = e.slice(r + ge).match(rSe);
      if (!Pe) throw new Error("Expected name, found ".concat(e.slice(r)));
      var Q = Pe[0];
      return ((r += ge + Q.length), w_(Q));
    }
    function i(ge) {
      for (r += ge; r < e.length && nSe(e.charCodeAt(r)); ) r++;
    }
    function s() {
      r += 1;
      for (var ge = r, Pe = 1; Pe > 0 && r < e.length; r++)
        e.charCodeAt(r) === 40 && !a(r) ? Pe++ : e.charCodeAt(r) === 41 && !a(r) && Pe--;
      if (Pe) throw new Error("Parenthesis not matched");
      return w_(e.slice(ge, r - 1));
    }
    function a(ge) {
      for (var Pe = 0; e.charCodeAt(--ge) === 92; ) Pe++;
      return (Pe & 1) === 1;
    }
    function l() {
      if (n.length > 0 && oSe(n[n.length - 1]))
        throw new Error("Did not expect successive traversals.");
    }
    function c(ge) {
      if (n.length > 0 && n[n.length - 1].type === Qt.SelectorType.Descendant) {
        n[n.length - 1].type = ge;
        return;
      }
      (l(), n.push({ type: ge }));
    }
    function u(ge, Pe) {
      n.push({
        type: Qt.SelectorType.Attribute,
        name: ge,
        action: Pe,
        value: o(1),
        namespace: null,
        ignoreCase: "quirks",
      });
    }
    function p() {
      if (
        (n.length && n[n.length - 1].type === Qt.SelectorType.Descendant && n.pop(), n.length === 0)
      )
        throw new Error("Empty sub-selector");
      t.push(n);
    }
    if ((i(0), e.length === r)) return r;
    e: for (; r < e.length; ) {
      var m = e.charCodeAt(r);
      switch (m) {
        case 32:
        case 9:
        case 10:
        case 12:
        case 13: {
          ((n.length === 0 || n[0].type !== Qt.SelectorType.Descendant) &&
            (l(), n.push({ type: Qt.SelectorType.Descendant })),
            i(1));
          break;
        }
        case 62: {
          (c(Qt.SelectorType.Child), i(1));
          break;
        }
        case 60: {
          (c(Qt.SelectorType.Parent), i(1));
          break;
        }
        case 126: {
          (c(Qt.SelectorType.Sibling), i(1));
          break;
        }
        case 43: {
          (c(Qt.SelectorType.Adjacent), i(1));
          break;
        }
        case 46: {
          u("class", Qt.AttributeAction.Element);
          break;
        }
        case 35: {
          u("id", Qt.AttributeAction.Equals);
          break;
        }
        case 91: {
          i(1);
          var f = void 0,
            h = null;
          (e.charCodeAt(r) === 124
            ? (f = o(1))
            : e.startsWith("*|", r)
              ? ((h = "*"), (f = o(2)))
              : ((f = o(0)),
                e.charCodeAt(r) === 124 && e.charCodeAt(r + 1) !== 61 && ((h = f), (f = o(1)))),
            i(0));
          var v = Qt.AttributeAction.Exists,
            y = Rbt.get(e.charCodeAt(r));
          if (y) {
            if (((v = y), e.charCodeAt(r + 1) !== 61)) throw new Error("Expected `=`");
            i(2);
          } else e.charCodeAt(r) === 61 && ((v = Qt.AttributeAction.Equals), i(1));
          var w = "",
            _ = null;
          if (v !== "exists") {
            if (VH(e.charCodeAt(r))) {
              for (
                var S = e.charCodeAt(r), E = r + 1;
                E < e.length && (e.charCodeAt(E) !== S || a(E));

              )
                E += 1;
              if (e.charCodeAt(E) !== S) throw new Error("Attribute value didn't end");
              ((w = w_(e.slice(r + 1, E))), (r = E + 1));
            } else {
              for (
                var T = r;
                r < e.length && ((!nSe(e.charCodeAt(r)) && e.charCodeAt(r) !== 93) || a(r));

              )
                r += 1;
              w = w_(e.slice(T, r));
            }
            i(0);
            var P = e.charCodeAt(r) | 32;
            P === 115 ? ((_ = !1), i(1)) : P === 105 && ((_ = !0), i(1));
          }
          if (e.charCodeAt(r) !== 93) throw new Error("Attribute selector didn't terminate");
          r += 1;
          var M = {
            type: Qt.SelectorType.Attribute,
            name: f,
            action: v,
            value: w,
            namespace: h,
            ignoreCase: _,
          };
          n.push(M);
          break;
        }
        case 58: {
          if (e.charCodeAt(r + 1) === 58) {
            n.push({
              type: Qt.SelectorType.PseudoElement,
              name: o(2).toLowerCase(),
              data: e.charCodeAt(r) === 40 ? s() : null,
            });
            continue;
          }
          var L = o(1).toLowerCase(),
            V = null;
          if (e.charCodeAt(r) === 40)
            if (Ebt.has(L)) {
              if (VH(e.charCodeAt(r + 1)))
                throw new Error("Pseudo-selector ".concat(L, " cannot be quoted"));
              if (((V = []), (r = iSe(V, e, r + 1)), e.charCodeAt(r) !== 41))
                throw new Error("Missing closing parenthesis in :".concat(L, " (").concat(e, ")"));
              r += 1;
            } else {
              if (((V = s()), Cbt.has(L))) {
                var de = V.charCodeAt(0);
                de === V.charCodeAt(V.length - 1) && VH(de) && (V = V.slice(1, -1));
              }
              V = w_(V);
            }
          n.push({ type: Qt.SelectorType.Pseudo, name: L, data: V });
          break;
        }
        case 44: {
          (p(), (n = []), i(1));
          break;
        }
        default: {
          if (e.startsWith("/*", r)) {
            var ue = e.indexOf("*/", r + 2);
            if (ue < 0) throw new Error("Comment was not terminated");
            ((r = ue + 2), n.length === 0 && i(0));
            break;
          }
          var h = null,
            Ae = void 0;
          if (m === 42) ((r += 1), (Ae = "*"));
          else if (m === 124) {
            if (((Ae = ""), e.charCodeAt(r + 1) === 124)) {
              (c(Qt.SelectorType.ColumnCombinator), i(2));
              break;
            }
          } else if (rSe.test(e.slice(r))) Ae = o(0);
          else break e;
          (e.charCodeAt(r) === 124 &&
            e.charCodeAt(r + 1) !== 124 &&
            ((h = Ae), e.charCodeAt(r + 1) === 42 ? ((Ae = "*"), (r += 2)) : (Ae = o(1))),
            n.push(
              Ae === "*"
                ? { type: Qt.SelectorType.Universal, namespace: h }
                : { type: Qt.SelectorType.Tag, name: Ae, namespace: h },
            ));
        }
      }
    }
    return (p(), r);
  }
});
var mSe = A((Ug) => {
  "use strict";
  var s0 =
    (Ug && Ug.__spreadArray) ||
    function (t, e, r) {
      if (r || arguments.length === 2)
        for (var n = 0, o = e.length, i; n < o; n++)
          (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), (i[n] = e[n]));
      return t.concat(i || Array.prototype.slice.call(e));
    };
  Object.defineProperty(Ug, "__esModule", { value: !0 });
  Ug.stringify = void 0;
  var Vr = i0(),
    cSe = ["\\", '"'],
    uSe = s0(s0([], cSe, !0), ["(", ")"], !1),
    Ibt = new Set(
      cSe.map(function (t) {
        return t.charCodeAt(0);
      }),
    ),
    aSe = new Set(
      uSe.map(function (t) {
        return t.charCodeAt(0);
      }),
    ),
    $g = new Set(
      s0(s0([], uSe, !0), ["~", "^", "$", "*", "+", "!", "|", ":", "[", "]", " ", "."], !1).map(
        function (t) {
          return t.charCodeAt(0);
        },
      ),
    );
  function dSe(t) {
    return t
      .map(function (e) {
        return e.map(kbt).join("");
      })
      .join(", ");
  }
  Ug.stringify = dSe;
  function kbt(t, e, r) {
    switch (t.type) {
      case Vr.SelectorType.Child:
        return e === 0 ? "> " : " > ";
      case Vr.SelectorType.Parent:
        return e === 0 ? "< " : " < ";
      case Vr.SelectorType.Sibling:
        return e === 0 ? "~ " : " ~ ";
      case Vr.SelectorType.Adjacent:
        return e === 0 ? "+ " : " + ";
      case Vr.SelectorType.Descendant:
        return " ";
      case Vr.SelectorType.ColumnCombinator:
        return e === 0 ? "|| " : " || ";
      case Vr.SelectorType.Universal:
        return t.namespace === "*" && e + 1 < r.length && "name" in r[e + 1]
          ? ""
          : "".concat(pSe(t.namespace), "*");
      case Vr.SelectorType.Tag:
        return lSe(t);
      case Vr.SelectorType.PseudoElement:
        return "::"
          .concat(ec(t.name, $g))
          .concat(t.data === null ? "" : "(".concat(ec(t.data, aSe), ")"));
      case Vr.SelectorType.Pseudo:
        return ":"
          .concat(ec(t.name, $g))
          .concat(
            t.data === null
              ? ""
              : "(".concat(typeof t.data == "string" ? ec(t.data, aSe) : dSe(t.data), ")"),
          );
      case Vr.SelectorType.Attribute: {
        if (
          t.name === "id" &&
          t.action === Vr.AttributeAction.Equals &&
          t.ignoreCase === "quirks" &&
          !t.namespace
        )
          return "#".concat(ec(t.value, $g));
        if (
          t.name === "class" &&
          t.action === Vr.AttributeAction.Element &&
          t.ignoreCase === "quirks" &&
          !t.namespace
        )
          return ".".concat(ec(t.value, $g));
        var n = lSe(t);
        return t.action === Vr.AttributeAction.Exists
          ? "[".concat(n, "]")
          : "["
              .concat(n)
              .concat(Dbt(t.action), '="')
              .concat(ec(t.value, Ibt), '"')
              .concat(t.ignoreCase === null ? "" : t.ignoreCase ? " i" : " s", "]");
      }
    }
  }
  function Dbt(t) {
    switch (t) {
      case Vr.AttributeAction.Equals:
        return "";
      case Vr.AttributeAction.Element:
        return "~";
      case Vr.AttributeAction.Start:
        return "^";
      case Vr.AttributeAction.End:
        return "$";
      case Vr.AttributeAction.Any:
        return "*";
      case Vr.AttributeAction.Not:
        return "!";
      case Vr.AttributeAction.Hyphen:
        return "|";
      case Vr.AttributeAction.Exists:
        throw new Error("Shouldn't be here");
    }
  }
  function lSe(t) {
    return "".concat(pSe(t.namespace)).concat(ec(t.name, $g));
  }
  function pSe(t) {
    return t !== null ? "".concat(t === "*" ? "*" : ec(t, $g), "|") : "";
  }
  function ec(t, e) {
    for (var r = 0, n = "", o = 0; o < t.length; o++)
      e.has(t.charCodeAt(o)) &&
        ((n += "".concat(t.slice(r, o), "\\").concat(t.charAt(o))), (r = o + 1));
    return n.length > 0 ? n + t.slice(r) : t;
  }
});
var __ = A((Oi) => {
  "use strict";
  var Mbt =
      (Oi && Oi.__createBinding) ||
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
    Obt =
      (Oi && Oi.__exportStar) ||
      function (t, e) {
        for (var r in t)
          r !== "default" && !Object.prototype.hasOwnProperty.call(e, r) && Mbt(e, t, r);
      };
  Object.defineProperty(Oi, "__esModule", { value: !0 });
  Oi.stringify = Oi.parse = Oi.isTraversal = void 0;
  Obt(i0(), Oi);
  var fSe = sSe();
  Object.defineProperty(Oi, "isTraversal", {
    enumerable: !0,
    get: function () {
      return fSe.isTraversal;
    },
  });
  Object.defineProperty(Oi, "parse", {
    enumerable: !0,
    get: function () {
      return fSe.parse;
    },
  });
  var Nbt = mSe();
  Object.defineProperty(Oi, "stringify", {
    enumerable: !0,
    get: function () {
      return Nbt.stringify;
    },
  });
});
var KH = A((x_) => {
  "use strict";
  Object.defineProperty(x_, "__esModule", { value: !0 });
  x_.isTraversal = void 0;
  var Ni = __(),
    hSe = new Map([
      [Ni.SelectorType.Universal, 50],
      [Ni.SelectorType.Tag, 30],
      [Ni.SelectorType.Attribute, 1],
      [Ni.SelectorType.Pseudo, 0],
    ]);
  function Lbt(t) {
    return !hSe.has(t.type);
  }
  x_.isTraversal = Lbt;
  var Bbt = new Map([
    [Ni.AttributeAction.Exists, 10],
    [Ni.AttributeAction.Equals, 8],
    [Ni.AttributeAction.Not, 7],
    [Ni.AttributeAction.Start, 6],
    [Ni.AttributeAction.End, 6],
    [Ni.AttributeAction.Any, 5],
  ]);
  function Fbt(t) {
    for (var e = t.map(gSe), r = 1; r < t.length; r++) {
      var n = e[r];
      if (!(n < 0))
        for (var o = r - 1; o >= 0 && n < e[o]; o--) {
          var i = t[o + 1];
          ((t[o + 1] = t[o]), (t[o] = i), (e[o + 1] = e[o]), (e[o] = n));
        }
    }
  }
  x_.default = Fbt;
  function gSe(t) {
    var e,
      r,
      n = (e = hSe.get(t.type)) !== null && e !== void 0 ? e : -1;
    return (
      t.type === Ni.SelectorType.Attribute
        ? ((n = (r = Bbt.get(t.action)) !== null && r !== void 0 ? r : 4),
          t.action === Ni.AttributeAction.Equals && t.name === "id" && (n = 9),
          t.ignoreCase && (n >>= 1))
        : t.type === Ni.SelectorType.Pseudo &&
          (t.data
            ? t.name === "has" || t.name === "contains"
              ? (n = 0)
              : Array.isArray(t.data)
                ? ((n = Math.min.apply(
                    Math,
                    t.data.map(function (o) {
                      return Math.min.apply(Math, o.map(gSe));
                    }),
                  )),
                  n < 0 && (n = 0))
                : (n = 2)
            : (n = 3)),
      n
    );
  }
});
var vSe = A((qg) => {
  "use strict";
  var $bt =
    (qg && qg.__importDefault) ||
    function (t) {
      return t && t.__esModule ? t : { default: t };
    };
  Object.defineProperty(qg, "__esModule", { value: !0 });
  qg.attributeRules = void 0;
  var a0 = $bt(em()),
    Ubt = /[-[\]{}()*+?.,\\^$|#\s]/g;
  function ySe(t) {
    return t.replace(Ubt, "\\$&");
  }
  var qbt = new Set([
    "accept",
    "accept-charset",
    "align",
    "alink",
    "axis",
    "bgcolor",
    "charset",
    "checked",
    "clear",
    "codetype",
    "color",
    "compact",
    "declare",
    "defer",
    "dir",
    "direction",
    "disabled",
    "enctype",
    "face",
    "frame",
    "hreflang",
    "http-equiv",
    "lang",
    "language",
    "link",
    "media",
    "method",
    "multiple",
    "nohref",
    "noresize",
    "noshade",
    "nowrap",
    "readonly",
    "rel",
    "rev",
    "rules",
    "scope",
    "scrolling",
    "selected",
    "shape",
    "target",
    "text",
    "type",
    "valign",
    "valuetype",
    "vlink",
  ]);
  function tm(t, e) {
    return typeof t.ignoreCase == "boolean"
      ? t.ignoreCase
      : t.ignoreCase === "quirks"
        ? !!e.quirksMode
        : !e.xmlMode && qbt.has(t.name);
  }
  qg.attributeRules = {
    equals: function (t, e, r) {
      var n = r.adapter,
        o = e.name,
        i = e.value;
      return tm(e, r)
        ? ((i = i.toLowerCase()),
          function (s) {
            var a = n.getAttributeValue(s, o);
            return a != null && a.length === i.length && a.toLowerCase() === i && t(s);
          })
        : function (s) {
            return n.getAttributeValue(s, o) === i && t(s);
          };
    },
    hyphen: function (t, e, r) {
      var n = r.adapter,
        o = e.name,
        i = e.value,
        s = i.length;
      return tm(e, r)
        ? ((i = i.toLowerCase()),
          function (l) {
            var c = n.getAttributeValue(l, o);
            return (
              c != null &&
              (c.length === s || c.charAt(s) === "-") &&
              c.substr(0, s).toLowerCase() === i &&
              t(l)
            );
          })
        : function (l) {
            var c = n.getAttributeValue(l, o);
            return (
              c != null && (c.length === s || c.charAt(s) === "-") && c.substr(0, s) === i && t(l)
            );
          };
    },
    element: function (t, e, r) {
      var n = r.adapter,
        o = e.name,
        i = e.value;
      if (/\s/.test(i)) return a0.default.falseFunc;
      var s = new RegExp("(?:^|\\s)".concat(ySe(i), "(?:$|\\s)"), tm(e, r) ? "i" : "");
      return function (l) {
        var c = n.getAttributeValue(l, o);
        return c != null && c.length >= i.length && s.test(c) && t(l);
      };
    },
    exists: function (t, e, r) {
      var n = e.name,
        o = r.adapter;
      return function (i) {
        return o.hasAttrib(i, n) && t(i);
      };
    },
    start: function (t, e, r) {
      var n = r.adapter,
        o = e.name,
        i = e.value,
        s = i.length;
      return s === 0
        ? a0.default.falseFunc
        : tm(e, r)
          ? ((i = i.toLowerCase()),
            function (a) {
              var l = n.getAttributeValue(a, o);
              return l != null && l.length >= s && l.substr(0, s).toLowerCase() === i && t(a);
            })
          : function (a) {
              var l;
              return (
                !!(
                  !((l = n.getAttributeValue(a, o)) === null || l === void 0) && l.startsWith(i)
                ) && t(a)
              );
            };
    },
    end: function (t, e, r) {
      var n = r.adapter,
        o = e.name,
        i = e.value,
        s = -i.length;
      return s === 0
        ? a0.default.falseFunc
        : tm(e, r)
          ? ((i = i.toLowerCase()),
            function (a) {
              var l;
              return (
                ((l = n.getAttributeValue(a, o)) === null || l === void 0
                  ? void 0
                  : l.substr(s).toLowerCase()) === i && t(a)
              );
            })
          : function (a) {
              var l;
              return (
                !!(!((l = n.getAttributeValue(a, o)) === null || l === void 0) && l.endsWith(i)) &&
                t(a)
              );
            };
    },
    any: function (t, e, r) {
      var n = r.adapter,
        o = e.name,
        i = e.value;
      if (i === "") return a0.default.falseFunc;
      if (tm(e, r)) {
        var s = new RegExp(ySe(i), "i");
        return function (l) {
          var c = n.getAttributeValue(l, o);
          return c != null && c.length >= i.length && s.test(c) && t(l);
        };
      }
      return function (a) {
        var l;
        return (
          !!(!((l = n.getAttributeValue(a, o)) === null || l === void 0) && l.includes(i)) && t(a)
        );
      };
    },
    not: function (t, e, r) {
      var n = r.adapter,
        o = e.name,
        i = e.value;
      return i === ""
        ? function (s) {
            return !!n.getAttributeValue(s, o) && t(s);
          }
        : tm(e, r)
          ? ((i = i.toLowerCase()),
            function (s) {
              var a = n.getAttributeValue(s, o);
              return (a == null || a.length !== i.length || a.toLowerCase() !== i) && t(s);
            })
          : function (s) {
              return n.getAttributeValue(s, o) !== i && t(s);
            };
    },
  };
});
