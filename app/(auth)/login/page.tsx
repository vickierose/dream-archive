import { PageHeader } from "@/components/layout/page-header";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { SocialLogin } from "@/components/auth/social-login";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <PageHeader title="Welcome back" description="Your dreams are waiting." />

      <AuthForm mode="login" />

      <SocialLogin />

      <p className="mt-6 text-center font-base text-sm text-ink-soft">
        New to Dream Archive?{" "}
        <Link className="text-link font-semibold" href="/signup">
          Create an account
        </Link>
      </p>
    </div>
  );
}
