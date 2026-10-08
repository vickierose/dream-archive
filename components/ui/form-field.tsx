import type { ReactNode } from "react";
import { FormError } from "@/components/ui/form-error";

export type FormFieldProps = {
  id: string;
  label: ReactNode;
  error?: string;
  hint?: ReactNode;
  hideLabel?: boolean;
  className?: string;
  children: ReactNode;
};

export function FormField({
  id,
  label,
  error,
  hint,
  hideLabel = false,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={hideLabel ? "sr-only" : "mb-2 block field-label"}
      >
        {label}
      </label>
      {children}
      <FormError id={`${id}-error`} message={error} />
      {hint != null && (
        <p id={`${id}-hint`} className="mt-1 font-base text-xs text-ink-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
