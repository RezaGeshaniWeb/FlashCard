import {
  ApiHttpError,
  handleRouteError,
  jsonOk,
  parseBody,
  requireAuth,
} from '@/lib/api-helpers';
import { importCardsSchema } from '@/lib/api-schemas';
import { store } from '@/lib/store';
import {
  importFromCsv,
  importFromJson,
  importFromMarkdown,
} from '@/utils/export';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    const { id } = await context.params;
    const owned = await store.assertDeckOwnership(id, session.id);
    if (!owned) {
      throw new ApiHttpError('Deck not found', 404);
    }

    const body = await parseBody(request, importCardsSchema);

    let cards;
    try {
      switch (body.format) {
        case 'csv':
          cards = importFromCsv(body.content);
          break;
        case 'json':
          cards = importFromJson(body.content);
          break;
        case 'markdown':
          cards = importFromMarkdown(body.content);
          break;
      }
    } catch (parseError) {
      const message =
        parseError instanceof Error
          ? parseError.message
          : 'Failed to parse import content';
      throw new ApiHttpError(message, 400);
    }

    const created = await store.importCards(id, cards);
    return jsonOk(
      { cards: created, imported: created.length },
      201,
      `Imported ${created.length} cards`,
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
