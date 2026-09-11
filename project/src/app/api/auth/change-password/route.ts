import {
  handleRouteError,
  jsonOk,
  parseBody,
  requireAuth,
} from '@/lib/api-helpers';
import { changePasswordSchema } from '@/lib/api-schemas';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await parseBody(request, changePasswordSchema);
    await store.changePassword(
      session.id,
      body.currentPassword,
      body.newPassword,
    );
    return jsonOk({ ok: true }, 200, 'Password updated');
  } catch (error) {
    return handleRouteError(error);
  }
}
