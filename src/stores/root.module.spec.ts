import type AppGlobalSetting from '@models/app-setting';
import { createTestingPinia } from '@pinia/testing';
import { defaultViewLayout as appConfigDefaultViewLayout } from '@src/app.config.json';
import { PersistStateKey } from '@src/constraint/const';
import { flushPromises } from '@vue/test-utils';
import { setActivePinia, storeToRefs } from 'pinia';
import { unref } from 'vue';
import { useRootStore } from './root.module';

describe('@stores/root.module', () => {
  beforeEach(async () => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    const store = await createModuleStore({
      stubActions: false,
    });

    setActivePinia(store);
    window.localStorage.clear();
  });
  it('will correctly saves current app settings info to localstorage', async () => {
    const store = useRootStore();
    const { globalSettings } = storeToRefs(store);

    // initial value
    expect(globalSettings.value).toEqual({
      currentViewLayout: appConfigDefaultViewLayout,
    });

    const expectedGlobalSettings: AppGlobalSetting = {
      currentViewLayout: 'mobile-portrait',
      language: 'jp',
    };

    globalSettings.value = expectedGlobalSettings;
    await flushPromises();
    expect(
      window.localStorage.getItem(PersistStateKey.globalAppSettings),
    ).not.toBeNull();
  });

  it('will correctly restores app settings from localstorage', async () => {
    // clean store without run init
    const piniaStore = createTestingPinia({
      stubActions: false,
    });

    setActivePinia(piniaStore);
    window.localStorage.clear();

    const expectedGlobalSettings: AppGlobalSetting = {
      currentViewLayout: 'mobile-portrait',
      language: 'jp',
    };
    const store = useRootStore();
    const { globalSettings } = storeToRefs(store);

    // prepare data in localstorage
    window.localStorage.setItem(
      PersistStateKey.globalAppSettings,
      JSON.stringify(unref(expectedGlobalSettings)),
    );
    // trigger init function
    store.init();
    expect(globalSettings.value).toEqual(expectedGlobalSettings);
  });

  it('getter.currentViewLayout will return current selected view layout', async () => {
    const expectedGlobalSettings: AppGlobalSetting = {
      currentViewLayout: 'mobile-lanscape',
      language: 'jp',
    };
    const store = useRootStore();

    const { currentViewLayout, globalSettings } = storeToRefs(store);

    globalSettings.value = expectedGlobalSettings;
    expect(currentViewLayout.value).toEqual(
      expectedGlobalSettings.currentViewLayout,
    );
  });

  it('action.changeViewLayout will correctly changes view layout', async () => {
    const expectedGlobalSettings: AppGlobalSetting = {
      currentViewLayout: 'mobile-portrait',
      language: 'jp',
    };
    const store = useRootStore();
    const { currentViewLayout } = storeToRefs(store);

    store.changeViewLayout(expectedGlobalSettings.currentViewLayout);
    expect(currentViewLayout.value).toEqual(
      expectedGlobalSettings.currentViewLayout,
    );
  });
  it('action.changeLocale will correctly changes locale', async () => {
    const expectedLocale = 'jp';
    const store = useRootStore();
    const { globalSettings } = storeToRefs(store);

    store.changeLocale(expectedLocale);
    expect(globalSettings.value.language).toEqual(expectedLocale);
  });
});
