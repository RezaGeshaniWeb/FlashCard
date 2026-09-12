'use client';

import Link from 'next/link';
import { use } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { buttonVariants } from '@/components/ui/button-variants';
import { ErrorState } from '@/components/ui/ErrorState';
import { Loader } from '@/components/ui/Loader';
import { ROUTES } from '@/constants';
import { useDeck } from '@/features/decks/hooks/useDecks';
import { FlashcardList } from '@/features/flashcards/components/FlashcardList';
import { useT } from '@/i18n';
import { cn } from '@/utils/cn';

interface DeckDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function DeckDetailPage({ params }: DeckDetailPageProps) {
  const { id } = use(params);
  const { data: deck, isLoading, isError, refetch } = useDeck(id);
  const t = useT();

  if (isLoading) {
    return <Loader label={t('decks.loadingDeck')} fullPage />;
  }

  if (isError || !deck) {
    return (
      <ErrorState
        title={t('decks.notFoundTitle')}
        description={t('decks.notFoundDescription')}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div>
        <Link
          href={ROUTES.DECKS}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t('decks.backToDecks')}
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-3">
              <span
                className="h-4 w-4 shrink-0 rounded-full"
                style={{ backgroundColor: deck.color }}
                aria-hidden
              />
              <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground">
                {deck.title}
              </h1>
            </div>
            {deck.description ? (
              <p className="max-w-2xl text-sm text-muted-foreground">
                {deck.description}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Badge variant="neutral">
                {t('common.cards', { count: deck.stats.totalCards })}
              </Badge>
              <Badge
                variant={deck.stats.dueCards > 0 ? 'warning' : 'success'}
              >
                {t('common.due', { count: deck.stats.dueCards })}
              </Badge>
              {deck.isFavorite ? (
                <Badge variant="default">{t('common.favorite')}</Badge>
              ) : null}
              {deck.isArchived ? (
                <Badge variant="outline">{t('common.archived')}</Badge>
              ) : null}
            </div>
          </div>

          <Link
            href={ROUTES.STUDY(deck.id)}
            className={cn(buttonVariants({ size: 'lg' }), 'shrink-0')}
            aria-label={t('decks.studyAria', { title: deck.title })}
          >
            <BookOpen className="h-4 w-4" aria-hidden />
            {t('decks.study')}
          </Link>
        </div>
      </div>

      <section aria-labelledby="cards-heading" className="flex flex-col gap-4">
        <h2
          id="cards-heading"
          className="text-lg font-semibold text-foreground"
        >
          {t('decks.cardsHeading')}
        </h2>
        <FlashcardList deckId={deck.id} />
      </section>
    </div>
  );
}
