import fs from 'node:fs/promises';
import path from 'node:path';
import { Worker } from 'node:worker_threads';
import prettier from 'prettier';
import { ast, astHash, hash, json, reference, root, walk, write, writeJSON } from './common.mjs';

const manifestPath = path.join(root, 'recovery-manifest.json');
const refresh = process.argv.includes('--refresh');
try {
  await fs.access(manifestPath);
  if (!refresh) throw new Error('Recovery already exists. Use npm run recover -- --refresh only to restore missing generated Webview sources; existing authored sources are protected.');
} catch (e) { if (e.code !== 'ENOENT') throw e; }
const existing = refresh ? await json(manifestPath) : null;
const hostPath = path.join(reference, 'extension/out/extension.js');
const raw = await fs.readFile(hostPath, 'utf8');
const tree = ast(raw, 'script');
const entries = [];
let offset = 0, group = [], groupSize = 0;
for (const node of tree.program.body) {
  group.push(node); groupSize += node.end - offset; offset = node.end;
  // Keep top-level statements intact and in original order. Fragments share scope.
  if (groupSize >= 40000) { entries.push(group); group = []; groupSize = 0; }
}
if (group.length) entries.push(group);
let previous = 0;
const host = [];
const symbols = [];
for (let i = 0; i < entries.length; i++) {
  const nodes = entries[i];
  const end = i === entries.length - 1 ? raw.length : nodes.at(-1).end;
  const section = raw.slice(previous, end); previous = end;
  const names = nodes.flatMap(n => n.type === 'FunctionDeclaration' || n.type === 'ClassDeclaration' ? [n.id?.name] : n.type === 'VariableDeclaration' ? n.declarations.map(d => d.id.name) : []).filter(Boolean);
  const topic = section.includes('function IZt(') ? 'activation' : section.includes('module.exports=X8e') ? 'extension-entry' : section.includes('onDidReceiveMessage') ? 'webview-messaging' : section.includes('registerChatSession') ? 'chat-sessions' : section.includes('spawn(') || section.includes('.spawn(') ? 'processes' : section.includes('require("vscode")') ? 'editor-integration' : section.includes('thread/start') ? 'agent-protocol' : 'shared-runtime';
  const relative = `src/extension-host/${String(i).padStart(3, '0')}-${topic}.js`;
  const code = await prettier.format(section, { parser: 'babel', printWidth: 100 });
  // Do not overwrite an existing editable host tree.
  if (!existing) await write(path.join(root, relative), code);
  host.push({ path: relative, sourceHash: hash(code), originalStart: nodes[0].start, originalEnd: end, bindings: names });
  for (const node of nodes) {
    const snippets = [];
    function visit(value) {
      if (!value || typeof value !== 'object') return;
      if (value.type === 'StringLiteral' && value.value.length > 3 && value.value.length < 180) snippets.push(value.value);
      for (const [key, child] of Object.entries(value)) {
        if (['loc', 'extra', 'comments', 'leadingComments', 'trailingComments'].includes(key)) continue;
        if (Array.isArray(child)) child.forEach(visit); else if (child && typeof child === 'object') visit(child);
      }
    }
    visit(node);
    const nodeNames = node.type === 'FunctionDeclaration' ? [node.id.name] : node.type === 'VariableDeclaration' ? node.declarations.map(d => d.id.name).filter(Boolean) : [];
    for (const name of nodeNames) symbols.push({ name, file: relative, type: node.type, clues: [...new Set(snippets)].slice(0, 30) });
  }
}
const combined = (await Promise.all(host.map(h => fs.readFile(path.join(root, h.path), 'utf8')))).join('\n');
const hostSyntaxHash = astHash(raw, 'script');
if (!existing && hostSyntaxHash !== astHash(combined, 'script')) throw new Error('Host fragment reconstruction changed AST');
await writeJSON(path.join(root, 'docs/host-symbols.json'), symbols);
if (!existing) await write(path.join(root, 'src/manifest.json'), await fs.readFile(path.join(reference, 'extension/package.json')));
if (!existing) {
  await write(path.join(root, 'src/vsixmanifest.xml'), await fs.readFile(path.join(reference, 'extension.vsixmanifest')));
  await write(path.join(root, 'src/content-types.xml'), await fs.readFile(path.join(reference, '[Content_Types].xml')));
}

const all = await walk(path.join(reference, 'extension/webview'));
let jobs = all.filter(p => /\.(js|css|html)$/.test(p)).map(input => {
  const relative = 'src/' + path.relative(path.join(reference, 'extension'), input).split(path.sep).join('/');
  return { input, output: path.join(root, relative), relative, kind: path.extname(input).slice(1) };
});
// Refresh materializes missing generated files only. Never discard local edits.
if (existing) {
  const missing = [];
  for (const job of jobs) {
    try { await fs.access(job.output); }
    catch (e) { if (e.code !== 'ENOENT') throw e; missing.push(job); }
  }
  jobs = missing;
}
let cursor = 0, done = 0;
let webview = [];
const failures = [];
const workers = Math.min(3, Number(process.env.RECOVERY_WORKERS || 3));
console.log(`Recovering ${jobs.length} Webview files using ${workers} workers; host: ${host.length} fragments.`);
await Promise.all(Array.from({ length: workers }, () => new Promise((resolve, reject) => {
  const worker = new Worker(new URL('./format-worker.mjs', import.meta.url));
  const next = () => {
    if (cursor === jobs.length) { worker.terminate().then(resolve); return; }
    worker.postMessage(jobs[cursor++]);
  };
  worker.on('error', reject);
  worker.on('message', message => {
    done++;
    if (message.ok) { const { ok, ...record } = message; webview.push(record); }
    else { failures.push(message); console.error('FAILED', message.relative, message.error.slice(0, 250)); }
    if (done % 250 === 0) console.log(`${done}/${jobs.length} files recovered`);
    next();
  });
  next();
})));
if (existing) {
  const records = new Map(existing.webview.map(r => [r.relative, r]));
  for (const record of webview) records.set(record.relative, record);
  webview = [...records.values()];
}
webview.sort((a, b) => a.relative.localeCompare(b.relative));
const manifest = { schemaVersion: 1, version: '26.51111.21308', host: existing?.host ?? host, hostRawHash: hash(raw), hostAstHash: hostSyntaxHash, manifestRawHash: hash(await fs.readFile(path.join(reference, 'extension/package.json'))), webview, failures };
if (existing && failures.length) throw new Error('Refresh failed; original recovery manifest retained.');
await writeJSON(manifestPath, manifest);
await writeJSON(path.join(root, 'reports/recovery.json'), { hostFragments: host.length, webviewFiles: webview.length, formattedBytes: webview.reduce((s, f) => s + f.bytes, 0), failures });
if (failures.length) process.exitCode = 1;
else console.log('Recovery complete. All recovered JavaScript passed normalized AST equality.');
