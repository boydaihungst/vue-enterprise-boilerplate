import axios from 'axios';
import * as api from '@api';
import { User } from '@graphql/jsDoc';
import { GetterTree, MutationTree, ActionTree } from 'vuex';

export const state = {
  // cached: [],
  /**
   * @type {User}
   */
  currentUser: null,
};

/**
 * @type {GetterTree<typeof state, any>}
 * @returns
 */
export const getters = {};

/**
 * @type {MutationTree<typeof state>}
 * @returns
 */
export const mutations = {
  SET_CURRENT_USER(state, newUser) {
    state.currentUser = newUser;
  },
};

/**
 * @type {ActionTree<typeof state, any>}
 * @returns
 */
export const actions = {
  /**
   *
   * @returns
   */
  async setCurrentUser(
    { commit, state, rootState, dispatch, getters, rootGetters },
    { currentUser }
  ) {
    commit('SET_CURRENT_USER', currentUser);
    return currentUser;
  },

  /**
   *
   * @returns
   */
  async fetchCurrentUser(
    { commit, state, rootState, dispatch, getters, rootGetters },
    {}
  ) {
    const currentUser = await api.user.queryCurrentUserInfo();
    commit('SET_CURRENT_USER', currentUser);
    return currentUser;
  },

  /**
   *
   * @returns
   */
  async fetchUser(
    { commit, state, rootState, dispatch, getters, rootGetters },
    { username }
  ) {
    const { currentUser } = state;
    if (currentUser && currentUser.account === username) {
      return Promise.resolve(currentUser);
    }
    return api.user.queryUserInfo();
  },
};
