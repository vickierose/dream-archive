import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { SocialLogin } from "@/components/auth/social-login";
import { requireGuest } from "@/lib/auth/session";

export default async function LoginPage() {
  const t = await getTranslations();
  await requireGuest();
  return (
    <div className="w-full max-w-md">
      <PageHeader title={t("Auth.welcome")} description={t("Auth.waiting")} />

      <AuthForm mode="login" />

      <SocialLogin />

      <p className="mt-6 text-center font-base text-sm text-ink-soft">
        {t("Auth.newHere")}{" "}
        <Link className="text-link font-semibold" href="/signup">
          {t("Auth.createAccount")}
        </Link>
      </p>
    </div>
  );
}
