---
to: src/state/modules/<%= modulePath %>/state.ts
---
// ==== Automation import: Import Type ==== //
// ==== Dont remove comment of this section ==== //

export type State = {
  [nestedModule: string]: any;
  sampleState: string | null;
};

export const state: State = {
  sampleState: null,
};

// ==== Automation import: Namespaced Type ==== //
export type NamespaceState = State;
// ==== Dont remove comment of this section ==== //
