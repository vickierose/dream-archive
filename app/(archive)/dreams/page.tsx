import { getPageMetadata } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getArchive } from "@/lib/data/archive";
import { DreamCard } from "@/components/dreams/dream-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { ArchiveFilters } from "@/components/ui/archive-filters";
import { Pagination } from "@/components/ui/pagination";
import { ArchiveListTransition } from "@/components/ui/archive-list-transition";
import {
  filterDreams,
  listHref,
  paginate,
  queryText,
  queryValues,
  type ListSearchParams,
} from "@/lib/archive-list";

export default async function DreamsPage({
  searchParams,
}: {
  searchParams: Promise<ListSearchParams>;
}) {
  const t = await getTranslations();
  const { dreams: archiveDreams, symbols: availableSymbols } =
    await getArchive();
  const params = await searchParams;
  const query = queryText(params);
  const moods = queryValues(params.mood);
  const symbols = queryValues(params.symbol);
  const filtered = filterDreams(archiveDreams, query, moods, symbols);
  const { items, page, pages } = paginate(filtered, params.page, 20);
  if (params.page !== undefined && params.page !== String(page)) {
    redirect(listHref("/dreams", params, page));
  }
  return (
    <div className="mx-auto max-w-5xl pb-18 md:pb-0">
      <PageHeader
        title={t("Dreams.title")}
        description={t("Dreams.summary", {
          dreams: archiveDreams.length,
          symbols: availableSymbols.length,
        })}
        action={
          <div className="hidden md:block">
            <Button href="/dreams/new">
              <Plus aria-hidden="true" size={18} />
              {t("Dreams.record")}
            </Button>
          </div>
        }
      />
      <ArchiveListTransition>
        <ArchiveFilters
          key={JSON.stringify([query, moods, symbols, page])}
          path="/dreams"
          query={query}
          moods={moods}
          symbols={symbols}
          availableSymbols={availableSymbols}
        />
        <Link
          href="/dreams/new"
          aria-label={t("Dreams.record")}
          className="control-interaction fixed right-4 bottom-[calc(7.25rem+env(safe-area-inset-bottom))] z-30 flex size-14 items-center justify-center rounded-full bg-purple text-paper-light shadow-paper-raised hover:bg-purple-dark md:hidden"
        >
          <Plus aria-hidden="true" size={28} strokeWidth={1.75} />
        </Link>
        {archiveDreams.length === 0 ? (
          <EmptyState
            title={t("Dreams.empty")}
            description={t("Dreams.emptyDescription")}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={t("ArchiveList.noResults")}
            description={t("ArchiveList.noResultsDescription")}
          />
        ) : (
          <div className="grid max-w-4xl gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3">
            {items.map((dream) => (
              <DreamCard
                availableSymbols={availableSymbols}
                dream={dream}
                key={dream.id}
              />
            ))}
          </div>
        )}
        <Pagination path="/dreams" params={params} page={page} pages={pages} />
      </ArchiveListTransition>
    </div>
  );
}

export async function generateMetadata() {
  return getPageMetadata("dreams");
}
