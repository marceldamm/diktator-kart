import assert from 'node:assert/strict';
import test from 'node:test';
import { attachPointerHold, InputHub } from '../src/input.ts';

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

test('item HUD pointer holds share the shield action and taps survive between frames', () => {
  const input = new InputHub();
  const button = new EventTarget();
  const detach = attachPointerHold(input, button, 'item', 'test-item');
  const pointer = (type, id) => {
    const event = new Event(type);
    Object.defineProperties(event, { button: { value: 0 }, pointerId: { value: id } });
    button.dispatchEvent(event);
  };

  pointer('pointerdown', 4);
  assert.equal(input.isDown('item'), true);
  assert.ok(input.read().pressed.has('item'));
  pointer('pointerup', 4);
  assert.equal(input.isDown('item'), false);

  pointer('pointerdown', 5);
  pointer('pointerup', 5);
  const tap = input.read();
  assert.equal(input.isDown('item'), false);
  assert.ok(tap.pressed.has('item'), 'a touch tap between frames remains visible to the throw logic');

  pointer('pointerdown', 6);
  pointer('pointercancel', 6);
  assert.equal(input.isDown('item'), false, 'cancelled touch cannot leave the shield stuck on');
  detach();
});
