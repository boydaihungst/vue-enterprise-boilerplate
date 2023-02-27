import { faker } from '@faker-js/faker';
import type { User } from '@models/user';
import { merge, omit } from 'lodash';

/**
 * Function to generate user
 */
function generateUser(userOptions: User = {}) {
  const id = userOptions.id || faker.datatype.uuid();
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const userName = userOptions.username || faker.internet.userName();
  const defaultUser: User = {
    id,
    name: faker.name.fullName({ firstName, lastName }),
    username: userName,
    token: `valid-token-for-${userName}`,
  };

  return merge(defaultUser, userOptions);
}

const user1: User = generateUser({
  username: 'user1',
  password: 'password123',
  name: 'User One',
});

const admin: User = generateUser({
  id: 'id-admin-uuid-v4',
  username: 'admin',
  name: 'admin',
  password: 'password123',
});
// Generate 5 random user
const randomUsers = [5].map(() => generateUser());

// Include all mocked users
const all: User[] = [...randomUsers, admin, user1];

export default {
  admin,
  all,
  authenticate({ username, password }: User) {
    return new Promise<User>((resolve, reject) => {
      const matchedUser = all.find(
        (user: User) =>
          user.username === username && user.password === password,
      );

      if (matchedUser) {
        resolve(matchedUser);
      } else {
        reject(new Error('Invalid user credentials.'));
      }
    });
  },

  /**
   * @param propertyName - property of User
   * @param value - value to match
   * @returns User or null
   */
  findBy<T extends keyof User>(propertyName: T, value: User[T]) {
    const matchedUser = all.find((user) => user[propertyName] === value);

    if (matchedUser) return matchedUser;
    return null;
  },
  findByWithHiddenProps<T extends keyof User>(propertyName: T, value: User[T]) {
    const matchedUser = all.find((user) => user[propertyName] === value);

    if (matchedUser) return matchedUser;
    return null;
  },
  /**
   * @param user - user to convert
   * @returns user without password
   */
  json(user: User) {
    return user && omit(user, ['password']);
  },
};
