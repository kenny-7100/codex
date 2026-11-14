var vhe = A((Sdr, yhe) => {
  var Nht = EG();
  function Lht(t) {
    return Nht(t) ? void 0 : t;
  }
  yhe.exports = Lht;
});
var _he = A((wdr, whe) => {
  var bhe = bp(),
    Bht = rw(),
    Fht = Qi(),
    She = bhe ? bhe.isConcatSpreadable : void 0;
  function $ht(t) {
    return Fht(t) || Bht(t) || !!(She && t && t[She]);
  }
  whe.exports = $ht;
});
var Rhe = A((_dr, Ahe) => {
  var Uht = rI(),
    qht = _he();
  function xhe(t, e, r, n, o) {
    var i = -1,
      s = t.length;
    for (r || (r = qht), o || (o = []); ++i < s; ) {
      var a = t[i];
      e > 0 && r(a) ? (e > 1 ? xhe(a, e - 1, r, n, o) : Uht(o, a)) : n || (o[o.length] = a);
    }
    return o;
  }
  Ahe.exports = xhe;
});
var Che = A((xdr, Ehe) => {
  var Ght = Rhe();
  function Wht(t) {
    var e = t == null ? 0 : t.length;
    return e ? Ght(t, 1) : [];
  }
  Ehe.exports = Wht;
});
var GW = A((Adr, The) => {
  var Hht = Che(),
    jht = TG(),
    zht = PG();
  function Vht(t) {
    return zht(jht(t, void 0, Hht), t + "");
  }
  The.exports = Vht;
});
var Ihe = A((Rdr, Phe) => {
  var Kht = rG(),
    Zht = Hq(),
    Xht = oG(),
    Yht = Cp(),
    Jht = wp(),
    Qht = vhe(),
    egt = GW(),
    tgt = Oq(),
    rgt = 1,
    ngt = 2,
    ogt = 4,
    igt = egt(function (t, e) {
      var r = {};
      if (t == null) return r;
      var n = !1;
      ((e = Kht(e, function (i) {
        return ((i = Yht(i, t)), n || (n = i.length > 1), i);
      })),
        Jht(t, tgt(t), r),
        n && (r = Zht(r, rgt | ngt | ogt, Qht)));
      for (var o = e.length; o--; ) Xht(r, e[o]);
      return r;
    });
  Phe.exports = igt;
});
var sgt,
  agt,
  Tdr,
  khe = g(() => {
    "use strict";
    Wp();
    ((sgt = F(Is())), (agt = F(Ihe())));
    $();
    Tdr = d.discriminatedUnion("type", [Gw, Ww, BW, LW]);
  });
var Dhe = g(() => {
  "use strict";
});
var Mhe = g(() => {
  "use strict";
});
var kdr,
  Ddr,
  Ohe = g(() => {
    "use strict";
    $();
    ((kdr = d.object({
      accountUserId: d.string(),
      algorithm: d.literal("ecdsa_p256_sha256"),
      clientId: d.string(),
      keyId: d.string(),
      protectionClass: d.enum([
        "hardware_secure_enclave",
        "hardware_tpm",
        "os_protected_nonextractable",
      ]),
      publicKeySpkiDerBase64: d.string(),
    })),
      (Ddr = d
        .object({
          iat: d.number(),
          pwd_auth_time: d.number(),
          scope: d.string().optional(),
          scp: d.array(d.string()).optional(),
          "https://api.openai.com/auth": d
            .object({
              amr: d.array(d.string()).optional(),
              account_id: d.string().optional(),
              chatgpt_account_user_id: d.string().optional(),
              chatgpt_account_id: d.string().optional(),
              account_user_id: d.string().optional(),
              user_id: d.string().optional(),
            })
            .loose(),
        })
        .loose()));
  });
var Ndr,
  Nhe = g(() => {
    "use strict";
    $();
    Ndr = d.object({
      errorCode: d.enum([
        "remote_control_device_key_tpm_unavailable",
        "remote_control_device_key_tpm_configuration",
        "remote_control_device_key_store_unavailable",
        "remote_control_device_key_unusable",
      ]),
    });
  });
var Lhe = g(() => {
  "use strict";
});
var Bhe = g(() => {
  "use strict";
});
var Fhe = g(() => {
  "use strict";
});
var $he,
  $dr,
  Udr,
  Uhe = g(() => {
    "use strict";
    Ti();
    (($he =
      "^(.*/(?:\\.codex|\\.codex-workspaces(?:/instances/[^/]+)?|OpenAI/Codex/workspaces(?:/instances/[^/]+)?)/worktrees)(?:/|$)"),
      ($dr = new RegExp($he)),
      (Udr = new RegExp($he, "i")));
  });
var qhe = g(() => {
  "use strict";
  Uhe();
});
function H(t) {
  return { type: "ok", value: t };
}
function Hp(t) {
  return { type: "error", error: { message: t instanceof Error ? t.message : String(t) } };
}
var Ghe = g(() => {
  "use strict";
});
var Whe = g(() => {
  "use strict";
});
var Hhe,
  WW,
  jhe = g(() => {
    "use strict";
    $();
    ((Hhe = d
      .object({
        action_url: d
          .string()
          .optional()
          .catch(void 0),
        dismissal_id: d
          .string()
          .optional()
          .catch(void 0),
        app_name: d
          .string()
          .optional()
          .catch(void 0),
        connector_filler_hover_enabled: d
          .boolean()
          .optional()
          .catch(void 0),
        prompt: d
          .string()
          .optional()
          .catch(void 0),
        task_suggestion_prompt_as_tool: d
          .boolean()
          .optional()
          .catch(void 0),
        system_hints: d
          .array(d.string())
          .optional()
          .catch(void 0),
        quick_actions: d
          .array(
            d
              .object({
                label: d
                  .string()
                  .trim()
                  .min(1)
                  .max(20)
                  .regex(/^\S+(?:\s+\S+){0,2}$/),
                prompt: d.string().trim().min(1),
                source_index: d
                  .number()
                  .int()
                  .min(0)
                  .max(1)
                  .optional()
                  .catch(void 0),
              })
              .optional()
              .catch(void 0),
          )
          .max(2)
          .transform((t) => t.filter((e) => e !== void 0))
          .optional()
          .catch(void 0),
        title_links: d
          .array(
            d.object({
              text: d.string(),
              url: d.string(),
              summary: d
                .string()
                .trim()
                .min(1)
                .optional()
                .catch(void 0),
              app_name: d
                .string()
                .optional()
                .catch(void 0),
              icon_paths: d
                .record(d.string(), d.string())
                .optional()
                .catch(void 0),
            }),
          )
          .max(2)
          .optional()
          .catch(void 0),
      })
      .optional()
      .catch(void 0)),
      (WW = d.object({
        action_metadata: Hhe,
        client_dismiss_on_tap: d.boolean().nullish(),
        id: d.uuid(),
        chat_home_unit_id: d.uuid().nullable().optional(),
        producer: d.string().min(1),
        item_type: d.enum([
          "chat_home_curated",
          "chat_home",
          "chat_home_evergreen",
          "chat_home_evergreen_demo",
          "chat_home_trending",
          "chat_home_task_suggestions",
          "chat_home_paas_task_suggestions",
          "chat_home_paas_free_user_suggestions",
          "file_action_suggestion",
          "task_suggestion",
          "proactive_suggestion",
          "connector_suggestion",
          "plugin_activation_suggestion",
          "automation_suggestion",
          "unread_automation",
          "delayed_image_completed_result",
          "promotional",
        ]),
        title: d.string(),
        description: d.string().nullable().optional(),
        short_description: d.string().nullable().optional(),
        icon_paths: d.record(d.string(), d.string()).nullable().optional(),
        emoji: d.string().nullable().optional(),
        logging_metadata: d
          .object({
            app_id: d.string().nullable().optional(),
            suggestion_id: d.string().nullable().optional(),
          })
          .nullable()
          .optional(),
        destination_metadata: d
          .discriminatedUnion("type", [
            d.object({
              type: d.literal("prompt"),
              prompt: d.string(),
              entrypoint: d.enum(["chat", "work"]).nullable().optional(),
              auto_send: d.boolean().optional(),
              auto_send_in_background: d.boolean().optional(),
              show_prompt_on_hover: d.boolean().optional(),
            }),
            d.object({
              type: d.literal("conversation"),
              conversation_id: d.string(),
              continuation: d
                .object({
                  prompt: d.string(),
                  last_message_id: d.string(),
                  conversation_title: d.string(),
                  auto_send: d.boolean().optional(),
                })
                .nullable()
                .optional(),
            }),
            d.object({
              type: d.literal("connector"),
              connector_id: d.string(),
              plugin_id: d.string().nullable().optional(),
            }),
            d.object({ type: d.literal("url") }),
          ])
          .nullable()
          .optional(),
      })));
  });
var zhe = g(() => {
  "use strict";
});
var Ydr,
  HW,
  Jdr,
  Qdr,
  jW = g(() => {
    "use strict";
    $();
    wI();
    ((Ydr = d.strictObject({ conversationId: d.string().nullable(), query: d.string().max(500) })),
      (HW = d.strictObject({
        tabId: d.number().int().positive(),
        turnId: d.string().min(1),
        providerTabId: d.string().min(1),
      })),
      (Jdr = d.strictObject({
        extensionInstanceId: d.string().min(1),
        tabId: d.number().int().nonnegative(),
      })),
      (Qdr = d.strictObject({
        extensionInstanceId: d.string().min(1),
        tabIds: d.array(d.number().int().nonnegative()).max(100),
      })));
  });
var npr,
  Vhe = g(() => {
    "use strict";
    $();
    jW();
    npr = d.discriminatedUnion("backend", [
      HW.omit({ turnId: !0 }).extend({ backend: d.literal("chrome") }),
      d.object({ backend: d.literal("iab"), providerTabId: HW.shape.providerTabId }),
    ]);
  });
