# Deployment readiness review — 14 September 2026

The project compiles and serves locally, but is not ready for a public production launch. A successful build currently allows unfinished content and missing production settings. Push through a reviewed branch first; do not assume a push to `main` is safe if the hosting platform automatically deploys that branch.

**Target clarified: Vercel Hobby.** Vercel Hobby is a hosting plan, not a domain; the actual production hostname has not been supplied. The local Cloudflare checks below are evidence about the existing implementation, not proof of Vercel compatibility. The Vercel instructions here supersede the Cloudflare deployment steps in `docs/09-deployment.md`.

## Additional blockers for Vercel

- **Contact forms have no Vercel backend.** The only handler is `functions/api/contact.ts`, with Cloudflare's `onRequest` export and environment bindings. Vercel does not use that entrypoint. Keep the Astro pages static and port the handler to a root `api/contact.ts` Vercel Node function, or deliberately use Astro's Vercel adapter for an on-demand API route. Preserve the `/api/contact` URL, validation, Turnstile verification and email routing. Runtime secrets must come from Vercel's environment, and client IP extraction must use trusted Vercel request metadata rather than `CF-Connecting-IP`. See [Vercel Node functions](https://vercel.com/docs/functions/runtimes/node-js).
- **Security headers and redirects need Vercel configuration.** Cloudflare's `_headers`, `_redirects` and `wrangler.toml` do not configure the Vercel deployment. Translate headers, cache rules and applicable redirects into `vercel.json`. Preserve per-page CSP generation in `scripts/csp.mjs`. Include frame restrictions because the CSP meta policy cannot express `frame-ancestors`. Implement localized 404 behavior without overriding existing assets or `/api/contact`. See [Vercel project configuration](https://vercel.com/docs/project-configuration).
- **Cloudflare KV is not a Vercel binding.** Replace the rate limiter with a shared external store or a supported platform control. An in-memory counter is unreliable across serverless instances. Until that is implemented, explicitly acknowledge that only Turnstile provides the primary abuse check; do not claim KV limiting works on Vercel.
- **Hobby eligibility and limits need consideration.** Vercel restricts Hobby to non-commercial personal use. Its fair-use guidance explicitly permits asking for donations, so donation requests alone do not disqualify this site. Paid development or other financial gain can affect eligibility; verify suitability for the organization if applicable. Hobby also lacks paid team collaboration and can pause features when quotas are exceeded. See [fair-use guidelines](https://vercel.com/docs/limits/fair-use-guidelines) and [Hobby plan](https://vercel.com/docs/plans/hobby).

The dependency audit table below records the initial review. Lockfiles have subsequently changed in the shared workspace; the refreshed website production audit still fails, but initial transitive-package totals must not be treated as current after those updates. Re-run all audits and verification against the final commit.

This review checked repository configuration, local builds, dependency advisories, and local Cloudflare Pages HTTP behavior. Cloudflare dashboard settings, GitHub branch protection, DNS, live browser behavior, CMS publishing, and real email delivery were not verified. No deployment or push was performed.

## Verified progress

| Check | Result |
| --- | --- |
| Website `npm run typecheck` | Pass: 98 files, no errors, warnings, or hints |
| Website `npm run verify` | Pass: 46 pages built and structurally checked |
| CSP post-build processing | Pass: 46 page policies, 202 inline-script hashes |
| Studio locked installation | Pass; installed separately from the website |
| Studio typecheck and production build | Pass; build warnings described below |
| Local Pages normal routes | English and Khmer home/contact pages, About, and Donate return 200 with expected language |
| Local Pages security headers | Tested HTML responses include CSP frame restrictions and HSTS |
| Contact endpoint | GET returns 405; malformed JSON 400; wrong media type 415; invalid fields 400; honeypot 200 without sending |
| Missing Khmer route | Returns 404 with English markup; intended Khmer fallback is broken |
| Production dependency audit | Fails: 1 critical, 4 high affected packages |
| Full website dependency audit | Fails: 1 critical, 8 high affected packages, including deployment tooling |
| Studio production dependency audit | Fails: 6 high, 4 moderate affected packages |

Audit totals count affected packages, including transitive dependencies; they are not counts of independently exploitable vulnerabilities in the deployed website. Studio installation used `--ignore-scripts`; this review does not replace a clean CI installation with normal lifecycle scripts. Browser automation was unavailable, so no visual, console, or Lighthouse pass is claimed.

## Fix before public launch

1. **Resolve the remaining Astro dependency finding and verify the final lockfiles.** The refreshed production audit after workspace updates reports one critical affected package, Astro; the initial four high production-package findings are no longer present in that audit. The critical image-processing advisory is patched in Astro 7.2.8 with Sharp 0.35.4. The existing CI production audit still fails. Refresh the full website and Studio audits against the final commit before choosing fixes; the original Studio audit suggested a major Sanity upgrade, so do not blindly run `npm audit fix --force`. Re-run builds, typechecks, audits, and runtime checks after updates. The website is static and this review found no Astro image endpoint; the advisory requires processing an untrusted AVIF image, so the audit does not establish live remote-code execution on this site. See the [Astro advisory](https://github.com/withastro/astro/security/advisories/GHSA-26w7-cxv4-gfx2).

2. **Add a production configuration gate.** `src/lib/config.ts` defaults to localhost and accepts an empty CMS ID or Turnstile key. `scripts/check-build.mjs` checks structure, not readiness. On production builds, require an HTTPS production URL, a real Turnstile site key, and the chosen production content source. Reject test keys and unfinished-content markers. Keep local development and review previews available explicitly. Runtime secrets need their own deployment check and form smoke test; public build validation cannot prove they exist.

3. **Finish and approve content.** The current build contains 75 occurrences of `[NEEDS SKO]` or `[PLACEHOLDER...]` across 28 HTML files. Donation bank details are `N/A`, QR images are absent, reports and sample activities need review, and substantial Khmer body text falls back to English. Confirm story/photo permission with SKO before publishing. Configuring Sanity does not guarantee all fixtures disappear: `fetchOr()` still substitutes fixtures when singleton or page queries return `null`. Require published essential documents before launch.

4. **Correct the Khmer 404 setup.** `public/_redirects` contains `/km/* /km/404/ 404`. Wrangler rejects it and parses zero valid redirect rules. Use supported localized not-found handling and test both existing and missing Khmer routes. Do not substitute a broad 200 or redirect rule that captures all valid Khmer pages. [Pages redirect documentation](https://developers.cloudflare.com/pages/configuration/redirects/) confirms that 404 rewrites are unsupported.

5. **Use the real domain consistently.** Set `PUBLIC_SITE_URL` in the hosting build environment. The current sitemap and canonical links use `http://localhost:4321`; `public/robots.txt` still names `https://example.org/sitemap-index.xml`. Generate robots from the configured URL or update it before launch. `astro.config.mjs` uses `process.env`, while page metadata uses `import.meta.env`; ensure both resolve the same URL, especially when using local `.env` files. See [Astro environment variables](https://docs.astro.build/en/guides/environment-variables/).

6. **Make form failures recoverable.** Turnstile verification has no explicit timeout or catch around its fetch/JSON parsing; network exceptions bypass the endpoint's JSON error contract. Resend and the browser submission also have no explicit timeout. Add bounded requests, controlled errors and useful server logging without enquiry content. Reset the Turnstile widget after failed submissions that consumed a token so retrying can work. Consider idempotency before adding email retries. Keep the direct email fallback visible and confirm that it is a real monitored inbox.

## Vercel hosting configuration

| Setting | Required configuration |
| --- | --- |
| Vercel project | Import the Git repository; Framework Preset **Astro**; production branch `main` after protection is enabled |
| Repository root / output | Repository root / `dist` |
| Node | Select a supported version matching CI and the package engine; pin the tested major consistently rather than relying on the open-ended `>=22` range |
| Installation | Locked installation with `npm ci` |
| Build command | Explicitly use `npm run verify` so the custom build script generates CSP and structural checks run; add the missing production configuration gate before launch |
| Public build values | `PUBLIC_SITE_URL`, `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `PUBLIC_SANITY_API_VERSION`, `PUBLIC_TURNSTILE_SITE_KEY` |
| Runtime secrets | `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY` |
| Runtime email settings | `MAIL_FROM`, `CONTACT_TO_EMAIL`, `PARTNER_TO_EMAIL` |
| Rate limiting | Configure the chosen shared store/platform control; Cloudflare `RATE_LIMIT_KV` does not carry over |
| Optional analytics | `PUBLIC_CF_ANALYTICS_TOKEN`; omission does not break the site |
| Production URL | Set `PUBLIC_SITE_URL` to the assigned stable `https://<project>.vercel.app` hostname or the final custom domain; never localhost or an individual preview URL |

Configure Production and Preview separately. Preview should use test recipient inboxes and separate credentials/resources so review submissions do not contact staff or spend production quotas. Protect review URLs as appropriate and prevent search indexing.

Static Astro pages can deploy directly to Vercel; an SSR adapter is not required simply to serve `dist`. A root Vercel API function can provide the contact endpoint separately. Do not rely on a generic `astro build` command that bypasses the repository's CSP post-build step. Verify the actual Vercel build output includes the function as well as the static assets. See [Astro on Vercel](https://vercel.com/docs/frameworks/frontend/astro).

Turnstile remains usable on Vercel. Add the actual production hostname to its widget; wildcard characters are not supported. Vercel preview aliases may be sibling hostnames rather than subdomains of the stable project hostname, so authorize deliberate stable preview aliases or use separate test keys in protected previews. Never authorize all of `vercel.app`. See [Turnstile hostname management](https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/).

For Resend, verify the sending domain and its prescribed DNS records, use a sending-only API key, and ensure `MAIL_FROM` matches the verified domain. Confirm delivery and correct reply-to behavior in the actual general and partner inboxes.

For Sanity, create/configure the public publication dataset, publish essential documents, and set Studio project/dataset/hostname values. Configure credentialed CORS for the authenticated Studio's own local and hosted origins; the existing runbook omits the hosted Studio origin and lists local Studio access without credentials. Website build-time reads do not need browser CORS. See [Sanity Studio CORS guidance](https://www.sanity.io/docs/astro/embedding-studio-in-astro).

Studio builds warn that `autoUpdates` belongs under `deployment.autoUpdates`, and that without an app ID the Studio follows the latest update channel. Choose a deliberate update policy and configure version selection if predictable releases are required.

## Reliability and release procedure

- Protect `main` and require website, Studio, and Lighthouse CI jobs before merging. An automatic Vercel Git deployment must not be assumed to wait for arbitrary GitHub checks. Essential deployment checks should run in the deploy build too, including CMS-triggered builds. Build with production environment values before promotion: static `PUBLIC_*` values baked into a preview are not rewritten when it is promoted.
- Use SKO-controlled ownership and MFA. Confirm access to the existing GitHub repository and all service accounts. Hobby's lack of paid team collaboration requires an explicit handover/recovery plan; do not share passwords to imitate team access.
- Ignore `.vercel/` before linking the local project, and `.dev.vars` / `.dev.vars.*` if retaining Cloudflare local testing. `.env` is ignored and currently untracked; no complete historical secret scan is claimed.
- Create the Sanity publish/delete webhook to a secret Vercel Deploy Hook and a scheduled rebuild for date-sensitive content. Test publishing and deletion. The existing Pages hook must be replaced. Stored job deadlines currently use UTC dates, so review expiry semantics for Cambodia time. See [Vercel Deploy Hooks](https://vercel.com/docs/deploy-hooks).
- KV limiting is best effort: it fails open, reads/writes are not atomic, and expiration is refreshed on every write. Do not promise a strict five-per-ten-minutes limit. Add upstream abuse controls if strict limits are needed and monitor KV errors.
- Review HSTS before translating the Cloudflare header policy to Vercel: the repository specifies one year with `includeSubDomains; preload`. Verify every affected subdomain supports HTTPS and choose a conservative rollout if domain readiness is uncertain. The header alone does not register a preload submission.
- Add uptime checks for English/Khmer homepages and Donate, deployment failure alerts, and enquiry delivery monitoring. Record a last-known-good deployment and rehearse rollback. Static pages remain available during a CMS outage, but publishing depends on successful builds; enquiries depend on Turnstile and Resend at request time.
- Before announcement, test mobile navigation, language switching, fonts, donation QR scans and bank details, PDF downloads, CSP/browser console, live sitemap and robots, general/partner email delivery, CMS publish/delete, and rollback. A 200 response alone does not verify usable content.

No setting can guarantee that a deployment never breaks. The release should proceed only when the dependency blockers are resolved, content and settings are approved, CI passes, and a configured preview passes the complete flow.
