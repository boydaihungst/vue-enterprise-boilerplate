import { useHead } from '@unhead/vue';
import { defineComponent } from 'vue';
import Loading from './_loading.vue';
/**
 * Helper function to render transition
 * {@link https://vue-test-utils.vuejs.org/guides/common-tips.html#mocking-transitions}
 */
const transitionStub = () =>
  defineComponent({
    render() {
      return this.$options._renderChildren;
    },
  });

vi.mock('@unhead/vue', () => ({
  useHead: vi.fn(),
}));

vi.mock('@composables/layout', () => ({
  useLayout: vi.fn().mockImplementation(() => ({
    setLayout: vi.fn(),
  })),
}));

describe('@views/loading', () => {
  afterEach(() => {
    vitest.clearAllMocks();
  });
  it('is a valid view', () => {
    expect(Loading).toBeAComponent();
  });
  it('include metadata title and descriptions', async () => {
    const mockUseMeta = useHead;

    await mountLoadingPage({});
    expect(mockUseMeta).toBeCalledWith({
      title: 'Loading page...',
      meta: [
        {
          name: 'description',
          content: 'Loading page...',
        },
      ],
    });
  });
});

async function mountLoadingPage(mocks: Record<string, unknown> = {}) {
  return shallowMountView(Loading, {
    ...(await createComponentMocks({
      mocks,
      store: {
        stubActions: false,
      },
      i18n: true,
      stubs: {
        BaseIcon: true,
        Transition: transitionStub(),
      },
    })),
  });
}
