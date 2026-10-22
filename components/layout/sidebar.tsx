"use client";

import { useTranslations } from "next-intl";

import { BookOpen, Compass, MoonStar, Shapes } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountControls } from "@/components/layout/account-controls";

export function Sidebar() {
  const t = useTranslations();
  const navigation = [
    { href: "/dreams", label: t("Navigation.dreams"), icon: BookOpen },
    { href: "/symbols", label: t("Navigation.symbols"), icon: Shapes },
    { href: "/explore", label: t("Navigation.explore"), icon: Compass },
  ];

  const pathname = usePathname();
  const content = (
    <>
      <Link
        className="focus-ring flex items-center gap-2 px-3 font-handwritten font-medium text-2xl text-ink"
        href="/dreams"
      >
        <MoonStar aria-hidden="true" className="text-purple" size={24} />
        {t("Common.appName")}
      </Link>

      <nav aria-label={t("Navigation.archive")} className="mt-8 space-y-1">
        {navigation.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              className={`control-interaction flex items-center gap-3 rounded-control px-3 py-2.5 font-base text-sm ${
                isActive
                  ? "bg-lavender-light font-semibold text-ink"
                  : "text-ink-soft hover:bg-lavender-light hover:text-ink"
              }`}
              href={href}
              aria-current={isActive ? "page" : undefined}
              key={href}
            >
              <Icon aria-hidden="true" size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <AccountControls className="mt-auto" />
    </>
  );

  return (
    <>
      <aside className="hidden h-full w-56 shrink-0 flex-col overflow-y-auto border-r border-line bg-lavender-pale px-4 py-6 md:flex">
        {content}
      </aside>
      <nav
        aria-label={t("Navigation.mobile")}
        className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 mx-auto grid max-w-md grid-cols-3 justify-items-center gap-2 rounded-3xl border border-line bg-lavender-pale/95 p-2 shadow-paper-raised backdrop-blur-xl md:hidden"
      >
        {navigation.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`control-interaction flex size-16 flex-col items-center justify-center gap-1 rounded-2xl font-base text-xs font-semibold ${
                isActive
                  ? "bg-purple text-paper-light shadow-paper"
                  : "text-ink-soft hover:bg-lavender-light hover:text-purple"
              }`}
            >
              <Icon aria-hidden="true" size={24} strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
