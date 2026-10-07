import { PasswordRecoveryForm } from "@/components/password-recovery-form";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md">
      <h1 className="font-handwritten text-5xl text-ink">Forgot password?</h1>
      <PasswordRecoveryForm />
    </div>
  );
}
