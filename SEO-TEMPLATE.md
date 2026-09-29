# SEO-TEMPLATE.md

_Reusable SEO template · v1.0 · September 2026_
_Fill section 1, leave everything else untouched. One copy per project._

## 0. How this file works

Copy this file into the project root (next to `package.json`, `astro.config.*`, `wp-config.php`, …). Fill section 1. Then run each step with the AI agent (Claude Code) from the project root:

| Run | Prompt to give the agent | Reads | Writes |
|---|---|---|---|
| 1 | `Read SEO-TEMPLATE.md and do run 1.` | Section 1 (keywords, analytics), light look at the site | `SEO-KEYWORDS.md` |
| 2 | `Read SEO-TEMPLATE.md and do run 2.` | `SEO-KEYWORDS.md`, the repo / CMS | `SEO-PLAN.md` |
| 3 | `Read SEO-TEMPLATE.md and do run 3.` | `SEO-PLAN.md` | Changes on a branch + `## Applied` section in `SEO-PLAN.md` |

Re-run 1 when the keyword list changes, then 2. Re-run 2 when the site changes. Run 3 is only ever done after a human has read `SEO-PLAN.md`. Each run overwrites the previous output of that run.

Outputs live next to this file. The skeletons for both outputs are in section 6; the agent fills them and leaves no `{{placeholder}}` behind.

## 1. Inputs (fill this section only)

### 1.1 Site

| Field | Value |
|---|---|
| Site URL (canonical, with https) | https://www.sko-samatapheapkhnom.org |
| Brand name | Samatapheap Khnom Organization (SKO) |
| What the site sells / does (one sentence) | A Phnom Penh NGO (registered 2007) that keeps vulnerable families together through home-based social work: family counselling, child protection, GBV prevention, education and health, and support for migrants. |
| Locale(s) | en, km (English at `/`, Khmer at `/km/`; keyword scores are English-only) |
| Stack | astro |
| Content location (optional; where pages and their metadata live) | `src/lib/content/fixtures.ts` (seeded into Sanity by `scripts/sanity-seed.mjs`; the live dataset is the runtime source), `src/lib/i18n/strings.ts` (titles/intros of the six code-driven pages), `src/components/seo/SeoHead.astro` (head + JSON-LD) |
| Priority pages (URLs, one per line, optional) | /programs/housing-and-living-conditions-hali/ · /programs/childrens-active-citizenship/ · /impact/ · /about/ |
| Max pages changed per run | 14 (all indexable English pages except /privacy/ and the placeholder posts) |
| Max new pages per run | 3 |
| Create new pages in run 3 | no |
| Business facts file (optional, e.g. `seo/site-facts.md`) | `src/lib/content/fixtures.ts` (the signed-off content document as data) and `docs/FAQ-for-team.md` (the `[NEEDS SKO]` list) |

Stack values: `auto` (detect from the repo, see 2.4), `nextjs-app`, `nextjs-pages`, `astro`, `nuxt`, `sveltekit`, `hugo`, `wordpress`, `static-html`, or `other: <name>`. When the stack is not in this list, the agent uses the name given and asks where page metadata lives if it cannot find it.

### 1.2 Keywords

One per line. Only the keyword is required. Format:

```
keyword | volume | intent | target url
```

- `volume`: monthly searches, if known. Leave empty otherwise.
- `intent`: `info`, `commercial`, `transactional`, `navigational`, `local`. Leave empty to let the agent infer it.
- `target url`: force this keyword onto a page. Leave empty to let the agent choose.

Source: `sko-keyword-url-map.md` (2026-09), composite scores in the fourth column instead of raw volume. Target URLs are the map's, corrected for the four retired pages (donate, volunteer, careers, partner-with-us → contact, see `public/_redirects`).

