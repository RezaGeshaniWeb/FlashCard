import {
  ApiHttpError,
  handleRouteError,
  jsonOk,
  requireAuth,
} from '@/lib/api-helpers';
import { studyModeSchema } from '@/lib/api-schemas';
import { store } from '@/lib/store';
import type { StudyMode } from '@/types';

type RouteContext = { params: Promise<{ deckId: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    const { deckId } = await context.params;
    const { searchParams } = new URL(request.url);

    const modeRaw = searchParams.get('mode') ?? 'review';
    const modeParsed = studyModeSchema.safeParse(modeRaw);
    if (!modeParsed.success) {
      throw new ApiHttpError('Invalid study mode', 400);
    }
    const mode: StudyMode = modeParsed.data;

    const cards = await store.getStudyCards(deckId, session.id, mode);
    return jsonOk({ deckId, mode, cards });
  } catch (error) {
    return handleRouteError(error);
  }
}
