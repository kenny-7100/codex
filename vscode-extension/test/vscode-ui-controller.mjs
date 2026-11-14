// Attach to the isolated Extension Development Host started as documented in docs/chat-management.md.
// Uses an empty synthetic thread, never renames an existing conversation or starts a model turn.
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { chromium } from "@playwright/test";
const processLine = execFileSync("ps", ["-axo", "pid,args"], {
  encoding: "utf8",
})
  .split("\n")
  .find(
    (line) =>
      line.includes("/Contents/MacOS/Code --") &&
      line.includes("--remote-debugging-port=9338"),
  );
if (processLine)
  execFileSync("osascript", [
    "-e",
    `tell application "System Events" to set frontmost of first process whose unix id is ${Number(processLine.trim().split(/\s+/)[0])} to true`,
  ]);
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const targets = await (await fetch("http://127.0.0.1:9338/json/list")).json();
const target = targets.find((t) => t.type === "iframe");
assert(target, "Open the development sidebar first");
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let serial = 0;
const contexts = [];
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.method === "Runtime.executionContextCreated")
    contexts.push(m.params.context);
});
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++serial;
    const timer = setTimeout(() => reject(Error(`${method} timed out`)), 45000);
    ws.addEventListener("message", function handler(e) {
      const m = JSON.parse(e.data);
      if (m.id === id) {
        clearTimeout(timer);
        ws.removeEventListener("message", handler);
        m.error ? reject(Error(m.error.message)) : resolve(m.result);
      }
    });
    ws.send(JSON.stringify({ id, method, params }));
  });
