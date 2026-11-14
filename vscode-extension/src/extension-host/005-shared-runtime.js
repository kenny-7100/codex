function iee() {
  return { localeError: zZe() };
}
var zZe,
  see = g(() => {
    me();
    zZe = () => {
      let t = {
        string: { unit: "\uBB38\uC790", verb: "to have" },
        file: { unit: "\uBC14\uC774\uD2B8", verb: "to have" },
        array: { unit: "\uAC1C", verb: "to have" },
        set: { unit: "\uAC1C", verb: "to have" },
        map: { unit: "\uAC1C", verb: "to have" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "\uC785\uB825",
          email: "\uC774\uBA54\uC77C \uC8FC\uC18C",
          url: "URL",
          emoji: "\uC774\uBAA8\uC9C0",
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
          datetime: "ISO \uB0A0\uC9DC\uC2DC\uAC04",
          date: "ISO \uB0A0\uC9DC",
          time: "ISO \uC2DC\uAC04",
          duration: "ISO \uAE30\uAC04",
          ipv4: "IPv4 \uC8FC\uC18C",
          ipv6: "IPv6 \uC8FC\uC18C",
          mac: "MAC \uC8FC\uC18C",
          cidrv4: "IPv4 \uBC94\uC704",
          cidrv6: "IPv6 \uBC94\uC704",
          base64: "base64 \uC778\uCF54\uB529 \uBB38\uC790\uC5F4",
          base64url: "base64url \uC778\uCF54\uB529 \uBB38\uC790\uC5F4",
          json_string: "JSON \uBB38\uC790\uC5F4",
          e164: "E.164 \uBC88\uD638",
          credit_card: "\uC2E0\uC6A9\uCE74\uB4DC \uBC88\uD638",
          currency_code: "\uD1B5\uD654 \uCF54\uB4DC",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "\uC785\uB825",
        },
        n = { nan: "NaN" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `\uC798\uBABB\uB41C \uC785\uB825: \uC608\uC0C1 \uD0C0\uC785\uC740 instanceof ${o.expected}, \uBC1B\uC740 \uD0C0\uC785\uC740 ${a}\uC785\uB2C8\uB2E4`
              : `\uC798\uBABB\uB41C \uC785\uB825: \uC608\uC0C1 \uD0C0\uC785\uC740 ${i}, \uBC1B\uC740 \uD0C0\uC785\uC740 ${a}\uC785\uB2C8\uB2E4`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `\uC798\uBABB\uB41C \uC785\uB825: \uAC12\uC740 ${z(o.values[0])} \uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4`
              : `\uC798\uBABB\uB41C \uC635\uC158: ${B(o.values, "\uB610\uB294 ")} \uC911 \uD558\uB098\uC5EC\uC57C \uD569\uB2C8\uB2E4`;
          case "too_big": {
            let i = o.inclusive ? "\uC774\uD558" : "\uBBF8\uB9CC",
              s =
                i === "\uBBF8\uB9CC"
                  ? "\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4"
                  : "\uC5EC\uC57C \uD569\uB2C8\uB2E4",
              a = e(o.origin),
              l = a?.unit ?? "\uC694\uC18C";
            return a
              ? `${o.origin ?? "\uAC12"}\uC774 \uB108\uBB34 \uD07D\uB2C8\uB2E4: ${o.maximum.toString()}${l} ${i}${s}`
              : `${o.origin ?? "\uAC12"}\uC774 \uB108\uBB34 \uD07D\uB2C8\uB2E4: ${o.maximum.toString()} ${i}${s}`;
          }
          case "too_small": {
            let i = o.inclusive ? "\uC774\uC0C1" : "\uCD08\uACFC",
              s =
                i === "\uC774\uC0C1"
                  ? "\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4"
                  : "\uC5EC\uC57C \uD569\uB2C8\uB2E4",
              a = e(o.origin),
              l = a?.unit ?? "\uC694\uC18C";
            return a
              ? `${o.origin ?? "\uAC12"}\uC774 \uB108\uBB34 \uC791\uC2B5\uB2C8\uB2E4: ${o.minimum.toString()}${l} ${i}${s}`
              : `${o.origin ?? "\uAC12"}\uC774 \uB108\uBB34 \uC791\uC2B5\uB2C8\uB2E4: ${o.minimum.toString()} ${i}${s}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: "${i.prefix}"(\uC73C)\uB85C \uC2DC\uC791\uD574\uC57C \uD569\uB2C8\uB2E4`
              : i.format === "ends_with"
                ? `\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: "${i.suffix}"(\uC73C)\uB85C \uB05D\uB098\uC57C \uD569\uB2C8\uB2E4`
                : i.format === "includes"
                  ? `\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: "${i.includes}"\uC744(\uB97C) \uD3EC\uD568\uD574\uC57C \uD569\uB2C8\uB2E4`
                  : i.format === "regex"
                    ? `\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: \uC815\uADDC\uC2DD ${i.pattern} \uD328\uD134\uACFC \uC77C\uCE58\uD574\uC57C \uD569\uB2C8\uB2E4`
                    : `\uC798\uBABB\uB41C ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `\uC798\uBABB\uB41C \uC22B\uC790: ${o.divisor}\uC758 \uBC30\uC218\uC5EC\uC57C \uD569\uB2C8\uB2E4`;
          case "unrecognized_keys":
            return `\uC778\uC2DD\uD560 \uC218 \uC5C6\uB294 \uD0A4: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `\uC798\uBABB\uB41C \uD0A4: ${o.origin}`;
          case "invalid_union":
            return "\uC798\uBABB\uB41C \uC785\uB825";
          case "invalid_element":
            return `\uC798\uBABB\uB41C \uAC12: ${o.origin}`;
          default:
            return "\uC798\uBABB\uB41C \uC785\uB825";
        }
      };
    };
  });
function aee(t) {
  let e = Math.abs(t),
    r = e % 10,
    n = e % 100;
  return (n >= 11 && n <= 19) || r === 0 ? "many" : r === 1 ? "one" : "few";
}
function lee() {
  return { localeError: VZe() };
}
var tS,
  VZe,
  cee = g(() => {
    me();
    tS = (t) => t.charAt(0).toUpperCase() + t.slice(1);
    VZe = () => {
      let t = {
        string: {
          unit: { one: "simbolis", few: "simboliai", many: "simboli\u0173" },
          verb: {
            smaller: {
              inclusive: "turi b\u016Bti ne ilgesn\u0117 kaip",
              notInclusive: "turi b\u016Bti trumpesn\u0117 kaip",
            },
            bigger: {
              inclusive: "turi b\u016Bti ne trumpesn\u0117 kaip",
              notInclusive: "turi b\u016Bti ilgesn\u0117 kaip",
            },
          },
        },
        file: {
          unit: { one: "baitas", few: "baitai", many: "bait\u0173" },
          verb: {
            smaller: {
              inclusive: "turi b\u016Bti ne didesnis kaip",
              notInclusive: "turi b\u016Bti ma\u017Eesnis kaip",
            },
            bigger: {
              inclusive: "turi b\u016Bti ne ma\u017Eesnis kaip",
              notInclusive: "turi b\u016Bti didesnis kaip",
            },
          },
        },
        array: {
          unit: { one: "element\u0105", few: "elementus", many: "element\u0173" },
          verb: {
            smaller: {
              inclusive: "turi tur\u0117ti ne daugiau kaip",
              notInclusive: "turi tur\u0117ti ma\u017Eiau kaip",
            },
            bigger: {
              inclusive: "turi tur\u0117ti ne ma\u017Eiau kaip",
              notInclusive: "turi tur\u0117ti daugiau kaip",
            },
          },
        },
        set: {
          unit: { one: "element\u0105", few: "elementus", many: "element\u0173" },
          verb: {
            smaller: {
              inclusive: "turi tur\u0117ti ne daugiau kaip",
              notInclusive: "turi tur\u0117ti ma\u017Eiau kaip",
            },
            bigger: {
              inclusive: "turi tur\u0117ti ne ma\u017Eiau kaip",
              notInclusive: "turi tur\u0117ti daugiau kaip",
            },
          },
        },
      };
      function e(o, i, s, a) {
        let l = t[o] ?? null;
        return l === null
          ? l
          : { unit: l.unit[i], verb: l.verb[a][s ? "inclusive" : "notInclusive"] };
      }
      let r = {
          regex: "\u012Fvestis",
          email: "el. pa\u0161to adresas",
          url: "URL",
          emoji: "jaustukas",
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
          datetime: "ISO data ir laikas",
          date: "ISO data",
          time: "ISO laikas",
          duration: "ISO trukm\u0117",
          ipv4: "IPv4 adresas",
          ipv6: "IPv6 adresas",
          mac: "MAC adresas",
          cidrv4: "IPv4 tinklo prefiksas (CIDR)",
          cidrv6: "IPv6 tinklo prefiksas (CIDR)",
          base64: "base64 u\u017Ekoduota eilut\u0117",
          base64url: "base64url u\u017Ekoduota eilut\u0117",
          json_string: "JSON eilut\u0117",
          e164: "E.164 numeris",
          credit_card: "kredito kortel\u0117s numeris",
          currency_code: "valiutos kodas",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "\u012Fvestis",
        },
        n = {
          nan: "NaN",
          number: "skai\u010Dius",
          bigint: "sveikasis skai\u010Dius",
          string: "eilut\u0117",
          boolean: "login\u0117 reik\u0161m\u0117",
          undefined: "neapibr\u0117\u017Eta reik\u0161m\u0117",
          function: "funkcija",
          symbol: "simbolis",
          array: "masyvas",
          object: "objektas",
          null: "nulin\u0117 reik\u0161m\u0117",
        };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `Gautas tipas ${a}, o tik\u0117tasi - instanceof ${o.expected}`
              : `Gautas tipas ${a}, o tik\u0117tasi - ${i}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `Privalo b\u016Bti ${z(o.values[0])}`
              : `Privalo b\u016Bti vienas i\u0161 ${B(o.values, "|")} pasirinkim\u0173`;
          case "too_big": {
            let i = n[o.origin] ?? o.origin,
              s = e(o.origin, aee(Number(o.maximum)), o.inclusive ?? !1, "smaller");
            if (s?.verb)
              return `${tS(i ?? o.origin ?? "reik\u0161m\u0117")} ${s.verb} ${o.maximum.toString()} ${s.unit ?? "element\u0173"}`;
            let a = o.inclusive ? "ne didesnis kaip" : "ma\u017Eesnis kaip";
            return `${tS(i ?? o.origin ?? "reik\u0161m\u0117")} turi b\u016Bti ${a} ${o.maximum.toString()} ${s?.unit}`;
          }
          case "too_small": {
            let i = n[o.origin] ?? o.origin,
              s = e(o.origin, aee(Number(o.minimum)), o.inclusive ?? !1, "bigger");
            if (s?.verb)
              return `${tS(i ?? o.origin ?? "reik\u0161m\u0117")} ${s.verb} ${o.minimum.toString()} ${s.unit ?? "element\u0173"}`;
            let a = o.inclusive ? "ne ma\u017Eesnis kaip" : "didesnis kaip";
            return `${tS(i ?? o.origin ?? "reik\u0161m\u0117")} turi b\u016Bti ${a} ${o.minimum.toString()} ${s?.unit}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `Eilut\u0117 privalo prasid\u0117ti "${i.prefix}"`
              : i.format === "ends_with"
                ? `Eilut\u0117 privalo pasibaigti "${i.suffix}"`
                : i.format === "includes"
                  ? `Eilut\u0117 privalo \u012Ftraukti "${i.includes}"`
                  : i.format === "regex"
                    ? `Eilut\u0117 privalo atitikti ${i.pattern}`
                    : `Neteisingas ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `Skai\u010Dius privalo b\u016Bti ${o.divisor} kartotinis.`;
          case "unrecognized_keys":
            return `Neatpa\u017Eint${o.keys.length > 1 ? "i" : "as"} rakt${o.keys.length > 1 ? "ai" : "as"}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return "Rastas klaidingas raktas";
          case "invalid_union":
            return "Klaidinga \u012Fvestis";
          case "invalid_element": {
            let i = n[o.origin] ?? o.origin;
            return `${tS(i ?? o.origin ?? "reik\u0161m\u0117")} turi klaiding\u0105 \u012Fvest\u012F`;
          }
          default:
            return "Klaidinga \u012Fvestis";
        }
      };
    };
  });
