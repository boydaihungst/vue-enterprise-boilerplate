import Vue from 'vue';
import VueI18n from 'vue-i18n';
import axios from 'axios';
import defaultMessage from '@src/lang/vi.json';

Vue.use(VueI18n);

// VueI18n instance
export const i18n = new VueI18n({
  locale: 'vi',
  fallbackLocale: 'vi',
  // @ts-ignore
  messages: defaultMessage,
});
const loadedLanguages = ['vi'];

function setI18nLanguage(lang) {
  i18n.locale = lang;
  axios.defaults.headers.common['Accept-Language'] = lang;
  document.querySelector('html').setAttribute('lang', lang);
  return lang;
}

export async function loadLanguageAsync(lang) {
  // If the same language
  if (i18n.locale === lang) {
    return Promise.resolve(setI18nLanguage(lang));
  }
  // If the language was already loaded
  if (loadedLanguages.includes(lang)) {
    return Promise.resolve(setI18nLanguage(lang));
  }

  // If the language hasn't been loaded yet
  // @ts-ignore
  const messages = await import(
    /* webpackChunkName: "lang-[request]" */ `@src/lang/${lang}.json`
  );
  i18n.setLocaleMessage(lang, messages.default);
  loadedLanguages.push(lang);
  return setI18nLanguage(lang);
}

const install = () => {
  if (module.hot) {
    loadedLanguages.forEach((lang) => {
      module.hot.accept(`./src/lang/${lang}.json`, async () => {
        // @ts-ignore
        const messages = await import(
          /* webpackChunkName: "lang-[request]" */ `@src/lang/${lang}.json`
        );
        i18n.setLocaleMessage(lang, messages.default);
      });
    });
  }
};
export { install };
