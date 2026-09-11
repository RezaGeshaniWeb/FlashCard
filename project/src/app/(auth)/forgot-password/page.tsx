import type { Metadata } from 'next';

import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot password',
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-xl font-semibold text-foreground">
          Reset password
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter your email and we will send reset instructions.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
