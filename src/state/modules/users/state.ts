import { User } from '@models/user';
// ==== Automation import: Import Type ==== //
import { AdminStates } from './admin';
// ==== Dont remove comment of this section ==== //

export type State = {
  [nestedModule: string]: any;
  cached: User[];
};

export const state: State = {
  cached: [],
};

// ==== Automation import: Namespaced Type ==== //
export type NamespaceState = State & { admin?: AdminStates };
// ==== Dont remove comment of this section ==== //
