<script lang="ts" setup>
  import { useLayout } from '@composables/layout';
  import { useHead } from '@unhead/vue';
  import axios from 'axios';
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import LoadingView from './_loading.vue';

  const { setLayout } = useLayout();
  const { t } = useI18n();

  setLayout('Default');
  useHead({
    title: t('views.timeout.meta.title'),
    meta: [
      {
        name: 'description',
        content: t('views.timeout.meta.description'),
      },
    ],
  });
  const offlineConfirmed = ref(false);

  axios
    .head('/api/ping')
    .then(() => window.location.reload())
    .catch(() => {
      offlineConfirmed.value = true;
    });
</script>

<template>
  <h1 v-if="offlineConfirmed" :class="$style.title">
    {{ t('views.timeout.noInternetPrompt') }}
  </h1>
  <LoadingView v-else />
</template>

<style lang="scss" module>
  .title {
    text-align: center;
  }
</style>
