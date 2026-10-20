import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Account and archive pages also emit noindex metadata. Keep them
      // crawlable so crawlers can read that directive.
      disallow: "/api/",
    },
    ...(siteUrl && { sitemap: new URL("/sitemap.xml", siteUrl).href }),
  };
}
