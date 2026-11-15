import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import {
  DEFAULT_FILTERS,
  absoluteTimestamp,
  displayTimestamp,
  filterThreads,
  normalizeTags,
  parseQuery,
  collectPages,
  searchHistory,
  threadKey,
} from "../overrides/webview/assets/chat-manager-core.js";
const require = createRequire(import.meta.url);
const {
  dispatch,
  STORAGE_KEY,
} = require("../overrides/out/chat-manager-host.cjs");
const now = new Date(2026, 10, 14, 14, 30, 45).getTime();
const rows = [
  {
    id: "a",
    hostId: "local",
    title: "Codex 插件 搜索优化",
    project: "/work/codex",
    createdAt: now - 2 * 86400000,
    updatedAt: now - 1800000,
    status: "active",
    archived: false,
  },
  {
    id: "b",
    hostId: "local",
    title: "Codex 插件 旧实验",
    project: "/work/codex",
    createdAt: now - 40 * 86400000,
    updatedAt: now - 10 * 86400000,
    status: "idle",
    archived: false,
  },
  {
    id: "c",
    hostId: "remote",
    title: "Solana 迁移",
    project: "/work/solana",
    createdAt: now - 86400000,
    updatedAt: now - 3600000,
    status: "idle",
    archived: false,
  },
  {
    id: "d",
    hostId: "local",
    title: "归档插件",
    project: "/work/codex",
    createdAt: now - 86400000,
    updatedAt: now,
    status: "idle",
    archived: true,
  },
];
const metadata = {
  [threadKey("local", "a")]: { tags: ["插件", "待处理"] },
  [threadKey("local", "b")]: { tags: ["插件"] },
};

