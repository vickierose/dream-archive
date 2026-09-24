"use client";

import { CalendarDays, Plus } from "lucide-react";
import { type FormEvent, useState } from "react";
import { BackButton } from "@/components/back-button";
import { Button } from "@/components/button";
import { SelectableButton } from "@/components/selectable-button";
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
    <div className="mx-auto max-w-3xl">
      <BackButton label="Back to dreams" />

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
          <legend className="font-base text-sm font-bold text-ink">Mood</legend>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Object.values(Mood).map((moodOption) => {
              const isSelected = mood === moodOption;

              return (
                  <SelectableButton
                    className="w-full justify-center"
                    key={moodOption}
                    onClick={() => setMood(moodOption)}
                    isSelected={isSelected}
                  >
                    {moodOption}
                  </SelectableButton>
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
                  <SelectableButton
                    key={symbol.id}
                    onClick={() => toggleSymbol(symbol.id)}
                    isSelected={isSelected}
                  >
                  <span aria-hidden="true" className="text-base leading-none">
                    {symbol.emoji}
                  </span>
                  {symbol.name}
                  </SelectableButton>
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
          <Button className="w-full sm:w-auto" type="submit">
            Record dream
          </Button>
        </div>
      </form>
    </div>
  );
}
