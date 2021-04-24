import userHandlers from './routers/users';
import authHandlers from './routers/auth';

export const handlers = [...authHandlers, ...userHandlers];
