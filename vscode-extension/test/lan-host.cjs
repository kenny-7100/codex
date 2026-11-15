const fs = require("node:fs");
const path = require("node:path");
const vscode = require("vscode");
exports.run = async () => {
  const root = process.env.JIMAO_LAN_ACCEPTANCE;
  try {
    const ext = vscode.extensions.getExtension("openai.chatgpt");
    await ext.activate();
    let result;
    if (process.env.JIMAO_LAN_AUTO_JOIN) {
      const descriptorPath = path.join(process.env.CODEX_HOME, "jimao-lan/gateway.json");
      for (let i = 0; !result && i < 200; i++) {
        const d = JSON.parse(fs.readFileSync(descriptorPath, "utf8"));
        const windows = await fetch(`http://127.0.0.1:${d.port}/windows`).then(r => r.json());
        const own = windows.find(w => w.folders.includes(vscode.workspace.workspaceFolders[0].uri.fsPath));
        if (own) result = { windowId: own.id, urls: [`http://localhost:${d.port}`] };
        else await new Promise(r => setTimeout(r, 100));
      }
      if (!result) throw Error("Window did not automatically join");
    } else result = await vscode.commands.executeCommand("chatgpt.startLanAccess");
    fs.writeFileSync(path.join(root, "ready.json"), JSON.stringify(result));
    while (!fs.existsSync(path.join(root, "finish")))
      await new Promise((r) => setTimeout(r, 200));
    // Test host disposal must only leave this window, not disable globally.
  } catch (e) {
    fs.writeFileSync(path.join(root, "error.txt"), String(e.stack));
    throw e;
  }
};
