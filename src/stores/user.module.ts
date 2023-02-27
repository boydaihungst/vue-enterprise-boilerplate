import type { User } from '@models/user';
import axios from 'axios';
import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './auth.module';

export const userStoreId = 'user';
export const useUserStore = defineStore(userStoreId, () => {
  // Use auth store
  const { currentUser } = storeToRefs(useAuthStore());
  // Initial state value with type safe
  const cachedUserList = ref<User[]>([]);

  // Getters

  // Actions

  async function fetchUser(payload?: {
    username: string;
  }): Promise<User | null> {
    if (!payload) throw new Error('404');
    const { username } = payload;

    // 1. Check if we already have the user as a current user.
    if (currentUser.value && currentUser.value?.username === username) {
      return currentUser.value;
    }

    // 2. Check if we've already fetched and cached the user.
    const foundUserFromCached = cachedUserList.value.find(
      (user) => user.username === username,
    );

    if (foundUserFromCached) {
      return foundUserFromCached;
    }
    // 3. Fetch the user from the API and cache it in case
    //    we need it again in the future.
    const fetchUserByUsernameResponse = await axios.get(
      `/api/users/${username}`,
    );
    const foundUser = fetchUserByUsernameResponse.data;

    cachedUserList.value.push(foundUser);
    return foundUser;
  }

  return {
    //states
    cachedUserList,
    //getters
    //actions
    fetchUser,
  };
});
