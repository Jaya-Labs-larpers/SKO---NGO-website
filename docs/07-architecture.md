# Phase 3 — Architecture & working skeleton

**Status: Phase 3 gate — awaiting approval.**

The site builds, both locales render, the CMS schemas are complete, and the contact Function is live
and verified. Page bodies exist for every route; filling them with the real content and the two
special treatments' final polish is Phase 4.

---

## 1. What was built

| Phase 3 requirement | Status |
|---|---|
| Scaffold Astro + TypeScript + Tailwind | Done. Astro 5 static output, Tailwind v4 via `@tailwindcss/vite`, TS strict + `noUncheckedIndexedAccess`. |
| Sanity Studio + all schemas | Done. 12 document types, 7 objects, 3 localisation primitives, custom desk structure. Typechecks clean. |
| Connect Astro to Sanity (typed GROQ) | Done. All queries in one file, typed projections, single content-layer seam. |
| i18n routing km/en + toggle | Done. 46 pages, 23 per locale. Toggle links to the equivalent page. |
| Image optimization pipeline | Done. Sanity CDN transforms, srcset, LQIP, intrinsic dimensions, graceful placeholder when no image exists. |
| Contact form → Pages Function | Done and tested. Honeypot → validation → rate limit → Turnstile → Resend. |
| Environment config + `.env.example` | Done. `.gitignore` excludes `.env*` from the first commit. No secret in the repo. |

## 2. Verification — actually run, not assumed

```
npm run build       46 pages built (23 per locale), 54 files in dist/
npm run typecheck   astro check + tsc --noEmit → 0 errors, 0 warnings, 0 hints
studio typecheck    tsc --noEmit → clean
```

Against the local Wrangler server (`npm run preview`), which serves the built site **and** the Function:

| Test | Result |
|---|---|
| `POST /api/contact` with a short message and malformed email | `400` `{"fieldErrors":{"name":"too_short","email":"email","message":"too_short"}}` |
| Honeypot field filled | `200 {"ok":true}` — and nothing sent. The bot is not told it failed. |
| Valid payload, no Turnstile token | `403 verification_failed` — enforced server-side, not just in the widget |
| `GET /api/contact` | `405 method_not_allowed` |
| Security headers on `/about/` | HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy all present; CSP in Report-Only (see §6) |
| Khmer page Latin-leakage scan | Clean — no English marketing string on any `/km/` page |
| `hreflang` on `/km/about/` | `en`, `km`, `x-default` all correct |
| `<html lang>` | `km` on Khmer routes, `en` on English routes |
| Sitemap | 44 URLs, both locales, 404s excluded |

## 3. Three defects found and fixed during the build

Worth recording because two of them would have shipped silently.

1. **The mobile navigation panel was visible on phones.** Tailwind v4's preflight hides `[hidden]`
   with a zero-specificity `:where()` rule, so the `flex` utility on the same element won the cascade
   and the "hidden" panel rendered over the page. Only invisible on desktop, where `lg:hidden` masks
   it. Fixed with an authoritative `[hidden] { display: none !important }`.
2. **The Function returned English error sentences to Khmer readers.** Zod's built-in messages are
   English-only. The Function now returns *codes* (`required`, `email`, `too_short`, `too_long`) and
   the page renders the message in the visitor's language.
3. **Page intros and CTA headings were hardcoded English inside shared templates**, so they appeared
   untranslated on Khmer pages. Moved into `src/lib/i18n/strings.ts` with Khmer written for each. In
   Phase 4 they move again, into Sanity `page` documents, so staff can edit them.

Also fixed on inspection: the language toggle announced "Switch to English" on the English page it
was already on, and empty image placeholders were announced to screen readers as
"[PLACEHOLDER PHOTO]" instead of being hidden.

## 4. Key architectural decisions as built

**The content layer is one seam.** `src/lib/content/index.ts` exposes typed getters. Pages never
touch the Sanity client and never write GROQ. Behind the seam, if `PUBLIC_SANITY_PROJECT_ID` is set
the getter runs a GROQ query; if it is blank it returns a local fixture.

That fallback is not a toy. It means the site builds, previews and can be reviewed *today*, before
SKO's Sanity project exists — and the moment the project id is set, the same components render real
content with no code change. A failed GROQ query throws and fails the build; a silently empty section
discovered in production is worse than a build that stops.

**Localised fields resolve through one function.** `pick(field, lang)` returns the value, the locale
it actually came from, and whether it fell back. Callers stamp `lang="en"` on the element when it
fell back, so a screen reader switches voice mid-page. This is what makes "staff write both
languages, English is the safety net" true in the markup rather than just in a doc.

**Portable Text is rendered by hand** (`src/lib/portable-text.ts`) rather than by a package, so the
markup matches the design system — external links get `rel="noopener noreferrer"` and an outbound
icon, images carry captions and required alt, headings start at `h2` because the page owns the `h1`.
Every text node is escaped, so the output is safe for `set:html` even though the source is trusted.

**The Function is the only runtime code.** `output: 'static'` with a plain `functions/` directory
(ADR-001). Cloudflare compiled it successfully with zod bundled. Order of checks is
cheapest-rejection-first, and nothing is persisted — the submission exists in the destination inbox
and nowhere else. The only thing stored is a counter keyed by a **hash** of the IP, so the rate-limit
store never holds an identifiable address.

## 5. Safeguarding, enforced in code

- No schema anywhere models a beneficiary's real name, age, address, school or case detail.
- `story.consentConfirmed` is a hard validation rule — a story cannot be published without it.
- `story.personName` carries field help text: *pseudonym or initials only*.
- Alt text is `required` on every image field in the Studio.
- No file uploads anywhere, including job applications. Careers pages say "email your CV".
- A prominent comment block at the top of `studio/schemas/documents.ts` states why: the dataset is
  public, and that is only safe because of these rules.

## 6. Deliberately not done yet, and why

**CSP is Report-Only.** Two things must be checked in a real browser before enforcing it: whether
`<script type="application/ld+json">` (structured data, on every page) trips `script-src` without
`'unsafe-inline'` — browser behaviour here is genuinely inconsistent and must be tested, not assumed
— and whether `style-src` can drop `'unsafe-inline'` once Astro's inlined critical CSS is accounted
for. Shipping an untested enforcing CSP would either break the site or quietly do nothing. Phase 5
flips it.

**Fonts are not yet self-hosted.** The `@font-face` block in `src/styles/theme.css` is commented out
so the skeleton makes no 404 requests; `public/fonts/README.md` lists exactly which files to add and
how to subset them. Until then the browser uses the system Khmer font, which is why the skeleton
looks close to but not identical to the design preview. This is a Phase 4 task with a verification
step (`document.fonts.check()` across every route).

**No real Sanity project.** Needs SKO's account. Everything is ready for the project id.

**Placeholder content throughout**, marked `[PLACEHOLDER]`. No SKO facts, statistics, staff names or
a director's name have been invented.

## 7. Still needed from you before Phase 6

Unchanged from Phase 1, and now genuinely blocking for deployment: **domain + registrar**, **git host
and who owns the account long-term**, **destination inboxes and DNS control for the sending domain**
(needed to verify Resend and set SPF/DKIM), and **who at SKO writes and reviews the Khmer copy**.

None of these block Phase 4.
