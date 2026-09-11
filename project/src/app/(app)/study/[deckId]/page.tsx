import type { Metadata } from 'next';
import { Suspense } from 'react';
import { StudyView } from '@/features/study/components/StudyView';
import { Skeleton } from '@/components/ui/Skeleton';

export const metadata: Metadata = {
  title: 'Study',
};

interface StudyPageProps {
  params: Promise<{ deckId: string }>;
}

function StudyFallback() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4" aria-busy="true">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-72 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { deckId } = await params;

  return (
    <Suspense fallback={<StudyFallback />}>
      <StudyView deckId={deckId} />
    </Suspense>
  );
}