var Khe = g(() => {
  "use strict";
});
var Zhe,
  zW = g(() => {
    "use strict";
    $();
    Zhe = d.union([
      d.object({ connectorId: d.string() }),
      d.object({
        hostId: d.string(),
        serverName: d.string(),
        projectConfigScope: d.string().nullable(),
      }),
    ]);
  });
var Xhe,
  Yhe,
  lgt,
  cgt,
  Jhe = g(() => {
    "use strict";
    $();
    zW();
    ((Xhe = ["camera", "microphone", "geolocation", "clipboardWrite"]),
      (Yhe = d.enum([...Xhe, "localNetwork", "loopbackNetwork"])),
      (lgt = d.object({
        partition: d.string(),
        origin: d.url(),
        owners: d.array(d.object({ identity: Zhe, pluginIds: d.array(d.string()) })),
        permissions: d.array(Yhe),
      })),
      (cgt = d.record(d.string(), lgt).catch({})));
  });
var Qhe = g(() => {
  "use strict";
});
var ege = g(() => {
  "use strict";
});
function tge(t) {
  return t !== null && typeof t == "object" && !Array.isArray(t);
}
function rge(t) {
  if (t == null) return null;
  if (!tge(t) || Object.keys(t).length > dgt) throw new zw("invalid-manifest");
  let e = Object.entries(t).map(([r, n]) => {
    if (
      r.length === 0 ||
      [...r].length > 64 ||
      !tge(n) ||
      Object.keys(n).some((i) => i !== "readableSchemas" && i !== "writableSchemas")
    )
      throw new zw("invalid-capabilities");
    let o = [n.readableSchemas, n.writableSchemas];
    for (let i of o)
      if (!Array.isArray(i) || i.length > pgt || i.some((s) => !Number.isSafeInteger(s) || s < 1))
        throw new zw("invalid-schema-list");
    return [
      r,
      { readableSchemas: [...n.readableSchemas], writableSchemas: [...n.writableSchemas] },
    ];
  });
  return Object.fromEntries(e);
}
var ppr,
  mpr,
  ugt,
  zw,
  dgt,
  pgt,
  nge = g(() => {
    ((ppr = Object.freeze(["supported", "unsupported", "unknown"])),
      (mpr = Object.freeze({
        supported: Object.freeze([]),
        unsupported: Object.freeze([
          "invalid-schema-version",
          "schema-not-readable",
          "schema-not-writable",
        ]),
        unknown: Object.freeze([
          "missing-schema-version",
          "missing-manifest",
          "missing-artifact-capabilities",
        ]),
      })),
      (ugt = {
        "invalid-manifest": "Invalid collaboration manifest",
        "invalid-capabilities": "Invalid collaboration capabilities",
        "invalid-schema-list": "Invalid collaboration schema list",
        "invalid-decision": "Invalid schema decision",
        "invalid-compatibility": "Invalid schema compatibility",
      }),
      (zw = class extends TypeError {
        reason;
        constructor(e) {
          (super(ugt[e]), (this.name = "CollaborationSchemaValidationError"), (this.reason = e));
        }
      }),
      (dgt = 32),
      (pgt = 64));
  });
var mgt,
  fgt,
  oge = g(() => {
    "use strict";
    nge();
    $();
    ((mgt = d.object({
      snapshotId: d.string().min(1),
      invocationId: d.string().min(1),
      updateId: d.string().min(1),
      crdtUpdateBase64: d.string(),
      waitForPersistence: d.boolean().optional(),
      clientManifest: d
        .unknown()
        .transform((t) => rge(t) ?? void 0)
        .optional(),
    })),
      (fgt = 64 * 1024 * 1024));
  });
var ige,
  hgt,
  ggt,
  sge = g(() => {
    "use strict";
    ((ige = 30 * 1024 * 1024),
      (hgt = 41 * 1024 * 1024),
      (ggt = 4 * Math.ceil(ige / 3) + 4 * Math.ceil((2 * 1024 * 1024) / 3) + 1024 * 1024));
  });
var age = g(() => {
  "use strict";
});
var lge = g(() => {
  "use strict";
});
var cge = g(() => {
  "use strict";
});
var uge = g(() => {
  "use strict";
});
var pge,
  xpr,
  Vw,
  mge,
  fge,
  dge,
  ygt,
  wk,
  vgt,
  Apr,
  bgt,
  hge = g(() => {
    "use strict";
    $();
    ((pge = "codex-primary-runtime"),
      (xpr = d
        .string()
        .max(64)
        .regex(/^[\dA-Za-z]+(?:[.+-][\dA-Za-z]+)*$/)),
      (Vw = d
        .string()
        .trim()
        .min(1)
        .refine(
          (t) => t !== "." && t !== ".." && !t.includes("/") && !t.includes("\\"),
          "Expected a single path segment.",
        )),
      (mge = d
        .string()
        .trim()
        .regex(/^[a-fA-F0-9]{64}$/)),
      (fge = d
        .string()
        .trim()
        .pipe(d.url())
        .refine((t) => {
          let e = new URL(t);
          return (
            e.origin === "https://chatgpt.com" &&
            e.pathname.startsWith("/codex/app/updates/runtimes/")
          );
        })),
      (dge = d.object({ url: d.string().trim().min(1) })),
      (ygt = d.object({
        digest: mge,
        format: d.string().trim().min(1).optional(),
        hash: d.literal("sha256"),
        internalCdnUrl: fge.optional(),
        path: d.string().trim().min(1).optional(),
        providers: d.tuple([dge]).rest(dge),
        size: d.number().int().positive().optional(),
      })),
      (wk = d.object({
        bundleFormatVersion: d.number().int().optional(),
        bundleVersion: d.string().trim().optional(),
        platforms: d.record(d.string(), ygt),
        runtimeRootDirectoryName: Vw.optional(),
      })),
      (vgt = d.object({
        baseUrl: d.string().trim().min(1).optional(),
        latest: wk.optional(),
        "latest-alpha": wk.optional(),
        versions: d.record(d.string(), wk).optional(),
      })),
      (Apr = d.object({ runtimes: d.record(d.string(), vgt) })),
      (bgt = d.object({
        archiveName: Vw.optional(),
        archiveSha256: mge,
        archiveSizeBytes: d.number().int().positive().optional(),
        archiveUrl: d.string().trim().min(1),
        bundleFormatVersion: d.number().int().optional(),
        bundleVersion: d.string().trim().optional(),
        format: d.string().trim().min(1).optional(),
        generatedDependencies: d.array(d.string()).optional(),
        internalCdnUrl: fge.optional(),
        latestManifestFileName: Vw.optional(),
        latestManifestUrl: d.string().trim().min(1).optional(),
        nodeVersion: d.string().trim().min(1).optional(),
        pythonVersion: d.string().trim().min(1).optional(),
        runtimeRootDirectoryName: Vw.optional(),
        targetArch: d.string().trim().min(1).optional(),
        targetPlatform: d.string().trim().min(1).optional(),
      })));
  });
function bge(t) {
  return new URL(t).origin;
}
function Sge(t) {
  return `codex@${t}`;
}
var _k,
  gge,
  yge,
  vge,
  wge = g(() => {
    "use strict";
    ((_k = "https://6719eaa18601933a26ac21499dcaba2f@o33249.ingest.us.sentry.io/4510999349821440"),
      (gge = "codex-extension-version"),
      (yge = "codex-session-id"),
      (vge = "codex-build-flavor"));
  });
var _ge,
  VW = g(() => {
    "use strict";
    _ge = "default-service-tier";
  });
var Age = A((Tpr, xge) => {
  var Sgt = JI(),
    wgt = "Expected a function";
  function _gt(t, e) {
    var r;
    if (typeof e != "function") throw new TypeError(wgt);
    return (
      (t = Sgt(t)),
      function () {
        return (--t > 0 && (r = e.apply(this, arguments)), t <= 1 && (e = void 0), r);
      }
    );
  }
  xge.exports = _gt;
});
var KW = A((Ppr, Rge) => {
  var xgt = Age();
  function Agt(t) {
    return xgt(2, t);
  }
  Rge.exports = Agt;
});
var Ege,
  Cge = g(() => {
    "use strict";
    mo();
    Or();
    Ege = {
      enabled: it({
        agentAccess: "read-write",
        default: !0,
        description: "Whether home-page ambient suggestions are enabled",
        key: "ambient-suggestions-enabled",
        schema: Be,
      }),
    };
  });
