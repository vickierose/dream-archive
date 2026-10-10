import { PageHeader } from "@/components/layout/page-header";
import { PasswordRecoveryForm } from "@/components/auth/password-recovery-form";
import { requireGuest } from "@/lib/auth/session";

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string | string[]; error?: string }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  await requireGuest();
  const params = await searchParams;
  const token =
    !params.error && typeof params.token === "string"
      ? params.token
      : undefined;

  return (
    <div className="w-full max-w-md">
      <PageHeader title="Reset password" />
      <PasswordRecoveryForm reset token={token} />
    </div>
  );
}
