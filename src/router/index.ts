import { createRouter, createWebHistory, NavigationGuard } from 'vue-router';
// Adds a loading bar at the top during page loads.
import NProgress from 'nprogress';
import { store } from '@state/store';
import { reactive, toRefs } from 'vue';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import { i18n, loadLocaleMessages, SUPPORT_LOCALES } from '@plugin/i18n';
import routes from './routes';

const router = createRouter({
  routes,
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { left: 0, right: 0 };
    }
  },
});

// Before each route evaluates...
router.beforeEach(async (to, from) => {
  // If this isn't an initial page load...
  if (from.name !== null) {
    // Start the route progress bar.
    NProgress.start();
  }

  const { locale } = toRefs(reactive(i18n.global));
  const currentLocale = locale.value;

  const localeInParams = getLocaleFromParams(to.params);

  const isNewLocale = localeInParams !== currentLocale;
  if (isNewLocale) {
    const isNewLocaleSupported = SUPPORT_LOCALES.includes(localeInParams);
    if (!isNewLocaleSupported) {
      return redirectToFallbackLocale(currentLocale, to.fullPath);
    }
    await localeMessageChange(i18n, localeInParams);
  }

  // Check if auth is required on this route
  // (including nested routes).
  const authRequired = to.meta?.authRequired;

  // If auth isn't required for the route, just continue.
  if (!authRequired) return true;

  // If auth is required and the user is logged in...
  if (store.getters['auth/loggedIn']) {
    // Validate the local user token...
    return store.dispatch('auth/validate').then((validUser) => {
      // Then continue if the token still represents a valid user,
      // otherwise redirect to login.
      return validUser ? true : redirectToLoginPage(to.fullPath);
    });
  }

  // If auth is required and the user is NOT currently logged in,
  // redirect to login.
  return redirectToLoginPage(to.fullPath);
});

router.beforeResolve((to, from) => {
  // Create a `beforeResolve` hook, which fires whenever
  // `beforeRouteEnter` and `beforeRouteUpdate` would. This
  // allows us to ensure data is fetched even when params change,
  // but the resolved route does not. We put it in `meta` to
  // indicate that it's a hook we created, rather than part of
  // Vue Router (yet?).
  try {
    return new Promise((resolve) => {
      if (typeof to.meta?.beforeResolve === 'function') {
        to.meta.beforeResolve(
          to,
          from,
          (
            redirectOpts?: ReturnType<
              Parameters<typeof router.beforeResolve>[0]
            >
          ) => {
            if (!redirectOpts) resolve(true);
            // If the user chose to redirect...
            // If redirecting to the same route we're coming from...
            if (
              typeof redirectOpts === 'object' &&
              'name' in redirectOpts &&
              from.name === redirectOpts.name
            ) {
              // Complete the animation of the route progress bar.
              NProgress.done();
            }
            // Complete the redirect.
            return resolve(redirectOpts);
          }
        );
      } else resolve(true);
    });
  } catch (error) {
    return error;
  }
});

// When each route is finished evaluating...
router.afterEach(() => {
  // Complete the animation of the route progress bar.
  NProgress.done();
});

async function localeMessageChange(i18n, locale) {
  if (!i18n.global.availableLocales.includes(locale)) {
    await loadLocaleMessages(i18n, locale);
  }
}

function getLocaleFromParams(params: Record<string, any>): string {
  let selectedLocale = (isArray(params.locale)
    ? !isEmpty(params.locale)
      ? params.locale[0]
      : undefined
    : params.locale
  )?.toString();

  if (
    !selectedLocale &&
    isArray(params.pathMatch) &&
    !isEmpty(params.pathMatch)
  )
    selectedLocale = params.pathMatch[0];
  return selectedLocale;
}

function redirectToFallbackLocale(
  fallbackLocale: string,
  originFullPath: string
) {
  return `/${fallbackLocale}${originFullPath}`;
}

function redirectToLoginPage(
  redirectFrom: string
): ReturnType<NavigationGuard> {
  // Pass the original route to the login component
  return { name: 'login', query: { redirectFrom } };
}

export { router };