var Kw,
  Tg,
  Rgt,
  ZW = g(() => {
    "use strict";
    $();
    eG();
    vp();
    Iw();
    mo();
    Or();
    ((Kw = { sans: { min: 11, max: 16 }, code: { min: 8, max: 24 } }),
      (Tg = {
        theme: He({
          agentAccess: "read-write",
          default: "system",
          description: "Preferred app appearance mode",
          key: "appearanceTheme",
          schema: d.enum(["system", "light", "dark"]),
        }),
        lightChromeTheme: He({
          agentAccess: "read-write",
          default: void 0,
          description: "Chrome theme used in light mode",
          key: "appearanceLightChromeTheme",
          schema: tW.optional(),
        }),
        darkChromeTheme: He({
          agentAccess: "read-write",
          default: void 0,
          description: "Chrome theme used in dark mode",
          key: "appearanceDarkChromeTheme",
          schema: tW.optional(),
        }),
        lightCodeThemeId: He({
          agentAccess: "read-write",
          default: kt.CODEX,
          description: "Code theme used in light mode",
          key: "appearanceLightCodeThemeId",
          schema: eW,
        }),
        darkCodeThemeId: He({
          agentAccess: "read-write",
          default: kt.CODEX,
          description: "Code theme used in dark mode",
          key: "appearanceDarkCodeThemeId",
          schema: eW,
        }),
        diffMarkerStyle: He({
          agentAccess: "read-write",
          default: "color",
          description: "Diff marker style used in code review surfaces",
          key: "appearanceDiffMarkerStyle",
          schema: d.enum(["color", "symbols"]),
        }),
        sansFontSize: He({
          agentAccess: "read-write",
          default: 14,
          description: "Base UI font size",
          key: "sansFontSize",
          schema: d.number().min(Kw.sans.min).max(Kw.sans.max),
        }),
        codeFontSize: He({
          agentAccess: "read-write",
          default: 12,
          description: "Code font size",
          key: "codeFontSize",
          schema: d.number().min(Kw.code.min).max(Kw.code.max),
        }),
        useOpenAISans: He({
          agentAccess: "hidden",
          default: !0,
          description: "Whether enrolled ChatGPT Web accounts use OpenAI Sans",
          key: "useOpenAISans",
          schema: Be,
        }),
        useFontSmoothing: He({
          agentAccess: "read-write",
          default: !0,
          description: "Whether font smoothing is enabled",
          key: "useFontSmoothing",
          schema: Be,
        }),
        usePointerCursors: He({
          agentAccess: "read-write",
          default: !1,
          description: "Whether interactive controls use pointer cursors",
          key: "usePointerCursors",
          schema: Be,
        }),
        dockIconPreference: it({
          agentAccess: "read-write",
          default: "app-default",
          description: "Preferred macOS Dock icon",
          key: J.DOCK_ICON_PREFERENCE,
          schema: Mle,
        }),
        reducedMotionPreference: it({
          agentAccess: "read-write",
          default: "system",
          description: "Whether Codex reduces interface motion",
          key: "reduced-motion-preference",
          schema: d.enum(["system", "on", "off"]),
        }),
      }),
      (Rgt = {
        light: { chromeThemeSetting: Tg.lightChromeTheme, codeThemeSetting: Tg.lightCodeThemeId },
        dark: { chromeThemeSetting: Tg.darkChromeTheme, codeThemeSetting: Tg.darkCodeThemeId },
      }));
  });
var xk,
  Tge = g(() => {
    "use strict";
    $();
    mo();
    Or();
    xk = {
      alwaysSendToMini: He({
        agentAccess: "read-write",
        default: !1,
        description: "Whether global shortcut appshots prefer Mini when it is visible",
        key: "appshotAlwaysSendToMini",
        schema: Be,
      }),
      destination: He({
        agentAccess: "read-write",
        default: "automatic",
        description: "Where global shortcut appshots are attached",
        key: "appshotDestination",
        schema: d.enum(["automatic", "last-chat", "new-chat"]),
      }),
      soundEnabled: He({
        agentAccess: "read-write",
        default: !0,
        description: "Whether appshots play a sound effect",
        key: "appshotSoundEnabled",
        schema: Be,
      }),
    };
  });
var Pge,
  Ige = g(() => {
    "use strict";
    $();
    vp();
    Or();
    Pge = {
      bookmarksBarVisibility: Ee({
        agentAccess: "hidden",
        default: "new-tab",
        description: "When the in-app browser bookmarks bar is visible",
        key: "browser-bookmarks-bar-visibility",
        schema: d.enum(["never", "always", "new-tab"]),
      }),
      annotationMarkersVisible: Ee({
        agentAccess: "hidden",
        default: !0,
        description: "Whether saved annotations show markers on browser pages",
        key: "browser-annotation-markers-visible",
        schema: d.boolean(),
      }),
      extensionsToolbarVisible: Ee({
        agentAccess: "hidden",
        default: !0,
        description: "Whether the extensions puzzle button is pinned to the browser toolbar",
        key: "browser-extensions-toolbar-visible",
        schema: d.boolean(),
      }),
      showDeviceToolbarInNewTabs: Ee({
        agentAccess: "hidden",
        default: !1,
        description: "Whether new browser tabs show the device toolbar",
        key: "browser-show-device-toolbar-in-new-tabs",
        schema: d.boolean(),
      }),
      showFullUrl: Ee({
        agentAccess: "hidden",
        default: !1,
        description: "Whether the in-app browser address bar shows the full URL",
        key: "browser-show-full-url",
        schema: d.boolean(),
      }),
      annotationScreenshotsMode: it({
        agentAccess: "read-write",
        default: uq,
        description: "When browser annotation screenshots are included",
        key: "browser-annotation-screenshots-mode",
        schema: d.enum(["always", "necessary"]),
      }),
      disabledSiteAnnotationHostnames: Ee({
        agentAccess: "hidden",
        default: [],
        description: "Hostnames where custom site annotation features are disabled",
        key: "browser-disabled-site-annotation-hostnames",
        schema: d.array(d.string()),
      }),
      siteAnnotationPermissionAnsweredHostnames: Ee({
        agentAccess: "hidden",
        default: [],
        description: "Hostnames whose site annotation permission prompt the user answered",
        key: "browser-site-annotation-permission-answered-hostnames",
        schema: d.array(d.string()),
      }),
      debugChromePagesEnabled: it({
        agentAccess: "hidden",
        default: !1,
        description: "Whether Browser Use may open trusted chrome:// diagnostic pages",
        key: J.DEBUG_CHROME_PAGES_ENABLED,
        schema: d.boolean(),
      }),
      downloadDirectory: it({
        agentAccess: "hidden",
        default: null,
        description: "Folder where files downloaded by the in-app browser are saved",
        key: J.BROWSER_DOWNLOAD_DIRECTORY,
        schema: d.string().nullable(),
      }),
      promptForDownloadLocation: it({
        agentAccess: "hidden",
        default: !1,
        description: "Whether manual browser downloads ask where to save each file",
        key: J.BROWSER_DOWNLOAD_PROMPT_ENABLED,
        schema: d.boolean(),
      }),
    };
  });
function kge() {
  return (
    (XW = XW ?? {
      gitHostingProvider: Ee({
        agentAccess: "hidden",
        default: "github",
        description: "Selected code hosting provider for Code Review",
        key: "code-review-git-hosting-provider",
        schema: Tgt,
      }),
      gitlabConnectorId: Ee({
        agentAccess: "hidden",
        default: null,
        description: "GitLab connection used by Code Review; unset uses gitlab.com",
        key: "code-review-gitlab-connector-id",
        schema: d.string().trim().min(1).nullable(),
      }),
      githubConnection: Ee({
        agentAccess: "hidden",
        default: null,
        description: "GitHub connection used by Code Review; unset uses github.com",
        key: "code-review-github-connection",
        schema: Cgt,
      }),
      sidebarSections: Ee({
        agentAccess: "hidden",
        default: ["waiting_for_review", "needs_my_review", "needs_my_teams_review"],
        description: "Visible sections in the Code Review sidebar",
        key: "code-review-sidebar-sections",
        schema: Pgt,
      }),
      sidebarLayout: Ee({
        agentAccess: "hidden",
        default: "detailed",
        description: "Layout of pull requests in the Code Review sidebar",
        key: "code-review-sidebar-layout",
        schema: d.enum(["compact", "detailed"]),
      }),
      githubLinkTarget: Ee({
        agentAccess: "hidden",
        default: "github",
        description: "Where pull request and merge request links open",
        key: "code-review-github-link-target",
        schema: d.enum(["code-review-tab", "github"]),
      }),
      localReviewInstructions: Ee({
        agentAccess: "read-only",
        default: "",
        description: "Personal instructions for private code reviews you start",
        key: "code-review-local-instructions",
        schema: d.string(),
      }),
    }),
    XW
  );
}
var XW,
  Egt,
  Cgt,
  Tgt,
  Pgt,
  Dge = g(() => {
    "use strict";
    $();
    Or();
    ((Egt = d.object({
      hostname: d.string().min(1),
      connectorId: d.string().min(1),
      accountLinkId: d.string().min(1),
    })),
      (Cgt = Egt.nullable()),
      (Tgt = d.enum(["github", "gitlab"])),
      (Pgt = d.array(
        d.enum([
          "waiting_for_review",
          "needs_my_review",
          "needs_my_teams_review",
          "merged",
          "recents",
        ]),
      )));
  });
var Mge,
  Oge = g(() => {
    "use strict";
    $();
    bq();
    Or();
    Mge = {
      agentSource: it({
        agentAccess: "hidden",
        default: Xne,
        description: "Task source for Codex Micro agent keys",
        key: "codex-micro-agent-source",
        schema: Vne,
      }),
      singleTapAgentKeys: Ee({
        agentAccess: "hidden",
        default: !1,
        description: "Whether Codex Micro agent keys open assigned conversations with a single tap",
        key: "codex-micro-single-tap-agent-keys",
        schema: d.boolean(),
      }),
      layout: it({
        agentAccess: "hidden",
        default: eoe,
        description: "Configured action-key layout for Codex Micro",
        key: "codex-micro-layout",
        schema: Qne,
      }),
      lightingBrightness: Ee({
        agentAccess: "hidden",
        default: 100,
        description: "Brightness of Codex Micro lighting",
        key: "codex-micro-lighting-brightness",
        schema: Hne,
      }),
      lightsOffWhenLocked: Ee({
        agentAccess: "hidden",
        default: !1,
        description: "Turn off Micro lighting while the computer is locked",
        key: "codex-micro-lights-off-when-locked",
        schema: d.boolean(),
      }),
      lightingAutoOff: Ee({
        agentAccess: "hidden",
        default: "3-minutes",
        description: "When Codex Micro lighting turns off after inactivity",
        key: "codex-micro-lighting-auto-off",
        schema: Wne,
      }),
    };
  });
