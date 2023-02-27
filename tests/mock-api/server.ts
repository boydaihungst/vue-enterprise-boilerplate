import { setupServer } from 'msw/node';
import { handlers } from './index';

/**
 * Run on node environment. Like run with vitest, jest jsdom
 */
export const mockServer = setupServer(...handlers);
