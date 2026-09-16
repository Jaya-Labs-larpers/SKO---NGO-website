# Self-hosted fonts

These files are committed and served from this origin. **Nothing is requested from Google at
runtime** — no third-party font request, no privacy question for European institutional donors, and
a simpler CSP (`font-src 'self'`).

| File | Family | Covers | Size |
|---|---|---|---|
| `hanken-grotesk-latin.woff2` | Hanken Grotesk | Latin, weights 300–800 (variable) | 34 KB |
| `hanken-grotesk-latin-ext.woff2` | Hanken Grotesk | Latin Extended, weights 300–800 (variable) | 19 KB |
| `hanken-grotesk-italic-latin.woff2` | Hanken Grotesk Italic | Latin, weights 300–800 (variable) — pull quotes only | 35 KB |
| `kantumruy-pro-khmer.woff2` | Kantumruy Pro | Khmer block, weights 400–700 (variable) | 56 KB |
| `ibm-plex-mono-latin.woff2` | IBM Plex Mono | Latin, weight 400 — evidence metadata only | 10 KB |

All are SIL Open Font Licence.

## Two things that matter about these files

**Hanken Grotesk and Kantumruy Pro are variable fonts.** One file per subset covers the whole weight
range, which is smaller than several static weights. The `@font-face` rules in
`src/styles/theme.css` therefore declare a weight range. If someone "simplifies" that to a single
weight, the browser stops using the weight axis and synthesises a faux bold instead — which looks
noticeably wrong on Khmer.

**`unicode-range` does the work.** A subset file is only downloaded if the page actually renders a
character in its block. So `hanken-grotesk-latin-ext.woff2` costs nothing until a partner name like
*Planète Enfants & Développement* appears, and an English page does not pay for the Khmer file
beyond the one word in the language toggle — which loads lazily under `font-display: swap`.

Plex Mono carries no Khmer glyphs, so `.mono` metadata on Khmer pages is set in Kantumruy Pro by a
rule in `src/styles/global.css`; Khmer never falls back to a system face.

`BaseLayout.astro` preloads only the font the current locale sets body copy in.

## Regenerating

Request `https://fonts.googleapis.com/css2?family=…&display=swap` with a modern browser User-Agent
(an old one gets you TTF instead of WOFF2), group the returned `@font-face` blocks by subset and
source URL, download the `latin` / `latin-ext` / `khmer` files, and declare the min/max weight range
per group.
