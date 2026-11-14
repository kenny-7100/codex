"use strict";
// Atomic metadata changes stay in the extension host, shared by all Webviews.
const STORAGE_KEY = "codexx.chatManager.v1";
const queues = new WeakMap();
function tags(value) {
  if (!Array.isArray(value)) throw Error("标签必须是数组");
  const result = [],
    seen = new Set();
  for (const item of value) {
    if (typeof item !== "string") throw Error("标签名称无效");
    const name = item.trim().normalize("NFC"),
      key = name.toLowerCase();
    if (!name) continue;
    if ([...name].length > 32) throw Error("每个标签最多 32 个字符");
    if (!seen.has(key)) {
      seen.add(key);
      result.push(name);
    }
  }
  if (result.length > 20) throw Error("每个对话最多 20 个标签");
  return result;
}
function cleanFilters(filters) {
  const result = {};
  const fields = [
    "query",
    "match",
    "scope",
    "project",
    "host",
    "period",
    "from",
    "to",
    "tags",
    "excludeTags",
    "tagMatch",
    "status",
    "archived",
    "sort",
  ];
  for (const field of fields)
    if (typeof filters?.[field] === "string" && filters[field].length <= 2000)
      result[field] = filters[field];
  result.untagged = filters?.untagged === true;
  return result;
}
async function update(storage, message) {
  const stored = await storage.get(STORAGE_KEY);
  const state =
    stored && stored.version === 1
      ? structuredClone(stored)
      : {
          version: 1,
          revision: 0,
          threads: {},
          savedQueries: [],
          lastFilters: {},
        };
  const operation = message.operation;
  if (operation === "read") return state;
  if (operation === "setTags") {
    if (
      typeof message.threadId !== "string" ||
      !message.threadId ||
      message.threadId.length > 300 ||
      typeof message.hostId !== "string" ||
      message.hostId.length > 300
    )
      throw Error("会话标识无效");
    const key = JSON.stringify([message.hostId || "local", message.threadId]);
    const value = tags(message.tags);
    if (value.length) state.threads[key] = { tags: value };
    else delete state.threads[key];
  } else if (operation === "saveFilters")
    state.lastFilters = cleanFilters(message.filters);
  else if (operation === "saveQuery") {
    const name = String(message.name ?? "").trim();
    if (!name || [...name].length > 64) throw Error("查询名称需为 1–64 个字符");
    const index = state.savedQueries.findIndex((q) => q.name === name);
    const query = { name, filters: cleanFilters(message.filters) };
    if (index >= 0) state.savedQueries[index] = query;
    else {
      if (state.savedQueries.length >= 50)
        throw Error("最多保存 50 个常用查询");
      state.savedQueries.push(query);
    }
  } else if (operation === "deleteQuery")
    state.savedQueries = state.savedQueries.filter(
      (q) => q.name !== message.name,
    );
  else if (operation === "renameTag" || operation === "deleteTag") {
    const oldName = tags([message.name])[0];
    if (!oldName) throw Error("标签名称不能为空");
    const newName =
      operation === "renameTag" ? tags([message.newName])[0] : null;
    if (operation === "renameTag" && !newName)
      throw Error("新标签名称不能为空");
    const transform = (values) =>
      tags(
        values.flatMap((t) =>
          t.toLowerCase() === oldName.toLowerCase()
            ? newName
              ? [newName]
              : []
            : [t],
        ),
      );
    for (const [key, value] of Object.entries(state.threads)) {
      value.tags = transform(value.tags);
      if (!value.tags.length) delete state.threads[key];
    }
    for (const filters of [
      state.lastFilters,
      ...state.savedQueries.map((q) => q.filters),
    ]) {
      for (const field of ["tags", "excludeTags"])
        if (filters[field])
          filters[field] = transform(filters[field].split(/[,，]/)).join(", ");
    }
  } else throw Error("未知的聊天管理操作");
  state.revision++;
  await storage.update(STORAGE_KEY, state);
  return state;
}
async function dispatch(storage, message) {
  const previous = queues.get(storage) ?? Promise.resolve();
  const next = previous.catch(() => {}).then(() => update(storage, message));
  queues.set(storage, next);
  try {
    return await next;
  } finally {
    if (queues.get(storage) === next) queues.delete(storage);
  }
}
async function handle(controller, webview, message) {
  try {
    const state = await dispatch(controller.globalState, message);
    controller.postMessageToWebview(webview, {
      type: "codexx-chat-manager-result",
      requestId: message.requestId,
      state,
    });
    if (message.operation !== "read")
      controller.broadcastToAllViews({
        type: "codexx-chat-manager-state",
        state,
      });
  } catch (error) {
    controller.postMessageToWebview(webview, {
      type: "codexx-chat-manager-result",
      requestId: message.requestId,
      error: String(error.message ?? error),
    });
  }
}
module.exports = { dispatch, handle, STORAGE_KEY };
