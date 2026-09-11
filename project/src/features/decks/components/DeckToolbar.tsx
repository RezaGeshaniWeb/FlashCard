'use client';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
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

const FILTER_OPTIONS = [
  { value: 'all', label: 'All decks' },
  { value: 'favorites', label: 'Favorites' },
  { value: 'archived', label: 'Archived' },
];

const SORT_OPTIONS: { value: DeckSort; label: string }[] = [
  { value: 'updatedAt', label: 'Recently updated' },
  { value: 'createdAt', label: 'Recently created' },
  { value: 'title', label: 'Title' },
  { value: 'cardCount', label: 'Card count' },
  { value: 'dueCount', label: 'Due count' },
];

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
  const tagSelectOptions = [
    { value: '', label: 'All tags' },
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
            placeholder="Search decks…"
            aria-label="Search decks"
          />
        </div>
        <Select
          label="Filter"
          className="sm:w-40"
          options={FILTER_OPTIONS}
          value={filter}
          onChange={(e) => onFilterChange(e.target.value as DeckFilterMode)}
          aria-label="Filter decks"
        />
        <Select
          label="Tag"
          className="sm:w-40"
          options={tagSelectOptions}
          value={tag}
          onChange={(e) => onTagChange(e.target.value)}
          aria-label="Filter by tag"
        />
        <Select
          label="Sort"
          className="sm:w-48"
          options={SORT_OPTIONS}
          value={sort}
          onChange={(e) => onSortChange(e.target.value as DeckSort)}
          aria-label="Sort decks"
        />
      </div>
      <Button type="button" onClick={onCreate} aria-label="Create deck">
        <Plus className="h-4 w-4" aria-hidden />
        New deck
      </Button>
    </div>
  );
}
