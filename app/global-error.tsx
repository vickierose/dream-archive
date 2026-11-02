"use client";

import { useState, useSyncExternalStore } from "react";
import { ErrorRecovery, type ErrorBoundaryProps } from "@/components/ui/error-recovery";
import { defaultLocale, isAppLocale, type AppLocale } from "@/i18n/config";
import en from "@/messages/en.json";
import uk from "@/messages/uk.json";
import "./globals.css";

const messages = { en: en.RouteError, uk: uk.RouteError };

function subscribeToLanguage(onChange: () => void) {
  window.addEventListener("languagechange", onChange);
  return () => window.removeEventListener("languagechange", onChange);
}

function browserLocale(): AppLocale {
  for (const language of navigator.languages) {
    const locale = language.split("-")[0];
    if (isAppLocale(locale)) return locale;
  }
  return defaultLocale;
}

const serverLocale = () => defaultLocale;

export default function GlobalError({ retry }: ErrorBoundaryProps) {
  // The root layout and its locale provider may have failed. Use browser language
  // as a fallback and let the user choose without requiring any server request.
  const preferredLocale = useSyncExternalStore(subscribeToLanguage, browserLocale, serverLocale);
  const [chosenLocale, setChosenLocale] = useState<AppLocale | null>(null);
  const locale = chosenLocale ?? preferredLocale;
  const copy = messages[locale];

  return (
    <html lang={locale}>
      <head><title>{copy.title}</title></head>
      <body className="min-h-svh bg-paper-light text-ink" style={{ fontFamily: "system-ui, sans-serif" }}>
        <div className="flex justify-end p-4">
          <label className="flex items-center gap-2 text-sm">
            {copy.language}
            <select
              value={locale}
              onChange={(event) => {
                if (isAppLocale(event.target.value)) setChosenLocale(event.target.value);
              }}
              className="focus-ring rounded-control border border-line bg-paper-light px-3 py-2"
            >
              <option value="en" lang="en">English</option>
              <option value="uk" lang="uk">Українська</option>
            </select>
          </label>
        </div>
        <main><ErrorRecovery retry={retry} messages={copy} /></main>
      </body>
    </html>
  );
}
