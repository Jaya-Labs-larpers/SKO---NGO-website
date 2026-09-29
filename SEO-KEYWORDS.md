# SEO Keywords — Samatapheap Khnom Organization (SKO)

_Generated 2026-09-29 from SEO-TEMPLATE.md v1.0 · https://www.sko-samatapheapkhnom.org · 34 keywords → 15 clusters · analytics: no_

## Summary

- Clusters: 15 · OPTIMISE: 14 · KEEP: 0 · NEW: 1 · BACKLOG: 0
- Conflicts found: 6 · keywords left unused: 0
- Source: `sko-keyword-url-map.md` (composite scores from `keyword-master-list.md`). Scores are carried over, not recomputed (2.1 rule 8 applies only when no score is given).
- Every keyword is a member of exactly one cluster. The map also listed many keywords as secondaries on several pages; those cross-page uses survive as the **Body term / anchor on** column — the keyword is *mentioned* there and used as link anchor text pointing to its home page, but only the home page targets it in title, H1 and summary.

## What changed against the keyword-URL map, and why

1. **Four target URLs in the map no longer exist.** `/donate/`, `/volunteer/`, `/careers/` and `/partner-with-us/` were retired and 301 to `/contact/` (`public/_redirects`, `docs/15-contact-consolidation.md`). Their keywords are re-homed:
   - `social services cambodia` (57.8, donate) → secondary on `/programs/` — the search is for services, not for a place to give money; a donate page is not coming back (docs/15), and the donation data (`siteSettings.donation`, `donationFaqs`) is all `[NEEDS SKO]`.
   - `community development funding` (54.1, partner-with-us) → secondary on `/partners/` — the page a funder actually evaluates.
   - `social work cambodia` (71.2, careers) and `community social work` (67.7, volunteer) → **NEW** page cluster (see Gaps). Both are high-scoring and describe SKO's method; no existing page has this as its one intent. `/contact/` cannot take them: it already carries the local cluster and one page carries one cluster (2.1 rule 1).
