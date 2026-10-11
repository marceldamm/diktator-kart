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

test('all six events select a bounded audience response and repeated cues do not stack forever', () => {
  const large = ['zeppelin', 'wave', 'parade', 'column'];
  const small = ['balcony', 'loudspeaker'];
  for (const kind of [...large, ...small]) {
    crowdState.wave = 0;
    crowdState.excite = 0;
    reactToTrackEvent(kind);
    assert.equal(crowdState.wave, large.includes(kind) ? 8 : 0, `${kind}: audience cue scale`);
    assert.equal(crowdState.excite, large.includes(kind) ? 3 : 2.5, `${kind}: bounded bounce`);
    for (let repeat = 0; repeat < 12; repeat++) reactToTrackEvent(kind);
    assert.ok(crowdState.wave <= 8);
    assert.ok(crowdState.excite <= 3);
    stepCrowd(8);
    assert.equal(crowdState.wave, 0);
    assert.equal(crowdState.excite, 0);
  }
});
