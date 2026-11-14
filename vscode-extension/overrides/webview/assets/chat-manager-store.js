import { DEFAULT_FILTERS, threadKey } from "./chat-manager-core.js";

let snapshot = {
  ready: false,
  revision: -1,
  threads: {},
  savedQueries: [],
  lastFilters: DEFAULT_FILTERS,
  titles: {},
};
const listeners = new Set(),
  pending = new Map();
let transport, hydration;
export const getSnapshot = () => snapshot;
export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
function emit(next) {
  snapshot = next;
  for (const listener of listeners) listener();
}
export function configureTransport(send) {
  transport = send;
}
export function consumeMessage(message) {
  if (
    message.type === "codexx-chat-manager-state" ||
    message.type === "codexx-chat-manager-result"
  ) {
    if (message.state && message.state.revision >= snapshot.revision)
      emit({ ...snapshot, ...message.state, ready: true });
    const task = pending.get(message.requestId);
    if (task)
      message.error
        ? task.reject(new Error(message.error))
        : task.resolve(message.state);
    return true;
  }
  if (
    message.type === "mcp-response" &&
    String(message.message?.id).startsWith("codexx-manager-")
  ) {
    const task = pending.get(String(message.message.id));
    if (task)
      message.message.error
        ? task.reject(new Error(message.message.error.message))
        : task.resolve(message.message.result);
    return true;
  }
  if (
    message.type === "mcp-notification" &&
    message.method === "thread/name/updated"
  ) {
    const p = message.params;
    if (p?.threadId)
      rememberTitle(
        message.hostId || "local",
        p.threadId,
        p.threadName ?? p.name,
      );
  }
  return false;
}
function sendRequest(message, { signal, timeout = 30000 } = {}) {
  return new Promise((resolve, reject) => {
    if (!transport) return reject(new Error("插件宿主尚未就绪，请稍后重试"));
    if (signal?.aborted) return reject(signal.reason ?? new Error("已取消"));
    const id = `codexx-manager-${globalThis.crypto.randomUUID()}`;
    const finish = (callback) => (value) => {
      clearTimeout(timer);
      pending.delete(id);
      signal?.removeEventListener("abort", abort);
      callback(value);
    };
    const abort = () => {
      if (message.type === "mcp-request")
        transport({ type: "mcp-request-abandon", requestId: id });
      pending.get(id)?.reject(signal.reason ?? new Error("已取消"));
    };
    const timer = setTimeout(
      () => pending.get(id)?.reject(new Error("请求超时，请重试")),
      timeout,
    );
    pending.set(id, { resolve: finish(resolve), reject: finish(reject) });
    signal?.addEventListener("abort", abort, { once: true });
    try {
      transport(
        message.type === "mcp-request"
          ? { ...message, request: { ...message.request, id } }
          : { ...message, requestId: id },
      );
    } catch (e) {
      pending.get(id)?.reject(e);
    }
  });
}
export const metadataRequest = (operation, payload = {}) =>
  sendRequest({ type: "codexx-chat-manager", operation, ...payload });
export const nativeRequest = (method, params, options) =>
  sendRequest(
    { type: "mcp-request", hostId: "local", request: { method, params } },
    options,
  );
export function hydrate() {
  return (hydration ??= metadataRequest("read").catch((error) => {
    hydration = null;
    throw error;
  }));
}
export function rememberTitle(hostId, id, name) {
  if (typeof name !== "string") return;
  emit({
    ...snapshot,
    titles: { ...snapshot.titles, [threadKey(hostId, id)]: name },
  });
}
export function visibleTitle(hostId, id, fallback) {
  return snapshot.titles[threadKey(hostId, id)] ?? fallback;
}
