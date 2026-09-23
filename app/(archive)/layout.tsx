import type { ReactNode } from "react";
import { Suspense } from "react";
import { Sidebar } from "@/components/sidebar";

export default function ArchiveLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-paper-light">
      <Suspense
        fallback={
          <aside className="w-56 shrink-0 border-r border-line bg-lavander-pale" />
        }
      >
        <Sidebar />
      </Suspense>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
