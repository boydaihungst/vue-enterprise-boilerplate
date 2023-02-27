// fake data for testing
import { faker } from '@faker-js/faker';
import { mockServer } from '@tests/mock-api/server';
import { afterEach, beforeAll } from 'vitest';
faker.locale = 'en';
// Start the mock api serivce
beforeAll(() => {
  mockServer.listen({
    onUnhandledRequest: 'bypass',
  });

  // Shut down the mock API once all the tests are complete.

  return () => {
    mockServer.close();
  };
});

/**
 * Reset all handler to initial state
 * {@link https://mswjs.io/docs/api/setup-server/reset-handlers}
 */
afterEach(async () => {
  mockServer.resetHandlers();
  // clear storage because we mock pinia store
  // and run action init() which will load user info from localStorage
  window.localStorage.clear();
  // clear mock data
  vi.clearAllMocks();
});
