"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/button";
import { deleteDream } from "@/lib/actions/dream";

export function DeleteDreamButton({ dreamId }: { dreamId: string }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const deletingRef = useRef(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string>();

  function open() {
    setError(undefined);
    dialogRef.current?.showModal();
    noButtonRef.current?.focus();
  }

  function close() {
    if (!deletingRef.current) dialogRef.current?.close();
  }

  async function confirmDelete() {
    if (deletingRef.current) return;
    deletingRef.current = true;
    setIsDeleting(true);
    setError(undefined);
    try {
      const result = await deleteDream(dreamId);
      if (result.error) {
        setError(result.error);
        deletingRef.current = false;
        setIsDeleting(false);
        return;
      }
      router.replace("/dreams");
    } catch {
      setError("Could not delete your dream. Please try again.");
      deletingRef.current = false;
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Button size="sm" variant="danger" type="button" onClick={open}>
        <Trash2 aria-hidden="true" size={15} />
        Delete
      </Button>
      <dialog
        ref={dialogRef}
        aria-labelledby="delete-dream-title"
        aria-busy={isDeleting}
        className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border border-line bg-paper-light p-6 text-ink shadow-xl backdrop:bg-ink/40 backdrop:backdrop-blur-sm sm:p-8"
        onCancel={(event) => { event.preventDefault(); close(); }}
      >
        <h2 id="delete-dream-title" className="font-base text-lg font-bold">
          Are you sure you want to delete this dream?
        </h2>
        {error && <p role="alert" className="mt-4 font-base text-sm text-danger">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="danger" onClick={confirmDelete} disabled={isDeleting}>
            Yes
          </Button>
          <Button ref={noButtonRef} type="button" variant="secondary" onClick={close} disabled={isDeleting}>
            No
          </Button>
        </div>
      </dialog>
    </>
  );
}
