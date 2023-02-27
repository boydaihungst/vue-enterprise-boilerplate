import Login from '@router/views/login.vue';
import UsersMocked from '@tests/mock-api/resources/users';
import { useHead } from '@unhead/vue';
import { flushPromises } from '@vue/test-utils';
import type { Mock } from 'vitest';
import type { ComponentPublicInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const validUserExample = UsersMocked.findBy('username', 'admin');

vi.mock('@unhead/vue', () => ({
  useHead: vi.fn(),
}));

vi.mock('@composables/layout', () => ({
  useLayout: vi.fn().mockImplementation(() => ({
    setLayout: vi.fn(),
  })),
}));

vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({
    query: {
      redirectFrom: null,
    },
  })),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

describe('@views/login', () => {
  it('is a valid view', () => {
    expect(Login).toBeAComponent();
  });

  it('include metadata title and descriptions', async () => {
    const mockedUseHead = useHead;

    await mountLogin();
    expect(mockedUseHead).toBeCalledWith({
      title: 'Log in',
      meta: [
        {
          name: 'description',
          content: `Log in to Vue Enterprise Boilerplate`,
        },
      ],
    });
  });

  it('redirects to home after successful login', async () => {
    (useRoute as Mock).mockImplementationOnce(() => ({
      query: {},
    }));
    const mockPush = vi.fn();

    (useRouter as Mock).mockImplementationOnce(() => ({
      push: mockPush,
    }));
    // this is a tricky way to access vm internal function. Without defineExpose or return in setup script
    const { vm }: { vm: ComponentPublicInstance & Record<string, any> } =
      await mountLogin();

    vm.credential.username = validUserExample?.username;
    vm.credential.password = validUserExample?.password;
    await vm.tryToLogIn();
    await flushPromises();
    expect(vm.authError).toEqual(null);
    expect(mockPush).toHaveBeenCalledWith({ name: 'home' });
  });

  it('redirects to redirectFrom query, if it exists, after successful login', async () => {
    const redirectFrom = '/profile?someQuery';

    (useRoute as Mock).mockImplementationOnce(() => ({
      query: { redirectFrom },
    }));
    const mockPush = vi.fn();

    (useRouter as Mock).mockImplementationOnce(() => ({
      push: mockPush,
    }));
    const { vm }: { vm: ComponentPublicInstance & Record<string, any> } =
      await mountLogin();

    vm.credential.username = validUserExample?.username;
    vm.credential.password = validUserExample?.password;

    await vm.tryToLogIn();
    await flushPromises();
    expect(vm.authError).toEqual(null);
    expect(mockPush).toHaveBeenCalledWith(redirectFrom);
  });

  it('displays an error after failed login', async () => {
    (useRoute as Mock).mockImplementationOnce(() => ({
      query: {},
    }));
    const mockPush = vi.fn();

    (useRouter as Mock).mockImplementationOnce(() => ({
      push: mockPush,
    }));
    const { vm }: { vm: ComponentPublicInstance & Record<string, any> } =
      await mountLogin();

    await vm.tryToLogIn();
    await flushPromises();
    expect(vm.authError).not.toBeNull();
    expect(vm.$el.textContent).toContain('error');
  });
});

async function mountLogin(mockData: Record<string, unknown> = {}) {
  return shallowMount(Login, {
    ...(await createComponentMocks({
      store: {
        stubActions: false,
      },
      mocks: mockData,
      // mock i18n with default messages is en
      i18n: true,
      router: true,
      stubs: {
        BaseInputText: true,
        BaseButton: true,
        BaseIcon: true,
      },
    })),
  });
}
