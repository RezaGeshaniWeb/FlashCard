import { cn } from '@/utils/cn';

export interface SkeletonProps {
  className?: string;
  /** Accessible label announced to screen readers. */
  label?: string;
}

export function Skeleton({ className, label = 'Loading' }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn('animate-shimmer rounded-md bg-muted', className)}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div
      className={cn('flex flex-col gap-2', className)}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          aria-hidden
          className={cn(
            'animate-shimmer h-3 w-full rounded-md bg-muted',
            i === lines - 1 && 'w-2/3',
          )}
        />
      ))}
    </div>
  );
}
