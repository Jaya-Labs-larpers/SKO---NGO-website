# Graph Report - NGO-website  (2026-09-16)

## Corpus Check
- 157 files · ~346,769 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: .woff2 5, (none) 4, .css 3)

## Summary
- 830 nodes · 1450 edges · 65 communities (55 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4fe20564`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- fixtures.ts
- studio/package.json
- schemas/index.ts
- Phase 6 — Deployment runbook
- functions/api/contact.ts
- portable-text.ts
- ImpactPage.astro
- utils.ts
- pick
- types.ts
- Schemas
- Build Prompt — Samatapheap Khnom Organization (SKO) Website
- Findings
- package.json
- queries.ts
- readiness.mjs
- ActivityDetail.astro
- compilerOptions
- Phase 1.4 — Tech decisions
- Editing the SKO website — a guide for staff
- ការកែសម្រួលគេហទំព័រ SKO — មគ្គុទ្ទេសក៍សម្រាប់បុគ្គលិក
- content/index.ts
- Phase 2 — Design system
- SEO / AEO / GEO — audit and proposals
- t
- Proposed FAQs
- docs/README.md
- Product
- compilerOptions
- ActivitiesPage.astro
- Program
- Route table
- Phase 1.3 — Component inventory & low-fi wireframe notes
- GenericPage.astro
- getActivities
- form.test.mjs
- Phase 4 — Build & implementation
- Questions for the SKO team
- content-review.mjs
- sanity.config.ts
- vercel.json
- Phase 3 — Architecture & working skeleton
- overrides
- scripts
- locale.ts
- SKO website
- BaseLayout.astro
- Phase 1.5 — Repo structure
- dependencies
- offline-copy.mjs
- contact.test.mjs
- Targeted security remediation — 2026-09-14
- Homepage — Open Field Ledger (site-wide reference surface)
- csp.mjs
- Self-hosted fonts
- Agent instructions
- security-overrides.test.mjs
- env.d.ts
- DirectorMessage.astro
- devDependencies

## God Nodes (most connected - your core abstractions)
1. `t()` - 31 edges
2. `pick()` - 29 edges
3. `localizePath()` - 20 edges
4. `fetchOr()` - 16 edges
5. `Phase 6 — Deployment runbook` - 16 edges
6. `scripts` - 13 edges
7. `Schemas` - 13 edges
8. `Phase 1.4 — Tech decisions` - 13 edges
9. `handlePost()` - 12 edges
10. `text()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `fetch()` --calls--> `onRequest()`  [EXTRACTED]
  api/contact.ts → functions/api/contact.ts
- `getSiteSettings()` --calls--> `siteSettingsFailures()`  [EXTRACTED]
  src/lib/content/index.ts → scripts/readiness.mjs
- `isCurrent()` --calls--> `localizePath()`  [EXTRACTED]
  src/components/layout/Header.astro → src/lib/i18n/utils.ts
- `hrefFor()` --calls--> `localizePath()`  [EXTRACTED]
  src/page-templates/ActivitiesPage.astro → src/lib/i18n/utils.ts
- `resolved` --calls--> `pick()`  [EXTRACTED]
  src/components/content/FaqSection.astro → src/lib/i18n/utils.ts

## Import Cycles
- None detected.

## Communities (65 total, 5 thin omitted)

### Community 0 - "fixtures.ts"
Cohesion: 0.09
Nodes (21): activities, blocks(), directorMessage, donationFaqs, enOnly(), impactStats, jobs, orgChart (+13 more)

### Community 1 - "studio/package.json"
Cohesion: 0.15
Nodes (12): react, react-dom, styled-components, @types/react, comment, description, @types/node, typescript (+4 more)

### Community 2 - "schemas/index.ts"
Cohesion: 0.17
Nodes (20): activity, directorMessage, impactStat, jobPost, orgChart, page, partner, program (+12 more)

### Community 3 - "Phase 6 — Deployment runbook"
Cohesion: 0.06
Nodes (32): 10. Rebuild on publish, 11. Uptime monitoring, 12. Post-deploy verification, 13. Two things to change in code before launch, 1. Git repository, 2. Sanity project, 3. Cloudflare Pages project, 4. Environment variables (+24 more)

### Community 4 - "functions/api/contact.ts"
Cohesion: 0.14
Nodes (21): fetch(), ADR-0001, BodyReadError, bounded(), clean(), codeFor(), Env, ErrorCode (+13 more)

### Community 5 - "portable-text.ts"
Cohesion: 0.07
Nodes (40): ADR-0003, ADR-0004, astro, isCurrent(), jsonLd, orgName, serializeJsonLd(), webSiteJsonLd (+32 more)

### Community 6 - "ImpactPage.astro"
Cohesion: 0.13
Nodes (4): partnerCategoryLabels, groups, heading, heading

### Community 7 - "utils.ts"
Cohesion: 0.13
Nodes (18): pages, defaultLocale, isLocale(), Locale, localeName, locales, localeShort, ogLocale (+10 more)

### Community 8 - "pick"
Cohesion: 0.13
Nodes (14): resolved, html, picked, caption, present, { width, height }, CmsImage, isEmpty() (+6 more)

### Community 9 - "types.ts"
Cohesion: 0.09
Nodes (20): quote, role, AllocationItem, BankAccount, CmsAsset, CmsDimensions, CmsFile, DonationQr (+12 more)

### Community 10 - "Schemas"
Cohesion: 0.11
Nodes (17): `activity` — the staff-editable feed, `directorMessage` (singleton), `impactStat`, `jobPost`, Localization strategy (needs your approval), `navigation` (singleton, optional), `page` — generic bilingual page, `partner` (+9 more)

### Community 11 - "Build Prompt — Samatapheap Khnom Organization (SKO) Website"
Cohesion: 0.12
Nodes (16): 1. Role & objective, 2. Confirmed tech stack (non-negotiable), 3. Global standards (apply to every page, every phase), 4. Information architecture (the sitemap), 5. Content model (Sanity schemas to implement), 6. Phased delivery — stop at each gate, 7. Definition of done, 8. Guardrails — do NOT (+8 more)

### Community 12 - "Findings"
Cohesion: 0.12
Nodes (16): Beneficiary and child data, Email-injection specifics, Executive summary, FIND-001 — Turnstile failed open when unconfigured, FIND-002 — Cross-origin form POST accepted (CSRF), FIND-003 — No request body cap before parsing, FIND-004 — Astro 5.18.2: multiple XSS and SSRF advisories, FIND-005 — `sharp` / libvips CVEs (+8 more)

### Community 13 - "package.json"
Cohesion: 0.04
Nodes (45): dependencies, astro, @astrojs/sitemap, @sanity/client, @sanity/image-url, zod, description, devDependencies (+37 more)

### Community 14 - "queries.ts"
Cohesion: 0.12
Nodes (15): activitiesQuery, activityBySlugQuery, directorMessageQuery, impactStatsQuery, jobBySlugQuery, jobsQuery, orgChartQuery, pageBySlugQuery (+7 more)

### Community 15 - "readiness.mjs"
Cohesion: 0.13
Nodes (12): env, failures, SITE, @astrojs/sitemap, @tailwindcss/vite, DIST, failures, htmlFiles() (+4 more)

### Community 16 - "ActivityDetail.astro"
Cohesion: 0.21
Nodes (9): category, title, siteUrl, formatDate(), localizePath(), activityCategoryLabels, employmentTypeLabels, label() (+1 more)

### Community 17 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, esModuleInterop, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+6 more)

### Community 18 - "Phase 1.4 — Tech decisions"
Cohesion: 0.14
Nodes (13): ADR-001 — Static Astro output with a plain `functions/` directory (no Cloudflare adapter), ADR-002 — Field-level i18n in Sanity, Astro built-in i18n routing, ADR-003 — Sanity image CDN for CMS images, `astro:assets` for static assets, ADR-004 — Public Sanity dataset, no token in the build, ADR-005 — Turnstile + honeypot + server-side validation for forms, ADR-006 — Self-hosted fonts, subset, with Khmer treated as a first-class script, ADR-007 — Repo hosting and the deploy pipeline, Environment variables (+5 more)

### Community 19 - "Editing the SKO website — a guide for staff"
Cohesion: 0.14
Nodes (14): Adding an annual report, financial statement or policy, Both languages, always, Changing the numbers on the website, Editing a post you already published, Editing the SKO website — a guide for staff, If something goes wrong, Logging in, Photographs and safeguarding (+6 more)

### Community 20 - "ការកែសម្រួលគេហទំព័រ SKO — មគ្គុទ្ទេសក៍សម្រាប់បុគ្គលិក"
Cohesion: 0.14
Nodes (14): ការកែសម្រួលគេហទំព័រ SKO — មគ្គុទ្ទេសក៍សម្រាប់បុគ្គលិក, ការកែសម្រួលសាររបស់នាយកប្រតិបត្តិ, ការកែសម្រួលអត្ថបទដែលបានផ្សាយរួច, ការចូលប្រើប្រាស់, ការបន្ថែមរបាយការណ៍ប្រចាំឆ្នាំ របាយការណ៍ហិរញ្ញវត្ថុ ឬគោលការណ៍, ការផ្លាស់ប្តូរតួលេខនៅលើគេហទំព័រ, ការលុបអត្ថបទ, ការសរសេរអត្ថបទព័ត៌មាន ឬសកម្មភាព (+6 more)

### Community 21 - "content/index.ts"
Cohesion: 0.16
Nodes (21): ADR-0007, fetchOr(), getDirectorMessage(), getImpactStats(), getJob(), getJobs(), getOrgChart(), getPage() (+13 more)

### Community 22 - "Phase 2 — Design system"
Cohesion: 0.15
Nodes (12): 10. Open for your call, 1. Direction, 2. Colour, 3. Typography, 4. Space, radius, elevation, motion, 5. The two agreed special treatments, 6. Responsive behaviour, 7. Accessibility — what AA commits us to (+4 more)

### Community 23 - "SEO / AEO / GEO — audit and proposals"
Cohesion: 0.15
Nodes (12): AEO — thin. This is the biggest gap., Also missing, plain SEO, GEO — partly there, and the good part is genuine., Proposals, in the order I would do them, SEO / AEO / GEO — audit and proposals, SEO — strong. This is largely done., Tier 1 — high value, low effort (about half a day), Tier 2 — worth doing before launch (about a day) (+4 more)

### Community 24 - "t"
Cohesion: 0.25
Nodes (5): formatFileSize(), t(), reportTypeLabels, policies, policies

### Community 25 - "Proposed FAQs"
Cohesion: 0.17
Nodes (11): 1. ✅ Does SKO run an orphanage or residential care centre?, 2. ⚠️ Can I visit SKO's projects or meet the children?, 3. ✅ Is SKO a religious organisation?, About page, Donate, My recommendation, Our work — Family Development Program, Proposed FAQs (+3 more)

### Community 26 - "docs/README.md"
Cohesion: 0.18
Nodes (9): Decisions on the record, Phase 1 — Planning, Phase 2 — Design, Phase 3 — Architecture & working skeleton, Phase 4 — Build & implementation, Phase 5 — Security review, Phase 6 — Deployment, SKO website — project documentation (+1 more)

### Community 27 - "Product"
Cohesion: 0.17
Nodes (11): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+3 more)

