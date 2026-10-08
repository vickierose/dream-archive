import type { ComponentProps } from "react";

export function FormActions({
  className = "",
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={`flex flex-wrap justify-end gap-3 ${className}`}
    />
  );
}
