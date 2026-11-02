import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default async function SymbolNotFound() {
  const t = await getTranslations();
  return (
    <EmptyState
      title={t("Symbols.notFound")}
      action={<Button href="/symbols" variant="secondary">{t("Symbols.back")}</Button>}
    />
  );
}
