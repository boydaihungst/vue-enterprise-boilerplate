---
to: "src/router/layouts/<%= h.changeCase.kebab(name) %>.unit.ts"
---
<%
  const fileName = h.changeCase.kebab(name)
  const importName = h.changeCase.pascal(fileName) + 'Layout'
%>
import <%= importName %> from './<%= fileName %>.vue';

describe('@layouts/<%= fileName %>', () => {
  it('renders its content', () => {
    const slotContent = '<p>Hello!</p>';
    const { element } = shallowMount(<%= importName %>, {
      slots: {
        default: {
          render() {
            return slotContent;
          },
        },
      },
    });
    expect(element.innerHTML).toContain(slotContent);
  });
  it.todo('todo test');
});
