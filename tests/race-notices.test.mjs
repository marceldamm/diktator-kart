import assert from 'node:assert/strict';
import test from 'node:test';
import { selectRaceInfoNotice } from '../src/race-notices.ts';

test('course event stays readable over ordinary item messages, then yields to current slot hint', () => {
  const event = 'Propaganda-Zeppelin! Rückenwind auf der Tribünenspur · innen bleibt freie Fahrt';
  assert.equal(selectRaceInfoNotice(4.1, event, 8, 'Treffer · kurzzeitig geschützt'), event);
  assert.equal(selectRaceInfoNotice(8, event, 8, 'Treffer · kurzzeitig geschützt'), 'Treffer · kurzzeitig geschützt');
  assert.equal(selectRaceInfoNotice(8, '', 0, 'E/Touch halten: Schild · loslassen oder antippen: werfen'), 'E/Touch halten: Schild · loslassen oder antippen: werfen');
});
