import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { SocialLogin } from "@/components/auth/social-login";

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

      <SocialLogin />

      <p className="mt-7 text-center font-base text-sm text-ink-soft">
        Already have an account?{" "}
        <Link
          className="font-semibold text-purple hover:text-purple-dark"
          href="/login"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
