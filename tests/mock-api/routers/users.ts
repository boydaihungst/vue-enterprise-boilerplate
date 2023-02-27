import type { User } from '@src/models/user';
import Users from '@tests/mock-api/resources/users';
import { rest, type DefaultBodyType } from 'msw';

export default [
  rest.get<any, { username: string }, User | DefaultBodyType>(
    '/api/users/:username',
    async (req, res, ctx) => {
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

      const matchedUser = Users.findBy('username', req.params.username);

      if (!matchedUser) {
        return res(
          ctx.status(400),
          ctx.json({
            message: 'No user with this name was found.',
          }),
        );
      }

      return res(ctx.status(200), ctx.json(matchedUser));
    },
  ),
];
