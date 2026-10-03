export interface KartState {
  x: number;
  z: number;
  heading: number;
  travelHeading: number;
  speed: number;
  height: number;
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
// Order: front-left, front-right, rear-left, rear-right.
export const WHEEL_POSITIONS = [
  { x: -0.83, z: 0.68 }, { x: 0.83, z: 0.68 },
  { x: -0.83, z: -0.68 }, { x: 0.83, z: -0.68 },
] as const;
export const KART_TUNING = {
  acceleration: 10,
  braking: 16,
  reverseAcceleration: 6,
  maxForwardSpeed: 16,
  maxReverseSpeed: 5,
  steeringPerMetre: 0.12,
  maxYawRate: 1.5,
  coastDeceleration: 3.2,
  hopDuration: 0.42,
  hopHeight: 0.6,
  driftMinSpeed: 5,
  driftChargeTime: 0.7,
  driftYawMultiplier: 1.2,
  driftHeadingFollow: 0.55,
  normalHeadingFollow: 8,
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

function sampleWheelGround(x: number, z: number, heading: number): [number, number, number, number] {
  const cosine = Math.cos(heading);
  const sine = Math.sin(heading);
  return WHEEL_POSITIONS.map((wheel) => terrainHeightAt(
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
  };
}

function approachZero(value: number, amount: number): number {
  if (value > 0) return Math.max(0, value - amount);
  return Math.min(0, value + amount);
}

export function advanceKart(state: KartState, input: DriveInput, dt: number): KartState {
  const commandedDrive = Math.max(-1, Math.min(1, input.throttle));
  const drive = state.impactRemaining > 0 ? Math.min(0, commandedDrive) : commandedDrive;
  const steering = Math.max(-1, Math.min(1, input.steering));
  const held = input.hopDrift ?? false;
  let speed = state.speed;
  let turboRemaining = drive < 0 ? 0 : Math.max(0, state.turboRemaining - dt);

  if (drive > 0) {
    const cap = turboRemaining > 0 ? KART_TUNING.maxTurboSpeed : KART_TUNING.maxForwardSpeed;
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
  const height = hopRemaining > 0
    ? 4 * KART_TUNING.hopHeight * hopProgress * (1 - hopProgress)
    : 0;

  let drifting = state.drifting;
  let driftDirection = state.driftDirection;
  let driftCharge = state.driftCharge;
  if (drifting) {
    if (!held || speed < KART_TUNING.driftMinSpeed) {
      if (!held && drive >= 0 && driftCharge >= KART_TUNING.driftChargeTime && speed >= KART_TUNING.driftMinSpeed) {
        turboRemaining = KART_TUNING.turboDuration;
        speed = Math.min(KART_TUNING.maxTurboSpeed, speed + KART_TUNING.turboSpeedBonus);
      }
      drifting = false;
      driftDirection = 0;
      driftCharge = 0;
    } else if (steering * driftDirection >= 0.25) {
      driftCharge = Math.min(KART_TUNING.driftChargeTime, driftCharge + dt);
    } else {
      driftCharge = Math.max(0, driftCharge - dt * 0.5);
    }
  } else if (held && hopRemaining === 0 && speed >= KART_TUNING.driftMinSpeed && Math.abs(steering) >= 0.25) {
    drifting = true;
    driftDirection = Math.sign(steering);
    driftCharge = 0;
  }

  const yawRate = Math.max(-KART_TUNING.maxYawRate,
    Math.min(KART_TUNING.maxYawRate, speed * steering * KART_TUNING.steeringPerMetre * (drifting ? KART_TUNING.driftYawMultiplier : 1)));
  const heading = state.heading + yawRate * dt;
  const angleDifference = Math.atan2(Math.sin(heading - state.travelHeading), Math.cos(heading - state.travelHeading));
  const follow = (drifting ? KART_TUNING.driftHeadingFollow : KART_TUNING.normalHeadingFollow) * dt;
  const travelHeading = state.travelHeading + Math.max(-follow, Math.min(follow, angleDifference));
  const rawX = state.x + Math.sin(travelHeading) * speed * dt + state.impactVelocityX * dt;
  const rawZ = state.z + Math.cos(travelHeading) * speed * dt + state.impactVelocityZ * dt;
  const x = Math.max(-TEST_AREA_HALF_SIZE, Math.min(TEST_AREA_HALF_SIZE, rawX));
  const z = Math.max(-TEST_AREA_HALF_SIZE, Math.min(TEST_AREA_HALF_SIZE, rawZ));
  let impactRemaining = Math.max(0, state.impactRemaining - dt);
  const impactDecay = Math.exp(-KART_TUNING.impactVelocityDecay * dt);
  let impactVelocityX = state.impactVelocityX * impactDecay;
  let impactVelocityZ = state.impactVelocityZ * impactDecay;

  if (x !== rawX || z !== rawZ) {
    if (Math.abs(speed) > 1 && impactRemaining === 0) {
      const rebound = Math.min(KART_TUNING.impactReboundCap, Math.abs(speed) * 0.15 + 0.3);
      impactVelocityX = x !== rawX ? -Math.sign(rawX) * rebound : 0;
      impactVelocityZ = z !== rawZ ? -Math.sign(rawZ) * rebound : 0;
      impactRemaining = KART_TUNING.impactDuration;
    }
    speed = 0;
    turboRemaining = 0;
    drifting = false;
    driftCharge = 0;
    driftDirection = 0;
  }
  const grounded = hopRemaining === 0;
  const wheelGroundHeights = sampleWheelGround(x, z, heading);
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
  return { x, z, heading, travelHeading, speed, height, hopRemaining, drifting, driftDirection, driftCharge, turboRemaining,
    suspensionOffset, suspensionVelocity, bodyPitch, bodyRoll, wheelGroundHeights, grounded,
    impactRemaining, impactVelocityX, impactVelocityZ };
}
