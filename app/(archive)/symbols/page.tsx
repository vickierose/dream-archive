import { getPageMetadata } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";
import { SymbolCard } from "@/components/symbols/symbol-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getArchive } from "@/lib/data/archive";
import { PageHeader } from "@/components/layout/page-header";

export default async function SymbolsPage() {
  const t = await getTranslations();
  const { dreams: archiveDreams, symbols: availableSymbols } =
    await getArchive();
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title={t("Navigation.symbols")}
        description={t("Symbols.description")}
      />

      {availableSymbols.length === 0 ? (
        <EmptyState
          title={t("Symbols.empty")}
          description={t("Symbols.emptyDescription")}
        />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(0,10rem))] gap-x-6 gap-y-8 justify-center sm:justify-start">
          {availableSymbols.map((symbol) => (
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
    </div>
  );
}

export async function generateMetadata() {
  return getPageMetadata("symbols");
}
