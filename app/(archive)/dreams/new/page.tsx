"use client";

import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/layout/page-header";
import { Feedback } from "@/components/ui/feedback";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/ui/back-button";
import { DreamForm } from "@/components/dreams/dream-form";
import { createDream } from "@/lib/actions/dream";
import type { DreamFormValues } from "@/lib/validation/dream";

export default function NewDreamPage() {
  const t = useTranslations();
  const router = useRouter();
  const savingRef = useRef(false);
  const [error, setError] = useState<string>();

  async function save(values: DreamFormValues) {
    if (savingRef.current) return;
    savingRef.current = true;
    setError(undefined);
    try {
      const result = await createDream(values);
      if (result.id) {
        router.replace(`/dreams/${result.id}`);
      } else {
        setError(result.error);
        savingRef.current = false;
      }
    } catch {
      setError(t("Errors.saveDream"));
      savingRef.current = false;
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-2 md:mt-4">
        <BackButton label={t("Dreams.back")} />
      </div>
      <PageHeader title={t("Dreams.record")} />
      {error && <Feedback className="mb-6">{error}</Feedback>}
      <DreamForm onSubmit={save} />
    </div>
  );
}
