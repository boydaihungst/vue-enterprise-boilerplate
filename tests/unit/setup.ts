// import fs from 'node:fs';
// import path from 'node:path';
import { createTestingPinia, type TestingPinia } from '@pinia/testing';
import axios from 'axios';
import vueSnapshotSerializer from 'jest-serializer-vue';
import _ from 'lodash';

expect.addSnapshotSerializer(vueSnapshotSerializer as any);
// https://vue-test-utils.vuejs.org/
import {
  config,
  mount as baseMount,
  shallowMount as baseShallowMount,
  type MountingOptions,
} from '@vue/test-utils';
// https://lodash.com/
import { getGlobalComponents } from '@components/_globals';
import { getGlobalDirectiveAll } from '@src/directives/_globals';
import {
  defineAsyncComponent,
  type Component,
  type ComponentPublicInstance,
  type Directive,
} from 'vue';
// import { InjectKey } from '@src/constraint/const';
import { createI18n } from '@plugin/i18n';
import {
  dispatchInitActionAllModules,
  pendingActions,
} from '@plugin/store.plugin';
import { AuthStoreId } from '@stores';
// import * as axiosAdapter from "axios/lib/adapters/xhr";
// ===
// Utility functions
// ===

// ===
// Configure Axios
// ===

// Force Axios to use the XHR adapter so that it behaves
// more like it would in a browser environment.
// axios.defaults.adapter = require('axios/lib/adapters/xhr');

// ===
// Mock window properties not handled by jsdom
// ===
const storage = {
  value: (function () {
    let store: Record<string, unknown> = {};

    return {
      length: Object.keys(store).length,
      onStoreChange: function () {
        this.length = Object.keys(store).length;
      },
      getItem: function (key: string) {
        return store[key] || null;
      },
      setItem: function (key: string, value: any) {
        this.onStoreChange();
        store[key] = value.toString();
      },
      clear: function () {
        this.onStoreChange();
        store = {};
      },
      removeItem: function (key: string) {
        this.onStoreChange();
        delete store[key];
      },
    };
  })(),
};

// mock window.location. Because by default jsdom doesn't implement these function
const location = {
  reload: vi.fn(),
  assign: vi.fn(),
  replace: vi.fn(),
};

Object.defineProperty(window, 'location', {
  value: {
    ...window.location,
    ...location,
  },
  writable: true,
});

Object.defineProperty(window, 'localStorage', storage);
Object.defineProperty(window, 'sessionStorage', storage);

// ===
// Register global components,directive, provide, mocks.
// ===
//
config.global.components = {};
config.global.directives = {};

const globalComponents = function () {
  const litsGlobalComponents = getGlobalComponents();
  const globalFiles: Record<string, Component> = {};

  litsGlobalComponents.forEach(({ name, asyncLoader }) => {
    globalFiles[name] = defineAsyncComponent(asyncLoader);
  });
  return globalFiles;
};

const globalDirectives = function () {
  const litsGlobalDirectives = getGlobalDirectiveAll();
  const globalFiles: Record<string, Directive> = {};

  litsGlobalDirectives.forEach(({ name, directive }) => {
    globalFiles[name] = directive;
  });
  return globalFiles;
};

config.global.components = {
  ...config.global.components,
  ...globalComponents(),
};
config.global.directives = {
  ...config.global.directives,
  ...globalDirectives(),
};
// Mock css module $style
config.global.mocks = {
  $style: new Proxy(
    {},
    {
      get(_, name) {
        if (name !== '_isMockFunction') {
          return name;
        }
      },
    },
  ),
};

// mock global provide key
config.global.provide = {
  // [InjectKey.exampleFuncKey as symbol]: (data: unknown) => {
  //   do something with data
  //
  // },
};

// ===
// Console handlers
// ===

// Make console.error throw, so that vitest tests fail
const error = console.error;

