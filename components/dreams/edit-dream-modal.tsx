"use client";

import { Dialog } from "@/components/ui/dialog";
import { Feedback } from "@/components/ui/feedback";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DreamForm } from "@/components/dreams/dream-form";
import { updateDream } from "@/lib/actions/dream";
import type { DreamFormValues } from "@/lib/validation/dream";
import type { Dream } from "@/types/dream";

export function EditDreamModal({ dream }: { dream: Dream }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const savingRef = useRef(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const dialog = dialogRef.current!;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  function dismiss() {
    if (!savingRef.current)
      router.replace(`/dreams/${dream.id}`, { scroll: false });
  }

  async function save(values: DreamFormValues) {
    savingRef.current = true;
    setError(undefined);
    try {
      const result = await updateDream(dream.id, values);
      if (result.error) {
        setError(result.error);
      } else {
        router.replace(`/dreams/${dream.id}`, { scroll: false });
      }
    } catch {
      setError("Could not save your dream. Please try again.");
    } finally {
      savingRef.current = false;
    }
  }

  return (
    <Dialog
      ref={dialogRef}
      titleId="edit-dream-title"
      title="Edit dream"
      size="lg"
      onCancel={(event) => {
        event.preventDefault();
        dismiss();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          dismiss();
      }}
    >
      {error && <Feedback>{error}</Feedback>}
      <DreamForm
        defaultValues={dream}
        onSubmit={save}
        onCancel={dismiss}
        submitLabel="Save"
      />
    </Dialog>
  );
}
