import {
  ApiHttpError,
  handleRouteError,
  jsonOk,
  parseBody,
  requireAuth,
} from '@/lib/api-helpers';
import { createCardSchema, difficultySchema } from '@/lib/api-schemas';
import { store } from '@/lib/store';
import type { Difficulty } from '@/types';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    const { id } = await context.params;
    const owned = await store.assertDeckOwnership(id, session.id);
    if (!owned) {
      throw new ApiHttpError('Deck not found', 404);
    }

    const { searchParams } = new URL(request.url);
    const difficultyRaw = searchParams.get('difficulty');
    let difficulty: Difficulty | undefined;
    if (difficultyRaw) {
      const parsed = difficultySchema.safeParse(difficultyRaw);
      if (!parsed.success) {
        throw new ApiHttpError('Invalid difficulty', 400);
      }
      difficulty = parsed.data;
    }

    const cards = await store.getCardsFiltered(id, {
      search: searchParams.get('search') ?? undefined,
      tag: searchParams.get('tag') ?? undefined,
      difficulty,
    });

    return jsonOk(cards);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    const { id } = await context.params;
    const owned = await store.assertDeckOwnership(id, session.id);
    if (!owned) {
      throw new ApiHttpError('Deck not found', 404);
    }

    const body = await parseBody(request, createCardSchema);
    const card = await store.createCard(id, {
      ...body,
      imageUrl: body.imageUrl || undefined,
      audioUrl: body.audioUrl || undefined,
    });
    return jsonOk(card, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
