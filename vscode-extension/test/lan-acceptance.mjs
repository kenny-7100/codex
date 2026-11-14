import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import { spawn } from "node:child_process";
import { chromium } from "@playwright/test";
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
  nextTool = false;
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
  const pageErrors=[];
  page.on("pageerror", (e) => {pageErrors.push(e.message);console.log("PAGE ERROR", e.message);});
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

  const editor = frame.locator('[contenteditable="true"]').first();
  await editor.fill("Say hello for LAN acceptance");
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
  nextTool = true;
  await editor.fill("Run confirmation test");
  await editor.press("Enter");
  await frame
    .getByRole("button", { name: /Allow once/ })
    .waitFor({ timeout: 30000 });
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
  await pause(500);
  await page.context().setOffline(false);
  console.log("OUTAGE ENDED");
  await page.waitForFunction(
    (old) => document.querySelector("#view")?.getAttribute("src") !== old,
    oldFrameSource,
    { timeout: 30000 },
  );
  console.log("CLIENT REPLACED");
  frame = await (await page.locator("#view").elementHandle()).contentFrame();
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
    { env: { ...env, JIMAO_LAN_ACCEPTANCE: profileB }, stdio: "ignore" },
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
  const frameB = page
    .frames()
    .find((f) => f.url().includes("/frame/") && f !== frameA);
  await frameB.getByRole("textbox").fill("Second window stays online");
  await frameB.getByRole("textbox").press("Enter");
  await frameB
    .getByText("LAN acceptance response.", { exact: true })
    .first()
    .waitFor({ timeout: 30000 });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "reports/lan-mobile.png" });
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  console.log(
    "TWO REAL HOSTS, WINDOW SWITCH, DRAFT ISOLATION, OWNER CLOSE AND MOBILE PASSED",
  );
  assert.deepEqual(pageErrors,[],"Browser must not report unhandled errors");
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
        "window switch and drafts",
        "owner close preserves second window",
        "mobile layout",
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
