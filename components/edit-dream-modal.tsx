"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DreamForm } from "@/components/dream-form";
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
    if (!savingRef.current) router.replace(`/dreams/${dream.id}`, { scroll: false });
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
    <dialog
      ref={dialogRef}
      aria-labelledby="edit-dream-title"
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-2xl border border-line bg-paper-light p-6 text-ink shadow-xl backdrop:bg-ink/40 backdrop:backdrop-blur-sm sm:p-8"
      onCancel={(event) => { event.preventDefault(); dismiss(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom) dismiss();
      }}
    >
      <h2 id="edit-dream-title" className="font-handwritten text-4xl leading-none sm:text-5xl">
        Edit dream
      </h2>
      {error && <p role="alert" className="mt-4 font-base text-sm text-danger">{error}</p>}
      <DreamForm
        defaultValues={dream}
        onSubmit={save}
        onCancel={dismiss}
        submitLabel="Save"
      />
    </dialog>
  );
}
