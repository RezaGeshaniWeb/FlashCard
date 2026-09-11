import {
  ApiHttpError,
  handleRouteError,
  jsonOk,
  parseBody,
  requireAuth,
} from '@/lib/api-helpers';
import { updateDeckSchema } from '@/lib/api-schemas';
import { store } from '@/lib/store';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    const { id } = await context.params;
    const deck = await store.getDeckWithStats(id, session.id);
    if (!deck) {
      throw new ApiHttpError('Deck not found', 404);
    }
    return jsonOk(deck);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    const { id } = await context.params;
    const owned = await store.assertDeckOwnership(id, session.id);
    if (!owned) {
      throw new ApiHttpError('Deck not found', 404);
    }

    const body = await parseBody(request, updateDeckSchema);
    const deck = await store.updateDeck(id, body);
    if (!deck) {
      throw new ApiHttpError('Deck not found', 404);
    }
    return jsonOk(deck);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    const { id } = await context.params;
    const owned = await store.assertDeckOwnership(id, session.id);
    if (!owned) {
      throw new ApiHttpError('Deck not found', 404);
    }

    const deleted = await store.deleteDeck(id);
    if (!deleted) {
      throw new ApiHttpError('Deck not found', 404);
    }
    return jsonOk({ ok: true }, 200, 'Deck deleted');
  } catch (error) {
    return handleRouteError(error);
  }
}
