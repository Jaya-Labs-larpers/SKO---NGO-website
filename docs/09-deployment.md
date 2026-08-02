# Phase 6 — Deployment runbook

**Status: Phase 6 gate — prepared, awaiting the accounts and domain to execute.**

Everything that can be built and committed is done. What remains needs accounts I cannot create and
credentials I will not handle: a domain, a Git host, a Cloudflare account, a Sanity project, and a
Resend account. This document is the exact sequence to follow.

Work through it in order — later steps depend on earlier ones. Expect **60–90 minutes** end to end,
plus DNS propagation.

---

## Before you start

Four things have been outstanding since Phase 1. Nothing here works without them:

| Needed | Why |
|---|---|
| **A domain**, and access to its registrar | Steps 5 and 8 |
| **A Git account that SKO owns** | Step 1 — see the warning below |
| **The inbox addresses** for general and partner enquiries | Step 4 |
| **DNS control for the sending domain** | Step 8 — Resend needs SPF and DKIM records |

> **On account ownership.** Create the GitHub organisation and the Cloudflare, Sanity and Resend
> accounts under an **SKO-controlled email address**, not a personal one. An NGO website living in a
> departing volunteer's personal GitHub is a common and painful failure mode — recovering it later
> means proving ownership to three companies at once. Add a second SKO admin to each account today.

---

## 1. Git repository

The repository is initialised locally with one commit. `.gitignore` was in place before that commit,
so no `.env` has ever been tracked.

```bash
git remote add origin https://github.com/<SKO-ORG>/sko-website.git
git push -u origin main
```

Then in the repository settings: protect `main` (require the **Verify** workflow to pass), and turn
on Dependabot security updates.

## 2. Sanity project

```bash
cd studio
npx sanity login
npx sanity init --project-plan free
```

Choose **"Use the existing configuration"** when asked — the schemas are already written. Note the
**project ID**; you need it in step 4.

Then create the dataset as **public**:

```bash
npx sanity dataset create production --visibility public
```

Public is deliberate — see ADR-004 in `04-tech-decisions.md`. Every document in this dataset is
content intended for publication, and it removes the need for a token that could leak. It is only
safe because no beneficiary or child data is modelled; do not add any.

**Lock CORS** (Sanity → API → CORS origins). Delete the default wildcard, then add:

| Origin | Credentials |
|---|---|
| `https://<your-domain>` | **No** |
| `http://localhost:3333` | **No** |
| `http://localhost:4321` | **No** |

Deploy the Studio:

```bash
SANITY_STUDIO_PROJECT_ID=<id> SANITY_STUDIO_HOSTNAME=sko npx sanity deploy
```

That publishes to `https://sko.sanity.studio` — free, and nothing for SKO to host or keep patched.

**Invite staff individually** (Sanity → Members). Give them the lowest role that lets them publish.
No shared logins — you want to know who changed what.

## 3. Cloudflare Pages project

Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.

| Setting | Value |
|---|---|
| Production branch | `main` |
| Framework preset | None (`wrangler.toml` supplies the settings) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | set env var `NODE_VERSION` = `22` |

`wrangler.toml` in the repo root already declares the output directory and compatibility date, so
the build settings are version-controlled rather than living only in the dashboard.

## 4. Environment variables

Settings → **Environment variables**. Set these for **Production** *and* **Preview** separately —
Cloudflare does not copy between them, and a preview build with missing variables fails in ways that
look like code bugs.

**Public** (inlined into the browser bundle by design):

| Variable | Value |
|---|---|
| `PUBLIC_SITE_URL` | `https://<your-domain>` (preview: the `*.pages.dev` URL) |
| `PUBLIC_SANITY_PROJECT_ID` | from step 2 |
| `PUBLIC_SANITY_DATASET` | `production` |
| `PUBLIC_SANITY_API_VERSION` | `2026-01-01` |
| `PUBLIC_TURNSTILE_SITE_KEY` | from step 6 |
| `PUBLIC_CF_ANALYTICS_TOKEN` | from step 9 |

**Secrets** — use the **Encrypt** option so they cannot be read back:

| Variable | Value |
|---|---|
| `TURNSTILE_SECRET_KEY` | from step 6 |
| `RESEND_API_KEY` | from step 8 |
| `MAIL_FROM` | `noreply@<your-domain>` |
| `CONTACT_TO_EMAIL` | general enquiries inbox |
| `PARTNER_TO_EMAIL` | partnerships/grants inbox |

> Until `PUBLIC_SANITY_PROJECT_ID` is set the site builds from local fixtures and shows placeholder
> content. That is intentional — it means the first deploy succeeds and you can check the plumbing
> before any content exists.

## 5. Custom domain and HTTPS

Pages project → **Custom domains** → **Set up a domain**.

- **If the domain is already on Cloudflare:** the DNS record is created for you.
- **If not:** either move the nameservers to Cloudflare (recommended — you get the WAF and analytics),
  or add the `CNAME` your registrar requires as shown.

Add both `<your-domain>` and `www.<your-domain>`, and set one to redirect to the other so the site
has a single canonical host. HTTPS is automatic; certificates issue within minutes and renew
themselves. Once it resolves, turn on **Always Use HTTPS**.

Then set **HSTS** (SSL/TLS → Edge Certificates): max-age 12 months, include subdomains, preload.
The site already sends the header; enabling it at the edge covers non-HTML responses too.

> Do this **after** the domain resolves, not before. HSTS with preload is hard to undo — browsers
> cache it — so a mistake here is expensive.

