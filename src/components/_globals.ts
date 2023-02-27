import { defineAsyncComponent, type App, type Component } from 'vue';

export function getGlobalComponents() {
  // import all component files in this directory
  // https://vitejs.dev/guide/features.html#glob-import
  // https://github.com/mrmlnc/fast-glob#pattern-syntax
  const componentObject: Record<string, () => Promise<Component>> =
    import.meta.glob(['./_base-*.vue']);

  return Object.entries(componentObject).map(
    ([filePath, componentAsyncLoader]) => {
      // Get the PascalCase version of the component name
      // example: filePath = ./_base-icon.vue -> BaseIcon
      const componentName: string = filePath
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
        asyncLoader: componentAsyncLoader,
      };
    },
  );
}

/**
 * Register component globally with lazy loading
 * @param app - Vue app instance
 */
export function registerGlobalComponent(app: App<Element>) {
  const listGlobalComponent = getGlobalComponents();

  listGlobalComponent.forEach((component) =>
    app.component(component.name, defineAsyncComponent(component.asyncLoader)),
  );
}
