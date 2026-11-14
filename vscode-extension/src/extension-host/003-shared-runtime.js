function mT() {
  return { localeError: EZe() };
}
var EZe,
  Y1 = g(() => {
    me();
    EZe = () => {
      let t = {
        string: { unit: "characters", verb: "to have" },
        file: { unit: "bytes", verb: "to have" },
        array: { unit: "items", verb: "to have" },
        set: { unit: "items", verb: "to have" },
        map: { unit: "entries", verb: "to have" },
      };
      function e(i) {
        return t[i] ?? null;
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
          currency_code: "currency code",
          credit_card: "credit card number",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "input",
        },
        n = { nan: "NaN" };
      function o(i, s) {
        return i === "number" && typeof s == "number" && !Number.isFinite(s)
          ? String(s)
          : (n[i] ?? i);
      }
      return (i) => {
        switch (i.code) {
          case "invalid_type": {
            let s = o(i.expected),
              a = K(i.input),
              l = o(a, i.input);
            return `Invalid input: expected ${s}, received ${l}`;
          }
          case "invalid_value":
            return i.values.length === 1
              ? `Invalid input: expected ${z(i.values[0])}`
              : `Invalid option: expected one of ${B(i.values, "|")}`;
          case "too_big": {
            let s = i.exact ? "exactly " : i.inclusive ? "<=" : "<",
              a = e(i.origin);
            return a
              ? `Too big: expected ${i.origin ?? "value"} to have ${s}${i.maximum.toString()} ${a.unit ?? "elements"}`
              : `Too big: expected ${i.origin ?? "value"} to be ${s}${i.maximum.toString()}`;
          }
          case "too_small": {
            let s = i.exact ? "exactly " : i.inclusive ? ">=" : ">",
              a = e(i.origin);
            return a
              ? `Too small: expected ${i.origin} to have ${s}${i.minimum.toString()} ${a.unit}`
              : `Too small: expected ${i.origin} to be ${s}${i.minimum.toString()}`;
          }
          case "invalid_format": {
            let s = i;
            return s.format === "starts_with"
              ? `Invalid string: must start with "${s.prefix}"`
              : s.format === "ends_with"
                ? `Invalid string: must end with "${s.suffix}"`
                : s.format === "includes"
                  ? `Invalid string: must include "${s.includes}"`
                  : s.format === "regex"
                    ? `Invalid string: must match pattern ${s.pattern}`
                    : `Invalid ${r[s.format] ?? i.format}`;
          }
          case "not_multiple_of":
            return `Invalid number: must be a multiple of ${i.divisor}`;
          case "unrecognized_keys":
            return `Unrecognized key${i.keys.length > 1 ? "s" : ""}: ${B(i.keys, ", ")}`;
          case "invalid_key":
            return `Invalid key in ${i.origin}`;
          case "invalid_union":
            return i.options && Array.isArray(i.options) && i.options.length > 0
              ? `Invalid discriminator value. Expected ${i.options.map((a) => `'${a}'`).join(" | ")}`
              : i.inclusive === !1
                ? "Invalid input: more than one option matched"
                : "Invalid input";
          case "invalid_element":
            return `Invalid value in ${i.origin}`;
          default:
            return "Invalid input";
        }
      };
    };
  });
function SQ() {
  return { localeError: CZe() };
}
var CZe,
  wQ = g(() => {
    me();
    CZe = () => {
      let t = {
        string: { unit: "karaktrojn", verb: "havi" },
        file: { unit: "bajtojn", verb: "havi" },
        array: { unit: "elementojn", verb: "havi" },
        set: { unit: "elementojn", verb: "havi" },
        map: { unit: "elementojn", verb: "havi" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "enigo",
          email: "retadreso",
          url: "URL",
          emoji: "emo\u011Dio",
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
          datetime: "ISO-datotempo",
          date: "ISO-dato",
          time: "ISO-tempo",
          duration: "ISO-da\u016Dro",
          ipv4: "IPv4-adreso",
          ipv6: "IPv6-adreso",
          mac: "MAC-adreso",
          cidrv4: "IPv4-rango",
          cidrv6: "IPv6-rango",
          base64: "64-ume kodita karaktraro",
          base64url: "URL-64-ume kodita karaktraro",
          json_string: "JSON-karaktraro",
          e164: "E.164-nombro",
          credit_card: "kreditkarta numero",
          currency_code: "valuta kodo",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "enigo",
        },
        n = { nan: "NaN", number: "nombro", array: "tabelo", null: "senvalora" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `Nevalida enigo: atendi\u011Dis instanceof ${o.expected}, ricevi\u011Dis ${a}`
              : `Nevalida enigo: atendi\u011Dis ${i}, ricevi\u011Dis ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `Nevalida enigo: atendi\u011Dis ${z(o.values[0])}`
              : `Nevalida opcio: atendi\u011Dis unu el ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `Tro granda: atendi\u011Dis ke ${o.origin ?? "valoro"} havu ${i}${o.maximum.toString()} ${s.unit ?? "elementojn"}`
              : `Tro granda: atendi\u011Dis ke ${o.origin ?? "valoro"} havu ${i}${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `Tro malgranda: atendi\u011Dis ke ${o.origin} havu ${i}${o.minimum.toString()} ${s.unit}`
              : `Tro malgranda: atendi\u011Dis ke ${o.origin} estu ${i}${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `Nevalida karaktraro: devas komenci\u011Di per "${i.prefix}"`
              : i.format === "ends_with"
                ? `Nevalida karaktraro: devas fini\u011Di per "${i.suffix}"`
                : i.format === "includes"
                  ? `Nevalida karaktraro: devas inkluzivi "${i.includes}"`
                  : i.format === "regex"
                    ? `Nevalida karaktraro: devas kongrui kun la modelo ${i.pattern}`
                    : `Nevalida ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `Nevalida nombro: devas esti oblo de ${o.divisor}`;
          case "unrecognized_keys":
            return `Nekonata${o.keys.length > 1 ? "j" : ""} \u015Dlosilo${o.keys.length > 1 ? "j" : ""}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `Nevalida \u015Dlosilo en ${o.origin}`;
          case "invalid_union":
            return "Nevalida enigo";
          case "invalid_element":
            return `Nevalida valoro en ${o.origin}`;
          default:
            return "Nevalida enigo";
        }
      };
    };
  });
function _Q() {
  return { localeError: TZe() };
}
var TZe,
  xQ = g(() => {
    me();
    TZe = () => {
      let t = {
        string: { unit: "caracteres", verb: "tener" },
        file: { unit: "bytes", verb: "tener" },
        array: { unit: "elementos", verb: "tener" },
        set: { unit: "elementos", verb: "tener" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "entrada",
          email: "direcci\xF3n de correo electr\xF3nico",
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
          datetime: "fecha y hora ISO",
          date: "fecha ISO",
          time: "hora ISO",
          duration: "duraci\xF3n ISO",
          ipv4: "direcci\xF3n IPv4",
          ipv6: "direcci\xF3n IPv6",
          mac: "direcci\xF3n MAC",
          cidrv4: "rango IPv4",
          cidrv6: "rango IPv6",
          base64: "cadena codificada en base64",
          base64url: "URL codificada en base64",
          json_string: "cadena JSON",
          e164: "n\xFAmero E.164",
          credit_card: "n\xFAmero de tarjeta de cr\xE9dito",
          currency_code: "c\xF3digo de moneda",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "entrada",
        },
        n = {
          nan: "NaN",
          string: "texto",
          number: "n\xFAmero",
          boolean: "booleano",
          array: "arreglo",
          object: "objeto",
          set: "conjunto",
          file: "archivo",
          date: "fecha",
          bigint: "n\xFAmero grande",
          symbol: "s\xEDmbolo",
          undefined: "indefinido",
          null: "nulo",
          function: "funci\xF3n",
          map: "mapa",
          record: "registro",
          tuple: "tupla",
          enum: "enumeraci\xF3n",
          union: "uni\xF3n",
          literal: "literal",
          promise: "promesa",
          void: "vac\xEDo",
          never: "nunca",
          unknown: "desconocido",
          any: "cualquiera",
        };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `Entrada inv\xE1lida: se esperaba instanceof ${o.expected}, recibido ${a}`
              : `Entrada inv\xE1lida: se esperaba ${i}, recibido ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `Entrada inv\xE1lida: se esperaba ${z(o.values[0])}`
              : `Opci\xF3n inv\xE1lida: se esperaba una de ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin),
              a = n[o.origin] ?? o.origin;
            return s
              ? `Demasiado grande: se esperaba que ${a ?? "valor"} tuviera ${i}${o.maximum.toString()} ${s.unit ?? "elementos"}`
              : `Demasiado grande: se esperaba que ${a ?? "valor"} fuera ${i}${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin),
              a = n[o.origin] ?? o.origin;
            return s
              ? `Demasiado peque\xF1o: se esperaba que ${a} tuviera ${i}${o.minimum.toString()} ${s.unit}`
              : `Demasiado peque\xF1o: se esperaba que ${a} fuera ${i}${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `Cadena inv\xE1lida: debe comenzar con "${i.prefix}"`
              : i.format === "ends_with"
                ? `Cadena inv\xE1lida: debe terminar en "${i.suffix}"`
                : i.format === "includes"
                  ? `Cadena inv\xE1lida: debe incluir "${i.includes}"`
                  : i.format === "regex"
                    ? `Cadena inv\xE1lida: debe coincidir con el patr\xF3n ${i.pattern}`
                    : `Inv\xE1lido ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `N\xFAmero inv\xE1lido: debe ser m\xFAltiplo de ${o.divisor}`;
          case "unrecognized_keys":
            return `Llave${o.keys.length > 1 ? "s" : ""} desconocida${o.keys.length > 1 ? "s" : ""}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `Llave inv\xE1lida en ${n[o.origin] ?? o.origin}`;
          case "invalid_union":
            return "Entrada inv\xE1lida";
          case "invalid_element":
            return `Valor inv\xE1lido en ${n[o.origin] ?? o.origin}`;
          default:
            return "Entrada inv\xE1lida";
        }
      };
    };
  });
