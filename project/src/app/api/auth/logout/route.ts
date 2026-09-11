import { clearAuthCookie } from '@/lib/auth';
import { handleRouteError, jsonOk, requireAuth } from '@/lib/api-helpers';

export async function POST() {
  try {
    await requireAuth();
    await clearAuthCookie();
    return jsonOk({ ok: true }, 200, 'Logged out');
  } catch (error) {
    return handleRouteError(error);
  }
}
