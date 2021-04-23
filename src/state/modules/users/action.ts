import { AugmentedActionContext } from 'vuex';
import { User } from '@models/user';
import axios from 'axios';
import { State as LocalState } from './state';
import { LocalMutations } from './mutation';
import { LocalGetters } from './getter';

type Actions = {
  init(context: ActionContext, payload?: null): void;
  fetchUser(
    context: ActionContext,
    payload?: { username: string }
  ): Promise<User | null>;
};

export const actions: Actions = {
  /**
   *
   */
  async init() {
    //
  },

  /**
   *
   */
  async fetchUser({ state, commit, rootState }, payload) {
    if (!payload) return null;
    const { username } = payload;
    // 1. Check if we already have the user as a current user.
    const { currentUser } = rootState.auth;
    if (currentUser && currentUser.username === username) {
      return Promise.resolve(currentUser);
    }

    // 2. Check if we've already fetched and cached the user.
    const matchedUser = state.cached.find((user) => user.username === username);
    if (matchedUser) {
      return Promise.resolve(matchedUser);
    }

    // 3. Fetch the user from the API and cache it in case
    //    we need it again in the future.
    const response = await axios.get(`/api/users/${username}`);
    const user = response.data;
    commit('CACHE_USER', user);
    return user;
  },
};

export type LocalActions = NotNameSpaced<Actions>;
type ActionContext = AugmentedActionContext<
  LocalMutations,
  LocalActions,
  LocalGetters,
  LocalState
>;
