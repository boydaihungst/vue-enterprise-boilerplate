---
to: src/state/modules/<%= h.changeCase.kebab(name).toLowerCase() %>/getter.ts
---
import { RootGetters, RootState } from '@state';
import { State } from './state';

type Getters = {
  loggedIn(
    state: State,
    getters?: LocalGetters,
    rootState?: RootState,
    rootGetters?: RootGetters
  ): boolean;
};

export const getters: Getters = {
  loggedIn: (state, getter, rootState, rootGetter) => {
    return true;
  },
};

export type LocalGetters = {
  [K in keyof Getters]: ReturnType<Getters[K]>;
};
