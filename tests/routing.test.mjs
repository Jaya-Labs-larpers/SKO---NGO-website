import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('Vercel resolves real files before localized 404 fallbacks', async () => {
  const { routes } = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  const filesystem = routes.findIndex((route) => route.handle === 'filesystem');
  assert.ok(filesystem >= 0);
  const fallbacks = routes.slice(filesystem + 1);
  for (const [path, destination] of [['/km/missing/', '/km/404/index.html'], ['/km', '/km/404/index.html'], ['/missing/', '/404.html']]) {
    const route = fallbacks.find((candidate) => new RegExp(`^${candidate.src}$`).test(path));
    assert.equal(route.dest, destination);
    assert.equal(route.status, 404);
  }
});
