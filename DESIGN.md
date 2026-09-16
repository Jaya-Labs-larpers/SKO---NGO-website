---
name: SKO — Open Field Ledger
description: One editorial plane of ruled rows and numbered indexes on warm mineral paper; grotesk display, indigo action, a single terracotta for editorial emphasis.
colors:
  canvas: "#f5f2ea"
  surface: "#fbf9f4"
  surface-sunken: "#ebe6da"
  surface-inverse: "#1a211d"
  ink-900: "#1a211d"
  ink-700: "#2f3934"
  ink-600: "#46504a"
  ink-400: "#5f6a63"
  ink-300: "#9aa39d"
  indigo-800: "#23306e"
  indigo-700: "#2e3d8a"
  indigo-200: "#bcc2dc"
  indigo-50: "#e8eaf3"
  terracotta-700: "#8f4326"
  danger-700: "#a8321f"
  danger-50: "#f7e9e4"
  success-700: "#1f6b45"
  success-50: "#e6efe8"
  line-subtle: "#e6e1d5"
  line: "#d6d0c2"
  line-strong: "#b3ab9a"
  line-ink: "#1a211d"
  on-action: "#ffffff"
typography:
  display:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.35rem + 3.2vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  h1:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 1.3rem + 2vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  h2:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 1.15rem + 0.9vw, 1.875rem)"
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: "-0.015em"
  h3:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  figure:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.75rem + 2vw, 3.25rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontVariation: "tabular-nums"
  lead:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.05rem + 0.3vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  sm:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  meta:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.08em"
  mono:
    fontFamily: "IBM Plex Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.04em"
    fontVariation: "tabular-nums"
  quote:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "-0.005em"
  body-km:
    fontFamily: "Kantumruy Pro, Hanken Grotesk, Noto Sans Khmer, Khmer UI, Leelawadee UI, sans-serif"
    fontSize: "1.0625em"
    fontWeight: 400
    lineHeight: 1.9
    letterSpacing: "normal"
  heading-km:
    fontFamily: "Kantumruy Pro, Hanken Grotesk, Noto Sans Khmer, Khmer UI, Leelawadee UI, sans-serif"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "normal"
  mono-km:
    fontFamily: "Kantumruy Pro, Hanken Grotesk, Noto Sans Khmer, Khmer UI, Leelawadee UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
rounded:
  xs: "1px"
  sm: "2px"
  md: "2px"
  lg: "3px"
spacing:
  row: "1.25rem"
  gutter: "clamp(1.25rem, 0.75rem + 2vw, 2.5rem)"
  section: "clamp(3rem, 2rem + 4vw, 5.5rem)"
  ledger-tight: "2rem"
  page: "80rem"
  narrow: "56rem"
  prose: "42rem"
  prose-km: "40rem"
components:
  button-primary:
    backgroundColor: "{colors.indigo-700}"
    textColor: "{colors.on-action}"
    typography: "{typography.sm}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1.25rem"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "{colors.indigo-800}"
    textColor: "{colors.on-action}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink-900}"
    typography: "{typography.sm}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1.25rem"
    height: "2.75rem"
  button-secondary-hover:
    backgroundColor: "{colors.ink-900}"
    textColor: "{colors.canvas}"
  button-sm:
    padding: "0.5rem 0.875rem"
    height: "2.5rem"
  button-disabled:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.ink-400}"
  link:
    textColor: "{colors.indigo-700}"
    typography: "{typography.body}"
    height: "2.75rem"
  row-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink-900}"
    typography: "{typography.h3}"
    padding: "1.25rem 0"
  row-link-hover:
    backgroundColor: "{colors.surface}"
  nav-link:
    textColor: "{colors.ink-900}"
    typography: "{typography.sm}"
    padding: "0.5rem 0.75rem"
    height: "2.75rem"
  nav-menu:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.sm}"
    padding: "0.375rem 0"
    width: "14rem"
  nav-menu-item:
    textColor: "{colors.ink-900}"
    typography: "{typography.sm}"
    padding: "0.625rem 1rem"
  nav-menu-item-hover:
    backgroundColor: "{colors.indigo-50}"
    textColor: "{colors.indigo-800}"
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-900}"
    rounded: "{rounded.sm}"
    padding: "0.6875rem 0.875rem"
    height: "2.875rem"
  field-invalid:
    backgroundColor: "{colors.danger-50}"
  label:
    textColor: "{colors.ink-400}"
    typography: "{typography.label}"
  mono:
    textColor: "{colors.ink-400}"
    typography: "{typography.mono}"
  media-placeholder:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.ink-400}"
    typography: "{typography.mono}"
    padding: "0.75rem"
  dialog:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-900}"
    padding: "0"