### Community 28 - "compilerOptions"
Cohesion: 0.17
Nodes (11): astro/tsconfigs/strict, compilerOptions, baseUrl, noUncheckedIndexedAccess, noUnusedLocals, paths, strict, verbatimModuleSyntax (+3 more)

### Community 30 - "ActivitiesPage.astro"
Cohesion: 0.30
Nodes (6): Activity, PER_PAGE, heading, hrefFor(), totalPages, totalPages

### Community 31 - "Program"
Cohesion: 0.40
Nodes (3): Program, { program }, { program }

### Community 32 - "Route table"
Cohesion: 0.18
Nodes (10): Breadcrumbs & SEO, Cluster 1 — Identity, Cluster 2 — Trust & transparency, Cluster 3 — Get involved & sustain, Cluster 4 — Activities, Navigation, Phase 1.1 — Sitemap & URL structure (both locales), Route table (+2 more)

### Community 33 - "Phase 1.3 — Component inventory & low-fi wireframe notes"
Cohesion: 0.18
Nodes (10): Component inventory, Content blocks, Director's message, Interactive, Layout & chrome, Organizational structure, Phase 1.3 — Component inventory & low-fi wireframe notes, Responsive breakpoints (+2 more)

### Community 34 - "GenericPage.astro"
Cohesion: 0.27
Nodes (3): items, jsonLd, Crumb

