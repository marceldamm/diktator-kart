import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceKart, initialKartState } from '../src/kart-model.ts';
import { ABILITY_RULES, createAbilities, stepAbilities, abilityReady } from '../src/abilities.ts';

const step = 1 / 60;
test('Q turns the kart into a tank for 8 s with an 18 s cooldown from activation, then reverts', () => {
  const world = createAbilities(1); let karts = [initialKartState()];
  karts = stepAbilities(world, karts, [true], [0], step);
  assert.equal(karts[0].tankRemaining, ABILITY_RULES.tankDuration); assert.equal(world.events[0].kind, 'transform');
  karts = stepAbilities(world, karts, [true], [0], step); assert.equal(world.events.length, 0, 'no re-trigger while active');
  let reverted = false, t = 0;
  for (; t < 20; t += step) {
    karts = [advanceKart(karts[0], { throttle: 0, steering: 0 }, step)];
    karts = stepAbilities(world, karts, [false], [0], step);
    if (world.events.some((e) => e.kind === 'revert')) { reverted = true; break; }
  }
  assert.ok(reverted && Math.abs(t - 8) < .1, `reverted after ${t}`);
  assert.equal(abilityReady(world, 0, karts[0]), false, 'cooldown still running');
  for (let i = 0; i < 10.1 / step; i++) karts = stepAbilities(world, karts, [false], [0], step);
  assert.ok(abilityReady(world, 0, karts[0]), 'ready again 18 s after activation');
});

test('tank shoves and throttles nearby karts once per protection window and respects shared protection', () => {
  const world = createAbilities(3); const tank = { ...initialKartState(), tankRemaining: 5 };
  const near = { ...initialKartState(), x: 2, speed: 12 }, shielded = { ...initialKartState(), x: -2, speed: 12 };
  world.active[0] = true;
  let karts = stepAbilities(world, [tank, near, shielded], [false, false, false], [0, 0, 1], step);
  assert.equal(karts[1].speed, 12 * ABILITY_RULES.speedFactor); assert.ok(karts[1].impactVelocityX > 0); assert.equal(karts[1].slowRemaining, ABILITY_RULES.slowDuration);
  assert.equal(karts[2].speed, 12, 'protected kart untouched');
  karts = stepAbilities(world, karts, [false, false, false], [0, 0, 1], step);
  assert.equal(world.events.filter((e) => e.kind === 'crush').length, 0, 'repeat protection');
  let slowed = { ...karts[1], speed: 15, impactRemaining: 0 };
  for (let i = 0; i < 60; i++) slowed = advanceKart(slowed, { throttle: 1, steering: 0 }, step);
  assert.ok(slowed.speed < 11, `throttled while slowed ${slowed.speed}`);
});

test('Kim gets a ten-second polish, a short triumph boost and a timed motor audit without rank state', () => {
  const world = createAbilities(1); let karts = [initialKartState()];
  karts = stepAbilities(world, karts, [true], [0], step, ['kim']);
  assert.equal(karts[0].tankRemaining, 0);
  assert.equal(world.kimPolishRemaining[0], ABILITY_RULES.kimPolishDuration);
  assert.equal(world.kimBoostRemaining[0], ABILITY_RULES.kimBoostDuration);
  assert.equal(karts[0].turboRemaining, ABILITY_RULES.kimBoostDuration);
  assert.ok(karts[0].speed > 0);
  assert.equal(world.cooldown[0], ABILITY_RULES.cooldown);
  assert.equal(world.events[0].kind, 'kim-surge');
  assert.equal(abilityReady(world, 0, karts[0]), false);

  let audited = false;
  for (let i = 0; i < 60; i++) {
    karts = [advanceKart(karts[0], { throttle: 1, steering: 0 }, step)];
    stepAbilities(world, karts, [false], [0], step, ['kim']);
    if (world.events.some((event) => event.kind === 'kim-audit')) { audited = true; break; }
  }
  assert.ok(audited, 'the short boost is followed by its timed audit');
  assert.equal(world.kimPenaltyRemaining[0], ABILITY_RULES.kimPenaltyDuration);
  assert.ok(world.kimPolishRemaining[0] > 8, 'the visual finish continues after the boost');
});

test('Mussolini pose: reduced-throttle window, then applause push and item protection; same rule for bots', async () => {
  const { createAbilities, stepAbilities, ABILITY_RULES } = await import('../src/abilities.ts');
  const { initialKartState } = await import('../src/kart-model.ts');
  const world = createAbilities(2), immune = [0, 0];
  let karts = [{ ...initialKartState(), speed: 10 }, { ...initialKartState(), x: 5, speed: 10 }];
  karts = stepAbilities(world, karts, [true, false], immune, 1 / 60, ['pose', 'none']);
  assert.ok(world.events.some(e => e.kind === 'pose'));
  assert.ok(world.poseRemaining[0] > 1.2);
  let applause = false;
  for (let t = 0; t < 1.5; t += 1 / 60) { karts = stepAbilities(world, karts, [false, false], immune, 1 / 60, ['pose', 'none']); applause ||= world.events.some(e => e.kind === 'pose-applause'); }
  assert.ok(applause);
  assert.ok(karts[0].turboRemaining > 0 && immune[0] > 0);
  assert.ok(world.cooldown[0] > 0 && world.cooldown[0] <= ABILITY_RULES.cooldown);
});
