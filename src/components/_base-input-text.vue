<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      modelValue: {
        type: String,
        default: '',
      },
      type: {
        type: String,
        default: 'text',
        validator: (val: string) =>
          [
            'hidden',
            'text',
            'search',
            'tel',
            'url',
            'email',
            'password',
            'datetime',
            'date',
            'month',
            'week',
            'time',
            'datetime-local',
            'number',
            'range',
            'color',
            'file',
            'image',
          ].includes(val),
      },
      //#region HTML Attributes
      accept: {
        type: String,
        default: '',
      },
      alt: {
        type: String,
        default: '',
      },
      autocomplete: {
        type: String,
        default: '',
        validator: (val: string) =>
          [
            '',
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
      dirname: {
        type: String,
        default: '',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      form: {
        type: String,
        default: '',
      },
      height: {
        type: String,
        default: '',
      },
      list: {
        type: String,
        default: '',
      },
      max: {
        type: String,
        default: '',
      },
      maxlength: {
        type: String,
        default: '',
      },
      min: {
        type: String,
        default: '',
      },
      minlength: {
        type: String,
        default: '',
      },
      multiple: {
        type: Boolean,
        default: false,
      },
      name: {
        type: String,
        default: '',
      },
      placeholder: {
        type: String,
        default: '',
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
        type: String,
        default: '',
      },
      src: {
        type: String,
        default: '',
      },
      step: {
        type: String,
        default: '',
      },
      width: {
        type: String,
        default: '',
      },
      //#endregion
    },
    emits: ['update:modelValue'],
  });
</script>

<template>
  <input
    :type="type"
    :class="$style.input"
    :value="modelValue"
    v-bind="$attrs"
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