function AQ() {
  return { localeError: PZe() };
}
var PZe,
  RQ = g(() => {
    me();
    PZe = () => {
      let t = {
        string: {
          unit: "\u06A9\u0627\u0631\u0627\u06A9\u062A\u0631",
          verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F",
        },
        file: {
          unit: "\u0628\u0627\u06CC\u062A",
          verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F",
        },
        array: {
          unit: "\u0622\u06CC\u062A\u0645",
          verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F",
        },
        set: {
          unit: "\u0622\u06CC\u062A\u0645",
          verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F",
        },
        map: {
          unit: "\u0622\u06CC\u062A\u0645",
          verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F",
        },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "\u0648\u0631\u0648\u062F\u06CC",
          email: "\u0622\u062F\u0631\u0633 \u0627\u06CC\u0645\u06CC\u0644",
          url: "URL",
          emoji: "\u0627\u06CC\u0645\u0648\u062C\u06CC",
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
            "\u062A\u0627\u0631\u06CC\u062E \u0648 \u0632\u0645\u0627\u0646 \u0627\u06CC\u0632\u0648",
          date: "\u062A\u0627\u0631\u06CC\u062E \u0627\u06CC\u0632\u0648",
          time: "\u0632\u0645\u0627\u0646 \u0627\u06CC\u0632\u0648",
          duration: "\u0645\u062F\u062A \u0632\u0645\u0627\u0646 \u0627\u06CC\u0632\u0648",
          ipv4: "IPv4 \u0622\u062F\u0631\u0633",
          ipv6: "IPv6 \u0622\u062F\u0631\u0633",
          mac: "MAC \u0622\u062F\u0631\u0633",
          cidrv4: "IPv4 \u062F\u0627\u0645\u0646\u0647",
          cidrv6: "IPv6 \u062F\u0627\u0645\u0646\u0647",
          base64: "base64-encoded \u0631\u0634\u062A\u0647",
          base64url: "base64url-encoded \u0631\u0634\u062A\u0647",
          json_string: "JSON \u0631\u0634\u062A\u0647",
          e164: "E.164 \u0639\u062F\u062F",
          credit_card:
            "\u0634\u0645\u0627\u0631\u0647 \u06A9\u0627\u0631\u062A \u0627\u0639\u062A\u0628\u0627\u0631\u06CC",
          currency_code: "\u06A9\u062F \u0627\u0631\u0632",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "\u0648\u0631\u0648\u062F\u06CC",
        },
        n = { nan: "NaN", number: "\u0639\u062F\u062F", array: "\u0622\u0631\u0627\u06CC\u0647" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A instanceof ${o.expected} \u0645\u06CC\u200C\u0628\u0648\u062F\u060C ${a} \u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u062F`
              : `\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A ${i} \u0645\u06CC\u200C\u0628\u0648\u062F\u060C ${a} \u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u062F`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A ${z(o.values[0])} \u0645\u06CC\u200C\u0628\u0648\u062F`
              : `\u06AF\u0632\u06CC\u0646\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A \u06CC\u06A9\u06CC \u0627\u0632 ${B(o.values, "|")} \u0645\u06CC\u200C\u0628\u0648\u062F`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `\u062E\u06CC\u0644\u06CC \u0628\u0632\u0631\u06AF: ${o.origin ?? "\u0645\u0642\u062F\u0627\u0631"} \u0628\u0627\u06CC\u062F ${i}${o.maximum.toString()} ${s.unit ?? "\u0639\u0646\u0635\u0631"} \u0628\u0627\u0634\u062F`
              : `\u062E\u06CC\u0644\u06CC \u0628\u0632\u0631\u06AF: ${o.origin ?? "\u0645\u0642\u062F\u0627\u0631"} \u0628\u0627\u06CC\u062F ${i}${o.maximum.toString()} \u0628\u0627\u0634\u062F`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `\u062E\u06CC\u0644\u06CC \u06A9\u0648\u0686\u06A9: ${o.origin} \u0628\u0627\u06CC\u062F ${i}${o.minimum.toString()} ${s.unit} \u0628\u0627\u0634\u062F`
              : `\u062E\u06CC\u0644\u06CC \u06A9\u0648\u0686\u06A9: ${o.origin} \u0628\u0627\u06CC\u062F ${i}${o.minimum.toString()} \u0628\u0627\u0634\u062F`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0628\u0627 "${i.prefix}" \u0634\u0631\u0648\u0639 \u0634\u0648\u062F`
              : i.format === "ends_with"
                ? `\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0628\u0627 "${i.suffix}" \u062A\u0645\u0627\u0645 \u0634\u0648\u062F`
                : i.format === "includes"
                  ? `\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0634\u0627\u0645\u0644 "${i.includes}" \u0628\u0627\u0634\u062F`
                  : i.format === "regex"
                    ? `\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0628\u0627 \u0627\u0644\u06AF\u0648\u06CC ${i.pattern} \u0645\u0637\u0627\u0628\u0642\u062A \u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F`
                    : `${r[i.format] ?? o.format} \u0646\u0627\u0645\u0639\u062A\u0628\u0631`;
          }
          case "not_multiple_of":
            return `\u0639\u062F\u062F \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0645\u0636\u0631\u0628 ${o.divisor} \u0628\u0627\u0634\u062F`;
          case "unrecognized_keys":
            return `\u06A9\u0644\u06CC\u062F${o.keys.length > 1 ? "\u0647\u0627\u06CC" : ""} \u0646\u0627\u0634\u0646\u0627\u0633: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `\u06A9\u0644\u06CC\u062F \u0646\u0627\u0634\u0646\u0627\u0633 \u062F\u0631 ${o.origin}`;
          case "invalid_union":
            return "\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631";
          case "invalid_element":
            return `\u0645\u0642\u062F\u0627\u0631 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u062F\u0631 ${o.origin}`;
          default:
            return "\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631";
        }
      };
    };
  });
