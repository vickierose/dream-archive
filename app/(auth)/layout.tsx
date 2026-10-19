import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { MoonStar } from "lucide-react";
import Link from "next/link";
import { Illustration } from "@/components/layout/illustration";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const t = useTranslations();
  return (
    <div className="relative flex min-h-svh flex-col bg-paper md:grid md:grid-cols-2">
      <div className="absolute right-4 top-5 z-10 md:right-8 md:top-6">
        <LanguageSwitcher />
      </div>
      <header className="pl-6 pr-28 py-5 pb-1 sm:pl-10 sm:py-6 md:hidden">
        <Link
          href="/"
          className="focus-ring inline-flex items-center gap-2 font-handwritten text-2xl text-purple"
        >
          <MoonStar aria-hidden="true" size={20} />
          {t("Common.appName")}
        </Link>
      </header>

      <section className="relative hidden min-h-svh md:block">
        <Illustration sizes="(min-width: 48rem) 50vw, 100vw" />
      </section>

      <main className="relative flex flex-1 items-start justify-center bg-paper px-6 pt-6 pb-10 sm:items-center sm:px-10 sm:py-12 md:px-12 md:pt-24 md:shadow-paper-edge lg:px-16">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
    </div>
  );
}
