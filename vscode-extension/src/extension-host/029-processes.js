function c0t(t) {
  if (t.permissions === ":read-only" || t.sandboxPolicy?.type === "readOnly") return [];
  if (
    (t.permissions != null && t.permissions !== ":workspace") ||
    (t.permissions == null && t.sandboxPolicy == null) ||
    t.sandboxPolicy?.type === "dangerFullAccess" ||
    t.sandboxPolicy?.type === "externalSandbox"
  )
    return null;
  let e = t.sandboxPolicy?.type === "workspaceWrite" ? t.sandboxPolicy : null,
    r = t.permissions === ":workspace" || e?.excludeSlashTmp === !1,
    n = t.permissions === ":workspace" || e?.excludeTmpdirEnvVar === !1,
    o = [
      ...(t.cwd == null ? [] : [t.cwd]),
      ...(t.runtimeWorkspaceRoots ?? []),
      ...(e?.writableRoots ?? []),
      ...(r ? ["/tmp"] : []),
      ...(n && process.env.TMPDIR != null ? [process.env.TMPDIR] : []),
    ];
  return o.length === 0 ? null : [...new Set(o)].map((i) => i);
}
function q6(t, e) {
  return `${t}\0${e}`;
}
var a0t,
  l0t,
  kx,
  G6 = g(() => {
    O();
    $();
    lx();
    vm();
    ((a0t = d.object({
      item: d.object({
        commandActions: d.array(d.object({ type: d.string() })).nullish(),
        type: d.literal("commandExecution"),
      }),
      threadId: d.string(),
      turnId: d.string(),
    })),
      (l0t = d.object({
        item: d.object({ type: d.enum(["mcpToolCall", "dynamicToolCall", "collabAgentToolCall"]) }),
        threadId: d.string(),
        turnId: d.string(),
      })),
      (kx = class {
        constructor(e) {
          this.enabled = e;
        }
        pendingByStartId = new Map();
        startedByTurnId = new Map();
        approvalThreadIdByRequestId = new Map();
        widenedThreadIds = new Set();
        hasPersistentExecpolicyApproval = !1;
        track(e, r) {
          this.enabled &&
            this.pendingByStartId.set(r, {
              cwds:
                this.hasPersistentExecpolicyApproval || this.widenedThreadIds.has(e.threadId)
                  ? null
                  : c0t(e),
              threadId: e.threadId,
            });
        }
        async trackStart(e, r, n) {
          this.track(e, r);
          try {
            return await n();
          } catch (o) {
            throw (this.discard(r), o);
          }
        }
        start(e, r) {
          let n = this.pendingByStartId.get(e);
          n != null &&
            (this.pendingByStartId.delete(e), this.startedByTurnId.set(q6(n.threadId, r), n));
        }
        observeCommandStarted(e) {
          if (!this.enabled) return;
          let r = a0t.safeParse(e);
          if (!r.success) {
            let o = l0t.safeParse(e);
            o.success && this.widen(o.data.threadId, o.data.turnId);
            return;
          }
          let { commandActions: n } = r.data.item;
          (n != null &&
            n.length > 0 &&
            n.every(({ type: o }) => o === "read" || o === "listFiles" || o === "search")) ||
            this.widen(r.data.threadId, r.data.turnId);
        }
        observeResponse(e, r, n) {
          if (r !== "turn/start") return;
          if (n.error != null) {
            this.discard(e);
            return;
          }
          let o = sy(n.result);
          o != null && this.start(e, o.id);
        }
        observeServerRequest(e) {
          if (this.enabled) {
            if (
              e.method === "item/commandExecution/requestApproval" ||
              e.method === "item/fileChange/requestApproval" ||
              e.method === "item/permissions/requestApproval"
            ) {
              (this.approvalThreadIdByRequestId.set(e.id, e.params.threadId),
                this.widen(e.params.threadId, e.params.turnId));
              return;
            }
            (e.method === "execCommandApproval" || e.method === "applyPatchApproval") &&
              (this.approvalThreadIdByRequestId.set(e.id, e.params.conversationId),
              this.widen(e.params.conversationId));
          }
        }
        observeClientResponse(e) {
          if (!this.enabled) return;
          let r = this.approvalThreadIdByRequestId.get(e.id);
          if ((this.approvalThreadIdByRequestId.delete(e.id), r == null)) return;
          let n = e.result?.decision;
          if (
            n != null &&
            typeof n == "object" &&
            ("acceptWithExecpolicyAmendment" in n || "approved_execpolicy_amendment" in n)
          ) {
            ((this.hasPersistentExecpolicyApproval = !0), this.widen());
            return;
          }
          (n === "acceptForSession" ||
            n === "approved_for_session" ||
            e.result?.scope === "session") &&
            (this.widenedThreadIds.add(r), this.widen(r));
        }
        take(e, r) {
          let n = q6(e, r),
            o = this.startedByTurnId.get(n);
          return o != null
            ? (this.startedByTurnId.delete(n), o.cwds)
            : (this.deletePending(e), null);
        }
        takeCompleted(e) {
          let r = ym(e),
            n = sy(e);
          return r == null || n == null ? null : this.take(r, n.id);
        }
        discard(e) {
          this.pendingByStartId.delete(e);
        }
        clear() {
          (this.pendingByStartId.clear(),
            this.startedByTurnId.clear(),
            this.approvalThreadIdByRequestId.clear(),
            this.widenedThreadIds.clear());
        }
        delete(e) {
          this.deletePending(e);
          for (let [r, n] of this.approvalThreadIdByRequestId)
            n === e && this.approvalThreadIdByRequestId.delete(r);
          this.widenedThreadIds.delete(e);
          for (let [r, n] of this.startedByTurnId)
            n.threadId === e && this.startedByTurnId.delete(r);
        }
        deletePending(e) {
          for (let [r, n] of this.pendingByStartId)
            n.threadId === e && this.pendingByStartId.delete(r);
        }
        widen(e, r) {
          let n = e != null && r != null ? this.startedByTurnId.get(q6(e, r)) : null;
          if (n != null) {
            n.cwds = null;
            return;
          }
          for (let o of [this.pendingByStartId, this.startedByTurnId])
            for (let i of o.values()) (e == null || i.threadId === e) && (i.cwds = null);
        }
      }));
  });
var u0t,
  F2r,
  $2r,
  U2r,
  q2r,
  K0e = g(() => {
    O();
    $();
    ((u0t = d.discriminatedUnion("type", [
      d.object({ type: d.literal("invalidRequest"), reason: d.literal("invalidParams") }),
      d.object({
        type: d.literal("unavailable"),
        reason: d.enum(["credentialMissing", "biometricsUnavailable", "providerUnavailable"]),
      }),
      d.object({ type: d.literal("cancelled"), reason: d.enum(["userCancelled", "interrupted"]) }),
      d.object({
        type: d.literal("failed"),
        reason: d.enum(["authenticationFailed", "timeout", "providerError", "serviceError"]),
      }),
    ])),
      (F2r = d.object({ jsonRpcCode: d.number().optional(), data: u0t.optional() })),
      ($2r = d.object({
        credentialId: d.string().nullable(),
        unavailableReason: d
          .enum(["credentialMissing", "biometricsUnavailable", "providerUnavailable"])
          .nullable(),
      })),
      (U2r = d.object({
        biometricType: d
          .enum(["fingerprint", "face", "voice", "pin", "optic"])
          .nullable()
          .catch(null),
        proof: d.object({
          credentialId: d
            .string()
            .min(1)
            .max(512)
            .regex(/^[A-Za-z0-9_-]+$/),
          signature: d
            .string()
            .min(1)
            .max(96)
            .regex(/^[A-Za-z0-9_-]+$/),
        }),
      })),
      (q2r = d.object({ threadId: d.string(), turn: d.object({ id: d.string() }) })));
  });
var Z0e = g(() => {});
var X0e = g(() => {});
var z2r,
  Y0e = g(() => {
    $();
    z2r = d.object({ failureReason: d.enum(["open_timeout", "pong_timeout"]) });
  });
var X2r,
  J0e = g(() => {
    O();
    $();
    X2r = d.object({
      error: d.object({
        code: d.enum([
          "EAI_AGAIN",
          "ENOTFOUND",
          "ECONNABORTED",
          "ECONNREFUSED",
          "ECONNRESET",
          "EHOSTUNREACH",
          "ENETUNREACH",
          "EPIPE",
          "EPROTO",
          "ETIMEDOUT",
          "CERT_HAS_EXPIRED",
          "CERT_NOT_YET_VALID",
          "CERT_REVOKED",
          "DEPTH_ZERO_SELF_SIGNED_CERT",
          "ERR_TLS_CERT_ALTNAME_INVALID",
          "SELF_SIGNED_CERT_IN_CHAIN",
          "UNABLE_TO_GET_ISSUER_CERT",
          "UNABLE_TO_GET_ISSUER_CERT_LOCALLY",
          "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
        ]),
      }),
    });
  });
var Q0e = g(() => {
  O();
});
var eDe = g(() => {
  cm();
});
var f0t,
  tDe,
  rDe = g(() => {
    f0t = F(Y_e());
    O();
    J_e();
    $u();
    $0();
    Sz();
    Rz();
    Bt();
    W0();
    Ua();
    Rxe();
    Exe();
    Cxe();
    Ixe();
    Dxe();
    Mxe();
    Oxe();
    Nxe();
    Bxe();
    Hxe();
    jxe();
    E4();
    Uz();
    C4();
    GCe();
    $4();
    WCe();
    VCe();
    z4();
    KCe();
    W4();
    aD();
    H4();
    ZCe();
    XCe();
    U4();
    Pz();
    YCe();
    JCe();
    lx();
    QCe();
    eTe();
    vm();
    eV();
    tV();
    nV();
    kTe();
    MTe();
    OTe();
    Ga();
    U6();
    iy();
    G6();
    K0e();
    cm();
    Mz();
    Z0e();
    j4();
    X0e();
    Y0e();
    J0e();
    Q0e();
    eDe();
    j_();
    H_();
    tDe = "AppServerCrash";
  });
var nDe = g(() => {});
function iDe(t, e = t.kind === "local" ? (t.websocket_url ?? null) : null) {
  let r;
  switch (t.kind) {
    case "local":
      r = [t.kind, t.id, e];
      break;
    case "ssh":
      r = [t.kind, t.id, t[h0t]];
      break;
    case "wsl":
      r = [t.kind, t.id, t.distro];
      break;
    case "remote-control":
      r = [t.kind, t.id, t.env_id];
      break;
  }
  let n = (0, oDe.createHash)("sha256").update(JSON.stringify(r)).digest("hex");
  return `${t.id}:${n}`;
}
var oDe,
  h0t,
  sDe = g(() => {
    ((oDe = require("node:crypto")), (h0t = "ssh_websocket_v0"));
  });
async function aDe(t, e) {
  let r = !1,
    n = e(() => {
      r = !0;
    });
  try {
    let o = await t();
    if (r || o == null) return null;
    if (o.authMethod === "chatgpt" || o.authMethod === "chatgptAuthTokens") {
      let i = Zg(o.authToken);
      return i == null ? null : { kind: "chatgpt", accountId: i.accountId, userId: i.userId };
    }
    return o.authMethod == null && o.requiresOpenaiAuth !== !1
      ? null
      : { kind: "execution-storage", authMode: o.authMethod ?? "none" };
  } finally {
    n();
  }
}
var lDe = g(() => {
  cm();
});
var cDe,
  t$r,
  W6 = g(() => {
    $();
    ((cDe = d.string().trim().min(1)),
      (t$r = d.object({ extensionIds: d.tuple([cDe]).rest(cDe) })));
  });
var uDe,
  dDe,
  g0t,
  o$r,
  i$r,
  s$r,
  Dx = g(() => {
    ((uDe = require("node:child_process")), (dDe = require("node:util")), (g0t = F(Bu())));
    os();
    ((o$r = (0, dDe.promisify)(uDe.execFile)), (i$r = 1024 * 1024), (s$r = 8 * 1024 * 1024));
  });
var pDe,
  mDe,
  w$r,
  _$r,
  x$r,
  A$r,
  R$r,
  b0t,
  S0t,
  E$r,
  C$r,
  T$r,
  P$r,
  fDe = g(() => {
    ((pDe = require("node:child_process")), (mDe = require("node:util")));
    hw();
    O();
    $();
    RD();
    os();
    Bt();
    Dx();
    W6();
    ((w$r = Dt("chrome-plugin-native-host-lifecycle")),
      (_$r = (0, mDe.promisify)(pDe.execFile)),
      (x$r = Qce.registryRoot),
      (A$r = 8 * 1024 * 1024),
      (R$r = [
        { nativeHostName: AI.production, pluginName: "chrome" },
        { nativeHostName: AI.dev, pluginName: "chrome-dev" },
        { nativeHostName: AI.internal, pluginName: "chrome-internal" },
      ]),
      (b0t = /^\d+\.\d+\.\d+(?:-[A-Za-z0-9.-]+)?$/),
      (S0t = d
        .string()
        .trim()
        .min(1)
        .refine(
          (t) => t !== "." && t !== ".." && !t.includes("/") && !t.includes("\\"),
          "Expected a single marketplace name.",
        )),
      (E$r = d.object({
        name: S0t,
        plugins: d.array(
          d.object({
            name: d.string().trim().min(1),
            source: d.object({ path: d.string().trim().min(1), source: d.literal("local") }),
          }),
        ),
      })),
      (C$r = d.object({ version: d.string().trim().regex(b0t) })),
      (T$r = d.object({ path: d.string().trim().min(1) })),
      (P$r = d.looseObject({ name: d.string().trim().min(1), path: d.string().trim().min(1) })));
  });
