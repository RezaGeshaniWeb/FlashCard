import { handleRouteError, jsonOk, requireAuth } from '@/lib/api-helpers';
import { store } from '@/lib/store';

export async function GET() {
  try {
    const session = await requireAuth();
    const activity = await store.getDailyActivity(session.id);
    return jsonOk(activity);
  } catch (error) {
    return handleRouteError(error);
  }
}
