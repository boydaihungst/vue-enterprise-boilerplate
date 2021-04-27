// Register each file as a corresponding Vuex module. Module nesting
// will mirror [sub-]directory hierarchy and modules are namespaced
// as the camelCase equivalent of their file name.

import camelCase from 'lodash/camelCase';
import { ModuleTree } from 'vuex';
import requireContext from 'require-context.macro';
import type { DeepRequired } from 'utility-types';
import type { RootState } from '../index';

const modulesCache: Record<string, any> = {};
const storeData: { modules: DeepRequired<ModuleTree<RootState>> } = {
  modules: {},
};

function updateModules() {
  // Allow us to dynamically require all Vuex module files.
  // https://webpack.js.org/guides/dependency-management/#require-context

  // Load all modules/../index.ts file
  const moduleContext = requireContext(
    '.',
    true,
    /^(?!.+\.(?:unit.ts$)).*\.ts$/
  );
  // For every Vuex module...
  moduleContext.keys().forEach((fileName) => {
    const moduleDefinition =
      moduleContext(fileName).default || moduleContext(fileName);

    // Skip the module during hot reload if it refers to the
    // same module definition as the one we have cached.
    if (
      modulesCache[fileName] === moduleDefinition ||
      !fileName.match(/.*index.ts$/)
    )
      return;

    // Update the module cache, for efficient hot reloading.
    modulesCache[fileName] = moduleDefinition;
    // Get the module path as an array.
    const modulePath = fileName
      // Remove the "./" from the beginning.
      .replace(/^\.\//, '')
      // Remove the file extension from the end.
      // .replace(/\.\w+$/, '')
      // remove index.ts
      .replace(/\/index\.(ts|js)\b$/, '')
      // Split nested modules into an array path.
      .split(/\//)
      // camelCase all module namespaces and names.
      .map(camelCase);

    // Get the modules object for the current path.
    const { modules } = getNamespace(storeData, modulePath);

    // Add the module to our modules object.
    modules[modulePath.pop() as string] = {
      // Modules are namespaced by default.
      namespaced: true,
      ...moduleDefinition,
    };
  });
  // If the environment supports hot reloading...
  if (module.hot) {
    // Whenever any Vuex module is updated...
    module.hot.accept(moduleContext.id, () => {
      // Update `storeData.modules` with the latest definitions.
      updateModules();
      // Trigger a hot update in the store.
      import('../store').then(({ store }) => {
        store.hotUpdate({
          modules: storeData.modules,
        });
      });
    });
  }
}
updateModules();

// Recursively get the namespace of a Vuex module, even if nested.
function getNamespace(
  subtree: ModuleTree<RootState>,
  path: string[]
): ModuleTree<RootState> {
  if (path.length === 1) return subtree;

  const namespace = path.shift() as string;
  (subtree.modules as any)[namespace] = {
    modules: {},
    namespaced: true,
    ...(subtree.modules as any)[namespace],
  };
  return getNamespace(subtree.modules[namespace], path);
}

export default storeData.modules;
