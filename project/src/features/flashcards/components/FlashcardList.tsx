'use client';

import { useMemo, useState } from 'react';
import { Bookmark, Layers, Pencil, Plus, Trash2, Upload } from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Loader } from '@/components/ui/Loader';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { DIFFICULTY_LEVELS } from '@/constants';
import { FlashcardFormDialog } from '@/features/flashcards/components/FlashcardFormDialog';
import { ImportCardsDialog } from '@/features/flashcards/components/ImportCardsDialog';
import {
  useDeleteFlashcard,
  useFlashcards,
  useToggleBookmark,
} from '@/features/flashcards/hooks/useFlashcards';
import type { ListCardsParams } from '@/features/flashcards/services/flashcard-service';
import { useT } from '@/i18n';
import type { Flashcard } from '@/types';
import { cn } from '@/utils/cn';

export interface FlashcardListProps {
  deckId: string;
}

const DIFFICULTY_LABEL_KEYS = {
  beginner: 'common.difficultyBeginner',
  intermediate: 'common.difficultyIntermediate',
  advanced: 'common.difficultyAdvanced',
} as const;

function isDifficulty(
  value: string,
): value is (typeof DIFFICULTY_LEVELS)[number] {
  return (DIFFICULTY_LEVELS as readonly string[]).includes(value);
}

export function FlashcardList({ deckId }: FlashcardListProps) {
  const t = useT();
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editing, setEditing] = useState<Flashcard | null>(null);

  const difficultyFilter = useMemo(
    () => [
      { value: '', label: t('common.difficultyAll') },
      ...DIFFICULTY_LEVELS.map((level) => ({
        value: level,
        label: t(DIFFICULTY_LABEL_KEYS[level]),
      })),
    ],
    [t],
  );

  const params = useMemo((): ListCardsParams => {
    return {
      search: search.trim() || undefined,
      difficulty: isDifficulty(difficulty) ? difficulty : undefined,
    };
  }, [search, difficulty]);

  const { data, isLoading, isError, refetch, isFetching } = useFlashcards(
    deckId,
    params,
  );
  const remove = useDeleteFlashcard();
  const bookmark = useToggleBookmark();

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (card: Flashcard) => {
    setEditing(card);
    setFormOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row">
          <div className="w-full sm:max-w-xs">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch('')}
              placeholder={t('flashcards.searchPlaceholder')}
              aria-label={t('flashcards.searchAria')}
            />
          </div>
          <Select
            label={t('flashcards.difficulty')}
            className="sm:w-44"
            options={difficultyFilter}
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            aria-label={t('flashcards.difficultyAria')}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setImportOpen(true)}
            aria-label={t('flashcards.importAria')}
          >
            <Upload className="h-4 w-4" aria-hidden />
            {t('flashcards.import')}
          </Button>
          <Button
            type="button"
            onClick={openCreate}
            aria-label={t('flashcards.addCard')}
          >
            <Plus className="h-4 w-4" aria-hidden />
            {t('flashcards.addCard')}
          </Button>
        </div>
      </div>

      {isLoading ? <Loader label={t('flashcards.loading')} /> : null}

      {isError ? (
        <ErrorState
          title={t('flashcards.loadErrorTitle')}
          onRetry={() => void refetch()}
        />
      ) : null}

      {!isLoading && !isError && data && data.length === 0 ? (
        <EmptyState
          title={t('flashcards.emptyTitle')}
          description={t('flashcards.emptyDescription')}
          icon={<Layers className="h-6 w-6" aria-hidden />}
          actionLabel={t('flashcards.addCard')}
          onAction={openCreate}
        />
      ) : null}

      {!isLoading && !isError && data && data.length > 0 ? (
        <ul
          className="flex flex-col gap-3"
          aria-label={t('flashcards.listAria')}
          aria-busy={isFetching || undefined}
        >
          {data.map((card) => (
            <li
              key={card.id}
              className="rounded-lg border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="font-medium text-foreground">{card.front}</p>
                  <p className="text-sm text-muted-foreground">{card.back}</p>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="neutral">
                      {t(DIFFICULTY_LABEL_KEYS[card.difficulty])}
                    </Badge>
                    {card.isBookmarked ? (
                      <Badge variant="secondary">
                        {t('flashcards.bookmarked')}
                      </Badge>
                    ) : null}
                    {card.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={
                      card.isBookmarked
                        ? t('study.removeBookmark')
                        : t('study.bookmark')
                    }
                    aria-pressed={card.isBookmarked}
                    loading={bookmark.isPending}
                    onClick={() => bookmark.mutate(card.id)}
                  >
                    <Bookmark
                      className={cn(
                        'h-4 w-4',
                        card.isBookmarked && 'fill-primary text-primary',
                      )}
                      aria-hidden
                    />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={t('flashcards.editTitle')}
                    onClick={() => openEdit(card)}
                  >
                    <Pencil className="h-4 w-4" aria-hidden />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-danger"
                    aria-label={t('decks.delete')}
                    loading={remove.isPending}
                    onClick={() => {
                      if (window.confirm(t('flashcards.deleteConfirm'))) {
                        remove.mutate(card.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <FlashcardFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        deckId={deckId}
        card={editing}
      />
      <ImportCardsDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        deckId={deckId}
      />
    </div>
  );
}
