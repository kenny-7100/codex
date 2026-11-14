var FTt,
  wIe = g(() => {
    O();
    FTt = `
tick() {
  IFS= read -r -t 5 _
  (( $? > 128 )) || exit 1
}
if [[ -z $2 ]]; then
  printf '1'
  while [[ ! -d $1 ]]; do tick; done
  exit 0
fi
cd -P -- "$2" || exit 0
exec {anchor}<. || exit 1
read_git_marker() {
  marker=''
  local ancestor=$PWD
  while [[ -n $ancestor ]]; do
    if [[ -e $ancestor/.git ]]; then marker=$ancestor; return; fi
    ancestor=\${ancestor%/*}
  done
}
if [[ $3 == missing ]]; then read_git_marker; previous_marker=$marker; fi
printf '1'
while [[ /proc/self/fd/$anchor -ef $1 ]] && cd -P -- "$1" && [[ $PWD == "$2" ]]; do
  if [[ $3 == missing ]]; then
    read_git_marker
    [[ $marker == "$previous_marker" ]] || break
  fi
  tick
done
`;
  });
function bx(t) {
  return process.platform === "win32" && t.startsWith("/") && !t.startsWith("//");
}
function yy(t, e) {
  return e.isLocal && bx(t) ? CV(t, e) : ($D(t, e) ?? t);
}
function _Ie(t, e, r, n) {
  return t.isLocal && bx(e) ? (o) => SIe(t, e, r, o, n) : null;
}
function $D(t, e) {
  if (!e.isLocal || !bo.default.isAbsolute(t) || bx(t)) return t;
  try {
    return is.realpathSync.native(t);
  } catch {
    return null;
  }
}
function xIe(t, e, r) {
  if (t !== e) {
    if (r.isLocal && bx(t))
      return bo.default.posix.resolve(t) !== e ? e : bIe(t, r).then((n) => (n ? e : void 0));
    try {
      let n = bo.default.format(bo.default.parse(t));
      for (; n !== bo.default.dirname(n); ) {
        if ((0, is.lstatSync)(n, { throwIfNoEntry: !1 })?.isSymbolicLink()) return e;
        n = bo.default.dirname(n);
      }
    } catch {}
  }
}
function TV(t) {
  if (bx(t)) return t;
  try {
    return (0, is.realpathSync)(t);
  } catch (e) {
    if (!(e instanceof Error && "code" in e && e.code === "ENOENT")) return t;
  }
  try {
    let e = t;
    for (;;) {
      if (
        ((e = bo.default.format(bo.default.parse(e))),
        (0, is.lstatSync)(e, { throwIfNoEntry: !1 }) != null)
      )
        return bo.default.join((0, is.realpathSync)(e), bo.default.relative(e, t));
      let r = bo.default.dirname(e);
      if (r === e) return t;
      e = r;
    }
  } catch {
    return t;
  }
}
function AIe(t) {
  try {
    let e = (0, is.readlinkSync)(t),
      r = bo.default.resolve(bo.default.dirname(t), e);
    return (0, is.existsSync)(r) ? r : null;
  } catch {
    return (0, is.existsSync)(t) ? t : null;
  }
}
function UD(t, e, r) {
  let n = r.isLocal ? bo.default : bo.default.posix,
    o = n.relative(t, e);
  return o === "" || (o !== ".." && !o.startsWith(`..${n.sep}`) && !n.isAbsolute(o));
}
var is,
  bo,
  Sx = g(() => {
    ((is = require("node:fs")), (bo = F(require("node:path"))));
    O();
    wIe();
  });
function PV(t, e, r, n) {
  if (e === "win32") return Promise.resolve({ ...r });
  let o = RIe.get(t.id);
  if (o != null) return o;
  let i = WTt(t, r, n);
  return (RIe.set(t.id, i), i);
}
async function WTt(t, e, r) {
  let n = await HTt(t, r).catch(() => null),
    o = [n ?? "/bin/sh", ...qTt.filter((s) => s !== n)],
    i = null;
  for (let s of o)
    try {
      let a = await _r(await t.spawn({ args: [s, "-ilc", nH], cwd: r, env: UTt, timeoutMs: 1e4 }));
      if (a.code !== 0) {
        i = new Error("Login shell exited unsuccessfully");
        continue;
      }
      return EIe({ ...e, ...iH(a.stdout, "\0") });
    } catch (a) {
      i = a instanceof Error ? a : new Error("Shell env loading failed");
    }
  return (
    GTt().warning("[local-environment] failed to load shell env", {
      safe: {},
      sensitive: { error: i },
    }),
    EIe({ ...e })
  );
}
async function HTt(t, e) {
  let r = await _r(await t.spawn({ args: ["sh", "-c", $Tt], cwd: e, timeoutMs: 5e3 }));
  return r.code !== 0
    ? null
    : (r.stdout
        .split(/\r?\n/)
        .map((n) => n.trim())
        .find((n) => n.length > 0) ?? null);
}
function EIe(t) {
  let { [Ig]: e, ...r } = t;
  return r;
}
var $Tt,
  UTt,
  qTt,
  RIe,
  GTt,
  CIe = g(() => {
    O();
    hr();
    (($Tt = [
      'entry=$(getent passwd "$(id -u)" 2>/dev/null) || entry=$(id -P 2>/dev/null) || exit 1',
      "shell=${entry##*:}",
      'test -n "$shell" || exit 1',
      'printf "%s\\n" "$shell"',
    ].join("; ")),
      (UTt = { ...oH, [Ig]: "1" }),
      (qTt = ["/bin/zsh", "/bin/bash"]),
      (RIe = new Map()),
      (GTt = Ie("git")));
  });
function TIe(t, e) {
  if (t !== "win32")
    return { executable: "bash", args: [], scriptExtension: "sh", shellKind: "posix" };
  let r = PIe(e) ?? Rm(e, "COMSPEC") ?? "cmd.exe",
    n = r.split(/[\\/]/).at(-1)?.toLowerCase();
  return n === "powershell" || n === "powershell.exe" || n === "pwsh" || n === "pwsh.exe"
    ? { executable: r, args: ["-File"], scriptExtension: "ps1", shellKind: "powershell" }
    : n !== "cmd" && n !== "cmd.exe"
      ? { executable: r, args: [], scriptExtension: "sh", shellKind: "posix" }
      : { executable: r, args: ["/c"], scriptExtension: "cmd", shellKind: "cmd" };
}
function PIe(t) {
  let e = Rm(t, "SHELL");
  if (e != null && /(?:^|[\\/])(?:pwsh|powershell)(?:\.exe)?$/i.test(e)) return e;
  let n = [
      [
        Rm(t, "SystemRoot") ?? Rm(t, "windir") ?? "C:\\Windows",
        "System32",
        "WindowsPowerShell",
        "v1.0",
      ],
      ...["ProgramFiles", "ProgramW6432", "ProgramFiles(x86)"].flatMap((a) => {
        let l = Rm(t, a);
        return l == null ? [] : ["7", "7-preview", "6"].map((c) => [l, "PowerShell", c]);
      }),
    ],
    o = [
      ...(Rm(t, "PATH")?.split(";") ?? []),
      ...n.flatMap((a) => [Br.default.win32.join(...a), Br.default.join(...a)]),
    ],
    i = Rm(t, "LOCALAPPDATA"),
    s =
      i == null
        ? null
        : Br.default.win32
            .normalize(Br.default.win32.join(i, "Microsoft", "WindowsApps"))
            .toLowerCase();
  for (let a of o) {
    let l = a.trim().replace(/^"|"$/g, "");
    if (l.length === 0) continue;
    let c = Br.default.win32.normalize(l).toLowerCase();
    if (!(s != null && (c === s || c.startsWith(`${s}${Br.default.win32.sep}`))))
      for (let u of ["pwsh.exe", "powershell.exe"])
        for (let p of [Br.default.win32.join(l, u), Br.default.join(l, u)]) {
          let m = AIe(p);
          if (m != null) return m;
        }
  }
  return null;
}
function Rm(t, e) {
  return Object.entries(t).find(
    ([n, o]) => n.toLowerCase() === e.toLowerCase() && o != null && o.length > 0,
  )?.[1];
}
var IV = g(() => {
  vx();
  Sx();
  CIe();
});
var jTt,
  mNr,
  fNr,
  qD = g(() => {
    jTt = F(EV());
    IV();
    O();
    O();
    X4();
    ((mNr = `echo ${Kl}&&set&&echo ${Kl}`),
      (fNr = `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Output '${Kl}'; Get-ChildItem Env: | ForEach-Object { '{0}={1}' -f $_.Name, $_.Value }; Write-Output '${Kl}'`));
  });
