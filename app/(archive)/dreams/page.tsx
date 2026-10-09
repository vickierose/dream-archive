import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getArchive } from "@/lib/data/archive";
import { DreamCard } from "@/components/dreams/dream-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";

export default async function DreamsPage() {
  const { dreams: archiveDreams, symbols: availableSymbols } =
    await getArchive();
  return (
    <div className="mx-auto max-w-5xl pb-18 md:pb-0">
      <PageHeader
        title="Your Dreams"
        description={`${archiveDreams.length} dreams · ${availableSymbols.length} symbols`}
        action={
          <div className="hidden md:block">
            <Button href="/dreams/new">
              <Plus aria-hidden="true" size={18} />
              Record a dream
            </Button>
          </div>
        }
      />
      <Link
        href="/dreams/new"
        aria-label="Record a dream"
        className="control-interaction fixed right-4 bottom-[calc(7.25rem+env(safe-area-inset-bottom))] z-30 flex size-14 items-center justify-center rounded-full bg-purple text-paper-light shadow-paper-raised hover:bg-purple-dark md:hidden"
      >
        <Plus aria-hidden="true" size={28} strokeWidth={1.75} />
      </Link>
      {archiveDreams.length === 0 ? (
        <EmptyState
          title="No dreams yet"
          description="Record your first dream to begin."
        />
      ) : (
        <div className="grid max-w-4xl gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3">
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
