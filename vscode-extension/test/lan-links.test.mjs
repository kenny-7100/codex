import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
const require = createRequire(import.meta.url);
const { createLinks, CODE } = require("../overrides/out/lan/links.cjs");
const { createGateway } = require("../overrides/out/lan/server.cjs");

test("public IDs persist, serialize concurrent creation, survive collisions, and fail closed on corrupt storage", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "jimao-links-"));
  const file = path.join(root, "links.json"),
    win = { id: "aaaa", folders: ["/workspace"] };
  const original = crypto.randomInt;
  try {
    const store = createLinks(file);
    let draws = 0;
    crypto.randomInt = (max) => (++draws <= 24 ? 0 : original(max));
    const a = await store.ensure("thread-a", win),
      b = await store.ensure("thread-b", win);
    crypto.randomInt = original;
    assert(CODE.test(a) && CODE.test(b));
    assert.notEqual(a, b, "Collision must regenerate rather than overwrite");
    const codes = await Promise.all(
      Array.from({ length: 10 }, () => store.ensure("thread-a", win)),
    );
    assert(codes.every((code) => code === a));
    assert.equal((await createLinks(file).get(a)).threadId, "thread-a");
    assert.equal(
      await createLinks(file).ensure("thread-a", { id: "bbbb", folders: [] }),
      a,
    );
    assert.equal(
      (await store.get(a)).windowId,
      "aaaa",
      "Visitors do not replace original window preference",
    );
    assert.equal((await fs.stat(file)).mode & 0o777, 0o600);
    await fs.writeFile(file, "broken");
    await assert.rejects(createLinks(file).get(a));
    assert.equal(await fs.readFile(file, "utf8"), "broken");
  } finally {
    crypto.randomInt = original;
    await fs.rm(root, { recursive: true, force: true });
  }
});

test("gateway resolves before creating views, persists across restart, ranks fallback hosts, and reports missing conversations", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "jimao-resolve-"));
  const linksFile = path.join(root, "links.json");
  let g,
    base,
    timer,
    failRead = false;
  const post = async (route, data) => {
    const r = await fetch(base + route, {
      method: "POST",
      headers: {
        "authorization": `Bearer ${g.secret}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return { status: r.status, ...(await r.json()) };
  };
  async function start() {
    g = createGateway({
      port: 0,
      host: "127.0.0.1",
      linksFile,
      resolveTimeoutMs: 200,
    });
    base = "http://127.0.0.1:" + (await g.listen()).port;
    await post("/internal/access", { enabled: true });
  }
  const register = (id, folders, lastFocused = 0) =>
    post("/internal/register", { id, name: id, folders, root, lastFocused });
  function answer() {
    timer = setInterval(() => {
      for (const win of g.windows.values()) {
        for (const event of [...win.queue]) {
          if (event.type !== "resolve-thread") continue;
          win.queue.splice(win.queue.indexOf(event), 1);
          post("/internal/resolved", {
            windowId: win.id,
            requestId: event.requestId,
            threadId: event.threadId,
            ok: !failRead,
            error: failRead ? "会话不存在" : undefined,
          }).catch(() => {});
        }
      }
    }, 5);
  }
  try {
    await start();
    await register("aaaa", ["/original"]);
    const client = await post("/connect", { windowId: "aaaa" });
    answer();
    const link = await post("/links", {
      clientId: client.id,
      threadId: "thread-a",
    });
    assert.equal(link.status, 200);
    assert.equal((await post("/links", { clientId: client.id })).status, 400);
    assert.match(link.path, /^\/c\/[A-Za-z0-9]{12}$/);
    const code = link.path.slice(3);
    const shell = await fetch(base + link.path);
    assert.equal(shell.status, 200);
    assert.match(await shell.text(), /正在连接/);
    const connected = await post("/connect", { code });
    assert.equal(connected.windowId, "aaaa");
    assert.equal(connected.fallback, false);
    assert.equal(
      g.windows.get("aaaa").queue.at(-1).initialRoute,
      "/local/thread-a",
    );
    await register("bbbb", ["/other"], 20);
    await register("cccc", ["/original"], 10);
    await post("/internal/remove", { windowId: "aaaa" });
    assert.equal(
      (await post("/connect", { code })).windowId,
      "cccc",
      "Same workspace wins over recent focus",
    );
    await post("/internal/remove", { windowId: "cccc" });
    await register("dddd", ["/different"], 5);
    assert.equal(
      (await post("/connect", { code })).windowId,
      "bbbb",
      "Most recently active host is fallback",
    );
    await post("/internal/focus", { windowId: "dddd", focused: true });
    assert.equal((await post("/connect", { code })).windowId, "dddd");
    clearInterval(timer);
    const racing = post("/connect", { code });
    for (
      let i = 0;
      !g.windows.get("dddd").queue.some((e) => e.type === "resolve-thread");
      i++
    ) {
      assert(i < 100, "Resolution request must reach original candidate");
      await new Promise((r) => setTimeout(r, 1));
    }
    await post("/internal/remove", { windowId: "dddd" });
    answer();
    assert.equal(
      (await racing).windowId,
      "bbbb",
      "Window closing during resolution falls back before creating a view",
    );
    failRead = true;
    const count = g.clients.size;
    assert.equal((await post("/connect", { code })).status, 422);
    assert.equal(
      g.clients.size,
      count,
      "Failed resolution cannot create a view of the wrong conversation",
    );
    assert.equal((await post("/connect", { code: "missing" })).status, 404);
    assert.equal(
      (await post("/links", { clientId: "missing", threadId: "thread-a" }))
        .status,
      410,
    );
    clearInterval(timer);
    const timeout = await post("/connect", { code });
    assert.equal(timeout.status, 422);
    assert.match(timeout.error, /及时/);
    await g.close();
    await start();
    failRead = false;
    answer();
    assert.equal((await post("/connect", { code })).status, 503);
    await register("eeee", ["/original"]);
    assert.equal(
      (await post("/connect", { code })).windowId,
      "eeee",
      "Same public link works after gateway restart",
    );
  } finally {
    clearInterval(timer);
    await g?.close();
    await fs.rm(root, { recursive: true, force: true });
  }
});
