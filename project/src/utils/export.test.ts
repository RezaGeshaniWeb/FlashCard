import { describe, expect, it } from 'vitest';
import type { Flashcard } from '@/types';
import {
  exportToCsv,
  exportToJson,
  exportToMarkdown,
  importFromCsv,
  importFromJson,
  importFromMarkdown,
} from '@/utils/export';

function makeCard(overrides: Partial<Flashcard> = {}): Flashcard {
  return {
    id: 'card-1',
    deckId: 'deck-1',
    front: 'Hello',
    back: 'Salut',
    hint: 'greeting',
    example: 'Hello there',
    tags: ['french', 'basics'],
    difficulty: 'beginner',
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReviewAt: new Date().toISOString(),
    memoryScore: 40,
    isBookmarked: false,
    notes: 'First lesson',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('export / import roundtrips', () => {
  const cards = [
    makeCard(),
    makeCard({
      id: 'card-2',
      front: 'Goodbye, friend',
      back: 'Au revoir',
      hint: undefined,
      example: undefined,
      tags: ['french'],
      difficulty: 'intermediate',
      notes: undefined,
    }),
  ];

  it('roundtrips JSON', () => {
    const json = exportToJson(cards);
    const imported = importFromJson(json);

    expect(imported).toHaveLength(2);
    expect(imported[0]).toEqual({
      front: 'Hello',
      back: 'Salut',
      hint: 'greeting',
      example: 'Hello there',
      tags: ['french', 'basics'],
      difficulty: 'beginner',
      notes: 'First lesson',
    });
    expect(imported[1]?.front).toBe('Goodbye, friend');
    expect(imported[1]?.difficulty).toBe('intermediate');
  });

  it('roundtrips CSV including quoted commas', () => {
    const withComma = makeCard({
      front: 'Hello, world',
      back: 'Bonjour, monde',
      notes: 'note with "quotes"',
    });
    const csv = exportToCsv([withComma]);
    const imported = importFromCsv(csv);

    expect(imported).toHaveLength(1);
    expect(imported[0]?.front).toBe('Hello, world');
    expect(imported[0]?.back).toBe('Bonjour, monde');
    expect(imported[0]?.tags).toEqual(['french', 'basics']);
    expect(imported[0]?.notes).toBe('note with "quotes"');
    expect(imported[0]?.difficulty).toBe('beginner');
  });

  it('roundtrips Markdown', () => {
    const markdown = exportToMarkdown(cards);
    const imported = importFromMarkdown(markdown);

    expect(imported).toHaveLength(2);
    expect(imported[0]).toMatchObject({
      front: 'Hello',
      back: 'Salut',
      hint: 'greeting',
      example: 'Hello there',
      tags: ['french', 'basics'],
      difficulty: 'beginner',
      notes: 'First lesson',
    });
    expect(imported[1]?.front).toBe('Goodbye, friend');
    expect(imported[1]?.back).toBe('Au revoir');
    expect(imported[1]?.tags).toEqual(['french']);
  });
});
