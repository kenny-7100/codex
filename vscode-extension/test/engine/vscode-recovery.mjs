// Integration test: real Code host + original Webview bridge + custom native engine.
// All sessions, settings and requests belong to a disposable profile and local mock.
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import { spawn } from "node:child_process";
import { root, json, writeJSON } from "../../scripts/common.mjs";

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const profile = await fs.mkdtemp(
  path.join(
    process.env.TMPDIR || "/Volumes/kenny/codex-build/tmp",
    "vscode-recovery-",
  ),
);
let failures = 1;
const requests = [];
const mock = http.createServer(async (req, res) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  requests.push(JSON.parse(Buffer.concat(chunks)));
  if (failures-- > 0) {
    res.writeHead(403, { "content-type": "text/html" });
    res.end("<html>Cloudflare challenge</html>");
    return;
  }
  const message = {
    id: "msg_recovered",
    type: "message",
    role: "assistant",
    status: "completed",
    content: [{ type: "output_text", text: "Recovered successfully." }],
  };
  res.writeHead(200, { "content-type": "text/event-stream" });
  for (const [type, value] of [
    ["response.created", { response: { id: "resp_recovered" } }],
    ["response.output_item.done", { output_index: 0, item: message }],
    [
      "response.completed",
      {
        response: {
          id: "resp_recovered",
          status: "completed",
          output: [message],
          usage: { input_tokens: 1, output_tokens: 1, total_tokens: 2 },
        },
      },
    ],
  ])
    res.write(
      `event: ${type}\ndata: ${JSON.stringify({ type, ...value })}\n\n`,
    );
  res.end();
});
await new Promise((resolve) => mock.listen(0, "127.0.0.1", resolve));
const ready = path.join(root, "reports/vscode-acceptance-ready.json");
const finished = path.join(root, "reports/vscode-acceptance-finished.json");
await fs.rm(ready, { force: true });
await fs.rm(finished, { force: true });
await writeJSON(path.join(profile, "user-data/User/settings.json"), {
  "telemetry.telemetryLevel": "off",
  "update.mode": "none",
  "extensions.autoUpdate": false,
  "workbench.startupEditor": "none",
  "security.workspace.trust.enabled": false,
});
await fs.mkdir(path.join(profile, "codex"), { recursive: true });
await fs.writeFile(
  path.join(profile, "codex/config.toml"),
  `model_provider="probe"
model="gpt-5.1-codex"
[features]
unbounded_connection_retries=false
[model_providers.probe]
name="Local recovery acceptance"
base_url="http://127.0.0.1:${mock.address().port}/v1"
wire_api="responses"
requires_openai_auth=false
supports_websockets=false
request_max_retries=0
stream_max_retries=0
stream_idle_timeout_ms=1500
`,
);
const env = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => !/proxy/i.test(key)),
);
env.CODEX_HOME = path.join(profile, "codex");
env.NO_PROXY = "127.0.0.1,localhost";
const code = spawn(
  "code",
  [
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
    path.join(root, "test/vscode-acceptance.cjs"),
    "--enable-proposed-api",
    "openai.chatgpt",
    "--remote-debugging-port=9349",
    "--disable-background-timer-throttling",
    "--disable-renderer-backgrounding",
    "--disable-backgrounding-occluded-windows",
  ],
  { env, stdio: "ignore" },
);
code.on("error", (error) => console.error(error));
let ws;
try {
  for (let i = 0; ; i++) {
    try {
      assert((await json(ready)).activated);
      break;
    } catch (error) {
      if (i > 900) throw error;
      await pause(100);
    }
  }
  let target;
  for (let i = 0; !target; i++) {
    const targets = await (
      await fetch("http://127.0.0.1:9349/json/list")
    ).json();
    target = targets.find((t) => t.type === "iframe");
    if (i > 300) throw Error("Webview did not open");
    if (!target) await pause(100);
  }
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve) => (ws.onopen = resolve));
  let serial = 0;
  const contexts = [];
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.method === "Runtime.executionContextCreated")
      contexts.push(message.params.context);
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++serial;
      const timer = setTimeout(
        () => reject(Error(`${method} timed out`)),
        45000,
      );
      ws.addEventListener("message", function handler(event) {
        const message = JSON.parse(event.data);
        if (message.id !== id) return;
        clearTimeout(timer);
        ws.removeEventListener("message", handler);
        message.error
          ? reject(Error(message.error.message))
          : resolve(message.result);
      });
      ws.send(JSON.stringify({ id, method, params }));
    });
  await send("Runtime.enable");
  await send("Emulation.setFocusEmulationEnabled", { enabled: true });
  let context;
  for (let i = 0; !context && i < 300; i++) {
    for (const candidate of contexts.filter((c) => c.auxData?.isDefault)) {
      const result = await send("Runtime.evaluate", {
        contextId: candidate.id,
        expression: `!!document.querySelector('script[src*="assets/index-"]')`,
        returnByValue: true,
      });
      if (result.result?.value) {
        context = candidate;
        break;
      }
    }
    if (!context) await pause(100);
  }
  assert(
    context,
    `Webview content context must exist: ${JSON.stringify(contexts)}`,
  );
  const evaluate = async (body) => {
    const result = await send("Runtime.evaluate", {
      contextId: context.id,
      expression: `(async()=>{const d=document,w=window;${body}})()`,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails)
      throw Error(
        result.exceptionDetails.exception?.description ||
          result.exceptionDetails.text,
      );
    return result.result.value;
  };
  const until = async (body, seconds = 30) => {
    for (let i = 0; i < seconds * 10; i++) {
      const value = await evaluate(body);
      if (value) return value;
      await pause(100);
    }
    throw Error(
      `Webview assertion timed out: ${body}\nBody: ${await evaluate("return d.body.innerText.slice(0,3000);")}`,
    );
  };
  await until(
    `if(d.body.innerText.includes('Decide how much autonomy'))[...d.querySelectorAll('button')].find(b=>b.innerText==='Continue')?.click();if(!d.querySelector('[aria-label="聊天搜索"]'))w.dispatchEvent(new CustomEvent('open-recent-tasks-menu'));return !!d.querySelector('[aria-label="聊天搜索"]');`,
  );
  await evaluate(
    `w.__manager=await import(new URL('./chat-manager-store.js',d.querySelector('script[src]').src).href);w.__notifications=[];w.addEventListener('message',e=>{if(e.data?.type==='mcp-notification')w.__notifications.push(e.data);});const r=await w.__manager.nativeRequest('thread/start',{cwd:${JSON.stringify(profile)},ephemeral:false,approvalPolicy:'never',sandbox:'read-only'});w.__thread=r.thread.id;await w.__manager.nativeRequest('thread/name/set',{threadId:w.__thread,name:'recovery acceptance'});`,
  );
  await until(
    `return ![...d.querySelectorAll('button')].find(b=>b.innerText==='刷新')?.disabled;`,
  );
  await evaluate(
    `[...d.querySelectorAll('button')].find(b=>b.innerText==='刷新').click();`,
  );
  await until(
    `return !!d.querySelector('[data-chat-id="'+w.__thread+'"] .cm-title-text');`,
  );
  await evaluate(
    `d.querySelector('[data-chat-id="'+w.__thread+'"] .cm-title-text').click();`,
  );
  await evaluate(
    `const r=await w.__manager.nativeRequest('turn/start',{threadId:w.__thread,input:[{type:'text',text:'Reply once. Do not use tools.'}]});w.__turn=r.turn.id;`,
  );
  await until(
    `return w.__notifications.some(e=>e.method==='error'&&e.params?.willRetry);`,
  );
  const retryText = await until(
    `return d.body.innerText.includes('waiting for provider recovery')&&d.body.innerText;`,
  );
  assert(retryText.includes("stop to cancel"));
  await until(
    `return w.__notifications.some(e=>e.method==='turn/completed'&&e.params?.turn?.id===w.__turn&&e.params.turn.status==='completed');`,
    45,
  );
  assert(
    await until(`return d.body.innerText.includes('Recovered successfully.');`),
  );
  const firstTurnStarts = await evaluate(
    `return w.__notifications.filter(e=>e.method==='turn/started'&&e.params?.turn?.id===w.__turn).length;`,
  );
  assert.equal(firstTurnStarts, 1);
  failures = 100;
  await evaluate(
    `w.__notifications=[];const r=await w.__manager.nativeRequest('turn/start',{threadId:w.__thread,input:[{type:'text',text:'Wait for recovery.'}]});w.__turn=r.turn.id;`,
  );
  await until(
    `return w.__notifications.some(e=>e.method==='error'&&e.params?.willRetry);`,
  );
  const cancelStart = Date.now();
  // Exercise the real UI stop action, then verify the native interrupted event.
  const stopLabels = await evaluate(
    `return [...d.querySelectorAll('button')].map(b=>({label:b.getAttribute('aria-label'),title:b.getAttribute('title')})).filter(b=>/stop|停止/i.test((b.label||'')+' '+(b.title||'')));`,
  );
  const clicked = await evaluate(
    `const b=[...d.querySelectorAll('button')].find(b=>/stop|停止/i.test((b.getAttribute('aria-label')||'')+' '+(b.getAttribute('title')||'')));if(b){b.click();return true;}return false;`,
  );
  assert(
    clicked,
    `Stop button must be available: ${JSON.stringify(stopLabels)}`,
  );
  await until(
    `return w.__notifications.some(e=>e.method==='turn/completed'&&e.params?.turn?.id===w.__turn&&e.params.turn.status==='interrupted');`,
    3,
  );
  const cancelMs = Date.now() - cancelStart;
  assert(cancelMs < 3000);
  assert(!JSON.stringify(requests).includes("Cloudflare challenge"));
  assert(!JSON.stringify(requests).includes("Reconnecting..."));
  const report = {
    passed: true,
    checks: [
      "real host and custom native engine",
      "native rename and history",
      "Cloudflare 403 retry visible in conversation",
      "same turn recovery and assistant output",
      "UI stop interrupts recovery",
      "no retry status in model context",
    ],
    requests: requests.length,
    cancelMs,
  };
  await writeJSON(path.join(root, "reports/vscode-recovery.json"), report);
  console.log(JSON.stringify(report, null, 2));
} finally {
  ws?.close();
  await writeJSON(finished, {});
  mock.close();
  // Keep this isolated profile under the external build root for local diagnostics.
}
