import { SymbolCard } from "@/components/symbols/symbol-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getArchive } from "@/lib/data/archive";
import { PageHeader } from "@/components/layout/page-header";

export default async function SymbolsPage() {
  const { dreams: archiveDreams, symbols: availableSymbols } =
    await getArchive();
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Symbols"
        description="The building blocks of your dreams"
      />

      {availableSymbols.length === 0 ? (
        <EmptyState
          title="No symbols yet"
          description="Create one while recording a dream."
        />
      ) : (
        <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(0,10rem))] gap-x-5 gap-y-8 sm:gap-x-6">
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
