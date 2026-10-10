import assert from 'node:assert/strict';
import test from 'node:test';
import { describeRecord, emptyProgress, parseProgress, recordCup } from '../src/cup-progress.ts';

test('Ehrenregister records each finished Grand Prix once and awards podium trophies', () => {
  const p = emptyProgress();
  assert.equal(recordCup(p, 'gp-1', 1, 1), 'gold');
  assert.equal(recordCup(p, 'gp-1', 1, 1), null, 'the same cup must not count twice');
  assert.equal(recordCup(p, 'gp-2', 1, 4), 'none');
  assert.equal(recordCup(p, 'gp-3', 1, 3), 'bronze');
  assert.deepEqual(p.drivers[1], { cups: 3, gold: 1, silver: 0, bronze: 1, best: 1 });
  assert.match(describeRecord(p.drivers[1]), /3 Grand Prix · bester Platz 1 · 1× Gold · 1× Bronze/);
  assert.match(describeRecord(p.drivers[4]), /noch kein Grand Prix/);
});

test('Ehrenregister survives a reload and ignores broken or foreign data', () => {
  const p = emptyProgress(); recordCup(p, 'gp-a', 0, 2);
  const again = parseProgress(JSON.stringify(p));
  assert.deepEqual(again.drivers[0], { cups: 1, gold: 0, silver: 1, bronze: 0, best: 2 });
  assert.equal(recordCup(again, 'gp-a', 0, 1), null, 'a reloaded register still knows the counted cup');
  assert.deepEqual(parseProgress('{broken'), emptyProgress());
  assert.deepEqual(parseProgress(null), emptyProgress());
  assert.deepEqual(parseProgress(JSON.stringify({ version: 2 })), emptyProgress());
  assert.deepEqual(parseProgress(JSON.stringify({ version: 1, drivers: { 3: { cups: -2, gold: 'x', best: 0 } }, recorded: [5, 'gp'] })).drivers[3], { cups: 0, gold: 0, silver: 0, bronze: 0, best: 0 });
});
