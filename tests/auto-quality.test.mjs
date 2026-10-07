import assert from 'node:assert/strict';
import test from 'node:test';
import { pickQuality } from '../src/auto-quality.ts';

test('automatic graphics start value needs enough frames and follows the median frame time', () => {
  assert.equal(pickQuality(Array(50).fill(10)), null);
  assert.equal(pickQuality(Array(120).fill(9)), 2);
  assert.equal(pickQuality(Array(120).fill(18)), 1);
  assert.equal(pickQuality([...Array(100).fill(40), ...Array(20).fill(8)]), 0);
});
