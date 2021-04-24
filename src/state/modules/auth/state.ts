import { User } from '@models/user';
// ==== Automation import: Import Type ==== //
// ==== Dont remove comment of this section ==== //

export type State = {
  [nestedModule: string]: any;
  currentUser: User | null;
};

export const state: State = {
  currentUser: null,
};

// ==== Automation import: Namespaced Type ==== //
export type NamespaceState = State;
// ==== Dont remove comment of this section ==== //
