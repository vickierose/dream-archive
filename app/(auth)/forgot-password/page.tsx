import { PageHeader } from "@/components/layout/page-header";
import { PasswordRecoveryForm } from "@/components/auth/password-recovery-form";
import { requireGuest } from "@/lib/auth/session";

export default async function ForgotPasswordPage() {
  await requireGuest();
  return (
    <div className="w-full max-w-md">
      <PageHeader title="Forgot password?" />
      <PasswordRecoveryForm />
    </div>
  );
}
