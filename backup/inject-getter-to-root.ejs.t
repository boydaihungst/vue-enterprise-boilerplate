---
inject: true
to: src/state/index.ts
after: "RootGetters ="
---
<%= h.changeCase.pascal(moduleName) %>GettersNamespaced &
