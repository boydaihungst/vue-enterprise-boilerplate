import {
  createPinia as originalCreateStore,
  type PiniaPluginContext,
} from 'pinia';

export const pendingActions: Promise<unknown>[] = [];

export function createStore() {
  const pinia = originalCreateStore();

  pinia.use(dispatchInitActionAllModules);
  pinia.isReady = () => Promise.all(pendingActions);
  return pinia;
}

export function dispatchInitActionAllModules({ store }: PiniaPluginContext) {
  if (store && store.init) {
    pendingActions.push(Promise.resolve(store.init()));
  }
}
