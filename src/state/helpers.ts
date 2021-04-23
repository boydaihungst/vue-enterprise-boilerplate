/* eslint-disable @typescript-eslint/no-unused-vars */
import { mapState } from 'vuex';
import AuthModule, {
  AuthGetters,
  AuthStates,
  AUTH_MODULE_NAME,
} from './modules/auth';
import { vuexMapGetters, vuexMapActions } from './modules/utils';

/**
 * Follow this link
 * {@link https://next.vuex.vuejs.org/guide/state.html#the-mapstate-helper}
 */
export const authComputed = {
  // Type 1: use this type for best type-safe
  ...mapState(AUTH_MODULE_NAME, {
    currentUser(state: AuthStates, getters: AuthGetters) {
      // this.$props... -> `this` is Component Instance. Use like `this` in vue component.
      return state.currentUser;
    },
  }),

  /**
   * Type 2:  Dont use these types. no typesafe :>
   */

  // ...mapState<AuthStates>(AUTH_MODULE_NAME, {
  //   currentUser: (state: AuthStates, getters: AuthGetters) => state.currentUser,
  // }),

  /**
   * Type 3: Dont use these types. no typesafe :>
   * passing the string value 'currentUser' is same as `state => state.currentUser`
   */

  // ...mapState<{ currentUser: keyof Required<AuthStates> }>(AUTH_MODULE_NAME, {
  //  currentUser: 'currentUser',
  // }),

  /**
   * Type 4: Dont use these types. no typesafe :>
   * passing the string value 'currentUser' is same as `state => state.currentUser`
   */

  // ...mapState(AUTH_MODULE_NAME, ['currentUser']),

  // Don't use default mapGetters from vuex. use this one below for better type-safe
  ...vuexMapGetters(AuthModule.getters, AUTH_MODULE_NAME, ['loggedIn']),
};
// Don't use default mapActions from vuex. use this one below for better type-safe
export const authMethods = {
  ...vuexMapActions(AuthModule.actions, AUTH_MODULE_NAME, ['logIn', 'logOut']),
};
