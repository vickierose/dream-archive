import { getPageMetadata } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { SymbolCard } from "@/components/symbols/symbol-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getArchive } from "@/lib/data/archive";
import { PageHeader } from "@/components/layout/page-header";
import { ArchiveFilters } from "@/components/ui/archive-filters";
import { Pagination } from "@/components/ui/pagination";
import { ArchiveListTransition } from "@/components/ui/archive-list-transition";
import {
  listHref,
  matchesName,
  paginate,
  queryText,
  type ListSearchParams,
} from "@/lib/archive-list";

export default async function SymbolsPage({
  searchParams,
}: {
  searchParams: Promise<ListSearchParams>;
}) {
  const t = await getTranslations();
  const { dreams: archiveDreams, symbols: availableSymbols } =
    await getArchive();
  const params = await searchParams;
  const query = queryText(params);
  const filtered = availableSymbols.filter((symbol) =>
    matchesName(symbol.name, query),
  );
  const { items, page, pages } = paginate(filtered, params.page, 40);
  if (params.page !== undefined && params.page !== String(page)) {
    redirect(listHref("/symbols", params, page));
  }
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title={t("Navigation.symbols")}
        description={t("Symbols.description")}
      />
      <ArchiveListTransition>
        <ArchiveFilters
          key={JSON.stringify([query, page])}
          path="/symbols"
          query={query}
        />

        {availableSymbols.length === 0 ? (
          <EmptyState
            title={t("Symbols.empty")}
            description={t("Symbols.emptyDescription")}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={t("ArchiveList.noResults")}
            description={t("ArchiveList.noResultsDescription")}
          />
        ) : (
          <div className="grid grid-cols-[repeat(2,minmax(0,10rem))] gap-x-6 gap-y-8 justify-center sm:grid-cols-[repeat(auto-fill,minmax(0,10rem))] sm:justify-start">
            {items.map((symbol) => (
              <SymbolCard
                key={symbol.id}
                symbol={symbol}
                dreamCount={
                  archiveDreams.filter((dream) =>
                    dream.symbols.includes(symbol.id),
                  ).length
                }
              />
            ))}
          </div>
        )}
        <Pagination path="/symbols" params={params} page={page} pages={pages} />
      </ArchiveListTransition>
    </div>
  );
}

export async function generateMetadata() {
  return getPageMetadata("symbols");
}
