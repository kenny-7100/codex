function Y6(t, e) {
  return t.map((r) => ({ ...r, kind: e }));
}
var Ja,
  J6 = g(() => {
    "use strict";
    BDe();
    $De();
    X6();
    Ja = [...Y6(UDe, "webview"), ...Y6(FDe, "vscode-only"), ...Y6(LDe, "electron-only")];
  });
function Q6({ primaryNumberShortcutTarget: t = "sidebar", isMacOS: e }) {
  let r = { acceleratorModifier: "CmdOrCtrl", keyboardModifier: e ? "meta" : "control" },
    n = { acceleratorModifier: e ? "Ctrl" : "Alt", keyboardModifier: e ? "control" : "alt" };
  return t === "tabs" ? { sidebar: n, tabs: r } : { sidebar: r, tabs: n };
}
var e3 = g(() => {
  "use strict";
});
function Mx(t) {
  return J0t.get(t) ?? t;
}
var J0t,
  t3 = g(() => {
    "use strict";
    J0t = new Map([
      ["1", "!"],
      ["2", "@"],
      ["3", "#"],
      ["4", "$"],
      ["5", "%"],
      ["6", "^"],
      ["7", "&"],
      ["8", "*"],
      ["9", "("],
      ["0", ")"],
      ["-", "_"],
      ["=", "+"],
      ["[", "{"],
      ["]", "}"],
      ["\\", "|"],
      [";", ":"],
      ["'", '"'],
      [",", "<"],
      [".", ">"],
      ["/", "?"],
      ["`", "~"],
    ]);
  });
function Ox(t) {
  return bM.get(t) ?? null;
}
function wM(t) {
  return bM.has(t);
}
function _M(t) {
  return qDe.includes(t) || SM.some((e) => e === t);
}
function Nx(t) {
  return !tDt(t) && !("shortcutConfigurable" in t && t.shortcutConfigurable === !1);
}
function n3(t) {
  if (t.key == null) return !0;
  let e = t.key.trim();
  if (t.command === "browser.toggleAnnotationMode" || t.command === "browser.bookmarkPage") {
    let r = e.split("+").filter((o) => o.length > 0),
      n = r.filter(
        (o) =>
          !/^(?:CmdOrCtrl|CommandOrControl|Command|Cmd|Control|Ctrl|Alt|Option|Shift)$/.test(o),
      );
    return (
      !/\s/.test(e) &&
      n.length === 1 &&
      (r.some((o) =>
        /^(?:CmdOrCtrl|CommandOrControl|Command|Cmd|Control|Ctrl|Alt|Option)$/.test(o),
      ) ||
        n.some((o) => /^F(?:[1-9]|1\d|2[0-4])$/i.test(o)))
    );
  }
  return t.command !== "composer.submit" || !/\s/.test(e);
}
function o3(t, e, r) {
  return t === e ||
    (r.toLowerCase() === "enter" &&
      ((t === "composer.submit" && e === "approval.approve") ||
        (t === "approval.approve" && e === "composer.submit")))
    ? !0
    : Q0t.some((n) => n.includes(t) && n.includes(e));
}
function xM(t) {
  return t in r3 || t === "newTab" || t === "newSidepaneTab" || t === "closeTab";
}
function Lx({ commandId: t, isMacOS: e, primaryNumberShortcutTarget: r, globalTabsEnabled: n }) {
  let o = Ox(t);
  if (o == null || !Nx(o)) return [];
  let i = GDe(o);
  if (i == null) return [];
  if (r == null && SM.some((s) => s === t)) return [];
  if (r != null && (t === "switchToMode1" || t === "switchToMode2" || t === "switchToMode3"))
    return [];
  if (r === "tabs") {
    let s = Q6({ primaryNumberShortcutTarget: r, isMacOS: e !== !1 }),
      a = SM.findIndex((c) => c === t);
    if (a !== -1) return [`${s.tabs.acceleratorModifier}+${a + 1}`];
    let l = qDe.indexOf(t);
    if (l !== -1) return [`${s.sidebar.acceleratorModifier}+${l + 1}`];
  }
  return e && n && r3[t] != null
    ? r3[t]
    : e === !0 && i.platformDefaultKeybindings?.macOS != null
      ? i.platformDefaultKeybindings.macOS.map((s) => s.key)
      : e === !1 && i.platformDefaultKeybindings?.default != null
        ? i.platformDefaultKeybindings.default.map((s) => s.key)
        : i.defaultKeybindings == null
          ? []
          : i.defaultKeybindings.map((s) => s.key);
}
function AM({ commandId: t, keymapState: e, isMacOS: r }) {
  let n = Ox(t);
  if (n == null || !Nx(n)) return [];
  if (e?.primaryNumberShortcutTarget == null && SM.some((s) => s === t)) return [];
  let o = e?.bindings.filter((s) => s.command === t);
  if (o != null && o.length > 0) {
    let s = [];
    for (let a of o) {
      if (a.key == null) return [];
      s.push(a.key);
    }
    return s;
  }
  if (
    t === "composer.submitInBackground" &&
    (e == null || e.bindings.some((s) => s.command !== t && s.key != null && eDt(s.key, r)))
  )
    return [];
  let i = Lx({
    commandId: t,
    isMacOS: r,
    primaryNumberShortcutTarget: e?.primaryNumberShortcutTarget,
    globalTabsEnabled: e?.globalTabsEnabled,
  });
  return t !== "composer.toggleDictation" &&
    i.length <= 1 &&
    !(r && e?.globalTabsEnabled && xM(t)) &&
    t !== "globalDictationHold" &&
    t !== "screenshotToCurrentChat" &&
    t !== "screenshotToNewChat" &&
    t !== "copyLastCodeBlock" &&
    t !== "file.goToDefinition" &&
    t !== "file.findReferences" &&
    t !== "file.navigateBack" &&
    t !== "file.navigateForward" &&
    t !== "toggleSidebar" &&
    t !== "openOrbit" &&
    t !== "browser.toggleAnnotationMode" &&
    t !== "artifact.sendAnnotations" &&
    t !== "nextTab" &&
    t !== "previousTab" &&
    t !== "nextThread" &&
    t !== "previousThread" &&
    t !== "nextRecentThread" &&
    t !== "previousRecentThread" &&
    (t !== "openAvatarOverlay" || r !== !0) &&
    (e?.primaryNumberShortcutTarget == null || !_M(t))
    ? i
    : i.filter(
        (s) =>
          !e?.bindings.some((a) =>
            a.command === t || a.key == null
              ? !1
              : Qa(a.key, r) === Qa(s, r) &&
                !(
                  t !== "composer.toggleDictation" &&
                  a.command !== "composer.toggleDictation" &&
                  wM(a.command) &&
                  o3(t, a.command, s)
                ),
          ),
      );
}
function Qa(t, e, { includeImplicitPlusShift: r = !0 } = {}) {
  let n = (t.trim().split(/\s+/, 1)[0] ?? "").toLowerCase().split("+");
  r && n.includes("plus") && !n.includes("shift") && n.push("shift");
  let o = n.includes("shift");
  return n
    .map((i) => {
      switch (i) {
        case "cmdorctrl":
        case "commandorcontrol":
          return e === !1 ? "ctrl" : "meta";
        case "cmd":
        case "command":
        case "super":
          return "meta";
        case "control":
          return "ctrl";
        case "option":
          return "alt";
        case "esc":
          return "escape";
        default:
          return o ? Mx(i === "plus" ? "+" : i) : i;
      }
    })
    .sort()
    .join("+");
}
function eDt(t, e) {
  let r = t.trim().split(/\s+/, 1)[0]?.toLowerCase().split("+");
  if (r?.length !== 2 || !r.includes("enter")) return !1;
  let n = r[0] === "enter" ? r[1] : r[0];
  return (
    n === "cmdorctrl" ||
    n === "commandorcontrol" ||
    (e !== !1 && (n === "command" || n === "cmd" || n === "super")) ||
    (e !== !0 && (n === "ctrl" || n === "control"))
  );
}
function GDe(t) {
  return t == null || !("electron" in t) || t.electron == null ? null : t.electron;
}
function tDt(t) {
  return t.kind === "vscode-only";
}
function WDe(t) {
  let e = ["showWorkspaceTabView", "toggleMaximizeSidePanel", "toggleSidePanelFullWidth"].find(
    (r) => t.some((n) => n.command === r),
  );
  return t.flatMap((r) =>
    r.command !== "toggleMaximizeSidePanel" && r.command !== "toggleSidePanelFullWidth"
      ? [r]
      : r.command === e
        ? [{ ...r, command: "showWorkspaceTabView" }]
        : [],
  );
}
var Q0t,
  bM,
  qDe,
  SM,
  NUr,
  LUr,
  BUr,
  r3,
  HDe = g(() => {
    "use strict";
    J6();
    e3();
    t3();
    ((Q0t = [
      ["approval.decline", "exitWorkspaceFullView"],
      ["closeTab", "closeWindow"],
      ["goToLine", "focusBrowserAddressBar"],
      ["browser.bookmarkPage", "presentation.duplicateSelection"],
      ["file.goToDefinition", "navigateForward"],
      ["composer.toggleDictation", "globalDictationHold"],
      ["composer.toggleDictation", "globalDictationSingleTap"],
    ]),
      (bM = new Map()));
    for (let t of Ja) {
      if (bM.has(t.id)) throw new Error(`Duplicate Codex command id: ${t.id}`);
      bM.set(t.id, t);
    }
    ((qDe = Ja.filter((t) => t.kind === "webview" && /^thread[1-9]$/.test(t.id)).map((t) => t.id)),
      (SM = Ja.filter((t) => t.kind === "webview" && /^focusTab[1-9]$/.test(t.id)).map(
        (t) => t.id,
      )),
      (NUr = Ja.filter((t) => t.kind === "webview" && /^environmentAction[1-9]$/.test(t.id)).map(
        (t) => t.id,
      )),
      (LUr = Ja.flatMap((t) => {
        let e = GDe(t);
        return e?.menuTitle == null || e.menuTitleIntlId == null ? [] : [e.menuTitleIntlId];
      })),
      (BUr = Ja.flatMap((t) => {
        if (!("vscodeCommand" in t) || t.vscodeCommand == null) return [];
        let { commandId: e = `chatgpt.${t.id}`, ...r } = t.vscodeCommand;
        return [{ commandId: e, ...r }];
      })));
    r3 = {
      closeSidepaneTab: ["Command+Alt+W"],
      closeOtherTabs: [],
      reopenClosedTab: ["Command+Alt+Shift+T"],
      reopenGlobalTab: ["Command+Shift+T"],
    };
  });
