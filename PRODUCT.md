# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three audiences, none of them beneficiaries (no beneficiary/child data is ever modelled on the
site):

- **Local Cambodian donors** deciding whether to give.
- **International donors** deciding whether to give.
- **Grant-making institutions** (e.g. UN Women, UNICEF, Friends International/3PC, Planète Enfants
  & Développement) evaluating SKO for funding or partnership.

All three are doing the same underlying job: assessing whether SKO is a credible, safe,
well-governed organization worth backing, using the site's transparency material (financials,
safeguarding policy, impact evidence, partner list) as their evidence.

## Product Purpose

A production bilingual (Khmer/English) website for Samatapheap Khnom Organization (SKO), a
Cambodian NGO in Phnom Penh working in family care, child protection, and gender-based-violence
prevention, registered with the Ministry of Interior in 2007. The site's job is to build
credibility and attract support — donations, partnerships, grants — from the three audiences
above. Trust, transparency, and clarity matter more than visual flash.

## Positioning

What a neighboring NGO site could not truthfully copy: a specific, documented transparency
posture — downloadable annual reports and financials, a standalone Safeguarding/Child Protection
Policy page, a named partner logo wall, and an organizational structure shown both as an image and
as an accessible text version — combined with a governance discipline that keeps beneficiary data
out of the CMS entirely (see Capabilities and Constraints) rather than claiming safety while
collecting exactly the data that would violate it.

## Operating Context

- Staff publish through Sanity Studio (`studio/`, a separate npm project deliberately outside the
  workspace); publishing triggers a webhook → Cloudflare Pages Deploy Hook → full rebuild.
- Staff write both English and Khmer copy directly on every Activity/News post — no machine
  translation anywhere in the workflow.
- A nightly rebuild exists specifically so job posting deadlines (careers) expire on their own
  without staff intervention.
- The Director's message and organizational chart are the two pieces of content with a
  pre-agreed special editorial treatment (portrait + outlined card with a teal accent rule for the
  message; image plus accessible text version for the org chart) — see `docs/06-design-system.md`
  and `docs/03-components-and-wireframes.md`.
- The project is currently in a **content-review / handover stage** with the SKO team: the six
  original build phases (planning → design → architecture → build → security → deployment) are
  complete and signed off per `docs/README.md`; current work is FAQ content, a content-review
  generator, and an offline-copy generator for reviewers — not new build phases.

## Capabilities and Constraints

- **No payment or card handling anywhere.** Donate page shows QR codes and bank-wire details only
  — zero PCI scope, by design, not by omission.
- **No file uploads anywhere**, including CVs on the Careers page.
- **Nothing about a beneficiary or a child is modelled in the CMS**, and the dataset is public
  with no Sanity write token anywhere in the build (`docs/04-tech-decisions.md` ADR-004). A story
  cannot publish without a consent tick, enforced in both the Studio rule and the published query.
  This is the condition that makes the public, tokenless dataset safe — it must not be relaxed
  without revisiting that ADR.
- **Bilingual by construction**: Astro i18n routing, English unprefixed (`/about/`), Khmer at
  `/km/about/`. Every visible string goes through `t()` or comes from the CMS — a hardcoded
  English string in a component is treated as a review-blocking bug.
- **`PUBLIC_` env vars are load-bearing**: Astro inlines any `PUBLIC_*` var into the browser
  bundle; server-only secrets live only in `functions/` (Cloudflare env bindings) and must never
  reach `src/`.
- Accessibility target: WCAG 2.1 AA — semantic HTML, alt text, keyboard nav, focus states, colour
  contrast, per-locale `lang` attributes.
- Performance target: Lighthouse 90+ across Performance/Accessibility/Best Practices/SEO (measured
  at 100/100/100/100 on four of five key pages, 99 on the heaviest, CLS 0, per
  `docs/08-build.md`).
- Newsletter signup is explicitly deferred past launch.
- Cost constraint: total recurring cost stays within free tiers (domain only) unless the client
  approves otherwise.

## Brand Commitments

- Organization name: **Samatapheap Khnom Organization (SKO)**, Phnom Penh, Cambodia, registered
  2007. Do not invent SKO facts, statistics, staff names, or a real director's name — use marked
  placeholders until SKO supplies the real ones.
- Work areas, stated as such: family care, child protection, gender-based-violence prevention.

## Evidence on Hand

- Extensive internal planning and decision documentation in `docs/` (sitemap, content model,
  component inventory, tech decisions, design system, architecture, build report, security
  review, deployment runbook, staff handover guides in English and Khmer).
- A visual proof file at `docs/design-preview.html` (palette, specimens, component kit, desktop
  and mobile layouts) from the approved Phase 2 design gate.
- **No real logo or photography yet** — `public/` currently holds only a generic favicon, no brand
  logo or photo assets. Do not treat placeholder imagery as final brand evidence.
- **Khmer content is still placeholder.** Every Khmer route, font rule, and CMS field is built and
  functional, but the interface strings are a working translation marked for review
  (`src/lib/i18n/strings.ts`), and the actual mission/programme/Director copy needs a
  Khmer-speaking SKO staff member before launch — it must never be machine-translated live.
  Future work must not fabricate Khmer content to fill this gap.
- Local Sanity fixtures (`src/lib/content/fixtures.ts`) let the site build and run with no Sanity
  project configured; the build logs which content source it used.

## Product Principles

1. Transparency is the product, not a section of it — financials, safeguarding policy, and org
   structure carry as much weight as mission copy, because they are what actually moves a grant
   or major-donor decision.
2. Never let the build outrun the safeguard: no beneficiary data in the CMS, no payment surface,
   no machine-translated mission content — these are structural constraints, not style choices,
   and any change to them revisits a signed-off ADR.
3. Placeholder is a visible, tracked state, not a silent gap — flag it, never fill it in with
   invented facts, names, or numbers.
4. Bilingual means genuinely equal, not English-first-with-a-Khmer-afterthought: same routes, same
   fonts done right, same human-written copy in both languages.
5. Staff independence — SKO must be able to publish an Activity post, add a report PDF, or update
   the Director's message from Sanity Studio alone, with no code changes and no drift back to a
   hardcoded string.

## Accessibility & Inclusion

WCAG 2.1 AA is a stated requirement, not aspirational — includes correct Khmer script line-height
and a proper Khmer webfont (never a fallback font for Khmer text), keyboard nav, focus states, and
colour contrast, verified per `docs/08-build.md` and enforced in CI (`.github/workflows/verify.yml`).
