/**
 * Structural checks across every built page.
 *
 * Cheap, deterministic invariants that a spot-check on two pages would miss —
 * run after `npm run build`. Lighthouse covers depth on a few routes; this
 * covers breadth on all of them.
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';
import { contentFailures, deploymentEnvironment } from './readiness.mjs';
import { findEnvLeaks, findSecrets, secretEnvEntries } from './secrets.mjs';

const env = { ...loadEnv('production', process.cwd(), ''), ...process.env };
const production = deploymentEnvironment(env) === 'production';
const localContent = env.PUBLIC_CONTENT_SOURCE === 'fixtures';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));

async function* allFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* allFiles(path);
    else yield path;
  }
}

async function* htmlFiles(dir) {
  for await (const path of allFiles(dir)) if (path.endsWith('.html')) yield path;
}

/** Everything a browser could read as text. Binary assets carry no secrets a scan would find. */
const TEXT_FILE = /\.(?:html|js|mjs|css|json|xml|txt|svg|webmanifest|map)$/;

const failures = [];
let checked = 0;

function check(condition, page, message) {
  if (!condition) failures.push(`${page}: ${message}`);
}

for await (const file of htmlFiles(DIST)) {
  const page = `/${relative(DIST, file).split(sep).join('/')}`;
  const html = await readFile(file, 'utf8');
  checked += 1;
  if (production && !localContent) {
    for (const failure of contentFailures(html, page)) check(false, page, failure);
  }

  const isKhmer = page.startsWith('/km/');
  const is404 = page.includes('404');

  // Locale correctness
  const lang = /<html lang="([a-z-]+)"/.exec(html)?.[1];
  check(
    lang === (isKhmer ? 'km' : 'en'),
    page,
    `<html lang> is "${lang}", expected "${isKhmer ? 'km' : 'en'}"`,
  );

  // Exactly one h1
  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  check(h1Count === 1, page, `${h1Count} <h1> elements, expected exactly 1`);

  // Security policy was injected
  check(
    !html.includes('__CSP_POLICY__'),
    page,
    'CSP placeholder was not replaced — scripts/csp.mjs did not run',
  );
  check(/<meta http-equiv="Content-Security-Policy"/.test(html), page, 'no CSP meta tag');

  // Every inline script is covered by a hash in this page's own policy
  const policy = /<meta http-equiv="Content-Security-Policy" content="([^"]*)"/.exec(html)?.[1] ?? '';
  const inlineCount = (html.match(/<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/g) ?? []).filter(
    (tag) => !/>\s*<\/script>/.test(tag),
  ).length;
  const hashCount = (policy.match(/'sha256-/g) ?? []).length;
  check(
    hashCount >= inlineCount,
    page,
    `${inlineCount} inline script(s) but only ${hashCount} hash(es) in the policy`,
  );

  // Canonical + both hreflang alternates (404s are noindex, so exempt)
  if (!is404) {
    check(/<link rel="canonical"/.test(html), page, 'no canonical link');
    check(/hreflang="en"/.test(html), page, 'missing hreflang="en"');
    check(/hreflang="km"/.test(html), page, 'missing hreflang="km"');
    check(/hreflang="x-default"/.test(html), page, 'missing hreflang="x-default"');
    check(/<meta name="description"/.test(html), page, 'no meta description');
  }

  // Structured data
  check(/"@type":"NGO"/.test(html), page, 'no Organization/NGO structured data');

  // Accessibility basics that are cheap to assert statically
  check(/<a[^>]*href="#main"/.test(html), page, 'no skip link');
  check(/<main[^>]*id="main"/.test(html), page, 'no <main id="main">');

  // No image without an alt attribute
  const imgsWithoutAlt = (html.match(/<img(?![^>]*\salt=)[^>]*>/g) ?? []).length;
  check(imgsWithoutAlt === 0, page, `${imgsWithoutAlt} <img> without alt`);

  // The placeholder marker must never leak into a production build unnoticed
  // (informational only — Phase 4 content is deliberately placeholder).
}

// Secrets — every shipped text file, not only HTML. `_astro/*.js` is where a
// leaked `import.meta.env` value would actually land.
const secretEnv = secretEnvEntries(env);
let scanned = 0;
for await (const file of allFiles(DIST)) {
  const asset = `/${relative(DIST, file).split(sep).join('/')}`;

  // Source maps expose original source and, with it, anything inlined at build time.
  check(!asset.endsWith('.map'), asset, 'source map shipped in production output');

  if (!TEXT_FILE.test(asset)) continue;
  const text = await readFile(file, 'utf8');
  scanned += 1;
  for (const { rule, match } of findSecrets(text)) {
    check(false, asset, `contains what looks like a ${rule}: ${match}`);
  }
  for (const key of findEnvLeaks(text, secretEnv)) {
    check(false, asset, `contains the value of ${key}`);
  }
}

console.log(`[check] ${checked} page(s) checked, ${scanned} text file(s) scanned for secrets`);
if (failures.length > 0) {
  console.error(`[check] ${failures.length} failure(s):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log('[check] all structural checks passed');
