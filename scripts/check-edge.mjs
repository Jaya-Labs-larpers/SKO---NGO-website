/**
 * Live checks against a deployed copy of the site.
 *
 *   node scripts/check-edge.mjs https://sko-website.<subdomain>.workers.dev
 *   node scripts/check-edge.mjs https://www.sko-samatapheapkhnom.org --indexable
 *
 * Run it on the workers.dev rehearsal before attaching the domain, on
 * production after every deploy, and after any incident. Exits 1 on failure.
 *
 * `--indexable` additionally asserts that nothing tells search engines to stay
 * away. Leave it off while production deliberately ships noindex (fixture
 * content), and turn it on the day the real content goes live.
 */

import { setTimeout as sleep } from "node:timers/promises";

const args = process.argv.slice(2);
const base = args.find((arg) => !arg.startsWith("--"))?.replace(/\/+$/, "");
const indexable = args.includes("--indexable");
if (!base) {
  console.error("usage: node scripts/check-edge.mjs <base-url> [--indexable]");
  process.exit(2);
}

const results = [];
function record(ok, label, detail = "") {
  results.push({ ok, label, detail });
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${label}${detail ? `  (${detail})` : ""}`,
  );
}

const reasonOf = (error) => {
  const cause = error.cause ?? error;
  const kind = typeof cause.code === "string" ? cause.code : cause.name;
  return [kind, cause.message].filter(Boolean).join(": ");
};

async function fetchOnce(path, init) {
  const response = await fetch(`${base}${path}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(20000),
    ...init,
  });
  const text = init.method === "HEAD" ? "" : await response.text();
  return { status: response.status, headers: response.headers, text };
}

// A request that fails at the network level (connect timeout, reset) is retried
// once, then recorded as a failed check so the summary line still prints. Every
// request here is read-only or built to be rejected, so a retry is safe.
async function get(path, init = {}) {
  const request = `${init.method ?? "GET"} ${path}`;
  try {
    return await fetchOnce(path, init);
  } catch (error) {
    console.log(`INFO  retrying ${request} after ${reasonOf(error)}`);
  }
  await sleep(1000);
  try {
    return await fetchOnce(path, init);
  } catch (error) {
    record(false, `${request} responds`, reasonOf(error));
    return { status: 0, headers: new Headers(), text: "" };
  }
}

const header = (res, name) => res.headers.get(name) ?? "";
const langOf = (html) => /<html lang="([a-z-]+)"/.exec(html)?.[1];
const titleOf = (html) => /<title>([^<]*)<\/title>/.exec(html)?.[1]?.trim();
const assetOf = (html) => /\/_astro\/[^"']+\.(?:css|js)/.exec(html)?.[0];

// For a few seconds after a deploy some edges still serve the previous HTML
// while the asset store holds only the new build's hashed files, so the
// homepage can reference a stylesheet that 404s. Wait for them to agree before
// judging anything, and let the asset check below fail if they never do.
async function settledHome() {
  for (let attempt = 1; ; attempt++) {
    const page = await get("/");
    const asset = assetOf(page.text);
    if (!asset || attempt === 10) return page;
    const status = await fetchOnce(asset, { method: "HEAD" }).then(
      (res) => res.status,
      reasonOf,
    );
    if (status === 200) return page;
    console.log(`INFO  ${asset} is ${status}, waiting for the deploy to settle`);
    await sleep(3000);
  }
}

// Pages
const home = await settledHome();
record(home.status === 200, "GET / is 200", String(home.status));
record(langOf(home.text) === "en", "homepage is English", langOf(home.text));
record(/<main[^>]*id="main"/.test(home.text), 'homepage has <main id="main">');
record(
  /<a[^>]*href="\/about\/"/.test(home.text),
  "homepage links to /about/ in the HTML",
);

const km = await get("/km/");
record(
  km.status === 200 && langOf(km.text) === "km",
  "GET /km/ is 200 and Khmer",
  `${km.status} ${langOf(km.text)}`,
);

const deep = await get("/about/");
record(
  deep.status === 200 && langOf(deep.text) === "en",
  "GET /about/ is 200",
  String(deep.status),
);

const noSlash = await get("/about");
record(
  [301, 302, 307, 308].includes(noSlash.status) &&
    /\/about\/$/.test(header(noSlash, "location")),
  "/about redirects once to /about/",
  `${noSlash.status} -> ${header(noSlash, "location")}`,
);

// 404s: a real status, the site's own page, in the right language.
const missingEn = await get("/this-page-does-not-exist/");
record(
  missingEn.status === 404,
  "missing English page is 404",
  String(missingEn.status),
);
record(
  langOf(missingEn.text) === "en" && Boolean(titleOf(missingEn.text)),
  "English 404 serves the site 404 page",
  titleOf(missingEn.text),
);

const missingKm = await get("/km/this-page-does-not-exist/");
record(
  missingKm.status === 404,
  "missing Khmer page is 404",
  String(missingKm.status),
);
record(
  langOf(missingKm.text) === "km" && Boolean(titleOf(missingKm.text)),
  "Khmer 404 serves the Khmer 404 page",
  titleOf(missingKm.text),
);

// Security headers on a live HTML response
for (const [name, expected] of [
  ["x-content-type-options", /^nosniff$/i],
  ["x-frame-options", /^DENY$/i],
  ["referrer-policy", /^strict-origin-when-cross-origin$/i],
  ["permissions-policy", /camera=\(\)/],
  ["cross-origin-opener-policy", /^same-origin$/i],
  ["strict-transport-security", /max-age=31536000/],
  ["content-security-policy", /frame-ancestors 'none'/],
]) {
  record(
    expected.test(header(home, name)),
    `header ${name}`,
    header(home, name) || "missing",
  );
}
record(
  /<meta http-equiv="Content-Security-Policy" content="[^"]*sha256-/.test(
    home.text,
  ),
  "per-page CSP meta with hashes",
);

