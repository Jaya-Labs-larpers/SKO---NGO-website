# Task: apply the automatable security configuration for the SKO website

You are working in `/Users/kimchhun/Site/NGO-website`, the repository
`Jaya-Labs-larpers/SKO---NGO-website` (default branch `main`). It is a static
Astro site served by Cloudflare Workers, with a Sanity Studio in `studio/`.
Production deploys run from `.github/workflows/deploy.yml` on every push to
`main` and on `workflow_dispatch` (a Sanity webhook calls it on publish).
Read `AGENTS.md`, `docs/16-cloudflare-workers.md` and `docs/SECURITY.md`
before changing anything.

A security audit on 2026-09-24 found the application code complete and the
configuration layer incomplete. Your job is the part that needs no human-held
values. Do all of it, in the order below, and report what you did, what you
verified, and what you skipped and why.

## Facts you can rely on (verify each before acting on it)

- GitHub CLI is logged in as `kkimchhun17`, who has admin on the repo.
- Verify workflow job ids, which are the status-check contexts: `verify`,
  `lighthouse`, `studio`. Do not require `claude-review`.
- Sanity project `xm91vtfk`, dataset `production`, API version `2026-01-01`.
  All three are public values.
- Production URL: `https://www.samatapheapkhnom.org`.
- GitHub environments: `Production` is live (deploy.yml's `production`
  resolves to it; last deployment today). `Preview`, `Preview – sko`,
  `Preview – sko-website` and `Production – sko` are Vercel leftovers with no
  deployments after 2026-09-21.
- Existing repo variables: `PUBLIC_SITE_URL`, `PUBLIC_CONTENT_SOURCE=fixtures`,
  `PUBLIC_CONTACT_ENABLED=false`. Existing secrets: `CLOUDFLARE_API_TOKEN`,
  `CLOUDFLARE_ACCOUNT_ID`, `CLAUDE_CODE_OAUTH_TOKEN`.
- `scripts/check-edge.mjs` needs only Node's global `fetch`, no `npm ci`.
- Action SHAs already pinned in `verify.yml`: reuse them for any new workflow.
- `video/package.json` exists and has its own lockfile.

## Hard rules

- Never print, log, commit or echo a secret value. Names only.
- Do not set any Wrangler secret, do not change `CONTACT_ENABLED` or
  `PUBLIC_CONTACT_ENABLED`, do not touch `wrangler.jsonc`.
- Do not change any dependency version. All versions in this repo are pinned
  exactly; keep it that way.
- No comments in code unless they capture something the code cannot
  (see `AGENTS.md`). No unrequested refactors.
- After every GitHub or Sanity API write, read the setting back and confirm it
  matches before moving on.
- If an API call returns 403 or a setting cannot be applied, do not retry with
  a workaround. Record it as skipped and continue.
- Do not merge the pull request. Do not push directly to `main`.

## Part 1: repository changes (on a branch, via pull request)

1. `git fetch` and fast-forward `main` to `origin/main` (the local checkout is
   behind). Create branch `security-config-automation` from it.

2. Add `.github/dependabot.yml`:
   - `npm` at `/`, `/studio` and `/video`; `github-actions` at `/`.
   - Weekly schedule, `versioning-strategy: increase` so exact pins stay exact.
   - Group minor and patch updates per ecosystem to limit PR noise; leave
     majors ungrouped.
   - `open-pull-requests-limit` of 5 per ecosystem.

3. Add `.github/workflows/uptime.yml`:
   - `on.schedule` every 15 minutes plus `workflow_dispatch`.
   - `permissions: contents: read`. Concurrency group `uptime`,
     `cancel-in-progress: true`.
   - Steps: pinned `actions/checkout` (same SHA as `verify.yml`,
     `persist-credentials: false`, `fetch-depth: 1`), pinned
     `actions/setup-node` with `node-version-file: .nvmrc`, then
     `node scripts/check-edge.mjs https://www.samatapheapkhnom.org`.
     No `npm ci`.
   - Add a leading comment block only for what the file cannot say itself:
     that GitHub emails the workflow's last committer on failure, that
     scheduled runs are best-effort and can lag, and that GitHub disables
     schedules after 60 days without repository activity.

4. In `.github/workflows/deploy.yml`, add `on.schedule` with cron
   `0 19 * * *` (02:00 Asia/Phnom_Penh, UTC+7) so date-sensitive content
   drops off nightly, as `docs/16-cloudflare-workers.md` lists under
   "Still to build". Change nothing else in that file.