function kIe() {
  return { arch: MV.default.arch(), platform: process.platform };
}
function KTt(t = {}) {
  if ((t.target ?? kIe()).platform !== "win32") return null;
  let r = on.default.join(DIe(t.installRoot), "dependencies", "native", "git", "cmd");
  return MIe(r) ? r : null;
}
function ZTt(t, e) {
  let r = XTt(e);
  try {
    let n = VTt.safeParse(
      JSON.parse((0, ja.readFileSync)(on.default.join(r, "native-executables.json"), "utf8")),
    );
    if (n.success) {
      let o = YTt({
          label: "Native executable directory",
          pathParts: [(0, ja.realpathSync)(on.default.join(e, "dependencies", "native"))],
          runtimeRoot: (0, ja.realpathSync)(e),
        }),
        i = [];
      for (let s of Object.values(n.data)) {
        if (on.default.isAbsolute(s)) continue;
        let a;
        try {
          a = (0, ja.realpathSync)(on.default.resolve(r, s));
        } catch {
          continue;
        }
        let l = on.default.relative(o, a);
        if (
          on.default.extname(a).toLowerCase() !== ".exe" ||
          l === ".." ||
          l.startsWith(".." + on.default.sep) ||
          on.default.isAbsolute(l) ||
          !(0, ja.statSync)(a).isFile()
        )
          continue;
        let c = on.default.dirname(a);
        !c.includes(";") && !i.some((u) => DV(u, c)) && i.push(c);
      }
      if (i.length > 0) {
        let s = ac(t),
          a = s == null ? [] : s.split(";");
        Sm(t, [...i, ...a.filter((l) => !i.some((c) => DV(c, l)))].join(";"));
      }
    }
  } catch {}
}
function OV(t, e = {}) {
  if ((e.target ?? kIe()).platform !== "win32") return;
  let n = DIe(e.installRoot);
  ZTt(t, n);
  let o = on.default.join(n, "dependencies", "node", "bin");
  MIe(o) && Sm(t, kV(ac(t), o));
  let i = KTt(e);
  i != null && Sm(t, kV(ac(t), i));
  let s = on.default.join(n, "dependencies", "native", "powershell");
  Sm(t, kV(ac(t), s, !0));
}
function DIe(t) {
  return t == null && IIe != null
    ? IIe
    : on.default.join(t ?? on.default.join(MV.default.homedir(), ".cache", "codex-runtimes"), zTt);
}
function XTt(t) {
  return on.default.join(t, "dependencies", "bin", "override");
}
function YTt({ label: t, pathParts: e, runtimeRoot: r }) {
  let n = on.default.resolve(r),
    o = on.default.resolve(r, ...e);
  if (o !== n && o.startsWith(`${n}${on.default.sep}`)) return o;
  throw new Error(`${t} path must stay within the runtime root.`);
}
function MIe(t) {
  try {
    return (0, ja.statSync)(t).isDirectory();
  } catch {
    return !1;
  }
}
function kV(t, e, r = !1) {
  let n = process.platform === "win32" ? ";" : ":",
    o = t ?? "",
    i = o.length === 0 ? [] : o.split(n),
    s = i.findIndex((l) => DV(l, e)),
    a = r
      ? i.findIndex((l) =>
          on.default.win32
            .normalize(l)
            .split(on.default.win32.sep)
            .some((c) => c.toLowerCase() === "windowsapps"),
        )
      : -1;
  if (s >= 0) {
    if (a < 0 || s < a) return i.join(n);
    i.splice(s, 1);
  }
  return (a >= 0 ? i.splice(a, 0, e) : i.push(e), i.join(n));
}
function DV(t, e) {
  return process.platform === "win32" ? t.toLowerCase() === e.toLowerCase() : t === e;
}
var ja,
  MV,
  on,
  zTt,
  INr,
  IIe,
  kNr,
  VTt,
  GD = g(() => {
    ((ja = require("node:fs")), (MV = F(require("node:os"))), (on = F(require("node:path"))));
    O();
    $();
    _u();
    Bt();
    LTe();
    qD();
    Ku();
    O();
    ((zTt = pge),
      (INr = Ie("primary-runtime-installer")),
      (IIe = null),
      (kNr = d.object({
        artifactToolVersion: d.string().min(1).nullable().optional(),
        bundleFormatVersion: d.number().int().positive().optional(),
        bundleVersion: d.string().optional(),
        bundledPlugins: d.array(d.string().min(1)).optional(),
        bundledSkills: d.array(d.string().min(1)).optional(),
        nativeDependencies: d.array(d.string().min(1)).optional(),
        libreOfficeVersion: d.string().min(1).nullable().optional(),
        pnpmVersion: d.string().min(1).optional(),
        skillsToRemove: d.array(d.string().min(1)).optional(),
      })),
      (VTt = d.record(d.string(), d.string())));
  });
