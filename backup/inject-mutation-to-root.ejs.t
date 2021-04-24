---
inject: true
to: src/state/index.ts
after: "RootMutations ="
---
<%= h.changeCase.pascal(moduleName) %>MutationsNamespaced &
