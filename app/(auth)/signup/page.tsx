import { PageHeader } from "@/components/layout/page-header";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { SocialLogin } from "@/components/auth/social-login";

export default function SignupPage() {
  return (
    <div className="w-full max-w-md">
      <PageHeader
        title="Create an account"
        description="Start keeping the dreams you want to remember."
      />

      <AuthForm mode="signup" />

      <SocialLogin />

      <p className="mt-6 text-center font-base text-sm text-ink-soft">
        Already have an account?{" "}
        <Link className="text-link font-semibold" href="/login">
          Log in
        </Link>
      </p>
    </div>
  );
}
