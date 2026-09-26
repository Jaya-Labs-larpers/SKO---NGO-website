/**
 * Catches a Sanity publish that never reached the live site.
 *
 *   node scripts/content-sync.mjs
 *
 * The site is built from Sanity at deploy time, and a Sanity webhook starts
 * that deploy on every publish. When the webhook fails (an expired or revoked
 * GitHub token, an edited hook) nothing tells the editor: the publish succeeds
 * in Studio and the site keeps serving the previous build.
 *
 * This compares the newest published document with the last successful Deploy
 * run. If a publish is older than the grace period and no deploy has picked it
 * up, it starts the Deploy workflow itself and exits 1, so GitHub emails
 * someone that the webhook needs attention. A Deploy that ran and failed is
 * reported but not retried: the same content would fail the same way, and the
 * failed run already notifies.
 *
 * Deletions are not seen, since a deleted document leaves no timestamp. The
 * nightly rebuild covers them.
 *
 * Needs PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, GITHUB_REPOSITORY and
 * a GITHUB_TOKEN with actions: write. No Sanity token: the dataset is public.
 */

import { fileURLToPath } from 'node:url';

/** Long enough for the webhook's own deploy to start and show up as a run. */
export const GRACE_MS = 10 * 60 * 1000;

const ACTIVE = new Set(['queued', 'in_progress', 'waiting', 'pending', 'requested']);

/**
 * @param {object} input
 * @param {string | null} input.publishedAt newest published document's _updatedAt
 * @param {{ id: number, status: string, conclusion: string | null, run_started_at: string }[]} input.runs
 *   Deploy runs on main, newest first
 * @param {number} input.now
 * @returns {{ action: "none" | "deploy" | "report", reason: string }}
 */
export function syncDecision({ publishedAt, runs, now, graceMs = GRACE_MS }) {
  if (!publishedAt) return { action: 'none', reason: 'no published content' };
  const published = Date.parse(publishedAt);

  const active = runs.find((run) => ACTIVE.has(run.status));
  if (active) return { action: 'none', reason: `Deploy run ${active.id} is ${active.status}` };

  const lastGood = runs.find((run) => run.conclusion === 'success');
  if (lastGood && Date.parse(lastGood.run_started_at) >= published) {
    return { action: 'none', reason: `in sync with Deploy run ${lastGood.id}` };
  }

  if (now - published < graceMs) {
    return { action: 'none', reason: `publish at ${publishedAt} is within the grace period` };
  }

  const failed = runs.find(
    (run) => run.conclusion === 'failure' && Date.parse(run.run_started_at) >= published,
  );
  if (failed) {
    return {
      action: 'report',
      reason:
        `Deploy run ${failed.id} failed after the publish at ${publishedAt}; ` +
        `the site is serving ${lastGood ? `Deploy run ${lastGood.id}` : 'an older build'}`,
    };
  }

  return {
    action: 'deploy',
    reason:
      `the publish at ${publishedAt} never started a deploy; ` +
      `check the Sanity webhook "Rebuild site on publish" and its GitHub token`,
  };
}

async function json(url, init) {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`${init?.method ?? 'GET'} ${url} returned ${response.status}`);
  return response.status === 204 ? null : response.json();
}

async function main() {
  const env = process.env;
  const project = env.PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.PUBLIC_SANITY_DATASET || 'production';
  const apiVersion = env.PUBLIC_SANITY_API_VERSION || '2026-01-01';
  const repo = env.GITHUB_REPOSITORY;
  if (!project || !repo || !env.GITHUB_TOKEN) {
    console.error('[sync] needs PUBLIC_SANITY_PROJECT_ID, GITHUB_REPOSITORY and GITHUB_TOKEN');
    process.exit(2);
  }

  // The live API, not the CDN: the CDN can lag the publish this is looking for.
  const query = `*[!(_type match "sanity.*") && !(_type match "system.*")] | order(_updatedAt desc)[0]._updatedAt`;
  const { result: publishedAt } = await json(
    `https://${project}.api.sanity.io/v${apiVersion}/data/query/${dataset}` +
      `?query=${encodeURIComponent(query)}&perspective=published`,
  );

  const github = {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
  };
  const workflow = `https://api.github.com/repos/${repo}/actions/workflows/deploy.yml`;
  const { workflow_runs: runs } = await json(`${workflow}/runs?branch=main&per_page=20`, {
    headers: github,
  });

  const { action, reason } = syncDecision({ publishedAt, runs, now: Date.now() });
  if (action === 'none') {
    console.log(`[sync] ok: ${reason}`);
    return;
  }
  if (action === 'report') {
    console.log(`::warning::${reason}`);
    return;
  }
  await json(`${workflow}/dispatches`, {
    method: 'POST',
    headers: github,
    body: JSON.stringify({ ref: 'main' }),
  });
  console.log(`::error::Started a Deploy run: ${reason}`);
  process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`::error::[sync] ${error.message}`);
    process.exit(1);
  });
}
