"use client";

import { useTranslations } from "next-intl";

import { FormActions } from "@/components/ui/form-actions";
import { Dialog } from "@/components/ui/dialog";
import { Feedback } from "@/components/ui/feedback";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteDream } from "@/lib/actions/dream";

export function DeleteDreamButton({ dreamId }: { dreamId: string }) {
  const t = useTranslations();
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
      setError(t("Errors.deleteDream"));
      deletingRef.current = false;
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Button size="sm" variant="danger" type="button" onClick={open}>
        <Trash2 aria-hidden="true" size={15} />
        {t("Common.delete")}
      </Button>
      <Dialog
        ref={dialogRef}
        titleId="delete-dream-title"
        title={t("Dreams.confirmDelete")}
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
            loadingLabel={t("Common.deleting")}
          >
            {t("Common.yes")}
          </Button>
          <Button
            ref={noButtonRef}
            type="button"
            variant="secondary"
            onClick={close}
            disabled={isDeleting}
          >
            {t("Common.no")}
          </Button>
        </FormActions>
      </Dialog>
    </>
  );
}
