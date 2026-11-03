import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MoonStar } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { PageHeader } from "@/components/layout/page-header";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { getPageMetadata, getSiteUrl } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getPageMetadata("privacy");
  const siteUrl = getSiteUrl();
  return {
    ...metadata,
    ...(siteUrl && {
      alternates: { canonical: new URL("/privacy", siteUrl).href },
    }),
  };
}

const sections = ["project", "data", "access", "providers", "cookies", "choices"] as const;

export default async function PrivacyPage() {
  const t = await getTranslations("Privacy");
  const common = await getTranslations("Common");

  return (
    <div className="min-h-svh bg-paper">
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-5 sm:px-10 sm:py-6">
        <Link
          href="/"
          className="focus-ring inline-flex items-center gap-2 font-handwritten text-2xl text-purple"
        >
          <MoonStar aria-hidden="true" size={22} />
          {common("appName")}
        </Link>
        <LanguageSwitcher />
      </header>

      <main className="mx-auto max-w-3xl px-6 pt-6 pb-12 sm:px-10 sm:pt-10">
        <Link href="/" className="text-link mb-6 inline-flex items-center gap-2 text-sm">
          <ArrowLeft aria-hidden="true" size={16} />
          {t("home")}
        </Link>
        <PageHeader title={t("title")} description={t("intro")} />

        <article className="space-y-8">
          {sections.map((section) => (
            <section key={section} aria-labelledby={`privacy-${section}`}>
              <Heading as="h2" id={`privacy-${section}`}>
                {t(`${section}Title`)}
              </Heading>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {t(`${section}Body`)}
              </p>
            </section>
          ))}
        </article>

        <section
          aria-labelledby="privacy-contact"
          className="mt-8 rounded-panel border border-line bg-lavender-pale p-6 sm:p-8"
        >
          <Heading as="h2" id="privacy-contact">{t("contactTitle")}</Heading>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            {t("contactBody")}
          </p>
          <a
            href="https://www.linkedin.com/in/viktoriia-chernyshuk-398a21145/"
            className="text-link mt-4 inline-block text-sm font-semibold"
          >
            {t("contactLabel")}
          </a>
        </section>

        <div className="mt-10 border-t border-line pt-6">
          <Button href="/dreams">{t("archive")}</Button>
        </div>
      </main>
    </div>
  );
}