var jDe = g(() => {
  "use strict";
  J6();
  HDe();
  X6();
  e3();
  t3();
  JW();
});
function zDe(t, e) {
  let r = t.split("+").filter(Boolean),
    n = null,
    o = !1,
    i = !1,
    s = !1,
    a = !1;
  for (let l of r)
    switch (l.toLowerCase()) {
      case "cmdorctrl":
      case "commandorcontrol":
        e ? (i = !0) : (o = !0);
        break;
      case "command":
      case "cmd":
      case "super":
        i = !0;
        break;
      case "control":
      case "ctrl":
        o = !0;
        break;
      case "alt":
      case "option":
        s = !0;
        break;
      case "shift":
        a = !0;
        break;
      default:
        n = l.toLowerCase();
        break;
    }
  return { key: rDt(n ?? ""), requireCtrl: o, requireMeta: i, requireAlt: s, requireShift: a };
}
function rDt(t) {
  switch (t) {
    case "esc":
    case "escape":
      return "escape";
    case "up":
    case "arrowup":
      return "arrowup";
    case "down":
    case "arrowdown":
      return "arrowdown";
    case "left":
    case "arrowleft":
      return "arrowleft";
    case "right":
    case "arrowright":
      return "arrowright";
    case "pgup":
      return "pageup";
    case "pgdn":
      return "pagedown";
    case "space":
      return " ";
    case "plus":
      return "+";
    default:
      return t;
  }
}
var VDe = g(() => {
  "use strict";
});
function i3() {
  return (0, EM.join)(Xt(), nDt);
}
function YDe() {
  return a3(s3);
}
async function s3() {
  let t = i3();
  try {
    return aDt(t, await (0, Dy.readFile)(t, "utf8"));
  } catch (e) {
    return (
      hDt(e) ||
        XDe().warning("Failed to read command keymap", { safe: {}, sensitive: { error: e } }),
      RM(t)
    );
  }
}
function aDt(t, e) {
  if (e.trim().length === 0) return RM(t);
  try {
    let r = mDt(fDt(sDt.parse(JSON.parse(e))));
    return { supported: !0, keymapPath: t, bindings: pDt(r) };
  } catch (r) {
    return (
      XDe().warning("Failed to parse command keymap", { safe: {}, sensitive: { error: r } }),
      RM(t)
    );
  }
}
function RM(t) {
  return { supported: !0, keymapPath: t, bindings: [] };
}
function JDe(t) {
  return a3(() => lDt(t));
}
async function lDt({
  commandId: t,
  update: e,
  primaryNumberShortcutTarget: r,
  globalTabsEnabled: n,
  onlyIfDefaultAccelerator: o,
}) {
  let i = i3(),
    s = { ...(await s3()), globalTabsEnabled: n, primaryNumberShortcutTarget: r };
  if (!wM(t)) throw new Error("Unknown Codex command");
  let a = Ox(t);
  if (a == null || !Nx(a)) throw new Error(`Codex command is not configurable: ${t}`);
  if (
    (e.type === "set" || e.type === "replace" || e.type === "append") &&
    !n3({ command: t, key: e.accelerator })
  )
    throw new Error("Unsupported shortcut for this command");
  let l = ky(),
    c = AM({ commandId: t, keymapState: s, isMacOS: l });
  if (o != null && (s.bindings.some((h) => h.command === t) || c.length !== 1 || c[0] !== o))
    return s;
  let u = s.bindings,
    p = c;
  switch (e.type) {
    case "set": {
      u = gc(u, t, cDt({ commandId: t, keymapState: s, accelerator: e.accelerator, isMacOS: l }));
      break;
    }
    case "replace":
      ((u = gc(
        u,
        t,
        c.map((h) => (h === e.previousAccelerator ? e.accelerator : h)),
      )),
        (p = [e.previousAccelerator]));
      break;
    case "append":
      ((u = gc(u, t, [...c, e.accelerator])), (p = []));
      break;
    case "remove":
      ((u = gc(
        u,
        t,
        c.filter((h) => h !== e.accelerator),
      )),
        (p = [e.accelerator]));
      break;
    case "clear":
      u = gc(u, t, []);
      break;
    case "reset":
      u = CM(u, t);
      break;
  }
  if (e.type === "set" || e.type === "replace" || e.type === "append")
    for (let h of Ja)
      h.id !== t &&
        (o3(h.id, t, e.accelerator) ||
          (AM({ commandId: h.id, keymapState: s, isMacOS: l }).includes(e.accelerator) &&
            (u = uDt(u, h.id, e.accelerator, r, n))));
  let m = e.type === "set" || e.type === "replace" || e.type === "append" ? e.accelerator : null,
    f = Lx({ commandId: t, isMacOS: l, primaryNumberShortcutTarget: r, globalTabsEnabled: n });
  for (let h of p) h === m || f.includes(h) || (u = dDt(t, h, u, l, r, n));
  return ((u = nMe(u)), await rMe(i, u), { ...s, keymapPath: i, bindings: u });
}
function QDe() {
  return a3(async () => {
    let t = i3(),
      e = await s3();
    return (await rMe(t, []), { ...e, keymapPath: t, bindings: [] });
  });
}
function a3(t) {
  let e = KDe.then(t, t);
  return ((KDe = e), e);
}
function cDt({ commandId: t, keymapState: e, accelerator: r, isMacOS: n }) {
  let o = AM({ commandId: t, keymapState: e, isMacOS: n });
  return o.length === 0 ? [r] : tMe([r, ...o.slice(1)]);
}
function gc(t, e, r) {
  let n = CM(t, e);
  return r.length === 0
    ? [...n, { command: e, key: null }]
    : [...n, ...tMe(r).map((o) => ({ command: e, key: o }))];
}
function uDt(t, e, r, n, o) {
  if ((o && ky() && xM(e)) || eMe(e) || (n != null && _M(e)))
    return t.filter((l) => l.command !== e || l.key !== r);
  let i = Bx(t, e);
  if (
    (e === "globalDictationHold" ||
      e === "toggleSidebar" ||
      e === "nextTab" ||
      e === "previousTab" ||
      e === "nextThread" ||
      e === "previousThread" ||
      e === "nextRecentThread" ||
      e === "previousRecentThread") &&
    i.length === 0
  )
    return t;
  let s = i.flatMap((l) => (l.key == null || l.key === r ? [] : [l.key]));
  if (s.length > 0) return gc(t, e, s);
  let a = Lx({ commandId: e, isMacOS: ky(), primaryNumberShortcutTarget: n, globalTabsEnabled: o });
  return a.includes(r)
    ? i.length === 0 && a.length > 1
      ? t
      : gc(t, e, [])
    : i.length > 0
      ? CM(t, e)
      : t;
}
function dDt(t, e, r, n, o, i) {
  let s = r;
  for (let a of Ja) {
    if ((i && n && xM(a.id)) || eMe(a.id) || (o != null && _M(a.id))) continue;
    let l = Bx(s, a.id);
    a.id === t ||
      l.length !== 1 ||
      l[0]?.key != null ||
      (Lx({
        commandId: a.id,
        isMacOS: n,
        primaryNumberShortcutTarget: o,
        globalTabsEnabled: i,
      }).includes(e) &&
        (s = CM(s, a.id)));
  }
  return s;
}
function eMe(t) {
  return t === "nextRecentThread" || t === "previousRecentThread";
}
function Bx(t, e) {
  return t.filter((r) => r.command === e);
}
function CM(t, e) {
  return t.filter((r) => r.command !== e);
}
function ky() {
  return process.platform === "darwin";
}
function tMe(t) {
  return Array.from(new Set(t));
}
function pDt(t) {
  let e = [];
  for (let r of t) {
    if (!wM(r.command) || !n3(r)) continue;
    let n = Ox(r.command);
    n == null || !Nx(n) || e.push(r);
  }
  return e;
}
function mDt(t) {
  return WDe(t).flatMap((e) => {
    if (e.command === "composer.startDictation")
      return process.platform === "linux" && !t.some((o) => o.command === "globalDictationHold")
        ? [{ ...e, command: "globalDictationHold" }]
        : [];
    if (e.command === "globalDictationToggle") {
      if (t.some((s) => s.command === "globalDictationSingleTap")) return [];
      let o = t.find((s) => s.command === "globalDictationHold");
      return o == null && e.key != null
        ? [{ ...e, command: "globalDictationHold" }]
        : [
            {
              command: "globalDictationSingleTap",
              key:
                o?.key != null && e.key != null && Qa(o.key, ky(), Lm) === Qa(e.key, ky(), Lm)
                  ? null
                  : e.key,
            },
          ];
    }
    if (e.command === "focusQuickChat" && t.some((o) => o.command === "openAvatarOverlay"))
      return [];
    let r = oDt[e.command];
    return r == null ? [e] : (typeof r == "string" ? [r] : r).map((o) => ({ ...e, command: o }));
  });
}
function fDt(t) {
  let e = ky(),
    r = t.map(({ command: n, key: o }) => ({ command: n, key: o }));
  for (let n of ["previousTab", "nextTab"]) {
    if (t.some((f) => f.command === n && f.version != null)) continue;
    let o = n === "previousTab",
      i = o ? "Ctrl+Shift+Tab" : "Ctrl+Tab",
      s = o ? "Command+Alt+Left" : "Command+Alt+Right";
    e || (s = o ? "Ctrl+PageUp" : "Ctrl+PageDown");
    let a = `${e ? "Command" : "Ctrl"}+Shift+${o ? "[" : "]"}`,
      l = new Set([i, s, a].map((f) => Qa(f, e, Lm))),
      c = Bx(t, n),
      u = new Set(
        c.flatMap((f) => (f.key == null || /\s/.test(f.key.trim()) ? [] : [Qa(f.key, e, Lm)])),
      );
    if (c.some((f) => f.key == null) || [...u].filter((f) => l.has(f)).length < 2) continue;
    let p = new Set([i, ...(e ? [s] : [])].map((f) => Qa(f, e, Lm))),
      m = c.flatMap((f) =>
        f.key != null && (/\s/.test(f.key.trim()) || !p.has(Qa(f.key, e, Lm))) ? [f.key] : [],
      );
    r = gc(r, n, m);
  }
  for (let n of ["previousTab", "nextTab"]) {
    let i = (
        n === "previousTab"
          ? ["previousThread", "previousRecentThread"]
          : ["nextThread", "nextRecentThread"]
      ).flatMap((l) => {
        let c = Bx(r, l);
        return c.some((u) => u.key == null)
          ? []
          : c.flatMap((u) => (u.key == null ? [] : [ZDe(u.key, e)]));
      }),
      s = Bx(r, n);
    if (s.some((l) => l.key == null)) continue;
    let a = s.flatMap((l) => {
      if (l.key == null) return [];
      let c = ZDe(l.key, e);
      return i.some((u) => c.slice(0, Math.min(c.length, u.length)).every((p, m) => p === u[m]))
        ? []
        : [l.key];
    });
    a.length !== s.length && (r = gc(r, n, a));
  }
  return r;
}
function ZDe(t, e) {
  return t
    .trim()
    .split(/\s+/)
    .map((r, n) => {
      if (n === 0) return Qa(r, e, Lm);
      let o = zDe(r, e);
      return JSON.stringify({ ...o, key: o.requireShift ? Mx(o.key) : o.key });
    });
}
async function rMe(t, e) {
  await (0, Dy.mkdir)((0, EM.dirname)(t), { recursive: !0 });
  let n = nMe(e).map((o) =>
    o.command === "nextTab" || o.command === "previousTab" ? { ...o, version: 1 } : o,
  );
  await (0, Dy.writeFile)(
    t,
    `${JSON.stringify(n, null, 2)}
`,
  );
}
function nMe(t) {
  return [...t].sort((e, r) => e.command.localeCompare(r.command));
}
function hDt(t) {
  return t instanceof Error && "code" in t && t.code === "ENOENT";
}
var Dy,
  EM,
  nDt,
  oDt,
  Lm,
  iDt,
  sDt,
  XDe,
  KDe,
  oMe = g(() => {
    ((Dy = require("node:fs/promises")), (EM = require("node:path")));
    jDe();
    VDe();
    $();
    Bn();
    Bt();
    ((nDt = "keybindings.json"),
      (oDt = {
        closeTabOrWindow: ["closeTab", "closeWindow"],
        focusQuickChat: "openAvatarOverlay",
        newThread: "newTask",
        openBrowserTab: "newTab",
        searchThreadsOverlay: "spotlightSearch",
        toggleBrowserPanel: "stepWorkspaceLayout",
      }),
      (Lm = { includeImplicitPlusShift: !1 }),
      (iDt = d.object({
        command: d.string(),
        key: d.string().nullable(),
        version: d.literal(1).optional(),
      })),
      (sDt = d.array(iDt)),
      (XDe = Ie("codex-command-keymap")),
      (KDe = Promise.resolve(void 0)));
  });
