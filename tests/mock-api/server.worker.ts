import { setupWorker } from 'msw';
import userHandlers from './routers/users';
import authHandlers from './routers/auth';
/**
 * This will run as web service worker for browser.
 * Useful when development without backend
 */
export const mockServer = setupWorker(...authHandlers, ...userHandlers);
