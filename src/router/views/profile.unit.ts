import { useMeta } from 'vue-meta';
import UsersMock from '@/tests/mock-api/resources/users';
import { merge } from 'lodash';
import Profile from './profile.vue';

jest.mock('vue-meta', () => ({
  useMeta: jest.fn(),
  useActiveMeta: jest.fn(),
}));
describe('@views/profile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('is a valid view', () => {
    expect(Profile).toBeAViewComponent();
  });

  it('include metadata title and descriptions', () => {
    const mockUseMeta = useMeta as jest.MockedFunction<typeof useMeta>;
    const adminUserMock = UsersMock.findBy('username', 'admin');
    mountProfilePage({
      user: adminUserMock,
    });
    expect(mockUseMeta).toBeCalledWith({
      title: adminUserMock?.name,
      description: `The user profile for ${adminUserMock?.name}`,
    });
  });

  it(`includes the provided user's name`, () => {
    const adminUserMock = UsersMock.findBy('username', 'admin');
    const { element } = mountProfilePage({
      user: adminUserMock,
    });

    expect(element.textContent).toMatch(`${adminUserMock?.name} Profile`);
  });
});

function mountProfilePage(
  props: Record<string, any> = {},
  mocks: Record<string, any> = {}
) {
  return shallowMountView(Profile, {
    props,
    ...merge(
      createComponentMocks({
        mocks: mocks,
        stubs: {
          BaseIcon: true,
        },
      })
    ),
  });
}
