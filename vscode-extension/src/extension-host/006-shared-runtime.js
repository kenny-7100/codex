function Tee() {
  return { localeError: nXe() };
}
var nXe,
  Pee = g(() => {
    me();
    nXe = () => {
      let t = {
        string: { unit: "caracteres" },
        file: { unit: "bytes" },
        array: { unit: "elementos" },
        set: { unit: "elementos" },
        map: { unit: "entradas" },
      };
      function e(s) {
        return t[s] ?? null;
      }
      let r = {
          regex: "a entrada",
          email: "o endere\xE7o de e-mail",
          url: "o URL",
          emoji: "o emoji",
          uuid: "o UUID",
          uuidv4: "o UUIDv4",
          uuidv6: "o UUIDv6",
          nanoid: "o nanoid",
          guid: "o GUID",
          cuid: "o cuid",
          cuid2: "o cuid2",
          ulid: "o ULID",
          xid: "o XID",
          ksuid: "o KSUID",
          datetime: "a data e hora ISO",
          date: "a data ISO",
          time: "a hora ISO",
          duration: "a dura\xE7\xE3o ISO",
          ipv4: "o endere\xE7o IPv4",
          ipv6: "o endere\xE7o IPv6",
          mac: "o endere\xE7o MAC",
          cidrv4: "o intervalo de endere\xE7os IPv4",
          cidrv6: "o intervalo de endere\xE7os IPv6",
          base64: "o texto codificado em base64",
          base64url: "o texto codificado em base64url",
          json_string: "o texto JSON",
          e164: "o n\xFAmero E.164",
          credit_card: "o n\xFAmero de cart\xE3o de cr\xE9dito",
          currency_code: "o c\xF3digo de moeda",
          iban: "o IBAN",
          jwt: "o JWT",
          template_literal: "a entrada",
        },
        n = {
          masculine: { definite: "o", indefinite: "um" },
          feminine: { definite: "a", indefinite: "uma" },
        },
        o = {
          string: { name: "texto", articles: n.masculine },
          number: { name: "n\xFAmero", articles: n.masculine },
          int: { name: "n\xFAmero inteiro", articles: n.masculine },
          boolean: { name: "valor booleano", articles: n.masculine },
          bigint: { name: "n\xFAmero bigint", articles: n.masculine },
          symbol: { name: "s\xEDmbolo", articles: n.masculine },
          undefined: { name: 'valor "undefined"', articles: n.masculine },
          null: { name: 'valor "nulo"', articles: n.masculine },
          never: { name: 'valor "never"', articles: n.masculine },
          void: { name: 'valor "void"', articles: n.masculine },
          date: { name: "data", articles: n.feminine },
          array: { name: "vetor", articles: n.masculine },
          object: { name: "objeto", articles: n.masculine },
          tuple: { name: "tuplo", articles: n.masculine },
          record: { name: "registo", articles: n.masculine },
          map: { name: "mapa", articles: n.masculine },
          set: { name: "conjunto", articles: n.masculine },
          file: { name: "ficheiro", articles: n.masculine },
          nonoptional: { name: "valor n\xE3o opcional", articles: n.masculine },
          nan: { name: 'valor "NaN"', articles: n.masculine },
          function: { name: "fun\xE7\xE3o", articles: n.feminine },
        };
      function i(s, a) {
        let l = o[s] ?? { name: `valor "${s}"`, articles: n.masculine };
        return `${l.articles[a]} ${l.name}`;
      }
      return (s) => {
        switch (s.code) {
          case "invalid_type": {
            let a = i(s.expected, "indefinite"),
              l = K(s.input),
              c = i(l, "indefinite");
            return `Entrada inv\xE1lida: esperava ${a}, recebeu ${c}`;
          }
          case "invalid_value":
            return s.values.length === 1
              ? `Entrada inv\xE1lida: esperava ${z(s.values[0])}`
              : `Op\xE7\xE3o inv\xE1lida: esperava uma das seguintes op\xE7\xF5es: ${B(s.values, "|")}`;
          case "too_big": {
            let a = s.inclusive ? "<=" : "<",
              l = e(s.origin);
            return l
              ? `Demasiado grande: esperava que ${i(s.origin, "definite")} tivesse ${a} ${s.maximum.toString()} ${l.unit ?? "elementos"}`
              : `Demasiado grande: esperava que ${i(s.origin, "definite")} fosse ${a} ${s.maximum.toString()}`;
          }
          case "too_small": {
            let a = s.inclusive ? ">=" : ">",
              l = e(s.origin);
            return l
              ? `Demasiado pequeno: esperava que ${i(s.origin, "definite")} tivesse ${a} ${s.minimum.toString()} ${l.unit ?? "elementos"}`
              : `Demasiado pequeno: esperava que ${i(s.origin, "definite")} fosse ${a} ${s.minimum.toString()}`;
          }
          case "invalid_format": {
            let a = s;
            return a.format === "starts_with"
              ? `Texto inv\xE1lido: deve come\xE7ar por "${a.prefix}"`
              : a.format === "ends_with"
                ? `Texto inv\xE1lido: deve terminar em "${a.suffix}"`
                : a.format === "includes"
                  ? `Texto inv\xE1lido: deve incluir "${a.includes}"`
                  : a.format === "regex"
                    ? `Texto inv\xE1lido: deve corresponder ao padr\xE3o ${a.pattern}`
                    : `Formato d${r[a.format] ?? s.format} inv\xE1lido`;
          }
          case "not_multiple_of":
            return `N\xFAmero inv\xE1lido: deve ser m\xFAltiplo de ${s.divisor}`;
          case "unrecognized_keys": {
            let a = s.keys.length > 1 ? "s" : "";
            return `Chave${a} inv\xE1lida${a}: ${B(s.keys, ", ")}`;
          }
          case "invalid_key":
            return `Entrada inv\xE1lida n${i(s.origin, "definite")}`;
          case "invalid_union":
            return s.options && Array.isArray(s.options) && s.options.length > 0
              ? `Valor de discrimina\xE7\xE3o inv\xE1lido. Esperava ${s.options.map((l) => `'${l}'`).join(" | ")}`
              : "Entrada inv\xE1lida";
          case "invalid_element":
            return `Entrada inv\xE1lida n${i(s.origin, "definite")}`;
          default:
            return "Entrada inv\xE1lida";
        }
      };
    };
  });
