"use client";

import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Feedback } from "@/components/ui/feedback";
import { authClient } from "@/lib/auth/client";

export function AccountControls({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  const t = useTranslations("Navigation");
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string>();

  async function handleLogout() {
    setSigningOut(true);
    setError(undefined);
    try {
      const result = await authClient.signOut();
      if (result.error) {
        setError(t("logoutError"));
        setSigningOut(false);
        return;
      }
      window.location.replace("/login");
    } catch {
      setError(t("logoutError"));
      setSigningOut(false);
    }
  }

  const label = signingOut ? t("loggingOut") : t("logout");

  return (
    <div className={`absolute md:relative ${className}`}>
      <div
        className={compact ? "flex items-start gap-1 mt-1" : "flex flex-col"}
      >
        <LanguageSwitcher iconOnly={compact} />
        <button
          className={`control-interaction flex items-center rounded-control font-base text-sm text-ink-soft not-disabled:hover:bg-lavender-light not-disabled:hover:text-purple ${compact ? "size-11 justify-center" : "w-full gap-3 px-3 py-2.5"}`}
          type="button"
          disabled={signingOut}
          aria-busy={signingOut}
          aria-label={label}
          title={compact ? label : undefined}
          onClick={handleLogout}
        >
          <LogOut aria-hidden="true" size={18} />
          {!compact && label}
        </button>
      </div>
      {error && (
        <Feedback
          className={
            compact
              ? "absolute right-0 top-full z-40 mt-2 w-64 rounded-control border border-line bg-paper-light p-3 shadow-paper-raised"
              : "px-3"
          }
        >
          {error}
        </Feedback>
      )}
    </div>
  );
}
