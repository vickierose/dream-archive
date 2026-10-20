import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export type MetadataPage =
  | "home"
  | "login"
  | "signup"
  | "forgotPassword"
  | "resetPassword"
  | "dreams"
  | "newDream"
  | "dream"
  | "editDream"
  | "symbols"
  | "symbol"
  | "explore";

// Use the public production origin, never a request host or preview deployment URL.
export function getSiteUrl(): URL | undefined {
  const value = process.env.SITE_URL;
  if (!value) return undefined;

  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("SITE_URL must be an absolute HTTP or HTTPS URL.");
  }
  return new URL(url.origin);
}

export const privateRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  noarchive: true,
};

export async function getPageMetadata(page: MetadataPage) {
  const t = await getTranslations("Metadata");
  return {
    title: t(`${page}.title`),
    description: t(`${page}.description`),
  };
}
