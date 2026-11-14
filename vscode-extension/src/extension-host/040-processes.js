var ul = g(() => {
  DO();
  DLe();
  qy();
  eO();
  ev();
  FLe();
  Gi();
  _c();
  AK();
  tA();
  cd();
  dA();
  Km();
  EK();
  Zm();
  CK();
  PK();
  OK();
  Qu();
  BO();
  NK();
  od();
  nv();
  LK();
  fe();
  rd();
  $K();
  IO();
  l2e();
  bA();
  ps();
  Sc();
  je();
  DK();
  w2e();
  _2e();
  QM();
  H1e();
});
async function PN({ cwd: t, path: e, ref: r }, n, o, i) {
  try {
    let a = (await n.getWorktreeRepository(t, o))?.root;
    if (!a) return { contentsBase64: null };
    let l = await o.platformPath(),
      c = ro(l, a, t, e);
    if (l.isAbsolute(c) || c.startsWith("..")) return { contentsBase64: null };
    let u;
    if (r === "head" || r === "index") u = ["show", r === "head" ? `HEAD:${c}` : `:${c}`];
    else if (typeof r?.oid == "string" && YFt.test(r.oid)) u = ["cat-file", "--batch"];
    else return { contentsBase64: null };
    let p = await I(a, u, o, {
      collectOutput: "binary-stdout",
      trim: !1,
      signal: i,
      ...(typeof r == "object" && {
        env: { GIT_NO_LAZY_FETCH: "1" },
        maxOutputBytes: 5242880 + JFt,
        stdin: `${r.oid}
`,
      }),
    });
    if (p.code !== 0 || p.outputLimitExceeded != null || p.stdoutBuffer == null)
      return { contentsBase64: null };
    let m = typeof r == "object" ? QFt(p.stdoutBuffer, r.oid) : p.stdoutBuffer;
    if (m == null || m.length === 0) return { contentsBase64: null };
    let f = await WI(m);
    return {
      contentsBase64: Buffer.from(m).toString("base64"),
      ...(f == null ? {} : { mimeType: f }),
    };
  } catch {
    return { contentsBase64: null };
  }
}
function QFt(t, e) {
  let r = Buffer.from(t.buffer, t.byteOffset, t.byteLength),
    n = r.indexOf(10),
    o = r.length - n - 2;
  return n < 0 ||
    o < 0 ||
    o > 5242880 ||
    r.at(-1) !== 10 ||
    r.toString("ascii", 0, n) !== `${e} blob ${o}`
    ? null
    : r.subarray(n + 1, -1);
}
var YFt,
  JFt,
  $5 = g(() => {
    ul();
    O();
    ((YFt = /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/), (JFt = 128));
  });
function z1e(t, e) {
  return new U5(async ({ cwd: r, path: n, ref: o, source: i }, s) =>
    r == null
      ? { contentsBase64: null }
      : PN({ cwd: r, path: n, ref: o, hostConfig: e.hostConfig, operationSource: i }, t, e, s),
  );
}
var U5,
  q5,
  V1e = g(() => {
    ot();
    $5();
    U5 = class extends ee {
      constructor(r) {
        super();
        this.read = r;
      }
      readBinary(r) {
        return new q5((n) => this.read(r, n));
      }
    };
    q5 = class extends ee {
      controller = new AbortController();
      result;
      settled = !1;
      constructor(e) {
        (super(),
          (this.result = e(this.controller.signal).finally(() => {
            this.settled = !0;
          })),
          this.result.catch(() => {}));
      }
      wait() {
        return this.result;
      }
      [Symbol.dispose]() {
        !this.settled && !this.controller.signal.aborted && this.controller.abort();
      }
    };
  });
var Z1e = A((b7r, K1e) => {
  var e1t = Ji(),
    t1t = function () {
      return e1t.Date.now();
    };
  K1e.exports = t1t;
});
var J1e = A((S7r, Y1e) => {
  var r1t = ei(),
    G5 = Z1e(),
    X1e = _W(),
    n1t = "Expected a function",
    o1t = Math.max,
    i1t = Math.min;
  function s1t(t, e, r) {
    var n,
      o,
      i,
      s,
      a,
      l,
      c = 0,
      u = !1,
      p = !1,
      m = !0;
    if (typeof t != "function") throw new TypeError(n1t);
    ((e = X1e(e) || 0),
      r1t(r) &&
        ((u = !!r.leading),
        (p = "maxWait" in r),
        (i = p ? o1t(X1e(r.maxWait) || 0, e) : i),
        (m = "trailing" in r ? !!r.trailing : m)));
    function f(P) {
      var M = n,
        L = o;
      return ((n = o = void 0), (c = P), (s = t.apply(L, M)), s);
    }
    function h(P) {
      return ((c = P), (a = setTimeout(w, e)), u ? f(P) : s);
    }
    function v(P) {
      var M = P - l,
        L = P - c,
        V = e - M;
      return p ? i1t(V, i - L) : V;
    }
    function y(P) {
      var M = P - l,
        L = P - c;
      return l === void 0 || M >= e || M < 0 || (p && L >= i);
    }
    function w() {
      var P = G5();
      if (y(P)) return _(P);
      a = setTimeout(w, v(P));
    }
    function _(P) {
      return ((a = void 0), m && n ? f(P) : ((n = o = void 0), s));
    }
    function S() {
      (a !== void 0 && clearTimeout(a), (c = 0), (n = l = o = a = void 0));
    }
    function E() {
      return a === void 0 ? s : _(G5());
    }
    function T() {
      var P = G5(),
        M = y(P);
      if (((n = arguments), (o = this), (l = P), M)) {
        if (a === void 0) return h(l);
        if (p) return (clearTimeout(a), (a = setTimeout(w, e)), f(l));
      }
      return (a === void 0 && (a = setTimeout(w, e)), s);
    }
    return ((T.cancel = S), (T.flush = E), T);
  }
  Y1e.exports = s1t;
});
var e$e = A((w7r, Q1e) => {
  var a1t = J1e(),
    l1t = ei(),
    c1t = "Expected a function";
  function u1t(t, e, r) {
    var n = !0,
      o = !0;
    if (typeof t != "function") throw new TypeError(c1t);
    return (
      l1t(r) && ((n = "leading" in r ? !!r.leading : n), (o = "trailing" in r ? !!r.trailing : o)),
      a1t(t, e, { leading: n, maxWait: e, trailing: o })
    );
  }
  Q1e.exports = u1t;
});
var d1t,
  p1t,
  P7r,
  t$e = g(() => {
    ot();
    d1t = F(e$e());
    O();
    $();
    MM();
    Oj();
    lm();
    ((p1t = d.object({ text: d.string() })), (P7r = Bo(p1t)));
  });
