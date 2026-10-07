import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceKart, initialKartState, resolveKartContacts } from '../src/kart-model.ts';
import * as layout from '../src/track-layout.ts';
import { TRACK, selectTrack, trackPoint, trackProgress, projectTrack, gridKart, botInput, createRaceProgress, advanceRace, trackHeightAt, shortcutElevationAt, inShortcut, shortcutPoint, SHORTCUT_LENGTH, boostPadAt, hazardAt, recoverKart, trackCrossingsAtZ } from '../src/track.ts';

const onPyongyang = (fn) => () => { selectTrack('pyongyang'); try { fn(); } finally { selectTrack('stadionring'); } };

test('Ewige-Führer-Allee is a complete playable Pyongyang circuit with continuous progress and barriers', onPyongyang(() => {
  assert.equal(TRACK.id, 'pyongyang');
  assert.equal(layout.TRACK_INFO.name, 'Ewige-Führer-Allee');
  assert.equal(layout.TRACK_INFO.city, 'Pjöngjang');
  assert.ok(TRACK.length > 1450 && TRACK.length < 1600, `length ${TRACK.length}`);
  assert.ok(layout.TRACKS.pyongyang.shortcut);
  for (let s = 0; s < TRACK.length; s += .5) {
    const p = trackPoint(s), actual = trackProgress(p.x, p.z);
    assert.ok(Math.abs(actual - s) < .001, `s=${s} actual=${actual}`);
    for (const lane of [-10, 10]) {
      const outside = trackPoint(s, lane);
      if (inShortcut(outside.x, outside.z) || (lane > 0 && layout.HAZARDS.some(h => s >= h.from - 6 && s <= h.to + 6))) continue;
      assert.equal(projectTrack(outside.x, outside.z).kind, 'boundary', `s=${s} lane=${lane}`);
    }
  }
}));

test('Ewige-Führer-Allee underpass is lower, shorter, open and has two working boost strips', onPyongyang(() => {
  assert.ok(layout.SHORTCUT.halfWidth >= 6, 'underpass leaves room for the kart to steer');
  assert.ok(SHORTCUT_LENGTH < layout.SHORTCUT.to - layout.SHORTCUT.from - 100, `shortcut ${SHORTCUT_LENGTH}`);
  const entry = trackPoint(layout.SHORTCUT.from, -3), shortcutEntry = shortcutPoint(2);
  const entryTurn = Math.atan2(Math.sin(shortcutEntry.heading - entry.heading), Math.cos(shortcutEntry.heading - entry.heading));
  assert.ok(Math.abs(entryTurn) < .45, `shortcut entry should follow the main-road tangent (${entryTurn})`);
  assert.equal(shortcutElevationAt(0), 0);
  assert.equal(shortcutElevationAt(SHORTCUT_LENGTH * .5), -3.6);
  assert.equal(shortcutElevationAt(SHORTCUT_LENGTH), 0);
  assert.equal(layout.SHORTCUT.boostPads.length, 2);
  let last = -Infinity;
  for (let u = 0; u <= SHORTCUT_LENGTH; u += .5) {
    const p = shortcutPoint(u);
    assert.equal(projectTrack(p.x, p.z).kind, null, `blocked at ${u}`);
    const progress = trackProgress(p.x, p.z);
    assert.ok(progress >= last - .5, `progress went backwards at ${u}`); last = progress;
  }
  for (let u = SHORTCUT_LENGTH * .3; u <= SHORTCUT_LENGTH * .7; u += 12) for (const lane of [-4.5, 4.5]) {
    const p = shortcutPoint(u, lane);
    assert.equal(projectTrack(p.x, p.z).kind, null, `free steering lane blocked at u=${u}, lane=${lane}`);
  }
  for (const [start, lane] of layout.SHORTCUT.boostPads) {
    const p = shortcutPoint(start * SHORTCUT_LENGTH + 3, lane);
    assert.ok(inShortcut(p.x, p.z));
    assert.ok(trackHeightAt(p.x, p.z) < -3.3, 'boost strip is on the lowered tunnel floor');
    assert.ok(boostPadAt(p.x, p.z) >= layout.BOOST_PADS.length);
  }
}));

test('Ewige-Führer-Allee tunnel entry permits a steering correction without clipping the wall', onPyongyang(() => {
  const start = shortcutPoint(SHORTCUT_LENGTH * .22);
  for (const direction of [-.45, .45]) {
    let state = { ...initialKartState(), ...start, travelHeading: start.heading, speed: 10 };
    for (let step = 0; step < 24; step++) {
      state = advanceKart(state, { throttle: .8, steering: direction }, 1 / 60, projectTrack, trackHeightAt);
      assert.notEqual(state.impactKind, 'boundary', `wall contact while steering ${direction} at tunnel entry`);
      assert.equal(projectTrack(state.x, state.z).kind, null);
    }
  }
}));

