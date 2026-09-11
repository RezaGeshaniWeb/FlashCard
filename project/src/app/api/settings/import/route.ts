import {
  handleRouteError,
  jsonOk,
  parseBody,
  requireAuth,
} from '@/lib/api-helpers';
import { importDataSchema } from '@/lib/api-schemas';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await parseBody(request, importDataSchema);
    const result = await store.importUserData(session.id, body);
    return jsonOk(result, 201, 'Data imported');
  } catch (error) {
    return handleRouteError(error);
  }
}
