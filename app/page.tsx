import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { getPageMetadata, getSiteUrl } from "@/lib/metadata";
import { MoveRight } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Illustration } from "@/components/layout/illustration";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export async function generateMetadata(): Promise<Metadata> {
  const [page, locale, t] = await Promise.all([
    getPageMetadata("home"),
    getLocale(),
    getTranslations("Common"),
  ]);
  const siteUrl = getSiteUrl();
  const { title, description } = page;
  const images = siteUrl
    ? [{ url: new URL("/night-view.png", siteUrl).href, alt: t("appName") }]
    : undefined;

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
      ...(siteUrl && { url: siteUrl.href, images }),
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title,
      description,
      ...(images && { images }),
    },
  };
}

export default function Home() {
  const t = useTranslations();
  return (
    <main className="relative flex min-h-svh flex-col bg-paper md:grid md:grid-cols-3">
      <div className="absolute right-4 top-5 z-10 md:right-8 md:top-6">
        <LanguageSwitcher className="max-md:bg-night/40 max-md:text-white max-md:hover:bg-night/60" />
      </div>
      <section className="relative h-[clamp(10rem,32svh,20rem)] shrink-0 md:col-span-2 md:h-auto md:min-h-svh">
        <Illustration sizes="(min-width: 48rem) 66.67vw, 100vw" />
      </section>

      <section
        className="relative flex flex-1 flex-col justify-center bg-paper px-6 py-8 sm:px-10 md:px-8 md:pb-12 md:pt-24 md:shadow-paper-edge lg:px-12 xl:px-16"
      >
        <div className="mx-auto w-full max-w-md">
          <Heading as="h1">{t("Common.appName")}</Heading>

          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
            {t("Home.intro")}
          </p>

          <Button href="/login" className="mt-8">
            {t("Home.enter")}
            <MoveRight aria-hidden="true" size={16} />
          </Button>
        </div>
      </section>
    </main>
  );
}