function EQ() {
  return { localeError: IZe() };
}
var IZe,
  CQ = g(() => {
    me();
    IZe = () => {
      let t = {
        string: { unit: "merkki\xE4", subject: "merkkijonon" },
        file: { unit: "tavua", subject: "tiedoston" },
        array: { unit: "alkiota", subject: "listan" },
        set: { unit: "alkiota", subject: "joukon" },
        map: { unit: "alkiota", subject: "kuvauksen" },
        number: { unit: "", subject: "luvun" },
        bigint: { unit: "", subject: "suuren kokonaisluvun" },
        int: { unit: "", subject: "kokonaisluvun" },
        date: { unit: "", subject: "p\xE4iv\xE4m\xE4\xE4r\xE4n" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "s\xE4\xE4nn\xF6llinen lauseke",
          email: "s\xE4hk\xF6postiosoite",
          url: "URL-osoite",
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
          datetime: "ISO-aikaleima",
          date: "ISO-p\xE4iv\xE4m\xE4\xE4r\xE4",
          time: "ISO-aika",
          duration: "ISO-kesto",
          ipv4: "IPv4-osoite",
          ipv6: "IPv6-osoite",
          mac: "MAC-osoite",
          cidrv4: "IPv4-alue",
          cidrv6: "IPv6-alue",
          base64: "base64-koodattu merkkijono",
          base64url: "base64url-koodattu merkkijono",
          json_string: "JSON-merkkijono",
          e164: "E.164-luku",
          credit_card: "luottokortin numero",
          currency_code: "valuuttakoodi",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "templaattimerkkijono",
        },
        n = { nan: "NaN" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `Virheellinen tyyppi: odotettiin instanceof ${o.expected}, oli ${a}`
              : `Virheellinen tyyppi: odotettiin ${i}, oli ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `Virheellinen sy\xF6te: t\xE4ytyy olla ${z(o.values[0])}`
              : `Virheellinen valinta: t\xE4ytyy olla yksi seuraavista: ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `Liian suuri: ${s.subject} t\xE4ytyy olla ${i}${o.maximum.toString()} ${s.unit}`.trim()
              : `Liian suuri: arvon t\xE4ytyy olla ${i}${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `Liian pieni: ${s.subject} t\xE4ytyy olla ${i}${o.minimum.toString()} ${s.unit}`.trim()
              : `Liian pieni: arvon t\xE4ytyy olla ${i}${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `Virheellinen sy\xF6te: t\xE4ytyy alkaa "${i.prefix}"`
              : i.format === "ends_with"
                ? `Virheellinen sy\xF6te: t\xE4ytyy loppua "${i.suffix}"`
                : i.format === "includes"
                  ? `Virheellinen sy\xF6te: t\xE4ytyy sis\xE4lt\xE4\xE4 "${i.includes}"`
                  : i.format === "regex"
                    ? `Virheellinen sy\xF6te: t\xE4ytyy vastata s\xE4\xE4nn\xF6llist\xE4 lauseketta ${i.pattern}`
                    : `Virheellinen ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `Virheellinen luku: t\xE4ytyy olla luvun ${o.divisor} monikerta`;
          case "unrecognized_keys":
            return `${o.keys.length > 1 ? "Tuntemattomat avaimet" : "Tuntematon avain"}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return "Virheellinen avain tietueessa";
          case "invalid_union":
            return "Virheellinen unioni";
          case "invalid_element":
            return "Virheellinen arvo joukossa";
          default:
            return "Virheellinen sy\xF6te";
        }
      };
    };
  });
function TQ() {
  return { localeError: kZe() };
}
var kZe,
  PQ = g(() => {
    me();
    kZe = () => {
      let t = {
        string: { unit: "caract\xE8res", verb: "avoir" },
        file: { unit: "octets", verb: "avoir" },
        array: { unit: "\xE9l\xE9ments", verb: "avoir" },
        set: { unit: "\xE9l\xE9ments", verb: "avoir" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "expression r\xE9guli\xE8re",
          email: "adresse e-mail",
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
          datetime: "date et heure ISO",
          date: "date ISO",
          time: "heure ISO",
          duration: "dur\xE9e ISO",
          ipv4: "adresse IPv4",
          ipv6: "adresse IPv6",
          mac: "adresse MAC",
          cidrv4: "plage IPv4",
          cidrv6: "plage IPv6",
          base64: "cha\xEEne de caract\xE8res encod\xE9e en base64",
          base64url: "cha\xEEne de caract\xE8res encod\xE9e en base64url",
          json_string: "cha\xEEne de caract\xE8res JSON",
          e164: "num\xE9ro au format E.164",
          credit_card: "num\xE9ro de carte de cr\xE9dit",
          currency_code: "code de devise",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "entr\xE9e",
        },
        n = {
          string: "cha\xEEne de caract\xE8res",
          number: "nombre",
          int: "entier",
          boolean: "bool\xE9en",
          bigint: "grand entier",
          symbol: "symbole",
          undefined: "ind\xE9fini",
          null: "null",
          never: "jamais",
          void: "vide",
          date: "date",
          array: "tableau",
          object: "objet",
          tuple: "tuple",
          record: "record",
          map: "map",
          set: "ensemble",
          file: "fichier",
          nonoptional: "non optionnel",
          nan: "NaN",
          function: "fonction",
        };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `Entr\xE9e invalide : instance de ${o.expected} attendu, ${a} re\xE7u`
              : `Entr\xE9e invalide : ${i} attendu, ${a} re\xE7u`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `Entr\xE9e invalide : ${z(o.values[0])} attendu`
              : `Option invalide : une valeur parmi ${B(o.values, "|")} attendue`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `Trop grand : ${n[o.origin] ?? "valeur"} doit ${s.verb} ${i}${o.maximum.toString()} ${s.unit ?? "\xE9l\xE9ment(s)"}`
              : `Trop grand : ${n[o.origin] ?? "valeur"} doit \xEAtre ${i}${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `Trop petit : ${n[o.origin] ?? "valeur"} doit ${s.verb} ${i}${o.minimum.toString()} ${s.unit}`
              : `Trop petit : ${n[o.origin] ?? "valeur"} doit \xEAtre ${i}${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `Cha\xEEne de caract\xE8res invalide : doit commencer par "${i.prefix}"`
              : i.format === "ends_with"
                ? `Cha\xEEne de caract\xE8res invalide : doit se terminer par "${i.suffix}"`
                : i.format === "includes"
                  ? `Cha\xEEne de caract\xE8res invalide : doit inclure "${i.includes}"`
                  : i.format === "regex"
                    ? `Cha\xEEne de caract\xE8res invalide : doit correspondre au motif ${i.pattern}`
                    : `${r[i.format] ?? o.format} invalide`;
          }
          case "not_multiple_of":
            return `Nombre invalide : doit \xEAtre un multiple de ${o.divisor}`;
          case "unrecognized_keys":
            return `Cl\xE9${o.keys.length > 1 ? "s" : ""} non reconnue${o.keys.length > 1 ? "s" : ""} : ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `Cl\xE9 invalide dans ${o.origin}`;
          case "invalid_union":
            return "Entr\xE9e invalide";
          case "invalid_element":
            return `Valeur invalide dans ${o.origin}`;
          default:
            return "Entr\xE9e invalide";
        }
      };
    };
  });
function IQ() {
  return { localeError: DZe() };
}
var DZe,
  kQ = g(() => {
    me();
    DZe = () => {
      let t = {
        string: { unit: "caract\xE8res", verb: "avoir" },
        file: { unit: "octets", verb: "avoir" },
        array: { unit: "\xE9l\xE9ments", verb: "avoir" },
        set: { unit: "\xE9l\xE9ments", verb: "avoir" },
        map: { unit: "\xE9l\xE9ments", verb: "avoir" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "entr\xE9e",
          email: "adresse courriel",
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
          datetime: "date-heure ISO",
          date: "date ISO",
          time: "heure ISO",
          duration: "dur\xE9e ISO",
          ipv4: "adresse IPv4",
          ipv6: "adresse IPv6",
          mac: "adresse MAC",
          cidrv4: "plage IPv4",
          cidrv6: "plage IPv6",
          base64: "cha\xEEne encod\xE9e en base64",
          base64url: "cha\xEEne encod\xE9e en base64url",
          json_string: "cha\xEEne JSON",
          e164: "num\xE9ro E.164",
          credit_card: "num\xE9ro de carte de cr\xE9dit",
          currency_code: "code de devise",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "entr\xE9e",
        },
        n = { nan: "NaN" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `Entr\xE9e invalide : attendu instanceof ${o.expected}, re\xE7u ${a}`
              : `Entr\xE9e invalide : attendu ${i}, re\xE7u ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `Entr\xE9e invalide : attendu ${z(o.values[0])}`
              : `Option invalide : attendu l'une des valeurs suivantes ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "\u2264" : "<",
              s = e(o.origin);
            return s
              ? `Trop grand : attendu que ${o.origin ?? "la valeur"} ait ${i}${o.maximum.toString()} ${s.unit}`
              : `Trop grand : attendu que ${o.origin ?? "la valeur"} soit ${i}${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? "\u2265" : ">",
              s = e(o.origin);
            return s
              ? `Trop petit : attendu que ${o.origin} ait ${i}${o.minimum.toString()} ${s.unit}`
              : `Trop petit : attendu que ${o.origin} soit ${i}${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `Cha\xEEne invalide : doit commencer par "${i.prefix}"`
              : i.format === "ends_with"
                ? `Cha\xEEne invalide : doit se terminer par "${i.suffix}"`
                : i.format === "includes"
                  ? `Cha\xEEne invalide : doit inclure "${i.includes}"`
                  : i.format === "regex"
                    ? `Cha\xEEne invalide : doit correspondre au motif ${i.pattern}`
                    : `${r[i.format] ?? o.format} invalide`;
          }
          case "not_multiple_of":
            return `Nombre invalide : doit \xEAtre un multiple de ${o.divisor}`;
          case "unrecognized_keys":
            return `Cl\xE9${o.keys.length > 1 ? "s" : ""} non reconnue${o.keys.length > 1 ? "s" : ""} : ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `Cl\xE9 invalide dans ${o.origin}`;
          case "invalid_union":
            return "Entr\xE9e invalide";
          case "invalid_element":
            return `Valeur invalide dans ${o.origin}`;
          default:
            return "Entr\xE9e invalide";
        }
      };
    };
  });
function DQ() {
  return { localeError: MZe() };
}
var MZe,
  MQ = g(() => {
    me();
    MZe = () => {
      let t = {
        string: {
          unit: "\u0A85\u0A95\u0ACD\u0AB7\u0AB0",
          verb: "\u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F",
        },
        file: {
          unit: "\u0AAC\u0ABE\u0AAF\u0A9F",
          verb: "\u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F",
        },
        array: {
          unit: "\u0A86\u0A87\u0A9F\u0AAE",
          verb: "\u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F",
        },
        set: {
          unit: "\u0A86\u0A87\u0A9F\u0AAE",
          verb: "\u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F",
        },
        map: {
          unit: "\u0A8F\u0AA8\u0ACD\u0A9F\u0ACD\u0AB0\u0AC0",
          verb: "\u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F",
        },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "\u0A87\u0AA8\u0AAA\u0AC1\u0A9F",
          email: "\u0A88\u0AAE\u0AC7\u0A87\u0AB2 \u0A8F\u0AA1\u0ACD\u0AB0\u0AC7\u0AB8",
          url: "URL",
          emoji: "\u0A87\u0AAE\u0ACB\u0A9C\u0AC0",
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
          datetime: "ISO \u0AA4\u0ABE\u0AB0\u0AC0\u0A96 \u0A85\u0AA8\u0AC7 \u0AB8\u0AAE\u0AAF",
          date: "ISO \u0AA4\u0ABE\u0AB0\u0AC0\u0A96",
          time: "ISO \u0AB8\u0AAE\u0AAF",
          duration: "ISO \u0A85\u0AB5\u0AA7\u0ABF",
          ipv4: "IPv4 \u0A8F\u0AA1\u0ACD\u0AB0\u0AC7\u0AB8",
          ipv6: "IPv6 \u0A8F\u0AA1\u0ACD\u0AB0\u0AC7\u0AB8",
          mac: "MAC \u0A8F\u0AA1\u0ACD\u0AB0\u0AC7\u0AB8",
          cidrv4: "IPv4 \u0AB6\u0ACD\u0AB0\u0AC7\u0AA3\u0AC0",
          cidrv6: "IPv6 \u0AB6\u0ACD\u0AB0\u0AC7\u0AA3\u0AC0",
          base64:
            "base64-\u0A8F\u0AA8\u0ACD\u0A95\u0ACB\u0AA1\u0AC7\u0AA1 \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97",
          base64url:
            "base64url-\u0A8F\u0AA8\u0ACD\u0A95\u0ACB\u0AA1\u0AC7\u0AA1 \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97",
          json_string: "JSON \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97",
          e164: "E.164 \u0AA8\u0A82\u0AAC\u0AB0",
          credit_card:
            "\u0A95\u0ACD\u0AB0\u0AC7\u0AA1\u0ABF\u0A9F \u0A95\u0ABE\u0AB0\u0ACD\u0AA1 \u0AA8\u0A82\u0AAC\u0AB0",
          currency_code: "\u0A9A\u0AB2\u0AA3 \u0A95\u0ACB\u0AA1",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "\u0A87\u0AA8\u0AAA\u0AC1\u0A9F",
        },
        n = { nan: "NaN" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return `\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0A87\u0AA8\u0AAA\u0AC1\u0A9F: \u0A85\u0AAA\u0AC7\u0A95\u0ACD\u0AB7\u0ABF\u0AA4 ${i}, \u0AAA\u0ACD\u0AB0\u0ABE\u0AAA\u0ACD\u0AA4 ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0A87\u0AA8\u0AAA\u0AC1\u0A9F: \u0A85\u0AAA\u0AC7\u0A95\u0ACD\u0AB7\u0ABF\u0AA4 ${z(o.values[0])}`
              : `\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AB5\u0ABF\u0A95\u0AB2\u0ACD\u0AAA: ${B(o.values, " | ")} \u0AAE\u0ABE\u0AA7\u0ACD\u0AAF\u0AAE\u0AA5\u0AC0 \u0A8F\u0A95 \u0A85\u0AAA\u0AC7\u0A95\u0ACD\u0AB7\u0ABF\u0AA4`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `\u0A96\u0AC2\u0AAC \u0AAE\u0ACB\u0A9F\u0AC1\u0A82: ${o.origin ?? "\u0AAE\u0AC2\u0AB2\u0ACD\u0AAF"} ${i}${o.maximum.toString()} ${s.unit ?? "\u0A8F\u0AB2\u0ABF\u0AAE\u0AC7\u0AA8\u0ACD\u0A9F"} \u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F`
              : `\u0A96\u0AC2\u0AAC \u0AAE\u0ACB\u0A9F\u0AC1\u0A82: ${o.origin ?? "\u0AAE\u0AC2\u0AB2\u0ACD\u0AAF"} ${i}${o.maximum.toString()} \u0AB9\u0ACB\u0AB5\u0AC1\u0A82 \u0A9C\u0ACB\u0A88\u0A8F`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `\u0A96\u0AC2\u0AAC \u0AA8\u0ABE\u0AA8\u0AC1\u0A82: ${o.origin} ${i}${o.minimum.toString()} ${s.unit} \u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F`
              : `\u0A96\u0AC2\u0AAC \u0AA8\u0ABE\u0AA8\u0AC1\u0A82: ${o.origin} ${i}${o.minimum.toString()} \u0AB9\u0ACB\u0AB5\u0AC1\u0A82 \u0A9C\u0ACB\u0A88\u0A8F`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97: "${i.prefix}" \u0AA5\u0AC0 \u0AB6\u0AB0\u0AC2 \u0AA5\u0AB5\u0AC1\u0A82 \u0A9C\u0ACB\u0A88\u0A8F`
              : i.format === "ends_with"
                ? `\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97: "${i.suffix}" \u0AAA\u0AB0 \u0AB8\u0AAE\u0ABE\u0AAA\u0ACD\u0AA4 \u0AA5\u0AB5\u0AC1\u0A82 \u0A9C\u0ACB\u0A88\u0A8F`
                : i.format === "includes"
                  ? `\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97: "${i.includes}" \u0AB6\u0ABE\u0AAE\u0AC7\u0AB2 \u0AB9\u0ACB\u0AB5\u0AC1\u0A82 \u0A9C\u0ACB\u0A88\u0A8F`
                  : i.format === "regex"
                    ? `\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97: \u0AAA\u0AC7\u0A9F\u0AB0\u0ACD\u0AA8 ${i.pattern} \u0AB8\u0ABE\u0AA5\u0AC7 \u0AAE\u0AC7\u0AB3 \u0A96\u0ABE\u0AB5\u0AC1\u0A82 \u0A9C\u0ACB\u0A88\u0A8F`
                    : `\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AA8\u0A82\u0AAC\u0AB0: ${o.divisor} \u0AA8\u0ACB \u0A97\u0AC1\u0AA3\u0ABE\u0A82\u0A95 \u0AB9\u0ACB\u0AB5\u0ACB \u0A9C\u0ACB\u0A88\u0A8F`;
          case "unrecognized_keys":
            return `\u0A93\u0AB3\u0A96\u0AC0 \u0AB6\u0A95\u0ABE\u0AA4\u0ABE \u0AA8\u0AB9\u0AC0\u0A82 \u0AA4\u0AC7 \u0A95\u0AC0${o.keys.length > 1 ? "\u0A93" : ""}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `${o.origin} \u0AAE\u0ABE\u0A82 \u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0A95\u0AC0`;
          case "invalid_union":
            return o.options && Array.isArray(o.options) && o.options.length > 0
              ? `\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AA1\u0ABF\u0AB8\u0ACD\u0A95\u0ACD\u0AB0\u0ABF\u0AAE\u0ABF\u0AA8\u0AC7\u0A9F\u0AB0 \u0AAE\u0AC2\u0AB2\u0ACD\u0AAF. \u0A85\u0AAA\u0AC7\u0A95\u0ACD\u0AB7\u0ABF\u0AA4 ${o.options.map((s) => `'${s}'`).join(" | ")}`
              : "\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0A87\u0AA8\u0AAA\u0AC1\u0A9F";
          case "invalid_element":
            return `${o.origin} \u0AAE\u0ABE\u0A82 \u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AAE\u0AC2\u0AB2\u0ACD\u0AAF`;
          default:
            return "\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0A87\u0AA8\u0AAA\u0AC1\u0A9F";
        }
      };
    };
  });
