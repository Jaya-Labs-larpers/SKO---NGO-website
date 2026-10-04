# SEO Plan — Samatapheap Khnom Organization (SKO)

_Generated 2026-09-29 from SEO-KEYWORDS.md · stack: astro (7.3, static, i18n en/km, content from `src/lib/content/fixtures.ts` seeded into Sanity) · 14 pages to change · 1 new page brief · 0 redirects_

## How to read this

Pages are in priority order. Each table row is one element: `change` rows are applied by run 3, `keep` rows are not touched, `[FACT NEEDED]` rows wait for a human. Every proposed value names the keyword it carries.

Three things about this stack that shape every row below:

1. **Where a value lives.** Pages with a CMS `Page`/`Program` document (about, faq, safeguarding, impact, privacy, the four programmes) take their H1 from `title`, their summary from `intro`/`summary`, their headings from `## ` lines in `body`, and their `<title>`/meta from the optional `seo` object (`src/lib/seo.ts` → `resolveSeo`). The six code-driven pages (home, programs index, activities, partners, reports, contact) take H1 and meta from `src/lib/i18n/strings.ts` (`pageX` / `introX`) and today have **no separate `<title>` field** — title equals H1. Run 3 adds one (`seoX` keys, step 2).
2. **Source of truth is `fixtures.ts`, then Sanity.** `scripts/sanity-seed.mjs` imports fixtures into the dataset but *refuses to overwrite* an existing document. So every `fixtures.ts` change in this plan must also be entered in Sanity Studio on the live dataset (same field, same value), unless the dataset is re-imported with `--replace` because nobody has edited it. The plan lists the fixture path; the Studio field has the same name.
3. **The `<title>` suffix.** `SeoHead.astro` appends ` · Samatapheap Khnom Organization` (33 characters) to every title, which leaves 17–27 characters for the keyword part inside the 50–60 limit. **Decision D1:** this plan proposes changing the suffix to ` · SKO` (6 characters) and adding `alternateName: 'SKO'` to the `WebSite` node so Google's site-name display still shows the full organisation name (it reads `WebSite.name`/`alternateName`, not the title). All titles below are measured with ` · SKO`. If you keep the long suffix, apply the same front strings; Google will truncate the brand, not the keyword.

Other decisions a reviewer should make consciously, not by default:

- **D2 — Home `<title>` without the full org name.** Proposed: `Support for Vulnerable Families in Phnom Penh · SKO`. Brand searches ("samatapheap khnom") are covered by the H1 block (org name in the first paragraph), `WebSite`/`NGO` schema and `og:site_name`, but if the team wants the full name in the home title, use `Samatapheap Khnom Organization (SKO) · Phnom Penh` (52) and accept that the keyword moves to the meta and first paragraph only.
- **D3 — Home H1 stays the tagline.** "Families with the strength to change their own lives." is the brand statement. The plan keeps it (2.3: never a keyword where it reads badly) and carries `vulnerable families` in title, first paragraph and meta instead.
- **D4 — Programme H1s stay the programme names.** HALI, Children's Active Citizenship, Promoting Children's Education and Health through FDP, RCMD are the entities an answer engine must attribute results to. Renaming an H1 to a keyword would mis-describe the programme. The keyword goes first in the `<title>` and in the summary sentence.
- **D5 — Impact statistics stay verbatim.** No number, context line or quote is reworded. They are the citable fragments; the plan only adds keyword sentences *around* them.

## 1. Page changes

### 1.1 /programs/housing-and-living-conditions-hali/ — cluster: GBV prevention & family counselling — priority 93.1

File: `src/lib/content/fixtures.ts` → `programs[0]` (`_id: 'program-hali'`) · Sanity: `program` document `housing-and-living-conditions-hali` · template `src/page-templates/ProgramDetail.astro` · currently: —

| Element | Keyword | Current | Proposed | Action |
|---|---|---|---|---|
| Title | gender based violence | Housing and Living Condition Improvement (HALI) · Samatapheap Khnom Organization (79) | Gender-Based Violence Prevention in Phnom Penh: HALI · SKO (58) — field `seo.title.en` | change |
| H1 | — (D4) | Housing and Living Condition Improvement (HALI) | keep | keep |
| Summary (first paragraph) | gender based violence, family counselling | To enhance the quality of life of families, especially children, youth and women, living in urban poor areas. Using the Family Development Program (FDP) methodology, SKO provides psychological counselling, resilience-building, information, and referrals to essential services (health, education, economic, administrative). The project also aims to reduce domestic violence and promote safe, healthy living. | HALI is SKO's programme to reduce gender-based violence and improve living conditions for families in Phnom Penh's urban poor areas. Using the Family Development Program (FDP) methodology, social workers provide family counselling, resilience-building, information and referrals to health, education, economic and administrative services, with a focus on women, children and youth. — field `summary.en` (also the card text on `/` and `/programs/`) | change |
| Meta description | gender based violence, family counselling | (summary, truncated at 300 — too long, cut mid-sentence in SERPs) | HALI reduces gender-based violence in Phnom Penh's urban poor areas through family counselling, GBV training and referrals. 94% now know where to seek help. (156) — field `seo.description.en` | change |
| H2: What we do | — | What we do | keep | keep |
| H2: Partner | — | Partner | keep | keep |
| H2: Impact and results | gbv prevention | Impact and results | Impact and results: GBV prevention and family counselling — body block `## Impact and results` | change |
| Body: "Gender-Based Violence Training." paragraph | gbv services | Awareness and response training for local authorities and community leaders to strengthen referral systems and support victims. | keep wording; this paragraph already carries "gender-based violence" and referral (GBV services) | keep |
| Body: "Home Counseling." paragraph | domestic violence prevention | Psychosocial support for families, particularly women experiencing domestic violence… | keep (term present) | keep |
| Body: link out | women's empowerment → /impact/ | "89% of beneficiaries report more equitable decision-making within households, and 75% of female respondents…" | append to that sentence: " — see our [women's empowerment results](/impact/)" | change |
| Slug | — | /programs/housing-and-living-conditions-hali/ | keep | keep |
| Image alt: `hali-cover` (hero, `program.image`) | family counselling | "" (decorative; `ProgramDetail` passes `alt=""`) | SKO social worker leading a community counselling session with families under a shelter in Phnom Penh — field `image.alt.en`; and `ProgramDetail.astro` must stop forcing `alt=""` on the hero (step 5) | change |
| Image alt: `hali-card` (`program.cardImage`, shown on `/` and `/programs/`) | — | "" | Women in a community gender discussion group with an SKO social worker — field `cardImage.alt.en`; `ProgramCard.astro`/`ProgramRows.astro` currently hard-code `alt=""` — leave those as decorative (the card title is the accessible name) | change (field only) |
| JSON-LD | — | NGO, WebSite, BreadcrumbList | add `Service` node: `name` = H1, `description` = new summary, `provider` = `{ "@id": ".../#organization" }`, `areaServed` = Phnom Penh, `serviceType` = ["Family counselling", "Gender-based violence prevention training", "Referral to social services"], `audience.audienceType` = "Vulnerable families in urban poor communities" — via new `jsonLd` prop in `ProgramDetail.astro` (step 6) | change |

Links in:

| From page | Anchor text | Where in the page |
|---|---|---|
| /impact/ | gender-based violence | new sentence in the intro (§1.3) |
| /faq/ | domestic violence | answer to "Who does SKO help?" — "children affected by [domestic violence](…)" |
| /activities/ | family counselling | new intro sentence (§1.8) |
| / | (programme title) | programme row — existing, unchanged |
| /programs/resilient-city-and-migration/ | gender-based violence | "Gender-Based Violence (GBV) Training." paragraph: append " SKO's GBV work began in [HALI](…)" → anchor text is the programme name here to avoid two identical anchors; the keyword anchor comes from /impact/ and /faq/ |

Notes: The map's reasoning stands — this page holds the GBV evidence (94%, 89%, 75%). Nothing in the results paragraphs changes. "Gender-based violence" (hyphenated) is the site's house style and search engines treat it as the same term as the unhyphenated keyword.

### 1.2 /programs/childrens-active-citizenship/ — cluster: Child protection — priority 92.4

File: `src/lib/content/fixtures.ts` → `programs[1]` (`_id: 'program-tfcf1'`) · Sanity: `program` `childrens-active-citizenship` · currently: —

| Element | Keyword | Current | Proposed | Action |
|---|---|---|---|---|
| Title | child protection | Children's Active Citizenship · Samatapheap Khnom Organization (63) | Child Protection: Children's Active Citizenship · SKO (53) — `seo.title.en` | change |
| H1 | — (D4) | Children's Active Citizenship | keep | keep |
| Summary | child protection | To promote understanding of basic education and primary health care among community members, caregivers, and authorities for vulnerable children. | Children's Active Citizenship is SKO's programme for the education, health and child protection of vulnerable children in three sangkats of Phnom Penh. Children learn their rights, child protection and online safety; schools, parents, Family Development Volunteers and local authorities work together to keep them in school and safe. — `summary.en` | change |
| Meta description | child protection, child abuse prevention | (summary) | Child protection for vulnerable children in Phnom Penh: Children's Active Citizenship teaches child rights and online safety and keeps children in school. (154) — `seo.description.en` | change |
| H2: Impact and results | child abuse prevention | Impact and results | Impact and results: child protection and education — body block | change |
| Body | child abuse prevention | "increased awareness of their rights, child protection, online safety, and the risks of drug use" | keep; add one link (below) | keep |
| Body: link out | child safeguarding → /safeguarding/ | "…children demonstrated increased awareness of their rights, child protection, online safety…" | append to the paragraph's last sentence: " SKO's own [child safeguarding](/safeguarding/) policy applies to every activity." | change |
| Body: link out | family development → /programs/childrens-education-and-health/ | "This project shares its partner and highlight activities with its sister project, Promoting Children's Education and Health through FDP." | make "Promoting Children's Education and Health through FDP" the link; keyword-anchor variant elsewhere | change |
| Slug | — | keep | keep | keep |
| Image alt: `tfcf1-cover` (hero) | — | "" | Children seated in rows on a mat at a community session in an urban poor neighbourhood of Phnom Penh — `image.alt.en` | change |
| Image alt: `tfcf1-card` | — | "" | Children holding up their drawings at a Children's Club session with SKO staff — `cardImage.alt.en` | change |
| JSON-LD | — | NGO, WebSite, BreadcrumbList | add `Service`: `serviceType` = ["Child protection training", "Mobile library", "School materials distribution", "Medical check-ups"], `audience.audienceType` = "Vulnerable children and their families" (step 6) | change |

Links in:

| From page | Anchor text | Where in the page |
|---|---|---|
| /safeguarding/ | child protection | new sentence in the intro (§1.9) |
| /impact/ | child protection | "Children and youth" section, first sentence |
| /faq/ | child protection | answer to "What does SKO do?" — append "and [child protection](…) training" (see §1.13) |
| /programs/childrens-education-and-health/ | Children's Active Citizenship | "Child Protection Training." paragraph: append " Delivered together with our sister project [Children's Active Citizenship](…)." |
| / | (programme title) | programme row — existing |

Notes: The content document's stated purpose for this project is education and primary health awareness; child protection is what its *results* lead with. The summary says "education, health and child protection" rather than calling it "a child protection programme", so nothing is claimed that the document does not say. `[FACT CHECK]` for SKO: is it accurate to headline this programme as child protection? If SKO says no, swap the primary keyword with CEH's `family development` — the plan for both pages is symmetrical.

### 1.3 /impact/ — cluster: Women's empowerment & results — priority 88.9

File: `src/lib/content/fixtures.ts` → `pages[3]` (`_id: 'page-impact'`) · Sanity: `page` `impact` · template `src/page-templates/ImpactPage.astro` · currently: —