var sMe = A((QUr, iMe) => {
  function gDt(t, e, r, n) {
    var o = -1,
      i = t == null ? 0 : t.length;
    for (n && i && (r = t[++o]); ++o < i; ) r = e(r, t[o], o, t);
    return r;
  }
  iMe.exports = gDt;
});
var lMe = A((eqr, aMe) => {
  function yDt(t) {
    return function (e) {
      return t?.[e];
    };
  }
  aMe.exports = yDt;
});
var uMe = A((tqr, cMe) => {
  var vDt = lMe(),
    bDt = {
      À: "A",
      Á: "A",
      Â: "A",
      Ã: "A",
      Ä: "A",
      Å: "A",
      à: "a",
      á: "a",
      â: "a",
      ã: "a",
      ä: "a",
      å: "a",
      Ç: "C",
      ç: "c",
      Ð: "D",
      ð: "d",
      È: "E",
      É: "E",
      Ê: "E",
      Ë: "E",
      è: "e",
      é: "e",
      ê: "e",
      ë: "e",
      Ì: "I",
      Í: "I",
      Î: "I",
      Ï: "I",
      ì: "i",
      í: "i",
      î: "i",
      ï: "i",
      Ñ: "N",
      ñ: "n",
      Ò: "O",
      Ó: "O",
      Ô: "O",
      Õ: "O",
      Ö: "O",
      Ø: "O",
      ò: "o",
      ó: "o",
      ô: "o",
      õ: "o",
      ö: "o",
      ø: "o",
      Ù: "U",
      Ú: "U",
      Û: "U",
      Ü: "U",
      ù: "u",
      ú: "u",
      û: "u",
      ü: "u",
      Ý: "Y",
      ý: "y",
      ÿ: "y",
      Æ: "Ae",
      æ: "ae",
      Þ: "Th",
      þ: "th",
      ß: "ss",
      Ā: "A",
      Ă: "A",
      Ą: "A",
      ā: "a",
      ă: "a",
      ą: "a",
      Ć: "C",
      Ĉ: "C",
      Ċ: "C",
      Č: "C",
      ć: "c",
      ĉ: "c",
      ċ: "c",
      č: "c",
      Ď: "D",
      Đ: "D",
      ď: "d",
      đ: "d",
      Ē: "E",
      Ĕ: "E",
      Ė: "E",
      Ę: "E",
      Ě: "E",
      ē: "e",
      ĕ: "e",
      ė: "e",
      ę: "e",
      ě: "e",
      Ĝ: "G",
      Ğ: "G",
      Ġ: "G",
      Ģ: "G",
      ĝ: "g",
      ğ: "g",
      ġ: "g",
      ģ: "g",
      Ĥ: "H",
      Ħ: "H",
      ĥ: "h",
      ħ: "h",
      Ĩ: "I",
      Ī: "I",
      Ĭ: "I",
      Į: "I",
      İ: "I",
      ĩ: "i",
      ī: "i",
      ĭ: "i",
      į: "i",
      ı: "i",
      Ĵ: "J",
      ĵ: "j",
      Ķ: "K",
      ķ: "k",
      ĸ: "k",
      Ĺ: "L",
      Ļ: "L",
      Ľ: "L",
      Ŀ: "L",
      Ł: "L",
      ĺ: "l",
      ļ: "l",
      ľ: "l",
      ŀ: "l",
      ł: "l",
      Ń: "N",
      Ņ: "N",
      Ň: "N",
      Ŋ: "N",
      ń: "n",
      ņ: "n",
      ň: "n",
      ŋ: "n",
      Ō: "O",
      Ŏ: "O",
      Ő: "O",
      ō: "o",
      ŏ: "o",
      ő: "o",
      Ŕ: "R",
      Ŗ: "R",
      Ř: "R",
      ŕ: "r",
      ŗ: "r",
      ř: "r",
      Ś: "S",
      Ŝ: "S",
      Ş: "S",
      Š: "S",
      ś: "s",
      ŝ: "s",
      ş: "s",
      š: "s",
      Ţ: "T",
      Ť: "T",
      Ŧ: "T",
      ţ: "t",
      ť: "t",
      ŧ: "t",
      Ũ: "U",
      Ū: "U",
      Ŭ: "U",
      Ů: "U",
      Ű: "U",
      Ų: "U",
      ũ: "u",
      ū: "u",
      ŭ: "u",
      ů: "u",
      ű: "u",
      ų: "u",
      Ŵ: "W",
      ŵ: "w",
      Ŷ: "Y",
      ŷ: "y",
      Ÿ: "Y",
      Ź: "Z",
      Ż: "Z",
      Ž: "Z",
      ź: "z",
      ż: "z",
      ž: "z",
      Ĳ: "IJ",
      ĳ: "ij",
      Œ: "Oe",
      œ: "oe",
      ŉ: "'n",
      ſ: "s",
    },
    SDt = vDt(bDt);
  cMe.exports = SDt;
});
var pMe = A((rqr, dMe) => {
  var wDt = uMe(),
    _Dt = Ep(),
    xDt = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,
    ADt = "\\u0300-\\u036f",
    RDt = "\\ufe20-\\ufe2f",
    EDt = "\\u20d0-\\u20ff",
    CDt = ADt + RDt + EDt,
    TDt = "[" + CDt + "]",
    PDt = RegExp(TDt, "g");
  function IDt(t) {
    return ((t = _Dt(t)), t && t.replace(xDt, wDt).replace(PDt, ""));
  }
  dMe.exports = IDt;
});
var fMe = A((nqr, mMe) => {
  var kDt = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
  function DDt(t) {
    return t.match(kDt) || [];
  }
  mMe.exports = DDt;
});
var gMe = A((oqr, hMe) => {
  var MDt = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
  function ODt(t) {
    return MDt.test(t);
  }
  hMe.exports = ODt;
});
var NMe = A((iqr, OMe) => {
  var wMe = "\\ud800-\\udfff",
    NDt = "\\u0300-\\u036f",
    LDt = "\\ufe20-\\ufe2f",
    BDt = "\\u20d0-\\u20ff",
    FDt = NDt + LDt + BDt,
    _Me = "\\u2700-\\u27bf",
    xMe = "a-z\\xdf-\\xf6\\xf8-\\xff",
    $Dt = "\\xac\\xb1\\xd7\\xf7",
    UDt = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf",
    qDt = "\\u2000-\\u206f",
    GDt =
      " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",
    AMe = "A-Z\\xc0-\\xd6\\xd8-\\xde",
    WDt = "\\ufe0e\\ufe0f",
    RMe = $Dt + UDt + qDt + GDt,
    EMe = "['\u2019]",
    yMe = "[" + RMe + "]",
    HDt = "[" + FDt + "]",
    CMe = "\\d+",
    jDt = "[" + _Me + "]",
    TMe = "[" + xMe + "]",
    PMe = "[^" + wMe + RMe + CMe + _Me + xMe + AMe + "]",
    zDt = "\\ud83c[\\udffb-\\udfff]",
    VDt = "(?:" + HDt + "|" + zDt + ")",
    KDt = "[^" + wMe + "]",
    IMe = "(?:\\ud83c[\\udde6-\\uddff]){2}",
    kMe = "[\\ud800-\\udbff][\\udc00-\\udfff]",
    My = "[" + AMe + "]",
    ZDt = "\\u200d",
    vMe = "(?:" + TMe + "|" + PMe + ")",
    XDt = "(?:" + My + "|" + PMe + ")",
    bMe = "(?:" + EMe + "(?:d|ll|m|re|s|t|ve))?",
    SMe = "(?:" + EMe + "(?:D|LL|M|RE|S|T|VE))?",
    DMe = VDt + "?",
    MMe = "[" + WDt + "]?",
    YDt = "(?:" + ZDt + "(?:" + [KDt, IMe, kMe].join("|") + ")" + MMe + DMe + ")*",
    JDt = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])",
    QDt = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])",
    eMt = MMe + DMe + YDt,
    tMt = "(?:" + [jDt, IMe, kMe].join("|") + ")" + eMt,
    rMt = RegExp(
      [
        My + "?" + TMe + "+" + bMe + "(?=" + [yMe, My, "$"].join("|") + ")",
        XDt + "+" + SMe + "(?=" + [yMe, My + vMe, "$"].join("|") + ")",
        My + "?" + vMe + "+" + bMe,
        My + "+" + SMe,
        QDt,
        JDt,
        CMe,
        tMt,
      ].join("|"),
      "g",
    );
  function nMt(t) {
    return t.match(rMt) || [];
  }
  OMe.exports = nMt;
});
var BMe = A((sqr, LMe) => {
  var oMt = fMe(),
    iMt = gMe(),
    sMt = Ep(),
    aMt = NMe();
  function lMt(t, e, r) {
    return (
      (t = sMt(t)),
      (e = r ? void 0 : e),
      e === void 0 ? (iMt(t) ? aMt(t) : oMt(t)) : t.match(e) || []
    );
  }
  LMe.exports = lMt;
});
var $Me = A((aqr, FMe) => {
  var cMt = sMe(),
    uMt = pMe(),
    dMt = BMe(),
    pMt = "['\u2019]",
    mMt = RegExp(pMt, "g");
  function fMt(t) {
    return function (e) {
      return cMt(dMt(uMt(e).replace(mMt, "")), t, "");
    };
  }
  FMe.exports = fMt;
});
var qMe = A((lqr, UMe) => {
  var hMt = $Me(),
    gMt = hMt(function (t, e, r) {
      return t + (r ? "-" : "") + e.toLowerCase();
    });
  UMe.exports = gMt;
});
async function HMe({ appServerClient: t, preferWsl: e = !1 }) {
  let r = Xt({ preferWsl: e }),
    n = await t.platformPath(),
    o = n.join(r, "pets"),
    i = n.join(r, "avatars");
  try {
    await Qe.mkdir(o, { recursive: !0 }, t);
  } catch {
    return { avatarDirectory: o, avatars: [] };
  }
  let [s, a] = await Promise.all([
      GMe(n, t, i, "avatar.json").catch(() => []),
      GMe(n, t, o, "pet.json"),
    ]),
    l = new Map(s.map((c) => [c.id, c]));
  for (let c of a) l.set(c.id, c);
  return {
    avatarDirectory: o,
    avatars: [...l.values()].sort((c, u) => (u.updatedAt ?? 0) - (c.updatedAt ?? 0)),
  };
}
async function jMe({ appServerClient: t, avatarId: e, preferWsl: r = !1 }) {
  let n = e.startsWith("custom:") ? e.slice(7) : "";
  if (!n) return null;
  let o = Xt({ preferWsl: r }),
    i = await t.platformPath();
  return (
    (await l3(i, t, i.join(o, "pets"), n, "pet.json")) ??
    l3(i, t, i.join(o, "avatars"), n, "avatar.json")
  );
}
function _Mt(t, e = 1) {
  let r = xMt(t),
    n = e === 1 ? bMt : SMt;
  return r == null || r.width !== vMt || r.height !== n
    ? null
    : {
        extension: r.mimeType === "image/png" ? "png" : "webp",
        spriteVersionNumber: e,
        spritesheetDataUrl: `data:${r.mimeType};base64,${t.toString("base64")}`,
      };
}
async function GMe(t, e, r, n) {
  let o = await Qe.readdir(r, { withFileTypes: !0 }, e);
  return (
    await Promise.all(
      o.filter((s) => s.isDirectory() || s.isSymbolicLink()).map((s) => l3(t, e, r, s.name, n)),
    )
  ).filter((s) => s != null);
}
async function l3(t, e, r, n, o) {
  let i = WMe(t, r, n);
  if (i == null) return null;
  let s = t.join(i, o);
  try {
    let a = wMt.safeParse(JSON.parse(await Qe.readFile(s, e)));
    if (!a.success) return null;
    let l = WMe(t, i, a.data.spritesheetPath);
    if (l == null) return null;
    let [c, u, p] = await Promise.all([
        Qe.readFileBase64(l, e),
        Qe.stat(s, e, { bypassCache: !0 }),
        Qe.stat(l, e, { bypassCache: !0 }),
      ]),
      m = typeof c == "string" ? c : c.toString("base64"),
      f = _Mt(Buffer.from(m, "base64"), a.data.spriteVersionNumber);
    return f == null
      ? null
      : {
          directoryPath: i,
          id: `custom:${n}`,
          displayName: a.data.displayName ?? a.data.id ?? n,
          description: a.data.description,
          spriteVersionNumber: a.data.spriteVersionNumber,
          spritesheetDataUrl: f.spritesheetDataUrl,
          updatedAt: Math.max(u.mtimeMs, p.mtimeMs),
        };
  } catch {
    return null;
  }
}
function WMe(t, e, r) {
  let n = t.resolve(e, r),
    o = t.relative(e, n);
  return o === "" || o === ".." || o.startsWith(".." + t.sep) || t.isAbsolute(o) ? null : n;
}
function xMt(t) {
  return AMt(t) ?? RMt(t);
}
function AMt(t) {
  return t.length < 24 ||
    t[0] !== 137 ||
    t.subarray(1, 4).toString("ascii") !== "PNG" ||
    t[4] !== 13 ||
    t[5] !== 10 ||
    t[6] !== 26 ||
    t[7] !== 10 ||
    t.subarray(12, 16).toString("ascii") !== "IHDR"
    ? null
    : { height: t.readUInt32BE(20), mimeType: "image/png", width: t.readUInt32BE(16) };
}
function RMt(t) {
  if (
    t.length < 20 ||
    t.subarray(0, 4).toString("ascii") !== "RIFF" ||
    t.subarray(8, 12).toString("ascii") !== "WEBP"
  )
    return null;
  let e = 12;
  for (; e + 8 <= t.length; ) {
    let r = t.subarray(e, e + 4).toString("ascii"),
      n = t.readUInt32LE(e + 4),
      o = e + 8;
    if (o + n > t.length) return null;
    let i = EMt(t, r, o, n);
    if (i != null) return { ...i, mimeType: "image/webp" };
    e = o + n + (n % 2);
  }
  return null;
}
function EMt(t, e, r, n) {
  if (e === "VP8X")
    return n < 10
      ? null
      : { height: t.readUIntLE(r + 7, 3) + 1, width: t.readUIntLE(r + 4, 3) + 1 };
  if (e === "VP8L") {
    if (n < 5 || t[r] !== 47) return null;
    let o = t.readUInt32LE(r + 1),
      i = 2 ** 14;
    return { height: (Math.floor(o / i) % i) + 1, width: (o % i) + 1 };
  }
  return e === "VP8"
    ? n < 10 || t[r + 3] !== 157 || t[r + 4] !== 1 || t[r + 5] !== 42
      ? null
      : { height: t.readUInt16LE(r + 8) % 2 ** 14, width: t.readUInt16LE(r + 6) % 2 ** 14 }
    : null;
}
var yMt,
  vMt,
  bMt,
  SMt,
  wMt,
  zMe = g(() => {
    yMt = F(qMe());
    $();
    Bn();
    Gs();
    ((vMt = 1536),
      (bMt = 1872),
      (SMt = 2288),
      (wMt = d.object({
        id: d.string().trim().min(1).optional(),
        displayName: d.string().trim().min(1).optional(),
        description: d
          .string()
          .nullish()
          .transform((t) => t?.trim() || null),
        spriteVersionNumber: d.union([d.literal(1), d.literal(2)]).default(1),
        spritesheetPath: d.string().trim().min(1).default("spritesheet.webp"),
      })));
  });
