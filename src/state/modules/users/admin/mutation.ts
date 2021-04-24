import { State } from './state';

type Mutations<S = State> = {
  SAMPLE_MUTATION(state: S, newAuthToken: string | null): void;
};

export const mutations: Mutations = {
  SAMPLE_MUTATION() {
    //
  },
};

export type LocalMutations = NotNameSpaced<Mutations>;
