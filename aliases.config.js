const path = require('path');
const fs = require('fs');
const prettier = require('prettier');

const aliases = {
  '@': '.',
  '@src': './src',
  '@router': './src/router',
  '@views': './src/router/views',
  '@layouts': './src/router/layouts',
  '@components': './src/components',
  '@assets': './src/assets',
  '@utils': './src/utils',
  '@state': './src/state',
  '@design': './src/design/index.scss',
  // custom
  '@plugin': './src/plugin',
  '@models': './src/models',
};

module.exports = {
  webpack: {},
  jest: {},
  tsconfig: {},
};

for (const alias in aliases) {
  const aliasTo = aliases[alias];
  module.exports.webpack[alias] = resolveSrc(aliasTo);
  const aliasHasExtension = /\.\w+$/.test(aliasTo);
  module.exports.jest[`^${alias}$`] = aliasHasExtension
    ? `<rootDir>/${aliasTo}`
    : `<rootDir>/${aliasTo}/index.ts`;
  module.exports.jest[`^${alias}/(.*)$`] = `<rootDir>/${aliasTo}/$1`;
  module.exports.tsconfig[alias + '/*'] = [aliasTo + '/*'];
  module.exports.tsconfig[alias] = aliasTo.includes('/index.')
    ? [aliasTo]
    : [
        aliasTo + '/index.ts',
        aliasTo + '/index.json',
        aliasTo + '/index.vue',
        aliasTo + '/index.scss',
        aliasTo + '/index.css',
      ];
}

const tsconfigTemplate = require('./tsconfig.template') || {};
const tsconfigPath = path.resolve(__dirname, 'tsconfig.json');
try {
  fs.writeFileSync(
    tsconfigPath,
    prettier.format(
      JSON.stringify({
        ...tsconfigTemplate,
        compilerOptions: {
          ...(tsconfigTemplate.compilerOptions || {}),
          paths: module.exports.tsconfig,
        },
      }),
      {
        ...require('./.prettierrc'),
        parser: 'json',
      }
    ),
    { encoding: 'utf-8' }
  );
} catch (error) {
  if (error) {
    console.error('Error while creating tsconfig.tson from aliases.config.js.');
    throw error;
  }
}

function resolveSrc(_path) {
  return path.resolve(__dirname, _path);
}
