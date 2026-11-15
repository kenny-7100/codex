// Durable public IDs; internal window identities never appear in shared URLs.
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz";
const CODE = /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz]{12}$/;
const THREAD = /^[a-zA-Z0-9_-]{1,128}$/;
function createLinks(file) {
  let state,
    serial = Promise.resolve();
  async function load() {
    if (state) return;
    try {
      const saved = JSON.parse(await fs.readFile(file, "utf8"));
      if (
        saved.version !== 1 ||
        !saved.links ||
        typeof saved.links !== "object" ||
        Array.isArray(saved.links)
      )
        throw Error("会话链接数据格式无效");
      for (const [code, entry] of Object.entries(saved.links))
        if (
          !CODE.test(code) ||
          typeof entry.threadId !== "string" ||
          !THREAD.test(entry.threadId) ||
          entry.hostId !== "local" ||
          !Array.isArray(entry.folders)
        )
          throw Error("会话链接数据格式无效");
      state = saved;
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      state = { version: 1, links: {} };
    }
  }
  function run(fn) {
    const next = serial.then(async () => {
      await load();
      return fn();
    });
    serial = next.catch(() => {});
    return next;
  }
  return {
    get: (code) => run(() => state.links[code] || null),
    ensure: (threadId, win) =>
      run(async () => {
        if (typeof threadId !== "string" || !THREAD.test(threadId))
          throw Object.assign(Error("会话标识无效"), { status: 400 });
        for (const [code, entry] of Object.entries(state.links))
          if (entry.threadId === threadId && entry.hostId === "local")
            return code;
        let code;
        do {
          code = Array.from(
            { length: 12 },
            () => ALPHABET[crypto.randomInt(ALPHABET.length)],
          ).join("");
        } while (Object.hasOwn(state.links, code));
        const updated = {
          version: 1,
          links: {
            ...state.links,
            [code]: {
              threadId,
              hostId: "local",
              windowId: win.id,
              folders: [...win.folders],
              createdAt: Date.now(),
            },
          },
        };
        await fs.mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
        const temp = file + "." + crypto.randomUUID() + ".tmp";
        try {
          await fs.writeFile(temp, JSON.stringify(updated), { mode: 0o600 });
          await fs.rename(temp, file);
        } finally {
          await fs.rm(temp, { force: true });
        }
        state = updated;
        return code;
      }),
  };
}
module.exports = { createLinks, CODE, THREAD };
