import { Skeleton } from '@/components/ui/Skeleton';

export default function ProfileLoading() {
  return (
    <div className="flex max-w-3xl flex-col gap-4" aria-busy="true" aria-label="Loading profile">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-56 w-full" />
    </div>
  );
}
