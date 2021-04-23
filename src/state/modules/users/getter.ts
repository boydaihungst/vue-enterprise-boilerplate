type Getters = {
  //
};

export const getters: Getters = {
  //
};

export type LocalGetters = {
  [K in keyof Getters]: ReturnType<Getters[K]>;
};
