---
inject: true
to: src/state/index.ts
after: "RootActions ="
---
<%= h.changeCase.pascal(moduleName) %>ActionsNamespaced &
