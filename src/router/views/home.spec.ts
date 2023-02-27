import { useHead } from '@unhead/vue';
import Home from './home.vue';

vi.mock('@unhead/vue', () => ({
  useHead: vi.fn(),
}));

vi.mock('@composables/layout', () => ({
  useLayout: vi.fn().mockImplementation(() => ({
    setLayout: vi.fn(),
  })),
}));

describe('@views/home', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('is a valid view', () => {
    expect(Home).toBeAComponent();
  });

  it('include metadata title and descriptions', async () => {
    const mockedUseHead = useHead;

    await mountHome();
    expect(mockedUseHead).toBeCalledWith({
      title: 'Home',
      meta: [
        {
          name: 'description',
          content:
            'Opinionated boilerplate project for an enterprise Vue frontend',
        },
      ],
    });
  });
  it('renders an element', async () => {
    const { element } = await mountHome();

    expect(element.textContent).toContain('Home Page');
  });
});

async function mountHome(mocks: Record<string, unknown> = {}) {
  return shallowMountView(Home, {
    ...(await createComponentMocks({
      store: {
        stubActions: false,
      },
      i18n: true,
      mocks,
    })),
  });
}
