import { CalendarDays } from "lucide-react";
import { TapedCard } from "@/components/taped-card";
import { Chip } from "@/components/chip";
import type { Dream } from "@/types/dream";
import type { Symbol } from "@/types/symbol";

type DreamCardProps = {
  dream: Dream;
  availableSymbols: Symbol[];
};

export function DreamCard({ dream, availableSymbols }: DreamCardProps) {
  const dreamSymbols = dream.symbols.flatMap((symbolId) => {
    const symbol = availableSymbols.find(({ id }) => id === symbolId);

    return symbol ? [symbol] : [];
  });

  return (
    <TapedCard
      label={`Read dream: ${dream.title}`}
      className="block"
      size="normal"
      href={`/dreams/${dream.id}`}
    >
      <section>
        <h2 className="pr-3 font-handwritten text-2xl leading-none text-ink">
          {dream.title}
        </h2>
        <p className="mt-3 flex items-center gap-1.5 font-base text-xs font-semibold text-ink-soft">
          <CalendarDays aria-hidden="true" size={14} />
          {dream.date}
        </p>

        <div
          aria-label={`Symbols: ${dreamSymbols.map(({ name }) => name).join(", ")}`}
          className="mt-6 flex gap-3"
        >
          {dreamSymbols.map((symbol) => (
            <span
              className="grid size-9 place-items-center rounded-full bg-white/45"
              key={symbol.id}
              title={symbol.name}
            >
              <span aria-hidden="true" className="text-xl leading-none">
                {symbol.emoji}
              </span>
            </span>
          ))}
        </div>

        <Chip className="mt-6">
          {dream.mood}
        </Chip>
      </section>
    </TapedCard>
  );
}
