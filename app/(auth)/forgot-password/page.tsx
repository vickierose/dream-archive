import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { PasswordRecoveryForm } from "@/components/auth/password-recovery-form";
import { requireGuest } from "@/lib/auth/session";

export default async function ForgotPasswordPage() {
  const t = await getTranslations();
  await requireGuest();
  return (
    <div className="w-full max-w-md">
      <PageHeader title={t("Auth.forgot")} />
      <PasswordRecoveryForm />
    </div>
  );
}
