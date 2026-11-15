// Shared LAN gateway. Engines and credentials remain in each VS Code host.
const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const { EventEmitter } = require("node:events");
const { createLinks, CODE, THREAD } = require("./links.cjs");
const VERSION = 3;
const MAX_BODY = 24 * 1024 * 1024;
function createGateway({
  port = 8765,
  host = "0.0.0.0",
  secret = crypto.randomBytes(32).toString("hex"),
  idleMs = 30000,
  linksFile = path.join(
    require("node:os").tmpdir(),
    "jimao-test-links-" + crypto.randomUUID() + ".json",
  ),
  resolveTimeoutMs = 15000,
} = {}) {
  const windows = new Map(),
    clients = new Map();
  const links = createLinks(linksFile),
    pending = new Map();
  let idleSince = Date.now(),
    enabled = false;
  function verifyThread(win, threadId) {
    if (typeof threadId !== "string" || !THREAD.test(threadId))
      throw Object.assign(Error("会话标识无效"), { status: 400 });
    const requestId = crypto.randomUUID();
    return new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => finish(Error("VS Code 未能及时读取会话，请重试")),
        resolveTimeoutMs,
      );
      function finish(error) {
        clearTimeout(timer);
        pending.delete(requestId);
        error ? reject(Object.assign(error, { status: 422 })) : resolve();
      }
      pending.set(requestId, { windowId: win.id, threadId, finish });
      try {
        enqueue(win, { type: "resolve-thread", requestId, threadId });
      } catch (error) {
        finish(error);
      }
    });
  }
  function chooseWindow(entry) {
    const exact = windows.get(entry.windowId);
    if (exact) return exact;
    const ranked = [...windows.values()].sort(
      (a, b) =>
        Number(b.focused === true) - Number(a.focused === true) ||
        (b.lastFocused || 0) - (a.lastFocused || 0) ||
        b.lastSeen - a.lastSeen,
    );
    const key = (folders) => JSON.stringify([...folders].sort());
    return (
      (entry.folders.length &&
        ranked.find((w) => key(w.folders) === key(entry.folders))) ||
      ranked[0]
    );
  }
  const json = (res, status, data) => {
    res.writeHead(status, {
      "content-type": "application/json",
      "cache-control": "no-store",
    });
    res.end(JSON.stringify(data));
  };
  const enqueue = (win, event) => {
    if (win.queue.length >= 1024)
      throw Object.assign(Error("Window message queue is full"), {
        status: 503,
      });
    win.queue.push(event);
    win.wake.emit("queue");
  };
  const emit = (client, event, data) => {
    if (!client.stream || client.stream.writableLength > MAX_BODY) {
      client.stream?.destroy();
      return;
    }
    client.stream.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };
  function closeClient(id) {
    const c = clients.get(id);
    if (!c) return;
    clients.delete(id);
    c.stream?.end();
    const win = windows.get(c.windowId);
    if (win) enqueue(win, { type: "disconnect", clientId: id });
  }
  function removeWindow(id) {
    windows.get(id)?.wake.emit("queue");
    const existed = windows.delete(id);
    for (const p of pending.values())
      if (p.windowId === id) p.finish(Error("目标 VS Code 窗口已断开，请重试"));
    if (existed && !windows.size) enabled = false;
    for (const c of clients.values())
      if (c.windowId === id) {
        emit(c, "offline", {});
        closeClient(c.id);
      }
  }
  function pruneHosts() {
    for (const w of windows.values()) {
      if (!Number.isInteger(w.pid)) continue;
      try {
        process.kill(w.pid, 0);
      } catch (error) {
        if (error.code === "ESRCH") removeWindow(w.id);
      }
    }
  }
  async function body(req) {
    const chunks = [];
    let size = 0;
    for await (const c of req) {
      size += c.length;
      if (size > MAX_BODY)
        throw Object.assign(Error("Request too large"), { status: 413 });
      chunks.push(c);
    }
    return JSON.parse(Buffer.concat(chunks).toString() || "{}");
  }
  const server = http.createServer(async (req, res) => {
    try {
      pruneHosts();
      const url = new URL(req.url, "http://gateway");
      const origin = req.headers.origin;
      if (origin && new URL(origin).host !== req.headers.host)
        return json(res, 403, {
          error: "Cross-origin requests are not supported",
        });
      const internal = url.pathname.startsWith("/internal/");
      if (
        internal &&
        (!["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(
          req.socket.remoteAddress,
        ) ||
          req.headers.authorization !== `Bearer ${secret}`)
      )
        return json(res, 403, { error: "Host connection rejected" });
      if (url.pathname === "/favicon.ico") {
        res.writeHead(204);
        return res.end();
      }
      if (url.pathname === "/health")
        return json(res, 200, {
          service: "jimao-lan",
          version: VERSION,
          enabled,
        });
      if (
        req.method === "GET" &&
        (url.pathname === "/" || /^\/c\/[^/]+$/.test(url.pathname))
      ) {
        res.writeHead(200, {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
        });
        return res.end(await fs.readFile(path.join(__dirname, "shell.html")));
      }
      if (req.method === "GET" && url.pathname === "/windows")
        return json(
          res,
          200,
          [...windows.values()].map((w) => ({
            id: w.id,
            name: w.name,
            folders: w.folders,
          })),
        );
      if (req.method === "POST" && url.pathname === "/internal/resolved") {
        const data = await body(req),
          p = pending.get(data.requestId);
        if (p && p.windowId === data.windowId)
          p.finish(
            data.threadId === p.threadId && data.ok === true
              ? null
              : Error(data.error || "无法访问此会话"),
          );
        return json(res, 200, { ok: true });
      }
      if (req.method === "POST" && url.pathname === "/links") {
        const { clientId, threadId } = await body(req),
          c = clients.get(clientId),
          w = c && windows.get(c.windowId);
        if (!w) return json(res, 410, { error: "窗口已断开，请重试" });
        await verifyThread(w, threadId);
        if (windows.get(w.id) !== w)
          return json(res, 410, { error: "窗口已断开，请重试" });
        const code = await links.ensure(threadId, w);
        return json(res, 200, { path: "/c/" + code });
      }
      if (req.method === "POST" && url.pathname === "/internal/focus") {
        const data = await body(req),
          w = windows.get(data.windowId);
        if (w) {
          w.focused = data.focused === true;
          if (w.focused) w.lastFocused = Date.now();
        }
        return json(res, 200, { ok: true });
      }
      if (req.method === "POST" && url.pathname === "/internal/access") {
        enabled = (await body(req)).enabled === true;
        idleSince = Date.now();
        if (!enabled) for (const id of [...windows.keys()]) removeWindow(id);
        return json(res, 200, { enabled });
      }
      if (req.method === "POST" && url.pathname === "/internal/register") {
        if (!enabled)
          return json(res, 409, { error: "LAN access is disabled" });
        const data = await body(req);
        const existing = windows.get(data.id);
        if (!data.id || !data.root)
          return json(res, 400, { error: "Missing window identity" });
        windows.set(data.id, {
          ...data,
          lastSeen: Date.now(),
          queue: existing?.queue || [],
          wake: existing?.wake || new EventEmitter(),
        });
        return json(res, 200, { ok: true });
      }
      if (req.method === "POST" && url.pathname === "/internal/remove") {
        const data = await body(req);
        removeWindow(data.windowId);
        return json(res, 200, { ok: true });
      }
      if (req.method === "GET" && url.pathname === "/internal/poll") {
        const w = windows.get(url.searchParams.get("window"));
        if (!w) return json(res, 404, { error: "Window not registered" });
        w.lastSeen = Date.now();
        if (!w.queue.length)
          await new Promise((resolve) => {
            const done = () => {
              clearTimeout(timer);
              w.wake.removeListener("queue", done);
              resolve();
            };
            const timer = setTimeout(done, 15000);
            w.wake.once("queue", done);
            req.on("close", done);
          });
        w.lastSeen = Date.now();
        return json(res, 200, w.queue.splice(0));
      }
      if (req.method === "POST" && url.pathname === "/connect") {
        const { windowId, code } = await body(req);
        let w, entry;
        if (code !== undefined) {
          entry = CODE.test(code) ? await links.get(code) : null;
          if (!entry)
            return json(res, 404, { error: "会话链接不存在或已失效" });
          const tried = new Set();
          while (true) {
            w = chooseWindow(entry);
            if (!w)
              return json(res, 503, {
                error: "没有可用的 VS Code 窗口，请打开并激活 Jimao 后重试",
              });
            if (tried.has(w.id))
              return json(res, 410, { error: "目标窗口已断开，请重试" });
            tried.add(w.id);
            try {
              await verifyThread(w, entry.threadId);
            } catch (error) {
              if (windows.has(w.id)) throw error;
              else continue;
            }
            if (windows.has(w.id)) break;
          }
        } else w = windows.get(windowId);
        if (!w) return json(res, 404, { error: "窗口已断开" });
        if (clients.size >= 64)
          return json(res, 503, { error: "Too many browser connections" });
        const id = crypto.randomUUID();
        clients.set(id, {
          id,
          windowId: w.id,
          html: null,
          lastSeen: Date.now(),
        });
        enqueue(w, {
          type: "connect",
          clientId: id,
          initialRoute: entry ? "/local/" + entry.threadId : "/",
        });
        return json(res, 200, {
          id,
          windowId: w.id,
          fallback: !!entry && w.id !== entry.windowId,
        });
      }
      const match = url.pathname.match(
        /^\/(events|message|frame|disconnect)\/([a-f0-9-]+)$/,
      );
      if (match) {
        const [, action, id] = match,
          c = clients.get(id);
        if (!c) return json(res, 404, { error: "Client disconnected" });
        c.lastSeen = Date.now();
        const w = windows.get(c.windowId);
        if (!w) return json(res, 410, { error: "Window offline" });
        if (action === "events" && req.method === "GET") {
          c.stream?.end();
          res.writeHead(200, {
            "content-type": "text/event-stream",
            "cache-control": "no-store",
            "connection": "keep-alive",
          });
          res.write(": connected\n\n");
          c.stream = res;
          req.on("close", () => {
            if (c.stream === res) c.stream = null;
          });
          return;
        }
        if (action === "message" && req.method === "POST") {
          enqueue(w, {
            type: "message",
            clientId: id,
            message: await body(req),
          });
          return json(res, 200, { ok: true });
        }
        if (action === "disconnect" && req.method === "POST") {
          closeClient(id);
          return json(res, 200, { ok: true });
        }
        if (action === "frame" && req.method === "GET") {
          for (let i = 0; !c.html && i < 200; i++)
            await new Promise((r) => setTimeout(r, 50));
          if (!c.html)
            return json(res, 503, {
              error: "VS Code did not initialize the browser view",
            });
          res.writeHead(200, {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "no-store",
          });
          return res.end(c.html);
        }
      }
      if (req.method === "POST" && url.pathname === "/internal/deliver") {
        const d = await body(req),
          c = clients.get(d.clientId);
        if (c && c.windowId === d.windowId) {
          if (d.html !== undefined) c.html = d.html;
          else emit(c, "message", d.message);
        }
        return json(res, 200, { ok: true });
      }
      // Only packaged web resources can be served, never arbitrary workspace files.
      const asset = url.pathname.match(/^\/resources\/([a-f0-9-]+)\/(.*)$/);
      if (asset && req.method === "GET") {
        const w = windows.get(asset[1]);
        if (!w) return json(res, 404, { error: "Window offline" });
        const root = await fs.realpath(w.root),
          file = await fs.realpath(
            path.resolve(root, decodeURIComponent(asset[2])),
          );
        if (!file.startsWith(root + path.sep))
          return json(res, 403, { error: "Invalid resource path" });
        const types = {
          ".js": "text/javascript",
          ".css": "text/css",
          ".svg": "image/svg+xml",
          ".png": "image/png",
          ".woff2": "font/woff2",
          ".wasm": "application/wasm",
          ".json": "application/json",
          ".mp3": "audio/mpeg",
        };
        res.writeHead(200, {
          "content-type":
            types[path.extname(file)] || "application/octet-stream",
          "cache-control": "no-cache",
        });
        return res.end(await fs.readFile(file));
      }
      json(res, 404, { error: "Not found" });
    } catch (error) {
      if (!res.headersSent)
        json(res, error.status || 500, {
          error: error.code === "ENOENT" ? "Resource not found" : error.message,
        });
      else res.end();
    }
  });
  const timer = setInterval(() => {
    pruneHosts();
    for (const w of windows.values())
      if (Date.now() - w.lastSeen > 45000) removeWindow(w.id);
    for (const c of clients.values()) {
      if (c.stream) {
        c.lastSeen = Date.now();
        c.stream.write(": heartbeat\n\n");
      } else if (Date.now() - c.lastSeen > 20000) closeClient(c.id);
    }
    if (windows.size) idleSince = Date.now();
    else if (Date.now() - idleSince > idleMs) server.close();
  }, 3000);
  timer.unref();
  server.on("close", () => {
    clearInterval(timer);
    for (const p of pending.values()) p.finish(Error("共享入口已关闭"));
    for (const c of clients.values()) c.stream?.end();
  });
  return {
    server,
    secret,
    windows,
    clients,
    listen: () =>
      new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(port, host, () => resolve(server.address()));
      }),
    close: () => {
      for (const c of clients.values()) c.stream?.end();
      server.closeAllConnections();
      return new Promise((r) => server.close(r));
    },
  };
}
module.exports = { createGateway, VERSION };
if (require.main === module) {
  const port = Number(process.argv[2]),
    state = process.argv[3],
    secret = process.env.JIMAO_LAN_SECRET;
  const gateway = createGateway({
    port,
    secret,
    linksFile: path.join(path.dirname(state), "conversation-links.json"),
  });
  gateway
    .listen()
    .then(async () => {
      await fs.writeFile(
        state + "." + process.pid + ".tmp",
        JSON.stringify({ port, secret, pid: process.pid, version: VERSION }),
        { mode: 0o600 },
      );
      await fs.rename(state + "." + process.pid + ".tmp", state);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
