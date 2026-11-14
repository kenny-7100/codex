import {
  DEFAULT_FILTERS,
  absoluteTimestamp,
  displayTimestamp,
  filterThreads,
  normalizeTags,
  searchHistory,
  threadKey,
} from "./chat-manager-core.js";
import {
  getSnapshot,
  subscribe,
  hydrate,
  metadataRequest,
  nativeRequest,
  rememberTitle,
} from "./chat-manager-store.js";

const PAGE_SIZE = 10;
const instances = new WeakMap();
let requestedTag = null;
export function useChatManager(React) {
  return React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
export function getChatManagerUI(React) {
  if (instances.has(React)) return instances.get(React);
  const h = React.createElement;
  function useStyles() {
    React.useInsertionEffect(() => {
      if (document.getElementById("codexx-chat-manager-styles")) return;
      const style = document.createElement("style");
      style.id = "codexx-chat-manager-styles";
      style.textContent = CSS;
      document.head.append(style);
    }, []);
  }
  function useMetadata() {
    useStyles();
    const state = useChatManager(React),
      [error, setError] = React.useState("");
    React.useEffect(() => {
      hydrate().catch((e) => setError(e.message));
    }, []);
    return [state, error];
  }
  function Timestamp({ dateString, value }) {
    const time = value ?? dateString;
    const [now, setNow] = React.useState(Date.now);
    React.useEffect(() => {
      const timer = setInterval(() => setNow(Date.now()), 15000);
      return () => clearInterval(timer);
    }, []);
    return h(
      "time",
      {
        className: "cm-timestamp",
        dateTime: Number.isFinite(new Date(time).getTime())
          ? new Date(time).toISOString()
          : undefined,
        title: absoluteTimestamp(time),
      },
      displayTimestamp(time, now),
    );
  }
  const stop = (e) => e.stopPropagation();
  const button = (label, onClick, props = {}) =>
    h("button", { type: "button", onClick, ...props }, label);
  function RowEnhancements({
    hostId = "local",
    threadId,
    title,
    rename,
    children,
  }) {
    const [state, hydrationError] = useMetadata();
    const [editing, setEditing] = React.useState(null),
      [draft, setDraft] = React.useState("");
    const [busy, setBusy] = React.useState(false),
      [error, setError] = React.useState("");
    const ownTags = state.threads[threadKey(hostId, threadId)]?.tags ?? [];
    const input = React.useRef(null);
    React.useEffect(() => {
      if (editing) {
        input.current?.focus();
        input.current?.select();
      }
    }, [editing]);
    async function save(e) {
      e.preventDefault();
      e.stopPropagation();
      setError("");
      setBusy(true);
      try {
        if (editing === "name") {
          const name = draft.trim();
          if (!name || [...name].length > 60)
            throw new Error("聊天名称需为 1–60 个字符");
          const acknowledged = await rename(name);
          if (acknowledged === false) throw new Error("名称未保存，请重试");
          rememberTitle(hostId, threadId, name);
        } else
          await metadataRequest("setTags", {
            hostId,
            threadId,
            tags: normalizeTags(draft),
          });
        setEditing(null);
      } catch (e) {
        setError(e.message);
      } finally {
        setBusy(false);
      }
    }
    const begin = (kind) => {
      setError("");
      setDraft(kind === "name" ? title : ownTags.join(", "));
      setEditing(kind);
    };
    const tagBadges =
      ownTags.length > 0 &&
      h(
        "span",
        { className: "cm-row-tags", onPointerDown: stop, onKeyDown: stop },
        ownTags.map((tag) =>
          button(
            tag,
            (event) => {
              event.preventDefault();
              event.stopPropagation();
              requestedTag = tag;
              window.dispatchEvent(new CustomEvent("open-recent-tasks-menu"));
              window.dispatchEvent(
                new CustomEvent("codexx-filter-tag", { detail: tag }),
              );
            },
            {
              key: tag,
              className: "cm-tag",
              title: `筛选标签：${tag}`,
            },
          ),
        ),
      );
    return h(
      "div",
      { "className": "cm-chat-row", "data-chat-id": threadId, "onClick": stop },
      editing
        ? h(
            "form",
            {
              className: "cm-row-editor",
              onSubmit: save,
              onKeyDown: (e) => {
                e.stopPropagation();
                if (e.key === "Escape" && !busy) setEditing(null);
              },
            },
            h(
              "label",
              null,
              editing === "name" ? "聊天名称" : "标签（用逗号分隔）",
              h("input", {
                ref: input,
                value: draft,
                onChange: (e) => setDraft(e.target.value),
                disabled: busy,
                maxLength: editing === "name" ? 120 : 1000,
                list: editing === "tags" ? "cm-known-tags" : undefined,
              }),
            ),
            h(
              "div",
              { className: "cm-row-editor-actions" },
              h(
                "button",
                { type: "submit", disabled: busy },
                busy ? "保存中…" : "保存",
              ),
              button("取消", () => setEditing(null), { disabled: busy }),
            ),
            editing === "tags" &&
              h(
                "small",
                null,
                "每个对话最多 20 个标签，每个标签最多 32 个字符。",
              ),
          )
        : h(
            React.Fragment,
            null,
            h(
              "div",
              { className: "cm-original-row" },
              typeof children === "function" ? children(tagBadges) : children,
            ),
            h(
              "div",
              { className: "cm-row-actions" },
              button("✎", () => begin("name"), {
                "aria-label": "重命名聊天",
                "title": "重命名聊天",
                "disabled": !rename,
              }),
              button("#", () => begin("tags"), {
                "aria-label": "编辑标签",
                "title": "编辑标签",
                "disabled": !state.ready,
              }),
            ),
          ),
      (error || hydrationError) &&
        h(
          "div",
          { className: "cm-error", role: "alert" },
          error || hydrationError,
        ),
    );
  }
  // Keep the search surface limited to name, dates and tags. Sorting belongs to the list.
  function SearchPanel({
    rows: recentRows,
    renderRow,
    onClose,
    autoFocus = false,
    request = nativeRequest,
  }) {
    const [state, hydrationError] = useMetadata();
    const cleanFilters = (value) => ({
      ...DEFAULT_FILTERS,
      ...Object.fromEntries(
        ["query", "from", "to", "tags", "sort"].map((key) => [
          key,
          value?.[key] ?? DEFAULT_FILTERS[key],
        ]),
      ),
    });
    const [filters, setFilters] = React.useState(() => ({
      ...cleanFilters(getSnapshot().lastFilters),
      ...(requestedTag ? { tags: requestedTag } : {}),
    }));
    const [page, setPage] = React.useState(1);
    const resultsRef = React.useRef(null);
    React.useEffect(() => setPage(1), [filters]);
    const [initialized, setInitialized] = React.useState(getSnapshot().ready);
    const [history, setHistory] = React.useState(null),
      [busy, setBusy] = React.useState(false),
      [error, setError] = React.useState("");
    const [tagManager, setTagManager] = React.useState(false),
      [selectedTag, setSelectedTag] = React.useState(""),
      [newTagName, setNewTagName] = React.useState(""),
      [confirmDelete, setConfirmDelete] = React.useState(false);
    const abortRef = React.useRef(null),
      mounted = React.useRef(true);
    React.useEffect(() => {
      mounted.current = true;
      load();
      return () => {
        mounted.current = false;
        abortRef.current?.abort();
      };
    }, []);
    React.useEffect(() => {
      if (state.ready && !initialized) {
        setFilters({
          ...cleanFilters(state.lastFilters),
          ...(requestedTag ? { tags: requestedTag } : {}),
        });
        setInitialized(true);
        requestedTag = null;
      }
    }, [state.ready, initialized]);
    React.useEffect(() => {
      const handle = (e) => {
        requestedTag = null;
        setFilters((f) => ({ ...f, tags: e.detail }));
      };
      if (requestedTag && initialized) {
        setFilters((f) => ({ ...f, tags: requestedTag }));
        requestedTag = null;
      }
      window.addEventListener("codexx-filter-tag", handle);
      return () => window.removeEventListener("codexx-filter-tag", handle);
    }, [initialized]);
    React.useEffect(() => {
      if (!initialized) return;
      const timer = setTimeout(
        () =>
          metadataRequest("saveFilters", { filters }).catch((e) => {
            if (mounted.current) setError(e.message);
          }),
        600,
      );
      return () => clearTimeout(timer);
    }, [filters, initialized]);
    const set = (field, value) => {
      setFilters((f) => ({ ...f, [field]: value }));
      setError("");
    };
    // Cache full-history filtering; only mount the current ten rows below.
    const { filtered, filterError } = React.useMemo(() => {
      const source = history
        ? [...history, ...recentRows.filter((r) => r.hostId !== "local")]
        : recentRows;
      const unique = new Map(
        source.map((row) => [
          threadKey(row.hostId, row.id),
          {
            ...row,
            title: state.titles[threadKey(row.hostId, row.id)] ?? row.title,
          },
        ]),
      );
      let filtered = [],
        filterError = "";
      // Date filters always apply to update time, regardless of the chosen list order.
      try {
        filtered = filterThreads(
          [...unique.values()],
          { ...filters, sort: "updated-desc" },
          state.threads,
        );
        filtered = filterThreads(
          filtered,
          { sort: filters.sort },
          state.threads,
        );
      } catch (e) {
        filterError = e.message;
      }
      return { filtered, filterError };
    }, [history, recentRows, state.titles, state.threads, filters]);
    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, pageCount);
    const pageRows = filtered.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE,
    );
    React.useEffect(() => {
      setPage((value) => Math.min(value, pageCount));
    }, [pageCount]);
    React.useEffect(() => {
      if (resultsRef.current) resultsRef.current.scrollTop = 0;
    }, [currentPage, filters]);
    const allTags = React.useMemo(
      () =>
        [...new Set(Object.values(state.threads).flatMap((t) => t.tags))].sort(
          (a, b) => a.localeCompare(b, "zh-CN"),
        ),
      [state.threads],
    );
    async function load() {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setBusy(true);
      setPage(1);
      setError("");
      try {
        const rows = await searchHistory(request, DEFAULT_FILTERS, {
          signal: controller.signal,
        });
        if (!controller.signal.aborted && mounted.current) setHistory(rows);
      } catch (e) {
        if (mounted.current && !controller.signal.aborted)
          setError(`聊天加载失败：${e.message}`);
      } finally {
        if (mounted.current && abortRef.current === controller) setBusy(false);
      }
    }
    async function mutate(operation, payload) {
      setError("");
      try {
        await metadataRequest(operation, payload);
        return true;
      } catch (e) {
        setError(e.message);
        return false;
      }
    }
    const field = (label, name, props = {}) =>
      h(
        "label",
        { className: "cm-field", key: name },
        label,
        h("input", {
          value: filters[name],
          onChange: (e) => set(name, e.target.value),
          ...props,
        }),
      );
    return h(
      "section",
      {
        "className": "cm-search-panel",
        "aria-label": "聊天搜索",
        "onKeyDown": (e) => {
          if (e.key === "Escape" && !e.defaultPrevented) onClose?.();
        },
      },
      h(
        "div",
        { className: "cm-search-header" },
        h(
          "label",
          { className: "cm-search-input" },
          h("span", { className: "cm-sr-only" }, "聊天名称"),
          h("input", {
            type: "search",
            placeholder: "按聊天名称搜索",
            value: filters.query,
            autoFocus,
            onChange: (e) => set("query", e.target.value),
          }),
        ),
        button("×", () => onClose?.(), {
          "className": "cm-close",
          "aria-label": "关闭搜索面板",
          "title": "关闭搜索面板",
        }),
      ),
      h(
        "div",
        { className: "cm-filters" },
        field("开始时间", "from", { type: "datetime-local", step: 1 }),
        field("结束时间", "to", { type: "datetime-local", step: 1 }),
        h(
          "div",
          { className: "cm-tags-filter" },
          field("标签", "tags", {
            list: "cm-known-tags",
            placeholder: "选择或输入标签，逗号分隔",
          }),
          button("管理标签", () => setTagManager(!tagManager), {
            "aria-expanded": tagManager,
          }),
        ),
      ),
      h(
        "datalist",
        { id: "cm-known-tags" },
        allTags.map((tag) => h("option", { key: tag, value: tag })),
      ),
      tagManager &&
        h(
          "div",
          { className: "cm-tag-manager" },
          h("strong", null, "标签管理"),
          h(
            "small",
            null,
            "标签保存在本机，同一插件宿主内同步。重命名或删除将更新所有已标记对话。",
          ),
          h(
            "label",
            null,
            "选择标签",
            h(
              "select",
              {
                "aria-label": "选择标签",
                "value": selectedTag,
                "onChange": (e) => {
                  setSelectedTag(e.target.value);
                  setNewTagName(e.target.value);
                  setConfirmDelete(false);
                },
              },
              h("option", { value: "" }, "选择标签"),
              allTags.map((tag) => h("option", { key: tag, value: tag }, tag)),
            ),
          ),
          h("input", {
            "aria-label": "新标签名称",
            "value": newTagName,
            "onChange": (e) => setNewTagName(e.target.value),
            "placeholder": "新的标签名称",
          }),
          button(
            "重命名标签",
            async () => {
              if (
                await mutate("renameTag", {
                  name: selectedTag,
                  newName: newTagName,
                })
              ) {
                const replace = (value) =>
                  normalizeTags(value)
                    .map((t) =>
                      t.toLowerCase() === selectedTag.toLowerCase()
                        ? newTagName.trim()
                        : t,
                    )
                    .join(", ");
                setFilters((f) => ({
                  ...f,
                  tags: replace(f.tags),
                  excludeTags: replace(f.excludeTags),
                }));
                setSelectedTag(newTagName.trim());
              }
            },
            { disabled: !selectedTag || !newTagName.trim() },
          ),
          button("删除标签", () => setConfirmDelete(true), {
            disabled: !selectedTag,
          }),
          confirmDelete &&
            h(
              "div",
              { className: "cm-confirm" },
              `确定从所有对话中删除“${selectedTag}”标签？`,
              button("确定删除", async () => {
                if (await mutate("deleteTag", { name: selectedTag })) {
                  setSelectedTag("");
                  setNewTagName("");
                  setConfirmDelete(false);
                  setFilters((f) => ({
                    ...f,
                    tags: normalizeTags(f.tags)
                      .filter(
                        (t) => t.toLowerCase() !== selectedTag.toLowerCase(),
                      )
                      .join(", "),
                    excludeTags: normalizeTags(f.excludeTags)
                      .filter(
                        (t) => t.toLowerCase() !== selectedTag.toLowerCase(),
                      )
                      .join(", "),
                  }));
                }
              }),
              button("取消删除", () => setConfirmDelete(false)),
            ),
        ),
      (error || filterError || hydrationError) &&
        h(
          "div",
          { className: "cm-error", role: "alert" },
          error || filterError || hydrationError,
        ),
      h(
        "div",
        { "className": "cm-list-toolbar", "aria-label": "聊天列表工具栏" },
        h(
          "span",
          {
            "className": "cm-result-status",
            "role": "status",
            "aria-live": "polite",
          },
          busy
            ? "正在加载聊天…"
            : `${filtered.length} 个聊天${history ? "" : "（仅已加载）"}`,
        ),
        h(
          "label",
          null,
          h("span", { className: "cm-sr-only" }, "排序"),
          h(
            "select",
            {
              "aria-label": "排序",
              "value": filters.sort,
              "onChange": (e) => set("sort", e.target.value),
            },
            [
              ["updated-desc", "最近更新"],
              ["updated-asc", "最早更新"],
              ["created-desc", "最近创建"],
              ["created-asc", "最早创建"],
              ["title", "名称"],
            ].map(([value, text]) => h("option", { key: value, value }, text)),
          ),
        ),
        button("刷新", load, { disabled: busy }),
        button("清空筛选", () => {
          setFilters({ ...DEFAULT_FILTERS, sort: filters.sort });
          setError("");
        }),
      ),
      h(
        "div",
        {
          "ref": resultsRef,
          "className": "cm-results",
          "aria-label": "聊天搜索结果",
          "aria-busy": busy,
        },
        filtered.length
          ? pageRows.map((row) =>
              h(
                "div",
                {
                  "key": threadKey(row.hostId, row.id),
                  "data-result-id": row.id,
                },
                renderRow(row),
              ),
            )
          : h(
              "p",
              { className: "cm-empty" },
              busy ? "正在加载…" : "没有匹配的聊天",
            ),
      ),
      h(
        "nav",
        { "className": "cm-pagination", "aria-label": "聊天分页" },
        button("上一页", () => setPage(currentPage - 1), {
          disabled: currentPage <= 1,
        }),
        h(
          "span",
          { "className": "cm-page-info", "aria-live": "polite" },
          `第 ${currentPage} / ${pageCount} 页 · 每页 ${PAGE_SIZE} 条`,
        ),
        button("下一页", () => setPage(currentPage + 1), {
          disabled: currentPage >= pageCount,
        }),
      ),
    );
  }
  const api = { Timestamp, RowEnhancements, SearchPanel };
  instances.set(React, api);
  return api;
}
const CSS = `
.cm-pagination{display:flex;align-items:center;justify-content:center;gap:10px;flex-shrink:0;padding-top:8px;border-top:1px solid var(--vscode-widget-border,#333)}.cm-page-info{color:var(--vscode-descriptionForeground,#aaa);font-variant-numeric:tabular-nums}
.cm-search-panel{box-sizing:border-box;display:flex;flex-direction:column;gap:9px;width:calc(var(--radix-popper-available-width,100vw) - var(--padding-panel,24px));max-width:1040px;height:min(760px,80vh);max-height:var(--radix-popper-available-height,85vh);min-height:0;padding:12px;color:var(--vscode-foreground,#ddd);font-size:12px;overflow:hidden}
.cm-search-panel *,.cm-chat-row *{box-sizing:border-box}.cm-toolbar,.cm-query-actions,.cm-saved-queries{display:flex;align-items:center;gap:7px;flex-wrap:wrap}.cm-search-header{display:flex;align-items:center;gap:8px;flex-shrink:0}.cm-search-input{flex:1;min-width:0}.cm-search-panel .cm-close{flex-shrink:0;width:32px;height:32px;padding:0;font-size:22px;line-height:1;background:transparent;border-color:transparent}.cm-search-panel .cm-close:hover{background:var(--vscode-toolbar-hoverBackground,#444)}.cm-search-input input{width:100%;font-size:13px!important}.cm-filters{display:grid;grid-template-columns:1fr 1fr 1.3fr;gap:10px;flex-shrink:0}.cm-tags-filter{display:flex;align-items:end;gap:6px;min-width:0}.cm-tags-filter .cm-field{flex:1}.cm-list-toolbar{display:flex;align-items:center;gap:7px;flex-wrap:wrap;padding:8px 0;border-bottom:1px solid var(--vscode-widget-border,#333)}.cm-list-toolbar .cm-result-status{flex:1}.cm-list-toolbar select{max-width:120px}.cm-field{display:flex;flex-direction:column;gap:4px;min-width:0;color:var(--vscode-descriptionForeground,#aaa)}
.cm-search-panel input:not([type=checkbox]),.cm-search-panel select,.cm-row-editor input{min-height:28px;min-width:0;border:1px solid var(--vscode-input-border,#444);border-radius:5px;background:var(--vscode-input-background,#242424);color:var(--vscode-input-foreground,#ddd);padding:5px 7px;font:inherit}.cm-search-panel input:focus,.cm-search-panel select:focus,.cm-row-editor input:focus{outline:1px solid var(--vscode-focusBorder,#409cff)}.cm-search-panel button,.cm-row-editor button,.cm-row-actions button{cursor:pointer;border:1px solid var(--vscode-button-border,#444);border-radius:5px;padding:4px 8px;background:var(--vscode-button-secondaryBackground,#333);color:var(--vscode-button-secondaryForeground,#ddd);font:inherit;white-space:nowrap}.cm-search-panel button:hover,.cm-row-editor button:hover{filter:brightness(1.15)}.cm-search-panel button:disabled,.cm-chat-row button:disabled{opacity:.4;cursor:default}.cm-search-panel .cm-primary{background:var(--vscode-button-background,#176ba8);color:var(--vscode-button-foreground,#fff)}
.cm-checkbox{display:flex;align-items:center;gap:5px}.cm-saved-queries{padding:7px 0;border-top:1px solid var(--vscode-widget-border,#333);border-bottom:1px solid var(--vscode-widget-border,#333)}.cm-saved-queries label{display:flex;align-items:center;gap:6px}.cm-saved-queries>input{flex:1;min-width:120px!important}.cm-result-status{color:var(--vscode-descriptionForeground,#aaa);font-size:11px}.cm-results{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain}.cm-empty{padding:24px 8px;text-align:center;color:var(--vscode-descriptionForeground,#aaa)}.cm-error{color:var(--vscode-errorForeground,#f88);font-size:12px;white-space:normal;padding:5px;grid-column:1/-1}.cm-timestamp{white-space:nowrap;font-variant-numeric:tabular-nums;font-size:11px}.cm-chat-row{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;min-width:0;width:100%;position:relative}.cm-original-row{min-width:0}.cm-row-actions{display:flex;gap:2px;margin-left:3px;opacity:.55}.cm-chat-row:hover .cm-row-actions,.cm-chat-row:focus-within .cm-row-actions{opacity:1}.cm-row-actions button{padding:2px 5px;border-color:transparent;background:transparent;font-size:13px}.cm-row-actions button:hover{background:var(--vscode-toolbar-hoverBackground,#444)}.cm-inline-title{display:flex;align-items:center;gap:6px;min-width:0;max-width:100%}.cm-title-text{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cm-row-tags{display:inline-flex;align-items:center;gap:4px;flex:0 0 auto;max-width:45%;overflow-x:auto;white-space:nowrap;scrollbar-width:none}.cm-row-tags .cm-tag{flex-shrink:0}.cm-tag{font:inherit!important;font-size:10px!important;border:1px solid var(--vscode-badge-background,#445)!important;color:var(--vscode-badge-foreground,#ddd)!important;background:var(--vscode-badge-background,#334)!important;border-radius:9px!important;padding:1px 6px!important;max-width:100%;overflow:hidden;text-overflow:ellipsis;cursor:pointer}.cm-row-editor{grid-column:1/-1;display:flex;flex-wrap:wrap;align-items:end;gap:6px;padding:6px}.cm-row-editor label{flex:1;min-width:120px;font-size:11px;display:flex;flex-direction:column;gap:4px}.cm-row-editor-actions{display:flex;gap:4px}.cm-row-editor small{flex-basis:100%;color:var(--vscode-descriptionForeground,#aaa)}.cm-tag-manager{display:flex;flex-wrap:wrap;align-items:center;gap:7px;max-height:24vh;overflow:auto;padding:8px;background:var(--vscode-editor-background,#222);border:1px solid var(--vscode-widget-border,#444);border-radius:5px;flex-shrink:0}.cm-tag-manager small,.cm-tag-manager strong{flex-basis:100%}.cm-tag-manager label{display:flex;gap:4px;align-items:center}.cm-confirm{flex-basis:100%;display:flex;gap:6px;align-items:center}.cm-sr-only{position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip:rect(0,0,0,0)}
@media(max-width:640px){.cm-search-panel{padding:8px;gap:6px;height:82vh}.cm-filters{grid-template-columns:repeat(2,minmax(0,1fr))}.cm-tags-filter{grid-column:1/-1}.cm-saved-queries{gap:4px}.cm-row-editor-actions{flex-basis:100%}}
`;
