import { Pencil, Trash2 } from "lucide-react";
import { BackButton } from "@/components/back-button";
import { Button } from "@/components/button";
import { Chip } from "@/components/chip";
import { DreamLink } from "@/components/dream-link";
import { SectionHeading } from "@/components/section-heading";
import { mockDreams } from "@/data/mock-dreams";
import { mockSymbols } from "@/data/mock-symbols";

export default async function DreamPage({ params }: PageProps<"/dreams/[id]">) {
  const { id } = await params;
  const dream = mockDreams.find((mockDream) => mockDream.id === id);

  if (!dream) {
    return (
      <div className="grid min-h-full place-items-center">
        <div className="text-center">
          <h1 className="font-handwritten text-5xl text-ink">
            Dream not found
          </h1>
          <div className="mt-5">
            <BackButton label="Back to dreams" />
          </div>
        </div>
      </div>
    );
  }

  const dreamSymbols = dream.symbols.flatMap((symbolId) => {
    const symbol = mockSymbols.find(({ id }) => id === symbolId);

    return symbol ? [symbol] : [];
  });
  const connectedDreams = mockDreams
    .filter(
      (otherDream) =>
        otherDream.id !== dream.id &&
        otherDream.symbols.some((symbolId) => dream.symbols.includes(symbolId)),
    )
    .map((otherDream) => ({
      dream: otherDream,
      sharedSymbols: otherDream.symbols
        .filter((symbolId) => dream.symbols.includes(symbolId))
        .flatMap((symbolId) => {
          const symbol = mockSymbols.find(({ id }) => id === symbolId);

          return symbol ? [symbol.name] : [];
        }),
    }));

  return (
    <>
      <div className="mx-auto max-w-3xl">
        <BackButton label="Back to dreams" />

        <header className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-handwritten text-4xl leading-none text-ink sm:text-5xl">
              {dream.title}
            </h1>
            <p className="mt-3 font-base text-sm font-semibold text-ink-soft">
              {dream.date}
            </p>
          </div>
          <Chip className="w-fit">
            {dream.mood}
          </Chip>
        </header>

        <article className="relative mt-6 border border-paper-dark bg-paper p-6 shadow-[0_5px_12px_rgba(68,54,83,0.08)] sm:p-8">
          <span
            aria-hidden="true"
            className="absolute -right-1 top-[-1.1rem] h-9 w-4 rounded-full border-2 border-line bg-transparent"
          />
          <p className="whitespace-pre-wrap font-handwritten text-lg leading-relaxed text-ink sm:text-xl">
            {dream.plot}
          </p>
        </article>

        <section className="mt-8" aria-labelledby="symbols-heading">
          <SectionHeading id="symbols-heading" title="Symbols" />
          <ul className="mt-3 flex flex-wrap gap-4">
            {dreamSymbols.map((symbol) => (
              <li
                className="w-16 text-center flex flex-col items-center"
                key={symbol.id}
              >
                <span className="grid size-12 place-items-center rounded-full border border-line bg-lavender-pale text-2xl shadow-sm">
                  <span aria-hidden="true">{symbol.emoji}</span>
                </span>
                <span className="mt-1 block font-base text-xs font-semibold text-ink-soft">
                  {symbol.name}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8" aria-labelledby="connections-heading">
          <SectionHeading
            description="This dream shares symbols with:"
            id="connections-heading"
            title="Dream connections"
          />
          <div className="mt-3 overflow-hidden rounded-xl border border-line bg-paper-light">
            {connectedDreams.length > 0 ? (
              connectedDreams.map(
                ({ dream: connectedDream, sharedSymbols }) => (
                  <DreamLink
                    dream={connectedDream}
                    key={connectedDream.id}
                    sharedSymbols={sharedSymbols}
                  />
                ),
              )
            ) : (
              <p className="px-5 py-4 font-base text-sm text-ink-soft">
                No shared symbols yet.
              </p>
            )}
          </div>
        </section>

        <div className="mt-7 flex justify-end gap-3">
          <Button size="sm" variant="secondary">
            <Pencil aria-hidden="true" size={15} />
            Edit
          </Button>
          <Button size="sm" variant="danger">
            <Trash2 aria-hidden="true" size={15} />
            Delete
          </Button>
        </div>
      </div>
    </>
  );
}
