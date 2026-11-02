"use client";

import { useTranslations } from "next-intl";

import { Feedback } from "@/components/ui/feedback";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DreamForm } from "@/components/dreams/dream-form";
import { createDream } from "@/lib/actions/dream";
import type { DreamFormValues } from "@/lib/validation/dream";
import type { Symbol } from "@/types/symbol";

export function NewDreamForm({ initialSymbols }: { initialSymbols: Symbol[] | null }) {
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
    <>
      {error && <Feedback className="mb-6">{error}</Feedback>}
      <DreamForm initialSymbols={initialSymbols} onSubmit={save} />
    </>
  );
}
