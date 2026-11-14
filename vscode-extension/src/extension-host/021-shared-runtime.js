var x0,
  gwe = g(() => {
    ot();
    x0 = class extends ee {
      #e = !1;
      async claimComposerEducation() {
        return this.#e ? !1 : ((this.#e = !0), !0);
      }
    };
  });
function pn(t) {
  let e = { ...t };
  for (let r of Object.keys(e)) JSt.has(r.toUpperCase()) && delete e[r];
  return e;
}
var JSt,
  os = g(() => {
    JSt = new Set([
      "BREAKPAD_DUMP_LOCATION",
      "CHROME_CRASHPAD_PIPE_NAME",
      "CRASHPAD_HANDLER_PID",
      "ELECTRON_CRASH_REPORTER_PROCESS_TYPE",
      "__CFBUNDLEIDENTIFIER",
    ]);
  });
function Swe(t) {
  if (A0) throw new Error("shouldSpawnInsideWsl already set");
  A0 = t;
}
function M_() {
  if (!A0) {
    if (process.env.NODE_ENV === "test" || process.env.VITEST != null) return !1;
    throw new Error("shouldSpawnInsideWsl not set");
  }
  return A0();
}
function jg(t = !1) {
  if (process.platform !== "win32") return null;
  if (!t && $a !== void 0)
    return (
      he().debug("wsl_discovery_cache_hit", {
        safe: { mode: "sync", result: $a == null ? "empty" : "found" },
        sensitive: {},
      }),
      $a
    );
  Hg += 1;
  let e = owt(Hg);
  return (e !== void 0 && ($a = e), e ?? null);
}
async function QSt(t = !1) {
  if (process.platform !== "win32") return null;
  if (!t && $a !== void 0)
    return (
      he().debug("wsl_discovery_cache_hit", {
        safe: { mode: "async", result: $a == null ? "empty" : "found" },
        sensitive: {},
      }),
      $a
    );
  if (!t && D_ != null) return D_;
  let e = ++Hg,
    r = iwt(e);
  D_ = r;
  try {
    let n = await r;
    return (n !== void 0 && Hg === e && ($a = n), n);
  } finally {
    D_ === r && (D_ = void 0);
  }
}
async function wwe() {
  let t = await ewt();
  return t.status === "failed" ? { available: !1, distro: null } : t.availability;
}
async function ewt(t = !1) {
  let e = await QSt(t);
  return e === void 0 ? { status: "failed" } : { status: "success", availability: await twt(e) };
}
async function twt(t) {
  if (t == null) return { available: !1, distro: null };
  let e = performance.now();
  return new Promise((r) => {
    (0, sm.execFile)(
      "wsl.exe",
      ["-d", t, "--", bwe, "-lc", "exit 0"],
      { encoding: "utf8", env: pn(process.env), timeout: ywe, windowsHide: !0 },
      (n, o, i) => {
        if (n != null) {
          (he().debug("WSL bash availability check failed", {
            safe: {
              stage: "bash",
              mode: "async",
              elapsedMs: Math.round(performance.now() - e),
              timeoutMs: ywe,
              code: n.code === "ETIMEDOUT" ? "ETIMEDOUT" : null,
            },
            sensitive: { distro: t, error: n, stderr: i ?? "" },
          }),
            r({ available: !1, distro: t }));
          return;
        }
        r({ available: !0, distro: t });
      },
    );
  });
}
function xj(t) {
  return ["-d", t.distro, "--cd", t.cwd ?? ".", "--exec", bwe, "-lc", t.command];
}
function _we() {
  if (im !== void 0) return im;
  if (Date.now() < Sj) return;
  let t = he(),
    e = rwt(t);
  if (!e) {
    Sj = Date.now() + vwe;
    return;
  }
  if (wu(e)) return ((im = jp(e)), im);
  if (Su(e)) return ((im = jp(kk(e))), im);
  let r = nwt(e, t);
  if (r) return ((im = r), r);
  (t.warning("[resolveCodexHomeFromWsl] Unable to translate Linux path", {
    safe: {},
    sensitive: { linuxPath: e },
  }),
    (Sj = Date.now() + vwe));
}
function rwt(t) {
  return xwe(
    ["/usr/bin/env", "bash", "-lc", 'printf %s "${CODEX_HOME:-$HOME/.codex}"'],
    "readCodexHomePathFromWslEnv",
    t,
  );
}
function nwt(t, e) {
  let r = xwe(["wslpath", "-w", t], `resolveCodexHomeFromWsl:wslpath(${t})`, e);
  return r ? jp(r) : void 0;
}
function xwe(t, e, r) {
  try {
    let n = (0, sm.spawnSync)("wsl.exe", t, {
      encoding: "utf8",
      env: pn(process.env),
      windowsHide: !0,
    });
    if (n.error) {
      r.debug("WSL command error", { safe: { context: e }, sensitive: { error: n.error } });
      return;
    }
    if (n.status !== 0) {
      r.debug("WSL command non-zero exit", {
        safe: { context: e },
        sensitive: { status: n.status, stderr: n.stderr ?? "" },
      });
      return;
    }
    let o = n.stdout.trim();
    if (!o) {
      r.warning("WSL command returned empty output", { safe: { context: e }, sensitive: {} });
      return;
    }
    return o;
  } catch (n) {
    r.warning("WSL command unexpected error", { safe: { context: e }, sensitive: { error: n } });
    return;
  }
}
function owt(t) {
  let e = he(),
    r = "status",
    n = performance.now();
  try {
    (wj("wsl.exe", ["--status"], e), (r = "verbose-list"), (n = performance.now()));
    let o = wj("wsl.exe", ["--list", "--verbose"], e),
      i = Ewe(o),
      s = C0(o);
    ((r = "quiet-list"), (n = performance.now()));
    let a = s == null ? wj("wsl.exe", ["--list", "--quiet"], e) : "";
    return (
      e.info("[wsl] eligible distro list", {
        safe: {
          mode: "sync",
          lookupGeneration: t,
          result: s == null ? "fallback" : "default",
          eligibleCount: i.length,
        },
        sensitive: {},
      }),
      Hg === t && (R0 = i),
      s ?? Awe("", a)
    );
  } catch (o) {
    let i = o instanceof Error && o.cause != null ? o.cause : o,
      s = i != null && typeof i == "object" && "code" in i ? i.code : null,
      a = i != null && typeof i == "object" && "status" in i ? i.status : null,
      l = i != null && typeof i == "object" && "signal" in i ? i.signal : null;
    e.error("[wsl] error retrieving eligible distro", {
      safe: {
        stage: r,
        mode: "sync",
        lookupGeneration: t,
        elapsedMs: Math.round(performance.now() - n),
        timeoutMs: E0,
        code: s === "ETIMEDOUT" ? "ETIMEDOUT" : "other",
        exitStatus: typeof a == "number" ? a : null,
        signal: l === "SIGTERM" || l === "SIGKILL" ? l : null,
        retainedDistro: $a != null,
        retainedDistroCount: R0.length,
      },
      sensitive: { error: o },
    });
    return;
  }
}
async function iwt(t) {
  let e = he(),
    r = "status",
    n = performance.now();
  try {
    (await _j("wsl.exe", ["--status"], e), (r = "verbose-list"), (n = performance.now()));
    let o = await _j("wsl.exe", ["--list", "--verbose"], e),
      i = Ewe(o),
      s = C0(o);
    ((r = "quiet-list"), (n = performance.now()));
    let a = s == null ? await _j("wsl.exe", ["--list", "--quiet"], e) : "";
    return (
      e.info("[wsl] eligible distro list", {
        safe: {
          mode: "async",
          lookupGeneration: t,
          result: s == null ? "fallback" : "default",
          eligibleCount: i.length,
        },
        sensitive: {},
      }),
      Hg === t && (R0 = i),
      s ?? Awe("", a)
    );
  } catch (o) {
    let i = o instanceof Error && o.cause != null ? o.cause : o,
      s = i != null && typeof i == "object" && "code" in i ? i.code : null,
      a = i != null && typeof i == "object" && "status" in i ? i.status : null,
      l = i != null && typeof i == "object" && "signal" in i ? i.signal : null;
    e.error("[wsl] error retrieving eligible distro", {
      safe: {
        stage: r,
        mode: "async",
        lookupGeneration: t,
        elapsedMs: Math.round(performance.now() - n),
        timeoutMs: E0,
        code: s === "ETIMEDOUT" ? "ETIMEDOUT" : "other",
        exitStatus: typeof a == "number" ? a : null,
        signal: l === "SIGTERM" || l === "SIGKILL" ? l : null,
        retainedDistro: $a != null,
        retainedDistroCount: R0.length,
      },
      sensitive: { error: o },
    });
    return;
  }
}
function Awe(t, e) {
  let r = C0(t);
  return (
    r ||
    (e
      .split(
        `
`,
      )
      .map((n) => n.trim())
      .find((n) => n.toLowerCase().startsWith("ubuntu")) ??
      null)
  );
}
function wj(t, e, r) {
  r.debug("[execWindowsCommand] executing", {
    safe: { command: t, args: e.join(" ") },
    sensitive: {},
  });
  let n = (0, sm.execFileSync)(t, e, {
    timeout: E0,
    env: pn(process.env),
    windowsHide: !0,
    encoding: "buffer",
    maxBuffer: 1024 * 10,
  });
  return Rwe(n);
}
async function _j(t, e, r) {
  return (
    r.debug("[execWindowsCommand] executing", {
      safe: { command: t, args: e.join(" ") },
      sensitive: {},
    }),
    new Promise((n, o) => {
      (0, sm.execFile)(
        t,
        e,
        {
          timeout: E0,
          env: pn(process.env),
          windowsHide: !0,
          encoding: "buffer",
          maxBuffer: 1024 * 10,
        },
        (i, s) => {
          if (i != null) {
            o(new Error(i.message, { cause: i }));
            return;
          }
          n(Rwe(s));
        },
      );
    })
  );
}
function Rwe(t) {
  let e;
  if (Buffer.isBuffer(t)) {
    let r = t;
    if (r.length === 0) return "";
    if (r.length >= 2 && r[0] === 255 && r[1] === 254) e = r.subarray(2).toString("utf16le");
    else if (r.length >= 3 && r[0] === 239 && r[1] === 187 && r[2] === 191)
      e = r.subarray(3).toString("utf8");
    else {
      let n = Math.min(r.length - (r.length % 2), 256),
        o = !1;
      if (n > 0) {
        let i = 0,
          s = 0;
        for (let a = 0; a < n; a += 2) (s++, r[a + 1] === 0 && i++);
        o = s > 0 && i / s > 0.6;
      }
      e = o ? r.toString("utf16le") : r.toString("utf8");
    }
  } else e = t;
  return e
    .replace(/^\uFEFF/, "")
    .replace(
      /\r\n/g,
      `
`,
    )
    .trim();
}
function C0(t) {
  let e = t
    .split(
      `
`,
    )
    .map((n) => n.trim())
    .find((n) => n.startsWith("*"));
  if (!e) return null;
  let r = e
    .slice(1)
    .trim()
    .split(/\s{2,}|\t+/)[0];
  return r || null;
}
function Ewe(t) {
  let e = C0(t),
    r = t
      .split(
        `
`,
      )
      .slice(1)
      .map((n) => n.replace(/^\s*\*?\s*/, "").split(/\s{2,}|\t+/))
      .filter(([, , n]) => n === "2")
      .map(([n]) => n)
      .filter((n) => n != null);
  return e == null || !r.includes(e) ? r : [e, ...r.filter((n) => n !== e)];
}
function Cwe(t, e = jg()) {
  if (wu(t) || Ls(t)) return jp(t);
  if (Su(t)) return jp(kk(t));
  if (!t.startsWith("/") || e == null) return t;
  let r = t.replace(/^\/+/, "").replace(/\//g, "\\");
  return r.length === 0 ? `\\\\wsl$\\${e}\\` : `\\\\wsl$\\${e}\\${r}`;
}
var sm,
  A0,
  $a,
  R0,
  D_,
  Hg,
  im,
  Sj,
  bwe,
  ywe,
  E0,
  vwe,
  Ua = g(() => {
    sm = require("child_process");
    O();
    os();
    Bt();
    O();
    ((R0 = []), (Hg = 0), (Sj = 0), (bwe = "/usr/bin/bash"), (ywe = 3e4), (E0 = 3e3), (vwe = 3e4));
  });
function Xt({ preferWsl: t = !1 } = {}) {
  let e = he();
  if (t && process.platform === "win32") {
    let r = _we();
    if (r) return r;
    e.info(
      "[resolveCodexHome] Falling back to host home directory because WSL CODEX_HOME could not be resolved",
    );
  }
  return process.env.CODEX_HOME ?? Pwe.join(Twe.homedir(), ".codex");
}
var Twe,
  Pwe,
  Bn = g(() => {
    ((Twe = F(require("node:os"))), (Pwe = F(require("node:path"))));
    Bt();
    Ua();
  });
async function swt(t, e, r) {
  let n = "withFileTypes" in e,
    o = n ? r : e;
  if (o == null) throw new Error("fsUtils.readdir requires an ExecutionHost");
  let i = await o.readDirectory(t);
  return n ? i : i.map((s) => s.name);
}
async function Iwe(t, e = Number.POSITIVE_INFINITY) {
  let r = [],
    n = t.getReader(),
    o = 0;
  try {
    for (; o < e; ) {
      let { done: i, value: s } = await n.read();
      if (i) break;
      let a = Buffer.from(s.subarray(0, e - o));
      (r.push(a), (o += a.byteLength));
    }
    return Buffer.concat(r);
  } finally {
    (n.releaseLock(), o >= e && (await t.cancel()));
  }
}
var Qe,
  Gs = g(() => {
    O();
    Qe = {
      async readFile(t, e) {
        return new Response(await e.readFile(t)).text();
      },
      async readFileBase64(t, e) {
        return Iwe(await e.readFile(t));
      },
      async readFileSampleBytes(t, e, r) {
        let n =
          !e.isLocal && (await e.platformFamily()) === "windows"
            ? await Rue(e, t, r)
            : await e.readFile(t);
        return Iwe(n, r);
      },
      async writeFile(t, e, r) {
        await r.writeFile(t, e);
      },
      async writeFileBuffer(t, e, r) {
        await r.writeFile(t, e);
      },
      async mkdir(t, e = {}, r) {
        await r.createDirectory(t, e);
      },
      stat(t, e, { bypassCache: r = !1, followSymlinks: n = !0 } = {}) {
        return e.stat(t, { bypassCache: r, followSymlinks: n });
      },
      readdir: swt,
      async rm(t, e = {}, r) {
        await r.remove(t, e);
      },
      async copyFile(t, e, r, n = {}) {
        await r.copyFile(t, e, n);
      },
      async cp(t, e, r = {}, n) {
        await n.copy(t, e, r);
      },
    };
  });
async function kwe(t) {
  let e = tn(t.appServerClient.hostConfig)
      ? await t.appServerClient.codexHome()
      : Xt({ preferWsl: t.preferWsl }),
    r = await t.appServerClient.platformPath(),
    n = r.join(e, "AGENTS.md");
  await Qe.mkdir(r.dirname(n), { recursive: !0 }, t.appServerClient);
  try {
    await Qe.stat(n, t.appServerClient);
  } catch {
    await Qe.writeFile(n, "", t.appServerClient);
  }
  return n;
}
async function Dwe(t) {
  let e = await kwe(t),
    r = await Qe.readFile(e, t.appServerClient),
    n = await t.appServerClient.platformPath(),
    o = n.join(n.dirname(e), "AGENTS.override.md"),
    i = !1;
  try {
    i = !!(await Qe.readFile(o, t.appServerClient)).trim();
  } catch (s) {
    if (!bt(s)) throw s;
  }
  return { path: e, contents: r, hasOverride: i };
}
async function Mwe(t, e) {
  let r = await kwe(e);
  return (await Qe.writeFile(r, t, e.appServerClient), { path: r });
}
var Aj = g(() => {
  O();
  Bn();
  Gs();
});
var awt,
  O_,
  Rj = g(() => {
    ((awt =
      /^(\d{4}-\d{2}-\d{2})?[T ]?(?:(\d{2}):\d{2}(?::\d{2}(?:\.\d+)?)?)?(Z|[-+]\d{2}:\d{2})?$/i),
      (O_ = class t extends Date {
        #e = !1;
        #t = !1;
        #r = null;
        constructor(e) {
          let r = !0,
            n = !0,
            o = "Z";
          if (typeof e == "string") {
            let i = e.match(awt);
            i
              ? (i[1] || ((r = !1), (e = `0000-01-01T${e}`)),
                (n = !!i[2]),
                n && e[10] === " " && (e = e.replace(" ", "T")),
                i[2] && +i[2] > 23
                  ? (e = "")
                  : ((o = i[3] || null), (e = e.toUpperCase()), !o && n && (e += "Z")))
              : (e = "");
          }
          (super(e), isNaN(this.getTime()) || ((this.#e = r), (this.#t = n), (this.#r = o)));
        }
        isDateTime() {
          return this.#e && this.#t;
        }
        isLocal() {
          return !this.#e || !this.#t || !this.#r;
        }
        isDate() {
          return this.#e && !this.#t;
        }
        isTime() {
          return this.#t && !this.#e;
        }
        isValid() {
          return this.#e || this.#t;
        }
        toISOString() {
          let e = super.toISOString();
          if (this.isDate()) return e.slice(0, 10);
          if (this.isTime()) return e.slice(11, 23);
          if (this.#r === null) return e.slice(0, -1);
          if (this.#r === "Z") return e;
          let r = +this.#r.slice(1, 3) * 60 + +this.#r.slice(4, 6);
          return (
            (r = this.#r[0] === "-" ? r : -r),
            new Date(this.getTime() - r * 6e4).toISOString().slice(0, -1) + this.#r
          );
        }
        static wrapAsOffsetDateTime(e, r = "Z") {
          let n = new t(e);
          return ((n.#r = r), n);
        }
        static wrapAsLocalDateTime(e) {
          let r = new t(e);
          return ((r.#r = null), r);
        }
        static wrapAsLocalDate(e) {
          let r = new t(e);
          return ((r.#t = !1), (r.#r = null), r);
        }
        static wrapAsLocalTime(e) {
          let r = new t(e);
          return ((r.#e = !1), (r.#r = null), r);
        }
      }));
  });
function lwt(t, e) {
  let r = t.slice(0, e).split(/\r\n|\n|\r/g);
  return [r.length, r.pop().length + 1];
}
function cwt(t, e, r) {
  let n = t.split(/\r\n|\n|\r/g),
    o = "",
    i = (Math.log10(e + 1) | 0) + 1;
  for (let s = e - 1; s <= e + 1; s++) {
    let a = n[s - 1];
    a &&
      ((o += s.toString().padEnd(i, " ")),
      (o += ":  "),
      (o += a),
      (o += `
`),
      s === e &&
        ((o += " ".repeat(i + r + 2)),
        (o += `^
`)));
  }
  return o;
}
var ft,
  am = g(() => {
    ft = class extends Error {
      line;
      column;
      codeblock;
      constructor(e, r) {
        let [n, o] = lwt(r.toml, r.ptr),
          i = cwt(r.toml, n, o);
        (super(
          `Invalid TOML document: ${e}

${i}`,
          r,
        ),
          (this.line = n),
          (this.column = o),
          (this.codeblock = i));
      }
    };
  });
function T0(t, e) {
  let r = t[e++],
    n = r,
    o = r === "'",
    i = r === t[e] && r === t[e + 1];
  i &&
    (t[(e += 2)] ===
    `
`
      ? e++
      : t[e] === "\r" &&
        t[e + 1] ===
          `
` &&
        (e += 2));
  let s = "",
    a = e,
    l = 0;
  for (let c = e; c < t.length; c++)
    if (
      ((r = t[c]),
      i &&
        (r ===
          `
` ||
          (r === "\r" &&
            t[c + 1] ===
              `
`)))
    )
      l = l && 3;
    else {
      if ((r < " " && r !== "	") || r === "\x7F")
        throw new ft("control characters are not allowed in strings", { toml: t, ptr: c });
      if ((!l || l === 3) && r === n && (!i || (t[c + 1] === n && t[c + 2] === n)))
        return (
          i && (t[c + 3] === n && c++, t[c + 3] === n && c++),
          [l ? s : s + t.slice(a, c), c + (i ? 3 : 1)]
        );
      if (!l) !o && r === "\\" && ((s += t.slice(a, (a = c))), (l = 1));
      else if (l === 1)
        if (r === "x" || r === "u" || r === "U") {
          let u = 0,
            p = r === "x" ? 2 : r === "u" ? 4 : 8;
          for (let m = 0; m < p; m++, c++) {
            let f = t.charCodeAt(c + 1),
              h =
                f >= 48 && f <= 57
                  ? f - 48
                  : f >= 65 && f <= 70
                    ? f - 65 + 10
                    : f >= 97 && f <= 102
                      ? f - 97 + 10
                      : -1;
            if (h < 0)
              throw new ft("invalid non-hex character in unicode escape", { toml: t, ptr: c + 1 });
            u = (u << 4) | h;
          }
          if (u < 0 || u > 1114111 || (u >= 55296 && u <= 57343))
            throw new ft("invalid unicode escape", { toml: t, ptr: c });
          ((s += String.fromCodePoint(u)), (a = c + 1), (l = 0));
        } else if (r === " " || r === "	") l = 2;
        else {
          if (r === "b") s += "\b";
          else if (r === "t") s += "	";
          else if (r === "n")
            s += `
`;
          else if (r === "f") s += "\f";
          else if (r === "r") s += "\r";
          else if (r === "e") s += "\x1B";
          else if (r === '"') s += '"';
          else if (r === "\\") s += "\\";
          else throw new ft("unrecognized escape sequence", { toml: t, ptr: c });
          ((a = c + 1), (l = 0));
        }
      else if (r !== " " && r !== "	") {
        if (l === 2)
          throw new ft("invalid escape: only line-ending whitespace may be escaped", {
            toml: t,
            ptr: a,
          });
        ((l = !o && r === "\\" ? 1 : 0), (a = c));
      }
    }
  throw new ft("unfinished string", { toml: t, ptr: e });
}
function Owe(t, e, r, n) {
  if (t === "true") return !0;
  if (t === "false") return !1;
  if (t === "-inf") return -1 / 0;
  if (t === "inf" || t === "+inf") return 1 / 0;
  if (t === "nan" || t === "+nan" || t === "-nan") return NaN;
  if (t === "-0") return n ? 0n : 0;
  let o = uwt.test(t);
  if (o || dwt.test(t)) {
    if (pwt.test(t)) throw new ft("leading zeroes are not allowed", { toml: e, ptr: r });
    t = t.replace(/_/g, "");
    let s = +t;
    if (isNaN(s)) throw new ft("invalid number", { toml: e, ptr: r });
    if (o) {
      if ((o = !Number.isSafeInteger(s)) && !n)
        throw new ft("integer value cannot be represented losslessly", { toml: e, ptr: r });
      (o || n === !0) && (s = BigInt(t));
    }
    return s;
  }
  let i = new O_(t);
  if (!i.isValid()) throw new ft("invalid value", { toml: e, ptr: r });
  return i;
}
var uwt,
  dwt,
  pwt,
  Ej = g(() => {
    Rj();
    am();
    ((uwt = /^((0x[0-9a-fA-F](_?[0-9a-fA-F])*)|(([+-]|0[ob])?\d(_?\d)*))$/),
      (dwt = /^[+-]?\d(_?\d)*(\.\d(_?\d)*)?([eE][+-]?\d(_?\d)*)?$/),
      (pwt = /^[+-]?0[0-9_]/));
  });
function P0(t, e = 0, r = t.length) {
  let n = t.indexOf(
    `
`,
    e,
  );
  return (t[n - 1] === "\r" && n--, n <= r ? n : -1);
}
function zg(t, e) {
  for (let r = e; r < t.length; r++) {
    let n = t[r];
    if (
      n ===
      `
`
    )
      return r;
    if (
      n === "\r" &&
      t[r + 1] ===
        `
`
    )
      return r + 1;
    if ((n < " " && n !== "	") || n === "\x7F")
      throw new ft("control characters are not allowed in comments", { toml: t, ptr: e });
  }
  return t.length;
}
function qa(t, e, r, n) {
  let o;
  for (;;) {
    for (
      ;
      (o = t[e]) === " " ||
      o === "	" ||
      (!r &&
        (o ===
          `
` ||
          (o === "\r" &&
            t[e + 1] ===
              `
`)));

    )
      e++;
    if (n || o !== "#") break;
    e = zg(t, e);
  }
  return e;
}
function Nwe(t, e, r, n, o = !1) {
  if (!n) return ((e = P0(t, e)), e < 0 ? t.length : e);
  for (let i = e; i < t.length; i++) {
    let s = t[i];
    if (s === "#") i = P0(t, i);
    else {
      if (s === r) return i + 1;
      if (
        s === n ||
        (o &&
          (s ===
            `
` ||
            (s === "\r" &&
              t[i + 1] ===
                `
`)))
      )
        return i;
    }
  }
  throw new ft("cannot find end of structure", { toml: t, ptr: e });
}
var I0 = g(() => {
  am();
});
function mwt(t, e, r) {
  let n = t.slice(e, r),
    o = n.indexOf("#");
  return (o > -1 && (zg(t, o), (n = n.slice(0, o))), [n.trimEnd(), o]);
}
function N_(t, e, r, n, o) {
  if (n === 0)
    throw new ft("document contains excessively nested structures. aborting.", { toml: t, ptr: e });
  let i = t[e];
  if (i === "[" || i === "{") {
    let [l, c] = i === "[" ? Bwe(t, e, n, o) : Lwe(t, e, n, o);
    if (r) {
      if (((c = qa(t, c)), t[c] === ",")) c++;
      else if (t[c] !== r) throw new ft("expected comma or end of structure", { toml: t, ptr: c });
    }
    return [l, c];
  }
  if (i === '"' || i === "'") {
    let [l, c] = T0(t, e);
    if (r) {
      if (
        ((c = qa(t, c)),
        t[c] &&
          t[c] !== "," &&
          t[c] !== r &&
          t[c] !==
            `
` &&
          t[c] !== "\r")
      )
        throw new ft("unexpected character encountered", { toml: t, ptr: c });
      t[c] === "," && c++;
    }
    return [l, c];
  }
  let s = Nwe(t, e, ",", r),
    a = mwt(t, e, s - (t[s - 1] === "," ? 1 : 0));
  if (!a[0])
    throw new ft("incomplete key-value declaration: no value specified", { toml: t, ptr: e });
  return (r && a[1] > -1 && ((s = qa(t, e + a[1])), t[s] === "," && s++), [Owe(a[0], t, e, o), s]);
}
var Cj = g(() => {
  Ej();
  Tj();
  I0();
  am();
});
function k0(t, e, r = "=") {
  let n = e - 1,
    o = [],
    i = t.indexOf(r, e);
  if (i < 0) throw new ft("incomplete key-value: cannot find end of key", { toml: t, ptr: e });
  do {
    let s = t[(e = ++n)];
    if (s !== " " && s !== "	")
      if (s === '"' || s === "'") {
        if (s === t[e + 1] && s === t[e + 2])
          throw new ft("multiline strings are not allowed in keys", { toml: t, ptr: e });
        let [a, l] = T0(t, e);
        n = t.indexOf(".", l);
        let c = t.slice(l, n < 0 || n > i ? i : n),
          u = P0(c);
        if (u > -1) throw new ft("newlines are not allowed in keys", { toml: t, ptr: e + n + u });
        if (c.trimStart())
          throw new ft("found extra tokens after the string part", { toml: t, ptr: l });
        if (i < l && ((i = t.indexOf(r, l)), i < 0))
          throw new ft("incomplete key-value: cannot find end of key", { toml: t, ptr: e });
        o.push(a);
      } else {
        n = t.indexOf(".", e);
        let a = t.slice(e, n < 0 || n > i ? i : n);
        if (!fwt.test(a))
          throw new ft("only letter, numbers, dashes and underscores are allowed in keys", {
            toml: t,
            ptr: e,
          });
        o.push(a.trimEnd());
      }
  } while (n + 1 && n < i);
  return [o, qa(t, i + 1, !0, !0)];
}
function Lwe(t, e, r, n) {
  let o = {},
    i = new Set(),
    s;
  for (e++; (s = t[e++]) !== "}" && s; ) {
    if (s === ",") throw new ft("expected value, found comma", { toml: t, ptr: e - 1 });
    if (s === "#") e = zg(t, e);
    else if (
      s !== " " &&
      s !== "	" &&
      s !==
        `
` &&
      s !== "\r"
    ) {
      let a,
        l = o,
        c = !1,
        [u, p] = k0(t, e - 1);
      for (let h = 0; h < u.length; h++) {
        if (
          (h && (l = c ? l[a] : (l[a] = {})),
          (a = u[h]),
          (c = Object.hasOwn(l, a)) && (typeof l[a] != "object" || i.has(l[a])))
        )
          throw new ft("trying to redefine an already defined value", { toml: t, ptr: e });
        !c &&
          a === "__proto__" &&
          Object.defineProperty(l, a, { enumerable: !0, configurable: !0, writable: !0 });
      }
      if (c) throw new ft("trying to redefine an already defined value", { toml: t, ptr: e });
      let [m, f] = N_(t, p, "}", r - 1, n);
      (i.add(m), (l[a] = m), (e = f));
    }
  }
  if (!s) throw new ft("unfinished table encountered", { toml: t, ptr: e });
  return [o, e];
}
function Bwe(t, e, r, n) {
  let o = [],
    i;
  for (e++; (i = t[e++]) !== "]" && i; ) {
    if (i === ",") throw new ft("expected value, found comma", { toml: t, ptr: e - 1 });
    if (i === "#") e = zg(t, e);
    else if (
      i !== " " &&
      i !== "	" &&
      i !==
        `
` &&
      i !== "\r"
    ) {
      let s = N_(t, e - 1, "]", r - 1, n);
      (o.push(s[0]), (e = s[1]));
    }
  }
  if (!i) throw new ft("unfinished array encountered", { toml: t, ptr: e });
  return [o, e];
}
var fwt,
  Tj = g(() => {
    Ej();
    Cj();
    I0();
    am();
    fwt = /^[a-zA-Z0-9-_]+[ \t]*$/;
  });
function Fwe(t, e, r, n) {
  let o = e,
    i = r,
    s,
    a = !1,
    l;
  for (let c = 0; c < t.length; c++) {
    if (c) {
      if (((o = a ? o[s] : (o[s] = {})), (i = (l = i[s]).c), n === 0 && (l.t === 1 || l.t === 2)))
        return null;
      if (l.t === 2) {
        let u = o.length - 1;
        ((o = o[u]), (i = i[u].c));
      }
    }
    if (((s = t[c]), (a = Object.hasOwn(o, s)) && i[s]?.t === 0 && i[s]?.d)) return null;
    a ||
      (s === "__proto__" &&
        (Object.defineProperty(o, s, { enumerable: !0, configurable: !0, writable: !0 }),
        Object.defineProperty(i, s, { enumerable: !0, configurable: !0, writable: !0 })),
      (i[s] = { t: c < t.length - 1 && n === 2 ? 3 : n, d: !1, i: 0, c: {} }));
  }
  if (
    ((l = i[s]),
    (l.t !== n && !(n === 1 && l.t === 3)) ||
      (n === 2 &&
        (l.d || ((l.d = !0), (o[s] = [])),
        o[s].push((o = {})),
        (l.c[l.i++] = l = { t: 1, d: !1, i: 0, c: {} })),
      l.d))
  )
    return null;
  if (((l.d = !0), n === 1)) o = a ? o[s] : (o[s] = {});
  else if (n === 0 && a) return null;
  return [s, o, l.c];
}
function Vg(t, { maxDepth: e = 1e3, integersAsBigInt: r } = {}) {
  let n = {},
    o = {},
    i = n,
    s = o;
  for (let a = qa(t, 0); a < t.length; ) {
    if (t[a] === "[") {
      let l = t[++a] === "[",
        c = k0(t, (a += +l), "]");
      if (l) {
        if (t[c[1] - 1] !== "]")
          throw new ft("expected end of table declaration", { toml: t, ptr: c[1] - 1 });
        c[1]++;
      }
      let u = Fwe(c[0], n, o, l ? 2 : 1);
      if (!u)
        throw new ft("trying to redefine an already defined table or value", { toml: t, ptr: a });
      ((s = u[2]), (i = u[1]), (a = c[1]));
    } else {
      let l = k0(t, a),
        c = Fwe(l[0], i, s, 0);
      if (!c)
        throw new ft("trying to redefine an already defined table or value", { toml: t, ptr: a });
      let u = N_(t, l[1], void 0, e, r);
      ((c[1][c[0]] = u[0]), (a = u[1]));
    }
    if (
      ((a = qa(t, a, !0)),
      t[a] &&
        t[a] !==
          `
` &&
        t[a] !== "\r")
    )
      throw new ft("each key-value declaration must be followed by an end-of-line", {
        toml: t,
        ptr: a,
      });
    a = qa(t, a);
  }
  return n;
}
var $we = g(() => {
  Tj();
  Cj();
  I0();
  am();
});
var Uwe = g(() => {});
var D0 = g(() => {
  $we();
  Uwe();
  Rj();
  am();
});
async function qwe(t, e) {
  let r = [];
  for (let n of t)
    if (n)
      try {
        (await Qe.stat(n, e)).isDirectory() && r.push(n);
      } catch {
        continue;
      }
  return r;
}
async function M0(t, e) {
  if (t.length === 0) return [];
  let n = t.some((i) => pu(i) !== i) && (await e.platformFamily()) === "windows",
    o = [];
  for (let i of t)
    if (i)
      try {
        (await Qe.stat(n ? pu(i) : i, e), o.push(i));
      } catch {
        continue;
      }
  return o;
}
var Pj = g(() => {
  O();
  Gs();
});
async function Gwe({ roots: t, preferWsl: e = !1, appServerClient: r }) {
  let n = tn(r.hostConfig) ? await r.codexHome() : Xt({ preferWsl: e }),
    o = await r.platformPath(),
    i = Array.from(new Set([n, ...t.map((l) => o.join(l, ".codex"))])),
    s = new Map(),
    a = await Promise.all(i.map(async (l) => ywt({ codexRoot: l, appServerClient: r })));
  for (let l of a)
    for (let c of l) {
      let u = s.get(c.roleName);
      s.set(c.roleName, u == null ? c : Hwe(c, u));
    }
  return { agents: Array.from(s.values()).sort((l, c) => l.roleName.localeCompare(c.roleName)) };
}
async function ywt({ codexRoot: t, appServerClient: e }) {
  let r = await e.platformPath(),
    n = r.join(t, "config.toml"),
    o = r.join(t, "agents"),
    [i, s] = await Promise.all([M0([n], e), qwe([o], e)]),
    a = new Map(),
    l = new Set();
  if (i.length > 0) {
    let c = await vwt({ configPath: n, appServerClient: e });
    for (let u of c) (u.configFile != null && l.add(u.configFile), a.set(u.roleName, u));
  }
  if (s.length > 0) {
    let c = await bwt({ agentsDir: o, declaredConfigFiles: l, appServerClient: e });
    for (let u of c) a.set(u.roleName, u);
  }
  return Array.from(a.values());
}
async function vwt({ configPath: t, appServerClient: e }) {
  let r = await jwe(t, e);
  if (r == null) return [];
  let n = Reflect.get(r, "agents");
  if (n == null || typeof n != "object") return [];
  let o = await e.platformPath(),
    i = o.dirname(t);
  return (
    await Promise.all(
      Object.entries(n).map(async ([s, a]) => {
        let l = hwt.safeParse(a);
        if (!l.success) return null;
        let c = {
          roleName: s,
          description: l.data.description,
          configFile: l.data.config_file == null ? null : o.resolve(i, l.data.config_file),
          nicknameCandidates: l.data.nickname_candidates,
        };
        if (c.configFile == null) return c;
        let u = await Wwe({ filePath: c.configFile, roleNameHint: s, appServerClient: e });
        return u == null ? c : Hwe(u, c);
      }),
    )
  ).flatMap((s) => (s == null ? [] : [s]));
}
async function bwt({ agentsDir: t, declaredConfigFiles: e, appServerClient: r }) {
  let n = await r.platformPath(),
    o = await Qe.readdir(t, r);
  return (
    await Promise.all(
      o
        .filter((i) => i.endsWith(".toml"))
        .map(async (i) => {
          let s = n.join(t, i);
          return e.has(s) ? null : Wwe({ filePath: s, roleNameHint: null, appServerClient: r });
        }),
    )
  ).flatMap((i) => (i == null ? [] : [i]));
}
async function Wwe({ filePath: t, roleNameHint: e, appServerClient: r }) {
  let n = await jwe(t, r),
    o = gwt.safeParse(n);
  if (!o.success) return null;
  let i = o.data.name?.trim() || e?.trim() || "";
  return i.length === 0
    ? null
    : {
        roleName: i,
        description: o.data.description,
        configFile: t,
        nicknameCandidates: o.data.nickname_candidates,
      };
}
function Hwe(t, e) {
  return {
    roleName: t.roleName,
    description: t.description ?? e.description,
    configFile: t.configFile ?? e.configFile,
    nicknameCandidates:
      t.nicknameCandidates.length > 0 ? t.nicknameCandidates : e.nicknameCandidates,
  };
}
async function jwe(t, e) {
  try {
    let r = Vg(await Qe.readFile(t, e));
    return r == null || typeof r != "object" ? null : r;
  } catch {
    return null;
  }
}
var hwt,
  gwt,
  zwe = g(() => {
    O();
    D0();
    $();
    Bn();
    Gs();
    Pj();
    ((hwt = d
      .object({
        description: d
          .string()
          .nullish()
          .transform((t) => t ?? null),
        config_file: d
          .string()
          .nullish()
          .transform((t) => t ?? null),
        nickname_candidates: d
          .array(d.string())
          .nullish()
          .transform((t) => t ?? []),
      })
      .strip()),
      (gwt = d
        .object({
          name: d.string().nullish(),
          description: d
            .string()
            .nullish()
            .transform((t) => t ?? null),
          nickname_candidates: d
            .array(d.string())
            .nullish()
            .transform((t) => t ?? []),
        })
        .loose()));
  });
var O0,
  Vwe = g(() => {
    ot();
    zwe();
    O0 = class extends ee {
      constructor(r) {
        super();
        this.getOptions = r;
      }
      list(r) {
        return Gwe({ ...this.getOptions(), roots: r });
      }
    };
  });
var Bu = A((kxr, Kwe) => {
  var Swt = pI(),
    wwt = IG(),
    _wt = JI(),
    xwt = Math.ceil,
    Awt = Math.max;
  function Rwt(t, e, r) {
    (r ? wwt(t, e, r) : e === void 0) ? (e = 1) : (e = Awt(_wt(e), 0));
    var n = t == null ? 0 : t.length;
    if (!n || e < 1) return [];
    for (var o = 0, i = 0, s = Array(xwt(n / e)); o < n; ) s[i++] = Swt(t, o, (o += e));
    return s;
  }
  Kwe.exports = Rwt;
});
var Mxr,
  Ij = g(() => {
    Bt();
    Mxr = Ie("ambient-suggestions");
  });
var kj = g(() => {});
var Zwe = g(() => {
  kj();
});
var Xwe = g(() => {});
function Dj(t) {
  return (
    (N0 = t),
    () => {
      N0 === t && (N0 = null);
    }
  );
}
function Fu({
  feature: t,
  firstTokenUsage: e,
  model: r,
  reasoningEffort: n,
  serviceTier: o,
  status: i,
  tokenUsage: s,
}) {
  if (s == null) return;
  let a = (c) => s.total[c] - (e == null ? 0 : e.total[c] - e.last[c]),
    l = {
      feature: t,
      model: r,
      reasoningEffort: n,
      serviceTier: o,
      status: i,
      inputTokens: a("inputTokens"),
      cachedInputTokens: a("cachedInputTokens"),
      outputTokens: a("outputTokens"),
      reasoningOutputTokens: a("reasoningOutputTokens"),
      totalTokens: a("totalTokens"),
    };
  (Ewt().info("ephemeral_generation_token_usage", {
    safe: { event: "ephemeral_generation_token_usage", ...l },
  }),
    N0?.(l));
}
var Ewt,
  N0,
  Kg = g(() => {
    Bt();
    ((Ewt = Ie("ephemeral-generation")), (N0 = null));
  });
async function Mj({
  responseSchema: t,
  prompt: e,
  imageUrls: r,
  threadId: n,
  turnTrigger: o,
  responsesapiClientMetadata: i,
  serviceTier: s,
  schema: a,
  timeoutMs: l,
  client: c,
  onTokenUsage: u,
  onText: p,
  onTurnCompleted: m,
  signal: f,
  experimentalPredictionMode: h = !1,
  effort: v,
}) {
  let y = null,
    w = null,
    _ = null,
    S = !1,
    E = !1,
    T = () => {},
    P = () => {
      E ||
        y == null ||
        c.interruptTurn == null ||
        ((E = !0), c.interruptTurn({ threadId: n, turnId: y }).catch(() => {}));
    },
    L = new Promise((V, de) => {
      let ue = () => {
          ((S = !0), T(), P(), de(new DOMException("The operation was aborted", "AbortError")));
        },
        Ae = setTimeout(() => {
          ((S = !0), T(), P(), de(new Error("Timed out waiting for structured result.")));
        }, l),
        ge = c.registerInternalNotificationHandler((Pe) => {
          switch (Pe.method) {
            case "error": {
              let Q = Pe.params;
              if (Q.threadId !== n || (y != null && Q.turnId !== y)) return;
              ((y = y ?? Q.turnId), (_ = Q.error));
              return;
            }
            case "turn/started": {
              let Q = Pe.params;
              if (Q.threadId !== n) return;
              y = Q.turn.id;
              return;
            }
            case "thread/tokenUsage/updated": {
              let Q = Pe.params;
              if (Q.threadId !== n || (y != null && Q.turnId !== y)) return;
              u?.(Q.tokenUsage);
              return;
            }
            case "item/agentMessage/delta": {
              let Q = Pe.params;
              if (Q.threadId !== n) return;
              if (Q.turnId == null) {
                if (y != null) return;
              } else if (y != null && Q.turnId !== y) return;
              ((w = `${w ?? ""}${Q.delta}`), p?.(w));
              return;
            }
            case "item/completed": {
              let Q = Pe.params;
              if (Q.threadId !== n) return;
              if (Q.turnId == null) {
                if (y != null) return;
              } else if (y != null && Q.turnId !== y) return;
              Q.item.type === "agentMessage" && ((w = Q.item.text), p?.(w));
              return;
            }
            case "turn/completed": {
              let Q = Pe.params;
              if (Q.threadId !== n || (y != null && Q.turn.id !== y)) return;
              if (((y = Q.turn.id), Q.turn.status !== "completed")) {
                T();
                let X = Q.turn.error ?? _;
                de(new Error(Twt(Q.turn.status, X), { cause: X?.codexErrorInfo }));
                return;
              }
              (T(), m?.({ turnId: Q.turn.id, durationMs: Q.turn.durationMs }), V(Cwt(w, t)));
              return;
            }
            default:
              return;
          }
        });
      ((T = () => {
        (clearTimeout(Ae), f?.removeEventListener("abort", ue), ge(), (T = () => {}));
      }),
        f?.addEventListener("abort", ue, { once: !0 }),
        f?.aborted && ue());
    }).then((V) => ({ type: "result", value: V }));
  try {
    if (f?.aborted) return (await L).value;
    let V = c
        .startTurn({
          threadId: n,
          turnTrigger: o,
          responsesapiClientMetadata: i,
          clientUserMessageId: globalThis.crypto.randomUUID(),
          input: [
            { type: "text", text: e, text_elements: [] },
            ...(r ?? []).map((ue) => ({ type: "image", url: ue })),
          ],
          ...(h
            ? { effort: v }
            : {
                cwd: null,
                approvalPolicy: null,
                permissions: ":read-only",
                runtimeWorkspaceRoots: [],
                model: null,
                effort: null,
                serviceTier: s ?? null,
                summary: Vye,
                personality: null,
                collaborationMode: null,
              }),
          outputSchema: a,
        })
        .then((ue) => ((y = ue.turn.id), S && P(), { type: "started" })),
      de = await Promise.race([V, L]);
    return de.type === "result" ? de.value : (await L).value;
  } catch (V) {
    throw (T(), V);
  }
}
function Cwt(t, e) {
  let r = t?.trim();
  if (!r) return null;
  let n;
  try {
    n = JSON.parse(r);
  } catch {
    return null;
  }
  let o = e.safeParse(n);
  return o.success ? o.data : null;
}
function Twt(t, e) {
  let r = [e?.message, e?.additionalDetails].filter((n) => n != null && n.length > 0).join(" ");
  return t === "failed"
    ? r.length > 0
      ? `Structured turn failed: ${r}`
      : "Structured turn failed."
    : t === "interrupted"
      ? r.length > 0
        ? `Structured turn was interrupted: ${r}`
        : "Structured turn was interrupted."
      : r.length > 0
        ? `Structured turn ended with status ${t}: ${r}`
        : `Structured turn ended with status ${t}.`;
}
var L0 = g(() => {
  O();
});
var B0 = g(() => {
  L0();
});
var Oj = g(() => {});
function Bo(t) {
  return JSON.parse(JSON.stringify(d.toJSONSchema(t)));
}
var lm = g(() => {
  $();
});
var nAr,
  kwt,
  oAr,
  Ywe = g(() => {
    dw();
    $();
    Xwe();
    Kg();
    B0();
    Oj();
    lm();
    ((nAr = 2 * 6e4),
      (kwt = d.object({
        exclude: d.array(d.object({ id: d.string().min(1), reason: d.string().min(1) })),
      })),
      (oAr = Bo(kwt)));
  });
function Zg(t) {
  let e = t?.split(".", 3)[1];
  if (e == null) return null;
  try {
    let r = Dwt.parse(JSON.parse(Buffer.from(e, "base64url").toString("utf8"))),
      n = r["https://api.openai.com/auth"],
      o = n.chatgpt_account_id ?? n.account_id,
      i = n.user_id ?? n.chatgpt_user_id;
    return o == null || i == null ? null : { accountId: o, userId: i, expiresAtMs: r.exp * 1e3 };
  } catch {
    return null;
  }
}
var aAr,
  lAr,
  cAr,
  Dwt,
  cm = g(() => {
    $();
    ((aAr = 5 * 6e4),
      (lAr = d.object({ exp: d.number() })),
      (cAr = d.object({
        "https://api.openai.com/auth": d.object({
          chatgpt_account_id: d.string().optional(),
          chatgpt_account_is_fedramp: d.boolean().optional(),
        }),
      })),
      (Dwt = d.object({
        exp: d.number().int().positive(),
        "https://api.openai.com/auth": d.object({
          account_id: d.string().min(1).optional(),
          chatgpt_account_id: d.string().min(1).optional(),
          chatgpt_user_id: d.string().min(1).optional(),
          user_id: d.string().min(1).optional(),
        }),
      })));
  });
var Owt,
  MAr,
  OAr,
  Nj,
  Nwt,
  Jwe,
  NAr,
  LAr,
  Lwt,
  BAr,
  Bwt,
  FAr,
  e_e = g(() => {
    Owt = F(Bu());
    O();
    dw();
    $();
    Ij();
    kj();
    Zwe();
    Ywe();
    cm();
    _u();
    Bn();
    Kg();
    B0();
    lm();
    ((MAr = 10 * 6e4),
      (OAr = d.object({ personalization_toggle_blurb: d.unknown().nullable().optional() }).loose()),
      (Nj = d.lazy(() =>
        d.union([
          d.string(),
          d.number(),
          d.boolean(),
          d.null(),
          d.array(Nj),
          d.record(d.string(), Nj),
        ]),
      )),
      (Nwt = d.record(d.string(), Nj)),
      (Jwe = d.record(d.string(), Nwt)),
      (NAr = d.union([
        d
          .object({ mcpServers: Jwe })
          .loose()
          .transform(({ mcpServers: t }) => t),
        Jwe,
      ])),
      (LAr = d.object({ mcpServers: d.string().trim().min(1) }).loose()),
      (Lwt = d.object({
        title: d.string().min(1),
        description: d.string().min(1),
        prompt: d.string().min(1),
        appId: d.string(),
        pluginId: d.string().nullable(),
      })),
      (BAr = d.object({ items: d.array(WW) })),
      (Bwt = d.object({ suggestions: d.array(Lwt).max(3) })),
      (FAr = Bo(Bwt)));
  });
var t_e = g(() => {
  "use strict";
  dg();
  HS();
});
var L_,
  Lj = g(() => {
    L_ = {
      id: "20260902130908_create_live_visualization_suggestions",
      operations: [
        {
          kind: "exec",
          sql: `CREATE TABLE IF NOT EXISTS live_visualization_suggestions (
          account_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          host_id TEXT NOT NULL,
          thread_id TEXT NOT NULL,
          id TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'dismissed')),
          submission TEXT CHECK (submission IN ('submitted', 'accepted')),
          PRIMARY KEY (account_id, user_id, host_id, thread_id)
        ) WITHOUT ROWID`,
        },
      ],
    };
  });
function Se(t, e, r) {
  return { kind: "addColumnIfMissing", table: t, column: e, columnDefinition: r };
}
var gr = g(() => {});
var Bj,
  r_e = g(() => {
    gr();
    Bj = {
      id: "20260906120000_add_chatgpt_async_status_to_catalog",
      operations: [
        Se("local_thread_catalog", "chatgpt_async_status", "INTEGER"),
        {
          kind: "exec",
          sql: `UPDATE local_thread_catalog_sync_state
          SET last_full_reconciled_at = NULL
          WHERE host_id IN (
            SELECT host_id FROM local_thread_catalog_hosts
            WHERE host_kind = 'chatgpt'
          );
          DELETE FROM local_thread_catalog_scan_checkpoints
          WHERE host_id IN (
            SELECT host_id FROM local_thread_catalog_hosts
            WHERE host_kind = 'chatgpt'
          )`,
        },
      ],
    };
  });
var Fj,
  n_e = g(() => {
    gr();
    Fj = {
      id: "20260914140000_add_local_thread_catalog_trial_conversation_type",
      operations: [
        Se("local_thread_catalog", "trial_conversation_type", "TEXT"),
        {
          kind: "exec",
          sql: `UPDATE local_thread_catalog_sync_state
          SET last_full_reconciled_at = NULL
          WHERE host_id IN (
            SELECT host_id FROM local_thread_catalog_hosts
            WHERE host_kind = 'chatgpt'
          );
          DELETE FROM local_thread_catalog_scan_checkpoints
          WHERE host_id IN (
            SELECT host_id FROM local_thread_catalog_hosts
            WHERE host_kind = 'chatgpt'
          )`,
        },
      ],
    };
  });
var $j,
  o_e = g(() => {
    gr();
    $j = {
      id: "20260924180000_add_automation_auto_archive",
      operations: [Se("automations", "auto_archive", "INTEGER NOT NULL DEFAULT 0")],
    };
  });
var Uj,
  i_e = g(() => {
    gr();
    Uj = {
      id: "20261002020000_add_automation_next_run_nominal_at",
      operations: [Se("automations", "next_run_nominal_at", "INTEGER")],
    };
  });
var qj,
  s_e = g(() => {
    Lj();
    qj = {
      id: "20261013185532_add_live_visualization_suggestion_turn",
      operations: [
        ...L_.operations,
        {
          kind: "addColumnIfMissing",
          table: "live_visualization_suggestions",
          column: "turn_id",
          columnDefinition: "TEXT",
        },
      ],
    };
  });
var Gj,
  a_e = g(() => {
    Gj = {
      id: "20261014044905_add_live_visualization_creation_turn",
      operations: [
        {
          kind: "addColumnIfMissing",
          table: "live_visualization_suggestions",
          column: "creation_turn_id",
          columnDefinition: "TEXT",
        },
      ],
    };
  });
var Wj,
  l_e = g(() => {
    Wj = {
      id: "20261028065000_create_active_chat_turns",
      operations: [
        {
          kind: "exec",
          sql: `CREATE TABLE IF NOT EXISTS active_chat_turns (
      profile TEXT NOT NULL,
      account_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      thread_id TEXT NOT NULL,
      launch_id TEXT NOT NULL,
      observed_at_ms INTEGER NOT NULL,
      PRIMARY KEY (profile, account_id, user_id, thread_id)
    ) WITHOUT ROWID`,
        },
      ],
    };
  });
var Hj,
  c_e = g(() => {
    gr();
    Hj = {
      id: "20261029223800_add_automation_remote_host",
      operations: [Se("automations", "remote_host", "TEXT")],
    };
  });
var u_e,
  d_e = g(() => {
    gr();
    u_e = {
      id: "20261105220000_add_automation_prompt_authorship",
      operations: [Se("automations", "model_authored_prompt", "INTEGER")],
    };
  });
var jj,
  p_e = g(() => {
    jj = {
      id: "legacy_0001_create_inbox_items",
      operations: [
        {
          kind: "exec",
          sql: `CREATE TABLE IF NOT EXISTS inbox_items (
          id TEXT PRIMARY KEY,
          title TEXT
        )`,
        },
      ],
    };
  });
var zj,
  m_e = g(() => {
    gr();
    zj = {
      id: "legacy_0002_add_inbox_item_fields",
      operations: [
        Se("inbox_items", "description", "TEXT"),
        Se("inbox_items", "thread_id", "TEXT"),
        Se("inbox_items", "read_at", "INTEGER"),
        Se("inbox_items", "created_at", "INTEGER"),
      ],
    };
  });
var Vj,
  f_e = g(() => {
    gr();
    Vj = {
      id: "legacy_0003_repair_inbox_item_fields",
      operations: [
        Se("inbox_items", "description", "TEXT"),
        Se("inbox_items", "thread_id", "TEXT"),
        Se("inbox_items", "read_at", "INTEGER"),
        Se("inbox_items", "created_at", "INTEGER"),
      ],
    };
  });
var Fwt,
  Kj,
  h_e = g(() => {
    gr();
    ((Fwt = "FREQ=HOURLY;INTERVAL=24;BYMINUTE=0"),
      (Kj = {
        id: "legacy_0007_create_automations",
        operations: [
          {
            kind: "exec",
            sql: `CREATE TABLE IF NOT EXISTS automations (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          prompt TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'ACTIVE',
          next_run_at INTEGER,
          last_run_at INTEGER,
          cwds TEXT NOT NULL DEFAULT '[]',
          rrule TEXT NOT NULL DEFAULT '${Fwt}',
          model TEXT,
          reasoning_effort TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        )`,
          },
          Se("automations", "status", "TEXT NOT NULL DEFAULT 'ACTIVE'"),
          Se("automations", "last_run_at", "INTEGER"),
          Se("automations", "cwds", "TEXT NOT NULL DEFAULT '[]'"),
        ],
      }));
  });
var Zj,
  g_e = g(() => {
    gr();
    Zj = {
      id: "legacy_0008_add_automation_next_run_at",
      operations: [Se("automations", "next_run_at", "INTEGER")],
    };
  });
var Xj,
  y_e = g(() => {
    Xj = {
      id: "legacy_0009_create_automation_runs",
      operations: [
        {
          kind: "exec",
          sql: `CREATE TABLE IF NOT EXISTS automation_runs (
          thread_id TEXT PRIMARY KEY,
          automation_id TEXT NOT NULL,
          status TEXT NOT NULL,
          read_at INTEGER,
          thread_title TEXT,
          source_cwd TEXT,
          inbox_title TEXT,
          inbox_summary TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        )`,
        },
      ],
    };
  });
var $wt,
  Yj,
  v_e = g(() => {
    gr();
    (($wt = "FREQ=HOURLY;INTERVAL=24;BYMINUTE=0"),
      (Yj = {
        id: "legacy_0013_add_automation_rrule",
        operations: [
          Se("automations", "rrule", "TEXT"),
          {
            kind: "run",
            sql: "UPDATE automations SET rrule = ? WHERE rrule IS NULL OR rrule = ''",
            parameters: [$wt],
          },
        ],
      }));
  });
var Jj,
  b_e = g(() => {
    gr();
    Jj = {
      id: "legacy_0014_add_archived_automation_run_messages",
      operations: [
        Se("automation_runs", "archived_user_message", "TEXT"),
        Se("automation_runs", "archived_assistant_message", "TEXT"),
      ],
    };
  });
var Qj,
  S_e = g(() => {
    gr();
    Qj = {
      id: "legacy_0015_add_automation_run_read_at",
      operations: [Se("automation_runs", "read_at", "INTEGER")],
    };
  });
var ez,
  w_e = g(() => {
    gr();
    ez = {
      id: "legacy_0016_add_automation_run_thread_title",
      operations: [Se("automation_runs", "thread_title", "TEXT")],
    };
  });
var tz,
  __e = g(() => {
    gr();
    tz = {
      id: "legacy_0017_add_automation_run_source_cwd",
      operations: [Se("automation_runs", "source_cwd", "TEXT")],
    };
  });
var rz,
  x_e = g(() => {
    gr();
    rz = {
      id: "legacy_0018_add_automation_run_inbox_fields",
      operations: [
        Se("automation_runs", "inbox_title", "TEXT"),
        Se("automation_runs", "inbox_summary", "TEXT"),
      ],
    };
  });
var nz,
  A_e = g(() => {
    gr();
    nz = {
      id: "legacy_0019_add_automation_run_archived_reason",
      operations: [Se("automation_runs", "archived_reason", "TEXT")],
    };
  });
var oz,
  R_e = g(() => {
    gr();
    oz = {
      id: "legacy_0020_add_automation_model_fields",
      operations: [
        Se("automations", "model", "TEXT"),
        Se("automations", "reasoning_effort", "TEXT"),
      ],
    };
  });
var iz,
  E_e = g(() => {
    iz = {
      id: "legacy_0021_create_local_app_server_feature_enablement",
      operations: [
        {
          kind: "exec",
          sql: `CREATE TABLE IF NOT EXISTS local_app_server_feature_enablement (
          feature_name TEXT PRIMARY KEY,
          enabled INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        )`,
        },
      ],
    };
  });
var sz,
  C_e = g(() => {
    sz = {
      id: "legacy_0022_create_local_thread_catalog",
      operations: [
        {
          kind: "exec",
          sql: `
          CREATE TABLE IF NOT EXISTS local_thread_catalog (
            host_id TEXT NOT NULL,
            thread_id TEXT NOT NULL,
            display_title TEXT NOT NULL,
            source_created_at REAL NOT NULL,
            source_updated_at REAL NOT NULL,
            cwd TEXT NOT NULL,
            source_kind TEXT NOT NULL,
            source_detail TEXT,
            model_provider TEXT NOT NULL,
            git_branch TEXT,
            observation_sequence INTEGER NOT NULL,
            missing_candidate INTEGER NOT NULL DEFAULT 0
              CHECK (missing_candidate IN (0, 1)),
            PRIMARY KEY (host_id, thread_id)
          );
          CREATE INDEX IF NOT EXISTS local_thread_catalog_updated_idx
            ON local_thread_catalog (
              host_id,
              source_updated_at DESC,
              source_created_at DESC,
              thread_id
            ) WHERE missing_candidate = 0;
          CREATE TABLE IF NOT EXISTS local_thread_catalog_sync_state (
            host_id TEXT PRIMARY KEY,
            watermark_updated_at REAL,
            initial_build_complete INTEGER NOT NULL DEFAULT 0,
            observation_sequence INTEGER NOT NULL DEFAULT 0
          );
          CREATE TABLE IF NOT EXISTS local_thread_catalog_hosts (
            host_id TEXT PRIMARY KEY,
            host_kind TEXT NOT NULL CHECK (
              host_kind IN ('local', 'ssh', 'wsl', 'remote-control')
            )
          );
          CREATE TABLE IF NOT EXISTS local_thread_catalog_metadata (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            catalog_revision INTEGER NOT NULL DEFAULT 0
          );
          INSERT OR IGNORE INTO local_thread_catalog_sync_state (host_id)
            VALUES ('local');
          INSERT OR IGNORE INTO local_thread_catalog_hosts (host_id, host_kind)
            VALUES ('local', 'local');
          INSERT OR IGNORE INTO local_thread_catalog_metadata (id) VALUES (1);
        `,
        },
      ],
    };
  });
var az,
  T_e = g(() => {
    gr();
    az = {
      id: "legacy_0023_add_automation_targets",
      operations: [
        Se("automations", "target_type", "TEXT"),
        Se("automations", "project_id", "TEXT"),
      ],
    };
  });
var lz,
  P_e = g(() => {
    gr();
    lz = {
      id: "legacy_0024_add_local_thread_catalog_last_full_reconciled_at",
      operations: [Se("local_thread_catalog_sync_state", "last_full_reconciled_at", "INTEGER")],
    };
  });
var cz,
  I_e = g(() => {
    cz = {
      id: "legacy_0025_add_local_thread_catalog_indexes",
      operations: [
        {
          kind: "exec",
          sql: `
          CREATE INDEX IF NOT EXISTS local_thread_catalog_created_idx
            ON local_thread_catalog (
              host_id,
              source_created_at DESC,
              source_updated_at DESC,
              thread_id
            ) WHERE missing_candidate = 0;
          CREATE INDEX IF NOT EXISTS local_thread_catalog_cwd_updated_idx
            ON local_thread_catalog (
              host_id,
              cwd,
              source_updated_at DESC,
              source_created_at DESC,
              thread_id
            ) WHERE missing_candidate = 0;
          CREATE INDEX IF NOT EXISTS local_thread_catalog_cwd_created_idx
            ON local_thread_catalog (
              host_id,
              cwd,
              source_created_at DESC,
              source_updated_at DESC,
              thread_id
            ) WHERE missing_candidate = 0;
        `,
        },
      ],
    };
  });
var uz,
  k_e = g(() => {
    uz = {
      id: "legacy_0026_create_thread_timeline_ledger",
      operations: [
        {
          kind: "exec",
          sql: `
          CREATE TABLE IF NOT EXISTS thread_timeline_ledger (
            host_id TEXT NOT NULL,
            thread_id TEXT NOT NULL,
            sequence INTEGER NOT NULL,
            record_id TEXT NOT NULL,
            payload_json TEXT NOT NULL,
            PRIMARY KEY (host_id, thread_id, sequence),
            UNIQUE (host_id, thread_id, record_id)
          ) WITHOUT ROWID;
        `,
        },
      ],
    };
  });
var dz,
  D_e = g(() => {
    gr();
    dz = {
      id: "legacy_0027_add_local_thread_catalog_thread_source",
      operations: [
        Se("local_thread_catalog", "thread_source", "TEXT"),
        {
          kind: "run",
          sql: `UPDATE local_thread_catalog_sync_state
          SET last_full_reconciled_at = NULL`,
          parameters: [],
        },
      ],
    };
  });
var pz,
  M_e = g(() => {
    pz = {
      id: "legacy_0028_schedule_full_catalog_backfill_for_title_projection",
      operations: [
        {
          kind: "run",
          sql: `UPDATE local_thread_catalog_sync_state
          SET last_full_reconciled_at = NULL`,
          parameters: [],
        },
      ],
    };
  });
var mz,
  O_e = g(() => {
    gr();
    mz = {
      id: "legacy_0029_add_local_thread_catalog_source_recency",
      operations: [
        Se("local_thread_catalog", "source_recency_at", "REAL NOT NULL DEFAULT 0"),
        {
          kind: "exec",
          sql: `
          UPDATE local_thread_catalog
          SET source_recency_at = source_updated_at
          WHERE source_recency_at = 0;
          DROP INDEX IF EXISTS local_thread_catalog_updated_idx;
          DROP INDEX IF EXISTS local_thread_catalog_cwd_updated_idx;
          CREATE INDEX IF NOT EXISTS local_thread_catalog_updated_idx
            ON local_thread_catalog (
              host_id,
              source_recency_at DESC,
              source_created_at DESC,
              thread_id
            ) WHERE missing_candidate = 0;
          CREATE INDEX IF NOT EXISTS local_thread_catalog_cwd_updated_idx
            ON local_thread_catalog (
              host_id,
              cwd,
              source_recency_at DESC,
              source_created_at DESC,
              thread_id
            ) WHERE missing_candidate = 0;
          UPDATE local_thread_catalog_sync_state
          SET last_full_reconciled_at = NULL;
        `,
        },
      ],
    };
  });
