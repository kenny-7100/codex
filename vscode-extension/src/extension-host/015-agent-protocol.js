var Kpe,
  oW,
  iW = g(() => {
    "use strict";
    $();
    vp();
    mo();
    Or();
    ((Kpe = d.enum(["ask", "always", "never", "dirty"])),
      (oW = {
        defaultCreationPreference: it({
          agentAccess: "read-only",
          default: "ask",
          description:
            "Default for creating managed worktrees for file edits in repositories without a saved preference",
          key: J.WORKTREE_DEFAULT_CREATION_PREFERENCE,
          schema: Kpe,
        }),
        repositoryPreferences: it({
          agentAccess: "hidden",
          default: [],
          description:
            "User-selected worktree permissions for individual repositories on each host",
          key: J.WORKTREE_REPOSITORY_PREFERENCES,
          schema: d.array(
            d.strictObject({
              hostId: d.string(),
              commonDir: d.string(),
              root: d.string(),
              preference: Kpe,
            }),
          ),
        }),
        upstreamRefreshMode: it({
          agentAccess: "hidden",
          default: UP,
          description: "How Codex refreshes upstream branches before creating worktrees",
          key: J.WORKTREE_UPSTREAM_REFRESH_MODE,
          schema: d.enum(["never", "best-effort"]),
        }),
        autoCleanupEnabled: it({
          agentAccess: "read-write",
          default: !0,
          description: "Whether Codex automatically cleans up old worktrees",
          key: "worktree-auto-cleanup-enabled",
          schema: Be,
        }),
        confirmBeforeDelete: it({
          agentAccess: "hidden",
          default: !0,
          description: "Whether to ask before manually deleting a worktree in settings",
          key: J.WORKTREE_CONFIRM_BEFORE_DELETE,
          schema: Be,
        }),
        keepCount: it({
          agentAccess: "read-write",
          default: 15,
          description: "How many recent worktrees Codex keeps",
          key: "worktree-keep-count",
          schema: d.number().int().min(1),
        }),
      }));
  });
var Zpe = g(() => {
  "use strict";
  nW();
  iW();
});
var Xpe = g(() => {
  "use strict";
});
var Ype = g(() => {
  "use strict";
});
function bt(t, e) {
  if (!(t instanceof Error)) return !1;
  if ("code" in t && Jpe.has(t.code)) return !0;
  let r = e == null ? t.message : t.message.replaceAll(e, ""),
    n = /\(os error (\d+)\)$/.exec(r);
  if (n != null) return n[1] === "2" || n[1] === "3" || r.endsWith("Not a directory (os error 20)");
  let o = /(?:^|: )(E[A-Z0-9]+): /.exec(r);
  return o != null
    ? Jpe.has(o[1])
    : r.includes("ENOENT") ||
        r.includes("No such file or directory") ||
        r.includes("Not a directory") ||
        /\(os error (?:2|3)\)/.test(r);
}
var Jpe,
  Qpe = g(() => {
    "use strict";
    Jpe = new Set(["ENOENT", "ENOTDIR"]);
  });
var eme = g(() => {
  "use strict";
});
var tme = g(() => {
  "use strict";
});
var _g,
  zI,
  VI,
  KI,
  Udt,
  qdt,
  Gdt,
  sW,
  rme,
  nme,
  ome = g(() => {
    "use strict";
    $();
    ((_g = "codex.localEnvironmentConfigPath"),
      (zI = "__none__"),
      (VI = "CODEX_SOURCE_TREE_PATH"),
      (KI = "CODEX_WORKTREE_PATH"),
      (Udt = ["tool", "run", "debug", "test"]),
      (qdt = ["darwin", "linux", "win32"]),
      (Gdt = d.object({
        name: d.string(),
        icon: d.enum(Udt).nullable().catch(null),
        command: d.string(),
        platform: d.enum(qdt).optional(),
      })),
      (sW = d.object({ script: d.string() })),
      (rme = d.object({
        script: d.string(),
        darwin: sW.optional(),
        linux: sW.optional(),
        win32: sW.optional(),
      })),
      (nme = d.object({
        version: d.number().int().min(1).default(1),
        name: d.string(),
        setup: rme,
        cleanup: rme.optional(),
        actions: d.array(Gdt).optional(),
      })));
  });
var ime,
  sme = g(() => {
    "use strict";
    ime = {
      error: !0,
      "thread/started": !0,
      "thread/readState/changed": !0,
      "thread/section/changed": !0,
      "thread/name/updated": !0,
      "thread/attachment/updated": !0,
      "thread/project/updated": !1,
      "thread/prediction/updated": !1,
      "thread/queue/changed": !0,
      "thread/environment/connected": !0,
      "thread/environment/disconnected": !0,
      "thread/settings/updated": !0,
      "thread/tokenUsage/updated": !0,
      "turn/started": !0,
      "hook/started": !0,
      "turn/completed": !0,
      "hook/completed": !0,
      "turn/diff/updated": !0,
      "turn/plan/updated": !0,
      "item/started": !0,
      "item/autoApprovalReview/started": !0,
      "item/autoApprovalReview/completed": !0,
      "autoApprovalReview/strictReviewRequired": !0,
      "item/completed": !0,
      "rawResponseItem/completed": !1,
      "item/agentMessage/delta": !0,
      "item/plan/delta": !0,
      "command/exec/outputDelta": !1,
      "process/outputDelta": !1,
      "process/exited": !1,
      "project/changed": !1,
      "item/commandExecution/outputDelta": !0,
      "item/commandExecution/terminalInteraction": !0,
      "item/fileChange/outputDelta": !0,
      "item/fileChange/patchUpdated": !0,
      "serverRequest/resolved": !0,
      "item/mcpToolCall/progress": !0,
      "mcpServer/oauthLogin/completed": !0,
      "mcpServer/startupStatus/updated": !0,
      "mcpServer/event/stream/notification": !0,
      "account/updated": !0,
      "account/gatewayOAuth/changed": !0,
      "account/rateLimits/updated": !0,
      "app/list/updated": !0,
      "externalAgentConfig/import/progress": !1,
      "externalAgentConfig/import/completed": !0,
      "fs/changed": !0,
      "item/reasoning/summaryTextDelta": !0,
      "item/reasoning/summaryPartAdded": !0,
      "item/reasoning/textDelta": !0,
      "thread/compacted": !1,
      deprecationNotice: !0,
      configWarning: !0,
      "windows/worldWritableWarning": !1,
      "windowsSandbox/setupCompleted": !0,
      "account/login/completed": !0,
      "model/rerouted": !0,
      "model/verification": !0,
      "modelProvider/authRecoveryStarted": !1,
      "modelProvider/authRecoveryCompleted": !1,
      "model/safetyBuffering/updated": !0,
      "turn/moderationMetadata": !0,
      authStatusChange: !1,
      loginChatGptComplete: !1,
      sessionConfigured: !0,
      "codex/event/session_configured": !0,
      "codex/event/task_started": !1,
      "codex/event/agent_reasoning": !1,
      "codex/event/agent_message": !1,
      "codex/event/task_complete": !1,
      "codex/event/mcp_tool_call_begin": !1,
      "codex/event/mcp_tool_call_end": !1,
      "codex/event/exec_command_begin": !1,
      "codex/event/exec_command_end": !1,
      "codex/event/exec_command_output_delta": !1,
      "codex/event/exec_approval_request": !1,
      "codex/event/apply_patch_approval_request": !1,
      "codex/event/background_event": !1,
      "codex/event/turn_diff": !1,
      "codex/event/get_history_entry_response": !1,
      "codex/event/agent_reasoning_delta": !1,
      "codex/event/agent_reasoning_section_break": !1,
      "codex/event/agent_message_delta": !1,
      "codex/event/stream_error": !1,
      "codex/event/error": !1,
      "codex/event/turn_aborted": !1,
      "codex/event/plan_delta": !1,
      "codex/event/plan_update": !1,
      "codex/event/patch_apply_begin": !1,
      "codex/event/patch_apply_end": !1,
      "codex/event/item_started": !1,
      "codex/event/item_completed": !1,
      "codex/event/user_message": !1,
      "codex/event/agent_reasoning_raw_content": !1,
      "codex/event/agent_reasoning_raw_content_delta": !1,
      "codex/event/web_search_begin": !1,
      "codex/event/web_search_end": !1,
      "codex/event/mcp_list_tools_response": !1,
      "codex/event/list_skills_response": !1,
      "codex/event/list_remote_skills_response": !1,
      "codex/event/remote_skill_downloaded": !1,
      "codex/event/list_custom_prompts_response": !1,
      "codex/event/raw_response_item": !1,
      "codex/event/agent_message_content_delta": !1,
      "codex/event/reasoning_content_delta": !1,
      "codex/event/reasoning_raw_content_delta": !1,
      "codex/event/warning": !1,
      "codex/event/undo_started": !1,
      "codex/event/undo_completed": !1,
      "codex/event/shutdown_complete": !1,
      "codex/event/entered_review_mode": !1,
      "codex/event/exited_review_mode": !1,
      "codex/event/view_image_tool_call": !1,
      "codex/event/mcp_startup_update": !1,
      "codex/event/mcp_startup_complete": !1,
      "codex/event/remote_task_created": !1,
      "codex/event/thread_rolled_back": !1,
      "codex/event/thread_name_updated": !1,
      "codex/event/collab_agent_spawn_begin": !0,
      "codex/event/collab_agent_spawn_end": !0,
      "codex/event/collab_agent_interaction_begin": !0,
      "codex/event/collab_agent_interaction_end": !0,
      "codex/event/collab_resume_begin": !0,
      "codex/event/collab_resume_end": !0,
      "codex/event/collab_waiting_begin": !0,
      "codex/event/collab_waiting_end": !0,
      "codex/event/collab_close_begin": !0,
      "codex/event/collab_close_end": !0,
      "codex/event/elicitation_request": !1,
      "codex/event/dynamic_tool_call_request": !1,
      "codex/event/request_user_input": !1,
      "codex/event/terminal_interaction": !1,
      "codex/event/token_count": !1,
      "codex/event/deprecation_notice": !1,
      "fuzzyFileSearch/sessionUpdated": !0,
      "fuzzyFileSearch/sessionCompleted": !0,
      "thread/archived": !0,
      "thread/deleted": !0,
      "thread/closed": !1,
      "thread/reverted": !1,
      "thread/goal/cleared": !0,
      "thread/goal/updated": !0,
      "thread/unarchived": !0,
      "skills/changed": !0,
      "thread/realtime/started": !0,
      "thread/realtime/itemAdded": !0,
      "thread/realtime/item/started": !0,
      "thread/realtime/item/transcript/delta": !0,
      "thread/realtime/item/completed": !0,
      "thread/realtime/transcript/delta": !0,
      "thread/realtime/transcript/done": !0,
      "thread/realtime/outputAudio/delta": !0,
      "thread/realtime/sdp": !0,
      "thread/realtime/error": !0,
      "thread/realtime/closed": !0,
      "thread/status/changed": !0,
      "remoteControl/status/changed": !0,
      "rawResponse/completed": !1,
      guardianWarning: !0,
      warning: !1,
    };
  });