function Iee() {
  return { localeError: oXe() };
}
var oXe,
  kee = g(() => {
    me();
    oXe = () => {
      let t = {
        string: { unit: "caracteres" },
        file: { unit: "bytes" },
        array: { unit: "elementos" },
        set: { unit: "elementos" },
        map: { unit: "entradas" },
      };
      function e(s) {
        return t[s] ?? null;
      }
      let r = {
          regex: "a entrada",
          email: "o endere\xE7o de e-mail",
          url: "o URL",
          emoji: "o emoji",
          uuid: "o UUID",
          uuidv4: "o UUIDv4",
          uuidv6: "o UUIDv6",
          nanoid: "o nanoid",
          guid: "o GUID",
          cuid: "o cuid",
          cuid2: "o cuid2",
          ulid: "o ULID",
          xid: "o XID",
          ksuid: "o KSUID",
          datetime: "a data e hora ISO",
          date: "a data ISO",
          time: "a hora ISO",
          duration: "a dura\xE7\xE3o ISO",
          ipv4: "o endere\xE7o IPv4",
          ipv6: "o endere\xE7o IPv6",
          mac: "o endere\xE7o MAC",
          cidrv4: "a faixa de endere\xE7os IPv4",
          cidrv6: "a faixa de endere\xE7os IPv6",
          base64: "o texto codificado em base64",
          base64url: "o texto codificado em base64url",
          json_string: "o texto JSON",
          e164: "o n\xFAmero E.164",
          credit_card: "o n\xFAmero de cart\xE3o de cr\xE9dito",
          currency_code: "o c\xF3digo de moeda",
          iban: "o IBAN",
          jwt: "o JWT",
          template_literal: "a entrada",
        },
        n = {
          masculine: { definite: "o", indefinite: "um" },
          feminine: { definite: "a", indefinite: "uma" },
        },
        o = {
          string: { name: "texto", articles: n.masculine },
          number: { name: "n\xFAmero", articles: n.masculine },
          int: { name: "n\xFAmero inteiro", articles: n.masculine },
          boolean: { name: "valor booleano", articles: n.masculine },
          bigint: { name: "n\xFAmero bigint", articles: n.masculine },
          symbol: { name: "s\xEDmbolo", articles: n.masculine },
          undefined: { name: 'valor "undefined"', articles: n.masculine },
          null: { name: 'valor "nulo"', articles: n.masculine },
          never: { name: 'valor "never"', articles: n.masculine },
          void: { name: 'valor "void"', articles: n.masculine },
          date: { name: "data", articles: n.feminine },
          array: { name: "vetor", articles: n.masculine },
          object: { name: "objeto", articles: n.masculine },
          tuple: { name: "tupla", articles: n.feminine },
          record: { name: "registro", articles: n.masculine },
          map: { name: "mapa", articles: n.masculine },
          set: { name: "conjunto", articles: n.masculine },
          file: { name: "arquivo", articles: n.masculine },
          nonoptional: { name: "valor n\xE3o opcional", articles: n.masculine },
          nan: { name: 'valor "NaN"', articles: n.masculine },
          function: { name: "fun\xE7\xE3o", articles: n.feminine },
        };
      function i(s, a) {
        let l = o[s] ?? { name: `valor "${s}"`, articles: n.masculine };
        return `${l.articles[a]} ${l.name}`;
      }
      return (s) => {
        switch (s.code) {
          case "invalid_type": {
            let a = i(s.expected, "indefinite"),
              l = K(s.input),
              c = i(l, "indefinite");
            return `Entrada inv\xE1lida: esperava ${a}, recebeu ${c}`;
          }
          case "invalid_value":
            return s.values.length === 1
              ? `Entrada inv\xE1lida: esperava ${z(s.values[0])}`
              : `Op\xE7\xE3o inv\xE1lida: esperava uma das seguintes op\xE7\xF5es: ${B(s.values, "|")}`;
          case "too_big": {
            let a = s.inclusive ? "<=" : "<",
              l = e(s.origin);
            return l
              ? `Grande demais: esperava que ${i(s.origin, "definite")} tivesse ${a} ${s.maximum.toString()} ${l.unit ?? "elementos"}`
              : `Grande demais: esperava que ${i(s.origin, "definite")} fosse ${a} ${s.maximum.toString()}`;
          }
          case "too_small": {
            let a = s.inclusive ? ">=" : ">",
              l = e(s.origin);
            return l
              ? `Pequeno demais: esperava que ${i(s.origin, "definite")} tivesse ${a} ${s.minimum.toString()} ${l.unit ?? "elementos"}`
              : `Pequeno demais: esperava que ${i(s.origin, "definite")} fosse ${a} ${s.minimum.toString()}`;
          }
          case "invalid_format": {
            let a = s;
            return a.format === "starts_with"
              ? `Texto inv\xE1lido: deve come\xE7ar com "${a.prefix}"`
              : a.format === "ends_with"
                ? `Texto inv\xE1lido: deve terminar com "${a.suffix}"`
                : a.format === "includes"
                  ? `Texto inv\xE1lido: deve incluir "${a.includes}"`
                  : a.format === "regex"
                    ? `Texto inv\xE1lido: deve corresponder ao padr\xE3o ${a.pattern}`
                    : `Formato d${r[a.format] ?? s.format} inv\xE1lido`;
          }
          case "not_multiple_of":
            return `N\xFAmero inv\xE1lido: deve ser m\xFAltiplo de ${s.divisor}`;
          case "unrecognized_keys": {
            let a = s.keys.length > 1 ? "s" : "";
            return `Chave${a} inv\xE1lida${a}: ${B(s.keys, ", ")}`;
          }
          case "invalid_key":
            return `Entrada inv\xE1lida n${i(s.origin, "definite")}`;
          case "invalid_union":
            return s.options && Array.isArray(s.options) && s.options.length > 0
              ? `Valor de discrimina\xE7\xE3o inv\xE1lido. Esperava ${s.options.map((l) => `'${l}'`).join(" | ")}`
              : "Entrada inv\xE1lida";
          case "invalid_element":
            return `Entrada inv\xE1lida n${i(s.origin, "definite")}`;
          default:
            return "Entrada inv\xE1lida";
        }
      };
    };
  });
