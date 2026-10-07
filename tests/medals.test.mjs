import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceKart } from '../src/kart-model.ts';
import { createMedals, stepMedals, loseMedals, MEDAL_RULES } from '../src/medals.ts';
import { gridKart, projectTrack, selectTrack } from '../src/track.ts';

test('medals line both circuits, are picked up by anyone, cap at ten and raise only the normal top speed', () => {
  for (const id of ['stadionring', 'duce-drom']) {
    selectTrack(id);
    const world = createMedals(2);
    assert.ok(world.medals.length >= 30, `${id}: ${world.medals.length} medals`);
    let karts = [{ ...gridKart(0), x: world.medals[0].x, z: world.medals[0].z }, gridKart(1)];
    karts = stepMedals(world, karts, 1 / 60);
    assert.equal(world.counts[0], 1); assert.equal(world.counts[1], 0);
    assert.ok(world.medals[0].readyIn > 0);
    world.counts[0] = MEDAL_RULES.max; karts = stepMedals(world, karts, 1 / 60);
    assert.ok(Math.abs(karts[0].topSpeedBonus - MEDAL_RULES.max * MEDAL_RULES.topSpeedPerMedal) < 1e-9);
    loseMedals(world, 0); assert.equal(world.counts[0], MEDAL_RULES.max - MEDAL_RULES.lossOnHit);
  }
  selectTrack('stadionring');
});

test('a medal bonus lifts the cruising speed slightly without touching turbo', () => {
  let plain = { ...gridKart(0), speed: 13 }, decorated = { ...plain };
  for (let i = 0; i < 60 * 4; i++) {
    plain = advanceKart(plain, { throttle: 1, steering: 0 }, 1 / 60, projectTrack);
    decorated = advanceKart({ ...decorated, topSpeedBonus: .7 }, { throttle: 1, steering: 0 }, 1 / 60, projectTrack);
  }
  assert.ok(decorated.speed > plain.speed + .5 && decorated.speed < plain.speed + .75, `${plain.speed} vs ${decorated.speed}`);
});
