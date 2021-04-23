import {
  AuthGetters,
  AuthStates,
  AuthMutations,
  AuthActions,
  AUTH_MODULE_NAME,
} from './modules/auth';

import {
  UsersGetters,
  UsersStates,
  UsersMutations,
  UsersActions,
  USERS_MODULE_NAME,
} from './modules/users';

//#region Auth
type AuthGettersNamespaced = Namespaced<AuthGetters, typeof AUTH_MODULE_NAME>;
type AuthMutationsNamespaced = Namespaced<
  AuthMutations,
  typeof AUTH_MODULE_NAME
>;
type AuthActionsNamespaced = Namespaced<AuthActions, typeof AUTH_MODULE_NAME>;
//#endregion

//#region User
type UsersGettersNamespaced = Namespaced<
  UsersGetters,
  typeof USERS_MODULE_NAME
>;
type UsersMutationsNamespaced = Namespaced<
  UsersMutations,
  typeof USERS_MODULE_NAME
>;
type UsersActionsNamespaced = Namespaced<
  UsersActions,
  typeof USERS_MODULE_NAME
>;
//#endregion

//#region RootType
export type RootGetters = AuthGettersNamespaced & UsersGettersNamespaced;
export type RootMutations = AuthMutationsNamespaced & UsersMutationsNamespaced;
export type RootActions = AuthActionsNamespaced & UsersActionsNamespaced;
export type RootState = {
  [AUTH_MODULE_NAME]: AuthStates;
  [USERS_MODULE_NAME]: UsersStates;
};
//#endregion
