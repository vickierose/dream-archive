import type { ComponentProps, ReactNode } from "react";
import { Heading } from "@/components/ui/heading";

type DialogProps = Omit<
  ComponentProps<"dialog">,
  "title" | "aria-label" | "aria-labelledby"
> & {
  title: ReactNode;
  titleId: string;
  size?: "sm" | "md" | "lg";
  overflow?: "auto" | "visible";
};

const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-3xl" };

// The caller owns showModal(), focus, dismissal, and pending-work guards.
export function Dialog({
  title,
  titleId,
  size = "md",
  overflow = "auto",
  className = "",
  children,
  ...props
}: DialogProps) {
  return (
    <dialog
      {...props}
      aria-labelledby={titleId}
      className={`fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] rounded-dialog border border-line bg-paper-light p-6 text-ink shadow-dialog backdrop:bg-ink/40 backdrop:backdrop-blur-sm sm:p-8 ${sizes[size]} ${overflow === "visible" ? "overflow-visible" : "overflow-y-auto"} ${className}`}
    >
      <Heading as="h2" id={titleId}>
        {title}
      </Heading>
      <div className="mt-6 space-y-6">{children}</div>
    </dialog>
  );
}
