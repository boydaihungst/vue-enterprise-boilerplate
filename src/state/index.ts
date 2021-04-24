// ==== Automation import: Import Type ==== //
import {
  AdminGetters,
  AdminMutations,
  AdminActions,
  ADMIN_MODULE_NAME,
} from './modules/users/admin';

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
// ==== Dont remove comment of this section ==== //

// ==== Automation import: Namespaced Type ==== //
//#region Admin
type AdminGettersNamespaced = Namespaced<
  AdminGetters,
  typeof ADMIN_MODULE_NAME
>;
type AdminMutationsNamespaced = Namespaced<
  AdminMutations,
  typeof ADMIN_MODULE_NAME
>;
type AdminActionsNamespaced = Namespaced<
  AdminActions,
  typeof ADMIN_MODULE_NAME
>;
//#endregion

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

// ==== Dont remove comment of this section ==== //

// ==== Automation import: Root Type ==== //
//#region Root Type
export type RootGetters = AdminGettersNamespaced &
  AuthGettersNamespaced &
  UsersGettersNamespaced &
  unknown;
export type RootMutations = AdminMutationsNamespaced &
  AuthMutationsNamespaced &
  UsersMutationsNamespaced &
  unknown;
export type RootActions = AdminActionsNamespaced &
  AuthActionsNamespaced &
  UsersActionsNamespaced &
  unknown;
export type RootState = {
  [AUTH_MODULE_NAME]: AuthStates;
} & {
  [USERS_MODULE_NAME]: UsersStates;
} & unknown;
//#endregion
// ==== Dont remove comment of this section ==== //
