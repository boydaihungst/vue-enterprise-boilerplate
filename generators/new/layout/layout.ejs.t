---
to: "src/router/layouts/<%= h.changeCase.kebab(name) %>.vue"
---
<script lang="ts">
  import { defineAsyncComponent, defineComponent } from 'vue';

  export default defineComponent({
    components: {
      NavBar: defineAsyncComponent(() => import('@components/nav-bar.vue')),
    },
  });
</script>

<template>
  <header>
    <slot name="header">
      <NavBar />
    </slot>
  </header>
  <main v-bind="$attrs" :class="$style.container">
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
