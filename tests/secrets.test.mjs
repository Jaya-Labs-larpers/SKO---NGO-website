import assert from "node:assert/strict";
import test from "node:test";
import {
  findEnvLeaks,
  findSecrets,
  redact,
  secretEnvEntries,
} from "../scripts/secrets.mjs";

// Synthetic — shaped like the real thing, usable as nothing.
const RESEND = "re_" + "A1b2C3d4".repeat(4);
const SANITY = "sk" + "x9Y8z7W6".repeat(8);
const JWT =
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.abcdefghijklmnopqrstuvwxyz0123";

test("known token shapes are detected and reported redacted", () => {
  const html = `<script>fetch("/api",{headers:{Authorization:"Bearer ${RESEND}"}})</script>`;
  const found = findSecrets(html);
  assert.equal(found.length, 1);
  assert.equal(found[0].rule, "Resend API key");
  assert.ok(
    !found[0].match.includes(RESEND.slice(4)),
    "report must not contain the secret",
  );
  assert.equal(findSecrets(`token=${SANITY}`)[0].rule, "Sanity token");
  assert.equal(findSecrets(`const t = "${JWT}"`)[0].rule, "JWT");
  assert.equal(
    findSecrets("-----BEGIN RSA PRIVATE KEY-----")[0].rule,
    "Private key",
  );
});

test("ordinary build output does not trip the patterns", () => {
  const clean = `
    <meta http-equiv="Content-Security-Policy" content="script-src 'sha256-abc123='">
    <script src="/_astro/hoisted.Bskq3Xz1.js" type="module"></script>
    <img src="https://cdn.sanity.io/images/abc12345/production/skyline-1200x800.jpg">
    <div data-sitekey="1x00000000000000000000AA"></div>
  `;
  assert.deepEqual(findSecrets(clean), []);
});

test("only secret-looking, non-public, non-placeholder env vars are tracked", () => {
  const entries = secretEnvEntries({
    TURNSTILE_SECRET_KEY: "0x4AAAAAAA" + "realsecretvalue1234",
    RESEND_API_KEY: RESEND,
    PUBLIC_TURNSTILE_SITE_KEY: "0x4AAAAAAA-public-site-key",
    PUBLIC_CF_ANALYTICS_TOKEN: "a".repeat(32),
    CONTACT_ENABLED: "true",
    MAIL_FROM: "noreply@example.org",
    PATH: "/usr/local/bin:/usr/bin",
    TEST_TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA",
    SHORT_TOKEN: "abc",
  });
  assert.deepEqual(entries.map(([key]) => key).sort(), [
    "RESEND_API_KEY",
    "TURNSTILE_SECRET_KEY",
  ]);
});

test("a server-only value that reaches the build is named by its variable", () => {
  const entries = secretEnvEntries({
    RESEND_API_KEY: RESEND,
    TURNSTILE_SECRET_KEY: "x".repeat(30),
  });
  const bundle = `const key="${RESEND}";export{key}`;
  assert.deepEqual(findEnvLeaks(bundle, entries), ["RESEND_API_KEY"]);
  assert.deepEqual(findEnvLeaks("nothing here", entries), []);
});

test("redact keeps a recognisable prefix and the length only", () => {
  assert.equal(redact(RESEND), `re_A…(${RESEND.length} chars)`);
});
