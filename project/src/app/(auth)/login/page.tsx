import type { Metadata } from 'next';
import { Suspense } from 'react';

import { AuthFormLoader } from '@/features/auth/components/AuthFormLoader';
import { LoginForm } from '@/features/auth/components/LoginForm';

export const metadata: Metadata = {
  title: 'Sign in',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthFormLoader />}>
      <LoginForm />
    </Suspense>
  );
}
