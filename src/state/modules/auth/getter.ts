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
  loggedIn: (state) => {
    return !!state.currentUser;
  },
};

export type LocalGetters = {
  [K in keyof Getters]: ReturnType<Getters[K]>;
};
