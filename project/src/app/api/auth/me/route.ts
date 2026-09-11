import {
  ApiHttpError,
  handleRouteError,
  jsonOk,
  requireAuth,
} from '@/lib/api-helpers';
import { store } from '@/lib/store';
import type { PublicUser } from '@/types';

export async function GET() {
  try {
    const session = await requireAuth();
    const user = await store.findUserById(session.id);
    if (!user) {
      throw new ApiHttpError('User not found', 404);
    }

    const publicUser: PublicUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      settings: user.settings,
      createdAt: user.createdAt,
    };
    return jsonOk(publicUser);
  } catch (error) {
    return handleRouteError(error);
  }
}
