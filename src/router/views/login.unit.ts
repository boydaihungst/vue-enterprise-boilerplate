import { useMeta } from 'vue-meta';
import appConfig from '@src/app.config.json';
import Login from './login.vue';

jest.mock('vue-meta', () => ({
  useMeta: jest.fn(),
  useActiveMeta: jest.fn(),
}));

describe('@views/login', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('is a valid view', () => {
    expect(Login).toBeAViewComponent();
  });

  it('include metadata title and descriptions', async () => {
    const mockUseMeta = useMeta as jest.MockedFunction<typeof useMeta>;
    mountLogin();
    expect(mockUseMeta).toBeCalledWith({
      title: 'Log in',
      description: `Log in to ${appConfig.title}`,
    });
  });

  it('redirects to home after successful login', async () => {
    const { vm } = mountLogin();

    vm.$data.username = 'correctUsername';
    vm.$data.password = 'correctPassword';

    const routerPush = jest.fn();
    vm.$router = { push: routerPush };
    vm.$route = { query: {} };

    await vm.tryToLogIn();
    expect(vm.authError).toEqual(null);
    expect(vm.$router.push).toHaveBeenCalledWith({ name: 'home' });
  });

  it('redirects to redirectFrom query, if it exists, after successful login', async () => {
    const { vm } = mountLogin();

    vm.$data.username = 'correctUsername';
    vm.$data.password = 'correctPassword';

    const routerPush = jest.fn();
    vm.$router = { push: routerPush };

    const redirectFrom = '/profile?someQuery';
    vm.$route = { query: { redirectFrom } };

    await vm.tryToLogIn();
    expect(vm.authError).toEqual(null);
    expect(vm.$router.push).toHaveBeenCalledWith(redirectFrom);
  });

  it('displays an error after failed login', async () => {
    const routerPush = jest.fn();
    const { vm } = mountLogin();
    vm.$router = { push: routerPush };
    await vm.tryToLogIn();
    expect(vm.authError).toBeTruthy();
    expect(vm.$el.textContent).toContain('error');
  });
});

function mountLogin(mocks: Record<string, unknown> = {}) {
  return shallowMountView(Login, {
    ...createComponentMocks({
      store: {
        auth: {
          actions: {
            logIn(_, { username, password }) {
              if (
                username === 'correctUsername' &&
                password === 'correctPassword'
              ) {
                return Promise.resolve('testToken');
              } else {
                return Promise.reject(new Error('testError'));
              }
            },
          },
        },
      },
      mocks,
      stubs: {
        BaseInputText: true,
        BaseButton: true,
        BaseIcon: true,
      },
    }),
  });
}
