import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// Redesign 06.10.2026: the modular city kit (art-source/build_city_kit.py) replaces stadium-world.glb.
const assetPath = new URL('../public/assets/models/city-kit.glb', import.meta.url);

function readGlbJson(path) {
  const bytes = fs.readFileSync(path);
  assert.equal(bytes.toString('ascii', 0, 4), 'glTF', 'expected a binary glTF asset');
  assert.equal(bytes.readUInt32LE(4), 2, 'expected GLB version 2');
  assert.equal(bytes.readUInt32LE(8), bytes.length, 'GLB header length must match the file');
  for (let offset = 12; offset + 8 <= bytes.length;) {
    const length = bytes.readUInt32LE(offset);
    const type = bytes.readUInt32LE(offset + 4);
    if (type === 0x4e4f534a) return JSON.parse(bytes.toString('utf8', offset + 8, offset + 8 + length));
    offset += 8 + length;
  }
  throw new Error('GLB JSON chunk missing');
}

test('city kit exposes every module the runtime city places, one mesh per shared material', () => {
  const document = readGlbJson(assetPath);
  const nodes = new Set(document.nodes.map(node => node.name));
  for (const module of ['kit-house-a', 'kit-house-b', 'kit-house-c', 'kit-house-d', 'kit-corner', 'kit-palace', 'kit-cathedral', 'kit-column',
    'kit-grandstand', 'kit-gate', 'kit-finish', 'kit-bridge', 'kit-quay', 'kit-sky-a', 'kit-sky-b', 'kit-sky-c', 'kit-lamp', 'kit-bench',
    'kit-litfass', 'kit-flag', 'kit-kiosk', 'kit-urn', 'kit-hedge', 'kit-linden', 'kit-cypress', 'kit-fountain', 'kit-statue',
    // Duce-Drom (Rome) modules
    'kit-insula-a', 'kit-insula-b', 'kit-insula-c', 'kit-balcony-palace', 'kit-arch', 'kit-obelisk', 'kit-pine', 'kit-pine-b', 'kit-aqueduct', 'kit-ruin',
    // Kulturrevolutions-Schleife (Peking) modules
    'kit-cn-house-a', 'kit-cn-house-b', 'kit-cn-house-c', 'kit-cn-hall', 'kit-cn-gate', 'kit-pagoda', 'kit-cn-wall', 'kit-loudspeaker', 'kit-rulebook', 'kit-lantern-span']) {
    assert.ok(nodes.has(module), `expected module root ${module}`);
    assert.ok([...nodes].some(name => name.startsWith(`${module}|`)), `expected material meshes under ${module}`);
  }
  const materials = new Set(document.materials.map(m => m.name));
  for (const name of ['Kit plaster', 'Kit stone limestone', 'Kit roof copper patina', 'Kit window glass', 'Kit banner cloth', 'Kit lamp glass'])
    assert.ok(materials.has(name), `expected shared material ${name}`);
  // Peking (10.10.2026) added glazed tile, lacquer and lantern silk to the palette.
  assert.ok(document.materials.length <= 27, `the shared art system keeps a small material palette (${document.materials.length})`);
  const colored = document.meshes.filter(mesh => mesh.primitives.some(p => 'COLOR_0' in p.attributes));
  assert.ok(colored.length / document.meshes.length > .9, 'vertex colours carry grime, stripes and tonal variation');
});
