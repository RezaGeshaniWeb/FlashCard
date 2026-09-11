import { Skeleton } from '@/components/ui/Skeleton';

export default function DeckDetailLoading() {
  return (
    <div
      className="mx-auto flex w-full max-w-6xl flex-col gap-6"
      role="status"
      aria-label="Loading deck"
    >
      <Skeleton className="h-4 w-28" />
      <div className="space-y-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full max-w-md" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
      <Skeleton className="h-10 w-full max-w-xl" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
