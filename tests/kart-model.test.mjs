import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceKart, initialKartState, KART_TUNING, TERRAIN_BUMPS, TEST_AREA_HALF_SIZE, terrainHeightAt } from '../src/kart-model.ts';

const step = 1 / 60;
function run(state, input, seconds) {
  for (let i = 0; i < Math.round(seconds / step); i++) state = advanceKart(state, input, step);
  return state;
}

test('gas accelerates to its cap; brake slows before reverse', () => {
  const fast = run(initialKartState(), { throttle: 1, steering: 0 }, 1.8);
  assert.equal(fast.speed, KART_TUNING.maxForwardSpeed);
  const braking = run(fast, { throttle: -1, steering: 0 }, 0.5);
  assert.ok(braking.speed > 0 && braking.speed < fast.speed);
  const reverse = run(braking, { throttle: -1, steering: 0 }, 3);
  assert.equal(reverse.speed, -KART_TUNING.maxReverseSpeed);
});

test('steering needs movement and reverses direction while backing up', () => {
  const idle = run(initialKartState(), { throttle: 0, steering: 1 }, 1);
  assert.equal(idle.heading, 0);
  const forward = run(initialKartState(), { throttle: 1, steering: 1 }, 1);
  const backward = run(initialKartState(), { throttle: -1, steering: 1 }, 1);
  assert.ok(forward.heading > 0 && forward.x > 0);
  assert.ok(backward.heading < 0);
});

test('coasting slows and the visible test boundary stops the kart', () => {
  const moving = run(initialKartState(), { throttle: 1, steering: 0 }, 0.5);
  const coasting = run(moving, { throttle: 0, steering: 0 }, 1);
  assert.ok(coasting.speed >= 0 && coasting.speed < moving.speed);
  const edge = run(initialKartState(), { throttle: 1, steering: 0 }, 10);
  assert.ok(edge.z <= TEST_AREA_HALF_SIZE);
  assert.equal(initialKartState().driftCharge, 0);
  assert.equal(initialKartState().turboRemaining, 0);
});

test('boundary impact briefly rebounds, cancels drift/turbo and recovers', () => {
  const approaching = { ...initialKartState(), z: TEST_AREA_HALF_SIZE - 0.04, speed: 12,
    turboRemaining: 0.8, drifting: true, driftCharge: 0.7, driftDirection: 1 };
  const hit = advanceKart(approaching, { throttle: 1, steering: 0, hopDrift: true }, step);
  assert.equal(hit.z, TEST_AREA_HALF_SIZE);
  assert.equal(hit.speed, 0);
  assert.ok(hit.impactRemaining > 0 && hit.impactVelocityZ < 0);
  assert.equal(hit.drifting, false);
  assert.equal(hit.turboRemaining, 0);
  const retreat = advanceKart(hit, { throttle: 1, steering: 0 }, step);
  assert.ok(retreat.z < hit.z);
  const recovered = run(retreat, { throttle: 0, steering: 0 }, 0.5);
  assert.equal(recovered.impactRemaining, 0);
  assert.ok(recovered.z < TEST_AREA_HALF_SIZE);
  assert.equal(initialKartState().impactRemaining, 0);
});

test('Space starts one visible hop and holding it does not repeat the hop', () => {
  let state = advanceKart(initialKartState(), { throttle: 0, steering: 0, hopDrift: true, hopPressed: true }, step);
  const heights = [state.height];
  for (let i = 0; i < 35; i++) {
    state = advanceKart(state, { throttle: 0, steering: 0, hopDrift: true }, step);
    heights.push(state.height);
  }
  assert.ok(Math.max(...heights) > 0.55);
  assert.equal(state.height, 0);
  assert.equal(state.hopRemaining, 0);
  assert.equal(state.drifting, false);
});

test('a short drift releases without turbo', () => {
  let state = { ...initialKartState(), speed: 9 };
  state = advanceKart(state, { throttle: 1, steering: 1, hopDrift: true, hopPressed: true }, step);
  state = run(state, { throttle: 1, steering: 1, hopDrift: true }, 0.55);
  assert.equal(state.drifting, true);
  assert.ok(state.driftCharge < KART_TUNING.driftChargeTime);
  state = advanceKart(state, { throttle: 1, steering: 1, hopDrift: false }, step);
  assert.equal(state.drifting, false);
  assert.equal(state.turboRemaining, 0);
});

