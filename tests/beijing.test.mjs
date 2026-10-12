import assert from 'node:assert/strict';
import test from 'node:test';
import { TRACKS, isTrackId } from '../src/track-layout.ts';
import { TRACK, selectTrack, trackPoint, trackLocate, trackHeightAt, inShortcut, shortcutPoint, SHORTCUT_LENGTH, gridKart, botInput, botStyleOf, setBotStyles, BOT_STYLES, advanceRace, createRaceProgress, rankRace, projectTrack, elevationAt, atRampLip, shortcutElevationAt, shortcutSurfaceEffectAt, applySurfaceDrag, policyJubelPatchAt, applyPolicyJubelDrag } from '../src/track.ts';
import { advanceKart, resolveKartContacts, KART_TUNING } from '../src/kart-model.ts';

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
  const drag = applyPolicyJubelDrag(18, 1, 14); assert.ok(drag.speed > 13.7 && drag.yawRate > .5, 'broadcast drag stays recoverable');
  assert.ok(Math.abs(applyPolicyJubelDrag(22, 1, 1 / 60, 22).speed - 19.36) < .001, 'broadcast applies its visible event speed limit below top speed');
  assert.ok(Math.abs(applyPolicyJubelDrag(19.4, 1, 0, 20.8).speed - 18.304) < .001, 'broadcast also affects ordinary corner speed, not only near-maximum speed');
  const previousStyles = Array.from({ length: 6 }, (_, index) => botStyleOf(index));
  try {
    const style = { label: 'centre test', lane: 0, drift: false, shortcut: false, pass: 1, itemPatience: 1 };
    setBotStyles([undefined, style]);
    const point = trackPoint(900, 0), centre = trackPoint(900);
    let bot = { ...gridKart(1), x: point.x, z: point.z, heading: centre.heading, speed: 18 };
    for (let step = 0; step < 300; step++) bot = advanceKart(bot, botInput(bot, 1, [bot], 'jubel'), 1 / 60, projectTrack);
    assert.ok(Math.abs(trackLocate(bot.x, bot.z).lane) > 2.4, `a centre bot chooses an outer counterline during the broadcast (lane ${trackLocate(bot.x, bot.z).lane.toFixed(2)} at s ${trackLocate(bot.x, bot.z).s.toFixed(1)})`);

    const approach = trackPoint(800, 0), approachCentre = trackPoint(800);
    let approachingBot = { ...gridKart(1), x: approach.x, z: approach.z, heading: approachCentre.heading, speed: 18 };
    let enteredEvent = false;
    for (let step = 0; step < 720; step++) {
      approachingBot = advanceKart(approachingBot, botInput(approachingBot, 1, [approachingBot], 'jubel'), 1 / 60, projectTrack);
      const current = trackLocate(approachingBot.x, approachingBot.z);
      if (!enteredEvent && current.s >= 880) {
        enteredEvent = true;
        assert.ok(Math.abs(current.lane) > 2.4, `a bot clears the centre before entering the broadcast patch (lane ${current.lane.toFixed(2)})`);
      }
    }
    assert.equal(enteredEvent, true, 'the bot should reach the broadcast district');

    for (const motion of ['drifting', 'airborne']) {
      const committed = { ...gridKart(1), x: point.x, z: point.z, heading: centre.heading, speed: 18,
        drifting: motion === 'drifting', driftDirection: 1, driftCharge: .1, hopRemaining: motion === 'airborne' ? .4 : 0 };
      const escape = botInput(committed, 1, [committed], 'jubel');
      assert.equal(escape.hopDrift, false, `a ${motion} bot releases its committed movement to leave the affected line`);
    }
  } finally { setBotStyles(previousStyles); }
}));

