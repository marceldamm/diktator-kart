import assert from 'node:assert/strict';
import test from 'node:test';
import { canalSurfaceSprayRate } from '../src/environment-effects.ts';

test('canal spray requires moving water contact and remains bounded in reduced mode', () => {
  assert.equal(canalSurfaceSprayRate(false, 14, .1, false), 0);
  assert.equal(canalSurfaceSprayRate(true, 5.99, .1, false), 0);
  assert.equal(canalSurfaceSprayRate(true, 6, .1, false), 0);
  assert.equal(canalSurfaceSprayRate(true, 14, .36, false), 0);
  assert.equal(canalSurfaceSprayRate(true, 6.01, .2, false), 18);
  assert.equal(canalSurfaceSprayRate(true, -14, .2, false), 18);
  assert.equal(canalSurfaceSprayRate(true, 14, .2, true), 7);
});
