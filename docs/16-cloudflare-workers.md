# Hosting on Cloudflare Workers

The website is served by Cloudflare Workers static assets, with one Worker script in front of
`/api/*`. This is the active deployment runbook. It replaces the Vercel setup in
[14-vercel-preview.md](14-vercel-preview.md) and the Cloudflare Pages steps in
[09-deployment.md](09-deployment.md), both kept for history.

One rule: **rehearse on workers.dev, pass the checks there, and only then touch the real domain.**

## Shape

| Piece               | Where                                                                                                                                                                                                                                                                                                                         |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Worker config       | `wrangler.jsonc`. Top level is the rehearsal (`sko-website` on workers.dev); `env.production` is `sko-website-production` on `www.sko-samatapheapkhnom.org`.                                                                                                                                                                  |
| Worker script       | `worker/index.ts`. Only `/api/*` reaches it (`assets.run_worker_first`). It answers `/api/contact` through `functions/api/contact.ts` and hands everything else back to static assets.                                                                                                                                        |
| Static site         | `dist/`, built by `npm run build`. Missing pages get the nearest `404.html`; `scripts/not-found.mjs` copies the Khmer page to `dist/km/404.html` so `/km/*` misses are Khmer.                                                                                                                                                 |
| Headers and caching | `public/_headers`. Applies to static responses only; the Worker sets its own headers on `/api/*`.                                                                                                                                                                                                                             |
| Rate limiting       | KV binding `RATE_LIMIT_KV`, one namespace per environment (IDs in `wrangler.jsonc`). Best effort, fails open; Turnstile is the control that fails closed.                                                                                                                                                                     |
| Build-time values   | `PUBLIC_*` variables. Locally in `.env`; in CI as repository variables. `PUBLIC_DEPLOYMENT_ENV` is always set explicitly.                                                                                                                                                                                                     |
| Runtime values      | `PUBLIC_DEPLOYMENT_ENV` and `CONTACT_ENABLED` are plain `vars` in `wrangler.jsonc`. Everything else is a Wrangler secret: `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `MAIL_FROM`, `CONTACT_TO_EMAIL`, `PARTNER_TO_EMAIL`. Locally, `.dev.vars`; when that file is absent `wrangler dev` falls back to `.env` and `.env.local`. |

`compatibility_date` is pinned to the date of the workerd build that ships with the installed Wrangler.
Bump it when Wrangler is upgraded; a date newer than the local runtime makes `wrangler dev` refuse to start.

Trailing slashes: Astro writes `about/index.html` and Workers' default `auto-trailing-slash` serves it
at `/about/`, redirecting `/about` once. Do not change either side alone.

## Commands

| Command                                          | What it does                                                                                                                                            |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run check`                                  | The one command: tests, typecheck, build with CSP and structural checks. CI runs it; nothing deploys unless it passes.                                  |
| `npm run preview`                                | Builds, then serves `dist/` with the Worker under `wrangler dev`. The honest local preview; the form endpoint exists only here, not under `astro dev`.  |
| `npx wrangler deploy --dry-run --env production` | Validates the production config and bundle without deploying.                                                                                           |
| `npm run deploy:rehearsal`                       | Deploys the top-level environment to workers.dev. The empty `--env ""` is deliberate: once a named environment exists Wrangler needs it.                |
| `npm run deploy:production`                      | Deploys `env.production`. From CI only once the deploy workflow exists.                                                                                 |
| `npm run check:edge -- <base-url>`               | Live checks: routes, both 404 pages, headers, caching, API behaviour, indexing state. Add `--indexable` on the day production stops shipping `noindex`. |
| `npx wrangler versions list --env production`    | Deployed versions.                                                                                                                                      |
| `npx wrangler rollback --env production`         | Restores the previous Worker and its files. It does not undo DNS, Redirect Rules, secrets or KV contents.                                               |
| `npx wrangler secret put NAME --env production`  | Sets a runtime secret. A person runs this from their own terminal.                                                                                      |

## Rehearsal (workers.dev)

1. Build in preview mode with the rehearsal's own URL as `PUBLIC_SITE_URL`:
   `PUBLIC_DEPLOYMENT_ENV=preview PUBLIC_SITE_URL=https://sko-website.maplematernity-api-825.workers.dev npm run check`
2. `npm run deploy:rehearsal`. Note the URL it prints.
3. Set the runtime secrets on the rehearsal with `npx wrangler secret put NAME` (no `--env`). Test values are fine; `CONTACT_ENABLED` is `false` in the config so nothing delivers.
4. Add the workers.dev hostname to the Turnstile widget (Cloudflare dashboard → Turnstile).
5. `npm run check:edge -- https://sko-website.maplematernity-api-825.workers.dev` must be all green, and the
   page must not be indexable (preview builds emit `noindex` and a disallow-all robots file).
6. Walk the real journeys on a phone and a desktop.

## Cutover to the domain

