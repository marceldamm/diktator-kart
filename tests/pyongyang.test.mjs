import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceKart, initialKartState, resolveKartContacts } from '../src/kart-model.ts';
import * as layout from '../src/track-layout.ts';
import { TRACK, selectTrack, trackPoint, trackProgress, projectTrack, gridKart, botInput, createRaceProgress, advanceRace, trackHeightAt, shortcutElevationAt, inShortcut, shortcutPoint, SHORTCUT_LENGTH, boostPadAt, hazardAt, recoverKart, trackCrossingsAtZ, trackLocate, PARADE_COLUMN, startParade, stopParade, setParadeClock, paradeVehicles } from '../src/track.ts';

const onPyongyang = (fn) => () => { selectTrack('pyongyang'); try { fn(); } finally { selectTrack('stadionring'); } };

test('Ewige-Führer-Allee is a complete playable Pyongyang circuit with continuous progress and barriers', onPyongyang(() => {
  assert.equal(TRACK.id, 'pyongyang');
  assert.equal(layout.TRACK_INFO.name, 'Ewige-Führer-Allee');
  assert.equal(layout.TRACK_INFO.city, 'Pjöngjang');
  assert.ok(TRACK.length > 1750 && TRACK.length < 1900, `length ${TRACK.length}`);
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

test('slow: Ewige-Führer-Allee bots complete three laps on the shared driving and recovery rules', onPyongyang(() => {
  let states = Array.from({ length: 5 }, (_, i) => gridKart(i + 1));
  const races = states.map(createRaceProgress);
  for (let step = 0; step < 60 * 270 * TRACK.length / 891 && !races.every((race) => race.finished); step++) {
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

test('Ewige-Führer-Allee second layout: technical curves, a tower hairpin, a climb with the Triumph ramp and a quay kicker', onPyongyang(() => {
  // Marcel 11.10.2026: the old oval was 94 % straight; the pilot should have real braking, drift and jump moments.
  let straight = 0, samples = 0, tightest = Infinity;
  for (const p of TRACK.samples) { samples++; if (Math.abs(p.curvature) < 1 / 150) straight++; tightest = Math.min(tightest, 1 / Math.abs(p.curvature || 1e-9)); }
  assert.ok(straight / samples < .65, `straight share ${(straight / samples * 100).toFixed(1)} %`);
  assert.ok(tightest > 18, `tightest radius ${tightest.toFixed(1)} m stays driftable`);
  // The hairpin wraps around the torch tower (x 119, z 100) without the road touching its base.
  let towerGap = Infinity;
  for (let s = 0; s < TRACK.length; s += 1) { const p = trackPoint(s); towerGap = Math.min(towerGap, Math.hypot(p.x - 119, p.z - 100)); }
  assert.ok(towerGap > TRACK.wall + 4 && towerGap < 40, `tower gap ${towerGap.toFixed(1)}`);
  assert.equal(layout.BUMP_PROGRESS, -1);
  assert.deepEqual([...layout.RAMP_LIPS], [232, 930]);
  const crest = trackPoint(905), lip = trackPoint(930);
  assert.ok(trackHeightAt(crest.x, crest.z) > 4.3, 'Triumph climb reaches its crest');
  assert.ok(trackHeightAt(lip.x, lip.z) > 4.4, 'the ramp lip sits on the crest');
  for (const s of [10, 400, 700, 1100, 1300, 1600]) { const p = trackPoint(s); assert.ok(Math.abs(trackHeightAt(p.x, p.z)) < .001, `level away from the climb at ${s}`); }
}));

test('Ewige-Führer-Allee underpass is a fair alternative, not half a lap', onPyongyang(() => {
  const saved = (layout.SHORTCUT.to - layout.SHORTCUT.from) - SHORTCUT_LENGTH;
  assert.ok(saved > 60 && saved < 160, `underpass saves ${saved.toFixed(0)} m`);
  // Parade decor, statues and the hotel stay off both driving lines.
  for (const [x, z, r] of [[119, 100, 2.6], [11, -16, 21]]) {
    assert.equal(projectTrack(x, z).kind, 'boundary', `landmark ${x}/${z} lies off the main road`);
    assert.ok(!inShortcut(x, z) && Math.abs(trackLocate(x, z).lane) > TRACK.wall + r, `landmark ${x}/${z} clears the road`);
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

test('slow: Pyongyang parade column leaves a safe lane for normal and faster bots during its 15-second window', onPyongyang(() => {
  startParade(0); setParadeClock(0);
  try {
    const vehicles = paradeVehicles();
    assert.ok(vehicles.length >= 2, `column on the boulevard (${vehicles.length})`);
    for (const v of vehicles) {
      const blocked = trackPoint(v.s, v.lane), open = trackPoint(v.s, -3);
      assert.equal(projectTrack(blocked.x, blocked.z).kind, 'obstacle', 'parade vehicle collides');
      assert.equal(projectTrack(open.x, open.z).kind, null, 'left half stays open');
    }
    for (const topSpeedBonus of [0, 5]) {
      let hits = 0;
      for (const lane of [-4, -2, 0, 2, 4]) {
        const point = trackPoint(1360, lane);
        let state = { ...gridKart(1), x: point.x, z: point.z, heading: point.heading, travelHeading: point.heading, topSpeedBonus };
        for (let step = 0; step < 60 * (PARADE_COLUMN.duration + 10); step++) {
          setParadeClock(step / 60);
          state = advanceKart(state, botInput(state, 1, [state]), 1 / 60, projectTrack, trackHeightAt);
          [state] = resolveKartContacts([state], projectTrack);
          if (hazardAt(state.x, state.z)) state = recoverKart(state, [state]);
          if (state.impactKind === 'obstacle') hits++;
        }
        assert.ok(state.speed > 4, `${topSpeedBonus}, lane ${lane}: bot resumes after the short event (${state.speed.toFixed(1)} m/s)`);
      }
      assert.ok(hits < 60, `${topSpeedBonus}: bots mostly steer around the column (${hits} contact steps)`);
    }
    setParadeClock(PARADE_COLUMN.duration);assert.equal(paradeVehicles().length,0,'expired vehicles cannot block either bot or player');
  } finally { stopParade(); }
  assert.equal(paradeVehicles().length, 0);
}));
