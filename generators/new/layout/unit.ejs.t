---
to: "src/router/layouts/<%= h.changeCase.kebab(name) %>.unit.ts"
---
<%
  const fileName = h.changeCase.kebab(name)
  const importName = h.changeCase.pascal(fileName) + 'Layout'
%>import <%= importName %> from './<%= fileName %>.vue';

describe('@layouts/<%= fileName %>', () => {
  it('renders its content', () => {
    const slotContent = 'Hello!';
    const wrapper = shallowMount(<%= importName %>, {
      slots: {
        default: {
          render() {
            return slotContent;
          },
        },
      },
    });
    expect(wrapper.get('[data-test="<%= fileName %>-container"]').html()).toContain(
      slotContent
    );
  });
  it.todo('should be implemented');
});
