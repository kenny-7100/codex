import test from 'node:test';
import assert from 'node:assert/strict';
import { boundFeatureInitialization } from '../scripts/startup.mjs';

for (const formatted of [false, true]) {
  test(`feature initialization uses the SDK timeout without forcing a second initialization (${formatted})`, async () => {
    const source = `return i.initializeAsync()${formatted ? '\n              ' : ''}.catch(t.Log.error).finally(() => o(!1));`;
    const run = Function('i', 't', 'o', boundFeatureInitialization(source));
    for (const cached of [true, false]) {
      let refresh = 0, released = false;
      await run({ initializeAsync: async options => {
        assert.equal(options.timeoutMs, 1200);
      }, getContext: () => ({ values: cached ? {} : null }), refreshValuesAsync: async () => { refresh++; } }, { Log: { error() { assert.fail('unexpected error'); } } }, () => { released = true; });
      assert.equal(released, true);
      assert.equal(refresh, 0);
    }
  });
}
test('startup transform fails closed when the upstream hook changes', () => {
  assert.throws(() => boundFeatureInitialization('different source'), /hook changed/);
});
