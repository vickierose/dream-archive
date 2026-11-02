import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default async function DreamNotFound() {
  const t = await getTranslations();
  return (
    <EmptyState
      title={t("Dreams.notFound")}
      action={
        <Button href="/dreams" variant="secondary">
          {t("Dreams.back")}
        </Button>
      }
    />
  );
}
