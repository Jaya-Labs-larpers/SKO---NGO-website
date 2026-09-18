# SKO website — handoff v3: website icon set (Heroicons outline, 1.5 px)

**Site:** `https://www.sko-samatapheapkhnom.org/` · Astro static · EN + `/km/` mirror
**Prepared:** 18 September 2026 · replaces the **icon** parts of handoff v1 (17 Sept). Logo kit, colour-token remap and `Logo.astro` from v1 stay exactly as they are.
**Scope:** one thing — the UI icons placed beside elements across the site. No change to the NGO logo, the brand colours, the favicon/app icon (still parked — the website icons ship first, the app icon follows once direction A/B/C is chosen), or any page content.

> **How to use this folder.** Copy `sko-icons-v3-handoff/` into the repo root and tell Claude Code:
> *"Read `sko-icons-v3-handoff/HANDOFF.md`. Do Phase 0 and Phase 1, run the acceptance checks in §7, then stop and show me the diff. Don't touch the logo, the colour tokens or the favicon."*
> Every asset is in this folder. Nothing needs downloading or drawing.

---

## 0. What is in this folder

| Path | What | Goes to |
|---|---|---|
| `assets/icons/sprite.svg` | **The one icon sprite** — 59 symbols, 24 px grid, `currentColor`, no colour or stroke width inside | `public/icons/sprite.svg` (replace v1's) |
| `assets/icons/*.svg` | The same 59 icons as single files (design tools, email, inlining) | `public/icons/` (optional) |
| `assets/icons/manifest.json` | Every icon: name, group, source (heroicons / sko), and the **v1 Lucide name it replaces** | reference — use it to remap |
| `assets/icons/LICENSE-heroicons.txt` | MIT licence for the base library. Keep the file; no attribution needed in the UI | `public/icons/` |
| `components/Icon.astro` | Sprite `<use>` component, 1.5 px stroke, a11y defaults, `inline` mode, build-time check that the name exists, and the `.pending-ring` CSS | `src/components/Icon.astro` (replace v1's) |
| `icon-preview.html` | Review page: every glyph at 24 px, the four custom glyphs beside neighbours at 48/24/16, in-context samples on white and Deep Navy | reference only |
| `qa/all-icons-16px.png` · `qa/all-icons-24px.png` | Contact sheets at true pixel size (×3) | reference only |

Base library: **Heroicons v2.2.0, outline set** (MIT, Tailwind Labs). Four custom glyphs drawn to the same 24 px / 1.5 px / round-cap spec: `sko-facebook`, `sko-fdp-cycle`, `sko-child-protection`, `sko-handshake`. Do not add icons from any other library, emoji, Font Awesome or Material.

---

## 1. What changed since v1, and why

| | v1 (17 Sept) | v3 (this folder) |
|---|---|---|
| Library | Lucide 1.47 | **Heroicons 2.2 outline** |
| Stroke | 2 px | **1.5 px** |
| Glyphs | 71 (incl. 8 donate-only) | **59** |
| Loader | `loader` icon, animated | **CSS ring** — see §3.3; no icon |
| Names | Lucide names | **Heroicons names** — remap table below |

The client chose the thinner, rounder Apple-style outline. Heroicons is the closest open library to that look. Its names differ from Lucide's, so **every `<Icon name="…">` written from v1 must be remapped**. `manifest.json` carries the full mapping; the ones that actually change:

| v1 (Lucide) | v3 (Heroicons) | | v1 | v3 |
|---|---|---|---|---|
| `mail` | `envelope` | | `search` | `magnifying-glass` |
| `house` | `home` | | `menu` | `bars-3` |
| `globe` | `globe-alt` | | `x` | `x-mark` |
| `layers` | `square-3-stack-3d` | | `external-link` | `arrow-top-right-on-square` |
| `chart-column` | `chart-bar` | | `circle-check` | `check-circle` |
| `quote` | `chat-bubble-bottom-center-text` | | `circle-alert` | `exclamation-circle` |
| `info` | `information-circle` | | `triangle-alert` | `exclamation-triangle` |
| `book-heart` | `book-open` | | `languages` | `language` |
| `route` | `map` | | `send` | `paper-airplane` |
| `graduation-cap` | `academic-cap` | | `message-square` | `chat-bubble-left` |
| `heart-handshake` | `heart` | | `landmark` | `building-library` |
| `sprout` | `sparkles` | | `building-2` | `building-office-2` |
| `badge-check` | `check-badge` | | `handshake` | `sko-handshake` |
| `shield-alert` | `shield-exclamation` | | `phone-call` | `phone-arrow-up-right` |
| `file-text` | `document-text` | | `cookie` | `finger-print` |
| `file-check` | `document-check` | | `database` | `circle-stack` |
| `download` | `arrow-down-tray` | | `smartphone` | `device-phone-mobile` |
| `lock` | `lock-closed` | | `copy` | `document-duplicate` |
| `user-check` | `user-plus` | | `share-2` | `share` |
| `loader` | *(none — CSS ring)* | | | |

Unchanged names (22): `map-pin` `phone` `clock` `calendar` `calendar-days` `users` `user` `chart-pie` `megaphone` `heart` `shield-check` `chevron-down` `chevron-right` `plus` `minus` `arrow-right` `check` `tag` `link` `sko-facebook` `sko-fdp-cycle` `sko-child-protection`.

Removed (donate page no longer exists — handoff v2 §2): `sko-khqr` `landmark`-for-bank `banknote` `coins` `receipt` `credit-card` `qr-code`. Also removed: `cookie`, `sprout`, `route`, `quote`, `book-heart`, `heart-handshake`, `user-check` (substituted per the table). Heroicons' `arrow-path` is not shipped as a separate glyph — its geometry lives inside `sko-fdp-cycle`.

---

## 2. Phase 0 — install (one commit)

1. Replace `public/icons/sprite.svg` with `assets/icons/sprite.svg`. Delete v1's single-file icons in `public/icons/` if they were copied; copy the new ones only if the team wants them.
2. Replace `src/components/Icon.astro` with `components/Icon.astro`. It reads `public/icons/sprite.svg` at build time and **fails the build** if a name is not in the sprite — that is how you catch un-remapped v1 names. The path inside is relative to `src/components/`; adjust the `new URL(...)` if the component lives elsewhere.
3. Keep `public/icons/LICENSE-heroicons.txt`; remove `LICENSE-lucide.txt` (no Lucide glyphs remain).
4. Global rule — emitted by the component's `<style is:global>`; add it to the stylesheet only if the component's styles are stripped:
   ```css
   .icon { display:inline-block; flex:none; fill:none; stroke:currentColor; stroke-width:1.5;
           stroke-linecap:round; stroke-linejoin:round; vertical-align:-0.15em; }
   ```
   **`stroke-width` is 1.5, not 2.** If v1's `.icon` rule is still in the stylesheet with `stroke-width: 2`, delete it — the sprite has no stroke width of its own, so the CSS decides.
5. Build. Any `Icon "…" is not in public/icons/sprite.svg` error means a v1 name survived — look it up in §1.
6. Colour tokens from v1 Phase 0 (`--color-blue-700: #0962B7` etc.) must already be in place; if not, do v1 Phase 0 first.

---

## 3. Phase 1 — P0: header, footer, contact

### 3.1 Header (`Header.astro`)

Everything here is `inline` (above the fold; avoids a sprite fetch before first paint). Logo stays the v1 `<Logo variant="emblem" …>` — untouched.

| Element | Markup |
|---|---|
| Language toggle `EN / ខ្មែរ` | `<Icon name="language" size={16} inline />` before the two links |
| "Our work" / "Get involved" dropdown labels | `<Icon name="chevron-down" size={16} inline />` after the label; rotate 180° when `aria-expanded="true"` |
| `#menu-toggle` | `<Icon name="bars-3" size={24} inline />`; swap to `x-mark` when open. Keep the button's `aria-label` |
| Primary CTA | `<a class="btn btn-primary" href="/contact/"><Icon name="envelope" size={16} inline /> Contact us</a>` — Khmer mirror `ទាក់ទងមកយើង`. Icon **and** text, never icon-only |

### 3.2 Footer (`Footer.astro`)

Footer is Deep Navy `#0B1B30`. Set `color: var(--color-sky-400)` (Cyan `#26CBEE`, 8.95 : 1) on the icon wrappers; text stays white/70. **Never Deep Blue on navy** (2.84 : 1).

| Element | Markup |
|---|---|
| Logo | v1 `<Logo variant="reversed" width={220} />` — untouched |
| Address / Phone / Email | `map-pin` · `phone` · `envelope` (20) as a flex row with the text |
| Facebook | `<Icon name="sko-facebook" size={20} /> Facebook` |
| Telegram (if SKO confirms) | `paper-airplane` (20) |
| "Registered with the Ministry of Interior · Permit No. 457" | `check-badge` (16) prefix |

### 3.3 `/contact/` (supersedes v1 §3.3 and v2 §2.3)

All icons Deep Blue `#0962B7` on white (6.10 : 1).

| Element | Icon (size) | Note |
|---|---|---|
| Address / Phone / Email / Office hours rows | `map-pin` · `phone` · `envelope` · `clock` (20) | `tel:` and `mailto:` links on the text |
| Facebook / Telegram links | `sko-facebook` · `paper-airplane` (20) + `arrow-top-right-on-square` (14) after the label | `rel="me noopener"`, new tab |
| Google Map section heading | `map` (20); "Open in Google Maps" link → `arrow-top-right-on-square` (14) | address must also exist as text above the iframe |
| Form field affixes | `user` · `envelope` · `chat-bubble-left` (16) inside the field | `<label>` on every field |
| Submit button | `paper-airplane` (16) + "Send message" | |
| Success / error | `check-circle` · `exclamation-circle` (20) | |
| **Pending** | **no icon** — `<span class="pending-ring" aria-hidden="true"></span>` (16 px CSS ring shipped in `Icon.astro`; stops under `prefers-reduced-motion`) | replaces v1's `loader` glyph |
| Safeguarding notice | `shield-exclamation` (20), box on Wing Tint `#C6DBF7`, stroke `#0A55A0` | |
| "Preview only" disclaimer | `exclamation-triangle` (16) | |
| Privacy line under the form | `lock-closed` (16) → `/privacy/` | |

---

## 4. Phase 2 — P1: homepage, programs, impact, about, activities, safeguarding, partners

Light-scheme icons: stroke `var(--color-blue-700)` (Deep Blue) or Ink for utility glyphs. Hover darkens to `--color-blue-800` (`#05407A`), never brightens.

### Homepage `/`

| Section | Icon (size) |
|---|---|
| MoI registration line under hero | `check-badge` (16) |
| Stats 2007 / 5 khans / 26 sangkats / 200 households | `calendar` · `map-pin` · `square-3-stack-3d` · `home` (22–24) inside a 44 px Wing Tint circle |
| "What we do" ×4 cards | program icon (32–40) — table below |
| "Latest activities" cards | `calendar-days` (16) on the date; `arrow-right` (16) on "Read more" |
| "Trusted by" ×6 | leave for partner logo files (`<ul>` of `<li><img>`, greyscale filter) |
| Closing CTA band | gradient `linear-gradient(135deg,#0962B7,#26CBEE)`; button `envelope` (16) + "Contact us" |

### Program identity — one icon per program, reused wherever the program appears

| Program | Icon | Page |
|---|---|---|
| HALI — Housing & Living Conditions | `home` | `/programs/housing-and-living-conditions-hali/` |
| Children's Education & Health | `book-open` | `/programs/childrens-education-and-health/` |
| Children's Active Citizenship | `megaphone` | `/programs/childrens-active-citizenship/` |
| Resilient City & Migration (RCMD) | `map` | `/programs/resilient-city-and-migration/` |
| Family Development Programme (method shared by all four) | `sko-fdp-cycle` | all four + `/about/` "Our approach" |

On each program page: program icon at 48 in the hero; `sko-fdp-cycle` (24 — **not smaller**, the figure inside needs it) before the paragraph that names FDP; the three `<li>` items → `check` (16) bullets; "Support this program" → `envelope` (16) + "Get in touch", linking to `/contact/`. `/programs/` index: four cards, icon at 40.

### `/impact/`
`calendar` · `map-pin` · `square-3-stack-3d` · `users` (24 in a 44 px Wing Tint circle) on the stat cards · `information-circle` (16) on "How we count" · `chat-bubble-bottom-center-text` (24, Wing Tint) above the Mon Kim Hein quote · `document-text` + `arrow-right` (16) on "See our reports". Remove the stray inline SVG unless it is content.

### `/about/`
`heart` · `users` · `sparkles` (32) as the 3-icon values row · `sko-fdp-cycle` (32) beside "Our approach" · `map-pin` (20) on "Where we work" · `users` (24) on "Our team" (delete the empty `<li>`) · `chevron-down` (18) on each `<details>`. Remove the two stray inline SVGs.

### `/activities/` + posts
`calendar-days` (16) date · `user` (16) author · `tag` (16) category chip · `share` · `sko-facebook` · `link` (20) share row on posts. **Delete or unpublish `/activities/example-community-training/` and `/activities/example-family-story/`** — template stubs in the sitemap.

### `/safeguarding/`
`sko-child-protection` (48) hero · `shield-check` (24) "Safeguarding" heading · `phone-arrow-up-right` + `envelope` (20) in "Reporting a concern" · `lock-closed` (16) on the confidentiality line · "Report a concern" as a Wing Tint card with `shield-exclamation` (24).

### `/partners/`
Group headings (24): `building-library` Government · `globe-alt` International NGOs · `building-office-2` Foundations · `sko-handshake` UN agencies / implementing partners. `[LOGO]` items stay as placeholders for files from SKO.

---

## 5. Phase 3 — P2 / P3

| Page | Icons |
|---|---|
| `/reports/` | `document-text` (20) per report + `arrow-down-tray` (16) on each link; year badges |
| `/partner-with-us/` | 3-step flow `envelope` → `sko-handshake` → `document-check` (32) |
| `/volunteer/` | `document-text` → `shield-check` → `user-plus` (32) screening flow; `shield-check` (20) on the safeguarding notice |
| `/careers/` | `heart` · `academic-cap` · `clock` (24) benefit row; empty state `sparkles` (48) + "No openings right now" |
| `/faq/` | `chevron-down` (18) on every `<details>`, rotates 180° open; `magnifying-glass` (20) in a filter field; category icons `home` programs · `shield-check` safeguarding · `sko-handshake` partnership · `envelope` contact |
| `/privacy/` | `lock-closed` · `finger-print` · `circle-stack` · `user-plus` (20) section headers |
| Anywhere | `chevron-right` (16) breadcrumbs / list links · `plus` / `minus` (16) expanders · `device-phone-mobile` (16) beside a mobile number · `document-duplicate` (16) on any "copy" affordance |

Spot illustrations (FDP cycle diagram at large size, Phnom Penh khan map, org chart, footer butterfly divider) are **not** in this handoff — separate tier, need data from SKO.

---

## 6. Rules that apply to every change

- One library. Every icon comes from `sprite.svg`. No emoji, no other icon set, no hand-drawn inline SVGs other than the four `sko-` glyphs already in the sprite.
- **No hex inside an SVG.** Colour is CSS `color` on the parent; icons are `currentColor`. Logo files are the only SVGs with baked-in colour.
- **Stroke is 1.5 px, from CSS.** Never set `stroke-width` on a `<use>` or a symbol.
- Contrast: light backgrounds → Deep Blue `#0962B7` (6.10 : 1) or Ink. Deep Navy → Cyan `#26CBEE` (8.95 : 1) or Wing Tint `#C6DBF7`. **Never Cyan on white** (1.93 : 1). **Never Bright Blue `#3196F5` on tinted surfaces.**
- Sizes: 16 inline with text · 20 default UI · 24 headers · 32–48 cards, stats, heroes. `sko-fdp-cycle`, `sko-child-protection` and `sko-handshake` never below 20 — the figure inside is the point.
- Tap targets ≥ 44 × 44 — pad the button, not the icon.
- Icon beside visible text → `aria-hidden="true"` (component default). Icon-only control → pass `label=` (becomes `role="img"` + `aria-label`) and keep the button's own `aria-label`.
- Never an icon-only primary CTA, never icon-only navigation. Bilingual, low-literacy audience — glyph + text, every time.
- The butterfly emblem is a logo, not an icon: header, footer only. Never in a list, button or nav row. Never scale a UI icon up as an illustration.
- Only animated element: the CSS pending ring (§3.3), stopped under `prefers-reduced-motion`.

---

## 7. Acceptance checks (run before opening the PR)

```bash
# no v1 Lucide names survive in src (any hit must be remapped per §1)
grep -rhoE 'name="[a-z0-9-]+"' src/ | sort -u | sed 's/name="//;s/"//' \
 | grep -xE 'mail|house|globe|layers|chart-column|quote|info|book-heart|route|graduation-cap|heart-handshake|sprout|badge-check|shield-alert|file-text|file-check|download|lock|user-check|search|menu|x|external-link|circle-check|circle-alert|triangle-alert|loader|languages|send|message-square|landmark|building-2|handshake|phone-call|cookie|database|smartphone|copy|share-2|sko-khqr|banknote|coins|receipt|credit-card|qr-code' \
 && echo "FAIL: v1 icon names still in use"
# every icon name used in src exists in the sprite
grep -rhoE 'name="[a-z0-9-]+"' src/ | sort -u | sed 's/name="//;s/"//' | while read n; do grep -q "id=\"$n\"" public/icons/sprite.svg || echo "MISSING icon: $n"; done
# no hardcoded colour or stroke width inside the sprite
grep -E 'fill="#|stroke="#|stroke-width=' public/icons/sprite.svg && echo "FAIL: colour or stroke width baked into sprite"
# stroke width is 1.5 in CSS, and no leftover 2px rule
grep -rn "stroke-width" src/ dist/ 2>/dev/null | grep -v "1.5" && echo "FAIL: stroke-width other than 1.5 found"
# no Lucide licence or glyphs left
ls public/icons/LICENSE-lucide.txt 2>/dev/null && echo "FAIL: Lucide licence still present"
# sprite has 59 symbols
grep -o "<symbol " public/icons/sprite.svg | wc -l
```

Visual: open the built `/`, `/contact/`, `/programs/…/`, `/safeguarding/`, `/km/` at 375 px and 1280 px. Icons no lighter than the text beside them; footer icons cyan on navy; header emblem untouched; Lighthouse accessibility ≥ 95 with no contrast warnings on icons. Compare against `icon-preview.html`.

---

## 8. Companion docs that this handoff supersedes in part

- `claude/icon-guideline.md` §1–§2 (Lucide, 2 px) → read as Heroicons outline, 1.5 px. §11 (v2 app icon) is parked per the round-3 review.
- `claude/website-visual-audit.md` §5 lists v1 Lucide names → use the §1 remap table above.
- `claude/icon-review-round3.md` said website icons would follow the app-icon decision → order reversed; website icons ship now, app icon later.

## 9. Not for Claude Code — waiting on SKO / the client

- Whether Telegram sits beside Facebook (footer, `/contact/`)
- Partner logo files + permission to display
- Photos with consent clearance (hero, programs, activities, director portrait, team)
- Static map / Google Map embed details for `/contact/`
- The favicon / app icon (round-3 directions A / B / C) — still parked; v1's favicon files stay until that decision
