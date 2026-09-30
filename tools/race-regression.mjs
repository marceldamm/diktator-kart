import assert from "node:assert/strict";
import { registerHooks } from "node:module";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier)) {
      return nextResolve(`${specifier}.ts`, context);
    }
    return nextResolve(specifier, context);
  },
});
const { RaceController } = await import("../client/src/game/race.ts");
const { RACE_LAYOUT } = await import("../client/src/game/race-layout.ts");
const { getSurfaceGripScale } =
  await import("../client/src/game/raycast-kart.ts");
const { driftStage, DRIFT_CHARGE } =
  await import("../client/src/game/drift-charge.ts");
assert.equal(
  getSurfaceGripScale(0, 66),
  1,
  "Main straight keeps standard asphalt grip",
);
assert.equal(
  getSurfaceGripScale(190, 0),
  0.76,
  "Paper shortcut has a distinct reduced grip",
);
assert.equal(
  getSurfaceGripScale(-17, 65),
  0.88,
  "Steel sector has a slightly slicker grip",
);
assert.equal(
  getSurfaceGripScale(-40, 65),
  1,
  "Steel grip ends cleanly at the plate",
);
assert.equal(getSurfaceGripScale(255, 0), 1, "East hairpin remains on asphalt");
assert.equal(
  getSurfaceGripScale(-255, 0),
  1,
  "West hairpin remains on asphalt",
);
assert.equal(getSurfaceGripScale(0, 0), 0.64, "Central grass has reduced grip");
assert.equal(
  getSurfaceGripScale(0, 105),
  0.64,
  "Runoff beyond the outer edge is not asphalt",
);
console.log("PASS: asphalt, paper, steel, grass, and runoff grip values");
assert.equal(driftStage(0.69), 0);
assert.equal(driftStage(0.7), 1);
assert.equal(driftStage(1.79), 1);
assert.equal(driftStage(1.8), 2);
assert.ok(DRIFT_CHARGE.secondBoost > DRIFT_CHARGE.firstBoost);
const position = RACE_LAYOUT.startPosition.clone();
const kart = { getPosition: () => position };
const cross = (race, gate, seconds = 1) => {
  position.copy(gate.position).sub(gate.normal.clone().mulScalar(2));
  race.update(kart, seconds);
  position.copy(gate.position).add(gate.normal.clone().mulScalar(2));
  race.update(kart, seconds);
};
const finish = (seconds) => {
  const race = new RaceController();
  race.start(kart);
  race.update(kart, 3);
  for (let lap = 0; lap < 3; lap++) {
    for (const gate of RACE_LAYOUT.checkpoints) cross(race, gate, seconds);
    cross(race, RACE_LAYOUT.finish, seconds);
  }
  assert.equal(race.snapshot().phase, "finished");
  assert.equal(
    race.snapshot().lapTimes.length,
    3,
    "Each completed lap is retained for results",
  );
  assert.deepEqual(
    race.snapshot().lapTimes,
    Array(3).fill(seconds * 8),
    "Lap splits must retain the individual lap durations",
  );
  return race;
};
const winner = finish(1);
const runnerUp = finish(2);
assert.ok(
  winner.progress(kart) > runnerUp.progress(kart),
  "Earlier finisher must rank ahead",
);
winner.reset(kart);
assert.equal(
  winner.snapshot().bestLapTime,
  null,
  "Restart must clear the previous race best lap",
);
assert.deepEqual(
  winner.snapshot().lapTimes,
  [],
  "Restart must clear previous lap splits",
);
winner.start(kart);
winner.update(kart, 3);
cross(winner, RACE_LAYOUT.finish);
assert.equal(
  winner.snapshot().lap,
  1,
  "Finish line without checkpoints cannot complete a lap",
);
cross(winner, RACE_LAYOUT.checkpoints[2]);
assert.equal(
  winner.snapshot().nextCheckpoint,
  0,
  "Out-of-order checkpoint must not advance progress",
);
console.log(
  "PASS: three-lap finish, finish order, reset, missing and out-of-order checkpoints",
);
const gate = RACE_LAYOUT.checkpoints[0];
const crossingRace = new RaceController();
position.copy(gate.position).add({ x: -2, y: 0, z: 20 });
crossingRace.start(kart);
crossingRace.update(kart, 3);
position.copy(gate.position).add({ x: 8, y: 0, z: 45 });
crossingRace.update(kart, 0.2);
assert.equal(
  crossingRace.snapshot().nextCheckpoint,
  1,
  "Crossing inside the gate counts even if the frame ends outside",
);
position.copy(gate.position).add({ x: -2, y: 0, z: 50 });
crossingRace.start(kart);
crossingRace.update(kart, 3);
position.copy(gate.position).add({ x: 8, y: 0, z: 40 });
crossingRace.update(kart, 0.2);
assert.equal(
  crossingRace.snapshot().nextCheckpoint,
  0,
  "Crossing outside the gate cannot count just because the frame ends inside",
);
console.log("PASS: gate width is checked at the actual crossing point");
cross(crossingRace, gate);
const recoveryPose = crossingRace.getRecoveryPose();
const expectedRecoveryPosition = gate.position
  .clone()
  .add(gate.normal.clone().mulScalar(8));
expectedRecoveryPosition.y = RACE_LAYOUT.startPosition.y;
assert.ok(
  recoveryPose.position.distance(expectedRecoveryPosition) < 1e-6,
  "Recovery point must be placed safely beyond the latest valid checkpoint",
);
position.set(600, 0, 65);
crossingRace.resyncPosition(kart);
crossingRace.update(kart, 0.1);
assert.equal(
  crossingRace.snapshot().nextCheckpoint,
  1,
  "Recovery teleport must preserve the current checkpoint without advancing it",
);
console.log("PASS: player recovery pose preserves ordered checkpoint progress");
const countdownRace = new RaceController();
countdownRace.start(kart);
countdownRace.update(kart, 3);
assert.equal(countdownRace.snapshot().countdownText, "LOS!");
countdownRace.update(kart, 1.3);
assert.equal(
  countdownRace.snapshot().countdownText,
  "",
  "Start prompt clears after the launch",
);
