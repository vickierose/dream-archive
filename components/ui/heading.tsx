import type { ComponentProps } from "react";

type HeadingLevel = "h1" | "h2" | "h3";
type HeadingSize = "page" | "section" | "subsection";

type HeadingProps = ComponentProps<"h1"> & {
  as: HeadingLevel;
  size?: HeadingSize;
};

const defaultSizes: Record<HeadingLevel, HeadingSize> = {
  h1: "page",
  h2: "section",
  h3: "subsection",
};

const sizes: Record<HeadingSize, string> = {
  page: "text-4xl leading-none sm:text-5xl",
  section: "text-3xl leading-tight",
  subsection: "text-2xl leading-tight",
};

export function Heading({
  as: Tag,
  size,
  className = "",
  ...props
}: HeadingProps) {
  return (
    <Tag
      {...props}
      className={`font-handwritten text-ink ${sizes[size ?? defaultSizes[Tag]]} ${className}`}
    />
  );
}
