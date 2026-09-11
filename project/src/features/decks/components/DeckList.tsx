'use client';

import { useMemo, useState } from 'react';
import { Library } from 'lucide-react';

import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Loader } from '@/components/ui/Loader';
import { DeckCard } from '@/features/decks/components/DeckCard';
import { DeckFormDialog } from '@/features/decks/components/DeckFormDialog';
import {
  DeckToolbar,
  type DeckFilterMode,
} from '@/features/decks/components/DeckToolbar';
import { useDecks } from '@/features/decks/hooks/useDecks';
import type { DeckSort, DeckWithCounts } from '@/types';

export function DeckList() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<DeckFilterMode>('all');
  const [sort, setSort] = useState<DeckSort>('updatedAt');
  const [tag, setTag] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<DeckWithCounts | null>(null);

  const listParams = useMemo(
    () => ({
      search: search.trim() || undefined,
      sort,
      archived: filter === 'archived' ? true : filter === 'all' ? false : undefined,
      favorite: filter === 'favorites' ? true : undefined,
      tag: tag || undefined,
    }),
    [search, filter, sort, tag],
  );

  const { data, isLoading, isError, refetch, isFetching } = useDecks(listParams);

  const tagOptions = useMemo(() => {
    const tags = new Set<string>();
    if (tag) tags.add(tag);
    for (const deck of data ?? []) {
      for (const value of deck.tags) {
        tags.add(value);
      }
    }
    return [...tags].sort((a, b) => a.localeCompare(b));
  }, [data, tag]);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (deck: DeckWithCounts) => {
    setEditing(deck);
    setDialogOpen(true);
  };

  const hasActiveFilters = Boolean(search || filter !== 'all' || tag);

  return (
    <div className="flex flex-col gap-6">
      <DeckToolbar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        sort={sort}
        onSortChange={setSort}
        tag={tag}
        onTagChange={setTag}
        tagOptions={tagOptions}
        onCreate={openCreate}
      />

      {isLoading ? <Loader label="Loading decks…" /> : null}

      {isError ? (
        <ErrorState
          title="Could not load decks"
          description="Check your connection and try again."
          onRetry={() => void refetch()}
        />
      ) : null}

      {!isLoading && !isError && data && data.length === 0 ? (
        <EmptyState
          title="No decks yet"
          description={
            hasActiveFilters
              ? 'Try a different search or filter.'
              : 'Create your first deck to start adding flashcards.'
          }
          icon={<Library className="h-6 w-6" aria-hidden />}
          actionLabel={hasActiveFilters ? undefined : 'Create deck'}
          onAction={hasActiveFilters ? undefined : openCreate}
        />
      ) : null}

      {!isLoading && !isError && data && data.length > 0 ? (
        <ul
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          aria-busy={isFetching || undefined}
          aria-label="Deck list"
        >
          {data.map((deck) => (
            <li key={deck.id}>
              <DeckCard deck={deck} onEdit={openEdit} />
            </li>
          ))}
        </ul>
      ) : null}

      <DeckFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        deck={editing}
      />
    </div>
  );
}
