import test from 'node:test';
import assert from 'node:assert/strict';
import { computeLimit, intervalToMs, pickBestIntervalForRange, SUPPORTED_INTERVALS } from '../src/utils/intervals';

test('intervalToMs supports all configured intervals', () => {
  for (const interval of SUPPORTED_INTERVALS) {
    const ms = intervalToMs(interval);
    assert.ok(Number.isFinite(ms));
    assert.ok(ms > 0);
  }
});

test('computeLimit clamps to [10, 500]', () => {
  assert.equal(computeLimit(1, '1m'), 10);

  const huge = 1000 * 24 * 60 * 60 * 1000; // 1000 days
  assert.equal(computeLimit(huge, '1m'), 500);
});

test('pickBestIntervalForRange prefers smaller intervals within 500 candles', () => {
  const rangeMs = 2 * 60 * 60 * 1000; // 2h
  const picked = pickBestIntervalForRange(['1m', '5m', '1h'], rangeMs);
  assert.equal(picked, '1m');
});

test('pickBestIntervalForRange falls back to largest when everything exceeds 500', () => {
  const rangeMs = 10 * 24 * 60 * 60 * 1000; // 10d
  const picked = pickBestIntervalForRange(['1m', '3m', '5m', '15m'], rangeMs);
  assert.equal(picked, '15m');
});
