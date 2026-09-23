import { CalendarDays, CloudMoon, Moon, Sparkles, Trees } from "lucide-react";
import Link from "next/link";

type DreamCardProps = {
  id: string;
  title: string;
  date: string;
  mood: string;
  symbols: string[];
};

const symbolIcons = {
  forest: Trees,
  moon: Moon,
  snow: Sparkles,
  clouds: CloudMoon,
};

const cardPalettes = [
  "border-[#eadbcc] bg-paper-light",
  "border-[#d9cce1] bg-[#f3edf5]",
  "border-[#ecd2d8] bg-[#fcf0f1]",
] as const;

const tapeColors = ["bg-[#f6deb3]", "bg-tape", "bg-[#e8bbc7]"] as const;

const tapePositions = ["left-[26%]", "left-1/2", "left-[74%]"] as const;

const tapeRotations = ["-rotate-3", "rotate-3"] as const;

function pickRandom<T>(options: readonly T[]): T {
  return options[Math.floor(Math.random() * options.length)];
}

export function DreamCard({ id, title, date, mood, symbols }: DreamCardProps) {
  const cardPalette = pickRandom(cardPalettes);
  const tapeColor = pickRandom(tapeColors);
  const tapePosition = pickRandom(tapePositions);
  const tapeRotation = pickRandom(tapeRotations);

  return (
    <Link
      aria-label={`Read dream: ${title}`}
      className={`group relative block min-h-64 rounded-sm border p-6 pt-8 
									shadow-[0_5px_12px_rgba(68,54,83,0.08)] transition
									duration-200 hover:-translate-y-1 
									hover:shadow-[0_10px_20px_rgba(68,54,83,0.14)] 
									${cardPalette}
			`}
      href={`/dreams/${id}`}
    >
      <span
        aria-hidden="true"
        className={`absolute -top-4 h-8 w-20 -translate-x-1/2 opacity-70 ${tapeColor} ${tapePosition} ${tapeRotation}`}
      />

      <section>
        <h2 className="pr-3 font-handwritten text-2xl leading-none text-ink">
          {title}
        </h2>
        <p className="mt-3 flex items-center gap-1.5 font-base text-xs font-semibold text-ink-soft">
          <CalendarDays aria-hidden="true" size={14} />
          {date}
        </p>

        <div
          aria-label={`Symbols: ${symbols.join(", ")}`}
          className="mt-6 flex gap-3"
        >
          {symbols.map((symbol) => {
            const SymbolIcon = symbolIcons[symbol as keyof typeof symbolIcons];
            return SymbolIcon ? (
              <span
                className="grid size-9 place-items-center rounded-full bg-white/45 text-purple"
                key={symbol}
                title={symbol}
              >
                <SymbolIcon aria-hidden="true" size={20} strokeWidth={2} />
              </span>
            ) : null;
          })}
        </div>

        <span className="mt-6 inline-flex rounded-full bg-[#ead9df] px-3 py-1 font-base text-xs font-bold text-ink-soft">
          {mood}
        </span>
      </section>
    </Link>
  );
}
