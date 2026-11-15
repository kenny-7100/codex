import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
const { createGateway } = createRequire(import.meta.url)(
  "../../overrides/out/lan/server.cjs",
);
const bridge = await fs.readFile(
  new URL("../../overrides/out/lan/bridge.js", import.meta.url),
  "utf8",
);
async function setup(page, options = {}) {
  const gateway = createGateway({ port: 0, host: "127.0.0.1", ...options });
  const { port } = await gateway.listen();
  const base = `http://127.0.0.1:${port}`;
  const post = (p, d) =>
    fetch(base + p, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization": `Bearer ${gateway.secret}`,
      },
      body: JSON.stringify(d),
    });
  await post("/internal/access", { enabled: true });
  await post("/internal/register", {
    id: "aaaa",
    root: process.cwd(),
    name: "Mobile",
    folders: [],
  });
  const actions = [];
  gateway.windows.get("aaaa").wake.on("queue", () => {
    for (const event of gateway.windows.get("aaaa")?.queue.splice(0) || []) {
      if (event.type === "connect") {
        const code = bridge
          .replace("__CLIENT_ID__", JSON.stringify(event.clientId))
          .replace("__WINDOW_ID__", '"aaaa"')
          .replace("__INITIAL_ROUTE__", '"/"');
        gateway.clients.get(event.clientId).html =
          `<!doctype html><html><head><script>${code}</script></head><body><div id="root"><main id="history" style="height:200px;overflow:auto"><div style="height:2000px">History</div></main><textarea id="draft"></textarea><button id="send">Send</button><pre id="received"></pre></div><script>window.identity=crypto.randomUUID();window.messages=[];const api=acquireVsCodeApi();window.addEventListener('message',e=>{if(e.data.type==='fixture'){messages.push(e.data);document.querySelector('#received').textContent=JSON.stringify(messages);}});document.querySelector('#send').onclick=()=>api.postMessage({type:'action',text:document.querySelector('#draft').value});</script></body></html>`;
      } else if (event.type === "message") actions.push(event.message);
    }
  });
  await page.goto(base);
  await page.locator("select").selectOption("aaaa");
  const frame = page.frameLocator("#view");
  await frame.locator("#draft").waitFor();
  await expect(page.locator("#status")).toHaveText("已连接");
  const client = () =>
    page
      .locator("#view")
      .getAttribute("src")
      .then((s) => s.split("/").pop());
  const deliver = async (n) =>
    post("/internal/deliver", {
      windowId: "aaaa",
      clientId: await client(),
      message: { type: "fixture", n },
    });
  return { gateway, post, base, frame, actions, client, deliver };
}
test("mobile transport resumes without replacing iframe, draft or scroll and replays missed completion once", async ({
  page,
}) => {
  const f = await setup(page);
  try {
    await f.frame.locator("#draft").fill("unsent draft");
    const identity = await f.frame.locator("body").evaluate(() => {
      document.querySelector("#history").scrollTop = 150;
      return window.identity;
    });
    const client = await f.client();
    await page.context().setOffline(true);
    await page.waitForTimeout(500);
    await f.deliver(1);
    await f.deliver("turn/completed");
    await page.context().setOffline(false);
    await expect(f.frame.locator("#received")).toContainText("turn/completed");
    await expect(page.locator("#status")).toHaveText("已连接");
    expect(await f.client()).toBe(client);
    expect(await f.frame.locator("body").evaluate(() => window.identity)).toBe(
      identity,
    );
    await expect(f.frame.locator("#draft")).toHaveValue("unsent draft");
    expect(await f.frame.locator("#history").evaluate((e) => e.scrollTop)).toBe(
      150,
    );
    // BFCache/mobile lifecycle must detach transport without disposing the view.
    await page.evaluate(() =>
      window.dispatchEvent(
        new PageTransitionEvent("pagehide", { persisted: true }),
      ),
    );
    await f.frame
      .locator("body")
      .evaluate(() =>
        window.dispatchEvent(
          new PageTransitionEvent("pagehide", { persisted: true }),
        ),
      );
    await f.deliver(3);
    await f.frame
      .locator("body")
      .evaluate(() =>
        window.dispatchEvent(
          new PageTransitionEvent("pageshow", { persisted: true }),
        ),
      );
    await expect(f.frame.locator("#received")).toContainText('"n":3');
    await f.frame
      .locator("body")
      .evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
    await expect(page.locator("#status")).toHaveText("已连接");
    expect(await f.client()).toBe(client);
    expect(
      await f.frame
        .locator("body")
        .evaluate(() => window.messages.map((m) => m.n)),
    ).toEqual([1, "turn/completed", 3]);
  } finally {
    await page.context().setOffline(false);
    await f.gateway.close();
  }
});
test("retry after accepted POST response loss never repeats the action", async ({
  page,
}) => {
  const f = await setup(page);
  try {
    let dropped = false;
    await page.route("**/message/**", async (route) => {
      if (!dropped) {
        dropped = true;
        await route.fetch();
        await route.abort("failed");
      } else await route.continue();
    });
    await f.frame.locator("#draft").fill("only once");
    await f.frame.locator("#send").click();
    await expect.poll(() => f.actions.length).toBe(1);
    await expect(page.locator("#status")).toHaveText("已连接");
    await f.frame.locator("#send").click();
    await expect.poll(() => f.actions.length).toBe(2);
    expect(f.actions).toEqual([
      { type: "action", text: "only once" },
      { type: "action", text: "only once" },
    ]);
  } finally {
    await f.gateway.close();
  }
});
test("expired transport rebuilds safely and the new page can send again", async ({
  page,
}) => {
  const f = await setup(page, { maxReplayMessages: 1 });
  try {
    const old = await f.client();
    await page.context().setOffline(true);
    await page.waitForTimeout(500);
    await f.deliver(1);
    await f.deliver(2);
    expect(f.gateway.clients.has(old)).toBe(false);
    await page.context().setOffline(false);
    await expect.poll(f.client).not.toBe(old);
    await expect(page.locator("#status")).toHaveText("已连接");
    await f.frame.locator("#draft").fill("after reset");
    await f.frame.locator("#send").click();
    await expect.poll(() => f.actions.length).toBe(1);
  } finally {
    await page.context().setOffline(false);
    await f.gateway.close();
  }
});

test("duplicate SSE records are ignored and a sequence gap triggers safe reinitialization", async ({
  page,
}) => {
  const f = await setup(page);
  try {
    const old = await f.client();
    await f.deliver("one");
    await expect(f.frame.locator("#received")).toContainText("one");
    const client = f.gateway.clients.get(old);
    client.stream.write(
      'id: 1\nevent: message\ndata: {"type":"fixture","n":"one"}\n\n',
    );
    await f.deliver("two");
    await expect(f.frame.locator("#received")).toContainText("two");
    expect(
      await f.frame
        .locator("body")
        .evaluate(() => window.messages.map((m) => m.n)),
    ).toEqual(["one", "two"]);
    client.stream.write(
      'id: 4\nevent: message\ndata: {"type":"fixture","n":"gap"}\n\n',
    );
    await expect.poll(f.client).not.toBe(old);
    await expect(page.locator("#status")).toHaveText("已连接");
  } finally {
    await f.gateway.close();
  }
});
