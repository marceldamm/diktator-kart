import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceKart, resolveKartContacts } from '../src/kart-model.ts';
import * as layout from '../src/track-layout.ts';
import { TRACK, selectTrack, trackPoint, trackProgress, projectTrack, gridKart, botInput, createRaceProgress, advanceRace, trackHeightAt, elevationAt, inShortcut, shortcutPoint, SHORTCUT_LENGTH, hazardAt, recoverKart, atRampLip } from '../src/track.ts';

const onHavana = (fn) => () => { selectTrack('havanna'); try { fn(); } finally { selectTrack('stadionring'); } };

test('Havanna-Revolutionsring: own route along the sea, continuous progress, barriers except quay and alley', onHavana(() => {
  assert.equal(TRACK.id, 'havanna'); assert.equal(layout.TRACK_INFO.theme, 'havana');
  assert.ok(TRACK.length > 1350 && TRACK.length < 1480, `length ${TRACK.length}`);
  for (let s = 0; s < TRACK.length; s += .5) {
    const p = trackPoint(s), actual = trackProgress(p.x, p.z);
    assert.ok(Math.abs(actual - s) < .001, `s=${s} actual=${actual}`);
    for (const lane of [-10, 10]) {
      const outside = trackPoint(s, lane);
      if (inShortcut(outside.x, outside.z) || (lane > 0 && layout.HAZARDS.some(h => s >= h.from - 6 && s <= h.to + 6))) continue;
      assert.equal(projectTrack(outside.x, outside.z).kind, 'boundary', `s=${s} lane=${lane}`);
    }
  }
  // The open quay faces the sea: the water basin lies on the north (sea) side of the Malecón.
  const q = trackPoint((layout.HAZARDS[0].from + layout.HAZARDS[0].to) / 2, 10);
  assert.ok(q.z > trackPoint((layout.HAZARDS[0].from + layout.HAZARDS[0].to) / 2, 0).z);
  assert.ok(q.z < layout.RIVER.south, 'quay basin stays south of the sea wall');
}));

test('Havanna hill and jump, lawn clear of the road, five bots finish three laps', onHavana(() => {
  assert.equal(elevationAt(1128), 4);
  const lip = trackPoint(layout.RAMP_LIPS[0] - .5); assert.ok(atRampLip(lip.x, lip.z));
  const clear = TRACK.halfWidth + 1.45 + layout.LANDMARKS.promenade + .5;
  for (const p of TRACK.samples) for (const [x0, z0, x1, z1] of layout.LANDMARKS.lawns) {
    const dx = Math.max(x0 - p.x, 0, p.x - x1), dz = Math.max(z0 - p.z, 0, p.z - z1);
    assert.ok(Math.hypot(dx, dz) > clear, `lawn reaches the road at s=${p.s.toFixed(0)}`);
  }
  let states = Array.from({ length: 5 }, (_, i) => gridKart(i + 1));
  const races = states.map(createRaceProgress);
  for (let step = 0; step < 60 * 270 * TRACK.length / 891; step++) {
    states = states.map((s, i) => advanceKart(s, botInput(s, i + 1, states), 1 / 60, projectTrack, trackHeightAt));
    states = resolveKartContacts(states, projectTrack);
    states = states.map((s) => hazardAt(s.x, s.z) ? recoverKart(s, states) : s);
    states.forEach((s, i) => advanceRace(races[i], s, step / 60));
  }
  assert.ok(races.every(r => r.finished), JSON.stringify(races.map(r => r.distance | 0)));
}));

test('Havanna Zigarrenfabrik shortcut is open, monotonic and shorter', onHavana(() => {
  let last = -Infinity;
  for (let u = 0; u <= SHORTCUT_LENGTH; u += .5) {
    const p = shortcutPoint(u); assert.equal(projectTrack(p.x, p.z).kind, null, `blocked at ${u}`);
    const s = trackProgress(p.x, p.z); assert.ok(s >= last - .5, `progress went back at ${u}`); last = s;
  }
  assert.ok(SHORTCUT_LENGTH < layout.SHORTCUT.to - layout.SHORTCUT.from);
}));
