import type { ReactNode } from "react";

type HeadingElement = "h1" | "h2" | "h3";

type SectionHeadingProps = {
  action?: ReactNode;
  as?: HeadingElement;
  className?: string;
  description?: ReactNode;
  id?: string;
  title: ReactNode;
};

const headingClasses: Record<HeadingElement, string> = {
  h1: "text-5xl leading-none sm:text-6xl",
  h2: "text-3xl",
  h3: "text-2xl",
};

export function SectionHeading({
  action,
  as: Heading = "h2",
  className = "",
  description,
  id,
  title,
}: SectionHeadingProps) {
  return (
    <div className={`flex items-end justify-between gap-4 ${className}`}>
      <div>
        <Heading className={`font-handwritten text-ink ${headingClasses[Heading]}`} id={id}>
          {title}
        </Heading>
        {description && (
          <p className="mt-1 font-base text-sm text-ink-soft">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