var Lge = A((tmr, Nge) => {
  var Igt = RG(),
    kgt = _p();
  function Dgt(t, e) {
    return t && Igt(t, e, kgt);
  }
  Nge.exports = Dgt;
});
var Fge = A((rmr, Bge) => {
  var Mgt = tw(),
    Ogt = Lge(),
    Ngt = Mw();
  function Lgt(t, e) {
    var r = {};
    return (
      (e = Ngt(e, 3)),
      Ogt(t, function (n, o, i) {
        Mgt(r, o, e(n, o, i));
      }),
      r
    );
  }
  Bge.exports = Lgt;
});
var $ge,
  Bgt,
  Uge,
  qge = g(() => {
    "use strict";
    hw();
    $ge = F(Fge());
    mo();
    Or();
    ((Bgt = (0, $ge.default)(fw, (t, e) =>
      Ee({
        agentAccess: "hidden",
        default: !0,
        description: `Whether the ${t.shortDisplayName} browser reference is shown in the composer`,
        key: `browser-family-enabled:${e}`,
        schema: Be,
      }),
    )),
      (Uge = {
        alwaysHidePictureInPicture: He({
          agentAccess: "hidden",
          default: !1,
          description: "Whether Computer Use picture in picture is always hidden",
          key: "computerUseAlwaysHidePictureInPicture",
          schema: Be,
        }),
        ...Bgt,
      }));
  });
function Gge() {
  return {
    enabled: Ee({
      agentAccess: "hidden",
      default: !0,
      description: "Whether the composer predicts the user's next message",
      key: "composer-predictions-enabled",
      schema: Be,
    }),
  };
}
var Wge = g(() => {
  "use strict";
  mo();
  Or();
});
var YW,
  JW = g(() => {
    "use strict";
    YW = ["unassigned", "primary", "alt", "primary-shift"];
  });
var Fgt,
  $gt,
  Ak,
  Hge = g(() => {
    "use strict";
    JW();
    $();
    KS();
    vp();
    mo();
    Or();
    ((Fgt = d.object({
      label: d.string().min(1),
      icon: d.string().min(1),
      command: d.string().min(1),
      args: d.array(d.string()).default([]),
      input: d.enum(["path", "json_argument", "json_stdin"]).default("path"),
      supports_ssh: d.boolean().default(!1),
    })),
      ($gt = d.record(d.string(), Fgt)),
      (Ak = {
        confirmBeforeClose: Ee({
          agentAccess: "read-write",
          default: "keyboardOnly",
          description: "When to ask for confirmation before closing a desktop window",
          key: "confirm-before-close",
          schema: d.enum(["never", "keyboardOnly", "always"]),
        }),
        agentUsageResetEnabled: Ee({
          agentAccess: "read-only",
          default: !1,
          description: "Whether Codex can use usage resets after explicit user authorization",
          key: "agent-usage-reset-enabled",
          schema: Be,
        }),
        mcpStartupAuthentication: Ee({
          agentAccess: "read-only",
          default: !1,
          description: "Whether to prompt for MCP authentication at startup",
          key: "mcp_startup_authentication",
          schema: Be,
        }),
        gatewayAutoReauth: Ee({
          agentAccess: "read-only",
          default: !0,
          description:
            "Automatically open browser sign-in when the configured gateway needs reauthentication",
          key: "gateway_auto_reauth",
          schema: Be,
        }),
        primaryNumberShortcutTarget: Ee({
          agentAccess: "read-write",
          default: "tabs",
          description: "Whether primary-modifier number shortcuts select sidebar tasks or tabs",
          key: "primary-number-shortcut-target",
          schema: d.enum(["sidebar", "tabs"]),
        }),
        defaultWorkspaceFullView: Ee({
          agentAccess: "read-write",
          default: !1,
          description: "Whether new tasks start with the workspace in full view",
          key: "default-workspace-full-view",
          schema: Be,
        }),
        appBetaPreferencesByAccountId: it({
          agentAccess: "hidden",
          default: {},
          description: "Desktop app beta feature preferences by account",
          key: J.DESKTOP_APP_BETA_PREFERENCES_BY_ACCOUNT_ID,
          schema: d.record(d.string(), d.boolean()),
        }),
        macMenuBarEnabled: it({
          agentAccess: "read-write",
          default: !0,
          description: "Whether the macOS menu bar is shown",
          key: "mac-menu-bar-enabled",
          schema: Be,
        }),
        chronicleMenuBarIndicatorEnabled: Ee({
          agentAccess: "read-write",
          default: !0,
          description: "Whether the macOS menu bar shows the Computer History recording indicator",
          key: "chronicle-menu-bar-indicator-enabled",
          schema: Be,
        }),
        openInTargetPreferences: it({
          agentAccess: "read-write",
          default: {},
          description: "Preferred targets for opening paths",
          key: "open-in-target-preferences",
          schema: d.object({
            global: d.string().optional(),
            perPath: d.record(d.string(), d.string()).optional(),
          }),
        }),
        openLinkInTargetPreference: He({
          agentAccess: "read-write",
          default: jP,
          description: "Preferred target for opening links",
          key: "open-link-in-target-preference",
          schema: d.enum(["in-app-browser", "external-browser"]),
        }),
        externalBrowserLinkShortcut: He({
          agentAccess: "read-write",
          default: "primary",
          description: "Modifier-click shortcut for opening web links in the default browser",
          key: "external-browser-link-shortcut",
          schema: d.enum(YW),
        }),
        openLocalUrlInTargetPreference: He({
          agentAccess: "read-write",
          default: jP,
          description: "Preferred target for opening local URLs",
          key: "open-local-url-in-target-preference",
          schema: d.enum(["in-app-browser", "external-browser"]),
        }),
        customFileHandlers: He({
          agentAccess: "read-write",
          default: {},
          description: "Custom file handlers for opening files from Codex App",
          key: "custom_file_handlers",
          schema: $gt,
        }),
      }));
  });
var Pa,
  Ugt,
  jge,
  zge = g(() => {
    "use strict";
    $();
    mo();
    Or();
    ((Pa = d.union([Be, d.literal("original")])),
      (Ugt = d
        .object({
          SESSIONS: Pa,
          AGENTS_MD: Pa,
          CONFIG: Pa,
          SKILLS: Pa,
          PLUGINS: Pa,
          MCP_SERVER_CONFIG: Pa,
          SUBAGENTS: Pa,
          HOOKS: Pa,
          COMMANDS: Pa,
          MEMORY: Pa,
        })
        .partial()),
      (jge = {
        syncEnabled: Ee({
          agentAccess: "hidden",
          default: !1,
          description: "Whether imported content is automatically kept in sync",
          key: "external-agent-import-sync-enabled",
          schema: Be,
        }),
        syncItemTypes: Ee({
          agentAccess: "hidden",
          default: null,
          description:
            "Automatically sync all categories, including categories found later, or only selected categories; unset preferences retain the original import selections",
          key: "external-agent-import-sync-item-types",
          schema: d.union([d.literal("all"), Ugt]).nullable(),
        }),
      }));
  });
var Vge,
  Kge = g(() => {
    "use strict";
    $();
    Or();
    Vge = {
      preferredViewers: Ee({
        agentAccess: "hidden",
        default: {},
        description: "Preferred viewers by host and file extension for files opened by the user",
        key: "preferred-file-viewers",
        schema: d.record(d.string(), d.string()),
      }),
    };
  });
