import { User } from '@models/user';
import { setDefaultAuthHeaders } from '../utils';
import { State } from './state';

type Mutations<S = State> = {
  SET_CURRENT_USER(state: S, newAuthToken: User | null): void;
};

export const mutations: Mutations = {
  SET_CURRENT_USER(state, newValue) {
    state.currentUser = newValue;
    setDefaultAuthHeaders(state);
  },
};

export type LocalMutations = Mutations;
