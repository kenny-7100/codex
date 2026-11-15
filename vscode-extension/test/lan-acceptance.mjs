import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import { spawn } from "node:child_process";
import { chromium } from "@playwright/test";
import { protocolAcceptance } from './protocol-acceptance.mjs';
const root = process.cwd(),
  pause = (ms) => new Promise((r) => setTimeout(r, ms));
const profile = await fs.mkdtemp("/Volumes/kenny/codex-build/tmp/jimao-lan-");
await fs.mkdir(path.join(profile, "codex"), { recursive: true });
await fs.mkdir(path.join(profile, "workspace"), { recursive: true });
const portProbe = http.createServer();
await new Promise((r) => portProbe.listen(0, "127.0.0.1", r));
const lanPort = portProbe.address().port;
await new Promise((r) => portProbe.close(r));
let hold = false,
  nextTool = false,
  deferNextResponseMs = 0;
const children = [];
const requests = [];
const mock = http.createServer(async (req, res) => {
  let body = "";
  for await (const c of req) body += c;
  requests.push(JSON.parse(body));
  if (hold) {
    res.writeHead(200, { "content-type": "text/event-stream" });
    res.write(
      'event: response.created\ndata: {"type":"response.created","response":{"id":"resp_hold"}}\n\n',
    );
    return;
  }
  const responseDelay = deferNextResponseMs;
  deferNextResponseMs = 0;
  if (responseDelay) await pause(responseDelay);
  res.writeHead(200, { "content-type": "text/event-stream" });
  const message = nextTool
    ? {
        id: "fc_approval",
        type: "function_call",
        name: "exec_command",
        call_id: "call_approval",
        arguments: JSON.stringify({
          cmd: "printf lan-approved",
          sandbox_permissions: "require_escalated",
          justification: "LAN acceptance approval",
          max_output_tokens: 100,
        }),
      }
    : {
        id: "msg_lan",
        type: "message",
        role: "assistant",
        status: "completed",
        content: [{ type: "output_text", text: "LAN acceptance response." }],
      };
  nextTool = false;
  for (const [type, value] of [
    ["response.created", { response: { id: "resp_lan" } }],
    [
      "response.output_item.added",
      {
        output_index: 0,
        item: { ...message, status: "in_progress", content: [] },
      },
    ],
    [
      "response.output_text.delta",
      {
        item_id: "msg_lan",
        output_index: 0,
        content_index: 0,
        delta: "LAN acceptance response.",
      },
    ],
    ["response.output_item.done", { output_index: 0, item: message }],
    [
      "response.completed",
      {
        response: {
          id: "resp_lan",
          status: "completed",
          output: [message],
          usage: { input_tokens: 1, output_tokens: 1, total_tokens: 2 },
        },
      },
    ],
  ]) {
    if (
      message.type === "function_call" &&
      type === "response.output_text.delta"
    )
      continue;
    res.write(
      `event: ${type}\ndata: ${JSON.stringify({ type, ...value })}\n\n`,
    );
  }
  res.end();
});
await new Promise((r) => mock.listen(0, "127.0.0.1", r));
await fs.writeFile(
  path.join(profile, "codex/config.toml"),
  `model_provider="probe"\nmodel="gpt-5.1-codex"\n[model_providers.probe]\nname="Local LAN acceptance"\nbase_url="http://127.0.0.1:${mock.address().port}/v1"\nwire_api="responses"\nrequires_openai_auth=false\nsupports_websockets=false\n`,
);
await fs.mkdir(path.join(profile, "user-data/User"), { recursive: true });
await fs.writeFile(
  path.join(profile, "user-data/User/settings.json"),
  JSON.stringify({
    "telemetry.telemetryLevel": "off",
    "extensions.autoUpdate": false,
    "security.workspace.trust.enabled": false,
    "chatgpt.lanPort": lanPort,
  }),
);
const env = Object.fromEntries(
  Object.entries(process.env).filter(([k]) => !/proxy/i.test(k)),
);
env.CODEX_HOME = path.join(profile, "codex");
env.JIMAO_LAN_ACCEPTANCE = profile;
env.NO_PROXY = "localhost,127.0.0.1";
const code = spawn(
  "code",
  [
    path.join(profile, "workspace"),
    "--new-window",
    "--skip-welcome",
    "--skip-release-notes",
    "--disable-extensions",
    "--user-data-dir",
    path.join(profile, "user-data"),
    "--extensions-dir",
    path.join(profile, "extensions"),
    "--extensionDevelopmentPath",
    path.join(root, "build/extension"),
    "--extensionTestsPath",
    path.join(root, "test/lan-host.cjs"),
    "--enable-proposed-api",
    "openai.chatgpt",
  ],
  { env, stdio: "ignore" },
);
console.log("PROFILE", profile);
let browser, second;
const profileB = path.join(profile, "second");
try {
  let ready;
  for (let i = 0; !ready; i++) {
    try {
      ready = JSON.parse(
        await fs.readFile(path.join(profile, "ready.json"), "utf8"),
      );
    } catch {
      if (i > 600) throw Error("Host startup timeout");
      try {
        console.log(await fs.readFile(path.join(profile, "error.txt"), "utf8"));
        throw Error("Host failed");
      } catch (e) {
        if (e.message === "Host failed") throw e;
      }
      await pause(200);
    }
  }
  console.log("READY", ready);
  browser = await chromium.launch({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 1100, height: 900 },
  });
  page.setDefaultTimeout(20000);
  const pageErrors = [];
  page.on("pageerror", (e) => {
    pageErrors.push(e.message);
    console.log("PAGE ERROR", e.message);
  });
  page.on("console", (m) => {
    if (m.type() === "error") console.log("CONSOLE", m.text().slice(0, 800));
  });
  const browserAddress =
    ready.urls.find((u) => u.includes("192.168.")) ||
    `http://127.0.0.1:${lanPort}`;
  await page.goto(browserAddress);
  assert.equal(await page.evaluate(() => isSecureContext), false);
  await page.locator("select").selectOption(ready.windowId);
  await page
    .frameLocator("#view")
    .getByRole("textbox")
    .waitFor({ timeout: 30000 });
  await page.screenshot({ path: "reports/lan-initial.png", fullPage: true });
  let frame = page.frames().find((f) => f.url().includes("/frame/"));

  async function assertActionIcon(button) {
    await button.waitFor();
    const colors = await button.evaluate((el) => {
      const icon = el.querySelector("svg");
      if (!icon) throw Error("Composer action icon missing");
      return {
        foreground: getComputedStyle(icon).color,
        background: getComputedStyle(el).backgroundColor,
      };
    });
    assert.notEqual(
      colors.foreground,
      colors.background,
      "Action icon must contrast with button",
    );
    assert.notEqual(
      colors.foreground,
      "rgb(221, 221, 221)",
      "Icon must not inherit page text on light action button",
    );
  }
  assert(
    await frame.evaluate(() => {
      const rail = document.querySelector("._attached_1ugo6_36");
      const composer = rail?.nextElementSibling?.querySelector(
        "._ComposerLayoutRoot_73a71_2",
      );
      return (
        rail &&
        composer &&
        composer.getBoundingClientRect().top -
          rail.getBoundingClientRect().bottom >=
          7.5
      );
    }),
    "Local mode rail must have a clear gap above the composer",
  );
  let editor = frame.locator('[contenteditable="true"]').first();
  await editor.fill("Say hello for LAN acceptance");
  await assertActionIcon(
    frame.getByRole("button", { name: "Send", exact: true }),
  );
  await editor.press("Enter");
  await frame
    .getByText("LAN acceptance response.", { exact: true })
    .first()
    .waitFor({ timeout: 30000 });
  assert(
    requests.some((r) =>
      JSON.stringify(r).includes("Say hello for LAN acceptance"),
    ),
  );
  await page.screenshot({ path: "reports/lan-chat.png" });
  console.log("CHAT PASSED");
  // Mobile suspension/BFCache restores the same application and unsent draft.
  const mobileFrameSource = await page.locator("#view").getAttribute("src");
  await editor.fill("Unsent background draft");
  await frame.evaluate(() => { window.__backgroundIdentity = crypto.randomUUID(); });
  const backgroundIdentity = await frame.evaluate(() => window.__backgroundIdentity);
  for (let cycle = 0; cycle < 3; cycle++) {
    await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: true })));
    await frame.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: true })));
    await pause(150);
    await frame.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true })));
    await page.waitForFunction(() => document.querySelector("#status").textContent === "已连接");
    assert.equal(await page.locator("#view").getAttribute("src"), mobileFrameSource);
    assert.equal(await frame.evaluate(() => window.__backgroundIdentity), backgroundIdentity);
    assert.equal(await editor.innerText(), "Unsent background draft");
  }
  await editor.fill("");
  console.log("MOBILE LIFECYCLE, SAME FRAME AND UNSENT DRAFT PASSED");
  const previousReplies = await frame.getByText("LAN acceptance response.", { exact: true }).count();
  deferNextResponseMs = 1500;
  await editor.fill("Complete while browser is suspended");
  await editor.press("Enter");
  for (let attempt = 0; !requests.some(r => JSON.stringify(r).includes("Complete while browser is suspended")); attempt++) {
    if (attempt > 200) throw Error("Deferred model request was not admitted");
    await pause(50);
  }
  const requestsDuringSuspension = requests.length;
  await page.context().setOffline(true);
  await pause(3000);
  await page.context().setOffline(false);
  await frame.getByText("LAN acceptance response.", { exact: true }).nth(previousReplies).waitFor();
  await page.waitForFunction(() => document.querySelector("#status").textContent === "已连接");
  assert.equal(await page.locator("#view").getAttribute("src"), mobileFrameSource);
  assert.equal(await frame.evaluate(() => window.__backgroundIdentity), backgroundIdentity);
  assert.equal(requests.length, requestsDuringSuspension, "Missed completion must replay without resubmitting the turn");
  console.log("REAL ENGINE COMPLETION WHILE OFFLINE REPLAYED WITHOUT RELOAD PASSED");
  await protocolAcceptance(browser, browserAddress, ready.windowId, requests);
  // Rendering the first response can precede replacement of the optimistic
  // client route. Diff return must exercise a persisted conversation ID.
  await frame.waitForFunction((id) => {
    const route = sessionStorage.getItem("jimao-route-" + id);
    return route?.startsWith("/local/") && !route.includes("client-new-thread:");
  }, ready.windowId);
  const chatBeforeDiff = await frame.evaluate(
    (id) => sessionStorage.getItem("jimao-route-" + id),
    ready.windowId,
  );
  for (const width of [1100, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await frame.evaluate(
      (route) =>
        window.acquireVsCodeApi().postMessage({
          conversationId: route.split("/")[2],
          type: "show-diff",
          unifiedDiff:
            "diff --git a/test.txt b/test.txt\n--- a/test.txt\n+++ b/test.txt\n@@ -1 +1 @@\n-before\n+after\n",
          cwd: null,
        }),
      chatBeforeDiff,
    );
    const backToChat = frame.getByRole("button", {
      name: "← 返回聊天",
      exact: true,
    });
    await backToChat.waitFor();
    assert(
      (await frame.locator("body").innerText()).includes("test.txt"),
      "Diff content must render",
    );
    if (width === 390)
      await page.screenshot({ path: "reports/lan-diff-return-mobile.png" });
    await backToChat.click();
    await page.frameLocator("#view").getByRole("textbox").waitFor();
    frame = await (await page.locator("#view").elementHandle()).contentFrame();
    assert.equal(
      await frame.evaluate(
        (id) => sessionStorage.getItem("jimao-route-" + id),
        ready.windowId,
      ),
      chatBeforeDiff,
    );
    await frame
      .getByText("LAN acceptance response.", { exact: true })
      .first()
      .waitFor();
  }
  await page.setViewportSize({ width: 1100, height: 900 });
  editor = frame.locator('[contenteditable="true"]').first();
  console.log("DIFF RETURN PASSED");
  await frame
    .getByRole("button", { name: "Add files and more", exact: true })
    .click();
  const chooser = page.waitForEvent("filechooser");
  await frame.getByText("Files and folders", { exact: true }).click();
  await (
    await chooser
  ).setFiles({
    name: "lan-test.png",
    mimeType: "image/png",
    buffer: await page.screenshot({
      clip: { x: 0, y: 0, width: 32, height: 32 },
    }),
  });
  await pause(1000);

  await editor.fill("Describe this image");
  await editor.press("Enter");
  await pause(4000);
  assert(requests.some((r) => JSON.stringify(r).includes("input_image")));
  console.log("IMAGE PASSED");
  await frame.evaluate(async () => {
    const script = document.querySelector('script[src*="assets/index-"]');
    window.manager = await import(
      new URL("./chat-manager-store.js", script.src)
    );
    window.notifications = [];
    window.addEventListener("message", (e) => {
      if (e.data?.type === "mcp-notification")
        window.notifications.push(e.data);
    });
  });
  // Confirm full-history search and shared host metadata over the real bridge.
  await frame.evaluate(() =>
    window.dispatchEvent(new CustomEvent("open-recent-tasks-menu")),
  );
  await frame.getByRole("region", { name: "聊天搜索", exact: true }).waitFor();
  await frame.locator("[data-result-id]").first().waitFor();
  assert.equal(
    await frame.getByRole("button", { name: /Archive chat|归档聊天/ }).count(),
    0,
    "History list must omit archive actions",
  );
  const hoveredRow = frame.locator(".cm-original-row > [role=button]").first();
  await hoveredRow.hover();
  assert(
    await hoveredRow.locator("time").isVisible(),
    "History timestamp must remain visible on hover when no replacement actions exist",
  );
  await hoveredRow.focus();
  assert(
    await hoveredRow.locator("time").isVisible(),
    "History timestamp must remain visible with keyboard focus",
  );
  assert.equal(
    await hoveredRow.evaluate((el) => getComputedStyle(el).backgroundColor),
    "rgb(42, 45, 46)",
    "History hover must use the dark list highlight",
  );
  await page.screenshot({ path: "reports/lan-history-hover.png" });
  const threadId = await frame
    .locator("[data-result-id]")
    .first()
    .getAttribute("data-result-id");
  await frame
    .getByRole("button", { name: "编辑标签", exact: true })
    .first()
    .click();
  await frame.getByLabel("标签（用逗号分隔）").fill("LAN验收");
  await frame.getByRole("button", { name: "保存", exact: true }).click();
  await frame
    .getByLabel("聊天搜索结果")
    .getByText("LAN验收", { exact: true })
    .waitFor();
  await frame
    .getByRole("button", { name: "重命名聊天", exact: true })
    .first()
    .click();
  await frame
    .getByLabel("聊天名称", { exact: true })
    .last()
    .fill("LAN renamed");
  await frame.getByRole("button", { name: "保存", exact: true }).click();
  await frame.getByText("LAN renamed", { exact: true }).first().waitFor();
  const read = await frame.evaluate(
    (id) =>
      window.manager.nativeRequest("thread/read", {
        threadId: id,
        includeTurns: false,
      }),
    threadId,
  );
  assert.equal(read.thread.name, "LAN renamed");
  await frame
    .getByRole("button", { name: "关闭搜索面板", exact: true })
    .click();
  console.log("HISTORY TAGS RENAME PASSED");
  await page.waitForURL(/\/c\/[A-Za-z0-9]{12}$/);
  const sharedURL = page.url();
  async function assertDirectLink(expectedWindow, fallback = false) {
    const context = await browser.newContext({
      viewport: { width: 1100, height: 900 },
    });
    await context.addInitScript(
      ({ id }) => {
        if (!sessionStorage.getItem("jimao-test-seeded")) {
          sessionStorage.setItem("jimao-test-seeded", "true");
          sessionStorage.setItem("jimao-window", "old-unrelated-window");
          sessionStorage.setItem(
            "jimao-route-" + id,
            "/local/nonexistent-stale-chat",
          );
        }
      },
      { id: expectedWindow },
    );
    const direct = await context.newPage(),
      connections = [];
    direct.on("request", (req) => {
      if (new URL(req.url()).pathname === "/connect")
        connections.push(req.postDataJSON());
    });
    const before = requests.length;
    await direct.goto(sharedURL);
    const chat = direct.frameLocator("#view");
    await chat.getByRole("textbox").waitFor({ timeout: 30000 });
    const child = direct.frames().find((f) => f.url().includes("/frame/"));
    assert.equal(
      await child.locator('meta[name="initial-route"]').getAttribute("content"),
      "/local/" + threadId,
    );
    await chat
      .getByText("Say hello for LAN acceptance", { exact: true })
      .first()
      .waitFor();
    assert.equal(await direct.locator("#windows").inputValue(), expectedWindow);
    assert.deepEqual(
      connections,
      [{ code: sharedURL.split("/").at(-1) }],
      "First connection must already resolve the shared conversation",
    );
    assert.equal(
      requests.length,
      before,
      "Opening a shared link cannot send a model request",
    );
    if (fallback)
      await direct.getByText("原窗口已关闭，已通过可用工作区打开").waitFor();
    await direct
      .getByRole("button", { name: "复制会话链接", exact: true })
      .click();
    await direct.waitForFunction(
      () => document.querySelector("#status").textContent === "会话链接已复制",
    );
    assert.equal(await direct.locator("#manual-copy").isVisible(), false);
    for (const width of [320, 390, 1100]) {
      await direct.setViewportSize({ width, height: 900 });
      assert(
        await direct.evaluate(() => {
          const button = document
            .querySelector("#share")
            .getBoundingClientRect();
          const selector = document
            .querySelector("#windows")
            .getBoundingClientRect();
          const status = document
            .querySelector("#status")
            .getBoundingClientRect();
          return (
            document.documentElement.scrollWidth <= innerWidth &&
            selector.right <= button.left &&
            button.right <= status.left
          );
        }),
        "Shared-link header must stay on one line without overlap",
      );
    }
    await direct.screenshot({
      path: fallback
        ? "reports/lan-shared-fallback.png"
        : "reports/lan-shared-direct.png",
    });
    await direct.reload();
    await direct.frameLocator("#view").getByRole("textbox").waitFor();
    assert.equal(direct.url(), sharedURL);
    await direct
      .frameLocator("#view")
      .getByRole("button", { name: /^(Back|返回)$/ })
      .click();
    await direct.waitForURL((url) => url.pathname === "/");
    await direct.goBack();
    await direct
      .frameLocator("#view")
      .getByText("Say hello for LAN acceptance", { exact: true })
      .first()
      .waitFor();
    assert.equal(direct.url(), sharedURL);
    await direct.goForward();
    await direct.waitForURL((url) => url.pathname === "/");
    await direct
      .frameLocator("#view")
      .getByText("LAN renamed", { exact: true })
      .first()
      .waitFor();
    await direct.goto(browserAddress + "/c/222222222222");
    await direct.getByText("会话链接不存在或已失效", { exact: true }).waitFor();
    assert.equal(await direct.locator("iframe#view").count(), 0);
    await direct.getByRole("button", { name: "重试", exact: true }).click();
    await direct.getByText("会话链接不存在或已失效", { exact: true }).waitFor();
    await context.close();
  }
  await assertDirectLink(ready.windowId);
  console.log(
    "DIRECT LINK, STALE STORAGE PRIORITY, REFRESH, HISTORY AND INVALID LINK PASSED",
  );

  nextTool = true;
  await editor.fill("Run confirmation test");
  await editor.press("Enter");
  await frame
    .getByRole("button", { name: /Allow once/ })
    .waitFor({ timeout: 30000 });
  const approvalFrameSource = await page.locator("#view").getAttribute("src");
  await page.context().setOffline(true);
  await pause(500);
  await page.context().setOffline(false);
  await page.waitForFunction(() => document.querySelector("#status").textContent === "已连接");
  assert.equal(await page.locator("#view").getAttribute("src"), approvalFrameSource);
  await page.screenshot({ path: "reports/lan-approval.png" });
  await frame.getByRole("button", { name: /Allow once/ }).click();
  await frame.getByRole("textbox").waitFor();
  for (
    let i = 0;
    i < 100 &&
    !requests.some(
      (r) =>
        JSON.stringify(r).includes("lan-approved") &&
        JSON.stringify(r).includes("function_call_output"),
    );
    i++
  )
    await pause(100);
  assert(
    requests.some(
      (r) =>
        JSON.stringify(r).includes("lan-approved") &&
        JSON.stringify(r).includes("function_call_output"),
    ),
  );
  console.log("APPROVAL AND TOOL PASSED");
  hold = true;
  await editor.fill("Wait until I stop this task");
  await editor.press("Enter");
  await frame
    .getByRole("button", { name: /Stop|停止/ })
    .first()
    .waitFor({ timeout: 15000 });
  await assertActionIcon(
    frame.getByRole("button", { name: /Stop|停止/ }).first(),
  );
  await page.screenshot({ path: "reports/lan-stop-icon.png" });
  // A transport outage must preserve the running turn and never resubmit it.
  for (
    let i = 0;
    i < 200 &&
    !requests.some((r) =>
      JSON.stringify(r).includes("Wait until I stop this task"),
    );
    i++
  )
    await pause(100);
  assert(
    requests.some((r) =>
      JSON.stringify(r).includes("Wait until I stop this task"),
    ),
    "The engine must be sampling before disconnect",
  );
  const requestsBeforeReconnect = requests.length;
  const oldFrameSource = await page.locator("#view").getAttribute("src");
  console.log("OUTAGE START");
  await page.context().setOffline(true);
  await pause(23000);
  await page.context().setOffline(false);
  console.log("OUTAGE ENDED");
  await page.waitForFunction(() => document.querySelector("#status").textContent === "已连接", null, { timeout: 30000 });
  assert.equal(await page.locator("#view").getAttribute("src"), oldFrameSource, "Transport recovery must preserve the live application");
  console.log("SAME CLIENT RESUMED");
  await frame
    .getByRole("button", { name: /Stop|停止/ })
    .first()
    .waitFor({ timeout: 30000 });
  assert.equal(
    requests.length,
    requestsBeforeReconnect,
    "Reconnect must not submit another model request",
  );
  await frame.evaluate(() => {
    window.notifications = [];
    window.addEventListener("message", (e) => {
      if (e.data?.type === "mcp-notification")
        window.notifications.push(e.data);
    });
  });
  await frame
    .getByRole("button", { name: /Stop|停止/ })
    .first()
    .click();
  await frame.waitForFunction(() =>
    window.notifications.some(
      (e) =>
        e.method === "turn/completed" && e.params.turn.status === "interrupted",
    ),
  );
  hold = false;
  console.log("STOP PASSED");
  await page.reload();
  await page
    .frameLocator("#view")
    .getByRole("textbox")
    .waitFor({ timeout: 30000 });
  await page
    .frameLocator("#view")
    .getByText("LAN renamed", { exact: true })
    .first()
    .waitFor({ timeout: 15000 });
  console.log("RECONNECT PASSED");
  // A second real VS Code host joins the same per-user gateway.
  await fs.mkdir(path.join(profileB, "user-data/User"), { recursive: true });
  await fs.mkdir(path.join(profileB, "workspace-b"), { recursive: true });
  await fs.copyFile(
    path.join(profile, "user-data/User/settings.json"),
    path.join(profileB, "user-data/User/settings.json"),
  );
  second = spawn(
    "code",
    [
      path.join(profileB, "workspace-b"),
      "--new-window",
      "--skip-welcome",
      "--skip-release-notes",
      "--disable-extensions",
      "--user-data-dir",
      path.join(profileB, "user-data"),
      "--extensions-dir",
      path.join(profileB, "extensions"),
      "--extensionDevelopmentPath",
      path.join(root, "build/extension"),
      "--extensionTestsPath",
      path.join(root, "test/lan-host.cjs"),
      "--enable-proposed-api",
      "openai.chatgpt",
    ],
    {
      env: { ...env, JIMAO_LAN_ACCEPTANCE: profileB, JIMAO_LAN_AUTO_JOIN: "1" },
      stdio: "ignore",
    },
  );
  let readyB;
  for (let i = 0; !readyB; i++) {
    try {
      readyB = JSON.parse(
        await fs.readFile(path.join(profileB, "ready.json"), "utf8"),
      );
    } catch {
      if (i > 300) throw Error("Second host timeout");
      await pause(100);
    }
  }
  assert.equal(new URL(readyB.urls[0]).port, String(lanPort));
  await page
    .locator('select option[value="' + readyB.windowId + '"]')
    .waitFor({ state: "attached" });
  const frameA = page.frames().find((f) => f.url().includes("/frame/"));
  await frameA.getByRole("textbox").fill("Unsent draft for A");
  await page.locator("select").selectOption(readyB.windowId);
  await page
    .frameLocator("#view")
    .getByRole("textbox")
    .waitFor({ timeout: 30000 });
  await page
    .frameLocator("#view")
    .getByRole("textbox")
    .fill("Unsent draft for B");
  await page.locator("select").selectOption(ready.windowId);
  assert.equal(
    await page.frameLocator("#view").getByRole("textbox").innerText(),
    "Unsent draft for A",
  );
  await page.locator("select").selectOption(readyB.windowId);
  assert.equal(
    await page.frameLocator("#view").getByRole("textbox").innerText(),
    "Unsent draft for B",
  );
  await assertDirectLink(ready.windowId);
  await fs.writeFile(path.join(profile, "finish"), "");
  for (let i = 0; i < 100; i++) {
    const list = await fetch(`http://127.0.0.1:${lanPort}/windows`).then((r) =>
      r.json(),
    );
    if (list.length === 1 && list[0].id === readyB.windowId) break;
    await pause(100);
  }
  const list = await fetch(`http://127.0.0.1:${lanPort}/windows`).then((r) =>
    r.json(),
  );
  assert.equal(list.length, 1);
  assert.equal(list[0].id, readyB.windowId);
  await assertDirectLink(readyB.windowId, true);
  console.log("SHARED LINK FALLBACK TO SECOND REAL HOST PASSED");
  const frameB = page
    .frames()
    .find((f) => f.url().includes("/frame/") && f !== frameA);
  await frameB.getByRole("textbox").fill("Second window stays online");
  await frameB.getByRole("textbox").press("Enter");
  await frameB
    .getByText("LAN acceptance response.", { exact: true })
    .first()
    .waitFor({ timeout: 30000 });
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobile.newPage();
  await mobilePage.goto(browserAddress);
  await mobilePage.locator("select").selectOption(readyB.windowId);
  const mobileInput = mobilePage.frameLocator("#view").getByRole("textbox");
  await mobileInput.waitFor();
  await mobileInput.tap();
  assert(
    await mobileInput.evaluate(
      (el) => parseFloat(getComputedStyle(el).fontSize) >= 16,
    ),
  );
  for (const surface of [
    mobilePage,
    mobilePage.frames().find((f) => f.url().includes("/frame/")),
  ]) {
    assert(
      await surface.evaluate(() => {
        const viewport =
          document.querySelector('meta[name="viewport"]')?.content || "";
        const gesture = new Event("gesturestart", {
          bubbles: true,
          cancelable: true,
        });
        document.dispatchEvent(gesture);
        const touch = new Event("touchmove", {
          bubbles: true,
          cancelable: true,
        });
        Object.defineProperty(touch, "touches", { value: [{}, {}] });
        document.dispatchEvent(touch);
        const doubleTap = new MouseEvent("dblclick", {
          bubbles: true,
          cancelable: true,
        });
        document.dispatchEvent(doubleTap);
        return (
          viewport.includes("maximum-scale=1") &&
          viewport.includes("user-scalable=no") &&
          getComputedStyle(document.documentElement).touchAction ===
            "pan-x pan-y" &&
          gesture.defaultPrevented &&
          touch.defaultPrevented &&
          doubleTap.defaultPrevented
        );
      }),
    );
  }
  for (const surface of [
    mobilePage,
    mobilePage.frames().find((f) => f.url().includes("/frame/")),
  ]) {
    assert(
      await surface.evaluate(() =>
        [document.documentElement, document.body].every((el) => {
          const style = getComputedStyle(el);
          return (
            style.overflowY === "hidden" && style.overscrollBehaviorY === "none"
          );
        }),
      ),
      "Both LAN documents must isolate scrolling from the browser viewport",
    );
    assert.equal(await surface.evaluate(() => scrollY), 0);
  }
  assert.equal(await mobilePage.evaluate(() => visualViewport.scale), 1);
  await mobilePage.screenshot({
    path: "reports/lan-mobile-fixed-viewport.png",
  });
  await mobilePage
    .frameLocator("#view")
    .getByText("LAN renamed", { exact: true })
    .first()
    .click();
  // A restored initial-route used to send chatgpt.newCodexPanel to the desktop.
  // Exercise both widths after refresh; a fresh browser context misses that branch.
  for (const width of [1100, 390]) {
    await mobilePage.setViewportSize({ width, height: 844 });
    if (width === 390)
      await mobilePage
        .frameLocator("#view")
        .getByText("LAN renamed", { exact: true })
        .first()
        .click();
    const beforeReload = mobilePage
      .frames()
      .find((f) => f.url().includes("/frame/"));
    await beforeReload.waitForFunction(
      (id) =>
        sessionStorage.getItem("jimao-route-" + id)?.startsWith("/local/"),
      readyB.windowId,
    );
    await mobilePage.waitForURL(/\/c\/[A-Za-z0-9]{12}$/);
    await mobilePage.reload();
    const restored = mobilePage.frameLocator("#view");
    await restored.getByRole("textbox").waitFor();
    const restoredFrame = mobilePage
      .frames()
      .find((f) => f.url().includes("/frame/"));
    assert.match(
      await restoredFrame
        .locator('meta[name="initial-route"]')
        .getAttribute("content"),
      /^\/local\//,
    );
    await restoredFrame.evaluate(() => {
      window.__newChatDesktopCommands = [];
      const original = window.fetch;
      window.fetch = function (url, options) {
        if (String(url).startsWith("/message/") && options?.body) {
          const message = JSON.parse(options.body);
          if (message.type === "open-vscode-command")
            window.__newChatDesktopCommands.push(message.command);
        }
        return original.apply(this, arguments);
      };
    });
    const back = restored.getByRole("button", { name: /^(Back|返回)$/ });
    await back.waitFor();
    if (width === 390)
      await mobilePage.screenshot({
        path: "reports/lan-mobile-back-button.png",
      });
    await back.tap();
    await restoredFrame.waitForFunction(
      (id) => sessionStorage.getItem("jimao-route-" + id) === "/",
      readyB.windowId,
    );
    await restored.getByText("LAN renamed", { exact: true }).first().waitFor();
    if (width === 1100) {
      const homeRow = restored
        .locator(".cm-original-row")
        .filter({ hasText: "LAN renamed" })
        .first();
      await homeRow.hover();
      assert(
        await homeRow.locator("time").isVisible(),
        "Home list timestamp must remain visible on hover",
      );
    }
    assert.equal(
      await back.count(),
      0,
      "Home list must not show a return button",
    );
    if (width === 390)
      await mobilePage.screenshot({ path: "reports/lan-mobile-back-home.png" });
    await restored.getByText("LAN renamed", { exact: true }).first().click();
    await restoredFrame.waitForFunction(
      (id) =>
        sessionStorage.getItem("jimao-route-" + id)?.startsWith("/local/"),
      readyB.windowId,
    );
    await restored
      .getByRole("button", { name: /New chat|新建聊天|新聊天/ })
      .first()
      .tap();
    await restoredFrame.waitForFunction(
      (id) => sessionStorage.getItem("jimao-route-" + id) === "/",
      readyB.windowId,
    );
    assert.deepEqual(
      await restoredFrame.evaluate(() => window.__newChatDesktopCommands),
      [],
    );
  }
  await mobileInput.waitFor();
  await mobileInput.fill("New chat created from mobile");
  await mobilePage
    .frameLocator("#view")
    .getByRole("button", { name: "Send", exact: true })
    .tap();
  await mobilePage
    .frameLocator("#view")
    .getByText("LAN acceptance response.", { exact: true })
    .first()
    .waitFor();
  assert(
    await mobilePage
      .frameLocator("#view")
      .getByText("New chat created from mobile", { exact: true })
      .first()
      .isVisible(),
  );
  const mobileFrame = mobilePage
    .frames()
    .find((f) => f.url().includes("/frame/"));
  await mobileInput.blur();
  await mobileFrame.evaluate(() =>
    window.dispatchEvent(new CustomEvent("open-recent-tasks-menu")),
  );
  const mobilePanel = mobileFrame.getByRole("region", {
    name: "聊天搜索",
    exact: true,
  });
  await mobilePanel.waitFor();
  assert.match(
    await mobilePanel.locator(".cm-page-info").getAttribute("aria-label"),
    /每页 5 条/,
  );
  assert(
    await mobileFrame.evaluate(
      () => !document.activeElement?.matches("input,textarea"),
    ),
    "Opening history must not summon mobile keyboard",
  );
  for (const height of [844, 430]) {
    await mobilePage.setViewportSize({ width: 390, height });
    await mobilePage.waitForFunction(
      (expected) =>
        Math.abs(document.body.getBoundingClientRect().height - expected) < 1,
      height,
    );
    await mobilePanel.getByLabel("聊天名称", { exact: true }).tap();
    await mobilePanel.getByLabel("聊天名称", { exact: true }).fill("LAN");
    assert(
      await mobilePanel.evaluate((panel) => {
        const rect = panel.getBoundingClientRect();
        return (
          rect.left >= 0 &&
          rect.right <= innerWidth &&
          rect.bottom <= innerHeight &&
          panel.scrollWidth <= panel.clientWidth + 1
        );
      }),
      "History dialog must stay inside mobile viewport, including keyboard height",
    );
    assert.equal(await mobilePage.evaluate(() => scrollY), 0);
    assert.equal(await mobileFrame.evaluate(() => scrollY), 0);
    const composerBounds = await mobileFrame
      .locator("[data-codex-composer=true]")
      .boundingBox();
    assert(
      composerBounds.y + composerBounds.height <= height + 1,
      "Composer stays inside resized visible viewport",
    );
    assert.equal(await mobilePage.evaluate(() => visualViewport.scale), 1);
  }
  await mobilePage.screenshot({ path: "reports/lan-mobile-history.png" });
  await mobilePanel.getByRole("button", { name: "关闭搜索面板" }).click();
  await mobile.close();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForFunction(() =>
    document
      .querySelector("#windows")
      .selectedOptions[0].textContent.endsWith("workspace-b"),
  );
  assert(
    (await page.locator("#windows").getAttribute("title")).includes(
      path.join(profileB, "workspace-b"),
    ),
    "Selector title retains full path",
  );

  await page.waitForFunction(
    () =>
      !/此会话来源|会话链接暂不可用/.test(
        document.querySelector("#status").textContent,
      ),
  );
  await page.screenshot({ path: "reports/lan-mobile.png" });
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  // More than eight real history entries must not push the H5 composer off screen.
  await frameB.evaluate(async () => {
    const script = document.querySelector('script[src*="assets/index-"]');
    const manager = await import(
      new URL("./chat-manager-store.js", script.src)
    );
    for (let i = 0; i < 12; i++) {
      const result = await manager.nativeRequest("thread/start", {
        historyMode: "paginated",
        ephemeral: false,
        approvalPolicy: "never",
        sandbox: "read-only",
      });
      await manager.nativeRequest("turn/start", {
        threadId: result.thread.id,
        input: [{ type: "text", text: "Home viewport fixture " + i }],
      });
      // Admission precedes durable history and projection indexing. An
      // unindexed new rollout temporarily reports list_turns as unsupported.
      for (let attempt = 0; ; attempt++) {
        try {
          const turns = await manager.nativeRequest("thread/turns/list", { threadId: result.thread.id, limit: 1, sortDirection: "desc", itemsView: "summary" });
          if (turns.data[0]?.status === "completed") break;
        } catch (error) {
          if (!/list_turns is not supported yet/.test(error.message)) throw error;
        }
        if (attempt > 300) throw Error("Home fixture turn did not complete and index");
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      await manager.nativeRequest("thread/name/set", {
        threadId: result.thread.id,
        name: "Home viewport fixture " + i,
      });
    }
  });
  const homeContext = await browser.newContext({
    viewport: { width: 390, height: 740 },
    isMobile: true,
    hasTouch: true,
  });
  try {
    const homePage = await homeContext.newPage();
    await homePage.goto(browserAddress);
    await homePage.locator("select").selectOption(readyB.windowId);
    const home = homePage.frameLocator("#view");
    await home.getByRole("textbox").waitFor();
    await home.locator(".cm-original-row").nth(7).waitFor();
    assert.equal(
      await home.locator(".cm-original-row").count(),
      8,
      "H5 home must show exactly eight rows when history exceeds eight",
    );
    await home.getByRole("textbox").fill("Unsent viewport acceptance draft");
    const send = home.getByRole("button", { name: "Send", exact: true });
    await send.waitFor();
    const bounds = await send.boundingBox();
    assert(
      bounds.y >= 0 && bounds.y + bounds.height <= 740,
      "H5 home send button must remain fully visible",
    );
    await homePage.screenshot({ path: "reports/lan-home-eight.png" });
    for (const action of ["back", "new"]) {
      await home.locator(".cm-original-row > [role=button]").first().tap();
      await home.getByRole("button", { name: /^(Back|返回)$/ }).waitFor();
      await home
        .getByRole("button", {
          name:
            action === "back" ? /^(Back|返回)$/ : /New chat|新建聊天|新聊天/,
        })
        .tap();
      await home.locator("[data-jimao-home-header]").waitFor();
      const editor = home.getByRole("textbox");
      assert(
        await editor.evaluate((el) => el.contains(document.activeElement)),
        "Returning home must preserve automatic composer focus",
      );
      for (const height of [430, 320, 740]) {
        await homePage.setViewportSize({ width: 390, height });
        await editor.fill("Unsent keyboard viewport draft");
        await homePage.waitForFunction(
          () =>
            Math.abs(
              document.body.getBoundingClientRect().height -
                visualViewport.height,
            ) < 1,
        );
        const composer = await home
          .locator("[data-codex-composer=true]")
          .boundingBox();
        const button = await home
          .getByRole("button", { name: "Send", exact: true })
          .boundingBox();
        assert(
          composer.y >= 0 && composer.y + composer.height <= height + 1,
          "Home composer must remain inside keyboard-reduced viewport after " +
            action,
        );
        assert(
          button.y + button.height <= height + 1,
          "Home send button must remain above keyboard after " + action,
        );
        assert(
          await editor.evaluate((el) => el.contains(document.activeElement)),
        );
        if (height === 430) {
          const list = home.locator("[data-jimao-home-header] > :last-child");
          assert(
            await list.evaluate((el) => el.scrollHeight > el.clientHeight),
            "Home history must yield height to the composer",
          );
          await list.evaluate((el) => {
            el.scrollTop = el.scrollHeight;
          });
          assert(await list.evaluate((el) => el.scrollTop > 0));
          await homePage.screenshot({
            path: `reports/lan-home-keyboard-${action}.png`,
          });
        }
      }
    }
  } finally {
    await homeContext.close();
  }
  console.log(
    "TWO REAL HOSTS, WINDOW SWITCH, DRAFT ISOLATION, OWNER CLOSE AND MOBILE PASSED",
  );
  assert.deepEqual(pageErrors, [], "Browser must not report unhandled errors");
  await fs.writeFile(
    "reports/lan-acceptance.json",
    JSON.stringify({
      passed: true,
      checks: [
        "real browser and VS Code bridge",
        "chat and response",
        "image reaches model",
        "history, rename, tags",
        "stop interrupts engine",
        "reconnect during active sampling without resubmitting",
        "approval and tool execution",
        "two real VS Code hosts",
        "12-character durable conversation URLs",
        "first connection resolves host and initial conversation without homepage navigation",
        "explicit URL overrides stale browser storage",
        "shared-link refresh and browser Back/Forward",
        "original host preference and fallback after owner closes",
        "invalid link error and retry without opening another conversation",
        "window switch and drafts",
        "owner close preserves second window",
        "mobile layout and fixed viewport gestures/input focus",
        "H5 home capped at eight conversations with visible composer",
        "home automatic focus after Back/New keeps composer visible in keyboard-reduced viewport",
      ],
      requests: requests.length,
    }),
  );
  await page.screenshot({ path: "reports/lan-attach-menu.png" });

  await fs.writeFile(
    "reports/lan-acceptance-profile.json",
    JSON.stringify({ profile, ready }),
  );
  if (process.env.JIMAO_INSPECT) await pause(180000);
} catch (error) {
  console.error("ACCEPTANCE", error.message, "REQUESTS", requests.length);
  if (browser) {
    const p = browser.contexts()[0]?.pages()[0];
    for (const extra of browser
      .contexts()
      .flatMap((c) => c.pages())
      .filter((p) => p !== browser.contexts()[0]?.pages()[0])) {
      console.log(
        "EXTRA FAIL",
        await extra
          .frameLocator("#view")
          .locator("body")
          .innerText()
          .catch(() => ""),
      );
      await extra.screenshot({
        path: "reports/lan-mobile-new-chat-failed.png",
      });
    }
    console.log(
      "FAIL TEXT",
      await p
        ?.frameLocator("#view")
        .locator("body")
        .innerText()
        .catch(() => ""),
    );
    await p?.screenshot({ path: "reports/lan-failed.png" });
  }
  throw error;
} finally {
  await browser?.close();
  await fs.writeFile(path.join(profile, "finish"), "");
  mock.closeAllConnections();
  mock.close();
  code.unref();
  if (second) {
    await fs.writeFile(path.join(profileB, "finish"), "");
    second.unref();
  }
}
