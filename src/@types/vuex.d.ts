import { RootState, RootGetters, RootActions, RootMutations } from '@state';

declare global {
  type Namespaced<T, N extends string, D extends string = '/'> = {
    [P in keyof T & string as `${N}${D}${P}`]: T[P];
  };

  type NotNameSpaced<T> = {
    [P in keyof T & string as `${P}`]: T[P];
  };
}
declare module 'vuex' {
  type AugmentedActionContext<
    LocalMutations extends Record<string, (...args: any[]) => any>,
    LocalActions extends Record<string, (...args: any[]) => any>,
    LocalGetters,
    LocalState
  > = {
    commit<K extends keyof (LocalMutations & RootMutations)>(
      key: K,
      payload: Parameters<
        K extends keyof LocalMutations
          ? LocalMutations[K]
          : K extends keyof RootMutations
          ? RootMutations[K]
          : never
      >[1],
      options?: CommitOptions
    ): ReturnType<
      K extends keyof LocalMutations
        ? LocalMutations[K]
        : K extends keyof RootMutations
        ? RootMutations[K]
        : never
    >;
    dispatch<K extends keyof (LocalActions & RootActions)>(
      key: K,
      payload?: Parameters<
        K extends keyof LocalActions
          ? LocalActions[K]
          : K extends keyof RootActions
          ? RootActions[K]
          : never
      >[1],
      options?: DispatchOptions
    ): ReturnType<
      K extends keyof LocalActions
        ? LocalActions[K]
        : K extends keyof RootActions
        ? RootActions[K]
        : never
    >;
    getters: LocalGetters;
    rootState: RootState;
    rootGetters: RootGetters;
  } & Pick<ActionContext<LocalState, RootState>, 'state'>;

  // Use this instead of Store from vuex
  type VuexStore<
    State,
    Getter,
    Actions extends Record<string, (...args: any[]) => any>,
    Mutations extends Record<string, (...args: any[]) => any>
  > = Omit<Store<State>, 'getters' | 'commit' | 'dispatch'> & {
    commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
      key: K,
      payload: P,
      options?: CommitOptions
    ): ReturnType<Mutations[K]>;
  } & {
    dispatch<K extends keyof Actions>(
      key: K,
      payload?: Parameters<Actions[K]>[1],
      options?: DispatchOptions
    ): ReturnType<Actions[K]>;
  } & {
    getters: {
      [K in keyof Getter]: Getter[K] extends (...args: any) => any
        ? ReturnType<Getter[K]>
        : Getter[K];
    };
  };

  // Use this instead of StoreOptions from vuex
  interface VuexStoreOptions<S, G, A, M> {
    state?: S | (() => S);
    getters?: G;
    actions?: A;
    mutations?: M;
    modules?: ModuleTree<S>;
    plugins?: Plugin<S>[];
    strict?: boolean;
    devtools?: boolean;
  }
}
