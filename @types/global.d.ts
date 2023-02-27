import type { User } from '@models/user';
import type { TestingOptions, TestingPinia } from '@pinia/testing';
import { useAuthStore } from '@stores';
import { mount, shallowMount, type MountingOptions } from '@vue/test-utils';
import type { GlobalMountOptions } from '@vue/test-utils/dist/types';
import type { I18nOptions } from 'vue-i18n';

type ShallowMountType = typeof shallowMount;

type MountType = typeof mount;

// declare type globally
declare global {
  // if you add any global properties/function in here, you also need to add to vite.config.ts > define
  // these function are implemented in file ../tests/unit/setup.ts
  let mount: MountType;
  let shallowMount: ShallowMountType;
  let shallowMountView: ShallowMountType;

  type TestingOpts = TestingOptions & {
    currentUser?: User | null;
  };
  /**
   * Utility to mock store for easy testing
   */
  let createModuleStore: (testingOpts: TestingOpts) => Promise<TestingPinia>;
  /**
   * Utility to create component mock data
   */
  let createComponentMocks: (
    mockData: Partial<Pick<GlobalMountOptions, 'mocks' | 'stubs'>> & {
      /**
       * Pinia testing options,
       */
      store?: TestingOpts;
      /** mock router component. Not useRouter, useRoute, you have to mock
       * it by yourself using `vi.mock("vue-router", () =>({...}))`
       */
      router?: boolean;
      /** Set to true to mock i18n using default messages and locales, detail in file src/plugin/i18n.ts. Use with mount()
       * If your template using sepecial function from i18 like message format, Pluralization. example:
       * `t('views.home', {title: "Home"})`
       * Otherwise use vi.mock:
*  mock i18n
*`vi.mock('vue-i18n', () => ({
*  useI18n: vi.fn().mockImplementation(() => ({
*    t: vi.fn().mockImplementation((str: string) => {
*      // convert from format views.login.meta.* to translated text
*      return at(enLanguage, str).pop();
*    }),
*  })),
*}));`

       */
      i18n?: I18nOptions | boolean;
      /**
       * mock css module $style in <templete> only. if you want to mock useCssModule()
       * you have to mock useCssModule by yourself.
       * `vi.mock('vue', async () => {
  const vueModule = await vi.importActual<typeof import('vue')>('vue');
  return {
    ...vueModule,
    useCssModule: vi.fn().mockImplementation((): Record<string, string> => {
      return {
        iconCustomSomeIcon: 'generated-class-name',
      };
    }),
    // ...mock other modules from vue package
  };
});
`*/
      style?: { [key: string]: string };
    },
  ) => Promise<MountingOptions<any>>;

  interface Window {
    // Ref to root store instances, using in E2E testing.
    authStore: ReturnType<typeof useAuthStore>;
    Cypress: typeof Cypress;
  }
}

export {};
