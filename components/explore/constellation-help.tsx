"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CircleHelp } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function ConstellationHelp() {
  const t = useTranslations("Explore");
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const dismissOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const dismissEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("keydown", dismissEscape);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("keydown", dismissEscape);
    };
  }, [open]);

  return (
    <div
      ref={root}
      className="relative"
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setOpen(true); }}
      onPointerLeave={(event) => { if (event.pointerType === "mouse") setOpen(false); }}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    >
      <Button
        variant="ghost"
        size="sm"
        aria-label={t("help")}
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onFocus={(event) => { if (event.currentTarget.matches(":focus-visible")) setOpen(true); }}
        onClick={() => setOpen((current) => !current)}
      >
        <CircleHelp size={18} aria-hidden="true" />
      </Button>
      {open && (
        <div className="absolute right-0 top-full z-30 w-80 max-w-[calc(100vw-3rem)] pt-2">
          <div id={id} role="tooltip" className="rounded-control border border-paper-lilac-border bg-paper-light p-4 text-sm leading-relaxed text-ink shadow-popover">
            <p>{t("instructions")}</p>
            <p className="mt-2">{t("focusHint")}</p>
            <p className="mt-2">{t("legend")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
