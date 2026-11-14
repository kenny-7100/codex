import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { json, root, write } from './common.mjs';

const probe = process.argv.includes('--probe');
const manifest = await json(path.join(root, 'recovery-manifest.json'));
const last = path.join(root, manifest.host.at(-1).path);
const original = await fs.readFile(last);
const run = (command, args, env = process.env) => new Promise((resolve, reject) => {
  const child = spawn(command, args, { cwd: root, env, stdio: 'inherit' });
  child.on('error', reject);
  child.on('exit', code => code === 0 ? resolve() : reject(new Error(`${command} exited ${code}`)));
});
const profile = path.join(root, '.cache/vscode-smoke');
await write(path.join(profile, 'user-data/User/settings.json'), JSON.stringify({
  'telemetry.telemetryLevel': 'off', 'update.mode': 'none', 'extensions.autoUpdate': false,
  'workbench.startupEditor': 'none', 'security.workspace.trust.enabled': false,
}));
try {
  if (probe) await write(last, Buffer.concat([original, Buffer.from('\nglobalThis.__codexReconstructionProbe = "source-edit-executed";\n')]));
  await run(process.execPath, ['--max-old-space-size=8192', 'scripts/build.mjs']);
  const reportPath = path.join(root, 'reports/vscode-smoke.json');
  await fs.rm(reportPath, { force: true });
  await run('code', [
    '--new-window', '--skip-welcome', '--skip-release-notes', '--disable-extensions',
    '--user-data-dir', path.join(profile, 'user-data'),
    '--extensions-dir', path.join(profile, 'extensions'),
    '--extensionDevelopmentPath', path.join(root, 'build/extension'),
    '--extensionTestsPath', path.join(root, 'test/vscode-smoke.cjs'),
    '--enable-proposed-api', 'openai.chatgpt',
  ], { ...process.env, ...(probe ? { CODEX_RECONSTRUCTION_EXPECT_PROBE: '1' } : {}) });
  // Some code CLI versions return before tests finish; require the runner's report.
  let report;
  const deadline = Date.now() + 90000;
  while (Date.now() < deadline) {
    try { report = await json(reportPath); break; }
    catch (e) { if (e.code !== 'ENOENT') throw e; }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  if (!report) throw new Error('VS Code did not produce a smoke report within 90 seconds.');
  if (report.error) throw new Error(report.error);
  console.log(JSON.stringify(report, null, 2));
} finally {
  if (probe) {
    await write(last, original);
    await run(process.execPath, ['--max-old-space-size=8192', 'scripts/build.mjs']);
  }
}
