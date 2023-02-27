<script lang="ts" setup>
  import { onBeforeUnmount, onMounted, ref, toRefs, type PropType } from 'vue';

  const props = defineProps({
    callback: {
      type: Function as PropType<() => void>,
      required: true,
    },
  });

  const { callback } = toRefs(props);

  // declare a ref to hold the element reference
  // the name must match template ref value
  const root = ref<HTMLElement | null>(null);
  const listener = (e: MouseEvent) => {
    if (
      e.target === root.value ||
      root.value?.contains(e.target as Node | null)
    ) {
      return;
    }
    callback.value();
  };

  onMounted(() => {
    document.addEventListener('click', listener);
  });
  onBeforeUnmount(() => {
    document.removeEventListener('click', listener);
  });
</script>

<template>
  <slot ref="root"></slot>
</template>
