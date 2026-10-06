import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { CAST, CAST_PARTS, DRIVER_HEAD_SCALE } from '../src/cast.ts';

const glb = await readFile(new URL('../public/assets/models/hero-kart.glb', import.meta.url));
const glbJsonLength = glb.readUInt32LE(12);
const glbDocument = JSON.parse(glb.toString('utf8', 20, 20 + glbJsonLength));
const glbNodeNames = new Set(glbDocument.nodes.map(({ name }) => name));

test('the six current drivers keep distinct kart and face variants with deliberate cap assignments', () => {
  assert.deepEqual(DRIVER_HEAD_SCALE, [0.82, 0.79, 0.77]);
  assert.equal(CAST.length, 6);
  assert.equal(new Set(CAST.map(({ body }) => body)).size, CAST.length, 'each driver retains an individual kart silhouette');
  assert.equal(new Set(CAST.map(({ faceStyle }) => faceStyle)).size, CAST.length, 'each driver has an individually sculpted head variant');
  const byName = Object.fromEntries(CAST.map((member) => [member.name, member]));
  // Redesign 06.10.2026: the Hitler quality anchor shows the bare side-parted hair and a compact, nose-wide brush moustache.
  assert.equal(byName.Hitler.hat, 'none');
  assert.equal(byName.Hitler.body, 'grandprix');
  assert.ok(byName.Hitler.face.includes('hitler-tache'), 'Hitler keeps the compact moustache in his active face parts');
  assert.ok(CAST_PARTS.includes('hitler-tache'), 'the runtime roster can enable the Hitler-specific moustache');
  const toothbrushNode = glbDocument.nodes.find(({ name }) => name.startsWith('cast-hitler-tache /'));
  assert.ok(toothbrushNode?.mesh !== undefined, 'the exported Hitler moustache retains visible mesh geometry');
  const toothbrushPosition = glbDocument.accessors[glbDocument.meshes[toothbrushNode.mesh].primitives[0].attributes.POSITION];
  const positionNormalization = toothbrushPosition.normalized ? 32767 : 1;
  const toothbrushWidth = (toothbrushPosition.max[0] - toothbrushPosition.min[0]) * toothbrushNode.scale[0] / positionNormalization;
  assert.ok(toothbrushWidth > .07 && toothbrushWidth < .11, `the square-cut brush stays about as wide as the nose: ${toothbrushWidth}`);
  assert.ok(toothbrushNode.translation[2] < -.33, 'the moustache sits on the upper lip, in front of the face surface (~.32), after glTF axis conversion');
  assert.equal(byName.Stalin.hat, 'stalin-cap');
  assert.ok(CAST_PARTS.includes('stalin-cap'), 'runtime roster can enable Stalin’s tailored cap');
  const stalinCapCrown = glbDocument.nodes.find(({ name }) => name.startsWith('cast-stalin-cap / Hat cloth'));
  assert.ok(stalinCapCrown?.mesh !== undefined, 'Stalin’s tailored cap crown remains in the runtime GLB');
  const capPosition = glbDocument.accessors[glbDocument.meshes[stalinCapCrown.mesh].primitives[0].attributes.POSITION];
  const capNormalization = capPosition.normalized ? 32767 : 1;
  const capDepth = (capPosition.max[2] - capPosition.min[2]) * stalinCapCrown.scale[2] / capNormalization;
  assert.ok(capDepth > .32, 'Stalin’s tailored cap retains a full front-to-back crown rather than an upright thin plate');
  assert.equal(byName.Mussolini.hat, 'peaked');
  assert.equal(byName.Mao.hat, 'octagonal');
  assert.equal(byName['Kim Jong-un'].hat, 'none');
  assert.equal(byName.Castro.hat, 'patrol');
  assert.ok(byName.Stalin.face.includes('stalinmouth'), 'Stalin keeps a separately visible mouth below his walrus moustache');
  assert.ok(CAST_PARTS.includes('stalinmouth'), 'the runtime roster can enable the Stalin-specific mouth');
  assert.ok(byName.Stalin.face.includes('stalin-nose'), 'Stalin has a dedicated, modeled nasal bridge rather than the shared generic nose');
  assert.ok(CAST_PARTS.includes('stalin-nose'), 'the runtime roster can enable Stalin’s independent nose assembly');
  assert.ok([...glbNodeNames].some((name) => name.startsWith('cast-stalin-nose /')), 'the dedicated nose assembly is present in the exported runtime model');
  assert.ok(byName.Stalin.face.includes('stalin-hairline'), 'Stalin keeps side hair beneath the cap without enabling top hair through its crown');
  assert.ok(!byName.Stalin.face.includes('swept'), 'the fitted cap is not crossed by the separate swept-back top hair');
  assert.ok(CAST_PARTS.includes('stalin-hairline'), 'the runtime roster can enable the cap-compatible temple hair');
  assert.ok(glbNodeNames.has('cast-stalin-hairline / Hair and leather helmet'), 'the cap-compatible side hair is present in the optimized export');
  assert.ok(byName.Stalin.faceStyle === 'stalin', 'the individually sculpted jaw profile remains assigned to Stalin only');
  assert.ok(byName.Stalin.face.includes('stalin-tunic'), 'Stalin has a tailored, high-collar tunic variant');
  assert.ok([0, 1, 2, 3].every((i) => glbNodeNames.has(`wheelStyle-limousine-${i}`)), 'the custom saloon wheel detail follows all four spinning wheel pivots');
  assert.ok([...glbNodeNames].some((name) => name.startsWith('cast-stalin-cap /')), 'the dedicated, uninsigniaed Stalin cap mesh is present in the runtime model');
  assert.ok(byName.Stalin.uniform.toLowerCase() !== '#e2dccb', 'Stalin no longer wears the generic cream parade uniform');
  assert.ok(byName.Mussolini.face.includes('uniformbuttons') && byName.Mussolini.face.includes('uniformcollar'), 'the reusable details remain active for the other roster entries');
  for (const genericDetail of ['sash', 'uniformbuttons', 'medals', 'epaulettes', 'collartabs']) {
    assert.ok(!byName.Stalin.face.includes(genericDetail), `Stalin does not use generic parade detail: ${genericDetail}`);
  }
  for (const member of CAST) for (const part of member.face) assert.ok(CAST_PARTS.includes(part), `${member.name} references registered art part ${part}`);
});

