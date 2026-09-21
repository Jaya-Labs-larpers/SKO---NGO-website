import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const root = new URL("../", import.meta.url);
const jsonc = (text) =>
  JSON.parse(text.replace(/^\s*\/\/.*$/gm, "").replace(/,(\s*[}\]])/g, "$1"));
const config = jsonc(await readFile(new URL("wrangler.jsonc", root), "utf8"));
const production = config.env.production;

test("static assets serve dist with the nearest 404 page and the Worker only in front of /api/", () => {
  assert.equal(config.main, "worker/index.ts");
  assert.equal(config.assets.directory, "./dist");
  assert.equal(config.assets.binding, "ASSETS");
  assert.equal(config.assets.not_found_handling, "404-page");
  assert.deepEqual(config.assets.run_worker_first, ["/api/*"]);
  assert.equal(
    config.assets.html_handling,
    undefined,
    "default auto-trailing-slash matches Astro directory output",
  );
});

test("the rehearsal stays on workers.dev in preview mode and never delivers mail", () => {
  assert.equal(config.workers_dev, true);
  assert.equal(config.vars.PUBLIC_DEPLOYMENT_ENV, "preview");
  assert.notEqual(config.vars.CONTACT_ENABLED, "true");
  assert.equal(config.routes, undefined);
});

test("production is a separate Worker on the canonical host with its own KV namespace", () => {
  assert.equal(production.name, "sko-website-production");
  assert.equal(production.workers_dev, false);
  assert.equal(production.preview_urls, false);
  assert.deepEqual(production.routes, [
    { pattern: "www.sko-samatapheapkhnom.org", custom_domain: true },
  ]);
  assert.equal(production.vars.PUBLIC_DEPLOYMENT_ENV, "production");
  const binding = (env) =>
    env.kv_namespaces.find(
      (namespace) => namespace.binding === "RATE_LIMIT_KV",
    );
  assert.ok(binding(config)?.id);
  assert.ok(binding(production)?.id);
  assert.notEqual(
    binding(config).id,
    binding(production).id,
    "rehearsal and production must not share a counter",
  );
  for (const key of Object.keys({ ...config.vars, ...production.vars })) {
    assert.ok(
      key === "PUBLIC_DEPLOYMENT_ENV" || key === "CONTACT_ENABLED",
      `${key} is not a secret-safe var`,
    );
  }
});

test("_headers carries the security and cache policy, with immutable only on hashed assets", async () => {
  const text = await readFile(new URL("public/_headers", root), "utf8");
  const blocks = new Map();
  let current;
  for (const raw of text.split("\n")) {
    const line = raw.replace(/#.*$/, "").trimEnd();
    if (!line.trim()) continue;
    if (!/^\s/.test(line)) {
      current = [];
      blocks.set(line.trim(), current);
    } else {
      const [name, ...value] = line.trim().split(":");
      current.push([name.trim().toLowerCase(), value.join(":").trim()]);
    }
  }
  const all = Object.fromEntries(blocks.get("/*"));
  assert.equal(all["x-frame-options"], "DENY");
  assert.equal(all["x-content-type-options"], "nosniff");
  assert.equal(all["referrer-policy"], "strict-origin-when-cross-origin");
  assert.equal(all["cross-origin-opener-policy"], "same-origin");
  assert.match(all["permissions-policy"], /camera=\(\)/);
  assert.equal(all["strict-transport-security"], "max-age=31536000");
  assert.equal(all["content-security-policy"], "frame-ancestors 'none'");
  assert.equal(
    all["cache-control"],
    undefined,
    "HTML must not inherit an asset cache policy",
  );
  assert.match(
    Object.fromEntries(blocks.get("/_astro/*"))["cache-control"],
    /immutable/,
  );
  for (const [pattern, headers] of blocks) {
    if (pattern === "/_astro/*") continue;
    assert.ok(
      !headers.some(([, value]) => /immutable/.test(value)),
      `${pattern} must not be immutable`,
    );
  }
});

test("the Khmer 404 page is copied to where the nearest-404 lookup finds it", async () => {
  const { copyLocalizedNotFound } = await import("../scripts/not-found.mjs");
  const dist = await mkdtemp(join(tmpdir(), "sko-dist-"));
  await mkdir(join(dist, "km", "404"), { recursive: true });
  await writeFile(
    join(dist, "km", "404", "index.html"),
    '<html lang="km"></html>',
  );
  assert.deepEqual(await copyLocalizedNotFound(dist), ["km/404.html"]);
  assert.equal(
    await readFile(join(dist, "km", "404.html"), "utf8"),
    '<html lang="km"></html>',
  );
  await assert.rejects(
    copyLocalizedNotFound(await mkdtemp(join(tmpdir(), "sko-empty-"))),
  );
});
