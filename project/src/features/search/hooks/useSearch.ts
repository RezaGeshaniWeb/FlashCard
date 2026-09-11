'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchService } from '../services/search-service';

export const searchKeys = {
  all: ['search'] as const,
  query: (q: string) => [...searchKeys.all, q] as const,
};

export function useSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [debounced, setDebounced] = useState(initialQuery);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(query.trim()), 250);
    return () => window.clearTimeout(id);
  }, [query]);

  const searchQuery = useQuery({
    queryKey: searchKeys.query(debounced),
    queryFn: () => searchService.search(debounced),
    enabled: debounced.length >= 2,
  });

  return {
    query,
    setQuery,
    debounced,
    results: searchQuery.data,
    isLoading: searchQuery.isFetching && debounced.length >= 2,
    isError: searchQuery.isError,
    error: searchQuery.error,
  };
}
