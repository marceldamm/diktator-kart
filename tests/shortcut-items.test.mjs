import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceKart, KART_TUNING } from '../src/kart-model.ts';
import { BOT_STYLES, TRACK, selectTrack, gridKart, botInput, trackHeightAt, projectTrack, inShortcut, shortcutPoint, shortcutLocate, trackLocate, trackProgress, createRaceProgress, advanceRace, setBotStyles, applySurfaceDrag, boostPadAt, hazardAt } from '../src/track.ts';
import { BOOST_PADS, SHORTCUT, TRACKS } from '../src/track-layout.ts';
import { createItems, itemBoxCount, stepItems, botUsesItem, botItemDirection } from '../src/items.ts';

const onTrack = (id, run) => () => { selectTrack(id); try { run(); } finally { selectTrack('stadionring'); } };

test('the six fixed shortcuts keep distinct course-specific signatures', () => {
  const berlin = TRACKS.stadionring.shortcut, rome = TRACKS['duce-drom'].shortcut;
  const havana = TRACKS.havanna.shortcut, pyongyang = TRACKS.pyongyang.shortcut;
  const moscow = TRACKS.moscow.shortcut, beijing = TRACKS.beijing.shortcut;
  assert.ok(TRACKS.stadionring.rampShortcutEntry, 'Berlin reaches its unboosted cut from the marked outer ramp');
  assert.equal(berlin.boostPads.length, 0);
  assert.ok(rome.elevation.some(([, height]) => height <= -1.5), 'Rome drops under the circus arches');
  assert.equal(rome.itemBoxes?.length, 1);
  assert.ok(havana.elevation.every(([, height]) => height === 0), 'Havana crosses the factory yard at road height');
  assert.equal(havana.itemBoxes?.length, 1);
  assert.ok(pyongyang.elevation.some(([, height]) => height <= -3.5), 'Pyongyang passes through the deep underpass');
  assert.equal(pyongyang.boostPads.length, 2);
  assert.equal(moscow.itemBoxes?.length ?? 0, 0, 'Moscow relies on the broken paving and boost line, not an item box');
  assert.equal(moscow.boostPads.length, 1);
  assert.equal(TRACKS.moscow.shortcutSurfacePatches?.[0]?.kind, 'broken-parade', 'Moscow has a fixed broken centre with intact edge lines');
  assert.equal(TRACKS.beijing.shortcutSurfacePatches?.[0]?.kind, 'wet-stones', 'Beijing has a fixed slick centre and dry edge lines');
  assert.equal(beijing.itemBoxes?.length, 1);
  const signatures = Object.values(TRACKS).map(track => JSON.stringify({
    rampEntry: !!track.rampShortcutEntry,
    deepDrop: Math.min(...track.shortcut.elevation.map(([, height]) => height)),
    boosts: track.shortcut.boostPads.length,
    items: track.shortcut.itemBoxes?.length ?? 0,
    surface: track.shortcutSurfacePatches?.map(patch => patch.kind) ?? [],
  }));
  assert.equal(new Set(signatures).size, 6, 'each course keeps its own authored shortcut pattern');
});

test('Rome, Havanna and Beijing each have a fixed item box on the open, main-road-separated shortcut', () => {
  try {
    for (const id of ['duce-drom', 'havanna', 'beijing']) {
      selectTrack(id);
      assert.ok(SHORTCUT.itemBoxes?.length, `${id} has an authored shortcut item spot`);
      const world = createItems(6, 421);
      assert.equal(itemBoxCount(), world.boxes.length, `${id} scene pool matches its physics box count`);
      for (const [u, lane] of SHORTCUT.itemBoxes) {
        const point = shortcutPoint(u, lane);
        const box = world.boxes.find(candidate => Math.hypot(candidate.x - point.x, candidate.z - point.z) < .001);
        assert.ok(box, `${id} creates the fixed item box at shortcut u=${u}`);
        assert.ok(inShortcut(box.x, box.z), `${id} box u=${u} lies in the actual shortcut area`);
        assert.ok(Math.abs(trackLocate(box.x, box.z).lane) > TRACK.halfWidth + .3, `${id} box u=${u} does not overlap the main road`);
        assert.equal(projectTrack(box.x, box.z).kind, null, `${id} box u=${u} is reachable`);
        assert.ok(Math.abs(shortcutLocate(box.x, box.z).u - u) < .1);
      }
    }
  } finally { selectTrack('stadionring'); }
});

test('the designated Duce-Drom bot naturally collects the new shortcut item box', onTrack('duce-drom', () => {
  let kart = gridKart(3), sawAlley = false, shortcutPickup = null;
  const race = createRaceProgress(kart), items = createItems(6, 421), dt = 1 / 60;
  const [itemU, itemLane] = SHORTCUT.itemBoxes[0], itemPoint = shortcutPoint(itemU, itemLane);
  for (let step = 0; step < 60 * 270 * TRACK.length / 891 && !race.finished && !shortcutPickup; step++) {
    kart = advanceKart(kart, botInput(kart, 3, [kart]), dt, projectTrack, trackHeightAt);
    sawAlley ||= inShortcut(kart.x, kart.z);
    const karts = [kart];
    kart = stepItems(items, karts, [botUsesItem(items, 0, karts)], [3], dt, [botItemDirection(items, 0, karts)])[0];
    for (const event of items.events.splice(0)) if (event.kind === 'pickup') {
      const route = shortcutLocate(kart.x, kart.z), distanceToShortcutBox = Math.hypot(kart.x - itemPoint.x, kart.z - itemPoint.z);
      if (distanceToShortcutBox < 1.65) shortcutPickup = { event, route, distanceToShortcutBox, progress: race.distance };
    }
    advanceRace(race, kart, step * dt);
  }
  assert.ok(sawAlley, 'the ordinary bot driving policy takes the shortcut');
  assert.ok(shortcutPickup, 'the bot reaches and collects the route box during normal driving');
  assert.ok(inShortcut(itemPoint.x, itemPoint.z));
  assert.ok(Math.abs(shortcutPickup.route.u - itemU) < 3, JSON.stringify(shortcutPickup));
}));

