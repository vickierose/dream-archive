"use client";

import { FormActions } from "@/components/ui/form-actions";
import { Dialog } from "@/components/ui/dialog";
import { Feedback } from "@/components/ui/feedback";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <Dialog
        ref={dialogRef}
        titleId="delete-dream-title"
        title="Are you sure you want to delete this dream?"
        size="sm"
        aria-busy={isDeleting}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
      >
        {error && <Feedback>{error}</Feedback>}
        <FormActions>
          <Button
            type="button"
            variant="danger"
            onClick={confirmDelete}
            loading={isDeleting}
            loadingLabel="Deleting..."
          >
            Yes
          </Button>
          <Button
            ref={noButtonRef}
            type="button"
            variant="secondary"
            onClick={close}
            disabled={isDeleting}
          >
            No
          </Button>
        </FormActions>
      </Dialog>
    </>
  );
}
