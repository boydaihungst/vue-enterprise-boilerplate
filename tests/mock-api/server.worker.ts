import { setupWorker } from 'msw';
import { handlers } from './index';
/**
 * This will run as web service worker for browser environment like vite dev server.
 * Useful when development without backend
 */
export const mockServer = setupWorker(...handlers);
