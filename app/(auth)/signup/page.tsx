"use client";

import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {


  return (
    <div className="w-full max-w-md">
      <h1 className="mt-1 font-handwritten text-5xl text-ink">
        Create an account
      </h1>
      <p className="mt-4 max-w-xs font-base text-sm text-ink-soft">
        Start keeping the dreams you want to remember.
      </p>

      <AuthForm mode="signup" />

      <div className="my-6 flex items-center gap-3 text-ink-muted">
        <span className="h-px flex-1 bg-line" />
        <span className="font-base text-xs">or</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <button
        className="flex w-full items-center justify-center gap-3 rounded-full border border-lavender bg-paper-light px-6 py-3 font-base text-sm font-semibold text-ink transition hover:bg-lavender-pale"
        type="button"
      >
        <span className="flex size-5 items-center justify-center rounded-full bg-white font-sans text-xs font-bold text-purple">
          G
        </span>
        Continue with Google
      </button>

      <p className="mt-7 text-center font-base text-sm text-ink-soft">
        Already have an account?{" "}
        <Link className="font-semibold text-purple hover:text-purple-dark" href="/login">
          Log in
        </Link>
      </p>
    </div>
  );
}
