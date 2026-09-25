import { Sparkles } from "lucide-react";
import { SymbolCard } from "@/components/symbol-card";
import { mockDreams } from "@/data/mock-dreams";
import { mockSymbols } from "@/data/mock-symbols";

export default function SymbolsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <header className="relative pb-8 pr-12">
        <h1 className="mt-1 font-handwritten text-4xl leading-none text-ink sm:text-5xl">
          Symbols
        </h1>
        <p className="mt-2 font-base text-sm text-ink-soft">
          The building blocks of your dreams.
        </p>
        <Sparkles
          aria-hidden="true"
          className="absolute right-0 top-0 size-10 text-lavender"
          strokeWidth={1}
        />
      </header>

      <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(0,10rem))] gap-x-5 gap-y-8 sm:gap-x-6">
        {mockSymbols.map((symbol) => (
          <SymbolCard
            key={symbol.id}
            symbol={symbol}
            dreamCount={mockDreams.filter((dream) => dream.symbols.includes(symbol.id)).length}
          />
        ))}
      </div>
    </div>
  );
}