| Element | Keyword | Current | Proposed | Action |
|---|---|---|---|---|
| Title | women's empowerment, family resilience | Impact & results · Samatapheap Khnom Organization (49) | Women's Empowerment & Family Resilience: Our Impact · SKO (57) — `seo.title.en` | change |
| H1 | women's empowerment | Impact & results | Our impact on women's empowerment and family resilience — `title.en` (also the breadcrumb label; nav string `navImpact` stays "Impact") | change |
| Summary | women's empowerment, gender based violence | What we have done, how we count it, and what the families we work with say. | SKO measures its impact in women's empowerment, family resilience and child protection. In the HALI programme, 89% of households report more equitable decision-making, 75% of women surveyed make the household's financial decisions, and 94% know where to seek help for [gender-based violence](/programs/housing-and-living-conditions-hali/). — `intro.en` | change |
| Meta description | women's empowerment, family resilience | SKO's empowerment approach through the Family Development Approach (FDA) goes beyond providing immediate support. (Sanity value; fixture differs) | SKO's impact in Phnom Penh: women's empowerment and family resilience. 89% of households report fairer decisions and 94% know where to get help for GBV. (152) — `seo.description.en` | change |
| H2: Children and youth | child protection (anchor) | Children and youth | keep heading; first sentence gets the link "opportunities to be heard, express their needs, develop life skills" → prepend "[Child protection](/programs/childrens-active-citizenship/) comes first: " is *not* proposed (rewrites meaning). Instead append to the section's last sentence: " Child protection training is delivered through [Children's Active Citizenship](…)." | change (link only) |
| H2: Families and communities | community economic development | Families and communities | Families, communities and economic resilience — body block | change |
| Body: link out | family development → CEH | "Families become more connected to available services and resources…" | append: " through the [Family Development Program](/programs/childrens-education-and-health/) delivered in Khan Dangkor." — anchor is the programme's method name; the plain keyword anchor comes from CAC (§1.2) | change |
| H2: Results by project | — | Results by project | keep | keep |
| Body: link out | family strengthening programs → /activities/ | "The results for each of SKO's four projects are on their own programme pages." | append: " Month-by-month updates are under [activities from our family strengthening programs](/activities/)." | change |
| Slug | — | keep | keep | keep |
| Image alt | — | no page image | — | keep |
| JSON-LD | — | NGO, WebSite, BreadcrumbList | keep; the `ImpactStat` figures are already the citable fragments (D5). Optional later: `speakable` on the stats block (§6) | keep |

Links in:

| From page | Anchor text | Where in the page |
|---|---|---|
| /programs/housing-and-living-conditions-hali/ | women's empowerment results | results paragraph (§1.1) |
| /about/ | family and community resilience | "Networking and partnership" section, last sentence — existing phrase becomes the link |
| / | Impact | main nav — existing |
| /programs/resilient-city-and-migration/ | community economic development | "Economic Empowerment." paragraph: append " Results across programmes: [community economic development](/impact/)." |

Notes: The first paragraph now states three attributed numbers in one self-contained sentence — that is the AEO lift. They are copied from the HALI body verbatim (89 / 75 / 94) and attributed to HALI so the claim is exact.

### 1.4 /about/ — cluster: Who SKO is: family preservation — priority 85.7

File: `src/lib/content/fixtures.ts` → `pages[0]` (`_id: 'page-about'`) · Sanity: `page` `about` · template `src/page-templates/AboutPage.astro` · currently: —

| Element | Keyword | Current | Proposed | Action |
|---|---|---|---|---|
| Title | family preservation | About us · Samatapheap Khnom Organization (41) | Family Preservation NGO in Phnom Penh: About Us · SKO (53) — `seo.title.en` | change |
| H1 | family preservation | About us | About SKO: family preservation in Phnom Penh — `title.en` | change |
| Summary | family preservation, vulnerable families | Samatapheap Khnom Organization (SKO) is a Cambodian local NGO working to support vulnerable children, families, and communities, particularly in urban poor and migrant communities. | Samatapheap Khnom Organization (SKO) is a Cambodian local NGO whose work is family preservation: social work that keeps vulnerable families in Phnom Penh's urban poor and migrant communities together, so children grow up at home rather than in institutions. — `intro.en` | change |
| Meta description | family preservation, social work ngo | (intro) | Samatapheap Khnom Organization (SKO) is a family preservation and social work NGO in Phnom Penh, registered since 2007, keeping vulnerable families together. (157) — `seo.description.en` | change |
| Lead paragraph (before first H2) | social work ngo | "…registered with the Ministry of Interior under permit number 457 (សជណ) on 20 April 2007. SKO is recognised as Cambodia's leading expert in family care and social work." | keep (SKO's own claim; the registration line is a citable fact) | keep |
| H2: Our vision / Our mission / Our values | — | — | keep | keep |
| H2: Key Approaches of FDP | — | Key Approaches of FDP | How we work: the Family Development Program (FDP) — body block. Spells out the entity name once as a heading; the keyword "family development" belongs to CEH and is not the heading's target | change |
| H2: Networking and partnership | — | Networking and partnership | keep | keep |
| Body: link out | family and community resilience → /impact/ | "…SKO aims to strengthen family and community resilience and contribute to…" | make "family and community resilience" the link | change |
| Body: link out | our partners → /partners/ | "…development partners, and other stakeholders." | append: " See [the partners in our NGO work in Cambodia](/partners/)." | change |
| H2: Where we work | — | Where we work | keep | keep |
| Body: link out | family support programs → /programs/ | "Phnom Penh, across 14 khans within 105 Sangkat (urban poor communities are selected)" | append a bullet: "- Four [family support programs](/programs/), all delivered through FDP" | change |
| FAQ section (3 Q&As, FAQPage schema) | — | Is SKO a registered organisation? / Where does SKO work? / What does Samatapheap Khnom mean? | keep; add a link line under the section: "[More common questions about SKO](/faq/)" via `FaqSection` `moreHref` prop (step 7) | change (link only) |
| Slug | — | keep | keep | keep |
| Image alt: `director` | — | "Samnang Mourn, Executive Director" | keep | keep |
| JSON-LD | — | NGO, WebSite, BreadcrumbList, FAQPage | add `AboutPage` node: `mainEntity: { "@id": ".../#organization" }`, `name` = title, `description` = summary (step 6) | change |

Links in:

| From page | Anchor text | Where in the page |
|---|---|---|
| / | our approach to family preservation | "About" statement block, link-arrow — new string `homeAboutLink` replaces the generic "Learn more" (§1.7) |
| /faq/ | prevent children being separated from their families | answer to "Does SKO run an orphanage…?" — existing phrase becomes the link |
| /partners/ | social work NGO | new intro (§1.11) |
| /reports/ | About SKO | not added — the footer already links; three keyword anchors are enough |

Notes: "Cambodia's leading expert in family care and social work" is SKO's wording from the signed-off content document; it stays in the body untouched. The H1 doubles as the breadcrumb label ("About SKO: family preservation in Phnom Penh") — acceptable, but if it wraps badly on mobile, `AboutPage.astro` can pass `trail={[{ label: t(lang,'navAbout') }]}` instead.

### 1.5 /programs/childrens-education-and-health/ — cluster: Family development (FDP in practice) — priority 72.6

File: `src/lib/content/fixtures.ts` → `programs[2]` (`_id: 'program-tfcf2'`) · Sanity: `program` `childrens-education-and-health` · currently: —

| Element | Keyword | Current | Proposed | Action |
|---|---|---|---|---|
| Title | family development | Promoting Children's Education and Health through FDP · Samatapheap Khnom Organization (86) | Family Development: Children's Education and Health · SKO (57) — `seo.title.en` | change |
| H1 | — (D4) | Promoting Children's Education and Health through FDP | keep | keep |
| Summary | family development, family strengthening | To foster awareness among parents, caregivers, and local authorities about the importance of basic education and primary health care for vulnerable children. | Promoting Children's Education and Health through FDP is SKO's family development programme in Khan Dangkor, Phnom Penh. Through the Family Development Program (FDP), social workers, Family Development Volunteers, schools and health centres support 390 vulnerable children and their families with education, health, protection and family strengthening. — `summary.en` | change |
| Meta description | family development, family case management | (summary) | Family development through FDP in Khan Dangkor, Phnom Penh: SKO supports 390 vulnerable children and their families with education, health and case management. (159) — `seo.description.en` | change |
| H2: What we do | — | What we do | keep | keep |
| Body: "Child Protection Training." paragraph | — | Building children's capacity to understand and respond to different forms of violence… | append: " Delivered together with our sister project [Children's Active Citizenship](/programs/childrens-active-citizenship/)." | change (link) |
| Body: "Community Meetings." paragraph | family empowerment | "…building more positive, peaceful, resilient thinking for the family, children and community." | keep; the paragraph is the "family empowerment" evidence and already says positive parenting, stress, resilience | keep |
| H2: Partner | — | Partner | keep | keep |
| H2: Impact and results | family strengthening | Impact and results | Impact and results: family strengthening in Khan Dangkor — body block | change |
| Body: first results paragraph | family case management | "The project combined direct support to children with family strengthening, community engagement, health services, and collaboration…" | keep (term present) | keep |
| Slug | — | keep | keep | keep |
| Image alt: `tfcf2-cover` | — | "" | Children queue at a registration table during an SKO community session in Phnom Penh — `image.alt.en` | change |
| Image alt: `tfcf2-card` | — | "" | Parents and children at a community meeting with illustrated posters, Phnom Penh — `cardImage.alt.en` | change |
| JSON-LD | — | NGO, WebSite, BreadcrumbList | add `Service`: `serviceType` = ["Family development (FDP)", "Children's Clubs", "Mobile library", "School Support Committee", "Medical check-ups"], `areaServed` = "Khan Dangkor, Phnom Penh" (step 6) | change |

Links in:

| From page | Anchor text | Where in the page |
|---|---|---|
| /programs/childrens-active-citizenship/ | Promoting Children's Education and Health through FDP | sister-project sentence (§1.2) |
| /impact/ | Family Development Program | "Families and communities" section (§1.3) |
| /faq/ | family development in practice | answer to "What is the Family Development Approach?" — append " See [family development in practice](…) in Khan Dangkor." |
| /programs/resilient-city-and-migration/ | family case management | "Counselling & Referral Services." paragraph: make "scheduled counselling from social workers and weekly family visits" the link |

Notes: "Family development" is also the name of SKO's method (FDP/FDA). Until the NEW method page exists (§2.1), this programme page is where that term resolves; when the method page ships, the /faq/ link above moves to it and this page keeps the programme-specific anchors.

### 1.6 /programs/ — cluster: Family support programs (services index) — priority 71.1

File: `src/lib/i18n/strings.ts` (`pagePrograms`, `introPrograms`, new `seoPrograms`, `metaPrograms`) · template `src/page-templates/ProgramsPage.astro` · currently: —

