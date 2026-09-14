import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

for (const component of ['seo/SeoHead', 'content/FaqSection', 'layout/Breadcrumbs']) {
  test(`${component} keeps CMS values inside every JSON-LD script`, async () => {
    const source = await readFile(new URL(`../src/components/${component}.astro`, import.meta.url), 'utf8');
    const context = { JSON };
    if (source.includes('serializeJsonLd')) {
      const helper = await readFile(new URL('../src/lib/seo/json-ld.ts', import.meta.url), 'utf8');
      const exports = {};
      vm.runInNewContext(ts.transpileModule(helper, {
        compilerOptions: { module: ts.ModuleKind.CommonJS },
      }).outputText, { exports });
      context.serializeJsonLd = exports.serializeJsonLd;
    }
    const value = { headline: '</ScRiPt ><script>alert(1)</script>', nested: ['ខ្មែរ', '<img src=x>', '&', '\\u003c'] };
    for (const expression of source.matchAll(/set:html=\{([^}]+)\}/g)) {
      const argument = expression[1].match(/\((\w+)\)/)?.[1];
      assert.ok(argument, 'JSON-LD expression has a value');
      context[argument] = value;
      const serialized = vm.runInNewContext(expression[1], context);
      assert.equal(serialized.includes('<'), false, 'script raw text cannot contain HTML delimiters');
      assert.deepEqual(JSON.parse(serialized), value);
    }
    assert.ok([...source.matchAll(/set:html=\{([^}]+)\}/g)].length);
  });
}
