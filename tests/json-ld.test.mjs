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

test('a Khmer page never takes its search title or description from the English override', async () => {
  const { build } = await import('esbuild');
  const bundle = await build({
    entryPoints: [new URL('../src/lib/seo.ts', import.meta.url).pathname],
    bundle: true,
    format: 'cjs',
    platform: 'node',
    write: false,
    logLevel: 'silent',
  });
  const module = { exports: {} };
  vm.runInNewContext(bundle.outputFiles[0].text, { module, exports: module.exports });
  const { resolveSeo } = module.exports;
  const seo = { title: { en: 'English override' }, description: { en: 'English description' } };
  const fallback = { title: 'ការងាររបស់យើង', description: 'សេចក្តីពិពណ៌នា' };

  const km = resolveSeo(seo, 'km', fallback);
  assert.equal(km.title, fallback.title);
  assert.equal(km.description, fallback.description);

  const en = resolveSeo(seo, 'en', { title: 'Fallback' });
  assert.equal(en.title, 'English override');
  assert.equal(en.description, 'English description');

  const withKm = resolveSeo({ title: { en: 'A', km: 'ខ' } }, 'km', { title: 'F' });
  assert.equal(withKm.title, 'ខ');
});
