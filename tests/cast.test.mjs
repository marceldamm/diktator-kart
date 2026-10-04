import assert from 'node:assert/strict';
import test from 'node:test';
import { CAST, CAST_PARTS } from '../src/cast.ts';

test('the six current drivers keep distinct kart and face variants with deliberate cap assignments', () => {
  assert.equal(CAST.length, 6);
  assert.equal(new Set(CAST.map(({ body }) => body)).size, CAST.length, 'each driver retains an individual kart silhouette');
  assert.equal(new Set(CAST.map(({ faceStyle }) => faceStyle)).size, CAST.length, 'each driver has an individually sculpted head variant');
  const byName = Object.fromEntries(CAST.map((member) => [member.name, member]));
  assert.equal(byName.Hitler.hat, 'peaked');
  assert.equal(byName.Stalin.hat, 'peaked');
  assert.equal(byName.Mussolini.hat, 'peaked');
  assert.equal(byName.Mao.hat, 'octagonal');
  assert.equal(byName['Kim Jong-un'].hat, 'none');
  assert.equal(byName.Castro.hat, 'patrol');
  assert.ok(byName.Stalin.face.includes('stalinmouth'), 'Stalin keeps a separately visible mouth below his walrus moustache');
  assert.ok(CAST_PARTS.includes('stalinmouth'), 'the runtime roster can enable the Stalin-specific mouth');
  assert.ok(byName.Stalin.face.includes('stalin-tunic'), 'Stalin has a tailored, high-collar tunic variant');
  assert.ok(byName.Stalin.uniform.toLowerCase() !== '#e2dccb', 'Stalin no longer wears the generic cream parade uniform');
  assert.ok(byName.Hitler.face.includes('uniformbuttons') && byName.Hitler.face.includes('uniformcollar'), 'the reusable details remain active for the other roster entries');
  for (const genericDetail of ['sash', 'uniformbuttons', 'medals', 'epaulettes', 'collartabs']) {
    assert.ok(!byName.Stalin.face.includes(genericDetail), `Stalin does not use generic parade detail: ${genericDetail}`);
  }
  for (const member of CAST) for (const part of member.face) assert.ok(CAST_PARTS.includes(part), `${member.name} references registered art part ${part}`);
});
