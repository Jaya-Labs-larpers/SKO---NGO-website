import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import { siteSettingsFailures } from '../scripts/readiness.mjs';

const source = await readFile(new URL('../src/lib/content/index.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;

function content(production, result) {
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    require(path) {
      if (path === '../sanity/client') return { sanityClient: { fetch: async () => result } };
      if (path === '../sanity/queries') return { directorMessageQuery: 'directorMessage' };
      if (path === './fixtures') return { directorMessage: { name: { en: 'Fixture director' } } };
      if (path === '../config') return { isProductionDeployment: production };
      if (path === '../../../scripts/readiness.mjs') return { siteSettingsFailures };
      throw new Error(`Unexpected import ${path}`);
    },
  });
  return exports;
}

test('missing published singleton cannot silently use fixture content in production', async () => {
  await assert.rejects(
    content(true, null).getDirectorMessage(),
    /Required published CMS document is missing/,
  );
  const preview = await content(false, null).getDirectorMessage();
  assert.equal(preview.name.en, 'Fixture director');
  const published = await content(true, {
    name: { en: 'Approved director', km: 'នាយក' },
  }).getDirectorMessage();
  assert.equal(published.name.en, 'Approved director');
});
