import test from 'node:test';
import assert from 'node:assert/strict';
import { SHADOW_CASTER_REFRESH_SECONDS, shouldRefreshShadowCasters } from '../src/shadow-caster-refresh.ts';

test('dynamic shadow membership initializes immediately and refreshes at 10 Hz', () => {
  assert.equal(shouldRefreshShadowCasters(0, Number.NaN), true);
  assert.equal(shouldRefreshShadowCasters(1, 1), false);
  assert.equal(shouldRefreshShadowCasters(1 + SHADOW_CASTER_REFRESH_SECONDS - 0.001, 1), false);
  assert.equal(shouldRefreshShadowCasters(1 + SHADOW_CASTER_REFRESH_SECONDS, 1), true);
});

test('invalid clock and interval values cannot trigger a shadow-list rebuild', () => {
  assert.equal(shouldRefreshShadowCasters(Number.NaN, 0), false);
  assert.equal(shouldRefreshShadowCasters(1, 0, 0), false);
  assert.equal(shouldRefreshShadowCasters(1, 0, Number.POSITIVE_INFINITY), false);
});
