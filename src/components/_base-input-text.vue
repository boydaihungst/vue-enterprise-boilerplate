<script lang="ts">
  import { defineComponent } from 'vue';
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
    },
    emits: ['update:modelValue'],
    computed: {},
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
