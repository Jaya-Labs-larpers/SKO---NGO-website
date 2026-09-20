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
    // Vercel sets VERCEL_ENV=production during production builds; pin preview so
    // the fixture secrets below are not rejected by productionConfigured().
    VERCEL_ENV: "preview",
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

/** Set process.env for one test and restore it afterwards. */
function withEnv(t, settings) {
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
}

const productionSettings = {
  VERCEL_ENV: "production",
  CONTACT_ENABLED: "true",
  TURNSTILE_SECRET_KEY: "0x-test-secret-for-unit-test",
  RESEND_API_KEY: "re_unit_test",
  MAIL_FROM: "SKO <website@ngo.org>",
  CONTACT_TO_EMAIL: "info@ngo.org",
  PARTNER_TO_EMAIL: "partners@ngo.org",
};

const validPayload = {
  name: "Reviewer",
  email: "review@example.com",
  message: "A legitimate test message.",
  "cf-turnstile-response": "token",
};

const requestFrom = (ip, body = JSON.stringify(validPayload)) =>
  new Request("https://sko.vercel.app/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-vercel-forwarded-for": ip,
    },
    body,
  });

test("Vercel production refuses submissions until the WAF rate limit is attested", async (t) => {
  const api = await loadApi();
  withEnv(t, { ...productionSettings, CONTACT_WAF_RATE_LIMIT_ENABLED: "false" });
  t.mock.method(globalThis, "fetch", () => {
    throw new Error("misconfiguration must not call services");
  });
  const response = await api.fetch(requestFrom("192.0.2.10"));
  assert.equal(response.status, 500);
  assert.equal((await response.json()).error, "not_configured");
  assert.equal(response.headers.get("Cache-Control"), "no-store");
});

test("Vercel production with the WAF attested delivers mail", async (t) => {
  const api = await loadApi();
  withEnv(t, { ...productionSettings, CONTACT_WAF_RATE_LIMIT_ENABLED: "true" });
  let mail;
  t.mock.method(globalThis, "fetch", async (url, options) => {
    if (String(url).includes("siteverify")) return Response.json({ success: true });
    mail = JSON.parse(options.body);
    return Response.json({ id: "mail-id" });
  });
  const response = await api.fetch(requestFrom("192.0.2.11"));
  assert.equal(response.status, 200);
  assert.deepEqual(mail.to, ["info@ngo.org"]);
});

test("the in-memory store limits a warm instance to five verified submissions per window", async (t) => {
  const api = await loadApi();
  withEnv(t, { ...productionSettings, CONTACT_WAF_RATE_LIMIT_ENABLED: "true" });
  let sent = 0;
  t.mock.method(globalThis, "fetch", async (url) => {
    if (String(url).includes("siteverify")) return Response.json({ success: true });
    sent += 1;
    return Response.json({ id: "mail-id" });
  });
  const statuses = [];
  for (let i = 0; i < 6; i += 1) {
    statuses.push((await api.fetch(requestFrom("192.0.2.50"))).status);
  }
  assert.deepEqual(statuses, [200, 200, 200, 200, 200, 429]);
  assert.equal(sent, 5, "the sixth attempt never reaches Resend");
  // A different address is not affected by the first one's quota.
  assert.equal((await api.fetch(requestFrom("192.0.2.51"))).status, 200);
});
