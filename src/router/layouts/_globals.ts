import { defineAsyncComponent, type App, type Component } from 'vue';

export function getGlobalViewLayoutAll() {
  // import all layout files in this directory
  // https://vitejs.dev/guide/features.html#glob-import
  // https://github.com/mrmlnc/fast-glob#pattern-syntax
  const layoutComponentObject: Record<string, () => Promise<Component>> =
    import.meta.glob(['./*.vue']);

  return Object.entries(layoutComponentObject).map(
    ([filePath, componentAsyncLoader]) => {
      // Get the PascalCase version of the component name
      // example: filePath = ./mobile-landscape.vue -> MobileLandscape
      const componentName: string = filePath
        .replace(/^\.\//, '')
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
 * Register layout globally with lazy loading
 * @param app - Vue app instance
 */
export function registerLayoutComponent(app: App<Element>) {
  const listGlobalViewLayout = getGlobalViewLayoutAll();

  listGlobalViewLayout.forEach((component) =>
    app.component(component.name, defineAsyncComponent(component.asyncLoader)),
  );
}
