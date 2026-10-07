export interface KartState {
  /** Extra top speed from pinned-on medals (src/medals.ts); 0 or absent for everyone without medals. */
  topSpeedBonus?: number;
  x: number;
  z: number;
  heading: number;
  travelHeading: number;
  speed: number;
  height: number;
  /** Ramp jump: seconds left, total flight, take-off height and extra apex height. */
  jumpRemaining?: number; jumpDuration?: number; jumpStart?: number; jumpPeak?: number;
  /** True for the one step in which a jump ended in a clean, straight landing (landing boost). */
  landedClean?: boolean;
  /** A trick was performed during the current jump (spin animation, bigger landing boost). */
  trick?: boolean;
  hopRemaining: number;
  drifting: boolean;
  driftDirection: number;
  driftCharge: number;
  turboRemaining: number;
  suspensionOffset: number;
  suspensionVelocity: number;
  bodyPitch: number;
  bodyRoll: number;
  wheelGroundHeights: [number, number, number, number];
  grounded: boolean;
  impactRemaining: number;
  impactVelocityX: number;
  impactVelocityZ: number;
  impactKind: 'boundary' | 'obstacle' | 'kart' | 'item' | null;
  /** Seconds of visible scrape/bump feedback after a glancing wall or kart contact. */
  scrapeRemaining: number;
  /** Seconds of the visual spin-out after an item hit (presentation only). */
  spinRemaining: number;
  /** What the last glancing contact touched: barrier scrape or kart bump (sound and sparks). */
  scrapeKind: 'wall' | 'kart' | null;
  /** Smoothed steering input: drives the yaw response and the visible wheels, wheel and arms. */
  steer: number;
  /** Current yaw rate (rad/s); follows the steering target with inertia like a road car. */
  yawRate: number;
  /** Seconds left in the 'Größenbefehl' parade tank form (src/abilities.ts). */
  tankRemaining: number;
  /** Seconds a run-over kart stays throttled after being pushed aside by a tank. */
  slowRemaining: number;
}

export interface DriveInput {
  throttle: number;
  steering: number;
  hopDrift?: boolean;
  hopPressed?: boolean;
}

// Provisional M2 values in metres and seconds. They are tuning inputs, not final balance.
export const TEST_AREA_HALF_SIZE = 22.5;
// Two deliberately small and visible cross-track bumps on the test lane.
export const TERRAIN_BUMPS = [
  { z: 6, halfWidth: 3.5, halfLength: 0.55, height: 0.12 },
  { z: 13.5, halfWidth: 3.5, halfLength: 0.7, height: 0.18 },
] as const;
export const TEST_OBSTACLES = [
  { x: 4.3, z: 10.2, halfWidth: 0.65, halfDepth: 0.65, height: 1.2 },
] as const;
// Order: front-left, front-right, rear-left, rear-right.
export const WHEEL_POSITIONS = [
  { x: -0.83, z: 0.68 }, { x: 0.83, z: 0.68 },
  { x: -0.83, z: -0.68 }, { x: 0.83, z: -0.68 },
] as const;
/** Mini-turbo tier (0 = none) for a drift charge in seconds. */
export const driftTier = (charge: number) => KART_TUNING.driftTiers.filter((t) => charge >= t - 1e-9).length;

export const KART_TUNING = {
  acceleration: 10,
  braking: 16,
  reverseAcceleration: 6,
  maxForwardSpeed: 16,
  maxReverseSpeed: 5,
  steeringPerMetre: 0.134,
  maxYawRate: 1.68,
  coastDeceleration: 3.2,
  hopDuration: 0.42,
  hopHeight: 0.6,
  driftMinSpeed: 5,
  /** Full drift charge (third tier). Tiers: see driftTiers. */
  driftChargeTime: 1.6,
  /** Mini-turbo tiers by charge (s): 1 short, 2 medium, 3 full boost. */
  driftTiers: [0.6, 1.1, 1.6] as const,
  driftYawMultiplier: .98,
  driftHeadingFollow: 1.6,
  driftMaxSlip: 0.42,
  normalHeadingFollow: 5.5,
  /** Steering wheel travel rate (1/s) and yaw response rate (1/s): less direct, more car-like. */
  steerRate: 9,
  /** Faster self-centring when the key is released or reversed (Marcel: steering felt too soft). */
  steerReturnRate: 18,
  yawResponse: 11,
  turboDuration: 1.2,
  turboSpeedBonus: 4,
  turboAcceleration: 4,
  maxTurboSpeed: 20,
  suspensionStiffness: 75,
  suspensionDamping: 17,
  bodyTiltFollow: 10,
  landingVelocity: -1.2,
  impactDuration: 0.22,
  impactReboundCap: 2.5,
  impactVelocityDecay: 10,
  collisionRadius: 1.25,
  /** Closing speed (m/s) above which kart contact is a stopping crash instead of a racing bump. */
  crashClosingSpeed: 7,
} as const;

