import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const assetPath = new URL('../public/assets/models/stadium-world.glb', import.meta.url);

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

test('stadium world runtime GLB includes the new storefront and rain-water details', () => {
  const document = readGlbJson(assetPath);
  const meshNames = new Set(document.meshes.map(mesh => mesh.name));
  for (const name of [
    'Eaves gutter',
    'Weathered timber window shutter',
    'Terracotta shop window planter',
    'Shop planter flower',
    'Shop blade sign enamel',
  ]) assert.ok(meshNames.has(name), `expected runtime mesh: ${name}`);

  assert.equal(document.meshes.length, 32, 'static city batching should keep one mesh per material group');
});
