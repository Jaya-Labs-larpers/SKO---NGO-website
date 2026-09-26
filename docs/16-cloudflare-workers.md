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

## Publishing from the Studio

The site reads Sanity at build time, so a publish reaches the live site only through a deploy. A
Sanity webhook runs the Deploy workflow on every publish. A person sets it up once:

- Token: GitHub → Settings → Developer settings → fine-grained token, resource owner
  `Jaya-Labs-larpers`, only the `SKO---NGO-website` repository, one permission: **Actions: Read and
  write**. Not Contents: the token lives in Sanity, and Actions cannot touch the code. The org
  requires an owner to approve the token (Org Settings → Personal access tokens → Pending requests);
  until then every delivery gets a 403. Note its expiry date and replace it in the webhook before
  then.
- Webhook: sanity.io/manage → project `xm91vtfk` → API → Webhooks → Create.
  - URL `https://api.github.com/repos/Jaya-Labs-larpers/SKO---NGO-website/actions/workflows/deploy.yml/dispatches`
  - Dataset `production`; trigger on create, update and delete; drafts and versions off.
  - Projection `{"ref": "main"}`; method POST.
  - Headers `Authorization: Bearer <token>` and `Accept: application/vnd.github+json`.
- Check: publish any small edit, and a Deploy run appears under Actions within seconds.
- Delivery log: `npx sanity hook logs "Rebuild site on publish"` from `studio/`. A 204 is a
  delivered publish.
- Safety net: the Content sync workflow runs every 15 minutes. If a publish is 10 minutes old and no
  deploy picked it up, it starts one and fails, which emails its last committer. A failing run means
  the webhook needs attention. Deletions are not detected; the nightly rebuild covers them.

Deploys queue one at a time and a newer pending run replaces an older one, so a burst of publishes
builds once or twice, not once per edit. Until `PUBLIC_CONTENT_SOURCE` is `sanity` those runs
still build from fixtures, harmlessly.

To seed an empty dataset from the fixtures, see `scripts/sanity-seed.mjs`.

## Rollback

Automatic: the Deploy workflow records the live version before deploying. If the live checks fail
after the deploy, it rolls back to that version, reruns the live checks and leaves the run failed,
so GitHub emails. The site then serves the previous build, including its older Sanity content,
until the cause is fixed and a deploy passes. Content sync reports the failed deploy but does not
retry it.

Manual: `npx wrangler rollback --env production`, confirm with `check:edge`, redeploy the current
version. Rollback restores files and code only: DNS, Redirect Rules, secrets and KV contents are
unaffected.

## Enabling the contact form (later)

Requires, in order: the sending domain verified in Resend (SPF and DKIM records in the zone), the
production Turnstile widget listing `www.sko-samatapheapkhnom.org`, the five secrets set on
`env.production`, `PUBLIC_CONTACT_ENABLED=true` at build time and `CONTACT_ENABLED` flipped to
`"true"` in `wrangler.jsonc` for production. Then submit both forms on the live site and confirm
each lands in the right inbox and not in spam.

## Automation and remaining ownership

- The Sanity publish webhook is configured to dispatch the Deploy workflow; its GitHub token scope
  still needs review.
- A nightly rebuild is scheduled at 02:00 Asia/Phnom_Penh so expired job posts drop off.
- The Uptime workflow checks the live site every 15 minutes. A manual run passed 28/28 checks on
  2026-09-24.
- Move the zone and Worker to an SKO-owned Cloudflare account.

## Launch record

|                      |                                                                                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cut over             | 21 September 2026, about 13:45 Asia/Phnom_Penh                                                                                                     |
| Source               | `main` at merge commit 445d403 (PR #5)                                                                                                             |
| Worker version       | `f1938c64-3155-4870-9ec4-89dffff0fa2e` on `sko-website-production`, deployed by Kimchhun from a laptop because CI was not yet wired                |
| CI deploys           | Active since 10:05 UTC the same day. First CI deploy: version `9ff8cdd6-22bb-446b-9860-303455f271c8`, 28/28 live checks from the runner            |
| Verified             | `check:edge` 28/28 against `https://www.sko-samatapheapkhnom.org`; apex → www is one 301 with path and query preserved; HTTP → HTTPS on both hosts |
| Rollback rehearsed   | Yes, same day: `wrangler rollback` to `f1938c64`, confirmed live, rolled forward to `9ff8cdd6`. Round trip about 22 seconds                        |
| Vercel               | Both projects deleted the same day. `vercel.json` and the Vercel test removed in PR #9                                                             |
| State                | Fixture content, `noindex`, forms disabled. Identical posture to the Vercel site it replaced                                                       |
| Accepted limitations | Cloudflare account is a personal one, not SKO's; no uptime check yet                                                                               |
| Review by            | 21 October 2026, or at the first content launch, whichever comes first                                                                             |

Still open after launch, in order: add the production hostname to the Turnstile widget; set the five
production secrets; add an uptime check with a named recipient; move the zone and Worker to an
SKO-owned account before the content launch.
