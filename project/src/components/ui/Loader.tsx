import { cn } from '@/utils/cn';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
} as const;

export function Spinner({
  size = 'md',
  className,
  label = 'Loading',
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        'inline-block animate-spin rounded-full border-primary border-t-transparent',
        sizeMap[size],
        className,
      )}
    >
      <span className="sr-only">{label}</span>
    </span>
  );
}

export interface LoaderProps {
  label?: string;
  className?: string;
  fullPage?: boolean;
}

export function Loader({
  label = 'Loading…',
  className,
  fullPage = false,
}: LoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        'flex flex-col items-center justify-center gap-3 text-muted-foreground',
        fullPage && 'min-h-[40vh]',
        className,
      )}
    >
      <Spinner size="lg" label={label} />
      <p className="text-sm">{label}</p>
    </div>
  );
}
