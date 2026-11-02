"use client";

import { RouteError } from "@/components/ui/route-error";
import type { ErrorBoundaryProps } from "@/components/ui/error-recovery";

// Group boundaries sit below their layouts; this catches failures in those layouts.
export default function RootError(props: ErrorBoundaryProps) {
  return (
    <main className="grid min-h-svh place-items-center bg-paper-light">
      <RouteError {...props} />
    </main>
  );
}
