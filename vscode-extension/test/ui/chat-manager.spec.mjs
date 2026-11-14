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
  expect((await panel.boundingBox()).height).toBeGreaterThan(500);
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
  await expect(page.locator("[data-result-id]")).toHaveCount(134);
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
