---
to: src/state/modules/<%= h.changeCase.kebab(name).toLowerCase().toLowerCase() %>/index.ts
---
import { actions } from './action';
import { getters } from './getter';
import { mutations } from './mutation';
import { state } from './state';
// import { PARENT_MODULE_NAME } from '../index';

// export const NESTED_MODULE_NAME = `${PARENT_MODULE_NAME}/nested` as `${typeof PARENT_MODULE_NAME}/nested`;

export const <%= h.changeCase.snake(name).toUpperCase() %>_MODULE_NAME = '<%= h.changeCase.camel(name) %>';

export default { state, getters, actions, mutations };

export type { State as <%= h.changeCase.pascal(name) %>States } from './state';
export type { LocalGetters as <%= h.changeCase.pascal(name) %>Getters } from './getter';
export type { LocalActions as <%= h.changeCase.pascal(name) %>Actions } from './action';
export type { LocalMutations as <%= h.changeCase.pascal(name) %>Mutations } from './mutation';
