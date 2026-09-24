import type { ComponentProps } from "react";

type ChipProps = ComponentProps<"span">;

export function Chip({ className = "", ...props }: ChipProps) {
  return (
    <span
      className={`inline-flex rounded-full bg-[#ead9df] px-3 py-1 font-base text-xs font-bold text-ink-soft ${className}`}
      {...props}
    />
  );
}
