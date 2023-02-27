import { registerGlobalComponent } from '@components/_globals';
import { registerLayoutComponent } from '@layouts/_globals';
import { registerGlobalPlugin } from '@plugin';
import App from '@src/App.vue';
import { registerGlobalDirective } from '@src/directives/_globals';
import { useAuthStore } from '@stores';
import { createApp } from 'vue';
const app = createApp(App);

// Install global plugin, component, directive, config ...
if (!import.meta.env.PROD) {
  // If running inside Cypress...
  if (import.meta.env.VITE_TEST_E2E) {
    // Ensure tests fail when Vue emits an error.
    app.config.errorHandler = (err) => {
      setTimeout(() => {
        throw err;
      });
    };
  }
}

/**
 * With this mock service will intercept any http | graphql query, then response with mock data
 * If u dont use this feature then remove file `mockServiceWorker.js` in public folder
 * {@link https://mswjs.io/docs}
 */
async function waitForMockServiceWorkerStart() {
  // Only run in browser environment like E2E test, dev server with dev mode
  // In vitest it will start using /tests/unit/setup-mock-server.ts and add this file to vite.config.ts > test > setupFiles
  // Indicate for esbuild/rollup to exclude this code in production build
  if (!import.meta.env.PROD) {
    if (!import.meta.env.VITE_API_BASE_URL) {
      const mockServer = (await import('@tests/mock-api/server.worker'))
        .mockServer;

      // Use this to debug mock server api has been call or passthrough
      // {@link https://mswjs.io/docs/extensions/life-cycle-events#events}
      mockServer.events.on('request:match', (req) => {
        console.info('request:match', req);
      });

      mockServer.events.removeAllListeners();
      await mockServer.start({
        onUnhandledRequest: 'bypass',
      });
      mockServer.printHandlers();
    }
  }
}

async function initial() {
  await waitForMockServiceWorkerStart();
  await registerGlobalPlugin(app);
  registerGlobalDirective(app);
  registerLayoutComponent(app);
  registerGlobalComponent(app);
  if (!import.meta.env.PROD) {
    if (import.meta.env.VITE_TEST_E2E) {
      const authStore = useAuthStore();

      // Attach the store to the window, which can be useful
      // for manually setting state in Cypress commands
      // such as `cy.logIn()`.
      window.authStore = authStore;
    }
  }
  app.mount('#app');
}
initial();
