# Phase 1.2 — Sanity content model (finalized)

## Localization strategy (needs your approval)

**Recommended: field-level localization.** One document holds both languages; every user-facing field is an object `{ en, km }`.

```ts
// schemas/locale/localeString.ts  (also localeText, localeBlock, localePortableText)
defineType({
  name: 'localeString',
  type: 'object',
  fields: [
    { name: 'en', type: 'string', title: 'English' },
    { name: 'km', type: 'string', title: 'ខ្មែរ (Khmer)' },
  ],
})
```

**Why this over document-level translation** (`@sanity/document-internationalization`):
- One document = one publish action. Staff can't accidentally publish English and leave Khmer stale or missing.
- Both languages sit side by side in the editor — the person writing Khmer sees the English they're translating.
- No orphaned translation documents, no reference-syncing between language variants.

**Trade-off accepted:** you can't publish English-only and translate later as a separate workflow step, and the Studio form is taller. For a two-language site with one small editorial team, that's the right side of the trade.

**Missing-translation fallback:** rendering falls back to English with a `lang="en"` attribute on that element so screen readers switch voice correctly. A Studio validation rule warns (not blocks) when `km` is empty on required fields.

**No machine translation.** The language toggle swaps to the Khmer field a staff member typed — it does not translate anything at request time or build time. Confirmed approach: staff write both languages directly in the same document, one Publish button. (An optional "draft the Khmer for me" Studio action with a human review step before publish is possible later; not in scope.)

## Schemas

### `siteSettings` (singleton)
| Field | Type | Notes |
|---|---|---|
| `orgName` | `localeString` | |
| `orgShortName` | `string` | "SKO" |
| `tagline` | `localeString` | |
| `logo` / `logoMono` | `image` | |
| `ogImage` | `image` | Default social share card |
| `registration` | `localeString` | "[PLACEHOLDER] Registered with the Ministry of Interior, 2007 — Reg. No. …" |
| `address` | `localeText` | |
| `mapUrl` | `url` | Google Maps link (not an embed) |
| `geo` | `object{lat,lng}` | For static map + schema.org |
| `phone`, `email` | `string` | |
| `partnerEmail` | `string` | Where grant inquiries route |
| `socials` | `array[{platform, url}]` | |
| `donation` | `object` | ↓ |
| `donation.qrCodes` | `array[{label: localeString, image, instructions: localeText}]` | ABA / Wing / KHQR etc. |
| `donation.bankAccounts` | `array[{bankName, accountName, accountNumber, swift, branchAddress, currency}]` | Displayed as a table |
| `donation.allocation` | `array[{label: localeString, percent: number, note: localeText}]` | "Where your money goes" |
| `donation.note` | `localeBlock` | Tax/receipt info |
| `footerNote` | `localeBlock` | |

### `page` — generic bilingual page
`title` (localeString) · `slug` (slug, Latin) · `heroImage` (image) · `intro` (localeText) · `body` (localeBlock) · `seo` (object) · `sections` (optional array of reusable blocks: `ctaBlock`, `statsBlock`, `imageWithCaption`, `accordion`, `downloadList`)

Used for: About, Volunteer, Partner-with-us, Safeguarding, Privacy. Slugs are fixed and the documents are non-deletable via Studio structure (desk structure pins them as singletons).

### `program`
`title` (localeString) · `slug` · `summary` (localeText) · `body` (localeBlock) · `icon` (string, from a fixed list) · `image` (image + `alt: localeString`) · `order` (number) · `impactStats` (array of refs → `impactStat`) · `relatedStories` (array of refs → `story`) · `seo`

### `activity` — the staff-editable feed
`title` (localeString) · `slug` · `publishedAt` (datetime) · `coverImage` (image + `alt: localeString` + `caption: localeString`) · `excerpt` (localeText) · `body` (localeBlock, with inline image + gallery blocks) · `category` (string: news / event / story / announcement) · `program` (ref → `program`, optional) · `author` (string — staff name or "SKO Communications") · `featured` (boolean, max 3 enforced by validation) · `seo`

### `story` / `testimonial`
`quote` (localeText, required) · `personName` (string — **pseudonym or initials for beneficiaries**) · `personRole` (localeString) · `photo` (image, optional) · `useSilhouette` (boolean — renders an illustrated avatar when no photo can be shown) · `program` (ref) · `consentConfirmed` (boolean, **required true** to publish) · `body` (localeBlock, optional longer story)

> `consentConfirmed` is a hard validation gate. Nothing about a beneficiary publishes without a staff member ticking it. See the safeguarding note below.

### `partner`
`name` (string) · `logo` (image, SVG or transparent PNG) · `url` (url) · `category` (string: un-agency / ingo / government / foundation / corporate) · `order` (number)

### `report`
`title` (localeString) · `year` (number) · `type` (string: annual-report / financial / policy / other) · `file` (file, PDF, required) · `fileKm` (file, optional Khmer version) · `summary` (localeText) · `coverImage` (image, optional)

Rendered with file size and language badge so nobody downloads a 12 MB PDF on mobile data unaware.

### `teamMember`
`name` (localeString — Khmer and Latin spelling of the same name) · `role` (localeString) · `photo` (image) · `bio` (localeText, optional) · `order` (number) · `group` (string: leadership / board / staff)

### `directorMessage` (singleton)
`name` (localeString) · `title` (localeString) · `photo` (image + `alt`) · `message` (localeBlock) · `signature` (image, optional) · `pullQuote` (localeString — the line set in the display serif)

### `jobPost`
`title` (localeString) · `slug` · `employmentType` (string: full-time / part-time / consultant / internship) · `location` (localeString) · `description` (localeBlock) · `deadline` (date) · `howToApply` (localeBlock — email address, no upload form) · `publishedAt` (datetime)

Auto-hidden from the listing after `deadline` passes (build-time filter + a note that the site rebuilds nightly — see the cron question in Tech Decisions).

### `impactStat`
`label` (localeString) · `value` (number) · `displayValue` (string, optional — "10,000+", "៩៥%") · `suffix` (localeString, optional) · `icon` (string from fixed list) · `context` (localeText — "since 2007", the footnote that makes a number credible) · `order`

### `navigation` (singleton, optional)
Header/footer link groups, so staff can reorder nav without a code change. **Recommend including it** — otherwise every menu tweak is a developer ticket.

## Safeguarding constraints baked into the model

- No schema anywhere stores a beneficiary's real name, age, address, school, or case detail. `story.personName` is documented in the Studio field description as *pseudonym or initials only*.
- `story` cannot publish without `consentConfirmed`.
- Child images: field description requires that photos are consented and non-identifying; `useSilhouette` gives staff a compliant option when they have a story but no publishable photo.
- No beneficiary-facing forms, no case-management data, no uploads from the public.

## Studio structure

Custom desk structure so staff see plain language, not a schema dump:

```
📌 Site Settings          (singleton)
✍️  Activities & News      (the daily driver — first in the list)
🏥 Programs
📊 Impact Statistics
💬 Stories & Testimonials
📄 Reports & Policies
🤝 Partners
👤 Director's Message      (singleton)
👥 Team
💼 Jobs
📃 Pages                   (About, Volunteer, Safeguarding, Privacy — fixed set)
🧭 Navigation              (singleton)
```

Previews configured per document type (title + date + thumbnail) so the list views are readable in Khmer.
