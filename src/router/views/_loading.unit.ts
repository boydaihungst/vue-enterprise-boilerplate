import { defineComponent } from '@vue/runtime-core';
import { useMeta } from 'vue-meta';
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

jest.mock('vue-meta', () => ({
  useMeta: jest.fn(),
  useActiveMeta: jest.fn(),
}));
describe('@views/loading', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('is a valid view', () => {
    expect(Loading).toBeAViewComponent();
  });
  it('include metadata title and descriptions', async () => {
    const mockUseMeta = useMeta;
    mountLoadingPage({});
    expect(mockUseMeta).toBeCalledWith({
      title: 'Loading page...',
      description: 'Loading page...',
    });
  });
});

function mountLoadingPage(mocks: Record<string, unknown> = {}) {
  return shallowMountView(Loading, {
    ...createComponentMocks({
      mocks,
      stubs: {
        BaseIcon: true,
        Transition: transitionStub(),
      },
    }),
  });
}