| Element | Keyword | Current | Proposed | Action |
|---|---|---|---|---|
| Title | family support programs | Our work · Samatapheap Khnom Organization (41) | Family Support Programs in Phnom Penh: Our Work · SKO (53) — new string `seoPrograms` (step 2) | change |
| H1 | family support programs | Our work | Our family support programs — `pagePrograms` (also the breadcrumb root for programme pages; `navWork` stays "Our work") | change |
| Summary | family support programs, social work services | Four projects, one approach: a child growing up safe, in a family, in their own community. | SKO runs four family support programs in Phnom Penh's urban poor communities, all delivered through one approach, the Family Development Program: social work services so that a child grows up safe, in a family, in their own community. — `introPrograms` | change |
| Meta description | family support programs, social services cambodia | (intro) | SKO's four family support programs in Phnom Penh: family counselling and GBV prevention, child protection, education and health, and migration. Since 2007. (155) — new string `metaPrograms` | change |
| H2s | — | (none; four cards, then CTA "Ask about a program.") | add one H2 above the cards via `SectionHeading`: "Four programs, one Family Development Program" — carries the FDP entity; and keep the CTA | change |
| Card links | — | programme titles (existing) | keep; the card summaries change with §1.1/1.2/1.5/1.10 automatically | keep |
| Slug | — | keep | keep | keep |
| Image alt | — | cards `alt=""` (decorative, title is the name) | keep | keep |
| JSON-LD | — | NGO, WebSite, BreadcrumbList | add `CollectionPage` + `ItemList` of the four programme URLs (`ListItem.url`, `name` = programme title) (step 6) | change |

Links in:

| From page | Anchor text | Where in the page |
|---|---|---|
| / | All our family support programs | "What we do" section link-arrow — new string `viewAllPrograms` replaces generic "View all" on the home page only (§1.7) |
| /about/ | family support programs | "Where we work" bullet (§1.4) |
| /contact/ | our family support programs | new intro (§1.12) |
| /faq/ | family support programs | answer to "What does SKO do?" (§1.13) |
| every programme page | View all | "Other programs" link-arrow — existing, generic anchor is fine here (varied anchors rule) |

Notes: `social services cambodia` was the retired `/donate/` keyword; it lives here as a meta/body term because the search is for services, not for a way to give.

### 1.7 / — cluster: Vulnerable families (umbrella) — priority 70.3

File: `src/lib/i18n/strings.ts` (`homeHeroIntro`, new `seoHome`, `metaHome`, `homeAboutLink`, `viewAllPrograms`), `src/lib/content/fixtures.ts` → `siteSettings.tagline` (H1) · template `src/page-templates/HomePage.astro` · currently: —

| Element | Keyword | Current | Proposed | Action |
|---|---|---|---|---|
| Title | vulnerable families | Samatapheap Khnom Organization (30) | Support for Vulnerable Families in Phnom Penh · SKO (51) — new string `seoHome`, passed as `title`; `SeoHead` must not append the suffix twice (step 1) — see D2 | change |
| H1 | — (D3) | Families with the strength to change their own lives. | keep | keep |
| Summary (the "About" statement block, first body copy) | vulnerable families | Samatapheap Khnom Organization (SKO) is a Cambodian local NGO working to support vulnerable children, families, and communities, particularly in urban poor and migrant communities. SKO is recognized as Cambodia's leading expert in family care and social work. | Samatapheap Khnom Organization (SKO) is a Cambodian local NGO supporting vulnerable families, children and communities in Phnom Penh's urban poor and migrant communities since 2007. SKO is recognized as Cambodia's leading expert in family care and social work. — `homeHeroIntro` | change |
| Meta description | vulnerable families, child protection, family strengthening | Families with the strength to change their own lives. (54 — the tagline) | Samatapheap Khnom Organization (SKO): a Cambodian NGO supporting vulnerable families in Phnom Penh since 2007 through social work and child protection. (151) — new string `metaHome` | change |
| H2: About | — | About | keep | keep |
| Link: "Learn more" → /about/ | family preservation (anchor) | Learn more | Our approach to family preservation — new string `homeAboutLink` | change |
| H2: What we do | — | What we do | keep | keep |
| Link: "View all" → /programs/ | family support programs (anchor) | View all | All our family support programs — new string `viewAllPrograms` (home only) | change |
| H2: Latest activities / Trusted by | — | — | keep | keep |
| Link: partners | — | (marquee, no link) | add a link-arrow under the marquee: "All partners and funders" → /partners/ (string `allPartners`) | change |
| Story band | migration and development (anchor) | Sok Vanny · "Resilient City and Migration Dynamics project" (plain text) | make the `personRole` line a link to /programs/resilient-city-and-migration/ (`StoryQuote.astro`, when `story.program` is set) | change |
| Slug | — | / | keep | keep |
| Image alt: `home-hero` | — | "The SKO team in Phnom Penh" | keep (accurate) | keep |
| JSON-LD | — | NGO, WebSite | `WebSite.alternateName: 'SKO'` (D1); `NGO.knowsAbout` extended with "Family preservation", "Gender-based violence prevention", "Women's empowerment", "Family Development Program (FDP)", "Migration and development" — all terms the site's own copy uses (step 1) | change |

Links in:

| From page | Anchor text | Where in the page |
|---|---|---|
| every page | (logo) | header — existing |
| every page | Home | mobile nav / breadcrumb root — existing |
| /faq/ | the most vulnerable families in Phnom Penh's urban poor communities | answer to "What does SKO do?" — existing phrase becomes the link |
| /safeguarding/ | vulnerable families | new intro (§1.9) |

Notes: The eyebrow "Phnom Penh, Cambodia · Since 2007" and the registration line under the H1 stay — they are the entity signals an answer engine reads first.

### 1.8 /activities/ — cluster: Family strengthening in action — priority 69.1

File: `src/lib/i18n/strings.ts` (`pageActivities`, `introActivities`, new `seoActivities`, `metaActivities`) · template `src/page-templates/ActivitiesPage.astro` · currently: — (one real post; two `[EXAMPLE]` posts are stripped at build)

| Element | Keyword | Current | Proposed | Action |
|---|---|---|---|---|
| Title | family strengthening programs | Activities & news · Samatapheap Khnom Organization (50) | Family Strengthening Programs: Activities & News · SKO (54) — `seoActivities` | change |
| H1 | family strengthening programs | Activities & news | Family strengthening in action: activities & news — `pageActivities` (also breadcrumb root for posts; `navActivities` stays "Activities") | change |
| Summary | family strengthening programs, community counselling, family counselling (anchor) | What our teams are doing, month by month. | News from SKO's family strengthening programs in Phnom Penh: community counselling, [family counselling](/programs/housing-and-living-conditions-hali/) at home, training with local authorities, and stories from the families we work with, month by month. — `introActivities` (needs `PageHero` to accept an HTML/link-bearing intro, or the link goes in a second `<p>` — step 4) | change |
| Meta description | family strengthening programs, community counselling | (intro) | News from SKO's family strengthening programs in Phnom Penh: community counselling, training with local authorities, and stories from families, month by month. (159) — `metaActivities` | change |
| H2s | — | (post cards; pagination) | keep | keep |
| Slug | — | keep | keep | keep |
| Image alt | — | post cover images (none yet) | keep; when real posts land, `coverImage.alt` is a required field in Studio | keep |
| JSON-LD | — | NGO, WebSite, BreadcrumbList | add `CollectionPage` with `hasPart` = the listed posts' URLs (step 6); RSS feed link in `<head>` (§6) | change |

Links in:

| From page | Anchor text | Where in the page |
|---|---|---|
| / | All activities | "Latest activities" link-arrow — existing |
| every page | Activities | main nav — existing |
| /impact/ | activities from our family strengthening programs | "Results by project" (§1.3) |
| /programs/… (all four) | Activities from this programme | new link under the CTA band in `ProgramDetail.astro` → `/activities/` (no per-programme filter exists; plain link) — docs/10 item 12 |

Notes: Do not spend more here until real posts replace the placeholders (map §"Pages that need real content"). The first real training write-up is the home for `community social work`; the first real family story is the home for `family resilience` / `family empowerment` — both as body terms with anchors back to their cluster pages.

### 1.9 /safeguarding/ — cluster: Child safeguarding — priority 66.0

File: `src/lib/content/fixtures.ts` → `pages[2]` (`_id: 'page-safeguarding'`) · Sanity: `page` `safeguarding` · template `GenericPage.astro` · currently: —

| Element | Keyword | Current | Proposed | Action |
|---|---|---|---|---|
| Title | child safeguarding | Safeguarding and child protection · Samatapheap Khnom Organization (66) | Child Safeguarding Policy and How to Report a Concern · SKO (59) — `seo.title.en` (drops "child protection": CAC wins that term) | change |
| H1 | child safeguarding | Safeguarding and child protection | Child safeguarding: our policy and how to report a concern — `title.en` (footer string `navSafeguarding` stays "Safeguarding") | change |
| Summary | child safeguarding, vulnerable families (anchor), child protection (anchor) | Every person working with SKO, staff, volunteers and partners, is responsible for keeping children safe. | Child safeguarding at SKO means every person working with us, staff, volunteers and partners, is responsible for keeping children safe. It applies to all our work with [vulnerable families](/) and to the [child protection](/programs/childrens-active-citizenship/) training we deliver. — `intro.en` (links via `PageHero` intro, step 4) | change |
| Meta description | child safeguarding, child abuse prevention | (intro) | SKO's child safeguarding policy: every staff member, volunteer and partner is responsible for keeping children safe. How to report a concern, and the policy. (157) — `seo.description.en` | change |
| H2: Reporting a concern | — | Reporting a concern | keep (the answer-shaped block; contact name, email and phone stay verbatim) | keep |
| Body: link out | Reports & policies → /reports/ | "The full policy is available under Reports & policies." (plain text) | make "Reports & policies" the link: [Safeguarding & Child Protection Policy under Reports](/reports/) | change |
| Slug | — | keep | keep | keep |
| Image alt | — | no image | — | keep |
| JSON-LD | — | NGO, WebSite, BreadcrumbList | keep; optional later: the "Reporting a concern" block as a 1-item `FAQPage` ("How do I report a safeguarding concern to SKO?") once SKO confirms the wording — `faqs` field exists on `page` (§6) | keep |

Links in:

| From page | Anchor text | Where in the page |
|---|---|---|
| /programs/childrens-active-citizenship/ | child safeguarding | results paragraph (§1.2) |
| /contact/ | child safeguarding | safeguarding panel — panel title stays "Report a safeguarding concern"; add "Read our [child safeguarding](/safeguarding/) policy" under the panel text (`ContactPage.astro`) |
| /reports/ | child safeguarding policy | policy report item summary (§1.14) |
| every page | Safeguarding | footer — existing |

### 1.10 /programs/resilient-city-and-migration/ — cluster: Migration & development — priority 61.3

File: `src/lib/content/fixtures.ts` → `programs[3]` (`_id: 'program-rcmd'`) · Sanity: `program` `resilient-city-and-migration` · currently: —

