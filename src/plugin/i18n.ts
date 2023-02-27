import { useRootStore } from '@stores/root.module';
import axios from 'axios';
import { isRef, nextTick, unref, type Ref } from 'vue';
import {
  createI18n as originalCreateI18n,
  type Composer,
  type I18n,
  type I18nMode,
  type I18nOptions,
  type Locale,
  type VueI18n,
} from 'vue-i18n';

export type GlobalLocale = string | Ref<string>;
export const SUPPORT_LOCALES = ['vi', 'en'];
const defaultFallbackLocale: Locale =
  import.meta.env.VITE_I18N_FALLBACK_LOCALE || 'en';

const defaultLocale: Locale = import.meta.env.VITE_I18N_LOCALE || 'en';

/**
 * @param options - I18n Options
 * @returns I18n instance
 */
export async function createI18n(options?: I18nOptions) {
  // Restore opts from store
  const rootStore = useRootStore();
  const localeFromStore = rootStore.globalSettings.language;
  // options.locale -> invalid
  //    -> use locale from rootStore (saved from session/local storage) -> invalid
  //      -> use default locale -> invalid
  //        -> use fallback locale
  const locale =
    options?.locale && isLocaleSupported(options?.locale)
      ? options?.locale
      : localeFromStore && isLocaleSupported(localeFromStore)
      ? localeFromStore
      : defaultLocale;

  if (!import.meta.env.PROD) {
    if (!isLocaleSupported(locale)) {
      console.debug(`i18n: ${locale} locale is not supported.`);
    }

    if (!isLocaleSupported(defaultFallbackLocale)) {
      console.debug(
        `i18n: ${defaultFallbackLocale} default fallback locale is not supported.`,
      );
    }
  }

  const defaultOptions = {
    fallbackLocale: defaultFallbackLocale,
    legacy: false,
  };

  // Create i18 instance
  const i18n = originalCreateI18n({
    ...defaultOptions,
    ...options,
    ...{ locale },
  });

  await setI18nLanguage(i18n, locale);
  await preloadFallbackLocales(i18n);
  return i18n;
}

/**
 * Check locale whether locale  if supported
 * @param locale - locale in `string` or `locale` type
 * @returns `true` if the locale is supported
 */
export function isLocaleSupported(locale: Locale) {
  const isSupported = SUPPORT_LOCALES.includes(locale);

  if (!import.meta.env.PROD) {
    if (!isSupported) console.debug(`${locale} Locale not supported`);
  }
  return isSupported;
}

/**
 * Preload all fallback locales for i18n instance
 * @param i18n - `I18n` instance
 */
async function preloadFallbackLocales(i18n: I18n) {
  const globalFallbackLocale = i18n.global.fallbackLocale;

  // If fallback is object messages or no fallback -> no need to load file
  if (
    typeof globalFallbackLocale === 'object' ||
    globalFallbackLocale === false
  )
    return;
  let listFallbackLocale: string[] = [];

  if (Array.isArray(globalFallbackLocale)) {
    listFallbackLocale = listFallbackLocale.concat(globalFallbackLocale);
  } else {
    listFallbackLocale.push(globalFallbackLocale);
  }
  for (const locale of listFallbackLocale) {
    if (isLocaleSupported(locale)) {
      await loadLocaleMessages(i18n, locale);
    }
  }
}

/**
 * Use this function to change i18n global locale/language instead of directly set useI18n().locale = 'en'
 * @param i18n - `I18n` instance need to change language
 * @param locale - Locale in `string` or `Locale` type
 */
export async function setI18nLanguage(i18n: I18n, locale: Locale) {
  setLocale(i18n, locale);
  const newLocale = unref(locale);

  if (!isLocaleSupported(newLocale)) return;
  await loadLocaleMessages(i18n, newLocale);
  // Update dom and axios language header
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
  axios.defaults.headers.common['Accept-Language'] = locale;
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang
  const rootDom = document.querySelector('html');

  rootDom?.setAttribute('lang', locale);

  // Save locale to root store
  const rootStore = useRootStore();

  rootStore.changeLocale(locale);
}

/**
 * set global locale for i18n instance
 * @param i18n - `I18n` instance
 * @param locale - locale in `string` or `Locale` type
 */
export function setLocale(i18n: I18n, locale: Locale): void {
  // legacy = false
  if (isComposer(i18n.global, i18n.mode)) {
    i18n.global.locale.value = locale;
  } else {
    i18n.global.locale = locale;
  }
}

/**
 * get globalLocale of i18n instance
 * @param i18n - `I18n` instance
 */
export function getLocale(i18n: I18n): string {
  if (isComposer(i18n.global, i18n.mode)) {
    return i18n.global.locale.value;
  } else {
    return i18n.global.locale;
  }
}

/**
 * Check i18n instance is composition or option type
 * @param instance - `I18n` instance
 * @param mode - `composition` or legacy mode
 * @returns `true` if mode is `composition`
 */
function isComposer(
  instance: VueI18n | Composer,
  mode: I18nMode,
): instance is Composer {
  return mode === 'composition' && isRef(instance.locale);
}

/**
 * Lazy loading translated messages file `./src/lang/${locale}`
 * @param i18n - i18 instance
 * @param locale - Locale/language to load
 */
async function loadLocaleMessages(i18n: I18n, locale: Locale) {
  const messageResource = await import(`../lang/${locale}.json`);

  i18n.global.setLocaleMessage(
    locale,
    messageResource.default || messageResource,
  );
  return nextTick();
}
