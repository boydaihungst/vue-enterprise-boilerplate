import { i18nGlobal } from '@plugin';
import { getLocale, isLocaleSupported, setI18nLanguage } from '@plugin/i18n';
import { useAuthStore } from '@stores';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import NProgress from 'nprogress';
import { unref } from 'vue';
import {
  createRouter as originalCreateRoute,
  createWebHistory,
  type RouteLocationNormalized,
  type RouteLocationRaw,
} from 'vue-router';
import routes from './routes';

export async function createRouter() {
  const router = originalCreateRoute({
    routes,
    history: createWebHistory(),
    scrollBehavior: (_to, _from, savedPosition) => {
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

    // Get global locale
    const locale = getLocale(i18nGlobal);

    const currentLocale = unref(locale);
    const localeInParams = getLocaleFromParams(to.params);
    const isNewLocale = localeInParams !== currentLocale;

    if (isNewLocale) {
      // case forget to add locale or locale not exist
      if (!isLocaleSupported(localeInParams)) {
        return redirectToFallbackLocale(currentLocale, to);
      }
      // update i18n plugin with new locale
      await setI18nLanguage(i18nGlobal, localeInParams);
    }

    // Check if auth is required on this route
    // (including nested routes).
    const authRequired = to.meta?.authRequired;

    // If auth isn't required for the route, just continue.
    if (!authRequired) return true;

    // If auth is required and the user is logged in...
    const authStore = useAuthStore();

    if (authStore.loggedIn) {
      // Validate the local user token...
      const validUser = await authStore.validate();

      return validUser ? true : redirectToLoginPage(to);
    }

    // If auth is required and the user is NOT currently logged in,
    // redirect to login.
    return redirectToLoginPage(to);
  });

  router.beforeResolve(async (to, from) => {
    // Create a `beforeResolve` hook, which fires whenever
    // `beforeRouteEnter` and `beforeRouteUpdate` would. This
    // allows us to ensure data is fetched even when params change,
    // but the resolved route does not. We put it in `meta` to
    // indicate that it's a hook we created, rather than part of
    // Vue Router (yet?).
    try {
      if (typeof to.meta?.beforeResolve === 'function') {
        const redirectTo = await to.meta.beforeResolve(to, from);

        // If the user chose to redirect...
        // and redirecting to the same route we're coming from...
        if (
          typeof redirectTo === 'object' &&
          'name' in redirectTo &&
          from.name === redirectTo.name
        ) {
          // Complete the animation of the route progress bar.
          NProgress.done();
        }
        // Complete the redirect.
        return redirectTo;
      } else return true;
    } catch (error: any) {
      // return error;
      return false;
    }
  });

  // When each route is finished evaluating...
  router.afterEach(() => {
    // Complete the animation of the route progress bar.
    NProgress.done();
  });
  return router;
}

/**
 * @param params - Current params in this route. Example: /en/404 -> matched route :locale/404 -> params is {locale: en}
 * @returns return locale value. Example: en
 */
export function getLocaleFromParams(params: Record<string, any>): string {
  let selectedLocale = (
    isArray(params.locale)
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

/**
 * @param fallbackLocale - redirect to fallback locale. Ex: /not-exist-locale/profile -> /en/profile
 * @param routeName - redirect from this path to `/:fallbackLocale/originpath`.
 * @param query - query from current path
 * @returns route with new locale
 */
export function redirectToFallbackLocale(
  fallbackLocale: string,
  to?: RouteLocationNormalized,
): RouteLocationRaw {
  // /en/originPath?query
  return {
    name: (to?.name as string) || undefined,
    params: {
      ...to?.params,
      locale: fallbackLocale,
    },
    query: to?.query,
    hash: to?.hash,

    // path: newPath,
    replace: true,
  };
}

function redirectToLoginPage(to: RouteLocationNormalized): RouteLocationRaw {
  // Pass the original route to the login component
  // /en/login
  return {
    name: 'login',
    params: to?.params,
    query: { redirectFrom: to.fullPath },
    // hash: to?.hash,
    replace: false,
    force: true,
  };
}