| Element | Keyword | Current | Proposed | Action |
|---|---|---|---|---|
| Title | migration and development | Resilient City and Migration Dynamics (RCMD) · Samatapheap Khnom Organization (77) | Migration and Development in Phnom Penh: RCMD Project · SKO (59) — `seo.title.en` | change |
| H1 | — (D4) | Resilient City and Migration Dynamics (RCMD) | keep | keep |
| Summary | migration and development, financial literacy ngo, gender equality ngo | To improve the well-being of migrants and vulnerable families through financial literacy, vocational training, legal and public services, education, health, environmental awareness, gender equality, and capacity-building for local authorities. The project also addresses gender-based violence and promotes community engagement. | Resilient City and Migration Dynamics (RCMD) is SKO's migration and development project for migrants and vulnerable families in Phnom Penh: financial literacy, vocational training, legal documents and public services, education, health, gender equality and capacity-building for local authorities, with UNOPS (Cities Alliance) and funding from the Swiss Agency for Development and Cooperation. — `summary.en` | change |
| Meta description | migration and development, financial literacy | (summary, cut at 300) | Migration and development in Phnom Penh: RCMD helps migrants and vulnerable families with financial literacy, legal documents and gender equality, with UNOPS. (158) — `seo.description.en` | change |
| H2: What we do | — | What we do | keep | keep |
| Body: "Economic Empowerment." paragraph | community economic development (anchor) | …manage household income and expenses through microfinance… | append " Results across programmes: [community economic development](/impact/)." | change (link) |
| Body: "Counselling & Referral Services." paragraph | family case management (anchor) | …through scheduled counselling from social workers and weekly family visits. | make "scheduled counselling from social workers and weekly family visits" the link → CEH | change (link) |
| Body: "Gender-Based Violence (GBV) Training." paragraph | gender based violence (anchor) | … | append " SKO's GBV work began in [HALI](/programs/housing-and-living-conditions-hali/)." | change (link) |
| H2: Partner | — | Partner | keep | keep |
| H2: Impact and results (moved into the story band by the template) | — | Sok Vanny's account, verbatim | keep — this is the site's best GEO fragment (named person, dated, specific documents, quantified income); nothing changes | keep |
| Slug | — | keep | keep | keep |
| Image alt: `rcmd-cover` | — | "" | An SKO staff member speaks with a microphone at a public forum on legal documents with residents of a Phnom Penh community — `image.alt.en` | change |
| Image alt: `rcmd-card` | — | "" | A woman holds the official documents obtained with SKO's support — `cardImage.alt.en` (do not name her in alt) | change |
| JSON-LD | — | NGO, WebSite, BreadcrumbList | add `Service`: `serviceType` = ["Safe migration and public services", "Legal documentation support", "Counselling and referral", "Financial literacy", "GBV training"], `funder` = `{ "@type": "GovernmentOrganization", "name": "Swiss Agency for Development and Cooperation" }`, `provider` = org (step 6) | change |

Links in:

| From page | Anchor text | Where in the page |
|---|---|---|
| / | Resilient City and Migration Dynamics project | story band role line (§1.7) |
| /impact/ | (story band) | same `StoryQuote` change, on the impact page |
| /faq/ | migrated for work | answer to "Who does SKO help?" — "children whose parents have [migrated for work](…)" |
| /programs/ | (card title) | existing |

### 1.11 /partners/ — cluster: NGO partnerships & funding — priority 54.9

File: `src/lib/i18n/strings.ts` (`pagePartners`, `introPartners`, new `seoPartners`, `metaPartners`) · template `src/page-templates/PartnersPage.astro` · currently: —

| Element | Keyword | Current | Proposed | Action |
|---|---|---|---|---|
| Title | ngo work in cambodia | Partners & supporters · Samatapheap Khnom Organization (54) | NGO Work in Cambodia: Our Partners and Funders · SKO (52) — `seoPartners` | change |
| H1 | ngo work in cambodia | Partners & supporters | Partners in our NGO work in Cambodia — `pagePartners` (`navPartners` stays "Partners") | change |
| Summary | ngo work in cambodia, social work ngo (anchor) | The institutions and organisations we work alongside. | SKO's NGO work in Cambodia is delivered with international NGOs, foundations, UN agencies and government partners: Planète Enfants & Développement, Family Fund for Children Organization, UNOPS (Cities Alliance) and the Swiss Agency for Development and Cooperation. As a [social work NGO](/about/) we hold quarterly meetings with partners to work through shared challenges. — `introPartners` (link via step 4) | change |
| Meta description | ngo work in cambodia, community development funding | (intro) | SKO's NGO work in Cambodia is delivered with Planète Enfants & Développement, Family Fund for Children, UNOPS (Cities Alliance) and Swiss funding from SDC. (155) — `metaPartners` | change |
| H2: International NGOs / Foundations / UN agencies / Government | — | (category headings from `Partner.category`) | keep | keep |
| H2: CTA "Work with us." | community development funding | Work with us. | Fund or partner with our community development work. — `ctaPartnersTitle`; the CTA button already opens `/contact/?topic=partner` | change |
| Slug | — | keep | keep | keep |
| Image alt: partner logos | — | partner name (`PartnerWall`) | keep | keep |
| JSON-LD | — | NGO, WebSite, BreadcrumbList | add `ItemList` of `Organization` nodes (`name` from the visible list; `url` = `partner.url` when set). `[FACT NEEDED: partner website URLs for sameAs — `Partner.url` is empty in fixtures]` — apply the list without `url` until supplied (step 6) | change |

Links in:

| From page | Anchor text | Where in the page |
|---|---|---|
| /about/ | the partners in our NGO work in Cambodia | "Networking and partnership" section (§1.4) |
| / | All partners and funders | new link-arrow under the marquee (§1.7) |
| /contact/ | our partners | topic hint "Funders, NGOs, companies and government" — leave; instead the new contact intro links "partnerships" → /partners/ (§1.12) |
| every page | Partners | footer — existing |

Notes: The "quarterly meetings with partners" line is copied from the existing FAQ answer "How can my organisation partner with SKO?" — not a new claim.

### 1.12 /contact/ — cluster: Local NGO contact — priority 51.7

File: `src/lib/i18n/strings.ts` (`pageContact`, `introContact`, new `seoContact`, `metaContact`) · template `src/page-templates/ContactPage.astro` · currently: —

| Element | Keyword | Current | Proposed | Action |
|---|---|---|---|---|
| Title | ngo in phnom penh | Contact us · Samatapheap Khnom Organization (43) | Contact Our NGO in Phnom Penh: Visit, Call or Email · SKO (57) — `seoContact` | change |
| H1 | ngo in phnom penh | Contact us | Contact SKO, an NGO in Phnom Penh — `pageContact` (`navContact`/`contactUs` strings unchanged) | change |
| Summary | ngo in phnom penh, family support programs (anchor), ngo work in cambodia (anchor) | Questions, partnerships, volunteering. We read every message. | SKO is a local NGO in Phnom Penh, Cambodia: visit us at Office #8AE1, Street 138, Sangkat Veal Vong, Khan 7 Makara, call +855 12 781 203, or send a message about [our family support programs](/programs/), [partnerships](/partners/) or volunteering. We read every message. — `introContact` (link via step 4) | change |
| Meta description | ngo in phnom penh | (intro) | Contact SKO, an NGO in Phnom Penh: Street 138, Sangkat Veal Vong, Khan 7 Makara. Call +855 12 781 203 or email info@samatapheapkhnom.org, Mon–Fri 8:00–17:00. (157) — `metaContact` | change |
| H2: Send us a message / Report a safeguarding concern / What happens next | — | — | keep | keep |
| Safeguarding panel | child safeguarding (anchor) | (settings.safeguardingContact text) | append link line "Read our [child safeguarding](/safeguarding/) policy." (`ContactPage.astro`) | change (link) |
| "What happens next" | ngo in cambodia (anchor) | three steps + office hours + privacy line | append a fourth line: "Not sure who to ask? Start with our [common questions about SKO, an NGO in Cambodia](/faq/)." — new string `nextFaq` | change (link) |
| Slug | — | keep | keep | keep |
| Image alt | — | no image | — | keep |
| JSON-LD | — | NGO (with `address`, `telephone`, `email`), WebSite, BreadcrumbList | add `ContactPage` node with `mainEntity` = org; extend the `NGO` node with `openingHoursSpecification` (Mon–Fri 08:00–17:00, from `officeHours`) and `geo` `[FACT NEEDED: latitude/longitude — `siteSettings.geo` is null; `mapUrl` exists but is a short link]` (step 6) | change |

Links in:

| From page | Anchor text | Where in the page |
|---|---|---|
| every page | Contact us / Get involved / Partner with us / Volunteer | header, footer, CTA bands — existing (varied anchors already) |
| /faq/ | our office in Phnom Penh | answer to "How can my organisation partner with SKO?" — append " or [visit our office in Phnom Penh](/contact/)" |

Notes: The four retired URLs already 301 here, so the `/donate/`, `/volunteer/`, `/careers/`, `/partner-with-us/` link equity lands on this page. No redirect changes.

### 1.13 /faq/ — cluster: NGO in Cambodia (definitional) — priority 41.6

File: `src/lib/content/fixtures.ts` → `pages[1]` (`_id: 'page-faq'`) · Sanity: `page` `faq` · template `GenericPage.astro` + `FaqSection.astro` · currently: —

| Element | Keyword | Current | Proposed | Action |
|---|---|---|---|---|
| Title | ngo in cambodia | Common questions · Samatapheap Khnom Organization (49) | NGO in Cambodia: Common Questions About Our Work · SKO (54) — `seo.title.en` | change |
| H1 | ngo in cambodia | Common questions | Common questions about SKO, an NGO in Cambodia — `title.en` | change |
| Summary | ngo in cambodia, cambodia ngo | Answers to the questions we are asked most often by donors, partners and people who want to understand our work. | Common questions about SKO, a local NGO in Cambodia working with vulnerable families in Phnom Penh: what we do, who we help, how the Family Development Approach works, and how a Cambodian NGO, funder or company can partner with us. — `intro.en` | change |
| Meta description | ngo in cambodia | (intro) | Common questions about SKO, an NGO in Cambodia: what we do, who we help, whether we run an orphanage (we do not), how the Family Development Approach works. (156) — `seo.description.en` | change |
| H2: Common questions (`faqHeading`, same text as the old H1) | — | Common questions | Questions and answers — `faqHeading` string; fixes the duplicate H1/H2 text | change |
| Q: Does SKO run an orphanage…? | family preservation (anchor) | "…our work is to prevent children being separated from their families in the first place." | make "prevent children being separated from their families" the link → /about/ | change (link) |
| Q: What does SKO do? | vulnerable families (anchor), family support programs (anchor), child protection (anchor) | "SKO works with the most vulnerable families in Phnom Penh's urban poor communities. Social workers visit families at home… The aim is for families to sustain the progress themselves after SKO withdraws." | make "the most vulnerable families in Phnom Penh's urban poor communities" the link → /; append: " This runs through four [family support programs](/programs/), including [child protection](/programs/childrens-active-citizenship/) training." | change |
| Q: Who does SKO help? | domestic violence (anchor), migrated for work (anchor) | "…children affected by domestic violence… children whose parents have migrated for work." | link "domestic violence" → HALI; "migrated for work" → RCMD | change (links) |
| Q: What is the Family Development Approach? | family development (anchor) | … | append " See [family development in practice](/programs/childrens-education-and-health/) in Khan Dangkor." (moves to §2.1 when it ships) | change (link) |
| Q: How can my organisation partner with SKO? | ngo in phnom penh (anchor) | "…Email info@samatapheapkhnom.org to start a conversation." | append " or [visit our office in Phnom Penh](/contact/)." | change (link) |
| All other Q&As | — | — | keep verbatim — each is already a self-contained answer | keep |
| Question anchors | — | no `id` on questions | `FaqSection.astro`: add `id` per question (slug of the question) so `/faq/#what-is-the-family-development-approach` is linkable and quotable (step 7) | change |
| Slug | — | keep | keep | keep |
| JSON-LD | — | NGO, WebSite, BreadcrumbList, FAQPage (10 Q&As) | keep; the FAQPage `text` fields pick up the appended sentences automatically because `FaqSection` reads the same `answer` field. Links inside answers: `FaqSection` must render answers with the link mark (it currently prints plain text — step 7) | change |

Links in:

| From page | Anchor text | Where in the page |
|---|---|---|
| /reports/ | NGO in Cambodia | new intro (§1.14) |
| /contact/ | common questions about SKO, an NGO in Cambodia | "What happens next" (§1.12) |
| /about/ | More common questions about SKO | under the About FAQ block (§1.4) |
| every page | FAQ | footer — existing |

Notes: Since August 2023 Google shows FAQ rich results only for government and health sites, so the `FAQPage` markup here is for answer engines and AI assistants, not for a SERP accordion. That is exactly the map's purpose for this page. The 10 answers are the best AEO copy on the site; the plan adds links and one sentence, and rewrites nothing else.

### 1.14 /reports/ — cluster: Transparency & reports (support page) — priority —

