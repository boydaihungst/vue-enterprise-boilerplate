<template>
  <button data-test="base-button" :class="$style.button" v-bind="$attrs">
    <slot />
  </button>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name: 'BaseButton',
    props: {
      //#region HTML attributes for intellisense
      autofocus: { type: Boolean, required: false },
      disabled: { type: Boolean, required: false },
      form: { type: String, required: false, default: '' },
      formmethod: {
        type: String,
        required: false,
        default: 'GET',
        validator: (val: string) => {
          return ['GET', 'POST'].includes(val);
        },
      },
      name: { type: String, required: false, default: '' },
      type: {
        type: String,
        required: false,
        default: 'button',
        validator: (val: string) => {
          return ['button', 'submit', 'reset', 'menu'].includes(val);
        },
      },
      value: { type: String, required: false, default: '' },
      //#endregion
    },
  });
</script>

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
