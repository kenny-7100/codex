function CVe(t) {
  return t !== null && typeof t == "object" && !Array.isArray(t);
}
function TVe(t, e) {
  let r = { ...t };
  for (let n in e) {
    let o = n,
      i = e[o];
    if (i === void 0) continue;
    let s = r[o];
    CVe(s) && CVe(i) ? (r[o] = { ...s, ...i }) : (r[o] = i);
  }
  return r;
}
Wp();
var bKe = F(aJ(), 1),
  SKe = F(vKe(), 1);
function F9t() {
  let t = new bKe.default({ strict: !1, validateFormats: !0, validateSchema: !1, allErrors: !0 });
  return ((0, SKe.default)(t), t);
}
var FB = class {
  constructor(e) {
    this._ajv = e ?? F9t();
  }
  getValidator(e) {
    let r =
      "$id" in e && typeof e.$id == "string"
        ? (this._ajv.getSchema(e.$id) ?? this._ajv.compile(e))
        : this._ajv.compile(e);
    return (n) =>
      r(n)
        ? { valid: !0, data: n, errorMessage: void 0 }
        : { valid: !1, data: void 0, errorMessage: this._ajv.errorsText(r.errors) };
  }
};
Wp();
var $B = class {
  constructor(e) {
    this._server = e;
  }
  requestStream(e, r, n) {
    return this._server.requestStream(e, r, n);
  }
  createMessageStream(e, r) {
    let n = this._server.getClientCapabilities();
    if ((e.tools || e.toolChoice) && !n?.sampling?.tools)
      throw new Error("Client does not support sampling tools capability.");
    if (e.messages.length > 0) {
      let o = e.messages[e.messages.length - 1],
        i = Array.isArray(o.content) ? o.content : [o.content],
        s = i.some((u) => u.type === "tool_result"),
        a = e.messages.length > 1 ? e.messages[e.messages.length - 2] : void 0,
        l = a ? (Array.isArray(a.content) ? a.content : [a.content]) : [],
        c = l.some((u) => u.type === "tool_use");
      if (s) {
        if (i.some((u) => u.type !== "tool_result"))
          throw new Error(
            "The last message must contain only tool_result content if any is present",
          );
        if (!c)
          throw new Error(
            "tool_result blocks are not matching any tool_use from the previous message",
          );
      }
      if (c) {
        let u = new Set(l.filter((m) => m.type === "tool_use").map((m) => m.id)),
          p = new Set(i.filter((m) => m.type === "tool_result").map((m) => m.toolUseId));
        if (u.size !== p.size || ![...u].every((m) => p.has(m)))
          throw new Error(
            "ids of tool_result blocks and tool_use blocks from previous message do not match",
          );
      }
    }
    return this.requestStream({ method: "sampling/createMessage", params: e }, jw, r);
  }
  elicitInputStream(e, r) {
    let n = this._server.getClientCapabilities(),
      o = e.mode ?? "form";
    switch (o) {
      case "url": {
        if (!n?.elicitation?.url) throw new Error("Client does not support url elicitation.");
        break;
      }
      case "form": {
        if (!n?.elicitation?.form) throw new Error("Client does not support form elicitation.");
        break;
      }
    }
    let i = o === "form" && e.mode === void 0 ? { ...e, mode: "form" } : e;
    return this.requestStream({ method: "elicitation/create", params: i }, Cg, r);
  }
  async getTask(e, r) {
    return this._server.getTask({ taskId: e }, r);
  }
  async getTaskResult(e, r, n) {
    return this._server.getTaskResult({ taskId: e }, r, n);
  }
  async listTasks(e, r) {
    return this._server.listTasks(e ? { cursor: e } : void 0, r);
  }
  async cancelTask(e, r) {
    return this._server.cancelTask({ taskId: e }, r);
  }
};
function wKe(t, e, r) {
  if (!t) throw new Error(`${r} does not support task creation (required for ${e})`);
  switch (e) {
    case "tools/call":
      if (!t.tools?.call)
        throw new Error(`${r} does not support task creation for tools/call (required for ${e})`);
      break;
    default:
      break;
  }
}
function _Ke(t, e, r) {
  if (!t) throw new Error(`${r} does not support task creation (required for ${e})`);
  switch (e) {
    case "sampling/createMessage":
      if (!t.sampling?.createMessage)
        throw new Error(
          `${r} does not support task creation for sampling/createMessage (required for ${e})`,
        );
      break;
    case "elicitation/create":
      if (!t.elicitation?.create)
        throw new Error(
          `${r} does not support task creation for elicitation/create (required for ${e})`,
        );
      break;
    default:
      break;
  }
}
var UB = class extends nB {
  constructor(e, r) {
    (super(r),
      (this._serverInfo = e),
      (this._loggingLevels = new Map()),
      (this.LOG_LEVEL_SEVERITY = new Map(Hw.options.map((n, o) => [n, o]))),
      (this.isMessageIgnored = (n, o) => {
        let i = this._loggingLevels.get(o);
        return i ? this.LOG_LEVEL_SEVERITY.get(n) < this.LOG_LEVEL_SEVERITY.get(i) : !1;
      }),
      (this._capabilities = r?.capabilities ?? {}),
      (this._instructions = r?.instructions),
      (this._jsonSchemaValidator = r?.jsonSchemaValidator ?? new FB()),
      this.setRequestHandler(kW, (n) => this._oninitialize(n)),
      this.setNotificationHandler(DW, () => this.oninitialized?.()),
      this._capabilities.logging &&
        this.setRequestHandler($W, async (n, o) => {
          let i = o.sessionId || o.requestInfo?.headers["mcp-session-id"] || void 0,
            { level: s } = n.params,
            a = Hw.safeParse(s);
          return (a.success && this._loggingLevels.set(i, a.data), {});
        }));
  }
  get experimental() {
    return (
      this._experimental || (this._experimental = { tasks: new $B(this) }),
      this._experimental
    );
  }
  registerCapabilities(e) {
    if (this.transport)
      throw new Error("Cannot register capabilities after connecting to transport");
    this._capabilities = TVe(this._capabilities, e);
  }
  setRequestHandler(e, r) {
    let o = Md(e)?.method;
    if (!o) throw new Error("Schema is missing a method literal");
    let i;
    if (bs(o)) {
      let a = o;
      i = a._zod?.def?.value ?? a.value;
    } else {
      let a = o;
      i = a._def?.value ?? a.value;
    }
    if (typeof i != "string") throw new Error("Schema method literal must be a string");
    if (i === "tools/call") {
      let a = async (l, c) => {
        let u = Dd(Eg, l);
        if (!u.success) {
          let h = u.error instanceof Error ? u.error.message : String(u.error);
          throw new Oe($e.InvalidParams, `Invalid tools/call request: ${h}`);
        }
        let { params: p } = u.data,
          m = await Promise.resolve(r(l, c));
        if (p.task) {
          let h = Dd(Ag, m);
          if (!h.success) {
            let v = h.error instanceof Error ? h.error.message : String(h.error);
            throw new Oe($e.InvalidParams, `Invalid task creation result: ${v}`);
          }
          return h.data;
        }
        let f = Dd(bk, m);
        if (!f.success) {
          let h = f.error instanceof Error ? f.error.message : String(f.error);
          throw new Oe($e.InvalidParams, `Invalid tools/call result: ${h}`);
        }
        return f.data;
      };
      return super.setRequestHandler(e, a);
    }
    return super.setRequestHandler(e, r);
  }
  assertCapabilityForMethod(e) {
    switch (e) {
      case "sampling/createMessage":
        if (!this._clientCapabilities?.sampling)
          throw new Error(`Client does not support sampling (required for ${e})`);
        break;
      case "elicitation/create":
        if (!this._clientCapabilities?.elicitation)
          throw new Error(`Client does not support elicitation (required for ${e})`);
        break;
      case "roots/list":
        if (!this._clientCapabilities?.roots)
          throw new Error(`Client does not support listing roots (required for ${e})`);
        break;
      case "ping":
        break;
    }
  }
  assertNotificationCapability(e) {
    switch (e) {
      case "notifications/message":
        if (!this._capabilities.logging)
          throw new Error(`Server does not support logging (required for ${e})`);
        break;
      case "notifications/resources/updated":
      case "notifications/resources/list_changed":
        if (!this._capabilities.resources)
          throw new Error(`Server does not support notifying about resources (required for ${e})`);
        break;
      case "notifications/tools/list_changed":
        if (!this._capabilities.tools)
          throw new Error(
            `Server does not support notifying of tool list changes (required for ${e})`,
          );
        break;
      case "notifications/prompts/list_changed":
        if (!this._capabilities.prompts)
          throw new Error(
            `Server does not support notifying of prompt list changes (required for ${e})`,
          );
        break;
      case "notifications/elicitation/complete":
        if (!this._clientCapabilities?.elicitation?.url)
          throw new Error(`Client does not support URL elicitation (required for ${e})`);
        break;
      case "notifications/cancelled":
        break;
      case "notifications/progress":
        break;
    }
  }
  assertRequestHandlerCapability(e) {
    if (this._capabilities)
      switch (e) {
        case "completion/complete":
          if (!this._capabilities.completions)
            throw new Error(`Server does not support completions (required for ${e})`);
          break;
        case "logging/setLevel":
          if (!this._capabilities.logging)
            throw new Error(`Server does not support logging (required for ${e})`);
          break;
        case "prompts/get":
        case "prompts/list":
          if (!this._capabilities.prompts)
            throw new Error(`Server does not support prompts (required for ${e})`);
          break;
        case "resources/list":
        case "resources/templates/list":
        case "resources/read":
          if (!this._capabilities.resources)
            throw new Error(`Server does not support resources (required for ${e})`);
          break;
        case "tools/call":
        case "tools/list":
          if (!this._capabilities.tools)
            throw new Error(`Server does not support tools (required for ${e})`);
          break;
        case "tasks/get":
        case "tasks/list":
        case "tasks/result":
        case "tasks/cancel":
          if (!this._capabilities.tasks)
            throw new Error(`Server does not support tasks capability (required for ${e})`);
          break;
        case "ping":
        case "initialize":
          break;
      }
  }
  assertTaskCapability(e) {
    _Ke(this._clientCapabilities?.tasks?.requests, e, "Client");
  }
  assertTaskHandlerCapability(e) {
    this._capabilities && wKe(this._capabilities.tasks?.requests, e, "Server");
  }
  async _oninitialize(e) {
    let r = e.params.protocolVersion;
    return (
      (this._clientCapabilities = e.params.capabilities),
      (this._clientVersion = e.params.clientInfo),
      {
        protocolVersion: Qfe.includes(r) ? r : EW,
        capabilities: this.getCapabilities(),
        serverInfo: this._serverInfo,
        ...(this._instructions && { instructions: this._instructions }),
      }
    );
  }
  getClientCapabilities() {
    return this._clientCapabilities;
  }
  getClientVersion() {
    return this._clientVersion;
  }
  getCapabilities() {
    return this._capabilities;
  }
  async ping() {
    return this.request({ method: "ping" }, nk);
  }
  async createMessage(e, r) {
    if ((e.tools || e.toolChoice) && !this._clientCapabilities?.sampling?.tools)
      throw new Error("Client does not support sampling tools capability.");
    if (e.messages.length > 0) {
      let n = e.messages[e.messages.length - 1],
        o = Array.isArray(n.content) ? n.content : [n.content],
        i = o.some((c) => c.type === "tool_result"),
        s = e.messages.length > 1 ? e.messages[e.messages.length - 2] : void 0,
        a = s ? (Array.isArray(s.content) ? s.content : [s.content]) : [],
        l = a.some((c) => c.type === "tool_use");
      if (i) {
        if (o.some((c) => c.type !== "tool_result"))
          throw new Error(
            "The last message must contain only tool_result content if any is present",
          );
        if (!l)
          throw new Error(
            "tool_result blocks are not matching any tool_use from the previous message",
          );
      }
      if (l) {
        let c = new Set(a.filter((p) => p.type === "tool_use").map((p) => p.id)),
          u = new Set(o.filter((p) => p.type === "tool_result").map((p) => p.toolUseId));
        if (c.size !== u.size || ![...c].every((p) => u.has(p)))
          throw new Error(
            "ids of tool_result blocks and tool_use blocks from previous message do not match",
          );
      }
    }
    return e.tools
      ? this.request({ method: "sampling/createMessage", params: e }, UW, r)
      : this.request({ method: "sampling/createMessage", params: e }, jw, r);
  }
  async elicitInput(e, r) {
    switch (e.mode ?? "form") {
      case "url": {
        if (!this._clientCapabilities?.elicitation?.url)
          throw new Error("Client does not support url elicitation.");
        let o = e;
        return this.request({ method: "elicitation/create", params: o }, Cg, r);
      }
      case "form": {
        if (!this._clientCapabilities?.elicitation?.form)
          throw new Error("Client does not support form elicitation.");
        let o = e.mode === "form" ? e : { ...e, mode: "form" },
          i = await this.request({ method: "elicitation/create", params: o }, Cg, r);
        if (i.action === "accept" && i.content && o.requestedSchema)
          try {
            let a = this._jsonSchemaValidator.getValidator(o.requestedSchema)(i.content);
            if (!a.valid)
              throw new Oe(
                $e.InvalidParams,
                `Elicitation response content does not match requested schema: ${a.errorMessage}`,
              );
          } catch (s) {
            throw s instanceof Oe
              ? s
              : new Oe(
                  $e.InternalError,
                  `Error validating elicitation response: ${s instanceof Error ? s.message : String(s)}`,
                );
          }
        return i;
      }
    }
  }
  createElicitationCompletionNotifier(e, r) {
    if (!this._clientCapabilities?.elicitation?.url)
      throw new Error(
        "Client does not support URL elicitation (required for notifications/elicitation/complete)",
      );
    return () =>
      this.notification(
        { method: "notifications/elicitation/complete", params: { elicitationId: e } },
        r,
      );
  }
  async listRoots(e, r) {
    return this.request({ method: "roots/list", params: e }, qW, r);
  }
  async sendLoggingMessage(e, r) {
    if (this._capabilities.logging && !this.isMessageIgnored(e.level, r))
      return this.notification({ method: "notifications/message", params: e });
  }
  async sendResourceUpdated(e) {
    return this.notification({ method: "notifications/resources/updated", params: e });
  }
  async sendResourceListChanged() {
    return this.notification({ method: "notifications/resources/list_changed" });
  }
  async sendToolListChanged() {
    return this.notification({ method: "notifications/tools/list_changed" });
  }
  async sendPromptListChanged() {
    return this.notification({ method: "notifications/prompts/list_changed" });
  }
};
Wp();
var AKe = Symbol.for("mcp.completable");
function hJ(t) {
  return !!t && typeof t == "object" && AKe in t;
}
function RKe(t) {
  return t[AKe]?.complete;
}
var xKe;
(function (t) {
  t.Completable = "McpCompletable";
})(xKe || (xKe = {}));
var $9t = /^[A-Za-z0-9._-]{1,128}$/;
function U9t(t) {
  let e = [];
  if (t.length === 0) return { isValid: !1, warnings: ["Tool name cannot be empty"] };
  if (t.length > 128)
    return {
      isValid: !1,
      warnings: [`Tool name exceeds maximum length of 128 characters (current: ${t.length})`],
    };
  if (
    (t.includes(" ") && e.push("Tool name contains spaces, which may cause parsing issues"),
    t.includes(",") && e.push("Tool name contains commas, which may cause parsing issues"),
    (t.startsWith("-") || t.endsWith("-")) &&
      e.push(
        "Tool name starts or ends with a dash, which may cause parsing issues in some contexts",
      ),
    (t.startsWith(".") || t.endsWith(".")) &&
      e.push(
        "Tool name starts or ends with a dot, which may cause parsing issues in some contexts",
      ),
    !$9t.test(t))
  ) {
    let r = t
      .split("")
      .filter((n) => !/[A-Za-z0-9._-]/.test(n))
      .filter((n, o, i) => i.indexOf(n) === o);
    return (
      e.push(
        `Tool name contains invalid characters: ${r.map((n) => `"${n}"`).join(", ")}`,
        "Allowed characters are: A-Z, a-z, 0-9, underscore (_), dash (-), and dot (.)",
      ),
      { isValid: !1, warnings: e }
    );
  }
  return { isValid: !0, warnings: e };
}
function q9t(t, e) {
  if (e.length > 0) {
    console.warn(`Tool name validation warning for "${t}":`);
    for (let r of e) console.warn(`  - ${r}`);
    (console.warn("Tool registration will proceed, but this may cause compatibility issues."),
      console.warn("Consider updating the tool name to conform to the MCP tool naming standard."),
      console.warn(
        "See SEP: Specify Format for Tool Names (https://github.com/modelcontextprotocol/modelcontextprotocol/issues/986) for more details.",
      ));
  }
}
function gJ(t) {
  let e = U9t(t);
  return (q9t(t, e.warnings), e.isValid);
}
var qB = class {
  constructor(e) {
    this._mcpServer = e;
  }
  registerToolTask(e, r, n) {
    let o = { taskSupport: "required", ...r.execution };
    if (o.taskSupport === "forbidden")
      throw new Error(
        `Cannot register task-based tool '${e}' with taskSupport 'forbidden'. Use registerTool() instead.`,
      );
    return this._mcpServer._createRegisteredTool(
      e,
      r.title,
      r.description,
      r.inputSchema,
      r.outputSchema,
      r.annotations,
      o,
      r._meta,
      n,
    );
  }
};
$();
var GB = class {
  constructor(e, r) {
    ((this._registeredResources = {}),
      (this._registeredResourceTemplates = {}),
      (this._registeredTools = {}),
      (this._registeredPrompts = {}),
      (this._toolHandlersInitialized = !1),
      (this._completionHandlerInitialized = !1),
      (this._resourceHandlersInitialized = !1),
      (this._promptHandlersInitialized = !1),
      (this.server = new UB(e, r)));
  }
  get experimental() {
    return (
      this._experimental || (this._experimental = { tasks: new qB(this) }),
      this._experimental
    );
  }
  async connect(e) {
    return await this.server.connect(e);
  }
  async close() {
    await this.server.close();
  }
  setToolRequestHandlers() {
    this._toolHandlersInitialized ||
      (this.server.assertCanSetRequestHandler(Wd(vk)),
      this.server.assertCanSetRequestHandler(Wd(Eg)),
      this.server.registerCapabilities({ tools: { listChanged: !0 } }),
      this.server.setRequestHandler(vk, () => ({
        tools: Object.entries(this._registeredTools)
          .filter(([, e]) => e.enabled)
          .map(([e, r]) => {
            let n = {
              name: e,
              title: r.title,
              description: r.description,
              inputSchema: (() => {
                let o = nb(r.inputSchema);
                return o ? bX(o, { strictUnions: !0, pipeStrategy: "input" }) : G9t;
              })(),
              annotations: r.annotations,
              execution: r.execution,
              _meta: r._meta,
            };
            if (r.outputSchema) {
              let o = nb(r.outputSchema);
              o && (n.outputSchema = bX(o, { strictUnions: !0, pipeStrategy: "output" }));
            }
            return n;
          }),
      })),
      this.server.setRequestHandler(Eg, async (e, r) => {
        try {
          let n = this._registeredTools[e.params.name];
          if (!n) throw new Oe($e.InvalidParams, `Tool ${e.params.name} not found`);
          if (!n.enabled) throw new Oe($e.InvalidParams, `Tool ${e.params.name} disabled`);
          let o = !!e.params.task,
            i = n.execution?.taskSupport,
            s = "createTask" in n.handler;
          if ((i === "required" || i === "optional") && !s)
            throw new Oe(
              $e.InternalError,
              `Tool ${e.params.name} has taskSupport '${i}' but was not registered with registerToolTask`,
            );
          if (i === "required" && !o)
            throw new Oe(
              $e.MethodNotFound,
              `Tool ${e.params.name} requires task augmentation (taskSupport: 'required')`,
            );
          if (i === "optional" && !o && s) return await this.handleAutomaticTaskPolling(n, e, r);
          let a = await this.validateToolInput(n, e.params.arguments, e.params.name),
            l = await this.executeToolHandler(n, a, r);
          return (o || (await this.validateToolOutput(n, l, e.params.name)), l);
        } catch (n) {
          if (n instanceof Oe && n.code === $e.UrlElicitationRequired) throw n;
          return this.createToolError(n instanceof Error ? n.message : String(n));
        }
      }),
      (this._toolHandlersInitialized = !0));
  }
  createToolError(e) {
    return { content: [{ type: "text", text: e }], isError: !0 };
  }
  async validateToolInput(e, r, n) {
    if (!e.inputSchema) return;
    let i = nb(e.inputSchema) ?? e.inputSchema,
      s = await X2(i, r);
    if (!s.success) {
      let a = "error" in s ? s.error : "Unknown error",
        l = Y2(a);
      throw new Oe(
        $e.InvalidParams,
        `Input validation error: Invalid arguments for tool ${n}: ${l}`,
      );
    }
    return s.data;
  }
  async validateToolOutput(e, r, n) {
    if (!e.outputSchema || !("content" in r) || r.isError) return;
    if (!r.structuredContent)
      throw new Oe(
        $e.InvalidParams,
        `Output validation error: Tool ${n} has an output schema but no structured content was provided`,
      );
    let o = nb(e.outputSchema),
      i = await X2(o, r.structuredContent);
    if (!i.success) {
      let s = "error" in i ? i.error : "Unknown error",
        a = Y2(s);
      throw new Oe(
        $e.InvalidParams,
        `Output validation error: Invalid structured content for tool ${n}: ${a}`,
      );
    }
  }
  async executeToolHandler(e, r, n) {
    let o = e.handler;
    if ("createTask" in o) {
      if (!n.taskStore) throw new Error("No task store provided.");
      let s = { ...n, taskStore: n.taskStore };
      if (e.inputSchema) {
        let a = o;
        return await Promise.resolve(a.createTask(r, s));
      } else {
        let a = o;
        return await Promise.resolve(a.createTask(s));
      }
    }
    if (e.inputSchema) {
      let s = o;
      return await Promise.resolve(s(r, n));
    } else {
      let s = o;
      return await Promise.resolve(s(n));
    }
  }
  async handleAutomaticTaskPolling(e, r, n) {
    if (!n.taskStore) throw new Error("No task store provided for task-capable tool.");
    let o = await this.validateToolInput(e, r.params.arguments, r.params.name),
      i = e.handler,
      s = { ...n, taskStore: n.taskStore },
      a = o ? await Promise.resolve(i.createTask(o, s)) : await Promise.resolve(i.createTask(s)),
      l = a.task.taskId,
      c = a.task,
      u = c.pollInterval ?? 5e3;
    for (; c.status !== "completed" && c.status !== "failed" && c.status !== "cancelled"; ) {
      await new Promise((m) => setTimeout(m, u));
      let p = await n.taskStore.getTask(l);
      if (!p) throw new Oe($e.InternalError, `Task ${l} not found during polling`);
      c = p;
    }
    return await n.taskStore.getTaskResult(l);
  }
  setCompletionRequestHandler() {
    this._completionHandlerInitialized ||
      (this.server.assertCanSetRequestHandler(Wd(Sk)),
      this.server.registerCapabilities({ completions: {} }),
      this.server.setRequestHandler(Sk, async (e) => {
        switch (e.params.ref.type) {
          case "ref/prompt":
            return (hhe(e), this.handlePromptCompletion(e, e.params.ref));
          case "ref/resource":
            return (ghe(e), this.handleResourceCompletion(e, e.params.ref));
          default:
            throw new Oe($e.InvalidParams, `Invalid completion reference: ${e.params.ref}`);
        }
      }),
      (this._completionHandlerInitialized = !0));
  }
  async handlePromptCompletion(e, r) {
    let n = this._registeredPrompts[r.name];
    if (!n) throw new Oe($e.InvalidParams, `Prompt ${r.name} not found`);
    if (!n.enabled) throw new Oe($e.InvalidParams, `Prompt ${r.name} disabled`);
    if (!n.argsSchema) return cE;
    let i = Md(n.argsSchema)?.[e.params.argument.name];
    if (!hJ(i)) return cE;
    let s = RKe(i);
    if (!s) return cE;
    let a = await s(e.params.argument.value, e.params.context);
    return CKe(a);
  }
  async handleResourceCompletion(e, r) {
    let n = Object.values(this._registeredResourceTemplates).find(
      (s) => s.resourceTemplate.uriTemplate.toString() === r.uri,
    );
    if (!n) {
      if (this._registeredResources[r.uri]) return cE;
      throw new Oe($e.InvalidParams, `Resource template ${e.params.ref.uri} not found`);
    }
    let o = n.resourceTemplate.completeCallback(e.params.argument.name);
    if (!o) return cE;
    let i = await o(e.params.argument.value, e.params.context);
    return CKe(i);
  }
  setResourceRequestHandlers() {
    this._resourceHandlersInitialized ||
      (this.server.assertCanSetRequestHandler(Wd(mk)),
      this.server.assertCanSetRequestHandler(Wd(fk)),
      this.server.assertCanSetRequestHandler(Wd(hk)),
      this.server.registerCapabilities({ resources: { listChanged: !0 } }),
      this.server.setRequestHandler(mk, async (e, r) => {
        let n = Object.entries(this._registeredResources)
            .filter(([i, s]) => s.enabled)
            .map(([i, s]) => ({ uri: i, name: s.name, ...s.metadata })),
          o = [];
        for (let i of Object.values(this._registeredResourceTemplates)) {
          if (!i.resourceTemplate.listCallback) continue;
          let s = await i.resourceTemplate.listCallback(r);
          for (let a of s.resources) o.push({ ...i.metadata, ...a });
        }
        return { resources: [...n, ...o] };
      }),
      this.server.setRequestHandler(fk, async () => ({
        resourceTemplates: Object.entries(this._registeredResourceTemplates).map(([r, n]) => ({
          name: r,
          uriTemplate: n.resourceTemplate.uriTemplate.toString(),
          ...n.metadata,
        })),
      })),
      this.server.setRequestHandler(hk, async (e, r) => {
        let n = new URL(e.params.uri),
          o = this._registeredResources[n.toString()];
        if (o) {
          if (!o.enabled) throw new Oe($e.InvalidParams, `Resource ${n} disabled`);
          return o.readCallback(n, r);
        }
        for (let i of Object.values(this._registeredResourceTemplates)) {
          let s = i.resourceTemplate.uriTemplate.match(n.toString());
          if (s) return i.readCallback(n, s, r);
        }
        throw new Oe($e.InvalidParams, `Resource ${n} not found`);
      }),
      (this._resourceHandlersInitialized = !0));
  }
  setPromptRequestHandlers() {
    this._promptHandlersInitialized ||
      (this.server.assertCanSetRequestHandler(Wd(gk)),
      this.server.assertCanSetRequestHandler(Wd(yk)),
      this.server.registerCapabilities({ prompts: { listChanged: !0 } }),
      this.server.setRequestHandler(gk, () => ({
        prompts: Object.entries(this._registeredPrompts)
          .filter(([, e]) => e.enabled)
          .map(([e, r]) => ({
            name: e,
            title: r.title,
            description: r.description,
            arguments: r.argsSchema ? W9t(r.argsSchema) : void 0,
          })),
      })),
      this.server.setRequestHandler(yk, async (e, r) => {
        let n = this._registeredPrompts[e.params.name];
        if (!n) throw new Oe($e.InvalidParams, `Prompt ${e.params.name} not found`);
        if (!n.enabled) throw new Oe($e.InvalidParams, `Prompt ${e.params.name} disabled`);
        if (n.argsSchema) {
          let o = nb(n.argsSchema),
            i = await X2(o, e.params.arguments);
          if (!i.success) {
            let l = "error" in i ? i.error : "Unknown error",
              c = Y2(l);
            throw new Oe($e.InvalidParams, `Invalid arguments for prompt ${e.params.name}: ${c}`);
          }
          let s = i.data,
            a = n.callback;
          return await Promise.resolve(a(s, r));
        } else {
          let o = n.callback;
          return await Promise.resolve(o(r));
        }
      }),
      (this._promptHandlersInitialized = !0));
  }
  resource(e, r, ...n) {
    let o;
    typeof n[0] == "object" && (o = n.shift());
    let i = n[0];
    if (typeof r == "string") {
      if (this._registeredResources[r]) throw new Error(`Resource ${r} is already registered`);
      let s = this._createRegisteredResource(e, void 0, r, o, i);
      return (this.setResourceRequestHandlers(), this.sendResourceListChanged(), s);
    } else {
      if (this._registeredResourceTemplates[e])
        throw new Error(`Resource template ${e} is already registered`);
      let s = this._createRegisteredResourceTemplate(e, void 0, r, o, i);
      return (this.setResourceRequestHandlers(), this.sendResourceListChanged(), s);
    }
  }
  registerResource(e, r, n, o) {
    if (typeof r == "string") {
      if (this._registeredResources[r]) throw new Error(`Resource ${r} is already registered`);
      let i = this._createRegisteredResource(e, n.title, r, n, o);
      return (this.setResourceRequestHandlers(), this.sendResourceListChanged(), i);
    } else {
      if (this._registeredResourceTemplates[e])
        throw new Error(`Resource template ${e} is already registered`);
      let i = this._createRegisteredResourceTemplate(e, n.title, r, n, o);
      return (this.setResourceRequestHandlers(), this.sendResourceListChanged(), i);
    }
  }
  _createRegisteredResource(e, r, n, o, i) {
    let s = {
      name: e,
      title: r,
      metadata: o,
      readCallback: i,
      enabled: !0,
      disable: () => s.update({ enabled: !1 }),
      enable: () => s.update({ enabled: !0 }),
      remove: () => s.update({ uri: null }),
      update: (a) => {
        (typeof a.uri < "u" &&
          a.uri !== n &&
          (delete this._registeredResources[n], a.uri && (this._registeredResources[a.uri] = s)),
          typeof a.name < "u" && (s.name = a.name),
          typeof a.title < "u" && (s.title = a.title),
          typeof a.metadata < "u" && (s.metadata = a.metadata),
          typeof a.callback < "u" && (s.readCallback = a.callback),
          typeof a.enabled < "u" && (s.enabled = a.enabled),
          this.sendResourceListChanged());
      },
    };
    return ((this._registeredResources[n] = s), s);
  }
  _createRegisteredResourceTemplate(e, r, n, o, i) {
    let s = {
      resourceTemplate: n,
      title: r,
      metadata: o,
      readCallback: i,
      enabled: !0,
      disable: () => s.update({ enabled: !1 }),
      enable: () => s.update({ enabled: !0 }),
      remove: () => s.update({ name: null }),
      update: (c) => {
        (typeof c.name < "u" &&
          c.name !== e &&
          (delete this._registeredResourceTemplates[e],
          c.name && (this._registeredResourceTemplates[c.name] = s)),
          typeof c.title < "u" && (s.title = c.title),
          typeof c.template < "u" && (s.resourceTemplate = c.template),
          typeof c.metadata < "u" && (s.metadata = c.metadata),
          typeof c.callback < "u" && (s.readCallback = c.callback),
          typeof c.enabled < "u" && (s.enabled = c.enabled),
          this.sendResourceListChanged());
      },
    };
    this._registeredResourceTemplates[e] = s;
    let a = n.uriTemplate.variableNames;
    return (
      Array.isArray(a) &&
        a.some((c) => !!n.completeCallback(c)) &&
        this.setCompletionRequestHandler(),
      s
    );
  }
  _createRegisteredPrompt(e, r, n, o, i) {
    let s = {
      title: r,
      description: n,
      argsSchema: o === void 0 ? void 0 : Pf(o),
      callback: i,
      enabled: !0,
      disable: () => s.update({ enabled: !1 }),
      enable: () => s.update({ enabled: !0 }),
      remove: () => s.update({ name: null }),
      update: (a) => {
        (typeof a.name < "u" &&
          a.name !== e &&
          (delete this._registeredPrompts[e], a.name && (this._registeredPrompts[a.name] = s)),
          typeof a.title < "u" && (s.title = a.title),
          typeof a.description < "u" && (s.description = a.description),
          typeof a.argsSchema < "u" && (s.argsSchema = Pf(a.argsSchema)),
          typeof a.callback < "u" && (s.callback = a.callback),
          typeof a.enabled < "u" && (s.enabled = a.enabled),
          this.sendPromptListChanged());
      },
    };
    return (
      (this._registeredPrompts[e] = s),
      o &&
        Object.values(o).some((l) => {
          let c = l instanceof gp ? l._def?.innerType : l;
          return hJ(c);
        }) &&
        this.setCompletionRequestHandler(),
      s
    );
  }
  _createRegisteredTool(e, r, n, o, i, s, a, l, c) {
    gJ(e);
    let u = {
      title: r,
      description: n,
      inputSchema: EKe(o),
      outputSchema: EKe(i),
      annotations: s,
      execution: a,
      _meta: l,
      handler: c,
      enabled: !0,
      disable: () => u.update({ enabled: !1 }),
      enable: () => u.update({ enabled: !0 }),
      remove: () => u.update({ name: null }),
      update: (p) => {
        (typeof p.name < "u" &&
          p.name !== e &&
          (typeof p.name == "string" && gJ(p.name),
          delete this._registeredTools[e],
          p.name && (this._registeredTools[p.name] = u)),
          typeof p.title < "u" && (u.title = p.title),
          typeof p.description < "u" && (u.description = p.description),
          typeof p.paramsSchema < "u" && (u.inputSchema = Pf(p.paramsSchema)),
          typeof p.outputSchema < "u" && (u.outputSchema = Pf(p.outputSchema)),
          typeof p.callback < "u" && (u.handler = p.callback),
          typeof p.annotations < "u" && (u.annotations = p.annotations),
          typeof p._meta < "u" && (u._meta = p._meta),
          typeof p.enabled < "u" && (u.enabled = p.enabled),
          this.sendToolListChanged());
      },
    };
    return (
      (this._registeredTools[e] = u),
      this.setToolRequestHandlers(),
      this.sendToolListChanged(),
      u
    );
  }
  tool(e, ...r) {
    if (this._registeredTools[e]) throw new Error(`Tool ${e} is already registered`);
    let n, o, i, s;
    if ((typeof r[0] == "string" && (n = r.shift()), r.length > 1)) {
      let l = r[0];
      if (yJ(l))
        ((o = r.shift()),
          r.length > 1 && typeof r[0] == "object" && r[0] !== null && !yJ(r[0]) && (s = r.shift()));
      else if (typeof l == "object" && l !== null) {
        if (Object.values(l).some((c) => typeof c == "object" && c !== null))
          throw new Error(
            `Tool ${e} expected a Zod schema or ToolAnnotations, but received an unrecognized object`,
          );
        s = r.shift();
      }
    }
    let a = r[0];
    return this._createRegisteredTool(
      e,
      void 0,
      n,
      o,
      i,
      s,
      { taskSupport: "forbidden" },
      void 0,
      a,
    );
  }
  registerTool(e, r, n) {
    if (this._registeredTools[e]) throw new Error(`Tool ${e} is already registered`);
    let { title: o, description: i, inputSchema: s, outputSchema: a, annotations: l, _meta: c } = r;
    return this._createRegisteredTool(e, o, i, s, a, l, { taskSupport: "forbidden" }, c, n);
  }
  prompt(e, ...r) {
    if (this._registeredPrompts[e]) throw new Error(`Prompt ${e} is already registered`);
    let n;
    typeof r[0] == "string" && (n = r.shift());
    let o;
    r.length > 1 && (o = r.shift());
    let i = r[0],
      s = this._createRegisteredPrompt(e, void 0, n, o, i);
    return (this.setPromptRequestHandlers(), this.sendPromptListChanged(), s);
  }
  registerPrompt(e, r, n) {
    if (this._registeredPrompts[e]) throw new Error(`Prompt ${e} is already registered`);
    let { title: o, description: i, argsSchema: s } = r,
      a = this._createRegisteredPrompt(e, o, i, s, n);
    return (this.setPromptRequestHandlers(), this.sendPromptListChanged(), a);
  }
  isConnected() {
    return this.server.transport !== void 0;
  }
  async sendLoggingMessage(e, r) {
    return this.server.sendLoggingMessage(e, r);
  }
  sendResourceListChanged() {
    this.isConnected() && this.server.sendResourceListChanged();
  }
  sendToolListChanged() {
    this.isConnected() && this.server.sendToolListChanged();
  }
  sendPromptListChanged() {
    this.isConnected() && this.server.sendPromptListChanged();
  }
};
var G9t = { type: "object", properties: {} };
function TKe(t) {
  return (
    t !== null &&
    typeof t == "object" &&
    "parse" in t &&
    typeof t.parse == "function" &&
    "safeParse" in t &&
    typeof t.safeParse == "function"
  );
}
function PKe(t) {
  return "_def" in t || "_zod" in t || TKe(t);
}
function yJ(t) {
  return typeof t != "object" || t === null || PKe(t)
    ? !1
    : Object.keys(t).length === 0
      ? !0
      : Object.values(t).some(TKe);
}
function EKe(t) {
  if (t) {
    if (yJ(t)) return Pf(t);
    if (!PKe(t))
      throw new Error(
        "inputSchema must be a Zod schema or raw shape, received an unrecognized object",
      );
    return t;
  }
}
function W9t(t) {
  let e = Md(t);
  return e
    ? Object.entries(e).map(([r, n]) => {
        let o = V4e(n),
          i = K4e(n);
        return { name: r, description: o, required: !i };
      })
    : [];
}
function Wd(t) {
  let r = Md(t)?.method;
  if (!r) throw new Error("Schema is missing a method literal");
  let n = J2(r);
  if (typeof n == "string") return n;
  throw new Error("Schema method literal must be a string");
}
function CKe(t) {
  return { completion: { values: t.slice(0, 100), total: t.length, hasMore: t.length > 100 } };
}
var cE = { completion: { values: [], hasMore: !1 } };
Pt();
bm();
xo();
var Hd = F(require("path")),
  an = F(require("vscode"));
