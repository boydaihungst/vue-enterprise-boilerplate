/* eslint-disable */
import { RootStore } from '@state/store';
import { DefineComponent } from 'vue';
declare global {
  module '*.vue' {
    const component: DefineComponent<{}, {}, any>;
    export default component;
  }
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $style: { [key: string]: string };
    $store: RootStore;
  }
}

// export {};
