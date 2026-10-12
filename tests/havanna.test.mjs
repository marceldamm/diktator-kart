import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceKart, resolveKartContacts } from '../src/kart-model.ts';
import * as layout from '../src/track-layout.ts';
import { TRACK, selectTrack, trackPoint, trackLocate, trackProgress, projectTrack, gridKart, botInput, botStyleOf, setBotStyles, createRaceProgress, advanceRace, trackHeightAt, elevationAt, inShortcut, shortcutPoint, SHORTCUT_LENGTH, hazardAt, recoverKart, atRampLip, maleconWavePatchAt, applyMaleconWaveDrag } from '../src/track.ts';

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

test('slow: Havanna hill and jump, lawn clear of the road, five bots finish three laps', onHavana(() => {
  assert.equal(elevationAt(1128), 4);
  const lip = trackPoint(layout.RAMP_LIPS[1] - .5); assert.ok(atRampLip(lip.x, lip.z));
  const smallLip = trackPoint(layout.RAMP_LIPS[0] - .5); assert.ok(atRampLip(smallLip.x, smallLip.z));
  const clear = TRACK.halfWidth + 1.45 + layout.LANDMARKS.promenade + .5;
  for (const p of TRACK.samples) for (const [x0, z0, x1, z1] of layout.LANDMARKS.lawns) {
    const dx = Math.max(x0 - p.x, 0, p.x - x1), dz = Math.max(z0 - p.z, 0, p.z - z1);
    assert.ok(Math.hypot(dx, dz) > clear, `lawn reaches the road at s=${p.s.toFixed(0)}`);
  }
  let states = Array.from({ length: 5 }, (_, i) => gridKart(i + 1));
  const races = states.map(createRaceProgress);
  for (let step = 0; step < 60 * 270 * TRACK.length / 891 && !races.every((race) => race.finished); step++) {
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

test('Havanna coastal S-bends shorten the long straight and the lap-two wave leaves an inland line', onHavana(() => {
  let straight = 0;
  for (let s = 0; s < TRACK.length; s += 2) {
    const a = trackPoint(s), b = trackPoint(Math.min(TRACK.length, s + 2)); let turn = b.heading - a.heading;
    while (turn > Math.PI) turn -= Math.PI * 2; while (turn < -Math.PI) turn += Math.PI * 2;
    const ds = Math.min(2, TRACK.length - s);
    if (Math.abs(turn / ds) < 1 / 150) straight += ds;
  }
  assert.ok(straight / TRACK.length < .4, `near-straight route share ${(100 * straight / TRACK.length).toFixed(1)}%`);
  assert.equal(maleconWavePatchAt(200, 3), true, 'the exposed sea-side lane is affected');
  assert.equal(maleconWavePatchAt(200, 0), false, 'the middle line stays clear');
  assert.equal(maleconWavePatchAt(200, -3), false, 'the inland lane stays clear');
  assert.equal(maleconWavePatchAt(330, 3), false, 'the wave stays inside its event district');
  const oneSecond = applyMaleconWaveDrag(18, 1, 1);
  assert.ok(Math.abs(oneSecond.speed - 17.16) < .001, 'the sea-side event cap produces a clear, recoverable speed loss');
  assert.ok(oneSecond.yawRate > .95 && oneSecond.yawRate < 1, 'wet grip loss stays small enough to steer');
  assert.ok(Math.abs(applyMaleconWaveDrag(22, 1, 1 / 60, 22).speed - 19.36) < .001, 'wave applies its visible event speed limit below top speed');
  assert.ok(Math.abs(applyMaleconWaveDrag(19.4, 1, 0, 20.8).speed - 18.304) < .001, 'wave also affects ordinary corner speed, not only near-maximum speed');
  const fullWindow = applyMaleconWaveDrag(18, 1, 14);
  assert.ok(fullWindow.speed > 13.5 && fullWindow.speed < 18, 'even the full event window leaves the kart moving');
  assert.ok(fullWindow.yawRate > .4, 'steering stays usable through the whole event');
  const previousStyles = Array.from({ length: 6 }, (_, index) => botStyleOf(index));
  try {
    const style = { label: 'sea-side test', lane: 2.8, drift: false, shortcut: false, pass: 1, itemPatience: 1, eventRisk: 1 };
    setBotStyles([undefined, style]);
    const point = trackPoint(150, 2.8), centre = trackPoint(150);
    let bot = { ...gridKart(1), x: point.x, z: point.z, heading: centre.heading, speed: 18 };
    for (let step = 0; step < 300; step++) bot = advanceKart(bot, botInput(bot, 1, [bot], 'wave'), 1 / 60, projectTrack, trackHeightAt);
    assert.ok(trackLocate(bot.x, bot.z).lane < 0.65, 'an exposed bot chooses the clear inland counterline during the wave');

    const approach = trackPoint(25, 2.8), approachCentre = trackPoint(25);
    let approachingBot = { ...gridKart(1), x: approach.x, z: approach.z, heading: approachCentre.heading, speed: 18 };
    let enteredWave = false;
    for (let step = 0; step < 720; step++) {
      approachingBot = advanceKart(approachingBot, botInput(approachingBot, 1, [approachingBot], 'wave'), 1 / 60, projectTrack, trackHeightAt);
      const current = trackLocate(approachingBot.x, approachingBot.z);
      if (!enteredWave && current.s >= 105) {
        enteredWave = true;
        assert.ok(current.lane < 0.65, `a bot clears the seaward line before entering the wave (lane ${current.lane.toFixed(2)})`);
      }
    }
    assert.equal(enteredWave, true, 'the bot should reach the wave district');

    const riskStyle = { ...style, eventRisk: 0 };
    setBotStyles([undefined, riskStyle]);
    let riskTaker = { ...gridKart(1), x: point.x, z: point.z, heading: centre.heading, speed: 18 };
    for (let step = 0; step < 90; step++) riskTaker = advanceKart(riskTaker, botInput(riskTaker, 1, [riskTaker], 'wave'), 1 / 60, projectTrack, trackHeightAt);
    assert.ok(trackLocate(riskTaker.x, riskTaker.z).lane > 0.65, 'a bot with a bold event-risk style can hold its preferred exposed line');
  } finally { setBotStyles(previousStyles); }
}));