test('the designated Havanna bot naturally collects the new shortcut item box', onTrack('havanna', () => {
  setBotStyles([undefined, { ...BOT_STYLES[2], shortcutLane: 0 }, BOT_STYLES[1]]);
  let states = [gridKart(1), gridKart(2)], sawAlley = false, shortcutPickup = null;
  const races = states.map(createRaceProgress), items = createItems(6, 421), dt = 1 / 60;
  const [itemU, itemLane] = SHORTCUT.itemBoxes[0], itemPoint = shortcutPoint(itemU, itemLane);
  try {
    for (let step = 0; step < 60 * 270 * TRACK.length / 891 && !races.every(r => r.finished) && !shortcutPickup; step++) {
      states = states.map((kart, i) => advanceKart(kart, botInput(kart, i + 1, states), dt, projectTrack, trackHeightAt));
      sawAlley ||= states.some(kart => inShortcut(kart.x, kart.z));
      states = stepItems(items, states, states.map((_, i) => botUsesItem(items, i, states)), states.map((_, i) => i + 1), dt, states.map((_, i) => botItemDirection(items, i, states)));
      for (const event of items.events.splice(0)) if (event.kind === 'pickup') {
        const kart = states[event.kart], route = shortcutLocate(kart.x, kart.z), distanceToShortcutBox = Math.hypot(kart.x - itemPoint.x, kart.z - itemPoint.z);
        if (distanceToShortcutBox < 1.65 && inShortcut(kart.x, kart.z)) shortcutPickup = { event, route, distanceToShortcutBox, progress: races[event.kart].distance };
      }
      states.forEach((kart, i) => advanceRace(races[i], kart, step * dt));
    }
    assert.ok(sawAlley, 'the ordinary bot driving policy takes the shortcut');
    assert.ok(shortcutPickup, 'the bot reaches and collects the route box during normal driving');
    assert.ok(inShortcut(itemPoint.x, itemPoint.z));
    assert.ok(Math.abs(shortcutPickup.route.u - itemU) < 3, JSON.stringify(shortcutPickup));
  } finally {
    setBotStyles([]);
  }
}));

test('slow: all six production shortcuts rejoin the course safely over three natural bot laps', () => {
  const outcomes = [];
  try {
    for (const id of ['stadionring', 'duce-drom', 'havanna', 'pyongyang', 'moscow', 'beijing']) {
      selectTrack(id);
      setBotStyles([undefined, { ...BOT_STYLES[1], shortcut: true }]);
      let kart = gridKart(1), wasInside = false, cooldown = 0, shortcutHits = 0;
      const race = createRaceProgress(kart), entries = [], exits = [], dt = 1 / 60;
      const maxSteps = Math.ceil(60 * 360 * TRACK.length / 891);
      for (let step = 0; step < maxSteps && !race.finished; step++) {
        kart = advanceKart(kart, botInput(kart, 1, [kart]), dt, projectTrack, trackHeightAt);
        kart = applySurfaceDrag(kart, dt);
        cooldown = Math.max(0, cooldown - dt);
        const pad = boostPadAt(kart.x, kart.z);
        if (cooldown === 0 && kart.grounded && pad >= 0) {
          kart = { ...kart, turboRemaining: Math.max(kart.turboRemaining, KART_TUNING.turboDuration), speed: Math.min(KART_TUNING.maxTurboSpeed, Math.max(kart.speed, 0) + KART_TUNING.turboSpeedBonus) };
          cooldown = 1.2;
          if (pad >= BOOST_PADS.length) shortcutHits++;
        }
        const inside = inShortcut(kart.x, kart.z);
        if (inside && !wasInside) entries.push({ progress: trackProgress(kart.x, kart.z), grounded: kart.grounded, hazard: hazardAt(kart.x, kart.z) });
        if (!inside && wasInside) {
          const road = trackLocate(kart.x, kart.z);
          exits.push({ progress: trackProgress(kart.x, kart.z), roadLane: road.lane, grounded: kart.grounded, hazard: hazardAt(kart.x, kart.z) });
        }
        wasInside = inside;
        advanceRace(race, kart, step * dt);
      }
      outcomes.push({ track: id, halfWidth: TRACK.halfWidth, finished: race.finished, entries, exits, shortcutHits });
    }
    for (const result of outcomes) {
      assert.ok(result.finished, `${result.track}: bot completes three laps`);
      assert.equal(result.entries.length, 3, `${result.track}: enters the authored shortcut each lap`);
      assert.equal(result.exits.length, 3, `${result.track}: rejoins the main course each lap`);
      for (const exit of result.exits) {
        assert.ok(exit.grounded, `${result.track}: rejoin is grounded`);
        assert.equal(exit.hazard, null, `${result.track}: rejoin is outside every fall volume`);
        assert.ok(Math.abs(exit.roadLane) <= result.halfWidth + .35, `${result.track}: rejoin reaches the drivable ribbon at lane ${exit.roadLane}`);
      }
    }
  } finally {
    setBotStyles([]);
    selectTrack('stadionring');
  }
});
