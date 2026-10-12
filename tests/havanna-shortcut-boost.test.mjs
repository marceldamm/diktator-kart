import assert from 'node:assert/strict';
import test from 'node:test';
import { BOOST_PADS, SHORTCUT, TRACKS } from '../src/track-layout.ts';
import { BOT_STYLES, advanceRace, applySurfaceDrag, boostPadAt, botInput, createRaceProgress, gridKart, inShortcut, projectTrack, selectTrack, setBotStyles, TRACK } from '../src/track.ts';
import { KART_TUNING, advanceKart } from '../src/kart-model.ts';

test('slow: Havanna shortcut boost stays driveable and pays back time across three laps', () => {
  selectTrack('havanna');
  const dt = 1 / 60;
  const run = allowShortcutBoost => {
    setBotStyles([undefined, { ...BOT_STYLES[1], shortcut: true }]);
    let state = gridKart(1), cooldown = 0, shortcutHits = 0, sawShortcut = false;
    const race = createRaceProgress(state);
    for (let step = 0; step < 60 * 360 * TRACK.length / 891 && !race.finished; step++) {
      state = advanceKart(state, botInput(state, 1, [state]), dt, projectTrack);
      state = applySurfaceDrag(state, dt);
      sawShortcut ||= inShortcut(state.x, state.z);
      cooldown = Math.max(0, cooldown - dt);
      const pad = boostPadAt(state.x, state.z);
      if (cooldown === 0 && state.grounded && pad >= 0 && (allowShortcutBoost || pad < BOOST_PADS.length)) {
        state = {
          ...state,
          turboRemaining: Math.max(state.turboRemaining, KART_TUNING.turboDuration),
          speed: Math.min(KART_TUNING.maxTurboSpeed, Math.max(state.speed, 0) + KART_TUNING.turboSpeedBonus),
        };
        cooldown = 1.2;
        if (pad >= BOOST_PADS.length) shortcutHits++;
      }
      advanceRace(race, state, step * dt);
    }
    return { finished: race.finished, time: race.finishTime, shortcutHits, sawShortcut };
  };

  try {
    assert.deepEqual(TRACKS.havanna.shortcut.boostPads, [[.55, 0]], 'the factory cut has one fixed mid-late boost');
    const withoutShortcutBoost = run(false);
    const withShortcutBoost = run(true);
    assert.equal(withoutShortcutBoost.finished, true);
    assert.equal(withShortcutBoost.finished, true);
    assert.equal(withoutShortcutBoost.sawShortcut, true);
    assert.equal(withShortcutBoost.sawShortcut, true);
    assert.equal(withoutShortcutBoost.shortcutHits, 0);
    assert.equal(withShortcutBoost.shortcutHits, 3, 'the pad triggers once in each lap');
    assert.ok(withShortcutBoost.time < withoutShortcutBoost.time - 4, `isolated pad gain ${(withoutShortcutBoost.time - withShortcutBoost.time).toFixed(2)} s`);
  } finally {
    setBotStyles([]);
    selectTrack('stadionring');
  }
});
