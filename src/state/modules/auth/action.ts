import axios from 'axios';
import { AugmentedActionContext } from 'vuex';
import { setDefaultAuthHeaders } from '../utils';
import { State as LocalState } from './state';
import { LocalMutations } from './mutation';
import { LocalGetters } from './getter';

type Actions = {
  init(context: ActionContext, payload?: null): Promise<void>;
  logIn(
    context: ActionContext,
    payload?: { username?: string; password?: string }
  ): Promise<boolean | null>;
  logOut(
    context: ActionContext,
    payload?: { apolloClientId?: string }
  ): Promise<void>;
  validate(context: ActionContext, payload?: null): Promise<boolean | null>;
};

export const actions: Actions = {
  /**
   * This is automatically run in `src/state/store.ts` when the app
   * starts, along with any other actions named `init` in other modules/../action.ts
   */
  async init({ state, dispatch }) {
    setDefaultAuthHeaders(state);
    dispatch('validate');
  },

  /**
   * Logs in the current user.
   */
  async logIn({ dispatch, commit, getters }, payload) {
    if (getters.loggedIn) return dispatch('validate');
    if (!payload?.password || !payload?.username)
      throw new Error('Must input username and password');
    const { username, password } = payload;

    const response = await axios.post('/api/session', { username, password });
    const user = response.data;
    commit('SET_CURRENT_USER', user);
    return user;
  },

  /**
   * Logs out the current user.
   */
  async logOut({ commit }) {
    commit('SET_CURRENT_USER', null);
  },

  /**
   * Validates the current user's token and refreshes it
   * with new data from the API.
   */
  async validate({ state, commit }) {
    if (!state.currentUser) return Promise.resolve(null);
    try {
      const response = await axios.get('/api/session');
      const user = response.data;
      commit('SET_CURRENT_USER', user);
      return user;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        commit('SET_CURRENT_USER', null);
      } else {
        console.warn(error);
      }
      return null;
    }
  },
};

export type LocalActions = Actions;
type ActionContext = AugmentedActionContext<
  LocalMutations,
  LocalActions,
  LocalGetters,
  LocalState
>;
