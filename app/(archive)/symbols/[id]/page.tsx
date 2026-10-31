import { getPageMetadata } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";
import { Panel } from "@/components/ui/panel";
import Link from "next/link";
import { BackButton } from "@/components/ui/back-button";
import { Chip } from "@/components/ui/chip";
import { DreamLink } from "@/components/dreams/dream-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { getArchive } from "@/lib/data/archive";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default async function SymbolPage({
  params,
}: PageProps<"/symbols/[id]">) {
  const t = await getTranslations();
  const { id } = await params;
  const { dreams: archiveDreams, symbols: availableSymbols } =
    await getArchive();
  const symbol = availableSymbols.find((symbol) => symbol.id === id);

  if (!symbol) {
    return (
      <EmptyState
        title={t("Symbols.notFound")}
        action={
          <BackButton fallbackHref="/symbols" label={t("Symbols.back")} />
        }
      />
    );
  }

  const dreams = archiveDreams.filter((dream) => dream.symbols.includes(id));
  const frequentSymbols = availableSymbols
    .filter((otherSymbol) => otherSymbol.id !== id)
    .map((otherSymbol) => ({
      ...otherSymbol,
      count: dreams.filter((dream) => dream.symbols.includes(otherSymbol.id))
        .length,
    }))
    .filter(({ count }) => count > 0)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  const symbolLinkClasses =
    "focus-ring inline-flex rounded-full transition-opacity duration-200 hover:opacity-75 motion-reduce:transition-none";

  return (
    <div className="relative mx-auto max-w-3xl pb-28">
      <div className="mb-2 md:mt-4">
        <BackButton fallbackHref="/symbols" />
      </div>
      <PageHeader
        title={symbol.name}
        description={t("Symbols.appeared", { count: dreams.length })}
        prefix={
          <span
            aria-hidden="true"
            className="text-6xl leading-none sm:text-6xl"
          >
            {symbol.emoji}
          </span>
        }
      />
      <section aria-labelledby="frequent-symbols-heading">
        <SectionHeading
          id="frequent-symbols-heading"
          title={t("Symbols.often")}
        />
        {frequentSymbols.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-3">
            {frequentSymbols.map((otherSymbol) => (
              <li key={otherSymbol.id}>
                <Link
                  className={symbolLinkClasses}
                  href={`/symbols/${otherSymbol.id}`}
                >
                  <Chip>
                    {otherSymbol.name} ({otherSymbol.count})
                  </Chip>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 font-base text-sm text-ink-soft">
            {t("Symbols.noCompanions")}
          </p>
        )}
      </section>

      <section className="mt-8" aria-labelledby="symbol-dreams-heading">
        <SectionHeading
          id="symbol-dreams-heading"
          title={t("Navigation.dreams")}
        />
        <Panel padding="none" className="mt-4">
          {dreams.length > 0 ? (
            dreams.map((dream) => (
              <DreamLink
                key={dream.id}
                dream={dream}
                thumbnailSrc="/night-view.png"
              />
            ))
          ) : (
            <p className="p-6 text-sm leading-relaxed text-ink-soft">
              {t("Symbols.noDreams")}
            </p>
          )}
        </Panel>
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps<"/symbols/[id]">) {
  const { id } = await params;
  const [metadata, archive] = await Promise.all([
    getPageMetadata("symbol"),
    getArchive(),
  ]);
  const symbol = archive.symbols.find((symbol) => symbol.id === id);
  return { ...metadata, title: symbol?.name ?? metadata.title };
}
