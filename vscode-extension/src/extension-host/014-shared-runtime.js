function ddt(t) {
  return Number.isFinite(t) ? Math.max(0, Math.min(Fut, Math.trunc(t))) : 0;
}
function pdt(t) {
  return Number.isFinite(t) ? Math.max(0, t) : Number.MAX_SAFE_INTEGER;
}
function Mo(t) {
  let e = t.fileInfo.size;
  return !Number.isFinite(e) || e === Number.MAX_SAFE_INTEGER;
}
function Cw(t, e, r) {
  return Mo(t) && t.position - e > r;
}
function mdt(t) {
  let e = t.fileInfo.size,
    r = Number.isFinite(e) ? Math.max(0, e - t.position) : Number.MAX_SAFE_INTEGER;
  return Math.min(r, $ut);
}
function fdt(t) {
  if (t instanceof Jt || t instanceof zl) return !0;
  if (!(t instanceof Error)) return !1;
  if (Kut.has(t.message) || Xut.has(t.code)) return !0;
  for (let e of Zut) if (t.message.startsWith(e)) return !0;
  return !1;
}
function Cpe(t, e = Ta) {
  let r = [t.compressedSize, t.uncompressedSize];
  for (let n of r) if (!Number.isFinite(n) || n < 0 || n > e) return !1;
  return !0;
}
function hdt() {
  return {
    hasContentTypesEntry: !1,
    hasParsedContentTypesEntry: !1,
    isParsingContentTypes: !1,
    hasUnparseableContentTypes: !1,
    hasWordDirectory: !1,
    hasPresentationDirectory: !1,
    hasSpreadsheetDirectory: !1,
    hasThreeDimensionalModelEntry: !1,
  };
}
function gdt(t, e) {
  (e.startsWith("word/") && (t.hasWordDirectory = !0),
    e.startsWith("ppt/") && (t.hasPresentationDirectory = !0),
    e.startsWith("xl/") && (t.hasSpreadsheetDirectory = !0),
    e.startsWith("3D/") && e.endsWith(".model") && (t.hasThreeDimensionalModelEntry = !0));
}
function Tpe(t) {
  if (
    !(
      !t.hasContentTypesEntry ||
      t.hasUnparseableContentTypes ||
      t.isParsingContentTypes ||
      t.hasParsedContentTypesEntry
    )
  ) {
    if (t.hasWordDirectory)
      return {
        ext: "docx",
        mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };
    if (t.hasPresentationDirectory)
      return {
        ext: "pptx",
        mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      };
    if (t.hasSpreadsheetDirectory)
      return {
        ext: "xlsx",
        mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      };
    if (t.hasThreeDimensionalModelEntry) return { ext: "3mf", mime: "model/3mf" };
  }
}
function ydt(t) {
  let e = t.indexOf('.main+xml"');
  if (e === -1) {
    let o = "application/vnd.ms-package.3dmanufacturing-3dmodel+xml";
    return t.includes(`ContentType="${o}"`) ? o : void 0;
  }
  let r = t.slice(0, e),
    n = r.lastIndexOf('"');
  return r.slice(n + 1);
}
async function vdt(t, e) {
  return new fu(e).fromTokenizer(t);
}
async function bdt(t, e) {
  return new fu(e).toDetectionStream(t, e);
}
var Sg,
  Fut,
  Ta,
  ype,
  $ut,
  ts,
  GI,
  vpe,
  Uut,
  qut,
  bpe,
  jG,
  Spe,
  wpe,
  Gut,
  Wut,
  Hut,
  jut,
  zut,
  _pe,
  xpe,
  Ape,
  Vut,
  Rpe,
  Kut,
  Zut,
  Xut,
  zl,
  Ppe,
  qI,
  Qut,
  fu,
  Sdt,
  wdt,
  Dpe = g(() => {
    _w();
    Gde();
    lpe();
    cpe();
    mpe();
    gpe();
    ((Sg = 4100),
      (Fut = Sg - 2),
      (Ta = 1024 * 1024),
      (ype = 1024),
      ($ut = 2 ** 31 - 1),
      (ts = 16 * 1024 * 1024),
      (GI = Ta),
      (vpe = Ta),
      (Uut = ts),
      (qut = 1),
      (bpe = 100),
      (jG = ts),
      (Spe = 64),
      (wpe = GI),
      (Gut = 256),
      (Wut = 512),
      (Hut = ts),
      (jut = 512),
      (zut = 512),
      (_pe = 256),
      (xpe = GI),
      (Ape = GI),
      (Vut = GI),
      (Rpe = ts),
      (Kut = new Set([
        "Unexpected signature",
        "Encrypted ZIP",
        "Expected Central-File-Header signature",
      ])),
      (Zut = [
        "ZIP entry count exceeds ",
        "Unsupported ZIP compression method:",
        "ZIP entry compressed data exceeds ",
        "ZIP entry decompressed data exceeds ",
        "Expected data-descriptor-signature at position ",
      ]),
      (Xut = new Set(["Z_BUF_ERROR", "Z_DATA_ERROR", "ERR_INVALID_STATE"])),
      (zl = class extends Error {}));
    ((Ppe = 134695760), (qI = 16), (Qut = qI - 1));
    $p.prototype.inflate = async function (t, e, r) {
      if (t.compressedMethod === 0) return r(e);
      if (t.compressedMethod !== 8)
        throw new Error(`Unsupported ZIP compression method: ${t.compressedMethod}`);
      let n = await Jut(e, { maximumLength: Ta });
      return r(n);
    };
    $p.prototype.unzip = async function (t) {
      let e = !1,
        r = 0,
        n = this.tokenizer.position;
      this.knownSizeDescriptorScannedBytes = 0;
      do {
        if (Cw(this.tokenizer, n, ts)) throw new zl(`ZIP stream probing exceeds ${ts} bytes`);
        let o = await this.readLocalFileHeader();
        if (!o) break;
        if ((r++, r > ype)) throw new Error(`ZIP entry count exceeds ${ype}`);
        let i = t(o);
        ((e = !!i.stop), await this.tokenizer.ignore(o.extraFieldLength));
        let s = await idt(this, o, {
          shouldBuffer: !!i.handler,
          maximumDescriptorLength: Math.min(Ta, odt(this, n)),
        });
        if ((i.handler && (await this.inflate(o, s, i.handler)), o.dataDescriptor)) {
          let a = new Uint8Array(qI);
          if ((await this.tokenizer.readBuffer(a), Mr.get(a, 0) !== Ppe))
            throw new Error(
              `Expected data-descriptor-signature at position ${this.tokenizer.position - a.length}`,
            );
        }
        if (Cw(this.tokenizer, n, ts)) throw new zl(`ZIP stream probing exceeds ${ts} bytes`);
      } while (!e);
    };
    ((fu = class t {
      constructor(e) {
        let r = ddt(e?.mpegOffsetTolerance);
        ((this.options = { ...e, mpegOffsetTolerance: r }),
          (this.detectors = [
            ...(this.options.customDetectors ?? []),
            { id: "core", detect: this.detectConfident },
            { id: "core.imprecise", detect: this.detectImprecise },
          ]),
          (this.tokenizerOptions = { abortSignal: this.options.signal }),
          (this.gzipProbeDepth = 0));
      }
      getTokenizerOptions() {
        return { ...this.tokenizerOptions };
      }
      createTokenizerFromWebStream(e) {
        return Yut($de(e, this.getTokenizerOptions()));
      }
      async parseTokenizer(e, r = 0) {
        this.detectionReentryCount = r;
        let n = e.position;
        for (let o of this.detectors) {
          let i;
          try {
            i = await o.detect(e);
          } catch (s) {
            if (s instanceof Jt || s instanceof zl) return;
            throw s;
          }
          if (i) return i;
          if (n !== e.position) return;
        }
      }
      async fromTokenizer(e) {
        try {
          return await this.parseTokenizer(e);
        } finally {
          await e.close();
        }
      }
      async fromBuffer(e) {
        if (!(e instanceof Uint8Array || e instanceof ArrayBuffer))
          throw new TypeError(
            `Expected the \`input\` argument to be of type \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``,
          );
        let r = e instanceof Uint8Array ? e : new Uint8Array(e);
        if (r?.length > 1) return this.fromTokenizer(Ude(r, this.getTokenizerOptions()));
      }
      async fromBlob(e) {
        this.options.signal?.throwIfAborted();
        let r = qde(e, this.getTokenizerOptions());
        return this.fromTokenizer(r);
      }
      async fromStream(e) {
        this.options.signal?.throwIfAborted();
        let r = this.createTokenizerFromWebStream(e);
        return this.fromTokenizer(r);
      }
      async toDetectionStream(e, r) {
        let n = Ipe(r?.sampleSize ?? Sg),
          o,
          i,
          s = e.getReader({ mode: "byob" });
        try {
          let { value: c, done: u } = await udt(s, new Uint8Array(n), this.options.signal);
          if (((i = c), !u && c))
            try {
              o = await this.fromBuffer(c.subarray(0, n));
            } catch (p) {
              if (!(p instanceof Jt)) throw p;
              o = void 0;
            }
          i = c;
        } finally {
          s.releaseLock();
        }
        let a = new TransformStream({
            async start(c) {
              c.enqueue(i);
            },
            transform(c, u) {
              u.enqueue(c);
            },
          }),
          l = e.pipeThrough(a);
        return ((l.fileType = o), l);
      }
      async detectGzip(e) {
        if (this.gzipProbeDepth >= qut) return { ext: "gz", mime: "application/gzip" };
        let r = new Ew(e),
          n = sdt(r.inflate(), Uut),
          o = Mo(e),
          i,
          s,
          a,
          l;
        if (o) {
          let c = new AbortController();
          ((i = setTimeout(() => {
            c.abort(new DOMException(`Operation timed out after ${bpe} ms`, "TimeoutError"));
          }, bpe)),
            (s =
              this.options.signal === void 0
                ? c.signal
                : AbortSignal.any([this.options.signal, c.signal])),
            (a = new t({ ...this.options, signal: s })),
            (a.gzipProbeDepth = this.gzipProbeDepth + 1));
        } else this.gzipProbeDepth++;
        try {
          l = await (a ?? this).fromStream(n);
        } catch (c) {
          if (c?.name === "AbortError" && s?.reason?.name !== "TimeoutError") throw c;
        } finally {
          (clearTimeout(i), o || this.gzipProbeDepth--);
        }
        return l?.ext === "tar"
          ? { ext: "tar.gz", mime: "application/gzip" }
          : { ext: "gz", mime: "application/gzip" };
      }
      check(e, r) {
        return Ca(this.buffer, e, r);
      }
      checkString(e, r) {
        return this.check(upe(e, r?.encoding), r);
      }
      detectConfident = async (e) => {
        if (
          ((this.buffer = new Uint8Array(Sg)),
          e.fileInfo.size === void 0 && (e.fileInfo.size = Number.MAX_SAFE_INTEGER),
          (this.tokenizer = e),
          Mo(e) &&
            (await e.peekBuffer(this.buffer, { length: 3, mayBeLess: !0 }),
            this.check([31, 139, 8])))
        )
          return this.detectGzip(e);
        if ((await e.peekBuffer(this.buffer, { length: 32, mayBeLess: !0 }), this.check([66, 77])))
          return { ext: "bmp", mime: "image/bmp" };
        if (this.check([11, 119])) return { ext: "ac3", mime: "audio/vnd.dolby.dd-raw" };
        if (this.check([120, 1])) return { ext: "dmg", mime: "application/x-apple-diskimage" };
        if (this.check([77, 90])) return { ext: "exe", mime: "application/x-msdownload" };
        if (this.check([37, 33]))
          return (
            await e.peekBuffer(this.buffer, { length: 24, mayBeLess: !0 }),
            this.checkString("PS-Adobe-", { offset: 2 }) &&
            this.checkString(" EPSF-", { offset: 14 })
              ? { ext: "eps", mime: "application/eps" }
              : { ext: "ps", mime: "application/postscript" }
          );
        if (this.check([31, 160]) || this.check([31, 157]))
          return { ext: "Z", mime: "application/x-compress" };
        if (this.check([199, 113])) return { ext: "cpio", mime: "application/x-cpio" };
        if (this.check([96, 234])) return { ext: "arj", mime: "application/x-arj" };
        if (this.check([239, 187, 191]))
          return this.detectionReentryCount >= _pe
            ? void 0
            : (this.detectionReentryCount++,
              await this.tokenizer.ignore(3),
              this.detectConfident(e));
        if (this.check([71, 73, 70])) return { ext: "gif", mime: "image/gif" };
        if (this.check([73, 73, 188])) return { ext: "jxr", mime: "image/vnd.ms-photo" };
        if (this.check([31, 139, 8])) return this.detectGzip(e);
        if (this.check([66, 90, 104])) return { ext: "bz2", mime: "application/x-bzip2" };
        if (this.checkString("ID3")) {
          await mu(e, 6, { maximumLength: 6, reason: "ID3 header prefix" });
          let r = await e.readToken(ppe),
            n = Mo(e);
          if (!Number.isFinite(r) || r < 0 || (n && (r > jG || e.position + r > jG))) return;
          if (e.position + r > e.fileInfo.size)
            return n ? void 0 : { ext: "mp3", mime: "audio/mpeg" };
          try {
            await mu(e, r, { maximumLength: n ? jG : e.fileInfo.size, reason: "ID3 payload" });
          } catch (o) {
            if (o instanceof Jt) return;
            throw o;
          }
          return this.detectionReentryCount >= _pe
            ? void 0
            : (this.detectionReentryCount++, this.parseTokenizer(e, this.detectionReentryCount));
        }
        if (this.checkString("MP+")) return { ext: "mpc", mime: "audio/x-musepack" };
        if ((this.buffer[0] === 67 || this.buffer[0] === 70) && this.check([87, 83], { offset: 1 }))
          return { ext: "swf", mime: "application/x-shockwave-flash" };
        if (this.check([255, 216, 255]))
          return this.check([247], { offset: 3 })
            ? { ext: "jls", mime: "image/jls" }
            : { ext: "jpg", mime: "image/jpeg" };
        if (this.check([79, 98, 106, 1])) return { ext: "avro", mime: "application/avro" };
        if (this.checkString("FLIF")) return { ext: "flif", mime: "image/flif" };
        if (this.checkString("8BPS")) return { ext: "psd", mime: "image/vnd.adobe.photoshop" };
        if (this.checkString("MPCK")) return { ext: "mpc", mime: "audio/x-musepack" };
        if (this.checkString("FORM")) return { ext: "aif", mime: "audio/aiff" };
        if (this.checkString("icns", { offset: 0 })) return { ext: "icns", mime: "image/icns" };
        if (this.check([80, 75, 3, 4])) {
          let r,
            n = hdt();
          try {
            await new $p(e).unzip((o) => {
              gdt(n, o.filename);
              let i = o.filename === "[Content_Types].xml",
                s = Tpe(n);
              if (!i && s) return ((r = s), { stop: !0 });
              switch (o.filename) {
                case "META-INF/mozilla.rsa":
                  return ((r = { ext: "xpi", mime: "application/x-xpinstall" }), { stop: !0 });
                case "META-INF/MANIFEST.MF":
                  return ((r = { ext: "jar", mime: "application/java-archive" }), { stop: !0 });
                case "mimetype":
                  return Cpe(o, vpe)
                    ? {
                        async handler(a) {
                          let l = new TextDecoder("utf-8").decode(a).trim();
                          r = Epe(l);
                        },
                        stop: !0,
                      }
                    : {};
                case "[Content_Types].xml":
                  return (
                    (n.hasContentTypesEntry = !0),
                    Cpe(o, vpe)
                      ? ((n.isParsingContentTypes = !0),
                        {
                          async handler(a) {
                            let l = new TextDecoder("utf-8").decode(a),
                              c = ydt(l);
                            (c && (r = Epe(c)),
                              (n.hasParsedContentTypesEntry = !0),
                              (n.isParsingContentTypes = !1));
                          },
                          stop: !0,
                        })
                      : ((n.hasUnparseableContentTypes = !0), {})
                  );
                default:
                  return /classes\d*\.dex/.test(o.filename)
                    ? ((r = { ext: "apk", mime: "application/vnd.android.package-archive" }),
                      { stop: !0 })
                    : {};
              }
            });
          } catch (o) {
            if (!fdt(o)) throw o;
            n.isParsingContentTypes &&
              ((n.isParsingContentTypes = !1), (n.hasUnparseableContentTypes = !0));
          }
          return r ?? Tpe(n) ?? { ext: "zip", mime: "application/zip" };
        }
        if (this.checkString("OggS")) {
          await e.ignore(28);
          let r = new Uint8Array(8);
          return (
            await e.readBuffer(r),
            Ca(r, [79, 112, 117, 115, 72, 101, 97, 100])
              ? { ext: "opus", mime: "audio/ogg; codecs=opus" }
              : Ca(r, [128, 116, 104, 101, 111, 114, 97])
                ? { ext: "ogv", mime: "video/ogg" }
                : Ca(r, [1, 118, 105, 100, 101, 111, 0])
                  ? { ext: "ogm", mime: "video/ogg" }
                  : Ca(r, [127, 70, 76, 65, 67])
                    ? { ext: "oga", mime: "audio/ogg" }
                    : Ca(r, [83, 112, 101, 101, 120, 32, 32])
                      ? { ext: "spx", mime: "audio/ogg" }
                      : Ca(r, [1, 118, 111, 114, 98, 105, 115])
                        ? { ext: "ogg", mime: "audio/ogg" }
                        : { ext: "ogx", mime: "application/ogg" }
          );
        }
        if (
          this.check([80, 75]) &&
          (this.buffer[2] === 3 || this.buffer[2] === 5 || this.buffer[2] === 7) &&
          (this.buffer[3] === 4 || this.buffer[3] === 6 || this.buffer[3] === 8)
        )
          return { ext: "zip", mime: "application/zip" };
        if (this.checkString("MThd")) return { ext: "mid", mime: "audio/midi" };
        if (
          this.checkString("wOFF") &&
          (this.check([0, 1, 0, 0], { offset: 4 }) || this.checkString("OTTO", { offset: 4 }))
        )
          return { ext: "woff", mime: "font/woff" };
        if (
          this.checkString("wOF2") &&
          (this.check([0, 1, 0, 0], { offset: 4 }) || this.checkString("OTTO", { offset: 4 }))
        )
          return { ext: "woff2", mime: "font/woff2" };
        if (this.check([212, 195, 178, 161]) || this.check([161, 178, 195, 212]))
          return { ext: "pcap", mime: "application/vnd.tcpdump.pcap" };
        if (this.checkString("DSD ")) return { ext: "dsf", mime: "audio/x-dsf" };
        if (this.checkString("LZIP")) return { ext: "lz", mime: "application/x-lzip" };
        if (this.checkString("fLaC")) return { ext: "flac", mime: "audio/flac" };
        if (this.check([66, 80, 71, 251])) return { ext: "bpg", mime: "image/bpg" };
        if (this.checkString("wvpk")) return { ext: "wv", mime: "audio/wavpack" };
        if (this.checkString("%PDF")) return { ext: "pdf", mime: "application/pdf" };
        if (this.check([0, 97, 115, 109])) return { ext: "wasm", mime: "application/wasm" };
        if (this.check([73, 73])) {
          let r = await this.readTiffHeader(!1);
          if (r) return r;
        }
        if (this.check([77, 77])) {
          let r = await this.readTiffHeader(!0);
          if (r) return r;
        }
        if (this.checkString("MAC ")) return { ext: "ape", mime: "audio/ape" };
        if (this.check([26, 69, 223, 163])) {
          async function r() {
            let l = await e.peekNumber(Pde),
              c = 128,
              u = 0;
            for (; !(l & c) && c !== 0; ) (++u, (c >>= 1));
            let p = new Uint8Array(u + 1);
            return (await zG(e, p, void 0, { maximumLength: p.length, reason: "EBML field" }), p);
          }
          async function n() {
            let l = await r(),
              c = await r();
            c[0] ^= 128 >> (c.length - 1);
            let u = Math.min(6, c.length),
              p = new DataView(l.buffer),
              m = new DataView(c.buffer, c.length - u, u);
            return { id: HG(p), len: HG(m) };
          }
          async function o(l) {
            let c = 0;
            for (; l > 0; ) {
              if ((c++, c > Gut || Cw(e, s, ts))) return;
              let u = e.position,
                p = await n();
              if (p.id === 17026) {
                if (p.len > Spe) return;
                let m = VG(p.len, Spe, "EBML DocType");
                return (await e.readToken(new ri(m))).replaceAll(/\00.*$/g, "");
              }
              if (
                (Mo(e) && (!Number.isFinite(p.len) || p.len < 0 || p.len > wpe)) ||
                (await mu(e, p.len, {
                  maximumLength: Mo(e) ? wpe : e.fileInfo.size,
                  reason: "EBML payload",
                }),
                --l,
                e.position <= u)
              )
                return;
            }
          }
          let i = await n(),
            s = e.position;
          switch (await o(i.len)) {
            case "webm":
              return { ext: "webm", mime: "video/webm" };
            case "matroska":
              return { ext: "mkv", mime: "video/matroska" };
            default:
              return;
          }
        }
        if (this.checkString("SQLi")) return { ext: "sqlite", mime: "application/x-sqlite3" };
        if (this.check([78, 69, 83, 26]))
          return { ext: "nes", mime: "application/x-nintendo-nes-rom" };
        if (this.checkString("Cr24"))
          return { ext: "crx", mime: "application/x-google-chrome-extension" };
        if (this.checkString("MSCF") || this.checkString("ISc("))
          return { ext: "cab", mime: "application/vnd.ms-cab-compressed" };
        if (this.check([237, 171, 238, 219])) return { ext: "rpm", mime: "application/x-rpm" };
        if (this.check([197, 208, 211, 198])) return { ext: "eps", mime: "application/eps" };
        if (this.check([40, 181, 47, 253])) return { ext: "zst", mime: "application/zstd" };
        if (this.check([127, 69, 76, 70])) return { ext: "elf", mime: "application/x-elf" };
        if (this.check([33, 66, 68, 78])) return { ext: "pst", mime: "application/vnd.ms-outlook" };
        if (this.checkString("PAR1") || this.checkString("PARE"))
          return { ext: "parquet", mime: "application/vnd.apache.parquet" };
        if (this.checkString("ttcf")) return { ext: "ttc", mime: "font/collection" };
        if (
          this.check([254, 237, 250, 206]) ||
          this.check([254, 237, 250, 207]) ||
          this.check([206, 250, 237, 254]) ||
          this.check([207, 250, 237, 254])
        )
          return { ext: "macho", mime: "application/x-mach-binary" };
        if (this.check([4, 34, 77, 24])) return { ext: "lz4", mime: "application/x-lz4" };
        if (this.checkString("regf"))
          return { ext: "dat", mime: "application/x-ft-windows-registry-hive" };
        if (this.checkString("$FL2") || this.checkString("$FL3"))
          return { ext: "sav", mime: "application/x-spss-sav" };
        if (this.check([79, 84, 84, 79, 0])) return { ext: "otf", mime: "font/otf" };
        if (this.checkString("#!AMR")) return { ext: "amr", mime: "audio/amr" };
        if (this.checkString("{\\rtf")) return { ext: "rtf", mime: "application/rtf" };
        if (this.check([70, 76, 86, 1])) return { ext: "flv", mime: "video/x-flv" };
        if (this.checkString("IMPM")) return { ext: "it", mime: "audio/x-it" };
        if (
          this.checkString("-lh0-", { offset: 2 }) ||
          this.checkString("-lh1-", { offset: 2 }) ||
          this.checkString("-lh2-", { offset: 2 }) ||
          this.checkString("-lh3-", { offset: 2 }) ||
          this.checkString("-lh4-", { offset: 2 }) ||
          this.checkString("-lh5-", { offset: 2 }) ||
          this.checkString("-lh6-", { offset: 2 }) ||
          this.checkString("-lh7-", { offset: 2 }) ||
          this.checkString("-lzs-", { offset: 2 }) ||
          this.checkString("-lz4-", { offset: 2 }) ||
          this.checkString("-lz5-", { offset: 2 }) ||
          this.checkString("-lhd-", { offset: 2 })
        )
          return { ext: "lzh", mime: "application/x-lzh-compressed" };
        if (this.check([0, 0, 1, 186])) {
          if (this.check([33], { offset: 4, mask: [241] }))
            return { ext: "mpg", mime: "video/MP1S" };
          if (this.check([68], { offset: 4, mask: [196] }))
            return { ext: "mpg", mime: "video/MP2P" };
        }
        if (this.checkString("ITSF")) return { ext: "chm", mime: "application/vnd.ms-htmlhelp" };
        if (this.check([202, 254, 186, 190])) {
          let r = OG.get(this.buffer, 4),
            n = Mp.get(this.buffer, 6);
          if (r > 0 && r <= 30) return { ext: "macho", mime: "application/x-mach-binary" };
          if (n > 30) return { ext: "class", mime: "application/java-vm" };
        }
        if (this.checkString(".RMF")) return { ext: "rm", mime: "application/vnd.rn-realmedia" };
        if (this.checkString("DRACO")) return { ext: "drc", mime: "application/vnd.google.draco" };
        if (this.check([253, 55, 122, 88, 90, 0])) return { ext: "xz", mime: "application/x-xz" };
        if (this.checkString("<?xml ")) return { ext: "xml", mime: "application/xml" };
        if (this.check([55, 122, 188, 175, 39, 28]))
          return { ext: "7z", mime: "application/x-7z-compressed" };
        if (this.check([82, 97, 114, 33, 26, 7]) && (this.buffer[6] === 0 || this.buffer[6] === 1))
          return { ext: "rar", mime: "application/x-rar-compressed" };
        if (this.checkString("solid ")) return { ext: "stl", mime: "model/stl" };
        if (this.checkString("AC")) {
          let r = new ri(4, "latin1").get(this.buffer, 2);
          if (r.match("^d*") && r >= 1e3 && r <= 1050) return { ext: "dwg", mime: "image/vnd.dwg" };
        }
        if (this.checkString("070707")) return { ext: "cpio", mime: "application/x-cpio" };
        if (this.checkString("BLENDER")) return { ext: "blend", mime: "application/x-blender" };
        if (this.checkString("!<arch>"))
          return (
            await e.ignore(8),
            (await e.readToken(new ri(13, "ascii"))) === "debian-binary"
              ? { ext: "deb", mime: "application/x-deb" }
              : { ext: "ar", mime: "application/x-unix-archive" }
          );
        if (
          this.checkString("WEBVTT") &&
          [
            `
`,
            "\r",
            "	",
            " ",
            "\0",
          ].some((r) => this.checkString(r, { offset: 6 }))
        )
          return { ext: "vtt", mime: "text/vtt" };
        if (this.check([137, 80, 78, 71, 13, 10, 26, 10])) {
          let r = { ext: "png", mime: "image/png" },
            n = { ext: "apng", mime: "image/apng" };
          await e.ignore(8);
          async function o() {
            return { length: await e.readToken(Ide), type: await e.readToken(new ri(4, "latin1")) };
          }
          let i = Mo(e),
            s = e.position,
            a = 0,
            l = !1;
          do {
            if ((a++, a > Wut || Cw(e, s, Hut))) break;
            let c = e.position,
              u = await o();
            if (u.length < 0) return;
            if (u.type === "IHDR") {
              if (u.length !== 13) return;
              l = !0;
            }
            switch (u.type) {
              case "IDAT":
                return r;
              case "acTL":
                return n;
              default:
                if (!l && u.type !== "CgBI") return;
                if (i && u.length > xpe) return l && tdt(u.type) ? r : void 0;
                try {
                  await mu(e, u.length + 4, {
                    maximumLength: i ? xpe + 4 : e.fileInfo.size,
                    reason: "PNG chunk payload",
                  });
                } catch (p) {
                  if (!i && (p instanceof zl || p instanceof Jt)) return r;
                  throw p;
                }
            }
            if (e.position <= c) break;
          } while (e.position + 8 < e.fileInfo.size);
          return r;
        }
        if (this.check([65, 82, 82, 79, 87, 49, 0, 0]))
          return { ext: "arrow", mime: "application/vnd.apache.arrow.file" };
        if (this.check([103, 108, 84, 70, 2, 0, 0, 0]))
          return { ext: "glb", mime: "model/gltf-binary" };
        if (
          this.check([102, 114, 101, 101], { offset: 4 }) ||
          this.check([109, 100, 97, 116], { offset: 4 }) ||
          this.check([109, 111, 111, 118], { offset: 4 }) ||
          this.check([119, 105, 100, 101], { offset: 4 })
        )
          return { ext: "mov", mime: "video/quicktime" };
        if (this.check([73, 73, 82, 79, 8, 0, 0, 0, 24]))
          return { ext: "orf", mime: "image/x-olympus-orf" };
        if (this.checkString("gimp xcf ")) return { ext: "xcf", mime: "image/x-xcf" };
        if (this.checkString("ftyp", { offset: 4 }) && this.buffer[8] & 96) {
          let r = new ri(4, "latin1").get(this.buffer, 8).replace("\0", " ").trim();
          switch (r) {
            case "avif":
            case "avis":
              return { ext: "avif", mime: "image/avif" };
            case "mif1":
              return { ext: "heic", mime: "image/heif" };
            case "msf1":
              return { ext: "heic", mime: "image/heif-sequence" };
            case "heic":
            case "heix":
              return { ext: "heic", mime: "image/heic" };
            case "hevc":
            case "hevx":
              return { ext: "heic", mime: "image/heic-sequence" };
            case "qt":
              return { ext: "mov", mime: "video/quicktime" };
            case "M4V":
            case "M4VH":
            case "M4VP":
              return { ext: "m4v", mime: "video/x-m4v" };
            case "M4P":
              return { ext: "m4p", mime: "video/mp4" };
            case "M4B":
              return { ext: "m4b", mime: "audio/mp4" };
            case "M4A":
              return { ext: "m4a", mime: "audio/x-m4a" };
            case "F4V":
              return { ext: "f4v", mime: "video/mp4" };
            case "F4P":
              return { ext: "f4p", mime: "video/mp4" };
            case "F4A":
              return { ext: "f4a", mime: "audio/mp4" };
            case "F4B":
              return { ext: "f4b", mime: "audio/mp4" };
            case "crx":
              return { ext: "cr3", mime: "image/x-canon-cr3" };
            default:
              return r.startsWith("3g")
                ? r.startsWith("3g2")
                  ? { ext: "3g2", mime: "video/3gpp2" }
                  : { ext: "3gp", mime: "video/3gpp" }
                : { ext: "mp4", mime: "video/mp4" };
          }
        }
        if (
          this.checkString(`REGEDIT4\r
`)
        )
          return { ext: "reg", mime: "application/x-ms-regedit" };
        if (this.check([82, 73, 70, 70])) {
          if (this.checkString("WEBP", { offset: 8 })) return { ext: "webp", mime: "image/webp" };
          if (this.check([65, 86, 73], { offset: 8 })) return { ext: "avi", mime: "video/vnd.avi" };
          if (this.check([87, 65, 86, 69], { offset: 8 })) return { ext: "wav", mime: "audio/wav" };
          if (this.check([81, 76, 67, 77], { offset: 8 }))
            return { ext: "qcp", mime: "audio/qcelp" };
        }
        if (this.check([73, 73, 85, 0, 24, 0, 0, 0, 136, 231, 116, 216]))
          return { ext: "rw2", mime: "image/x-panasonic-rw2" };
        if (this.check([48, 38, 178, 117, 142, 102, 207, 17, 166, 217])) {
          let r = !1;
          try {
            async function n() {
              let a = new Uint8Array(16);
              return (
                await zG(e, a, void 0, { maximumLength: a.length, reason: "ASF header GUID" }),
                { id: a, size: Number(await e.readToken(kde)) }
              );
            }
            await mu(e, 30, { maximumLength: 30, reason: "ASF header prelude" });
            let o = Mo(e),
              i = e.position,
              s = 0;
            for (; e.position + 24 < e.fileInfo.size && (s++, !(s > jut || Cw(e, i, ts))); ) {
              let a = e.position,
                l = await n(),
                c = l.size - 24;
              if (!Number.isFinite(c) || c < 0) {
                r = !0;
                break;
              }
              if (
                Ca(l.id, [145, 7, 220, 183, 183, 169, 207, 17, 142, 230, 0, 192, 12, 32, 83, 101])
              ) {
                let u = new Uint8Array(16);
                if (
                  ((c -= await zG(e, u, void 0, {
                    maximumLength: u.length,
                    reason: "ASF stream type GUID",
                  })),
                  Ca(u, [64, 158, 105, 248, 77, 91, 207, 17, 168, 253, 0, 128, 95, 92, 68, 43]))
                )
                  return { ext: "asf", mime: "audio/x-ms-asf" };
                if (Ca(u, [192, 239, 25, 188, 77, 91, 207, 17, 168, 253, 0, 128, 95, 92, 68, 43]))
                  return { ext: "asf", mime: "video/x-ms-asf" };
                break;
              }
              if (o && c > Ape) {
                r = !0;
                break;
              }
              if (
                (await mu(e, c, {
                  maximumLength: o ? Ape : e.fileInfo.size,
                  reason: "ASF header payload",
                }),
                e.position <= a)
              ) {
                r = !0;
                break;
              }
            }
          } catch (n) {
            if (n instanceof Jt || n instanceof zl) Mo(e) && (r = !0);
            else throw n;
          }
          return r ? void 0 : { ext: "asf", mime: "application/vnd.ms-asf" };
        }
        if (this.check([171, 75, 84, 88, 32, 49, 49, 187, 13, 10, 26, 10]))
          return { ext: "ktx", mime: "image/ktx" };
        if (
          (this.check([126, 16, 4]) || this.check([126, 24, 4])) &&
          this.check([48, 77, 73, 69], { offset: 4 })
        )
          return { ext: "mie", mime: "application/x-mie" };
        if (this.check([39, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], { offset: 2 }))
          return { ext: "shp", mime: "application/x-esri-shape" };
        if (this.check([255, 79, 255, 81])) return { ext: "j2c", mime: "image/j2c" };
        if (this.check([0, 0, 0, 12, 106, 80, 32, 32, 13, 10, 135, 10]))
          switch ((await e.ignore(20), await e.readToken(new ri(4, "ascii")))) {
            case "jp2 ":
              return { ext: "jp2", mime: "image/jp2" };
            case "jpx ":
              return { ext: "jpx", mime: "image/jpx" };
            case "jpm ":
              return { ext: "jpm", mime: "image/jpm" };
            case "mjp2":
              return { ext: "mj2", mime: "image/mj2" };
            default:
              return;
          }
        if (this.check([255, 10]) || this.check([0, 0, 0, 12, 74, 88, 76, 32, 13, 10, 135, 10]))
          return { ext: "jxl", mime: "image/jxl" };
        if (this.check([254, 255]))
          return this.checkString("<?xml ", { offset: 2, encoding: "utf-16be" })
            ? { ext: "xml", mime: "application/xml" }
            : void 0;
        if (this.check([208, 207, 17, 224, 161, 177, 26, 225]))
          return { ext: "cfb", mime: "application/x-cfb" };
        if (
          (await e.peekBuffer(this.buffer, {
            length: Math.min(256, e.fileInfo.size),
            mayBeLess: !0,
          }),
          this.check([97, 99, 115, 112], { offset: 36 }))
        )
          return { ext: "icc", mime: "application/vnd.iccprofile" };
        if (this.checkString("**ACE", { offset: 7 }) && this.checkString("**", { offset: 12 }))
          return { ext: "ace", mime: "application/x-ace-compressed" };
        if (this.checkString("BEGIN:")) {
          if (this.checkString("VCARD", { offset: 6 })) return { ext: "vcf", mime: "text/vcard" };
          if (this.checkString("VCALENDAR", { offset: 6 }))
            return { ext: "ics", mime: "text/calendar" };
        }
        if (this.checkString("FUJIFILMCCD-RAW"))
          return { ext: "raf", mime: "image/x-fujifilm-raf" };
        if (this.checkString("Extended Module:")) return { ext: "xm", mime: "audio/x-xm" };
        if (this.checkString("Creative Voice File")) return { ext: "voc", mime: "audio/x-voc" };
        if (this.check([4, 0, 0, 0]) && this.buffer.length >= 16) {
          let r = new DataView(this.buffer.buffer).getUint32(12, !0);
          if (r > 12 && this.buffer.length >= r + 16)
            try {
              let n = new TextDecoder().decode(this.buffer.subarray(16, r + 16));
              if (JSON.parse(n).files) return { ext: "asar", mime: "application/x-asar" };
            } catch {}
        }
        if (this.check([6, 14, 43, 52, 2, 5, 1, 1, 13, 1, 2, 1, 1, 2]))
          return { ext: "mxf", mime: "application/mxf" };
        if (this.checkString("SCRM", { offset: 44 })) return { ext: "s3m", mime: "audio/x-s3m" };
        if (this.check([71]) && this.check([71], { offset: 188 }))
          return { ext: "mts", mime: "video/mp2t" };
        if (this.check([71], { offset: 4 }) && this.check([71], { offset: 196 }))
          return { ext: "mts", mime: "video/mp2t" };
        if (this.check([66, 79, 79, 75, 77, 79, 66, 73], { offset: 60 }))
          return { ext: "mobi", mime: "application/x-mobipocket-ebook" };
        if (this.check([68, 73, 67, 77], { offset: 128 }))
          return { ext: "dcm", mime: "application/dicom" };
        if (this.check([76, 0, 0, 0, 1, 20, 2, 0, 0, 0, 0, 0, 192, 0, 0, 0, 0, 0, 0, 70]))
          return { ext: "lnk", mime: "application/x.ms.shortcut" };
        if (this.check([98, 111, 111, 107, 0, 0, 0, 0, 109, 97, 114, 107, 0, 0, 0, 0]))
          return { ext: "alias", mime: "application/x.apple.alias" };
        if (this.checkString("Kaydara FBX Binary  \0"))
          return { ext: "fbx", mime: "application/x.autodesk.fbx" };
        if (
          this.check([76, 80], { offset: 34 }) &&
          (this.check([0, 0, 1], { offset: 8 }) ||
            this.check([1, 0, 2], { offset: 8 }) ||
            this.check([2, 0, 2], { offset: 8 }))
        )
          return { ext: "eot", mime: "application/vnd.ms-fontobject" };
        if (this.check([6, 6, 237, 245, 216, 29, 70, 229, 189, 49, 239, 231, 254, 116, 183, 29]))
          return { ext: "indd", mime: "application/x-indesign" };
        if (
          this.check([255, 255, 0, 0, 7, 0, 0, 0, 4, 0, 0, 0, 1, 0, 1, 0]) ||
          this.check([0, 0, 255, 255, 0, 0, 0, 7, 0, 0, 0, 4, 0, 1, 0, 1])
        )
          return { ext: "jmp", mime: "application/x-jmp-data" };
        if (
          (await e.peekBuffer(this.buffer, {
            length: Math.min(512, e.fileInfo.size),
            mayBeLess: !0,
          }),
          (this.checkString("ustar", { offset: 257 }) &&
            (this.checkString("\0", { offset: 262 }) || this.checkString(" ", { offset: 262 }))) ||
            (this.check([0, 0, 0, 0, 0, 0], { offset: 257 }) && dpe(this.buffer)))
        )
          return { ext: "tar", mime: "application/x-tar" };
        if (this.check([255, 254])) {
          let r = "utf-16le";
          return this.checkString("<?xml ", { offset: 2, encoding: r })
            ? { ext: "xml", mime: "application/xml" }
            : this.check([255, 14], { offset: 2 }) &&
                this.checkString("SketchUp Model", { offset: 4, encoding: r })
              ? { ext: "skp", mime: "application/vnd.sketchup.skp" }
              : this.checkString(
                    `Windows Registry Editor Version 5.00\r
`,
                    { offset: 2, encoding: r },
                  )
                ? { ext: "reg", mime: "application/x-ms-regedit" }
                : void 0;
        }
        if (this.checkString("-----BEGIN PGP MESSAGE-----"))
          return { ext: "pgp", mime: "application/pgp-encrypted" };
      };
      detectImprecise = async (e) => {
        this.buffer = new Uint8Array(Sg);
        let r = pdt(e.fileInfo.size);
        if (
          (await e.peekBuffer(this.buffer, { length: Math.min(8, r), mayBeLess: !0 }),
          this.check([0, 0, 1, 186]) || this.check([0, 0, 1, 179]))
        )
          return { ext: "mpg", mime: "video/mpeg" };
        if (this.check([0, 1, 0, 0, 0])) return { ext: "ttf", mime: "font/ttf" };
        if (this.check([0, 0, 1, 0])) return { ext: "ico", mime: "image/x-icon" };
        if (this.check([0, 0, 2, 0])) return { ext: "cur", mime: "image/x-icon" };
        if (
          (await e.peekBuffer(this.buffer, {
            length: Math.min(2 + this.options.mpegOffsetTolerance, r),
            mayBeLess: !0,
          }),
          this.buffer.length >= 2 + this.options.mpegOffsetTolerance)
        )
          for (let n = 0; n <= this.options.mpegOffsetTolerance; ++n) {
            let o = this.scanMpeg(n);
            if (o) return o;
          }
      };
      async readTiffTag(e) {
        let r = await this.tokenizer.readToken(e ? Mp : qr);
        switch ((await this.tokenizer.ignore(10), r)) {
          case 50341:
            return { ext: "arw", mime: "image/x-sony-arw" };
          case 50706:
            return { ext: "dng", mime: "image/x-adobe-dng" };
          default:
        }
      }
      async readTiffIFD(e) {
        let r = await this.tokenizer.readToken(e ? Mp : qr);
        if (!(r > zut) && !(Mo(this.tokenizer) && 2 + r * 12 > Rpe))
          for (let n = 0; n < r; ++n) {
            let o = await this.readTiffTag(e);
            if (o) return o;
          }
      }
      async readTiffHeader(e) {
        let r = { ext: "tif", mime: "image/tiff" },
          n = (e ? Mp : qr).get(this.buffer, 2),
          o = (e ? OG : Mr).get(this.buffer, 4);
        if (n === 42) {
          if (o >= 6) {
            if (this.checkString("CR", { offset: 8 }))
              return { ext: "cr2", mime: "image/x-canon-cr2" };
            if (o >= 8) {
              let a = (e ? Mp : qr).get(this.buffer, 8),
                l = (e ? Mp : qr).get(this.buffer, 10);
              if ((a === 28 && l === 254) || (a === 31 && l === 11))
                return { ext: "nef", mime: "image/x-nikon-nef" };
            }
          }
          if (Mo(this.tokenizer) && o > Vut) return r;
          let i = Mo(this.tokenizer) ? Rpe : this.tokenizer.fileInfo.size;
          try {
            await mu(this.tokenizer, o, { maximumLength: i, reason: "TIFF IFD offset" });
          } catch (a) {
            if (a instanceof Jt) return;
            throw a;
          }
          let s;
          try {
            s = await this.readTiffIFD(e);
          } catch (a) {
            if (a instanceof Jt) return;
            throw a;
          }
          return s ?? r;
        }
        if (n === 43) return r;
      }
      scanMpeg(e) {
        if (this.check([255, 224], { offset: e, mask: [255, 224] })) {
          if (this.check([16], { offset: e + 1, mask: [22] }))
            return this.check([8], { offset: e + 1, mask: [8] })
              ? { ext: "aac", mime: "audio/aac" }
              : { ext: "aac", mime: "audio/aac" };
          if (this.check([2], { offset: e + 1, mask: [6] }))
            return { ext: "mp3", mime: "audio/mpeg" };
          if (this.check([4], { offset: e + 1, mask: [6] }))
            return { ext: "mp2", mime: "audio/mpeg" };
          if (this.check([6], { offset: e + 1, mask: [6] }))
            return { ext: "mp1", mime: "audio/mpeg" };
        }
      }
    }),
      (Sdt = new Set(fpe)),
      (wdt = new Set(hpe)));
  });
async function ZG(t) {
  if (t == null) return null;
  let e = await Npe(t);
  return e != null ? e.kind : Idt(t) ? "text" : "binary";
}
async function WI(t) {
  return (await Npe(t))?.mimeType ?? null;
}
async function Npe(t) {
  if (t == null || t.byteLength === 0) return null;
  let e = Rdt(t);
  if (e != null) return { kind: "image", mimeType: e };
  let r = await Edt(t);
  return r == null ? null : Pdt(r);
}
function Rdt(t) {
  let e = Mpe.decode(t.subarray(0, Adt)).trimStart().toLowerCase();
  return e.startsWith("<svg") || (e.startsWith("<?xml") && e.includes("<svg"))
    ? "image/svg+xml"
    : null;
}
async function Edt(t) {
  try {
    let { fileTypeFromBuffer: e } = await Cdt();
    return await e(t);
  } catch {
    return;
  }
}
function Cdt() {
  return ((KG = KG ?? Tdt()), KG);
}
async function Tdt() {
  return {
    fileTypeFromBuffer: (await Promise.resolve().then(() => (Dpe(), kpe))).fileTypeFromBuffer,
  };
}
function Pdt(t) {
  return t.mime === "application/pdf"
    ? { kind: "pdf", mimeType: t.mime }
    : t.mime.startsWith("image/")
      ? { kind: "image", mimeType: t.mime }
      : t.mime.startsWith("audio/")
        ? { kind: "audio", mimeType: t.mime }
        : t.mime.startsWith("video/")
          ? { kind: "video", mimeType: t.mime }
          : t.mime.startsWith("text/") || xdt.has(t.mime)
            ? { kind: "text", mimeType: t.mime }
            : _dt.has(t.ext)
              ? { kind: "archive", mimeType: t.mime }
              : { kind: "binary", mimeType: t.mime };
}
function Idt(t) {
  return t.byteLength === 0 ? !0 : !kdt(Mpe.decode(t));
}
function kdt(t) {
  for (let e = 0; e < t.length; e += 1) {
    let r = t.charCodeAt(e);
    if (r < 32 && (r < 7 || r > 14)) return !0;
  }
  return !1;
}
var _dt,
  xdt,
  Adt,
  Mpe,
  Ope,
  KG,
  Lpe = g(() => {
    "use strict";
    ((_dt = new Set([
      "7z",
      "Z",
      "apk",
      "bz2",
      "docm",
      "docx",
      "epub",
      "gz",
      "jar",
      "odp",
      "ods",
      "odt",
      "potm",
      "potx",
      "ppsm",
      "ppsx",
      "pptm",
      "pptx",
      "rar",
      "tar",
      "tar.gz",
      "xlsm",
      "xlsx",
      "xpi",
      "xz",
      "zip",
      "zst",
    ])),
      (xdt = new Set([
        "application/eps",
        "application/postscript",
        "application/rtf",
        "application/x-ms-regedit",
        "application/xml",
      ])),
      (Adt = 512),
      (Mpe = new TextDecoder("utf-8")),
      (Ope = 4096),
      (KG = null));
  });
var Bpe = g(() => {
  "use strict";
});
function $pe(t) {
  return t != null && Mdt.has(t);
}
function Oo(t) {
  return t;
}
var Fpe,
  XG,
  Ddt,
  Mdt,
  Upe = g(() => {
    "use strict";
    ((Fpe = 10 * 1024 * 1024),
      (XG = "x-codex-git-source"),
      (Ddt = [
        "apply_worktree",
        "artifact_preview",
        "async_task_starting_state_dropdown",
        "base_branch_query",
        "commit_modal",
        "composer_branch_switcher",
        "composer_content",
        "composer_worktree_source",
        "cloud_follow_up_local_remote_dropdown",
        "create_pull_request_modal",
        "diff_context_menu",
        "diff_comment_sources",
        "fork_conversation_actions",
        "git_action_directives",
        "git_branch_search",
        "git_config_value",
        "git_direct_call",
        "git_query_invalidation",
        "git_query_watch",
        "git_root_lookup",
        "git_stable_metadata",
        "hotkey_window_worktree_source",
        "hotkey_window_home_page",
        "home_ambient_suggestions",
        "home_page",
        "local_environment_editor",
        "local_remote_dropdown",
        "local_conversation_action_compound_button",
        "local_conversation_thread",
        "local_conversation_git_actions",
        "local_conversation_git_summary",
        "local_thread_hover_card",
        "move_to_local_dialog",
        "move_to_host_worktree",
        "move_to_worktree_dialog",
        "onboarding_workspace_select",
        "presence_workstreams",
        "pull_requests_page",
        "pull_request_board",
        "remote_conversation_apply_diff",
        "recommended_skills_refresh",
        "run_action_setup_popover",
        "review_model",
        "review_patch",
        "review_search",
        "review_command_registration",
        "review_mode_content",
        "sidebar_recent_filter",
        "sidebar_task_pr_chip",
        "sidebar_threads_section",
        "sidebar_workspace_groups",
        "sidebar_workspace_task_groups_task_dirs",
        "sidebar_workspace_task_groups_workspace_dirs",
        "startup_prefetch",
        "thread_diff",
        "turn_diff_analytics",
        "turn_environment_analytics",
        "turn_git_state_analytics",
        "thread_start_git_info",
        "use_checkout_git_branch",
        "use_create_git_branch",
        "use_git_push_mutation",
        "use_local_conversation_environment",
        "worktree_archive_cleanup",
        "worktree_auto_cleanup",
        "worktree_branch_setup_modal",
        "worktree_managed_create",
        "worktree_new_branch_cleanup",
        "worktree_pending_create",
        "worktree_remove_workspace_root_cleanup",
        "worktree_restore_banner",
        "worktree_set_owner_thread",
        "worktree_settings_delete",
        "worktrees_settings_page",
        "workspace_repo_owner_names",
      ]),
      (Mdt = new Set(Ddt)));
  });
function Tw(t) {
  return HI(
    t?.flatMap((e) =>
      e == null
        ? []
        : e.__typename === "StatusContext"
          ? [e]
          : [
              {
                event: e.checkSuite?.workflowRun?.event,
                conclusion: e.conclusion,
                completedAt: e.completedAt,
                detailsUrl: e.detailsUrl,
                name: e.name,
                startedAt: e.startedAt ?? "",
                status: e.status,
                workflowName: e.checkSuite?.workflowRun?.workflow?.name ?? null,
              },
            ],
    ),
  );
}
function HI(t) {
  let e = new Map();
  for (let r of t ?? []) {
    let n = "context" in r ? `context:${r.context}` : `check:${r.name}:${r.workflowName ?? ""}`,
      o = e.get(n),
      i = "context" in r ? r.createdAt : r.startedAt;
    (o == null || i > ("context" in o ? o.createdAt : o.startedAt)) && e.set(n, r);
  }
  return Array.from(e.values()).map((r) =>
    "context" in r
      ? {
          bucket: Ldt(r.state),
          description: r.description,
          link: r.targetUrl,
          name: r.context,
          startedAt: r.createdAt,
          state: r.state,
          workflow: null,
        }
      : {
          bucket: Ndt(r),
          completedAt: r.completedAt,
          event: r.event,
          link: r.detailsUrl,
          name: r.name,
          startedAt: r.startedAt,
          state: r.conclusion ?? r.status,
          workflow: r.workflowName ?? null,
        },
  );
}
function Up(t) {
  let e = t
      .map((s) =>
        s.name
          ? {
              completedAt: s.completedAt ?? null,
              description: s.description ?? null,
              event: s.event ?? null,
              link: s.link ?? null,
              name: s.name,
              startedAt: s.startedAt ?? null,
              state: s.state ?? null,
              status: qpe(s),
              workflow: s.workflow ?? null,
            }
          : null,
      )
      .filter((s) => s != null),
    r = !1,
    n = !1,
    o = !1;
  for (let s of t) {
    let a = qpe(s);
    if (a === "failing") {
      r = !0;
      continue;
    }
    if (a === "pending") {
      o = !0;
      continue;
    }
    (a === "neutral" || a === "passing" || a === "skipped") && (n = !0);
  }
  let i;
  return (
    r
      ? (i = "failing")
      : o
        ? (i = "pending")
        : n
          ? (i = "passing")
          : (i = t.length > 0 ? "pending" : "none"),
    { checks: e, ciStatus: i }
  );
}
function qp({ hasOpenPr: t, isDraft: e, mergeStateStatus: r, mergeable: n }) {
  return !t || e || n?.toUpperCase() !== "MERGEABLE" ? !1 : Odt.has(r?.toUpperCase() ?? "");
}
function Gp({ mergeStateStatus: t, mergeable: e }) {
  return e?.toUpperCase() === "CONFLICTING" || t?.toUpperCase() === "DIRTY"
    ? "conflicts"
    : e?.toUpperCase() === "UNKNOWN"
      ? "unknown"
      : null;
}
function qpe({ bucket: t, state: e }) {
  if (e?.toUpperCase() === "NEUTRAL") return "neutral";
  switch (t?.toUpperCase()) {
    case "FAIL":
    case "CANCEL":
      return "failing";
    case "PENDING":
      return "pending";
    case "PASS":
      return "passing";
    case "SKIP":
    case "SKIPPING":
      return "skipped";
    case void 0:
    default:
      return "unknown";
  }
}
function Ndt(t) {
  if (t.status?.toUpperCase() !== "COMPLETED") return "PENDING";
  switch (t.conclusion?.toUpperCase()) {
    case "ACTION_REQUIRED":
    case "FAILURE":
    case "STARTUP_FAILURE":
    case "TIMED_OUT":
      return "FAIL";
    case "CANCELLED":
      return "CANCEL";
    case "NEUTRAL":
    case "SKIPPED":
      return "SKIP";
    case "SUCCESS":
      return "PASS";
    case void 0:
    default:
      return "UNKNOWN";
  }
}
function Ldt(t) {
  switch (t?.toUpperCase()) {
    case "ERROR":
    case "FAILURE":
      return "FAIL";
    case "EXPECTED":
    case "PENDING":
      return "PENDING";
    case "SUCCESS":
      return "PASS";
    case void 0:
    default:
      return "UNKNOWN";
  }
}
var Odt,
  Gpe = g(() => {
    "use strict";
    Odt = new Set(["CLEAN", "HAS_HOOKS", "UNSTABLE"]);
  });
function Wpe(t) {
  let e = t.replaceAll(/"(?:\\.|[^"\\])*(?:"|$)/gu, "");
  return {
    qualifierNames: Array.from(
      e.matchAll(/(?:^|[\s(])-?([a-z-]+):/giu),
      (r) => r[1]?.toLowerCase() ?? "",
    ),
    unquotedQuery: e,
  };
}
var Hpe = g(() => {
  "use strict";
});
var jpe = g(() => {
  "use strict";
});
var zpe = g(() => {
  "use strict";
  Ti();
});
function jI(t, e) {
  if (t[e] !== '"') return null;
  let r = e + 1,
    n = "",
    o = "";
  for (; r < t.length; ) {
    let i = t[r];
    if (i == null) return null;
    if (i === '"') return { nextIndex: r + 1, path: n, pathForUnquotedDiffHeader: o };
    if (i !== "\\") {
      ((n += i), (o += i), (r += 1));
      continue;
    }
    let s = Bdt(t, r + 1);
    if (s == null) return null;
    ((n += s.path), (o += s.pathForUnquotedDiffHeader), (r = s.nextIndex));
  }
  return null;
}
function Ns(t) {
  if (t == null) return null;
  try {
    return new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 }).decode(t);
  } catch {
    return null;
  }
}
function Bdt(t, e) {
  let r = t[e];
  if (r == null) return null;
  if (r === "\\" || r === '"') return { nextIndex: e + 1, path: r, pathForUnquotedDiffHeader: r };
  if (r === "a") return { nextIndex: e + 1, path: "\x07", pathForUnquotedDiffHeader: "\\a" };
  if (r === "b") return { nextIndex: e + 1, path: "\b", pathForUnquotedDiffHeader: "\\b" };
  if (r === "f") return { nextIndex: e + 1, path: "\f", pathForUnquotedDiffHeader: "\\f" };
  if (r === "n")
    return {
      nextIndex: e + 1,
      path: `
`,
      pathForUnquotedDiffHeader: "\\n",
    };
  if (r === "r") return { nextIndex: e + 1, path: "\r", pathForUnquotedDiffHeader: "\\r" };
  if (r === "t") return { nextIndex: e + 1, path: "	", pathForUnquotedDiffHeader: "\\t" };
  if (r === "v") return { nextIndex: e + 1, path: "\v", pathForUnquotedDiffHeader: "\\v" };
  if (!Pw(r)) return { nextIndex: e + 1, path: r, pathForUnquotedDiffHeader: r };
  let n = [],
    o = e;
  for (;;) {
    let s = t.slice(o, o + 3);
    if (!Fdt(s)) return null;
    if ((n.push(Number.parseInt(s, 8)), (o += 3), t[o] !== "\\" || !Pw(t[o + 1] ?? ""))) break;
    o += 1;
  }
  let i = Ns(Uint8Array.from(n));
  return i == null ? null : { nextIndex: o, path: i, pathForUnquotedDiffHeader: t.slice(e - 1, o) };
}
function Fdt(t) {
  let e = t[0],
    r = t[1],
    n = t[2];
  return t.length === 3 && e != null && r != null && n != null && Pw(e) && Pw(r) && Pw(n);
}
function Pw(t) {
  return t >= "0" && t <= "7";
}
var Vpe = g(() => {
  "use strict";
});
function JG(t) {
  return Object.values(kt)
    .filter((e) => t == null || YG[e].variants.some((r) => r === t))
    .sort((e, r) => $dt.compare(YG[e].label, YG[r].label));
}
var kt,
  YG,
  $dt,
  Iw = g(() => {
    "use strict";
    ((kt = {
      AYU: "ayu",
      CATPPUCCIN: "catppuccin",
      CODEX: "codex",
      DRACULA: "dracula",
      EVERFOREST: "everforest",
      GITHUB: "github",
      GRUVBOX: "gruvbox",
      LINEAR: "linear",
      LOBSTER: "lobster",
      MATERIAL: "material",
      MATRIX: "matrix",
      MONOKAI: "monokai",
      ABSOLUTELY: "absolutely",
      NIGHT_OWL: "night-owl",
      NORD: "nord",
      NOTION: "notion",
      OG: "og",
      OSCURANGE: "oscurange",
      ONE: "one",
      PROOF: "proof",
      RAYCAST: "raycast",
      ROSE_PINE: "rose-pine",
      SENTRY: "sentry",
      SOLARIZED: "solarized",
      TEMPLE: "temple",
      TOKYO_NIGHT: "tokyo-night",
      VERCEL: "vercel",
      VSCODE_PLUS: "vscode-plus",
      XCODE: "xcode",
    }),
      (YG = {
        [kt.AYU]: { label: "Ayu", variants: ["dark"] },
        [kt.CATPPUCCIN]: { label: "Catppuccin", variants: ["dark", "light"] },
        [kt.ABSOLUTELY]: { label: "Absolutely", variants: ["dark", "light"] },
        [kt.CODEX]: { label: "Codex", variants: ["dark", "light"] },
        [kt.DRACULA]: { label: "Dracula", variants: ["dark"] },
        [kt.EVERFOREST]: { label: "Everforest", variants: ["dark", "light"] },
        [kt.GITHUB]: { label: "GitHub", variants: ["dark", "light"] },
        [kt.GRUVBOX]: { label: "Gruvbox", variants: ["dark", "light"] },
        [kt.LINEAR]: { label: "Linear", variants: ["dark", "light"] },
        [kt.LOBSTER]: { label: "Lobster", variants: ["dark"] },
        [kt.MATERIAL]: { label: "Material", variants: ["dark"] },
        [kt.MATRIX]: { label: "Matrix", variants: ["dark"] },
        [kt.MONOKAI]: { label: "Monokai", variants: ["dark"] },
        [kt.NIGHT_OWL]: { label: "Night Owl", variants: ["dark"] },
        [kt.NORD]: { label: "Nord", variants: ["dark"] },
        [kt.NOTION]: { label: "Notion", variants: ["dark", "light"] },
        [kt.OG]: { label: "OG", variants: ["dark"] },
        [kt.OSCURANGE]: { label: "Oscurange", variants: ["dark"] },
        [kt.ONE]: { label: "One", variants: ["dark", "light"] },
        [kt.PROOF]: { label: "Proof", variants: ["light"] },
        [kt.RAYCAST]: { label: "Raycast", variants: ["dark", "light"] },
        [kt.ROSE_PINE]: { label: "Rose Pine", variants: ["dark", "light"] },
        [kt.SENTRY]: { label: "Sentry", variants: ["dark"] },
        [kt.SOLARIZED]: { label: "Solarized", variants: ["dark", "light"] },
        [kt.TOKYO_NIGHT]: { label: "Tokyo Night", variants: ["dark"] },
        [kt.TEMPLE]: { label: "Temple", variants: ["dark"] },
        [kt.VERCEL]: { label: "Vercel", variants: ["dark", "light"] },
        [kt.VSCODE_PLUS]: { label: "VS Code Plus", variants: ["dark", "light"] },
        [kt.XCODE]: { label: "Xcode", variants: ["dark", "light"] },
      }),
      ($dt = new Intl.Collator(void 0, { sensitivity: "base" })));
  });
var Be,
  eW,
  hu,
  kw,
  wg,
  QG,
  tW,
  mo = g(() => {
    "use strict";
    $();
    Iw();
    ((Be = d.boolean()),
      (eW = d.enum(kt)),
      (hu = d.string().nullable()),
      (kw = d.string()),
      (wg = d.string().regex(/^#[0-9a-fA-F]{6}$/)),
      (QG = d.object({ family: d.string(), fullName: d.string(), postscriptName: d.string() })),
      (tW = d.object({
        accent: wg,
        accentSource: d.enum(["chatgpt", "custom"]).optional(),
        contrast: d.number().int().min(0).max(100),
        fonts: d.object({
          code: hu,
          codeFace: QG.optional(),
          content: hu.optional(),
          contentFace: QG.optional(),
          ui: hu,
          uiFace: QG.optional(),
        }),
        ink: wg,
        opaqueWindows: Be,
        semanticColors: d.object({ diffAdded: wg, diffRemoved: wg, skill: wg }),
        surface: wg,
      })));
  });
function He({ agentAccess: t, default: e, description: r, key: n, schema: o, vscode: i }) {
  return {
    agentAccess: t,
    default: e,
    description: r,
    key: n,
    hostStorage: { kind: "configuration", key: n },
    schema: o,
    vscode: i,
  };
}
function it({ agentAccess: t, default: e, description: r, key: n, schema: o }) {
  return {
    agentAccess: t,
    default: e,
    description: r,
    key: n,
    hostStorage: { kind: "global-state", key: n },
    schema: o,
  };
}
function Ee({ agentAccess: t, default: e, description: r, key: n, schema: o }) {
  return {
    agentAccess: t,
    default: e,
    description: r,
    key: n,
    hostStorage: { kind: "persisted-atom", key: n },
    schema: o,
  };
}
var Or = g(() => {
  "use strict";
});
var rW,
  nW = g(() => {
    "use strict";
    $();
    mo();
    Or();
    rW = {
      branchPrefix: it({
        agentAccess: "read-write",
        default: "codex/",
        description: "Prefix for branches Codex creates",
        key: "git-branch-prefix",
        schema: kw,
      }),
      alwaysForcePush: it({
        agentAccess: "read-write",
        default: !1,
        description: "Whether Codex always force-pushes branches",
        key: "git-always-force-push",
        schema: Be,
      }),
      createPullRequestAsDraft: it({
        agentAccess: "read-write",
        default: !0,
        description: "Whether Codex creates pull requests as drafts",
        key: "git-create-pull-request-as-draft",
        schema: Be,
      }),
      pullRequestMergeMethod: it({
        agentAccess: "read-write",
        default: "merge",
        description: "Preferred pull request merge method",
        key: "git-pull-request-merge-method",
        schema: d.enum(["merge", "squash"]),
      }),
      pullRequestPollIntervalSeconds: it({
        agentAccess: "read-write",
        default: 15,
        description:
          "Minimum interval in seconds for automatic pull request refreshes (15\u2013300). Explicit refreshes remain immediate.",
        key: "git-pr-poll-interval-seconds",
        schema: d.number().int().min(15).max(300),
      }),
      reviewMode: it({
        agentAccess: "read-write",
        default: "full",
        description: "Whether Git Review uses all sources or only recorded Last Turn changes",
        key: "git-review-mode",
        schema: d.enum(["full", "last-turn-only"]),
      }),
      showSidebarPrIcons: it({
        agentAccess: "read-write",
        default: void 0,
        description: "Whether sidebar pull request icons are shown",
        key: "git-show-sidebar-pr-icons",
        schema: Be,
      }),
      worktreeRoot: it({
        agentAccess: "read-write",
        default: "",
        description: "Directory where Codex creates managed git worktrees",
        key: "git-worktree-root",
        schema: kw,
      }),
      commitInstructions: it({
        agentAccess: "read-only",
        default: "",
        description: "Custom git commit instructions",
        key: "git-commit-instructions",
        schema: kw,
      }),
      pullRequestInstructions: it({
        agentAccess: "read-only",
        default: "",
        description: "Custom pull request instructions",
        key: "git-pr-instructions",
        schema: kw,
      }),
    };
  });
