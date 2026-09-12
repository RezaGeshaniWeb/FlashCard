'use client';

import { useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { ReviewRating, StudyMode } from '@/types';
import { STUDY_MODES, ROUTES } from '@/constants';
import { useT } from '@/i18n';
import {
  useStudySession,
  type StudyOrder,
} from '../hooks/useStudySession';
import { StudyCard } from './StudyCard';
import { RatingButtons } from './RatingButtons';
import { StudyControls } from './StudyControls';
import { StudyProgress } from './StudyProgress';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

function parseMode(value: string | null): StudyMode {
  if (value && (STUDY_MODES as readonly string[]).includes(value)) {
    return value as StudyMode;
  }
  return 'practice';
}

function parseOrder(value: string | null, mode: StudyMode): StudyOrder {
  if (value === 'random' || mode === 'random') return 'random';
  if (value === 'sequential' || mode === 'sequential') return 'sequential';
  return 'sequential';
}

export interface StudyViewProps {
  deckId: string;
}

export function StudyView({ deckId }: StudyViewProps) {
  const t = useT();
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = parseMode(searchParams.get('mode'));
  const order = parseOrder(searchParams.get('order'), modeParam);
  const mode: StudyMode =
    modeParam === 'random' || modeParam === 'sequential'
      ? 'practice'
      : modeParam;
  const timedSeconds = Number(searchParams.get('timer') ?? '300') || 300;

  const session = useStudySession({
    deckId,
    mode,
    order,
    timedSeconds: mode === 'timed' ? timedSeconds : 0,
  });

  const updateParams = useCallback(
    (patch: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(patch).forEach(([k, v]) => params.set(k, v));
      router.replace(`/study/${deckId}?${params.toString()}`);
    },
    [router, deckId, searchParams],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        session.flip();
        return;
      }
      if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        session.toggleBookmark();
        return;
      }
      const ratingMap: Record<string, ReviewRating> = {
        '1': 'again',
        '2': 'hard',
        '3': 'good',
        '4': 'easy',
      };
      const rating = ratingMap[e.key];
      if (rating) {
        e.preventDefault();
        void session.rate(rating);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // Intentionally bind to stable session actions, not the whole session object.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- session identity changes every render
  }, [session.flip, session.toggleBookmark, session.rate]);

  if (session.isLoading) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (session.isError) {
    return (
      <ErrorState
        title={t('study.loadErrorTitle')}
        onRetry={session.refetch}
      />
    );
  }

  if (session.phase === 'complete') {
    return (
      <Card className="mx-auto max-w-lg animate-scale-in">
        <CardHeader>
          <CardTitle>{t('study.completeTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            {t('study.completeSummary', {
              reviewed: session.stats.reviewed,
              correct: session.stats.correct,
              incorrect: session.stats.incorrect,
            })}
          </p>
          <div className="flex flex-wrap gap-2">
            {session.incorrectCount > 0 ? (
              <Button type="button" onClick={session.retryIncorrect}>
                {t('study.retryIncorrect', { count: session.incorrectCount })}
              </Button>
            ) : null}
            <Button type="button" variant="outline" onClick={session.restart}>
              {t('study.studyAgain')}
            </Button>
            <Link
              href={ROUTES.DECK_DETAIL(deckId)}
              className="inline-flex h-10 items-center rounded-md border border-border px-4 text-sm font-medium hover:bg-muted"
            >
              {t('study.backToDeck')}
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!session.currentCard || session.progress.total === 0) {
    return (
      <EmptyState
        title={t('study.emptyTitle')}
        description={t('study.emptyDescription')}
        actionLabel={t('study.emptyAction')}
        onAction={() => router.push(ROUTES.DECKS)}
      />
    );
  }

  const canRate = mode === 'exam' || session.flipped;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t('study.title')}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === 'exam'
            ? t('study.subtitleExam')
            : t('study.subtitleDefault')}
        </p>
      </div>

      <StudyControls
        mode={mode}
        order={session.order}
        secondsLeft={session.secondsLeft}
        onModeChange={(m) => updateParams({ mode: m })}
        onOrderChange={(o) => updateParams({ order: o })}
        onShuffle={session.shuffleQueue}
      />

      <StudyProgress
        current={session.progress.current}
        total={session.progress.total}
        stats={session.stats}
      />

      <StudyCard
        key={session.currentCard.id}
        card={session.currentCard}
        flipped={session.flipped}
        onFlip={session.flip}
        onBookmark={session.toggleBookmark}
        onSaveNotes={session.saveNotes}
        notesSaving={session.isSavingNotes}
        examMode={mode === 'exam'}
      />

      <RatingButtons
        onRate={(r) => void session.rate(r)}
        disabled={session.isRating}
        visible={canRate}
      />

      <KeyboardShortcuts />
    </div>
  );
}
