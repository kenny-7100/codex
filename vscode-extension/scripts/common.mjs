import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '@babel/parser';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const reference = path.resolve(root, '../references/vscode-extension/openai.chatgpt-26.51111.21308-darwin-arm64');
export const vsix = `${reference}.vsix`;
export const hash = value => createHash('sha256').update(value).digest('hex');
export const json = async p => JSON.parse(await fs.readFile(p, 'utf8'));
export async function write(p, data) {
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, data);
}
export const writeJSON = (p, data) => write(p, JSON.stringify(data, null, 2) + '\n');
export function ast(code, sourceType = 'unambiguous') {
  return parse(code, { sourceType, allowReturnOutsideFunction: true, createImportExpressions: true });
}
const ignored = new Set(['start', 'end', 'loc', 'extra', 'comments', 'leadingComments', 'trailingComments', 'innerComments', 'errors', 'tokens']);
export function astHash(code, sourceType) {
  return hash(JSON.stringify(ast(code, sourceType).program, (key, value) => {
    if (ignored.has(key)) return undefined;
    // Prettier can regroup a chain of the SAME short-circuit operator. Flatten
    // only &&, || and ??, retaining operand order and short-circuit semantics.
    // Never flatten arithmetic: floating-point addition is not associative.
    if (value?.type === 'LogicalExpression') {
      const operands = [];
      const collect = node => {
        if (node.type === 'LogicalExpression' && node.operator === value.operator) {
          collect(node.left); collect(node.right);
        } else operands.push(node);
      };
      collect(value);
      return { type: 'NormalizedLogicalExpression', operator: value.operator, operands };
    }
    return value;
  }));
}
export async function walk(dir) {
  const result = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await walk(p));
    else if (entry.isFile()) result.push(p);
  }
  return result.sort();
}