$();
var H9t = ["error", "warning", "information", "hint"],
  j9t = {
    error: an.DiagnosticSeverity.Error,
    warning: an.DiagnosticSeverity.Warning,
    information: an.DiagnosticSeverity.Information,
    hint: an.DiagnosticSeverity.Hint,
  },
  IKe = d.object({
    maxDiagnostics: d.number().int().positive().max(1e3).default(50),
    file: d.string().optional(),
    source: d.union([d.string(), d.array(d.string())]).optional(),
    code: d.union([d.string(), d.array(d.string())]).optional(),
    includeNonWorkspaceDiagnostics: d.boolean().default(!1),
    minSeverity: d.enum(H9t).default("information"),
  }),
  kKe = d.object({
    diagnostics: d.array(
      d.object({
        filePath: d.string(),
        relativePath: d.string().nullable(),
        range: d.object({
          start: d.object({
            line: d.number().int().nonnegative(),
            character: d.number().int().nonnegative(),
          }),
          end: d.object({
            line: d.number().int().nonnegative(),
            character: d.number().int().nonnegative(),
          }),
        }),
        severity: d.string(),
        source: d.string().nullable(),
        code: d.string().nullable(),
        message: d.string(),
      }),
    ),
    returnedDiagnostics: d.number().int().nonnegative(),
    totalDiagnosticsAfterFiltering: d.number().int().nonnegative(),
    limit: d.number().int().positive(),
    truncated: d.boolean(),
    summary: d.array(d.string()),
  });
