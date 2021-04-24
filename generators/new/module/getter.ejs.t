---
to: src/state/modules/<%= modulePath %>/getter.ts
---
import { RootGetters, RootState } from '@state';
import { State } from './state';

type Getters = {
  sampleGetter(
    state: State,
    getters?: LocalGetters,
    rootState?: RootState,
    rootGetters?: RootGetters
  ): boolean;
};

export const getters: Getters = {
  sampleGetter: () => {
    return true;
  },
};

export type LocalGetters = {
  [K in keyof Getters]: ReturnType<Getters[K]>;
};
