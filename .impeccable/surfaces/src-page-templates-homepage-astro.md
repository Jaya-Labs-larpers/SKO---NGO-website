---
version: 1
slug: "src-page-templates-homepage-astro"
primary_target: "src/page-templates/HomePage.astro"
related_targets: ["src/page-templates/ReportsPage.astro","src/page-templates/ActivityDetail.astro","src/page-templates/DonatePage.astro","src/page-templates/ContactPage.astro"]
---

# Homepage — Open Field Ledger (site-wide reference surface)

## Scope and mode

Persuade. The homepage is the reference surface for a site-wide redesign spanning four page families: Persuasion (home, donate, partner, volunteer), Evidence (impact, reports, safeguarding, partners, about), Editorial (activities, programmes, careers detail), Utility (contact, FAQ, privacy, 404, empty states).

Audience: local donors, international donors, grant-making institutions. Job: decide whether SKO is credible, safe and well-governed. Action: donate by QR/bank transfer or open a partnership enquiry. Proof: registration (MoI permit 457, 2007), published annual reports and financials, a standalone safeguarding policy, a named partner index, contextualised impact figures with a stated method.

Constraints: bilingual EN / KM with equal authority; no invented figures, names, dates, partners or Khmer; placeholders stay visible and labelled; no payment handling; WCAG 2.1 AA; Lighthouse 90+; important content visible before JS; no scroll-reveal, parallax, carousels or count-up.

## Direction contract

THESIS: One editorial plane where field work and transparency material carry equal weight, organised by rules, indexes and numbered rows like an open field ledger. It refuses the category arrangement of hero → stat band → three identical cards → blue CTA band, and refuses the cream-serif-terracotta rendition: the display voice is a grotesk, the accent is a hairline, and the terracotta appears only as editorial emphasis.

OWN-WORLD: Warm mineral-paper canvas (#f6f3ec), green-black ink (#17201c), institutional indigo for every action and link (#2f3f8f), one dark terracotta for editorial emphasis (#9a4a2b), hairline rules in a warm grey. Hanken Grotesk for English display, nav and body; Kantumruy Pro for Khmer with the project's line-height rules; IBM Plex Mono only for evidence metadata (years, permit numbers, document type, size, section index). Corners 2px or square. Shadow only on the org-chart dialog and mobile menu. Every list is a ruled row; no bordered cards, no pills, no gradients.

STORY: A visitor reads registration and mission, sees one field photograph, reaches the annual report and safeguarding policy within the first viewport, understands the four programme areas as a numbered index, reads impact figures next to how they were counted, sees recent field updates as dated rows, recognises partners in a quiet index, and closes on a single donate/partner action.

FIRST VIEWPORT (1440): Header: wordmark left (SKO / Samatapheap Khnom), four group links (Our Work, Evidence, About, News), EN/ខ្មែរ switch, one indigo Support action. Below the header rule, a two-column ledger: left 7/12 carries the mono registration line, the tagline as the only display-size text, the mission paragraph, the primary Donate button and a text link to the programmes; right 5/12 stacks the field photograph frame and two ruled evidence rows (Transparency → annual reports; Safeguarding → policy). Beneath, a four-cell ruled strip indexing the programmes 01–04 plus a Reports & governance cell. Mobile: copy first, then photograph, then the two evidence rows, then the programme strip as a 2-column grid.

FORM: User-pinned direction "Open Field Ledger"; the concept-seed roll was not run because the brief pins the direction and forbids reopening concept selection. Build path: code-led. Signature interaction: the view transition keeps header and footer still while the page content slides in; row hover reveals an underline rule; no other motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Unresolved

- SKO logo, photography, real impact figures, final copy and Khmer chrome strings for the new labels are placeholders.
- Image credit is not a CMS field; captions render from the existing `caption` field only.
