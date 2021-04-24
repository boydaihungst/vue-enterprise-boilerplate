---
inject: true
to: src/state/index.ts
before: ^\/\/#region RootType
---
//#region <%= h.changeCase.pascal(moduleName) %>
type <%= h.changeCase.pascal(moduleName) %>GettersNamespaced = Namespaced<<%= h.changeCase.pascal(moduleName) %>Getters, typeof <%= h.changeCase.snake(moduleName).toUpperCase() %>_MODULE_NAME>;
type <%= h.changeCase.pascal(moduleName) %>MutationsNamespaced = Namespaced<
  <%= h.changeCase.pascal(moduleName) %>Mutations,
  typeof <%= h.changeCase.snake(moduleName).toUpperCase() %>_MODULE_NAME
>;
type <%= h.changeCase.pascal(moduleName) %>ActionsNamespaced = Namespaced<<%= h.changeCase.pascal(moduleName) %>Actions, typeof <%= h.changeCase.snake(moduleName).toUpperCase() %>_MODULE_NAME>;
//#endregion
