---
to: src/state/modules/<%= modulePath %>/<%= moduleName %>.unit.ts
---
<%
  const importName = h.changeCase.camel(moduleName) + 'Module'
%>import <%= importName %> from './index';

describe('@state/modules/<%= modulePath %>/<%= moduleName %>', () => {
  it('exports a valid Vuex module', () => {
    expect(<%= importName %>).toBeAVuexModule();
  });
  it.todo('should be implemented');
});