function DKe(t) {
  t.registerTool(
    "vscodeDiagnostics",
    {
      title: "VS Code Diagnostics",
      description:
        "Retrieve diagnostics from vscode.languages.getDiagnostics() with optional filters.",
      inputSchema: IKe.shape,
      outputSchema: kKe.shape,
    },
    async (e) => {
      let {
          maxDiagnostics: r,
          file: n,
          source: o,
          code: i,
          minSeverity: s,
          includeNonWorkspaceDiagnostics: a,
        } = IKe.parse(e),
        l = o ? new Set(Array.isArray(o) ? o : [o]) : void 0,
        c = i ? new Set(Array.isArray(i) ? i : [i]) : void 0,
        u = n ? K9t(n) : void 0,
        p = z9t(u),
        m = V9t(p, n, j9t[s], a, l, c),
        f = m.slice(0, r),
        h = kKe.parse(Q9t(f, r, m.length));
      return {
        content: [
          {
            type: "text",
            text: h.summary.join(`
`),
          },
        ],
        structuredContent: h,
      };
    },
  );
}
function z9t(t) {
  if (t) return an.languages.getDiagnostics(t).map((r) => ({ uri: t, diagnostic: r }));
  let e = [];
  for (let [r, n] of an.languages.getDiagnostics())
    for (let o of n) e.push({ uri: r, diagnostic: o });
  return e;
}
function V9t(t, e, r, n, o, i) {
  let s = [];
  for (let a of t)
    (e && !X9t(a.uri, e)) ||
      (a.diagnostic.severity ?? an.DiagnosticSeverity.Error) > r ||
      (!n && !e && !Z9t(a.uri)) ||
      (o && !Y9t(a.diagnostic, o)) ||
      (i && !J9t(a.diagnostic, i)) ||
      s.push(a);
  return s;
}
function K9t(t) {
  let e = MKe(t);
  if (e) return e;
  let r = an.workspace.workspaceFolders;
  if (!r || r.length === 0) return;
  let n = uE(t);
  for (let o of r) {
    let i = Hd.join(o.uri.fsPath, t);
    if (uE(i).endsWith(n)) return an.Uri.file(i);
  }
}
function Z9t(t) {
  return an.workspace.getWorkspaceFolder(t) !== void 0;
}
function X9t(t, e) {
  let r = MKe(e);
  if (r) return vJ(t) === vJ(r);
  let n = uE(e),
    o = OKe(t);
  return o && uE(o) === n ? !0 : vJ(t).endsWith(n);
}
function MKe(t) {
  if (t.startsWith("file:"))
    try {
      let e = an.Uri.parse(t);
      if (e.scheme === "file") return e;
    } catch {
      return;
    }
  if (Hd.isAbsolute(t)) return an.Uri.file(t);
}
function vJ(t) {
  return uE(t.fsPath);
}
function uE(t) {
  let e = Hd.normalize(t).replace(/\\/g, "/");
  return typeof process < "u" && process.platform === "win32" ? e.toLowerCase() : e;
}
function Y9t(t, e) {
  let r = t.source;
  return r ? e.has(r) : !1;
}
function J9t(t, e) {
  let r = t.code;
  if (r === void 0) return !1;
  let n = typeof r == "object" && "value" in r ? String(r.value) : String(r);
  return e.has(n);
}
function Q9t(t, e, r) {
  let n = [],
    o = [],
    i = 1;
  for (let { uri: l, diagnostic: c } of t) {
    let u = OKe(l),
      p = c.range,
      m = p.start.line + 1,
      f = p.start.character + 1,
      h = eZt(c.severity),
      v = c.source ?? null,
      y = tZt(c.code),
      w = [`${i}. ${u ?? l.fsPath}:${m}:${f}`, `[${h}]`];
    (v ? w.push(`(${v}${y ? `:${y}` : ""})`) : y && w.push(`(${y})`),
      n.push(`${w.join(" ")}
${c.message}`),
      o.push({
        filePath: l.fsPath,
        relativePath: u ?? null,
        range: {
          start: { line: p.start.line, character: p.start.character },
          end: { line: p.end.line, character: p.end.character },
        },
        severity: h,
        source: v,
        code: y,
        message: c.message,
      }),
      (i = i + 1));
  }
  let s = r > t.length,
    a =
      n.length > 0
        ? [
            `Returned ${t.length} diagnostics (limit ${e}, total after filtering ${r}, truncated: ${s ? "yes" : "no"}).`,
            "",
            ...n,
          ]
        : [`Returned 0 diagnostics (limit ${e}, total after filtering ${r}, truncated: no).`];
  return {
    diagnostics: o,
    returnedDiagnostics: t.length,
    totalDiagnosticsAfterFiltering: r,
    limit: e,
    truncated: s,
    summary: a,
  };
}
function OKe(t) {
  let e = an.workspace.getWorkspaceFolder(t);
  if (e) return Hd.relative(e.uri.fsPath, t.fsPath);
}
function eZt(t) {
  switch (t) {
    case an.DiagnosticSeverity.Error:
      return "error";
    case an.DiagnosticSeverity.Warning:
      return "warning";
    case an.DiagnosticSeverity.Information:
      return "information";
    case an.DiagnosticSeverity.Hint:
      return "hint";
  }
}
function tZt(t) {
  return t === void 0 ? null : typeof t == "object" && "value" in t ? String(t.value) : String(t);
}
var jd = F(require("path")),
  ha = F(require("vscode"));
