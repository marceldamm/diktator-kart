import assert from 'node:assert/strict';
import test from 'node:test';
import { canalFoamBands, canalSurfaceSprayRate } from '../src/environment-effects.ts';

test('canal spray requires moving water contact and remains bounded in reduced mode', () => {
  assert.equal(canalSurfaceSprayRate(false, 14, .1, false), 0);
  assert.equal(canalSurfaceSprayRate(true, 5.99, .1, false), 0);
  assert.equal(canalSurfaceSprayRate(true, 6, .1, false), 0);
  assert.equal(canalSurfaceSprayRate(true, 14, .36, false), 0);
  assert.equal(canalSurfaceSprayRate(true, 6.01, .2, false), 18);
  assert.equal(canalSurfaceSprayRate(true, -14, .2, false), 18);
  assert.equal(canalSurfaceSprayRate(true, 14, .2, true), 7);
});

test('canal shoreline washes remain narrow and inside both water boundaries', () => {
  const bands = canalFoamBands(42, 8);
  assert.deepEqual(bands, [[42, 42.16], [49.84, 50]]);
  for (const [from, to] of bands) {
    assert.ok(to > from);
    assert.ok(to - from <= .16);
    assert.ok(from >= 42 && to <= 50);
  }
  assert.deepEqual(canalFoamBands(12, 0), []);
  assert.deepEqual(canalFoamBands(12, -4), []);
});