function Dee() {
  return { localeError: iXe() };
}
var iXe,
  Mee = g(() => {
    me();
    iXe = () => {
      let t = {
        string: { unit: "caractere", verb: "s\u0103 aib\u0103" },
        file: { unit: "octe\u021Bi", verb: "s\u0103 aib\u0103" },
        array: { unit: "elemente", verb: "s\u0103 aib\u0103" },
        set: { unit: "elemente", verb: "s\u0103 aib\u0103" },
        map: { unit: "intr\u0103ri", verb: "s\u0103 aib\u0103" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "intrare",
          email: "adres\u0103 de email",
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
          datetime: "dat\u0103 \u0219i or\u0103 ISO",
          date: "dat\u0103 ISO",
          time: "or\u0103 ISO",
          duration: "durat\u0103 ISO",
          ipv4: "adres\u0103 IPv4",
          ipv6: "adres\u0103 IPv6",
          mac: "adres\u0103 MAC",
          cidrv4: "interval IPv4",
          cidrv6: "interval IPv6",
          base64: "\u0219ir codat base64",
          base64url: "\u0219ir codat base64url",
          json_string: "\u0219ir JSON",
          e164: "num\u0103r E.164",
          credit_card: "num\u0103r de card de credit",
          currency_code: "cod valutar",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "intrare",
        },
        n = {
          nan: "NaN",
          string: "\u0219ir",
          number: "num\u0103r",
          boolean: "boolean",
          function: "func\u021Bie",
          array: "matrice",
          object: "obiect",
          undefined: "nedefinit",
          symbol: "simbol",
          bigint: "num\u0103r mare",
          void: "void",
          never: "never",
          map: "hart\u0103",
          set: "set",
        };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return `Intrare invalid\u0103: a\u0219teptat ${i}, primit ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `Intrare invalid\u0103: a\u0219teptat ${z(o.values[0])}`
              : `Op\u021Biune invalid\u0103: a\u0219teptat una dintre ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `Prea mare: a\u0219teptat ca ${o.origin ?? "valoarea"} ${s.verb} ${i}${o.maximum.toString()} ${s.unit ?? "elemente"}`
              : `Prea mare: a\u0219teptat ca ${o.origin ?? "valoarea"} s\u0103 fie ${i}${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `Prea mic: a\u0219teptat ca ${o.origin} ${s.verb} ${i}${o.minimum.toString()} ${s.unit}`
              : `Prea mic: a\u0219teptat ca ${o.origin} s\u0103 fie ${i}${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `\u0218ir invalid: trebuie s\u0103 \xEEnceap\u0103 cu "${i.prefix}"`
              : i.format === "ends_with"
                ? `\u0218ir invalid: trebuie s\u0103 se termine cu "${i.suffix}"`
                : i.format === "includes"
                  ? `\u0218ir invalid: trebuie s\u0103 includ\u0103 "${i.includes}"`
                  : i.format === "regex"
                    ? `\u0218ir invalid: trebuie s\u0103 se potriveasc\u0103 cu modelul ${i.pattern}`
                    : `Format invalid: ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `Num\u0103r invalid: trebuie s\u0103 fie multiplu de ${o.divisor}`;
          case "unrecognized_keys":
            return `Chei nerecunoscute: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `Cheie invalid\u0103 \xEEn ${o.origin}`;
          case "invalid_union":
            return "Intrare invalid\u0103";
          case "invalid_element":
            return `Valoare invalid\u0103 \xEEn ${o.origin}`;
          default:
            return "Intrare invalid\u0103";
        }
      };
    };
  });
