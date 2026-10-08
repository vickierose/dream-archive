import type { ReactNode } from "react";
import { Heading } from "@/components/ui/heading";

type HeadingElement = "h1" | "h2" | "h3";

type SectionHeadingProps = {
  as?: HeadingElement;
  className?: string;
  description?: ReactNode;
  id?: string;
  title: ReactNode;
};

export function SectionHeading({
  as = "h2",
  className = "",
  description,
  id,
  title,
}: SectionHeadingProps) {
  return (
    <div className={className}>
      <Heading as={as} id={id}>
        {title}
      </Heading>
      {description && (
        <p className="mt-1 font-base text-sm text-ink-soft">{description}</p>
      )}
    </div>
  );
}
