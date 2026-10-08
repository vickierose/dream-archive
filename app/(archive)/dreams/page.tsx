import { Plus } from "lucide-react";
import { Button } from "@/components/button";
import { getArchive } from "@/lib/data/archive";
import { DreamCard } from "@/components/dream-card";
import { EmptyState } from "@/components/empty-state";

export default async function DreamsPage() {
  const { dreams: archiveDreams, symbols: availableSymbols } = await getArchive();
  return (
    <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-5 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mt-1 font-handwritten text-4xl leading-none text-ink sm:text-5xl">
              Your Dreams
            </h1>
            <p className="mt-2 font-base text-sm text-ink-soft">
              {archiveDreams.length} dreams · {availableSymbols.length} symbols
            </p>
          </div>

          <Button href="/dreams/new">
            <Plus aria-hidden="true" size={18} />
            Record a dream
          </Button>
        </header>

        {archiveDreams.length === 0 ? (
          <EmptyState
            title="No dreams yet"
            description="Record your first dream to begin."
          />
        ) : (
        <div className="mt-5 grid max-w-2xl gap-6 sm:grid-cols-2">
          {archiveDreams.map((dream) => (
            <DreamCard
              availableSymbols={availableSymbols}
              dream={dream}
              key={dream.id}
            />
          ))}
        </div>
        )}
    </div>
  );
}
