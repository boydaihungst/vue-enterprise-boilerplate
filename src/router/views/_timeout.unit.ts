import { useMeta } from 'vue-meta';
import Timeout from './_timeout.vue';

jest.mock('vue-meta', () => ({
  useMeta: jest.fn(),
  useActiveMeta: jest.fn(),
}));
describe('@views/timeout', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('is a valid view', () => {
    expect(Timeout).toBeAViewComponent();
  });
  it('include metadata title and descriptions', async () => {
    const mockUseMeta = useMeta;
    mountTimeoutPage();
    expect(mockUseMeta).toBeCalledWith({
      title: 'Loading timeout',
      description: 'The page timed out while loading.',
    });
  });
});

function mountTimeoutPage(mocks: Record<string, unknown> = {}) {
  return shallowMountView(Timeout, {
    ...createComponentMocks({
      mocks,
    }),
  });
}
