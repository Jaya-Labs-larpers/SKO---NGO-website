# Repository remediation — 14 September 2026

Repository-side fixes are implemented and locally verified. Public launch remains on hold.
The original [readiness review](12-deployment-readiness.md) is preserved as the pre-fix snapshot.
No commit, push, deployment, DNS change, dashboard change, or real enquiry email was performed.

## Codex Security remediation

Outcome: **fixed** for the reported affected dependency versions and the confirmed contact-body
enforcement defect. This was targeted remediation, not a new exhaustive repository security scan.
Codex Security's fix-finding workflow included independent read-only boundary investigation and
one independent bypass/regression review.

The website pinned Astro 7.1.6, with affected Sharp, YAML, SVG and ID-generator dependencies.
Wrangler brought a separate affected Sharp/Undici chain. These are now patched through Astro
7.3.2, Wrangler 4.131.2 and compatible lockfile updates. Both full and production website audits
report zero vulnerabilities. The repository uses static output and external Sanity image URLs;
the investigation did not establish a live attacker-controlled Astro AVIF optimization sink.
No unsafe exploit image was processed. The strongest relevant substitute was removal of all
reported affected versions, fresh registry audits and compatibility/runtime checks.

Studio's original dependency chain required an assessed upgrade: Sanity and Vision are aligned
at 6.13.2, compatible with the existing schemas/plugins and Node >=22.12. Its newer CLI brought
additional pinned transitive findings. Narrow overrides patch only these parent/leaf pairs:

| Parent                          | Patched leaf                        |
| ------------------------------- | ----------------------------------- |
| `@vercel/frameworks`            | `js-yaml` 3.15.2, `smol-toml` 1.8.0 |
| `@module-federation/dts-plugin` | `adm-zip` 0.6.1                     |
| `typeid-js`                     | `uuid` 11.1.1                       |

No blanket forced audit fix was used. Full and production Studio audits also report zero
vulnerabilities. Tests exercise normal archive/config parsing and TypeID round-tripping,
oversized ZIP output metadata and destination-symlink overwrite rejection. Revisit these overrides
when upstream parent requirements adopt patched leaves.

The confirmed contact path was HTTP body → unbounded `request.text()` → UTF-16 length check → JSON
parser. Missing or deceptive Content-Length and multibyte UTF-8 bypassed the intended early byte
boundary. `functions/api/contact.ts` now reads at most 32 KiB into a fixed-size buffer, cancels
overflow, enforces a five-second total body deadline, and rejects invalid UTF-8 before JSON parsing.
Regression tests show oversized multibyte and chunked bodies no longer reach normal processing,
while the exact byte limit remains accepted. The review identified stalled KV operations as a
remaining bounded-request gap; one-second read/write deadlines now preserve fail-open limiting.

Turnstile and Resend requests have eight-second abort deadlines. Verification network/JSON failures
return controlled 503 JSON rather than escaping the endpoint. No enquiry contents, IPs, tokens or
secrets are included in new failure logs. Browser requests have a 25-second deadline and reset only
their submitted widget after success, validation rejection or failure. Failed submissions preserve
entered text. No automatic email retry was added because delivery can succeed before a timeout.
Valid general/partner tests preserve recipient routing, escaping and reply-to behavior.

## Readiness and release changes

- `astro.config.mjs` loads local environment files consistently with page configuration. Pages `main`
  builds infer production; other branches infer preview. Conflicting explicit deployment modes fail.
- `PUBLIC_DEPLOYMENT_ENV` selects development, preview or production. `PUBLIC_CONTENT_SOURCE` selects
  fixtures or Sanity; fixtures are never accepted for production.
- Production requires a real HTTPS origin, real-shaped Turnstile site key and CMS configuration.
  Missing published CMS documents no longer fall back to fixtures in production.
- Production checks require published donation QR images, complete bank account essentials and
  contact addresses; rendered unfinished markers and Khmer English fallback block the build.
  English language-switch links remain allowed. These checks do not certify financial accuracy or
  content/photo consent.
