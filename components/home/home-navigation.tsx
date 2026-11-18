import { MoonStar } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ArchiveButton } from "./archive-button";

function HomeBrand({ inHeader = false }: { inHeader?: boolean }) {
  const t = useTranslations("Common");

  return (
    <Link
      href="/"
      className={`focus-ring inline-flex items-center gap-2 font-handwritten text-2xl font-medium ${inHeader ? "text-white focus-visible:outline-white" : "text-ink"}`}
    >
      <MoonStar aria-hidden="true" size={21} className={inHeader ? "shrink-0" : "shrink-0 text-purple"} />
      {t("appName")}
    </Link>
  );
}

export function HomeHeader() {
  const t = useTranslations("Home");

  return (
    <header className="z-10 col-start-1 row-start-1 self-start bg-linear-to-b from-night/50 to-transparent">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 pt-4 pb-9 sm:px-8 lg:px-12">
        <HomeBrand inHeader />
        <nav
          aria-label={t("navigation")}
          className="relative flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6"
        >
          <a
            href="#how-it-works"
            className="focus-ring inline-flex min-h-11 items-center text-sm font-bold text-white underline-offset-4 hover:underline focus-visible:outline-white"
          >
            {t("features")}
          </a>
          <ArchiveButton inHeader />
        </nav>
      </div>
    </header>
  );
}

export function HomeFooter() {
  const t = useTranslations("Privacy");

  return (
    <footer className="border-t border-line bg-linear-to-r from-lavender-light via-paper-lilac to-paper">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-5 px-5 py-8 sm:px-8 lg:px-12">
        <HomeBrand />
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-soft sm:gap-x-8">
          <LanguageSwitcher />
          <Link href="/privacy" className="text-link">
            {t("title")}
          </Link>
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
}
