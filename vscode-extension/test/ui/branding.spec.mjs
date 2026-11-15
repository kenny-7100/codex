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

const startupScript = await fs.readFile(new URL('../../overrides/webview/assets/jimao-startup.js', import.meta.url), 'utf8');
for (const width of [390, 1100]) {
  test(`startup image survives empty commits and repeated fallbacks, then exposes content (${width})`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.route('**/logo-preview', route => route.fulfill({ contentType: 'text/html', body: html }));
    await page.goto('/logo-preview');
    await page.evaluate(startupScript);
    const avatar = page.locator('#jimao-startup img');
    const initial = await avatar.boundingBox();
    expect(initial.x + initial.width / 2).toBe(width / 2);
    expect(initial.y + initial.height / 2).toBe(400);
    for (const content of ['', '<div></div>', '<div class="jimao-loading-avatar"><div>loading</div></div>', '', '<div class="jimao-loading-avatar"><div>loading again</div></div>']) {
      await page.locator('#root').evaluate((root, content) => { root.innerHTML = content; }, content);
      await expect(avatar).toBeVisible();
      expect(await avatar.boundingBox()).toEqual(initial);
      const hidden = page.locator('.jimao-loading-avatar');
      if (await hidden.count()) await expect(hidden).toBeHidden();
    }
    await page.locator('#root').evaluate(root => { root.innerHTML = '<div role="alert">连接失败，请重试</div>'; });
    await expect(page.locator('#jimao-startup')).toHaveCount(0);
    await expect(page.getByRole('alert')).toBeVisible();
  });
}

for (const width of [320, 940]) {
  test(`VS Code default body padding cannot overflow the startup document before app CSS loads (${width})`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    // VS Code injects this style before the extension document. Deliberately
    // omit application CSS so this checks the very first paint, not its reset.
    const hostHTML = html.replace('<head>', '<head><style>body { margin: 0; padding: 0 20px; }</style>');
    await page.route('**/logo-preview', route => route.fulfill({ contentType: 'text/html', body: hostHTML }));
    await page.goto('/logo-preview');
    for (const phase of [0, 180, 360, 720]) {
      await page.locator('#jimao-startup img').evaluate((el, phase) => {
        const animation = el.getAnimations()[0];
        animation.pause();
        animation.currentTime = phase;
      }, phase);
      const dimensions = await page.evaluate(() => ({
        viewport: innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.getBoundingClientRect().width,
        root: document.getElementById('root').getBoundingClientRect().width,
      }));
      expect(dimensions.document).toBe(dimensions.viewport);
      expect(dimensions.body).toBe(width);
      expect(dimensions.root).toBe(width);
    }
    // A document reset must preserve scrolling inside actual app content.
    await page.evaluate(() => {
      document.getElementById('root').innerHTML = '<div id="code" style="width:100%;overflow-x:auto"><pre style="width:1800px">long code</pre></div>';
      document.getElementById('code').scrollLeft = 100;
    });
    expect(await page.locator('#code').evaluate(el => el.scrollLeft)).toBe(100);
  });
}
