/**
 * Static KHQR payload checks. The decoded payload string is the one thing that
 * decides where a donation goes, so every rule here fails the build rather than
 * warning. Pure and dependency-free so tests/khqr.test.mjs can run it directly.
 *
 * Payload format is EMVCo merchant-presented QR: TAG(2 digits) LEN(2 digits)
 * VALUE, repeated, with the CRC field (63) last.
 */

export type Currency = 'USD' | 'KHR';

export interface KhqrAccount {
  currency: Currency;
  khqr: string;
  abaLink?: string;
}

const CURRENCY_CODE: Record<Currency, string> = { USD: '840', KHR: '116' };

/** CRC-16/CCITT-FALSE: poly 0x1021, init 0xFFFF, no reflection, no final XOR. */
export function crc16(text: string): string {
  let crc = 0xffff;
  for (const byte of new TextEncoder().encode(text)) {
    crc ^= byte << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/** Top-level TLV fields, or an error describing where parsing broke. */
export function parseTlv(payload: string): { fields: Map<string, string> } | { error: string } {
  const fields = new Map<string, string>();
  let offset = 0;
  while (offset < payload.length) {
    const header = payload.slice(offset, offset + 4);
    if (!/^\d{4}$/.test(header)) return { error: `malformed field at position ${offset}` };
    const tag = header.slice(0, 2);
    const length = Number(header.slice(2));
    const value = payload.slice(offset + 4, offset + 4 + length);
    if (value.length < length) return { error: `field ${tag} is cut short` };
    if (fields.has(tag)) return { error: `field ${tag} appears twice` };
    fields.set(tag, value);
    offset += 4 + length;
  }
  return { fields };
}

/** Every problem with one account's payload, each prefixed with its currency. */
export function validateKhqr(account: KhqrAccount, khqrName: string): string[] {
  const { currency, khqr, abaLink } = account;
  const fail = (message: string) => `${currency}: ${message}`;
  const errors: string[] = [];

  if (abaLink !== undefined && !abaLink.startsWith('https://'))
    errors.push(fail('abaLink must start with https://'));

  if (!khqr.startsWith('000201')) {
    errors.push(
      fail(
        'khqr is not a KHQR payload. Paste the decoded text of the ABA QR (it starts with 000201), not an image or a placeholder.',
      ),
    );
    return errors;
  }

  const crcMatch = /6304([0-9A-Fa-f]{4})$/.exec(khqr);
  if (!crcMatch) {
    errors.push(
      fail('khqr does not end with a CRC field (6304 + 4 hex digits). Was it copied in full?'),
    );
    return errors;
  }
  const expected = crc16(khqr.slice(0, -4));
  if (crcMatch[1]!.toUpperCase() !== expected) {
    errors.push(
      fail(
        `CRC mismatch (payload says ${crcMatch[1]}, content gives ${expected}). The text was changed or mistyped; decode the QR again.`,
      ),
    );
    return errors;
  }

  const parsed = parseTlv(khqr);
  if ('error' in parsed) {
    errors.push(fail(`khqr does not parse: ${parsed.error}.`));
    return errors;
  }
  const { fields } = parsed;

  const initiation = fields.get('01');
  if (initiation === '12')
    errors.push(
      fail('this is a dynamic QR (field 01 = 12). Save the static ABA QR for the account instead.'),
    );
  else if (initiation !== '11')
    errors.push(fail(`field 01 must be 11 (static QR), found ${initiation ?? 'nothing'}.`));

  if (fields.has('54'))
    errors.push(
      fail(
        'the QR has a fixed amount (field 54). Use a QR without an amount so donors can enter their own.',
      ),
    );

  const code = fields.get('53');
  if (code !== CURRENCY_CODE[currency])
    errors.push(
      fail(
        `QR currency code is ${code ?? 'missing'}, expected ${CURRENCY_CODE[currency]} for ${currency}. Check the QR belongs to the ${currency} account.`,
      ),
    );

  const payee = fields.get('59')?.trim() ?? '';
  if (payee.toLowerCase() !== khqrName.trim().toLowerCase())
    errors.push(
      fail(
        `QR pays "${payee}" but khqrName is "${khqrName}". If "${payee}" is genuinely SKO, set khqrName to it; otherwise the QR is wrong.`,
      ),
    );

  return errors;
}
