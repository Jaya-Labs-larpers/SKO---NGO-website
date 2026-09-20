import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import ts from "typescript";

test("production rejects development configuration while explicit previews remain usable", async () => {
  const { validateBuildConfig, deploymentEnvironment } =
    await import("../scripts/readiness.mjs");
  assert.equal(
    deploymentEnvironment({ PUBLIC_DEPLOYMENT_ENV: "production" }),
    "production",
  );
  assert.equal(
    deploymentEnvironment({ PUBLIC_DEPLOYMENT_ENV: "preview" }),
    "preview",
  );
  assert.equal(deploymentEnvironment({}), "development");
  assert.throws(() =>
    deploymentEnvironment({ PUBLIC_DEPLOYMENT_ENV: "staging" }),
  );
  assert.deepEqual(
    validateBuildConfig({ PUBLIC_DEPLOYMENT_ENV: "preview" }),
    [],
  );
  assert.ok(
    validateBuildConfig({ PUBLIC_DEPLOYMENT_ENV: "production" }).length >= 3,
  );
  const real = {
    PUBLIC_DEPLOYMENT_ENV: "production",
    PUBLIC_SITE_URL: "https://ngo.org",
    PUBLIC_CONTENT_SOURCE: "sanity",
    PUBLIC_SANITY_PROJECT_ID: "abc12345",
    PUBLIC_SANITY_DATASET: "production",
    PUBLIC_TURNSTILE_SITE_KEY: "0x4AAAAAAA-real-site-key",
  };
  assert.deepEqual(validateBuildConfig(real), []);
  for (const url of [
    "http://ngo.org",
    "https://localhost",
    "https://example.org",
    "https://review.pages.dev",
    "https://ngo.org/path",
    "https://user:pass@ngo.org",
    "https://127.0.0.1",
  ]) {
    assert.ok(
      validateBuildConfig({ ...real, PUBLIC_SITE_URL: url }).some((error) =>
        error.includes("PUBLIC_SITE_URL"),
      ),
    );
  }
  assert.ok(
    validateBuildConfig({
      ...real,
      PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
    }).some((error) => error.includes("TURNSTILE")),
  );
});

test("production content rejects unfinished markers and untranslated Khmer", async () => {
  const { contentFailures } = await import("../scripts/readiness.mjs");
  assert.deepEqual(
    contentFailures(
      '<html lang="km"><a hreflang="en" lang="en" href="/about/">EN</a></html>',
      '/km/about/',
    ),
    [],
  );
  assert.ok(contentFailures('<p>[NEEDS SKO]</p>', '/about/').length);
  assert.ok(contentFailures('<p>[PLACEHOLDER MAP]</p>', '/contact/').length);
  assert.ok(contentFailures('<h3>[EXAMPLE] A training day</h3>', '/activities/').length);
  assert.ok(contentFailures('<div>[LOGO]</div>', '/partners/').length);
  assert.ok(
    contentFailures('<html lang="km"><p lang="en">Fallback</p></html>', '/km/about/').length,
  );
});

test('production readiness requires approved contact inboxes', async () => {
  const { siteSettingsFailures } = await import('../scripts/readiness.mjs');
  assert.ok(siteSettingsFailures({}).length);
  assert.deepEqual(
    siteSettingsFailures({
      email: 'info@ngo.org',
      partnerEmail: 'partners@ngo.org',
    }),
    [],
  );
  assert.ok(
    siteSettingsFailures({
      email: 'info@example.com',
      partnerEmail: 'partners@ngo.org',
    }).length,
  );
  assert.ok(siteSettingsFailures({ email: 'info@ngo.org', partnerEmail: 'TBD' }).length);
});

test("explicit fixture previews do not query a configured CMS project", async () => {
  const source = await readFile(
    new URL("../src/lib/config.ts", import.meta.url),
    "utf8",
  );
  for (const [env, expected] of [
    [
      {
        PUBLIC_SANITY_PROJECT_ID: "abc12345",
        PUBLIC_CONTENT_SOURCE: "fixtures",
      },
      false,
    ],
    [
      { PUBLIC_SANITY_PROJECT_ID: "abc12345", PUBLIC_CONTENT_SOURCE: "sanity" },
      true,
    ],
    [{}, false],
  ]) {
    const compiled = ts.transpileModule(
      source.replaceAll("import.meta.env", JSON.stringify(env)),
      {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
        },
      },
    ).outputText;
    const config = await import(
      `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
    );
    assert.equal(config.hasSanity, expected);
  }
});

test("explicit local production content needs a real domain and disabled forms, but no CMS", async () => {
  const { validateBuildConfig } = await import("../scripts/readiness.mjs");
  const env = {
    PUBLIC_DEPLOYMENT_ENV: "production",
    PUBLIC_SITE_URL: "https://www.sko-samatapheapkhnom.org",
    PUBLIC_CONTENT_SOURCE: "fixtures",
    PUBLIC_CONTACT_ENABLED: "false",
  };
  assert.deepEqual(validateBuildConfig(env), []);
  assert.ok(validateBuildConfig({ ...env, PUBLIC_SITE_URL: "" }).length);
  assert.ok(
    validateBuildConfig({ ...env, PUBLIC_CONTACT_ENABLED: "true" }).length,
  );
  const source = await readFile(
    new URL("../src/lib/config.ts", import.meta.url),
    "utf8",
  );
  const compiled = ts.transpileModule(
    source.replaceAll(
      "import.meta.env",
      JSON.stringify({
        ...env,
        PUBLIC_DEPLOYMENT_ENV: "production",
      }),
    ),
    {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
      },
    },
  ).outputText;
  const config = await import(
    `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
  );
  assert.equal(config.hasSanity, false);
  assert.equal(config.contactEnabled, false);
  assert.equal(config.preventIndexing, true);
});

test('the marker check runs outside production, where the Khmer rule does not', async () => {
  const { markerFailures } = await import('../scripts/readiness.mjs');
  assert.deepEqual(markerFailures('<p>Finished copy.</p>'), []);
  assert.ok(markerFailures('<p>[STATIC MAP IMAGE → LINKS TO GOOGLE MAPS]</p>').length);
  assert.deepEqual(markerFailures('<html lang="km"><p lang="en">Fallback</p></html>'), []);
});
