import _ from 'lodash';
/** {@link https://github.com/marak/Faker.js/} */
import faker from 'faker';
import merge from 'lodash/merge';
import { User } from '@models/user';

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
    name: faker.name.findName(firstName, lastName),
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
      const matchedUser = this.all.find(
        (user) => user.username === username && user.password === password
      );
      if (matchedUser) {
        resolve(this.json(matchedUser));
      } else {
        reject(new Error('Invalid user credentials.'));
      }
    });
  },
  findBy<T extends keyof User>(propertyName: T, value: User[T]) {
    const matchedUser = this.all.find((user) => user[propertyName] === value);
    if (matchedUser) return this.json(matchedUser);
    return null;
  },
  findByWithHiddenProps<T extends keyof User>(propertyName: T, value: User[T]) {
    const matchedUser = this.all.find((user) => user[propertyName] === value);
    if (matchedUser) return this.json(matchedUser);
    return null;
  },
  json(user: User) {
    return user && _.omit(user, ['password']);
  },
};
