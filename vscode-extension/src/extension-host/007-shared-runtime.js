function Vee() {
  return { localeError: pXe() };
}
var pXe,
  Kee = g(() => {
    me();
    pXe = () => {
      let t = {
        string: {
          unit: "\u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23",
          verb: "\u0E04\u0E27\u0E23\u0E21\u0E35",
        },
        file: { unit: "\u0E44\u0E1A\u0E15\u0E4C", verb: "\u0E04\u0E27\u0E23\u0E21\u0E35" },
        array: {
          unit: "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23",
          verb: "\u0E04\u0E27\u0E23\u0E21\u0E35",
        },
        set: {
          unit: "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23",
          verb: "\u0E04\u0E27\u0E23\u0E21\u0E35",
        },
        map: {
          unit: "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23",
          verb: "\u0E04\u0E27\u0E23\u0E21\u0E35",
        },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E1B\u0E49\u0E2D\u0E19",
          email: "\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48\u0E2D\u0E35\u0E40\u0E21\u0E25",
          url: "URL",
          emoji: "\u0E2D\u0E34\u0E42\u0E21\u0E08\u0E34",
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
            "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E27\u0E25\u0E32\u0E41\u0E1A\u0E1A ISO",
          date: "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E41\u0E1A\u0E1A ISO",
          time: "\u0E40\u0E27\u0E25\u0E32\u0E41\u0E1A\u0E1A ISO",
          duration: "\u0E0A\u0E48\u0E27\u0E07\u0E40\u0E27\u0E25\u0E32\u0E41\u0E1A\u0E1A ISO",
          ipv4: "\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48 IPv4",
          ipv6: "\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48 IPv6",
          mac: "\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48 MAC",
          cidrv4: "\u0E0A\u0E48\u0E27\u0E07 IP \u0E41\u0E1A\u0E1A IPv4",
          cidrv6: "\u0E0A\u0E48\u0E27\u0E07 IP \u0E41\u0E1A\u0E1A IPv6",
          base64: "\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E41\u0E1A\u0E1A Base64",
          base64url:
            "\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E41\u0E1A\u0E1A Base64 \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A URL",
          json_string: "\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E41\u0E1A\u0E1A JSON",
          e164: "\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28 (E.164)",
          credit_card:
            "\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E25\u0E02\u0E1A\u0E31\u0E15\u0E23\u0E40\u0E04\u0E23\u0E14\u0E34\u0E15",
          currency_code: "\u0E23\u0E2B\u0E31\u0E2A\u0E2A\u0E01\u0E38\u0E25\u0E40\u0E07\u0E34\u0E19",
          iban: "IBAN",
          jwt: "\u0E42\u0E17\u0E40\u0E04\u0E19 JWT",
          template_literal:
            "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E1B\u0E49\u0E2D\u0E19",
        },
        n = {
          nan: "NaN",
          number: "\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02",
          array: "\u0E2D\u0E32\u0E23\u0E4C\u0E40\u0E23\u0E22\u0E4C (Array)",
          null: "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E04\u0E48\u0E32 (null)",
        };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19 instanceof ${o.expected} \u0E41\u0E15\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A ${a}`
              : `\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19 ${i} \u0E41\u0E15\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `\u0E04\u0E48\u0E32\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19 ${z(o.values[0])}`
              : `\u0E15\u0E31\u0E27\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19\u0E2B\u0E19\u0E36\u0E48\u0E07\u0E43\u0E19 ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive
                ? "\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19"
                : "\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32",
              s = e(o.origin);
            return s
              ? `\u0E40\u0E01\u0E34\u0E19\u0E01\u0E33\u0E2B\u0E19\u0E14: ${o.origin ?? "\u0E04\u0E48\u0E32"} \u0E04\u0E27\u0E23\u0E21\u0E35${i} ${o.maximum.toString()} ${s.unit ?? "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23"}`
              : `\u0E40\u0E01\u0E34\u0E19\u0E01\u0E33\u0E2B\u0E19\u0E14: ${o.origin ?? "\u0E04\u0E48\u0E32"} \u0E04\u0E27\u0E23\u0E21\u0E35${i} ${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive
                ? "\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22"
                : "\u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32",
              s = e(o.origin);
            return s
              ? `\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32\u0E01\u0E33\u0E2B\u0E19\u0E14: ${o.origin} \u0E04\u0E27\u0E23\u0E21\u0E35${i} ${o.minimum.toString()} ${s.unit}`
              : `\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32\u0E01\u0E33\u0E2B\u0E19\u0E14: ${o.origin} \u0E04\u0E27\u0E23\u0E21\u0E35${i} ${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E02\u0E36\u0E49\u0E19\u0E15\u0E49\u0E19\u0E14\u0E49\u0E27\u0E22 "${i.prefix}"`
              : i.format === "ends_with"
                ? `\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E25\u0E07\u0E17\u0E49\u0E32\u0E22\u0E14\u0E49\u0E27\u0E22 "${i.suffix}"`
                : i.format === "includes"
                  ? `\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35 "${i.includes}" \u0E2D\u0E22\u0E39\u0E48\u0E43\u0E19\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21`
                  : i.format === "regex"
                    ? `\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E15\u0E49\u0E2D\u0E07\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E17\u0E35\u0E48\u0E01\u0E33\u0E2B\u0E19\u0E14 ${i.pattern}`
                    : `\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E08\u0E33\u0E19\u0E27\u0E19\u0E17\u0E35\u0E48\u0E2B\u0E32\u0E23\u0E14\u0E49\u0E27\u0E22 ${o.divisor} \u0E44\u0E14\u0E49\u0E25\u0E07\u0E15\u0E31\u0E27`;
          case "unrecognized_keys":
            return `\u0E1E\u0E1A\u0E04\u0E35\u0E22\u0E4C\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E23\u0E39\u0E49\u0E08\u0E31\u0E01: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `\u0E04\u0E35\u0E22\u0E4C\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E43\u0E19 ${o.origin}`;
          case "invalid_union":
            return "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E44\u0E21\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E22\u0E39\u0E40\u0E19\u0E35\u0E22\u0E19\u0E17\u0E35\u0E48\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E44\u0E27\u0E49";
          case "invalid_element":
            return `\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E43\u0E19 ${o.origin}`;
          default:
            return "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07";
        }
      };
    };
  });
function Zee() {
  return { localeError: mXe() };
}
var mXe,
  Xee = g(() => {
    me();
    mXe = () => {
      let t = {
        string: { unit: "simwol", verb: "bolmaly" },
        file: { unit: "ba\xFDt", verb: "bolmaly" },
        array: { unit: "elementler", verb: "bolmaly" },
        set: { unit: "elementler", verb: "bolmaly" },
        map: { unit: "elementler", verb: "bolmaly" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "giri\u015F",
          email: "e-po\xE7ta salgysy",
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
          datetime: "ISO sene we wagt",
          date: "ISO sene",
          time: "ISO wagt",
          duration: "ISO wagt aralygy",
          ipv4: "IPv4 salgysy",
          ipv6: "IPv6 salgysy",
          mac: "MAC salgysy",
          cidrv4: "IPv4 aralygy",
          cidrv6: "IPv6 aralygy",
          base64: "base64 bilen \u015Fifrlenen setir",
          base64url: "base64url bilen \u015Fifrlenen setir",
          json_string: "JSON setiri",
          e164: "E.164 nomeri",
          credit_card: "kredit kartyny\u0148 nomeri",
          currency_code: "wal\xFDuta kody",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "\u015Fablon",
        },
        n = { nan: "NaN" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return `N\xE4dogry baha: gara\u015Fylan ${i} \xFDerine ${a} alyndy`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `N\xE4dogry baha: ${z(o.values[0])} bolmaly`
              : `N\xE4dogry sa\xFDlaw: a\u015Fakdakylardan biri bolmaly: ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `Has uly: gara\u015Fyl\xFDan ${o.origin ?? "baha"} ${i} ${o.maximum.toString()} ${s.unit ?? "element"}`
              : `Has uly: gara\u015Fyl\xFDan ${o.origin ?? "baha"} ${i} ${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `Has ki\xE7i: gara\u015Fyl\xFDan ${o.origin} ${i} ${o.minimum.toString()} ${s.unit}`
              : `Has ki\xE7i: gara\u015Fyl\xFDan ${o.origin} ${i} ${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `N\xE4dogry setir: "${i.prefix}" bilen ba\u015Flamaly`
              : i.format === "ends_with"
                ? `N\xE4dogry setir: "${i.suffix}" bilen gutarmaly`
                : i.format === "includes"
                  ? `N\xE4dogry setir: "${i.includes}" saklamaly`
                  : i.format === "regex"
                    ? `N\xE4dogry setir: ${i.pattern} nusga la\xFDyk bolmaly`
                    : `N\xE4dogry ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `N\xE4dogry san: ${o.divisor} bilen galyndysyz b\xF6l\xFCnmeli`;
          case "unrecognized_keys":
            return `Tanalma\xFDan a\xE7ar${o.keys.length > 1 ? "lar" : ""}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `${o.origin} i\xE7inde n\xE4dogry a\xE7ar`;
          case "invalid_union":
            return "N\xE4dogry baha";
          case "invalid_element":
            return `${o.origin} i\xE7inde n\xE4dogry baha`;
          default:
            return "N\xE4dogry baha";
        }
      };
    };
  });
