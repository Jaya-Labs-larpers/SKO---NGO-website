/**
 * Builds public/og-image.png, the default link preview for Telegram, Facebook,
 * WhatsApp, LinkedIn and X: the full-colour logo centred on white at 60% of
 * the 1200x630 canvas height, so no platform crops it.
 *
 *   node scripts/og-image.mjs
 */

import sharp from 'sharp';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const WIDTH = 1200;
const HEIGHT = 630;
const LOGO_HEIGHT = Math.round(HEIGHT * 0.6);

const root = new URL('../', import.meta.url);
const logoPath = fileURLToPath(new URL('public/logo/sko-logo-full-colour-1600.png', root));
const outPath = fileURLToPath(new URL('public/og-image.png', root));

const logo = await sharp(logoPath).trim().resize({ height: LOGO_HEIGHT }).png().toBuffer();
const { width: logoWidth } = await sharp(logo).metadata();

await sharp({
  create: { width: WIDTH, height: HEIGHT, channels: 3, background: '#ffffff' },
})
  .composite([
    {
      input: logo,
      left: Math.round((WIDTH - logoWidth) / 2),
      top: Math.round((HEIGHT - LOGO_HEIGHT) / 2),
    },
  ])
  .png({ compressionLevel: 9, palette: true })
  .toFile(outPath);

const { width, height } = await sharp(outPath).metadata();
const { size } = await stat(outPath);
console.log(`og-image.png ${width}x${height}, ${(size / 1024).toFixed(0)} KB, logo ${logoWidth}x${LOGO_HEIGHT}`);
