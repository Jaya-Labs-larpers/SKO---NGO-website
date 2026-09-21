/**
 * Post-build step: give Cloudflare a Khmer 404 page it can find.
 *
 * With `assets.not_found_handling = "404-page"`, Workers serves the nearest
 * `404.html` walking up from the requested path. Astro's directory-style build
 * writes the Khmer route to `km/404/index.html`, which that lookup never sees,
 * so it is copied to `km/404.html`. English keeps Astro's own root `404.html`.
 */

import { access, copyFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const LOCALIZED_NOT_FOUND = [
  { from: "km/404/index.html", to: "km/404.html" },
];

export async function copyLocalizedNotFound(dist) {
  const copied = [];
  for (const { from, to } of LOCALIZED_NOT_FOUND) {
    await access(join(dist, from));
    await copyFile(join(dist, from), join(dist, to));
    copied.push(to);
  }
  return copied;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const dist = fileURLToPath(new URL("../dist/", import.meta.url));
  const copied = await copyLocalizedNotFound(dist);
  console.log(`[not-found] wrote ${copied.join(", ")}`);
}
