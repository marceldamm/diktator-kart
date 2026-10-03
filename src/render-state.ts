import type { KartState } from './kart-model';

/** Render between completed fixed steps. The physics state is never modified. */
export function interpolateKart(previous: KartState, current: KartState, alpha: number): KartState {
  // Recovery/teleport must snap, rather than sweep through walls and other karts.
  if (Math.hypot(current.x - previous.x, current.z - previous.z) > 3) return current;
  const t = Math.max(0, Math.min(1, alpha));
  const lerp = (a: number, b: number) => a + (b - a) * t;
  const angle = (a: number, b: number) => a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * t;
  return {
    ...current,
    x: lerp(previous.x, current.x), z: lerp(previous.z, current.z),
    heading: angle(previous.heading, current.heading), travelHeading: angle(previous.travelHeading, current.travelHeading),
    height: lerp(previous.height, current.height), speed: lerp(previous.speed, current.speed),
    suspensionOffset: lerp(previous.suspensionOffset, current.suspensionOffset),
    suspensionVelocity: lerp(previous.suspensionVelocity, current.suspensionVelocity),
    bodyPitch: lerp(previous.bodyPitch, current.bodyPitch), bodyRoll: lerp(previous.bodyRoll, current.bodyRoll),
    steer: lerp(previous.steer, current.steer), yawRate: lerp(previous.yawRate, current.yawRate),
    wheelGroundHeights: previous.wheelGroundHeights.map((height, i) => lerp(height, current.wheelGroundHeights[i])) as KartState['wheelGroundHeights'],
  };
}
