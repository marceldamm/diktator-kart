import { Quaternion, Vector3 } from '@babylonjs/core/Maths/math.vector.js';

/** Roll angle for the body and its wheels during the one-turn jump trick. */
export function airTrickRoll(trick: boolean | undefined, jumpRemaining: number | undefined, jumpDuration: number | undefined): number {
  if (!trick || jumpRemaining === undefined || jumpRemaining <= 0 || !jumpDuration || jumpDuration <= 0) return 0;
  const progress = Math.max(0, Math.min(1, 1 - jumpRemaining / jumpDuration));
  return progress * Math.PI * 2;
}

/** Rotate an arm toward a moving wheel grip and return the uniform reach needed to land exactly on it. */
export function armGripReach(rest: Vector3, target: Vector3, rotation: Quaternion): number {
  const restLength = rest.length();
  const targetLength = target.length();
  if (restLength < 1e-6 || targetLength < 1e-6) { rotation.set(0, 0, 0, 1); return 1; }
  Quaternion.FromUnitVectorsToRef(rest.scale(1 / restLength), target.scale(1 / targetLength), rotation);
  return targetLength / restLength;
}
