import {
  ApiHttpError,
  handleRouteError,
  jsonOk,
  requireAuth,
} from '@/lib/api-helpers';
import { store } from '@/lib/store';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(_request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    const { id } = await context.params;
    const card = await store.toggleBookmark(id, session.id);
    if (!card) {
      throw new ApiHttpError('Card not found', 404);
    }
    return jsonOk(card);
  } catch (error) {
    return handleRouteError(error);
  }
}
