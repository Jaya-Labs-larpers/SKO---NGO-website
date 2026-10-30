import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('a production build with no donation details switches Donate off instead of failing', () => {
  const lib = read('src/lib/donation.ts');
  assert.match(
    lib,
    /export const donationEnabled = donation !== null \|\| !isProductionDeployment/,
  );
  assert.doesNotMatch(lib, /throw new Error\(\s*"\[donate\] src\/config\/donation\.ts is empty/);
});

test('invalid real donation details still fail the build', () => {
  assert.match(read('src/lib/donation.ts'), /failed validation/);
});

test('every Donate entry point is behind donationEnabled', () => {
  for (const route of ['src/pages/[donate].astro', 'src/pages/km/[donate].astro'])
    assert.match(
      read(route),
      /donationEnabled \? \[\{ params: \{ donate: 'donate' \} \}\] : \[\]/,
      route,
    );
  assert.match(
    read('src/pages/khqr/[currency].png.ts'),
    /donationEnabled \? donationDetails\.accounts : \[\]/,
  );
  const header = read('src/components/layout/Header.astro');
  assert.equal(
    (header.match(/donationEnabled &&/g) ?? []).length,
    2,
    'desktop and phone Donate links',
  );
  assert.match(read('src/pages/llms.txt.ts'), /donationEnabled\s*\?/);
});