$();
var NKe = d.object({
    file: d.string(),
    position: d.object({
      line: d.number().int().nonnegative(),
      character: d.number().int().nonnegative(),
    }),
    includeDeclaration: d.boolean().default(!0),
  }),
  LKe = d.object({
    references: d.array(
      d.object({
        filePath: d.string(),
        relativePath: d.string().nullable(),
        range: d.object({
          start: d.object({
            line: d.number().int().nonnegative(),
            character: d.number().int().nonnegative(),
          }),
          end: d.object({
            line: d.number().int().nonnegative(),
            character: d.number().int().nonnegative(),
          }),
        }),
      }),
    ),
    returnedReferences: d.number().int().nonnegative(),
    summary: d.array(d.string()),
  });
function FKe(t) {
  t.registerTool(
    "vscodeReferences",
    {
      title: "VS Code References",
      description: "Retrieve references for a symbol using VS Code language features.",
      inputSchema: NKe.shape,
      outputSchema: LKe.shape,
    },
    async (e) => {
      let { file: r, position: n, includeDeclaration: o } = NKe.parse(e),
        i = oZt(r);
      if (!i) throw new Error(`Unable to locate file ${r} in the current workspace.`);
      let s = new ha.Position(n.line, n.character),
        a =
          (await ha.commands.executeCommand("vscode.executeReferenceProvider", i, s, {
            includeDeclaration: o,
          })) ?? [],
        l = o ? a : a.filter((u) => !nZt(u, i, s)),
        c = LKe.parse(rZt(l));
      return {
        content: [
          {
            type: "text",
            text: c.summary.join(`
`),
          },
        ],
        structuredContent: c,
      };
    },
  );
}
function rZt(t) {
  let e = [],
    r = [],
    n = 1;
  for (let i of t) {
    let s = sZt(i.uri),
      a = i.range.start.line + 1,
      l = i.range.start.character + 1;
    (e.push(`${n}. ${s ?? i.uri.fsPath}:${a}:${l}`),
      r.push({
        filePath: i.uri.fsPath,
        relativePath: s ?? null,
        range: {
          start: { line: i.range.start.line, character: i.range.start.character },
          end: { line: i.range.end.line, character: i.range.end.character },
        },
      }),
      (n = n + 1));
  }
  let o =
    e.length > 0 ? [`Returned ${t.length} references.`, "", ...e] : ["Returned 0 references."];
  return { references: r, returnedReferences: t.length, summary: o };
}
function nZt(t, e, r) {
  return (
    t.uri.fsPath === e.fsPath &&
    t.range.start.line === r.line &&
    t.range.start.character === r.character
  );
}
function oZt(t) {
  let e = iZt(t);
  if (e) return e;
  let r = ha.workspace.workspaceFolders;
  if (!r || r.length === 0) return;
  let n = BKe(t);
  for (let o of r) {
    let i = jd.join(o.uri.fsPath, t);
    if (BKe(i).endsWith(n)) return ha.Uri.file(i);
  }
}
function iZt(t) {
  if (t.startsWith("file:"))
    try {
      let e = ha.Uri.parse(t);
      if (e.scheme === "file") return e;
    } catch {
      return;
    }
  if (jd.isAbsolute(t)) return ha.Uri.file(t);
}
function sZt(t) {
  let e = ha.workspace.getWorkspaceFolder(t);
  if (e) return jd.relative(e.uri.fsPath, t.fsPath);
}
function BKe(t) {
  let e = jd.normalize(t).replace(/\\/g, "/");
  return typeof process < "u" && process.platform === "win32" ? e.toLowerCase() : e;
}
var qKe = F(require("path")),
  rr = F(require("vscode"));
