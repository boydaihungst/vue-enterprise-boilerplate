import { useLayout } from '@composables/layout';
import { defaultViewLayout as appConfigDefaultViewLayout } from '@src/app.config.json';
import { rootStoreId, useRootStore } from '@stores';
import { setActivePinia } from 'pinia';

describe('@composables/layout', () => {
  beforeEach(async () => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    const store = await createModuleStore({
      initialState: {
        [rootStoreId]: {},
      },
      stubActions: false,
    });

    setActivePinia(store);
  });

  it('changes app layout', async () => {
    const newLayout = 'MobilePortrait';
    const { setLayout, currentLayout } = useLayout();
    const rootStore = useRootStore();

    // before changed: default
    expect(rootStore.currentViewLayout).toBe(appConfigDefaultViewLayout);

    setLayout(newLayout);
    // after changed
    expect(rootStore.changeViewLayout).toHaveBeenCalledTimes(1);
    expect(rootStore.currentViewLayout).toBe(newLayout);
    expect(currentLayout.value).toBe(newLayout);
  });
});
