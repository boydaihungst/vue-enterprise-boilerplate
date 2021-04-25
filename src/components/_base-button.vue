<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name: 'BaseButton',
    props: {},
    computed: {},
  });
</script>

<template>
  <button data-test="base-button" :class="$style.button" v-bind="$attrs">
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
