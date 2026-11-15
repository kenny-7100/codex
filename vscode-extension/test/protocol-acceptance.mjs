import assert from "node:assert/strict";
import fs from "node:fs/promises";

// Called by LAN acceptance with a real VS Code host and the bundled engine.
// A separate browser page keeps these synthetic conversations out of other checks.
export async function protocolAcceptance(browser, address, windowId, requests) {
  const page = await browser.newPage({
    viewport: { width: 1100, height: 900 },
  });
  page.setDefaultTimeout(30000);
  try {
    await page.goto(address);
    await page.locator("select").selectOption(windowId);
    await page.frameLocator("#view").getByRole("textbox").waitFor();
    let frame = page.frames().find((f) => f.url().includes("/frame/"));
    const native = async (method, params) =>
      frame.evaluate(
        async ({ method, params }) => {
          const manager = await import(
            new URL(
              "./chat-manager-store.js",
              document.querySelector("script[src]").src,
            ).href
          );
          return manager.nativeRequest(method, params);
        },
        { method, params },
      );
    const routeId = () =>
      frame.evaluate(
        (id) =>
          sessionStorage
            .getItem("jimao-route-" + id)
            ?.split("/local/")[1]
            ?.split(/[/?#]/)[0],
        windowId,
      );
    const waitRoute = async (previous) => {
      await frame.waitForFunction(
        ({ id, previous }) => {
          const route = sessionStorage.getItem("jimao-route-" + id);
          return (
            route?.startsWith("/local/") &&
            !route.includes("client-new-thread:") &&
            !route.includes(previous || "no-previous-route")
          );
        },
        { id: windowId, previous },
      );
      return routeId();
    };
    const send = async (text) => {
      const count = await frame
        .getByText("LAN acceptance response.", { exact: true })
        .count();
      await frame.locator('[contenteditable="true"]').last().fill(text);
      await frame.getByRole("button", { name: "Send", exact: true }).click();
      await frame
        .getByText("LAN acceptance response.", { exact: true })
        .nth(count)
        .waitFor();
      await frame.getByRole("button", { name: "Send", exact: true }).waitFor();
    };
    await send("protocol-first-kept");
    const source = await waitRoute();
    assert(source);
    await send("protocol-second-excluded");
    const sourceRead = await native("thread/read", { threadId: source });
    assert.equal(
      sourceRead.thread.historyMode,
      "paginated",
      "offline development profile must create paginated history",
    );
    await frame
      .getByRole("button", { name: "More actions", exact: true })
      .first()
      .click();
    await frame
      .getByRole("menuitem", { name: /Branch in new chat|Fork chat from here/ })
      .click();
    const fork = await waitRoute(source);
    assert.notEqual(fork, source);
    const list = (threadId) =>
      native("thread/turns/list", {
        threadId,
        limit: 100,
        sortDirection: "asc",
        itemsView: "full",
      });
    const forkTurns = await list(fork),
      sourceTurns = await list(source);
    assert.equal(forkTurns.data.length, 1, "fork excludes later turns");
    assert.equal(sourceTurns.data.length, 2, "source remains intact");
    assert.doesNotMatch(
      await frame.locator("body").innerText(),
      /unknown variant|setup was not completed|设置未能完成/,
    );
    await send("protocol-fork-followup");
    const body = JSON.stringify(requests.at(-1));
    assert(body.includes("protocol-first-kept"));
    assert(
      !body.includes("protocol-second-excluded"),
      "excluded history must not reach the model",
    );
    await frame
      .getByRole("button", { name: "Edit message", exact: true })
      .last()
      .click();
    const edit = frame.locator(
      '[contenteditable="true"][aria-label="Edit message"]',
    );
    await edit.fill("protocol-edited-followup");
    await frame
      .getByRole("button", { name: /^(Save|Send|Save & send|Save and send)$/ })
      .first()
      .click();
    await frame.waitForFunction(
      () =>
        document.body.innerText.includes("protocol-edited-followup") &&
        !document.querySelector(
          '[contenteditable="true"][aria-label="Edit message"]',
        ),
    );
    await frame.getByRole("button", { name: "Send", exact: true }).waitFor();
    const edited = await list(fork);
    assert.equal(
      edited.data.length,
      2,
      "edit replaces the turn rather than appending it",
    );
    assert(JSON.stringify(edited).includes("protocol-edited-followup"));
    assert(!JSON.stringify(edited).includes("protocol-fork-followup"));
    assert.equal((await list(source)).data.length, 2);
    await page.screenshot({ path: "reports/protocol-fork-edit.png" });
    const legacy = (
      await native("thread/start", {
        historyMode: "legacy",
        approvalPolicy: "never",
        sandbox: "read-only",
      })
    ).thread.id;
    for (const text of ["legacy-first-kept", "legacy-second-editable"]) {
      const started = await native("turn/start", {
        threadId: legacy,
        input: [{ type: "text", text }],
      });
      for (let attempt = 0; ; attempt++) {
        const info = await native("thread/read", {
          threadId: legacy,
          includeTurns: true,
        });
        if (
          info.thread.turns.some(
            (t) => t.id === started.turn.id && t.status === "completed",
          )
        )
          break;
        if (attempt > 300) throw Error("Legacy fixture did not complete");
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
    await page.goto(address);
    await page
      .frameLocator("#view")
      .getByText("legacy-first-kept", { exact: true })
      .click();
    await page
      .frameLocator("#view")
      .getByText("legacy-second-editable", { exact: true })
      .waitFor();
    frame = page.frames().find((f) => f.url().includes("/frame/"));
    await frame
      .getByRole("button", { name: "Edit message", exact: true })
      .last()
      .click();
    // Lexical mounts the editor before it hydrates the original message. Filling
    // before hydration can append the replacement to the late initial value.
    await frame.waitForFunction(() =>
      document.querySelector('[contenteditable="true"][aria-label="Edit message"]')?.innerText === "legacy-second-editable",
    );
    await frame
      .locator('[contenteditable="true"][aria-label="Edit message"]')
      .fill("legacy-second-edited");
    assert.equal(await frame.locator('[contenteditable="true"][aria-label="Edit message"]').innerText(), "legacy-second-edited");
    await frame
      .getByRole("button", { name: "Send", exact: true })
      .first()
      .click();
    await frame.getByText("legacy-second-edited", { exact: true }).waitFor();
    await frame.waitForFunction(
      () =>
        !document.querySelector(
          '[contenteditable="true"][aria-label="Edit message"]',
        ),
    );
    await frame.getByRole("button", { name: "Send", exact: true }).waitFor();
    assert.equal(
      (await native("thread/read", { threadId: legacy })).thread.historyMode,
      "paginated",
    );
    let upgraded;
    for (let attempt = 0; ; attempt++) {
      upgraded = await list(legacy);
      if (
        upgraded.data.length === 2 &&
        upgraded.data.at(-1).status === "completed"
      )
        break;
      if (attempt > 300)
        throw Error(
          "Legacy edit did not finish and persist its replacement turn",
        );
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    assert.equal(upgraded.data.length, 2);
    assert(JSON.stringify(upgraded).includes("legacy-first-kept"));
    assert(JSON.stringify(upgraded).includes("legacy-second-edited"));
    assert(!JSON.stringify(upgraded).includes("legacy-second-editable"));
    await page.screenshot({ path: "reports/protocol-legacy-edit.png" });
    await fs.writeFile(
      "reports/protocol-acceptance.json",
      JSON.stringify({
        passed: true,
        source,
        fork,
        historyMode: sourceRead.thread.historyMode,
        sourceTurns: 2,
        forkTurns: 1,
        editedTurns: 2,
        legacyMigratedAndEdited: true,
      }),
    );
    console.log(
      "PROTOCOL FORK BOUNDARY, ORIGINAL HISTORY, FOLLOWUP CONTEXT AND EDIT PASSED",
    );
  } catch (error) {
    console.log(
      "PROTOCOL FAILURE",
      await page
        .frameLocator("#view")
        .locator("body")
        .innerText()
        .catch(() => "frame unavailable"),
    );
    await page.screenshot({ path: "reports/protocol-failed.png" });
    throw error;
  } finally {
    await page.close();
  }
}
