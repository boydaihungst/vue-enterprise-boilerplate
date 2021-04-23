---
to: src/state/modules/<%= h.changeCase.kebab(name).toLowerCase() %>/state.ts
---
export type State = {
  testState: string | null;
};

export const state: State = {
  testState: null,
};
