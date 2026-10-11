import type { ReactNode } from "react";
import { Suspense } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { connection } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export default async function ArchiveLayout({
  children,
}: {
  children: ReactNode;
}) {
  await connection();
  await requireUser();
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-paper-light md:flex-row">
      <Suspense
        fallback={
          <div className="hidden h-full w-56 shrink-0 border-r border-line bg-lavender-pale md:block" />
        }
      >
        <Sidebar />
      </Suspense>
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
        <section className="relative min-h-full px-6 pt-8 pb-[calc(7rem+env(safe-area-inset-bottom))] sm:px-10 md:pt-8 md:pb-8">
          <div className="absolute right-4 top-6 md:hidden">
            <LanguageSwitcher />
          </div>
          {children}
        </section>
      </main>
    </div>
  );
}
