import fs from 'fs';
import path from 'path';
import { createStore } from 'vuex';
import axios from 'axios';
import _ from 'lodash';
import { vuexPersist } from '@state/store';

// https://vue-test-utils.vuejs.org/
import {
  shallowMount as baseShallowMount,
  mount as baseMount,
  config,
  MountingOptions,
} from '@vue/test-utils';
// https://lodash.com/
import { ComponentPublicInstance, defineComponent, h } from 'vue';
import { vuexKey } from '@state/store';
import { InjectKey } from '@utils/const';

// ===
// Utility functions
// ===

const pascalCase = _.flow(_.camelCase, _.upperFirst);

// ===
// Configure Axios
// ===

// Force Axios to use the XHR adapter so that it behaves
// more like it would in a browser environment.
axios.defaults.adapter = require('axios/lib/adapters/xhr');

// ===
// Mock window properties not handled by jsdom
// ===

Object.defineProperty(window, 'localStorage', {
  value: (function () {
    let store = {};
    return {
      length: Object.keys(store).length,
      onStoreChange: function () {
        this.length = Object.keys(store).length;
      },
      getItem: function (key) {
        return store[key] || null;
      },
      setItem: function (key, value) {
        this.onStoreChange();
        store[key] = value.toString();
      },
      clear: function () {
        this.onStoreChange();
        store = {};
      },
      removeItem: function (key) {
        this.onStoreChange();
        delete store[key];
      },
    };
  })(),
});

// ===
// Register global components,plugins,directive
// ===
//
config.global.components = {};
config.global.directives = {};

function loadFileBySource(
  sourcePath: string,
  RegexFileName: RegExp,
  nameTransformer?: (arg?: string) => string
) {
  const globalFileFiles = fs
    .readdirSync(path.join(__dirname, sourcePath))
    .filter((fileName) => RegexFileName.test(fileName));
  const globalFiles = {};
  for (const fileName of globalFileFiles) {
    const componentName =
      typeof nameTransformer === 'function'
        ? nameTransformer(fileName)
        : fileName;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const FileConfig = require(sourcePath + '/' + fileName);
    globalFiles[componentName] = FileConfig.default || FileConfig;
  }
  return globalFiles;
}

config.global.components = {
  ...config.global.components,
  ...loadFileBySource('../../src/components', /^_base-.+\.vue$/, pascalCase),
  ...loadFileBySource(
    '../../src/router/layouts',
    /^(?!.*(?:layout.vue$)).*\.vue$/,
    pascalCase
  ),
};
config.global.directives = {
  ...config.global.directives,
  ...loadFileBySource(
    '../../src/directives',
    /^(?!.*(?:_globals.ts$)).*\.ts$/,
    _.kebabCase
  ),
};
config.global.mocks = {
  $style: new Proxy(
    {},
    {
      get(_, name) {
        if (name !== '_isMockFunction') {
          return name;
        }
      },
    }
  ),
};
config.global.provide = {
  [InjectKey.changeLayout as symbol]: () => {
    //
  },
};

// ===
// Console handlers
// ===

// Make console.error throw, so that Jest tests fail
const error = console.error;
console.error = function (message: string | Error, ...args: any[]) {
  error.apply(console, args);

  // NOTE: You can whitelist some `console.error` messages here
  //       by returning if the `message` value is acceptable.
  throw message instanceof Error ? message : new Error(message);
};

// Make console.warn throw, so that Jest tests fail
const warn = console.warn;
console.warn = function (message: string | Error, ...args: any[]) {
  warn.apply(console, args);

  // NOTE: You can whitelist some `console.warn` messages here
  //       by returning if the `message` value is acceptable.
  throw message instanceof Error ? message : new Error(message);
};

mount = baseMount;
shallowMount = baseShallowMount;
// A special version of `shallowMount` for view components
shallowMountView = (viewComponent, options) => {
  return baseShallowMount(
    viewComponent,
    _.merge(options, {
      global: {
        stubs: {
          Layout: defineComponent({
            setup(props, { slots }) {
              return () =>
                typeof slots.default === 'function'
                  ? h('Layout', slots.default(props))
                  : h('Layout');
            },
          }),
        },
      },
    })
  );
};

// A helper for creating Vue component mocks
createComponentMocks = ({ store, router, style, mocks, stubs }) => {
  // Use a local version of Vue, to avoid polluting the global
  // Vue and thereby affecting other tests.
  // https://vue-test-utils.vuejs.org/api/#createlocalvue
  const returnOptions: MountingOptions<ComponentPublicInstance> = {
    global: {
      stubs: stubs || {},
      mocks: mocks || {},
      plugins: [],
    },
  };
  // Converts a `store` option shaped like:
  //
  // store: {
  //   someModuleName: {
  //     state: { ... },
  //     getters: { ... },
  //     actions: { ... },
  //   },
  //   anotherModuleName: {
  //     getters: { ... },
  //   },
  // },
  //
  // to a store instance, with each module namespaced by
  // default, just like in our app.
  // This like Intergration test but using mocked store instead of stock store.
  // Alternative: use mocks: {$store:{...}}
  if (store) {
    const modules = Object.keys(store)
      .map((moduleName) => {
        const storeModule = store[moduleName];
        return {
          [moduleName]: {
            state: storeModule.state || {},
            getters: storeModule.getters || {},
            actions: storeModule.actions || {},
            namespaced:
              typeof storeModule.namespaced === 'undefined'
                ? true
                : storeModule.namespaced,
          },
        };
      })
      .reduce((moduleA, moduleB) => Object.assign({}, moduleA, moduleB), {});

    const vuexStore = createStore({
      modules,
      devtools: process.env.NODE_ENV !== 'production',
      strict: true,
      plugins: [],
    });
    returnOptions.global?.plugins?.push([vuexStore, vuexKey]);
  }

  // If using `router: true`, we'll automatically stub out
  // components from Vue Router.
  if (router && returnOptions.global) {
    returnOptions.global.stubs = {
      ...returnOptions.global.stubs,
      ...{ 'router-link': true, 'router-view': true },
    };
  }

  // If a `style` object is provided, mock some styles. Mock specific $style object.
  if (style && returnOptions.global?.mocks) {
    returnOptions.global.mocks.$style = new Proxy(
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
            if (matchedStyle) return matchedStyle[1];
            return name;
          }
        },
      }
    );
  }

  return returnOptions;
};

createModuleStore = (vuexModule: any, options = {}) => {
  const store: any = createStore({
    ..._.cloneDeep(vuexModule),
    modules: {
      auth: {
        namespaced: true,
        state: {
          currentUser: options.currentUser,
        },
      },
    },
    devtools: process.env.NODE_ENV !== 'production',
    strict: true,
    plugins: [vuexPersist],
  });
  axios.defaults.headers.common.Authorization = options.currentUser
    ? options.currentUser.token
    : '';
  if (vuexModule.actions?.init) {
    store.dispatch('init');
  }
  return store;
};