function VMe(t, e, r, n) {
  let o = Uk(e),
    i = {
      message: o.message,
      status: CMt(t),
      source: r.source,
      service: r.source,
      env: r.env,
      date: Date.now(),
      logger: { name: o.loggerName ?? "app" },
      "codex.app_session_id": r.codexAppSessionId,
      platform: r.platform,
      usr: r.userInfo,
    };
  return (n != null && Object.assign(i, n), TMt(i, r.buildInfo), i);
}
function CMt(t) {
  switch (t) {
    case "trace":
    case "debug":
      return "debug";
    case "info":
      return "info";
    case "warning":
      return "warn";
    case "error":
      return "error";
  }
}
function TMt(t, e) {
  c3(t, "build_number", e.buildNumber);
  let r = e.version == null ? null : fI(e.version).version;
  (c3(t, "version", r), c3(t, "app_version", r));
}
function c3(t, e, r) {
  r != null && (t[e] = r);
}
var u3 = g(() => {
  O();
  hr();
});
var TM,
  d3 = g(() => {
    TM = class {
      onFlush;
      flushIntervalMs;
      maxBatchSize;
      maxBatchBytes;
      buffer = [];
      bufferBytes = 0;
      flushTimeout = null;
      constructor(e) {
        ((this.onFlush = e.onFlush),
          (this.flushIntervalMs = e.flushIntervalMs ?? 5e3),
          (this.maxBatchSize = e.maxBatchSize ?? 50),
          (this.maxBatchBytes = e.maxBatchBytes ?? 64e3));
      }
      enqueue(e) {
        if (
          (this.buffer.push(e),
          (this.bufferBytes += e.length),
          this.buffer.length >= this.maxBatchSize || this.bufferBytes >= this.maxBatchBytes)
        ) {
          this.flush();
          return;
        }
        this.scheduleFlush();
      }
      flushNow() {
        this.flush();
      }
      clear() {
        ((this.buffer.length = 0), (this.bufferBytes = 0), this.clearFlushTimeout());
      }
      scheduleFlush() {
        this.flushTimeout == null &&
          (this.flushTimeout = setTimeout(() => {
            this.flush();
          }, this.flushIntervalMs));
      }
      flush() {
        if (this.buffer.length === 0) {
          this.clearFlushTimeout();
          return;
        }
        let e = this.buffer.splice(0, this.buffer.length);
        ((this.bufferBytes = 0), this.clearFlushTimeout(), this.onFlush(e));
      }
      clearFlushTimeout() {
        this.flushTimeout != null && (clearTimeout(this.flushTimeout), (this.flushTimeout = null));
      }
    };
  });
