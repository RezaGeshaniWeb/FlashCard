import {
  ApiHttpError,
  handleRouteError,
  jsonOk,
  requireAuth,
} from '@/lib/api-helpers';
import { clearAuthCookie } from '@/lib/auth';
import { store } from '@/lib/store';

export async function DELETE() {
  try {
    const session = await requireAuth();
    const deleted = await store.deleteUser(session.id);
    if (!deleted) {
      throw new ApiHttpError('User not found', 404);
    }
    await clearAuthCookie();
    return jsonOk({ ok: true }, 200, 'Account deleted');
  } catch (error) {
    return handleRouteError(error);
  }
}
