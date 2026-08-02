# Phase 4 — Build & implementation

**Status: Phase 4 gate — awaiting approval.**

64 pages across both locales, all wired to the CMS, verified with Lighthouse and a structural sweep
over every built page.

---

## 1. Verified results

Lighthouse, **mobile profile** (the one that matters — most local visitors are on a phone on 4G):

| Page | Perf | A11y | Best practices | SEO |
|---|---|---|---|---|
| `/` (English home) | 100 | 100 | 100 | 100 |
| `/km/` (Khmer home) | 100 | 100 | 100 | 100 |
| `/about/` (heaviest — director card, org chart, dialog, team) | 99 | 100 | 100 | 100 |
| `/donate/` | 100 | 100 | 100 | 100 |
| `/km/contact/` (form + Turnstile) | 100 | 100 | 100 | 100 |

Zero failing audits on every page. LCP 1.5–1.9 s, **CLS 0**, TBT 0 ms.

```
npm run verify
  → 64 pages built
  → per-page CSP written, 224 inline-script hashes
  → 64 pages checked, all structural checks passed
npm run typecheck
  → 0 errors, 0 warnings, 0 hints
```

**Zero JavaScript is served as a separate request.** The only scripts are the mobile nav, the org-chart
dialog, the clipboard buttons and the contact form, all inlined into the HTML by Astro and covered by
the CSP hashes.

## 2. `scripts/check-build.mjs` — breadth, not spot-checks

Lighthouse goes deep on a handful of routes. This goes wide on all 64, asserting per page: correct
`<html lang>`, exactly one `<h1>`, CSP placeholder replaced, every inline script covered by a hash in
that page's own policy, canonical + all three `hreflang` values, a meta description, Organization
structured data, a skip link, `<main id="main">`, and no `<img>` without `alt`.

It found 14 pages with no meta description the moment it first ran — including `/impact/`,
`/reports/` and `/partners/`, which are exactly the pages a grant officer lands on from a search.

**It is wired to `npm run verify`, not to `npm run build`.** Cloudflare runs `build` on every publish;
if a content edit ever tripped a check, staff would be unable to publish. Verification belongs in CI
and on pull requests, not between a staff member and their post going live.

## 3. Content security policy — the Phase 3 open question, settled

Phase 3 deferred this because browser behaviour around inline `<script type="application/ld+json">`
was genuinely uncertain. It has now been tested rather than assumed.

**Chrome does block it.** Under a strict policy it logs: *"Executing inline script violates the
following Content Security Policy directive… The action has been blocked."* Every page carries
structured data in exactly such a block, so a strict CSP needs a hash for each one.

Those hashes differ per page and change whenever staff edit content, so they cannot live in a
hand-written `_headers` file — and a union of every page's hashes in one global header would be
kilobytes on every response, growing with each new activity post.

**The fix:** `scripts/csp.mjs` runs after the Astro build, hashes each page's own inline scripts, and
writes that page's exact policy into its `<meta http-equiv>` tag. Cost per response: nothing. Scales
to any number of posts. `frame-ancestors` is the one directive a meta policy cannot set, so it stays
in `public/_headers` with the other security headers.

Confidence check: the first hash the generator produced for the activity page,
`sha256-CvwiAuoN2TRD+…`, is byte-identical to the one Chrome had asked for in the failure message.
Best Practices went 93 → 100 and the console error disappeared.

CSP is now **enforcing**, not Report-Only. Phase 5 reviews it rather than building it.

## 4. Fonts — self-hosted, and two bugs found doing it

Four WOFF2 files, 237 KB total, committed to `public/fonts`. No runtime request to Google: no
third-party dependency on the critical path, no privacy question for European institutional donors,
and `font-src 'self'`.

Two defects surfaced during this, both of which would have shipped looking "fine":

1. **The fonts are variable.** Google serves one file per subset covering weights 400–700 and
   declares all three weights against it. Declaring a single `font-weight` — the obvious reading —
   makes the browser synthesise a faux bold instead of using the real weight axis. Noticeably wrong
   on Khmer. The `@font-face` rules now declare `font-weight: 400 700`.