- With runtime `PUBLIC_DEPLOYMENT_ENV=production`, form configuration rejects missing KV, test-shaped
  secret keys, missing recipient settings and example-domain mailboxes before verification.
  Keep this runtime variable configured in Production as instructed by the runbook.
- `src/pages/robots.txt.ts` generates sitemap discovery from Astro's configured origin. Preview robots
  disallow crawling and preview HTML is noindex. This is not access control; protect review URLs.
- The unsupported `_redirects` 404 rule was removed. `functions/km/_middleware.ts` replaces only
  missing GET/HEAD responses with Khmer error HTML, retaining status 404 and asset security headers.
  Valid routes pass through unchanged. Khmer paths now execute a Pages Function, including valid
  Khmer pages; account for invocation quotas when configuring monitoring.
- `npm run build` now always includes CSP and structural checks. CI adds regression tests, full
  dependency audits, and Studio build/audit checks. Actual branch protection remains a dashboard gate.
- `.dev.vars` files are ignored; production/preview KV configuration examples are separated correctly.
  Studio automatic updates are disabled under `deployment.autoUpdates` for reviewed locked releases.
- [The deployment runbook](09-deployment.md) corrects unsafe first-push assumptions, authenticated Studio
  CORS, Turnstile hostnames, preview separation, HSTS rollout, scheduler setup and rollback checks.

Changed implementation/configuration files: root and Studio manifests/lockfiles, `astro.config.mjs`,
`functions/api/contact.ts`, new `functions/km/_middleware.ts`, new `scripts/readiness.mjs` and its type
declarations, `scripts/check-build.mjs`, `src/lib/config.ts`, `src/lib/content/index.ts`, `src/env.d.ts`,
the ContactForm and SeoHead components, new robots endpoint, Studio CLI configuration, CI workflow,
`.env.example`, `.gitignore`, `wrangler.toml`, and the deployment runbook. Static robots and invalid
redirect files were removed; their behavior is replaced, and their previous contents remain in Git.
Regression tests live under root and Studio `tests/`.

## Verification gates

1. Syntax/import/owning-package checks: root and Studio `npm ci`, both typechecks, website verify
   (46 structurally checked pages, CSP processing), Studio build with a non-live project ID, and
   `git diff --check` pass.
2. Security trigger/alternate representations: fresh full and production audits for both packages
   report zero findings. Contact tests cover omitted/deceptive lengths, UTF-8 byte overflow, chunked
   cancellation, exact boundary, stalled bodies/KV, verification errors and production misconfiguration.
   Studio tests cover malicious archive metadata and symlink extraction alongside legitimate controls.
3. Legitimate controls/regressions: root and Studio tests pass. Local Pages HTTP checks show English
   and Khmer normal routes 200, missing Khmer routes localized 404 (with or without trailing slash),
   missing English route English 404, and Khmer HEAD 404 with an empty body. Contact rejects malformed
   JSON/fields with 400, oversized multibyte JSON with 413 and GET with 405 without sending email.
   A test-origin build confirms canonical, sitemap and robots use the same origin; preview crawling
   directives were checked separately.

`npm run build:production` **intentionally fails** with current development settings. Applying the
production rendered-content checker to the fixture build also fails on unfinished markers and
translation fallback. These failures prove the launch gate is active, not that production is ready.

Initial network/loopback restrictions required approved local audit/install/preview checks. Studio
installation warns about environment-level lifecycle approval for esbuild/fsevents; clean installs,
typechecks and builds passed under that policy. Node's mock-timer tests emit an experimental API
warning. No full historical secret scan, browser/Lighthouse pass or live CMS verification is claimed.

## Still required before launch

Supply approved domain/CMS/Turnstile/Resend settings and distinct preview resources/inboxes; publish
approved English/Khmer content, QR images and bank details; enable branch protection; configure DNS,
monitoring, secret rebuild hooks and scheduler; then test real browser behavior, delivery, CMS
publish/delete and rollback. Local checks cannot verify these external requirements.
