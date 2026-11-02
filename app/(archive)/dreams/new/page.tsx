import { getTranslations } from "next-intl/server";
import { BackButton } from "@/components/ui/back-button";
import { PageHeader } from "@/components/layout/page-header";
import { NewDreamForm } from "@/components/dreams/new-dream-form";
import { getFormSymbols } from "@/lib/data/archive";

export default async function NewDreamPage() {
  const [t, initialSymbols] = await Promise.all([getTranslations(), getFormSymbols()]);
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-2 md:mt-4">
        <BackButton label={t("Dreams.back")} />
      </div>
      <PageHeader title={t("Dreams.record")} />
      <NewDreamForm initialSymbols={initialSymbols} />
    </div>
  );
}
