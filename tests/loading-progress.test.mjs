import test from 'node:test';
import assert from 'node:assert/strict';
import { LoadingProgress } from '../src/loading-progress.ts';

test('loading sections count actual completions once and restart independently', () => {
  const loading = new LoadingProgress();
  assert.equal(loading.initial().completed, 0);
  for (const [i, phase] of ['engine','world','trees','karts','items','ready'].entries()) {
    assert.equal(loading.complete(phase).completed, i + 1);
    assert.equal(loading.complete(phase).completed, i + 1);
  }
  assert.equal(loading.complete('ready').total, 6);
  assert.equal(new LoadingProgress().initial().completed, 0);
});
test('lab loading never waits for nonexistent imported art assets', () => {
  const loading = new LoadingProgress(false);
  assert.equal(loading.complete('engine').total, 2);
  assert.equal(loading.complete('ready').completed, 2);
  assert.throws(() => loading.complete('world'), /Unexpected loading phase/);
});
