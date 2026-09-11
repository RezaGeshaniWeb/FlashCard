import { cn } from '@/utils/cn';

export interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'danger';
}

const heightMap = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-3.5',
} as const;

const colorMap = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
} as const;

export function Progress({
  value,
  max = 100,
  label,
  showValue = false,
  className,
  size = 'md',
  variant = 'primary',
}: ProgressProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  const percent = max === 0 ? 0 : Math.round((clamped / max) * 100);

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      {label || showValue ? (
        <div className="flex items-center justify-between gap-2 text-xs">
          {label ? (
            <span className="font-medium text-foreground">{label}</span>
          ) : (
            <span />
          )}
          {showValue ? (
            <span className="text-muted-foreground tabular-nums">
              {percent}%
            </span>
          ) : null}
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={clamped}
        aria-label={label ?? 'Progress'}
        className={cn(
          'w-full overflow-hidden rounded-full bg-muted',
          heightMap[size],
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-300 ease-out',
            colorMap[variant],
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
