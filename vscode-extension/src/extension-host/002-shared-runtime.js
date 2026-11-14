function Q7() {
  return { localeError: gZe() };
}
var gZe,
  eQ = g(() => {
    me();
    gZe = () => {
      let t = {
        string: { unit: "simvol", verb: "olmal\u0131d\u0131r" },
        file: { unit: "bayt", verb: "olmal\u0131d\u0131r" },
        array: { unit: "element", verb: "olmal\u0131d\u0131r" },
        set: { unit: "element", verb: "olmal\u0131d\u0131r" },
        map: { unit: "element", verb: "olmal\u0131d\u0131r" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "input",
          email: "email address",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO datetime",
          date: "ISO date",
          time: "ISO time",
          duration: "ISO duration",
          ipv4: "IPv4 address",
          ipv6: "IPv6 address",
          mac: "MAC address",
          cidrv4: "IPv4 range",
          cidrv6: "IPv6 range",
          base64: "base64-encoded string",
          base64url: "base64url-encoded string",
          json_string: "JSON string",
          e164: "E.164 number",
          credit_card: "kredit kart\u0131 n\xF6mr\u0259si",
          currency_code: "valyuta kodu",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "input",
        },
        n = { nan: "NaN" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `Yanl\u0131\u015F d\u0259y\u0259r: g\xF6zl\u0259nil\u0259n instanceof ${o.expected}, daxil olan ${a}`
              : `Yanl\u0131\u015F d\u0259y\u0259r: g\xF6zl\u0259nil\u0259n ${i}, daxil olan ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `Yanl\u0131\u015F d\u0259y\u0259r: g\xF6zl\u0259nil\u0259n ${z(o.values[0])}`
              : `Yanl\u0131\u015F se\xE7im: a\u015Fa\u011F\u0131dak\u0131lardan biri olmal\u0131d\u0131r: ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `\xC7ox b\xF6y\xFCk: g\xF6zl\u0259nil\u0259n ${o.origin ?? "d\u0259y\u0259r"} ${i}${o.maximum.toString()} ${s.unit ?? "element"}`
              : `\xC7ox b\xF6y\xFCk: g\xF6zl\u0259nil\u0259n ${o.origin ?? "d\u0259y\u0259r"} ${i}${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `\xC7ox ki\xE7ik: g\xF6zl\u0259nil\u0259n ${o.origin} ${i}${o.minimum.toString()} ${s.unit}`
              : `\xC7ox ki\xE7ik: g\xF6zl\u0259nil\u0259n ${o.origin} ${i}${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `Yanl\u0131\u015F m\u0259tn: "${i.prefix}" il\u0259 ba\u015Flamal\u0131d\u0131r`
              : i.format === "ends_with"
                ? `Yanl\u0131\u015F m\u0259tn: "${i.suffix}" il\u0259 bitm\u0259lidir`
                : i.format === "includes"
                  ? `Yanl\u0131\u015F m\u0259tn: "${i.includes}" daxil olmal\u0131d\u0131r`
                  : i.format === "regex"
                    ? `Yanl\u0131\u015F m\u0259tn: ${i.pattern} \u015Fablonuna uy\u011Fun olmal\u0131d\u0131r`
                    : `Yanl\u0131\u015F ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `Yanl\u0131\u015F \u0259d\u0259d: ${o.divisor} il\u0259 b\xF6l\xFCn\u0259 bil\u0259n olmal\u0131d\u0131r`;
          case "unrecognized_keys":
            return `Tan\u0131nmayan a\xE7ar${o.keys.length > 1 ? "lar" : ""}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `${o.origin} daxilind\u0259 yanl\u0131\u015F a\xE7ar`;
          case "invalid_union":
            return "Yanl\u0131\u015F d\u0259y\u0259r";
          case "invalid_element":
            return `${o.origin} daxilind\u0259 yanl\u0131\u015F d\u0259y\u0259r`;
          default:
            return "Yanl\u0131\u015F d\u0259y\u0259r";
        }
      };
    };
  });
function tQ(t, e, r, n) {
  let o = Math.abs(t),
    i = o % 10,
    s = o % 100;
  return s >= 11 && s <= 19 ? n : i === 1 ? e : i >= 2 && i <= 4 ? r : n;
}
function rQ() {
  return { localeError: yZe() };
}
var yZe,
  nQ = g(() => {
    me();
    yZe = () => {
      let t = {
        string: {
          unit: {
            one: "\u0441\u0456\u043C\u0432\u0430\u043B",
            few: "\u0441\u0456\u043C\u0432\u0430\u043B\u044B",
            many: "\u0441\u0456\u043C\u0432\u0430\u043B\u0430\u045E",
          },
          verb: "\u043C\u0435\u0446\u044C",
        },
        array: {
          unit: {
            one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
            few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u044B",
            many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430\u045E",
          },
          verb: "\u043C\u0435\u0446\u044C",
        },
        set: {
          unit: {
            one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
            few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u044B",
            many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430\u045E",
          },
          verb: "\u043C\u0435\u0446\u044C",
        },
        map: {
          unit: {
            one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
            few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u044B",
            many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430\u045E",
          },
          verb: "\u043C\u0435\u0446\u044C",
        },
        file: {
          unit: {
            one: "\u0431\u0430\u0439\u0442",
            few: "\u0431\u0430\u0439\u0442\u044B",
            many: "\u0431\u0430\u0439\u0442\u0430\u045E",
          },
          verb: "\u043C\u0435\u0446\u044C",
        },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "\u0443\u0432\u043E\u0434",
          email: "email \u0430\u0434\u0440\u0430\u0441",
          url: "URL",
          emoji: "\u044D\u043C\u043E\u0434\u0437\u0456",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO \u0434\u0430\u0442\u0430 \u0456 \u0447\u0430\u0441",
          date: "ISO \u0434\u0430\u0442\u0430",
          time: "ISO \u0447\u0430\u0441",
          duration: "ISO \u043F\u0440\u0430\u0446\u044F\u0433\u043B\u0430\u0441\u0446\u044C",
          ipv4: "IPv4 \u0430\u0434\u0440\u0430\u0441",
          ipv6: "IPv6 \u0430\u0434\u0440\u0430\u0441",
          mac: "MAC \u0430\u0434\u0440\u0430\u0441",
          cidrv4: "IPv4 \u0434\u044B\u044F\u043F\u0430\u0437\u043E\u043D",
          cidrv6: "IPv6 \u0434\u044B\u044F\u043F\u0430\u0437\u043E\u043D",
          base64:
            "\u0440\u0430\u0434\u043E\u043A \u0443 \u0444\u0430\u0440\u043C\u0430\u0446\u0435 base64",
          base64url:
            "\u0440\u0430\u0434\u043E\u043A \u0443 \u0444\u0430\u0440\u043C\u0430\u0446\u0435 base64url",
          json_string: "JSON \u0440\u0430\u0434\u043E\u043A",
          e164: "\u043D\u0443\u043C\u0430\u0440 E.164",
          credit_card:
            "\u043D\u0443\u043C\u0430\u0440 \u043A\u0440\u044D\u0434\u044B\u0442\u043D\u0430\u0439 \u043A\u0430\u0440\u0442\u044B",
          currency_code: "\u043A\u043E\u0434 \u0432\u0430\u043B\u044E\u0442\u044B",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "\u0443\u0432\u043E\u0434",
        },
        n = { nan: "NaN", number: "\u043B\u0456\u043A", array: "\u043C\u0430\u0441\u0456\u045E" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434: \u0447\u0430\u043A\u0430\u045E\u0441\u044F instanceof ${o.expected}, \u0430\u0442\u0440\u044B\u043C\u0430\u043D\u0430 ${a}`
              : `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434: \u0447\u0430\u043A\u0430\u045E\u0441\u044F ${i}, \u0430\u0442\u0440\u044B\u043C\u0430\u043D\u0430 ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F ${z(o.values[0])}`
              : `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0432\u0430\u0440\u044B\u044F\u043D\u0442: \u0447\u0430\u043A\u0430\u045E\u0441\u044F \u0430\u0434\u0437\u0456\u043D \u0437 ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            if (s) {
              let a = Number(o.maximum),
                l = tQ(a, s.unit.one, s.unit.few, s.unit.many);
              return `\u0417\u0430\u043D\u0430\u0434\u0442\u0430 \u0432\u044F\u043B\u0456\u043A\u0456: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F, \u0448\u0442\u043E ${o.origin ?? "\u0437\u043D\u0430\u0447\u044D\u043D\u043D\u0435"} \u043F\u0430\u0432\u0456\u043D\u043D\u0430 ${s.verb} ${i}${o.maximum.toString()} ${l}`;
            }
            return `\u0417\u0430\u043D\u0430\u0434\u0442\u0430 \u0432\u044F\u043B\u0456\u043A\u0456: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F, \u0448\u0442\u043E ${o.origin ?? "\u0437\u043D\u0430\u0447\u044D\u043D\u043D\u0435"} \u043F\u0430\u0432\u0456\u043D\u043D\u0430 \u0431\u044B\u0446\u044C ${i}${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            if (s) {
              let a = Number(o.minimum),
                l = tQ(a, s.unit.one, s.unit.few, s.unit.many);
              return `\u0417\u0430\u043D\u0430\u0434\u0442\u0430 \u043C\u0430\u043B\u044B: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F, \u0448\u0442\u043E ${o.origin} \u043F\u0430\u0432\u0456\u043D\u043D\u0430 ${s.verb} ${i}${o.minimum.toString()} ${l}`;
            }
            return `\u0417\u0430\u043D\u0430\u0434\u0442\u0430 \u043C\u0430\u043B\u044B: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F, \u0448\u0442\u043E ${o.origin} \u043F\u0430\u0432\u0456\u043D\u043D\u0430 \u0431\u044B\u0446\u044C ${i}${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0440\u0430\u0434\u043E\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u043F\u0430\u0447\u044B\u043D\u0430\u0446\u0446\u0430 \u0437 "${i.prefix}"`
              : i.format === "ends_with"
                ? `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0440\u0430\u0434\u043E\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u0437\u0430\u043A\u0430\u043D\u0447\u0432\u0430\u0446\u0446\u0430 \u043D\u0430 "${i.suffix}"`
                : i.format === "includes"
                  ? `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0440\u0430\u0434\u043E\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u0437\u043C\u044F\u0448\u0447\u0430\u0446\u044C "${i.includes}"`
                  : i.format === "regex"
                    ? `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0440\u0430\u0434\u043E\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u0430\u0434\u043F\u0430\u0432\u044F\u0434\u0430\u0446\u044C \u0448\u0430\u0431\u043B\u043E\u043D\u0443 ${i.pattern}`
                    : `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u043B\u0456\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u0431\u044B\u0446\u044C \u043A\u0440\u0430\u0442\u043D\u044B\u043C ${o.divisor}`;
          case "unrecognized_keys":
            return `\u041D\u0435\u0440\u0430\u0441\u043F\u0430\u0437\u043D\u0430\u043D\u044B ${o.keys.length > 1 ? "\u043A\u043B\u044E\u0447\u044B" : "\u043A\u043B\u044E\u0447"}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u043A\u043B\u044E\u0447 \u0443 ${o.origin}`;
          case "invalid_union":
            return "\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434";
          case "invalid_element":
            return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u0430\u0435 \u0437\u043D\u0430\u0447\u044D\u043D\u043D\u0435 \u045E ${o.origin}`;
          default:
            return "\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434";
        }
      };
    };
  });
function oQ() {
  return { localeError: vZe() };
}
var vZe,
  iQ = g(() => {
    me();
    vZe = () => {
      let t = {
        string: {
          unit: "\u0441\u0438\u043C\u0432\u043E\u043B\u0430",
          verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430",
        },
        file: {
          unit: "\u0431\u0430\u0439\u0442\u0430",
          verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430",
        },
        array: {
          unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
          verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430",
        },
        set: {
          unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
          verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430",
        },
        map: {
          unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
          verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430",
        },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "\u0432\u0445\u043E\u0434",
          email: "\u0438\u043C\u0435\u0439\u043B \u0430\u0434\u0440\u0435\u0441",
          url: "URL",
          emoji: "\u0435\u043C\u043E\u0434\u0436\u0438",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO \u0432\u0440\u0435\u043C\u0435",
          date: "ISO \u0434\u0430\u0442\u0430",
          time: "ISO \u0432\u0440\u0435\u043C\u0435",
          duration:
            "ISO \u043F\u0440\u043E\u0434\u044A\u043B\u0436\u0438\u0442\u0435\u043B\u043D\u043E\u0441\u0442",
          ipv4: "IPv4 \u0430\u0434\u0440\u0435\u0441",
          ipv6: "IPv6 \u0430\u0434\u0440\u0435\u0441",
          mac: "MAC \u0430\u0434\u0440\u0435\u0441",
          cidrv4: "IPv4 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D",
          cidrv6: "IPv6 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D",
          base64: "base64-\u043A\u043E\u0434\u0438\u0440\u0430\u043D \u043D\u0438\u0437",
          base64url: "base64url-\u043A\u043E\u0434\u0438\u0440\u0430\u043D \u043D\u0438\u0437",
          json_string: "JSON \u043D\u0438\u0437",
          e164: "E.164 \u043D\u043E\u043C\u0435\u0440",
          credit_card:
            "\u043D\u043E\u043C\u0435\u0440 \u043D\u0430 \u043A\u0440\u0435\u0434\u0438\u0442\u043D\u0430 \u043A\u0430\u0440\u0442\u0430",
          currency_code: "\u043A\u043E\u0434 \u043D\u0430 \u0432\u0430\u043B\u0443\u0442\u0430",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "\u0432\u0445\u043E\u0434",
        },
        n = {
          nan: "NaN",
          number: "\u0447\u0438\u0441\u043B\u043E",
          array: "\u043C\u0430\u0441\u0438\u0432",
        };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434: \u043E\u0447\u0430\u043A\u0432\u0430\u043D instanceof ${o.expected}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D ${a}`
              : `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434: \u043E\u0447\u0430\u043A\u0432\u0430\u043D ${i}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434: \u043E\u0447\u0430\u043A\u0432\u0430\u043D ${z(o.values[0])}`
              : `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u0430 \u043E\u043F\u0446\u0438\u044F: \u043E\u0447\u0430\u043A\u0432\u0430\u043D\u043E \u0435\u0434\u043D\u043E \u043E\u0442 ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `\u0422\u0432\u044A\u0440\u0434\u0435 \u0433\u043E\u043B\u044F\u043C\u043E: \u043E\u0447\u0430\u043A\u0432\u0430 \u0441\u0435 ${o.origin ?? "\u0441\u0442\u043E\u0439\u043D\u043E\u0441\u0442"} \u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430 ${i}${o.maximum.toString()} ${s.unit ?? "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430"}`
              : `\u0422\u0432\u044A\u0440\u0434\u0435 \u0433\u043E\u043B\u044F\u043C\u043E: \u043E\u0447\u0430\u043A\u0432\u0430 \u0441\u0435 ${o.origin ?? "\u0441\u0442\u043E\u0439\u043D\u043E\u0441\u0442"} \u0434\u0430 \u0431\u044A\u0434\u0435 ${i}${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `\u0422\u0432\u044A\u0440\u0434\u0435 \u043C\u0430\u043B\u043A\u043E: \u043E\u0447\u0430\u043A\u0432\u0430 \u0441\u0435 ${o.origin} \u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430 ${i}${o.minimum.toString()} ${s.unit}`
              : `\u0422\u0432\u044A\u0440\u0434\u0435 \u043C\u0430\u043B\u043A\u043E: \u043E\u0447\u0430\u043A\u0432\u0430 \u0441\u0435 ${o.origin} \u0434\u0430 \u0431\u044A\u0434\u0435 ${i}${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            if (i.format === "starts_with")
              return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043D\u0438\u0437: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0437\u0430\u043F\u043E\u0447\u0432\u0430 \u0441 "${i.prefix}"`;
            if (i.format === "ends_with")
              return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043D\u0438\u0437: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0437\u0430\u0432\u044A\u0440\u0448\u0432\u0430 \u0441 "${i.suffix}"`;
            if (i.format === "includes")
              return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043D\u0438\u0437: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0432\u043A\u043B\u044E\u0447\u0432\u0430 "${i.includes}"`;
            if (i.format === "regex")
              return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043D\u0438\u0437: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0441\u044A\u0432\u043F\u0430\u0434\u0430 \u0441 ${i.pattern}`;
            let s = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D";
            return (
              i.format === "emoji" &&
                (s = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u043E"),
              i.format === "datetime" &&
                (s = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u043E"),
              i.format === "date" && (s = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u0430"),
              i.format === "time" && (s = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u043E"),
              i.format === "duration" &&
                (s = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u0430"),
              `${s} ${r[i.format] ?? o.format}`
            );
          }
          case "not_multiple_of":
            return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u043E \u0447\u0438\u0441\u043B\u043E: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0431\u044A\u0434\u0435 \u043A\u0440\u0430\u0442\u043D\u043E \u043D\u0430 ${o.divisor}`;
          case "unrecognized_keys":
            return `\u041D\u0435\u0440\u0430\u0437\u043F\u043E\u0437\u043D\u0430\u0442${o.keys.length > 1 ? "\u0438" : ""} \u043A\u043B\u044E\u0447${o.keys.length > 1 ? "\u043E\u0432\u0435" : ""}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043A\u043B\u044E\u0447 \u0432 ${o.origin}`;
          case "invalid_union":
            return "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434";
          case "invalid_element":
            return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u0430 \u0441\u0442\u043E\u0439\u043D\u043E\u0441\u0442 \u0432 ${o.origin}`;
          default:
            return "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434";
        }
      };
    };
  });
function sQ() {
  return { localeError: bZe() };
}
var bZe,
  aQ = g(() => {
    me();
    bZe = () => {
      let t = {
        string: {
          unit: "\u0985\u0995\u09CD\u09B7\u09B0",
          verb: "\u09A5\u09BE\u0995\u09A4\u09C7 \u09B9\u09AC\u09C7",
        },
        file: {
          unit: "\u09AC\u09BE\u0987\u099F",
          verb: "\u09A5\u09BE\u0995\u09A4\u09C7 \u09B9\u09AC\u09C7",
        },
        array: {
          unit: "\u0986\u0987\u099F\u09C7\u09AE",
          verb: "\u09A5\u09BE\u0995\u09A4\u09C7 \u09B9\u09AC\u09C7",
        },
        set: {
          unit: "\u0986\u0987\u099F\u09C7\u09AE",
          verb: "\u09A5\u09BE\u0995\u09A4\u09C7 \u09B9\u09AC\u09C7",
        },
        map: {
          unit: "\u098F\u09A8\u09CD\u099F\u09CD\u09B0\u09BF",
          verb: "\u09A5\u09BE\u0995\u09A4\u09C7 \u09B9\u09AC\u09C7",
        },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "\u0987\u09A8\u09AA\u09C1\u099F",
          email: "\u0987\u09AE\u09C7\u0987\u09B2 \u09A0\u09BF\u0995\u09BE\u09A8\u09BE",
          url: "URL",
          emoji: "\u0987\u09AE\u09CB\u099C\u09BF",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO \u09A4\u09BE\u09B0\u09BF\u0996 \u0993 \u09B8\u09AE\u09AF\u09BC",
          date: "ISO \u09A4\u09BE\u09B0\u09BF\u0996",
          time: "ISO \u09B8\u09AE\u09AF\u09BC",
          duration: "ISO \u09B8\u09AE\u09AF\u09BC\u0995\u09BE\u09B2",
          ipv4: "IPv4 \u09A0\u09BF\u0995\u09BE\u09A8\u09BE",
          ipv6: "IPv6 \u09A0\u09BF\u0995\u09BE\u09A8\u09BE",
          mac: "MAC \u09A0\u09BF\u0995\u09BE\u09A8\u09BE",
          cidrv4: "IPv4 \u09B0\u09C7\u099E\u09CD\u099C",
          cidrv6: "IPv6 \u09B0\u09C7\u099E\u09CD\u099C",
          base64:
            "base64-\u098F\u09A8\u0995\u09CB\u09A1\u09C7\u09A1 \u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0982",
          base64url:
            "base64url-\u098F\u09A8\u0995\u09CB\u09A1\u09C7\u09A1 \u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0982",
          json_string: "JSON \u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0982",
          e164: "E.164 \u09A8\u09AE\u09CD\u09AC\u09B0",
          credit_card:
            "\u0995\u09CD\u09B0\u09C7\u09A1\u09BF\u099F \u0995\u09BE\u09B0\u09CD\u09A1 \u09A8\u09AE\u09CD\u09AC\u09B0",
          currency_code: "\u09AE\u09C1\u09A6\u09CD\u09B0\u09BE \u0995\u09CB\u09A1",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "\u0987\u09A8\u09AA\u09C1\u099F",
        },
        n = { nan: "NaN" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return `\u0985\u09AC\u09C8\u09A7 \u0987\u09A8\u09AA\u09C1\u099F: \u09AA\u09CD\u09B0\u09A4\u09CD\u09AF\u09BE\u09B6\u09BF\u09A4 ${i}, \u09AA\u09CD\u09B0\u09BE\u09AA\u09CD\u09A4 ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `\u0985\u09AC\u09C8\u09A7 \u0987\u09A8\u09AA\u09C1\u099F: \u09AA\u09CD\u09B0\u09A4\u09CD\u09AF\u09BE\u09B6\u09BF\u09A4 ${z(o.values[0])}`
              : `\u0985\u09AC\u09C8\u09A7 \u0985\u09AA\u09B6\u09A8: ${B(o.values, " | ")} \u098F\u09B0 \u09AE\u09A7\u09CD\u09AF\u09C7 \u098F\u0995\u099F\u09BF \u09AA\u09CD\u09B0\u09A4\u09CD\u09AF\u09BE\u09B6\u09BF\u09A4`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `\u0985\u09A8\u09C7\u0995 \u09AC\u09A1\u09BC: ${o.origin ?? "\u09AE\u09BE\u09A8"} ${i}${o.maximum.toString()} ${s.unit ?? "\u098F\u09B2\u09BF\u09AE\u09C7\u09A8\u09CD\u099F"} \u09B9\u09A4\u09C7 \u09B9\u09AC\u09C7`
              : `\u0985\u09A8\u09C7\u0995 \u09AC\u09A1\u09BC: ${o.origin ?? "\u09AE\u09BE\u09A8"} ${i}${o.maximum.toString()} \u09B9\u09A4\u09C7 \u09B9\u09AC\u09C7`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `\u0985\u09A8\u09C7\u0995 \u099B\u09CB\u099F: ${o.origin} ${i}${o.minimum.toString()} ${s.unit} \u09B9\u09A4\u09C7 \u09B9\u09AC\u09C7`
              : `\u0985\u09A8\u09C7\u0995 \u099B\u09CB\u099F: ${o.origin} ${i}${o.minimum.toString()} \u09B9\u09A4\u09C7 \u09B9\u09AC\u09C7`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `\u0985\u09AC\u09C8\u09A7 \u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0982: "${i.prefix}" \u09A6\u09BF\u09AF\u09BC\u09C7 \u09B6\u09C1\u09B0\u09C1 \u09B9\u09A4\u09C7 \u09B9\u09AC\u09C7`
              : i.format === "ends_with"
                ? `\u0985\u09AC\u09C8\u09A7 \u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0982: "${i.suffix}" \u09A6\u09BF\u09AF\u09BC\u09C7 \u09B6\u09C7\u09B7 \u09B9\u09A4\u09C7 \u09B9\u09AC\u09C7`
                : i.format === "includes"
                  ? `\u0985\u09AC\u09C8\u09A7 \u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0982: "${i.includes}" \u0985\u09A8\u09CD\u09A4\u09B0\u09CD\u09AD\u09C1\u0995\u09CD\u09A4 \u09A5\u09BE\u0995\u09A4\u09C7 \u09B9\u09AC\u09C7`
                  : i.format === "regex"
                    ? `\u0985\u09AC\u09C8\u09A7 \u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0982: ${i.pattern} \u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u09AE\u09BF\u09B2\u09A4\u09C7 \u09B9\u09AC\u09C7`
                    : `\u0985\u09AC\u09C8\u09A7 ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `\u0985\u09AC\u09C8\u09A7 \u09A8\u09AE\u09CD\u09AC\u09B0: ${o.divisor} \u098F\u09B0 \u0997\u09C1\u09A3\u09BF\u09A4\u0995 \u09B9\u09A4\u09C7 \u09B9\u09AC\u09C7`;
          case "unrecognized_keys":
            return `\u0985\u099A\u09C7\u09A8\u09BE \u0995\u09C0${o.keys.length > 1 ? "\u0997\u09C1\u09B2\u09CB" : ""}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `${o.origin} \u098F \u0985\u09AC\u09C8\u09A7 \u0995\u09C0`;
          case "invalid_union":
            return o.options && Array.isArray(o.options) && o.options.length > 0
              ? `\u0985\u09AC\u09C8\u09A7 \u09A1\u09BF\u09B8\u0995\u09CD\u09B0\u09BF\u09AE\u09BF\u09A8\u09C7\u099F\u09B0 \u09AE\u09BE\u09A8\u0964 \u09AA\u09CD\u09B0\u09A4\u09CD\u09AF\u09BE\u09B6\u09BF\u09A4 ${o.options.map((s) => `'${s}'`).join(" | ")}`
              : "\u0985\u09AC\u09C8\u09A7 \u0987\u09A8\u09AA\u09C1\u099F";
          case "invalid_element":
            return `${o.origin} \u098F \u0985\u09AC\u09C8\u09A7 \u09AE\u09BE\u09A8`;
          default:
            return "\u0985\u09AC\u09C8\u09A7 \u0987\u09A8\u09AA\u09C1\u099F";
        }
      };
    };
  });
function lQ() {
  return { localeError: SZe() };
}
var SZe,
  cQ = g(() => {
    me();
    SZe = () => {
      let t = {
        string: { unit: "car\xE0cters", verb: "contenir" },
        file: { unit: "bytes", verb: "contenir" },
        array: { unit: "elements", verb: "contenir" },
        set: { unit: "elements", verb: "contenir" },
        map: { unit: "elements", verb: "contenir" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "entrada",
          email: "adre\xE7a electr\xF2nica",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "data i hora ISO",
          date: "data ISO",
          time: "hora ISO",
          duration: "durada ISO",
          ipv4: "adre\xE7a IPv4",
          ipv6: "adre\xE7a IPv6",
          mac: "adre\xE7a MAC",
          cidrv4: "rang IPv4",
          cidrv6: "rang IPv6",
          base64: "cadena codificada en base64",
          base64url: "cadena codificada en base64url",
          json_string: "cadena JSON",
          e164: "n\xFAmero E.164",
          credit_card: "n\xFAmero de targeta de cr\xE8dit",
          currency_code: "codi de moneda",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "entrada",
        },
        n = { nan: "NaN" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `Tipus inv\xE0lid: s'esperava instanceof ${o.expected}, s'ha rebut ${a}`
              : `Tipus inv\xE0lid: s'esperava ${i}, s'ha rebut ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `Valor inv\xE0lid: s'esperava ${z(o.values[0])}`
              : `Opci\xF3 inv\xE0lida: s'esperava una de ${B(o.values, " o ")}`;
          case "too_big": {
            let i = o.inclusive ? "com a m\xE0xim" : "menys de",
              s = e(o.origin);
            return s
              ? `Massa gran: s'esperava que ${o.origin ?? "el valor"} contingu\xE9s ${i} ${o.maximum.toString()} ${s.unit ?? "elements"}`
              : `Massa gran: s'esperava que ${o.origin ?? "el valor"} fos ${i} ${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? "com a m\xEDnim" : "m\xE9s de",
              s = e(o.origin);
            return s
              ? `Massa petit: s'esperava que ${o.origin} contingu\xE9s ${i} ${o.minimum.toString()} ${s.unit}`
              : `Massa petit: s'esperava que ${o.origin} fos ${i} ${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `Format inv\xE0lid: ha de comen\xE7ar amb "${i.prefix}"`
              : i.format === "ends_with"
                ? `Format inv\xE0lid: ha d'acabar amb "${i.suffix}"`
                : i.format === "includes"
                  ? `Format inv\xE0lid: ha d'incloure "${i.includes}"`
                  : i.format === "regex"
                    ? `Format inv\xE0lid: ha de coincidir amb el patr\xF3 ${i.pattern}`
                    : `Format inv\xE0lid per a ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `N\xFAmero inv\xE0lid: ha de ser m\xFAltiple de ${o.divisor}`;
          case "unrecognized_keys":
            return `Clau${o.keys.length > 1 ? "s" : ""} no reconeguda${o.keys.length > 1 ? "s" : ""}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `Clau inv\xE0lida a ${o.origin}`;
          case "invalid_union":
            return "Entrada inv\xE0lida";
          case "invalid_element":
            return `Element inv\xE0lid a ${o.origin}`;
          default:
            return "Entrada inv\xE0lida";
        }
      };
    };
  });
function uQ() {
  return { localeError: wZe() };
}
var wZe,
  dQ = g(() => {
    me();
    wZe = () => {
      let t = {
        string: { unit: "\u067E\u06CC\u062A", verb: "\u0628\u06CE\u062A" },
        file: { unit: "\u0628\u0627\u06CC\u062A", verb: "\u0628\u06CE\u062A" },
        array: { unit: "\u062F\u0627\u0646\u06D5", verb: "\u0628\u06CE\u062A" },
        set: { unit: "\u062F\u0627\u0646\u06D5", verb: "\u0628\u06CE\u062A" },
        map: { unit: "\u062F\u0627\u0646\u06D5", verb: "\u0628\u06CE\u062A" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "regex",
          email: "\u0626\u06CC\u0645\u06D5\u06CC\u06B5",
          url: "\u0628\u06D5\u0633\u062A\u06D5\u0631 (URL)",
          emoji: "\u0626\u06CC\u0645\u06C6\u062C\u06CC",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "\u0695\u06CE\u06A9\u06D5\u0648\u062A \u0648 \u06A9\u0627\u062A",
          date: "\u0695\u06CE\u06A9\u06D5\u0648\u062A",
          time: "\u06A9\u0627\u062A",
          duration: "\u0645\u0627\u0648\u06D5",
          ipv4: "\u0646\u0627\u0648\u0646\u06CC\u0634\u0627\u0646\u06CC IPv4",
          ipv6: "\u0646\u0627\u0648\u0646\u06CC\u0634\u0627\u0646\u06CC IPv6",
          mac: "\u0646\u0627\u0648\u0646\u06CC\u0634\u0627\u0646\u06CC MAC",
          cidrv4: "\u0645\u06D5\u0648\u062F\u0627\u06CC IPv4",
          cidrv6: "\u0645\u06D5\u0648\u062F\u0627\u06CC IPv6",
          base64: "\u062F\u06D5\u0642\u06CC base64",
          base64url: "\u062F\u06D5\u0642\u06CC base64url",
          json_string: "\u062F\u06D5\u0642\u06CC JSON",
          e164: "\u0698\u0645\u0627\u0631\u06D5\u06CC E.164",
          credit_card:
            "\u0698\u0645\u0627\u0631\u06D5\u06CC \u06A9\u0627\u0631\u062A\u06CC \u06A9\u0631\u06CE\u062F\u06CC\u062A",
          currency_code: "\u06A9\u06C6\u062F\u06CC \u062F\u0631\u0627\u0648",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "\u062A\u06CE\u06A9\u0631\u062F\u06D5",
        },
        n = {
          nan: "NaN",
          string: "\u0646\u0648\u0648\u0633\u06CC\u0646",
          number: "\u0698\u0645\u0627\u0631\u06D5",
          boolean: "boolean",
          array: "array",
          object: "object",
          date: "\u0695\u06CE\u06A9\u06D5\u0648\u062A",
          integer: "\u0698\u0645\u0627\u0631\u06D5",
          float: "\u0698\u0645\u0627\u0631\u06D5",
          null: "null",
          undefined: "undefined",
          function: "function",
          symbol: "symbol",
          unknown: "unknown",
          promise: "promise",
          void: "void",
          never: "never",
          map: "map",
          set: "set",
        };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s,
              l = ["\u0627", "\u0648", "\u06C6", "\u0648\u0648", "\u06D5", "\u06CC", "\u06CE"].some(
                (u) => a.endsWith(u),
              )
                ? "\u06CC\u06D5"
                : "\u06D5",
              c = /^[a-zA-Z]+$/.test(a);
            return s === "null" || s === "undefined"
              ? "\u062F\u0627\u0648\u0627\u06A9\u0631\u0627\u0648\u06D5"
              : `\u0686\u0627\u0648\u06D5\u0695\u0648\u0627\u0646\u06A9\u0631\u0627\u0648\u06D5 ${i} \u0628\u06CE\u062A\u060C \u0628\u06D5\u06B5\u0627\u0645 ${a}${c ? "" : l}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `\u0628\u06D5\u0647\u0627\u06A9\u06D5 \u0646\u0627\u062F\u0631\u0648\u0648\u0633\u062A\u06D5: \u0686\u0627\u0648\u06D5\u0695\u0648\u0627\u0646\u06A9\u0631\u0627\u0648\u06D5 ${z(o.values[0])} \u0628\u06CE\u062A`
              : `\u0647\u06D5\u06B5\u0628\u0698\u0627\u0631\u062F\u06D5\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A: \u0686\u0627\u0648\u06D5\u0695\u0648\u0627\u0646\u06A9\u0631\u0627\u0648\u06D5 \u06CC\u06D5\u06A9\u06CE\u06A9 \u0628\u06CE\u062A \u0644\u06D5 ${B(o.values, "|")}`;
          case "too_big": {
            let i = e(o.origin);
            return i
              ? `\u067E\u06CE\u0648\u06CC\u0633\u062A\u06D5 \u0628\u06D5 \u0644\u0627\u06CC\u06D5\u0646\u06CC \u0632\u06C6\u0631\u06D5\u0648\u06D5 ${o.maximum.toString()} ${i.unit} ${i.verb}`
              : `\u067E\u06CE\u0648\u06CC\u0633\u062A\u06D5 \u0628\u06D5 \u0644\u0627\u06CC\u06D5\u0646\u06CC \u0632\u06C6\u0631\u06D5\u0648\u06D5 ${o.maximum.toString()} \u0628\u06CE\u062A`;
          }
          case "too_small": {
            let i = e(o.origin);
            return i
              ? `\u067E\u06CE\u0648\u06CC\u0633\u062A\u06D5 \u0628\u06D5 \u0644\u0627\u06CC\u06D5\u0646\u06CC \u06A9\u06D5\u0645\u06D5\u0648\u06D5 ${o.minimum.toString()} ${i.unit} ${i.verb}`
              : `\u067E\u06CE\u0648\u06CC\u0633\u062A\u06D5 \u0628\u06D5 \u0644\u0627\u06CC\u06D5\u0646\u06CC \u06A9\u06D5\u0645\u06D5\u0648\u06D5 ${o.minimum.toString()} \u0628\u06CE\u062A`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `\u062F\u06D5\u0642\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A: \u067E\u06CE\u0648\u06CC\u0633\u062A\u06D5 \u062F\u06D5\u0633\u062A\u067E\u06CE\u0628\u06A9\u0627\u062A \u0628\u06D5 "${i.prefix}"`
              : i.format === "ends_with"
                ? `\u062F\u06D5\u0642\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A: \u067E\u06CE\u0648\u06CC\u0633\u062A\u06D5 \u06A9\u06C6\u062A\u0627\u06CC\u06CC\u0628\u06CE\u062A \u0628\u06D5 "${i.suffix}"`
                : i.format === "includes"
                  ? `\u062F\u06D5\u0642\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A: \u067E\u06CE\u0648\u06CC\u0633\u062A\u06D5 "${i.includes}" \u0644\u06D5\u062E\u06C6\u0628\u06AF\u0631\u06CE\u062A`
                  : i.format === "regex"
                    ? `\u062F\u06D5\u0642\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A: \u067E\u06CE\u0648\u06CC\u0633\u062A\u06D5 \u0644\u06D5\u06AF\u06D5\u06B5 \u067E\u0627\u062A\u06CE\u0631\u0646\u06CC ${i.pattern} \u0628\u06AF\u0648\u0646\u062C\u06CE\u062A`
                    : `\u0628\u06D5\u0647\u0627\u06CC ${r[i.format] ?? o.format} \u0646\u0627\u062F\u0631\u0648\u0633\u062A\u06D5`;
          }
          case "not_multiple_of":
            return `\u0698\u0645\u0627\u0631\u06D5\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A: \u062F\u06D5\u0628\u06CE\u062A \u0686\u06D5\u0646\u062F \u0647\u06CE\u0646\u062F\u06D5 \u0628\u06CE\u062A \u0628\u06C6 ${o.divisor}`;
          case "unrecognized_keys":
            return `\u06A9\u0644\u06CC\u0644\u06CC \u0646\u06D5\u0646\u0627\u0633\u0631\u0627\u0648: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `\u06A9\u0644\u06CC\u0644\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A \u0644\u06D5 ${o.origin}`;
          case "invalid_union":
            return o.options && Array.isArray(o.options) && o.options.length > 0
              ? `\u0628\u06D5\u0647\u0627\u06CC \u0646\u06D5\u0646\u0627\u0633\u0631\u0627\u0648 \u0647\u06D5\u06CC\u06D5. \u0628\u06D5\u0647\u0627\u06CC \u0686\u0627\u0648\u06D5\u0695\u0648\u0627\u0646\u06A9\u0631\u0627\u0648: ${o.options.map((s) => `'${s}'`).join(" | ")}`
              : "\u06CC\u06D5\u06A9\u06AF\u0631\u062A\u0646\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A";
          case "invalid_element":
            return `${o.origin} \u0628\u06D5\u0647\u0627\u06A9\u06D5 \u0646\u0627\u062F\u0631\u0648\u0633\u062A\u06D5`;
          default:
            return "\u062A\u06CE\u06A9\u0631\u062F\u06D5\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A";
        }
      };
    };
  });
function pQ() {
  return { localeError: _Ze() };
}
var _Ze,
  mQ = g(() => {
    me();
    _Ze = () => {
      let t = {
        string: { unit: "znak\u016F", verb: "m\xEDt" },
        file: { unit: "bajt\u016F", verb: "m\xEDt" },
        array: { unit: "prvk\u016F", verb: "m\xEDt" },
        set: { unit: "prvk\u016F", verb: "m\xEDt" },
        map: { unit: "prvk\u016F", verb: "m\xEDt" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "regul\xE1rn\xED v\xFDraz",
          email: "e-mailov\xE1 adresa",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "datum a \u010Das ve form\xE1tu ISO",
          date: "datum ve form\xE1tu ISO",
          time: "\u010Das ve form\xE1tu ISO",
          duration: "doba trv\xE1n\xED ISO",
          ipv4: "IPv4 adresa",
          ipv6: "IPv6 adresa",
          mac: "MAC adresa",
          cidrv4: "rozsah IPv4",
          cidrv6: "rozsah IPv6",
          base64: "\u0159et\u011Bzec zak\xF3dovan\xFD ve form\xE1tu base64",
          base64url: "\u0159et\u011Bzec zak\xF3dovan\xFD ve form\xE1tu base64url",
          json_string: "\u0159et\u011Bzec ve form\xE1tu JSON",
          e164: "\u010D\xEDslo E.164",
          credit_card: "\u010D\xEDslo kreditn\xED karty",
          currency_code: "k\xF3d m\u011Bny",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "vstup",
        },
        n = {
          nan: "NaN",
          number: "\u010D\xEDslo",
          string: "\u0159et\u011Bzec",
          function: "funkce",
          array: "pole",
        };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `Neplatn\xFD vstup: o\u010Dek\xE1v\xE1no instanceof ${o.expected}, obdr\u017Eeno ${a}`
              : `Neplatn\xFD vstup: o\u010Dek\xE1v\xE1no ${i}, obdr\u017Eeno ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `Neplatn\xFD vstup: o\u010Dek\xE1v\xE1no ${z(o.values[0])}`
              : `Neplatn\xE1 mo\u017Enost: o\u010Dek\xE1v\xE1na jedna z hodnot ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `Hodnota je p\u0159\xEDli\u0161 velk\xE1: ${o.origin ?? "hodnota"} mus\xED m\xEDt ${i}${o.maximum.toString()} ${s.unit ?? "prvk\u016F"}`
              : `Hodnota je p\u0159\xEDli\u0161 velk\xE1: ${o.origin ?? "hodnota"} mus\xED b\xFDt ${i}${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `Hodnota je p\u0159\xEDli\u0161 mal\xE1: ${o.origin ?? "hodnota"} mus\xED m\xEDt ${i}${o.minimum.toString()} ${s.unit ?? "prvk\u016F"}`
              : `Hodnota je p\u0159\xEDli\u0161 mal\xE1: ${o.origin ?? "hodnota"} mus\xED b\xFDt ${i}${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `Neplatn\xFD \u0159et\u011Bzec: mus\xED za\u010D\xEDnat na "${i.prefix}"`
              : i.format === "ends_with"
                ? `Neplatn\xFD \u0159et\u011Bzec: mus\xED kon\u010Dit na "${i.suffix}"`
                : i.format === "includes"
                  ? `Neplatn\xFD \u0159et\u011Bzec: mus\xED obsahovat "${i.includes}"`
                  : i.format === "regex"
                    ? `Neplatn\xFD \u0159et\u011Bzec: mus\xED odpov\xEDdat vzoru ${i.pattern}`
                    : `Neplatn\xFD form\xE1t ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `Neplatn\xE9 \u010D\xEDslo: mus\xED b\xFDt n\xE1sobkem ${o.divisor}`;
          case "unrecognized_keys":
            return `Nezn\xE1m\xE9 kl\xED\u010De: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `Neplatn\xFD kl\xED\u010D v ${o.origin}`;
          case "invalid_union":
            return "Neplatn\xFD vstup";
          case "invalid_element":
            return `Neplatn\xE1 hodnota v ${o.origin}`;
          default:
            return "Neplatn\xFD vstup";
        }
      };
    };
  });
function fQ() {
  return { localeError: xZe() };
}
var xZe,
  hQ = g(() => {
    me();
    xZe = () => {
      let t = {
        string: { unit: "tegn", verb: "havde" },
        file: { unit: "bytes", verb: "havde" },
        array: { unit: "elementer", verb: "indeholdt" },
        set: { unit: "elementer", verb: "indeholdt" },
        map: { unit: "elementer", verb: "indeholdt" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "input",
          email: "e-mailadresse",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO dato- og klokkesl\xE6t",
          date: "ISO-dato",
          time: "ISO-klokkesl\xE6t",
          duration: "ISO-varighed",
          ipv4: "IPv4-adresse",
          ipv6: "IPv6-adresse",
          mac: "MAC-adresse",
          cidrv4: "IPv4-spektrum",
          cidrv6: "IPv6-spektrum",
          base64: "base64-kodet streng",
          base64url: "base64url-kodet streng",
          json_string: "JSON-streng",
          e164: "E.164-nummer",
          credit_card: "kreditkortnummer",
          currency_code: "valutakode",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "input",
        },
        n = {
          nan: "NaN",
          string: "streng",
          number: "tal",
          boolean: "boolean",
          array: "liste",
          object: "objekt",
          set: "s\xE6t",
          file: "fil",
        };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `Ugyldigt input: forventede instanceof ${o.expected}, fik ${a}`
              : `Ugyldigt input: forventede ${i}, fik ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `Ugyldig v\xE6rdi: forventede ${z(o.values[0])}`
              : `Ugyldigt valg: forventede en af f\xF8lgende ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin),
              a = n[o.origin] ?? o.origin;
            return s
              ? `For stor: forventede ${a ?? "value"} ${s.verb} ${i} ${o.maximum.toString()} ${s.unit ?? "elementer"}`
              : `For stor: forventede ${a ?? "value"} havde ${i} ${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin),
              a = n[o.origin] ?? o.origin;
            return s
              ? `For lille: forventede ${a} ${s.verb} ${i} ${o.minimum.toString()} ${s.unit}`
              : `For lille: forventede ${a} havde ${i} ${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `Ugyldig streng: skal starte med "${i.prefix}"`
              : i.format === "ends_with"
                ? `Ugyldig streng: skal ende med "${i.suffix}"`
                : i.format === "includes"
                  ? `Ugyldig streng: skal indeholde "${i.includes}"`
                  : i.format === "regex"
                    ? `Ugyldig streng: skal matche m\xF8nsteret ${i.pattern}`
                    : `Ugyldig ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `Ugyldigt tal: skal v\xE6re deleligt med ${o.divisor}`;
          case "unrecognized_keys":
            return `${o.keys.length > 1 ? "Ukendte n\xF8gler" : "Ukendt n\xF8gle"}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `Ugyldig n\xF8gle i ${o.origin}`;
          case "invalid_union":
            return "Ugyldigt input: matcher ingen af de tilladte typer";
          case "invalid_element":
            return `Ugyldig v\xE6rdi i ${o.origin}`;
          default:
            return "Ugyldigt input";
        }
      };
    };
  });
function gQ() {
  return { localeError: AZe() };
}
var AZe,
  yQ = g(() => {
    me();
    AZe = () => {
      let t = {
        string: { unit: "Zeichen", verb: "zu haben" },
        file: { unit: "Bytes", verb: "zu haben" },
        array: { unit: "Elemente", verb: "zu haben" },
        set: { unit: "Elemente", verb: "zu haben" },
        map: { unit: "Elemente", verb: "zu haben" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "Eingabe",
          email: "E-Mail-Adresse",
          url: "URL",
          emoji: "Emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO-Datum und -Uhrzeit",
          date: "ISO-Datum",
          time: "ISO-Uhrzeit",
          duration: "ISO-Dauer",
          ipv4: "IPv4-Adresse",
          ipv6: "IPv6-Adresse",
          mac: "MAC-Adresse",
          cidrv4: "IPv4-Bereich",
          cidrv6: "IPv6-Bereich",
          base64: "Base64-codierter String",
          base64url: "Base64-URL-codierter String",
          json_string: "JSON-String",
          e164: "E.164-Nummer",
          credit_card: "Kreditkartennummer",
          currency_code: "W\xE4hrungscode",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "Eingabe",
        },
        n = { nan: "NaN", number: "Zahl", array: "Array" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `Ung\xFCltige Eingabe: erwartet instanceof ${o.expected}, erhalten ${a}`
              : `Ung\xFCltige Eingabe: erwartet ${i}, erhalten ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `Ung\xFCltige Eingabe: erwartet ${z(o.values[0])}`
              : `Ung\xFCltige Option: erwartet eine von ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `Zu gro\xDF: erwartet, dass ${o.origin ?? "Wert"} ${i}${o.maximum.toString()} ${s.unit ?? "Elemente"} hat`
              : `Zu gro\xDF: erwartet, dass ${o.origin ?? "Wert"} ${i}${o.maximum.toString()} ist`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `Zu klein: erwartet, dass ${o.origin} ${i}${o.minimum.toString()} ${s.unit} hat`
              : `Zu klein: erwartet, dass ${o.origin} ${i}${o.minimum.toString()} ist`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `Ung\xFCltiger String: muss mit "${i.prefix}" beginnen`
              : i.format === "ends_with"
                ? `Ung\xFCltiger String: muss mit "${i.suffix}" enden`
                : i.format === "includes"
                  ? `Ung\xFCltiger String: muss "${i.includes}" enthalten`
                  : i.format === "regex"
                    ? `Ung\xFCltiger String: muss dem Muster ${i.pattern} entsprechen`
                    : `Ung\xFCltig: ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `Ung\xFCltige Zahl: muss ein Vielfaches von ${o.divisor} sein`;
          case "unrecognized_keys":
            return `${o.keys.length > 1 ? "Unbekannte Schl\xFCssel" : "Unbekannter Schl\xFCssel"}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `Ung\xFCltiger Schl\xFCssel in ${o.origin}`;
          case "invalid_union":
            return "Ung\xFCltige Eingabe";
          case "invalid_element":
            return `Ung\xFCltiger Wert in ${o.origin}`;
          default:
            return "Ung\xFCltige Eingabe";
        }
      };
    };
  });
function vQ() {
  return { localeError: RZe() };
}
var RZe,
  bQ = g(() => {
    me();
    RZe = () => {
      let t = {
        string: {
          unit: "\u03C7\u03B1\u03C1\u03B1\u03BA\u03C4\u03AE\u03C1\u03B5\u03C2",
          verb: "\u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9",
        },
        file: { unit: "bytes", verb: "\u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9" },
        array: {
          unit: "\u03C3\u03C4\u03BF\u03B9\u03C7\u03B5\u03AF\u03B1",
          verb: "\u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9",
        },
        set: {
          unit: "\u03C3\u03C4\u03BF\u03B9\u03C7\u03B5\u03AF\u03B1",
          verb: "\u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9",
        },
        map: {
          unit: "\u03BA\u03B1\u03C4\u03B1\u03C7\u03C9\u03C1\u03AE\u03C3\u03B5\u03B9\u03C2",
          verb: "\u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9",
        },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "\u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2",
          email: "\u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 email",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime:
            "ISO \u03B7\u03BC\u03B5\u03C1\u03BF\u03BC\u03B7\u03BD\u03AF\u03B1 \u03BA\u03B1\u03B9 \u03CE\u03C1\u03B1",
          date: "ISO \u03B7\u03BC\u03B5\u03C1\u03BF\u03BC\u03B7\u03BD\u03AF\u03B1",
          time: "ISO \u03CE\u03C1\u03B1",
          duration: "ISO \u03B4\u03B9\u03AC\u03C1\u03BA\u03B5\u03B9\u03B1",
          ipv4: "\u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 IPv4",
          ipv6: "\u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 IPv6",
          mac: "\u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 MAC",
          cidrv4: "\u03B5\u03CD\u03C1\u03BF\u03C2 IPv4",
          cidrv6: "\u03B5\u03CD\u03C1\u03BF\u03C2 IPv6",
          base64:
            "\u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC \u03BA\u03C9\u03B4\u03B9\u03BA\u03BF\u03C0\u03BF\u03B9\u03B7\u03BC\u03AD\u03BD\u03B7 \u03C3\u03B5 base64",
          base64url:
            "\u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC \u03BA\u03C9\u03B4\u03B9\u03BA\u03BF\u03C0\u03BF\u03B9\u03B7\u03BC\u03AD\u03BD\u03B7 \u03C3\u03B5 base64url",
          json_string:
            "\u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC JSON",
          e164: "\u03B1\u03C1\u03B9\u03B8\u03BC\u03CC\u03C2 E.164",
          credit_card:
            "\u03B1\u03C1\u03B9\u03B8\u03BC\u03CC\u03C2 \u03C0\u03B9\u03C3\u03C4\u03C9\u03C4\u03B9\u03BA\u03AE\u03C2 \u03BA\u03AC\u03C1\u03C4\u03B1\u03C2",
          currency_code:
            "\u03BA\u03C9\u03B4\u03B9\u03BA\u03CC\u03C2 \u03BD\u03BF\u03BC\u03AF\u03C3\u03BC\u03B1\u03C4\u03BF\u03C2",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "\u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2",
        },
        n = { nan: "NaN" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return typeof o.expected == "string" && /^[A-Z]/.test(o.expected)
              ? `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD instanceof ${o.expected}, \u03BB\u03AE\u03C6\u03B8\u03B7\u03BA\u03B5 ${a}`
              : `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD ${i}, \u03BB\u03AE\u03C6\u03B8\u03B7\u03BA\u03B5 ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD ${z(o.values[0])}`
              : `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03C0\u03B9\u03BB\u03BF\u03B3\u03AE: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD \u03AD\u03BD\u03B1 \u03B1\u03C0\u03CC ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `\u03A0\u03BF\u03BB\u03CD \u03BC\u03B5\u03B3\u03AC\u03BB\u03BF: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD ${o.origin ?? "\u03C4\u03B9\u03BC\u03AE"} \u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9 ${i}${o.maximum.toString()} ${s.unit ?? "\u03C3\u03C4\u03BF\u03B9\u03C7\u03B5\u03AF\u03B1"}`
              : `\u03A0\u03BF\u03BB\u03CD \u03BC\u03B5\u03B3\u03AC\u03BB\u03BF: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD ${o.origin ?? "\u03C4\u03B9\u03BC\u03AE"} \u03BD\u03B1 \u03B5\u03AF\u03BD\u03B1\u03B9 ${i}${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `\u03A0\u03BF\u03BB\u03CD \u03BC\u03B9\u03BA\u03C1\u03CC: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD ${o.origin} \u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9 ${i}${o.minimum.toString()} ${s.unit}`
              : `\u03A0\u03BF\u03BB\u03CD \u03BC\u03B9\u03BA\u03C1\u03CC: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD ${o.origin} \u03BD\u03B1 \u03B5\u03AF\u03BD\u03B1\u03B9 ${i}${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC: \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03BE\u03B5\u03BA\u03B9\u03BD\u03AC \u03BC\u03B5 "${i.prefix}"`
              : i.format === "ends_with"
                ? `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC: \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03C4\u03B5\u03BB\u03B5\u03B9\u03CE\u03BD\u03B5\u03B9 \u03BC\u03B5 "${i.suffix}"`
                : i.format === "includes"
                  ? `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC: \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03C0\u03B5\u03C1\u03B9\u03AD\u03C7\u03B5\u03B9 "${i.includes}"`
                  : i.format === "regex"
                    ? `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC: \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03C4\u03B1\u03B9\u03C1\u03B9\u03AC\u03B6\u03B5\u03B9 \u03BC\u03B5 \u03C4\u03BF \u03BC\u03BF\u03C4\u03AF\u03B2\u03BF ${i.pattern}`
                    : `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03BF: ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03BF\u03C2 \u03B1\u03C1\u03B9\u03B8\u03BC\u03CC\u03C2: \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03B5\u03AF\u03BD\u03B1\u03B9 \u03C0\u03BF\u03BB\u03BB\u03B1\u03C0\u03BB\u03AC\u03C3\u03B9\u03BF \u03C4\u03BF\u03C5 ${o.divisor}`;
          case "unrecognized_keys":
            return `\u0386\u03B3\u03BD\u03C9\u03C3\u03C4${o.keys.length > 1 ? "\u03B1" : "\u03BF"} \u03BA\u03BB\u03B5\u03B9\u03B4${o.keys.length > 1 ? "\u03B9\u03AC" : "\u03AF"}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03BF \u03BA\u03BB\u03B5\u03B9\u03B4\u03AF \u03C3\u03C4\u03BF ${o.origin}`;
          case "invalid_union":
            return "\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2";
          case "invalid_element":
            return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03C4\u03B9\u03BC\u03AE \u03C3\u03C4\u03BF ${o.origin}`;
          default:
            return "\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2";
        }
      };
    };
  });
