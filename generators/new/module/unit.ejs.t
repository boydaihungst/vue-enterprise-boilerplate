---
to: src/state/modules/<%= h.changeCase.kebab(name).toLowerCase() %>/<%= h.changeCase.kebab(name).toLowerCase() %>.unit.ts
---
<%
  const fileName = h.changeCase.kebab(name).toLowerCase()
  const importName = h.changeCase.camel(fileName) + 'Module'
%>

import <%= importName %> from './index';

describe('@state/modules/<%= h.changeCase.kebab(name).toLowerCase() %>/<%= fileName %>', () => {
  it('exports a valid Vuex module', () => {
    expect(<%= importName %>).toBeAVuexModule();
  });
  it.todo('todo test');
});