export function terrainHeightAt(x: number, z: number): number {
  let height = 0;
  for (const bump of TERRAIN_BUMPS) {
    if (Math.abs(x) > bump.halfWidth) continue;
    const distance = Math.abs(z - bump.z);
    if (distance < bump.halfLength) {
      height = Math.max(height, bump.height * (1 - distance / bump.halfLength));
    }
  }
  return height;
}

function sampleWheelGround(x: number, z: number, heading: number, terrain = terrainHeightAt): [number, number, number, number] {
  const cosine = Math.cos(heading);
  const sine = Math.sin(heading);
  return WHEEL_POSITIONS.map((wheel) => terrain(
    x + wheel.x * cosine + wheel.z * sine,
    z - wheel.x * sine + wheel.z * cosine,
  )) as [number, number, number, number];
}

export function initialKartState(): KartState {
  return {
    x: 0, z: 0, heading: 0, travelHeading: 0, speed: 0,
    height: 0, hopRemaining: 0, drifting: false,
    driftDirection: 0, driftCharge: 0, turboRemaining: 0,
    suspensionOffset: 0, suspensionVelocity: 0, bodyPitch: 0, bodyRoll: 0,
    wheelGroundHeights: [0, 0, 0, 0], grounded: true,
    impactRemaining: 0, impactVelocityX: 0, impactVelocityZ: 0,
    impactKind: null, scrapeRemaining: 0, spinRemaining: 0, scrapeKind: null, steer: 0, yawRate: 0, tankRemaining: 0, slowRemaining: 0,
  };
}

function approachZero(value: number, amount: number): number {
  if (value > 0) return Math.max(0, value - amount);
  return Math.min(0, value + amount);
}

export type WorldProjection = (rawX: number, rawZ: number) => {
  x: number; z: number; normalX: number; normalZ: number; kind: 'boundary' | 'obstacle' | null;
};

function projectIntoTestArea(rawX: number, rawZ: number): ReturnType<WorldProjection> {
  let x = Math.max(-TEST_AREA_HALF_SIZE, Math.min(TEST_AREA_HALF_SIZE, rawX));
  let z = Math.max(-TEST_AREA_HALF_SIZE, Math.min(TEST_AREA_HALF_SIZE, rawZ));
  let normalX = x !== rawX ? -Math.sign(rawX) : 0;
  let normalZ = z !== rawZ ? -Math.sign(rawZ) : 0;
  let kind: 'boundary' | 'obstacle' | null = normalX || normalZ ? 'boundary' : null;
  for (const obstacle of TEST_OBSTACLES) {
    const nearestX = Math.max(obstacle.x - obstacle.halfWidth, Math.min(obstacle.x + obstacle.halfWidth, x));
    const nearestZ = Math.max(obstacle.z - obstacle.halfDepth, Math.min(obstacle.z + obstacle.halfDepth, z));
    const differenceX = x - nearestX;
    const differenceZ = z - nearestZ;
    const distance = Math.hypot(differenceX, differenceZ);
    if (distance >= KART_TUNING.collisionRadius) continue;
    if (distance > 0.000001) {
      normalX = differenceX / distance;
      normalZ = differenceZ / distance;
      x += normalX * (KART_TUNING.collisionRadius - distance);
      z += normalZ * (KART_TUNING.collisionRadius - distance);
    } else {
      const toLeft = x - (obstacle.x - obstacle.halfWidth);
      const toRight = obstacle.x + obstacle.halfWidth - x;
      const toNear = z - (obstacle.z - obstacle.halfDepth);
      const toFar = obstacle.z + obstacle.halfDepth - z;
      const smallest = Math.min(toLeft, toRight, toNear, toFar);
      normalX = smallest === toLeft ? -1 : smallest === toRight ? 1 : 0;
      normalZ = smallest === toNear ? -1 : smallest === toFar ? 1 : 0;
      x += normalX * (KART_TUNING.collisionRadius + smallest);
      z += normalZ * (KART_TUNING.collisionRadius + smallest);
    }
    kind = 'obstacle';
    break;
  }
  return { x, z, normalX, normalZ, kind };
}