### Community 35 - "getActivities"
Cohesion: 0.20
Nodes (9): getActivities(), getActivity(), getFeaturedActivities(), getStaticPaths(), { activity, previous, next }, getStaticPaths(), getStaticPaths(), { activity, previous, next } (+1 more)

### Community 37 - "Phase 4 — Build & implementation"
Cohesion: 0.20
Nodes (9): 1. Verified results, 2. `scripts/check-build.mjs` — breadth, not spot-checks, 3. Content security policy — the Phase 3 open question, settled, 4. Fonts — self-hosted, and two bugs found doing it, 5. Three more accessibility defects found and fixed, 6. Also wired in this phase, 7. What is still placeholder, and what that needs, 8. Next (+1 more)

### Community 38 - "Questions for the SKO team"
Cohesion: 0.20
Nodes (9): Also still needed for the website, Donations, Organisation, Part 1 — already answered. Please check these are correct., Part 2 — we need answers from the team, Questions for the SKO team, Safeguarding — highest priority, Still needed, beyond the list above (+1 more)

### Community 39 - "content-review.mjs"
Cohesion: 0.36
Nodes (9): blocksToText(), countNeeds(), esc(), faqBlock(), isPlaceholder(), mark(), OUT, pair() (+1 more)

### Community 40 - "sanity.config.ts"
Cohesion: 0.32
Nodes (6): sanity, @sanity/vision, schemaTypes, FIXED_PAGES, singletonTypes, structure()