File: `src/lib/i18n/strings.ts` (`pageReports`, `introReports`, new `seoReports`, `metaReports`), `src/lib/content/fixtures.ts` → `reports[]` summaries · template `src/page-templates/ReportsPage.astro` · currently: —

| Element | Keyword | Current | Proposed | Action |
|---|---|---|---|---|
| Title | — (loser of the `cambodia ngo` merge) | Annual reports & financials · Samatapheap Khnom Organization (60) | Annual Reports and Audited Financial Statements · SKO (53) — `seoReports` | change |
| H1 | — | Annual reports & financials | keep | keep |
| Summary | ngo in cambodia (anchor), social work (body term) | Our annual reports, audited financial statements and governance documents. | SKO publishes its annual reports, audited financial statements and its Safeguarding & Child Protection Policy in full. Registered with the Ministry of Interior since 2007, we account for our social work as an [NGO in Cambodia](/faq/) to the families we serve, our partners and our donors. — `introReports` (link via step 4) | change |
| Meta description | — | (intro) | SKO's annual reports, audited financial statements and Safeguarding & Child Protection Policy, published in full by a Cambodian NGO registered since 2007. (154) — `metaReports` | change |
| H2: 2026 / 2025 (years) | — | — | keep | keep |
| Report item: Safeguarding & Child Protection Policy — summary | child safeguarding (anchor) | Opens SKO's reports folder (Google Drive) until the PDF is uploaded here. | Opens SKO's reports folder (Google Drive) until the PDF is uploaded here. Read how it is applied on our [child safeguarding](/safeguarding/) page. — `reports[1].summary.en` (needs `ReportList` to render link marks or a plain `<a>` after the summary — step 7) | change |
| Slug | — | keep | keep | keep |
| JSON-LD | — | NGO, WebSite, BreadcrumbList | add `CollectionPage` + one `Report` node per listed item (`name` = title, `datePublished` = year, `url` = file link, `publisher` = org) (step 6). `[FACT NEEDED: the actual PDFs — the links are Drive folders; when PDFs are uploaded, `url` should point at the PDF]` | change |

Links in:

| From page | Anchor text | Where in the page |
|---|---|---|
| /safeguarding/ | Safeguarding & Child Protection Policy under Reports | body (§1.9) |
| /, /about/, every programme page | See our reports | CTA band secondary button — existing (`CtaBand.astro` links `/reports/` with `seeReports`) |
| every page | Reports | footer — existing |

Notes: This page ranks for nothing in the pool by design (see SEO-KEYWORDS.md conflicts). Its value is GEO: an annual report is the document an answer engine cites for "how many families does SKO support". The `Report` JSON-LD is only worth adding once the PDFs are real.

## 2. New pages (briefs, not pages)

### 2.1 /family-development-program/ — cluster: Social work in Cambodia: the method

| Field | Value |
|---|---|
| URL | https://www.sko-samatapheapkhnom.org/family-development-program/ (and `/km/family-development-program/`) |
| Title | Social Work in Cambodia: Family Development Program · SKO (57) |
| H1 | The Family Development Program: how SKO does social work in Cambodia |
| Meta description | The Family Development Program is SKO's social work method in Cambodia: home visits, family assessment, case management, counselling and referrals for families. (160) |
| Summary | The Family Development Program (FDP) is the social work method behind every SKO programme in Cambodia. Social workers visit families at home, assess the situation together, agree objectives the family sets for itself, and work through them over weekly or fortnightly visits until the family sustains the progress alone; SKO returns six months after phase-out to re-assess. |
| Outline | H2 "Why home-based community social work" ← community social work (from FAQ "Why does SKO work in people's homes…") · H2 "The eight approaches of FDP" ← family case management (the eight bullets now under About "Key Approaches of FDP", moved here and linked from About) · H2 "A case from first visit to phase-out" ← family counselling (from FAQ "How long does SKO work with a family?" and "What happens after…") · H2 "How results are measured" ← social work services (OSCaR, from FAQ) · H2 "FDP in each programme" ← family development (four links, one per programme) · H2 "Family Development Volunteers and local authorities" ← community social work (CCWCs, FDVs from HALI/CEH bodies) |
| Links from | /about/ ("How we work: the Family Development Program (FDP)" heading → link "social work in Cambodia") · /faq/ ("What is the Family Development Approach?" → "family development in practice", moved from CEH) · /programs/ ("one Family Development Program" H2 → link) · /activities/ (intro "community counselling" → link "community social work") · each programme page ("Using the Family Development Program (FDP) methodology" → link) |
| JSON-LD | `Article`/`WebPage` with `about` = org, plus `HowTo`? No — `DefinedTerm` is closer but obscure; use `WebPage` + a 4-item `FAQPage` reusing the four FDP answers from /faq/ (they move here, /faq/ keeps the short versions). Mark up visible text only. |
| Facts needed | none — every sentence above exists on the site today (About "Key Approaches of FDP", four FAQ answers, HALI/CEH "What we do"). The page consolidates, it does not invent. `[FACT NEEDED: whether SKO calls it "Family Development Program" (programme pages) or "Family Development Approach" (FAQ, Impact) — both appear; pick one for the H1 and state the other as an alias]` |

## 3. Redirects

| Old URL | New URL |
|---|---|
| — | no slug changes in this plan; the existing `public/_redirects` (donate, careers, volunteer, partner-with-us → contact) stays as is |

## 4. Apply steps (in order)

Steps 1–7 are code (one-time, enable the placements); steps 8–21 are content, page by page in priority order; 22–23 are build and verify. Every content step is a `fixtures.ts` or `strings.ts` edit **and** the same value entered in Sanity Studio for the live dataset (see "How to read this", point 2).

1. Site-wide `<head>` — edit `src/components/seo/SeoHead.astro`:
   - suffix (D1): `const fullTitle = plainTitle ? title : \`${title} · ${settings.orgShortName ?? 'SKO'}\`;` with a new `plainTitle?: boolean` prop (home passes the full string); the old `title === orgName` special case goes.
   - `webSiteJsonLd.alternateName = ['SKO']`.
   - `jsonLd.knowsAbout` append: `'Family preservation', 'Gender-based violence prevention', "Women's empowerment", 'Family Development Program (FDP)', 'Migration and development'`.
   ```astro
   interface Props { /* … */ plainTitle?: boolean; }
   const { /* … */ plainTitle = false } = Astro.props;
   const brand = settings.orgShortName ?? 'SKO';
   const fullTitle = plainTitle ? title : `${title} · ${brand}`;
   ```
   `BaseLayout.astro` forwards `plainTitle` to `SeoHead`.
2. Separate `<title>` from H1 on code-driven pages — edit `src/lib/i18n/strings.ts` (both `en` and `km` blocks; km values are the Khmer theme, §7) and the six templates:
   ```ts
   // strings.ts (en)
   seoHome: 'Support for Vulnerable Families in Phnom Penh',
   metaHome: 'Samatapheap Khnom Organization (SKO): a Cambodian NGO supporting vulnerable families in Phnom Penh since 2007 through social work and child protection.',
   seoPrograms: 'Family Support Programs in Phnom Penh: Our Work',
   metaPrograms: '…', seoActivities: '…', metaActivities: '…', seoPartners: '…', metaPartners: '…',
   seoContact: '…', metaContact: '…', seoReports: '…', metaReports: '…',
   homeAboutLink: 'Our approach to family preservation',
   viewAllPrograms: 'All our family support programs',
   allPartners: 'All partners and funders',
   nextFaq: 'Not sure who to ask? Start with our common questions about SKO, an NGO in Cambodia.',
   ```
   In each template: `<BaseLayout title={t(lang,'seoPrograms')} description={t(lang,'metaPrograms')} …>` while `PageHero title={heading}` keeps the H1. Home: `title={`${t(lang,'seoHome')} · ${settings.orgShortName}`} plainTitle`.
3. Links inside body copy — edit the `blocks()` builder in `src/lib/content/fixtures.ts` so a paragraph may contain `[anchor](/path)` and it becomes a Portable Text link mark (`src/lib/portable-text.ts` already renders `link` marks):
   ```ts
   function spans(text: string): { children: PortableSpan[]; markDefs: PortableMarkDef[] } {
     const children: PortableSpan[] = []; const markDefs: PortableMarkDef[] = [];
     const re = /\[([^\]]+)\]\(([^)\s]+)\)/g; let last = 0; let m: RegExpExecArray | null; let n = 0;
     while ((m = re.exec(text))) {
       if (m.index > last) children.push({ _type: 'span', text: text.slice(last, m.index) });
       const key = `l${n++}`; markDefs.push({ _key: key, _type: 'link', href: m[2] });
       children.push({ _type: 'span', text: m[1], marks: [key] }); last = m.index + m[0].length;
     }
     if (last < text.length) children.push({ _type: 'span', text: text.slice(last) });
     return { children, markDefs };
   }
   // in blocks(): const { children, markDefs } = spans(body); return { …, children, markDefs };
   ```
   `scripts/sanity-seed.mjs` copies `markDefs` as-is; in Studio the same links are ordinary link annotations.
