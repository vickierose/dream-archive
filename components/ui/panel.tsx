import type { ComponentProps } from "react";

type PanelProps = ComponentProps<"div"> & {
  padding?: "none" | "md";
};

export function Panel({
  padding = "md",
  className = "",
  ...props
}: PanelProps) {
  return (
    <div
      {...props}
      className={`overflow-hidden rounded-panel border border-line bg-paper-light ${padding === "md" ? "p-6 sm:p-8" : ""} ${className}`}
    />
  );
}
