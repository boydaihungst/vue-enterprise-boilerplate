import { createStore, VuexStore, useStore as baseUseStore } from 'vuex';
// import SecureLS from 'secure-ls';
import createPersistedState from 'vuex-persistedstate';
import { InjectionKey } from 'vue';
import { RootState, RootActions, RootGetters, RootMutations } from '@state';
import modules from '@state/modules/module-loader';
import { InjectKey } from '@utils/const';
import { AUTH_MODULE_NAME } from './modules/auth';
import { USERS_MODULE_NAME } from './modules/users';

/**
 * Read this link first
 * {@link https://next.vuex.vuejs.org/guide/typescript-support.html#typing-store-property-in-vue-component}
 */

/**
 * Use this to encrypt vuex data when using vuex persisted state
 */
// const storageGuard = new SecureLS({ isCompression: false });

/**
 * Persist user's token, user's info
 * {@link https://github.com/robinvdvleuten/vuex-persistedstate#readme|vuex-persistedstate}
 */
export const vuexPersist = createPersistedState({
  /** Use custom storage */
  // storage: {
  //   getItem: (key) => window.localStorage.getItem(key),
  //   setItem: (key, value) => window.localStorage.setItem(key, value),
  //   removeItem: (key) => window.localStorage.removeItem(key),
  // },
  storage: window.localStorage,
  fetchBeforeUse: process.env.NODE_ENV === 'test',
  key: 'vuex-persist',
  /** Only cache modules auth, users */
  paths: [AUTH_MODULE_NAME, USERS_MODULE_NAME],
  filter: (mutation) => {
    // Only apply for these mutation
    return ['SET_CURRENT_USER', 'auth/SET_CURRENT_USER'].includes(
      mutation.type
    );
  },
});

export const vuexKey: InjectionKey<RootStore> = InjectKey.vuexKey;

/**
 * Store instance
 */
export const store: RootStore = createStore<RootState>({
  modules,
  devtools: process.env.NODE_ENV !== 'production',
  strict: true,
  plugins: [vuexPersist],
});

/**
 * Define your own `useStore` composition function with typed-safe instead of useStore from vuex
 * {@link https://next.vuex.vuejs.org/guide/typescript-support.html#simplifying-usestore-usage}
 */
export function useStore() {
  return baseUseStore(vuexKey) as RootStore;
}

export type RootStore = VuexStore<
  RootState,
  RootGetters,
  RootActions,
  RootMutations
>;
