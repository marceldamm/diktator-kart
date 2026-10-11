import assert from 'node:assert/strict';
import test from 'node:test';
import { TRACKS, isTrackId } from '../src/track-layout.ts';
import { TRACK, selectTrack, trackPoint, trackLocate, inShortcut, shortcutPoint, SHORTCUT_LENGTH, gridKart, botInput, advanceRace, createRaceProgress, projectTrack, elevationAt, atRampLip, shortcutElevationAt, policyJubelPatchAt, applyPolicyJubelDrag } from '../src/track.ts';
import { advanceKart } from '../src/kart-model.ts';

const withBeijing = (fn) => () => { selectTrack('beijing'); try { fn(); } finally { selectTrack('stadionring'); } };

test('Peking builds a closed clockwise loop with hutong shortcut, plateau and moat', withBeijing(() => {
  assert.equal(isTrackId('beijing'), true); assert.equal(TRACK.id, 'beijing'); assert.equal(TRACK.name, 'Kulturrevolutions-Schleife');
  assert.ok(TRACK.length > 1450 && TRACK.length < 1700, `length ${TRACK.length}`);
  assert.ok(Math.abs(elevationAt(1330) - 3.8) < .01 && elevationAt(1200) === 0, 'plateau on the east avenue');
  assert.ok(shortcutPoint(SHORTCUT_LENGTH / 2));
  assert.ok(SHORTCUT_LENGTH < TRACKS.beijing.shortcut.to - TRACKS.beijing.shortcut.from, 'the Hutong route is shorter than its main-road span');
  assert.ok(shortcutElevationAt(SHORTCUT_LENGTH / 2) < -.6, 'the hutong alley dips below its entry and exit');
  for (const lip of TRACKS.beijing.rampLips) { const p = trackPoint(lip - .5); assert.ok(atRampLip(p.x, p.z), `take-off ramp at ${lip}`); }
  const moat = TRACKS.beijing.hazards[0]; assert.equal(moat.kind, 'water'); assert.equal(moat.side, 1);
  let straight = 0, tightestRadius = Infinity;
  for (let s = 0; s < TRACK.length; s += 2) {
    const point = trackPoint(s), next = trackPoint(Math.min(TRACK.length, s + 2)); assert.ok(Math.abs(trackLocate(point.x, point.z).s - s) < .01, `centreline lookup at ${s}`);
    let turn = next.heading - point.heading; while (turn > Math.PI) turn -= Math.PI * 2; while (turn < -Math.PI) turn += Math.PI * 2;
    const ds = Math.min(2, TRACK.length - s);
    if (Math.abs(turn) > 1e-5) tightestRadius = Math.min(tightestRadius, ds / Math.abs(turn));
    if (Math.abs(turn / ds) < 1 / 150) straight += ds;
    for (const side of [-1, 1]) { if (side === moat.side && s >= moat.from - 2 && s <= moat.to + 2) continue; const outside = trackPoint(s, side * 11); if (!inShortcut(outside.x, outside.z)) assert.equal(projectTrack(outside.x, outside.z).kind, 'boundary', `wall at ${s}/${side}`); }
  }
  assert.ok(straight / TRACK.length < .4, `near-straight route share ${(100 * straight / TRACK.length).toFixed(1)}%`);
  assert.ok(tightestRadius > 15, `smallest sampled turn radius ${tightestRadius.toFixed(1)}m stays driveable`);
  assert.equal(policyJubelPatchAt(960, 0), true); assert.equal(policyJubelPatchAt(960, 3), false); assert.equal(policyJubelPatchAt(1040, 0), false);
  const drag = applyPolicyJubelDrag(18, 1, 14); assert.ok(drag.speed > 15 && drag.yawRate > .7, 'broadcast drag stays recoverable');
}));

test('slow: Peking bots finish three laps, one of them through the hutong alley', withBeijing(() => {
  for (const kart of [1, 3]) {
    let state = gridKart(kart), sawShortcut = false; const race = createRaceProgress(state);
    for (let step = 0; step < 60 * 270 * TRACK.length / 891 && !race.finished; step++) {
      state = advanceKart(state, botInput(state, kart, [state]), 1 / 60, projectTrack);
      sawShortcut ||= inShortcut(state.x, state.z);
      advanceRace(race, state, step / 60);
      assert.ok(Number.isFinite(state.x + state.z + state.speed));
    }
    assert.ok(race.finished, `bot ${kart} did not finish: ${JSON.stringify(race)}`);
    if (kart === 3) assert.ok(sawShortcut, 'designated bot should take the hutong alley');
  }
}));
