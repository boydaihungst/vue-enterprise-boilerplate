/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
declare global {
  namespace jest {
    interface Matchers<R, T = {}> {
      toBeAComponent(): CustomMatcherResult;
      toBeAViewComponentUsing(): CustomMatcherResult;
      toBeAViewComponent(): CustomMatcherResult;
      toBeAVuexModule(): CustomMatcherResult;
    }
  }
}
export {};
