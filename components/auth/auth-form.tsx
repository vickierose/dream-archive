"use client";

import { useTranslations } from "next-intl";

import { Feedback } from "@/components/ui/feedback";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { PasswordField } from "@/components/ui/password-field";
import {
  createLoginSchema,
  createSignupSchema,
  type AuthFormValues,
} from "@/lib/validation/auth";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const t = useTranslations();
  const validation = useTranslations("Validation");
  const isSignup = mode === "signup";
  const [submitError, setSubmitError] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(
      isSignup ? createSignupSchema(validation) : createLoginSchema(validation),
    ),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });
  const submitLabel = isSignup ? t("Auth.create") : t("Auth.login");

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
        setSubmitError(t("Auth.signInError"));
        return;
      }
      const session = await authClient.getSession();
      if (session.error) {
        setSubmitError(t("Auth.sessionError"));
        return;
      }
      if (!session.data?.user) {
        setNotice(isSignup ? t("Auth.created") : t("Auth.verify"));
        return;
      }
      // Start a fresh server request after the session changes. The client
      // router may still have a guest redirect cached for this protected route.
      window.location.replace("/dreams");
    } catch {
      setSubmitError(t("Auth.serviceError"));
    }
  }

  return (
    <form
      className="space-y-5"
      noValidate
      onSubmit={handleSubmit(handleAuthSubmit)}
    >
      <TextField
        {...register("email")}
        id="email"
        label={t("Auth.email")}
        autoComplete="email"
        placeholder="you@example.com"
        type="email"
        error={errors.email?.message}
      />
      <PasswordField
        {...register("password")}
        id="password"
        label={t("Auth.password")}
        autoComplete={isSignup ? "new-password" : "current-password"}
        placeholder={
          isSignup ? t("Auth.createPassword") : t("Auth.enterPassword")
        }
        hint={isSignup ? t("Auth.passwordRequirements") : undefined}
        error={errors.password?.message}
      />
      {isSignup && (
        <PasswordField
          {...register("confirmPassword")}
          id="confirm-password"
          label={t("Auth.confirmPassword")}
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
        />
      )}

      {!isSignup && (
        <Link href="/forgot-password" className="text-link block text-sm">
          {t("Auth.forgot")}
        </Link>
      )}
      {submitError && <Feedback>{submitError}</Feedback>}
      {notice && <Feedback tone="notice">{notice}</Feedback>}
      <Button className="w-full" type="submit" loading={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
}
