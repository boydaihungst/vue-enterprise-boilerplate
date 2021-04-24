---
inject: true
to: src/state/index.ts
prepend: true
---
import {
  <%= h.changeCase.pascal(moduleName) %>Getters,
  <%= h.changeCase.pascal(moduleName) %>States,
  <%= h.changeCase.pascal(moduleName) %>Mutations,
  <%= h.changeCase.pascal(moduleName) %>Actions,
  <%= h.changeCase.pascal(moduleName).toUpperCase() %>_MODULE_NAME,
} from './modules/<%= modulePath %>';
