import Link from "next/link";
import { BackButton } from "@/components/back-button";
import { Chip } from "@/components/chip";
import { DreamLink } from "@/components/dream-link";
import { SectionHeading } from "@/components/section-heading";
import { mockDreams } from "@/data/mock-dreams";
import { mockRelatedSymbols } from "@/data/mock-related-symbols";
import { mockSymbols } from "@/data/mock-symbols";

export default async function SymbolPage({
  params,
}: PageProps<"/symbols/[id]">) {
  const { id } = await params;
  const symbol = mockSymbols.find((symbol) => symbol.id === id);

  if (!symbol) {
    return (
      <div className="mx-auto max-w-3xl">
        <BackButton fallbackHref="/symbols" />
        <SectionHeading as="h1" className="mt-6" title="Symbol not found" />
      </div>
    );
  }

  const dreams = mockDreams.filter((dream) => dream.symbols.includes(id));
  const frequentSymbols = mockSymbols
    .filter((otherSymbol) => otherSymbol.id !== id)
    .map((otherSymbol) => ({
      ...otherSymbol,
      count: dreams.filter((dream) => dream.symbols.includes(otherSymbol.id))
        .length,
    }))
    .filter(({ count }) => count > 0)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  const relatedSymbols = (mockRelatedSymbols[id] ?? []).flatMap((relatedId) => {
    const related = mockSymbols.find((symbol) => symbol.id === relatedId);
    return related ? [related] : [];
  });
  const symbolLinkClasses =
    "rounded-full transition hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple";

  return (
    <div className="relative mx-auto max-w-3xl pb-28">
      <BackButton fallbackHref="/symbols" />

      <header className="mt-6 flex items-start gap-4">
        <span aria-hidden="true" className="text-4xl leading-none sm:text-5xl">
          {symbol.emoji}
        </span>
        <SectionHeading
          as="h1"
          title={symbol.name}
          description={`Appeared in ${dreams.length} ${dreams.length === 1 ? "dream" : "dreams"}`}
        />
      </header>

      <section className="mt-10" aria-labelledby="frequent-symbols-heading">
        <SectionHeading
          id="frequent-symbols-heading"
          title="Often appears with"
        />
        {frequentSymbols.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-3">
            {frequentSymbols.map((otherSymbol) => (
              <li key={otherSymbol.id}>
                <Link
                  className={symbolLinkClasses}
                  href={`/symbols/${otherSymbol.id}`}
                >
                  <Chip>
                    {otherSymbol.name} ({otherSymbol.count})
                  </Chip>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 font-base text-sm text-ink-soft">
            No symbols have appeared alongside this one yet.
          </p>
        )}
      </section>

      <section className="mt-8" aria-labelledby="related-symbols-heading">
        <SectionHeading id="related-symbols-heading" title="Related symbols" />
        {relatedSymbols.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-3">
            {relatedSymbols.map((related) => (
              <li key={related.id}>
                <Link
                  className={symbolLinkClasses}
                  href={`/symbols/${related.id}`}
                >
                  <Chip>{related.name}</Chip>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 font-base text-sm text-ink-soft">
            No related symbols yet.
          </p>
        )}
      </section>

      <section className="mt-8" aria-labelledby="symbol-dreams-heading">
        <SectionHeading id="symbol-dreams-heading" title="Dreams" />
        <div className="mt-3">
          {dreams.length > 0 ? (
            dreams.map((dream) => (
              <DreamLink
                key={dream.id}
                dream={dream}
                thumbnailSrc="/night-view.png"
              />
            ))
          ) : (
            <p className="font-base text-sm text-ink-soft">
              This symbol hasn’t appeared in a dream yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
