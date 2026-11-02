"use client";

import { useEffect, useRef, useTransition } from "react";

export type ErrorBoundaryProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export type ErrorRecoveryMessages = {
  title: string;
  description: string;
  retry: string;
  retrying: string;
  home: string;
};

// Keep this UI independent of translation providers: global-error replaces them.
export function ErrorRecovery({ retry, messages }: {
  retry: () => void;
  messages: ErrorRecoveryMessages;
}) {
  const [pending, startTransition] = useTransition();
  const screen = useRef<HTMLElement>(null);

  useEffect(() => {
    screen.current?.focus();
  }, []);

  return (
    <section
      ref={screen}
      role="alert"
      tabIndex={-1}
      aria-busy={pending}
      className="mx-auto flex min-h-[50dvh] max-w-xl flex-col items-center justify-center gap-4 px-6 py-12 text-center text-ink outline-none"
    >
      <h1 className="text-2xl font-bold">{messages.title}</h1>
      <p className="max-w-md text-sm leading-relaxed text-ink-soft">{messages.description}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => retry())}
          className="control-interaction rounded-full bg-purple px-5 py-3 text-sm font-bold text-white hover:bg-purple-dark disabled:opacity-50"
        >
          {pending ? messages.retrying : messages.retry}
        </button>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Reload the document instead of reusing a failed router/layout. */}
        <a href="/" className="control-interaction rounded-full border border-lavender-dark px-5 py-3 text-sm font-bold text-purple hover:bg-lavender-light">
          {messages.home}
        </a>
      </div>
    </section>
  );
}
