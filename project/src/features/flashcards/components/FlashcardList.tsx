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
import type { Flashcard } from '@/types';
import { cn } from '@/utils/cn';

export interface FlashcardListProps {
  deckId: string;
}

const DIFFICULTY_FILTER = [
  { value: '', label: 'All difficulties' },
  ...DIFFICULTY_LEVELS.map((level) => ({
    value: level,
    label: level.charAt(0).toUpperCase() + level.slice(1),
  })),
];

function isDifficulty(
  value: string,
): value is (typeof DIFFICULTY_LEVELS)[number] {
  return (DIFFICULTY_LEVELS as readonly string[]).includes(value);
}

export function FlashcardList({ deckId }: FlashcardListProps) {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editing, setEditing] = useState<Flashcard | null>(null);

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
              placeholder="Search cards…"
              aria-label="Search cards"
            />
          </div>
          <Select
            label="Difficulty"
            className="sm:w-44"
            options={DIFFICULTY_FILTER}
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            aria-label="Filter by difficulty"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setImportOpen(true)}
            aria-label="Import cards"
          >
            <Upload className="h-4 w-4" aria-hidden />
            Import
          </Button>
          <Button type="button" onClick={openCreate} aria-label="Add card">
            <Plus className="h-4 w-4" aria-hidden />
            Add card
          </Button>
        </div>
      </div>

      {isLoading ? <Loader label="Loading cards…" /> : null}

      {isError ? (
        <ErrorState
          title="Could not load cards"
          onRetry={() => void refetch()}
        />
      ) : null}

      {!isLoading && !isError && data && data.length === 0 ? (
        <EmptyState
          title="No cards in this deck"
          description="Add a card or import from CSV, JSON, or Markdown."
          icon={<Layers className="h-6 w-6" aria-hidden />}
          actionLabel="Add card"
          onAction={openCreate}
        />
      ) : null}

      {!isLoading && !isError && data && data.length > 0 ? (
        <ul
          className="flex flex-col gap-3"
          aria-label="Flashcard list"
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
                    <Badge variant="neutral">{card.difficulty}</Badge>
                    {card.isBookmarked ? (
                      <Badge variant="secondary">Bookmarked</Badge>
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
                        ? `Remove bookmark from ${card.front}`
                        : `Bookmark ${card.front}`
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
                    aria-label={`Edit card ${card.front}`}
                    onClick={() => openEdit(card)}
                  >
                    <Pencil className="h-4 w-4" aria-hidden />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-danger"
                    aria-label={`Delete card ${card.front}`}
                    loading={remove.isPending}
                    onClick={() => {
                      if (window.confirm('Delete this card?')) {
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
