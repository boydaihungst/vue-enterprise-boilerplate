import { User } from '@models/user';

export type State = {
  cached: User[];
};

export const state: State = {
  cached: [],
};
