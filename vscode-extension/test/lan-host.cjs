const fs = require("node:fs");
const path = require("node:path");
const vscode = require("vscode");
exports.run = async () => {
  const root = process.env.JIMAO_LAN_ACCEPTANCE;
  try {
    const ext = vscode.extensions.getExtension("openai.chatgpt");
    await ext.activate();
    const result = await vscode.commands.executeCommand(
      "chatgpt.startLanAccess",
    );
    fs.writeFileSync(path.join(root, "ready.json"), JSON.stringify(result));
    while (!fs.existsSync(path.join(root, "finish")))
      await new Promise((r) => setTimeout(r, 200));
    await vscode.commands.executeCommand("chatgpt.stopLanAccess");
  } catch (e) {
    fs.writeFileSync(path.join(root, "error.txt"), String(e.stack));
    throw e;
  }
};
