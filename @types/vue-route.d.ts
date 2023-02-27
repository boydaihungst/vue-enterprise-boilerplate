import 'vue-router';
declare module 'vue-router' {
  // Declare type for router.meta in ../src/router/routes.ts
  interface RouteMeta {
    // is optional
    beforeResolve?: (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
    ) => ReturnType<NavigationGuardWithThis<undefined>>;
    // must be declared by every route.
    // If true, will run authStore.validate each time go to this route
    authRequired?: boolean;
    // TODO: Check account is verified
    verifiedRequired?: boolean;
    // Contain temporary data.
    // HACK: In order to share data between the `beforeResolve` hook
    // and the `props` function, we must create an object for temporary
    // data only used during route resolution.
    tmp: Record<string | symbol | number, any>;

    //[key: string | number | symbol]: any;
  }
}
