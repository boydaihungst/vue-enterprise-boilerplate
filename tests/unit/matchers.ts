import isPlainObject from 'lodash/isPlainObject';
import { printReceived } from 'jest-matcher-utils';
import 'jest-extended';
import { DefineComponent } from 'vue';
import { StoreOptions } from 'vuex';

const customMatchers = {
  toBeAComponent(options: DefineComponent) {
    if (isAComponent()) {
      return {
        message: () =>
          `expected ${printReceived(options)} not to be a Vue component`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${printReceived(
            options
          )} to be a valid Vue component, exported from a .vue file`,
        pass: false,
      };
    }

    function isAComponent() {
      return isPlainObject(options) && typeof options.render === 'function';
    }
  },
  toBeAViewComponent(options: DefineComponent) {
    if (usesALayout()) {
      return {
        message: () =>
          `expected ${printReceived(
            options
          )} not to register a local Layout component nor define a page title and meta description`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${printReceived(
            options
          )} to register a local Layout component and define a page title and meta description`,
        pass: false,
      };
    }
    function usesALayout() {
      return options.components && options.components.Layout;
    }
  },

  toBeAViewComponentUsing(options: DefineComponent) {
    return this.toBeAViewComponent(options);
  },

  toBeAVuexModule(options: StoreOptions<Record<string, unknown>>) {
    if (isAVuexModule()) {
      return {
        message: () =>
          `expected ${printReceived(options)} not to be a Vuex module`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${printReceived(
            options
          )} to be a valid Vuex module, include state, getters, mutations, and actions`,
        pass: false,
      };
    }

    function isAVuexModule() {
      return (
        isPlainObject(options) &&
        isPlainObject(options.state) &&
        isPlainObject(options.getters) &&
        isPlainObject(options.mutations) &&
        isPlainObject(options.actions)
      );
    }
  },
};

// https://facebook.github.io/jest/docs/en/expect.html#expectextendmatchers
expect.extend(customMatchers);
export {};
