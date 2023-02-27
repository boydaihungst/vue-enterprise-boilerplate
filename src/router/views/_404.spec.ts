import { useHead } from '@unhead/vue';
import View404 from './_404.vue';

vi.mock('@unhead/vue', () => ({
  useHead: vi.fn(),
}));

vi.mock('@composables/layout', () => ({
  useLayout: vi.fn().mockImplementation(() => ({
    setLayout: vi.fn(),
  })),
}));

describe('@views/404', () => {
  afterEach(() => {
    vitest.clearAllMocks();
  });

  it('is a valid view', () => {
    expect(View404).toBeAComponent();
  });

  it('includes metadata title and descriptions', async () => {
    const mockedUseHead = useHead;

    await mount404Page();
    expect(mockedUseHead).toBeCalledWith({
      title: '404',
      meta: [
        {
          name: 'description',
          content: '404',
        },
      ],
    });
  });

  it.todo('renders 404 error correctly');
});

async function mount404Page(mocks: Record<string, any> = {}) {
  return shallowMountView(View404 as any, {
    ...(await createComponentMocks({
      store: {
        stubActions: false,
      },
      i18n: true,
      mocks,
    })),
  });
}