function r$e(t) {
  let e = (r, n, o) => {
    let i = typeof r == "string" ? new Error(r) : r;
    try {
      t(i, n, o);
    } catch {}
  };
  return {
    report: e,
    reportNonFatal: (r, n) => e(r, "non-fatal", n),
    reportFatal: (r, n) => e(r, "fatal", n),
  };
}
var n$e = g(() => {});
var o$e = g(() => {
  _m();
  os();
  Bt();
});
function g1t(t) {
  return {
    startTimeMs: t.startTimeMs,
    endTimeMs: t.endTimeMs,
    maxRollouts: t.maxRollouts,
    scannedRolloutCount: 0,
    parsedRolloutCount: 0,
    rolloutCountWithCompletedTurns: 0,
    rolloutCountWithEstimatedTurns: 0,
    completedTurnCount: 0,
    estimatedTurnCount: 0,
    totalOutputTokens: 0,
    totalReasoningOutputTokens: 0,
    totalGeneratedTokens: 0,
    observedCompletedTurnWallTimeMs: 0,
    estimatedStandardMs: 0,
    estimatedFastMs: 0,
    estimatedSavedMs: 0,
  };
}
function y1t(t) {
  let e = t.totalOutputTokens;
  return {
    ...t,
    totalGeneratedTokens: e,
    estimatedStandardMs: e * a$e,
    estimatedFastMs: e * l$e,
    estimatedSavedMs: e * h1t,
  };
}
function v1t(t) {
  let e = t.endTimeMs ?? Date.now(),
    r = t.maxRollouts == null ? f1t : Math.max(1, Math.floor(t.maxRollouts));
  return { startTimeMs: t.startTimeMs, endTimeMs: e, maxRollouts: r };
}
function i$e(t) {
  if (t == null) return null;
  let e = Date.parse(t);
  return Number.isFinite(e) ? e : null;
}
async function IN(t) {
  try {
    return await rf.promises.readdir(t, { withFileTypes: !0 });
  } catch (e) {
    if (e.code === "ENOENT") return [];
    throw e;
  }
}
function kN(t) {
  return t.sort((e, r) => r.name.localeCompare(e.name));
}
async function b1t(t) {
  let e = kN((await IN(t.dayPath)).filter((n) => n.isFile() && n.name.endsWith(".jsonl")));
  return (
    await Promise.all(
      e.map(async (n) => {
        let o = (0, fv.join)(t.dayPath, n.name);
        try {
          let i = await rf.promises.stat(o);
          return !i.isFile() || i.mtimeMs < t.startTimeMs
            ? null
            : { path: o, modifiedAtMs: i.mtimeMs };
        } catch {
          return null;
        }
      }),
    )
  ).filter((n) => n != null);
}
async function S1t(t) {
  let e = kN((await IN(t.monthPath)).filter((n) => n.isDirectory()));
  return (
    await Promise.all(
      e.map((n) => b1t({ dayPath: (0, fv.join)(t.monthPath, n.name), startTimeMs: t.startTimeMs })),
    )
  ).flat();
}
async function w1t(t) {
  let e = kN((await IN(t.yearPath)).filter((n) => n.isDirectory()));
  return (
    await Promise.all(
      e.map((n) =>
        S1t({ monthPath: (0, fv.join)(t.yearPath, n.name), startTimeMs: t.startTimeMs }),
      ),
    )
  ).flat();
}
async function _1t(t, e, r) {
  let n = kN((await IN(t)).filter((i) => i.isDirectory()));
  return (
    await Promise.all(n.map((i) => w1t({ yearPath: (0, fv.join)(t, i.name), startTimeMs: e })))
  )
    .flat()
    .sort((i, s) => s.modifiedAtMs - i.modifiedAtMs)
    .slice(0, r);
}
async function x1t(t) {
  let { endTimeMs: e, path: r, startTimeMs: n } = t,
    o = {
      completedTurnCount: 0,
      estimatedTurnCount: 0,
      outputTokens: 0,
      reasoningOutputTokens: 0,
      observedCompletedTurnWallTimeMs: 0,
    },
    i = null,
    s = (0, s$e.createInterface)({
      input: (0, rf.createReadStream)(r, { encoding: "utf8" }),
      crlfDelay: 1 / 0,
    });
  try {
    for await (let a of s) {
      if (a.length === 0) continue;
      let l;
      try {
        l = JSON.parse(a);
      } catch {
        continue;
      }
      if (l.type !== "event_msg" || l.payload == null) continue;
      let c = l.payload.type;
      if (c === "task_started") {
        i = { startedAtMs: i$e(l.timestamp), outputTokens: 0, reasoningOutputTokens: 0 };
        continue;
      }
      if (c === "token_count") {
        if (i == null) continue;
        let m = l.payload.info?.last_token_usage,
          f = m?.output_tokens ?? 0,
          h = m?.reasoning_output_tokens ?? 0;
        if (f <= 0 && h <= 0) continue;
        ((i.outputTokens += f), (i.reasoningOutputTokens += h));
        continue;
      }
      if (c !== "task_complete" || i == null) continue;
      let u = i$e(l.timestamp);
      (u != null &&
        u >= n &&
        u <= e &&
        ((o.completedTurnCount += 1),
        (o.observedCompletedTurnWallTimeMs +=
          u != null && i.startedAtMs != null ? Math.max(0, u - i.startedAtMs) : 0),
        i.outputTokens > 0 &&
          ((o.estimatedTurnCount += 1),
          (o.outputTokens += i.outputTokens),
          (o.reasoningOutputTokens += i.reasoningOutputTokens))),
        (i = null));
    }
  } finally {
    s.close();
  }
  return o;
}
async function c$e(t) {
  let e = v1t(t.params),
    r = g1t(e),
    n = (0, fv.join)(t.codexHome, m1t);
  if (!(0, rf.existsSync)(n)) return r;
  let o = await _1t(n, e.startTimeMs, e.maxRollouts);
  r.scannedRolloutCount = o.length;
  for (let i of o) {
    let s;
    try {
      s = await x1t({ path: i.path, startTimeMs: e.startTimeMs, endTimeMs: e.endTimeMs });
    } catch {
      continue;
    }
    ((r.parsedRolloutCount += 1),
      s.completedTurnCount > 0 && (r.rolloutCountWithCompletedTurns += 1),
      s.estimatedTurnCount > 0 && (r.rolloutCountWithEstimatedTurns += 1),
      (r.completedTurnCount += s.completedTurnCount),
      (r.estimatedTurnCount += s.estimatedTurnCount),
      (r.totalOutputTokens += s.outputTokens),
      (r.totalReasoningOutputTokens += s.reasoningOutputTokens),
      (r.observedCompletedTurnWallTimeMs += s.observedCompletedTurnWallTimeMs));
  }
  return y1t(r);
}
var rf,
  fv,
  s$e,
  m1t,
  f1t,
  a$e,
  l$e,
  h1t,
  W5 = g(() => {
    ((rf = require("node:fs")),
      (fv = require("node:path")),
      (s$e = require("node:readline")),
      (m1t = "sessions"),
      (f1t = 128),
      (a$e = 18),
      (l$e = 12),
      (h1t = a$e - l$e));
  });
