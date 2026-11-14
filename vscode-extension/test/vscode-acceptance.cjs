const vscode = require("vscode");
const fs = require("node:fs");
const path = require("node:path");
exports.run = async () => {
  const extension = vscode.extensions.getExtension("openai.chatgpt");
  if (!extension) throw Error("Development extension not discovered");
  await extension.activate();
  await vscode.commands.executeCommand("chatgpt.openSidebar");
  const dir = path.resolve(__dirname, "../reports");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, "vscode-acceptance-ready.json"),
    JSON.stringify({ activated: extension.isActive }),
  );
  const finished = path.join(dir, "vscode-acceptance-finished.json");
  const deadline = Date.now() + 600000;
  while (Date.now() < deadline) {
    if (fs.existsSync(finished)) return;
    await new Promise((r) => setTimeout(r, 500));
  }
  throw Error("Acceptance controller did not finish");
};
