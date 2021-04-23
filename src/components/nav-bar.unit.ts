import NavBar from './nav-bar.vue';

describe('@components/nav-bar', () => {
  it(`displays the user's name in the profile link`, () => {
    const { vm } = shallowMount(NavBar, {
      ...createComponentMocks({
        store: {
          auth: {
            state: {
              currentUser: {
                name: 'My Name',
              },
            },
            getters: {
              loggedIn: () => true,
            },
          },
        },
      }),
    });

    const profileRoute = vm.$data.loggedInNavRoutes.find(
      (route) => route.name === 'profile'
    );
    if (profileRoute && typeof profileRoute.title === 'function') {
      expect(profileRoute.title()).toEqual('Logged in as My Name');
    }
    expect.assertions(1);
  });
});
