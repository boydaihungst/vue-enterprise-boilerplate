import Users from '@tests/mock-api/resources/users';
import { rest } from 'msw';

export default [
  /**
   * Log in a user with a username and password
   */
  rest.post('/api/session', async (req, res, ctx) => {
    try {
      const body: { username: string; password: string } = await req.json();

      const user = await Users.authenticate(body);

      return res(ctx.status(200), ctx.json(user));
    } catch (error: any) {
      return res(ctx.status(401), ctx.json({ message: error.message }));
    }
  }),

  /**
   * Get the user of a provided token, if valid
   */
  rest.get<any>('/api/session', (req, res, ctx) => {
    const currentUser = Users.findBy(
      'token',
      req.headers.get('authorization') || '',
    );

    if (!currentUser) {
      return res(
        ctx.status(401),
        ctx.json({
          message:
            'The token is either invalid or has expired. Please log in again.',
        }),
      );
    }
    return res(ctx.status(200), ctx.json(currentUser));
  }),

  /**
   * A simple ping for checking online status
   */
  rest.head('/api/ping', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.body('OK'));
  }),
];
