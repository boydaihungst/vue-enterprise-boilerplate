<script lang="ts">
  import { defineComponent } from 'vue';
  import isUndefined from 'lodash/isUndefined';
  import omitBy from 'lodash/omitBy';
  export default defineComponent({
    name: 'BaseButton',
    props: {
      //#region HTML attributes for intellisense
      autofocus: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
      form: { type: String, default: undefined },
      formaction: {
        type: String,
        default: undefined,
      },
      formenctype: {
        type: String,
        default: undefined,
        validator: (val: string) => {
          return [
            'application/x-www-form-urlencoded',
            'multipart/form-data',
            'text/plain',
          ].includes(val);
        },
      },
      formmethod: {
        type: String,
        default: undefined,
        validator: (val: string) => {
          return ['GET', 'POST'].includes(val);
        },
      },
      formnovalidate: {
        type: Boolean,
        default: false,
      },
      formtarget: {
        type: String,
        default: undefined,
      },
      name: { type: String, default: '' },
      type: {
        type: String,
        default: 'button',
        validator: (val: string) => {
          return ['button', 'submit', 'reset', 'menu'].includes(val);
        },
      },
      value: { type: String, default: undefined },
      //#endregion
    },
    computed: {
      attrsToBinds(): Record<string, unknown> {
        return { ...this.$attrs, ...omitBy(this.$props, isUndefined) };
      },
    },
  });
</script>

<template>
  <button data-test="base-button" :class="$style.button" v-bind="attrsToBinds">
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
