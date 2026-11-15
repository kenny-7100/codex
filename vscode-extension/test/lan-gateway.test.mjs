import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
const { createGateway } = createRequire(import.meta.url)(
  "../overrides/out/lan/server.cjs",
);
test("gateway isolates windows and clients, survives owner disconnect, and restricts resources", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "jimao-lan-test-"));
  await fs.writeFile(path.join(root, "app.js"), "export const ok=true");
  const g = createGateway({ port: 0, host: "127.0.0.1" });
  const addr = await g.listen(),
    base = `http://127.0.0.1:${addr.port}`;
  const req = async (route, data, auth = true) => {
    const r = await fetch(base + route, {
      method: data ? "POST" : "GET",
      headers: {
        "content-type": "application/json",
        ...(auth ? { authorization: `Bearer ${g.secret}` } : {}),
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    return { status: r.status, data: await r.json() };
  };
  try {
    await fetch(base + "/internal/access", {
      method: "POST",
      headers: {
        "authorization": `Bearer ${g.secret}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ enabled: true }),
    });
    assert.equal(
      (
        await req(
          "/internal/register",
          { id: "aaaa", name: "A", root, folders: [] },
          false,
        )
      ).status,
      403,
    );
    for (const id of ["aaaa", "bbbb"])
      assert.equal(
        (await req("/internal/register", { id, name: id, root, folders: [] }))
          .status,
        200,
      );
    const a = (await req("/connect", { windowId: "aaaa" })).data.id,
      b = (await req("/connect", { windowId: "bbbb" })).data.id;
    assert.equal((await req("/internal/poll?window=aaaa")).data[0].clientId, a);
    assert.equal((await req("/internal/poll?window=bbbb")).data[0].clientId, b);
    await req("/message/" + a, { sequence: 1, message: { type: "test", id: 1 } });
    assert.equal(
      (await req("/internal/poll?window=aaaa")).data[0].message.id,
      1,
    );
    assert.equal(g.windows.get("bbbb").queue.length, 0);
    await req("/internal/deliver", {
      windowId: "bbbb",
      clientId: a,
      html: "wrong",
    });
    assert.equal(g.clients.get(a).html, null);
    await req("/internal/deliver", {
      windowId: "aaaa",
      clientId: a,
      html: "right",
    });
    assert.equal(
      await fetch(base + "/frame/" + a).then((r) => r.text()),
      "right",
    );
    assert.equal(
      await fetch(base + "/resources/aaaa/app.js").then((r) => r.text()),
      "export const ok=true",
    );
    await fs.symlink("/etc/passwd", path.join(root, "outside"));
    assert.equal((await fetch(base + "/resources/aaaa/outside")).status, 403);
    await req("/internal/remove", { windowId: "aaaa" });
    assert.equal((await req("/windows")).data.length, 1);
    assert(g.clients.has(b));
    assert(!g.clients.has(a));
    await req("/disconnect/" + b, {});
    assert(!g.clients.has(b));
    assert.equal(
      (await req("/internal/poll?window=bbbb")).data[0].type,
      "disconnect",
    );
  } finally {
    await g.close();
    await fs.rm(root, { recursive: true, force: true });
  }
});

test("streamed messages stay with their originating window and disallowed origins are rejected", async () => {
  const gateway = createGateway({ port: 0, host: "127.0.0.1" }),
    address = await gateway.listen(),
    base = `http://127.0.0.1:${address.port}`;
  const send = async (route, data) =>
    fetch(base + route, {
      method: "POST",
      headers: {
        "authorization": `Bearer ${gateway.secret}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
  const controller = new AbortController();
  try {
    await fetch(base + "/internal/access", {
      method: "POST",
      headers: {
        "authorization": `Bearer ${gateway.secret}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ enabled: true }),
    });
    await send("/internal/register", {
      id: "aaaa",
      root: process.cwd(),
      name: "A",
      folders: [],
    });
    const { id } = await send("/connect", { windowId: "aaaa" }).then((r) =>
      r.json(),
    );
    const response = await fetch(base + "/events/" + id, {
        signal: controller.signal,
      }),
      reader = response.body.getReader();
    await reader.read();
    await send("/internal/deliver", {
      windowId: "aaaa",
      clientId: id,
      message: { type: "test", value: "only A" },
    });
    assert.match(
      new TextDecoder().decode((await reader.read()).value),
      /only A/,
    );
    const rejected = await fetch(base + "/message/" + id, {
      method: "POST",
      headers: {
        "origin": "http://unrelated.invalid",
        "content-type": "application/json",
      },
      body: "{}",
    });
    assert.equal(rejected.status, 403);
    assert.equal(gateway.windows.get("aaaa").queue.length, 1);
  } finally {
    controller.abort();
    await gateway.close();
  }
});

test("unused gateway shuts itself down", async () => {
  const gateway = createGateway({ port: 0, host: "127.0.0.1", idleMs: 10 });
  await gateway.listen();
  await new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(Error("Idle gateway did not stop")),
      6000,
    );
    gateway.server.once("close", () => {
      clearTimeout(timer);
      resolve();
    });
  });
  assert.equal(gateway.server.listening, false);
});