function uee() {
  return { localeError: KZe() };
}
var KZe,
  dee = g(() => {
    me();
    KZe = () => {
      let t = {
        string: {
          unit: "\u0437\u043D\u0430\u0446\u0438",
          verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442",
        },
        file: {
          unit: "\u0431\u0430\u0458\u0442\u0438",
          verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442",
        },
        array: {
          unit: "\u0441\u0442\u0430\u0432\u043A\u0438",
          verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442",
        },
        set: {
          unit: "\u0441\u0442\u0430\u0432\u043A\u0438",
          verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442",
        },
        map: {
          unit: "\u0441\u0442\u0430\u0432\u043A\u0438",
          verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442",
        },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "\u0432\u043D\u0435\u0441",
          email:
            "\u0430\u0434\u0440\u0435\u0441\u0430 \u043D\u0430 \u0435-\u043F\u043E\u0448\u0442\u0430",
          url: "URL",
          emoji: "\u0435\u043C\u043E\u045F\u0438",
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
          datetime: "ISO \u0434\u0430\u0442\u0443\u043C \u0438 \u0432\u0440\u0435\u043C\u0435",
          date: "ISO \u0434\u0430\u0442\u0443\u043C",
          time: "ISO \u0432\u0440\u0435\u043C\u0435",
          duration: "ISO \u0432\u0440\u0435\u043C\u0435\u0442\u0440\u0430\u0435\u045A\u0435",
          ipv4: "IPv4 \u0430\u0434\u0440\u0435\u0441\u0430",
          ipv6: "IPv6 \u0430\u0434\u0440\u0435\u0441\u0430",
          mac: "MAC \u0430\u0434\u0440\u0435\u0441\u0430",
          cidrv4: "IPv4 \u043E\u043F\u0441\u0435\u0433",
          cidrv6: "IPv6 \u043E\u043F\u0441\u0435\u0433",
          base64:
            "base64-\u0435\u043D\u043A\u043E\u0434\u0438\u0440\u0430\u043D\u0430 \u043D\u0438\u0437\u0430",
          base64url:
            "base64url-\u0435\u043D\u043A\u043E\u0434\u0438\u0440\u0430\u043D\u0430 \u043D\u0438\u0437\u0430",
          json_string: "JSON \u043D\u0438\u0437\u0430",
          e164: "E.164 \u0431\u0440\u043E\u0458",
          credit_card:
            "\u0431\u0440\u043E\u0458 \u043D\u0430 \u043A\u0440\u0435\u0434\u0438\u0442\u043D\u0430 \u043A\u0430\u0440\u0442\u0438\u0447\u043A\u0430",
          currency_code: "\u043A\u043E\u0434 \u043D\u0430 \u0432\u0430\u043B\u0443\u0442\u0430",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "\u0432\u043D\u0435\u0441",
        },
        n = { nan: "NaN", number: "\u0431\u0440\u043E\u0458", array: "\u043D\u0438\u0437\u0430" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `\u0413\u0440\u0435\u0448\u0435\u043D \u0432\u043D\u0435\u0441: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 instanceof ${o.expected}, \u043F\u0440\u0438\u043C\u0435\u043D\u043E ${a}`
              : `\u0413\u0440\u0435\u0448\u0435\u043D \u0432\u043D\u0435\u0441: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 ${i}, \u043F\u0440\u0438\u043C\u0435\u043D\u043E ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `Invalid input: expected ${z(o.values[0])}`
              : `\u0413\u0440\u0435\u0448\u0430\u043D\u0430 \u043E\u043F\u0446\u0438\u0458\u0430: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 \u0435\u0434\u043D\u0430 ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `\u041F\u0440\u0435\u043C\u043D\u043E\u0433\u0443 \u0433\u043E\u043B\u0435\u043C: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 ${o.origin ?? "\u0432\u0440\u0435\u0434\u043D\u043E\u0441\u0442\u0430"} \u0434\u0430 \u0438\u043C\u0430 ${i}${o.maximum.toString()} ${s.unit ?? "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0438"}`
              : `\u041F\u0440\u0435\u043C\u043D\u043E\u0433\u0443 \u0433\u043E\u043B\u0435\u043C: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 ${o.origin ?? "\u0432\u0440\u0435\u0434\u043D\u043E\u0441\u0442\u0430"} \u0434\u0430 \u0431\u0438\u0434\u0435 ${i}${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `\u041F\u0440\u0435\u043C\u043D\u043E\u0433\u0443 \u043C\u0430\u043B: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 ${o.origin} \u0434\u0430 \u0438\u043C\u0430 ${i}${o.minimum.toString()} ${s.unit}`
              : `\u041F\u0440\u0435\u043C\u043D\u043E\u0433\u0443 \u043C\u0430\u043B: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 ${o.origin} \u0434\u0430 \u0431\u0438\u0434\u0435 ${i}${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `\u041D\u0435\u0432\u0430\u0436\u0435\u0447\u043A\u0430 \u043D\u0438\u0437\u0430: \u043C\u043E\u0440\u0430 \u0434\u0430 \u0437\u0430\u043F\u043E\u0447\u043D\u0443\u0432\u0430 \u0441\u043E "${i.prefix}"`
              : i.format === "ends_with"
                ? `\u041D\u0435\u0432\u0430\u0436\u0435\u0447\u043A\u0430 \u043D\u0438\u0437\u0430: \u043C\u043E\u0440\u0430 \u0434\u0430 \u0437\u0430\u0432\u0440\u0448\u0443\u0432\u0430 \u0441\u043E "${i.suffix}"`
                : i.format === "includes"
                  ? `\u041D\u0435\u0432\u0430\u0436\u0435\u0447\u043A\u0430 \u043D\u0438\u0437\u0430: \u043C\u043E\u0440\u0430 \u0434\u0430 \u0432\u043A\u043B\u0443\u0447\u0443\u0432\u0430 "${i.includes}"`
                  : i.format === "regex"
                    ? `\u041D\u0435\u0432\u0430\u0436\u0435\u0447\u043A\u0430 \u043D\u0438\u0437\u0430: \u043C\u043E\u0440\u0430 \u0434\u0430 \u043E\u0434\u0433\u043E\u0430\u0440\u0430 \u043D\u0430 \u043F\u0430\u0442\u0435\u0440\u043D\u043E\u0442 ${i.pattern}`
                    : `Invalid ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `\u0413\u0440\u0435\u0448\u0435\u043D \u0431\u0440\u043E\u0458: \u043C\u043E\u0440\u0430 \u0434\u0430 \u0431\u0438\u0434\u0435 \u0434\u0435\u043B\u0438\u0432 \u0441\u043E ${o.divisor}`;
          case "unrecognized_keys":
            return `${o.keys.length > 1 ? "\u041D\u0435\u043F\u0440\u0435\u043F\u043E\u0437\u043D\u0430\u0435\u043D\u0438 \u043A\u043B\u0443\u0447\u0435\u0432\u0438" : "\u041D\u0435\u043F\u0440\u0435\u043F\u043E\u0437\u043D\u0430\u0435\u043D \u043A\u043B\u0443\u0447"}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `\u0413\u0440\u0435\u0448\u0435\u043D \u043A\u043B\u0443\u0447 \u0432\u043E ${o.origin}`;
          case "invalid_union":
            return "\u0413\u0440\u0435\u0448\u0435\u043D \u0432\u043D\u0435\u0441";
          case "invalid_element":
            return `\u0413\u0440\u0435\u0448\u043D\u0430 \u0432\u0440\u0435\u0434\u043D\u043E\u0441\u0442 \u0432\u043E ${o.origin}`;
          default:
            return "\u0413\u0440\u0435\u0448\u0435\u043D \u0432\u043D\u0435\u0441";
        }
      };
    };
  });
