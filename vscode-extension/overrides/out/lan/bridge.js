// Injected before the original Webview entry. Keep its host protocol unchanged.
(() => {
  const id = __CLIENT_ID__,
    windowId = __WINDOW_ID__,
    initialRoute = __INITIAL_ROUTE__;
  window.__jimaoLan = true;
  // Keep scrolling, but suppress browser zoom gestures on mobile.
  for (const type of ["gesturestart", "gesturechange", "gestureend"])
    document.addEventListener(type, (e) => e.preventDefault(), {
      passive: false,
    });
  document.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length > 1) e.preventDefault();
    },
    { passive: false },
  );
  document.addEventListener("dblclick", (e) => {
    if (matchMedia("(pointer: coarse)").matches) e.preventDefault();
  });

  const routeKey = "jimao-route-" + windowId;
  let route = initialRoute || sessionStorage.getItem(routeKey);
  if (initialRoute) sessionStorage.setItem(routeKey, initialRoute);
  // A diff requires transient content, so stale diff routes return to the chat.
  if (/^\/diff(?:[/?#]|$)/.test(String(route))) {
    route = sessionStorage.getItem(routeKey + "-chat") || "/";
    sessionStorage.setItem(routeKey, route);
  }
  window.__jimaoReturnToChat = () => {
    const chat = sessionStorage.getItem(routeKey + "-chat") || "/";
    sessionStorage.setItem(
      routeKey,
      /^\/diff(?:[/?#]|$)/.test(chat) ? "/" : chat,
    );
    parent.postMessage({ type: "jimao-reconnect", windowId }, location.origin);
  };
  if (route && !document.querySelector('meta[name="initial-route"]')) {
    const meta = document.createElement("meta");
    meta.name = "initial-route";
    meta.content = route;
    document.head.append(meta);
  }
  window.addEventListener("jimao-route", (e) => {
    sessionStorage.setItem(routeKey, e.detail);
    if (e.detail === "/" || String(e.detail).startsWith("/local/")) {
      sessionStorage.setItem(routeKey + "-chat", e.detail);
      parent.postMessage(
        { type: "jimao-route", windowId, clientId: id, route: e.detail },
        location.origin,
      );
    }
  });

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
    terminal = false;
  let received = 0,
    outgoing = 0,
    events,
    recovering = false,
    epoch = 0;
  let ackTimer,
    retryTimer,
    lastHeartbeat = Date.now();
  function status(text) {
    parent.postMessage(
      { type: "jimao-connection", status: text },
      location.origin,
    );
  }
  async function request(url, data) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      return await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data, encode),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
  }
  function reset() {
    if (terminal) return;
    terminal = true;
    ++epoch;
    connected = false;
    events?.close();
    clearTimeout(ackTimer);
    clearTimeout(retryTimer);
    parent.postMessage({ type: "jimao-reconnect", windowId }, location.origin);
  }
  function expired(response) {
    if ([404, 409, 410].includes(response.status)) {
      reset();
      return true;
    }
    return false;
  }
  function acknowledge() {
    if (ackTimer || terminal || !connected) return;
    ackTimer = setTimeout(async () => {
      ackTimer = null;
      if (!connected || terminal) return;
      try {
        const response = await request("/ack/" + id, { received });
        if (!expired(response) && !response.ok) recover();
      } catch {
        recover();
      }
    }, 250);
  }
  function recover() {
    if (recovering || terminal) return;
    recovering = true;
    const attempt = ++epoch;
    connected = false;
    events?.close();
    events = null;
    clearTimeout(ackTimer);
    ackTimer = null;
    status("连接中断，正在恢复…");
    const retry = async () => {
      if (terminal || attempt !== epoch) return;
      try {
        const response = await request("/resume/" + id, { received });
        if (terminal || attempt !== epoch) return;
        if (expired(response)) return;
        if (!response.ok) throw Error("Transport unavailable");
        const stream = (events = new EventSource(
          "/events/" + id + "?after=" + received,
        ));
        let ready = false;
        const failed = () => {
          if (events !== stream || terminal) return;
          stream.close();
          events = null;
          connected = false;
          recovering = true;
          clearTimeout(retryTimer);
          retryTimer = setTimeout(retry, 1000);
          status("连接中断，正在恢复…");
        };
        stream.onerror = failed;
        stream.addEventListener("reset", reset);
        stream.addEventListener("offline", reset);
        stream.addEventListener("heartbeat", () => {
          if (events !== stream) return;
          lastHeartbeat = Date.now();
          acknowledge();
        });
        stream.addEventListener("message", (e) => {
          if (events !== stream || terminal) return;
          const sequence = Number(e.lastEventId);
          if (sequence <= received) return;
          if (!Number.isSafeInteger(sequence) || sequence !== received + 1) {
            reset();
            return;
          }
          try {
            const message = JSON.parse(e.data, revive);
            if (message.type === "jimao-pick-images") pick(message.requestId);
            else
              window.dispatchEvent(
                new MessageEvent("message", {
                  data: message,
                  origin: location.origin,
                  source: window,
                }),
              );
            received = sequence;
            acknowledge();
          } catch {
            reset();
          }
        });
        stream.addEventListener("ready", () => {
          if (events !== stream || terminal) return;
          clearTimeout(retryTimer);
          ready = true;
          recovering = false;
          connected = true;
          lastHeartbeat = Date.now();
          status("已连接");
          acknowledge();
        });
        // A fetch may succeed while the event stream itself stalls.
        retryTimer = setTimeout(() => {
          if (!ready) failed();
        }, 10000);
      } catch {
        if (!terminal && attempt === epoch)
          retryTimer = setTimeout(retry, 1000);
      }
    };
    retry();
  }
  function send(message) {
    const sequence = ++outgoing;
    queue = queue
      .then(async () => {
        while (!terminal) {
          if (!connected) {
            await new Promise((r) => setTimeout(r, 100));
            continue;
          }
          try {
            const response = await request("/message/" + id, {
              sequence,
              message,
            });
            if (expired(response)) return;
            if (response.ok) return;
          } catch {}
          // The server may have accepted this sequence before its response was
          // lost. Retry the same sequence after resume, never submit it twice.
          recover();
        }
      })
      .catch(reset);
  }
  window.acquireVsCodeApi = () => ({
    postMessage(message) {
      if (message.type === "open-in-browser") {
        window.open(message.url, "_blank", "noopener");
        return;
      }
      send(message);
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
  window.addEventListener("offline", recover);
  window.addEventListener("online", recover);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") recover();
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) recover();
  });
  window.addEventListener("pagehide", () => {
    // Do not destroy the host's virtual Webview on BFCache/mobile suspension.
    ++epoch;
    events?.close();
    events = null;
    connected = false;
    recovering = false;
    clearTimeout(retryTimer);
    clearTimeout(ackTimer);
    ackTimer = null;
  });
  setInterval(() => {
    if (document.visibilityState !== "visible" || terminal) return;
    if (connected && Date.now() - lastHeartbeat > 15000) recover();
    else acknowledge();
  }, 5000);
  recover();
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
  // The iframe is sized by the outer visual viewport; do not subtract keyboard
  // height a second time here. Portals remain free to position inside this box.
  const layout = document.createElement("style");
  layout.textContent = `
    html, body { margin: 0 !important; width: 100%; height: 100%;
      min-height: 0; overflow: hidden !important; overscroll-behavior: none; }
    body { position: fixed; inset: 0; }
    #root { height: 100%; max-height: 100%; min-height: 0; overflow: hidden; }
    /* Home history yields space to the composer when the keyboard opens. */
    [data-jimao-home-header] { display: flex; flex-direction: column;
      flex: 0 1 auto; min-height: 32px; overflow: hidden; }
    [data-jimao-home-header] > :first-child { flex-shrink: 0; }
    [data-jimao-home-header] > :last-child { min-height: 0;
      overflow-x: hidden; overflow-y: auto; }
    [data-jimao-home-header] + div { height: auto; min-height: 0; flex: 1 0 auto; }
    body * { overscroll-behavior-x: contain; overscroll-behavior-y: contain; }
  `;
  document.head.append(layout);
})();