test('a sustained directed drift charges mini-turbo; brake cancels it', () => {
  let state = { ...initialKartState(), speed: 8 };
  state = advanceKart(state, { throttle: 1, steering: 1, hopDrift: true, hopPressed: true }, step);
  state = run(state, { throttle: 1, steering: 1, hopDrift: true }, 1.3);
  assert.equal(state.drifting, true);
  assert.equal(state.driftCharge, KART_TUNING.driftChargeTime);
  assert.ok(Math.abs(state.heading - state.travelHeading) > 0.1);
  const beforeRelease = state.speed;
  state = advanceKart(state, { throttle: 1, steering: 1, hopDrift: false }, step);
  assert.equal(state.drifting, false);
  assert.ok(state.turboRemaining > 0);
  assert.ok(state.speed > beforeRelease);
  const braking = advanceKart(state, { throttle: -1, steering: 0 }, step);
  assert.equal(braking.turboRemaining, 0);
  const releaseAndBrake = advanceKart({ ...state, drifting: true, driftCharge: KART_TUNING.driftChargeTime }, { throttle: -1, steering: 1, hopDrift: false }, step);
  assert.equal(releaseAndBrake.turboRemaining, 0);
  const expired = run({ ...state, x: 0, z: 0, speed: 0 }, { throttle: 0, steering: 0 }, 1.3);
  assert.equal(expired.turboRemaining, 0);
});

test('marked bumps lift individual wheels and the chassis settles after contact', () => {
  assert.equal(terrainHeightAt(0, TERRAIN_BUMPS[0].z), TERRAIN_BUMPS[0].height);
  assert.equal(terrainHeightAt(5, TERRAIN_BUMPS[0].z), 0);
  let state = { ...initialKartState(), speed: 7, z: 4.8 };
  let maximumWheel = 0;
  let maximumBody = 0;
  let maximumPitch = 0;
  for (let index = 0; index < 65; index++) {
    state = advanceKart(state, { throttle: 0, steering: 0 }, step);
    maximumWheel = Math.max(maximumWheel, ...state.wheelGroundHeights);
    maximumBody = Math.max(maximumBody, state.suspensionOffset);
    maximumPitch = Math.max(maximumPitch, Math.abs(state.bodyPitch));
  }
  assert.ok(maximumWheel > 0.08, `wheel contact ${maximumWheel}`);
  assert.ok(maximumBody > 0.015, `body response ${maximumBody}`);
  assert.ok(maximumPitch > 0.01, `body pitch ${maximumPitch}`);
  state = run({ ...state, speed: 0, z: 8 }, { throttle: 0, steering: 0 }, 1);
  assert.ok(Math.abs(state.suspensionOffset) < 0.001);
  assert.ok(Math.abs(state.bodyPitch) < 0.001);
});

test('one-sided contact rolls the body; hop clears wheels and landing compresses suspension', () => {
  let state = { ...initialKartState(), x: 3.2, z: TERRAIN_BUMPS[0].z - 0.68 };
  state = run(state, { throttle: 0, steering: 0 }, 0.25);
  assert.ok(state.wheelGroundHeights[0] > state.wheelGroundHeights[1]);
  assert.ok(Math.abs(state.bodyRoll) > 0.005);
  state = advanceKart(state, { throttle: 0, steering: 0, hopDrift: true, hopPressed: true }, step);
  assert.equal(state.grounded, false);
  state = run(state, { throttle: 0, steering: 0, hopDrift: true }, 0.5);
  assert.equal(state.grounded, true);
  assert.equal(state.height, 0);
  assert.ok(state.suspensionVelocity < 0, 'landing should compress the suspension');
  const reset = initialKartState();
  assert.equal(reset.suspensionOffset, 0);
  assert.deepEqual(reset.wheelGroundHeights, [0, 0, 0, 0]);
});