test("timestamps switch exactly at one hour and use local calendar fields including seconds", () => {
  assert.equal(displayTimestamp(now - 3599999, now), "59 分钟前");
  assert.equal(displayTimestamp(now - 3600000, now), "2026-11-14 13:30:45");
  assert.equal(displayTimestamp(now - 30000, now), "刚刚");
  assert.equal(displayTimestamp("invalid", now), "时间未知");
  assert.equal(absoluteTimestamp(now), "2026-11-14 14:30:45");
  assert.match(displayTimestamp(now + 1000, now), /^2026-11-14/);
});
test("queries support multiple terms, quoted phrases, exclusions and invalid quote feedback", () => {
  assert.deepEqual(parseQuery('插件 "搜索 优化" -旧 -"临时 测试"'), {
    include: ["插件", "搜索 优化"],
    exclude: ["旧", "临时 测试"],
  });
  assert.throws(() => parseQuery('"未闭合'), /引号/);
  assert.deepEqual(normalizeTags(" 插件,插件，Bug,bug, 待处理 "), [
    "插件",
    "Bug",
    "待处理",
  ]);
  assert.throws(() => normalizeTags("x".repeat(33)), /32/);
});
test("combined filtering, tag AND/OR/exclusion, host and date fields are reliable", () => {
  const apply = (filters) =>
    filterThreads(rows, { ...DEFAULT_FILTERS, ...filters }, metadata, {
      now,
    }).map((r) => r.id);
  assert.deepEqual(
    apply({
      query: "Codex 插件 -旧",
      project: "/codex",
      tags: "插件,待处理",
      period: "7",
      status: "active",
    }),
    ["a"],
  );
  assert.deepEqual(apply({ query: "Solana 优化", match: "any" }), ["a", "c"]);
  assert.deepEqual(
    apply({ tags: "不存在,插件", tagMatch: "any", excludeTags: "待处理" }),
    ["b"],
  );
  assert.deepEqual(apply({ untagged: true }), ["c"]);
  assert.deepEqual(
    apply({ archived: "all", host: "local", sort: "created-asc" }),
    ["b", "a", "d"],
  );
  assert.deepEqual(apply({ period: "7", sort: "created-desc" }), ["c", "a"]);
  assert.throws(
    () => apply({ from: "2026-12-01", to: "2026-01-01" }),
    /开始时间/,
  );
  assert.deepEqual(
    apply({
      from: new Date(now - 3600000).toISOString(),
      to: new Date(now).toISOString(),
    }),
    ["a", "c"],
  );
});
test("pagination reads beyond the first 100 entries and rejects repeating cursors", async () => {
  const calls = [];
  const result = await collectPages(
    async (method, params) => {
      calls.push(params.cursor);
      return params.cursor == null
        ? { data: Array.from({ length: 100 }, (_, i) => i), nextCursor: "next" }
        : { data: [100, 101], nextCursor: null };
    },
    "thread/list",
    {},
  );
  assert.equal(result.length, 102);
  assert.deepEqual(calls, [null, "next"]);
  await assert.rejects(
    collectPages(
      async () => ({ data: [], nextCursor: "same" }),
      "thread/list",
      {},
    ),
    /分页重复/,
  );
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(
    collectPages(
      async () => assert.fail("aborted request must not run"),
      "thread/list",
      {},
      { signal: controller.signal },
    ),
  );
});
test("content AND/OR/exclusion and archived union search all pages", async () => {
  const request = async (method, p) => {
    assert.equal(method, "thread/search");
    const matches =
      p.searchTerm === "alpha"
        ? ["a", "b"]
        : p.searchTerm === "beta"
          ? ["b", "c"]
          : ["c"];
    return {
      data: matches.map((id) => ({
        id: `${p.archived ? "archived-" : ""}${id}`,
        name: id,
        createdAt: 100,
        updatedAt: 200,
      })),
      nextCursor: null,
    };
  };
  assert.deepEqual(
    (
      await searchHistory(request, {
        scope: "content",
        query: "alpha beta",
        match: "all",
      })
    ).map((r) => r.id),
    ["b"],
  );
  assert.deepEqual(
    (
      await searchHistory(request, {
        scope: "content",
        query: "alpha beta -exclude",
        match: "any",
        archived: "all",
      })
    ).map((r) => r.id),
    ["a", "b", "archived-a", "archived-b"],
  );
});
function storage() {
  const values = new Map();
  return {
    values,
    async get(key) {
      return values.get(key);
    },
    async update(key, value) {
      await new Promise((r) => setTimeout(r, 1));
      values.set(key, structuredClone(value));
    },
  };
}
test("host metadata serializes concurrent windows, isolates hosts, and survives reload", async () => {
  const s = storage();
  await Promise.all([
    dispatch(s, {
      operation: "setTags",
      hostId: "local",
      threadId: "same",
      tags: ["插件"],
    }),
    dispatch(s, {
      operation: "setTags",
      hostId: "remote",
      threadId: "same",
      tags: ["远程"],
    }),
    dispatch(s, {
      operation: "saveQuery",
      name: "常用",
      filters: { tags: "插件", sort: "created-desc" },
    }),
  ]);
  const before = await dispatch(s, { operation: "read" });
  assert.equal(before.revision, 3);
  assert.equal(Object.keys(before.threads).length, 2);
  const reloaded = storage();
  reloaded.values.set(STORAGE_KEY, structuredClone(s.values.get(STORAGE_KEY)));
  assert.deepEqual(await dispatch(reloaded, { operation: "read" }), before);
  await dispatch(s, { operation: "renameTag", name: "插件", newName: "开发" });
  const renamed = await dispatch(s, { operation: "read" });
  assert.deepEqual(renamed.threads[threadKey("local", "same")].tags, ["开发"]);
  assert.equal(renamed.savedQueries[0].filters.tags, "开发");
  await dispatch(s, { operation: "deleteTag", name: "开发" });
  assert.ok(
    !(
      threadKey("local", "same") in
      (await dispatch(s, { operation: "read" })).threads
    ),
  );
  await assert.rejects(
    dispatch(s, {
      operation: "setTags",
      hostId: "local",
      threadId: "x",
      tags: ["a".repeat(33)],
    }),
    /32/,
  );
  await dispatch(s, {
    operation: "saveFilters",
    filters: { query: "after failed write" },
  });
  assert.equal(
    (await dispatch(s, { operation: "read" })).lastFilters.query,
    "after failed write",
  );
});

test("tag palette provides sixteen readable gradients with stable normalized hashes", async () => {
  const { TAG_PALETTE, tagAppearance } = await import("../overrides/webview/assets/chat-manager-core.js");
  assert.equal(TAG_PALETTE.length, 16);
  assert.deepEqual(tagAppearance("  DESIGN  "), tagAppearance("design"));
  const luminance = hex => {
    const values = hex.match(/[a-f0-9]{2}/gi).map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return values[0] * .2126 + values[1] * .7152 + values[2] * .0722;
  };
  const text = luminance("#f7f8fc");
  for (const pair of TAG_PALETTE) for (const color of pair)
    assert((text + .05) / (luminance(color) + .05) >= 4.5, color + " must retain readable label contrast");
  const colors = new Set(Array.from({ length: 200 }, (_, i) => tagAppearance("tag-" + i).background));
  assert.equal(colors.size, 16);
});
