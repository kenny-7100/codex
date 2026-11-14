const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vscode = require('vscode');

exports.run = async function () {
  const report = { vscodeVersion: vscode.version, extensionId: 'openai.chatgpt', activated: false, commandsRegistered: [], sidebarOpened: false };
  const destination = path.resolve(__dirname, '../reports/vscode-smoke.json');
  try {
    const extension = vscode.extensions.getExtension('openai.chatgpt');
    assert.ok(extension, 'Development extension must be discovered');
    await extension.activate();
    assert.ok(extension.isActive, 'Extension must activate successfully');
    report.activated = true;
    const commands = await vscode.commands.getCommands(true);
    const expected = ['chatgpt.openSidebar', 'chatgpt.openCommandMenu', 'chatgpt.newCodexPanel', 'chatgpt.addToThread'];
    for (const command of expected) assert.ok(commands.includes(command), `Missing command ${command}`);
    report.commandsRegistered = expected;
    await vscode.commands.executeCommand('chatgpt.openSidebar');
    report.sidebarOpened = true;
    report.exports = Object.keys(extension.exports ?? {});
    if (process.env.CODEX_RECONSTRUCTION_EXPECT_PROBE) {
      assert.equal(globalThis.__codexReconstructionProbe, 'source-edit-executed');
      report.modifiedSourceExecuted = true;
    }
    // Let initial Webview/process startup diagnostics reach the isolated log directory.
    await new Promise(resolve => setTimeout(resolve, 3000));
  } catch (error) {
    report.error = String(error.stack ?? error);
    throw error;
  } finally {
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, JSON.stringify(report, null, 2) + '\n');
  }
};