4. Links inside page intros — `PageHero.astro` receives `intro` as a string. Add an optional `introHtml` (or accept `[anchor](/path)` and convert with the same regex, escaping the rest) so §1.8, §1.9, §1.11, §1.12, §1.14 intros can carry their links. Do not `set:html` raw CMS strings without escaping.
5. Programme hero alt — `src/page-templates/ProgramDetail.astro`: change `<ResponsiveImage image={program.image} lang={lang} alt="" …>` to omit `alt` so `ResponsiveImage` uses `image.alt` (falls back to `""` when unset). Cards (`ProgramCard.astro`, `ProgramRows.astro`) stay `alt=""`.
6. Page-type JSON-LD — `SeoHead` already accepts `jsonLd`. Add per template:
   - `ProgramDetail.astro`: `Service` node (fields per §1.1/1.2/1.5/1.10; `serviceType` arrays are the "What we do" lead-ins, not new text).
   - `AboutPage.astro`: `AboutPage`. `ContactPage.astro`: `ContactPage` + `openingHoursSpecification` merged into the NGO node (move the NGO node's optional fields into `SeoHead` props or a small `src/lib/seo/org.ts` helper).
   - `ProgramsPage.astro`, `ActivitiesPage.astro`, `ReportsPage.astro`: `CollectionPage` + `ItemList`/`hasPart`. `PartnersPage.astro`: `ItemList` of `Organization`.
   ```ts
   // ProgramDetail.astro
   const serviceJsonLd = {
     '@context': 'https://schema.org', '@type': 'Service',
     '@id': `${canonical}#service`, name: heading, description: seo.description,
     provider: { '@id': `${siteUrl}/#organization` },
     areaServed: { '@type': 'City', name: 'Phnom Penh' },
     serviceType: activityLeadIns, // from splitLeadIn over the "What we do" section
     audience: { '@type': 'Audience', audienceType: 'Vulnerable families in urban poor communities' },
   };
   ```
7. FAQ and report rendering — `FaqSection.astro`: add `id` per `<dt>` (slugified question), render answers through `portable-text`-style link handling (answers are `LocaleString`, so apply the step-3 regex → `<a>`; escape everything else), add optional `moreHref`/`moreLabel` props (About → `/faq/`). `ReportList.astro`: same link handling for `summary`. Change `faqHeading` to "Questions and answers".
8. §1.1 HALI — `fixtures.ts` `programs[0]`: `seo: { title: { en: 'Gender-Based Violence Prevention in Phnom Penh: HALI' }, description: { en: '…' } }`, `summary.en`, `## Impact and results` heading text, the `/impact/` link sentence, `image: localCmsImage('hali-cover', { en: '…' })`, `cardImage: localCmsImage('hali-card', { en: '…' })`.
9. §1.2 Children's Active Citizenship — `programs[1]`: `seo`, `summary.en`, heading, two links, both alts.
10. §1.3 Impact — `pages[3]`: `title.en`, `intro.en` (with link), `seo`, heading "Families, communities and economic resilience", three link sentences.
11. §1.4 About — `pages[0]`: `title.en`, `intro.en`, `seo`, heading "How we work: the Family Development Program (FDP)", three links, new "Where we work" bullet; `AboutPage.astro` passes `moreHref="/faq/"` to `FaqSection`.
12. §1.5 Children's Education and Health — `programs[2]`: `seo`, `summary.en`, heading, one link, both alts.
13. §1.6 Programs index — `strings.ts` `pagePrograms`, `introPrograms`, `seoPrograms`, `metaPrograms`; `ProgramsPage.astro` adds the `SectionHeading` "Four programs, one Family Development Program".
14. §1.7 Home — `strings.ts` `homeHeroIntro`, `seoHome`, `metaHome`, `homeAboutLink`, `viewAllPrograms`, `allPartners`; `HomePage.astro` uses them; `StoryQuote.astro` links `personRole` to `story.program` when set.
15. §1.8 Activities — `strings.ts` `pageActivities`, `introActivities`, `seoActivities`, `metaActivities`; `ProgramDetail.astro` adds the "Activities from this programme" link.
16. §1.9 Safeguarding — `pages[2]`: `title.en`, `intro.en` (two links), `seo`, the Reports link; `ContactPage.astro` adds the policy link under the safeguarding panel.
17. §1.10 RCMD — `programs[3]`: `seo`, `summary.en`, three links, both alts.
18. §1.11 Partners — `strings.ts` `pagePartners`, `introPartners`, `seoPartners`, `metaPartners`, `ctaPartnersTitle`.
19. §1.12 Contact — `strings.ts` `pageContact`, `introContact`, `seoContact`, `metaContact`, `nextFaq`; `ContactPage.astro` renders `nextFaq` as the fourth "What happens next" line with the link.
20. §1.13 FAQ — `pages[1]`: `title.en`, `intro.en`, `seo`, six answer edits (links + one appended sentence); `strings.ts` `faqHeading`.
21. §1.14 Reports — `strings.ts` `pageReports` (keep), `introReports`, `seoReports`, `metaReports`; `fixtures.ts` `reports[1].summary.en`.
22. Sanity — for each edited document, enter the same values in Studio (`seo.title`, `seo.description`, `summary`/`intro`, body headings and link annotations, image `alt`). If the dataset has not been edited by staff since seeding: `node scripts/sanity-seed.mjs > /tmp/sko-seed.ndjson && cd studio && npx sanity dataset import /tmp/sko-seed.ndjson production --replace`.
23. Build and run the verify section: `npm run check` (tests, typecheck, build with `scripts/check-build.mjs` — it already enforces one `h1` per page), then §5.

## 5. Verify

Run after applying, from the project root, against the built or deployed site.

```bash
# every changed page: 200, title, H1, canonical, no noindex
for u in https://www.sko-samatapheapkhnom.org/ https://www.sko-samatapheapkhnom.org/about/ https://www.sko-samatapheapkhnom.org/programs/ https://www.sko-samatapheapkhnom.org/programs/housing-and-living-conditions-hali/ https://www.sko-samatapheapkhnom.org/programs/childrens-active-citizenship/ https://www.sko-samatapheapkhnom.org/programs/childrens-education-and-health/ https://www.sko-samatapheapkhnom.org/programs/resilient-city-and-migration/ https://www.sko-samatapheapkhnom.org/activities/ https://www.sko-samatapheapkhnom.org/impact/ https://www.sko-samatapheapkhnom.org/partners/ https://www.sko-samatapheapkhnom.org/contact/ https://www.sko-samatapheapkhnom.org/faq/ https://www.sko-samatapheapkhnom.org/reports/ https://www.sko-samatapheapkhnom.org/safeguarding/; do
  echo "== $u"
  curl -sI "$u" | grep -iE "^HTTP/|x-robots-tag"
  curl -s "$u" | grep -ioE '<title>[^<]*</title>|<h1[^>]*>[^<]*</h1>|<link[^>]*canonical[^>]*>|<meta[^>]*robots[^>]*>'
done
# redirects (unchanged, but they carry the retired keywords' equity — confirm they still hold)
for o in /donate/ /volunteer/ /careers/ /partner-with-us/; do curl -sI "https://www.sko-samatapheapkhnom.org$o" | grep -iE "^HTTP/|location"; done
# duplicate titles across the plan
printf '%s\n' \
 'Gender-Based Violence Prevention in Phnom Penh: HALI · SKO' \
 'Child Protection: Children'"'"'s Active Citizenship · SKO' \
 'Women'"'"'s Empowerment & Family Resilience: Our Impact · SKO' \
 'Family Preservation NGO in Phnom Penh: About Us · SKO' \
 'Family Development: Children'"'"'s Education and Health · SKO' \
 'Family Support Programs in Phnom Penh: Our Work · SKO' \
 'Support for Vulnerable Families in Phnom Penh · SKO' \
 'Family Strengthening Programs: Activities & News · SKO' \
 'Child Safeguarding Policy and How to Report a Concern · SKO' \
 'Migration and Development in Phnom Penh: RCMD Project · SKO' \
 'NGO Work in Cambodia: Our Partners and Funders · SKO' \
 'Contact Our NGO in Phnom Penh: Visit, Call or Email · SKO' \
 'NGO in Cambodia: Common Questions About Our Work · SKO' \
 'Annual Reports and Audited Financial Statements · SKO' | sort | uniq -d
# structured data parses (built output)
for f in dist/index.html dist/about/index.html dist/programs/housing-and-living-conditions-hali/index.html dist/faq/index.html dist/contact/index.html; do
  node -e 'const h=require("fs").readFileSync(process.argv[1],"utf8");for(const m of h.matchAll(/<script[^>]*ld\+json[^>]*>([\s\S]*?)<\/script>/g)){JSON.parse(m[1])};console.log("ok",process.argv[1])' "$f"
done
# link marks rendered (not printed as [text](/path))
grep -rl '\](/' dist --include=index.html && echo "UNRENDERED LINK SYNTAX" || echo "links ok"
```

Pass when: every changed page returns 200 with the proposed title and one H1 in the raw HTML, no noindex, each retired URL still returns 301 to `/contact/` in one hop, no duplicate titles, every JSON-LD block parses, and no `](/` appears in built HTML.

## 6. Site-wide AEO / GEO placements (beyond the per-page table)

These are not keyword placements but they decide whether the placements above get cited. In the order to do them:

| # | Item | Where | Status / decision |
|---|---|---|---|
| 1 | `og:image` site-wide fallback | `siteSettings.ogImage` (Sanity) | `[FACT NEEDED: one 1200×630 photo from SKO]` — every shared link is bare text until then (docs/10 Tier 1) |
| 2 | Title suffix + `WebSite.alternateName` | step 1 | D1 |
| 3 | `Service` per programme, `AboutPage`, `ContactPage`, `CollectionPage`s | step 6 | in plan |
| 4 | Answer-first summaries | §1.x "Summary" rows | in plan — every page now opens with a sentence that stands alone |
| 5 | FAQ question `id`s + links in answers | step 7 | in plan |
| 6 | `llms.txt` at the site root | `src/pages/llms.txt.ts`, generated from `getSiteSettings()`, `getPage()`, `getPrograms()`, `getReports()` | **applied 2026-09-30**: name, the About intro as the one-line description, registration line, the four programmes with their resolved SEO description, the ten other canonical URLs with their meta description, the two report links, one line for `/km/`. `scripts/check-build.mjs` fails the build if it is missing or holds a relative link |
| 7 | AI-crawler policy in `robots.txt` | `src/pages/robots.txt.ts` | **Search bots applied 2026-10-04**: OAI-SearchBot, Claude-SearchBot, PerplexityBot, Amzn-SearchBot, meta-webindexer and Applebot are named with `Allow: /`. `*` already let them in, so access is unchanged; naming them is what the audit's A.02.1 gate credits. **Training bots (GPTBot, ClaudeBot, Google-Extended) remain an SKO board decision** (docs/10 item 6) and are covered only by `*` |
| 8 | Sitemap `lastmod` | `astro.config.mjs` sitemap `serialize` + `scripts/sitemap-lastmod.mjs` | **applied 2026-09-30, corrected 2026-10-04**: the build date told Google every page changed on every deploy, so it would stop trusting lastmod. Each URL now takes its Sanity document's `_updatedAt` (detail and CMS pages), the newest listed document (listings), or the newest edit in the dataset (home, contact). Fixtures builds omit it; `check-build.mjs` requires it on every URL of a Sanity build |
| 9 | RSS feed for `/activities/` | `src/pages/activities/rss.xml.ts` (`@astrojs/rss`) + `<link rel="alternate" type="application/rss+xml">` in `SeoHead` | after the first real post |
| 10 | `speakable` on the mission statement and the impact stats | `AboutPage`/`ImpactPage` JSON-LD `speakable.cssSelector` | after 1–8; low effort, low certainty of uptake |
| 11 | Safeguarding 1-item `FAQPage` | `pages[2].faqs` | after SKO confirms the reporting wording is final |
| 12 | Donation FAQs (3 Q&As already written) | nowhere to render until a donate section exists | blocked on `[FACT NEEDED: bank / KHQR / allocation %]` |

## 7. Khmer pages (`/km/…`)

Every field changed above is a `LocaleString` with a `.km` side (or a `km` block in `strings.ts`). Run 3 must not leave `.km` behind the `.en` change, or the Khmer page's title and summary stop matching the English page's theme and hreflang pairs drift. Rule for each field:

- **`seo.title.km`, `seo.description.km`, `intro.km`/`summary.km`**: write the Khmer sentence for the *same theme* (GBV prevention, child protection, family preservation…), by a Khmer-speaking staff writer, not a translation of the English keyword string. Until written, leave `.km` empty — `resolveSeo` falls back to the Khmer `title`/`intro`, which is correct behaviour and better than an English string on a Khmer page.
- **Headings and links in `body`**: the four programme bodies and About/Impact bodies are English-only (`enOnly`) today; nothing to do on the Khmer side until those bodies exist.
- **Image `alt.km`**: add alongside `alt.en` in the same edit (short, descriptive; no keyword requirement).
- **`strings.ts` `km` block**: `seoX`/`metaX`/`homeAboutLink`/`viewAllPrograms`/`allPartners`/`nextFaq`/`faqHeading` need Khmer values in the same commit (TypeScript enforces the key set via `Record<UIKey, string>`, so the build fails if they are missing — a good guard).
- A Khmer keyword pass (volumes, phrasing) is separate work and is the higher-value one long term (docs/10, "The Khmer side has a specific opportunity").

## 8. Re-run

- Keywords change → run 1, then run 2.
- Site changes (new pages, redesign, CMS migration) → run 2.
- 4–8 weeks after run 3 → paste the new Search Console rows into 1.3 and run 1 again; compare position and CTR per cluster with the "Now" column in the previous SEO-KEYWORDS.md. Search Console is not connected yet — connect the property (`https://www.sko-samatapheapkhnom.org`) before run 3 so there is a baseline.

## Applied — 2026-09-29

Branch `seo/plan-2026-09`, off `main` at 8fa640b. Nothing merged; Sanity untouched. Steps 1–21 applied as written except where listed under "Judgement calls". Step 22 (Sanity) is a to-do table for a human. Step 23 ran and passed.

### Commits

