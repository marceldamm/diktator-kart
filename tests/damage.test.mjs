import assert from 'node:assert/strict';
import test from 'node:test';
import { initialKartState } from '../src/kart-model.ts';
import { DAMAGE_RULES, createDamage, stepDamage } from '../src/damage.ts';

const step = 1 / 60;
const hit = (speedBefore, speedAfter) => [{ ...initialKartState(), speed: speedBefore, impactRemaining: 0 }, { ...initialKartState(), speed: speedAfter, impactRemaining: .22, impactKind: 'boundary' }];

test('one hard hit never wrecks; three heavy hits do, then the workshop repairs with protection', () => {
  const world = createDamage(1);
  const [a, b] = hit(25, 0);
  stepDamage(world, [a], [b], step);
  assert.equal(world.health[0], 100 - DAMAGE_RULES.maxPerHit, 'capped single hit');
  stepDamage(world, [a], [b], step); stepDamage(world, [a], [b], step);
  assert.equal(world.health[0], 0); assert.ok(world.events.some((e) => e.kind === 'wreck'));
  for (let t = 0; t < DAMAGE_RULES.wreckDuration + .05; t += step) stepDamage(world, [b], [b], step);
  assert.equal(world.health[0], 100, 'repaired');
  stepDamage(world, [a], [b], step); assert.equal(world.health[0], 100, 'protected right after repair');
});

test('small bumps and steady driving cause no damage; item hits do', () => {
  const world = createDamage(1);
  const [a, b] = hit(10, 8.5); stepDamage(world, [a], [b], step); assert.equal(world.health[0], 100);
  const k = { ...initialKartState(), speed: 15 }; stepDamage(world, [k], [{ ...k, speed: 14.9 }], step); assert.equal(world.health[0], 100);
  stepDamage(world, [k], [{ ...k, spinRemaining: .95 }], step); assert.equal(world.health[0], 100 - DAMAGE_RULES.itemHit);
});

test('repeated item hits wear down a player or bot until the shared wreck and repair path starts', () => {
  for (const kartIndex of [0, 4]) {
    const world = createDamage(6);
    const k = { ...initialKartState(), speed: 16 };
    for (let hitIndex = 0; hitIndex < 8; hitIndex++) {
      // Each new spin state represents a fresh hit after the prior hit's recovery/immunity.
      const before = Array.from({ length: 6 }, () => k), after = before.slice();
      before[kartIndex] = { ...k, spinRemaining: 0 }; after[kartIndex] = { ...k, spinRemaining: .95 };
      stepDamage(world, before, after, step);
      if (hitIndex < 7) assert.equal(world.health[kartIndex], 100 - (hitIndex + 1) * DAMAGE_RULES.itemHit);
    }
    assert.equal(world.health[kartIndex], 0);
    assert.equal(world.wrecked[kartIndex], DAMAGE_RULES.wreckDuration);
    assert.ok(world.events.some((event) => event.kind === 'wreck' && event.kart === kartIndex));
  }
});
