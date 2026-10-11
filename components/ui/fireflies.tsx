"use client";

import type { ISourceOptions } from "@tsparticles/engine";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useId, useSyncExternalStore } from "react";

const smallScreenQuery = "(width < 48rem)";

function subscribeToScreenSize(onChange: () => void) {
  const query = window.matchMedia(smallScreenQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function isSmallScreen() {
  return window.matchMedia(smallScreenQuery).matches;
}

function getServerSnapshot() {
  return true;
}

const options = {
  fullScreen: { enable: false },
  fpsLimit: 60,
  pauseOnBlur: true,
  pauseOnOutsideViewport: true,
  interactivity: {
    detectsOn: "parent",
    events: { onHover: { enable: true, mode: "repulse" } },
    modes: { repulse: { distance: 50, speed: 0.3 } },
  },
  particles: {
    number: { value: 60 },
    paint: {
      fill: {
        enable: true,
        color: { value: ["#ffd166", "#ffe6a7", "#f6bd60"] },
      },
    },
    shape: { type: "circle" },
    links: { enable: false },
    size: { value: { min: 1, max: 4 } },
    opacity: { value: { min: 0.5, max: 0.9 } },
    move: {
      enable: true,
      speed: 0.4,
      direction: "none",
      outModes: { default: "bounce" },
    },
  },
} satisfies ISourceOptions;

const smallScreenOptions: ISourceOptions = {
  ...options,
  interactivity: {
    ...options.interactivity,
    events: { onHover: { enable: false } },
  },
  particles: {
    ...options.particles,
    number: { value: 20 },
  },
};

export default function Fireflies() {
  const id = useId();
  const smallScreen = useSyncExternalStore(
    subscribeToScreenSize,
    isSmallScreen,
    getServerSnapshot,
  );

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <ParticlesProvider init={loadSlim}>
        <Particles
          id={`fireflies-${id}`}
          options={smallScreen ? smallScreenOptions : options}
          className="absolute inset-0 drop-shadow-[0_0_5px_#f7eda8]"
        />
      </ParticlesProvider>
    </div>
  );
}
