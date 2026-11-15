import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const { createGateway } = createRequire(import.meta.url)(
  "../overrides/out/lan/server.cjs",
);
async function fixture(options = {}) {
  const g = createGateway({ port: 0, host: "127.0.0.1", ...options });
  const { port } = await g.listen();
  const base = `http://127.0.0.1:${port}`;
  const post = async (p, d) =>
    fetch(base + p, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization": `Bearer ${g.secret}`,
      },
      body: JSON.stringify(d),
    });
  await post("/internal/access", { enabled: true });
  await post("/internal/register", {
    id: "aaaa",
    name: "A",
    root: process.cwd(),
    folders: [],
  });
  const { id } = await (await post("/connect", { windowId: "aaaa" })).json();
  g.windows.get("aaaa").queue = [];
  const deliver = (message) =>
    post("/internal/deliver", { clientId: id, windowId: "aaaa", message });
  const stream = async (after = 0) => {
    const abort = new AbortController();
    const res = await fetch(base + "/events/" + id + "?after=" + after, {
      signal: abort.signal,
    });
    const reader = res.body?.getReader();
    return {
      res,
      reader,
      abort,
      async until(text) {
        let result = "";
        while (!result.includes(text)) {
          const next = await reader.read();
          assert.ok(!next.done);
          result += new TextDecoder().decode(next.value);
        }
        return result;
      },
    };
  };
  return { g, post, id, deliver, stream };
}
test("transport replays unacknowledged messages in order and frees acknowledged history", async () => {
  const { g, post, id, deliver, stream } = await fixture();
  try {
    await deliver({ type: "reply", n: 1 });
    await deliver({ type: "reply", n: 2 });
    const first = await stream();
    const initial = await first.until("event: ready");
    assert.match(initial, /id: 1[\s\S]*"n":1[\s\S]*id: 2[\s\S]*"n":2/);
    first.abort.abort();
    assert.equal((await post("/resume/" + id, { received: 1 })).status, 200);
    assert.equal(g.clients.get(id).replay.length, 1);
    await deliver({ type: "completed", n: 3 });
    const next = await stream(1);
    const replay = await next.until("event: ready");
    assert.doesNotMatch(replay, /"n":1/);
    assert.match(replay, /id: 2[\s\S]*id: 3/);
    next.abort.abort();
    assert.equal((await post("/ack/" + id, { received: 3 })).status, 200);
    assert.equal(g.clients.get(id).replayBytes, 0);
    assert.equal(
      (await post("/ack/" + id, { received: 2 })).status,
      200,
      "late ACK harmless",
    );
    assert.equal(
      (await post("/resume/" + id, { received: 1 })).status,
      409,
      "lost replay position must rebuild",
    );
    assert.equal((await post("/resume/" + id, { received: 4 })).status, 409);
  } finally {
    await g.close();
  }
});
test("a lost POST response can be retried without duplicate RPC or user actions", async () => {
  const { g, post, id } = await fixture();
  try {
    const message = {
      sequence: 1,
      message: { type: "send", text: "exactly-once" },
    };
    await Promise.all([
      post("/message/" + id, message),
      post("/message/" + id, message),
    ]);
    assert.equal(g.windows.get("aaaa").queue.length, 1);
    assert.equal(
      (
        await post("/message/" + id, {
          sequence: 3,
          message: { type: "out-of-order" },
        })
      ).status,
      409,
    );
    assert.equal(
      (await post("/message/" + id, { sequence: 2, message: { type: "stop" } }))
        .status,
      200,
    );
    assert.deepEqual(
      g.windows.get("aaaa").queue.map((e) => e.message.type),
      ["send", "stop"],
    );
    assert.equal(
      (await (await post("/resume/" + id, { received: 0 })).json()).incoming,
      2,
    );
  } finally {
    await g.close();
  }
});
test("replay count and byte limits expire the client safely instead of silently losing notifications", async () => {
  for (const options of [{ maxReplayMessages: 1 }, { maxReplayBytes: 40 }]) {
    const { g, id, deliver, post } = await fixture(options);
    try {
      await deliver({ type: "reply", text: "retained" });
      await deliver({ type: "reply", text: "overflow" });
      assert.equal(g.clients.has(id), false);
      assert.equal((await post("/resume/" + id, { received: 0 })).status, 404);
      assert.equal(
        g.windows.get("aaaa").queue.filter((e) => e.type === "disconnect")
          .length,
        1,
      );
    } finally {
      await g.close();
    }
  }
});
test("detached clients survive short suspension but expire after the configured retention", async () => {
  const { g, id, post } = await fixture({ clientRetentionMs: 60000 });
  try {
    g.clients.get(id).lastSeen = Date.now() - 25000;
    await new Promise((r) => setTimeout(r, 3100));
    assert.ok(
      g.clients.has(id),
      "old 20 second threshold no longer destroys a suspended view",
    );
    g.clients.get(id).lastSeen = Date.now() - 61000;
    await new Promise((r) => setTimeout(r, 3100));
    assert.equal(g.clients.has(id), false);
    assert.equal((await post("/resume/" + id, { received: 0 })).status, 404);
  } finally {
    await g.close();
  }
});