var Rk,
  Zge = g(() => {
    "use strict";
    $();
    KS();
    Ti();
    mo();
    Or();
    Rk = {
      autoArchiveAfterDays: He({
        agentAccess: "read-write",
        default: 0,
        description:
          "Number of inactive days before local chats are automatically archived; 0 disables auto-archive",
        key: "autoArchiveAfterDays",
        schema: d.number().int().nonnegative(),
      }),
      latexAutoCompile: Ee({
        agentAccess: "hidden",
        default: !0,
        description: "Whether LaTeX documents compile automatically while editing",
        key: "latex-auto-compile",
        schema: Be,
      }),
      sidebarShowProjectsInRecents: Ee({
        agentAccess: "read-write",
        default: !0,
        description: "Whether project chats also appear in Recents when grouped by project",
        key: "sidebar-show-projects-in-recents",
        schema: Be,
      }),
      dictationSoundsEnabled: He({
        agentAccess: "read-write",
        default: !0,
        description: "Whether sounds play when dictation starts and stops",
        key: "dictationSoundsEnabled",
        schema: Be,
      }),
      dictationPlaybackDuckingEnabled: He({
        agentAccess: "read-write",
        default: !0,
        description: "Whether dictation lowers the volume of other applications",
        key: "dictationPlaybackDuckingEnabled",
        schema: Be,
      }),
      dictationAlwaysShowLiveTranscription: He({
        agentAccess: "read-write",
        default: !1,
        description: "Whether dictation always starts with live transcription visible",
        key: "dictationAlwaysShowLiveTranscription",
        schema: Be,
      }),
      dictationDictionary: He({
        agentAccess: "read-write",
        default: [],
        description: "Custom dictation dictionary entries",
        key: "dictationDictionary",
        schema: d.array(d.string()),
      }),
      microphoneInputDeviceId: He({
        agentAccess: "hidden",
        default: null,
        description: "Preferred microphone input device for voice and dictation",
        key: "microphoneInputDeviceId",
        schema: d.string().min(1).nullable(),
      }),
      audioOutputDeviceId: He({
        agentAccess: "hidden",
        default: null,
        description: "Preferred audio output device for voice calls",
        key: "audioOutputDeviceId",
        schema: d.string().min(1).nullable(),
      }),
      followUpQueueMode: He({
        agentAccess: "read-write",
        default: "steer",
        description: "How follow-up prompts behave while a turn is running",
        key: "followUpQueueMode",
        schema: d.enum(["queue", "steer", "interrupt"]),
        vscode: {
          default: "queue",
          description:
            "Control whether follow-up messages are queued or steer the current run. Press Cmd/Ctrl+Shift+Enter to do the opposite for a single in-progress follow-up.",
        },
      }),
      composerEnterBehavior: He({
        agentAccess: "read-write",
        default: "enter",
        description: "How Enter behaves in the composer",
        key: "composerEnterBehavior",
        schema: d.enum(roe),
        vscode: { description: "Enter behavior for the Codex composer." },
      }),
      composerPlainTextMode: He({
        agentAccess: "read-write",
        default: !1,
        description: "Whether the message composer keeps code, Markdown, and links as literal text",
        key: "composerPlainTextMode",
        schema: Be,
      }),
      showContextWindowUsage: Ee({
        agentAccess: "read-write",
        default: !1,
        description: "Whether context window usage is shown in the composer",
        key: "show-context-window-usage",
        schema: Be,
      }),
      showEducationalTips: Ee({
        agentAccess: "read-write",
        default: !0,
        description: "Whether educational tips are shown above the composer",
        key: "show-educational-tips",
        schema: Be,
      }),
      reviewDelivery: He({
        agentAccess: "read-write",
        default: "inline",
        description: "How code review results are delivered",
        key: "reviewDelivery",
        schema: d.enum(["inline", "detached"]),
        vscode: {
          description:
            "Start /review inline in the current chat when possible or launch a separate review chat",
        },
      }),
      localeOverride: He({
        agentAccess: "read-write",
        default: null,
        description: "Explicit locale override",
        key: "localeOverride",
        schema: hu,
        vscode: {
          description: "Preferred language for the Codex UI. Leave empty to auto detect.",
          scope: "application",
        },
      }),
      defaultProjectParent: He({
        agentAccess: "hidden",
        default: null,
        description: "Parent folder for new local projects created with Start from scratch.",
        key: "defaultProjectParent",
        schema: d.string().refine(Ip, "Default project parent must be absolute").nullable(),
      }),
      projectlessWorkspaceRoot: He({
        agentAccess: "hidden",
        default: null,
        description:
          "The location where tasks started outside of projects store their data by default.",
        key: "projectlessWorkspaceRoot",
        schema: d.string().refine(Ip, "Projectless chat folder must be absolute").nullable(),
      }),
      preventSleepWhileRunning: He({
        agentAccess: "read-write",
        default: !1,
        description: "Whether the machine stays awake while Codex is running",
        key: "preventSleepWhileRunning",
        schema: Be,
      }),
      keepRemoteControlAwakeWhilePluggedIn: He({
        agentAccess: "read-write",
        default: !1,
        description: "Whether remote control keeps this computer awake while plugged in",
        key: "keepRemoteControlAwakeWhilePluggedIn",
        schema: Be,
      }),
      integratedTerminalShell: He({
        agentAccess: "read-write",
        default: void 0,
        description: "Preferred integrated terminal shell",
        key: "integratedTerminalShell",
        schema: d.enum(["powershell", "commandPrompt", "gitBash", "wsl"]),
      }),
      defaultTerminalLocation: He({
        agentAccess: "read-write",
        default: "bottom",
        description: "Where terminal actions open terminal tabs by default",
        key: "defaultTerminalLocation",
        schema: d.enum(["bottom", "right"]),
      }),
      runCodexInWsl: He({
        agentAccess: "hidden",
        default: !1,
        description: "Whether Codex runs inside WSL on Windows",
        key: "runCodexInWindowsSubsystemForLinux",
        schema: Be,
        vscode: {
          default: !1,
          description:
            "Deprecated. To run Codex in WSL, reopen your folder using the Microsoft WSL extension. Turn this setting off to run Codex on Windows. Changing it reloads the window.",
        },
      }),
      hotkeyWindowProjectlessDefaultEnabled: it({
        agentAccess: "read-write",
        default: !1,
        description: "Whether new popout-window tasks default to projectless mode",
        key: "hotkey-window-projectless-default-enabled",
        schema: Be,
      }),
    };
  });
var Xge,
  Yge,
  Jge = g(() => {
    "use strict";
    $();
    ((Xge = d.enum([
      "none",
      "minimal",
      "low",
      "medium",
      "high",
      "xhigh",
      "max",
      "ultra",
      "persistent",
    ])),
      (Yge = ["low", "medium", "high", "xhigh", "ultra", "persistent"]));
  });
var Ek,
  QW = g(() => {
    "use strict";
    $();
    Jge();
    Or();
    Ek = {
      daybreakEnabled: Ee({
        agentAccess: "hidden",
        default: null,
        description: "Saved Daybreak choice for the signed-in ChatGPT workspace",
        key: "daybreak-enabled",
        schema: d
          .object({ accountId: d.string(), userId: d.string(), enabled: d.boolean() })
          .nullable(),
      }),
      chatGptDaybreakEnabled: Ee({
        agentAccess: "hidden",
        default: null,
        description: "Saved Work Daybreak choice for the signed-in ChatGPT workspace",
        key: "chatgpt-daybreak-enabled",
        schema: d
          .object({ accountId: d.string(), userId: d.string(), enabled: d.boolean() })
          .nullable(),
      }),
      defaultModeRequestUserInput: Ee({
        agentAccess: "read-write",
        default: !0,
        description: "Whether Codex can ask questions outside Plan mode",
        key: "default-mode-request-user-input-enabled",
        schema: d.boolean(),
      }),
      enabledReasoningEfforts: Ee({
        agentAccess: "hidden",
        default: Yge,
        description: "Reasoning effort levels available in model controls",
        key: "enabled-reasoning-efforts",
        schema: d.array(Xge),
      }),
      showUltraInModelPickerSlider: Ee({
        agentAccess: "hidden",
        default: !1,
        description: "Whether Ultra appears in the model picker slider",
        key: "show-ultra-in-model-picker-slider",
        schema: d.boolean(),
      }),
    };
  });
var qgt,
  Qge,
  eye = g(() => {
    "use strict";
    $();
    mo();
    Or();
    ((qgt = d.union([
      d.enum(["default", "classic", "none", "Basso", "Glass", "Ping", "Pop", "Purr", "Tink"]),
      d.object({
        fileName: d.string().regex(/^codex-custom-[a-f0-9]{64}\.(wav|aiff|caf)$/),
        name: d.string().min(1),
      }),
    ])),
      (Qge = {
        sound: Ee({
          agentAccess: "read-write",
          default: "default",
          description:
            "Sound for all desktop task notifications; custom files must be imported on this computer",
          key: "notifications-sound",
          schema: qgt,
        }),
        turnMode: it({
          agentAccess: "read-write",
          default: "unfocused",
          description: "When turn-completion notifications are shown",
          key: "notifications-turn-mode",
          schema: d.enum(["off", "unfocused", "always"]),
        }),
        permissionsEnabled: it({
          agentAccess: "read-write",
          default: !0,
          description: "Whether permission notifications are shown",
          key: "notifications-permissions-enabled",
          schema: Be,
        }),
        questionsEnabled: it({
          agentAccess: "read-write",
          default: !0,
          description: "Whether question notifications are shown",
          key: "notifications-questions-enabled",
          schema: Be,
        }),
        dotEnabled: it({
          agentAccess: "read-write",
          default: !0,
          description: "Whether dot message notifications are shown",
          key: "notifications-dot-enabled",
          schema: Be,
        }),
      }));
  });
function Ck() {
  return (
    (eH = eH ?? {
      fontSize: He({
        agentAccess: "read-write",
        default: 15,
        description: "Base font size for Page text",
        key: "pagesFontSize",
        schema: Ggt,
      }),
      fullWidth: He({
        agentAccess: "read-write",
        default: !1,
        description: "Display Pages using the full available width for this viewer",
        key: "pagesFullWidth",
        schema: Be,
      }),
      smartPunctuationEnabled: He({
        agentAccess: "read-write",
        default: !0,
        description:
          "Automatically convert quotes, dashes, ellipses, arrows, and math symbols while typing in Pages",
        key: "pagesSmartPunctuationEnabled",
        schema: Be,
      }),
    }),
    eH
  );
}
var tye,
  Ggt,
  eH,
  rye = g(() => {
    "use strict";
    $();
    mo();
    Or();
    ((tye = { min: 12, max: 24 }), (Ggt = d.number().min(tye.min).max(tye.max)));
  });
var Wgt,
  Zmr,
  nye,
  tH = g(() => {
    "use strict";
    $();
    VW();
    mo();
    Or();
    ((Wgt = d.object({
      showActivityGraph: d.boolean(),
      showUsageStatistics: d.boolean(),
      showTopPlugins: d.boolean().default(!0),
      showInsights: d.boolean().default(!0),
    })),
      (Zmr = d.enum(["circle", "blossom", "square", "oval", "scalloped"])),
      (nye = {
        profilePetsByAccount: Ee({
          agentAccess: "hidden",
          default: {},
          description: "Local profile pet selection for each signed-in user and workspace",
          key: "profile-pets-by-account",
          schema: d.record(
            d.string(),
            d.object({
              enabled: d.boolean(),
              petId: d.string().nullable(),
              displayName: d.string().optional(),
            }),
          ),
        }),
        profileDisplayOptionsByUserId: Ee({
          agentAccess: "hidden",
          default: {},
          description: "Local profile section visibility for each signed-in user",
          key: "profile-display-options-by-user-id",
          schema: d.record(d.string(), Wgt),
        }),
        defaultServiceTier: Ee({
          agentAccess: "read-write",
          default: null,
          description: "Preferred model speed tier",
          key: _ge,
          schema: hu,
        }),
        selectedAvatarId: Ee({
          agentAccess: "read-write",
          default: null,
          description: "Selected Codex avatar",
          key: "selected-avatar-id",
          schema: hu,
        }),
        petSize: Ee({
          agentAccess: "read-write",
          default: 112,
          description: "Size of the floating Codex pet",
          key: "avatar-overlay-mascot-width-px",
          schema: d.number().int().min(80).max(224),
        }),
        petVisible: Ee({
          agentAccess: "hidden",
          default: !0,
          description: "Whether the floating Codex pet is visible above its controls",
          key: "avatar-overlay-pet-visible",
          schema: d.boolean(),
        }),
        petVisibility: Ee({
          agentAccess: "read-write",
          default: "always-visible",
          description: "Whether Mini stays visible or hides when you click away",
          key: "pet-visibility",
          schema: d.enum(["always-visible", "on-demand"]),
        }),
      }));
  });