function NMt(t, e = XMe, r = YMe) {
  let n = new URLSearchParams({
    ddsource: "browser",
    "dd-api-key": r,
    "dd-evp-origin": "browser",
    "dd-request-id": t,
  });
  return `${e}?ddforward=${encodeURIComponent(`/api/v2/logs?${n.toString()}`)}`;
}
var XMe,
  YMe,
  PMt,
  IMt,
  kMt,
  DMt,
  MMt,
  KMe,
  OMt,
  ZMe,
  Bm,
  p3 = g(() => {
    O();
    _u();
    d3();
    ((XMe = "https://chat.openai.com/ces/v1/telemetry/intake"),
      (YMe = "dummy-token"),
      (PMt = 2e3),
      (IMt = 3e4),
      (kMt = 5),
      (DMt = 4 * 1024 * 1024),
      (MMt = 3e4),
      (KMe = 2e3),
      (OMt = new TextEncoder()),
      (ZMe = !1),
      (Bm = class {
        constructor(e) {
          this.options = e;
          let { analyticsEnabled: r = !0 } = e;
          ((this.enabled = typeof r == "boolean" ? r : null),
            (this.fetchImpl = e.fetchImpl ?? Yl),
            (this.batcher = new TM({ onFlush: (n) => this.enqueueBatch(n) })),
            typeof r != "boolean" &&
              Promise.resolve(r).then(
                (n) => this.setEnabled(n),
                (n) => {
                  this.disableWithFailure({
                    type: "disabled",
                    reason: "analytics_config_failed",
                    error: n,
                  });
                },
              ));
        }
        batcher;
        fetchImpl;
        queue = [];
        queuedBytes = 0;
        disposed = !1;
        enabled;
        inFlightSend = null;
        retryAttempts = 0;
        retryTimeout = null;
        abortController = null;
        setEnabled(e) {
          this.disposed ||
            ((this.enabled = e),
            this.batcher.flushNow(),
            this.enabled ? this.drainQueue() : (this.clearQueue(), this.abortController?.abort()));
        }
        enqueue(e) {
          if (!this.isSendingAllowed()) {
            (this.batcher.clear(), this.clearQueue());
            return;
          }
          this.batcher.enqueue(JSON.stringify(e));
        }
        flushNow() {
          (this.batcher.flushNow(), this.drainQueue());
        }
        async flush() {
          let e = Date.now() + KMe,
            r;
          try {
            await Promise.race([
              (async () => {
                for (; Date.now() < e; ) {
                  if (
                    (this.retryTimeout != null &&
                      (clearTimeout(this.retryTimeout), (this.retryTimeout = null)),
                    this.flushNow(),
                    this.inFlightSend == null)
                  )
                    return;
                  await this.inFlightSend;
                }
              })(),
              new Promise((n) => {
                r = setTimeout(n, KMe);
              }),
            ]);
          } finally {
            clearTimeout(r);
          }
        }
        dispose() {
          ((this.disposed = !0),
            (this.enabled = !1),
            this.batcher.clear(),
            this.clearQueue(),
            this.abortController?.abort());
        }
        isSendingAllowed() {
          return !this.disposed && this.enabled !== !1 && (this.options.isEnabled?.() ?? !0);
        }
        enqueueBatch(e) {
          if (!this.isSendingAllowed() || e.length === 0) return;
          let r = e.join(`
`),
            n = OMt.encode(r).byteLength;
          this.queuedBytes + n > DMt ||
            (this.queue.push({ bytes: n, payload: r, requestId: crypto.randomUUID() }),
            (this.queuedBytes += n),
            this.drainQueue());
        }
        async drainQueue() {
          if (!this.isSendingAllowed()) {
            (this.batcher.clear(), this.clearQueue());
            return;
          }
          if (this.enabled == null || this.inFlightSend != null || this.retryTimeout != null)
            return;
          let e = this.queue[0];
          e != null &&
            (this.inFlightSend = (async () => {
              try {
                (await this.send(e.payload, e.requestId),
                  this.queue[0] === e && this.removeHeadBatch(),
                  (this.retryAttempts = 0));
              } catch {
                if (!this.isSendingAllowed()) {
                  this.clearQueue();
                  return;
                }
                this.queue[0] === e && this.scheduleRetry();
              } finally {
                ((this.inFlightSend = null), this.drainQueue());
              }
            })());
        }
        scheduleRetry() {
          if (this.retryTimeout != null) return;
          if (this.retryAttempts >= kMt) {
            (this.removeHeadBatch(), (this.retryAttempts = 0), this.drainQueue());
            return;
          }
          this.retryAttempts += 1;
          let e = Math.min(IMt, PMt * Math.pow(2, this.retryAttempts - 1));
          this.retryTimeout = setTimeout(() => {
            ((this.retryTimeout = null), this.drainQueue());
          }, e);
        }
        disableWithFailure(e) {
          this.disposed ||
            (this.setEnabled(!1), !ZMe && ((ZMe = !0), this.options.reportFailure(e)));
        }
        removeHeadBatch() {
          let e = this.queue.shift();
          e != null && (this.queuedBytes -= e.bytes);
        }
        clearQueue() {
          ((this.queue.length = 0),
            (this.queuedBytes = 0),
            (this.retryAttempts = 0),
            this.retryTimeout != null &&
              (clearTimeout(this.retryTimeout), (this.retryTimeout = null)));
        }
        async send(e, r) {
          let n = new AbortController();
          this.abortController = n;
          let o;
          try {
            if (this.options.waitUntilReady != null) {
              let { signal: a } = n,
                l = pt(),
                c = () => l.reject(a.reason);
              a.addEventListener("abort", c, { once: !0 });
              try {
                await Promise.race([this.options.waitUntilReady(), l.promise]);
              } finally {
                a.removeEventListener("abort", c);
              }
              if ((a.throwIfAborted(), !this.isSendingAllowed())) return;
            }
            o = setTimeout(() => n.abort(), MMt);
            let i = await this.fetchImpl(
              NMt(r, this.options.endpoint ?? XMe, this.options.clientToken ?? YMe),
              {
                method: "POST",
                headers: { "content-type": "text/plain", "x-request-id": r },
                body: e,
                signal: n.signal,
              },
            );
            if (i.ok) {
              i.body != null && (await i.body.cancel().catch(() => {}));
              return;
            }
            let s = await i.text();
            if (i.status >= 400 && i.status < 500) {
              (i.status === 401 || i.status === 403) &&
                this.disableWithFailure({
                  type: "disabled",
                  reason: "invalid_client_token",
                  status: i.status,
                  body: s,
                });
              return;
            }
            throw new Error(`[ces-telemetry] non-2xx response (${i.status})`);
          } finally {
            (clearTimeout(o), (this.abortController = null));
          }
        }
      }));
  });
