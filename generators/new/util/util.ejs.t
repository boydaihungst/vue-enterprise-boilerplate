---
to: "src/utils/<%= h.changeCase.kebab(name) %>.ts"
---
<%
  const fileName = h.changeCase.kebab(name)
  const importName = h.changeCase.camel(fileName)
%>export default function <%= importName %>() {
  return 'hello';
}
