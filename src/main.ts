import { createApp } from 'vue';
import { registerGlobalDirective } from '@src/directives/_globals';
import { registerGlobalComponent } from '@components/_globals';
import { registerLayoutComponent } from '@layouts/_globals';
import { registerGlobalPlugin } from '@plugin';
import { router } from '@router';
import App from '@src/App.vue';
const app = createApp(App);
// Install global plugin, component, directive, config ...

// If running inside Cypress...
if (process.env.VUE_APP_TEST === 'e2e') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires

  // Ensure tests fail when Vue emits an error.
  app.config.errorHandler = (window.Cypress as any).cy.onUncaughtException;
}

/**
 * With this mock service will intercept any http | graphql query, then response with mock data
 * If u dont use this feature then remove file `mockServiceWorker.js` in public folder
 * {@link https://mswjs.io/docs}
 */
async function waitForMockServiceWorkerStart() {
  // Only run in browser environment like E2E test, webpack dev server
  if (!process.env.API_BASE_URL && process.env.VUE_APP_TEST !== 'unit') {
    const mockServer = (await import('@/tests/mock-api/server.worker'))
      .mockServer;
    // Use this to debug mock server
    // mockServer.on('request:match', (req) => {
    //  console.info('request:match', req);
    // });
    await mockServer.start();
    mockServer.printHandlers();
  }
}
waitForMockServiceWorkerStart().then(() => {
  // Globally register all plugins
  registerGlobalPlugin(app).then(() => {
    // Globally register all `_base`-prefixed components
    registerGlobalComponent(app);
    // Globally register all layout components
    registerLayoutComponent(app);
    // Globally register all directive
    registerGlobalDirective(app);
    router.isReady().then(async () => {
      const appMounted = app.mount('#app');
      // If running e2e tests...
      if (process.env.VUE_APP_TEST === 'e2e') {
        // Attach the app to the window, which can be useful
        // for manually setting state in Cypress commands
        // such as `cy.logIn()`.
        window.__app__ = appMounted;
      }
    });
  });
});