var gM,
  H6,
  j6,
  w0t,
  _0t,
  x0t,
  A0t,
  R0t,
  E0t,
  C0t,
  T0t,
  D$r,
  hDe = g(() => {
    $();
    ((gM = d.number().int().nonnegative()),
      (H6 = d.number().int().nonnegative().optional()),
      (j6 = d.number().int().positive().optional()),
      (w0t = d.number().int().nonnegative()),
      (_0t = d.number().int().positive()),
      (x0t = d.number().int().positive()),
      (A0t = d.record(d.string(), d.unknown())),
      (R0t = d.object({
        type: d.literal("ack"),
        client_id: d.string(),
        seq_id: gM,
        env_id: d.string(),
        stream_id: d.string(),
        skip_history: d.boolean().optional(),
        segment_id: H6,
        segment_count: j6,
      })),
      (E0t = d.object({
        type: d.literal("server_message"),
        client_id: d.string(),
        seq_id: gM,
        stream_id: d.string(),
        cursor: d.string().nullable().optional(),
        env_id: d.string(),
        message: A0t,
        skip_history: d.boolean().optional(),
        segment_id: H6,
        segment_count: j6,
      })),
      (C0t = d.object({
        type: d.literal("server_message_chunk"),
        client_id: d.string(),
        seq_id: gM,
        stream_id: d.string(),
        cursor: d.string().nullable().optional(),
        env_id: d.string(),
        skip_history: d.boolean().optional(),
        segment_id: w0t,
        segment_count: _0t,
        message_size_bytes: x0t,
        message_chunk_base64: d.string().min(1),
      })),
      (T0t = d.object({
        type: d.literal("pong"),
        client_id: d.string(),
        seq_id: gM,
        stream_id: d.string(),
        cursor: d.string().nullable().optional(),
        env_id: d.string(),
        status: d.enum(["active", "unknown"]),
        skip_history: d.literal(!0).optional(),
        segment_id: H6,
        segment_count: j6,
      })),
      (D$r = d.discriminatedUnion("type", [R0t, E0t, C0t, T0t])));
  });
var q$r,
  G$r,
  P0t,
  W$r,
  I0t,
  H$r,
  j$r,
  z$r,
  V$r,
  gDe = g(() => {
    N6();
    $();
    Bt();
    Ga();
    hDe();
    hM();
    ((q$r = Ie("remote-control-transport")),
      (G$r = 10 * 6e4),
      (P0t = 100 * 1024),
      (W$r = 150 * 1024),
      (I0t = 1024 * 1024 * 1024),
      (H$r = Math.ceil(I0t / P0t)),
      (j$r = d.object({
        type: d.literal("device_key_challenge"),
        nonce: d.string(),
        purpose: d.literal("remote_control_client_websocket"),
        audience: d.literal("remote_control_client_websocket"),
        sessionId: d.string(),
        targetOrigin: d.string(),
        targetPath: d.string(),
        accountUserId: d.string(),
        clientId: d.string(),
        tokenSha256Base64url: d.string(),
        tokenExpiresAt: d.number(),
        scopes: d.array(d.string()),
      })),
      (z$r = d.object({ type: d.literal("device_key_authenticated"), clientId: d.string() })),
      (V$r = d.object({ detail: d.literal("Unsupported client authentication method") }).strict()));
  });
function bDe({ homeDirectory: t, permissions: e, threadDetailLevel: r }) {
  if (r === "STEPS_COMMANDS")
    return { network: e.network ?? void 0, fileSystem: e.fileSystem ?? void 0 };
  if (e.fileSystem == null) return { network: e.network ?? void 0 };
  let n = M0t(e.fileSystem.entries ?? null, t);
  return {
    network: e.network ?? void 0,
    fileSystem: n == null ? void 0 : { ...e.fileSystem, read: null, write: null, entries: n },
  };
}
function M0t(t, e) {
  if (!t?.length) return null;
  let r = t.filter((n) => !O0t(n, e));
  return r.length === 0 ? null : r;
}
function O0t(t, e) {
  switch (t.access) {
    case "deny":
    case "read":
      return !1;
    case "write":
      return N0t(t.path, e);
  }
}
function N0t(t, e) {
  switch (t.type) {
    case "path":
      return L0t(t.path, e);
    case "glob_pattern":
      return !0;
    case "special":
      return U0t(t.value);
  }
}
function L0t(t, e) {
  let r = yDe(e),
    n = yM(e, r);
  if (n == null || n.length === 0) return !0;
  let o = r === "windows" || SDe(n),
    i = B0t(t, e, r, o) ?? (r === yDe(t) ? yM(t, r, o) : null);
  if (i == null || i.length <= n.length) return !0;
  let s = vDe(n, o),
    a = vDe(i, o);
  if (!s.every((c, u) => a[u] === c)) return !0;
  let l = i[n.length];
  return l == null
    ? !0
    : q0t({ homeDirectoryPathFlavor: r, homeDirectorySegments: n, requestedHomeChild: l });
}
function yDe(t) {
  let e = On(t);
  return /^\/\/(?:wsl\$|wsl\.localhost)\/[^/]+(?:\/|$)/i.test(e)
    ? "wsl"
    : Wl(t) || Ra(t)
      ? "windows"
      : "posix";
}
function yM(t, e, r = e === "windows") {
  let n = F0t(t, e);
  if (n == null) return null;
  let o = [];
  for (let i of n.split("/")) {
    let s = $0t(i, r);
    if (s.length === 0 || s === ".") continue;
    let a = r && s.length > 1 && /^\.+$/.test(s);
    if (s === ".." || a) return null;
    o.push(s);
  }
  return o;
}
function B0t(t, e, r, n) {
  let o = On(t);
  return r === "windows" &&
    (o.toLowerCase() === "%userprofile%" || o.toLowerCase().startsWith("%userprofile%/"))
    ? yM(`${e}/${o.slice(13)}`, r, n)
    : r !== "windows" && (o === "~" || o.startsWith("~/"))
      ? yM(`${e}/${o.slice(1)}`, r, n)
      : null;
}
function F0t(t, e) {
  let r = On(t);
  if (e === "windows") return r.toLowerCase();
  if (e === "posix") return r;
  let n = r.match(/^\/\/(?:wsl\$|wsl\.localhost)\/([^/]+)(?:\/(.*))?$/i);
  return n == null ? null : `/${n[1]}/${n[2] ?? ""}`;
}
function $0t(t, e) {
  if (!e) return t;
  let r = t.replace(/ +$/g, "");
  return /^\.+$/.test(r) ? r : r.replace(/[ .]+$/g, "");
}
function vDe(t, e) {
  return e ? t.map(wDe) : t;
}
function U0t(t) {
  switch (t.kind) {
    case "tmpdir":
    case "slash_tmp":
    case "minimal":
    case "project_roots":
      return !1;
    case "root":
    case "unknown":
      return !0;
  }
}
function q0t({ homeDirectoryPathFlavor: t, homeDirectorySegments: e, requestedHomeChild: r }) {
  let n = t === "windows" || SDe(e),
    o = n ? wDe(r) : r.toLowerCase();
  return n ? D0t.includes(o) : k0t.includes(o);
}
function SDe(t) {
  return t.length === 4 && t[0] === "mnt" && t[1]?.length === 1 && t[2]?.toLowerCase() === "users";
}
function wDe(t) {
  return t
    .toLowerCase()
    .replace(/ +$/g, "")
    .replace(/[ .]+$/g, "");
}
var k0t,
  D0t,
  z6 = g(() => {
    O();
    ((k0t = ["library"]), (D0t = ["appdata"]));
  });
var _De = g(() => {
  O();
});
var xDe,
  ADe,
  V6 = g(() => {
    "use strict";
    ((xDe =
      "When the user asks to create, view, update, delete, or ask about automations, search for the `automation_update` tool first, then follow its schema instead of writing raw automation directives by hand."),
      (ADe =
        'The current heartbeat trigger includes `<automation_id>`. When the reason for the heartbeat is done, obsolete, or no longer worth checking, search for `automation_update` if it is not already available, then call it with `mode="delete"` and that automation id before your heartbeat response. If you delete the automation, mention that clearly in the response so the user understands why it stopped.'));
  });
var rUr,
  RDe = g(() => {
    "use strict";
    V6();
    rUr = `## Heartbeats

The scheduler supplies a \`<heartbeat>\` record with the automation ID, check-in time, and saved task. For user-authored instructions the record arrives as a user message. For model-authored instructions it arrives as automation tool output. Use the record to identify the scheduled work.

A general guideline is to use your existing tools and capabilities. Orient yourself, be proactive, and think big picture. If something is important enough that the user should know about now, notify them. Otherwise, stay quiet.

Routine polling results are quiet by default. Choose \`DONT_NOTIFY\` when the monitored state is unchanged or still non-actionable, such as pending, queued, in progress, or healthy. Choose \`NOTIFY\` only for a meaningful update the user should know about now, such as completion, failure, a material state change, or required user action. Do not treat the heartbeat firing, work performed, or an automation prompt's generic request for a status update as sufficient reason to notify. Honor routine periodic updates only when the user explicitly asked for them.

\`\`\`xml
<heartbeat>
  <automation_id>automation id string</automation_id>
  <decision>NOTIFY</decision>
  <message>One short user-facing notification message.</message>
</heartbeat>
\`\`\`

\`\`\`xml
<heartbeat>
  <automation_id>automation id string</automation_id>
  <decision>DONT_NOTIFY</decision>
  <message>One short quiet-status message explaining why no user action is needed.</message>
</heartbeat>
\`\`\`

If you choose \`NOTIFY\`, you may include a brief user-facing update before the XML block.
If you choose \`DONT_NOTIFY\`, include the short quiet-status \`<message>\`, but do not include any user-facing prose outside the XML block, including commentary or progress updates while the heartbeat runs.

Every heartbeat turn must end with exactly one non-empty final response containing one of the XML blocks above. Never finish a heartbeat with an empty final response, even when there is no change to report; return the \`DONT_NOTIFY\` block with a short quiet-status message instead.

${ADe} If the task has changed and the heartbeat is still useful, update the automation instead of leaving stale instructions in place.`;
  });
var uUr,
  EDe = g(() => {
    O();
    V6();
    RDe();
    dm();
    uUr = `### Automations
- When you write or rewrite an automation prompt, keep it within ${Qq.toLocaleString("en-US")} estimated tokens.
- When the user asks to manage an app automation, set a reminder, or schedule a recurring task, use the relevant Automations action to help the user. Do not write raw automation directives by hand.
- Create an automation when the user wants a reminder, a recurring report, or a standing alert for future events.
- Do not create an automation to track a specific job or task through a milestone, failure, or completion. If the user asks you to watch a run or task to completion, keep checking in the current task and follow through when the requested condition is met.
- Unless the user asks for periodic updates, notify them only on a meaningful change, completion, failure, or required user action.
- ${xDe}
- When an automation should archive a Codex thread on completion, use \`set_thread_archived\` instead of emitting raw archive directives.`;
  });
async function IDe(t, e, r) {
  let n;
  try {
    n = await e.platformFamily();
  } catch {
    return {};
  }
  let o = await Promise.all(
    t.map(async (i) => {
      try {
        let s = null;
        return (
          n !== "windows"
            ? (s = await CI(
                i,
                e,
                e.isLocal && (0, PDe.platform)() === "darwin" ? "/bin/pwd" : "pwd",
                r,
              ))
            : e.isLocal
              ? (s = await (0, TDe.realpath)(i))
              : (s = await H0t(i, e, r)),
          s == null ? null : [i, s]
        );
      } catch {
        return null;
      }
    }),
  );
  return Object.fromEntries(o.filter((i) => i != null));
}
async function H0t(t, e, r) {
  let n = await e.spawn({
      args: [`${CDe}\\powershell.exe`, "-NoProfile", "-NonInteractive", "-Command", W0t, t],
      cwd: CDe,
      ...Sw,
      signal: r,
    }),
    { code: o, stdout: i } = await _r(n);
  return o !== 0 || i.length === 0 ? null : i;
}
var TDe,
  PDe,
  CDe,
  W0t,
  kDe = g(() => {
    ((TDe = require("node:fs/promises")), (PDe = require("node:os")));
    O();
    Yg();
    ((CDe = "C:\\Windows\\System32\\WindowsPowerShell\\v1.0"),
      (W0t = `
$fullPath = [IO.Path]::GetFullPath($args[0])
$currentPath = [IO.Path]::GetPathRoot($fullPath)
foreach ($segment in $fullPath.Substring($currentPath.Length) -split '[\\\\/]') {
  if ($segment.Length -eq 0) {
    continue
  }
  $item = Get-Item -LiteralPath (Join-Path $currentPath $segment) -Force
  while ($null -ne $item.Target) {
    $target = @($item.Target)[0]
    if (-not [IO.Path]::IsPathRooted($target)) {
      $target = Join-Path $item.Parent.FullName $target
    }
    $item = Get-Item -LiteralPath $target -Force
  }
  $currentPath = $item.FullName
}
[Console]::Out.Write($currentPath)
`.trim()));
  });
