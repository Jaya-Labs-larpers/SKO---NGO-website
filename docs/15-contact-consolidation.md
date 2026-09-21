# Contact consolidation & duplicate audit

**Date:** 2026-09-18
**Change:** donation content removed; `/donate` retired in favour of `/contact`.

---

## 1. Duplicate audit — contact forms

### Form markup: no duplicates

There is exactly **one** `<form>` element in the entire source tree:

| File | Forms |
|---|---|
| `src/components/forms/ContactForm.astro` | 1 (the only `<form>` in `src/`) |

Every contact surface renders that one component. No copy-pasted form markup,
no second validation script, no second `fetch('/api/contact')` call site.

### Form instances: three, all legitimate

| Page | Template | Variant | Extra fields | Inbox |
|---|---|---|---|---|
| `/contact` | `ContactPage.astro` | `general` | — | `settings.email` |
| `/partner-with-us` | `PartnerWithUsPage.astro` | `partner` | organization, country | `settings.partnerEmail` |
| `/volunteer` | `PartnerWithUsPage.astro` | `volunteer` | — | `settings.email` |

These are **not** duplicates. Each has a distinct variant, a distinct field set,
and `/partner-with-us` routes to a different inbox in
`functions/api/contact.ts`. `/partner-with-us` and `/volunteer` already share a
single template, parameterised by `variant`.

### The duplicate that was avoided

`/contact` already existed with a full contact form **and** the office address,
phone, email, hours, map and safeguarding notice.

Rebuilding `/donate` as a second inquiry page would have produced:

- two URLs rendering `ContactForm variant="general"` — same fields, same inbox
- duplicate DOM ids: `ContactForm` derives `id = form-${variant}`, so two
  `general` forms collide on `form-general-name`, `form-general-email`, etc.
- near-duplicate content competing in search results

`/donate` was therefore retired and redirected to `/contact` instead.

### Other duplicate checks

| Suspected | Verdict |
|---|---|
| `api/contact.ts` vs `functions/api/contact.ts` | **Resolved by the Cloudflare cutover.** `api/contact.ts` was a thin Vercel adapter over the Cloudflare function; it was deleted with Vercel, leaving `functions/api/contact.ts` (fronted by `worker/index.ts`) as the single implementation. |
| `navContact` in both footer columns | **Avoided.** `navContact` already sits in the *Organisation* column, so the retired `navDonate` entry in *Get involved* was removed rather than replaced with a second contact link. |
| Contact details on `/contact` | Single source: `getSiteSettings()`. Not repeated elsewhere. |

---

## 2. Changes made

### Removed

- `src/page-templates/DonatePage.astro`
- `src/pages/donate.astro`
- `src/pages/km/donate.astro`

### Redirects — `public/_redirects`

Applied by Cloudflare Workers ahead of the static asset lookup (these began
life in `vercel.json` and moved with the Cloudflare cutover):

```
/donate, /donate/          ->  301  /contact/
/km/donate, /km/donate/    ->  301  /km/contact/
/careers, /careers/*       ->  301  /contact/
/km/careers, /km/careers/* ->  301  /km/contact/
```

`tests/hosting.test.mjs` pins every rule.

### CTAs repointed to `/contact`

| File | Was | Now |
|---|---|---|
| `src/components/layout/Header.astro` | `/donate`, heart icon, `navDonate` | `/contact`, mail icon, `contactUs` |
| `src/components/layout/Header.astro` (mobile) | `/donate`, `navDonate` | `/contact`, `contactUs` |
| `src/page-templates/HomePage.astro` | `/donate`, `donateNow` | `/contact`, `contactUs` |
| `src/components/content/CtaBand.astro` | `/donate`, `navDonate` | `/contact`, `contactUs` |

`CtaBand` is used by Home, About, Impact, Partners, Programs and ProgramDetail,
so that single edit covers six pages.

### Navigation — `src/lib/nav.ts`

