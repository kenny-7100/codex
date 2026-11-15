import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
const shell = await fs.readFile(
  new URL("../../overrides/out/lan/shell.html", import.meta.url),
  "utf8",
);
for (const stage of ["connect pending", "frame loading", "loaded"]) {
  test(`clearing selection during ${stage} survives polling and late messages, then reselects`, async ({
    page,
  }) => {
    let release;
    const gate = new Promise((resolve) => {
      release = resolve;
    });
    let connects = 0,
      polls = 0;
    const disconnects = [];
    await page.addInitScript(() => {
      if (window === top) sessionStorage.setItem("jimao-window", "window-A");
    });
    await page.route("**/selection-race", (route) =>
      route.fulfill({ contentType: "text/html", body: shell }),
    );
    await page.route("**/windows", (route) => {
      polls++;
      return route.fulfill({
        json: [{ id: "window-A", name: "codex", folders: ["/work/codex"] }],
      });
    });
    await page.route("**/connect", async (route) => {
      const client = "client-" + ++connects;
      if (stage === "connect pending" && connects === 1) await gate;
      await route.fulfill({ json: { id: client, windowId: "window-A" } });
    });
    await page.route("**/disconnect/*", (route) => {
      disconnects.push(route.request().url().split("/").pop());
      return route.fulfill({ json: {} });
    });
    await page.route("**/frame/*", async (route) => {
      if (stage === "frame loading") await gate;
      await route.fulfill({
        contentType: "text/html",
        body: '<!doctype html><body>Conversation<script>parent.postMessage({type:"jimao-connection",status:"已连接"},location.origin)</script>',
      });
    });
    try {
      await page.goto("/selection-race");
      await expect.poll(() => connects).toBe(1);
      if (stage !== "connect pending")
        await expect(page.locator("#view")).toHaveAttribute(
          "src",
          "/frame/client-1",
        );
      if (stage === "loaded")
        await expect(page.locator("#status")).toHaveText("已连接");
      await page.locator("#windows").selectOption("");
      const expectCleared = async () => {
        await expect(page.locator("#windows")).toHaveValue("");
        await expect(page.locator("#windows")).toHaveAttribute(
          "title",
          "选择 VS Code 窗口",
        );
        await expect(page.locator("#explanation")).toHaveText(
          "请选择 VS Code 窗口。",
        );
        await expect(page.locator("#empty")).toBeVisible();
        await expect(page.locator("iframe:visible")).toHaveCount(0);
        await expect(page.locator("#status")).toHaveText("未选择窗口");
        await expect(page.locator("#share")).toBeHidden();
        expect(
          await page.evaluate(() => sessionStorage.getItem("jimao-window")),
        ).toBeNull();
        expect(new URL(page.url()).pathname).toBe("/");
      };
      await expectCleared();
      release();
      if (stage === "connect pending")
        await expect.poll(() => disconnects).toContain("client-1");
      else {
        await expect
          .poll(
            () =>
              page.frames().filter((f) => f.url().includes("/frame/")).length,
          )
          .toBe(1);
        const old = page.frames().find((f) => f.url().includes("/frame/"));
        await old.evaluate(() =>
          parent.postMessage(
            { type: "jimao-connection", status: "已连接" },
            location.origin,
          ),
        );
      }
      const baseline = polls;
      await expect
        .poll(() => polls, { timeout: 10000 })
        .toBeGreaterThan(baseline);
      await expectCleared();
      await page.locator("#windows").selectOption("window-A");
      await expect(page.locator("#view")).toBeVisible();
      await expect(page.locator("#empty")).toBeHidden();
      await expect(page.locator("#status")).toHaveText("已连接");
      expect(
        await page.evaluate(() => sessionStorage.getItem("jimao-window")),
      ).toBe("window-A");
      expect(connects).toBe(stage === "connect pending" ? 2 : 1);
    } finally {
      release();
    }
  });
}