test("activated hosts join globally, stop together, and do not reopen after last window leaves", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "jimao-global-test-"));
  const previous = process.env.CODEX_HOME;
  process.env.CODEX_HOME = root;
  const gateway = createGateway({ port: 0, host: "127.0.0.1" });
  const address = await gateway.listen();
  const base = `http://127.0.0.1:${address.port}`;
  await fs.mkdir(path.join(root, "jimao-lan"));
  await fs.writeFile(
    path.join(root, "jimao-lan/gateway.json"),
    JSON.stringify({ port: address.port, secret: gateway.secret, version: 4 }),
  );
  const { register } = createRequire(import.meta.url)(
    "../overrides/out/lan/host.cjs",
  );
  const hosts = [];
  function host(name) {
    const context = { subscriptions: [], extensionUri: { fsPath: root } };
    const commands = new Map();
    const api = register(
      {
        workspace: {
          name,
          workspaceFolders: [],
          getConfiguration: () => ({ get: () => address.port }),
        },
        commands: {
          registerCommand: (name, fn) => {
            commands.set(name, fn);
            return { dispose() {} };
          },
        },
        env: { clipboard: { async writeText() {} } },
        window: { showInformationMessage() {}, showErrorMessage() {} },
      },
      context,
      { broadcastToAllViews() {} },
    );
    const result = {
      api,
      commands,
      dispose: () => context.subscriptions.forEach((d) => d.dispose()),
    };
    hosts.push(result);
    return result;
  }
  async function until(check) {
    for (let i = 0; i < 80; i++) {
      if (await check()) return;
      await new Promise((r) => setTimeout(r, 100));
    }
    throw Error("Global access state did not converge");
  }
  try {
    const a = host("A"),
      b = host("B");
    assert.equal(gateway.windows.size, 0);
    await fetch(base + "/internal/access", {
      method: "POST",
      headers: {
        "authorization": `Bearer ${gateway.secret}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ enabled: true }),
    });
    await fetch(base + "/internal/remove", {
      method: "POST",
      headers: {
        "authorization": `Bearer ${gateway.secret}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ windowId: "already-removed" }),
    });
    assert.equal(
      (await fetch(base + "/health").then((r) => r.json())).enabled,
      true,
      "Stale window cleanup must not cancel a new enable",
    );
    await a.api.start();
    await until(() => gateway.windows.size === 2);
    const c = host("C");
    await until(() => gateway.windows.size === 3);
    await b.api.stop();
    await until(() => gateway.windows.size === 0);
    await new Promise((r) => setTimeout(r, 2300));
    assert.equal(
      gateway.windows.size,
      0,
      "Polling must not re-enable globally disabled access",
    );
    await c.api.start();
    await until(() => gateway.windows.size === 3);
    a.dispose();
    await until(() => gateway.windows.size === 2);
    b.dispose();
    c.dispose();
    await until(() => gateway.windows.size === 0);
    assert.equal(
      (await fetch(base + "/health").then((r) => r.json())).enabled,
      false,
    );
    host("new session");
    await new Promise((r) => setTimeout(r, 2300));
    assert.equal(gateway.windows.size, 0, "A new session must stay disabled");
  } finally {
    hosts.forEach((h) => h.dispose());
    await new Promise((r) => setTimeout(r, 100));
    await gateway.close();
    if (previous === undefined) delete process.env.CODEX_HOME;
    else process.env.CODEX_HOME = previous;
    await fs.rm(root, { recursive: true, force: true });
  }
});
