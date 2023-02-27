<script setup lang="ts">
  import type { NavRouteItem } from '@models/nav-route-item';
  import type { PropType } from 'vue';

  defineProps({
    routes: {
      type: Array as PropType<NavRouteItem[]>,
      required: true,
    },
  });

  function getRouteTitle(route: NavRouteItem): string {
    return typeof route.title === 'function' ? route.title() : route.title;
  }
</script>

<template>
  <BaseLink
    v-for="route in routes"
    :key="route.name"
    v-slot="{ href, navigate, isExactActive }"
    :to="route"
  >
    <li :class="[isExactActive && $style.active]">
      <a :href="href" @click="navigate">{{ getRouteTitle(route) }}</a>
    </li>
  </BaseLink>
</template>

<style lang="scss" module>
  @import '@design';

  .active {
    a {
      font-weight: 600;
      color: $color-link-text-active;
      text-decoration: none;
      cursor: default;
    }
  }
</style>
