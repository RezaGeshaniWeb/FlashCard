import type { Metadata } from 'next';
import { Suspense } from 'react';

import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';
import { Loader } from '@/components/ui/Loader';

export const metadata: Metadata = {
  title: 'Reset password',
};

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reset password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a new password for your account.
        </p>
      </div>
      <Suspense fallback={<Loader label="Loading…" />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
