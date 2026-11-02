import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { reducedMotionPreference, useReducedMotion } from "./use-reduced-motion";

test("server rendering defaults to reduced motion without accessing browser APIs", () => {
  function Preference() {
    return createElement("output", null, useReducedMotion() ? "reduced" : "normal");
  }
  assert.equal(renderToStaticMarkup(createElement(Preference)), "<output>reduced</output>");
});

test("motion preference changes are observed live and listeners are cleaned up", () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  let matches = false;
  const listeners = new Set<() => void>();
  const media = {
    get matches() { return matches; },
    addEventListener(event: string, listener: () => void) {
      assert.equal(event, "change");
      listeners.add(listener);
    },
    removeEventListener(event: string, listener: () => void) {
      assert.equal(event, "change");
      listeners.delete(listener);
    },
  };
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      matchMedia(query: string) {
        assert.equal(query, "(prefers-reduced-motion: reduce)");
        return media;
      },
    },
  });
  try {
    assert.equal(reducedMotionPreference.getSnapshot(), false);
    const snapshots: boolean[] = [];
    const unsubscribe = reducedMotionPreference.subscribe(() => {
      snapshots.push(reducedMotionPreference.getSnapshot());
    });
    for (const next of [true, false]) {
      matches = next;
      listeners.forEach((listener) => listener());
    }
    assert.deepEqual(snapshots, [true, false]);
    unsubscribe();
    assert.equal(listeners.size, 0);
    matches = true;
    listeners.forEach((listener) => listener());
    assert.deepEqual(snapshots, [true, false]);
  } finally {
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
