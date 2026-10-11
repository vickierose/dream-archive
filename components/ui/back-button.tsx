"use client";

import { useTranslations } from "next-intl";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type BackButtonProps = {
  fallbackHref?: string;
  label?: string;
};

export function BackButton({
  fallbackHref = "/dreams",
  label,
}: BackButtonProps) {
  const t = useTranslations();
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
      className="control-interaction inline-flex items-center gap-1.5 font-base text-sm font-bold text-ink-soft not-disabled:hover:text-purple"
      onClick={goBack}
      type="button"
    >
      <ArrowLeft aria-hidden="true" size={16} />
      {label ?? t("Common.back")}
    </button>
  );
}
