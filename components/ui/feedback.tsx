import type { ComponentProps } from "react";

type FeedbackProps = Omit<ComponentProps<"p">, "role"> & {
  tone?: "error" | "notice";
};

export function Feedback({
  tone = "error",
  children,
  className = "",
  ...props
}: FeedbackProps) {
  if (!children) return null;

  return (
    <p
      {...props}
      role={tone === "error" ? "alert" : "status"}
      className={`font-base text-sm leading-relaxed ${tone === "error" ? "text-danger" : "text-ink-soft"} ${className}`}
    >
      {children}
    </p>
  );
}
