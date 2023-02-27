import type { User } from '@models/user';
import { PersistStateKey } from '@src/constraint/const';
import axios, { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { computed, ref, toRef, unref, watch } from 'vue';
import { setDefaultAuthHeaders } from './utils';

export const AuthStoreId = 'auth';
// In Setup Stores:
// ref() become state properties
// computed() become getters
// function() become actions
export const useAuthStore = defineStore(AuthStoreId, () => {
  // Use other stores in here is OK
  // But you have to use storeToRefs to use destructuring:
  // const {xState, yGetter} = storeToRefs(otherStore)
  // This will also create refs for properties added by plugins
  // but skip any action or non reactive (non ref/reactive) property

  // If two or more stores use each other, they cannot create an infinite loop through getters or actions. They cannot both directly read each other state/getter in their defineStore function. (Only in action inside defineStore function)
  /** {@link https://pinia.vuejs.org/cookbook/composing-stores.html#composing-stores}   */

  // Initial state value with type safe
  const currentUser = ref<User | null>(null);

  // setup getters
  const loggedIn = computed(() => !!currentUser.value);

  // setup actions
  // This is automatically run in `plugin/store.plugin.ts` when the app
  // starts, along with any other actions named `init` in other modules.
  // Remember to return this action
  function init() {
    // Restoring user information and access token from localstorage
    const restoredCurrentUserAsString = localStorage.getItem(
      PersistStateKey.user,
    );

    try {
      if (restoredCurrentUserAsString) {
        currentUser.value = JSON.parse(restoredCurrentUserAsString);
        setDefaultAuthHeaders(currentUser.value?.token);
      }
    } catch (error: unknown) {
      localStorage.removeItem(PersistStateKey.user);
    }

    // Auto update authorization header after current user changed
    // then save current user information include access token to localStorage
    const authStore = useAuthStore();

    watch(
      toRef(authStore, 'currentUser'),
      (newUserInfo) => {
        try {
          localStorage.setItem(
            PersistStateKey.user,
            JSON.stringify(unref(newUserInfo)),
          );
          setDefaultAuthHeaders(newUserInfo?.token);
        } catch (error: unknown) {
          localStorage.removeItem(PersistStateKey.user);
          setDefaultAuthHeaders('');
        }
      },
      { deep: true, flush: 'pre' },
    );
  }

  /**
   * Validates the current user's token and refresh it with new data from the API
   */
  async function validate(): Promise<User | null | undefined> {
    if (!currentUser.value) return null;
    try {
      // Get user data from current browser session
      const getUserResponse = await axios.get('/api/session');

      // Save user data to current user state
      currentUser.value = getUserResponse.data;
      return currentUser.value;
    } catch (error: unknown) {
      // Handle Error if session not exist or refresh is expired
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.status === 401
      ) {
        // Remove current user state
        logOut();
        return null;
      }

      // TODO: Handle Unexpected error
      console.warn(error);
      return null;
    }
  }

  /** Logs out the current user */
  function logOut(): void {
    currentUser.value = null;
  }

  /**
   * Logs in the current user
   */
  async function logIn(payload?: { username: string; password: string }) {
    // Recheck incase already logged in
    if (loggedIn.value || !payload) {
      return await validate();
    }
    const { username, password } = payload;

    if (!password || !username) {
      throw new Error('Must input both username and password');
    }
    const getUserResponse = await axios.post('/api/session', {
      username,
      password,
    });

    currentUser.value = getUserResponse.data;
    return currentUser.value;
  }

  return {
    // States
    currentUser,
    // Getter
    loggedIn,
    // Actions
    init,
    validate,
    logOut,
    logIn,
  };
});
