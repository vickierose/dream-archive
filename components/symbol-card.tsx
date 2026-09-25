import { TapedCard } from "@/components/taped-card";
import type { Symbol } from "@/types/symbol";

type SymbolCardProps = {
  symbol: Symbol;
  dreamCount: number;
};

export function SymbolCard({ symbol, dreamCount }: SymbolCardProps) {
  const countLabel = `${dreamCount} ${dreamCount === 1 ? "dream" : "dreams"}`;

  return (
    <TapedCard
      className="flex flex-col items-center justify-center text-center"
      size="sm"
      href={`/symbols/${symbol.id}`}
      label={`${symbol.name}: ${countLabel}`}
    >
      <span aria-hidden="true" className="text-4xl leading-none">
        {symbol.emoji}
      </span>
      <h2 className="mt-4 font-handwritten text-2xl leading-tight text-ink">
        {symbol.name}
      </h2>
      <p className="mt-1 font-base text-sm text-ink-soft">{countLabel}</p>
    </TapedCard>
  );
}
