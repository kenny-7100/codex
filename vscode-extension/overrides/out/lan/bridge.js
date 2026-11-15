// Injected before the original Webview entry. Keep its host protocol unchanged.
(() => {
  const id = __CLIENT_ID__,
    windowId = __WINDOW_ID__;
  window.__jimaoLan = true;
    // Keep scrolling, but suppress browser zoom gestures on mobile.
    for (const type of ["gesturestart", "gesturechange", "gestureend"])
      document.addEventListener(type, (e) => e.preventDefault(), { passive: false });
    document.addEventListener("touchmove", (e) => {
      if (e.touches.length > 1) e.preventDefault();
    }, { passive: false });
    document.addEventListener("dblclick", (e) => {
      if (matchMedia("(pointer: coarse)").matches) e.preventDefault();
    });

  const routeKey = "jimao-route-" + windowId;
  const route = sessionStorage.getItem(routeKey);
  if (route && !document.querySelector('meta[name="initial-route"]')) {
    const meta = document.createElement("meta");
    meta.name = "initial-route";
    meta.content = route;
    document.head.append(meta);
  }
  window.addEventListener("jimao-route", (e) =>
    sessionStorage.setItem(routeKey, e.detail),
  );

  if (!crypto.randomUUID)
    crypto.randomUUID = () =>
      "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16),
      );
  const revive = (k, v) =>
    v && v.__jimaoBytes ? new Uint8Array(v.__jimaoBytes) : v;
  const encode = (k, v) =>
    v instanceof Uint8Array ? { __jimaoBytes: Array.from(v) } : v;
  let queue = Promise.resolve(),
    connected = false,
    waiting = [];
  function status(text) {
    parent.postMessage(
      { type: "jimao-connection", status: text },
      location.origin,
    );
  }
  let recovering = false;
  function recover() {
    if (recovering) return;
    recovering = true;
    connected = false;
    events.close();
    status("连接中断，正在恢复…");
    const retry = async () => {
      try {
        const response = await fetch("/health", { cache: "no-store" });
        if (!response.ok) throw Error();
        parent.postMessage(
          { type: "jimao-reconnect", windowId },
          location.origin,
        );
      } catch {
        setTimeout(retry, 1000);
      }
    };
    setTimeout(retry, 500);
  }
  window.addEventListener("offline", recover);
  function send(message) {
    queue = queue
      .then(async () => {
        const r = await fetch("/message/" + id, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(message, encode),
        });
        if (!r.ok) throw Error("窗口连接中断");
      })
      .catch(() => recover());
  }
  window.acquireVsCodeApi = () => ({
    postMessage(message) {
      if (message.type === "open-in-browser") {
        window.open(message.url, "_blank", "noopener");
        return;
      }
      connected ? send(message) : waiting.push(message);
    },
    getState() {
      try {
        return JSON.parse(sessionStorage.getItem("jimao-state-" + windowId));
      } catch {
        return null;
      }
    },
    setState(state) {
      sessionStorage.setItem("jimao-state-" + windowId, JSON.stringify(state));
      return state;
    },
  });
  let opened = false;
  const events = new EventSource("/events/" + id);
  events.onopen = () => {
    if (opened) {
      events.close();
      parent.postMessage(
        { type: "jimao-reconnect", windowId },
        location.origin,
      );
      return;
    }
    opened = true;
    connected = true;
    status("已连接");
    for (const message of waiting) send(message);
    waiting = [];
  };
  events.onerror = recover;
  events.addEventListener("offline", () => {
    events.close();
    status("窗口已断开");
  });
  events.addEventListener("message", (e) => {
    if (recovering) return;
    const message = JSON.parse(e.data, revive);
    if (message.type === "jimao-pick-images") {
      pick(message.requestId);
      return;
    }
    window.dispatchEvent(
      new MessageEvent("message", {
        data: message,
        origin: location.origin,
        source: window,
      }),
    );
  });
  async function pick(requestId) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg,image/webp,image/gif";
    input.multiple = true;
    input.oncancel = () =>
      send({ type: "jimao-picked-images", requestId, files: [] });
    input.onchange = async () => {
      try {
        const files = await Promise.all(
          [...input.files].map(
            (file) =>
              new Promise((resolve, reject) => {
                if (
                  ![
                    "image/png",
                    "image/jpeg",
                    "image/webp",
                    "image/gif",
                  ].includes(file.type)
                )
                  return reject(Error("仅支持 PNG、JPEG、WebP 和 GIF 图片"));
                if (file.size > 10 * 1024 * 1024)
                  return reject(Error("单张图片不能超过 10 MB"));
                const r = new FileReader();
                r.onload = () => resolve({ name: file.name, data: r.result });
                r.onerror = reject;
                r.readAsDataURL(file);
              }),
          ),
        );
        send({ type: "jimao-picked-images", requestId, files });
      } catch (e) {
        alert(e.message);
        send({ type: "jimao-picked-images", requestId, files: [] });
      }
    };
    input.click();
  }
  // Limit the original attachment picker to phase-one image uploads.
  document.addEventListener(
    "click",
    (event) => {
      const input = event.target;
      if (input instanceof HTMLInputElement && input.type === "file")
        input.accept = "image/png,image/jpeg,image/webp,image/gif";
    },
    true,
  );
  document.addEventListener(
    "change",
    (event) => {
      const input = event.target;
      if (
        !(input instanceof HTMLInputElement) ||
        input.type !== "file" ||
        !input.files
      )
        return;
      const files = [...input.files];
      if (
        files.some(
          (f) =>
            !["image/png", "image/jpeg", "image/webp", "image/gif"].includes(
              f.type,
            ) || f.size > 10 * 1024 * 1024,
        ) ||
        files.reduce((n, f) => n + f.size, 0) > 16 * 1024 * 1024
      ) {
        event.stopImmediatePropagation();
        input.value = "";
        alert(
          "仅支持 PNG、JPEG、WebP 和 GIF 图片，单张最多 10 MB，一次最多 16 MB。",
        );
      }
    },
    true,
  );
  document.documentElement.classList.add("vscode-dark");
  document.documentElement.dataset.theme = "dark";
  const style = document.createElement("style");
  style.textContent =
    ":root{color-scheme:dark;--vscode-foreground:#ddd;--vscode-editor-background:#181818;--vscode-sideBar-background:#181818;--vscode-input-background:#242424;--vscode-input-foreground:#ddd;--vscode-dropdown-background:#242424;--vscode-dropdown-foreground:#ddd;--vscode-button-foreground:#181818;--vscode-button-background:#ddd;--vscode-list-hoverBackground:#2a2d2e;--vscode-list-hoverForeground:#ddd;--vscode-list-activeSelectionBackground:#37373d;--vscode-list-activeSelectionForeground:#fff;--vscode-list-inactiveSelectionBackground:#303034;--vscode-list-inactiveSelectionForeground:#ddd;--vscode-list-focusBackground:#303034;--vscode-list-focusForeground:#ddd;--vscode-toolbar-hoverBackground:#343434;--vscode-toolbar-activeBackground:#404040;--vscode-focusBorder:#409cff;--vscode-font-family:system-ui;--vscode-font-size:13px}._attached_1ugo6_36{padding-block:0!important;margin-top:calc(var(--composer-rail-below)*8px)!important;margin-bottom:calc(var(--composer-rail-above)*8px)!important;border-radius:16px}html,body{touch-action:pan-x pan-y}body{background:#181818;color:#ddd}@media(pointer:coarse){input,textarea,select,[contenteditable=true],[role=textbox]{font-size:16px!important}}";
  document.head.append(style);
})();
