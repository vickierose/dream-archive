"use client";

import { useTranslations } from "next-intl";

import { Feedback } from "@/components/ui/feedback";
import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

export function SocialLogin() {
  const t = useTranslations();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  async function handleGoogleLogin() {
    setPending(true);
    setError(undefined);
    try {
      const callbackURL = new URL("/dreams", window.location.origin).href;
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL,
        // First-time users must also return through the session-handling proxy.
        newUserCallbackURL: callbackURL,
      });
      if (result.error) {
        setError(t("Auth.googleUnavailable"));
        setPending(false);
      }
    } catch {
      setError(t("Auth.googleError"));
      setPending(false);
    }
  }

  return (
    <>
      <div className="my-5 flex items-center gap-3 text-ink-muted">
        <span className="h-px flex-1 bg-line" />
        <span className="font-base text-xs">{t("Auth.or")}</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <Button
        variant="secondary"
        className="w-full"
        loading={pending}
        loadingLabel={t("Auth.connecting")}
        onClick={handleGoogleLogin}
      >
        {t("Auth.google")}
      </Button>
      {error && <Feedback className="mt-4">{error}</Feedback>}
    </>
  );
}
