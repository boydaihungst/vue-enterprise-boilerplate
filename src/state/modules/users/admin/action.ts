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
  async init() {
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
