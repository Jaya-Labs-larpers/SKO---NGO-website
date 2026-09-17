import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../functions/api/contact.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const { onRequest } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled.replace(/from ['"]zod['"]/, `from '${import.meta.resolve('zod')}'`)).toString('base64')}`
);
const valid = {
  name: 'Test Person',
  email: 'test@example.com',
  message: 'A legitimate enquiry with sufficient text.',
  'cf-turnstile-response': 'token',
};
const env = {
  TURNSTILE_SECRET_KEY: 'secret',
  RESEND_API_KEY: 'key',
  MAIL_FROM: 'website@example.com',
  CONTACT_TO_EMAIL: 'inbox@example.com',
  PARTNER_TO_EMAIL: 'partners@example.com',
};
const request = (body, headers = {}) =>
  new Request('https://website.test/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body,
  });

test('rejects oversized multibyte JSON before verification, without trusting declared length', async () => {
  for (const headers of [{}, { 'Content-Length': '1' }]) {
    const response = await onRequest({
      request: request(JSON.stringify({ ...valid, padding: 'ក'.repeat(12000) }), headers),
      env: {},
    });
    assert.equal(response.status, 413);
    assert.equal((await response.json()).error, 'payload_too_large');
  }
});

test('cancels a chunked oversized stream before buffering the remainder', async () => {
  let cancelled = false;
  let chunks = 0;
  const body = new ReadableStream({
    pull(controller) {
      if (chunks++ < 4) controller.enqueue(new Uint8Array(17000));
      else controller.close();
    },
    cancel() {
      cancelled = true;
    },
  });
  const req = new Request('https://website.test/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    duplex: 'half',
  });
  const response = await onRequest({ request: req, env: {} });
  assert.equal(response.status, 413);
  assert.equal(cancelled, true);
});

test('accepts the exact byte boundary and rejects one byte over', async () => {
  const base = JSON.stringify({
    ...valid,
    company_website: 'bot',
    padding: '',
  });
  const remaining = 32768 - Buffer.byteLength(base);
  for (const [size, status] of [
    [remaining, 200],
    [remaining + 1, 413],
  ]) {
    const response = await onRequest({
      request: request(base.replace('"padding":""', `"padding":"${'a'.repeat(size)}"`)),
      env: {},
    });
    assert.equal(response.status, status);
  }
});

test('verification network and JSON failures return controlled errors', async (t) => {
  for (const fetcher of [
    async () => {
      throw new Error('network');
    },
    async () => new Response('not JSON'),
  ]) {
    t.mock.method(globalThis, 'fetch', fetcher);
    const response = await onRequest({
      request: request(JSON.stringify(valid)),
      env,
    });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).error, 'verification_unavailable');
    t.mock.restoreAll();
  }
});

test('valid partner enquiry preserves routing, escaping and reply-to', async (t) => {
  let mail;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    if (String(url).includes('siteverify')) return Response.json({ success: true });
    mail = JSON.parse(options.body);
    return Response.json({ id: 'mail-id' });
  });
  const response = await onRequest({
    request: request(JSON.stringify({ ...valid, formType: 'partner', name: '<Test Person>' })),
    env,
  });
  assert.equal(response.status, 200);
  assert.deepEqual(mail.to, ['partners@example.com']);
  assert.equal(mail.reply_to, 'test@example.com');
  assert.match(mail.html, /&lt;Test Person&gt;/);
});

test('invalid JSON, media type, fields and methods preserve rejection contracts', async () => {
  for (const [req, status] of [
    [request('{'), 400],
    [request('{}', { 'Content-Type': 'text/plain' }), 415],
    [request('{}'), 400],
    [new Request('https://website.test/api/contact'), 405],
  ]) {
    assert.equal((await onRequest({ request: req, env: {} })).status, status);
  }
});

test('a stalled request is cancelled at the total body deadline', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let cancelled = false;
  const body = new ReadableStream({
    cancel() {
      cancelled = true;
    },
  });
  const req = new Request('https://website.test/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    duplex: 'half',
  });
  const pending = onRequest({ request: req, env: {} });
  t.mock.timers.tick(5000);
  const response = await pending;
  assert.equal(response.status, 408);
  assert.equal(cancelled, true);
});

test('production rejects test secrets and incomplete inbox/KV configuration before consuming a token', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => {
    assert.fail('misconfiguration must not call services');
  });
  const configured = {
    TURNSTILE_SECRET_KEY: '0x-test-secret-for-unit-test',
    RESEND_API_KEY: 're_unit_test',
    MAIL_FROM: 'SKO <website@ngo.org>',
    CONTACT_TO_EMAIL: 'info@ngo.org',
    PARTNER_TO_EMAIL: 'partners@ngo.org',
    RATE_LIMIT_KV: { get: async () => '0', put: async () => {} },
  };
  for (const production of [
    {
      ...configured,
      TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
    },
    { ...configured, PARTNER_TO_EMAIL: '' },
    { ...configured, MAIL_FROM: 'noreply@example.org' },
    { ...configured, RATE_LIMIT_KV: undefined },
  ]) {
    const response = await onRequest({
      request: request(JSON.stringify(valid)),
      env: { ...production, PUBLIC_DEPLOYMENT_ENV: 'production' },
    });
    assert.equal(response.status, 500);
    assert.equal((await response.json()).error, 'not_configured');
  }
});

