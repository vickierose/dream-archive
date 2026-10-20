import { getPageMetadata } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { SocialLogin } from "@/components/auth/social-login";
import { requireGuest } from "@/lib/auth/session";

export default async function SignupPage() {
  const t = await getTranslations();
  await requireGuest();
  return (
    <div className="w-full max-w-md">
      <PageHeader
        title={t("Auth.createAccount")}
        description={t("Auth.start")}
      />

      <AuthForm mode="signup" />

      <SocialLogin />

      <p className="mt-6 text-center font-base text-sm text-ink-soft">
        {t("Auth.already")}{" "}
        <Link className="text-link font-semibold" href="/login">
          {t("Auth.login")}
        </Link>
      </p>
    </div>
  );
}

export async function generateMetadata() {
  return getPageMetadata("signup");
}
