# SKO website — project documentation

Project: production bilingual (km/en) website for **Samatapheap Khnom Organization**, Phnom Penh.
Stack per brief: Astro + TypeScript + Tailwind · Sanity · Cloudflare Pages + Functions + Turnstile · Resend · Cloudflare Web Analytics.

Delivered in six phases, each with an approval gate. The original brief this was built from:
**[00-original-brief.md](00-original-brief.md)**.

**Start here if you are:**

| You are… | Read |
|---|---|
| SKO staff who will edit the site | [HANDOVER-en.md](HANDOVER-en.md) · [HANDOVER-km.md](HANDOVER-km.md) |
| Deploying it | [09-deployment.md](09-deployment.md) |
| A developer picking this up | [../README.md](../README.md), then [07-architecture.md](07-architecture.md) |
| Reviewing security | [SECURITY.md](SECURITY.md) |
| Looking at the design | [design-preview.html](design-preview.html) — open in a browser |

---

# Phase 1 — Planning

| # | Deliverable | Document |
|---|---|---|
| 1 | Sitemap + URL structure, both locales | [01-sitemap-and-urls.md](01-sitemap-and-urls.md) |
| 2 | Sanity content model, finalized | [02-sanity-content-model.md](02-sanity-content-model.md) |
| 3 | Component inventory + wireframe notes | [03-components-and-wireframes.md](03-components-and-wireframes.md) |
| 4 | Tech decisions (ADRs, i18n, images, forms, deploy, env) | [04-tech-decisions.md](04-tech-decisions.md) |
| 5 | Repo structure plan | [05-repo-structure.md](05-repo-structure.md) |

**Phase 1 approved.** Recorded decisions:
- Front end is **white-dominant**.
- Palette is **slate blue `#475D8C`** with **`#C3E9E8`** and **`#9BE1FF`** as supporting tints. No green.
- Staff write **both English and Khmer directly** on each Activity post. No machine translation.

# Phase 2 — Design

| # | Deliverable | Document |
|---|---|---|
| 6 | Design system — colour, type (Latin + Khmer), space, radius, shadow, motion | [06-design-system.md](06-design-system.md) |
| 7 | Tokens as Tailwind config | [design-tokens/theme.css](design-tokens/theme.css) |
| 8 | Visual proof — palette, specimens, component kit, 6 desktop layouts, 3 mobile frames, and the Sanity editor staff will use | **[design-preview.html](design-preview.html)** ← open in a browser |

**Phase 2 approved.**

# Phase 3 — Architecture & working skeleton

| # | Deliverable | Where |
|---|---|---|
| 9 | What was built, what was verified, what is deliberately deferred | [07-architecture.md](07-architecture.md) |
| 10 | Developer setup and the rules that keep this maintainable | [../README.md](../README.md) |
| 11 | The code | `src/`, `functions/`, `studio/` |

**Phase 3 approved.**

# Phase 4 — Build & implementation

| # | Deliverable | Where |
|---|---|---|
| 12 | Results, defects found and fixed, what is still placeholder | [08-build.md](08-build.md) |
| 13 | Per-page CSP generator | `scripts/csp.mjs` |
| 14 | Structural sweep over every built page | `scripts/check-build.mjs` |

Lighthouse mobile: **100/100/100/100** on four of five key pages, 99 on the heaviest. CLS 0.
Note: the CSP question deferred in [07-architecture.md](07-architecture.md) §6 is now **settled and
enforcing** — see [08-build.md](08-build.md) §3.

**Phase 4 approved.**

# Phase 5 — Security review

| # | Deliverable | Where |
|---|---|---|
| 15 | Findings, remediation, checklist, and the go-live prerequisites | **[SECURITY.md](SECURITY.md)** |

8 findings: 6 fixed in code, 1 accepted with rationale, 1 is a Phase 6 deployment prerequisite.
`npm audit` → **0 vulnerabilities** on the site. The headline fix: the contact form's Turnstile check
was **failing open** when unconfigured — it now fails closed.

**Phase 5 signed off.**

# Phase 6 — Deployment

| # | Deliverable | Where |
|---|---|---|
| 16 | Step-by-step deployment runbook | **[09-deployment.md](09-deployment.md)** |
| 17 | Staff guide, English | **[HANDOVER-en.md](HANDOVER-en.md)** |
| 18 | Staff guide, Khmer | **[HANDOVER-km.md](HANDOVER-km.md)** |
| 19 | Pages build settings under version control | `../wrangler.toml` |
| 20 | CI: typecheck, structural checks, audit, Lighthouse floors | `../.github/workflows/verify.yml` |

Repository initialised, two commits, nothing pushed. **The deployment itself needs accounts and a
domain** — the runbook is the sequence to follow.

**Status: Phase 6 — prepared, awaiting accounts to execute.**

## Decisions that need an explicit yes/no from you

| # | Decision | My recommendation |
|---|---|---|
| 1 | URL style: `/about/` + `/km/about/` vs `/en/about/` + `/km/about/` | Unprefixed English |
| 2 | Sanity i18n: field-level `{en, km}` vs separate translated documents | Field-level |
| 3 | Sanity dataset **public, no read token in the build** | Yes — and it makes the safeguarding rules binding |
| 4 | `/partners/` (logo wall) + `/partner-with-us/` (inquiry) naming | As proposed |
| 5 | No file uploads anywhere, incl. CVs on careers | Email-only applications |
| 6 | Newsletter signup | Defer past launch |
| 7 | Nightly rebuild cron (expires job posts automatically) | Include |
| 8 | Text version of the org chart alongside the image | Include — it's the accessible route |

## Information I need before Phase 3

Domain ownership + registrar · Git host and who owns the account · Destination inboxes and DNS control for email sending · Who at SKO writes and reviews the Khmer copy.

## Two things I want on the record now

**Khmer copy.** I can build every Khmer route, font rule, and CMS field, and I'll write marked Khmer placeholders. I will not machine-translate a child-protection NGO's mission statement and hand it over as launch-ready — that copy needs a Khmer-speaking staff member. Plan for that person's time before go-live.

**Nothing sensitive in the CMS.** The content model has no field anywhere for a beneficiary's real name, age, location, or case detail, and stories can't publish without a consent checkbox. This is a design constraint, not a preference — see ADR-004.