```
gender based violence | 93.1 | info | /programs/housing-and-living-conditions-hali/
child protection | 92.4 | info | /programs/childrens-active-citizenship/
women's empowerment | 88.9 | info | /impact/
family preservation | 85.7 | info | /about/
family development | 72.6 | info | /programs/childrens-education-and-health/
social work cambodia | 71.2 | info |
family support programs | 71.1 | commercial | /programs/
vulnerable families | 70.3 | info | /
family strengthening programs | 69.1 | info | /activities/
community social work | 67.7 | info |
child safeguarding | 66.0 | info | /safeguarding/
migration and development | 61.3 | info | /programs/resilient-city-and-migration/
social services cambodia | 57.8 | commercial | /programs/
ngo work in cambodia | 54.9 | commercial | /partners/
community development funding | 54.1 | commercial | /partners/
ngo in phnom penh | 51.7 | local | /contact/
cambodia ngo | 41.6 | info | /faq/
ngo in cambodia | 39.7 | info | /faq/
family strengthening | | info | /programs/childrens-education-and-health/
family resilience | | info | /impact/
social work services | | commercial | /programs/
gbv programs | | info | /programs/housing-and-living-conditions-hali/
domestic violence prevention | | info | /programs/housing-and-living-conditions-hali/
gbv prevention | | info | /programs/housing-and-living-conditions-hali/
gbv services | | info | /programs/housing-and-living-conditions-hali/
family counselling | | info | /programs/housing-and-living-conditions-hali/
child abuse prevention | | info | /programs/childrens-active-citizenship/
family empowerment | | info | /programs/childrens-education-and-health/
family case management | | info | /programs/childrens-education-and-health/
financial literacy ngo | | info | /programs/resilient-city-and-migration/
gender equality ngo | | info | /programs/resilient-city-and-migration/
community economic development | | info | /impact/
community counselling | | info | /activities/
social work ngo | | info | /about/
```

### 1.3 Analytics (optional)

Paste rows from Google Search Console (Performance → Queries, or Pages with queries), any period. Write `skip` if there are none yet.

```
query | page | clicks | impressions | ctr | position
```

```
skip
```

### 1.4 Constraints and notes (optional)

Anything the agent must respect: pages not to touch, words not to use, tone, competitor names to avoid, legal wording that must stay.

```
- Do not touch /privacy/ (legal page; keyword-free by design) or /404.
- Do not change any impact statistic, its context line, or the Sok Vanny story — verbatim only.
- Programme H1s are the programme names (HALI, Children's Active Citizenship, Promoting Children's Education and Health through FDP, RCMD). Keywords go in <title>, summary and headings, never in the H1.
- The home H1 is the tagline; leave it.
- Registration line ("Registered with the Ministry of Interior | Permit No. 457 (សជណ) | 20 April 2007") and the safeguarding contact block stay verbatim.
- Every LocaleString edit needs its .km side handled (see SEO-PLAN.md §7); never leave English in a .km field.
- Do not reintroduce /donate/, /volunteer/, /careers/ or /partner-with-us/ (docs/15-contact-consolidation.md).
- fixtures.ts changes must be mirrored in Sanity Studio unless the dataset is re-imported with --replace.
```

## 2. Rules (apply in every run)

### 2.1 Keyword rules

1. A cluster is a group of keywords that one page can satisfy with one intent. One cluster, one page. A page never carries two clusters.
2. Each page has exactly one primary keyword. Everything else in the cluster is secondary.
3. Prefer an existing page over a new one when the page already ranks for the cluster (1.3) or already covers the topic. A new page is created only when no existing page fits and the cap in 1.1 allows it. Beyond the cap, the cluster goes to BACKLOG.
4. Near-duplicates (plural, word order, stop words, spelling variants) merge into one cluster as variants of the same keyword.
5. Branded keywords go to the home or about page. Local keywords go to the contact or location page (or a location page per real location, never per keyword).
6. With analytics: position 1–3 → KEEP (no change unless CTR is poor); position 4–15 → OPTIMISE, highest priority, this is where gains are cheapest; position 16+ or not ranking → OPTIMISE if a page covers it, otherwise NEW or BACKLOG.
7. Conflicts: two pages ranking or targeting the same cluster → the page with more clicks, more inbound links, or the closer intent wins. The loser drops the keyword from its title and H1 and links to the winner.
8. Priority score when none is given: intent weight (transactional 4, commercial 3, local 3, info 2, navigational 1) × log of volume (or 1 if unknown), plus a boost for position 4–15 in analytics. The agent shows the score so the order can be questioned.

### 2.2 Placement rules

Where a keyword may go, in the order that matters most. Fill from the top; stop when it stops reading naturally.