function* MDe(t, e) {
  let r = 0;
  yield { marker: RI, kind: "start", transferId: e.transferId, sequence: r };
  let n = V0t(t, Math.max(1, Math.floor(e.batchTargetBytes / 4))),
    o = null;
  for (;;) {
    let i = [],
      s = 0;
    for (;;) {
      let a = o == null ? n.next() : { done: !1, value: o };
      if (((o = null), a.done)) break;
      let l = K0t(a.value);
      if (i.length > 0 && s + l > e.batchTargetBytes) {
        o = a.value;
        break;
      }
      (i.push(a.value), (s += l));
    }
    if (i.length === 0) break;
    ((r += 1),
      yield { marker: RI, kind: "chunk", transferId: e.transferId, sequence: r, tokens: i });
  }
  ((r += 1), yield { marker: RI, kind: "end", transferId: e.transferId, sequence: r });
}
function* V0t(t, e) {
  let r = new WeakSet(),
    n = [{ type: "value", value: t }];
  for (; n.length > 0; ) {
    let o = n.pop();
    if (o == null) return;
    if (o.type === "token") {
      yield o.token;
      continue;
    }
    if (o.type === "leave") {
      r.delete(o.value);
      continue;
    }
    if (o.type === "string") {
      yield* DDe(o.value, o.target, e);
      continue;
    }
    if (o.type === "values") {
      let s = o.values.next();
      s.done || n.push(o, { type: "value", value: s.value });
      continue;
    }
    if (o.type === "entries") {
      let s = o.entries.next();
      s.done ||
        n.push(
          o,
          { type: "value", value: s.value[1] },
          { type: "string", value: s.value[0], target: "key" },
        );
      continue;
    }
    let i = o.value;
    if (typeof i == "string") {
      yield* DDe(i, "value", e);
      continue;
    }
    if (i == null || typeof i == "number" || typeof i == "boolean" || typeof i > "u") {
      yield { type: "value", value: i };
      continue;
    }
    if (typeof i != "object") throw new Error(`Unsupported chunked message value: ${typeof i}`);
    if (r.has(i)) throw new Error("Chunked messages cannot contain cyclic values");
    if ((r.add(i), Hu(i) || Array.isArray(i))) {
      (yield { type: "array-start" },
        n.push(
          { type: "leave", value: i },
          { type: "token", token: { type: "container-end" } },
          { type: "values", values: Hu(i) ? Z0t(i) : i.values() },
        ));
      continue;
    }
    (yield { type: "object-start" },
      n.push(
        { type: "leave", value: i },
        { type: "token", token: { type: "container-end" } },
        { type: "entries", entries: Object.entries(i).values() },
      ));
  }
}
function* DDe(t, e, r) {
  if (t.length <= r) {
    e === "key" ? yield { type: "key", value: t } : yield { type: "value", value: t };
    return;
  }
  yield { type: "string-start", target: e };
  for (let n = 0; n < t.length; n += r) yield { type: "string-chunk", value: t.slice(n, n + r) };
  yield { type: "string-end" };
}
function K0t(t) {
  let e = null;
  return (
    (t.type === "key" || t.type === "value" || t.type === "string-chunk") && (e = t.value),
    j0t + (typeof e == "string" ? e.length * 2 : z0t)
  );
}
function* Z0t(t) {
  for (let e of t.chunks) yield* e;
}
var j0t,
  z0t,
  K6 = g(() => {
    "use strict";
    rx();
    yw();
    ((j0t = 64), (z0t = 16));
  });
function Z6(t) {
  return t != null && typeof t == "object";
}
var ODe,
  Y0t,
  vM,
  NDe = g(() => {
    ODe = require("node:crypto");
    rx();
    K6();
    yw();
    T4();
    ((Y0t = 4 * 1024 * 1024),
      (vM = class {
        constructor(e) {
          this.options = e;
          ((this.batchTargetBytes = e.batchTargetBytes ?? 2097152),
            (this.inlineThresholdBytes = e.inlineThresholdBytes ?? Y0t));
        }
        batchTargetBytes;
        inlineThresholdBytes;
        targets = new Map();
        send(e, r) {
          let n = this.shouldChunk(r),
            o = this.targets.get(e);
          if (o == null && !n) {
            this.options.deliver(e, r, null);
            return;
          }
          let i = o ?? this.createTarget(e);
          (i.messages.push({ chunked: n, message: r }), this.drain(i));
        }
        sendInline(e, r) {
          let n = this.targets.get(e);
          if (n == null) {
            this.options.deliver(e, r, null);
            return;
          }
          (n.messages.push({ chunked: !1, message: r }), this.drain(n));
        }
        sendCritical(e, r) {
          let n = this.shouldChunk(r),
            o = this.targets.get(e);
          if (!n && o == null)
            try {
              this.options.deliver(e, r, null);
              return;
            } catch (s) {
              let a = this.createTarget(e);
              (a.criticalMessages.push({ chunked: !1, message: r }), this.handleSendError(a, s));
              return;
            }
          let i = o ?? this.createTarget(e);
          (i.criticalMessages.push({ chunked: n, message: r }),
            n ? this.drain(i) : (this.drainCritical(i), this.drain(i)));
        }
        acknowledge(e, r, n) {
          let o = this.targets.get(e),
            i = o?.transfer;
          if (
            !(
              o == null ||
              o.sending ||
              i == null ||
              !i.delivered ||
              i.id !== r ||
              i.part?.sequence !== n
            )
          ) {
            if (i.part.kind === "end") {
              ((o.transfer = null), this.drain(o));
              return;
            }
            this.sendNextPart(o, i);
          }
        }
        dispose(e) {
          let r = this.targets.get(e);
          r != null && this.cleanup(r);
        }
        shouldChunk(e) {
          let r = this.options.getPayload(e);
          if ("message" in r && Z6(r.message)) {
            let n =
              dD(r.message) ??
              ("result" in r.message && Z6(r.message.result) ? dD(r.message.result) : void 0);
            if (n != null) return n > this.inlineThresholdBytes;
          }
          if ("params" in r && Z6(r.params)) {
            let n = dD(r.params);
            if (n != null) return n > this.inlineThresholdBytes;
          }
          return yCe(r, this.inlineThresholdBytes);
        }
        createTarget(e) {
          let r = {
            criticalMessages: [],
            draining: !1,
            loading: this.options.isLoading?.(e) === !0,
            messages: [],
            retryTimer: null,
            sending: !1,
            target: e,
            transfer: null,
            unsubscribe: null,
          };
          return (
            this.targets.set(e, r),
            (r.unsubscribe =
              this.options.subscribe?.(e, {
                onDestroyed: () => this.cleanup(r),
                onLoaded: () => this.handleLoaded(r),
                onLoading: () => this.handleLoading(r),
              }) ?? null),
            r
          );
        }
        drain(e) {
          if (
            !(
              e.draining ||
              e.loading ||
              e.sending ||
              e.transfer != null ||
              this.targets.get(e.target) !== e
            )
          ) {
            e.draining = !0;
            try {
              if ((this.drainCritical(e), e.retryTimer != null)) return;
              for (; e.transfer == null; ) {
                let r = e.criticalMessages.shift(),
                  n = r ?? e.messages.shift();
                if (n == null) break;
                if (!n.chunked) {
                  try {
                    this.options.deliver(e.target, n.message, null);
                  } catch (s) {
                    (e.messages.unshift(n), this.handleSendError(e, s));
                    break;
                  }
                  continue;
                }
                let o = (0, ODe.randomUUID)(),
                  i = {
                    critical: r != null,
                    delivered: !1,
                    id: o,
                    iterator: MDe(this.options.getPayload(n.message), {
                      batchTargetBytes: this.batchTargetBytes,
                      transferId: o,
                    }),
                    message: n.message,
                    part: null,
                  };
                ((e.transfer = i), this.sendNextPart(e, i));
              }
            } finally {
              e.draining = !1;
            }
            e.transfer == null &&
              e.messages.length === 0 &&
              e.criticalMessages.length === 0 &&
              this.cleanup(e);
          }
        }
        drainCritical(e) {
          if (
            !(
              e.loading ||
              e.sending ||
              e.transfer?.critical === !0 ||
              e.retryTimer != null ||
              this.targets.get(e.target) !== e
            )
          )
            for (; e.criticalMessages.length > 0; ) {
              let r = e.criticalMessages[0];
              if (r == null || r.chunked) return;
              (e.criticalMessages.shift(), (e.sending = !0));
              try {
                this.options.deliver(e.target, r.message, null);
              } catch (n) {
                (e.criticalMessages.unshift(r), this.handleSendError(e, n));
                return;
              } finally {
                e.sending = !1;
              }
            }
        }
        sendNextPart(e, r) {
          let n;
          try {
            n = r.iterator.next();
          } catch (o) {
            ((e.transfer = null), this.requeueTransfer(e, r), this.handleSendError(e, o));
            return;
          }
          if (n.done) {
            ((e.transfer = null),
              this.requeueTransfer(e, r),
              this.handleSendError(
                e,
                new Error("Chunked message transfer ended without an end part"),
              ));
            return;
          }
          ((r.part = n.value), (r.delivered = !1), this.sendCurrentPart(e, r));
        }
        sendCurrentPart(e, r) {
          let n = r.part;
          if (!(n == null || e.transfer !== r || this.targets.get(e.target) !== e)) {
            if (this.options.isAvailable?.(e.target) === !1) {
              this.cleanup(e);
              return;
            }
            e.sending = !0;
            try {
              (this.options.deliver(e.target, r.message, n), (r.delivered = !0));
            } catch (o) {
              this.handleSendError(e, o);
            } finally {
              e.sending = !1;
            }
          }
        }
        handleSendError(e, r) {
          this.options.onSendError(e.target, r);
          let n = this.options.retryDelayMs;
          if (n == null) {
            this.cleanup(e);
            return;
          }
          e.retryTimer == null &&
            (e.retryTimer = setTimeout(() => {
              ((e.retryTimer = null),
                this.drainCritical(e),
                e.retryTimer == null &&
                  (e.transfer != null &&
                    !e.transfer.delivered &&
                    this.sendCurrentPart(e, e.transfer),
                  e.transfer == null && this.drain(e)));
            }, n));
        }
        handleLoading(e) {
          if (this.targets.get(e.target) !== e) return;
          ((e.loading = !0),
            e.retryTimer != null && (clearTimeout(e.retryTimer), (e.retryTimer = null)));
          let r = e.transfer;
          r != null && ((e.transfer = null), this.requeueTransfer(e, r));
        }
        handleLoaded(e) {
          this.targets.get(e.target) === e &&
            ((e.loading = !1), this.drainCritical(e), this.drain(e));
        }
        cleanup(e) {
          this.targets.delete(e.target) &&
            (e.retryTimer != null && clearTimeout(e.retryTimer),
            (e.messages.length = 0),
            (e.criticalMessages.length = 0),
            (e.transfer = null),
            e.unsubscribe?.(),
            (e.unsubscribe = null));
        }
        requeueTransfer(e, r) {
          let n = { chunked: !0, message: r.message };
          r.critical ? e.criticalMessages.unshift(n) : e.messages.unshift(n);
        }
      }));
  });
