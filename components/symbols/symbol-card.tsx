import { TapedCard } from "@/components/ui/taped-card";
import { Heading } from "@/components/ui/heading";
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
      <Heading as="h2" size="subsection" className="mt-4">
        {symbol.name}
      </Heading>
      <p className="mt-1 font-base text-sm text-ink-soft">{countLabel}</p>
    </TapedCard>
  );
}
