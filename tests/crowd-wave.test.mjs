import test from 'node:test';
import assert from 'node:assert/strict';
import { crowdReact, crowdState, reactToTrackEvent, stepCrowd } from '../src/crowd-wave.ts';

test('large course events raise the stands and the response fades back out', () => {
  crowdState.wave = 0;
  crowdState.excite = 0;
  reactToTrackEvent('zeppelin');
  assert.equal(crowdState.wave, 8);
  assert.equal(crowdState.excite, 3);
  stepCrowd(8);
  assert.equal(crowdState.wave, 0);
  assert.equal(crowdState.excite, 0);
});

test('smaller course moments produce a short cheer without a full-stadium ola', () => {
  crowdState.wave = 0;
  crowdState.excite = 0;
  reactToTrackEvent('balcony');
  assert.equal(crowdState.wave, 0);
  assert.equal(crowdState.excite, 2.5);
  crowdReact('cheer');
  assert.equal(crowdState.excite, 2.5);
});
