/* eslint-disable @typescript-eslint/no-empty-interface */
import 'vitest';

declare global {
  namespace Vi {
    // custom matchers. Which are implimented in ../tests/unit/matchers.ts file
    interface CustomMatchers<R = MatcherResult> {
      toBeAComponent(): R;
    }

    interface Assertion extends CustomMatchers {}

    interface AsymmetricMatchersContaining extends CustomMatchers {}

    interface MatcherResult {
      pass: boolean;
      message: () => string;
      // If you pass these, they will automatically appear inside a diff when
      // the matcher does not pass, so you don't need to print the diff yourself
      actual?: unknown;
      expected?: unknown;
    }
  }

  // Note: augmenting jest.Matchers interface will also work.
}
export {};
