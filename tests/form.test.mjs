import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const component = await readFile(
  new URL('../src/components/forms/ContactForm.astro', import.meta.url),
  'utf8',
);
const script = component.match(/<script>([\s\S]*?)<\/script>/)[1];
const compiled = ts.transpileModule(script, {
  compilerOptions: { target: ts.ScriptTarget.ES2022 },
}).outputText;

for (const outcome of ['network', 'fields', 'success']) {
  test(`resets only the submitted widget after ${outcome}, and bounds the request`, async () => {
    let handler;
    const resets = [];
    let cleared = 0;
    let options;
    const submit = {};
    const status = {};
    const target = { classList: { remove() {}, add() {} }, setAttribute() {} };
    const form = {
      id: 'form-partner',
      dataset: { formType: 'partner', fallbackEmail: 'x"><img/src=x>foo@ngo.org' },
      querySelector(selector) {
        if (selector === '[data-submit]') return submit;
        if (selector === '[data-status]') return status;
        if (selector === '.cf-turnstile') return { id: 'form-partner-turnstile' };
        if (selector.includes('aria-invalid')) return null;
        if (selector.includes('organization')) return null;
        return target;
      },
      querySelectorAll() {
        return [];
      },
      addEventListener(_, callback) {
        handler = callback;
      },
      reset() {
        cleared++;
      },
    };
    class FakeFormData extends FormData {
      constructor() {
        super();
        this.set('name', 'Test Person');
        this.set('email', 'person@example.com');
        this.set('message', 'A legitimate enquiry long enough to submit.');
      }
    }
    vm.runInNewContext(compiled, {
      document: { querySelectorAll: () => [form] },
      FormData: FakeFormData,
      window: { turnstile: { reset: (widget) => resets.push(widget) } },
      AbortController,
      AbortSignal,
      setTimeout,
      clearTimeout,
      fetch: async (_, init) => {
        options = init;
        if (outcome === 'network') throw new Error('network');
        return Response.json(outcome === 'fields' ? { fieldErrors: { name: 'too_short' } } : { ok: true }, {
          status: outcome === 'fields' ? 400 : 200,
        });
      },
    });
    await handler({ preventDefault() {} });
    assert.ok(options.signal instanceof AbortSignal);
    assert.deepEqual(resets, ['#form-partner-turnstile']);
    assert.equal(submit.disabled, false);
    assert.equal(cleared, outcome === 'success' ? 1 : 0);
    if (outcome === 'network') {
      assert.equal(status.innerHTML.includes('<img'), false);
      assert.ok(status.innerHTML.includes('&lt;img/src=x&gt;'));
      assert.ok(status.innerHTML.includes('mailto:x%22%3E%3Cimg%2Fsrc%3Dx%3Efoo%40ngo.org'));
    }
  });
}
