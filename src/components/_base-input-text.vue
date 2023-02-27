<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>

<script setup lang="ts">
  import { computed } from 'vue';

  /**
   * Manual Setup v-model with extra validator
   * {@link https://vuejs.org/guide/components/v-model.html}
   */
  const props = defineProps({
    modelValue: {
      type: String,
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
  });
  const emit = defineEmits<{
    (e: 'update:modelValue', value?: string): void;
  }>();
  // Manual v-model. Better than $event.target.value (not typesafe)
  // https://vuejs.org/guide/components/v-model.html
  const value = computed({
    get() {
      return props.modelValue;
    },
    set(value?: string) {
      emit('update:modelValue', value);
    },
  });
</script>

<template>
  <input :type="type" :class="$style.input" v-bind="$attrs" v-model="value" />
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
