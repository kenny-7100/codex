// Domain logic shared by the real Webview and the acceptance harness.
export const DEFAULT_FILTERS = Object.freeze({
  query: "",
  match: "all",
  scope: "title",
  project: "",
  host: "",
  period: "all",
  from: "",
  to: "",
  tags: "",
  excludeTags: "",
  tagMatch: "all",
  untagged: false,
  status: "",
  archived: "active",
  sort: "updated-desc",
});
export const threadKey = (hostId, threadId) =>
  JSON.stringify([hostId || "local", threadId]);
export function normalizeTags(value) {
  const result = [],
    seen = new Set();
  for (const item of Array.isArray(value)
    ? value
    : String(value ?? "").split(/[,，]/)) {
    const tag = String(item).trim().normalize("NFC");
    if (!tag) continue;
    if ([...tag].length > 32) throw new Error("每个标签最多 32 个字符");
    const key = tag.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(tag);
    }
  }
  if (result.length > 20) throw new Error("每个对话最多 20 个标签");
  return result;
}
export function parseQuery(query) {
  const include = [],
    exclude = [];
  let index = 0;
  while (index < query.length) {
    if (/\s/.test(query[index])) {
      index++;
      continue;
    }
    let negative = query[index] === "-";
    if (negative) index++;
    let token = "",
      quoted = query[index] === '"';
    if (quoted) index++;
    let closed = !quoted;
    while (index < query.length) {
      const char = query[index++];
      if (char === "\\" && index < query.length) {
        token += query[index++];
        continue;
      }
      if (quoted && char === '"') {
        closed = true;
        break;
      }
      if (!quoted && /\s/.test(char)) break;
      token += char;
    }
    if (!closed) throw new Error("引号未闭合，请补全精确短语");
    if (token.trim())
      (negative ? exclude : include).push(token.trim().toLowerCase());
  }
  return { include: [...new Set(include)], exclude: [...new Set(exclude)] };
}
export function absoluteTimestamp(value) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "时间未知";
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
export function displayTimestamp(value, now = Date.now()) {
  const time = new Date(value).getTime();
  if (!Number.isFinite(time)) return "时间未知";
  const elapsed = now - time;
  if (elapsed < 0 || elapsed >= 3600000) return absoluteTimestamp(time);
  return elapsed < 60000 ? "刚刚" : `${Math.floor(elapsed / 60000)} 分钟前`;
}
export function normalizeThread(value, hostId = "local", archived = false) {
  const thread = value.thread ?? value;
  return {
    id: thread.id ?? thread.conversationId,
    hostId: thread.hostId ?? hostId,
    title:
      thread.name?.trim() || thread.title?.trim() || thread.preview || "新聊天",
    project: thread.cwd ?? thread.projectPath ?? "",
    createdAt:
      thread.createdAtMs ??
      (thread.createdAt == null ? null : thread.createdAt * 1000),
    updatedAt:
      thread.updatedAtMs ??
      (thread.updatedAt == null ? null : thread.updatedAt * 1000),
    status: thread.status?.type ?? thread.status ?? "idle",
    archived,
  };
}
export function filterThreads(
  rows,
  filters,
  metadata = {},
  { now = Date.now(), contentMatched = false } = {},
) {
  const f = { ...DEFAULT_FILTERS, ...filters },
    query = parseQuery(f.query);
  const tags = normalizeTags(f.tags).map((t) => t.toLowerCase());
  const excluded = normalizeTags(f.excludeTags).map((t) => t.toLowerCase());
  const from = f.from ? new Date(f.from).getTime() : -Infinity;
  const to = f.to ? new Date(f.to).getTime() : Infinity;
  if (Number.isNaN(from) || Number.isNaN(to) || from > to)
    throw new Error("请填写有效的起止时间，开始时间不能晚于结束时间");
  const periodStart =
    f.period === "all" ? -Infinity : now - Number(f.period) * 86400000;
  return rows
    .filter((row) => {
      const ownTags = (metadata[threadKey(row.hostId, row.id)]?.tags ?? []).map(
        (t) => t.toLowerCase(),
      );
      const title = String(row.title ?? "").toLowerCase();
      const time = f.sort.startsWith("created")
        ? row.createdAt
        : (row.updatedAt ?? row.createdAt);
      if (
        !contentMatched &&
        ((query.include.length &&
          !(f.match === "any"
            ? query.include.some((t) => title.includes(t))
            : query.include.every((t) => title.includes(t)))) ||
          query.exclude.some((t) => title.includes(t)))
      )
        return false;
      if (
        f.project &&
        !String(row.project).toLowerCase().includes(f.project.toLowerCase())
      )
        return false;
      if (f.host && row.hostId !== f.host) return false;
      if (f.status && row.status !== f.status) return false;
      if (
        f.archived !== "all" &&
        Boolean(row.archived) !== (f.archived === "archived")
      )
        return false;
      if (
        (from !== -Infinity || to !== Infinity || periodStart !== -Infinity) &&
        (!Number.isFinite(time) ||
          time < Math.max(from, periodStart) ||
          time > to)
      )
        return false;
      if (f.untagged && ownTags.length) return false;
      if (
        tags.length &&
        !(f.tagMatch === "any"
          ? tags.some((t) => ownTags.includes(t))
          : tags.every((t) => ownTags.includes(t)))
      )
        return false;
      return !excluded.some((t) => ownTags.includes(t));
    })
    .sort((a, b) => {
      if (f.sort === "title")
        return (
          a.title.localeCompare(b.title, "zh-CN") ||
          threadKey(a.hostId, a.id).localeCompare(threadKey(b.hostId, b.id))
        );
      const field = f.sort.startsWith("created") ? "createdAt" : "updatedAt";
      const delta =
        (a[field] ?? a.createdAt ?? 0) - (b[field] ?? b.createdAt ?? 0);
      return (
        (f.sort.endsWith("asc") ? delta : -delta) ||
        threadKey(a.hostId, a.id).localeCompare(threadKey(b.hostId, b.id))
      );
    });
}
export async function collectPages(
  request,
  method,
  params,
  { signal, onProgress = () => {} } = {},
) {
  const rows = [],
    cursors = new Set();
  let cursor = null;
  do {
    signal?.throwIfAborted();
    const page = await request(
      method,
      { ...params, cursor, limit: 100 },
      { signal },
    );
    if (!Array.isArray(page.data)) throw new Error("历史记录响应格式无效");
    rows.push(...page.data);
    onProgress(rows.length);
    cursor = page.nextCursor ?? null;
    if (cursor !== null && cursors.has(cursor))
      throw new Error("历史记录分页重复，加载尚未完成");
    if (cursor !== null) cursors.add(cursor);
  } while (cursor !== null);
  signal?.throwIfAborted();
  return rows;
}
export async function searchHistory(request, filters, options = {}) {
  const f = { ...DEFAULT_FILTERS, ...filters },
    terms = parseQuery(f.query);
  const archives =
    f.archived === "all" ? [false, true] : [f.archived === "archived"];
  const result = new Map();
  for (const archived of archives) {
    const base = { archived, sortKey: "updated_at", sortDirection: "desc" };
    const read = async (term) =>
      (
        await collectPages(
          request,
          term ? "thread/search" : "thread/list",
          { ...base, ...(term ? { searchTerm: term } : {}) },
          options,
        )
      ).map((t) => normalizeThread(t, "local", archived));
    let rows;
    if (f.scope === "content" && terms.include.length) {
      const matches = [];
      for (const term of terms.include) matches.push(await read(term));
      const sets = matches.map((rows) => new Set(rows.map((r) => r.id)));
      rows =
        f.match === "any"
          ? matches.flat()
          : matches[0].filter((r) => sets.every((s) => s.has(r.id)));
    } else rows = await read(null);
    if (f.scope === "content")
      for (const term of terms.exclude) {
        const excluded = new Set((await read(term)).map((r) => r.id));
        rows = rows.filter((r) => !excluded.has(r.id));
      }
    for (const row of rows) result.set(threadKey(row.hostId, row.id), row);
  }
  return [...result.values()];
}

// Paired jewel tones retain readable light text on dark and light themes.
export const TAG_PALETTE = Object.freeze([
  ["#385f96", "#2e4e7c"], ["#465b9b", "#394a80"],
  ["#61529a", "#50437f"], ["#79508f", "#644276"],
  ["#914f80", "#774169"], ["#99556a", "#7e4657"],
  ["#965750", "#7c4842"], ["#966247", "#7c513b"],
  ["#876c38", "#70592e"], ["#75713a", "#605d30"],
  ["#5c7546", "#4c603a"], ["#43795c", "#37644c"],
  ["#38796f", "#2e645c"], ["#397584", "#2f606d"],
  ["#456d8b", "#395a73"], ["#626980", "#51576a"],
].map(pair => Object.freeze(pair)));
export function tagAppearance(tag) {
  const key = String(tag).normalize("NFKC").trim().toLowerCase();
  let hash = 2166136261;
  for (const char of key) hash = Math.imul(hash ^ char.codePointAt(0), 16777619) >>> 0;
  const [start, end] = TAG_PALETTE[hash % TAG_PALETTE.length];
  return { background: `linear-gradient(135deg, ${start}, ${end})`, color: "#f7f8fc" };
}
