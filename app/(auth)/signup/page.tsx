"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-md">
      <h1 className="mt-1 font-handwritten text-5xl text-ink">
        Create an account
      </h1>
      <p className="mt-4 max-w-xs font-base text-sm text-ink-soft">
        Start keeping the dreams you want to remember.
      </p>

      <form
        className="mt-8 space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          router.push("/dreams");
        }}
      >
        <div>
          <label
            className="mb-2 block font-base text-sm font-semibold text-ink"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="w-full rounded-xl border border-line bg-paper-light px-4 py-3 font-base text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-lavender-dark focus:ring-2 focus:ring-lavender-light"
            id="email"
            name="email"
            placeholder="you@example.com"
            type="email"
          />
        </div>

        <div>
          <label
            className="mb-2 block font-base text-sm font-semibold text-ink"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="w-full rounded-xl border border-line bg-paper-light px-4 py-3 font-base text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-lavender-dark focus:ring-2 focus:ring-lavender-light"
            id="password"
            name="password"
            placeholder="Create a password"
            type="password"
          />
        </div>

        <button
          className="w-full rounded-full bg-purple px-6 py-3 font-base text-sm font-semibold text-white transition hover:bg-purple-dark"
          type="submit"
        >
          Create account
        </button>
      </form>

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
