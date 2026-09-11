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
import { cn } from '@/utils/cn';

interface DeckDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function DeckDetailPage({ params }: DeckDetailPageProps) {
  const { id } = use(params);
  const { data: deck, isLoading, isError, refetch } = useDeck(id);

  if (isLoading) {
    return <Loader label="Loading deck…" fullPage />;
  }

  if (isError || !deck) {
    return (
      <ErrorState
        title="Deck not found"
        description="This deck may have been deleted or you do not have access."
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
          Back to decks
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
                {deck.stats.totalCards} cards
              </Badge>
              <Badge
                variant={deck.stats.dueCards > 0 ? 'warning' : 'success'}
              >
                {deck.stats.dueCards} due
              </Badge>
              {deck.isFavorite ? (
                <Badge variant="default">Favorite</Badge>
              ) : null}
              {deck.isArchived ? (
                <Badge variant="outline">Archived</Badge>
              ) : null}
            </div>
          </div>

          <Link
            href={ROUTES.STUDY(deck.id)}
            className={cn(buttonVariants({ size: 'lg' }), 'shrink-0')}
            aria-label={`Study ${deck.title}`}
          >
            <BookOpen className="h-4 w-4" aria-hidden />
            Study
          </Link>
        </div>
      </div>

      <section aria-labelledby="cards-heading" className="flex flex-col gap-4">
        <h2
          id="cards-heading"
          className="text-lg font-semibold text-foreground"
        >
          Cards
        </h2>
        <FlashcardList deckId={deck.id} />
      </section>
    </div>
  );
}
