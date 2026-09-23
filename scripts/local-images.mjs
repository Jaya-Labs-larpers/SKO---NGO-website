/**
 * Turns a folder of source photos into the responsive WebP set the site serves
 * while there is no Sanity project to transform images at its CDN.
 *
 *   node scripts/local-images.mjs <source-folder>
 *
 * Each file becomes public/images/<name>-<width>.webp at every srcset width up
 * to its own, and an entry in src/lib/content/local-images.json with its
 * dimensions and a blur-up LQIP. <name> is the file's basename, so the source
 * folder's file names are the ids the fixtures refer to.
 */

import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const WIDTHS = [400, 640, 828, 1200, 1600];
const OUT_DIR = 'public/images';
const MANIFEST = 'src/lib/content/local-images.json';

const source = process.argv[2];
if (!source) {
  console.error('Usage: node scripts/local-images.mjs <source-folder>');
  process.exit(1);
}

await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR, { recursive: true });

const manifest = {};
const files = (await readdir(source)).filter((file) => /\.(jpe?g|png|webp)$/i.test(file)).sort();

for (const file of files) {
  const name = path.parse(file).name.toLowerCase();
  const input = sharp(path.join(source, file)).rotate();
  const { width, height } = await input.clone().metadata();
  const widths = WIDTHS.filter((w) => w < width);
  if (!widths.includes(Math.min(width, WIDTHS.at(-1)))) widths.push(Math.min(width, WIDTHS.at(-1)));

  for (const w of widths) {
    await input.clone().resize({ width: w }).webp({ quality: 75 }).toFile(`${OUT_DIR}/${name}-${w}.webp`);
  }

  const lqip = await input.clone().resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
  manifest[name] = {
    width,
    height,
    widths,
    lqip: `data:image/webp;base64,${lqip.toString('base64')}`,
  };
  console.log(`${name}: ${width}x${height} → ${widths.join(', ')}`);
}

await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
