import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceKart, initialKartState, KART_TUNING, resolveKartContacts, TERRAIN_BUMPS, TEST_AREA_HALF_SIZE, TEST_OBSTACLES, terrainHeightAt } from '../src/kart-model.ts';

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

test('marked side obstacle stops a directed kart without blocking the straight lane', () => {
  const straight = run(initialKartState(), { throttle: 1, steering: 0 }, 2);
  assert.equal(straight.impactKind, null);
  let state = run(initialKartState(), { throttle: 1, steering: 0 }, 0.5); // steering has inertia since quality level 2d
  for (let index = 0; index < 160 && state.impactKind !== 'obstacle'; index++) {
    state = advanceKart(state, { throttle: 1, steering: 1 }, step);
  }
  assert.equal(state.impactKind, 'obstacle');
  assert.equal(state.speed, 0);
  assert.ok(state.impactVelocityX < 0);
  const obstacle = TEST_OBSTACLES[0];
  assert.ok(state.x < obstacle.x - obstacle.halfWidth);
  const retreat = advanceKart(state, { throttle: 0, steering: 0 }, step);
  assert.ok(retreat.x < state.x);
  const reset = initialKartState();
  assert.equal(reset.impactKind, null);
});

test('two approaching karts share one contact rule and separate after impact', () => {
  const left = { ...initialKartState(), z: 4, speed: 9, drifting: true,
    driftDirection: 1, driftCharge: KART_TUNING.driftChargeTime, turboRemaining: 0.8 };
  const right = { ...initialKartState(), z: 6, heading: Math.PI,
    travelHeading: Math.PI, speed: 8 };
  const [hitLeft, hitRight] = resolveKartContacts([left, right]);
  assert.ok(Math.hypot(hitLeft.x - hitRight.x, hitLeft.z - hitRight.z) >= 2 * KART_TUNING.collisionRadius - 1e-9);
  for (const kart of [hitLeft, hitRight]) {
    // Head-on: equal karts cancel their closing speed instead of freezing in place.
    assert.ok(Math.abs(kart.speed) < 1.5, `speed ${kart.speed}`);
    assert.equal(kart.impactKind, 'kart');
    assert.ok(kart.impactRemaining > 0);
    assert.equal(kart.turboRemaining, 0);
    assert.equal(kart.drifting, false);
  }
  assert.ok(hitLeft.impactVelocityZ < 0 && hitRight.impactVelocityZ > 0);
  assert.equal(left.speed, 9, 'input state should not be changed');
  const recovering = advanceKart(hitLeft, { throttle: 0, steering: 0 }, step);
  assert.ok(recovering.z < hitLeft.z);
});

test('kart contact leaves distant karts unchanged and handles coincident centres', () => {
  const a = initialKartState();
  const b = { ...initialKartState(), x: 8 };
  assert.deepEqual(resolveKartContacts([a, b]), [a, b]);
  const [left, right] = resolveKartContacts([{ ...a, speed: 4 }, { ...a, speed: 4 }]);
  assert.ok(Math.hypot(left.x - right.x, left.z - right.z) >= 2 * KART_TUNING.collisionRadius - 1e-9);
  assert.ok(Number.isFinite(left.impactVelocityX) && Number.isFinite(right.impactVelocityX));
});

test('six moving karts stay finite and within the test area during a long simulation', () => {
  let karts = [initialKartState(), ...Array.from({ length: 5 }, (_, index) => {
    const angle = index * 2 * Math.PI / 5;
    const heading = angle + Math.PI / 2;
    return { ...initialKartState(), x: 10.5 * Math.sin(angle), z: 10.5 * Math.cos(angle),
      heading, travelHeading: heading, speed: 8 };
  })];
  for (let tick = 0; tick < 3600; tick++) {
    karts = resolveKartContacts(karts.map((kart, index) => advanceKart(kart,
      { throttle: 1, steering: index ? 0.75 : 0.4 }, step)));
    for (let first = 0; first < karts.length; first++) {
      const kart = karts[first];
      assert.ok(Number.isFinite(kart.x) && Number.isFinite(kart.z) && Number.isFinite(kart.speed));
      assert.ok(Math.abs(kart.x) <= TEST_AREA_HALF_SIZE && Math.abs(kart.z) <= TEST_AREA_HALF_SIZE);
      for (const obstacle of TEST_OBSTACLES) {
        const nearestX = Math.max(obstacle.x - obstacle.halfWidth, Math.min(obstacle.x + obstacle.halfWidth, kart.x));
        const nearestZ = Math.max(obstacle.z - obstacle.halfDepth, Math.min(obstacle.z + obstacle.halfDepth, kart.z));
        assert.ok(Math.hypot(kart.x - nearestX, kart.z - nearestZ) >= KART_TUNING.collisionRadius - 1e-6,
          `obstacle penetration at tick ${tick}`);
      }
      for (let second = first + 1; second < karts.length; second++) {
        assert.ok(Math.hypot(kart.x - karts[second].x, kart.z - karts[second].z)
          >= 2 * KART_TUNING.collisionRadius - 0.02, `overlap at tick ${tick}`);
      }
    }
  }
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
  let state = { ...initialKartState(), x: -8, speed: 8 };
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

test('sliding along a barrier keeps most speed; only the first touch costs a little', () => {
  let state = { ...initialKartState(), x: TEST_AREA_HALF_SIZE - .02, z: -15, heading: .12, travelHeading: .12, speed: 14 };
  let contacts = 0;
  for (let i = 0; i < 120; i++) {
    state = advanceKart(state, { throttle: 1, steering: .15 }, step);
    if (state.scrapeRemaining > 0) contacts++;
  }
  assert.ok(contacts > 60, `barrier contact frames ${contacts}`);
  assert.ok(state.speed > 12, `speed after two seconds along the barrier ${state.speed}`);
  assert.equal(state.impactRemaining, 0);
});
