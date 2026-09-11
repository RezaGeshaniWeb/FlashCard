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
    const deck = await store.toggleArchive(id, session.id);
    if (!deck) {
      throw new ApiHttpError('Deck not found', 404);
    }
    return jsonOk(deck);
  } catch (error) {
    return handleRouteError(error);
  }
}
