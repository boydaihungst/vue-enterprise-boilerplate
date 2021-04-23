import { useMeta } from 'vue-meta';
import View404 from './_404.vue';

jest.mock('vue-meta', () => ({
  useMeta: jest.fn(),
  useActiveMeta: jest.fn(),
}));
describe('@views/404', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('is a valid view', () => {
    expect(View404).toBeAViewComponent();
  });

  it('include metadata title and descriptions', async () => {
    const mockUseMeta = useMeta;
    mount404Page();
    expect(mockUseMeta).toBeCalledWith({
      title: '404',
      description: '404',
    });
  });
});

function mount404Page(mocks: Record<string, any> = {}) {
  return shallowMountView(View404 as any, {
    ...createComponentMocks({
      mocks,
    }),
  });
}