- `mainNav` → *Get involved* now points at `/contact`; first child is
  `navContact` instead of `navDonate`.
- `footerNav` → *Get involved* lost its `navDonate` entry. No replacement
  added, because `navContact` is already in the *Organisation* column.
- `mobileNav` unchanged — it already listed `navContact`.

### Strings — `src/lib/i18n/strings.ts`

Removed from **both** `en` and `km` (each was used only by the deleted donate page):

`navDonate`, `donateNow`, `pageDonate`, `donateHeroTitle`, `donateHeroIntro`,
`scanToGive`, `bankTransfer`, `whereMoneyGoes`, `accountName`, `accountNumber`,
`bankName`, `swift`, `bankAddress`, `currency`, `copy`, `copied`, `noCardNotice`

Rewrote the CTA band copy in both locales so no donation language remains:

| Key | Was | Now |
|---|---|---|
| `ctaHomeTitle` | Your support keeps a child with their family. | Talk to us about keeping a child with their family. |
| `ctaHomeBody` | Give once or monthly by QR or bank transfer… | Tell us what you need and we will answer… |
| `ctaAboutTitle` | Support the families we work with. | Questions about how we work? |
| `ctaAboutBody` | Every donation is accounted for… | Our annual and audit reports are published in full… |
| `ctaProgramsTitle` | Fund a program. | Ask about a program. |
| `ctaProgramTitle` | Support this program. | Ask about this program. |
| `ctaImpactTitle` | Help us reach more families. | Ask how we reach more families. |

> The Khmer rewrites carry the same `[KHMER REVIEW REQUIRED]` caveat as the rest
> of the file — SKO staff should review them before launch.

### Readiness gate — `scripts/readiness.mjs`

`siteSettingsFailures()` previously blocked every production build unless
donation QR images and bank details were published. With no page rendering them,
that gate could only ever produce false failures, so both checks were removed.
The contact-inbox checks (`email`, `partnerEmail`) are unchanged.

`tests/readiness.test.mjs` updated to match: the donation test became
`production readiness requires approved contact inboxes`, and the
`[PLACEHOLDER QR CODE]` assertion now uses a `/contact/` page.

---

## 3. Deliberately left alone

The Sanity schema and fixtures still carry the donation fields — `donation`
(`qrCodes`, `bankAccounts`, `allocation`, `note`) and `donationFaqs` — in
`src/lib/content/types.ts`, `src/lib/content/fixtures.ts`,
`src/lib/sanity/queries.ts` and `studio/schemas/`.

They are now unread by any page. Keeping them means no Studio redeploy and a
trivial restore if SKO resumes fundraising. `scripts/content-review.mjs` still
prints a donate section; it is an internal review tool, not a published page.

Sprite icons that only the donate page used (`sko-khqr`, `landmark`,
`chart-pie`, `smartphone`, `copy`, `qr-code`, `banknote`, `credit-card`) remain
in `public/icons/sprite.svg` — a shared static asset, not dead source.

---

## 4. Verification

| Check | Result |
|---|---|
| `npm run build` | 44 pages, CSP written, **all structural checks passed** |
| `/donate` in `dist/` | absent — no route, no href, no sitemap entry |
| `/contact`, `/km/contact` | built |
| `npm test` — readiness suite | passes, including the rewritten inbox test |

**Pre-existing failures, untouched by this change:**

- `tests/form.test.mjs` — 3 failures (`submit?.querySelector is not a function`).
  Reads only `ContactForm.astro`; both files are byte-identical to HEAD.
- `npm run typecheck` — 3 errors in `src/components/Icon.astro` and
  `src/components/Logo.astro`. Neither was edited here.

Both blocked `npm run check` (which chains `test && typecheck && build`) and
were fixed on this branch: the form tests in the consolidation commit, the
`Logo`/`Icon` types in *Type the Logo variant map and escape its interpolated
props*.
