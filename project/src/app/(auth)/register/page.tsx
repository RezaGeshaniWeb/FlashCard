import type { Metadata } from 'next';

import { RegisterForm } from '@/features/auth/components/RegisterForm';

export const metadata: Metadata = {
  title: 'Create account',
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-xl font-semibold text-foreground">
          Create your account
        </h2>
        <p className="text-sm text-muted-foreground">
          Start building decks and learning with spaced repetition.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
