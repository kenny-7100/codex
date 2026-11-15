import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { parse } from "@babel/parser";
import {
  compatibleHistory,
  compatibleConversations,
  compatibleLegacyRevert,
} from "../scripts/protocol-compat.mjs";
import { reference } from "../scripts/common.mjs";
import path from "node:path";

const original = await fs.readFile(
  new URL("../src/webview/assets/app-initial-050fbd442c4f.js", import.meta.url),
  "utf8",
);
const conversations = compatibleLegacyRevert(compatibleConversations(original));
const shared = compatibleHistory(
  await fs.readFile(
    new URL(
      "../src/webview/assets/app-initial-f8f84852daaa.js",
      import.meta.url,
    ),
    "utf8",
  ),
);
const trees = new Map();
function compile(source, name, globals = {}) {
  if (!trees.has(source))
    trees.set(source, parse(source, { sourceType: "module" }));
  const node = trees
    .get(source)
    .program.body.find(
      (n) => n.type === "FunctionDeclaration" && n.id.name === name,
    );
  assert(node, name);
  return Function(
    ...Object.keys(globals),
    `${source.slice(node.start, node.end)}; return ${name};`,
  )(...Object.values(globals));
}
const compare = (a, b) => a.localeCompare(b, undefined, { numeric: true });
const supports = (version, feature) =>
  version === "0.0.0" ||
  (version != null &&
    compare(
      version,
      feature === "threadRevert" ? "0.148.0-alpha.13" : "0.145.0-alpha.14",
    ) >= 0);
const guard = compile(conversations, "BK");

test("development history capability agrees with upstream feature table and preserves old/unknown engines", () => {
  const capability = compile(shared, "xTt", {
    ETt: "0.0.0",
    wTt: "0.145.0-alpha.15",
    By: (v) => /^\d+\.\d+\.\d+/.test(v),
    zy: compare,
  });
  for (const version of ["0.0.0", "0.169.0-alpha.11.1"])
    assert.equal(capability(version), true);
  for (const version of [null, "invalid", "0.140.0"])
    assert.equal(capability(version), false);
});

test("paginated fork menu remains available for the development engine", () => {
  const capability = compile(shared, "Jwt", {
    By: (v) => /^\d+\.\d+\.\d+/.test(v),
    zy: compare,
  });
  assert.equal(capability("0.0.0"), true);
  assert.equal(capability("0.169.0-alpha.11.1"), true);
  assert.equal(capability("0.140.0"), false);
  assert.equal(capability(null), false);
});

test("production minified payloads receive the same compatibility transforms and remain valid JavaScript", async () => {
  for (const [file, transform] of [
    ["app-initial-f8f84852daaa.js", compatibleHistory],
    ["app-initial-050fbd442c4f.js", compatibleConversations],
  ]) {
    const raw = await fs.readFile(
      path.join(reference, "extension/webview/assets", file),
      "utf8",
    );
    const result = transform(raw);
    if (file.includes("050fbd"))
      parse(compatibleLegacyRevert(result), { sourceType: "module" });
    assert.notEqual(result, raw);
    parse(result, { sourceType: "module" });
    assert.throws(() => transform(result), /hook changed/);
  }
});

for (const mode of ["legacy", "paginated"])
  for (const before of [false, true]) {
    test(`development fork uses native boundary without copying later turns: ${mode}, before=${before}`, async () => {
      const calls = [];
      const fork = compile(conversations, "ihe", {
        Hn: supports,
        h: compare,
        bB: "0.143.0-alpha.32",
      });
      const result = await fork(
        {
          getConversation: () => ({ historyMode: mode }),
          requestClient: { getAppServerVersion: () => "0.0.0" },
          forkConversationFromLatest: async (params) => {
            calls.push(params);
            return { status: "created" };
          },
          sendRequest: () => assert.fail("must not send legacy rollback"),
        },
        {
          sourceConversationId: "source",
          targetTurnId: "first",
          beforeTargetTurn: before,
        },
        compare,
      );
      assert.equal(result.status, "created");
      assert.equal(calls.length, 1);
      assert.equal(calls[0][before ? "beforeTurnId" : "lastTurnId"], "first");
    });
  }

test("paginated development forks pass the second gate, old engines retain rejection", async () => {
  const boundary = Error("passed version gate");
  const fork = compile(conversations, "nve", {
    Hn: supports,
    BK: guard,
    CK: () => {
      throw boundary;
    },
    UK: "0.146.0-alpha.8",
    HK: "0.146.0-alpha.7",
  });
  for (const [version, expected] of [
    ["0.0.0", boundary],
    ["0.169.0-alpha.11.1", boundary],
    ["0.140.0", /not available/],
  ]) {
    await assert.rejects(
      fork({
        manager: {
          getConversation: () => ({ historyMode: "paginated" }),
          requestClient: { getAppServerVersion: () => version },
        },
        params: {},
        compareSemanticVersions: compare,
      }),
      expected,
    );
  }
});

