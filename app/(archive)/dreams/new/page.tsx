"use client";

import { CalendarDays, Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useController, useForm, useWatch } from "react-hook-form";
import { BackButton } from "@/components/back-button";
import { Button } from "@/components/button";
import { SelectableButton } from "@/components/selectable-button";
import { mockSymbols } from "@/data/mock-symbols";
import { Mood } from "@/types/dream";
import { FormError } from "@/components/form-error";
import { dreamSchema, type DreamFormValues } from "@/lib/validation/dream";

const availableSymbols = mockSymbols.slice(0, 3);

export default function NewDreamPage() {
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<DreamFormValues>({
    resolver: zodResolver(dreamSchema),
    defaultValues: { title: "", date: "2026-09-14", plot: "", symbols: [] },
  });
  const { field: moodField } = useController({ name: "mood", control });
  const { field: symbolsField } = useController({ name: "symbols", control });
  const plot = useWatch({ control, name: "plot" });
  const selectedSymbols = symbolsField.value;

  function toggleSymbol(symbolId: string) {
    symbolsField.onChange(
      selectedSymbols.includes(symbolId)
        ? selectedSymbols.filter((id) => id !== symbolId)
        : [...selectedSymbols, symbolId],
    );
  }

  function onSubmit(values: DreamFormValues) {
    console.log("New dream", values);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <BackButton label="Back to dreams" />

      <h1 className="mt-5 font-handwritten text-4xl leading-none text-ink sm:text-5xl">
        Record a dream
      </h1>

      <form className="mt-8 space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
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
            {...register("title")}
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "title-error" : undefined}
            placeholder="A short title for your dream..."
            type="text"
          />
          <FormError id="title-error" message={errors.title?.message} />
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
              {...register("date")}
              aria-invalid={!!errors.date}
              aria-describedby={errors.date ? "date-error" : undefined}
              type="date"
            />
          </div>
          <FormError id="date-error" message={errors.date?.message} />
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
            {...register("plot")}
            aria-invalid={!!errors.plot}
            aria-describedby={errors.plot ? "plot-error plot-count" : "plot-count"}
            placeholder="Describe your dream..."
          />
          <FormError id="plot-error" message={errors.plot?.message} />
          <p id="plot-count" className="mt-1 text-right font-base text-xs text-ink-muted">
            {plot.length}/3000
          </p>
        </div>

        <fieldset aria-invalid={!!errors.mood} aria-describedby={errors.mood ? "mood-error" : undefined}>
          <legend className="font-base text-sm font-bold text-ink">Mood</legend>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Object.values(Mood).map((moodOption, index) => {
              const isSelected = moodField.value === moodOption;

              return (
                  <SelectableButton
                    className="w-full justify-center"
                    key={moodOption}
                    ref={index === 0 ? moodField.ref : undefined}
                    onBlur={moodField.onBlur}
                    onClick={() => moodField.onChange(moodOption)}
                    isSelected={isSelected}
                  >
                    {moodOption}
                  </SelectableButton>
              );
            })}
          </div>
          <FormError id="mood-error" message={errors.mood?.message} />
        </fieldset>

        <fieldset aria-invalid={!!errors.symbols} aria-describedby={errors.symbols ? "symbols-error" : undefined}>
          <legend className="font-base text-sm font-bold text-ink">
            Symbols
          </legend>
          <div className="mt-2 flex flex-wrap gap-3">
            {availableSymbols.map((symbol, index) => {
              const isSelected = selectedSymbols.includes(symbol.id);

              return (
                  <SelectableButton
                    key={symbol.id}
                    ref={index === 0 ? symbolsField.ref : undefined}
                    onBlur={symbolsField.onBlur}
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
          <FormError id="symbols-error" message={errors.symbols?.message} />
        </fieldset>

        <div className="flex justify-end pt-3">
          <Button className="w-full disabled:opacity-60 sm:w-auto" type="submit" disabled={isSubmitting}>
            Record dream
          </Button>
        </div>
      </form>
    </div>
  );
}
