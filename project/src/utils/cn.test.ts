import { describe, expect, it } from 'vitest';
import { cn } from '@/utils/cn';

describe('cn', () => {
  it('merges class names and resolves Tailwind conflicts', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('text-sm', false && 'hidden', 'font-medium')).toBe(
      'text-sm font-medium',
    );
    expect(cn('bg-red-500', undefined, null, 'bg-blue-500')).toBe(
      'bg-blue-500',
    );
  });
});
