import { printReceived } from 'jest-matcher-utils';
import { isPlainObject } from 'lodash';
import { expect } from 'vitest';
import type { DefineComponent } from 'vue';

// custome matcher to use in unit test. Usage: expect(ComponentA).toBeAComponet()
const customMatchers: Record<string, (...args: any) => Vi.MatcherResult> = {
  toBeAComponent(options: DefineComponent) {
    if (isAComponent()) {
      return {
        message: () => `expected  not to be a Vue component`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${printReceived(
            options,
          )} to be a valid Vue component, exported from a .vue file`,
        pass: false,
      };
    }

    function isAComponent() {
      return (
        isPlainObject(options) &&
        (typeof options.render === 'function' ||
          typeof options.setup === 'function' ||
          options.template)
      );
    }
  },
};

expect.extend(customMatchers);
export {};
