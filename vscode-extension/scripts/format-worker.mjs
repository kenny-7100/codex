import { parentPort } from 'node:worker_threads';
import fs from 'node:fs/promises';
import path from 'node:path';
import prettier from 'prettier';
import { init, parse as imports } from 'es-module-lexer';
import { astHash, hash, write } from './common.mjs';

await init;
parentPort.on('message', async job => {
  try {
    const raw = await fs.readFile(job.input, 'utf8');
    const parser = job.kind === 'css' ? 'css' : job.kind === 'html' ? 'html' : 'babel';
    const code = await prettier.format(raw, { parser, printWidth: 100, endOfLine: 'lf' });
    let syntaxHash;
    let dependencies = [];
    if (job.kind === 'js') {
      syntaxHash = astHash(raw);
      if (syntaxHash !== astHash(code)) throw new Error('Formatting changed the normalized AST');
      dependencies = imports(raw)[0].map(x => ({ specifier: x.n ?? null, dynamic: x.d >= 0 }));
    }
    await write(job.output, code);
    parentPort.postMessage({ ok: true, relative: job.relative, sourceHash: hash(code), rawHash: hash(raw), astHash: syntaxHash, dependencies, bytes: Buffer.byteLength(code) });
  } catch (error) {
    parentPort.postMessage({ ok: false, relative: job.relative, error: String(error.stack ?? error) });
  }
});
