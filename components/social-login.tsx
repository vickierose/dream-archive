"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/button";

export function SocialLogin() {
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
        setError(result.error.message || "Google sign-in is unavailable.");
        setPending(false);
      }
    } catch {
      setError("Could not start Google sign-in. Please try again.");
      setPending(false);
    }
  }

  return (
    <>
      <div className="my-6 flex items-center gap-3 text-ink-muted">
        <span className="h-px flex-1 bg-line" />
        <span className="font-base text-xs">or</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <Button
        variant="secondary"
        className="w-full"
        disabled={pending}
        onClick={handleGoogleLogin}
      >
        {pending ? "Connecting..." : "Continue with Google"}
      </Button>
      {error && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      )}
    </>
  );
}
