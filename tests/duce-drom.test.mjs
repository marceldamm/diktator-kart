import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceKart, resolveKartContacts } from '../src/kart-model.ts';
import { TRACKS } from '../src/track-layout.ts';
import * as layout from '../src/track-layout.ts';
import { TRACK, selectTrack, trackPoint, trackProgress, projectTrack, gridKart, botInput, createRaceProgress, advanceRace, trackHeightAt, elevationAt, inShortcut, shortcutPoint, SHORTCUT_LENGTH, hazardAt, recoverKart, atRampLip } from '../src/track.ts';
import { createItems } from '../src/items.ts';
import * as trackModule from '../src/track.ts';

// The test runner shares module state between files: every test switches to the Duce-Drom and back.
const onRome = (fn) => () => { selectTrack('duce-drom'); try { fn(); } finally { selectTrack('stadionring'); } };

test('Duce-Drom is its own circuit: different route, length and features from the Stadionring', onRome(() => {
  assert.equal(TRACK.id, 'duce-drom');
  assert.equal(layout.TRACK_INFO.city, 'Rom');
  assert.ok(TRACK.length > 1150 && TRACK.length < 1350, `length ${TRACK.length}`);
  const berlin = TRACKS.stadionring.controlPoints;
  assert.notDeepEqual(layout.TRACK_CONTROL_POINTS, berlin);
  assert.equal(layout.CANAL_LENGTH, 0);
  assert.equal(layout.HAZARDS.length, 1);
  assert.equal(Math.max(...layout.ELEVATION.map(([, h]) => h)), 6);
}));

test('Duce-Drom progress is continuous and barriers contain karts except at the open Tiber quay and alley', onRome(() => {
  for (let s = 0; s < TRACK.length; s += .5) {
    const p = trackPoint(s), actual = trackProgress(p.x, p.z);
    assert.ok(Math.abs(actual - s) < .001, `s=${s} actual=${actual}`);
    for (const lane of [-10, 10]) {
      const outside = trackPoint(s, lane);
      if (inShortcut(outside.x, outside.z) || (lane > 0 && layout.HAZARDS.some(h => s >= h.from - 6 && s <= h.to + 6))) continue;
      const safe = projectTrack(outside.x, outside.z);
      assert.equal(safe.kind, 'boundary', `s=${s} lane=${lane}`);
      assert.equal(projectTrack(safe.x, safe.z).kind, null);
    }
  }
}));

test('Duce-Drom hill: serpentine climbs to a 6 m Belvedere plateau with a take-off ramp before the descent', onRome(() => {
  assert.equal(elevationAt(300), 0);
  assert.ok(elevationAt(530) > 2 && elevationAt(530) < 6);
  assert.equal(elevationAt(620), 6);
  const lip = trackPoint(layout.RAMP_LIPS[0] - .5);
  assert.ok(atRampLip(lip.x, lip.z));
  assert.ok(trackHeightAt(lip.x, lip.z) > 6.8, 'ramp sits on top of the plateau');
  assert.ok(elevationAt(700) < 6 && elevationAt(745) === 0);
}));

test('Duce-Drom: five bots finish three laps over the hill with the shared controller', onRome(() => {
  let states = Array.from({ length: 5 }, (_, i) => gridKart(i + 1));
  const races = states.map(createRaceProgress);
  for (let step = 0; step < 60 * 270 * TRACK.length / 891; step++) {
    states = states.map((s, i) => advanceKart(s, botInput(s, i + 1, states), 1 / 60, projectTrack, trackHeightAt));
    states = resolveKartContacts(states, projectTrack);
    states = states.map((s) => hazardAt(s.x, s.z) ? recoverKart(s, states) : s);
    states.forEach((s, i) => { advanceRace(races[i], s, step / 60); assert.ok(Number.isFinite(s.x + s.z + s.speed)); });
  }
  assert.ok(races.every(r => r.finished), JSON.stringify(races.map(r => r.distance)));
}));

test('Duce-Drom Stallgasse shortcut is open, shorter than the Meta-Kehre and used by the designated bot', onRome(() => {
  let last = -Infinity;
  for (let u = 0; u <= SHORTCUT_LENGTH; u += .5) {
    const p = shortcutPoint(u); assert.equal(projectTrack(p.x, p.z).kind, null, `blocked at ${u}`);
    const s = trackProgress(p.x, p.z); assert.ok(s >= last - .5, `progress went back at ${u}`); last = s;
  }
  assert.ok(SHORTCUT_LENGTH < (layout.SHORTCUT.to - layout.SHORTCUT.from) * .7, `alley ${SHORTCUT_LENGTH} vs ${layout.SHORTCUT.to - layout.SHORTCUT.from}`);
  let state = gridKart(3), sawAlley = false; const race = createRaceProgress(state);
  for (let step = 0; step < 60 * 270 * TRACK.length / 891; step++) {
    state = advanceKart(state, botInput(state, 3, [state]), 1 / 60, projectTrack, trackHeightAt);
    sawAlley ||= inShortcut(state.x, state.z);
    advanceRace(race, state, step / 60);
  }
  assert.ok(sawAlley); assert.ok(race.finished);
}));

test('switching circuits rebuilds item boxes and restores the Stadionring exactly', () => {
  const berlinLength = TRACK.length, berlinBoxes = createItems(6).boxes.map(b => [b.x, b.z]);
  selectTrack('duce-drom');
  const romeBoxes = createItems(6).boxes.map(b => [b.x, b.z]);
  assert.notDeepEqual(romeBoxes, berlinBoxes);
  selectTrack('stadionring');
  assert.equal(TRACK.length, berlinLength);
  assert.deepEqual(createItems(6).boxes.map(b => [b.x, b.z]), berlinBoxes);
});

test('rival styles change visible choices only: style shortcut users take the alley, grip drivers never drift', () => {
  const { BOT_STYLES, setBotStyles } = trackModule;
  try {
    setBotStyles([undefined, BOT_STYLES[2], BOT_STYLES[1]]);
    let a = gridKart(1), b = gridKart(2), sawAlley = false, drifted = false;
    for (let step = 0; step < 60 * 140; step++) {
      a = advanceKart(a, botInput(a, 1, [a]), 1 / 60, projectTrack); b = advanceKart(b, botInput(b, 2, [b]), 1 / 60, projectTrack);
      sawAlley ||= inShortcut(a.x, a.z); drifted ||= b.drifting;
    }
    assert.ok(sawAlley, 'Mussolini style uses the shortcut'); assert.equal(drifted, false, 'Stalin style keeps grip');
    for (const style of BOT_STYLES) assert.deepEqual(Object.keys(style).sort(), ['drift', 'itemPatience', 'label', 'lane', 'pass', 'shortcut'], 'no speed or grip field');
  } finally { setBotStyles([]); }
});

test('Duce-Drom park lawns stay clear of the road, kerbs and promenades', onRome(() => {
  const clear = TRACK.halfWidth + 1.45 + layout.LANDMARKS.promenade + .5;
  for (const p of TRACK.samples) for (const [x0, z0, x1, z1] of layout.LANDMARKS.lawns) {
    const dx = Math.max(x0 - p.x, 0, p.x - x1), dz = Math.max(z0 - p.z, 0, p.z - z1);
    assert.ok(Math.hypot(dx, dz) > clear, `lawn ${[x0, z0, x1, z1]} reaches the road at s=${p.s.toFixed(0)}`);
  }
}));
