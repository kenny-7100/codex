import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import { brandStartupHTML } from "../../scripts/branding.mjs";
const template = await fs.readFile(
  new URL("../../src/webview/index.html", import.meta.url),
  "utf8",
);
const svg = await fs.readFile(
  new URL("../../overrides/resources/jimao.svg", import.meta.url),
);
const html = brandStartupHTML(
  template,
  "data:image/svg+xml;base64," + svg.toString("base64"),
)
  .replace(/<script[^>]*src=[^>]*><\/script>/g, "")
  .replace(/<link[^>]*>/g, "");
test("circular photo renders in the startup loader and wiggles without shimmer, respecting reduced motion", async ({
  page,
}) => {
  await page.route("**/logo-preview", (route) =>
    route.fulfill({ contentType: "text/html", body: html }),
  );
  await page.goto("/logo-preview");
  const avatar = page.getByRole("img", { name: "Jimao", includeHidden: true });
  await expect(avatar).toBeVisible();
  expect(
    await avatar.evaluate((el) => el.complete && el.naturalWidth === 256),
  ).toBe(true);
  expect(await avatar.evaluate((el) => getComputedStyle(el).borderRadius)).toBe(
    "50%",
  );
  expect(
    await avatar.evaluate((el) => getComputedStyle(el, "::after").display),
  ).toBe("none");
  expect(
    await avatar.evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("jimao-avatar-wiggle");
  const motion = await avatar.evaluate((el) => {
    const animation = el.getAnimations()[0];
    animation.pause();
    animation.currentTime = 0;
    const start = el.getBoundingClientRect().toJSON();
    animation.currentTime = 360;
    return { start, moved: el.getBoundingClientRect().toJSON() };
  });
  expect(Math.abs(motion.moved.y - motion.start.y)).toBeGreaterThan(1);
  await page.screenshot({ path: "reports/jimao-photo-loading.png" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await avatar.evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  expect(await avatar.evaluate((el) => getComputedStyle(el).transform)).toBe(
    "none",
  );
  await page.screenshot({ path: "reports/jimao-photo-loading-still.png" });
});
