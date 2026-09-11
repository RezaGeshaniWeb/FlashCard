import { Skeleton } from '@/components/ui/Skeleton';

export default function StudyLoading() {
  return (
    <div
      className="mx-auto flex max-w-2xl flex-col gap-4"
      aria-busy="true"
      aria-label="Loading study session"
    >
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-72 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}
