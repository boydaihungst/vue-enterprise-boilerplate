import { USERS_MODULE_NAME } from '../index';
import { actions } from './action';
import { getters } from './getter';
import { mutations } from './mutation';
import { state } from './state';

export const ADMIN_MODULE_NAME = `${USERS_MODULE_NAME}/admin` as `${typeof USERS_MODULE_NAME}/admin`;

export default { state, getters, actions, mutations };

export type { State as AdminStates } from './state';
export type { LocalGetters as AdminGetters } from './getter';
export type { LocalActions as AdminActions } from './action';
export type { LocalMutations as AdminMutations } from './mutation';
