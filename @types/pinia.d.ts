/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
import 'pinia';

declare module 'pinia' {
  export declare interface Pinia {
    /**
     * Wati for all async plugins finish startup
     */
    isReady(): Promise<any>;
  }
  // Add new properties to stores
  // {@link https://pinia.vuejs.org/core-concepts/plugins.html#typing-new-store-properties}
  export interface PiniaCustomProperties<Id, S, G, A> {
    // by using a setter we can allow both strings and refs
    // set hello(value: string | Ref<string>);
    // get hello(): string;
    // you can define simpler values too
    // simpleNumber: number;

    /**
     * Function to run at app startup. Should only run once each root App
     */
    init?: (...args: unknown[]) => unknown | Promise<unknown>;
  }

  // add new states to store (to both, the store and store.$state)
  // {@link https://pinia.vuejs.org/core-concepts/plugins.html#adding-new-state}
  export interface PiniaCustomStateProperties<S> {
    // hello: string;
  }

  // add new options to defineStore('storeA', () {...}, {debounce: {actionName: 200}})
  // {@link https://pinia.vuejs.org/core-concepts/plugins.html#adding-new-options}
  export interface DefineStoreOptionsBase<S, Store> {
    // allow defining a number of ms for any of the actions
    // debounce?: Partial<Record<keyof StoreActions<Store>, number>>;
    // persistent?: Record<
    //   string,
    //   Partial<Record<keyof StoreActions<Store>, boolean>>
    // >;
  }
}
