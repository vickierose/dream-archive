import { PageHeader } from "@/components/layout/page-header";
import { PasswordRecoveryForm } from "@/components/auth/password-recovery-form";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md">
      <PageHeader title="Forgot password?" />
      <PasswordRecoveryForm />
    </div>
  );
}
