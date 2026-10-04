import assert from 'node:assert/strict';
import test from 'node:test';
import { Matrix, Quaternion, Vector3 } from '@babylonjs/core/Maths/math.vector.js';
import { armGripReach } from '../src/kart-visuals.ts';

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
