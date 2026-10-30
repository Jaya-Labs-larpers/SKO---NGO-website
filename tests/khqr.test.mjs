import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const source = await readFile(new URL('../src/lib/khqr.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
const exports = {};
vm.runInNewContext(compiled, { exports, TextEncoder });
const { crc16, parseTlv, validateKhqr } = exports;

const tlv = (tag, value) => `${tag}${String(value.length).padStart(2, '0')}${value}`;

/** A synthetic static KHQR in the shape ABA issues; not a real account. */
function payload({ initiation = '11', currency = '840', name = 'SAMATAPHEAP KHNOM', amount } = {}) {
  const body =
    tlv('00', '01') +
    tlv('01', initiation) +
    tlv('29', tlv('00', 'test@abaa')) +
    tlv('52', '8398') +
    tlv('53', currency) +
    (amount ? tlv('54', amount) : '') +
    tlv('58', 'KH') +
    tlv('59', name) +
    tlv('60', 'Phnom Penh') +
    '6304';
  return body + crc16(body);
}

const usd = (khqr, extra = {}) =>
  validateKhqr({ currency: 'USD', khqr, ...extra }, 'Samatapheap Khnom');

test('crc16 is CRC-16/CCITT-FALSE', () => {
  assert.equal(crc16('123456789'), '29B1');
});

test('a valid static payload passes', () => {
  assert.equal(usd(payload()).join('\n'), '');
  assert.equal(
    validateKhqr(
      { currency: 'KHR', khqr: payload({ currency: '116' }) },
      'samatapheap khnom ',
    ).join('\n'),
    '',
  );
});

test('one changed character fails the CRC', () => {
  const tampered = payload().replace('SAMATAPHEAP', 'SAMATAPHEAQ');
  assert.match(usd(tampered).join(), /USD: CRC mismatch/);
});

test('a dynamic QR with a fixed amount fails on both counts', () => {
  const errors = usd(payload({ initiation: '12', amount: '10.00' })).join('\n');
  assert.match(errors, /dynamic QR/);
  assert.match(errors, /fixed amount/);
});

test('a USD payload configured as KHR fails on currency', () => {
  const errors = validateKhqr({ currency: 'KHR', khqr: payload() }, 'Samatapheap Khnom');
  assert.match(errors.join(), /KHR: QR currency code is 840, expected 116/);
});

test('a different recipient fails and names who the QR pays', () => {
  assert.match(usd(payload({ name: 'SOMEONE ELSE' })).join(), /QR pays "SOMEONE ELSE"/);
});

test('placeholder text is not a KHQR payload', () => {
  assert.match(usd('SKO PLACEHOLDER - NOT FOR PAYMENT').join(), /not a KHQR payload/);
});

test('truncated, malformed and duplicated fields are rejected', () => {
  assert.match(usd(payload().slice(0, -2)).join(), /CRC field/);
  assert.ok('error' in parseTlv('000201011'));
  assert.ok('error' in parseTlv('0002010002x1'));
  const duplicated = `${tlv('00', '01')}${tlv('01', '11')}${tlv('01', '11')}6304`;
  assert.match(usd(duplicated + crc16(duplicated)).join(), /field 01 appears twice/);
});

test('an ABA link must be https', () => {
  assert.match(usd(payload(), { abaLink: 'http://pay.ababank.com/x' }).join(), /https/);
  assert.equal(usd(payload(), { abaLink: 'https://pay.ababank.com/x' }).join('\n'), '');
});
