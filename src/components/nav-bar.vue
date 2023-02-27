<script setup lang="ts">
  import NavBarRoutes from '@components/nav-bar-routes.vue';
  import type { NavRouteItem } from '@models/nav-route-item';
  import { useAuthStore } from '@src/stores';
  import LanguageSwitcher from './language-switcher.vue';

  const authStore = useAuthStore();
  // Use reactive because you will 100% need to change text base on language. Plugin: i18n
  const persistentNavRoutes: NavRouteItem[] = [{ name: 'home', title: 'Home' }];
  // Navigation bar items when user logged in
  const loggedInNavRoutes: NavRouteItem[] = [
    {
      name: 'profile',
      title: () => 'Logged in as ' + authStore.currentUser?.name || '',
    },
    {
      name: 'logout',
      title: 'Log out',
    },
  ];
  // Navigation bar items when there are no logged in user
  const loggedOutNavRoutes: NavRouteItem[] = [
    {
      name: 'login',
      title: 'Log in',
    },
  ];
</script>

<template>
  <ul :class="$style.container">
    <NavBarRoutes :routes="persistentNavRoutes" />
    <NavBarRoutes v-if="authStore.loggedIn" :routes="loggedInNavRoutes" />
    <NavBarRoutes v-else :routes="loggedOutNavRoutes" />
    <li>
      <LanguageSwitcher></LanguageSwitcher>
    </li>
  </ul>
</template>

<style lang="scss" module>
  @import '@design';

  .container {
    padding: 0;
    margin: 0 0 $size-grid-padding;
    text-align: center;
    list-style-type: none;

    > li {
      display: inline-block;
      margin-right: $size-grid-padding;
    }
  }
</style>
