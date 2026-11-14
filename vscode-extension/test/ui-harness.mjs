import React from "react";
import { createRoot } from "react-dom/client";
import {
  getChatManagerUI,
  useChatManager,
} from "../overrides/webview/assets/chat-manager-ui.js";
import {
  configureTransport,
  consumeMessage,
  rememberTitle,
} from "../overrides/webview/assets/chat-manager-store.js";
import {
  normalizeThread,
  threadKey,
} from "../overrides/webview/assets/chat-manager-core.js";

const ui = getChatManagerUI(React),
  h = React.createElement;
configureTransport((message) => {
  fetch("/api", { method: "POST", body: JSON.stringify(message) })
    .then((r) => r.json())
    .then(consumeMessage);
});
const fixture = await (await fetch("/fixtures")).json();
function App() {
  const state = useChatManager(React);
  const [open, setOpen] = React.useState(true);
  const [names, setNames] = React.useState({});
  const rows = fixture.slice(0, 4).map((r) => normalizeThread(r));
  function renderRow(row) {
    const title =
      state.titles[threadKey(row.hostId, row.id)] ?? names[row.id] ?? row.title;
    return h(
      ui.RowEnhancements,
      {
        hostId: row.hostId,
        threadId: row.id,
        title,
        rename: async (name) => {
          const reply = await (
            await fetch("/rename", {
              method: "POST",
              body: JSON.stringify({ id: row.id, name }),
            })
          ).json();
          if (reply.error) throw Error(reply.error);
          rememberTitle(row.hostId, row.id, name);
          setNames((n) => ({ ...n, [row.id]: name }));
          return true;
        },
      },
      (tags) =>
        h(
          "div",
          {
            className: "fixture-row",
            role: "button",
            tabIndex: 0,
            onClick: () => {},
          },
          h(
            "span",
            { className: "cm-inline-title" },
            h("span", { className: "cm-title-text" }, title),
            tags,
          ),
          h(ui.Timestamp, { value: row.updatedAt }),
        ),
    );
  }
  return h(
    "main",
    null,
    h("h2", null, "Codex · 聊天管理"),
    open
      ? h(ui.SearchPanel, {
          rows,
          renderRow,
          autoFocus: true,
          onClose: () => setOpen(false),
        })
      : h("button", { onClick: () => setOpen(true) }, "打开聊天搜索"),
  );
}
createRoot(document.getElementById("root")).render(h(App));
