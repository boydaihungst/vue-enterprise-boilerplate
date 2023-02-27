<script lang="ts" setup>
  import { useLayout } from '@composables/layout';
  import { useHead } from '@unhead/vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const { setLayout } = useLayout();

  setLayout('Default');
  defineProps({
    resource: {
      type: String,
      default: '',
    },
  });

  useHead({
    title: t('error.404.code'),
    meta: [{ name: 'description', content: t('error.404.code') }],
  });
</script>

<template>
  <h1 :class="$style.title">
    {{ t('error.404.code') }}
    <template v-if="resource">
      {{ resource }}
    </template>
    {{ t('error.404.message') }}
  </h1>
</template>

<style lang="scss" module>
  .title {
    text-align: center;
  }
</style>
