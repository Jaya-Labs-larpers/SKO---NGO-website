# SEO / AEO / GEO — audit and proposals

**Audit run against the built output.** Proposals are not implemented — they need your decisions
first, and two of them are policy rather than code.

Three different things, often conflated:

| | What it is | Who you are optimising for |
|---|---|---|
| **SEO** | Search Engine Optimisation | Google, Bing — ranking a *link* |
| **AEO** | Answer Engine Optimisation | Featured snippets, People Also Ask, voice — being *the answer* |
| **GEO** | Generative Engine Optimisation | ChatGPT, Claude, Perplexity, AI Overviews — being *cited* |

They pull in the same direction more often than not, but not always. GEO in particular rewards things
classic SEO ignores: factual density, clear attribution, and machine-readable structure.

---

## Where the site stands today

### SEO — strong. This is largely done.

| Signal | Status |
|---|---|
| Lighthouse SEO | **100** on every page tested |
| Per-page title and meta description | Yes — the audit caught 14 pages missing descriptions in Phase 4; fixed |
| Canonical URLs | Yes |
| `hreflang` en / km / x-default | Yes, on every page, plus alternates inside the sitemap |
| Sitemap | Yes, both locales, 404s excluded |
| `robots.txt` | Yes — though still pointing at `example.org` until launch |
| Semantic HTML, one `h1`, no skipped levels | Verified across all 64 pages by `scripts/check-build.mjs` |
| Mobile-first, CLS 0, LCP under 2s | Yes |
| Structured data | `NGO`, `BreadcrumbList`, `Article`, `JobPosting` |

**One structural advantage worth naming:** the site renders complete HTML with **zero JavaScript**.
Most AI crawlers execute JS poorly or not at all. A React site that assembles its content client-side
is frequently invisible to them. This one is fully legible to a crawler that only reads HTML — that
is a real GEO advantage the current architecture already gives you for free.

### AEO — thin. This is the biggest gap.

Answer engines lift *specific, self-contained answers*. The site currently presents prose, not
answers.

- **No `FAQPage` schema anywhere.** This is the single highest-leverage omission. "How do I donate to
  a Cambodian NGO?", "Is SKO registered?", "Where does my donation go?" are all questions the site
  answers in prose but never marks up as question-and-answer pairs.
- **No answer-first paragraphs.** Program pages open with context, not with a one-sentence definition
  of what the programme *is*. Answer engines extract the first self-contained sentence under a
  heading; ours often needs the paragraph before it to make sense.
- **No `speakable` markup** for voice assistants.

### GEO — partly there, and the good part is genuine.

- **The impact statistics are already well-built for this.** Every figure carries a `context` line
  ("since 2007", "2025 cohort"). Generative engines preferentially cite figures they can attribute and
  date — a bare "1,240 families" is unusable to them, "1,240 families since 2007 across 18 communes"
  is quotable. That decision was made for credibility with funders; it happens to be exactly right
  for GEO too.
- **Missing: entity disambiguation.** Nothing tells a model that this "SKO" is a Cambodian
  child-protection NGO rather than any of the other organisations sharing those initials. No
  `sameAs` to an authority record, no `areaServed`, no `knowsAbout`.
- **Missing: `llms.txt`.** An emerging convention — a plain-text map at the site root telling LLM
  crawlers what the site contains and where the authoritative pages are.
- **No explicit AI crawler policy.** `User-agent: * Allow: /` permits them by default, but silently.
  For an NGO that *wants* to be cited, this should be a stated intent, not an accident.
- **No feed.** RSS/JSON feeds remain a primary discovery channel for aggregators and crawlers.

### Also missing, plain SEO

- **`og:image` never renders** — `ogImage` is a CMS field and nothing is uploaded, so every link
  shared to Facebook, WhatsApp or Telegram appears as bare text. For an NGO that will be shared
  socially in Cambodia, this is a bigger practical loss than most of the schema work.
