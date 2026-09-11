import {
  handleRouteError,
  jsonOk,
  parseBody,
} from '@/lib/api-helpers';
import { forgotPasswordSchema } from '@/lib/api-schemas';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await parseBody(request, forgotPasswordSchema);
    const reset = await store.createPasswordResetToken(body.email);

    // Always return the same outer message; include a local reset token when
    // the account exists so the demo app works without an email provider.
    return jsonOk(
      {
        sent: true,
        ...(reset
          ? {
              resetToken: reset.token,
              expiresAt: reset.expiresAt,
            }
          : {}),
      },
      200,
      'If that account exists, reset instructions are available',
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
