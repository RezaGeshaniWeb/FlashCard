import {
  ApiHttpError,
  handleRouteError,
  jsonOk,
  parseBody,
  requireAuth,
} from '@/lib/api-helpers';
import { sessionSchema } from '@/lib/api-schemas';
import { store } from '@/lib/store';

type RouteContext = { params: Promise<{ deckId: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    const { deckId } = await context.params;
    const body = await parseBody(request, sessionSchema);

    const owned = await store.assertDeckOwnership(deckId, session.id);
    if (!owned) {
      throw new ApiHttpError('Deck not found', 404);
    }

    if (body.action === 'start') {
      const mode = body.mode ?? 'review';
      const studySession = await store.startSession({
        userId: session.id,
        deckId,
        mode,
      });
      return jsonOk(studySession, 201);
    }

    if (!body.sessionId) {
      throw new ApiHttpError('sessionId is required to end a session', 400);
    }

    const ended = await store.endSession(
      body.sessionId,
      session.id,
      body.stats,
    );
    if (!ended) {
      throw new ApiHttpError('Session not found', 404);
    }
    return jsonOk(ended);
  } catch (error) {
    return handleRouteError(error);
  }
}
