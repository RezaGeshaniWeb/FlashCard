import {
  handleRouteError,
  jsonOk,
  parseBody,
  requireAuth,
} from '@/lib/api-helpers';
import { reviewSchema } from '@/lib/api-schemas';
import { store } from '@/lib/store';

type RouteContext = { params: Promise<{ deckId: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    const { deckId } = await context.params;
    const body = await parseBody(request, reviewSchema);

    const owned = await store.assertDeckOwnership(deckId, session.id);
    if (!owned) {
      throw new Error('Deck not found');
    }

    const card = await store.assertCardOwnership(body.cardId, session.id);
    if (!card || card.deckId !== deckId) {
      throw new Error('Card not found');
    }

    const result = await store.recordReview({
      userId: session.id,
      cardId: body.cardId,
      rating: body.rating,
      mode: body.mode,
      sessionId: body.sessionId,
    });

    return jsonOk(result);
  } catch (error) {
    return handleRouteError(error);
  }
}
