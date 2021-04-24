import { User } from '@models/user';
import { State } from './state';

type Mutations<S = State> = {
  CACHE_USER(state: S, newUser: User | null): void;
};

export type LocalMutations = NotNameSpaced<Mutations>;

export const mutations: Mutations = {
  CACHE_USER(state, newUser) {
    if (newUser) state.cached.push(newUser);
  },
};
