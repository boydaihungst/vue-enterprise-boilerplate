import axios from 'axios';
import { GetterTree, MutationTree, ActionTree } from 'vuex';
import * as api from '@api';
import { ApolloError, isApolloError } from '@apollo/client/core';

/**@type {ZenObservable.Subscription} */
let userChangeSub = null;

export const state = {
  authToken: api.apolloHelpers.getToken(),
};

/**
 * @type {MutationTree<typeof state>}
 * @returns
 */
export const mutations = {
  SET_AUTH_TOKEN(state, newValue) {
    state.authToken = newValue;
    setDefaultAuthHeaders(state);
  },
};
/**
 * @type {GetterTree<typeof state, any>}
 * @returns
 */
export const getters = {
  // Whether the user is currently logged in.
  loggedIn(state) {
    return !!state.authToken;
  },
};

/**
 * @type {ActionTree<typeof state, any>}
 * @returns
 */
export const actions = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  async init({ state, dispatch }) {
    setDefaultAuthHeaders(state);
    const isAuthTokenStillValid = await dispatch('validate');
    // if (typeof isAuthTokenStillValid === 'boolean' && isAuthTokenStillValid)
    //   subscribeCurrentUserChange();
  },

  // Logs in the current user.
  async logIn(
    { commit, dispatch, getters },
    { username, password, recaptcha } = {
      username: null,
      password: null,
      recaptcha: null,
    }
  ) {
    if (getters.loggedIn) return dispatch('validate');
    const authorizedToken = await api.user.mutationAccountLogin({
      emailOrAccount: username,
      password,
      recaptcha,
    });

    if (authorizedToken) {
      await api.apolloHelpers.onLogin(authorizedToken);
      commit('SET_AUTH_TOKEN', api.apolloHelpers.getToken());
      await dispatch('users/fetchCurrentUser', {}, { root: true });
    }
    return authorizedToken;
  },

  // Logs out the current user.
  async logOut({ commit, dispatch }) {
    await api.apolloHelpers.onLogout();
    commit('SET_AUTH_TOKEN', null);
    await dispatch('users/setCurrentUser', {}, { root: true });
    if (!!userChangeSub && !userChangeSub.closed) userChangeSub.unsubscribe();
  },

  // Validates the current user's token and refreshes it
  // with new data from the API.
  /**
   *
   * @returns {Promise<boolean|ApolloError>}
   */
  async validate({ commit, state, dispatch }) {
    if (!state.authToken) return Promise.resolve(null);
    try {
      const isValidated = await api.user.queryAccessTokenValidation();
      await dispatch('users/fetchCurrentUser', {}, { root: true });
      subscribeCurrentUserChange();
      return isValidated;
    } catch (error) {
      //TODO: Check access token fail + refresh token fail + account not verified
      if (isApolloError(error)) {
        commit('SET_AUTH_TOKEN', null);
        await dispatch('users/setCurrentUser', {}, { root: true });
        return error;
      }
      return false;
    }
  },
};

// ===
// Private helpers
// ===

function subscribeCurrentUserChange() {
  if (!userChangeSub || userChangeSub.closed) {
    const observable = api.user.subscribeCurrentUserChanged();
    userChangeSub = observable.subscribe(
      (result) => {
        console.log(result.data.notifyUserUpdated);
      },
      (err) => console.log(`Finished with error: ${err}`),
      () => {
        console.log('Finished');
      }
    );
  }
}

/**
 *
 * @param {*} state
 */
function setDefaultAuthHeaders(state) {
  axios.defaults.headers.common.Authorization = state.authToken || '';
}
