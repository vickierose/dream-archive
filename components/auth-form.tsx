"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/button";
import { FormError } from "@/components/form-error";
import {
  loginSchema,
  signupSchema,
  type AuthFormValues,
} from "@/lib/validation/auth";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [submitError, setSubmitError] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(isSignup ? signupSchema : loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const submitLabel = isSignup ? "Create account" : "Log in";

  async function handleAuthSubmit({ email, password }: AuthFormValues) {
    setSubmitError(undefined);
    setNotice(undefined);
    try {
      const result = isSignup
        ? await authClient.signUp.email({
            email,
            password,
            name: email.split("@")[0],
            callbackURL: "/dreams",
          })
        : await authClient.signIn.email({ email, password });
      if (result.error) {
        setSubmitError(
          result.error.message || "Unable to sign in. Please try again.",
        );
        return;
      }
      const session = await authClient.getSession();
      if (session.error) {
        setSubmitError("Unable to check your session. Please try logging in.");
        return;
      }
      if (!session.data?.user) {
        setNotice(
          isSignup
            ? "Account created. If email verification is enabled, check your inbox before logging in."
            : "Please verify your email, then try logging in again.",
        );
        return;
      }
      router.replace("/dreams");
      router.refresh();
    } catch {
      setSubmitError("Could not reach the sign-in service. Please try again.");
    }
  }

  return (
    <form
      className="mt-8 space-y-5"
      noValidate
      onSubmit={handleSubmit(handleAuthSubmit)}
    >
      <div>
        <label
          className="mb-2 block font-base text-sm font-semibold text-ink"
          htmlFor="email"
        >
          Email
        </label>
        <input
          {...register("email")}
          className="w-full rounded-xl border border-line bg-paper-light px-4 py-3 font-base text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-lavender-dark focus:ring-2 focus:ring-lavender-light aria-invalid:border-danger"
          id="email"
          autoComplete="email"
          placeholder="you@example.com"
          type="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        <FormError id="email-error" message={errors.email?.message} />
      </div>

      <div>
        <label
          className="mb-2 block font-base text-sm font-semibold text-ink"
          htmlFor="password"
        >
          Password
        </label>
        <input
          {...register("password")}
          className="w-full rounded-xl border border-line bg-paper-light px-4 py-3 font-base text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-lavender-dark focus:ring-2 focus:ring-lavender-light aria-invalid:border-danger"
          id="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          placeholder={isSignup ? "Create a password" : "Enter your password"}
          type="password"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        <FormError id="password-error" message={errors.password?.message} />
      </div>

      {!isSignup && (
        <Link href="/forgot-password" className="block text-sm text-purple">
          Forgot password?
        </Link>
      )}
      {submitError && (
        <p role="alert" className="font-base text-sm text-danger">
          {submitError}
        </p>
      )}
      {notice && (
        <p role="status" className="font-base text-sm text-ink-soft">
          {notice}
        </p>
      )}
      <Button
        className="w-full disabled:opacity-60"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Please wait..." : submitLabel}
      </Button>
    </form>
  );
}
