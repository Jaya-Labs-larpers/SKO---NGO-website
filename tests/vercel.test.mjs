import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import { deploymentEnvironment } from "../scripts/readiness.mjs";

async function loadApi() {
  const compile = (source) =>
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText;
  const core = compile(
    await readFile(
      new URL("../functions/api/contact.ts", import.meta.url),
      "utf8",
    ),
  ).replace(/from ['"]zod['"]/, `from '${import.meta.resolve("zod")}'`);
  const coreUrl = `data:text/javascript;base64,${Buffer.from(core).toString("base64")}`;
  const source = await readFile(
    new URL("../api/contact.ts", import.meta.url),
    "utf8",
  ).catch(() => "export default {};");
  return (
    await import(
      `data:text/javascript;base64,${Buffer.from(compile(source).replace(/from ['"]\.\.\/functions\/api\/contact(?:\.ts|\.js)?['"]/, `from '${coreUrl}'`)).toString("base64")}`
    )
  ).default;
}

test("Vercel environment cannot silently become development or override production", () => {
  assert.equal(deploymentEnvironment({ VERCEL_ENV: "preview" }), "preview");
  assert.equal(
    deploymentEnvironment({ VERCEL_ENV: "production" }),
    "production",
  );
  assert.throws(() =>
    deploymentEnvironment({
      VERCEL_ENV: "production",
      PUBLIC_DEPLOYMENT_ENV: "preview",
    }),
  );
});

test("Vercel preview API rejects submissions without reading bodies or contacting services", async (t) => {
  const api = await loadApi();
  assert.equal(typeof api.fetch, "function");
  t.mock.method(globalThis, "fetch", () => {
    throw new Error("No service calls allowed");
  });
  const response = await api.fetch(
    new Request("https://review.vercel.app/api/contact", {
      method: "POST",
      body: "not JSON",
    }),
  );
  assert.equal(response.status, 503);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.equal((await response.json()).error, "preview_disabled");
  assert.equal(
    (await api.fetch(new Request("https://review.vercel.app/api/contact")))
      .status,
    405,
  );
});

test("enabled Vercel contact preserves byte limits and ignores forged Cloudflare IPs", async (t) => {
  const api = await loadApi();
  assert.equal(typeof api.fetch, "function");
  const settings = {
    CONTACT_ENABLED: "true",
    TURNSTILE_SECRET_KEY: "secret",
    RESEND_API_KEY: "key",
    MAIL_FROM: "sender@example.com",
    CONTACT_TO_EMAIL: "inbox@example.com",
  };
  const previous = Object.fromEntries(
    Object.keys(settings).map((key) => [key, process.env[key]]),
  );
  Object.assign(process.env, settings);
  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
  let verifiedIp;
  t.mock.method(globalThis, "fetch", async (url, options) => {
    if (String(url).includes("siteverify")) {
      verifiedIp = options.body.get("remoteip");
      return Response.json({ success: true });
    }
    return new Response("{}");
  });
  const payload = {
    name: "Reviewer",
    email: "review@example.com",
    message: "A legitimate test message.",
    "cf-turnstile-response": "token",
  };
  const request = (body) =>
    new Request("https://review.vercel.app/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CF-Connecting-IP": "192.0.2.99",
        "x-vercel-forwarded-for": "192.0.2.4",
      },
      body,
    });
  assert.equal(
    (
      await api.fetch(
        request(JSON.stringify({ ...payload, padding: "ក".repeat(12000) })),
      )
    ).status,
    413,
  );
  assert.equal((await api.fetch(request(JSON.stringify(payload)))).status, 200);
  assert.equal(verifiedIp, "192.0.2.4");
});

test("preview forms default to disabled even when a Turnstile key exists", async () => {
  const source = await readFile(
    new URL("../src/lib/config.ts", import.meta.url),
    "utf8",
  );
  const compiled = ts.transpileModule(
    source.replaceAll(
      "import.meta.env",
      JSON.stringify({
        PUBLIC_DEPLOYMENT_ENV: "preview",
        PUBLIC_TURNSTILE_SITE_KEY: "test-key",
      }),
    ),
    {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText;
  const config = await import(
    `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
  );
  assert.equal(config.contactEnabled, false);
});
