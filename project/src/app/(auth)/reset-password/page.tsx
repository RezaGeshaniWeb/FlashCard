import type { Metadata } from 'next';
import { Suspense } from 'react';

import { AuthFormLoader } from '@/features/auth/components/AuthFormLoader';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset password',
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<AuthFormLoader />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
