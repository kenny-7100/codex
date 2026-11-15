import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
const shell = await fs.readFile(
  new URL("../../overrides/out/lan/shell.html", import.meta.url),
  "utf8",
);
async function open(page, url = "http://192.0.2.1:8765/") {
  await page.route("**/*", (route) =>
    new URL(route.request().url()).pathname === "/windows"
      ? route.fulfill({ json: [] })
      : route.fulfill({ contentType: "text/html", body: shell }),
  );
  await page.goto(url);
  await page.evaluate(() => (document.querySelector("#share").hidden = false));
}
test("ordinary HTTP copies the actual link without a prompt", async ({
  page,
  context,
}) => {
  await open(page);
  expect(await page.evaluate(() => isSecureContext)).toBe(false);
  expect(await page.evaluate(() => navigator.clipboard)).toBeUndefined();
  const reader = await context.newPage();
  await context.grantPermissions(["clipboard-read", "clipboard-write"], {
    origin: "http://localhost:4317",
  });
  await reader.goto("http://localhost:4317");
  const previous = await reader.evaluate(() => navigator.clipboard.readText());
  try {
    await page
      .getByRole("button", { name: "复制会话链接", exact: true })
      .click();
    await expect(page.locator("#status")).toHaveText("会话链接已复制");
    await expect(page.locator("#manual-copy")).not.toBeVisible();
    expect(await reader.evaluate(() => navigator.clipboard.readText())).toBe(
      "http://192.0.2.1:8765/",
    );
  } finally {
    await reader.evaluate(
      (value) => navigator.clipboard.writeText(value),
      previous,
    );
  }
});
test("modern clipboard API is preferred and rejected permission falls back to selection copy", async ({
  page,
}) => {
  await open(page, "http://localhost:4317/");
  await page.evaluate(() => {
    window.copied = [];
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async (value) => window.copied.push(value) },
    });
    document.execCommand = () => {
      throw Error("Selection copy should not run");
    };
  });
  await page.getByRole("button", { name: "复制会话链接", exact: true }).click();
  expect(await page.evaluate(() => window.copied)).toEqual([
    "http://localhost:4317/",
  ]);
  await page.evaluate(() => {
    navigator.clipboard.writeText = async () => {
      throw Error("Permission denied");
    };
    document.execCommand = (command) => {
      window.fallbackCommand = command;
      return true;
    };
  });
  await page.getByRole("button", { name: "复制会话链接", exact: true }).click();
  expect(await page.evaluate(() => window.fallbackCommand)).toBe("copy");
  await expect(page.locator("#status")).toHaveText("会话链接已复制");
});
test("failed copying presents explicit manual instructions and never claims success", async ({
  page,
}) => {
  await open(page);
  await page.evaluate(() => (document.execCommand = () => false));
  await page.getByRole("button", { name: "复制会话链接", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator("#status")).toHaveText("未能自动复制，请手动复制");
  await expect(page.getByLabel("会话链接", { exact: true })).toHaveValue(
    "http://192.0.2.1:8765/",
  );
  expect(
    await page
      .getByLabel("会话链接", { exact: true })
      .evaluate((el) => el.selectionEnd - el.selectionStart),
  ).toBe("http://192.0.2.1:8765/".length);
  await page.getByRole("button", { name: "关闭", exact: true }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.locator("#status")).not.toHaveText("会话链接已复制");
});
