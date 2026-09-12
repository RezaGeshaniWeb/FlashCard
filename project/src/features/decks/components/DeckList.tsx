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
import { useT } from '@/i18n';
import type { DeckSort, DeckWithCounts } from '@/types';

export function DeckList() {
  const t = useT();
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
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {t('decks.pageTitle')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('decks.pageSubtitle')}
        </p>
      </header>

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

      {isLoading ? <Loader label={t('decks.loading')} /> : null}

      {isError ? (
        <ErrorState
          title={t('decks.loadErrorTitle')}
          description={t('decks.loadErrorDescription')}
          onRetry={() => void refetch()}
        />
      ) : null}

      {!isLoading && !isError && data && data.length === 0 ? (
        <EmptyState
          title={t('decks.emptyTitle')}
          description={
            hasActiveFilters
              ? t('decks.emptyFiltered')
              : t('decks.emptyDefault')
          }
          icon={<Library className="h-6 w-6" aria-hidden />}
          actionLabel={hasActiveFilters ? undefined : t('decks.createDeck')}
          onAction={hasActiveFilters ? undefined : openCreate}
        />
      ) : null}

      {!isLoading && !isError && data && data.length > 0 ? (
        <ul
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          aria-busy={isFetching || undefined}
          aria-label={t('decks.listAria')}
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
