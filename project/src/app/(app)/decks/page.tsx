import type { Metadata } from 'next';

import { DeckList } from '@/features/decks/components/DeckList';

export const metadata: Metadata = {
  title: 'Decks',
};

export default function DecksPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Decks
        </h1>
        <p className="text-sm text-muted-foreground">
          Organize flashcards into decks, favorites, and archives.
        </p>
      </header>
      <DeckList />
    </div>
  );
}
