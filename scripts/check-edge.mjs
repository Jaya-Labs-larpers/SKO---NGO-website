/**
 * Live checks against a deployed copy of the site.
 *
 *   node scripts/check-edge.mjs https://sko-website.<subdomain>.workers.dev
 *   node scripts/check-edge.mjs https://www.samatapheapkhnom.org --indexable
 *   node scripts/check-edge.mjs https://www.samatapheapkhnom.org --expect-build
 *
 * Run it on the workers.dev rehearsal before attaching the domain, on
 * production after every deploy, and after any incident. Exits 1 on failure.
 * The checks themselves live in scripts/edge-checks.mjs.
 *
 * `--indexable` additionally asserts that nothing tells search engines to stay
 * away. Leave it off while production deliberately ships noindex (fixture
 * content), and turn it on the day the real content goes live.
 *
 * `--expect-build` waits for the homepage to be the build in dist/ and fails if
 * it never arrives. Pass it straight after deploying that build, and only then.
 */

import { readFile } from "node:fs/promises";
import { assetOf, runEdgeChecks } from "./edge-checks.mjs";

const args = process.argv.slice(2);
const base = args.find((arg) => !arg.startsWith("--"))?.replace(/\/+$/, "");
if (!base) {
  console.error(
    "usage: node scripts/check-edge.mjs <base-url> [--indexable] [--expect-build]",
  );
  process.exit(2);
}

const expected = args.includes("--expect-build")
  ? assetOf(await readFile("dist/index.html", "utf8"))
  : undefined;
if (args.includes("--expect-build") && !expected) {
  console.error("--expect-build: dist/index.html references no /_astro/ asset");
  process.exit(2);
}

const results = await runEdgeChecks(base, {
  indexable: args.includes("--indexable"),
  expected,
});

const failed = results.filter((result) => !result.ok);
console.log(
  `\n${results.length - failed.length}/${results.length} checks passed against ${base}`,
);
if (failed.length) process.exit(1);
