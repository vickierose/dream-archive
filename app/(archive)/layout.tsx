import type { ReactNode } from "react";
import { Suspense } from "react";
import { Sidebar } from "@/components/sidebar";

export default function ArchiveLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden bg-paper-light">
      <Suspense
        fallback={
          <aside className="h-full w-56 shrink-0 border-r border-line bg-lavander-pale" />
        }
      >
        <Sidebar />
      </Suspense>
      <main className="min-w-0 flex-1 overflow-y-auto">
        <section className="relative min-h-full px-6 py-4 sm:px-10 lg:px-10 lg:py-8">
          {children}
        </section>
      </main>
    </div>
  );
}
