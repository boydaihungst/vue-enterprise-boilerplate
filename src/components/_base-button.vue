<script lang="ts">
  // normal <script>, executed in module scope (only once)
  // runSideEffectOnce();

  // declare additional options
  export default {
    inheritAttrs: false,
  };
</script>

<script setup lang="ts">
  // import { useAttrs } from 'vue';

  // inside setup() scope...
  // default, returns classes for <style module>
  // const styles = useCssModule();

  // named, returns classes for <style module="classes">
  // useCssModule('classes')

  // const slots = useSlots();
  // const attrs = useAttrs();
</script>

<template>
  <button :class="$style.button" v-bind="$attrs">
    <slot />
  </button>
</template>

<style lang="scss" module>
  @import '@design';

  .button {
    @extend %typography-small;

    padding: $size-button-padding;
    color: $color-button-text;
    cursor: pointer;
    background: $color-button-bg;
    border: none;

    &:disabled {
      cursor: not-allowed;
      background: $color-button-disabled-bg;
    }
  }
</style>
