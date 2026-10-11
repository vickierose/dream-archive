"use client";

import { useTranslations } from "next-intl";

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
import { createDreamSchema, type DreamFormValues } from "@/lib/validation/dream";
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
  submitLabel,
}: DreamFormProps) {
  const t = useTranslations();
  const validation = useTranslations("Validation");
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DreamFormValues>({
    resolver: zodResolver(createDreamSchema(validation)),
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
        label={t("Dreams.fieldTitle")}
        placeholder={t("Dreams.titlePlaceholder")}
        type="text"
        error={errors.title?.message}
      />
      <TextField
        {...register("date")}
        id="date"
        label={t("Dreams.date")}
        type="date"
        leadingIcon={<CalendarDays size={17} />}
        error={errors.date?.message}
      />
      <TextField
        {...register("plot")}
        as="textarea"
        id="plot"
        label={t("Dreams.dream")}
        placeholder={t("Dreams.plotPlaceholder")}
        error={errors.plot?.message}
      />

      <fieldset
        aria-invalid={!!errors.mood}
        aria-describedby={errors.mood ? "mood-error" : undefined}
      >
        <legend className="field-label">{t("Dreams.mood")}</legend>
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
                {t(`Mood.${moodOption}`)}
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
        <legend className="field-label">{t("Navigation.symbols")}</legend>
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
            {t("Common.cancel")}
          </Button>
        )}
        <Button
          className="w-full sm:w-auto"
          type="submit"
          loading={isSubmitting}
          loadingLabel={t("Common.saving")}
        >
          {submitLabel ?? t("Dreams.recordSubmit")}
        </Button>
      </FormActions>
    </form>
  );
}
