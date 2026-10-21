/**
 * Catches a Sanity publish that never reached the live site. Run hourly by the
 * production Worker's cron (worker/scheduled.ts).
 *
 * The site is built from Sanity at build time, and a Sanity webhook calls the
 * Workers Builds deploy hook on every publish. When the webhook fails (an edited
 * or deleted hook) nothing tells the editor: the publish succeeds in Studio and
 * the site keeps serving the previous build.
 *
 * This compares the newest published document with when the live Worker
 * version was created. If a publish is older than the grace period and the live
 * version predates it, the cron calls the deploy hook itself and alerts, so
 * someone fixes the webhook. If it already called the hook for that publish and
 * the site is still behind, the build failed: that is reported, not retried,
 * since the same content would fail the same way.
 *
 * Deletions are not seen, since a deleted document leaves no timestamp. The
 * nightly rebuild covers them.
 */

/** Long enough for the webhook's own build to finish and go live. */
export const GRACE_MS = 10 * 60 * 1000;

/**
 * @param {object} input
 * @param {string | null} input.publishedAt newest published document's _updatedAt
 * @param {string | undefined} input.liveAt when the live Worker version was created
 * @param {string | null} input.triggeredFor the publishedAt the cron last started a build for
 * @param {number} input.now
 * @param {number} [input.graceMs]
 * @returns {{ action: "none" | "deploy" | "report", reason: string }}
 */
export function syncDecision({ publishedAt, liveAt, triggeredFor, now, graceMs = GRACE_MS }) {
  if (!publishedAt) return { action: 'none', reason: 'no published content' };
  const published = Date.parse(publishedAt);

  if (liveAt && Date.parse(liveAt) >= published) {
    return { action: 'none', reason: `in sync with the version created at ${liveAt}` };
  }

  if (now - published < graceMs) {
    return { action: 'none', reason: `publish at ${publishedAt} is within the grace period` };
  }

  if (triggeredFor === publishedAt) {
    return {
      action: 'report',
      reason:
        `a rebuild was started for the publish at ${publishedAt} and it is still not live; ` +
        `check the build log in Workers Builds`,
    };
  }

  return {
    action: 'deploy',
    reason:
      `the publish at ${publishedAt} never reached the site; ` +
      `check the Sanity webhook "Rebuild site on publish" and its deploy hook URL`,
  };
}
