import assert from 'node:assert/strict';
import test from 'node:test';
import { GP_POINTS, GP_TRACKS, awardPoints, createGrandPrix, standings } from '../src/grand-prix.ts';

test('Grand Prix covers both playable circuits and awards points once per round from the finishing order', () => {
  const gp = createGrandPrix();
  assert.deepEqual(gp.tracks, ['stadionring', 'duce-drom', 'havanna', 'pyongyang', 'moskau']);
  assert.equal(GP_TRACKS.length, 5);
  assert.ok(awardPoints(gp, 'stadionring', [2, 0, 1, 3, 4, 5], 300));
  assert.equal(awardPoints(gp, 'stadionring', [0, 1, 2, 3, 4, 5], 290), false, 'a repeated finish must not add points');
  assert.deepEqual(gp.results[0].points, [7, 5, 10, 3, 2, 1]);
  assert.equal(awardPoints(gp, 'stadionring', [0, 1, 2, 3, 4, 5], 1), false);
  gp.round = 1;
  assert.equal(awardPoints(gp, 'stadionring', [0, 1, 2, 3, 4, 5], 1), false, 'the round must match its circuit');
  assert.ok(awardPoints(gp, 'duce-drom', [0, 2, 1, 3, 4, 5], 280));
  const rows = standings(gp);
  assert.deepEqual(rows.map(r => [r.driver, r.points]), [[0, 17], [2, 17], [1, 10], [3, 6], [4, 4], [5, 2]]);
  assert.equal(rows.reduce((s, r) => s + r.points, 0), 2 * GP_POINTS.reduce((a, b) => a + b, 0));
});

test('Grand Prix ties break on wins, best finish, then the latest race', () => {
  const gp = createGrandPrix(['stadionring', 'duce-drom']);
  awardPoints(gp, 'stadionring', [1, 0, 2, 3, 4, 5], 1); gp.round = 1;
  awardPoints(gp, 'duce-drom', [0, 1, 2, 3, 4, 5], 1);
  const [first, second] = standings(gp);
  assert.equal(first.points, second.points);
  assert.equal(first.driver, 0, 'equal points and wins: the better place in the latest race decides');
});
