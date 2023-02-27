<script lang="ts" setup>
  import { useLayout } from '@composables/layout';
  import { useHead } from '@unhead/vue';
  import { useI18n } from 'vue-i18n';

  const { setLayout } = useLayout();

  setLayout('Default');
  const { t } = useI18n();

  useHead({
    // Can be static or computed
    title: 'Home',
    meta: [
      {
        name: 'description',
        content: t('app.description'),
      },
    ],
  });
</script>

<template>
  <div :class="$style.home">
    <img
      src="@assets/images/logo.svg"
      :alt="t('views.home.logoAtl')"
      :class="$style.logo"
    />
    <h3>{{ t('views.home.header') }}</h3>
  </div>
</template>

<style lang="scss" module>
  @import '@design';

  .home {
    display: flex;
  }

  .logo {
    width: 5rem;
    height: 5rem;
    padding: 5px;
  }
</style>
