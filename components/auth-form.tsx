"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/button";
import { FormError } from "@/components/form-error";
import { loginSchema, signupSchema, type AuthFormValues } from "@/lib/validation/auth";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthFormValues>({
    resolver: zodResolver(isSignup ? signupSchema : loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <form className="mt-8 space-y-5" noValidate onSubmit={handleSubmit(() => router.push("/dreams"))}>
      <div>
        <label className="mb-2 block font-base text-sm font-semibold text-ink" htmlFor="email">
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
        <label className="mb-2 block font-base text-sm font-semibold text-ink" htmlFor="password">
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

      <Button className="w-full disabled:opacity-60" type="submit" disabled={isSubmitting}>
        {isSignup ? "Create account" : "Log in"}
      </Button>
    </form>
  );
}