var ame,
  lme = g(() => {
    "use strict";
    sme();
    ame = ime;
  });
var cme,
  Mlr,
  Wdt,
  Hdt,
  jdt,
  Olr,
  ume = g(() => {
    "use strict";
    $();
    lme();
    ((cme = [
      "notifications/events/active",
      "notifications/events/error",
      "notifications/events/event",
      "notifications/events/heartbeat",
      "notifications/events/terminated",
    ]),
      (Mlr = d.object({ httpStatusCode: d.number().nullable() })),
      (Wdt = ame),
      (Hdt = new Set([
        "turn/moderationMetadata",
        "process/outputDelta",
        "process/exited",
        "fs/changed",
      ])),
      (jdt = Object.entries(Wdt)
        .filter(([t, e]) => !e && !Hdt.has(t))
        .map(([t]) => t)),
      (Olr = d.object({
        code: d.number().optional(),
        jsonRpcCode: d.number().optional(),
        message: d.string().optional(),
      })));
  });
function dme(t) {
  let e = t
      ? d
          .string()
          .min(1)
          .optional()
          .catch(void 0)
      : d.string().optional(),
    r = d.object({ resourceUri: e }).optional();
  return d.object({
    "openai/outputTemplate": e.nullable(),
    ui: t ? r.catch(void 0) : r,
    "ui/resourceUri": e,
  });
}
var Blr,
  Flr,
  pme = g(() => {
    "use strict";
    $();
    ((Blr = dme(!1)), (Flr = dme(!0)));
  });
var zdt,
  Ulr,
  Vdt,
  Kdt,
  qlr,
  mme = g(() => {
    "use strict";
    ((zdt = "codex-mcp-app-sandbox"),
      (Ulr = `persist:${zdt}:shared`),
      (Vdt = [
        "navigate",
        "notifyMcpAppsHostContext",
        "notifyMcpAppsToolCancelled",
        "notifyMcpAppsToolInput",
        "notifyMcpAppsToolResult",
        "requestMcpAppsResourceTeardown",
        "runWidgetCode",
        "setAdditionalGlobals",
        "setSafeArea",
        "setTheme",
        "setWidgetData",
        "setWidgetView",
      ]),
      (Kdt = [
        "applyAutofillCandidate",
        "getCurrentPath",
        "notifyMcpAppsMcpNotification",
        "prepareEnvironment",
        "runUserCode",
        "screenshot",
        "stop",
      ]),
      (qlr = [...Vdt, ...Kdt]));
  });
function Ydt(t) {
  try {
    let e = new URL(t);
    return (
      (e.protocol === "http:" || e.protocol === "https:") && e.username === "" && e.password === ""
    );
  } catch {
    return !1;
  }
}
var Zdt,
  Xdt,
  Hlr,
  jlr,
  fme = g(() => {
    "use strict";
    $();
    ((Zdt = d.enum(["read", "created", "updated"])),
      (Xdt = d.object({
        id: d.string().min(1),
        url: d.string().refine(Ydt),
        title: d.string().optional(),
        mimeType: d.string().optional(),
        activities: d.array(Zdt).min(1),
      })),
      (Hlr = d
        .object({
          "openai/resourceActivities": d
            .object({ version: d.literal(1), resources: d.array(Xdt) })
            .loose(),
        })
        .loose()),
      (jlr = d.object({ "openai/resourceActivities": d.unknown().optional() }).loose()));
  });
var Jdt,
  Qdt,
  Klr,
  hme = g(() => {
    "use strict";
    $();
    ((Jdt = d.object({
      src: d
        .url({ protocol: /^https$/u })
        .max(16384)
        .refine((t) => {
          let e = new URL(t);
          return e.username === "" && e.password === "";
        }),
      theme: d.enum(["light", "dark"]).optional(),
    })),
      (Qdt = d
        .array(
          d.object({
            id: d.string().regex(/^[a-z][a-z0-9_-]{0,63}$/u),
            title: d
              .string()
              .refine((t) => !new RegExp("\\p{Cc}", "u").test(t))
              .pipe(d.string().trim().min(1).max(128)),
            icons: d
              .array(Jdt)
              .max(8)
              .optional()
              .catch(void 0),
            accessMode: d.enum(["included", "connected", "web"]).optional(),
            delayMinutes: d.number().int().min(1).max(10080).optional(),
          }),
        )
        .max(32)),
      (Klr = d.object({
        "openai/toolSource": d.object({ version: d.literal(1), providers: Qdt }),
      })));
  });
function Dw(t) {
  if (t instanceof Error) return t.message;
  if (typeof t == "string") return t;
  if (typeof t == "object" && t != null && "message" in t) {
    let e = t.message;
    if (typeof e == "string" && e.length > 0) return e;
  }
  try {
    return JSON.stringify(t);
  } catch {
    return String(t);
  }
}
var ZI = g(() => {
  "use strict";
});
var gme = g(() => {
  "use strict";
});
var yme = g(() => {
  "use strict";
});
var tpt,
  XI = g(() => {
    "use strict";
    tpt = F(Is());
    Ap();
  });
var aW = g(() => {
  "use strict";
  Ap();
  XI();
});
var YI,
  vme = g(() => {
    "use strict";
    aW();
    Ap();
    YI = "codex_vscode_copilot";
  });
function bme(t) {
  if (t === "darwin") return lW.darwin;
  if (t === "linux") return lW.linux;
  if (t === "win32") return lW.win32;
}
var lW,
  Sme = g(() => {
    "use strict";
    lW = { darwin: "macOS", linux: "Linux", win32: "Windows" };
  });