function pee() {
  return { localeError: ZZe() };
}
var ZZe,
  mee = g(() => {
    me();
    ZZe = () => {
      let t = {
        string: { unit: "aksara", verb: "mempunyai" },
        file: { unit: "bait", verb: "mempunyai" },
        array: { unit: "elemen", verb: "mempunyai" },
        set: { unit: "elemen", verb: "mempunyai" },
        map: { unit: "elemen", verb: "mempunyai" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "input",
          email: "alamat e-mel",
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
          datetime: "tarikh masa ISO",
          date: "tarikh ISO",
          time: "masa ISO",
          duration: "tempoh ISO",
          ipv4: "alamat IPv4",
          ipv6: "alamat IPv6",
          mac: "alamat MAC",
          cidrv4: "julat IPv4",
          cidrv6: "julat IPv6",
          base64: "string dikodkan base64",
          base64url: "string dikodkan base64url",
          json_string: "string JSON",
          e164: "nombor E.164",
          credit_card: "nombor kad kredit",
          currency_code: "kod mata wang",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "input",
        },
        n = { nan: "NaN", number: "nombor" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `Input tidak sah: dijangka instanceof ${o.expected}, diterima ${a}`
              : `Input tidak sah: dijangka ${i}, diterima ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `Input tidak sah: dijangka ${z(o.values[0])}`
              : `Pilihan tidak sah: dijangka salah satu daripada ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `Terlalu besar: dijangka ${o.origin ?? "nilai"} ${s.verb} ${i}${o.maximum.toString()} ${s.unit ?? "elemen"}`
              : `Terlalu besar: dijangka ${o.origin ?? "nilai"} adalah ${i}${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `Terlalu kecil: dijangka ${o.origin} ${s.verb} ${i}${o.minimum.toString()} ${s.unit}`
              : `Terlalu kecil: dijangka ${o.origin} adalah ${i}${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `String tidak sah: mesti bermula dengan "${i.prefix}"`
              : i.format === "ends_with"
                ? `String tidak sah: mesti berakhir dengan "${i.suffix}"`
                : i.format === "includes"
                  ? `String tidak sah: mesti mengandungi "${i.includes}"`
                  : i.format === "regex"
                    ? `String tidak sah: mesti sepadan dengan corak ${i.pattern}`
                    : `${r[i.format] ?? o.format} tidak sah`;
          }
          case "not_multiple_of":
            return `Nombor tidak sah: perlu gandaan ${o.divisor}`;
          case "unrecognized_keys":
            return `Kunci tidak dikenali: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `Kunci tidak sah dalam ${o.origin}`;
          case "invalid_union":
            return "Input tidak sah";
          case "invalid_element":
            return `Nilai tidak sah dalam ${o.origin}`;
          default:
            return "Input tidak sah";
        }
      };
    };
  });
function fee() {
  return { localeError: XZe() };
}
var XZe,
  hee = g(() => {
    me();
    XZe = () => {
      let t = {
        string: {
          unit: "\u0905\u0915\u094D\u0937\u0930",
          verb: "\u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B",
        },
        file: {
          unit: "\u092C\u093E\u0907\u091F",
          verb: "\u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B",
        },
        array: {
          unit: "\u0924\u0924\u094D\u0935",
          verb: "\u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B",
        },
        set: {
          unit: "\u0924\u0924\u094D\u0935",
          verb: "\u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B",
        },
        map: {
          unit: "\u092A\u094D\u0930\u0935\u093F\u0937\u094D\u091F\u093F",
          verb: "\u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B",
        },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "\u0907\u0928\u092A\u0941\u091F",
          email: "\u0907\u092E\u0947\u0932 \u0920\u0947\u0917\u093E\u0928\u093E",
          url: "URL",
          emoji: "\u0907\u092E\u094B\u091C\u0940",
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
          datetime: "ISO \u092E\u093F\u0924\u093F \u0930 \u0938\u092E\u092F",
          date: "ISO \u092E\u093F\u0924\u093F",
          time: "ISO \u0938\u092E\u092F",
          duration: "ISO \u0905\u0935\u0927\u093F",
          ipv4: "IPv4 \u0920\u0947\u0917\u093E\u0928\u093E",
          ipv6: "IPv6 \u0920\u0947\u0917\u093E\u0928\u093E",
          mac: "MAC \u0920\u0947\u0917\u093E\u0928\u093E",
          cidrv4: "IPv4 \u0926\u093E\u092F\u0930\u093E",
          cidrv6: "IPv6 \u0926\u093E\u092F\u0930\u093E",
          base64:
            "base64-\u0907\u0928\u094D\u0915\u094B\u0921 \u0917\u0930\u093F\u090F\u0915\u094B \u0938\u094D\u091F\u094D\u0930\u093F\u0919",
          base64url:
            "base64url-\u0907\u0928\u094D\u0915\u094B\u0921 \u0917\u0930\u093F\u090F\u0915\u094B \u0938\u094D\u091F\u094D\u0930\u093F\u0919",
          json_string: "JSON \u0938\u094D\u091F\u094D\u0930\u093F\u0919",
          e164: "E.164 \u0928\u092E\u094D\u092C\u0930",
          credit_card:
            "\u0915\u094D\u0930\u0947\u0921\u093F\u091F \u0915\u093E\u0930\u094D\u0921 \u0928\u092E\u094D\u092C\u0930",
          currency_code: "\u092E\u0941\u0926\u094D\u0930\u093E \u0915\u094B\u0921",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "\u0907\u0928\u092A\u0941\u091F",
        },
        n = { nan: "NaN" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return `\u0905\u092E\u093E\u0928\u094D\u092F \u0907\u0928\u092A\u0941\u091F: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 ${i}, \u092A\u094D\u0930\u093E\u092A\u094D\u0924 ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `\u0905\u092E\u093E\u0928\u094D\u092F \u0907\u0928\u092A\u0941\u091F: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 ${z(o.values[0])}`
              : `\u0905\u092E\u093E\u0928\u094D\u092F \u0935\u093F\u0915\u0932\u094D\u092A: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 \u092E\u093E\u0928\u0939\u0930\u0942 \u092E\u0927\u094D\u092F\u0947 \u090F\u0915 ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `\u0927\u0947\u0930\u0948 \u0920\u0942\u0932\u094B: ${o.origin ?? "\u092E\u093E\u0928"} \u092E\u093E ${i}${o.maximum.toString()} ${s.unit} ${s.verb}`
              : `\u0927\u0947\u0930\u0948 \u0920\u0942\u0932\u094B: ${o.origin ?? "\u092E\u093E\u0928"} ${i}${o.maximum.toString()} \u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `\u0927\u0947\u0930\u0948 \u0938\u093E\u0928\u094B: ${o.origin} \u092E\u093E ${i}${o.minimum.toString()} ${s.unit} ${s.verb}`
              : `\u0927\u0947\u0930\u0948 \u0938\u093E\u0928\u094B: ${o.origin} ${i}${o.minimum.toString()} \u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u094D\u091F\u094D\u0930\u093F\u0919: "${i.prefix}" \u092C\u093E\u091F \u0938\u0941\u0930\u0941 \u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B`
              : i.format === "ends_with"
                ? `\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u094D\u091F\u094D\u0930\u093F\u0919: "${i.suffix}" \u092E\u093E \u0938\u092E\u093E\u092A\u094D\u0924 \u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B`
                : i.format === "includes"
                  ? `\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u094D\u091F\u094D\u0930\u093F\u0919: "${i.includes}" \u0938\u092E\u093E\u0935\u0947\u0936 \u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B`
                  : i.format === "regex"
                    ? `\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u094D\u091F\u094D\u0930\u093F\u0919: \u0922\u093E\u0901\u091A\u093E ${i.pattern} \u0938\u0901\u0917 \u092E\u0947\u0932 \u0916\u093E\u0928\u0941\u092A\u0930\u094D\u091B`
                    : `\u0905\u092E\u093E\u0928\u094D\u092F ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u0902\u0916\u094D\u092F\u093E: ${o.divisor} \u0915\u094B \u0917\u0941\u0923\u091C \u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B`;
          case "unrecognized_keys":
            return `\u0905\u092A\u0930\u093F\u091A\u093F\u0924 \u0915\u0941\u091E\u094D\u091C\u0940${o.keys.length > 1 ? "\u0939\u0930\u0942" : ""}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `\u0905\u092E\u093E\u0928\u094D\u092F \u0915\u0941\u091E\u094D\u091C\u0940: ${o.origin} \u092E\u093E`;
          case "invalid_union":
            return o.options && Array.isArray(o.options) && o.options.length > 0
              ? `\u0905\u092E\u093E\u0928\u094D\u092F \u0921\u093F\u0938\u094D\u0915\u094D\u0930\u093F\u092E\u093F\u0928\u0947\u091F\u0930 \u092E\u093E\u0928: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 ${o.options.map((s) => `'${s}'`).join(" | ")}`
              : "\u0905\u092E\u093E\u0928\u094D\u092F \u0907\u0928\u092A\u0941\u091F";
          case "invalid_element":
            return `\u0905\u092E\u093E\u0928\u094D\u092F \u092E\u093E\u0928: ${o.origin} \u092E\u093E`;
          default:
            return "\u0905\u092E\u093E\u0928\u094D\u092F \u0907\u0928\u092A\u0941\u091F";
        }
      };
    };
  });
function gee() {
  return { localeError: YZe() };
}
var YZe,
  yee = g(() => {
    me();
    YZe = () => {
      let t = {
        string: { unit: "tekens", verb: "heeft" },
        file: { unit: "bytes", verb: "heeft" },
        array: { unit: "elementen", verb: "heeft" },
        set: { unit: "elementen", verb: "heeft" },
        map: { unit: "elementen", verb: "heeft" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "invoer",
          email: "emailadres",
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
          datetime: "ISO datum en tijd",
          date: "ISO datum",
          time: "ISO tijd",
          duration: "ISO duur",
          ipv4: "IPv4-adres",
          ipv6: "IPv6-adres",
          mac: "MAC-adres",
          cidrv4: "IPv4-bereik",
          cidrv6: "IPv6-bereik",
          base64: "base64-gecodeerde tekst",
          base64url: "base64 URL-gecodeerde tekst",
          json_string: "JSON string",
          e164: "E.164-nummer",
          credit_card: "creditcardnummer",
          currency_code: "valutacode",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "invoer",
        },
        n = { nan: "NaN", number: "getal" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `Ongeldige invoer: verwacht instanceof ${o.expected}, ontving ${a}`
              : `Ongeldige invoer: verwacht ${i}, ontving ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `Ongeldige invoer: verwacht ${z(o.values[0])}`
              : `Ongeldige optie: verwacht \xE9\xE9n van ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin),
              a = o.origin === "date" ? "laat" : o.origin === "string" ? "lang" : "groot";
            return s
              ? `Te ${a}: verwacht dat ${o.origin ?? "waarde"} ${i}${o.maximum.toString()} ${s.unit ?? "elementen"} ${s.verb}`
              : `Te ${a}: verwacht dat ${o.origin ?? "waarde"} ${i}${o.maximum.toString()} is`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin),
              a = o.origin === "date" ? "vroeg" : o.origin === "string" ? "kort" : "klein";
            return s
              ? `Te ${a}: verwacht dat ${o.origin} ${i}${o.minimum.toString()} ${s.unit} ${s.verb}`
              : `Te ${a}: verwacht dat ${o.origin} ${i}${o.minimum.toString()} is`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `Ongeldige tekst: moet met "${i.prefix}" beginnen`
              : i.format === "ends_with"
                ? `Ongeldige tekst: moet op "${i.suffix}" eindigen`
                : i.format === "includes"
                  ? `Ongeldige tekst: moet "${i.includes}" bevatten`
                  : i.format === "regex"
                    ? `Ongeldige tekst: moet overeenkomen met patroon ${i.pattern}`
                    : `Ongeldig: ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `Ongeldig getal: moet een veelvoud van ${o.divisor} zijn`;
          case "unrecognized_keys":
            return `Onbekende key${o.keys.length > 1 ? "s" : ""}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `Ongeldige key in ${o.origin}`;
          case "invalid_union":
            return "Ongeldige invoer";
          case "invalid_element":
            return `Ongeldige waarde in ${o.origin}`;
          default:
            return "Ongeldige invoer";
        }
      };
    };
  });
function vee() {
  return { localeError: JZe() };
}
var JZe,
  bee = g(() => {
    me();
    JZe = () => {
      let t = {
        string: { unit: "teikn", verb: "\xE5 ha" },
        file: { unit: "bytes", verb: "\xE5 ha" },
        array: { unit: "element", verb: "\xE5 innehalde" },
        set: { unit: "element", verb: "\xE5 innehalde" },
        map: { unit: "element", verb: "\xE5 innehalde" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "input",
          email: "e-postadresse",
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
          datetime: "ISO dato- og klokkeslett",
          date: "ISO-dato",
          time: "ISO-klokkeslett",
          duration: "ISO-varigheit",
          ipv4: "IPv4-adresse",
          ipv6: "IPv6-adresse",
          mac: "MAC-adresse",
          cidrv4: "IPv4-spekter",
          cidrv6: "IPv6-spekter",
          base64: "base64-enkoda streng",
          base64url: "base64url-enkoda streng",
          json_string: "JSON-streng",
          e164: "E.164-nummer",
          credit_card: "kredittkortnummer",
          currency_code: "valutakode",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "input",
        },
        n = { nan: "NaN", number: "tal", array: "liste" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `Ugyldig input: forventa instanceof ${o.expected}, fekk ${a}`
              : `Ugyldig input: forventa ${i}, fekk ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `Ugyldig verdi: forventa ${z(o.values[0])}`
              : `Ugyldig val: forventa eitt av ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `For stor(t): forventa ${o.origin ?? "value"} til \xE5 ha ${i}${o.maximum.toString()} ${s.unit ?? "element"}`
              : `For stor(t): forventa ${o.origin ?? "value"} til \xE5 ha ${i}${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `For lite(n): forventa ${o.origin} til \xE5 ha ${i}${o.minimum.toString()} ${s.unit}`
              : `For lite(n): forventa ${o.origin} til \xE5 ha ${i}${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `Ugyldig streng: m\xE5 starte med "${i.prefix}"`
              : i.format === "ends_with"
                ? `Ugyldig streng: m\xE5 slutte med "${i.suffix}"`
                : i.format === "includes"
                  ? `Ugyldig streng: m\xE5 innehalde "${i.includes}"`
                  : i.format === "regex"
                    ? `Ugyldig streng: m\xE5 matche m\xF8nsteret ${i.pattern}`
                    : `Ugyldig ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `Ugyldig tal: m\xE5 vere eit multiplum av ${o.divisor}`;
          case "unrecognized_keys":
            return `${o.keys.length > 1 ? "Ukjende n\xF8klar" : "Ukjend n\xF8kkel"}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `Ugyldig n\xF8kkel i ${o.origin}`;
          case "invalid_union":
            return "Ugyldig input";
          case "invalid_element":
            return `Ugyldig verdi i ${o.origin}`;
          default:
            return "Ugyldig input";
        }
      };
    };
  });
function See() {
  return { localeError: QZe() };
}
var QZe,
  wee = g(() => {
    me();
    QZe = () => {
      let t = {
        string: { unit: "tegn", verb: "\xE5 ha" },
        file: { unit: "bytes", verb: "\xE5 ha" },
        array: { unit: "elementer", verb: "\xE5 inneholde" },
        set: { unit: "elementer", verb: "\xE5 inneholde" },
        map: { unit: "elementer", verb: "\xE5 inneholde" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "input",
          email: "e-postadresse",
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
          datetime: "ISO dato- og klokkeslett",
          date: "ISO-dato",
          time: "ISO-klokkeslett",
          duration: "ISO-varighet",
          ipv4: "IPv4-adresse",
          ipv6: "IPv6-adresse",
          mac: "MAC-adresse",
          cidrv4: "IPv4-spekter",
          cidrv6: "IPv6-spekter",
          base64: "base64-enkodet streng",
          base64url: "base64url-enkodet streng",
          json_string: "JSON-streng",
          e164: "E.164-nummer",
          credit_card: "kredittkortnummer",
          currency_code: "valutakode",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "input",
        },
        n = { nan: "NaN", number: "tall", array: "liste" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `Ugyldig input: forventet instanceof ${o.expected}, fikk ${a}`
              : `Ugyldig input: forventet ${i}, fikk ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `Ugyldig verdi: forventet ${z(o.values[0])}`
              : `Ugyldig valg: forventet en av ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `For stor(t): forventet ${o.origin ?? "value"} til \xE5 ha ${i}${o.maximum.toString()} ${s.unit ?? "elementer"}`
              : `For stor(t): forventet ${o.origin ?? "value"} til \xE5 ha ${i}${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `For lite(n): forventet ${o.origin} til \xE5 ha ${i}${o.minimum.toString()} ${s.unit}`
              : `For lite(n): forventet ${o.origin} til \xE5 ha ${i}${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `Ugyldig streng: m\xE5 starte med "${i.prefix}"`
              : i.format === "ends_with"
                ? `Ugyldig streng: m\xE5 ende med "${i.suffix}"`
                : i.format === "includes"
                  ? `Ugyldig streng: m\xE5 inneholde "${i.includes}"`
                  : i.format === "regex"
                    ? `Ugyldig streng: m\xE5 matche m\xF8nsteret ${i.pattern}`
                    : `Ugyldig ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `Ugyldig tall: m\xE5 v\xE6re et multiplum av ${o.divisor}`;
          case "unrecognized_keys":
            return `${o.keys.length > 1 ? "Ukjente n\xF8kler" : "Ukjent n\xF8kkel"}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `Ugyldig n\xF8kkel i ${o.origin}`;
          case "invalid_union":
            return "Ugyldig input";
          case "invalid_element":
            return `Ugyldig verdi i ${o.origin}`;
          default:
            return "Ugyldig input";
        }
      };
    };
  });
function _ee() {
  return { localeError: eXe() };
}
var eXe,
  xee = g(() => {
    me();
    eXe = () => {
      let t = {
        string: { unit: "harf", verb: "olmal\u0131d\u0131r" },
        file: { unit: "bayt", verb: "olmal\u0131d\u0131r" },
        array: { unit: "unsur", verb: "olmal\u0131d\u0131r" },
        set: { unit: "unsur", verb: "olmal\u0131d\u0131r" },
        map: { unit: "unsur", verb: "olmal\u0131d\u0131r" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "giren",
          email: "epostag\xE2h",
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
          datetime: "ISO heng\xE2m\u0131",
          date: "ISO tarihi",
          time: "ISO zaman\u0131",
          duration: "ISO m\xFCddeti",
          ipv4: "IPv4 ni\u015F\xE2n\u0131",
          ipv6: "IPv6 ni\u015F\xE2n\u0131",
          mac: "MAC ni\u015F\xE2n\u0131",
          cidrv4: "IPv4 menzili",
          cidrv6: "IPv6 menzili",
          base64: "base64-\u015Fifreli metin",
          base64url: "base64url-\u015Fifreli metin",
          json_string: "JSON metin",
          e164: "E.164 say\u0131s\u0131",
          credit_card: "i'tib\xE2r kart\u0131 numaras\u0131",
          currency_code: "para birimi kodu",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "giren",
        },
        n = { nan: "NaN", number: "numara", array: "saf", null: "gayb" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `F\xE2sit giren: umulan instanceof ${o.expected}, al\u0131nan ${a}`
              : `F\xE2sit giren: umulan ${i}, al\u0131nan ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `F\xE2sit giren: umulan ${z(o.values[0])}`
              : `F\xE2sit tercih: m\xFBteberler ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `Fazla b\xFCy\xFCk: ${o.origin ?? "value"}, ${i}${o.maximum.toString()} ${s.unit ?? "elements"} sahip olmal\u0131yd\u0131.`
              : `Fazla b\xFCy\xFCk: ${o.origin ?? "value"}, ${i}${o.maximum.toString()} olmal\u0131yd\u0131.`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `Fazla k\xFC\xE7\xFCk: ${o.origin}, ${i}${o.minimum.toString()} ${s.unit} sahip olmal\u0131yd\u0131.`
              : `Fazla k\xFC\xE7\xFCk: ${o.origin}, ${i}${o.minimum.toString()} olmal\u0131yd\u0131.`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `F\xE2sit metin: "${i.prefix}" ile ba\u015Flamal\u0131.`
              : i.format === "ends_with"
                ? `F\xE2sit metin: "${i.suffix}" ile bitmeli.`
                : i.format === "includes"
                  ? `F\xE2sit metin: "${i.includes}" ihtiv\xE2 etmeli.`
                  : i.format === "regex"
                    ? `F\xE2sit metin: ${i.pattern} nak\u015F\u0131na uymal\u0131.`
                    : `F\xE2sit ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `F\xE2sit say\u0131: ${o.divisor} kat\u0131 olmal\u0131yd\u0131.`;
          case "unrecognized_keys":
            return `Tan\u0131nmayan anahtar ${o.keys.length > 1 ? "s" : ""}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `${o.origin} i\xE7in tan\u0131nmayan anahtar var.`;
          case "invalid_union":
            return "Giren tan\u0131namad\u0131.";
          case "invalid_element":
            return `${o.origin} i\xE7in tan\u0131nmayan k\u0131ymet var.`;
          default:
            return "K\u0131ymet tan\u0131namad\u0131.";
        }
      };
    };
  });
function Aee() {
  return { localeError: tXe() };
}
var tXe,
  Ree = g(() => {
    me();
    tXe = () => {
      let t = {
        string: { unit: "\u062A\u0648\u06A9\u064A", verb: "\u0648\u0644\u0631\u064A" },
        file: { unit: "\u0628\u0627\u06CC\u067C\u0633", verb: "\u0648\u0644\u0631\u064A" },
        array: { unit: "\u062A\u0648\u06A9\u064A", verb: "\u0648\u0644\u0631\u064A" },
        set: { unit: "\u062A\u0648\u06A9\u064A", verb: "\u0648\u0644\u0631\u064A" },
        map: { unit: "\u062A\u0648\u06A9\u064A", verb: "\u0648\u0644\u0631\u064A" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "\u0648\u0631\u0648\u062F\u064A",
          email: "\u0628\u0631\u06CC\u069A\u0646\u0627\u0644\u06CC\u06A9",
          url: "\u06CC\u0648 \u0622\u0631 \u0627\u0644",
          emoji: "\u0627\u06CC\u0645\u0648\u062C\u064A",
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
          datetime: "\u0646\u06CC\u067C\u0647 \u0627\u0648 \u0648\u062E\u062A",
          date: "\u0646\u06D0\u067C\u0647",
          time: "\u0648\u062E\u062A",
          duration: "\u0645\u0648\u062F\u0647",
          ipv4: "\u062F IPv4 \u067E\u062A\u0647",
          ipv6: "\u062F IPv6 \u067E\u062A\u0647",
          mac: "\u062F MAC \u067E\u062A\u0647",
          cidrv4: "\u062F IPv4 \u0633\u0627\u062D\u0647",
          cidrv6: "\u062F IPv6 \u0633\u0627\u062D\u0647",
          base64: "base64-encoded \u0645\u062A\u0646",
          base64url: "base64url-encoded \u0645\u062A\u0646",
          json_string: "JSON \u0645\u062A\u0646",
          e164: "\u062F E.164 \u0634\u0645\u06D0\u0631\u0647",
          credit_card:
            "\u062F \u06A9\u0631\u06CC\u0689\u06CC\u067C \u06A9\u0627\u0631\u062A \u0634\u0645\u06CC\u0631\u0647",
          currency_code: "\u062F \u0627\u0633\u0639\u0627\u0631\u0648 \u06A9\u0648\u0689",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "\u0648\u0631\u0648\u062F\u064A",
        },
        n = { nan: "NaN", number: "\u0639\u062F\u062F", array: "\u0627\u0631\u06D0" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `\u0646\u0627\u0633\u0645 \u0648\u0631\u0648\u062F\u064A: \u0628\u0627\u06CC\u062F instanceof ${o.expected} \u0648\u0627\u06CC, \u0645\u06AB\u0631 ${a} \u062A\u0631\u0644\u0627\u0633\u0647 \u0634\u0648`
              : `\u0646\u0627\u0633\u0645 \u0648\u0631\u0648\u062F\u064A: \u0628\u0627\u06CC\u062F ${i} \u0648\u0627\u06CC, \u0645\u06AB\u0631 ${a} \u062A\u0631\u0644\u0627\u0633\u0647 \u0634\u0648`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `\u0646\u0627\u0633\u0645 \u0648\u0631\u0648\u062F\u064A: \u0628\u0627\u06CC\u062F ${z(o.values[0])} \u0648\u0627\u06CC`
              : `\u0646\u0627\u0633\u0645 \u0627\u0646\u062A\u062E\u0627\u0628: \u0628\u0627\u06CC\u062F \u06CC\u0648 \u0644\u0647 ${B(o.values, "|")} \u0685\u062E\u0647 \u0648\u0627\u06CC`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `\u0689\u06CC\u0631 \u0644\u0648\u06CC: ${o.origin ?? "\u0627\u0631\u0632\u069A\u062A"} \u0628\u0627\u06CC\u062F ${i}${o.maximum.toString()} ${s.unit ?? "\u0639\u0646\u0635\u0631\u0648\u0646\u0647"} \u0648\u0644\u0631\u064A`
              : `\u0689\u06CC\u0631 \u0644\u0648\u06CC: ${o.origin ?? "\u0627\u0631\u0632\u069A\u062A"} \u0628\u0627\u06CC\u062F ${i}${o.maximum.toString()} \u0648\u064A`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `\u0689\u06CC\u0631 \u06A9\u0648\u0686\u0646\u06CC: ${o.origin} \u0628\u0627\u06CC\u062F ${i}${o.minimum.toString()} ${s.unit} \u0648\u0644\u0631\u064A`
              : `\u0689\u06CC\u0631 \u06A9\u0648\u0686\u0646\u06CC: ${o.origin} \u0628\u0627\u06CC\u062F ${i}${o.minimum.toString()} \u0648\u064A`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `\u0646\u0627\u0633\u0645 \u0645\u062A\u0646: \u0628\u0627\u06CC\u062F \u062F "${i.prefix}" \u0633\u0631\u0647 \u067E\u06CC\u0644 \u0634\u064A`
              : i.format === "ends_with"
                ? `\u0646\u0627\u0633\u0645 \u0645\u062A\u0646: \u0628\u0627\u06CC\u062F \u062F "${i.suffix}" \u0633\u0631\u0647 \u067E\u0627\u06CC \u062A\u0647 \u0648\u0631\u0633\u064A\u0696\u064A`
                : i.format === "includes"
                  ? `\u0646\u0627\u0633\u0645 \u0645\u062A\u0646: \u0628\u0627\u06CC\u062F "${i.includes}" \u0648\u0644\u0631\u064A`
                  : i.format === "regex"
                    ? `\u0646\u0627\u0633\u0645 \u0645\u062A\u0646: \u0628\u0627\u06CC\u062F \u062F ${i.pattern} \u0633\u0631\u0647 \u0645\u0637\u0627\u0628\u0642\u062A \u0648\u0644\u0631\u064A`
                    : `${r[i.format] ?? o.format} \u0646\u0627\u0633\u0645 \u062F\u06CC`;
          }
          case "not_multiple_of":
            return `\u0646\u0627\u0633\u0645 \u0639\u062F\u062F: \u0628\u0627\u06CC\u062F \u062F ${o.divisor} \u0645\u0636\u0631\u0628 \u0648\u064A`;
          case "unrecognized_keys":
            return `\u0646\u0627\u0633\u0645 ${o.keys.length > 1 ? "\u06A9\u0644\u06CC\u0689\u0648\u0646\u0647" : "\u06A9\u0644\u06CC\u0689"}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `\u0646\u0627\u0633\u0645 \u06A9\u0644\u06CC\u0689 \u067E\u0647 ${o.origin} \u06A9\u06D0`;
          case "invalid_union":
            return "\u0646\u0627\u0633\u0645\u0647 \u0648\u0631\u0648\u062F\u064A";
          case "invalid_element":
            return `\u0646\u0627\u0633\u0645 \u0639\u0646\u0635\u0631 \u067E\u0647 ${o.origin} \u06A9\u06D0`;
          default:
            return "\u0646\u0627\u0633\u0645\u0647 \u0648\u0631\u0648\u062F\u064A";
        }
      };
    };
  });
function Eee() {
  return { localeError: rXe() };
}
var rXe,
  Cee = g(() => {
    me();
    rXe = () => {
      let t = {
        string: { unit: "znak\xF3w", verb: "mie\u0107" },
        file: { unit: "bajt\xF3w", verb: "mie\u0107" },
        array: { unit: "element\xF3w", verb: "mie\u0107" },
        set: { unit: "element\xF3w", verb: "mie\u0107" },
        map: { unit: "element\xF3w", verb: "mie\u0107" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "wyra\u017Cenie",
          email: "adres email",
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
          datetime: "data i godzina w formacie ISO",
          date: "data w formacie ISO",
          time: "godzina w formacie ISO",
          duration: "czas trwania ISO",
          ipv4: "adres IPv4",
          ipv6: "adres IPv6",
          mac: "adres MAC",
          cidrv4: "zakres IPv4",
          cidrv6: "zakres IPv6",
          base64: "ci\u0105g znak\xF3w zakodowany w formacie base64",
          base64url: "ci\u0105g znak\xF3w zakodowany w formacie base64url",
          json_string: "ci\u0105g znak\xF3w w formacie JSON",
          e164: "liczba E.164",
          credit_card: "numer karty kredytowej",
          currency_code: "kod waluty",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "wej\u015Bcie",
        },
        n = { nan: "NaN", number: "liczba", array: "tablica" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `Nieprawid\u0142owe dane wej\u015Bciowe: oczekiwano instanceof ${o.expected}, otrzymano ${a}`
              : `Nieprawid\u0142owe dane wej\u015Bciowe: oczekiwano ${i}, otrzymano ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `Nieprawid\u0142owe dane wej\u015Bciowe: oczekiwano ${z(o.values[0])}`
              : `Nieprawid\u0142owa opcja: oczekiwano jednej z warto\u015Bci ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `Za du\u017Ca warto\u015B\u0107: oczekiwano, \u017Ce ${o.origin ?? "warto\u015B\u0107"} b\u0119dzie mie\u0107 ${i}${o.maximum.toString()} ${s.unit ?? "element\xF3w"}`
              : `Zbyt du\u017C(y/a/e): oczekiwano, \u017Ce ${o.origin ?? "warto\u015B\u0107"} b\u0119dzie wynosi\u0107 ${i}${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `Za ma\u0142a warto\u015B\u0107: oczekiwano, \u017Ce ${o.origin ?? "warto\u015B\u0107"} b\u0119dzie mie\u0107 ${i}${o.minimum.toString()} ${s.unit ?? "element\xF3w"}`
              : `Zbyt ma\u0142(y/a/e): oczekiwano, \u017Ce ${o.origin ?? "warto\u015B\u0107"} b\u0119dzie wynosi\u0107 ${i}${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `Nieprawid\u0142owy ci\u0105g znak\xF3w: musi zaczyna\u0107 si\u0119 od "${i.prefix}"`
              : i.format === "ends_with"
                ? `Nieprawid\u0142owy ci\u0105g znak\xF3w: musi ko\u0144czy\u0107 si\u0119 na "${i.suffix}"`
                : i.format === "includes"
                  ? `Nieprawid\u0142owy ci\u0105g znak\xF3w: musi zawiera\u0107 "${i.includes}"`
                  : i.format === "regex"
                    ? `Nieprawid\u0142owy ci\u0105g znak\xF3w: musi odpowiada\u0107 wzorcowi ${i.pattern}`
                    : `Nieprawid\u0142ow(y/a/e) ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `Nieprawid\u0142owa liczba: musi by\u0107 wielokrotno\u015Bci\u0105 ${o.divisor}`;
          case "unrecognized_keys":
            return `Nierozpoznane klucze${o.keys.length > 1 ? "s" : ""}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `Nieprawid\u0142owy klucz w ${o.origin}`;
          case "invalid_union":
            return "Nieprawid\u0142owe dane wej\u015Bciowe";
          case "invalid_element":
            return `Nieprawid\u0142owa warto\u015B\u0107 w ${o.origin}`;
          default:
            return "Nieprawid\u0142owe dane wej\u015Bciowe";
        }
      };
    };
  });
