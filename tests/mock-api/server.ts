import { setupServer } from 'msw/node';
import userHandlers from './routers/users';
import authHandlers from './routers/auth';

/**
 * Run on node environment. Like run with jest unit test
 */
export const mockServer = setupServer(...authHandlers, ...userHandlers);