await send("Runtime.enable");
await send("Emulation.setFocusEmulationEnabled", { enabled: true });
const context = contexts.find(
  (c) => c.auxData?.isDefault && c.auxData.frameId !== target.id,
);
assert(context, "Webview content not ready");
async function evaluate(body) {
  const result = await send("Runtime.evaluate", {
    contextId: context.id,
    expression: `(async()=>{const d=document,w=window;${body}})()`,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails)
    throw Error(
      result.exceptionDetails.text +
        " " +
        result.exceptionDetails.exception?.description,
    );
  return result.result.value;
}
async function until(body) {
  for (let i = 0; i < 300; i++) {
    const result = await evaluate(body);
    if (result) return result;
    await pause(100);
  }
  throw Error("UI assertion timed out: " + body);
}
let threadId;
try {
  await until(
    `if(d.body.innerText.includes('Decide how much autonomy'))[...d.querySelectorAll('button')].find(b=>b.innerText==='Continue')?.click();if(!d.querySelector('[aria-label="聊天搜索"]'))window.dispatchEvent(new CustomEvent('open-recent-tasks-menu'));return !!d.querySelector('[aria-label="聊天搜索"]');`,
  );
  await evaluate(
    `[...d.querySelectorAll('button')].find(b=>b.innerText==='清空筛选')?.click();`,
  );
  await pause(100);
  await evaluate(
    `w.__testManager=await import(new URL('./chat-manager-store.js',d.querySelector('script[src]').src).href);await w.__testManager.hydrate();`,
  );
  threadId = await evaluate(
    `const r=await w.__testManager.nativeRequest('thread/start',{cwd:'/tmp/codexx-chat-acceptance',ephemeral:false});w.__testThread=r.thread.id;await w.__testManager.nativeRequest('thread/name/set',{threadId:r.thread.id,name:'codexx-acceptance-temporary'});return r.thread.id;`,
  );
  await until(
    `return ![...d.querySelectorAll('button')].find(b=>b.innerText==='刷新')?.disabled;`,
  );
  await evaluate(
    `[...d.querySelectorAll('button')].find(b=>b.innerText==='刷新').click();`,
  );
  await until(`return !!d.querySelector('[data-chat-id="${threadId}"]');`);
  await evaluate(
    `d.querySelector('[data-chat-id="${threadId}"] [aria-label="重命名聊天"]').click();`,
  );
  await until(
    `return !!d.querySelector('[data-chat-id="${threadId}"] input');`,
  );
  await evaluate(
    `const input=d.querySelector('[data-chat-id="${threadId}"] input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'codexx-acceptance-renamed');input.dispatchEvent(new Event('input',{bubbles:true}));`,
  );
  await pause(100);
  await evaluate(
    `d.querySelector('[data-chat-id="${threadId}"] form').requestSubmit();`,
  );
  await until(`return !d.querySelector('[data-chat-id="${threadId}"] input');`);
  assert.equal(
    await evaluate(
      `return (await w.__testManager.nativeRequest('thread/read',{threadId:w.__testThread,includeTurns:false})).thread.name;`,
    ),
    "codexx-acceptance-renamed",
  );
  await evaluate(
    `d.querySelector('[data-chat-id="${threadId}"] [aria-label="编辑标签"]').click();`,
  );
  await until(
    `return !!d.querySelector('[data-chat-id="${threadId}"] input');`,
  );
  await evaluate(
    `const input=d.querySelector('[data-chat-id="${threadId}"] input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'验收,临时');input.dispatchEvent(new Event('input',{bubbles:true}));`,
  );
  await pause(100);
  await evaluate(
    `d.querySelector('[data-chat-id="${threadId}"] form').requestSubmit();`,
  );
  await until(
    `return d.querySelectorAll('[data-chat-id="${threadId}"] .cm-tag').length===2;`,
  );
  assert.deepEqual(
    await evaluate(
      `return (await w.__testManager.metadataRequest('read')).threads[JSON.stringify(['local',w.__testThread])].tags;`,
    ),
    ["验收", "临时"],
  );
  await until(
    `if(!d.querySelector('[aria-label="聊天搜索"]'))window.dispatchEvent(new CustomEvent('open-recent-tasks-menu'));return !!d.querySelector('.cm-search-panel input[type="search"]');`,
  );
  await evaluate(
    `const input=d.querySelector('input[type="search"]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'codexx-acceptance-renamed');input.dispatchEvent(new Event('input',{bubbles:true}));`,
  );
  await until(`return d.querySelectorAll('[data-result-id]').length===1;`);
  await until(`return d.querySelector('.cm-results')?.getAttribute('aria-busy')==='false';`);
  const dimensions = await evaluate(
    `const panel=d.querySelector('[aria-label="聊天搜索"]');return {height:panel.getBoundingClientRect().height,listHeight:panel.querySelector('.cm-results').getBoundingClientRect().height,sortInList:!!d.querySelector('[aria-label="聊天列表工具栏"] [aria-label="排序"]'),styleCount:d.querySelectorAll('#codexx-chat-manager-styles').length,overflow:d.documentElement.scrollWidth>innerWidth};`,
  );
  assert(dimensions.height > 500);
  assert(dimensions.listHeight > 250);
  assert(dimensions.sortInList);
  assert.equal(dimensions.styleCount, 1);
  assert.equal(dimensions.overflow, false);
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9338");
  await browser
    .contexts()[0]
    .pages()[0]
    .screenshot({ path: "reports/vscode-chat-management.png" });
  await browser.close();
  const report = {
    passed: true,
    checks: [
      "real host activation",
      "native paginated history",
      "rename through original manager and native readback",
      "tags through real globalState and readback",
      "name filtering",
      "compact panel dimensions",
      "sorting in list toolbar",
    ],
    dimensions,
  };
  await fs.writeFile(
    "reports/vscode-ui-acceptance.json",
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  if (threadId)
    await evaluate(
      `await w.__testManager.metadataRequest('setTags',{hostId:'local',threadId:w.__testThread,tags:[]});await w.__testManager.nativeRequest('thread/archive',{threadId:w.__testThread});await w.__testManager.metadataRequest('saveFilters',{filters:{}});`,
    );
  ws.close();
  await fs.writeFile("reports/vscode-acceptance-finished.json", "{}");
}
