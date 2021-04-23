import axios from 'axios';
import isArray from 'lodash/isArray';
import { DispatchOptions, mapActions, mapGetters } from 'vuex';

import type { State } from './auth/state';
export function setDefaultAuthHeaders(state: State) {
  axios.defaults.headers.common.Authorization = state.currentUser
    ? state.currentUser.token
    : '';
}

export function vuexMapGetters<
  Getters extends Record<string, (...args: any[]) => any>,
  Key extends keyof Getters
>(
  getters: Getters,
  map: Record<string, Key>
): {
  [K in Key]: () => ReturnType<Getters[K]>;
};
export function vuexMapGetters<
  Getters extends Record<string, (...args: any[]) => any>,
  Key extends keyof Getters
>(
  getters: Getters,
  map: Key[]
): {
  [K in Key]: () => ReturnType<Getters[K]>;
};
export function vuexMapGetters<
  Getters extends Record<string, (...args: any[]) => any>,
  Key extends keyof Getters
>(
  getters: Getters,
  namespace: string,
  map: Record<string, Key>
): {
  [K in Key]: () => ReturnType<Getters[K]>;
};
export function vuexMapGetters<
  Getters extends Record<string, (...args: any[]) => any>,
  Key extends keyof Getters
>(
  getters: Getters,
  namespace: string,
  map: Key[]
): {
  [K in Key]: () => ReturnType<Getters[K]>;
};
export function vuexMapGetters<Getters, Key extends keyof Getters & string>(
  getters: Getters,
  namespace: string | Key[] | Record<string, Key>,
  map?: Record<string, string> | string[]
) {
  if (typeof namespace === 'string') {
    if (map) {
      if (isArray(map)) return mapGetters(namespace, map);
      if (!isArray(map)) return mapGetters(namespace, map);
    }
  } else if (namespace) {
    if (isArray(namespace)) return mapGetters(namespace);
    if (!isArray(namespace)) return mapGetters(namespace);
  }
  return mapGetters(map as any);
}

export function vuexMapActions<
  Actions extends Record<string, (...args: any[]) => any>,
  Key extends keyof Actions
>(
  actions: Actions,
  map: Record<string, Key>
): {
  [K in Key]: (
    payload?: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ) => ReturnType<Actions[K]>;
};
export function vuexMapActions<
  Actions extends Record<string, (...args: any[]) => any>,
  Key extends keyof Actions
>(
  actions: Actions,
  map: Key[]
): {
  [K in Key]: (
    payload?: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ) => ReturnType<Actions[K]>;
};
export function vuexMapActions<
  Actions extends Record<string, (...args: any[]) => any>,
  Key extends keyof Actions
>(
  actions: Actions,
  namespace: string,
  map: Record<string, Key>
): {
  [K in Key]: (
    payload?: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ) => ReturnType<Actions[K]>;
};
export function vuexMapActions<
  Actions extends Record<string, (...args: any[]) => any>,
  Key extends keyof Actions
>(
  actions: Actions,
  namespace: string,
  map: Key[]
): {
  [K in Key]: (
    payload?: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ) => ReturnType<Actions[K]>;
};
export function vuexMapActions<
  Actions extends Record<string, (...args: any[]) => any>,
  Key extends keyof Actions & string
>(
  actions: Actions,
  namespace: string | Key[] | Record<string, Key>,
  map?: Record<string, string> | string[]
) {
  if (typeof namespace === 'string') {
    if (map) {
      if (isArray(map)) return mapActions(namespace, map);
      if (!isArray(map)) return mapActions(namespace, map);
    }
  } else if (namespace) {
    if (isArray(namespace)) return mapActions(namespace);
    if (!isArray(namespace)) return mapActions(namespace);
  }
  return mapActions(map as any);
}
