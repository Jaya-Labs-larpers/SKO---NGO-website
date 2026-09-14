# Targeted security remediation — 2026-09-14

## Scope and outcome

Codex Security's targeted fix-finding workflow was used for the Vercel contact API and CMS-to-HTML rendering boundaries. A fresh read-only investigator examined the findings before patch selection; a separate fresh read-only reviewer examined the candidate afterward. This is not a complete repository-wide audit or a hosted penetration test. Daybreak access was not granted; local source analysis and verification remained available.

Two concrete rendering findings were patched:

1. **CMS-to-script injection in JSON-LD.** Raw `JSON.stringify` output could contain a closing script tag. The postbuild CSP generator hashes inserted inline scripts, so CSP alone did not contain this path. `src/lib/seo/json-ld.ts` now escapes every literal `<` after serialization. All five emission sites in SeoHead, FaqSection, and Breadcrumbs use it. JSON values, bilingual text, and structured-data semantics are preserved.
2. **HTML injection in the form failure banner.** Astro's initial escaped dataset attribute became raw text when read through `dataset`, then was interpolated into `innerHTML`. Banner titles, bodies, and fallback-email text are now HTML-escaped; the recipient is percent-encoded inside a fixed `mailto:` attribute. Existing styles, routing, input preservation, widget resets, and request deadlines remain intact. Arbitrary event-handler execution under the current CSP was not demonstrated; the proven issue was HTML injection.

Explicitly enabling mail delivery in a preview is an existing capability, not by itself a validated vulnerability. The safe default remains unchanged: preview forms are disabled and the Vercel API rejects submissions unless explicitly enabled. Do not put production email credentials into an enabled public preview.

## Verification

- `node --test tests/json-ld.test.mjs tests/form.test.mjs`: four security assertions failed against the original sinks; all six focused tests passed after remediation.
- `npm test`: all 27 website tests passed, including byte limits, stalled requests, service deadlines, production configuration rejection, preview rejection, retry behavior, and the new rendering regressions.
- `npm run typecheck`: zero diagnostics; `npm run build`: all 46 pages passed structural checks and received CSP policies.
- Studio `npm test` and `npm run typecheck`: all four dependency regression tests passed; typecheck passed.
- Fresh full `npm audit --json` in both packages: zero known vulnerabilities. This is advisory coverage, not proof that dependencies contain no vulnerabilities.
- `git diff --check`: passed.
- `PUBLIC_SITE_URL= PUBLIC_CONTENT_SOURCE=fixtures PUBLIC_CONTACT_ENABLED=false vercel build`: local Vercel preview packaging passed. A direct packaged-output check confirmed POST returns 503 `preview_disabled`, GET returns 405, and all 46 HTML pages have noindex and parseable JSON-LD.
- Independent candidate review found no concrete surviving bypass or introduced regression within the patch scope. Mailto recipient encoding round-trips were checked, but actual mail-client behavior was not tested.

## Hosting measures still requiring action

The Vercel firewall rule remains an **unpublished logging draft**, not an active blocking rate limit. Review and publish it in the project dashboard, then evaluate and enforce an appropriate per-IP limit before enabling `/api/contact`. Keep Turnstile verification, request-size limits, and service timeouts. An environment acknowledgement is not evidence that a WAF rule is active.

Keep preview forms disabled until their keys, inboxes, and firewall behavior are verified. Public pages remain static. Follow `docs/14-vercel-preview.md` for firewall publication, monitoring of traffic/function/email usage, and the operator-controlled emergency Attack Mode procedure.

Live firewall enforcement, browser behavior, real CMS publication permissions, email delivery, and rollback remain unverified. No deployment, firewall publication, Attack Mode activation, commit, or push was performed during this remediation.
