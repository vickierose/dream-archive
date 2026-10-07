import { PasswordRecoveryForm } from "@/components/password-recovery-form";

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string | string[]; error?: string }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const token =
    !params.error && typeof params.token === "string" ? params.token : undefined;

  return (
    <div className="w-full max-w-md">
      <h1 className="font-handwritten text-5xl text-ink">Reset password</h1>
      <PasswordRecoveryForm reset token={token} />
    </div>
  );
}
