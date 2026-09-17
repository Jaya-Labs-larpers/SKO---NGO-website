# Phase 5 — Security review

**Status: Phase 5 gate — awaiting sign-off.**
**Scope:** the SKO website repository, its build output, and the contact Function. Testing was
performed against a local instance only; nothing was run against a third-party system.

---

## Executive summary

Eight findings. **All six that were actionable in code are fixed and re-tested.** One is accepted
with documented rationale; one is a deployment prerequisite that cannot be closed until Phase 6.

The most important finding was not in the dependency scan — it came out of manual probing. The
site's only spam control was **failing open**: written as `if (env.TURNSTILE_SECRET_KEY) { verify }`,
a deployment that forgot the secret would have silently accepted every unverified submission with
nothing to indicate it. That is now fail-closed.

| Severity | Count | Status |
|---|---|---|
| High | 4 | Fixed |
| Medium | 2 | 1 fixed, 1 accepted |
| Low | 1 | Fixed |
| Informational | 1 | Deployment prerequisite |

Post-remediation: **`npm audit` → 0 vulnerabilities** on the site. Lighthouse unchanged
(98–100 / 100 / 100 / 100, no failing audits).

---

## Findings

### FIND-001 — Turnstile failed open when unconfigured
**Severity: High** · `functions/api/contact.ts` · CWE-703, OWASP A05:2021 · **Fixed**

The Turnstile verification was wrapped in `if (env.TURNSTILE_SECRET_KEY) { … }`. If that variable
were missing — a typo in the Cloudflare dashboard, a new preview environment, a secret rotated and
not re-added — the entire check was skipped and the endpoint accepted unverified submissions.

*Discovery:* probing a local instance with no Turnstile secret set. Requests carrying no token
reached the mail step instead of being rejected.

*Impact:* silent loss of the site's only spam control, and with it the CSRF protection described in
FIND-002. A misconfiguration would produce no error and no log — the form would simply keep working,
less safely.

*Remediation:* a missing secret now returns `500 not_configured`. A misconfiguration breaks the form
loudly instead of quietly disabling the protection.

*Verified:* secret absent → `500`; secret present and no token → `403 verification_failed`; secret
present with a valid test token → passes verification and proceeds.

---

### FIND-002 — Cross-origin form POST accepted (CSRF)
**Severity: Medium** · `functions/api/contact.ts` · CWE-352, OWASP A01:2021 · **Fixed**

The endpoint parsed any request body regardless of `Content-Type`. A cross-origin HTML form posting
as `text/plain` is a CORS *simple request*: the browser sends it without a preflight. The attacker
cannot read the response, but the side effect — an email in SKO's inbox — still happens.

*Impact:* an attacker page could cause mail to be sent to SKO from any visitor's browser. Turnstile
mitigates this in normal operation, which is precisely why FIND-001 mattered: with Turnstile
failing open, this became directly exploitable.

*Remediation:* `Content-Type: application/json` is now required, returning `415` otherwise. That
forces a preflight, which this endpoint answers with `405`.

*Verified:* `text/plain` → `415`. Cross-origin `OPTIONS` → `405` with no
`Access-Control-Allow-Origin`.

---

### FIND-003 — No request body cap before parsing
**Severity: Low** · `functions/api/contact.ts` · CWE-400 · **Fixed**

Field lengths were capped by the schema, but only *after* `JSON.parse`. An 8 MB body was parsed in
full before being rejected.

*Remediation:* a 32 KB cap, checked against `Content-Length` and again against the actual body before
parsing.

*Verified:* 8 MB body → `413 payload_too_large` (previously `400` after a full parse).

---

### FIND-004 — Astro 5.18.2: multiple XSS and SSRF advisories
**Severity: High** · `package.json` · **Fixed**

Eight advisories, including XSS in `define:vars`, unescaped slot names, unescaped spread attribute
names, and Host-header SSRF in the prerendered error page.

