import { User } from '@models/user';

export type State = {
  currentUser: User | null;
};

export const state: State = {
  currentUser: null,
};
