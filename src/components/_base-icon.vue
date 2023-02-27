<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>

<script setup lang="ts">
  // icons source
  import {
    library as fontAwesomeIconLibrary,
    type IconDefinition,
    type IconPack,
  } from '@fortawesome/fontawesome-svg-core';
  import {
    FontAwesomeIcon,
    type FontAwesomeIconProps,
  } from '@fortawesome/vue-fontawesome';

  import { IconSource } from '@src/constraint/const';
  import camelCase from 'lodash/camelCase';
  import { computed, useAttrs, useCssModule, type PropType } from 'vue';

  // https://fontawesome.com/icons
  const styles = useCssModule();
  const attrs = useAttrs();
  const props = defineProps({
    source: {
      type: String as PropType<IconSource>,
      default: IconSource.AWESOME_FONT,
    },
    icon: {
      type: [Object, String] as PropType<IconDefinition | IconPack | string>,
      required: true,
    },
    size: {
      type: [String, Number] as PropType<FontAwesomeIconProps['size'] | number>,
      default: (rawProps: FontAwesomeIconProps['size'] | number) => {
        if (typeof rawProps === 'number') {
          return 16;
        }
        return 'sm';
      },
    },
  });
  const getSize: any = computed(() => {
    if (props.source === IconSource.AWESOME_FONT) {
      return typeof props.size === 'string' ? props.size : 'sm';
    }
    if (props.source === IconSource.MDI_FONT) {
      return (typeof props.size === 'number' ? props.size : 32) + 'px';
    }
    return 16;
  });

  const customIconClass = computed(() => {
    if (props.source !== IconSource.CUSTOM) return '';
    return styles[camelCase(`icon-custom-${props.icon}`)];
  });

  const awesomeIcon = computed(() => {
    if (typeof props.icon !== 'string') {
      fontAwesomeIconLibrary.add(props.icon);
      return props.icon;
    }
    return '';
  });
</script>

<template>
  <FontAwesomeIcon
    v-if="source === IconSource.AWESOME_FONT"
    v-bind="attrs"
    :icon="awesomeIcon"
    :size="getSize"
  />
  <svg
    v-else-if="source === IconSource.MDI_FONT && typeof icon === 'string'"
    :width="getSize"
    :height="getSize"
  >
    <path :d="icon" />
  </svg>
  <span v-else v-bind="attrs" :class="customIconClass" />
</template>

<!-- <style module lang="scss"> -->
<!--   // style -->
<!-- </style> -->
