import faker from 'faker';
import { mockServer } from '../mock-api/server';
faker.locale = 'en';

// Start the mock api serivce
beforeAll(() => {
  mockServer.listen();
  // Print all request handlers
  // mockServer.printHandlers();
});

/**
 * Reset alll handler to initial state
 * {@link https://mswjs.io/docs/api/setup-server/reset-handlers}
 */
afterEach(async () => {
  mockServer.resetHandlers();
});

// Shut down the mock API once all the tests are complete.
afterAll(() => {
  mockServer.close();
});