var oye,
  iye = g(() => {
    "use strict";
    mo();
    Or();
    oye = {
      screenContextEnabled: He({
        agentAccess: "hidden",
        default: !0,
        description:
          "Whether realtime voice can inspect the foreground app when the user refers to screen content",
        key: "realtimeVoiceScreenContextEnabled",
        schema: Be,
      }),
    };
  });
var sye,
  aye = g(() => {
    "use strict";
    $();
    Or();
    sye = {
      audioVisualizerEnabled: Ee({
        agentAccess: "hidden",
        default: !1,
        description: "Whether conversation navigation rails react to system playback audio",
        key: "toys-audio-visualizer-enabled",
        schema: d.boolean(),
      }),
      confettiEnabled: Ee({
        agentAccess: "hidden",
        default: !1,
        description: "Whether Codex can show confetti celebrations in the app window",
        key: "toys-confetti-enabled",
        schema: d.boolean(),
      }),
    };
  });
var lye,
  cye = g(() => {
    "use strict";
    $();
    Or();
    lye = {
      conversationDetailMode: He({
        agentAccess: "read-write",
        default: "STEPS_COMMANDS",
        description: "How much turn detail Codex shows",
        key: "conversationDetailMode",
        schema: d.enum(["STEPS_PROSE", "STEPS_COMMANDS", "STEPS_EXECUTION"]),
      }),
    };
  });
function uye() {
  return Ee({
    agentAccess: "hidden",
    default: !0,
    description: "Whether Recents includes chats created by your dot",
    key: "sidebarShowYourDotInRecents",
    schema: Be,
  });
}
var dye = g(() => {
  "use strict";
  mo();
  Or();
});
function pye(t) {
  return (
    t === "none" ||
    t === "minimal" ||
    t === "low" ||
    t === "medium" ||
    t === "high" ||
    t === "xhigh" ||
    t === "max" ||
    t === "ultra" ||
    t === "persistent"
  );
}
var mye = g(() => {
  "use strict";
});
var pfr,
  fye = g(() => {
    "use strict";
    $();
    mye();
    pfr = d.object({
      enabled: d.array(d.string()).transform((t) => t.filter(pye)),
      source: d.enum(["default", "migrated", "user"]),
      uses_defaults: d.boolean(),
    });
  });
var gfr,
  hye = g(() => {
    "use strict";
    $();
    QW();
    gfr = d.object({
      model: d.string().min(1).max(256).nullish(),
      reasoningEffort: d.string().min(1).max(32).nullish(),
      serviceTier: d.enum(["standard", "fast", "ultrafast"]).nullish(),
      approvalPolicy: d.enum(["on-request", "untrusted", "never"]).nullish(),
      sandboxMode: d.enum(["read-only", "workspace-write"]).nullish(),
      networkAccess: d.boolean().nullish(),
      webSearch: d.enum(["disabled", "cached", "live"]).nullish(),
      enabledReasoningEfforts: Ek.enabledReasoningEfforts.schema.nullish(),
      showUltraInModelPickerSlider: d.boolean().nullish(),
      cloudBrowserUse: d.boolean().nullish(),
    });
  });
var Zw,
  rH = g(() => {
    "use strict";
    Cge();
    ZW();
    Tge();
    Ige();
    Dge();
    Oge();
    qge();
    Wge();
    Hge();
    zge();
    Kge();
    Zge();
    nW();
    QW();
    eye();
    rye();
    tH();
    iye();
    aye();
    cye();
    iW();
    dye();
    tH();
    fye();
    hye();
    Zw = [
      ...Object.values(Ege),
      ...Object.values(Tg),
      ...Object.values(xk),
      ...Object.values(Pge),
      ...Object.values(Mge),
      ...Object.values(Uge),
      ...Object.values(kge()),
      ...Object.values(Gge()),
      ...Object.values(Ak),
      ...Object.values(jge),
      ...Object.values(Vge),
      ...Object.values(Rk),
      ...Object.values(rW),
      ...Object.values(Ek),
      ...Object.values(Qge),
      ...Object.values(nye),
      ...Object.values(oye),
      uye(),
      Ck().fontSize,
      Ck().fullWidth,
      Ck().smartPunctuationEnabled,
      ...Object.values(sye),
      ...Object.values(lye),
      ...Object.values(oW),
    ];
  });
var gye = g(() => {
  "use strict";
});
function Xw(t) {
  return zgt.get(t);
}
function Tk(t) {
  return Xw(t).schema;
}
function Pg(t, e) {
  return Tk(t).parse(e);
}
function Vgt(t) {
  switch (t) {
    case "appearanceLightCodeThemeId":
      return d.enum(JG("light"));
    case "appearanceDarkCodeThemeId":
      return d.enum(JG("dark"));
    default:
      return;
  }
}
var yye,
  Hgt,
  jgt,
  vye,
  zgt,
  bye = g(() => {
    "use strict";
    yye = F(KW());
    $();
    rH();
    Iw();
    Or();
    gye();
    rH();
    ZW();
    ((Hgt = [...Zw]),
      (jgt = Zw.filter((t) => t.agentAccess !== "hidden")),
      (vye = (0, yye.default)(() =>
        jgt.map(({ agentAccess: t, default: e, description: r, key: n, schema: o }) => ({
          agentAccess: t,
          default: e,
          description: r,
          key: n,
          schema: d.toJSONSchema(Vgt(n) ?? o),
        })),
      )),
      (zgt = new Map(Hgt.map((t) => [t.key, t]))));
  });