var PM,
  JMe = g(() => {
    p3();
    u3();
    PM = class {
      options;
      transport;
      userInfo = null;
      constructor(e) {
        ((this.options = e),
          (this.transport =
            e.transport ?? new Bm({ fetchImpl: e.fetchImpl, reportFailure: e.reportFailure })));
      }
      setUserInfo(e) {
        this.userInfo = e;
      }
      log(e, r, n) {
        let o = VMe(
          e,
          r,
          {
            buildInfo: this.options.buildInfo,
            userInfo: this.userInfo,
            codexAppSessionId: this.options.codexAppSessionId,
            source: this.options.source,
            env: this.options.env,
            platform: this.options.platform,
          },
          n,
        );
        this.transport.enqueue(o);
      }
      flush() {
        return this.transport.flush();
      }
      flushNow() {
        this.transport.flushNow();
      }
    };
  });
async function rOe(t) {
  let e = $Mt(t);
  if (e == null) return "other";
  let r = await UMt(e).catch((o) => {
      if (
        o instanceof Error &&
        "code" in o &&
        (o.code === "ENODATA" || o.code === "ENOTFOUND" || o.code === "ERR_ACCESS_DENIED")
      )
        return [];
      throw (
        he().warning("email_domain_mx_lookup_failed", {
          safe: {
            errorCode:
              o instanceof Error && "code" in o && typeof o.code == "string" ? o.code : "unknown",
          },
          sensitive: { domain: e, error: o },
        }),
        o
      );
    }),
    n = FMt(r.map((o) => o.exchange));
  return (
    he().info("email_domain_mx_lookup_completed", {
      safe: { provider: n, recordCount: r.length },
      sensitive: { domain: e },
    }),
    n
  );
}
function FMt(t) {
  return t.some((e) => eOe(e, LMt)) ? "google" : t.some((e) => eOe(e, BMt)) ? "microsoft" : "other";
}
function $Mt(t) {
  let e = t.trim().toLowerCase();
  return e.length === 0 || e.includes("@") ? null : e;
}
function UMt(t) {
  return new Promise((e, r) => {
    let n = setTimeout(() => {
      (he().warning("email_domain_mx_lookup_timed_out", {
        safe: { timeoutMs: QMe },
        sensitive: { domain: t },
      }),
        e([]));
    }, QMe);
    (0, tOe.resolveMx)(t).then(
      (o) => {
        (clearTimeout(n), e(o));
      },
      (o) => {
        (clearTimeout(n), r(o instanceof Error ? o : new Error("MX lookup failed")));
      },
    );
  });
}
function eOe(t, e) {
  let r = t.trim().toLowerCase();
  return e.some((n) => r === n || r.endsWith(`.${n}`));
}
var tOe,
  QMe,
  LMt,
  BMt,
  m3 = g(() => {
    tOe = require("node:dns/promises");
    Bt();
    ((QMe = 5e3),
      (LMt = ["google.com", "googlemail.com"]),
      (BMt = ["microsoft.com", "microsoftonline.com", "outlook.com", "protection.outlook.com"]));
  });
