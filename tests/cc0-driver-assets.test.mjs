import test from 'node:test';
import assert from 'node:assert/strict';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';

test('Hitler CC0 export retains cockpit head and nonconstant skin tint in COLOR_0', async () => {
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  const doc = await io.read(new URL('../public/assets/models/cc0-driver-hitler.glb', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
  const nodes = doc.getRoot().listNodes();
  assert.ok(nodes.some(n => n.getName() === 'cc0-driver-hitler'));
  const head = nodes.find(n => n.getName() === 'Pilot head');
  assert.ok(head?.getMesh(), 'separate head must remain available for cockpit hiding');
  for (const primitive of head.getMesh().listPrimitives()) {
    const position = primitive.getAttribute('POSITION');
    const colour = primitive.getAttribute('COLOR_0');
    assert.ok(position.getCount() > 100);
    assert.ok(colour, 'age tint must survive Blender export as Babylon vertex colours');
    assert.equal(colour.getCount(), position.getCount());
    const values = [...colour.getArray()];
    assert.ok(Math.min(...values) < Math.max(...values), 'constant white drops the actual skin tint');
    assert.ok([...position.getArray()].every(Number.isFinite));
  }
  assert.ok(nodes.some(n => n.getName() === 'Pilot moustache'));
  assert.ok(!nodes.some(n => n.getName() === 'Pilot forelock'), 'the historical side part must not add a separate forehead curl');
  assert.ok(nodes.some(n => n.getName() === 'Pilot suit'));
  assert.ok(nodes.some(n => n.getName() === 'Pilot leather collar'));
  assert.ok(nodes.some(n => n.getName() === 'Pilot leather harness'));
  assert.ok(nodes.some(n => n.getName() === 'Pilot leather belt'));
  // R70: the upper forehead crease lies under the swept fringe and is dropped; the rest stay.
  assert.ok(nodes.filter(n => /^Pilot face crease [1-6]$/.test(n.getName())).length >= 5);
  assert.ok(['Pilot face crease 7', 'Pilot face crease 8'].every(name => nodes.some(n => n.getName() === name)), 'nasolabial creases');
  // R68: the toothbrush moustache must be a readable block, not the former 4 mm sliver.
  const moustache = nodes.find(n => n.getName() === 'Pilot moustache').getMesh().listPrimitives()[0].getAttribute('POSITION');
  const ys = []; for (let i = 0; i < moustache.getCount(); i++) ys.push(moustache.getElement(i, [])[1]);
  assert.ok(Math.max(...ys) - Math.min(...ys) > .012, 'moustache height');
  assert.ok(doc.getRoot().listMaterials().some(m => m.getName() === 'Black leather'));
  assert.ok(!nodes.some(n => n.getName().startsWith('QA ')), 'studio lights/cameras must not ship in the driver GLB');
});

test('CC0 drivers ship the slim arm rig the steering IK drives', async () => {
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  for (const id of ['hitler', 'stalin', 'mussolini', 'mao', 'kim', 'castro']) {
    const doc = await io.read(new URL(`../public/assets/models/cc0-driver-${id}.glb`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
    const skins = doc.getRoot().listSkins();
    assert.ok(skins.length >= 1, `${id}: skinned body`);
    const joints = skins[0].listJoints().map(j => j.getName());
    for (const bone of ['upperarm_l', 'lowerarm_l', 'hand_l', 'upperarm_r', 'lowerarm_r', 'hand_r']) assert.ok(joints.includes(bone), `${id}: ${bone}`);
    assert.ok(joints.length <= 12, `${id}: ${joints.length} joints, the rig should stay slim`);
  }
});