function iH(t, e) {
  let r = e === "\0" ? `\0${Kl}\0` : Kl,
    [, n, o] = t.split(r);
  if (n == null || o == null) throw new Error("Shell output did not contain env delimiters");
  let i = {},
    s =
      e ===
      `
`
        ? n.replace(Kgt, "")
        : n;
  for (let a of s.split(e)) {
    let l =
        e ===
        `
`
          ? a.trimEnd()
          : a,
      c = l.indexOf("=");
    c > 0 && (i[l.slice(0, c)] = l.slice(c + 1));
  }
  return i;
}
var Ig,
  Kl,
  nH,
  oH,
  Kgt,
  Sye = g(() => {
    "use strict";
    ((Ig = "CODEX_SHELL"),
      (Kl = "_SHELL_ENV_DELIMITER_"),
      (nH = `printf '\\0%s\\0' '${Kl}'; command env -0 || exit; printf '\\0%s\\0' '${Kl}'; exit`),
      (oH = {
        DISABLE_AUTO_UPDATE: "true",
        ZSH_TMUX_AUTOSTARTED: "true",
        ZSH_TMUX_AUTOSTART: "false",
      }),
      (Kgt =
        /(?:\u001B\][\s\S]*?(?:\u0007|\u001B\u005C|\u009C)|[\u001B\u009B][[\]()#;?]*(?:\d{1,4}(?:[;:]\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~])/g));
  });
var wye = g(() => {
  "use strict";
});
var Yw = A((ahr, xye) => {
  "use strict";
  function Zgt(t, e) {
    if (typeof t != "object" || t === null) throw new TypeError(`${e} must be an object`);
  }
  function zr(t, e) {
    if (typeof t != "string") throw new TypeError(`${e} must be a string`);
  }
  function ut(t) {
    return t === 47 || t === 92;
  }
  function sH(t) {
    return t === 47;
  }
  function bu(t) {
    return (t >= 65 && t <= 90) || (t >= 97 && t <= 122);
  }
  function Pk(t, e, r, n) {
    let o = "",
      i = 0,
      s = -1,
      a = 0,
      l = 0;
    for (let c = 0; c <= t.length; ++c) {
      if (c < t.length) l = t.charCodeAt(c);
      else {
        if (n(l)) break;
        l = 47;
      }
      if (n(l)) {
        if (!(s === c - 1 || a === 1))
          if (a === 2) {
            if (
              o.length < 2 ||
              i !== 2 ||
              o.charCodeAt(o.length - 1) !== 46 ||
              o.charCodeAt(o.length - 2) !== 46
            ) {
              if (o.length > 2) {
                let u = o.lastIndexOf(r);
                (u === -1
                  ? ((o = ""), (i = 0))
                  : ((o = o.slice(0, u)), (i = o.length - 1 - o.lastIndexOf(r))),
                  (s = c),
                  (a = 0));
                continue;
              } else if (o.length !== 0) {
                ((o = ""), (i = 0), (s = c), (a = 0));
                continue;
              }
            }
            e && ((o += o.length > 0 ? `${r}..` : ".."), (i = 2));
          } else
            (o.length > 0 ? (o += `${r}${t.slice(s + 1, c)}`) : (o = t.slice(s + 1, c)),
              (i = c - s - 1));
        ((s = c), (a = 0));
      } else l === 46 && a !== -1 ? ++a : (a = -1);
    }
    return o;
  }
  function Xgt(t) {
    return t ? `${t[0] === "." ? "" : "."}${t}` : "";
  }
  function _ye(t, e) {
    Zgt(e, "pathObject");
    let r = e.dir || e.root,
      n = e.base || `${e.name || ""}${Xgt(e.ext)}`;
    return r ? (r === e.root ? `${r}${n}` : `${r}${t}${n}`) : n;
  }
  var Zl = {
      resolve(...t) {
        let e = "",
          r = "",
          n = !1;
        for (let o = t.length - 1; o >= -1; o--) {
          let i;
          if (o >= 0) {
            if (((i = t[o]), zr(i, `paths[${o}]`), i.length === 0)) continue;
          } else
            (i === void 0 ||
              (i.slice(0, 2).toLowerCase() !== e.toLowerCase() && i.charCodeAt(2) === 92)) &&
              (i = `${e}\\`);
          let s = i.length,
            a = 0,
            l = "",
            c = !1,
            u = i.charCodeAt(0);
          if (s === 1) ut(u) && ((a = 1), (c = !0));
          else if (ut(u))
            if (((c = !0), ut(i.charCodeAt(1)))) {
              let p = 2,
                m = p;
              for (; p < s && !ut(i.charCodeAt(p)); ) p++;
              if (p < s && p !== m) {
                let f = i.slice(m, p);
                for (m = p; p < s && ut(i.charCodeAt(p)); ) p++;
                if (p < s && p !== m) {
                  for (m = p; p < s && !ut(i.charCodeAt(p)); ) p++;
                  (p === s || p !== m) &&
                    (f !== "." && f !== "?"
                      ? ((l = `\\\\${f}\\${i.slice(m, p)}`), (a = p))
                      : ((l = `\\\\${f}`), (a = 4)));
                }
              }
            } else a = 1;
          else
            bu(u) &&
              i.charCodeAt(1) === 58 &&
              ((l = i.slice(0, 2)), (a = 2), s > 2 && ut(i.charCodeAt(2)) && ((c = !0), (a = 3)));
          if (l.length > 0)
            if (e.length > 0) {
              if (l.toLowerCase() !== e.toLowerCase()) continue;
            } else e = l;
          if (n) {
            if (e.length > 0) break;
          } else if (((r = `${i.slice(a)}\\${r}`), (n = c), c && e.length > 0)) break;
        }
        return ((r = Pk(r, !n, "\\", ut)), n ? `${e}\\${r}` : `${e}${r}` || ".");
      },
      normalize(t) {
        zr(t, "path");
        let e = t.length;
        if (e === 0) return ".";
        let r = 0,
          n,
          o = !1,
          i = t.charCodeAt(0);
        if (e === 1) return sH(i) ? "\\" : t;
        if (ut(i))
          if (((o = !0), ut(t.charCodeAt(1)))) {
            let a = 2,
              l = a;
            for (; a < e && !ut(t.charCodeAt(a)); ) a++;
            if (a < e && a !== l) {
              let c = t.slice(l, a);
              for (l = a; a < e && ut(t.charCodeAt(a)); ) a++;
              if (a < e && a !== l) {
                for (l = a; a < e && !ut(t.charCodeAt(a)); ) a++;
                if (a === e || a !== l)
                  if (c === "." || c === "?") ((n = `\\\\${c}`), (r = 4));
                  else {
                    if (a === e) return `\\\\${c}\\${t.slice(l)}\\`;
                    ((n = `\\\\${c}\\${t.slice(l, a)}`), (r = a));
                  }
              }
            }
          } else r = 1;
        else
          bu(i) &&
            t.charCodeAt(1) === 58 &&
            ((n = t.slice(0, 2)), (r = 2), e > 2 && ut(t.charCodeAt(2)) && ((o = !0), (r = 3)));
        let s = r < e ? Pk(t.slice(r), !o, "\\", ut) : "";
        return (
          s.length === 0 && !o && (s = "."),
          s.length > 0 && ut(t.charCodeAt(e - 1)) && (s += "\\"),
          n === void 0 ? (o ? `\\${s}` : s) : o ? `${n}\\${s}` : `${n}${s}`
        );
      },
      isAbsolute(t) {
        zr(t, "path");
        let e = t.length;
        if (e === 0) return !1;
        let r = t.charCodeAt(0);
        return ut(r) || (e > 2 && bu(r) && t.charCodeAt(1) === 58 && ut(t.charCodeAt(2)));
      },
      join(...t) {
        if (t.length === 0) return ".";
        let e, r;
        for (let i = 0; i < t.length; ++i) {
          let s = t[i];
          (zr(s, "path"), s.length > 0 && (e === void 0 ? (e = r = s) : (e += `\\${s}`)));
        }
        if (e === void 0) return ".";
        let n = !0,
          o = 0;
        if (ut(r.charCodeAt(0))) {
          ++o;
          let i = r.length;
          i > 1 && ut(r.charCodeAt(1)) && (++o, i > 2 && (ut(r.charCodeAt(2)) ? ++o : (n = !1)));
        }
        if (n) {
          for (; o < e.length && ut(e.charCodeAt(o)); ) o++;
          o >= 2 && (e = `\\${e.slice(o)}`);
        }
        return Zl.normalize(e);
      },
      relative(t, e) {
        if ((zr(t, "from"), zr(e, "to"), t === e)) return "";
        let r = Zl.resolve(t),
          n = Zl.resolve(e);
        if (r === n || ((t = r.toLowerCase()), (e = n.toLowerCase()), t === e)) return "";
        if (r.length !== t.length || n.length !== e.length) {
          let h = r.split("\\"),
            v = n.split("\\");
          (h[h.length - 1] === "" && h.pop(), v[v.length - 1] === "" && v.pop());
          let y = h.length,
            w = v.length,
            _ = y < w ? y : w,
            S;
          for (S = 0; S < _ && h[S].toLowerCase() === v[S].toLowerCase(); S++);
          return S === 0
            ? n
            : S === _
              ? w > _
                ? v.slice(S).join("\\")
                : y > _
                  ? "..\\".repeat(y - 1 - S) + ".."
                  : ""
              : "..\\".repeat(y - S) + v.slice(S).join("\\");
        }
        let o = 0;
        for (; o < t.length && t.charCodeAt(o) === 92; ) o++;
        let i = t.length;
        for (; i - 1 > o && t.charCodeAt(i - 1) === 92; ) i--;
        let s = i - o,
          a = 0;
        for (; a < e.length && e.charCodeAt(a) === 92; ) a++;
        let l = e.length;
        for (; l - 1 > a && e.charCodeAt(l - 1) === 92; ) l--;
        let c = l - a,
          u = s < c ? s : c,
          p = -1,
          m = 0;
        for (; m < u; m++) {
          let h = t.charCodeAt(o + m);
          if (h !== e.charCodeAt(a + m)) break;
          h === 92 && (p = m);
        }
        if (m !== u) {
          if (p === -1) return n;
        } else {
          if (c > u) {
            if (e.charCodeAt(a + m) === 92) return n.slice(a + m + 1);
            if (m === 2) return n.slice(a + m);
          }
          (s > u && (t.charCodeAt(o + m) === 92 ? (p = m) : m === 2 && (p = 3)),
            p === -1 && (p = 0));
        }
        let f = "";
        for (m = o + p + 1; m <= i; ++m)
          (m === i || t.charCodeAt(m) === 92) && (f += f.length === 0 ? ".." : "\\..");
        return (
          (a += p),
          f.length > 0 ? `${f}${n.slice(a, l)}` : (n.charCodeAt(a) === 92 && ++a, n.slice(a, l))
        );
      },
      toNamespacedPath(t) {
        if (typeof t != "string" || t.length === 0) return t;
        let e = Zl.resolve(t);
        if (e.length <= 2) return t;
        if (e.charCodeAt(0) === 92) {
          if (e.charCodeAt(1) === 92) {
            let r = e.charCodeAt(2);
            if (r !== 63 && r !== 46) return `\\\\?\\UNC\\${e.slice(2)}`;
          }
        } else if (bu(e.charCodeAt(0)) && e.charCodeAt(1) === 58 && e.charCodeAt(2) === 92)
          return `\\\\?\\${e}`;
        return e;
      },
      dirname(t) {
        zr(t, "path");
        let e = t.length;
        if (e === 0) return ".";
        let r = -1,
          n = 0,
          o = t.charCodeAt(0);
        if (e === 1) return ut(o) ? t : ".";
        if (ut(o)) {
          if (((r = n = 1), ut(t.charCodeAt(1)))) {
            let a = 2,
              l = a;
            for (; a < e && !ut(t.charCodeAt(a)); ) a++;
            if (a < e && a !== l) {
              for (l = a; a < e && ut(t.charCodeAt(a)); ) a++;
              if (a < e && a !== l) {
                for (l = a; a < e && !ut(t.charCodeAt(a)); ) a++;
                if (a === e) return t;
                a !== l && (r = n = a + 1);
              }
            }
          }
        } else
          bu(o) && t.charCodeAt(1) === 58 && ((r = e > 2 && ut(t.charCodeAt(2)) ? 3 : 2), (n = r));
        let i = -1,
          s = !0;
        for (let a = e - 1; a >= n; --a)
          if (ut(t.charCodeAt(a))) {
            if (!s) {
              i = a;
              break;
            }
          } else s = !1;
        if (i === -1) {
          if (r === -1) return ".";
          i = r;
        }
        return t.slice(0, i);
      },
      basename(t, e) {
        (e !== void 0 && zr(e, "suffix"), zr(t, "path"));
        let r = 0,
          n = -1,
          o = !0;
        if (
          (t.length >= 2 && bu(t.charCodeAt(0)) && t.charCodeAt(1) === 58 && (r = 2),
          e !== void 0 && e.length > 0 && e.length <= t.length)
        ) {
          if (e === t) return "";
          let i = e.length - 1,
            s = -1;
          for (let a = t.length - 1; a >= r; --a) {
            let l = t.charCodeAt(a);
            if (ut(l)) {
              if (!o) {
                r = a + 1;
                break;
              }
            } else
              (s === -1 && ((o = !1), (s = a + 1)),
                i >= 0 && (l === e.charCodeAt(i) ? --i === -1 && (n = a) : ((i = -1), (n = s))));
          }
          return (r === n ? (n = s) : n === -1 && (n = t.length), t.slice(r, n));
        }
        for (let i = t.length - 1; i >= r; --i)
          if (ut(t.charCodeAt(i))) {
            if (!o) {
              r = i + 1;
              break;
            }
          } else n === -1 && ((o = !1), (n = i + 1));
        return n === -1 ? "" : t.slice(r, n);
      },
      extname(t) {
        zr(t, "path");
        let e = 0,
          r = -1,
          n = 0,
          o = -1,
          i = !0,
          s = 0;
        t.length >= 2 && t.charCodeAt(1) === 58 && bu(t.charCodeAt(0)) && (e = n = 2);
        for (let a = t.length - 1; a >= e; --a) {
          let l = t.charCodeAt(a);
          if (ut(l)) {
            if (!i) {
              n = a + 1;
              break;
            }
            continue;
          }
          (o === -1 && ((i = !1), (o = a + 1)),
            l === 46 ? (r === -1 ? (r = a) : s !== 1 && (s = 1)) : r !== -1 && (s = -1));
        }
        return r === -1 || o === -1 || s === 0 || (s === 1 && r === o - 1 && r === n + 1)
          ? ""
          : t.slice(r, o);
      },
      format: _ye.bind(null, "\\"),
      parse(t) {
        zr(t, "path");
        let e = { root: "", dir: "", base: "", ext: "", name: "" };
        if (t.length === 0) return e;
        let r = t.length,
          n = 0,
          o = t.charCodeAt(0);
        if (r === 1) return ut(o) ? ((e.root = e.dir = t), e) : ((e.base = e.name = t), e);
        if (ut(o)) {
          if (((n = 1), ut(t.charCodeAt(1)))) {
            let p = 2,
              m = p;
            for (; p < r && !ut(t.charCodeAt(p)); ) p++;
            if (p < r && p !== m) {
              for (m = p; p < r && ut(t.charCodeAt(p)); ) p++;
              if (p < r && p !== m) {
                for (m = p; p < r && !ut(t.charCodeAt(p)); ) p++;
                p === r ? (n = p) : p !== m && (n = p + 1);
              }
            }
          }
        } else if (bu(o) && t.charCodeAt(1) === 58) {
          if (r <= 2) return ((e.root = e.dir = t), e);
          if (((n = 2), ut(t.charCodeAt(2)))) {
            if (r === 3) return ((e.root = e.dir = t), e);
            n = 3;
          }
        }
        n > 0 && (e.root = t.slice(0, n));
        let i = -1,
          s = n,
          a = -1,
          l = !0,
          c = t.length - 1,
          u = 0;
        for (; c >= n; --c) {
          if (((o = t.charCodeAt(c)), ut(o))) {
            if (!l) {
              s = c + 1;
              break;
            }
            continue;
          }
          (a === -1 && ((l = !1), (a = c + 1)),
            o === 46 ? (i === -1 ? (i = c) : u !== 1 && (u = 1)) : i !== -1 && (u = -1));
        }
        return (
          a !== -1 &&
            (i === -1 || u === 0 || (u === 1 && i === a - 1 && i === s + 1)
              ? (e.base = e.name = t.slice(s, a))
              : ((e.name = t.slice(s, i)), (e.base = t.slice(s, a)), (e.ext = t.slice(i, a)))),
          s > 0 && s !== n ? (e.dir = t.slice(0, s - 1)) : (e.dir = e.root),
          e
        );
      },
      sep: "\\",
      delimiter: ";",
      win32: null,
      posix: null,
    },
    Xl = {
      resolve(...t) {
        let e = "",
          r = !1;
        for (let n = t.length - 1; n >= 0 && !r; n--) {
          let o = t[n];
          (zr(o, `paths[${n}]`),
            o.length !== 0 && ((e = `${o}/${e}`), (r = o.charCodeAt(0) === 47)));
        }
        return ((e = Pk(e, !r, "/", sH)), r ? `/${e}` : e.length > 0 ? e : ".");
      },
      normalize(t) {
        if ((zr(t, "path"), t.length === 0)) return ".";
        let e = t.charCodeAt(0) === 47,
          r = t.charCodeAt(t.length - 1) === 47;
        return (
          (t = Pk(t, !e, "/", sH)),
          t.length === 0 ? (e ? "/" : r ? "./" : ".") : (r && (t += "/"), e ? `/${t}` : t)
        );
      },
      isAbsolute(t) {
        return (zr(t, "path"), t.length > 0 && t.charCodeAt(0) === 47);
      },
      join(...t) {
        if (t.length === 0) return ".";
        let e = [];
        for (let r = 0; r < t.length; ++r) {
          let n = t[r];
          (zr(n, "path"), n.length > 0 && e.push(n));
        }
        return e.length === 0 ? "." : Xl.normalize(e.join("/"));
      },
      relative(t, e) {
        if (
          (zr(t, "from"),
          zr(e, "to"),
          t === e || ((t = Xl.resolve(t)), (e = Xl.resolve(e)), t === e))
        )
          return "";
        let r = 1,
          n = t.length,
          o = n - r,
          i = 1,
          s = e.length - i,
          a = o < s ? o : s,
          l = -1,
          c = 0;
        for (; c < a; c++) {
          let p = t.charCodeAt(r + c);
          if (p !== e.charCodeAt(i + c)) break;
          p === 47 && (l = c);
        }
        if (c === a)
          if (s > a) {
            if (e.charCodeAt(i + c) === 47) return e.slice(i + c + 1);
            if (c === 0) return e.slice(i + c);
          } else o > a && (t.charCodeAt(r + c) === 47 ? (l = c) : c === 0 && (l = 0));
        let u = "";
        for (c = r + l + 1; c <= n; ++c)
          (c === n || t.charCodeAt(c) === 47) && (u += u.length === 0 ? ".." : "/..");
        return `${u}${e.slice(i + l)}`;
      },
      toNamespacedPath(t) {
        return t;
      },
      dirname(t) {
        if ((zr(t, "path"), t.length === 0)) return ".";
        let e = t.charCodeAt(0) === 47,
          r = -1,
          n = !0;
        for (let o = t.length - 1; o >= 1; --o)
          if (t.charCodeAt(o) === 47) {
            if (!n) {
              r = o;
              break;
            }
          } else n = !1;
        return r === -1 ? (e ? "/" : ".") : e && r === 1 ? "//" : t.slice(0, r);
      },
      basename(t, e) {
        (e !== void 0 && zr(e, "suffix"), zr(t, "path"));
        let r = 0,
          n = -1,
          o = !0;
        if (e !== void 0 && e.length > 0 && e.length <= t.length) {
          if (e === t) return "";
          let i = e.length - 1,
            s = -1;
          for (let a = t.length - 1; a >= 0; --a) {
            let l = t.charCodeAt(a);
            if (l === 47) {
              if (!o) {
                r = a + 1;
                break;
              }
            } else
              (s === -1 && ((o = !1), (s = a + 1)),
                i >= 0 && (l === e.charCodeAt(i) ? --i === -1 && (n = a) : ((i = -1), (n = s))));
          }
          return (r === n ? (n = s) : n === -1 && (n = t.length), t.slice(r, n));
        }
        for (let i = t.length - 1; i >= 0; --i)
          if (t.charCodeAt(i) === 47) {
            if (!o) {
              r = i + 1;
              break;
            }
          } else n === -1 && ((o = !1), (n = i + 1));
        return n === -1 ? "" : t.slice(r, n);
      },
      extname(t) {
        zr(t, "path");
        let e = -1,
          r = 0,
          n = -1,
          o = !0,
          i = 0;
        for (let s = t.length - 1; s >= 0; --s) {
          let a = t[s];
          if (a === "/") {
            if (!o) {
              r = s + 1;
              break;
            }
            continue;
          }
          (n === -1 && ((o = !1), (n = s + 1)),
            a === "." ? (e === -1 ? (e = s) : i !== 1 && (i = 1)) : e !== -1 && (i = -1));
        }
        return e === -1 || n === -1 || i === 0 || (i === 1 && e === n - 1 && e === r + 1)
          ? ""
          : t.slice(e, n);
      },
      format: _ye.bind(null, "/"),
      parse(t) {
        zr(t, "path");
        let e = { root: "", dir: "", base: "", ext: "", name: "" };
        if (t.length === 0) return e;
        let r = t.charCodeAt(0) === 47,
          n;
        r ? ((e.root = "/"), (n = 1)) : (n = 0);
        let o = -1,
          i = 0,
          s = -1,
          a = !0,
          l = t.length - 1,
          c = 0;
        for (; l >= n; --l) {
          let u = t.charCodeAt(l);
          if (u === 47) {
            if (!a) {
              i = l + 1;
              break;
            }
            continue;
          }
          (s === -1 && ((a = !1), (s = l + 1)),
            u === 46 ? (o === -1 ? (o = l) : c !== 1 && (c = 1)) : o !== -1 && (c = -1));
        }
        if (s !== -1) {
          let u = i === 0 && r ? 1 : i;
          o === -1 || c === 0 || (c === 1 && o === s - 1 && o === i + 1)
            ? (e.base = e.name = t.slice(u, s))
            : ((e.name = t.slice(u, o)), (e.base = t.slice(u, s)), (e.ext = t.slice(o, s)));
        }
        return (i > 0 ? (e.dir = t.slice(0, i - 1)) : r && (e.dir = "/"), e);
      },
      sep: "/",
      delimiter: ":",
      win32: null,
      posix: null,
    };
  Xl.win32 = Zl.win32 = Zl;
  Xl.posix = Zl.posix = Xl;
  Zl._makeLong = Zl.toNamespacedPath;
  Xl._makeLong = Xl.toNamespacedPath;
  xye.exports = Xl;
});