var DN,
  u$e = g(() => {
    ot();
    W5();
    DN = class extends ee {
      #e;
      constructor(e) {
        (super(), (this.#e = e));
      }
      read(e) {
        return c$e({ codexHome: this.#e(), params: e });
      }
    };
  });
async function p$e(t, e) {
  let r = await e.platformPath(),
    n = 1e3;
  async function o(i, s) {
    let a = await Qe.readdir(i, { withFileTypes: !0 }, e),
      l = 0;
    for (let c of a) {
      if (c.isFile()) {
        if (((l += 1), l === s)) return l;
        continue;
      }
      if (!c.isDirectory()) continue;
      if (n === 0) return null;
      n -= 1;
      let u = r.join(i, c.name);
      if ((await Qe.stat(u, e, { followSymlinks: !1 })).isSymbolicLink()) continue;
      let m = await o(u, s - l);
      if (m == null) return null;
      if (((l += m), l === s)) return l;
    }
    return l;
  }
  return o(t, 1e3);
}
var m$e = g(() => {
  O();
  Gs();
});
var A1t,
  Z7r,
  R1t,
  E1t,
  C1t,
  T1t,
  X7r,
  f$e = g(() => {
    A1t = F(EV());
    O();
    $();
    _u();
    Bn();
    Bt();
    ((Z7r = Ie("internal-plugins-downloader")),
      (R1t = "openai-internal-testing"),
      (E1t = d
        .looseObject({
          name: d
            .string()
            .regex(/^[\dA-Za-z_-]+$/, "Expected an app-server-compatible plugin name."),
          source: d.strictObject({ path: d.string(), source: d.literal("local") }),
        })
        .refine((t) => t.source.path === `./.agents/plugins/${t.name}`, {
          message: "Expected an internal plugin source contained in the marketplace.",
          path: ["source", "path"],
        })),
      (C1t = d
        .array(E1t)
        .refine(
          (t) => new Set(t.map((e) => e.name.toLowerCase())).size === t.length,
          "Expected unique internal plugin names.",
        )),
      (T1t = d.looseObject({ name: d.string().trim().min(1), plugins: C1t })),
      (X7r = T1t.extend({ name: d.literal(R1t) })));
  });
var h$e = g(() => {
  um();
});
var g$e = g(() => {});
var y$e = g(() => {
  ul();
  O();
  Gs();
  g$e();
  Ua();
});
var cQr,
  v$e = g(() => {
    hw();
    cQr = fw.chrome.linux.installations;
  });
var S$e = A((dQr, b$e) => {
  function P1t(t) {
    return t !== t;
  }
  b$e.exports = P1t;
});
var _$e = A((pQr, w$e) => {
  function I1t(t, e, r) {
    for (var n = r - 1, o = t.length; ++n < o; ) if (t[n] === e) return n;
    return -1;
  }
  w$e.exports = I1t;
});
var A$e = A((mQr, x$e) => {
  var k1t = wW(),
    D1t = S$e(),
    M1t = _$e();
  function O1t(t, e, r) {
    return e === e ? M1t(t, e, r) : k1t(t, D1t, r);
  }
  x$e.exports = O1t;
});
var E$e = A((fQr, R$e) => {
  var N1t = A$e();
  function L1t(t, e) {
    var r = t == null ? 0 : t.length;
    return !!r && N1t(t, e, 0) > -1;
  }
  R$e.exports = L1t;
});
var T$e = A((hQr, C$e) => {
  function B1t(t, e, r) {
    for (var n = -1, o = t == null ? 0 : t.length; ++n < o; ) if (r(e, t[n])) return !0;
    return !1;
  }
  C$e.exports = B1t;
});
var I$e = A((gQr, P$e) => {
  function F1t() {}
  P$e.exports = F1t;
});
var D$e = A((yQr, k$e) => {
  var H5 = Nq(),
    $1t = I$e(),
    U1t = aI(),
    q1t = 1 / 0,
    G1t =
      H5 && 1 / U1t(new H5([, -0]))[1] == q1t
        ? function (t) {
            return new H5(t);
          }
        : $1t;
  k$e.exports = G1t;
});
var O$e = A((vQr, M$e) => {
  var W1t = jq(),
    H1t = E$e(),
    j1t = T$e(),
    z1t = zq(),
    V1t = D$e(),
    K1t = aI(),
    Z1t = 200;
  function X1t(t, e, r) {
    var n = -1,
      o = H1t,
      i = t.length,
      s = !0,
      a = [],
      l = a;
    if (r) ((s = !1), (o = j1t));
    else if (i >= Z1t) {
      var c = e ? null : V1t(t);
      if (c) return K1t(c);
      ((s = !1), (o = z1t), (l = new W1t()));
    } else l = e ? [] : a;
    e: for (; ++n < i; ) {
      var u = t[n],
        p = e ? e(u) : u;
      if (((u = r || u !== 0 ? u : 0), s && p === p)) {
        for (var m = l.length; m--; ) if (l[m] === p) continue e;
        (e && l.push(p), a.push(u));
      } else o(l, p, r) || (l !== a && l.push(p), a.push(u));
    }
    return a;
  }
  M$e.exports = X1t;
});
var kA = A((bQr, N$e) => {
  var Y1t = Mw(),
    J1t = O$e();
  function Q1t(t, e) {
    return t && t.length ? J1t(t, Y1t(e, 2)) : [];
  }
  N$e.exports = Q1t;
});
async function q$e({ order: t }, e) {
  let r = await W$e(e).catch(() => []);
  return i$t(r, t).map(j5);
}
async function G$e(t, e) {
  if (t.trim() === "") return null;
  let r = await W$e(e).catch(() => []),
    n = r.find((s) => s.bundleId.toLowerCase() === t.toLowerCase());
  if (n != null) return j5(n);
  let o = d$t(t);
  if (o != null) {
    let s = r.filter((a) => a.processKeys?.some((l) => l === o));
    if (s.length === 1) return j5(s[0]);
  }
  let i = c$t(t);
  return i != null && H$e(i) ? i : null;
}
async function W$e(t) {
  let e = DA.get(t);
  if (e != null && (e.expiresAtMs == null || e.expiresAtMs > Date.now())) return e.snapshotPromise;
  let r = { expiresAtMs: null, snapshotPromise: Promise.resolve([]) };
  return (
    (r.snapshotPromise = o$t(t)
      .then((n) => {
        let o = DA.get(t);
        return (o === r && (o.expiresAtMs = Date.now() + t$t), n);
      })
      .catch((n) => {
        throw (DA.get(t) === r && DA.delete(t), n);
      })),
    DA.set(t, r),
    r.snapshotPromise
  );
}
async function o$t(t) {
  let e = await t(["powershell.exe", "-NoProfile", "-NonInteractive", "-Command", n$t]);
  if (e.code !== 0) throw new Error("Windows native desktop app metadata lookup failed");
  let r;
  try {
    r = JSON.parse(e.stdout);
  } catch {
    throw new Error("Windows native desktop app metadata lookup returned invalid JSON");
  }
  let n = e$t.safeParse(r);
  if (!n.success)
    throw new Error("Windows native desktop app metadata lookup returned invalid app metadata");
  return (0, U$e.default)(
    n.data.filter((o) => H$e(o)),
    (o) => o.appPath.toLowerCase(),
  );
}
function i$t(t, e) {
  let r = [...t];
  switch (e) {
    case "usage":
      r.sort((n, o) => {
        let i = $$e(o.isRunning) - $$e(n.isRunning);
        if (i !== 0) return i;
        let s = (o.lastUsedDateRanking ?? 0) - (n.lastUsedDateRanking ?? 0);
        if (s !== 0) return s;
        let a = (o.useCount ?? 0) - (n.useCount ?? 0);
        return a !== 0 ? a : n.displayName.localeCompare(o.displayName);
      });
      break;
    case "display-name":
      r.sort((n, o) => n.displayName.localeCompare(o.displayName));
      break;
  }
  return r;
}
function j5({ appPath: t, bundleId: e, displayName: r }) {
  return { appPath: t, bundleId: e, displayName: r };
}
function H$e(t) {
  let e = t.bundleId.trim().toLowerCase();
  return (
    e !== "" &&
    t.displayName.trim() !== "" &&
    !e.startsWith("http://") &&
    !e.startsWith("https://") &&
    !e.endsWith(".url") &&
    !s$t(t)
  );
}
function s$t(t) {
  return [t.bundleId, t.displayName, t.appPath, ...(t.processKeys ?? [])].some((e) => a$t(e));
}
function a$t(t) {
  let e = l$t(t),
    r = OA(MA(t.replace(/^process:/i, "")));
  return (
    B$e.has(e) ||
    B$e.has(r) ||
    r$t.some((n) => e.startsWith(n)) ||
    e.replace(/[^a-z0-9]/g, "").includes("windowsterminal")
  );
}
function l$t(t) {
  return t
    .trim()
    .replace(/^process:/i, "")
    .replace(/\.exe$/i, "")
    .toLowerCase();
}
function c$t(t) {
  let e = u$t(t);
  return e == null ? null : { appPath: e, bundleId: e, displayName: p$t(e) };
}
function u$t(t) {
  let e = t.trim();
  if (e === "") return null;
  let r = "process:";
  if (e.toLowerCase().startsWith(r)) {
    let n = e.slice(r.length).trim();
    return n === "" ? null : F$e(n);
  }
  return j$e(e) && (e.includes("\\") || e.includes("/")) ? F$e(e) : null;
}
function d$t(t) {
  let e = t.trim().replace(/^"|"$/g, "");
  if (e === "" || e.toLowerCase().startsWith("process:")) return null;
  let r = /[^\\/!.}]+\.exe/i.exec(e);
  return r != null ? OA(MA(r[0])) : j$e(e) ? OA(MA(e)) : null;
}
function F$e(t) {
  let e = t.trim().replace(/^"|"$/g, "");
  return e.includes("\\") || e.includes("/") ? `process:${e}` : `process:${OA(MA(e))}.exe`;
}
function MA(t) {
  let e = t.trim().replace(/^"|"$/g, "");
  return (e.split(/[\\/]/).at(-1) ?? e).replace(/\.exe$/i, "");
}
function OA(t) {
  return t
    .trim()
    .replace(/^"|"$/g, "")
    .replace(/\.exe$/i, "")
    .toLowerCase();
}
function p$t(t) {
  return OA(MA(t.slice(8)));
}
function j$e(t) {
  return /(^|[\\/])?[^\\/]+\.exe$/i.test(t.trim().replace(/^"|"$/g, ""));
}
function $$e(t) {
  return t === !0 ? 1 : 0;
}
var U$e,
  L$e,
  e$t,
  t$t,
  DA,
  B$e,
  r$t,
  n$t,
  z$e = g(() => {
    U$e = F(kA());
    $();
    ((L$e = d.object({
      appPath: d.string(),
      bundleId: d.string(),
      displayName: d.string(),
      isRunning: d.boolean().optional(),
      lastUsedDateRanking: d.number().optional(),
      processKeys: d.array(d.string()).optional(),
      useCount: d.number().optional(),
    })),
      (e$t = d.union([d.array(L$e), L$e]).transform((t) => (Array.isArray(t) ? t : [t]))),
      (t$t = 1e4),
      (DA = new WeakMap()),
      (B$e = new Set([
        "alacritty",
        "bash",
        "cmd",
        "cmder",
        "conemu",
        "conemu64",
        "conemu64c",
        "conemuc",
        "conhost",
        "fluentterminal",
        "git-bash",
        "hyper",
        "kitty",
        "mintty",
        "mobaxterm",
        "openconsole",
        "powershell",
        "powershell_ise",
        "putty",
        "puttytel",
        "pwsh",
        "tabby",
        "terminal",
        "terminus",
        "termius",
        "ttermpro",
        "warp",
        "wezterm",
        "wezterm-gui",
        "windowsterminal",
        "wsl",
        "wt",
      ])),
      (r$t = [
        "command prompt",
        "fluent terminal",
        "git bash",
        "powershell",
        "tera term",
        "windows powershell",
        "windows terminal",
      ]),
      (n$t = `
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Decode-Rot13 {
  param([string]$Text)

  -join ($Text.ToCharArray() | ForEach-Object {
    $c = [int][char]$_
    if ($c -ge [int][char]'a' -and $c -le [int][char]'z') {
      [char]((($c - [int][char]'a' + 13) % 26) + [int][char]'a')
    } elseif ($c -ge [int][char]'A' -and $c -le [int][char]'Z') {
      [char]((($c - [int][char]'A' + 13) % 26) + [int][char]'A')
    } else {
      $_
    }
  })
}

function Convert-FileTimeBytes {
  param(
    [byte[]]$Bytes,
    [int]$Offset
  )

  if ($Bytes.Length -lt ($Offset + 8)) {
    return $null
  }

  $fileTime = [BitConverter]::ToInt64($Bytes, $Offset)
  if ($fileTime -le 0) {
    return $null
  }

  try {
    return [DateTime]::FromFileTime($fileTime)
  } catch {
    return $null
  }
}

function Convert-DateTimeToUnixMilliseconds {
  param([Nullable[DateTime]]$DateTime)

  if ($null -eq $DateTime) {
    return 0
  }

  return [DateTimeOffset]$DateTime.ToUniversalTime() | ForEach-Object { $_.ToUnixTimeMilliseconds() }
}

function Parse-UserAssistValue {
  param(
    [string]$EncodedName,
    [byte[]]$Bytes
  )

  $lastRun = $null
  if ($Bytes.Length -ge 68) {
    $lastRun = Convert-FileTimeBytes -Bytes $Bytes -Offset 60
  } elseif ($Bytes.Length -ge 16) {
    $lastRun = Convert-FileTimeBytes -Bytes $Bytes -Offset 8
  }

  [pscustomobject]@{
    Name = Decode-Rot13 $EncodedName
    RunCount = if ($Bytes.Length -ge 8) { [BitConverter]::ToInt32($Bytes, 4) } else { 0 }
    LastRunMs = Convert-DateTimeToUnixMilliseconds $lastRun
  }
}

function Get-UserAssistEntries {
  foreach ($countKey in Get-ChildItem 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\UserAssist\\*\\Count' -ErrorAction SilentlyContinue) {
    $props = Get-ItemProperty -Path $countKey.PSPath
    foreach ($prop in $props.PSObject.Properties) {
      if ($prop.Name -in 'PSPath', 'PSParentPath', 'PSChildName', 'PSDrive', 'PSProvider') {
        continue
      }

      if ($prop.Value -is [byte[]]) {
        Parse-UserAssistValue -EncodedName $prop.Name -Bytes $prop.Value
      }
    }
  }
}

function Get-AppExecutableNames {
  param([string]$AppID)

  $matches = [Regex]::Matches($AppID, '[^\\\\/!.]+\\.exe', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  foreach ($match in $matches) {
    $match.Value
  }
}

function Get-ProcessKey {
  param([string]$Value)

  $trimmed = $Value.Trim().Trim('"').ToLowerInvariant()
  if ($trimmed.EndsWith('.exe')) {
    return $trimmed.Substring(0, $trimmed.Length - 4)
  }
  return $trimmed
}

function Get-TargetProcessName {
  param([string]$App)

  $trimmed = $App.Trim().Trim('"')
  if ($trimmed.Length -eq 0) {
    return $trimmed
  }

  try {
    return [Regex]::Replace([IO.Path]::GetFileName($trimmed), '\\.exe$', '', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  } catch {
    return [Regex]::Replace($trimmed, '\\.exe$', '', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  }
}

function New-ProcessAppID {
  param(
    [string]$ProcessName,
    [string]$ProcessPath
  )

  if ($ProcessPath -and $ProcessPath.Trim().Length -gt 0) {
    return 'process:{0}' -f $ProcessPath.Trim()
  }

  return 'process:{0}.exe' -f (Get-ProcessKey (Get-TargetProcessName $ProcessName))
}

function Get-AppProcessKeys {
  param(
    [string]$Name,
    [string]$AppID
  )

  $keys = New-Object 'System.Collections.Generic.HashSet[string]'
  [void]$keys.Add((Get-ProcessKey $Name))
  foreach ($executableName in Get-AppExecutableNames -AppID $AppID) {
    [void]$keys.Add((Get-ProcessKey (Get-TargetProcessName $executableName)))
  }
  $keys | Sort-Object
}

function Find-BestUserAssistMatch {
  param(
    [string]$Name,
    [string]$AppID,
    [array]$UserAssistEntries
  )

  $shortcutPattern = '(^|[\\\\/])' + [Regex]::Escape($Name) + '\\.lnk$'
  $executableNames = @(Get-AppExecutableNames -AppID $AppID)

  $candidates = foreach ($entry in $UserAssistEntries) {
    if ($entry.Name -ieq $AppID) {
      [pscustomobject]@{
        MatchRank = 1
        LastRunMs = $entry.LastRunMs
        RunCount = $entry.RunCount
        UserAssistName = $entry.Name
      }
      continue
    }

    if ($entry.Name -match $shortcutPattern) {
      [pscustomobject]@{
        MatchRank = 2
        LastRunMs = $entry.LastRunMs
        RunCount = $entry.RunCount
        UserAssistName = $entry.Name
      }
      continue
    }

    foreach ($executableName in $executableNames) {
      $executablePattern = '(^|[\\\\/])' + [Regex]::Escape($executableName) + '$'
      if ($entry.Name -match $executablePattern) {
        [pscustomobject]@{
          MatchRank = 3
          LastRunMs = $entry.LastRunMs
          RunCount = $entry.RunCount
          UserAssistName = $entry.Name
        }
        break
      }
    }
  }

  $candidates |
    Sort-Object @{ Expression = 'MatchRank'; Ascending = $true }, @{ Expression = 'LastRunMs'; Descending = $true }, @{ Expression = 'RunCount'; Descending = $true }, @{ Expression = 'UserAssistName'; Ascending = $true } |
    Select-Object -First 1
}

$userAssistEntries = @(Get-UserAssistEntries)
$runningProcessKeys = New-Object 'System.Collections.Generic.HashSet[string]'
$runningProcesses = @(
  Get-Process -ErrorAction SilentlyContinue |
    Where-Object { $_.ProcessName } |
    ForEach-Object {
      $key = Get-ProcessKey $_.ProcessName
      [void]$runningProcessKeys.Add($key)
      [pscustomobject]@{
        Name = $_.ProcessName
        Key = $key
        Path = try { $_.Path } catch { $null }
      }
    } |
    Sort-Object -Property Path, Key -Unique
)
$apps = @(
  Get-StartApps |
    Where-Object {
      $_.Name -and
      $_.AppID -and
      $_.AppID -notmatch '^https?://' -and
      $_.AppID -notlike '*.url'
    } |
    ForEach-Object {
      $bestUserAssistMatch = Find-BestUserAssistMatch -Name $_.Name -AppID $_.AppID -UserAssistEntries $userAssistEntries
      $processKeys = @(Get-AppProcessKeys -Name $_.Name -AppID $_.AppID)
      [pscustomobject]@{
        bundleId = $_.AppID
        displayName = $_.Name
        appPath = $_.AppID
        isRunning = ($processKeys | Where-Object { $runningProcessKeys.Contains($_) } | Select-Object -First 1) -ne $null
        lastUsedDateRanking = if ($null -ne $bestUserAssistMatch) { $bestUserAssistMatch.LastRunMs } else { 0 }
        processKeys = $processKeys
        useCount = if ($null -ne $bestUserAssistMatch) { $bestUserAssistMatch.RunCount } else { 0 }
      }
    }
)

$claimedProcessKeys = New-Object 'System.Collections.Generic.HashSet[string]'
foreach ($app in $apps) {
  foreach ($processKey in @($app.processKeys)) {
    if ($runningProcessKeys.Contains($processKey)) {
      [void]$claimedProcessKeys.Add($processKey)
    }
  }
}

$processApps = @(
  foreach ($process in $runningProcesses) {
    if ($claimedProcessKeys.Contains($process.Key)) {
      continue
    }

    [pscustomobject]@{
      bundleId = New-ProcessAppID -ProcessName $process.Name -ProcessPath $process.Path
      displayName = $process.Name
      appPath = New-ProcessAppID -ProcessName $process.Name -ProcessPath $process.Path
      isRunning = $true
      lastUsedDateRanking = 0
      processKeys = @($process.Key)
      useCount = 0
    }
  }
)

$apps = @($apps) + @($processApps)
$apps | ConvertTo-Json -Compress -Depth 3
`));
  });
async function X$e(t, { platform: e = process.platform, runCommand: r = Y$e } = {}) {
  if (t.trim() === "") return null;
  let n = y$t(e);
  return n == null ? null : n.getByBundleId(t, { nowMs: Date.now(), runCommand: r });
}
async function V$e(t, e, { platform: r = process.platform, runCommand: n = Y$e } = {}) {
  if (r !== "darwin") return null;
  try {
    let o = await n(["/usr/libexec/PlistBuddy", "-c", `Print :${e}`, t]);
    if (o.code !== 0) return null;
    let i = o.stdout.trim();
    return i === "" ? null : i;
  } catch {
    return null;
  }
}
function y$t(t) {
  return t === "darwin" ? h$t : t === "win32" ? g$t : null;
}
async function v$t({ lastUsedWithinDays: t, order: e }, { nowMs: r, runCommand: n }) {
  let o = await n([
    "/usr/bin/mdfind",
    "-0",
    'kMDItemContentType == "com.apple.application-bundle" && kMDItemFSName == "*.app"',
    "-attr",
    "kMDItemDisplayName",
    "-attr",
    "kMDItemCFBundleIdentifier",
    "-attr",
    "kMDItemLastUsedDate_Ranking",
    "-attr",
    "kMDItemUseCount",
  ]);
  if (o.code !== 0) return [];
  let i = [];
  for (let l of o.stdout.split("\0")) {
    let c = x$t(l);
    c != null && i.push(c);
  }
  let s = t == null ? null : r - t * f$t,
    a = s == null ? i : i.filter((l) => l.lastUsedDateRanking >= s);
  switch (e) {
    case "usage":
      a.sort((l, c) => {
        let u = c.lastUsedDateRanking - l.lastUsedDateRanking;
        if (u !== 0) return u;
        let p = c.useCount - l.useCount;
        return p !== 0 ? p : l.displayName.localeCompare(c.displayName);
      });
      break;
    case "display-name":
      a.sort((l, c) => l.displayName.localeCompare(c.displayName));
      break;
  }
  return _$t(a);
}
async function b$t(t, e) {
  let r = await S$t(t, e);
  return r == null ? null : { appPath: r, bundleId: t, displayName: await w$t(r, "darwin", e) };
}
async function S$t(t, e) {
  let r = await e(["/usr/bin/mdfind", `kMDItemCFBundleIdentifier == "${t}"`]);
  return r.code !== 0
    ? null
    : (r.stdout
        .split(
          `
`,
        )
        .map((n) => n.trim())
        .find((n) => n.endsWith(hv)) ?? null);
}
async function w$t(t, e, r) {
  let n = MN.default.join(t, "Contents", "Info.plist");
  return (
    (await V$e(n, "CFBundleDisplayName", { platform: e, runCommand: r })) ??
    (await V$e(n, "CFBundleName", { platform: e, runCommand: r })) ??
    MN.default.basename(t, hv)
  );
}
function _$t(t) {
  let e = t.filter((n) => n.appPath.endsWith(hv) && !Z$e.includes(n.bundleId)),
    r = new Set(e.filter((n) => n.isDefault).map((n) => n.appPath));
  return (0, K$e.default)(e, (n) => n.appPath).map(
    ({ bundleId: n, displayName: o, appPath: i }) => ({
      bundleId: n,
      displayName: o,
      appPath: i,
      ...(r.has(i) ? { isDefault: !0 } : {}),
    }),
  );
}
function x$t(t) {
  if (t === "") return null;
  let e = t.match(m$t);
  if (e == null) return null;
  let r = e[1],
    n = e[2],
    o = e[3],
    i = e[4],
    s = e[5];
  return o === "" || o === ON || !r.endsWith(hv) || Z$e.includes(o)
    ? null
    : {
        bundleId: o,
        displayName: A$t(r, n),
        appPath: r,
        lastUsedDateRanking: R$t(i),
        useCount: E$t(s),
      };
}
function A$t(t, e) {
  let r = e === ON ? MN.default.basename(t) : e;
  return r.endsWith(hv) ? r.slice(0, -hv.length) : r;
}
function R$t(t) {
  if (t === ON) return 0;
  let e = Date.parse(t);
  return Number.isNaN(e) ? 0 : e;
}
function E$t(t) {
  if (t === ON) return 0;
  let e = Number.parseInt(t, 10);
  return Number.isNaN(e) ? 0 : e;
}
var MN,
  K$e,
  RQr,
  m$t,
  ON,
  hv,
  Z$e,
  f$t,
  EQr,
  h$t,
  g$t,
  Y$e,
  J$e = g(() => {
    ((MN = F(require("node:path"))), (K$e = F(kA())));
    $();
    z$e();
    Ku();
    ((RQr = d
      .object({
        CFBundleDisplayName: d.string().optional(),
        CFBundleIdentifier: d.string().optional(),
        CFBundleName: d.string().optional(),
        LSBackgroundOnly: d.boolean().optional(),
        LSUIElement: d.boolean().optional(),
        CFBundleURLTypes: d
          .array(d.object({ CFBundleURLSchemes: d.array(d.string()).optional() }).loose())
          .optional(),
      })
      .loose()),
      (m$t =
        /^(.*?)\s+kMDItemDisplayName = (.*?)\s+kMDItemCFBundleIdentifier = (.*?)\s+kMDItemLastUsedDate_Ranking = (.*?)\s+kMDItemUseCount = (.*)$/),
      (ON = "(null)"),
      (hv = ".app"),
      (Z$e = [
        "com.apple.finder.Open-Computer",
        "com.openai.sky.CUAService",
        "com.spotify.installer",
      ]),
      (f$t = 864e5),
      (EQr = [
        ["/Applications/Google Chrome.app", "com.google.Chrome", "Google Chrome"],
        ["/Applications/Safari.app", "com.apple.Safari", "Safari"],
        ["/Applications/Firefox.app", "org.mozilla.firefox", "Firefox"],
        ["/Applications/Microsoft Edge.app", "com.microsoft.edgemac", "Microsoft Edge"],
        ["/Applications/Brave Browser.app", "com.brave.Browser", "Brave Browser"],
        ["/Applications/Arc.app", "company.thebrowser.Browser", "Arc"],
        ["/Applications/Opera.app", "com.operasoftware.Opera", "Opera"],
        ["/Applications/Vivaldi.app", "com.vivaldi.Vivaldi", "Vivaldi"],
        ["/Applications/Chromium.app", "org.chromium.Chromium", "Chromium"],
        ["/Applications/Orion.app", "com.kagi.kagimacOS", "Orion"],
        [
          "/Applications/Google Chrome Canary.app",
          "com.google.Chrome.canary",
          "Google Chrome Canary",
        ],
        ["/Applications/Google Chrome Beta.app", "com.google.Chrome.beta", "Google Chrome Beta"],
        [
          "/Applications/Firefox Developer Edition.app",
          "org.mozilla.firefoxdeveloperedition",
          "Firefox Developer Edition",
        ],
        [
          "/Applications/Microsoft Edge Beta.app",
          "com.microsoft.edgemac.Beta",
          "Microsoft Edge Beta",
        ],
        ["/Applications/Brave Browser Beta.app", "com.brave.Browser.beta", "Brave Browser Beta"],
      ].map(([t, e, r]) => ({ appPath: t, bundleId: e, displayName: r }))),
      (h$t = {
        getByBundleId: (t, { runCommand: e }) => b$t(t, e),
        list: ({ lastUsedWithinDays: t, order: e }, { nowMs: r, runCommand: n }) =>
          v$t({ lastUsedWithinDays: t, order: e }, { nowMs: r, runCommand: n }),
      }),
      (g$t = {
        getByBundleId: (t, { runCommand: e }) => G$e(t, e),
        list: ({ order: t }, { runCommand: e }) => q$e({ order: t }, e),
      }));
    Y$e = async (t) => {
      let { code: e, stdout: r } = await Vu({ args: t }).wait();
      return { code: e, stdout: r };
    };
  });
var Q$e,
  kQr,
  DQr,
  eUe = g(() => {
    Q$e = F(require("node:path"));
    $();
    Dx();
    ((kQr = Q$e.default.join("node_repl", "active_execs")),
      (DQr = d
        .object({
          version: d.literal(1),
          execId: d.string().min(1),
          sessionId: d.string().min(1),
          turnId: d.string().min(1),
          nodeReplPid: d.number().int().positive(),
          kernelPid: d.number().int().positive(),
          startedAtMs: d.number().int().nonnegative(),
        })
        .loose()));
  });
var tUe = g(() => {
  q0();
  Bn();
});
function oUe(t, e, r, n = null, o = async () => t.kill()) {
  let i = null,
    s = () => {
      t.isDone() ||
        (n != null && clearTimeout(n),
        (i =
          i ??
          o().catch((l) => {
            try {
              t.kill("SIGKILL");
            } catch {}
            throw l;
          })),
        i.catch(() => {}));
    },
    a = t.wait().then(
      async ({ code: l, gitErrorKind: c, signal: u, stdout: p, stderr: m }) => (
        await i,
        p && e.enqueue(Buffer.from(p)),
        m && r.enqueue(Buffer.from(m)),
        e.close(),
        r.close(),
        { code: l, gitErrorKind: c, signal: u }
      ),
      (l) => {
        throw (e.error(l), r.error(l), l);
      },
    );
  return (
    a.catch(() => {}),
    {
      stdin: new WritableStream({
        write: (l) => t.writeStdin(Buffer.from(l)),
        close: () => t.writeStdin(Buffer.alloc(0), { closeStdin: !0 }),
        abort: s,
      }),
      stdout: e.stream,
      stderr: r.stream,
      kill: s,
      resize: async () => {
        throw new Error("Local execution host processes do not support resizing");
      },
      wait: async () => {
        try {
          return await a;
        } finally {
          n != null && clearTimeout(n);
        }
      },
    }
  );
}
async function Z5(t) {
  let e = t.getPid();
  if (e == null) {
    t.kill("SIGKILL");
    return;
  }
  await iUe(e, process.env);
}
async function iUe(t, e) {
  if (process.platform !== "win32") {
    try {
      process.kill(-t, "SIGKILL");
    } catch (n) {
      if (!(n instanceof Error && "code" in n && n.code === "ESRCH")) throw n;
    }
    return;
  }
  let r = e.SystemRoot ?? e.windir ?? "C:\\Windows";
  await C$t(K5.default.win32.join(r, "System32", "taskkill.exe"), ["/pid", `${t}`, "/t", "/f"], {
    env: pn(e),
    windowsHide: !0,
    timeout: 2e3,
  });
}
function sUe(t) {
  let e = t[Symbol.asyncIterator](),
    r = !1;
  return new ReadableStream({
    async pull(n) {
      try {
        let { done: o, value: i } = await e.next();
        if (r) return;
        if (o) {
          n.close();
          return;
        }
        n.enqueue(i);
      } catch (o) {
        r || n.error(o);
      }
    },
    cancel() {
      ((r = !0), t.destroy());
    },
  });
}
function aUe(t, e, r) {
  if (r || process.platform !== "win32") return { args: t, env: e };
  let n = e != null && Object.keys(e).some((a) => a.toLowerCase() === "path"),
    o = { ...process.env };
  if (n) for (let a of Object.keys(o)) a.toLowerCase() === "path" && delete o[a];
  let i = { ...o, ...e };
  if ((OV(i), t[0] !== "git")) return { args: t, env: i };
  let s = T$t(i, n);
  return {
    args: /\.(cmd|bat)$/i.test(s)
      ? [V5(i, "ComSpec") ?? "cmd.exe", "/d", "/s", "/c", s, ...t.slice(1)]
      : [s, ...t.slice(1)],
    env: i,
  };
}
function T$t(t, e) {
  if (!e && z5 != null) return z5;
  let r = rUe("git.exe", t) ?? rUe("git", t);
  if (r == null) throw new Error("Failed to locate git executable in PATH");
  return (e || (z5 = r), r);
}
function rUe(t, e) {
  let r = (0, NN.spawnSync)(P$t(e), [`$PATH:${t}`], { env: e, windowsHide: !0, encoding: "utf8" });
  return r.status !== 0 || typeof r.stdout != "string"
    ? null
    : (r.stdout
        .split(/\r?\n/)
        .map((n) => n.trim())
        .find((n) => n.length > 0) ?? null);
}
function P$t(t) {
  let e = V5(t, "SystemRoot") ?? V5(t, "windir") ?? "C:\\Windows";
  return K5.default.win32.join(e, "System32", "where.exe");
}
function V5(t, e) {
  let r = Object.keys(t)
    .reverse()
    .find((n) => n.toLowerCase() === e.toLowerCase());
  return t[r ?? ""]?.trim() || void 0;
}
var NN,
  K5,
  nUe,
  C$t,
  z5,
  X5 = g(() => {
    ((NN = require("node:child_process")),
      (K5 = F(require("node:path"))),
      (nUe = require("node:util")));
    os();
    GD();
    C$t = (0, nUe.promisify)(NN.execFile);
  });
function I$t(t) {
  return wu(t) || Ls(t) || (!Su(t) && !k$t(t) && !t.startsWith("/")) ? t : Cwe(t, jg());
}
function k$t(t) {
  return /^\\{1,2}[Mm][Nn][Tt]\\[a-zA-Z](?:\\|$)/.test(t);
}
var Gn,
  NA,
  lUe,
  cUe,
  nf,
  uUe = g(() => {
    ((Gn = require("node:fs")),
      (NA = F(require("node:path"))),
      (lUe = require("node:stream")),
      (cUe = require("node:stream/promises")));
    O();
    Bn();
    Yg();
    Rz();
    X5();
    Ku();
    Ua();
    nf = class {
      constructor(e = M_(), r) {
        this.runsInsideWsl = e;
        this.processOwner = r;
      }
      workspaceRoot = new F_(this);
      hostConfig = { id: "local", display_name: "Local", kind: "local" };
      id = "local";
      isLocal = !0;
      getFileSystemPath(e) {
        return this.runsInsideWsl ? I$t(e) : e;
      }
      async spawn(e) {
        let r = e.killProcessTree || this.processOwner != null,
          { args: n, env: o } = aUe(e.args, e.env, this.runsInsideWsl),
          i = mg(),
          s = mg(),
          a = null,
          l = !1,
          c = 0,
          u = 0,
          p = (y, w) => {
            (y === "stdout" ? (c += w.length) : (u += w.length),
              e.outputBytesCap != null &&
                (y === "stdout" ? c : u) > e.outputBytesCap &&
                (a == null ? (l = !0) : a.kill()));
          },
          m = Vu({
            args: n,
            allowedNonZeroExitCodes: e.allowedNonZeroExitCodes,
            collectOutput: !1,
            cwd: e.cwd,
            detached: r && process.platform !== "win32",
            env: o,
            signal: e.signal,
            spawnInsideWsl: this.runsInsideWsl,
            streamStdin: !0,
            windowsHide: e.windowsHide,
            stderrChunkHandler: (y) => {
              (p("stderr", y), s.enqueue(y));
            },
            stdoutChunkHandler: (y) => {
              (p("stdout", y), i.enqueue(y));
            },
          });
        (m.getPid() == null && (await m.wait()), this.processOwner?.(m));
        let f = e.timeoutMs == null ? null : setTimeout(() => a?.kill(), e.timeoutMs);
        a = oUe(m, i, s, f, r ? () => Z5(m) : void 0);
        let h = () => a.kill();
        (e.signal?.addEventListener("abort", h), (e.signal?.aborted || l) && a.kill());
        let v = () => e.signal?.removeEventListener("abort", h);
        return (a.wait().then(v, v), a);
      }
      async readFile(e) {
        return sUe((0, Gn.createReadStream)(this.getFileSystemPath(e)));
      }
      async writeFile(e, r, n = {}) {
        await (0, cUe.pipeline)(
          lUe.Readable.from(vw(r)),
          (0, Gn.createWriteStream)(this.getFileSystemPath(e)),
          { signal: n.signal },
        );
      }
      async createDirectory(e, r = {}) {
        await Gn.promises.mkdir(this.getFileSystemPath(e), { recursive: r.recursive ?? !0 });
      }
      stat(e, r = {}) {
        let n = this.getFileSystemPath(e);
        return r.followSymlinks === !1 ? Gn.promises.lstat(n) : Gn.promises.stat(n);
      }
      readDirectory(e) {
        return Gn.promises.readdir(this.getFileSystemPath(e), { withFileTypes: !0 });
      }
      async remove(e, r = {}) {
        let n = this.getFileSystemPath(e);
        if (r.recursive === !1) {
          let o = await Gn.promises.lstat(n).catch((i) => {
            if (r.force !== !1 && i.code === "ENOENT") return null;
            throw i;
          });
          if (o == null) return;
          if (o.isDirectory()) {
            await Gn.promises.rmdir(n);
            return;
          }
        }
        await Gn.promises.rm(n, { recursive: r.recursive ?? !0, force: r.force ?? !0 });
      }
      async copyFile(e, r, n = {}) {
        await Gn.promises.copyFile(
          this.getFileSystemPath(e),
          this.getFileSystemPath(r),
          n.exclusive ? Gn.constants.COPYFILE_EXCL : 0,
        );
      }
      async copy(e, r, n = {}) {
        await Gn.promises.cp(this.getFileSystemPath(e), this.getFileSystemPath(r), {
          recursive: n.recursive ?? !1,
          verbatimSymlinks: !0,
        });
      }
      workspacesRoot() {
        return this.workspaceRoot.read();
      }
      async codexHome() {
        return Xt({ preferWsl: this.runsInsideWsl });
      }
      async platformFamily() {
        return this.runsInsideWsl || process.platform !== "win32" ? "unix" : "windows";
      }
      async platformOs() {
        return this.runsInsideWsl
          ? "linux"
          : process.platform === "darwin"
            ? "macos"
            : process.platform;
      }
      async platformPath() {
        return this.runsInsideWsl || process.platform !== "win32"
          ? NA.default.posix
          : NA.default.win32;
      }
      async startFileWatch(e) {
        let r = pt(),
          n = !1,
          o = await this.platformPath(),
          i = (0, Gn.watch)(this.getFileSystemPath(e.path), { recursive: e.recursive }, (a, l) => {
            let c =
                l == null
                  ? null
                  : o.join(
                      e.path,
                      ...l.split(this.runsInsideWsl ? NA.default.win32.sep : NA.default.sep),
                    ),
              u = c == null ? [] : [c];
            (c != null &&
              a === "rename" &&
              e.renameEventHandling === "changed-path-with-parent-directory" &&
              u.push(o.dirname(c)),
              e.onChange({
                changedPaths: u,
                pathChanges:
                  o.sep === "\\" && !e.recursive && a === "change" && c != null
                    ? [{ path: c, type: "update" }]
                    : void 0,
              }));
          }),
          s = (a) => {
            n || ((n = !0), i.close(), r.resolve(a));
          };
        return (
          i.on("error", (a) => {
            s({ reason: "watch-error", error: a });
          }),
          {
            coverage: { recursive: e.recursive, typedPathChanges: !1 },
            path: e.path,
            closed: r.promise,
            dispose: async () => {
              s({ reason: "disposed" });
            },
          }
        );
      }
    };
  });
var dUe = g(() => {
  uUe();
  Yg();
});
async function mUe(t, e, r, n) {
  (n?.throwIfAborted(),
    await new Promise((o, i) => {
      let s = ["--null", "-czf", e, "-C", t, "--files-from", "-"],
        a = (0, pUe.spawn)(wm.resolve("tar") ?? "tar", s, {
          env: pn(process.env),
          stdio: ["pipe", "ignore", "pipe"],
          signal: n,
        }),
        l = "";
      (a.stderr?.setEncoding("utf8"),
        a.stderr?.on("data", (u) => {
          l += u;
        }));
      let c;
      if (
        (a.on("error", (u) => {
          c = u;
        }),
        a.on("close", (u) => {
          c != null
            ? i(c)
            : u === 0
              ? o()
              : i(new Error(`Exited with code ${u}${l ? `: ${l.trim()}` : ""}`));
        }),
        a.stdin)
      ) {
        if (r.length > 0) {
          let u = `${r.join("\0")}\0`;
          a.stdin.write(u, (p) => {
            p && (c = p);
          });
        }
        a.stdin.end();
      }
    }));
}
var pUe,
  fUe = g(() => {
    pUe = require("node:child_process");
    _m();
    os();
  });
async function LA(t, e, r) {
  r?.throwIfAborted();
  let { host: n } = t;
  if (!n.isLocal) throw new Error("Cannot create a worktree snapshot on a remote host");
  let o = t.root;
  await _K(t, 209715200);
  let i = (0, LN.basename)(o) || "repo",
    [s, a, l] = await Promise.all([At(t, "HEAD"), Cr(t), D$t(t)]);
  if (s == null) throw new Error("Cannot create a worktree snapshot without a HEAD commit");
  r?.throwIfAborted();
  let c = `${i}-snapshot-${(0, hUe.randomUUID)()}.tar.gz`,
    u = (0, LN.join)((0, gUe.tmpdir)(), c);
  try {
    if (e && e.trim().length > 0) {
      let m = await I(o, ["archive", "--format=tar.gz", "-o", u, e], n, {
        waitForExitOnAbortSignal: r,
      });
      if (!m.success) {
        let f = m.stderr || m.stdout;
        throw new Error(`git archive failed${f ? `: ${f}` : ""}`);
      }
    } else {
      let m = await VK(t);
      (r?.throwIfAborted(), await mUe(o, u, m, r));
    }
    r?.throwIfAborted();
    let p = await Y5.promises.stat(u);
    return (
      r?.throwIfAborted(),
      {
        tarballPath: u,
        tarballFilename: c,
        tarballSize: p.size,
        repoName: i,
        branch: a,
        snapshotBranch: e ?? a ?? s,
        commitSha: s,
        remotes: l,
        contentType: "application/gzip",
      }
    );
  } catch (p) {
    throw (await Y5.promises.rm(u, { force: !0 }), p);
  }
}
function D$t(t) {
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "remotes"),
    gcTime: be,
    meta: Ue,
    queryFn: async () => {
      let e = await I(t.root, ["remote", "-v"], t.host);
      if (!e.success) {
        let r = e.stderr || e.stdout;
        throw new Error(`git remote -v failed${r ? `: ${r}` : ""}`);
      }
      return KK(e.stdout);
    },
    staleTime: be,
  });
}
var hUe,
  Y5,
  gUe,
  LN,
  J5 = g(() => {
    ((hUe = require("node:crypto")),
      (Y5 = require("node:fs")),
      (gUe = require("node:os")),
      (LN = require("node:path")));
    ul();
    fUe();
  });