$();
var $Ke = d.object({
    query: d.string().min(1),
    maxSymbols: d.number().int().positive().max(500).default(100),
  }),
  UKe = d.object({
    symbols: d.array(
      d.object({
        name: d.string(),
        kind: d.string(),
        containerName: d.string().nullable(),
        location: d.object({
          filePath: d.string(),
          relativePath: d.string().nullable(),
          range: d.object({
            start: d.object({
              line: d.number().int().nonnegative(),
              character: d.number().int().nonnegative(),
            }),
            end: d.object({
              line: d.number().int().nonnegative(),
              character: d.number().int().nonnegative(),
            }),
          }),
        }),
      }),
    ),
    returnedSymbols: d.number().int().nonnegative(),
    totalSymbols: d.number().int().nonnegative(),
    limit: d.number().int().positive(),
    truncated: d.boolean(),
    summary: d.array(d.string()),
  });
function GKe(t) {
  t.registerTool(
    "vscodeWorkspaceSymbols",
    {
      title: "VS Code Workspace Symbols",
      description: "Search workspace symbols via VS Code's workspace symbol provider.",
      inputSchema: $Ke.shape,
      outputSchema: UKe.shape,
    },
    async (e) => {
      let { query: r, maxSymbols: n } = $Ke.parse(e),
        o = (await rr.commands.executeCommand("vscode.executeWorkspaceSymbolProvider", r)) ?? [],
        i = o.slice(0, n),
        s = UKe.parse(aZt(i, o.length, n));
      return {
        content: [
          {
            type: "text",
            text: s.summary.join(`
`),
          },
        ],
        structuredContent: s,
      };
    },
  );
}
function aZt(t, e, r) {
  let n = [],
    o = [],
    i = 1;
  for (let l of t) {
    let c = cZt(l.location.uri),
      u = l.location.range.start.line + 1,
      p = l.location.range.start.character + 1,
      m = lZt(l.kind),
      f = l.containerName ?? "",
      h = f ? `${f}.${l.name}` : l.name;
    (n.push(`${i}. ${h} (${m}) \u2014 ${c ?? l.location.uri.fsPath}:${u}:${p}`),
      o.push({
        name: l.name,
        kind: m,
        containerName: l.containerName ?? null,
        location: {
          filePath: l.location.uri.fsPath,
          relativePath: c ?? null,
          range: {
            start: {
              line: l.location.range.start.line,
              character: l.location.range.start.character,
            },
            end: { line: l.location.range.end.line, character: l.location.range.end.character },
          },
        },
      }),
      (i = i + 1));
  }
  let s = e > t.length,
    a =
      n.length > 0
        ? [
            `Returned ${t.length} symbols (limit ${r}, total ${e}, truncated: ${s ? "yes" : "no"}).`,
            "",
            ...n,
          ]
        : [`Returned 0 symbols (limit ${r}, total ${e}, truncated: no).`];
  return {
    symbols: o,
    returnedSymbols: t.length,
    totalSymbols: e,
    limit: r,
    truncated: s,
    summary: a,
  };
}
function lZt(t) {
  switch (t) {
    case rr.SymbolKind.File:
      return "file";
    case rr.SymbolKind.Module:
      return "module";
    case rr.SymbolKind.Namespace:
      return "namespace";
    case rr.SymbolKind.Package:
      return "package";
    case rr.SymbolKind.Class:
      return "class";
    case rr.SymbolKind.Method:
      return "method";
    case rr.SymbolKind.Property:
      return "property";
    case rr.SymbolKind.Field:
      return "field";
    case rr.SymbolKind.Constructor:
      return "constructor";
    case rr.SymbolKind.Enum:
      return "enum";
    case rr.SymbolKind.Interface:
      return "interface";
    case rr.SymbolKind.Function:
      return "function";
    case rr.SymbolKind.Variable:
      return "variable";
    case rr.SymbolKind.Constant:
      return "constant";
    case rr.SymbolKind.String:
      return "string";
    case rr.SymbolKind.Number:
      return "number";
    case rr.SymbolKind.Boolean:
      return "boolean";
    case rr.SymbolKind.Array:
      return "array";
    case rr.SymbolKind.Object:
      return "object";
    case rr.SymbolKind.Key:
      return "key";
    case rr.SymbolKind.Null:
      return "null";
    case rr.SymbolKind.EnumMember:
      return "enumMember";
    case rr.SymbolKind.Struct:
      return "struct";
    case rr.SymbolKind.Event:
      return "event";
    case rr.SymbolKind.Operator:
      return "operator";
    case rr.SymbolKind.TypeParameter:
      return "typeParameter";
  }
}
function cZt(t) {
  let e = rr.workspace.getWorkspaceFolder(t);
  if (e) return qKe.relative(e.uri.fsPath, t.fsPath);
}
var zKe = require("node:events"),
  bJ = require("node:fs"),
  VKe = F(require("node:net"));
