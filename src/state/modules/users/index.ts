import { actions } from './action';
import { getters } from './getter';
import { mutations } from './mutation';
import { state } from './state';

export const USERS_MODULE_NAME = 'users';

export default { state, getters, actions, mutations };

export type { State as UsersStates } from './state';
export type { LocalGetters as UsersGetters } from './getter';
export type { LocalActions as UsersActions } from './action';
export type { LocalMutations as UsersMutations } from './mutation';
