import { deflateSync } from 'node:zlib';
import type { QrMatrix } from './qr';

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = CRC_TABLE[(crc ^ byte) & 0xff]! ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Uint8Array): Buffer {
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const out = Buffer.alloc(body.length + 8);
  out.writeUInt32BE(data.length, 0);
  body.copy(out, 4);
  out.writeUInt32BE(crc32(body), body.length + 4);
  return out;
}

/** Black-on-white 8-bit greyscale PNG, scaled to whole pixels per module, about `target` px wide. */
export function qrPng(matrix: QrMatrix, target = 800, quiet = 4): Buffer {
  const modules = matrix.length + quiet * 2;
  const scale = Math.max(1, Math.round(target / modules));
  const width = modules * scale;

  const rows = Buffer.alloc((width + 1) * width, 0xff);
  for (let py = 0; py < width; py++) {
    const rowStart = py * (width + 1);
    rows[rowStart] = 0;
    const y = Math.floor(py / scale) - quiet;
    for (let px = 0; px < width; px++) {
      const x = Math.floor(px / scale) - quiet;
      if (matrix[y]?.[x]) rows[rowStart + 1 + px] = 0;
    }
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(width, 4);
  header[8] = 8;
  header[9] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(rows)),
    chunk('IEND', new Uint8Array()),
  ]);
}
