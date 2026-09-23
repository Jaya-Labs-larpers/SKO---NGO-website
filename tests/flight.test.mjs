import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = await readFile(
  new URL("../src/lib/butterflies/flight.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.CommonJS,
  },
}).outputText;
const module = { exports: {} };
vm.runInNewContext(compiled, { module, exports: module.exports });
const flight = module.exports;

const desktop = { width: 1440, height: 900 };
const phone = { width: 390, height: 844 };
const still = { pointer: null, scrolled: 0 };

function run(flock, seconds, input = still) {
  for (let i = 0; i < seconds * 60; i++) flight.stepFlock(flock, 1 / 60, input);
}

test("one larger butterfly and three smaller ones of one size", () => {
  const { flyers } = flight.createFlock(desktop);
  const small = flyers.filter((f) => !f.big);
  assert.equal(flyers.length, 4);
  assert.equal(small.length, 3);
  assert.equal(new Set(small.map((f) => f.size)).size, 1);
  assert.ok(flyers.find((f) => f.big).size > small[0].size * 2);
});

test("on a phone they are small and keep to the edges", () => {
  const { flyers } = flight.createFlock(phone);
  for (const f of flyers) {
    assert.ok(f.size <= 44);
    const fromEdge = Math.min(f.hx, phone.width - f.hx);
    assert.ok(fromEdge <= 16, `rests ${fromEdge}px from the edge`);
  }
});

test("scrolling carries the small ones along the edge, not the big one", () => {
  const flock = flight.createFlock(desktop);
  const before = flock.flyers.map((f) => f.hy);
  flight.stepFlock(flock, 1 / 60, { pointer: null, scrolled: 100 });
  flock.flyers.forEach((f, i) => {
    if (f.big) assert.equal(f.hy, before[i]);
    else assert.ok(f.hy > before[i]);
  });
});

test("a small one flown off the bottom comes back in at the top", () => {
  const flock = flight.createFlock(desktop);
  const flyer = flock.flyers.find((f) => !f.big);
  for (let i = 0; i < 40; i++) {
    flight.stepFlock(flock, 1 / 60, { pointer: null, scrolled: 120 });
  }
  assert.ok(flyer.hy >= -100 && flyer.hy <= desktop.height + 100);
});

test("a nearby mouse draws them in; on a phone it does not", () => {
  const flock = flight.createFlock(desktop);
  const flyer = flock.flyers[1];
  const pointer = { x: flyer.x + 200, y: flyer.y };
  run(flock, 3, { pointer, scrolled: 0 });
  assert.ok(flyer.gathered);
  assert.ok(Math.hypot(flyer.x - pointer.x, flyer.y - pointer.y) < 130);

  const small = flight.createFlock(phone);
  const p = { x: small.flyers[1].x + 100, y: small.flyers[1].y };
  run(small, 1, { pointer: p, scrolled: 0 });
  assert.ok(small.flyers.every((f) => !f.gathered));
});

test("a saved flock comes back exactly where it was", () => {
  const flock = flight.createFlock(desktop);
  run(flock, 2, { pointer: { x: 700, y: 400 }, scrolled: 0 });
  const saved = JSON.parse(JSON.stringify(flight.saveFlock(flock)));
  const restored = flight.restoreFlock(saved, desktop);
  restored.flyers.forEach((f, i) => {
    assert.equal(f.x, flock.flyers[i].x);
    assert.equal(f.y, flock.flyers[i].y);
  });
});

test("a malformed save is ignored rather than trusted", () => {
  assert.equal(flight.parseSavedFlock("{nope"), null);
  assert.equal(flight.parseSavedFlock('{"w":1,"h":1,"f":[]}'), null);
  assert.equal(flight.parseSavedFlock(null), null);
});