| Plan | Commit |
|---|---|
| Step 1, `<head>` suffix, `WebSite.alternateName`, `knowsAbout` (D1) | 5e32775 |
| Step 3, inline links in fixture body copy | a0a3007 |
| Step 4, links in page intros | 9043c9c |
| Step 5, programme hero alt | 09d551b |
| Step 2, `seoX`/`metaX` on the seven code-driven pages | 3033630 |
| Step 6, page-type JSON-LD | 453df74 |
| Step 7, FAQ ids, links in answers and report summaries | c420bfe |
| Not in plan: rows layout keeps a link (needed by §1.5, §1.10, §1.4 link placements) | b6585e6 |
| Steps 8–21 (§1.1–§1.14), one commit per page | b92b7e1 5ba1b26 6eef22e c33564a e9e4ccd 583f923 474c8e7 09fc217 0ee418d f9f73e4 4643fce 869741b 5713d68 a12c3aa |
| Not in plan: English SEO override no longer used on `/km/` pages | 8133256 |

Steps 3–5 were committed before step 2; none depends on the other.

### Per page

| Page | Changed | Skipped |
|---|---|---|
| /programs/housing-and-living-conditions-hali/ | seo title and description, summary, H2 "Impact and results: …", link to /impact/, hero and card alt (en, km), `Service` JSON-LD, Activities link | none |
| /programs/childrens-active-citizenship/ | same set; two links | none |
| /impact/ | H1, intro (with link), seo, H2 "Families, communities and economic resilience", three link sentences, story role line links to RCMD | `speakable` (§6, not a step) |
| /about/ | H1, intro, seo, H2 "How we work: …", three links, one "Where we work" bullet, FAQ link line, `AboutPage` JSON-LD | none |
| /programs/childrens-education-and-health/ | seo, summary, H2, one link, both alts, `Service` JSON-LD | none |
| /programs/ | H1, intro, seo title/description, new H2 over the cards, `CollectionPage` + `ItemList` | none |
| / | seo title/description, `homeHeroIntro`, About and programme link text, partners link, story role link; H1 kept (D3) | none |
| /activities/ | H1, intro (with link), seo title/description, `CollectionPage` with `hasPart` | RSS `<link>` (§6 item 9, waits for a real post) |
| /safeguarding/ | H1, intro (two links), seo, Reports link, policy link on /contact/ | 1-item `FAQPage` (§6 item 11, waits for SKO) |
| /programs/resilient-city-and-migration/ | seo, summary, three links, both alts, `Service` JSON-LD with `funder`; Sok Vanny account untouched | none |
| /partners/ | H1, intro (with link), seo title/description, CTA title, `ItemList` of `Organization` | `[FACT NEEDED: partner website URLs]`: list emitted without `url` |
| /contact/ | H1, intro (two links), seo title/description, safeguarding-policy link, "not sure who to ask" line, `ContactPage` JSON-LD, opening hours on the `NGO` node | `[FACT NEEDED: latitude/longitude]`: no `geo` |
| /faq/ | H1, intro, seo, H2 "Questions and answers", five answers with links, ids on every question, links render and stay out of the `FAQPage` text | none |
| /reports/ | intro, seo title/description, safeguarding link in the policy summary, `CollectionPage` | `Report` JSON-LD nodes: `[FACT NEEDED: the actual PDFs]` (links are Drive folders; the plan says only worth adding once the PDFs are real) |

Not applied, outside §4: §2.1 new page brief (`Create new pages in run 3: no`); §6 items 1 (`og:image`, FACT NEEDED), 7 (robots policy, SKO decision), 9, 10, 11, 12. §6 items 6 (`llms.txt`) and 8 (sitemap `lastmod`) were applied on 2026-09-30, after run 3. No redirects (§3). `/privacy/` and `/404` untouched. Impact statistics, the registration line and the safeguarding contact block are verbatim.

### Khmer (§7)

- `seoX`, `metaX`, `homeAboutLink`, `viewAllPrograms`, `allPartners`, `nextFaq`, `faqMore`, `programsSectionTitle`, `activitiesFromProgram`, `contactSafeguardingPolicy` are empty in `km`. Where an existing Khmer string does the same job the template falls back to it (`|| t(lang, 'learnMore')`, the Khmer heading and intro); where none exists (`allPartners`, `nextFaq`, `faqMore`, `programsSectionTitle`, `activitiesFromProgram`, `contactSafeguardingPolicy`) the element is not shown on Khmer pages. No English in any `km` field. A Khmer writer should fill these.
- `seo.title.km` and `seo.description.km` are left empty. §7 says `resolveSeo` then falls back to the Khmer title and intro; it did not (it fell back to English), so 8133256 fixes that. Khmer pages keep their existing Khmer titles, now with the ` · SKO` suffix.
- Image `alt.km` for the eight programme photos: written by me as a plain translation of the approved English alt, **not reviewed by a Khmer speaker**. Review before merge.
- `/km/` page H1 and summaries are unchanged (their bodies are English-only).

### Judgement calls a reviewer should check

1. **Alt text vs. photo.** The plan's `tfcf1-cover` alt said "seated in rows", but the photo shows children in a circle. Applied as "seated in a circle" (en) and the matching Khmer, at the plan owner's request; this is the one alt that differs from §1.2.
2. **/impact/ intro** says "89% of households" and "75% of women surveyed"; the HALI body says "89% of beneficiaries" and "75% of female respondents". Numbers match; wording is looser. Applied as written (D5).
3. **Programme /childrens-active-citizenship/ headlined as child protection** is still the plan's open `[FACT CHECK]` for SKO.
4. **/safeguarding/ Reports link**: the plan gives two anchors ("Reports & policies" and "Safeguarding & Child Protection Policy under Reports"). I linked the existing words "Reports & policies".
5. **Full stops.** Where a plan "append" would have left a sentence ending "…. or visit …" or "…. through the …", the link text sits before the full stop (FAQ partner answer, /impact/ Families sentence, HALI results sentence).
6. **"Activities from this programme"** is the plan's spelling; the site's UI uses "program".
7. **Title suffix** is now ` · SKO` on every page including Khmer pages (D1). Home passes `plainTitle`.
8. **Code beyond the plan**, each needed to make a listed placement work: `InlineLinks.astro` and `src/lib/inline-links.ts` (links in strings without injecting HTML); rows layout keeps its numbered rows when a row carries a link (`sections.ts`, `SectionedBody.astro`, tests); `ReportList` shows a summary only when it carries a link; `src/lib/seo/page-schema.ts` holds the `serviceType`, audience and funder values from §1 keyed by programme slug; `nextFaq` is a paragraph in the "What happens next" box, not a numbered step.
9. **Search Console** is not connected (§8): there is no baseline for the 4–8 week comparison.

### Verify (step 23)

`npm run check` passes (134 tests, typecheck 0 errors, build, structural checks) in both modes: against the live Sanity dataset (the `.env` default) and with `PUBLIC_CONTENT_SOURCE=fixtures`.

