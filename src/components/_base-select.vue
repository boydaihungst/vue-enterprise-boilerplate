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
  });
  const emit = defineEmits<{
    (e: 'update:modelValue', value?: unknown): void;
  }>();
  // Manual v-model. Better than $event.target.value (not typesafe)
  // https://vuejs.org/guide/components/v-model.html
  const value = computed({
    get() {
      return props.modelValue;
    },
    set(value?: unknown) {
      emit('update:modelValue', value);
    },
  });
</script>

<template>
  <select v-model="value" :class="$style.select" v-bind="$attrs">
    <slot></slot>
  </select>
</template>

<style lang="scss" module>
  @import '@design';

  .select {
    @extend %typography-small;

    display: block;
    width: 100%;
    padding: $size-select-padding-vertical $size-select-padding-horizontal;
    margin-bottom: $size-grid-padding;
    line-height: 1;
    border: $size-select-border solid $color-select-border;
    border-radius: $size-select-border-radius;

    > option:nth-child(even) {
      background-color: $color-select-option-bg-even;
    }
  }
</style>
