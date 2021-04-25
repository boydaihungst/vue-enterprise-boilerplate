import { store } from '@state/store';
import { defineAsyncComponent, defineComponent, h } from 'vue';
import { RouteRecordRaw } from 'vue-router';

const routeRecordRaws: RouteRecordRaw[] = [
  {
    /**
     * Follow Subdomains with gTLD url structure from google.
     * {@link https://developers.google.com/search/docs/advanced/crawling/managing-multi-regional-sites#locale-specific-urls}
     *
     */
    path: '/:locale?',
    component: () => import(/* webpackPrefetch: true */ '@views/locale.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => lazyLoadView(import('@views/home.vue')),
      },
      {
        path: 'login',
        name: 'login',
        component: () => lazyLoadView(import('@views/login.vue')),
        meta: {
          beforeResolve: (to, from, next) => {
            // If the user is already logged in
            if (store.getters['auth/loggedIn']) {
              // Redirect to the home page instead
              next({ name: 'home' });
            } else {
              // Continue to the login page
              next();
            }
          },
        },
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => lazyLoadView(import('@views/profile.vue')),
        meta: {
          authRequired: true,
        },
        props: () => ({ user: store.state.auth.currentUser || {} }),
      },
      {
        path: 'profile/:username',
        name: 'username-profile',
        component: () => lazyLoadView(import('@views/profile.vue')),
        meta: {
          authRequired: true,
          // HACK: In order to share data between the `beforeResolve` hook
          // and the `props` function, we must create an object for temporary
          // data only used during route resolution.
          tmp: {},
          beforeResolve(to, from, next) {
            store
              // Try to fetch the user's information by their username
              .dispatch('users/fetchUser', {
                username: to.params.username.toString(),
              })
              .then((user) => {
                // Add the user to `meta.tmp`, so that it can
                // be provided as a prop.
                to.meta.tmp.user = user;
                // Continue to the route.
                next();
              })
              .catch(() => {
                // If a user with the provided username could not be
                // found, redirect to the 404 page.
                next({ name: '404', params: { resource: 'User' } });
              });
          },
        },
        // Set the user from the route params, once it's set in the
        // beforeResolve route guard.
        props: (route) => ({ user: route.meta.tmp.user }),
      },
      {
        path: 'logout',
        name: 'logout',
        component: () => lazyLoadView(import('@views/home.vue')),
        meta: {
          authRequired: true,
          beforeResolve(to, from, next) {
            store.dispatch('auth/logOut');
            const authRequiredOnPreviousRoute = from.meta.authRequired;
            // Navigate back to previous page, or home as a fallback
            next(authRequiredOnPreviousRoute ? { name: 'home' } : { ...from });
          },
        },
      },
      {
        path: 'timeout',
        name: 'time-out',
        component: () =>
          lazyLoadView(
            /* webpackPrefetch: true */ import('@views/_timeout.vue')
          ),
        meta: {
          authRequired: false,
        },
      },
    ],
  },
  {
    path: '/404',
    name: '404',
    component: () =>
      lazyLoadView(/* webpackPrefetch: true */ import('@views/_404.vue')),
    // Allows props to be passed to the 404 page through route
    // params, such as `resource` to define what wasn't found.
    props: true,
  },
  // Redirect any unmatched routes to the 404 page. This may
  // require some server configuration to work in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
  {
    path: '/:pathMatch(.*)*',
    redirect: '404',
  },
];

// Lazy-loads view components, but with better UX. A loading view
// will be used if the component takes a while to load, falling
// back to a timeout view in case the page fails to load. You can
// use this component to lazy-load a route with:
//
// component: () => lazyLoadView(import('@views/my-view'))
//
// NOTE: Components loaded with this strategy DO NOT have access
// to in-component guards, such as beforeRouteEnter,
// beforeRouteUpdate, and beforeRouteLeave. You must either use
// route-level guards instead or lazy-load the component directly:
//
// component: () => import('@views/my-view')
//
function lazyLoadView(AsyncView) {
  const AsyncHandler = defineAsyncComponent({
    loader: () => AsyncView,
    // A component to use while the component is loading.
    loadingComponent: () => import('@views/_loading.vue'),
    // Delay before showing the loading component.
    // Default: 200 (milliseconds).
    delay: 400,
    // A fallback component in case the timeout is exceeded
    // when loading the component.
    errorComponent: () => import('@views/_timeout.vue'),
    // Time before giving up trying to load the component.
    // Default: Infinity (milliseconds).
    timeout: 10000,
    /**
     *
     * @param {*} error Error message object
     * @param {*} retry A function that indicating whether the async component should retry when the loader promise rejects
     * @param {*} fail  End of failure
     * @param {*} attempts Maximum allowed retries number
     */
    onError(error, retry, fail, attempts) {
      if (error.message.match(/fetch/) && attempts <= 3) {
        // retry on fetch errors, 3 max attempts
        retry();
      } else {
        // Note that retry/fail are like resolve/reject of a promise:
        // one of them must be called for the error handling to continue.
        fail();
      }
    },
  });

  return Promise.resolve(
    defineComponent({
      setup(props, { attrs, slots }) {
        return () => h(AsyncHandler, { ...attrs, ...props }, slots);
      },
    })
  );
}

export default routeRecordRaws;
