import {
  ApiHttpError,
  handleRouteError,
  jsonOk,
  parseBody,
  requireAuth,
} from '@/lib/api-helpers';
import { updateSettingsSchema } from '@/lib/api-schemas';
import { store } from '@/lib/store';

export async function GET() {
  try {
    const session = await requireAuth();
    const settings = await store.getSettings(session.id);
    if (!settings) {
      throw new ApiHttpError('User not found', 404);
    }
    return jsonOk(settings);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireAuth();
    const body = await parseBody(request, updateSettingsSchema);
    const settings = await store.updateSettings(session.id, body);
    if (!settings) {
      throw new ApiHttpError('User not found', 404);
    }
    return jsonOk(settings);
  } catch (error) {
    return handleRouteError(error);
  }
}
