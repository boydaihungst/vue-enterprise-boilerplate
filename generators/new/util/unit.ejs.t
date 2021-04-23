---
to: "src/utils/<%= h.changeCase.kebab(name) %>.unit.ts"
---
<%
  const fileName = h.changeCase.kebab(name)
  const importName = h.changeCase.camel(fileName)
%>import <%= importName %> from './<%= fileName %>';


describe('@utils/<%= fileName %>', () => {
  it.todo('todo test');
});
