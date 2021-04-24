<script lang="ts">
  import { defineComponent } from 'vue';
  import Layout from '@layouts/layout.vue';
  import { useMeta } from 'vue-meta';

  export default defineComponent({
    components: { Layout },
    setup() {
      useMeta({
        title: 'Loading page...',
        description: 'Loading page...',
      });
    },
  });
</script>

<template>
  <Layout is="main" data-test="view-layout">
    <Transition appear>
      <BaseIcon :class="$style.loadingIcon" name="sync" spin />
    </Transition>
  </Layout>
</template>

<style lang="scss" module>
  @import '@design';

  .loadingIcon {
    @extend %typography-xxlarge;

    display: block;
    margin: 0 auto;

    // stylelint-disable-next-line selector-class-pattern
    &:global(.v-enter-active) {
      transition: opacity 1s;
    }
    // stylelint-disable-next-line selector-class-pattern
    &:global(.v-enter) {
      opacity: 0;
    }
  }
</style>