| Order | Element | Rule | Limit |
|---|---|---|---|
| 1 | `<title>` | Primary keyword first, brand last (`Primary keyword – what it is \| Brand`). Unique per page. | 50–60 characters |
| 2 | H1 | Primary keyword, phrased for a reader, not a copy of the title. | Exactly one per page |
| 3 | First paragraph (summary) | Primary keyword within the first 100 words, inside a 1–3 sentence direct answer to the intent. | 1–3 sentences |
| 4 | H2 / H3 | Secondary keywords as section headings, only where the section really covers that keyword. | At most one keyword per heading; not every heading |
| 5 | Meta description | Primary or a secondary keyword, an accurate summary, a reason to click. | 150–160 characters |
| 6 | URL slug | Primary keyword, lowercase, hyphens. New pages only. An existing slug changes only with a 301 recorded in `seo/redirects.csv` (or the stack's redirect config). | ≤ 5 words |
| 7 | Image `alt` | Keyword only if the image actually shows it. Describe the image first. | Descriptive, not a keyword list |
| 8 | Internal links in | 2–5 links from related pages, anchor text = the keyword or a close variant, varied across sources. | No identical anchor on every source |
| 9 | JSON-LD | `name` / `headline` / `description` mirror the title and summary. Mark up visible content only. | Must parse |
| 10 | Body | Secondary keywords, synonyms and specifics (numbers, prices, dates). Coverage matters, density does not. | — |

### 2.3 Never

- Keyword stuffing, the keyword in every heading, hidden text, or a keyword where it reads badly.
- Changing an existing slug without a redirect.
- Touching pages that are noindexed, non-canonical, or listed in 1.4 as off limits.
- Inventing facts, prices, claims, awards, reviews, or numbers. Missing facts become `[FACT NEEDED: …]` in the plan and are never applied.
- Near-duplicate pages per city or per keyword (doorway pages), or new pages beyond the cap.
- Rewriting body copy beyond the placements listed in the plan.

### 2.4 Stack handling

Use the stack from 1.1. If it is `auto`, detect it from the repo root:

| Found | Stack | Page metadata usually lives in |
|---|---|---|
| `next.config.*` and `app/` | `nextjs-app` | `metadata` export or `generateMetadata` in `page.tsx`; content in the CMS or `content/` |
| `next.config.*` and `pages/` | `nextjs-pages` | `<Head>` in each page; `next-seo` config if present |
| `astro.config.*` | `astro` | Frontmatter in `src/content/**` or `src/pages/**`; a layout that renders `title` / `description` |
| `nuxt.config.*` | `nuxt` | `useSeoMeta` / `definePageMeta`; `content/` |
| `svelte.config.*` | `sveltekit` | `<svelte:head>` in `+page.svelte`; `+page.server.ts` |
| `hugo.toml` / `config.toml` and `content/` | `hugo` | Frontmatter in `content/**` |
| `wp-config.php` or `wp-content/` | `wordpress` | Post/page fields via REST (`/wp-json/wp/v2/pages?per_page=100`), Yoast or Rank Math fields; theme templates |
| Only `.html` files | `static-html` | The `<head>` of each file |

If nothing matches, the agent stops before run 2 and asks where pages and their metadata live. The plan (run 2) contains code and paths for this one stack only.

### 2.5 Facts

Business name, address, phone, prices and claims come from the business facts file in 1.1 or from the existing site, never from the agent. When a proposed text needs a fact that exists nowhere, the agent writes `[FACT NEEDED: what]` and run 3 skips that element.

## 3. Run 1 — build the keyword file

1. Read section 1. If 1.2 is empty, stop and ask for keywords. Record whether 1.3 has data.
2. Normalise every keyword: lowercase, trim, dedupe, merge near-duplicates (2.1 rule 4) as variants.
3. Assign intent: use the given value, otherwise infer it and mark it `(inferred)`.
4. Cluster by topic and intent (2.1 rule 1).
5. Score priority (2.1 rule 8) and sort clusters by score.
6. Choose a target page per cluster, in this order: the page that already ranks for it in 1.3 → the `target url` given in 1.2 → an existing page found by a light inventory (sitemap, routes, content titles and slugs) → `NEW` while the cap allows → `BACKLOG`. Mark status per 2.1 rule 6.
7. Detect conflicts (2.1 rule 7) and decide the winner.
8. List keywords left out and why (off-topic, another brand's name, duplicate).
9. Write `SEO-KEYWORDS.md` from skeleton 6.1.

**Self-check before finishing run 1:** no `{{` left · every keyword from 1.2 appears exactly once (in a cluster or in Unused) · every cluster has a status and a target page or NEW/BACKLOG · NEW count ≤ max new pages · each target page appears in only one cluster · intent given for every cluster · the priority score is shown.

## 4. Run 2 — build the plan

1. Read `SEO-KEYWORDS.md`. If missing, do run 1 first.
2. Resolve the stack (2.4). Stop and ask if unresolved.
3. Inventory every indexable page the keyword file targets: URL, file path (or CMS id), current title, meta description, H1, H2s, first paragraph, image alts, links out, JSON-LD, robots/canonical status. Read the source of truth for this stack (frontmatter, metadata exports, REST fields), or the built HTML when a build exists.
4. For every OPTIMISE cluster, go through the placement table (2.2) top to bottom. For each element write current and proposed, or `keep` when it already follows the rules. Every proposed value names the keyword it carries.
5. For every NEW cluster, write a brief (skeleton 6.2, section 2): slug, title, H1, meta, summary, H2 outline with the keyword each section carries, source pages that will link to it, JSON-LD type. Briefs are not pages.
6. Internal links: for each target page pick 2–5 source pages from the same section or topic, the anchor text, and the sentence or block where the link goes.
7. Conflicts from the keyword file: list what the losing page changes.
8. Redirects: one row per slug change.
9. Order the apply steps: pages by priority; within a page in placement order (title, H1, summary, meta, headings, links, JSON-LD, alt). Give the exact file and field for this stack, with a code snippet where the change is not obvious.
10. Verify section: substitute the real site URL into the commands in 6.2 section 5. If the project has `seo/seo-check.sh` and `seo/urls.txt`, use those instead and add any new URL to `urls.txt`.
11. Write `SEO-PLAN.md` from skeleton 6.2.

**Self-check before finishing run 2:** no `{{` left · every OPTIMISE cluster has a page section and every NEW cluster a brief · every file path in the plan exists (or the CMS id resolves) · every proposed title is 50–60 characters and unique across the plan and the site · every proposed meta is 150–160 characters · one H1 per page · no proposed value contains an invented fact (use `[FACT NEEDED]`) · pages changed ≤ max · every slug change has a redirect row · no noindexed or off-limits page is included.

## 5. Run 3 — apply the plan

1. Read `SEO-PLAN.md`. Refuse to continue if it contains `{{`, `TBD`, or no `## 1. Page changes` section.
2. Create a branch `seo/plan-YYYY-MM` (or, for WordPress without a repo, work in the CMS and keep a change list).
3. Apply the steps in the plan's order, page by page. Edit only the elements the plan lists. `keep` rows are not touched. Elements marked `[FACT NEEDED]` are skipped and reported.
4. New pages: create them from the briefs only if 1.1 says `Create new pages in run 3: yes`. Otherwise leave the briefs for a writer.
5. Add redirect rows to `seo/redirects.csv` and to the stack's redirect config.
6. Build the site. Run the plan's verify section. Fix only failures caused by these changes.
7. Append to `SEO-PLAN.md` a section `## Applied — YYYY-MM-DD` listing each page, the elements changed, skipped items with reasons, and the verify result. If `seo/content-log.csv` exists, append one row per page: `date,url,change,reason,owner`.
8. Commit (one commit per page keeps review easy), open a pull request, and stop. Never merge.

**Self-check before finishing run 3:** every step in the plan is applied or listed as skipped with a reason · build passes · verify passes · no file outside the plan's paths changed · `## Applied` written.

## 6. Output skeletons

The agent copies the skeleton, replaces every `{{placeholder}}`, repeats the row and section patterns as needed, and deletes any guidance line starting with `>`.

### 6.1 SEO-KEYWORDS.md

```markdown
# SEO Keywords — {{brand}}

_Generated {{date}} from SEO-TEMPLATE.md v1.0 · {{site url}} · {{n}} keywords → {{m}} clusters · analytics: {{yes/no}}_

## Summary

- Clusters: {{m}} · OPTIMISE: {{a}} · KEEP: {{b}} · NEW: {{c}} · BACKLOG: {{d}}
- Conflicts found: {{e}} · keywords left unused: {{f}}

## Clusters (priority order)

| # | Cluster | Primary keyword | Secondary keywords (variants) | Intent | Score | Target page | Status | Now: position · clicks · impressions |
|---|---|---|---|---|---|---|---|---|
| 1 | {{cluster}} | {{primary}} | {{secondary, comma separated}} | {{intent}} | {{score}} | {{url or NEW or BACKLOG}} | {{OPTIMISE/KEEP/NEW/BACKLOG}} | {{pos · clicks · impr, or —}} |

> Status: OPTIMISE = existing page gets changes in the plan · KEEP = already ranking 1–3, leave alone · NEW = brief in the plan · BACKLOG = fits nothing, over the new-page cap

## Gaps (NEW)

| Cluster | Proposed page | Slug | Why no existing page fits |
|---|---|---|---|
| {{cluster}} | {{page idea}} | {{/slug}} | {{reason}} |

## Conflicts

| Keyword | Page A | Page B | Winner | What the loser does |
|---|---|---|---|---|
| {{keyword}} | {{url}} | {{url}} | {{url}} | {{drop from title/H1, link to winner, …}} |

## Unused keywords

| Keyword | Reason |
|---|---|
| {{keyword}} | {{off-topic / duplicate of … / other brand / no intent match}} |
```

### 6.2 SEO-PLAN.md

```markdown
# SEO Plan — {{brand}}

_Generated {{date}} from SEO-KEYWORDS.md · stack: {{stack}} · {{n}} pages to change · {{m}} new page briefs · {{r}} redirects_

## How to read this

Pages are in priority order. Each table row is one element: `change` rows are applied by run 3, `keep` rows are not touched, `[FACT NEEDED]` rows wait for a human. Every proposed value names the keyword it carries.

## 1. Page changes

### 1.{{i}} {{URL}} — cluster: {{cluster}} — priority {{score}}

File: `{{path or CMS id}}` · currently: position {{pos}}, {{clicks}} clicks, {{impressions}} impressions (or —)

| Element | Keyword | Current | Proposed | Action |
|---|---|---|---|---|
| Title | {{primary}} | {{current}} | {{proposed, 50–60 chars}} | change / keep |
| H1 | {{primary}} | {{current}} | {{proposed}} | change / keep |
| Summary (first paragraph) | {{primary}} | {{current}} | {{proposed, 1–3 sentences}} | change / keep |
| Meta description | {{primary or secondary}} | {{current}} | {{proposed, 150–160 chars}} | change / keep |
| H2: {{existing heading}} | {{secondary}} | {{current}} | {{proposed}} | change / keep |
| Slug | {{primary}} | {{current}} | {{proposed or keep}} | keep unless redirect row exists |
| Image alt: {{file}} | {{keyword or —}} | {{current}} | {{proposed}} | change / keep |
| JSON-LD | — | {{type and fields}} | {{fields to update}} | change / keep |

Links in:

| From page | Anchor text | Where in the page |
|---|---|---|
| {{url}} | {{anchor}} | {{sentence or block}} |

Notes: {{conflict handling, facts needed, anything a reviewer should know}}

## 2. New pages (briefs, not pages)

### 2.{{i}} {{/slug}} — cluster: {{cluster}}

| Field | Value |
|---|---|
| URL | {{site url}}/{{slug}} |
| Title | {{50–60 chars}} |
| H1 | {{h1}} |
| Meta description | {{150–160 chars}} |
| Summary | {{1–3 sentences answering the intent}} |
| Outline | H2 {{heading}} ← {{keyword}} · H2 {{heading}} ← {{keyword}} · … |
| Links from | {{url}} ({{anchor}}) · {{url}} ({{anchor}}) |
| JSON-LD | {{type}} |
| Facts needed | {{list or none}} |

## 3. Redirects

| Old URL | New URL |
|---|---|
| {{old}} | {{new}} |

## 4. Apply steps (in order)

1. {{Page or brief}} — {{element}}: edit `{{file}}` field `{{field}}` → {{value}}
   ```{{language}}
   {{snippet, only where the change is not obvious for this stack}}
   ```
2. …
{{N}}. Add redirects to `seo/redirects.csv` and `{{stack redirect config}}`.
{{N+1}}. Build and run the verify section.

## 5. Verify

Run after applying, from the project root, against the built or deployed site.

```bash
# every changed page: 200, title, H1, canonical, no noindex
for u in {{changed URLs, space separated}}; do
  echo "== $u"
  curl -sI "$u" | grep -iE "^HTTP/|x-robots-tag"
  curl -s "$u" | grep -ioE '<title>[^<]*</title>|<h1[^>]*>[^<]*</h1>|<link[^>]*canonical[^>]*>|<meta[^>]*robots[^>]*>'
done
# redirects, if any
{{for each redirect: curl -sI OLD | grep -iE "^HTTP/|location"}}
# duplicate titles across the plan
{{list of proposed titles}} | sort | uniq -d
```

Pass when: every changed page returns 200 with the proposed title and one H1 in the raw HTML, no noindex, each redirect returns 301 to the new URL in one hop, and no duplicate titles.

## 6. Re-run

- Keywords change → run 1, then run 2.
- Site changes (new pages, redesign, CMS migration) → run 2.
- 4–8 weeks after run 3 → paste the new Search Console rows into 1.3 and run 1 again; compare position and CTR per cluster with the "Now" column in the previous SEO-KEYWORDS.md.

## Applied — {{filled by run 3}}
```
