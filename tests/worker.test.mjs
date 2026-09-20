import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const compile = (source) =>
  ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
const dataUrl = (code) =>
  `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;

const core = compile(
  await readFile(
    new URL("../functions/api/contact.ts", import.meta.url),
    "utf8",
  ),
).replace(/from ['"]zod['"]/, `from '${import.meta.resolve("zod")}'`);
const worker = compile(
  await readFile(new URL("../worker/index.ts", import.meta.url), "utf8"),
).replace(
  /from ['"]\.\.\/functions\/api\/contact(?:\.ts|\.js)?['"]/,
  `from '${dataUrl(core)}'`,
);
const { default: handler } = await import(dataUrl(worker));

const assets = {
  calls: [],
  async fetch(request) {
    this.calls.push(new URL(request.url).pathname);
    return new Response("asset", { status: 200 });
  },
};
const env = (overrides = {}) => ({
  ASSETS: assets,
  PUBLIC_DEPLOYMENT_ENV: "preview",
  CONTACT_ENABLED: "false",
  ...overrides,
});
const request = (path, init = {}) =>
  new Request(`https://sko-website.example.workers.dev${path}`, init);

test("everything outside /api/ is handed to static assets untouched", async () => {
  assets.calls.length = 0;
  for (const path of ["/", "/km/about/", "/_astro/x.css", "/km/missing/"]) {
    const response = await handler.fetch(request(path), env());
    assert.equal(await response.text(), "asset");
  }
  assert.deepEqual(assets.calls, [
    "/",
    "/km/about/",
    "/_astro/x.css",
    "/km/missing/",
  ]);
});

test("unknown /api/ paths are a JSON 404, never an asset lookup", async () => {
  assets.calls.length = 0;
  const response = await handler.fetch(request("/api/anything"), env());
  assert.equal(response.status, 404);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.equal(assets.calls.length, 0);
});

test("contact endpoint answers GET with 405 and both slash forms", async () => {
  for (const path of ["/api/contact", "/api/contact/"]) {
    const response = await handler.fetch(request(path), env());
    assert.equal(response.status, 405);
    assert.equal(response.headers.get("Allow"), "POST");
    assert.equal(response.headers.get("Cache-Control"), "no-store");
  }
});

test("disabled contact rejects POST before reading the body or contacting any service", async (t) => {
  t.mock.method(globalThis, "fetch", () => {
    throw new Error("No service calls allowed");
  });
  const disabled = request("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: '{"name":"x"}',
  });
  const response = await handler.fetch(
    disabled,
    env({ CONTACT_ENABLED: undefined }),
  );
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error, "preview_disabled");
  assert.equal(disabled.bodyUsed, false);
  const off = await handler.fetch(
    request("/api/contact", { method: "POST", body: "{}" }),
    env({ CONTACT_ENABLED: "no" }),
  );
  assert.equal(off.status, 503);
});

test("enabled contact keeps byte limits and takes the client IP from Cloudflare", async (t) => {
  let verifiedIp;
  t.mock.method(globalThis, "fetch", async (url, options) => {
    if (String(url).includes("siteverify")) {
      verifiedIp = options.body.get("remoteip");
      return Response.json({ success: true });
    }
    return new Response("{}");
  });
  const enabled = env({
    CONTACT_ENABLED: "true",
    TURNSTILE_SECRET_KEY: "secret",
    RESEND_API_KEY: "key",
    MAIL_FROM: "sender@example.com",
    CONTACT_TO_EMAIL: "inbox@example.com",
    RATE_LIMIT_KV: { get: async () => "0", put: async () => {} },
  });
  const payload = {
    name: "Reviewer",
    email: "review@example.com",
    message: "A legitimate test message.",
    "cf-turnstile-response": "token",
  };
  const post = (body) =>
    request("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CF-Connecting-IP": "192.0.2.99",
        "x-forwarded-for": "198.51.100.7",
      },
      body,
    });
  assert.equal(
    (
      await handler.fetch(
        post(JSON.stringify({ ...payload, padding: "ក".repeat(12000) })),
        enabled,
      )
    ).status,
    413,
  );
  assert.equal(
    (await handler.fetch(post(JSON.stringify(payload)), enabled)).status,
    200,
  );
  assert.equal(verifiedIp, "192.0.2.99");
});
