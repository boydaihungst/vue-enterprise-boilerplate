import faker from 'faker';
import { mockServer } from '../mock-api/server';
faker.locale = 'en';

beforeAll(() => {
  mockServer.listen();
  // mockServer.printHandlers();
});
afterEach(async () => {
  mockServer.resetHandlers();
});
afterAll(() => {
  mockServer.close();
});
