import enLanguage from '@src/lang/en.json';
import { useHead } from '@unhead/vue';
import { flushPromises } from '@vue/test-utils';
import axios from 'axios';
import { at } from 'lodash';
import { nextTick } from 'vue';
import LoadingView from './_loading.vue';
import Timeout from './_timeout.vue';

vi.mock('@unhead/vue', () => ({
  useHead: vi.fn(),
}));

vi.mock('@composables/layout', () => ({
  useLayout: vi.fn().mockImplementation(() => ({
    setLayout: vi.fn(),
  })),
}));

describe('@views/timeout', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('is a valid view', () => {
    expect(Timeout).toBeAComponent();
  });

  it('include metadata title and descriptions', async () => {
    const mockUseHead = useHead;

    await mountTimeoutPage();
    expect(mockUseHead).toBeCalledWith({
      title: 'Loading timeout',
      meta: [
        {
          name: 'description',
          content: 'The page timed out while loading.',
        },
      ],
    });
  });

  it('reloads page if internet is connected', async () => {
    await mountTimeoutPage();
    expect(window.location.reload).toHaveBeenCalledOnce();
  });

  it("doesn't reloads page if internet is disconnected and show error message", async () => {
    vi.spyOn(axios, 'head').mockImplementation(async () => {
      throw new Error('No internet connection');
    });
    const errorNoInternetMessage = at(
      enLanguage,
      'views.timeout.noInternetPrompt',
    ).pop();

    const pageWrapper = await mountTimeoutPage();

    // wait for api responsed and page render
    await flushPromises();
    await nextTick();
    expect(pageWrapper.element.innerHTML).toBe(errorNoInternetMessage);
  });
  it('show loading view if have slow internet connection', async () => {
    // debounce ping response
    vi.spyOn(axios, 'head').mockImplementation(async () => {
      const debouceResponseMillisecond = 10000;

      await new Promise((resolve) => {
        setTimeout(resolve, debouceResponseMillisecond);
      });
    });

    const pageWrapper = await mountTimeoutPage();

    // wait page render
    await nextTick();
    expect(pageWrapper.getComponent(LoadingView).isVisible()).toBeTruthy();
  });
});

async function mountTimeoutPage(mockData: Record<string, unknown> = {}) {
  return mount(Timeout, {
    ...(await createComponentMocks({
      stubs: {
        LoadingView: true,
      },
      store: {
        stubActions: false,
      },
      i18n: true,
      style: {
        title: 'title',
      },
      ...mockData,
    })),
  });
}
