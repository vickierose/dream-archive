import { formatDreamDate } from "@/lib/date";
import { CalendarDays } from "lucide-react";
import { TapedCard } from "@/components/ui/taped-card";
import { Chip } from "@/components/ui/chip";
import { Heading } from "@/components/ui/heading";
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
  const visibleSymbols = dreamSymbols.length > 4 ? dreamSymbols.slice(0, 3) : dreamSymbols;
  const remainingCount = dreamSymbols.length - visibleSymbols.length;

  return (
    <TapedCard
      label={`Read dream: ${dream.title}`}
      className="block"
      size="normal"
      href={`/dreams/${dream.id}`}
    >
      <section>
        <Heading as="h2" size="subsection" className="pr-3">
          {dream.title}
        </Heading>
        <p className="mt-3 flex items-center gap-1.5 font-base text-xs font-semibold text-ink-soft">
          <CalendarDays aria-hidden="true" size={14} />
          {formatDreamDate(dream.date)}
        </p>

        <div
          aria-label={`Symbols: ${dreamSymbols.map(({ name }) => name).join(", ")}`}
          className="mt-6 flex gap-3"
        >
          {visibleSymbols.map((symbol) => (
            <span
              className="grid size-9 place-items-center rounded-full border border-line bg-lavender-pale "
              key={symbol.id}
              title={symbol.name}
            >
              <span aria-hidden="true" className="text-xl leading-none">
                {symbol.emoji}
              </span>
            </span>
          ))}
          {remainingCount > 0 && (
            <span
              className="grid size-9 place-items-center rounded-full border border-line bg-lavender-pale font-base text-sm font-semibold text-ink-soft"
              aria-label={`${remainingCount} more symbols`}
              title={dreamSymbols.slice(3).map(({ name }) => name).join(", ")}
            >
              +{remainingCount}
            </span>
          )}
        </div>

        <Chip className="mt-6">{dream.mood}</Chip>
      </section>
    </TapedCard>
  );
}
