# SKO website

Bilingual (Khmer / English) website for **Samatapheap Khnom Organization**, Phnom Penh.

Astro + TypeScript + Tailwind v4 · Sanity (headless CMS) · Cloudflare Pages + Pages Functions +
Turnstile · Resend · Cloudflare Web Analytics.

Planning, design and architecture documents live in [`docs/`](docs/README.md).

---

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

The site builds and runs with **no Sanity project configured** — the content layer falls back to
local fixtures in `src/lib/content/fixtures.ts`. The build prints which source it used.

### The Studio (separate npm project)

```bash
cd studio && npm install && npm run dev
```

`studio/` is deliberately **not** an npm workspace. Cloudflare Pages runs `npm install` at the repo
root on every production build; a workspace would drag Sanity's React toolchain into a build of a
site that ships no React.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Astro dev server. Pages only — the form endpoint is not served. |
| `npm run build` | Static build to `dist/`. This is the Cloudflare build command. |
| `npm run preview` | Builds, then serves `dist/` **with the Pages Function** via Wrangler. The honest local preview. |
| `npm run verify` | Build, then structural checks over every built page. Run this in CI, **not** on the production deploy — a tripped check must never stand between a staff member and their post going live. |
| `npm run typecheck` | `astro check` + `tsc --noEmit`. |
| `npm run format` | Prettier across the repo. |
| `npm run studio` | Runs the Studio dev server from the root. |
| `npm run studio:deploy` | Publishes the Studio to `<hostname>.sanity.studio`. |

To exercise the contact form locally you need `npm run preview`, not `npm run dev` — the Function
only exists under Wrangler.

---

## Repository layout

```
functions/api/contact.ts   The only runtime code. Cloudflare picks this up from the repo
                           root independently of Astro, so the site stays fully static.
public/_headers            Security headers + cache policy.
src/lib/config.ts          The single seam for environment configuration.
src/lib/content/           The content layer. Pages import only from here — never the
                           Sanity client, never raw GROQ.
src/lib/i18n/              Locale config, UI strings, path helpers, field resolution.
src/lib/sanity/            Client, all GROQ queries, image URL builder.
src/page-templates/        Every page body. Route files are thin shells.
src/pages/                 Route shells: English at the root, Khmer under /km/.
studio/                    Sanity Studio — independent npm project.
```

---

## The rules that keep this maintainable

- **No component reads `import.meta.env`.** Everything goes through `src/lib/config.ts`, which fails
  loudly at build time rather than rendering an empty section in production.
- **All GROQ lives in `src/lib/sanity/queries.ts`.** No inline query strings in pages. This is what
  makes a schema change auditable in one file.
- **Every visible string goes through `t()` or comes from the CMS.** A hardcoded English string in a
  component is a review-blocking bug — it is the easiest way for a bilingual site to rot, and it is
  invisible until a Khmer reader hits it.
- **`PUBLIC_` is load-bearing.** Astro inlines any `PUBLIC_*` variable into the browser bundle.
  Server-only secrets live in `functions/` and are read from the Cloudflare env binding. They must
  never be imported into `src/`.
- **There is no Sanity token anywhere**, by design — see `docs/04-tech-decisions.md` ADR-004. Do not
  add one without revisiting that decision.
- **Nothing about a beneficiary or a child is modelled in the CMS.** The dataset is public. That is
  safe only because of this rule.

---

## Environment

See `.env.example` for the full list with comments. Nothing in this repo contains a real secret;
production values are set per-environment in the Cloudflare Pages dashboard.
