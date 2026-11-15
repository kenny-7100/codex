import fs from 'node:fs/promises';
import path from 'node:path';
import { write } from './common.mjs';

// Use the SDK's own timeout: cached/default values remain authoritative while
// the data adapter finishes fetching in the background. Authentication and host startup still wait.
export function boundFeatureInitialization(code) {
  const before = /\.initializeAsync\(\)\s*\.catch\(t\.Log\.error\)/g;
  const after = '.initializeAsync({ timeoutMs: 1200 }).catch(t.Log.error)';
  if ([...code.matchAll(before)].length !== 1) throw new Error('Statsig startup hook changed; review before building');
  return code.replace(before, after);
}

export async function applyStartup(target) {
  const relative = 'webview/assets/app-initial-ef83d79c5fa7.js';
  const file = path.join(target, relative);
  await write(file, boundFeatureInitialization(await fs.readFile(file, 'utf8')));
  return [relative];
}
