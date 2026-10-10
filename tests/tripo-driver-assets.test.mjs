import test from 'node:test';
import assert from 'node:assert/strict';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';

test('all active Tripo drivers keep a separate cockpit head, complete arm rig and welded skin weights', async () => {
  await MeshoptDecoder.ready;
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
  for (const id of ['hitler', 'stalin', 'mussolini', 'mao', 'kim', 'castro']) {
    const doc = await io.read(new URL(`../public/assets/models/${id}-driver.glb`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
    const nodes = doc.getRoot().listNodes();
    assert.ok(nodes.find(n => n.getName() === 'Pilot head')?.getMesh(), `${id}: cockpit head`);
    const joints = doc.getRoot().listSkins().flatMap(s => s.listJoints().map(j => j.getName()));
    for (const name of ['Head', 'upperarm_l', 'lowerarm_l', 'hand_l', 'upperarm_r', 'lowerarm_r', 'hand_r']) assert.ok(joints.includes(name), `${id}: ${name}`);
    for (const node of nodes.filter(n => n.getMesh())) for (const p of node.getMesh().listPrimitives()) {
      const position = p.getAttribute('POSITION'), weights = p.getAttribute('WEIGHTS_0'), indices = p.getAttribute('JOINTS_0');
      assert.ok(weights && indices, `${id}: skinned surface`);
      const seams = new Map();
      for (let i = 0; i < position.getCount(); i++) {
        const xyz = position.getElement(i, []), w = weights.getElement(i, []), j = indices.getElement(i, []);
        assert.ok([...xyz, ...w].every(Number.isFinite), `${id}: finite geometry and weights`);
        assert.ok(Math.abs(w.reduce((a, b) => a + b, 0) - 1) < .025, `${id}: normalised weights`);
        const key = xyz.join(','), skin = new Map(j.map((bone, k) => [bone, w[k]]).filter(([, weight]) => weight > .001));
        const previous = seams.get(key);
        if (previous) for (const bone of new Set([...skin.keys(), ...previous.keys()])) {
          assert.ok(Math.abs((skin.get(bone) ?? 0) - (previous.get(bone) ?? 0)) < .035, `${id}: UV seam opens during skinning`);
        }
        else seams.set(key, skin);
      }
    }
  }
});
