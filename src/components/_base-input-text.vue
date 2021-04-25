<script lang="ts">
  import { defineComponent } from 'vue';
  import isUndefined from 'lodash/isUndefined';
  import omitBy from 'lodash/omitBy';
  export default defineComponent({
    props: {
      modelValue: {
        type: String,
        default: undefined,
      },
      type: {
        type: String,
        default: 'text',
        validator: (val: string) =>
          [
            'email',
            'number',
            'password',
            'search',
            'tel',
            'text',
            'url',
          ].includes(val),
      },
      //#region HTML Attributes
      alt: {
        type: String,
        default: undefined,
      },
      autocomplete: {
        type: String,
        default: undefined,
        validator: (val: string) =>
          [
            '',
            'on',
            'off',
            'additional-name',
            'address-level1',
            'address-level2',
            'address-level3',
            'address-level4',
            'address-line1',
            'address-line2',
            'address-line3',
            'bday',
            'bday-year',
            'bday-day',
            'bday-month',
            'billing',
            'cc-additional-name',
            'cc-csc',
            'cc-exp',
            'cc-exp-month',
            'cc-exp-year',
            'cc-family-name',
            'cc-given-name',
            'cc-name',
            'cc-number',
            'cc-type',
            'country',
            'country-name',
            'current-password',
            'email',
            'family-name',
            'fax',
            'given-name',
            'home',
            'honorific-prefix',
            'honorific-suffix',
            'impp',
            'language',
            'mobile',
            'name',
            'new-password',
            'nickname',
            'organization',
            'organization-title',
            'pager',
            'photo',
            'postal-code',
            'sex',
            'shipping',
            'street-address',
            'tel-area-code',
            'tel',
            'tel-country-code',
            'tel-extension',
            'tel-local',
            'tel-local-prefix',
            'tel-local-suffix',
            'tel-national',
            'transaction-amount',
            'transaction-currency',
            'url',
            'username',
            'work',
          ].includes(val),
      },
      autofocus: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      list: {
        type: String,
        default: undefined,
      },
      max: {
        type: Number,
        default: undefined,
      },
      maxlength: {
        type: Number,
        default: undefined,
      },
      min: {
        type: Number,
        default: undefined,
      },
      minlength: {
        type: Number,
        default: undefined,
      },
      name: {
        type: String,
        default: undefined,
      },
      placeholder: {
        type: String,
        default: undefined,
      },
      readonly: {
        type: Boolean,
        default: false,
      },
      required: {
        type: Boolean,
        default: false,
      },
      size: {
        type: Number,
        default: undefined,
      },
      step: {
        type: Number,
        default: undefined,
      },
      //#endregion
    },
    emits: ['update:modelValue'],
    computed: {
      attrsToBinds(): Record<string, unknown> {
        return { ...this.$attrs, ...omitBy(this.$props, isUndefined) };
      },
    },
  });
</script>

<template>
  <input
    :type="type"
    :class="$style.input"
    :value="modelValue"
    v-bind="attrsToBinds"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<style lang="scss" module>
  @import '@design';
  .input {
    @extend %typography-small;

    display: block;
    width: 100%;
    padding: $size-input-padding-vertical $size-input-padding-horizontal;
    margin-bottom: $size-grid-padding;
    line-height: 1;
    border: $size-input-border solid $color-input-border;
    border-radius: $size-input-border-radius;
  }
</style>
