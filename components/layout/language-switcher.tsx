"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { setLocale } from "@/lib/actions/locale";
import { Languages } from "lucide-react";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <div className={`relative rounded-control text-ink-soft hover:bg-lavender-light hover:text-ink ${className}`}>
        <Languages
          aria-hidden="true"
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
        />
        <select
          aria-label={t("Common.language")}
          aria-busy={pending}
          value={locale}
          disabled={pending}
          className="control-interaction w-full appearance-none rounded-control bg-transparent py-2.5 pl-10.5 pr-3 font-base text-sm text-inherit"
          onChange={(event) => {
            const value = event.target.value;
            setError(false);
            startTransition(async () => {
              try {
                await setLocale(value);
              } catch {
                setError(true);
              }
            });
          }}
        >
          <option value="en" lang="en" className="bg-paper-light text-ink">
            EN
          </option>
          <option value="uk" lang="uk" className="bg-paper-light text-ink">
            UA
          </option>
        </select>
      </div>
      {error && (
        <p role="alert" className="text-xs text-danger">
          {t("Common.languageError")}
        </p>
      )}
    </div>
  );
}
