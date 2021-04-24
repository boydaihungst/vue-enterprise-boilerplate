const fs = require('fs');
const path = require('path');
const { camel, pascal, snake } = require('change-case');

/**
 *
 * @param {string} relativePathToWorkspace
 * @param  {Object[]} injectDatas
 * @param  {RegExp | string} injectDatas.matchString
 * @param  {string} injectDatas.replaceWith
 */
function injectStringIntoFile(relativePathToWorkspace, ...injectDatas) {
  const filePath = path.resolve(process.cwd(), relativePathToWorkspace);
  if (!fs.existsSync(filePath))
    throw new Error('File to be injected not found');
  let fileOriginContent = fs.readFileSync(filePath, 'utf8');

  injectDatas.forEach((data) => {
    fileOriginContent = fileOriginContent.replace(
      data.matchString,
      data.replaceWith
    );
  });
  fs.writeFileSync(filePath, fileOriginContent);
}

let moduleInfo = {};
process.argv.forEach((val, index) => {
  if (index > 1) {
    const [key, value] = val.split('=');
    moduleInfo[key] = value;
  }
});

const rootStatePath = `src/state/index.ts`;
const parentModulePath = `src/state/modules/${moduleInfo.parentModulePath}/state.ts`;
const isNestedModule = !!moduleInfo.parentModulePath;
if (isNestedModule) {
  // Modify parent: Import Type
  injectStringIntoFile(parentModulePath, {
    matchString: /\/\/ ==== Automation import: Import Type ==== \/\//,
    replaceWith: `// ==== Automation import: Import Type ==== //
import { ${pascal(moduleInfo.moduleName)}States } from './${camel(
      moduleInfo.moduleName
    )}';`,
  });

  // Modify parent: Namespaced Type
  injectStringIntoFile(parentModulePath, {
    matchString: /export type NamespaceState = State/,
    replaceWith: `export type NamespaceState = State & { ${camel(
      moduleInfo.moduleName
    )}?: ${pascal(moduleInfo.moduleName)}States }`,
  });
} else {
  // Add root: Root Type
  injectStringIntoFile(rootStatePath, {
    matchString: /export type RootState = /,
    replaceWith: `export type RootState = {
    [${snake(moduleInfo.moduleName).toUpperCase()}_MODULE_NAME]: ${pascal(
      moduleInfo.moduleName
    )}States;
  } & `,
  });
}

// Add root: Import Type
injectStringIntoFile(rootStatePath, {
  matchString: /\/\/ ==== Automation import: Import Type ==== \/\//,
  replaceWith: `// ==== Automation import: Import Type ==== //
import {
  ${pascal(moduleInfo.moduleName)}Getters,${
    !isNestedModule ? '\n  ' + pascal(moduleInfo.moduleName) + 'States,' : ''
  }
  ${pascal(moduleInfo.moduleName)}Mutations,
  ${pascal(moduleInfo.moduleName)}Actions,
  ${snake(moduleInfo.moduleName).toUpperCase()}_MODULE_NAME,
} from './modules/${moduleInfo.modulePath}';
`,
});
// Add root: Namespaced Type
injectStringIntoFile(rootStatePath, {
  matchString: /\/\/ ==== Automation import: Namespaced Type ==== \/\//,
  replaceWith: `// ==== Automation import: Namespaced Type ==== //
//#region ${pascal(moduleInfo.moduleName)}
type ${pascal(moduleInfo.moduleName)}GettersNamespaced = Namespaced<${pascal(
    moduleInfo.moduleName
  )}Getters, typeof ${snake(moduleInfo.moduleName).toUpperCase()}_MODULE_NAME>;
type ${pascal(moduleInfo.moduleName)}MutationsNamespaced = Namespaced<${pascal(
    moduleInfo.moduleName
  )}Mutations, typeof ${snake(moduleInfo.moduleName).toUpperCase()}_MODULE_NAME
>;
type ${pascal(moduleInfo.moduleName)}ActionsNamespaced = Namespaced<${pascal(
    moduleInfo.moduleName
  )}Actions, typeof ${snake(moduleInfo.moduleName).toUpperCase()}_MODULE_NAME>;
//#endregion
  `,
});

// Add root: Root Type
injectStringIntoFile(
  rootStatePath,
  {
    matchString: /export type RootGetters = /,
    replaceWith: `export type RootGetters = ${pascal(
      moduleInfo.moduleName
    )}GettersNamespaced & `,
  },
  {
    matchString: /export type RootMutations = /,
    replaceWith: `export type RootMutations = ${pascal(
      moduleInfo.moduleName
    )}MutationsNamespaced & `,
  },
  {
    matchString: /export type RootActions = /,
    replaceWith: `export type RootActions = ${pascal(
      moduleInfo.moduleName
    )}ActionsNamespaced & `,
  }
);