export function advanceKart(state: KartState, input: DriveInput, dt: number, project: WorldProjection = projectIntoTestArea, terrain = terrainHeightAt): KartState {
  const commandedDrive = Math.max(-1, Math.min(1, input.throttle));
  const drive = state.impactRemaining > 0 ? Math.min(0, commandedDrive) : commandedDrive;
  const steering = Math.max(-1, Math.min(1, input.steering));
  const held = input.hopDrift ?? false;
  let speed = state.speed;
  let turboRemaining = drive < 0 ? 0 : Math.max(0, state.turboRemaining - dt);

  if (drive > 0) {
    // A tank is heavy but not slow; a kart just pushed aside by one is briefly throttled.
    const cap = turboRemaining > 0 ? KART_TUNING.maxTurboSpeed : (state.slowRemaining ?? 0) > 0 ? KART_TUNING.maxForwardSpeed * .62 : (state.tankRemaining ?? 0) > 0 ? KART_TUNING.maxForwardSpeed * .94 : KART_TUNING.maxForwardSpeed + (state.topSpeedBonus ?? 0);
    speed = speed < 0
      ? Math.min(0, speed + KART_TUNING.braking * drive * dt)
      : speed > cap
        ? Math.max(cap, speed - KART_TUNING.coastDeceleration * dt)
        : Math.min(cap, speed + KART_TUNING.acceleration * drive * dt);
  } else if (drive < 0) {
    speed = speed > 0
      ? Math.max(0, speed + KART_TUNING.braking * drive * dt)
      : Math.max(-KART_TUNING.maxReverseSpeed, speed + KART_TUNING.reverseAcceleration * drive * dt);
  } else {
    speed = approachZero(speed, (KART_TUNING.coastDeceleration + Math.abs(speed) * 0.15) * dt);
  }
  if (turboRemaining > 0 && drive >= 0) {
    speed = Math.min(KART_TUNING.maxTurboSpeed, speed + KART_TUNING.turboAcceleration * dt);
  }

  let hopRemaining = Math.max(0, state.hopRemaining - dt);
  if (input.hopPressed && state.hopRemaining === 0 && !state.drifting) {
    hopRemaining = KART_TUNING.hopDuration;
  }
  const hopProgress = 1 - hopRemaining / KART_TUNING.hopDuration;
  const jumpRemaining = Math.max(0, (state.jumpRemaining ?? 0) - dt), jumpDuration = state.jumpDuration ?? 1;
  const jumpU = 1 - jumpRemaining / jumpDuration;
  const height = Math.max(hopRemaining > 0 ? 4 * KART_TUNING.hopHeight * hopProgress * (1 - hopProgress) : 0,
    jumpRemaining > 0 ? (state.jumpStart ?? 0) * (1 - jumpU) + (state.jumpPeak ?? 0) * Math.sin(Math.PI * jumpU) : 0);

  let drifting = state.drifting;
  let driftDirection = state.driftDirection;
  let driftCharge = state.driftCharge;
  if (drifting) {
    if (!held || speed < KART_TUNING.driftMinSpeed) {
      const tier = driftTier(driftCharge);
      if (!held && drive >= 0 && tier > 0 && speed >= KART_TUNING.driftMinSpeed) {
        turboRemaining = KART_TUNING.turboDuration * [.5, .75, 1][tier - 1];
        speed = Math.min(KART_TUNING.maxTurboSpeed, speed + KART_TUNING.turboSpeedBonus * [.6, .8, 1][tier - 1]);
      }
      drifting = false;
      driftDirection = 0;
      driftCharge = 0;
    } else {
      // Both tightening and countersteering charge; direction belongs to the initiated drift.
      const charging = Math.abs(steering) >= .25 ? 1 : .6;
      driftCharge = Math.min(KART_TUNING.driftChargeTime, driftCharge + dt * charging);
    }
  } else if (held && hopRemaining === 0 && speed >= KART_TUNING.driftMinSpeed && Math.abs(steering) >= 0.25) {
    drifting = true;
    driftDirection = Math.sign(steering);
    driftCharge = 0;
  }

  // The wheel needs time to turn and the body needs time to rotate: steering input -> steer -> yaw rate.
  const previousSteer = state.steer ?? 0, returning = Math.abs(steering) < Math.abs(previousSteer) || steering * previousSteer < 0;
  const steer = previousSteer + (steering - previousSteer) * Math.min(1, (returning ? KART_TUNING.steerReturnRate : KART_TUNING.steerRate) * dt);
  // The original drift kept a strong fixed yaw even while countersteering. Let countersteer widen the arc.
  const driftSteer = steer * driftDirection;
  const turn = drifting ? driftDirection * (.38 + .32 * driftSteer) : steer;
  const targetYaw = Math.max(-KART_TUNING.maxYawRate,
    Math.min(KART_TUNING.maxYawRate, speed * turn * KART_TUNING.steeringPerMetre * (drifting ? KART_TUNING.driftYawMultiplier : 1)));
  const yawRate = (state.yawRate ?? 0) + (targetYaw - (state.yawRate ?? 0)) * Math.min(1, (drifting ? 5 : KART_TUNING.yawResponse) * dt);
  let heading = state.heading + yawRate * dt;
  const wantedTravel = heading - (drifting ? driftDirection * (.08 + .06 * Math.max(0, driftSteer)) : 0);
  const angleDifference = Math.atan2(Math.sin(wantedTravel - state.travelHeading), Math.cos(wantedTravel - state.travelHeading));
  const follow = (drifting ? KART_TUNING.driftHeadingFollow : KART_TUNING.normalHeadingFollow) * dt;
  let travelHeading = state.travelHeading + Math.max(-follow, Math.min(follow, angleDifference));
  if (drifting) {
    const slip = Math.atan2(Math.sin(heading - travelHeading), Math.cos(heading - travelHeading));
    travelHeading = heading - Math.max(-KART_TUNING.driftMaxSlip, Math.min(KART_TUNING.driftMaxSlip, slip));
  }
  const rawX = state.x + Math.sin(travelHeading) * speed * dt + state.impactVelocityX * dt;
  const rawZ = state.z + Math.cos(travelHeading) * speed * dt + state.impactVelocityZ * dt;
  const { x, z, normalX: collisionNormalX, normalZ: collisionNormalZ, kind } = project(rawX, rawZ);
  let impactKind: KartState['impactKind'] = kind ?? state.impactKind;
  const collided = collisionNormalX !== 0 || collisionNormalZ !== 0;
  let impactRemaining = Math.max(0, state.impactRemaining - dt);
  const impactDecay = Math.exp(-KART_TUNING.impactVelocityDecay * dt);
  let impactVelocityX = state.impactVelocityX * impactDecay;
  let impactVelocityZ = state.impactVelocityZ * impactDecay;

  let scrapeRemaining = Math.max(0, (state.scrapeRemaining ?? 0) - dt);
  const spinRemaining = Math.max(0, (state.spinRemaining ?? 0) - dt);
  const normalLength = Math.hypot(collisionNormalX, collisionNormalZ) || 1;
  const wallX = collisionNormalX / normalLength, wallZ = collisionNormalZ / normalLength;
  const closing = -(Math.sin(travelHeading) * wallX + Math.cos(travelHeading) * wallZ) * speed;
  const glance = speed > 0 ? Math.max(0, closing) / speed : 1;
  if (collided && kind === 'boundary' && speed > 2 && glance < .6) {
    // Shallow wall scrape: keep the tangential motion, lose speed with the impact angle.
    const tangentX = Math.sin(travelHeading) * speed + closing * wallX, tangentZ = Math.cos(travelHeading) * speed + closing * wallZ;
    const slide = Math.atan2(tangentX, tangentZ);
    travelHeading = slide;
    heading += Math.atan2(Math.sin(slide - heading), Math.cos(slide - heading)) * Math.min(1, 6 * dt);
    // One-time loss when the barrier is first touched, then only light friction while sliding along it.
    const fresh = (state.scrapeRemaining ?? 0) === 0 || state.scrapeKind !== 'wall';
    speed *= fresh ? Math.max(.35, 1 - glance * 1.1) : Math.exp(-(.12 + glance * 2.2) * dt);
    impactVelocityX += wallX * Math.min(.8, closing * .3); impactVelocityZ += wallZ * Math.min(.8, closing * .3);
    if (glance > .3) { drifting = false; driftCharge = 0; driftDirection = 0; turboRemaining = 0; }
    scrapeRemaining = .12;
  } else if (collided) {
    // Steep barrier hit: the normal part rebounds, the tangential part survives with friction;
    // a straight head-on hit (glance > ~0.92) still ends the forward run, oblique ones keep sliding along the wall.
    const tangentKeep = kind === 'boundary' && speed > 0 ? (glance > .92 ? 0 : Math.max(.3, Math.sqrt(Math.max(0, 1 - glance * glance)) * .85)) : 0;
    if (Math.abs(speed) > 1 && impactRemaining === 0) {
      const rebound = Math.min(KART_TUNING.impactReboundCap * 1.6, Math.abs(speed) * (kind === 'boundary' ? .32 : .15) + 0.3);
      impactVelocityX = wallX * rebound;
      impactVelocityZ = wallZ * rebound;
      impactRemaining = KART_TUNING.impactDuration;
    }
    if (tangentKeep > 0) {
      const tangentX = Math.sin(travelHeading) * speed + closing * wallX, tangentZ = Math.cos(travelHeading) * speed + closing * wallZ;
      travelHeading = Math.atan2(tangentX, tangentZ);
      // Turn the nose along the wall so the next frame does not hit it again (no 'sticking').
      heading += Math.atan2(Math.sin(travelHeading - heading), Math.cos(travelHeading - heading)) * .6;
    }
    speed *= tangentKeep;
    turboRemaining = 0;
    drifting = false;
    driftCharge = 0;
    driftDirection = 0;
  }
  if (impactRemaining === 0) impactKind = null;
  const grounded = hopRemaining === 0 && jumpRemaining === 0;
  const landedClean = (state.jumpRemaining ?? 0) > 0 && jumpRemaining === 0 && Math.abs(Math.sin(heading - travelHeading)) < .3 && impactRemaining === 0;
  const wheelGroundHeights = sampleWheelGround(x, z, heading, terrain);
  const averageGround = wheelGroundHeights.reduce((sum, contact) => sum + contact, 0) / 4;
  const targetOffset = grounded ? averageGround : 0;
  const landingImpulse = grounded && !state.grounded ? KART_TUNING.landingVelocity : 0;
  const suspensionVelocity = state.suspensionVelocity + landingImpulse +
    (KART_TUNING.suspensionStiffness * (targetOffset - state.suspensionOffset) -
      KART_TUNING.suspensionDamping * state.suspensionVelocity) * dt;
  const suspensionOffset = state.suspensionOffset + suspensionVelocity * dt;
  const frontGround = (wheelGroundHeights[0] + wheelGroundHeights[1]) / 2;
  const rearGround = (wheelGroundHeights[2] + wheelGroundHeights[3]) / 2;
  const leftGround = (wheelGroundHeights[0] + wheelGroundHeights[2]) / 2;
  const rightGround = (wheelGroundHeights[1] + wheelGroundHeights[3]) / 2;
  const tiltBlend = Math.min(1, KART_TUNING.bodyTiltFollow * dt);
  const bodyPitch = state.bodyPitch + ((grounded ? Math.atan2(frontGround - rearGround, 1.36) : 0) - state.bodyPitch) * tiltBlend;
  const bodyRoll = state.bodyRoll + ((grounded ? Math.atan2(rightGround - leftGround, 1.66) : 0) - state.bodyRoll) * tiltBlend;
  return { x, z, heading, travelHeading, speed, height, hopRemaining, jumpRemaining, jumpDuration, jumpStart: state.jumpStart, jumpPeak: state.jumpPeak, landedClean, trick: state.trick, drifting, driftDirection, driftCharge, turboRemaining,
    suspensionOffset, suspensionVelocity, bodyPitch, bodyRoll, wheelGroundHeights, grounded,
    impactRemaining, impactVelocityX, impactVelocityZ, impactKind, scrapeRemaining, spinRemaining,
    scrapeKind: scrapeRemaining > 0 ? (scrapeRemaining === .12 ? 'wall' : state.scrapeKind ?? null) : null,
    steer, yawRate,
    tankRemaining: Math.max(0, (state.tankRemaining ?? 0) - dt), slowRemaining: Math.max(0, (state.slowRemaining ?? 0) - dt) };
}