test('Hutong tea spill is fixed, warned, shared across cars and leaves dry edge lines', withBeijing(() => {
  const wet = shortcutPoint(90, 0), dry = shortcutPoint(90, 2.7);
  const wetKart = { ...gridKart(0), ...wet, speed: 14, yawRate: 1 };
  const dryKart = { ...gridKart(1), ...dry, speed: 14, yawRate: 1 };
  assert.equal(shortcutSurfaceEffectAt(wet.x, wet.z), 'wet-stones');
  assert.equal(shortcutSurfaceEffectAt(dry.x, dry.z), null, 'the edge line is outside the fixed spill');
  const wetResult = applySurfaceDrag(wetKart, 1 / 60), dryResult = applySurfaceDrag(dryKart, 1 / 60);
  assert.ok(wetResult.speed < dryResult.speed, 'the wet centre pays a small speed cost');
  assert.ok(wetResult.yawRate < dryResult.yawRate, 'the wet centre loses a little grip');
  const mappedProgress = TRACKS.beijing.shortcut.from + (TRACKS.beijing.shortcut.to - TRACKS.beijing.shortcut.from) * 90 / SHORTCUT_LENGTH;
  const mainRoad = trackPoint(mappedProgress, 0);
  assert.equal(shortcutSurfaceEffectAt(mainRoad.x, mainRoad.z), null, 'the fixed patch does not bleed onto the main route');
}));

test('slow: A57 Peking event changes a six-kart finish order versus the same no-event race', withBeijing(() => {
  const previousStyles = Array.from({ length: 6 }, (_, index) => botStyleOf(index));
  try {
    setBotStyles([undefined, ...BOT_STYLES.slice(1)]);
    const simulate = (withEvent) => {
      let states = Array.from({ length: 6 }, (_, index) => gridKart(index));
      const progress = states.map(createRaceProgress);
      let eventStartedAt = null, eventUntil = 0;
      const affected = new Set();
      for (let frame = 0; frame < 60 * 340 && !progress.every((race) => race.finished); frame++) {
        const time = frame / 60, playerS = trackLocate(states[0].x, states[0].z).s;
        if (withEvent && eventStartedAt === null && progress[0].distance >= TRACK.length + 880 - TRACK.start && playerS >= 880 && playerS < 1040) {
          eventStartedAt = time; eventUntil = time + 14;
        }
        const active = withEvent && eventStartedAt !== null && time < eventUntil;
        states = states.map((state, index) => {
          let next = advanceKart(state, botInput(state, index, states, active ? 'jubel' : undefined), 1 / 60, projectTrack, trackHeightAt);
          const { s, lane } = trackLocate(next.x, next.z);
          if (active && next.grounded && policyJubelPatchAt(s, lane)) {
            affected.add(index);
            next = { ...next, ...applyPolicyJubelDrag(next.speed, next.yawRate, 1 / 60, KART_TUNING.maxForwardSpeed) };
          }
          return applySurfaceDrag(next, 1 / 60);
        });
        states = resolveKartContacts(states, projectTrack);
        states.forEach((state, index) => advanceRace(progress[index], state, time));
      }
      assert.ok(progress.every((race) => race.finished), 'all six modeled karts finish the same three-lap race');
      return { order: rankRace(progress).join(''), eventStartedAt, affected: [...affected] };
    };
    const control = simulate(false), event = simulate(true);
    assert.notEqual(event.order, control.order, `the shared course event changes the finish order (${control.order} → ${event.order})`);
    assert.ok(event.eventStartedAt !== null, 'the event starts at the player’s actual lap-two district crossing');
    assert.equal(event.affected.length, 6, 'each kart that enters the shared middle patch during the event receives its effect');
  } finally { setBotStyles(previousStyles); }
}));

test('slow: Peking bots finish three laps, one of them through the hutong alley', withBeijing(() => {
  let sawTeaSpill = false;
  for (const kart of [1, 3]) {
    let state = gridKart(kart), sawShortcut = false; const race = createRaceProgress(state);
    for (let step = 0; step < 60 * 270 * TRACK.length / 891 && !race.finished; step++) {
      state = applySurfaceDrag(advanceKart(state, botInput(state, kart, [state]), 1 / 60, projectTrack), 1 / 60);
      sawShortcut ||= inShortcut(state.x, state.z);
      sawTeaSpill ||= shortcutSurfaceEffectAt(state.x, state.z) === 'wet-stones';
      advanceRace(race, state, step / 60);
      assert.ok(Number.isFinite(state.x + state.z + state.speed));
    }
    assert.ok(race.finished, `bot ${kart} did not finish: ${JSON.stringify(race)}`);
    if (kart === 3) assert.ok(sawShortcut, 'designated bot should take the hutong alley');
  }
  assert.equal(sawTeaSpill, true, 'a naturally routed bot encounters the fixed Hutong surface effect');
}));