- **No `WebSite` schema**, no `Organization.logo`, no `dateModified` on any page.
- **Sitemap has no `<lastmod>`**, so crawlers cannot tell what changed.

---

## Proposals, in the order I would do them

### Tier 1 — high value, low effort (about half a day)

**1. Social share images.** Ask SKO for one 1200×630 image as the site-wide fallback, and wire
`ogImage` so an activity's cover image is used when it has one. Highest practical impact on this
list: it changes how every shared link looks.

**2. `FAQPage` structured data**, driven by a new repeatable CMS field so staff write the Q&As
themselves. Start with Donate ("How can I donate?", "Where does my money go?", "Can I get a
receipt?"), Safeguarding, and About ("Is SKO registered?"). This is what gets you into People Also
Ask and AI answers.

**3. Enrich the `NGO` schema** — `logo`, `description`, `areaServed: Cambodia`, `knowsAbout`
(child protection, family care, GBV prevention), `nonprofitStatus`, and `sameAs` pointing at a
Wikidata record if SKO has one. This is what makes a model confident *which* organisation you are.

**4. Add `WebSite` schema and `dateModified`**, and turn on `lastmod` in the sitemap. Small, purely
mechanical.

### Tier 2 — worth doing before launch (about a day)

**5. `llms.txt` at the site root.** A curated map: who SKO is, what the authoritative pages are, the
programmes, where the annual reports live. Cheap to generate at build time from the CMS.

**6. An explicit AI crawler policy in `robots.txt`.** **This is your decision, not mine.** Two honest
options:

| | What it means |
|---|---|
| **Allow** (my recommendation) | Name GPTBot, ClaudeBot, PerplexityBot, Google-Extended explicitly and allow them. You *want* an AI answering "which NGOs work on child protection in Phnom Penh?" to name SKO |
| **Disallow** | Some organisations object on principle to their content training commercial models |

For a small NGO competing for visibility against much larger organisations, being citable in AI
answers is a genuine channel. But it is a governance question for SKO's board, not a technical one.

**7. Answer-first content pattern.** Add an optional "In one sentence" field to programmes and pages,
rendered as the opening line. Costs staff one sentence per page and is what answer engines actually
extract.

**8. RSS and JSON feeds** for Activities, linked from `<head>`.

### Tier 3 — after launch, once there is real content

**9. `Article.author` and `publisher`** with the organisation logo, plus `dateModified` on posts.

**10. `speakable`** on the mission statement and impact figures.

**11. Per-programme `Service` schema** with `areaServed` and `audience`.

**12. Internal linking discipline** — activities already link to their programme; programmes should
link back to related activities. Both search and generative crawlers use link structure to work out
what a site is *about*.

---

## Two honest caveats

**None of this substitutes for content.** The site is currently full of `[PLACEHOLDER]`. Schema
markup describing placeholder text achieves nothing — worse, publishing structured data that
describes empty content can be actively counterproductive. **Tier 1 items 2 and 3 should be done
*after* SKO's real copy is in**, not before.

**The Khmer side has a specific opportunity.** There is very little authoritative Khmer-language
content about child protection and family care in Cambodia, and correspondingly little competition.
A Khmer page that genuinely answers "តើធ្វើដូចម្តេចដើម្បីរាយការណ៍ករណីកុមាររងគ្រោះ?" has a real chance of
being *the* cited source — for both Google and generative engines. That is worth more to SKO than
competing in English against organisations a hundred times its size. It also depends entirely on the
Khmer copy being written properly, which brings it back to the same bottleneck.

---

## What I recommend

Do **Tier 1 item 1** (share images) now — it is independent of content and immediately visible.

Hold items 2, 3 and 7 until SKO's real copy lands, then do them together in one pass; they are all
content-shaped and doing them against placeholders wastes the effort.

Get a decision on **item 6** (AI crawler policy) from whoever governs this at SKO, because it belongs
in `robots.txt` before the site is indexed rather than after.