function gu(t) {
  return t;
}
var cW = g(() => {
  "use strict";
});
function _me(t) {
  let e = ipt.safeParse(t).data;
  return e == null
    ? {}
    : Object.fromEntries(
        Object.entries(e).flatMap(([r, n]) => {
          let o = opt.safeParse(n).data;
          return o == null ? [] : [[r, o]];
        }),
      );
}
var wme,
  npt,
  opt,
  ipt,
  xme = g(() => {
    "use strict";
    $();
    Ti();
    cW();
    ((wme = d.object({
      accountId: d.string().min(1),
      userId: d.string().min(1),
      projectId: d.string().startsWith("g-p-"),
    })),
      (npt = d.object({
        accountId: d.string().min(1),
        userId: d.string().min(1),
        state: d.literal("requested"),
      })),
      (opt = d.object({
        id: d.string().transform(gu),
        name: d.string(),
        rootPaths: d.array(d.string()),
        chatGptBacking: wme.optional().catch(void 0),
        retiredChatGptBacking: wme.optional().catch(void 0),
        chatGptBackingCreation: npt.optional().catch(void 0),
        chatGptBackingRecoveryPending: d
          .literal(!0)
          .optional()
          .catch(void 0),
        createdAt: d.number(),
        updatedAt: d.number(),
      })),
      (ipt = d.record(d.string(), d.unknown())));
  });
function yu(t) {
  let e = t.trim();
  if (!e || /^[a-zA-Z]:[\\/]/.test(e)) return null;
  if (e.includes("://")) {
    let n = spt(e);
    return n.success ? n.value : null;
  }
  let r = apt(e);
  return r.success ? r.value : null;
}
function spt(t) {
  try {
    let e = new URL(t),
      r = e.hostname;
    if (!r) return { success: !1 };
    let n = e.pathname.replace(/^\/+/, "").replace(/\.git$/i, ""),
      o = Ame(n);
    return o.success ? { success: !0, value: { host: r, ...o.value } } : { success: !1 };
  } catch {
    return { success: !1 };
  }
}
function apt(t) {
  if (t.includes("://")) return { success: !1 };
  let e = /^(?:[^@]+@)?(\[[^\]]+\]|[^:]+):(.+)$/.exec(t);
  if (!e) return { success: !1 };
  let r = e[1]?.trim(),
    n = e[2]
      ?.trim()
      .replace(/^\/+/, "")
      .replace(/\.git$/i, "");
  if (!r || !n) return { success: !1 };
  let o = Ame(n);
  return o.success ? { success: !0, value: { host: r, ...o.value } } : { success: !1 };
}
function Ame(t) {
  let e = t.split("/").filter((o) => o.length > 0);
  if (e.length < 2) return { success: !1 };
  let r = e[e.length - 1];
  if (!r) return { success: !1 };
  let n = e.slice(0, -1).join("/");
  return n ? { success: !0, value: { owner: n, repo: r } } : { success: !1 };
}
var Rme = g(() => {
  "use strict";
});
var lpt,
  Eme = g(() => {
    "use strict";
    lpt = F(Is());
    Ap();
    XI();
  });
var cpt,
  Cme = g(() => {
    "use strict";
    cpt = F(Is());
  });
var Tme = g(() => {
  "use strict";
});
var Pme = g(() => {
  "use strict";
});
var Ime = g(() => {
  "use strict";
});
var kme = g(() => {
  "use strict";
});
var Dme = g(() => {
  "use strict";
  Zh();
  ql();
});
var upt,
  dpt,
  ppt,
  Ncr,
  Mme = g(() => {
    "use strict";
    $();
    Ti();
    ZI();
    ((upt = d
      .string()
      .trim()
      .min(1)
      .refine(
        (t) => t !== "." && t !== ".." && !t.includes("/") && !t.includes("\\"),
        "Expected a single path segment.",
      )),
      (dpt = d
        .string()
        .trim()
        .regex(/^[a-fA-F0-9]{64}$/)),
      (ppt = d
        .string()
        .trim()
        .pipe(d.url())
        .refine((t) => {
          let e = new URL(t);
          return (
            e.origin === "https://chatgpt.com" &&
            e.pathname.startsWith("/codex/app/updates/plugins/")
          );
        })),
      (Ncr = d.object({
        internalCdnUrl: ppt.optional(),
        sha256: dpt,
        url: d.string().trim().min(1),
        version: upt,
      })));
  });
var Ome = g(() => {
  "use strict";
});
var uW,
  $cr,
  Ucr,
  mpt,
  dW,
  Nme,
  fpt,
  hpt,
  gpt,
  ypt,
  vpt,
  qcr,
  Lme = g(() => {
    "use strict";
    $();
    ((uW = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"]),
      ($cr = new Map(uW.map((t, e) => [t, e]))),
      (Ucr = uW.slice(0, 5)),
      (mpt = d.enum(uW)),
      (dW = d.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/)),
      (Nme = d
        .array(mpt)
        .min(1)
        .refine((t) => new Set(t).size === t.length)),
      (fpt = d
        .object({
          type: d.literal("hourly"),
          intervalHours: d.number().int().positive(),
          days: Nme.optional(),
        })
        .strict()),
      (hpt = d.object({ type: d.literal("daily"), time: dW }).strict()),
      (gpt = d.object({ type: d.literal("weekdays"), time: dW }).strict()),
      (ypt = d.object({ type: d.literal("weekly"), days: Nme, time: dW }).strict()),
      (vpt = d.discriminatedUnion("type", [fpt, hpt, gpt, ypt])),
      (qcr = d
        .object({ name: d.string().trim().min(1), prompt: d.string().trim().min(1), schedule: vpt })
        .strict()));
  });
var Bme = g(() => {
  "use strict";
  hI();
});
function $me(t) {
  return Apt.safeParse(t).data ?? {};
}
function Rpt(t) {
  let e = d.string().safeParse(t).data;
  return e == null ? null : (Fme.safeParse(e).data ?? wpt[e] ?? null);
}
var bpt,
  Spt,
  Fme,
  wpt,
  _pt,
  xpt,
  Apt,
  Ume = g(() => {
    "use strict";
    $();
    ((bpt = [
      "folder",
      "currency-dollar",
      "book",
      "graduation-cap",
      "edit",
      "writing",
      "function",
      "terminal",
      "music",
      "popcorn",
      "customize",
      "palette",
      "stethoscope",
      "health",
      "lotus",
      "suitcase",
      "bar-chart",
      "kettlebell",
      "dumbbell",
      "logs",
      "scale",
      "desk-globe",
      "plane",
      "globe",
      "wrench",
      "paw",
      "flask",
      "brain",
      "heart",
      "plant",
    ]),
      (Spt = d.enum(["black", "blue", "green", "orange", "pink", "purple", "red", "yellow"])),
      (Fme = d.enum(bpt)),
      (wpt = {
        "balancing-scale": "scale",
        building: "folder",
        bug: "folder",
        cat: "paw",
        code: "function",
        "code-brackets": "function",
        cube: "folder",
        gift: "folder",
        "globe-spin": "desk-globe",
        graduation: "graduation-cap",
        lightbulb: "brain",
        lightning: "folder",
        lite: "lotus",
        network: "brain",
        notebook: "logs",
        openai: "folder",
        pencil: "edit",
        pens: "customize",
        pointer: "folder",
        presentation: "bar-chart",
        puzzle: "customize",
        search: "globe",
        star: "folder",
        target: "folder",
        waveform: "music",
      }),
      (_pt = d.union([
        d.object({ kind: d.literal("icon"), icon: d.preprocess((t) => Rpt(t) ?? t, Fme) }),
        d.object({ kind: d.literal("emoji"), emoji: d.string().min(1) }),
      ])),
      (xpt = d.object({ color: Spt, marker: _pt })),
      (Apt = d.record(d.string(), xpt)));
  });
var Ept,
  Kcr,
  qme = g(() => {
    "use strict";
    $();
    ((Ept = d.object({ kind: d.literal("local"), path: d.string(), label: d.string().optional() })),
      (Kcr = d.record(d.string(), d.array(Ept))));
  });
var Cpt,
  Ycr,
  Gme = g(() => {
    "use strict";
    $();
    ((Cpt = d.object({ kind: d.literal("local"), path: d.string(), label: d.string().optional() })),
      (Ycr = d.record(d.string(), d.array(Cpt))));
  });
