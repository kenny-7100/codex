import fs from 'node:fs/promises';
import path from 'node:path';
import { ast, walk, write, writeJSON } from './common.mjs';

// Transform authored presentation strings, never rendered DOM/user text, message IDs,
// request fields, imports, storage keys or prompts. Locale keys remain unchanged.
const displayProperties = new Set(['defaultMessage', 'label', 'title', 'placeholder', 'aria-label', 'alt', 'children', 'tooltip', 'descriptionText', 'displayName']);
const propertyName = node => node?.key?.name ?? node?.key?.value;
const literalValue = node => node?.type === 'TemplateLiteral' && node.expressions.length === 0 ? node.quasis[0].value.cooked : node?.value;
export const brandText = text => text.replace(/\bCodex\b/g, 'Jimao');
export function brandJavaScript(code, { locale = false, iconData = null, displayLiterals = [] } = {}) {
  if (!code.includes('Codex') && !code.includes('appName') && !(iconData && code.includes('M11.6475 18.3409'))) return { code, edits: [] };
  const edits = [];
  function visit(node, display = false, parent = null) {
    if (!node || typeof node !== 'object') return;
    if (iconData && node.type === 'CallExpression' && literalValue(node.arguments?.[0]) === 'path' &&
        node.arguments[1]?.type === 'ObjectExpression' && node.arguments[1].properties.some(p =>
          propertyName(p) === 'd' && (p.value?.value ?? p.value?.quasis?.[0]?.value?.raw ?? '').startsWith('M11.6475 18.3409'))) {
      edits.push({ start: node.arguments[0].start, end: node.arguments[1].end,
        before: 'OpenAI blossom brand glyph',
        replacement: JSON.stringify('image') + ', { href: ' + JSON.stringify(iconData) + ', width: 21, height: 21 }' });
      return;
    }
    if (node.type === 'StringLiteral' || (node.type === 'TemplateLiteral' && node.expressions.length === 0)) {
      const value = node.type === 'StringLiteral' ? node.value : node.quasis[0].value.cooked;
      if (displayLiterals.includes(value)) {
        edits.push({ start: node.start, end: node.end, before: value, replacement: JSON.stringify(brandText(value)) });
        return;
      }
    }
    if (node.type === 'ObjectProperty' && propertyName(node) === 'values' &&
        parent?.type === 'ObjectExpression' && parent.properties.some(p => propertyName(p) === 'defaultMessage') &&
        node.value.type === 'ObjectExpression') {
      for (const prop of node.value.properties) {
        if (propertyName(prop) === 'appName' && prop.type === 'ObjectProperty' && !prop.shorthand) {
          const original = code.slice(prop.value.start, prop.value.end);
          edits.push({ start: prop.value.start, end: prop.value.end, before: 'Display appName interpolation',
            replacement: '((brand) => brand === "Codex" ? "Jimao" : brand)(' + original + ')' });
        } else visit(prop, false, node.value);
      }
      return;
    }
    if (node.type === 'ObjectProperty') {
      // Locales are dictionaries keyed by the original message identifiers.
      visit(node.value, displayProperties.has(propertyName(node)) || (locale && node.key.type === 'StringLiteral'), node);
      return;
    }
    if (display && (node.type === 'StringLiteral' || node.type === 'TemplateElement')) {
      const value = node.type === 'StringLiteral' ? node.value : node.value.raw;
      const branded = brandText(value);
      if (value !== branded) edits.push({ start: node.start, end: node.end, before: value,
        replacement: node.type === 'StringLiteral' ? JSON.stringify(branded) : branded });
      return;
    }
    for (const [key, value] of Object.entries(node)) {
      if (['loc', 'extra', 'comments'].includes(key)) continue;
      if (Array.isArray(value)) value.forEach(child => visit(child, display, node));
      else if (value && typeof value === 'object') visit(value, display, node);
    }
  }
  visit(ast(code));
  for (const edit of [...edits].sort((a, b) => b.start - a.start)) code = code.slice(0, edit.start) + edit.replacement + code.slice(edit.end);
  return { code, edits };
}

export function brandStartupHTML(html, iconData) {
  return html.replace('<title>ChatGPT</title>', '<title>Jimao</title>')
    .replace('<div class="startup-loader__logo"></div>', `<img class="startup-loader__logo" src="${iconData}" alt="Jimao" />`)
    .replace('</style>', `
.startup-loader__logo { clip-path: none; background: none; object-fit: contain;
  border-radius: 50%; transform-origin: 50% 75%;
  animation: jimao-avatar-wiggle 1.8s ease-in-out infinite; }
.startup-loader__logo:after { display: none; }
@keyframes jimao-avatar-wiggle {
  0%, 55%, 100% { transform: translateY(0) rotate(0); }
  10% { transform: translateY(-3px) rotate(-7deg); }
  20% { transform: translateY(-5px) rotate(7deg); }
  30% { transform: translateY(-2px) rotate(-5deg); }
  40% { transform: translateY(-1px) rotate(3deg); }
}
@media (prefers-reduced-motion: reduce) {
  .startup-loader__logo { animation: none; transform: none; }
}
</style>`);
}

export async function applyBranding(root, target) {
  const report = [];
  const iconData = 'data:image/svg+xml;base64,' + (await fs.readFile(path.join(root, 'overrides/resources/jimao.svg'))).toString('base64');
  const changes = [];
  const localePattern = /^[a-z]{2,3}(?:-(?:[A-Z][A-Za-z0-9]+|[0-9]{3}))*-[a-f0-9]+\.js$/;
  for (const file of await walk(path.join(target, 'webview/assets'))) {
    if (!file.endsWith('.js')) continue;
    const source = await fs.readFile(file, 'utf8');
    const displayLiterals = {
      'subagent-activity-chip-group-80b92568b5fa.js': ['Codex'],
      'app-initial-17dd08407f00.js': ['Codex performance', 'Codex Desktop', 'Codex Browser'],
      'app-initial-f8f84852daaa.js': ['Codex Chat'],
    }[path.basename(file)] ?? [];
    const result = brandJavaScript(source, { locale: localePattern.test(path.basename(file)), iconData, displayLiterals });
    if (source === result.code) continue;
    await write(file, result.code);
    const relative = path.relative(target, file);
    changes.push(relative);
    report.push({ file: relative, strings: result.edits.map(edit => edit.before) });
  }
  const htmlFile = path.join(target, 'webview/index.html');
  const html = brandStartupHTML(await fs.readFile(htmlFile, 'utf8'), iconData);
  await write(htmlFile, html);
  changes.push('webview/index.html');
  const readmeFile = path.join(target, 'readme.md');
  const readme = await fs.readFile(readmeFile, 'utf8');
  await write(readmeFile, '# Jimao\n\nPersonal customization of the OpenAI Codex extension. Extension identity and user data storage are retained.\n\n' + brandText(readme));
  changes.push('readme.md');
  await writeJSON(path.join(root, 'reports/branding.json'), { brand: 'Jimao', files: report });
  return changes;
}
