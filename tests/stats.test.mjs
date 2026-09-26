import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const source = await readFile(new URL('../src/lib/content/stats.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
const context = { exports: {} };
vm.runInNewContext(compiled, context);
const { countsUp } = context.exports;

test('a figure nobody has decided about counts up', () => {
  assert.equal(countsUp({ _id: 'a', value: 200, displayValue: '200' }), true);
  assert.equal(countsUp({ _id: 'b', value: 97, displayValue: '97%', countUp: null }), true);
  assert.equal(countsUp({ _id: 'c', value: 24700, displayValue: '24,700 kg' }), true);
  assert.equal(countsUp({ _id: 'd', value: 2000, displayValue: '~2000' }), true);
});

test('staff can switch a figure off, or on for a year', () => {
  assert.equal(countsUp({ _id: 'a', value: 200, countUp: false }), false);
  assert.equal(countsUp({ _id: 'b', value: 2007, displayValue: '2007', countUp: true }), true);
});

test('a plain year holds still unless asked', () => {
  assert.equal(countsUp({ _id: 'a', value: 2007, displayValue: '2007' }), false);
  assert.equal(countsUp({ _id: 'b', value: 1998 }), false);
  assert.equal(countsUp({ _id: 'c', value: 2007, displayValue: '2,007' }), true);
});

test('a figure without a number never counts', () => {
  assert.equal(countsUp({ _id: 'a', displayValue: '10,000+' }), false);
  assert.equal(countsUp({ _id: 'b', value: null, countUp: true }), false);
});
