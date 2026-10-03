import assert from 'node:assert/strict';
import test from 'node:test';
import { InputHub } from '../src/input.ts';

test('a tap between frames is visible once and actions remain separate', () => {
  const input = new InputHub();
  input.setAction('keyboard:KeyW', 'accelerate', true);
  input.setAction('keyboard:KeyW', 'accelerate', false);
  input.setAction('keyboard:KeyQ', 'special', true);
  input.setAction('keyboard:KeyQ', 'special', false);
  const first = input.read();
  assert.equal(first.throttle, 1);
  assert.ok(first.pressed.has('special'));
  assert.ok(!first.pressed.has('item'));
  assert.equal(input.read().throttle, 0);
  assert.equal(input.read().pressed.size, 0);
});
