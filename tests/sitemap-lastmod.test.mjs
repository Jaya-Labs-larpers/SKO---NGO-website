import assert from 'node:assert/strict';
import test from 'node:test';
import { editedDocuments, lastmodFor } from '../scripts/sitemap-lastmod.mjs';

const documents = [
  { _type: 'program', slug: 'hali', _updatedAt: '2026-09-20T00:00:00Z' },
  { _type: 'program', slug: 'migration', _updatedAt: '2026-09-22T00:00:00Z' },
  { _type: 'activity', slug: 'welcome', _updatedAt: '2026-09-18T00:00:00Z' },
  { _type: 'page', slug: 'about', _updatedAt: '2026-09-10T00:00:00Z' },
  { _type: 'partner', slug: null, _updatedAt: '2026-10-01T00:00:00Z' },
];

test('a detail page takes its own document edit, in either language', () => {
  assert.equal(lastmodFor('/programs/hali/', documents), '2026-09-20T00:00:00Z');
  assert.equal(lastmodFor('/km/programs/hali/', documents), '2026-09-20T00:00:00Z');
  assert.equal(lastmodFor('/activities/welcome/', documents), '2026-09-18T00:00:00Z');
});

test('a listing takes the newest document it lists', () => {
  assert.equal(lastmodFor('/programs/', documents), '2026-09-22T00:00:00Z');
  assert.equal(lastmodFor('/km/partners/', documents), '2026-10-01T00:00:00Z');
});

test('a CMS page takes its page document edit', () => {
  assert.equal(lastmodFor('/about/', documents), '2026-09-10T00:00:00Z');
});

test('home and pages without a document take the newest edit in the dataset', () => {
  assert.equal(lastmodFor('/', documents), '2026-10-01T00:00:00Z');
  assert.equal(lastmodFor('/km/', documents), '2026-10-01T00:00:00Z');
  assert.equal(lastmodFor('/contact/', documents), '2026-10-01T00:00:00Z');
  assert.equal(lastmodFor('/reports/', documents), '2026-10-01T00:00:00Z');
});

test('a fixtures build reads no edit dates', async () => {
  assert.equal(await editedDocuments({ PUBLIC_CONTENT_SOURCE: 'fixtures' }), null);
  assert.equal(await editedDocuments({}), null);
});
