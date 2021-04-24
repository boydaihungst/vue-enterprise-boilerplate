import { actions } from './action';
import { getters } from './getter';
import { mutations } from './mutation';
import { state } from './state';

export const AUTH_MODULE_NAME = 'auth';

export default { state, getters, actions, mutations };
export type { NamespaceState as AuthStates } from './state';
export type { LocalGetters as AuthGetters } from './getter';
export type { LocalActions as AuthActions } from './action';
export type { LocalMutations as AuthMutations } from './mutation';