test('Stalins touring windscreen keeps transparent glass inside only the limousine body variant', () => {
  const glassMaterial = glbDocument.materials.find(({ name }) => name === 'Limousine touring glass');
  assert.ok(glassMaterial, 'the custom screen retains its own material');
  assert.equal(glassMaterial.alphaMode, 'BLEND', 'the runtime GLB preserves glass transparency');
  assert.ok((glassMaterial.pbrMetallicRoughness?.baseColorFactor?.[3] ?? 1) < .3, 'the glass remains lightly tinted');

  const parent = new Map();
  glbDocument.nodes.forEach((node, index) => node.children?.forEach((child) => parent.set(child, index)));
  const glassNodeIndex = glbDocument.nodes.findIndex(({ name }) => name === 'body-limousine / Limousine touring glass');
  assert.notEqual(glassNodeIndex, -1, 'the pane must be present in the exported scene');
  let ancestor = parent.get(glassNodeIndex);
  const ancestors = new Set();
  while (ancestor !== undefined) {
    ancestors.add(glbDocument.nodes[ancestor].name);
    ancestor = parent.get(ancestor);
  }
  assert.ok(ancestors.has('body-limousine'), 'the screen is switched with the Stalin limousine, not the shared kart chassis');
});

test('seat upholstery details stay flat and non-metallic instead of reading as loose rods', () => {
  assert.ok(![...glbNodeNames].some((name) => /Seat stitching/.test(name)), 'the floating gold seat rods are absent from the runtime model');
  const seamNode = glbDocument.nodes.find(({ name }) => name.endsWith('Seat upholstery thread'));
  assert.ok(seamNode?.mesh !== undefined, 'subtle upholstery seams remain in the optimized model');
  const seamMaterial = glbDocument.materials.find(({ name }) => name === 'Seat upholstery thread');
  assert.ok(seamMaterial, 'seat seams use their dedicated cloth-thread material');
  assert.ok((seamMaterial.pbrMetallicRoughness?.metallicFactor ?? 0) < .05, 'the thread is not metallic trim');
  assert.ok((seamMaterial.pbrMetallicRoughness?.roughnessFactor ?? 0) >= .9, 'the thread has a matte upholstery finish');
  const position = glbDocument.accessors[glbDocument.meshes[seamNode.mesh].primitives[0].attributes.POSITION];
  const depth = (position.max[2] - position.min[2]) * seamNode.scale[2] / (position.normalized ? 32767 : 1);
  assert.ok(depth < .01, `upholstery thread stays under 1 cm thick (got ${depth.toFixed(4)} m)`);
});
