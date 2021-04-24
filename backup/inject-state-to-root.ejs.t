---
inject: true
to: "<%= isNestedModule ? null : `src/state/${index}.ts` %>"
after: "RootState = {"
---
  [<%= h.changeCase.snake(moduleName).toUpperCase() %>_MODULE_NAME]: <%= h.changeCase.pascal(moduleName) %>States;
