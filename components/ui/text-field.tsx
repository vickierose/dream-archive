import type { ComponentProps, ReactNode } from "react";
import { FormField, type FormFieldProps } from "@/components/ui/form-field";

type SharedProps = Omit<FormFieldProps, "children" | "className"> & {
  wrapperClassName?: string;
};

type TextFieldProps = SharedProps &
  (
    | (Omit<ComponentProps<"input">, keyof SharedProps | "children"> & {
        as?: "input";
        leadingIcon?: ReactNode;
      })
    | (Omit<ComponentProps<"textarea">, keyof SharedProps | "children"> & {
        as: "textarea";
        leadingIcon?: never;
      })
  );

const controlClasses =
  "w-full rounded-control border border-line bg-paper-light py-3 font-base text-sm text-ink outline-none transition-colors duration-200 motion-reduce:transition-none placeholder:text-ink-muted focus:border-lavender-dark focus:ring-2 focus:ring-lavender-light aria-invalid:border-danger aria-invalid:focus:border-danger disabled:cursor-not-allowed disabled:opacity-50";

export function TextField({
  id,
  label,
  error,
  hint,
  hideLabel,
  wrapperClassName,
  leadingIcon,
  className = "",
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: TextFieldProps) {
  const accessibilityProps = {
    id,
    "aria-invalid": error ? true : invalid,
    "aria-describedby":
      [error && `${id}-error`, hint != null && `${id}-hint`, describedBy]
        .filter(Boolean)
        .join(" ") || undefined,
  };

  let control;
  if (props.as === "textarea") {
    const { as: Control, ...textareaProps } = props;
    control = (
      <Control
        {...textareaProps}
        {...accessibilityProps}
        className={`${controlClasses} min-h-36 resize-y px-4 ${className}`}
      />
    );
  } else {
    const { as: Control = "input", ...inputProps } = props;
    control = (
      <div className="relative">
        {leadingIcon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lavender-dark"
          >
            {leadingIcon}
          </span>
        )}
        <Control
          {...inputProps}
          {...accessibilityProps}
          className={`${controlClasses} ${leadingIcon ? "pl-10 pr-4" : "px-4"} ${className}`}
        />
      </div>
    );
  }

  return (
    <FormField
      id={id}
      label={label}
      error={error}
      hint={hint}
      hideLabel={hideLabel}
      className={wrapperClassName}
    >
      {control}
    </FormField>
  );
}
