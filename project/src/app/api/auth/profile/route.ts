import {
  ApiHttpError,
  handleRouteError,
  jsonOk,
  parseBody,
  requireAuth,
} from '@/lib/api-helpers';
import { setAuthCookie, signToken } from '@/lib/auth';
import { updateProfileSchema } from '@/lib/api-schemas';
import { store } from '@/lib/store';

export async function PATCH(request: Request) {
  try {
    const session = await requireAuth();
    const body = await parseBody(request, updateProfileSchema);
    const user = await store.updateProfile(session.id, body);
    if (!user) {
      throw new ApiHttpError('User not found', 404);
    }

    const token = await signToken(user);
    await setAuthCookie(token);
    return jsonOk(user);
  } catch (error) {
    return handleRouteError(error);
  }
}
