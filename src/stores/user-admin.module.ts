import { defineStore } from 'pinia';
import { ref } from 'vue';

export const userAdminStoreId = 'userAdmin';
export const useUserAdmin = defineStore(userAdminStoreId, () => {
  //Initial state
  const isAdmin = ref<boolean>(false);

  //Getters
  // const isAdmin= computed(() => isAdmin);
  //Actions
  function changePermission() {
    return true;
  }
  return {
    //State
    isAdmin,
    //Getters

    //Actions
    changePermission,
  };
});
