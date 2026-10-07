"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/button";

type PasswordRecoveryFormProps = {
  reset?: boolean;
  token?: string;
};

export function PasswordRecoveryForm({
  reset = false,
  token,
}: PasswordRecoveryFormProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const submitLabel = reset ? "Update password" : "Send reset link";
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
            ? "This reset link may have expired. Request a new one and try again."
            : "Could not request a reset email. Please try again.",
        );
        return;
      }
      setNotice(
        reset
          ? "Password updated. You can now log in."
          : "If an account exists for this email, you will receive a password reset link.",
      );
    } catch {
      setError("Could not reach the sign-in service. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (reset && !token) {
    return (
      <p className="mt-6 text-sm text-ink-soft">
        This reset link is missing or invalid.{" "}
        <Link className="text-purple underline" href="/forgot-password">
          Request a new link
        </Link>
        .
      </p>
    );
  }

  return (
    <form onSubmit={handleRecoverySubmit} className="mt-8 space-y-5">
      <label
        className="block font-base text-sm font-semibold"
        htmlFor="recovery-input"
      >
        {reset ? "New password" : "Email"}
      </label>
      <input
        id="recovery-input"
        name={reset ? "password" : "email"}
        type={reset ? "password" : "email"}
        autoComplete={reset ? "new-password" : "email"}
        required
        minLength={reset ? 8 : undefined}
        maxLength={reset ? 128 : undefined}
        className="w-full rounded-xl border border-line bg-paper-light px-4 py-3 text-sm text-ink"
      />
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="text-sm text-ink-soft">
          {notice}
        </p>
      )}
      <Button
        className="w-full"
        type="submit"
        disabled={pending || isResetComplete}
      >
        {pending ? "Please wait..." : submitLabel}
      </Button>
      <Link href="/login" className="block text-center text-sm text-purple">
        Back to login
      </Link>
    </form>
  );
}
