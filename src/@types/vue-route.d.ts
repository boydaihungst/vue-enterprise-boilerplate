import { NavigationGuard } from 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    // is optional
    beforeResolve?: NavigationGuard;
    // must be declared by every route
    authRequired?: boolean;
    verifiedRequired?: boolean;
    [key: string]: any;
  }
}