var LDe,
  BDe = g(() => {
    "use strict";
    LDe = [
      {
        id: "spotlightSearch",
        titleIntlId: "codex.command.spotlightSearch",
        descriptionIntlId: "codex.commandDescription.spotlightSearch",
        shortcutScope: "os-global",
        electron: { platformDefaultKeybindings: { macOS: [{ key: "Alt+K" }], default: [] } },
      },
      {
        id: "toggleNotch",
        titleIntlId: "codex.command.toggleNotch",
        descriptionIntlId: "codex.commandDescription.toggleNotch",
        shortcutScope: "os-global",
        electron: {
          menuTitle: "Toggle Notch",
          platformDefaultKeybindings: { macOS: [{ key: "Alt+C" }], default: [] },
        },
      },
      {
        id: "notchVoice",
        titleIntlId: "codex.command.notchVoice",
        descriptionIntlId: "codex.commandDescription.notchVoice",
        shortcutScope: "os-global",
        electron: {
          menuTitle: "Voice in Notch",
          platformDefaultKeybindings: { macOS: [{ key: "Alt+V" }], default: [] },
        },
      },
      {
        id: "screenshotToCurrentChat",
        titleIntlId: "codex.command.screenshotToCurrentChat",
        descriptionIntlId: "codex.commandDescription.screenshotToCurrentChat",
        shortcutScope: "os-global",
        requiredAccess: "codexOrWorkLocal",
        electron: {
          platformDefaultKeybindings: { macOS: [{ key: "Control+Shift+4" }], default: [] },
        },
      },
      {
        id: "screenshotToNewChat",
        titleIntlId: "codex.command.screenshotToNewChat",
        descriptionIntlId: "codex.commandDescription.screenshotToNewChat",
        shortcutScope: "os-global",
        requiredAccess: "codexOrWorkLocal",
        electron: {
          platformDefaultKeybindings: { macOS: [{ key: "Control+Alt+Shift+4" }], default: [] },
        },
      },
      {
        id: "hotkeyWindow",
        titleIntlId: "codex.command.hotkeyWindow",
        descriptionIntlId: "codex.commandDescription.hotkeyWindow",
        requiredAccess: "codexLocal",
        shortcutScope: "os-global",
      },
      {
        id: "globalDictationHold",
        titleIntlId: "codex.command.globalDictationHold",
        descriptionIntlId: "codex.commandDescription.globalDictationHold",
        shortcutScope: "os-global",
        platformShortcutScopes: { linux: "app" },
        allowsBareModifiers: !0,
      },
      {
        id: "globalDictationSingleTap",
        titleIntlId: "codex.command.globalDictationSingleTap",
        descriptionIntlId: "codex.commandDescription.globalDictationSingleTap",
        shortcutScope: "os-global",
        platformShortcutScopes: { linux: "app" },
        allowsBareModifiers: !0,
      },
      {
        id: "realtimeVoice",
        titleIntlId: "codex.command.realtimeVoice",
        descriptionIntlId: "codex.commandDescription.realtimeVoice",
        shortcutScope: "os-global",
        allowsBareModifiers: !0,
      },
      {
        id: "copyConversationPath",
        descriptionIntlId: "codex.commandDescription.copyConversationPath",
        requiredAccess: "codexLocal",
        electron: {
          menuTitle: "Copy conversation path",
          menuTitleIntlId: "codex.commandMenuTitle.copyConversationPath",
          defaultKeybindings: [{ key: "CmdOrCtrl+Alt+Shift+C" }],
        },
      },
      {
        id: "copyDeeplink",
        descriptionIntlId: "codex.commandDescription.copyDeeplink",
        electron: {
          menuTitle: "Copy deeplink",
          menuTitleIntlId: "codex.commandMenuTitle.copyDeeplink",
          defaultKeybindings: [{ key: "CmdOrCtrl+Alt+L" }],
        },
      },
      {
        id: "copyWorkingDirectory",
        descriptionIntlId: "codex.commandDescription.copyWorkingDirectory",
        requiredAccess: "codexLocal",
        electron: {
          menuTitle: "Copy working directory",
          menuTitleIntlId: "codex.commandMenuTitle.copyWorkingDirectory",
          defaultKeybindings: [{ key: "CmdOrCtrl+Shift+C" }],
        },
      },
      {
        id: "reopenGlobalTab",
        descriptionIntlId: "codex.commandDescription.reopenGlobalTab",
        electron: {
          menuTitle: "Reopen closed global tab",
          menuTitleIntlId: "codex.commandMenuTitle.reopenGlobalTab",
          defaultKeybindings: [],
        },
      },
      {
        id: "closeTab",
        descriptionIntlId: "codex.commandDescription.closeTab",
        electron: {
          menuTitle: "Close Tab",
          menuTitleIntlId: "codex.commandMenuTitle.closeTab",
          defaultKeybindings: [{ key: "CmdOrCtrl+W" }],
          platformDefaultKeybindings: { default: [{ key: "Ctrl+W" }, { key: "Ctrl+F4" }] },
        },
      },
      {
        id: "closeWindow",
        descriptionIntlId: "codex.commandDescription.closeWindow",
        electron: {
          menuTitle: "Close",
          menuTitleIntlId: "codex.commandMenuTitle.closeWindow",
          defaultKeybindings: [{ key: "CmdOrCtrl+W" }],
          platformDefaultKeybindings: { default: [{ key: "Ctrl+W" }, { key: "Ctrl+F4" }] },
        },
      },
      {
        id: "reloadBrowserPage",
        descriptionIntlId: "codex.commandDescription.reloadBrowserPage",
        electron: {
          menuTitle: "Reload Browser Page",
          menuTitleIntlId: "codex.commandMenuTitle.reloadBrowserPage",
          defaultKeybindings: [{ key: "CmdOrCtrl+R" }],
          isOverridableByBrowserWebpage: !0,
        },
      },
      {
        id: "hardReloadBrowserPage",
        descriptionIntlId: "codex.commandDescription.hardReloadBrowserPage",
        electron: {
          menuTitle: "Force Reload Browser Page",
          menuTitleIntlId: "codex.commandMenuTitle.hardReloadBrowserPage",
          defaultKeybindings: [{ key: "CmdOrCtrl+Shift+R" }],
          isOverridableByBrowserWebpage: !0,
        },
      },
      {
        id: "newWindow",
        descriptionIntlId: "codex.commandDescription.newWindow",
        electron: { menuTitle: "New Window", menuTitleIntlId: "codex.commandMenuTitle.newWindow" },
      },
      {
        id: "openCommandMenu",
        descriptionIntlId: "codex.commandDescription.openCommandMenu",
        electron: {
          menuTitle: "Open command menu",
          menuTitleIntlId: "codex.commandMenuTitle.openCommandMenu",
          defaultKeybindings: [{ key: "CmdOrCtrl+K" }, { key: "CmdOrCtrl+Shift+P" }],
        },
      },
      {
        id: "searchFiles",
        descriptionIntlId: "codex.commandDescription.searchFiles",
        requiredAccess: "codexLocal",
        electron: {
          menuTitle: "Search Files\u2026",
          menuTitleIntlId: "codex.commandMenuTitle.searchFiles",
          defaultKeybindings: [{ key: "CmdOrCtrl+P" }],
        },
      },
      {
        id: "renameThread",
        descriptionIntlId: "codex.commandDescription.renameThread",
        electron: {
          menuTitle: "Rename chat",
          menuTitleIntlId: "codex.commandMenuTitle.renameThread",
          defaultKeybindings: [{ key: "CmdOrCtrl+Alt+R" }],
        },
      },
      {
        id: "toggleTraceRecording",
        descriptionIntlId: "codex.commandDescription.toggleTraceRecording",
        electron: {
          menuTitle: "Start Trace Recording",
          menuTitleIntlId: "codex.commandMenuTitle.toggleTraceRecording",
        },
      },
    ];
  });
var FDe,
  $De = g(() => {
    "use strict";
    FDe = [
      {
        id: "implementTodo",
        vscodeCommand: { title: "Implement with Jimao", enablement: "false" },
      },
      {
        id: "openSidebar",
        vscodeCommand: {
          title: "Open Jimao Sidebar",
          icon: { light: "resources/jimao.svg", dark: "resources/jimao.svg" },
        },
      },
      { id: "newCodexPanel", vscodeCommand: { title: "New Jimao Agent", icon: "$(plus)" } },
      { id: "addToThread", vscodeCommand: { title: "Add to Jimao Chat" } },
      { id: "addFileToThread", vscodeCommand: { title: "Add File to Jimao Chat" } },
      { id: "showLspMcpCliArgs", vscodeCommand: { title: "Copy Jimao CLI args for LSP MCP" } },
      {
        id: "dumpNuxState",
        vscodeCommand: {
          title: "Debug: print NUX state to console",
          enablement: "chatgpt.sidebarView.visible",
        },
      },
      {
        id: "resetNuxState",
        vscodeCommand: {
          title: "Debug: reset NUX state",
          enablement: "chatgpt.sidebarView.visible",
        },
      },
    ];
  });