var Wme = g(() => {
  "use strict";
});
var Hme = g(() => {
  "use strict";
});
var Tpt,
  Ppt,
  Ipt,
  jme,
  kpt,
  pW,
  zme,
  Dpt,
  rur,
  nur,
  our,
  iur,
  sur,
  aur,
  Vme = g(() => {
    "use strict";
    $();
    ((Tpt = d.enum(["approved", "changes_requested", "merged", "opened"])),
      (Ppt = d.object({
        actorLogin: d.string().nullable(),
        createdAt: d.string(),
        event: Tpt,
        id: d.string(),
        type: d.literal("event"),
        url: d.string().nullable(),
      })),
      (Ipt = d.enum(["comment", "review", "review_comment"])),
      (jme = {
        viewerCanReact: d.boolean().optional(),
        reactions: d
          .array(
            d.object({
              content: d.string(),
              emoji: d.string().optional(),
              count: d.number(),
              viewerHasReacted: d.boolean(),
            }),
          )
          .optional(),
      }),
      (kpt = d.object({
        ...jme,
        authorAvatarUrl: d.string().nullable().optional(),
        authorLogin: d.string().nullable(),
        body: d.string(),
        createdAt: d.string(),
        id: d.string(),
        nodeId: d.string().optional(),
        isPending: d.boolean().optional(),
        isDeleted: d.boolean().optional(),
        viewerCanReply: d.boolean().optional(),
        pendingReviewId: d.string().optional(),
        rawBody: d.string().optional(),
        url: d.string().nullable(),
        viewerCanDelete: d.boolean().optional(),
        viewerCanUpdate: d.boolean().optional(),
      })),
      (pW = d.object({
        ...jme,
        authorAvatarUrl: d.string().nullable().optional(),
        authorLogin: d.string().nullable(),
        authorType: d.string().optional(),
        body: d.string(),
        createdAt: d.string(),
        diffHunk: d.string().nullable().optional(),
        diffSnapshot: d
          .object({
            positionType: d.enum(["text", "image", "file"]),
            baseRevision: d.string().nullable().optional(),
            mergeBaseRevision: d.string().nullable().optional(),
            headRevision: d.string().nullable().optional(),
            basePath: d.string(),
            headPath: d.string(),
          })
          .nullable()
          .optional(),
        id: d.string(),
        inReplyToId: d.string().nullable().optional(),
        isResolved: d.boolean().optional(),
        isMinimized: d.boolean().optional(),
        isResolvable: d.boolean().optional(),
        isSystem: d.boolean().optional(),
        line: d.number().nullable().optional(),
        nodeId: d.string().optional(),
        isPending: d.boolean().optional(),
        isDeleted: d.boolean().optional(),
        viewerCanReply: d.boolean().optional(),
        pendingReviewId: d.string().optional(),
        originalLine: d.number().nullable().optional(),
        originalStartLine: d.number().nullable().optional(),
        path: d.string().nullable().optional(),
        rawBody: d.string().optional(),
        replies: d.array(kpt).optional(),
        reviewThreadId: d.string().nullable().optional(),
        side: d.enum(["left", "right"]).nullable().optional(),
        startLine: d.number().nullable().optional(),
        startSide: d.enum(["left", "right"]).nullable().optional(),
        type: Ipt,
        url: d.string().nullable(),
        viewerCanDelete: d.boolean().optional(),
        viewerCanResolve: d.boolean().optional(),
        viewerCanUnresolve: d.boolean().optional(),
        viewerCanUpdate: d.boolean().optional(),
      })),
      (zme = d.object({
        authorLogin: d.string().nullable(),
        authorName: d.string().nullable(),
        committedDate: d.string(),
        messageHeadline: d.string(),
        oid: d.string(),
        url: d.string().nullable(),
      })),
      (Dpt = d.object({
        commits: d.array(zme),
        createdAt: d.string(),
        id: d.string(),
        type: d.literal("commit_group"),
      })),
      (rur = d.object({ comments: d.array(pW), commits: d.array(zme) })),
      (nur = d.union([Ppt, pW, Dpt])),
      (our = d.object({ id: d.string(), isStandalone: d.boolean(), comments: d.array(pW) })),
      (iur = d.object({
        commentId: d.string(),
        canUpdate: d.boolean().optional(),
        canDelete: d.boolean().optional(),
        canResolve: d.boolean().optional(),
      })),
      (sur = d.object({ login: d.string(), avatarUrl: d.string().nullable() })),
      (aur = d.object({
        authorLogin: d.string().nullable(),
        createdAt: d.string().nullable(),
        mergedAt: d.string().nullable(),
        mergeUserLogin: d.string().nullable(),
      })));
  });
var Mpt,
  mW,
  uur,
  Kme = g(() => {
    "use strict";
    $();
    ((Mpt = d.enum(["user", "team"])),
      (mW = d.object({ kind: Mpt, id: d.string() })),
      (uur = d.object({
        key: d.discriminatedUnion("type", [
          d.object({ type: d.literal("principal"), principal: mW }),
          d.object({
            type: d.literal("imported"),
            kind: d.enum(["user", "team", "unknown"]),
            displayId: d.string(),
          }),
        ]),
        name: d.string().optional(),
        handle: d.string().optional(),
        avatarUrl: d.string().optional(),
        decision: d.enum(["approved", "changes_requested"]).nullable(),
        approvedOnPreviousRevision: d.boolean().optional(),
        commented: d.boolean(),
        isViewer: d.boolean(),
        importedPending: d.boolean(),
        required: d.boolean().optional(),
        nativeAddTarget: mW.optional(),
        nativeRemoveTarget: mW.optional(),
      })));
  });
var Zme = g(() => {
  "use strict";
});
var Xme = g(() => {
  "use strict";
});
var Yme = g(() => {
  "use strict";
});
var Jme = g(() => {
  "use strict";
});
var Qme = g(() => {
  "use strict";
});
var efe = g(() => {
  "use strict";
});
var tfe = g(() => {
  "use strict";
  hI();
});
function Vl(t) {
  let e = fW[t];
  return e === void 0 ? 0 : e;
}
function hW(t, e, r) {
  if (r != null && t.startsWith("thread-follower-")) return (fW[t] ?? 0) + 1;
  if (
    t === "thread-follower-interrupt-turn" &&
    e != null &&
    (!("expectedTurnId" in e) || e.expectedTurnId == null)
  )
    return 3;
  let n = fW[t];
  return n === void 0 ? 0 : n;
}
function gW(t, e, r) {
  return e === hW(t, void 0, r) || (r == null && t === "thread-follower-interrupt-turn" && e === 3);
}
var fW,
  rfe = g(() => {
    "use strict";
    fW = {
      "thread-stream-state-changed": 13,
      "thread-stream-following-changed": 1,
      "thread-stream-following-status-requested": 1,
      "ipc-connection-reset": 1,
      "thread-read-state-changed": 3,
      "thread-archived": 2,
      "thread-unarchived": 1,
      "thread-owner-discovery": 1,
      "thread-follower-start-turn": 2,
      "thread-follower-load-complete-history": 1,
      "thread-follower-compact-thread": 1,
      "thread-follower-steer-turn": 1,
      "thread-follower-interrupt-turn": 4,
      "thread-follower-update-thread-settings": 2,
      "thread-follower-update-daybreak": 1,
      "thread-follower-read-model-settings": 1,
      "thread-follower-edit-last-user-turn": 2,
      "thread-follower-command-approval-decision": 1,
      "thread-follower-file-approval-decision": 1,
      "thread-follower-permissions-request-approval-response": 1,
      "thread-follower-submit-user-input": 1,
      "thread-follower-submit-mcp-server-elicitation-response": 1,
      "thread-follower-set-queued-follow-ups-state": 3,
      "thread-follower-remove-queued-message": 1,
      "thread-follower-clear-queued-messages": 1,
      "thread-queued-followups-changed": 3,
    };
  });
