import assert from 'node:assert/strict';
import test from 'node:test';
import { InputHub, primaryKey, rebind, resetBindings, exportBindings, importBindings, DEFAULT_BINDINGS } from '../src/input.ts';

test('rebinding moves a key to the new action, keeps arrows and refuses reserved keys', () => {
  try {
    assert.equal(primaryKey('item'), 'KeyE');
    assert.ok(rebind('item', 'KeyJ'));
    assert.equal(primaryKey('item'), 'KeyJ');
    assert.ok(rebind('hopDrift', 'KeyJ'), 'a key used elsewhere is reassigned');
    assert.equal(primaryKey('hopDrift'), 'KeyJ'); assert.equal(primaryKey('item'), undefined);
    assert.equal(rebind('accelerate', 'Escape'), false);
    assert.equal(exportBindings().ArrowUp, 'accelerate');
    const saved = exportBindings(); resetBindings(); assert.equal(primaryKey('item'), 'KeyE');
    importBindings(saved); assert.equal(primaryKey('hopDrift'), 'KeyJ');
    importBindings({ KeyZ: 'not-an-action' }); assert.equal(primaryKey('hopDrift'), 'KeyJ', 'invalid saves are ignored');
  } finally { resetBindings(); }
  assert.deepEqual(exportBindings(), { ...DEFAULT_BINDINGS });
});

test('analog gamepad axes override weaker digital input', () => {
  const hub = new InputHub();
  hub.setAnalog(.6, -.4);
  assert.deepEqual([hub.read().throttle, hub.read().steering], [.6, -.4]);
  hub.setAction('k', 'steerRight', true);
  assert.equal(hub.read().steering, 1);
  hub.reset(); assert.equal(hub.read().throttle, 0);
});
