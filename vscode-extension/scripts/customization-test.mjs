import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { hash, json, root, write, writeJSON } from './common.mjs';

const manifest = await json(path.join(root, 'recovery-manifest.json'));
const host = path.join(root, manifest.host.at(-1).path);
const asset = 'webview/assets/rolldown-runtime-428824ca0286.js';
const browser = path.join(root, 'src', asset);
const override = path.join(root, 'overrides', asset);
const originalHost = await fs.readFile(host);
const originalBrowser = await fs.readFile(browser);
assert.equal(hash(originalHost), manifest.host.at(-1).sourceHash, 'Customization test requires an unmodified final host fragment');
assert.equal(hash(originalBrowser), manifest.webview.find(f => f.relative === `src/${asset}`).sourceHash, 'Customization test requires unmodified runtime source');
try { await fs.access(override); throw new Error('Customization test would overwrite an existing override'); }
catch (e) { if (e.code !== 'ENOENT') throw e; }
const run = (command, args) => execFileSync(command, args, { cwd: root, stdio: 'inherit' });
let report;
try {
  await write(host, Buffer.concat([originalHost, Buffer.from('\nglobalThis.__codexCustomizationTest = "from-source";\n')]));
  await write(browser, Buffer.concat([originalBrowser, Buffer.from('\nexport const __codexCustomizationTest = "from-source";\n')]));
  run(process.execPath, ['scripts/build.mjs']);
  assert.equal(await fs.readFile(override, 'utf8'), await fs.readFile(browser, 'utf8'), 'Webview source edit must be saved into tracked overrides');
  run('python3', ['scripts/archive.py', 'pack']);
  run('python3', ['scripts/archive.py', 'verify', '--allow-changes']);
  report = await json(path.join(root, 'reports/verify.json'));
  assert.deepEqual([...report.payloadDifferences].sort(), [`extension/${asset}`, 'extension/out/extension.js'].sort());
  assert.ok(report.crcValid);
  assert.ok(!report.byteIdentical);
  assert.match(await fs.readFile(path.join(root, 'build/extension/out/extension.js'), 'utf8'), /__codexCustomizationTest/);
  await writeJSON(path.join(root, 'reports/customization.json'), { passed: true, changedEntries: report.payloadDifferences, sourceEditSavedToOverride: true, crcValid: true });
} finally {
  await write(host, originalHost);
  await write(browser, originalBrowser);
  await fs.rm(override, { force: true });
  run(process.execPath, ['scripts/build.mjs']);
  run('python3', ['scripts/archive.py', 'pack']);
  run('python3', ['scripts/archive.py', 'verify']);
}
