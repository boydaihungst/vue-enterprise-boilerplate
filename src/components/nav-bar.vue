<script>
  import { userComputed, authComputed, userMethods } from '@state/helpers';
  import NavBarRoutes from './nav-bar-routes.vue';

  export default {
    components: { NavBarRoutes },
    data() {
      return {
        persistentNavRoutes: [
          {
            name: 'HOME',
            title: 'Home',
          },
        ],
        loggedInNavRoutes: [
          {
            name: 'PROFILE',
            title: () => 'Logged in as ' + this.currentUser?.fullName,
          },
          {
            name: 'LOGOUT',
            title: 'Log out',
          },
        ],
        loggedOutNavRoutes: [
          {
            name: 'LOGIN',
            title: 'Log in',
          },
        ],
      };
    },
    computed: {
      ...authComputed,
      ...userComputed,
    },
    methods: {
      ...userMethods,
    },
  };
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
