import type { Metadata } from 'next';

import { DeckList } from '@/features/decks/components/DeckList';

export const metadata: Metadata = {
  title: 'Decks',
};

export default function DecksPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <DeckList />
    </div>
  );
}
