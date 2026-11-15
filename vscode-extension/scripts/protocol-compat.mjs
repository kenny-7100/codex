import fs from "node:fs/promises";
import path from "node:path";
import { write } from "./common.mjs";

// Development builds advertise 0.0.0. The upstream feature table already treats
// that version as current; these older, separate gates must agree with it.
function replaceOnce(code, before, after) {
  const compact = new Map([
    [
      "return e != null && e !== `0.0.0` && zy(e, `0.146.0-alpha.7`) >= 0;",
      "return e!=null&&e!==`0.0.0`&&zy(e,`0.146.0-alpha.7`)>=0",
    ],
    [
      "return e != null && e !== ETt && zy(e, wTt) >= 0;",
      "return e!=null&&e!==ETt&&zy(e,wTt)>=0",
    ],
    [
      "g.historyMode === `paginated` || (_ != null && _ !== `0.0.0` && h(_, bB) >= 0)",
      "g.historyMode===`paginated`||_!=null&&_!==`0.0.0`&&h(_,bB)>=0",
    ],
    [
      "f === `0.0.0` ||\n    (c.ephemeral === !0 && c.sideConversation !== !0) ||\n    i(f, c.ephemeral === !0 ? UK : HK) < 0",
      "f===`0.0.0`||c.ephemeral===!0&&c.sideConversation!==!0||i(f,c.ephemeral===!0?UK:HK)<0",
    ],
    [
      "this.supportsPaginatedThreadHistory() && g.history.paginatedHistoryEnabled",
      "this.supportsPaginatedThreadHistory()&&g.history.paginatedHistoryEnabled",
    ],
    [
      "c.historyMode === `paginated` && Hn(e.requestClient.getAppServerVersion(), `threadRevert`)",
      "c.historyMode===`paginated`&&Hn(e.requestClient.getAppServerVersion(),`threadRevert`)",
    ],
    [
      "s?.historyMode === `paginated` && Hn(t.requestClient.getAppServerVersion(), `threadRevert`)",
      "s?.historyMode===`paginated`&&Hn(t.requestClient.getAppServerVersion(),`threadRevert`)",
    ],
    ["(e.sessionId = a.sessionId)", "e.sessionId=a.sessionId"],
  ]);
  if (!code.includes(before) && compact.has(before)) {
    before = compact.get(before);
    // Minified functions have no statement delimiter before their closing brace.
    if (after.endsWith(";")) after = after.slice(0, -1);
  }
  if (code.split(before).length !== 2)
    throw new Error(
      "App-server compatibility hook changed; review before building",
    );
  return code.replace(before, after);
}

export function compatibleHistory(code) {
  code = replaceOnce(
    code,
    "return e != null && e !== ETt && zy(e, wTt) >= 0;",
    "return e === ETt || (e != null && By(e) && zy(e, wTt) >= 0);",
  );
  return replaceOnce(
    code,
    "return e != null && e !== `0.0.0` && zy(e, `0.146.0-alpha.7`) >= 0;",
    "return e === `0.0.0` || (e != null && By(e) && zy(e, `0.146.0-alpha.7`) >= 0);",
  );
}

export function compatibleConversations(code) {
  code = replaceOnce(
    code,
    "g.historyMode === `paginated` || (_ != null && _ !== `0.0.0` && h(_, bB) >= 0)",
    "g.historyMode === `paginated` || Hn(_, `threadForkBeforeTurn`) || (_ != null && _ !== `0.0.0` && h(_, bB) >= 0)",
  );
  code = replaceOnce(
    code,
    "f === `0.0.0` ||\n    (c.ephemeral === !0 && c.sideConversation !== !0) ||\n    i(f, c.ephemeral === !0 ? UK : HK) < 0",
    "(c.ephemeral === !0 && c.sideConversation !== !0) ||\n    (f !== `0.0.0` && i(f, c.ephemeral === !0 ? UK : HK) < 0)",
  );
  // Remote experiment defaults are false in an offline profile. A current local
  // development engine no longer implements legacy rollback; create paginated
  // history so editing and buffered retry use their native revert implementation.
  return replaceOnce(
    code,
    "this.supportsPaginatedThreadHistory() && g.history.paginatedHistoryEnabled",
    "this.supportsPaginatedThreadHistory() && (this.requestClient.getAppServerVersion() === `0.0.0` || g.history.paginatedHistoryEnabled)",
  );
}

export function compatibleLegacyRevert(code) {
  code = replaceOnce(
    code,
    "c.historyMode === `paginated` && Hn(e.requestClient.getAppServerVersion(), `threadRevert`)",
    "(c.historyMode === `paginated` || e.requestClient.getAppServerVersion() === `0.0.0`) && Hn(e.requestClient.getAppServerVersion(), `threadRevert`)",
  );
  code = replaceOnce(
    code,
    "s?.historyMode === `paginated` && Hn(t.requestClient.getAppServerVersion(), `threadRevert`)",
    "(s?.historyMode === `paginated` || t.requestClient.getAppServerVersion() === `0.0.0`) && Hn(t.requestClient.getAppServerVersion(), `threadRevert`)",
  );
  // Revert may have migrated a legacy thread. Adopt the returned mode before the
  // next history read or mutation, alongside its new path and pagination cursors.
  return replaceOnce(
    code,
    "(e.sessionId = a.sessionId)",
    "(e.sessionId = a.sessionId, e.historyMode = a.historyMode)",
  );
}

export async function applyProtocolCompatibility(target, engine) {
  const transforms = [
    ["webview/assets/app-initial-f8f84852daaa.js", compatibleHistory],
    ["webview/assets/app-initial-050fbd442c4f.js", compatibleConversations],
  ];
  for (const [relative, transform] of transforms) {
    const file = path.join(target, relative);
    let code = transform(await fs.readFile(file, "utf8"));
    if (engine?.legacyThreadRevert && relative.includes("050fbd442c4f"))
      code = compatibleLegacyRevert(code);
    await write(file, code);
  }
  return transforms.map(([relative]) => relative);
}
