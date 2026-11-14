var Ygt,
  Jgt,
  Aye = g(() => {
    "use strict";
    Ygt = F(Yw());
    $();
    Jgt = d.union([
      d.templateLiteral(["codex:thread:local:", d.string()]),
      d.templateLiteral(["codex:thread:remote:", d.string()]),
      d.templateLiteral(["codex:project:", d.string()]),
      d.templateLiteral(["chatgpt:conversation:", d.string()]),
      d.templateLiteral(["chatgpt:project:", d.string()]),
      d.templateLiteral(["space:page:", d.string(), ":", d.string()]),
      d.templateLiteral(["space:space:", d.string(), ":", d.string()]),
      d.templateLiteral(["dot:", d.string(), ":", d.string()]),
      d.templateLiteral(["site:", d.string(), ":", d.string(), ":", d.string()]),
      d.templateLiteral(["content-tab:", d.string()]),
    ]);
  });
var mhr,
  fhr,
  hhr,
  ghr,
  Rye = g(() => {
    "use strict";
    $();
    ql();
    Aye();
    ((mhr = d.object({
      threadIds: d.array(d.string()),
      sortKey: d.enum(["created_at", "updated_at"]).optional(),
    })),
      (fhr = d.record(d.string(), d.unknown())),
      (hhr = d.tuple([d.string(), d.string(), d.string().startsWith("g-p-")])),
      (ghr = d.discriminatedUnion("type", [
        d.object({
          type: d.literal("reorder"),
          visibleKeys: d.array(d.string().min(1)),
          nextKeys: d.array(d.string().min(1)),
        }),
        d.object({ type: d.literal("prepend"), key: d.string().min(1) }),
        d.object({
          type: d.literal("replace"),
          previousKey: d.string().min(1),
          key: d.string().min(1),
        }),
      ])));
  });
var aH,
  vhr,
  Eye = g(() => {
    "use strict";
    ((aH = ["png", "jpg", "jpeg", "gif", "webp"]), (vhr = new Set(aH)));
  });
var Cye,
  Tye = g(() => {
    "use strict";
    $();
    Ti();
    Cye = d.object({
      id: d.string(),
      hostId: d.string(),
      remotePath: d.string(),
      label: d.string(),
    });
  });
