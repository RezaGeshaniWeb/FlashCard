import {
  ApiHttpError,
  handleRouteError,
  jsonOk,
  requireAuth,
} from '@/lib/api-helpers';
import { store } from '@/lib/store';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    const { id } = await context.params;
    const deck = await store.duplicateDeck(id, session.id);
    return jsonOk(deck, 201);
  } catch (error) {
    if (error instanceof Error && error.message === 'Deck not found') {
      return handleRouteError(new ApiHttpError('Deck not found', 404));
    }
    return handleRouteError(error);
  }
}
