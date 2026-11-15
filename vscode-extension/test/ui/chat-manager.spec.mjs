import { test, expect } from "@playwright/test";
test.beforeEach(async ({ request, page }) => {
  await request.post("/reset");
  await page.goto("/");
  await expect(page.getByRole("status")).toHaveText("134 个聊天");
});
test("compact search has only name, dates and tags; list owns sorting; timestamps and rename persist", async ({
  page,
}) => {
  const panel = page.getByRole("region", { name: "聊天搜索", exact: true });
  await expect(panel).toBeVisible();
  expect((await panel.boundingBox()).height).toBeLessThan(600);
  await expect(page.getByLabel("搜索范围")).toHaveCount(0);
  await expect(page.getByLabel("项目 / 工作目录")).toHaveCount(0);
  await expect(
    page.getByLabel("聊天列表工具栏").getByLabel("排序", { exact: true }),
  ).toBeVisible();
  const row = page.locator('[data-chat-id="fixture-1"]');
  await expect(row.locator("time")).toHaveText(
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
  );
  await expect(page.locator('[data-chat-id="fixture-0"] time')).toHaveText(
    /分钟前/,
  );
  await row.getByRole("button", { name: "重命名聊天" }).click();
  await row.getByLabel("聊天名称").fill("失败测试");
  await row.getByRole("button", { name: "保存", exact: true }).click();
  await expect(row.getByRole("alert")).toHaveText("模拟保存失败");
  await row.getByLabel("聊天名称").fill("结构研究 · 已改名");
  await row.getByRole("button", { name: "保存", exact: true }).click();
  await expect(row).toContainText("结构研究 · 已改名");
  await page.reload();
  await expect(row).toContainText("结构研究 · 已改名");
  await row.getByRole("button", { name: "重命名聊天" }).click();
  await row.getByLabel("聊天名称").fill("取消的名字");
  await row.getByLabel("聊天名称").press("Escape");
  await expect(row).toContainText("结构研究 · 已改名");
  await expect(page.locator("#codexx-chat-manager-styles")).toHaveCount(1);
});
test("tags persist and combine with name/date filters; tag management updates filters", async ({
  page,
}) => {
  const row = page.locator('[data-chat-id="fixture-0"]');
  await row.getByRole("button", { name: "编辑标签" }).click();
  await row.getByLabel("标签（用逗号分隔）").fill("插件,待处理,插件");
  await row.getByRole("button", { name: "保存", exact: true }).click();
  await expect(row.locator(".cm-tag")).toHaveCount(2);
  await page.reload();
  await expect(row.locator(".cm-tag")).toHaveCount(2);
  await page.getByLabel("标签", { exact: true }).fill("插件,待处理");
  await expect(page.locator("[data-result-id]")).toHaveCount(1);
  await page.getByLabel("聊天名称", { exact: true }).fill("不存在的名字");
  await expect(page.locator("[data-result-id]")).toHaveCount(0);
  await page.getByLabel("聊天名称", { exact: true }).fill("");
  await page.getByLabel("开始时间").fill("2099-01-01T00:00");
  await expect(page.locator("[data-result-id]")).toHaveCount(0);
  await page.getByLabel("开始时间").fill("");
  await page.getByRole("button", { name: "管理标签", exact: true }).click();
  await page.getByLabel("选择标签", { exact: true }).selectOption("插件");
  await page.getByLabel("新标签名称").fill("开发");
  await page.getByRole("button", { name: "重命名标签", exact: true }).click();
  await expect(page.getByLabel("标签", { exact: true })).toHaveValue(
    "开发, 待处理",
  );
  await expect(row.locator(".cm-tag").filter({ hasText: "开发" })).toHaveCount(
    1,
  );
  await page.getByRole("button", { name: "删除标签", exact: true }).click();
  await page.getByRole("button", { name: "确定删除", exact: true }).click();
  await expect(row.locator(".cm-tag")).toHaveCount(1);
});
test("history beyond 100 loads automatically, name search and list sorting work", async ({
  page,
}) => {
  await page.getByLabel("聊天名称", { exact: true }).fill('"历史聊天 120"');
  await expect(page.locator('[data-result-id="fixture-120"]')).toBeVisible();
  await expect(page.locator("[data-result-id]")).toHaveCount(1);
  await page.getByRole("button", { name: "清空筛选" }).click();
  await expect(page.locator("[data-result-id]")).toHaveCount(10);
  await page.getByLabel("排序", { exact: true }).selectOption("updated-asc");
  await expect(page.locator("[data-result-id]").first()).toHaveAttribute(
    "data-result-id",
    "fixture-133",
  );
  await page.getByLabel("排序", { exact: true }).selectOption("updated-desc");
  await expect(page.locator("[data-result-id]").first()).toHaveAttribute(
    "data-result-id",
    "fixture-0",
  );
  await page.getByRole("button", { name: "刷新", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("134 个聊天");
});
test("mobile and desktop have one panel, no horizontal overflow and useful result space", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 740 });
  await page.reload();
  await expect(
    page.getByRole("region", { name: "聊天搜索", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(
    (await page.getByLabel("聊天搜索结果").boundingBox()).height,
  ).toBeGreaterThan(200);
  await expect(page.locator("main")).toHaveCount(1);
  await page.screenshot({
    path: "reports/chat-manager-mobile.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 960, height: 1000 });
  await page.screenshot({
    path: "reports/chat-manager-desktop.png",
    fullPage: true,
  });
});

test("tags stay beside titles and the top right close button closes and reopens the panel", async ({
  page,
}) => {
  const row = page.locator('[data-chat-id="fixture-0"]');
  await row.getByRole("button", { name: "编辑标签" }).click();
  await row.getByLabel("标签（用逗号分隔）").fill("test,开发");
  await row.getByRole("button", { name: "保存", exact: true }).click();
  for (const width of [960, 390]) {
    await page.setViewportSize({ width, height: 900 });
    const title = await row.locator(".cm-title-text").boundingBox();
    const tag = await row.locator(".cm-tag").first().boundingBox();
    expect(tag.x).toBeGreaterThanOrEqual(title.x + title.width - 1);
    expect(
      Math.abs(tag.y + tag.height / 2 - (title.y + title.height / 2)),
    ).toBeLessThan(3);
    const panel = await page
      .getByRole("region", { name: "聊天搜索", exact: true })
      .boundingBox();
    const close = page.getByRole("button", {
      name: "关闭搜索面板",
      exact: true,
    });
    const bounds = await close.boundingBox();
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(panel.x + panel.width);
    expect(bounds.y - panel.y).toBeLessThan(20);
    await page.screenshot({
      path: `reports/chat-manager-inline-tags-${width}.png`,
      fullPage: true,
    });
  }
  await page.getByRole("button", { name: "关闭搜索面板", exact: true }).click();
  await expect(
    page.getByRole("region", { name: "聊天搜索", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "打开聊天搜索", exact: true }).click();
  await expect(
    page.getByRole("region", { name: "聊天搜索", exact: true }),
  ).toBeVisible();
  await row.locator(".cm-tag").first().click();
  await expect(page.getByLabel("标签", { exact: true })).toHaveValue("test");
});

test("ten-row pages preserve global search and reset after filters, sorting and refresh", async ({
  page,
}) => {
  const rows = page.locator("[data-result-id]");
  const previous = page.getByRole("button", { name: "上一页", exact: true });
  const next = page.getByRole("button", { name: "下一页", exact: true });
  const first = page.getByRole("button", { name: "首页", exact: true });
  const last = page.getByRole("button", { name: "尾页", exact: true });
  const info = page.locator(".cm-page-info");
  await expect(rows).toHaveCount(10);
  await expect(info).toHaveText("第 1 / 14 页 · 每页 10 条");
  await expect(previous).toBeDisabled();
  await next.click();
  await expect(rows.first()).toHaveAttribute("data-result-id", "fixture-10");
  await expect(rows).toHaveCount(10);
  await previous.click();
  await expect(rows.first()).toHaveAttribute("data-result-id", "fixture-0");
  await expect(first).toBeDisabled();
  const fullHeight = (
    await page
      .getByRole("region", { name: "聊天搜索", exact: true })
      .boundingBox()
  ).height;
  await last.click();
  await expect(rows).toHaveCount(4);
  await expect(info).toHaveText("第 14 / 14 页 · 每页 10 条");
  await expect(last).toBeDisabled();
  expect(
    (
      await page
        .getByRole("region", { name: "聊天搜索", exact: true })
        .boundingBox()
    ).height,
  ).toBeLessThan(fullHeight - 100);
  await first.click();
  await expect(rows.first()).toHaveAttribute("data-result-id", "fixture-0");
  await expect(first).toBeDisabled();
  await last.click();
  await expect(next).toBeDisabled();
  await page.getByLabel("聊天名称", { exact: true }).fill('"历史聊天 120"');
  await expect(rows).toHaveCount(1);
  await expect(rows.first()).toHaveAttribute("data-result-id", "fixture-120");
  await expect(info).toHaveText("第 1 / 1 页 · 每页 10 条");
  await expect(previous).toBeDisabled();
  await expect(next).toBeDisabled();
  await page.getByLabel("聊天名称", { exact: true }).fill("没有这个聊天");
  await expect(rows).toHaveCount(0);
  await expect(first).toBeDisabled();
  await expect(last).toBeDisabled();
  await expect(previous).toBeDisabled();
  await expect(next).toBeDisabled();
  await page.getByRole("button", { name: "清空筛选" }).click();
  await next.click();
  await page.getByLabel("排序", { exact: true }).selectOption("updated-asc");
  await expect(info).toHaveText("第 1 / 14 页 · 每页 10 条");
  await expect(rows.first()).toHaveAttribute("data-result-id", "fixture-133");
  await next.click();
  await page.getByRole("button", { name: "刷新", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("134 个聊天");
  await expect(info).toHaveText("第 1 / 14 页 · 每页 10 条");
});


test("touch search controls have compact visual fonts and aligned toolbar heights", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4317/");
    await page.evaluate(() => { const meta = document.createElement("meta"); meta.name = "viewport"; meta.content = "width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"; document.head.append(meta); });
    const panel = page.getByRole("region", { name: "聊天搜索", exact: true });
    await expect(panel).toBeVisible();
    for (const control of [panel.getByLabel("聊天名称", { exact: true }), panel.getByLabel("开始时间"), panel.getByLabel("结束时间"), panel.getByLabel("标签", { exact: true }), panel.getByLabel("排序", { exact: true })]) {
      const metrics = await control.evaluate(el => { const s = getComputedStyle(el); return { visualFont: parseFloat(s.fontSize) * parseFloat(s.zoom), font: parseFloat(s.fontSize) }; });
      expect(metrics.font).toBe(16);
      expect(metrics.visualFont).toBeCloseTo(13, 1);
    }
    const heights = await Promise.all([panel.getByLabel("排序", { exact: true }), panel.getByRole("button", { name: "刷新", exact: true }), panel.getByRole("button", { name: "清空筛选" })].map(async el => (await el.boundingBox()).height));
    for (const height of heights) expect(height).toBeCloseTo(28, 0);
    await page.screenshot({ path: "reports/chat-manager-touch-typography.png" });
    expect(await panel.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    await page.screenshot({ path: "reports/chat-manager-touch-typography.png" });
  } finally { await context.close(); }
});
