import { handleRouteError, jsonOk, requireAuth } from '@/lib/api-helpers';
import { store } from '@/lib/store';

export async function GET() {
  try {
    const session = await requireAuth();
    const stats = await store.getStats(session.id);
    return jsonOk(stats);
  } catch (error) {
    return handleRouteError(error);
  }
}
