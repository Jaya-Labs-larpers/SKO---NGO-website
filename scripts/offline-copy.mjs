/**
 * Packages the built site into a folder that opens straight from the file
 * system — no server, no install. For sending to reviewers.
 *
 *   npm run build && node scripts/offline-copy.mjs
 *
 * Three things have to change for a static build to work over file://
 *
 *   1. Links are root-absolute ("/about/"). On file:// that resolves to the
 *      drive root, so every link 404s. They are rewritten to relative paths.
 *   2. Directory URLs ("/about/") have no index resolution over file://, so
 *      they become explicit ("../about/index.html").
 *   3. The Content-Security-Policy meta tag uses 'self', which does not match
 *      a file:// origin — it would block the stylesheet and the page would
 *      render unstyled. Stripped from the copy only; the real site keeps it.
 */

import { cp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const DIST = join(ROOT, 'dist');
const OUT = join(ROOT, 'SKO-website-preview');

await rm(OUT, { recursive: true, force: true });
await cp(DIST, OUT, { recursive: true });

// Files that only make sense on a real server.
for (const junk of ['_headers', '_redirects', 'sitemap-index.xml', 'sitemap-0.xml', 'robots.txt']) {
  await rm(join(OUT, junk), { force: true });
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

/** "/about/" -> "../about/index.html", relative to a page at the given depth. */
function toRelative(target, depth) {
  let path = target;
  if (path === '/') path = '/index.html';
  else if (path.endsWith('/')) path += 'index.html';
  const prefix = depth === 0 ? './' : '../'.repeat(depth);
  return prefix + path.slice(1);
}

let pages = 0;
let links = 0;

for await (const file of walk(OUT)) {
  const rel = relative(OUT, file).split(sep).join('/');
  const depth = rel.split('/').length - 1;

  if (file.endsWith('.html')) {
    let html = await readFile(file, 'utf8');

    // 3. CSP would block the stylesheet over file://
    html = html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/g, '');

    // 1 + 2. Root-absolute internal links and assets.
    html = html.replace(/(href|src)="(\/[^"/][^"]*|\/)"/g, (match, attr, target) => {
      links += 1;
      return `${attr}="${toRelative(target, depth)}"`;
    });

    // srcset entries, and the preload href already handled above.
    html = html.replace(/srcset="([^"]+)"/g, (match, value) => {
      const rewritten = value
        .split(',')
        .map((entry) => {
          const trimmed = entry.trim();
          if (!trimmed.startsWith('/')) return trimmed;
          const [url, descriptor] = trimmed.split(/\s+/);
          return `${toRelative(url, depth)}${descriptor ? ` ${descriptor}` : ''}`;
        })
        .join(', ');
      return `srcset="${rewritten}"`;
    });

    await writeFile(file, html, 'utf8');
    pages += 1;
  }

  if (file.endsWith('.css')) {
    let css = await readFile(file, 'utf8');
    css = css.replace(/url\((['"]?)\/([^)'"]+)\1\)/g, (match, quote, path) => {
      links += 1;
      return `url(${quote}${'../'.repeat(depth)}${path}${quote})`;
    });
    await writeFile(file, css, 'utf8');
  }
}

await writeFile(
  join(OUT, 'READ-ME-FIRST.txt'),
  `SKO website — offline preview
=============================

Open  index.html  in any web browser. Double-clicking it is enough.

This is the real website, exactly as it will look. You can click through every
page in both languages using the menu and the EN / ខ្មែរ button.

Two things behave differently in this offline copy:

  * The contact forms do not send. They need a live server. Everything else,
    including the layout and the Khmer, is exactly as it will be.

  * The address bar shows a long file path instead of a web address. That is
    normal for an offline copy.

Where content is still missing you will see [NEEDS SKO], [SAMPLE] or
[EXAMPLE]. Photographs are not in yet, so you will see striped grey boxes
where they will go.

Generated ${new Date().toISOString().slice(0, 10)}
`,
  'utf8',
);

console.log(`Offline copy written to ${OUT}`);
console.log(`  ${pages} pages, ${links} links and asset paths rewritten`);
