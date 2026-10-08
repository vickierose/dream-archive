"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
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
      <TextField
        {...register("email")}
        id="email"
        label="Email"
        autoComplete="email"
        placeholder="you@example.com"
        type="email"
        error={errors.email?.message}
      />
      <TextField
        {...register("password")}
        id="password"
        label="Password"
        autoComplete={isSignup ? "new-password" : "current-password"}
        placeholder={isSignup ? "Create a password" : "Enter your password"}
        type="password"
        error={errors.password?.message}
      />

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
