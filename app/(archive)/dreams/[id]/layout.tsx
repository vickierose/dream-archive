import { getLocale, getTranslations } from "next-intl/server";
import { FormActions } from "@/components/ui/form-actions";
import { Panel } from "@/components/ui/panel";
import { formatDreamDate } from "@/lib/date";
import { Pencil } from "lucide-react";
import { DeleteDreamButton } from "@/components/dreams/delete-dream-button";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { DreamLink } from "@/components/dreams/dream-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { getArchive } from "@/lib/data/archive";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";

export default async function DreamLayout({
  params,
  children,
}: LayoutProps<"/dreams/[id]">) {
  const t = await getTranslations();
  const locale = await getLocale();
  const { id } = await params;
  const { dreams: archiveDreams, symbols: availableSymbols } =
    await getArchive();
  const dream = archiveDreams.find((entry) => entry.id === id);

  if (!dream) {
    return (
      <EmptyState
        title={t("Dreams.notFound")}
        action={<BackButton label={t("Dreams.back")} />}
      />
    );
  }

  const dreamSymbols = dream.symbols.flatMap((symbolId) => {
    const symbol = availableSymbols.find(({ id }) => id === symbolId);

    return symbol ? [symbol] : [];
  });
  const connectedDreams = archiveDreams
    .filter(
      (otherDream) =>
        otherDream.id !== dream.id &&
        otherDream.symbols.some((symbolId) => dream.symbols.includes(symbolId)),
    )
    .map((otherDream) => ({
      dream: otherDream,
      sharedSymbols: otherDream.symbols
        .filter((symbolId) => dream.symbols.includes(symbolId))
        .flatMap((symbolId) => {
          const symbol = availableSymbols.find(({ id }) => id === symbolId);

          return symbol ? [symbol.name] : [];
        }),
    }));

  return (
    <>
      <div className="mx-auto max-w-3xl">
        <div className="mb-4">
          <BackButton />
        </div>
        <PageHeader
          title={dream.title}
          description={formatDreamDate(dream.date, locale)}
        />

        <article className="relative border border-paper-dark bg-paper p-6 shadow-paper sm:p-8">
          <Chip className="w-fit absolute -top-2 left-6">{t(`Mood.${dream.mood}`)}</Chip>
          <span
            aria-hidden="true"
            className="absolute -right-1 top-[-1.1rem] h-9 w-4 rounded-full border-2 border-line bg-transparent"
          />
          <p className="whitespace-pre-wrap font-handwritten text-lg leading-relaxed text-ink sm:text-xl">
            {dream.plot}
          </p>
        </article>

        <section className="mt-8" aria-labelledby="symbols-heading">
          <SectionHeading id="symbols-heading" title={t("Navigation.symbols")} />
          <ul className="mt-4 flex flex-wrap gap-4">
            {dreamSymbols.map((symbol) => (
              <li className="w-16" key={symbol.id}>
                <Link
                  href={`/symbols/${symbol.id}`}
                  className="text-center flex flex-col items-center"
                >
                  <span className="grid size-12 place-items-center rounded-full border border-line bg-lavender-pale text-2xl shadow-sm">
                    <span aria-hidden="true">{symbol.emoji}</span>
                  </span>
                  <span className="mt-1 block font-base text-xs font-semibold text-ink-soft">
                    {symbol.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8" aria-labelledby="connections-heading">
          <SectionHeading
            description={t("Dreams.shares")}
            id="connections-heading"
            title={t("Dreams.connections")}
          />
          <Panel padding="none" className="mt-4">
            {connectedDreams.length > 0 ? (
              connectedDreams.map(
                ({ dream: connectedDream, sharedSymbols }) => (
                  <DreamLink
                    dream={connectedDream}
                    key={connectedDream.id}
                    sharedSymbols={sharedSymbols}
                  />
                ),
              )
            ) : (
              <p className="p-6 text-sm leading-relaxed text-ink-soft">
                {t("Dreams.noShared")}
              </p>
            )}
          </Panel>
        </section>

        <FormActions className="mt-8">
          <Button
            href={`/dreams/${dream.id}/edit`}
            size="sm"
            variant="secondary"
          >
            <Pencil aria-hidden="true" size={15} />
            {t("Common.edit")}
          </Button>
          <DeleteDreamButton dreamId={dream.id} />
        </FormActions>
      </div>
      {children}
    </>
  );
}
