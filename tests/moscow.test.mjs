import assert from 'node:assert/strict';
import test from 'node:test';
import { TRACKS, isTrackId } from '../src/track-layout.ts';
import { TRACK, selectTrack, trackPoint, trackLocate, inShortcut, shortcutPoint, SHORTCUT_LENGTH, gridKart, botInput, advanceRace, createRaceProgress, projectTrack } from '../src/track.ts';
import { advanceKart } from '../src/kart-model.ts';

const withMoscow = (fn) => () => { selectTrack('moscow'); try { fn(); } finally { selectTrack('stadionring'); } };

test('Moscow selection builds a distinct long course with parade straights and an optional shortcut', withMoscow(() => {
  assert.equal(isTrackId('moscow'), true); assert.equal(TRACK.id, 'moscow'); assert.equal(TRACK.name, 'Genossen-Gerade');
  assert.ok(TRACK.length > 2100 && TRACK.halfWidth === 8, `length ${TRACK.length}, half width ${TRACK.halfWidth}`);
  const straightA = trackPoint(120), straightB = trackPoint(460);
  assert.ok(Math.abs(Math.atan2(Math.sin(straightB.heading-straightA.heading), Math.cos(straightB.heading-straightA.heading))) < .22, 'long opening parade straight should read straight');
  // Second layout (11.10.2026): about the old 2.2 km, far fewer straight metres, a short slow shortcut across the Basilius pocket.
  assert.ok(TRACK.length < 2450, `length ${TRACK.length}`);
  let straight = 0, tightest = Infinity; for (const p of TRACK.samples) { if (Math.abs(p.curvature) < 1 / 150) straight++; tightest = Math.min(tightest, 1 / Math.abs(p.curvature || 1e-9)); }
  assert.ok(straight / TRACK.samples.length < .62, `straight share ${(straight / TRACK.samples.length * 100).toFixed(1)} %`);
  assert.ok(tightest > 22, `tightest radius ${tightest.toFixed(1)}`);
  const saved = TRACKS.moscow.shortcut.to - TRACKS.moscow.shortcut.from - SHORTCUT_LENGTH;
  assert.ok(saved > 50 && saved < 140 && TRACKS.moscow.shortcut.speedCap === 15, `shortcut saves ${saved.toFixed(0)} m at the audited 15 m/s cap`);
  assert.deepEqual([...TRACKS.moscow.rampLips], [800]);
  assert.ok(shortcutPoint(SHORTCUT_LENGTH / 2));
  for (let s = 0; s < TRACK.length; s += 2) {
    const point = trackPoint(s); assert.ok(Math.abs(trackLocate(point.x, point.z).s - s) < .01);
    const outside=trackPoint(s,11); if(!inShortcut(outside.x,outside.z))assert.equal(projectTrack(outside.x,outside.z).kind,'boundary');
  }
}));

test('slow: Moscow bot completes three laps using the shared race and recovery rules', withMoscow(() => {
  let state = gridKart(3), sawShortcut = false; const race = createRaceProgress(state);
  for (let step = 0; step < 60 * 270 * TRACK.length / 891 && !race.finished; step++) {
    state = advanceKart(state, botInput(state, 3, [state]), 1/60, projectTrack);
    sawShortcut ||= inShortcut(state.x,state.z);
    advanceRace(race, state, step/60);
    assert.ok(Number.isFinite(state.x + state.z + state.speed));
  }
  assert.ok(race.finished, `bot did not finish: ${JSON.stringify(race)}`);
  assert.ok(sawShortcut, 'designated bot should take the Moscow shortcut');
}));