The zone is already on Cloudflare nameservers. A person does the dashboard steps.

1. **Free the hostname.** Delete the `www` CNAME that points at Vercel. Wrangler refuses to create a
   custom domain over an existing record.
2. **Deploy production.** `npm run deploy:production` (or the deploy workflow). Wrangler creates the
   custom domain, its DNS record and its certificate.
3. **Apex placeholder.** DNS → add `AAAA`, name `@`, content `100::`, Proxied. It never receives
   traffic; it lets Cloudflare answer for the apex. If an apex record exists, switch it to Proxied.
4. **Apex to www.** Rules → Redirect Rules → create. Wildcard pattern, request URL
   `https://sko-samatapheapkhnom.org/*`, target `https://www.sko-samatapheapkhnom.org/${1}`, 301,
   preserve query string. Ignore the built-in template; it points the wrong way.
5. SSL/TLS → turn on **Always Use HTTPS**.
6. Verify from the authoritative server, not the local resolver:
   `dig +short A www.sko-samatapheapkhnom.org @hadlee.ns.cloudflare.com`, then
   `curl -sI https://www.sko-samatapheapkhnom.org/` shows `server: cloudflare`,
   `curl -sI "https://sko-samatapheapkhnom.org/x/?q=1"` is a 301 to the www URL, and
   `npm run check:edge -- https://www.sko-samatapheapkhnom.org` passes.
7. Perform the one real business action once forms are enabled: submit each form, confirm delivery.

## Deploying from CI

After cutover nobody deploys from a laptop.

- A person creates the API token: My Profile → API Tokens → template **Edit Cloudflare Workers**,
  zone `sko-samatapheapkhnom.org` included. Use the value labelled API Token, never the Global API
  Key. Store it with `gh secret set CLOUDFLARE_API_TOKEN`; the account ID goes in
  `CLOUDFLARE_ACCOUNT_ID`.
- Public build values are repository variables: `PUBLIC_SITE_URL`, `PUBLIC_CONTENT_SOURCE`,
  `PUBLIC_CONTACT_ENABLED`, `PUBLIC_TURNSTILE_SITE_KEY`, `PUBLIC_CF_ANALYTICS_TOKEN`,
  `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `PUBLIC_SANITY_API_VERSION`.
- The deploy workflow runs `npm run check` with `PUBLIC_DEPLOYMENT_ENV=production`, then
  `wrangler deploy --env production`, then `check:edge` against the live host. Pull requests run
  `check` only.

## Rollback

`npx wrangler rollback --env production`, confirm with `check:edge`, redeploy the current version.
Do it once on purpose after launch and write down how long it took. Rollback restores files and
code only: DNS, Redirect Rules, secrets and KV contents are unaffected.

## Enabling the contact form (later)

Requires, in order: the sending domain verified in Resend (SPF and DKIM records in the zone), the
production Turnstile widget listing `www.sko-samatapheapkhnom.org`, the five secrets set on
`env.production`, `PUBLIC_CONTACT_ENABLED=true` at build time and `CONTACT_ENABLED` flipped to
`"true"` in `wrangler.jsonc` for production. Then submit both forms on the live site and confirm
each lands in the right inbox and not in spam.

## Still to build before the real launch

- Sanity publish → rebuild. On Workers this is a GitHub Actions `repository_dispatch` triggered by a
  Sanity webhook, not a Pages deploy hook.
- Nightly rebuild at 02:00 Asia/Phnom_Penh so expired job posts drop off (Actions cron).
- Uptime check on `/`, `/km/` and `/donate/`, alerting a named person.
- Move the zone and Worker to an SKO-owned Cloudflare account if they are not there already.

## Launch record

|                      |                                                                                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cut over             | 21 September 2026, about 13:45 Asia/Phnom_Penh                                                                                                     |
| Source               | `main` at merge commit 445d403 (PR #5)                                                                                                             |
| Worker version       | `f1938c64-3155-4870-9ec4-89dffff0fa2e` on `sko-website-production`                                                                                 |
| Deployed by          | Kimchhun, from a laptop, because CI deploys are not set up yet                                                                                     |
| Verified             | `check:edge` 28/28 against `https://www.sko-samatapheapkhnom.org`; apex → www is one 301 with path and query preserved; HTTP → HTTPS on both hosts |
| State                | Fixture content, `noindex`, forms disabled. Identical posture to the Vercel site it replaced.                                                      |
| Accepted limitations | Cloudflare account is a personal one, not SKO's; no CI deploy; no uptime check; rollback not yet rehearsed (only one version exists)               |
| Review by            | 21 October 2026, or at the first content launch, whichever comes first                                                                             |

Still open after launch, in order: remove the domain from the Vercel project and delete both Vercel
projects; decide where the CI deploy token lives and add `deploy.yml`; rehearse a rollback once a
second version exists; add the production hostname to the Turnstile widget; set the five production
secrets; add an uptime check with a named recipient.
