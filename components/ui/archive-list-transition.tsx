"use client";

import { createContext, useContext, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { PageLoader } from "@/components/ui/page-loader";

const NavigationContext = createContext<((href: string) => void) | null>(null);

export function useArchiveNavigation() {
  const navigate = useContext(NavigationContext);
  if (!navigate) throw new Error("Archive navigation requires ArchiveListTransition");
  return navigate;
}

export function ArchiveListTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function navigate(href: string) {
    startTransition(() => router.push(href, { scroll: false }));
  }

  return (
    <NavigationContext value={navigate}>
      <div className="relative" aria-busy={isPending}>
        <div inert={isPending} className={isPending ? "opacity-40" : undefined}>
          {children}
        </div>
        {isPending && (
          <div className="absolute inset-0 z-30 flex items-start justify-center pt-16">
            <PageLoader />
          </div>
        )}
      </div>
    </NavigationContext>
  );
}
