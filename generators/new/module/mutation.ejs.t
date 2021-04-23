---
to: src/state/modules/<%= h.changeCase.kebab(name).toLowerCase() %>/mutation.ts
---
import { State } from './state';

type Mutations<S = State> = {
  SET_AUTH_TOKEN(state: S, newAuthToken: string | null): void;
};

export const mutations: Mutations = {
  SET_AUTH_TOKEN(state, newAuthToken) {
    //
  },
};

export type LocalMutations = NotNameSpaced<Mutations>;
