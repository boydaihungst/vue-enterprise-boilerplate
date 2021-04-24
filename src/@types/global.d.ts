import { ComponentPublicInstance } from 'vue';
import { ModuleTree, VuexStoreOptions, VuexStore } from 'vuex';
import { MountingOptions, shallowMount } from '@vue/test-utils';
import { RootState } from '@state';
import { GlobalMountOptions } from '@vue/test-utils/dist/types';
import { Cypress } from 'local-cypress';

type MountType = typeof shallowMount;
declare global {
  let mount: MountType;
  let shallowMount: MountType;
  let shallowMountView: MountType;

  let createModuleStore: <
    S,
    G,
    A extends Record<string, (...args: any[]) => any>,
    M extends Record<string, (...args: any[]) => any>
  >(
    vuexModule: VuexStoreOptions<S, G, A, M>,
    options?: { currentUser?: any }
  ) => VuexStore<S, G, A, M>;
  let createComponentMocks: (
    mockData: Partial<Pick<GlobalMountOptions, 'mocks' | 'stubs'>> & {
      store?: ModuleTree<RootState>;
      router?: boolean;
      style?: { [key: string]: string };
    }
  ) => MountingOptions<ComponentPublicInstance>;

  interface Window {
    __app__: ComponentPublicInstance;
    Cypress: typeof Cypress;
  }
}
export {};
