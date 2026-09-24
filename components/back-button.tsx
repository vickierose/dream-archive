"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type BackButtonProps = {
  fallbackHref?: string;
  label?: string;
};

export function BackButton({
  fallbackHref = "/dreams",
  label = "Back",
}: BackButtonProps) {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  return (
    <button
      className="inline-flex items-center gap-1.5 font-base text-sm font-bold text-ink-soft transition hover:text-purple focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple"
      onClick={goBack}
      type="button"
    >
      <ArrowLeft aria-hidden="true" size={16} />
      {label}
    </button>
  );
}
