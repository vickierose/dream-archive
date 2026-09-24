import { Plus } from "lucide-react";
import { Button } from "@/components/button";
import { mockDreams } from "@/data/mock-dreams";
import { mockSymbols } from "@/data/mock-symbols";
import { DreamCard } from "@/components/dream-card";

export default function DreamsPage() {
  return (
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

          <Button href="/dreams/new">
            <Plus aria-hidden="true" size={18} />
            Record a dream
          </Button>
        </header>

        <div className="mt-5 grid max-w-2xl gap-6 sm:grid-cols-2">
          {mockDreams.map((dream) => (
            <DreamCard
              availableSymbols={mockSymbols}
              dream={dream}
              key={dream.id}
            />
          ))}
        </div>
    </div>
  );
}
