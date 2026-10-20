"use client";

import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ComponentProps } from "react";
import { TextField } from "@/components/ui/text-field";

type PasswordFieldProps = Omit<
  Extract<ComponentProps<typeof TextField>, { as?: "input" }>,
  "type" | "trailingAction"
>;

export function PasswordField(props: PasswordFieldProps) {
  const t = useTranslations("Auth");
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      trailingAction={
        <button
          type="button"
          aria-label={visible ? t("hidePassword") : t("showPassword")}
          aria-controls={props.id}
          disabled={props.disabled}
          onClick={() => setVisible((current) => !current)}
          className="absolute right-1 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-control text-ink-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-lavender-dark disabled:opacity-50"
        >
          <Icon className="size-4" aria-hidden="true" />
        </button>
      }
    />
  );
}
