import assert from 'node:assert/strict';
import test from 'node:test';
import { GRACE_MS, syncDecision } from '../scripts/content-sync.mjs';

const now = Date.parse('2026-09-24T17:00:00Z');
const ago = (minutes) => new Date(now - minutes * 60_000).toISOString();

test('a publish built into the live version is in sync', () => {
  const { action } = syncDecision({
    publishedAt: ago(30),
    liveAt: ago(29),
    triggeredFor: null,
    now,
  });
  assert.equal(action, 'none');
});

test("a fresh publish gets the grace period for the webhook's own build", () => {
  const { action } = syncDecision({
    publishedAt: ago(GRACE_MS / 60_000 - 1),
    liveAt: ago(60),
    triggeredFor: null,
    now,
  });
  assert.equal(action, 'none');
});

test('a publish no build picked up starts one', () => {
  const { action, reason } = syncDecision({
    publishedAt: ago(20),
    liveAt: ago(60),
    triggeredFor: null,
    now,
  });
  assert.equal(action, 'deploy');
  assert.match(reason, /webhook/);
});

test('an older trigger does not stop a newer publish from starting a build', () => {
  const { action } = syncDecision({
    publishedAt: ago(20),
    liveAt: ago(60),
    triggeredFor: ago(90),
    now,
  });
  assert.equal(action, 'deploy');
});

test('a build the cron already started that never went live is reported, not retried', () => {
  const publishedAt = ago(80);
  const { action, reason } = syncDecision({
    publishedAt,
    liveAt: ago(120),
    triggeredFor: publishedAt,
    now,
  });
  assert.equal(action, 'report');
  assert.match(reason, /Workers Builds/);
});

test('no published content is nothing to do', () => {
  const { action } = syncDecision({ publishedAt: null, liveAt: undefined, triggeredFor: null, now });
  assert.equal(action, 'none');
});
