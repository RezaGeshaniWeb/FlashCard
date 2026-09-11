import { Skeleton } from '@/components/ui/Skeleton';

export default function SettingsLoading() {
  return (
    <div className="flex max-w-3xl flex-col gap-4" aria-busy="true" aria-label="Loading settings">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
