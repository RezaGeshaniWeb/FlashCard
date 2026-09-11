import { handleRouteError, jsonOk, requireAuth } from '@/lib/api-helpers';
import { store } from '@/lib/store';

export async function GET() {
  try {
    const session = await requireAuth();
    const data = await store.exportUserData(session.id);
    return jsonOk(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