var OIe = g(() => {});
var NV = g(() => {});
var FIe = A((lc) => {
  "use strict";
  Object.defineProperty(lc, "__esModule", { value: !0 });
  var NIe = require("buffer"),
    Em = {
      INVALID_ENCODING:
        "Invalid encoding provided. Please specify a valid encoding the internal Node.js Buffer supports.",
      INVALID_SMARTBUFFER_SIZE:
        "Invalid size provided. Size must be a valid integer greater than zero.",
      INVALID_SMARTBUFFER_BUFFER: "Invalid Buffer provided in SmartBufferOptions.",
      INVALID_SMARTBUFFER_OBJECT:
        "Invalid SmartBufferOptions object supplied to SmartBuffer constructor or factory methods.",
      INVALID_OFFSET: "An invalid offset value was provided.",
      INVALID_OFFSET_NON_NUMBER:
        "An invalid offset value was provided. A numeric value is required.",
      INVALID_LENGTH: "An invalid length value was provided.",
      INVALID_LENGTH_NON_NUMBER:
        "An invalid length value was provived. A numeric value is required.",
      INVALID_TARGET_OFFSET: "Target offset is beyond the bounds of the internal SmartBuffer data.",
      INVALID_TARGET_LENGTH:
        "Specified length value moves cursor beyong the bounds of the internal SmartBuffer data.",
      INVALID_READ_BEYOND_BOUNDS: "Attempted to read beyond the bounds of the managed data.",
      INVALID_WRITE_BEYOND_BOUNDS: "Attempted to write beyond the bounds of the managed data.",
    };
  lc.ERRORS = Em;
  function JTt(t) {
    if (!NIe.Buffer.isEncoding(t)) throw new Error(Em.INVALID_ENCODING);
  }
  lc.checkEncoding = JTt;
  function LIe(t) {
    return typeof t == "number" && isFinite(t) && rPt(t);
  }
  lc.isFiniteInteger = LIe;
  function BIe(t, e) {
    if (typeof t == "number") {
      if (!LIe(t) || t < 0) throw new Error(e ? Em.INVALID_OFFSET : Em.INVALID_LENGTH);
    } else throw new Error(e ? Em.INVALID_OFFSET_NON_NUMBER : Em.INVALID_LENGTH_NON_NUMBER);
  }
  function QTt(t) {
    BIe(t, !1);
  }
  lc.checkLengthValue = QTt;
  function ePt(t) {
    BIe(t, !0);
  }
  lc.checkOffsetValue = ePt;
  function tPt(t, e) {
    if (t < 0 || t > e.length) throw new Error(Em.INVALID_TARGET_OFFSET);
  }
  lc.checkTargetOffset = tPt;
  function rPt(t) {
    return typeof t == "number" && isFinite(t) && Math.floor(t) === t;
  }
  function nPt(t) {
    if (typeof BigInt > "u") throw new Error("Platform does not support JS BigInt type.");
    if (typeof NIe.Buffer.prototype[t] > "u")
      throw new Error(`Platform does not support Buffer.prototype.${t}.`);
  }
  lc.bigIntAndBufferInt64Check = nPt;
});
var UIe = A((BV) => {
  "use strict";
  Object.defineProperty(BV, "__esModule", { value: !0 });
  var ht = FIe(),
    $Ie = 4096,
    oPt = "utf8",
    LV = class t {
      constructor(e) {
        if (
          ((this.length = 0),
          (this._encoding = oPt),
          (this._writeOffset = 0),
          (this._readOffset = 0),
          t.isSmartBufferOptions(e))
        )
          if ((e.encoding && (ht.checkEncoding(e.encoding), (this._encoding = e.encoding)), e.size))
            if (ht.isFiniteInteger(e.size) && e.size > 0) this._buff = Buffer.allocUnsafe(e.size);
            else throw new Error(ht.ERRORS.INVALID_SMARTBUFFER_SIZE);
          else if (e.buff)
            if (Buffer.isBuffer(e.buff)) ((this._buff = e.buff), (this.length = e.buff.length));
            else throw new Error(ht.ERRORS.INVALID_SMARTBUFFER_BUFFER);
          else this._buff = Buffer.allocUnsafe($Ie);
        else {
          if (typeof e < "u") throw new Error(ht.ERRORS.INVALID_SMARTBUFFER_OBJECT);
          this._buff = Buffer.allocUnsafe($Ie);
        }
      }
      static fromSize(e, r) {
        return new this({ size: e, encoding: r });
      }
      static fromBuffer(e, r) {
        return new this({ buff: e, encoding: r });
      }
      static fromOptions(e) {
        return new this(e);
      }
      static isSmartBufferOptions(e) {
        let r = e;
        return r && (r.encoding !== void 0 || r.size !== void 0 || r.buff !== void 0);
      }
      readInt8(e) {
        return this._readNumberValue(Buffer.prototype.readInt8, 1, e);
      }
      readInt16BE(e) {
        return this._readNumberValue(Buffer.prototype.readInt16BE, 2, e);
      }
      readInt16LE(e) {
        return this._readNumberValue(Buffer.prototype.readInt16LE, 2, e);
      }
      readInt32BE(e) {
        return this._readNumberValue(Buffer.prototype.readInt32BE, 4, e);
      }
      readInt32LE(e) {
        return this._readNumberValue(Buffer.prototype.readInt32LE, 4, e);
      }
      readBigInt64BE(e) {
        return (
          ht.bigIntAndBufferInt64Check("readBigInt64BE"),
          this._readNumberValue(Buffer.prototype.readBigInt64BE, 8, e)
        );
      }
      readBigInt64LE(e) {
        return (
          ht.bigIntAndBufferInt64Check("readBigInt64LE"),
          this._readNumberValue(Buffer.prototype.readBigInt64LE, 8, e)
        );
      }
      writeInt8(e, r) {
        return (this._writeNumberValue(Buffer.prototype.writeInt8, 1, e, r), this);
      }
      insertInt8(e, r) {
        return this._insertNumberValue(Buffer.prototype.writeInt8, 1, e, r);
      }
      writeInt16BE(e, r) {
        return this._writeNumberValue(Buffer.prototype.writeInt16BE, 2, e, r);
      }
      insertInt16BE(e, r) {
        return this._insertNumberValue(Buffer.prototype.writeInt16BE, 2, e, r);
      }
      writeInt16LE(e, r) {
        return this._writeNumberValue(Buffer.prototype.writeInt16LE, 2, e, r);
      }
      insertInt16LE(e, r) {
        return this._insertNumberValue(Buffer.prototype.writeInt16LE, 2, e, r);
      }
      writeInt32BE(e, r) {
        return this._writeNumberValue(Buffer.prototype.writeInt32BE, 4, e, r);
      }
      insertInt32BE(e, r) {
        return this._insertNumberValue(Buffer.prototype.writeInt32BE, 4, e, r);
      }
      writeInt32LE(e, r) {
        return this._writeNumberValue(Buffer.prototype.writeInt32LE, 4, e, r);
      }
      insertInt32LE(e, r) {
        return this._insertNumberValue(Buffer.prototype.writeInt32LE, 4, e, r);
      }
      writeBigInt64BE(e, r) {
        return (
          ht.bigIntAndBufferInt64Check("writeBigInt64BE"),
          this._writeNumberValue(Buffer.prototype.writeBigInt64BE, 8, e, r)
        );
      }
      insertBigInt64BE(e, r) {
        return (
          ht.bigIntAndBufferInt64Check("writeBigInt64BE"),
          this._insertNumberValue(Buffer.prototype.writeBigInt64BE, 8, e, r)
        );
      }
      writeBigInt64LE(e, r) {
        return (
          ht.bigIntAndBufferInt64Check("writeBigInt64LE"),
          this._writeNumberValue(Buffer.prototype.writeBigInt64LE, 8, e, r)
        );
      }
      insertBigInt64LE(e, r) {
        return (
          ht.bigIntAndBufferInt64Check("writeBigInt64LE"),
          this._insertNumberValue(Buffer.prototype.writeBigInt64LE, 8, e, r)
        );
      }
      readUInt8(e) {
        return this._readNumberValue(Buffer.prototype.readUInt8, 1, e);
      }
      readUInt16BE(e) {
        return this._readNumberValue(Buffer.prototype.readUInt16BE, 2, e);
      }
      readUInt16LE(e) {
        return this._readNumberValue(Buffer.prototype.readUInt16LE, 2, e);
      }
      readUInt32BE(e) {
        return this._readNumberValue(Buffer.prototype.readUInt32BE, 4, e);
      }
      readUInt32LE(e) {
        return this._readNumberValue(Buffer.prototype.readUInt32LE, 4, e);
      }
      readBigUInt64BE(e) {
        return (
          ht.bigIntAndBufferInt64Check("readBigUInt64BE"),
          this._readNumberValue(Buffer.prototype.readBigUInt64BE, 8, e)
        );
      }
      readBigUInt64LE(e) {
        return (
          ht.bigIntAndBufferInt64Check("readBigUInt64LE"),
          this._readNumberValue(Buffer.prototype.readBigUInt64LE, 8, e)
        );
      }
      writeUInt8(e, r) {
        return this._writeNumberValue(Buffer.prototype.writeUInt8, 1, e, r);
      }
      insertUInt8(e, r) {
        return this._insertNumberValue(Buffer.prototype.writeUInt8, 1, e, r);
      }
      writeUInt16BE(e, r) {
        return this._writeNumberValue(Buffer.prototype.writeUInt16BE, 2, e, r);
      }
      insertUInt16BE(e, r) {
        return this._insertNumberValue(Buffer.prototype.writeUInt16BE, 2, e, r);
      }
      writeUInt16LE(e, r) {
        return this._writeNumberValue(Buffer.prototype.writeUInt16LE, 2, e, r);
      }
      insertUInt16LE(e, r) {
        return this._insertNumberValue(Buffer.prototype.writeUInt16LE, 2, e, r);
      }
      writeUInt32BE(e, r) {
        return this._writeNumberValue(Buffer.prototype.writeUInt32BE, 4, e, r);
      }
      insertUInt32BE(e, r) {
        return this._insertNumberValue(Buffer.prototype.writeUInt32BE, 4, e, r);
      }
      writeUInt32LE(e, r) {
        return this._writeNumberValue(Buffer.prototype.writeUInt32LE, 4, e, r);
      }
      insertUInt32LE(e, r) {
        return this._insertNumberValue(Buffer.prototype.writeUInt32LE, 4, e, r);
      }
      writeBigUInt64BE(e, r) {
        return (
          ht.bigIntAndBufferInt64Check("writeBigUInt64BE"),
          this._writeNumberValue(Buffer.prototype.writeBigUInt64BE, 8, e, r)
        );
      }
      insertBigUInt64BE(e, r) {
        return (
          ht.bigIntAndBufferInt64Check("writeBigUInt64BE"),
          this._insertNumberValue(Buffer.prototype.writeBigUInt64BE, 8, e, r)
        );
      }
      writeBigUInt64LE(e, r) {
        return (
          ht.bigIntAndBufferInt64Check("writeBigUInt64LE"),
          this._writeNumberValue(Buffer.prototype.writeBigUInt64LE, 8, e, r)
        );
      }
      insertBigUInt64LE(e, r) {
        return (
          ht.bigIntAndBufferInt64Check("writeBigUInt64LE"),
          this._insertNumberValue(Buffer.prototype.writeBigUInt64LE, 8, e, r)
        );
      }
      readFloatBE(e) {
        return this._readNumberValue(Buffer.prototype.readFloatBE, 4, e);
      }
      readFloatLE(e) {
        return this._readNumberValue(Buffer.prototype.readFloatLE, 4, e);
      }
      writeFloatBE(e, r) {
        return this._writeNumberValue(Buffer.prototype.writeFloatBE, 4, e, r);
      }
      insertFloatBE(e, r) {
        return this._insertNumberValue(Buffer.prototype.writeFloatBE, 4, e, r);
      }
      writeFloatLE(e, r) {
        return this._writeNumberValue(Buffer.prototype.writeFloatLE, 4, e, r);
      }
      insertFloatLE(e, r) {
        return this._insertNumberValue(Buffer.prototype.writeFloatLE, 4, e, r);
      }
      readDoubleBE(e) {
        return this._readNumberValue(Buffer.prototype.readDoubleBE, 8, e);
      }
      readDoubleLE(e) {
        return this._readNumberValue(Buffer.prototype.readDoubleLE, 8, e);
      }
      writeDoubleBE(e, r) {
        return this._writeNumberValue(Buffer.prototype.writeDoubleBE, 8, e, r);
      }
      insertDoubleBE(e, r) {
        return this._insertNumberValue(Buffer.prototype.writeDoubleBE, 8, e, r);
      }
      writeDoubleLE(e, r) {
        return this._writeNumberValue(Buffer.prototype.writeDoubleLE, 8, e, r);
      }
      insertDoubleLE(e, r) {
        return this._insertNumberValue(Buffer.prototype.writeDoubleLE, 8, e, r);
      }
      readString(e, r) {
        let n;
        (typeof e == "number"
          ? (ht.checkLengthValue(e), (n = Math.min(e, this.length - this._readOffset)))
          : ((r = e), (n = this.length - this._readOffset)),
          typeof r < "u" && ht.checkEncoding(r));
        let o = this._buff
          .slice(this._readOffset, this._readOffset + n)
          .toString(r || this._encoding);
        return ((this._readOffset += n), o);
      }
      insertString(e, r, n) {
        return (ht.checkOffsetValue(r), this._handleString(e, !0, r, n));
      }
      writeString(e, r, n) {
        return this._handleString(e, !1, r, n);
      }
      readStringNT(e) {
        typeof e < "u" && ht.checkEncoding(e);
        let r = this.length;
        for (let o = this._readOffset; o < this.length; o++)
          if (this._buff[o] === 0) {
            r = o;
            break;
          }
        let n = this._buff.slice(this._readOffset, r);
        return ((this._readOffset = r + 1), n.toString(e || this._encoding));
      }
      insertStringNT(e, r, n) {
        return (
          ht.checkOffsetValue(r),
          this.insertString(e, r, n),
          this.insertUInt8(0, r + e.length),
          this
        );
      }
      writeStringNT(e, r, n) {
        return (
          this.writeString(e, r, n),
          this.writeUInt8(0, typeof r == "number" ? r + e.length : this.writeOffset),
          this
        );
      }
      readBuffer(e) {
        typeof e < "u" && ht.checkLengthValue(e);
        let r = typeof e == "number" ? e : this.length,
          n = Math.min(this.length, this._readOffset + r),
          o = this._buff.slice(this._readOffset, n);
        return ((this._readOffset = n), o);
      }
      insertBuffer(e, r) {
        return (ht.checkOffsetValue(r), this._handleBuffer(e, !0, r));
      }
      writeBuffer(e, r) {
        return this._handleBuffer(e, !1, r);
      }
      readBufferNT() {
        let e = this.length;
        for (let n = this._readOffset; n < this.length; n++)
          if (this._buff[n] === 0) {
            e = n;
            break;
          }
        let r = this._buff.slice(this._readOffset, e);
        return ((this._readOffset = e + 1), r);
      }
      insertBufferNT(e, r) {
        return (
          ht.checkOffsetValue(r),
          this.insertBuffer(e, r),
          this.insertUInt8(0, r + e.length),
          this
        );
      }
      writeBufferNT(e, r) {
        return (
          typeof r < "u" && ht.checkOffsetValue(r),
          this.writeBuffer(e, r),
          this.writeUInt8(0, typeof r == "number" ? r + e.length : this._writeOffset),
          this
        );
      }
      clear() {
        return ((this._writeOffset = 0), (this._readOffset = 0), (this.length = 0), this);
      }
      remaining() {
        return this.length - this._readOffset;
      }
      get readOffset() {
        return this._readOffset;
      }
      set readOffset(e) {
        (ht.checkOffsetValue(e), ht.checkTargetOffset(e, this), (this._readOffset = e));
      }
      get writeOffset() {
        return this._writeOffset;
      }
      set writeOffset(e) {
        (ht.checkOffsetValue(e), ht.checkTargetOffset(e, this), (this._writeOffset = e));
      }
      get encoding() {
        return this._encoding;
      }
      set encoding(e) {
        (ht.checkEncoding(e), (this._encoding = e));
      }
      get internalBuffer() {
        return this._buff;
      }
      toBuffer() {
        return this._buff.slice(0, this.length);
      }
      toString(e) {
        let r = typeof e == "string" ? e : this._encoding;
        return (ht.checkEncoding(r), this._buff.toString(r, 0, this.length));
      }
      destroy() {
        return (this.clear(), this);
      }
      _handleString(e, r, n, o) {
        let i = this._writeOffset,
          s = this._encoding;
        (typeof n == "number" ? (i = n) : typeof n == "string" && (ht.checkEncoding(n), (s = n)),
          typeof o == "string" && (ht.checkEncoding(o), (s = o)));
        let a = Buffer.byteLength(e, s);
        return (
          r ? this.ensureInsertable(a, i) : this._ensureWriteable(a, i),
          this._buff.write(e, i, a, s),
          r
            ? (this._writeOffset += a)
            : typeof n == "number"
              ? (this._writeOffset = Math.max(this._writeOffset, i + a))
              : (this._writeOffset += a),
          this
        );
      }
      _handleBuffer(e, r, n) {
        let o = typeof n == "number" ? n : this._writeOffset;
        return (
          r ? this.ensureInsertable(e.length, o) : this._ensureWriteable(e.length, o),
          e.copy(this._buff, o),
          r
            ? (this._writeOffset += e.length)
            : typeof n == "number"
              ? (this._writeOffset = Math.max(this._writeOffset, o + e.length))
              : (this._writeOffset += e.length),
          this
        );
      }
      ensureReadable(e, r) {
        let n = this._readOffset;
        if ((typeof r < "u" && (ht.checkOffsetValue(r), (n = r)), n < 0 || n + e > this.length))
          throw new Error(ht.ERRORS.INVALID_READ_BEYOND_BOUNDS);
      }
      ensureInsertable(e, r) {
        (ht.checkOffsetValue(r),
          this._ensureCapacity(this.length + e),
          r < this.length && this._buff.copy(this._buff, r + e, r, this._buff.length),
          r + e > this.length ? (this.length = r + e) : (this.length += e));
      }
      _ensureWriteable(e, r) {
        let n = typeof r == "number" ? r : this._writeOffset;
        (this._ensureCapacity(n + e), n + e > this.length && (this.length = n + e));
      }
      _ensureCapacity(e) {
        let r = this._buff.length;
        if (e > r) {
          let n = this._buff,
            o = (r * 3) / 2 + 1;
          (o < e && (o = e), (this._buff = Buffer.allocUnsafe(o)), n.copy(this._buff, 0, 0, r));
        }
      }
      _readNumberValue(e, r, n) {
        this.ensureReadable(r, n);
        let o = e.call(this._buff, typeof n == "number" ? n : this._readOffset);
        return (typeof n > "u" && (this._readOffset += r), o);
      }
      _insertNumberValue(e, r, n, o) {
        return (
          ht.checkOffsetValue(o),
          this.ensureInsertable(r, o),
          e.call(this._buff, n, o),
          (this._writeOffset += r),
          this
        );
      }
      _writeNumberValue(e, r, n, o) {
        if (typeof o == "number") {
          if (o < 0) throw new Error(ht.ERRORS.INVALID_WRITE_BEYOND_BOUNDS);
          ht.checkOffsetValue(o);
        }
        let i = typeof o == "number" ? o : this._writeOffset;
        return (
          this._ensureWriteable(r, i),
          e.call(this._buff, n, i),
          typeof o == "number"
            ? (this._writeOffset = Math.max(this._writeOffset, i + r))
            : (this._writeOffset += r),
          this
        );
      }
    };
  BV.SmartBuffer = LV;
});
var FV = A((vr) => {
  "use strict";
  Object.defineProperty(vr, "__esModule", { value: !0 });
  vr.SOCKS5_NO_ACCEPTABLE_AUTH =
    vr.SOCKS5_CUSTOM_AUTH_END =
    vr.SOCKS5_CUSTOM_AUTH_START =
    vr.SOCKS_INCOMING_PACKET_SIZES =
    vr.SocksClientState =
    vr.Socks5Response =
    vr.Socks5HostType =
    vr.Socks5Auth =
    vr.Socks4Response =
    vr.SocksCommand =
    vr.ERRORS =
    vr.DEFAULT_TIMEOUT =
      void 0;
  var iPt = 3e4;
  vr.DEFAULT_TIMEOUT = iPt;
  var sPt = {
    InvalidSocksCommand:
      "An invalid SOCKS command was provided. Valid options are connect, bind, and associate.",
    InvalidSocksCommandForOperation:
      "An invalid SOCKS command was provided. Only a subset of commands are supported for this operation.",
    InvalidSocksCommandChain:
      "An invalid SOCKS command was provided. Chaining currently only supports the connect command.",
    InvalidSocksClientOptionsDestination: "An invalid destination host was provided.",
    InvalidSocksClientOptionsExistingSocket:
      "An invalid existing socket was provided. This should be an instance of stream.Duplex.",
    InvalidSocksClientOptionsProxy: "Invalid SOCKS proxy details were provided.",
    InvalidSocksClientOptionsTimeout:
      "An invalid timeout value was provided. Please enter a value above 0 (in ms).",
    InvalidSocksClientOptionsProxiesLength:
      "At least two socks proxies must be provided for chaining.",
    InvalidSocksClientOptionsCustomAuthRange: "Custom auth must be a value between 0x80 and 0xFE.",
    InvalidSocksClientOptionsCustomAuthOptions:
      "When a custom_auth_method is provided, custom_auth_request_handler, custom_auth_response_size, and custom_auth_response_handler must also be provided and valid.",
    NegotiationError: "Negotiation error",
    SocketClosed: "Socket closed",
    ProxyConnectionTimedOut: "Proxy connection timed out",
    InternalError: "SocksClient internal error (this should not happen)",
    InvalidSocks4HandshakeResponse: "Received invalid Socks4 handshake response",
    Socks4ProxyRejectedConnection: "Socks4 Proxy rejected connection",
    InvalidSocks4IncomingConnectionResponse: "Socks4 invalid incoming connection response",
    Socks4ProxyRejectedIncomingBoundConnection: "Socks4 Proxy rejected incoming bound connection",
    InvalidSocks5InitialHandshakeResponse: "Received invalid Socks5 initial handshake response",
    InvalidSocks5IntiailHandshakeSocksVersion:
      "Received invalid Socks5 initial handshake (invalid socks version)",
    InvalidSocks5InitialHandshakeNoAcceptedAuthType:
      "Received invalid Socks5 initial handshake (no accepted authentication type)",
    InvalidSocks5InitialHandshakeUnknownAuthType:
      "Received invalid Socks5 initial handshake (unknown authentication type)",
    Socks5AuthenticationFailed: "Socks5 Authentication failed",
    InvalidSocks5FinalHandshake: "Received invalid Socks5 final handshake response",
    InvalidSocks5FinalHandshakeRejected: "Socks5 proxy rejected connection",
    InvalidSocks5IncomingConnectionResponse: "Received invalid Socks5 incoming connection response",
    Socks5ProxyRejectedIncomingBoundConnection: "Socks5 Proxy rejected incoming bound connection",
  };
  vr.ERRORS = sPt;
  var aPt = {
    Socks5InitialHandshakeResponse: 2,
    Socks5UserPassAuthenticationResponse: 2,
    Socks5ResponseHeader: 5,
    Socks5ResponseIPv4: 10,
    Socks5ResponseIPv6: 22,
    Socks5ResponseHostname: (t) => t + 7,
    Socks4Response: 8,
  };
  vr.SOCKS_INCOMING_PACKET_SIZES = aPt;
  var qIe;
  (function (t) {
    ((t[(t.connect = 1)] = "connect"),
      (t[(t.bind = 2)] = "bind"),
      (t[(t.associate = 3)] = "associate"));
  })(qIe || (vr.SocksCommand = qIe = {}));
  var GIe;
  (function (t) {
    ((t[(t.Granted = 90)] = "Granted"),
      (t[(t.Failed = 91)] = "Failed"),
      (t[(t.Rejected = 92)] = "Rejected"),
      (t[(t.RejectedIdent = 93)] = "RejectedIdent"));
  })(GIe || (vr.Socks4Response = GIe = {}));
  var WIe;
  (function (t) {
    ((t[(t.NoAuth = 0)] = "NoAuth"),
      (t[(t.GSSApi = 1)] = "GSSApi"),
      (t[(t.UserPass = 2)] = "UserPass"));
  })(WIe || (vr.Socks5Auth = WIe = {}));
  var lPt = 128;
  vr.SOCKS5_CUSTOM_AUTH_START = lPt;
  var cPt = 254;
  vr.SOCKS5_CUSTOM_AUTH_END = cPt;
  var uPt = 255;
  vr.SOCKS5_NO_ACCEPTABLE_AUTH = uPt;
  var HIe;
  (function (t) {
    ((t[(t.Granted = 0)] = "Granted"),
      (t[(t.Failure = 1)] = "Failure"),
      (t[(t.NotAllowed = 2)] = "NotAllowed"),
      (t[(t.NetworkUnreachable = 3)] = "NetworkUnreachable"),
      (t[(t.HostUnreachable = 4)] = "HostUnreachable"),
      (t[(t.ConnectionRefused = 5)] = "ConnectionRefused"),
      (t[(t.TTLExpired = 6)] = "TTLExpired"),
      (t[(t.CommandNotSupported = 7)] = "CommandNotSupported"),
      (t[(t.AddressNotSupported = 8)] = "AddressNotSupported"));
  })(HIe || (vr.Socks5Response = HIe = {}));
  var jIe;
  (function (t) {
    ((t[(t.IPv4 = 1)] = "IPv4"), (t[(t.Hostname = 3)] = "Hostname"), (t[(t.IPv6 = 4)] = "IPv6"));
  })(jIe || (vr.Socks5HostType = jIe = {}));
  var zIe;
  (function (t) {
    ((t[(t.Created = 0)] = "Created"),
      (t[(t.Connecting = 1)] = "Connecting"),
      (t[(t.Connected = 2)] = "Connected"),
      (t[(t.SentInitialHandshake = 3)] = "SentInitialHandshake"),
      (t[(t.ReceivedInitialHandshakeResponse = 4)] = "ReceivedInitialHandshakeResponse"),
      (t[(t.SentAuthentication = 5)] = "SentAuthentication"),
      (t[(t.ReceivedAuthenticationResponse = 6)] = "ReceivedAuthenticationResponse"),
      (t[(t.SentFinalHandshake = 7)] = "SentFinalHandshake"),
      (t[(t.ReceivedFinalResponse = 8)] = "ReceivedFinalResponse"),
      (t[(t.BoundWaitingForConnection = 9)] = "BoundWaitingForConnection"),
      (t[(t.Established = 10)] = "Established"),
      (t[(t.Disconnected = 11)] = "Disconnected"),
      (t[(t.Error = 99)] = "Error"));
  })(zIe || (vr.SocksClientState = zIe = {}));
});
var UV = A((vy) => {
  "use strict";
  Object.defineProperty(vy, "__esModule", { value: !0 });
  vy.shuffleArray = vy.SocksClientError = void 0;
  var $V = class extends Error {
    constructor(e, r) {
      (super(e), (this.options = r));
    }
  };
  vy.SocksClientError = $V;
  function dPt(t) {
    for (let e = t.length - 1; e > 0; e--) {
      let r = Math.floor(Math.random() * (e + 1));
      [t[e], t[r]] = [t[r], t[e]];
    }
  }
  vy.shuffleArray = dPt;
});
var WD = A((Cm) => {
  "use strict";
  Object.defineProperty(Cm, "__esModule", { value: !0 });
  Cm.isInSubnet = pPt;
  Cm.isCorrect = mPt;
  Cm.numberToPaddedHex = VIe;
  Cm.stringToPaddedHex = fPt;
  Cm.testBit = hPt;
  function pPt(t) {
    return this.subnetMask < t.subnetMask ? !1 : this.mask(t.subnetMask) === t.mask();
  }
  function mPt(t) {
    return function () {
      return this.addressMinusSuffix !== this.correctForm()
        ? !1
        : this.subnetMask === t && !this.parsedSubnet
          ? !0
          : this.parsedSubnet === String(this.subnetMask);
    };
  }
  function VIe(t) {
    return t.toString(16).padStart(2, "0");
  }
  function fPt(t) {
    return VIe(parseInt(t, 10));
  }
  function hPt(t, e) {
    let { length: r } = t;
    if (e > r) return !1;
    let n = r - e;
    return t.substring(n, n + 1) === "1";
  }
});
var qV = A((za) => {
  "use strict";
  Object.defineProperty(za, "__esModule", { value: !0 });
  za.RE_SUBNET_STRING = za.RE_ADDRESS = za.GROUPS = za.BITS = void 0;
  za.BITS = 32;
  za.GROUPS = 4;
  za.RE_ADDRESS =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/g;
  za.RE_SUBNET_STRING = /\/\d{1,2}$/;
});
var jD = A((HD) => {
  "use strict";
  Object.defineProperty(HD, "__esModule", { value: !0 });
  HD.AddressError = void 0;
  var GV = class extends Error {
    constructor(e, r) {
      (super(e), (this.name = "AddressError"), (this.parseMessage = r));
    }
  };
  HD.AddressError = GV;
});
var HV = A((Va) => {
  "use strict";
  var gPt =
      (Va && Va.__createBinding) ||
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
    yPt =
      (Va && Va.__setModuleDefault) ||
      (Object.create
        ? function (t, e) {
            Object.defineProperty(t, "default", { enumerable: !0, value: e });
          }
        : function (t, e) {
            t.default = e;
          }),
    KIe =
      (Va && Va.__importStar) ||
      function (t) {
        if (t && t.__esModule) return t;
        var e = {};
        if (t != null)
          for (var r in t)
            r !== "default" && Object.prototype.hasOwnProperty.call(t, r) && gPt(e, t, r);
        return (yPt(e, t), e);
      };
  Object.defineProperty(Va, "__esModule", { value: !0 });
  Va.Address4 = void 0;
  var by = KIe(WD()),
    js = KIe(qV()),
    wx = jD(),
    WV = class t {
      constructor(e) {
        ((this.groups = js.GROUPS),
          (this.parsedAddress = []),
          (this.parsedSubnet = ""),
          (this.subnet = "/32"),
          (this.subnetMask = 32),
          (this.v4 = !0),
          (this.isCorrect = by.isCorrect(js.BITS)),
          (this.isInSubnet = by.isInSubnet),
          (this.address = e));
        let r = js.RE_SUBNET_STRING.exec(e);
        if (r) {
          if (
            ((this.parsedSubnet = r[0].replace("/", "")),
            (this.subnetMask = parseInt(this.parsedSubnet, 10)),
            (this.subnet = `/${this.subnetMask}`),
            this.subnetMask < 0 || this.subnetMask > js.BITS)
          )
            throw new wx.AddressError("Invalid subnet mask.");
          e = e.replace(js.RE_SUBNET_STRING, "");
        }
        ((this.addressMinusSuffix = e), (this.parsedAddress = this.parse(e)));
      }
      static isValid(e) {
        try {
          return (new t(e), !0);
        } catch {
          return !1;
        }
      }
      parse(e) {
        let r = e.split(".");
        if (!e.match(js.RE_ADDRESS)) throw new wx.AddressError("Invalid IPv4 address.");
        return r;
      }
      correctForm() {
        return this.parsedAddress.map((e) => parseInt(e, 10)).join(".");
      }
      static fromHex(e) {
        let r = e.replace(/:/g, "").padStart(8, "0"),
          n = [],
          o;
        for (o = 0; o < 8; o += 2) {
          let i = r.slice(o, o + 2);
          n.push(parseInt(i, 16));
        }
        return new t(n.join("."));
      }
      static fromInteger(e) {
        return t.fromHex(e.toString(16));
      }
      static fromArpa(e) {
        let n = e
          .replace(/(\.in-addr\.arpa)?\.$/, "")
          .split(".")
          .reverse()
          .join(".");
        return new t(n);
      }
      toHex() {
        return this.parsedAddress.map((e) => by.stringToPaddedHex(e)).join(":");
      }
      toArray() {
        return this.parsedAddress.map((e) => parseInt(e, 10));
      }
      toGroup6() {
        let e = [],
          r;
        for (r = 0; r < js.GROUPS; r += 2)
          e.push(
            `${by.stringToPaddedHex(this.parsedAddress[r])}${by.stringToPaddedHex(this.parsedAddress[r + 1])}`,
          );
        return e.join(":");
      }
      bigInt() {
        return BigInt(`0x${this.parsedAddress.map((e) => by.stringToPaddedHex(e)).join("")}`);
      }
      _startAddress() {
        return BigInt(`0b${this.mask() + "0".repeat(js.BITS - this.subnetMask)}`);
      }
      startAddress() {
        return t.fromBigInt(this._startAddress());
      }
      startAddressExclusive() {
        let e = BigInt("1");
        return t.fromBigInt(this._startAddress() + e);
      }
      _endAddress() {
        return BigInt(`0b${this.mask() + "1".repeat(js.BITS - this.subnetMask)}`);
      }
      endAddress() {
        return t.fromBigInt(this._endAddress());
      }
      endAddressExclusive() {
        let e = BigInt("1");
        return t.fromBigInt(this._endAddress() - e);
      }
      static fromBigInt(e) {
        return t.fromHex(e.toString(16));
      }
      static fromByteArray(e) {
        if (e.length !== 4) throw new wx.AddressError("IPv4 addresses require exactly 4 bytes");
        for (let r = 0; r < e.length; r++)
          if (!Number.isInteger(e[r]) || e[r] < 0 || e[r] > 255)
            throw new wx.AddressError("All bytes must be integers between 0 and 255");
        return this.fromUnsignedByteArray(e);
      }
      static fromUnsignedByteArray(e) {
        if (e.length !== 4) throw new wx.AddressError("IPv4 addresses require exactly 4 bytes");
        let r = e.join(".");
        return new t(r);
      }
      mask(e) {
        return (e === void 0 && (e = this.subnetMask), this.getBitsBase2(0, e));
      }
      getBitsBase2(e, r) {
        return this.binaryZeroPad().slice(e, r);
      }
      reverseForm(e) {
        e || (e = {});
        let r = this.correctForm().split(".").reverse().join(".");
        return e.omitSuffix ? r : `${r}.in-addr.arpa.`;
      }
      isMulticast() {
        return this.isInSubnet(new t("224.0.0.0/4"));
      }
      binaryZeroPad() {
        return this.bigInt().toString(2).padStart(js.BITS, "0");
      }
      groupForV6() {
        let e = this.parsedAddress;
        return this.address.replace(
          js.RE_ADDRESS,
          `<span class="hover-group group-v4 group-6">${e.slice(0, 2).join(".")}</span>.<span class="hover-group group-v4 group-7">${e.slice(2, 4).join(".")}</span>`,
        );
      }
    };
  Va.Address4 = WV;
});
var jV = A((Zr) => {
  "use strict";
  Object.defineProperty(Zr, "__esModule", { value: !0 });
  Zr.RE_URL_WITH_PORT =
    Zr.RE_URL =
    Zr.RE_ZONE_STRING =
    Zr.RE_SUBNET_STRING =
    Zr.RE_BAD_ADDRESS =
    Zr.RE_BAD_CHARACTERS =
    Zr.TYPES =
    Zr.SCOPES =
    Zr.GROUPS =
    Zr.BITS =
      void 0;
  Zr.BITS = 128;
  Zr.GROUPS = 8;
  Zr.SCOPES = {
    0: "Reserved",
    1: "Interface local",
    2: "Link local",
    4: "Admin local",
    5: "Site local",
    8: "Organization local",
    14: "Global",
    15: "Reserved",
  };
  Zr.TYPES = {
    "ff01::1/128": "Multicast (All nodes on this interface)",
    "ff01::2/128": "Multicast (All routers on this interface)",
    "ff02::1/128": "Multicast (All nodes on this link)",
    "ff02::2/128": "Multicast (All routers on this link)",
    "ff05::2/128": "Multicast (All routers in this site)",
    "ff02::5/128": "Multicast (OSPFv3 AllSPF routers)",
    "ff02::6/128": "Multicast (OSPFv3 AllDR routers)",
    "ff02::9/128": "Multicast (RIP routers)",
    "ff02::a/128": "Multicast (EIGRP routers)",
    "ff02::d/128": "Multicast (PIM routers)",
    "ff02::16/128": "Multicast (MLDv2 reports)",
    "ff01::fb/128": "Multicast (mDNSv6)",
    "ff02::fb/128": "Multicast (mDNSv6)",
    "ff05::fb/128": "Multicast (mDNSv6)",
    "ff02::1:2/128": "Multicast (All DHCP servers and relay agents on this link)",
    "ff05::1:2/128": "Multicast (All DHCP servers and relay agents in this site)",
    "ff02::1:3/128": "Multicast (All DHCP servers on this link)",
    "ff05::1:3/128": "Multicast (All DHCP servers in this site)",
    "::/128": "Unspecified",
    "::1/128": "Loopback",
    "ff00::/8": "Multicast",
    "fe80::/10": "Link-local unicast",
  };
  Zr.RE_BAD_CHARACTERS = /([^0-9a-f:/%])/gi;
  Zr.RE_BAD_ADDRESS = /([0-9a-f]{5,}|:{3,}|[^:]:$|^:[^:]|\/$)/gi;
  Zr.RE_SUBNET_STRING = /\/\d{1,3}(?=%|$)/;
  Zr.RE_ZONE_STRING = /%.*$/;
  Zr.RE_URL = /^\[{0,1}([0-9a-f:]+)\]{0,1}/;
  Zr.RE_URL_WITH_PORT = /\[([0-9a-f:]+)\]:([0-9]{1,5})/;
});
var zV = A((Sy) => {
  "use strict";
  Object.defineProperty(Sy, "__esModule", { value: !0 });
  Sy.spanAllZeroes = ZIe;
  Sy.spanAll = vPt;
  Sy.spanLeadingZeroes = bPt;
  Sy.simpleGroup = SPt;
  function ZIe(t) {
    return t.replace(/(0+)/g, '<span class="zero">$1</span>');
  }
  function vPt(t, e = 0) {
    return t
      .split("")
      .map((n, o) => `<span class="digit value-${n} position-${o + e}">${ZIe(n)}</span>`)
      .join("");
  }
  function XIe(t) {
    return t.replace(/^(0+)/, '<span class="zero">$1</span>');
  }
  function bPt(t) {
    return t
      .split(":")
      .map((r) => XIe(r))
      .join(":");
  }
  function SPt(t, e = 0) {
    return t
      .split(":")
      .map((n, o) =>
        /group-v4/.test(n) ? n : `<span class="hover-group group-${o + e}">${XIe(n)}</span>`,
      );
  }
});
var YIe = A((li) => {
  "use strict";
  var wPt =
      (li && li.__createBinding) ||
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
    _Pt =
      (li && li.__setModuleDefault) ||
      (Object.create
        ? function (t, e) {
            Object.defineProperty(t, "default", { enumerable: !0, value: e });
          }
        : function (t, e) {
            t.default = e;
          }),
    xPt =
      (li && li.__importStar) ||
      function (t) {
        if (t && t.__esModule) return t;
        var e = {};
        if (t != null)
          for (var r in t)
            r !== "default" && Object.prototype.hasOwnProperty.call(t, r) && wPt(e, t, r);
        return (_Pt(e, t), e);
      };
  Object.defineProperty(li, "__esModule", { value: !0 });
  li.ADDRESS_BOUNDARY = void 0;
  li.groupPossibilities = VD;
  li.padGroup = zD;
  li.simpleRegularExpression = RPt;
  li.possibleElisions = EPt;
  var APt = xPt(jV());
  function VD(t) {
    return `(${t.join("|")})`;
  }
  function zD(t) {
    return t.length < 4 ? `0{0,${4 - t.length}}${t}` : t;
  }
  li.ADDRESS_BOUNDARY = "[^A-Fa-f0-9:]";
  function RPt(t) {
    let e = [];
    t.forEach((n, o) => {
      parseInt(n, 16) === 0 && e.push(o);
    });
    let r = e.map((n) =>
      t
        .map((o, i) => {
          if (i === n) {
            let s = i === 0 || i === APt.GROUPS - 1 ? ":" : "";
            return VD([zD(o), s]);
          }
          return zD(o);
        })
        .join(":"),
    );
    return (r.push(t.map(zD).join(":")), VD(r));
  }
  function EPt(t, e, r) {
    let n = e ? "" : ":",
      o = r ? "" : ":",
      i = [];
    (!e && !r && i.push("::"),
      e && r && i.push(""),
      ((r && !e) || (!r && e)) && i.push(":"),
      i.push(`${n}(:0{1,4}){1,${t - 1}}`),
      i.push(`(0{1,4}:){1,${t - 1}}${o}`),
      i.push(`(0{1,4}:){${t - 1}}0{1,4}`));
    for (let s = 1; s < t - 1; s++)
      for (let a = 1; a < t - s; a++) i.push(`(0{1,4}:){${a}}:(0{1,4}:){${t - a - s - 1}}0{1,4}`);
    return VD(i);
  }
});
var tke = A((Ka) => {
  "use strict";
  var CPt =
      (Ka && Ka.__createBinding) ||
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
    TPt =
      (Ka && Ka.__setModuleDefault) ||
      (Object.create
        ? function (t, e) {
            Object.defineProperty(t, "default", { enumerable: !0, value: e });
          }
        : function (t, e) {
            t.default = e;
          }),
    XD =
      (Ka && Ka.__importStar) ||
      function (t) {
        if (t && t.__esModule) return t;
        var e = {};
        if (t != null)
          for (var r in t)
            r !== "default" && Object.prototype.hasOwnProperty.call(t, r) && CPt(e, t, r);
        return (TPt(e, t), e);
      };
  Object.defineProperty(Ka, "__esModule", { value: !0 });
  Ka.Address6 = void 0;
  var JIe = XD(WD()),
    VV = XD(qV()),
    br = XD(jV()),
    KV = XD(zV()),
    Tm = HV(),
    Pm = YIe(),
    cc = jD(),
    KD = WD();
  function ZD(t) {
    if (!t) throw new Error("Assertion failed.");
  }
  function PPt(t) {
    let e = /(\d+)(\d{3})/;
    for (; e.test(t); ) t = t.replace(e, "$1,$2");
    return t;
  }
  function IPt(t) {
    return (
      (t = t.replace(/^(0{1,})([1-9]+)$/, '<span class="parse-error">$1</span>$2')),
      (t = t.replace(/^(0{1,})(0)$/, '<span class="parse-error">$1</span>$2')),
      t
    );
  }
  function kPt(t, e) {
    let r = [],
      n = [],
      o;
    for (o = 0; o < t.length; o++) o < e[0] ? r.push(t[o]) : o > e[1] && n.push(t[o]);
    return r.concat(["compact"]).concat(n);
  }
  function QIe(t) {
    return parseInt(t, 16).toString(16).padStart(4, "0");
  }
  function eke(t) {
    return t & 255;
  }
  var ZV = class t {
    constructor(e, r) {
      ((this.addressMinusSuffix = ""),
        (this.parsedSubnet = ""),
        (this.subnet = "/128"),
        (this.subnetMask = 128),
        (this.v4 = !1),
        (this.zone = ""),
        (this.isInSubnet = JIe.isInSubnet),
        (this.isCorrect = JIe.isCorrect(br.BITS)),
        r === void 0 ? (this.groups = br.GROUPS) : (this.groups = r),
        (this.address = e));
      let n = br.RE_SUBNET_STRING.exec(e);
      if (n) {
        if (
          ((this.parsedSubnet = n[0].replace("/", "")),
          (this.subnetMask = parseInt(this.parsedSubnet, 10)),
          (this.subnet = `/${this.subnetMask}`),
          Number.isNaN(this.subnetMask) || this.subnetMask < 0 || this.subnetMask > br.BITS)
        )
          throw new cc.AddressError("Invalid subnet mask.");
        e = e.replace(br.RE_SUBNET_STRING, "");
      } else if (/\//.test(e)) throw new cc.AddressError("Invalid subnet mask.");
      let o = br.RE_ZONE_STRING.exec(e);
      (o && ((this.zone = o[0]), (e = e.replace(br.RE_ZONE_STRING, ""))),
        (this.addressMinusSuffix = e),
        (this.parsedAddress = this.parse(this.addressMinusSuffix)));
    }
    static isValid(e) {
      try {
        return (new t(e), !0);
      } catch {
        return !1;
      }
    }
    static fromBigInt(e) {
      let r = e.toString(16).padStart(32, "0"),
        n = [],
        o;
      for (o = 0; o < br.GROUPS; o++) n.push(r.slice(o * 4, (o + 1) * 4));
      return new t(n.join(":"));
    }
    static fromURL(e) {
      let r,
        n = null,
        o;
      if (e.indexOf("[") !== -1 && e.indexOf("]:") !== -1) {
        if (((o = br.RE_URL_WITH_PORT.exec(e)), o === null))
          return { error: "failed to parse address with port", address: null, port: null };
        ((r = o[1]), (n = o[2]));
      } else if (e.indexOf("/") !== -1) {
        if (((e = e.replace(/^[a-z0-9]+:\/\//, "")), (o = br.RE_URL.exec(e)), o === null))
          return { error: "failed to parse address from URL", address: null, port: null };
        r = o[1];
      } else r = e;
      return (
        n ? ((n = parseInt(n, 10)), (n < 0 || n > 65536) && (n = null)) : (n = null),
        { address: new t(r), port: n }
      );
    }
    static fromAddress4(e) {
      let r = new Tm.Address4(e),
        n = br.BITS - (VV.BITS - r.subnetMask);
      return new t(`::ffff:${r.correctForm()}/${n}`);
    }
    static fromArpa(e) {
      let r = e.replace(/(\.ip6\.arpa)?\.$/, ""),
        n = 7;
      if (r.length !== 63) throw new cc.AddressError("Invalid 'ip6.arpa' form.");
      let o = r.split(".").reverse();
      for (let i = n; i > 0; i--) {
        let s = i * 4;
        o.splice(s, 0, ":");
      }
      return ((r = o.join("")), new t(r));
    }
    microsoftTranscription() {
      return `${this.correctForm().replace(/:/g, "-")}.ipv6-literal.net`;
    }
    mask(e = this.subnetMask) {
      return this.getBitsBase2(0, e);
    }
    possibleSubnets(e = 128) {
      let r = br.BITS - this.subnetMask,
        n = Math.abs(e - br.BITS),
        o = r - n;
      return o < 0 ? "0" : PPt((BigInt("2") ** BigInt(o)).toString(10));
    }
    _startAddress() {
      return BigInt(`0b${this.mask() + "0".repeat(br.BITS - this.subnetMask)}`);
    }
    startAddress() {
      return t.fromBigInt(this._startAddress());
    }
    startAddressExclusive() {
      let e = BigInt("1");
      return t.fromBigInt(this._startAddress() + e);
    }
    _endAddress() {
      return BigInt(`0b${this.mask() + "1".repeat(br.BITS - this.subnetMask)}`);
    }
    endAddress() {
      return t.fromBigInt(this._endAddress());
    }
    endAddressExclusive() {
      let e = BigInt("1");
      return t.fromBigInt(this._endAddress() - e);
    }
    getScope() {
      let e = br.SCOPES[parseInt(this.getBits(12, 16).toString(10), 10)];
      return (
        this.getType() === "Global unicast" && e !== "Link local" && (e = "Global"),
        e || "Unknown"
      );
    }
    getType() {
      for (let e of Object.keys(br.TYPES)) if (this.isInSubnet(new t(e))) return br.TYPES[e];
      return "Global unicast";
    }
    getBits(e, r) {
      return BigInt(`0b${this.getBitsBase2(e, r)}`);
    }
    getBitsBase2(e, r) {
      return this.binaryZeroPad().slice(e, r);
    }
    getBitsBase16(e, r) {
      let n = r - e;
      if (n % 4 !== 0) throw new Error("Length of bits to retrieve must be divisible by four");
      return this.getBits(e, r)
        .toString(16)
        .padStart(n / 4, "0");
    }
    getBitsPastSubnet() {
      return this.getBitsBase2(this.subnetMask, br.BITS);
    }
    reverseForm(e) {
      e || (e = {});
      let r = Math.floor(this.subnetMask / 4),
        n = this.canonicalForm().replace(/:/g, "").split("").slice(0, r).reverse().join(".");
      return r > 0 ? (e.omitSuffix ? n : `${n}.ip6.arpa.`) : e.omitSuffix ? "" : "ip6.arpa.";
    }
    correctForm() {
      let e,
        r = [],
        n = 0,
        o = [];
      for (e = 0; e < this.parsedAddress.length; e++) {
        let a = parseInt(this.parsedAddress[e], 16);
        (a === 0 && n++, a !== 0 && n > 0 && (n > 1 && o.push([e - n, e - 1]), (n = 0)));
      }
      n > 1 && o.push([this.parsedAddress.length - n, this.parsedAddress.length - 1]);
      let i = o.map((a) => a[1] - a[0] + 1);
      if (o.length > 0) {
        let a = i.indexOf(Math.max(...i));
        r = kPt(this.parsedAddress, o[a]);
      } else r = this.parsedAddress;
      for (e = 0; e < r.length; e++) r[e] !== "compact" && (r[e] = parseInt(r[e], 16).toString(16));
      let s = r.join(":");
      return (
        (s = s.replace(/^compact$/, "::")),
        (s = s.replace(/(^compact)|(compact$)/, ":")),
        (s = s.replace(/compact/, "")),
        s
      );
    }
    binaryZeroPad() {
      return this.bigInt().toString(2).padStart(br.BITS, "0");
    }
    parse4in6(e) {
      let r = e.split(":"),
        o = r.slice(-1)[0].match(VV.RE_ADDRESS);
      if (o) {
        ((this.parsedAddress4 = o[0]), (this.address4 = new Tm.Address4(this.parsedAddress4)));
        for (let i = 0; i < this.address4.groups; i++)
          if (/^0[0-9]+/.test(this.address4.parsedAddress[i]))
            throw new cc.AddressError(
              "IPv4 addresses can't have leading zeroes.",
              e.replace(VV.RE_ADDRESS, this.address4.parsedAddress.map(IPt).join(".")),
            );
        ((this.v4 = !0), (r[r.length - 1] = this.address4.toGroup6()), (e = r.join(":")));
      }
      return e;
    }
    parse(e) {
      e = this.parse4in6(e);
      let r = e.match(br.RE_BAD_CHARACTERS);
      if (r)
        throw new cc.AddressError(
          `Bad character${r.length > 1 ? "s" : ""} detected in address: ${r.join("")}`,
          e.replace(br.RE_BAD_CHARACTERS, '<span class="parse-error">$1</span>'),
        );
      let n = e.match(br.RE_BAD_ADDRESS);
      if (n)
        throw new cc.AddressError(
          `Address failed regex: ${n.join("")}`,
          e.replace(br.RE_BAD_ADDRESS, '<span class="parse-error">$1</span>'),
        );
      let o = [],
        i = e.split("::");
      if (i.length === 2) {
        let s = i[0].split(":"),
          a = i[1].split(":");
        (s.length === 1 && s[0] === "" && (s = []), a.length === 1 && a[0] === "" && (a = []));
        let l = this.groups - (s.length + a.length);
        if (!l) throw new cc.AddressError("Error parsing groups");
        ((this.elidedGroups = l),
          (this.elisionBegin = s.length),
          (this.elisionEnd = s.length + this.elidedGroups),
          (o = o.concat(s)));
        for (let c = 0; c < l; c++) o.push("0");
        o = o.concat(a);
      } else if (i.length === 1) ((o = e.split(":")), (this.elidedGroups = 0));
      else throw new cc.AddressError("Too many :: groups found");
      if (((o = o.map((s) => parseInt(s, 16).toString(16))), o.length !== this.groups))
        throw new cc.AddressError("Incorrect number of groups found");
      return o;
    }
    canonicalForm() {
      return this.parsedAddress.map(QIe).join(":");
    }
    decimal() {
      return this.parsedAddress.map((e) => parseInt(e, 16).toString(10).padStart(5, "0")).join(":");
    }
    bigInt() {
      return BigInt(`0x${this.parsedAddress.map(QIe).join("")}`);
    }
    to4() {
      let e = this.binaryZeroPad().split("");
      return Tm.Address4.fromHex(BigInt(`0b${e.slice(96, 128).join("")}`).toString(16));
    }
    to4in6() {
      let e = this.to4(),
        n = new t(this.parsedAddress.slice(0, 6).join(":"), 6).correctForm(),
        o = "";
      return (/:$/.test(n) || (o = ":"), n + o + e.address);
    }
    inspectTeredo() {
      let e = this.getBitsBase16(0, 32),
        n = (this.getBits(80, 96) ^ BigInt("0xffff")).toString(),
        o = Tm.Address4.fromHex(this.getBitsBase16(32, 64)),
        i = this.getBits(96, 128),
        s = Tm.Address4.fromHex((i ^ BigInt("0xffffffff")).toString(16)),
        a = this.getBitsBase2(64, 80),
        l = (0, KD.testBit)(a, 15),
        c = (0, KD.testBit)(a, 14),
        u = (0, KD.testBit)(a, 8),
        p = (0, KD.testBit)(a, 9),
        m = BigInt(`0b${a.slice(2, 6) + a.slice(8, 16)}`).toString(10);
      return {
        prefix: `${e.slice(0, 4)}:${e.slice(4, 8)}`,
        server4: o.address,
        client4: s.address,
        flags: a,
        coneNat: l,
        microsoft: { reserved: c, universalLocal: p, groupIndividual: u, nonce: m },
        udpPort: n,
      };
    }
    inspect6to4() {
      let e = this.getBitsBase16(0, 16),
        r = Tm.Address4.fromHex(this.getBitsBase16(16, 48));
      return { prefix: e.slice(0, 4), gateway: r.address };
    }
    to6to4() {
      if (!this.is4()) return null;
      let e = ["2002", this.getBitsBase16(96, 112), this.getBitsBase16(112, 128), "", "/16"].join(
        ":",
      );
      return new t(e);
    }
    toByteArray() {
      let e = this.bigInt().toString(16),
        n = `${"0".repeat(e.length % 2)}${e}`,
        o = [];
      for (let i = 0, s = n.length; i < s; i += 2) o.push(parseInt(n.substring(i, i + 2), 16));
      return o;
    }
    toUnsignedByteArray() {
      return this.toByteArray().map(eke);
    }
    static fromByteArray(e) {
      return this.fromUnsignedByteArray(e.map(eke));
    }
    static fromUnsignedByteArray(e) {
      let r = BigInt("256"),
        n = BigInt("0"),
        o = BigInt("1");
      for (let i = e.length - 1; i >= 0; i--) ((n += o * BigInt(e[i].toString(10))), (o *= r));
      return t.fromBigInt(n);
    }
    isCanonical() {
      return this.addressMinusSuffix === this.canonicalForm();
    }
    isLinkLocal() {
      return (
        this.getBitsBase2(0, 64) ===
        "1111111010000000000000000000000000000000000000000000000000000000"
      );
    }
    isMulticast() {
      return this.getType() === "Multicast";
    }
    is4() {
      return this.v4;
    }
    isTeredo() {
      return this.isInSubnet(new t("2001::/32"));
    }
    is6to4() {
      return this.isInSubnet(new t("2002::/16"));
    }
    isLoopback() {
      return this.getType() === "Loopback";
    }
    href(e) {
      return (e === void 0 ? (e = "") : (e = `:${e}`), `http://[${this.correctForm()}]${e}/`);
    }
    link(e) {
      (e || (e = {}),
        e.className === void 0 && (e.className = ""),
        e.prefix === void 0 && (e.prefix = "/#address="),
        e.v4 === void 0 && (e.v4 = !1));
      let r = this.correctForm;
      e.v4 && (r = this.to4in6);
      let n = r.call(this);
      return e.className
        ? `<a href="${e.prefix}${n}" class="${e.className}">${n}</a>`
        : `<a href="${e.prefix}${n}">${n}</a>`;
    }
    group() {
      if (this.elidedGroups === 0) return KV.simpleGroup(this.address).join(":");
      (ZD(typeof this.elidedGroups == "number"), ZD(typeof this.elisionBegin == "number"));
      let e = [],
        [r, n] = this.address.split("::");
      r.length ? e.push(...KV.simpleGroup(r)) : e.push("");
      let o = ["hover-group"];
      for (let i = this.elisionBegin; i < this.elisionBegin + this.elidedGroups; i++)
        o.push(`group-${i}`);
      return (
        e.push(`<span class="${o.join(" ")}"></span>`),
        n.length ? e.push(...KV.simpleGroup(n, this.elisionEnd)) : e.push(""),
        this.is4() &&
          (ZD(this.address4 instanceof Tm.Address4), e.pop(), e.push(this.address4.groupForV6())),
        e.join(":")
      );
    }
    regularExpressionString(e = !1) {
      let r = [],
        n = new t(this.correctForm());
      if (n.elidedGroups === 0) r.push((0, Pm.simpleRegularExpression)(n.parsedAddress));
      else if (n.elidedGroups === br.GROUPS) r.push((0, Pm.possibleElisions)(br.GROUPS));
      else {
        let o = n.address.split("::");
        (o[0].length && r.push((0, Pm.simpleRegularExpression)(o[0].split(":"))),
          ZD(typeof n.elidedGroups == "number"),
          r.push((0, Pm.possibleElisions)(n.elidedGroups, o[0].length !== 0, o[1].length !== 0)),
          o[1].length && r.push((0, Pm.simpleRegularExpression)(o[1].split(":"))),
          (r = [r.join(":")]));
      }
      return (
        e ||
          (r = [
            "(?=^|",
            Pm.ADDRESS_BOUNDARY,
            "|[^\\w\\:])(",
            ...r,
            ")(?=[^\\w\\:]|",
            Pm.ADDRESS_BOUNDARY,
            "|$)",
          ]),
        r.join("")
      );
    }
    regularExpression(e = !1) {
      return new RegExp(this.regularExpressionString(e), "i");
    }
  };
  Ka.Address6 = ZV;
});
