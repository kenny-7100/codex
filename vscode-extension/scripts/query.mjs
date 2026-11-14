import path from 'node:path';
import { json, root } from './common.mjs';

const [kind, needle = ''] = process.argv.slice(2);
if (!['host', 'webview', 'importers'].includes(kind) || !needle) {
  console.error('Usage: node scripts/query.mjs host|webview|importers <symbol, clue, or filename>');
  process.exit(1);
}
if (kind === 'host') {
  const symbols = await json(path.join(root, 'docs/host-symbols.json'));
  console.log(JSON.stringify(symbols.filter(s => JSON.stringify(s).toLowerCase().includes(needle.toLowerCase())), null, 2));
} else {
  const manifest = await json(path.join(root, 'recovery-manifest.json'));
  const matches = manifest.webview.filter(s => kind === 'webview' ? s.relative.toLowerCase().includes(needle.toLowerCase()) : s.dependencies.some(d => d.specifier?.includes(needle)));
  console.log(JSON.stringify(matches.map(s => ({ path: s.relative, imports: s.dependencies })), null, 2));
}
