/**
 * Turns the local fixtures into an NDJSON import for an empty Sanity dataset, so
 * the site reads the same content from the CMS that it builds from fixtures.
 *
 *   node scripts/sanity-seed.mjs > /tmp/sko-seed.ndjson
 *   cd studio && npx sanity datasets import /tmp/sko-seed.ndjson --dataset production
 *
 * The import runs as whoever is logged in to the Sanity CLI; no token is created
 * or stored (ADR-004). It refuses to overwrite a document that already exists,
 * so it cannot clobber staff edits — pass --replace to the import only to redo
 * a seed nobody has edited yet.
 *
 * Photos committed under public/images are uploaded at their largest rendition.
 * [NEEDS SKO] and [EXAMPLE] markers are copied as they are: the content layer
 * strips them on read, and in the Studio they show staff what is still to write.
 */

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const ROOT = path.resolve(import.meta.dirname, '..');

// fixtures.ts reads import.meta.env (via src/lib/config.ts) and imports JSON
// without an import attribute, so bundle it rather than import it directly.
const bundle = await build({
  entryPoints: [path.join(ROOT, 'src/lib/content/fixtures.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
  logLevel: 'error',
  define: { 'import.meta.env': '{}' },
});
const fixtures = await import(
  `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`
);
const localImages = (await import(pathToFileURL(path.join(ROOT, 'src/lib/content/local-images.json')), {
  with: { type: 'json' },
})).default;

/* --- Shapes ---------------------------------------------------------------- */

/** Drops null and undefined recursively; Sanity stores an unset field as absent. */
function clean(value) {
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, v]) => v !== null && v !== undefined)
        .map(([k, v]) => [k, clean(v)]),
    );
  }
  return value;
}

const keyed = (items, type, prefix) =>
  items?.map((item, index) => ({ _key: `${prefix}${index}`, ...(type ? { _type: type } : {}), ...item }));

const reference = (id) => ({ _type: 'reference', _ref: id });

const slug = (current) => ({ _type: 'slug', current });

function image(value) {
  if (!value?.asset?._id) return undefined;
  const id = value.asset._id;
  if (!id.startsWith('local:')) throw new Error(`[seed] Not a local image: ${id}`);
  const name = id.slice('local:'.length);
  const meta = localImages[name];
  if (!meta) throw new Error(`[seed] No local image named "${name}"`);
  const file = path.join(ROOT, 'public/images', `${name}-${meta.widths.at(-1)}.webp`);
  return {
    _type: 'imageWithAlt',
    _sanityAsset: `image@${pathToFileURL(file).href}`,
    alt: value.alt,
    caption: value.caption,
  };
}

function blocks(value) {
  if (!value) return undefined;
  const lang = (list) =>
    list?.length
      ? list.map((block) =>
          block._type === 'block'
            ? {
                markDefs: [],
                ...block,
                children: block.children?.map((span, index) => ({ _key: `s${index}`, marks: [], ...span })),
              }
            : block,
        )
      : undefined;
  return { en: lang(value.en), km: lang(value.km) };
}

const programIdBySlug = new Map(fixtures.programs.map((program) => [program.slug, program._id]));
function programRef(value) {
  if (!value) return undefined;
  const id = programIdBySlug.get(value.slug);
  if (!id) throw new Error(`[seed] No program with slug "${value.slug}"`);
  return reference(id);
}

const faqs = (items) => keyed(items, 'faqItem', 'faq');

/* --- Documents ------------------------------------------------------------- */

const docs = [];
const s = fixtures.siteSettings;

docs.push({
  _id: 'siteSettings',
  _type: 'siteSettings',
  ...s,
  logo: image(s.logo),
  ogImage: image(s.ogImage),
  homeHero: s.homeHero?.map((hero, index) => ({ _key: `hero${index}`, ...image(hero) })),
  socials: keyed(s.socials, 'socialLink', 'social'),
  donationFaqs: faqs(s.donationFaqs),
  donation: s.donation && {
    qrCodes: keyed(
      s.donation.qrCodes?.map((qr) => ({ ...qr, image: image(qr.image) })),
      'donationQr',
      'qr',
    ),
    bankAccounts: keyed(s.donation.bankAccounts, 'bankAccount', 'bank'),
    allocation: keyed(s.donation.allocation, 'allocationItem', 'alloc'),
    note: blocks(s.donation.note),
  },
  footerNote: blocks(s.footerNote),
});

for (const stat of fixtures.impactStats) docs.push({ _type: 'impactStat', ...stat });

for (const program of fixtures.programs) {
  for (const stat of program.impactStats ?? []) docs.push({ _type: 'impactStat', ...stat });
  docs.push({
    _type: 'program',
    ...program,
    slug: slug(program.slug),
    body: blocks(program.body),
    image: image(program.image),
    cardImage: image(program.cardImage),
    impactStats: program.impactStats?.map((stat) => ({ _key: stat._id, ...reference(stat._id) })),
  });
}

for (const activity of fixtures.activities) {
  docs.push({
    _type: 'activity',
    ...activity,
    slug: slug(activity.slug),
    publishedAt: activity.publishedAt && new Date(activity.publishedAt).toISOString(),
    body: blocks(activity.body),
    coverImage: image(activity.coverImage),
    program: programRef(activity.program),
  });
}

for (const story of fixtures.stories) {
  docs.push({
    _type: 'story',
    ...story,
    body: blocks(story.body),
    photo: image(story.photo),
    program: programRef(story.program),
    // The fixtures publish every story; in Sanity only a consented one is shown.
    // Each fixture story is already live on the site, from SKO's signed-off copy.
    consentConfirmed: true,
  });
}

for (const partner of fixtures.partners) docs.push({ _type: 'partner', ...partner, logo: image(partner.logo) });

for (const report of fixtures.reports) {
  const { file, fileKm, ...rest } = report;
  if (fileKm?.url) throw new Error(`[seed] ${report._id}: a Khmer file needs uploading by hand`);
  docs.push({ _type: 'report', ...rest, link: file?.url });
}

for (const member of fixtures.team) {
  docs.push({
    _type: 'teamMember',
    ...member,
    photo: image(member.photo),
    reportsTo: member.reportsTo ? reference(member.reportsTo) : undefined,
  });
}

const d = fixtures.directorMessage;
docs.push({
  _id: 'directorMessage',
  _type: 'directorMessage',
  ...d,
  photo: image(d.photo),
  signature: image(d.signature),
  message: blocks(d.message),
});

const o = fixtures.orgChart;
docs.push({ _id: 'orgChart', _type: 'orgChart', ...o, image: image(o.image), textVersion: blocks(o.textVersion) });

for (const page of fixtures.pages) {
  docs.push({
    _type: 'page',
    ...page,
    slug: slug(page.slug),
    heroImage: image(page.heroImage),
    body: blocks(page.body),
    faqs: faqs(page.faqs),
    seo: page.seo && { ...page.seo, image: image(page.seo.image) },
  });
}

const ids = new Set();
for (const doc of docs) {
  if (!doc._id) throw new Error(`[seed] A ${doc._type} has no _id`);
  if (ids.has(doc._id)) throw new Error(`[seed] Duplicate _id "${doc._id}"`);
  ids.add(doc._id);
}

process.stdout.write(docs.map((doc) => JSON.stringify(clean(doc))).join('\n') + '\n');
console.error(`[seed] ${docs.length} documents`);
