---
to: "src/router/views/<%= h.changeCase.kebab(name) %>.unit.ts"
---
<%
  const fileName = h.changeCase.kebab(name)
  const importName = h.changeCase.pascal(fileName)
%>
import <%= importName %> from './<%= fileName %>.vue';
describe('@views/<%= fileName %>', () => {
  it('is a valid view', () => {
    expect(<%= importName %>).toBeAViewComponent();
  });
  it.todo('todo test');
});
