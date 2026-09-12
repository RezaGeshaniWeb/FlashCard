'use client';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { useT } from '@/i18n';
import type { DeckSort } from '@/types';

export type DeckFilterMode = 'all' | 'favorites' | 'archived';

export interface DeckToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filter: DeckFilterMode;
  onFilterChange: (value: DeckFilterMode) => void;
  sort: DeckSort;
  onSortChange: (value: DeckSort) => void;
  tag: string;
  onTagChange: (value: string) => void;
  tagOptions: string[];
  onCreate: () => void;
}

export function DeckToolbar({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
  tag,
  onTagChange,
  tagOptions,
  onCreate,
}: DeckToolbarProps) {
  const t = useT();

  const filterOptions = [
    { value: 'all', label: t('decks.allDecks') },
    { value: 'favorites', label: t('decks.favorites') },
    { value: 'archived', label: t('decks.archived') },
  ];

  const sortOptions: { value: DeckSort; label: string }[] = [
    { value: 'updatedAt', label: t('decks.sortUpdated') },
    { value: 'createdAt', label: t('decks.sortCreated') },
    { value: 'title', label: t('decks.sortTitle') },
    { value: 'cardCount', label: t('decks.sortCardCount') },
    { value: 'dueCount', label: t('decks.sortDueCount') },
  ];

  const tagSelectOptions = [
    { value: '', label: t('decks.allTags') },
    ...tagOptions.map((value) => ({ value, label: value })),
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-end sm:flex-wrap">
        <div className="w-full sm:max-w-xs">
          <SearchInput
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            placeholder={t('decks.searchPlaceholder')}
            aria-label={t('decks.searchAria')}
          />
        </div>
        <Select
          label={t('decks.filter')}
          className="sm:w-40"
          options={filterOptions}
          value={filter}
          onChange={(e) => onFilterChange(e.target.value as DeckFilterMode)}
          aria-label={t('decks.filterAria')}
        />
        <Select
          label={t('decks.tag')}
          className="sm:w-40"
          options={tagSelectOptions}
          value={tag}
          onChange={(e) => onTagChange(e.target.value)}
          aria-label={t('decks.tagAria')}
        />
        <Select
          label={t('decks.sort')}
          className="sm:w-48"
          options={sortOptions}
          value={sort}
          onChange={(e) => onSortChange(e.target.value as DeckSort)}
          aria-label={t('decks.sortAria')}
        />
      </div>
      <Button
        type="button"
        onClick={onCreate}
        aria-label={t('decks.createDeck')}
      >
        <Plus className="h-4 w-4" aria-hidden />
        {t('decks.newDeck')}
      </Button>
    </div>
  );
}
