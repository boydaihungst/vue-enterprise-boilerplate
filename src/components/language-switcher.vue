<script setup lang="ts">
  import { i18nGlobal } from '@plugin';
  import { getLocale, SUPPORT_LOCALES } from '@plugin/i18n';
  import { computed } from 'vue';
  import type { Locale } from 'vue-i18n';
  import { useRouter } from 'vue-router';

  const { push, currentRoute } = useRouter();
  // vmodel
  const locale = computed({
    get() {
      return getLocale(i18nGlobal);
    },
    set(locale: Locale) {
      const oldLocale = getLocale(i18nGlobal);

      // No need to explicitly change language here. Because we have language guard in router.beforeEnter
      // await setI18nLanguage(i18nGlobal, locale);

      // replace so it will not add to history

      push(
        // if true -> prevent save new url to history
        {
          replace: false,
          // name: currentRoute.value.name,
          params: currentRoute.value.params,
          query: currentRoute.value.query,
          path: currentRoute.value.fullPath.replace(
            `${oldLocale}`,
            `${locale}`,
          ),
        },
      );
    },
  });

  function toCapital(str: string) {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }
</script>

<template>
  <BaseSelect v-model="locale">
    <option
      v-for="lang in SUPPORT_LOCALES"
      :key="lang"
      :value="lang"
      :class="$style.option"
      :label="toCapital(lang)"
    ></option>
  </BaseSelect>
</template>

<style lang="scss" module>
  @import '@design';
</style>
