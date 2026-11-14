import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { build } from "esbuild";
import { root } from "../scripts/common.mjs";
const require = createRequire(import.meta.url);
const { dispatch } = require("../overrides/out/chat-manager-host.cjs");
const bundle = await build({
  entryPoints: [path.join(root, "test/ui-harness.mjs")],
  bundle: true,
  format: "esm",
  write: false,
});
let values = new Map();
const storage = {
  get: async (key) => values.get(key),
  update: async (key, value) => values.set(key, structuredClone(value)),
};
const now = Date.now();
let fixtures;
const reset = () => {
  values = new Map();
  fixtures = Array.from({ length: 135 }, (_, i) => ({
    id: `fixture-${i}`,
    name:
      i === 0
        ? "检查项目当前状态"
        : i === 1
          ? "梳理项目结构"
          : i === 2
            ? "评估 Solana 迁移进度"
            : i === 3
              ? "插件搜索优化"
              : `历史聊天 ${i}`,
    preview: `正文资料 ${i} ${i === 120 ? "needle deep-search" : ""}`,
    cwd: i === 2 ? "/work/solana" : "/work/codex",
    createdAt: Math.floor((now - (i + 1) * 86400000) / 1000),
    updatedAt: Math.floor(
      (now -
        (i === 0
          ? 28 * 60000
          : i === 1
            ? 11 * 3600000
            : i === 2
              ? 35 * 60000
              : (i + 1) * 3600000)) /
        1000,
    ),
    status: { type: i === 0 ? "active" : "idle" },
    archived: i === 134,
  }));
};
reset();
const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  try {
    let body = "";
    for await (const chunk of req) body += chunk;
    if (req.url === "/reset") {
      reset();
      res.end("{}");
      return;
    }
    if (req.url === "/fixtures") {
      res.end(JSON.stringify(fixtures));
      return;
    }
    if (req.url === "/rename") {
      const { id, name } = JSON.parse(body);
      if (name === "失败测试") {
        res.end(JSON.stringify({ error: "模拟保存失败" }));
        return;
      }
      const row = fixtures.find((r) => r.id === id);
      if (!row) throw Error("Unknown thread");
      row.name = name;
      res.end("{}");
      return;
    }
    if (req.url === "/api") {
      const message = JSON.parse(body);
      if (message.type === "codexx-chat-manager") {
        try {
          const state = await dispatch(storage, message);
          res.end(
            JSON.stringify({
              type: "codexx-chat-manager-result",
              requestId: message.requestId,
              state,
            }),
          );
        } catch (e) {
          res.end(
            JSON.stringify({
              type: "codexx-chat-manager-result",
              requestId: message.requestId,
              error: e.message,
            }),
          );
        }
      } else {
        const p = message.request.params;
        let rows = fixtures.filter((r) => r.archived === p.archived);
        if (message.request.method === "thread/search")
          rows = rows.filter((r) =>
            (r.name + " " + r.preview)
              .toLowerCase()
              .includes(p.searchTerm.toLowerCase()),
          );
        const cursor = Number(p.cursor ?? 0);
        const page = rows.slice(cursor, cursor + p.limit);
        const next =
          cursor + p.limit < rows.length ? String(cursor + p.limit) : null;
        res.end(
          JSON.stringify({
            type: "mcp-response",
            message: {
              id: message.request.id,
              result: { data: page, nextCursor: next },
            },
          }),
        );
      }
      return;
    }
    if (req.url === "/bundle.js") {
      res.setHeader("Content-Type", "text/javascript");
      res.end(bundle.outputFiles[0].text);
      return;
    }
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(
      `<!doctype html><meta charset="utf-8"><title>聊天管理验收</title><style>body{margin:0;background:#181818;color:#ddd;font:13px system-ui}main{padding:16px;max-width:1100px;margin:auto}h2{font-size:14px}.cm-search-panel .fixture-row{display:flex;align-items:center;justify-content:space-between;gap:12px;border:0;background:transparent;color:#ddd;padding:8px;width:100%;text-align:left}.cm-search-panel .fixture-row:hover{background:#303030}.fixture-row>span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cm-search-panel{border:1px solid #333;border-radius:12px;width:100%!important}</style><div id="root"></div><script type="module" src="/bundle.js"></script>`,
    );
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.stack }));
  }
});
server.listen(4317, "127.0.0.1", () =>
  console.log("Chat manager UI acceptance: http://127.0.0.1:4317"),
);
