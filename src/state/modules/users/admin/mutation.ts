import { State } from './state';

type Mutations<S = State> = {
  SET_AUTH_TOKEN(state: S, newAuthToken: string | null): void;
};

export const mutations: Mutations = {
  SET_AUTH_TOKEN() {
    //
  },
};

export type LocalMutations = NotNameSpaced<Mutations>;
