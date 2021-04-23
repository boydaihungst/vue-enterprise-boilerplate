<script lang="ts">
  import {
    defineComponent,
    onBeforeUnmount,
    onMounted,
    PropType,
    ref,
    toRefs,
  } from 'vue';

  export default defineComponent({
    props: {
      callback: {
        type: Function as PropType<() => void>,
        required: true,
      },
    },
    setup(props) {
      const { callback } = toRefs(props);
      const root = ref<HTMLElement>();
      const listener = (e) => {
        if (e.target === root.value || root.value?.contains(e.target)) {
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
      return { root };
    },
  });
</script>

<template>
  <slot ref="root"></slot>
</template>
