import assert from 'node:assert/strict';
import test from 'node:test';
import { GRACE_MS, syncDecision } from '../scripts/content-sync.mjs';

const now = Date.parse('2026-09-24T17:00:00Z');
const ago = (minutes) => new Date(now - minutes * 60_000).toISOString();
const run = (id, status, conclusion, minutesAgo) => ({
  id,
  status,
  conclusion,
  run_started_at: ago(minutesAgo),
});

test('a publish picked up by a later successful deploy is in sync', () => {
  const { action } = syncDecision({
    publishedAt: ago(30),
    runs: [run(2, 'completed', 'success', 29)],
    now,
  });
  assert.equal(action, 'none');
});

test('a running deploy is left to finish', () => {
  const { action } = syncDecision({
    publishedAt: ago(30),
    runs: [run(3, 'in_progress', null, 1), run(2, 'completed', 'success', 60)],
    now,
  });
  assert.equal(action, 'none');
});

test("a fresh publish gets the grace period for the webhook's own deploy", () => {
  const { action } = syncDecision({
    publishedAt: ago(GRACE_MS / 60_000 - 1),
    runs: [run(2, 'completed', 'success', 60)],
    now,
  });
  assert.equal(action, 'none');
});

test('a publish no deploy picked up starts one', () => {
  const { action, reason } = syncDecision({
    publishedAt: ago(20),
    runs: [run(2, 'completed', 'success', 60)],
    now,
  });
  assert.equal(action, 'deploy');
  assert.match(reason, /webhook/);
});

test('a deploy that failed after the publish is reported, not retried', () => {
  const { action, reason } = syncDecision({
    publishedAt: ago(20),
    runs: [run(3, 'completed', 'failure', 19), run(2, 'completed', 'success', 60)],
    now,
  });
  assert.equal(action, 'report');
  assert.match(reason, /Deploy run 3 failed/);
});

test('a failure from before the publish does not hide a missed deploy', () => {
  const { action } = syncDecision({
    publishedAt: ago(20),
    runs: [run(3, 'completed', 'failure', 40), run(2, 'completed', 'success', 60)],
    now,
  });
  assert.equal(action, 'deploy');
});

test('an empty dataset needs nothing', () => {
  assert.equal(syncDecision({ publishedAt: null, runs: [], now }).action, 'none');
});