async function Le(t, e) {
  return yUe(t, e, { attempt: 0, retryDelaysMs: M$t });
}
async function yUe(t, e, r) {
  (await B$t(e.appServerClient.id, e.signal),
    e.retrySecondaryRateLimit === !0 && e.signal?.throwIfAborted());
  let n = await N$t(t, e),
    o = r.retryDelaysMs[r.attempt];
  if (
    n.success ||
    o == null ||
    e.signal?.aborted === !0 ||
    !L$t(n) ||
    e.retrySecondaryRateLimit !== !0
  )
    return n;
  F$t(e.appServerClient.id, o);
  try {
    await (0, Q5.setTimeout)(o, void 0, { signal: e.signal });
  } catch {
    return n;
  }
  return yUe(t, e, { attempt: r.attempt + 1, retryDelaysMs: r.retryDelaysMs });
}
async function N$t(t, e) {
  let { appServerClient: r } = e,
    n = ai(["gh", ...t]),
    o = { ...O$t, ...e.env };
  try {
    let i = tn(r.hostConfig) || Ds(r.id) != null,
      s = await r.spawn({
        args: i ? ["bash", "-lc", n] : ["gh", ...t],
        cwd: e.cwd ?? (i ? "/" : process.cwd()),
        env: i ? o : pn({ ...process.env, ...o }),
        signal: e.signal,
        timeoutMs: e.timeoutMs,
        windowsHide: i ? void 0 : !0,
      }),
      { stdout: a, stderr: l, code: c, signal: u } = await _r(s),
      p = a.trim(),
      m = l.trim();
    return (
      !m &&
        !p &&
        e.timeoutMs != null &&
        c == null &&
        u != null &&
        (m = "GitHub CLI command timed out"),
      {
        command: n,
        success: c === 0,
        code: c,
        stdout: e.trimStdout === !1 ? a : p,
        stderr: m,
        isExecutableMissing:
          c === 127 &&
          /(?:^|\b)gh(?::|\b).*(?:command not found|not found)/i.test(`${l}
${a}`),
      }
    );
  } catch (i) {
    return {
      command: n,
      success: !1,
      code: null,
      stdout: "",
      stderr: "Failed to start GitHub CLI",
      isExecutableMissing: i != null && typeof i == "object" && "code" in i && i.code === "ENOENT",
    };
  }
}
function L$t(t) {
  if (t.isExecutableMissing) return !1;
  let e = `${t.stderr}
${t.stdout}`.toLowerCase();
  return e.includes("secondary rate limit") || e.includes("abuse detection mechanism");
}
async function B$t(t, e) {
  let r = BN.get(t);
  if (!(r == null || e?.aborted === !0)) {
    if (e == null) {
      await r;
      return;
    }
    await new Promise((n) => {
      let o = () => {
        (e.removeEventListener("abort", o), n());
      };
      (e.addEventListener("abort", o, { once: !0 }), r.then(o));
    });
  }
}
function F$t(t, e) {
  let r = (0, Q5.setTimeout)(e);
  (BN.set(t, r),
    r.finally(() => {
      BN.get(t) === r && BN.delete(t);
    }));
}
var Q5,
  M$t,
  BN,
  O$t,
  Tr = g(() => {
    Q5 = require("node:timers/promises");
    O();
    bm();
    os();
    Yg();
    ((M$t = [1e3, 2e3]),
      (BN = new Map()),
      (O$t = { GIT_TERMINAL_PROMPT: "0", GH_PROMPT_DISABLED: "1" }));
  });
