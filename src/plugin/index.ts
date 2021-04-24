import { App, Plugin } from 'vue';
import { createMetaManager } from 'vue-meta';
import { store, vuexKey } from '@state/store';
import dispatchActionForAllModules from '@utils/dispatch-action-for-all-modules';
import { router } from '@router';
import { i18n } from './i18n';

const vueMetaManager = createMetaManager();

const plugins: (Plugin | [Plugin, ...any[]])[] = [
  /** Plugin without options */
  vueMetaManager,
  /** Plugin with options */
  [store, vuexKey],
  i18n,
  router,
];

export async function registerGlobalPlugin(app: App) {
  for (const plugin of plugins) {
    let _plugin: Plugin | null | undefined = null;
    let _pluginOpts: Record<string, any> = {};
    if (!Array.isArray(plugin)) {
      _plugin = plugin;
    } else {
      const [p, options] = plugin;
      _plugin = p;
      _pluginOpts = options || {};
    }

    app.use(_plugin, _pluginOpts);
  }

  await dispatchActionForAllModules('init');
}
