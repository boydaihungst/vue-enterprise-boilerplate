import { rest } from 'msw';
import { User } from '@models/user';
import Users from '../resources/users';

export default [
  /**
   * Log in a user with a username and password
   */
  rest.post<User>('/api/session', async (req, res, ctx) => {
    try {
      const user = await Users.authenticate(req.body);
      return res(ctx.status(200), ctx.json(user));
    } catch (error) {
      return res(ctx.status(401), ctx.json({ message: error.message }));
    }
  }),

  /**
   * Get the user of a provided token, if valid
   */
  rest.get<any>('/api/session', (req, res, ctx) => {
    const currentUser = Users.findBy(
      'token',
      req.headers.get('authorization') || ''
    );
    if (!currentUser) {
      return res(
        ctx.status(401),
        ctx.json({
          message:
            'The token is either invalid or has expired. Please log in again.',
        })
      );
    }
    return res(ctx.status(200), ctx.json(currentUser));
  }),

  /**
   * A simple ping for checking online status
   */
  rest.get('/api/ping', (req, res, ctx) => {
    return res(ctx.status(200), ctx.body('OK'));
  }),
];
