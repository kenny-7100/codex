import fs, { constants } from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { astHash, hash, json, reference, root, walk, write, writeJSON } from './common.mjs';
import { hostSourceMap } from './source-map.mjs';
import { installCustomEngine } from './custom-engine.mjs';
import { applyBranding } from './branding.mjs';
import { applyStartup } from './startup.mjs';
import { applyProtocolCompatibility } from './protocol-compat.mjs';

const manifest = await json(path.join(root, 'recovery-manifest.json'));
if (manifest.failures.length) throw new Error('Recovery contains failures. Repair them before building.');
const readable = process.argv.includes('--readable');
const debug = process.argv.includes('--debug');
const target = path.join(root, 'build/extension');
await fs.mkdir(path.dirname(target), { recursive: true });
await fs.copyFile(path.join(root, 'src/vsixmanifest.xml'), path.join(root, 'build/extension.vsixmanifest'));
await fs.copyFile(path.join(root, 'src/content-types.xml'), path.join(root, 'build/[Content_Types].xml'));
await fs.rm(target, { recursive: true, force: true });
// Clone-on-write where supported; never hardlink files to immutable references.
await fs.cp(path.join(reference, 'extension'), target, { recursive: true, mode: constants.COPYFILE_FICLONE });
// Python's historical reference extraction omitted executable mode bits. Repair
// only the writable build copy; ZIP metadata in the original remains intact.
execFileSync('python3', [path.join(root, 'scripts/reference.py'), '--modes', target], { stdio: 'inherit' });
const changes = [];
const hostFragments = await Promise.all(manifest.host.map(h => fs.readFile(path.join(root, h.path), 'utf8')));
const hostSource = hostFragments.join('\n');
const hostEqual = astHash(hostSource, 'script') === manifest.hostAstHash;
if (!hostEqual || readable || debug) await write(path.join(target, 'out/extension.js'), hostSource + (debug ? '\n//# sourceMappingURL=extension.js.map\n' : ''));
if (debug) await writeJSON(path.join(target, 'out/extension.js.map'), hostSourceMap(hostFragments, manifest.host.map(h => path.join(root, h.path)), path.join(target, 'out/extension.js')));
if (!hostEqual) changes.push('out/extension.js');
let extensionManifest = await fs.readFile(path.join(root, 'src/manifest.json'));
const customEngine = await installCustomEngine(root, target);
if (customEngine) {
  extensionManifest = Buffer.from(JSON.stringify({ ...JSON.parse(extensionManifest), codexxEngine: customEngine }, null, 2) + '\n');
  changes.push('bin/macos-aarch64/codex');
}
await write(path.join(target, 'package.json'), extensionManifest);
if (hash(extensionManifest) !== manifest.manifestRawHash) changes.push('package.json');
let checked = 0;
for (const record of manifest.webview) {
  const sourcePath = path.join(root, record.relative);
  const patchPath = path.join(root, 'overrides', record.relative.slice(4));
  let code;
  let patch;
  try { patch = await fs.readFile(patchPath); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  try { code = await fs.readFile(sourcePath); } catch (e) {
    if (e.code !== 'ENOENT') throw e;
    if (!patch) throw new Error(`Missing recovered source ${record.relative}. Run npm run recover -- --refresh.`);
    code = patch;
  }
  // A saved override wins over an untouched regenerated source. Direct source edits win otherwise.
  if (patch && hash(code) === record.sourceHash) code = patch;
  else if (patch && hash(patch) !== hash(code)) {
    throw new Error(`Conflicting edits in ${record.relative} and ${path.relative(root, patchPath)}. Reconcile them before building.`);
  }
  const sourceChanged = hash(code) !== record.sourceHash;
  if (record.astHash && sourceChanged) astHash(code.toString('utf8'));
  const relative = record.relative.slice(4);
  if (readable || sourceChanged) await write(path.join(target, relative), code);
  if (sourceChanged) {
    changes.push(relative);
    // Preserve edits to the large generated tree in the Git-tracked override tree.
    await write(patchPath, code);
  }
  if (++checked % 1000 === 0) console.log(`Checked ${checked}/${manifest.webview.length} recovered files`);
}
// Additional assets/modules are supported. Existing generated overrides were handled above.
const known = new Set(manifest.webview.map(r => r.relative.slice(4)));
try {
  for (const p of await walk(path.join(root, 'overrides'))) {
    const rel = path.relative(path.join(root, 'overrides'), p);
    if (!known.has(rel)) {
      await write(path.join(target, rel), await fs.readFile(p));
      changes.push(rel);
    }
  }
} catch (e) { if (e.code !== 'ENOENT') throw e; }
changes.push(...await applyStartup(target));
changes.push(...await applyProtocolCompatibility(target, customEngine));
changes.push(...await applyBranding(root, target));
await writeJSON(path.join(root, 'reports/build.json'), { mode: debug ? 'debug' : readable ? 'readable' : 'exact-if-unchanged', hostAstEqual: hostEqual, sourceFilesChecked: checked, customEngine, changedFiles: changes });
console.log(`Built ${target}; ${changes.length} authored payload changes; host AST baseline equal: ${hostEqual}.`);