// Provisional M2 contact: horizontal circles, equal displacement and equal impact rules.
export function resolveKartContacts(states: KartState[], project: WorldProjection = projectIntoTestArea): KartState[] {
  const resolved = states.map((state) => ({ ...state }));
  const diameter = KART_TUNING.collisionRadius * 2;
  for (let pass = 0; pass < 4; pass++) {
    let corrected = false;
    for (let first = 0; first < resolved.length; first++) {
      for (let second = first + 1; second < resolved.length; second++) {
        const left = resolved[first];
        const right = resolved[second];
        const differenceX = left.x - right.x;
        const differenceZ = left.z - right.z;
        const distance = Math.hypot(differenceX, differenceZ);
        if (distance >= diameter) continue;
        corrected = true;
        const normalX = distance > 0.000001 ? differenceX / distance : 1;
        const normalZ = distance > 0.000001 ? differenceZ / distance : 0;
        const separation = (diameter - distance) / 2;
        left.x += normalX * separation;
        left.z += normalZ * separation;
        right.x -= normalX * separation;
        right.z -= normalZ * separation;
        const incomingSpeed = Math.max(Math.abs(left.speed), Math.abs(right.speed));
        if (incomingSpeed <= 1) continue;
        const velocity = (k: KartState) => [Math.sin(k.travelHeading) * k.speed, Math.cos(k.travelHeading) * k.speed];
        const [lvx, lvz] = velocity(left), [rvx, rvz] = velocity(right);
        const leftNormal = lvx * normalX + lvz * normalZ, rightNormal = rvx * normalX + rvz * normalZ;
        const closing = rightNormal - leftNormal;
        // Equal karts share the normal velocity and keep their tangential speed; strong closings lose more and stagger.
        const crash = closing >= KART_TUNING.crashClosingSpeed;
        {
          if (closing <= .05 || pass > 0) continue;
          const shared = (leftNormal + rightNormal) / 2, shove = Math.min(crash ? 2.6 : 1.4, closing * (crash ? .28 : .4) + .3);
          for (const [kart, vx, vz, own, sign] of [[left, lvx, lvz, leftNormal, 1], [right, rvx, rvz, rightNormal, -1]] as const) {
            const nx = vx + (shared - own) * normalX, nz = vz + (shared - own) * normalZ;
            const forward = nx * Math.sin(kart.travelHeading) + nz * Math.cos(kart.travelHeading);
            kart.speed = Math.sign(forward || 1) * Math.hypot(nx, nz) * (crash ? .7 : .96);
            if (Math.abs(kart.speed) > .5) kart.travelHeading = Math.atan2(nx * Math.sign(kart.speed), nz * Math.sign(kart.speed));
            kart.impactVelocityX += normalX * shove * sign; kart.impactVelocityZ += normalZ * shove * sign;
            kart.scrapeRemaining = .25; kart.scrapeKind = 'kart';
            if (closing > 3.5) { kart.drifting = false; kart.driftCharge = 0; kart.driftDirection = 0; }
            if (crash) { kart.turboRemaining = 0; kart.impactRemaining = KART_TUNING.impactDuration; kart.impactKind = 'kart'; }
          }
        }
      }
    }
    for (const kart of resolved) {
      const projected = project(kart.x, kart.z);
      if (projected.x !== kart.x || projected.z !== kart.z) corrected = true;
      kart.x = projected.x;
      kart.z = projected.z;
    }
    if (!corrected) break;
  }
  return resolved;
}
