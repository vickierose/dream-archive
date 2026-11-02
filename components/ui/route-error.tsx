"use client";

import { useTranslations } from "next-intl";
import { ErrorRecovery, type ErrorBoundaryProps } from "@/components/ui/error-recovery";

export function RouteError({ retry }: ErrorBoundaryProps) {
  const t = useTranslations("RouteError");
  return (
    <ErrorRecovery
      retry={retry}
      messages={{
        title: t("title"),
        description: t("description"),
        retry: t("retry"),
        retrying: t("retrying"),
        home: t("home"),
      }}
    />
  );
}
