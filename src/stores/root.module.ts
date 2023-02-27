import { defaultViewLayout as appConfigDefaultViewLayout } from '@src/app.config.json';
import { PersistStateKey } from '@src/constraint/const';
import type AppGlobalSetting from '@src/models/app-setting';
import { defineStore } from 'pinia';
import { computed, ref, toRef, unref, watch } from 'vue';
export const rootStoreId = 'root';
export const useRootStore = defineStore(rootStoreId, () => {
  const defaultViewLayout = ref(appConfigDefaultViewLayout);
  // Initial state value
  const globalSettings = ref<AppGlobalSetting>({
    currentViewLayout: defaultViewLayout.value,
  });

  //getters
  const currentViewLayout = computed(
    () => globalSettings.value.currentViewLayout,
  );

  //actions
  // This is automatically run in `plugin/init-store/plugin.ts` when the app
  // starts, along with any other actions named `init` in other modules.
  // Remember to return this function
  function init() {
    const rootStore = useRootStore();

    // Save global app settings to session storage
    watch(
      toRef(rootStore, 'globalSettings'),
      (newSettings) => {
        try {
          localStorage.setItem(
            PersistStateKey.globalAppSettings,
            JSON.stringify(unref(newSettings)),
          );
        } catch (error: unknown) {
          localStorage.removeItem(PersistStateKey.globalAppSettings);
        }
      },
      {
        deep: true,
        // immediate: true,
        // onTrigger: (event) => {},
      },
    );

    const restoredAppSettingsAsString = localStorage.getItem(
      PersistStateKey.globalAppSettings,
    );

    try {
      if (restoredAppSettingsAsString)
        globalSettings.value = JSON.parse(restoredAppSettingsAsString);
    } catch (error: unknown) {
      localStorage.removeItem(PersistStateKey.globalAppSettings);
    }
  }

  function changeViewLayout(newLayoutComponentName = defaultViewLayout.value) {
    if (
      unref(globalSettings.value.currentViewLayout) !== newLayoutComponentName
    ) {
      globalSettings.value.currentViewLayout = newLayoutComponentName;
    }
  }

  function changeLocale(newLocale: string) {
    globalSettings.value.language = newLocale;
  }
  return {
    globalSettings,
    currentViewLayout,
    init,
    changeViewLayout,
    changeLocale,
  };
});
