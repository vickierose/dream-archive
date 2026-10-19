"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const PREVIEW_LENGTH = 500;

export function DreamPlot({ plot }: { plot: string }) {
  const t = useTranslations("Dreams");
  const plotId = useId();
  const [expanded, setExpanded] = useState(false);
  const characters = Array.from(plot);
  const canExpand = characters.length > PREVIEW_LENGTH;

  return (
    <>
      <p
        id={plotId}
        className="whitespace-pre-wrap font-handwritten text-lg leading-relaxed text-ink sm:text-xl"
      >
        {canExpand && !expanded
          ? `${characters.slice(0, PREVIEW_LENGTH).join("")}…`
          : plot}
      </p>
      {canExpand && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-4"
          aria-expanded={expanded}
          aria-controls={plotId}
          onClick={() => setExpanded((value) => !value)}
        >
          {t(expanded ? "showLess" : "showMore")}
        </Button>
      )}
    </>
  );
}
