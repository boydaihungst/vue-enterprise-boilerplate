# To get typed-safe vuex

## Step 1: Create new module with command

> `yarn new module ModuleA`

## Step 2: go to state/index.ts and add type to #region RootType

```javascript
import {
  ModuleAGetters,
  ModuleAStates,
  ModuleAMutations,
  ModuleAActions,
  MODULE_A_MODULE_NAME,
} from './modules/ModuleA';

//#region ModuleA
type ModuleAGettersNamespaced = Namespaced<
  ModuleAGetters,
  typeof MODULE_A_MODULE_NAME
>;
type ModuleAMutationsNamespaced = Namespaced<
  ModuleAMutations,
  typeof MODULE_A_MODULE_NAME
>;
type ModuleAActionsNamespaced = Namespaced<
  ModuleAActions,
  typeof MODULE_A_MODULE_NAME
>;
//#endregion

//#region RootType
export type RootGetters = AuthGettersNamespaced &
  UsersGettersNamespaced &
  ModuleAGettersNamespaced;
export type RootMutations = AuthMutationsNamespaced &
  UsersMutationsNamespaced &
  ModuleAMutationsNamespaced;
export type RootActions = AuthActionsNamespaced &
  UsersActionsNamespaced &
  ModuleAActionsNamespaced;
export type RootState = {
  [AUTH_MODULE_NAME]: AuthStates,
  [USERS_MODULE_NAME]: UsersStates,
  [MODULE_A_MODULE_NAME]: ModuleAStates,
};
//#endregion
```
