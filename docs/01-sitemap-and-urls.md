# Phase 1.1 — Sitemap & URL structure (both locales)

## Routing decision (needs your approval)

**Recommended: unprefixed default locale.**

| Locale | Prefix | Example |
|---|---|---|
| English (default) | none | `https://sko.org/about/` |
| Khmer | `/km/` | `https://sko.org/km/about/` |

Astro config: `i18n: { defaultLocale: 'en', locales: ['en','km'], routing: { prefixDefaultLocale: false } }`.

Why: the homepage is the URL grant officers and international donors land on, and this keeps it a real page with no redirect hop, no duplicate-content ambiguity, and the shortest canonical URLs. `hreflang` tags (`en`, `km`, `x-default`) carry the pairing for search engines.

**Alternative if you prefer symmetry:** `prefixDefaultLocale: true` → `/en/…` and `/km/…`, with `/` serving a redirect. Cleaner mental model for staff, one extra hop on the most-visited URL. Say the word and I'll switch — it's a one-line config change plus link helpers, cheap now, annoying after launch.

**Slugs stay in Latin script in both locales** (`/km/about/`, not `/km/អំពី/`). Reasons: no percent-encoded URLs in emails and printed materials, stable links if a Khmer title is edited, and one shared slug per CMS document instead of two. Page *titles* are fully Khmer; only the path segment is Latin.

## Route table

`{L}` = `` (English) or `/km` (Khmer). Every route exists in both locales.

### Cluster 1 — Identity
| Route | Source | Notes |
|---|---|---|
| `{L}/` | `siteSettings` + `impactStat` + featured `activity`/`story` | Hero, mission, impact strip, programs teaser, latest activities, partner logos, CTAs |
| `{L}/about/` | `page` (about) + `directorMessage` + `teamMember` + org-chart image | Sections: mission/vision, history since 2007, values, Director's message, org structure, team |
| `{L}/programs/` | `program[]` | Index of the three programs |
| `{L}/programs/[slug]/` | `program` | Seeded: `family-care`, `child-protection`, `gbv-prevention` — staff can add more |

### Cluster 2 — Trust & transparency
| Route | Source | Notes |
|---|---|---|
| `{L}/impact/` | `impactStat` + `story` | Reach numbers, beneficiary stories, testimonials |
| `{L}/reports/` | `report` (type: annual / financial) | Grouped by year, PDF downloads with size + language label |
| `{L}/safeguarding/` | `page` + `report` (type: policy) | Child-protection policy page + downloadable PDF |
| `{L}/partners/` | `partner[]` | Logo wall, grouped (institutional / NGO / government) |

### Cluster 3 — Get involved & sustain
| Route | Source | Notes |
|---|---|---|
| `{L}/donate/` | `siteSettings.donation` | QR images + bank-wire table + "where your money goes". No payment code. |
| `{L}/partner-with-us/` | `page` + form | Grant / partnership inquiry form → funder inbox |
| `{L}/volunteer/` | `page` + form | |
| `{L}/careers/` | `jobPost[]` | Open roles; empty state when none |
| `{L}/careers/[slug]/` | `jobPost` | Apply by email — **no CV upload** (see Phase 4 note) |

> **Naming call:** `/partners/` (who supports us) vs `/partner-with-us/` (become a supporter) read as a pair and never collide in nav. Alternative: `/supporters/` + `/partner/`. Your preference.

### Cluster 4 — Activities
| Route | Source | Notes |
|---|---|---|
| `{L}/activities/` | `activity[]`, 9 per page | The feed SKO publishes to freely |
| `{L}/activities/page/[n]/` | `activity[]` | Astro `paginate()` |
| `{L}/activities/[slug]/` | `activity` | Shared slug across locales |

### Utility
| Route | Notes |
|---|---|
| `{L}/contact/` | Address, map embed (static image + link, not an iframe — see Phase 5), general contact form |
| `{L}/privacy/` | Short plain-language privacy note (cookieless analytics, form data handling) |
| `{L}/404` | Localized |
| `/sitemap-index.xml` | `@astrojs/sitemap` with i18n config |
| `/robots.txt` | Static |
| `/_headers`, `/_redirects` | Cloudflare Pages security headers + legacy redirects |

**Total: 21 static routes + 2 dynamic collections, ×2 locales.** Well inside Cloudflare Pages' 20,000-file limit.

## Navigation

**Header:** Logo · About · Our Work · Impact · Activities · Get Involved (dropdown: Donate / Partner / Volunteer / Careers) · **Donate** (button) · **ខ្មែរ / EN** toggle.

The toggle links to the *equivalent page in the other locale*, not the homepage — computed per page, falling back to the locale home only if a translation genuinely doesn't exist (CMS documents always have both, so this is a rare path).

**Footer:** contact block (address, phone, email), map link, socials, Reports, Safeguarding, Privacy, MoI registration line (2007), copyright, optional newsletter.

**Open question — newsletter:** signup implies an email provider, a consent record, and an unsubscribe flow. Recommend **deferring to post-launch** rather than shipping a box that collects addresses with nowhere to send them. Confirm?

## Breadcrumbs & SEO

- Breadcrumbs on every page except home, with `BreadcrumbList` structured data.
- Canonical + `hreflang` alternates on every page.
- `Organization` + `NGO` schema.org on all pages (from `siteSettings`), `Article` on activity detail, `JobPosting` on career detail.
