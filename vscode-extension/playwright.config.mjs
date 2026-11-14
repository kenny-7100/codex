import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./test/ui",
  workers: 1,
  fullyParallel: false,
  timeout: 30000,
  reporter: [["list"], ["json", { outputFile: "reports/ui-tests.json" }]],
  use: {
    baseURL: "http://127.0.0.1:4317",
    viewport: { width: 960, height: 1000 },
    launchOptions: {
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      args: ["--no-first-run"],
    },
    trace: "retain-on-failure",
  },
  outputDir: "reports/ui-artifacts",
  webServer: {
    command: "node test/ui-server.mjs",
    url: "http://127.0.0.1:4317",
    reuseExistingServer: false,
  },
});
