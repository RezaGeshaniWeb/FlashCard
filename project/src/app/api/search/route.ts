import {
  ApiHttpError,
  handleRouteError,
  jsonOk,
  requireAuth,
} from '@/lib/api-helpers';
import { store } from '@/lib/store';

export async function GET(request: Request) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() ?? '';

    if (!q) {
      throw new ApiHttpError('Query parameter q is required', 400);
    }

    const results = await store.search(session.id, q);
    return jsonOk(results);
  } catch (error) {
    return handleRouteError(error);
  }
}
