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
  assert.ok(TRACKS.moscow.shortcut.to - TRACKS.moscow.shortcut.from > 1000);
  assert.ok(shortcutPoint(SHORTCUT_LENGTH / 2));
  for (let s = 0; s < TRACK.length; s += 2) {
    const point = trackPoint(s); assert.ok(Math.abs(trackLocate(point.x, point.z).s - s) < .01);
    const outside=trackPoint(s,11); if(!inShortcut(outside.x,outside.z))assert.equal(projectTrack(outside.x,outside.z).kind,'boundary');
  }
}));

test('Moscow bot completes three laps using the shared race and recovery rules', withMoscow(() => {
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
