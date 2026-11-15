const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const crypto = require("node:crypto");
const { spawn } = require("node:child_process");
const { EventEmitter } = require("node:events");
const encode = (_k, v) =>
  v instanceof Uint8Array ? { __jimaoBytes: Array.from(v) } : v;
const revive = (_k, v) =>
  v && v.__jimaoBytes ? new Uint8Array(v.__jimaoBytes) : v;
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
function register(vscode, context, controller) {
  const id = crypto.randomUUID(),
    views = new Map();
  let running = false,
    endpoint,
    secret,
    polling,
    generation = 0,
    disposed = false,
    transition = Promise.resolve();
  const storage = path.join(
      process.env.CODEX_HOME || path.join(os.homedir(), ".codex"),
      "jimao-lan",
    ),
    statePath = path.join(storage, "gateway.json");
  const originalBroadcast = controller.broadcastToAllViews.bind(controller);
  controller.broadcastToAllViews = (message, except) => {
    originalBroadcast(message, except);
    for (const view of views.values())
      if (view !== except) controller.postMessageToWebview(view, message);
  };
  async function request(route, data, timeout = 20000) {
    const r = await fetch(endpoint + route, {
      method: data === undefined ? "GET" : "POST",
      headers: {
        "authorization": `Bearer ${secret}`,
        "content-type": "application/json",
      },
      body: data === undefined ? undefined : JSON.stringify(data, encode),
      signal: AbortSignal.timeout(timeout),
    });
    if (!r.ok) throw Error(`Jimao service ${r.status}: ${await r.text()}`);
    return r.json();
  }
  async function gateway(port) {
    await fs.mkdir(storage, { recursive: true, mode: 0o700 });
    try {
      const d = JSON.parse(await fs.readFile(statePath, "utf8"));
      endpoint = `http://127.0.0.1:${d.port}`;
      secret = d.secret;
      const h = await fetch(endpoint + "/health", {
        signal: AbortSignal.timeout(1000),
      }).then((r) => r.json());
      if (h.service === "jimao-lan" && h.version === 3) {
        if (d.port !== port)
          throw Error(`共享入口已使用端口 ${d.port}，请使用相同端口`);
        return;
      }
    } catch (e) {
      if (e.message.startsWith("共享入口")) throw e;
    }
    // A running old gateway must be stopped explicitly before upgrading.
    try {
      const h = await fetch(endpoint + "/health", {
        signal: AbortSignal.timeout(500),
      }).then((r) => r.json());
      if (h.service === "jimao-lan" && h.version !== 3)
        throw Error(
          "请先关闭所有旧窗口的局域网访问，等待 30 秒后重新开启，以升级共享入口",
        );
    } catch (error) {
      if (error.message.startsWith("请先关闭")) throw error;
    }
    // Copy the gateway out of the versioned extension install directory.
    const runtime = path.join(storage, "runtime-v3");
    await fs.mkdir(runtime, { recursive: true });
    for (const file of ["server.cjs", "shell.html", "links.cjs"])
      await fs.copyFile(path.join(__dirname, file), path.join(runtime, file));
    secret = crypto.randomBytes(32).toString("hex");
    endpoint = `http://127.0.0.1:${port}`;
    const log = await fs.open(path.join(storage, "gateway.log"), "a");
    const child = spawn(
      process.execPath,
      [path.join(runtime, "server.cjs"), String(port), statePath],
      {
        detached: true,
        stdio: ["ignore", log.fd, log.fd],
        env: {
          ...process.env,
          ELECTRON_RUN_AS_NODE: "1",
          JIMAO_LAN_SECRET: secret,
        },
      },
    );
    child.unref();
    await log.close();
    for (let i = 0; i < 40; i++) {
      await pause(100);
      try {
        const d = JSON.parse(await fs.readFile(statePath, "utf8"));
        const h = await fetch(`http://127.0.0.1:${d.port}/health`, {
          signal: AbortSignal.timeout(500),
        }).then((r) => r.json());
        if (h.service === "jimao-lan") {
          secret = d.secret;
          endpoint = `http://127.0.0.1:${d.port}`;
          return;
        }
      } catch {}
    }
    throw Error(
      `无法启动局域网入口，端口 ${port} 可能已被占用。详情见 ${path.join(storage, "gateway.log")}`,
    );
  }
  async function deliver(clientId, message) {
    return request("/internal/deliver", { windowId: id, clientId, message });
  }
  async function readThread(threadId) {
    const connection = controller.codexMcpConnection;
    const providerName = "jimao-lan-" + crypto.randomUUID();
    return new Promise((resolve, reject) => {
      let provider,
        finished = false;
      const timer = setTimeout(() => finish(Error("读取会话超时")), 10000);
      function finish(error, result) {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        provider?.dispose();
        if (error) reject(error);
        else if (result?.thread?.id !== threadId)
          reject(Error("无法读取目标会话"));
        else resolve(result);
      }
      try {
        provider = connection.registerProvider(providerName, {
          onResult: (response) =>
            finish(
              response.error ? Error(response.error.message) : null,
              response.result,
            ),
          onFatalError: () => finish(Error("会话引擎不可用")),
        });
        if (finished) {
          provider.dispose();
          return;
        }
        connection.sendRequest(providerName, "read", "thread/read", {
          threadId,
          includeTurns: false,
        });
      } catch (error) {
        finish(error);
      }
    });
  }
  async function createView(clientId, initialRoute) {
    const received = new EventEmitter(),
      disposed = new EventEmitter(),
      picks = new Map();
    let closed = false,
      output = Promise.resolve();
    const event = (emitter) => (fn) => {
      emitter.on("event", fn);
      return { dispose: () => emitter.removeListener("event", fn) };
    };
    const view = {
      cspSource: endpoint,
      options: {},
      onDidReceiveMessage: event(received),
      asWebviewUri: () => vscode.Uri.parse(`${endpoint}/resources/${id}`),
      postMessage(message) {
        if (closed) return Promise.resolve(false);
        output = output.then(() => deliver(clientId, message));
        return output.then(() => true).catch(() => false);
      },
      async pickFiles() {
        const requestId = crypto.randomUUID();
        return new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            picks.delete(requestId);
            resolve([]);
          }, 120000);
          picks.set(requestId, {
            resolve: (files) => {
              clearTimeout(timer);
              resolve(files);
            },
            reject,
          });
          view.postMessage({ type: "jimao-pick-images", requestId });
        });
      },
      async receive(message) {
        // Desktop commands target the sidebar; reply to the browser that clicked.
        if (
          message.type === "open-vscode-command" &&
          message.command === "chatgpt.newChat"
        ) {
          await view.postMessage({ type: "new-chat" });
          return;
        }
        const routes = {
          "show-settings": "/settings/" + (message.section || "general"),
          "show-diff": "/diff",
          "show-plan-summary": "/plan-summary",
          "navigate-in-new-editor-tab": message.path,
        };
        if (Object.hasOwn(routes, message.type)) {
          await view.postMessage({
            type: "navigate-to-route",
            path: routes[message.type],
            state: message,
          });
          return;
        }
        if (message.type === "jimao-picked-images") {
          const task = picks.get(message.requestId);
          if (!task) return;
          picks.delete(message.requestId);
          try {
            const dir = path.join(storage, "uploads", id);
            await fs.mkdir(dir, { recursive: true });
            const files = [];
            for (const file of message.files || []) {
              const match =
                /^data:image\/(png|jpeg|webp|gif);base64,([A-Za-z0-9+/=]+)$/.exec(
                  file.data,
                );
              if (!match) throw Error("仅支持 PNG、JPEG、WebP 和 GIF 图片");
              const bytes = Buffer.from(match[2], "base64");
              if (bytes.length > 10 * 1024 * 1024)
                throw Error("图片不能超过 10 MB");
              const filePath = path.join(
                dir,
                crypto.randomUUID() + "." + match[1],
              );
              await fs.writeFile(filePath, bytes);
              files.push({
                path: filePath,
                fsPath: filePath,
                label: path.basename(file.name),
              });
            }
            task.resolve(files);
          } catch (error) {
            task.resolve([]);
            vscode.window.showErrorMessage(error.message);
          }
          return;
        }
        received.emit("event", message);
      },
      dispose() {
        if (closed) return;
        closed = true;
        disposed.emit("event");
        controller.clearPendingRequestsForWebview(view);
        controller.disposeClientCoordinationForWebview(view);
        controller.workerBusMessageHandler.unregisterWebview(view);
        for (const p of picks.values()) p.resolve([]);
        received.removeAllListeners();
        disposed.removeAllListeners();
        views.delete(clientId);
      },
    };
    views.set(clientId, view);
    await controller.initializeWebview(view, "lan", event(disposed));
    const bridge = (
      await fs.readFile(path.join(__dirname, "bridge.js"), "utf8")
    )
      .replace("__CLIENT_ID__", JSON.stringify(clientId))
      .replace("__WINDOW_ID__", JSON.stringify(id))
      .replace("__INITIAL_ROUTE__", JSON.stringify(initialRoute || null));
    // Browser-facing URLs must be relative: localhost refers to the phone itself.
    let html = view.html.replaceAll(endpoint, "");
    html = html.replace(/<meta\b[^>]*name=["']viewport["'][^>]*>/gi, "");
    html = html.replace(
      "<head>",
      '<head><meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">',
    );
    html = html.replace("<head>", "<head><script>" + bridge + "</script>");
    // Existing CSP is restricted to VS Code resource schemes; use same-origin HTTP resources.
    html = html.replace(
      /<meta http-equiv="Content-Security-Policy"[^>]*>/g,
      "",
    );
    await request("/internal/deliver", { windowId: id, clientId, html });
  }
  async function poll(epoch) {
    while (running && epoch === generation) {
      try {
        const events = await request("/internal/poll?window=" + id);
        for (const e of events) {
          if (!running || epoch !== generation) break;
          if (e.type === "resolve-thread") {
            let error;
            try {
              await readThread(e.threadId);
            } catch (failure) {
              error = failure.message;
            }
            await request("/internal/resolved", {
              windowId: id,
              requestId: e.requestId,
              threadId: e.threadId,
              ok: !error,
              error,
            });
          } else if (e.type === "connect")
            await createView(e.clientId, e.initialRoute);
          else if (e.type === "disconnect") views.get(e.clientId)?.dispose();
          else if (e.type === "message")
            await views
              .get(e.clientId)
              ?.receive(JSON.parse(JSON.stringify(e.message), revive));
        }
      } catch (error) {
        if (!running || epoch !== generation) break;
        console.error("[Jimao LAN]", error);
        await pause(1000);
        try {
          await serial(async () => {
            await synchronize();
            if (running && epoch === generation) await enroll();
          });
        } catch {}
      }
    }
  }
  async function enroll() {
    await request("/internal/register", {
      id,
      pid: process.pid,
      focused: vscode.window.state?.focused === true,
      lastFocused,
      name: vscode.workspace.name || "未命名窗口",
      folders: (vscode.workspace.workspaceFolders || []).map(
        (f) => f.uri.fsPath,
      ),
      root: path.join(context.extensionUri.fsPath, "webview"),
    });
  }
  function addresses() {
    const port = new URL(endpoint).port;
    return [
      `http://localhost:${port}`,
      ...Object.values(os.networkInterfaces())
        .flat()
        .filter((n) => n.family === "IPv4" && !n.internal)
        .map((n) => `http://${n.address}:${port}`),
    ];
  }
  // Serialize commands and discovery so disable cannot race a late enrollment.
  function serial(action) {
    const next = transition.then(action);
    transition = next.catch(() => {});
    return next;
  }
  async function detach() {
    running = false;
    generation++;
    for (const view of [...views.values()]) view.dispose();
    if (endpoint)
      await request("/internal/remove", { windowId: id }).catch(() => {});
  }
  async function synchronize() {
    if (disposed) return;
    try {
      const descriptor = JSON.parse(await fs.readFile(statePath, "utf8"));
      const target = `http://127.0.0.1:${descriptor.port}`;
      const health = await fetch(target + "/health", {
        signal: AbortSignal.timeout(1000),
      }).then((r) => r.json());
      if (
        health.service !== "jimao-lan" ||
        health.version !== 3 ||
        !health.enabled
      ) {
        if (running) await detach();
        return;
      }
      if (running && endpoint === target && secret === descriptor.secret)
        return;
      if (running) await detach();
      endpoint = target;
      secret = descriptor.secret;
      await enroll();
      running = true;
      polling = poll(++generation);
    } catch {
      if (running) await detach();
    }
  }
  async function start() {
    return serial(async () => {
      if (disposed) return [];
      if (running) return addresses();
      const port = vscode.workspace
        .getConfiguration("chatgpt")
        .get("lanPort", 8765);
      await gateway(port);
      await request("/internal/access", { enabled: true });
      await enroll();
      running = true;
      polling = poll(++generation);
      return addresses();
    });
  }
  async function stop() {
    return serial(async () => {
      // Discovery also lets a window which has not joined yet disable globally.
      try {
        const d = JSON.parse(await fs.readFile(statePath, "utf8"));
        endpoint = `http://127.0.0.1:${d.port}`;
        secret = d.secret;
        await request("/internal/access", { enabled: false });
      } catch {}
      await detach();
    });
  }
  let lastFocused = vscode.window.state?.focused ? Date.now() : 0;
  const focusListener = vscode.window.onDidChangeWindowState?.((state) => {
    if (state.focused) lastFocused = Date.now();
    if (running)
      request("/internal/focus", {
        windowId: id,
        focused: state.focused,
      }).catch(() => {});
  });
  const discovery = setInterval(() => serial(synchronize), 2000);
  discovery.unref();
  serial(synchronize);
  const commands = [
    vscode.commands.registerCommand("chatgpt.startLanAccess", async () => {
      try {
        const urls = await start();
        await vscode.env.clipboard.writeText(
          urls.find((u) => !u.includes("localhost")) || urls[0],
        );
        vscode.window.showInformationMessage(
          `Jimao 局域网访问已全局开启，已激活窗口将自动加入，地址已复制：${urls.join("  ")}`,
        );
        return { windowId: id, urls };
      } catch (e) {
        vscode.window.showErrorMessage(e.message);
        throw e;
      }
    }),
    vscode.commands.registerCommand("chatgpt.stopLanAccess", stop),
    vscode.commands.registerCommand("chatgpt.copyLanAddress", async () => {
      if (!running)
        return vscode.window.showInformationMessage(
          "请先开启 Jimao 局域网访问",
        );
      const urls = addresses();
      await vscode.env.clipboard.writeText(
        urls.find((u) => !u.includes("localhost")) || urls[0],
      );
      return urls;
    }),
  ];
  const disposable = {
    dispose() {
      disposed = true;
      clearInterval(discovery);
      focusListener?.dispose();
      serial(detach);
      commands.forEach((c) => c.dispose());
    },
  };
  context.subscriptions.push(disposable);
  return { start, stop, views };
}
module.exports = { register };