function Oee(t, e, r, n) {
  let o = Math.abs(t),
    i = o % 10,
    s = o % 100;
  return s >= 11 && s <= 19 ? n : i === 1 ? e : i >= 2 && i <= 4 ? r : n;
}
function Nee() {
  return { localeError: sXe() };
}
var sXe,
  Lee = g(() => {
    me();
    sXe = () => {
      let t = {
        string: {
          unit: {
            one: "\u0441\u0438\u043C\u0432\u043E\u043B",
            few: "\u0441\u0438\u043C\u0432\u043E\u043B\u0430",
            many: "\u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
          },
          verb: "\u0438\u043C\u0435\u0442\u044C",
        },
        file: {
          unit: {
            one: "\u0431\u0430\u0439\u0442",
            few: "\u0431\u0430\u0439\u0442\u0430",
            many: "\u0431\u0430\u0439\u0442",
          },
          verb: "\u0438\u043C\u0435\u0442\u044C",
        },
        array: {
          unit: {
            one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
            few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
            many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432",
          },
          verb: "\u0438\u043C\u0435\u0442\u044C",
        },
        set: {
          unit: {
            one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
            few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
            many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432",
          },
          verb: "\u0438\u043C\u0435\u0442\u044C",
        },
        map: {
          unit: {
            one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
            few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
            many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432",
          },
          verb: "\u0438\u043C\u0435\u0442\u044C",
        },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "\u0432\u0432\u043E\u0434",
          email: "email \u0430\u0434\u0440\u0435\u0441",
          url: "URL",
          emoji: "\u044D\u043C\u043E\u0434\u0437\u0438",
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
          datetime: "ISO \u0434\u0430\u0442\u0430 \u0438 \u0432\u0440\u0435\u043C\u044F",
          date: "ISO \u0434\u0430\u0442\u0430",
          time: "ISO \u0432\u0440\u0435\u043C\u044F",
          duration: "ISO \u0434\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C",
          ipv4: "IPv4 \u0430\u0434\u0440\u0435\u0441",
          ipv6: "IPv6 \u0430\u0434\u0440\u0435\u0441",
          mac: "MAC \u0430\u0434\u0440\u0435\u0441",
          cidrv4: "IPv4 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D",
          cidrv6: "IPv6 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D",
          base64:
            "\u0441\u0442\u0440\u043E\u043A\u0430 \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 base64",
          base64url:
            "\u0441\u0442\u0440\u043E\u043A\u0430 \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 base64url",
          json_string: "JSON \u0441\u0442\u0440\u043E\u043A\u0430",
          e164: "\u043D\u043E\u043C\u0435\u0440 E.164",
          credit_card:
            "\u043D\u043E\u043C\u0435\u0440 \u043A\u0440\u0435\u0434\u0438\u0442\u043D\u043E\u0439 \u043A\u0430\u0440\u0442\u044B",
          currency_code: "\u043A\u043E\u0434 \u0432\u0430\u043B\u044E\u0442\u044B",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "\u0432\u0432\u043E\u0434",
        },
        n = {
          nan: "NaN",
          number: "\u0447\u0438\u0441\u043B\u043E",
          array: "\u043C\u0430\u0441\u0441\u0438\u0432",
        };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0432\u043E\u0434: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C instanceof ${o.expected}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E ${a}`
              : `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0432\u043E\u0434: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C ${i}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0432\u043E\u0434: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C ${z(o.values[0])}`
              : `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0434\u043D\u043E \u0438\u0437 ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            if (s) {
              let a = Number(o.maximum),
                l = Oee(a, s.unit.one, s.unit.few, s.unit.many);
              return `\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C, \u0447\u0442\u043E ${o.origin ?? "\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435"} \u0431\u0443\u0434\u0435\u0442 \u0438\u043C\u0435\u0442\u044C ${i}${o.maximum.toString()} ${l}`;
            }
            return `\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C, \u0447\u0442\u043E ${o.origin ?? "\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435"} \u0431\u0443\u0434\u0435\u0442 ${i}${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            if (s) {
              let a = Number(o.minimum),
                l = Oee(a, s.unit.one, s.unit.few, s.unit.many);
              return `\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u0430\u043B\u0435\u043D\u044C\u043A\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C, \u0447\u0442\u043E ${o.origin} \u0431\u0443\u0434\u0435\u0442 \u0438\u043C\u0435\u0442\u044C ${i}${o.minimum.toString()} ${l}`;
            }
            return `\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u0430\u043B\u0435\u043D\u044C\u043A\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C, \u0447\u0442\u043E ${o.origin} \u0431\u0443\u0434\u0435\u0442 ${i}${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430: \u0434\u043E\u043B\u0436\u043D\u0430 \u043D\u0430\u0447\u0438\u043D\u0430\u0442\u044C\u0441\u044F \u0441 "${i.prefix}"`
              : i.format === "ends_with"
                ? `\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430: \u0434\u043E\u043B\u0436\u043D\u0430 \u0437\u0430\u043A\u0430\u043D\u0447\u0438\u0432\u0430\u0442\u044C\u0441\u044F \u043D\u0430 "${i.suffix}"`
                : i.format === "includes"
                  ? `\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430: \u0434\u043E\u043B\u0436\u043D\u0430 \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C "${i.includes}"`
                  : i.format === "regex"
                    ? `\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430: \u0434\u043E\u043B\u0436\u043D\u0430 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u0448\u0430\u0431\u043B\u043E\u043D\u0443 ${i.pattern}`
                    : `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `\u041D\u0435\u0432\u0435\u0440\u043D\u043E\u0435 \u0447\u0438\u0441\u043B\u043E: \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u043A\u0440\u0430\u0442\u043D\u044B\u043C ${o.divisor}`;
          case "unrecognized_keys":
            return `\u041D\u0435\u0440\u0430\u0441\u043F\u043E\u0437\u043D\u0430\u043D\u043D${o.keys.length > 1 ? "\u044B\u0435" : "\u044B\u0439"} \u043A\u043B\u044E\u0447${o.keys.length > 1 ? "\u0438" : ""}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043A\u043B\u044E\u0447 \u0432 ${o.origin}`;
          case "invalid_union":
            return "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0432\u0445\u043E\u0434\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435";
          case "invalid_element":
            return `\u041D\u0435\u0432\u0435\u0440\u043D\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0432 ${o.origin}`;
          default:
            return "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0432\u0445\u043E\u0434\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435";
        }
      };
    };
  });
