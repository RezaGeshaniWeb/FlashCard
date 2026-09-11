import type { Metadata } from 'next';
import { Suspense } from 'react';

import { Loader } from '@/components/ui/Loader';
import { LoginForm } from '@/features/auth/components/LoginForm';

export const metadata: Metadata = {
  title: 'Sign in',
};

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-xl font-semibold text-foreground">Sign in</h2>
        <p className="text-sm text-muted-foreground">
          Continue studying where you left off.
        </p>
      </div>
      <Suspense fallback={<Loader label="Loading form…" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