*Reachability, assessed before deciding:* none. `define:vars`, `transition:*`, server islands,
`ClientRouter` and SSR output modes are all unused; the single spread in `PartnerWall.astro` uses
literal attribute names (`href`, `rel`, `target`) with only values from data. The site is also fully
static, so no Astro runtime exists in production.

**Not reachable is not a sign-off.** No patched 5.x exists — 5.18.2 is the final 5.x release and the
fixes land in 6.x and 7.x. Upgraded to **astro@7.1.6**.

*Migration cost:* one compiler error. Astro 7 rejects an HTML comment inside a ternary branch in
`ResponsiveImage.astro`, which Astro 5 tolerated. Moved to a frontmatter comment.

*Verified:* 64 pages build, all structural checks pass, typecheck clean, Lighthouse unchanged.

---

### FIND-005 — `sharp` / libvips CVEs
**Severity: High** · transitive via Astro · **Fixed**

Four libvips CVEs in `sharp` < 0.35.0. Build-time only: `sharp` runs during `astro build`, never at
request time, and CMS images are transformed by the Sanity CDN rather than downloaded and processed
locally (ADR-003) — so libvips never processes untrusted input in this configuration.

*Remediation:* resolved to `sharp@0.35.3` via the Astro 7 upgrade plus `npm audit fix`.

---

### FIND-006 — esbuild dev-server arbitrary file read (Windows)
**Severity: Low** · transitive · **Fixed**

Development-only, and resolved by the same upgrade.

---

### FIND-007 — Sanity Studio dependency advisories
**Severity: Medium** · `studio/package.json` · **Accepted, with rationale**

Seven advisories (4 high, 3 moderate) in `sanity@4.22.0`: `@sanity/cli`, `@sanity/runtime-cli`,
`adm-zip`, `@sanity/preview-url-secret`, `@sanity/uuid`, `uuid`.

**There is no clean upgrade path.** Every newer major is equal or worse:

| Version | Advisories |
|---|---|
| `sanity@4.22.0` (shipped) | **7** (4 high, 3 moderate) |
| `sanity@5.31.1` | 8 |
| `sanity@6.8.0` | 14 — pulls in a new vulnerable tree (`@module-federation/*`, `js-yaml`, `@vercel/frameworks`) |

npm's own remediation for 6.8.0 points *backwards* to 5.14.1. All three were installed and
typechecked during this review before reverting.

*Exposure:* the affected packages are the Sanity **CLI toolchain** — they run on a developer's
machine during `sanity dev` and `sanity deploy`. They are not part of the Studio bundle served to
SKO staff, and the Studio is hosted by Sanity, not by us. The website build does not depend on them
at all.

*Recommendation:* stay on 4.22.0, and re-check when Sanity publishes a release that resolves its own
CLI advisories. Tracked as a maintenance item, not a launch blocker.

---

### FIND-008 — Production URLs are still placeholders
**Severity: Informational — but blocking for go-live** · **Open, Phase 6**

`PUBLIC_SITE_URL` is `http://localhost:4321`, so canonical links, `hreflang` and Open Graph URLs all
point at localhost, and `public/robots.txt` advertises a sitemap at `example.org`. Harmless today,
wrong the moment the site is public. Closed by setting the production environment variables and the
domain in Phase 6.

---

## The brief's checklist

