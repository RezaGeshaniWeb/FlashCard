import {
  handleRouteError,
  jsonOk,
  parseBody,
} from '@/lib/api-helpers';
import { resetPasswordSchema } from '@/lib/api-schemas';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await parseBody(request, resetPasswordSchema);
    await store.resetPasswordWithToken(body.token, body.password);
    return jsonOk({ ok: true }, 200, 'Password updated');
  } catch (error) {
    return handleRouteError(error);
  }
}
