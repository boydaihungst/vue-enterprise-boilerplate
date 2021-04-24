const fs = require('fs');
const path = require('path');
const { kebab, snake } = require('change-case');

function tranformModulePath(path) {
  return path
    .replace(/\/+/g, '/') // replace multiple '//..' with single '/' then  trim `/`
    .replace(/^\/+|\/+$/g, '')
    .split('/') // split folder by /
    .map((moduleName) => kebab(moduleName).toLocaleLowerCase())
    .join('/');
}

function extractModuleInfoFromName(name) {
  // name: kebab
  let isNestedModule = name.includes('/');
  let modulePath = name; // kebab
  let moduleName = name; // kebab
  let parentModuleName = ''; // snake case
  let parentModulePath = ''; // kebab

  if (isNestedModule) {
    parentModulePath = name.substring(0, name.lastIndexOf('/'));
    parentModuleName =
      snake(
        parentModulePath.substring(parentModulePath.lastIndexOf('/'))
      ).toUpperCase() + '_MODULE_NAME';
    moduleName = name.substring(name.lastIndexOf('/') + 1);
  }
  if (
    !fs.existsSync(
      path.resolve(process.cwd(), `src/state/modules/${parentModulePath}`)
    )
  )
    throw Error('Parent module not found!');
  return {
    moduleName,
    modulePath,
    parentModulePath,
    parentModuleName,
    isNestedModule,
  };
}

module.exports = {
  prompt: async ({ prompter, args }) => {
    if (args.name)
      return extractModuleInfoFromName(tranformModulePath(args.name));
    const name = await prompter.prompt({
      type: 'input',
      name: 'name',
      message: 'Name:',
      result: (name) => tranformModulePath(name),
      validate(value) {
        if (!value.length) {
          return 'Vuex modules must have a name.';
        }
        return true;
      },
    });
    return extractModuleInfoFromName(name);
  },
};
