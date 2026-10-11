export const locales = ["en", "uk"] as const;
export type AppLocale = (typeof locales)[number];
export const defaultLocale: AppLocale = "en";
export const localeCookie = "dream-archive-locale";

export function isAppLocale(value: unknown): value is AppLocale {
  return locales.some((locale) => locale === value);
}