function $r(t, e) {
  let r = hi(t, e);
  return {
    status: "error",
    error: r,
    execOutput: Nt({ command: t.command, stdout: t.stdout, stderr: t.stderr, fallbackOutput: r }),
  };
}
function hi(t, e) {
  return t.isExecutableMissing
    ? "GitHub CLI (gh) is not installed"
    : $$t(t)
      ? "GitHub CLI (gh) is not authenticated."
      : t.stderr || t.stdout || e;
}
function ur(t, e) {
  let r;
  try {
    r = JSON.parse(t);
  } catch {
    throw new Error("Failed to parse GitHub CLI response");
  }
  let n = e.safeParse(r);
  if (!n.success) throw new Error("Unexpected GitHub CLI response");
  return n.data;
}
function vUe(t) {
  let e = Array.from(t.matchAll(/https?:\/\/\S+/g));
  for (let r of e) {
    let n = r[0].replace(/[),.]+$/, "");
    if (n && /\/pull\/\d+(?:\b|$)/.test(n)) return n;
  }
  return null;
}
function bUe(t) {
  if (t == null) return null;
  let e = /\/pull\/(\d+)(?:\b|$)/.exec(t);
  return e == null ? null : Number(e[1]);
}
function Js(t) {
  if (!t) return null;
  let e = t.split("/").filter((o) => o.length > 0);
  if (e.length < 2) return null;
  let r = e[e.length - 2],
    n = e[e.length - 1];
  return r == null || n == null
    ? null
    : {
        hostname: e.length > 2 ? e.slice(0, Math.max(0, e.length - 2)).join("/") : null,
        owner: r,
        repo: n,
      };
}
function $$t(t) {
  if (t.code === 4) return !0;
  let e = `${t.stderr}
${t.stdout}`.toLowerCase();
  return (
    e.includes("gh auth login") ||
    e.includes("not logged into any github hosts") ||
    e.includes("gh_token") ||
    e.includes("gh_enterprise_token")
  );
}
var Yr = g(() => {
  O();
});
async function e8(t, e, r) {
  return q$t({ appServerClient: t, hostname: r, signal: e });
}
async function gv(t, e = "github.com") {
  let r = await Le(["api", "user", "--hostname", e], { appServerClient: t, timeoutMs: 5e3 });
  if (!r.success) return { status: "error", error: hi(r, "Failed to load GitHub user") };
  let n = ur(r.stdout || "{}", U$t),
    o = n.login.toLowerCase();
  return {
    status: "success",
    account: { hostId: t.id, hostname: e.toLowerCase(), login: o },
    avatarUrl: n.avatar_url ?? null,
    login: n.login,
  };
}
async function Cn(t, e, r) {
  let n = await e8(t, e, r);
  if (!n.isInstalled) throw new Error("GitHub CLI (gh) is not installed");
  if (!n.isAuthenticated) throw new Error("GitHub CLI (gh) is not authenticated.");
}
async function q$t({ appServerClient: t, hostname: e, signal: r }) {
  let n = tn(t.hostConfig) ? 5e3 : 1e3,
    o = 1e4,
    i = await Le(["--version"], { appServerClient: t, signal: r, timeoutMs: n });
  if (
    (r?.throwIfAborted(),
    !i.success &&
      !i.isExecutableMissing &&
      ((i = await Le(["--version"], { appServerClient: t, signal: r, timeoutMs: n })),
      r?.throwIfAborted()),
    !i.success)
  ) {
    if (i.isExecutableMissing) return { isInstalled: !1, isAuthenticated: !1 };
    throw new Error(hi(i, "Failed to check GitHub CLI availability"));
  }
  let s = e == null ? [] : ["--hostname", e],
    a = await Le(["auth", "status", "--active", ...s], {
      appServerClient: t,
      signal: r,
      timeoutMs: o,
    });
  return (
    !a.success &&
      a.stderr.includes("unknown flag: --active") &&
      (a = await Le(["auth", "status", ...s], { appServerClient: t, signal: r, timeoutMs: o })),
    { isInstalled: !0, isAuthenticated: a.success }
  );
}
