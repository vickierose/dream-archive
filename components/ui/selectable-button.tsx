"use client";

import type { ComponentProps } from "react";

type SelectableButtonProps = Omit<
  ComponentProps<"button">,
  "aria-pressed" | "type"
> & {
  isSelected: boolean;
};

export function SelectableButton({
  className = "",
  isSelected,
  ...props
}: SelectableButtonProps) {
  return (
    <button
      aria-pressed={isSelected}
      className={`control-interaction inline-flex items-center gap-2 rounded-full border px-4 py-3 font-base text-sm font-semibold ${
        isSelected
          ? "border-lavender-dark bg-lavender-light text-purple"
          : "border-line bg-paper-light text-ink-soft not-disabled:hover:border-lavender"
      } ${className}`}
      type="button"
      {...props}
    />
  );
}
