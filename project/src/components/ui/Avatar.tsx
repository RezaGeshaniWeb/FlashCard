import { cn } from '@/utils/cn';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
} as const;

function getInitials(name?: string): string {
  if (!name?.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  className,
}: AvatarProps) {
  const label = alt ?? name ?? 'User avatar';

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={label}
        className={cn(
          'inline-block shrink-0 rounded-full object-cover ring-1 ring-border',
          sizeClasses[size],
          className,
        )}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={label}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground ring-1 ring-border',
        sizeClasses[size],
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}