var Sn,
  yur,
  nfe = g(() => {
    "use strict";
    $();
    ((Sn = d.number().nonnegative()),
      (yur = d.object({
        duration_ms: Sn,
        js_sample_records: Sn,
        js_sample_timestamps: Sn,
        js_self_profiling_available: d.boolean().optional(),
        native_trace_join_offset_ms: Sn.optional(),
        forced_layout_ms: Sn.optional(),
        long_frames: Sn.optional(),
        long_tasks: Sn.optional(),
        scroll_events: Sn,
        worst_input_delay_ms: Sn.optional(),
        worst_input_processing_ms: Sn.optional(),
        worst_input_presentation_ms: Sn.optional(),
        worst_input_ms: Sn.optional(),
        frame_cadence_fps: Sn.optional(),
        worst_frame_gap_ms: Sn,
        cls: Sn.optional(),
        heap_change_bytes: d.number().optional(),
        maitai_writes: Sn.optional(),
        maitai_changes: Sn.optional(),
        layout_read_candidates: Sn.optional(),
        overlapping_layout_reads: Sn.optional(),
      })));
  });
var yW = g(() => {
  "use strict";
});
var ife = A((Sur, ofe) => {
  var Opt = ew(),
    Npt = cI(),
    Lpt = 1,
    Bpt = 2;
  function Fpt(t, e, r, n) {
    var o = r.length,
      i = o,
      s = !n;
    if (t == null) return !i;
    for (t = Object(t); o--; ) {
      var a = r[o];
      if (s && a[2] ? a[1] !== t[a[0]] : !(a[0] in t)) return !1;
    }
    for (; ++o < i; ) {
      a = r[o];
      var l = a[0],
        c = t[l],
        u = a[1];
      if (s && a[2]) {
        if (c === void 0 && !(l in t)) return !1;
      } else {
        var p = new Opt();
        if (n) var m = n(c, u, l, t, e, p);
        if (!(m === void 0 ? Npt(u, c, Lpt | Bpt, n, p) : m)) return !1;
      }
    }
    return !0;
  }
  ofe.exports = Fpt;
});
var vW = A((wur, sfe) => {
  var $pt = ei();
  function Upt(t) {
    return t === t && !$pt(t);
  }
  sfe.exports = Upt;
});
var lfe = A((_ur, afe) => {
  var qpt = vW(),
    Gpt = _p();
  function Wpt(t) {
    for (var e = Gpt(t), r = e.length; r--; ) {
      var n = e[r],
        o = t[n];
      e[r] = [n, o, qpt(o)];
    }
    return e;
  }
  afe.exports = Wpt;
});
var bW = A((xur, cfe) => {
  function Hpt(t, e) {
    return function (r) {
      return r == null ? !1 : r[t] === e && (e !== void 0 || t in Object(r));
    };
  }
  cfe.exports = Hpt;
});
var dfe = A((Aur, ufe) => {
  var jpt = ife(),
    zpt = lfe(),
    Vpt = bW();
  function Kpt(t) {
    var e = zpt(t);
    return e.length == 1 && e[0][2]
      ? Vpt(e[0][0], e[0][1])
      : function (r) {
          return r === t || jpt(r, t, e);
        };
  }
  ufe.exports = Kpt;
});
var mfe = A((Rur, pfe) => {
  var Zpt = pw();
  function Xpt(t, e, r) {
    var n = t == null ? void 0 : Zpt(t, e);
    return n === void 0 ? r : n;
  }
  pfe.exports = Xpt;
});
var hfe = A((Eur, ffe) => {
  function Ypt(t, e) {
    return t != null && e in Object(t);
  }
  ffe.exports = Ypt;
});
var yfe = A((Cur, gfe) => {
  var Jpt = Cp(),
    Qpt = rw(),
    emt = Qi(),
    tmt = iw(),
    rmt = XP(),
    nmt = Tp();
  function omt(t, e, r) {
    e = Jpt(e, t);
    for (var n = -1, o = e.length, i = !1; ++n < o; ) {
      var s = nmt(e[n]);
      if (!(i = t != null && r(t, s))) break;
      t = t[s];
    }
    return i || ++n != o
      ? i
      : ((o = t == null ? 0 : t.length), !!o && rmt(o) && tmt(s, o) && (emt(t) || Qpt(t)));
  }
  gfe.exports = omt;
});
var SW = A((Tur, vfe) => {
  var imt = hfe(),
    smt = yfe();
  function amt(t, e) {
    return t != null && smt(t, e, imt);
  }
  vfe.exports = amt;
});
var Sfe = A((Pur, bfe) => {
  var lmt = cI(),
    cmt = mfe(),
    umt = SW(),
    dmt = dI(),
    pmt = vW(),
    mmt = bW(),
    fmt = Tp(),
    hmt = 1,
    gmt = 2;
  function ymt(t, e) {
    return dmt(t) && pmt(e)
      ? mmt(fmt(t), e)
      : function (r) {
          var n = cmt(r, t);
          return n === void 0 && n === e ? umt(r, t) : lmt(e, n, hmt | gmt);
        };
  }
  bfe.exports = ymt;
});
var _fe = A((Iur, wfe) => {
  function vmt(t) {
    return function (e) {
      return e?.[t];
    };
  }
  wfe.exports = vmt;
});
var Afe = A((kur, xfe) => {
  var bmt = pw();
  function Smt(t) {
    return function (e) {
      return bmt(e, t);
    };
  }
  xfe.exports = Smt;
});
var Efe = A((Dur, Rfe) => {
  var wmt = _fe(),
    _mt = Afe(),
    xmt = dI(),
    Amt = Tp();
  function Rmt(t) {
    return xmt(t) ? wmt(Amt(t)) : _mt(t);
  }
  Rfe.exports = Rmt;
});
var Mw = A((Mur, Cfe) => {
  var Emt = dfe(),
    Cmt = Sfe(),
    Tmt = ww(),
    Pmt = Qi(),
    Imt = Efe();
  function kmt(t) {
    return typeof t == "function"
      ? t
      : t == null
        ? Tmt
        : typeof t == "object"
          ? Pmt(t)
            ? Cmt(t[0], t[1])
            : Emt(t)
          : Imt(t);
  }
  Cfe.exports = kmt;
});
var Pfe = A((Our, Tfe) => {
  var Dmt = Mw(),
    Mmt = ng(),
    Omt = _p();
  function Nmt(t) {
    return function (e, r, n) {
      var o = Object(e);
      if (!Mmt(e)) {
        var i = Dmt(r, 3);
        ((e = Omt(e)),
          (r = function (a) {
            return i(o[a], a, o);
          }));
      }
      var s = t(e, r, n);
      return s > -1 ? o[i ? e[s] : s] : void 0;
    };
  }
  Tfe.exports = Nmt;
});
var wW = A((Nur, Ife) => {
  function Lmt(t, e, r, n) {
    for (var o = t.length, i = r + (n ? 1 : -1); n ? i-- : ++i < o; ) if (e(t[i], i, t)) return i;
    return -1;
  }
  Ife.exports = Lmt;
});
var Dfe = A((Lur, kfe) => {
  var Bmt = /\s/;
  function Fmt(t) {
    for (var e = t.length; e-- && Bmt.test(t.charAt(e)); );
    return e;
  }
  kfe.exports = Fmt;
});
var Ofe = A((Bur, Mfe) => {
  var $mt = Dfe(),
    Umt = /^\s+/;
  function qmt(t) {
    return t && t.slice(0, $mt(t) + 1).replace(Umt, "");
  }
  Mfe.exports = qmt;
});
var _W = A((Fur, Bfe) => {
  var Gmt = Ofe(),
    Nfe = ei(),
    Wmt = Rp(),
    Lfe = NaN,
    Hmt = /^[-+]0x[0-9a-f]+$/i,
    jmt = /^0b[01]+$/i,
    zmt = /^0o[0-7]+$/i,
    Vmt = parseInt;
  function Kmt(t) {
    if (typeof t == "number") return t;
    if (Wmt(t)) return Lfe;
    if (Nfe(t)) {
      var e = typeof t.valueOf == "function" ? t.valueOf() : t;
      t = Nfe(e) ? e + "" : e;
    }
    if (typeof t != "string") return t === 0 ? t : +t;
    t = Gmt(t);
    var r = jmt.test(t);
    return r || zmt.test(t) ? Vmt(t.slice(2), r ? 2 : 8) : Hmt.test(t) ? Lfe : +t;
  }
  Bfe.exports = Kmt;
});
var Ufe = A(($ur, $fe) => {
  var Zmt = _W(),
    Ffe = 1 / 0,
    Xmt = 17976931348623157e292;
  function Ymt(t) {
    if (!t) return t === 0 ? t : 0;
    if (((t = Zmt(t)), t === Ffe || t === -Ffe)) {
      var e = t < 0 ? -1 : 1;
      return e * Xmt;
    }
    return t === t ? t : 0;
  }
  $fe.exports = Ymt;
});
var JI = A((Uur, qfe) => {
  var Jmt = Ufe();
  function Qmt(t) {
    var e = Jmt(t),
      r = e % 1;
    return e === e ? (r ? e - r : e) : 0;
  }
  qfe.exports = Qmt;
});
var Wfe = A((qur, Gfe) => {
  var eft = wW(),
    tft = Mw(),
    rft = JI(),
    nft = Math.max,
    oft = Math.min;
  function ift(t, e, r) {
    var n = t == null ? 0 : t.length;
    if (!n) return -1;
    var o = n - 1;
    return (
      r !== void 0 && ((o = rft(r)), (o = r < 0 ? nft(n + o, 0) : oft(o, n - 1))),
      eft(t, tft(e, 3), o, !0)
    );
  }
  Gfe.exports = ift;
});
var xW = A((Gur, Hfe) => {
  var sft = Pfe(),
    aft = Wfe(),
    lft = sft(aft);
  Hfe.exports = lft;
});
var AW = g(() => {
  "use strict";
});
var cft,
  jfe = g(() => {
    "use strict";
    cft = F(xW());
    yW();
    AW();
  });