Against `dist/` from the fixtures build (the plan's values), the §5 checks run as file reads instead of `curl`:

- 14/14 pages: proposed title present, 50–60 characters (51–59), exactly one H1 equal to the plan's, canonical present, meta description 150–160 characters (home 151).
- No duplicate titles. Every JSON-LD block parses (checked on 9 pages incl. the five in §5). `FAQPage` has 10 Q&As and no link syntax. No `](/` in any built HTML.
- Khmer pages keep Khmer titles; none of the new English-only strings appear on `/km/` pages.
- `noindex` appears in the fixtures build by design (`preventIndexing` when content is local). It is absent in the Sanity-source build.
- Redirects: `public/_redirects` is unchanged and still 301s `/donate/`, `/volunteer/`, `/careers/`, `/partner-with-us/` to `/contact/`. Not curl-tested (no server).
- **The Sanity-source build still shows the old titles, H1s and descriptions for the CMS-backed pages** (about, faq, impact, safeguarding, four programmes) until the table below is entered. The seven code-driven pages already show the new values in both modes.

### Sanity to-do

Read-only query of `xm91vtfk` / `production`: 11 documents (5 pages, 4 programmes, 2 reports); none has `seo.title` or `seo.description`. All were created 2026-09-23 18:04. Eight (about, faq, impact, safeguarding, four programmes) were updated 2026-09-24 16:14:41, all in the same second, which looks like a script, not staff; the two reports and `page-privacy` were never updated. **I cannot confirm the dataset was never edited after seeding**, and the live /impact/ description already differs from the fixture, so do not re-import with `--replace`. Enter the values by hand:

Plain fields (type the value exactly; `[anchor](/path)` in `intro` is typed literally, the site turns it into a link):

| Document | Field | Value |
|---|---|---|
| `program-hali` | `summary.en` | HALI is SKO's programme to reduce gender-based violence and improve living conditions for families in Phnom Penh's urban poor areas. Using the Family Development Program (FDP) methodology, social workers provide family counselling, resilience-building, information and referrals to health, education, economic and administrative services, with a focus on women, children and youth. |
| `program-hali` | `seo.title.en` | Gender-Based Violence Prevention in Phnom Penh: HALI |
| `program-hali` | `seo.description.en` | HALI reduces gender-based violence in Phnom Penh's urban poor areas through family counselling, GBV training and referrals. 94% now know where to seek help. |
| `program-hali` | `image.alt.en` | SKO social worker leading a community counselling session with families under a shelter in Phnom Penh |
| `program-hali` | `image.alt.km` | បុគ្គលិកសង្គមកិច្ច SKO កំពុងដឹកនាំវគ្គប្រឹក្សាសហគមន៍ជាមួយគ្រួសារ នៅក្រោមជម្រកមួយក្នុងរាជធានីភ្នំពេញ |
| `program-hali` | `cardImage.alt.en` | Women in a community gender discussion group with an SKO social worker |
| `program-hali` | `cardImage.alt.km` | ស្ត្រីក្នុងក្រុមពិភាក្សាយេនឌ័រសហគមន៍ ជាមួយបុគ្គលិកសង្គមកិច្ច SKO |
| `program-tfcf1` | `summary.en` | Children's Active Citizenship is SKO's programme for the education, health and child protection of vulnerable children in three sangkats of Phnom Penh. Children learn their rights, child protection and online safety; schools, parents, Family Development Volunteers and local authorities work together to keep them in school and safe. |
| `program-tfcf1` | `seo.title.en` | Child Protection: Children's Active Citizenship |
| `program-tfcf1` | `seo.description.en` | Child protection for vulnerable children in Phnom Penh: Children's Active Citizenship teaches child rights and online safety and keeps children in school. |
| `program-tfcf1` | `image.alt.en` | Children seated in a circle on a mat at a community session in an urban poor neighbourhood of Phnom Penh |
| `program-tfcf1` | `image.alt.km` | កុមារអង្គុយជារង្វង់លើកន្ទេលនៅក្នុងវគ្គសហគមន៍មួយ ក្នុងសង្កាត់ក្រីក្រទីក្រុងនៃរាជធានីភ្នំពេញ |
| `program-tfcf1` | `cardImage.alt.en` | Children holding up their drawings at a Children's Club session with SKO staff |
| `program-tfcf1` | `cardImage.alt.km` | កុមារកំពុងលើកគំនូររបស់ខ្លួននៅវគ្គក្លឹបកុមារ ជាមួយបុគ្គលិក SKO |
| `page-impact` | `title.en` | Our impact on women's empowerment and family resilience |
| `page-impact` | `intro.en` | SKO measures its impact in women's empowerment, family resilience and child protection. In the HALI programme, 89% of households report more equitable decision-making, 75% of women surveyed make the household's financial decisions, and 94% know where to seek help for [gender-based violence](/programs/housing-and-living-conditions-hali/). |
| `page-impact` | `seo.title.en` | Women's Empowerment & Family Resilience: Our Impact |
| `page-impact` | `seo.description.en` | SKO's impact in Phnom Penh: women's empowerment and family resilience. 89% of households report fairer decisions and 94% know where to get help for GBV. |
| `page-about` | `title.en` | About SKO: family preservation in Phnom Penh |
| `page-about` | `intro.en` | Samatapheap Khnom Organization (SKO) is a Cambodian local NGO whose work is family preservation: social work that keeps vulnerable families in Phnom Penh's urban poor and migrant communities together, so children grow up at home rather than in institutions. |
| `page-about` | `seo.title.en` | Family Preservation NGO in Phnom Penh: About Us |
| `page-about` | `seo.description.en` | Samatapheap Khnom Organization (SKO) is a family preservation and social work NGO in Phnom Penh, registered since 2007, keeping vulnerable families together. |
| `program-tfcf2` | `summary.en` | Promoting Children's Education and Health through FDP is SKO's family development programme in Khan Dangkor, Phnom Penh. Through the Family Development Program (FDP), social workers, Family Development Volunteers, schools and health centres support 390 vulnerable children and their families with education, health, protection and family strengthening. |
| `program-tfcf2` | `seo.title.en` | Family Development: Children's Education and Health |
| `program-tfcf2` | `seo.description.en` | Family development through FDP in Khan Dangkor, Phnom Penh: SKO supports 390 vulnerable children and their families with education, health and case management. |
| `program-tfcf2` | `image.alt.en` | Children queue at a registration table during an SKO community session in Phnom Penh |
| `program-tfcf2` | `image.alt.km` | កុមារតម្រង់ជួរនៅតុចុះឈ្មោះ ក្នុងវគ្គសហគមន៍របស់ SKO នៅរាជធានីភ្នំពេញ |
| `program-tfcf2` | `cardImage.alt.en` | Parents and children at a community meeting with illustrated posters, Phnom Penh |
| `program-tfcf2` | `cardImage.alt.km` | ឪពុកម្តាយ និងកុមារនៅក្នុងកិច្ចប្រជុំសហគមន៍ដែលមានផ្ទាំងរូបភាពបង្ហាញ នៅរាជធានីភ្នំពេញ |
| `program-rcmd` | `summary.en` | Resilient City and Migration Dynamics (RCMD) is SKO's migration and development project for migrants and vulnerable families in Phnom Penh: financial literacy, vocational training, legal documents and public services, education, health, gender equality and capacity-building for local authorities, with UNOPS (Cities Alliance) and funding from the Swiss Agency for Development and Cooperation. |
| `program-rcmd` | `seo.title.en` | Migration and Development in Phnom Penh: RCMD Project |
| `program-rcmd` | `seo.description.en` | Migration and development in Phnom Penh: RCMD helps migrants and vulnerable families with financial literacy, legal documents and gender equality, with UNOPS. |
| `program-rcmd` | `image.alt.en` | An SKO staff member speaks with a microphone at a public forum on legal documents with residents of a Phnom Penh community |
| `program-rcmd` | `image.alt.km` | បុគ្គលិក SKO ម្នាក់និយាយតាមមីក្រូនៅក្នុងវេទិកាសាធារណៈស្តីពីឯកសារស្របច្បាប់ ជាមួយអ្នករស់នៅសហគមន៍មួយក្នុងរាជធានីភ្នំពេញ |
| `program-rcmd` | `cardImage.alt.en` | A woman holds the official documents obtained with SKO's support |
| `program-rcmd` | `cardImage.alt.km` | ស្ត្រីម្នាក់កាន់ឯកសារផ្លូវការដែលទទួលបានដោយមានការគាំទ្រពី SKO |
| `page-safeguarding` | `title.en` | Child safeguarding: our policy and how to report a concern |
| `page-safeguarding` | `intro.en` | Child safeguarding at SKO means every person working with us, staff, volunteers and partners, is responsible for keeping children safe. It applies to all our work with [vulnerable families](/) and to the [child protection](/programs/childrens-active-citizenship/) training we deliver. |
| `page-safeguarding` | `seo.title.en` | Child Safeguarding Policy and How to Report a Concern |
| `page-safeguarding` | `seo.description.en` | SKO's child safeguarding policy: every staff member, volunteer and partner is responsible for keeping children safe. How to report a concern, and the policy. |
| `page-faq` | `title.en` | Common questions about SKO, an NGO in Cambodia |
| `page-faq` | `intro.en` | Common questions about SKO, a local NGO in Cambodia working with vulnerable families in Phnom Penh: what we do, who we help, how the Family Development Approach works, and how a Cambodian NGO, funder or company can partner with us. |
| `page-faq` | `seo.title.en` | NGO in Cambodia: Common Questions About Our Work |
| `page-faq` | `seo.description.en` | Common questions about SKO, an NGO in Cambodia: what we do, who we help, whether we run an orphanage (we do not), how the Family Development Approach works. |
| `report-policy` | `summary.en` | Opens SKO’s reports folder (Google Drive) until the PDF is uploaded here. Read how it is applied on our [child safeguarding](/safeguarding/) page. |

Body (Portable Text). For each row, change the block to this text. Where it shows `[anchor](/path)`, type only the anchor text and add a **link annotation** with that path on it:

| Document | Block | New text |
|---|---|---|
| `program-hali` | heading (H2) | Impact and results: GBV prevention and family counselling |
| `program-hali` | paragraph | Gender awareness and empowerment through gender discussion groups reached 80% of all HALI beneficiaries, through SKO training (40 individuals) and CAFÉ training with PE&D (122 individuals). A large majority of beneficiaries consider gender-based violence a serious issue. 89% of beneficiaries report more equitable decision-making within households, and 75% of female respondents report that they make decisions on financial matters in the household — see our [women's empowerment results](/impact/). 94% of beneficiaries surveyed know where to seek assistance if they or someone they know experiences gender-based violence. |
| `program-tfcf1` | heading (H2) | Impact and results: child protection and education |
| `program-tfcf1` | paragraph | Under education and child protection, children demonstrated increased awareness of their rights, child protection, online safety, and the risks of drug use. Mobile library activities strengthened children’s reading, listening, communication, and learning engagement, while also improving their knowledge of road safety. The distribution of school materials to 410 children reduced financial pressure on vulnerable families and helped children remain motivated and better equipped for school. School Support Committee meetings also strengthened cooperation among schools, parents, volunteers, and local authorities, enabling stakeholders to identify children at risk of dropping out and develop practical solutions to support their continued education. SKO's own [child safeguarding](/safeguarding/) policy applies to every activity. |
| `program-tfcf1` | paragraph | This project shares its partner and highlight activities with its sister project, [Promoting Children’s Education and Health through FDP](/programs/childrens-education-and-health/). See that programme page for the full activity list. |
| `page-impact` | paragraph | For children and youth, empowerment means giving them opportunities to be heard, express their needs, develop life skills, and participate in decisions that affect their lives. This helps them build confidence, responsibility, and hope for their future rather than depending only on external support. Child protection training is delivered through [Children's Active Citizenship](/programs/childrens-active-citizenship/). |
| `page-impact` | heading (H2) | Families, communities and economic resilience |
| `page-impact` | paragraph | At the family and community level, empowerment strengthens relationships, communication, mutual support, and community participation. Families become more connected to available services and resources, while communities become better able to support vulnerable children and families through the [Family Development Program](/programs/childrens-education-and-health/) delivered in Khan Dangkor. |
| `page-impact` | paragraph | The results for each of SKO’s four projects are on their own programme pages. Month-by-month updates are under [activities from our family strengthening programs](/activities/). |
| `page-about` | heading (H2) | How we work: the Family Development Program (FDP) |
| `page-about` | paragraph | SKO recognizes that lasting change for children, families, and communities cannot be achieved by one organization alone. Networking and partnership are therefore an important part of SKO’s approach, enabling us to work together with government institutions, local authorities, NGOs, community groups, schools, service providers, development partners, and other stakeholders. See [the partners in our NGO work in Cambodia](/partners/). |
| `page-about` | paragraph | Through these relationships, SKO strengthens coordination, referrals, knowledge sharing, and joint problem-solving to better respond to the needs and challenges faced by vulnerable children and families. SKO values partnerships based on trust, mutual learning, shared responsibility, and a common commitment to sustainable solutions. By connecting people, services, and resources, SKO aims to strengthen [family and community resilience](/impact/) and contribute to safer, more protective, and supportive environments for children and families. |
| `page-about` | bullet | Four [family support programs](/programs/), all delivered through FDP |
| `program-tfcf2` | paragraph | Child Protection Training. Building children’s capacity to understand and respond to different forms of violence (emotional, sexual, physical, neglect, exploitation). Delivered together with our sister project [Children's Active Citizenship](/programs/childrens-active-citizenship/). |
| `program-tfcf2` | heading (H2) | Impact and results: family strengthening in Khan Dangkor |
| `program-rcmd` | paragraph | Counselling & Referral Services. Identifies the root causes of problems facing host and migrant communities, meets basic needs, strengthens capacity, and works towards sustainable solutions through [scheduled counselling from social workers and weekly family visits](/programs/childrens-education-and-health/). |
| `program-rcmd` | paragraph | Gender-Based Violence (GBV) Training. Trains host community and migrant residents on gender concepts and the root causes and impact of GBV, building towards positive change for families and the wider community. SKO's GBV work began in [HALI](/programs/housing-and-living-conditions-hali/). |
| `program-rcmd` | paragraph | Economic Empowerment. Builds migrant and host community members’ capacity to manage household income and expenses through microfinance, without added stress. Results across programmes: [community economic development](/impact/). |
| `page-safeguarding` | paragraph | The full policy is available under [Reports & policies](/reports/). |

FAQ answers on `page-faq` (`faqs[].answer.en`; type the `[anchor](/path)` syntax literally, as for `intro`):

| Question | New answer |
|---|---|
| Does SKO run an orphanage or residential care centre? | No. SKO does the opposite: our work is to [prevent children being separated from their families](/about/) in the first place. We provide counselling, case management and practical support so that families under pressure can stay together. Children do better in families than in institutions, and every part of the Family Development Program is built on that principle. |
| What does SKO do? | SKO works with [the most vulnerable families in Phnom Penh’s urban poor communities](/). Social workers visit families at home, help them identify their own needs and objectives, and connect them to health, education, administrative and economic services. The aim is for families to sustain the progress themselves after SKO withdraws. This runs through four [family support programs](/programs/), including [child protection](/programs/childrens-active-citizenship/) training. |
| Who does SKO help? | Families living in poverty in Phnom Penh’s urban poor communities, and the children and young people in them, including children at risk of separation from their families, children without birth certificates, children affected by [domestic violence](/programs/housing-and-living-conditions-hali/), children with disabilities, children affected by HIV/AIDS, and children whose parents have [migrated for work](/programs/resilient-city-and-migration/). |
| What is the Family Development Approach? | A structured method for working with families in poverty, built on the premise that families are not short of capability but of support, information and access. Social workers visit families at home, assess the situation together, agree objectives the family sets for itself, and work through them over a series of visits. See [family development in practice](/programs/childrens-education-and-health/) in Khan Dangkor. |
| How can my organisation partner with SKO? | SKO works in partnership with government ministries, NGOs and private-sector partners, and holds quarterly meetings with partners to work through shared challenges. Email info@samatapheapkhnom.org to start a conversation or [visit our office in Phnom Penh](/contact/). |

Also in Studio: nothing for the seven code-driven pages (home, programs, activities, partners, contact, reports; strings live in code). After publishing, the content-sync workflow redeploys.

Not decided here: `siteSettings.ogImage` (§6 item 1, needs a 1200×630 photo from SKO) and the AI-crawler policy in `robots.txt` (§6 item 7, SKO board decision).