var Pye = g(() => {
  "use strict";
});
var Iye = g(() => {
  "use strict";
});
var kye = g(() => {
  "use strict";
});
var Dye = g(() => {
  "use strict";
});
function Mye(t, e = 36) {
  let n = (
    t
      .replace(
        /\r\n/g,
        `
`,
      )
      .split(
        `
`,
      )
      .find((o) => o.trim().length > 0) ?? ""
  ).trim();
  if (
    n.length === 0 ||
    ((n = n.replace(/^title[:\s]+/i, "")),
    (n = n.replace(/^[`"'\u201c\u201d\u2018\u2019]+|[`"'\u201c\u201d\u2018\u2019]+$/g, "")),
    (n = n.replace(/\s+/g, " ").trim()),
    (n = n.replace(/[.?!]+$/, "").trim()),
    n.length === 0)
  )
    return null;
  if (n.length > e) {
    let o = e;
    n[o] !== " " && n[o - 1] !== " " && ((o = n.indexOf(" ", o)), o === -1 && (o = n.length));
    let i = n.slice(0, o).trimEnd();
    return n.slice(o).trim().length === 0 ? i : `${i}\u2026`;
  }
  return n;
}
var Oye = g(() => {
  "use strict";
});
function Bye(t, e) {
  return { assignments: tyt(t), projectlessThreadIds: eyt.safeParse(e).data ?? [] };
}
function Jw(t, e) {
  return { assignment: t.assignments[e] ?? null, projectless: t.projectlessThreadIds.includes(e) };
}
function lH(t, e) {
  let r = { ...t.assignments },
    n = new Set(t.projectlessThreadIds),
    o = new Set();
  for (let { threadId: c, assignment: u, projectless: p } of e)
    (u == null ? delete r[c] : (r[c] = u), p ? n.add(c) : n.delete(c), o.add(c));
  let i = new Set(t.projectlessThreadIds),
    s = {},
    a = !1,
    l = !1;
  for (let c of o) {
    let u = r[c] ?? null,
      p = n.has(c),
      m = !ryt(t.assignments[c], u),
      f = i.has(c) !== p;
    ((a = a || m), (l = l || f), (m || f) && (s[c] = { assignment: u, projectless: p }));
  }
  return {
    records: {
      assignments: a ? r : t.assignments,
      projectlessThreadIds: l ? [...n] : t.projectlessThreadIds,
    },
    memberships: s,
  };
}
function tyt(t) {
  let e = Qgt.safeParse(t).data;
  return e == null
    ? {}
    : Object.fromEntries(
        Object.entries(e).flatMap(([r, n]) => {
          let o = kg.safeParse(n).data;
          return o == null ? [] : [[r, o]];
        }),
      );
}
function ryt(t, e) {
  return t == null || e == null
    ? t == null && e == null
    : t.projectKind === e.projectKind &&
        t.projectId === e.projectId &&
        Lye(t) === Lye(e) &&
        Nye(t) === Nye(e);
}
function Nye(t) {
  switch (t.projectKind) {
    case "local":
      return null;
    case "remote":
      return t.hostId ?? null;
  }
}
function Lye(t) {
  return t.projectKind === "local" ? t.projectOrigin : void 0;
}
var kg,
  Qgt,
  eyt,
  cH = g(() => {
    "use strict";
    $();
    ((kg = d.discriminatedUnion("projectKind", [
      d.object({
        projectKind: d.literal("local"),
        projectId: d.string(),
        projectOrigin: d.literal("chatgpt").optional(),
      }),
      d.object({
        projectKind: d.literal("remote"),
        projectId: d.string(),
        hostId: d.string().optional(),
      }),
    ])),
      (Qgt = d.record(d.string(), d.unknown())),
      (eyt = d.array(d.string())));
  });
var Fye,
  Ihr,
  $ye = g(() => {
    "use strict";
    $();
    cH();
    ((Fye = d.object({
      projectSources: d.array(d.string()),
      cwd: d.string(),
      runtimeWorkspaceRoots: d.array(d.string()),
    })),
      (Ihr = d.object({
        revision: d.string(),
        project: kg.nullable(),
        projectMembership: kg.optional(),
        projectMembershipRevision: d.string().optional(),
        applied: Fye.nullable(),
        pending: Fye.nullable(),
      })));
  });
var Uye,
  Dhr,
  qye = g(() => {
    "use strict";
    ((Uye = "## My request:"),
      (Dhr = `${Uye}
`));
  });
var Gye = g(() => {
  "use strict";
  qye();
});
var Wye = g(() => {
  "use strict";
});
var Hye = g(() => {
  "use strict";
});
function Qw() {
  return oyt;
}
function jt(t, e) {
  return Qw().startSpan(t, e);
}
function jye() {
  return Qw().getActiveSpanContext();
}
function fo() {
  return Qw().getActiveTraceContext();
}
function Ia(t, e) {
  Qw().setActiveSpanOutcome(t, e);
}
function e_(t) {
  Qw().setActiveSpanAttributes(t);
}
var nyt,
  oyt,
  zye = g(() => {
    "use strict";
    ((nyt = {
      getActiveSpanContext: () => null,
      getActiveTraceContext: () => null,
      runWithTraceContext: (t, e) => e(),
      setActiveSpanAttributes: (t) => {},
      setActiveSpanOutcome: (t, e) => {},
      startSpan: (t, e) => e(),
    }),
      (oyt = nyt));
  });
function uH(t, e) {
  let r = Ms(e, "turnLineage");
  return {
    ...t,
    turnTrigger: Ms(e, "turnTrigger") ? t.turnTrigger : void 0,
    parentTurnId: r ? t.parentTurnId : void 0,
    rootTurnId: r ? t.rootTurnId : void 0,
  };
}
var Vye,
  Ik = g(() => {
    "use strict";
    dg();
    Vye = "none";
  });
var Kye = g(() => {
  "use strict";
});
var Zye = g(() => {
  "use strict";
});
var Xye = g(() => {
  "use strict";
});
var Yye = g(() => {
  "use strict";
});
var Jye = g(() => {
  "use strict";
});
var iyt,
  Qye = g(() => {
    "use strict";
    iyt = F(Yw());
    Ti();
  });
var No,
  eve,
  tve = g(() => {
    "use strict";
    ((No = "Git is unavailable"), (eve = "Codex <noreply@openai.com>"));
  });
var rve = g(() => {
  "use strict";
});
var nve = g(() => {
  "use strict";
});
var ove = g(() => {
  "use strict";
});
var ive = g(() => {
  "use strict";
});
var sve = g(() => {
  "use strict";
});
var Dg,
  ave = g(() => {
    "use strict";
    Dg = class {
      constructor(e) {
        this.emit = e;
      }
    };
  });
var lve = g(() => {
  "use strict";
});
var cve = g(() => {
  "use strict";
  tve();
  rve();
  nve();
  ove();
  ive();
  sve();
  ave();
  lve();
});
var agr,
  uve = g(() => {
    "use strict";
    $();
    agr = d.enum(["project", "projectless"]);
  });
var dve = g(() => {
  "use strict";
});
var mgr,
  t_,
  pve = g(() => {
    "use strict";
    $();
    Ti();
    mI();
    ((mgr = d.object({ threadId: d.string().min(1), archived: d.boolean() })),
      (t_ = d
        .string()
        .min(1)
        .max(64)
        .regex(
          /^(?![0-9a-f]{4,}$)(?!(?:con|prn|aux|nul|com[1-9]|lpt[1-9])$)[a-z0-9]+(?:-[a-z0-9]+)*$/,
          "Use lowercase letters, numbers, and single hyphens; hexadecimal IDs and Windows device names are reserved.",
        )));
  });
function Su(t) {
  return /^\/mnt\/[a-zA-Z](?:\/|$)/.test(t) ? !0 : /^\\{1,2}[Mm][Nn][Tt]\\[a-zA-Z](?:\\|$)/.test(t);
}
function wu(t) {
  return /^[a-zA-Z]:[\\/]/.test(t) ? !0 : t.startsWith("\\\\") || t.startsWith("//");
}
function Ls(t) {
  return /^(\\\\|\/\/)(?:\?[\\/]UNC[\\/])?(wsl\$|wsl\.localhost)[\\/]/i.test(t);
}
function kk(t) {
  let e = t.match(/^\/mnt\/([a-zA-Z])(?:\/(.*))?$/);
  if (e) {
    let o = e[1].toUpperCase(),
      i = (e[2] ?? "").replace(/\//g, "\\");
    return `${o}:\\${i}`;
  }
  let r = t.match(/^\\{1,2}[Mm][Nn][Tt]\\([a-zA-Z])(?:\\(.*))?$/i);
  if (r) {
    let o = r[1].toUpperCase(),
      i = (r[2] ?? "").replace(/[\\/]/g, "\\");
    return `${o}:\\${i}`;
  }
  let n = t.match(/^C:\\mnt\\c(.*)$/i);
  return n
    ? `C:\\${n[1].replace(/^([\\/])+/, "").replace(/[\\/]/g, "\\")}`
    : t.replace(/\//g, "\\");
}
function ho(t) {
  let e = t.match(/^(?:\\\\|\/\/)\?[\\/]UNC[\\/](wsl\$|wsl\.localhost)[\\/](.*)$/i);
  if (e) return ho(`\\\\${e[1]}\\${e[2]}`);
  let r = t.match(/^(?:\\\\|\/\/)\?[\\/]([a-zA-Z]):[\\/](.*)$/);
  if (r) {
    let o = r[1].toLowerCase(),
      i = r[2].replace(/\\/g, "/");
    return `/mnt/${o}/${i}`;
  }
  if (/^(\\\\|\/\/)(wsl\$|wsl\.localhost)/i.test(t)) {
    let i = t.replace(/^((\\\\|\/\/)(wsl\$|wsl\.localhost)[\\/]+)/i, "").split(/[\\/]/);
    i.shift();
    let s = i.join("/").replace(/\\/g, "/");
    return s.length === 0 ? "/" : s.startsWith("/") ? s : `/${s}`;
  }
  if (t.startsWith("\\\\") || t.startsWith("//")) return jp(t);
  if (t.startsWith("/")) return t;
  let n = t.match(/^([a-zA-Z]):[\\/](.*)$/);
  if (n) {
    let o = n[1].toLowerCase(),
      i = n[2].replace(/\\/g, "/");
    return `/mnt/${o}/${i}`;
  }
  return t.replace(/\\/g, "/");
}
function jp(t) {
  return t.replace(/\//g, "\\");
}
var mve = g(() => {
  "use strict";
});
var dH,
  syt,
  ygr,
  fve = g(() => {
    "use strict";
    $();
    ((dH = /^[^\r\n\0]*$/),
      (syt = d.object({
        hostId: d.string(),
        roots: d.array(d.string().min(1)).min(1).max(20),
        priorityFolders: d.array(d.string().min(1).max(4096).regex(dH)).max(20).optional(),
        query: d.string().min(1).max(256).regex(dH),
        fileMask: d.string().max(256).regex(dH),
      })),
      (ygr = syt.pick({ hostId: !0, roots: !0 })));
  });
var hve = g(() => {
  "use strict";
});
var gve = g(() => {
  "use strict";
});
var yve = g(() => {
  "use strict";
});
var O = g(() => {
  "use strict";
  XJ();
  vne();
  bne();
  Sne();
  qne();
  Gne();
  bq();
  toe();
  KS();
  Sq();
  Yq();
  Sle();
  wle();
  _le();
  xle();
  Ale();
  Cle();
  Ple();
  Ile();
  kle();
  eG();
  fce();
  HS();
  gce();
  yce();
  vce();
  wce();
  iG();
  _ce();
  cG();
  aG();
  xce();
  dg();
  Pce();
  Dce();
  Mce();
  dG();
  Nce();
  hI();
  pq();
  Lce();
  Bce();
  Fce();
  $ce();
  qce();
  Gce();
  jS();
  Wce();
  Hce();
  wI();
  tue();
  rue();
  nue();
  yw();
  oue();
  iue();
  sue();
  aue();
  lue();
  cue();
  due();
  pue();
  fue();
  wG();
  gue();
  yue();
  vue();
  _G();
  Sue();
  Jq();
  wue();
  xG();
  _ue();
  xue();
  Cue();
  bw();
  Tue();
  Pue();
  vde();
  xde();
  Lpe();
  Ti();
  Bpe();
  Upe();
  Gpe();
  Hpe();
  jpe();
  vp();
  zpe();
  Vpe();
  uG();
  Zpe();
  Xpe();
  Ype();
  Qpe();
  eme();
  tme();
  ome();
  ume();
  pme();
  mme();
  fme();
  hme();
  ZI();
  gme();
  yme();
  vme();
  qP();
  Sme();
  xme();
  Rme();
  XI();
  Eme();
  Cme();
  aW();
  Tme();
  Ap();
  Pme();
  Ime();
  kme();
  Dme();
  Mme();
  $P();
  Ome();
  Lme();
  Bme();
  Ume();
  cW();
  qme();
  Gme();
  Wme();
  Hme();
  Vme();
  Kme();
  Zme();
  Xme();
  Yme();
  Jme();
  Qme();
  efe();
  tfe();
  rfe();
  ql();
  nfe();
  yW();
  jfe();
  AW();
  Vfe();
  vq();
  Kfe();
  QI();
  Xfe();
  khe();
  Dhe();
  Mhe();
  Ohe();
  Nhe();
  Lhe();
  Bhe();
  Fhe();
  qhe();
  Ghe();
  Whe();
  jhe();
  zhe();
  Vhe();
  Khe();
  Jhe();
  Qhe();
  jW();
  ege();
  oge();
  sge();
  age();
  lge();
  cge();
  uge();
  hge();
  wge();
  cg();
  VW();
  bye();
  Sye();
  wye();
  Rye();
  Eye();
  Tye();
  Pye();
  Iye();
  kye();
  Dye();
  mI();
  Oye();
  cH();
  $ye();
  Gye();
  Wye();
  Hye();
  Iw();
  zye();
  Ik();
  Kye();
  Zye();
  Xye();
  Yye();
  Jye();
  Qye();
  cve();
  uve();
  dve();
  pve();
  mve();
  fve();
  zW();
  hve();
  gve();
  yve();
});
function Yl(t, e) {
  return lyt(t, e);
}
var lyt,
  _u = g(() => {
    lyt = (t, e) => fetch(t, e);
  });
function a_(t) {
  switch (typeof t) {
    case "boolean":
    case "number":
    case "string":
      return "primitive";
    case "undefined":
      return "undefined";
    case "object":
    case "function":
      break;
    case "bigint":
      return "bigint";
    default:
      return "unsupported";
  }
  if (t === null) return "primitive";
  let e = Object.getPrototypeOf(t);
  switch (e) {
    case Object.prototype:
      return "object";
    case Function.prototype:
    case uyt.prototype:
      return "function";
    case Array.prototype:
      return "array";
    case Date.prototype:
      return "date";
    case Uint8Array.prototype:
    case dyt:
    case ArrayBuffer.prototype:
    case DataView.prototype:
    case Int8Array.prototype:
    case Uint8ClampedArray.prototype:
    case Int16Array.prototype:
    case Uint16Array.prototype:
    case Int32Array.prototype:
    case Uint32Array.prototype:
    case BigInt64Array.prototype:
    case BigUint64Array.prototype:
    case Float32Array.prototype:
    case Float64Array.prototype:
      return "bytes";
    case WritableStream.prototype:
      return "writable";
    case ReadableStream.prototype:
      return "readable";
    case URL.prototype:
      return "url";
    case Headers.prototype:
      return "headers";
    case Request.prototype:
      return "request";
    case Response.prototype:
      return "response";
    case Blob.prototype:
      return "blob";
    case ka.prototype:
      return "stub";
    case rn.prototype:
      return "rpc-promise";
    default:
      if (Vp) {
        if (e == Vp.RpcStub.prototype || t instanceof Vp.ServiceStub) return "rpc-target";
        if (e == Vp.RpcPromise.prototype || e == Vp.RpcProperty.prototype) return "rpc-thenable";
      }
      return t instanceof Nk ? "rpc-target" : t instanceof Error ? "error" : "unsupported";
  }
}
function vve() {
  throw new Error("RPC map() implementation was not loaded.");
}
function pH() {
  throw new Error("Stream implementation was not loaded.");
}
function myt(t, e) {
  let r = Dk;
  Dk = t;
  try {
    return e();
  } finally {
    Dk = r;
  }
}
function hyt(t) {
  let { hook: e, pathIfPromise: r } = t[Bs];
  return r && r.length > 0 ? e.get(r) : e;
}
function gyt(t) {
  let { hook: e, pathIfPromise: r } = t[Bs];
  return r ? e.get(r) : e.dup();
}
function Lk(t) {
  let { hook: e, pathIfPromise: r } = t[Bs];
  if (!(r && r.length > 0)) return e;
}
function bve(t) {
  return t[Bs].hook;
}
function Bk(t) {
  return t[Bs];
}
async function mH(t) {
  let { hook: e, pathIfPromise: r } = t[Bs];
  return (r.length > 0 && (e = e.get(r)), (await e.pull()).deliverResolve());
}
function fH(t, e, r, n) {
  for (let o = 0; o < r.length; o++) {
    e = t;
    let i = r[o];
    if (i in Object.prototype) {
      t = void 0;
      continue;
    }
    switch (a_(t)) {
      case "object":
      case "function":
        Object.hasOwn(t, i) ? (t = t[i]) : (t = void 0);
        break;
      case "array":
        Number.isInteger(i) && i >= 0 ? (t = t[i]) : (t = void 0);
        break;
      case "rpc-target":
      case "rpc-thenable":
        if (Object.hasOwn(t, i))
          throw new TypeError(
            `Attempted to access property '${i}', which is an instance property of the RpcTarget. To avoid leaking private internals, instance properties cannot be accessed over RPC. If you want to make this property available over RPC, define it as a method or getter on the class, instead of an instance property.`,
          );
        ((t = t[i]), (n = null));
        break;
      case "stub":
      case "rpc-promise": {
        let { hook: s, pathIfPromise: a } = Bk(t);
        return { hook: s, remainingPath: a ? a.concat(r.slice(o)) : r.slice(o) };
      }
      case "writable":
        t = void 0;
        break;
      case "readable":
        t = void 0;
        break;
      case "primitive":
      case "bigint":
      case "bytes":
      case "blob":
      case "date":
      case "error":
      case "url":
      case "headers":
      case "request":
      case "response":
        t = void 0;
        break;
      case "undefined":
        t = t[i];
        break;
      case "unsupported":
        if (o === 0) throw new TypeError("RPC stub points at a non-serializable type.");
        {
          let s = r.slice(0, o).join("."),
            a = r.slice(0, o).join(".");
          throw new TypeError(
            `'${s}' is not a serializable type, so property ${a} cannot be accessed.`,
          );
        }
      default:
        throw new TypeError("unreachable");
    }
  }
  if (t instanceof rn) {
    let { hook: o, pathIfPromise: i } = Bk(t);
    return { hook: o, remainingPath: i || [] };
  }
  return { value: t, parent: e, owner: n };
}
function Rve(t) {
  if (Symbol.dispose in t)
    try {
      t[Symbol.dispose]();
    } catch (e) {
      Promise.reject(e);
    }
}
function vyt(t) {
  return yyt.includes(t);
}
function Pve(t, e) {
  if (e !== 2 && e !== 4 && e !== 8) throw new RangeError(`Unsupported element size: ${e}`);
  let r = new DataView(t.buffer, t.byteOffset, t.byteLength);
  for (let n = 0; n < t.byteLength; n += e)
    switch (e) {
      case 2:
        r.setUint16(n, r.getUint16(n, !1), !0);
        break;
      case 4:
        r.setUint32(n, r.getUint32(n, !1), !0);
        break;
      case 8:
        r.setBigUint64(n, r.getBigUint64(n, !1), !0);
        break;
    }
}
async function wyt(t, e) {
  let r = await new Response(t).blob();
  return r.type === e ? r : r.slice(0, r.size, e);
}
function Ayt(t, e) {
  return new rn(
    new $k(
      new Response(e).arrayBuffer().then((r) => {
        let n = new Uint8Array(r),
          o = new Request(t, { body: n });
        return new ki(go.fromAppReturn(o));
      }),
    ),
    [],
  );
}
function Ryt(t, e) {
  return new rn(new $k(wyt(t, e).then((r) => new ki(go.fromAppReturn(r)))), []);
}
function Mg(t) {
  return 2 + t.length * 3;
}
function Ok(t, e, r = 0) {
  if (r >= Eyt) return r_;
  switch (typeof t) {
    case "string":
      return Mg(t);
    case "number":
      return 16;
    case "bigint":
      return 16;
    case "boolean":
      return 8;
    case "undefined":
      return 16;
    case "object": {
      if (t === null) return 8;
      if (ArrayBuffer.isView(t) || t instanceof ArrayBuffer) return gH + t.byteLength;
      if (typeof Blob < "u" && t instanceof Blob) return gH + t.size;
      if (t instanceof Date) return 16;
      if (((e ??= new WeakSet()), e.has(t))) return r_;
      if ((e.add(t), t instanceof Array)) {
        let o = hH;
        for (let i of t) o += r_ + Ok(i, e, r + 1);
        return o;
      }
      if (t instanceof Error) {
        let o = hH + Mg(t.name) + Mg(t.message) + Mg(t.stack ?? "");
        for (let i of Object.keys(t)) o += r_ + Mg(i) + Ok(t[i], e, r + 1);
        return o;
      }
      let n = hH;
      for (let o of Object.keys(t)) n += r_ + Mg(o) + Ok(t[o], e, r + 1);
      return n;
    }
    default:
      return 16;
  }
}
function n_() {
  throw new Error(
    "Attempted to use an abstract placeholder from a mapper function. Please make sure your map function has no side effects.",
  );
}
function wve(t, e, r, n, o) {
  let i = new kyt(n, new ki(go.deepCopyFrom(t, e, r)));
  try {
    return i.apply(o);
  } finally {
    i.dispose();
  }
}
function Uyt(t) {
  let e,
    r = !1,
    n = new $yt(() => performance.now()),
    o,
    i,
    s = () => {
      r || ((r = !0), t.dispose());
    };
  return new WritableStream({
    write(a, l) {
      if (e !== void 0) throw e;
      let c = go.fromAppParams([a]),
        { promise: u, size: p } = t.stream(["write"], c);
      if (p === void 0)
        return u.catch((m) => {
          throw (e === void 0 && (e = m), m);
        });
      {
        let { token: m, shouldBlock: f } = n.onSend(p);
        if (
          (u.then(
            () => {
              n.onAck(m) && o && (o(), (o = void 0), (i = void 0));
            },
            (h) => {
              (n.onError(m),
                e === void 0 && ((e = h), l.error(h), s()),
                i && (i(h), (o = void 0), (i = void 0)));
            },
          ),
          f)
        )
          return new Promise((h, v) => {
            ((o = h), (i = v));
          });
      }
    },
    async close() {
      if (e !== void 0) throw (s(), e);
      let { promise: a } = t.stream(["close"], go.fromAppParams([]));
      try {
        await a;
      } catch (l) {
        throw e ?? l;
      } finally {
        s();
      }
    },
    abort(a) {
      if (e !== void 0) return;
      ((e = a ?? new Error("WritableStream was aborted")), i && (i(e), (o = void 0), (i = void 0)));
      let { promise: l } = t.stream(["abort"], go.fromAppParams([a]));
      l.then(
        () => s(),
        () => s(),
      );
    },
  });
}
var cyt,
  Vp,
  Nk,
  uyt,
  dyt,
  Fk,
  Yn,
  Eu,
  oi,
  pyt,
  Dk,
  Bs,
  fyt,
  ka,
  rn,
  go,
  xve,
  ki,
  i_,
  $k,
  SH,
  Eve,
  yyt,
  Cve,
  Sve,
  Tve,
  byt,
  Syt,
  _yt,
  xu,
  xyt,
  WSr,
  Au,
  hH,
  r_,
  gH,
  Eyt,
  zp,
  Ru,
  Cyt,
  Tyt,
  Pyt,
  Kp,
  Iyt,
  o_,
  kyt,
  Dyt,
  Myt,
  Oyt,
  Nyt,
  Lyt,
  _ve,
  Byt,
  Fyt,
  $yt,
  qyt,
  Mve,
  ee,
  ot = g(() => {
    cyt = Symbol("workers-module");
    Symbol.dispose || (Symbol.dispose = Symbol.for("dispose"));
    Symbol.asyncDispose || (Symbol.asyncDispose = Symbol.for("asyncDispose"));
    Promise.withResolvers ||
      (Promise.withResolvers = function () {
        let t, e;
        return {
          promise: new Promise((r, n) => {
            ((t = r), (e = n));
          }),
          resolve: t,
          reject: e,
        };
      });
    ((Vp = globalThis[cyt]),
      (Nk = Vp ? Vp.RpcTarget : class {}),
      (uyt = async function () {}.constructor),
      (dyt = typeof Buffer < "u" ? Buffer.prototype : void 0));
    Fk = { applyMap: vve, sendMap: vve };
    ((Yn = {
      createWritableStreamHook: pH,
      createWritableStreamFromHook: pH,
      createReadableStreamHook: pH,
    }),
      (Eu = class {
        stream(t, e) {
          let r = this.call(t, e).pull(),
            n;
          return (
            r instanceof Promise
              ? (n = r.then((o) => {
                  o.dispose();
                }))
              : (r.dispose(), (n = Promise.resolve())),
            { promise: n }
          );
        }
      }),
      (oi = class extends Eu {
        error;
        constructor(t) {
          (super(), (this.error = t));
        }
        call(t, e) {
          return this;
        }
        map(t, e, r) {
          return this;
        }
        get(t) {
          return this;
        }
        dup() {
          return this;
        }
        pull() {
          return Promise.reject(this.error);
        }
        ignoreUnhandledRejections() {}
        dispose() {}
        onBroken(t) {
          try {
            t(this.error);
          } catch (e) {
            Promise.resolve(e);
          }
        }
      }),
      (pyt = new oi(new Error("Attempted to use RPC stub after it has been disposed."))),
      (Dk = (t, e, r) => t.call(e, r)));
    ((Bs = Symbol("realStub")),
      (fyt = {
        apply(t, e, r) {
          let n = t.raw;
          return new rn(Dk(n.hook, n.pathIfPromise || [], go.fromAppParams(r)), []);
        },
        get(t, e, r) {
          let n = t.raw;
          return e === Bs
            ? n
            : e in rn.prototype
              ? n[e]
              : typeof e == "string"
                ? new rn(n.hook, n.pathIfPromise ? [...n.pathIfPromise, e] : [e])
                : e === Symbol.dispose && (!n.pathIfPromise || n.pathIfPromise.length == 0)
                  ? () => {
                      (n.hook.dispose(), (n.hook = pyt));
                    }
                  : void 0;
        },
        has(t, e) {
          let r = t.raw;
          return e === Bs
            ? !0
            : e in rn.prototype
              ? e in r
              : typeof e == "string"
                ? !0
                : e === Symbol.dispose && (!r.pathIfPromise || r.pathIfPromise.length == 0);
        },
        construct(t, e) {
          throw new Error("An RPC stub cannot be used as a constructor.");
        },
        defineProperty(t, e, r) {
          throw new Error("Can't define properties on RPC stubs.");
        },
        deleteProperty(t, e) {
          throw new Error("Can't delete properties on RPC stubs.");
        },
        getOwnPropertyDescriptor(t, e) {},
        getPrototypeOf(t) {
          return Object.getPrototypeOf(t.raw);
        },
        isExtensible(t) {
          return !1;
        },
        ownKeys(t) {
          return [];
        },
        preventExtensions(t) {
          return !0;
        },
        set(t, e, r, n) {
          throw new Error("Can't assign properties on RPC stubs.");
        },
        setPrototypeOf(t, e) {
          throw new Error("Can't override prototype of RPC stubs.");
        },
      }),
      (ka = class Mk extends Nk {
        static setMessagePortServiceName(e, r) {
          if (!(e instanceof Mk)) return;
          let n = Lk(e);
          if (!(n instanceof Ru) || !n.entry) return;
          let o = n.entry;
          (r != null && (o.session.hasMessagePortServices = !0),
            o.messagePortService === void 0
              ? (o.messagePortService = r != null ? { service: r } : null)
              : o.messagePortService?.service !== r && (o.messagePortService = null));
        }
        constructor(e, r) {
          if ((super(), !(e instanceof Eu))) {
            let o = e;
            if (
              (o instanceof Nk || o instanceof Function
                ? (e = i_.create(o, void 0))
                : (e = new ki(go.fromAppReturn(o))),
              r)
            )
              throw new TypeError("RpcStub constructor expected one argument, received two.");
          }
          ((this.hook = e), (this.pathIfPromise = r));
          let n = () => {};
          return ((n.raw = this), new Proxy(n, fyt));
        }
        hook;
        pathIfPromise;
        dup() {
          let e = this[Bs];
          return e.pathIfPromise ? new Mk(e.hook.get(e.pathIfPromise)) : new Mk(e.hook.dup());
        }
        onRpcBroken(e) {
          this[Bs].hook.onBroken(e);
        }
        map(e) {
          let { hook: r, pathIfPromise: n } = this[Bs];
          return Fk.sendMap(r, n || [], e);
        }
        toString() {
          return "[object RpcStub]";
        }
      }),
      (rn = class extends ka {
        constructor(t, e) {
          super(t, e);
        }
        then(t, e) {
          return mH(this).then(...arguments);
        }
        catch(t) {
          return mH(this).catch(...arguments);
        }
        finally(t) {
          return mH(this).finally(...arguments);
        }
        toString() {
          return "[object RpcPromise]";
        }
      }));
    go = class Ii {
      value;
      source;
      hooks;
      promises;
      static fromAppParams(e) {
        return new Ii(e, "params");
      }
      static fromAppReturn(e) {
        return new Ii(e, "return");
      }
      static fromArray(e) {
        let r = [],
          n = [],
          o = [];
        for (let i of e) {
          i.ensureDeepCopied();
          for (let s of i.hooks) r.push(s);
          for (let s of i.promises)
            (s.parent === i && (s = { parent: o, property: o.length, promise: s.promise }),
              n.push(s));
          o.push(i.value);
        }
        return new Ii(o, "owned", r, n);
      }
      static forEvaluate(e, r) {
        return new Ii(null, "owned", e, r);
      }
      static deepCopyFrom(e, r, n) {
        let o = new Ii(null, "owned", [], []);
        return ((o.value = o.deepCopy(e, r, "value", o, !0, n)), o);
      }
      constructor(e, r, n, o) {
        ((this.value = e), (this.source = r), (this.hooks = n), (this.promises = o));
      }
      rpcTargets;
      getHookForRpcTarget(e, r, n = !0) {
        if (this.source === "params") {
          if (n) {
            let o = e;
            typeof o.dup == "function" && (e = o.dup());
          }
          return i_.create(e, r);
        } else if (this.source === "return") {
          let o = this.rpcTargets?.get(e);
          return o
            ? n
              ? o.dup()
              : (this.rpcTargets?.delete(e), o)
            : ((o = i_.create(e, r)),
              n
                ? (this.rpcTargets || (this.rpcTargets = new Map()),
                  this.rpcTargets.set(e, o),
                  o.dup())
                : o);
        } else throw new Error("owned payload shouldn't contain raw RpcTargets");
      }
      getHookForWritableStream(e, r, n = !0) {
        if (this.source === "params") return Yn.createWritableStreamHook(e);
        if (this.source === "return") {
          let o = this.rpcTargets?.get(e);
          return o
            ? n
              ? o.dup()
              : (this.rpcTargets?.delete(e), o)
            : ((o = Yn.createWritableStreamHook(e)),
              n
                ? (this.rpcTargets || (this.rpcTargets = new Map()),
                  this.rpcTargets.set(e, o),
                  o.dup())
                : o);
        } else throw new Error("owned payload shouldn't contain raw WritableStreams");
      }
      getHookForReadableStream(e, r, n = !0) {
        if (this.source === "params") return Yn.createReadableStreamHook(e);
        if (this.source === "return") {
          let o = this.rpcTargets?.get(e);
          return o
            ? n
              ? o.dup()
              : (this.rpcTargets?.delete(e), o)
            : ((o = Yn.createReadableStreamHook(e)),
              n
                ? (this.rpcTargets || (this.rpcTargets = new Map()),
                  this.rpcTargets.set(e, o),
                  o.dup())
                : o);
        } else throw new Error("owned payload shouldn't contain raw ReadableStreams");
      }
      deepCopy(e, r, n, o, i, s) {
        switch (a_(e)) {
          case "unsupported":
            return e;
          case "primitive":
          case "bigint":
          case "date":
          case "bytes":
          case "blob":
          case "url":
          case "error":
          case "undefined":
            return e;
          case "array": {
            let a = e,
              l = a.length,
              c = new Array(l);
            for (let u = 0; u < l; u++) c[u] = this.deepCopy(a[u], a, u, c, i, s);
            return c;
          }
          case "object": {
            let a = {},
              l = e;
            for (let c in l) a[c] = this.deepCopy(l[c], l, c, a, i, s);
            return a;
          }
          case "stub":
          case "rpc-promise": {
            let a = e,
              l;
            if ((i ? (l = gyt(a)) : (l = hyt(a)), a instanceof rn)) {
              let c = new rn(l, []);
              return (this.promises.push({ parent: o, property: n, promise: c }), c);
            } else return (this.hooks.push(l), new ka(l));
          }
          case "function":
          case "rpc-target": {
            let a = e,
              l;
            return (
              s ? (l = s.getHookForRpcTarget(a, r, i)) : (l = i_.create(a, r)),
              this.hooks.push(l),
              new ka(l)
            );
          }
          case "rpc-thenable": {
            let a = e,
              l;
            return (
              s
                ? (l = new rn(s.getHookForRpcTarget(a, r, i), []))
                : (l = new rn(i_.create(a, r), [])),
              this.promises.push({ parent: o, property: n, promise: l }),
              l
            );
          }
          case "writable": {
            let a = e,
              l;
            return (
              s ? (l = s.getHookForWritableStream(a, r, i)) : (l = Yn.createWritableStreamHook(a)),
              this.hooks.push(l),
              a
            );
          }
          case "readable": {
            let a = e,
              l;
            return (
              s ? (l = s.getHookForReadableStream(a, r, i)) : (l = Yn.createReadableStreamHook(a)),
              this.hooks.push(l),
              a
            );
          }
          case "headers":
            return new Headers(e);
          case "request": {
            let a = e;
            return (a.body && this.deepCopy(a.body, a, "body", a, i, s), new Request(a));
          }
          case "response": {
            let a = e;
            return (a.body && this.deepCopy(a.body, a, "body", a, i, s), new Response(a.body, a));
          }
          default:
            throw new Error("unreachable");
        }
      }
      ensureDeepCopied() {
        if (this.source !== "owned") {
          let e = this.source === "params";
          ((this.hooks = []), (this.promises = []));
          try {
            this.value = this.deepCopy(this.value, void 0, "value", this, e, this);
          } catch (r) {
            throw ((this.hooks = void 0), (this.promises = void 0), r);
          }
          if (((this.source = "owned"), this.rpcTargets && this.rpcTargets.size > 0))
            throw new Error("Not all rpcTargets were accounted for in deep-copy?");
          this.rpcTargets = void 0;
        }
      }
      deliverTo(e, r, n) {
        if ((this.ensureDeepCopied(), this.value instanceof rn))
          Ii.deliverRpcPromiseTo(this.value, e, r, n);
        else {
          e[r] = this.value;
          for (let o of this.promises) Ii.deliverRpcPromiseTo(o.promise, o.parent, o.property, n);
        }
      }
      static deliverRpcPromiseTo(e, r, n, o) {
        let i = Lk(e);
        if (!i) throw new Error("property promises should have been resolved earlier");
        let s = i.pull();
        s instanceof Ii
          ? s.deliverTo(r, n, o)
          : o.push(
              s.then((a) => {
                let l = [];
                if ((a.deliverTo(r, n, l), l.length > 0)) return Promise.all(l);
              }),
            );
      }
      async deliverCall(e, r) {
        try {
          let n = [];
          (this.deliverTo(this, "value", n), n.length > 0 && (await Promise.all(n)));
          let o = Function.prototype.apply.call(e, r, this.value);
          return o instanceof rn ? Ii.fromAppReturn(o) : Ii.fromAppReturn(await o);
        } finally {
          this.dispose();
        }
      }
      async deliverStreamWrite(e) {
        try {
          let r = [];
          (this.deliverTo(this, "value", r), r.length > 0 && (await Promise.all(r)));
          let n = this.value[0];
          return (this.hooks.length > 0 || this.promises.length > 0) && n instanceof Object
            ? (Symbol.dispose in n ||
                Object.defineProperty(n, Symbol.dispose, {
                  value: () => this.dispose(),
                  writable: !0,
                  enumerable: !1,
                  configurable: !0,
                }),
              await e.write(n),
              Ii.fromAppReturn(void 0))
            : (await e.write(n), this.dispose(), Ii.fromAppReturn(void 0));
        } catch (r) {
          throw (this.dispose(), r);
        }
      }
      async deliverResolve() {
        try {
          let e = [];
          (this.deliverTo(this, "value", e), e.length > 0 && (await Promise.all(e)));
          let r = this.value;
          return (
            r instanceof Object &&
              (Symbol.dispose in r ||
                Object.defineProperty(r, Symbol.dispose, {
                  value: () => this.dispose(),
                  writable: !0,
                  enumerable: !1,
                  configurable: !0,
                })),
            r
          );
        } catch (e) {
          throw (this.dispose(), e);
        }
      }
      dispose() {
        if (this.source === "owned")
          (this.hooks.forEach((e) => e.dispose()),
            this.promises.forEach((e) => e.promise[Symbol.dispose]()));
        else if (
          this.source === "return" &&
          (this.disposeImpl(this.value, void 0), this.rpcTargets && this.rpcTargets.size > 0)
        )
          throw new Error("Not all rpcTargets were accounted for in disposeImpl()?");
        ((this.source = "owned"), (this.hooks = []), (this.promises = []));
      }
      disposeImpl(e, r) {
        switch (a_(e)) {
          case "unsupported":
          case "primitive":
          case "bigint":
          case "bytes":
          case "blob":
          case "date":
          case "url":
          case "error":
          case "undefined":
            return;
          case "array": {
            let n = e,
              o = n.length;
            for (let i = 0; i < o; i++) this.disposeImpl(n[i], n);
            return;
          }
          case "object": {
            let n = e;
            for (let o in n) this.disposeImpl(n[o], n);
            return;
          }
          case "stub":
          case "rpc-promise": {
            let n = Lk(e);
            n && n.dispose();
            return;
          }
          case "function":
          case "rpc-target": {
            let n = e,
              o = this.rpcTargets?.get(n);
            o ? (o.dispose(), this.rpcTargets.delete(n)) : Rve(n);
            return;
          }
          case "rpc-thenable":
            return;
          case "headers":
            return;
          case "request": {
            let n = e;
            n.body && this.disposeImpl(n.body, n);
            return;
          }
          case "response": {
            let n = e;
            n.body && this.disposeImpl(n.body, n);
            return;
          }
          case "writable": {
            let n = e,
              o = this.rpcTargets?.get(n);
            (o ? this.rpcTargets.delete(n) : (o = Yn.createWritableStreamHook(n)), o.dispose());
            return;
          }
          case "readable": {
            let n = e,
              o = this.rpcTargets?.get(n);
            (o ? this.rpcTargets.delete(n) : (o = Yn.createReadableStreamHook(n)), o.dispose());
            return;
          }
          default:
            return;
        }
      }
      ignoreUnhandledRejections() {
        this.hooks
          ? (this.hooks.forEach((e) => {
              e.ignoreUnhandledRejections();
            }),
            this.promises.forEach((e) => bve(e.promise).ignoreUnhandledRejections()))
          : this.ignoreUnhandledRejectionsImpl(this.value);
      }
      ignoreUnhandledRejectionsImpl(e) {
        switch (a_(e)) {
          case "unsupported":
          case "primitive":
          case "bigint":
          case "bytes":
          case "blob":
          case "date":
          case "error":
          case "undefined":
          case "function":
          case "rpc-target":
          case "writable":
          case "readable":
          case "url":
          case "headers":
          case "request":
          case "response":
            return;
          case "array": {
            let r = e,
              n = r.length;
            for (let o = 0; o < n; o++) this.ignoreUnhandledRejectionsImpl(r[o]);
            return;
          }
          case "object": {
            let r = e;
            for (let n in r) this.ignoreUnhandledRejectionsImpl(r[n]);
            return;
          }
          case "stub":
          case "rpc-promise":
            bve(e).ignoreUnhandledRejections();
            return;
          case "rpc-thenable":
            e.then(
              (r) => {},
              (r) => {},
            );
            return;
          default:
            return;
        }
      }
    };
    ((xve = class extends Eu {
      call(t, e) {
        try {
          let { value: r, owner: n } = this.getValue(),
            o = fH(r, void 0, t, n);
          if (o.hook) return o.hook.call(o.remainingPath, e);
          if (typeof o.value != "function")
            throw new TypeError(`'${t.join(".")}' is not a function.`);
          return new $k(e.deliverCall(o.value, o.parent).then((i) => new ki(i)));
        } catch (r) {
          return new oi(r);
        }
      }
      map(t, e, r) {
        try {
          let n;
          try {
            let { value: o, owner: i } = this.getValue();
            n = fH(o, void 0, t, i);
          } catch (o) {
            for (let i of e) i.dispose();
            throw o;
          }
          return n.hook
            ? n.hook.map(n.remainingPath, e, r)
            : Fk.applyMap(n.value, n.parent, n.owner, e, r);
        } catch (n) {
          return new oi(n);
        }
      }
      get(t) {
        try {
          let { value: e, owner: r } = this.getValue();
          if (t.length === 0 && r === null)
            throw new Error("Can't dup an RpcTarget stub as a promise.");
          let n = fH(e, void 0, t, r);
          return n.hook
            ? n.hook.get(n.remainingPath)
            : new ki(go.deepCopyFrom(n.value, n.parent, n.owner));
        } catch (e) {
          return new oi(e);
        }
      }
    }),
      (ki = class Ave extends xve {
        constructor(e) {
          (super(), (this.payload = e));
        }
        payload;
        getPayload() {
          if (this.payload) return this.payload;
          throw new Error("Attempted to use an RPC StubHook after it was disposed.");
        }
        getValue() {
          let e = this.getPayload();
          return { value: e.value, owner: e };
        }
        dup() {
          let e = this.getPayload();
          return new Ave(go.deepCopyFrom(e.value, void 0, e));
        }
        pull() {
          return this.getPayload();
        }
        ignoreUnhandledRejections() {
          this.payload && this.payload.ignoreUnhandledRejections();
        }
        dispose() {
          this.payload && (this.payload.dispose(), (this.payload = void 0));
        }
        onBroken(e) {
          this.payload && this.payload.value instanceof ka && this.payload.value.onRpcBroken(e);
        }
      }));
    ((i_ = class yH extends xve {
      static create(e, r) {
        return (typeof e != "function" && (r = void 0), new yH(e, r));
      }
      constructor(e, r, n) {
        (super(),
          (this.target = e),
          (this.parent = r),
          n
            ? n.refcount && ((this.refcount = n.refcount), ++this.refcount.count)
            : Symbol.dispose in e && (this.refcount = { count: 1 }));
      }
      target;
      parent;
      refcount;
      getTarget() {
        if (this.target) return this.target;
        throw new Error("Attempted to use an RPC StubHook after it was disposed.");
      }
      getValue() {
        return { value: this.getTarget(), owner: null };
      }
      dup() {
        return new yH(this.getTarget(), this.parent, this);
      }
      pull() {
        let e = this.getTarget();
        return "then" in e
          ? Promise.resolve(e).then((r) => go.fromAppReturn(r))
          : Promise.reject(new Error("Tried to resolve a non-promise stub."));
      }
      ignoreUnhandledRejections() {}
      dispose() {
        this.target &&
          (this.refcount && --this.refcount.count == 0 && Rve(this.target), (this.target = void 0));
      }
      onBroken(e) {}
    }),
      ($k = class s_ extends Eu {
        promise;
        resolution;
        constructor(e) {
          (super(), (this.promise = e.then((r) => ((this.resolution = r), r))));
        }
        call(e, r) {
          return (r.ensureDeepCopied(), new s_(this.promise.then((n) => n.call(e, r))));
        }
        stream(e, r) {
          return (
            r.ensureDeepCopied(),
            { promise: this.promise.then((n) => n.stream(e, r).promise) }
          );
        }
        map(e, r, n) {
          return new s_(
            this.promise.then(
              (o) => o.map(e, r, n),
              (o) => {
                for (let i of r) i.dispose();
                throw o;
              },
            ),
          );
        }
        get(e) {
          return new s_(this.promise.then((r) => r.get(e)));
        }
        dup() {
          return this.resolution
            ? this.resolution.dup()
            : new s_(this.promise.then((e) => e.dup()));
        }
        pull() {
          return this.resolution ? this.resolution.pull() : this.promise.then((e) => e.pull());
        }
        ignoreUnhandledRejections() {
          this.resolution
            ? this.resolution.ignoreUnhandledRejections()
            : this.promise.then(
                (e) => {
                  e.ignoreUnhandledRejections();
                },
                (e) => {},
              );
        }
        dispose() {
          this.resolution
            ? this.resolution.dispose()
            : this.promise.then(
                (e) => {
                  e.dispose();
                },
                (e) => {},
              );
        }
        onBroken(e) {
          this.resolution
            ? this.resolution.onBroken(e)
            : this.promise.then((r) => {
                r.onBroken(e);
              }, e);
        }
      }),
      (SH = { maxBigIntDigits: 16384, maxDepth: 256, maxMessageSize: 32 * 1024 * 1024 }),
      (Eve = new Uint8Array(new Uint16Array([1]).buffer)[0] === 1),
      (yyt = [
        "ArrayBuffer",
        "DataView",
        "Int8Array",
        "Uint8Array",
        "Uint8ClampedArray",
        "Int16Array",
        "Uint16Array",
        "Int32Array",
        "Uint32Array",
        "BigInt64Array",
        "BigUint64Array",
        "Float32Array",
        "Float64Array",
      ]));
    ((Cve = {
      ArrayBuffer: void 0,
      DataView: void 0,
      Int8Array: void 0,
      Uint8Array: void 0,
      Uint8ClampedArray: void 0,
      Int16Array: 2,
      Uint16Array: 2,
      Int32Array: 4,
      Uint32Array: 4,
      BigInt64Array: 8,
      BigUint64Array: 8,
      Float32Array: 4,
      Float64Array: 8,
    }),
      (Sve = {
        ArrayBuffer: ArrayBuffer.prototype,
        DataView: DataView.prototype,
        Int8Array: Int8Array.prototype,
        Uint8ClampedArray: Uint8ClampedArray.prototype,
        Int16Array: Int16Array.prototype,
        Uint16Array: Uint16Array.prototype,
        Int32Array: Int32Array.prototype,
        Uint32Array: Uint32Array.prototype,
        BigInt64Array: BigInt64Array.prototype,
        BigUint64Array: BigUint64Array.prototype,
        Float32Array: Float32Array.prototype,
        Float64Array: Float64Array.prototype,
      }),
      (Tve = new Map()));
    for (let t of Object.keys(Sve)) Tve.set(Sve[t], t);
    ((byt = class {
      exportStub(t) {
        throw new Error("Cannot serialize RPC stubs without an RPC session.");
      }
      exportPromise(t) {
        throw new Error("Cannot serialize RPC stubs without an RPC session.");
      }
      getImport(t) {}
      unexport(t) {}
      createPipe(t) {
        throw new Error("Cannot create pipes without an RPC session.");
      }
      onSendError(t) {}
    }),
      (Syt = new byt()));
    ((_yt = {
      __proto__: null,
      Error,
      EvalError,
      RangeError,
      ReferenceError,
      SyntaxError,
      TypeError,
      URIError,
      AggregateError,
    }),
      (xu = class Ive {
        exporter;
        source;
        encodingLevel;
        constructor(e, r, n) {
          ((this.exporter = e), (this.source = r), (this.encodingLevel = n));
        }
        static devaluate(e, r, n = Syt, o, i = "string", s) {
          let a = new Ive(n, o, i);
          a.messageOrigin = s;
          try {
            return a.devaluateImpl(e, r, 0);
          } catch (l) {
            if (a.exports)
              try {
                n.unexport(a.exports);
              } catch {}
            throw l;
          }
        }
        exports;
        devaluateImpl(e, r, n) {
          if (n >= 256)
            throw new Error(
              "Serialization exceeded maximum allowed depth. (Does the message contain cycles?)",
            );
          switch (a_(e)) {
            case "unsupported": {
              let o;
              try {
                o = `Cannot serialize value: ${e}`;
              } catch {
                o = "Cannot serialize value: (couldn't stringify value)";
              }
              throw new TypeError(o);
            }
            case "primitive":
              return typeof e == "number" && !isFinite(e)
                ? this.encodingLevel === "structuredClonable"
                  ? e
                  : e === 1 / 0
                    ? ["inf"]
                    : e === -1 / 0
                      ? ["-inf"]
                      : ["nan"]
                : e;
            case "object": {
              let o = e,
                i = {};
              for (let s in o) i[s] = this.devaluateImpl(o[s], o, n + 1);
              return i;
            }
            case "array": {
              let o = e,
                i = o.length,
                s = new Array(i);
              for (let a = 0; a < i; a++) s[a] = this.devaluateImpl(o[a], o, n + 1);
              return [s];
            }
            case "bigint":
              return this.encodingLevel === "structuredClonable" ? e : ["bigint", e.toString()];
            case "date": {
              if (this.encodingLevel === "structuredClonable") return e;
              let o = e.getTime();
              return ["date", Number.isNaN(o) ? null : o];
            }
            case "bytes": {
              let o = Tve.get(Object.getPrototypeOf(e)),
                i;
              if (o === "ArrayBuffer") i = new Uint8Array(e);
              else if (o === void 0) i = e;
              else {
                let a = e;
                i = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
                let l = Cve[o];
                !Eve && l && ((i = i.slice()), Pve(i, l));
              }
              if (
                this.encodingLevel === "structuredClonable" ||
                this.encodingLevel === "jsonCompatibleWithBytes"
              )
                return o === void 0 ? ["bytes", i] : ["bytes", i, o];
              let s;
              if (i.toBase64) s = i.toBase64({ omitPadding: !0 });
              else if (typeof Buffer < "u")
                s = (
                  i instanceof Buffer ? i : Buffer.from(i.buffer, i.byteOffset, i.byteLength)
                ).toString("base64");
              else {
                let a = "";
                for (let l = 0; l < i.length; l++) a += String.fromCharCode(i[l]);
                s = btoa(a);
              }
              return ((s = s.replace(/=+$/, "")), o === void 0 ? ["bytes", s] : ["bytes", s, o]);
            }
            case "url":
              return ["url", e.href];
            case "headers":
              return ["headers", [...e]];
            case "request": {
              let o = e,
                i = {};
              o.method !== "GET" && (i.method = o.method);
              let s = [...o.headers];
              if ((s.length > 0 && (i.headers = s), o.body))
                ((i.body = this.devaluateImpl(o.body, o, n + 1)), (i.duplex = o.duplex || "half"));
              else if (
                o.body === void 0 &&
                !["GET", "HEAD", "OPTIONS", "TRACE", "DELETE"].includes(o.method)
              ) {
                let l = o.arrayBuffer(),
                  c = new ReadableStream({
                    async start(p) {
                      try {
                        (p.enqueue(new Uint8Array(await l)), p.close());
                      } catch (m) {
                        p.error(m);
                      }
                    },
                  }),
                  u = Yn.createReadableStreamHook(c);
                ((i.body = ["readable", this.exporter.createPipe(c, u)]),
                  (i.duplex = o.duplex || "half"));
              }
              (o.cache && o.cache !== "default" && (i.cache = o.cache),
                o.redirect !== "follow" && (i.redirect = o.redirect),
                o.integrity && (i.integrity = o.integrity),
                o.mode && o.mode !== "cors" && (i.mode = o.mode),
                o.credentials && o.credentials !== "same-origin" && (i.credentials = o.credentials),
                o.referrer && o.referrer !== "about:client" && (i.referrer = o.referrer),
                o.referrerPolicy && (i.referrerPolicy = o.referrerPolicy),
                o.keepalive && (i.keepalive = o.keepalive));
              let a = o;
              return (
                a.cf && (i.cf = a.cf),
                a.encodeResponseBody &&
                  a.encodeResponseBody !== "automatic" &&
                  (i.encodeResponseBody = a.encodeResponseBody),
                ["request", o.url, i]
              );
            }
            case "response": {
              let o = e,
                i = this.devaluateImpl(o.body, o, n + 1),
                s = {};
              (o.status !== 200 && (s.status = o.status),
                o.statusText && (s.statusText = o.statusText));
              let a = [...o.headers];
              a.length > 0 && (s.headers = a);
              let l = o;
              if (
                (l.cf && (s.cf = l.cf),
                l.encodeBody && l.encodeBody !== "automatic" && (s.encodeBody = l.encodeBody),
                l.webSocket)
              )
                throw new TypeError("Can't serialize a Response containing a webSocket.");
              return ["response", i, s];
            }
            case "blob": {
              let o = e,
                i = o.stream(),
                s = Yn.createReadableStreamHook(i),
                a = this.exporter.createPipe(i, s);
              return ["blob", o.type, ["readable", a]];
            }
            case "error": {
              let o = e,
                i = this.exporter.onSendError(o);
              i && (o = i);
              let s = o,
                a,
                l = (u, p) => {
                  let m = this.exports?.length ?? 0;
                  try {
                    let f = this.devaluateImpl(p, o, n + 1);
                    (a || (a = {}), (a[u] = f));
                  } catch {
                    if (this.exports && this.exports.length > m) {
                      let h = this.exports.splice(m);
                      try {
                        this.exporter.unexport(h);
                      } catch {}
                    }
                  }
                };
              for (let u of Object.keys(o))
                u === "name" || u === "message" || u === "stack" || l(u, s[u]);
              ("cause" in o && l("cause", s.cause),
                o instanceof AggregateError && l("errors", o.errors));
              let c = ["error", o.name, o.message];
              return (
                a
                  ? (c.push(i && i.stack ? i.stack : null), c.push(a))
                  : i && i.stack && c.push(i.stack),
                c
              );
            }
            case "undefined":
              return this.encodingLevel === "structuredClonable" ? void 0 : ["undefined"];
            case "stub":
            case "rpc-promise": {
              if (!this.source) throw new Error("Can't serialize RPC stubs in this context.");
              let { hook: o, pathIfPromise: i } = Bk(e),
                s = this.exporter.getImport(o);
              return s !== void 0
                ? i
                  ? i.length > 0
                    ? ["pipeline", s, i]
                    : ["pipeline", s]
                  : ["import", s]
                : (i ? (o = o.get(i)) : (o = o.dup()),
                  this.devaluateHook(i ? "promise" : "export", o));
            }
            case "function":
            case "rpc-target": {
              if (!this.source) throw new Error("Can't serialize RPC stubs in this context.");
              let o = this.source.getHookForRpcTarget(e, r);
              return this.devaluateHook("export", o);
            }
            case "rpc-thenable": {
              if (!this.source) throw new Error("Can't serialize RPC stubs in this context.");
              let o = this.source.getHookForRpcTarget(e, r);
              return this.devaluateHook("promise", o);
            }
            case "writable": {
              if (!this.source) throw new Error("Can't serialize WritableStream in this context.");
              let o = this.source.getHookForWritableStream(e, r);
              return this.devaluateHook("writable", o);
            }
            case "readable": {
              if (!this.source) throw new Error("Can't serialize ReadableStream in this context.");
              let o = e,
                i = this.source.getHookForReadableStream(o, r);
              return ["readable", this.exporter.createPipe(o, i)];
            }
            default:
              throw new Error("unreachable");
          }
        }
        devaluateHook(e, r) {
          this.exports || (this.exports = []);
          let n =
            e === "promise"
              ? this.exporter.exportPromise(r)
              : this.exporter.exportStub(r, this.messageOrigin);
          return (this.exports.push(n), [e, n]);
        }
      }),
      (xyt = class {
        importStub(t) {
          throw new Error("Cannot deserialize RPC stubs without an RPC session.");
        }
        importPromise(t) {
          throw new Error("Cannot deserialize RPC stubs without an RPC session.");
        }
        getExport(t) {}
        getPipeReadable(t) {
          throw new Error("Cannot retrieve pipe readable without an RPC session.");
        }
        getLimits() {
          return SH;
        }
      }),
      (WSr = new xyt()));
    ((Au = class kve {
      importer;
      encodingLevel;
      limits;
      constructor(e, r = "string", n) {
        ((this.messageOrigin = n),
          (this.importer = e),
          (this.encodingLevel = r),
          (this.limits = e.getLimits()));
      }
      hooks = [];
      promises = [];
      evaluate(e) {
        return this.evaluateWithDepth(e, 0);
      }
      evaluateWithDepth(e, r) {
        let n = go.forEvaluate(this.hooks, this.promises);
        try {
          return ((n.value = this.evaluateImpl(e, n, "value", r)), n);
        } catch (o) {
          throw (n.dispose(), o);
        }
      }
      evaluateCopy(e) {
        return this.evaluate(structuredClone(e));
      }
      evaluateImpl(e, r, n, o) {
        let i = this.limits.maxDepth;
        if (o >= i)
          throw new TypeError(`Deserialization exceeded maximum allowed message depth of ${i}.`);
        if (
          this.encodingLevel === "structuredClonable" &&
          (e instanceof Date || typeof e == "bigint")
        )
          return e;
        if (e instanceof Array) {
          if (e.length == 1 && e[0] instanceof Array) {
            let s = e[0];
            for (let a = 0; a < s.length; a++) s[a] = this.evaluateImpl(s[a], s, a, o + 1);
            return s;
          } else
            switch (e[0]) {
              case "bigint":
                if (typeof e[1] == "string") {
                  let s = e[1],
                    a = this.limits.maxBigIntDigits;
                  if (s.length > a)
                    throw new TypeError(
                      `Deserialized bigint exceeds maximum length of ${a} digits.`,
                    );
                  return BigInt(s);
                }
                break;
              case "date":
                if (e[1] === null) return new Date(NaN);
                if (typeof e[1] == "number") return new Date(e[1]);
                break;
              case "bytes": {
                let s;
                if (e[1] instanceof Uint8Array) s = e[1];
                else if (typeof e[1] == "string")
                  if (typeof Buffer < "u") s = Buffer.from(e[1], "base64");
                  else if (Uint8Array.fromBase64) s = Uint8Array.fromBase64(e[1]);
                  else {
                    let u = atob(e[1]),
                      p = u.length;
                    s = new Uint8Array(p);
                    for (let m = 0; m < p; m++) s[m] = u.charCodeAt(m);
                  }
                else break;
                if (e.length === 2) return s;
                if (typeof e[2] != "string")
                  throw new TypeError(`Unknown bytes type marker type: ${typeof e[2]}`);
                if (!vyt(e[2])) {
                  let u = e[2].slice(0, 64);
                  throw new TypeError(`Unknown bytes type marker: ${u}`);
                }
                let a = e[2],
                  l = Cve[a];
                if (l !== void 0 && s.byteLength % l !== 0)
                  throw new TypeError(
                    `Invalid byte length ${s.byteLength} for ${a}; expected a multiple of ${l}`,
                  );
                let c = s.buffer.slice(s.byteOffset, s.byteOffset + s.byteLength);
                switch ((!Eve && l !== void 0 && Pve(new Uint8Array(c), l), a)) {
                  case "ArrayBuffer":
                    return c;
                  case "DataView":
                    return new DataView(c);
                  case "Int8Array":
                    return new Int8Array(c);
                  case "Uint8Array":
                    return new Uint8Array(c);
                  case "Uint8ClampedArray":
                    return new Uint8ClampedArray(c);
                  case "Int16Array":
                    return new Int16Array(c);
                  case "Uint16Array":
                    return new Uint16Array(c);
                  case "Int32Array":
                    return new Int32Array(c);
                  case "Uint32Array":
                    return new Uint32Array(c);
                  case "BigInt64Array":
                    return new BigInt64Array(c);
                  case "BigUint64Array":
                    return new BigUint64Array(c);
                  case "Float32Array":
                    return new Float32Array(c);
                  case "Float64Array":
                    return new Float64Array(c);
                  default:
                }
              }
              case "error":
                if (e.length >= 3 && typeof e[1] == "string" && typeof e[2] == "string") {
                  let s = _yt[e[1]] || Error,
                    a = s === AggregateError ? new s([], e[2]) : new s(e[2]);
                  if ((typeof e[3] == "string" && (a.stack = e[3]), e.length >= 5)) {
                    let l = e[4];
                    if (!l || typeof l != "object" || Array.isArray(l)) break;
                    let c = a,
                      u = l;
                    for (let p of Object.keys(u))
                      if (!(p === "name" || p === "message" || p === "stack")) {
                        if (p in Object.prototype || p === "toJSON") {
                          this.evaluateImpl(u[p], a, p, o + 1);
                          continue;
                        }
                        c[p] = this.evaluateImpl(u[p], a, p, o + 1);
                      }
                  }
                  return a;
                }
                break;
              case "undefined":
                if (e.length === 1) return;
                break;
              case "inf":
                return 1 / 0;
              case "-inf":
                return -1 / 0;
              case "nan":
                return NaN;
              case "url":
                if (e.length === 2 && typeof e[1] == "string") return new URL(e[1]);
                break;
              case "headers":
                if (e.length === 2 && e[1] instanceof Array) return new Headers(e[1]);
                break;
              case "request": {
                if (e.length !== 3 || typeof e[1] != "string") break;
                let s = e[1],
                  a = e[2];
                if (typeof a != "object" || a === null) break;
                if (
                  a.body &&
                  ((a.body = this.evaluateImpl(a.body, a, "body", o + 1)),
                  !(
                    a.body === null ||
                    typeof a.body == "string" ||
                    a.body instanceof Uint8Array ||
                    a.body instanceof ReadableStream
                  ))
                )
                  throw new TypeError("Request body must be of type ReadableStream.");
                if (
                  a.signal &&
                  ((a.signal = this.evaluateImpl(a.signal, a, "signal", o + 1)),
                  !(a.signal instanceof AbortSignal))
                )
                  throw new TypeError("Request siganl must be of type AbortSignal.");
                if (a.headers && !(a.headers instanceof Array))
                  throw new TypeError("Request headers must be serialized as an array of pairs.");
                let l = new Request(s, a);
                if (a.body instanceof ReadableStream && l.body === void 0) {
                  let c = Ayt(l, a.body);
                  return (this.promises.push({ promise: c, parent: r, property: n }), c);
                } else return l;
              }
              case "response": {
                if (e.length !== 3) break;
                let s = this.evaluateImpl(e[1], r, n, o + 1);
                if (
                  !(
                    s === null ||
                    typeof s == "string" ||
                    s instanceof Uint8Array ||
                    s instanceof ReadableStream
                  )
                )
                  throw new TypeError("Response body must be of type ReadableStream.");
                let a = e[2];
                if (typeof a != "object" || a === null) break;
                if (a.webSocket)
                  throw new TypeError("Can't deserialize a Response containing a webSocket.");
                if (a.headers && !(a.headers instanceof Array))
                  throw new TypeError("Request headers must be serialized as an array of pairs.");
                return new Response(s, a);
              }
              case "blob": {
                if (e.length !== 3 || typeof e[1] != "string") break;
                let s = e[1],
                  a = this.evaluateImpl(e[2], r, n, o + 1);
                if (!(a instanceof ReadableStream))
                  throw new TypeError("Blob content must be serialized as a ReadableStream.");
                let l = Ryt(a, s);
                return (this.promises.push({ promise: l, parent: r, property: n }), l);
              }
              case "import":
              case "pipeline": {
                if (e.length < 2 || e.length > 4 || typeof e[1] != "number") break;
                let s = this.importer.getExport(e[1]);
                if (!s) throw new Error(`no such entry on exports table: ${e[1]}`);
                let a = e[0] == "pipeline",
                  l = (p) => {
                    if (a) {
                      let m = new rn(p, []);
                      return (this.promises.push({ promise: m, parent: r, property: n }), m);
                    } else return (this.hooks.push(p), new rn(p, []));
                  };
                if (e.length == 2) return l(a ? s.get([]) : s.dup());
                let c = e[2];
                if (
                  !(c instanceof Array) ||
                  !c.every((p) => typeof p == "string" || typeof p == "number")
                )
                  break;
                if (e.length == 3) return l(s.get(c));
                let u = e[3];
                if (!(u instanceof Array)) break;
                return ((u = new kve(this.importer).evaluateWithDepth([u], o)), l(s.call(c, u)));
              }
              case "remap": {
                if (
                  e.length !== 5 ||
                  typeof e[1] != "number" ||
                  !(e[2] instanceof Array) ||
                  !(e[3] instanceof Array) ||
                  !(e[4] instanceof Array)
                )
                  break;
                let s = this.importer.getExport(e[1]);
                if (!s) throw new Error(`no such entry on exports table: ${e[1]}`);
                let a = e[2];
                if (!a.every((p) => typeof p == "string" || typeof p == "number")) break;
                let l = e[3].map((p) => {
                    if (
                      !(p instanceof Array) ||
                      p.length !== 2 ||
                      (p[0] !== "import" && p[0] !== "export") ||
                      typeof p[1] != "number"
                    )
                      throw new TypeError(`unknown map capture: ${JSON.stringify(p)}`);
                    if (p[0] === "export") return this.importer.importStub(p[1]);
                    {
                      let m = this.importer.getExport(p[1]);
                      if (!m) throw new Error(`no such entry on exports table: ${p[1]}`);
                      return m.dup();
                    }
                  }),
                  c = e[4],
                  u = new rn(s.map(a, l, c), []);
                return (this.promises.push({ promise: u, parent: r, property: n }), u);
              }
              case "export":
              case "promise":
                if (typeof e[1] == "number")
                  if (e[0] == "promise") {
                    let s = new rn(this.importer.importPromise(e[1]), []);
                    return (this.promises.push({ parent: r, property: n, promise: s }), s);
                  } else {
                    let s = this.importer.importStub(e[1]);
                    return (this.hooks.push(s), new ka(s));
                  }
                break;
              case "writable":
                if (typeof e[1] == "number") {
                  let s = this.importer.importStub(e[1]),
                    a = Yn.createWritableStreamFromHook(s);
                  return (this.hooks.push(s), a);
                }
                break;
              case "readable":
                if (typeof e[1] == "number") {
                  let s = this.importer.getPipeReadable(e[1], this.messageOrigin),
                    a = Yn.createReadableStreamHook(s);
                  return (this.hooks.push(a), s);
                }
                break;
            }
          throw new TypeError(`unknown special value: ${JSON.stringify(e)}`);
        } else if (e instanceof Object) {
          let s = e;
          for (let a in s)
            a in Object.prototype || a === "toJSON"
              ? (this.evaluateImpl(s[a], s, a, o + 1), delete s[a])
              : (s[a] = this.evaluateImpl(s[a], s, a, o + 1));
          return s;
        } else return e;
      }
    }),
      (hH = 16),
      (r_ = 8),
      (gH = 16),
      (Eyt = 64));
    ((zp = class {
      session;
      importId;
      constructor(t, e, r) {
        ((this.session = t), (this.importId = e), r && (this.activePull = Promise.withResolvers()));
      }
      localRefcount = 0;
      remoteRefcount = 1;
      activePull;
      resolution;
      onBrokenRegistrations;
      resolve(t) {
        if (this.localRefcount == 0) {
          t.dispose();
          return;
        }
        if (((this.resolution = t), this.sendRelease(), this.onBrokenRegistrations)) {
          for (let e of this.onBrokenRegistrations) {
            let { callback: r, index: n } = e,
              o = this.session.onBrokenCallbacks.length;
            t.onBroken(r);
            let i = this.session.onBrokenCallbacks[o];
            i?.callback === r
              ? ((i.index = n),
                (this.session.onBrokenCallbacks[n] = i),
                delete this.session.onBrokenCallbacks[o])
              : delete this.session.onBrokenCallbacks[n];
          }
          this.onBrokenRegistrations = void 0;
        }
        this.activePull && (this.activePull.resolve(), (this.activePull = void 0));
      }
      async awaitResolution() {
        return (
          this.activePull ||
            (this.session.sendPull(this.importId), (this.activePull = Promise.withResolvers())),
          await this.activePull.promise,
          this.resolution.pull()
        );
      }
      dispose() {
        this.resolution
          ? this.resolution.dispose()
          : (this.abort(new Error("RPC was canceled because the RpcPromise was disposed.")),
            this.sendRelease());
      }
      abort(t) {
        if (
          !this.resolution &&
          ((this.resolution = new oi(t)),
          this.activePull && (this.activePull.reject(t), (this.activePull = void 0)),
          this.onBrokenRegistrations)
        ) {
          for (let e of this.onBrokenRegistrations) delete this.session.onBrokenCallbacks[e.index];
          this.onBrokenRegistrations = void 0;
        }
      }
      onBroken(t) {
        if (this.resolution) this.resolution.onBroken(t);
        else {
          let e = this.session.onBrokenCallbacks.length,
            r = { callback: t, index: e };
          (this.session.onBrokenCallbacks.push(r),
            this.onBrokenRegistrations || (this.onBrokenRegistrations = []),
            this.onBrokenRegistrations.push(r));
        }
      }
      sendRelease() {
        this.remoteRefcount > 0 &&
          (this.session.sendRelease(this.importId, this.remoteRefcount), (this.remoteRefcount = 0));
      }
    }),
      (Ru = class Dve extends Eu {
        isPromise;
        entry;
        constructor(e, r) {
          (super(), (this.isPromise = e), ++r.localRefcount, (this.entry = r));
        }
        collectPath(e) {
          return this;
        }
        getEntry() {
          if (this.entry) return this.entry;
          throw new Error("This RpcImportHook was already disposed.");
        }
        call(e, r) {
          let n = this.getEntry();
          return n.resolution ? n.resolution.call(e, r) : n.session.sendCall(n.importId, e, r);
        }
        stream(e, r) {
          let n = this.getEntry();
          return n.resolution ? n.resolution.stream(e, r) : n.session.sendStream(n.importId, e, r);
        }
        map(e, r, n) {
          let o;
          try {
            o = this.getEntry();
          } catch (i) {
            for (let s of r) s.dispose();
            throw i;
          }
          return o.resolution ? o.resolution.map(e, r, n) : o.session.sendMap(o.importId, e, r, n);
        }
        get(e) {
          let r = this.getEntry();
          return r.resolution ? r.resolution.get(e) : r.session.sendCall(r.importId, e);
        }
        dup() {
          return new Dve(!1, this.getEntry());
        }
        pull() {
          let e = this.getEntry();
          if (!this.isPromise)
            throw new Error("Can't pull this hook because it's not a promise hook.");
          return e.resolution ? e.resolution.pull() : e.awaitResolution();
        }
        ignoreUnhandledRejections() {}
        dispose() {
          let e = this.entry;
          ((this.entry = void 0), e && --e.localRefcount === 0 && e.dispose());
        }
        onBroken(e) {
          this.entry && this.entry.onBroken(e);
        }
      }),
      (Cyt = class extends Ru {
        session;
        constructor(t) {
          (super(!1, t), (this.session = t.session));
        }
        dispose() {
          if (this.session) {
            let t = this.session;
            ((this.session = void 0), t.shutdown());
          }
        }
      }),
      (Tyt = class {
        transport;
        options;
        exports = [];
        reverseExports = new Map();
        imports = [];
        abortReason;
        cancelReadLoop;
        nextExportId = -1;
        onBatchDone;
        pullCount = 0;
        onBrokenCallbacks = [];
        encodingLevel;
        limits;
        constructor(t, e, r) {
          ((this.transport = t), (this.options = r));
          let n = "string";
          if ("encodingLevel" in t) {
            let o = t.encodingLevel;
            if (o !== void 0) {
              if (
                o !== "string" &&
                o !== "jsonCompatible" &&
                o !== "jsonCompatibleWithBytes" &&
                o !== "structuredClonable"
              )
                throw new TypeError(`Unknown transport encodingLevel: ${String(o)}`);
              n = o;
            }
          }
          ((this.encodingLevel = n),
            (this.limits = { ...SH, ...r.limits }),
            this.exports.push({ hook: e, refcount: 1 }),
            this.imports.push(new zp(this, 0, !1)),
            this.readLoop().catch((o) => this.abort(o)));
        }
        getMainImport() {
          return new Cyt(this.imports[0]);
        }
        shutdown() {
          this.abort(new Error("RPC session was shut down by disposing the main stub"), !1);
        }
        exportStub(t, e) {
          if (this.abortReason) throw this.abortReason;
          let r = this.reverseExports.get(t);
          if (r !== void 0) {
            let n = this.exports[r],
              o = n.messageOrigin;
            return (
              o && o.service !== e?.service
                ? (n.messageOrigin = void 0)
                : o?.method !== void 0 &&
                  o.method !== e?.method &&
                  (n.messageOrigin = { service: o.service }),
              ++n.refcount,
              r
            );
          } else {
            let n = this.nextExportId--;
            return (
              (this.exports[n] = { hook: t, refcount: 1 }),
              e && (this.exports[n].messageOrigin = e),
              this.reverseExports.set(t, n),
              n
            );
          }
        }
        exportPromise(t) {
          if (this.abortReason) throw this.abortReason;
          let e = this.nextExportId--;
          return (
            (this.exports[e] = { hook: t, refcount: 1 }),
            this.reverseExports.set(t, e),
            this.ensureResolvingExport(e),
            e
          );
        }
        unexport(t) {
          for (let e of t) this.releaseExport(e, 1);
        }
        releaseExport(t, e) {
          let r = this.exports[t];
          if (!r) throw new Error(`no such export ID: ${t}`);
          if (r.refcount < e) throw new Error(`refcount would go negative: ${r.refcount} < ${e}`);
          ((r.refcount -= e),
            r.refcount === 0 &&
              (delete this.exports[t], this.reverseExports.delete(r.hook), r.hook.dispose()));
        }
        onSendError(t) {
          if (this.options.onSendError) return this.options.onSendError(t);
        }
        ensureResolvingExport(t) {
          let e = this.exports[t];
          if (!e) throw new Error(`no such export ID: ${t}`);
          if (!e.pull) {
            let r = async () => {
                let o = e.hook;
                for (;;) {
                  let i = await o.pull();
                  if (i.value instanceof ka) {
                    let { hook: s, pathIfPromise: a } = Bk(i.value);
                    if (a && a.length == 0 && this.getImport(o) === void 0) {
                      o = s;
                      continue;
                    }
                  }
                  return i;
                }
              },
              n = e.autoRelease;
            (++this.pullCount,
              (e.pull = r()
                .then(
                  (o) => {
                    let i = xu.devaluate(o.value, void 0, this, o, this.encodingLevel);
                    (this.send(["resolve", t, i]), n && this.releaseExport(t, 1));
                  },
                  (o) => {
                    (this.send([
                      "reject",
                      t,
                      xu.devaluate(o, void 0, this, void 0, this.encodingLevel),
                    ]),
                      n && this.releaseExport(t, 1));
                  },
                )
                .catch((o) => {
                  try {
                    (this.send([
                      "reject",
                      t,
                      xu.devaluate(o, void 0, this, void 0, this.encodingLevel),
                    ]),
                      n && this.releaseExport(t, 1));
                  } catch (i) {
                    this.abort(i);
                  }
                })
                .finally(() => {
                  --this.pullCount === 0 && this.onBatchDone && this.onBatchDone.resolve();
                })));
          }
        }
        getImport(t) {
          if (t instanceof Ru && t.entry && t.entry.session === this) return t.entry.importId;
        }
        importStub(t) {
          if (this.abortReason) throw this.abortReason;
          let e = this.imports[t];
          return (e || ((e = new zp(this, t, !1)), (this.imports[t] = e)), new Ru(!1, e));
        }
        importPromise(t) {
          if (this.abortReason) throw this.abortReason;
          if (this.imports[t])
            return new oi(
              new Error(
                "Bug in RPC system: The peer sent a promise reusing an existing export ID.",
              ),
            );
          let e = new zp(this, t, !0);
          return ((this.imports[t] = e), new Ru(!0, e));
        }
        getExport(t) {
          return this.exports[t]?.hook;
        }
        getPipeReadable(t, e) {
          let r = this.exports[t];
          if (!r || !r.pipeReadable)
            throw new Error(`Export ${t} is not a pipe or its readable end was already consumed.`);
          e && (r.messageOrigin = e);
          let n = r.pipeReadable;
          return ((r.pipeReadable = void 0), n);
        }
        getLimits() {
          return this.limits;
        }
        createPipe(t, e) {
          if (this.abortReason) throw this.abortReason;
          this.send(["pipe"]);
          let r = this.imports.length,
            n = new zp(this, r, !1);
          this.imports.push(n);
          let o = new Ru(!1, n),
            i = Yn.createWritableStreamFromHook(o);
          return (
            t
              .pipeTo(i)
              .catch(() => {})
              .finally(() => e.dispose()),
            r
          );
        }
        send(t) {
          if (this.abortReason !== void 0) return 0;
          if (this.encodingLevel === "string") {
            let e;
            try {
              e = JSON.stringify(t);
            } catch (r) {
              try {
                this.abort(r);
              } catch {}
              throw r;
            }
            try {
              let r = this.transport.send(e);
              r !== void 0 && typeof r.catch == "function" && r.catch((n) => this.abort(n, !1));
            } catch (r) {
              queueMicrotask(() => this.abort(r, !1));
            }
            return e.length;
          } else
            try {
              let e = this.transport.send(t);
              if (typeof e == "number") return e;
              let r = e;
              r &&
                typeof r.then == "function" &&
                Promise.resolve(r).catch((n) => this.abort(n, !1));
              return;
            } catch (e) {
              queueMicrotask(() => this.abort(e, !1));
              return;
            }
        }
        sendCall(t, e, r) {
          if (this.abortReason) throw this.abortReason;
          let n = this.imports[t]?.messagePortService,
            o =
              n &&
              this.options.onMessagePortRead &&
              e.length === 1 &&
              this.options.messagePortReadMethods?.has(e[0])
                ? { service: n.service, method: e[0] }
                : n,
            i = ["pipeline", t, e];
          if (r) {
            let a = xu.devaluate(r.value, void 0, this, r, this.encodingLevel, o);
            i.push(a[0]);
          }
          this.send(["push", i]);
          let s = new zp(this, this.imports.length, !1);
          return (o && (s.messageOrigin = o), this.imports.push(s), new Ru(!0, s));
        }
        sendStream(t, e, r) {
          if (this.abortReason) throw this.abortReason;
          let n = ["pipeline", t, e],
            o = xu.devaluate(r.value, void 0, this, r, this.encodingLevel);
          n.push(o[0]);
          let i = ["stream", n],
            s = this.send(i);
          s === void 0 && (s = Ok(i));
          let a = this.imports.length,
            l = new zp(this, a, !0);
          return (
            (l.remoteRefcount = 0),
            (l.localRefcount = 1),
            this.imports.push(l),
            {
              promise: l.awaitResolution().then(
                (c) => {
                  (c.dispose(), delete this.imports[a]);
                },
                (c) => {
                  throw (delete this.imports[a], c);
                },
              ),
              size: s,
            }
          );
        }
        sendMap(t, e, r, n) {
          if (this.abortReason) {
            for (let s of r) s.dispose();
            throw this.abortReason;
          }
          let o = [
            "remap",
            t,
            e,
            r.map((s) => {
              let a = this.getImport(s);
              return a !== void 0 ? ["import", a] : ["export", this.exportStub(s)];
            }),
            n,
          ];
          this.send(["push", o]);
          let i = new zp(this, this.imports.length, !1);
          return (this.imports.push(i), new Ru(!0, i));
        }
        sendPull(t) {
          if (this.abortReason) throw this.abortReason;
          this.send(["pull", t]);
        }
        sendRelease(t, e) {
          this.abortReason || (this.send(["release", t, e]), delete this.imports[t]);
        }
        abort(t, e = !0) {
          if (this.abortReason === void 0) {
            if ((this.cancelReadLoop?.(t), (this.cancelReadLoop = void 0), e))
              try {
                let r = ["abort", xu.devaluate(t, void 0, this, void 0, this.encodingLevel)];
                if (this.encodingLevel === "string") {
                  let n = this.transport.send(JSON.stringify(r));
                  n !== void 0 && typeof n.catch == "function" && n.catch((o) => {});
                } else {
                  let n = this.transport.send(r);
                  n && typeof n.then == "function" && Promise.resolve(n).catch((o) => {});
                }
              } catch {}
            if (
              (t === void 0 && (t = "undefined"),
              (this.abortReason = t),
              this.onBatchDone && this.onBatchDone.reject(t),
              this.transport.abort)
            )
              try {
                this.transport.abort(t);
              } catch (r) {
                Promise.resolve(r);
              }
            for (let r of Object.values(this.onBrokenCallbacks))
              try {
                r.callback(t);
              } catch (n) {
                Promise.resolve(n);
              }
            for (let r in this.imports) this.imports[r].abort(t);
            for (let r in this.exports) this.exports[r].hook.dispose();
          }
        }
        async readLoop() {
          for (; !this.abortReason; ) {
            let t = Promise.withResolvers();
            this.cancelReadLoop = t.reject;
            let e;
            try {
              e = await Promise.race([this.transport.receive(), t.promise]);
            } finally {
              this.cancelReadLoop === t.reject && (this.cancelReadLoop = void 0);
            }
            if (this.encodingLevel === "string" && e.length > this.limits.maxMessageSize)
              throw new TypeError(
                `Incoming message exceeds maximum size of ${this.limits.maxMessageSize} UTF-16 code units.`,
              );
            if (this.abortReason) break;
            let r = this.encodingLevel === "string" ? JSON.parse(e) : e;
            if (r instanceof Array)
              switch (r[0]) {
                case "push":
                  if (r.length > 1) {
                    let n = new ki(new Au(this, this.encodingLevel).evaluate(r[1]));
                    (n.ignoreUnhandledRejections(), this.exports.push({ hook: n, refcount: 1 }));
                    continue;
                  }
                  break;
                case "stream":
                  if (r.length > 1) {
                    let n = new ki(new Au(this, this.encodingLevel).evaluate(r[1]));
                    n.ignoreUnhandledRejections();
                    let o = this.exports.length;
                    (this.exports.push({ hook: n, refcount: 1, autoRelease: !0 }),
                      this.ensureResolvingExport(o));
                    continue;
                  }
                  break;
                case "pipe": {
                  let { readable: n, writable: o } = new TransformStream(),
                    i = Yn.createWritableStreamHook(o);
                  this.exports.push({ hook: i, refcount: 1, pipeReadable: n });
                  continue;
                }
                case "pull": {
                  let n = r[1];
                  if (typeof n == "number") {
                    this.ensureResolvingExport(n);
                    continue;
                  }
                  break;
                }
                case "resolve":
                case "reject": {
                  let n = r[1];
                  if (typeof n == "number" && r.length > 2) {
                    let o = this.imports[n];
                    if (o)
                      if (r[0] == "resolve") {
                        let i = new Au(this, this.encodingLevel, o.messageOrigin).evaluate(r[2]);
                        (this.hasMessagePortServices &&
                          Array.isArray(r[2]) &&
                          r[2][0] === "export" &&
                          ka.setMessagePortServiceName(i.value, o.messageOrigin?.service ?? null),
                          o.resolve(new ki(i)));
                      } else {
                        let i = new Au(this, this.encodingLevel).evaluate(r[2]);
                        (i.dispose(), o.resolve(new oi(i.value)));
                      }
                    else
                      r[0] == "resolve" &&
                        new Au(this, this.encodingLevel).evaluate(r[2]).dispose();
                    continue;
                  }
                  break;
                }
                case "release": {
                  let n = r[1],
                    o = r[2];
                  if (typeof n == "number" && typeof o == "number") {
                    this.releaseExport(n, o);
                    continue;
                  }
                  break;
                }
                case "abort": {
                  let n = new Au(this, this.encodingLevel).evaluate(r[1]);
                  (n.dispose(), this.abort(n.value, !1));
                  break;
                }
              }
            throw new Error(`bad RPC message: ${JSON.stringify(r)}`);
          }
        }
        async drain() {
          if (this.abortReason) throw this.abortReason;
          if (this.pullCount > 0) {
            let { promise: t, resolve: e, reject: r } = Promise.withResolvers();
            ((this.onBatchDone = { resolve: e, reject: r }), await t);
          }
        }
        getStats() {
          let t = { imports: 0, exports: 0 };
          for (let e in this.imports) ++t.imports;
          for (let e in this.exports) ++t.exports;
          return t;
        }
      }),
      (Pyt = class {
        #e;
        #t;
        constructor(t, e, r = {}) {
          let n;
          (e
            ? (n = new ki(go.fromAppReturn(e)))
            : (n = new oi(new Error("This connection has no main object."))),
            (this.#e = new Tyt(t, n, r)),
            (this.#t = new ka(this.#e.getMainImport())));
        }
        messagePortReadOrigin(t) {
          if (Array.isArray(t)) {
            if ((t[0] === "resolve" || t[0] === "reject") && typeof t[1] == "number")
              return this.#e.imports[t[1]]?.messageOrigin;
            if ((t[0] === "pull" || t[0] === "release") && typeof t[1] == "number")
              return this.#e.exports[t[1]]?.messageOrigin;
            if (
              (t[0] === "push" || t[0] === "stream") &&
              Array.isArray(t[1]) &&
              t[1][0] === "pipeline" &&
              typeof t[1][1] == "number"
            )
              return this.#e.exports[t[1][1]]?.messageOrigin;
          }
        }
        getRemoteMain() {
          return this.#t;
        }
        getStats() {
          return this.#e.getStats();
        }
        drain() {
          return this.#e.drain();
        }
      }),
      (Iyt = class {
        context;
        captureMap = new Map();
        instructions = [];
        constructor(t, e) {
          (Kp
            ? (this.context = { parent: Kp, captures: [], subject: Kp.capture(t), path: e })
            : (this.context = { parent: void 0, captures: [], subject: t, path: e }),
            (Kp = this));
        }
        unregister() {
          Kp = this.context.parent;
        }
        makeInput() {
          return new o_(this, 0);
        }
        makeOutput(t) {
          let e;
          try {
            e = xu.devaluate(t.value, void 0, this, t);
          } finally {
            t.dispose();
          }
          return (
            this.instructions.push(e),
            this.context.parent
              ? (this.context.parent.instructions.push([
                  "remap",
                  this.context.subject,
                  this.context.path,
                  this.context.captures.map((r) => ["import", r]),
                  this.instructions,
                ]),
                new o_(this.context.parent, this.context.parent.instructions.length))
              : this.context.subject.map(
                  this.context.path,
                  this.context.captures,
                  this.instructions,
                )
          );
        }
        pushCall(t, e, r) {
          let n = xu.devaluate(r.value, void 0, this, r);
          n = n[0];
          let o = this.capture(t.dup());
          return (
            this.instructions.push(["pipeline", o, e, n]),
            new o_(this, this.instructions.length)
          );
        }
        pushGet(t, e) {
          let r = this.capture(t.dup());
          return (
            this.instructions.push(["pipeline", r, e]),
            new o_(this, this.instructions.length)
          );
        }
        capture(t) {
          if (t instanceof o_ && t.mapper === this) return t.idx;
          let e = this.captureMap.get(t);
          if (e === void 0) {
            if (this.context.parent) {
              let r = this.context.parent.capture(t);
              this.context.captures.push(r);
            } else this.context.captures.push(t);
            ((e = -this.context.captures.length), this.captureMap.set(t, e));
          }
          return e;
        }
        exportStub(t) {
          throw new Error(
            "Can't construct an RpcTarget or RPC callback inside a mapper function. Try creating a new RpcStub outside the callback first, then using it inside the callback.",
          );
        }
        exportPromise(t) {
          return this.exportStub(t);
        }
        getImport(t) {
          return this.capture(t);
        }
        unexport(t) {}
        createPipe(t) {
          throw new Error("Cannot send ReadableStream inside a mapper function.");
        }
        onSendError(t) {}
      }));
    Fk.sendMap = (t, e, r) => {
      let n = new Iyt(t, e),
        o;
      try {
        o = go.fromAppReturn(myt(n.pushCall.bind(n), () => r(new rn(n.makeInput(), []))));
      } finally {
        n.unregister();
      }
      if (o instanceof Promise)
        throw (o.catch((i) => {}), new Error("RPC map() callbacks cannot be async."));
      return new rn(n.makeOutput(o), []);
    };
    ((o_ = class extends Eu {
      mapper;
      idx;
      constructor(t, e) {
        (super(), (this.mapper = t), (this.idx = e));
      }
      dup() {
        return this;
      }
      dispose() {}
      get(t) {
        if (t.length == 0) return this;
        if (Kp) return Kp.pushGet(this, t);
        n_();
      }
      call(t, e) {
        n_();
      }
      map(t, e, r) {
        n_();
      }
      pull() {
        n_();
      }
      ignoreUnhandledRejections() {}
      onBroken(t) {
        n_();
      }
    }),
      (kyt = class {
        captures;
        variables;
        constructor(t, e) {
          ((this.captures = t), (this.variables = [e]));
        }
        dispose() {
          for (let t of this.variables) t.dispose();
        }
        apply(t) {
          try {
            if (t.length < 1) throw new Error("Invalid empty mapper function.");
            for (let e of t.slice(0, -1)) {
              let r = new Au(this).evaluateCopy(e);
              if (r.value instanceof ka) {
                let n = Lk(r.value);
                if (n) {
                  this.variables.push(n);
                  continue;
                }
              }
              this.variables.push(new ki(r));
            }
            return new Au(this).evaluateCopy(t[t.length - 1]);
          } finally {
            for (let e of this.variables) e.dispose();
          }
        }
        importStub(t) {
          throw new Error("A mapper function cannot refer to exports.");
        }
        importPromise(t) {
          return this.importStub(t);
        }
        getExport(t) {
          return t < 0 ? this.captures[-t - 1] : this.variables[t];
        }
        getPipeReadable(t) {
          throw new Error("A mapper function cannot use pipe readables.");
        }
        getLimits() {
          return SH;
        }
      }));
    Fk.applyMap = (t, e, r, n, o) => {
      try {
        let i;
        if (t instanceof rn) throw new Error("applyMap() can't be called on RpcPromise");
        if (t instanceof Array) {
          let s = [];
          try {
            for (let a of t) s.push(wve(a, t, r, n, o));
          } catch (a) {
            for (let l of s) l.dispose();
            throw a;
          }
          i = go.fromArray(s);
        } else t == null ? (i = go.fromAppReturn(t)) : (i = wve(t, e, r, n, o));
        return new ki(i);
      } finally {
        for (let i of n) i.dispose();
      }
    };
    ((Dyt = class vH extends Eu {
      state;
      static create(e) {
        return new vH({ refcount: 1, writer: e.getWriter(), closed: !1 });
      }
      constructor(e, r) {
        (super(), (this.state = e), r && ++e.refcount);
      }
      getState() {
        if (this.state) return this.state;
        throw new Error("Attempted to use a WritableStreamStubHook after it was disposed.");
      }
      call(e, r) {
        try {
          let n = this.getState();
          if (e.length !== 1 || typeof e[0] != "string")
            throw new Error("WritableStream stub only supports direct method calls");
          let o = e[0];
          if (o !== "write" && o !== "close" && o !== "abort")
            throw (r.dispose(), new Error(`Unknown WritableStream method: ${o}`));
          return (
            (o === "close" || o === "abort") && (n.closed = !0),
            new $k(
              (o === "write"
                ? r.deliverStreamWrite(n.writer)
                : r.deliverCall(n.writer[o], n.writer)
              ).then((i) => new ki(i)),
            )
          );
        } catch (n) {
          return new oi(n);
        }
      }
      map(e, r, n) {
        for (let o of r) o.dispose();
        return new oi(new Error("Cannot use map() on a WritableStream"));
      }
      get(e) {
        return new oi(new Error("Cannot access properties on a WritableStream stub"));
      }
      dup() {
        return new vH(this.getState(), this);
      }
      pull() {
        return Promise.reject(new Error("Cannot pull a WritableStream stub"));
      }
      ignoreUnhandledRejections() {}
      dispose() {
        let e = this.state;
        ((this.state = void 0),
          e &&
            --e.refcount === 0 &&
            (e.closed ||
              e.writer
                .abort(new Error("WritableStream RPC stub was disposed without calling close()"))
                .catch(() => {}),
            e.writer.releaseLock()));
      }
      onBroken(e) {}
    }),
      (Myt = 256 * 1024),
      (Oyt = 1024 * 1024 * 1024),
      (Nyt = 64 * 1024),
      (Lyt = 2),
      (_ve = 1.25),
      (Byt = 0.9),
      (Fyt = 3),
      ($yt = class {
        now;
        window = Myt;
        bytesInFlight = 0;
        inStartupPhase = !0;
        delivered = 0;
        deliveredTime = 0;
        firstAckTime = 0;
        firstAckDelivered = 0;
        minRtt = 1 / 0;
        roundsWithoutIncrease = 0;
        lastRoundWindow = 0;
        roundStartTime = 0;
        constructor(t) {
          this.now = t;
        }
        onSend(t) {
          this.bytesInFlight += t;
          let e = {
            sentTime: this.now(),
            size: t,
            deliveredAtSend: this.delivered,
            deliveredTimeAtSend: this.deliveredTime,
            windowAtSend: this.window,
            windowFullAtSend: this.bytesInFlight >= this.window,
          };
          return { token: e, shouldBlock: e.windowFullAtSend };
        }
        onError(t) {
          this.bytesInFlight -= t.size;
        }
        onAck(t) {
          let e = this.now();
          ((this.delivered += t.size), (this.deliveredTime = e), (this.bytesInFlight -= t.size));
          let r = e - t.sentTime;
          if (((this.minRtt = Math.min(this.minRtt, r)), this.firstAckTime === 0))
            ((this.firstAckTime = e), (this.firstAckDelivered = this.delivered));
          else {
            let n, o;
            t.deliveredTimeAtSend === 0
              ? ((n = this.firstAckTime), (o = this.firstAckDelivered))
              : ((n = t.deliveredTimeAtSend), (o = t.deliveredAtSend));
            let i = e - n,
              s = (this.delivered - o) / i,
              a = this.inStartupPhase ? Lyt : _ve,
              l = s * this.minRtt * a;
            ((l = Math.min(l, t.windowAtSend * a)),
              t.windowFullAtSend
                ? (l = Math.max(l, t.windowAtSend * Byt))
                : (l = Math.max(l, this.window)),
              (this.window = Math.max(Math.min(l, Oyt), Nyt)),
              this.inStartupPhase &&
                t.sentTime >= this.roundStartTime &&
                (this.window > this.lastRoundWindow * _ve
                  ? (this.roundsWithoutIncrease = 0)
                  : ++this.roundsWithoutIncrease >= Fyt && (this.inStartupPhase = !1),
                (this.roundStartTime = e),
                (this.lastRoundWindow = this.window)));
          }
          return this.bytesInFlight < this.window;
        }
      }));
    qyt = class bH extends Eu {
      state;
      static create(e) {
        return new bH({ refcount: 1, stream: e, canceled: !1 });
      }
      constructor(e, r) {
        (super(), (this.state = e), r && ++e.refcount);
      }
      call(e, r) {
        return (r.dispose(), new oi(new Error("Cannot call methods on a ReadableStream stub")));
      }
      map(e, r, n) {
        for (let o of r) o.dispose();
        return new oi(new Error("Cannot use map() on a ReadableStream"));
      }
      get(e) {
        return new oi(new Error("Cannot access properties on a ReadableStream stub"));
      }
      dup() {
        let e = this.state;
        if (!e) throw new Error("Attempted to dup a ReadableStreamStubHook after it was disposed.");
        return new bH(e, this);
      }
      pull() {
        return Promise.reject(new Error("Cannot pull a ReadableStream stub"));
      }
      ignoreUnhandledRejections() {}
      dispose() {
        let e = this.state;
        ((this.state = void 0),
          e &&
            --e.refcount === 0 &&
            (e.canceled ||
              ((e.canceled = !0),
              e.stream.locked ||
                e.stream
                  .cancel(new Error("ReadableStream RPC stub was disposed without being consumed"))
                  .catch(() => {}))));
      }
      onBroken(e) {}
    };
    Yn.createWritableStreamHook = Dyt.create;
    Yn.createWritableStreamFromHook = Uyt;
    Yn.createReadableStreamHook = qyt.create;
    ((Mve = Pyt), (ee = Nk));
  });
