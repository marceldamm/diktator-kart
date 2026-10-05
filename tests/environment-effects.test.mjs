import assert from 'node:assert/strict';
import test from 'node:test';
import { canalFoamBands, canalSurfaceSprayRate } from '../src/environment-effects.ts';

test('canal spray requires moving water contact and remains bounded in reduced mode', () => {
  assert.equal(canalSurfaceSprayRate(false, 14, .1, false), 0);
  assert.equal(canalSurfaceSprayRate(true, 5.99, .1, false), 0);
  assert.equal(canalSurfaceSprayRate(true, 6, .1, false), 0);
  assert.equal(canalSurfaceSprayRate(true, 14, .36, false), 0);
  assert.equal(canalSurfaceSprayRate(true, 6.01, .2, false), 30);
  assert.equal(canalSurfaceSprayRate(true, -14, .2, false), 30);
  assert.equal(canalSurfaceSprayRate(true, 14, .2, true), 14);
  assert.ok(30 * .48 < 28, 'normal spray leaves headroom in each 28-particle kart pool');
  assert.ok(14 * .48 < 28, 'reduced spray leaves headroom in each 28-particle kart pool');
  assert.equal(28 * 6, 168, 'six karts keep this effect layer below 168 live particles');
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
