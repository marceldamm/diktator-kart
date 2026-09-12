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
