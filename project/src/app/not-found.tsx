import Link from 'next/link';
import { ROUTES } from '@/constants';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Page not found
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href={ROUTES.DASHBOARD}
        className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