var hc,
  UDe,
  X6 = g(() => {
    "use strict";
    ((hc = {
      select: { tool: "select", id: "artifacts.selectTool" },
      hand: { tool: "hand", id: "artifacts.handTool" },
      rect: { tool: "rect", id: "artifacts.rectangleTool" },
      ellipse: { tool: "ellipse", id: "artifacts.circleTool" },
      note: { tool: "note", id: "artifacts.noteTool" },
      arrow: { tool: "arrow", id: "artifacts.arrowTool" },
      line: { tool: "line", id: "artifacts.lineTool" },
      text: { tool: "text", id: "artifacts.textTool" },
    }),
      (UDe = [
        {
          id: "newTask",
          titleIntlId: "codex.command.newThread",
          descriptionIntlId: "codex.commandDescription.newThread",
          unifiedSearchGroupKey: "thread",
          unifiedSearch: !0,
          browser: { defaultKeybindings: [{ key: "CmdOrCtrl+Shift+O" }] },
          electron: {
            menuTitle: "New Chat",
            menuTitleIntlId: "codex.commandMenuTitle.newThread",
            defaultKeybindings: [{ key: "CmdOrCtrl+N" }, { key: "CmdOrCtrl+Shift+O" }],
          },
          vscodeCommand: {
            commandId: "chatgpt.newChat",
            title: "New Chat in ChatGPT Sidebar",
            keybinding: { key: "ctrl+n", mac: "cmd+n", when: "chatgpt.supportsNewChatKeyShortcut" },
          },
        },
        {
          id: "newProjectlessTask",
          titleIntlId: "codex.command.newProjectlessTask",
          descriptionIntlId: "codex.commandDescription.newProjectlessTask",
          requiredAccess: "codexLocal",
          availableIn: ["electron"],
          unifiedSearchGroupKey: "thread",
          unifiedSearch: !0,
          unifiedSearchFeature: "codex",
          electron: {
            menuTitle: "New standalone chat",
            menuTitleIntlId: "codex.commandMenuTitle.newProjectlessTask",
            defaultKeybindings: [{ key: "CmdOrCtrl+Alt+O" }],
          },
        },
        {
          id: "temporaryChat",
          titleIntlId: "codex.command.temporaryChat",
          descriptionIntlId: "codex.commandDescription.temporaryChat",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "thread",
          unifiedSearch: !0,
          unifiedSearchFeature: "chatgpt",
          electron: {
            menuTitle: "New Temporary Chat",
            menuTitleIntlId: "codex.command.temporaryChat",
            defaultKeybindings: [{ key: "CmdOrCtrl+Shift+N" }],
          },
        },
        {
          id: "openThreadInNewWindow",
          titleIntlId: "codex.command.openThreadInNewWindow",
          descriptionIntlId: "codex.commandDescription.openThreadInNewWindow",
          unifiedSearchGroupKey: "thread",
          unifiedSearch: !0,
          unifiedSearchFeature: "codex",
          electron: {
            menuTitle: "Open in New Window",
            menuTitleIntlId: "codex.commandMenuTitle.openThreadInNewWindow",
          },
        },
        {
          id: "archiveThread",
          titleIntlId: "codex.command.archiveThread",
          descriptionIntlId: "codex.commandDescription.archiveThread",
          unifiedSearchGroupKey: "thread",
          unifiedSearch: !0,
          electron: {
            menuTitle: "Archive chat",
            menuTitleIntlId: "codex.commandMenuTitle.archiveThread",
            defaultKeybindings: [{ key: "CmdOrCtrl+Shift+A" }],
          },
        },
        {
          id: "deleteOrbit",
          titleIntlId: "codex.command.deleteOrbit",
          descriptionIntlId: "codex.commandDescription.deleteOrbit",
          availableIn: ["electron"],
          unifiedSearchGroupKey: "thread",
          unifiedSearch: !0,
        },
        {
          id: "deleteChat",
          titleIntlId: "codex.command.deleteChat",
          descriptionIntlId: "codex.commandDescription.deleteChat",
          unifiedSearchGroupKey: "thread",
          browser: {
            defaultKeybindings: [
              { key: "CmdOrCtrl+Shift+Delete" },
              { key: "Command+Shift+Backspace" },
            ],
          },
        },
        {
          id: "markThreadUnread",
          titleIntlId: "codex.command.markThreadUnread",
          descriptionIntlId: "codex.commandDescription.markThreadUnread",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "thread",
          unifiedSearch: !0,
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+Shift+U" }] },
        },
        {
          id: "toggleThreadPin",
          titleIntlId: "codex.command.toggleThreadPin",
          descriptionIntlId: "codex.commandDescription.toggleThreadPin",
          unifiedSearchGroupKey: "thread",
          unifiedSearch: !0,
          electron: {
            menuTitle: "Pin/unpin chat",
            menuTitleIntlId: "codex.commandMenuTitle.toggleThreadPin",
            defaultKeybindings: [{ key: "CmdOrCtrl+Alt+P" }],
          },
        },
        {
          id: "copyConversationMarkdown",
          titleIntlId: "codex.command.copyConversationMarkdown",
          descriptionIntlId: "codex.commandDescription.copyConversationMarkdown",
        },
        {
          id: "copyLastCodeBlock",
          titleIntlId: "codex.command.copyLastCodeBlock",
          descriptionIntlId: "codex.commandDescription.copyLastCodeBlock",
          shortcutScope: "app",
          unifiedSearchGroupKey: "thread",
          unifiedSearch: !0,
          unifiedSearchFeature: "chatgpt",
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+Shift+;" }] },
        },
        {
          id: "openSideChat",
          titleIntlId: "codex.command.openSideChat",
          descriptionIntlId: "codex.commandDescription.openSideChat",
          requiredAccess: "codexOrWork",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "thread",
          unifiedSearch: !0,
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+Alt+S" }] },
        },
        {
          id: "openControlWindow",
          titleIntlId: "codex.command.openControlWindow",
          descriptionIntlId: "codex.commandDescription.openControlWindow",
          unifiedSearchGroupKey: "app",
          unifiedSearch: !0,
        },
        {
          id: "toggleDebugModal",
          titleIntlId: "codex.command.toggleDebugModal",
          descriptionIntlId: "codex.commandDescription.toggleDebugModal",
          availableIn: ["browser", "electron", "extension"],
          shortcutScope: "app",
          electron: { defaultKeybindings: [{ key: "Ctrl+D" }] },
        },
        {
          id: "undoAppAction",
          titleIntlId: "codex.command.undoAppAction",
          descriptionIntlId: "codex.commandDescription.undoAppAction",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "app",
          unifiedSearch: !0,
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+Z" }] },
        },
        {
          id: "redoAppAction",
          titleIntlId: "codex.command.redoAppAction",
          descriptionIntlId: "codex.commandDescription.redoAppAction",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "app",
          unifiedSearch: !0,
          electron: {
            platformDefaultKeybindings: {
              macOS: [{ key: "Command+Shift+Z" }],
              default: [{ key: "Ctrl+Y" }, { key: "Ctrl+Shift+Z" }],
            },
          },
        },
        {
          id: "reopenClosedTab",
          titleIntlId: "codex.command.reopenClosedTab",
          descriptionIntlId: "codex.commandDescription.reopenClosedTab",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "panels",
          unifiedSearch: !0,
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+Shift+T" }] },
        },
        {
          id: "composer.openModelPicker",
          titleIntlId: "codex.command.composer.openModelPicker",
          descriptionIntlId: "codex.commandDescription.composer.openModelPicker",
          shortcutScope: "app",
          electron: { defaultKeybindings: [{ key: "Ctrl+Shift+M" }] },
        },
        {
          id: "composer.openRecentModels",
          titleIntlId: "codex.command.composer.openRecentModels",
          descriptionIntlId: "codex.commandDescription.composer.openRecentModels",
          shortcutScope: "app",
          electron: {
            platformDefaultKeybindings: {
              macOS: [{ key: "Ctrl+Command+M" }],
              default: [{ key: "Alt+M" }],
            },
          },
        },
        {
          id: "composer.openProjectPicker",
          titleIntlId: "codex.command.composer.openProjectPicker",
          descriptionIntlId: "codex.commandDescription.composer.openProjectPicker",
          availableIn: ["browser", "electron"],
          shortcutScope: "app",
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+Alt+Shift+O" }] },
        },
        {
          id: "composer.toggleDictation",
          titleIntlId: "codex.command.composer.toggleDictation",
          descriptionIntlId: "codex.commandDescription.composer.toggleDictation",
          availableIn: ["browser", "electron"],
          shortcutScope: "app",
          browser: { defaultKeybindings: [], macOSDefaultKeybindings: [{ key: "Ctrl+Shift+D" }] },
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+Shift+D" }] },
        },
        {
          id: "composer.startVoiceMode",
          titleIntlId: "codex.command.composer.startVoiceMode",
          descriptionIntlId: "codex.commandDescription.composer.startVoiceMode",
          shortcutScope: "app",
          electron: {
            platformDefaultKeybindings: { macOS: [{ key: "Ctrl+Shift+V" }], default: [] },
          },
        },
        {
          id: "realtimeVoice.toggleMicrophoneMute",
          titleIntlId: "codex.command.realtimeVoice.toggleMicrophoneMute",
          descriptionIntlId: "codex.commandDescription.realtimeVoice.toggleMicrophoneMute",
          availableIn: ["electron"],
          shortcutScope: "app",
        },
        {
          id: "realtimeVoice.toggleOutputMute",
          titleIntlId: "codex.command.realtimeVoice.toggleOutputMute",
          descriptionIntlId: "codex.commandDescription.realtimeVoice.toggleOutputMute",
          availableIn: ["electron"],
          shortcutScope: "app",
        },
        {
          id: "realtimeVoice.endCall",
          titleIntlId: "codex.command.realtimeVoice.endCall",
          descriptionIntlId: "codex.commandDescription.realtimeVoice.endCall",
          availableIn: ["electron"],
          shortcutScope: "app",
        },
        {
          id: "meetings.takeNotes",
          unifiedSearch: !0,
          unifiedSearchGroupKey: "app",
          titleIntlId: "codex.command.meetings.takeNotes",
          descriptionIntlId: "codex.commandDescription.meetings.takeNotes",
          availableIn: ["electron"],
          shortcutScope: "os-global",
          electron: { platformDefaultKeybindings: { macOS: [{ key: "Command+Shift+M" }] } },
        },
        {
          id: "browser.toggleAnnotationMode",
          titleIntlId: "codex.command.browser.toggleAnnotationMode",
          descriptionIntlId: "codex.commandDescription.browser.toggleAnnotationMode",
          availableIn: ["electron"],
          shortcutScope: "app",
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+Shift+." }] },
        },
        {
          id: "browser.bookmarkPage",
          titleIntlId: "codex.command.browser.bookmarkPage",
          descriptionIntlId: "codex.commandDescription.browser.bookmarkPage",
          availableIn: ["electron"],
          shortcutScope: "app",
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+D" }] },
        },
        {
          id: "presentation.editLink",
          titleIntlId: "codex.command.presentation.editLink",
          descriptionIntlId: "codex.commandDescription.presentation.editLink",
          availableIn: ["browser", "electron", "extension"],
          shortcutScope: "app",
          shortcutEventPhase: "bubble",
          browser: { defaultKeybindings: [{ key: "CmdOrCtrl+K" }] },
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+K" }] },
        },
        {
          id: "presentation.duplicateSelection",
          titleIntlId: "codex.command.presentation.duplicateSelection",
          descriptionIntlId: "codex.commandDescription.presentation.duplicateSelection",
          availableIn: ["browser", "electron", "extension"],
          shortcutScope: "app",
          shortcutEventPhase: "bubble",
          browser: { defaultKeybindings: [{ key: "CmdOrCtrl+D" }] },
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+D" }] },
        },
        {
          id: "artifact.sendAnnotations",
          titleIntlId: "codex.command.artifact.sendAnnotations",
          descriptionIntlId: "codex.commandDescription.artifact.sendAnnotations",
          availableIn: ["browser", "electron"],
          shortcutScope: "app",
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+Enter" }] },
        },
        {
          id: "composer.submitInBackground",
          titleIntlId: "codex.command.composer.submitInBackground",
          descriptionIntlId: "codex.commandDescription.composer.submitInBackground",
          availableIn: ["browser", "electron"],
          shortcutScope: "app",
          browser: { defaultKeybindings: [{ key: "CmdOrCtrl+Enter" }] },
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+Enter" }] },
        },
        {
          id: "composer.submit",
          titleIntlId: "codex.command.composer.submit",
          descriptionIntlId: "codex.commandDescription.composer.submit",
          shortcutScope: "app",
        },
        {
          id: "composer.steer",
          titleIntlId: "codex.command.composer.steer",
          descriptionIntlId: "codex.commandDescription.composer.steer",
          shortcutScope: "app",
        },
        {
          id: "composer.queue",
          titleIntlId: "codex.command.composer.queue",
          descriptionIntlId: "codex.commandDescription.composer.queue",
          shortcutScope: "app",
        },
        {
          id: "composer.clear",
          titleIntlId: "codex.command.composer.clear",
          descriptionIntlId: "codex.commandDescription.composer.clear",
          shortcutScope: "app",
        },
        {
          id: "composer.addPhotos",
          titleIntlId: "codex.command.composer.addPhotos",
          descriptionIntlId: "codex.commandDescription.composer.addPhotos",
          availableIn: ["electron"],
          shortcutScope: "app",
        },
        {
          id: "composer.captureAppshot",
          titleIntlId: "codex.command.composer.captureAppshot",
          descriptionIntlId: "codex.commandDescription.composer.captureAppshot",
          availableIn: ["electron"],
          shortcutConfigurable: !1,
        },
        {
          id: "composer.addFiles",
          titleIntlId: "codex.command.composer.addFiles",
          descriptionIntlId: "codex.commandDescription.composer.addFiles",
          availableIn: ["browser", "electron"],
          shortcutScope: "app",
          browser: { defaultKeybindings: [{ key: "CmdOrCtrl+U" }] },
        },
        {
          id: "composer.toggleFastMode",
          titleIntlId: "codex.command.composer.toggleFastMode",
          descriptionIntlId: "codex.commandDescription.composer.toggleFastMode",
          shortcutScope: "app",
        },
        {
          id: "composer.increaseReasoningEffort",
          titleIntlId: "codex.command.composer.increaseReasoningEffort",
          descriptionIntlId: "codex.commandDescription.composer.increaseReasoningEffort",
          shortcutScope: "app",
        },
        {
          id: "composer.decreaseReasoningEffort",
          titleIntlId: "codex.command.composer.decreaseReasoningEffort",
          descriptionIntlId: "codex.commandDescription.composer.decreaseReasoningEffort",
          shortcutScope: "app",
        },
        {
          id: "composer.cycleReasoningEffort",
          titleIntlId: "codex.command.composer.cycleReasoningEffort",
          descriptionIntlId: "codex.commandDescription.composer.cycleReasoningEffort",
          shortcutScope: "app",
        },
        {
          id: "composer.togglePlanMode",
          titleIntlId: "codex.command.composer.togglePlanMode",
          descriptionIntlId: "codex.commandDescription.composer.togglePlanMode",
          shortcutScope: "app",
        },
        {
          id: "composer.toggleWorktreeMode",
          titleIntlId: "codex.command.composer.toggleWorktreeMode",
          descriptionIntlId: "codex.commandDescription.composer.toggleWorktreeMode",
          availableIn: ["electron"],
          shortcutScope: "app",
        },
        {
          id: "composer.cycleHost",
          titleIntlId: "codex.command.composer.cycleHost",
          descriptionIntlId: "codex.commandDescription.composer.cycleHost",
          availableIn: ["electron"],
          shortcutScope: "app",
        },
        {
          id: "composer.toggleWorkRunLocation",
          titleIntlId: "codex.command.composer.toggleWorkRunLocation",
          descriptionIntlId: "codex.commandDescription.composer.toggleWorkRunLocation",
          availableIn: ["electron"],
          shortcutScope: "app",
        },
        {
          id: "approval.approve",
          titleIntlId: "codex.command.approval.approve",
          descriptionIntlId: "codex.commandDescription.approval.approve",
          shortcutScope: "app",
          electron: { defaultKeybindings: [{ key: "Enter" }] },
        },
        {
          id: "approval.decline",
          titleIntlId: "codex.command.approval.decline",
          descriptionIntlId: "codex.commandDescription.approval.decline",
          shortcutScope: "app",
          electron: { defaultKeybindings: [{ key: "Escape" }] },
        },
        {
          id: "git.commit",
          titleIntlId: "codex.command.git.commit",
          descriptionIntlId: "codex.commandDescription.git.commit",
          requiredAccess: "codexLocal",
          shortcutScope: "app",
          unifiedSearchGroupKey: "workspace",
          unifiedSearch: !0,
          unifiedSearchFeature: "codex",
        },
        {
          id: "git.createPullRequest",
          titleIntlId: "codex.command.git.createPullRequest",
          descriptionIntlId: "codex.commandDescription.git.createPullRequest",
          requiredAccess: "codexLocal",
          shortcutScope: "app",
          unifiedSearchGroupKey: "workspace",
          unifiedSearch: !0,
          unifiedSearchFeature: "codex",
        },
        {
          id: "git.createDraftPullRequest",
          titleIntlId: "codex.command.git.createDraftPullRequest",
          descriptionIntlId: "codex.commandDescription.git.createDraftPullRequest",
          shortcutScope: "app",
          unifiedSearchGroupKey: "workspace",
          unifiedSearch: !0,
          unifiedSearchFeature: "codex",
        },
        {
          id: "git.createBranch",
          titleIntlId: "codex.command.git.createBranch",
          descriptionIntlId: "codex.commandDescription.git.createBranch",
          shortcutScope: "app",
          unifiedSearchGroupKey: "workspace",
          unifiedSearch: !0,
          unifiedSearchFeature: "codex",
        },
        {
          id: "git.mergePullRequest",
          titleIntlId: "codex.command.git.mergePullRequest",
          descriptionIntlId: "codex.commandDescription.git.mergePullRequest",
          shortcutScope: "app",
          unifiedSearchGroupKey: "workspace",
          unifiedSearch: !0,
          unifiedSearchFeature: "codex",
        },
        {
          id: "git.openPullRequest",
          titleIntlId: "codex.command.git.openPullRequest",
          descriptionIntlId: "codex.commandDescription.git.openPullRequest",
          requiredAccess: "codexLocal",
          shortcutScope: "app",
          unifiedSearchGroupKey: "workspace",
          unifiedSearch: !0,
          unifiedSearchFeature: "codex",
        },
        {
          id: "git.toggleBlame",
          titleIntlId: "codex.command.git.toggleBlame",
          descriptionIntlId: "codex.commandDescription.git.toggleBlame",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "workspace",
          unifiedSearch: !0,
          unifiedSearchFeature: "codex",
        },
        {
          id: "forkThread",
          titleIntlId: "codex.command.forkThread",
          descriptionIntlId: "codex.commandDescription.forkThread",
          shortcutScope: "app",
        },
        {
          id: "openAvatarOverlay",
          titleIntlId: "codex.command.showMiniOverlay",
          descriptionIntlId: "codex.commandDescription.showMiniOverlay",
          availableIn: ["electron"],
          shortcutScope: "os-global",
          unifiedSearchGroupKey: "app",
          unifiedSearch: !0,
          unifiedSearchFeature: "codex",
          electron: {
            menuTitle: "Toggle Mini",
            menuTitleIntlId: "codex.command.showMiniOverlay",
            platformDefaultKeybindings: {
              macOS: [{ key: "Alt+Space" }],
              default: [{ key: "Super+Alt+P" }],
            },
          },
        },
        {
          id: "searchChats",
          titleIntlId: "codex.command.searchChats",
          descriptionIntlId: "codex.commandDescription.searchChats",
          availableIn: ["browser", "electron"],
          unifiedSearchGroupKey: "navigation",
          unifiedSearch: !0,
          browser: { defaultKeybindings: [{ key: "CmdOrCtrl+K" }] },
          electron: {
            menuTitle: "Search Chats\u2026",
            menuTitleIntlId: "codex.commandMenuTitle.searchChats",
          },
        },
        {
          id: "searchChatsPrevious",
          titleIntlId: "codex.command.searchChatsPrevious",
          descriptionIntlId: "codex.commandDescription.searchChatsPrevious",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "navigation",
        },
        {
          id: "togglePriorityFilter",
          titleIntlId: "codex.command.togglePriorityFilter",
          descriptionIntlId: "codex.commandDescription.togglePriorityFilter",
          availableIn: ["browser", "electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "navigation",
          unifiedSearch: !0,
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+Alt+U" }] },
        },
        {
          id: "focusMainChat",
          titleIntlId: "codex.command.focusMainChat",
          descriptionIntlId: "codex.commandDescription.focusMainChat",
          requiredAccess: "codexLocal",
          availableIn: ["browser", "electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "navigation",
          unifiedSearch: !0,
          unifiedSearchFeature: "codex",
          browser: { defaultKeybindings: [{ key: "Shift+Escape" }] },
          electron: {
            defaultKeybindings: [{ key: "Alt+L" }],
            platformDefaultKeybindings: { macOS: [] },
          },
        },
        {
          id: "focusSideChat",
          titleIntlId: "codex.command.focusSideChat",
          descriptionIntlId: "codex.commandDescription.focusSideChat",
          requiredAccess: "codexOrWork",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "navigation",
          unifiedSearch: !0,
        },
        {
          id: hc.select.id,
          titleIntlId: "codex.command.artifacts.selectTool",
          descriptionIntlId: "codex.commandDescription.artifacts.selectTool",
          availableIn: ["browser", "electron", "extension"],
          shortcutScope: "app",
          shortcutEventPhase: "bubble",
          unifiedSearch: !0,
          unifiedSearchGroupKey: "navigation",
          browser: { defaultKeybindings: [{ key: "V" }] },
          electron: { defaultKeybindings: [{ key: "V" }] },
        },
        {
          id: hc.hand.id,
          titleIntlId: "codex.command.artifacts.handTool",
          descriptionIntlId: "codex.commandDescription.artifacts.handTool",
          availableIn: ["browser", "electron", "extension"],
          shortcutScope: "app",
          shortcutEventPhase: "bubble",
          unifiedSearch: !0,
          unifiedSearchGroupKey: "navigation",
          browser: { defaultKeybindings: [{ key: "H" }] },
          electron: { defaultKeybindings: [{ key: "H" }] },
        },
        {
          id: "canvas.prompt",
          titleIntlId: "codex.command.canvas.prompt",
          descriptionIntlId: "codex.commandDescription.canvas.prompt",
          availableIn: ["browser", "electron", "extension"],
          shortcutScope: "app",
          unifiedSearch: !0,
          unifiedSearchGroupKey: "navigation",
          browser: { defaultKeybindings: [{ key: "/" }, { key: "Shift+?" }] },
          electron: { defaultKeybindings: [{ key: "/" }, { key: "Shift+?" }] },
        },
        {
          id: hc.rect.id,
          titleIntlId: "codex.command.artifacts.rectangleTool",
          descriptionIntlId: "codex.commandDescription.artifacts.rectangleTool",
          availableIn: ["browser", "electron", "extension"],
          shortcutScope: "app",
          shortcutEventPhase: "bubble",
          unifiedSearch: !0,
          unifiedSearchGroupKey: "navigation",
          browser: { defaultKeybindings: [{ key: "R" }] },
          electron: { defaultKeybindings: [{ key: "R" }] },
        },
        {
          id: hc.ellipse.id,
          titleIntlId: "codex.command.artifacts.circleTool",
          descriptionIntlId: "codex.commandDescription.artifacts.circleTool",
          availableIn: ["browser", "electron", "extension"],
          shortcutScope: "app",
          shortcutEventPhase: "bubble",
          unifiedSearch: !0,
          unifiedSearchGroupKey: "navigation",
          browser: { defaultKeybindings: [{ key: "O" }] },
          electron: { defaultKeybindings: [{ key: "O" }] },
        },
        {
          id: hc.arrow.id,
          titleIntlId: "codex.command.artifacts.arrowTool",
          descriptionIntlId: "codex.commandDescription.artifacts.arrowTool",
          availableIn: ["browser", "electron", "extension"],
          shortcutScope: "app",
          shortcutEventPhase: "bubble",
          unifiedSearch: !0,
          unifiedSearchGroupKey: "navigation",
          browser: { defaultKeybindings: [{ key: "A" }] },
          electron: { defaultKeybindings: [{ key: "A" }] },
        },
        {
          id: hc.line.id,
          titleIntlId: "codex.command.artifacts.lineTool",
          descriptionIntlId: "codex.commandDescription.artifacts.lineTool",
          availableIn: ["browser", "electron", "extension"],
          shortcutScope: "app",
          shortcutEventPhase: "bubble",
          unifiedSearch: !0,
          unifiedSearchGroupKey: "navigation",
          browser: { defaultKeybindings: [{ key: "L" }] },
          electron: { defaultKeybindings: [{ key: "L" }] },
        },
        {
          id: hc.text.id,
          titleIntlId: "codex.command.artifacts.textTool",
          descriptionIntlId: "codex.commandDescription.artifacts.textTool",
          availableIn: ["browser", "electron", "extension"],
          shortcutScope: "app",
          shortcutEventPhase: "bubble",
          unifiedSearch: !0,
          unifiedSearchGroupKey: "navigation",
          browser: { defaultKeybindings: [{ key: "T" }] },
          electron: { defaultKeybindings: [{ key: "T" }] },
        },
        {
          id: hc.note.id,
          titleIntlId: "codex.command.artifacts.noteTool",
          descriptionIntlId: "codex.commandDescription.artifacts.noteTool",
          availableIn: ["browser", "electron", "extension"],
          shortcutScope: "app",
          shortcutEventPhase: "bubble",
          unifiedSearch: !0,
          unifiedSearchGroupKey: "navigation",
          browser: { defaultKeybindings: [{ key: "N" }] },
          electron: { defaultKeybindings: [{ key: "N" }] },
        },
        {
          id: "copyPageLink",
          titleIntlId: "codex.command.copyPageLink",
          descriptionIntlId: "codex.commandDescription.copyPageLink",
          availableIn: ["browser", "electron", "extension"],
          shortcutScope: "app",
          unifiedSearch: !0,
          unifiedSearchGroupKey: "navigation",
          browser: { defaultKeybindings: [] },
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+L" }] },
        },
        {
          id: "focusPageBlockControls",
          titleIntlId: "codex.command.focusPageBlockControls",
          descriptionIntlId: "codex.commandDescription.focusPageBlockControls",
          availableIn: ["browser", "electron", "extension"],
          shortcutScope: "app",
          electron: { defaultKeybindings: [{ key: "Shift+F10" }] },
        },
        {
          id: "page.addComment",
          titleIntlId: "codex.command.page.addComment",
          descriptionIntlId: "codex.commandDescription.page.addComment",
          availableIn: ["browser", "electron", "extension"],
          shortcutScope: "app",
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+Alt+M" }] },
        },
        {
          id: "page.formatNumberedList",
          titleIntlId: "codex.command.page.formatNumberedList",
          descriptionIntlId: "codex.commandDescription.page.formatNumberedList",
          availableIn: ["browser", "electron"],
          shortcutScope: "app",
          unifiedSearch: !0,
          unifiedSearchFeature: "chatgpt",
          electron: {
            defaultKeybindings: [{ key: "CmdOrCtrl+Alt+4" }, { key: "CmdOrCtrl+Shift+9" }],
          },
        },
        {
          id: "page.formatBulletedList",
          titleIntlId: "codex.command.page.formatBulletedList",
          descriptionIntlId: "codex.commandDescription.page.formatBulletedList",
          availableIn: ["browser", "electron"],
          shortcutScope: "app",
          unifiedSearch: !0,
          unifiedSearchFeature: "chatgpt",
          electron: {
            defaultKeybindings: [{ key: "CmdOrCtrl+Alt+5" }, { key: "CmdOrCtrl+Shift+8" }],
          },
        },
        {
          id: "page.formatChecklist",
          titleIntlId: "codex.command.page.formatChecklist",
          descriptionIntlId: "codex.commandDescription.page.formatChecklist",
          availableIn: ["browser", "electron"],
          shortcutScope: "app",
          unifiedSearch: !0,
          unifiedSearchFeature: "chatgpt",
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+Alt+6" }] },
        },
        {
          id: "openOrbit",
          titleIntlId: "codex.command.openOrbit.dot",
          descriptionIntlId: "codex.commandDescription.openOrbit.dot",
          availableIn: ["browser", "electron"],
          shortcutScope: "app",
          unifiedSearch: !0,
          unifiedSearchGroupKey: "navigation",
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+." }] },
        },
        {
          id: "nextThreadNeedingAttention",
          titleIntlId: "codex.command.nextThreadNeedingAttention",
          descriptionIntlId: "codex.commandDescription.nextThreadNeedingAttention",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "navigation",
          unifiedSearch: !0,
          unifiedSearchFeature: "codex",
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+Alt+A" }] },
        },
        {
          id: "previousTab",
          titleIntlId: "codex.command.previousTab",
          descriptionIntlId: "codex.commandDescription.previousTab",
          availableIn: ["electron"],
          shortcutScope: "app",
          allowsKeyRepeat: !0,
          unifiedSearchGroupKey: "navigation",
          electron: {
            menuTitle: "Previous Tab",
            menuTitleIntlId: "codex.command.previousTab",
            defaultKeybindings: [{ key: "CmdOrCtrl+Shift+[" }],
            platformDefaultKeybindings: {
              macOS: [{ key: "Command+Shift+[" }, { key: "Ctrl+Shift+Tab" }],
              default: [{ key: "Ctrl+Shift+[" }, { key: "Ctrl+PageUp" }, { key: "Ctrl+Shift+Tab" }],
            },
          },
        },
        {
          id: "previousThread",
          titleIntlId: "codex.command.previousThread",
          descriptionIntlId: "codex.commandDescription.previousThread",
          allowsKeyRepeat: !0,
          unifiedSearchGroupKey: "navigation",
          unifiedSearch: !0,
          electron: {
            menuTitle: "Previous Sidebar Item",
            menuTitleIntlId: "codex.commandMenuTitle.previousThread",
            defaultKeybindings: [{ key: "CmdOrCtrl+Alt+[" }],
            platformDefaultKeybindings: {
              macOS: [{ key: "Command+Alt+[" }, { key: "Command+Alt+Left" }],
              default: [{ key: "Ctrl+Alt+[" }, { key: "Ctrl+Alt+Left" }],
            },
          },
        },
        {
          id: "previousRecentThread",
          titleIntlId: "codex.command.previousRecentThread",
          descriptionIntlId: "codex.commandDescription.previousRecentThread",
          availableIn: ["electron"],
          shortcutScope: "app",
          allowsKeyRepeat: !0,
          unifiedSearch: !0,
          unifiedSearchGroupKey: "navigation",
          electron: { defaultKeybindings: [] },
        },
        {
          id: "nextTab",
          titleIntlId: "codex.command.nextTab",
          descriptionIntlId: "codex.commandDescription.nextTab",
          availableIn: ["electron"],
          shortcutScope: "app",
          allowsKeyRepeat: !0,
          unifiedSearchGroupKey: "navigation",
          electron: {
            menuTitle: "Next Tab",
            menuTitleIntlId: "codex.command.nextTab",
            defaultKeybindings: [{ key: "CmdOrCtrl+Shift+]" }],
            platformDefaultKeybindings: {
              macOS: [{ key: "Command+Shift+]" }, { key: "Ctrl+Tab" }],
              default: [{ key: "Ctrl+Shift+]" }, { key: "Ctrl+PageDown" }, { key: "Ctrl+Tab" }],
            },
          },
        },
        {
          id: "nextThread",
          titleIntlId: "codex.command.nextThread",
          descriptionIntlId: "codex.commandDescription.nextThread",
          allowsKeyRepeat: !0,
          unifiedSearchGroupKey: "navigation",
          unifiedSearch: !0,
          electron: {
            menuTitle: "Next Sidebar Item",
            menuTitleIntlId: "codex.commandMenuTitle.nextThread",
            defaultKeybindings: [{ key: "CmdOrCtrl+Alt+]" }],
            platformDefaultKeybindings: {
              macOS: [{ key: "Command+Alt+]" }, { key: "Command+Alt+Right" }],
              default: [{ key: "Ctrl+Alt+]" }, { key: "Ctrl+Alt+Right" }],
            },
          },
        },
        {
          id: "nextRecentThread",
          titleIntlId: "codex.command.nextRecentThread",
          descriptionIntlId: "codex.commandDescription.nextRecentThread",
          availableIn: ["electron"],
          shortcutScope: "app",
          allowsKeyRepeat: !0,
          unifiedSearch: !0,
          unifiedSearchGroupKey: "navigation",
          electron: { defaultKeybindings: [] },
        },
        {
          id: "recentThread1",
          titleIntlId: "codex.command.recentThread1",
          descriptionIntlId: "codex.commandDescription.recentThreadSlot",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "navigation",
          unifiedSearch: !0,
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+Alt+1" }] },
        },
        {
          id: "recentThread2",
          titleIntlId: "codex.command.recentThread2",
          descriptionIntlId: "codex.commandDescription.recentThreadSlot",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "navigation",
          unifiedSearch: !0,
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+Alt+2" }] },
        },
        {
          id: "recentThread3",
          titleIntlId: "codex.command.recentThread3",
          descriptionIntlId: "codex.commandDescription.recentThreadSlot",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "navigation",
          unifiedSearch: !0,
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+Alt+3" }] },
        },
        {
          id: "recentThread4",
          titleIntlId: "codex.command.recentThread4",
          descriptionIntlId: "codex.commandDescription.recentThreadSlot",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "navigation",
          unifiedSearch: !0,
          electron: {
            defaultKeybindings: [{ key: "CmdOrCtrl+Alt+4" }, { key: "CmdOrCtrl+Shift+9" }],
          },
        },
        {
          id: "recentThread5",
          titleIntlId: "codex.command.recentThread5",
          descriptionIntlId: "codex.commandDescription.recentThreadSlot",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "navigation",
          unifiedSearch: !0,
          electron: {
            defaultKeybindings: [{ key: "CmdOrCtrl+Alt+5" }, { key: "CmdOrCtrl+Shift+8" }],
          },
        },
        {
          id: "recentThread6",
          titleIntlId: "codex.command.recentThread6",
          descriptionIntlId: "codex.commandDescription.recentThreadSlot",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "navigation",
          unifiedSearch: !0,
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+Alt+6" }] },
        },
        ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((t) => ({
          id: `focusTab${t}`,
          titleIntlId: `codex.command.focusTab${t}`,
          descriptionIntlId: "codex.commandDescription.focusTab",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "navigation",
          electron: {
            platformDefaultKeybindings: {
              macOS: [{ key: `Ctrl+${t}` }],
              default: [{ key: `Alt+${t}` }],
            },
          },
        })),
        {
          id: "switchToMode1",
          titleIntlId: "codex.command.switchToChat",
          descriptionIntlId: "codex.commandDescription.switchToChat",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "navigation",
          unifiedSearch: !0,
          electron: {
            platformDefaultKeybindings: { macOS: [{ key: "Ctrl+1" }], default: [{ key: "Alt+1" }] },
          },
        },
        {
          id: "switchToMode2",
          titleIntlId: "codex.command.switchToWork",
          descriptionIntlId: "codex.commandDescription.switchToWork",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "navigation",
          unifiedSearch: !0,
          electron: {
            platformDefaultKeybindings: { macOS: [{ key: "Ctrl+2" }], default: [{ key: "Alt+2" }] },
          },
        },
        {
          id: "switchToMode3",
          titleIntlId: "codex.command.switchToCodex",
          descriptionIntlId: "codex.commandDescription.switchToCodex",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "navigation",
          unifiedSearch: !0,
          electron: {
            platformDefaultKeybindings: { macOS: [{ key: "Ctrl+3" }], default: [{ key: "Alt+3" }] },
          },
        },
        {
          id: "settings",
          titleIntlId: "codex.command.settings",
          descriptionIntlId: "codex.commandDescription.settings",
          unifiedSearchGroupKey: "app",
          unifiedSearch: !0,
          electron: {
            menuTitle: "Settings\u2026",
            menuTitleIntlId: "codex.commandMenuTitle.settings",
            defaultKeybindings: [{ key: "CmdOrCtrl+," }],
          },
        },
        {
          id: "codexMicroSettings",
          titleIntlId: "codex.command.codexMicroSettings",
          descriptionIntlId: "codex.commandDescription.codexMicroSettings",
          availableIn: ["electron"],
          shortcutConfigurable: !1,
          unifiedSearchGroupKey: "configure",
        },
        {
          id: "mcpSettings",
          titleIntlId: "codex.command.mcpSettings",
          descriptionIntlId: "codex.commandDescription.mcpSettings",
          unifiedSearchGroupKey: "configure",
          unifiedSearch: !0,
        },
        {
          id: "personalitySettings",
          titleIntlId: "codex.command.personalitySettings",
          descriptionIntlId: "codex.commandDescription.personalitySettings",
          unifiedSearchGroupKey: "configure",
          unifiedSearch: !0,
          browser: { defaultKeybindings: [{ key: "CmdOrCtrl+Shift+I" }] },
        },
        {
          id: "importExternalAgent",
          titleIntlId: "codex.command.importExternalAgent",
          descriptionIntlId: "codex.commandDescription.importExternalAgent",
          requiredAccess: "codexLocal",
          availableIn: ["electron"],
          unifiedSearchGroupKey: "configure",
          unifiedSearch: !0,
          unifiedSearchFeature: "codex",
        },
        {
          id: "importPrismToLocal",
          titleIntlId: "codex.command.importPrismToLocal",
          descriptionIntlId: "codex.commandDescription.importPrismToLocal",
          availableIn: ["electron"],
          unifiedSearchGroupKey: "workspace",
          unifiedSearch: !0,
        },
        {
          id: "keyboardShortcuts",
          titleIntlId: "codex.command.keyboardShortcuts",
          descriptionIntlId: "codex.commandDescription.keyboardShortcuts",
          unifiedSearchGroupKey: "configure",
          unifiedSearch: !0,
        },
        {
          id: "showKeyboardShortcuts",
          titleIntlId: "codex.command.showKeyboardShortcuts",
          descriptionIntlId: "codex.commandDescription.showKeyboardShortcuts",
          availableIn: ["browser", "electron"],
          shortcutScope: "app",
          browser: { defaultKeybindings: [{ key: "CmdOrCtrl+/" }] },
          electron: {
            menuTitle: "Keyboard Shortcuts",
            menuTitleIntlId: "codex.commandMenuTitle.showKeyboardShortcuts",
            defaultKeybindings: [{ key: "CmdOrCtrl+/" }],
          },
        },
        {
          id: "clearAllUnreads",
          titleIntlId: "codex.command.clearAllUnreads",
          descriptionIntlId: "codex.commandDescription.clearAllUnreads",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "app",
          unifiedSearch: !0,
          unifiedSearchFeature: "codex",
          electron: { defaultKeybindings: [{ key: "Shift+Escape" }] },
        },
        {
          id: "manageTasks",
          titleIntlId: "codex.command.manageTasks",
          descriptionIntlId: "codex.commandDescription.manageTasks",
          unifiedSearchGroupKey: "app",
          unifiedSearch: !0,
        },
        {
          id: "forceReloadSkills",
          titleIntlId: "codex.command.forceReloadSkills",
          descriptionIntlId: "codex.commandDescription.forceReloadSkills",
          requiredAccess: "codexLocal",
          unifiedSearchGroupKey: "skills",
          unifiedSearch: !0,
          unifiedSearchFeature: "codex",
        },
        {
          id: "openSkills",
          titleIntlId: "codex.command.openSkills",
          descriptionIntlId: "codex.commandDescription.openSkills",
          requiredAccess: "codexLocal",
          unifiedSearchGroupKey: "skills",
          unifiedSearch: !0,
          unifiedSearchFeature: "codex",
        },
        {
          id: "newProject",
          titleIntlId: "codex.command.newProject",
          descriptionIntlId: "codex.commandDescription.newProject",
          availableIn: ["electron"],
          unifiedSearchGroupKey: "workspace",
          unifiedSearch: !0,
          electron: {
            menuTitle: "New Project\u2026",
            menuTitleIntlId: "codex.commandMenuTitle.newProject",
          },
        },
        {
          id: "openFolder",
          titleIntlId: "codex.command.openFolder",
          descriptionIntlId: "codex.commandDescription.openFolder",
          requiredAccess: "codexOrWorkLocal",
          unifiedSearchGroupKey: "workspace",
          unifiedSearch: !0,
          unifiedSearchFeature: "codex",
          electron: {
            menuTitle: "Open Folder\u2026",
            menuTitleIntlId: "codex.commandMenuTitle.openFolder",
            defaultKeybindings: [{ key: "CmdOrCtrl+O" }],
          },
        },
        {
          id: "toggleSidebar",
          titleIntlId: "codex.command.toggleSidebar",
          descriptionIntlId: "codex.commandDescription.toggleSidebar",
          unifiedSearchGroupKey: "panels",
          unifiedSearch: !0,
          browser: { defaultKeybindings: [{ key: "CmdOrCtrl+Shift+S" }] },
          electron: {
            menuTitle: "Toggle Sidebar",
            menuTitleIntlId: "codex.commandMenuTitle.toggleSidebar",
            defaultKeybindings: [{ key: "CmdOrCtrl+Shift+S" }, { key: "CmdOrCtrl+B" }],
          },
        },
        {
          id: "toggleFileTreePanel",
          titleIntlId: "codex.commandMenuTitle.toggleFileTreePanel",
          descriptionIntlId: "codex.commandDescription.toggleFileTreePanel",
          availableIn: ["electron", "browser"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "panels",
          unifiedSearch: !0,
          browser: { defaultKeybindings: [{ key: "CmdOrCtrl+Shift+E" }] },
          electron: {
            menuTitle: "Toggle navigation panel",
            menuTitleIntlId: "codex.commandMenuTitle.toggleFileTreePanel",
            defaultKeybindings: [{ key: "CmdOrCtrl+Shift+E" }],
          },
        },
        {
          id: "toggleBottomPanel",
          titleIntlId: "codex.command.toggleBottomPanel",
          descriptionIntlId: "codex.commandDescription.toggleBottomPanel",
          requiredAccess: "codexLocal",
          unifiedSearchGroupKey: "panels",
          unifiedSearch: !0,
          unifiedSearchFeature: "codex",
          electron: {
            menuTitle: "Toggle Bottom Panel",
            menuTitleIntlId: "codex.commandMenuTitle.toggleBottomPanel",
            defaultKeybindings: [{ key: "CmdOrCtrl+J" }],
          },
        },
        {
          id: "togglePinnedSummary",
          titleIntlId: "codex.command.togglePinnedSummary",
          descriptionIntlId: "codex.commandDescription.togglePinnedSummary",
          unifiedSearchGroupKey: "panels",
          unifiedSearch: !0,
          electron: {
            menuTitle: "Toggle Pinned Summary",
            menuTitleIntlId: "codex.commandMenuTitle.togglePinnedSummary",
          },
        },
        {
          id: "toggleTerminal",
          titleIntlId: "codex.command.toggleTerminal",
          descriptionIntlId: "codex.commandDescription.toggleTerminal",
          requiredAccess: "codexLocal",
          unifiedSearchGroupKey: "panels",
          unifiedSearch: !0,
          unifiedSearchFeature: "codex",
          electron: {
            menuTitle: "Open Terminal",
            menuTitleIntlId: "codex.commandMenuTitle.toggleTerminal",
            defaultKeybindings: [{ key: "Control+`" }],
          },
        },
        {
          id: "newTab",
          titleIntlId: "codex.command.newTab",
          descriptionIntlId: "codex.commandDescription.newTab",
          unifiedSearchGroupKey: "panels",
          unifiedSearch: !0,
          unifiedSearchFeature: "codex",
          electron: {
            menuTitle: "New tab",
            menuTitleIntlId: "codex.commandMenuTitle.newTab",
            defaultKeybindings: [{ key: "CmdOrCtrl+T" }],
          },
        },
        {
          id: "newSidepaneTab",
          titleIntlId: "codex.command.newSidepaneTab",
          descriptionIntlId: "codex.commandDescription.newSidepaneTab",
          availableIn: ["electron"],
          shortcutScope: "app",
          electron: {
            menuTitle: "New sidepane tab",
            menuTitleIntlId: "codex.command.newSidepaneTab",
            platformDefaultKeybindings: { macOS: [{ key: "Cmd+Alt+T" }] },
          },
        },
        {
          id: "closeSidepaneTab",
          titleIntlId: "codex.command.closeSidepaneTab",
          descriptionIntlId: "codex.commandDescription.closeSidepaneTab",
          availableIn: ["electron"],
          shortcutScope: "app",
          electron: {
            menuTitle: "Close sidepane tab",
            menuTitleIntlId: "codex.command.closeSidepaneTab",
            defaultKeybindings: [],
          },
        },
        {
          id: "closeOtherTabs",
          titleIntlId: "codex.command.closeOtherTabs",
          descriptionIntlId: "codex.commandDescription.closeOtherTabs",
          availableIn: ["electron"],
          shortcutScope: "app",
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+Alt+W" }] },
        },
        {
          id: "showWorkspaceTabView",
          titleIntlId: "codex.command.showWorkspaceTabView",
          descriptionIntlId: "codex.commandDescription.showWorkspaceTabView",
          availableIn: ["electron", "browser"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "panels",
          unifiedSearch: !0,
          unifiedSearchFeature: "codex",
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+Shift+F" }] },
        },
        {
          id: "exitWorkspaceFullView",
          titleIntlId: "codex.command.exitWorkspaceFullView",
          descriptionIntlId: "codex.commandDescription.exitWorkspaceFullView",
          availableIn: ["electron"],
          shortcutScope: "app",
          shortcutEventPhase: "bubble",
          electron: { defaultKeybindings: [{ key: "Escape" }], isOverridableByBrowserWebpage: !0 },
        },
        {
          id: "stepWorkspaceLayout",
          titleIntlId: "codex.command.stepWorkspaceLayout",
          descriptionIntlId: "codex.commandDescription.stepWorkspaceLayout",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "panels",
          unifiedSearch: !0,
          unifiedSearchFeature: "codex",
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+Shift+B" }] },
        },
        {
          id: "openReviewTab",
          titleIntlId: "codex.command.openReviewTab",
          descriptionIntlId: "codex.commandDescription.openReviewTab",
          requiredAccess: "codexLocal",
          availableIn: ["electron", "browser"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "panels",
          unifiedSearch: !0,
          unifiedSearchFeature: "codex",
          electron: { defaultKeybindings: [{ key: "Ctrl+Shift+G" }] },
        },
        {
          id: "toggleReviewTab",
          titleIntlId: "codex.command.toggleReviewTab",
          descriptionIntlId: "codex.commandDescription.toggleReviewTab",
          requiredAccess: "codexLocal",
          availableIn: ["electron", "browser"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "panels",
        },
        {
          id: "toggleSidePanel",
          titleIntlId: "codex.command.toggleReviewPanel",
          descriptionIntlId: "codex.commandDescription.toggleReviewPanel",
          unifiedSearchGroupKey: "panels",
          unifiedSearch: !0,
          unifiedSearchFeature: "codex",
          electron: {
            menuTitle: "Toggle Changes Panel",
            menuTitleIntlId: "codex.commandMenuTitle.toggleReviewPanel",
            defaultKeybindings: [{ key: "CmdOrCtrl+Alt+B" }],
          },
        },
        {
          id: "file.goToDefinition",
          titleIntlId: "codex.command.file.goToDefinition",
          descriptionIntlId: "codex.commandDescription.file.goToDefinition",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "navigation",
          electron: {
            platformDefaultKeybindings: {
              macOS: [{ key: "Ctrl+]" }, { key: "F12" }],
              default: [{ key: "CmdOrCtrl+]" }, { key: "F12" }],
            },
          },
        },
        {
          id: "file.findReferences",
          titleIntlId: "codex.command.file.findReferences",
          descriptionIntlId: "codex.commandDescription.file.findReferences",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "navigation",
          electron: { defaultKeybindings: [{ key: "Shift+F12" }] },
        },
        {
          id: "file.navigateBack",
          titleIntlId: "codex.command.file.navigateBack",
          descriptionIntlId: "codex.commandDescription.file.navigateBack",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "navigation",
          electron: {
            platformDefaultKeybindings: {
              macOS: [{ key: "Control+-" }],
              default: [{ key: "Control+Alt+-" }],
            },
          },
        },
        {
          id: "file.navigateForward",
          titleIntlId: "codex.command.file.navigateForward",
          descriptionIntlId: "codex.commandDescription.file.navigateForward",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "navigation",
          electron: {
            platformDefaultKeybindings: {
              macOS: [{ key: "Control+Shift+-" }],
              default: [{ key: "Control+Shift+-" }],
            },
          },
        },
        {
          id: "findInThread",
          titleIntlId: "codex.command.findInThread",
          descriptionIntlId: "codex.commandDescription.findInThread",
          unifiedSearchGroupKey: "navigation",
          unifiedSearch: !0,
          electron: {
            menuTitle: "Find",
            menuTitleIntlId: "codex.commandMenuTitle.findInThread",
            defaultKeybindings: [{ key: "CmdOrCtrl+F" }],
            platformDefaultKeybindings: {
              macOS: [{ key: "Command+F" }],
              default: [{ key: "Ctrl+F" }],
            },
            isOverridableByBrowserWebpage: !0,
          },
        },
        {
          id: "goToLine",
          titleIntlId: "codex.command.goToLine",
          descriptionIntlId: "codex.commandDescription.goToLine",
          availableIn: ["electron"],
          shortcutScope: "app",
          unifiedSearchGroupKey: "navigation",
          unifiedSearch: !0,
          electron: { defaultKeybindings: [{ key: "CmdOrCtrl+L" }] },
        },
        {
          id: "focusBrowserAddressBar",
          titleIntlId: "codex.command.focusBrowserAddressBar",
          descriptionIntlId: "codex.commandDescription.focusBrowserAddressBar",
          unifiedSearchGroupKey: "navigation",
          unifiedSearch: !0,
          unifiedSearchFeature: "codex",
          electron: {
            menuTitle: "Focus Browser Address Bar",
            menuTitleIntlId: "codex.commandMenuTitle.focusBrowserAddressBar",
            defaultKeybindings: [{ key: "CmdOrCtrl+L" }],
          },
        },
        {
          id: "navigateBrowserBack",
          titleIntlId: "codex.command.navigateBrowserBack",
          descriptionIntlId: "codex.commandDescription.navigateBrowserBack",
          availableIn: ["electron"],
          shortcutScope: "app",
          electron: {
            platformDefaultKeybindings: {
              macOS: [{ key: "Command+Left" }],
              default: [{ key: "Alt+Left" }],
            },
            isOverridableByBrowserWebpage: !0,
          },
        },
        {
          id: "navigateBrowserForward",
          titleIntlId: "codex.command.navigateBrowserForward",
          descriptionIntlId: "codex.commandDescription.navigateBrowserForward",
          availableIn: ["electron"],
          shortcutScope: "app",
          electron: {
            platformDefaultKeybindings: {
              macOS: [{ key: "Command+Right" }],
              default: [{ key: "Alt+Right" }],
            },
            isOverridableByBrowserWebpage: !0,
          },
        },
        {
          id: "navigateBack",
          titleIntlId: "codex.command.navigateBack",
          descriptionIntlId: "codex.commandDescription.navigateBack",
          unifiedSearchGroupKey: "navigation",
          unifiedSearch: !0,
          electron: {
            menuTitle: "Back",
            menuTitleIntlId: "codex.commandMenuTitle.navigateBack",
            defaultKeybindings: [{ key: "CmdOrCtrl+[" }, { key: "MouseBack" }],
          },
        },
        {
          id: "navigateForward",
          titleIntlId: "codex.command.navigateForward",
          descriptionIntlId: "codex.commandDescription.navigateForward",
          unifiedSearchGroupKey: "navigation",
          unifiedSearch: !0,
          electron: {
            menuTitle: "Forward",
            menuTitleIntlId: "codex.commandMenuTitle.navigateForward",
            defaultKeybindings: [{ key: "CmdOrCtrl+]" }, { key: "MouseForward" }],
          },
        },
        {
          id: "logOut",
          titleIntlId: "codex.command.logOut",
          descriptionIntlId: "codex.commandDescription.logOut",
          unifiedSearchGroupKey: "app",
          unifiedSearch: !0,
          electron: { menuTitle: "Log Out", menuTitleIntlId: "codex.commandMenuTitle.logOut" },
        },
        {
          id: "feedback",
          titleIntlId: "codex.command.feedback",
          descriptionIntlId: "codex.commandDescription.feedback",
          unifiedSearchGroupKey: "app",
          unifiedSearch: !0,
        },
        {
          id: "environmentAction1",
          titleIntlId: "codex.command.environmentAction1",
          descriptionIntlId: "codex.commandDescription.environmentActionSlot",
          shortcutScope: "app",
          unifiedSearchGroupKey: "workspace",
        },
        {
          id: "environmentAction2",
          titleIntlId: "codex.command.environmentAction2",
          descriptionIntlId: "codex.commandDescription.environmentActionSlot",
          shortcutScope: "app",
          unifiedSearchGroupKey: "workspace",
        },
        {
          id: "environmentAction3",
          titleIntlId: "codex.command.environmentAction3",
          descriptionIntlId: "codex.commandDescription.environmentActionSlot",
          shortcutScope: "app",
          unifiedSearchGroupKey: "workspace",
        },
        {
          id: "environmentAction4",
          titleIntlId: "codex.command.environmentAction4",
          descriptionIntlId: "codex.commandDescription.environmentActionSlot",
          shortcutScope: "app",
          unifiedSearchGroupKey: "workspace",
        },
        {
          id: "environmentAction5",
          titleIntlId: "codex.command.environmentAction5",
          descriptionIntlId: "codex.commandDescription.environmentActionSlot",
          shortcutScope: "app",
          unifiedSearchGroupKey: "workspace",
        },
        {
          id: "environmentAction6",
          titleIntlId: "codex.command.environmentAction6",
          descriptionIntlId: "codex.commandDescription.environmentActionSlot",
          shortcutScope: "app",
          unifiedSearchGroupKey: "workspace",
        },
        {
          id: "environmentAction7",
          titleIntlId: "codex.command.environmentAction7",
          descriptionIntlId: "codex.commandDescription.environmentActionSlot",
          shortcutScope: "app",
          unifiedSearchGroupKey: "workspace",
        },
        {
          id: "environmentAction8",
          titleIntlId: "codex.command.environmentAction8",
          descriptionIntlId: "codex.commandDescription.environmentActionSlot",
          shortcutScope: "app",
          unifiedSearchGroupKey: "workspace",
        },
        {
          id: "environmentAction9",
          titleIntlId: "codex.command.environmentAction9",
          descriptionIntlId: "codex.commandDescription.environmentActionSlot",
          shortcutScope: "app",
          unifiedSearchGroupKey: "workspace",
        },
        {
          id: "thread1",
          titleIntlId: "codex.command.thread1",
          descriptionIntlId: "codex.commandDescription.threadSlot",
          electron: {
            menuTitle: "Go to Chat 1",
            menuTitleIntlId: "codex.commandMenuTitle.thread1",
            defaultKeybindings: [{ key: "CmdOrCtrl+1" }],
          },
        },
        {
          id: "thread2",
          titleIntlId: "codex.command.thread2",
          descriptionIntlId: "codex.commandDescription.threadSlot",
          electron: {
            menuTitle: "Go to Chat 2",
            menuTitleIntlId: "codex.commandMenuTitle.thread2",
            defaultKeybindings: [{ key: "CmdOrCtrl+2" }],
          },
        },
        {
          id: "thread3",
          titleIntlId: "codex.command.thread3",
          descriptionIntlId: "codex.commandDescription.threadSlot",
          electron: {
            menuTitle: "Go to Chat 3",
            menuTitleIntlId: "codex.commandMenuTitle.thread3",
            defaultKeybindings: [{ key: "CmdOrCtrl+3" }],
          },
        },
        {
          id: "thread4",
          titleIntlId: "codex.command.thread4",
          descriptionIntlId: "codex.commandDescription.threadSlot",
          electron: {
            menuTitle: "Go to Chat 4",
            menuTitleIntlId: "codex.commandMenuTitle.thread4",
            defaultKeybindings: [{ key: "CmdOrCtrl+4" }],
          },
        },
        {
          id: "thread5",
          titleIntlId: "codex.command.thread5",
          descriptionIntlId: "codex.commandDescription.threadSlot",
          electron: {
            menuTitle: "Go to Chat 5",
            menuTitleIntlId: "codex.commandMenuTitle.thread5",
            defaultKeybindings: [{ key: "CmdOrCtrl+5" }],
          },
        },
        {
          id: "thread6",
          titleIntlId: "codex.command.thread6",
          descriptionIntlId: "codex.commandDescription.threadSlot",
          electron: {
            menuTitle: "Go to Chat 6",
            menuTitleIntlId: "codex.commandMenuTitle.thread6",
            defaultKeybindings: [{ key: "CmdOrCtrl+6" }],
          },
        },
        {
          id: "thread7",
          titleIntlId: "codex.command.thread7",
          descriptionIntlId: "codex.commandDescription.threadSlot",
          electron: {
            menuTitle: "Go to Chat 7",
            menuTitleIntlId: "codex.commandMenuTitle.thread7",
            defaultKeybindings: [{ key: "CmdOrCtrl+7" }],
          },
        },
        {
          id: "thread8",
          titleIntlId: "codex.command.thread8",
          descriptionIntlId: "codex.commandDescription.threadSlot",
          electron: {
            menuTitle: "Go to Chat 8",
            menuTitleIntlId: "codex.commandMenuTitle.thread8",
            defaultKeybindings: [{ key: "CmdOrCtrl+8" }],
          },
        },
        {
          id: "thread9",
          titleIntlId: "codex.command.thread9",
          descriptionIntlId: "codex.commandDescription.threadSlot",
          electron: {
            menuTitle: "Go to Chat 9",
            menuTitleIntlId: "codex.commandMenuTitle.thread9",
            defaultKeybindings: [{ key: "CmdOrCtrl+9" }],
          },
        },
      ]));
  });