test('Ewige-Führer-Allee underpass allows steering in both directions without wall contact', onPyongyang(() => {
  const start = shortcutPoint(SHORTCUT_LENGTH * .5);
  const steer = (direction) => {
    let state = { ...initialKartState(), ...start, travelHeading: start.heading, speed: 7 };
    for (let step = 0; step < 36; step++) {
      state = advanceKart(state, { throttle: .8, steering: direction }, 1 / 60, projectTrack, trackHeightAt);
      assert.notEqual(projectTrack(state.x, state.z).kind, 'boundary', `wall contact while steering ${direction}`);
    }
    return state;
  };
  const left = steer(-.55), right = steer(.55);
  const difference = Math.atan2(Math.sin(left.heading - right.heading), Math.cos(left.heading - right.heading));
  assert.ok(Math.abs(difference) > .15, `steering directions converged (${difference})`);
}));

test('Ewige-Führer-Allee bots complete three laps on the shared driving and recovery rules', onPyongyang(() => {
  let states = Array.from({ length: 5 }, (_, i) => gridKart(i + 1));
  const races = states.map(createRaceProgress);
  for (let step = 0; step < 60 * 270 * TRACK.length / 891; step++) {
    states = states.map((state, i) => advanceKart(state, botInput(state, i + 1, states), 1 / 60, projectTrack, trackHeightAt));
    states = resolveKartContacts(states, projectTrack);
    states = states.map((state) => hazardAt(state.x, state.z) ? recoverKart(state, states) : state);
    states.forEach((state, i) => { advanceRace(races[i], state, step / 60); assert.ok(Number.isFinite(state.x + state.z + state.speed)); });
  }
  assert.ok(races.every((race) => race.finished), JSON.stringify(races.map((race) => race.distance | 0)));
}));

test('Ewige-Führer-Allee bridge piers leave a central route and trigger an evasive recoil on contact', onPyongyang(() => {
  assert.equal(layout.TRACK_INFO.dressing.bridges.length, 2);
  assert.ok(layout.TRACK_INFO.dressing.bridges.every((x) => Math.abs(x) >= 320), 'river bridge piers stay outside the oval');
  assert.equal(layout.TRACK_INFO.obstacles?.length, 4);
  for (const obstacle of layout.TRACK_INFO.obstacles ?? []) {
    const p = trackPoint(obstacle.s, obstacle.lane);
    assert.equal(projectTrack(p.x, p.z).kind, 'obstacle', `pier collision at ${obstacle.s}/${obstacle.lane}`);
    const centreLane = trackPoint(obstacle.s, 0);
    assert.equal(projectTrack(centreLane.x, centreLane.z).kind, null, 'the middle gap stays passable');
    let state = { ...initialKartState(), ...p, travelHeading: p.heading, speed: 12 };
    state = advanceKart(state, { throttle: 1, steering: 0 }, 1 / 60, projectTrack, trackHeightAt);
    assert.equal(state.impactKind, 'obstacle');
    assert.ok(state.speed < 0, 'collision knocks the kart back');
    assert.ok(state.impactRemaining > 0 && Math.abs(state.bodyRoll) > .01, 'collision triggers a visible dodge');
  }
}));

test('Ewige-Führer-Allee main road is level and has no forced ramp or hump', onPyongyang(() => {
  assert.deepEqual(layout.ELEVATION, []);
  assert.deepEqual(layout.RAMP_LIPS, []);
  assert.equal(layout.BUMP_PROGRESS, -1);
  for (let s = 0; s < TRACK.length; s += 1.25) {
    const p = trackPoint(s);
    assert.ok(Math.abs(trackHeightAt(p.x, p.z)) < .001, `road height changed at s=${s}`);
  }
}));

test('Ewige-Führer-Allee breakable fence is a passable first-lap feature after the start line', onPyongyang(() => {
  const fence = layout.TRACK_INFO.dressing.breakableFence;
  assert.ok(fence !== undefined && fence > TRACK.start + 20 && fence < TRACK.start + 100);
  const p = trackPoint(fence, 0);
  assert.equal(projectTrack(p.x, p.z).kind, null);
}));

test('Pyongyang start and monument gate locations preserve a passable driving line', onPyongyang(() => {
  for (const progress of [TRACK.start, layout.LANDMARKS.gateProgress]) {
    for (const lane of [-4, 0, 4]) {
      const p = trackPoint(progress, lane);
      assert.equal(projectTrack(p.x, p.z).kind, null, `arch center corridor blocked at ${progress}/${lane}`);
    }
  }
}));

test('Taedong north-bank decorative railing opens exactly at road crossings, not along the parallel south bank', onPyongyang(() => {
  const north = Math.max(layout.RIVER.north, layout.RIVER.south), south = Math.min(layout.RIVER.north, layout.RIVER.south);
  const gaps = trackCrossingsAtZ(north, 4);
  assert.equal(gaps.length, 2, JSON.stringify(gaps));
  assert.ok(gaps.every(([left, right]) => right - left >= TRACK.halfWidth * 2));
  assert.deepEqual(trackCrossingsAtZ(south, 4), []);
}));