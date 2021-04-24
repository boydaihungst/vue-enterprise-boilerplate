import { App, defineAsyncComponent } from 'vue';
import requireContext from 'require-context.macro';

export function getGlobalComponents() {
  // https://webpack.js.org/guides/dependency-management/#require-context
  const requireComponent = requireContext('.', false, /_base-[\w-]+\.vue$/);
  return requireComponent.keys().map((fileName) => {
    // Get the PascalCase version of the component name
    const componentName = fileName
      // Remove the "./_" from the beginning
      .replace(/^\.\/_/, '')
      // Remove the file extension from the end
      .replace(/\.\w+$/, '')
      // Split up kebabs
      .split('-')
      // Upper case
      .map((kebab) => kebab.charAt(0).toUpperCase() + kebab.slice(1))
      // Concatenated
      .join('');

    return {
      name: componentName,
      path: fileName.replace(/^\.\//, ''),
    };
  });
  // case test with jest
}

export function registerGlobalComponent(app: App<Element>) {
  const listGlobalComponent = getGlobalComponents();
  listGlobalComponent.forEach((component) =>
    app.component(
      component.name,
      defineAsyncComponent(() => import(`./${component.path}`))
    )
  );
}