function OQ() {
  return { localeError: OZe() };
}
var OZe,
  NQ = g(() => {
    me();
    OZe = () => {
      let t = {
          string: { label: "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA", gender: "f" },
          number: { label: "\u05DE\u05E1\u05E4\u05E8", gender: "m" },
          boolean: {
            label: "\u05E2\u05E8\u05DA \u05D1\u05D5\u05DC\u05D9\u05D0\u05E0\u05D9",
            gender: "m",
          },
          bigint: { label: "BigInt", gender: "m" },
          date: { label: "\u05EA\u05D0\u05E8\u05D9\u05DA", gender: "m" },
          array: { label: "\u05DE\u05E2\u05E8\u05DA", gender: "m" },
          object: { label: "\u05D0\u05D5\u05D1\u05D9\u05D9\u05E7\u05D8", gender: "m" },
          null: { label: "\u05E2\u05E8\u05DA \u05E8\u05D9\u05E7 (null)", gender: "m" },
          undefined: {
            label: "\u05E2\u05E8\u05DA \u05DC\u05D0 \u05DE\u05D5\u05D2\u05D3\u05E8 (undefined)",
            gender: "m",
          },
          symbol: { label: "\u05E1\u05D9\u05DE\u05D1\u05D5\u05DC (Symbol)", gender: "m" },
          function: { label: "\u05E4\u05D5\u05E0\u05E7\u05E6\u05D9\u05D4", gender: "f" },
          map: { label: "\u05DE\u05E4\u05D4 (Map)", gender: "f" },
          set: { label: "\u05E7\u05D1\u05D5\u05E6\u05D4 (Set)", gender: "f" },
          file: { label: "\u05E7\u05D5\u05D1\u05E5", gender: "m" },
          promise: { label: "Promise", gender: "m" },
          NaN: { label: "NaN", gender: "m" },
          unknown: {
            label: "\u05E2\u05E8\u05DA \u05DC\u05D0 \u05D9\u05D3\u05D5\u05E2",
            gender: "m",
          },
          value: { label: "\u05E2\u05E8\u05DA", gender: "m" },
        },
        e = {
          string: {
            unit: "\u05EA\u05D5\u05D5\u05D9\u05DD",
            shortLabel: "\u05E7\u05E6\u05E8",
            longLabel: "\u05D0\u05E8\u05D5\u05DA",
          },
          file: {
            unit: "\u05D1\u05D9\u05D9\u05D8\u05D9\u05DD",
            shortLabel: "\u05E7\u05D8\u05DF",
            longLabel: "\u05D2\u05D3\u05D5\u05DC",
          },
          array: {
            unit: "\u05E4\u05E8\u05D9\u05D8\u05D9\u05DD",
            shortLabel: "\u05E7\u05D8\u05DF",
            longLabel: "\u05D2\u05D3\u05D5\u05DC",
          },
          set: {
            unit: "\u05E4\u05E8\u05D9\u05D8\u05D9\u05DD",
            shortLabel: "\u05E7\u05D8\u05DF",
            longLabel: "\u05D2\u05D3\u05D5\u05DC",
          },
          number: {
            unit: "",
            shortLabel: "\u05E7\u05D8\u05DF",
            longLabel: "\u05D2\u05D3\u05D5\u05DC",
          },
        },
        r = (c) => (c ? t[c] : void 0),
        n = (c) => {
          let u = r(c);
          return u ? u.label : (c ?? t.unknown.label);
        },
        o = (c) => `\u05D4${n(c)}`,
        i = (c) =>
          (r(c)?.gender ?? "m") === "f"
            ? "\u05E6\u05E8\u05D9\u05DB\u05D4 \u05DC\u05D4\u05D9\u05D5\u05EA"
            : "\u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA",
        s = (c) => (c ? (e[c] ?? null) : null),
        a = {
          regex: { label: "\u05E7\u05DC\u05D8", gender: "m" },
          email: {
            label: "\u05DB\u05EA\u05D5\u05D1\u05EA \u05D0\u05D9\u05DE\u05D9\u05D9\u05DC",
            gender: "f",
          },
          url: { label: "\u05DB\u05EA\u05D5\u05D1\u05EA \u05E8\u05E9\u05EA", gender: "f" },
          emoji: { label: "\u05D0\u05D9\u05DE\u05D5\u05D2'\u05D9", gender: "m" },
          uuid: { label: "UUID", gender: "m" },
          uuidv4: { label: "UUIDv4", gender: "m" },
          uuidv6: { label: "UUIDv6", gender: "m" },
          nanoid: { label: "nanoid", gender: "m" },
          guid: { label: "GUID", gender: "m" },
          cuid: { label: "cuid", gender: "m" },
          cuid2: { label: "cuid2", gender: "m" },
          ulid: { label: "ULID", gender: "m" },
          xid: { label: "XID", gender: "m" },
          ksuid: { label: "KSUID", gender: "m" },
          datetime: {
            label: "\u05EA\u05D0\u05E8\u05D9\u05DA \u05D5\u05D6\u05DE\u05DF ISO",
            gender: "m",
          },
          date: { label: "\u05EA\u05D0\u05E8\u05D9\u05DA ISO", gender: "m" },
          time: { label: "\u05D6\u05DE\u05DF ISO", gender: "m" },
          duration: { label: "\u05DE\u05E9\u05DA \u05D6\u05DE\u05DF ISO", gender: "m" },
          ipv4: { label: "\u05DB\u05EA\u05D5\u05D1\u05EA IPv4", gender: "f" },
          ipv6: { label: "\u05DB\u05EA\u05D5\u05D1\u05EA IPv6", gender: "f" },
          mac: { label: "\u05DB\u05EA\u05D5\u05D1\u05EA MAC", gender: "f" },
          cidrv4: { label: "\u05D8\u05D5\u05D5\u05D7 IPv4", gender: "m" },
          cidrv6: { label: "\u05D8\u05D5\u05D5\u05D7 IPv6", gender: "m" },
          base64: {
            label: "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D1\u05D1\u05E1\u05D9\u05E1 64",
            gender: "f",
          },
          base64url: {
            label:
              "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D1\u05D1\u05E1\u05D9\u05E1 64 \u05DC\u05DB\u05EA\u05D5\u05D1\u05D5\u05EA \u05E8\u05E9\u05EA",
            gender: "f",
          },
          json_string: { label: "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA JSON", gender: "f" },
          e164: { label: "\u05DE\u05E1\u05E4\u05E8 E.164", gender: "m" },
          credit_card: {
            label:
              "\u05DE\u05E1\u05E4\u05E8 \u05DB\u05E8\u05D8\u05D9\u05E1 \u05D0\u05E9\u05E8\u05D0\u05D9",
            gender: "m",
          },
          currency_code: { label: "\u05E7\u05D5\u05D3 \u05DE\u05D8\u05D1\u05E2", gender: "m" },
          iban: { label: "IBAN", gender: "m" },
          jwt: { label: "JWT", gender: "m" },
          template_literal: { label: "\u05E7\u05DC\u05D8", gender: "m" },
          ends_with: { label: "\u05E7\u05DC\u05D8", gender: "m" },
          includes: { label: "\u05E7\u05DC\u05D8", gender: "m" },
          lowercase: { label: "\u05E7\u05DC\u05D8", gender: "m" },
          starts_with: { label: "\u05E7\u05DC\u05D8", gender: "m" },
          uppercase: { label: "\u05E7\u05DC\u05D8", gender: "m" },
        },
        l = { nan: "NaN" };
      return (c) => {
        switch (c.code) {
          case "invalid_type": {
            let u = c.expected,
              p = l[u ?? ""] ?? n(u),
              m = K(c.input),
              f = l[m] ?? t[m]?.label ?? m;
            return /^[A-Z]/.test(c.expected)
              ? `\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA instanceof ${c.expected}, \u05D4\u05EA\u05E7\u05D1\u05DC ${f}`
              : `\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA ${p}, \u05D4\u05EA\u05E7\u05D1\u05DC ${f}`;
          }
          case "invalid_value": {
            if (c.values.length === 1)
              return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D4\u05E2\u05E8\u05DA \u05D7\u05D9\u05D9\u05D1 \u05DC\u05D4\u05D9\u05D5\u05EA ${z(c.values[0])}`;
            let u = c.values.map((f) => z(f));
            if (c.values.length === 2)
              return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D4\u05D0\u05E4\u05E9\u05E8\u05D5\u05D9\u05D5\u05EA \u05D4\u05DE\u05EA\u05D0\u05D9\u05DE\u05D5\u05EA \u05D4\u05DF ${u[0]} \u05D0\u05D5 ${u[1]}`;
            let p = u[u.length - 1];
            return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D4\u05D0\u05E4\u05E9\u05E8\u05D5\u05D9\u05D5\u05EA \u05D4\u05DE\u05EA\u05D0\u05D9\u05DE\u05D5\u05EA \u05D4\u05DF ${u.slice(0, -1).join(", ")} \u05D0\u05D5 ${p}`;
          }
          case "too_big": {
            let u = s(c.origin),
              p = o(c.origin ?? "value");
            if (c.origin === "string")
              return `${u?.longLabel ?? "\u05D0\u05E8\u05D5\u05DA"} \u05DE\u05D3\u05D9: ${p} \u05E6\u05E8\u05D9\u05DB\u05D4 \u05DC\u05D4\u05DB\u05D9\u05DC ${c.maximum.toString()} ${u?.unit ?? ""} ${c.inclusive ? "\u05D0\u05D5 \u05E4\u05D7\u05D5\u05EA" : "\u05DC\u05DB\u05DC \u05D4\u05D9\u05D5\u05EA\u05E8"}`.trim();
            if (c.origin === "number") {
              let h = c.inclusive
                ? `\u05E7\u05D8\u05DF \u05D0\u05D5 \u05E9\u05D5\u05D5\u05D4 \u05DC-${c.maximum}`
                : `\u05E7\u05D8\u05DF \u05DE-${c.maximum}`;
              return `\u05D2\u05D3\u05D5\u05DC \u05DE\u05D3\u05D9: ${p} \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA ${h}`;
            }
            if (c.origin === "array" || c.origin === "set") {
              let h =
                  c.origin === "set"
                    ? "\u05E6\u05E8\u05D9\u05DB\u05D4"
                    : "\u05E6\u05E8\u05D9\u05DA",
                v = c.inclusive
                  ? `${c.maximum} ${u?.unit ?? ""} \u05D0\u05D5 \u05E4\u05D7\u05D5\u05EA`
                  : `\u05E4\u05D7\u05D5\u05EA \u05DE-${c.maximum} ${u?.unit ?? ""}`;
              return `\u05D2\u05D3\u05D5\u05DC \u05DE\u05D3\u05D9: ${p} ${h} \u05DC\u05D4\u05DB\u05D9\u05DC ${v}`.trim();
            }
            let m = c.inclusive ? "<=" : "<",
              f = i(c.origin ?? "value");
            return u?.unit
              ? `${u.longLabel} \u05DE\u05D3\u05D9: ${p} ${f} ${m}${c.maximum.toString()} ${u.unit}`
              : `${u?.longLabel ?? "\u05D2\u05D3\u05D5\u05DC"} \u05DE\u05D3\u05D9: ${p} ${f} ${m}${c.maximum.toString()}`;
          }
          case "too_small": {
            let u = s(c.origin),
              p = o(c.origin ?? "value");
            if (c.origin === "string")
              return `${u?.shortLabel ?? "\u05E7\u05E6\u05E8"} \u05DE\u05D3\u05D9: ${p} \u05E6\u05E8\u05D9\u05DB\u05D4 \u05DC\u05D4\u05DB\u05D9\u05DC ${c.minimum.toString()} ${u?.unit ?? ""} ${c.inclusive ? "\u05D0\u05D5 \u05D9\u05D5\u05EA\u05E8" : "\u05DC\u05E4\u05D7\u05D5\u05EA"}`.trim();
            if (c.origin === "number") {
              let h = c.inclusive
                ? `\u05D2\u05D3\u05D5\u05DC \u05D0\u05D5 \u05E9\u05D5\u05D5\u05D4 \u05DC-${c.minimum}`
                : `\u05D2\u05D3\u05D5\u05DC \u05DE-${c.minimum}`;
              return `\u05E7\u05D8\u05DF \u05DE\u05D3\u05D9: ${p} \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA ${h}`;
            }
            if (c.origin === "array" || c.origin === "set") {
              let h =
                c.origin === "set" ? "\u05E6\u05E8\u05D9\u05DB\u05D4" : "\u05E6\u05E8\u05D9\u05DA";
              if (c.minimum === 1 && c.inclusive) {
                let y =
                  (c.origin === "set",
                  "\u05DC\u05E4\u05D7\u05D5\u05EA \u05E4\u05E8\u05D9\u05D8 \u05D0\u05D7\u05D3");
                return `\u05E7\u05D8\u05DF \u05DE\u05D3\u05D9: ${p} ${h} \u05DC\u05D4\u05DB\u05D9\u05DC ${y}`;
              }
              let v = c.inclusive
                ? `${c.minimum} ${u?.unit ?? ""} \u05D0\u05D5 \u05D9\u05D5\u05EA\u05E8`
                : `\u05D9\u05D5\u05EA\u05E8 \u05DE-${c.minimum} ${u?.unit ?? ""}`;
              return `\u05E7\u05D8\u05DF \u05DE\u05D3\u05D9: ${p} ${h} \u05DC\u05D4\u05DB\u05D9\u05DC ${v}`.trim();
            }
            let m = c.inclusive ? ">=" : ">",
              f = i(c.origin ?? "value");
            return u?.unit
              ? `${u.shortLabel} \u05DE\u05D3\u05D9: ${p} ${f} ${m}${c.minimum.toString()} ${u.unit}`
              : `${u?.shortLabel ?? "\u05E7\u05D8\u05DF"} \u05DE\u05D3\u05D9: ${p} ${f} ${m}${c.minimum.toString()}`;
          }
          case "invalid_format": {
            let u = c;
            if (u.format === "starts_with")
              return `\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05D4\u05EA\u05D7\u05D9\u05DC \u05D1 "${u.prefix}"`;
            if (u.format === "ends_with")
              return `\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05D4\u05E1\u05EA\u05D9\u05D9\u05DD \u05D1 "${u.suffix}"`;
            if (u.format === "includes")
              return `\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05DB\u05DC\u05D5\u05DC "${u.includes}"`;
            if (u.format === "regex")
              return `\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05D4\u05EA\u05D0\u05D9\u05DD \u05DC\u05EA\u05D1\u05E0\u05D9\u05EA ${u.pattern}`;
            let p = a[u.format],
              m = p?.label ?? u.format,
              h =
                (p?.gender ?? "m") === "f"
                  ? "\u05EA\u05E7\u05D9\u05E0\u05D4"
                  : "\u05EA\u05E7\u05D9\u05DF";
            return `${m} \u05DC\u05D0 ${h}`;
          }
          case "not_multiple_of":
            return `\u05DE\u05E1\u05E4\u05E8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D7\u05D9\u05D9\u05D1 \u05DC\u05D4\u05D9\u05D5\u05EA \u05DE\u05DB\u05E4\u05DC\u05D4 \u05E9\u05DC ${c.divisor}`;
          case "unrecognized_keys":
            return `\u05DE\u05E4\u05EA\u05D7${c.keys.length > 1 ? "\u05D5\u05EA" : ""} \u05DC\u05D0 \u05DE\u05D6\u05D5\u05D4${c.keys.length > 1 ? "\u05D9\u05DD" : "\u05D4"}: ${B(c.keys, ", ")}`;
          case "invalid_key":
            return "\u05E9\u05D3\u05D4 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF \u05D1\u05D0\u05D5\u05D1\u05D9\u05D9\u05E7\u05D8";
          case "invalid_union":
            return "\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF";
          case "invalid_element":
            return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF \u05D1${o(c.origin ?? "array")}`;
          default:
            return "\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF";
        }
      };
    };
  });
function LQ() {
  return { localeError: NZe() };
}
var NZe,
  BQ = g(() => {
    me();
    NZe = () => {
      let t = {
        string: {
          unit: "\u0905\u0915\u094D\u0937\u0930",
          verb: "\u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F",
        },
        file: {
          unit: "\u092C\u093E\u0907\u091F\u094D\u0938",
          verb: "\u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F",
        },
        array: {
          unit: "\u0924\u0924\u094D\u0935",
          verb: "\u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F",
        },
        set: {
          unit: "\u0924\u0924\u094D\u0935",
          verb: "\u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F",
        },
        map: {
          unit: "\u092A\u094D\u0930\u0935\u093F\u0937\u094D\u091F\u093F\u092F\u093E\u0901",
          verb: "\u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F",
        },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "\u0907\u0928\u092A\u0941\u091F",
          email: "\u0908\u092E\u0947\u0932 \u092A\u0924\u093E",
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
          datetime: "ISO \u0924\u093F\u0925\u093F \u0914\u0930 \u0938\u092E\u092F",
          date: "ISO \u0924\u093F\u0925\u093F",
          time: "ISO \u0938\u092E\u092F",
          duration: "ISO \u0905\u0935\u0927\u093F",
          ipv4: "IPv4 \u092A\u0924\u093E",
          ipv6: "IPv6 \u092A\u0924\u093E",
          mac: "MAC \u092A\u0924\u093E",
          cidrv4: "IPv4 \u0936\u094D\u0930\u0947\u0923\u0940",
          cidrv6: "IPv6 \u0936\u094D\u0930\u0947\u0923\u0940",
          base64:
            "Base64-\u090F\u0928\u094D\u0915\u094B\u0921\u0947\u0921 \u0938\u094D\u091F\u094D\u0930\u093F\u0902\u0917",
          base64url:
            "Base64URL-\u090F\u0928\u094D\u0915\u094B\u0921\u0947\u0921 \u0938\u094D\u091F\u094D\u0930\u093F\u0902\u0917",
          json_string: "JSON \u0938\u094D\u091F\u094D\u0930\u093F\u0902\u0917",
          e164: "E.164 \u0938\u0902\u0916\u094D\u092F\u093E",
          credit_card:
            "\u0915\u094D\u0930\u0947\u0921\u093F\u091F \u0915\u093E\u0930\u094D\u0921 \u0938\u0902\u0916\u094D\u092F\u093E",
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
              : `\u0905\u092E\u093E\u0928\u094D\u092F \u0935\u093F\u0915\u0932\u094D\u092A: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 \u092E\u093E\u0928\u094B\u0902 \u092E\u0947\u0902 \u0938\u0947 \u090F\u0915 ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `\u092C\u0939\u0941\u0924 \u092C\u0921\u093C\u093E: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 \u0925\u093E \u0915\u093F ${o.origin ?? "\u092E\u093E\u0928"} \u092E\u0947\u0902 ${i}${o.maximum} ${s.unit} \u0939\u094B\u0902`
              : `\u092C\u0939\u0941\u0924 \u092C\u0921\u093C\u093E: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 \u0925\u093E \u0915\u093F ${o.origin ?? "\u092E\u093E\u0928"} ${i}${o.maximum} \u0939\u094B`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `\u092C\u0939\u0941\u0924 \u091B\u094B\u091F\u093E: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 \u0925\u093E \u0915\u093F ${o.origin} \u092E\u0947\u0902 ${i}${o.minimum} ${s.unit} \u0939\u094B\u0902`
              : `\u092C\u0939\u0941\u0924 \u091B\u094B\u091F\u093E: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 \u0925\u093E \u0915\u093F ${o.origin} ${i}${o.minimum} \u0939\u094B`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u094D\u091F\u094D\u0930\u093F\u0902\u0917: "${i.prefix}" \u0938\u0947 \u0936\u0941\u0930\u0942 \u0939\u094B\u0928\u093E \u091A\u093E\u0939\u093F\u090F`
              : i.format === "ends_with"
                ? `\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u094D\u091F\u094D\u0930\u093F\u0902\u0917: "${i.suffix}" \u092A\u0930 \u0938\u092E\u093E\u092A\u094D\u0924 \u0939\u094B\u0928\u093E \u091A\u093E\u0939\u093F\u090F`
                : i.format === "includes"
                  ? `\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u094D\u091F\u094D\u0930\u093F\u0902\u0917: \u0907\u0938\u092E\u0947\u0902 "${i.includes}" \u0936\u093E\u092E\u093F\u0932 \u0939\u094B\u0928\u093E \u091A\u093E\u0939\u093F\u090F`
                  : i.format === "regex"
                    ? `\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u094D\u091F\u094D\u0930\u093F\u0902\u0917: \u092A\u0948\u091F\u0930\u094D\u0928 ${i.pattern} \u0938\u0947 \u092E\u0947\u0932 \u0916\u093E\u0928\u093E \u091A\u093E\u0939\u093F\u090F`
                    : `\u0905\u092E\u093E\u0928\u094D\u092F ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u0902\u0916\u094D\u092F\u093E: \u092F\u0939 ${o.divisor} \u0915\u093E \u0917\u0941\u0923\u091C \u0939\u094B\u0928\u093E \u091A\u093E\u0939\u093F\u090F`;
          case "unrecognized_keys":
            return `\u0905\u092A\u0930\u093F\u091A\u093F\u0924 \u0915\u0941\u0902\u091C\u0940${o.keys.length > 1 ? "\u092F\u093E\u0901" : ""}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `\u0905\u092E\u093E\u0928\u094D\u092F \u0915\u0941\u0902\u091C\u0940: ${o.origin} \u092E\u0947\u0902`;
          case "invalid_union":
            return o.options && Array.isArray(o.options) && o.options.length > 0
              ? `\u0905\u092E\u093E\u0928\u094D\u092F \u0921\u093F\u0938\u094D\u0915\u094D\u0930\u093F\u092E\u093F\u0928\u0947\u091F\u0930 \u092E\u093E\u0928: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 ${o.options.map((s) => `'${s}'`).join(" | ")}`
              : "\u0905\u092E\u093E\u0928\u094D\u092F \u0907\u0928\u092A\u0941\u091F";
          case "invalid_element":
            return `\u0905\u092E\u093E\u0928\u094D\u092F \u092E\u093E\u0928: ${o.origin} \u092E\u0947\u0902`;
          default:
            return "\u0905\u092E\u093E\u0928\u094D\u092F \u0907\u0928\u092A\u0941\u091F";
        }
      };
    };
  });