## 6. Turnstile

Cloudflare → **Turnstile** → **Add widget**. Domain: your production domain plus `*.pages.dev` for
previews. Mode: **Managed**. Copy the site key and secret key into step 4.

> **The form now fails closed.** If `TURNSTILE_SECRET_KEY` is missing or wrong, submissions return a
> 500 rather than silently going through unverified (Phase 5, FIND-001). Test the form immediately
> after the first deploy — a working form proves the secret is right.

## 7. Rate-limiting KV namespace

```bash
npx wrangler kv namespace create RATE_LIMIT_KV
npx wrangler kv namespace create RATE_LIMIT_KV --preview
```

Paste the ids into `wrangler.toml` and uncomment that block, or bind it in the dashboard under
Settings → Functions → KV namespace bindings. Binding name must be exactly `RATE_LIMIT_KV`.

## 8. Email delivery (Resend)

1. Create the account, **Domains** → add `<your-domain>`.
2. Add the **SPF** and **DKIM** records Resend shows you at your DNS provider.
3. Wait for both to verify. **Do not skip this** — without SPF and DKIM, form notifications will land
   in spam, and you will conclude the form is broken when it is not.
4. Create an API key with **Sending access only**, not full access. Put it in step 4.

Free tier is 3,000 emails/month and 100/day — far above what a contact form needs, and Turnstile
plus rate limiting sit in front of it.

## 9. Analytics

Cloudflare → **Web Analytics** → **Add a site**. Copy the token into `PUBLIC_CF_ANALYTICS_TOKEN`.

Cookieless and privacy-preserving — no consent banner needed, which is why the site sets no cookies
at all. The beacon host is already allowed in the CSP.

## 10. Rebuild on publish

**Deploy hook:** Pages → Settings → Builds & deployments → **Deploy hooks** → Add. Name it
`sanity-publish`, branch `main`. Copy the URL — treat it as a secret; anyone with it can trigger
builds.

**Sanity webhook:** Sanity → API → Webhooks → Create.

| Field | Value |
|---|---|
| URL | the deploy hook URL |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| Filter | `!(_id in path("drafts.**"))` |
| HTTP method | `POST` |

The filter is what stops every keystroke in a draft from triggering a build. Cloudflare's build queue
debounces the rest, so publishing three posts in a row produces one useful build.

**Nightly rebuild:** so time-sensitive content drops off without anyone touching the CMS — expired
job posts in particular. Create a Cron Trigger (Workers → Cron) or any scheduler that POSTs to the
deploy hook at **02:00 Asia/Phnom_Penh**. Costs nothing and it is the reason job deadlines work.

## 11. Uptime monitoring

Free options that suit an NGO budget:

- **UptimeRobot** — 5-minute checks on `https://<your-domain>/` and `/km/`, email alerts.
- **Cloudflare Health Checks** — if you are on a paid plan.

Also add a check on `/donate/`. It is the page whose breakage costs the most and the one nobody
visits often enough to notice.

## 12. Post-deploy verification

Do all of these on the live site before telling anyone it is launched.

- [ ] `https://<domain>` and `https://<domain>/km/` both load
- [ ] The language toggle moves between matching pages, not back to the homepage
- [ ] Khmer text renders in Kantumruy Pro — not a system fallback. Check a Khmer heading against
      the design preview
- [ ] **Submit the contact form and confirm the email arrives.** Then check it is not in spam
- [ ] Submit the partner form and confirm it reaches the *partnerships* inbox, not the general one
- [ ] `curl -I https://<domain>` shows HSTS, `X-Frame-Options`, `X-Content-Type-Options`,
      `Referrer-Policy`, `Permissions-Policy`
- [ ] View source: the `<meta http-equiv="Content-Security-Policy">` tag is present and contains
      `sha256-` hashes
- [ ] Browser console is clean — no CSP violations
- [ ] `https://<domain>/sitemap-index.xml` resolves and lists both locales
- [ ] `https://<domain>/robots.txt` points at the real sitemap URL, not `example.org`
- [ ] Publish a test post in Sanity; confirm a build starts within a minute and the post appears
- [ ] Delete the test post; confirm it disappears after the next build
- [ ] Run Lighthouse on the live URL, mobile profile — all four categories should stay above 90
- [ ] Submit Google Search Console verification and the sitemap

## 13. Two things to change in code before launch

Neither is a code change you need me for, but both are wrong until you do them:

1. **`public/robots.txt`** — replace `https://example.org/sitemap-index.xml` with the real domain.
2. **Fixture content** — once Sanity has real content, the placeholders disappear on their own. If
   any `[PLACEHOLDER]` text is still visible on the live site, that field has not been filled in.
   Searching the live site for `[PLACEHOLDER]` is a quick way to find what SKO still owes.

---

## What it costs

| Service | Plan | Cost |
|---|---|---|
| Cloudflare Pages | Free | $0 — 500 builds/month; this site uses roughly 60–100 |
| Cloudflare Turnstile, Analytics, KV | Free | $0 |
| Sanity | Free | $0 — 20 users, 10 GB assets. PDFs are the thing to watch |
| Resend | Free | $0 — 3,000 emails/month |
| UptimeRobot | Free | $0 |
| **Domain** | registrar | **$10–35/year** |

**Total recurring: the domain only**, as specified. Cloudflare Registrar sells at cost if you move
the domain there.

The one thing that could push you off a free tier is Sanity asset storage, if SKO uploads many large
PDFs and photos. 10 GB is a lot of annual reports, but compress scanned PDFs before uploading.
