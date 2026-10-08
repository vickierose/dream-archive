"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Feedback } from "@/components/ui/feedback";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/ui/back-button";
import { DreamForm } from "@/components/dreams/dream-form";
import { createDream } from "@/lib/actions/dream";
import type { DreamFormValues } from "@/lib/validation/dream";

export default function NewDreamPage() {
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
      setError("Could not save your dream. Please try again.");
      savingRef.current = false;
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4">
        <BackButton label="Back to dreams" />
      </div>
      <PageHeader title="Record a dream" />
      {error && <Feedback className="mb-6">{error}</Feedback>}
      <DreamForm onSubmit={save} />
    </div>
  );
}
