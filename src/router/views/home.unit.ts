import { useMeta } from 'vue-meta';
import appConfig from '@src/app.config.json';
import Home from './home.vue';

jest.mock('vue-meta', () => ({
  useMeta: jest.fn(),
  useActiveMeta: jest.fn(),
}));

describe('@views/home', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('is a valid view', () => {
    expect(Home).toBeAViewComponent();
  });

  it('include metadata title and descriptions', async () => {
    const mockUseMeta = useMeta;
    mountHome();
    expect(mockUseMeta).toBeCalledWith({
      title: 'Home',
      description: appConfig.description,
    });
  });
  it('renders an element', () => {
    const { element } = mountHome();
    expect(element.textContent).toContain('Home Page');
  });
});

function mountHome(mocks: Record<string, unknown> = {}) {
  return shallowMountView(Home, {
    ...createComponentMocks({
      mocks,
    }),
  });
}
