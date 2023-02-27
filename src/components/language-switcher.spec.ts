import LanguageSwitcherVue from '@components/language-switcher.vue';
// import BaseSelect from '@components/_base-select.vue';
import * as i18plugin from '@plugin/i18n';
import { SUPPORT_LOCALES } from '@plugin/i18n';
import { flushPromises, type MountingOptions } from '@vue/test-utils';
import { ref } from 'vue';
import BaseSelect from './_base-select.vue';

const routerPushMock = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: routerPushMock,
    currentRoute: ref({
      params: {},
      query: {},
      fullPath: '/vi/404',
    }),
  }),
}));

async function mountLanguageSwitcher(options: MountingOptions<any, any> = {}) {
  return mount(LanguageSwitcherVue, {
    ...(await createComponentMocks({
      style: {
        option: 'option',
      },
    })),
    ...options,
  });
}
describe('@components/_base-select', async () => {
  afterAll(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
    vi.resetModules();
  });
  it('renders select element and options', async () => {
    vi.spyOn(i18plugin, 'getLocale').mockImplementation((): string => {
      return 'vi';
    });

    vi.spyOn(i18plugin, 'SUPPORT_LOCALES', 'get').mockReturnValue([
      'vi',
      'en',
      'jp',
    ]);

    const wrapper = await mountLanguageSwitcher({});

    await flushPromises();
    const selectWrapper = wrapper.findComponent(BaseSelect);

    // select rendered
    expect(selectWrapper.exists()).toBeTruthy();
    const optionsWrapper = selectWrapper.findAll('option');

    // render all locale value
    expect(optionsWrapper.map((optEl) => optEl.element.value)).toEqual(
      expect.arrayContaining(SUPPORT_LOCALES),
    );

    // capital label
    expect(optionsWrapper.map((el) => el.attributes('label'))).toEqual(
      SUPPORT_LOCALES.map(
        (locale) => locale.charAt(0).toUpperCase() + locale.substring(1),
      ),
    );
  });

  it('shows initial language', async () => {
    const mockedGetLocale = vi
      .spyOn(i18plugin, 'getLocale')
      .mockImplementation((): string => {
        return 'vi';
      });

    vi.spyOn(i18plugin, 'SUPPORT_LOCALES', 'get').mockReturnValue([
      'vi',
      'en',
      'jp',
    ]);

    const wrapper = await mountLanguageSwitcher({});

    await flushPromises();
    const selectWrapper = wrapper.getComponent(BaseSelect);

    // select rendered with initial value
    expect(mockedGetLocale).toHaveBeenCalledOnce();
    expect(mockedGetLocale).toReturnWith('vi');
    expect(selectWrapper.props('modelValue')).toEqual('vi');
  });

  it('changes display language', async () => {
    const mockedGetLocale = vi
      .spyOn(i18plugin, 'getLocale')
      .mockImplementation((): string => {
        return 'vi';
      });

    vi.spyOn(i18plugin, 'SUPPORT_LOCALES', 'get').mockReturnValue([
      'vi',
      'en',
      'jp',
    ]);

    const wrapper = await mountLanguageSwitcher({});

    await flushPromises();
    const selectWrapper = wrapper.findComponent(BaseSelect);

    expect(selectWrapper.exists()).toBeTruthy();
    await selectWrapper.setValue('jp');
    // old locale
    expect(mockedGetLocale).toReturnWith('vi');
    expect(routerPushMock).toHaveBeenCalledOnce();
    expect(routerPushMock).toHaveBeenCalledWith({
      replace: false,
      params: {},
      query: {},
      path: '/jp/404',
    });
  });
});
