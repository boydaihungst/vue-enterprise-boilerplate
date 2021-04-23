<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { NavRouteItem } from '@models/nav-route-item';

  export default defineComponent({
    props: {
      routes: {
        type: Array as PropType<NavRouteItem[]>,
        required: true,
      },
    },
    // Render functions are an alternative to templates
    methods: {
      getRouteTitle(route: NavRouteItem) {
        return typeof route.title === 'function' ? route.title() : route.title;
      },
    },
  });
</script>

<template>
  <BaseLink
    v-for="route in routes"
    :key="route.name"
    tag="li"
    :to="route.name"
    :exact-active-class="$style.active"
  >
    <a>{{ getRouteTitle(route) }}</a>
  </BaseLink>
</template>

<style lang="scss" module>
  @import '@design';

  .active a {
    font-weight: 600;
    color: $color-link-text-active;
    text-decoration: none;
    cursor: default;
  }
</style>