for (const historyMode of ["legacy", "paginated"])
  test("editing paginated messages uses revert and resends edited input", async () => {
    const turn = {
      turnId: "first",
      status: "completed",
      params: { input: [{ type: "text", text: "before" }] },
    };
    const state = { historyMode, turns: [turn] };
    const calls = [];
    const edit = compile(conversations, "tve", {
      JI: () => turn,
      Hn: supports,
      BK: guard,
      X: (s) => s.turns,
      $te: (_, text) => text,
    });
    const manager = {
      getConversation: () => state,
      getStreamRole: () => ({ role: "owner" }),
      sendThreadFollowerRequest: async () => false,
      waitForPendingThreadSettingsUpdate: async () => {},
      requestClient: { getAppServerVersion: () => "0.0.0" },
      sendRequest: async (method, params) => {
        calls.push({ method, params });
        return { thread: {} };
      },
      applyRevertResponseToConversation: () => {},
    };
    await edit({
      manager,
      conversationId: "thread",
      options: { turnId: "first", message: "edited" },
      startTurn: async (params) => calls.push({ method: "turn/start", params }),
    });
    assert.deepEqual(
      calls.map((c) => c.method),
      ["thread/revert", "turn/start"],
    );
    assert.equal(calls[0].params.beforeTurnId, "first");
    assert.equal(calls[1].params.input[0].text, "edited");
  });

for (const historyMode of ["legacy", "paginated"])
  test("buffered retry interrupts, reverts, then restarts without rollback", async () => {
    const turn = {
      turnId: "buffered",
      status: "inProgress",
      params: { input: [{ type: "text", text: "retry me" }] },
    };
    const state = { historyMode, turns: [turn] },
      calls = [];
    const retry = compile(conversations, "hve", {
      JI: () => turn,
      Hn: supports,
      BK: guard,
      X: (s) => s.turns,
      Wn: (a, b) => b ?? a,
      rq: { default: (obj) => ({ ...obj }) },
    });
    const manager = {
      getConversation: () => state,
      requestClient: { getAppServerVersion: () => "0.0.0" },
      sendRequest: async (method, params) => {
        calls.push(method);
        return method === "model/list" ? { data: [] } : { thread: {} };
      },
      interruptConversation: async () => {
        calls.push("turn/interrupt");
        return "buffered";
      },
      applyRevertResponseToConversation: () => {},
    };
    await retry({
      conversationId: "thread",
      manager,
      model: "probe",
      turnId: "buffered",
      startTurn: async () => calls.push("turn/start"),
    });
    assert.deepEqual(calls, [
      "model/list",
      "turn/interrupt",
      "thread/revert",
      "turn/start",
    ]);
  });

test("offline development profiles select paginated history; release flag and unsupported engines keep their policy", () => {
  let expression;
  function visit(node) {
    if (!node || typeof node !== "object") return;
    if (
      node.type === "ArrowFunctionExpression" &&
      conversations
        .slice(node.start, node.end)
        .startsWith("() => this.supportsPaginatedThreadHistory() &&")
    )
      expression = conversations.slice(node.start, node.end);
    for (const value of Object.values(node))
      if (Array.isArray(value)) value.forEach(visit);
      else if (value && typeof value === "object") visit(value);
  }
  visit(trees.get(conversations));
  assert(expression);
  const make = Function("g", `return ${expression};`);
  for (const [version, supported, flag, expected] of [
    ["0.0.0", true, false, true],
    ["0.169.0", true, false, false],
    ["0.140.0", false, true, false],
  ]) {
    const callback = make.call(
      {
        supportsPaginatedThreadHistory: () => supported,
        requestClient: { getAppServerVersion: () => version },
      },
      { history: { paginatedHistoryEnabled: flag } },
    );
    assert.equal(callback(), expected);
  }
});

test("compatibility transforms reject missing or duplicate upstream hooks", () => {
  assert.throws(() => compatibleConversations(""), /hook changed/);
  assert.throws(() => compatibleHistory(""), /hook changed/);
  assert.throws(() => compatibleHistory(shared), /hook changed/);
});

test("revert adopts migrated history mode and cursors while retaining earlier turns", () => {
  const state = {
    historyMode: "legacy",
    turns: [{ turnId: "first" }, { turnId: "second" }],
  };
  const apply = compile(conversations, "che");
  let truncated;
  apply(
    { updateConversationState: (_, update) => update(state) },
    {
      conversationId: "thread",
      revertedTurns: [{ turnId: "second" }],
      response: {
        thread: {
          historyMode: "paginated",
          sessionId: "same-session",
          path: "new-rollout",
          status: "idle",
        },
        turnsBackwardsCursor: "cursor",
        itemsBackwardsCursor: "items",
      },
    },
    (value) => {
      truncated = value;
    },
  );
  assert.equal(state.historyMode, "paginated");
  assert.deepEqual(state.turns, [{ turnId: "first" }]);
  assert.equal(state.paginatedHistory.itemsBackwardsCursor, "items");
  assert.equal(truncated, true);
});