test('complete production settings preserve valid general enquiry delivery', async (t) => {
  let mail;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    if (String(url).includes('siteverify')) return Response.json({ success: true });
    assert.ok(options.signal instanceof AbortSignal);
    mail = JSON.parse(options.body);
    return Response.json({ id: 'mail-id' });
  });
  const configured = {
    PUBLIC_DEPLOYMENT_ENV: 'production',
    TURNSTILE_SECRET_KEY: '0x-test-secret-for-unit-test',
    RESEND_API_KEY: 're_unit_test',
    MAIL_FROM: 'SKO <website@ngo.org>',
    CONTACT_TO_EMAIL: 'info@ngo.org',
    PARTNER_TO_EMAIL: 'partners@ngo.org',
    RATE_LIMIT_KV: { get: async () => '0', put: async () => {} },
  };
  const response = await onRequest({
    request: request(JSON.stringify(valid)),
    env: configured,
  });
  assert.equal(response.status, 200);
  assert.deepEqual(mail.to, ['info@ngo.org']);
});

test('service requests have abort deadlines and verification rejection does not send mail', async (t) => {
  let sent = false;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.ok(options.signal instanceof AbortSignal);
    if (String(url).includes('siteverify')) return Response.json({ success: false });
    sent = true;
    return Response.json({ id: 'mail-id' });
  });
  assert.equal((await onRequest({ request: request(JSON.stringify(valid)), env })).status, 403);
  assert.equal(sent, false);
});

test('stalled KV reads and writes fail open within a deadline', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  // Turnstile must pass: the KV write only happens for verified submissions.
  t.mock.method(globalThis, 'fetch', async () => Response.json({ success: true, id: 'mail-id' }));
  for (const stalled of ['get', 'put']) {
    const kv = { get: async () => '0', put: async () => {} };
    let stalls = 0;
    kv[stalled] = () => {
      stalls += 1;
      return new Promise(() => {});
    };
    let settled = false;
    const pending = onRequest({
      request: request(JSON.stringify(valid)),
      env: { ...env, RATE_LIMIT_KV: kv },
    }).finally(() => {
      settled = true;
    });
    // Every stalled call (the check read, then the record read/write) is
    // released only by its deadline, never by the stall resolving.
    let released = 0;
    while (!settled) {
      if (stalls > released) {
        released = stalls;
        t.mock.timers.tick(1000);
      }
      await new Promise((resolve) => setImmediate(resolve));
    }
    assert.ok(stalls >= 1);
    assert.equal((await pending).status, 200);
  }
});

test('rate-limit quota is consumed only by Turnstile-verified submissions', async (t) => {
  const store = new Map();
  const kv = {
    get: async (key) => store.get(key) ?? null,
    put: async (key, value) => {
      store.set(key, value);
    },
  };
  let verified = false;
  t.mock.method(globalThis, 'fetch', async (url) => {
    if (String(url).includes('siteverify')) return Response.json({ success: verified });
    return Response.json({ id: 'mail-id' });
  });
  const withKv = { ...env, RATE_LIMIT_KV: kv };

  // Unverified requests (missing or rejected token) must not touch the counter.
  const { 'cf-turnstile-response': _token, ...noToken } = valid;
  assert.equal((await onRequest({ request: request(JSON.stringify(noToken)), env: withKv })).status, 403);
  assert.equal((await onRequest({ request: request(JSON.stringify(valid)), env: withKv })).status, 403);
  assert.equal(store.size, 0);

  verified = true;
  for (let i = 0; i < 5; i += 1) {
    assert.equal((await onRequest({ request: request(JSON.stringify(valid)), env: withKv })).status, 200);
  }
  assert.deepEqual([...store.values()], ['5']);
  const limited = await onRequest({ request: request(JSON.stringify(valid)), env: withKv });
  assert.equal(limited.status, 429);
  assert.equal((await limited.json()).error, 'rate_limited');
});

test('rate-limit keys use a fixed window so a burst cannot extend its own expiry', async (t) => {
  const puts = [];
  const kv = {
    get: async () => null,
    put: async (key, value, options) => {
      puts.push({ key, ttl: options?.expirationTtl });
    },
  };
  t.mock.method(globalThis, 'fetch', async (url) =>
    Response.json(String(url).includes('siteverify') ? { success: true } : { id: 'mail-id' }),
  );
  const at = (ms) => {
    t.mock.method(Date, 'now', () => ms);
    return onRequest({ request: request(JSON.stringify(valid)), env: { ...env, RATE_LIMIT_KV: kv } });
  };
  const base = 1667 * 600 * 1000; // start of a 600-second window
  await at(base + 30_000); // 30s into the window
  await at(base + 599_000); // 599s into the same window
  await at(base + 600_000); // first second of the next window
  assert.equal(puts[0].key, puts[1].key);
  assert.notEqual(puts[1].key, puts[2].key);
  assert.equal(puts[0].ttl, 570);
  assert.equal(puts[1].ttl, 60); // clamped to KV's 60-second minimum
  assert.equal(puts[2].ttl, 600);
});
