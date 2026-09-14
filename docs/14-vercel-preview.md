# Vercel preview deployment

Vercel is the chosen website host. Keep Astro and Sanity; do not follow the
Cloudflare upload commands in `docs/09-deployment.md` for this deployment.
The existing Cloudflare project has no website deployment and is not used here.
Cloudflare deployment files and the Wrangler preview dependency have been removed.
The shared `functions/api/contact.ts` remains because the Vercel API imports it.

## Preview settings

- Framework: Astro; repository root; Node 22.x.
- Installation: `npm ci`; build: `npm run build:vercel`; output: `dist`.
- Deploy to Preview, not Production. Vercel supplies a `vercel.app` URL; a custom
  domain is not required.
- Set `PUBLIC_CONTENT_SOURCE=fixtures`, `PUBLIC_CONTACT_ENABLED=false`, and
  `CONTACT_ENABLED=false` in Preview. Do not add production email credentials.
- Vercel sets `VERCEL_ENV=preview`; the build infers preview mode, renders review
  notices, and emits noindex and disallow-crawling directives. These directives
  are not authentication: if the deployment is public, anyone can view it.
- Without `PUBLIC_SITE_URL`, metadata uses `https://${VERCEL_URL}`. Set an explicit
  HTTPS origin only if using a deliberate stable review alias.
- Existing Vercel deployment protection is retained. Account owners can review
  protected previews while signed in. Public sharing is a separate dashboard decision.
- `.vercelignore` excludes local environment files, Studio, and review documents.
  Studio remains a separately hosted CMS editor, not a nested Vercel application.

`vercel.json` translates security headers and asset caching. Filesystem lookup
comes before localized 404 fallbacks so real Khmer pages and assets stay static.
`api/contact.ts` provides Vercel's Web Standard handler, rejects POST with 503
while delivery is disabled, and rejects other methods with 405. The browser
form has a disabled fieldset and a visible notice; it does not render Turnstile.

## Verification and upload

```sh
PUBLIC_DEPLOYMENT_ENV=preview PUBLIC_CONTENT_SOURCE=fixtures npm run build:vercel
npm --prefix studio test
npm --prefix studio run typecheck
SANITY_STUDIO_PROJECT_ID=abc12345 npm --prefix studio run build
npm audit --audit-level=moderate
npm --prefix studio audit --audit-level=moderate
vercel whoami
vercel link
vercel pull --environment=preview
vercel build
vercel deploy --prebuilt
```

Link to the intended owner/project and verify the Preview environment first.
Never promote a fixture preview to Production. Production builds still require
approved content and real CMS/domain/Turnstile settings.

After upload, verify English/Khmer home, About and Donate routes, CSS/fonts,
missing English and Khmer routes (404, not 200), trailing-slash API behavior,
GET /api/contact (405), POST /api/contact (503, no delivery), security headers,
robots, noindex, mobile menu, language switch and browser console. Use
`vercel curl` when existing deployment protection requires authentication.

## Before enabling delivery or public launch

Configure approved Sanity content and the real Turnstile widget/secret, Resend
sender and recipient inboxes. Preview delivery, if deliberately enabled, must
use separate test recipients and resources. Both `PUBLIC_CONTACT_ENABLED=true`
(build time) and `CONTACT_ENABLED=true` (runtime) are needed to enable the form.

Vercel does not provide the Cloudflare KV binding. The shared handler accepts
`CONTACT_WAF_RATE_LIMIT_ENABLED=true` instead in Production only after the
operator has configured, published and tested the actual firewall rule. This
variable is an operator acknowledgement, not a rate limiter, and must not be
set merely to bypass the production check. Do not enable delivery before the
firewall protection is effective.

Rate-limit `/api/contact` and its trailing-slash alias at the Vercel WAF before
function execution. Start with generous per-IP limits in log mode, review the
matched traffic, enforce in Preview, then enforce in Production. Return 429
when over limit. Retain Turnstile, 32-KiB body limits, five-second body deadlines
and eight-second service deadlines. Counters are regional, not a strict global
quota; shared IPs can include legitimate visitors. Hobby allows one rate-limit
rule per project and three total custom rules.

Monitor Firewall traffic, edge requests, function invocations/errors, deployment
failures and Resend quotas/delivery. Add uptime checks and test a last-known-good
rollback. Create a secret Sanity publish/delete Deploy Hook and test rebuilds.

During a targeted attack, the account owner can open Project > Firewall > Bot
Management and enable Attack Mode. It is free on Hobby but can challenge real
visitors and disrupt unrecognized automated clients. Check CMS hooks and form
behavior during the incident, monitor results, and disable it after the attack.
Do not enable Attack Mode permanently or disable automatic DDoS mitigation.

Confirm Vercel plan eligibility for the NGO; Hobby is for personal,
non-commercial use. Donation requests alone do not determine eligibility.

## Current checkpoint — 14 September 2026

- Created and linked `kkimchhun17/sko-website`; no website deployment was uploaded.
- GitHub connection failed for `Vsak881/SKO---NGO-website`. Direct uploads remain
  available, but automated Git deploys need repository access/integration repair.
- Root 27 tests and Studio 4 tests pass; both typechecks and Studio build pass.
- Vercel CLI 59.11.2 preview build passes after a clean locked install. Its output
  contains the Node 22 contact function and 46 static pages. Packaged HTML checks
  pass for CSP, noindex, preview notices, disabled forms and 404 fallback ordering.
- Executing the packaged contact handler returns POST 503 and GET 405 with
  delivery disabled. Actual hosted routing and browser behavior are not yet verified.
- Both npm registry audits report zero vulnerabilities. Production build remains
  intentionally blocked by development CMS/site/Turnstile settings and unapproved content.
- One unpublished firewall draft, `Contact abuse monitor`, matches exactly
  `/api/contact` and `/api/contact/`, counts by IP, and logs above 30 requests per
  60 seconds. It does not block traffic and is not active until published.
- Account owner must inspect the draft and publish the initial logging stage
  before the preview rollout continues. Then review test traffic and enforce in
  Preview before enabling form delivery. The Vercel Firewall skill requires
  human publication of firewall changes; no publication or Attack Mode change was made.

Review in [the project firewall](https://vercel.com/kkimchhun17/sko-website/firewall).
From this linked repository, the owner can publish the reviewed logging draft:

```sh
vercel firewall publish --yes
```

References: [Node functions](https://vercel.com/docs/functions/runtimes/node-js),
[WAF rate limiting](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting),
[Attack Mode](https://vercel.com/docs/vercel-firewall/attack-mode),
[Hobby](https://vercel.com/docs/plans/hobby).