// Caching: hashed assets immutable, HTML not.
record(
  !/immutable/.test(header(home, "cache-control")),
  "HTML is not immutable",
  header(home, "cache-control"),
);
const asset = assetOf(home.text);
if (asset) {
  const res = await get(asset, { method: "HEAD" });
  record(
    res.status === 200 && /immutable/.test(header(res, "cache-control")),
    `hashed asset ${asset} is immutable`,
    `${res.status} ${header(res, "cache-control")}`,
  );
} else {
  record(false, "homepage references a /_astro/ asset");
}
const font = await get("/fonts/inter-latin.woff2", { method: "HEAD" });
record(
  font.status === 200 && /max-age=86400/.test(header(font, "cache-control")),
  "fonts cached for a day",
  header(font, "cache-control"),
);

// Discovery files
const robots = await get("/robots.txt");
record(robots.status === 200, "robots.txt is 200", String(robots.status));
const sitemap = await get("/sitemap-index.xml");
record(
  sitemap.status === 200 && /<sitemapindex/.test(sitemap.text),
  "sitemap-index.xml is 200",
);

// The API
const apiGet = await get("/api/contact");
record(
  apiGet.status === 405 && /POST/.test(header(apiGet, "allow")),
  "GET /api/contact is 405 with Allow: POST",
  `${apiGet.status} ${header(apiGet, "allow")}`,
);
record(
  /no-store/.test(header(apiGet, "cache-control")),
  "API responses are no-store",
  header(apiGet, "cache-control"),
);
const apiPost = await get("/api/contact", {
  method: "POST",
  headers: { "Content-Type": "text/plain" },
  body: "x",
});
record(
  [503, 415].includes(apiPost.status),
  "POST /api/contact rejects a text/plain body",
  `${apiPost.status} ${apiPost.text.slice(0, 80)}`,
);
const apiOther = await get("/api/anything-else");
record(
  apiOther.status === 404,
  "unknown /api/ path is 404",
  String(apiOther.status),
);

// Indexing state
const robotsTag = header(home, "x-robots-tag");
const metaNoindex = /<meta name="robots" content="[^"]*noindex/.test(home.text);
const disallowAll = /Disallow: \/\s*$/m.test(robots.text);
const state = `x-robots-tag=${robotsTag || "none"}, meta noindex=${metaNoindex}, robots disallow-all=${disallowAll}`;
if (indexable) {
  record(
    !robotsTag && !metaNoindex && !disallowAll,
    "production is indexable",
    state,
  );
  record(
    robots.text.includes(`${base}/sitemap-index.xml`),
    "robots.txt names the production sitemap",
  );
} else {
  console.log(`INFO  indexing state: ${state}`);
}
console.log(`INFO  server: ${header(home, "server") || "unknown"}`);

const failed = results.filter((result) => !result.ok);
console.log(
  `\n${results.length - failed.length}/${results.length} checks passed against ${base}`,
);
if (failed.length) process.exit(1);
