import assert from 'node:assert/strict';
import test from 'node:test';
import { brandJavaScript } from '../scripts/branding.mjs';

test('branding changes display templates while preserving protocol, prompts, paths and interpolation', () => {
  const input = 'const x = {id:"Codex.title", defaultMessage:`Open Codex for ${user}`, children:"Codex", command:"chatgpt.newCodexPanel", prompt:"You are Codex", path:"~/.codex", value:"Codex"};';
  const result = brandJavaScript(input).code;
  assert.match(result, /defaultMessage:`Open Jimao for \$\{user\}`/);
  assert.match(result, /children:"Jimao"/);
  for (const original of ['id:"Codex.title"', 'command:"chatgpt.newCodexPanel"', 'prompt:"You are Codex"', 'path:"~\/.codex"', 'value:"Codex"']) assert.ok(result.includes(original), original);
});

test('localized presentation changes values and retains original lookup keys and ICU arguments', () => {
  const input = 'const messages={"Codex.greeting":`欢迎使用 Codex，{name}`,"Codex.count":`{count, plural, one {Codex task} other {Codex tasks}}`};';
  const result = brandJavaScript(input, { locale: true }).code;
  assert.match(result, /"Codex.greeting":`欢迎使用 Jimao，\{name\}`/);
  assert.match(result, /one \{Jimao task\} other \{Jimao tasks\}/);
  assert.equal(brandJavaScript(input).code, input);
});


test('shared JSX brand glyph accepts recovered template literals and preserves component sizing', () => {
  const input = 'const icon = jsx(`svg`, {width:21, ...props, children:jsx(`path`,{d:`M11.6475 18.3409rest`,fill:`currentColor`})});';
  const result = brandJavaScript(input, { iconData: 'data:image/svg+xml;base64,test' });
  assert.equal(result.edits.length, 1);
  assert.ok(result.code.includes('jsx("image", { href: "data:image/svg+xml;base64,test", width: 21, height: 21 })'));
  assert.ok(result.code.includes('width:21, ...props'));
});


test('display appName interpolation is branded without changing shared header or auth identifiers', () => {
  const source = 'const app="Codex"; const header={"OAI-App-Brand":app}; const message={id:"login",defaultMessage:"{appName}",values:{appName:app}};';
  const result = brandJavaScript(source).code;
  const value = Function(result + ';return {header,message};')();
  assert.equal(value.header['OAI-App-Brand'], 'Codex');
  assert.equal(value.message.values.appName, 'Jimao');
  assert.equal(value.message.id, 'login');
});
