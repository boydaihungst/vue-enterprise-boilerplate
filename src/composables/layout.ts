import { useRootStore } from '@stores/root.module';
import { storeToRefs } from 'pinia';

export function useLayout() {
  const rootStore = useRootStore();
  const { currentViewLayout } = storeToRefs(rootStore);
  const currentLayout = currentViewLayout;
  const setLayout = rootStore.changeViewLayout;
  // Do more stub about layout. ex: if width < 1000 return 'module-portrait'

  return { currentLayout, setLayout };
}
