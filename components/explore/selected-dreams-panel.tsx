import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import { formatDreamDate } from "@/lib/date";
import type { ConstellationDream, ConstellationNode } from "@/lib/explore/constellation";

export function SelectedDreamsPanel({ dreams, symbols }: {
  dreams: ConstellationDream[];
  symbols: ConstellationNode[];
}) {
  const t = useTranslations("Explore");
  const common = useTranslations("Dreams");
  const locale = useLocale();

  return (
    <section aria-label={t("matchingTitle")} className="mt-4 overflow-hidden rounded-panel border border-paper-lilac-border bg-paper-light">
      <div className="border-b border-line px-5 py-4">
        <h2 className="font-handwritten text-2xl font-semibold text-ink">{t("matchingTitle")}</h2>
        <p className="mt-1 text-sm text-ink-soft">{t("matchingDescription")}</p>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label={t("selectedSymbols")}>
          {symbols.map((symbol) => (
            <li key={symbol.id} className="rounded-full bg-lavender-pale px-3 py-1 text-sm text-purple">
              {symbol.emoji} {symbol.name}
            </li>
          ))}
        </ul>
        <p role="status" className="mt-3 text-sm text-ink-soft">{common("count", { count: dreams.length })}</p>
      </div>
      {dreams.length ? (
        <ul className="max-h-80 overflow-y-auto">
          {dreams.map((dream) => (
            <li key={dream.id} className="border-b border-line last:border-b-0">
              <Link href={`/dreams/${dream.id}`} className="focus-ring flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-lavender-pale focus-visible:-outline-offset-2 motion-reduce:transition-none">
                <div className="min-w-0">
                  <p className="font-handwritten text-xl font-semibold text-ink">{dream.title}</p>
                  <p className="mt-1 text-xs text-ink-soft">{formatDreamDate(dream.date, locale)}</p>
                </div>
                <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-ink-muted" />
              </Link>
            </li>
          ))}
        </ul>
      ) : <p className="px-5 py-6 text-sm text-ink-soft">{t("noMatchingDreams")}</p>}
    </section>
  );
}