### Community 41 - "vercel.json"
Cohesion: 0.20
Nodes (9): maxDuration, buildCommand, framework, functions, api/contact.ts, installCommand, outputDirectory, routes (+1 more)

### Community 42 - "Phase 3 — Architecture & working skeleton"
Cohesion: 0.22
Nodes (8): 1. What was built, 2. Verification — actually run, not assumed, 3. Three defects found and fixed during the build, 4. Key architectural decisions as built, 5. Safeguarding, enforced in code, 6. Deliberately not done yet, and why, 7. Still needed from you before Phase 6, Phase 3 — Architecture & working skeleton

### Community 43 - "overrides"
Cohesion: 0.25
Nodes (8): adm-zip, overrides, @module-federation/dts-plugin, typeid-js, @vercel/frameworks, uuid, js-yaml, smol-toml

### Community 44 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, deploy, dev, start, test, typecheck

### Community 45 - "locale.ts"
Cohesion: 0.33
Nodes (5): ADR-0002, blockOptions, localeBlock, localeString, localeText

### Community 46 - "SKO website"
Cohesion: 0.25
Nodes (7): Environment, Quick start, Repository layout, Scripts, SKO website, The rules that keep this maintainable, The Studio (separate npm project)

### Community 47 - "BaseLayout.astro"
Cohesion: 0.15
Nodes (4): getSiteSettings(), htmlLang, intro, title

### Community 48 - "Phase 1.5 — Repo structure"
Cohesion: 0.29
Nodes (6): Conventions, Initial `.gitignore`, Layout, Phase 1.5 — Repo structure, Scripts, Why `studio/` is a separate npm project (not a workspace)

### Community 49 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, react, react-dom, sanity, @sanity/vision, styled-components

### Community 50 - "offline-copy.mjs"
Cohesion: 0.40
Nodes (4): DIST, OUT, ROOT, walk()

### Community 52 - "Targeted security remediation — 2026-09-14"
Cohesion: 0.40
Nodes (4): Hosting measures still requiring action, Scope and outcome, Targeted security remediation — 2026-09-14, Verification

### Community 53 - "Homepage — Open Field Ledger (site-wide reference surface)"
Cohesion: 0.40
Nodes (4): Direction contract, Homepage — Open Field Ledger (site-wide reference surface), Scope and mode, Unresolved

### Community 54 - "csp.mjs"
Cohesion: 0.50
Nodes (4): BASE_DIRECTIVES, DIST, htmlFiles(), SCRIPT_HOSTS

### Community 55 - "Self-hosted fonts"
Cohesion: 0.50
Nodes (3): Regenerating, Self-hosted fonts, Two things that matter about these files

### Community 63 - "DirectorMessage.astro"
Cohesion: 0.40
Nodes (4): name, pullQuote, title, DirectorMessage

### Community 64 - "devDependencies"
Cohesion: 0.50
Nodes (4): devDependencies, @types/node, @types/react, typescript

## Knowledge Gaps
- **416 isolated node(s):** `env`, `failures`, `SITE`, `Env`, `FunctionContext` (+411 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 481 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@sanity/image-url` connect `package.json` to `portable-text.ts`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `zod` connect `package.json` to `functions/api/contact.ts`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `@sanity/client` connect `package.json` to `portable-text.ts`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `env`, `failures`, `SITE` to the rest of the system?**
  _416 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `fixtures.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Phase 6 — Deployment runbook` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `functions/api/contact.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13846153846153847 - nodes in this community are weakly interconnected._