| Item | Status |
|---|---|
| CSP | **Enforcing**, per page, with build-time hashes for inline structured data (see `08-build.md` §3). `frame-ancestors 'none'` in the header. |
| HSTS | `max-age=31536000; includeSubDomains; preload` |
| X-Content-Type-Options | `nosniff` |
| X-Frame-Options | `DENY` (plus `frame-ancestors 'none'`) |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | camera, geolocation, microphone, payment, USB and others all `()` |
| Turnstile enforced server-side | Yes — and now fail-closed (FIND-001) |
| Input validation & sanitisation | Zod schema; control characters stripped; HTML escaped before templating into the notification email |
| Rate limiting | 5 per 10 minutes per IP in fixed windows, keyed by a **hash** of the address so the store never holds an identifiable IP. Only Turnstile-verified submissions consume quota, so a bot without a token cannot lock out real visitors on a shared IP. KV has no atomic increment, so the limit is best-effort under concurrency. Verified working. |
| Honeypot | Verified: a filled honeypot returns success and sends nothing — the bot is never told it failed |
| No secrets in client bundle or repo | Verified by scan: 123 source and 67 built files, zero findings. The only `PUBLIC_*` name reaching the browser is the Turnstile **site** key, which is public by design |
| Sanity token read-only / not shipped | **There is no token at all** (ADR-004). The dataset is public; the build reads it unauthenticated |
| Dependency audit | Site: **0 vulnerabilities**. Studio: see FIND-007 |
| Pinned versions | All 14 site and 7 studio dependencies pinned to exact versions |
| Sanity dataset permissions + CORS | **Cannot be done without a live project** — steps below |
| Privacy: minimal collection, no tracking cookies | Verified: **no `Set-Cookie` header anywhere**. Analytics is Cloudflare's cookieless beacon. Form submissions are emailed and never stored |
| No beneficiary/child data exposed | Verified — see below |

### Email-injection specifics

- **Header injection via `reply_to`** — blocked: `z.email()` rejects newlines. Verified: a CRLF
  payload in the email field returns `400`.
- **Header injection via the subject line** (which embeds the sender's name) — control characters
  including CR/LF are stripped by `clean()` before templating.
- **HTML injection into the notification email** — every interpolated value passes through
  `escapeHtml()`.
- **Mass assignment** — the Zod schema strips unknown keys; an injected `to` field is ignored.

### Beneficiary and child data

No schema models a beneficiary's real name, age, address, school, or case detail. Checked
mechanically across all Studio schemas; the only matches for those terms were the prohibition comment
itself in `studio/schemas/documents.ts` and the word "image".

- `story.consentConfirmed` is a hard validation rule *and* a filter in the published query:
  `*[_type == "story" && consentConfirmed == true]`. Both layers, so a story cannot reach the site
  without it even if the Studio rule were bypassed via the API.
- `story.personName` field help: *pseudonym or initials only*.
- No file uploads anywhere, including job applications — no applicant data is stored.
- Alt text is required on every image field.

This matters more here than on a typical site: the dataset is **public** (ADR-004). That is safe only
because of these constraints, which is why they are enforced in code rather than documented in a
policy nobody reopens.

---

## Required before go-live (Phase 6)

1. **Set production environment variables** in Cloudflare Pages, per environment:
   `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `MAIL_FROM`, `CONTACT_TO_EMAIL`, `PARTNER_TO_EMAIL`,
   `PUBLIC_SITE_URL`, `PUBLIC_TURNSTILE_SITE_KEY`, `PUBLIC_SANITY_PROJECT_ID`.
   **The form now fails closed without the Turnstile secret — verify it after the first deploy.**
2. **Bind the `RATE_LIMIT_KV` namespace.** Without it, rate limiting is skipped (deliberately
   fail-open, since Turnstile is the primary control) and a warning is logged on each submission.
3. **Lock Sanity CORS origins** to the production domain plus `http://localhost:3333` for the Studio.
   Remove the default wildcard. *Do not tick "Allow credentials".*
4. **Confirm the dataset is public and no API token exists** for this project. If one is ever needed,
   that is a change to ADR-004, not a quiet addition.
5. **Invite SKO staff to the Studio individually**, with the lowest role that lets them publish. No
   shared logins.
6. **Verify SPF and DKIM** for the sending domain in Resend before the first real submission.
7. **Update `public/robots.txt`** with the production sitemap URL (FIND-008).
8. **Put the repository under version control** on an SKO-owned account. `.gitignore` already excludes
   `.env*` from the first commit — that ordering matters, so make the initial commit with it in place.

## Sign-off

I consider the application code ready for deployment. The remaining risk is concentrated in
configuration (items 1–6 above), not in the codebase — which is the right place for it to be, but it
does mean **the Phase 6 checklist is part of the security posture, not paperwork after it**.
