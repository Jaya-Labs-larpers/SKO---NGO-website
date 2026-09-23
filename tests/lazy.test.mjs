import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = await readFile(
  new URL("../src/lib/lazy.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.CommonJS,
  },
}).outputText;

/**
 * Just enough DOM for a module that only ever touches four things: an image's
 * src pair, the load event, the idle callback and IntersectionObserver.
 */
function load({ images = [], readyState = "complete", observer = true } = {}) {
  const calls = { idle: [], load: [], observed: [] };
  const document = {
    readyState,
    querySelectorAll: () => images,
  };
  const window = {
    requestIdleCallback: (work) => calls.idle.push(work),
    addEventListener: (type, handler) => calls.load.push({ type, handler }),
  };
  const context = {
    exports: {},
    document,
    window,
    setTimeout,
    IntersectionObserver: observer
      ? class {
          constructor(callback) {
            this.callback = callback;
          }
          observe(element) {
            calls.observed.push({
              element,
              fire: () => this.callback([{ isIntersecting: true }]),
            });
          }
          disconnect() {
            this.disconnected = true;
          }
        }
      : undefined,
  };
  vm.runInNewContext(compiled, context);
  return { lazy: context.exports, calls };
}

function fakeImage(dataset) {
  const order = [];
  return {
    dataset,
    order,
    set src(value) {
      order.push(["src", value]);
    },
    set srcset(value) {
      order.push(["srcset", value]);
    },
  };
}

test("a deferred image gets its srcset before its src", () => {
  const { lazy } = load();
  const image = fakeImage({
    lazy: "idle",
    lazySrc: "/photo-1200",
    lazySrcset: "/photo-400 400w",
  });
  lazy.loadDeferredImage(image);
  assert.deepEqual(image.order, [
    ["srcset", "/photo-400 400w"],
    ["src", "/photo-1200"],
  ]);
  assert.deepEqual(image.dataset, {});
});

test("loading an image twice does not re-request it", () => {
  const { lazy } = load();
  const image = fakeImage({ lazySrc: "/photo-1200" });
  lazy.loadDeferredImage(image);
  lazy.loadDeferredImage(image);
  assert.equal(image.order.length, 1);
});

test("an image with nothing deferred is left alone", () => {
  const { lazy } = load();
  const image = fakeImage({});
  lazy.loadDeferredImage(image);
  assert.deepEqual(image.order, []);
});

test("idle images wait for load and then for a spare moment", () => {
  const idle = fakeImage({ lazy: "idle", lazySrc: "/idle" });
  const { lazy, calls } = load({ images: [idle], readyState: "loading" });
  lazy.hydrateDeferredImages();

  assert.deepEqual(
    idle.order,
    [],
    "nothing is fetched while the page is still loading",
  );
  assert.equal(calls.load[0].type, "load");
  calls.load[0].handler();
  assert.deepEqual(idle.order, [], "nor the instant load fires");
  calls.idle[0]();
  assert.deepEqual(idle.order, [["src", "/idle"]]);
});

test("visible images wait for the viewport, manual ones wait for their component", () => {
  const visible = fakeImage({ lazy: "visible", lazySrc: "/visible" });
  const manual = fakeImage({ lazySrc: "/manual" });
  const { lazy, calls } = load({ images: [visible, manual] });
  lazy.hydrateDeferredImages();

  assert.equal(calls.observed.length, 1, "only the visible image is observed");
  assert.deepEqual(visible.order, []);
  calls.observed[0].fire();
  assert.deepEqual(visible.order, [["src", "/visible"]]);
  assert.deepEqual(manual.order, [], "a manual image never loads on its own");
});

test("without IntersectionObserver a visible image simply loads", () => {
  const image = fakeImage({ lazy: "visible", lazySrc: "/visible" });
  const { lazy } = load({ images: [image], observer: false });
  lazy.hydrateDeferredImages();
  assert.deepEqual(image.order, [["src", "/visible"]]);
});

function fakeFrame({ complete, src }) {
  const listeners = {};
  const image = {
    complete,
    getAttribute: (name) => (name === "src" ? src : null),
    addEventListener: (type, handler) => (listeners[type] = handler),
  };
  const frame = { dataset: {}, querySelector: () => image };
  return { frame, fire: (type) => listeners[type]?.() };
}

const rootOf = (...frames) => ({ querySelectorAll: () => frames });

test("a blur-up photo stays hidden until it loads, then fades in", () => {
  const { lazy } = load();
  const { frame, fire } = fakeFrame({ complete: false, src: "/photo" });
  lazy.revealWhenLoaded(rootOf(frame));
  assert.equal(frame.dataset.loaded, undefined);
  fire("load");
  assert.equal(frame.dataset.loaded, "");
  assert.equal(frame.dataset.instant, undefined, "a real load fades");
});

test("a cached blur-up photo is shown at once, without the fade", () => {
  const { lazy } = load();
  const { frame } = fakeFrame({ complete: true, src: "/photo" });
  lazy.revealWhenLoaded(rootOf(frame));
  assert.equal(frame.dataset.loaded, "");
  assert.equal(frame.dataset.instant, "");
});

test("a deferred photo with no src yet is not mistaken for a cached one", () => {
  const { lazy } = load();
  const { frame, fire } = fakeFrame({ complete: true, src: null });
  lazy.revealWhenLoaded(rootOf(frame));
  assert.equal(frame.dataset.loaded, undefined);
  fire("load");
  assert.equal(frame.dataset.loaded, "");
});

test("a photo that fails still lifts the blur", () => {
  const { lazy } = load();
  const { frame, fire } = fakeFrame({ complete: false, src: "/missing" });
  lazy.revealWhenLoaded(rootOf(frame));
  fire("error");
  assert.equal(frame.dataset.loaded, "");
});
