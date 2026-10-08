import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getArchive } from "@/lib/data/archive";
import { DreamCard } from "@/components/dreams/dream-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";

export default async function DreamsPage() {
  const { dreams: archiveDreams, symbols: availableSymbols } =
    await getArchive();
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Your Dreams"
        description={`${archiveDreams.length} dreams · ${availableSymbols.length} symbols`}
        action={
          <Button href="/dreams/new">
            <Plus aria-hidden="true" size={18} />
            Record a dream
          </Button>
        }
      />
      {archiveDreams.length === 0 ? (
        <EmptyState
          title="No dreams yet"
          description="Record your first dream to begin."
        />
      ) : (
        <div className="grid max-w-4xl gap-x-6 gap-y-8 sm:grid-cols-3">
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
