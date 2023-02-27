<script lang="ts" setup>
  import { useLayout } from '@composables/layout';
  import { faSync } from '@fortawesome/free-solid-svg-icons';
  import { useHead } from '@unhead/vue';
  import { useI18n } from 'vue-i18n';

  const { setLayout } = useLayout();
  const { t } = useI18n();

  setLayout('Default');

  useHead({
    title: t('views.loading.meta.title'),
    meta: [
      { name: 'description', content: t('views.loading.meta.description') },
    ],
  });
</script>

<template>
  <Transition appear>
    <BaseIcon :class="$style.loadingIcon" :icon="faSync" spin />
  </Transition>
</template>

<style lang="scss" module>
  @import '@design';

  .loadingIcon {
    @extend %typography-xxlarge;

    display: block;
    margin: 0 auto;

    // stylelint-disable-next-line selector-class-pattern
    &:global(.v-enter-active) {
      transition: opacity 1s;
    }
    // stylelint-disable-next-line selector-class-pattern
    &:global(.v-enter) {
      opacity: 0;
    }
  }
</style>
