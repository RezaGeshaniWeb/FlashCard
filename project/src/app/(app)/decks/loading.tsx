import { Skeleton } from '@/components/ui/Skeleton';

export default function DecksLoading() {
  return (
    <div
      className="mx-auto flex w-full max-w-6xl flex-col gap-6"
      role="status"
      aria-label="Loading decks"
    >
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-10 w-full max-w-xl" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
