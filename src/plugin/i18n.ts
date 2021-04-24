import { nextTick } from 'vue';
import { createI18n, I18nOptions } from 'vue-i18n';
import axios from 'axios';
export const SUPPORT_LOCALES = ['vi', 'en'];
export const defaultFallbackLocalle =
  process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en';

export const defaultLocalle = process.env.VUE_APP_I18N_LOCALE || 'en';

export function setupI18n(
  options: I18nOptions = {
    locale: defaultLocalle,
    fallbackLocale: defaultFallbackLocalle,
    legacy: false,
  }
) {
  const i18n = createI18n(options);
  setI18nLanguage(i18n, options.locale);
  return i18n;
}

export function setI18nLanguage(i18n: any, locale: any) {
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale;
  } else {
    i18n.global.locale.value = locale;
  }
  axios.defaults.headers.common['Accept-Language'] = locale;
  const rootDom = document.querySelector('html');
  if (rootDom?.getAttribute('lang') !== locale)
    rootDom?.setAttribute('lang', locale);
  return locale;
}

export async function loadLocaleMessages(i18n: any, locale: any) {
  const messages = await import(
    /* webpackInclude: /\.json$/ */
    /* webpackChunkName: "locale-[request]-[index]" */
    /* webpackMode: "lazy" */
    /* webpackPrefetch: true */
    /* webpackPreload: true */
    `@src/lang/${locale}.json`
  );
  i18n.global.setLocaleMessage(locale, messages.default);
  await nextTick();
  return setI18nLanguage(i18n, locale);
}

export const i18n = setupI18n();
