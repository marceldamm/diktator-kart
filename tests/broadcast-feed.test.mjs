import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldRefreshBroadcastFeed } from '../src/broadcast-feed.ts';

test('broadcast updates inside its viewing area and pauses off-screen', () => {
  assert.equal(shouldRefreshBroadcastFeed(0, 0, 0, 0), true);
  assert.equal(shouldRefreshBroadcastFeed(130, 0, 0, 0), true, 'the boundary is inclusive');
  assert.equal(shouldRefreshBroadcastFeed(130.01, 0, 0, 0), false);
  assert.equal(shouldRefreshBroadcastFeed(0, -131, 0, 0), false);
});

test('broadcast range rejects invalid positions and radii', () => {
  assert.equal(shouldRefreshBroadcastFeed(Number.NaN, 0, 0, 0), false);
  assert.equal(shouldRefreshBroadcastFeed(0, 0, 0, 0, 0), false);
  assert.equal(shouldRefreshBroadcastFeed(0, 0, 0, 0, -1), false);
});
