import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
const shell = await fs.readFile(
  new URL("../../overrides/out/lan/shell.html", import.meta.url),
  "utf8",
);
const bridge = (
  await fs.readFile(
    new URL("../../overrides/out/lan/bridge.js", import.meta.url),
    "utf8",
  )
)
  .replace("__CLIENT_ID__", '"fixture"')
  .replace("__WINDOW_ID__", '"fixture-window"')
  .replace("__INITIAL_ROUTE__", '"/"');
async function openShell(page, fakeViewport = false) {
  if (fakeViewport)
    await page.addInitScript(() => {
      if (window !== top) return;
      const viewport = new EventTarget();
      Object.assign(viewport, {
        height: 844,
        width: 390,
        offsetTop: 0,
        offsetLeft: 0,
        scale: 1,
      });
      Object.defineProperty(window, "visualViewport", {
        value: viewport,
        configurable: true,
      });
      window.setTestViewport = (values) => {
        Object.assign(viewport, values);
        viewport.dispatchEvent(new Event("resize"));
        viewport.dispatchEvent(new Event("scroll"));
      };
    });
  await page.route("**/lan-viewport", (route) =>
    route.fulfill({ contentType: "text/html", body: shell }),
  );
  await page.route("**/windows", (route) => route.fulfill({ json: [] }));
  await page.route("**/frame/fixture", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: `<!doctype html><html><head><script>window.EventSource=class{close(){}addEventListener(){}};</script><script>${bridge}</script><style>#root{display:flex;flex-direction:column}#messages{flex:1;min-height:0;overflow:auto}#nested{height:90px;overflow:auto}#wide{width:140px;overflow:auto;white-space:nowrap}</style></head><body><div id="root"><main id="messages"><div id="nested"><div style="height:350px">Nested dialog</div></div>${"<p>Conversation content</p>".repeat(100)}<div id="wide"><span style="display:inline-block;width:900px">Horizontal code</span></div></main><textarea aria-label="Composer" style="flex-shrink:0;height:48px"></textarea></div></body></html>`,
    }),
  );
  await page.goto("/lan-viewport");
  await page.evaluate(() => {
    const view = document.querySelector("#view");
    view.hidden = false;
    view.src = "/frame/fixture";
    document.querySelector("#empty").hidden = true;
    const inactive = document.createElement("iframe");
    inactive.hidden = true;
    document.body.append(inactive);
  });
  await expect(page.locator("body > iframe[hidden]")).toBeHidden();
  await page
    .frameLocator("#view")
    .getByRole("textbox", { name: "Composer" })
    .waitFor();
  return page.frames().find((frame) => frame.url().endsWith("/frame/fixture"));
}
async function expectFixedRoots(surface) {
  expect(
    await surface.evaluate(() =>
      [document.documentElement, document.body].every((el) => {
        const css = getComputedStyle(el);
        return css.overflowY === "hidden" && css.overscrollBehaviorY === "none";
      }),
    ),
  ).toBe(true);
  expect(await surface.evaluate(() => ({ x: scrollX, y: scrollY }))).toEqual({
    x: 0,
    y: 0,
  });
}
test("idle window polling preserves native selector options and updates real list changes", async ({
  page,
}) => {
  let windows = [{ id: "first", name: "codex", folders: ["/work/codex"] }];
  let polls = 0;
  await page.route("**/lan-selector", (route) =>
    route.fulfill({ contentType: "text/html", body: shell }),
  );
  await page.route("**/windows", (route) => {
    polls++;
    return route.fulfill({ json: windows });
  });
  await page.goto("/lan-selector");
  await expect(page.locator("#windows option")).toHaveCount(2);
  await page.locator("#windows").focus();
  await page.evaluate(() => {
    window.originalOption = document.querySelector(
      "#windows option[value=first]",
    );
    window.selectorChanges = 0;
    new MutationObserver((changes) => {
      window.selectorChanges += changes.length;
    }).observe(document.querySelector("#windows"), {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
    });
  });
  const baseline = polls;
  await expect
    .poll(() => polls, { timeout: 10000 })
    .toBeGreaterThanOrEqual(baseline + 2);
  expect(
    await page.evaluate(
      () =>
        window.originalOption ===
        document.querySelector("#windows option[value=first]"),
    ),
  ).toBe(true);
  expect(await page.evaluate(() => window.selectorChanges)).toBe(0);
  await expect(page.locator("#windows")).toBeFocused();
  windows = [{ id: "second", name: "renamed", folders: ["/work/other"] }];
  await expect(page.locator("#windows option[value=second]")).toHaveCount(1);
  await expect(page.locator("#windows option[value=first]")).toHaveCount(0);
  expect(
    await page
      .locator("#windows option[value=second]")
      .getAttribute("aria-label"),
  ).toContain("/work/other");
});
test("LAN shell and iframe stay fixed while conversation, nested dialog and code can scroll", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const frame = await openShell(page);
  await expectFixedRoots(page);
  await expectFixedRoots(frame);
  const before = await page.locator("header").boundingBox();
  await frame.locator("#messages").hover();
  await page.mouse.wheel(0, 450);
  await expect
    .poll(() => frame.locator("#messages").evaluate((el) => el.scrollTop))
    .toBeGreaterThan(0);
  await frame.locator("#messages").evaluate((el) => (el.scrollTop = 0));
  await frame.locator("#nested").hover();
  await page.mouse.wheel(0, 160);
  await expect
    .poll(() => frame.locator("#nested").evaluate((el) => el.scrollTop))
    .toBeGreaterThan(0);
  expect(await frame.locator("#messages").evaluate((el) => el.scrollTop)).toBe(
    0,
  );
  await page.mouse.wheel(0, -1000);
  await expectFixedRoots(page);
  await expectFixedRoots(frame);
  expect(await page.locator("header").boundingBox()).toEqual(before);
  await frame.locator("#wide").evaluate((el) => (el.scrollLeft = 150));
  expect(await frame.locator("#wide").evaluate((el) => el.scrollLeft)).toBe(
    150,
  );
  await frame.getByRole("textbox").fill("Draft remains editable");
  await expect(frame.getByRole("textbox")).toHaveValue(
    "Draft remains editable",
  );
});
test("home history only scrolls vertically while the composer stays visible", async ({
  page,
}) => {
  const frame = await openShell(page);
  await frame.evaluate(() => {
    const root = document.querySelector("#root");
    root.innerHTML =
      '<section data-jimao-home-header><div style="height:32px">Chats</div><div id="history"><div style="width:calc(100% + 1px);height:300px">History rows</div></div></section><div style="display:flex;flex-direction:column;justify-content:flex-end"><textarea aria-label="Composer" style="height:90px;flex-shrink:0"></textarea></div>';
  });
  for (const [width, height] of [
    [2000, 800],
    [1100, 740],
    [390, 430],
    [320, 320],
  ]) {
    await page.setViewportSize({ width, height });
    await expect.poll(() => frame.evaluate(() => innerWidth)).toBe(width);
    const history = frame.locator("#history");
    expect(await history.evaluate((el) => getComputedStyle(el).overflowX)).toBe(
      "hidden",
    );
    expect(await history.evaluate((el) => getComputedStyle(el).overflowY)).toBe(
      "auto",
    );
    const composer = await frame.getByRole("textbox").boundingBox();
    expect(composer.y + composer.height).toBeLessThanOrEqual(height + 1);
    if (height === 320) {
      await history.evaluate((el) => {
        el.scrollTop = el.scrollHeight;
      });
      expect(await history.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
    }
  }
});
test("visual viewport keyboard resize and offset are applied once, then restore", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const frame = await openShell(page, true);
  for (const viewport of [
    { height: 430, offsetTop: 90 },
    { height: 844, offsetTop: 0 },
    { height: 380, offsetTop: 120 },
    { height: 844, offsetTop: 0 },
  ]) {
    await page.evaluate((values) => window.setTestViewport(values), viewport);
    await expect
      .poll(() =>
        page
          .locator("body")
          .evaluate((el) => Math.round(el.getBoundingClientRect().height)),
      )
      .toBe(viewport.height);
    expect(Math.round((await page.locator("body").boundingBox()).y)).toBe(
      viewport.offsetTop,
    );
    const iframe = await page.locator("#view").boundingBox(),
      input = await frame.getByRole("textbox").boundingBox();
    expect(
      Math.abs(iframe.y + iframe.height - input.y - input.height),
    ).toBeLessThan(2);
    await expectFixedRoots(page);
    await expectFixedRoots(frame);
  }
  await page.screenshot({ path: "reports/lan-viewport-restored.png" });
});
test("mobile touch scroll stays inside the iframe and viewport resizing keeps composer visible", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  try {
    const frame = await openShell(page),
      cdp = await context.newCDPSession(page);
    const box = await frame.locator("#messages").boundingBox();
    await cdp.send("Input.synthesizeScrollGesture", {
      x: Math.round(box.x + box.width / 2),
      y: Math.round(box.y + box.height / 2),
      yDistance: -240,
      gestureSourceType: "touch",
    });
    await expect
      .poll(() => frame.locator("#messages").evaluate((el) => el.scrollTop))
      .toBeGreaterThan(0);
    let navigations = 0;
    page.on("framenavigated", () => navigations++);
    for (const boundary of ["top", "bottom"]) {
      await frame.locator("#messages").evaluate((el, edge) => {
        el.scrollTop = edge === "top" ? 0 : el.scrollHeight;
      }, boundary);
      await cdp.send("Input.synthesizeScrollGesture", {
        x: Math.round(box.x + box.width / 2),
        y: Math.round(box.y + box.height / 2),
        yDistance: boundary === "top" ? 240 : -240,
        gestureSourceType: "touch",
      });
      await expectFixedRoots(page);
      await expectFixedRoots(frame);
      expect(navigations).toBe(0);
    }
    for (const height of [430, 844]) {
      await page.setViewportSize({ width: 390, height });
      await expect
        .poll(() =>
          page
            .locator("body")
            .evaluate((el) => Math.round(el.getBoundingClientRect().height)),
        )
        .toBe(height);
      await expectFixedRoots(page);
      await expectFixedRoots(frame);
      const input = await frame.getByRole("textbox").boundingBox();
      expect(input.y + input.height).toBeLessThanOrEqual(height + 1);
    }
  } finally {
    await context.close();
  }
});
