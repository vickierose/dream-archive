import Link from "next/link";
import type { ReactNode } from "react";

type TapedCardProps = {
  children: ReactNode;
  href: string;
  label: string;
  className?: string;
  size?: "normal" | "sm";
};

const cardSizes = {
  normal: "min-h-64 p-6 pt-8",
  sm: "w-full max-w-40 min-h-44 px-3 pb-4 pt-6",
} as const;

const tapeSizes = {
  normal: "-top-4 h-8 w-20",
  sm: "-top-2.5 h-5 w-12",
} as const;

const cardPalettes = [
  "border-[#eadbcc] bg-paper-light",
  "border-[#d9cce1] bg-[#f3edf5]",
  "border-[#ecd2d8] bg-[#fcf0f1]",
] as const;

const tapeColors = ["bg-[#f6deb3]", "bg-tape", "bg-[#e8bbc7]"] as const;
const tapePositions = ["left-[26%]", "left-1/2", "left-[74%]"] as const;
const tapeRotations = ["-rotate-3", "rotate-3"] as const;

function pickRandom<T>(options: readonly T[]): T {
  return options[Math.floor(Math.random() * options.length)];
}

export function TapedCard({ children, href, label, className = "", size = "normal" }: TapedCardProps) {
  const cardPalette = pickRandom(cardPalettes);
  const tapeColor = pickRandom(tapeColors);
  const tapePosition = pickRandom(tapePositions);
  const tapeRotation = pickRandom(tapeRotations);

  return (
    <Link
      aria-label={label}
      className={`group relative rounded-sm border
        shadow-[0_5px_12px_rgba(68,54,83,0.08)] transition duration-200
        hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(68,54,83,0.14)]
        focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple
        motion-reduce:transform-none motion-reduce:transition-none ${cardPalette} ${cardSizes[size]} ${className}`}
      href={href}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute max-w-[40%] -translate-x-1/2 opacity-70 ${tapeSizes[size]} ${tapeColor} ${tapePosition} ${tapeRotation}`}
      />
      {children}
    </Link>
  );
}
