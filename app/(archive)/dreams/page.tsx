import { Plus } from "lucide-react";
import Link from "next/link";
import { DreamCard } from "@/components/dream-card";

const dreams = [
  {
    id: "house-by-the-sea",
    title: "The House by the Sea",
    date: "September 14, 2026",
    mood: "Unsettling",
    symbols: ["forest", "moon", "clouds"],
  },
  {
    id: "snowy-mountain",
    title: "The Snowy Mountain",
    date: "August 21, 2026",
    mood: "Peaceful",
    symbols: ["snow", "moon"],
  },
];

export default function DreamsPage() {
  return (
    <section className="relative min-h-full overflow-hidden px-6 py-4 sm:px-10 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-5 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mt-1 font-handwritten text-4xl leading-none text-ink sm:text-5xl">
              Your Dreams
            </h1>
            <p className="mt-2 font-base text-sm text-ink-soft">
              27 dreams · 143 symbols · last recorded 2 days ago
            </p>
          </div>

          <Link
            className="inline-flex items-center justify-center
											 gap-2 rounded-full bg-purple px-5 py-3
											 font-base text-sm font-semibold text-white 
											 transition hover:bg-purple-dark "
            href="/dreams/new"
          >
            <Plus aria-hidden="true" size={18} />
            Record a dream
          </Link>
        </header>

        <div className="mt-5 grid max-w-2xl gap-6 sm:grid-cols-2">
          {dreams.map((dream) => (
            <DreamCard key={dream.id} {...dream} />
          ))}
        </div>
      </div>
    </section>
  );
}