2. **Latin text on Khmer pages was rendering in a system font.** `:lang(km)` sets the Kantumruy
   stack, and the Kantumruy `@font-face` declares a Khmer-only `unicode-range` — so for the Latin
   characters that appear all over Khmer pages (the organisation's Latin name, "EN" in the toggle,
   Western numerals) the browser skipped it and fell through to whatever sans the device had. Inter
   now sits second in that stack. Confirmed by network trace: `/km/` fetches both
   `kantumruy-pro-khmer.woff2` and `inter-latin.woff2`.

`unicode-range` also means an English page pays nothing for `inter-latin-ext.woff2` until a name like
*Planète Enfants & Développement* appears on it.

## 5. Three more accessibility defects found and fixed

All three are WCAG 2.5.3 (Label in Name) — an element whose accessible name does not contain its
visible text, so a speech-input user saying what they can see cannot activate it. None is visible by
inspection; all three came out of the audit.

1. **Language toggle** — visible "EN", accessible name "Switch to English". Fixed with the group-label
   pattern: the `<nav>` carries "Language", each link's name is just its own visible text.
2. **Org chart button** — visible "Tap to enlarge", `aria-label="Enlarge image"`. Removed the
   aria-label so the name comes from the visible text and cannot drift.
3. **Same button again** — the `⤢` character still counted as visible text that the accessible name
   did not contain. Replaced with an `aria-hidden` SVG icon.

The org-chart image inside the button is now `alt=""`, because it would otherwise be swallowed into
the button's name. The description lives where it is actually useful: on the full-size image in the
dialog, and in the "read as text" panel — which is the route that works at 360 px anyway.

## 6. Also wired in this phase

- **CMS `seo` overrides** now flow through `src/lib/seo.ts` — one place decides precedence, so it
  cannot drift between page types. The field was queried in Phase 3 but nothing consumed it.
- **`Article` structured data** on activity detail; `JobPosting` on career detail.
- **Homepage hero photo** is now a `siteSettings` field, with help text telling staff they needn't
  worry about the photo being busy or light — a white card holds the words, never the photo.
- **Story avatars** — `useSilhouette` was in the schema but nothing rendered it. Stories now show an
  illustrated avatar by default, which is the compliant option for a real story with no publishable
  photo.
- **`public/_redirects`** — Khmer 404s land on the Khmer 404 page.
- **Fixtures enriched to 12 activities**, so pagination is genuinely exercised (`/activities/page/2/`
  and its Khmer twin now build).

## 7. What is still placeholder, and what that needs

The site is structurally complete. What it is not is *finished*, and the gap is content, not code:

| Needed | From |
|---|---|
| Real copy for every `[PLACEHOLDER]` string | SKO |
| **Khmer copy written or reviewed by a Khmer-speaking staff member** | SKO |
| Real logo, photographs, org-chart image, QR codes, bank details | SKO |
| Real impact figures — and the "how we count" methodology note under them | SKO |
| Partner logos, plus confirmation each partner permits logo use | SKO |
| A Sanity project id, so the build reads the CMS instead of fixtures | SKO account |

I have not invented SKO facts, statistics, staff names or a director's name. The numbers on the site
are visibly bracketed placeholders demonstrating the component.

The Khmer in the interface (navigation, buttons, form labels, error messages) is a working
translation and is marked as needing review in `src/lib/i18n/strings.ts`. I will not machine-translate
a child-protection NGO's mission and present it as launch-ready.

## 8. Next

Phase 5 — security review. Much of its checklist is already implemented and evidenced above (CSP,
headers, Turnstile enforced server-side, honeypot, rate limiting, no secrets, no beneficiary data),
so that phase is largely a review-and-report pass plus the items that need a live environment:
Sanity dataset permissions, CORS origins locked to the production domain, and `npm audit` with
pinned versions.
