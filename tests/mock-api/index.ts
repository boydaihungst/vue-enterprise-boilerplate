import authHandlers from './routers/auth';
import userHandlers from './routers/users';

export const handlers = [...authHandlers, ...userHandlers];