function Bee() {
  return { localeError: aXe() };
}
var aXe,
  Fee = g(() => {
    me();
    aXe = () => {
      let t = {
        string: { unit: "znakov", verb: "ma\u0165" },
        file: { unit: "bajtov", verb: "ma\u0165" },
        array: { unit: "prvkov", verb: "ma\u0165" },
        set: { unit: "prvkov", verb: "ma\u0165" },
        map: { unit: "polo\u017Eiek", verb: "ma\u0165" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "regul\xE1rny v\xFDraz",
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
          datetime: "d\xE1tum a \u010Das vo form\xE1te ISO",
          date: "d\xE1tum vo form\xE1te ISO",
          time: "\u010Das vo form\xE1te ISO",
          duration: "doba trvania ISO",
          ipv4: "IPv4 adresa",
          ipv6: "IPv6 adresa",
          mac: "MAC adresa",
          cidrv4: "rozsah IPv4",
          cidrv6: "rozsah IPv6",
          base64: "re\u0165azec zak\xF3dovan\xFD vo form\xE1te base64",
          base64url: "re\u0165azec zak\xF3dovan\xFD vo form\xE1te base64url",
          json_string: "re\u0165azec vo form\xE1te JSON",
          e164: "\u010D\xEDslo E.164",
          credit_card: "\u010D\xEDslo kreditnej karty",
          currency_code: "k\xF3d meny",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "vstup",
        },
        n = {
          nan: "NaN",
          number: "\u010D\xEDslo",
          string: "re\u0165azec",
          function: "funkcia",
          array: "pole",
        };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `Neplatn\xFD vstup: o\u010Dak\xE1van\xE9 instanceof ${o.expected}, obdr\u017Ean\xE9 ${a}`
              : `Neplatn\xFD vstup: o\u010Dak\xE1van\xE9 ${i}, obdr\u017Ean\xE9 ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `Neplatn\xFD vstup: o\u010Dak\xE1van\xE9 ${z(o.values[0])}`
              : `Neplatn\xFD vstup: o\u010Dak\xE1van\xE1 jedna z hodn\xF4t ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `Hodnota je pr\xEDli\u0161 ve\u013Ek\xE1: ${o.origin ?? "hodnota"} mus\xED ma\u0165 ${i}${o.maximum.toString()} ${s.unit ?? "prvkov"}`
              : `Hodnota je pr\xEDli\u0161 ve\u013Ek\xE1: ${o.origin ?? "hodnota"} mus\xED by\u0165 ${i}${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `Hodnota je pr\xEDli\u0161 mal\xE1: ${o.origin ?? "hodnota"} mus\xED ma\u0165 ${i}${o.minimum.toString()} ${s.unit ?? "prvkov"}`
              : `Hodnota je pr\xEDli\u0161 mal\xE1: ${o.origin ?? "hodnota"} mus\xED by\u0165 ${i}${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `Neplatn\xFD re\u0165azec: mus\xED za\u010D\xEDna\u0165 na "${i.prefix}"`
              : i.format === "ends_with"
                ? `Neplatn\xFD re\u0165azec: mus\xED kon\u010Di\u0165 na "${i.suffix}"`
                : i.format === "includes"
                  ? `Neplatn\xFD re\u0165azec: mus\xED obsahova\u0165 "${i.includes}"`
                  : i.format === "regex"
                    ? `Neplatn\xFD re\u0165azec: mus\xED zodpoveda\u0165 vzoru ${i.pattern}`
                    : `Neplatn\xFD form\xE1t ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `Neplatn\xE9 \u010D\xEDslo: mus\xED by\u0165 n\xE1sobkom ${o.divisor}`;
          case "unrecognized_keys":
            return `Nezn\xE1me kl\xFA\u010De: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `Neplatn\xFD kl\xFA\u010D v ${o.origin}`;
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
function $ee() {
  return { localeError: lXe() };
}
var lXe,
  Uee = g(() => {
    me();
    lXe = () => {
      let t = {
        string: { unit: "znakov", verb: "imeti" },
        file: { unit: "bajtov", verb: "imeti" },
        array: { unit: "elementov", verb: "imeti" },
        set: { unit: "elementov", verb: "imeti" },
        map: { unit: "elementov", verb: "imeti" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "vnos",
          email: "e-po\u0161tni naslov",
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
          datetime: "ISO datum in \u010Das",
          date: "ISO datum",
          time: "ISO \u010Das",
          duration: "ISO trajanje",
          ipv4: "IPv4 naslov",
          ipv6: "IPv6 naslov",
          mac: "MAC naslov",
          cidrv4: "obseg IPv4",
          cidrv6: "obseg IPv6",
          base64: "base64 kodiran niz",
          base64url: "base64url kodiran niz",
          json_string: "JSON niz",
          e164: "E.164 \u0161tevilka",
          credit_card: "\u0161tevilka kreditne kartice",
          currency_code: "koda valute",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "vnos",
        },
        n = { nan: "NaN", number: "\u0161tevilo", array: "tabela" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `Neveljaven vnos: pri\u010Dakovano instanceof ${o.expected}, prejeto ${a}`
              : `Neveljaven vnos: pri\u010Dakovano ${i}, prejeto ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `Neveljaven vnos: pri\u010Dakovano ${z(o.values[0])}`
              : `Neveljavna mo\u017Enost: pri\u010Dakovano eno izmed ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `Preveliko: pri\u010Dakovano, da bo ${o.origin ?? "vrednost"} imelo ${i}${o.maximum.toString()} ${s.unit ?? "elementov"}`
              : `Preveliko: pri\u010Dakovano, da bo ${o.origin ?? "vrednost"} ${i}${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `Premajhno: pri\u010Dakovano, da bo ${o.origin} imelo ${i}${o.minimum.toString()} ${s.unit}`
              : `Premajhno: pri\u010Dakovano, da bo ${o.origin} ${i}${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `Neveljaven niz: mora se za\u010Deti z "${i.prefix}"`
              : i.format === "ends_with"
                ? `Neveljaven niz: mora se kon\u010Dati z "${i.suffix}"`
                : i.format === "includes"
                  ? `Neveljaven niz: mora vsebovati "${i.includes}"`
                  : i.format === "regex"
                    ? `Neveljaven niz: mora ustrezati vzorcu ${i.pattern}`
                    : `Neveljaven ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `Neveljavno \u0161tevilo: mora biti ve\u010Dkratnik ${o.divisor}`;
          case "unrecognized_keys":
            return `Neprepoznan${o.keys.length > 1 ? "i klju\u010Di" : " klju\u010D"}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `Neveljaven klju\u010D v ${o.origin}`;
          case "invalid_union":
            return "Neveljaven vnos";
          case "invalid_element":
            return `Neveljavna vrednost v ${o.origin}`;
          default:
            return "Neveljaven vnos";
        }
      };
    };
  });
function qee() {
  return { localeError: cXe() };
}
var cXe,
  Gee = g(() => {
    me();
    cXe = () => {
      let t = {
        string: { unit: "tecken", verb: "att ha" },
        file: { unit: "bytes", verb: "att ha" },
        array: { unit: "objekt", verb: "att inneh\xE5lla" },
        set: { unit: "objekt", verb: "att inneh\xE5lla" },
        map: { unit: "objekt", verb: "att inneh\xE5lla" },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "regulj\xE4rt uttryck",
          email: "e-postadress",
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
          datetime: "ISO-datum och tid",
          date: "ISO-datum",
          time: "ISO-tid",
          duration: "ISO-varaktighet",
          ipv4: "IPv4-adress",
          ipv6: "IPv6-adress",
          mac: "MAC-adress",
          cidrv4: "IPv4-spektrum",
          cidrv6: "IPv6-spektrum",
          base64: "base64-kodad str\xE4ng",
          base64url: "base64url-kodad str\xE4ng",
          json_string: "JSON-str\xE4ng",
          e164: "E.164-nummer",
          credit_card: "kreditkortsnummer",
          currency_code: "valutakod",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "mall-literal",
        },
        n = { nan: "NaN", number: "antal", array: "lista" };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `Ogiltig inmatning: f\xF6rv\xE4ntat instanceof ${o.expected}, fick ${a}`
              : `Ogiltig inmatning: f\xF6rv\xE4ntat ${i}, fick ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `Ogiltig inmatning: f\xF6rv\xE4ntat ${z(o.values[0])}`
              : `Ogiltigt val: f\xF6rv\xE4ntade en av ${B(o.values, "|")}`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `F\xF6r stor(t): f\xF6rv\xE4ntade ${o.origin ?? "v\xE4rdet"} att ha ${i}${o.maximum.toString()} ${s.unit ?? "element"}`
              : `F\xF6r stor(t): f\xF6rv\xE4ntat ${o.origin ?? "v\xE4rdet"} att ha ${i}${o.maximum.toString()}`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `F\xF6r lite(t): f\xF6rv\xE4ntade ${o.origin ?? "v\xE4rdet"} att ha ${i}${o.minimum.toString()} ${s.unit}`
              : `F\xF6r lite(t): f\xF6rv\xE4ntade ${o.origin ?? "v\xE4rdet"} att ha ${i}${o.minimum.toString()}`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `Ogiltig str\xE4ng: m\xE5ste b\xF6rja med "${i.prefix}"`
              : i.format === "ends_with"
                ? `Ogiltig str\xE4ng: m\xE5ste sluta med "${i.suffix}"`
                : i.format === "includes"
                  ? `Ogiltig str\xE4ng: m\xE5ste inneh\xE5lla "${i.includes}"`
                  : i.format === "regex"
                    ? `Ogiltig str\xE4ng: m\xE5ste matcha m\xF6nstret "${i.pattern}"`
                    : `Ogiltig(t) ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `Ogiltigt tal: m\xE5ste vara en multipel av ${o.divisor}`;
          case "unrecognized_keys":
            return `${o.keys.length > 1 ? "Ok\xE4nda nycklar" : "Ok\xE4nd nyckel"}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `Ogiltig nyckel i ${o.origin ?? "v\xE4rdet"}`;
          case "invalid_union":
            return "Ogiltig input";
          case "invalid_element":
            return `Ogiltigt v\xE4rde i ${o.origin ?? "v\xE4rdet"}`;
          default:
            return "Ogiltig input";
        }
      };
    };
  });
function Wee() {
  return { localeError: uXe() };
}
var uXe,
  Hee = g(() => {
    me();
    uXe = () => {
      let t = {
        string: {
          unit: "\u0B8E\u0BB4\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BCD\u0B95\u0BB3\u0BCD",
          verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD",
        },
        file: {
          unit: "\u0BAA\u0BC8\u0B9F\u0BCD\u0B9F\u0BC1\u0B95\u0BB3\u0BCD",
          verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD",
        },
        array: {
          unit: "\u0B89\u0BB1\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD",
          verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD",
        },
        set: {
          unit: "\u0B89\u0BB1\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD",
          verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD",
        },
        map: {
          unit: "\u0B89\u0BB1\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD",
          verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD",
        },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "\u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1",
          email:
            "\u0BAE\u0BBF\u0BA9\u0BCD\u0BA9\u0B9E\u0BCD\u0B9A\u0BB2\u0BCD \u0BAE\u0BC1\u0B95\u0BB5\u0BB0\u0BBF",
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
          datetime: "ISO \u0BA4\u0BC7\u0BA4\u0BBF \u0BA8\u0BC7\u0BB0\u0BAE\u0BCD",
          date: "ISO \u0BA4\u0BC7\u0BA4\u0BBF",
          time: "ISO \u0BA8\u0BC7\u0BB0\u0BAE\u0BCD",
          duration: "ISO \u0B95\u0BBE\u0BB2 \u0B85\u0BB3\u0BB5\u0BC1",
          ipv4: "IPv4 \u0BAE\u0BC1\u0B95\u0BB5\u0BB0\u0BBF",
          ipv6: "IPv6 \u0BAE\u0BC1\u0B95\u0BB5\u0BB0\u0BBF",
          mac: "MAC \u0BAE\u0BC1\u0B95\u0BB5\u0BB0\u0BBF",
          cidrv4: "IPv4 \u0BB5\u0BB0\u0BAE\u0BCD\u0BAA\u0BC1",
          cidrv6: "IPv6 \u0BB5\u0BB0\u0BAE\u0BCD\u0BAA\u0BC1",
          base64: "base64-encoded \u0B9A\u0BB0\u0BAE\u0BCD",
          base64url: "base64url-encoded \u0B9A\u0BB0\u0BAE\u0BCD",
          json_string: "JSON \u0B9A\u0BB0\u0BAE\u0BCD",
          e164: "E.164 \u0B8E\u0BA3\u0BCD",
          credit_card: "\u0B95\u0B9F\u0BA9\u0BCD \u0B85\u0B9F\u0BCD\u0B9F\u0BC8 \u0B8E\u0BA3\u0BCD",
          currency_code:
            "\u0BA8\u0BBE\u0BA3\u0BAF\u0B95\u0BCD \u0B95\u0BC1\u0BB1\u0BBF\u0BAF\u0BC0\u0B9F\u0BC1",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "input",
        },
        n = {
          nan: "NaN",
          number: "\u0B8E\u0BA3\u0BCD",
          array: "\u0B85\u0BA3\u0BBF",
          null: "\u0BB5\u0BC6\u0BB1\u0BC1\u0BAE\u0BC8",
        };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return /^[A-Z]/.test(o.expected)
              ? `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 instanceof ${o.expected}, \u0BAA\u0BC6\u0BB1\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${a}`
              : `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${i}, \u0BAA\u0BC6\u0BB1\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${a}`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${z(o.values[0])}`
              : `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0BB5\u0BBF\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BAE\u0BCD: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${B(o.values, "|")} \u0B87\u0BB2\u0BCD \u0B92\u0BA9\u0BCD\u0BB1\u0BC1`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `\u0BAE\u0BBF\u0B95 \u0BAA\u0BC6\u0BB0\u0BBF\u0BAF\u0BA4\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${o.origin ?? "\u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1"} ${i}${o.maximum.toString()} ${s.unit ?? "\u0B89\u0BB1\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD"} \u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`
              : `\u0BAE\u0BBF\u0B95 \u0BAA\u0BC6\u0BB0\u0BBF\u0BAF\u0BA4\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${o.origin ?? "\u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1"} ${i}${o.maximum.toString()} \u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `\u0BAE\u0BBF\u0B95\u0B9A\u0BCD \u0B9A\u0BBF\u0BB1\u0BBF\u0BAF\u0BA4\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${o.origin} ${i}${o.minimum.toString()} ${s.unit} \u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`
              : `\u0BAE\u0BBF\u0B95\u0B9A\u0BCD \u0B9A\u0BBF\u0BB1\u0BBF\u0BAF\u0BA4\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${o.origin} ${i}${o.minimum.toString()} \u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B9A\u0BB0\u0BAE\u0BCD: "${i.prefix}" \u0B87\u0BB2\u0BCD \u0BA4\u0BCA\u0B9F\u0B99\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`
              : i.format === "ends_with"
                ? `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B9A\u0BB0\u0BAE\u0BCD: "${i.suffix}" \u0B87\u0BB2\u0BCD \u0BAE\u0BC1\u0B9F\u0BBF\u0BB5\u0B9F\u0BC8\u0BAF \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`
                : i.format === "includes"
                  ? `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B9A\u0BB0\u0BAE\u0BCD: "${i.includes}" \u0B90 \u0B89\u0BB3\u0BCD\u0BB3\u0B9F\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`
                  : i.format === "regex"
                    ? `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B9A\u0BB0\u0BAE\u0BCD: ${i.pattern} \u0BAE\u0BC1\u0BB1\u0BC8\u0BAA\u0BBE\u0B9F\u0BCD\u0B9F\u0BC1\u0B9F\u0BA9\u0BCD \u0BAA\u0BCA\u0BB0\u0BC1\u0BA8\u0BCD\u0BA4 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`
                    : `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 ${r[i.format] ?? o.format}`;
          }
          case "not_multiple_of":
            return `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B8E\u0BA3\u0BCD: ${o.divisor} \u0B87\u0BA9\u0BCD \u0BAA\u0BB2\u0BAE\u0BBE\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
          case "unrecognized_keys":
            return `\u0B85\u0B9F\u0BC8\u0BAF\u0BBE\u0BB3\u0BAE\u0BCD \u0BA4\u0BC6\u0BB0\u0BBF\u0BAF\u0BBE\u0BA4 \u0BB5\u0BBF\u0B9A\u0BC8${o.keys.length > 1 ? "\u0B95\u0BB3\u0BCD" : ""}: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `${o.origin} \u0B87\u0BB2\u0BCD \u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0BB5\u0BBF\u0B9A\u0BC8`;
          case "invalid_union":
            return "\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1";
          case "invalid_element":
            return `${o.origin} \u0B87\u0BB2\u0BCD \u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1`;
          default:
            return "\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1";
        }
      };
    };
  });
function jee() {
  return { localeError: dXe() };
}
var dXe,
  zee = g(() => {
    me();
    dXe = () => {
      let t = {
        string: {
          unit: "\u0430\u043B\u043E\u043C\u0430\u0442",
          verb: "\u0434\u043E\u0448\u0442\u0430 \u0431\u043E\u0448\u0430\u0434",
        },
        file: {
          unit: "\u0431\u0430\u0439\u0442",
          verb: "\u0434\u043E\u0448\u0442\u0430 \u0431\u043E\u0448\u0430\u0434",
        },
        array: {
          unit: "\u0443\u043D\u0441\u0443\u0440",
          verb: "\u0434\u043E\u0448\u0442\u0430 \u0431\u043E\u0448\u0430\u0434",
        },
        set: {
          unit: "\u0443\u043D\u0441\u0443\u0440",
          verb: "\u0434\u043E\u0448\u0442\u0430 \u0431\u043E\u0448\u0430\u0434",
        },
        map: {
          unit: "\u0441\u0430\u0431\u0442",
          verb: "\u0434\u043E\u0448\u0442\u0430 \u0431\u043E\u0448\u0430\u0434",
        },
      };
      function e(o) {
        return t[o] ?? null;
      }
      let r = {
          regex: "\u0432\u0443\u0440\u0443\u0434",
          email: "\u0441\u0443\u0440\u043E\u0493\u0430\u0438 email",
          url: "URL",
          emoji: "\u044D\u043C\u043E\u04B7\u0438",
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
          datetime: "\u0441\u0430\u043D\u0430\u0432\u0443 \u0432\u0430\u049B\u0442\u0438 ISO",
          date: "\u0441\u0430\u043D\u0430\u0438 ISO",
          time: "\u0432\u0430\u049B\u0442\u0438 ISO",
          duration: "\u0434\u0430\u0432\u043E\u043C\u043D\u043E\u043A\u0438\u0438 ISO",
          ipv4: "\u0441\u0443\u0440\u043E\u0493\u0430\u0438 IPv4",
          ipv6: "\u0441\u0443\u0440\u043E\u0493\u0430\u0438 IPv6",
          mac: "\u0441\u0443\u0440\u043E\u0493\u0430\u0438 MAC",
          cidrv4: "\u043C\u0430\u04B3\u0434\u0443\u0434\u0430\u0438 IPv4",
          cidrv6: "\u043C\u0430\u04B3\u0434\u0443\u0434\u0430\u0438 IPv6",
          base64:
            "\u0441\u0430\u0442\u0440\u0438 \u0434\u0430\u0440 \u0444\u043E\u0440\u043C\u0430\u0442\u0438 base64",
          base64url:
            "\u0441\u0430\u0442\u0440\u0438 \u0434\u0430\u0440 \u0444\u043E\u0440\u043C\u0430\u0442\u0438 base64url",
          json_string: "\u0441\u0430\u0442\u0440\u0438 JSON",
          e164: "\u0440\u0430\u049B\u0430\u043C\u0438 E.164",
          credit_card:
            "\u0440\u0430\u049B\u0430\u043C\u0438 \u043A\u043E\u0440\u0442\u0438 \u043A\u0440\u0435\u0434\u0438\u0442\u04E3",
          currency_code: "\u0440\u0430\u043C\u0437\u0438 \u0430\u0441\u044A\u043E\u0440",
          iban: "IBAN",
          jwt: "JWT",
          template_literal: "\u0432\u0443\u0440\u0443\u0434",
        },
        n = {
          nan: "NaN",
          number: "\u0440\u0430\u049B\u0430\u043C",
          string: "\u0441\u0430\u0442\u0440",
          array: "\u043C\u0430\u0441\u0441\u0438\u0432",
          object: "\u043E\u0431\u044A\u0435\u043A\u0442",
          date: "\u0441\u0430\u043D\u0430",
        };
      return (o) => {
        switch (o.code) {
          case "invalid_type": {
            let i = n[o.expected] ?? o.expected,
              s = K(o.input),
              a = n[s] ?? s;
            return `\u0412\u0443\u0440\u0443\u0434\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442: ${i} \u0438\u043D\u0442\u0438\u0437\u043E\u0440 \u043C\u0435\u0440\u0430\u0444\u0442, ${a} \u0433\u0438\u0440\u0438\u0444\u0442\u0430 \u0448\u0443\u0434`;
          }
          case "invalid_value":
            return o.values.length === 1
              ? `\u0412\u0443\u0440\u0443\u0434\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442: ${z(o.values[0])} \u0438\u043D\u0442\u0438\u0437\u043E\u0440 \u043C\u0435\u0440\u0430\u0444\u0442`
              : `\u0418\u043D\u0442\u0438\u0445\u043E\u0431\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442: \u044F\u043A\u0435 \u0430\u0437 ${B(o.values, "|")} \u0438\u043D\u0442\u0438\u0437\u043E\u0440 \u043C\u0435\u0440\u0430\u0444\u0442`;
          case "too_big": {
            let i = o.inclusive ? "<=" : "<",
              s = e(o.origin);
            return s
              ? `\u0425\u0435\u043B\u0435 \u043A\u0430\u043B\u043E\u043D: ${o.origin ?? "\u049B\u0438\u043C\u0430\u0442"} \u0431\u043E\u044F\u0434 ${i}${o.maximum.toString()} ${s.unit} ${s.verb}`
              : `\u0425\u0435\u043B\u0435 \u043A\u0430\u043B\u043E\u043D: ${o.origin ?? "\u049B\u0438\u043C\u0430\u0442"} \u0431\u043E\u044F\u0434 ${i}${o.maximum.toString()} \u0431\u043E\u0448\u0430\u0434`;
          }
          case "too_small": {
            let i = o.inclusive ? ">=" : ">",
              s = e(o.origin);
            return s
              ? `\u0425\u0435\u043B\u0435 \u0445\u0443\u0440\u0434: ${o.origin} \u0431\u043E\u044F\u0434 ${i}${o.minimum.toString()} ${s.unit} ${s.verb}`
              : `\u0425\u0435\u043B\u0435 \u0445\u0443\u0440\u0434: ${o.origin} \u0431\u043E\u044F\u0434 ${i}${o.minimum.toString()} \u0431\u043E\u0448\u0430\u0434`;
          }
          case "invalid_format": {
            let i = o;
            return i.format === "starts_with"
              ? `\u0421\u0430\u0442\u0440\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442: \u0431\u043E\u044F\u0434 \u0431\u043E "${i.prefix}" \u043E\u0493\u043E\u0437 \u0448\u0430\u0432\u0430\u0434`
              : i.format === "ends_with"
                ? `\u0421\u0430\u0442\u0440\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442: \u0431\u043E\u044F\u0434 \u0431\u043E "${i.suffix}" \u0430\u043D\u04B7\u043E\u043C \u0451\u0431\u0430\u0434`
                : i.format === "includes"
                  ? `\u0421\u0430\u0442\u0440\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442: \u0431\u043E\u044F\u0434 "${i.includes}"-\u0440\u043E \u0434\u0430\u0440 \u0431\u0430\u0440 \u0433\u0438\u0440\u0430\u0434`
                  : i.format === "regex"
                    ? `\u0421\u0430\u0442\u0440\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442: \u0431\u043E\u044F\u0434 \u0431\u0430 \u043D\u0430\u043C\u0443\u043D\u0430\u0438 ${i.pattern} \u043C\u0443\u0432\u043E\u0444\u0438\u049B\u0430\u0442 \u043A\u0443\u043D\u0430\u0434`
                    : `${r[i.format] ?? o.format}-\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442`;
          }
          case "not_multiple_of":
            return `\u0420\u0430\u049B\u0430\u043C\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442: \u0431\u043E\u044F\u0434 \u0431\u0430 ${o.divisor} \u0431\u0435 \u0431\u0430\u049B\u0438\u044F \u0442\u0430\u049B\u0441\u0438\u043C \u0448\u0430\u0432\u0430\u0434`;
          case "unrecognized_keys":
            return `\u041A\u0430\u043B\u0438\u0434${o.keys.length > 1 ? "\u04B3\u043E\u0438" : "\u0438"} \u043D\u043E\u043C\u0430\u044A\u043B\u0443\u043C: ${B(o.keys, ", ")}`;
          case "invalid_key":
            return `\u041A\u0430\u043B\u0438\u0434\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442 \u0434\u0430\u0440 ${o.origin}`;
          case "invalid_union":
            return o.options && Array.isArray(o.options) && o.options.length > 0
              ? `\u049A\u0438\u043C\u0430\u0442\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442\u0438 \u0434\u0438\u0441\u043A\u0440\u0438\u043C\u0438\u043D\u0430\u0442\u043E\u0440: ${o.options.map((s) => `'${s}'`).join(" | ")} \u0438\u043D\u0442\u0438\u0437\u043E\u0440 \u043C\u0435\u0440\u0430\u0444\u0442`
              : "\u0412\u0443\u0440\u0443\u0434\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442";
          case "invalid_element":
            return `\u049A\u0438\u043C\u0430\u0442\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442 \u0434\u0430\u0440 ${o.origin}`;
          default:
            return "\u0412\u0443\u0440\u0443\u0434\u0438 \u043D\u043E\u0434\u0443\u0440\u0443\u0441\u0442";
        }
      };
    };
  });
