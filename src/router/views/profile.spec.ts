import Profile from '@router/views/profile.vue';
import UsersMocked from '@tests/mock-api/resources/users';
import { useHead } from '@unhead/vue';

const validUserExample = UsersMocked.findBy('username', 'admin');

vi.mock('@unhead/vue', () => ({
  useHead: vi.fn(),
}));

vi.mock('@composables/layout', () => ({
  useLayout: vi.fn().mockImplementation(() => ({
    setLayout: vi.fn(),
  })),
}));

describe('@views/profile', () => {
  it('is a valid view', () => {
    expect(Profile).toBeAComponent();
  });

  it('include metadata title and descriptions', async () => {
    const mockedUseHead = useHead;

    await mountProfilePage({
      user: validUserExample,
    });

    expect(mockedUseHead).toBeCalledWith({
      title: validUserExample?.name,
      meta: [
        {
          name: 'description',
          content: `The user profile for ${validUserExample?.name}`,
        },
      ],
    });
  });

  it(`includes the provided user's name`, async () => {
    const { element } = await mountProfilePage({
      user: validUserExample,
    });

    expect(element.textContent).toMatch(`${validUserExample?.name} Profile`);
  });
});

async function mountProfilePage(
  props: Record<string, any> = {},
  mocks: Record<string, any> = {},
) {
  return shallowMount(Profile, {
    props,
    ...(await createComponentMocks({
      store: {
        stubActions: false,
      },
      mocks: mocks,
      // mock i18n with default messages is en
      i18n: true,
      router: true,
      stubs: {
        BaseIcon: true,
      },
    })),
  });
}
