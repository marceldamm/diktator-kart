import { Matrix, Quaternion, Vector3 } from '@babylonjs/core/Maths/math.vector.js';

/** Roll angle for the body and its wheels during the one-turn jump trick. */
export function airTrickRoll(trick: boolean | undefined, jumpRemaining: number | undefined, jumpDuration: number | undefined): number {
  if (!trick || jumpRemaining === undefined || jumpRemaining <= 0 || !jumpDuration || jumpDuration <= 0) return 0;
  const progress = Math.max(0, Math.min(1, 1 - jumpRemaining / jumpDuration));
  return progress * Math.PI * 2;
}

/** Aim the arm at a moving grip while keeping the palm's up/tangent axis aligned to the wheel. */
export function armGripPose(rest: Vector3, target: Vector3, restUp: Vector3, targetUp: Vector3, rotation: Quaternion): number {
  const restLength = rest.length();
  const targetLength = target.length();
  if (restLength < 1e-6 || targetLength < 1e-6) { rotation.set(0, 0, 0, 1); return 1; }
  const restDirection = rest.scale(1 / restLength), targetDirection = target.scale(1 / targetLength);
  Quaternion.FromUnitVectorsToRef(restDirection, targetDirection, rotation);

  // Aligning only the shoulder-to-hand vector leaves an unconstrained roll around
  // the forearm. That roll turned the mirrored gloves palm-up/palm-down at wheel
  // steering angles. Remove the axial components, then add only the twist needed
  // to keep the fingers on the steering rim's tangent in both hands.
  const alignMatrix = new Matrix();
  rotation.toRotationMatrix(alignMatrix);
  const alignedUp = Vector3.TransformNormal(restUp, alignMatrix);
  alignedUp.subtractInPlace(targetDirection.scale(Vector3.Dot(alignedUp, targetDirection)));
  const desiredUp = targetUp.subtract(targetDirection.scale(Vector3.Dot(targetUp, targetDirection)));
  if (alignedUp.lengthSquared() > 1e-8 && desiredUp.lengthSquared() > 1e-8) {
    alignedUp.normalize(); desiredUp.normalize();
    const twistAngle = Math.atan2(Vector3.Dot(targetDirection, Vector3.Cross(alignedUp, desiredUp)), Vector3.Dot(alignedUp, desiredUp));
    const twist = Quaternion.RotationAxis(targetDirection, twistAngle);
    twist.multiplyToRef(rotation, rotation);
  }
  return targetLength / restLength;
}

/** Compatibility helper for callers that need position only; runtime grips use armGripPose. */
export function armGripReach(rest: Vector3, target: Vector3, rotation: Quaternion): number {
  return armGripPose(rest, target, Vector3.Up(), Vector3.Up(), rotation);
}
