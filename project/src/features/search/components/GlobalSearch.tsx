'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, Layers, Search } from 'lucide-react';
import { ROUTES } from '@/constants';
import { useUiStore } from '@/store/ui-store';
import { useSearch } from '../hooks/useSearch';
import { Dialog } from '@/components/ui/Dialog';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Loader';

export function GlobalSearch() {
  const router = useRouter();
  const open = useUiStore((s) => s.globalSearchOpen);
  const setOpen = useUiStore((s) => s.setGlobalSearchOpen);
  const toggle = useUiStore((s) => s.toggleGlobalSearch);
  const { query, setQuery, results, isLoading, debounced } = useSearch();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggle]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open, setQuery]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Search"
      description="Find decks and flashcards. Press Esc to close."
      className="max-w-xl"
    >
      <div className="flex flex-col gap-4">
        <SearchInput
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery('')}
          placeholder="Search decks and cards…"
          aria-label="Global search"
        />

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : null}

        {!isLoading && debounced.length >= 2 && results ? (
          <div className="max-h-80 space-y-4 overflow-y-auto">
            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Decks ({results.decks.length})
              </h3>
              {results.decks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No decks found</p>
              ) : (
                <ul className="flex flex-col gap-1">
                  {results.decks.map((deck) => (
                    <li key={deck.id}>
                      <button
                        type="button"
                        onClick={() => go(ROUTES.DECK_DETAIL(deck.id))}
                        className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-muted"
                      >
                        <Layers className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                        <span className="truncate font-medium">{deck.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Cards ({results.cards.length})
              </h3>
              {results.cards.length === 0 ? (
                <p className="text-sm text-muted-foreground">No cards found</p>
              ) : (
                <ul className="flex flex-col gap-1">
                  {results.cards.map((card) => (
                    <li key={card.id}>
                      <button
                        type="button"
                        onClick={() => go(ROUTES.DECK_DETAIL(card.deckId))}
                        className="flex w-full items-start gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-muted"
                      >
                        <FileText
                          className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                          aria-hidden
                        />
                        <span className="min-w-0">
                          <span className="block truncate font-medium">
                            {card.front}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {card.back}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {results.decks.length === 0 && results.cards.length === 0 ? (
              <EmptyState
                title="No results"
                description={`Nothing matched “${debounced}”.`}
                icon={<Search className="h-6 w-6" aria-hidden />}
                className="border-0 py-6"
              />
            ) : null}
          </div>
        ) : null}

        {!isLoading && debounced.length < 2 ? (
          <p className="text-center text-sm text-muted-foreground">
            Type at least 2 characters. Shortcut:{' '}
            <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-xs">
              Ctrl
            </kbd>{' '}
            +{' '}
            <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-xs">
              K
            </kbd>
          </p>
        ) : null}

        <p className="text-center text-xs text-muted-foreground">
          Or browse{' '}
          <Link
            href={ROUTES.DECKS}
            className="font-medium text-primary hover:underline"
            onClick={() => setOpen(false)}
          >
            all decks
          </Link>
        </p>
      </div>
    </Dialog>
  );
}