2. **`ngo in cambodia` and `cambodia ngo` are one keyword** (word-order variant, 2.1 rule 4). The map put them on `/faq/` and `/reports/` respectively. Merged into the FAQ cluster (the map's own reasoning for FAQ — definitional volume — holds). `/reports/` loses its primary keyword and becomes a support page: it keeps its transparency role, gets a proper meta and JSON-LD, and links to FAQ with the keyword as anchor.
3. **`child safeguarding` (/safeguarding/) and `child protection` (/programs/childrens-active-citizenship/)** are close enough that each page must link to the other with the other's keyword and drop it from its own title/H1. The current safeguarding page title is "Safeguarding and child protection" — that changes.
4. **`family counselling`** moves from `/activities/` (map) to HALI, where the counselling actually happens (200 households counselled, Home Counseling, Community House Counseling). `/activities/` keeps `community counselling`.

## Clusters (priority order)

| # | Cluster | Primary keyword | Secondary keywords (variants) | Intent | Score | Target page | Status | Now: position · clicks · impressions | Body term / anchor on |
|---|---|---|---|---|---|---|---|---|---|
| 1 | GBV prevention & family counselling | gender based violence | domestic violence prevention, gbv prevention, gbv services, gbv programs, family counselling | info | 93.1 | /programs/housing-and-living-conditions-hali/ | OPTIMISE | — | /, /impact/, /programs/ |
| 2 | Child protection | child protection | child abuse prevention | info | 92.4 | /programs/childrens-active-citizenship/ | OPTIMISE | — | /, /activities/, /impact/, /faq/, /safeguarding/, /programs/childrens-education-and-health/ |
| 3 | Women's empowerment & results | women's empowerment | family resilience, community economic development | info | 88.9 | /impact/ | OPTIMISE | — | /, /about/, /programs/housing-and-living-conditions-hali/ |
| 4 | Who SKO is: family preservation | family preservation | social work ngo | info (branded) | 85.7 | /about/ | OPTIMISE | — | /faq/, /partners/ |
| 5 | Family development (FDP in practice) | family development | family strengthening, family empowerment, family case management | info | 72.6 | /programs/childrens-education-and-health/ | OPTIMISE | — | /, /programs/, /faq/, /reports/, /programs/resilient-city-and-migration/ |
| 6 | Family support programs (services index) | family support programs | social work services, social services cambodia | commercial | 71.1 | /programs/ | OPTIMISE | — | /, /contact/ |
| 7 | Vulnerable families (umbrella) | vulnerable families | — | info (branded) | 70.3 | / | OPTIMISE | — | /about/, /safeguarding/ |
| 8 | Family strengthening in action | family strengthening programs | community counselling | info | 69.1 | /activities/ | OPTIMISE | — | /programs/ |
| 9 | Child safeguarding | child safeguarding | — | info | 66.0 | /safeguarding/ | OPTIMISE | — | /programs/childrens-active-citizenship/, /reports/ |
| 10 | Migration & development | migration and development | financial literacy ngo, gender equality ngo | info | 61.3 | /programs/resilient-city-and-migration/ | OPTIMISE | — | /programs/ |
| 11 | NGO partnerships & funding | ngo work in cambodia | community development funding | commercial | 54.9 | /partners/ | OPTIMISE | — | /contact/ |
| 12 | Local NGO contact | ngo in phnom penh | — | local | 51.7 | /contact/ | OPTIMISE | — | / |
| 13 | NGO in Cambodia (definitional) | ngo in cambodia | cambodia ngo | info | 41.6 (merged; map had 39.7 + 41.6) | /faq/ | OPTIMISE | — | /, /contact/, /reports/, /partners/ |
| 14 | Transparency & reports | — (support page; `cambodia ngo` merged into #13) | — | info | — | /reports/ | OPTIMISE (meta, links, JSON-LD only) | — | — |
| 15 | Social work in Cambodia: the method | social work cambodia | community social work | info | 71.2 | NEW `/family-development-program/` | NEW | — | /about/, /programs/, /activities/, /reports/ |

> Status: OPTIMISE = existing page gets changes in the plan · KEEP = already ranking 1–3, leave alone · NEW = brief in the plan · BACKLOG = fits nothing, over the new-page cap

## Gaps (NEW)

| Cluster | Proposed page | Slug | Why no existing page fits |
|---|---|---|---|
| 15 Social work in Cambodia: the method | "Social work in Cambodia: the Family Development Program" — the entity page for FDP/FDA: home visits, assessment, case management, counselling, referral, phase-out and six-month re-assessment | `/family-development-program/` | FDP is the thread through every page (About "Key Approaches of FDP", 4 FAQ answers, every programme summary) but has no page of its own. `/about/` carries the family-preservation cluster and cannot take a second one. The two homeless keywords (`social work cambodia`, `community social work`) are exactly this page's intent, and it is the single best GEO entity page the site can add: an answer engine asked "how does family-based social work work in Cambodia" needs one URL to cite. Within the cap (1 ≤ 3). Brief only — `Create new pages in run 3: no`. |

Not proposed as NEW, deliberately: a `/donate/` page. `docs/15-contact-consolidation.md` retired it on purpose and every donation fact (bank, KHQR, allocation %) is still `[NEEDS SKO]`. Revisit only when SKO supplies those facts; the `donationFaqs` fixture (3 Q&As, one `[NEEDS SKO]`) is already written for that day.

## Conflicts

| Keyword | Page A | Page B | Winner | What the loser does |
|---|---|---|---|---|
| ngo in cambodia / cambodia ngo | /faq/ | /reports/ | /faq/ | /reports/ drops it from title and H1 (proposed title has no keyword); mentions "Cambodian NGO" once in the summary; links to /faq/ with anchor "NGO in Cambodia" |
| child protection / child safeguarding | /programs/childrens-active-citizenship/ | /safeguarding/ | each page wins its own term | /safeguarding/ drops "child protection" from its title and H1 (currently "Safeguarding and child protection"); links to CAC with anchor "child protection". CAC links to /safeguarding/ with anchor "child safeguarding" |
| social work cambodia | /about/ (map secondary) | /careers/ (retired) | NEW /family-development-program/ | /about/ does not use "social work in Cambodia" in its title; body keeps "family care and social work" (SKO's own wording) and links to the new page with anchor "social work in Cambodia" once it exists; until then, /about/ links to /faq/#family-development-approach |
| community social work | /volunteer/ (retired) | /activities/, /programs/, /about/ (map secondaries) | NEW /family-development-program/ | the three existing pages mention it in body and use it as anchor to the new page; none puts it in a heading |
| family counselling | /activities/ (map) | HALI | HALI | /activities/ uses "community counselling" instead; links to HALI with anchor "family counselling" |
| family strengthening | /programs/childrens-education-and-health/ | /, /programs/, /activities/ (map secondaries) | CEH | others mention it in body only; /activities/ keeps the plural "family strengthening programs" as its own primary — different intent (news about the programmes vs. the method) |

## Unused keywords

| Keyword | Reason |
|---|---|
| — | every keyword in the map is placed |

## Khmer (`/km/…`)

Not in this file. The scores are English-language; a Khmer keyword pass has not been done. The plan's structural changes (title/meta/H1 fields, JSON-LD, links, alt) are applied to the `.km` side of each `LocaleString` as the *same theme*, not a translated keyword string — see SEO-PLAN.md §7.