var zfe = g(() => {
  "use strict";
});
var tdr,
  rdr,
  Vfe = g(() => {
    "use strict";
    $();
    Ti();
    ql();
    zfe();
    ((tdr = d.object({ path: d.string().trim().min(1) })),
      (rdr = d.union([
        d.object({ kind: d.literal("chatgpt"), threadId: d.string().trim().min(1) }),
        d.object({ kind: d.literal("chatgpt"), clientThreadId: d.string().trim().min(1) }),
        d.object({
          kind: d.literal("codex").optional(),
          threadId: d.string().trim().min(1),
          hostId: d.string().trim().min(1).optional(),
        }),
        d.object({
          kind: d.literal("codex").optional(),
          clientThreadId: d.custom((t) => typeof t == "string" && VS(t)),
          hostId: d.string().trim().min(1).optional(),
        }),
      ])));
  });
var Kfe = g(() => {
  "use strict";
});
var Zfe,
  QI = g(() => {
    "use strict";
    Zfe = "App input requires confirmation before legacy delivery";
  });
var Xfe = g(() => {
  "use strict";
});
var Yfe = g(() => {
  BP();
});
var Jfe = g(() => {
  Yfe();
});
function hhe(t) {
  if (t.params.ref.type !== "ref/prompt")
    throw new TypeError(`Expected CompleteRequestPrompt, but got ${t.params.ref.type}`);
}
function ghe(t) {
  if (t.params.ref.type !== "ref/resource")
    throw new TypeError(`Expected CompleteRequestResourceTemplate, but got ${t.params.ref.type}`);
}
var EW,
  Qfe,
  vu,
  tk,
  wn,
  ehe,
  the,
  ldr,
  dft,
  pft,
  CW,
  Pi,
  Ow,
  rhe,
  Zn,
  rs,
  ns,
  Xn,
  rk,
  nhe,
  TW,
  ohe,
  ihe,
  PW,
  Nw,
  $e,
  IW,
  she,
  ahe,
  cdr,
  nk,
  mft,
  ok,
  fft,
  Lw,
  xg,
  lhe,
  hft,
  gft,
  yft,
  vft,
  bft,
  Sft,
  kW,
  wft,
  _ft,
  DW,
  ik,
  xft,
  Aft,
  sk,
  Rft,
  Bw,
  Fw,
  Eft,
  $w,
  Ag,
  Cft,
  Uw,
  ak,
  lk,
  ck,
  udr,
  uk,
  dk,
  pk,
  che,
  uhe,
  dhe,
  MW,
  phe,
  qw,
  Rg,
  mhe,
  Tft,
  mk,
  Pft,
  fk,
  Ift,
  OW,
  kft,
  hk,
  Dft,
  Mft,
  Oft,
  Nft,
  Lft,
  Bft,
  Fft,
  $ft,
  Uft,
  qft,
  gk,
  Gft,
  Wft,
  yk,
  Gw,
  Ww,
  NW,
  Hft,
  LW,
  BW,
  FW,
  jft,
  zft,
  Vft,
  Kft,
  Zft,
  fhe,
  vk,
  Xft,
  bk,
  ddr,
  Yft,
  Eg,
  Jft,
  pdr,
  Hw,
  Qft,
  $W,
  eht,
  tht,
  rht,
  nht,
  oht,
  iht,
  sht,
  ek,
  aht,
  lht,
  cht,
  jw,
  UW,
  uht,
  dht,
  pht,
  mht,
  fht,
  hht,
  ght,
  yht,
  vht,
  bht,
  Sht,
  wht,
  _ht,
  xht,
  Aht,
  Rht,
  Eht,
  Cht,
  Cg,
  Tht,
  Pht,
  Iht,
  Sk,
  kht,
  Dht,
  Mht,
  qW,
  Oht,
  mdr,
  fdr,
  hdr,
  gdr,
  ydr,
  vdr,
  Oe,
  RW,
  Wp = g(() => {
    Jfe();
    ((EW = "2025-11-25"),
      (Qfe = [EW, "2025-06-18", "2025-03-26", "2024-11-05", "2024-10-07"]),
      (vu = "io.modelcontextprotocol/related-task"),
      (tk = "2.0"),
      (wn = NP((t) => t !== null && (typeof t == "object" || typeof t == "function"))),
      (ehe = or([q(), Ht().int()])),
      (the = q()),
      (ldr = Vn({ ttl: Ht().optional(), pollInterval: Ht().optional() })),
      (dft = we({ ttl: Ht().optional() })),
      (pft = we({ taskId: q() })),
      (CW = Vn({ progressToken: ehe.optional(), [vu]: pft.optional() })),
      (Pi = we({ _meta: CW.optional() })),
      (Ow = Pi.extend({ task: dft.optional() })),
      (rhe = (t) => Ow.safeParse(t).success),
      (Zn = we({ method: q(), params: Pi.loose().optional() })),
      (rs = we({ _meta: CW.optional() })),
      (ns = we({ method: q(), params: rs.loose().optional() })),
      (Xn = Vn({ _meta: CW.optional() })),
      (rk = or([q(), Ht().int()])),
      (nhe = we({ jsonrpc: Me(tk), id: rk, ...Zn.shape }).strict()),
      (TW = (t) => nhe.safeParse(t).success),
      (ohe = we({ jsonrpc: Me(tk), ...ns.shape }).strict()),
      (ihe = (t) => ohe.safeParse(t).success),
      (PW = we({ jsonrpc: Me(tk), id: rk, result: Xn }).strict()),
      (Nw = (t) => PW.safeParse(t).success));
    (function (t) {
      ((t[(t.ConnectionClosed = -32e3)] = "ConnectionClosed"),
        (t[(t.RequestTimeout = -32001)] = "RequestTimeout"),
        (t[(t.ParseError = -32700)] = "ParseError"),
        (t[(t.InvalidRequest = -32600)] = "InvalidRequest"),
        (t[(t.MethodNotFound = -32601)] = "MethodNotFound"),
        (t[(t.InvalidParams = -32602)] = "InvalidParams"),
        (t[(t.InternalError = -32603)] = "InternalError"),
        (t[(t.UrlElicitationRequired = -32042)] = "UrlElicitationRequired"));
    })($e || ($e = {}));
    ((IW = we({
      jsonrpc: Me(tk),
      id: rk.optional(),
      error: we({ code: Ht().int(), message: q(), data: cr().optional() }),
    }).strict()),
      (she = (t) => IW.safeParse(t).success),
      (ahe = or([nhe, ohe, PW, IW])),
      (cdr = or([PW, IW])),
      (nk = Xn.strict()),
      (mft = rs.extend({ requestId: rk.optional(), reason: q().optional() })),
      (ok = ns.extend({ method: Me("notifications/cancelled"), params: mft })),
      (fft = we({
        src: q(),
        mimeType: q().optional(),
        sizes: vt(q()).optional(),
        theme: Kn(["light", "dark"]).optional(),
      })),
      (Lw = we({ icons: vt(fft).optional() })),
      (xg = we({ name: q(), title: q().optional() })),
      (lhe = xg.extend({
        ...xg.shape,
        ...Lw.shape,
        version: q(),
        websiteUrl: q().optional(),
        description: q().optional(),
      })),
      (hft = Vh(we({ applyDefaults: en().optional() }), lr(q(), cr()))),
      (gft = qS(
        (t) =>
          t && typeof t == "object" && !Array.isArray(t) && Object.keys(t).length === 0
            ? { form: {} }
            : t,
        Vh(we({ form: hft.optional(), url: wn.optional() }), lr(q(), cr()).optional()),
      )),
      (yft = Vn({
        list: wn.optional(),
        cancel: wn.optional(),
        requests: Vn({
          sampling: Vn({ createMessage: wn.optional() }).optional(),
          elicitation: Vn({ create: wn.optional() }).optional(),
        }).optional(),
      })),
      (vft = Vn({
        list: wn.optional(),
        cancel: wn.optional(),
        requests: Vn({ tools: Vn({ call: wn.optional() }).optional() }).optional(),
      })),
      (bft = we({
        experimental: lr(q(), wn).optional(),
        sampling: we({ context: wn.optional(), tools: wn.optional() }).optional(),
        elicitation: gft.optional(),
        roots: we({ listChanged: en().optional() }).optional(),
        tasks: yft.optional(),
        extensions: lr(q(), wn).optional(),
      })),
      (Sft = Pi.extend({ protocolVersion: q(), capabilities: bft, clientInfo: lhe })),
      (kW = Zn.extend({ method: Me("initialize"), params: Sft })),
      (wft = we({
        experimental: lr(q(), wn).optional(),
        logging: wn.optional(),
        completions: wn.optional(),
        prompts: we({ listChanged: en().optional() }).optional(),
        resources: we({ subscribe: en().optional(), listChanged: en().optional() }).optional(),
        tools: we({ listChanged: en().optional() }).optional(),
        tasks: vft.optional(),
        extensions: lr(q(), wn).optional(),
      })),
      (_ft = Xn.extend({
        protocolVersion: q(),
        capabilities: wft,
        serverInfo: lhe,
        instructions: q().optional(),
      })),
      (DW = ns.extend({ method: Me("notifications/initialized"), params: rs.optional() })),
      (ik = Zn.extend({ method: Me("ping"), params: Pi.optional() })),
      (xft = we({ progress: Ht(), total: sr(Ht()), message: sr(q()) })),
      (Aft = we({ ...rs.shape, ...xft.shape, progressToken: ehe })),
      (sk = ns.extend({ method: Me("notifications/progress"), params: Aft })),
      (Rft = Pi.extend({ cursor: the.optional() })),
      (Bw = Zn.extend({ params: Rft.optional() })),
      (Fw = Xn.extend({ nextCursor: the.optional() })),
      (Eft = Kn(["working", "input_required", "completed", "failed", "cancelled"])),
      ($w = we({
        taskId: q(),
        status: Eft,
        ttl: or([Ht(), MS()]),
        createdAt: q(),
        lastUpdatedAt: q(),
        pollInterval: sr(Ht()),
        statusMessage: sr(q()),
      })),
      (Ag = Xn.extend({ task: $w })),
      (Cft = rs.merge($w)),
      (Uw = ns.extend({ method: Me("notifications/tasks/status"), params: Cft })),
      (ak = Zn.extend({ method: Me("tasks/get"), params: Pi.extend({ taskId: q() }) })),
      (lk = Xn.merge($w)),
      (ck = Zn.extend({ method: Me("tasks/result"), params: Pi.extend({ taskId: q() }) })),
      (udr = Xn.loose()),
      (uk = Bw.extend({ method: Me("tasks/list") })),
      (dk = Fw.extend({ tasks: vt($w) })),
      (pk = Zn.extend({ method: Me("tasks/cancel"), params: Pi.extend({ taskId: q() }) })),
      (che = Xn.merge($w)),
      (uhe = we({ uri: q(), mimeType: sr(q()), _meta: lr(q(), cr()).optional() })),
      (dhe = uhe.extend({ text: q() })),
      (MW = q().refine(
        (t) => {
          try {
            return (atob(t), !0);
          } catch {
            return !1;
          }
        },
        { message: "Invalid Base64 string" },
      )),
      (phe = uhe.extend({ blob: MW })),
      (qw = Kn(["user", "assistant"])),
      (Rg = we({
        audience: vt(qw).optional(),
        priority: Ht().min(0).max(1).optional(),
        lastModified: yp.datetime({ offset: !0 }).optional(),
      })),
      (mhe = we({
        ...xg.shape,
        ...Lw.shape,
        uri: q(),
        description: sr(q()),
        mimeType: sr(q()),
        size: sr(Ht()),
        annotations: Rg.optional(),
        _meta: sr(Vn({})),
      })),
      (Tft = we({
        ...xg.shape,
        ...Lw.shape,
        uriTemplate: q(),
        description: sr(q()),
        mimeType: sr(q()),
        annotations: Rg.optional(),
        _meta: sr(Vn({})),
      })),
      (mk = Bw.extend({ method: Me("resources/list") })),
      (Pft = Fw.extend({ resources: vt(mhe) })),
      (fk = Bw.extend({ method: Me("resources/templates/list") })),
      (Ift = Fw.extend({ resourceTemplates: vt(Tft) })),
      (OW = Pi.extend({ uri: q() })),
      (kft = OW),
      (hk = Zn.extend({ method: Me("resources/read"), params: kft })),
      (Dft = Xn.extend({ contents: vt(or([dhe, phe])) })),
      (Mft = ns.extend({
        method: Me("notifications/resources/list_changed"),
        params: rs.optional(),
      })),
      (Oft = OW),
      (Nft = Zn.extend({ method: Me("resources/subscribe"), params: Oft })),
      (Lft = OW),
      (Bft = Zn.extend({ method: Me("resources/unsubscribe"), params: Lft })),
      (Fft = rs.extend({ uri: q() })),
      ($ft = ns.extend({ method: Me("notifications/resources/updated"), params: Fft })),
      (Uft = we({ name: q(), description: sr(q()), required: sr(en()) })),
      (qft = we({
        ...xg.shape,
        ...Lw.shape,
        description: sr(q()),
        arguments: sr(vt(Uft)),
        _meta: sr(Vn({})),
      })),
      (gk = Bw.extend({ method: Me("prompts/list") })),
      (Gft = Fw.extend({ prompts: vt(qft) })),
      (Wft = Pi.extend({ name: q(), arguments: lr(q(), q()).optional() })),
      (yk = Zn.extend({ method: Me("prompts/get"), params: Wft })),
      (Gw = we({
        type: Me("text"),
        text: q(),
        annotations: Rg.optional(),
        _meta: lr(q(), cr()).optional(),
      })),
      (Ww = we({
        type: Me("image"),
        data: MW,
        mimeType: q(),
        annotations: Rg.optional(),
        _meta: lr(q(), cr()).optional(),
      })),
      (NW = we({
        type: Me("audio"),
        data: MW,
        mimeType: q(),
        annotations: Rg.optional(),
        _meta: lr(q(), cr()).optional(),
      })),
      (Hft = we({
        type: Me("tool_use"),
        name: q(),
        id: q(),
        input: lr(q(), cr()),
        _meta: lr(q(), cr()).optional(),
      })),
      (LW = we({
        type: Me("resource"),
        resource: or([dhe, phe]),
        annotations: Rg.optional(),
        _meta: lr(q(), cr()).optional(),
      })),
      (BW = mhe.extend({ type: Me("resource_link") })),
      (FW = or([Gw, Ww, NW, BW, LW])),
      (jft = we({ role: qw, content: FW })),
      (zft = Xn.extend({ description: q().optional(), messages: vt(jft) })),
      (Vft = ns.extend({
        method: Me("notifications/prompts/list_changed"),
        params: rs.optional(),
      })),
      (Kft = we({
        title: q().optional(),
        readOnlyHint: en().optional(),
        destructiveHint: en().optional(),
        idempotentHint: en().optional(),
        openWorldHint: en().optional(),
      })),
      (Zft = we({ taskSupport: Kn(["required", "optional", "forbidden"]).optional() })),
      (fhe = we({
        ...xg.shape,
        ...Lw.shape,
        description: q().optional(),
        inputSchema: we({
          type: Me("object"),
          properties: lr(q(), wn).optional(),
          required: vt(q()).optional(),
        }).catchall(cr()),
        outputSchema: we({
          type: Me("object"),
          properties: lr(q(), wn).optional(),
          required: vt(q()).optional(),
        })
          .catchall(cr())
          .optional(),
        annotations: Kft.optional(),
        execution: Zft.optional(),
        _meta: lr(q(), cr()).optional(),
      })),
      (vk = Bw.extend({ method: Me("tools/list") })),
      (Xft = Fw.extend({ tools: vt(fhe) })),
      (bk = Xn.extend({
        content: vt(FW).default([]),
        structuredContent: lr(q(), cr()).optional(),
        isError: en().optional(),
      })),
      (ddr = bk.or(Xn.extend({ toolResult: cr() }))),
      (Yft = Ow.extend({ name: q(), arguments: lr(q(), cr()).optional() })),
      (Eg = Zn.extend({ method: Me("tools/call"), params: Yft })),
      (Jft = ns.extend({ method: Me("notifications/tools/list_changed"), params: rs.optional() })),
      (pdr = we({
        autoRefresh: en().default(!0),
        debounceMs: Ht().int().nonnegative().default(300),
      })),
      (Hw = Kn(["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"])),
      (Qft = Pi.extend({ level: Hw })),
      ($W = Zn.extend({ method: Me("logging/setLevel"), params: Qft })),
      (eht = rs.extend({ level: Hw, logger: q().optional(), data: cr() })),
      (tht = ns.extend({ method: Me("notifications/message"), params: eht })),
      (rht = we({ name: q().optional() })),
      (nht = we({
        hints: vt(rht).optional(),
        costPriority: Ht().min(0).max(1).optional(),
        speedPriority: Ht().min(0).max(1).optional(),
        intelligencePriority: Ht().min(0).max(1).optional(),
      })),
      (oht = we({ mode: Kn(["auto", "required", "none"]).optional() })),
      (iht = we({
        type: Me("tool_result"),
        toolUseId: q().describe("The unique identifier for the corresponding tool call."),
        content: vt(FW).default([]),
        structuredContent: we({}).loose().optional(),
        isError: en().optional(),
        _meta: lr(q(), cr()).optional(),
      })),
      (sht = BS("type", [Gw, Ww, NW])),
      (ek = BS("type", [Gw, Ww, NW, Hft, iht])),
      (aht = we({ role: qw, content: or([ek, vt(ek)]), _meta: lr(q(), cr()).optional() })),
      (lht = Ow.extend({
        messages: vt(aht),
        modelPreferences: nht.optional(),
        systemPrompt: q().optional(),
        includeContext: Kn(["none", "thisServer", "allServers"]).optional(),
        temperature: Ht().optional(),
        maxTokens: Ht().int(),
        stopSequences: vt(q()).optional(),
        metadata: wn.optional(),
        tools: vt(fhe).optional(),
        toolChoice: oht.optional(),
      })),
      (cht = Zn.extend({ method: Me("sampling/createMessage"), params: lht })),
      (jw = Xn.extend({
        model: q(),
        stopReason: sr(Kn(["endTurn", "stopSequence", "maxTokens"]).or(q())),
        role: qw,
        content: sht,
      })),
      (UW = Xn.extend({
        model: q(),
        stopReason: sr(Kn(["endTurn", "stopSequence", "maxTokens", "toolUse"]).or(q())),
        role: qw,
        content: or([ek, vt(ek)]),
      })),
      (uht = we({
        type: Me("boolean"),
        title: q().optional(),
        description: q().optional(),
        default: en().optional(),
      })),
      (dht = we({
        type: Me("string"),
        title: q().optional(),
        description: q().optional(),
        minLength: Ht().optional(),
        maxLength: Ht().optional(),
        format: Kn(["email", "uri", "date", "date-time"]).optional(),
        default: q().optional(),
      })),
      (pht = we({
        type: Kn(["number", "integer"]),
        title: q().optional(),
        description: q().optional(),
        minimum: Ht().optional(),
        maximum: Ht().optional(),
        default: Ht().optional(),
      })),
      (mht = we({
        type: Me("string"),
        title: q().optional(),
        description: q().optional(),
        enum: vt(q()),
        default: q().optional(),
      })),
      (fht = we({
        type: Me("string"),
        title: q().optional(),
        description: q().optional(),
        oneOf: vt(we({ const: q(), title: q() })),
        default: q().optional(),
      })),
      (hht = we({
        type: Me("string"),
        title: q().optional(),
        description: q().optional(),
        enum: vt(q()),
        enumNames: vt(q()).optional(),
        default: q().optional(),
      })),
      (ght = or([mht, fht])),
      (yht = we({
        type: Me("array"),
        title: q().optional(),
        description: q().optional(),
        minItems: Ht().optional(),
        maxItems: Ht().optional(),
        items: we({ type: Me("string"), enum: vt(q()) }),
        default: vt(q()).optional(),
      })),
      (vht = we({
        type: Me("array"),
        title: q().optional(),
        description: q().optional(),
        minItems: Ht().optional(),
        maxItems: Ht().optional(),
        items: we({ anyOf: vt(we({ const: q(), title: q() })) }),
        default: vt(q()).optional(),
      })),
      (bht = or([yht, vht])),
      (Sht = or([hht, ght, bht])),
      (wht = or([Sht, uht, dht, pht])),
      (_ht = Ow.extend({
        mode: Me("form").optional(),
        message: q(),
        requestedSchema: we({
          type: Me("object"),
          properties: lr(q(), wht),
          required: vt(q()).optional(),
        }),
      })),
      (xht = Ow.extend({ mode: Me("url"), message: q(), elicitationId: q(), url: q().url() })),
      (Aht = or([_ht, xht])),
      (Rht = Zn.extend({ method: Me("elicitation/create"), params: Aht })),
      (Eht = rs.extend({ elicitationId: q() })),
      (Cht = ns.extend({ method: Me("notifications/elicitation/complete"), params: Eht })),
      (Cg = Xn.extend({
        action: Kn(["accept", "decline", "cancel"]),
        content: qS(
          (t) => (t === null ? void 0 : t),
          lr(q(), or([q(), Ht(), en(), vt(q())])).optional(),
        ),
      })),
      (Tht = we({ type: Me("ref/resource"), uri: q() })),
      (Pht = we({ type: Me("ref/prompt"), name: q() })),
      (Iht = Pi.extend({
        ref: or([Pht, Tht]),
        argument: we({ name: q(), value: q() }),
        context: we({ arguments: lr(q(), q()).optional() }).optional(),
      })),
      (Sk = Zn.extend({ method: Me("completion/complete"), params: Iht })));
    ((kht = Xn.extend({
      completion: Vn({ values: vt(q()).max(100), total: sr(Ht().int()), hasMore: sr(en()) }),
    })),
      (Dht = we({
        uri: q().startsWith("file://"),
        name: q().optional(),
        _meta: lr(q(), cr()).optional(),
      })),
      (Mht = Zn.extend({ method: Me("roots/list"), params: Pi.optional() })),
      (qW = Xn.extend({ roots: vt(Dht) })),
      (Oht = ns.extend({ method: Me("notifications/roots/list_changed"), params: rs.optional() })),
      (mdr = or([ik, kW, Sk, $W, yk, gk, mk, fk, hk, Nft, Bft, Eg, vk, ak, ck, uk, pk])),
      (fdr = or([ok, sk, DW, Oht, Uw])),
      (hdr = or([nk, jw, UW, Cg, qW, lk, dk, Ag])),
      (gdr = or([ik, cht, Rht, Mht, ak, ck, uk, pk])),
      (ydr = or([ok, sk, tht, $ft, Mft, Jft, Vft, Uw, Cht])),
      (vdr = or([nk, _ft, kht, zft, Gft, Pft, Ift, Dft, bk, Xft, lk, dk, Ag])),
      (Oe = class t extends Error {
        constructor(e, r, n) {
          (super(`MCP error ${e}: ${r}`),
            (this.code = e),
            (this.data = n),
            (this.name = "McpError"));
        }
        static fromError(e, r, n) {
          if (e === $e.UrlElicitationRequired && n) {
            let o = n;
            if (o.elicitations) return new RW(o.elicitations, r);
          }
          return new t(e, r, n);
        }
      }),
      (RW = class extends Oe {
        constructor(e, r = `URL elicitation${e.length > 1 ? "s" : ""} required`) {
          super($e.UrlElicitationRequired, r, { elicitations: e });
        }
        get elicitations() {
          return this.data?.elicitations ?? [];
        }
      }));
  });
