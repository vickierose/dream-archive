import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { getPageMetadata, getSiteUrl } from "@/lib/metadata";
import { HomeHeader, HomeFooter } from "@/components/home/home-navigation";
import { HomeHero } from "@/components/home/home-hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { DreamPatterns } from "@/components/home/dream-patterns";
import { PrivacyCallout } from "@/components/home/privacy-callout";

export async function generateMetadata(): Promise<Metadata> {
  const [page, locale, t] = await Promise.all([
    getPageMetadata("home"),
    getLocale(),
    getTranslations("Common"),
  ]);
  const siteUrl = getSiteUrl();
  const { title, description } = page;

  return {
    title: { absolute: title },
    description,
    ...(siteUrl && { alternates: { canonical: siteUrl.href } }),
    openGraph: {
      type: "website",
      siteName: t("appName"),
      title,
      description,
      locale: locale === "uk" ? "uk_UA" : "en_US",
      ...(siteUrl && { url: siteUrl.href }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function Home() {
  return (
    <div className="grid min-h-svh grid-cols-1 bg-paper text-ink">
      <HomeHeader />
      <main className="col-start-1 row-start-1 min-w-0">
        <HomeHero />
        <HowItWorks />
        <DreamPatterns />
        <PrivacyCallout />
      </main>
      <HomeFooter />
    </div>
  );
}
