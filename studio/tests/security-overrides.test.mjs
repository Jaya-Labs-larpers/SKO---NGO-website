import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const require = createRequire(import.meta.url);

test('patched UUID preserves TypeID generation and round-trip', () => {
  const { typeid, fromUUID, toUUID } = require('typeid-js');
  const id = typeid('document');
  assert.match(id.toString(), /^document_[a-z0-9]{26}$/);
  const uuid = id.toUUID();
  assert.equal(fromUUID(uuid, 'document'), id.toString());
  assert.equal(toUUID(id.toString()), uuid);
});

test('patched archive parser bounds output despite oversized metadata', () => {
  const scoped = createRequire(require.resolve('@module-federation/dts-plugin'));
  const Zip = scoped('adm-zip');
  const archive = new Zip();
  archive.addFile('normal.txt', Buffer.from('normal data'));
  const normal = archive.toBuffer();
  assert.equal(new Zip(normal).readAsText('normal.txt'), 'normal data');
  const malicious = Buffer.from(normal);
  const central = malicious.indexOf(Buffer.from([0x50, 0x4b, 0x01, 0x02]));
  malicious.writeUInt32LE(0xffffffff, central + 24);
  assert.equal(new Zip(malicious).readFile('normal.txt').toString(), 'normal data');
});

test('patched YAML and TOML preserve normal config parsing and reject malformed inputs', () => {
  const scoped = createRequire(require.resolve('@vercel/frameworks'));
  const yaml = scoped('js-yaml');
  const toml = scoped('smol-toml');
  assert.deepEqual(yaml.load('name: ngo\nitems: [one, two]'), {
    name: 'ngo',
    items: ['one', 'two'],
  });
  assert.deepEqual(toml.parse('name = "ngo"'), { name: 'ngo' });
  assert.throws(() => toml.parse('value = [,,,,]'));
  assert.throws(() => yaml.load('a: [invalid'));
});

test('patched ZIP extraction does not follow a destination symlink', async () => {
  const { symlink } = await import('node:fs/promises');
  const scoped = createRequire(require.resolve('@module-federation/dts-plugin'));
  const Zip = scoped('adm-zip');
  const directory = await mkdtemp(join(tmpdir(), 'sko-zip-test-'));
  try {
    const outside = join(directory, 'outside');
    const destination = join(directory, 'destination');
    await mkdir(outside);
    await mkdir(destination);
    await writeFile(join(outside, 'file.txt'), 'keep');
    await symlink(outside, join(destination, 'linked'));
    const archive = new Zip();
    archive.addFile('linked/file.txt', Buffer.from('overwrite'));
    try {
      archive.extractAllTo(destination, true);
    } catch {}
    assert.equal(await readFile(join(outside, 'file.txt'), 'utf8'), 'keep');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
