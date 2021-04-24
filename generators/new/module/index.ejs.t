---
to: src/state/modules/<%= modulePath %>/index.ts
---
<% if(isNestedModule) { %>import { <%= parentModuleName %> } from '../index';<% } %>
import { actions } from './action';
import { getters } from './getter';
import { mutations } from './mutation';
import { state } from './state';
<% if(isNestedModule) { %>
export const <%= h.changeCase.snake(moduleName).toUpperCase() %>_MODULE_NAME = `${<%= parentModuleName %>}/<%= h.changeCase.camel(moduleName) %>` as `${typeof <%= parentModuleName %>}/<%= h.changeCase.camel(moduleName) %>`;
<% } else { %>
export const <%= h.changeCase.snake(moduleName).toUpperCase() %>_MODULE_NAME = '<%= h.changeCase.camel(moduleName) %>';
<% } %>
export default { state, getters, actions, mutations };

export type { NamespaceState as <%= h.changeCase.pascal(moduleName) %>States } from './state';
export type { LocalGetters as <%= h.changeCase.pascal(moduleName) %>Getters } from './getter';
export type { LocalActions as <%= h.changeCase.pascal(moduleName) %>Actions } from './action';
export type { LocalMutations as <%= h.changeCase.pascal(moduleName) %>Mutations } from './mutation';
