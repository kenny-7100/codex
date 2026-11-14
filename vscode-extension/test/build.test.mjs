import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import test from 'node:test';
import { astHash, json, reference, root } from '../scripts/common.mjs';
import { hostSourceMap } from '../scripts/source-map.mjs';

test('AST comparison accepts harmless formatting, rejects behavior changes', () => {
  assert.equal(astHash('const x=a && (b && c);'), astHash('const x=(a&&b)&&c;'));
  assert.notEqual(astHash('const x=a && b;'), astHash('const x=a || b;'));
  assert.notEqual(astHash('const x=(a+b)+c;'), astHash('const x=a+(b+c);'));
  assert.notEqual(astHash('const x=1;'), astHash('const x=2;'));
});

test('debug source map retains fragment sources and their contents', async () => {
  const map = hostSourceMap(['const a = 1;\n', 'const b = 2;\n'], ['/project/src/a.js', '/project/src/b.js'], '/project/build/extension/out/extension.js');
  assert.deepEqual(map.sources, ['../../../src/a.js', '../../../src/b.js']);
  assert.deepEqual(map.sourcesContent, ['const a = 1;\n', 'const b = 2;\n']);
  assert.ok(map.mappings);
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'codex-extension-map-'));
  try {
    const output = path.join(temporary, 'out.js');
    const fragments = ['const x = 1;\n', 'throw new Error("source-map-probe");\n'];
    const map = hostSourceMap(fragments, [path.join(temporary, 'a.js'), path.join(temporary, 'b.js')], output);
    await fs.writeFile(output, fragments.join('\n') + '\n//# sourceMappingURL=out.js.map\n');
    await fs.writeFile(`${output}.map`, JSON.stringify(map));
    const result = spawnSync(process.execPath, ['--enable-source-maps', output], { encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /b\.js:1/);
  } finally { await fs.rm(temporary, { recursive: true, force: true }); }
});

test('recovered host fragments retain original program AST and exports', async () => {
  const manifest = await json(path.join(root, 'recovery-manifest.json'));
  const fragments = await Promise.all(manifest.host.map(h => fs.readFile(path.join(root, h.path), 'utf8')));
  const original = await fs.readFile(path.join(reference, 'extension/out/extension.js'), 'utf8');
  assert.equal(astHash(fragments.join('\n'), 'script'), astHash(original, 'script'));
});

test('raw ZIP packaging supports baseline, edits, additions, and rejects missing payloads', () => {
  const run = spawnSync('python3', ['test/archive_test.py'], { cwd: root, encoding: 'utf8' });
  assert.equal(run.status, 0, run.stdout + run.stderr);
});
