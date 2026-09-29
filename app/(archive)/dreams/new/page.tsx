"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/back-button";
import { DreamForm } from "@/components/dream-form";
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
      <BackButton label="Back to dreams" />
      <h1 className="mt-5 font-handwritten text-4xl leading-none text-ink sm:text-5xl">
        Record a dream
      </h1>
      {error && <p role="alert" className="mt-4 font-base text-sm text-danger">{error}</p>}
      <DreamForm onSubmit={save} />
    </div>
  );
}
