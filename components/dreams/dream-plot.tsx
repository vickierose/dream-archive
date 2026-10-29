"use client";

import { useEffect, useId, useState } from "react";
import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const PREVIEW_LENGTH = 500;

export function DreamPlot({ plot }: { plot: string }) {
  const t = useTranslations("Dreams");
  const plotId = useId();
  const [expanded, setExpanded] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const characters = Array.from(plot);
  const canExpand = characters.length > PREVIEW_LENGTH;

  useEffect(() => {
    if (copyStatus === "idle") return;
    const timeout = setTimeout(() => setCopyStatus("idle"), 2000);
    return () => clearTimeout(timeout);
  }, [copyStatus]);

  async function copyPlot() {
    try {
      await navigator.clipboard.writeText(plot);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={copyPlot}
        aria-label={t("copyPlot")}
        title={t(copyStatus === "copied" ? "plotCopied" : "copyPlot")}
        className="control-interaction absolute right-6 top-2 inline-flex size-9 items-center justify-center rounded-full text-ink-muted hover:bg-lavender-light hover:text-purple focus-visible:outline-purple"
      >
        {copyStatus === "copied" ? (
          <Check aria-hidden="true" size={16} />
        ) : (
          <Copy aria-hidden="true" size={16} />
        )}
      </button>
      <span role="status" className="sr-only">
        {copyStatus === "copied"
          ? t("plotCopied")
          : copyStatus === "error"
            ? t("copyPlotError")
            : ""}
      </span>
      <p
        id={plotId}
        className="whitespace-pre-wrap pr-6 font-handwritten text-lg leading-relaxed text-ink sm:text-xl"
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
