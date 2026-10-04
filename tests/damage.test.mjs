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
