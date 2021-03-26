import { mapState, mapGetters, mapActions } from 'vuex';
import { User, AuthorizedToken } from '@graphql/jsDoc';

/**
 * @typedef {object} authComputed
 * @property {{(): boolean}} loggedIn
 */
/** @type {authComputed} */
export const authComputed = {
  ...mapState('auth', {}),
  ...mapGetters('auth', ['loggedIn']),
};

/**
 * @typedef {object} authMethods
 * @property {{(username: string, password: string, recaptcha: string): Promise<AuthorizedToken>}} logIn
 * @property {{(): Promise<void>}} logOut
 */
/** @type {authMethods} */
export const authMethods = mapActions('auth', ['logIn', 'logOut']);

/**
 * @typedef {object} userComputed
 * @property {{(): User}} currentUser
 */
/** @type {userComputed} */
export const userComputed = {
  ...mapState('users', {
    currentUser: (state) => state.currentUser,
  }),
  ...mapGetters('users', []),
};

/**
 * @typedef {object} userMethods
 * @property {{(username: string): Promise<User>}} fetchUser
 * @property {{(): Promise<User>}} fetchCurrentUser
 */
/** @type {userMethods} */
export const userMethods = mapActions('users', [
  'fetchUser',
  'fetchCurrentUser',
]);
