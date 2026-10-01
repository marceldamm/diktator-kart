import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';

registerHooks({
    resolve(specifier, context, nextResolve) {
        if (specifier.startsWith('.') && !/\.[a-z]+$/i.test(specifier)) {
            return nextResolve(`${specifier}.ts`, context);
        }
        return nextResolve(specifier, context);
    }
});
const { RaceController } = await import('../client/src/game/race.ts');
const { RACE_LAYOUT } = await import('../client/src/game/race-layout.ts');
const { driftStage, DRIFT_CHARGE } = await import('../client/src/game/drift-charge.ts');
const { selectItemForPosition } = await import('../client/src/game/items.ts');
assert.equal(driftStage(0.69), 0);
assert.equal(driftStage(0.7), 1);
assert.equal(driftStage(1.79), 1);
assert.equal(driftStage(1.8), 2);
assert.ok(DRIFT_CHARGE.secondBoost > DRIFT_CHARGE.firstBoost);
const offensiveItems = new Set(['propaganda', 'red-folder', 'secret-police', 'duty-rocket']);
const offensiveRate = (position) =>
    Array.from({ length: 1000 }, (_, index) => selectItemForPosition(position, 6, index / 1000))
        .filter((item) => offensiveItems.has(item.id)).length;
assert.ok(offensiveRate(6) > offensiveRate(1) * 2, 'Trailing racers must receive stronger comeback items');
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
    assert.equal(race.snapshot().phase, 'finished');
    return race;
};
const winner = finish(1);
const runnerUp = finish(2);
assert.ok(winner.progress(kart) > runnerUp.progress(kart), 'Earlier finisher must rank ahead');
winner.reset(kart);
assert.equal(winner.snapshot().bestLapTime, null, 'Restart must clear the previous race best lap');
winner.start(kart);
winner.update(kart, 3);
cross(winner, RACE_LAYOUT.finish);
assert.equal(winner.snapshot().lap, 1, 'Finish line without checkpoints cannot complete a lap');
cross(winner, RACE_LAYOUT.checkpoints[2]);
assert.equal(winner.snapshot().nextCheckpoint, 0, 'Out-of-order checkpoint must not advance progress');
console.log('PASS: three-lap finish, finish order, reset, missing and out-of-order checkpoints');
const gate = RACE_LAYOUT.checkpoints[0];
const crossingRace = new RaceController();
position.copy(gate.position).add({ x: -2, y: 0, z: 40 });
crossingRace.start(kart);
crossingRace.update(kart, 3);
position.copy(gate.position).add({ x: 8, y: 0, z: 45 });
crossingRace.update(kart, 0.2);
assert.equal(crossingRace.snapshot().nextCheckpoint, 1, 'Crossing inside the gate counts even if the frame ends outside');
position.copy(gate.position).add({ x: -2, y: 0, z: 50 });
crossingRace.start(kart);
crossingRace.update(kart, 3);
position.copy(gate.position).add({ x: 8, y: 0, z: 40 });
crossingRace.update(kart, 0.2);
assert.equal(crossingRace.snapshot().nextCheckpoint, 0, 'Crossing outside the gate cannot count just because the frame ends inside');
console.log('PASS: gate width is checked at the actual crossing point');
assert.equal(crossingRace.snapshot().countdownText, 'LOS!');
crossingRace.update(kart, 1.3);
assert.equal(crossingRace.snapshot().countdownText, '', 'Start prompt clears after the launch');
