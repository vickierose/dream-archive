"use client";

import { ArrowLeft, CalendarDays, Plus } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { mockSymbols } from "@/data/mock-symbols";
import { Mood } from "@/types/dream";

const availableSymbols = mockSymbols.slice(0, 3);

export default function NewDreamPage() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("2026-09-14");
  const [plot, setPlot] = useState("");
  const [mood, setMood] = useState<Mood | null>(null);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);

  function toggleSymbol(symbolId: string) {
    setSelectedSymbols((currentSymbols) =>
      currentSymbols.includes(symbolId)
        ? currentSymbols.filter((id) => id !== symbolId)
        : [...currentSymbols, symbolId],
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log("New dream", {
      title: title.trim(),
      date,
      plot,
      mood,
      symbols: selectedSymbols,
    });
  }

  return (
    <section className="relative min-h-full overflow-hidden px-6 py-4 sm:px-10 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-3xl">
        <Link
          className="inline-flex items-center gap-1.5 font-base text-sm font-bold text-ink-soft transition hover:text-purple focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple"
          href="/dreams"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Back to dreams
        </Link>

        <h1 className="mt-5 font-handwritten text-4xl leading-none text-ink sm:text-5xl">
          Record a dream
        </h1>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              className="font-base text-sm font-bold text-ink"
              htmlFor="title"
            >
              Title
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-line bg-paper-light px-4 py-3 font-base text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-lavender-dark focus:ring-2 focus:ring-lavender-light"
              id="title"
              onChange={(event) => setTitle(event.target.value)}
              placeholder="A short title for your dream..."
              required
              type="text"
              value={title}
            />
          </div>

          <div>
            <label
              className="font-base text-sm font-bold text-ink"
              htmlFor="date"
            >
              Date
            </label>
            <div className="relative mt-2">
              <CalendarDays
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lavender-dark"
                size={17}
              />
              <input
                className="w-full rounded-xl border border-line bg-paper-light py-3 pl-10 pr-4 font-base text-sm text-ink outline-none transition focus:border-lavender-dark focus:ring-2 focus:ring-lavender-light"
                id="date"
                onChange={(event) => setDate(event.target.value)}
                type="date"
                value={date}
              />
            </div>
          </div>

          <div>
            <label
              className="font-base text-sm font-bold text-ink"
              htmlFor="plot"
            >
              Dream
            </label>
            <textarea
              className="mt-2 min-h-36 w-full resize-y rounded-xl border border-line bg-paper-light px-4 py-3 font-base text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-lavender-dark focus:ring-2 focus:ring-lavender-light"
              id="plot"
              maxLength={3000}
              onChange={(event) => setPlot(event.target.value)}
              placeholder="Describe your dream..."
              value={plot}
            />
            <p className="mt-1 text-right font-base text-xs text-ink-muted">
              {plot.length}/3000
            </p>
          </div>

          <fieldset>
            <legend className="font-base text-sm font-bold text-ink">
              Mood
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Object.values(Mood).map((moodOption) => {
                const isSelected = mood === moodOption;

                return (
                  <button
                    aria-pressed={isSelected}
                    className={`rounded-full border px-4 py-3 font-base text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple ${
                      isSelected
                        ? "border-lavender-dark bg-lavender-light text-purple"
                        : "border-line bg-paper-light text-ink-soft hover:border-lavender"
                    }`}
                    key={moodOption}
                    onClick={() => setMood(moodOption)}
                    type="button"
                  >
                    {moodOption}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-base text-sm font-bold text-ink">
              Symbols
            </legend>
            <div className="mt-2 flex flex-wrap gap-3">
              {availableSymbols.map((symbol) => {
                const isSelected = selectedSymbols.includes(symbol.id);

                return (
                  <button
                    aria-pressed={isSelected}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 font-base text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple ${
                      isSelected
                        ? "border-lavender-dark bg-lavender-light text-purple"
                        : "border-line bg-paper-light text-ink-soft hover:border-lavender"
                    }`}
                    key={symbol.id}
                    onClick={() => toggleSymbol(symbol.id)}
                    type="button"
                  >
                    <span aria-hidden="true" className="text-base leading-none">
                      {symbol.emoji}
                    </span>
                    {symbol.name}
                  </button>
                );
              })}
              <button
                className="inline-flex items-center gap-2 rounded-full border border-dashed border-lavender bg-paper-light px-4 py-3 font-base text-sm font-semibold text-ink-soft transition hover:border-lavender-dark hover:text-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple"
                type="button"
              >
                <Plus aria-hidden="true" size={16} />
                Add symbol
              </button>
            </div>
          </fieldset>

          <div className="flex justify-end pt-3">
            <button
              className="w-full rounded-full bg-purple px-8 py-3 font-base text-sm font-bold text-white shadow-[0_3px_0_#4d3a65] transition hover:-translate-y-0.5 hover:bg-purple-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple sm:w-auto"
              type="submit"
            >
              Record dream
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
