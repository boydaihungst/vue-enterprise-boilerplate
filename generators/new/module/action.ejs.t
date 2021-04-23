---
to: src/state/modules/<%= h.changeCase.kebab(name).toLowerCase() %>/action.ts
---
import { AugmentedActionContext } from 'vuex';
import { State as LocalState } from './state';
import { LocalMutations } from './mutation';
import { LocalGetters } from './getter';

type Actions = {
  init(context: ActionContext, payload?: null): Promise<void>;
};

export const actions: Actions = {
  /**
   *
   */
  async init({ state, dispatch, commit }) {
    //
  },
};

export type LocalActions = NotNameSpaced<Actions>;
type ActionContext = AugmentedActionContext<
  LocalMutations,
  LocalActions,
  LocalGetters,
  LocalState
>;