console.error = function (message: string | Error, ...args: any[]) {
  error.apply(console, args);

  // NOTE: You can whitelist some `console.error` messages here
  //       by returning if the `message` value is acceptable.
  console.debug(message);
  throw message instanceof Error ? message : new Error(message);
};

// Make console.warn throw, so that Jest tests fail
const warn = console.warn;

console.warn = function (message: string | Error, ...args: any[]) {
  warn.apply(console, args);

  // NOTE: You can whitelist some `console.warn` messages here
  //       by returning if the `message` value is acceptable.
  console.debug(message);
  throw message instanceof Error ? message : new Error(message);
};

mount = baseMount;
shallowMount = baseShallowMount;
// A special version of `shallowMount` for view components
// Useful when your view component has some thing need to stubs like Layout component wrap around the viewComponent -> local layout per view component

shallowMountView = (viewComponent: any, options: any) => {
  return baseShallowMount(
    viewComponent,
    _.merge(options, {
      global: {
        stubs: {
          // because we use dynamic <component :is="layout_name"> in App.vue, we don't need to use these code any more. -> global layout for  all view component. Testing it in app.vue component
          // Use to stubs
          // Layout: defineComponent({
          //   setup(props, { slots }) {
          //     return () =>
          //       typeof slots.default === 'function'
          //         ? h('Layout', slots.default(props))
          //         : h('Layout');
          //   },
          // }),
        },
      },
    }),
  );
};
// add custom properties to options in /@types/global.d.ts
createModuleStore = async (options = {}) => {
  const _options = _.cloneDeep(options);
  const store: TestingPinia = createTestingPinia(
    _.merge(_options, {
      initialState: {
        [AuthStoreId]: {
          currentUser: options.currentUser,
        },
      },
      plugins: [
        dispatchInitActionAllModules,
        /** add global plugin in here*/
      ],
    }),
  );

  axios.defaults.headers.common.Authorization = _options?.currentUser
    ? _options.currentUser.token
    : '';
  // wait for plugins dispatchInitActionAllModules to be finished
  store.isReady = () => Promise.all(pendingActions);
  await store.isReady();
  return store;
};

// A helper for creating Vue component mocks
createComponentMocks = async ({ i18n, store, router, style, mocks, stubs }) => {
  const mockComponentOpts: MountingOptions<ComponentPublicInstance> = {
    global: {
      stubs: stubs || {},
      mocks: mocks || {},
      plugins: [],
    },
  };

  if (store && mockComponentOpts.global) {
    const piniaStore = await createModuleStore(store);

    mockComponentOpts.global.plugins?.push(piniaStore);
  }

  if (i18n && mockComponentOpts.global) {
    const i18nPlugin = await createI18n({
      ...(typeof i18n === 'object' ? i18n : {}),
    });

    mockComponentOpts.global.plugins?.push(i18nPlugin);
  }
  if (router && mockComponentOpts.global) {
    // If using `router: true`, we'll automatically stub out
    // components from Vue Router.
    mockComponentOpts.global.stubs = {
      ...mockComponentOpts.global.stubs,
      ...{ 'router-link': true, 'router-view': true },
    };
  }

  // If a `style` object is provided, mock some styles. Mock specific $style object.
  if (style && mockComponentOpts.global?.mocks) {
    // mock option $style component
    mockComponentOpts.global.mocks.$style = new Proxy(
      {},
      {
        get(_, name) {
          if (name !== '_isMockFunction') {
            const matchedStyle = Object.entries(style).find(([key]) => {
              if (key === name) {
                return true;
              }
              return false;
            });

            // if $style[name] in component matched with your mocked style[name]
            // then return your mocked value: style[name].value
            // Example: Your mocked value: { style: { container: 'mocked-value' } }
            // in component: this.$style.container -> return string `mocked-value`
            if (matchedStyle) return matchedStyle[1];
            // otherwise return name
            // Example: this.$style.container -> return string `container`
            return name;
          }
        },
      },
    );
  }

  return mockComponentOpts;
};
