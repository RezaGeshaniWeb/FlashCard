'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from './Button';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  /** Max numbered buttons to show. Default 5. */
  siblingCount?: number;
}

function buildPages(
  page: number,
  totalPages: number,
  siblingCount: number,
): (number | 'ellipsis')[] {
  if (totalPages <= siblingCount + 2) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);
  for (
    let i = Math.max(2, page - siblingCount);
    i <= Math.min(totalPages - 1, page + siblingCount);
    i += 1
  ) {
    pages.add(i);
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: (number | 'ellipsis')[] = [];
  for (let i = 0; i < sorted.length; i += 1) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('ellipsis');
    result.push(sorted[i]);
  }
  return result;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
  siblingCount = 1,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const items = buildPages(page, totalPages, siblingCount);

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1', className)}
    >
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
      </Button>
      {items.map((item, idx) =>
        item === 'ellipsis' ? (
          <span
            key={`e-${idx}`}
            className="px-2 text-sm text-muted-foreground"
            aria-hidden
          >
            …
          </span>
        ) : (
          <Button
            key={item}
            type="button"
            variant={item === page ? 'primary' : 'ghost'}
            size="icon"
            className="h-9 w-9"
            onClick={() => onPageChange(item)}
            aria-label={`Go to page ${item}`}
            aria-current={item === page ? 'page' : undefined}
          >
            {item}
          </Button>
        ),
      )}
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Go to next page"
      >
        <ChevronRight className="h-4 w-4" aria-hidden />
      </Button>
    </nav>
  );
}
