'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/constants';
import { useLogin } from '@/features/auth/hooks/useAuth';
import type { LoginFormValues } from '@/features/auth/types';

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean(),
});

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await login.mutateAsync(values);
    const next = searchParams.get('next');
    router.push(next && next.startsWith('/') ? next : ROUTES.DASHBOARD);
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        required
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        required
        showPasswordToggle
        error={errors.password?.message}
        {...register('password')}
      />
      <div className="flex items-center justify-between gap-3">
        <Checkbox label="Remember me" {...register('rememberMe')} />
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          Forgot password?
        </Link>
      </div>
      <Button type="submit" loading={login.isPending} className="w-full">
        Sign in
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        No account?{' '}
        <Link
          href={ROUTES.REGISTER}
          className="font-medium text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
