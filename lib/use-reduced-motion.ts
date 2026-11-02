"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

export const reducedMotionPreference = {
  subscribe(onChange: () => void) {
    const media = window.matchMedia(query);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  },
  getSnapshot() {
    return window.matchMedia(query).matches;
  },
  getServerSnapshot() {
    return true;
  },
};

export function useReducedMotion() {
  return useSyncExternalStore(
    reducedMotionPreference.subscribe,
    reducedMotionPreference.getSnapshot,
    reducedMotionPreference.getServerSnapshot,
  );
}
