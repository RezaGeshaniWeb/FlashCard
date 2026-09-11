import {
  ApiHttpError,
  handleRouteError,
  jsonOk,
  parseBody,
} from '@/lib/api-helpers';
import { setAuthCookie, signToken } from '@/lib/auth';
import { loginSchema } from '@/lib/api-schemas';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await parseBody(request, loginSchema);
    const user = await store.verifyPassword(body.email, body.password);
    if (!user) {
      throw new ApiHttpError('Invalid email or password', 401);
    }

    const publicUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      settings: user.settings,
      createdAt: user.createdAt,
    };

    const options = { rememberMe: body.rememberMe === true };
    const token = await signToken(publicUser, options);
    await setAuthCookie(token, options);
    return jsonOk(publicUser);
  } catch (error) {
    return handleRouteError(error);
  }
}
