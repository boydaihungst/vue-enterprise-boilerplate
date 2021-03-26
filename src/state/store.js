import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import dispatchActionForAllModules from '@utils/dispatch-action-for-all-modules';

import modules from './modules';

Vue.use(Vuex);
/**
 * Cache vuex data to localstorage
 */
const vuexPersist = new VuexPersistence({
  storage: window.localStorage,
  supportCircular: true,
  /** Only cache modules users */
  modules: ['users'],
});
const store = new Vuex.Store({
  modules,
  // Enable strict mode in development to get a warning
  // when mutating state outside of a mutation.
  // https://vuex.vuejs.org/guide/strict.html
  strict: process.env.NODE_ENV !== 'production',
  plugins: [vuexPersist.plugin],
});

export default store;

// Automatically run the `init` action for every module,
// if one exists.
dispatchActionForAllModules('init');
