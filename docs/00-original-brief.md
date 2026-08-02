# Build Prompt — Samatapheap Khnom Organization (SKO) Website

> Paste this whole document into your coding agent (e.g. Claude Code). Work through it **phase by phase**, and **stop at each phase gate for my approval before continuing**. Do not skip ahead. Every technical choice below is deliberate — do not substitute a different framework, host, or CMS without asking first.

---

## 1. Role & objective

You are a senior full-stack engineer and product designer. Build a **production, cloud-hosted, bilingual website** for **Samatapheap Khnom Organization (SKO)** — a Cambodian NGO in Phnom Penh working in family care, child protection, and gender-based-violence prevention (registered with the Ministry of Interior in 2007).

The site's job is to build **credibility and attract support** from three audiences: local Cambodian donors, international donors, and grant-making institutions. Trust, transparency, and clarity matter more than flash.

---

## 2. Confirmed tech stack (non-negotiable)

| Layer | Choice | Reason |
|---|---|---|
| Framework | **Astro** (latest), TypeScript | Static output, near-zero JS, fast, tiny attack surface |
| Styling | **Tailwind CSS** | Fast, consistent, modern; easy responsive/design-token control |
| CMS | **Sanity** (headless) | Staff edit content without touching code; generous free tier; rebuild on publish |
| Hosting | **Cloudflare Pages** | Free tier, global CDN, automatic HTTPS, DDoS/WAF built in |
| Forms backend | **Cloudflare Pages Functions** + **Cloudflare Turnstile** | Serverless, spam-protected, no exposed server |
| Email delivery | Transactional API (e.g. **Resend** free tier) via the Function | Keeps keys server-side; never in client |
| Analytics | **Cloudflare Web Analytics** | Free, privacy-friendly, cookieless |
| CI/CD | Git → Cloudflare Pages auto-deploy; Sanity webhook → Pages Deploy Hook | Publish in CMS auto-rebuilds the site |

---

## 3. Global standards (apply to every page, every phase)

- **Bilingual: Khmer (km) + English (en).** Language toggle in header. Default locale English; full Khmer parity. Use Astro's built-in i18n routing.
- **Khmer typography done right:** load a proper Khmer webfont (e.g. Noto Sans Khmer or Kantumruy Pro) alongside a clean Latin sans; correct line-height for Khmer script. Never let Khmer text render in a fallback font.
- **Accessibility: WCAG 2.1 AA.** Semantic HTML, alt text, keyboard nav, focus states, colour contrast, `lang` attributes per locale.
- **Mobile-first & fully responsive.** Most local visitors are on phones.
- **Performance:** target Lighthouse 90+ on Performance, Accessibility, Best Practices, SEO. Optimize images (`astro:assets` + Sanity image CDN), lazy-load, minimal JS.
- **SEO:** per-page meta titles/descriptions, Open Graph + Twitter cards, sitemap.xml, robots.txt, structured data (Organization + NGO schema.org).
- **Security baked in from day one** (see Phase 5), not bolted on.
- **No payment/card handling on the site.** Donations are QR + bank-wire display only (see below). No card fields, no payment SDK, zero PCI scope.
- **Placeholder content** is fine where SKO's real copy/photos aren't available yet — but mark it clearly as `[PLACEHOLDER]` so it's easy to find and replace via the CMS.

---

## 4. Information architecture (the sitemap)

**Cluster 1 — Identity**
- Home (mission, impact snapshot, strong imagery, clear CTAs: Donate / Partner / Contact)
- About (mission & vision, history since 2007, values, **Message from the Director**, **Organizational structure**, team)
- Our Work / Programs (family care, child protection, gender-based-violence prevention — a section or sub-page each)

**Cluster 2 — Trust & Transparency** *(this cluster is what wins grants)*
- Impact & Results (reach numbers, beneficiary stories, testimonials)
- Annual Reports & Financials (downloadable PDFs, via CMS)
- Safeguarding / Child Protection Policy (its own page; downloadable PDF)
- Partners & Supporters (logo wall: UN Women, UNICEF, Friends International/3PC, Planète Enfants & Développement, etc.)

**Cluster 3 — Get Involved & Sustain**
- Donate (QR codes + international bank-wire details + "where your money goes")
- Partner / Grant Inquiry (contact form routed for funders/partners)
- Volunteer
- Careers / Jobs

**Cluster 4 — Activities** *(fully staff-editable via Sanity)*
- Activities / News / Stories (list + detail pages; the section SKO publishes to freely)

**Global elements:** header with language toggle + nav, footer with contact info + address + map + social links, optional newsletter signup, cookie/consent handling kept minimal (cookieless analytics means little needed).

### Two specific design treatments (already agreed)
- **Organizational structure:** SKO pastes in an image. Build a responsive image container with caption, alt text, and click-to-zoom (readable on mobile).
- **Message from the Director:** portrait paired with the message inside a designed outlined card — editorial serif voice for the quote, a teal accent rule (`#0F6E56`), decorative quotation mark, signature line with name + title. Stacks vertically on mobile. Fully CMS-editable (photo, name, message).

---

## 5. Content model (Sanity schemas to implement)

