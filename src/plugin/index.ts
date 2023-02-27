import { createI18n } from '@plugin/i18n';
import { createRouter } from '@router';
import { createHead } from '@unhead/vue';
import type { App } from 'vue';
import type { I18n } from 'vue-i18n';
import { createStore } from './store.plugin';

let i18nGlobal: I18n;

export async function registerGlobalPlugin(app: App) {
  const piniaStore = createStore();

  app.use(piniaStore);
  await piniaStore.isReady();
  // i18n plugin require rootStore, run after store initial
  i18nGlobal = await createI18n();
  app.use(i18nGlobal);
  // router require i18n instance, so run after i18n created
  const router = await createRouter();

  app.use(router);
  await router.isReady();
  // the rest. Be careful about the order
  // if plugin B import any from plugin A, then B need to be run after A used
  const head = createHead();

  app.use(head);
}

export { i18nGlobal };
