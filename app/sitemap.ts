import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  // Avoid publishing localhost or an invented domain when not configured.
  return siteUrl ? [{ url: siteUrl.href }] : [];
}