Pt();
var WKe = require("node:crypto"),
  HKe = require("node:events"),
  jKe = F(require("node:readline"));
Wp();
Pt();
xo();
var WB = class {
  socket;
  rl;
  started = !1;
  protocolVersion;
  sessionId;
  onerror;
  onmessage;
  disposables = [];
  constructor(e) {
    ((this.socket = e),
      (this.sessionId = (0, WKe.randomUUID)()),
      (this.rl = jKe.default.createInterface({ input: this.socket, crlfDelay: 1 / 0 })),
      (this.onerror = this.handleError.bind(this)));
  }
  async start() {
    if (this.started) throw new Error("UnixDomainSocketTransport already started.");
    ((this.started = !0),
      this.socket.setEncoding("utf8"),
      this.socket.on("error", this.handleSocketError),
      this.socket.on("close", this.handleSocketClose),
      this.rl.on("line", this.handleLine),
      this.rl.on("close", this.handleReadlineClose));
  }
  async send(e, r) {
    if (!this.started) throw new Error("Transport not started.");
    let n =
      JSON.stringify(e) +
      `
`;
    this.socket.write(n) || (await (0, HKe.once)(this.socket, "drain"));
  }
  addDisposable(e) {
    this.disposables.push(e);
  }
  close() {
    (he().info("UnixDomainSocketTransport.close() called."),
      this.disposables.forEach((r) => r.dispose()));
    let e = this.started;
    return (
      (this.started = !1),
      this.detachListeners(),
      e && this.socket.end(),
      this.socket.destroy(),
      this.rl.close(),
      Promise.resolve()
    );
  }
  setProtocolVersion(e) {
    this.protocolVersion = e;
  }
  handleError(e) {
    he().error("UnixDomainSocketTransport error", {
      safe: { stack: e.stack ?? e.message },
      sensitive: {},
    });
  }
  handleSocketError = (e) => {
    let r = e instanceof Error ? e : new Error(String(e));
    this.onerror(r);
  };
  handleSocketClose = () => {
    (this.detachListeners(), this.rl.close());
  };
  handleLine = (e) => {
    if (e.trim())
      try {
        let r = ahe.parse(JSON.parse(e));
        this.onmessage?.(r);
      } catch (r) {
        this.onerror(r instanceof Error ? r : new Error(String(r)));
      }
  };
  handleReadlineClose = () => {
    this.rl.removeAllListeners();
  };
  detachListeners() {
    (this.socket.removeListener("error", this.handleSocketError),
      this.socket.removeListener("close", this.handleSocketClose),
      this.rl.removeListener("line", this.handleLine),
      this.rl.removeListener("close", this.handleReadlineClose));
  }
};