async function IM(t, e, r, n = new AbortController().signal) {
  if ((n.throwIfAborted(), t.listModels == null || t.getUserSavedConfiguration == null)) return e;
  let o = [],
    i = null;
  try {
    let [a, l] = await Lt(
      Promise.all([t.getUserSavedConfiguration(), t.getUserSavedConfiguration(r ?? void 0)]),
      n,
    );
    if (
      (a.model_provider ?? "openai") !== (l.model_provider ?? "openai") ||
      !(0, nOe.default)(a.model_providers, l.model_providers)
    )
      return e;
    do {
      let c = await Lt(t.listModels({ cursor: i, includeHidden: !0 }), n);
      (o.push(...c.data), (i = c.nextCursor));
    } while (i != null);
  } catch {
    return (n.throwIfAborted(), e);
  }
  if (o.some((a) => a.model === e)) return e;
  let s = o.filter(
    (a) =>
      !a.hidden &&
      a.modelSpecialty === null &&
      a.supportedReasoningEfforts.some(({ reasoningEffort: l }) => l === "low"),
  );
  return (s.find((a) => a.isDefault) ?? s[0])?.model ?? e;
}
var nOe,
  f3 = g(() => {
    nOe = F(Is());
    O();
  });
async function kM({
  prompt: t,
  imageUrls: e,
  cwd: r,
  model: n,
  modelProvider: o = null,
  effort: i,
  serviceTier: s,
  serviceName: a,
  baseInstructions: l,
  schema: c,
  config: u,
  sourceThreadId: p,
  fallbackToFreshThread: m = !0,
  threadSource: f = null,
  turnTrigger: h,
  responsesapiClientMetadata: v,
  timeoutMs: y = qMt,
  client: w,
  responseSchema: _,
  onTemporaryThreadCreated: S,
  onTokenUsage: E,
  onText: T,
  onTurnCompleted: P,
  signal: M,
  codexAppTools: L,
  allowProviderModelFallback: V = !0,
  experimentalPredictionMode: de = !1,
}) {
  let ue = t.trim();
  if (ue.length === 0) return null;
  if (M?.aborted) throw new DOMException("The operation was aborted", "AbortError");
  let Ae = {
      ...u,
      ...(L == null
        ? { "mcp_servers.codex_app": { enabled: !1, command: "" } }
        : { [bue(L.appServerVersion)]: L.enabledTools }),
      model_reasoning_effort: i,
    },
    ge = null;
  if (p != null && w.forkThread)
    try {
      de
        ? (ge = (
            await w.forkThread({
              threadId: p,
              experimentalPredictionMode: !0,
              config:
                u?.thread_unload_delay_secs == null
                  ? void 0
                  : { thread_unload_delay_secs: u.thread_unload_delay_secs },
              ephemeral: !0,
              excludeTurns: !0,
              threadSource: f,
            })
          ).thread.id)
        : (ge = (
            await w.forkThread({
              threadId: p,
              path: null,
              model: n,
              modelProvider: o,
              serviceTier: s ?? null,
              cwd: r,
              approvalPolicy: "never",
              permissions: ":read-only",
              runtimeWorkspaceRoots: [],
              config: Ae,
              baseInstructions: l,
              ephemeral: !0,
              excludeTurns: !0,
              threadSource: f,
            })
          ).thread.id);
    } catch {
      if (M?.aborted) throw new DOMException("The operation was aborted", "AbortError");
      if (!m) return null;
    }
  let Pe = {
      model: n,
      modelProvider: o,
      ...(V ? { allowProviderModelFallback: !0 } : {}),
      cwd: r,
      approvalPolicy: "never",
      permissions: ":read-only",
      runtimeWorkspaceRoots: [],
      config: Ae,
      baseInstructions: l,
      personality: null,
      ephemeral: !0,
      threadSource: f,
      experimentalRawEvents: !1,
      dynamicTools: null,
      serviceTier: s ?? null,
      ...(a !== void 0 ? { serviceName: a } : {}),
    },
    Q =
      ge != null
        ? { threadId: ge }
        : await w.startThread(Pe).then((G) => ({ threadId: G.thread.id, startResponse: G })),
    { threadId: X } = Q;
  S?.(Q);
  try {
    if (M?.aborted) throw new DOMException("The operation was aborted", "AbortError");
    return await Mj({
      turnTrigger: h ?? f,
      responsesapiClientMetadata: v,
      responseSchema: _,
      prompt: ue,
      imageUrls: e,
      threadId: X,
      serviceTier: s,
      schema: c,
      timeoutMs: y,
      client: w,
      onTokenUsage: E,
      onText: T,
      onTurnCompleted: P,
      signal: M,
      experimentalPredictionMode: de,
      effort: i,
    });
  } finally {
    w.unsubscribeThread(X).catch(() => {});
  }
}
var qMt,
  DM = g(() => {
    _G();
    L0();
    qMt = 3e4;
  });
async function Fx({
  prompt: t,
  imageUrls: e,
  cwd: r,
  model: n,
  serviceTier: o,
  client: i,
  timeoutMs: s,
  promptCharLimit: a,
  buildGenerationPrompt: l,
  baseInstructions: c,
  outputSchema: u,
  responseSchema: p,
  extractParsedResult: m,
  tokenUsageTelemetryFeature: f,
  threadSource: h = f,
  onText: v,
  turnTrigger: y,
  signal: w,
  allowProviderModelFallback: _,
  config: S,
}) {
  let E = t.trim();
  if (E.length === 0) return null;
  let T = E.slice(0, a),
    P =
      n != null &&
      (f === "commit_message" ||
        f === "pull_request_message" ||
        f === "commit_pull_request_message")
        ? await IM(i, n, r, w)
        : n,
    M = null;
  try {
    let L = await kM({
      prompt: l(T),
      imageUrls: e,
      cwd: r,
      model: P,
      effort: "low",
      serviceTier: o,
      baseInstructions: c,
      schema: u,
      config: {
        ...S,
        "features.enable_fanout": !1,
        "features.multi_agent": !1,
        "features.multi_agent_v2": !1,
        web_search: "disabled",
      },
      threadSource: h,
      turnTrigger: y,
      timeoutMs: s,
      client: i,
      responseSchema: p,
      signal: w,
      allowProviderModelFallback: _,
      onText: v,
      onTokenUsage: (V) => {
        M = V;
      },
    });
    return (
      f != null &&
        P != null &&
        Fu({
          feature: f,
          model: P,
          reasoningEffort: "low",
          serviceTier: o ?? null,
          status: L == null ? "empty" : "success",
          tokenUsage: M,
        }),
      L == null ? null : m(L)
    );
  } catch (L) {
    throw (
      f != null &&
        P != null &&
        Fu({
          feature: f,
          model: P,
          reasoningEffort: "low",
          serviceTier: o ?? null,
          status: L instanceof Error && L.name === "AbortError" ? "canceled" : "error",
          tokenUsage: M,
        }),
      L
    );
  }
}
var MM = g(() => {
  Kg();
  f3();
  DM();
});
var $x,
  OM = g(() => {
    dw();
    $x = ks.ephemeralGenerationModel;
  });
