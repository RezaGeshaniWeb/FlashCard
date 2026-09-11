import {
  ApiHttpError,
  handleRouteError,
  jsonOk,
  parseBody,
  requireAuth,
} from '@/lib/api-helpers';
import { cardNotesSchema } from '@/lib/api-schemas';
import { store } from '@/lib/store';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    const { id } = await context.params;
    const body = await parseBody(request, cardNotesSchema);
    const card = await store.updateCardNotes(id, session.id, body.notes);
    if (!card) {
      throw new ApiHttpError('Card not found', 404);
    }
    return jsonOk(card);
  } catch (error) {
    return handleRouteError(error);
  }
}
