<script lang="ts">
  import { defineComponent } from 'vue';
  import { authComputed } from '@state/helpers';
  import { NavRouteItem } from '@models/nav-route-item';
  import NavBarRoutes from '@components/nav-bar-routes.vue';

  export default defineComponent({
    components: { NavBarRoutes },
    data() {
      return {
        persistentNavRoutes: [
          {
            name: 'home',
            title: 'Home',
          },
        ] as NavRouteItem[],
        loggedInNavRoutes: [
          {
            name: 'profile',
            title: () => 'Logged in as ' + this.currentUser.name,
          },
          {
            name: 'logout',
            title: 'Log out',
          },
        ] as NavRouteItem[],
        loggedOutNavRoutes: [
          {
            name: 'login',
            title: 'Log in',
          },
        ] as NavRouteItem[],
      };
    },
    computed: {
      ...authComputed,
    },
  });
</script>

<template>
  <ul :class="$style.container">
    <NavBarRoutes :routes="persistentNavRoutes" />
    <NavBarRoutes v-if="loggedIn" :routes="loggedInNavRoutes" />
    <NavBarRoutes v-else :routes="loggedOutNavRoutes" />
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
