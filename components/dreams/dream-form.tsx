"use client";

import { FormActions } from "@/components/ui/form-actions";
import { localToday } from "@/lib/date";
import { CalendarDays } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useController, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SelectableButton } from "@/components/ui/selectable-button";
import { DreamSymbols } from "@/components/dreams/dream-symbols";
import { Mood } from "@/types/dream";
import { FormError } from "@/components/ui/form-error";
import { TextField } from "@/components/ui/text-field";
import { dreamSchema, type DreamFormValues } from "@/lib/validation/dream";
type DreamFormProps = {
  defaultValues?: Partial<DreamFormValues>;
  onSubmit: (values: DreamFormValues) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
};

export function DreamForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Record dream",
}: DreamFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DreamFormValues>({
    resolver: zodResolver(dreamSchema),
    defaultValues: {
      title: "",
      date: localToday(),
      plot: "",
      symbols: [],
      ...defaultValues,
    },
  });
  const { field: moodField } = useController({ name: "mood", control });
  const { field: symbolsField } = useController({ name: "symbols", control });
  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register("title")}
        id="title"
        label="Title"
        placeholder="A short title for your dream..."
        type="text"
        error={errors.title?.message}
      />
      <TextField
        {...register("date")}
        id="date"
        label="Date"
        type="date"
        leadingIcon={<CalendarDays size={17} />}
        error={errors.date?.message}
      />
      <TextField
        {...register("plot")}
        as="textarea"
        id="plot"
        label="Dream"
        placeholder="Describe your dream..."
        error={errors.plot?.message}
      />

      <fieldset
        aria-invalid={!!errors.mood}
        aria-describedby={errors.mood ? "mood-error" : undefined}
      >
        <legend className="field-label">Mood</legend>
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

      <fieldset
        aria-invalid={!!errors.symbols}
        aria-describedby={errors.symbols ? "symbols-error" : undefined}
      >
        <legend className="field-label">Symbols</legend>
        <DreamSymbols
          value={symbolsField.value}
          onChange={symbolsField.onChange}
          onBlur={symbolsField.onBlur}
          buttonRef={symbolsField.ref}
        />
        <FormError id="symbols-error" message={errors.symbols?.message} />
      </fieldset>

      <FormActions>
        {onCancel && (
          <Button
            className="w-full sm:w-auto"
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          className="w-full sm:w-auto"
          type="submit"
          loading={isSubmitting}
          loadingLabel="Saving..."
        >
          {submitLabel}
        </Button>
      </FormActions>
    </form>
  );
}