---

# Design System: SKO — Open Field Ledger

## Overview

**Creative North Star: "The Open Field Ledger"**

The site is one editorial plane, not a stack of marketing bands. Field work and transparency material sit side by side in the same material: ruled rows, numbered indexes, a label column on the left and content on the right, the way a field ledger is kept. Structure comes from hairline rules on warm mineral paper, never from fills, shadows or boxes. A programme is a numbered row; a report is a year, a title and its evidence metadata; an impact figure is a number beside what it counts and how it was counted.

The voice is a grotesk. Hanken Grotesk carries English display, navigation and body; Kantumruy Pro carries all Khmer with its own leading and no tracking; IBM Plex Mono is reserved for evidence metadata (years, dates, the permit line, document type/language/size, index numbers, category tags). Every action and link is one institutional indigo. One dark terracotta appears only as editorial emphasis (index numbers, category tags, closing-soon dates, the pull-quote rule) and is never the sole carrier of meaning.

The build explicitly refused the category arrangement of hero → stat band → three identical cards → CTA band, and the cream-serif-terracotta rendition of an NGO site. Motion is continuity only: the native cross-document view transition holds header and footer still while the page content slides in 6px; nothing reveals on scroll, nothing counts up, nothing parallaxes.

**Key Characteristics:**
- Ruled rows and numbered indexes instead of cards, tiles and bands.
- Warm mineral paper (#f5f2ea) with green-black ink; hairlines are the structural material.
- Hanken Grotesk display and body; Kantumruy Pro leads its own Khmer stack; Plex Mono for evidence metadata only.
- Indigo is the only action colour; terracotta is editorial emphasis, never the only signal.
- Corners 1–3px, one shadow for true overlays, no gradients.
- Motion is a native view transition plus panel/dialog/details continuity, all off under reduced motion.
- Bilingual EN/KM with equal authority; placeholders are visible, labelled neutral frames.

## Colors

A quiet mineral palette: warm paper, green-black ink in four legible steps, one indigo for action, one terracotta for emphasis, and hairlines in warm grey.

### Primary
- **Institutional Indigo** (`{colors.indigo-700}`, 8.7:1 on canvas; white on it 9.8:1): every link, the primary button, the row arrow, the disclosure icon, `accent-color`, `caret-color`, the `::selection` ground, and the focus ring. Hover deepens to **Indigo Deep** (`{colors.indigo-800}`, 10.9:1). **Indigo Halo** (`{colors.indigo-200}`) is the link underline at rest and the 3px field-focus halo; **Indigo Wash** (`{colors.indigo-50}`) is the hovered/current submenu row fill and the selected-row tint.

### Tertiary
- **Field Terracotta** (`{colors.terracotta-700}`, 6.3:1): editorial emphasis only. Seen on programme index numbers (01–04), activity category tags, careers closing-soon dates, the 404 code, the left rule of a story quote, the bottom rule under the Director's pull quote, the contact-page note rule, and the preview-deployment notice. It never carries meaning alone: every terracotta element also has a label, a number or a position that says the same thing.

### Neutral
- **Mineral Paper** (`{colors.canvas}`): the page, the header, the footer, the submenu, the dialog. There is no second page tone.
- **Paper Lifted** (`{colors.surface}`): input fields, the hovered ruled row, the hovered programme-strip cell; one step lighter than canvas.
- **Paper Sunken** (`{colors.surface-sunken}`): placeholder media frames, disabled buttons, the silhouette avatar.
- **Green-Black Ink** (`{colors.ink-900}`, 14.7:1): headings, row titles, nav links, secondary button stroke, the ink rule.
- **Ink Emphasis** (`{colors.ink-700}`, 10.7:1): footer links and emphasised body.
- **Ink Body** (`{colors.ink-600}`, 7.5:1): body copy, intros, summaries.
- **Ink Meta** (`{colors.ink-400}`, 5.0:1): metadata, captions, labels, placeholders, wayfinding; the AA floor for small text.
- **Ink Rest** (`{colors.ink-300}`, 2.6:1): the "/" between language codes and icons at rest only. Never text.
- **Hairline** (`{colors.line}`): the default rule above every row, ledger, figure caption and footer meta line. **Hairline Subtle** (`{colors.line-subtle}`) for the lightest separation; **Hairline Strong** (`{colors.line-strong}`) for the header rule, input strokes, the submenu and dialog border; **Ink Rule** (`{colors.line-ink}`) for the page-opening rule under the title, the closing band, and the footer's top edge.
- **Signal Red / Green** (`{colors.danger-700}` / `{colors.success-700}` with `{colors.danger-50}` / `{colors.success-50}` washes): form validation and status only; they exist purely to mean something.

### Named Rules
**The One Action Colour Rule.** Every link, button, arrow and focus ring is indigo. Nothing else is interactive-coloured, so a visitor never has to guess what is clickable.

**The Terracotta Is Never Alone Rule.** Terracotta marks editorial emphasis (index numbers, category tags, closing dates, quote rules) and always sits beside a label, number or position carrying the same meaning. It is never a status colour, never a button, never a fill.

**The Hairline Structure Rule.** Structure comes from 1px rules, never from fills, boxes or shadows. Three weights: hairline for rows, strong for strokes and chrome edges, ink for the page opening and close.

## Typography

**Display Font:** Hanken Grotesk 300–800 variable (self-hosted; ui-sans-serif, system-ui fallback)
**Body Font:** Hanken Grotesk (English); Kantumruy Pro 400–700 variable (Khmer, leads its own stack: Kantumruy Pro, Hanken Grotesk, Noto Sans Khmer, Khmer UI, Leelawadee UI)
**Label/Mono Font:** IBM Plex Mono 400 (Latin only; evidence metadata)

**Character:** A single grotesk does the talking at every size, tightened slightly as it grows. The mono is a clerk's hand for the evidence: years, dates, permits, sizes, indexes. Khmer is not a fallback; it sets its own leading (1.9 body, 1.5 headings), takes no tracking, no uppercase and no hyphenation, and gets a 1.0625em body bump so both scripts read at the same weight on a 17px base.

### Hierarchy
- **Display** (600, `clamp(2.25rem, 1.35rem + 3.2vw, 3.5rem)`, 1.05, −0.025em): the homepage tagline and persuasion-page titles; the only display-size text on a page, capped at 18ch.
- **H1** (600, `clamp(1.875rem, 1.3rem + 2vw, 2.75rem)`, 1.1, −0.02em): every other page title, left column of the page opening, closed by the ink rule.
- **H2** (600, `clamp(1.375rem, 1.15rem + 0.9vw, 1.875rem)`, 1.18, −0.015em): ledger section headings in the label column; impact figure values (line-height 1, tabular); the Director's pull quote in English (400 italic, 1.3).
- **H3** (600, 1.25rem, 1.3, −0.01em): row titles in every index (programmes, activities, documents, FAQ).
- **Figure** (600, `clamp(2.25rem, 1.75rem + 2vw, 3.25rem)`, 1, −0.03em, tabular): large impact figures on the Impact page.
- **Lead** (400, `clamp(1.125rem, 1.05rem + 0.3vw, 1.25rem)`, 1.55): page intros in the right column of the opening (46–52ch), prose blockquotes.
- **Quote** (400 italic, 1.375rem, 1.4, −0.005em): English story quotes; Khmer quotes are upright Kantumruy at 1.25rem / 1.8 / 500.
- **Body** (400, 1.0625rem, 1.6): body copy, capped at 42rem (Latin) / 40rem (Khmer).
- **Small** (400/500, 0.9375rem, 1.5): row summaries, nav links, buttons, footer links, figure labels.
- **Meta** (400, 0.8125rem, 1.5): captions, impact context, footer legal line; the smallest size permitted anywhere.
- **Label** (500, 0.75rem, 1.4, +0.08em, uppercase, ink-400): wayfinding only: breadcrumbs, "On this page", footer column headings, mobile-nav group headings, index column headings. Khmer labels drop to sentence case at 0.875rem / 1.7 with no tracking.
- **Mono** (400, 0.8125rem, 1.4, +0.04em, uppercase, tabular, ink-400): evidence metadata; `mono-lg` at 0.9375rem for years and index numbers. Khmer metadata is re-set in Kantumruy at 0.875rem / 1.7, sentence case, because Plex Mono has no Khmer glyphs.

### Named Rules
**The Mono Is Evidence Rule.** IBM Plex Mono appears only on data a grant officer checks: years, dates, the permit line, document type/language/format/size, index numbers, category tags, placeholder frame labels. Never on headings, body, buttons or nav.

**The Khmer Leads Rule.** Khmer text is set by `:lang(km)`, follows the language wherever it appears (including a Khmer name in an English sentence), never falls back to a system face, never takes tracking, uppercase or hyphens, and takes 700 for headings.

**The Italic Is English Only Rule.** Italic Hanken is used for English pull quotes and story quotes only. Khmer has no italic tradition and stays upright at a larger size with looser leading.

## Layout

The page is a single column of `.wrap` containers: max width 80rem (1280px), fluid gutters `clamp(1.25rem, 0.75rem + 2vw, 2.5rem)`. Long-form prose caps at 42rem (Latin) or 40rem (Khmer); narrow pages (contact, 404) at 56rem.

The recurring unit is the **ledger**: a 12-column grid at ≥64rem with a 3/12 label column (H2 heading, a 38ch note, sometimes an index of subsections) and a 9/12 content column, ruled above with a hairline and padded `clamp(3rem, 2rem + 4vw, 5.5rem)` block; `ledger-tight` drops that to 2rem. Below 64rem the label stacks above the content with a 1rem gap. The **page opening** is asymmetric on the same grid: title 7/12 at H1 or display, intro 5/12 at lead, one ink rule beneath. The **homepage first viewport** is 7/12 copy (mono registration line, display tagline, lead, primary button + text link) beside 5/12 (field photograph frame, two ruled evidence rows), then a 5-cell ruled programme strip (2 columns on phones). The **close band** is 7/12 H2 + note beside 5/12 actions, opened by an ink rule.

Rows inside a ledger are ruled above with a hairline and padded 1.25rem block; the list closes with one hairline below. Row grids put the mono column first (7.5–9.5rem for dates and labels, 4.5rem for years, 2.5–3.5rem for index numbers), the content in the middle, the arrow last. Impact figures use an 8.5rem figure column, a 22rem label column and a fluid context column.

Section rhythm is `clamp(3rem, 2rem + 4vw, 5.5rem)` between ledgers; the footer sits one section below the last content and is separated by an ink rule. Breakpoints: 40rem (sm), 48rem (md), 64rem (lg: desktop nav, ledger columns), 80rem (xl). Touch targets are ≥44px (2.75rem) on every link, button, nav item and language toggle.

## Elevation & Depth

The system is flat. Surfaces are a single paper tone; depth is conveyed by the three hairline weights and by one lighter step (`surface`) on hover for ruled rows, strip cells and inputs. A shadow exists only where something truly floats over the page: the desktop submenu and the org-chart dialog. The mobile navigation panel is full-screen and carries no shadow.

### Shadow Vocabulary
- **Overlay** (`box-shadow: 0 24px 48px -12px rgb(26 33 29 / 0.35)`): desktop submenu and the org-chart dialog only. The dialog backdrop is ink at 70% (`rgb(26 33 29 / 0.7)`).
- **Placeholder inset** (`box-shadow: inset 0 0 0 1px #d6d0c2`): the hairline frame around a media placeholder; a border, not elevation.

### Named Rules
**The One Shadow Rule.** One shadow token, used only on the submenu and the dialog. Nothing at rest, nothing on hover, nothing on cards, because there are no cards.

## Shapes

Mostly square. Radius is 1px (xs), 2px (sm/md) or 3px (lg); buttons, fields, the submenu and the dialog take 2px, everything else is a hard corner. No pills, no circles except the 40px avatar square and the silhouette icon. Borders are 1px, always one of the four rule colours; the secondary button and mobile menu buttons are 1px ink outlines on transparent. Photographs are square-cornered frames with a fixed aspect ratio (4/3 field, 4/5 portrait, 1/1 avatar) and a hairline-ruled caption beneath. Icons are one family: 1.5px stroke, round caps and joins, on a 20-unit grid at 12–18px, drawn in currentColor.

## Components

### Buttons
- **Shape:** near-square (2px radius), 1px border, inline-flex with a 0.625rem gap to a trailing arrow icon; min-height 2.75rem, padding 0.75rem 1.25rem; `btn-sm` 2.5rem / 0.5rem 0.875rem for the header Support action.
- **Primary:** indigo fill and border, white text, 0.9375rem / 500. Hover: indigo-800. Focus: paper outline at 2px offset. Active: translateY(1px).
- **Secondary:** transparent, ink-900 text and border. Hover inverts to ink fill and paper text.
- **Disabled:** sunken paper fill, ink-400 text, hairline border, not-allowed cursor.
- **Text link (`link`):** indigo, 500, 1px underline offset 0.2em in indigo-200; hover darkens the underline to currentColor and nudges the icon 2px right. Also the base `a` style with an 0.18em offset.

### Ruled Row (`row-link`)
The signature list item and the replacement for cards. A whole-row link with a hairline above, 1.25rem block padding, a baseline-aligned grid of mono column → H3 title (+ 15px summary, + mono metadata) → indigo arrow. Hover lifts the row to `surface` and slides the arrow 2px. Lists open with a row rule and close with one hairline. Variants: activity (date + terracotta category), programme (terracotta index number), document (ink year, type · format · language · size line, "Download" or open-in-new arrow), partner (logo cell 3.5rem, name, mono category), evidence (mono label + 17px title).

### Programme Strip
A ruled grid of cells (2 columns on phones, 5 at ≥64rem) bounded by hairlines on all sides: terracotta mono index at the top, 15px/500 title at the bottom, min-height 7.5rem, padding 1–1.25rem. Hover fills `surface`. The last cell links to Impact with an indigo arrow.

### Impact Figures
A `dl` of ruled rows: H2-size tabular figure (suffix at 0.6em), 15px/500 label, 13px ink-400 context in a third column at ≥64rem. Never animated; the method note follows in 15px with a bold lead-in.

### Inputs / Fields
- **Style:** `surface` fill, 1px `line-strong` stroke, 2px radius, 1rem text in ink-900, min-height 2.875rem, padding 0.6875rem 0.875rem; placeholder in ink-400.
- **Hover:** stroke to ink-400. **Focus:** stroke to indigo-700 plus a 3px indigo-200 halo (outline off).
- **Error:** stroke danger-700, danger-50 fill, 3px `rgb(168 50 31 / 0.2)` halo; error text 14px/500 danger-700.

### Navigation
- **Header:** paper, `line-strong` bottom rule, min-height 4rem (4.25rem at ≥64rem). Wordmark left: "SKO" at 1.375rem/700/−0.03em beside the org name at 15px/500 (name hidden below md) until `settings.logo` exists (then a 2.25–2.5rem-high image). Four group links (Our work, Evidence, About, News) at 15px/500 ink-900 with a 1px ink underline that scales in from the left over 220ms on hover, focus-within and current. Right: EN / ខ្មែរ toggle (current 600 + ink underline at 0.3em; other ink-400) and one indigo `btn-sm` Support action.
- **Submenu:** absolute, 14rem min, paper with `line-strong` border, 2px radius, overlay shadow; opens on hover and focus-within (CSS-only, Escape handled by script) at 140ms with a 4px rise. Items 15px, padding 0.625rem 1rem; hover/current take the indigo-50 wash and indigo-800 text.
- **Mobile:** an outlined "Menu" button (1px ink border, 15px/500) opens a full-screen paper panel (200ms enter, 140ms exit, 6px rise) with a ruled header, groups labelled in `label` with 19px/500 items and indigo arrows, and the full-width language toggle ruled above and below.
- **Breadcrumbs:** `label` style, "/" separators, current crumb in ink-900.
- **Skip link:** indigo fill, white, top-left when focused.

### Story Quote / Director Message
A `figure` with a 1px terracotta left rule and 1.25rem left padding: English quote italic 1.375rem/1.4 (Khmer upright 1.25rem/1.8/500), max 40ch, ink-900; attribution 15px with name in 500. The Director's message is 4/12 portrait (4/5, ruled caption with name and title) beside 8/12 pull quote at H2 italic with a terracotta bottom rule and 1.5rem gap to the message.

### Disclosure and Dialog
`details` with a hairline above and below, 15px/500 summary, indigo plus icon rotating 45° on open, content height transitioning over 220ms. The org-chart `dialog` is paper with a `line-strong` border, overlay shadow, ruled 14px header with an outlined Close button, pinch-zoomable content; it fades and rises 6px over 220ms behind a 70% ink backdrop.

### Media Placeholder
A sunken-paper frame with an inset hairline, holding a mono label in brackets: "[Field photograph]" (default), "[Portrait]", "[QR code]", "[Organizational chart]". It reserves the real aspect ratio so an unfinished page reads as intentional.

### Empty State and Pagination
Empty state: a ruled band (hairline above and below), 2.5rem block padding, 15px ink-400 centred text. Pagination: hairline above, 2.5rem top margin, links as `link`.

## Do's and Don'ts

### Do:
- **Do** build every list as ruled rows (`row-link`): hairline above, 1.25rem padding, mono column → H3 title → indigo arrow, `surface` on hover.
- **Do** open every page with the asymmetric heading (7/12 title, 5/12 lead) closed by the ink rule, and close it with the ink-ruled close band carrying one primary button and one text link.
- **Do** use the ledger grid (3/12 label, 9/12 content at ≥64rem) for every section, with `clamp(3rem, 2rem + 4vw, 5.5rem)` block rhythm.
- **Do** set evidence metadata in Plex Mono (0.8125rem, +0.04em, uppercase, tabular) and index numbers in `mono-lg` terracotta.
- **Do** set Khmer by `lang="km"` so Kantumruy Pro, 1.9 leading, 1.5 heading leading, no tracking and the 1.0625em bump follow it; stamp `lang="en"` on English fallbacks.
- **Do** keep touch targets at 2.75rem, focus rings 2px solid indigo at 3px offset (paper on inverse), and colour contrast at or above the 5.0:1 ink-400 floor for text.
- **Do** show placeholders as sunken-paper frames with a bracketed mono label at the real aspect ratio.
- **Do** keep motion to continuity: 240ms page-content enter (6px), 110ms exit, 200/140ms mobile panel, 220ms dialog and details, 140ms hover state, all `cubic-bezier(0.22, 0.61, 0.36, 1)` and all off under `prefers-reduced-motion`.

### Don't:
- **Don't** use cards, bordered tiles, pills, chips, gradients, washes or a second page tone; structure is hairlines on one paper.
- **Don't** add shadows anywhere except the submenu and the org-chart dialog.
- **Don't** use terracotta for buttons, links, status, fills or as the only signal of a state.
- **Don't** add scroll-reveal, parallax, carousels, slideshows or count-up figures; a figure that animates reads as marketing.
- **Don't** set text below 0.8125rem, use ink-300 for text, or track, uppercase or hyphenate Khmer.
- **Don't** italicise Khmer or use Plex Mono for Khmer; Khmer metadata re-sets in Kantumruy at 0.875rem.
- **Don't** use the `label` style as an eyebrow or kicker above a heading; it is wayfinding (breadcrumbs, column and group headings, "On this page") only.
- **Don't** request fonts from a third party or collapse the variable weight ranges to a single weight.
- **Don't** radius anything beyond 3px or centre a page opening.
