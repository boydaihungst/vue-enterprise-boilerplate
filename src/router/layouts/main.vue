<script lang="ts">
  import { defineComponent } from 'vue';
  import NavBar from '@components/nav-bar.vue';

  export default defineComponent({
    components: {
      NavBar,
    },
    inheritAttrs: false,
  });
</script>

<template>
  <header>
    <slot name="header">
      <NavBar />
    </slot>
  </header>
  <main data-test="main-container" v-bind="$attrs" :class="$style.container">
    <slot />
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</template>

<style lang="scss" module>
  @import '@design';

  .container {
    min-width: $size-content-width-min;
    max-width: $size-content-width-max;
    margin: 0 auto;
  }
</style>
