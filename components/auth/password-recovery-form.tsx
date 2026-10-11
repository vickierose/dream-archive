"use client";

import { useTranslations } from "next-intl";

import { Feedback } from "@/components/ui/feedback";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";

type PasswordRecoveryFormProps = {
  reset?: boolean;
  token?: string;
};

export function PasswordRecoveryForm({
  reset = false,
  token,
}: PasswordRecoveryFormProps) {
  const t = useTranslations();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const submitLabel = reset ? t("Auth.updatePassword") : t("Auth.sendReset");
  const isResetComplete = reset && !!notice;

  async function handleRecoverySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setPending(true);
    setError(undefined);
    setNotice(undefined);
    try {
      const result = reset
        ? await authClient.resetPassword({
            newPassword: String(values.get("password")),
            token,
          })
        : await authClient.requestPasswordReset({
            email: String(values.get("email")).trim(),
            redirectTo: `${window.location.origin}/reset-password`,
          });
      if (result.error) {
        setError(
          reset
            ? t("Auth.expiredLink")
            : t("Auth.resetError"),
        );
        return;
      }
      setNotice(
        reset
          ? t("Auth.passwordUpdated")
          : t("Auth.resetSent"),
      );
    } catch {
      setError(t("Auth.serviceError"));
    } finally {
      setPending(false);
    }
  }

  if (reset && !token) {
    return (
      <p className="text-sm leading-relaxed text-ink-soft">
        {t("Auth.invalidLink")}{" "}
        <Link className="text-link underline" href="/forgot-password">
          {t("Auth.requestLink")}
        </Link>
        .
      </p>
    );
  }

  return (
    <form onSubmit={handleRecoverySubmit} className="space-y-6">
      <TextField
        id="recovery-input"
        label={reset ? t("Auth.newPassword") : t("Auth.email")}
        name={reset ? "password" : "email"}
        type={reset ? "password" : "email"}
        autoComplete={reset ? "new-password" : "email"}
        required
        minLength={reset ? 8 : undefined}
        maxLength={reset ? 128 : undefined}
      />
      {error && <Feedback>{error}</Feedback>}
      {notice && <Feedback tone="notice">{notice}</Feedback>}
      <Button
        className="w-full"
        type="submit"
        disabled={isResetComplete}
        loading={pending}
      >
        {submitLabel}
      </Button>
      <Link href="/login" className="text-link block text-center text-sm">
        {t("Auth.backToLogin")}
      </Link>
    </form>
  );
}