Create schemas with **bilingual fields** (km/en) where content is user-facing:
- `siteSettings` (org name, logo, contact info, address, socials, donation QR images, bank details)
- `page` (generic bilingual page: About, Volunteer, etc.)
- `program` (title, summary, body, image, order)
- `activity` / `newsPost` (title, slug, date, cover image, body, author) — the staff-editable feed
- `story` / `testimonial` (quote, person, photo, program link)
- `partner` (name, logo, url)
- `report` (title, year, PDF file, type: annual report / financial / policy)
- `teamMember` (name, role, photo) and `directorMessage` (photo, name, title, message)
- `jobPost` (title, type, description, deadline, how to apply)
- `impactStat` (label, number, icon)

Store PDFs and images as Sanity assets. No personal/beneficiary data of vulnerable people should ever be modelled or stored beyond what's publicly consented to.

---

## 6. Phased delivery — stop at each gate

### Phase 1 — Planning  *(skill: architecture-designer)*
Produce, for my approval:
1. Confirmed sitemap + URL structure (both locales).
2. Full Sanity content model (schemas above, finalized).
3. Component inventory + low-fi wireframe notes per page.
4. Tech-decisions doc: i18n routing approach, image pipeline, form flow, deploy pipeline, env vars needed.
5. Repo structure plan.
**Gate:** I review and approve before any code.

### Phase 2 — Design  *(skill: frontend-design / impeccable)*
Produce:
1. Design system: colour palette, typography (Latin + Khmer), spacing scale, radius/shadow tokens — as Tailwind config.
2. Key page layouts (Home, About incl. Director message + org chart, Program, Activities list + detail, Donate, Contact).
3. Component designs: header/nav + language toggle, footer, cards, buttons, forms, logo wall, report/download list, impact stats.
4. Responsive behaviour + accessibility notes.
**Gate:** approve the look before build.

### Phase 3 — System / Architecture  *(skill: fullstack-guardian)*
1. Scaffold the Astro + TypeScript + Tailwind project.
2. Implement Sanity Studio + all schemas; connect Astro to Sanity (GROQ queries, typed).
3. i18n routing for km/en with the language toggle.
4. Image optimization pipeline.
5. Contact/partner form → Cloudflare Pages Function: server-side validation + Turnstile verification + transactional email send. Keys via env only.
6. Environment config (dev/preview/prod), `.env.example`, secrets documented (never committed).
**Gate:** approve architecture + a working skeleton.

### Phase 4 — Build / Implementation
Build all pages and components against the CMS, both locales, with the two special treatments (Director message, org chart). Wire the Donate page (QR images + bank details pulled from `siteSettings`, no payment code). Wire Activities/News feed, reports/policy downloads, jobs, partners, impact stats. Realistic marked placeholder content throughout.
**Gate:** working preview deploy for review.

### Phase 5 — Security review  *(skill: security-reviewer)*
Deliver a checklist report + fixes:
- Security headers via Cloudflare Pages `_headers` / rules: **CSP**, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy.
- Form abuse protection: Turnstile enforced server-side, input validation + sanitization, rate limiting, honeypot.
- Secrets: no keys in client bundle or repo; all via Cloudflare env vars. Confirm Sanity token is read-only where possible and never shipped to the browser.
- Dependency audit (`npm audit`), pin versions.
- Sanity dataset permissions + CORS origins locked to the production domain.
- Privacy: minimal data collection on forms; a simple privacy note; no tracking cookies.
- Confirm no beneficiary/child personal data is exposed anywhere.
**Gate:** sign-off on security before go-live.

### Phase 6 — Cloud deployment  *(skills: cloud-architect + devops-engineer)*
1. Connect the Git repo to Cloudflare Pages; set build command + output dir for Astro.
2. Configure custom domain, DNS, automatic HTTPS/SSL.
3. Set production env vars/secrets in Cloudflare.
4. Preview vs production environments.
5. Sanity webhook → Cloudflare Pages Deploy Hook so publishing content triggers a rebuild.
6. Enable Cloudflare Web Analytics; set up basic uptime monitoring.
7. Document for SKO staff: how to log into Sanity, edit an Activity/News post, add a report PDF, and update the Director message — a short plain-language guide.
**Gate:** production launch + handover doc.

---

## 7. Definition of done
- Both locales complete, all clusters live, CMS-editable where specified.
- Lighthouse 90+ across the board; WCAG 2.1 AA verified.
- Security checklist passed; headers live; forms spam-protected; no secrets exposed.
- Publishing in Sanity auto-rebuilds the live site.
- Staff handover guide delivered.
- Total recurring cost stays within free tiers (domain only, ~$15–35/yr) unless I approve otherwise.

## 8. Guardrails — do NOT
- Do not add any card/payment processing, or collect payment details on-site.
- Do not switch stack (no Next.js, WordPress, Vercel, etc.) without asking.
- Do not commit secrets or ship the Sanity write token to the client.
- Do not invent SKO facts, statistics, staff names, or a real director's name — use marked placeholders.
- Do not publish or expose any personal data about beneficiaries or children.
- Do not proceed past a phase gate without my approval.
