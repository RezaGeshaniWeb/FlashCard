import {
  ApiHttpError,
  handleRouteError,
  jsonOk,
  parseBody,
  requireAuth,
} from '@/lib/api-helpers';
import { updateCardSchema } from '@/lib/api-schemas';
import { store } from '@/lib/store';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    const { id } = await context.params;
    const owned = await store.assertCardOwnership(id, session.id);
    if (!owned) {
      throw new ApiHttpError('Card not found', 404);
    }

    const body = await parseBody(request, updateCardSchema);
    const card = await store.updateCard(id, {
      ...body,
      imageUrl: body.imageUrl || undefined,
      audioUrl: body.audioUrl || undefined,
    });
    if (!card) {
      throw new ApiHttpError('Card not found', 404);
    }
    return jsonOk(card);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    const { id } = await context.params;
    const owned = await store.assertCardOwnership(id, session.id);
    if (!owned) {
      throw new ApiHttpError('Card not found', 404);
    }

    const deleted = await store.deleteCard(id);
    if (!deleted) {
      throw new ApiHttpError('Card not found', 404);
    }
    return jsonOk({ ok: true }, 200, 'Card deleted');
  } catch (error) {
    return handleRouteError(error);
  }
}
