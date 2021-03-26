---
to: src/state/modules/<%= h.changeCase.kebab(name) %>.js
---
import axios from 'axios';
import * as api from '@api';
import { GetterTree, MutationTree, ActionTree } from 'vuex';

export const state = {};

/**
 * @type {GetterTree<typeof state, any>}
 * @returns
 */
export const getters = {};

/**
 * @type {MutationTree<typeof state>}
 * @returns
 */
export const mutations = {};

/**
 * @type {ActionTree<typeof state, any>}
 * @returns
 */
export const actions = {
  init({ commit, state, rootState, dispatch, getters, rootGetters }, {}) {},
};