function Yee() {
  return { localeError: fXe() };
}
var fXe,
  Jee = g(() => {
    me();
    fXe = () => {
      let t = {
        string: { unit: "karakter", verb: "olmal\u0131" },
        file: { unit: "bayt", verb: "olmal\u0131" },
        array: { unit: "\xF6\u011Fe", verb: "olmal\u0131" },
        set: { unit: "\xF6\u011Fe", verb: "olmal\u0131" },
        map: { unit: "\xF6\u011Fe", verb: "olmal\u0131" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "girdi",
          email: "e-posta adresi",
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
          datetime: "ISO tarih ve saat",
          date: "ISO tarih",
          time: "ISO saat",
          duration: "ISO s\xFCre",
          ipv4: "IPv4 adresi",
          ipv6: "IPv6 adresi",
          mac: "MAC adresi",
          cidrv4: "IPv4 aral\u0131\u011F\u0131",
          cidrv6: "IPv6 aral\u0131\u011F\u0131",
          base64: "base64 ile \u015Fifrelenmi\u015F metin",
          base64url: "base64url ile \u015Fifrelenmi\u015F metin",
          json_string: "JSON dizesi",
          e164: "E.164 say\u0131s\u0131",
          credit_card: "kredi kart\u0131 numaras\u0131",
          currency_code: "para birimi kodu",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "\u015Eablon dizesi",
        },
        n = { nan: "NaN" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `Ge\xE7ersiz de\u011Fer: beklenen instanceof ${o.expected}, al\u0131nan ${a}`
              : `Ge\xE7ersiz de\u011Fer: beklenen ${i}, al\u0131nan ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `Ge\xE7ersiz de\u011Fer: beklenen ${z(o.values[0])}`
              : `Ge\xE7ersiz se\xE7enek: a\u015Fa\u011F\u0131dakilerden biri olmal\u0131: ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `\xC7ok b\xFCy\xFCk: beklenen ${o.origin ?? "de\u011Fer"} ${i}${o.maximum.toString()} ${s.unit ?? "\xF6\u011Fe"}`
              : `\xC7ok b\xFCy\xFCk: beklenen ${o.origin ?? "de\u011Fer"} ${i}${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `\xC7ok k\xFC\xE7\xFCk: beklenen ${o.origin} ${i}${o.minimum.toString()} ${s.unit}`
              : `\xC7ok k\xFC\xE7\xFCk: beklenen ${o.origin} ${i}${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `Ge\xE7ersiz metin: "${i.prefix}" ile ba\u015Flamal\u0131`
              : i.format === "ends_with"
                ? `Ge\xE7ersiz metin: "${i.suffix}" ile bitmeli`
                : i.format === "includes"
                  ? `Ge\xE7ersiz metin: "${i.includes}" i\xE7ermeli`
                  : i.format === "regex"
                    ? `Ge\xE7ersiz metin: ${i.pattern} desenine uymal\u0131`
                    : `Ge\xE7ersiz ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `Ge\xE7ersiz say\u0131: ${o.divisor} ile tam b\xF6l\xFCnebilmeli`;
          case "unrecognized_keys":
            return `Tan\u0131nmayan anahtar${o.keys.length > 1 ? "lar" : ""}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `${o.origin} i\xE7inde ge\xE7ersiz anahtar`;
          case "invalid_union":
            return "Ge\xE7ersiz de\u011Fer";
          case "invalid_element":
            return `${o.origin} i\xE7inde ge\xE7ersiz de\u011Fer`;
          default:
            return "Ge\xE7ersiz de\u011Fer";
        }
      };
    };
  });
function hT() {
  return { localeError: hXe() };
}
var hXe,
  Q1 = g(() => {
    me();
    hXe = () => {
      let t = {
        string: {
          unit: "\u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432",
          verb: "\u043C\u0430\u0442\u0438\u043C\u0435",
        },
        file: {
          unit: "\u0431\u0430\u0439\u0442\u0456\u0432",
          verb: "\u043C\u0430\u0442\u0438\u043C\u0435",
        },
        array: {
          unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432",
          verb: "\u043C\u0430\u0442\u0438\u043C\u0435",
        },
        set: {
          unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432",
          verb: "\u043C\u0430\u0442\u0438\u043C\u0435",
        },
        map: {
          unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432",
          verb: "\u043C\u0430\u0442\u0438\u043C\u0435",
        },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "\u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456",
          email:
            "\u0430\u0434\u0440\u0435\u0441\u0430 \u0435\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u043E\u0457 \u043F\u043E\u0448\u0442\u0438",
          url: "URL",
          emoji: "\u0435\u043C\u043E\u0434\u0437\u0456",
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
          datetime: "\u0434\u0430\u0442\u0430 \u0442\u0430 \u0447\u0430\u0441 ISO",
          date: "\u0434\u0430\u0442\u0430 ISO",
          time: "\u0447\u0430\u0441 ISO",
          duration: "\u0442\u0440\u0438\u0432\u0430\u043B\u0456\u0441\u0442\u044C ISO",
          ipv4: "\u0430\u0434\u0440\u0435\u0441\u0430 IPv4",
          ipv6: "\u0430\u0434\u0440\u0435\u0441\u0430 IPv6",
          mac: "\u0430\u0434\u0440\u0435\u0441\u0430 MAC",
          cidrv4: "\u0434\u0456\u0430\u043F\u0430\u0437\u043E\u043D IPv4",
          cidrv6: "\u0434\u0456\u0430\u043F\u0430\u0437\u043E\u043D IPv6",
          base64:
            "\u0440\u044F\u0434\u043E\u043A \u0443 \u043A\u043E\u0434\u0443\u0432\u0430\u043D\u043D\u0456 base64",
          base64url:
            "\u0440\u044F\u0434\u043E\u043A \u0443 \u043A\u043E\u0434\u0443\u0432\u0430\u043D\u043D\u0456 base64url",
          json_string: "\u0440\u044F\u0434\u043E\u043A JSON",
          e164: "\u043D\u043E\u043C\u0435\u0440 E.164",
          credit_card:
            "\u043D\u043E\u043C\u0435\u0440 \u043A\u0440\u0435\u0434\u0438\u0442\u043D\u043E\u0457 \u043A\u0430\u0440\u0442\u043A\u0438",
          currency_code: "\u043A\u043E\u0434 \u0432\u0430\u043B\u044E\u0442\u0438",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "\u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456",
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
              ? `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F instanceof ${o.expected}, \u043E\u0442\u0440\u0438\u043C\u0430\u043D\u043E ${a}`
              : `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F ${i}, \u043E\u0442\u0440\u0438\u043C\u0430\u043D\u043E ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F ${z(o.values[0])}`
              : `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0430 \u043E\u043F\u0446\u0456\u044F: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F \u043E\u0434\u043D\u0435 \u0437 ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `\u0417\u0430\u043D\u0430\u0434\u0442\u043E \u0432\u0435\u043B\u0438\u043A\u0435: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F, \u0449\u043E ${o.origin ?? "\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F"} ${s.verb} ${i}${o.maximum.toString()} ${s.unit ?? "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432"}`
              : `\u0417\u0430\u043D\u0430\u0434\u0442\u043E \u0432\u0435\u043B\u0438\u043A\u0435: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F, \u0449\u043E ${o.origin ?? "\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F"} \u0431\u0443\u0434\u0435 ${i}${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `\u0417\u0430\u043D\u0430\u0434\u0442\u043E \u043C\u0430\u043B\u0435: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F, \u0449\u043E ${o.origin} ${s.verb} ${i}${o.minimum.toString()} ${s.unit}`
              : `\u0417\u0430\u043D\u0430\u0434\u0442\u043E \u043C\u0430\u043B\u0435: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F, \u0449\u043E ${o.origin} \u0431\u0443\u0434\u0435 ${i}${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u0440\u044F\u0434\u043E\u043A: \u043F\u043E\u0432\u0438\u043D\u0435\u043D \u043F\u043E\u0447\u0438\u043D\u0430\u0442\u0438\u0441\u044F \u0437 "${i.prefix}"`
              : i.format === "ends_with"
                ? `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u0440\u044F\u0434\u043E\u043A: \u043F\u043E\u0432\u0438\u043D\u0435\u043D \u0437\u0430\u043A\u0456\u043D\u0447\u0443\u0432\u0430\u0442\u0438\u0441\u044F \u043D\u0430 "${i.suffix}"`
                : i.format === "includes"
                  ? `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u0440\u044F\u0434\u043E\u043A: \u043F\u043E\u0432\u0438\u043D\u0435\u043D \u043C\u0456\u0441\u0442\u0438\u0442\u0438 "${i.includes}"`
                  : i.format === "regex"
                    ? `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u0440\u044F\u0434\u043E\u043A: \u043F\u043E\u0432\u0438\u043D\u0435\u043D \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0430\u0442\u0438 \u0448\u0430\u0431\u043B\u043E\u043D\u0443 ${i.pattern}`
                    : `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0435 \u0447\u0438\u0441\u043B\u043E: \u043F\u043E\u0432\u0438\u043D\u043D\u043E \u0431\u0443\u0442\u0438 \u043A\u0440\u0430\u0442\u043D\u0438\u043C ${o.divisor}`;
          case "unrecognized_keys":
            return `\u041D\u0435\u0440\u043E\u0437\u043F\u0456\u0437\u043D\u0430\u043D\u0438\u0439 \u043A\u043B\u044E\u0447${o.keys.length > 1 ? "\u0456" : ""}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u043A\u043B\u044E\u0447 \u0443 ${o.origin}`;
          case "invalid_union":
            return "\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456";
          case "invalid_element":
            return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F \u0443 ${o.origin}`;
          default:
            return "\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456";
        }
      };
    };
  });
function Qee() {
  return hT();
}
var ete = g(() => {
  Q1();
});
function tte() {
  return { localeError: gXe() };
}
var gXe,
  rte = g(() => {
    me();
    gXe = () => {
      let t = {
        string: { unit: "\u062D\u0631\u0648\u0641", verb: "\u06C1\u0648\u0646\u0627" },
        file: { unit: "\u0628\u0627\u0626\u0679\u0633", verb: "\u06C1\u0648\u0646\u0627" },
        array: { unit: "\u0622\u0626\u0679\u0645\u0632", verb: "\u06C1\u0648\u0646\u0627" },
        set: { unit: "\u0622\u0626\u0679\u0645\u0632", verb: "\u06C1\u0648\u0646\u0627" },
        map: { unit: "\u0622\u0626\u0679\u0645\u0632", verb: "\u06C1\u0648\u0646\u0627" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "\u0627\u0646 \u067E\u0679",
          email: "\u0627\u06CC \u0645\u06CC\u0644 \u0627\u06CC\u0688\u0631\u06CC\u0633",
          url: "\u06CC\u0648 \u0622\u0631 \u0627\u06CC\u0644",
          emoji: "\u0627\u06CC\u0645\u0648\u062C\u06CC",
          uuid: "\u06CC\u0648 \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC",
          uuidv4: "\u06CC\u0648 \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC \u0648\u06CC 4",
          uuidv6: "\u06CC\u0648 \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC \u0648\u06CC 6",
          nanoid: "\u0646\u06CC\u0646\u0648 \u0622\u0626\u06CC \u0688\u06CC",
          guid: "\u062C\u06CC \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC",
          cuid: "\u0633\u06CC \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC",
          cuid2: "\u0633\u06CC \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC 2",
          ulid: "\u06CC\u0648 \u0627\u06CC\u0644 \u0622\u0626\u06CC \u0688\u06CC",
          xid: "\u0627\u06CC\u06A9\u0633 \u0622\u0626\u06CC \u0688\u06CC",
          ksuid: "\u06A9\u06D2 \u0627\u06CC\u0633 \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC",
          datetime:
            "\u0622\u0626\u06CC \u0627\u06CC\u0633 \u0627\u0648 \u0688\u06CC\u0679 \u0679\u0627\u0626\u0645",
          date: "\u0622\u0626\u06CC \u0627\u06CC\u0633 \u0627\u0648 \u062A\u0627\u0631\u06CC\u062E",
          time: "\u0622\u0626\u06CC \u0627\u06CC\u0633 \u0627\u0648 \u0648\u0642\u062A",
          duration: "\u0622\u0626\u06CC \u0627\u06CC\u0633 \u0627\u0648 \u0645\u062F\u062A",
          ipv4: "\u0622\u0626\u06CC \u067E\u06CC \u0648\u06CC 4 \u0627\u06CC\u0688\u0631\u06CC\u0633",
          ipv6: "\u0622\u0626\u06CC \u067E\u06CC \u0648\u06CC 6 \u0627\u06CC\u0688\u0631\u06CC\u0633",
          mac: "\u0627\u06CC\u0645 \u0627\u06D2 \u0633\u06CC \u0627\u06CC\u0688\u0631\u06CC\u0633",
          cidrv4: "\u0622\u0626\u06CC \u067E\u06CC \u0648\u06CC 4 \u0631\u06CC\u0646\u062C",
          cidrv6: "\u0622\u0626\u06CC \u067E\u06CC \u0648\u06CC 6 \u0631\u06CC\u0646\u062C",
          base64:
            "\u0628\u06CC\u0633 64 \u0627\u0646 \u06A9\u0648\u0688\u0688 \u0633\u0679\u0631\u0646\u06AF",
          base64url:
            "\u0628\u06CC\u0633 64 \u06CC\u0648 \u0622\u0631 \u0627\u06CC\u0644 \u0627\u0646 \u06A9\u0648\u0688\u0688 \u0633\u0679\u0631\u0646\u06AF",
          json_string:
            "\u062C\u06D2 \u0627\u06CC\u0633 \u0627\u0648 \u0627\u06CC\u0646 \u0633\u0679\u0631\u0646\u06AF",
          e164: "\u0627\u06CC 164 \u0646\u0645\u0628\u0631",
          credit_card:
            "\u06A9\u0631\u06CC\u0688\u0679 \u06A9\u0627\u0631\u0688 \u0646\u0645\u0628\u0631",
          currency_code: "\u06A9\u0631\u0646\u0633\u06CC \u06A9\u0648\u0688",
          iban: "IBAN",
          jwt: "\u062C\u06D2 \u0688\u0628\u0644\u06CC\u0648 \u0679\u06CC",
          template_literal: "\u0627\u0646 \u067E\u0679",
        },
        n = {
          nan: "NaN",
          number: "\u0646\u0645\u0628\u0631",
          array: "\u0622\u0631\u06D2",
          null: "\u0646\u0644",
        };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679: instanceof ${o.expected} \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627\u060C ${a} \u0645\u0648\u0635\u0648\u0644 \u06C1\u0648\u0627`
              : `\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679: ${i} \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627\u060C ${a} \u0645\u0648\u0635\u0648\u0644 \u06C1\u0648\u0627`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679: ${z(o.values[0])} \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627`
              : `\u063A\u0644\u0637 \u0622\u067E\u0634\u0646: ${B(o.values, "|")} \u0645\u06CC\u06BA \u0633\u06D2 \u0627\u06CC\u06A9 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `\u0628\u06C1\u062A \u0628\u0691\u0627: ${o.origin ?? "\u0648\u06CC\u0644\u06CC\u0648"} \u06A9\u06D2 ${i}${o.maximum.toString()} ${s.unit ?? "\u0639\u0646\u0627\u0635\u0631"} \u06C1\u0648\u0646\u06D2 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u06D2`
              : `\u0628\u06C1\u062A \u0628\u0691\u0627: ${o.origin ?? "\u0648\u06CC\u0644\u06CC\u0648"} \u06A9\u0627 ${i}${o.maximum.toString()} \u06C1\u0648\u0646\u0627 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `\u0628\u06C1\u062A \u0686\u06BE\u0648\u0679\u0627: ${o.origin} \u06A9\u06D2 ${i}${o.minimum.toString()} ${s.unit} \u06C1\u0648\u0646\u06D2 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u06D2`
              : `\u0628\u06C1\u062A \u0686\u06BE\u0648\u0679\u0627: ${o.origin} \u06A9\u0627 ${i}${o.minimum.toString()} \u06C1\u0648\u0646\u0627 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `\u063A\u0644\u0637 \u0633\u0679\u0631\u0646\u06AF: "${i.prefix}" \u0633\u06D2 \u0634\u0631\u0648\u0639 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2`
              : i.format === "ends_with"
                ? `\u063A\u0644\u0637 \u0633\u0679\u0631\u0646\u06AF: "${i.suffix}" \u067E\u0631 \u062E\u062A\u0645 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2`
                : i.format === "includes"
                  ? `\u063A\u0644\u0637 \u0633\u0679\u0631\u0646\u06AF: "${i.includes}" \u0634\u0627\u0645\u0644 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2`
                  : i.format === "regex"
                    ? `\u063A\u0644\u0637 \u0633\u0679\u0631\u0646\u06AF: \u067E\u06CC\u0679\u0631\u0646 ${i.pattern} \u0633\u06D2 \u0645\u06CC\u0686 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2`
                    : `\u063A\u0644\u0637 ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `\u063A\u0644\u0637 \u0646\u0645\u0628\u0631: ${o.divisor} \u06A9\u0627 \u0645\u0636\u0627\u0639\u0641 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2`;
          case "unrecognized_keys":
            return `\u063A\u06CC\u0631 \u062A\u0633\u0644\u06CC\u0645 \u0634\u062F\u06C1 \u06A9\u06CC${o.keys.length > 1 ? "\u0632" : ""}: ${B(o.keys, "\u060C ")}`;
          case "invalid_key":
            return `${o.origin} \u0645\u06CC\u06BA \u063A\u0644\u0637 \u06A9\u06CC`;
          case "invalid_union":
            return "\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679";
          case "invalid_element":
            return `${o.origin} \u0645\u06CC\u06BA \u063A\u0644\u0637 \u0648\u06CC\u0644\u06CC\u0648`;
          default:
            return "\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679";
        }
      };
    };
  });
function nte() {
  return { localeError: yXe() };
}
var yXe,
  ote = g(() => {
    me();
    yXe = () => {
      let t = {
        string: { unit: "belgi", verb: "bo\u2018lishi kerak" },
        file: { unit: "bayt", verb: "bo\u2018lishi kerak" },
        array: { unit: "element", verb: "bo\u2018lishi kerak" },
        set: { unit: "element", verb: "bo\u2018lishi kerak" },
        map: { unit: "yozuv", verb: "bo\u2018lishi kerak" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "kirish",
          email: "elektron pochta manzili",
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
          datetime: "ISO sana va vaqti",
          date: "ISO sana",
          time: "ISO vaqt",
          duration: "ISO davomiylik",
          ipv4: "IPv4 manzil",
          ipv6: "IPv6 manzil",
          mac: "MAC manzil",
          cidrv4: "IPv4 diapazon",
          cidrv6: "IPv6 diapazon",
          base64: "base64 kodlangan satr",
          base64url: "base64url kodlangan satr",
          json_string: "JSON satr",
          e164: "E.164 raqam",
          credit_card: "kredit karta raqami",
          currency_code: "valyuta kodi",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "kirish",
        },
        n = { nan: "NaN", number: "raqam", array: "massiv" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `Noto\u2018g\u2018ri kirish: kutilgan instanceof ${o.expected}, qabul qilingan ${a}`
              : `Noto\u2018g\u2018ri kirish: kutilgan ${i}, qabul qilingan ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `Noto\u2018g\u2018ri kirish: kutilgan ${z(o.values[0])}`
              : `Noto\u2018g\u2018ri variant: quyidagilardan biri kutilgan ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `Juda katta: kutilgan ${o.origin ?? "qiymat"} ${i}${o.maximum.toString()} ${s.unit} ${s.verb}`
              : `Juda katta: kutilgan ${o.origin ?? "qiymat"} ${i}${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `Juda kichik: kutilgan ${o.origin} ${i}${o.minimum.toString()} ${s.unit} ${s.verb}`
              : `Juda kichik: kutilgan ${o.origin} ${i}${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `Noto\u2018g\u2018ri satr: "${i.prefix}" bilan boshlanishi kerak`
              : i.format === "ends_with"
                ? `Noto\u2018g\u2018ri satr: "${i.suffix}" bilan tugashi kerak`
                : i.format === "includes"
                  ? `Noto\u2018g\u2018ri satr: "${i.includes}" ni o\u2018z ichiga olishi kerak`
                  : i.format === "regex"
                    ? `Noto\u2018g\u2018ri satr: ${i.pattern} shabloniga mos kelishi kerak`
                    : `Noto\u2018g\u2018ri ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `Noto\u2018g\u2018ri raqam: ${o.divisor} ning karralisi bo\u2018lishi kerak`;
          case "unrecognized_keys":
            return `Noma\u2019lum kalit${o.keys.length > 1 ? "lar" : ""}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `${o.origin} dagi kalit noto\u2018g\u2018ri`;
          case "invalid_union":
            return "Noto\u2018g\u2018ri kirish";
          case "invalid_element":
            return `${o.origin} da noto\u2018g\u2018ri qiymat`;
          default:
            return "Noto\u2018g\u2018ri kirish";
        }
      };
    };
  });
function ite() {
  return { localeError: vXe() };
}
var vXe,
  ste = g(() => {
    me();
    vXe = () => {
      let t = {
        string: { unit: "k\xFD t\u1EF1", verb: "c\xF3" },
        file: { unit: "byte", verb: "c\xF3" },
        array: { unit: "ph\u1EA7n t\u1EED", verb: "c\xF3" },
        set: { unit: "ph\u1EA7n t\u1EED", verb: "c\xF3" },
        map: { unit: "ph\u1EA7n t\u1EED", verb: "c\xF3" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "\u0111\u1EA7u v\xE0o",
          email: "\u0111\u1ECBa ch\u1EC9 email",
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
          datetime: "ng\xE0y gi\u1EDD ISO",
          date: "ng\xE0y ISO",
          time: "gi\u1EDD ISO",
          duration: "kho\u1EA3ng th\u1EDDi gian ISO",
          ipv4: "\u0111\u1ECBa ch\u1EC9 IPv4",
          ipv6: "\u0111\u1ECBa ch\u1EC9 IPv6",
          mac: "\u0111\u1ECBa ch\u1EC9 MAC",
          cidrv4: "d\u1EA3i IPv4",
          cidrv6: "d\u1EA3i IPv6",
          base64: "chu\u1ED7i m\xE3 h\xF3a base64",
          base64url: "chu\u1ED7i m\xE3 h\xF3a base64url",
          json_string: "chu\u1ED7i JSON",
          e164: "s\u1ED1 E.164",
          credit_card: "s\u1ED1 th\u1EBB t\xEDn d\u1EE5ng",
          currency_code: "m\xE3 ti\u1EC1n t\u1EC7",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "\u0111\u1EA7u v\xE0o",
        },
        n = { nan: "NaN", number: "s\u1ED1", array: "m\u1EA3ng" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i instanceof ${o.expected}, nh\u1EADn \u0111\u01B0\u1EE3c ${a}`
              : `\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i ${i}, nh\u1EADn \u0111\u01B0\u1EE3c ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i ${z(o.values[0])}`
              : `T\xF9y ch\u1ECDn kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i m\u1ED9t trong c\xE1c gi\xE1 tr\u1ECB ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `Qu\xE1 l\u1EDBn: mong \u0111\u1EE3i ${o.origin ?? "gi\xE1 tr\u1ECB"} ${s.verb} ${i}${o.maximum.toString()} ${s.unit ?? "ph\u1EA7n t\u1EED"}`
              : `Qu\xE1 l\u1EDBn: mong \u0111\u1EE3i ${o.origin ?? "gi\xE1 tr\u1ECB"} ${i}${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `Qu\xE1 nh\u1ECF: mong \u0111\u1EE3i ${o.origin} ${s.verb} ${i}${o.minimum.toString()} ${s.unit}`
              : `Qu\xE1 nh\u1ECF: mong \u0111\u1EE3i ${o.origin} ${i}${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `Chu\u1ED7i kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i b\u1EAFt \u0111\u1EA7u b\u1EB1ng "${i.prefix}"`
              : i.format === "ends_with"
                ? `Chu\u1ED7i kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i k\u1EBFt th\xFAc b\u1EB1ng "${i.suffix}"`
                : i.format === "includes"
                  ? `Chu\u1ED7i kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i bao g\u1ED3m "${i.includes}"`
                  : i.format === "regex"
                    ? `Chu\u1ED7i kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i kh\u1EDBp v\u1EDBi m\u1EABu ${i.pattern}`
                    : `${r[i.format] ?? o.format} kh\xF4ng h\u1EE3p l\u1EC7`;
          }
          case "not_multiple_of":
            return `S\u1ED1 kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i l\xE0 b\u1ED9i s\u1ED1 c\u1EE7a ${o.divisor}`;
          case "unrecognized_keys":
            return `Kh\xF3a kh\xF4ng \u0111\u01B0\u1EE3c nh\u1EADn d\u1EA1ng: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `Kh\xF3a kh\xF4ng h\u1EE3p l\u1EC7 trong ${o.origin}`;
          case "invalid_union":
            return "\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7";
          case "invalid_element":
            return `Gi\xE1 tr\u1ECB kh\xF4ng h\u1EE3p l\u1EC7 trong ${o.origin}`;
          default:
            return "\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7";
        }
      };
    };
  });
function ate() {
  return { localeError: bXe() };
}
var bXe,
  lte = g(() => {
    me();
    bXe = () => {
      let t = {
        string: { unit: "\u5B57\u7B26", verb: "\u5305\u542B" },
        file: { unit: "\u5B57\u8282", verb: "\u5305\u542B" },
        array: { unit: "\u9879", verb: "\u5305\u542B" },
        set: { unit: "\u9879", verb: "\u5305\u542B" },
        map: { unit: "\u9879", verb: "\u5305\u542B" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "\u8F93\u5165",
          email: "\u7535\u5B50\u90AE\u4EF6",
          url: "URL",
          emoji: "\u8868\u60C5\u7B26\u53F7",
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
          datetime: "ISO\u65E5\u671F\u65F6\u95F4",
          date: "ISO\u65E5\u671F",
          time: "ISO\u65F6\u95F4",
          duration: "ISO\u65F6\u957F",
          ipv4: "IPv4\u5730\u5740",
          ipv6: "IPv6\u5730\u5740",
          mac: "MAC\u5730\u5740",
          cidrv4: "IPv4\u7F51\u6BB5",
          cidrv6: "IPv6\u7F51\u6BB5",
          base64: "base64\u7F16\u7801\u5B57\u7B26\u4E32",
          base64url: "base64url\u7F16\u7801\u5B57\u7B26\u4E32",
          json_string: "JSON\u5B57\u7B26\u4E32",
          e164: "E.164\u53F7\u7801",
          credit_card: "\u4FE1\u7528\u5361\u53F7",
          currency_code: "\u8D27\u5E01\u4EE3\u7801",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "\u8F93\u5165",
        },
        n = {
          nan: "NaN",
          number: "\u6570\u5B57",
          array: "\u6570\u7EC4",
          null: "\u7A7A\u503C(null)",
        };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `\u65E0\u6548\u8F93\u5165\uFF1A\u671F\u671B instanceof ${o.expected}\uFF0C\u5B9E\u9645\u63A5\u6536 ${a}`
              : `\u65E0\u6548\u8F93\u5165\uFF1A\u671F\u671B ${i}\uFF0C\u5B9E\u9645\u63A5\u6536 ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `\u65E0\u6548\u8F93\u5165\uFF1A\u671F\u671B ${z(o.values[0])}`
              : `\u65E0\u6548\u9009\u9879\uFF1A\u671F\u671B\u4EE5\u4E0B\u4E4B\u4E00 ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `\u6570\u503C\u8FC7\u5927\uFF1A\u671F\u671B ${o.origin ?? "\u503C"} ${i}${o.maximum.toString()} ${s.unit ?? "\u4E2A\u5143\u7D20"}`
              : `\u6570\u503C\u8FC7\u5927\uFF1A\u671F\u671B ${o.origin ?? "\u503C"} ${i}${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `\u6570\u503C\u8FC7\u5C0F\uFF1A\u671F\u671B ${o.origin} ${i}${o.minimum.toString()} ${s.unit}`
              : `\u6570\u503C\u8FC7\u5C0F\uFF1A\u671F\u671B ${o.origin} ${i}${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u4EE5 "${i.prefix}" \u5F00\u5934`
              : i.format === "ends_with"
                ? `\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u4EE5 "${i.suffix}" \u7ED3\u5C3E`
                : i.format === "includes"
                  ? `\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u5305\u542B "${i.includes}"`
                  : i.format === "regex"
                    ? `\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u6EE1\u8DB3\u6B63\u5219\u8868\u8FBE\u5F0F ${i.pattern}`
                    : `\u65E0\u6548${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `\u65E0\u6548\u6570\u5B57\uFF1A\u5FC5\u987B\u662F ${o.divisor} \u7684\u500D\u6570`;
          case "unrecognized_keys":
            return `\u51FA\u73B0\u672A\u77E5\u7684\u952E(key): ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `${o.origin} \u4E2D\u7684\u952E(key)\u65E0\u6548`;
          case "invalid_union":
            return "\u65E0\u6548\u8F93\u5165";
          case "invalid_element":
            return `${o.origin} \u4E2D\u5305\u542B\u65E0\u6548\u503C(value)`;
          default:
            return "\u65E0\u6548\u8F93\u5165";
        }
      };
    };
  });
function cte() {
  return { localeError: SXe() };
}
var SXe,
  ute = g(() => {
    me();
    SXe = () => {
      let t = {
        string: { unit: "\u5B57\u5143", verb: "\u64C1\u6709" },
        file: { unit: "\u4F4D\u5143\u7D44", verb: "\u64C1\u6709" },
        array: { unit: "\u9805\u76EE", verb: "\u64C1\u6709" },
        set: { unit: "\u9805\u76EE", verb: "\u64C1\u6709" },
        map: { unit: "\u9805\u76EE", verb: "\u64C1\u6709" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "\u8F38\u5165",
          email: "\u90F5\u4EF6\u5730\u5740",
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
          datetime: "ISO \u65E5\u671F\u6642\u9593",
          date: "ISO \u65E5\u671F",
          time: "ISO \u6642\u9593",
          duration: "ISO \u671F\u9593",
          ipv4: "IPv4 \u4F4D\u5740",
          ipv6: "IPv6 \u4F4D\u5740",
          mac: "MAC \u4F4D\u5740",
          cidrv4: "IPv4 \u7BC4\u570D",
          cidrv6: "IPv6 \u7BC4\u570D",
          base64: "base64 \u7DE8\u78BC\u5B57\u4E32",
          base64url: "base64url \u7DE8\u78BC\u5B57\u4E32",
          json_string: "JSON \u5B57\u4E32",
          e164: "E.164 \u6578\u503C",
          credit_card: "\u4FE1\u7528\u5361\u865F",
          currency_code: "\u8CA8\u5E63\u4EE3\u78BC",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "\u8F38\u5165",
        },
        n = { nan: "NaN" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `\u7121\u6548\u7684\u8F38\u5165\u503C\uFF1A\u9810\u671F\u70BA instanceof ${o.expected}\uFF0C\u4F46\u6536\u5230 ${a}`
              : `\u7121\u6548\u7684\u8F38\u5165\u503C\uFF1A\u9810\u671F\u70BA ${i}\uFF0C\u4F46\u6536\u5230 ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `\u7121\u6548\u7684\u8F38\u5165\u503C\uFF1A\u9810\u671F\u70BA ${z(o.values[0])}`
              : `\u7121\u6548\u7684\u9078\u9805\uFF1A\u9810\u671F\u70BA\u4EE5\u4E0B\u5176\u4E2D\u4E4B\u4E00 ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `\u6578\u503C\u904E\u5927\uFF1A\u9810\u671F ${o.origin ?? "\u503C"} \u61C9\u70BA ${i}${o.maximum.toString()} ${s.unit ?? "\u500B\u5143\u7D20"}`
              : `\u6578\u503C\u904E\u5927\uFF1A\u9810\u671F ${o.origin ?? "\u503C"} \u61C9\u70BA ${i}${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `\u6578\u503C\u904E\u5C0F\uFF1A\u9810\u671F ${o.origin} \u61C9\u70BA ${i}${o.minimum.toString()} ${s.unit}`
              : `\u6578\u503C\u904E\u5C0F\uFF1A\u9810\u671F ${o.origin} \u61C9\u70BA ${i}${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u4EE5 "${i.prefix}" \u958B\u982D`
              : i.format === "ends_with"
                ? `\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u4EE5 "${i.suffix}" \u7D50\u5C3E`
                : i.format === "includes"
                  ? `\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u5305\u542B "${i.includes}"`
                  : i.format === "regex"
                    ? `\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u7B26\u5408\u683C\u5F0F ${i.pattern}`
                    : `\u7121\u6548\u7684 ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `\u7121\u6548\u7684\u6578\u5B57\uFF1A\u5FC5\u9808\u70BA ${o.divisor} \u7684\u500D\u6578`;
          case "unrecognized_keys":
            return `\u7121\u6CD5\u8B58\u5225\u7684\u9375\u503C${o.keys.length > 1 ? "\u5011" : ""}\uFF1A${B(o.keys, "\u3001")}`;
          case "invalid_key":
            return `${o.origin} \u4E2D\u6709\u7121\u6548\u7684\u9375\u503C`;
          case "invalid_union":
            return "\u7121\u6548\u7684\u8F38\u5165\u503C";
          case "invalid_element":
            return `${o.origin} \u4E2D\u6709\u7121\u6548\u7684\u503C`;
          default:
            return "\u7121\u6548\u7684\u8F38\u5165\u503C";
        }
      };
    };
  });
function dte() {
  return { localeError: wXe() };
}
var wXe,
  pte = g(() => {
    me();
    wXe = () => {
      let t = {
        string: { unit: "\xE0mi", verb: "n\xED" },
        file: { unit: "bytes", verb: "n\xED" },
        array: { unit: "nkan", verb: "n\xED" },
        set: { unit: "nkan", verb: "n\xED" },
        map: { unit: "nkan", verb: "n\xED" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "\u1EB9\u0300r\u1ECD \xECb\xE1w\u1ECDl\xE9",
          email: "\xE0d\xEDr\u1EB9\u0301s\xEC \xECm\u1EB9\u0301l\xEC",
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
          datetime: "\xE0k\xF3k\xF2 ISO",
          date: "\u1ECDj\u1ECD\u0301 ISO",
          time: "\xE0k\xF3k\xF2 ISO",
          duration: "\xE0k\xF3k\xF2 t\xF3 p\xE9 ISO",
          ipv4: "\xE0d\xEDr\u1EB9\u0301s\xEC IPv4",
          ipv6: "\xE0d\xEDr\u1EB9\u0301s\xEC IPv6",
          mac: "\xE0d\xEDr\u1EB9\u0301s\xEC MAC",
          cidrv4: "\xE0gb\xE8gb\xE8 IPv4",
          cidrv6: "\xE0gb\xE8gb\xE8 IPv6",
          base64: "\u1ECD\u0300r\u1ECD\u0300 t\xED a k\u1ECD\u0301 n\xED base64",
          base64url: "\u1ECD\u0300r\u1ECD\u0300 base64url",
          json_string: "\u1ECD\u0300r\u1ECD\u0300 JSON",
          e164: "n\u1ECD\u0301mb\xE0 E.164",
          credit_card: "n\u1ECDmba kaadi gbese",
          currency_code: "koodu ow\xF3",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "\u1EB9\u0300r\u1ECD \xECb\xE1w\u1ECDl\xE9",
        },
        n = { nan: "NaN", number: "n\u1ECD\u0301mb\xE0", array: "akop\u1ECD" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e: a n\xED l\xE1ti fi instanceof ${o.expected}, \xE0m\u1ECD\u0300 a r\xED ${a}`
              : `\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e: a n\xED l\xE1ti fi ${i}, \xE0m\u1ECD\u0300 a r\xED ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e: a n\xED l\xE1ti fi ${z(o.values[0])}`
              : `\xC0\u1E63\xE0y\xE0n a\u1E63\xEC\u1E63e: yan \u1ECD\u0300kan l\xE1ra ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `T\xF3 p\u1ECD\u0300 j\xF9: a n\xED l\xE1ti j\u1EB9\u0301 p\xE9 ${o.origin ?? "iye"} ${s.verb} ${i}${o.maximum} ${s.unit}`
              : `T\xF3 p\u1ECD\u0300 j\xF9: a n\xED l\xE1ti j\u1EB9\u0301 ${i}${o.maximum}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `K\xE9r\xE9 ju: a n\xED l\xE1ti j\u1EB9\u0301 p\xE9 ${o.origin} ${s.verb} ${i}${o.minimum} ${s.unit}`
              : `K\xE9r\xE9 ju: a n\xED l\xE1ti j\u1EB9\u0301 ${i}${o.minimum}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `\u1ECC\u0300r\u1ECD\u0300 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 b\u1EB9\u0300r\u1EB9\u0300 p\u1EB9\u0300l\xFA "${i.prefix}"`
              : i.format === "ends_with"
                ? `\u1ECC\u0300r\u1ECD\u0300 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 par\xED p\u1EB9\u0300l\xFA "${i.suffix}"`
                : i.format === "includes"
                  ? `\u1ECC\u0300r\u1ECD\u0300 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 n\xED "${i.includes}"`
                  : i.format === "regex"
                    ? `\u1ECC\u0300r\u1ECD\u0300 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 b\xE1 \xE0p\u1EB9\u1EB9r\u1EB9 mu ${i.pattern}`
                    : `A\u1E63\xEC\u1E63e: ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `N\u1ECD\u0301mb\xE0 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 j\u1EB9\u0301 \xE8y\xE0 p\xEDp\xEDn ti ${o.divisor}`;
          case "unrecognized_keys":
            return `B\u1ECDt\xECn\xEC \xE0\xECm\u1ECD\u0300: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `B\u1ECDt\xECn\xEC a\u1E63\xEC\u1E63e n\xEDn\xFA ${o.origin}`;
          case "invalid_union":
            return "\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e";
          case "invalid_element":
            return `Iye a\u1E63\xEC\u1E63e n\xEDn\xFA ${o.origin}`;
          default:
            return "\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e";
        }
      };
    };
  });