5. Add `scripts/check-config.mjs` and an npm script `check:config` that runs
   it. It prints a configured-versus-missing table covering:
   - GitHub: which of these repo variables exist: `PUBLIC_SITE_URL`,
     `PUBLIC_CONTENT_SOURCE`, `PUBLIC_CONTACT_ENABLED`,
     `PUBLIC_TURNSTILE_SITE_KEY`, `PUBLIC_CF_ANALYTICS_TOKEN`,
     `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`,
     `PUBLIC_SANITY_API_VERSION`; which secrets exist by name
     (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`); whether a ruleset
     targets the default branch; whether Dependabot alerts are enabled; the
     `Production` environment's branch policy. Use `gh api` and `gh variable
list --json`; parse JSON, do not scrape tables.
   - Cloudflare: `npx wrangler secret list --env production` and `--env ""`,
     reporting presence of `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`,
     `MAIL_FROM`, `CONTACT_TO_EMAIL`, `PARTNER_TO_EMAIL` per environment.
   - Sanity, run through the Studio's CLI (`npm --prefix studio exec -- sanity
… --project-id xm91vtfk`), checking each subcommand with `--help` first:
     dataset visibility is `public`, `tokens list` is empty, `cors list`
     contains no wildcard and only `http://localhost:3333` and
     `https://sko-studio.sanity.studio`, `hooks list` contains "Rebuild site
     on publish", `users list` member count and roles.
   - Live: reuse `scripts/check-edge.mjs` by spawning it against the
     production URL and reporting pass/fail counts.
   - Every row is PASS, MISSING or SKIPPED (tool not available or not logged
     in). Exit 1 if anything is MISSING. Never print a secret value; if a
     command's output could contain one, print only names or counts.
   - Extract the pure parts (row formatting, parsing of each tool's JSON
     into rows) into exported functions and cover them with
     `tests/check-config.test.mjs` using `node:test`, matching the style of the
     existing tests. Do not test against live services.

6. Update `docs/SECURITY.md` in place, minimal edits, and add a dated note at
   the top saying it was refreshed on 2026-09-24:
   - HSTS row: the live header is `max-age=31536000` without
     `includeSubDomains` or `preload`; say so and point to the reasoning in
     `docs/12-deployment-readiness.md`.
   - FIND-007: now fixed. The Studio is on `sanity@6.13.2` with the overrides
     in `studio/package.json`, and `npm audit` is clean in both packages.
   - "Required before go-live": replace Cloudflare Pages wording with Workers
     and Wrangler secrets, and point to `docs/16-cloudflare-workers.md` as the
     runbook. Add rows to the checklist table for branch protection,
     Dependabot and the uptime workflow, marked done, once Part 2 confirms
     them.

7. Delete the untracked, git-ignored `.env.local` (a stale Vercel OIDC token).
   Confirm with `git check-ignore -v .env.local` first that it is ignored, and
   with `git ls-files .env.local` that it was never tracked.

8. Run `npm run format`, then `npm test`, `npm run typecheck`, `npm run
format:check` and `npm run build`. All must pass. Include the results in
   the report. Commit in small, single-purpose commits with plain messages.
   Push the branch and open a pull request titled "Security configuration:
   Dependabot, uptime check, config audit" whose body lists each change and
   the verification output summary.

## Part 2: account-level settings (after the PR is open; ruleset last)

9. Repo variables: `gh variable set PUBLIC_SANITY_PROJECT_ID --body xm91vtfk`,
   `PUBLIC_SANITY_DATASET` = `production`, `PUBLIC_SANITY_API_VERSION` =
   `2026-01-01`. Read back with `gh variable list`.

10. Dependabot: `gh api -X PUT repos/{owner}/{repo}/vulnerability-alerts` and
    `gh api -X PUT repos/{owner}/{repo}/automated-security-fixes`. Read back
    with `gh api repos/{owner}/{repo}` and check
    `security_and_analysis.dependabot_security_updates.status`.

11. `Production` environment: set a deployment branch policy that allows only
    `main` (custom branch policies, one pattern `main`). Do not add required
    reviewers; that would stall the Sanity-triggered deploys. Read back.

12. Delete the four stale environments `Preview`, `Preview – sko`,
    `Preview – sko-website` and `Production – sko`. Before each deletion,
    fetch `repos/{owner}/{repo}/deployments?environment=<name>&per_page=1`
    and confirm the latest deployment is older than 2026-09-22. Never delete
    `Production`. URL-encode the en dash.

13. Ruleset on the default branch, created with
    `gh api -X POST repos/{owner}/{repo}/rulesets`, enforcement `active`,
    target `branch`, include `~DEFAULT_BRANCH`, no bypass actors, rules:
    - `deletion`
    - `non_fast_forward`
    - `pull_request` with `required_approving_review_count: 0`,
      `dismiss_stale_reviews_on_push: true`,
      `require_last_push_approval: false`,
      `required_review_thread_resolution: true`
    - `required_status_checks` with contexts `verify`, `lighthouse`,
      `studio` and `strict_required_status_checks_policy: true`.
      Zero approvals is deliberate: there is one developer today. Say in the
      report that raising it to 1 is a one-line change once a second reviewer
      exists. Read the ruleset back and confirm the rules list.

14. Run `npm run check:config` from the branch and paste its table into the
    report and into a comment on the pull request.

## Final report

State, in this order: every setting applied with its read-back value, every
file added or changed, the local verification results with exact pass counts,
anything skipped and the reason, and the items that still need a person:
Wrangler production secrets (`RESEND_API_KEY`, `MAIL_FROM`,
`CONTACT_TO_EMAIL`, `PARTNER_TO_EMAIL`), `PUBLIC_TURNSTILE_SITE_KEY` and the
widget hostnames, Resend domain verification with SPF and DKIM, Sanity staff
invites, the scope of the GitHub token stored in the Sanity webhook, and the
Cloudflare account transfer. Do not claim anything works that you did not
verify.
