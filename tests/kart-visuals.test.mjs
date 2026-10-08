import assert from 'node:assert/strict';
import test from 'node:test';
import { Matrix, Quaternion, Vector3 } from '@babylonjs/core/Maths/math.vector.js';
import { armGripPose, armGripReach } from '../src/kart-visuals.ts';

test('both hands remain exactly at the moving wheel grip through full steering travel', () => {
  for (const side of [-1, 1]) {
    const rest = new Vector3(side * .22, .65, -.24);
    for (const angle of [-1.15, -.7, 0, .7, 1.15]) {
      const target = new Vector3(side * .2 * Math.cos(angle), .65 + side * .2 * Math.sin(angle), -.24);
      const rotation = new Quaternion();
      const stretch = armGripReach(rest, target, rotation);
      const matrix = new Matrix();
      rotation.toRotationMatrix(matrix);
      const reached = Vector3.TransformCoordinates(rest.scale(stretch), matrix);
      assert.ok(reached.subtract(target).length() < 1e-6, `side ${side}, angle ${angle}: ${reached} != ${target}`);
      assert.ok(stretch > .7 && stretch < 1.4, `unexpected arm stretch ${stretch}`);
    }
  }
});

test('mirrored hands keep their palm and fingers aligned with the turning wheel tangent', () => {
  for (const side of [-1, 1]) {
    const rest = new Vector3(side * .22, .65, -.24);
    const restUp = Vector3.Up();
    for (const angle of [-1.15, -.7, 0, .7, 1.15]) {
      const target = new Vector3(side * .2 * Math.cos(angle), .65 + side * .2 * Math.sin(angle), -.24);
      const targetUp = Vector3.Up().applyRotationQuaternion(Quaternion.RotationAxis(new Vector3(0, 0, 1), angle));
      const rotation = new Quaternion();
      const stretch = armGripPose(rest, target, restUp, targetUp, rotation);
      const reached = rest.scale(stretch).applyRotationQuaternion(rotation);
      assert.ok(reached.subtract(target).length() < 1e-6, `side ${side}, angle ${angle}: ${reached} != ${target}`);
      const targetDirection = target.clone().normalize();
      const alignedUp = restUp.applyRotationQuaternion(rotation);
      alignedUp.subtractInPlace(targetDirection.scale(Vector3.Dot(alignedUp, targetDirection))).normalize();
      const tangent = targetUp.clone();
      tangent.subtractInPlace(targetDirection.scale(Vector3.Dot(tangent, targetDirection))).normalize();
      assert.ok(alignedUp.subtract(tangent).length() < 1e-6, `hand tangent flipped for side ${side}, angle ${angle}`);
      assert.ok(stretch > .7 && stretch < 1.4, `unexpected arm stretch ${stretch}`);
    }
  }
});

test('two-bone elbow keeps both arm lengths and lets the wrist reach every grip on the turning rim', async () => {
  const { twoBoneElbow } = await import('../src/kart-visuals.ts');
  const shoulder = new Vector3(.2, 1.45, -.3), elbow = new Vector3(.32, 1.1, -.15), wrist = new Vector3(.21, 1.18, .1);
  const upper = Vector3.Distance(shoulder, elbow), lower = Vector3.Distance(elbow, wrist);
  for (const angle of [-1.1, -.6, 0, .6, 1.1]) {
    const target = new Vector3(.21 * Math.cos(angle), 1.18 + .21 * Math.sin(angle), .1);
    const e = twoBoneElbow(shoulder, elbow, wrist, target);
    assert.ok(Math.abs(Vector3.Distance(shoulder, e) - upper) < 1e-6);
    assert.ok(Math.abs(Vector3.Distance(e, target) - lower) < 1e-3, `angle ${angle}: wrist misses the rim`);
    assert.ok(e.x > .15, 'the elbow keeps bending outwards');
  }
  const far = twoBoneElbow(shoulder, elbow, wrist, new Vector3(.2, 1.45, 2));
  assert.ok(Math.abs(Vector3.Distance(shoulder, far) - upper) < 1e-6, 'unreachable target straightens without stretching');
});
