import assert from 'node:assert/strict';
import test from 'node:test';
import { attachKeyboard, InputHub } from '../src/input.ts';

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

test('V is a forward-item modifier with E and only triggers the horn on its own', () => {
  const previousWindow = globalThis.window;
  const listeners = new Map();
  globalThis.window = {
    addEventListener: (name, listener) => listeners.set(name, listener),
    removeEventListener: (name) => listeners.delete(name),
  };
  try {
    const input = new InputHub();
    attachKeyboard(input);
    const key = (name, code) => listeners.get(name)({ code, preventDefault() {} });

    key('keydown', 'KeyE'); key('keydown', 'KeyV');
    key('keyup', 'KeyE'); key('keyup', 'KeyV');
    let frame = input.read();
    assert.ok(frame.pressed.has('itemForward'));
    assert.ok(!frame.pressed.has('horn'));

    key('keydown', 'KeyV'); key('keyup', 'KeyV');
    frame = input.read();
    assert.ok(frame.pressed.has('horn'));
    assert.ok(!frame.pressed.has('photo'));
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});

test('F remains the photo key and H selects backward item direction', () => {
  const previousWindow = globalThis.window;
  const listeners = new Map();
  globalThis.window = {
    addEventListener: (name, listener) => listeners.set(name, listener),
    removeEventListener: (name) => listeners.delete(name),
  };
  try {
    const input = new InputHub();
    attachKeyboard(input);
    const key = (name, code) => listeners.get(name)({ code, preventDefault() {} });
    key('keydown', 'KeyF'); key('keyup', 'KeyF');
    assert.ok(input.read().pressed.has('photo'));
    key('keydown', 'KeyE'); key('keydown', 'KeyH');
    assert.ok(input.isDown('itemBackward'));
    assert.ok(input.isDown('item'));
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});
