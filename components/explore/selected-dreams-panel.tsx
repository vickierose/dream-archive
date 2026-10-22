import { useId } from "react";
import { useTranslations } from "next-intl";
import { DreamLink } from "@/components/dreams/dream-link";
import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";
import { Chip } from "@/components/ui/chip";
import type {
  ConstellationDream,
  ConstellationNode,
} from "@/lib/explore/constellation";

export function SelectedDreamsPanel({
  dreams,
  symbols,
}: {
  dreams: ConstellationDream[];
  symbols: ConstellationNode[];
}) {
  const t = useTranslations("Explore");
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="mt-4">
      <Panel padding="none" className="mt-4 max-h-80 overflow-y-auto">
        <div className="border-b border-line px-5 py-4">
          <SectionHeading
            id={headingId}
            title={`${t("matchingTitle")} (${dreams.length})`}
          />
          <ul
            className="mt-3 flex flex-wrap gap-2"
            aria-label={t("selectedSymbols")}
          >
            {symbols.map((symbol) => (
              <li key={symbol.id}>
                <Chip>
                  {symbol.emoji} {symbol.name}
                </Chip>
              </li>
            ))}
          </ul>
        </div>
        {dreams.length ? (
          dreams.map((dream) => <DreamLink key={dream.id} dream={dream} />)
        ) : (
          <p className="p-6 text-sm leading-relaxed text-ink-soft">
            {t("noMatchingDreams")}
          </p>
        )}
      </Panel>
    </section>
  );
}
