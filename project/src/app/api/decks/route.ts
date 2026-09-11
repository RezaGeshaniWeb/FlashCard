import {
  handleRouteError,
  jsonOk,
  parseBody,
  parseBooleanParam,
  requireAuth,
} from '@/lib/api-helpers';
import { createDeckSchema, deckSortSchema } from '@/lib/api-schemas';
import { store } from '@/lib/store';
import type { DeckSort } from '@/types';

export async function GET(request: Request) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);

    const sortRaw = searchParams.get('sort');
    const sortParsed = sortRaw
      ? deckSortSchema.safeParse(sortRaw)
      : null;
    const sort: DeckSort | undefined = sortParsed?.success
      ? sortParsed.data
      : undefined;

    const decks = await store.getDecksWithCounts(session.id, {
      search: searchParams.get('search') ?? undefined,
      archived: parseBooleanParam(searchParams.get('archived')),
      favorite: parseBooleanParam(searchParams.get('favorite')),
      sort,
      tag: searchParams.get('tag') ?? undefined,
    });

    return jsonOk(decks);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await parseBody(request, createDeckSchema);
    const deck = await store.createDeck(session.id, body);
    return jsonOk(deck, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
