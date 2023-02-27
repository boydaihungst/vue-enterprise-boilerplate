import type { NavRouteItem } from '@models/nav-route-item';
import NavBarRoute from './nav-bar-routes.vue';
import NavBar from './nav-bar.vue';
describe('@components/nav-bar', () => {
  it(`displays the user's name in the profile link`, async () => {
    const navbarWrapper = shallowMount(NavBar, {
      ...(await createComponentMocks({
        store: {
          currentUser: {
            name: 'My Name',
          },
        },
      })),
    });

    const navbarRoutes = navbarWrapper.findAllComponents(NavBarRoute);

    const loggedInNavbarRoute = navbarRoutes.at(1);

    const profileRoute = loggedInNavbarRoute
      ?.props('routes')
      .find((route: NavRouteItem) => route.name === 'profile');

    if (profileRoute && typeof profileRoute.title === 'function') {
      expect(profileRoute.title()).toEqual('Logged in as My Name');
    }
    expect.assertions(1);
  });
});
