<script lang="ts">
  import { defineComponent, toRefs, inject } from 'vue';
  import { InjectKey } from '@utils/const';

  export default defineComponent({
    name: 'Layout',
    inheritAttrs: false,
    props: {
      is: {
        type: String,
        required: true,
      },
    },
    setup(props, { slots }) {
      const { is } = toRefs(props);
      const changeLayout = inject(InjectKey.changeLayout);
      if (changeLayout) changeLayout(is.value);
      return () =>
        slots.default ? slots.default() : 'Please set default slot';
    },
  });
</script>
