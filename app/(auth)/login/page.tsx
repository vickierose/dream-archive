import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { SocialLogin } from "@/components/auth/social-login";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <h1 className="mt-1 font-handwritten text-5xl text-ink">
        Welcome back
      </h1>
      <p className="mt-4 max-w-xs font-base text-sm text-ink-soft">
        Your dreams are waiting.
      </p>

      <AuthForm mode="login" />

      <SocialLogin />

      <p className="mt-7 text-center font-base text-sm text-ink-soft">
        New to Dream Archive?{" "}
        <Link
          className="font-semibold text-purple hover:text-purple-dark"
          href="/signup"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