function HMt(t) {
  return [
    "Using the supplied git context below, generate a git commit message.",
    "Write the result into the structured response field message.",
    "message must contain plain commit-message text only, not JSON, field labels, or code fences.",
    "Custom commit instructions for message content and formatting override the fallback rules below.",
    y3,
    "Bounds:",
    `- Keep the complete message under ${h3} characters.`,
    `- Keep the subject under ${g3} characters.`,
    "Fallback rules:",
    "- Generate a concise single-line subject.",
    "- Use an imperative verb first.",
    "- Do not add a scope prefix unless the context already clearly uses one.",
    "- Do not include markdown, quotes, or trailing punctuation.",
    "",
    "Diff context:",
    t,
  ].join(`
`);
}
function jMt(t) {
  return [
    "You are a helpful assistant. Generate a pull request title and body.",
    "Write the result into the structured response fields title and body.",
    y3,
    "If context includes pull request instructions, follow them even when they conflict with the default rules below.",
    "Language rules:",
    "- Match the primary language of the supplied context; default to English.",
    "- Translate standard section headings such as Summary and Testing when writing in another language.",
    "Fallback PR title rules:",
    "- title must contain only the PR title, not JSON, field labels, or body content.",
    "- Use an imperative or action-oriented phrasing first.",
    `- Keep the title under ${NM} characters.`,
    "- No trailing punctuation.",
    "Body rules:",
    "- body must contain only the PR body, not JSON, field labels, the title, or a full PR draft.",
    "- Do not repeat, restate, or label the title inside body.",
    "- Keep the body concise and scannable.",
    `- Keep the body under ${Ux} characters.`,
    "- Use Markdown with short bullets.",
    "- Include a Summary section and a Testing section.",
    "- In Testing, describe meaningful validation at a high level, such as new unit or integration tests, or local UI testing with Playwright.",
    "- Do not paste command transcripts. For routine checks, summarize the result, for example: lint and formatting passed.",
    '- If tests were not run, say "Not run (not requested)".',
    "- If context includes pull request instructions, apply them to the title/body content only.",
    "",
    "Context:",
    t,
  ].join(`
`);
}
function zMt(t) {
  return [
    "Using the supplied commit and pull request contexts below, generate one git commit message plus one pull request title and body.",
    "Write the result into the structured response fields message, title, and body.",
    "message must contain plain commit-message text only, not JSON, field labels, or code fences.",
    y3,
    "If context includes pull request instructions, follow them even when they conflict with the default pull request rules below.",
    "Custom commit instructions for message content and formatting apply to message only and override the fallback commit message rules below.",
    "Commit message bounds:",
    `- Keep the complete message under ${h3} characters.`,
    `- Keep the subject under ${g3} characters.`,
    "Fallback commit message rules:",
    "- Generate a concise single-line subject.",
    "- Use an imperative verb first.",
    "- Do not add a scope prefix unless the context already clearly uses one.",
    "- Do not include markdown, quotes, or trailing punctuation.",
    "Pull request language rules:",
    "- Match the primary language of the supplied context; default to English.",
    "- Translate standard section headings such as Summary and Testing when writing in another language.",
    "Fallback PR title rules:",
    "- title must contain only the PR title, not JSON, field labels, or body content.",
    "- Use an imperative or action-oriented phrasing first.",
    `- Keep title under ${NM} characters.`,
    "- No trailing punctuation.",
    "Pull request body rules:",
    "- body must contain only the PR body, not JSON, field labels, the title, or a full PR draft.",
    "- Do not repeat, restate, or label the title inside body.",
    "- Keep the body concise and scannable.",
    `- Keep the body under ${Ux} characters.`,
    "- Use Markdown with short bullets.",
    "- Include a Summary section and a Testing section.",
    "- In Testing, describe meaningful validation at a high level, such as new unit or integration tests, or local UI testing with Playwright.",
    "- Do not paste command transcripts. For routine checks, summarize the result, for example: lint and formatting passed.",
    '- If tests were not run, say "Not run (not requested)".',
    "- If context includes pull request instructions, apply them to title/body only.",
    "",
    "Commit and pull request context:",
    t,
  ].join(`
`);
}
var aOe,
  GMt,
  h3,
  g3,
  lOe,
  Ux,
  NM,
  cOe,
  WMt,
  y3,
  uOe,
  oOe,
  iOe,
  sOe,
  dOe,
  pOe,
  mOe,
  v3 = g(() => {
    $();
    lm();
    ((aOe = 3e4),
      (GMt = 2e4),
      (h3 = 4e3),
      (g3 = 72),
      (lOe = 45e3),
      (Ux = 3e4),
      (NM = 120),
      (cOe = 45e3),
      (WMt = 4e4),
      (y3 = "Make 0 tool calls."),
      (uOe = d
        .string()
        .min(8)
        .max(h3)
        .regex(new RegExp(`^[^\\r\\n]{1,${g3}}(?:\\r?\\n[\\s\\S]*)?$`))),
      (oOe = d.object({ message: uOe })),
      (iOe = d.object({ title: d.string().min(8).max(NM), body: d.string().min(12).max(Ux) })),
      (sOe = d.object({
        message: uOe,
        title: d.string().min(8).max(NM),
        body: d.string().min(12).max(Ux),
      })),
      (dOe = {
        tokenUsageTelemetryFeature: "commit_message",
        promptCharLimit: GMt,
        buildGenerationPrompt: HMt,
        outputSchema: Bo(oOe),
        responseSchema: oOe,
        extractParsedResult: (t) => t.message,
      }),
      (pOe = {
        tokenUsageTelemetryFeature: "pull_request_message",
        promptCharLimit: Ux,
        buildGenerationPrompt: jMt,
        outputSchema: Bo(iOe),
        responseSchema: iOe,
        extractParsedResult: (t) => t,
      }),
      (mOe = {
        tokenUsageTelemetryFeature: "commit_pull_request_message",
        promptCharLimit: WMt,
        buildGenerationPrompt: zMt,
        outputSchema: Bo(sOe),
        responseSchema: sOe,
        extractParsedResult: (t) => t,
      }));
  });
var LM,
  qx,
  fOe = g(() => {
    ot();
    O();
    OM();
    v3();
    MM();
    ((LM = class extends ee {
      constructor(r, n = async () => $x) {
        super();
        this.getAppServerClient = r;
        this.getModel = n;
      }
      generateCommit({ hostId: r, prompt: n, cwd: o = null }) {
        return new qx(async (i) =>
          Fx({
            client: this.getAppServerClient(r),
            cwd: o,
            model: await this.getModel(),
            prompt: n,
            serviceTier: null,
            signal: i,
            timeoutMs: aOe,
            ...dOe,
          }),
        );
      }
      generateCommitPullRequest({ hostId: r, prompt: n, cwd: o = null }) {
        return new qx(async (i) =>
          Fx({
            client: this.getAppServerClient(r),
            cwd: o,
            model: await this.getModel(),
            prompt: n,
            serviceTier: null,
            signal: i,
            timeoutMs: cOe,
            ...mOe,
          }),
        );
      }
      generatePullRequest({ appServerVersion: r, hostId: n, prompt: o, cwd: i = null }) {
        return new qx(async (s) =>
          Fx({
            allowProviderModelFallback: r === void 0 ? void 0 : Ms(r, "providerModelFallback"),
            client: this.getAppServerClient(n),
            cwd: i,
            model: await this.getModel(),
            prompt: o,
            serviceTier: null,
            signal: s,
            timeoutMs: lOe,
            ...pOe,
          }),
        );
      }
    }),
      (qx = class extends ee {
        abortController = new AbortController();
        result;
        disposed = !1;
        settled = !1;
        constructor(e) {
          (super(),
            (this.result = e(this.abortController.signal)
              .catch((r) => {
                if (this.abortController.signal.aborted) throw r;
                return null;
              })
              .finally(() => {
                this.settled = !0;
              })),
            this.result.catch(() => {}));
        }
        wait() {
          return this.result;
        }
        [Symbol.dispose]() {
          this.disposed || this.settled || ((this.disposed = !0), this.abortController.abort());
        }
      }));
  });
