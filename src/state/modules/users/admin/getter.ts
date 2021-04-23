import { RootGetters, RootState } from '@state';
import { State } from './state';

type Getters = {
  test(
    state: State,
    getters?: LocalGetters,
    rootState?: RootState,
    rootGetters?: RootGetters
  ): boolean;
};

export const getters: Getters = {
  test: () => {
    return true;
  },
};

export type LocalGetters = {
  [K in keyof Getters]: ReturnType<Getters[K]>;
};
